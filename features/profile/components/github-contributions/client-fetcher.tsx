"use client";

import { useEffect } from "react";
import { GITHUB_USERNAME } from "@/config/site";
import type { Activity } from "@/components/ui/contribution-graph";

/**
 * Client-side fetcher that re-fetches GitHub contributions after hydration.
 * This ensures the data is always fresh even if the server-side fetch times out.
 * It doesn't render anything - just triggers a re-fetch in the background.
 */
export function GitHubContributionClientFetcher() {
  useEffect(() => {
    async function refetchContributions() {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const res = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`,
          {
            signal: controller.signal,
          }
        );

        clearTimeout(timeout);

        if (!res.ok) {
          console.warn(
            `Failed to re-fetch GitHub contributions: ${res.status}`
          );
          return;
        }

        const data = (await res.json()) as {
          contributions: Activity[];
        };

        // Store in localStorage for the next render cycle
        if (data.contributions && data.contributions.length > 0) {
          localStorage.setItem(
            "github-contributions",
            JSON.stringify(data.contributions)
          );
          // Optionally trigger a re-render by reloading or using context
          window.location.reload();
        }
      } catch (error) {
        console.warn(
          "Client-side GitHub contributions fetch failed:",
          error instanceof Error ? error.message : String(error)
        );
        // Silent fail on client - the server-side fallback data is already shown
      }
    }

    // Only refetch if we're on the client and the server didn't get data
    const hasData = localStorage.getItem("github-contributions");
    if (!hasData) {
      refetchContributions();
    }
  }, []);

  return null; // This component renders nothing, it just triggers the fetch
}
