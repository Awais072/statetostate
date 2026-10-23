export const SITE_NAME = "StateToState";
export const SITE_TAGLINE = "Independent Journalism Across U.S. State News & Developments";
export const SITE_DESCRIPTION =
  "StateToState is an authoritative digital publication delivering breaking state news, legislative updates, economic developments, and investigative reporting across California, Texas, Florida, New York, and all 50 U.S. states.";

export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  return "http://localhost:3000";
}

export interface PostJsonLdProps {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt?: Date | string | null;
  updatedAt?: Date | string | null;
  coverImage?: string | null;
  authorName: string;
  categoryName: string;
  tags?: string[];
}

export function generateArticleJsonLd(post: PostJsonLdProps) {
  const siteUrl = getSiteUrl();
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const imageUrl = post.coverImage || `${siteUrl}/og-image.jpg`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: postUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    image: imageUrl,
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString(),
    dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : new Date().toISOString(),
    author: {
      "@type": "Person",
      name: post.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    articleSection: post.categoryName,
    keywords: post.tags?.join(", ") || "",
  };
}

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}

export function generateWebSiteJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: siteUrl,
    description: SITE_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
