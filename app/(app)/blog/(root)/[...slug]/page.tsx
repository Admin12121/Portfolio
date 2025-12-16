import type { Metadata } from "next";
import { blog } from "@/lib/source";
import { DocsPage } from "fumadocs-ui/page";
import defaultComponents from "fumadocs-ui/mdx";
import { Card, Cards } from "fumadocs-ui/components/card";
import { Callout } from "fumadocs-ui/components/callout";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { AutoTypeTable } from "fumadocs-typescript/ui";
import { createMetadata, getPageImage } from "@/lib/metadata";
import Link from "next/link";
import { Feedback } from "@/components/feedback";
import { onRateAction } from "@/lib/github";
import { NotFound } from "@/components/not-found";
import { Mermaid } from "@/components/mdx/mermaid";
import { FramedImage, YouTubeEmbed } from "@/components/embed";

import { InlineTOC } from "@/components/inline-toc";
import { Separator } from "@/components/separator";
import { Button } from "@/components/ui/button";

import { ArrowLeftIcon } from "lucide-react";

export default async function Page(props: PageProps<"/blog/[...slug]">) {
  const params = await props.params;
  const page = blog.getPage(params.slug);

  if (!page)
    return (
      <NotFound />
      // <NotFound getSuggestions={() => getSuggestions(params.slug.join(' '))} />
    );

  const { body: Mdx, toc } = await page.data.load();
  return (
    <main className="mx-auto md:max-w-3xl border-x ">
      <Separator className="border-t-0" />
      <div className="flex items-center justify-between p-2 pl-4">
        <Button
          className="h-7 gap-2 rounded-lg px-0 font-mono text-muted-foreground"
          variant="link"
          asChild
        >
          <Link href="/blog">
            <ArrowLeftIcon />
            Blog
          </Link>
        </Button>
      </div>
      <Separator />
      <DocsPage
        article={{
          className: "pt-[15px]!",
        }}
        lastUpdate={page.data.date ? new Date(page.data.date) : undefined}
      >
        <title>{page.data.title}</title>
        <meta name="description" content={page.data.description} />
        <h1 className="text-[1.75em] font-semibold">{page.data.title}</h1>
        <p className="text-lg text-fd-muted-foreground mb-2">
          {page.data.description}
        </p>
        <InlineTOC items={toc} />
        <div className="prose flex-1 text-fd-foreground/90 pt-5">
          <Mdx
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
              Mermaid,
              AutoTypeTable,
              Link,
              YouTubeEmbed,
              FramedImage,
            }}
          ></Mdx>
        </div>
        <Feedback onRateAction={onRateAction} />
      </DocsPage>
    </main>
  );
}

export async function generateStaticParams() {
  return blog.generateParams();
}

export async function generateMetadata(
  props: PageProps<"/blog/[...slug]">,
): Promise<Metadata> {
  const { slug = [] } = await props.params;
  const page = blog.getPage(slug);

  if (!page)
    return createMetadata({
      title: "Not Found",
    });

  const description =
    page.data.description ?? "The library for building documentation sites";

  const image = {
    url: getPageImage(page).url,
    width: 1920,
    height: 1080,
  };

  return createMetadata({
    title: page.data.title,
    description,
    openGraph: {
      url: `/blog/${page.slugs.join("/")}`,
      images: [image],
    },
    twitter: {
      images: [image],
    },
  });
}
