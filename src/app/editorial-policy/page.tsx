import React from "react";
import { SITE_NAME } from "@/lib/seo";
import { ShieldCheck, CheckCircle2, AlertCircle, FileCheck, Brain } from "lucide-react";

export const metadata = {
  title: `Editorial & Ethics Policy | ${SITE_NAME}`,
  description: `Fact-checking standards, corrections policy, journalistic independence, and AI content guidelines at ${SITE_NAME}.`,
};

export default function EditorialPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
          Trust & Accountability
        </span>
        <h1 className="mt-2 font-serif text-3xl font-black tracking-tight text-zinc-950 sm:text-5xl dark:text-white">
          Editorial & Ethics Policy
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-zinc-500">
          Our standards of verification, independence, corrections, and AI usage.
        </p>
      </div>

      <div className="mt-10 space-y-10 text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
        <section className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-500" />
            1. Core Journalistic Principles
          </h2>
          <p>
            At <strong>{SITE_NAME}</strong>, we are committed to reporting that is accurate, honest, independent, and fair. Our correspondents and editors follow strict professional codes when conducting interviews, analyzing financial filings, testing mobility hardware, and reporting on cultural trends.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            2. Fact-Checking & Verification
          </h2>
          <p>
            All factual claims, technical specifications, statistics, and historical attributions undergo verification prior to release:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li>Primary source documents (SEC filings, peer-reviewed battery research, municipal permits) are prioritized over secondary news summaries.</li>
            <li>Direct quotes are never altered in substance or context.</li>
            <li>Anonymous sources are only utilized when disclosure presents professional or personal jeopardy, and their credibility is verified by a senior editor.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            3. Corrections & Clarifications
          </h2>
          <p>
            Despite our rigorous standards, errors can occur. When a factual mistake is identified, we act swiftly to rectify it:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li>Substantive factual corrections are highlighted with a transparent notice at the end or beginning of the article stating what was changed and when.</li>
            <li>Typographical or grammatical fixes that do not alter meaning are updated directly.</li>
            <li>Readers who identify potential errors are encouraged to email <a href="mailto:corrections@statetostate.com" className="text-blue-600 dark:text-blue-400 underline">corrections@statetostate.com</a>.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            4. Artificial Intelligence Usage Guidelines
          </h2>
          <p>
            In alignment with 2026 digital publishing ethics, {SITE_NAME} enforces a transparent policy regarding artificial intelligence tools:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li>All articles published on {SITE_NAME} are researched, outlined, verified, and authored under human editorial stewardship.</li>
            <li>AI tools may be used for research synthesis, grammar checks, or transcript assistance, but never to author unverified factual narratives.</li>
            <li>Synthetic media, AI-generated imagery, or data simulations are explicitly labeled as such in captions.</li>
          </ul>
        </section>

        <section className="space-y-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-white">
            5. Independence from Advertisers
          </h2>
          <p>
            No advertiser, sponsor, or external partner has approval rights or editorial oversight over our coverage. Our advertising operations (including programmatic ad slots through Google AdSense) remain strictly isolated from editorial decision-making.
          </p>
        </section>
      </div>
    </div>
  );
}
