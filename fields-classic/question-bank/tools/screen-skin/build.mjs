#!/usr/bin/env node
// 문제은행 편집 화면(index.html)의 화면 틀을 워밍업 학습 화면 결로 — 원장 2026-11-10 「디자인을 워밍업 학습 화면 같이 바꿔」.
//
// 하는 일
//  1) styles.css · print-templates.css 안의 「누런 중간색」(종이색·갈색 글씨·베이지 선) 여섯 자리 색을
//     var(--wRRGGBB,#RRGGBB) 로 감싼다. 변수가 없으면 뒤의 원래 색이 그대로 쓰인다.
//  2) styles.css 맨 끝에 화면 전용(@media screen) 표를 만든다: 문제은행 화면(body.bank-ui, 학생 화면 제외)에서만
//     그 변수에 워밍업 색(회청색 글씨·선·바탕)을 넣고, 학습지 종이 영역(PAPER)에서는 다시 비운다.
//  → 화면 틀만 바뀌고, 학습지 종이·미리보기·인쇄(@media print)·다른 화면(워밍업·덱 안 학습지·게임)은 원래 색 그대로다.
//     규칙의 차례·세기는 하나도 건드리지 않는다(색 글자만 감싼다).
//
// 쓰는 법   node fields-classic/question-bank/tools/screen-skin/build.mjs          감싸고 표를 다시 만든다(여러 번 돌려도 같다)
//           node fields-classic/question-bank/tools/screen-skin/build.mjs --check  안 감싼 색·낡은 표가 있으면 실패
// styles.css · print-templates.css 에 색을 새로 쓰면 이 도구를 다시 돌리고 캐시 꼬리표를 올린다.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const FILES = ["styles.css", "print-templates.css"];
const HOST = "styles.css";
const START = "/* ▼▼ screen-skin — tools/screen-skin/build.mjs 가 만든다. 손으로 고치지 말 것 ▼▼ */";
const END = "/* ▲▲ screen-skin ▲▲ */";
const SCOPE = "body.bank-ui:not(.as-student)";
// 학습지 종이: 인쇄물과 같은 색이어야 하는 곳(문항·그림·학습지 머리·표지/내지·답안 표·표지 시안 그림(.cv-thumb)·편집 화면의 문제 미리보기)
const PAPER = [".question-grid", ".worksheet-head", ".pt-lead", ".ed-q", ".visual", ".answer-dialog table", ".cv-thumb", ".watermark"];
// 종이 안에 있지만 화면 단추인 것(다시 워밍업 색)
const ISLANDS = [".question-edit-tools"];

// ── 색 ──
const hex = (r, g, b) => "#" + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
const rgbOf = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
function hueOf([r, g, b]) {
  const max = Math.max(r, g, b), min = Math.min(r, g, b), c = max - min;
  if (!c) return -1;
  let h = max === r ? ((g - b) / c) % 6 : max === g ? (b - r) / c + 2 : (r - g) / c + 4;
  h *= 60; return h < 0 ? h + 360 : h;
}
// 누런 중간색인가: 빛깔이 주황~노랑 쪽이고 물이 옅은 색. 금색 강조·노란 형광·초록·빨강은 아니다.
export function isWarmNeutral(h6) {
  const rgb = rgbOf(h6), max = Math.max(...rgb), min = Math.min(...rgb), c = max - min, hue = hueOf(rgb);
  if (hue < 18 || hue > 62) return false;
  if (max >= 235) return c >= 3 && c <= 26;
  return c >= 4 && c / max <= 0.42;
}
const lerp = (a, b, t) => a + (b - a) * t;
const ramp = (pts, x) => { for (let i = 1; i < pts.length; i += 1) if (x <= pts[i][0]) return lerp(pts[i - 1][1], pts[i][1], (x - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0])); return pts.at(-1)[1]; };
// 워밍업 학습 화면의 회청색으로: 밝기는 그대로, 빛깔과 물만 바꾼다(글씨 #172c36 · 흐린 글씨 #506269 · 선 #aebcba/#d3dcda · 바탕 #edf1ef 에 맞춘 곡선)
export function coolOf(h6) {
  const [r, g, b] = rgbOf(h6).map((v) => v / 255), max = Math.max(r, g, b), min = Math.min(r, g, b), L = (max + min) / 2;
  const H = ramp([[0, 197], [0.55, 197], [0.9, 162], [1, 158]], L);
  const S = ramp([[0, 0.42], [0.15, 0.4], [0.36, 0.15], [0.46, 0.09], [0.71, 0.09], [0.85, 0.11], [0.94, 0.13], [1, 0.13]], L);
  const C = (1 - Math.abs(2 * L - 1)) * S, X = C * (1 - Math.abs(((H / 60) % 2) - 1)), m = L - C / 2;
  const [r1, g1, b1] = H < 60 ? [C, X, 0] : H < 120 ? [X, C, 0] : H < 180 ? [0, C, X] : H < 240 ? [0, X, C] : H < 300 ? [X, 0, C] : [C, 0, X];
  return hex((r1 + m) * 255, (g1 + m) * 255, (b1 + m) * 255);
}

