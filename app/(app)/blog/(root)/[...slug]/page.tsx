import { type ComponentProps, type FC } from "react";
import type { Metadata } from "next";
import { blog } from "@/lib/source";
import defaultComponents from "fumadocs-ui/mdx";
import { Card, Cards } from "fumadocs-ui/components/card";
import { Callout } from "fumadocs-ui/components/callout";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { AutoTypeTable } from "fumadocs-typescript/ui";
import { createMetadata, getPageImage } from "@/lib/metadata";
import { Banner } from "fumadocs-ui/components/banner";
import { PathUtils } from "fumadocs-core/source";
import { Wrapper } from "@/components/preview/wrapper";
import Link from "next/link";
import { Feedback } from "@/components/feedback";
import { onRateAction } from "@/lib/github";
import { NotFound } from "@/components/not-found";
import { Mermaid } from "@/components/mdx/mermaid";
import { TypeTable } from "fumadocs-ui/components/type-table";
import { FramedImage, YouTubeEmbed } from "@/components/embed";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { InlineTOC } from "@/components/inline-toc";
import { Separator } from "@/components/separator";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import {
  findNeighbour,
  getAllPosts,
  getPostBySlug,
} from "@/features/blog/data";
import { LLMCopyButtonWithViewOptions } from "@/features/blog/components/post-page-actions";
import { PostShareMenu } from "@/features/blog/components/post-share-menu";

export default async function Page(props: PageProps<"/blog/[...slug]">) {
  const params = await props.params;
  const page = blog.getPage(params.slug);

  if (!page) return <NotFound />;

  const { body: Mdx, toc } = await page.data.load();
  const allPosts = getAllPosts();
  const { previous, next } = findNeighbour(allPosts, params.slug[0]);

  return (
    <main className="mx-auto md:max-w-3xl border-x">
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

        <div className="flex items-center gap-2">
          <LLMCopyButtonWithViewOptions
            markdownUrl={`${getPostUrl(params.slug[0])}.mdx`}
          />

          <PostShareMenu url={getPostUrl(params.slug[0])} />

          {previous && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="icon-sm" asChild>
                  <Link href={`/blog/${previous.slug}`}>
                    <ArrowLeftIcon />
                    <span className="sr-only">Previous</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="pr-2 pl-3">
                <div className="flex items-center gap-3">
                  Previous Blog
                  <Kbd>
                    <ArrowLeftIcon />
                  </Kbd>
                </div>
              </TooltipContent>
            </Tooltip>
          )}

          {next && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="icon-sm" asChild>
                  <Link href={`/blog/${next.slug}`}>
                    <ArrowRightIcon />
                    <span className="sr-only">Next</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="pr-2 pl-3">
                <div className="flex items-center gap-3">
                  Next Blog
                  <Kbd>
                    <ArrowRightIcon />
                  </Kbd>
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
      <Separator />

      <article className="p-6 max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{page.data.title}</h1>
          <p className="text-lg text-muted-foreground mb-4">
            {page.data.description}
          </p>
          <InlineTOC items={toc} />
        </header>

        <div className="prose prose-invert max-w-none">
          <Mdx
            components={{
              ...defaultComponents,
              Card,
              Cards,
              Callout,
              Tab,
              Tabs,
              a: ({ href, ...props }) => {
                const found = blog.getPageByHref(href ?? "", {
                  dir: PathUtils.dirname(page.path),
                });

                if (!found) return <Link href={href} {...props} />;

                return (
                  <HoverCard>
                    <HoverCardTrigger
                      href={
                        found.hash
                          ? `${found.page.url}#${found.hash}`
                          : found.page.url
                      }
                      {...props}
                    >
                      {props.children}
                    </HoverCardTrigger>
                    <HoverCardContent className="text-sm">
                      <p className="font-medium">{found.page.data.title}</p>
                      <p className="text-muted-foreground">
                        {found.page.data.description}
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                );
              },
              Accordion,
              Accordions,
              Banner,
              TypeTable,
              Wrapper,
              blockquote: Callout as unknown as FC<
                ComponentProps<"blockquote">
              >,
              CodeBlock,
              Pre,
              Mermaid,
              AutoTypeTable,
              Link,
              YouTubeEmbed,
              FramedImage,
            }}
          />
        </div>

        <Separator className="my-8" />
        <Feedback onRateAction={onRateAction} />
      </article>
    </main>
  );
}

export async function generateStaticParams() {
  return blog.generateParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const post = getPostBySlug(slug);

  if (!post)
    return createMetadata({
      title: "Not Found",
    });

  const { title, description, createdAt, updatedAt } = post.metadata;

  const image = {
    url: getPageImage(slug).url,
    width: 1920,
    height: 1080,
    alt: title,
  };

  return createMetadata({
    title: title,
    description,
    openGraph: {
      url: `/blog/${slug}`,
      type: "article",
      publishedTime: new Date(createdAt).toISOString(),
      modifiedTime: new Date(updatedAt).toISOString(),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      images: [image],
    },
  });
}

function getPostUrl(slug: string) {
  return `/blog/${slug}`;
}