import React from "react";
import Link from "next/link";
import { SITE_NAME } from "@/lib/seo";
import { ShieldCheck, Newspaper, Target, Users, Mail, ArrowRight } from "lucide-react";

export const metadata = {
  title: `About Us | ${SITE_NAME}`,
  description: `Learn about ${SITE_NAME}, our editorial mission, journalistic standards, leadership team, and coverage across technology, automotive, real estate, and culture.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
          About The Publication
        </span>
        <h1 className="mt-2 font-serif text-3xl font-black tracking-tight text-zinc-950 sm:text-5xl dark:text-white">
          Independent Journalism with Depth and Clarity.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {SITE_NAME} was established to deliver rigorous, thoughtful, and analytical coverage at the intersection of emerging technology, modern culture, next-generation mobility, and macro real estate economics.
        </p>
      </div>

      {/* Mission & Values */}
      <div className="mt-12 space-y-12">
        <section className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-500" /> Our Editorial Mission
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            In an era of disposable headlines, clickbait aggregation, and superficial social commentary, {SITE_NAME} stands apart by investing in primary source reporting, deep industry context, and objective analysis. We report on developments not as isolated events, but as interconnected systems shaping consumer habits, global capital allocation, and modern living.
          </p>
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            Whether analyzing the shift from conversational chatbots to autonomous software agents, tracking the chemistries unlocking solid-state EV batteries, or investigating downtown office-to-residential repurposing, our coverage is tailored for forward-thinking professionals, investors, and inquisitive readers.
          </p>
        </section>

        {/* Core Coverage Areas */}
        <section className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Newspaper className="h-6 w-6 text-blue-500" /> What We Cover
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/40">
              <h3 className="font-bold text-zinc-900 dark:text-white text-base">
                Tech & Startups
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Founders, venture capital financing, artificial intelligence infrastructure, cybersecurity architectures, and breakthrough software engineering practices.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/40">
              <h3 className="font-bold text-zinc-900 dark:text-white text-base">
                Electric Vehicles & Automotive
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Battery technology, robotaxi deployments, EV charging infrastructure, autonomous driving legislation, and the global automotive manufacturing transition.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/40">
              <h3 className="font-bold text-zinc-900 dark:text-white text-base">
                Real Estate & Market News
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Commercial real estate transformations, residential mortgage rate trends, urban planning innovations, and modern architectural masterpieces.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/40">
              <h3 className="font-bold text-zinc-900 dark:text-white text-base">
                Celebrities & Pop Culture
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Cultural zeitgeist analysis, entertainment streaming business models, the return of theatrical cinema prestige, and digital creator economies.
              </p>
            </div>
          </div>
        </section>

        {/* Editorial Standards */}
        <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/60">
          <h2 className="font-serif text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-500" /> Journalistic Integrity & Standards
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            Our newsroom operates under a rigorous code of journalistic ethics. We maintain strict separation between editorial content and advertising or commercial relationships. Sponsored content or affiliate associations are always explicitly disclosed.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li><strong>Accuracy:</strong> All reporting is fact-checked and verified against primary sources before publication.</li>
            <li><strong>Corrections:</strong> When errors occur, we publish prompt, transparent corrections detailing the change.</li>
            <li><strong>Editorial Independence:</strong> Advertisers and sponsors have zero influence over editorial coverage or opinions.</li>
          </ul>
        </section>

        {/* Connect & Contact Box */}
        <div className="rounded-2xl bg-zinc-900 p-8 text-white dark:bg-zinc-900 dark:border dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-xl font-bold">Have a story pitch or tip?</h3>
            <p className="mt-1 text-sm text-zinc-300">
              Our newsroom welcomes credible leads, executive interviews, and guest editorial submissions.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            <Mail className="h-4 w-4" /> Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}
