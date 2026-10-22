"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, Mail, ArrowRight, Loader2, KeyRound, Clock, CheckCircle2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";
  const reason = searchParams.get("reason");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      router.push(from);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail("admin@statetostate.com");
    setPassword("AdminPassword123!");
    setError("");
  };

  return (
    <div className="w-full max-w-md space-y-7 rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900/90 dark:shadow-none">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-md">
          <Shield className="h-7 w-7 text-blue-500" />
        </div>
        <h2 className="mt-4 font-serif text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
          StateToState Editorial Desk
        </h2>
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          Sign in to access publishing tools, analytics, and content controls.
        </p>
      </div>

      {/* Notifications for Session Reason */}
      {reason === "inactivity" && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
          <div className="flex items-center gap-2 font-semibold">
            <Clock className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>Session Timed Out Due to Inactivity</span>
          </div>
          <p className="mt-1 text-[11px] text-amber-800 dark:text-amber-300/90 leading-relaxed">
            For security purposes, your session automatically expired after an idle period. Please re-enter your credentials.
          </p>
        </div>
      )}

      {reason === "logged_out" && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>Signed Out Successfully</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-800 dark:text-emerald-300/90 leading-relaxed">
            Your admin session has ended safely. You must sign in again to access the control center.
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="mt-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Email Address
          </label>
          <div className="relative mt-1">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@statetostate.com"
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50/70 py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:text-zinc-950 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-500 dark:focus:bg-zinc-900 dark:focus:text-white transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Password
          </label>
          <div className="relative mt-1">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50/70 py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:text-zinc-950 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-500 dark:focus:bg-zinc-900 dark:focus:text-white transition-colors"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Authenticating...
            </>
          ) : (
            <>
              Sign in to Dashboard <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Demo Fast-fill helper */}
      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <button
          type="button"
          onClick={handleDemoFill}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-blue-300 bg-blue-50/50 py-2 text-xs font-medium text-blue-700 hover:bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300 cursor-pointer"
        >
          <KeyRound className="h-3.5 w-3.5" /> Auto-fill Demo Admin Credentials
        </button>
      </div>

      <div className="text-center">
        <Link
          href="/"
          className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
        >
          ← Return to Public Homepage
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-sm text-zinc-400">Loading editorial gateway...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
