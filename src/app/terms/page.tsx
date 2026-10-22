import React from "react";
import { SITE_NAME } from "@/lib/seo";

export const metadata = {
  title: `Terms and Conditions | ${SITE_NAME}`,
  description: `Terms and conditions governing the use of ${SITE_NAME}, its articles, commentary systems, and services.`,
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
          User Agreement
        </span>
        <h1 className="mt-2 font-serif text-3xl font-black tracking-tight text-zinc-950 sm:text-5xl dark:text-white">
          Terms & Conditions
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-zinc-500">
          Last Updated: October 2026 • Governing Terms of Service
        </p>
      </div>

      <div className="mt-10 space-y-8 text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-white">
            1. Agreement to Terms
          </h2>
          <p>
            By accessing or using <strong>{SITE_NAME}</strong>, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you disagree with any part of these terms, you may not access the service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-white">
            2. Intellectual Property Rights
          </h2>
          <p>
            Unless otherwise indicated, all original articles, essays, commentary, graphics, and code on {SITE_NAME} are the proprietary property of {SITE_NAME} and protected by copyright, trademark, and other intellectual property laws.
          </p>
          <p>
            You are granted a limited license to access and view the content for personal, non-commercial use. Quotation or excerpting of articles is permitted provided prominent attribution and an active hyperlink back to the original article on {SITE_NAME} is included. Full republishing or syndication without written permission is prohibited.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-white">
            3. User-Generated Content & Comments
          </h2>
          <p>
            {SITE_NAME} provides comment sections on articles to encourage constructive discussion. By submitting comments, you grant {SITE_NAME} a perpetual, worldwide, royalty-free license to publish, display, and moderate your contribution.
          </p>
          <p>
            You agree not to post content that is defamatory, abusive, harassing, illegal, or that constitutes commercial solicitation or spam. We reserve the absolute right to edit, decline, or remove any comment without prior notice.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-white">
            4. Disclaimers & No Financial / Legal Advice
          </h2>
          <p>
            The content provided on {SITE_NAME}—including coverage of financial markets, commercial real estate, corporate investments, venture capital, and automotive technology—is published solely for general informational and journalistic purposes.
          </p>
          <p>
            Nothing published on {SITE_NAME} constitutes financial, legal, investment, or tax advice. Readers should consult certified financial or legal professionals prior to making significant financial or property commitments.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-white">
            5. Limitation of Liability
          </h2>
          <p>
            In no event shall {SITE_NAME}, its editors, authors, directors, or affiliates be liable for any indirect, consequential, exemplary, incidental, or punitive damages arising from your access or inability to access the website.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-white">
            6. External Links & Advertisements
          </h2>
          <p>
            {SITE_NAME} may contain links to third-party websites or services and displays third-party advertisements (such as Google AdSense). We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
          </p>
        </section>

        <section className="space-y-3 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-white">
            7. Governing Law & Contact
          </h2>
          <p>
            These Terms shall be governed by and defined following the laws of the United States. For any inquiries regarding these terms, please contact:
          </p>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 text-xs font-mono">
            StateToState Legal Affairs<br />
            Email: legal@statetostate.com
          </div>
        </section>
      </div>
    </div>
  );
}
