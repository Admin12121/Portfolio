"use client";

import React from "react";
import Link from "next/link";
import { SiteHeaderWrapper } from "./site-header-wrapper";
import clsx from "clsx";
import { ModeSwitcher } from "./mode-switch";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
// import { SiteConfig } from "./siteconfig";
import { Button } from "../ui/button";

function getRegistrableBase(hostname: string): string {
  if (hostname === "localhost" || hostname.endsWith(".localhost")) {
    return "localhost";
  }

  const parts = hostname.split(".");

  const multiPartSuffixes = new Set(["com.np"]);

  if (parts.length <= 2) {
    return hostname;
  }

  const last2 = parts.slice(-2).join(".");
  const last3 = parts.slice(-3).join(".");
  if (multiPartSuffixes.has(last2)) {
    return last3;
  }
  return last2;
}

function getOrigins() {
  const { protocol, host } = window.location;
  const [hostname, port] = host.split(":");
  const withPort = (h: string) => (port ? `${h}:${port}` : h);

  const base = getRegistrableBase(hostname);

  const mainOrigin = `${protocol}//${withPort(base)}`;
  const docsOrigin = `${protocol}//${withPort(`docs.${base}`)}`;

  return { mainOrigin, docsOrigin };
}

function buildMainHref(path: string, origins: { mainOrigin: string }): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (
    typeof window !== "undefined" &&
    window.location.origin === origins.mainOrigin
  ) {
    return normalized;
  }
  return `${origins.mainOrigin}${normalized}`;
}

