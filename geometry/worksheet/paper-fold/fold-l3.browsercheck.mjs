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
   - 기호는 종이 밖, 서로 겹치지 않고 그림 안에 있다(문제지·정답지 그림 모두).
   - A4 인쇄 크기에서 그림 속 글자(기호·보기 번호·그림 이름)가 문제지 약 7pt(문제 문장
     7.0pt, 기호·번호 8pt), 정답지 6pt 이상이다. 정답지 그림은 두 칸에 작게 찍혀(1px ≈ 0.17pt) 전에는 3.6pt·2.6pt였다.
   - 문제 그림에는 정답 표시(빨간 실선·화살표)가 없고, 정답지 그림에만 있다.
   - 페이지 오류가 없고, 기존 게임 연계 유형(game-l1)도 그대로 만들어진다. */

import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { levels } from "../../games/paper-fold/levels.js";

const base = (process.env.GFIELD_BASE_URL || "http://127.0.0.1:8768").replace(/\/$/, "");
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : "playwright");
const pool = levels[2].problems;
assert.equal(pool.length, 24);

const browser = await chromium.launch({ headless: true });
let smallest;
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
      const pick = (answer) => (d.lines ? reverseCreaseSpots(d, answer) : []).map((spot) => ({ X: spot.X, Y: spot.Y, outside: spot.outside }));
      return {
        id: d.source.id, interaction: d.source.interaction, answer: d.answer,
        lines: d.lines?.map((line) => ({ key: line.key, label: line.label })),
        options: d.options?.map((option) => ({ key: option.key, number: option.number })),
        spots: { question: pick(false), answer: pick(true) }
      };
    });
  });
  const text = await page.evaluate(() => REVERSE_TEXT);

  const lineAnswers = [];
  const optionAnswers = [];
  built.forEach((item, index) => {
    const source = pool[index];
    assert.equal(item.id, source.id, `problem ${index + 1} follows the game order`);
    if (source.interaction === "fold-line-pick") {
      assert.deepEqual(item.lines.map((line) => line.label), ["가", "나", "다"], `${item.id}: labels in order`);
      assert.deepEqual(item.lines.map((line) => line.key).sort(), source.lineChoices.map((choice) => choice.key).sort(), `${item.id}: every candidate crease appears once`);
      const truth = source.lineChoices.find((choice) => choice.correct).key;
      assert.equal(item.answer, item.lines.find((line) => line.key === truth).label, `${item.id}: the answer is the label on the correct crease`);
      lineAnswers.push(item.answer);
      [["question", 100], ["answer", 0]].forEach(([sheet, top]) => {
        const r = text[sheet].labelRadius;
        item.spots[sheet].forEach((spot, spotIndex) => {
          const where = `${item.id} ${sheet} label ${item.lines[spotIndex].label}`;
          assert.ok(spot.outside, `${where}: sits outside the paper`);
          assert.ok(spot.X - r > 0 && spot.X + r < 1300 && spot.Y - r > top && spot.Y + r < 520, `${where}: inside the picture (${Math.round(spot.X)},${Math.round(spot.Y)})`);
          item.spots[sheet].slice(spotIndex + 1).forEach((other) => assert.ok(Math.hypot(spot.X - other.X, spot.Y - other.Y) > 2 * r + 4, `${where}: overlaps another label`));
        });
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
    /* 문제 그림은 위 130px(문제 문장)를 빼고 센다. 정답지 그림에는 문장이 없다. */
    const measure = async (src, top) => {
      const image = new Image();
      image.src = src;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.width; canvas.height = image.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0);
      const data = ctx.getImageData(0, top, canvas.width, canvas.height - top).data;
      let paper = 0; let red = 0;
      for (let index = 0; index < data.length; index += 4 * 3) {
        const [r, g, b] = [data[index], data[index + 1], data[index + 2]];
        if (r > 230 && g > 180 && g < 215 && b > 175 && b < 210) paper += 1;
        if (r > 165 && r < 215 && g < 90 && b < 80) red += 1;
      }
      return { paper, red };
    };
    const result = [];
    for (let index = 0; index < 24; index += 1) result.push({ question: await measure(cards.questions[index].src, 130), answer: await measure(cards.answers[index].src, 0) });
    return result;
  }, sheet);
  pixels.forEach((item, index) => {
    const id = built[index].id;
    assert.ok(item.question.paper > 3000, `${id}: the question picture is drawn (${item.question.paper})`);
    assert.ok(item.question.red < 40, `${id}: the question picture shows an answer mark (${item.question.red} red pixels)`);
    assert.ok(item.answer.red > 300, `${id}: the answer picture shows the crease and arrow (${item.answer.red})`);
  });

  /* A4 인쇄 크기의 글자. 그림은 1300x520 캔버스를 칸에 맞춰(contain) 줄여 찍는다.
     CSS 1px = 0.75pt. */
  await page.emulateMedia({ media: "print" });
  const scale = await page.evaluate(() => {
    const ptPerPixel = (selector) => {
      const image = document.querySelector(selector);
      const box = image.getBoundingClientRect();
      const width = Math.min(box.width, box.height * image.naturalWidth / image.naturalHeight);
      return width * 0.75 / image.naturalWidth;
    };
    return { question: ptPerPixel(".sheet-page:not(.answer-page) .problem-card img"), answer: ptPerPixel(".answer-page .problem-card img") };
  });
  await page.emulateMedia({ media: "screen" });
  smallest = {
    question: Math.min(text.question.label, text.question.number, text.question.caption, 21) * scale.question,
    answer: Math.min(text.answer.label, text.answer.number, text.answer.caption) * scale.answer
  };
  assert.ok(smallest.question >= 6.5, `question picture text is ${smallest.question.toFixed(2)}pt on A4 (min 6.5)`);
  assert.ok(smallest.answer >= 6, `answer picture text is ${smallest.answer.toFixed(2)}pt on A4 (min 6)`);
  assert.deepEqual(errors, [], "page errors");

  /* 기존 게임 연계 유형이 그대로 만들어지는지. */
  const old = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  const oldErrors = [];
  old.on("pageerror", (error) => oldErrors.push(error.message));
  await old.goto(`${base}/geometry/worksheet/paper-fold/?modes=game-l1,game-l2&count=10`, { waitUntil: "load" });
  await old.waitForFunction(() => document.querySelectorAll(".answer-page .problem-card img").length >= 10, null, { timeout: 20000 });
  assert.deepEqual(oldErrors, [], "game-l1/l2 page errors");
  await old.close();
  await page.close();
} finally {
  await browser.close();
}
console.log(`Paper fold worksheet level 3 check passed: mode listed and deep-linked, 24 game problems drawn (30 with repeats), answers match the game data (labels on the correct crease, numbers of the two possible shapes), answers spread 가/나/다 4 each and 1-4 six each, labels outside the paper, apart and inside the picture on both sheets, smallest picture text ${smallest.question.toFixed(1)}pt on the question sheet and ${smallest.answer.toFixed(1)}pt on the answer sheet, answer marks only on the answer sheet, game-l1/l2 still build, no page errors.`);
