"use client";

import React, { useState, useEffect } from "react";
import { FolderTree, Plus, Trash2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { slugify } from "@/lib/slugify";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  color?: string | null;
  _count?: { posts: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (res.ok) {
        setCategories(data.categories || []);
      }
    } catch {
      // error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setCreating(true);
      setMessage(null);

      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim() || slugify(name),
          description: description.trim(),
          color,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create category");
      }

      setCategories((prev) => [...prev, data.category]);
      setName("");
      setSlug("");
      setDescription("");
      setMessage({ text: "Category beat created successfully!", type: "success" });
    } catch (err: unknown) {
      setMessage({
        text: err instanceof Error ? err.message : "Error creating category",
        type: "error",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;

    try {
      setDeletingId(id);
      setMessage(null);

      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete category");
      }

      setCategories((prev) => prev.filter((c) => c.id !== id));
      setMessage({ text: "Category deleted successfully.", type: "success" });
    } catch (err: unknown) {
      setMessage({
        text: err instanceof Error ? err.message : "Error deleting category",
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
          Editorial Beats & Categories
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Organize journalism across core niches: Tech & Startups, Pop Culture, EVs, and Real Estate.
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
              Add New Editorial Beat
            </h2>
          </div>

          <form onSubmit={handleCreate} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Beat Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSlug(slugify(e.target.value));
                }}
                placeholder="e.g. Artificial Intelligence"
                className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                URL Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="artificial-intelligence"
                className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-xs font-mono text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Accent Badge Color
              </label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-8 w-14 rounded cursor-pointer border border-zinc-300 p-0.5"
                />
                <span className="text-xs font-mono text-zinc-500">{color}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Editorial focus of this beat..."
                className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer"
            >
              {creating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Creating...
                </>
              ) : (
                "Save Category"
              )}
            </button>
          </form>
        </div>

        {/* Existing Categories List */}
        <div className="lg:col-span-7 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/60 shadow-xs">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <FolderTree className="h-4 w-4 text-blue-500" />
              <h2 className="font-serif text-lg font-bold text-zinc-900 dark:text-white">
                Configured Beats ({categories.length})
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
            </div>
          ) : (
            <div className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {categories.map((cat) => (
                <div key={cat.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: cat.color || "#3b82f6" }}
                      />
                      <h4 className="font-serif font-bold text-sm text-zinc-900 dark:text-white">
                        {cat.name}
                      </h4>
                      <span className="text-[11px] font-mono text-zinc-400">/{cat.slug}</span>
                    </div>
                    {cat.description && (
                      <p className="text-xs text-zinc-500 max-w-md line-clamp-1">
                        {cat.description}
                      </p>
                    )}
                    <span className="inline-block text-[11px] font-medium text-blue-600 dark:text-blue-400">
                      {cat._count?.posts || 0} published stories
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    disabled={deletingId === cat.id}
                    className="rounded-lg border border-zinc-200 p-2 text-red-600 hover:border-red-400 hover:bg-red-50 dark:border-zinc-700 dark:text-red-400 dark:hover:bg-red-950/30 cursor-pointer disabled:opacity-50"
                    title="Delete Category"
                  >
                    <Trash2 className="h-4 w-4" />
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
