"use client";

import { useEffect, useRef } from "react";
import { DRAFTING, drawDraftArrow, drawDraftCorner, drawDraftLine } from "./drafting-strokes";

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

/** Canvas-based graphite measurements: zero React re-renders on pointer moves. */
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
    const resize = () => {
      const scale = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(innerWidth * scale);
      canvas.height = Math.round(innerHeight * scale);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      if (hovered && hover) hover.rect = hovered.getBoundingClientRect();
      invalidate();
    };
    const strokes = (r: DOMRect, alpha:number) => {
      const left=Math.round(r.left)+.5, top=Math.round(r.top)+.5;
      const width=Math.round(r.width),height=Math.round(r.height);
      if(width<4 || height<4 || left>innerWidth || top>innerHeight || left+width<0 || top+height<0)return;
      const inkColor=ink();
      const base={ink:inkColor,opacity:alpha*.85,width:DRAFTING.fineWeight};
      // The pointer guide follows exact DOM edges with the same worn-ink
      // density grammar as the fine graphite filter on structural frames.
      drawDraftLine(ctx,left,top,left+width,top,{...base,seed:1});
      drawDraftLine(ctx,left+width,top,left+width,top+height,{...base,seed:2});
      drawDraftLine(ctx,left+width,top+height,left,top+height,{...base,seed:3});
      drawDraftLine(ctx,left,top+height,left,top,{...base,seed:4});
      for(const [i,[cx,cy]] of [[left,top],[left+width,top],[left,top+height],[left+width,top+height]].entries())
        drawDraftCorner(ctx,cx,cy,5,{...base,seed:i+10});

      ctx.save();
      ctx.fillStyle=inkColor;
      ctx.strokeStyle=inkColor;
      ctx.font="10px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textAlign="center";
      ctx.textBaseline="middle";

      const dimStroke={...base,opacity:alpha*.68};
      const yLabel=top+height+14<innerHeight?top+height+12:top-12;
      const isRight=left+width+28<innerWidth;
      const xLabel=isRight?left+width+12:left-12;
      const wText=String(width),hText=String(height);
      const halfW=ctx.measureText(wText).width/2+5;
      const halfH=ctx.measureText(hText).width/2+5;

      // Horizontal dimension (width): extension ticks + open triangle arrowheads.
      drawDraftLine(ctx,left,yLabel-4,left,yLabel+4,{...dimStroke,seed:20});
      drawDraftLine(ctx,left+width,yLabel-4,left+width,yLabel+4,{...dimStroke,seed:21});

      const hArrowLen=Math.min(8,Math.max(4,Math.floor((width-4)/2)));
      const hArrowHalf=Math.min(3,Math.max(1.5,hArrowLen*0.375));
      if(width>=12){
        drawDraftArrow(ctx,left+.5,yLabel,1,0,hArrowLen,hArrowHalf,dimStroke);
        drawDraftArrow(ctx,left+width-.5,yLabel,-1,0,hArrowLen,hArrowHalf,dimStroke);
      }
      const hLineStart=width>=12?left+.5+hArrowLen:left;
      const hLineEnd=width>=12?left+width-.5-hArrowLen:left+width;
      if(hLineEnd-hLineStart>=halfW*2+4){
        drawDraftLine(ctx,hLineStart,yLabel,left+width/2-halfW,yLabel,{...dimStroke,seed:22});
        drawDraftLine(ctx,left+width/2+halfW,yLabel,hLineEnd,yLabel,{...dimStroke,seed:23});
        ctx.globalAlpha=alpha*.86;
        ctx.clearRect(left+width/2-halfW,yLabel-5,halfW*2,10);
        ctx.fillText(wText,left+width/2,yLabel);
      } else {
        if(hLineEnd>hLineStart){
          drawDraftLine(ctx,hLineStart,yLabel,hLineEnd,yLabel,{...dimStroke,seed:22});
        }
        ctx.globalAlpha=alpha*.86;
        ctx.textAlign="left";
        ctx.fillText(wText,left+width+6,yLabel);
        ctx.textAlign="center";
      }

      // Vertical dimension (height): extension ticks + open triangle arrowheads.
      drawDraftLine(ctx,xLabel-4,top,xLabel+4,top,{...dimStroke,seed:24});
      drawDraftLine(ctx,xLabel-4,top+height,xLabel+4,top+height,{...dimStroke,seed:25});

      const vArrowLen=Math.min(8,Math.max(4,Math.floor((height-4)/2)));
      const vArrowHalf=Math.min(3,Math.max(1.5,vArrowLen*0.375));
      if(height>=12){
        drawDraftArrow(ctx,xLabel,top+.5,0,1,vArrowLen,vArrowHalf,dimStroke);
        drawDraftArrow(ctx,xLabel,top+height-.5,0,-1,vArrowLen,vArrowHalf,dimStroke);
      }
      const vLineStart=height>=12?top+.5+vArrowLen:top;
      const vLineEnd=height>=12?top+height-.5-vArrowLen:top+height;
      if(vLineEnd-vLineStart>=halfH*2+4){
        drawDraftLine(ctx,xLabel,vLineStart,xLabel,top+height/2-halfH,{...dimStroke,seed:26});
        drawDraftLine(ctx,xLabel,top+height/2+halfH,xLabel,vLineEnd,{...dimStroke,seed:27});
        ctx.globalAlpha=alpha*.86;
        ctx.save();
        ctx.translate(xLabel,top+height/2);
        ctx.rotate(-Math.PI/2);
        ctx.clearRect(-halfH,-5,halfH*2,10);
        ctx.fillText(hText,0,0);
        ctx.restore();
      } else {
        if(vLineEnd>vLineStart){
          drawDraftLine(ctx,xLabel,vLineStart,xLabel,vLineEnd,{...dimStroke,seed:26});
        }
        ctx.globalAlpha=alpha*.86;
        ctx.textAlign=isRight?"left":"right";
        ctx.fillText(hText,isRight?xLabel+7:xLabel-7,top+height/2);
      }
      ctx.restore();
    };
    function paint(now:number) {
      raf=0; if (!ctx) return;
      if(document.querySelector("[data-blueprint-overlay]")) {
        if (!isCanvasClean) {
          ctx.clearRect(0,0,innerWidth,innerHeight);
          isCanvasClean = true;
        }
        return;
      }
      if (!hover && !highlighted) {
        if (!isCanvasClean) {
          ctx.clearRect(0,0,innerWidth,innerHeight);
          isCanvasClean = true;
        }
        return;
      }
      ctx.clearRect(0,0,innerWidth,innerHeight);
      isCanvasClean = false;
      let active=false;
      const render=(mark:Mark|null) => {
        if(!mark) return false;
        const rect=mark.rect;
        const fadeIn=clamp((now-mark.created)/150);
        const fadeOut=mark.closed === undefined?1:clamp(1-(now-mark.closed)/210);
        if (!rect || fadeOut<=0) return false;
        strokes(rect,fadeIn*fadeOut*.73);
        if(fadeIn<1 || mark.closed!==undefined)active=true;
        return true;
      };
      if(!render(hover)) hover=null;
      if(!render(highlighted)) highlighted=null;
      if (!hover && !highlighted) {
        ctx.clearRect(0,0,innerWidth,innerHeight);
        isCanvasClean = true;
      }
      if(active) invalidate();
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
      if (!isCanvasClean) {
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        isCanvasClean = true;
      }
    };
    const onSelection=()=>{
      const rect=selectedBounds();
      if(rect){
        highlighted={rect,created:performance.now()};
      }
      else if(highlighted && highlighted.closed===undefined) highlighted.closed=performance.now();
      invalidate();
    };
    resize();
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
