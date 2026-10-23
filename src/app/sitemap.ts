import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { getSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  let posts: any[] = [];
  let categories: any[] = [];
  let tags: any[] = [];

  try {
    const [dbPosts, dbCategories, dbTags] = await Promise.all([
      prisma.post.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true, publishedAt: true },
      }),
      prisma.category.findMany({
        select: { slug: true, updatedAt: true },
      }),
      prisma.tag.findMany({
        select: { slug: true, updatedAt: true },
      }),
    ]);
    posts = dbPosts;
    categories = dbCategories;
    tags = dbTags;
  } catch (error) {
    console.error("Sitemap DB fallback:", error);
  }

  const postUrls = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt || post.publishedAt || new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const categoryUrls = categories.map((cat) => ({
    url: `${siteUrl}/category/${cat.slug}`,
    lastModified: cat.updatedAt || new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const tagUrls = tags.map((tag) => ({
    url: `${siteUrl}/tag/${tag.slug}`,
    lastModified: tag.updatedAt || new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const staticTrustUrls = [
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${siteUrl}/editorial-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ];

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...staticTrustUrls,
    ...postUrls,
    ...categoryUrls,
    ...tagUrls,
  ];
}
