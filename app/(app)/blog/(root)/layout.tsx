import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      sidebar={{
        enabled: false,
      }}      
    >
      <main className="mx-auto md:max-w-3xl">{children}</main>
    </DocsLayout>
  );
}
