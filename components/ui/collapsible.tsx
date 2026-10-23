"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { createContext, useContext, useMemo, useState } from "react";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

type CollapsibleContextType = {
  open: boolean;
};

const CollapsibleContext = createContext<CollapsibleContextType | null>(null);

const useCollapsible = () => {
  const context = useContext(CollapsibleContext);

  if (!context) {
    throw new Error(
      "Collapsible components must be used within a CollapsibleWithContext"
    );
  }

  return context;
};

function CollapsibleWithContext({
  defaultOpen,
  open: controlledOpen,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof Collapsible>) {
  const [internalOpen, setOpen] = useState(defaultOpen ?? false);
  const open = controlledOpen ?? internalOpen;
  const value = useMemo(() => ({ open }), [open]);

  function handleOpenChange(nextOpen: boolean) {
    if (controlledOpen === undefined) setOpen(nextOpen);
    onOpenChange?.(nextOpen);
  }

  return (
    <CollapsibleContext.Provider value={value}>
      <Collapsible open={open} onOpenChange={handleOpenChange} {...props} />
    </CollapsibleContext.Provider>
  );
}

function CollapsibleAnimatedContent({
  children,
  ...props
}: Omit<React.ComponentProps<typeof CollapsibleContent>, "forceMount" | "asChild">) {
  const { open } = useCollapsible();
  const [hasOpened, setHasOpened] = useState(open);

  // Mount details once, then retain their nested disclosure state while hidden.
  if (open && !hasOpened) setHasOpened(true);

  return (
    <CollapsibleContent {...props} forceMount aria-hidden={!open || undefined} inert={!open}>
      <div
        data-state={open ? "open" : "closed"}
        className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] data-[state=open]:grid-rows-[1fr] motion-reduce:transition-none"
      >
        <div className="min-h-0 overflow-hidden">{hasOpened ? children : null}</div>
      </div>
    </CollapsibleContent>
  );
}

function CollapsibleChevronsIcon() {
  const { open } = useCollapsible();
  const pathClassName = "origin-center transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] [transform-box:fill-box] motion-reduce:transition-none";
  const style = { transform: open ? "rotate(180deg)" : "rotate(0deg)" };

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 15L12 20L17 15" className={pathClassName} style={style} />
      <path d="M7 9L12 4L17 9" className={pathClassName} style={style} />
    </svg>
  );
}

export {
  Collapsible,
  CollapsibleAnimatedContent,
  CollapsibleChevronsIcon,
  CollapsibleContent,
  CollapsibleTrigger,
  CollapsibleWithContext,
};
