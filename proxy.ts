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
    path.startsWith("/assets")
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
    // Let API calls through unchanged on chat subdomain
    if (path.startsWith("/api")) {
      return NextResponse.next();
    }

    // ============= AUTH LOGIC FOR CHAT ROOMS =============
    const firstSegment = path.split("/")[1] || "";

    // Only treat as a room when it's not the chat home, create, or api
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

        if (meta.connected.length >= 2) {
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

        await redis.hset(`meta:${roomId}`, {
          connected: [...meta.connected, token],
        });

        return response;
      } catch (error) {
        console.error("Redis error in middleware:", error);
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
