/* 색종이 학습지 · 게임 연계 레벨 3(접는 방법 거꾸로 찾기) 브라우저 검사.

   실행: 저장소 뿌리에서 정적 서버를 띄운 뒤
     GFIELD_BASE_URL=http://127.0.0.1:8811 PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs \
       node geometry/worksheet/paper-fold/fold-l3.browsercheck.mjs

   확인하는 것
   - 유형 목록에 '게임 연계 — 접는 방법 거꾸로 찾기'가 있고 ?modes=game-l3로 열린다.
   - 24문항(접는 선 12, 모두 고르기 12)이 모두 그려지고, 30문항이면 앞에서부터 되풀이된다.
   - 정답: 접는 선 문항은 게임 데이터에서 correct인 선에 붙은 기호, 모두 고르기는
     correct인 두 보기의 번호. 문제지·정답지에 같은 답이 찍힌다. (게임 데이터는 Node에서
     따로 읽어 대조한다.)
   - 정답 자리가 고르다: 가·나·다 4번씩, 보기 번호 1~4가 6번씩.
   - 기호는 종이 밖, 서로 52px 이상 떨어져 있고 글자가 그림 안에 있다.
   - 문제 그림에는 정답 표시(빨간 실선·화살표)가 없고, 정답지 그림에만 있다.
   - 인쇄에서 학생지·정답지 모두 1열 2문항이며, 그림의 실제 contain 배율로
     지시문 12pt·기호/번호/캡션 10pt 이상, 답 11pt·풀이 10pt 이상인지 검사한다.
   - 모든 번호가 한 번씩 나오고 카드/그림/풀이가 A4 안에 있으며, 혼합 유형과
     정답지 끄기, 기존 game-l1/l2의 3문항/6문항 배치를 확인한다. */

import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { levels } from "../../games/paper-fold/levels.js";

const base = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8768").replace(/\/$/, "");
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : "playwright");
const pool = levels[2].problems;
assert.equal(pool.length, 24);

/* img 요소의 너비만 사용하면 고정 높이 + object-fit:contain의 추가 축소를 놓친다. */
async function inspectPrint(page) {
  await page.emulateMedia({ media: "print" });
  return page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.querySelectorAll(".problem-card img")].map((image) => image.decode()));
    const rect = (element) => {
      const { left, top, right, bottom, width, height } = element.getBoundingClientRect();
      return { left, top, right, bottom, width, height };
    };
    return [...document.querySelectorAll(".sheet-page")].map((sheet) => {
      const sheetStyle = getComputedStyle(sheet);
      const bounds = rect(sheet);
      return {
        answers: sheet.classList.contains("answer-page"), bounds,
        contentBottom: bounds.bottom - parseFloat(sheetStyle.paddingBottom),
        columns: getComputedStyle(sheet.querySelector(".problem-grid")).gridTemplateColumns.split(/\s+/).length,
        breakAfter: sheetStyle.breakAfter,
        cards: [...sheet.querySelectorAll(".problem-card")].map((card) => {
          const image = card.querySelector("img"), style = getComputedStyle(image);
          const imageBox = rect(image), answer = card.querySelector(".answer-line"), solution = card.querySelector(".solution-text");
          const contentWidth = image.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
          const contentHeight = image.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
          const scale = Math.min(contentWidth / image.naturalWidth, contentHeight / image.naturalHeight);
          return {
            number: parseInt(image.alt, 10), bounds: rect(card), imageBox, scale,
            naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight,
            answerPt: parseFloat(getComputedStyle(answer).fontSize) * .75,
            solutionPt: solution ? parseFloat(getComputedStyle(solution).fontSize) * .75 : null,
            children: [image, answer, solution].filter(Boolean).map(rect),
            solution: solution?.innerText || ""
          };
        })
      };
    });
  });
}

