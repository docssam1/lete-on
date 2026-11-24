// 2과정 G3 「정육면체와 각·넓이」 그림 논증 — 본책 1단원(도형 움직이기)·2단원(주사위와 쌓기나무)·3단원(시계와 각)·4단원(평면도형의 넓이)의 「왜 그럴까」.
// 본책은 표를 채우고 직접 그려 보며 확인한다. 여기서는 그 까닭을 장면마다 주장 + 근거로 쌓고,
// 「다른 …으로」를 눌러 모양·수가 달라도 같은 논증이 통한다는 것(일반화)을 본다. 그림 도구는 proof-board.js.
// 정육면체·전개도는 이 파일 안의 작은 3D 도구(돌리기·투영·앞뒤 순서)로 그린다 — 진행값 k의 순수 함수 그대로.
import { C, P, add, sub, mul, lerp, mid, dist, dirDeg, polar, rot, fold, angleAt, clamp, ease, phase } from "../proof-board.js";
import { dimArc } from "../length-dim.js?v=20261124a";

const pick = (list, seed) => list[seed % list.length];
// 길이 = 두 끝을 짚는 바깥 곡선 점선 + 그 가운데 끊은 자리에 손글씨(스킬 gfield-textbook-design 4-3,
// 원장 2026-11-24 「도형의 변의 길이를 점선 호를 사용하여 길이를 써야지 기준이잖아」). 곡선·끊는 자리 계산은 length-dim.js dimArc.
//   away: 도형 안쪽 점 — 그 반대쪽(바깥)으로 휜다 · side: +1/−1로 직접(a→b 진행 방향의 오른쪽이 +) · off: 곡선 꼭대기와 선분 사이
const HAND = "'FC Hand','Nanum Pen Script',cursive";
function dimLen(f, a, b, text, { away, side, off = 18, size = 16, color = C.ink, opacity = 1 } = {}) {
  const l = Math.hypot(b.x - a.x, b.y - a.y);
  if (opacity <= 0 || text == null || text === "" || l < 2) return f;
  const nx = -(b.y - a.y) / l, ny = (b.x - a.x) / l, mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  const sg = side ?? ((mx - away.x) * nx + (my - away.y) * ny >= 0 ? 1 : -1);
  // 글자 상자가 선분에 걸리지 않을 만큼은 띄운다(세로 변의 긴 글자). 글자가 구간보다 길면 dimArc가 곡선 바깥에 둔다
  const fs = size * 1.3, w = [...String(text)].reduce((t, ch) => t + (/[0-9.]/.test(ch) ? 0.56 : /[a-z]/i.test(ch) ? 0.58 : /\s/.test(ch) ? 0.3 : 0.95) * fs, 0);
  const bend = w + 6 > l * 0.6 ? off : Math.max(off, Math.abs(nx) * w / 2 + Math.abs(ny) * fs * 0.55 + 4);
  const svg = dimArc(a.x, a.y, b.x, b.y, sg * bend, text, { size: size * 1.3, font: HAND, ink: color, color, width: 1.5, dash: "5 4", gap: 3 })
    .replace("<text ", `<text stroke="${C.paper}" stroke-width="5" paint-order="stroke" `);   // 다른 글자처럼 종이색 테두리
  return f.raw(`<g class="pf-dim"${opacity < 1 ? ` opacity="${Math.round(opacity * 100) / 100}"` : ""}>${svg}</g>`);
}
const r0 = (v) => Math.round(v);
const nf = (v) => (Number.isInteger(v) ? String(v) : String(Math.round(v * 10) / 10));
const bottomNote = (f, text, o = {}) => f.note(P(320, 412), text, o);
// 아래 식 한 줄을 장면 i에서 들이고 장면 j에서 내보낸다(두 줄이 겹쳐 보이지 않게: 앞 줄이 먼저 빠지고 새 줄이 들어온다)
const swap = (k, i, j = 99) => phase(k, i, 0.3, 1) * (1 - phase(k, j, 0, 0.3));
// 두 점 사이를 곧은 선 대신 휘어진 선으로(같은 짝 잇기)
function curve(a, b, bend, n = 24) {
  const m = mid(a, b), d = sub(b, a), l = Math.hypot(d.x, d.y) || 1, c = add(m, P((-d.y / l) * bend, (d.x / l) * bend));
  return Array.from({ length: n + 1 }, (_, i) => { const t = i / n; return add(add(mul(a, (1 - t) ** 2), mul(c, 2 * t * (1 - t))), mul(b, t * t)); });
}

