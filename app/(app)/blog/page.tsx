import type { Metadata } from "next";
import { Suspense } from "react";

import { PostList } from "@/features/blog/components/post-list";
import { PostListWithSearch } from "@/features/blog/components/post-list-with-search";
import { PostSearchInput } from "@/features/blog/components/post-search-input";
import { getAllPosts } from "@/features/blog/data";
import { Separator } from "@/components/separator";
import Image from "next/image";

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
    <main className="container-wrapper max-w-screen! overflow-x-hidden">
      <div className="relative mx-auto px-0! container md:fixed:max-w-3xl">
        <Separator />
        <Panel id="certs" className="min-h-[calc(100dvh-192px)]">
          <PanelHeader>
            <PanelTitle>Blog</PanelTitle>
          </PanelHeader>
          <div className="p-4">
            <p className="font-mono text-sm text-balance text-muted-foreground">
              {metadata.description}
            </p>
          </div>

        <div className="relative dark aspect-[2.3] p-8 z-2 md:p-12">
          <Image
            src="/ghost.webp"
            alt="Blog Cover"
            fill
            className="object-cover"
          />
        </div>

        <div className="screen-line-before screen-line-after p-2">
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

        <div className="h-4" />
        </Panel>
      </div>
    </main>
  );
}