function assertReadablePages(pages, count, { answers = true, allReverse = true, rendered = [] } = {}) {
  const sequence = Array.from({ length: count }, (_, index) => index + 1);
  for (const isAnswer of [false, true]) {
    const selected = pages.filter((sheet) => sheet.answers === isAnswer);
    const expected = isAnswer && !answers ? [] : sequence;
    assert.equal(selected.length, Math.ceil(expected.length / 2), "two problems per printed page");
    assert.deepEqual(selected.flatMap((sheet) => sheet.cards.map((card) => card.number)), expected, "every problem number prints once, in order");
  }
  pages.forEach((sheet, pageIndex) => {
    const label = `${sheet.answers ? "answer" : "question"} page ${pageIndex + 1}`;
    assert.equal(sheet.columns, 1, `${label}: a single full-width column`);
    assert.ok(Math.abs(sheet.bounds.width - 210 * 96 / 25.4) < 1, `${label}: A4 width`);
    assert.ok(sheet.bounds.height <= 297 * 96 / 25.4 + 1, `${label}: no A4 overflow`);
    sheet.cards.forEach((card, index) => {
      assert.equal(card.naturalWidth, 1300, `${label}: image width`);
      if (allReverse) assert.equal(card.naturalHeight, 600, `${label}: complete level 3 image`);
      assert.ok(card.bounds.bottom <= sheet.contentBottom + 1, `${label}: card ${card.number} fits inside printable page`);
      if (index) assert.ok(card.bounds.top >= sheet.cards[index - 1].bounds.bottom, `${label}: cards do not overlap`);
      card.children.forEach((child) => {
        assert.ok(child.left >= card.bounds.left && child.right <= card.bounds.right + 1 && child.top >= card.bounds.top && child.bottom <= card.bounds.bottom + 1, `${label}: card ${card.number} content stays inside border`);
      });
      assert.ok(card.answerPt >= 11 - .01, `${label}: answer line at least 11pt`);
      if (sheet.answers) assert.ok(card.solutionPt >= 10 - .01, `${label}: solution at least 10pt`);
      if (rendered.length && card.naturalHeight === 600) {
        const source = rendered[(card.number - 1) % rendered.length];
        source.texts.forEach((text) => {
          const pointSize = text.fontPx * card.scale * .75;
          assert.ok(pointSize >= (source.instructions.includes(text.text) ? 12 : 10) - .02, `${label}, ${source.id}: “${text.text}” is only ${pointSize.toFixed(2)}pt after image fitting`);
        });
        if (sheet.answers) assert.ok(card.solution.includes(source.id), `${label}: teacher solution retains source ID`);
      }
    });
  });
  assert.equal(pages.at(-1).breakAfter, "auto", "last page does not request a blank following page");
}

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto(`${base}/geometry/worksheet/paper-fold/?modes=game-l3&count=30`, { waitUntil: "load" });
  await page.waitForFunction(() => document.querySelectorAll(".answer-page .problem-card img").length >= 30, null, { timeout: 20000 });

  const button = page.locator(".mode-button", { hasText: "접는 방법 거꾸로 찾기" });
  assert.equal(await button.count(), 1, "the level 3 mode button exists");
  assert.equal(await button.getAttribute("aria-pressed"), "true", "?modes=game-l3 selects it");

  /* 페이지 함수로 만든 문항(학습지가 실제로 쓰는 것). */
  const built = await page.evaluate(() => {
    const level = sharedGameLevels[2];
    return level.problems.map((_, index) => {
      questionNumber = index;
      const d = buildReverseProblem(level);
      const size = 330;
      const spots = d.lines ? reverseLabelSpots(d.source.frame, 150, 170, size, d.lines, d.source.paper) : [];
      const ctx = document.getElementById("cv").getContext("2d"), original = ctx.fillText, texts = [];
      ctx.fillText = function(text, x, y, ...rest) {
        const measure = this.measureText(text);
        texts.push({ text: String(text), fontPx: Number(this.font.match(/([\d.]+)px/)[1]),
          left: x - measure.actualBoundingBoxLeft, right: x + measure.actualBoundingBoxRight,
          top: y - measure.actualBoundingBoxAscent, bottom: y + measure.actualBoundingBoxDescent });
        return original.call(this, text, x, y, ...rest);
      };
      try { render(d); } finally { ctx.fillText = original; }
      return {
        id: d.source.id, interaction: d.source.interaction, answer: d.answer,
        texts, instructions: d.text,
        lines: d.lines?.map((line) => ({ key: line.key, label: line.label })),
        options: d.options?.map((option) => ({ key: option.key, number: option.number })),
        spots: spots.map((spot) => ({ X: spot.X, Y: spot.Y, outside: spot.outside }))
      };
    });
  });

  const lineAnswers = [];
  const optionAnswers = [];
  built.forEach((item, index) => {
    const source = pool[index];
    assert.equal(item.id, source.id, `problem ${index + 1} follows the game order`);
    assert.ok(item.texts.every((text) => !text.text.includes(item.id)), `${item.id}: internal ID is not printed in the student picture`);
    item.texts.forEach((text) => assert.ok(text.left >= 0 && text.right <= 1300 && text.top >= 0 && text.bottom <= 600, `${item.id}: text “${text.text}” is not cropped`));
    if (source.interaction === "fold-line-pick") {
      assert.deepEqual(item.lines.map((line) => line.label), ["가", "나", "다"], `${item.id}: labels in order`);
      assert.deepEqual(item.lines.map((line) => line.key).sort(), source.lineChoices.map((choice) => choice.key).sort(), `${item.id}: every candidate crease appears once`);
      const truth = source.lineChoices.find((choice) => choice.correct).key;
      assert.equal(item.answer, item.lines.find((line) => line.key === truth).label, `${item.id}: the answer is the label on the correct crease`);
      lineAnswers.push(item.answer);
      item.spots.forEach((spot, spotIndex) => {
        assert.ok(spot.outside, `${item.id}: label ${item.lines[spotIndex].label} sits outside the paper`);
        assert.ok(spot.X >= 24 && spot.X <= 1276 && spot.Y >= 114 && spot.Y <= 562, `${item.id}: complete label circle inside the picture and clear of header/captions`);
        item.spots.slice(spotIndex + 1).forEach((other) => assert.ok(Math.hypot(spot.X - other.X, spot.Y - other.Y) >= 52, `${item.id}: labels too close`));
      });
    } else {
      assert.deepEqual(item.options.map((option) => option.number), [1, 2, 3, 4], `${item.id}: numbers 1-4`);
      assert.deepEqual(item.options.map((option) => option.key).sort(), source.resultOptions.map((option) => option.key).sort(), `${item.id}: every shape appears once`);
      const truth = source.resultOptions.filter((option) => option.correct).map((option) => item.options.find((shown) => shown.key === option.key).number).sort();
      assert.equal(truth.length, 2, `${item.id}: two possible shapes`);
      assert.equal(item.answer, truth.map((number) => `${number}번`).join(", "), `${item.id}: the answer lists the possible shapes`);
      optionAnswers.push(...truth);
    }
  });
  const tally = (values) => values.reduce((counts, value) => ({ ...counts, [value]: (counts[value] || 0) + 1 }), {});
  assert.deepEqual(tally(lineAnswers), { 가: 4, 나: 4, 다: 4 }, "crease answers are spread evenly");
  assert.deepEqual(tally(optionAnswers), { 1: 6, 2: 6, 3: 6, 4: 6 }, "shape answers are spread evenly");

  /* 실제 문제지·정답지 카드. */
  const sheet = await page.evaluate(() => {
    const pages = [...document.querySelectorAll(".sheet-page")];
    const read = (answers) => pages.filter((item) => item.classList.contains("answer-page") === answers).flatMap((item) => [...item.querySelectorAll(".problem-card")].map((card) => ({ text: card.innerText.replace(/\s+/g, " "), src: card.querySelector("img").src })));
    return { questions: read(false), answers: read(true) };
  });
  assert.equal(sheet.questions.length, 30);
  assert.equal(sheet.answers.length, 30);
  sheet.answers.forEach((card, index) => {
    const item = built[index % 24];
    assert.ok(card.text.includes(`정답: ${item.answer}`), `answer card ${index + 1} prints ${item.answer}: ${card.text.slice(0, 80)}`);
  });

  /* 그림 검사: 빈 그림이 아니고, 정답 표시 색(#c0392b 빨강)은 정답지에만 있다. */
  const pixels = await page.evaluate(async (cards) => {
    const measure = async (src) => {
      const image = new Image();
      image.src = src;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.width; canvas.height = image.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0);
      const data = ctx.getImageData(0, 130, canvas.width, canvas.height - 130).data;
      let paper = 0; let red = 0;
      for (let index = 0; index < data.length; index += 4 * 3) {
        const [r, g, b] = [data[index], data[index + 1], data[index + 2]];
        if (r > 230 && g > 180 && g < 215 && b > 175 && b < 210) paper += 1;
        if (r > 165 && r < 215 && g < 90 && b < 80) red += 1;
      }
      return { paper, red };
    };
    const result = [];
    for (let index = 0; index < 24; index += 1) result.push({ question: await measure(cards.questions[index].src), answer: await measure(cards.answers[index].src) });
    return result;
  }, sheet);
  pixels.forEach((item, index) => {
    const id = built[index].id;
    assert.ok(item.question.paper > 3000, `${id}: the question picture is drawn (${item.question.paper})`);
    assert.ok(item.question.red < 40, `${id}: the question picture shows an answer mark (${item.question.red} red pixels)`);
    assert.ok(item.answer.red > 300, `${id}: the answer picture shows the crease and arrow (${item.answer.red})`);
  });
  assertReadablePages(await inspectPrint(page), 30, { rendered: built });
  await page.emulateMedia({ media: "screen" });
  await page.locator("#count").selectOption("20");
  await page.locator("#answers").uncheck();
  await page.waitForFunction(() => document.querySelectorAll(".problem-card img").length === 20 && !document.querySelector(".answer-page"));
  assertReadablePages(await inspectPrint(page), 20, { answers: false, rendered: built });
  assert.deepEqual(errors, [], "page errors");

  /* 혼합에서는 기존 520px 그림과 L3 600px 그림이 서로 잘리거나 다음 문항에 영향을 주면 안 된다. */
  const mixed = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  const mixedErrors = [];
  mixed.on("pageerror", (error) => mixedErrors.push(error.message));
  await mixed.goto(`${base}/geometry/worksheet/paper-fold/?modes=game-l1,game-l2,game-l3&count=30`, { waitUntil: "load" });
  await mixed.waitForFunction(() => document.querySelectorAll(".answer-page .problem-card img").length === 30, null, { timeout: 20000 });
  const mixedPages = await inspectPrint(mixed);
  assertReadablePages(mixedPages, 30, { allReverse: false });
  for (const answers of [false, true]) {
    const heights = mixedPages.filter((sheet) => sheet.answers === answers).flatMap((sheet) => sheet.cards.map((card) => card.naturalHeight));
    assert.deepEqual(tally(heights), { 520: 20, 600: 10 }, "mixed mode preserves each renderer's canvas height");
  }
  assert.deepEqual(mixedErrors, [], "mixed-mode page errors");
  await mixed.close();

  /* 기존 게임 연계 유형이 그대로 만들어지는지. */
  const old = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  const oldErrors = [];
  old.on("pageerror", (error) => oldErrors.push(error.message));
  await old.goto(`${base}/geometry/worksheet/paper-fold/?modes=game-l1,game-l2&count=10`, { waitUntil: "load" });
  await old.waitForFunction(() => document.querySelectorAll(".answer-page .problem-card img").length >= 10, null, { timeout: 20000 });
  const oldPages = await inspectPrint(old);
  assert.deepEqual(oldPages.filter((sheet) => !sheet.answers).map((sheet) => sheet.cards.length), [3, 3, 3, 1], "game-l1/l2 retain three questions per page");
  assert.deepEqual(oldPages.filter((sheet) => sheet.answers).map((sheet) => sheet.cards.length), [6, 4], "game-l1/l2 retain six answers per page");
  assert.ok(oldPages.flatMap((sheet) => sheet.cards).every((card) => card.naturalHeight === 520), "game-l1/l2 retain original canvas height");
  assert.deepEqual(oldErrors, [], "game-l1/l2 page errors");
  await old.close();
  await page.close();
} finally {
  await browser.close();
}
console.log("Paper fold worksheet level 3 check passed: 24 game problems (30 with repeats), unchanged answers and balanced positions, labels and text inside pictures, answer marks only on the answer sheet, actual print size at least 12pt for instructions and 10pt for symbols/captions, A4 pages with two full-width problems and no missing numbers, answer toggle and mixed 520px/600px renderers, game-l1/l2 legacy pagination, no page errors.");
