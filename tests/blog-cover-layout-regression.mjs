import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

const cover = read("components/terminal-symbol-hover-grid.tsx");
const page = read("app/(app)/blog/page.tsx");
const styles = read("style/extr.css");

assert.ok(existsSync(new URL("../public/skleton.webp", import.meta.url)), "missing blog foreground artwork");
assert.ok(cover.includes('src="/skleton.webp"'), "foreground image not rendered");
assert.ok(cover.includes('pointer-events-none z-[1]'), "foreground must not capture hover events");
assert.ok(cover.includes('z-index:2'), "symbol grid must render above foreground image");
assert.ok(cover.includes("object-cover object-center"), "matching foreground/base scaling must be retained");
assert.ok(page.includes('data-blog-page=""'), "blog page must opt into viewport fill");
assert.ok(page.includes('className="blog-page-panel"'), "blog panel must use responsive viewport fill");
assert.ok(!page.includes("min-h-[calc(100dvh-192px)]"), "fragile viewport offset must not return");
assert.ok(styles.includes("body:has(main[data-blog-page])"), "viewport fill must be blog-scoped");
assert.ok(styles.includes(".blog-page-frame"), "blog frame must stretch with main");
assert.ok(styles.includes(".blog-page-panel"), "blog panel must stretch with frame");

console.log("Blog foreground/hover/height regression checks passed.");
