"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import MarkdownRenderer from "./MarkdownRenderer";
import { slugify } from "@/lib/slugify";
import { calculateReadingTime } from "@/lib/reading-time";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Eye,
  Edit,
  Columns,
  Sparkles,
  Save,
  Globe,
  Upload,
  Clock,
  Tag as TagIcon,
  Folder,
  ArrowLeft,
  Loader2,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface PostEditorProps {
  initialData?: {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string | null;
    status: "DRAFT" | "PUBLISHED" | "SCHEDULED";
    categoryId: string;
    tagIds: string[];
    metaTitle?: string | null;
    metaDesc?: string | null;
    focusKeyword?: string | null;
    canonicalUrl?: string | null;
    featured?: boolean;
    trending?: boolean;
  };
  isEdit?: boolean;
}

export default function PostEditor({ initialData, isEdit = false }: PostEditorProps) {
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isSlugManual, setIsSlugManual] = useState(Boolean(initialData?.slug));
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "SCHEDULED">(
    initialData?.status || "DRAFT"
  );
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialData?.tagIds || []);
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
  const [metaDesc, setMetaDesc] = useState(initialData?.metaDesc || "");
  const [focusKeyword, setFocusKeyword] = useState(initialData?.focusKeyword || "");
  const [canonicalUrl, setCanonicalUrl] = useState(initialData?.canonicalUrl || "");
  const [featured, setFeatured] = useState(Boolean(initialData?.featured));
  const [trending, setTrending] = useState(Boolean(initialData?.trending));

  // Editor states
  const [editorMode, setEditorMode] = useState<"write" | "split" | "preview">("split");
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto calculate reading time
  const readingTime = calculateReadingTime(content);

  // Auto-slugify on title change if not manually edited
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManual) {
      setSlug(slugify(val));
    }
    if (!metaTitle) {
      setMetaTitle(val);
    }
  };

  const handleExcerptChange = (val: string) => {
    setExcerpt(val);
    if (!metaDesc) {
      setMetaDesc(val);
    }
  };

  // Fetch categories and tags
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => {
        setCategories(d.categories || []);
        if (!categoryId && d.categories?.[0]) {
          setCategoryId(d.categories[0].id);
        }
      });

    fetch("/api/tags")
      .then((r) => r.json())
      .then((d) => setTags(d.tags || []));
  }, []);

  // Markdown formatting shortcuts
  const insertText = (before: string, after: string = "", defaultText: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end) || defaultText;
    const replacement = `${before}${selected}${after}`;

    const newContent =
      textarea.value.substring(0, start) +
      replacement +
      textarea.value.substring(end);

    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selected.length
      );
    }, 0);
  };

  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setCoverImage(data.url);
      } else {
        alert(data.error || "Image upload failed");
      }
    } catch {
      alert("Error uploading image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFeedback(null);

    if (!title.trim() || !content.trim() || !categoryId) {
      setError("Please ensure Title, Content, and Category are specified.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim() || title.slice(0, 160),
        content,
        coverImage: coverImage.trim() || null,
        status,
        categoryId,
        tagIds: selectedTagIds,
        metaTitle: metaTitle.trim() || title.trim(),
        metaDesc: metaDesc.trim() || excerpt.trim() || title.slice(0, 160),
        focusKeyword: focusKeyword.trim() || null,
        canonicalUrl: canonicalUrl.trim() || null,
        featured,
        trending,
      };

      const url = isEdit ? `/api/posts/${initialData?.id}` : "/api/posts";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save post");
      }

      setFeedback(isEdit ? "Story updated successfully!" : "Story published successfully!");
      setTimeout(() => {
        router.push("/admin/posts");
        router.refresh();
      }, 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error saving story");
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-5 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-zinc-950 dark:text-white">
              {isEdit ? "Edit Editorial Story" : "Author New Story"}
            </h1>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> Estimated {readingTime} min read
              </span>
              <span>•</span>
              <span>{content.split(/\s+/).filter(Boolean).length} words</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <option value="DRAFT">Status: Draft</option>
            <option value="PUBLISHED">Status: Published</option>
            <option value="SCHEDULED">Status: Scheduled</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>{isEdit ? "Update Story" : "Publish Story"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-xs font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-xs font-medium text-red-600 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Main Grid: Left Editor & Right Meta Panel */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Story Content */}
        <div className="space-y-6 lg:col-span-8">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Story Headline *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Solid-State Batteries in 2026: The EV Range Breakthrough"
              className="mt-1.5 w-full rounded-2xl border border-zinc-200 bg-white p-4 font-serif text-2xl font-bold text-zinc-950 placeholder:text-zinc-300 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-white dark:placeholder:text-zinc-600"
            />
          </div>

          {/* Slug */}
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-blue-500" />
                <span>Permalink URL Slug</span>
              </label>
              <button
                type="button"
                onClick={() => setIsSlugManual(!isSlugManual)}
                className="text-[11px] font-medium text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
              >
                {isSlugManual ? "Auto-generate from Title" : "Edit Slug Manually"}
              </button>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-zinc-500 font-mono">
              <span>https://statetostate.com/blog/</span>
              <input
                type="text"
                value={slug}
                readOnly={!isSlugManual}
                onChange={(e) => {
                  setIsSlugManual(true);
                  setSlug(slugify(e.target.value));
                }}
                className={`flex-1 rounded-lg border px-2 py-1 text-xs font-mono text-zinc-900 dark:text-white ${
                  isSlugManual
                    ? "border-blue-400 bg-white dark:bg-zinc-950"
                    : "border-transparent bg-transparent"
                }`}
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Short Excerpt / Lead Paragraph
            </label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => handleExcerptChange(e.target.value)}
              placeholder="A compelling two-sentence summary that appears in grid previews and social cards..."
              className="mt-1.5 w-full rounded-2xl border border-zinc-200 bg-white p-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-white dark:placeholder:text-zinc-600"
            />
          </div>

          {/* Rich Content Editor Toolbar */}
          <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60">
            {/* Toolbar Buttons */}
            <div className="flex flex-wrap items-center justify-between border-b border-zinc-200 bg-zinc-50/80 p-2 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              <div className="flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  onClick={() => insertText("**", "**", "bold text")}
                  className="rounded-lg p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  title="Bold"
                >
                  <Bold className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertText("*", "*", "italic text")}
                  className="rounded-lg p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  title="Italic"
                >
                  <Italic className="h-4 w-4" />
                </button>
                <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700 mx-1" />
                <button
                  type="button"
                  onClick={() => insertText("# ", "", "Heading 1")}
                  className="rounded-lg p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  title="Heading 1"
                >
                  <Heading1 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertText("## ", "", "Heading 2")}
                  className="rounded-lg p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  title="Heading 2"
                >
                  <Heading2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertText("### ", "", "Heading 3")}
                  className="rounded-lg p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  title="Heading 3"
                >
                  <Heading3 className="h-4 w-4" />
                </button>
                <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700 mx-1" />
                <button
                  type="button"
                  onClick={() => insertText("> ", "", "Editorial quote")}
                  className="rounded-lg p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  title="Blockquote"
                >
                  <Quote className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertText("```\n", "\n```", "// Code snippet")}
                  className="rounded-lg p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  title="Code Block"
                >
                  <Code className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertText("- ", "", "Bullet point")}
                  className="rounded-lg p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  title="Bulleted List"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertText("1. ", "", "First item")}
                  className="rounded-lg p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  title="Numbered List"
                >
                  <ListOrdered className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    insertText(
                      "\n| Header 1 | Header 2 |\n| :--- | :--- |\n| Row 1 | Value 1 |\n"
                    )
                  }
                  className="rounded-lg p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  title="Insert Table"
                >
                  <TableIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const url = prompt("Enter hyperlink URL:", "https://");
                    if (url) insertText("[", `](${url})`, "Link text");
                  }}
                  className="rounded-lg p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  title="Hyperlink"
                >
                  <LinkIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const url = prompt("Enter image URL:", "https://");
                    if (url) insertText("![Image caption](", `${url})`);
                  }}
                  className="rounded-lg p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  title="Image Embed"
                >
                  <ImageIcon className="h-4 w-4" />
                </button>
              </div>

              {/* View Mode Switches */}
              <div className="flex items-center gap-1 border-t sm:border-t-0 pt-2 sm:pt-0">
                <button
                  type="button"
                  onClick={() => setEditorMode("write")}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                    editorMode === "write"
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950"
                      : "text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  }`}
                >
                  <Edit className="inline h-3.5 w-3.5 mr-1" /> Write
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode("split")}
                  className={`hidden md:inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${
                    editorMode === "split"
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950"
                      : "text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  }`}
                >
                  <Columns className="inline h-3.5 w-3.5 mr-1" /> Split
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode("preview")}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                    editorMode === "preview"
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950"
                      : "text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  }`}
                >
                  <Eye className="inline h-3.5 w-3.5 mr-1" /> Preview
                </button>
              </div>
            </div>

            {/* Editor Workspace Container */}
            <div className="min-h-[500px]">
              {editorMode === "write" && (
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Craft your story using rich Markdown..."
                  className="w-full min-h-[500px] resize-y p-6 font-mono text-sm leading-relaxed text-zinc-900 focus:outline-none dark:bg-zinc-950 dark:text-zinc-100"
                />
              )}

              {editorMode === "preview" && (
                <div className="min-h-[500px] p-8">
                  <MarkdownRenderer content={content || "*Nothing written yet. Switch back to Write mode to start authoring.*"} />
                </div>
              )}

              {editorMode === "split" && (
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800 min-h-[500px]">
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Craft your story using rich Markdown..."
                    className="w-full min-h-[500px] resize-none p-5 font-mono text-sm leading-relaxed text-zinc-900 focus:outline-none dark:bg-zinc-950 dark:text-zinc-100"
                  />
                  <div className="min-h-[500px] p-6 overflow-y-auto max-h-[700px] bg-zinc-50/40 dark:bg-zinc-900/20">
                    <MarkdownRenderer content={content || "*Live preview renders here...*"} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Taxonomy, Media & SEO Suite */}
        <div className="space-y-6 lg:col-span-4">
          {/* Beat (Category) Selector */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <Folder className="h-4 w-4 text-blue-500" /> Editorial Beat *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-300 bg-white p-2.5 text-xs font-medium text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags Selector */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <TagIcon className="h-4 w-4 text-blue-500" /> Story Tags
            </label>
            <div className="mt-3 flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
              {tags.map((tag) => {
                const isSelected = selectedTagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950"
                        : "border border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    }`}
                  >
                    #{tag.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured & Trending Toggles */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                  Featured Story
                </div>
                <div className="text-[11px] text-zinc-400">
                  Elevates story to homepage hero showcase.
                </div>
              </div>
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 rounded accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
              <div>
                <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                  Trending Beat
                </div>
                <div className="text-[11px] text-zinc-400">
                  Displays in top trending cards carousel.
                </div>
              </div>
              <input
                type="checkbox"
                checked={trending}
                onChange={(e) => setTrending(e.target.checked)}
                className="h-4 w-4 rounded accent-rose-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Cover Media */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <ImageIcon className="h-4 w-4 text-blue-500" /> Cover Thumbnail
            </label>

            {coverImage && (
              <div className="mt-3 relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-100">
                <img src={coverImage} alt="Cover preview" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setCoverImage("")}
                  className="absolute top-2 right-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] text-white hover:bg-black"
                >
                  Remove
                </button>
              </div>
            )}

            <div className="mt-3 space-y-2">
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="Paste image URL (Unsplash, Cloudinary)..."
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              />

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5" />
                  {uploadingImage ? "Uploading..." : "Upload from Computer"}
                </button>
              </div>
            </div>
          </div>

          {/* Built-In SEO Suite */}
          <div className="rounded-2xl border border-blue-200/80 bg-blue-50/20 p-5 dark:border-blue-900/50 dark:bg-blue-950/10 space-y-4">
            <div className="flex items-center gap-2 border-b border-blue-100 pb-3 dark:border-blue-900/40">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <h3 className="font-serif text-sm font-bold text-zinc-900 dark:text-white">
                Built-In SEO Suite
              </h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Focus Keyword
              </label>
              <input
                type="text"
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                placeholder="e.g. Solid-State EV Batteries"
                className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                SEO Meta Title
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Leave blank to use story headline"
                className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                SEO Meta Description ({metaDesc.length}/160)
              </label>
              <textarea
                rows={2}
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                placeholder="Snippet displayed in search results..."
                className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Canonical URL
              </label>
              <input
                type="url"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                placeholder="https://..."
                className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              />
            </div>

            {/* Google SERP Live Simulation */}
            <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900/90 text-left">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                Google Search Snippet Preview
              </span>
              <div className="mt-2 text-[11px] text-zinc-500 truncate font-sans">
                https://statetostate.com/blog/{slug || "story-slug"}
              </div>
              <div className="font-sans text-sm font-medium text-blue-700 dark:text-blue-400 hover:underline truncate">
                {metaTitle || title || "Story Headline Preview"}
              </div>
              <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                {metaDesc || excerpt || "Editorial description and excerpt preview on Google search engine result pages."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