// ── 작은 3D 도구 ─────────────────────────────────────────────
const V = (x, y, z) => ({ x, y, z });
const vadd = (a, b) => V(a.x + b.x, a.y + b.y, a.z + b.z);
const vsub = (a, b) => V(a.x - b.x, a.y - b.y, a.z - b.z);
const vmul = (a, k) => V(a.x * k, a.y * k, a.z * k);
const vdot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
const vcross = (a, b) => V(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
// 점 p를 (점 a를 지나고 방향 u인) 축으로 deg만큼 돌리기
function vrot(p, a, u, deg) {
  const t = (deg * Math.PI) / 180, cs = Math.cos(t), sn = Math.sin(t), v = vsub(p, a);
  return vadd(a, vadd(vadd(vmul(v, cs), vmul(vcross(u, v), sn)), vmul(u, vdot(u, v) * (1 - cs))));
}
// 보는 방향: psi = 옆으로 돌린 각, phi = 내려다보는 각. x 오른쪽, y 안쪽(멀어짐), z 위
function camera(psi, phi) {
  const R = Math.PI / 180, cp = Math.cos(psi * R), sp = Math.sin(psi * R), cf = Math.cos(phi * R), sf = Math.sin(phi * R);
  return (q) => { const x1 = q.x * cp - q.y * sp, y1 = q.x * sp + q.y * cp; return { x: x1, y: -(q.z * cf + y1 * sf), d: y1 * cf - q.z * sf }; };
}
const area2 = (pts) => pts.reduce((s, p, i) => { const q = pts[(i + 1) % pts.length]; return s + p.x * q.y - q.x * p.y; }, 0) / 2;

// 전개도: 칸 [열, 행] 6개 → 가운데 칸을 뿌리로 하는 접기 나무
function netModel(cells) {
  const key = (c, r) => `${c},${r}`, idx = new Map(cells.map(([c, r], i) => [key(c, r), i]));
  const nbr = (i) => { const [c, r] = cells[i]; return [[c + 1, r], [c - 1, r], [c, r + 1], [c, r - 1]].map(([a, b]) => idx.get(key(a, b))).filter((j) => j != null); };
  let root = 0;
  cells.forEach((_, i) => { if (nbr(i).length > nbr(root).length) root = i; });
  const parent = cells.map(() => -1), order = [root], hinge = [];
  const seen = new Set([root]);
  for (let h = 0; h < order.length; h += 1) {
    const i = order[h];
    for (const j of nbr(i)) {
      if (seen.has(j)) continue;
      seen.add(j); parent[j] = i; order.push(j);
      const [cc, cr] = cells[j], [pc, pr] = cells[i];
      let a, u;
      if (cc === pc + 1) { a = V(cc, -cr, 0); u = V(0, 1, 0); }
      else if (cc === pc - 1) { a = V(pc, -cr, 0); u = V(0, 1, 0); }
      else if (cr === pr + 1) { a = V(cc, -cr, 0); u = V(1, 0, 0); }
      else { a = V(cc, -pr, 0); u = V(1, 0, 0); }
      // 아래로(바닥 밑으로) 접히는 쪽의 부호
      const ctr = V(cc + 0.5, -cr - 0.5, 0);
      const sign = vrot(ctr, a, u, 10).z < 0 ? 1 : -1;
      hinge[j] = { a, u, sign };
    }
  }
  return { cells, root, parent, order, hinge };
}
// t(0~1)만큼 접었을 때 칸 i의 평면 좌표 → 공간 좌표
function netMaps(m, t) {
  const maps = [];
  for (const i of m.order) {
    if (i === m.root) { maps[i] = (p) => p; continue; }
    const h = m.hinge[i], pm = maps[m.parent[i]];
    maps[i] = (p) => pm(vrot(p, h.a, h.u, h.sign * 90 * t));
  }
  return maps;
}
const cellCorners = ([c, r]) => [V(c, -r, 0), V(c + 1, -r, 0), V(c + 1, -r - 1, 0), V(c, -r - 1, 0)];
const cellCenter = ([c, r]) => V(c + 0.5, -r - 0.5, 0);
// 기호(○ △ □)를 칸 위 평면 좌표로
function symbolFlat(kind, ctr, s = 0.27) {
  if (kind === "o") return Array.from({ length: 22 }, (_, i) => V(ctr.x + s * Math.cos((i / 22) * 2 * Math.PI), ctr.y + s * Math.sin((i / 22) * 2 * Math.PI), 0));
  if (kind === "t") return [V(ctr.x, ctr.y + s * 1.05, 0), V(ctr.x - s * 1.05, ctr.y - s * 0.8, 0), V(ctr.x + s * 1.05, ctr.y - s * 0.8, 0)];
  return [V(ctr.x - s * 0.9, ctr.y - s * 0.9, 0), V(ctr.x + s * 0.9, ctr.y - s * 0.9, 0), V(ctr.x + s * 0.9, ctr.y + s * 0.9, 0), V(ctr.x - s * 0.9, ctr.y + s * 0.9, 0)];
}
const SYM = { o: { fill: C.redSoft, stroke: C.red }, t: { fill: C.blueSoft, stroke: C.blue }, s: { fill: C.greenSoft, stroke: C.green } };
// 전개도(접는 중)를 그린다. style(i) → { sym, colored(0~1) }, xray(0~1)이면 겨냥도처럼 뒤쪽 면을 점선으로 비춰 본다.
function drawNet(f, m, t, { psi, phi, sc, cx, cy, style, opacity = 1, xray = 0 }) {
  if (opacity <= 0) return null;
  const cam = camera(psi, phi), maps = netMaps(m, t);
  const faces = m.cells.map((cell, i) => {
    const w = cellCorners(cell).map(maps[i]), pr = w.map(cam);
    const c3 = maps[i](cellCenter(cell));
    return { i, w, pr, c3, d: pr.reduce((s, q) => s + q.d, 0) / 4 };
  });
  const all = faces.flatMap((F) => F.pr);
  const bx = (Math.min(...all.map((q) => q.x)) + Math.max(...all.map((q) => q.x))) / 2, by = (Math.min(...all.map((q) => q.y)) + Math.max(...all.map((q) => q.y))) / 2;
  const S = (q) => P(cx + sc * (q.x - bx), cy + sc * (q.y - by));
  const ref = Math.sign(area2(faces[m.root].pr.map(S))) || 1;
  faces.sort((a, b) => b.d - a.d);
  for (const F of faces) {
    const pts = F.pr.map(S), ar = area2(pts), front = Math.sign(ar) === ref, st = style(F.i), sym = st.sym, col = sym ? SYM[sym] : null;
    const colored = sym ? st.colored : 0;
    const fill = front ? (colored > 0.5 ? col.fill : C.paper) : C.back;
    const fillOpacity = front ? 1 - 0.5 * xray : 1 - xray;
    f.poly(pts, { fill, fillOpacity, stroke: C.ink, w: 2.2, opacity, dash: !front && xray > 0.5 ? "6 5" : null });
    if (sym && colored > 0) {
      const size = Math.sqrt(Math.abs(ar) / (sc * sc));
      if (size > 0.12) {
        const sp = symbolFlat(sym, cellCenter(m.cells[F.i])).map((p) => S(cam(netMapsOne(maps, F.i)(p))));
        const op = (front ? 1 : 0.55 * xray) * opacity * clamp(colored * 2);
        f.poly(sp, { fill: col.fill, stroke: col.stroke, w: 2.6, opacity: op });
      }
    }
  }
  return { center: (i) => S(cam(maps[i](cellCenter(m.cells[i])))), S, cam };
}
const netMapsOne = (maps, i) => maps[i];
// 한 줄로 이은 세 칸 → 양 끝 칸이 짝. 짝 둘이 정해지면 남은 둘이 셋째 짝.
function netPairs(cells) {
  const at = (c, r) => cells.findIndex(([a, b]) => a === c && b === r);
  const pairs = [], used = new Set(), runs = [];
  cells.forEach(([c, r], i) => {
    for (const [dc, dr] of [[1, 0], [0, 1]]) {
      const j = at(c + dc, r + dr), k2 = at(c + 2 * dc, r + 2 * dr);
      if (j < 0 || k2 < 0 || used.has(i) || used.has(k2) || pairs.length >= 2) continue;
      pairs.push([i, k2]); runs.push([i, j, k2]); used.add(i); used.add(k2);
    }
  });
  const rest = cells.map((_, i) => i).filter((i) => !used.has(i));
  return { pairs: [...pairs, rest], runs };
}

// ── 1. 반 바퀴 돌리기 = 뒤집기 두 번 ───────────────────────────
const dirWords = (u, v) => `${u >= 0 ? "오른쪽" : "왼쪽"} ${Math.abs(u)}칸, ${v >= 0 ? "위" : "아래"} ${Math.abs(v)}칸`;
const halfTurn = {
  id: "half-turn-two-flips",
  unit: "1단원 · 도형 움직이기",
  title: "반 바퀴 돌리기는 왜 뒤집기 두 번과 같을까",
  vary: "다른 모양으로",
  params(seed) {
    const s = pick([
      { pts: [[1, 0], [1, 4], [4, 3], [2, 2], [2, 0]], t: 2 },
      { pts: [[-1, 1], [-1, 4], [0, 4], [0, 2], [3, 2], [3, 1]], t: 4 },
      { pts: [[1, 1], [4, 1], [2, 4]], t: 2 },
      { pts: [[1, -1], [1, 3], [2, 3], [2, 0], [4, 0], [4, -1]], t: 2 },
      { pts: [[-2, 1], [3, 1], [3, 2], [0, 4]], t: 2 },
    ], seed);
    const O = P(215, 215), g = 28;
    const at = ([u, v]) => P(O.x + u * g, O.y - v * g);
    const [u, v] = s.pts[s.t];
    return { O, g, at, shape: s.pts.map(at), ti: s.t, u, v };
  },
  scenes: [
    { say: "도형을 가운데 점을 중심으로 반 바퀴 돌린 모양은, 뒤집기 두 번으로도 만들 수 있을까요? 꼭짓점 ㄱ 하나가 어디로 가는지 따라가 봐요.", line: (p) => `처음 ㄱ: 가운데에서 ${dirWords(p.u, p.v)}`, ms: 1800 },
    { say: "오른쪽으로 뒤집어요. 세로 가운데 선이 거울이에요. ㄱ이 세로 선에서 얼마나 떨어져 있는지 보세요.", line: (p) => `오른쪽으로 뒤집기 → ㄱ: ${dirWords(-p.u, p.v)}`, why: "세로 선이 거울: 떨어진 칸 수는 그대로, 왼쪽·오른쪽만 바뀐다", ms: 2600 },
    { say: "이번에는 아래로 뒤집어요. 가로 가운데 선이 거울이에요.", line: (p) => `아래로 뒤집기 → ㄱ: ${dirWords(-p.u, -p.v)}`, why: "가로 선이 거울: 위·아래만 바뀐다", ms: 2600 },
    { say: "이제 처음 모양을 가운데 점을 중심으로 반 바퀴 돌려 봐요. 처음 ㄱ과 돌린 ㄱ은 가운데 점을 지나는 곧은 선 위에 있어요.", line: (p) => `반 바퀴 돌리기 → ㄱ: ${dirWords(-p.u, -p.v)}`, why: "반 바퀴 돌리면 가운데 점의 반대쪽, 같은 거리로 간다 → 왼쪽·오른쪽, 위·아래가 둘 다 바뀐다", ms: 3000 },
    { say: "ㄱ만이 아니라 도형의 어느 점이든 똑같이 따질 수 있어요. 그래서 두 모양이 꼭 겹쳐요.", line: "반 바퀴 돌리기 = 오른쪽으로 뒤집기 + 아래로 뒤집기", why: "모든 점이 같은 자리로 간다(왼쪽·오른쪽 바뀜 + 위·아래 바뀜)", ms: 1600 },
  ],
  draw(f, k, p) {
    const { O, g, shape, ti } = p;
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3), s4 = phase(k, 4);
    const half = 5 * g, L = O.x - half, Rr = O.x + half, T = O.y - half, B = O.y + half;
    for (let i = -5; i <= 5; i += 1) {
      f.seg(P(O.x + i * g, T), P(O.x + i * g, B), { stroke: C.line, w: 1 });
      f.seg(P(L, O.y + i * g), P(Rr, O.y + i * g), { stroke: C.line, w: 1 });
    }
    f.seg(P(O.x, T - 8), P(O.x, B + 8), { stroke: C.purple, w: 2, dash: "7 6", opacity: 0.35 + 0.65 * Math.max(s1 * (1 - s2), 0) });
    f.seg(P(L - 8, O.y), P(Rr + 8, O.y), { stroke: C.teal, w: 2, dash: "7 6", opacity: 0.35 + 0.65 * Math.max(s2 * (1 - s3), 0) });
    f.dot(O, { r: 5 });
    // 지금 모양: 처음 → 세로 거울 → 가로 거울
    const vA = O, vB = add(O, P(0, 10)), hA = O, hB = add(O, P(10, 0));
    const cur = shape.map((q) => fold(fold(q, vA, vB, s1), hA, hB, s2));
    // 처음 자리(흐린 점선)
    if (s1 > 0) f.poly(shape, { fill: "none", stroke: C.soft, w: 1.8, dash: "5 5", opacity: s1 * (1 - s4 * 0.5) });
    const flippedOdd = (s1 > 0.5) !== (s2 > 0.5);
    f.poly(cur, { fill: flippedOdd ? C.orangeSoft : C.blueSoft, stroke: flippedOdd ? C.orange : C.blue, w: 2.6, draw: s0 });
    // 반 바퀴 돌린 처음 모양(보라 점선)
    if (s3 > 0) {
      const turned = shape.map((q) => rot(q, O, 180 * s3));
      f.poly(turned, { fill: C.purple, fillOpacity: 0.12, stroke: C.purple, w: 2.6, dash: "9 6", opacity: 1 });
      const t0 = shape[ti], t1 = rot(t0, O, 180 * s3);
      f.seg(t0, lerp(t0, rot(t0, O, 180), s3), { stroke: C.purple, w: 2, dash: "3 5", opacity: 0.8 });
      f.dot(t1, { r: 6, fill: C.purple });
    }
    // ㄱ까지의 거리(세로 선·가로 선에서)
    const tp = cur[ti];
    const showD = clamp(s0 * 2 - 1) * (1 - s3);
    f.seg(P(O.x, tp.y), tp, { stroke: C.purple, w: 3.4, opacity: showD });
    f.seg(P(tp.x, O.y), tp, { stroke: C.teal, w: 3.4, opacity: showD });
    f.dot(tp, { r: 6.5, fill: C.red });
    f.label(add(tp, P(tp.x >= O.x ? 16 : -16, tp.y <= O.y ? -14 : 14)), "ㄱ", { color: C.red, size: 18 });
    if (s1 > 0) { const t0 = shape[ti]; f.dot(t0, { r: 5, fill: C.soft, opacity: s1 }); }
    // 오른쪽 기록
    const x = 400, rows = [
      ["처음", dirWords(p.u, p.v), 1, C.ink],
      ["오른쪽으로 뒤집기", dirWords(-p.u, p.v), s1, C.orange],
      ["다시 아래로 뒤집기", dirWords(-p.u, -p.v), s2, C.blue],
      ["처음을 반 바퀴 돌리기", dirWords(-p.u, -p.v), s3, C.purple],
    ];
    rows.forEach(([h, t, o, col], i) => {
      if (o <= 0) return;
      f.label(P(x, 92 + i * 66), h, { anchor: "start", size: 14, color: C.soft, opacity: o, weight: 700 });
      f.note(P(x, 116 + i * 66), `ㄱ: ${t}`, { anchor: "start", size: 18, color: col, opacity: o });
    });
    if (s4 > 0) bottomNote(f, "반 바퀴 돌리기 = 오른쪽으로 뒤집기 + 아래로 뒤집기", { opacity: s4, size: 19 });
  },
};

