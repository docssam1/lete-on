// GW_GEN ëìì­Â·ììì­Â·ì¸ë¶ì í(taxonomy) ìì²´ ê²ì¬.
//
// generators.jsë UMD IIFEë¼ ESMìì ë°ë¡ importí  ì ìì¼ë¯ë¡ createRequireë¡
// CommonJSì²ë¼ ë¶ë¬ì¨ë¤ â question-bank.selftest.cjsì ê°ì ë¡ë© ë°©ìì´ë¤.
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
require("./generators.js");
const GEN = global.GW_GEN;

// ì¬ëì´ íì¸í ì ëµí â generators.js ìì TYPE_TAXONOMYë¥¼ ë² ë¼ì§ ìê³ 
// ëë¦½ì ì¼ë¡ ë¤ì ì ì´, ë³µì¬-ë¶ì¬ë£ê¸° ì¤íë í ìì²´ì ì¤ìë¥¼ ì¡ëë¤.
const EXPECTED = {
  TC: { domain: "ìì²´", area: "ë°íê·¸ë¦¼" },
  VC: { domain: "ìì²´", area: "ë°íê·¸ë¦¼" },
  VM: { domain: "ìì²´", area: "ë°íê·¸ë¦¼" },
  VP: { domain: "ìì²´", area: "ë°íê·¸ë¦¼" },
  IC: { domain: "ìì²´", area: "ê°ì ì¸ê¸°" },
  IH: { domain: "ìì²´", area: "ê°ì ì¸ê¸°" },
  IN: { domain: "ìì²´", area: "ê°ì ì¸ê¸°" },
  CO: { domain: "ìì²´", area: "ê°ì ì¸ê¸°" },
  HC: { domain: "ìì²´", area: "ê°ì ì¸ê¸°" },
  FB: { domain: "ìì²´", area: "ììì ìì±" },
  CU: { domain: "ìì²´", area: "ììì ìì±" },
  MV: { domain: "ìì²´", area: "ì¡°ê°ê³¼ ì¬êµ¬ì±" },
  CJ: { domain: "ìì²´", area: "ì¡°ê°ê³¼ ì¬êµ¬ì±" },
  CP: { domain: "ìì²´", area: "ì¡°ê°ê³¼ ì¬êµ¬ì±" },
  PS: { domain: "ìì²´", area: "ì¡°ê°ê³¼ ì¬êµ¬ì±" },
  PN: { domain: "ìì²´", area: "ìì¹ê³¼ ë¬´ë" },
  BW: { domain: "ìì²´", area: "ìì¹ê³¼ ë¬´ë" },
  HL: { domain: "ìì²´", area: "ìì¹ê³¼ ë¬´ë" },
  SQ: { domain: "ê·ì¹", area: "ì ê¸°ëë¬´ ê·ì¹" }
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

// 1. ì íí 19ê° ì íì´ë©° ê¸°ì¡´ TYPESì EXPECTEDì ì½ë ì§í©ì´ ìì í ê°ë¤.
eq(GEN.TYPES.length, 19, "TYPES must have exactly 19 entries");
eq(new Set(GEN.TYPES.map((t) => t.code)), new Set(EXPECTED_CODES), "EXPECTED must cover exactly the 19 TYPES codes");

// 2. 19ê° ì í ì ë¶ domainÂ·areaÂ·type(label)ì´ ì±ì ì ¸ ìê³ , EXPECTEDì ì íí ì¼ì¹íë¤.
GEN.TYPES.forEach((t) => {
  ok(typeof t.domain === "string" && t.domain.length > 0, t.code + ": domain missing");
  ok(typeof t.area === "string" && t.area.length > 0, t.code + ": area missing");
  ok(typeof t.label === "string" && t.label.length > 0, t.code + ": label(ì¸ë¶ì í) missing");
  const want = EXPECTED[t.code];
  eq(t.domain, want.domain, t.code + ": domain mismatch");
  eq(t.area, want.area, t.code + ": area mismatch");

  const tax = GEN.taxonomyOf(t.code);
  ok(Boolean(tax), t.code + ": taxonomyOf() returned null");
  eq(tax.code, t.code, t.code + ": taxonomyOf().code mismatch");
  eq(tax.domain, want.domain, t.code + ": taxonomyOf().domain mismatch");
  eq(tax.area, want.area, t.code + ": taxonomyOf().area mismatch");
  eq(tax.type, t.label, t.code + ": taxonomyOf().type must equal the existing label (ì¸ë¶ì í)");
});

// 3. ëìì­Â·ììì­ ì´ë¦ì´ ì¤í ìì´ ì¼ê´ëë¤: domains()/areasOf()ê° ë´ë¤ë
//    (domain, area) ìì ì§í©ì´ TYPESê° ì¤ì ë¡ ì°ë ìì ì§í©ê³¼ ì íí ê°ë¤.
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

// 4. typesOf()ì í©ì§í©ì´ TYPES ì ë³´cì ê°ë¤