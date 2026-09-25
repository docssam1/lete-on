import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolve, sep, extname } from "node:path";
import { tmpdir } from "node:os";
import { parseOptions, frameUrl, createSession, messagePlayer, receive, startSession, advanceSession, isComplete, battleOutcome, sessionResults, messages } from "./play.js";

const event = (type, index, total = 10, prefix = "p") => ({ type: `paper-fold:${type}`, id: `${prefix}${index}`, index, total });
for (const count of [10, 20]) {
  const together = createSession("together", count);
  assert.equal(startSession(together), false);
  assert.equal(receive(together, "A", event("solved", 0, count)), false);
  assert.equal(receive(together, "A", event("ready", 1, count)), false);
  assert.equal(receive(together, "A", event("ready", 0, count)), true);
  assert.equal(receive(together, "A", event("solved", 0, count)), false);
  assert.equal(startSession(together), true);
  assert.equal(startSession(together), false);
  for (let index = 0; index < count; index += 1) {
    if (index) assert.equal(receive(together, "A", event("ready", index, count)), true);
    assert.equal(receive(together, "A", event("solved", index + 1, count)), false);
    assert.equal(receive(together, "A", { ...event("solved", index, count), id: "wrong-id" }), false);
    assert.equal(receive(together, "A", event("solved", index, count)), true);
    assert.equal(receive(together, "A", event("solved", index, count)), false);
    assert.equal(receive(together, "A", event("ready", index + 1, count)), false);
    assert.equal(together.scores.A, Math.ceil((index + 1) / 2));
    assert.equal(together.scores.B, Math.floor((index + 1) / 2));
    assert.equal(advanceSession(together, "A"), true);
    assert.equal(advanceSession(together, "A"), false);
  }
  assert.equal(receive(together, "A", { type: "paper-fold:complete", total: count }), true);
  assert.equal(isComplete(together), true);
  assert.equal(receive(together, "A", event("ready", 0, count)), false);

  const battle = createSession("battle", count);
  receive(battle, "A", event("ready", 0, count, "A"));
  assert.equal(startSession(battle), false);
  receive(battle, "B", event("ready", 0, count, "B"));
  assert.equal(startSession(battle), true);
  for (const player of ["A", "B"]) {
    for (let index = 0; index < count; index += 1) {
      if (index) assert.equal(receive(battle, player, event("ready", index, count, player)), true);
      assert.equal(receive(battle, player, event("solved", index, count, player)), true);
      advanceSession(battle, player);
    }
    assert.equal(receive(battle, player, { type: "paper-fold:complete", total: count }), true);
    if (player === "A") {
      assert.equal(isComplete(battle), false);
      assert.equal(battle.scores.B, 0);
      assert.equal(battle.slots.B.phase, "playing");
    }
  }
  assert.equal(isComplete(battle), true);
  assert.deepEqual(battle.scores, { A: count, B: count });
  assert.deepEqual(battle.points, { A: count * 3, B: count * 3 }, "missing mistakes defaults to zero");
  assert.equal(battleOutcome(battle), "tie");
  assert.deepEqual(together.points, { A: 0, B: 0 });
  assert.equal(battleOutcome(together), null);
}

for (const mode of ["battle", "together"]) {
  const checked = createSession(mode, 10);
  Object.keys(checked.slots).forEach((player) => receive(checked, player, event("ready", 0)));
  startSession(checked);
  for (const mistakes of [-1, 0.5, "1", null, undefined, NaN, Infinity, {}, [], true]) {
    assert.equal(receive(checked, "A", { ...event("solved", 0), mistakes }), false);
    assert.deepEqual(checked.scores, { A: 0, B: 0 });
    assert.deepEqual(checked.points, { A: 0, B: 0 });
    assert.equal(checked.slots.A.phase, "playing");
    assert.equal(checked.slots.A.solved.size, 0);
  }
  assert.equal(receive(checked, "A", { ...event("solved", 0), mistakes: 1 }), true);
  assert.equal(receive(checked, "A", { ...event("solved", 0), mistakes: 0 }), false);
  assert.equal(checked.scores.A, 1);
  assert.equal(checked.points.A, mode === "battle" ? 2 : 0);
}

