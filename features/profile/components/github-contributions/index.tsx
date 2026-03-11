import { Suspense } from "react";

import { AfterNode, BeforeNode, InnerNode } from "../nodes";
import { getGitHubContributions } from "../../data/github-contributions";
import { Panel } from "../panel";
import { GitHubContributionFallback, GitHubContributionGraph } from "./graph";

export function GitHubContributions() {
  const contributions = getGitHubContributions();

  return (
    <Panel>
      <BeforeNode />
      <h2 className="sr-only">GitHub Contributions</h2>
      <InnerNode className="h-full w-full">
        <Suspense fallback={<GitHubContributionFallback />}>
          <GitHubContributionGraph contributions={contributions} />
        </Suspense>
      </InnerNode>
      <AfterNode />
    </Panel>
  );
}
