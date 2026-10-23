import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out" });

  // Invalidate and delete auth_token cookie
  response.cookies.set({
    name: "auth_token",
    value: "",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return response;
}

export async function GET() {
  return POST();
}
