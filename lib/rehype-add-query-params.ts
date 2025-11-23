import { visit } from "unist-util-visit";

import type { Plugin } from "unified";

export const rehypeAddQueryParams: Plugin<[Record<string, string>]> = (
  params,
) => {
  return (tree) => {
    visit(tree, (node: any) => {
      if (
        node?.type !== "element" ||
        node?.tagName !== "a" ||
        !node?.properties?.href
      ) {
        return;
      }

      const href = node.properties.href as string;

      if (
        !href ||
        href.startsWith("/") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#")
      ) {
        return;
      }

      node.properties.href = addQueryParams(href, params);
    });
  };
};

export function urlToName(url: string) {
  return url.replace(/(^\w+:|^)\/\//, "");
}

export function addQueryParams(
  urlString: string,
  query: Record<string, string>,
): string {
  try {
    const url = new URL(urlString);

    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, value);
    }

    return url.toString();
  } catch {
    return urlString;
  }
}
