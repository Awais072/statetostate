# StateToState — Modern Full-Stack Publishing Platform

A modern, minimal, high-performance, and fully responsive editorial blogging platform built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **Prisma ORM**.

Optimized for **Core Web Vitals**, **Google AdSense monetization**, and **Advanced SEO** (automated JSON-LD structured data, dynamic XML sitemaps, and robots.txt).

---

## 🌟 Core Topics & Editorial Beats
- **Tech & Startups** (AI Agents, VC rounds, software paradigms)
- **Celebrities & Pop Culture** (Zeitgeist, cinema prestige, streaming economics)
- **Electric Vehicles (EVs) & Automotive** (Solid-state batteries, autonomous driving, robotaxis)
- **Real Estate & Market News** (Office-to-residential repurposing, architecture, macro rates)

---

## ⚡ Tech Stack
- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) with Server-Side Rendering (SSR) & Incremental Static Regeneration (ISR).
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with custom `@custom-variant dark` class-based theme switching and zero unstyled flash.
- **Database & ORM:** [Prisma 6](https://www.prisma.io/) with local SQLite (zero-config local development) and instant PostgreSQL/MySQL compatibility.
- **Authentication:** Edge-compatible JWT authentication via `jose` and `bcryptjs` with HTTP-only cookie security and route middleware.
- **Rich Text Editor:** Dual-mode (Write / Split / Preview) Markdown & WYSIWYG editor with live Google SERP simulation, automated reading-time calculator, and custom slug generator.
- **Monetization & Trust Suite:** Google AdSense-ready with root `ads.txt`, responsive ad placement slots (`AdBanner`), and all mandatory compliance pages (About, Contact, Privacy Policy, Terms & Conditions, Editorial Ethics).

---

## 🚀 Quickstart Guide

### 1. Clone & Install Dependencies
```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Blog
npm install
```

### 2. Configure Environment Variables
Copy the provided `.env.example` file to create your `.env`:
```bash
cp .env.example .env
```

Default `.env` configuration (ready for local development):
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="a7f8e329591e1d0c5a2428c9f0e1b2c3d4e5f60718293a4b5c6d7e8f90123456"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
ADMIN_NAME="StateToState Admin"
ADMIN_EMAIL="admin@statetostate.com"
ADMIN_PASSWORD="AdminPassword123!"
NEXT_PUBLIC_ADSENSE_CLIENT_ID=""
```

### 3. Initialize & Seed Database
Sync the Prisma database schema and populate realistic articles across all 4 niches:
```bash
# Push schema to SQLite
npx prisma db push

# Seed initial categories, tags, posts, comments, and admin credentials
npm run seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Admin Dashboard & Security
The admin dashboard is isolated from public headers and footers for security.

- **Admin Login:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Default Credentials:**
  - **Email:** `admin@statetostate.com`
  - **Password:** `AdminPassword123!`
  *(Includes an "Auto-fill Demo Admin Credentials" button for testing).*
- **Automatic Inactivity Logout:** For enterprise-grade security, idle sessions automatically terminate after **15 minutes** of inactivity, redirecting to the login screen.
- **Direct Route Protection:** All `/admin/*` routes require a validated JWT session via Next.js middleware and return HTTP 307 redirects to unauthenticated requests.

---

## 📈 Google AdSense & SEO Highlights
- **AdSense Compliance:** Root [`/ads.txt`](public/ads.txt) with Google direct seller authorization.
- **Required Trust Pages:**
  - [`/about`](src/app/about/page.tsx) — Editorial vision, beat coverage, and journalistic standards.
  - [`/contact`](src/app/contact/page.tsx) — Departmental inquiries and response turnaround.
  - [`/privacy`](src/app/privacy/page.tsx) — CCPA, GDPR, log files, and DoubleClick DART cookies disclosures.
  - [`/terms`](src/app/terms/page.tsx) — User agreements, IP licensing, and disclaimers.
  - [`/editorial-policy`](src/app/editorial-policy/page.tsx) — Fact-checking and AI content guidelines.
- **Automated XML Sitemap:** Available at [`/sitemap.xml`](src/app/sitemap.ts).
- **Automated Robots.txt:** Available at [`/robots.txt`](src/app/robots.ts).
- **Structured Data:** Embeds Schema.org `BlogPosting`, `BreadcrumbList`, and `WebSite` JSON-LD for rich snippets on Google Search.

---

## 🛠 Available Scripts
- `npm run dev` — Launch development server with Turbopack.
- `npm run build` — Build optimized production bundle.
- `npm run start` — Run production server.
- `npm run seed` — Re-seed database with realistic articles and taxonomies.
- `npx prisma studio` — Open Prisma GUI data browser.

---

## 📄 License
MIT License. Created for StateToState Media Group.
