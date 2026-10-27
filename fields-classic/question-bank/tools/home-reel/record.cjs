// 첫 화면(home.html) 숏릴을 실제 화면에서 찍는다 — 원장(2026-10-27): 「음성도 넣고 좀 더 실감나게, 너무 느려」.
// 장면마다 실제 차시 덱(study.html)·시작 화면(start.html)을 열고 손가락으로 누르듯 빠르게 푼다(누른 자리에 동그라미가 퍼진다).
// 장면별로 따로 찍은 뒤 ffmpeg로 이어 붙여 assets/front/reel.mp4 · reel-poster.jpg 를 만든다. 장면 시작 시각은 reel-scenes.json.
//
//   (저장소 루트에서) python3 -m http.server 8765 &
//   node fields-classic/question-bank/tools/home-reel/record.cjs
//
// 정답 보호: 골든벨 원본 문항에는 답을 쓰지 않는다(화면만 보여 준다). 게임은 무작위로 만든 문제라 풀어도 된다.
const { chromium } = require("playwright");
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const BASE = process.env.REEL_BASE || "http://localhost:8765/fields-classic/question-bank/";
const QB = path.resolve(__dirname, "../..");
const WORK = process.env.REEL_WORK || fs.mkdtempSync(path.join(require("os").tmpdir(), "reel-"));
const W = 1280, H = 824, OUT_W = 960, OUT_H = 618;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 누른 자리에 퍼지는 동그라미(모든 창에 — 골든벨은 덱 안의 창이다)
const TAP_SCRIPT = `addEventListener("pointerdown", (e) => {
  const d = document.createElement("i");
  d.style.cssText = "position:fixed;z-index:2147483647;pointer-events:none;left:" + (e.clientX - 22) + "px;top:" + (e.clientY - 22) + "px;width:44px;height:44px;border-radius:50%;background:rgba(255,214,80,.55);border:3px solid rgba(255,255,255,.95);box-shadow:0 0 0 2px rgba(91,61,153,.45);transition:transform .45s ease-out,opacity .45s ease-out;transform:scale(.5);opacity:1";
  document.documentElement.appendChild(d);
  requestAnimationFrame(() => { d.style.transform = "scale(1.35)"; d.style.opacity = "0"; });
  setTimeout(() => d.remove(), 500);
}, true);`;

const bell = (page) => page.frames().find((f) => /golden-bell\.html/.test(f.url()));
async function slideOf(browser, query, title, kind = "") {
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  for (let s = 1; s <= 16; s++) {
    await page.goto(`${BASE}study.html?${query}&s=${s}`);
    await page.waitForTimeout(700);
    const head = await page.locator("#slideHead").innerText();
    if (head.includes(title) && head.includes(kind)) { await page.close(); return s; }
  }
  throw new Error(`장을 찾지 못함: ${query} ${title}`);
}
let born = 0, events = [];
const mark = (type) => events.push({ type, t: (Date.now() - born) / 1000 });
async function tap(target, selector, pause = 160, sound = "tap") { await target.locator(selector).first().click(); mark(sound); await sleep(pause); }

