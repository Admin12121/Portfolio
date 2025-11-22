import type { Route } from "./+types/page";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import { source } from "@/lib/source";
import type * as PageTree from "fumadocs-core/page-tree";
import defaultMdxComponents from "fumadocs-ui/mdx";
import browserCollections from "fumadocs-mdx:collections/browser";
import { Card, Cards } from "fumadocs-ui/components/card";
import { Callout } from "fumadocs-ui/components/callout";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { Feedback } from "@/components/feedback";
import { onRateAction } from "@/lib/github";
import { Link } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
  const slugs = params["*"].split("/").filter((v) => v.length > 0);
  const page = source.getPage(slugs);
  if (!page) throw new Response("Not found", { status: 404 });

  return {
    path: page.path,
    tree: source.getPageTree(),
  };
}

const clientLoader = browserCollections.docs.createClientLoader({
  component({ toc, default: Mdx, frontmatter }) {
    return (
      <DocsPage
        toc={toc}
        lastUpdate={frontmatter.date}
      >
        <title>{frontmatter.title}</title>
        <meta name="description" content={frontmatter.description} />
        <DocsTitle>{frontmatter.title}</DocsTitle>
        <DocsDescription>{frontmatter.description}</DocsDescription>
        <div className="prose flex-1 text-fd-foreground/90 border-t pt-5">
          <DocsBody>
            <Mdx
              components={{
                ...defaultMdxComponents,
                Card,
                Cards,
                Callout,
                Tab,
                Tabs,
                Accordion,
                Accordions,
                CodeBlock,
                Pre,
                // AutoTypeTable,
                Link,
              }}
            />
            <Feedback onRateAction={onRateAction} />
          </DocsBody>
        </div>
      </DocsPage>
    );
  },
});

export default function Page({ loaderData }: Route.ComponentProps) {
  const { tree, path } = loaderData;
  const Content = clientLoader.getComponent(path);

  return (
    <DocsLayout
      tree={tree as PageTree.Root}
      sidebar={{
        enabled: false,
      }}
    >
      <main className="mx-auto md:max-w-3xl">
        <Content />
      </main>
    </DocsLayout>
  );
}
