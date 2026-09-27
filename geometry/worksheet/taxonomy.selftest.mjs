// GW_GEN 대영역·소영역·세부유형(taxonomy) 자체 검사.
//
// generators.js는 UMD IIFE라 ESM에서 바로 import할 수 없으므로 createRequire로
// CommonJS처럼 불러온다 — question-bank.selftest.cjs와 같은 로딩 방식이다.
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
require("./generators.js");
require("./taxonomy.js");
const GEN = global.GW_GEN;

// 사람이 확인한 정답표 — taxonomy.js 안의 TYPE_TAXONOMY를 베끼지 않고
// 독립적으로 다시 적어, 복사-붙여넣기 오타나 표 자체의 실수를 잡는다.
const EXPECTED = {
  TC: { domain: "입체", area: "바탕그림" },
  VC: { domain: "입체", area: "바탕그림" },
  VM: { domain: "입체", area: "바탕그림" },
  VP: { domain: "입체", area: "바탕그림" },
  IC: { domain: "입체", area: "개수 세기" },
  IH: { domain: "입체", area: "개수 세기" },
  IN: { domain: "입체", area: "개수 세기" },
  CO: { domain: "입체", area: "개수 세기" },
  HC: { domain: "입체", area: "개수 세기" },
  FB: { domain: "입체", area: "상자와 완성" },
  CU: { domain: "입체", area: "상자와 완성" },
  MV: { domain: "입체", area: "조각과 재구성" },
  CJ: { domain: "입체", area: "조각과 재구성" },
  CP: { domain: "입체", area: "조각과 재구성" },
  PS: { domain: "입체", area: "조각과 재구성" },
  PN: { domain: "입체", area: "색칠과 무늬" },
  BW: { domain: "입체", area: "색칠과 무늬" },
  HL: { domain: "입체", area: "색칠과 무늬" },
  SQ: { domain: "규칙", area: "쌓기나무 규칙" }
};
const EXPECTED_CODES = Object.keys(EXPECTED);

let passed = 0;
function ok(cond, msg) {
  assert.ok(cond, msg);
  passed += 1;
}
function eq(a, b, msg) {
  assert.deepEqual(a, b, msg);
  passed += 1;
}

// 1. 정확히 19개 유형이며 기존 TYPES와 EXPECTED의 코드 집합이 완전히 같다.
eq(GEN.TYPES.length, 19, "TYPES must have exactly 19 entries");
eq(new Set(GEN.TYPES.map((t) => t.code)), new Set(EXPECTED_CODES), "EXPECTED must cover exactly the 19 TYPES codes");

// 2. 19개 유형 전부 domain·area·type(label)이 채워져 있고, EXPECTED와 정확히 일치.
GEN.TYPES.forEach((t) => {
  ok(typeof t.domain === "string" && t.domain.length > 0, t.code + ": domain missing");
  ok(typeof t.area === "string" && t.area.length > 0, t.code + ": area missing");
  ok(typeof t.label === "string" && t.label.length > 0, t.code + ": label(세부유형) missing");
  const want = EXPECTED[t.code];
  eq(t.domain, want.domain, t.code + ": domain mismatch");
  eq(t.area, want.area, t.code + ": area mismatch");

  const tax = GEN.taxonomyOf(t.code);
  ok(Boolean(tax), t.code + ": taxonomyOf() returned null");
  eq(tax.code, t.code, t.code + ": taxonomyOf().code mismatch");
  eq(tax.domain, want.domain, t.code + ": taxonomyOf().domain mismatch");
  eq(tax.area, want.area, t.code + ": taxonomyOf().area mismatch");
  eq(tax.type, t.label, t.code + ": taxonomyOf().type must equal the existing label (세부유형)");
});

// 3. 대영역·소영역 이름이 오타 없이 일관된다: domains()/areasOf()가 내놓는
//    (domain, area) 쌍의 집합이 TYPES가 실제로 쓰는 쌍의 집합과 정확히 같다.
const PAIR_SEP = "\u0000";
const domains = GEN.domains();
ok(domains.length >= 1, "domains() must not be empty");
eq(new Set(domains), new Set(domains.filter((d, i) => domains.indexOf(d) === i)), "domains() must not repeat a domain name");

