/* 색종이 학습지 · 정답지 그림 글자 크기 브라우저 검사(모든 유형).

   실행: 저장소 뿌리에서 정적 서버를 띄운 뒤
     GFIELD_BASE_URL=http://127.0.0.1:8811 PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs \
       node geometry/worksheet/paper-fold/fold-answers.browsercheck.mjs

   정답지는 한 쪽에 두 칸씩 반 크기로 찍힌다(그림 1px ≈ 0.17pt). 문제 그림을 그대로 줄이면
   그림 속 글자가 3~4pt였다. 정답지 그림은 이제 유형마다 fold-5.js가 따로 그린다.

   확인하는 것(유형 20개 × 난이도 3개, 게임 연계는 문항 전부)
   - 정답지 그림은 모두 fold-5.js의 renderAnswerPicture가 그린다(문제 그림을 그대로 쓰지 않는다).
   - 정답지 그림 속 글자는 모두 36px 이상이다. A4에 실제로 찍히는 크기로 바꾸면 6pt 이상이다.
   - 글자는 그림 안에 있고, 서로 겹치지 않는다.
   - 빈 그림이 아니다. 정답지·문제지 페이지가 오류 없이 만들어진다. */

import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

const base = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8768").replace(/\/$/, "");
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : "playwright");
const MIN_PX = 36;
const MIN_PT = 6;
const generated = ["hole2", "hole3d", "numsum", "numcut", "foldtop", "numdiag", "pieces", "punch", "numinv", "unfoldshape", "stackfind", "stackorder"];
const shared = ["game-l1", "game-l2", "game-l3", "turn-l1", "turn-l2", "turn-l3", "turn-l4", "turn-l5"];

