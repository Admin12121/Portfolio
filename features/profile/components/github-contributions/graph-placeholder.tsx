"use client";

import { ActivityIcon } from "lucide-react";
import { GITHUB_USERNAME } from "@/config/site";

/**
 * Stable, intentionally neutral calendar while GitHub data is unavailable.
 * Never create fictional contribution counts or an artificial heatmap.
 * The same source-measured, zero-level cells are exposed to the blueprint preloader.
 * These are neutral loading cells, never invented activity counts.
 */
export function GitHubContributionPlaceholder({
  state = "loading",
}: {
  state?: "loading" | "unavailable";
}) {
  const loading = state === "loading";
  return (
    <div
      className="relative w-full min-h-[215px] overflow-hidden px-4 py-4"
      data-contribution-placeholder={state}
      role="status"
      aria-live="polite"
    >
      <div className="mb-3 flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <ActivityIcon aria-hidden="true" className="size-3.5 shrink-0" />
          {loading ? "Loading GitHub contributions" : "GitHub contributions are temporarily unavailable"}
        </span>
        {!loading && (
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            View on GitHub
          </a>
        )}
      </div>
      <div className="w-full overflow-x-auto no-scrollbar" aria-label="Calendar placeholder, no contribution data yet">
        <div className="min-w-[800px]">
          <div className="mb-2 grid grid-cols-12 gap-1 text-[10px] text-muted-foreground/70">
            {"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ").map((m) => <span key={m}>{m}</span>)}
          </div>
          <div
            role="presentation"
            className="grid grid-flow-col grid-rows-7 gap-[3px]"
            style={{ gridTemplateColumns: "repeat(53, minmax(0, 1fr))" }}
          >
            {Array.from({ length: 371 }, (_, i) => (
              <span
                key={i}
                data-blueprint-cell=""
                data-level="0"
                className="h-[13px] rounded-[1px] border border-foreground/15 bg-foreground/10 dark:border-foreground/20 dark:bg-foreground/15"
              />
            ))}
          </div>
        </div>
      </div>
      <p className="mt-3 font-mono text-[10px] text-muted-foreground/65">
        {loading ? "Fetching live contribution activity…" : "No verified contribution counts to display · The grid remains available"}
      </p>
    </div>
  );
}
