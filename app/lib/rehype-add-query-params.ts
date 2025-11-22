import { visit } from "unist-util-visit";
import type { Root, Element } from "hast";

export function rehypeAddQueryParams(params: Record<string, string>) {
  return function transformer(tree: Root) {
    visit(tree, "element", (node: Element) => {
      if (
        node.tagName !== "a" ||
        !node.properties ||
        typeof node.properties.href !== "string"
      ) {
        return;
      }

      const href = node.properties.href;

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
