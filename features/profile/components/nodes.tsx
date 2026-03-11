import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type NodeSegmentVariant = "solid" | "striped" | "empty";

type NodeSegment = {
  flex: string;
  variant?: NodeSegmentVariant;
};

type RailPatternKey =
  | "before-default"
  | "after-default"
  | "full-line"
  | "full-dot"
  | "dot-mid"
  | "dot-top-bottom-line-mid"
  | "more-than-half-dot-bottom-line"
  | "top-dot-bottom-line"
  | "top-line-bottom-dot"
  | "line-top-dot-bottom"
  | "dot-top-line-bottom";

type NodeRailPattern = NodeSegment[];

type ScreenNodeRailProps = {
  side: "left" | "right";
  segments?: NodeSegment[];
  pattern?: RailPatternKey;
  showOuterNodes?: boolean;
  className?: string;
};

type BeforeNodeProps = {
  className?: string;
  showOuterNodes?: boolean;
  segments?: NodeSegment[];
  pattern?: Exclude<RailPatternKey, "after-default">;
};

type AfterNodeProps = {
  className?: string;
  showOuterNodes?: boolean;
  segments?: NodeSegment[];
  pattern?: Exclude<RailPatternKey, "before-default">;
};

type InnerNodeProps = {
  children?: ReactNode;
  className?: string;
  showNodes?: boolean;
};

const outerNodeClassName =
  "absolute z-99 size-1.5 rotate-45 border border-offgray-100 bg-white dark:border-offgray-900 dark:bg-[hsl(219,92%,2%)] hide lg:block";

const innerNodeClassName =
  "absolute z-99 size-1.5 rotate-45 border border-offgray-100 bg-white dark:border-offgray-900 dark:bg-[hsl(219,92%,2%)] hide lg:block";

const solidSegmentClassName = "w-px bg-[#e4e4e7] dark:bg-[#27272a]";
const stripedSegmentClassName =
  "w-px bg-[repeating-linear-gradient(#e4e4e7_0_4px,#fff_4px_8px)] dark:bg-[repeating-linear-gradient(#1d1e22_0_4px,#121316_4px_8px)]";
const emptySegmentClassName = "w-px bg-transparent";

const RAIL_PATTERNS: Record<RailPatternKey, NodeRailPattern> = {
  "before-default": [
    { flex: "2.6663 1 0%" },
    { flex: "3.20053 1 0%" },
    { flex: "2.59889 1 0%", variant: "striped" },
    { flex: "2.419 1 0%" },
  ],
  "after-default": [
    { flex: "1.96368 1 0%", variant: "striped" },
    { flex: "3.34049 1 0%" },
  ],

  "full-line": [{ flex: "1 1 0%", variant: "solid" }],

  "full-dot": [{ flex: "1 1 0%", variant: "striped" }],

  "dot-mid": [
    { flex: "2 1 0%", variant: "empty" },
    { flex: "1.25 1 0%", variant: "striped" },
    { flex: "2 1 0%", variant: "empty" },
  ],

  "dot-top-bottom-line-mid": [
    { flex: "1.1 1 0%", variant: "striped" },
    { flex: "2.4 1 0%", variant: "solid" },
    { flex: "1.1 1 0%", variant: "striped" },
  ],

  "more-than-half-dot-bottom-line": [
    { flex: "3.2 1 0%", variant: "striped" },
    { flex: "1.8 1 0%", variant: "solid" },
  ],

  "top-dot-bottom-line": [
    { flex: "1.4 1 0%", variant: "striped" },
    { flex: "3.2 1 0%", variant: "solid" },
  ],

  "top-line-bottom-dot": [
    { flex: "3.2 1 0%", variant: "solid" },
    { flex: "1.4 1 0%", variant: "striped" },
  ],

  "line-top-dot-bottom": [
    { flex: "1.8 1 0%", variant: "solid" },
    { flex: "2.2 1 0%", variant: "striped" },
  ],

  "dot-top-line-bottom": [
    { flex: "2.2 1 0%", variant: "striped" },
    { flex: "1.8 1 0%", variant: "solid" },
  ],
};

const BEFORE_SEGMENTS = RAIL_PATTERNS["before-default"];
const AFTER_SEGMENTS = RAIL_PATTERNS["after-default"];

