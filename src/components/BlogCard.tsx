import React from "react";
import Link from "next/link";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface BlogCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage?: string | null;
    publishedAt?: Date | string | null;
    readingTime: number;
    category?: {
      name: string;
      slug: string;
      color?: string | null;
    } | null;
    author?: {
      name: string;
      avatar?: string | null;
    } | null;
    views?: number;
    featured?: boolean;
  };
  priority?: boolean;
}

export default function BlogCard({ post, priority = false }: BlogCardProps) {
  const categoryColor = post.category?.color || "#3b82f6";

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/90 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-200/50 dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:hover:border-zinc-700 dark:hover:shadow-zinc-950/60">
      <div>
        {/* Cover Thumbnail */}
        <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading={priority ? "eager" : "lazy"}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-500 dark:from-zinc-800 dark:to-zinc-900">
              <span className="font-serif italic text-sm">StateToState Dispatch</span>
            </div>
          )}

          {/* Category Badge overlay */}
          {post.category && (
            <span
              className="absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-md shadow-xs transition-transform group-hover:scale-105"
              style={{
                backgroundColor: `${categoryColor}25`,
                color: categoryColor,
                border: `1px solid ${categoryColor}40`,
              }}
            >
              {post.category.name}
            </span>
          )}
        </Link>

        {/* Content Body */}
        <div className="p-5 sm:p-6">
          {/* Metadata row */}
          <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(post.publishedAt)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readingTime} min read
            </span>
          </div>

          {/* Title */}
          <h3 className="mt-3 font-serif text-xl font-bold tracking-tight text-zinc-950 transition-colors group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400 line-clamp-2">
            <Link href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
        </div>
      </div>

      {/* Footer with Author and Read More */}
      <div className="mt-auto border-t border-zinc-100 p-5 pt-4 flex items-center justify-between dark:border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          {post.author?.avatar ? (
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="h-7 w-7 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-zinc-700"
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200">
              {post.author?.name?.charAt(0) || "A"}
            </div>
          )}
          <span className="text-xs font-medium text-zinc-800 dark:text-zinc-300">
            {post.author?.name || "Editorial Staff"}
          </span>
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 transition-transform group-hover:translate-x-1 dark:text-white"
        >
          Read <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </article>
  );
}
