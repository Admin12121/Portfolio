"use client";

import dayjs from "dayjs";
import { ActivityIcon, LoaderIcon } from "lucide-react";
import { use, useEffect, useState } from "react";

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

const GITHUB_CONTRIBUTIONS_STORAGE_KEY = "github-contributions";
const GITHUB_CONTRIBUTIONS_URL = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`;

type GitHubContributionsResponse = {
  contributions?: Activity[];
};

function GitHubContributionLoadingState() {
  return (
    <div className="flex h-[162px] w-full items-center justify-center">
      <LoaderIcon className="animate-spin text-muted-foreground" />
    </div>
  );
}

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

function readStoredContributions() {
  const cached = localStorage.getItem(GITHUB_CONTRIBUTIONS_STORAGE_KEY);

  if (!cached) {
    return [];
  }

  try {
    const parsed = JSON.parse(cached) as Activity[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    localStorage.removeItem(GITHUB_CONTRIBUTIONS_STORAGE_KEY);
    return [];
  }
}

export function GitHubContributionGraph({
  contributions,
}: {
  contributions: Promise<Activity[]>;
}) {
  const initialData = use(contributions);
  const [data, setData] = useState(initialData);
  const [isRetrying, setIsRetrying] = useState(initialData.length === 0);

  useEffect(() => {
    if (initialData.length > 0) {
      localStorage.setItem(
        GITHUB_CONTRIBUTIONS_STORAGE_KEY,
        JSON.stringify(initialData)
      );
      return;
    }

    const cachedData = readStoredContributions();
    if (cachedData.length > 0) {
      setData(cachedData);
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);

    async function refetchContributions() {
      try {
        const res = await fetch(GITHUB_CONTRIBUTIONS_URL, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch GitHub contributions: ${res.status}`);
        }

        const payload = (await res.json()) as GitHubContributionsResponse;
        const nextData = Array.isArray(payload.contributions)
          ? payload.contributions
          : [];

        if (nextData.length > 0) {
          localStorage.setItem(
            GITHUB_CONTRIBUTIONS_STORAGE_KEY,
            JSON.stringify(nextData)
          );
          setData(nextData);
        }
      } catch (error) {
        console.warn(
          "Client-side GitHub contributions fetch failed:",
          error instanceof Error ? error.message : String(error)
        );
      } finally {
        window.clearTimeout(timeout);
        setIsRetrying(false);
      }
    }

    void refetchContributions();

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [initialData]);

  if (!data || data.length === 0) {
    if (isRetrying) {
      return <GitHubContributionLoadingState />;
    }

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
              {totalCount.toLocaleString("en")} contributions in {year} on{" "}
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
  return <GitHubContributionLoadingState />;
}
