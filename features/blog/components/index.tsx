import { CollapsibleList } from "@/components/collapsible-list";
import type { Blog } from "../types/blog";
import { getAllBlogs } from "@/features/blog/data";
import {
  Panel,
  PanelHeader,
  PanelTitle,
} from "@/features/profile/components/panel";
import { BlogItem } from "./blog-items";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Blogs({ banner, className }: { banner?: boolean; className?: string }) {
  const blogs = getAllBlogs();
  return (
    <Panel id="certs" className={cn(className)}>
      <PanelHeader>
        <PanelTitle>Blog</PanelTitle>
      </PanelHeader>
      {banner && (
        <div className="relative dark aspect-[3.2] p-8 z-2 md:p-12">
          <Image
            src="/banner.jpg"
            alt="Blog Cover"
            fill
            className="object-cover"
          />
        </div>
      )}
      <CollapsibleList
        items={blogs}
        max={8}
        renderItem={(item: Blog) => <BlogItem blog={item} />}
      />

    </Panel>
  );
}
