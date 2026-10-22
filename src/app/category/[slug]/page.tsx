import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import BlogCard from "@/components/BlogCard";
import AdBanner from "@/components/AdBanner";
import { getSiteUrl, SITE_NAME } from "@/lib/seo";
import { ChevronLeft, Folder } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    return { title: "Category Not Found" };
  }

  const siteUrl = getSiteUrl();
  return {
    title: `${category.name} | ${SITE_NAME}`,
    description: category.description || `Browse in-depth articles on ${category.name} at ${SITE_NAME}`,
    alternates: {
      canonical: `${siteUrl}/category/${category.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      posts: {
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        include: {
          category: true,
          author: { select: { name: true, avatar: true } },
        },
      },
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <Link href="/" className="flex items-center gap-1 hover:text-zinc-950 dark:hover:text-white transition-colors">
          <ChevronLeft className="h-3.5 w-3.5" /> Back to Home
        </Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-white font-medium">Categories</span>
      </div>

      {/* Header */}
      <div className="mt-8 border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Folder className="h-5 w-5 text-blue-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            Editorial Beat
          </span>
        </div>
        <h1 className="mt-2 font-serif text-3xl font-black tracking-tight text-zinc-950 sm:text-5xl dark:text-white">
          {category.name}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-zinc-700 dark:text-zinc-300">
          {category.description || `Explore our complete archive of published reports, dispatches, and perspectives on ${category.name}.`}
        </p>
        <div className="mt-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          Showing {category.posts.length} published {category.posts.length === 1 ? "story" : "stories"}
        </div>
      </div>

      {/* Ad Placement */}
      <AdBanner slotId="category-top-banner" format="horizontal" />

      {/* Grid */}
      <div className="mt-8">
        {category.posts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-zinc-500">No published articles yet in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {category.posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
