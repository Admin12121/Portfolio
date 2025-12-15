"use client";

import * as React from "react";
import { GalleryHorizontalIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useLayout } from "@/hooks/use-layout";
import { Button } from "@/components/ui/button";

export function SiteConfig({ className }: React.ComponentProps<typeof Button>) {
  const { layout, setLayout } = useLayout();

  return (
    <button
      onClick={() => {
        const newLayout = layout === "fixed" ? "full" : "fixed";
        setLayout(newLayout);
      }}
      className={cn(className)}
      title="Toggle layout"
    >
      <span className="sr-only">Toggle layout</span>
      <GalleryHorizontalIcon className="size-5"/>
    </button>
  );
}
