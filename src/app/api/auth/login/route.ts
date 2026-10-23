import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { comparePassword, signToken, hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@statetostate.com").trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || "AdminPassword123!";

    let user: any = null;

    // 1. Try finding user in the database
    try {
      user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
    } catch (dbErr) {
      console.error("Database query failed in login:", dbErr);
    }

    // 2. If user exists in database, verify against DB passwordHash
    if (user) {
      const isValid = await comparePassword(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }
    } else if (normalizedEmail === adminEmail && password === adminPassword) {
      // 3. Fallback: Authenticate via primary configured environment admin credentials
      try {
        const passwordHash = await hashPassword(adminPassword);
        user = await prisma.user.upsert({
          where: { email: adminEmail },
          update: {},
          create: {
            email: adminEmail,
            name: process.env.ADMIN_NAME || "StateToState Admin",
            passwordHash,
            role: "ADMIN",
            bio: "Editor-in-Chief at StateToState.",
          },
        });
      } catch (upsertErr) {
        console.warn("Could not upsert admin user into database:", upsertErr);
        user = {
          id: "admin-master",
          email: adminEmail,
          name: process.env.ADMIN_NAME || "StateToState Admin",
          role: "ADMIN",
          avatar: null,
        };
      }
    } else {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Sign JWT
    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    });

    // Set HTTP-only Session Cookie (ephemeral: cleared when browser/session ends)
    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login" },
      { status: 500 }
    );
  }
}
