import { redis } from "@/lib/redis";
import { Elysia } from "elysia";
import { nanoid } from "nanoid";
import { authMiddleware } from "./auth";
import { z } from "zod";
import { Message, realtime } from "@/lib/realtime";
import { cors } from "@elysiajs/cors";

const ROOM_TTL_SECONDS = 60 * 10;
const PRESENCE_ACTIVE_THRESHOLD_MS = 30_000; // 30 seconds to consider "active"
const PRESENCE_TTL_SKEW_BUFFER = 120; // keep presence keys alive a bit longer than room TTL

type MemberProfile = {
  displayName: string;
  username?: string;
  avatar?: string;
};

// Helpers
async function getMeta(roomId: string): Promise<{ connected: string[]; createdAt: number; adminToken?: string } | null> {
  const meta = await redis.hgetall<{ connected: string[]; createdAt: number; adminToken?: string }>(`meta:${roomId}`);
  return meta || null;
}

async function removeMember(roomId: string, token: string) {
  const meta = await getMeta(roomId);
  if (meta) {
    const nextConnected = (meta.connected || []).filter((t) => t !== token);
    const nextMeta: Record<string, unknown> = {
      connected: nextConnected,
      createdAt: meta.createdAt,
      adminToken: meta.adminToken,
    };
    await redis.hset(`meta:${roomId}`, nextMeta);
  }

  await redis.hdel(`members:${roomId}`, token);
  await redis.hdel(`presence:${roomId}`, token);

  await realtime.channel(roomId).emit("chat.leave", {});
}

const rooms = new Elysia({ prefix: "/room" })
  .post("/create", async () => {
    const roomId = nanoid();
    await redis.hset(`meta:${roomId}`, {
      connected: [],
      createdAt: Date.now(),
    });
    await redis.expire(`meta:${roomId}`, ROOM_TTL_SECONDS);
    return { roomId };
  })
  .use(authMiddleware)
  .post(
    "/profile",
    async ({ auth, body }) => {
      const { roomId, token } = auth;
      const { displayName, username, avatar } = body;

      const profile: MemberProfile = {
        displayName,
        ...(username ? { username } : {}),
        ...(avatar ? { avatar } : {}),
      };

      await redis.hset(`members:${roomId}`, { [token]: profile });

      // Initialize presence lastSeen
      await redis.hset(`presence:${roomId}`, { [token]: Date.now() });

      // Sync presence TTL with room meta TTL (with buffer)
      const remaining = await redis.ttl(`meta:${roomId}`);
      if (remaining > 0) {
        await redis.expire(`members:${roomId}`, remaining);
        await redis.expire(`presence:${roomId}`, Math.max(remaining, PRESENCE_ACTIVE_THRESHOLD_MS / 1000 + PRESENCE_TTL_SKEW_BUFFER));
      }

      await realtime.channel(roomId).emit("chat.join", {
        displayName,
        username,
        avatar,
      });

      return { ok: true };
    },
    {
      query: z.object({ roomId: z.string() }),
      body: z.object({
        displayName: z.string().min(1).max(100),
        username: z.string().max(100).optional(),
        avatar: z.string().url().optional(),
      }),
    },
  )
  .post(
    "/ping",
    async ({ auth }) => {
      const { roomId, token } = auth;
      // Update lastSeen for this token
      await redis.hset(`presence:${roomId}`, { [token]: Date.now() });
      // Keep TTL aligned (best effort)
      const remaining = await redis.ttl(`meta:${roomId}`);
      if (remaining > 0) {
        await redis.expire(`presence:${roomId}`, Math.max(remaining, PRESENCE_ACTIVE_THRESHOLD_MS / 1000 + PRESENCE_TTL_SKEW_BUFFER));
      }
      return { ok: true };
    },
    { query: z.object({ roomId: z.string() }) },
  )
  .get(
    "/ttl",
    async ({ auth }) => {
      const ttl = await redis.ttl(`meta:${auth.roomId}`);
      return { ttl: ttl > 0 ? ttl : 0 };
    },
    { query: z.object({ roomId: z.string() }) },
  )
  .get(
    "/is-admin",
    async ({ auth }) => {
      const meta = await getMeta(auth.roomId);
      const isAdmin = !!meta?.adminToken && meta.adminToken === auth.token;
      return { isAdmin };
    },
    { query: z.object({ roomId: z.string() }) },
  )
  .get(
    "/members",
    async ({ auth }) => {
      const meta = await getMeta(auth.roomId);
      const isAdmin = !!meta?.adminToken && meta.adminToken === auth.token;

      const profiles = await redis.hgetall<Record<string, MemberProfile>>(`members:${auth.roomId}`);
      const lastSeen = await redis.hgetall<Record<string, number>>(`presence:${auth.roomId}`);
      const now = Date.now();

      const list =
        profiles
          ? Object.entries(profiles).map(([token, p]) => {
              const seen = lastSeen?.[token] ?? 0;
              const active = now - seen <= PRESENCE_ACTIVE_THRESHOLD_MS;
              return {
                displayName: p.displayName,
                username: p.username,
                avatar: p.avatar,
                active,
                token: isAdmin ? token : undefined, // admin gets tokens for kick
              };
            })
          : [];

      return { members: list };
    },
    { query: z.object({ roomId: z.string() }) },
  )
  .post(
    "/kick",
    async ({ auth, body, set }) => {
      const { roomId, token } = auth;
      const meta = await getMeta(roomId);
      if (!meta) {
        set.status = 404;
        return { error: "Room not found" };
      }
      const isAdmin = meta.adminToken === token;
      if (!isAdmin) {
        set.status = 403;
        return { error: "Forbidden" };
      }

      const { targetToken } = body;
      if (targetToken === token) {
        set.status = 400;
        return { error: "Cannot kick yourself" };
      }
      if (!meta.connected.includes(targetToken)) {
        set.status = 400;
        return { error: "User not connected" };
      }

      await removeMember(roomId, targetToken);
      return { ok: true };
    },
    {
      query: z.object({ roomId: z.string() }),
      body: z.object({
        targetToken: z.string().min(1),
      }),
    },
  )
  .post(
    "/leave",
    async ({ auth }) => {
      const { roomId, token } = auth;
      await removeMember(roomId, token);
      return { ok: true };
    },
    { query: z.object({ roomId: z.string() }) },
  )
  .delete(
    "/",
    async ({ auth, set }) => {
      const meta = await getMeta(auth.roomId);
      if (!meta) {
        set.status = 404;
        return { error: "Room not found" };
      }
      const isAdmin = meta.adminToken === auth.token;
      if (!isAdmin) {
        set.status = 403;
        return { error: "Forbidden" };
      }

      await realtime
        .channel(auth.roomId)
        .emit("chat.destroy", { isDestroyed: true });

      await Promise.all([
        redis.del(auth.roomId),
        redis.del(`meta:${auth.roomId}`),
        redis.del(`messages:${auth.roomId}`),
        redis.del(`members:${auth.roomId}`),
        redis.del(`presence:${auth.roomId}`),
      ]);

      return { ok: true };
    },
    { query: z.object({ roomId: z.string() }) },
  );

