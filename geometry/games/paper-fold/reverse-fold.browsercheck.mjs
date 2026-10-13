/* 레벨 3 · 접는 방법 거꾸로 찾기 브라우저 검사.

   확인하는 것: 종이 위의 접는 선을 직접 눌러 푸는 동작, 복수 정답을 모두 골라야
   통과하는 계약, 답을 고르기 전 정답이 드러나지 않는 것, 숫자 층 배지가 없는 것,
   결과 그림에 화살표가 없고 처음 그림의 화살표가 종이 안에 있는 것,
   네 언어 전환, 데스크톱·390px 세로·모바일 가로의 가로 넘침, 페이지 오류. */

import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { levels } from "./levels.js";
import { seededRandom, sessionQueue } from "./session-order.js";

const base = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8768").replace(/\/$/, "");
const output = process.env.GFIELD_SCREENSHOT_DIR || join(tmpdir(), "gfield-paper-fold-reverse");
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : "playwright");
await mkdir(output, { recursive: true });

const level = levels[2];
const linePool = level.problems.filter((item) => item.interaction === "fold-line-pick");
const resultPool = level.problems.filter((item) => item.interaction === "fold-result-multi");
const viewports = [
  ["desktop", { width: 1280, height: 800 }],
  ["portrait", { width: 390, height: 844 }],
  ["landscape", { width: 844, height: 390 }]
];

const browser = await chromium.launch({ headless: true });
const errors = [];
const monitor = (page, name) => {
  page.on("pageerror", (error) => errors.push(`${name}: ${error.message}`));
  page.on("console", (message) => { if (message.type() === "error") errors.push(`${name} console: ${message.text()}`); });
};

async function openProblem(problem, viewport, language = "ko", name = problem.id) {
  const page = await browser.newPage({ viewport });
  monitor(page, name);
  const rest = sessionQueue(level.problems, 9, new Set([problem.id]), seededRandom("reverse-qa"));
  await page.addInitScript(({ queue, locale }) => {
    localStorage.setItem("gfield-language", locale);
    localStorage.setItem("gfield-paper-fold-progress-v4", JSON.stringify({ level: 3, index: 0, queue }));
  }, { queue: [problem.id, ...rest.map((item) => item.id)], locale: language });
  await page.goto(`${base}/geometry/games/paper-fold/?seed=reverse-qa`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("#paper").getAttribute("data-problem-id"), problem.id);
  await page.evaluate(() => document.fonts.ready);
  return page;
}

/* D3 터치 판정 검사용 점. 그림 단위 좌표를 화면 좌표로 바꿔 돌려준다.
   - crossing: 두 후보 선이 종이 안에서 만나는 점(있으면)
   - empty: 종이 안에서 모든 선과 40px 넘게 떨어진 점
   - offset: 정답 선에서 수직으로 14px 떨어졌고 다른 선과는 32px 넘게 떨어진 점 */
