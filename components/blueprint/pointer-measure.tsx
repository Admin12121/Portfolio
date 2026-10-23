"use client";

import { useEffect, useRef } from "react";
import { DRAFTING, drawDraftLine, drawDraftCorner } from "./drafting-strokes";

export interface PointerMeasureProps {
  /** Hovered elements to measure. Any site can opt in via data-measure. */
  selector?: string;
  /** Elements excluded even if they match the hover selector. */
  excludeSelector?: string;
  lightInk?: string;
  darkInk?: string;
  selection?: boolean;
}

type Mark = { getBounds: () => DOMRect | null; created: number; closed?: number };
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
    let raf = 0;
    let x = -100, y = -100;
    const ink = () => document.documentElement.classList.contains("dark") ? darkInk : lightInk;
    const invalidate = () => { if (!raf) raf = requestAnimationFrame(paint); };
    const resize = () => {
      const scale = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(innerWidth * scale);
      canvas.height = Math.round(innerHeight * scale);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      invalidate();
    };
    const strokes = (r: DOMRect, alpha:number) => {
      const left=Math.round(r.left)+.5, top=Math.round(r.top)+.5;
      const width=Math.round(r.width),height=Math.round(r.height);
      if(width<4 || height<4 || left>innerWidth || top>innerHeight || left+width<0 || top+height<0)return;
      const inkColor=ink();
      const base={ink:inkColor,opacity:alpha*.85,width:DRAFTING.fineWeight};
      // All four sides use the same seeded pencil variation as the preloader.
      // Sub-pixel waviness affects ink only; endpoints are exactly DOM-based.
      drawDraftLine(ctx,left,top,left+width,top,{...base,seed:1});
      drawDraftLine(ctx,left+width,top,left+width,top+height,{...base,seed:2});
      drawDraftLine(ctx,left+width,top+height,left,top+height,{...base,seed:3});
      drawDraftLine(ctx,left,top+height,left,top,{...base,seed:4});
      ctx.save();ctx.fillStyle=inkColor;ctx.strokeStyle=inkColor;
      ctx.font="10px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textAlign="center";ctx.textBaseline="middle";
      const labelY=top+height+15<innerHeight?top+height+12:top-13;
      if(width<50 || height<30){
        ctx.globalAlpha=alpha;
        ctx.fillText(`${width} × ${height}`,left+width/2,labelY);
      } else {
        for(const [i,[cx,cy]] of [[left,top],[left+width,top],[left,top+height],[left+width,top+height]].entries())
          drawDraftCorner(ctx,cx,cy,5,{...base,seed:i+10});
        const yLabel=top+height+14<innerHeight?top+height+12:top-12;
        const xLabel=left+width+18<innerWidth?left+width+12:left-12;
        const wText=String(width),hText=String(height);
        const halfW=ctx.measureText(wText).width/2+5,halfH=ctx.measureText(hText).width/2+5;
        for(const [j,[x1,y1,x2,y2]] of [
          [left,yLabel-4,left,yLabel+4],
          [left+width,yLabel-4,left+width,yLabel+4],
          [left,yLabel,left+width/2-halfW,yLabel],
          [left+width/2+halfW,yLabel,left+width,yLabel],
          [xLabel-4,top,xLabel+4,top],
          [xLabel-4,top+height,xLabel+4,top+height],
          [xLabel,top,xLabel,top+height/2-halfH],
          [xLabel,top+height/2+halfH,xLabel,top+height],
        ].entries()) drawDraftLine(ctx,x1,y1,x2,y2,{...base,opacity:alpha*.68,seed:20+j});
        ctx.globalAlpha=alpha*.86;
        // Tiny paper knockouts prevent measurement labels merging into guides.
        ctx.clearRect(left+width/2-halfW,yLabel-5,halfW*2,10);
        ctx.fillText(wText,left+width/2,yLabel);
        ctx.save();ctx.translate(xLabel,top+height/2);ctx.rotate(-Math.PI/2);
        ctx.clearRect(-halfH,-5,halfH*2,10);ctx.fillText(hText,0,0);ctx.restore();
      }
      ctx.restore();
    };
    function paint(now:number) {
      raf=0; if (!ctx) return;
      ctx.clearRect(0,0,innerWidth,innerHeight);
      if(document.querySelector("[data-blueprint-overlay]")) return;
      let active=false;
      const render=(mark:Mark|null) => {
        if(!mark) return false;
        const rect=mark.getBounds();
        const fadeIn=clamp((now-mark.created)/150);
        const fadeOut=mark.closed === undefined?1:clamp(1-(now-mark.closed)/210);
        if (!rect || fadeOut<=0) return false;
        strokes(rect,fadeIn*fadeOut*.73);
        if(fadeIn<1 || mark.closed!==undefined)active=true;
        return true;
      };
      if(!render(hover)) hover=null;
      if(!render(highlighted)) highlighted=null;
      if(active) invalidate();
    }
    function nearest(clientX:number,clientY:number) {
      const from=document.elementFromPoint(clientX,clientY);
      const next=from?.closest(selector) ?? null;
      const target=next && !next.closest(excludeSelector) ? next : null;
      if(target===hovered)return;
      if(hover && hover.closed===undefined) hover.closed=performance.now();
      hovered=target;
      if(target) hover={getBounds:()=>target.getBoundingClientRect(),created:performance.now()};
      invalidate();
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
    const onPointer=(e:PointerEvent)=>{x=e.clientX;y=e.clientY;nearest(x,y);};
    const onScroll=()=>{nearest(x,y);invalidate();};
    const onSelection=()=>{
      const rect=selectedBounds();
      if(rect){if(!highlighted || highlighted.closed!==undefined)highlighted={getBounds:selectedBounds,created:performance.now()};}
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