// ── 2. 전개도에서 마주 보는 면 ─────────────────────────────────
const NETS = [
  [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [2, 2]],
  [[0, 0], [1, 0], [2, 0], [2, 1], [3, 1], [4, 1]],
  [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [3, 2]],
  [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]],
  [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [0, 2]],
];
const STRIP = netModel([[0, 0], [1, 0], [2, 0]]);
const netOpp = {
  id: "cube-net-opposite",
  unit: "2단원 · 주사위와 쌓기나무",
  title: "전개도에서 마주 보는 면은 어떻게 찾을까",
  vary: "다른 전개도로",
  params(seed) {
    const cells = pick(NETS, seed), m = netModel(cells), { pairs, runs } = netPairs(cells);
    const sym = cells.map(() => null);
    pairs[0].forEach((i) => { sym[i] = "o"; }); pairs[1].forEach((i) => { sym[i] = "t"; }); pairs[2].forEach((i) => { sym[i] = "s"; });
    return { m, pairs, runs, sym, n: seed % NETS.length };
  },
  scenes: [
    { say: "정사각형 6개를 이은 정육면체의 전개도예요. 접으면 어느 면끼리 서로 마주 볼까요? 접기 전에 그림만 보고 따져 봐요.", line: "전개도: 면 6개 = 마주 보는 짝 3쌍", why: "정육면체는 위·아래, 앞·뒤, 왼쪽·오른쪽 세 쌍", ms: 1800 },
    { say: "한 줄로 이어진 세 칸만 떼어 봐요. 가운데 칸을 그대로 두고 양 끝 칸을 접어 내리면, 두 끝 칸은 서로 마주 서요.", line: "한 줄로 이은 세 칸에서 양 끝 칸은 마주 본다", why: "가운데 칸에서 양쪽으로 똑같이 직각으로 접으면 두 칸이 나란히 마주 선다", ms: 3200 },
    { say: "전개도에서 한 줄로 이은 세 칸을 찾아요. 가운데 한 칸을 건너뛴 두 칸이 짝이에요.", line: "한 칸 건너 같은 줄의 두 칸 → ○끼리, △끼리 짝", why: "앞 장면: 한 줄 세 칸의 양 끝은 마주 본다", ms: 3000 },
    { say: "남은 두 칸은요? 면마다 마주 보는 면은 꼭 하나이고, 짝 두 쌍이 이미 정해졌어요.", line: "남은 두 칸 → □끼리 짝", why: "면 6개가 3쌍으로 나뉘니, 두 쌍을 빼고 남은 둘이 셋째 짝일 수밖에 없다", ms: 2200 },
    { say: "정말 그런지 접어 봐요. 뒤쪽 면은 점선으로 비춰 보았어요(겨냥도).", line: "접어 보면 ○끼리, △끼리, □끼리 마주 본다", why: "앞의 따짐이 맞았다는 확인", ms: 4200 },
    { say: "「다른 전개도로」를 눌러 보세요. 모양이 달라도 같은 방법으로 짝을 찾을 수 있어요.", line: "전개도의 짝 찾기: ① 한 줄 세 칸의 양 끝 ② 남은 둘", why: "한 줄 세 칸은 어느 전개도에서나 접으면 마주 선다", ms: 2600 },
  ],
  draw(f, k, p) {
    const { m, sym, runs } = p;
    const s2 = phase(k, 2), s3 = phase(k, 3), s4 = phase(k, 4), s5 = phase(k, 5);
    const netOp = k < 1 ? 1 : k < 2 ? 1 - clamp((k - 1) / 0.2) : clamp((k - 2) / 0.25);
    const demoOp = k < 1 ? 0 : k < 2 ? clamp((k - 1 - 0.12) / 0.15) : 1 - clamp((k - 2) / 0.2);
    // 접기 정도와 보는 방향
    const ft = ease(clamp((k - 4) / 0.72));
    const xr = clamp((k - 4.72) / 0.2);
    const flat = { psi: -12, phi: 62, sc: 78 }, cube = { psi: -36, phi: 28, sc: 132 };
    const vw = { psi: flat.psi + (cube.psi - flat.psi) * ft - 32 * s5, phi: flat.phi + (cube.phi - flat.phi) * ft, sc: flat.sc + (cube.sc - flat.sc) * ft };
    const colored = (i) => (sym[i] === "s" ? clamp(s3 * 2) : clamp(s2 * 2.2 - (sym[i] === "t" ? 1.1 : 0)));
    if (netOp > 0) {
      const res = drawNet(f, m, ft, { ...vw, cx: 320, cy: 205, opacity: netOp, xray: xr, style: (i) => ({ sym: sym[i], colored: colored(i) }) });
      // 한 줄 세 칸 표시(장면 3·4)
      if (res && k >= 2 && k < 4.05) {
        const fade = 1 - clamp((k - 4) / 0.05);
        runs.forEach((run, j) => {
          const g = clamp(s2 * 2.2 - j * 1.1);
          if (g <= 0) return;
          const a = res.center(run[0]), b = res.center(run[2]), mm = res.center(run[1]);
          const col = j === 0 ? C.red : C.blue;
          const bend = j === 0 ? -58 : 58, cv = curve(a, b, bend), top = cv[12], out = sub(top, mid(a, b)), ol = Math.hypot(out.x, out.y) || 1;
          f.path(cv, { stroke: col, w: 3, dash: "7 6", draw: g, opacity: fade });
          f.dot(mm, { r: 4, fill: C.soft, opacity: g * fade });
          f.label(add(top, mul(out, 16 / ol)), "한 칸 건너", { size: 14, color: col, opacity: g * fade });
        });
      }
      // 접은 뒤: 짝끼리 잇기
      if (res && xr > 0) {
        p.pairs.forEach((pr, j) => {
          const col = [C.red, C.blue, C.green][j];
          f.seg(res.center(pr[0]), res.center(pr[1]), { stroke: col, w: 3, dash: "4 5", opacity: xr, grow: xr });
        });
      }
    }
    if (demoOp > 0) {
      const dt = ease(clamp((k - 1 - 0.3) / 0.55));
      const res = drawNet(f, STRIP, dt, { psi: -28, phi: 30, sc: 120, cx: 320, cy: 190, opacity: demoOp, style: (i) => ({ sym: i === STRIP.root ? null : "o", colored: 1 }) });
      if (res && dt > 0.95) {
        const ends = [0, 1, 2].filter((i) => i !== STRIP.root);
        const a = res.center(ends[0]), b = res.center(ends[1]);
        f.seg(a, b, { stroke: C.red, w: 3, dash: "5 5", opacity: demoOp * clamp((dt - 0.95) * 20) });
        f.label(P(320, 372), "양 끝 칸이 마주 본다", { size: 18, color: C.red, opacity: demoOp * clamp((dt - 0.95) * 20) });
      }
    }
    if (k >= 5 || (k > 4.85)) bottomNote(f, "○끼리 · △끼리 · □끼리 마주 본다", { opacity: clamp((k - 4.85) / 0.15), size: 19 });
  },
};