async function creaseProbePoints(page, problem) {
  return page.locator(".fold-start .reverse-diagram").evaluate((svg, choices) => {
    const matrix = svg.getScreenCTM();
    const scale = 160 * Math.hypot(matrix.a, matrix.b);
    const paper = svg.querySelector(".paper-fill");
    const toScreen = (u) => new DOMPoint(20 + u.x * 160, 20 + u.y * 160).matrixTransform(matrix);
    const onPaper = (u) => paper.isPointInFill(new DOMPoint(20 + u.x * 160, 20 + u.y * 160));
    const dist = (p, a, b) => {
      const dx = b.x - a.x; const dy = b.y - a.y;
      const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy)));
      return Math.hypot(p.x - a.x - dx * t, p.y - a.y - dy * t) * scale;
    };
    let crossing = null;
    for (let i = 0; i < choices.length && !crossing; i += 1) {
      for (let j = i + 1; j < choices.length && !crossing; j += 1) {
        const [a, b] = choices[i].chord; const [c, d] = choices[j].chord;
        const den = (b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x);
        if (Math.abs(den) < 1e-9) continue;
        const t = ((c.x - a.x) * (d.y - c.y) - (c.y - a.y) * (d.x - c.x)) / den;
        const u = ((c.x - a.x) * (b.y - a.y) - (c.y - a.y) * (b.x - a.x)) / den;
        if (t < 0.05 || t > 0.95 || u < 0.05 || u > 0.95) continue;
        const point = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
        if (onPaper(point)) crossing = toScreen(point);
      }
    }
    let empty = null;
    for (let row = 1; row < 40 && !empty; row += 1) for (let col = 1; col < 40 && !empty; col += 1) {
      const point = { x: col / 40, y: row / 40 };
      if (onPaper(point) && choices.every((choice) => dist(point, choice.chord[0], choice.chord[1]) > 40)) empty = toScreen(point);
    }
    const answer = choices.find((choice) => choice.correct);
    const [a, b] = answer.chord;
    const length = Math.hypot(b.x - a.x, b.y - a.y);
    const normal = { x: -(b.y - a.y) / length, y: (b.x - a.x) / length };
    let offset = null;
    for (const ratio of [0.5, 0.4, 0.6, 0.3, 0.7, 0.25, 0.75, 0.2, 0.8]) for (const side of [1, -1]) {
      if (offset) break;
      const along = { x: a.x + (b.x - a.x) * ratio, y: a.y + (b.y - a.y) * ratio };
      const point = { x: along.x + normal.x * side * (14 / scale), y: along.y + normal.y * side * (14 / scale) };
      if (!onPaper(point)) continue;
      if (choices.filter((choice) => !choice.correct).every((choice) => dist(point, choice.chord[0], choice.chord[1]) > 32)) offset = toScreen(point);
    }
    return { crossing: crossing && { x: crossing.x, y: crossing.y }, empty: empty && { x: empty.x, y: empty.y }, offset: offset && { x: offset.x, y: offset.y } };
  }, problem.lineChoices.map((choice) => ({ chord: choice.chord, correct: choice.correct })));
}

/* 후보 선의 터치 면 안이면서 다른 후보의 면과 겹치지 않고 종이 위인 점을 찾아
   실제 마우스로 누른다. 보이지 않는 버튼이 아니라 종이 위의 선을 누르는지 본다. */
async function touchLine(page, key) {
  /* 오답 흔들림 애니메이션이 끝난 뒤에 좌표를 잰다. 움직이는 동안 재면 클릭이
     옆 후보로 빗나간다. */
  await page.waitForFunction(() => !document.querySelector("#paper .wrong, #paper .touch-wrong"), null, { timeout: 4000 });
  await page.waitForTimeout(90);
  const spot = await page.locator(`[data-line="${key}"]`).evaluate((node) => {
    const svg = node.ownerSVGElement;
    const paper = svg.querySelector(".paper-fill");
    const others = [...svg.querySelectorAll("[data-line]")].filter((item) => item !== node);
    const box = node.getBBox();
    const matrix = svg.getScreenCTM();
    const found = [];
    for (let row = 1; row < 32; row += 1) {
      for (let column = 1; column < 32; column += 1) {
        const candidate = new DOMPoint(box.x + (box.width * column) / 32, box.y + (box.height * row) / 32);
        if (!node.isPointInFill(candidate) || !paper.isPointInFill(candidate)) continue;
        if (others.some((item) => item.isPointInFill(candidate))) continue;
        const screen = candidate.matrixTransform(matrix);
        /* 종이 그림이 실제로 클릭을 받는 점만 쓴다. 다른 요소가 덮은 점은 버린다.
           (D3 뒤로 띠는 pointer-events:none이고 종이 그림 전체가 터치를 받는다.) */
        const hit = document.elementFromPoint(screen.x, screen.y);
        if (!hit || !svg.contains(hit)) continue;
        found.push({ score: Math.hypot(row - 16, column - 16), x: screen.x, y: screen.y });
      }
    }
    if (!found.length) throw new Error("no touchable crease on the paper");
    found.sort((left, right) => left.score - right.score);
    return { x: found[0].x, y: found[0].y };
  });
  await page.mouse.click(spot.x, spot.y);
  await page.waitForTimeout(240);
}

