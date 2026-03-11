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
import {
  AfterNode,
  BeforeNode,
  InnerNode,
} from "@/features/profile/components/nodes";

export const metadata: Metadata = {
  title: "Blog",
  description: "A collection of articles on hacking, security, and ideas.",
};

export default function page() {
  const allPosts = getAllPosts();
  return (
    <main className="container-wrapper max-w-screen!">
      <div className="relative mx-auto px-0! container md:fixed:max-w-6xl">
        <Separator />
        <InnerNode className="w-full h-full" />
        <InnerNode className="w-full h-full">
          <Panel id="certs" className="min-h-[calc(100dvh-192px)]">
            <BeforeNode pattern="more-than-half-dot-bottom-line" />
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
                priority
              />
            </div>

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

            <div className="h-4" />
            <AfterNode pattern="dot-top-bottom-line-mid" />
          </Panel>
        </InnerNode>
      </div>
    </main>
  );
}