for (const order of [["A", "B"], ["B", "A"]]) {
  const accuracy = createSession("battle", 4);
  for (const player of order) receive(accuracy, player, event("ready", 0, 4));
  startSession(accuracy);
  assert.equal(battleOutcome(accuracy), null);
  const attempts = { A: [0, 1, 2, 99], B: [1, 1, 1, 1] };
  for (const player of order) {
    for (let index = 0; index < 4; index += 1) {
      if (index) receive(accuracy, player, event("ready", index, 4));
      assert.equal(receive(accuracy, player, { ...event("solved", index, 4), mistakes: attempts[player][index] }), true);
      advanceSession(accuracy, player);
    }
    receive(accuracy, player, { type: "paper-fold:complete", total: 4 });
    if (player === order[0]) assert.equal(battleOutcome(accuracy), null);
  }
  assert.deepEqual(accuracy.scores, { A: 4, B: 4 });
  assert.deepEqual(accuracy.points, { A: 7, B: 8 });
  assert.equal(battleOutcome(accuracy), "B", "accuracy wins regardless of finishing order");
}

const guards = createSession("together", 10);
for (const count of [10, 20]) {
  for (const players of [2, 3, 4]) {
    const session = createSession("battle", count, players);
    assert.equal(Object.keys(session.slots).length, players);
    session.players.forEach((player) => receive(session, player, event("ready", 0, count)));
    assert.equal(startSession(session), true);
    for (const player of session.players) {
      for (let index = 0; index < count; index += 1) {
        if (index) assert.equal(receive(session, player, event("ready", index, count)), true);
        assert.equal(receive(session, player, { ...event("solved", index, count), mistakes: player === "A" && index === 0 ? 1 : 0 }), true);
        advanceSession(session, player);
      }
      assert.equal(receive(session, player, { type: "paper-fold:complete", total: count }), true);
      assert.equal(isComplete(session), player === session.players.at(-1));
    }
    const results = sessionResults(session);
    assert.equal(results.length, players);
    assert.equal(results.at(-1).player, "A");
    assert.equal(results.at(-1).rank, players);
    assert.equal(results.at(-1).mistakes, 1);
    assert.equal(results.at(-1).points, count * 3 - 1);
    assert.ok(results.every((result) => result.solved === count));
    assert.ok(results.slice(0, -1).every((result) => result.rank === 1 && result.points === count * 3));
    assert.equal(battleOutcome(session), players === 2 ? "B" : "tie");
  }
}
assert.deepEqual(createSession("together", 10, 4).players, ["A", "B"]);
for (const data of [null, {}, event("ready", -1), event("ready", 0, 20), { ...event("ready", 0), id: "" }, { ...event("ready", 0), index: "0" }, { type: "paper-fold:complete", total: 10 }]) assert.equal(receive(guards, "A", data), false);
assert.equal(receive(guards, "X", event("ready", 0)), false);
assert.equal(receive(guards, "A", { type: "paper-fold:error", message: "Failed" }), true);
assert.equal(guards.slots.A.error, "Failed");
assert.equal(receive(guards, "A", event("ready", 0)), false);
const nativeNext = createSession("battle", 10);
receive(nativeNext, "A", event("ready", 0));
receive(nativeNext, "B", event("ready", 0));
startSession(nativeNext);
receive(nativeNext, "A", event("solved", 0));
assert.equal(receive(nativeNext, "A", event("ready", 1)), true, "battle may advance from the embedded next button");
assert.equal(nativeNext.slots.A.phase, "playing");
assert.equal(nativeNext.scores.A, 1);
assert.equal(nativeNext.slots.B.index, 0);
const frameA = {}, frameB = {};
const frames = { A: { contentWindow: frameA }, B: { contentWindow: frameB } };
const origin = "http://127.0.0.1:8765";
assert.equal(messagePlayer({ origin, source: frameA, data: event("ready", 0) }, origin, frames), "A");
assert.equal(messagePlayer({ origin, source: frameB, data: event("ready", 0) }, origin, frames), "B");
assert.equal(messagePlayer({ origin: "https://foreign.example", source: frameA, data: {} }, origin, frames), null);
assert.equal(messagePlayer({ origin, source: {}, data: {} }, origin, frames), null);
assert.equal(messagePlayer({ origin: "null", source: frameA, data: {} }, "null", frames), null);
assert.equal(messagePlayer({ origin, source: frameA, data: [] }, origin, frames), null);
assert.deepEqual(parseOptions("?mode=remote&level=999&count=999&seed=<bad>"), { mode: "together", players: 2, level: 1, count: 10, seed: null });
for (const players of ["", "0", "1", "5", "-1", "2.5", "3.0", "no", "Infinity", "NaN"]) assert.equal(parseOptions(`?mode=battle&players=${players}`).players, 2);
for (const players of [2, 3, 4]) {
  assert.equal(parseOptions(`?mode=battle&players=${players}`).players, players);
  assert.equal(parseOptions(`?mode=together&players=${players}`).players, 2);
  for (const count of [10, 20]) {
    const offsets = ["A", "B", "C", "D"].slice(0, players).map((player, index) => {
      const url = new URL(frameUrl(`${origin}/geometry/games/paper-fold/play.html`, { mode: "battle", count, level: 1, seed: "shared", players }, player));
      assert.equal(url.searchParams.has("order"), false);
      assert.equal(url.searchParams.get("seed"), "shared");
      assert.equal(url.searchParams.get("offset"), String(index * Math.floor(count / players)));
      return Number(url.searchParams.get("offset"));
    });
    for (let index = 0; index < count; index += 1) assert.equal(new Set(offsets.map((offset) => (index + offset) % count)).size, players);
  }
}
const options = { mode: "battle", count: 20, level: 2, seed: "same-seed" };
const a = new URL(frameUrl(`${origin}/geometry/games/paper-fold/play.html`, options, "A"));
const b = new URL(frameUrl(`${origin}/geometry/games/paper-fold/play.html`, options, "B"));
assert.equal(a.searchParams.get("seed"), b.searchParams.get("seed"));
assert.equal(a.searchParams.get("player"), "A");
assert.equal(b.searchParams.get("player"), "B");
assert.equal(a.searchParams.has("order"), false);
assert.equal(b.searchParams.has("order"), false);
assert.equal(a.searchParams.get("offset"), "0");
assert.equal(b.searchParams.get("offset"), "10");
assert.equal(a.searchParams.get("embedded"), "1");
assert.equal(a.searchParams.get("mode"), "battle");
for (const locale of ["ko", "en", "zh", "ja"]) {
  assert.deepEqual(Object.keys(messages[locale]).sort(), Object.keys(messages.ko).sort());
  for (const value of Object.values(messages[locale])) assert.ok(value.length);
}
console.log("PASS: 2/3/4 player completion and offsets, accuracy points, malformed inputs, winner/tie rankings, no speed bonus, turn alternation, duplicate guards, origin/source gates, 4 locale dictionaries");