// ── 3. 겉을 칠한 정육면체: 몇 면이 칠해졌나 ─────────────────────
const OBL = { k: 0.5, a: (40 * Math.PI) / 180 };
const painted = {
  id: "painted-cube",
  unit: "2단원 · 주사위와 쌓기나무",
  title: "겉을 칠한 정육면체, 몇 면이 칠해졌을까",
  vary: "다른 크기로",
  params(seed) {
    const n = pick([5, 3, 6, 7], seed), g = 228 / n, O = P(60, 368);
    const m = n - 2;
    return { n, g, O, m, e: 12 * m, fc: 6 * m * m, in: m * m * m };
  },
  scenes: [
    { say: (p) => `작은 정육면체를 ${p.n}개씩 ${p.n}줄 ${p.n}층으로 쌓아 큰 정육면체를 만들고, 바닥까지 겉면을 모두 칠했어요. 작은 정육면체는 몇 면씩 칠해졌을까요?`, line: (p) => `작은 정육면체 ${p.n} × ${p.n} × ${p.n} = ${p.n ** 3}개`, ms: 2000 },
    { say: "세 면이 칠해진 것은 세 겉면이 만나는 곳, 바로 큰 정육면체의 꼭짓점에 있어요. 뒤쪽·바닥 꼭짓점은 안 보여도 있어요.", line: "세 면 칠함 = 꼭짓점마다 1개 = 8개", why: "정육면체의 꼭짓점은 8개", ms: 2800 },
    { say: (p) => `두 면이 칠해진 것은 모서리 위에 있어요. 한 모서리의 ${p.n}개 중 양 끝 2개는 꼭짓점 것이니 빼요.`, line: (p) => `두 면 칠함 = (${p.n} − 2) × 12 = ${p.e}개`, why: (p) => `모서리마다 ${p.m}개, 정육면체의 모서리는 12개`, ms: 2800 },
    { say: (p) => `한 면만 칠해진 것은 겉면의 가운데에 있어요. 한 면에서 테두리 한 줄씩을 빼면 ${p.m} × ${p.m}개가 남아요.`, line: (p) => `한 면 칠함 = ${p.m} × ${p.m} × 6 = ${p.fc}개`, why: (p) => `면마다 ${p.m} × ${p.m}개, 정육면체의 면은 6개`, ms: 2800 },
    { say: "칠해진 겉 한 겹을 걷어 내면, 하나도 칠해지지 않은 속의 정육면체가 나와요.", line: (p) => `안 칠함 = ${p.m} × ${p.m} × ${p.m} = ${p.in}개`, why: (p) => `겉 한 겹을 걷으면 가로·세로·높이가 모두 2씩 줄어 ${p.m}`, ms: 2800 },
    { say: (p) => `모두 더하면 처음 개수 ${p.n ** 3}개와 꼭 맞아요. 「다른 크기로」를 눌러 보세요. 크기가 달라도 같은 까닭으로 셀 수 있어요.`, line: (p) => `8 + ${p.e} + ${p.fc} + ${p.in} = ${p.n ** 3} (빠짐도 겹침도 없다)`, why: "어떤 작은 정육면체든 칠해진 면 수가 꼭 하나로 정해진다", ms: 1800 },
  ],
  draw(f, k, p) {
    const { n, g, O } = p;
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3), s4 = phase(k, 4), s5 = phase(k, 5);
    const pr = (x, y, z) => P(O.x + g * (x + OBL.k * y * Math.cos(OBL.a)), O.y - g * (z + OBL.k * y * Math.sin(OBL.a)));
    const pop = [0, s1 * (1 - phase(k, 2, 0, 0.3)), s2 * (1 - phase(k, 3, 0, 0.3)), s3 * (1 - phase(k, 4, 0, 0.3))];
    const show = [0, s1, s2, s3];  // 색이 드러남(세 면=1, 두 면=2, 한 면=3 장면)
    const colOf = { 3: [C.redSoft, C.red], 2: [C.blueSoft, C.blue], 1: [C.greenSoft, C.green], 0: [C.purpleSoft, C.purple] };
    const sceneOf = { 3: 1, 2: 2, 1: 3 };
    const b = (v) => (v === 0 || v === n - 1 ? 1 : 0);
    const sg = (v) => (v === 0 ? -1 : v === n - 1 ? 1 : 0);
    for (let y = n - 1; y >= 0; y -= 1) for (let z = 0; z < n; z += 1) for (let x = 0; x < n; x += 1) {
      const cnt = b(x) + b(y) + b(z);
      if (cnt === 0 && s4 <= 0) continue;
      let op = s0 > 0 ? 1 : 0, dx = 0, dy = 0, dz = 0;
      if (cnt > 0) {
        const pp = pop[sceneOf[cnt]] * 0.26 + s4 * 1.4;
        dx = sg(x) * pp; dy = sg(y) * pp; dz = sg(z) * pp;
        op = 1 - s4;
        if (op <= 0.01) continue;
      }
      const X = x + dx, Y = y + dy, Z = z + dz;
      const reveal = cnt > 0 ? show[sceneOf[cnt]] : 1;
      const [cf, cs] = colOf[cnt];
      const paint = (onSurf) => (onSurf ? (reveal > 0.5 ? cf : C.orangeSoft) : C.paper);
      const strokeCol = cnt > 0 && reveal > 0.5 ? cs : C.ink;
      const sw = cnt > 0 && reveal > 0.5 ? 1.8 : 1.3;
      // 앞(y=Y) · 위(z=Z+1) · 오른쪽(x=X+1)
      f.poly([pr(X, Y, Z), pr(X + 1, Y, Z), pr(X + 1, Y, Z + 1), pr(X, Y, Z + 1)], { fill: cnt === 0 ? cf : paint(y === 0), stroke: cnt === 0 ? cs : strokeCol, w: sw, opacity: op });
      f.poly([pr(X, Y, Z + 1), pr(X + 1, Y, Z + 1), pr(X + 1, Y + 1, Z + 1), pr(X, Y + 1, Z + 1)], { fill: cnt === 0 ? cf : paint(z === n - 1), stroke: cnt === 0 ? cs : strokeCol, w: sw, opacity: op });
      f.poly([pr(X + 1, Y, Z), pr(X + 1, Y + 1, Z), pr(X + 1, Y + 1, Z + 1), pr(X + 1, Y, Z + 1)], { fill: cnt === 0 ? cf : paint(x === n - 1), stroke: cnt === 0 ? cs : strokeCol, w: sw, opacity: op });
    }
    // 겉을 걷은 뒤 큰 정육면체 테두리(겨냥도)
    if (s4 > 0) {
      const c = [[0, 0, 0], [n, 0, 0], [n, 0, n], [0, 0, n], [0, n, 0], [n, n, 0], [n, n, n], [0, n, n]].map(([a, bb, cc]) => pr(a, bb, cc));
      const vis = [[0, 1], [1, 2], [2, 3], [3, 0], [1, 5], [5, 6], [6, 2], [6, 7], [7, 3]], hid = [[0, 4], [4, 5], [4, 7]];
      vis.forEach(([i, j]) => f.seg(c[i], c[j], { stroke: C.soft, w: 1.8, opacity: s4 * 0.9 }));
      hid.forEach(([i, j]) => f.seg(c[i], c[j], { stroke: C.soft, w: 1.6, dash: "5 5", opacity: s4 * 0.9 }));
    }
    // 오른쪽 셈
    const x0 = 410, rows = [
      [1, C.red, "세 면", "8개"],
      [2, C.blue, "두 면", `${p.m} × 12 = ${p.e}개`],
      [3, C.green, "한 면", `${p.m} × ${p.m} × 6 = ${p.fc}개`],
      [4, C.purple, "안 칠함", `${p.m} × ${p.m} × ${p.m} = ${p.in}개`],
    ];
    rows.forEach(([sc, col, h, t], i) => {
      const o = phase(k, sc);
      if (o <= 0) return;
      const y = 92 + i * 70;
      f.poly([P(x0, y - 8), P(x0 + 16, y - 8), P(x0 + 16, y + 8), P(x0, y + 8)], { fill: colOf[[3, 2, 1, 0][i]][0], stroke: col, w: 2, opacity: o });
      f.label(P(x0 + 26, y), h, { anchor: "start", size: 16, color: col, opacity: o });
      f.note(P(x0, y + 28), t, { anchor: "start", size: 19, color: C.ink, opacity: o });
    });
    if (s5 > 0) bottomNote(f, `8 + ${p.e} + ${p.fc} + ${p.in} = ${p.n ** 3} = ${p.n} × ${p.n} × ${p.n}`, { opacity: s5, size: 19 });
  },
};

