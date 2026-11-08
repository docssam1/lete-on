"use strict";

// Run against a local server or the deployed site. Unlike the legacy Node audit,
// this uses the exact scripts and ordering loaded by the actual question bank.
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:8918";

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ serviceWorkers: "block" });
    const page = await context.newPage();
    const pageErrors = [];
    const scriptFailures = [];
    page.on("pageerror", error => pageErrors.push(error.message));
    page.on("response", response => {
      if (response.request().resourceType() === "script" && response.status() >= 400) {
        scriptFailures.push(`${response.status()} ${response.url()}`);
      }
    });
    page.on("requestfailed", request => {
      if (request.resourceType() === "script") scriptFailures.push(`${request.url()}: ${request.failure()?.errorText}`);
    });
    await page.goto(`${origin}/hselementary/question-bank/`, { waitUntil: "load", timeout: 90000 });
    const report = await page.evaluate(() => {
      const api = window.HSE_GENERATORS;
      const semesters = window.HSE_CURRICULUM?.semesters;
      if (!api || !semesters?.length) throw new Error("분류표 또는 생성기를 불러오지 못했습니다.");
      const types = semesters.flatMap(semester => semester.units.flatMap(unit => unit.subunits.flatMap(group => group.types)));
      const ids = new Set();
      const failures = [];
      let ready = 0, noSource = 0, checks = 0;
      for (const type of types) {
        if (!type.id || ids.has(type.id)) failures.push(`${type.id}: 유형 ID 누락 또는 중복`);
        ids.add(type.id);
        const available = Boolean(api.generatorKey(type)) && !type.reviewLocked;
        if (!type.sourceItemId) {
          noSource++;
          if (available || !type.reviewLocked || type.generationMode !== "review-locked" || type.verifiedVariantCount !== 0 || !/원본의 개별 문항/.test(type.reviewReason || "")) {
            failures.push(`${type.id}: 원문 미연결 잠금 계약 위반`);
          }
        }
        if (!available) continue;
        ready++;
        if (!type.sourceItemId) failures.push(`${type.id}: 원문 ID 없이 공개`);
        for (const difficulty of [-1, 0, 1]) {
          try {
            const index = type.generationMode === "fixed-verified-pool" ? 0 : type.variant;
            const q = api.generate(type, 0, difficulty, 1, index);
            checks++;
            if (!q?.prompt || q.answer === undefined || !q.solution) throw new Error("문제·정답·풀이 누락");
            if (type.answerVisualRequired && !String(q.answerVisual || "").trim()) throw new Error("필수 정답 그림 누락");
            const visible = `${q.prompt} ${q.answer} ${q.solution}`.replace(/<[^>]*>/g, " ");
            if (/undefined|null|NaN|Infinity/.test(visible)) throw new Error("문제·정답·풀이의 잘못된 값");
            const visual = String(q.answerVisual || "");
            if (/<svg\b/.test(visual) && !/viewBox="[^"]+"/.test(visual)) throw new Error("정답 SVG의 viewBox 누락");
            if (/undefined|null|NaN|Infinity/.test(visual.replace(/<title>[\s\S]*?<\/title>/g, ""))) throw new Error("정답 그림의 잘못된 값");
          } catch (error) { failures.push(`${type.id} / 난이도 ${difficulty}: ${error.message}`); }
        }
      }
      if (!types.length || !ready) failures.push("분류표 또는 생성 가능 유형이 비었습니다.");
      return { total: types.length, ready, locked: types.length - ready, noSource, checks, failures };
    });
    if (pageErrors.length || scriptFailures.length || report.failures.length) {
      console.error(JSON.stringify({ ...report, pageErrors, scriptFailures }, null, 2));
      process.exitCode = 1;
    } else {
      console.log(`PASS: 전체 ${report.total}, 생성 가능 ${report.ready}, 검수 대기 ${report.locked}, 원문 미연결 ${report.noSource}; 세 난이도 ${report.checks}회 생성`);
    }
    await context.close();
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