if (process.argv.includes("--browser") || process.argv.includes("--battle")) {
  const { chromium } = process.env.PLAYWRIGHT_MODULE
    ? await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href)
    : await import("playwright");
  const root = fileURLToPath(new URL("../../../", import.meta.url));
  const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".woff2": "font/woff2" };
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
      const path = resolve(root, `.${pathname.endsWith("/") ? `${pathname}index.html` : pathname}`);
      if (!path.startsWith(`${resolve(root)}${sep}`)) { response.writeHead(403).end(); return; }
      const content = await readFile(path);
      response.writeHead(200, { "Content-Type": types[extname(path)] || "application/octet-stream" }).end(content);
    } catch { response.writeHead(404).end(); }
  });
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ headless: true });
  try {
    if (process.argv.includes("--battle")) {
      const output = process.env.GFIELD_SCREENSHOT_DIR || resolve(tmpdir(), "gfield-paper-fold-play");
      await mkdir(output, { recursive: true });
      const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.addInitScript(() => {
        localStorage.setItem("gfield-language", "ko");
        window.battleSolved = [];
        window.addEventListener("message", (event) => {
          if (event.origin !== location.origin || event.data?.type !== "paper-fold:solved") return;
          const iframe = Array.from(document.querySelectorAll("iframe")).find((node) => node.contentWindow === event.source);
          if (iframe) window.battleSolved.push({ ...event.data, player: new URL(iframe.src).searchParams.get("player") });
        });
      });
      await page.goto(base + "/geometry/games/paper-fold/play.html?mode=battle&players=4&count=10&seed=accuracy-four-e2e");
      assert.equal(await page.locator("#playersSelect").inputValue(), "4");
      assert.equal(await page.locator(".pf-overlay img").count(), 0);
      await page.locator(".pf-overlay button:visible").first().click();
      assert.equal(await page.locator("#setupArea").isHidden(), true);
      const frames = page.frames().filter((frame) => new URL(frame.url()).searchParams.has("player")).sort((a, b) => new URL(a.url()).searchParams.get("player").localeCompare(new URL(b.url()).searchParams.get("player")));
      assert.deepEqual(frames.map((frame) => new URL(frame.url()).searchParams.get("player")), ["A", "B", "C", "D"]);
      assert.deepEqual(frames.map((frame) => new URL(frame.url()).searchParams.get("offset")), ["0", "2", "4", "6"]);
      for (const frame of frames) {
        assert.equal(await frame.locator("#foldyGuide").isVisible(), false, "embedded avatar must be hidden");
        assert.equal(await frame.locator(".topbar").isVisible(), false, "embedded navigation must be hidden");
      }
      const desktopBounds = await page.locator("iframe").evaluateAll((nodes) => nodes.map((node) => { const rect = node.getBoundingClientRect(); return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }; }));
      assert.ok(desktopBounds.every((rect) => rect.width >= 600 && rect.height >= 300 && rect.height <= 380 && rect.y + rect.height <= 950));
      assert.ok(desktopBounds[1].x > desktopBounds[0].x && desktopBounds[2].y > desktopBounds[0].y);
      await page.screenshot({ path: output + "/playing4-desktop.png", fullPage: true });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.evaluate(() => scrollTo(0, 0));
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      const mobileBounds = await page.locator("iframe").evaluateAll((nodes) => nodes.map((node) => { const rect = node.getBoundingClientRect(); return { y: rect.y, height: rect.height }; }));
      assert.ok(mobileBounds.every((rect) => rect.height >= 650));
      for (let index = 1; index < mobileBounds.length; index += 1) assert.ok(mobileBounds[index].y >= mobileBounds[index - 1].y + mobileBounds[index - 1].height);
      await page.screenshot({ path: output + "/playing4-mobile-390.png", fullPage: true });
      await page.setViewportSize({ width: 1440, height: 950 });
      const queues = frames.map(() => []);
      const interactions = new Set();
      async function solveProblem(frame, playerIndex, index) {
        const problem = await frame.evaluate(async () => {
          const { levels } = await import("./levels.js");
          const id = document.querySelector("#paper").dataset.problemId;
          return levels.flatMap((level) => level.problems).find((problem) => problem.id === id);
        });
        assert.ok(problem);
        interactions.add(problem.interaction);
        const wrong = playerIndex === 0 && index === 0;
        if (problem.interaction === "connect-match") {
          if (wrong) {
            await frame.locator('[data-left="' + problem.pairs[0].key + '"]').dispatchEvent("click");
            await frame.locator('[data-right="' + problem.pairs[1].key + '"]').dispatchEvent("click");
            await frame.waitForTimeout(600);
          }
          for (const pair of problem.pairs) {
            await frame.locator('[data-left="' + pair.key + '"]').dispatchEvent("click");
            await frame.locator('[data-right="' + pair.key + '"]').dispatchEvent("click");
          }
        } else {
          if (wrong) {
            await frame.locator('[data-side]:not([data-side="' + problem.folds[0].side + '"])').dispatchEvent("click");
            await frame.waitForTimeout(600);
          }
          for (const fold of problem.folds) {
            await frame.locator('[data-side="' + fold.side + '"]').dispatchEvent("click");
            await frame.waitForTimeout(500);
          }
          for (const step of problem.unfoldSteps) {
            await frame.locator('[data-side="' + step.answer + '"]').dispatchEvent("click");
            await frame.waitForTimeout(500);
          }
          if (await frame.locator("[data-choice]").count()) await frame.locator('[data-choice="' + (problem.resultAnswer || problem.answer) + '"]').dispatchEvent("click");
        }
        await page.locator(".pf-game-actions button").nth(playerIndex).waitFor({ state: "visible" });
      }
      for (let index = 0; index < 10; index += 1) {
        const aligned = await Promise.all(frames.map((frame) => frame.locator("#paper").getAttribute("data-problem-id")));
        assert.equal(new Set(aligned).size, 4, "same-position problem collision at " + index);
        aligned.forEach((id, playerIndex) => queues[playerIndex].push(id));
        await Promise.all(frames.map((frame, playerIndex) => solveProblem(frame, playerIndex, index)));
        assert.equal(await page.locator("#finishBanner").isHidden(), true);
        for (let playerIndex = 0; playerIndex < 4; playerIndex += 1) {
          await page.locator(".pf-game-actions button").nth(playerIndex).dispatchEvent("click");
          if (index === 9 && playerIndex < 3) {
            assert.equal(await page.locator("#finishBanner").isHidden(), true);
            const finishedPanel = page.locator(".pf-game").nth(playerIndex);
            await finishedPanel.locator('.pf-overlay[data-state="waiting"]').waitFor({ state: "visible" });
            assert.equal(await finishedPanel.locator("iframe").isHidden(), true, "completed answers must be concealed");
            assert.equal(await finishedPanel.locator(".pf-overlay img").count(), 0);
            assert.equal(await finishedPanel.locator(".pf-overlay p").textContent(), playerIndex === 0 ? "29점" : "30점");
          }
        }
        if (index < 9) await Promise.all(frames.map((frame) => frame.waitForFunction((expected) => Number(document.querySelector("#paper").dataset.problemIndex) === expected, index + 1)));
      }
      for (const queue of queues) {
        assert.equal(new Set(queue).size, 10);
        assert.deepEqual([...queue].sort(), [...queues[0]].sort(), "players must share the exact pool");
      }
      assert.ok(interactions.has("connect-match"), "matching problems were exercised");
      assert.ok(interactions.size > 1, "fold/side/final-answer problems were exercised");
      await page.locator("#finishBanner:visible").waitFor();
      assert.equal(await page.locator("#gameFrames").isHidden(), true);
      assert.equal(await page.locator("#finishBanner img").count(), 0);
      assert.equal(await page.locator("#finishTitle").textContent(), "무승부!");
      const scores = await page.locator(".pf-points strong").allTextContents();
      assert.deepEqual(scores, ["29", "30", "30", "30"]);
      const resultRows = await page.locator(".pf-results-table tbody tr").evaluateAll((rows) => rows.map((row) => ({ player: row.dataset.player, rank: row.dataset.rank, values: Array.from(row.cells).map((cell) => cell.textContent) })));
      assert.deepEqual(resultRows.map((row) => row.player), ["B", "C", "D", "A"]);
      assert.deepEqual(resultRows.map((row) => row.rank), ["1", "1", "1", "4"]);
      assert.deepEqual(resultRows.map((row) => row.values.slice(2)), [["30", "10", "0"], ["30", "10", "0"], ["30", "10", "0"], ["29", "10", "1"]]);
      const solved = await page.evaluate(() => window.battleSolved);
      assert.equal(solved.length, 40);
      assert.equal(solved.filter((event) => event.mistakes === 1 && event.player === "A").length, 1);
      assert.equal(solved.filter((event) => event.mistakes === 0).length, 39);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.deepEqual(errors, []);
      await page.screenshot({ path: output + "/final4-desktop.png", fullPage: true });
      await page.close();
      console.log("PASS: actual 4-player battle; 40 complete problems; no aligned collisions; A 29, B/C/D 30; results hide board; avatars hidden; ranking and mistakes verified");
      console.log("Screenshots: " + output + "/playing4-desktop.png, " + output + "/playing4-mobile-390.png, " + output + "/final4-desktop.png");
    } else {
    // The stub tests the host protocol independently of concurrent app.js edits.
    const stub = `<!doctype html><html><body><button id="solve">Solve</button><script>
      const q=new URLSearchParams(location.search);let index=0;const total=Number(q.get('count'));let solved=false;
      function send(type){parent.postMessage({type:'paper-fold:'+type,id:'p'+index,index,total},location.origin)}
      document.querySelector('#solve').onclick=()=>{solved=true;send('solved')};
      addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==parent||e.data.type!=='paper-fold:next'||!solved)return;solved=false;if(index===total-1)send('complete');else{index++;send('ready')}});
      send('ready');
      </script></body></html>`;
    const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route("**/paper-fold/index.html?*", (route) => route.fulfill({ contentType: "text/html", body: stub }));
    await page.goto(`${base}/geometry/games/paper-fold/play.html?mode=together&seed=test`);
    await page.locator(".pf-overlay button:visible").click();
    for (let index = 0; index < 10; index += 1) {
      await page.frameLocator("iframe").locator("#solve").click();
      await page.locator(".pf-overlay button:visible").waitFor();
      assert.equal(await page.locator("#scoreA").textContent(), String(Math.ceil((index + 1) / 2)));
      assert.equal(await page.locator("#scoreB").textContent(), String(Math.floor((index + 1) / 2)));
      await page.locator(".pf-overlay button:visible").click();
    }
    await page.locator("#finishBanner:visible").waitFor();
    assert.equal(await page.locator("#sharedCount").textContent(), "10 / 10");
    await page.locator("#setupToggle").click();
    await page.locator("#battleLink").click();
    await page.locator(".pf-overlay button:visible").first().click();
    for (let index = 0; index < 10; index += 1) {
      await page.frameLocator("iframe").first().locator("#solve").click();
      await page.locator(".pf-game-actions button:visible").first().click();
    }
    assert.equal(await page.locator("#scoreA").textContent(), "해결 10 / 10");
    assert.equal(await page.locator("#scoreB").textContent(), "해결 0 / 10");
    assert.equal(await page.locator("#pointsA").textContent(), "30");
    assert.equal(await page.locator("#finishBanner").isHidden(), true);
    for (let index = 0; index < 10; index += 1) {
      await page.frameLocator("iframe").nth(1).locator("#solve").click();
      await page.locator(".pf-game-actions button:visible").click();
    }
    await page.locator("#finishBanner:visible").waitFor();
    assert.equal(await page.locator("#finishTitle").textContent(), "무승부!");
    await page.locator("#setupToggle").click();
    for (const lang of ["ko", "en", "zh", "ja"]) {
      await page.locator("#languageSelect").selectOption(lang);
      for (const width of [1440, 390, 320]) {
        await page.setViewportSize({ width, height: 900 });
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${lang}/${width}: horizontal overflow`);
        const bounds = await page.locator("iframe").evaluateAll((nodes) => nodes.map((node) => { const r = node.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; }));
        assert.ok(bounds.every((r) => r.height >= 650));
        if (width < 1100) assert.ok(bounds[1].y >= bounds[0].y + bounds[0].height);
        else assert.ok(bounds[1].x >= bounds[0].x + bounds[0].width);
      }
    }
    assert.deepEqual(errors, []);
    await page.close();
    console.log("PASS: browser contract together/battle full rounds, 4 locales at 1440/390/320px, no horizontal overflow");
    }
  } finally {
    await browser.close();
    await new Promise((done) => server.close(done));
  }
}
