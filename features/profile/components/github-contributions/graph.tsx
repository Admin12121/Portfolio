"use client";

import dayjs from "dayjs";
import { ActivityIcon } from "lucide-react";
import { use } from "react";

import type { Activity } from "@/components/ui/contribution-graph";
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from "@/components/ui/contribution-graph";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GITHUB_USERNAME } from "@/config/site";

function GitHubContributionEmptyState() {
  return (
    <div className="flex min-h-[162px] w-full flex-col items-center justify-center gap-2 px-4 py-6 text-center">
      <ActivityIcon className="size-4 text-muted-foreground" />
      <div className="space-y-1">
        <p className="font-mono text-sm text-foreground">
          GitHub contributions are unavailable right now.
        </p>
        <p className="text-xs text-muted-foreground">
          This can happen in production when the remote GitHub activity service
          is slow, rate-limited, or temporarily unreachable.
        </p>
      </div>
      <a
        className="font-mono text-xs underline underline-offset-4 text-muted-foreground hover:text-foreground"
        href={`https://github.com/${GITHUB_USERNAME}`}
        target="_blank"
        rel="noopener"
      >
        View activity on GitHub
      </a>
    </div>
  );
}

export function GitHubContributionGraph({
  contributions,
}: {
  contributions: Promise<Activity[]>;
}) {
  const data = use(contributions);

  if (!data || data.length === 0) {
    return <GitHubContributionEmptyState />;
  }

  return (
    <ContributionGraph
      className="mx-auto py-4"
      data={data}
      blockSize={18}
      blockMargin={3}
      blockRadius={0}
    >
      <ContributionGraphCalendar
        className="no-scrollbar px-2"
        title="GitHub Contributions"
      >
        {({ activity, dayIndex, weekIndex }) => (
          <Tooltip>
            <TooltipTrigger asChild>
              <g>
                <ContributionGraphBlock
                  activity={activity}
                  dayIndex={dayIndex}
                  weekIndex={weekIndex}
                />
              </g>
            </TooltipTrigger>

            <TooltipContent className="font-sans" sideOffset={0}>
              <p>
                {activity.count} contribution{activity.count > 1 ? "s" : null}{" "}
                on {dayjs(activity.date).format("DD.MM.YYYY")}
              </p>
            </TooltipContent>
          </Tooltip>
        )}
      </ContributionGraphCalendar>

      <ContributionGraphFooter className="px-2">
        <ContributionGraphTotalCount>
          {({ totalCount, year }) => (
            <div className="text-muted-foreground">
              {totalCount.toLocaleString("en")} contributions in {year + 1} on{" "}
              <a
                className="font-medium underline underline-offset-4"
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener"
              >
                GitHub
              </a>
              .
            </div>
          )}
        </ContributionGraphTotalCount>

        <ContributionGraphLegend />
      </ContributionGraphFooter>
    </ContributionGraph>
  );
}

export function GitHubContributionFallback() {
  return <GitHubContributionEmptyState />;
}
