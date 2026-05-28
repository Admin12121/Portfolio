import type { Metadata } from "next";

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
import { Separator as SeparatorUI } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowLeftIcon, ArrowRightIcon, LinkIcon } from "lucide-react";
import ComesInGoesOutUnderline from "@/components/global/comes-in-goes-out-underline";
// parse title: support `Left | Right` and Markdown link `Left [Right](url)`
import {
  findNeighbour,
  getAllWriteups,
  getWriteupBySlug,
} from "@/features/ctf-writeups/data";
import { LLMCopyButtonWithViewOptions } from "@/features/blog/components/post-page-actions";
import { PostShareMenu } from "@/features/blog/components/post-share-menu";
import { ctfWriteups } from "@/lib/source";

export default async function Page(
  props: PageProps<"/ctf-writeups/[...slug]">,
) {
  const params = await props.params;
  const page = ctfWriteups.getPage(params.slug);

  if (!page) return <NotFound />;

  const { body: Mdx, toc } = await page.data.load();
  const allWriteups = getAllWriteups();
  const { previous, next } = findNeighbour(allWriteups, params.slug[0]);
  const rawTitle = page.data.title ?? "";
  let titleLeft = rawTitle;
  let titleRight = "";
  let titleHref: string | undefined = undefined;

  // Extract markdown link if present. Supports formats like:
  // "Obfuscated - [Netanix Ctf](https://...)" or "Obfuscated [Netanix Ctf](...)"
  const mdLinkMatch = rawTitle.match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (mdLinkMatch) {
    const linkText = mdLinkMatch[1].trim();
    const href = mdLinkMatch[2].trim();
    // derive left by removing the link markdown and any trailing separators/dashes
    const left = rawTitle
      .replace(mdLinkMatch[0], "")
      .replace(/[-–—]\s*$/g, "")
      .trim();
    titleLeft = left || rawTitle;
    titleRight = linkText;
    titleHref = href;
  }

  return (
    <main className="mx-auto md:max-w-6xl ">
      <div className="flex items-center justify-between p-2 pl-4 border-x">
        <Button
          className="h-7 gap-2 rounded-lg px-0 font-mono text-muted-foreground"
          variant="link"
          asChild
        >
          <Link href="/ctf-writeups">
            <ArrowLeftIcon />
            CTF Writeups
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <LLMCopyButtonWithViewOptions
            markdownUrl={`${getWriteupUrl(params.slug[0])}.mdx`}
          />

          <PostShareMenu url={getWriteupUrl(params.slug[0])} />

          {previous && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="icon-sm" asChild>
                  <Link href={`/ctf-writeups/${previous.slug}`}>
                    <ArrowLeftIcon />
                    <span className="sr-only">Previous</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="pr-2 pl-3">
                <div className="flex items-center gap-3">
                  Previous Writeup
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
                  <Link href={`/ctf-writeups/${next.slug}`}>
                    <ArrowRightIcon />
                    <span className="sr-only">Next</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="pr-2 pl-3">
                <div className="flex items-center gap-3">
                  Next Writeup
                  <Kbd>
                    <ArrowRightIcon />
                  </Kbd>
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
      <SeparatorUI />
      <article className="relative max-w-6xl mx-auto ">
        <header className="relative border-x">
          <div className="p-6 isolate overflow-clip">
            <h1 className="text-4xl font-bold mb-4">
              {titleRight ? (
                <>
                  <span>{titleLeft} </span>
                  {titleHref ? (
                    <ComesInGoesOutUnderline
                      as="a"
                      href={titleHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2"
                    >
                      <span >
                        {titleRight}
                      </span>
                    </ComesInGoesOutUnderline>
                  ) : (
                    <span className="text-muted-foreground">{titleRight}</span>
                  )}
                  <LinkIcon className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
              ) : (
                page.data.title
              )}
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              {page.data.description}
            </p>
            <svg className="pointer-events-none absolute inset-0 z-[-1] size-full select-none text-gray-500 dark:text-blue-400/10 mask-l-from-10% mask-l-to-90% opacity-40 dark:opacity-80">
              <defs>
                <pattern
                  id=":Sg:"
                  width="4"
                  height="4"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(45)"
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  ></line>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#:Sg:)" />
            </svg>
          </div>
        </header>
        <SeparatorUI />
        <div className="flex gap-10 p-6 max-w-none border-x">
          <div className="prose prose-invert ">
            <Mdx
              components={{
                ...defaultComponents,
                Card,
                Cards,
                Callout,
                Tab,
                Tabs,
                a: ({ href, ...props }) => {
                  const found = ctfWriteups.getPageByHref(href ?? "", {
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
                blockquote: Callout as unknown as React.FC<
                  React.ComponentProps<"blockquote">
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
          <InlineTOC
            className="sticky max-w-xs w-full top-20 max-h-[calc(100dvh-6rem)] pr-1"
            items={toc}
          />
        </div>
      </article>
      <Separator />
      <div className="w-full h-full relative">
        <Feedback onRateAction={onRateAction} />
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  return ctfWriteups.generateParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const writeup = getWriteupBySlug(slug);

  if (!writeup)
    return createMetadata({
      title: "Not Found",
    });

  const { title, description, createdAt, updatedAt } = writeup.metadata;

  const image = {
    url: getPageImage(["ctf-writeups"].concat(slug)).url,
    width: 1920,
    height: 1080,
    alt: title,
  };

  return createMetadata({
    title: title,
    description,
    openGraph: {
      url: `/ctf-writeups/${slug}`,
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

function getWriteupUrl(slug: string) {
  return `/ctf-writeups/${slug}`;
}
