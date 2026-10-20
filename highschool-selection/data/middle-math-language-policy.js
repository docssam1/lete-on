(function (root, factory) {
  "use strict";
  const api = factory();
  root.HIGHSELECT_MIDDLE_MATH_LANGUAGE_POLICY = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const VERSION = "middle-math-language-policy/v1";
  const VISIBLE_TEXT_FIELDS = new Set([
    "prompt", "promptHtml", "stem", "stemHtml", "questionText", "questionHtml",
    "statement", "statementHtml", "choices", "options", "solution", "solutionHtml",
    "solutionText", "explanation", "explanationHtml", "steps", "answerExplanation"
  ]);
  const FORBIDDEN_GLYPH = /[∈∉∩∪⊂⊆⊄⊇]/gu;
  const FORBIDDEN_ENTITY = /&(?:cap|cup|isin|notin|sub|sube|sup|supe);|&#(?:8712|8713|8745|8746|8834|8835|8838|8839);|&#x(?:2208|2209|2229|222a|2282|2283|2286|2287);/giu;
  const REWRITE_GUIDE = Object.freeze({
    intersection: "선분 AE와 선분 BD의 교점을 P라 할 때",
    pointOnSegment: "D는 선분 BC 위의 점",
    rule: "중1~중3 문제·선택지·해설에서는 집합의 소속·교집합 기호로 점과 선분의 관계를 쓰지 않는다. 문장으로 풀어 쓴다."
  });

  function text(value) { return String(value == null ? "" : value); }

  function isMiddleSchool(value) {
    const hints = [];
    function visit(node, depth) {
      if (depth > 4 || node == null) return;
      if (typeof node === "string" || typeof node === "number") {
        hints.push(text(node));
        return;
      }
      if (Array.isArray(node)) {
        node.slice(0, 20).forEach(function (entry) { visit(entry, depth + 1); });
        return;
      }
      if (typeof node !== "object") return;
      ["level", "schoolLevel", "grade", "gradeBand", "semester", "course", "courseCode", "scopeKey", "curriculum"].forEach(function (key) {
        if (Object.prototype.hasOwnProperty.call(node, key)) visit(node[key], depth + 1);
      });
    }
    visit(value, 0);
    return hints.some(function (hint) {
      return /중등|중\s*[123](?:학년)?(?:\s*[-–]\s*[12])?|^middle$|middle\s*[-_]?\s*[123]|middle-school/i.test(hint.trim());
    });
  }

  function collectVisibleText(value) {
    const entries = [];
    function collect(node, path, active) {
      if (node == null) return;
      if (typeof node === "string" || typeof node === "number") {
        if (active) entries.push(Object.freeze({ path, text: text(node) }));
        return;
      }
      if (Array.isArray(node)) {
        node.forEach(function (entry, index) { collect(entry, `${path}[${index}]`, active); });
        return;
      }
      if (typeof node !== "object") return;
      Object.keys(node).forEach(function (key) {
        collect(node[key], path ? `${path}.${key}` : key, active || VISIBLE_TEXT_FIELDS.has(key));
      });
    }
    collect(value, "", false);
    return Object.freeze(entries);
  }

  function matches(source, pattern) {
    pattern.lastIndex = 0;
    return Array.from(source.matchAll(pattern), function (match) { return match[0]; });
  }

  function audit(value, options) {
    const opts = options || {};
    const middle = opts.level === "middle" || isMiddleSchool(value);
    if (!middle) return Object.freeze({ version: VERSION, applicable: false, passed: true, issues: Object.freeze([]) });
    const issues = [];
    collectVisibleText(value).forEach(function (entry) {
      const found = matches(entry.text, FORBIDDEN_GLYPH).concat(matches(entry.text, FORBIDDEN_ENTITY));
      found.forEach(function (symbol) {
        issues.push(Object.freeze({
          code: "middle.disallowed_set_notation",
          path: entry.path,
          symbol,
          message: "중등 문제에서 집합 기호로 점·선분 관계를 나타낼 수 없습니다.",
          rewriteGuide: REWRITE_GUIDE
        }));
      });
    });
    return Object.freeze({ version: VERSION, applicable: true, passed: issues.length === 0, issues: Object.freeze(issues) });
  }

  function assertAllowed(value, options) {
    const result = audit(value, options);
    if (!result.passed) {
      const error = new TypeError(`middle-school notation audit failed: ${result.issues.map(function (issue) { return `${issue.path}:${issue.symbol}`; }).join(", ")}`);
      error.code = "MIDDLE_MATH_LANGUAGE_BLOCKED";
      error.audit = result;
      throw error;
    }
    return result;
  }

  return Object.freeze({
    version: VERSION,
    visibleTextFields: Object.freeze(Array.from(VISIBLE_TEXT_FIELDS)),
    rewriteGuide: REWRITE_GUIDE,
    isMiddleSchool,
    collectVisibleText,
    audit,
    assertAllowed
  });
});