// ── 장면 ──
const SCENES = [
  { id: "shape", kicker: "보고 배우고", title: "뒤집고 돌리기 공방", step: 0, query: "book=book-01&unit=0&part=1", slide: "뒤집고 돌리기 공방",
    ready: (p) => p.locator(".smv-cell.spark").waitFor(),
    async act(page) {
      const g = await page.$eval(".smv-cell.spark", (e) => [+e.dataset.r, +e.dataset.c]);
      await sleep(350);
      await tap(page, `.smv-board.target .smv-cell[data-r="${g[0]}"][data-c="${3 - g[1]}"]`, 520);   // 첫 문제는 오른쪽으로 뒤집기
      const src = await page.$$eval(".smv-work .smv-board:not(.target) .smv-cell.given", (es) => es.map((e) => [+e.dataset.r, +e.dataset.c]));
      for (const [r, c] of src) if (!(r === g[0] && c === g[1])) await tap(page, `.smv-board.target .smv-cell[data-r="${r}"][data-c="${3 - c}"]`, 170);
      await tap(page, '[data-smv="check"]', 1100, "good");
    } },
  { id: "clock", kicker: "보고 배우고", title: "시계 바늘 돌리기", step: 0, query: "book=book-01&unit=0&part=1", slide: "시계 바늘 돌리기",
    ready: async (p) => { await sleep(1200); await bell(p).locator('.cg[data-phase="play"]').waitFor(); },
    async act(page) {
      const f = bell(page);
      if (await f.locator("[data-clock-go]:visible").count()) await tap(f, "[data-clock-go]", 250);
      for (let n = 0; n < 2; n++) {
        const d = await f.locator(".cg").evaluate((el) => ({ ...el.dataset }));
        const start = Number(d.start), ops = d.ops.split(",").map(Number);
        let answer = start; for (const op of ops) answer = ((answer + op * 3 - 1) % 12 + 12) % 12 + 1;
        if (d.stage === "turn") { for (let i = 0; i < Math.abs(ops[0]); i++) await tap(f, `[data-clock-turn="${Math.sign(ops[0])}"]:not([disabled])`, 260); await tap(f, "[data-clock-check]:not([disabled])", 900, "good"); }
        else if (d.stage === "reverse") await tap(f, `[data-clock-choice="${ops[0]}"]`, 900, "good");
        else await tap(f, `[data-clock-number="${answer}"]`, 900, "good");
        if (n === 0) await tap(f, "[data-clock-next]", 350);
      }
    } },
  { id: "balance", kicker: "보고 배우고", title: "무게 줄 세우기", step: 0, query: "book=book-02&unit=1&part=1", slide: "무게 줄 세우기",
    ready: async (p) => { await sleep(1200); await bell(p).locator('.cg.lg[data-phase="play"]').waitFor(); },
    async act(page) {
      const f = bell(page);
      if (await f.locator("[data-game-go]:visible").count()) await tap(f, "[data-game-go]", 300);
      for (let n = 0; n < 2; n++) {
        const pr = await f.locator(".cg.lg").evaluate((el) => el.fcProblem);
        if (pr.kind === "order") { for (const i of pr.answer) await tap(f, `[data-game-controls] [data-b2-item="${i}"]`, 200); await tap(f, "[data-b2-check]", 900, "good"); }
        else await tap(f, `[data-game-controls] [data-b2-item="${pr.answer}"]`, 900, "good");
        if (n === 0) await tap(f, "[data-game-next]", 350);
      }
    } },
  { id: "cubes", kicker: "보고 배우고", title: "쌓기나무 탑 쌓기", step: 0, query: "book=book-09&unit=1&part=1", slide: "쌓기나무 탑 쌓기",
    ready: async (p) => { await sleep(1500); await bell(p).locator('.cg.lg[data-phase="play"]').waitFor(); },
    async act(page) {
      const f = bell(page);
      if (await f.locator("[data-game-go]:visible").count()) await tap(f, "[data-game-go]", 300);
      const pr = await f.locator(".cg.lg").evaluate((el) => el.fcProblem);
      const cells = []; pr.answerMap.forEach((row, r) => row.forEach((h, c) => { if (h) cells.push([r, c, h]); }));
      for (const [r, c, h] of cells) for (let k = 0; k < h; k++) await tap(f, `[data-b9-cell="${r},${c}"]`, 140);
      await tap(f, "[data-b9-check]", 1000, "good");
    } },
  { id: "board", kicker: "공부하고", title: "개념 학습 · 독쌤 칠판", step: 1, query: "book=book-01&unit=0&part=1", slide: "시계 바늘을 돌려요", kind: "개념",
    ready: (p) => p.locator(".cb").waitFor(),
    async act(page) {   // 판서를 2배로, 장면을 넘기며 칠판에 그려지는 모습을 빠르게
      await tap(page, '[data-cb-speed="2"]', 1100);
      for (let k = 0; k < 3; k++) await tap(page, '[data-cb="next"]', 1050);
    } },
  { id: "bell", kicker: "공부하고", title: "골든벨 문제", step: 1, query: "book=book-05&unit=0&part=1", slide: "달력에서 요일 찾기", kind: "골든벨",
    ready: async (p) => { await p.waitForFunction(() => [...document.querySelectorAll("iframe")].some((f) => /golden-bell/.test(f.src))); await sleep(1500); await bell(p).locator(".source-question-progress span").first().waitFor(); },
    async act(page) {
      const f = bell(page);
      await sleep(700);
      for (const k of [1, 2]) { const chip = f.locator(".source-question-progress span").nth(k); if (await chip.count()) await chip.click().catch(() => {}); await sleep(900); }
    } },
  { id: "start", kicker: "완성하기", title: "오늘 공부할 내용 고르기", step: 2, url: "start.html",
    ready: (p) => p.locator("[data-book='book-01']").waitFor(),
    async act(page) {
      await sleep(500);
      await tap(page, "[data-book='book-01']", 750);
      await tap(page, "[data-unit='0']", 1100);
      await page.locator(".st-part-list .st-part").first().hover(); await sleep(500);
    } }
];

