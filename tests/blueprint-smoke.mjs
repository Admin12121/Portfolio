/** Integration acceptance. Requires a running dev server and Playwright. */
let chromium;
try { ({ chromium } = await import("playwright")); }
catch { console.error("Install Playwright: bun add -d playwright && bunx playwright install chromium"); process.exit(1); }
const baseURL=process.env.TEST_URL || "http://localhost:3000";
const browser=await chromium.launch({headless:true});
try {
 for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
  const page=await browser.newPage({viewport});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  await page.goto(baseURL,{waitUntil:"domcontentloaded"});
  await page.waitForSelector(".bp-piece[data-plot-piece]",{timeout:8000});
  const check=await page.evaluate(()=>{
   const pieces=Array.from(document.querySelectorAll(".bp-piece"));
   const labels=pieces.map(e=>e.querySelector(".bp-piece-label")?.textContent||"");
   const rect=(label)=>pieces.find(el=>el.querySelector(".bp-piece-label")?.textContent===label)?.getBoundingClientRect();
   const frame=rect("HERO FRAME"),emblem=rect("CREST");
   return {labels,coverWidth:frame?.width||0,emblemWidth:emblem?.width||0,headerDatum:!!document.querySelector(".bp-header-datum"),graphicCount:document.querySelectorAll(".bp-graphic-real").length};
  });
  for(const label of ["BRAND MARK","HERO FRAME","CREST","AVATAR","NAME","ROLE","ACTIVITY"]){
   if(!check.labels.includes(label))throw new Error(`Missing measured ${label} at ${viewport.width}px: ${check.labels.join(", ")}`);
  }
  // The activity grid must exist in the blue preloader even when GitHub's
  // network/Suspense rendering has not completed at capture time.
  const blueprintActivityCells=await page.evaluate(()=>{
    const panel=[...document.querySelectorAll('.bp-piece-data')].find(el=>
      el.querySelector('.bp-piece-label')?.textContent==='ACTIVITY');
    return {count:panel?.querySelectorAll('.bp-heatmap-cell').length??0,
      area:panel?.getBoundingClientRect().width??0};
  });
  if(blueprintActivityCells.count<100)
    throw new Error(`Blueprint ACTIVITY is missing calendar cells: ${JSON.stringify(blueprintActivityCells)}`);
  if(check.coverWidth<=check.emblemWidth)throw new Error("Cover and emblem incorrectly share the same box");
  if(!check.headerDatum || check.graphicCount<3)throw new Error("Missing drafting header guide or measured icons");
  await page.waitForFunction(() => {
    const role = [...document.querySelectorAll('.bp-piece')].find(el =>
      el.querySelector('.bp-piece-label')?.textContent === 'ROLE');
    return !!role?.querySelector('.bp-text-snapshot');
  }, {timeout:2500});
  const textCheck=await page.evaluate(()=>{
    const blocks=[...document.querySelectorAll('.bp-piece')];
    const named=(name)=>blocks.find(el=>el.querySelector('.bp-piece-label')?.textContent===name);
    const name=named('NAME')?.querySelector('.bp-text-snapshot');
    const role=named('ROLE')?.querySelector('.bp-text-snapshot');
    const copy=blocks.filter(el=>el.querySelector('.bp-piece-label')?.textContent?.startsWith('COPY'));
    return {name:name?.textContent||'',verified:!!name?.querySelector('svg'),
      role:role?.textContent?.trim()||'',roleParagraphs:role?.querySelectorAll('p').length||0,
      repeatedRole:copy.some(el=>el.querySelector('.bp-text-snapshot')?.textContent?.trim()===role?.textContent?.trim()),
      clip:getComputedStyle(role?.closest('.bp-piece-lettering')||document.body).overflow,
      roleBorder:role?getComputedStyle(role).borderTopWidth:null};
  });
  if(!textCheck.name.includes('Admin12121'))throw new Error('Profile name missing from blueprint lettering');
  if(textCheck.roleParagraphs!==1 || textCheck.repeatedRole)throw new Error('Animated role copied twice');
  if(textCheck.clip==='hidden')throw new Error('Blueprint lettering is clipped by its glyph-tight rectangle');
  if(textCheck.roleBorder!=='0px')throw new Error('Role snapshot copied the real structural border');

  if(process.env.TEST_CAPTURE==="1"){
   await page.screenshot({path:`blueprint-${viewport.width}.png`});
  }
  await page.waitForSelector("[data-blueprint-overlay]",{state:"detached",timeout:16000});
  if(await page.locator("[data-blueprint-root]").count()!==1)throw new Error("Missing content root");
  if(await page.locator(".blueprint-pointer-canvas").count()!==1)throw new Error("Pointer overlay missing");
  const drafting=await page.evaluate(()=>{
    const edge=document.querySelector('[data-draft-edges]');
    const edgeStyle=edge?getComputedStyle(edge,'::after'):null;
    return {
      filters:!!document.querySelector('#draft-graphite-fine')&&!!document.querySelector('#draft-graphite-strong'),
      panelInk:getComputedStyle(document.querySelector('[data-slot="panel"]'),'::before').filter,
      rails:document.querySelectorAll('[data-draft-edges]').length,
      edgeInk:edgeStyle?.filter??'',
      hasEdge:edgeStyle&&['borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth'].some(side=>parseFloat(edgeStyle[side])>0),
    };
  });
  if(!drafting.filters || !drafting.panelInk.includes('draft-graphite') || !drafting.rails || !drafting.edgeInk.includes('draft-graphite') || !drafting.hasEdge)
    throw new Error(`Shared drafting treatment is not active: ${JSON.stringify(drafting)}`);

  if(await page.evaluate(()=>document.documentElement.style.overflow)==="hidden")throw new Error("Preloader left scroll locked");
  if(errors.length)throw new Error(errors.join("\n"));
  console.log(`PASS ${viewport.width}×${viewport.height}: ${check.labels.length} real measured blocks`);
  await page.close();
 }
} finally {await browser.close();}
