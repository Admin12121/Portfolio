"use client";

import { useEffect, useRef } from "react";
import { DRAFTING, drawDraftArrow, drawDraftLine } from "./drafting-strokes";

export interface PointerMeasureProps {
  /** Hovered elements to measure. Any site can opt in via data-measure. */
  selector?: string;
  /** Elements excluded even if they match the hover selector. */
  excludeSelector?: string;
  lightInk?: string;
  darkInk?: string;
  selection?: boolean;
}

type Mark = {
  rect: DOMRect | null;
  created: number;
  closed?: number;
};
const clamp = (n:number) => Math.max(0, Math.min(1,n));
const PAD_LEFT = 24;
const PAD_TOP = 28;
const PAD_RIGHT = 64;
const PAD_BOTTOM = 36;

/**
 * Canvas-based graphite measurements bounded to the active target box so
 * `filter: url(#draft-graphite-fine)` renders the exact same line texture as
 * the page without filtering the entire 100vw × 100vh viewport.
 */
export function PointerMeasure({
  selector = "a,button,input,select,textarea,[role='button'],[data-measure]",
  excludeSelector = "[data-no-measure],[data-blueprint-overlay]",
  lightInk = DRAFTING.lightInk,
  darkInk = DRAFTING.darkInk,
  selection = true,
}: PointerMeasureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || matchMedia("(pointer: coarse)").matches) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let hover: Mark | null = null;
    let highlighted: Mark | null = null;
    let hovered: Element | null = null;
    let lastRawTarget: EventTarget | null = null;
    let isCanvasClean = true;
    let raf = 0;
    const ink = () => document.documentElement.classList.contains("dark") ? darkInk : lightInk;
    const invalidate = () => { if (!raf) raf = requestAnimationFrame(paint); };

    const hideCanvas = () => {
      if (!isCanvasClean) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.opacity = "0";
        isCanvasClean = true;
      }
    };

    const resize = () => {
      if (hovered && hover) hover.rect = hovered.getBoundingClientRect();
      invalidate();
    };

    const strokes = (r: DOMRect, alpha:number, offsetX: number, offsetY: number) => {
      const left=Math.round(r.left - offsetX)+.5;
      const top=Math.round(r.top - offsetY)+.5;
      const width=Math.round(r.width),height=Math.round(r.height);
      if(width<4 || height<4)return;
      const inkColor=ink();
      const base={ink:inkColor,opacity:alpha*.85,width:1};

      // 1. Target frame outline (same 1px stroke as page panels/frames).
      drawDraftLine(ctx,left,top,left+width,top,{...base,seed:1});
      drawDraftLine(ctx,left+width,top,left+width,top+height,{...base,seed:2});
      drawDraftLine(ctx,left+width,top+height,left,top+height,{...base,seed:3});
      drawDraftLine(ctx,left,top+height,left,top,{...base,seed:4});

      ctx.save();
      ctx.fillStyle=inkColor;
      ctx.strokeStyle=inkColor;
      ctx.font="11px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textAlign="center";
      ctx.textBaseline="middle";

      const dimStroke={...base,opacity:alpha*.75};
      const isBottom=r.top+height+24<innerHeight;
      const yLabel=isBottom?top+height+14:top-14;
      const isRight=r.left+width+48<innerWidth;
      const xLabel=isRight?left+width+16:left-16;
      const wText=String(width),hText=String(height);
      const halfW=ctx.measureText(wText).width/2+5;
      const hTextW=ctx.measureText(hText).width;
      const halfH=7;

      // 2. Horizontal dimension line (matches FrameWidthDimension / DimensionLine):
      //    - Perpendicular extension lines at left and right edges
      //    - Open 8x6 triangle arrowheads at both ends
      //    - 1px line segments on either side of the centered numeric value
      const hExtTop=isBottom?top+height+2:yLabel-5;
      const hExtBottom=isBottom?yLabel+5:top-2;
      drawDraftLine(ctx,left,hExtTop,left,hExtBottom,dimStroke);
      drawDraftLine(ctx,left+width,hExtTop,left+width,hExtBottom,dimStroke);

      const hArrowLen=Math.min(8,Math.max(4,Math.floor((width-4)/2)));
      const hArrowHalf=Math.min(3,Math.max(1.5,hArrowLen*0.375));
      if(width>=12){
        drawDraftArrow(ctx,left+.5,yLabel,1,0,hArrowLen,hArrowHalf,dimStroke);
        drawDraftArrow(ctx,left+width-.5,yLabel,-1,0,hArrowLen,hArrowHalf,dimStroke);
      }
      const hLineStart=width>=12?left+.5+hArrowLen:left;
      const hLineEnd=width>=12?left+width-.5-hArrowLen:left+width;
      if(hLineEnd-hLineStart>=halfW*2+4){
        drawDraftLine(ctx,hLineStart,yLabel,left+width/2-halfW,yLabel,dimStroke);
        drawDraftLine(ctx,left+width/2+halfW,yLabel,hLineEnd,yLabel,dimStroke);
        ctx.globalAlpha=alpha*.9;
        ctx.fillText(wText,left+width/2,yLabel);
      } else {
        if(hLineEnd>hLineStart){
          drawDraftLine(ctx,hLineStart,yLabel,hLineEnd,yLabel,dimStroke);
        }
        ctx.globalAlpha=alpha*.9;
        ctx.textAlign="left";
        ctx.fillText(wText,left+width+6,yLabel);
        ctx.textAlign="center";
      }

      // 3. Vertical dimension line (matches DiameterDimension / SeparatorHeightDimension):
      //    - Perpendicular extension lines at top and bottom edges
      //    - Open 6x8 triangle arrowheads at top and bottom
      //    - Upright numeric value inline when tall enough, or outside when short
      const vExtLeft=isRight?left+width+2:xLabel-5;
      const vExtRight=isRight?xLabel+5:left-2;
      drawDraftLine(ctx,vExtLeft,top,vExtRight,top,dimStroke);
      drawDraftLine(ctx,vExtLeft,top+height,vExtRight,top+height,dimStroke);

      const vArrowLen=Math.min(8,Math.max(4,Math.floor((height-4)/2)));
      const vArrowHalf=Math.min(3,Math.max(1.5,vArrowLen*0.375));
      if(height>=12){
        drawDraftArrow(ctx,xLabel,top+.5,0,1,vArrowLen,vArrowHalf,dimStroke);
        drawDraftArrow(ctx,xLabel,top+height-.5,0,-1,vArrowLen,vArrowHalf,dimStroke);
      }
      const vLineStart=height>=12?top+.5+vArrowLen:top;
      const vLineEnd=height>=12?top+height-.5-vArrowLen:top+height;
      if(vLineEnd-vLineStart>=halfH*2+8){
        drawDraftLine(ctx,xLabel,vLineStart,xLabel,top+height/2-halfH,dimStroke);
        drawDraftLine(ctx,xLabel,top+height/2+halfH,xLabel,vLineEnd,dimStroke);
        ctx.globalAlpha=alpha*.9;
        ctx.clearRect(xLabel-hTextW/2-2,top+height/2-halfH,hTextW+4,halfH*2);
        ctx.fillText(hText,xLabel,top+height/2);
      } else {
        if(vLineEnd>vLineStart){
          drawDraftLine(ctx,xLabel,vLineStart,xLabel,vLineEnd,dimStroke);
        }
        ctx.globalAlpha=alpha*.9;
        ctx.textAlign=isRight?"left":"right";
        ctx.fillText(hText,isRight?xLabel+8:xLabel-8,top+height/2);
      }
      ctx.restore();
    };

    function paint(now:number) {
      raf=0; if (!ctx || !canvas) return;
      if(document.querySelector("[data-blueprint-overlay]")) {
        hideCanvas();
        return;
      }
      const activeMark = highlighted ?? hover;
      if (!activeMark || !activeMark.rect) {
        hideCanvas();
        return;
      }
      const fadeIn=clamp((now-activeMark.created)/150);
      const fadeOut=activeMark.closed === undefined?1:clamp(1-(now-activeMark.closed)/210);
      if (fadeOut<=0) {
        if (activeMark === hover) hover = null;
        if (activeMark === highlighted) highlighted = null;
        hideCanvas();
        return;
      }

      const r = activeMark.rect;
      const boxLeft = Math.max(0, Math.floor(r.left - PAD_LEFT));
      const boxTop = Math.max(0, Math.floor(r.top - PAD_TOP));
      const boxRight = Math.min(innerWidth, Math.ceil(r.right + PAD_RIGHT));
      const boxBottom = Math.min(innerHeight, Math.ceil(r.bottom + PAD_BOTTOM));
      const boxW = Math.max(1, boxRight - boxLeft);
      const boxH = Math.max(1, boxBottom - boxTop);
      const scale = Math.min(devicePixelRatio || 1, 2);
      const targetW = Math.round(boxW * scale);
      const targetH = Math.round(boxH * scale);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        canvas.style.width = `${boxW}px`;
        canvas.style.height = `${boxH}px`;
      }
      canvas.style.transform = `translate3d(${boxLeft}px, ${boxTop}px, 0)`;
      canvas.style.opacity = "1";
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.clearRect(0, 0, boxW, boxH);
      isCanvasClean = false;

      strokes(r, fadeIn * fadeOut * 0.85, boxLeft, boxTop);

      if (fadeIn < 1 || activeMark.closed !== undefined) invalidate();
    }

    function selectedBounds(): DOMRect | null {
      const selection=document.getSelection();
      if(!selection || selection.isCollapsed || !selection.rangeCount)return null;
      const rects=Array.from(selection.getRangeAt(0).getClientRects()).filter(r=>r.width>0 && r.height>0);
      if(!rects.length)return null;
      const l=Math.min(...rects.map(r=>r.left)),t=Math.min(...rects.map(r=>r.top));
      const r=Math.max(...rects.map(r=>r.right)),b=Math.max(...rects.map(r=>r.bottom));
      return new DOMRect(l,t,r-l,b-t);
    }
    const onPointer=(e:PointerEvent)=>{
      if (e.target === lastRawTarget) return;
      lastRawTarget = e.target;
      const from = e.target instanceof Element ? e.target : null;
      const next = from?.closest(selector) ?? null;
      const target = next && !next.closest(excludeSelector) ? next : null;
      if (target === hovered) return;
      if (hover && hover.closed === undefined) hover.closed = performance.now();
      hovered = target;
      if (target) {
        hover = {
          rect: target.getBoundingClientRect(),
          created: performance.now(),
        };
      }
      invalidate();
    };
    const onScroll=()=>{
      if (!hover && !highlighted && isCanvasClean) return;
      hovered = null;
      lastRawTarget = null;
      hover = null;
      highlighted = null;
      hideCanvas();
    };
    const onSelection=()=>{
      const rect=selectedBounds();
      if(rect){
        highlighted={rect,created:performance.now()};
      }
      else if(highlighted && highlighted.closed===undefined) highlighted.closed=performance.now();
      invalidate();
    };
    window.addEventListener("resize",resize);
    window.addEventListener("pointermove",onPointer,{passive:true});
    window.addEventListener("scroll",onScroll,{passive:true});
    if(selection)document.addEventListener("selectionchange",onSelection);
    return()=>{
      cancelAnimationFrame(raf);
      window.removeEventListener("resize",resize);
      window.removeEventListener("pointermove",onPointer);
      window.removeEventListener("scroll",onScroll);
      if(selection) document.removeEventListener("selectionchange",onSelection);
    };
  },[selector,excludeSelector,lightInk,darkInk,selection]);
  return <canvas ref={canvasRef} className="blueprint-pointer-canvas" aria-hidden="true" />;
}
