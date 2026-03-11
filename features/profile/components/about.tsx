import { Markdown } from "@/components/markdown";
import { Prose } from "@/components/ui/typography";
import { USER } from "@/features/profile/data/user";

import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel";
import { AfterNode, BeforeNode, InnerNode } from "./nodes";

export function About() {
  return (
    <Panel id="about">
      <BeforeNode pattern="top-dot-bottom-line" />
      <InnerNode className="w-full h-full">
        <InnerNode className="w-full h-full" />
        <PanelHeader>
          <PanelTitle>About</PanelTitle>
        </PanelHeader>

        <PanelContent>
          <Prose>
            <Markdown>{USER.about}</Markdown>
          </Prose>
        </PanelContent>
      </InnerNode>
      <AfterNode pattern="top-line-bottom-dot" />
    </Panel>
  );
}
