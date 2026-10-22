"use client";

import React, { useState, useMemo } from "react";
import BlogCard, { BlogCardProps } from "./BlogCard";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
}

interface HomeFilterTabsProps {
  categories: Category[];
  initialPosts: BlogCardProps["post"][];
}

export default function HomeFilterTabs({ categories, initialPosts }: HomeFilterTabsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === "all" || post.category?.slug === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category?.name.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [initialPosts, selectedCategory, searchQuery]);

  return (
    <div className="mt-12 space-y-8">
      {/* Search and Category Filter Toolbar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === "all"
                ? "bg-zinc-900 text-white shadow-xs dark:bg-white dark:text-zinc-950"
                : "border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:text-white"
            }`}
          >
            All Stories ({initialPosts.length})
          </button>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-zinc-900 text-white shadow-xs dark:bg-white dark:text-zinc-950"
                    : "border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Live Instant Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by keyword..."
            className="w-full rounded-full border border-zinc-200 bg-white py-2 pl-10 pr-4 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Grid Results */}
      {filteredPosts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-800">
          <SlidersHorizontal className="mx-auto h-8 w-8 text-zinc-400" />
          <h3 className="mt-3 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
            No articles match your filter
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            Try adjusting your search query or selecting a different editorial beat.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="mt-4 rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-zinc-900"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post, idx) => (
            <BlogCard key={post.id} post={post} priority={idx < 3} />
          ))}
        </div>
      )}
    </div>
  );
}