async function layout(page, name) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${name} horizontal overflow`);
  const clipped = await page.locator("#interaction button, .tool-panel button:not([hidden]), .tool-panel a, .reverse-diagram").evaluateAll((nodes) => nodes.filter((node) => {
    const box = node.getBoundingClientRect();
    return box.width > 0 && box.height > 0 && (box.x < -1 || box.y < -1 || box.right > innerWidth + 1 || box.bottom > innerHeight + 1);
  }).map((node) => node.className.baseVal || node.className));
  assert.deepEqual(clipped, [], `${name} clipped controls`);
  await page.screenshot({ path: join(output, `${name}.png`), fullPage: false });
}

async function commonPaperRules(page, name) {
  assert.equal(await page.locator(".layer-badge").count(), 0, `${name} shows a layer badge`);
  assert.equal(await page.locator(".result-step .paper-fold-arrow").count(), 0, `${name} puts an arrow on the result picture`);
  /* 접힌 종이는 반드시 두께(측면·층 경계)로 보여야 한다 — 숫자 배지는 쓰지 않는다.
     접는 선 고르기 화면에서는 #paper 안의 결과 그림이, 만들 수 있는 모양 고르기
     화면에서는 보기 카드가 접힌 그림이다. 그 화면의 #paper는 펼친 종이라 두께가
     없는 것이 옳으므로, 접힌 그림이 실제로 놓인 곳을 검사한다. */
  const folded = "#paper .result-step .paper-stack-layer, #paper .result-step .paper-stack-side, .reverse-choice .paper-stack-layer, .reverse-choice .paper-stack-side";
  assert.equal(await page.locator(folded).count() > 0, true, `${name} loses the folded paper thickness`);
}

/* 처음 그림의 접기 화살표는 두 끝과 중간이 모두 종이 안에 있어야 한다. */
async function arrowInsidePaper(page) {
  return page.locator(".fold-start .paper-diagram").evaluate((svg) => {
    const arrow = svg.querySelector(".paper-fold-arrow");
    if (!arrow) return null;
    const paper = svg.querySelector(".paper-fill");
    const length = arrow.getTotalLength();
    return [0, 0.25, 0.5, 0.75, 1].every((ratio) => paper.isPointInFill(arrow.getPointAtLength(length * ratio)));
  });
}

let creasePicks = 0;
let creaseCrossingTaps = 0;
let creaseOffsetTaps = 0;
let multiSets = 0;

try {
  for (const [name, viewport] of viewports) {
    const problem = linePool[viewports.findIndex((item) => item[0] === name)];
    const page = await openProblem(problem, viewport, "ko", `${name}-crease`);
    await commonPaperRules(page, `${name}-crease`);

    /* 답을 고르기 전: 정답 표시가 없고, 모든 후보 선이 똑같이 보인다. */
    assert.equal(await page.locator("#paper [data-line]").count(), problem.lineChoices.length);
    assert.equal(await page.locator("#paper [data-line].correct").count(), 0);
    assert.equal(await page.locator("#paper .reverse-crease").count(), problem.lineChoices.length, "one crease must not stand out before the answer");
    assert.equal(await page.locator("#paper .paper-fold-arrow").count(), 0, "the fold direction is revealed before the answer");
    assert.equal(await page.locator("[data-result-revealed]").count(), 0);
    await layout(page, `${name}-crease-before`);

    /* D3: 두 선이 만나는 점은 어느 선으로도 판정하지 않고, 선에서 먼 빈 곳도
       판정하지 않는다. */
    const probes = await creaseProbePoints(page, problem);
    if (probes.crossing) {
      await page.mouse.click(probes.crossing.x, probes.crossing.y);
      await page.waitForTimeout(160);
      assert.equal(await page.locator(".fold-start .reverse-diagram").getAttribute("data-last-touch"), "tie", `${name}/${problem.id} a tap on a crossing picked a line`);
      assert.equal(await page.locator("#nextButton").getAttribute("hidden"), "", "a tap on a crossing solved the problem");
      assert.equal(await page.locator("#paper .wrong").count(), 0, "a tap on a crossing was marked wrong");
      creaseCrossingTaps += 1;
    }
    assert.ok(probes.empty, `${name}/${problem.id} no empty paper point to test`);
    await page.mouse.click(probes.empty.x, probes.empty.y);
    await page.waitForTimeout(160);
    assert.equal(await page.locator(".fold-start .reverse-diagram").getAttribute("data-last-touch"), "miss", `${name}/${problem.id} a tap far from every crease picked a line`);
    assert.equal(await page.locator("#nextButton").getAttribute("hidden"), "");

    /* 틀린 선을 누르면 풀리지 않는다. */
    const wrongKey = problem.lineChoices.find((choice) => !choice.correct).key;
    await touchLine(page, wrongKey);
    assert.equal(await page.locator("#nextButton").getAttribute("hidden"), "", "a wrong crease solved the problem");
    assert.equal(await page.locator("#paper .paper-fold-arrow").count(), 0);

    /* 정답 선을 누르면 풀린다. 선에서 14px 떨어진 곳(예전 띠 밖)을 눌러도
       가장 가까운 선이 정답이면 그 선으로 판정한다. */
    await page.waitForFunction(() => !document.querySelector("#paper .wrong, #paper .touch-wrong"), null, { timeout: 4000 });
    if (probes.offset) {
      await page.mouse.click(probes.offset.x, probes.offset.y);
      await page.waitForTimeout(240);
      creaseOffsetTaps += 1;
    } else {
      await touchLine(page, problem.answerKey);
    }
    await page.waitForTimeout(760);
    assert.equal(await page.locator("#nextButton").getAttribute("hidden"), null, `${name}/${problem.id} the correct crease did not solve the problem`);
    assert.equal(await page.locator("#paper .reverse-crease").count(), 1, "the solved picture must show only the answer crease");
    assert.equal(await page.locator(".fold-start .paper-fold-arrow").count(), 1);
    assert.equal(await page.locator(".result-step .paper-fold-arrow").count(), 0);
    assert.equal(await arrowInsidePaper(page), true, "the fold arrow leaves the paper");
    assert.equal(await page.locator(".layer-badge").count(), 0);
    await layout(page, `${name}-crease-solved`);
    if (name === "desktop") await page.screenshot({ path: "/tmp/gfield-reverse-fold-crease.png", fullPage: false });
    creasePicks += 1;
    await page.close();
  }

  for (const [name, viewport] of viewports) {
    const problem = resultPool[viewports.findIndex((item) => item[0] === name)];
    const page = await openProblem(problem, viewport, "ko", `${name}-multi`);
    await commonPaperRules(page, `${name}-multi`);

    /* 복수 정답 계약이 화면 문구에 있고, 정답이 미리 드러나지 않는다. */
    const prompt = await page.locator("#prompt").innerText();
    assert.match(prompt, /모두/, "the screen must ask for every possible shape");
    assert.match(prompt, /두 개/, "the screen must state that more than one answer is correct");
    assert.equal(await page.locator("[data-shape]").count(), 4);
    assert.equal(await page.locator('[data-shape][aria-pressed="true"]').count(), 0);
    assert.equal(await page.locator("[data-shape].correct").count(), 0);
    assert.equal(await page.locator("#paper .reverse-crease").count(), 0, "a crease is revealed before the answer");
    assert.equal(await page.locator("#paper .paper-fold-arrow").count(), 0);
    assert.equal(await page.locator("[data-result-revealed]").count(), 0);
    await layout(page, `${name}-multi-before`);

    /* 만들 수 없는 모양을 누르면 통과하지 않는다. */
    const wrongKey = problem.resultOptions.find((choice) => !choice.correct).key;
    await page.locator(`[data-shape="${wrongKey}"]`).click();
    await page.waitForTimeout(620);
    assert.equal(await page.locator("#nextButton").getAttribute("hidden"), "", "an impossible shape was accepted");
    assert.equal(await page.locator(`[data-shape="${wrongKey}"]`).getAttribute("aria-pressed"), "false");

    /* 정답 하나만으로는 통과하지 않는다. 모두 골라야 통과한다. */
    await page.locator(`[data-shape="${problem.answerKeys[0]}"]`).click();
    await page.waitForTimeout(240);
    assert.equal(await page.locator("#nextButton").getAttribute("hidden"), "", "one of two answers already passed");
    assert.equal(await page.locator('[data-shape][aria-pressed="true"]').count(), 1);
    await layout(page, `${name}-multi-partial`);

    await page.locator(`[data-shape="${problem.answerKeys[1]}"]`).click();
    await page.waitForTimeout(760);
    assert.equal(await page.locator("#nextButton").getAttribute("hidden"), null, "choosing every answer did not pass");
    assert.equal(await page.locator('[data-shape][aria-pressed="true"]').count(), 2);
    assert.equal(await page.locator("#paper .reverse-crease").count(), problem.creaseHints.length, "the solved picture must show both creases");
    assert.equal(await page.locator(".fold-start .paper-fold-arrow").count(), 1);
    assert.equal(await arrowInsidePaper(page), true, "the fold arrow leaves the paper");
    assert.equal(await page.locator(".layer-badge").count(), 0);
    await layout(page, `${name}-multi-solved`);
    if (name === "desktop") await page.screenshot({ path: "/tmp/gfield-reverse-fold-multi.png", fullPage: false });
    multiSets += 1;
    await page.close();
  }

  /* 네 언어 전환. 한국어가 아닌 화면에 한글이 남으면 안 된다. */
  for (const language of ["ko", "en", "zh", "ja"]) {
    const crease = await openProblem(linePool[0], { width: 390, height: 844 }, language, `locale-${language}-crease`);
    assert.equal(await crease.locator("html").getAttribute("lang"), language);
    const creaseText = await crease.locator("#prompt").innerText();
    assert.ok(creaseText.trim().length > 0);
    if (language !== "ko") assert.doesNotMatch(creaseText, /[가-힣]/, `${language} crease prompt keeps Korean`);
    else assert.match(creaseText, /[가-힣]/);
    await touchLine(crease, linePool[0].answerKey);
    await crease.waitForTimeout(760);
    assert.equal(await crease.locator("#nextButton").getAttribute("hidden"), null);
    await layout(crease, `locale-${language}-crease`);
    await crease.close();

    const multi = await openProblem(resultPool[0], { width: 390, height: 844 }, language, `locale-${language}-multi`);
    const multiText = await multi.locator("#prompt").innerText();
    if (language !== "ko") assert.doesNotMatch(multiText, /[가-힣]/, `${language} multi prompt keeps Korean`);
    for (const key of resultPool[0].answerKeys) {
      await multi.locator(`[data-shape="${key}"]`).click();
      await multi.waitForTimeout(240);
    }
    await multi.waitForTimeout(620);
    assert.equal(await multi.locator("#nextButton").getAttribute("hidden"), null);
    await layout(multi, `locale-${language}-multi`);
    await multi.close();
  }

  /* 유형 선택 화면에 세 과정이 있고, 레벨 3을 이어서 풀 수 있다. */
  const session = await openProblem(linePool[0], { width: 1280, height: 800 }, "ko", "session");
  assert.equal(await session.locator("#levelList [data-level]").count(), 3);
  for (let index = 0; index < 10; index += 1) {
    const id = await session.locator("#paper").getAttribute("data-problem-id");
    const problem = level.problems.find((item) => item.id === id);
    if (problem.interaction === "fold-line-pick") await touchLine(session, problem.answerKey);
    else for (const key of problem.answerKeys) {
      await session.locator(`[data-shape="${key}"]`).click();
      await session.waitForTimeout(220);
    }
    await session.waitForTimeout(760);
    assert.equal(await session.locator("#nextButton").getAttribute("hidden"), null, `problem ${id} did not solve`);
    await session.locator("#nextButton").click();
  }
  await session.locator("#completeDialog:not([hidden])").waitFor();
  await session.locator("#nextLevelButton").click();
  assert.equal(await session.locator("#problemLabel").innerText(), "11 / 20");
  await session.close();

  assert.deepEqual(errors, []);
  console.log([
    `Reverse fold browser check passed: ${creasePicks} direct crease picks and ${multiSets} multi-answer sets`,
    "across 1280x800, 390x844 and 844x390, four locales, no layer badge, no arrow on a result picture,",
    "no answer shown before the answer, and a full 10-problem session.",
    `D3 touch rule: ${creaseCrossingTaps} crossing taps left unjudged, ${viewports.length} empty-paper taps ignored, ${creaseOffsetTaps} taps 14px off the answer crease accepted.`,
    `Screenshots: ${output}`
  ].join(" "));
} finally {
  await browser.close();
}
