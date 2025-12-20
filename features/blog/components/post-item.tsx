import dayjs from "dayjs";
import { FileText, PinIcon, ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { getIcon } from "@/components/icons";
import type { Post } from "@/features/blog/types/blog";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export function PostItem({
  post,
  shouldPreloadImage,
  className,
}: {
  post: Post;
  shouldPreloadImage?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn("group/cert flex items-center pr-2", className)}
    >
      {post.metadata.image ? (
        <Image
          src={post.metadata.image}
          alt={post.metadata.title}
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
          {post.metadata.icon ? getIcon(post.metadata.icon) : <FileText />}
          
          {post.metadata.pinned && (
            <span className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-md bg-secondary">
              <PinIcon className="size-4 rotate-45 text-secondary-foreground" />
              <span className="sr-only">Pinned</span>
            </span>
          )}
        </div>
      )}

      <div className="flex-1 space-y-1 border-l border-dashed border-edge p-4 pr-2">
        <h3 className="leading-snug font-medium text-balance underline-offset-4 group-hover/blog:underline">
          {post.metadata.title}
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
                {dayjs(post.metadata.createdAt).format("DD.MM.YYYY")}
              </span>
            </dd>
          </dl>
        </div>
      </div>

      <ArrowUpRightIcon className="size-4 text-muted-foreground" aria-hidden />
    </Link>
  );
}
