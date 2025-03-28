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
      next: { revalidate: 10 },
    });

    if (!res.ok) {
      console.error(`Failed to fetch posts: ${res.status}`);
      console.error(`Notion Page ID: ${NOTION_PAGE_ID}`);
      throw new Error(`Failed to fetch posts: ${res.status}`);
    }

    const posts = await res.json();

    return posts
      .filter((post: any) => post.Public)
      .map((post: any) => {
        const date = post.Published
          ? new Date(post.Published).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0];

        return {
          id: post.id,
          title: post.Name || "無題",
          slug: post.Slug || `untitled-${post.id}`,
          date,
          author: post.Author,
          tags: Array.isArray(post.Tags) ? post.Tags : [],
          description: post.Description || "",
        };
      })
      .sort((a: any, b: any) => {
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

    if (!post || !post.title) return null;

    const res = await fetch(`${NOTION_API_BASE}/page/${post.id}`, {
      next: { revalidate: 10 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch post content: ${res.status}`);
    }

    const page = await res.json();

    if (
      !page ||
      typeof page !== "object" ||
      Object.keys(page).length === 0 ||
      !Object.values(page).some(
        (block: any) =>
          block?.value?.type === "page" &&
          block?.value?.properties?.title?.[0]?.[0]
      )
    ) {
      console.error(`Invalid page content for slug ${slug}`);
      return null;
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

    // アイコンの処理を修正
    let icon;
    if (block?.format?.page_icon) {
      // 絵文字の場合は直接その文字を使用
      if (
        block.format.page_icon.length === 1 ||
        block.format.page_icon.length === 2
      ) {
        icon = block.format.page_icon; // 絵文字をそのまま返す
      } else {
        // 画像URLの場合は変換処理
        icon = `https://www.notion.so/image/${encodeURIComponent(
          block.format.page_icon
        )}?table=block&id=${block.id}&cache=v2`;
      }
    }

    // データベースのプロパティから追加情報を取得
    const properties = block?.properties || {};
    const author = properties.author?.[0]?.[0];
    const site = properties.site?.[0]?.[0];

    const result = {
      icon,
      cover: block?.format?.page_cover
        ? block.format.page_cover.startsWith("/images")
          ? `https://www.notion.so${block.format.page_cover}`
          : block.format.page_cover
        : undefined,
      title: block?.properties?.title?.[0]?.[0] || undefined,
      coverPosition: block?.format?.page_cover_position || 0.5,
      // 追加の情報
      author,
      site,
    };

    return result;
  } catch (error) {
    console.error("Failed to fetch database:", error);
    return {
      icon: undefined,
      cover: undefined,
      title: "Minimalist",
      coverPosition: 0.5,
      author: undefined,
      site: undefined,
    };
  }
});
