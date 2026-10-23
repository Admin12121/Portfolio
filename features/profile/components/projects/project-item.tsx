import { InfinityIcon, LinkIcon } from "lucide-react";
import Image from "next/image";

import { Icons } from "@/components/icons";
import { Markdown } from "@/components/markdown";
import {
  CollapsibleChevronsIcon,
  CollapsibleAnimatedContent,
  CollapsibleTrigger,
  CollapsibleWithContext,
} from "@/components/ui/collapsible";
import { Tag } from "@/components/ui/tag";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { Prose } from "@/components/ui/typography";
import { UTM_PARAMS } from "@/config/site";
import { addQueryParams } from "@/utils/url";

import type { Project } from "../../types/projects";

export function ProjectItem({
  className,
  project,
}: {
  className?: string;
  project: Project;
}) {
  const { start, end } = project.period;
  const isOngoing = !end;

  return (
    <CollapsibleWithContext defaultOpen={project.isExpanded} asChild>
      <div className={className} data-blueprint-item="PROJECT">
        <div className="group/project relative flex items-stretch transition-colors hover:bg-accent2 focus-within:bg-accent2">
          {/* The logo and the entire row expand the project. The external link is
              a separate sibling, not an invalid <a> nested in a <button>. */}
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex min-w-0 flex-1 items-stretch text-left select-none outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              aria-label={`Expand or collapse ${project.title}`}
            >
              <span data-draft-edges="right" className="flex w-14 shrink-0 items-center justify-center border-r border-dashed border-edge">
                {project.logo ? (
                  <Image
                    data-blueprint-part="icon"
                    src={project.logo}
                    alt=""
                    width={32}
                    height={32}
                    className="size-6 shrink-0 object-contain select-none"
                    unoptimized
                    aria-hidden="true"
                  />
                ) : (
                  <span
                    data-blueprint-part="icon"
                    className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-muted-foreground/15 bg-muted text-muted-foreground ring-1 ring-edge ring-offset-1 ring-offset-background"
                    aria-hidden="true"
                  >
                    <Icons.project className="size-4" />
                  </span>
                )}
              </span>

              <span className="flex min-w-0 flex-1 items-center p-4 pr-12">
                <span className="min-w-0 flex-1">
                  <span className="mb-1 flex items-center gap-1.5 leading-snug font-medium text-balance">
                    <span data-blueprint-part="title">{project.title}</span>
                    {project.isBeta && (
                      <SimpleTooltip content="Beta version">
                        <span className="relative -top-[5px] -left-[5px] inline-flex size-4 items-center justify-center text-muted-foreground">
                          <InfinityIcon className="size-3.5" aria-hidden />
                          <span className="sr-only">Beta version</span>
                        </span>
                      </SimpleTooltip>
                    )}
                  </span>

                  <span data-blueprint-part="meta" className="flex flex-wrap items-center gap-0.5 text-sm text-muted-foreground">
                    <span>{start}</span>
                    <span className="font-mono">—</span>
                    {isOngoing ? (
                      <>
                        <InfinityIcon className="size-4.5 translate-y-[0.5px]" aria-hidden />
                        <span className="sr-only">Present</span>
                      </>
                    ) : (
                      <span>{end}</span>
                    )}
                  </span>
                </span>
              </span>
              <span className="flex w-12 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4" aria-hidden="true">
                <CollapsibleChevronsIcon />
              </span>
            </button>
          </CollapsibleTrigger>

          <SimpleTooltip content="Open Project Link">
            <a
              data-blueprint-part="action"
              className="absolute inset-y-0 right-12 z-10 flex w-11 items-center justify-center text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground focus-visible:bg-accent/60 focus-visible:text-foreground focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
              href={addQueryParams(project.link, UTM_PARAMS)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${project.title} in a new tab`}
            >
              <LinkIcon className="size-4.5" aria-hidden="true" />
            </a>
          </SimpleTooltip>
        </div>

        <CollapsibleAnimatedContent>
          <div data-draft-edges="top" className="border-t border-dashed border-edge">
            <div className="space-y-4 p-4">
              {project.description && (
                <Prose data-blueprint-part="description">
                  <Markdown>{project.description}</Markdown>
                </Prose>
              )}

              {project.skills.length > 0 && (
                <ul className="flex flex-wrap gap-1.5">
                  {project.skills.map((skill, index) => (
                    <li key={index} className="flex">
                      <Tag>{skill}</Tag>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </CollapsibleAnimatedContent>
      </div>
    </CollapsibleWithContext>
  );
}
