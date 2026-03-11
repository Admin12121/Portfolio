"use client";
import { FlickeringGrid } from "@/components/global/fliketgrid";
import { cn } from "@/lib/utils";
import { AfterNode, BeforeNode, InnerNode } from "./nodes";
import Security from "./secutity";

export function ProfileCover() {
  return (
    <div
      className={cn(
        "aspect-2/1 border-x border-edge select-none sm:aspect-3/1",
        "flex items-center justify-center text-black dark:text-white",
        "screen-line-before screen-line-after before:-top-px after:-bottom-px",
      )}
    >
      <BeforeNode />
      <InnerNode className="w-full h-full flex items-center justify-center">
        <Security />
        {/* <FlickeringGrid
          className="absolute inset-0 z-0 size-full "
          squareSize={4}
          gridGap={3}
          color="#191b20"
          maxOpacity={0.5}
          flickerChance={0.1}
          height={385}
          width={1150}
          centerFadeRadius={120}
          centerFadeSoftness={160}
        /> */}
      </InnerNode>
      <AfterNode />
    </div>
  );
}