const messages = new Elysia({ prefix: "/messages" })
  .use(authMiddleware)
  .post(
    "/",
    async ({ body, auth }) => {
      const { sender, text } = body;
      const { roomId, token } = auth;

      const roomExists = await redis.exists(`meta:${roomId}`);
      if (!roomExists) {
        throw new Error("Room does not exist");
      }

      const profile = await redis.hget<MemberProfile>(`members:${roomId}`, token);
      const displayName = profile?.displayName || sender;

      const message: Message = {
        id: nanoid(),
        sender,
        text,
        displayName,
        timestamp: Date.now(),
        roomId,
      };

      await redis.rpush(`messages:${roomId}`, {
        ...message,
        token: auth.token,
      });

      await realtime.channel(roomId).emit("chat.message", message);

      const remaining = await redis.ttl(`meta:${roomId}`);
      if (remaining > 0) {
        await redis.expire(`messages:${roomId}`, remaining);
        await redis.expire(`members:${roomId}`, remaining);
        await redis.expire(`presence:${roomId}`, Math.max(remaining, PRESENCE_ACTIVE_THRESHOLD_MS / 1000 + PRESENCE_TTL_SKEW_BUFFER));
      }
    },
    {
      query: z.object({ roomId: z.string() }),
      body: z.object({
        sender: z.string().max(100),
        text: z.string().max(1000),
      }),
    },
  )
  .get(
    "/",
    async ({ auth }) => {
      const messages = await redis.lrange<Message>(
        `messages:${auth.roomId}`,
        0,
        -1,
      );

      return {
        messages: messages.map((m) => ({
          ...m,
          token: m.token === auth.token ? auth.token : undefined,
        })),
      };
    },
    { query: z.object({ roomId: z.string() }) },
  );

const app = new Elysia({ prefix: "/api" })
  .use(
    cors({
      origin: (request) => {
        const origin = request.headers.get("origin");
        if (origin?.includes("localhost")) return true;
        if (origin?.includes("biki.com.np")) return true;
        return false;
      },
      credentials: true,
      methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    }),
  )
  .use(rooms)
  .use(messages);

export const GET = app.fetch;
export const POST = app.fetch;
export const DELETE = app.fetch;

export type App = typeof app;
