// 4단원 스도쿠 엔진 — 원본 80~94쪽 색깔·숫자 스도쿠(2×4, 4×2, 4×4)를 같은 판으로 그린다.
//  규칙(원본 80쪽): 가로줄과 세로줄에 모두 다른 것, 굵은 선 안의 네모(2×2)에도 모두 다른 것.
//  값: 색깔은 "R"·"B"·"Y"·"G", 숫자는 "1"~"4", 빈칸은 ".". 판은 줄마다 글자 하나씩("RY.G").
export const COLORS = {
  R: { name: "빨강", fill: "#f2475a" },
  B: { name: "파랑", fill: "#2a6fc4" },
  Y: { name: "노랑", fill: "#ffe234" },
  G: { name: "초록", fill: "#3ea65b" }
};
export const parse = (rows) => rows.map((r) => [...r]);
export const dims = (g) => [g.length, g[0].length];

// 같은 줄·같은 네모의 칸들
export function units(R, C, bh = 2, bw = 2) {
  const out = [];
  for (let r = 0; r < R; r++) out.push({ type: "row", cells: Array.from({ length: C }, (_, c) => [r, c]) });
  for (let c = 0; c < C; c++) out.push({ type: "col", cells: Array.from({ length: R }, (_, r) => [r, c]) });
  for (let r0 = 0; r0 < R; r0 += bh) for (let c0 = 0; c0 < C; c0 += bw) {
    const cells = []; for (let r = r0; r < r0 + bh; r++) for (let c = c0; c < c0 + bw; c++) cells.push([r, c]);
    out.push({ type: "box", cells });
  }
  return out;
}
// 규칙에 어긋난 곳(첫째 것): { type, cells:[[r,c],[r,c]], line:[[r,c]…], v }
export function conflict(g, { bh = 2, bw = 2, only = null } = {}) {
  const [R, C] = dims(g);
  for (const u of units(R, C, bh, bw)) {
    if (only && !u.cells.some(([r, c]) => r === only[0] && c === only[1])) continue;
    const seen = new Map();
    for (const [r, c] of u.cells) {
      const v = g[r][c]; if (v === ".") continue;
      if (seen.has(v)) return { type: u.type, cells: [seen.get(v), [r, c]], line: u.cells, v };
      seen.set(v, [r, c]);
    }
  }
  return null;
}
// 답(하나뿐인 답을 찾는다 — 원본 문제는 모두 답이 하나)
export function solve(g, { bh = 2, bw = 2, symbols = null } = {}) {
  const [R, C] = dims(g); const s = g.map((r) => r.slice());
  const sym = symbols || (s.flat().some((v) => "RBYG".includes(v)) ? ["R", "B", "Y", "G"] : ["1", "2", "3", "4"]);
  const step = () => {
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (s[r][c] === ".") {
      for (const v of sym) { s[r][c] = v; if (!conflict(s, { bh, bw, only: [r, c] }) && step()) return true; }
      s[r][c] = "."; return false;
    }
    return true;
  };
  return step() ? s : null;
}
// 빈칸이 하나만 남은 줄(그 칸에 들어갈 것) — 힌트용
export function lastGap(g, r0, c0, { bh = 2, bw = 2 } = {}) {
  const [R, C] = dims(g);
  for (const u of units(R, C, bh, bw)) {
    if (!u.cells.some(([r, c]) => r === r0 && c === c0)) continue;
    if (u.cells.filter(([r, c]) => g[r][c] === ".").length === 1) return u;
  }
  return null;
}
export const UNIT_WORD = { row: "가로줄", col: "세로줄", box: "굵은 선 안의 네모" };

// 판 그리기. cell: CSS 길이(예 "min(14cqw, 30cqh)"). kind: "color" | "number"
export function makeBoard(host, rows, { kind = "color", cell = "80px", bh = 2, bw = 2, cls = "" } = {}) {
  const g = parse(rows); const [R, C] = dims(g);
  const el = document.createElement("div");
  el.className = `sd-board ${kind} ${cls}`;
  el.style.setProperty("--cell", cell);
  el.style.gridTemplateColumns = `repeat(${C}, auto)`;
  const cells = g.map((row, r) => row.map((v, c) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "sd-cell"; b.dataset.r = r; b.dataset.c = c;
    if ((c + 1) % bw === 0 && c < C - 1) b.classList.add("bR");
    if ((r + 1) % bh === 0 && r < R - 1) b.classList.add("bB");
    el.append(b); return b;
  }));
  const paint = (r, c, v) => {
    const b = cells[r][c]; g[r][c] = v;
    b.classList.toggle("empty", v === ".");
    if (kind === "color") { b.style.background = v === "." ? "" : COLORS[v].fill; b.textContent = ""; b.setAttribute("aria-label", v === "." ? "빈칸" : COLORS[v].name); }
    else { b.textContent = v === "." ? "" : v; b.setAttribute("aria-label", v === "." ? "빈칸" : v); }
  };
  g.forEach((row, r) => row.forEach((v, c) => { paint(r, c, v); if (v !== ".") cells[r][c].classList.add("given"); }));
  host.append(el);
  return {
    el, g, R, C, bh, bw, kind,
    cell: (r, c) => cells[r][c],
    set(r, c, v) { paint(r, c, v); const b = cells[r][c]; b.classList.remove("placed"); void b.offsetWidth; if (v !== ".") b.classList.add("placed"); },
    mark(list, cls, ms = 0) { for (const [r, c] of list) cells[r][c].classList.add(cls); if (ms) setTimeout(() => this.clear(cls), ms); },
    clear(cls) { el.querySelectorAll(`.${cls}`).forEach((x) => x.classList.remove(cls)); },
    full: () => g.every((row) => row.every((v) => v !== ".")),
    onTap(fn) { el.addEventListener("click", (e) => { const b = e.target.closest(".sd-cell"); if (b) fn(Number(b.dataset.r), Number(b.dataset.c), b); }); }
  };
}
// 타일(색 조각·숫자 카드) 그림
export function tileHtml(v, kind, size = 64) {
  if (kind === "color") return `<span class="sd-tile" style="width:${size}px;height:${size}px;background:${COLORS[v].fill}"></span>`;
  return `<span class="sd-tile num" style="width:${size}px;height:${size}px;font-size:${size * 0.6}px">${v}</span>`;
}
