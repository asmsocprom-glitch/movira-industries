import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isSupplierRoute = createRouteMatcher(["/supplier(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // 🔓 Allow sign-in routes ALWAYS
  if (req.nextUrl.pathname.startsWith("/sign-in")) {
    return;
  }

  if (isAdminRoute(req)) {
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    if (sessionClaims?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (isSupplierRoute(req)) {
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    if (sessionClaims?.role !== "supplier") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
});