const declaredPairs = new Set();
domains.forEach((d) => {
  const areas = GEN.areasOf(d);
  ok(areas.length >= 1, "areasOf(" + d + ") must not be empty");
  eq(new Set(areas).size, areas.length, "areasOf(" + d + ") must not repeat an area name");
  areas.forEach((a) => declaredPairs.add(d + PAIR_SEP + a));
});
const usedPairs = new Set(GEN.TYPES.map((t) => t.domain + PAIR_SEP + t.area));
eq(declaredPairs, usedPairs, "domains()/areasOf() pairs must exactly match the (domain, area) pairs actually used by TYPES");

// 4. typesOf()의 합집합이 TYPES 전체와 같다 (중복도, 누락도 없이).
const union = [];
domains.forEach((d) => {
  GEN.areasOf(d).forEach((a) => {
    GEN.typesOf(d, a).forEach((code) => union.push(code));
  });
});
eq(union.length, GEN.TYPES.length, "typesOf() union must have no duplicate codes across (domain, area) pairs");
eq(new Set(union), new Set(GEN.TYPES.map((t) => t.code)), "typesOf() union must equal the full TYPES code set");

// typesOf(domain) (area 생략)은 그 대영역 소영역별 합집합과 같아야 한다.
domains.forEach((d) => {
  const whole = new Set(GEN.typesOf(d));
  const byArea = new Set();
  GEN.areasOf(d).forEach((a) => GEN.typesOf(d, a).forEach((code) => byArea.add(code)));
  eq(whole, byArea, "typesOf(" + d + ") without area must equal the union over areasOf(" + d + ")");
});

// 5. 분류 축과 난이도 축이 섞이지 않는다: 같은 세부유형이 난이도(강도) 1~3
//    전부에서 실제로 generateWorksheet()로 만들어진다.
GEN.TYPES.forEach((t) => {
  const level = t.levels[t.levels.length - 1];
  for (let intensity = 1; intensity <= 3; intensity += 1) {
    const sheet = GEN.generateWorksheet({ types: [t.code], count: 1, seed: 1000 + intensity, level, intensity });
    eq(sheet.problems.length, 1, t.code + " level=" + level + " intensity=" + intensity + ": expected exactly 1 problem");
    eq(sheet.problems[0].type, t.code, t.code + ": generated problem type mismatch");
    eq(sheet.problems[0].intensity, intensity, t.code + ": generated problem intensity mismatch");
    // taxonomy는 난이도별로 달라지지 않는다 — 같은 코드는 항상 같은 domain/area.
    const tax = GEN.taxonomyOf(sheet.problems[0].type);
    eq(tax.domain, EXPECTED[t.code].domain, t.code + " intensity=" + intensity + ": domain must not depend on intensity");
    eq(tax.area, EXPECTED[t.code].area, t.code + " intensity=" + intensity + ": area must not depend on intensity");
  }
});

// 6. 기존 코드 왕복(#GW-... 빌드/파싱)이 taxonomy 추가로 깨지지 않았다.
const built = GEN.buildCode(["TC", "IC", "SQ"], 9, 42, "L4", 2, "");
const parsed = GEN.parseCode(built);
ok(Boolean(parsed), "parseCode must accept a code buildCode just produced");
eq(parsed.types, ["TC", "IC", "SQ"], "round-tripped types must match");
eq(parsed.count, 9, "round-tripped count must match");
eq(parsed.level, "L4", "round-tripped level must match");
eq(parsed.intensity, 2, "round-tripped intensity must match");
eq(parsed.seed, 42, "round-tripped seed must match");

// 옛 별칭 코드(PF->PN, TS->SQ)도 taxonomy 필드를 포함해 그대로 읽힌다.
const pf = GEN.typeInfo("PF");
ok(Boolean(pf), "typeInfo('PF') must resolve via TYPE_ALIASES");
eq(pf.code, "PN", "PF must alias to PN");
eq(pf.domain, "입체", "aliased lookup must still carry the new domain field");
eq(pf.area, "색칠과 무늬", "aliased lookup must still carry the new area field");

const ts = GEN.typeInfo("ts"); // lower-case, canonicalType should upper-case it
ok(Boolean(ts), "typeInfo('ts') must resolve case-insensitively via TYPE_ALIASES");
eq(ts.code, "SQ", "ts must alias to SQ");
eq(ts.domain, "규칙", "aliased lookup must still carry the new domain field");

console.log("Taxonomy selftest passed: " + passed + " assertions, " + GEN.TYPES.length + " types, " +
  domains.length + " domain(s), " + Array.from(declaredPairs).length + " domain/area pair(s).");
