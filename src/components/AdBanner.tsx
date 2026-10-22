"use client";

import React, { useEffect } from "react";

interface AdBannerProps {
  slotId?: string;
  format?: "auto" | "horizontal" | "rectangle";
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdBanner({
  slotId = "default-slot",
  format = "horizontal",
  className = "",
}: AdBannerProps) {
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch {
      // Ignore if ads blocked or in dev
    }
  }, []);

  return (
    <aside
      aria-label="Advertisement"
      className={`my-8 flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-4 text-center transition-colors dark:border-zinc-800/80 dark:bg-zinc-900/40 ${className}`}
    >
      {/* Required Google AdSense Disclosure Label */}
      <div className="mb-2 text-[10px] font-semibold tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
        Advertisement
      </div>

      {/* Ad Container */}
      <div className="w-full min-h-[90px] flex items-center justify-center">
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ? (
          <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%", textAlign: "center" }}
            data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
            data-ad-slot={slotId}
            data-ad-format={format}
            data-full-width-responsive="true"
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-zinc-400 dark:text-zinc-600">
            <span className="text-xs font-mono">
              [Google AdSense Responsive Unit • {format}]
            </span>
            <span className="text-[11px] mt-1 text-zinc-400">
              Configured & ready for Publisher ID in NEXT_PUBLIC_ADSENSE_CLIENT_ID
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
