"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import {
  PlusCircle,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Eye,
  Filter,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
} from "lucide-react";

interface PostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: "PUBLISHED" | "DRAFT" | "SCHEDULED";
  publishedAt?: string | null;
  createdAt: string;
  views: number;
  readingTime: number;
  category?: { name: string; color?: string | null };
  author?: { name: string };
  _count?: { comments: number };
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/posts?limit=100");
      const data = await res.json();
      if (res.ok) {
        setPosts(data.posts || []);
      }
    } catch {
      // error handling
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
        setFeedback("Story deleted successfully.");
        setTimeout(() => setFeedback(null), 3000);
      } else {
        alert("Failed to delete story.");
      }
    } catch {
      alert("Error deleting story.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesStatus = statusFilter === "ALL" || post.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.category?.name.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Story Management
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Author, edit, publish, and manage all editorial dispatches across beats.
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

      {feedback && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-xs font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-900/60">
        {/* Status filters */}
        <div className="flex flex-wrap items-center gap-2">
          {["ALL", "PUBLISHED", "DRAFT", "SCHEDULED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === st
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              {st} {st === "ALL" ? `(${posts.length})` : `(${posts.filter((p) => p.status === st).length})`}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stories..."
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-1.5 pl-9 pr-3 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:focus:bg-zinc-900 dark:text-zinc-100 dark:focus:text-white"
          />
        </div>
      </div>

      {/* Posts Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-zinc-500">No stories found matching your filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-600 dark:text-zinc-300">
              <thead className="border-b border-zinc-200 bg-zinc-50/70 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
                <tr>
                  <th className="px-6 py-3.5">Title & Excerpt</th>
                  <th className="px-6 py-3.5">Beat</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Performance</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                {filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 max-w-sm">
                      <div className="font-serif font-bold text-sm text-zinc-900 dark:text-white truncate">
                        {post.title}
                      </div>
                      <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                        {post.excerpt}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {post.category ? (
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                          style={{
                            backgroundColor: `${post.category.color || "#3b82f6"}20`,
                            color: post.category.color || "#3b82f6",
                          }}
                        >
                          {post.category.name}
                        </span>
                      ) : (
                        <span className="text-zinc-400">Unassigned</span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                          post.status === "PUBLISHED"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400"
                            : post.status === "DRAFT"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3 text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" /> {post.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {post.readingTime}m
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-zinc-400">
                      {formatDate(post.publishedAt || post.createdAt)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {post.status === "PUBLISHED" && (
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="rounded-lg border border-zinc-200 p-1.5 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-white"
                            title="Preview Live Story"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="rounded-lg border border-zinc-200 p-1.5 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-white"
                          title="Edit Story"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          disabled={deletingId === post.id}
                          className="rounded-lg border border-zinc-200 p-1.5 text-red-600 hover:border-red-400 hover:bg-red-50 dark:border-zinc-700 dark:text-red-400 dark:hover:bg-red-950/30 cursor-pointer disabled:opacity-50"
                          title="Delete Story"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
