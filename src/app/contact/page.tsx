"use client";

import React, { useState } from "react";
import { SITE_NAME } from "@/lib/seo";
import { Mail, MessageSquare, Send, CheckCircle2, Clock, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("Editorial Inquiry");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("error");
      setFeedback("Please fill out all required fields.");
      return;
    }

    setStatus("submitting");

    // Simulate sending message or recording
    setTimeout(() => {
      setStatus("success");
      setFeedback(
        "Thank you for contacting StateToState! Your message has been received by our editorial desk. We typically respond within 24 to 48 business hours."
      );
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 800);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
          Get In Touch
        </span>
        <h1 className="mt-2 font-serif text-3xl font-black tracking-tight text-zinc-950 sm:text-5xl dark:text-white">
          Contact StateToState
        </h1>
        <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Whether you have a story pitch, correction, copyright inquiry, or advertising question, our team is ready to assist you.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Contact Channels */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/60 shadow-xs space-y-6">
            <h2 className="font-serif text-lg font-bold text-zinc-900 dark:text-white">
              Direct Inquiries
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                    Editorial Desk & News Tips
                  </div>
                  <a
                    href="mailto:editorial@statetostate.com"
                    className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                  >
                    editorial@statetostate.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                    Advertising & Sponsorships
                  </div>
                  <a
                    href="mailto:advertising@statetostate.com"
                    className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                  >
                    advertising@statetostate.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                    Operating Hours & Turnaround
                  </div>
                  <div className="text-xs text-zinc-500">
                    Monday – Friday, 9:00 AM – 6:00 PM EST. Response within 24–48 hours.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                    Editorial Headquarters
                  </div>
                  <div className="text-xs text-zinc-500">
                    StateToState Media Group, New York, NY, United States.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/60 shadow-xs">
            <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-white">
              Send Us a Message
            </h2>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Please provide complete details so we can route your message to the appropriate editor.
            </p>

            {status === "success" ? (
              <div className="mt-6 rounded-2xl bg-emerald-50 p-6 text-sm text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-semibold text-base">Message Sent Successfully</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed">{feedback}</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alexander Hamilton"
                      className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:focus:bg-zinc-900 dark:text-zinc-100 dark:focus:text-white dark:focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alexander@example.com"
                      className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:focus:bg-zinc-900 dark:text-zinc-100 dark:focus:text-white dark:focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Department / Reason *
                    </label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 focus:border-zinc-900 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:focus:bg-zinc-900 dark:text-zinc-100 dark:focus:text-white dark:focus:border-blue-500 transition-colors"
                    >
                      <option value="Editorial Inquiry">Editorial Inquiry / News Tip</option>
                      <option value="Advertising">Advertising / Google AdSense / Sponsor</option>
                      <option value="Correction">Factual Correction Request</option>
                      <option value="Copyright">Copyright / DMCA Notice</option>
                      <option value="General">General Question</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. EV Battery Article Question"
                      className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:focus:bg-zinc-900 dark:text-zinc-100 dark:focus:text-white dark:focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Message Details *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide as much context as possible..."
                    className="mt-1 w-full rounded-xl border border-zinc-300 bg-zinc-50 p-3.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:focus:bg-zinc-900 dark:text-zinc-100 dark:focus:text-white dark:focus:border-blue-500 transition-colors"
                  />
                </div>

                {status === "error" && (
                  <div className="text-xs text-red-600 dark:text-red-400 font-medium">{feedback}</div>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  {status === "submitting" ? "Transmitting..." : "Send Dispatch"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
