import { promises as fs } from "fs";
import { tmpdir } from "os";
import path from "path";
import { registryItemSchema } from "shadcn/schema";
import { Project, ScriptKind } from "ts-morph";
import { Index } from "@/registry/__index__";

interface RegistryFile {
  path: string;
  type?: string;
  target?: string;
  content?: string;
  [key: string]: any;
}

export interface RegistryItem {
  name: string;
  title?: string;
  description?: string;
  type?: string;
  files?: RegistryFile[];
  registryDependencies?: string[];
  categories?: string[];
  meta?: Record<string, any>;
  [key: string]: any;
}

export function getRegistryComponent(name: string) {
  return (Index as Record<string, any>)[name]?.component;
}

export async function getRegistryItems(
  filter?: (item: RegistryItem) => boolean,
) {
  const entries = collectRegistryEntries(Index as Record<string, any>);

  const filtered = filter
    ? entries.filter(({ entry }) => {
        const parsed = registryItemSchema.safeParse(entry);
        if (!parsed.success) return false;
        return filter(parsed.data as any as RegistryItem);
      })
    : entries;

  const items = await Promise.all(
    filtered.map(async ({ name, entry }) => {
      return getRegistryItem(name, entry);
    }),
  );

  return items.filter(Boolean) as RegistryItem[];
}

export async function getRegistryCatalog() {
  const entries = collectRegistryEntries(Index as Record<string, any>);
  const catalog = await Promise.all(
    entries.map(async ({ name, entry, categoryPath }) => {
      const item = await getRegistryItem(name, entry);
      if (!item) return null;
      return { item, categoryPath };
    }),
  );
  return catalog.filter(Boolean) as Array<{
    item: RegistryItem;
    categoryPath: string[];
  }>;
}

export async function getRegistryItem(name: string, rawEntry?: any) {
  const foundEntry =
    rawEntry ?? findRegistryEntryByName(name, Index as Record<string, any>);
  if (!foundEntry) return null;

  const normalized = coerceRegistryDocument(normalizeRawRegistryEntry(foundEntry));

  const result = registryItemSchema.safeParse(normalized);
  if (!result.success) {
    return null;
  }

  const parsedItem = result.data as any as RegistryItem;

  const itemFiles: RegistryFile[] = parsedItem.files ?? [];

  const filesWithContent: RegistryFile[] = [];
  for (const file of itemFiles) {
    if (!file || typeof file.path !== "string") continue;

    const content = await getFileContent(file);
    const relativePath = path.relative(process.cwd(), file.path);

    filesWithContent.push({
      ...file,
      path: relativePath,
      content,
    } as RegistryFile);
  }

  const fixedFiles = fixFilePaths(filesWithContent);

  const reparsed = registryItemSchema.safeParse(
    Object.assign({}, (parsedItem as any) || {}, { files: fixedFiles }),
  );

  if (!reparsed.success) {
    console.error(reparsed.error.message);
    return null;
  }

  return reparsed.data as RegistryItem;
}

async function getFileContent(file: RegistryFile) {
  const rawText = await fs.readFile(file.path, "utf-8");

  const project = new Project({
    compilerOptions: {},
  });

  const temp = await createTempSourceFile(file.path);
  const sourceFile = project.createSourceFile(temp, rawText, {
    scriptKind: ScriptKind.TSX,
  });

  let code = sourceFile.getFullText();

  if (file.type !== "registry:page") {
    code = code.replaceAll("export default", "export");
  }

  code = fixImport(code);

  return code;
}

function getFileTarget(file: RegistryFile) {
  let target = file.target ?? "";

  if (!target || target === "") {
    const fileName = file.path.split("/").pop() ?? file.path;
    if (
      file.type === "registry:block" ||
      file.type === "registry:component" ||
      file.type === "registry:example"
    ) {
      target = `components/${fileName}`;
    } else if (file.type === "registry:ui") {
      target = `components/ui/${fileName}`;
    } else if (file.type === "registry:hook") {
      target = `hooks/${fileName}`;
    } else if (file.type === "registry:lib") {
      target = `lib/${fileName}`;
    }
  }

  return target;
}

