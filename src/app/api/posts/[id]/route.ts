import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { slugify } from "@/lib/slugify";
import { calculateReadingTime } from "@/lib/reading-time";
import { PostStatus } from "@prisma/client";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        category: true,
        author: true,
        tags: { include: { tag: true } },
        comments: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: RouteContext) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const body = await req.json();
    const {
      title,
      slug: customSlug,
      excerpt,
      content,
      coverImage,
      status,
      categoryId,
      tagIds,
      metaTitle,
      metaDesc,
      focusKeyword,
      canonicalUrl,
      featured,
      trending,
    } = body;

    // Check slug uniqueness if changed
    let updatedSlug = existingPost.slug;
    if (customSlug && slugify(customSlug) !== existingPost.slug) {
      let baseSlug = slugify(customSlug);
      let uniqueSlug = baseSlug;
      let counter = 1;
      while (
        await prisma.post.findFirst({
          where: { slug: uniqueSlug, NOT: { id } },
        })
      ) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      updatedSlug = uniqueSlug;
    }

    const readingTime = content ? calculateReadingTime(content) : existingPost.readingTime;

    // Handle published date
    let publishedAt = existingPost.publishedAt;
    if (status === "PUBLISHED" && !existingPost.publishedAt) {
      publishedAt = new Date();
    }

    // Update tags if provided
    if (Array.isArray(tagIds)) {
      await prisma.postTag.deleteMany({ where: { postId: id } });
      await prisma.postTag.createMany({
        data: tagIds.map((tagId: string) => ({
          postId: id,
          tagId,
        })),
      });
    }

    const updated = await prisma.post.update({
      where: { id },
      data: {
        ...(title && { title }),
        slug: updatedSlug,
        ...(excerpt !== undefined && { excerpt }),
        ...(content && { content }),
        ...(coverImage !== undefined && { coverImage }),
        ...(status && { status: status as PostStatus }),
        publishedAt,
        readingTime,
        ...(categoryId && { categoryId }),
        ...(metaTitle !== undefined && { metaTitle }),
        ...(metaDesc !== undefined && { metaDesc }),
        ...(focusKeyword !== undefined && { focusKeyword }),
        ...(canonicalUrl !== undefined && { canonicalUrl }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
        ...(trending !== undefined && { trending: Boolean(trending) }),
      },
      include: {
        category: true,
        author: true,
        tags: { include: { tag: true } },
      },
    });

    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    console.error("Update post error:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteContext) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.post.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Post deleted" });
  } catch (error) {
    console.error("Delete post error:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
