import type { Post } from "../types/blog";
import { PostItem } from "./post-item";
import { CollapsibleList } from "@/components/collapsible-list";

export function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CollapsibleList
          items={posts}
          max={8}
          renderItem={(item: Post) => <PostItem post={item} />}
        />

        {posts.length === 0 && (
          <div className="screen-line-before screen-line-after p-4">
            <p className="font-mono text-sm">No posts found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
