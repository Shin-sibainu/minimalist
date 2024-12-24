/* eslint-disable @typescript-eslint/no-explicit-any */
// app/lib/notion.ts
// https://splitbee.io/blog/notion-as-cms-using-nextjs
// Notionデータ取得用の関数を改善
import { NotionAPI } from "notion-client";
import { getPageImageUrls } from "notion-utils";
import { cache } from "react";

const NOTION_API_BASE = "https://notion-api.splitbee.io/v1";
const NOTION_PAGE_ID = process.env.NOTION_PAGE_ID as string;

const notion = new NotionAPI();

//notion-api-worker and react-notion
export const getAllPosts = cache(async () => {
  try {
    const res = await fetch(`${NOTION_API_BASE}/table/${NOTION_PAGE_ID}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`Failed to fetch posts: ${res.status}`);
      console.error(`Notion Page ID: ${NOTION_PAGE_ID}`);
      throw new Error(`Failed to fetch posts: ${res.status}`);
    }

    const posts = await res.json();

    return posts
      .filter((post: any) => post.Public)
      .map((post: any) => ({
        id: post.id,
        title: post.Name,
        slug: post.Slug,
        date: post.Published,
        author: post.Author,
        tags: post.Tags,
        description: post.Description,
      }))
      .sort((a: any, b: any) => {
        // 日付の新しい順にソート
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return [];
  }
});

export const getPostBySlug = cache(async (slug: string) => {
  try {
    const posts = await getAllPosts();
    const post = posts.find((p: any) => p.slug === slug);

    if (!post) return null;

    const res = await fetch(`${NOTION_API_BASE}/page/${post.id}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch post content: ${res.status}`);
    }

    const page = await res.json();

    if (!page || typeof page !== "object") {
      console.error(`Invalid page content for slug ${slug}`);
      return {
        ...post,
        content: {}, // 空のオブジェクトをフォールバックとして返す
      };
    }

    return {
      ...post,
      content: page,
    };
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return null;
  }
});

// react-notion-x
export const getDatabase = cache(async () => {
  try {
    const recordMap = await notion.getPage(NOTION_PAGE_ID);

    getPageImageUrls(recordMap, {
      mapImageUrl: (url: string, block: any) => {
        if (url.startsWith("/images")) {
          return `https://www.notion.so${url}`;
        }

        if (url.startsWith("https://prod-files-secure")) {
          const encoded = encodeURIComponent(url);
          return `https://www.notion.so/image/${encoded}?table=block&id=${block.id}&cache=v2`;
        }

        return url;
      },
    });

    const block = Object.values(recordMap.block)[0]?.value;

    if (!block) {
      throw new Error("No block data found");
    }

    // URLの変換処理を利用
    const iconUrl = block?.format?.page_icon
      ? `https://www.notion.so/image/${encodeURIComponent(
          block.format.page_icon
        )}?table=block&id=${block.id}&cache=v2`
      : undefined;

    const coverUrl = block?.format?.page_cover
      ? block.format.page_cover.startsWith("/images")
        ? `https://www.notion.so${block.format.page_cover}`
        : block.format.page_cover
      : undefined;

    const result = {
      icon: iconUrl,
      cover: coverUrl,
      title: block?.properties?.title?.[0]?.[0] || undefined,
      coverPosition: block?.format?.page_cover_position || 0.5,
    };

    return result;
  } catch (error) {
    console.error("Failed to fetch database:", error);

    // フォールバック値を返す
    return {
      icon: undefined,
      cover: undefined,
      title: "Minimalist",
      coverPosition: 0.5,
    };
  }
});
