import { chromium } from "@playwright/test";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";

// Regenerate the public, authorial handout from its printable source page.
// Use only a local app server; never include an authenticated browser session.
const origin = new URL(process.env.INJESSUS_HANDOUT_ORIGIN || "http://127.0.0.1:3000");
if (!['127.0.0.1', 'localhost', '[::1]'].includes(origin.hostname) || origin.username || origin.password) {
  throw new Error("Use an unauthenticated loopback app server to generate the handout.");
}
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined);
const output = new URL("../public/resumos/", import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath });
try {
  const page = await browser.newPage({ serviceWorkers: "block" });
  const response = await page.goto(new URL("/aprender/primeiros-passos/resumo", origin).href);
  if (!response?.ok()) throw new Error("Printable lesson page failed to load.");
  await page.emulateMedia({ media: "print" });
  await page.locator(".print-summary footer").waitFor();
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: new URL("primeiros-passos-v1.pdf", output).pathname, format: "A4", preferCSSPageSize: true, printBackground: true });
  console.log("Handout generated: public/resumos/primeiros-passos-v1.pdf. Verify A4 page count before release.");
} finally { await browser.close(); }
