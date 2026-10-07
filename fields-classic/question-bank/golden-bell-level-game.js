import { createSound, confetti, esc, reduced } from "./golden-bell-game-fx.js?v=20261004a";

// FC 레벨 게임 공용 틀. 시계 게임과 같은 화면(위 막대·독쌤·조작·레벨 지도·결과)을 쓰고,
// 게임마다 바뀌는 것은 문제 만들기와 판(board)뿐이다.
//
// game = {
//   id, title,
//   levels: [{ title, rule, count, ... }],            // 정해진 레벨. 그다음부터는 endless(level)
//   endless(level) → { title, rule, count, ... },
//   build(level, { seed, weak, recent }) → [{ key, kind, ... }],   // 한 판의 문제
//   coach(problem), mission(problem)→HTML, hint(problem, info), success(problem), reveal(problem),
//   createBoard({ stage, controls, sound }) → { show(problem, api), reveal(problem, done), lock(), dispose() }
// }
// api.answer(correct, info): 판이 정답 여부를 알린다. 처음 틀리면 힌트, 두 번 틀리면 정답 보기.
// 진행(열린 레벨·별·자주 틀리는 종류·지난 판 문제)은 기기에 게임별로 저장한다. 학습 기록은 건드리지 않는다.

const ADVANCE_MS = 1900;
const PASS = 0.6;

export function levelResult(points, count) {
  const ratio = count ? points / (count * 2) : 0;
  return { passed: ratio >= PASS, stars: ratio >= 0.95 ? 3 : ratio >= 0.8 ? 2 : ratio >= PASS ? 1 : 0, ratio };
}

export const levelSpecOf = (game, level) => (level <= game.levels.length ? { level, ...game.levels[level - 1] } : { level, endless: true, ...game.endless(level) });

// 섞는 레벨에서는 많이 틀린 종류의 비중을 늘린다(최대 3배).
export function weightedPick(mix, weak, rand) {
  const entries = Object.entries(mix).map(([kind, w]) => [kind, w * (Object.keys(mix).length > 1 ? Math.min(3, 1 + (weak?.[kind] || 0) * 0.5) : 1)]);
  let r = rand() * entries.reduce((s, [, w]) => s + w, 0);
  for (const [kind, w] of entries) if ((r -= w) <= 0) return kind;
  return entries[0][0];
}

export function seededRandom(seed) {
  let a = seed >>> 0 || 1;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const shuffle = (items, rand) => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  return out;
};
export const randInt = (lo, hi, rand) => lo + Math.floor(rand() * (hi - lo + 1));

// 같은 문제를 한 판에 두 번 내지 않고, 지난 판에 나온 문제도 되도록 피한다.
export function fillLevel(count, make, recent = []) {
  const seen = new Set(recent), out = [];
  for (let guard = 0; out.length < count && guard < count * 60; guard++) {
    const p = make(out.length);
    if (!p) continue;
    if (seen.has(p.key) && guard < count * 40) continue;
    seen.add(p.key);
    out.push(p);
  }
  return out.map((p, index) => ({ ...p, index }));
}

function readProgress(key) {
  try {
    const v = JSON.parse(localStorage.getItem(key) || "{}");
    return { unlocked: Math.max(1, Number(v.unlocked) || 1), stars: v.stars || {}, weak: v.weak || {}, recent: v.recent || {}, plays: Number(v.plays) || 0 };
  } catch { return { unlocked: 1, stars: {}, weak: {}, recent: {}, plays: 0 }; }
}
function writeProgress(key, progress) {
  try { localStorage.setItem(key, JSON.stringify(progress)); } catch { /* 저장이 막혀도 이번 판은 계속 */ }
}

