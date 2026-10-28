import Image from "next/image";

import { SimpleTooltip } from "@/components/ui/tooltip";
import { USER } from "@/features/profile/data/user";
import { cn } from "@/lib/utils";
import { FlipSentences } from "@/registry/flip-sentences";

import { DiameterDimension } from "./diameter-dimension";
import { VerifiedIcon } from "./verified-icon";

export function ProfileHeader() {
  return (
    <div data-blueprint-profile="" data-draft-frame="" className="relative border-b border-edge flex border-x border-edge">
      <div data-draft-edges="right" className="relative z-1 shrink-0 border-r border-edge">
        <div className="-mx-px my-0 flex outline-none">
          <div className="relative z-10 size-32 rounded-full sm:size-40">
            <Image
              data-blueprint-avatar=""
              className="block size-full rounded-full object-cover select-none"
              alt={`${USER.displayName}'s avatar`}
              src={USER.avatar}
              width={160}
              height={160}
              priority
              fetchPriority="high"
            />
            <div
              data-draft-stroke=""
              className="pointer-events-none absolute inset-0 rounded-full inset-ring-1 inset-ring-border"
            />
            <DiameterDimension
              className="-z-1 blackout lg:block"
              diameter={160}
            />
          </div>
        </div>
      </div>
      <div className="relative z-1 flex flex-1 flex-col">
        <div
          data-draft-hatch=""
          className={cn(
            "relative flex grow items-end pb-1 pl-4",
            "before:pointer-events-none before:absolute before:inset-0 before:-z-1",
            "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56",
          )}
        >
          <div className="line-clamp-1 font-mono text-xs text-zinc-300 select-none max-sm:hidden dark:text-zinc-800">
            {"text-3xl "}
            <span className="inline dark:hidden">text-zinc-950</span>
            <span className="hidden dark:inline">text-zinc-50</span>
            {" font-medium"}
          </div>
        </div>

        <div data-draft-edges="top" className="border-t border-edge">
          <h1 className="flex items-center pl-4 text-3xl font-semibold">
            {USER.displayName}
            &nbsp;
            <SimpleTooltip content="Verified">
              <VerifiedIcon className="size-[0.6em] translate-y-px text-info select-none" />
            </SimpleTooltip>
          </h1>

          <div data-blueprint-role="" data-draft-edges="top" className="h-12 border-t border-edge py-1 pl-4 sm:h-auto">
            <FlipSentences sentences={USER.flipSentences} />
          </div>
        </div>
      </div>

    </div>
  );
}
