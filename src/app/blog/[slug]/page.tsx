import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import ShareButtons from "@/components/ShareButtons";
import CommentsSection from "@/components/CommentsSection";
import BlogCard from "@/components/BlogCard";
import NewsletterForm from "@/components/NewsletterForm";
import AdBanner from "@/components/AdBanner";
import { formatDate } from "@/lib/utils";
import {
  getSiteUrl,
  SITE_NAME,
  generateArticleJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/seo";
import { Clock, Calendar, Eye, ChevronLeft, Tag as TagIcon } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { category: true, author: true, tags: { include: { tag: true } } },
  });

  if (!post || post.status !== "PUBLISHED") {
    return {
      title: "Story Not Found",
    };
  }

  const siteUrl = getSiteUrl();
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const title = post.metaTitle || post.title;
  const description = post.metaDesc || post.excerpt;
  const imageUrl = post.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80";

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    keywords: [
      post.category?.name || "Blog",
      ...(post.focusKeyword ? [post.focusKeyword] : []),
      ...post.tags.map((t) => t.tag.name),
    ],
    alternates: {
      canonical: post.canonicalUrl || postUrl,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: postUrl,
      siteName: SITE_NAME,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
      authors: [post.author?.name || SITE_NAME],
      section: post.category?.name,
      tags: post.tags.map((t) => t.tag.name),
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@statetostate",
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  // Fetch Post and increment views
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      category: true,
      author: true,
      tags: { include: { tag: true } },
      comments: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!post || post.status !== "PUBLISHED") {
    notFound();
  }

  // Increment view counter asynchronously
  await prisma.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  }).catch(() => null);

  // Fetch Related Posts
  const relatedPosts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      categoryId: post.categoryId,
      id: { not: post.id },
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
    include: {
      category: true,
      author: { select: { name: true, avatar: true } },
    },
  });

  const siteUrl = getSiteUrl();
  const postUrl = `${siteUrl}/blog/${post.slug}`;

  // Structured Data (JSON-LD)
  const articleJsonLd = generateArticleJsonLd({
    title: post.title,
    excerpt: post.excerpt,
    slug: post.slug,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    coverImage: post.coverImage,
    authorName: post.author?.name || "Editorial Staff",
    categoryName: post.category?.name || "General",
    tags: post.tags.map((t) => t.tag.name),
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: post.category?.name || "Category", url: `/category/${post.category?.slug}` },
    { name: post.title, url: `/blog/${post.slug}` },
  ]);

  return (
    <>
      {/* Automated Structured Data for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-zinc-950 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>
          <span>/</span>
          {post.category && (
            <Link
              href={`/category/${post.category.slug}`}
              className="hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
              {post.category.name}
            </Link>
          )}
        </div>

        {/* Header Block */}
        <header className="mt-8">
          {post.category && (
            <Link
              href={`/category/${post.category.slug}`}
              className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                backgroundColor: `${post.category.color || "#3b82f6"}20`,
                color: post.category.color || "#3b82f6",
                border: `1px solid ${post.category.color || "#3b82f6"}40`,
              }}
            >
              {post.category.name}
            </Link>
          )}

          <h1 className="mt-4 font-serif text-3xl font-black tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl dark:text-white leading-[1.15]">
            {post.title}
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
            {post.excerpt}
          </p>

          {/* Author & Story Metadata */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-zinc-200 py-4 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              {post.author?.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-700"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-200 text-sm font-bold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                  {post.author?.name?.charAt(0) || "A"}
                </div>
              )}
              <div>
                <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                  {post.author?.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {formatDate(post.publishedAt)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {post.readingTime} min read
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {post.views.toLocaleString()} views
                  </span>
                </div>
              </div>
            </div>

            {/* Social Share Buttons */}
            <ShareButtons title={post.title} url={postUrl} />
          </div>
        </header>

        {/* Featured Cover Image */}
        {post.coverImage && (
          <div className="mt-8 overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-800 shadow-lg">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full object-cover max-h-[500px]"
            />
          </div>
        )}

        {/* Main Article Body */}
        <div className="mt-10 max-w-none">
          <MarkdownRenderer content={post.content} />
        </div>

        {/* Google AdSense In-Article Placement */}
        <AdBanner slotId="article-bottom-slot" format="horizontal" />

        {/* Tags Row */}
        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center gap-2 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <TagIcon className="h-4 w-4 text-zinc-500" />
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Tags:</span>
            {post.tags.map(({ tag }) => (
              <Link
                key={tag.id}
                href={`/tag/${tag.slug}`}
                className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Author Bio Box */}
        {post.author && (
          <div className="mt-12 rounded-3xl border border-zinc-200 bg-zinc-50/70 p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/40">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {post.author.avatar && (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-zinc-300 dark:ring-zinc-700"
                />
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif text-lg font-bold text-zinc-950 dark:text-white">
                    Written by {post.author.name}
                  </h4>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                    {post.author.role}
                  </span>
                </div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {post.author.bio || `Senior contributing editor at ${SITE_NAME} covering cutting-edge industry shifts.`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Comments Section */}
        <CommentsSection postId={post.id} initialComments={post.comments} />

        {/* Related Posts Grid */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-serif text-2xl font-bold text-zinc-950 dark:text-white">
                  Related in {post.category?.name}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  Further reading in this editorial beat
                </p>
              </div>
              <Link
                href={`/category/${post.category?.slug}`}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                View all in {post.category?.name} →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <BlogCard key={related.id} post={related} />
              ))}
            </div>
          </section>
        )}

        {/* Newsletter Call to action */}
        <div className="mt-16">
          <NewsletterForm />
        </div>
      </article>
    </>
  );
}