export function mountLevelGame(host, game, { single = true, onQuestions = null, saved = {} } = {}) {
  const PROGRESS_KEY = `fc-game-${game.id}-progress`;
  const progress = readProgress(PROGRESS_KEY);
  const sound = createSound();
  const master = game.levels.length;
  let problem = null, wrong = 0, phase = "play", advanceTimer = 0, stopConfetti = () => {}, busy = false, disposed = false, finishHtml = "", lastInfo = null;

  function startLevel(level) {
    const run = game.build(level, { seed: Date.now() ^ (level * 7919), weak: progress.weak, recent: progress.recent[level] || [] });
    Object.assign(saved, { level, run, index: 0, results: [], streak: 0, best: 0, intro: true });
  }
  if (!saved.run) startLevel(Math.min(progress.unlocked, master));

  host.innerHTML = `<div class="cg lg" data-game="${esc(game.id)}">
    <header class="cg-top">
      <button type="button" class="cg-level" data-game-levels><span class="cg-level-no" data-game-level-no></span><span class="cg-level-name" data-game-level-name></span><span class="cg-level-more" aria-hidden="true">▾</span></button>
      <ol class="cg-track" aria-label="이번 레벨 진행"></ol>
      <div class="cg-score" aria-live="polite"><span class="cg-stars" title="이번 레벨에서 모은 별"><b data-game-stars>0</b></span><span class="cg-streak" data-game-streak hidden></span></div>
      <button type="button" class="cg-sound" data-game-sound aria-pressed="${sound.on}" title="소리"><span class="cg-sound-icon" aria-hidden="true"></span><span class="cg-sr">소리 ${sound.on ? "끄기" : "켜기"}</span></button>
    </header>
    <div class="cg-main">
      <section class="cg-board lg-board">
        <p class="cg-mission" data-game-mission></p>
        <div class="lg-stage" data-game-stage></div>
        <canvas class="cg-confetti" aria-hidden="true"></canvas>
      </section>
      <aside class="cg-side">
        <div class="cg-coach" data-coach="start"><img src="./docssam-guide.webp" alt="" width="88" height="88"><p role="status" aria-live="polite" aria-atomic="true"><strong>독쌤</strong><span data-game-say></span></p></div>
        <div class="cg-controls" data-game-controls></div>
        <div class="lg-after" data-game-after></div>
      </aside>
    </div>
    <div class="cg-overlay" data-game-overlay hidden></div>
  </div>`;
  const root = host.querySelector(".cg");
  const $ = (sel) => root.querySelector(sel);
  const board = game.createBoard({ stage: $("[data-game-stage]"), controls: $("[data-game-controls]"), sound, root });

  const points = () => saved.results.reduce((sum, r) => sum + (r?.stars || 0), 0);
  const overlayOpen = () => !$("[data-game-overlay]").hidden;
  const say = (text, mood = "start") => {
    $("[data-game-say]").textContent = text;
    const coach = $(".cg-coach");
    coach.dataset.coach = mood;
    coach.querySelector("img").src = `./docssam-${mood === "good" ? "praise" : mood === "bad" ? "thinking" : "guide"}.webp`;
  };
  const starRow = (n, max = 3) => `<span class="cg-starrow" aria-label="별 ${n}개">${"★".repeat(n)}<i>${"★".repeat(max - n)}</i></span>`;
  const celebrate = () => { stopConfetti(); const box = $("[data-game-stage]").getBoundingClientRect(); stopConfetti = confetti($(".cg-confetti"), { x: box.left + box.width / 2, y: box.top + box.height / 2, r: Math.min(box.width, box.height) / 2 }); };

  function renderChrome() {
    const spec = levelSpecOf(game, saved.level);
    $("[data-game-level-no]").textContent = spec.endless ? "∞" : String(saved.level);
    $("[data-game-level-name]").textContent = spec.endless ? spec.title : `레벨 ${saved.level} · ${spec.title}`;
    $(".cg-track").innerHTML = saved.run.map((p) => {
      const r = saved.results[p.index];
      const cls = r ? (r.stars === 2 ? "s2" : r.stars === 1 ? "s1" : "s0") : p.index === saved.index && problem ? "now" : "";
      return `<li class="${cls}" aria-label="${p.index + 1}번 ${r ? `점수 ${r.stars}` : "남음"}"></li>`;
    }).join("");
    $("[data-game-stars]").textContent = String(points());
    const streak = $("[data-game-streak]");
    streak.hidden = saved.streak < 2;
    streak.textContent = `연속 ${saved.streak}번`;
    root.dataset.level = String(saved.level);
  }
  function setPhase(next) { phase = next; root.dataset.phase = next; }
  function renderAfter() {
    const last = saved.index === saved.run.length - 1;
    $("[data-game-after]").innerHTML = phase === "correct" || phase === "revealed" ? `<button type="button" class="cg-next" data-game-next>${last ? "결과 보기" : "다음 문제"}<span aria-hidden="true">▶</span></button>` : "";
  }

  const api = {
    answer(correct, info) {
      if (disposed || !problem || !["play", "wrong"].includes(phase)) return;
      lastInfo = info;
      if (correct) solved(); else missed(info);
    },
    say: (text, mood) => say(text, mood),
    busy(on) { busy = on; root.dataset.busy = on ? "true" : "false"; }
  };

  function load() {
    clearTimeout(advanceTimer);
    stopConfetti();
    if (saved.index >= saved.run.length) { finishLevel(); return; }
    problem = saved.run[saved.index];
    wrong = 0; busy = false; lastInfo = null;
    setPhase("play");
    Object.assign(root.dataset, { kind: problem.kind, problem: String(problem.index), key: problem.key });
    root.fcProblem = problem; // 검사용(화면에 보이지 않는 DOM 속성)
    $("[data-game-mission]").innerHTML = game.mission(problem);
    board.show(problem, api);
    say(game.coach(problem));
    renderChrome();
    renderAfter();
    if (saved.intro) showLevelIntro();
  }

  function showLevelIntro() {
    saved.intro = false;
    const spec = levelSpecOf(game, saved.level);
    const overlay = $("[data-game-overlay]");
    overlay.innerHTML = `<div class="cg-banner" role="dialog" aria-modal="false" aria-labelledby="lg-banner-title"><span class="cg-banner-kicker">${spec.endless ? "끝없는 도전" : `레벨 ${saved.level}`}</span><h3 id="lg-banner-title">${esc(spec.title)}</h3><p>${esc(spec.rule)}</p><p class="cg-banner-sub">문제 ${saved.run.length}개 · 60% 넘게 맞히면 다음 레벨이 열려요</p><button type="button" class="cg-primary" data-game-go>시작!</button></div>`;
    overlay.hidden = false;
    overlay.querySelector("[data-game-go]").focus({ preventScroll: true });
  }

  function showLevelMap() {
    const overlay = $("[data-game-overlay]");
    const tiles = [];
    for (let level = 1; level <= Math.max(master + 1, progress.unlocked); level++) {
      const spec = levelSpecOf(game, level), open = level <= progress.unlocked, stars = progress.stars[level] || 0;
      tiles.push(`<button type="button" class="cg-tile ${level === saved.level ? "current" : ""} ${spec.endless ? "endless" : ""}" data-game-pick-level="${level}" ${open ? "" : "disabled"} aria-label="${spec.endless ? spec.title : `레벨 ${level} ${spec.title}`}${open ? "" : " 잠김"}"><b>${spec.endless ? "∞" + (level - master) : level}</b><span>${esc(spec.endless ? `${spec.count}문제` : spec.title)}</span>${open ? starRow(stars) : '<span class="cg-lock" aria-hidden="true">🔒</span>'}</button>`);
    }
    overlay.innerHTML = `<div class="cg-banner cg-map" role="dialog" aria-modal="false" aria-labelledby="lg-map-title"><h3 id="lg-map-title">레벨 고르기</h3><p>연습할수록 레벨이 늘어나요. ${master}을 넘으면 끝없는 도전!</p><div class="cg-tiles">${tiles.join("")}</div><div class="cg-actions"><button type="button" class="cg-secondary" data-game-close>계속하기</button></div></div>`;
    overlay.hidden = false;
    overlay.querySelector(".cg-tile.current,[data-game-close]").focus({ preventScroll: true });
  }

  function noteKind(firstTry) {
    const w = progress.weak[problem.kind] || 0;
    progress.weak[problem.kind] = firstTry ? Math.max(0, w - 1) : Math.min(6, w + 1);
  }

  function solved() {
    const stars = wrong === 0 ? 2 : 1;
    saved.results[problem.index] = { stars, tries: wrong + 1 };
    if (!wrong) noteKind(true);
    saved.streak = stars === 2 ? saved.streak + 1 : 0;
    saved.best = Math.max(saved.best, saved.streak);
    setPhase("correct");
    board.lock(true);
    sound.good();
    celebrate();
    say(`${game.success(problem, lastInfo)}${stars === 2 ? " ★★" : " ★"}`, "good");
    renderChrome();
    renderAfter();
    const score = root.querySelector(".cg-score");
    score.classList.remove("bump"); void root.offsetWidth; score.classList.add("bump");
    $("[data-game-next]")?.focus({ preventScroll: true });
    if (!reduced()) {
      const at = saved.index;
      advanceTimer = setTimeout(() => { if (!disposed && saved.index === at && phase === "correct" && !overlayOpen()) next(); }, ADVANCE_MS);
    }
  }

  function missed(info) {
    wrong++;
    if (wrong === 1) noteKind(false);
    sound.bad();
    root.classList.remove("lg-shake"); void root.offsetWidth; if (!reduced()) root.classList.add("lg-shake");
    if (wrong < 2) {
      setPhase("wrong");
      say(game.hint(problem, info), "bad");
      return;
    }
    saved.results[problem.index] = { stars: 0, tries: 2 };
    saved.streak = 0;
    setPhase("revealing");
    board.lock(true);
    say("괜찮아. 어떻게 푸는지 같이 보자.", "bad");
    board.reveal(problem, () => {
      if (disposed) return;
      setPhase("revealed");
      say(game.reveal(problem), "bad");
      renderChrome();
      renderAfter();
      $("[data-game-next]")?.focus({ preventScroll: true });
    });
  }

  function next() { clearTimeout(advanceTimer); saved.index++; load(); }

  function finishLevel() {
    problem = null;
    setPhase("done");
    board.lock(true);
    renderChrome();
    renderAfter();
    const got = points(), result = levelResult(got, saved.run.length), level = saved.level;
    progress.plays++;
    progress.stars[level] = Math.max(progress.stars[level] || 0, result.stars);
    progress.recent[level] = saved.run.map((p) => p.key);
    const unlockedNow = result.passed && progress.unlocked === level;
    if (result.passed) progress.unlocked = Math.max(progress.unlocked, level + 1);
    writeProgress(PROGRESS_KEY, progress);
    const spec = levelSpecOf(game, level), nextSpec = levelSpecOf(game, level + 1);
    const overlay = $("[data-game-overlay]");
    overlay.innerHTML = `<div class="cg-banner cg-finish" role="dialog" aria-modal="false" aria-labelledby="lg-finish-title">
      <div class="cg-result-stars ${result.stars ? "" : "none"}" aria-hidden="true">${starRow(result.stars)}</div>
      <h3 id="lg-finish-title">${result.passed ? `${spec.endless ? spec.title : `레벨 ${level}`} 통과!` : "조금만 더!"}</h3>
      <p>${saved.run.length}문제 중 ${saved.results.filter((r) => r?.stars === 2).length}문제를 한 번에 맞혔어요. 가장 긴 연속 정답은 ${saved.best}번.</p>
      ${unlockedNow ? `<p class="cg-unlock">🔓 새로 열림: ${esc(nextSpec.endless ? nextSpec.title : `레벨 ${level + 1} · ${nextSpec.title}`)}</p>` : ""}
      ${result.passed ? "" : '<p class="cg-banner-sub">60% 넘게 맞히면 다음 레벨이 열려요. 틀린 종류가 더 자주 나와요.</p>'}
      <div class="cg-actions">${result.passed ? '<button type="button" class="cg-primary" data-game-next-level>다음 레벨</button>' : ""}<button type="button" class="${result.passed ? "cg-secondary" : "cg-primary"}" data-game-restart>${result.passed ? "같은 레벨 한 번 더" : "다시 도전"}</button><button type="button" class="cg-secondary" data-game-levels>레벨 고르기</button>${single || !onQuestions ? "" : '<button type="button" class="cg-secondary" data-game-questions>연결 문제 풀기</button>'}</div>
    </div>`;
    finishHtml = overlay.innerHTML;
    overlay.hidden = false;
    say(result.stars === 3 ? "완벽해! 다음 레벨도 해 볼까?" : result.passed ? "잘했어! 별을 더 모아 볼 수도 있어." : "괜찮아. 한 번 더 하면 더 잘할 거야.", result.passed ? "good" : "bad");
    if (result.passed) { sound.stage(); celebrate(); }
    overlay.querySelector("button").focus({ preventScroll: true });
  }

  function begin(level) {
    clearTimeout(advanceTimer);
    $("[data-game-overlay]").hidden = true;
    startLevel(level);
    load();
  }

  root.addEventListener("click", (event) => {
    const target = event.target.closest("button");
    if (!target || !root.contains(target) || target.disabled) return;
    const d = target.dataset;
    if (d.gameSound !== undefined) {
      const on = sound.toggle();
      target.setAttribute("aria-pressed", String(on));
      target.querySelector(".cg-sr").textContent = `소리 ${on ? "끄기" : "켜기"}`;
    } else if (d.gameGo !== undefined || d.gameClose !== undefined) {
      if (phase === "done" && finishHtml) { $("[data-game-overlay]").innerHTML = finishHtml; $("[data-game-overlay] button")?.focus({ preventScroll: true }); return; }
      $("[data-game-overlay]").hidden = true;
      root.querySelector("[data-game-controls] button:not(:disabled),[data-game-stage] button:not(:disabled)")?.focus({ preventScroll: true });
    } else if (d.gameLevels !== undefined) showLevelMap();
    else if (d.gamePickLevel !== undefined) begin(Number(d.gamePickLevel));
    else if (d.gameNextLevel !== undefined) begin(saved.level + 1);
    else if (d.gameRestart !== undefined) begin(saved.level);
    else if (d.gameNext !== undefined) next();
    else if (d.gameQuestions !== undefined) onQuestions?.();
  });

  if (saved.index >= saved.run.length) finishLevel(); else load();
  return {
    dispose() {
      if (disposed) return;
      disposed = true;
      clearTimeout(advanceTimer);
      stopConfetti();
      board.dispose();
      sound.dispose();
      host.innerHTML = "";
    }
  };
}