const Navbar = () => {
  const [origins, setOrigins] = React.useState({
    mainOrigin: "",
    docsOrigin: "",
  });

  React.useEffect(() => {
    setOrigins(getOrigins());
  }, []);

  const docsHomeHref = origins.docsOrigin ? `${origins.docsOrigin}/` : "/";

  return (
    <SiteHeaderWrapper
      className={cn(
        "sticky top-0 z-50 max-w-screen overflow-x-hidden backdrop-blur-sm px-2",
        "data-[affix=true]:shadow-[0_0_16px_0_black]/8 dark:data-[affix=true]:shadow-[0_0_16px_0_black]/80",
        "not-dark:data-[affix=true]:**:data-header-container:after:bg-border",
        "transition-shadow duration-300",
      )}
    >
      <div className="container-wrapper 3xl:fixed:px-0 px-6">
        <div
          className="screen-line-before screen-line-after mx-auto flex h-14 items-center justify-between gap-2 border-x border-edge after:z-1 after:transition-[background-color] sm:gap-4 container md:fixed:max-w-3xl px-0!"
          data-header-container
        >
          <Link href={docsHomeHref} className="ml-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <polyline points="4 17 10 11 4 5"></polyline>
              <line x1="12" x2="20" y1="19" y2="19"></line>
            </svg>
          </Link>

          <div className="md:col-span-10 flex items-center justify-end pr-0 relative">
            <ul className="flex items-center divide-x w-max shrink-0">
              {navMenu.map((menu) => (
                <NavLink
                  key={menu.name}
                  href={
                    origins.mainOrigin
                      ? buildMainHref(menu.path, origins)
                      : menu.path
                  }
                  activePath={menu.path}
                >
                  {menu.name}
                </NavLink>
              ))}

              <NavLink
                href="https://github.com/Admin12121"
                className="bg-muted/20 border-r"
                external
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.4em"
                  height="1.4em"
                  viewBox="0 0 496 512"
                >
                  <path
                    fill="currentColor"
                    d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6c-3.3.3-5.6-1.3-5.6-3.6c0-2 2.3-3.6 5.2-3.6c3-.3 5.6 1.3 5.6 3.6m-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9c2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3m44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9c.3 2 2.9 3.3 5.9 2.6c2.9-.7 4.9-2.6 4.6-4.6c-.3-1.9-3-3.2-5.9-2.9M244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2c12.8 2.3 17.3-5.6 17.3-12.1c0-6.2-.3-40.4-.3-61.4c0 0-70 15-84.7-29.8c0 0-11.4-29.1-27.8-36.6c0 0-22.9-15.7 1.6-15.4c0 0 24.9 2 38.6 25.8c21.9 38.6 58.6 27.5 72.9 20.9c2.3-16 8.8-27.1 16-33.7c-55.9-6.2-112.3-14.3-112.3-110.5c0-27.5 7.6-41.3 23.6-58.9c-2.6-6.5-11.1-33.3 2.6-67.9c20.9-6.5 69 27 69 27c20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27c13.7 34.7 5.2 61.4 2.6 67.9c16 17.7 25.8 31.5 25.8 58.9c0 96.5-58.9 104.2-114.8 110.5c9.2 7.9 17 22.9 17 46.4c0 33.7-.3 75.4-.3 83.6c0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252C496 113.3 383.5 8 244.8 8M97.2 352.9c-1.3 1-1 3.3.7 5.2c1.6 1.6 3.9 2.3 5.2 1c1.3-1 1-3.3-.7-5.2c-1.6-1.6-3.9-2.3-5.2-1m-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9c1.6 1 3.6.7 4.3-.7c.7-1.3-.3-2.9-2.3-3.9c-2-.6-3.6-.3-4.3.7m32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2c2.3 2.3 5.2 2.6 6.5 1c1.3-1.3.7-4.3-1.3-6.2c-2.2-2.3-5.2-2.6-6.5-1m-11.4-14.7c-1.6 1-1.6 3.6 0 5.9s4.3 3.3 5.6 2.3c1.6-1.3 1.6-3.9 0-6.2c-1.4-2.3-4-3.3-5.6-2"
                  ></path>
                </svg>
              </NavLink>
              {/*<li className={"relative group h-full border-r flex hide"}>
                <SiteConfig className="px-5 py-4 w-full cursor-pointer opacity-50 hover:opacity-100 duration-200 transition-all ease-in-out" />
              </li>*/}
              <li className={"relative group h-full border-r flex hide"}>
                <ModeSwitcher className="px-5 py-4 w-full cursor-pointer opacity-50 hover:opacity-100 duration-200 transition-all ease-in-out" />
              </li>
              <li className={"relative group h-full border-r flex hide"}>
                <Button
                  asChild
                  className="w-full h-full py-4! rounded-none bg-indigo-600 hover:bg-indigo-700"
                >
                  <Link href="/lab">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      color="currentColor"
                      className="size-5"
                    >
                      <path
                        d="M7 7L8.22654 8.05719C8.74218 8.50163 9 8.72386 9 9C9 9.27614 8.74218 9.49836 8.22654 9.94281L7 11"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      ></path>
                      <path
                        d="M11 11H14"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      ></path>
                      <path
                        d="M12 21C15.7497 21 17.6246 21 18.9389 20.0451C19.3634 19.7367 19.7367 19.3634 20.0451 18.9389C21 17.6246 21 15.7497 21 12C21 8.25027 21 6.3754 20.0451 5.06107C19.7367 4.6366 19.3634 4.26331 18.9389 3.95491C17.6246 3 15.7497 3 12 3C8.25027 3 6.3754 3 5.06107 3.95491C4.6366 4.26331 4.26331 4.6366 3.95491 5.06107C3 6.3754 3 8.25027 3 12C3 15.7497 3 17.6246 3.95491 18.9389C4.26331 19.3634 4.6366 19.7367 5.06107 20.0451C6.3754 21 8.25027 21 12 21Z"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      ></path>
                    </svg>
                    Lab
                  </Link>
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </SiteHeaderWrapper>
  );
};

export const navMenu = [
  {
    name: "helo_",
    path: "/",
  },
  {
    name: "blog",
    path: "/blog",
  },
];

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  activePath?: string;
};

const useLocation = () => {
  const pathname = usePathname();
  return { pathname: pathname ?? "/" };
};

export const NavLink = ({
  href,
  children,
  className,
  external,
  activePath,
}: Props) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isActive = activePath
    ? currentPath === activePath
    : currentPath === href;

  return (
    <li className={clsx("relative group h-full", className)}>
      <Link
        href={href}
        className={clsx(
          "w-full h-full block py-4 px-5 transition-colors",
          "group-hover:text-foreground",
          isActive ? "text-foreground" : "text-muted-foreground",
        )}
        target={external ? "_blank" : "_self"}
        rel={external ? "noopener noreferrer" : undefined}
        prefetch={false}
      >
        {children}
      </Link>
      <div
        className={clsx(
          "absolute bottom-0 h-0.5 bg-muted-foreground opacity-0 transition-all duration-500",
          "group-hover:opacity-100 group-hover:w-full",
          isActive ? "opacity-100! w-full" : "w-0",
        )}
      />
    </li>
  );
};

export default Navbar;
