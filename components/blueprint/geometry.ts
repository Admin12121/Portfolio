/** Geometry-driven blueprint discovery. Every coordinate is measured from the host page. */
export type PlotKind = "nav" | "title" | "copy" | "control" | "plate" | "frame" | "graphic" | "avatar" | "data" | "item" | "meta" | "outline";
export type PlotRect = { x: number; y: number; width: number; height: number };
export interface PlotBlock {
  id: string;
  kind: PlotKind;
  label: string;
  rect: PlotRect;
  /** The source node is used for rendering its actual icon/media, never generic placeholder art. */
  source?: Element;
  /** Dimension labels are intentionally selective rather than attached to every line. */
  measurement?: "none" | "width" | "full";
  /** A semantic row groups its icon, title and metadata without duplicating content. */
  group?: string;
  /** Visible original edges only: never draw invented borders at the viewport crop. */
  edges?: {top:boolean;right:boolean;bottom:boolean;left:boolean};
  /** Source-measured miniature cells for charts such as the GitHub calendar. */
  cells?: Array<{x:number;y:number;width:number;height:number;level:number}>;
  lettering?: {
    text: string;
    /** DOM element captured on this frame; kept separately from skeleton ink bounds. */
    source: HTMLElement;
    /** Original CSS line-box rather than the glyph-tight skeleton rectangle. */
    host: PlotRect;
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing: string;
    textAlign: string;
  };
}
export interface BlueprintLayout {
  blocks: PlotBlock[];
  columnX: number;
  columnRight: number;
  viewportWidth: number;
  viewportHeight: number;
  headerY: number;
}
export interface BlueprintMeasureOptions {
  rootSelector?: string;
  blockSelector?: string;
  maxBlocks?: number;
  navigationSelector?: string;
  coverSelector?: string;
  /** Maximum capture depth in CSS pixels from the top of the initial viewport. */
  captureDepth?: number;
}

const OMIT = "[data-blueprint-ignore], [aria-hidden='true'], [hidden], [inert], script, style, noscript, [data-blueprint-overlay]";
const TEXT_SELECTOR = "h1,h2,h3,[role='heading'],[data-blueprint-role],[data-blueprint-block],p,[data-slot='panel-title'],[data-blueprint-part]";
const SEMANTIC_ROW = "[data-blueprint-item]";
const toRect = (r: DOMRect): PlotRect => ({x:r.left,y:r.top,width:r.width,height:r.height});
const area = (r: DOMRect) => Math.max(0,r.width) * Math.max(0,r.height);

