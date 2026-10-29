/**
 * Shared deterministic pencil stroke grammar.
 * Geometry stays on the exact measured edge so the shared `#draft-graphite-fine`
 * SVG filter supplies the same worn-ink texture across both DOM borders and
 * the pointer measurement canvas.
 */
export const DRAFTING = {
  blue: "#2e6fff",
  lightInk: "#3774f6",
  darkInk: "#93baff",
  maxWobble: 0,
  step: 7,
  fineWeight: 1,
} as const;

export type DraftStrokeOptions = {
  ink: string;
  opacity?: number;
  width?: number;
  seed?: number;
  dash?: readonly number[];
};

/** Draws a continuous 1px stroke filtered by `#draft-graphite-fine`. */
export function drawDraftLine(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  { ink, opacity = 1, width = DRAFTING.fineWeight, dash }: DraftStrokeOptions,
) {
  const distance = Math.hypot(x2 - x1, y2 - y1);
  if (distance < 0.5) return;
  const unitX = (x2-x1)/distance, unitY=(y2-y1)/distance;
  const at = distance;
  const xx=x1+unitX*at;
  const yy=y1+unitY*at;
  ctx.save();
  ctx.strokeStyle = ink;
  ctx.lineCap = "butt";
  ctx.lineJoin = "round";
  ctx.lineWidth = width;
  if (dash?.length) ctx.setLineDash([...dash]);
  ctx.globalAlpha = opacity;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(xx, yy);
  ctx.stroke();
  ctx.restore();
}

export function drawDraftCorner(ctx:CanvasRenderingContext2D,x:number,y:number,size:number,opts:DraftStrokeOptions) {
  drawDraftLine(ctx,x-size/2,y,x+size/2,y,{...opts,seed:(opts.seed??0)+11});
  drawDraftLine(ctx,x,y-size/2,x,y+size/2,{...opts,seed:(opts.seed??0)+17});
}

/**
 * Draws an open triangle arrowhead matching `components/dimension.tsx`
 * (`<path d="M.5 3.5 8.5.5v6Z" />` for horizontal, `<path d="M3.5.5 6.5 8.5h-6Z" />` for vertical).
 */
export function drawDraftArrow(
  ctx: CanvasRenderingContext2D,
  tipX: number,
  tipY: number,
  dirX: number,
  dirY: number,
  length: number,
  halfSpan: number,
  { ink, opacity = 1, width = DRAFTING.fineWeight }: DraftStrokeOptions,
) {
  const baseX = tipX + dirX * length;
  const baseY = tipY + dirY * length;
  const perpX = -dirY * halfSpan;
  const perpY = dirX * halfSpan;
  ctx.save();
  ctx.strokeStyle = ink;
  ctx.lineWidth = width;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.globalAlpha = opacity;
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(baseX + perpX, baseY + perpY);
  ctx.lineTo(baseX - perpX, baseY - perpY);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}
