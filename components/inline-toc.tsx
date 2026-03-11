import type { TOCItemType } from "fumadocs-core/toc";
import { cn } from "@/lib/utils";

export function InlineTOC({
  items,
  className,
  children,
  ...props
}: React.ComponentProps<"aside"> & {
  items: TOCItemType[];
}) {
  if (!items.length) {
    return null;
  }

  return (
    <aside className={cn(className)}>
      <p>On this page</p>
      <ul className="flex flex-col px-4 pb-2 text-sm text-muted-foreground">
        <div className="absolute left-1 h-[calc(100%-50px)] w-px dark:bg-zinc-800  bg-zinc-200" />
        {items.map((item) => (
          <li
            key={item.url}
            className="flex py-1"
            style={{
              paddingInlineStart: 16 * Math.max(item.depth - 2, 0),
            }}
          >
            <a
              className="underline-offset-4 transition-colors hover:text-accent-foreground hover:underline"
              href={item.url}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
