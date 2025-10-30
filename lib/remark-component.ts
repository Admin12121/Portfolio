import path from "node:path";

import { visit } from "unist-util-visit";

import type { UnistNode, UnistTree } from "@/types/unist";

export function remarkComponent() {
  return async (tree: UnistTree) => {
    visit(tree, (node: UnistNode, parent) => {
      // src prop overrides both name and fileName.
      const { value: srcPath } =
        (getNodeAttributeByName(node, "src") as {
          name: string;
          value?: string;
          type?: string;
        }) || {};

      if (node.name === "ComponentSource") {
        const name = getNodeAttributeByName(node, "name")?.value as string;
        const fileName = getNodeAttributeByName(node, "fileName")?.value as
          | string
          | undefined;

        if (!name && !srcPath) {
          return null;
        }

        try {
          let src: string;

          if (srcPath) {
            src = path.join(process.cwd(), srcPath);
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  };
}

function getNodeAttributeByName(node: UnistNode, name: string) {
  return node.attributes?.find((attribute) => attribute.name === name);
}
