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
      ctx.font="11px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textAlign="center";
      ctx.textBaseline="middle";

      const dimStroke={...base,opacity:alpha*.72};
      const isBottom=top+height+18<innerHeight;
      const yLabel=isBottom?top+height+12:top-12;
      const isRight=left+width+36<innerWidth;
      const xLabel=isRight?left+width+14:left-14;
      const wText=String(width),hText=String(height);
      const halfW=ctx.measureText(wText).width/2+4;
      const hTextWidth=ctx.measureText(hText).width;
      const halfH=7;

      // Horizontal dimension (width): extension lines + open triangle arrowheads.
      const extY1=isBottom?top+height+2:top-2;
      const extY2=isBottom?yLabel+4:yLabel-4;
      drawDraftLine(ctx,left,extY1,left,extY2,{...dimStroke,seed:20});
      drawDraftLine(ctx,left+width,extY1,left+width,extY2,{...dimStroke,seed:21});

      const hArrowLen=Math.min(8,Math.max(3,Math.floor((width-2)/2)));
      const hArrowHalf=Math.min(3,Math.max(1.5,hArrowLen*0.375));
      if(width>=10){
        drawDraftArrow(ctx,left+.5,yLabel,1,0,hArrowLen,hArrowHalf,{...dimStroke,seed:22});
        drawDraftArrow(ctx,left+width-.5,yLabel,-1,0,hArrowLen,hArrowHalf,{...dimStroke,seed:25});
      }
      const hLineStart=left+.5+hArrowLen;
      const hLineEnd=left+width-.5-hArrowLen;
      const hInlineFits=hLineEnd-hLineStart>=halfW*2+4;
      if(hInlineFits){
        drawDraftLine(ctx,hLineStart,yLabel,left+width/2-halfW,yLabel,{...dimStroke,seed:28});
        drawDraftLine(ctx,left+width/2+halfW,yLabel,hLineEnd,yLabel,{...dimStroke,seed:29});
        ctx.globalAlpha=alpha*.88;
        ctx.fillText(wText,left+width/2,yLabel);
      } else {
        if(hLineEnd>hLineStart){
          drawDraftLine(ctx,hLineStart,yLabel,hLineEnd,yLabel,{...dimStroke,seed:28});
        }
        ctx.globalAlpha=alpha*.88;
        ctx.textAlign="left";
        ctx.fillText(wText,left+width+6,yLabel);
        ctx.textAlign="center";
      }

      // Vertical dimension (height): extension lines + open triangle arrowheads.
      const extX1=isRight?left+width+2:left-2;
      const extX2=isRight?xLabel+4:xLabel-4;
      drawDraftLine(ctx,extX1,top,extX2,top,{...dimStroke,seed:30});
      drawDraftLine(ctx,extX1,top+height,extX2,top+height,{...dimStroke,seed:31});

      const vArrowLen=Math.min(8,Math.max(3,Math.floor((height-2)/2)));
      const vArrowHalf=Math.min(3,Math.max(1.5,vArrowLen*0.375));
      if(height>=10){
        drawDraftArrow(ctx,xLabel,top+.5,0,1,vArrowLen,vArrowHalf,{...dimStroke,seed:32});
        drawDraftArrow(ctx,xLabel,top+height-.5,0,-1,vArrowLen,vArrowHalf,{...dimStroke,seed:35});
      }
      const vLineStart=top+.5+vArrowLen;
      const vLineEnd=top+height-.5-vArrowLen;
      const vInlineFits=vLineEnd-vLineStart>=halfH*2+8;
      if(vInlineFits){
        drawDraftLine(ctx,xLabel,vLineStart,xLabel,top+height/2-halfH,{...dimStroke,seed:38});
        drawDraftLine(ctx,xLabel,top+height/2+halfH,xLabel,vLineEnd,{...dimStroke,seed:39});
        ctx.globalAlpha=alpha*.88;
        ctx.clearRect(xLabel-hTextWidth/2-2,top+height/2-halfH,hTextWidth+4,halfH*2);
        ctx.fillText(hText,xLabel,top+height/2);
      } else {
        if(vLineEnd>vLineStart){
          drawDraftLine(ctx,xLabel,vLineStart,xLabel,vLineEnd,{...dimStroke,seed:38});
        }
        ctx.globalAlpha=alpha*.88;
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
    window.addEventListener("pointerover",onPointer,{passive:true});
    window.addEventListener("scroll",onScroll,{passive:true});
    if(selection)document.addEventListener("selectionchange",onSelection);
    return()=>{
      cancelAnimationFrame(raf);
      window.removeEventListener("resize",resize);
      window.removeEventListener("pointerover",onPointer);
      window.removeEventListener("scroll",onScroll);
      if(selection) document.removeEventListener("selectionchange",onSelection);
    };
  },[selector,excludeSelector,lightInk,darkInk,selection]);
  return <canvas ref={canvasRef} className="blueprint-pointer-canvas" aria-hidden="true" />;
}
