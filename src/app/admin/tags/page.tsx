"use client";

import React, { useState, useEffect } from "react";
import { Tag as TagIcon, Plus, Trash2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { slugify } from "@/lib/slugify";

interface TagItem {
  id: string;
  name: string;
  slug: string;
  _count?: { posts: number };
}

export default function AdminTagsPage() {
  const [tags, setTags] = useState<TagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/tags");
      const data = await res.json();
      if (res.ok) {
        setTags(data.tags || []);
      }
    } catch {
      // error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setCreating(true);
      setMessage(null);

      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: slugify(name),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create tag");
      }

      setTags((prev) => [...prev, data.tag]);
      setName("");
      setMessage({ text: "Tag created successfully!", type: "success" });
    } catch (err: unknown) {
      setMessage({
        text: err instanceof Error ? err.message : "Error creating tag",
        type: "error",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete tag "#${name}"?`)) return;

    try {
      setDeletingId(id);
      setMessage(null);

      const res = await fetch(`/api/tags/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete tag");
      }

      setTags((prev) => prev.filter((t) => t.id !== id));
      setMessage({ text: "Tag deleted successfully.", type: "success" });
    } catch (err: unknown) {
      setMessage({
        text: err instanceof Error ? err.message : "Error deleting tag",
        type: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
          Topic Tags Manager
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Fine-grained tagging taxonomy for cross-referencing stories and topical search.
        </p>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 rounded-xl p-4 text-xs font-medium ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Create Form */}
        <div className="lg:col-span-5 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/60 shadow-xs">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-4 dark:border-zinc-800">
            <Plus className="h-4 w-4 text-blue-500" />
            <h2 className="font-serif text-lg font-bold text-zinc-900 dark:text-white">
              Create New Topic Tag
            </h2>
          </div>

          <form onSubmit={handleCreate} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Tag Label *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Solid State"
                className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              />
              <span className="text-[11px] text-zinc-400 mt-1 block">
                Slug: #{name ? slugify(name) : "tag-slug"}
              </span>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer"
            >
              {creating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Adding...
                </>
              ) : (
                "Save Tag"
              )}
            </button>
          </form>
        </div>

        {/* Existing Tags List */}
        <div className="lg:col-span-7 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/60 shadow-xs">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <TagIcon className="h-4 w-4 text-blue-500" />
              <h2 className="font-serif text-lg font-bold text-zinc-900 dark:text-white">
                Existing Tags ({tags.length})
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2.5">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50/80 px-3.5 py-1.5 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  <span className="font-medium">#{tag.name}</span>
                  {tag._count?.posts !== undefined && (
                    <span className="rounded-full bg-zinc-200 px-1.5 py-0.2 text-[10px] text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                      {tag._count.posts}
                    </span>
                  )}
                  <button
                    onClick={() => handleDelete(tag.id, tag.name)}
                    disabled={deletingId === tag.id}
                    className="text-zinc-400 hover:text-red-500 transition-colors ml-1 cursor-pointer"
                    title="Delete Tag"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
