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

interface NotionBlock {
  value: {
    type: string;
    format?: {
      page_cover?: string;
      page_icon?: string;
    };
    properties?: {
      title?: string[][];
      description?: string[][];
      role?: string[][];
      twitter?: string[][];
      github?: string[][];
      linkedin?: string[][];
      skills?: string[][];
    };
  };
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  description: string;
  excerpt: string;
  content: any;
  author: {
    name: string;
    image: string;
    bio: string;
  };
  coverImage: string;
  tags: string[];
  featured: boolean;
  icon?: string | null;
}

//notion-api-worker and react-notion
// export const getAllPosts = cache(async () => {
//   try {
//     const res = await fetch(`${NOTION_API_BASE}/table/${NOTION_PAGE_ID}`, {
//       next: { revalidate: 10 },
//     });

//     if (!res.ok) {
//       console.error(`Failed to fetch posts: ${res.status}`);
//       console.error(`Notion Page ID: ${NOTION_PAGE_ID}`);
//       throw new Error(`Failed to fetch posts: ${res.status}`);
//     }

//     const posts = await res.json();

//     return posts
//       .filter((post: any) => post.Public)
//       .map((post: any) => {
//         const date = post.Published
//           ? new Date(post.Published).toISOString().split("T")[0]
//           : new Date().toISOString().split("T")[0];

//         return {
//           id: post.id,
//           title: post.Name || "無題",
//           slug: post.Slug || `untitled-${post.id}`,
//           date,
//           author: post.Author,
//           tags: Array.isArray(post.Tags) ? post.Tags : [],
//           description: post.Description || "",
//         };
//       })
//       .sort((a: any, b: any) => {
//         return new Date(b.date).getTime() - new Date(a.date).getTime();
//       });
//   } catch (error) {
//     console.error("Error fetching all posts:", error);
//     return [];
//   }
// });

export const getAllPosts = cache(async (): Promise<Post[]> => {
  try {
    const res = await fetch(`${NOTION_API_BASE}/table/${NOTION_PAGE_ID}`, {
      next: { revalidate: 10 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch posts: ${res.status}`);
    }

    const posts = await res.json();

    // 各投稿のページ情報を取得してカバー画像を取得
    const postsWithCover = await Promise.all(
      posts
        .filter((post: any) => post.Public)
        .map(async (post: any) => {
          const pageRes = await fetch(`${NOTION_API_BASE}/page/${post.id}`);
          const page = await pageRes.json();

          // ページの最初のブロックを取得し、その値を確認
          const firstBlock = Object.values(page).find(
            (block): block is NotionBlock =>
              (block as NotionBlock)?.value?.type === "page"
          );

          // カバー画像の処理を修正
          let coverImage = "/default-cover.jpg";
          if (firstBlock?.value?.format?.page_cover) {
            const coverUrl = firstBlock.value.format.page_cover;
            if (coverUrl.startsWith("https://prod-files-secure")) {
              // S3のURLの場合
              coverImage = `https://www.notion.so/image/${encodeURIComponent(
                coverUrl
              )}?table=block&id=${post.id}&width=3840`;
            } else if (coverUrl.startsWith("/images")) {
              // Notionの内部画像の場合
              coverImage = `https://www.notion.so${coverUrl}`;
            } else {
              // その他のURLの場合
              coverImage = `https://www.notion.so/image/${encodeURIComponent(
                coverUrl
              )}?table=block&id=${post.id}&width=3840`;
            }
          }

          // アイコンの処理
          let icon = null;
          if (firstBlock?.value?.format?.page_icon) {
            const pageIcon = firstBlock.value.format.page_icon;
            if (
              pageIcon.length === 1 ||
              pageIcon.length === 2 ||
              pageIcon.startsWith("🏺") // 絵文字の場合
            ) {
              // 絵文字の場合
              icon = pageIcon;
            } else if (pageIcon.startsWith("http")) {
              // 画像URLの場合
              icon = pageIcon;
            } else if (pageIcon.includes("notion.so")) {
              // Notion内部の絵文字URLの場合
              try {
                const decodedIcon = decodeURIComponent(pageIcon);
                if (decodedIcon.startsWith("🏺")) {
                  icon = decodedIcon;
                } else {
                  icon = pageIcon;
                }
              } catch {
                icon = pageIcon;
              }
            }
          }

          // アイコンの処理
          let authorImage = post.AuthorImage || "/default-avatar.png";
          if (firstBlock?.value?.format?.page_icon) {
            const pageIcon = firstBlock.value.format.page_icon;
            if (
              pageIcon.length === 1 ||
              pageIcon.length === 2 ||
              pageIcon.startsWith("🏺") // 絵文字の場合
            ) {
              // 絵文字の場合
              authorImage = pageIcon;
            } else if (pageIcon.startsWith("http")) {
              // 画像URLの場合
              authorImage = pageIcon;
            } else if (pageIcon.includes("notion.so")) {
              // Notion内部の絵文字URLの場合
              try {
                const decodedIcon = decodeURIComponent(pageIcon);
                if (decodedIcon.startsWith("🏺")) {
                  authorImage = decodedIcon;
                } else {
                  authorImage = pageIcon;
                }
              } catch {
                authorImage = pageIcon;
              }
            }
          }

          const date = post.Published
            ? new Date(post.Published).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0];

          return {
            id: post.id,
            title: post.Name || "無題",
            slug: post.Slug || `untitled-${post.id}`,
            date,
            author: {
              name: post.Author || "匿名",
              image: authorImage,
              bio: post.AuthorBio || "",
            },
            coverImage,
            tags: Array.isArray(post.Tags) ? post.Tags : [],
            description: post.Description || "",
            excerpt: post.Description || "",
            content: "",
            featured: post.Featured || false,
            icon,
          };
        })
    );

    return postsWithCover.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return [];
  }
});

