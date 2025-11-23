import type { Metadata } from "next";
import { source, blog } from "@/lib/source";
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

export default async function Page(props: PageProps<"/blog/[...slug]">) {
  const params = await props.params;
  const page = blog.getPage(params.slug);

  if (!page)
    return (
      <NotFound />
      // <NotFound getSuggestions={() => getSuggestions(params.slug.join(' '))} />
    );

  const { body: Mdx, toc } = await page.data.load();
  console.log(page.data)
  return (
    <DocsPage
      toc={toc}
      lastUpdate={page.data.date ? new Date(page.data.date) : undefined}
      // full={page.data.full}
    >
      <title>{page.data.title}</title>
      <meta name="description" content={page.data.description} />
      <h1 className="text-[1.75em] font-semibold">{page.data.title}</h1>
      <p className="text-lg text-fd-muted-foreground mb-2">
        {page.data.description}
      </p>
      <div className="prose flex-1 text-fd-foreground/90 border-t pt-5">
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
            AutoTypeTable,
            Link,
          }}
        ></Mdx>
      </div>
      <Feedback onRateAction={onRateAction} />
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}


export async function generateMetadata(
  props: PageProps<'/docs/[...slug]'>,
): Promise<Metadata> {
  const { slug = [] } = await props.params;
  const page = source.getPage(slug);
  if (!page)
    return createMetadata({
      title: 'Not Found',
    });

  const description =
    page.data.description ?? 'The library for building documentation sites';

  const image = {
    url: getPageImage(page).url,
    width: 1200,
    height: 630,
  };

  return createMetadata({
    title: page.data.title,
    description,
    openGraph: {
      url: `/docs/${page.slugs.join('/')}`,
      images: [image],
    },
    twitter: {
      images: [image],
    },
  });
}