// ── 4. 평행선과 각 ─────────────────────────────────────────
const parallel = {
  id: "parallel-angles",
  unit: "3단원 · 시계와 각",
  title: "평행선과 만나는 각은 왜 같을까",
  vary: "다른 기울기로",
  params(seed) {
    const phi = pick([60, 118, 50, 128, 72], seed);
    const R = Math.PI / 180, cot = Math.cos(phi * R) / Math.sin(phi * R);
    const yA = 140, yB = 300, T = P(300 + 80 * cot, yA), B = P(300 - 80 * cot, yB);
    return { phi, a: 180 - phi, d: phi, T, B, yA, yB };
  },
  scenes: [
    { say: "두 직선 가와 나는 평행해요(같은 방향으로 끝없이 나란히 가요). 비스듬한 직선이 둘을 지나며 각을 만들어요. 위의 ㉠과 아래의 각들은 어떤 사이일까요?", line: (p) => `가와 나는 평행, ㉠ = ${p.a}°`, ms: 2000 },
    { say: "위쪽 만난 자리를 그대로 비스듬한 선을 따라 미끄러뜨려 아래로 내려 봐요. 가는 나에, 비스듬한 선은 제자리에 꼭 겹쳐요.", line: (p) => `동위각 ㉡ = ㉠ = ${p.a}°`, why: "가와 나의 방향이 같아서, 미끄러뜨리면 ㉠이 ㉡에 꼭 포개진다", ms: 3000 },
    { say: "아래쪽 만난 자리에서 ㉡을 반 바퀴 돌려요. 마주 보는 자리 ㉢에 꼭 겹쳐요.", line: (p) => `맞꼭지각 ㉢ = ㉡ = ${p.a}°`, why: "두 곧은 선은 반 바퀴 돌려도 제자리 → 마주 보는 각이 포개진다", ms: 2600 },
    { say: "그러면 ㉠과 ㉢은 Z자 모양의 양쪽에서 엇갈려 있는 각(엇각)이에요.", line: "엇각 ㉢ = ㉠", why: "㉠ = ㉡ 이고 ㉡ = ㉢ 이니까", ms: 2400 },
    { say: "㉣은 ㉠과 같은 쪽 안쪽에 있어요(동측내각). ㉡과 ㉣을 붙이면 비스듬한 선 위의 곧은 선이 돼요.", line: (p) => `동측내각 ㉠ + ㉣ = ${p.a}° + ${p.d}° = 180°`, why: "㉡ + ㉣ = 곧은 선 = 180° 이고, ㉡ = ㉠", ms: 2600 },
    { say: "「다른 기울기로」를 눌러 보세요. 비스듬한 선이 어떻게 기울어도 같은 까닭이 통해요.", line: "평행선: 동위각·엇각은 같고, 동측내각의 합은 180°", why: "모두 「미끄러뜨리면 포개진다」와 「곧은 선 = 180°」에서 나온다", ms: 1600 },
  ],
  draw(f, k, p) {
    const { phi, T, B, yA, yB } = p;
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3), s4 = phase(k, 4);
    const up = polar(P(0, 0), 1, phi), ext = 92;
    const tTop = add(T, mul(up, ext)), tBot = sub(B, mul(up, ext));
    f.seg(P(50, yA), P(590, yA), { w: 2.6, grow: s0 }).seg(P(50, yB), P(590, yB), { w: 2.6, grow: s0 });
    f.seg(tTop, tBot, { w: 2.4, stroke: C.ink, grow: s0 });
    // 평행 표시
    [yA, yB].forEach((y) => f.path([P(548, y - 7), P(558, y), P(548, y + 7)], { w: 2.2, opacity: s0 }));
    f.label(P(36, yA), "가", { size: 18 }).label(P(36, yB), "나", { size: 18 });
    const r = 36;
    const lab = (t, v) => (v != null ? `${t} ${v}°` : t);
    // Z자 표시(엇각)
    if (s3 > 0) {
      const zop = s3 * (1 - s4 * 0.7);
      f.path([P(T.x + 120, yA), T, B, P(B.x - 120, yB)], { stroke: C.orange, w: 6, opacity: zop * 0.45, draw: s3 });
    }
    // ㉠(위)
    f.wedge(T, phi + 180, 180 - phi, { r, color: C.red, label: lab("㉠", p.a), labelR: 62, size: 16, opacity: clamp(s0 * 2 - 1) });
    // 미끄러지는 위쪽 만남(장면 2)
    if (s1 > 0 && s1 < 1) {
      const sh = mul(sub(B, T), s1), G = add(T, sh);
      f.seg(add(P(T.x - 70, yA), sh), add(P(T.x + 70, yA), sh), { stroke: C.red, w: 2, dash: "6 5", opacity: 0.8 });
      f.wedge(G, phi + 180, 180 - phi, { r, color: C.red, fillOpacity: 0.25, opacity: 0.9 });
    }
    // ㉡(아래, 동위각)
    f.wedge(B, phi + 180, 180 - phi, { r, color: C.green, label: lab("㉡", p.a), labelR: 62, size: 16, opacity: phase(k, 1, 0.85, 1) });
    // ㉡을 반 바퀴(장면 3)
    if (s2 > 0 && s2 < 1) f.wedge(B, phi + 180 + 180 * s2, 180 - phi, { r: r + 4, color: C.green, fillOpacity: 0.2, opacity: 0.9 });
    // ㉢(엇각)
    f.wedge(B, phi, 180 - phi, { r, color: C.blue, label: lab("㉢", p.a), labelR: 62, size: 16, opacity: phase(k, 2, 0.85, 1) });
    // ㉣(동측내각)
    f.wedge(B, 0, phi, { r, color: C.orange, label: lab("㉣", p.d), labelR: 62, size: 16, opacity: s4, labelColor: "#b35f00" });
    if (s4 > 0) f.wedge(B, phi + 180, 180, { r: r + 46, color: C.purple, fillOpacity: 0, w: 2.4, opacity: s4 * (1 - phase(k, 5)) });
    f.dot(T).dot(B);
    bottomNote(f, `엇각: ㉢ = ㉡ = ㉠ = ${p.a}°`, { opacity: swap(k, 3, 4) });
    bottomNote(f, `㉠ + ㉣ = ㉡ + ㉣ = 곧은 선 = 180°`, { opacity: swap(k, 4) });
  },
};

