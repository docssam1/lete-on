"use strict";
// Run against a locally served checkout, so index.html loads the production adapter set.
const assert = require("assert");
const { chromium } = require(process.env.HSE_PLAYWRIGHT_PATH || "playwright");
const origin = process.env.HSE_AUDIT_ORIGIN || "http://127.0.0.1:8918";
(async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("response", response => {
      if (response.url().startsWith(origin) && response.request().resourceType() === "script" && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
    });
    await page.goto(`${origin}/hselementary/question-bank/`, { waitUntil: "networkidle" });
    const result = await page.evaluate(() => {
      const types = HSE_CURRICULUM.semesters.flatMap(s => s.units.flatMap(u => u.subunits.flatMap(g => g.types)));
      const failures = [], ids = new Set();
      let ready = 0, lockedWithoutSource = 0;
      for (const t of types) {
        if (ids.has(t.id)) failures.push(`${t.id}: 중복 ID`);
        ids.add(t.id);
        const key = HSE_GENERATORS.generatorKey(t);
        if (!t.reviewLocked) {
          if (!key) failures.push(`${t.id}: 공개 유형에 생성기가 없습니다`);
          else ready++;
          if (!t.sourceItemId || t.sourceVerified !== true) failures.push(`${t.id}: 공개 유형의 원문 연결 또는 확인 정보가 없습니다`);
        }
        if (!t.sourceItemId) {
          lockedWithoutSource++;
          if (!t.reviewLocked || t.generationMode !== "review-locked" || t.verifiedVariantCount !== 0) failures.push(`${t.id}: 원문 미연결 잠금 계약 위반`);
        }
      }
      return { total: types.length, ready, lockedWithoutSource, failures };
    });
    assert(result.total > 0 && result.ready > 0, "교육과정과 생성기를 불러와야 합니다");
    assert.deepStrictEqual(errors, [], "브라우저 오류나 스크립트 로드 실패가 없어야 합니다");
    assert.deepStrictEqual(result.failures, [], "공개·잠금 연결 계약을 지켜야 합니다");
    console.log(`브라우저 공개 연결 검사 통과: 전체 ${result.total} · 공개 ${result.ready} · 원문 미연결 잠금 ${result.lockedWithoutSource}`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
