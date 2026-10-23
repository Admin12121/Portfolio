/** Real-browser checks for SSR hydration, responsive state, and persisted data. */
import assert from "node:assert/strict";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";
import React from "react";
import { renderToString } from "react-dom/server";
import { chromium } from "playwright";

const fixturePath = path.resolve("node_modules/.cache/client-state-fixture.tsx");
const bundlePath = path.resolve("node_modules/.cache/client-state-fixture.js");
fs.mkdirSync(path.dirname(fixturePath), { recursive: true });
fs.writeFileSync(fixturePath, `
import React, { useState } from "react";
import { hydrateRoot } from "react-dom/client";
import { useIsClient } from "../../hooks/use-is-client";
import { useIsMobile } from "../../hooks/use-mobile";
import { useMediaQuery } from "../../hooks/use-media-query";
import { useLocalStorage } from "../../hooks/use-local-storage";
export function ClientStateFixture() {
  const [key, setKey] = useState("first");
  const [value, setValue] = useLocalStorage<{ count: number }>(key);
  const client = useIsClient();
  const mobile = useIsMobile();
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  return <main data-client={String(client)} data-mobile={String(mobile)}
    data-reduced={String(reduced)} data-value={JSON.stringify(value)}>
    <button id="save" onClick={() => setValue({ count: (value?.count ?? 0) + 1 })}>Save</button>
    <button id="clear" onClick={() => setValue(null)}>Clear</button>
    <button id="switch" onClick={() => setKey(key === "first" ? "second" : "first")}>Switch</button>
  </main>;
}
if (typeof document !== "undefined") {
  hydrateRoot(document.getElementById("root")!, <ClientStateFixture />);
}
`);

let browser;
let server;
try {
  const { ClientStateFixture } = await import(pathToFileURL(fixturePath).href);
  const markup = renderToString(React.createElement(ClientStateFixture));
  assert.match(markup, /data-client="false"/);
  assert.match(markup, /data-value="null"/);
  execFileSync("bun", ["build", fixturePath, "--target", "browser", "--format", "iife", "--outfile", bundlePath], { stdio: "pipe" });
  const bundle = fs.readFileSync(bundlePath, "utf8");
  server = createServer((request, response) => {
    const script = request.url === "/client.js";
    response.writeHead(200, { "Content-Type": script ? "text/javascript" : "text/html" });
    response.end(script ? bundle : `<!doctype html><div id="root">${markup}</div><script src="/client.js"></script>`);
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const baseURL = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ headless: true });
  const errors = [];
  const open = async (init) => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.setDefaultTimeout(10000);
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    await page.addInitScript(init);
    await page.goto(baseURL);
    await page.waitForFunction(() => document.querySelector("main")?.dataset.client === "true");
    return page;
  };
  const expectValue = (page, count) => page.waitForFunction(
    expected => document.querySelector("main")?.dataset.value === JSON.stringify(expected === null ? null : { count: expected }), count,
  );
  const page = await open(() => {
    if (!localStorage.getItem("first")) localStorage.setItem("first", JSON.stringify({ count: 3 }));
    localStorage.setItem("second", JSON.stringify({ count: 8 }));
  });
  await expectValue(page, 3);
  await page.click("#save");
  await expectValue(page, 4);
  await page.reload();
  await expectValue(page, 4);
  await page.click("#switch");
  await expectValue(page, 8);
  await page.click("#clear");
  await expectValue(page, null);
  assert.equal(await page.evaluate(() => localStorage.getItem("second")), null);
  await page.click("#switch");
  await expectValue(page, 4);
  await page.evaluate(() => {
    localStorage.setItem("first", JSON.stringify({ count: 9 }));
    window.dispatchEvent(new StorageEvent("storage", { key: "first" }));
  });
  await expectValue(page, 9);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForFunction(() => document.querySelector("main")?.dataset.mobile === "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForFunction(() => document.querySelector("main")?.dataset.reduced === "true");
  await page.close();

  const malformed = await open(() => localStorage.setItem("first", "invalid JSON"));
  await expectValue(malformed, null);
  await malformed.click("#save");
  await expectValue(malformed, 1);
  await malformed.close();

  const restricted = await open(() => {
    for (const method of ["getItem", "setItem", "removeItem"]) {
      Storage.prototype[method] = () => { throw new DOMException("Storage unavailable", "SecurityError"); };
    }
  });
  await restricted.click("#save");
  await expectValue(restricted, 1);
  await restricted.click("#clear");
  await expectValue(restricted, null);
  await restricted.close();
  assert.deepEqual(errors, [], "Hydration and storage must not produce browser errors");
  console.log("PASS: hydration, mobile/reduced-motion changes, persistence, key changes, storage events, malformed and restricted storage");
} finally {
  await browser?.close();
  server?.closeAllConnections();
  server?.close();
  for (const file of [fixturePath, bundlePath]) {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }
}
