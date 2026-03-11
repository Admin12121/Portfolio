import { Suspense } from "react";

import { getGitHubContributions } from "../../data/github-contributions";
import { Panel } from "../panel";
import { GitHubContributionFallback, GitHubContributionGraph } from "./graph";
import { GitHubContributionClientFetcher } from "./client-fetcher";
import { AfterNode, BeforeNode, InnerNode } from "../nodes";

export function GitHubContributions() {
  const contributions = getGitHubContributions();

  return (
    <Panel>
      <BeforeNode />

      <h2 className="sr-only">GitHub Contributions</h2>
      <InnerNode className="w-full h-full">
        <InnerNode className="w-full h-full" />
        <Suspense fallback={<GitHubContributionFallback />}>
          <GitHubContributionGraph contributions={contributions} />
          <GitHubContributionClientFetcher />
        </Suspense>
      </InnerNode>
      <AfterNode />
    </Panel>
  );
}
