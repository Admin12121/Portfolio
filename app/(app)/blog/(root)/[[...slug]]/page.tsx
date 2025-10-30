import { source } from "@/lib/source";
import { DocsPage } from "fumadocs-ui/page";
import defaultComponents from "fumadocs-ui/mdx";
import { Card, Cards } from "fumadocs-ui/components/card";
import { Callout } from "fumadocs-ui/components/callout";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { AutoTypeTable } from "fumadocs-typescript/ui";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Feedback } from "@/components/feedback";
import { onRateAction } from "@/lib/github";
// import { onRateAction, owner, repo } from "@/lib/github";
// import { getPageTreePeers } from "fumadocs-core/page-tree";
// import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const page = source.getPage(slug);

  if (!page) {
    notFound();
  }

  const MDX = page.data.body;
  const { lastModified } = page.data;

  return (
    <DocsPage
      toc={page.data.toc}
      lastUpdate={lastModified ? new Date(lastModified) : undefined}
      full={page.data.full}
    >
      <h1 className="text-[1.75em] font-semibold">{page.data.title}</h1>
      <p className="text-lg text-fd-muted-foreground mb-2">
        {page.data.description}
      </p>
      <div className="prose flex-1 text-fd-foreground/90 border-t pt-5">
        <MDX
          components={{
            ...defaultComponents,
            Card,
            Cards,
            Callout,
            Tab,
            Tabs,
            Accordion,
            Accordions,
            CodeBlock,
            Pre,
            AutoTypeTable,
            Link,
          }}
        ></MDX>
      </div>
      <Feedback onRateAction={onRateAction} />
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = source.getPage(slug);

  if (!page) {
    notFound();
  }

  return {
    title: page.data.title,
    description: page.data.description,
  };
}