// export const getPostBySlug = cache(async (slug: string) => {
//   try {
//     const posts = await getAllPosts();
//     const post = posts.find((p: any) => p.slug === slug);

//     if (!post || !post.title) return null;

//     const res = await fetch(`${NOTION_API_BASE}/page/${post.id}`, {
//       next: { revalidate: 10 },
//     });

//     if (!res.ok) {
//       throw new Error(`Failed to fetch post content: ${res.status}`);
//     }

//     const page = await res.json();

//     if (
//       !page ||
//       typeof page !== "object" ||
//       Object.keys(page).length === 0 ||
//       !Object.values(page).some(
//         (block: any) =>
//           block?.value?.type === "page" &&
//           block?.value?.properties?.title?.[0]?.[0]
//       )
//     ) {
//       console.error(`Invalid page content for slug ${slug}`);
//       return null;
//     }

//     return {
//       ...post,
//       content: page,
//     };
//   } catch (error) {
//     console.error(`Error fetching post with slug ${slug}:`, error);
//     return null;
//   }
// });

export const getPostBySlug = cache(async (slug: string) => {
  try {
    const posts = await getAllPosts();
    const post = posts.find((p: any) => p.slug === slug);

    if (!post || !post.title) return null;

    // NotionAPIを使用してrecordMapを取得
    const recordMap = await notion.getPage(post.id);

    // アイコンの取得
    const block = Object.values(recordMap.block)[0]?.value;
    let icon = null;

    if (block?.format?.page_icon) {
      const pageIcon = block.format.page_icon;
      if (
        pageIcon.length === 1 ||
        pageIcon.length === 2 ||
        pageIcon.startsWith("🏺") // 絵文字の場合
      ) {
        // 絵文字の場合
        icon = pageIcon;
      } else if (pageIcon.startsWith("http")) {
        // 画像URLの場合
        icon = pageIcon;
      } else if (pageIcon.includes("notion.so")) {
        // Notion内部の絵文字URLの場合
        try {
          const decodedIcon = decodeURIComponent(pageIcon);
          if (decodedIcon.startsWith("🏺")) {
            icon = decodedIcon;
          } else {
            icon = pageIcon;
          }
        } catch {
          icon = pageIcon;
        }
      }
    }

    return {
      ...post,
      content: recordMap,
      icon,
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
        ? (() => {
            const coverUrl = block.format.page_cover;
            if (coverUrl.startsWith("/images")) {
              return `https://www.notion.so${coverUrl}`;
            } else if (coverUrl.startsWith("https://prod-files-secure")) {
              return `https://www.notion.so/image/${encodeURIComponent(
                coverUrl
              )}?table=block&id=${block.id}&width=3840`;
            } else {
              return `https://www.notion.so/image/${encodeURIComponent(
                coverUrl
              )}?table=block&id=${block.id}&width=3840`;
            }
          })()
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
