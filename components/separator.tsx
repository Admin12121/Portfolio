import { cn } from "@/lib/utils";

export function Separator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-8 w-full border-x border-edge",
        "before:absolute before:-left-[100vw] before:-z-1 before:h-8 before:w-[200vw] before:border-y",
        "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56",
        className,
      )}
    />
  );
}

export function SeparatorH({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute inset-y-0 left-0 right-0 pointer-events-none",
        "before:absolute before:inset-y-0 before:-right-8 before:w-8 before:border-r",
        "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)]",
        "before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56",

        "after:absolute after:inset-y-0 after:-left-8 after:w-8 after:border-l",
        "after:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)]",
        "after:bg-size-[10px_10px] after:[--pattern-foreground:var(--color-edge)]/56",

        className,
      )}
    />
  );
}
