// 골든벨 그림·말 규칙 검사 — 스킬 `.claude/skills/golden-bell-figure-style` 의 기계 점검 부분.
// node fields-classic/question-bank/golden-bell-style-audit.mjs
// 1) 4권 그림 파일에 옛 청록(한 색으로 몰던 색)이 남았는지
// 2) 골든벨 화면 틀(제목·표지·인쇄 창)에 회사 이름이 보이는지
// 3) 공개 문항의 화면 글자에 각도·분수 말(°·¼·½·¾·90도…)이 있는지 (메모 칸·id는 제외)
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js";

const here = (name) => fileURLToPath(new URL(`./${name}`, import.meta.url));
const problems = [];

const BANNED_COLORS = [/#2f7f96/i];
for (const file of ["golden-bell-book04.css", "golden-bell-book04-guided.js", "book04-renderers.js"]) {
  readFileSync(here(file), "utf8").split("\n").forEach((line, index) => {
    if (BANNED_COLORS.some((re) => re.test(line))) problems.push(`${file}:${index + 1} 옛 청록 색`);
  });
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
