import { Button } from "@/components/ui/button";
import { source } from "@/lib/source";
import { cn } from "@/lib/utils";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      sidebar={{
        enabled: false,
      }}
    >
      <main className="mx-auto md:max-w-3xl border-x ">
        <Separator className="border-t-0" />
        <div className="flex items-center justify-between p-2 pl-4">
          <Button
            className="h-7 gap-2 rounded-lg px-0 font-mono text-muted-foreground"
            variant="link"
            asChild
          >
            <Link href="/blog">
              <ArrowLeftIcon />
              Blog
            </Link>
          </Button>
        </div>
        <Separator />
        {children}
      </main>
    </DocsLayout>
  );
}

function Separator({ className }: { className?: string }) {
  return (
    <div className="w-full flex justify-center">
      <div
        className={cn(
          "relative flex h-8 w-full max-w-3xl",
          "before:absolute before:left-1/2 before:-translate-x-1/2 before:-z-1",
          "before:h-8 before:w-full before:max-w-3xl before:content-[''] before:flex",
          "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)]",
          "before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56 border-t border-b",
          className,
          className,
        )}
      />
    </div>
  );
}
