import { Suspense } from "react";

import { getGitHubContributions } from "../../data/github-contributions";
import { Panel } from "../panel";
import { GitHubContributionFallback, GitHubContributionGraph } from "./graph";
import { GitHubContributionClientFetcher } from "./client-fetcher";

export function GitHubContributions() {
  // Server-side fetch with fallback (won't block build if it times out)
  const contributions = getGitHubContributions();

  return (
    <Panel>
      <h2 className="sr-only">GitHub Contributions</h2>

      <Suspense fallback={<GitHubContributionFallback />}>
        <GitHubContributionGraph contributions={contributions} />
        {/* Client-side fetcher will re-fetch with actual data after hydration */}
        <GitHubContributionClientFetcher />
      </Suspense>
    </Panel>
  );
}
