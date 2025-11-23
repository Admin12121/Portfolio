import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
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
  const mainDomain = isDocsSub ? parts.slice(1).join(".") : host;
  
  if (isDocsSub  && (path === "/docs" || path.startsWith("/docs/"))) {
    const clean = path.replace(/^\/docs/, "") || "/";
    url.hostname = `docs.${mainDomain}`;
    url.pathname = clean;
    return NextResponse.redirect(url, 302);
  }

  if (isDocsSub  && path.startsWith("/docs")) {
    const clean = path.replace(/^\/docs/, "") || "/";
    url.pathname = clean;
    return NextResponse.redirect(url, 302);
  }

  if (isDocsSub) {
    const internal = `/docs${path === "/" ? "" : path}`;
    url.pathname = internal;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