// ── 건너뛸 곳: 주석 · 따옴표 · url(…) · @media print { … } ──
function skipRanges(css) {
  const ranges = []; let i = 0;
  const upto = (from, close) => { const end = css.indexOf(close, from); return end < 0 ? css.length : end + close.length; };
  while (i < css.length) {
    const ch = css[i];
    if (ch === "/" && css[i + 1] === "*") { const end = upto(i + 2, "*/"); ranges.push([i, end]); i = end; continue; }
    if (ch === '"' || ch === "'") { let j = i + 1; while (j < css.length && css[j] !== ch) j += css[j] === "\\" ? 2 : 1; ranges.push([i, j + 1]); i = j + 1; continue; }
    if (css.startsWith("url(", i)) { const end = upto(i, ")"); ranges.push([i, end]); i = end; continue; }
    if (css.startsWith("@media", i)) {
      const open = css.indexOf("{", i), head = css.slice(i, open);
      if (/\bprint\b/.test(head) && !/\bscreen\b/.test(head)) {
        let depth = 0, j = open;
        for (; j < css.length; j += 1) { if (css[j] === "{") depth += 1; else if (css[j] === "}") { depth -= 1; if (!depth) break; } }
        ranges.push([i, j + 1]); i = j + 1; continue;
      }
    }
    i += 1;
  }
  return ranges;
}
const inside = (ranges, pos) => { let lo = 0, hi = ranges.length - 1; while (lo <= hi) { const mid = (lo + hi) >> 1; if (pos < ranges[mid][0]) hi = mid - 1; else if (pos >= ranges[mid][1]) lo = mid + 1; else return true; } return false; };
// 이 자리가 사용자 정의 변수(--이름: 값) 선언 안인가 → { name, selector } 아니면 null
function customPropAt(css, pos) {
  let j = pos; while (j > 0 && css[j - 1] !== ";" && css[j - 1] !== "{" && css[j - 1] !== "}") j -= 1;
  const decl = css.slice(j, pos).trim(), match = decl.match(/^(--[\w-]+)\s*:/);
  if (!match) return null;
  let k = j; let depth = 0; while (k > 0) { k -= 1; if (css[k] === "}") depth += 1; else if (css[k] === "{") { if (!depth) break; depth -= 1; } }
  let s = k; while (s > 0 && css[s - 1] !== "}" && css[s - 1] !== "{" && css[s - 1] !== ";") s -= 1;
  return { name: match[1], selector: css.slice(s, k).trim(), whole: /^(--[\w-]+)\s*:\s*$/.test(decl) };
}

function strip(css) {
  const a = css.indexOf(START), b = css.indexOf(END);
  if (a >= 0 && b > a) css = css.slice(0, a).replace(/\s+$/, "\n") + css.slice(b + END.length).replace(/^\s+/, "");
  return css.replace(/var\(--w([0-9a-f]{6}),#\1\)/g, "#$1");
}

function wrap(css, table, rootVars) {
  const ranges = skipRanges(css); let out = "", last = 0, count = 0;
  for (const match of css.matchAll(/#([0-9a-fA-F]{6})(?![0-9a-fA-F])/g)) {
    const pos = match.index, h6 = "#" + match[1].toLowerCase();
    if (inside(ranges, pos) || !isWarmNeutral(h6)) continue;
    const custom = customPropAt(css, pos);
    if (custom) { if (custom.whole && /^:root\b/.test(custom.selector) && /^\s*[;}]/.test(css.slice(pos + 7, pos + 9) + ";")) rootVars.set(custom.name, h6); continue; }
    table.set(h6, coolOf(h6));
    out += css.slice(last, pos) + `var(--w${h6.slice(1)},${h6})`; last = pos + 7; count += 1;
  }
  return { css: out + css.slice(last), count };
}

const FINISH = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "finish.css"), "utf8").trim();

function block(table, rootVars) {
  const keys = [...table.keys()].sort();
  const cool = [...[...rootVars].map(([name, h6]) => `${name}:${coolOf(h6)}`), ...keys.map((h6) => `--w${h6.slice(1)}:${table.get(h6)}`)].join(";");
  const back = [...[...rootVars].map(([name, h6]) => `${name}:${h6}`), ...keys.map((h6) => `--w${h6.slice(1)}:initial`)].join(";");
  const paper = `:is(${PAPER.join(",")})`;
  return [START,
    "@media screen{",
    `${SCOPE},${SCOPE} :is(${ISLANDS.join(",")}){${cool}}`,
    `${SCOPE} ${paper}{${back}}`,
    `${SCOPE} :where(${paper}:not(${paper} *)){color:var(--ink)}`,
    FINISH,
    "}",
    END, ""].join("\n");
}

const check = process.argv.includes("--check");
const table = new Map(), rootVars = new Map(), results = {};
let total = 0, stale = false;
for (const name of FILES) {
  const path = join(ROOT, name), before = readFileSync(path, "utf8");
  const { css, count } = wrap(strip(before), table, rootVars);
  results[name] = { path, before, css }; total += count;
}
results[HOST].css = results[HOST].css.replace(/\s+$/, "\n") + "\n" + block(table, rootVars);
for (const name of FILES) {
  const { path, before, css } = results[name];
  if (before !== css) { stale = true; if (!check) writeFileSync(path, css); }
}
console.log(`screen-skin: 감싼 색 ${total}곳 · 색 ${table.size}가지 · 바탕 변수 ${rootVars.size}개 · ${check ? (stale ? "낡았음 — 도구를 다시 돌릴 것" : "최신") : (stale ? "다시 씀" : "바뀐 것 없음")}`);
if (check && stale) process.exit(1);
