"use client";

import * as React from "react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Clipboard,
  Folder,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { type ImperativePanelHandle } from "react-resizable-panels";
import { type registryItemFileSchema } from "shadcn/schema";
import { type z } from "zod";

import {
  type createFileTreeForRegistryItemFiles,
  type FileTree,
  RegistryItem,
} from "@/lib/registry";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { getIconForLanguageExtension } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
} from "@/components/ui/sidebar";
import type { ProjectData, ProjectTreeNode } from "@/components/block-display";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prose } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

type HighlightedRegistryFile = z.infer<typeof registryItemFileSchema> & {
  target: string;
  path: string;
  highlightedContent: string;
};

type BlockViewerContext = {
  projects: ProjectData[];
  projectTree: ProjectTreeNode[];
  selectedProject: ProjectData | null;
  setSelectedProjectName: (name: string | null) => void;
  item: RegistryItem | null;
  view: "code" | "preview";
  setView: (view: "code" | "preview") => void;
  activeFile: string | null;
  setActiveFile: (file: string) => void;
  resizablePanelRef: React.RefObject<ImperativePanelHandle | null> | null;
  tree: ReturnType<typeof createFileTreeForRegistryItemFiles> | null;
  highlightedFiles: HighlightedRegistryFile[] | null;
  iframeKey?: number;
  setIframeKey?: React.Dispatch<React.SetStateAction<number>>;
};

const BlockViewerContext = React.createContext<BlockViewerContext | null>(null);

function useBlockViewer() {
  const context = React.useContext(BlockViewerContext);
  if (!context) {
    throw new Error(
      "useBlockViewer must be used within a BlockViewerProvider.",
    );
  }
  return context;
}