(async () => {
  const browser = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist", "--enable-unsafe-swiftshader"] });
  const parts = [];
  for (const sc of SCENES) {
    const url = sc.url ? BASE + sc.url : `${BASE}study.html?${sc.query}&s=${await slideOf(browser, sc.query, sc.slide, sc.kind)}`;
    const ctx = await browser.newContext({ viewport: { width: W, height: H }, recordVideo: { dir: WORK, size: { width: W, height: H } } });
    await ctx.addInitScript(TAP_SCRIPT);
    await ctx.addInitScript(() => { try { localStorage.setItem("fields-classic-study-pref", JSON.stringify({ sound: false, paused: false })); } catch {} });
    const page = await ctx.newPage();
    born = Date.now(); events = [];
    page.on("pageerror", (e) => console.log(`  [${sc.id}] pageerror ${e.message}`));
    await page.goto(url);
    await sc.ready(page);
    await sleep(250);
    const t0 = (Date.now() - born) / 1000;
    await sc.act(page);
    const t1 = (Date.now() - born) / 1000;
    const video = page.video();
    await ctx.close();
    parts.push({ ...sc, file: await video.path(), t0, t1, events: events.filter((e) => e.t >= t0 && e.t <= t1).map((e) => ({ type: e.type, t: e.t - t0 })) });
    console.log(`${sc.id}: ${(t1 - t0).toFixed(1)}초`);
  }
  await browser.close();

  // 이어 붙이기: 장면마다 잘라 960×618 · 30fps 로 맞춘 뒤 concat
  const clips = [];
  for (const [k, p] of parts.entries()) {
    const out = path.join(WORK, `clip${k}.mp4`);
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", p.t0.toFixed(2), "-to", p.t1.toFixed(2), "-i", p.file, "-vf", `scale=${OUT_W}:${OUT_H}:flags=lanczos,fps=30`, "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "28", "-pix_fmt", "yuv420p", out]);
    clips.push(out);
  }
  const list = path.join(WORK, "list.txt");
  fs.writeFileSync(list, clips.map((c) => `file '${c}'`).join("\n"));
  const reel = path.join(QB, "assets/front/reel.mp4");
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", list, "-c:v", "libx264", "-preset", "slow", "-crf", "28", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", reel]);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", "1.2", "-i", reel, "-frames:v", "1", "-q:v", "4", path.join(QB, "assets/front/reel-poster.jpg")]);
  // 장면 시작 시각(home.js 자막·음성이 읽는다)
  let at = 0;
  const sfx = [];
  const scenes = parts.map((p) => { const s = { at: +at.toFixed(2), id: p.id, kicker: p.kicker, title: p.title, step: p.step }; for (const e of p.events) sfx.push({ type: e.type, t: +(at + e.t).toFixed(3) }); at += p.t1 - p.t0; return s; });
  fs.writeFileSync(path.join(QB, "assets/front/reel-scenes.json"), JSON.stringify({ length: +at.toFixed(2), scenes }, null, 1) + "\n");
  fs.writeFileSync(path.join(WORK, "sfx.json"), JSON.stringify({ length: at, scenes: scenes.map((s) => s.at), sfx }));
  // 음악·효과음(직접 합성 — 남의 음원 없음)을 깔아 영상에 넣는다
  const wav = path.join(WORK, "reel-audio.wav");
  execFileSync("python3", [path.join(__dirname, "soundtrack.py"), path.join(WORK, "sfx.json"), wav], { stdio: "inherit" });
  const silent = path.join(WORK, "silent.mp4");
  fs.renameSync(reel, silent);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", silent, "-i", wav, "-c:v", "copy", "-c:a", "aac", "-b:a", "96k", "-shortest", "-movflags", "+faststart", reel]);
  console.log(`reel.mp4 ${at.toFixed(1)}초 · ${(fs.statSync(reel).size / 1024).toFixed(0)}KB`);
})().catch((e) => { console.error(e); process.exit(1); });
