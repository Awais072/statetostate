import React from "react";
import prisma from "@/lib/prisma";
import BlogCard from "@/components/BlogCard";
import { Search as SearchIcon, Filter, Sparkles } from "lucide-react";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export const metadata = {
  title: "Search Stories | StateToState",
  description: "Search our archive of stories, analysis, and perspectives across tech, pop culture, EVs, and real estate.",
};

export default async function SearchPage({ searchParams }: Props) {
  const { q = "", category = "" } = await searchParams;

  const whereClause: Record<string, unknown> = {
    status: "PUBLISHED",
  };

  if (category) {
    whereClause.category = { slug: category };
  }

  if (q.trim()) {
    whereClause.OR = [
      { title: { contains: q } },
      { excerpt: { contains: q } },
      { content: { contains: q } },
    ];
  }

  const [posts, categories, tags] = await Promise.all([
    prisma.post.findMany({
      where: whereClause,
      orderBy: { publishedAt: "desc" },
      include: {
        category: true,
        author: { select: { name: true, avatar: true } },
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <h1 className="font-serif text-3xl font-black tracking-tight text-zinc-950 sm:text-5xl dark:text-white">
          Explore Archive
        </h1>
        <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
          Search full-text dispatches, filter across beats, or browse by trending tags.
        </p>

        {/* Search Input Bar */}
        <form method="GET" action="/search" className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search by keywords, companies, architects, or technologies..."
              className="w-full rounded-2xl border border-zinc-300 bg-white py-3 pl-11 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500"
            />
          </div>

          <select
            name="category"
            defaultValue={category}
            className="rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-700 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="rounded-2xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Popular Tags */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-zinc-400">Popular Tags:</span>
          {tags.map((t) => (
            <Link
              key={t.id}
              href={`/tag/${t.slug}`}
              className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            >
              #{t.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="mt-8">
        <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-6">
          {q || category
            ? `Search Results (${posts.length} found)`
            : `All Published Dispatches (${posts.length})`}
        </div>

        {posts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-800">
            <p className="text-zinc-500">No articles matched your criteria. Try different search terms.</p>
            <Link
              href="/search"
              className="mt-4 inline-block rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-zinc-900"
            >
              Clear Search
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
