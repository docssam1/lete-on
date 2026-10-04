import { createDial } from "./golden-bell-clock-dial.js?v=20261004a";
import { STAGES, buildRun, checkTurn, checkNumber, checkChoice, missionText, hintText, successText, turnAmountText, opText, landing, starsFor, medalFor, josa, MAX_FREE_TURNS, AMOUNT_NAMES } from "./golden-bell-clock-game-model.js?v=20261004a";

// 1권 「시계 바늘 돌리기」를 네 단계 게임으로 만든다.
//   1 직접 돌리기  — 원본 체험 3도전 그대로: 바늘을 끌거나 단추로 돌리고 확인한다.
//   2 어디를 가리킬까 — 말로 된 명령을 듣고 도착할 숫자를 시계에서 누른다.
//   3 어떻게 돌렸을까 — 출발과 도착을 보고 명령 카드를 고른다.
//   4 두 번 돌리기 — 명령 두 개를 이어서 도착할 숫자를 누른다.
// 처음 틀리면 독쌤이 생각할 길만 주고, 두 번 틀리면 바늘이 천천히 돌아 정답을 보여 준다.
// 이 게임은 원본 문항의 채점이나 학습 기록을 건드리지 않는다.

const SOUND_KEY = "fc-clock-game-sound";
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const ADVANCE_MS = 1900;

function createSound() {
  let ctx = null;
  let on = true;
  try { on = localStorage.getItem(SOUND_KEY) !== "off"; } catch { on = true; }
  const tone = (freq, at, length, type = "sine", gain = 0.12) => {
    const osc = ctx.createOscillator(), amp = ctx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(freq, ctx.currentTime + at);
    amp.gain.setValueAtTime(0.0001, ctx.currentTime + at);
    amp.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + at + 0.01);
    amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + at + length);
    osc.connect(amp).connect(ctx.destination);
    osc.start(ctx.currentTime + at); osc.stop(ctx.currentTime + at + length + 0.02);
  };
  const play = (fn) => {
    if (!on) return;
    try {
      ctx ||= new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === "suspended") ctx.resume();
      fn();
    } catch { /* 소리가 안 나도 게임은 계속된다 */ }
  };
  return {
    get on() { return on; },
    toggle() { on = !on; try { localStorage.setItem(SOUND_KEY, on ? "on" : "off"); } catch { /* 저장 못 해도 이번 판은 반영 */ } return on; },
    tick: () => play(() => tone(1500, 0, 0.04, "square", 0.035)),
    good: () => play(() => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.07, 0.22, "triangle", 0.11))),
    bad: () => play(() => { tone(220, 0, 0.18, "sawtooth", 0.05); tone(185, 0.12, 0.22, "sawtooth", 0.05); }),
    stage: () => play(() => [523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.26, "triangle", 0.1))),
    dispose() { try { ctx?.close(); } catch { /* 이미 닫힘 */ } }
  };
}

function confetti(canvas, origin) {
  if (reduced()) return () => {};
  const box = canvas.getBoundingClientRect();
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = box.width * dpr; canvas.height = box.height * dpr;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const colors = ["#ffc53d", "#2f7de1", "#e2504c", "#2fb36b", "#f08a24", "#9b6bdf"];
  const x0 = origin.x - box.left, y0 = origin.y - box.top;
  const parts = Array.from({ length: 70 }, (_, i) => {
    const a = Math.random() * Math.PI * 2, s = 3 + Math.random() * 6;
    return { x: x0 + Math.cos(a) * origin.r * 0.4, y: y0 + Math.sin(a) * origin.r * 0.4, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 4, r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.4, c: colors[i % colors.length], w: 6 + Math.random() * 6, h: 4 + Math.random() * 4 };
  });
  let raf = 0, frames = 0;
  const step = () => {
    ctx.clearRect(0, 0, box.width, box.height);
    for (const p of parts) {
      p.vy += 0.22; p.vx *= 0.985; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
    }
    if (++frames < 90 && canvas.isConnected) raf = requestAnimationFrame(step);
    else ctx.clearRect(0, 0, box.width, box.height);
  };
  raf = requestAnimationFrame(step);
  return () => { cancelAnimationFrame(raf); ctx.clearRect(0, 0, box.width, box.height); };
}

