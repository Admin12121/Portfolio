"use client";

import { useEffect } from "react";
import { GITHUB_USERNAME } from "@/config/site";
import type { Activity } from "@/components/ui/contribution-graph";

export function GitHubContributionClientFetcher() {
  useEffect(() => {
    async function refetchContributions() {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

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

        if (data.contributions && data.contributions.length > 0) {
          localStorage.setItem(
            "github-contributions",
            JSON.stringify(data.contributions)
          );
          window.location.reload();
        }
      } catch (error) {
        console.warn(
          "Client-side GitHub contributions fetch failed:",
          error instanceof Error ? error.message : String(error)
        );
      }
    }

    const hasData = localStorage.getItem("github-contributions");
    if (!hasData) {
      refetchContributions();
    }
  }, []);

  return null;
}
