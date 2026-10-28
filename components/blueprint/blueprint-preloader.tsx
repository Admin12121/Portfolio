"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { measureBlueprint, type BlueprintLayout, type PlotBlock, type BlueprintMeasureOptions } from "./geometry";
import { createBlueprintTextSnapshot } from "./lettering";
import { captureBlueprintViewport, matchesBlueprintViewport, settleBlueprintViewport, type BlueprintViewportAnchor } from "./viewport-sync";

type Phase = "preparing" | "drawing" | "lettering" | "wiping" | "done";
export interface BlueprintPreloaderProps extends BlueprintMeasureOptions {
  color?: string;
  sheetLabel?: string;
  sideNote?: string;
  enabled?: boolean;
  onComplete?: () => void;
}
const clamp = (v:number) => Math.max(0,Math.min(1,v));
const smooth = (t:number) => t*t*(3-2*t);

/** Display the actual same-document logo/image/SVG, not a fabricated pictogram. */
function BlueprintGraphic({source}:{source?:Element}) {
  const holder=useRef<HTMLSpanElement>(null);
  useEffect(()=>{
    if(!source || !holder.current)return;
    const target=source.matches("img,svg,canvas") ? source : source.querySelector("img,svg,canvas");
    if(!target)return;
    // The visual asset may be smaller than its padded hit target (e.g. a 16px
    // project cube inside a 24px icon chip). Do not enlarge it to the chip.
    const hostRect=source.getBoundingClientRect();
    const artRect=target.getBoundingClientRect();
    const inset=source===target ? null : {
      left:artRect.left-hostRect.left,top:artRect.top-hostRect.top,
      width:artRect.width,height:artRect.height,
    };
    const place=(el:HTMLElement|SVGElement)=>{
      el.style.position="absolute";
      el.style.left=inset?`${inset.left}px`:"0";
      el.style.top=inset?`${inset.top}px`:"0";
      el.style.width=inset?`${inset.width}px`:"100%";
      el.style.height=inset?`${inset.height}px`:"100%";
    };
    // A complex inline SVG (the portfolio's shield has thousands of paths)
    // is rasterized by the browser as an image rather than duplicating the
    // entire SVG DOM and slowing down the transition.
    if (target instanceof SVGElement && target.outerHTML.length > 100_000) {
      const markup=new XMLSerializer().serializeToString(target);
      const url=URL.createObjectURL(new Blob([markup],{type:"image/svg+xml"}));
      const image=document.createElement("img");
      image.src=url;image.alt="";
      image.className="bp-graphic-clone";
      place(image);
      image.style.objectFit="contain";
      holder.current.replaceChildren(image);
      return()=>{image.remove();URL.revokeObjectURL(url);};
    }
    const copy=target.cloneNode(true) as HTMLElement | SVGElement;
    copy.removeAttribute("id");
    copy.removeAttribute("data-blueprint-block");
    copy.removeAttribute("data-blueprint-emblem");
    copy.removeAttribute("aria-describedby");
    copy.setAttribute("aria-hidden","true");
    copy.setAttribute("focusable","false");
    copy.classList.add("bp-graphic-clone");
    if(copy instanceof SVGElement) {
      place(copy);copy.style.color="white";
      copy.style.display="block";copy.style.opacity=".82";
      // IDs in the cloned SVG must not shadow IDs on the live document.
      const suffix=`-bp-${Math.random().toString(36).slice(2,8)}`;
      const ids=new Map<string,string>();
      copy.querySelectorAll<SVGElement>("[id]").forEach(el=>{const old=el.id;if(!old)return;const next=old+suffix;ids.set(old,next);el.id=next;});
      for(const node of [copy,...Array.from(copy.querySelectorAll("*"))]) {
        for(const attr of Array.from(node.attributes)) {
          let value=attr.value;
          for(const [old,next] of ids) {
            value=value.replaceAll(`url(#${old})`,`url(#${next})`);
            if(value===`#${old}`)value=`#${next}`;
          }
          if(value!==attr.value)node.setAttribute(attr.name,value);
        }
      }
    } else {
      place(copy);
      copy.style.objectFit="contain";copy.style.display="block";
    }
    holder.current.replaceChildren(copy);
    return()=>{copy.remove();};
  },[source]);
  return <span ref={holder} className="bp-graphic-real" />;
}

