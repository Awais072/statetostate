import React from "react";
import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/seo";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-zinc-200 bg-white transition-colors dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-zinc-900 text-white font-serif font-black text-[11px] dark:bg-white dark:text-zinc-950">
                S2S
              </span>
              <span className="font-serif text-xl font-black tracking-tight text-zinc-900 dark:text-white">
                {SITE_NAME}<span className="text-blue-500">.</span>
              </span>
            </Link>
            <p className="max-w-md text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {SITE_TAGLINE}. We provide rigorous, long-form journalism deciphering the technological, architectural, automotive, and cultural vectors shaping modern society.
            </p>
            <div className="text-xs text-zinc-500 dark:text-zinc-500">
              © {new Date().getFullYear()} {SITE_NAME}. All rights reserved. Content published under strict editorial standards.
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Editorial Beats
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/category/tech-startups"
                  className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  Tech & Startups
                </Link>
              </li>
              <li>
                <Link
                  href="/category/celebrities-pop-culture"
                  className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  Celebrities & Pop Culture
                </Link>
              </li>
              <li>
                <Link
                  href="/category/electric-vehicles-automotive"
                  className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  Electric Vehicles & Automotive
                </Link>
              </li>
              <li>
                <Link
                  href="/category/real-estate-market-news"
                  className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  Real Estate & Market News
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal, Trust & Transparency (Required for Google AdSense) */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Trust & Transparency
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/editorial-policy"
                  className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  Editorial & Ethics Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
