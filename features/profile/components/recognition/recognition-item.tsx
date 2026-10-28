"use client";

import type { ReactNode } from "react";
import dayjs from "dayjs";
import Image from "next/image";
import { ArrowUpRightIcon, PaperclipIcon, Trophy, Award, Medal } from "lucide-react";

import {
  CollapsibleContent,
  CollapsibleTrigger,
  CollapsibleWithContext,
  CollapsibleChevronsIcon,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type {
  RecognitionEntry,
} from "../../types/recognition";

const externalRel = "noopener noreferrer";

function AwardRow({
  entry,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  entry: RecognitionEntry;
}) {
  const { award } = entry;
  const canExpand = Boolean(award.description);
  const primaryURL = award.eventURL || award.referenceLink;
  const logoURL = award.eventLogoURL || award.organizerLogoURL;
  const hasSeparateEvidence = Boolean(award.eventURL && award.referenceLink && award.eventURL !== award.referenceLink);
  const teamName = award.teamName || award.grade;
  const placement = award.prize?.trim().toLowerCase();
  const PlacementIcon =
    placement === "winner"
      ? Trophy
      : placement === "first runner-up" || placement === "second runner-up"
        ? Medal
        : Award;

  return (
    <CollapsibleWithContext asChild>
      <div data-blueprint-item="RECOGNITION" className={cn("group/recognition", className)} {...props}>
        <div className="relative flex min-h-19 items-center transition-colors hover:bg-foreground/[0.07] focus-within:bg-foreground/[0.07]">
          {canExpand ? (
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="absolute inset-0 z-10 cursor-pointer rounded-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                aria-label={`Toggle details for ${award.title}`}
              />
            </CollapsibleTrigger>
          ) : primaryURL ? (
            <a
              href={primaryURL}
              target="_blank"
              rel={externalRel}
              className="absolute inset-0 z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
              aria-label={`Open ${award.title}`}
            />
          ) : null}

          <div
            data-blueprint-part="icon"
            className="mx-4 flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-muted-foreground/20 bg-muted text-muted-foreground ring-1 ring-edge ring-offset-1 ring-offset-background [&_svg]:size-4"
            aria-hidden="true"
          >
            {logoURL ? (
              <Image
                src={logoURL}
                alt=""
                width={24}
                height={24}
                className="size-full object-contain"
                unoptimized
              />
            ) : (
              <Trophy />
            )}
          </div>

          <div data-draft-edges="left" className="min-w-0 flex-1 border-l border-dashed border-edge p-4 pr-2">
            <h3 data-blueprint-part="title" className="mb-1 leading-snug font-medium text-balance">
              {award.title}
            </h3>
            <div
              data-blueprint-part="meta"
              className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground"
            >
              <MetaText label="Organizer">
                {award.organizerURL ? (
                  <a
                    className="relative z-20 rounded-sm underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                    href={award.organizerURL}
                    target="_blank"
                    rel={externalRel}
                  >
                    @{award.organizer}
                  </a>
                ) : (
                  <>@{award.organizer}</>
                )}
              </MetaText>
              {award.prize && (
                <>
                  <MetaSeparator />
                  <PlacementIcon className="size-xs" width={16} height={16} />
                  <MetaText label="Placement">{award.prize}</MetaText>
                </>
              )}
              <MetaSeparator />
              <MetaText label="Award date">
                <time dateTime={entry.date}>{dayjs(entry.date).format("MMM YYYY")}</time>
              </MetaText>
              {teamName && (
                <>
                  <MetaSeparator />
                  <MetaText label="Team">
                    {award.teamURL ? (
                      <a
                        className="relative z-20 rounded-sm underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                        href={award.teamURL}
                        target="_blank"
                        rel={externalRel}
                      >
                        {teamName}
                      </a>
                    ) : (
                      teamName
                    )}
                  </MetaText>
                </>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-center text-muted-foreground">
            {hasSeparateEvidence && (
              <a
                href={award.referenceLink}
                target="_blank"
                rel={externalRel}
                className="relative z-20 flex size-9 items-center justify-center rounded-sm transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                aria-label={`Open evidence for ${award.title}`}
              >
                <PaperclipIcon className="size-4" aria-hidden="true" />
              </a>
            )}
            {primaryURL ? (
              <a
                href={primaryURL}
                target="_blank"
                rel={externalRel}
                className="relative z-20 flex size-9 items-center justify-center rounded-sm transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                aria-label={`Open ${award.title} reference`}
              >
                <ArrowUpRightIcon className="size-4" aria-hidden="true" />
              </a>
            ) : canExpand ? (
              <span className="pointer-events-none [&_svg]:size-4">
                <CollapsibleChevronsIcon />
              </span>
            ) : null}
            {!primaryURL && <span className="w-2" aria-hidden="true" />}
          </div>
        </div>
        {canExpand && (
          <CollapsibleContent>
            <div data-draft-edges="top" className="border-t border-edge px-4 py-3 text-sm leading-6 text-muted-foreground md:pl-[4.5rem]">
              {award.description}
            </div>
          </CollapsibleContent>
        )}
      </div>
    </CollapsibleWithContext>
  );
}

function MetaText({ children, label }: { children: ReactNode; label: string }) {
  return (
    <dl>
      <dt className="sr-only">{label}</dt>
      <dd>{children}</dd>
    </dl>
  );
}

function MetaSeparator() {
  return <Separator className="data-[orientation=vertical]:h-4" orientation="vertical" />;
}

export default AwardRow;
