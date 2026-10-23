// golden-bell-wood.js의 나무 결을 assets/game-wood.webp로 굽는다(HTML 게임 판 배경).
// 실행: FIELDS_PLAYWRIGHT=<playwright-core 경로> node fields-classic/question-bank/tools/golden-bell-bake-wood.mjs
// 저장소 루트를 http로 띄운 주소를 BASE로 준다(기본 http://127.0.0.1:8820).
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const { chromium } = await import(process.env.FIELDS_PLAYWRIGHT || "playwright-core");
const base = process.env.BASE || "http://127.0.0.1:8820";
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage();
await page.goto(`${base}/fields-classic/question-bank/game.html#none`);
const data = await page.evaluate(async () => {
  const { woodCanvas } = await import("./golden-bell-wood.js");
  return woodCanvas(1024).toDataURL("image/webp", 0.86);
});
await browser.close();
const out = fileURLToPath(new URL("../assets/game-wood.webp", import.meta.url));
writeFileSync(out, Buffer.from(data.split(",")[1], "base64"));
console.log("wrote", out);
