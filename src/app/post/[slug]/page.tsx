/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPostBySlug, getAllPosts } from "@/lib/notion";
import dynamic from "next/dynamic";
import { Metadata } from "next";

const NotionContent = dynamic(
  () => import("@/components/notion/NotionContent"),
  { ssr: false }
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "記事が見つかりません",
      description: "お探しの記事は見つかりませんでした。",
    };
  }

  // descriptionのフォールバック処理
  const description =
    post.description ||
    post.excerpt || // もしexcerptフィールドがある場合
    `${post.title}に関する記事です。${
      post.author ? `著者: ${post.author}` : ""
    }` ||
    "ブログ記事の説明";

  return {
    title: post.title,
    description, // フォールバック付きのdescription
    openGraph: {
      title: post.title,
      description, // 同じdescriptionを使用
      type: "article",
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      images: [
        {
          url: `/post/${slug}/opengraph-image.png`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description, // 同じdescriptionを使用
      images: [`/post/${slug}/opengraph-image.png`],  
      creator: post.author ? `@${post.author}` : undefined,
      site: "@your_site_handle",
    },
  };
}

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts();
    return posts.map((post: any) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return []; // エラー時は空の配列を返す
  }
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const post = await getPostBySlug(slug);

  if (!post) {
    return (
      <div className="text-center text-gray-600 py-12">
        記事が見つかりませんでした
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <div className="mt-4 text-gray-500">
            <time>{post.date}</time>
            {post.author && <span className="ml-4">By {post.author}</span>}
          </div>
          {post.tags && (
            <div className="flex gap-2 mt-4">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="text-sm bg-gray-100 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>
        <div className="prose prose-lg prose-blue max-w-none">
          <NotionContent content={post.content} />
        </div>
      </article>
    </div>
  );
}