function getSegmentClassName(variant: NodeSegmentVariant = "solid") {
  if (variant === "striped") return stripedSegmentClassName;
  if (variant === "empty") return emptySegmentClassName;
  return solidSegmentClassName;
}

function getRailPattern(
  pattern: RailPatternKey | undefined,
  fallback: RailPatternKey,
  segments?: NodeSegment[],
) {
  if (segments && segments.length > 0) return segments;
  return RAIL_PATTERNS[pattern ?? fallback];
}

function RailSegments({ segments }: { segments: NodeSegment[] }) {
  return (
    <div className="absolute inset-y-0 left-1/2 flex w-px -translate-x-1/2 flex-col">
      {segments.map((segment, index) => (
        <div
          key={`${segment.variant ?? "solid"}-${segment.flex}-${index}`}
          className={getSegmentClassName(segment.variant)}
          style={{ flex: segment.flex }}
        />
      ))}
    </div>
  );
}

function ScreenNodeRail({
  side,
  segments,
  pattern,
  showOuterNodes = false,
  className,
}: ScreenNodeRailProps) {
  const isLeft = side === "left";
  const resolvedSegments = getRailPattern(
    pattern,
    isLeft ? "before-default" : "after-default",
    segments,
  );

  return (
    <span
      className={cn(
        "pointer-events-none absolute inset-y-0 left-1/2 z-1 h-full w-dvw -translate-x-1/2",
        className,
      )}
    >
      {showOuterNodes && (
        <>
          <div
            className={cn(
              outerNodeClassName,
              "bottom-[calc(-1*var(--node-vertical-offset))] outer-section-node-offset left-(--node-horizontal-offset)",
            )}
          />
          <div
            className={cn(
              outerNodeClassName,
              "bottom-[calc(-1*var(--node-vertical-offset))] outer-section-node-offset right-(--node-horizontal-offset)",
            )}
          />
        </>
      )}
      {showOuterNodes && (
        <>
          <div
            className={cn(
              outerNodeClassName,
              "top-[calc(-1*var(--node-vertical-offset))] outer-section-node-offset left-(--node-horizontal-offset)",
            )}
          />
          <div
            className={cn(
              outerNodeClassName,
              "top-[calc(-1*var(--node-vertical-offset))] outer-section-node-offset right-(--node-horizontal-offset)",
            )}
          />
        </>
      )}

      <span
        className={cn(
          "relative flex h-full shrink-0 sm:w-6 md:w-12",
          isLeft ? "border-r lg:border-r-0" : "ml-auto border-l lg:border-l-0",
        )}
      >
        <div
          className={cn(
            "absolute inset-y-0 w-2.5",
            !isLeft && "default-border-text-color",
            isLeft
              ? "right-[-0.5px] translate-x-1/2"
              : "left-[-0.5px] -translate-x-1/2",
          )}
        >
          <RailSegments segments={resolvedSegments} />
        </div>
      </span>
    </span>
  );
}

const BeforeNode = ({
  className,
  showOuterNodes = true,
  segments,
  pattern = "before-default",
}: BeforeNodeProps) => {
  return (
    <ScreenNodeRail
      side="left"
      segments={segments}
      pattern={pattern}
      showOuterNodes={showOuterNodes}
      className={className}
    />
  );
};

const AfterNode = ({
  className,
  showOuterNodes = false,
  segments,
  pattern = "after-default",
}: AfterNodeProps) => {
  return (
    <ScreenNodeRail
      side="right"
      segments={segments}
      pattern={pattern}
      showOuterNodes={showOuterNodes}
      className={className}
    />
  );
};

const InnerNode = ({
  children,
  className,
  showNodes = true,
}: InnerNodeProps) => {
  return (
    <div className={cn("relative", className)}>
      {children}
      {showNodes && (
        <>
          <div
            className={cn(
              innerNodeClassName,
              "bottom-[calc(-1*var(--node-vertical-offset))] -left-[3.5px]",
            )}
          />
          <div
            className={cn(
              innerNodeClassName,
              "bottom-[calc(-1*var(--node-vertical-offset))] -right-[3.5px]",
            )}
          />
        </>
      )}
    </div>
  );
};

export {
  AFTER_SEGMENTS,
  BEFORE_SEGMENTS,
  AfterNode,
  BeforeNode,
  InnerNode,
  RAIL_PATTERNS,
  ScreenNodeRail,
};
