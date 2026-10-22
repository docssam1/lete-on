import { esc, reduced } from "./golden-bell-game-fx.js?v=20261004a";
import { flatNotice } from "./golden-bell-3d-engine.js?v=20261022a";
import { CUBES, MAGIC, cubeViews, cubeTotal, checkCubes, checkMagic, magicLineStates } from "./golden-bell-book09-game-models.js?v=20261022a";
import { createCubeScene } from "./golden-bell-3d-cubes.js?v=20261022a";
import { createMagicScene } from "./golden-bell-3d-magic.js?v=20261022a";

// 9권 레벨 게임 2종의 화면. 문제 규칙은 golden-bell-book09-game-models.js, 틀(레벨·별·저장)은 golden-bell-level-game.js.
// 3D 판은 보고 만지는 교구이고, 같은 일을 하는 HTML 조작(칸 단추·카드)이 늘 함께 있다 — 키보드·화면 읽기·WebGL 없는 기기.

const josaIGa = (n) => `${n}${[2, 4, 5, 9].includes(Math.abs(n) % 10) ? "가" : "이"}`;
const josaUlLeul = (n) => `${n}${[2, 4, 5, 9].includes(Math.abs(n) % 10) ? "를" : "을"}`;

// 위·앞·옆 모양 그림(칸 그림). 목표와 지금 쌓은 것을 나란히 그린다. 색은 쌓기나무 색표.
function cellsSvg(cells, fill, unit = 13) {
  const rows = cells.length, cols = Math.max(...cells.map((r) => r.length));
  const rects = cells.flatMap((row, r) => row.map((on, c) => `<rect x="${c * unit + 1}" y="${r * unit + 1}" width="${unit}" height="${unit}" fill="${on ? fill : "#ffffff"}" stroke="${on ? "#a8741a" : "#e4e7ec"}" stroke-width="1.2"/>`)).join("");
  return `<svg viewBox="0 0 ${cols * unit + 2} ${rows * unit + 2}" width="${cols * unit + 2}" height="${rows * unit + 2}" aria-hidden="true">${rects}</svg>`;
}
const profileCells = (heights, max) => Array.from({ length: max }, (_, row) => heights.map((h) => (max - row <= h ? 1 : 0)));
function viewFigure(name, target, mine, fill, max) {
  const match = JSON.stringify(target) === JSON.stringify(mine);
  const shape = (v) => (name === "위" ? v : profileCells(v, max));
  const label = name === "위" ? "위" : name === "앞" ? "앞" : "오른쪽 옆";
  return `<figure class="b9g-view" data-view="${name}" data-match="${match}"><figcaption>${label}</figcaption><div class="b9g-pair"><div>${cellsSvg(shape(target), fill)}<small>목표</small></div><div>${cellsSvg(shape(mine), fill)}<small>지금</small></div></div><span class="b9g-state">${match ? "같아요 ✓" : "달라요"}</span></figure>`;
}

