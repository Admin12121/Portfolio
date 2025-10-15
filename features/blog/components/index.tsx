import { CollapsibleList } from "@/components/collapsible-list";
import type { Blog } from "../types/blog";
import { getAllBlogs } from "@/features/blog/data";
import {
  Panel,
  PanelHeader,
  PanelTitle,
} from "@/features/profile/components/panel";
import { BlogItem } from "./blog-items";

export function Blogs() {
  const blogs = getAllBlogs();
  return (
    <Panel id="certs">
      <PanelHeader>
        <PanelTitle>Blog</PanelTitle>
      </PanelHeader>
      <CollapsibleList
        items={blogs}
        max={8}
        renderItem={(item: Blog) => <BlogItem blog={item} />}
      />
    </Panel>
  );
}