const browser = await chromium.launch({ headless: true });
const summary = { renders: 0, texts: 0, smallestPx: Infinity, kinds: new Set() };
let smallestPt = Infinity;
try {
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  /* fillText를 가로채 글자 크기와 자리를 적는다(기록 중일 때만). */
  await page.addInitScript(() => {
    const original = CanvasRenderingContext2D.prototype.fillText;
    window.__texts = null;
    CanvasRenderingContext2D.prototype.fillText = function (text, x, y, ...rest) {
      if (window.__texts) {
        const px = Number(/(\d+(?:\.\d+)?)px/.exec(this.font)?.[1] || 0);
        const m = this.measureText(text);
        const t = this.getTransform();
        const corners = [[x - m.actualBoundingBoxLeft, y - m.actualBoundingBoxAscent], [x + m.actualBoundingBoxRight, y + m.actualBoundingBoxDescent]]
          .map(([cx, cy]) => [t.a * cx + t.c * cy + t.e, t.b * cx + t.d * cy + t.f]);
        window.__texts.push({ text: String(text), px: px * Math.hypot(t.a, t.b), left: Math.min(corners[0][0], corners[1][0]), right: Math.max(corners[0][0], corners[1][0]), top: Math.min(corners[0][1], corners[1][1]), bottom: Math.max(corners[0][1], corners[1][1]) });
      }
      return original.call(this, text, x, y, ...rest);
    };
  });
  await page.goto(`${base}/geometry/worksheet/paper-fold/?modes=hole2&count=10`, { waitUntil: "load" });
  await page.waitForFunction(() => document.querySelectorAll(".answer-page .problem-card img").length >= 10 && typeof renderAnswerPicture === "function", null, { timeout: 20000 });

  /* A4에 찍히는 정답지 그림의 1px 크기(pt). */
  await page.emulateMedia({ media: "print" });
  const ptPerPixel = await page.evaluate(() => {
    const image = document.querySelector(".answer-page .problem-card img");
    const box = image.getBoundingClientRect();
    return Math.min(box.width, box.height * image.naturalWidth / image.naturalHeight) * 0.75 / image.naturalWidth;
  });
  await page.emulateMedia({ media: "screen" });

  const plans = [
    ...generated.flatMap((mode) => ["easy", "mid", "hard"].map((difficulty) => ({ mode, difficulty, count: 8 }))),
    ...shared.map((mode) => ({ mode, difficulty: "mid", count: mode.startsWith("game-l") ? 52 : 10 }))
  ];
  for (const plan of plans) {
    const renders = await page.evaluate(({ mode, difficulty, count }) => {
      const canvas = document.getElementById("cv");
      const ctx = canvas.getContext("2d");
      const out = [];
      for (let index = 0; index < count; index += 1) {
        questionNumber = index;
        const problem = buildProblem(mode, difficulty);
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        window.__texts = [];
        const drawn = renderAnswerPicture(ctx, problem);
        const texts = window.__texts;
        window.__texts = null;
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let ink = 0;
        for (let i = 0; i < data.length; i += 4 * 9) if (data[i] < 235 || data[i + 1] < 235 || data[i + 2] < 235) ink += 1;
        out.push({ kind: problem.kind, id: problem.source?.id || `${mode}-${index}`, drawn, texts, ink });
      }
      return out;
    }, plan);
    for (const render of renders) {
      const where = `${plan.mode}/${plan.difficulty} ${render.id}`;
      assert.equal(render.drawn, true, `${where}: the answer picture is not drawn by renderAnswerPicture (${render.kind})`);
      assert.ok(render.ink > 2000, `${where}: the answer picture is blank (${render.ink})`);
      assert.ok(render.texts.length > 0, `${where}: the answer picture has no text`);
      render.texts.forEach((text, index) => {
        assert.ok(text.px >= MIN_PX, `${where}: "${text.text}" is ${text.px}px (min ${MIN_PX}px, ${(text.px * ptPerPixel).toFixed(1)}pt on A4)`);
        assert.ok(text.left >= 0 && text.right <= 1300 && text.top >= 0 && text.bottom <= 520, `${where}: "${text.text}" leaves the picture (${Math.round(text.left)},${Math.round(text.top)}-${Math.round(text.right)},${Math.round(text.bottom)})`);
        render.texts.slice(index + 1).forEach((other) => {
          const overlap = Math.min(text.right, other.right) - Math.max(text.left, other.left) > 2 && Math.min(text.bottom, other.bottom) - Math.max(text.top, other.top) > 2;
          assert.ok(!overlap, `${where}: "${text.text}" overlaps "${other.text}"`);
        });
        summary.smallestPx = Math.min(summary.smallestPx, text.px);
      });
      summary.renders += 1;
      summary.texts += render.texts.length;
      summary.kinds.add(render.kind);
    }
  }
  smallestPt = summary.smallestPx * ptPerPixel;
  assert.ok(smallestPt >= MIN_PT, `smallest answer picture text is ${smallestPt.toFixed(2)}pt on A4 (min ${MIN_PT})`);

  /* 실제 학습지: 모든 유형을 섞은 50문항, 정답지 그림이 문제 그림과 다르다. */
  await page.goto(`${base}/geometry/worksheet/paper-fold/?modes=${[...generated, ...shared].join(",")}&count=50`, { waitUntil: "load" });
  await page.waitForFunction(() => document.querySelectorAll(".answer-page .problem-card img").length >= 50, null, { timeout: 30000 });
  const same = await page.evaluate(() => {
    const questions = [...document.querySelectorAll(".sheet-page:not(.answer-page) .problem-card img")].map((image) => image.src);
    const answers = [...document.querySelectorAll(".answer-page .problem-card img")].map((image) => image.src);
    return answers.filter((src, index) => src === questions[index]).length;
  });
  assert.equal(same, 0, `${same} answer cards still reuse the question picture`);
  assert.deepEqual(errors, [], "page errors");
  await page.close();
} finally {
  await browser.close();
}
console.log(`Paper fold worksheet answer pictures check passed: ${summary.renders} answer pictures over ${summary.kinds.size} kinds (${[...summary.kinds].join(", ")}), ${summary.texts} texts, all drawn by renderAnswerPicture, inside the picture and apart; smallest ${summary.smallestPx}px = ${smallestPt.toFixed(1)}pt on A4 (min ${MIN_PT}pt); a 50-problem mixed sheet builds without errors and no answer card reuses its question picture.`);