function visible(el: Element, vw: number, depth: number): boolean {
  // Explicit decorative icons are intentionally aria-hidden to screen readers,
  // but are still real pixels and must appear in the visual blueprint.
  const explicitVisual = el.hasAttribute("data-blueprint-part") || el.hasAttribute("data-blueprint-item") ||
    (el.matches("svg,img") && el.getAttribute("aria-hidden") === "true");
  // Decorative SVGs are aria-hidden for accessibility, not visually hidden.
  // Exclude an aria-hidden ancestor, but allow the glyph itself.
  if ((explicitVisual ? el.parentElement?.closest(OMIT) : el.closest(OMIT))) return false;
  const r = el.getBoundingClientRect();
  if (r.width < 6 || r.height < 6 || r.bottom <= 0 || r.top >= depth || r.left >= vw || r.right <= 0) return false;
  const s = getComputedStyle(el);
  return s.display !== "none" && s.visibility !== "hidden";
}
function classify(el: HTMLElement, nav?: Element | null): PlotKind {
  const k = el.dataset.blueprintKind;
  if (k && ["nav","title","copy","control","plate","frame","graphic","avatar","data","item","meta","outline"].includes(k)) return k as PlotKind;
  if (el.matches("img,svg,canvas,video,figure")) return "graphic";
  if (el.matches("h1,h2,h3,[role='heading']")) return "title";
  if (el.matches("a,button,[role='button']")) return nav?.contains(el) ? "nav" : "control";
  return "copy";
}
/** Only the visible animated role sentence may contribute to a snapshot. */
export function activeRoleParagraph(root: HTMLElement): HTMLElement | null {
  const children = Array.from(root.querySelectorAll<HTMLElement>("p"));
  return children.sort((a,b) => {
    const score=(el:HTMLElement) => {
      const r=el.getBoundingClientRect();
      const cs=getComputedStyle(el);
      return (r.width>0&&r.height>0?1:0)*10 + Number(cs.opacity || "0")*5;
    };
    return score(b)-score(a);
  })[0] || null;
}
function isTextLeaf(el: HTMLElement): boolean {
  if(el.matches("[data-blueprint-role],[data-blueprint-part=description]")) return true;
  // Heading icons (for instance the verified badge) must not disqualify text.
  if(el.matches("h1,h2,h3,[role='heading']")) return true;
  return !el.querySelector("h1,h2,h3,p,[role='heading'],[data-blueprint-block],button,canvas,img,video");
}
function copyText(el: HTMLElement): PlotBlock["lettering"] | undefined {
  if (!isTextLeaf(el)) return;
  const target=el.matches("[data-blueprint-role]") ? activeRoleParagraph(el) || el : el;
  const str=target.innerText?.trim().replace(/\s+/g," ") || target.textContent?.trim().replace(/\s+/g," ") || "";
  // About paragraphs commonly exceed 420 characters; do not silently drop them.
  const limit=1800;
  if (!str || str.length > limit) return;
  const s=getComputedStyle(target);
  return {source:el,host:toRect(el.getBoundingClientRect()),text:str,
    fontFamily:s.fontFamily,fontSize:s.fontSize,fontWeight:s.fontWeight,
    lineHeight:s.lineHeight,letterSpacing:s.letterSpacing,textAlign:s.textAlign};
}
/** The skeleton tracks text ink, never the surrounding full-width container. */
function textInkRect(el: HTMLElement): PlotRect | null {
  if (!isTextLeaf(el)) return null;
  const target=el.matches("[data-blueprint-role]") ? activeRoleParagraph(el) || el : el;
  const walker=document.createTreeWalker(target,NodeFilter.SHOW_TEXT);
  const lines:DOMRect[]=[];
  let node:Node|null;
  let total=0;
  while((node=walker.nextNode()) && total<100) {
    if(!node.textContent?.trim())continue;
    const parent=node.parentElement;
    if(!parent || parent.closest(".sr-only,[hidden],[aria-hidden='true'],[inert]"))continue;
    const s=getComputedStyle(parent);
    if(s.display==="none" || s.visibility==="hidden" || Number(s.opacity)<.15)continue;
    const range=document.createRange();range.selectNodeContents(node);
    for(const r of Array.from(range.getClientRects())) {
      if(r.width>0 && r.height>0)lines.push(r);
    }
    total++;
  }
  if(!lines.length)return null;
  const left=Math.min(...lines.map(r=>r.left));const top=Math.min(...lines.map(r=>r.top));
  const right=Math.max(...lines.map(r=>r.right));const bottom=Math.max(...lines.map(r=>r.bottom));
  return {x:left,y:top,width:right-left,height:bottom-top};
}

function isDecorativeText(el: HTMLElement) {
  const str=(el.innerText || el.textContent || "").trim();
  return !str || str.length > 1800 || el.matches(".sr-only,[class*='sr-only']");
}

/** Only preloader geometry: gray neutral squares, NOT activity values. */
function makeNeutralActivityCells(panel: PlotRect): NonNullable<PlotBlock["cells"]> {
  const weeks=53, days=7, gap=3;
  // Preserve the original 13px calendar cells when space permits. A narrow
  // viewport clips the wide week grid rather than shrinking it to dots.
  const size=Math.max(11,Math.min(13,Math.floor((panel.width-32-(weeks-1)*gap)/weeks)));
  const top=Math.min(58,Math.max(26,panel.height-7*(size+gap)-12));
  return Array.from({length:weeks*days},(_,i)=>({
    x:16+Math.floor(i/days)*(size+gap),
    y:top+(i%days)*(size+gap),
    width:size,height:size,level:0,
  }));
}

/**
 * Discover and prioritize real DOM geometry. The header and imagery are
 * independent layers; a large cover never becomes an oversized icon skeleton.
 * `data-blueprint-block` opts elements in, without excluding automatic targets.
 */