function BlockViewerProvider({
  projects,
  projectTree,
  initialProjectName,
  children,
}: {
  projects: ProjectData[];
  projectTree: ProjectTreeNode[];
  initialProjectName?: string | null;
  children: React.ReactNode;
}) {
  const [selectedProjectName, setSelectedProjectName] = React.useState<
    string | null
  >(initialProjectName ?? null);
  const selectedProject = React.useMemo(() => {
    if (!selectedProjectName) return null;
    return (
      projects.find((proj) => proj.item.name === selectedProjectName) ?? null
    );
  }, [projects, selectedProjectName]);

  const highlightedFiles = selectedProject?.highlightedFiles ?? null;
  const tree = selectedProject?.tree ?? null;
  const item = selectedProject?.item ?? null;

  const [view, setView] = React.useState<BlockViewerContext["view"]>("preview");
  const [activeFile, setActiveFile] =
    React.useState<BlockViewerContext["activeFile"]>(null);
  const resizablePanelRef = React.useRef<ImperativePanelHandle>(null);
  const [iframeKey, setIframeKey] = React.useState(0);

  React.useEffect(() => {
    if (!selectedProject || !selectedProject.item?.files) {
      setActiveFile(null);
      return;
    }

    const files = selectedProject.item.files;

    const readme =
      files.find(
        (f) =>
          (f.type === "registry:page" || f.type === "registry:doc") &&
          typeof f.target === "string" &&
          f.target.toLowerCase().endsWith(".md"),
      ) ??
      files.find(
        (f) =>
          typeof f.target === "string" &&
          f.target.toLowerCase() === "readme.md",
      );

    const defaultTarget =
      readme?.target ?? highlightedFiles?.[0]?.target ?? null;

    setActiveFile(defaultTarget ?? null);
    setView("preview");
  }, [selectedProjectName, highlightedFiles, selectedProject]);

  return (
    <BlockViewerContext.Provider
      value={{
        projects,
        projectTree,
        selectedProject,
        setSelectedProjectName,
        item,
        view,
        setView,
        resizablePanelRef,
        activeFile,
        setActiveFile,
        tree,
        highlightedFiles,
        iframeKey,
        setIframeKey,
      }}
    >
      <div
        id={item?.name ?? "block-viewer"}
        data-view={view}
        className="group/block-view-wrapper flex min-w-0 scroll-mt-24 flex-col-reverse items-stretch gap-4 overflow-hidden md:flex-col"
        style={
          {
            "--height": item?.meta?.iframeHeight ?? "930px",
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </BlockViewerContext.Provider>
  );
}

type BlockViewerProps = Pick<BlockViewerContext, "projects" | "projectTree"> & {
  initialProjectName?: string | null;
};

function BlockViewerToolbar() {
  const { item } = useBlockViewer();

  return (
    <div className="w-full items-center gap-2 pl-2 md:pr-6 lg:flex">
      <a
        href={`#${item ? item.name : ""}`}
        className="flex-1 text-sm font-medium underline-offset-2 hover:underline md:flex-auto md:text-left"
      >
        {item ? item.description?.replace(/\.$/, "") : "Available Project"}
      </a>
    </div>
  );
}

function BlockViewerCode() {
  const { activeFile, highlightedFiles, selectedProject } = useBlockViewer();

  const file = React.useMemo(() => {
    return highlightedFiles?.find((file) => file.target === activeFile);
  }, [highlightedFiles, activeFile]);

  const language = file?.path.split(".").pop() ?? "tsx";

  if (!selectedProject) {
    return (
      <div className="bg-code text-code-foreground mr-3.5 flex overflow-hidden rounded-xl border md:h-(--height)">
        <div className="w-72">
          <BlockViewerFileTree />
        </div>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="bg-code text-code-foreground mr-3.5 flex overflow-hidden rounded-xl border  md:h-(--height)">
        <div className="w-72">
          <BlockViewerFileTree />
        </div>
      </div>
    );
  }

  const isMarkdown =
    typeof file.path === "string" && file.path.toLowerCase().endsWith(".md");

  return (
    <div className="relative bg-code text-code-foreground mr-3.5 flex overflow-hidden rounded-xl border  md:h-(--height)">
      <div className="w-72">
        <BlockViewerFileTree />
      </div>
      {isMarkdown ? (
        <figure
          data-rehype-pretty-code-figure=""
          className="m-0! mt-0 flex min-w-0 flex-1 flex-col rounded-xl border-none"
        >
          <figcaption
            className="text-code-foreground [&_svg]:text-code-foreground flex h-12 shrink-0 items-center gap-2 border-b px-4 py-2 [&_svg]:size-4 [&_svg]:opacity-70"
            data-language={language}
          >
            {getIconForLanguageExtension(language)}
            {file.target}
            <div className="ml-auto flex items-center gap-2">
              <BlockCopyCodeButton />
            </div>
          </figcaption>
          <div className="m-0! flex min-w-0 flex-1 flex-col overflow-y-auto rounded-br-xl border-none bg-background px-6 py-4">
            <Prose>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {(selectedProject?.item.files ?? []).find(
                  (f) => f.target === file.target,
                )?.content ?? ""}
              </ReactMarkdown>
            </Prose>
          </div>
        </figure>
      ) : (
        <figure
          data-rehype-pretty-code-figure=""
          className="mx-0! mt-0 flex min-w-0 flex-1 flex-col rounded-xl border-none"
        >
          <figcaption
            className="text-code-foreground [&_svg]:text-code-foreground flex h-12 shrink-0 items-center gap-2 border-b px-4 py-2 [&_svg]:size-4 [&_svg]:opacity-70"
            data-language={language}
          >
            {getIconForLanguageExtension(language)}
            {file.target}
            <div className="ml-auto flex items-center gap-2">
              <BlockCopyCodeButton />
            </div>
          </figcaption>
          <div
            key={file?.path}
            dangerouslySetInnerHTML={{
              __html: file?.highlightedContent ?? "",
            }}
            className="no-scrollbar overflow-y-auto"
          />
        </figure>
      )}
      <Button
        size={"icon"}
        className="absolute bottom-1 right-1 rounded-xl cursor-pointer"
        variant={"outline"}
      >
        <Maximize2 />
      </Button>
    </div>
  );
}

export function BlockViewerFileTree() {
  const { tree, projectTree, selectedProject, setSelectedProjectName } =
    useBlockViewer();

  return (
    <SidebarProvider className="flex min-h-full! flex-col border-r">
      <Sidebar collapsible="none" className="w-full flex-1">
        <SidebarGroupLabel
          className={cn(
            "h-12 items-center gap-2 rounded-none border-b text-sm",
            selectedProject ? "pr-4" : "px-4",
          )}
        >
          {selectedProject ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedProjectName(null)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              {selectedProject.item.title ?? selectedProject.item.name}
            </>
          ) : (
            <span className="text-sm font-medium">Projects</span>
          )}
        </SidebarGroupLabel>
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="translate-x-0 gap-1.5">
              {selectedProject
                ? tree?.map((file, index) => (
                    <Tree key={index} item={file} index={1} />
                  ))
                : projectTree.map((project, index) => (
                    <ProjectTreeNodeItem key={index} node={project} depth={1} />
                  ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </Sidebar>
    </SidebarProvider>
  );
}

function Tree({ item, index }: { item: FileTree; index: number }) {
  const { activeFile, setActiveFile } = useBlockViewer();
  const language = item.path ? (item.path.split(".").pop() ?? "file") : "file";
  if (!item.children) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={item.path === activeFile}
          onClick={() => item.path && setActiveFile(item.path)}
          className="hover:bg-muted-foreground/15 focus:bg-muted-foreground/15 focus-visible:bg-muted-foreground/15 active:bg-muted-foreground/15 data-[active=true]:bg-muted-foreground/15 rounded-none whitespace-nowrap"
          data-index={index}
          style={
            {
              paddingLeft: `${index * (index === 2 ? 1.2 : 1.3)}rem`,
            } as React.CSSProperties
          }
        >
          <ChevronRight className="invisible" />
          {getIconForLanguageExtension(language)}
          {item.name}
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            className="hover:bg-muted-foreground/15 focus:bg-muted-foreground/15 focus-visible:bg-muted-foreground/15 active:bg-muted-foreground/15 data-[active=true]:bg-muted-foreground/15 rounded-none pl-(--index) whitespace-nowrap"
            style={
              {
                "--index": `${index * (index === 1 ? 1 : 1.2)}rem`,
              } as React.CSSProperties
            }
          >
            <ChevronRight className="transition-transform" />
            <Folder />
            {item.name}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="m-0 w-full translate-x-0 border-none p-0">
            {item.children.map((subItem, key) => (
              <Tree key={key} item={subItem} index={index + 1} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}

function ProjectTreeNodeItem({
  node,
  depth,
}: {
  node: ProjectTreeNode;
  depth: number;
}) {
  const { setSelectedProjectName } = useBlockViewer();

  if (node.kind === "project") {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() =>
            node.projectName && setSelectedProjectName(node.projectName)
          }
          className="hover:bg-muted-foreground/15 focus:bg-muted-foreground/15 focus-visible:bg-muted-foreground/15 active:bg-muted-foreground/15 rounded-none whitespace-nowrap"
          style={
            {
              paddingLeft: `${depth * 1.2}rem`,
            } as React.CSSProperties
          }
        >
          <ChevronRight className="invisible" />
          {node.name}
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            className="hover:bg-muted-foreground/15 focus:bg-muted-foreground/15 focus-visible:bg-muted-foreground/15 active:bg-muted-foreground/15 rounded-none pl-(--index) whitespace-nowrap"
            style={
              {
                "--index": `${depth * (depth === 1 ? 1 : 1.2)}rem`,
              } as React.CSSProperties
            }
          >
            <ChevronRight className="transition-transform" />
            <Folder />
            {node.name}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="m-0 w-full translate-x-0 border-none p-0">
            {node.children?.map((child, key) => (
              <ProjectTreeNodeItem key={key} node={child} depth={depth + 1} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}

function BlockCopyCodeButton() {
  const { activeFile, item } = useBlockViewer();
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  const file = React.useMemo(() => {
    return item?.files?.find((file) => file.target === activeFile);
  }, [activeFile, item?.files]);

  const content = file?.content;

  if (!content) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-7"
      onClick={() => {
        copyToClipboard(content);
      }}
    >
      {isCopied ? <Check /> : <Clipboard />}
    </Button>
  );
}

function BlockViewer({
  projects,
  projectTree,
  initialProjectName,
}: BlockViewerProps) {
  return (
    <BlockViewerProvider
      projects={projects}
      projectTree={projectTree}
      initialProjectName={initialProjectName}
    >
      <BlockViewerToolbar />
      <BlockViewerCode />
    </BlockViewerProvider>
  );
}

export { BlockViewer };
