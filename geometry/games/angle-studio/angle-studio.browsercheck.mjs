import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import { domains, problemsFor, answerFor } from "./core.js";

const base = process.env.GFIELD_BASE_URL || "http://127.0.0.1:8765";
const out = new URL("./qa-artifacts/", import.meta.url).pathname.replace(/^\/(.:)/, "$1");
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: "block", reducedMotion: "reduce" });
const page = await context.newPage();
const errors = [];
page.on("pageerror", error => errors.push(error.message));
page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
let cases = 0;
async function layout() {
  const result = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > innerWidth,
    textOverflow: [...document.querySelectorAll("h1,h2,button,summary,.domain-tabs a")].filter(el => el.clientWidth && el.scrollWidth > el.clientWidth + 1).map(el => el.textContent),
    diagram: document.querySelector("#board svg")?.getBoundingClientRect().width || 0,
    badLabels: [...document.querySelectorAll("#board svg text")].filter(el => {
      const box = el.getBBox(), bounds = el.ownerSVGElement.viewBox.baseVal;
      return box.x < -1 || box.y < -1 || box.x + box.width > bounds.width + 1 || box.y + box.height > bounds.height + 1;
    }).map(el => el.textContent)
  }));
  assert.equal(result.overflow, false, JSON.stringify(result));
  assert.deepEqual(result.textOverflow, [], JSON.stringify(result));
  assert.deepEqual(result.badLabels, [], JSON.stringify(result));
  assert.ok(result.diagram > 250, JSON.stringify(result));
}
try {
  await page.goto(base + "/geometry/games/angle-studio/");
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const domain of domains) {
      for (let round = 0; round < 4; round++) {
        await page.evaluate(({ id, round }) => localStorage.setItem(`gfield-pool-angle-studio-${id}`, round), { id: domain.level, round });
        await page.goto(`${base}/geometry/games/angle-studio/?domain=${domain.id}&lang=ko`);
        await page.waitForSelector("#board svg");
        assert.equal(await page.locator("#domainTabs a").count(), domains.length);
        for (let index = 0; index < 5; index++) {
          const problem = problemsFor(domain.id)[round * 5 + index];
          assert.equal(await page.locator("#board").getAttribute("data-problem-id"), problem.id);
          assert.equal(await page.locator("#check").isDisabled(), true);
          assert.equal(await page.locator("#review").isVisible(), false);
          await layout();
          if (index === 0 && round === 0) await page.screenshot({ path: `${out}/${domain.id}-${width}-student.png`, fullPage: true });
          const answer = answerFor(problem);
          if (domain.id === "right-angle") {
            assert.equal(await page.locator("#board text").filter({ hasText: /^B$/ }).count(), 0);
            await page.locator(`[data-point="${problem.arm.join(",")}"]`).click();
            await page.locator("#check").click();
            assert.equal(await page.locator("#review").isVisible(), false);
            assert.equal(await page.locator("#feedback").getAttribute("data-kind"), "acute");
            await page.locator(`[data-point="${answer.at(-1).join(",")}"]`).click();
          } else {
            if (problem.kind === "triangles") {
              await page.locator("#answer").fill(String(answer));
              await page.locator("#check").click();
              assert.equal(await page.locator("#review").isVisible(), false);
              for (let vertex = 0; vertex < problem.sides; vertex++) {
                if ([problem.anchor, (problem.anchor + 1) % problem.sides, (problem.anchor + problem.sides - 1) % problem.sides].includes(vertex)) continue;
                await page.locator(`[data-vertex="${vertex}"]`).click();
              }
            }
            if (domain.id !== "estimate") {
              await page.locator("#answer").fill(String(answer + 1));
              await page.locator("#check").click();
              assert.equal(await page.locator("#review").isVisible(), false);
            } else {
              assert.equal((await page.locator("#board").textContent()).includes(`${answer}°`), false);
              await page.locator("#answer").fill("181");
              assert.equal(await page.locator("#check").isDisabled(), true);
            }
            await page.locator("#answer").fill(String(answer));
          }
          await page.locator("#check").click();
          assert.equal(await page.locator("#review").isVisible(), true);
          assert.equal(await page.locator("#next").isVisible(), true);
          await layout();
          if (index === 0 && round === 0) await page.screenshot({ path: `${out}/${domain.id}-${width}-answer.png`, fullPage: true });
          cases++;
          await page.locator("#next").click();
        }
        assert.equal(await page.locator("#completion").isVisible(), true);
        await page.locator("#close").click();
      }
    }
  }
  for (const width of [320, 768]) {
    await page.setViewportSize({ width, height: 900 });
    for (const lang of ["ko", "en", "zh", "ja"]) for (const domain of domains) {
      await page.goto(`${base}/geometry/games/angle-studio/?domain=${domain.id}&lang=${lang}`);
      await page.waitForSelector("#board svg");
      assert.equal(await page.locator("html").getAttribute("lang"), lang);
      await layout();
    }
  }
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(`${base}/geometry/games/angle-studio/?domain=right-angle`);
  const initial = page.locator(".dot-choice[tabindex='0']");
  await initial.focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  assert.equal(await page.locator('.dot-choice[aria-pressed="true"]').count(), 1);
  const before = await page.locator("#board").getAttribute("data-problem-id");
  await page.locator("#language").selectOption("en");
  assert.equal(await page.locator("#board").getAttribute("data-problem-id"), before);
  assert.equal(await page.locator('.dot-choice[aria-pressed="true"]').count(), 1);
  await page.locator("#retry").click();
  assert.equal(await page.locator('.dot-choice[aria-pressed="true"]').count(), 0);
  assert.equal(await page.locator("#check").isDisabled(), true);
  await page.goto(base + "/geometry/shape-garden/");
  await page.waitForSelector("#angleLevels .angle-card");
  assert.equal(await page.locator("#angleLevels .angle-card").count(), domains.length);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  const touchContext = await browser.newContext({ viewport: { width:390, height:844 }, hasTouch:true, isMobile:true, serviceWorkers:"block" });
  const touchPage = await touchContext.newPage();
  touchPage.on("pageerror", error => errors.push(error.message));
  await touchPage.goto(`${base}/geometry/games/angle-studio/?domain=right-angle&lang=ko`);
  const touchRight = problemsFor("right-angle")[0];
  await touchPage.locator(`[data-point="${answerFor(touchRight)[0].join(",")}"]`).tap();
  await touchPage.locator("#check").tap();
  assert.equal(await touchPage.locator("#review").isVisible(), true);
  await touchPage.goto(`${base}/geometry/games/angle-studio/?domain=polygon&lang=ko`);
  await touchPage.locator('[data-vertex="2"]').tap();
  await touchPage.locator("#answer").fill("2");
  await touchPage.locator("#check").tap();
  assert.equal(await touchPage.locator("#review").isVisible(), true);
  await touchPage.screenshot({ path:`${out}/polygon-touch-answer.png`, fullPage:true });
  await touchContext.close();
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ solvedFlows: cases, localeLayoutCases: domains.length * 4 * 2, touch:true, keyboard:true, reset:true, lobby:true, errors }));
} finally { await browser.close(); }
