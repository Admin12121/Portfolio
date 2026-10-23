import { CollapsibleList } from "@/components/collapsible-list";

import { PROJECTS } from "../../data/projects";
import { Panel, PanelHeader, PanelTitle } from "../panel";
import { ProjectItem } from "./project-item";

export function Projects() {
  const items = PROJECTS.tools;

  return (
    <Panel id="projects">
      <PanelHeader>
        <div className="flex items-center justify-between">
          <PanelTitle className="py-1">
            Projects
            <sup className="ml-1 font-mono text-sm text-muted-foreground select-none">
              ({items.length})
            </sup>
          </PanelTitle>
        </div>
      </PanelHeader>

      <CollapsibleList
        items={items}
        max={6}
        animated
        keyExtractor={(item) => item.id}
        renderItem={(item) => <ProjectItem project={item} />}
      />
    </Panel>
  );
}
