/** A preloader is only correct while its DOM snapshot matches this viewport. */
export type BlueprintViewportAnchor = {
  scrollX: number;
  scrollY: number;
  innerWidth: number;
  innerHeight: number;
  frameLeft: number;
  frameTop: number;
  frameWidth: number;
  frameHeight: number;
};

function readFrame(rootSelector: string): DOMRect | null {
  const root = document.querySelector<HTMLElement>(rootSelector);
  if (!root) return null;
  // V12 keeps its original DOM unchanged; its first child is the inner content
  // container used by the geometry scanner. No data attribute is required.
  const frame = root.querySelector<HTMLElement>("[data-blueprint-frame-root]")
    || root.firstElementChild
    || root;
  return frame.getBoundingClientRect();
}

export function captureBlueprintViewport(rootSelector: string): BlueprintViewportAnchor | null {
  const frame = readFrame(rootSelector);
  if (!frame) return null;
  return {
    scrollX: window.scrollX,
    scrollY: window.scrollY,
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    frameLeft: frame.left,
    frameTop: frame.top,
    frameWidth: frame.width,
    frameHeight: frame.height,
  };
}

/** Guard against delayed browser scroll restoration, resizing and layout shifts. */
export function matchesBlueprintViewport(
  anchor: BlueprintViewportAnchor,
  rootSelector: string,
  tolerance = 2,
): boolean {
  const current = captureBlueprintViewport(rootSelector);
  if (!current) return false;
  return (
    current.innerWidth === anchor.innerWidth &&
    current.innerHeight === anchor.innerHeight &&
    Math.abs(current.scrollX - anchor.scrollX) <= tolerance &&
    Math.abs(current.scrollY - anchor.scrollY) <= tolerance &&
    Math.abs(current.frameLeft - anchor.frameLeft) <= tolerance &&
    Math.abs(current.frameTop - anchor.frameTop) <= tolerance &&
    Math.abs(current.frameWidth - anchor.frameWidth) <= tolerance &&
    Math.abs(current.frameHeight - anchor.frameHeight) <= tolerance
  );
}

/** Wait briefly for initial scroll restoration before measuring any shapes. */
export async function settleBlueprintViewport(
  isCancelled: () => boolean,
  minDelay = 220,
  maxDelay = 900,
  settleTime = 160,
): Promise<boolean> {
  const begin = performance.now();
  let lastChange = begin;
  let lastX = window.scrollX;
  let lastY = window.scrollY;
  return new Promise<boolean>((resolve) => {
    const check = (now: number) => {
      if (isCancelled()) { resolve(false); return; }
      if (Math.abs(lastX - window.scrollX) > 1 || Math.abs(lastY - window.scrollY) > 1) {
        lastChange = now;
        lastX = window.scrollX;
        lastY = window.scrollY;
      }
      if ((now - begin >= minDelay && now - lastChange >= settleTime) || now - begin >= maxDelay) {
        resolve(true);
        return;
      }
      requestAnimationFrame(check);
    };
    requestAnimationFrame(check);
  });
}