/**
 * Lettering and skeletons intentionally use DIFFERENT rectangles. Ranges give
 * tight skeleton ink, but the original DOM line box supplies wrapping, inline
 * links, padding and icon placement. Never squeeze a text clone into ink bounds.
 */
function BlueprintLettering({block,index,letteringStart}:{block:PlotBlock;index:number;letteringStart:number}) {
  const holder=useRef<HTMLSpanElement>(null);
  useEffect(()=>{
    const lettering=block.lettering;
    const source=lettering?.source;
    const mount=holder.current;
    if(!lettering || !source || !mount)return;
    const clone=createBlueprintTextSnapshot(source);
    mount.replaceChildren(clone);
    return()=>{mount.replaceChildren();};
  },[block]);
  if(!block.lettering)return null;
  const {host}=block.lettering;
  return <span className="bp-piece-lettering" style={{
    left:host.x-block.rect.x,
    top:host.y-block.rect.y,
    width:host.width,
    minHeight:host.height,
    // Wait until the hatched skeleton has faded before showing copied text.
    "--bp-text-delay":`${letteringStart+index*35+220}ms`,
  } as CSSProperties}><span ref={holder} className="bp-lettering-mount" /></span>;
}

/**
 * Source-measured border with tiny deterministic drafting irregularities.
 * A single path traces the real element bounds: no invented frame, no filled
 * rectangle, and no perfectly straight stroke appearing before the animation.
 */
function outlinePath(width: number, height: number, _seed: number,
  edges: {top:boolean;right:boolean;bottom:boolean;left:boolean}): string {
  // Keep corners perfectly on the measured DOM rectangle. The *same*
  // draft-graphite-fine SVG filter used by the live hero supplies the ink wear;
  // independent coordinate jitter used to make the blueprint look unrelated.
  const w=Math.max(1,width-1);
  const h=Math.max(1,height-1);
  const paths:string[]=[];
  if(edges.top)paths.push(`M .5 .5 L ${w} .5`);
  if(edges.right)paths.push(`M ${w} .5 L ${w} ${h}`);
  if(edges.bottom)paths.push(`M ${w} ${h} L .5 ${h}`);
  if(edges.left)paths.push(`M .5 ${h} L .5 .5`);
  return paths.join(" ");
}

function DraftedOutline({width,height,seed,edges}:{width:number;height:number;seed:number;edges?:PlotBlock["edges"]}) {
  const visible=edges ?? {top:true,right:true,bottom:true,left:true};
  return <svg className="bp-traced-outline" width="100%" height="100%"
    viewBox={`0 0 ${Math.max(1,width)} ${Math.max(1,height)}`}
    preserveAspectRatio="none" aria-hidden="true">
    <path d={outlinePath(width,height,seed,visible)} pathLength={1} fill="none" />
  </svg>;
}

function PlotShape({block,index,letteringStart,viewportWidth,columnRight}:{block:PlotBlock;index:number;letteringStart:number;viewportWidth:number;columnRight:number}) {
  const {rect,kind}=block;
  // The old overshoot used the entire viewport and crossed the content rail.
  // The measured box may never stretch past the actual right edge.
  const safeRight=Math.min(columnRight-1,viewportWidth-2);
  const overshoot=Math.max(rect.width,Math.min(rect.width*1.06,Math.max(0,safeRight-rect.x)));
  const delay=300+index*69;
  const style={
    left:rect.x,top:rect.y,width:rect.width,height:rect.height,
    "--bp-delay":`${delay}ms`,
    "--bp-unblock":`${letteringStart+index*32}ms`,
    "--bp-final-w":`${rect.width}px`,
    "--bp-over-w":`${overshoot}px`,
  } as CSSProperties;
  const measured=block.measurement !== "none";
  return (
    <div className={`bp-piece bp-piece-${kind}`} style={style} data-plot-piece={index}>
      <span className="bp-piece-label">{block.label}</span>
      <span className="bp-piece-box" data-plot-box={index} />
      {(["outline", "frame", "item", "data"].includes(kind)) && <DraftedOutline width={rect.width} height={rect.height} seed={index+1} edges={block.edges} />}
      {measured && <span className="bp-piece-dimension" data-plot-dimension={index} data-v={Math.round(rect.width)} />}
      {block.source && <BlueprintGraphic source={block.source}/>}
      {kind==="data" && block.cells && block.cells.length>0 && (
        <span className="bp-heatmap-cells">{block.cells.map((cell,i)=>(
          <span key={i} className="bp-heatmap-cell" style={{left:cell.x,top:cell.y,width:cell.width,height:cell.height,opacity:.8+Math.min(4,cell.level)*.05,"--bp-cell-delay":`${delay+Math.min(i,100)*4}ms`} as CSSProperties}/>
        ))}</span>
      )}
      {block.lettering && <BlueprintLettering block={block} index={index} letteringStart={letteringStart} />}
    </div>
  );
}

