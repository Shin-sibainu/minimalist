import { getPostBySlug } from "@/lib/notion";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: "Post not found",
      description: "The requested post could not be found.",
    };
  }

  const title = post.title;
  const description = post.description || "No description available";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      images: [{
        url: `/post/${params.slug}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: title,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/post/${params.slug}/opengraph-image`],
    },
  };
} 