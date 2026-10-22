import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import BlogCard from "@/components/BlogCard";
import { getSiteUrl, SITE_NAME } from "@/lib/seo";
import { ChevronLeft, Tag as TagIcon } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = await prisma.tag.findUnique({
    where: { slug },
  });

  if (!tag) {
    return { title: "Tag Not Found" };
  }

  const siteUrl = getSiteUrl();
  return {
    title: `#${tag.name} | ${SITE_NAME}`,
    description: `Browse all articles tagged with #${tag.name} on ${SITE_NAME}`,
    alternates: {
      canonical: `${siteUrl}/tag/${tag.slug}`,
    },
  };
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;
  const tag = await prisma.tag.findUnique({
    where: { slug },
    include: {
      posts: {
        include: {
          post: {
            include: {
              category: true,
              author: { select: { name: true, avatar: true } },
            },
          },
        },
      },
    },
  });

  if (!tag) {
    notFound();
  }

  const publishedPosts = tag.posts
    .map((tp) => tp.post)
    .filter((p) => p.status === "PUBLISHED");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <Link href="/" className="flex items-center gap-1 hover:text-zinc-950 dark:hover:text-white transition-colors">
          <ChevronLeft className="h-3.5 w-3.5" /> Back to Home
        </Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-white font-medium">Tags</span>
      </div>

      {/* Header */}
      <div className="mt-8 border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <TagIcon className="h-5 w-5 text-blue-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            Topic Tag
          </span>
        </div>
        <h1 className="mt-2 font-serif text-3xl font-black tracking-tight text-zinc-950 sm:text-5xl dark:text-white">
          #{tag.name}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-zinc-700 dark:text-zinc-300">
          Showing {publishedPosts.length} published {publishedPosts.length === 1 ? "story" : "stories"} tagged with #{tag.name}.
        </p>
      </div>

      {/* Grid */}
      <div className="mt-10">
        {publishedPosts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-zinc-500">No published articles under this tag.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {publishedPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
