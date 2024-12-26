import Link from "next/link";
import { PostType } from "@/types";
import { TagList } from "./TagList";

export function PostCard({ post }: { post: PostType }) {
  return (
    <article key={post.id} className="space-y-2">
      <time className="text-gray-500">{post.date}</time>
      <h2 className="text-2xl font-bold hover:text-gray-600">
        <Link href={`/post/${post.slug}`}>{post.title}</Link>
      </h2>
      {post.description && <p className="text-gray-600">{post.description}</p>}
      {post.tags && <TagList tags={post.tags} />}
    </article>
  );
}
