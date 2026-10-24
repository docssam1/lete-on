// 네 방향 거울 방 — 1권 1단원 「거울에 비친 모양을 찾아요」 게임(학생 차시 덱 study.html 안에 바로 뜬다).
// 원장(2026-10-24): 「링크를 가져오는 거 아냐. 우리 걸 써야 돼. 그걸 발전시켜 우리 학습에 맞는 게임으로.」
//  · 반사·거리 계산은 거울 저택(geometry/games/mirror-manor/levels.js)의 함수를 그대로 쓴다. 생김새(유리 판·법랑 칸·거울선)도
//    거울 저택의 것을 game-mirror-room.css에 옮겨 그렸다(.mr- 안에서만).
//  · 진행은 골든벨 풀이 순서다: 처음 모양을 본다 → 옆 거울은 좌우만, 위아래 거울은 위아래만 바꾼다 → 거울에 가까운 부분은 그대로 가까이.
//    거울마다 ① 무엇이 바뀔지 고르기 ② 거울에 가까운 칸부터 칠하기 ③ 확인. 네 거울을 다 하면 네 방향을 한눈에 본다.
//  · 틀린 칸은 칠하지 않고, 어느 쪽이 틀렸는지만 말한다(거리 / 그대로 있어야 할 자리). 정답 칸을 대신 칠해 주지 않는다.
//  · 모양은 골든벨 문항의 그림이 아니라 이 게임의 것이다(골든벨 정답을 드러내지 않는다).
import { reflectCell, mirrorDistance } from "../../geometry/games/mirror-manor/levels.js?v=mirror-manor-11";

// 처음 모양(4×4 칸 안): 세로 막대 + 위쪽 팔 + 갈고리. 좌우로도 위아래로도 대칭이 아니라 네 거울의 모습이 모두 다르다.
const SHAPE = [[3, 0], [3, 1], [3, 2], [3, 3], [2, 0], [1, 0], [1, 1]];
const MIRRORS = [
  { id: "right", label: "오른쪽 거울", axis: { kind: "vertical", at: 4 }, grid: { cols: 8, rows: 4 }, offset: [0, 0], swap: "lr" },
  { id: "left", label: "왼쪽 거울", axis: { kind: "vertical", at: 4 }, grid: { cols: 8, rows: 4 }, offset: [4, 0], swap: "lr" },
  { id: "top", label: "위쪽 거울", axis: { kind: "horizontal", at: 4 }, grid: { cols: 4, rows: 8 }, offset: [0, 4], swap: "ud" },
  { id: "bottom", label: "아래쪽 거울", axis: { kind: "horizontal", at: 4 }, grid: { cols: 4, rows: 8 }, offset: [0, 0], swap: "ud" }
];
const SWAP = { lr: "왼쪽 ↔ 오른쪽", ud: "위 ↕ 아래" };
const KEEP = { lr: "높이(위아래 자리)", ud: "좌우 자리" };
const STEPS = ["무엇이 바뀔까?", "가까운 칸부터 칠하기", "확인"];
const id = ([x, y]) => `${x},${y}`;
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export function mirrorRound(index) {
  const m = MIRRORS[index];
  const source = SHAPE.map(([x, y]) => [x + m.offset[0], y + m.offset[1]]);
  const targets = source.map((cell) => reflectCell(cell, m.axis));
  return { ...m, source, targets };
}
export const MIRROR_ROUNDS = MIRRORS.length;

// 틀린 칸이 어느 쪽으로 틀렸는지: 거리는 맞는데 그대로 있어야 할 자리가 바뀌었는지, 거리부터 틀렸는지
export function judgeCell(round, cell, painted) {
  const key = id(cell);
  const target = round.targets.find((t) => id(t) === key);
  if (target) {
    if (painted.has(key)) return { kind: "again" };
    const left = round.targets.filter((t) => !painted.has(id(t)));
    const nearest = Math.min(...left.map((t) => mirrorDistance(t, round.axis)));
    const d = mirrorDistance(cell, round.axis);
    if (d > nearest) return { kind: "far", d, nearest };
    const from = round.source.find((s) => id(reflectCell(s, round.axis)) === key);
    return { kind: "ok", d, from };
  }
  const d = mirrorDistance(cell, round.axis);
  const sameDistance = round.source.some((s) => mirrorDistance(s, round.axis) === d);
  return { kind: sameDistance ? "keep" : "distance", d };
}

