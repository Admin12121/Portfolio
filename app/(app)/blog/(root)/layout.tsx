import { Separator } from "@/components/separator";
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
