import { visit } from "unist-util-visit";

import type { UnistNode, UnistTree } from "@/types/unist";

export function rehypeAddQueryParams(params: Record<string, string>) {
  return (tree: UnistTree) => {
    visit(tree, (node: UnistNode) => {
      if (
        node.type !== "element" ||
        node?.tagName !== "a" ||
        !node?.properties?.href
      ) {
        return;
      }

      const href = node.properties?.href as string | undefined;

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
}


export function urlToName(url: string) {
  return url.replace(/(^\w+:|^)\/\//, "");
}

export function addQueryParams(
  urlString: string,
  query: Record<string, string>
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