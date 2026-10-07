import { createSound, confetti, esc, reduced } from "./golden-bell-game-fx.js?v=20261004a";
import { createDial } from "./golden-bell-clock-dial.js?v=20261004b";
import { buildLevel, levelSpec, levelResult, checkTurn, checkNumber, checkChoice, missionText, hintText, successText, turnAmountText, opText, landing, landingAfter, starsFor, josa, MAX_FREE_TURNS, MASTER_LEVEL, AMOUNT_NAMES } from "./golden-bell-clock-game-model.js?v=20261004b";

// 1권 「시계 바늘 돌리기」 게임. 연습할수록 늘어난다:
//   레벨 1~10은 정해진 길(직접 돌리기 → 예측 → 거꾸로 → 두 번 → 섞기 → 바늘 없이 → 세 번 → 마스터),
//   11부터는 끝없는 도전(깰 때마다 문제 2개씩 증가). 60% 이상이면 다음 레벨이 열린다.
//   진행(열린 레벨·별·자주 틀리는 종류)은 이 기기에 저장되고, 틀린 종류는 섞는 레벨에서 더 자주 나온다.
//   레벨 1은 원본 체험 3도전으로 시작한다.
// 처음 틀리면 독쌤이 생각할 길만 주고, 두 번 틀리면 바늘이 천천히 돌아 정답을 보여 준다.
// 이 게임은 원본 문항의 채점이나 학습 기록을 건드리지 않는다.

const PROGRESS_KEY = "fc-clock-game-progress";

function readProgress() {
  try {
    const value = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
    return { unlocked: Math.max(1, Number(value.unlocked) || 1), stars: value.stars || {}, weak: value.weak || {}, recent: value.recent || {}, plays: Number(value.plays) || 0 };
  } catch { return { unlocked: 1, stars: {}, weak: {}, recent: {}, plays: 0 }; }
}
function writeProgress(progress) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); } catch { /* 저장이 막혀도 이번 판은 계속 */ }
}
const ADVANCE_MS = 1900;

const turnIcon = (dir) => dir > 0
  ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4a8 8 0 1 1-7.4 5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M12 1v6l4-3z" fill="currentColor"/></svg>'
  : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4a8 8 0 1 0 7.4 5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M12 1v6L8 4z" fill="currentColor"/></svg>';

