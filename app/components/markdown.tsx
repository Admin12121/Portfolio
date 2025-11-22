import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeExternalLinks from "rehype-external-links";

import { UTM_PARAMS } from "@/config/site";
import { rehypeAddQueryParams } from "@/lib/rehype-add-query-params";

/**
 * Props:
 * - children: markdown string
 * - allowRawHtml: toggle rehypeRaw (default true since you used it before)
 * - components: override element renderers
 */
export interface MarkdownProps {
  children: string;
  allowRawHtml?: boolean;
  components?: React.ComponentProps<typeof ReactMarkdown>["components"];
  className?: string;
}

export function Markdown({
  children,
  allowRawHtml = true,
  components,
  className,
}: MarkdownProps) {
  // Security note: Only enable rehypeRaw if markdown is trusted.
  const rehypePlugins: any[] = [
    allowRawHtml ? rehypeRaw : null,
    [
      rehypeExternalLinks,
      { target: "_blank", rel: "nofollow noopener noreferrer" },
    ],
    [rehypeAddQueryParams, UTM_PARAMS],
  ].filter(Boolean);

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={rehypePlugins}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