/** Portable preloader: derives every skeleton and measurement from rendered DOM. */
export function BlueprintPreloader({
  enabled=true,
  rootSelector="[data-blueprint-root]",
  blockSelector,
  maxBlocks=30,
  navigationSelector,
  coverSelector,
  captureDepth,
  color="#2e6fff",
  sheetLabel="SHEET 01 · PORTFOLIO",
  sideNote="ISSUE 01 · SOURCE-MEASURED DRAWING",
  onComplete,
}:BlueprintPreloaderProps) {
  const reducedMotion=useMediaQuery("(prefers-reduced-motion: reduce)");
  const [phase,setPhase]=useState<Phase>(enabled?"preparing":"done");
  const [layout,setLayout]=useState<BlueprintLayout|null>(null);
  const [letteringStart,setLetteringStart]=useState(2600);
  const canvas=useRef<HTMLDivElement>(null);
  const progress=useRef<HTMLOutputElement>(null);
  const complete=useRef(onComplete);
  useEffect(()=>{complete.current=onComplete},[onComplete]);

  useEffect(()=>{
    if(!layout || phase==="done")return;
    const container=canvas.current;
    if(!container)return;
    let raf=0;
    const update=()=>{
      layout.blocks.forEach((block,i)=>{
        const box=container.querySelector<HTMLElement>(`[data-plot-box="${i}"]`);
        if(!box)return;
        const actual=box.getBoundingClientRect();
        const dim=container.querySelector<HTMLElement>(`[data-plot-dimension="${i}"]`);
        if(dim){dim.style.width=`${actual.width}px`;dim.dataset.v=String(Math.round(actual.width));}
      });
      raf=requestAnimationFrame(update);
    };
    raf=requestAnimationFrame(update);
    return()=>cancelAnimationFrame(raf);
  },[layout,phase]);

  useEffect(()=>{
    if(!enabled)return;
    if(reducedMotion){complete.current?.();return;}
    let stopped=false;
    let wiping=false;
    let frame=0;
    let capturedViewport: BlueprintViewportAnchor | null = null;
    const timers:number[]=[];
    const html=document.documentElement;
    const oldOverflow=html.style.overflow;
    const started=performance.now();
    html.style.overflow="hidden";
    const onEscape=(e:KeyboardEvent)=>{if(e.key==="Escape")finish();};
    // A browser can restore a saved scroll offset even when overflow is hidden.
    // Never reveal a fixed snapshot over a page that has since scrolled.
    const onViewportChange=()=>{
      if(capturedViewport && !matchesBlueprintViewport(capturedViewport,rootSelector))finish();
    };
    const onPointer=(e:PointerEvent)=>{
      if(!progress.current)return;
      progress.current.hidden=false;
      progress.current.style.transform=`translate(${e.clientX+12}px,${e.clientY+16}px)`;
    };
    const timeout=(fn:()=>void,delay:number)=>{timers.push(window.setTimeout(fn,delay));};
    const updateProgress=(value:number)=>{if(progress.current)progress.current.textContent=`${Math.round(clamp(value)*100)}%`;};
    const cleanup=()=>{
      timers.forEach(clearTimeout);cancelAnimationFrame(frame);
      clearInterval(ticker);
      document.removeEventListener("keydown",onEscape);
      window.removeEventListener("pointermove",onPointer);
      window.removeEventListener("scroll",onViewportChange);
      window.removeEventListener("resize",onViewportChange);
      html.style.overflow=oldOverflow;
    };
    function finish(){if(stopped)return;stopped=true;cleanup();setPhase("done");complete.current?.();}
    document.addEventListener("keydown",onEscape);
    window.addEventListener("pointermove",onPointer,{passive:true});
    window.addEventListener("scroll",onViewportChange,{passive:true});
    window.addEventListener("resize",onViewportChange,{passive:true});
    timeout(finish,12000);

    async function begin(){
      try {await Promise.race([document.fonts.ready,new Promise<void>(resolve=>timeout(resolve,1800))]);}
      catch {/* Page remains accessible if fonts fail. */}
      if(stopped)return;
      await new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));
      if(stopped)return;
      // Scroll restoration often runs after React mounts. Sampling the first
      // frame and freezing it caused the About skeleton to overlap Projects.
      if(!await settleBlueprintViewport(()=>stopped))return;
      if(stopped)return;
      const measured=measureBlueprint({rootSelector,blockSelector,maxBlocks,navigationSelector,coverSelector,captureDepth});
      const anchor=captureBlueprintViewport(rootSelector);
      if(!measured || !measured.blocks.length || !anchor){finish();return;}
      capturedViewport=anchor;
      setLayout(measured);setPhase("drawing");
      const letteringAt=800+measured.blocks.length*70+220;
      setLetteringStart(letteringAt);
      timeout(()=>{if(!stopped)setPhase("lettering");},letteringAt);
      timeout(()=>{if(!stopped)startWipe();},letteringAt+620);
      function startWipe(){
        if(!capturedViewport || !matchesBlueprintViewport(capturedViewport,rootSelector)){
          finish();
          return;
        }
        wiping=true;setPhase("wiping");
        const begun=performance.now();
        const length=innerHeight+3;
        const animate=(now:number)=>{
          if(stopped)return;
          if(!capturedViewport || !matchesBlueprintViewport(capturedViewport,rootSelector)){
            finish();
            return;
          }
          const t=clamp((now-begun)/1200);
          canvas.current?.style.setProperty("--bp-wipe-y",`${smooth(t)*length}px`);
          updateProgress(.72+.28*t);
          if(t<1){frame=requestAnimationFrame(animate);return;}
          timeout(finish,360);
        };
        frame=requestAnimationFrame(animate);
      }
    }
    void begin();
    const ticker=window.setInterval(()=>{
      if(!stopped && capturedViewport && !matchesBlueprintViewport(capturedViewport,rootSelector)){
        finish();
        return;
      }
      if(!stopped && !wiping)updateProgress(.7*clamp((performance.now()-started)/4000));
    },80);
    return()=>{stopped=true;cleanup();};
  },[enabled,reducedMotion,rootSelector,blockSelector,maxBlocks,navigationSelector,coverSelector,captureDepth]);

  if(!enabled||reducedMotion||phase==="done")return null;
  const blocks=layout?.blocks||[];
  const left=layout?.columnX||0;
  return <div ref={canvas} data-blueprint-overlay="" className={`bp-overlay bp-${phase}`} style={{"--bp-blue":color} as CSSProperties} aria-hidden="true">
    <div className="bp-grid" />
    <div className="bp-axis bp-axis-x"><span>{layout?Math.round(layout.columnRight-layout.columnX):""}</span></div>
    <div className="bp-axis bp-axis-y" />
    <div className="bp-axis bp-axis-right" />
    <div className="bp-column" style={{left:left}} />
    {layout&&<>
      <div className="bp-column bp-column-right" style={{left:layout.columnRight}} />
      <div className="bp-header-datum" style={{top:layout.headerY,left:layout.columnX,width:Math.max(0,layout.columnRight-layout.columnX)}}><span className="bp-cross bp-cross-left" style={{left:0}}/><span className="bp-cross bp-cross-right" style={{left:"100%"}}/></div>
    </>}
    <div className="bp-plot-area">
      {blocks.map((block,i)=><PlotShape key={block.id} block={block} index={i} viewportWidth={layout?.viewportWidth??1440} columnRight={layout?.columnRight??1440} letteringStart={letteringStart}/>)}
      {blocks.slice(1).map((block,i)=>{
        const before=blocks[i];
        if(block.group || before.group || !["title","copy"].includes(block.kind) || !["title","copy"].includes(before.kind))return null;
        const gap=block.rect.y-(before.rect.y+before.rect.height);
        if(gap<9||gap>140||Math.abs(block.rect.x-before.rect.x)>55)return null;
        return <span key={`gap-${block.id}`} className="bp-gap" style={{left:block.rect.x-12,top:before.rect.y+before.rect.height,height:gap,"--bp-delay":`${460+i*69}ms`} as CSSProperties} data-v={Math.round(gap)}/>;
      })}
    </div>
    <div className="bp-progress-origin"><output ref={progress} hidden>0%</output></div>
  </div>;
}
