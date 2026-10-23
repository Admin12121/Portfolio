/**
 * Shared deterministic pencil stroke grammar.
 * Geometry is never displaced: only the ink laid along each straight segment
 * varies slightly. Used by Canvas pointer measurements and the SVG/CSS renderer.
 */
export const DRAFTING = {
  blue: "#2e6fff",
  lightInk: "#3774f6",
  darkInk: "#93baff",
  maxWobble: 0.38,
  step: 7,
  fineWeight: 0.98,
} as const;

const fract = (v: number) => v - Math.floor(v);
const hash = (n: number) => fract(Math.sin(n * 12.9898 + 78.233) * 43758.5453123);

export type DraftStrokeOptions = {
  ink: string;
  opacity?: number;
  width?: number;
  seed?: number;
  dash?: readonly number[];
};

/** Draws worn, continuous pencil strokes on an existing Canvas context. */
export function drawDraftLine(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  { ink, opacity = 1, width = DRAFTING.fineWeight, seed = 0, dash }: DraftStrokeOptions,
) {
  const distance = Math.hypot(x2 - x1, y2 - y1);
  if (distance < 0.5) return;
  const unitX = (x2-x1)/distance, unitY=(y2-y1)/distance;
  const segments = Math.max(1,Math.ceil(distance/DRAFTING.step));
  const step = distance/segments;
  ctx.save(); ctx.strokeStyle=ink;ctx.lineCap="round";ctx.lineJoin="round";
  ctx.lineWidth=width;
  if (dash?.length) ctx.setLineDash([...dash]);
  let previousX=x1,previousY=y1;
  for(let i=1;i<=segments;i++){
    const at=i*step;
    const jitter=i===segments?0:(hash(seed+i*1.73)-.5)*2*DRAFTING.maxWobble;
    const xx=x1+unitX*at-unitY*jitter;
    const yy=y1+unitY*at+unitX*jitter;
    ctx.globalAlpha=opacity*(.74+.26*hash(seed+i*2.19));
    ctx.beginPath();ctx.moveTo(previousX,previousY);ctx.lineTo(xx,yy);ctx.stroke();
    previousX=xx;previousY=yy;
  }
  ctx.restore();
}

export function drawDraftCorner(ctx:CanvasRenderingContext2D,x:number,y:number,size:number,opts:DraftStrokeOptions) {
  drawDraftLine(ctx,x-size/2,y,x+size/2,y,{...opts,seed:(opts.seed??0)+11});
  drawDraftLine(ctx,x,y-size/2,x,y+size/2,{...opts,seed:(opts.seed??0)+17});
}
