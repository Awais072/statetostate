import React from "react";
import { SITE_NAME } from "@/lib/seo";

export const metadata = {
  title: `Privacy Policy | ${SITE_NAME}`,
  description: `Privacy Policy and data protection terms for ${SITE_NAME}, including disclosure of Google AdSense cookies, log files, and user rights.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
          Legal & Compliance
        </span>
        <h1 className="mt-2 font-serif text-3xl font-black tracking-tight text-zinc-950 sm:text-5xl dark:text-white">
          Privacy Policy
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-zinc-500">
          Last Updated: October 2026 • Effective Date: October 2026
        </p>
      </div>

      <div className="mt-10 space-y-8 text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-white">
            1. Introduction
          </h2>
          <p>
            At <strong>{SITE_NAME}</strong> (accessible from our website), the privacy of our visitors is of paramount importance to us. This Privacy Policy document outlines the types of information that is collected and recorded by {SITE_NAME} and how we utilize it.
          </p>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact our compliance team at <a href="mailto:privacy@statetostate.com" className="text-blue-600 dark:text-blue-400 underline">privacy@statetostate.com</a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-white">
            2. Google AdSense & Third-Party Advertising (Crucial Disclosure)
          </h2>
          <p>
            {SITE_NAME} works with third-party vendors, including <strong>Google AdSense</strong>, to serve advertisements when you visit our website.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>
              <strong>DoubleClick DART Cookie:</strong> Google, as a third-party vendor, uses cookies to serve ads on {SITE_NAME}. Google&apos;s use of the DART cookie enables it to serve ads to our users based on their visits to this site and other sites on the Internet.
            </li>
            <li>
              <strong>Opt-Out Options:</strong> Users may opt out of personalized advertising by visiting the <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">Google Ads Settings</a>. Alternatively, users can opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">aboutads.info</a>.
            </li>
            <li>
              These third-party ad servers or ad networks use technology in their respective advertisements and links that appear on {SITE_NAME}, which are sent directly to users&apos; browsers. They automatically receive your IP address when this occurs. Other technologies (such as cookies, JavaScript, or Web Beacons) may also be used by the third-party ad networks to measure the effectiveness of their advertisements and/or to personalize the advertising content that you see on websites that you visit.
            </li>
            <li>
              Note that {SITE_NAME} has no access to or control over these cookies that are used by third-party advertisers.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-white">
            3. Log Files
          </h2>
          <p>
            {SITE_NAME} follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as part of hosting services&apos; analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users&apos; movement on the website, and gathering demographic information.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-white">
            4. Cookies and Web Beacons
          </h2>
          <p>
            Like any other website, {SITE_NAME} uses &quot;cookies&quot;. These cookies are used to store information including visitors&apos; preferences (such as light/dark theme preference), and the pages on the website that the visitor accessed or visited. The information is used to optimize the users&apos; experience by customizing our web page content based on visitors&apos; browser type and/or other information.
          </p>
          <p>
            You can choose to disable cookies through your individual browser options. Detailed information about cookie management with specific web browsers can be found at the browsers&apos; respective websites.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-white">
            5. CCPA Privacy Rights (Do Not Sell My Personal Information)
          </h2>
          <p>
            Under the California Consumer Privacy Act (CCPA), California consumers have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li>Request that a business disclose the categories and specific pieces of personal data collected.</li>
            <li>Request that a business delete any personal data about the consumer that has been collected.</li>
            <li>Request that a business that sells personal data, not sell the consumer&apos;s personal data. <em>({SITE_NAME} does not sell personal information to third parties).</em></li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-white">
            6. GDPR Data Protection Rights
          </h2>
          <p>
            We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
            <li><strong>The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate.</li>
            <li><strong>The right to erasure:</strong> You have the right to request that we erase your personal data, under certain conditions.</li>
            <li><strong>The right to restrict processing:</strong> You have the right to request that we restrict the processing of your personal data.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-white">
            7. Children&apos;s Information
          </h2>
          <p>
            Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. {SITE_NAME} does not knowingly collect any Personal Identifiable Information from children under the age of 13.
          </p>
        </section>

        <section className="space-y-3 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-white">
            8. Contact Us
          </h2>
          <p>
            If you have questions or concerns about our Privacy Policy or your data, please contact:
          </p>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 text-xs font-mono">
            StateToState Privacy & Compliance Desk<br />
            Email: privacy@statetostate.com<br />
            Website: https://statetostate.com
          </div>
        </section>
      </div>
    </div>
  );
}
