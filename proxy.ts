import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { redis } from "./lib/redis"; // Adjust path as needed
import { nanoid } from "nanoid";

export async function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";
  const path = url.pathname;

  // Skip middleware for static assets
  if (
    path.startsWith("/_next") ||
    path.startsWith("/static") ||
    path === "/favicon.ico" ||
    path.startsWith("/assets") ||
    path.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  const parts = host.split(".");

  // ============= DOCS SUBDOMAIN LOGIC =============
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

  // ============= CHAT SUBDOMAIN LOGIC =============
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
    // ============= AUTH LOGIC FOR CHAT ROOMS =============
    // Check if the path matches a room pattern: /roomid or /roomid/...
    const roomMatch = path.match(/^\/([^/]+)/);

    // If it's a room path (not just chat.domain/ or chat.domain/create etc.)
    if (roomMatch && path !== "/" && !path.startsWith("/create")) {
      const roomId = roomMatch[1];

      try {
        // Check if room exists in Redis
        const meta = await redis.hgetall<{
          connected: string[];
          createdAt: number;
        }>(`meta:${roomId}`);

        if (!meta || !meta.connected) {
          // Room doesn't exist - redirect to main chat page with error
          url.hostname = `chat.${mainDomainForChat}`;
          url.pathname = "/";
          url.searchParams.set("error", "room-not-found");
          return NextResponse.redirect(url, 302);
        }

        const existingToken = req.cookies.get("x-auth-token")?.value;

        // USER IS ALLOWED TO JOIN ROOM (already has token and is connected)
        if (existingToken && meta.connected.includes(existingToken)) {
          const internal = `/chat${path === "/" ? "" : path}`;
          url.pathname = internal;
          return NextResponse.rewrite(url);
        }

        // USER IS NOT ALLOWED TO JOIN (room is full)
        if (meta.connected.length >= 2) {
          url.hostname = `chat.${mainDomainForChat}`;
          url.pathname = "/";
          url.searchParams.set("error", "room-full");
          return NextResponse.redirect(url, 302);
        }

        // USER IS NEW - create token and add to room
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

        // Add token to connected users
        await redis.hset(`meta:${roomId}`, {
          connected: [...meta.connected, token],
        });

        return response;
      } catch (error) {
        console.error("Redis error in middleware:", error);
        // On error, allow the request through
        const internal = `/chat${path === "/" ? "" : path}`;
        url.pathname = internal;
        return NextResponse.rewrite(url);
      }
    }

    // For non-room paths on chat subdomain (like home, create, etc.)
    const internal = `/chat${path === "/" ? "" : path}`;
    url.pathname = internal;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
