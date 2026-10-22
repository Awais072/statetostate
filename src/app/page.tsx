import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import BlogCard from "@/components/BlogCard";
import HomeFilterTabs from "@/components/HomeFilterTabs";
import NewsletterForm from "@/components/NewsletterForm";
import AdBanner from "@/components/AdBanner";
import { formatDate } from "@/lib/utils";
import { ArrowUpRight, TrendingUp, Sparkles, Clock, Calendar } from "lucide-react";
import { SITE_NAME } from "@/lib/seo";

export const revalidate = 60; // Incremental Static Regeneration every 60s for high SEO performance

export default async function HomePage() {
  const [posts, categories] = await Promise.all([
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      include: {
        category: true,
        author: { select: { name: true, avatar: true } },
        tags: { include: { tag: true } },
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  // Featured Hero Post
  const featuredPost = posts.find((p) => p.featured) || posts[0];
  // Trending posts list
  const trendingPosts = posts.filter((p) => p.trending && p.id !== featuredPost?.id).slice(0, 3);
  // Grid posts
  const regularPosts = posts;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Editorial Header / Minimalist Hero */}
      <section className="border-b border-zinc-200 pb-10 dark:border-zinc-800">
        <div className="flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            {SITE_NAME} • 2026 Editorial Edition
          </div>
          <h1 className="font-serif text-4xl font-black tracking-tight text-zinc-950 sm:text-6xl dark:text-white max-w-4xl leading-[1.1]">
            Where breakthrough technology, culture, and architecture intersect.
          </h1>
          <p className="max-w-2xl text-base text-zinc-700 sm:text-lg dark:text-zinc-300 leading-relaxed font-sans">
            Independent analysis for leaders navigating the autonomous AI transformation, solid-state electric mobility, commercial real estate cycles, and the entertainment endgame.
          </p>
        </div>

        {/* Featured Post Hero Banner */}
        {featuredPost && (
          <div className="mt-10 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/40 dark:border-zinc-800 dark:bg-zinc-900/60 dark:shadow-none">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="relative aspect-[16/10] lg:aspect-auto lg:col-span-7 bg-zinc-100 dark:bg-zinc-800">
                {featuredPost.coverImage && (
                  <img
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    className="h-full w-full object-cover"
                  />
                )}
                {featuredPost.category && (
                  <span
                    className="absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-md"
                    style={{
                      backgroundColor: `${featuredPost.category.color || "#3b82f6"}30`,
                      color: featuredPost.category.color || "#3b82f6",
                      border: `1px solid ${featuredPost.category.color || "#3b82f6"}50`,
                    }}
                  >
                    Featured • {featuredPost.category.name}
                  </span>
                )}
              </div>

              <div className="flex flex-col justify-between p-6 sm:p-10 lg:col-span-5">
                <div>
                  <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(featuredPost.publishedAt)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {featuredPost.readingTime} min read
                    </span>
                  </div>

                  <h2 className="mt-4 font-serif text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors">
                    <Link href={`/blog/${featuredPost.slug}`}>
                      {featuredPost.title}
                    </Link>
                  </h2>

                  <p className="mt-3 text-sm text-zinc-700 sm:text-base dark:text-zinc-300 leading-relaxed line-clamp-4">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-zinc-100 pt-6 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    {featuredPost.author?.avatar && (
                      <img
                        src={featuredPost.author.avatar}
                        alt={featuredPost.author.name}
                        className="h-9 w-9 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-zinc-700"
                      />
                    )}
                    <div>
                      <div className="text-xs font-semibold text-zinc-950 dark:text-white">
                        {featuredPost.author?.name}
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Contributing Editor</div>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    Read Story <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Trending Bar */}
      {trendingPosts.length > 0 && (
        <section className="mt-12">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            <TrendingUp className="h-4 w-4 text-rose-500" />
            Trending Across Editorial Beats
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {trendingPosts.map((post, idx) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex gap-4 rounded-2xl border border-zinc-200/80 bg-white p-4 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-700"
              >
                <span className="font-serif text-3xl font-black text-zinc-300 group-hover:text-zinc-500 dark:text-zinc-700 dark:group-hover:text-zinc-500 transition-colors">
                  0{idx + 1}
                </span>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {post.category?.name}
                  </span>
                  <h4 className="font-serif text-sm font-bold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400 line-clamp-2 transition-colors">
                    {post.title}
                  </h4>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    {post.readingTime} min read • {formatDate(post.publishedAt)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Google AdSense Placement 1 */}
      <AdBanner slotId="homepage-leaderboard" format="horizontal" />

      {/* Main Interactive Category Filters & Stories Grid */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl dark:text-white">
              Latest Dispatches
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Filter by beat or search for specific technologies, architectures, and market shifts.
            </p>
          </div>
        </div>

        <HomeFilterTabs categories={categories} initialPosts={regularPosts} />
      </section>

      {/* Newsletter Section */}
      <section className="mt-20">
        <NewsletterForm />
      </section>
    </div>
  );
}
