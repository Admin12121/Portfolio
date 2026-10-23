/** Requires a running app; run with TEST_URL set to the production preview. */
import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseURL = process.env.TEST_URL || "http://localhost:3000";
const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(baseURL, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("[data-blueprint-overlay]", { state: "detached", timeout: 20000 });
    const complexity = await page.evaluate(() => ({
      nodes: document.querySelectorAll("*").length,
      coverPaths: document.querySelectorAll("[data-blueprint-cover] path").length,
    }));
    assert.ok(complexity.nodes < 3000, `The initial page must avoid excessive DOM: ${complexity.nodes} nodes`);
    assert.ok(complexity.coverPaths < 100, "Decorative SVG artwork must not create thousands of DOM nodes");
    const projects = page.locator("#projects");
    const showMore = projects.getByRole("button", { name: "Show More" });
    await showMore.click();
    const rows = projects.locator('[data-blueprint-item="PROJECT"]');
    const lastRow = rows.last();
    const lastTrigger = lastRow.getByRole("button", { name: /Expand or collapse/ });
    await lastTrigger.click();
    assert.equal(await lastTrigger.getAttribute("aria-expanded"), "true");
    await projects.getByRole("button", { name: "Show Less" }).click();
    await showMore.click();
    assert.equal(await lastTrigger.getAttribute("aria-expanded"), "true", "Show Less/More must preserve each project's expanded state");

    const row = rows.nth(1);
    const trigger = row.getByRole("button", { name: /Expand or collapse/ });
    await trigger.click();
    const description = row.locator('[data-blueprint-part="description"]');
    await description.getByRole("table").waitFor({ state: "visible" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    assert.equal(await trigger.getAttribute("aria-expanded"), "false");
    await page.keyboard.press("Space");
    assert.equal(await trigger.getAttribute("aria-expanded"), "true");
    await trigger.click();
    await trigger.click();
    assert.equal(await trigger.getAttribute("aria-expanded"), "true", "Rapid toggles must end in the requested state");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await trigger.click();
    await page.waitForFunction(() => !document.querySelectorAll('#projects [data-blueprint-item="PROJECT"]')[1].getAnimations({ subtree: true }).some(animation => animation.playState === "running"));
    assert.equal(await trigger.getAttribute("aria-expanded"), "false");
    const hiddenContent = row.locator('[aria-hidden="true"][inert]').first();
    assert.ok(await hiddenContent.count(), "Collapsed links must be excluded from interaction and accessibility");
    const link = row.getByRole("link", { name: /Open .* in a new tab/ });
    assert.ok((await link.getAttribute("href"))?.startsWith("https://github.com/"));
    await page.context().route("https://github.com/**", route => route.abort());
    const popupPromise = page.waitForEvent("popup");
    await link.click();
    const popup = await popupPromise;
    await popup.close();
    assert.equal(await trigger.getAttribute("aria-expanded"), "false", "External links must not toggle project details");
    assert.deepEqual(errors, [], "Project interactions must not produce browser errors");
    console.log(`PASS ${viewport.width}x${viewport.height}: project state, rich text, keyboard, rapid toggles, reduced motion, and separate links`);
    await page.close();
  }

  const serverPage = await browser.newPage({ javaScriptEnabled: false });
  await serverPage.goto(baseURL, { waitUntil: "domcontentloaded" });
  const initialDescription = serverPage.locator('#projects [data-blueprint-part="description"]').first();
  assert.match(await initialDescription.textContent(), /Co-founded Rooms24/, "Expanded descriptions must arrive with the server-rendered page");
  await serverPage.close();
  console.log("PASS: default expanded project description is server-rendered");
} finally {
  await browser.close();
}
