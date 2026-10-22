"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { Search, Menu, X } from "lucide-react";

const CATEGORIES = [
  { name: "Tech & Startups", slug: "tech-startups" },
  { name: "Celebrities & Pop", slug: "celebrities-pop-culture" },
  { name: "EVs & Automotive", slug: "electric-vehicles-automotive" },
  { name: "Real Estate & Markets", slug: "real-estate-market-news" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // If in admin dashboard, we can return null or render minimal back-to-site link
  const isAdminDashboard = pathname?.startsWith("/admin");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/90 backdrop-blur-md transition-colors dark:border-zinc-800/80 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-white font-serif font-black text-xs transition-transform group-hover:scale-105 dark:bg-white dark:text-zinc-950">
              S2S
            </span>
            <span className="font-serif text-2xl font-black tracking-tight text-zinc-900 transition-colors dark:text-white">
              StateToState<span className="text-blue-500">.</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-6 lg:flex">
            {CATEGORIES.map((cat) => {
              const href = `/category/${cat.slug}`;
              const isActive = pathname === href;
              return (
                <Link
                  key={cat.slug}
                  href={href}
                  className={`text-sm font-medium transition-colors hover:text-zinc-950 dark:hover:text-white ${
                    isActive
                      ? "text-zinc-950 font-bold underline underline-offset-8 decoration-2 decoration-blue-500 dark:text-white"
                      : "text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="flex h-9 items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3.5 text-xs text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-200"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search stories...</span>
          </Link>

          <ThemeToggle />

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 lg:hidden hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-zinc-200 bg-white px-5 py-5 lg:hidden dark:border-zinc-800 dark:bg-zinc-950 shadow-lg">
          <div className="flex flex-col space-y-3.5">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Editorial Beats
            </span>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-zinc-800 hover:text-zinc-950 dark:text-zinc-200 dark:hover:text-white"
              >
                {cat.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-2">
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                About StateToState
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                Contact & Press
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
