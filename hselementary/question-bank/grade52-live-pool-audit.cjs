"use strict";

// Exercise the same scripts and fixed-pool selection used by the worksheet UI.
// Start a local server at the repository root, or set HSE_AUDIT_ORIGIN.
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:8918";

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ serviceWorkers: "block" });
    const page = await context.newPage();
    const pageErrors = [];
    page.on("pageerror", error => pageErrors.push(error.message));
    await page.goto(`${origin}/hselementary/question-bank/`, { waitUntil: "load", timeout: 90000 });
    const report = await page.evaluate(() => {
      const semester = window.HSE_CURRICULUM?.semesters.find(item => item.id === "5-2");
      if (!semester || !window.HSE_GENERATORS) throw new Error("5학년 2학기 생성기가 로드되지 않았습니다.");
      const types = semester.units.flatMap(unit => unit.subunits.flatMap(group => group.types));
      const ready = types.filter(type => !type.reviewLocked && window.HSE_GENERATORS.generatorKey(type));
      const failures = [];
      let checked = 0;
      for (const type of ready) {
        const fixed = type.generationMode === "fixed-verified-pool";
        const declared = Number(type.verifiedVariantCount);
        if (fixed && (!Number.isSafeInteger(declared) || declared < 1)) {
          failures.push({ id: type.id, error: "고정 문항 수가 올바르지 않습니다." });
          continue;
        }
        const count = fixed ? Math.min(40, declared) : 1;
        for (const difficulty of [-1, 0, 1]) {
          const seen = new Set();
          for (let index = 0; index < count; index++) {
            try {
              const question = window.HSE_GENERATORS.generate(type, 0, difficulty, 1, fixed ? index : type.variant);
              checked++;
              if (!question?.prompt || question.answer === undefined || !question.solution) throw new Error("문제·정답·풀이 누락");
              if (type.answerVisualRequired && !String(question.answerVisual || "").trim()) throw new Error("필수 정답 그림 누락");
              const visible = `${question.prompt} ${question.answer} ${question.solution}`.replace(/<[^>]*>/g, " ");
              if (/undefined|null|NaN|Infinity/.test(visible)) throw new Error("잘못된 값 노출");
              // Keep SVG geometry: equal wording can describe different diagrams.
              const node = document.createElement("div");
              node.innerHTML = question.prompt;
              for (const element of node.querySelectorAll("*")) {
                for (const attr of [...element.attributes]) if (attr.name.startsWith("data-")) element.removeAttribute(attr.name);
              }
              const signature = node.innerHTML.replace(/\s+/g, " ").trim();
              if (seen.has(signature)) throw new Error("같은 유형 안에서 문제와 그림이 중복됨");
              seen.add(signature);
            } catch (error) {
              failures.push({ id: type.id, difficulty, index, error: error.message });
              break;
            }
          }
        }
      }
      if (!ready.length) failures.push({ error: "생성 가능한 유형이 없습니다." });
      return { total: types.length, ready: ready.length, locked: types.length - ready.length, checked, failures };
    });
    if (pageErrors.length || report.failures.length) {
      console.error(JSON.stringify({ ...report, pageErrors }, null, 2));
      process.exitCode = 1;
    } else {
      console.log(`PASS: 5-2 전체 ${report.total}, 생성 가능 ${report.ready}, 검수 대기 ${report.locked}; 난이도와 고정 변형 ${report.checked}회 검사`);
    }
    await context.close();
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
