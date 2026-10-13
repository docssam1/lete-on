// 골든벨 그림·말 규칙 검사 — 스킬 `.claude/skills/golden-bell-figure-style` 의 기계 점검 부분.
// node fields-classic/question-bank/golden-bell-style-audit.mjs
// 1) 2·3·4권 그림 규칙(CSS·렌더러)에 옛 청록 계열 색이 남았는지 (STYLE_SCOPE=book2 처럼 권만 골라 볼 수 있다)
// 2) 골든벨 화면 틀(제목·표지·인쇄 창)에 회사 이름이 보이는지
// 3) 공개 문항의 화면 글자에 각도·분수 말(°·¼·½·¾·90도…)이 있는지 (메모 칸·id는 제외)
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js";

const here = (name) => fileURLToPath(new URL(`./${name}`, import.meta.url));
const problems = [];

// 옛 청록(한 색으로 몰던 하늘색·청록 계열)을 색상각으로 잡는다. 값 하나만 막으면 비슷한 다른 청록이 빠져나간다.
const TEAL_ALLOW = new Set(["#1aa3c9", "#dff3ff"]); // 보기 ①~⑧ 무지개의 하늘색, 숫자판 파스텔 칸 — 일부러 고른 색
const hexToHsl = (hex) => {
  let h = hex.slice(1);
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
  if (!d) return { h: 0, s: 0, l };
  const s = d / (1 - Math.abs(2 * l - 1));
  const hue = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: (hue * 60 + 360) % 360, s, l };
};
const isOldTeal = (hex) => {
  if (TEAL_ALLOW.has(hex.toLowerCase())) return false;
  const { h, s } = hexToHsl(hex);
  return h >= 178 && h <= 212 && s >= 0.2;
};
// 권별 그림 규칙. golden-bell.css는 여러 권이 같이 쓰므로 선택자로 그 권 그림만 고른다.
const SCOPES = {
  book2: /\.(b2-|book02-visual|guided-book2-source|matrix-(shape|equation|target|panel)|shape-matrix-grid|dual-pattern|promise-(set|diamond)|similar-(shape-sum|balance|pattern|center-rules)|guided-(substitution|balance|pattern|promise|equation|shape-token|order-chain|cycle-key|reverse-rule))/,
  book3: /\.(b3-|book03-visual|guided-book3-source|guided-(six-bundle|multiple|cryptarithm|magic))/,
  book4: /\.(b4-|polyomino-|balance-(substitution|tokens|load|beam|stand|unit|set|question|target)|direction-|hidden-cube|cube-height-map|guided-relative-order|source-balance-board)/,
};
const SCOPE_JS = { book2: ["book02-renderers.js"], book3: ["book03-renderers.js"], book4: ["book04-renderers.js", "golden-bell-book04-guided.js"] };
const activeScopes = (process.env.STYLE_SCOPE || "book2,book3,book4").split(",");
const lineOf = (text, index) => text.slice(0, index).split("\n").length;
for (const file of ["golden-bell.css", "golden-bell-book02.css", "golden-bell-book03.css", "golden-bell-book04.css"]) {
  const text = readFileSync(here(file), "utf8").replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " "));
  for (const rule of text.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const scope = activeScopes.find((name) => SCOPES[name]?.test(rule[1]));
    if (!scope) continue;
    for (const color of rule[2].match(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b/gi) || []) {
      if (isOldTeal(color)) problems.push(`${file}:${lineOf(text, rule.index)} 옛 청록 ${color} (${scope}) ${rule[1].trim().slice(0, 60)}`);
    }
  }
}
for (const scope of activeScopes) {
  for (const file of SCOPE_JS[scope] || []) {
    readFileSync(here(file), "utf8").split("\n").forEach((line, index) => {
      for (const color of line.match(/#[0-9a-f]{6}\b/gi) || []) if (isOldTeal(color)) problems.push(`${file}:${index + 1} 옛 청록 ${color} (${scope})`);
    });
  }
}

const BRAND = /\bFC\b|필즈|FIELDS CLASSIC|Fields Classic/u;
for (const file of ["golden-bell.html", "golden-bell.js", "golden-bell-library.js", "golden-bell-guided-experiences.js", "golden-bell-book04-guided.js", "book04-renderers.js"]) {
  readFileSync(here(file), "utf8").split("\n").forEach((line, index) => {
    const code = line.replace(/\/\/.*$/, "").replace(/<!--.*?-->/g, "");
    if (BRAND.test(code)) problems.push(`${file}:${index + 1} 회사 이름: ${code.trim().slice(0, 80)}`);
  });
}

// 화면에 나오지 않는 칸: 원본 대조 메모·내부 식별자.
const SKIP_KEYS = new Set(["id", "answerRef", "operation", "family", "type", "learnerStage", "sourceDiscrepancy", "sourceLocator", "sourceHold", "sourceCoverage", "sourceNote", "note"]);
const ANGLE_FRACTION = /[°¼½¾]|(?:90|180|270|360)\s*도/u;
for (const book of GOLDEN_BELL_BOOKS) {
  const walk = (value, path) => {
    if (typeof value === "string") {
      if (ANGLE_FRACTION.test(value)) problems.push(`${path} 각도·분수 말: ${value.slice(0, 80)}`);
      if (BRAND.test(value)) problems.push(`${path} 회사 이름: ${value.slice(0, 80)}`);
      return;
    }
    if (value && typeof value === "object") {
      for (const [key, child] of Object.entries(value)) {
        if (!SKIP_KEYS.has(key) && !/(Id|Ref)$/.test(key)) walk(child, `${path}.${key}`);
      }
    }
  };
  walk(book, book.id);
}

if (problems.length) {
  console.error(`GOLDEN_BELL_STYLE_FAIL ${problems.length}건`);
  problems.forEach((problem) => console.error(`  ${problem}`));
  process.exit(1);
}
console.log(`GOLDEN_BELL_STYLE_OK books=${GOLDEN_BELL_BOOKS.length} colors=pass brand=pass wording=pass`);
