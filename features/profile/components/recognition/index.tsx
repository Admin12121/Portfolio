import { CollapsibleList } from "@/components/collapsible-list";

import { RECOGNITION } from "../../data/recognition";
import { Panel, PanelHeader, PanelTitle } from "../panel";
import { RecognitionItem } from "./recognition-item";

// The user's source keys remain untouched. The final row index prevents
// React key collisions even if two imported awards reuse the same source key.
const rows = RECOGNITION.map((entry, index) => ({
  entry,
  rowKey: `${entry.kind}:${entry.key}:${index}`,
}));

export function Recognition() {
  return (
    <Panel id="recognition">
      <PanelHeader>
        <PanelTitle className="py-1">
          Recognition
          <sup className="ml-1 font-mono text-sm font-medium text-muted-foreground select-none">
            ({rows.length})
          </sup>
        </PanelTitle>
      </PanelHeader>
      <CollapsibleList
        items={rows}
        max={6}
        keyExtractor={(row) => row.rowKey}
        renderItem={(row) => <RecognitionItem entry={row.entry} />}
      />
    </Panel>
  );
}
