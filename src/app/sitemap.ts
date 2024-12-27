import { getAllPosts } from "@/lib/notion";
import { PostType } from "@/types";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const posts = await getAllPosts();

  // ブログ記事のサイトマップエントリー
  const postsEntries = posts.map((post: PostType) => ({
    url: `${baseUrl}/post/${post.slug}`,
    lastModified: post.date,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 固定ページのエントリー
  const staticEntries = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    // 必要に応じて他の固定ページを追加
  ];

  return [...staticEntries, ...postsEntries];
} 