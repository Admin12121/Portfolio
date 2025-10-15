import React from "react";
import Blog from "./_components";
import { cn } from "@/lib/utils";

const page = () => {
  return (
    <main className="max-w-screen overflow-x-hidden px-2">
      <div className="mx-auto md:max-w-3xl">
        <Separator />
        <Blog />
      </div>
    </main>
  );
};

export default page;

function Separator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-8 w-full border-x border-edge",
        "before:absolute before:-left-[100vw] before:-z-1 before:h-8 before:w-[200vw]",
        "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56",
        className
      )}
    />
  );
}
