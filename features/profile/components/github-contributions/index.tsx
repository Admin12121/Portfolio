import { Suspense } from "react";

import { getGitHubContributions } from "../../data/github-contributions";
import { Panel } from "../panel";
import { GitHubContributionFallback, GitHubContributionGraph } from "./graph";

export function GitHubContributions() {
  const contributions = getGitHubContributions();

  return (
    <Panel data-blueprint-block="" data-blueprint-kind="data" data-blueprint-label="ACTIVITY">
      <h2 className="sr-only py-1" >GitHub Contributions</h2>

        <Suspense fallback={<GitHubContributionFallback />}>
          <GitHubContributionGraph contributions={contributions} />
        </Suspense>

    </Panel>
  );
}
