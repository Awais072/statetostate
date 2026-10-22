import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CommentStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { postId, authorName, authorEmail, content } = await req.json();

    if (!postId || !authorName?.trim() || !authorEmail?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "Post ID, author name, email, and content are required." },
        { status: 400 }
      );
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ error: "Post does not exist" }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        authorName: authorName.trim(),
        authorEmail: authorEmail.trim().toLowerCase(),
        content: content.trim(),
        status: CommentStatus.APPROVED,
      },
    });

    return NextResponse.json({ success: true, comment }, { status: 201 });
  } catch (error) {
    console.error("Comment submission error:", error);
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}
