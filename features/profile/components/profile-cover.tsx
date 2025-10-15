import { FlickeringGrid } from "@/components/global/fliketgrid";
import { cn } from "@/lib/utils";

export function ProfileCover() {
  return (
    <div
      className={cn(
        "aspect-2/1 border-x border-edge select-none sm:aspect-3/1 overflow-hidden",
        "flex items-center justify-center text-black dark:text-white",
        "screen-line-before screen-line-after before:-top-px after:-bottom-px",
        "bg-black/0.75 bg-[radial-gradient(var(--pattern-foreground)_1px,transparent_0)] bg-size-[10px_10px] bg-center [--pattern-foreground:var(--color-zinc-950)]/5 dark:bg-white/0.75 dark:[--pattern-foreground:var(--color-white)]/5"
      )}
    >
      <FlickeringGrid
        className="absolute inset-0 z-0 size-full"
        squareSize={4}
        gridGap={3}
        color="#6B7280"
        maxOpacity={0.5}
        flickerChance={0.1}
        height={500}
        width={2100}
      />
    </div>
  );
}