// ── 5. 삼각형의 외각 ─────────────────────────────────────────
const exteriorTri = {
  id: "triangle-exterior",
  unit: "3단원 · 시계와 각",
  title: "삼각형의 외각은 왜 두 내각의 합일까",
  vary: "다른 삼각형으로",
  params(seed) {
    const A = pick([P(210, 112), P(330, 96), P(150, 150), P(455, 120), P(270, 160)], seed);
    const B = P(100, 320), Cc = P(390, 320), E = P(590, 320);
    const a = r0(angleAt(A, B, Cc)), b = r0(angleAt(B, A, Cc)), c = 180 - a - b;
    return { A, B, C: Cc, E, a, b, c, d: a + b };
  },
  scenes: [
    { say: "삼각형의 한 변 ㄴㄷ을 늘이면 삼각형 밖에 각 ㉣이 생겨요(외각). ㉣은 ㉠, ㉡, ㉢과 어떤 사이일까요?", line: "외각 ㉣ = ?", ms: 1800 },
    { say: "㉢과 ㉣은 늘인 곧은 선 위에서 나란히 붙어 있어요.", line: "㉢ + ㉣ = 180°", why: "ㄴㄷ을 늘인 곧은 선 = 반 바퀴", ms: 2200 },
    { say: "삼각형 안의 세 각을 모두 더하면 180°예요.", line: "㉠ + ㉡ + ㉢ = 180°", why: "삼각형 세 각의 합은 180°", ms: 2000 },
    { say: "두 식 모두 180°에서 ㉢을 빼면 남는 것을 말하고 있어요.", line: "㉣ = ㉠ + ㉡", why: "㉣도, ㉠ + ㉡도 똑같이 180° − ㉢", ms: 2200 },
    { say: "그림으로도 확인해요. ㄷ에서 ㄱㄴ과 평행한 선을 긋고, ㉡은 밑변을 따라 미끄러뜨리고, ㉠은 ㄱㄷ의 가운데 점을 중심으로 반 바퀴 돌려요.", line: "㉡(동위각)과 ㉠(엇각)이 ㉣을 빈틈없이 채운다", why: "평행선의 동위각·엇각은 같다", ms: 4000 },
    { say: (p) => `이 삼각형은 ㉣ = ${p.a}° + ${p.b}° = ${p.d}°. 「다른 삼각형으로」를 눌러도 같은 까닭이 통해요.`, line: (p) => `삼각형의 외각 = 이웃하지 않은 두 내각의 합 (${p.d}° = ${p.a}° + ${p.b}°)`, why: "어떤 삼각형이든 ㉢ + ㉣과 세 각의 합이 모두 180°", ms: 1600 },
  ],
  draw(f, k, p) {
    const { A, B, E } = p, Cc = p.C;
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3), s4 = phase(k, 4), s5 = phase(k, 5);
    const pl = phase(k, 4, 0, 0.3), mv = phase(k, 4, 0.3, 1);
    f.seg(Cc, E, { stroke: C.ink, w: 2.2, dash: "8 6", grow: s0 });
    f.poly([A, B, Cc], { draw: s0 });
    if (s1 > 0) f.seg(P(B.x - 30, B.y), P(E.x, B.y), { stroke: C.orange, w: 5, opacity: s1 * 0.55 * (1 - s2) });
    const cA = dirDeg(Cc, A), beta = dirDeg(B, A);
    const lo = clamp(s0 * 2 - 1);
    // ㉣ 외각, ㉢
    f.wedge(Cc, 0, cA, { r: 50, color: C.orange, fillOpacity: 0.22, label: s5 > 0 ? `㉣ ${p.d}°` : "㉣", labelR: 94, opacity: lo, labelColor: "#b35f00" });
    f.wedge(Cc, cA, 180 - cA, { r: 32, color: C.blue, label: "㉢", labelR: 50, opacity: lo * (1 - 0.6 * mv) });
    // ㉡ at B, ㉠ at A
    f.wedge(B, 0, beta, { r: 34, color: C.green, label: s5 > 0 ? `㉡ ${p.b}°` : "㉡", labelR: s5 > 0 ? 64 : 52, opacity: lo, fillOpacity: 0.3 * (1 - 0.5 * mv) });
    const a1 = dirDeg(A, B), a2 = dirDeg(A, Cc);
    let st = a1, sp = ((a2 - a1) % 360 + 360) % 360;
    if (sp > 180) { st = a2; sp = 360 - sp; }
    f.wedge(A, st, sp, { r: 34, color: C.red, label: s5 > 0 ? `㉠ ${p.a}°` : "㉠", labelR: s5 > 0 ? 64 : 52, opacity: lo, fillOpacity: 0.3 * (1 - 0.5 * mv) });
    // 반원 강조(장면 2)
    if (s1 > 0) f.wedge(Cc, 0, 180, { r: 66, color: C.purple, fillOpacity: 0, w: 2.2, opacity: s1 * (1 - s2) });
    // 평행선 + 옮기기(장면 5)
    if (pl > 0) {
      const M = mid(A, Cc);
      f.seg(Cc, polar(Cc, 190, beta), { stroke: C.teal, w: 2.4, dash: "8 6", grow: pl, opacity: 1 - s5 * 0.4 });
      f.seg(sub(Cc, polar(P(0, 0), 60, beta)), Cc, { stroke: C.teal, w: 2, dash: "4 6", opacity: pl * 0.5 * (1 - s5) });
      void M;
      if (mv > 0) {
        f.wedge(lerp(B, Cc, mv), 0, beta, { r: 46, color: C.green, fillOpacity: 0.45 });
        f.wedge(rot(A, M, 180 * mv), st + 180 * mv, sp, { r: 46, color: C.red, fillOpacity: 0.45 });
        if (mv < 1) f.dot(M, { r: 4, fill: C.red, opacity: Math.sin(mv * Math.PI) });
      }
    }
    f.label(add(A, P(0, -20)), "ㄱ").label(add(B, P(-16, 14)), "ㄴ").label(add(Cc, P(-6, 20)), "ㄷ").label(add(E, P(0, 20)), "ㄹ", { opacity: s0 });
    bottomNote(f, "㉢ + ㉣ = 180°", { opacity: swap(k, 1, 2) });
    bottomNote(f, "㉠ + ㉡ + ㉢ = 180°", { opacity: swap(k, 2, 3) });
    bottomNote(f, "㉣ = 180° − ㉢ = ㉠ + ㉡", { opacity: swap(k, 3, 5) });
    bottomNote(f, `㉣ = ${p.a}° + ${p.b}° = ${p.d}°`, { opacity: swap(k, 5) });
  },
};

