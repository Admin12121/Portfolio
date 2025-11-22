import { visit } from "unist-util-visit";
import type { Root } from "mdast";
import type {
  MdxJsxFlowElement,
  MdxJsxTextElement,
} from "mdast-util-mdx";

function isMdxJsx(
  node: unknown
): node is MdxJsxFlowElement | MdxJsxTextElement {
  return (
    !!node &&
    typeof node === "object" &&
    "type" in (node as any) &&
    (((node as any).type as string) === "mdxJsxFlowElement" ||
      ((node as any).type as string) === "mdxJsxTextElement")
  );
}

export function remarkComponent() {
  return async function transformer(tree: Root) {
    const isServer = typeof window === "undefined";
    let nodePath: typeof import("node:path") | null = null;

    if (isServer) {
      nodePath = await import("node:path");
    }

    visit(tree, (node) => {
      if (!isMdxJsx(node)) return;

      const attrs = node.attributes || [];

      const srcAttr = attrs.find((a: any) => a.name === "src");
      const nameAttr = attrs.find((a: any) => a.name === "name");
      const fileNameAttr = attrs.find((a: any) => a.name === "fileName");

      const srcPath = (srcAttr?.value as string | undefined) || "";
      const name = (nameAttr?.value as string | undefined) || "";
      const fileName = fileNameAttr?.value as string | undefined;

      if (!name && !srcPath) return;

      // Server-only logic
      if (!isServer || !nodePath) return;

      try {
        if (srcPath) {
          const resolved = nodePath.join(process.cwd(), srcPath);
          // Optionally attach the resolved path for downstream use:
          // (node as any).data = { ...(node as any).data, resolvedSource: resolved };
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("[remarkComponent] resolve error:", error);
      }
    });
  };
}
