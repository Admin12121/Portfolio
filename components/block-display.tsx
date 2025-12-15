import * as React from "react";
import { type registryItemFileSchema } from "shadcn/schema";
import { type z } from "zod";

import { highlightCode } from "@/lib/highlight-code";
import {
  createFileTreeForRegistryItemFiles,
  getRegistryCatalog,
} from "@/lib/registry";
import { BlockViewer } from "@/components/block-viewer";

export type ProjectTreeNode = {
  name: string;
  kind: "category" | "project";
  projectName?: string;
  children?: ProjectTreeNode[];
};

export type ProjectData = {
  item: Awaited<ReturnType<typeof getCachedCatalog>>[number]["item"];
  categoryPath: string[];
  tree: ReturnType<typeof createFileTreeForRegistryItemFiles> | null;
  highlightedFiles: Awaited<ReturnType<typeof getCachedHighlightedFiles>>;
};

export async function BlockDisplay() {
  const catalog = await getCachedCatalog();

  if (!catalog.length) {
    return null;
  }

  const projects: ProjectData[] = await Promise.all(
    catalog.map(async ({ item, categoryPath }) => {
      const files = item.files ?? [];
      const [tree, highlightedFiles] = await Promise.all([
        getCachedFileTree(files),
        getCachedHighlightedFiles(files),
      ]);

      return {
        item,
        categoryPath,
        tree,
        highlightedFiles,
      };
    }),
  );

  const projectTree = buildProjectTree(projects);

  return (
    <BlockViewer
      projects={projects}
      projectTree={projectTree}
      initialProjectName={null}
    />
  );
}

const getCachedCatalog = React.cache(async () => {
  return await getRegistryCatalog();
});

const getCachedFileTree = React.cache(
  async (files: Array<{ path: string; target?: string }>) => {
    if (!files) {
      return null;
    }

    return createFileTreeForRegistryItemFiles(files);
  },
);

const getCachedHighlightedFiles = React.cache(
  async (files: z.infer<typeof registryItemFileSchema>[]) => {
    return await Promise.all(
      files.map(async (file: any) => {
        return {
          ...file,
          highlightedContent: await highlightCode(file.content ?? "", file.path.split(".").pop() ?? "tsx"),
      };
    }),
  );
});

function buildProjectTree(projects: ProjectData[]) {
  const root: ProjectTreeNode[] = [];

  for (const project of projects) {
    const path = project.categoryPath.length
      ? project.categoryPath
      : ["Uncategorized"];
    let current = root;

    path.forEach((segment) => {
      let existing = current.find(
        (node) => node.kind === "category" && node.name === segment,
      );

      if (!existing) {
        existing = { name: segment, kind: "category", children: [] };
        current.push(existing);
      }

      current = existing.children ?? [];
      existing.children = current;
    });

    current.push({
      name: project.item.title ?? project.item.name,
      kind: "project",
      projectName: project.item.name,
    });
  }

  return root;
}