// ── 6. 평행사변형의 넓이: 잘라 옮겨 직사각형 ─────────────────────
const parallelogram = {
  id: "parallelogram-area",
  unit: "4단원 · 평면도형의 넓이",
  title: "평행사변형의 넓이는 왜 밑변 × 높이일까",
  vary: "다른 평행사변형으로",
  params(seed) {
    const [b, h, s] = pick([[6, 4, 2], [7, 3, 3], [5, 4, 1.5], [8, 4, 3], [6, 5, 3.5]], seed), u = 40;
    const X0 = 300 - ((b + s) * u) / 2, Y0 = 320;
    const Bp = P(X0, Y0), Cp = P(X0 + b * u, Y0), Dp = P(X0 + (b + s) * u, Y0 - h * u), Ap = P(X0 + s * u, Y0 - h * u), H = P(X0 + s * u, Y0);
    return { b, h, s, u, A: Ap, B: Bp, C: Cp, D: Dp, H, area: b * h };
  },
  scenes: [
    { say: (p) => `밑변이 ${p.b}cm인 평행사변형이에요. 넓이를 구하려면 무엇을 알아야 할까요?`, line: (p) => `평행사변형 ㄱㄴㄷㄹ, 밑변 ${p.b}cm`, ms: 1600 },
    { say: "ㄱ에서 밑변에 수직인 선을 그어요. 이 길이가 높이예요.", line: (p) => `높이 ㄱㅁ = ${p.h}cm`, why: "높이는 두 밑변 사이의 거리 = 밑변에 수직인 선분의 길이", ms: 2200 },
    { say: "높이를 따라 잘라 왼쪽 삼각형 조각을 떼어 내요.", line: "높이를 따라 자르면 직각삼각형 조각 하나", why: "높이가 밑변과 수직이라 자른 자리가 직각", ms: 1800 },
    { say: "조각을 밑변을 따라 오른쪽으로 밀어요. 비스듬한 변이 반대쪽 비스듬한 변에 꼭 맞아요.", line: "조각이 오른쪽 빈자리에 빈틈없이 맞는다", why: "ㄱㄴ과 ㄹㄷ은 마주 보는 변이라 평행하고 길이가 같다", ms: 2800 },
    { say: (p) => `직사각형이 됐어요. 가로는 밑변 ${p.b}cm, 세로는 높이 ${p.h}cm 그대로예요.`, line: (p) => `넓이 = ${p.b} × ${p.h} = ${nf(p.area)}㎠`, why: "자르고 옮겨도 넓이는 그대로, 직사각형 넓이 = 가로 × 세로", ms: 2200 },
    { say: "「다른 평행사변형으로」를 눌러 보세요. 얼마나 기울어졌든 같은 방법이 통해요.", line: "평행사변형의 넓이 = 밑변 × 높이", why: "어느 평행사변형도 높이를 따라 잘라 옮기면 밑변·높이가 같은 직사각형", ms: 1600 },
  ],
  draw(f, k, p) {
    const { A, B, D, H, u } = p, Cc = p.C;
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3), s4 = phase(k, 4);
    const shift = P(p.b * u * s3, 0), lift = P(-10 * s2 * (1 - s3), 8 * s2 * (1 - s3));
    const piece = [A, B, H].map((q) => add(add(q, shift), lift));
    if (s2 === 0) f.poly([A, B, Cc, D], { draw: s0, fill: C.blueSoft, stroke: C.blue, w: 2.6 });
    else {
      f.poly([A, H, Cc, D], { fill: C.blueSoft, stroke: C.blue, w: 2.6 });
      f.poly(piece, { fill: C.orangeSoft, stroke: C.orange, w: 2.6 });
    }
    // 눈금(직사각형)
    if (s4 > 0) {
      for (let i = 1; i < p.b; i += 1) f.seg(P(H.x + i * u, H.y), P(H.x + i * u, A.y), { stroke: C.blue, w: 1, opacity: s4 * 0.45 });
      for (let j = 1; j < p.h; j += 1) f.seg(P(H.x, H.y - j * u), P(H.x + p.b * u, H.y - j * u), { stroke: C.blue, w: 1, opacity: s4 * 0.45 });
    }
    // 높이
    f.seg(A, H, { stroke: C.purple, w: 2.6, dash: "7 6", grow: s1, opacity: s1 });
    f.right(H, A, Cc, { opacity: s1, color: C.purple });
    dimLen(f, A, H, `${nf(p.h)}cm`, { side: -1, off: 18, color: C.purple, opacity: s1 * (1 - s4) });   // 높이(오른쪽으로 휜 호)
    // 밑변 길이
    // 조각을 밀면 밑변도 ㅁ에서 시작하는 직사각형 아랫변으로 함께 옮겨 간다(길이는 그대로). 아래의 ㅁ·ㄷ 이름보다 더 아래로
    const slide = P(p.s * u * s3, 0);
    dimLen(f, add(B, slide), add(Cc, slide), `밑변 ${nf(p.b)}cm`, { side: 1, off: 38, opacity: clamp(s0 * 2 - 1) * (1 - phase(k, 4, 0, 0.3)) });
    if (s4 > 0) {
      const R1 = H, R2 = add(H, P(p.b * u, 0));
      dimLen(f, R1, R2, `가로 ${nf(p.b)}cm`, { side: 1, off: 38, opacity: phase(k, 4, 0.3, 1) });
      dimLen(f, R2, P(R2.x, A.y), `세로 ${nf(p.h)}cm`, { side: 1, off: 22, opacity: s4 });
    }
    // 같은 변 표시(장면 4)
    f.ticks(piece[0], piece[1], { n: 2, opacity: s3 * (1 - s4), color: C.orange }).ticks(D, Cc, { n: 2, opacity: s3 * (1 - s4), color: C.orange });
    f.label(add(A, P(-4, -18)), "ㄱ").label(add(B, P(-16, 12)), "ㄴ", { opacity: 1 - s3 }).label(add(Cc, P(4, 18)), "ㄷ").label(add(D, P(12, -14)), "ㄹ");
    f.label(add(H, P(-12, 18)), "ㅁ", { opacity: s1 * (1 - s4), color: C.purple });
    if (s4 > 0) bottomNote(f, `평행사변형 넓이 = 직사각형 넓이 = ${nf(p.b)} × ${nf(p.h)} = ${nf(p.area)}㎠`, { opacity: s4, size: 19 });
  },
};

// ── 7. 삼각형의 넓이: 두 개 붙이면 평행사변형 ───────────────────
const triArea = {
  id: "triangle-area",
  unit: "4단원 · 평면도형의 넓이",
  title: "삼각형의 넓이는 왜 밑변 × 높이 ÷ 2일까",
  vary: "다른 삼각형으로",
  params(seed) {
    const [b, h, s, s2] = pick([[6, 4, 2, 8], [5, 5, 4, -2], [7, 3, 1, 8.5], [6, 5, 6, 1], [8, 3, 3, -2]], seed), u = 38;
    const lo = Math.min(0, s2), hi = Math.max(b + s, s2), X0 = 320 - ((lo + hi) * u) / 2 - 10, Y0 = 320;
    const at = (x, y) => P(X0 + x * u, Y0 - y * u);
    return { b, h, s, s2, u, at, area: (b * h) / 2 };
  },
  scenes: [
    { say: (p) => `밑변이 ${p.b}cm, 높이가 ${p.h}cm인 삼각형이에요. 넓이를 어떻게 구할까요?`, line: (p) => `삼각형 ㄱㄴㄷ: 밑변 ${p.b}cm, 높이 ${p.h}cm`, ms: 1600 },
    { say: "똑같은 삼각형을 하나 더 만들어 변 ㄱㄷ의 가운데 점을 중심으로 반 바퀴 돌려 붙여요.", line: "똑같은 삼각형 두 개 → 평행사변형 ㄱㄴㄷㄹ", why: "반 바퀴 돌리면 ㄱㄷ이 제자리에 와 꼭 맞고, 마주 보는 변이 평행해진다", ms: 2800 },
    { say: "평행사변형의 넓이는 밑변 × 높이예요. 삼각형은 그 절반이에요.", line: (p) => `삼각형 = ${p.b} × ${p.h} ÷ 2 = ${nf(p.area)}㎠`, why: "평행사변형 넓이 = 밑변 × 높이, 똑같은 두 조각 중 하나", ms: 2400 },
    { say: "이제 꼭짓점 ㄱ을 밑변과 평행한 선을 따라 움직여 봐요. 모양은 달라져도 밑변과 높이는 그대로예요.", line: "ㄱ이 평행선 위를 움직여도 밑변·높이는 그대로", why: "평행한 두 선 사이의 거리는 어디서나 같다", ms: 3400 },
    { say: "「다른 삼각형으로」를 눌러 보세요. 뾰족하든 둔하든 같은 까닭이에요.", line: "밑변과 높이가 같으면 모양과 상관없이 넓이가 같다", why: "삼각형 넓이 = 밑변 × 높이 ÷ 2 에는 밑변과 높이만 들어간다", ms: 1600 },
  ],
  draw(f, k, p) {
    const { b, h, s, s2, at } = p;
    const s0 = phase(k, 0), s1 = phase(k, 1), s2p = phase(k, 2), s3 = phase(k, 3), s4 = phase(k, 4);
    const ax = s + (s2 - s) * s3;
    const A = at(ax, h), B = at(0, 0), Cc = at(b, 0), M = mid(at(s, h), Cc);
    // 평행선(꼭짓점이 다니는 길)
    f.seg(at(Math.min(0, s2) - 1, h), at(Math.max(b + s, s2) + 1, h), { stroke: C.teal, w: 2, dash: "6 6", opacity: s3 * 0.9 });
    f.seg(at(Math.min(0, s2, s) - 1, 0), at(Math.max(b + s, s2) + 1, 0), { stroke: C.soft, w: 1.6, dash: "6 6", opacity: 0.6 * clamp(s0 * 2 - 1) });
    // 지나간 모양(흐리게)
    if (s3 > 0) [0.33, 0.66].forEach((t) => { if (s3 > t) f.poly([at(s + (s2 - s) * t, h), B, Cc], { fill: "none", stroke: C.soft, w: 1.6, dash: "5 5", opacity: 0.8 }); });
    // 복사본(반 바퀴)
    const copyOp = s1 > 0 ? 1 - s3 * 1.0 : 0;
    if (copyOp > 0) {
      const A0 = at(s, h);
      const cp = [A0, B, Cc].map((q) => rot(q, M, 180 * s1));
      f.poly(cp, { fill: C.orangeSoft, stroke: C.orange, w: 2.4, opacity: copyOp });
      f.label(add(rot(B, M, 180 * s1), P(14, -12)), "ㄹ", { opacity: copyOp * s1, color: C.orange });
    }
    f.poly([A, B, Cc], { fill: C.blueSoft, stroke: C.blue, w: 2.6, draw: s0 });
    // 높이
    const foot = at(ax, 0);
    f.seg(A, foot, { stroke: C.purple, w: 2.4, dash: "7 6", opacity: clamp(s0 * 2 - 1) });
    f.right(foot, A, ax <= b - 0.6 ? Cc : B, { color: C.purple, opacity: clamp(s0 * 2 - 1) });
    // 높이의 호는 가운데 높이에서 변까지 자리가 더 넓은 쪽으로(꼭짓점이 움직이면 부드럽게 넘어간다)
    const roomL = ax > 0 ? ax / 2 : 99, roomR = ax < b ? (b - ax) / 2 : 99;
    dimLen(f, A, foot, `${nf(h)}cm`, { side: -clamp((roomR - roomL) * 2, -1, 1), off: 14, color: C.purple, opacity: clamp(s0 * 2 - 1) });
    dimLen(f, B, Cc, `${nf(b)}cm`, { side: 1, off: 20, opacity: clamp(s0 * 2 - 1) });
    f.label(add(A, P(0, -18)), "ㄱ").label(add(B, P(-14, 12)), "ㄴ").label(add(Cc, P(12, 14)), "ㄷ");
    if (s1 > 0 && s1 < 1) f.dot(M, { r: 4.5, fill: C.orange });
    bottomNote(f, `평행사변형 ${nf(b)} × ${nf(h)} = ${nf(b * h)} → 삼각형 ${nf(b * h)} ÷ 2 = ${nf(p.area)}㎠`, { opacity: swap(k, 2, 3), size: 19 });
    bottomNote(f, `넓이는 그대로 ${nf(b)} × ${nf(h)} ÷ 2 = ${nf(p.area)}㎠`, { opacity: swap(k, 3), size: 19 });
    void s2p;
    void s4;
  },
};

