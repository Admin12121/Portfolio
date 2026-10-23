/** Offline guard for V9's visible preloader ACTIVITY calendar. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const geom=read('components/blueprint/geometry.ts');
const plot=read('components/blueprint/blueprint-preloader.tsx');
const css=read('components/blueprint/blueprint.css');
const graph=read('features/profile/components/github-contributions/graph-placeholder.tsx');
assert.match(geom,/function makeNeutralActivityCells\(panel: PlotRect\)/);
assert.match(geom,/measuredCells\.length<100/);
assert.match(geom,/makeNeutralActivityCells\(rect\)/);
assert.match(geom,/const weeks=53, days=7, gap=3/);
assert.match(geom,/rect\[data-date\],\[data-blueprint-cell\]/);
assert.match(plot,/\.8\+Math\.min\(4,cell\.level\)\*\.05/);
assert.match(css,/\.bp-heatmap-cell\{[^}]+rgba\(255,255,255,\.(?:95|98)\)/);
// The original cell-layer animation ended with opacity:0 before the wipe.
const wrapperRules=[...css.matchAll(/\.bp-heatmap-cells\{([^}]+)\}/g)];
assert.equal(wrapperRules.length,1, 'There should be one activity-cell layer rule');
assert.doesNotMatch(wrapperRules[0][1],/bp-unblock/, 'Never fade calendar before the blueprint exits');
assert.match(css,/\.bp-heatmap-cell\{[^}]+animation:bp-cell-in/, 'Keep original entrance animation');
assert.match(graph,/Array\.from\(\{ length: 371 \}/);
console.log('PASS: V9 structural activity cells, late-stage visibility, and entrance animation');
