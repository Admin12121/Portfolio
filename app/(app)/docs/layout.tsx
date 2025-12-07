import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/lib/source";
import "katex/dist/katex.min.css";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{ enabled: false }}
      sidebar={{
        tabs: false,
        collapsible: false,
      }}
      searchToggle={{
        enabled: false,
      }}
      themeSwitch={{
        enabled: false
      }}
    >
      <main className="mx-auto md:max-w-3xl">{children}</main>
    </DocsLayout>
  );
}
