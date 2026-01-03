import type { Activity } from "@/components/ui/contribution-graph";
import { GITHUB_USERNAME } from "@/config/site";

type GitHubContributionsResponse = {
  contributions: Activity[];
};

export async function getGitHubContributions() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`,
      {
        next: { revalidate: 86400 }, // Cache for 1 day (86400 seconds)
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(
        `Failed to fetch GitHub contributions: ${res.status} ${res.statusText}`
      );
      return [];
    }

    const data = (await res.json()) as GitHubContributionsResponse;
    return data.contributions;
  } catch (error) {
    // Return empty array on timeout or network error instead of throwing
    // This allows the page to build successfully on Vercel
    console.warn(
      "Failed to fetch GitHub contributions, using fallback:",
      error instanceof Error ? error.message : String(error)
    );
    return [];
  }
}