// ───────────────────────── 쌓기나무 탑 쌓기 ─────────────────────────
function cubeBoard({ stage, controls, sound, root }) {
  let p, api, heights = [], mode = "add", locked = false, scene = null, tried = false;
  stage.innerHTML = '<div class="lg-3d lg-3d-cubes"></div><div class="b9g-views" aria-live="polite"></div>';
  const host3d = stage.querySelector(".lg-3d"), viewsBox = stage.querySelector(".b9g-views");
  const ensureScene = () => {
    if (tried) return scene;
    tried = true;
    scene = createCubeScene(host3d, { fullscreenTarget: root || stage, onCell: (r, c) => apply(r, c) });
    if (!scene) { host3d.remove(); flatNotice(stage); }
    return scene;
  };
  const cap = () => Math.min(5, p.maxH + 1);
  function apply(r, c) {
    if (locked || !p || !p.views.top[r]?.[c]) return;
    const h = heights[r][c];
    if (mode === "add" && h >= cap()) { api.say(`이 칸은 ${cap()}층까지만 쌓을 수 있어.`, "start"); return; }
    if (mode === "remove" && h === 0) return;
    heights[r][c] = h + (mode === "add" ? 1 : -1);
    sound.tick();
    scene?.setHeights(heights, mode === "add" ? [r, c] : null);
    draw();
  }
  function drawViews() {
    const mine = cubeViews(heights), max = Math.max(...p.views.front, ...p.views.side, ...mine.front, ...mine.side, 1);
    viewsBox.innerHTML = viewFigure("위", p.views.top, mine.top, "#ffeaa6", max) + viewFigure("앞", p.views.front, mine.front, "#ffd45c", max) + viewFigure("옆", p.views.side, mine.side, "#f0b23a", max);
  }
  function draw() {
    drawViews();
    const total = cubeTotal(heights);
    const cellsHtml = heights.map((row, r) => row.map((h, c) => {
      const on = Boolean(p.views.top[r][c]);
      const name = `뒤에서 ${r + 1}번째 줄, 왼쪽에서 ${c + 1}번째 칸`;
      return on
        ? `<button type="button" class="b9g-cell${h ? "" : " empty"}" data-b9-cell="${r},${c}" aria-label="${name} ${h}층" ${locked ? "disabled" : ""}>${h || "·"}</button>`
        : `<button type="button" class="b9g-cell off" disabled aria-label="${name} 쌓을 수 없는 칸"></button>`;
    }).join("")).join("");
    const looks = scene ? `<div class="b9g-looks" role="group" aria-label="3D 판 보는 방향"><button type="button" class="b9g-look" data-b9-look="front">앞에서 보기</button><button type="button" class="b9g-look" data-b9-look="side">옆에서 보기</button><button type="button" class="b9g-look" data-b9-look="top">위에서 보기</button><button type="button" class="b9g-look" data-b9-look="home">처음 시점</button></div>` : "";
    controls.innerHTML = `<div class="b9g-modes" role="group" aria-label="쌓기 또는 빼기"><button type="button" class="b9g-mode" data-b9-mode="add" aria-pressed="${mode === "add"}" ${locked ? "disabled" : ""}>＋ 쌓기</button><button type="button" class="b9g-mode" data-b9-mode="remove" aria-pressed="${mode === "remove"}" ${locked ? "disabled" : ""}>－ 빼기</button></div>
      <div class="b9g-map-wrap"><small>뒤</small><div class="b9g-map" style="--cols:${p.cols}" role="group" aria-label="위에서 본 칸. 누르면 ${mode === "add" ? "쌓기나무를 하나 올려요" : "하나 빼요"}">${cellsHtml}</div><small>앞</small></div>
      <p class="b9g-count">쌓은 쌓기나무 <b data-b9-total>${total}</b>개</p>${looks}
      <div class="cg-actions"><button type="button" class="cg-secondary" data-b9-clear ${locked || !total ? "disabled" : ""}>모두 빼기</button><button type="button" class="cg-primary" data-b9-check ${locked || !total ? "disabled" : ""}>확인!</button></div>`;
  }
  const onClick = (event) => {
    const t = event.target.closest("button");
    if (!t || t.disabled) return;
    const d = t.dataset;
    if (d.b9Look) { scene?.look(d.b9Look); return; }
    if (locked) return;
    if (d.b9Mode) { mode = d.b9Mode; draw(); controls.querySelector(`[data-b9-mode="${mode}"]`)?.focus({ preventScroll: true }); }
    else if (d.b9Cell) { const [r, c] = d.b9Cell.split(",").map(Number); apply(r, c); controls.querySelector(`[data-b9-cell="${r},${c}"]`)?.focus({ preventScroll: true }); }
    else if (d.b9Clear !== undefined) { heights = heights.map((row) => row.map(() => 0)); scene?.setHeights(heights); draw(); }
    else if (d.b9Check !== undefined) { const res = checkCubes(p, heights); api.answer(res.correct, res); }
  };
  controls.addEventListener("click", onClick);
  return {
    show(problem, a) {
      p = problem; api = a; locked = false; mode = "add";
      heights = Array.from({ length: p.rows }, () => Array(p.cols).fill(0));
      if (ensureScene()) { scene.setPuzzle(p); scene.setHeights(heights); }
      draw();
    },
    reveal(problem, done) {
      locked = true;
      const target = problem.answerMap;
      // 한 칸씩 정답 높이로 맞추며 보여 준다(움직임 줄이기면 한 번에).
      const order = [];
      target.forEach((row, r) => row.forEach((h, c) => { if (heights[r][c] !== h) order.push([r, c, h]); }));
      let k = 0;
      const step = () => {
        if (k >= order.length) { draw(); done(); return; }
        const [r, c, h] = order[k++];
        heights[r][c] = h;
        scene?.setHeights(heights, [r, c]);
        draw();
        setTimeout(step, reduced() ? 0 : 260);
      };
      step();
    },
    lock(on) { locked = on; draw(); },
    dispose() { controls.removeEventListener("click", onClick); scene?.dispose(); scene = null; }
  };
}
const viewName = { front: "앞", side: "오른쪽 옆" };
const CUBES_GAME = {
  ...CUBES,
  coach: (p) => (p.kind === "exact" ? "위에서 본 칸마다 하나씩 놓고, 앞과 옆 모양에 맞게 높여 봐." : p.kind === "min" ? "앞과 옆에서 본 높은 층을 한 칸에 겹치면 적게 쓸 수 있어." : "칸마다 앞 층수와 옆 층수 중 작은 수까지 쌓을 수 있어."),
  mission: (p) => (p.kind === "exact" ? "위·앞·오른쪽 옆에서 본 모양이 <b class=\"cw\">똑같아지게</b> 쌓으세요." : `모양은 그대로, 쌓기나무를 <b class="cw">${p.kind === "min" ? "가장 적게" : "가장 많이"}</b> 쌓으세요.`),
  hint(p, info) {
    if (!info) return "목표 모양과 지금 모양을 하나씩 비교해 봐.";
    if (!info.topOk) return "위에서 본 칸마다 쌓기나무가 적어도 하나 있어야 해. 빈 칸이 있는지 봐.";
    if (info.frontBad.length) return `앞에서 본 모양이 달라. 왼쪽에서 ${info.frontBad[0] + 1}번째 줄을 봐. 목표는 ${p.views.front[info.frontBad[0]]}층이야.`;
    if (info.sideBad.length) return `오른쪽 옆에서 본 모양이 달라. 앞에서 ${info.sideBad[0] + 1}번째 줄을 봐. 목표는 ${p.views.side[info.sideBad[0]]}층이야.`;
    return p.kind === "min" ? `모양은 맞았어! 그런데 ${info.total}개보다 더 적게 쌓을 수 있어. 높은 층을 한 칸에 겹쳐 봐.` : `모양은 맞았어! 그런데 ${info.total}개보다 더 많이 쌓을 수 있어. 낮은 칸을 더 높일 수 있는지 봐.`;
  },
  success: (p, info) => (p.kind === "exact" ? `맞았어! 쌓기나무는 ${info?.total ?? p.answer}개야.` : p.kind === "min" ? `맞았어! 가장 적을 때 ${p.answer}개야.` : `맞았어! 가장 많을 때 ${p.answer}개야.`),
  reveal: (p) => (p.kind === "exact" ? `이렇게 쌓으면 돼. 모두 ${p.answer}개야.` : p.kind === "min" ? `가장 적게 쌓으면 ${p.answer}개야. 높은 층을 겹친 칸을 봐.` : `가장 많이 쌓으면 ${p.answer}개야. 칸마다 앞 층수와 옆 층수 중 작은 수만큼 쌓았어.`),
  createBoard: cubeBoard
};

