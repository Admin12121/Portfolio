import { cn } from "@/lib/utils";

export function Separator({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-draft-divider="" data-draft-hatch=""
      className={cn(
        "relative flex h-3.5 w-full border-edge",
        "before:-left-[100vw] before:-z-1 before:h-3.5 before:w-full",
        "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[5px_5px] before:[--pattern-foreground:var(--color-edge)]/56",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SeparatorH({ className }: { className?: string }) {
  return (
    <div
      data-draft-hatch=""
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
