"use client";

import { CollapsibleList } from "@/components/collapsible-list";
import { useState } from "react";

import { PROJECTS } from "../../data/projects";
import { Panel, PanelHeader, PanelTitle } from "../panel";
import { ProjectItem } from "./project-item";
import { Switch } from "@/components/ui/switch";

export function Projects() {
  const [view, setView] = useState<"tools" | "external">("tools");

  const items = view === "tools" ? PROJECTS.tools : PROJECTS.external;

  return (
    <Panel id="projects">
      <PanelHeader>
        <div className="flex items-center justify-between">
          <PanelTitle>
            Projects - {view === "tools" ? "Tools" : "External"}
            <sup className="ml-1 font-mono text-sm text-muted-foreground select-none">
              ({items.length})
            </sup>
          </PanelTitle>

          <div>
            <Switch
              checked={view === "external"}
              onCheckedChange={(c) => setView(c ? "external" : "tools")}
              className="[--thumb-size:--spacing(4)] sm:[--thumb-size:--spacing(3)]"
            />
          </div>
        </div>
      </PanelHeader>

      <CollapsibleList
        items={items}
        max={4}
        renderItem={(item) => <ProjectItem project={item} />}
      />
    </Panel>
  );
}
