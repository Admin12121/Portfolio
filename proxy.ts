import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { redis } from "./lib/redis";
import { nanoid } from "nanoid";
import { realtime } from "./lib/realtime";

export async function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";
  const path = url.pathname;

  if (
    path.startsWith("/_next") ||
    path.startsWith("/static") ||
    path === "/favicon.ico" ||
    path.startsWith("/assets")
  ) {
    return NextResponse.next();
  }

  const parts = host.split(".");

  const isDocsSub = parts[0] === "docs";
  const mainDomainForDocs = isDocsSub ? parts.slice(1).join(".") : host;

  if (isDocsSub && (path === "/docs" || path.startsWith("/docs/"))) {
    const clean = path.replace(/^\/docs/, "") || "/";
    url.hostname = `docs.${mainDomainForDocs}`;
    url.pathname = clean;
    return NextResponse.redirect(url, 302);
  }

  if (isDocsSub && path.startsWith("/docs")) {
    const clean = path.replace(/^\/docs/, "") || "/";
    url.pathname = clean;
    return NextResponse.redirect(url, 302);
  }

  if (isDocsSub) {
    const internal = `/docs${path === "/" ? "" : path}`;
    url.pathname = internal;
    return NextResponse.rewrite(url);
  }

  const isChatSub = parts[0] === "chat";
  const mainDomainForChat = isChatSub ? parts.slice(1).join(".") : host;

  if (isChatSub && (path === "/chat" || path.startsWith("/chat/"))) {
    const clean = path.replace(/^\/chat/, "") || "/";
    url.hostname = `chat.${mainDomainForChat}`;
    url.pathname = clean;
    return NextResponse.redirect(url, 302);
  }

  if (isChatSub && path.startsWith("/chat")) {
    const clean = path.replace(/^\/chat/, "") || "/";
    url.pathname = clean;
    return NextResponse.redirect(url, 302);
  }

  if (isChatSub) {
    if (path.startsWith("/api")) {
      return NextResponse.next();
    }

    const firstSegment = path.split("/")[1] || "";
    const isPotentialRoom =
      path !== "/" &&
      firstSegment !== "chat" &&
      firstSegment !== "create" &&
      firstSegment !== "api";

    if (isPotentialRoom) {
      const roomId = firstSegment;

      try {
        const meta = await redis.hgetall<{
          connected: string[];
          createdAt: number;
          adminToken?: string;
        }>(`meta:${roomId}`);

        if (!meta || !meta.connected) {
          url.hostname = `chat.${mainDomainForChat}`;
          url.pathname = "/";
          url.searchParams.set("error", "room-not-found");
          return NextResponse.redirect(url, 302);
        }

        const existingToken = req.cookies.get("x-auth-token")?.value;

        if (existingToken && meta.connected.includes(existingToken)) {
          const internal = `/chat${path === "/" ? "" : path}`;
          url.pathname = internal;
          return NextResponse.rewrite(url);
        }

        if (meta.connected.length >= 5) {
          url.hostname = `chat.${mainDomainForChat}`;
          url.pathname = "/";
          url.searchParams.set("error", "room-full");
          return NextResponse.redirect(url, 302);
        }

        const response = NextResponse.rewrite(
          new URL(`/chat${path === "/" ? "" : path}`, req.url),
        );

        const token = nanoid();
        response.cookies.set("x-auth-token", token, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        const nextConnected = [...meta.connected, token];
        const nextMeta: Record<string, unknown> = {
          connected: nextConnected,
          createdAt: meta.createdAt,
        };

        if (!meta.adminToken) {
          nextMeta["adminToken"] = token;
        } else {
          nextMeta["adminToken"] = meta.adminToken;
        }

        await redis.hset(`meta:${roomId}`, nextMeta);
        await realtime.channel(roomId).emit("chat.join", {});

        return response;
      } catch (error) {
        const internal = `/chat${path === "/" ? "" : path}`;
        url.pathname = internal;
        return NextResponse.rewrite(url);
      }
    }

    const internal = `/chat${path === "/" ? "" : path}`;
    url.pathname = internal;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