async function createTempSourceFile(filename: string) {
  const dir = await fs.mkdtemp(path.join(tmpdir(), "shadcn-"));
  return path.join(dir, filename);
}

function fixFilePaths(files: RegistryFile[]) {
  if (!files || files.length === 0) return [];

  const baseDir = path.dirname(files[0].path);

  return files.map((file) => {
    const relative = path.relative(baseDir, file.path);
    const target = getFileTarget(file);
    return {
      ...file,
      path: relative,
      target,
    } as RegistryFile;
  });
}

export function fixImport(content: string) {
  const regex = /@\/(.+?)\/((?:.*?\/)?(?:components|ui|hooks|lib))\/([\w-]+)/g;

  const replacer = (
    _match: string,
    _prefix: string,
    typePath: string,
    component: string,
  ) => {
    if (typePath.endsWith("components")) {
      return `@/components/${component}`;
    } else if (typePath.endsWith("ui")) {
      return `@/components/ui/${component}`;
    } else if (typePath.endsWith("hooks")) {
      return `@/hooks/${component}`;
    } else if (typePath.endsWith("lib")) {
      return `@/lib/${component}`;
    }
    return _match;
  };

  return content.replace(regex, replacer);
}

export type FileTree = {
  name: string;
  path?: string;
  children?: FileTree[];
};

export function createFileTreeForRegistryItemFiles(
  files: Array<{ path: string; target?: string }>,
) {
  const root: FileTree[] = [];

  for (const f of files) {
    const nodePath = f.target ?? f.path;
    if (!nodePath) continue;

    const parts = nodePath.split("/").filter(Boolean);
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLeaf = i === parts.length - 1;
      let existing = current.find((n) => n.name === part);

      if (existing) {
        if (isLeaf) {
          existing.path = nodePath;
        } else {
          existing.children = existing.children ?? [];
          current = existing.children;
        }
      } else {
        const newNode: FileTree = isLeaf
          ? { name: part, path: nodePath }
          : { name: part, children: [] };

        current.push(newNode);

        if (!isLeaf) {
          current = newNode.children!;
        }
      }
    }
  }

  return root;
}

function normalizeRawRegistryEntry(raw: unknown) {
  const asAny = raw as any;
  const filesRaw: unknown[] = Array.isArray(asAny?.files) ? asAny.files : [];

  const normalizedFiles = filesRaw.map((f) => {
    if (typeof f === "string") {
      return { path: f };
    }
    return f;
  });

  return {
    ...asAny,
    files: normalizedFiles,
  };
}

// Allow registry:document as an alias for registry:page to satisfy schema validation.
function coerceRegistryDocument(raw: any) {
  if (!raw) return raw;
  const next: any = { ...raw };
  if (Array.isArray(next.files)) {
    next.files = next.files.map((f: any) =>
      f && f.type === "registry:document" ? { ...f, type: "registry:page" } : f,
    );
  }
  if (next.type === "registry:document") {
    next.type = "registry:page";
  }
  return next;
}

function collectRegistryEntries(
  indexNode: Record<string, any>,
  categoryPath: string[] = [],
) {
  const entries: Array<{
    name: string;
    entry: any;
    categoryPath: string[];
  }> = [];

  for (const [key, value] of Object.entries(indexNode ?? {})) {
    if (!value || typeof value !== "object") continue;

    const looksLikeItem =
      typeof (value as any).type === "string" ||
      Array.isArray((value as any).files) ||
      typeof (value as any).description === "string";

    if (looksLikeItem) {
      const name = (value as any).name ?? key;
      entries.push({ name, entry: { ...value, name }, categoryPath });
      continue;
    }

    entries.push(
      ...collectRegistryEntries(value as Record<string, any>, [
        ...categoryPath,
        key,
      ]),
    );
  }

  return entries;
}

function findRegistryEntryByName(
  name: string,
  indexNode: Record<string, any>,
): any | null {
  const entries = collectRegistryEntries(indexNode);
  const found = entries.find((e) => e.name === name);
  return found?.entry ?? null;
}
