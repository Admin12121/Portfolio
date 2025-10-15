import dayjs from "dayjs";
import { ArrowUpRightIcon, FileText } from "lucide-react";
import Image from "next/image";
import React from "react";
import Link from "next/link";

import { getIcon } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import type { Blog } from "../types/blog";

export function BlogItem({
  className,
  blog,
}: {
  className?: string;
  blog: Blog;
}) {
  return (
    <Link
      className={cn("group/cert flex items-center pr-2", className)}
      href={`${blog.url}`}
      rel="noopener"
    >
      {blog.image ? (
        <Image
          src={blog.image}
          alt={blog.title}
          width={64}
          height={64}
          quality={100}
          className="mx-4 flex size-16 shrink-0 select-none rounded-md object-cover"
          unoptimized
          aria-hidden
        />
      ) : (
        <div
          className={cn(
            "mx-4 flex size-6 shrink-0 items-center justify-center rounded-lg select-none",
            "border border-muted-foreground/15 ring-1 ring-edge ring-offset-1 ring-offset-background",
            "bg-muted text-muted-foreground [&_svg]:size-4"
          )}
          aria-hidden
        >
          {blog.icon ? getIcon(blog.icon) : <FileText />}
        </div>
      )}

      <div className="flex-1 space-y-1 border-l border-dashed border-edge p-4 pr-2">
        <h3 className="leading-snug font-medium text-balance underline-offset-4 group-hover/blog:underline">
          {blog.title}
        </h3>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <dl>
            <dt className="sr-only">Issued by</dt>
            <dd>
              <span aria-hidden>@</span>
              <span className="ml-0.5">admin12121</span>
            </dd>
          </dl>

          <Separator
            className="data-[orientation=vertical]:h-4"
            orientation="vertical"
          />

          <dl>
            <dt className="sr-only">Issued on</dt>
            <dd>
              <span>
                {dayjs(blog.createdAt).format("DD.MM.YYYY")}
              </span>
            </dd>
          </dl>
        </div>
      </div>

      <ArrowUpRightIcon className="size-4 text-muted-foreground" aria-hidden />
    </Link>
  );
}
