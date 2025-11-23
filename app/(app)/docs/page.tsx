import { source } from "@/lib/source";
import { DocsPage } from "fumadocs-ui/page";
import { useMDXComponents as getMDXComponents } from "@/mdx-components";
import * as Twoslash from "fumadocs-twoslash/ui";
import { Callout } from "fumadocs-ui/components/callout";
import { TypeTable } from "fumadocs-ui/components/type-table";
import { Mermaid } from "@/components/mdx/mermaid";
import { Wrapper } from "@/components/preview/wrapper";
import { Banner } from "fumadocs-ui/components/banner";
import { Feedback } from "@/components/feedback";
import { onRateAction } from "@/lib/github";
import { Card, Cards } from "fumadocs-ui/components/card";
import { getPageTreePeers } from "fumadocs-core/page-tree";

export const revalidate = false;

export default async function DocsIndexPage() {
  const firstPageChild = source.pageTree.children.find(
    (child: any) =>
      child &&
      typeof child === "object" &&
      "url" in child &&
      typeof (child as any).url === "string",
  ) as { url: string } | undefined;

  const page =
    source.getPage(["index"]) ||
    source.getPage([]) ||
    (firstPageChild
      ? source.getPage(
          (firstPageChild as { url: string }).url
            .replace(/^\/docs\/?/, "")
            .split("/")
            .filter(Boolean),
        )
      : null);

  if (!page) {
    return (
      <div className="py-20 text-center">
        Index page missing. Ensure content/docs/index.mdx exists and includes
        frontmatter:
        {`title: ...`} and `index: true`
      </div>
    );
  }
  const { body: Mdx, toc } = await page.data.load();

  return (
    <DocsPage
      toc={toc}
      lastUpdate={page.data.date ? new Date(page.data.date) : undefined}
    >
      <h1 className="text-[1.75em] font-semibold">{page.data.title}</h1>
      <p className="text-lg text-fd-muted-foreground mb-2">
        {page.data.description}
      </p>
      <div className="prose flex-1 text-fd-foreground/90">
        <Mdx
          components={getMDXComponents({
            ...Twoslash,
            Banner,
            Mermaid,
            TypeTable,
            Wrapper,
            blockquote: Callout as any,
          })}
        />
        {page.data.index ? (
          <Cards>
            {getPageTreePeers(source.pageTree, page.url).map((peer) => (
              <Card key={peer.url} title={peer.name} href={peer.url}>
                {peer.description}
              </Card>
            ))}
          </Cards>
        ) : null}
      </div>
      <Feedback onRateAction={onRateAction} />
    </DocsPage>
  );
}
