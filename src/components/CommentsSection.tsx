"use client";

import React, { useState } from "react";
import { MessageSquare, Send, CheckCircle2, User } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface CommentItem {
  id: string;
  authorName: string;
  content: string;
  createdAt: Date | string;
}

interface CommentsSectionProps {
  postId: string;
  initialComments: CommentItem[];
}

export default function CommentsSection({ postId, initialComments }: CommentsSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !authorEmail.trim() || !content.trim()) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, authorName, authorEmail, content }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to post comment");
      }

      setComments((prev) => [data.comment, ...prev]);
      setSuccess(true);
      setContent("");
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error posting comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-14 pt-10 border-t border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-blue-500" />
        <h3 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Discussions ({comments.length})
        </h3>
      </div>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Join the editorial conversation. Thoughtful, civil perspectives are encouraged.
      </p>

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Name *</label>
            <input
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. Maya Lin"
              className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Email * (Not published)</label>
            <input
              type="email"
              required
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
              placeholder="e.g. maya@example.com"
              className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Comment *</label>
          <textarea
            required
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your perspective..."
            className="mt-1 w-full rounded-xl border border-zinc-300 bg-white p-3.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
          />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
        {success && (
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>Your comment has been posted successfully!</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer"
          >
            <Send className="h-4 w-4" />
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="mt-8 space-y-4">
        {comments.length === 0 ? (
          <p className="py-6 text-center text-sm text-zinc-400">
            Be the first to share your thoughts on this story.
          </p>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-zinc-200/80 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/60"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-950 dark:text-zinc-100">{c.authorName}</h4>
                    <span className="text-xs text-zinc-500">{formatDate(c.createdAt)}</span>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
                {c.content}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
