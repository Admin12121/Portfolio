"use client";

import React from "react";
import Link from "next/link";
import { SiteHeaderWrapper } from "./site-header-wrapper";

const Navbar = () => {
  return (
    <SiteHeaderWrapper
      className={cn(
        "sticky top-0 z-50 max-w-screen overflow-x-hidden backdrop-blur-sm px-2",
        "data-[affix=true]:shadow-[0_0_16px_0_black]/8 dark:data-[affix=true]:shadow-[0_0_16px_0_black]/80",
        "not-dark:data-[affix=true]:**:data-header-container:after:bg-border",
        "transition-shadow duration-300"
      )}
    >
      <div
        className="screen-line-before screen-line-after mx-auto flex h-14 items-center justify-between gap-2 border-x border-edge px-2 after:z-1 after:transition-[background-color] sm:gap-4 md:max-w-3xl"
        data-header-container
      >
        <div className="ml-4">
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
        </div>
        <div className="md:col-span-10 flex items-center justify-end pr-5 md:pr-0 relative">
          <ul className="md:flex items-center divide-x w-max shrink-0">
            {navMenu.map((menu) => (
              <NavLink key={menu.name} href={menu.path}>
                {menu.name}
              </NavLink>
            ))}
            <NavLink
              href="https://github.com/Admin12121"
              className=" bg-muted/20"
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
          </ul>
          <ModeSwitcher showLabel variant="circle" start="bottom-right" />
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

import { usePathname } from "next/navigation";

const useLocation = () => {
  const pathname = usePathname();
  return { pathname: pathname ?? "/" };
};
import clsx from "clsx";
import { ModeSwitcher } from "./mode-switch";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
};

export const NavLink = ({ href, children, className, external }: Props) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isActive = currentPath === href;

  return (
    <li className={clsx("relative group h-full", className)}>
      <Link
        href={href}
        className={clsx(
          "w-full h-full block py-4 px-5 transition-colors",
          "group-hover:text-foreground",
          isActive ? "text-foreground" : "text-muted-foreground"
        )}
        target={external ? "_blank" : "_self"}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
      </Link>
      <div
        className={clsx(
          "absolute bottom-0 h-0.5 bg-muted-foreground opacity-0 transition-all duration-500",
          "group-hover:opacity-100 group-hover:w-full",
          isActive ? "!opacity-100 w-full" : "w-0"
        )}
      />
    </li>
  );
};

export default Navbar;
