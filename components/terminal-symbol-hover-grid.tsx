"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type Cleanup = () => void;

type HoverBlock = {
  el: HTMLDivElement;
  gx: number;
  gy: number;
  highlightEnd: number;
  isEmpty: boolean;
  scramble: boolean;
  scrambleTimer: ReturnType<typeof setInterval> | null;
};

const CONFIG = {
  symbols: ["O", "X", "*", ">", "$", "W"],
  blockSize: 25,
  detectionRadius: 50,
  clusterSize: 7,
  blockLifetime: 300,
  emptyRatio: 0.3,
  scrambleRatio: 0.25,
  scrambleInterval: 150,
} as const;

function createRandom(seed: number) {
  let value = Math.max(1, Math.floor(seed) % 2147483647);
  return () => {
    value = (value * 16807) % 2147483647;
    return value / 2147483647;
  };
}

function randomSymbol(nextRandom: () => number) {
  return CONFIG.symbols[Math.floor(nextRandom() * CONFIG.symbols.length)] ?? "O";
}

function buildGrid(root: HTMLDivElement): Cleanup {
  const width = root.clientWidth;
  const height = root.clientHeight;
  if (!width || !height) return () => {};

  const nextRandom = createRandom(width * 31 + height * 17);
  const columns = Math.ceil(width / CONFIG.blockSize);
  const rows = Math.ceil(height / CONFIG.blockSize);
  const blocks: HoverBlock[] = [];
  const overlay = document.createElement("div");
  overlay.dataset.slot = "hover-grid-overlay";
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.cssText = "position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:2";

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const isEmpty = nextRandom() < CONFIG.emptyRatio;
      const el = document.createElement("div");
      el.dataset.slot = "hover-grid-block";
      el.style.left = `${col * CONFIG.blockSize}px`;
      el.style.top = `${row * CONFIG.blockSize}px`;
      el.style.width = `${CONFIG.blockSize}px`;
      el.style.height = `${CONFIG.blockSize}px`;
      if (!isEmpty) el.textContent = randomSymbol(nextRandom);
      overlay.appendChild(el);
      blocks.push({
        el,
        gx: col,
        gy: row,
        highlightEnd: 0,
        isEmpty,
        scramble: !isEmpty && nextRandom() < CONFIG.scrambleRatio,
        scrambleTimer: null,
      });
    }
  }

  root.appendChild(overlay);

  function deactivate(block: HoverBlock) {
    delete block.el.dataset.state;
    if (block.scrambleTimer !== null) {
      clearInterval(block.scrambleTimer);
      block.scrambleTimer = null;
    }
    if (!block.isEmpty) block.el.textContent = randomSymbol(nextRandom);
  }

  function activate(block: HoverBlock, delay: number) {
    block.el.dataset.state = "active";
    block.highlightEnd = performance.now() + CONFIG.blockLifetime + delay;
    if (!block.el.textContent) block.el.textContent = randomSymbol(nextRandom);
    if (block.scramble && block.scrambleTimer === null) {
      block.scrambleTimer = setInterval(() => {
        block.el.textContent = randomSymbol(nextRandom);
      }, CONFIG.scrambleInterval);
    }
  }

  // Look up cells by grid position instead of scanning every cell on every pointer event.
  function onPointerMove(event: PointerEvent) {
    if (event.pointerType === "touch") return;
    const rect = root.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const gx = Math.max(0, Math.min(columns - 1, Math.floor(x / CONFIG.blockSize)));
    const gy = Math.max(0, Math.min(rows - 1, Math.floor(y / CONFIG.blockSize)));
    const closest = blocks[gy * columns + gx];
    if (!closest) return;

    const dx = x - (gx + 0.5) * CONFIG.blockSize;
    const dy = y - (gy + 0.5) * CONFIG.blockSize;
    if (Math.hypot(dx, dy) > CONFIG.detectionRadius) return;

    activate(closest, 0);
    const selected = new Set<number>([gy * columns + gx]);
    let current = closest;
    const clusterCount = Math.floor(nextRandom() * CONFIG.clusterSize) + 1;

    for (let step = 0; step < clusterCount; step++) {
      const neighbors: number[] = [];
      for (let row = Math.max(0, current.gy - 1); row <= Math.min(rows - 1, current.gy + 1); row++) {
        for (let col = Math.max(0, current.gx - 1); col <= Math.min(columns - 1, current.gx + 1); col++) {
          const index = row * columns + col;
          if (!selected.has(index)) neighbors.push(index);
        }
      }
      if (!neighbors.length) break;
      const index = neighbors[Math.floor(nextRandom() * neighbors.length)];
      const next = blocks[index];
      if (!next) break;
      activate(next, step * 10);
      selected.add(index);
      current = next;
    }
    // Animation runs only during interaction, not continuously when the page is idle.
    if (!frame) frame = requestAnimationFrame(tick);
  }

  let frame = 0;
  function tick(now: number) {
    frame = 0;
    let hasActive = false;
    for (const block of blocks) {
      if (block.highlightEnd && now >= block.highlightEnd) {
        block.highlightEnd = 0;
        deactivate(block);
      } else if (block.highlightEnd) {
        hasActive = true;
      }
    }
    if (hasActive) frame = requestAnimationFrame(tick);
  }

  root.addEventListener("pointermove", onPointerMove, { passive: true });

  return () => {
    root.removeEventListener("pointermove", onPointerMove);
    cancelAnimationFrame(frame);
    for (const block of blocks) {
      if (block.scrambleTimer !== null) clearInterval(block.scrambleTimer);
    }
    overlay.remove();
  };
}

