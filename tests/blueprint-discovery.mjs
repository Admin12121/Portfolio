/** Standalone semantic discovery regression: no running Next.js server needed.
 * Run: bun run test:blueprint:discovery
 * Uses the project's own TS geometry module in a real Chromium DOM.
 */
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { chromium } from "playwright";
const source=fs.readFileSync(path.join(process.cwd(),"components/blueprint/geometry.ts"),"utf8");
const compiled=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
const fixture=`<!doctype html><html><head><style>
*{box-sizing:border-box}body{margin:0;font:14px Arial}nav{height:45px;display:flex;gap:12px;align-items:center;padding:0 25px}nav svg{height:18px;width:18px}main{max-width:700px;margin:auto}#cover{height:180px;display:flex;align-items:center;justify-content:center;border:1px solid #aaa}#cover svg{height:100px;width:100px}#profile{height:110px;display:flex;gap:12px;align-items:center}#profile img{height:80px;width:80px}#about{height:125px}#activity{height:95px}h1{font-size:24px}h3{font-size:18px;margin:4px 0}.item{display:flex;align-items:center;gap:12px;height:75px;border:1px solid #ddd;padding:10px}.icon{width:26px;height:26px}.icon svg{width:26px;height:26px}.metadata{font-size:12px}
</style></head><body>
<nav data-header-container><a><svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="9"/></svg></a><a>hello</a><button><svg viewBox="0 0 20 20"><path d="M1 1L19 19"/></svg></button></nav>
<main data-blueprint-root><div id=cover data-blueprint-cover><svg data-blueprint-emblem viewBox="0 0 100 100"><rect x=10 y=10 width=80 height=80/></svg></div><div id=profile data-blueprint-profile><img data-blueprint-avatar alt="user avatar" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="/><div><h1>Admin12121</h1><div data-blueprint-role><p>Developer</p></div></div></div><section id=about><h2>About</h2><p>Rendered live text on this page</p></section><section id=activity data-blueprint-block data-blueprint-kind=data data-blueprint-label=ACTIVITY>Activity</section>
<section id=projects><h2>Projects</h2><div data-blueprint-item=PROJECT class=item id=project1><div class=icon aria-hidden=true data-blueprint-part=icon><svg viewBox="0 0 20 20"><path d="M1 1L19 19"/></svg></div><div><h3><span data-blueprint-part=title>Decompile</span></h3><div class=metadata data-blueprint-part=meta>05.2026 — ∞</div></div></div><div data-blueprint-item=PROJECT class=item><div class=icon aria-hidden=true data-blueprint-part=icon><svg viewBox="0 0 20 20"><path d="M1 1L19 19"/></svg></div><div><h3><span data-blueprint-part=title>Encapsula</span></h3><div data-blueprint-part=meta class=metadata>10.2025 — ∞</div></div></div></section>
<section id=certs><h2>Certifications</h2><div class=item data-blueprint-item=CERTIFICATION><div class=icon aria-hidden=true data-blueprint-part=icon><svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="9"/></svg></div><div><h3 data-blueprint-part=title>Web-RTA</h3><div data-blueprint-part=meta>Cyberwarfare Labs</div></div></div></section>
<section id=blog><h2>Blog</h2><div class=item data-blueprint-item=BLOG><div class=icon aria-hidden=true data-blueprint-part=icon><svg viewBox="0 0 20 20"><rect x="2" y="2" width="16" height="16"/></svg></div><div><h3 data-blueprint-part=title>Malware Research</h3><div data-blueprint-part=meta>16.12.2025</div></div></div></section></main></body></html>`;
const browser=await chromium.launch({headless:true});
try {
 for (const viewport of [{width:1440,height:900},{width:390,height:844}]) {
  const page=await browser.newPage({viewport});
  await page.setContent(fixture);
  await page.evaluate((code)=>{const exports={};(new Function("exports",code))(exports);window.__bp=exports},compiled);
  const blocks=await page.evaluate(()=>window.__bp.measureBlueprint({maxBlocks:80,captureDepth:1500}).blocks.map(b=>({label:b.label,text:b.lettering?.text,kind:b.kind,group:b.group,source:!!b.source,measurement:b.measurement})));
  const count=(label)=>blocks.filter(b=>b.label===label);
  for(const label of ["BRAND MARK","CREST","AVATAR","NAME","ROLE","ACTIVITY","PROJECT ICON","PROJECT TITLE","PROJECT META","CERTIFICATION ICON","CERTIFICATION TITLE","BLOG ICON","BLOG TITLE"]){if(!count(label).length)throw Error(`Missing ${label} at ${viewport.width}`)}
  if(count("PROJECT TITLE").length!==2)throw Error("Duplicate/missing project titles");
  if(!count("PROJECT TITLE").some(x=>x.text==="Decompile"))throw Error("Missing actual Decompile data");
  if(!count("PROJECT ICON").every(x=>x.source))throw Error("Project icon sources missing");
  if(!count("PROJECT META").some(x=>x.text==="05.2026 — ∞"))throw Error("Date metadata missing");
  if(!count("PROJECT ICON").every(x=>x.measurement==="none"))throw Error("Unnecessary icon dimensions");
  // Row labels remain grouped; frame intentionally encloses child shapes,
  // but title, icon and metadata must occupy distinct positions.
  const regions=await page.evaluate(()=>window.__bp.measureBlueprint({maxBlocks:80,captureDepth:1500}).blocks
    .filter(b=>b.group==="row-1"&&b.kind!=="item")
    .map(b=>({kind:b.kind,rect:b.rect})));
  const intersects=(a,b)=>Math.min(a.x+a.width,b.x+b.width)>Math.max(a.x,b.x)+1 && Math.min(a.y+a.height,b.y+b.height)>Math.max(a.y,b.y)+1;
  for(let i=0;i<regions.length;i++)for(let j=i+1;j<regions.length;j++){
    if(intersects(regions[i].rect,regions[j].rect))throw Error(`Overlapping ${regions[i].kind} / ${regions[j].kind}`);
  }
  if(blocks.some(x=>x.label==="TITLE 01" && x.text==="Decompile"))throw Error("Duplicate generic heading detected");
  // Re-measure the actual DOM after a data-driven row update; no second text list.
  await page.locator('#project1 [data-blueprint-part=title]').evaluate(e=>e.textContent="Decompile Pro");
  const changed=await page.evaluate(()=>window.__bp.measureBlueprint({maxBlocks:80,captureDepth:1500}).blocks.find(x=>x.label==="PROJECT TITLE").lettering.text);
  if(changed!=="Decompile Pro")throw Error(`Stale project title ${changed}`);
  // Icon changes should be reflected from the same source node.
  await page.locator('#project1 [data-blueprint-part=icon]').evaluate(e=>e.innerHTML='<img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" width="26" height="26">');
  const icon=await page.evaluate(()=>window.__bp.measureBlueprint({maxBlocks:80,captureDepth:1500}).blocks.find(x=>x.label==="PROJECT ICON")?.source?.querySelector('img')?.tagName);
  if(icon!=="IMG")throw Error("Updated project icon not captured");
  console.log(`PASS ${viewport.width}x${viewport.height}: ${blocks.length} blocks; dynamic title/icon; grouped semantic cards`);
  await page.close();
 }
} finally{await browser.close();}
