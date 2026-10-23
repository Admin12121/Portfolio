import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const surface=read('components/blueprint/drafting-surface.css');
const filter=read('components/blueprint/drafting-filters.tsx');
const graph=read('components/blueprint/blueprint-preloader.tsx');
const pointer=read('components/blueprint/drafting-strokes.ts');
assert.match(filter,/id="draft-graphite-fine"/);
assert.match(surface,/\[data-draft-edges\]::after/);
assert.match(surface,/filter:url\(#draft-graphite-fine\)/);
assert.match(surface,/\[data-draft-divided\]/);
assert.match(graph,/const paths:string\[\]=\[\]/);
assert.doesNotMatch(graph,/const jitter=\(\)=>/);
assert.match(pointer,/const xx=x1\+unitX\*at/);
assert.doesNotMatch(pointer,/unitY\*jitter/);
for (const [file, tokens] of Object.entries({
  'components/footer.tsx':['data-draft-divided','data-draft-edges="top left right"'],
  'components/siteheader/index.tsx':['data-draft-divided','data-draft-edges="right"'],
  'components/collapsible-list.tsx':['data-draft-edges="bottom"'],
  'app/(app)/blog/(root)/[...slug]/page.tsx':['data-draft-edges="left right"'],
  'app/(app)/writeups/(root)/[...slug]/page.tsx':['data-draft-edges="left right"'],
  'app/(app)/blog/page.tsx':['data-draft-edges="top bottom"'],
  'features/profile/components/projects/project-item.tsx':['data-draft-edges="right"'],
})){
  const src=read(file);
  for(const token of tokens) assert.ok(src.includes(token),`${file} missing ${token}`);
}
console.log('PASS: shared original fine graphite source, route edges, pointer/preloader geometry');
