import { chromium } from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import sharp from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.mjs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const baseUrl = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8765").replace(/\/$/, "");
const outputDir = resolve(dirname(fileURLToPath(import.meta.url)), "assets");
const target = process.argv[2] || "all";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });

await page.addInitScript(() => {
  localStorage.setItem("gfield-net-observatory-tutorial-v1", "done");
  localStorage.setItem("gfield-soma-tutorial-v1", "done");
  localStorage.setItem("gfield-soma-controls-tutorial-v1", "done");
  localStorage.setItem("gfield-sound-muted", "1");
  localStorage.setItem("gfield-profile", JSON.stringify({ language: "ko" }));
});

async function capture(url, selector, destination, fit = "cover") {
  await page.goto(`${baseUrl}${url}`, { waitUntil: "networkidle" });
  await page.locator(selector).waitFor({ state: "visible" });
  await page.waitForTimeout(420);
  const source = await page.locator(selector).screenshot();
  await sharp(source).resize(800, 500, { fit, position: "centre", background: "#f7faf8" }).webp({ quality: 88 }).toFile(resolve(outputDir, destination));
}

for (let level = 1; level <= 5; level += 1) {
  if (target === "all" || target === "net") {
    const selector = level === 2 ? ".choices" : ".stage-panel";
    await capture(`/geometry/games/net-observatory/?level=${level}`, selector, `net-level-${level}.webp`, level === 2 ? "contain" : "cover");
  }
  if (target === "all" || target === "soma") await capture(`/geometry/games/soma-cube/?level=${level}`, ".comparison", `soma-level-${level}.webp`);
}

await browser.close();
console.log(`Refreshed ${target} level previews in ${outputDir}`);