export type TerminalSymbolHoverGridProps = {
  src?: string;
  alt?: string;
  className?: string;
  priority?: boolean;
};

export function TerminalSymbolHoverGrid({
  src = "/ghost.webp",
  alt = "Blog cover",
  className,
  priority = false,
}: TerminalSymbolHoverGridProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup = buildGrid(root);
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    let currentWidth = root.clientWidth;
    let currentHeight = root.clientHeight;

    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => {
      if (currentWidth === root.clientWidth && currentHeight === root.clientHeight) return;
      if (resizeTimer !== null) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        currentWidth = root.clientWidth;
        currentHeight = root.clientHeight;
        cleanup();
        cleanup = buildGrid(root);
      }, 150);
    });
    observer?.observe(root);

    return () => {
      if (resizeTimer !== null) clearTimeout(resizeTimer);
      observer?.disconnect();
      cleanup();
    };
  }, []);

  return (
    <div
      className={cn("relative isolate aspect-[2.3] w-full overflow-hidden", className)}
      data-cs-hover-grid=""
      data-slot="hover-grid"
      ref={rootRef}
    >
      <Image
        alt={alt}
        src={src}
        fill
        sizes="(max-width: 768px) 100vw, 1152px"
        priority={priority}
        draggable={false}
        className="pointer-events-none z-0 select-none object-cover object-center"
      />
      {/* Transparent foreground from the same artwork, scaled and cropped with
          the base image. The hover symbols sit above both layers. */}
      <Image
        alt=""
        src="/skleton.webp"
        fill
        sizes="(max-width: 768px) 100vw, 1152px"
        priority={priority}
        draggable={false}
        aria-hidden="true"
        className="pointer-events-none select-none object-cover object-center z-10"
      />
      <style>{`
        /* Only the interactive symbol tiles change with the site theme.
           The two illustration layers and hover timings stay unchanged. */
        [data-cs-hover-grid] {
          --hover-grid-cell-bg: rgba(250, 250, 252, 0.95);
          --hover-grid-cell-fg: #1e293b;
        }
        :where(.dark) [data-cs-hover-grid] {
          --hover-grid-cell-bg: var(--background);
          --hover-grid-cell-fg: var(--foreground);
        }
        [data-cs-hover-grid] [data-slot="hover-grid-block"] {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 11px;
          line-height: 1;
          background-color: var(--hover-grid-cell-bg, var(--background));
          color: var(--hover-grid-cell-fg, var(--foreground));
          opacity: 0;
          transition: opacity 200ms ease;
          pointer-events: none;
          user-select: none;
        }
        [data-cs-hover-grid] [data-slot="hover-grid-block"][data-state="active"] {
          opacity: 1;
        }
        @media (prefers-reduced-motion: reduce) {
          [data-cs-hover-grid] [data-slot="hover-grid-block"] { transition: none; }
        }
      `}</style>
    </div>
  );
}
