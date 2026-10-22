import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import {
  FileText,
  Eye,
  TrendingUp,
  Users,
  PlusCircle,
  ExternalLink,
  Edit3,
  FolderTree,
  ArrowUpRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    totalPosts,
    publishedPostsCount,
    draftPostsCount,
    subscribersCount,
    allPosts,
    categories,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.post.count({ where: { status: "DRAFT" } }),
    prisma.newsletterSubscriber.count(),
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        category: true,
        author: { select: { name: true } },
      },
    }),
    prisma.category.findMany({
      include: {
        posts: { select: { views: true } },
      },
    }),
  ]);

  // Calculate total views
  const totalViewsAggregate = await prisma.post.aggregate({
    _sum: { views: true },
  });
  const totalViews = totalViewsAggregate._sum.views || 0;

  // Calculate category metrics
  const categoryStats = categories.map((cat) => {
    const views = cat.posts.reduce((sum, p) => sum + p.views, 0);
    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      color: cat.color || "#3b82f6",
      postCount: cat.posts.length,
      views,
    };
  }).sort((a, b) => b.views - a.views);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Editorial Overview
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Real-time analytics, content status, and publishing performance metrics.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Author New Story</span>
        </Link>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Views */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Total Article Views
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-serif font-bold text-zinc-900 dark:text-white">
            {totalViews.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            ↑ Organic reader impressions
          </div>
        </div>

        {/* Published Stories */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Live Published
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-serif font-bold text-zinc-900 dark:text-white">
            {publishedPostsCount}
          </div>
          <div className="mt-1 text-xs text-zinc-500">
            {totalPosts} total stories authored
          </div>
        </div>

        {/* Drafts */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              In Draft / Queue
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <Edit3 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-serif font-bold text-zinc-900 dark:text-white">
            {draftPostsCount}
          </div>
          <div className="mt-1 text-xs text-amber-600 dark:text-amber-400">
            Awaiting editorial signoff
          </div>
        </div>

        {/* Newsletter Subscribers */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Subscribers
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-serif font-bold text-zinc-900 dark:text-white">
            {subscribersCount.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-purple-600 dark:text-purple-400">
            Active email readers
          </div>
        </div>
      </div>

      {/* Two Column Section: Top Categories & Recent Articles */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Top Categories Breakdown */}
        <div className="lg:col-span-5 rounded-2xl border border-zinc-200/80 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <FolderTree className="h-4 w-4 text-blue-500" />
              <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-white">
                Beat Performance
              </h3>
            </div>
            <Link
              href="/admin/categories"
              className="text-xs text-blue-600 hover:underline dark:text-blue-400"
            >
              Manage Beats →
            </Link>
          </div>

          <div className="mt-5 space-y-4">
            {categoryStats.map((cat) => (
              <div key={cat.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                  </span>
                  <span className="text-zinc-500">
                    {cat.views.toLocaleString()} views • {cat.postCount} stories
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${totalViews > 0 ? (cat.views / totalViews) * 100 : 0}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Articles */}
        <div className="lg:col-span-7 rounded-2xl border border-zinc-200/80 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-white">
                Recent Dispatches
              </h3>
            </div>
            <Link
              href="/admin/posts"
              className="text-xs text-blue-600 hover:underline dark:text-blue-400"
            >
              View All Posts ({totalPosts}) →
            </Link>
          </div>

          <div className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-800/80">
            {allPosts.map((post) => (
              <div
                key={post.id}
                className="py-3.5 flex items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        post.status === "PUBLISHED"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400"
                          : post.status === "DRAFT"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400"
                      }`}
                    >
                      {post.status}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                  <h4 className="mt-1 font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">
                    {post.title}
                  </h4>
                  <div className="text-xs text-zinc-500 flex items-center gap-2 mt-0.5">
                    <span>{post.category?.name}</span>
                    <span>•</span>
                    <span>{post.views} views</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="rounded-lg border border-zinc-200 p-1.5 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-white"
                    title="Edit Story"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </Link>
                  {post.status === "PUBLISHED" && (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="rounded-lg border border-zinc-200 p-1.5 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-white"
                      title="Preview Live"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
