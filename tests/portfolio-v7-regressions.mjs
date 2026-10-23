/** Dependency-free source regression check for the blog/blueprint layout.
 * Run: node tests/portfolio-v7-regressions.mjs
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const blog = read("app/(app)/blog/page.tsx");
const fallback = read("features/profile/components/github-contributions/graph-placeholder.tsx");
const geom = read("components/blueprint/geometry.ts");
const graph = read("features/profile/components/github-contributions/graph.tsx");
const preloader = read("components/blueprint/blueprint-preloader.tsx");
assert.match(blog, /data-blog-page/, "Blog must use the route-scoped viewport-fill layout");
assert.doesNotMatch(blog, /min-h-\[calc\(100dvh-192px\)\]/, "Blog must not hard-code header/footer height");
assert.match(blog, /<TerminalSymbolHoverGrid/, "Blog hover effect must survive restoration");
assert.match(fallback, /Array\.from\(\{ length: 371 \}/, "Restore the 371 DOM cells");
assert.match(fallback, /data-blueprint-cell/, "Activity cells must be discoverable by the preloader");
assert.doesNotMatch(fallback, /aria-hidden="true"\s+className="grid grid-flow-col/, "Cell ancestors must not be aria-hidden to geometry visibility checks");
assert.match(geom, /rect\[data-date\],\[data-blueprint-cell\]/, "Geometry must support SVG/data fallback cells");
assert.match(graph, /<GitHubContributionPlaceholder state="loading"/, "Graph should render the grid while loading");
assert.match(graph, /<GitHubContributionPlaceholder state="unavailable"/, "Graph should render the grid if unavailable");
assert.match(preloader, /measureBlueprint\(/, "Preloader must measure the real rendered page");
console.log("PASS: blog viewport fill, hover, neutral activity cells, blueprint discovery, loading states");