export function mountMirrorRoom(host, { say = () => {}, onDone = () => {} } = {}) {
  const st = { r: 0, step: 0, painted: new Set(), flash: null, note: "", finale: false, choice: null };
  let alive = true;
  const listening = new AbortController();
  const round = () => mirrorRound(st.r);

  function compass(rIndex, big = false) {
    // 가운데 처음 모양 + 네 거울. 끝낸 거울 너머에는 비친 모양을 그린다.
    const u = big ? 14 : 9, box = 4 * u, gap = big ? 10 : 7, size = box * 3 + gap * 4;
    const o = box + gap * 2;
    const cell = (x, y, cls) => `<rect class="${cls}" x="${x}" y="${y}" width="${u - 1.5}" height="${u - 1.5}" rx="${big ? 3 : 2}"/>`;
    const shapeAt = (cells, ox, oy, cls) => cells.map(([x, y]) => cell(ox + x * u, oy + y * u, cls)).join("");
    const done = (k) => st.finale || k < st.r || (k === st.r && st.step === 2);
    const reflected = { right: SHAPE.map(([x, y]) => [3 - x, y]), left: SHAPE.map(([x, y]) => [3 - x, y]), top: SHAPE.map(([x, y]) => [x, 3 - y]), bottom: SHAPE.map(([x, y]) => [x, 3 - y]) };
    const place = { right: [o + box + gap * 2, o], left: [o - box - gap * 2, o], top: [o, o - box - gap * 2], bottom: [o, o + box + gap * 2] };
    const bar = { right: [o + box + gap - 2, o - 4, 4, box + 8], left: [o - gap - 2, o - 4, 4, box + 8], top: [o - 4, o - gap - 2, box + 8, 4], bottom: [o - 4, o + box + gap - 2, box + 8, 4] };
    const parts = MIRRORS.map((m, k) => {
      const [bx, by, bw, bh] = bar[m.id];
      const on = !st.finale && k === rIndex;
      return `<rect class="mr-c-mirror${on ? " on" : ""}${done(k) ? " done" : ""}" x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="2"/>${done(k) ? shapeAt(reflected[m.id], place[m.id][0], place[m.id][1], "mr-c-paint") : ""}`;
    }).join("");
    return `<svg class="mr-compass${big ? " big" : ""}" viewBox="0 0 ${size} ${size}" role="img" aria-label="가운데 처음 모양과 네 거울"><rect class="mr-c-floor" x="${o - 3}" y="${o - 3}" width="${box + 6}" height="${box + 6}" rx="5"/>${shapeAt(SHAPE, o, o, "mr-c-given")}${parts}</svg>`;
  }

  function board() {
    const rd = round(), { cols, rows } = rd.grid, axis = rd.axis;
    const sourceIds = new Set(rd.source.map(id));
    const cells = [];
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const key = id([x, y]);
      const given = sourceIds.has(key);
      const answerSide = axis.kind === "vertical" ? (rd.offset[0] === 0 ? x >= axis.at : x < axis.at) : (rd.offset[1] === 0 ? y >= axis.at : y < axis.at);
      const cls = ["mr-cell", given ? "given" : "", answerSide ? "answer" : "", st.painted.has(key) ? "painted" : "", st.just === key ? "just" : "", st.flash?.cells?.includes(key) ? `flash-${st.flash.kind}` : ""].filter(Boolean).join(" ");
      const can = answerSide && st.step === 1 && !st.painted.has(key);
      cells.push(`<button type="button" class="${cls}" data-x="${x}" data-y="${y}" ${can ? "" : "disabled"} aria-label="${y + 1}째 줄 ${x + 1}째 칸${given ? " 처음 모양" : st.painted.has(key) ? " 칠함" : ""}"></button>`);
    }
    const line = axis.kind === "vertical" ? `left:${(axis.at / cols) * 100}%` : `top:${(axis.at / rows) * 100}%`;
    const pair = st.flash?.kind === "ok" && st.flash.d ? `<span class="mr-pair" style="${st.flash.pos}">${st.flash.d}칸 ↔ ${st.flash.d}칸</span>` : "";
    return `<div class="mr-room ${axis.kind}"><div class="mr-board" style="--cols:${cols};--rows:${rows}">${cells.join("")}<i class="mr-mirror ${axis.kind}" style="${line}" aria-hidden="true"></i>${pair}</div></div>`;
  }

  function render() {
    if (!alive) return;
    if (st.finale) {
      host.innerHTML = `<div class="mr mr-finale"><div class="mr-finale-art">${compass(-1, true)}</div><div class="mr-finale-copy"><p class="mr-kick">네 방향 거울 방 · 완성</p><h3>네 거울을 모두 완성했어요!</h3>
        <ul class="mr-rules"><li><b>오른쪽 · 왼쪽 거울</b> 왼쪽과 오른쪽만 바뀌고 높이는 그대로</li><li><b>위쪽 · 아래쪽 거울</b> 위와 아래만 바뀌고 좌우는 그대로</li><li><b>거울에 가까운 부분</b> 비친 모양에서도 거울에 가까이</li></ul>
        <div class="mr-actions"><button type="button" class="mr-btn" data-mr="again">처음부터 다시</button><button type="button" class="mr-btn primary" data-mr="done">골든벨 문제로 →</button></div></div></div>`;
      return;
    }
    const rd = round();
    const left = rd.targets.filter((t) => !st.painted.has(id(t))).length;
    const stepBody = st.step === 0
      ? `<p class="mr-q">${esc(rd.label)}에서는 무엇이 바뀔까요?</p><div class="mr-choices">${["lr", "ud"].map((k) => `<button type="button" class="mr-choice${st.choice === k ? " no" : ""}" data-swap="${k}">${SWAP[k]}</button>`).join("")}</div>`
      : st.step === 1
        ? `<p class="mr-q">처음 모양에서 거울에 <b>가까운 칸부터</b> 거울 너머에 칠해요.</p><p class="mr-count">남은 칸 <b>${left}</b></p>`
        : `<p class="mr-q mr-good">${esc(rd.label)} 완성! <b>${SWAP[rd.swap]}</b>만 바뀌고 ${KEEP[rd.swap]}는 그대로예요.</p>`;
    host.innerHTML = `<div class="mr">
      <aside class="mr-side">
        <div class="mr-rounds">${MIRRORS.map((m, k) => `<span class="${k === st.r ? "on" : k < st.r ? "done" : ""}">${k < st.r ? "✓" : k + 1}</span>`).join("")}<em>${esc(rd.label)}</em></div>
        ${compass(st.r)}
        <ol class="mr-steps">${STEPS.map((label, k) => `<li class="${k === st.step ? "on" : k < st.step ? "done" : ""}"><b>${k < st.step ? "✓" : k + 1}</b>${label}</li>`).join("")}</ol>
        <div class="mr-step-body">${stepBody}</div>
        ${st.note ? `<p class="mr-note" role="status">${esc(st.note)}</p>` : ""}
        ${st.step === 2 ? `<button type="button" class="mr-btn primary" data-mr="next">${st.r < MIRRORS.length - 1 ? `다음 거울 · ${esc(MIRRORS[st.r + 1].label)} →` : "네 거울 한눈에 보기 →"}</button>` : `<button type="button" class="mr-btn ghost" data-mr="reset">이 거울 다시</button>`}
      </aside>
      <div class="mr-stage">${board()}${st.step === 2 ? '<span class="mr-stamp" aria-hidden="true">GOOD JOB!</span>' : ""}</div>
    </div>`;
  }

  function startRound() {
    st.step = 0; st.painted = new Set(); st.flash = null; st.note = ""; st.choice = null;
    render();
    say(`${round().label}이야. 먼저 이 거울에서 무엇이 바뀌는지 골라 봐.`, "talk");
  }

  host.addEventListener("click", (event) => {
    const target = event.target.closest("button");
    if (!target || target.disabled || !host.contains(target)) return;
    const rd = st.finale ? null : round();
    if (target.dataset.swap) {
      if (target.dataset.swap === rd.swap) {
        st.step = 1; st.note = ""; st.choice = null;
        render();
        say("맞아! 이제 거울에 가장 가까운 칸부터 거울 너머에 칠해 보자.", "praise");
      } else {
        st.choice = target.dataset.swap;
        st.note = rd.swap === "lr" ? "옆에 서 있는 거울은 왼쪽과 오른쪽만 바꿔. 높이는 그대로야." : "위아래에 놓인 거울은 위와 아래만 바꿔. 좌우는 그대로야.";
        render();
        say(st.note, "think");
      }
      return;
    }
    if (target.matches(".mr-cell")) {
      st.just = null;
      const cell = [Number(target.dataset.x), Number(target.dataset.y)];
      const verdict = judgeCell(rd, cell, st.painted);
      const key = id(cell);
      if (verdict.kind === "ok") {
        st.painted.add(key);
        st.just = key;
        const { cols, rows } = rd.grid;
        st.flash = { kind: "ok", d: verdict.d, cells: [key, id(verdict.from)], pos: rd.axis.kind === "vertical" ? `left:${(rd.axis.at / cols) * 100}%;top:${((cell[1] + .5) / rows) * 100}%` : `top:${(rd.axis.at / rows) * 100}%;left:${((cell[0] + .5) / cols) * 100}%` };
        st.note = "";
        if (rd.targets.every((t) => st.painted.has(id(t)))) {
          st.step = 2; st.flash = null;
          render();
          say(`${rd.label} 완성! ${rd.swap === "lr" ? "왼쪽과 오른쪽만 바뀌고 높이는 그대로" : "위와 아래만 바뀌고 좌우는 그대로"}였어.`, "praise");
          return;
        }
      } else if (verdict.kind === "far") {
        st.flash = { kind: "hint", cells: rd.source.filter((s) => mirrorDistance(s, rd.axis) === verdict.nearest).map(id) };
        st.note = `거울에 더 가까운 칸이 먼저야. 처음 모양에서 거울에 ${verdict.nearest}칸 떨어진 칸(반짝이는 칸)부터 칠해 봐.`;
      } else if (verdict.kind === "keep") {
        st.flash = { kind: "wrong", cells: [key] };
        st.note = `거울에서 ${verdict.d}칸, 거리는 맞았어. 그런데 ${KEEP[rd.swap]}는 그대로야. 처음 모양과 같은 ${rd.swap === "lr" ? "줄" : "칸"}을 찾아봐.`;
      } else if (verdict.kind === "distance") {
        st.flash = { kind: "wrong", cells: [key] };
        st.note = "처음 모양에는 거울에서 그만큼 떨어진 칸이 없어. 거울에서 몇 칸인지 하나씩 세어 봐.";
      }
      render();
      return;
    }
    const act = target.dataset.mr;
    if (act === "reset") startRound();
    else if (act === "next") {
      if (st.r < MIRRORS.length - 1) { st.r += 1; startRound(); }
      else { st.finale = true; render(); say("네 거울을 모두 완성했어! 옆 거울과 위아래 거울이 어떻게 다른지 한눈에 봐.", "praise"); }
    } else if (act === "again") { st.r = 0; st.finale = false; startRound(); }
    else if (act === "done") onDone();
  }, { signal: listening.signal });

  startRound();
  return { dispose() { alive = false; listening.abort(); host.innerHTML = ""; } };
}
