"use client";

import * as React from "react";
import {
  Home,
  Notebook,
  Github,
  Linkedin,
} from "lucide-react";
import { motion, type Variants, type Transition } from "motion/react";
import { useNavigate } from "react-router-dom";

const BUTTON_MOTION_CONFIG = {
  initial: "rest",
  whileHover: "hover",
  whileTap: "tap",
  variants: {
    rest: { maxWidth: "40px" },
    hover: {
      maxWidth: "140px",
      transition: { type: "spring", stiffness: 200, damping: 35, delay: 0.15 },
    },
    tap: { scale: 0.95 },
  },
  transition: { type: "spring", stiffness: 250, damping: 25 },
};

const LABEL_VARIANTS: Variants = {
  rest: { opacity: 0, x: 4 },
  hover: { opacity: 1, x: 0, visibility: "visible" },
  tap: { opacity: 1, x: 0, visibility: "visible" },
};

const LABEL_TRANSITION: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 25,
};

function ManagementBar() {
  const [isVisible, setIsVisible] = React.useState(false);
  const Router = useNavigate();
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 200 && currentScrollY > lastScrollY.current) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      animate={{
        bottom: isVisible ? "10px" : "-100px",
      }}
      initial={{ bottom: "-100px" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed hidden bottom-2.5 left-1/2 transform -translate-x-1/2 lg:flex w-fit flex-wrap items-center gap-y-2 rounded-2xl border border-border bg-background p-2 shadow-lg z-50"
    >
      {/* <div className="mx-auto flex shrink-0 items-center">
        <button
          disabled={currentPage === 1}
          className="p-1 text-muted-foreground transition-colors hover:text-foreground disabled:text-muted-foreground/30 disabled:hover:text-muted-foreground/30"
          onClick={handlePrevPage}
        >
          <ChevronLeft size={20} />
        </button>
        <div className="mx-2 flex items-center space-x-1 text-sm tabular-nums">
          <span className="text-muted-foreground">/ {TOTAL_PAGES}</span>
        </div>
        <button
          disabled={currentPage === TOTAL_PAGES}
          className="p-1 text-muted-foreground transition-colors hover:text-foreground disabled:text-muted-foreground/30 disabled:hover:text-muted-foreground/30"
          onClick={handleNextPage}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="mx-3 h-6 w-px bg-border rounded-full" /> */}

      <motion.div
        layout
        layoutRoot
        className="mx-auto flex flex-wrap space-x-2 sm:flex-nowrap"
      >
        <motion.button
          {...BUTTON_MOTION_CONFIG}
          className="flex h-10 items-center space-x-2 overflow-hidden whitespace-nowrap rounded-lg bg-neutral-200/60 dark:bg-neutral-800/80 px-2.5 py-2 text-neutral-600 dark:text-neutral-200"
          aria-label="Blacklist"
          onClick={() => Router("/")}
        >
          <Home size={20} className="shrink-0" />
          <motion.span
            variants={LABEL_VARIANTS}
            transition={LABEL_TRANSITION}
            className="invisible text-sm"
          >
            Home
          </motion.span>
        </motion.button>

        <motion.button
          {...BUTTON_MOTION_CONFIG}
          className="flex h-10 items-center space-x-2 overflow-hidden whitespace-nowrap rounded-lg bg-neutral-200/60 dark:bg-neutral-800/80 px-2.5 py-2 text-neutral-600 dark:text-neutral-200"
          aria-label="Reject"
        >
          <Notebook size={20} className="shrink-0" />
          <motion.span
            variants={LABEL_VARIANTS}
            transition={LABEL_TRANSITION}
            onClick={() => Router("/blog")}
            className="invisible text-sm"
          >
            Blog
          </motion.span>
        </motion.button>
      </motion.div>

      <div className="mx-3 hidden h-6 w-px bg-border sm:block rounded-full" />

      <motion.div
        layout
        layoutRoot
        className="mx-auto flex flex-wrap space-x-2 sm:flex-nowrap"
      >
        <motion.button
          {...BUTTON_MOTION_CONFIG}
          className="flex h-10 items-center space-x-2 overflow-hidden whitespace-nowrap rounded-lg bg-neutral-200/60 dark:bg-neutral-800/80 px-2.5 py-2 text-neutral-600 dark:text-neutral-200"
          aria-label="Reject"
        >
          <Github size={20} className="shrink-0" />
        </motion.button>
        <motion.button
          {...BUTTON_MOTION_CONFIG}
          className="flex h-10 items-center space-x-2 overflow-hidden whitespace-nowrap rounded-lg bg-neutral-200/60 dark:bg-neutral-800/80 px-2.5 py-2 text-neutral-600 dark:text-neutral-200"
          aria-label="Reject"
        >
          <Linkedin size={20} className="shrink-0" />
        </motion.button>
      </motion.div>

      <div className="mx-3 hidden h-6 w-px bg-border sm:block rounded-full" />

      <motion.button
        whileTap={{ scale: 0.975 }}
        className="relative flex w-full h-10 text-sm cursor-pointer items-center justify-center rounded-lg  px-3 py-2 text-white transition-colors duration-300  sm:w-auto bg-black "
      >
        <span className="absolute p-0.5 inset-0 rounded-md transition-transform duration-100 group-active:scale-[0.95]">
          <span className="absolute left-0.5 h-[90%] w-[58px] rounded-md bg-lime-400 shadow-[0_10px_10px_-5px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:w-full container">
            <span className="primary absolute inset-0 z-10 bg-black/15 [mask:url('https://assets.codepen.io/605876/chev-mask_1.png')_center/28px_28px_no-repeat]"></span>
            <span className="complimentary absolute inset-0 bg-black/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
          </span>
        </span>
        <span className="z-10 px-4 pl-[calc(58px+1rem)] flex gap-5 items-center justify-center">
          <p>Start Your Project </p>
          <svg className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
        </span>
      </motion.button>
    </motion.div>
  );
}

export default ManagementBar;
