// app/(templates)/minimalist/page.tsx

import { getAllPosts, getDatabase } from "@/lib/notion";
import Image from "next/image";
import { PostCard } from "@/components/post/PostCard";
import { Pagination } from "@/components/common/Pagination";
import { PostType } from "@/types";

const POSTS_PER_PAGE = 5;

export default async function MinimalistBlog({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = Number(searchParams.page) || 1;
  const posts = await getAllPosts();
  const dbInfo = await getDatabase();

  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const offset = (currentPage - 1) * POSTS_PER_PAGE;
  const currentPosts = posts.slice(offset, offset + POSTS_PER_PAGE);

  return (
    <div className="max-w-2xl mx-auto px-4">
      {dbInfo.cover && (
        <Image
          src={dbInfo.cover}
          width={768}
          height={578}
          alt="cover image"
          className="rounded object-cover"
        />
      )}

      <div className="space-y-12 my-4">
        {currentPosts.map((post: PostType) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
