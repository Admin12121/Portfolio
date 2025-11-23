import type { Metadata } from "next";
import { type ComponentProps, type FC, type ReactNode } from "react";
import * as Twoslash from "fumadocs-twoslash/ui";
import { Callout } from "fumadocs-ui/components/callout";
import { TypeTable } from "fumadocs-ui/components/type-table";
import * as Preview from "@/components/preview";
import { createMetadata, getPageImage } from "@/lib/metadata";
import { source } from "@/lib/source";
import { Wrapper } from "@/components/preview/wrapper";
import { Mermaid } from "@/components/mdx/mermaid";
import { Feedback } from "@/components/feedback";
import { onRateAction, owner, repo } from "@/lib/github";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Link from "fumadocs-core/link";
import { getPageTreePeers } from "fumadocs-core/page-tree";
import { Card, Cards } from "fumadocs-ui/components/card";
import { useMDXComponents as getMDXComponents } from "@/mdx-components";
import { Banner } from "fumadocs-ui/components/banner";
import { Installation } from "@/components/preview/installation";
import { Customisation } from "@/components/preview/customisation";
import { DocsPage } from "fumadocs-ui/page";
import { NotFound } from "@/components/not-found";
// import { getSuggestions } from '@/app/docs/[...slug]/suggestions';
import { PathUtils } from "fumadocs-core/source";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { AutoTypeTable } from "fumadocs-typescript/ui";

function PreviewRenderer({ preview }: { preview: string }): ReactNode {
  if (preview && preview in Preview) {
    const Comp = Preview[preview as keyof typeof Preview];
    return <Comp />;
  }

  return null;
}

export const revalidate = false;

export default async function Page(props: PageProps<"/docs/[...slug]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page)
    return (
      <NotFound />
      // <NotFound getSuggestions={() => getSuggestions(params.slug.join(' '))} />
    );

  const { body: Mdx, toc } = await page.data.load();

  return (
    <DocsPage
      toc={toc}
      lastUpdate={page.data.date ? new Date(page.data.date) : undefined}
    >
      <title>{page.data.title}</title>
      <meta name="description" content={page.data.description} />
      <div className="prose flex-1 text-fd-foreground/90">
        {page.data.preview && <PreviewRenderer preview={page.data.preview} />}
        <Mdx
          components={getMDXComponents({
            ...Twoslash,
            a: ({ href, ...props }) => {
              const found = source.getPageByHref(href ?? "", {
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
                    <p className="text-fd-muted-foreground">
                      {found.page.data.description}
                    </p>
                  </HoverCardContent>
                </HoverCard>
              );
            },
            Banner,
            Mermaid,
            TypeTable,
            Wrapper,
            CodeBlock,
            Pre,
            AutoTypeTable,
            blockquote: Callout as unknown as FC<ComponentProps<"blockquote">>,
            DocsCategory: ({ url }) => {
              return <DocsCategory url={url ?? page.url} />;
            },
            Installation,
            Customisation,
          })}
        />
        {page.data.index ? <DocsCategory url={page.url} /> : null}
      </div>
      <Feedback onRateAction={onRateAction} />
    </DocsPage>
  );
}

function DocsCategory({ url }: { url: string }) {
  return (
    <Cards>
      {getPageTreePeers(source.pageTree, url).map((peer) => (
        <Card key={peer.url} title={peer.name} href={peer.url}>
          {peer.description}
        </Card>
      ))}
    </Cards>
  );
}

export async function generateMetadata(
  props: PageProps<"/docs/[...slug]">,
): Promise<Metadata> {
  const { slug = [] } = await props.params;
  const page = source.getPage(slug);
  if (!page)
    return createMetadata({
      title: "Not Found",
    });

  const description =
    page.data.description ?? "The library for building documentation sites";

  const image = {
    url: getPageImage(page).url,
    width: 1200,
    height: 630,
  };

  return createMetadata({
    title: page.data.title,
    description,
    openGraph: {
      url: `/docs/${page.slugs.join("/")}`,
      images: [image],
    },
    twitter: {
      images: [image],
    },
  });
}

export function generateStaticParams() {
  return source.generateParams();
}
