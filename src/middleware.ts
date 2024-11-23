import { NextResponse, type NextRequest } from "next/server";
import { session } from "./lib/auth";

export async function middleware(req: NextRequest) {
  const { name } = await session();
    
  if (req.nextUrl.pathname === "/") {
    if (name)
      return NextResponse.redirect(new URL("/view", req.url));
  } else if (!name) {
    if (req.nextUrl.pathname !== "/auth")
      return NextResponse.redirect(new URL("/auth", req.url));
  }
  return NextResponse.next();
}
