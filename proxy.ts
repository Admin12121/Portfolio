import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";
  const path = url.pathname;

  // Skip static files
  if (
    path.startsWith("/_next") ||
    path.startsWith("/static") ||
    path === "/favicon.ico" ||
    path.startsWith("/assets")
  ) {
    return NextResponse.next();
  }

  const isRoot = host === "localhost:3000";
  const isDocs = host.startsWith("docs.localhost");

  // ---------------------------------------------------------
  // 1️⃣ ROOT DOMAIN → DOCS SUBDOMAIN
  // ---------------------------------------------------------
  if (isRoot && (path === "/docs" || path.startsWith("/docs/"))) {
    const clean = path.replace(/^\/docs/, "") || "/";
    url.hostname = "docs.localhost";
    url.pathname = clean;
    return NextResponse.redirect(url, 302);
  }

  // ---------------------------------------------------------
  // 2️⃣ DOCS SUBDOMAIN → CLEAN URL (NO /docs PREFIX IN URL)
  // ---------------------------------------------------------
  if (isDocs && path.startsWith("/docs")) {
    const clean = path.replace(/^\/docs/, "") || "/";
    url.pathname = clean;
    return NextResponse.redirect(url, 302); // IMPORTANT: fixes your issue
  }

  // ---------------------------------------------------------
  // 3️⃣ DOCS SUBDOMAIN → INTERNAL REWRITE TO /docs/*
  // ---------------------------------------------------------
  if (isDocs) {
    const internal = `/docs${path === "/" ? "" : path}`;
    url.pathname = internal;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
