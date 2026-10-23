import React from "react";
import { SITE_INFO, SOURCE_CODE_GITHUB_URL } from "@/config/site";
import { cn } from "@/lib/utils";
import { RssIcon } from "lucide-react";
import { Icons } from "./icons";

const Footer = () => {
  return (
    <>
      <footer className="relative container-wrapper max-w-screen! overflow-x-hidden px-2">
        <div className="bg-[#f5f3f4] dark:bg-[#121316] border-t px-0 mx-auto border-x border-edge pt-4 container md:fixed:max-w-6xl">
          <p className="mb-4 px-4 text-center font-mono text-sm text-balance text-muted-foreground">
            Built by{" "}
            <a
              className="link"
              href="https://github.com/admin12121"
              target="_blank"
              rel="noopener"
            >
              admin12121
            </a>
            . The source code is available on{" "}
            <a
              className="link"
              href={SOURCE_CODE_GITHUB_URL}
              target="_blank"
              rel="noopener"
            >
              GitHub
            </a>
            .
          </p>
          <div
            className={cn(
              "border-t flex w-full before:z-1 after:z-1",
              "bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] [--pattern-foreground:var(--color-edge)]/56",
            )}
          >
            <nav aria-label="Footer links" className="mx-auto flex items-stretch justify-center divide-x divide-edge border-x border-edge bg-background">
              <a
                className="flex min-h-11 items-center justify-center px-4 font-mono text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:bg-accent focus-visible:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                href={`${SITE_INFO.url}/llms.txt`}
                target="_blank"
                rel="noopener noreferrer"
              >
                llms.txt
              </a>

              <a
                className="flex min-h-11 w-12 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:bg-accent focus-visible:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                href="https://x.com/admin12121?utm_source=admin12121.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
              >
                <Icons.x className="size-5" aria-hidden="true" />
              </a>

              <a
                className="flex min-h-11 w-12 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:bg-accent focus-visible:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                href="https://github.com/admin12121?utm_source=admin12121.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Icons.github className="size-5" aria-hidden="true" />
              </a>

              <a
                className="flex min-h-11 w-12 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:bg-accent focus-visible:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                href="https://www.linkedin.com/in/vickytajpuriya?utm_source=admin12121.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Icons.linkedin className="size-5" aria-hidden="true" />
              </a>

              <a
                className="flex min-h-11 w-12 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:bg-accent focus-visible:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                href={`${SITE_INFO.url}/blog/rss`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="RSS"
              >
                <RssIcon className="size-5" aria-hidden="true" />
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

