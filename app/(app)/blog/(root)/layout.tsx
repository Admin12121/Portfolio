import { blog } from "@/lib/source";

import { DocsLayout } from "fumadocs-ui/layouts/docs";

import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={blog.pageTree}
      sidebar={{
        enabled: false,
      }}
    >
      {children}
    </DocsLayout>
  );
}
