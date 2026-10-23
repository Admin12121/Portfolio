/** Dependency-free regression checks for the 2026-10-23 Vercel build failures. */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (relative) => readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8');

for (const path of ['app/(llms)/projects.md/route.ts', 'app/(llms)/llms-full.txt/route.ts']) {
  const source = read(path);
  assert.ok(source.includes('PROJECTS.tools'), `${path}: missing live projects array`);
  assert.ok(!source.includes('PROJECTS.external'), `${path}: removed collection must not be referenced`);
}

const registry = read('lib/registry.ts');
const display = read('components/block-display.tsx');
const viewer = read('components/block-viewer.tsx');
assert.match(registry, /z\.infer<typeof registryItemFileSchema>/, 'files must use validated shadcn types');
assert.doesNotMatch(display, /files\.map\(async \(file: any\)/, 'avoid untyped registry files');
assert.doesNotMatch(viewer, /ImperativePanelHandle|registry:doc/, 'removed library API/types must not survive');

const resizable = read('components/ui/resizable.tsx');
assert.match(resizable, /import \{ Group, Panel, Separator \} from "react-resizable-panels"/, 'use v4 panel API');
assert.doesNotMatch(resizable, /ResizablePrimitive\.(PanelGroup|PanelResizeHandle)/, 'v3 components must not remain');

const page = read('app/(app)/blog/page.tsx');
const hover = read('components/terminal-symbol-hover-grid.tsx');
assert.doesNotMatch(page, /className="dark"/, 'blog hover must inherit actual site theme');
assert.match(hover, /:where\(\.dark\) \[data-cs-hover-grid\]/, 'preserve dark-theme hover styles');
assert.match(hover, /--hover-grid-cell-bg: rgba\(250, 250, 252, 0\.95\)/, 'add readable light hover tiles');
assert.match(hover, /src="\/skleton\.webp"/, 'do not lose transparent foreground');
assert.match(hover, /pointer-events-none/, 'foreground must remain non-interactive');
console.log('PASS: projects, shadcn typing, resizable v4, theme-aware blog tiles');
