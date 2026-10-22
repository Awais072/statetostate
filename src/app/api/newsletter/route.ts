import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const normalized = email.trim().toLowerCase();

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalized },
    });

    if (existing) {
      return NextResponse.json(
        { message: "You are already subscribed to our newsletter." },
        { status: 200 }
      );
    }

    await prisma.newsletterSubscriber.create({
      data: { email: normalized },
    });

    return NextResponse.json(
      { success: true, message: "Subscription confirmed." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json(
      { error: "Failed to process newsletter subscription" },
      { status: 500 }
    );
  }
}
