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
              {SITE_TAGLINE}. We provide rigorous, long-form journalism delivering in-depth reporting, legislative analysis, and timely developments from across the United States.
            </p>
            <div className="text-xs text-zinc-500 dark:text-zinc-500">
              © {new Date().getFullYear()} {SITE_NAME}. All rights reserved. Content published under strict editorial standards.
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              State News Beats
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/category/california"
                  className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  California
                </Link>
              </li>
              <li>
                <Link
                  href="/category/texas"
                  className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  Texas
                </Link>
              </li>
              <li>
                <Link
                  href="/category/florida"
                  className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  Florida
                </Link>
              </li>
              <li>
                <Link
                  href="/category/new-york"
                  className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  New York
                </Link>
              </li>
              <li>
                <Link
                  href="/category/other-states"
                  className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  Other States
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
