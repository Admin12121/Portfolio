import type { Metadata } from "next";
import { Suspense } from "react";

import { PostList } from "@/features/blog/components/post-list";
import { PostListWithSearch } from "@/features/blog/components/post-list-with-search";
import { PostSearchInput } from "@/features/blog/components/post-search-input";
import { getAllPosts } from "@/features/blog/data";
import { Separator } from "@/components/separator";
import { TerminalSymbolHoverGrid } from "@/components/terminal-symbol-hover-grid";

import {
  Panel,
  PanelHeader,
  PanelTitle,
} from "@/features/profile/components/panel";

export const metadata: Metadata = {
  title: "Blog",
  description: "A collection of articles on hacking, security, and ideas.",
};

export default function page() {
  const allPosts = getAllPosts();
  return (
    <main data-blog-page="" className="container-wrapper max-w-screen!">
      <div className="blog-page-frame relative mx-auto px-0! container md:fixed:max-w-6xl">
        <Separator />

        <Panel id="blog-list" className="blog-page-panel">
          <PanelHeader>
            <PanelTitle>Blog</PanelTitle>
          </PanelHeader>
          <div className="p-4">
            <p className="font-mono text-sm text-balance text-muted-foreground">
              {metadata.description}
            </p>
          </div>

          <TerminalSymbolHoverGrid
            src="/ghost.webp"
            alt="Blog cover artwork"
            className="dark"
            priority
          />

          <div className="border-t border-b p-2">
            <Suspense
              fallback={
                <div className="flex h-9 w-full rounded-lg border border-input shadow-xs dark:bg-input/30" />
              }
            >
              <PostSearchInput />
            </Suspense>
          </div>

          <Suspense fallback={<PostList posts={allPosts} />}>
            <PostListWithSearch posts={allPosts} />
          </Suspense>

          <div className="h-4" aria-hidden="true" />
        </Panel>
      </div>
    </main>
  );
}
