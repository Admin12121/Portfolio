import * as Base from "fumadocs-ui/components/codeblock";
import { getHighlighter } from "fumadocs-core/highlight";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";

export interface CodeBlockProps {
  code: string;
  wrapper?: Base.CodeBlockProps;
  lang: string;
}

const langs = ["js", "ts", "jsx", "tsx"] as const;
type SupportedLang = (typeof langs)[number];

function getSafeLang(lang: string): SupportedLang {
  return langs.includes(lang as SupportedLang)
    ? (lang as SupportedLang)
    : "js";
}

const highlighter = await getHighlighter("js", {
  langs: [...langs],
  themes: ["vesper", "github-light"],
});

export async function CodeBlock({ code, lang, wrapper }: CodeBlockProps) {
  const safeLang = getSafeLang(lang);

  const hast = highlighter.codeToHast(code, {
    lang: safeLang,
    defaultColor: false,
    themes: {
      light: "github-light",
      dark: "vesper",
    },
  });

  const rendered = toJsxRuntime(hast, {
    Fragment,
    jsx,
    jsxs,
    components: {
      pre: Base.Pre,
    },
  });

  return (
    <Base.CodeBlock {...wrapper} className={cn("my-0", wrapper?.className)}>
      {rendered}
    </Base.CodeBlock>
  );
}