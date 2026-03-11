import { CollapsibleList } from "@/components/collapsible-list";

import { PROJECTS } from "../../data/projects";
import { Panel, PanelHeader, PanelTitle } from "../panel";
import { ProjectItem } from "./project-item";
import { AfterNode, BeforeNode, InnerNode } from "../nodes";

export function Projects() {
  return (
    <Panel id="projects">
      <BeforeNode />
      <InnerNode className="w-full h-full">
        <InnerNode className="w-full h-full" />
        <PanelHeader>
          <PanelTitle>
            Projects
            <sup className="ml-1 font-mono text-sm text-muted-foreground select-none">
              ({PROJECTS.length})
            </sup>
          </PanelTitle>
        </PanelHeader>

        <CollapsibleList
          items={PROJECTS}
          max={4}
          renderItem={(item) => <ProjectItem project={item} />}
        />
      </InnerNode>
      <AfterNode />
    </Panel>
  );
}
