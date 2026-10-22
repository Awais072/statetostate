import React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import PostEditor from "@/components/PostEditor";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Edit Story | StateToState Editorial",
};

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      tags: true,
    },
  });

  if (!post) {
    notFound();
  }

  const initialData = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage,
    status: post.status,
    categoryId: post.categoryId,
    tagIds: post.tags.map((t) => t.tagId),
    metaTitle: post.metaTitle,
    metaDesc: post.metaDesc,
    focusKeyword: post.focusKeyword,
    canonicalUrl: post.canonicalUrl,
    featured: post.featured,
    trending: post.trending,
  };

  return <PostEditor initialData={initialData} isEdit={true} />;
}
