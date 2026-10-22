import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { slugify } from "@/lib/slugify";
import { calculateReadingTime } from "@/lib/reading-time";
import { PostStatus } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") as PostStatus | null;
    const categoryId = searchParams.get("categoryId") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          author: { select: { id: true, name: true, email: true, avatar: true } },
          tags: { include: { tag: true } },
          _count: { select: { comments: true } },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Fetch posts error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      slug: customSlug,
      excerpt,
      content,
      coverImage,
      status = "DRAFT",
      categoryId,
      tagIds = [],
      metaTitle,
      metaDesc,
      focusKeyword,
      canonicalUrl,
      featured = false,
      trending = false,
    } = body;

    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { error: "Title, content, and category are required" },
        { status: 400 }
      );
    }

    // Auto-generate or sanitize slug
    let baseSlug = customSlug ? slugify(customSlug) : slugify(title);
    if (!baseSlug) baseSlug = `story-${Date.now()}`;

    // Ensure uniqueness
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await prisma.post.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const readingTime = calculateReadingTime(content);

    const post = await prisma.post.create({
      data: {
        title,
        slug: uniqueSlug,
        excerpt: excerpt || title.slice(0, 160),
        content,
        coverImage,
        status: status as PostStatus,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        readingTime,
        authorId: user.userId,
        categoryId,
        metaTitle: metaTitle || title,
        metaDesc: metaDesc || excerpt || title.slice(0, 160),
        focusKeyword,
        canonicalUrl,
        featured: Boolean(featured),
        trending: Boolean(trending),
        tags: {
          create: tagIds.map((tagId: string) => ({
            tag: { connect: { id: tagId } },
          })),
        },
      },
      include: {
        category: true,
        author: true,
        tags: { include: { tag: true } },
      },
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