// ── 8. 대각선이 수직인 사각형의 넓이 ────────────────────────────
const perpDiag = {
  id: "perpendicular-diagonals",
  unit: "4단원 · 평면도형의 넓이",
  title: "대각선이 수직인 사각형의 넓이는 왜 두 대각선의 곱 ÷ 2일까",
  vary: "다른 사각형으로",
  params(seed) {
    const s = pick([
      { l: 5, r: 5, t: 3, d: 3, name: "마름모" },
      { l: 3, r: 3, t: 2, d: 5, name: "연 모양 사각형" },
      { l: 4, r: 4, t: 4, d: 4, name: "정사각형" },
      { l: 2, r: 6, t: 4, d: 2, name: "사각형" },
      { l: 2, r: 5, t: 3, d: 3, name: "연 모양 사각형" },
    ], seed), u = 30;
    const w = s.l + s.r, hh = s.t + s.d;
    const O = P(240 - ((s.r - s.l) * u) / 2, 205 - ((s.d - s.t) * u) / 2);
    const U = P(O.x, O.y - s.t * u), D = P(O.x, O.y + s.d * u), L = P(O.x - s.l * u, O.y), R = P(O.x + s.r * u, O.y);
    return { ...s, u, O, U, D, L, R, w, hh, area: (w * hh) / 2 };
  },
  scenes: [
    { say: (p) => `두 대각선이 서로 수직으로 만나는 ${p.name}이에요. 대각선의 길이는 ${p.w}cm와 ${p.hh}cm예요. 넓이를 구해 봐요.`, line: (p) => `대각선 ㄴㄹ = ${p.w}cm, ㄱㄷ = ${p.hh}cm, 서로 수직`, ms: 1800 },
    { say: "네 꼭짓점을 지나면서 대각선과 나란한 선을 그어, 사각형을 감싸는 직사각형을 만들어요.", line: (p) => `감싼 직사각형: 가로 ${p.w}cm, 세로 ${p.hh}cm`, why: "가로는 대각선 ㄴㄹ, 세로는 대각선 ㄱㄷ과 길이가 같다", ms: 2200 },
    { say: "두 대각선이 직사각형을 작은 직사각형 4개로 나눠요. 작은 직사각형마다 사각형의 한 변이 대각선이 되어 둘로 나눠요.", line: "작은 직사각형마다 안쪽 삼각형 하나 + 바깥 삼각형 하나", why: "대각선이 수직이라 네 조각이 모두 직사각형", ms: 2400 },
    { say: "바깥 삼각형을 그 변의 가운데 점을 중심으로 반 바퀴 돌려 봐요. 안쪽 삼각형에 꼭 겹쳐요.", line: "바깥 4조각 = 안쪽 4조각", why: "직사각형을 대각선으로 자른 두 삼각형은 똑같다", ms: 3400 },
    { say: "그러니 사각형은 감싼 직사각형의 꼭 절반이에요.", line: (p) => `넓이 = ${p.w} × ${p.hh} ÷ 2 = ${nf(p.area)}㎠`, why: "안쪽(사각형) = 바깥, 둘을 합치면 직사각형", ms: 2000 },
    { say: "「다른 사각형으로」를 눌러 보세요. 대각선이 수직이기만 하면 마름모·정사각형·연 모양 모두 같은 까닭이에요.", line: "대각선이 수직인 사각형의 넓이 = 두 대각선의 곱 ÷ 2", why: "대각선이 만나는 자리가 어디든 네 조각이 직사각형", ms: 1600 },
  ],
  draw(f, k, p) {
    const { O, U, D, L, R } = p;
    const s0 = phase(k, 0), s1 = phase(k, 1), s2 = phase(k, 2), s3 = phase(k, 3), s4 = phase(k, 4);
    const K = { ur: P(R.x, U.y), ul: P(L.x, U.y), dl: P(L.x, D.y), dr: P(R.x, D.y) };
    const quads = [[K.ur, U, R], [K.ul, U, L], [K.dl, D, L], [K.dr, D, R]];
    f.poly([K.ul, K.ur, K.dr, K.dl], { fill: "none", stroke: C.orange, w: 2.2, dash: "7 6", draw: s1, opacity: s1 });
    // 바깥 삼각형(장면 3부터)
    if (s2 > 0) quads.forEach(([c, a, b], i) => {
      const t = phase(k, 3, i * 0.15, 0.55 + i * 0.15), m = mid(a, b);
      f.poly([c, a, b].map((q) => rot(q, m, 180 * t)), { fill: C.orangeSoft, stroke: C.orange, w: 2, opacity: s2 * (1 - 0.65 * s4), fillOpacity: 0.85 });
    });
    f.poly([U, R, D, L], { fill: C.purpleSoft, stroke: C.purple, w: 2.8, draw: s0, fillOpacity: s3 > 0 ? 0.55 : 0.9 });
    // 대각선
    f.seg(L, R, { stroke: C.ink, w: 2, dash: "6 5", opacity: clamp(s0 * 2 - 1) });
    f.seg(U, D, { stroke: C.ink, w: 2, dash: "6 5", opacity: clamp(s0 * 2 - 1) });
    f.right(O, R, U, { opacity: clamp(s0 * 2 - 1) * (1 - s2) });
    // 길이 표시
    dimLen(f, K.dl, K.dr, `${p.w}cm`, { away: O, off: 24, opacity: s1, color: "#b35f00" });
    dimLen(f, K.ur, K.dr, `${p.hh}cm`, { away: O, off: 24, opacity: s1, color: "#b35f00" });
    f.label(add(U, P(0, -18)), "ㄱ").label(add(L, P(-16, 0)), "ㄴ").label(add(D, P(0, 18)), "ㄷ").label(add(R, P(16, 0)), "ㄹ");
    const x = 628;
    if (s4 > 0) {
      f.note(P(x, 34), `직사각형 ${p.w} × ${p.hh} = ${p.w * p.hh}`, { anchor: "end", size: 18, opacity: s4 });
      f.note(P(x, 64), `사각형 = 그 절반`, { anchor: "end", size: 18, opacity: s4, color: C.purple });
      bottomNote(f, `${p.w} × ${p.hh} ÷ 2 = ${nf(p.area)}㎠`, { opacity: s4 });
    }
  },
};

export const PROOFS = [halfTurn, netOpp, painted, parallel, exteriorTri, parallelogram, triArea, perpDiag];
void dist;
