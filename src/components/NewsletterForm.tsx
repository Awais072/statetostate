"use client";

import React, { useState } from "react";
import { Mail, CheckCircle, Loader2 } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please provide a valid email address.");
      return;
    }

    try {
      setStatus("loading");
      setMessage("");

      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setStatus("success");
      setMessage("Thank you for subscribing! You're now on our insider editorial dispatch.");
      setEmail("");
    } catch (err: unknown) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="max-w-xl">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          <Mail className="h-4 w-4" /> Weekly Dispatch
        </div>
        <h3 className="mt-2 text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl dark:text-white">
          Curated insight at the frontier of innovation.
        </h3>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Join 28,000+ engineers, venture capitalists, automotive executives, and architects receiving our Sunday briefing.
        </p>

        {status === "success" ? (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            <CheckCircle className="h-5 w-5 shrink-0" />
            <span>{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              required
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-500"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900/30 disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Subscribing...
                </>
              ) : (
                "Subscribe Free"
              )}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">{message}</p>
        )}
        <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
          Zero marketing spam. One-click unsubscribe at any moment.
        </p>
      </div>
    </div>
  );
}