export function mountClockGame(host, { single = true, onQuestions = null, saved = {} } = {}) {
  const progress = readProgress();
  const sound = createSound();
  let problem = null, quarters = 0, wrong = 0, phase = "play", picked = [], advanceTimer = 0, stopConfetti = () => {}, busy = false, disposed = false, finishHtml = "";

  function startLevel(level) {
    const run = buildLevel(level, { seed: Date.now() ^ (level * 7919), weak: progress.weak, recent: progress.recent[level] || [] });
    Object.assign(saved, { level, run, index: 0, results: [], streak: 0, best: 0, intro: true });
  }
  if (!saved.run) startLevel(Math.min(progress.unlocked, MASTER_LEVEL));

  host.innerHTML = `<div class="cg">
    <header class="cg-top">
      <button type="button" class="cg-level" data-clock-levels><span class="cg-level-no" data-clock-level-no></span><span class="cg-level-name" data-clock-level-name></span><span class="cg-level-more" aria-hidden="true">▾</span></button>
      <ol class="cg-track" aria-label="이번 레벨 진행"></ol>
      <div class="cg-score" aria-live="polite"><span class="cg-stars" title="이번 레벨에서 모은 별"><b data-clock-stars>0</b></span><span class="cg-streak" data-clock-streak hidden></span></div>
      <button type="button" class="cg-sound" data-clock-sound aria-pressed="${sound.on}" title="소리"><span class="cg-sound-icon" aria-hidden="true"></span><span class="cg-sr">소리 ${sound.on ? "끄기" : "켜기"}</span></button>
    </header>
    <div class="cg-main">
      <section class="cg-board">
        <p class="cg-mission" data-clock-mission></p>
        <div class="cg-dial-host"></div>
        <div class="cg-legend" aria-hidden="true"><span class="lg-start">출발</span><span class="lg-cw">시계 방향</span><span class="lg-ccw">반대 방향</span><span class="lg-gem">반의 반 바퀴마다 ◆</span></div>
        <canvas class="cg-confetti" aria-hidden="true"></canvas>
      </section>
      <aside class="cg-side">
        <div class="cg-coach" data-coach="start"><img src="./docssam-guide.webp" alt="" width="88" height="88"><p role="status" aria-live="polite" aria-atomic="true"><strong>독쌤</strong><span data-clock-say></span></p></div>
        <div class="cg-controls" data-clock-controls></div>
      </aside>
    </div>
    <div class="cg-overlay" data-clock-overlay hidden></div>
  </div>`;
  const root = host.querySelector(".cg");
  const $ = (sel) => root.querySelector(sel);
  const dial = createDial($(".cg-dial-host"), { onTick: () => sound.tick() });
  root.dataset.renderer = dial.renderer;

  const points = () => saved.results.reduce((sum, r) => sum + (r?.stars || 0), 0);
  const overlayOpen = () => !$("[data-clock-overlay]").hidden;
  const say = (text, mood = "start") => {
    $("[data-clock-say]").textContent = text;
    const coach = $(".cg-coach");
    coach.dataset.coach = mood;
    coach.querySelector("img").src = `./docssam-${mood === "good" ? "praise" : mood === "bad" ? "thinking" : "guide"}.webp`;
  };
  const starRow = (n, max = 3) => `<span class="cg-starrow" aria-label="별 ${n}개">${"★".repeat(n)}<i>${"★".repeat(max - n)}</i></span>`;

  function renderChrome() {
    const spec = levelSpec(saved.level);
    $("[data-clock-level-no]").textContent = spec.endless ? "∞" : String(saved.level);
    $("[data-clock-level-name]").textContent = spec.endless ? spec.title : `레벨 ${saved.level} · ${spec.title}`;
    $(".cg-track").innerHTML = saved.run.map((p) => {
      const r = saved.results[p.index];
      const cls = r ? (r.stars === 2 ? "s2" : r.stars === 1 ? "s1" : "s0") : p.index === saved.index && problem ? "now" : "";
      return `<li class="${cls}" aria-label="${p.index + 1}번 ${r ? `점수 ${r.stars}` : "남음"}"></li>`;
    }).join("");
    $("[data-clock-stars]").textContent = String(points());
    const streak = $("[data-clock-streak]");
    streak.hidden = saved.streak < 2;
    streak.textContent = `연속 ${saved.streak}번`;
    root.dataset.level = String(saved.level);
  }

  function controlsHtml() {
    if (phase === "correct" || phase === "revealed") {
      const last = saved.index === saved.run.length - 1;
      return `<button type="button" class="cg-next" data-clock-next>${last ? "결과 보기" : "다음 문제"}<span aria-hidden="true">▶</span></button>`;
    }
    if (problem.stage === "turn") {
      return `<div class="cg-turns">
        <button type="button" class="cg-turn ccw" data-clock-turn="-1" aria-label="시계 반대 방향으로 반의 반 바퀴" ${busy || quarters <= -MAX_FREE_TURNS ? "disabled" : ""}>${turnIcon(-1)}<span>반대 방향<small>반의 반 바퀴</small></span></button>
        <button type="button" class="cg-turn cw" data-clock-turn="1" aria-label="시계 방향으로 반의 반 바퀴" ${busy || quarters >= MAX_FREE_TURNS ? "disabled" : ""}>${turnIcon(1)}<span>시계 방향<small>반의 반 바퀴</small></span></button>
      </div>
      <p class="cg-readout" data-clock-readout><span>돌린 양</span><strong>${esc(turnAmountText(quarters))}</strong><em>${"◆".repeat(Math.min(Math.abs(quarters), 8)) || "&nbsp;"}</em></p>
      <p class="cg-drag-tip">바늘을 손가락으로 끌어도 돌아가요.</p>
      <div class="cg-actions"><button type="button" class="cg-secondary" data-clock-reset ${busy || !quarters ? "disabled" : ""}>처음 자리로</button><button type="button" class="cg-primary" data-clock-check ${busy || !quarters ? "disabled" : ""}>확인!</button></div>`;
    }
    if (problem.stage === "reverse") {
      return `<p class="cg-ask">맞는 명령 카드를 고르세요.</p><div class="cg-cards">${problem.choices.map((op) => `<button type="button" class="cg-card ${op > 0 ? "cw" : "ccw"}" data-clock-choice="${op}" ${busy || picked.includes(op) ? "disabled" : ""} ${picked.includes(op) ? 'data-state="bad"' : ""}>${turnIcon(Math.sign(op))}<span>${op > 0 ? "시계 방향" : "시계 반대 방향"}<strong>${AMOUNT_NAMES[Math.abs(op)]}</strong></span></button>`).join("")}</div>`;
    }
    const steps = problem.ops.length > 1 ? `<ol class="cg-steps">${problem.ops.map((op) => `<li>${esc(opText(op))}</li>`).join("")}</ol>` : "";
    return `<p class="cg-ask">${problem.hidden ? "바늘이 숨었어요! " : ""}${problem.ops.length > 1 ? "모두 돌린 뒤의 숫자를" : "바늘이 도착할 숫자를"} 시계에서 눌러 고르세요.</p>${steps}`;
  }

  function renderControls() {
    $("[data-clock-controls]").innerHTML = controlsHtml();
    root.dataset.phase = phase;
  }

  function load() {
    clearTimeout(advanceTimer);
    stopConfetti();
    if (saved.index >= saved.run.length) { finishLevel(); return; }
    problem = saved.run[saved.index];
    quarters = 0; wrong = 0; phase = "play"; picked = []; busy = false;
    Object.assign(root.dataset, { stage: problem.stage, problem: String(problem.index), start: String(problem.start), ops: problem.ops.join(","), hidden: problem.hidden ? "true" : "false" });
    $("[data-clock-mission]").innerHTML = esc(missionText(problem)).replace(/(시계 반대 방향|시계 방향)/gu, (m) => `<b class="${m === "시계 방향" ? "cw" : "ccw"}">${m}</b>`);
    dial.reset(problem.start, { target: problem.stage === "reverse" ? problem.answer : null });
    dial.setHidden(Boolean(problem.hidden));
    dial.setDraggable(problem.stage === "turn", (delta) => setQuarters(quarters + delta, false));
    dial.setPickable(["predict", "chain"].includes(problem.stage), pickNumber);
    say(problem.hidden ? "바늘이 숨었어! 회색 출발 바늘에서 머릿속으로 돌려 봐." : ({
      turn: "회색 바늘이 출발 자리야. 빨간 바늘을 돌려서 명령대로 맞춰 봐.",
      predict: "머릿속으로 먼저 돌려 봐. 반의 반 바퀴마다 보석 하나야.",
      reverse: "초록 바늘이 도착한 자리야. 어느 쪽으로 얼마나 돌렸을까?",
      chain: "첫 번째 명령으로 간 자리를 먼저 찾고, 거기서 다음 명령으로!"
    })[problem.stage]);
    renderChrome();
    renderControls();
    if (saved.intro) showLevelIntro();
  }

  function showLevelIntro() {
    saved.intro = false;
    const spec = levelSpec(saved.level);
    const overlay = $("[data-clock-overlay]");
    overlay.innerHTML = `<div class="cg-banner" role="dialog" aria-modal="false" aria-labelledby="cg-banner-title"><span class="cg-banner-kicker">${spec.endless ? "끝없는 도전" : `레벨 ${saved.level}`}</span><h3 id="cg-banner-title">${esc(spec.title)}</h3><p>${esc(spec.rule)}</p><p class="cg-banner-sub">문제 ${saved.run.length}개 · 60% 넘게 맞히면 다음 레벨이 열려요</p><button type="button" class="cg-primary" data-clock-go>시작!</button></div>`;
    overlay.hidden = false;
    overlay.querySelector("[data-clock-go]").focus({ preventScroll: true });
  }

  function showLevelMap() {
    const overlay = $("[data-clock-overlay]");
    const tiles = [];
    for (let level = 1; level <= Math.max(MASTER_LEVEL + 1, progress.unlocked); level++) {
      const spec = levelSpec(level), open = level <= progress.unlocked, stars = progress.stars[level] || 0;
      tiles.push(`<button type="button" class="cg-tile ${level === saved.level ? "current" : ""} ${spec.endless ? "endless" : ""}" data-clock-pick-level="${level}" ${open ? "" : "disabled"} aria-label="${spec.endless ? spec.title : `레벨 ${level} ${spec.title}`}${open ? "" : " 잠김"}"><b>${spec.endless ? "∞" + (level - MASTER_LEVEL) : level}</b><span>${esc(spec.endless ? `${spec.count}문제` : spec.title)}</span>${open ? starRow(stars) : '<span class="cg-lock" aria-hidden="true">🔒</span>'}</button>`);
    }
    overlay.innerHTML = `<div class="cg-banner cg-map" role="dialog" aria-modal="false" aria-labelledby="cg-map-title"><h3 id="cg-map-title">레벨 고르기</h3><p>연습할수록 레벨이 늘어나요. 10을 넘으면 끝없는 도전!</p><div class="cg-tiles">${tiles.join("")}</div><div class="cg-actions"><button type="button" class="cg-secondary" data-clock-close>계속하기</button></div></div>`;
    overlay.hidden = false;
    overlay.querySelector(".cg-tile.current,[data-clock-close]").focus({ preventScroll: true });
  }

  function setQuarters(next, animate = true) {
    quarters = Math.max(-MAX_FREE_TURNS, Math.min(MAX_FREE_TURNS, next));
    if (animate) { busy = true; renderControls(); dial.turnTo(quarters, { done: () => { busy = false; renderControls(); } }); }
    else dial.turnTo(quarters);
    if (phase === "wrong") phase = "play";
    say(quarters ? `지금 바늘은 ${josa(landing(problem.start, quarters), "을")} 가리켜. ${turnAmountText(quarters)} 돌렸어.` : "처음 자리로 돌아왔어.", "start");
    renderControls();
  }

  function noteKind(correctFirstTry) {
    const w = progress.weak[problem.stage] || 0;
    progress.weak[problem.stage] = correctFirstTry ? Math.max(0, w - 1) : Math.min(6, w + 1);
  }

  function solved() {
    const stars = starsFor(wrong, false);
    saved.results[problem.index] = { stars, tries: wrong + 1 };
    if (!wrong) noteKind(true);
    saved.streak = stars === 2 ? saved.streak + 1 : 0;
    saved.best = Math.max(saved.best, saved.streak);
    phase = "correct";
    dial.setHidden(false);
    dial.mark(problem.answer, "good");
    dial.pulse("good");
    sound.good();
    stopConfetti = confetti($(".cg-confetti"), dial.centerOnPage());
    say(`${successText(problem, picked.at(-1))}${stars === 2 ? " ★★" : " ★"}`, "good");
    renderChrome();
    renderControls();
    root.querySelector(".cg-score").classList.remove("bump"); void root.offsetWidth; root.querySelector(".cg-score").classList.add("bump");
    $("[data-clock-next]")?.focus({ preventScroll: true });
    if (!reduced()) {
      const at = saved.index;
      advanceTimer = setTimeout(() => { if (!disposed && saved.index === at && phase === "correct" && !overlayOpen()) next(); }, ADVANCE_MS);
    }
  }

  function missed(attempt) {
    wrong++;
    if (wrong === 1) noteKind(false);
    sound.bad();
    dial.pulse("bad");
    if (wrong < 2) {
      phase = "wrong";
      say(hintText(problem, attempt), "bad");
      renderControls();
      return;
    }
    // 두 번째로 틀리면 바늘이 천천히 돌며 정답 길을 보여 준다.
    saved.results[problem.index] = { stars: 0, tries: 2 };
    saved.streak = 0;
    phase = "revealing"; busy = true;
    dial.setPickable(false); dial.setDraggable(false); dial.setHidden(false);
    root.dataset.phase = phase;
    $("[data-clock-controls]").innerHTML = '<p class="cg-ask">바늘이 어떻게 도는지 같이 보자.</p>';
    say("괜찮아. 바늘이 어떻게 도는지 같이 보자.", "bad");
    showPath(() => {
      busy = false; phase = "revealed";
      dial.mark(problem.answer, "good");
      say(`정답은 ${josa(problem.answer, "이")}야. ${problem.stage === "turn" ? `${opText(problem.ops[0])} 돌리면 돼.` : problem.stage === "reverse" ? `${opText(problem.ops[0])} 돌렸어.` : "보석을 세면서 다시 따라가 봐."}`, "bad");
      renderChrome(); renderControls();
      $("[data-clock-next]")?.focus({ preventScroll: true });
    });
  }

  // 정답 길: 명령마다 한 구간씩 돌고, 구간 사이에 멈춘 자리를 표시한다. 회색 출발 바늘은 처음 자리에 둔다.
  function showPath(done) {
    let at = problem.start, i = 0;
    const leg = () => {
      if (disposed) return;
      if (i >= problem.ops.length) { done(); return; }
      const op = problem.ops[i++];
      dial.reset(at, { target: problem.stage === "reverse" ? problem.answer : null, ghost: problem.start });
      for (let k = 0; k < i - 1; k++) dial.mark(landingAfter(problem.start, problem.ops.slice(0, k + 1)), "mid");
      dial.turnTo(op, { slow: true, done: () => {
        at = landing(at, op);
        if (i < problem.ops.length) { dial.mark(at, "mid"); setTimeout(leg, reduced() ? 0 : 420); } else leg();
      } });
    };
    leg();
  }

  function pickNumber(value) {
    if (busy || !["play", "wrong"].includes(phase)) return;
    if (checkNumber(problem, value)) {
      busy = true;
      dial.setPickable(false);
      dial.setHidden(false);
      dial.mark(value, "pick");
      showPath(() => { busy = false; solved(); });
      return;
    }
    dial.mark(value, "bad");
    missed();
  }

  function chooseCard(op) {
    if (busy || !["play", "wrong"].includes(phase)) return;
    picked.push(op);
    if (checkChoice(problem, op)) {
      busy = true; renderControls();
      dial.reset(problem.start, { target: problem.answer });
      dial.turnTo(op, { done: () => { busy = false; solved(); } });
      return;
    }
    missed();
  }

  function next() {
    clearTimeout(advanceTimer);
    saved.index++;
    load();
  }

  function finishLevel() {
    problem = null;
    root.dataset.phase = "done";
    root.dataset.stage = "done";
    dial.setPickable(false); dial.setDraggable(false);
    renderChrome();
    const got = points(), result = levelResult(got, saved.run.length), level = saved.level;
    progress.plays++;
    progress.stars[level] = Math.max(progress.stars[level] || 0, result.stars);
    progress.recent[level] = saved.run.map((p) => p.key);
    const unlockedNow = result.passed && progress.unlocked === level;
    if (result.passed) progress.unlocked = Math.max(progress.unlocked, level + 1);
    writeProgress(progress);
    const spec = levelSpec(level), nextSpec = levelSpec(level + 1);
    const overlay = $("[data-clock-overlay]");
    overlay.innerHTML = `<div class="cg-banner cg-finish" role="dialog" aria-modal="false" aria-labelledby="cg-finish-title">
      <div class="cg-result-stars ${result.stars ? "" : "none"}" aria-hidden="true">${starRow(result.stars)}</div>
      <h3 id="cg-finish-title">${result.passed ? `${spec.endless ? spec.title : `레벨 ${level}`} 통과!` : "조금만 더!"}</h3>
      <p>${saved.run.length}문제 중 ${saved.results.filter((r) => r?.stars === 2).length}문제를 한 번에 맞혔어요. 가장 긴 연속 정답은 ${saved.best}번.</p>
      ${unlockedNow ? `<p class="cg-unlock">🔓 새로 열림: ${esc(nextSpec.endless ? nextSpec.title : `레벨 ${level + 1} · ${nextSpec.title}`)}</p>` : ""}
      ${result.passed ? "" : '<p class="cg-banner-sub">60% 넘게 맞히면 다음 레벨이 열려요. 틀린 종류가 더 자주 나와요.</p>'}
      <div class="cg-actions">${result.passed ? '<button type="button" class="cg-primary" data-clock-next-level>다음 레벨</button>' : ""}<button type="button" class="${result.passed ? "cg-secondary" : "cg-primary"}" data-clock-restart>${result.passed ? "같은 레벨 한 번 더" : "다시 도전"}</button><button type="button" class="cg-secondary" data-clock-levels>레벨 고르기</button>${single || !onQuestions ? "" : '<button type="button" class="cg-secondary" data-clock-questions>연결 문제 풀기</button>'}</div>
    </div>`;
    finishHtml = overlay.innerHTML;
    overlay.hidden = false;
    $("[data-clock-controls]").innerHTML = "";
    say(result.stars === 3 ? "완벽해! 다음 레벨도 해 볼까?" : result.passed ? "잘했어! 별을 더 모아 볼 수도 있어." : "괜찮아. 한 번 더 하면 더 잘할 거야.", result.passed ? "good" : "bad");
    if (result.passed) { sound.stage(); stopConfetti = confetti($(".cg-confetti"), dial.centerOnPage()); }
    overlay.querySelector("button").focus({ preventScroll: true });
  }

  function begin(level) {
    clearTimeout(advanceTimer);
    $("[data-clock-overlay]").hidden = true;
    startLevel(level);
    load();
  }

  root.addEventListener("click", (event) => {
    const target = event.target.closest("button");
    if (!target || !root.contains(target) || target.disabled) return;
    const d = target.dataset;
    if (d.clockSound !== undefined) {
      const on = sound.toggle();
      target.setAttribute("aria-pressed", String(on));
      target.querySelector(".cg-sr").textContent = `소리 ${on ? "끄기" : "켜기"}`;
    } else if (d.clockGo !== undefined || d.clockClose !== undefined) {
      // 레벨을 다 푼 뒤 지도를 닫으면 결과 화면으로 돌아간다(진행은 다시 저장하지 않는다).
      if (root.dataset.phase === "done" && finishHtml) { $("[data-clock-overlay]").innerHTML = finishHtml; $("[data-clock-overlay] button")?.focus({ preventScroll: true }); return; }
      $("[data-clock-overlay]").hidden = true;
      root.querySelector("[data-clock-turn='1']:not(:disabled),.cg-card:not(:disabled),.cg-pick:not(:disabled),[data-clock-next]")?.focus({ preventScroll: true });
    } else if (d.clockLevels !== undefined) {
      showLevelMap();
    } else if (d.clockPickLevel !== undefined) {
      begin(Number(d.clockPickLevel));
    } else if (d.clockNextLevel !== undefined) {
      begin(saved.level + 1);
    } else if (d.clockRestart !== undefined) {
      begin(saved.level);
    } else if (d.clockTurn !== undefined) {
      sound.tick();
      setQuarters(quarters + Number(d.clockTurn));
    } else if (d.clockReset !== undefined) {
      setQuarters(0);
    } else if (d.clockCheck !== undefined) {
      if (busy || !quarters) return;
      if (checkTurn(problem, quarters)) { dial.setDraggable(false); solved(); } else missed(quarters);
    } else if (d.clockChoice !== undefined) {
      chooseCard(Number(d.clockChoice));
    } else if (d.clockNext !== undefined) {
      next();
    } else if (d.clockQuestions !== undefined) {
      onQuestions?.();
    }
  });
  // 직접 돌리기에서는 좌우 화살표로도 돌린다.
  root.addEventListener("keydown", (event) => {
    if (problem?.stage !== "turn" || busy || !["play", "wrong"].includes(phase) || overlayOpen()) return;
    if (!["ArrowLeft", "ArrowRight"].includes(event.key) || event.target.closest(".cg-cards,.cg-picks")) return;
    event.preventDefault();
    sound.tick();
    setQuarters(quarters + (event.key === "ArrowRight" ? 1 : -1));
  });

  if (saved.index >= saved.run.length) { saved.index = saved.run.length; finishLevel(); } else load();
  return {
    dispose() {
      if (disposed) return;
      disposed = true;
      clearTimeout(advanceTimer);
      stopConfetti();
      dial.dispose();
      sound.dispose();
      host.innerHTML = "";
    }
  };
}