const turnIcon = (dir) => dir > 0
  ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4a8 8 0 1 1-7.4 5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M12 1v6l4-3z" fill="currentColor"/></svg>'
  : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4a8 8 0 1 0 7.4 5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M12 1v6L8 4z" fill="currentColor"/></svg>';

export function mountClockGame(host, { single = true, onQuestions = null, saved = {} } = {}) {
  if (!saved.run) Object.assign(saved, { run: buildRun(), index: 0, results: [], streak: 0, best: 0, introSeen: -1 });
  const sound = createSound();
  let problem = null, quarters = 0, wrong = 0, phase = "play", picked = [], advanceTimer = 0, stopConfetti = () => {}, busy = false, disposed = false;

  host.innerHTML = `<div class="cg">
    <header class="cg-top">
      <ol class="cg-stages" aria-label="단계"></ol>
      <div class="cg-score" aria-live="polite"><span class="cg-stars" title="모은 별"><b data-clock-stars>0</b></span><span class="cg-streak" data-clock-streak hidden></span></div>
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
    <ol class="cg-track" aria-label="진행"></ol>
    <div class="cg-overlay" data-clock-overlay hidden></div>
  </div>`;
  const root = host.querySelector(".cg");
  const $ = (sel) => root.querySelector(sel);
  const dial = createDial($(".cg-dial-host"), { onTick: () => sound.tick() });
  root.dataset.renderer = dial.renderer;

  const totalStars = () => saved.results.reduce((sum, r) => sum + (r?.stars || 0), 0);
  const stageOf = (p) => STAGES.findIndex((s) => s.id === p.stage);
  const say = (text, mood = "start") => {
    $("[data-clock-say]").textContent = text;
    const coach = $(".cg-coach");
    coach.dataset.coach = mood;
    coach.querySelector("img").src = `./docssam-${mood === "good" ? "praise" : mood === "bad" ? "thinking" : "guide"}.webp`;
  };

  function renderChrome() {
    const current = problem ? stageOf(problem) : STAGES.length;
    $(".cg-stages").innerHTML = STAGES.map((stage, i) => {
      const items = saved.run.filter((p) => p.stage === stage.id);
      const got = items.reduce((sum, p) => sum + (saved.results[p.index]?.stars || 0), 0);
      const done = items.every((p) => saved.results[p.index]);
      return `<li class="${i === current ? "now" : done ? "done" : ""}"><span class="cg-stage-no">${i + 1}</span><span class="cg-stage-name">${esc(stage.short)}</span>${done ? `<span class="cg-stage-stars">★${got}</span>` : ""}</li>`;
    }).join("");
    $(".cg-track").innerHTML = saved.run.map((p) => {
      const r = saved.results[p.index];
      const cls = r ? (r.stars === 2 ? "s2" : r.stars === 1 ? "s1" : "s0") : p.index === saved.index && problem ? "now" : "";
      return `<li class="${cls}" aria-label="${p.index + 1}번 ${r ? `별 ${r.stars}개` : "남음"}"></li>`;
    }).join("");
    $("[data-clock-stars]").textContent = String(totalStars());
    const streak = $("[data-clock-streak]");
    streak.hidden = saved.streak < 2;
    streak.textContent = `연속 ${saved.streak}번`;
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
      return `<p class="cg-ask">맞는 명령 카드를 고르세요.</p><div class="cg-cards">${problem.choices.map((op, i) => `<button type="button" class="cg-card ${op > 0 ? "cw" : "ccw"}" data-clock-choice="${op}" ${busy || picked.includes(op) ? "disabled" : ""} ${picked.includes(op) ? 'data-state="bad"' : ""}>${turnIcon(Math.sign(op))}<span>${op > 0 ? "시계 방향" : "시계 반대 방향"}<strong>${AMOUNT_NAMES[Math.abs(op)]}</strong></span></button>`).join("")}</div>`;
    }
    return `<p class="cg-ask">${problem.stage === "chain" ? "두 번 돌린 뒤의 숫자를" : "바늘이 도착할 숫자를"} 시계에서 눌러 고르세요.</p>${problem.stage === "chain" ? `<ol class="cg-steps"><li>${esc(opText(problem.ops[0]))}</li><li>${esc(opText(problem.ops[1]))}</li></ol>` : ""}`;
  }

  function renderControls() {
    $("[data-clock-controls]").innerHTML = controlsHtml();
    root.dataset.phase = phase;
  }

  function load() {
    clearTimeout(advanceTimer);
    stopConfetti();
    if (saved.index >= saved.run.length) { finish(); return; }
    problem = saved.run[saved.index];
    quarters = 0; wrong = 0; phase = "play"; picked = []; busy = false;
    Object.assign(root.dataset, { stage: problem.stage, problem: String(problem.index), start: String(problem.start), ops: problem.ops.join(",") });
    $("[data-clock-mission]").innerHTML = esc(missionText(problem)).replace(/(시계 반대 방향|시계 방향)/gu, (m) => `<b class="${m === "시계 방향" ? "cw" : "ccw"}">${m}</b>`);
    dial.reset(problem.start, { target: problem.stage === "reverse" ? problem.answer : null });
    dial.setDraggable(problem.stage === "turn", (delta) => setQuarters(quarters + delta, false));
    dial.setPickable(["predict", "chain"].includes(problem.stage), pickNumber);
    say(({
      turn: "회색 바늘이 출발 자리야. 빨간 바늘을 돌려서 명령대로 맞춰 봐.",
      predict: "머릿속으로 먼저 돌려 봐. 반의 반 바퀴마다 보석 하나야.",
      reverse: "초록 바늘이 도착한 자리야. 어느 쪽으로 얼마나 돌렸을까?",
      chain: "첫 번째 명령으로 간 자리를 먼저 찾고, 거기서 한 번 더!"
    })[problem.stage]);
    renderChrome();
    renderControls();
    const stageIndex = stageOf(problem);
    if (saved.introSeen < stageIndex) showStageIntro(stageIndex);
  }

  function showStageIntro(stageIndex) {
    saved.introSeen = stageIndex;
    const stage = STAGES[stageIndex];
    const rule = [
      "명령대로 빨간 바늘을 돌려요. 반의 반 바퀴씩 딸깍딸깍!",
      "바늘은 그대로! 명령을 듣고 도착할 숫자를 먼저 맞혀요.",
      "출발과 도착을 보고, 어떤 명령이었는지 카드를 골라요.",
      "명령이 두 개! 차례대로 돌린 뒤 도착할 숫자를 맞혀요."
    ][stageIndex];
    const overlay = $("[data-clock-overlay]");
    overlay.innerHTML = `<div class="cg-banner" role="dialog" aria-modal="false" aria-labelledby="cg-banner-title"><span class="cg-banner-kicker">${stageIndex + 1}단계</span><h3 id="cg-banner-title">${esc(stage.title)}</h3><p>${esc(rule)}</p><button type="button" class="cg-primary" data-clock-go>시작!</button></div>`;
    overlay.hidden = false;
    overlay.querySelector("[data-clock-go]").focus({ preventScroll: true });
  }

  function setQuarters(next, animate = true) {
    quarters = Math.max(-MAX_FREE_TURNS, Math.min(MAX_FREE_TURNS, next));
    if (animate) { busy = true; renderControls(); dial.turnTo(quarters, { done: () => { busy = false; renderControls(); } }); }
    else dial.turnTo(quarters);
    if (phase === "wrong") phase = "play";
    say(quarters ? `지금 바늘은 ${josa(landing(problem.start, quarters), "을")} 가리켜. ${turnAmountText(quarters)} 돌렸어.` : "처음 자리로 돌아왔어.", "start");
    renderControls();
  }

  function solved() {
    const stars = starsFor(wrong, false);
    saved.results[problem.index] = { stars, tries: wrong + 1 };
    saved.streak = stars === 2 ? saved.streak + 1 : 0;
    saved.best = Math.max(saved.best, saved.streak);
    phase = "correct";
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
      advanceTimer = setTimeout(() => { if (!disposed && saved.index === at && phase === "correct") next(); }, ADVANCE_MS);
    }
  }

  function missed(attempt) {
    wrong++;
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
    dial.setPickable(false); dial.setDraggable(false);
    renderControls();
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

  // 정답 길: 한 번 명령이면 한 번에, 두 번 명령이면 중간에 멈춰 표시한 뒤 이어서 돈다.
  function showPath(done) {
    const [first, second] = problem.ops;
    dial.reset(problem.start, { target: problem.stage === "reverse" ? problem.answer : null });
    if (second === undefined) { dial.turnTo(first, { slow: true, done }); return; }
    dial.turnTo(first, { slow: true, done: () => {
      dial.mark(landing(problem.start, first), "mid");
      const pause = reduced() ? 0 : 450;
      setTimeout(() => {
        if (disposed) return;
        dial.reset(landing(problem.start, first), { ghost: problem.start });
        dial.mark(landing(problem.start, first), "mid");
        dial.turnTo(second, { slow: true, done });
      }, pause);
    } });
  }

  function pickNumber(value) {
    if (busy || !["play", "wrong"].includes(phase)) return;
    if (checkNumber(problem, value)) {
      busy = true;
      dial.setPickable(false);
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
    const before = problem ? stageOf(problem) : -1;
    saved.index++;
    if (saved.index < saved.run.length && stageOf(saved.run[saved.index]) !== before) sound.stage();
    load();
  }

  function finish() {
    problem = null;
    root.dataset.phase = "done";
    root.dataset.stage = "done";
    dial.setPickable(false); dial.setDraggable(false);
    renderChrome();
    const stars = totalStars(), total = saved.run.length;
    const medal = medalFor(stars, total);
    const medalName = { gold: "금메달", silver: "은메달", bronze: "동메달" }[medal];
    const overlay = $("[data-clock-overlay]");
    overlay.innerHTML = `<div class="cg-banner cg-finish" role="dialog" aria-modal="false" aria-labelledby="cg-finish-title">
      <div class="cg-medal ${medal}" aria-hidden="true">${stars}</div>
      <h3 id="cg-finish-title">${medalName}! 별 ${stars}개</h3>
      <p>${total}문제 중 ${saved.results.filter((r) => r?.stars === 2).length}문제를 한 번에 맞혔어요. 가장 긴 연속 정답은 ${saved.best}번이에요.</p>
      <ul class="cg-finish-stages">${STAGES.map((stage) => { const items = saved.run.filter((p) => p.stage === stage.id); return `<li><span>${esc(stage.title)}</span><b>★ ${items.reduce((s, p) => s + (saved.results[p.index]?.stars || 0), 0)} / ${items.length * 2}</b></li>`; }).join("")}</ul>
      <div class="cg-actions"><button type="button" class="cg-secondary" data-clock-restart>새 문제로 다시</button>${single || !onQuestions ? "" : '<button type="button" class="cg-primary" data-clock-questions>연결 문제 풀기</button>'}</div>
    </div>`;
    overlay.hidden = false;
    $("[data-clock-controls]").innerHTML = "";
    say(medal === "gold" ? "최고야! 반의 반 바퀴, 반 바퀴, 한 바퀴를 다 잡았어." : "잘했어! 다시 하면 별을 더 모을 수 있어.", "good");
    if (medal !== "bronze") { sound.stage(); stopConfetti = confetti($(".cg-confetti"), dial.centerOnPage()); }
    overlay.querySelector("button").focus({ preventScroll: true });
  }

  root.addEventListener("click", (event) => {
    const target = event.target.closest("button");
    if (!target || !root.contains(target) || target.disabled) return;
    const d = target.dataset;
    if (d.clockSound !== undefined) {
      const on = sound.toggle();
      target.setAttribute("aria-pressed", String(on));
      target.querySelector(".cg-sr").textContent = `소리 ${on ? "끄기" : "켜기"}`;
    } else if (d.clockGo !== undefined) {
      $("[data-clock-overlay]").hidden = true;
      (root.querySelector("[data-clock-turn='1'],.cg-card,.cg-pick:not(:disabled)"))?.focus({ preventScroll: true });
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
    } else if (d.clockRestart !== undefined) {
      Object.assign(saved, { run: buildRun(), index: 0, results: [], streak: 0, best: 0, introSeen: -1 });
      $("[data-clock-overlay]").hidden = true;
      load();
    } else if (d.clockQuestions !== undefined) {
      onQuestions?.();
    }
  });
  // 직접 돌리기 단계에서는 좌우 화살표로도 돌린다(시계를 보고 있을 때).
  root.addEventListener("keydown", (event) => {
    if (problem?.stage !== "turn" || busy || phase === "correct" || phase === "revealed" || phase === "revealing") return;
    if (!$("[data-clock-overlay]").hidden) return;
    if (!["ArrowLeft", "ArrowRight"].includes(event.key) || event.target.closest(".cg-cards,.cg-picks")) return;
    event.preventDefault();
    sound.tick();
    setQuarters(quarters + (event.key === "ArrowRight" ? 1 : -1));
  });

  load();
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
