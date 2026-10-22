import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const userPayload = await getCurrentUser();
  if (!userPayload) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userPayload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
      },
    });

    if (user) {
      return NextResponse.json({ authenticated: true, user });
    }
  } catch (error) {
    console.error("Error fetching user in /api/auth/me:", error);
  }

  // Fallback to verified JWT payload if DB query is temporarily unreachable
  return NextResponse.json({
    authenticated: true,
    user: {
      id: userPayload.userId,
      email: userPayload.email,
      name: userPayload.name,
      role: userPayload.role,
      avatar: null,
      bio: null,
    },
  });
}