export function measureBlueprint(options: BlueprintMeasureOptions={}): BlueprintLayout | null {
  const root=document.querySelector<HTMLElement>(options.rootSelector || "[data-blueprint-root]");
  if (!root) return null;
  const frameRoot=root.querySelector<HTMLElement>("[data-blueprint-frame-root]") || (root.firstElementChild as HTMLElement | null) || root;
  const vw=window.innerWidth, vh=window.innerHeight;
  const depth=Math.max(vh*1.15,Math.min(vh*2.25, options.captureDepth ?? vh*1.15));
  const main=(frameRoot || root).getBoundingClientRect();
  const nav=document.querySelector<HTMLElement>(options.navigationSelector || "[data-header-container],nav");
  const cover=root.querySelector<HTMLElement>(options.coverSelector || "[data-blueprint-cover]");
  const max=Math.min(110,Math.max(8,options.maxBlocks ?? 48));
  const collected: Array<{node:HTMLElement;kind?:PlotKind;label?:string;priority:number;group?:string}> = [];
  const seen=new Set<Element>();

  const offer=(node:Element|null|undefined, priority:number, kind?:PlotKind, label?:string, group?:string)=>{
    if (!node || seen.has(node) || !visible(node,vw,depth)) return;
    const el=node as HTMLElement;
    // Do not add huge generic panels. Only explicitly marked FRAME objects may be large.
    const r=el.getBoundingClientRect();
    if (r.height > vh*.68 && !["frame","data","item","outline"].includes(kind || "")) return;
    seen.add(node);collected.push({node:el,priority,kind,label,group});
  };

  // Header: logo MARK, real link labels, the GitHub icon and the theme button.
  // This scans a header outside the configured <main>.
  if (nav && visible(nav,vw,vh)) {
    // Plot the *visible artwork*, not the padding of its clickable parent.
    // SVG width:100% on a 54px nav link used to inflate 20px icons to 54px.
    const logo=nav.querySelector("a:has(img),a:has(svg)");
    if (logo) {
      const mark=logo.querySelector("img,svg") || logo;
      offer(mark,100,"graphic","BRAND MARK");
    }
    for (const control of nav.querySelectorAll<HTMLElement>("a,button,[role='button']")) {
      if (logo && control === logo) continue;
      const text=Array.from(control.childNodes).filter(n=>n.nodeType===Node.TEXT_NODE)
        .map(n=>n.textContent?.trim()||"").join(" ").trim() ||
        Array.from(control.querySelectorAll<HTMLElement>("span"))
          .filter(n=>!n.closest(".sr-only") && getComputedStyle(n).display!=="none")
          .map(n=>n.textContent?.trim()||"").join(" ").trim();
      const visibleGlyph=Array.from(control.querySelectorAll<SVGElement|HTMLImageElement>("svg,img"))
        .find(el=>visible(el,vw,vh));
      if (visibleGlyph && !text) {
        offer(visibleGlyph,91,"graphic",control.matches("button") ? "THEME ICON" : "LINK ICON");
      } else {
        offer(control,90,"nav",control.dataset.blueprintLabel || (text ? undefined : "CONTROL"));
      }
    }
  }

  // A cover is a measured frame, not a filled X-shaped image covering the whole hero.
  if (cover) {
    offer(cover,96,"frame","HERO FRAME");
    // Choose the actual artwork: SVG in the cover, or an explicit emblem.
    const art=cover.querySelector("[data-blueprint-emblem]") ||
      [...cover.querySelectorAll("svg,img,canvas")].sort((a,b)=>area(b.getBoundingClientRect())-area(a.getBoundingClientRect()))[0];
    if (art) offer(art,97,"graphic","CREST");
  }

  // Real panel borders and header rules are separate transparent outlines.
  // This makes the preloader reflect the architecture, not just text and icons.
  // A long panel may extend below the viewport; only its visible portion paints.
  const panels=root.querySelectorAll<HTMLElement>('[data-slot="panel"]');
  let panelIndex=0;
  for (const panel of panels) {
    panelIndex++;
    // ACTIVITY is already a real data block; don't shadow it with an outline
    // (offer() deduplicates nodes by identity).
    if (panel.dataset.blueprintKind !== "data")
      offer(panel,74,"outline",`PANEL ${String(panelIndex).padStart(2,"0")}`);
    const panelHeader=panel.querySelector<HTMLElement>('[data-slot="panel-header"]');
    if (panelHeader) offer(panelHeader,73,"outline",`HEADER ${String(panelIndex).padStart(2,"0")}`);
  }

  // Avatar and profile frame stay independent and retain their real positions/sizes.
  const avatar=root.querySelector("[data-blueprint-avatar],img[alt*='avatar' i]");
  offer(avatar,95,"avatar","AVATAR");
  const header=root.querySelector("[data-blueprint-profile]") || root;
  if (header instanceof HTMLElement) offer(header,92,"outline","PROFILE FRAME");
  offer(header.querySelector("h1"),94,"title","NAME");
  offer(header.querySelector("[data-blueprint-role]"),91,"copy","ROLE");

  // Semantic rows are composed from their actual DOM children. Project edits,
  // list switches and new items are automatically reflected at the next scan.
  // No duplicated project/certification/blog data is stored by the preloader.
  let rowNumber=0;
  for (const row of root.querySelectorAll<HTMLElement>(SEMANTIC_ROW)) {
    if (!visible(row,vw,depth)) continue;
    const group=`row-${++rowNumber}`;
    const prefix=(row.dataset.blueprintItem || "ROW").toUpperCase();
    offer(row,73,"item",prefix,group);
    for (const part of row.querySelectorAll<HTMLElement>("[data-blueprint-part]")) {
      // Don't include invisible collapsible descriptions, sr-only text or
      // unmounted rows. Match precisely what the visitor can see.
      if (!visible(part,vw,depth)) continue;
      const role=part.dataset.blueprintPart;
      const kind:PlotKind = role==="icon"||role==="badge"?"graphic":role==="title"?"title":role==="action"?"control":"meta";
      const label=(part.dataset.blueprintLabel || `${prefix} ${role || "PART"}`).toUpperCase();
      offer(part,role==="icon"?89:role==="title"?87:role==="meta"?79:75,kind,label,group);
    }
  }

  // Semantic content: actual headings, real paragraphs, and selectively marked
  // chart / data regions. Only visible items are plotted.
  const candidates=root.querySelectorAll<HTMLElement>(options.blockSelector || TEXT_SELECTOR);
  for (const el of candidates) {
    // Semantic children have already been selected and should not also appear
    // as generic TITLE/COPY layers. Exclude text within row wrappers.
    if (el.closest(SEMANTIC_ROW)) continue;
    if (isDecorativeText(el) && el.dataset.blueprintKind !== "data") continue;
    // The role is measured as ONE frozen item. Exclude its animated children,
    // including exit/current motion paragraphs which may both exist in the DOM.
    if (header.contains(el) && (el.matches("h1,[data-blueprint-role]") || el.closest("[data-blueprint-role]"))) continue;
    if (el.matches("[data-blueprint-block]") && el.dataset.blueprintKind === "frame") {
      offer(el,76,"frame");continue;
    }
    const isMarked=el.hasAttribute("data-blueprint-block");
    // Ignore a large marked wrapper containing already selected child text,
    // unless it is a genuine chart/data visualization.
    if (isMarked && el.dataset.blueprintKind === "data") {offer(el,82,"data");continue;}
    if (!isTextLeaf(el)) continue;
    const isHeading=el.matches("h2,h3,[role='heading'],[data-slot='panel-title']");
    offer(el,isMarked?84:isHeading?80:66);
  }


  const sorted = collected.sort((a,b)=>a.node.getBoundingClientRect().top - b.node.getBoundingClientRect().top ||
    a.node.getBoundingClientRect().left - b.node.getBoundingClientRect().left || b.priority-a.priority);
  // When too many are visible, keep essential header/profile blocks first,
  // then fill remaining slots in vertical reading order.
  let chosen=sorted;
  if (sorted.length>max) {
    const mandatory=sorted.filter(x=>x.priority>=90);
    const others=sorted.filter(x=>x.priority<90);
    chosen=[...mandatory,...others.slice(0,Math.max(0,max-mandatory.length))];
    chosen.sort((a,b)=>a.node.getBoundingClientRect().top-b.node.getBoundingClientRect().top || a.node.getBoundingClientRect().left-b.node.getBoundingClientRect().left);
  }

  const counts: Record<PlotKind,number>={nav:0,title:0,copy:0,control:0,plate:0,frame:0,graphic:0,avatar:0,data:0,item:0,meta:0,outline:0};
  const blocks:PlotBlock[]=chosen.map(({node,kind:explicitKind,label:explicitLabel,group},i)=>{
    const kind=explicitKind||classify(node,nav);
    counts[kind]++;
    const measuredText=["title","copy","meta"].includes(kind) ? textInkRect(node) : null;
    const r=measuredText || toRect(node.getBoundingClientRect());
    // Coordinates are *not* shifted left/up to fit; that would break matching
    // geometry. Clip visually at the viewport instead.
    const gutter=2;
    const outsideContent=nav?.contains(node) === true;
    const leftBound=outsideContent ? gutter : Math.max(main.left, gutter);
    const rightBound=outsideContent ? vw-gutter : Math.min(main.right-1, vw-gutter);
    const maxWidth=Math.max(0,rightBound-Math.max(r.x,leftBound));
    const isStructural=kind==="outline" || kind==="frame";
    const visibleY=isStructural ? Math.max(0,r.y) : r.y;
    const visibleBottom=isStructural ? Math.min(vh,r.y+r.height) : r.y+r.height;
    const rect:PlotRect={
      x:Math.max(r.x,leftBound),
      y:visibleY,
      width:Math.max(0,Math.min(r.width,maxWidth)),
      height:Math.max(0,visibleBottom-visibleY),
    };
    const edges=isStructural ? {
      top:r.y >= 0,
      bottom:r.y+r.height <= vh,
      left:r.x >= leftBound,
      right:r.x+r.width <= rightBound+1,
    } : undefined;
    const source = (["graphic","avatar"].includes(kind) || (["nav","control"].includes(kind) && !!node.querySelector("img,svg"))) ? node : undefined;
    // Draw activity cells even if React Suspense has not mounted the remote
    // GitHub result or the fallback when the preloader takes its snapshot.
    // Prefer exact DOM cell geometry; only the *empty structural calendar* is
    // constructed locally. The blueprint never invents contribution counts.
    const cellNodes=kind==="data" ?
      Array.from(node.querySelectorAll<SVGRectElement|HTMLElement>("rect[data-date],[data-blueprint-cell]")) : [];
    const measuredCells=cellNodes.filter(el=>visible(el,vw,depth)).slice(0,375).map(el=>{
      const c=el.getBoundingClientRect();
      return {x:c.x-rect.x,y:c.y-rect.y,width:c.width,height:c.height,level:Number(el.dataset.level)||0};
    });
    // A partially streamed/suspended calendar is not a usable snapshot. A
    // consistent 7-row / 53-week outline is guaranteed for the ACTIVITY panel.
    const cells=kind==="data" && measuredCells.length<100 &&
      (node.dataset.blueprintLabel==="ACTIVITY" || !!node.querySelector("[data-contribution-placeholder]"))
      ? makeNeutralActivityCells(rect)
      : measuredCells;
    const measurement:PlotBlock["measurement"] = node.dataset.blueprintMeasure === "full" ? "full"
      : node.dataset.blueprintMeasure === "width" ? "width"
      : node.dataset.blueprintMeasure === "none" || group ? "none"
      : kind==="title" && rect.width>=100 ? "width"
      : kind==="copy" && rect.width>=150 && counts.copy<=2 ? "full" : "none";
    return {id:`draft-${i}`,kind,group,measurement,label:explicitLabel||node.dataset.blueprintLabel||`${({nav:"NAV",title:"TITLE",copy:"COPY",control:"CONTROL",plate:"PLATE",frame:"FRAME",graphic:"ICON",avatar:"AVATAR",data:"DATA",item:"ROW",meta:"META",outline:"BORDER"} as Record<PlotKind,string>)[kind]} ${String(counts[kind]).padStart(2,"0")}`,
      rect,edges,source,cells,lettering:["nav","title","copy","control","meta"].includes(kind)?copyText(node):undefined};
  }).filter(x=>x.rect.width>=6 && x.rect.height>=6);

  return {blocks,columnX:main.left,columnRight:main.right,viewportWidth:vw,viewportHeight:vh,
    headerY:nav?.getBoundingClientRect().bottom??0};
}
