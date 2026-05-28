import type { Writeup } from "@/features/ctf-writeups/types/writeup";
import { CollapsibleList } from "@/components/collapsible-list";
import { WriteupItem } from "./post-item";

export function WriteupList({ writeups }: { writeups: Writeup[] }) {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CollapsibleList
          items={writeups}
          max={8}
          renderItem={(item: Writeup) => <WriteupItem writeup={item} />}
        />

        {writeups.length === 0 && (
          <div className="border-y border-edge p-4">
            <p className="font-mono text-sm">No posts found.</p>
          </div>
        )}
      </div>
    </div>
  );
}