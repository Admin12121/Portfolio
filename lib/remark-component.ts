import path from "node:path";
import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Root } from "mdast";

/**
 * Options for the remarkComponent plugin.
 * (Currently unused but reserved for future configuration.)
 */
export interface RemarkComponentOptions {
  /**
   * Optional base directory used to resolve relative src paths.
   * Defaults to process.cwd().
   */
  baseDir?: string;
}

/**
 * A remark plugin that scans MDX JSX elements named `ComponentSource`
 * and resolves their `src` attribute to an absolute filesystem path.
 *
 * It augments the node with `data.componentSource` so downstream tools
 * can access resolved information without re-parsing attributes.
 *
 * Expected MDX:
 *   <ComponentSource name="Button" src="src/components/button.tsx" />
 *
 * Augmented node shape:
 *   {
 *     type: 'mdxJsxFlowElement',
 *     name: 'ComponentSource',
 *     data: {
 *       componentSource: {
 *         name: 'Button',
 *         fileName: 'button.tsx',
 *         resolvedPath: '/abs/path/to/src/components/button.tsx'
 *       }
 *     }
 *   }
 */
export const remarkComponent: Plugin<[RemarkComponentOptions?], Root> = (
  options = {},
) => {
  const baseDir = options.baseDir || process.cwd();

  return (tree) => {
    visit(tree, (node: any) => {
      // We only care about MDX JSX nodes
      if (
        !node ||
        (node.type !== "mdxJsxFlowElement" &&
          node.type !== "mdxJsxTextElement") ||
        node.name !== "ComponentSource"
      ) {
        return;
      }

      const srcPath = getAttribute(node, "src");
      const explicitName = getAttribute(node, "name");
      const fileNameAttr = getAttribute(node, "fileName");

      // If neither name nor src provided, nothing to do.
      if (!explicitName && !srcPath) return;

      try {
        let resolvedPath: string | undefined;

        if (srcPath) {
          resolvedPath = path.isAbsolute(srcPath)
            ? srcPath
            : path.join(baseDir, srcPath);
        }

        const fileName =
          fileNameAttr ||
          (resolvedPath ? path.basename(resolvedPath) : undefined);

        // Attach metadata to node.data for downstream consumption.
        node.data = {
          ...(node.data || {}),
          componentSource: {
            name: explicitName || fileName || srcPath || "UnknownComponent",
            fileName,
            resolvedPath,
            originalSrc: srcPath,
          },
        };
      } catch (err) {
        // Non-fatal; log and continue.
        // Avoid throwing to keep the remark pipeline resilient.
        // eslint-disable-next-line no-console
        console.error(
          `[remarkComponent] Failed to process ComponentSource: ${(err as Error).message}`,
        );
      }
    });
  };
};

/**
 * Attempt to get an attribute value from an MDX JSX node.
 * Supports both classic { name: string, value: any } and mdx AST shape
 * where attributes can hold expression objects. We only extract static string values.
 */
function getAttribute(node: any, name: string): string | undefined {
  if (!Array.isArray(node.attributes)) return undefined;

  for (const attr of node.attributes) {
    if (!attr || typeof attr !== "object") continue;

    // MDX v2 attribute shape: { type: 'mdxJsxAttribute', name, value }
    if (attr.name === name) {
      // Literal string
      if (typeof attr.value === "string") return attr.value;

      // { type: 'mdxJsxAttributeValueExpression', value: 'source code' } unsupported here
      // You could optionally evaluate or skip; for safety we ignore non-string values.
      return undefined;
    }
  }

  return undefined;
}

export default remarkComponent;