// ───────────────────────── 숫자 유리창(마방진) ─────────────────────────
function magicBoard({ stage, controls, sound, root }) {
  let p, api, values = [], placed = new Map(), active = null, locked = false, scene = null, tried = false;
  stage.innerHTML = '<div class="lg-3d lg-3d-magic"></div>';
  const host3d = stage.querySelector(".lg-3d");
  const ensureScene = () => {
    if (tried) return scene;
    tried = true;
    scene = createMagicScene(host3d, { fullscreenTarget: root || stage, onCell: (i) => select(i) });
    if (!scene) { host3d.remove(); flatNotice(stage); }
    return scene;
  };
  const nextEmpty = (from = -1) => { const order = p.blanks.filter((i) => values[i] === null); return order.find((i) => i > from) ?? order[0] ?? null; };
  function select(i) {
    if (locked || !p.blanks.includes(i)) return;
    active = i;
    sound.tick();
    sync();
  }
  function place(cardIndex) {
    if (locked || active === null) return;
    // 이미 다른 칸에 놓인 카드면 그 칸에서 옮겨 온다.
    for (const [cell, k] of placed) if (k === cardIndex) { placed.delete(cell); values[cell] = null; }
    placed.set(active, cardIndex);
    values[active] = p.cards[cardIndex];
    const changed = active;
    active = nextEmpty(active);
    sound.tick();
    sync(changed);
  }
  function sync(changed = null) {
    const states = magicLineStates(p, values);
    scene?.setValues(values, { active, changed });
    scene?.setLines(states);
    draw(states);
  }
  function draw(states = magicLineStates(p, values)) {
    const n = p.n;
    const grid = values.map((v, i) => {
      const blank = p.blanks.includes(i);
      const name = `${Math.floor(i / n) + 1}번째 줄 ${i % n + 1}번째 칸`;
      if (!blank) return `<span class="b9m-cell given" role="img" aria-label="${name} ${v}">${v}</span>`;
      return `<button type="button" class="b9m-cell blank${v !== null ? " filled" : ""}${active === i ? " active" : ""}" data-b9m-cell="${i}" aria-pressed="${active === i}" aria-label="${name} 빈칸 ${v ?? "비어 있음"}" ${locked ? "disabled" : ""}>${v ?? ""}</button>`;
    }).join("");
    const used = new Set(placed.values());
    const cards = p.cards.map((v, k) => `<button type="button" class="b9m-card" data-b9m-card="${k}" aria-label="숫자 카드 ${v}" ${locked || used.has(k) || active === null ? "disabled" : ""}>${v}</button>`).join("");
    const chips = states.filter((s) => s.open && s.full).map((s) => `<li class="${s.ok ? "ok" : "no"}">${esc(s.name)} ${s.sum}${s.ok ? " ✓" : ""}</li>`).join("");
    const filled = p.blanks.every((i) => values[i] !== null);
    controls.innerHTML = `<p class="b9m-sum">한 줄의 합 <b>${p.sumShown ? p.sum : "?"}</b></p>
      <div class="b9m-grid" style="--size:${n}" role="group" aria-label="숫자 유리창. 빈칸을 누르고 카드를 고르세요">${grid}</div>
      <div class="b9m-cards" role="group" aria-label="숫자 카드">${cards}</div>
      <ul class="b9m-lines" aria-label="채운 줄의 합">${chips || "<li>빈칸이 있던 줄이 다 차면 여기에 합이 나와요</li>"}</ul>
      <div class="cg-actions"><button type="button" class="cg-secondary" data-b9m-clear ${locked || active === null || values[active] === null ? "disabled" : ""}>이 칸 지우기</button><button type="button" class="cg-primary" data-b9m-check ${locked || !filled ? "disabled" : ""}>확인!</button></div>`;
  }
  const onClick = (event) => {
    const t = event.target.closest("button");
    if (!t || t.disabled || locked) return;
    const d = t.dataset;
    if (d.b9mCell !== undefined) { select(Number(d.b9mCell)); controls.querySelector(`[data-b9m-cell="${d.b9mCell}"]`)?.focus({ preventScroll: true }); }
    else if (d.b9mCard !== undefined) place(Number(d.b9mCard));
    else if (d.b9mClear !== undefined && active !== null) { placed.delete(active); values[active] = null; sync(); }
    else if (d.b9mCheck !== undefined) { const res = checkMagic(p, values); api.answer(res.correct, { ...res, values: [...values] }); }
  };
  controls.addEventListener("click", onClick);
  return {
    show(problem, a) {
      p = problem; api = a; locked = false; placed = new Map();
      values = p.shown.map((v) => (typeof v === "number" ? v : null));
      active = nextEmpty();
      if (ensureScene()) scene.setPuzzle(p);
      sync();
    },
    reveal(problem, done) {
      locked = true;
      // 남은 카드로 정답을 채운다. 같은 수 카드가 없으면 수만 넣는다(카드는 정답과 덤으로 만들어져 늘 있다).
      placed = new Map();
      const free = p.cards.map((v, k) => k);
      let k = 0;
      const blanks = [...p.blanks];
      const step = () => {
        if (k >= blanks.length) { active = null; sync(); done(); return; }
        const cell = blanks[k++], want = problem.full[cell];
        const cardIndex = free.find((idx) => p.cards[idx] === want && ![...placed.values()].includes(idx));
        if (cardIndex !== undefined) placed.set(cell, cardIndex);
        values[cell] = want;
        active = null;
        sync(cell);
        setTimeout(step, reduced() ? 0 : 280);
      };
      values = p.shown.map((v) => (typeof v === "number" ? v : null));
      step();
    },
    lock(on) { locked = on; if (on) active = null; sync(); },
    dispose() { controls.removeEventListener("click", onClick); scene?.dispose(); scene = null; }
  };
}
const MAGIC_COACH = {
  fill: "한 줄의 합에서 그 줄의 다른 수를 빼 봐.",
  "center-given": "가운데 수를 세 번 더하면 한 줄의 합이야.",
  "center-blank": "가운데를 사이에 둔 두 수를 더하면, 가운데 수를 두 번 더한 것과 같아.",
  overlap: "두 줄이 같이 쓰는 칸을 빼면, 나머지 수끼리 합이 같아.",
  find: "세 수가 다 보이는 줄이 있으면 한 줄의 합부터 구해.",
  big: "네 칸 줄도 합이 모두 같아. 빈칸이 하나 남은 줄부터!"
};
const MAGIC_GAME = {
  ...MAGIC,
  coach: (p) => MAGIC_COACH[p.kind],
  mission: (p) => (p.sumShown ? `가로·세로·대각선의 합이 모두 <b class="cw">${p.sum}</b>${[2, 4, 5, 9].includes(p.sum % 10) ? "가" : "이"} 되게 빈칸을 채우세요.` : "한 줄의 합이 숨었어요. 빈칸을 채워 <b class=\"cw\">모든 줄의 합</b>을 같게 하세요."),
  hint(p, info) {
    const states = info?.values ? magicLineStates(p, info.values) : [];
    const bad = states.find((s) => s.open && s.full && !s.ok);
    if (bad) return `${bad.name}의 합이 ${josaIGa(bad.sum)}야. 다른 줄과 합이 같아야 해.`;
    return "빈칸이 하나만 남은 줄부터 채워 봐. 한 줄의 합에서 나머지 수를 빼면 돼.";
  },
  success: (p) => `맞았어! 모든 줄의 합이 ${josaIGa(p.sum)}야.`,
  reveal: (p) => `한 줄의 합은 ${josaIGa(p.sum)}야. 빈칸이 하나 남은 줄부터 ${josaUlLeul(p.sum)} 맞추면 돼.`,
  createBoard: magicBoard
};

export const BOOK09_LEVEL_GAMES = Object.freeze({ "b9-cubes": CUBES_GAME, "b9-magic": MAGIC_GAME });
