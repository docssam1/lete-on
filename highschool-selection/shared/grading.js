(function (root) {
  "use strict";
  const DEFAULT_UNITS = ["km", "kg", "cm", "mm", "m²", "cm²", "m3", "m³", "cm3", "cm³", "도", "원", "개", "쌍", "%", "m", "g", "l"]
    .sort(function (a, b) { return b.length - a.length; });

  function halfWidth(value) {
    return String(value == null ? "" : value)
      .replace(/[！-～]/g, function (char) { return String.fromCharCode(char.charCodeAt(0) - 0xfee0); })
      .replace(/[①②③④⑤⑥⑦⑧⑨]/g, function (char) { return String("①②③④⑤⑥⑦⑧⑨".indexOf(char) + 1); })
      .replace(/⑩/g, "10")
      .replace(/　/g, " ");
  }
  function normalize(raw, options) {
    const opts = options || {};
    let value = halfWidth(raw).trim().toLowerCase();
    // Accept only atomic LaTeX fractions; composite numerators need a parser
    // that preserves parentheses and must not be flattened into a/b+c.
    value = value.replace(/\\(?:dfrac|tfrac|frac)\{\\sqrt\{(\d+)\}\}\{(-?\d+)\}/g, "√$1/$2");
    value = value.replace(/\\(?:dfrac|tfrac|frac)\{(-?\d+)\}\{(-?\d+)\}/g, "$1/$2");
    value = value.replace(/[−–—]/g, "-").replace(/，/g, ",");
    if (opts.ignoreWhitespace !== false) value = value.replace(/\s+/g, "");
    if (opts.ignoreUnit) {
      const units = (opts.units || DEFAULT_UNITS).slice().sort(function (a, b) { return b.length - a.length; });
      for (const unit of units) {
        if (value.length > unit.length && value.endsWith(unit.toLowerCase())) { value = value.slice(0, -unit.length); break; }
      }
    }
    if (opts.ignoreThousandsSeparator !== false && /^[-+]?\d{1,3}(,\d{3})+(\.\d+)?$/.test(value)) value = value.replace(/,/g, "");
    return value;
  }
  function tokens(raw, separator, options) {
    return halfWidth(raw).split(separator || /[,\s\n]+/).map(function (value) { return normalize(value, options); }).filter(Boolean);
  }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { const t = b; b = a % b; a = t; } return a || 1; }
  function fraction(raw, options) {
    const value = normalize(raw, options).replace(/,/g, "");
    const integer = value.match(/^[-+]?\d+$/);
    if (integer) return [Number(value), 1];
    let match = value.match(/^(-?\d+)\/(-?\d+)$/);
    if (!match) {
      const korean = value.match(/^(-?\d+)분의(-?\d+)$/);
      if (korean) match = [null, korean[2], korean[1]];
    }
    if (!match || Number(match[2]) === 0) return null;
    const divisor = gcd(Number(match[1]), Number(match[2]));
    const sign = Number(match[2]) < 0 ? -1 : 1;
    return [sign * Number(match[1]) / divisor, sign * Number(match[2]) / divisor];
  }
  function surdExpression(raw, options) {
    let value = normalize(raw, options)
      .replace(/\\sqrt\{(\d+)\}/g, "√$1")
      .replace(/sqrt\((\d+)\)/g, "√$1")
      .replace(/sqrt(\d+)/g, "√$1")
      .replace(/√[({](\d+)[)}]/g, "√$1");
    if (!value || value.length > 120 || !/^[+\-\d/*√]+$/.test(value)) return null;
    const terms = value.match(/[+-]?[^+-]+/g);
    if (!terms || terms.join("") !== value || terms.length > 12) return null;
    const coefficients = new Map();
    function rational(text) {
      const match = String(text).match(/^(\d+)(?:\/(\d+))?$/);
      if (!match) return null;
      const numerator = Number(match[1]), denominator = Number(match[2] || 1);
      if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || denominator === 0 || numerator > 1e9 || denominator > 1e9) return null;
      const divisor = gcd(numerator, denominator);
      return [numerator / divisor, denominator / divisor];
    }
    function add(radicand, numerator, denominator) {
      const old = coefficients.get(radicand) || [0, 1];
      const nextN = old[0] * denominator + numerator * old[1];
      const nextD = old[1] * denominator;
      if (!Number.isSafeInteger(nextN) || !Number.isSafeInteger(nextD) || nextD === 0) return false;
      const divisor = gcd(nextN, nextD);
      coefficients.set(radicand, [nextN / divisor, nextD / divisor]);
      return true;
    }
    for (const rawTerm of terms) {
      const sign = rawTerm[0] === "-" ? -1 : 1;
      const term = /^[+-]/.test(rawTerm) ? rawTerm.slice(1) : rawTerm;
      const radical = term.match(/^(\d+(?:\/\d+)?)?(\*)?√(\d+)(?:\/(\d+))?$/);
      if (!radical) {
        const scalar = rational(term);
        if (!scalar || !add(1, sign * scalar[0], scalar[1])) return null;
        continue;
      }
      if (radical[2] && !radical[1]) return null;
      const factor = rational(radical[1] || "1");
      const trailing = rational(radical[4] || "1");
      let radicand = Number(radical[3]);
      if (!factor || !trailing || !Number.isSafeInteger(radicand) || radicand < 1 || radicand > 1e6) return null;
      let outside = 1;
      for (let divisor = 2; divisor * divisor <= radicand; divisor += 1) {
        while (radicand % (divisor * divisor) === 0) {
          radicand /= divisor * divisor;
          outside *= divisor;
        }
      }
      const numerator = sign * factor[0] * outside;
      const denominator = factor[1] * trailing[0];
      if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || !add(radicand, numerator, denominator)) return null;
    }
    return [...coefficients.entries()].filter(([, fraction]) => fraction[0] !== 0)
      .sort((left, right) => left[0] - right[0]).map(([radicand, fraction]) => `${radicand}:${fraction[0]}/${fraction[1]}`).join("|") || "0";
  }
  function coordinateFractionPair(raw, options) {
    const value = normalize(raw, options);
    const match = value.match(/^([a-z])?\(([^(),]+),([^(),]+)\)$/);
    if (!match) return null;
    const x = fraction(match[2], options);
    const y = fraction(match[3], options);
    if (!x || !y || !x.every(Number.isSafeInteger) || !y.every(Number.isSafeInteger)) return null;
    return { label: match[1] || null, x, y };
  }
  function equalScalar(actual, expected, spec) {
    const opts = spec.normalize || {};
    const a = normalize(actual, opts), e = normalize(expected, opts);
    if (!a || !e) return false;
    if (spec.mode === "numeric") {
      const an = Number(a.replace(/,/g, "")), en = Number(e.replace(/,/g, ""));
      if (!Number.isFinite(an) || !Number.isFinite(en)) return false;
      return Math.abs(an - en) <= Number(spec.tolerance || 0);
    }
    if (spec.mode === "fraction-equivalent") {
      const af = fraction(a, opts), ef = fraction(e, opts);
      return !!af && !!ef && af[0] === ef[0] && af[1] === ef[1];
    }
    if (spec.mode === "coordinate-fraction-equivalent") {
      const ap = coordinateFractionPair(a, opts), ep = coordinateFractionPair(e, opts);
      return !!ap && !!ep && ap.label === ep.label
        && ap.x[0] === ep.x[0] && ap.x[1] === ep.x[1]
        && ap.y[0] === ep.y[0] && ap.y[1] === ep.y[1];
    }
    if (spec.mode === "quadratic-surd-equivalent" || spec.mode === "radical-fraction-equivalent") {
      const parsedActual = surdExpression(a, opts), parsedExpected = surdExpression(e, opts);
      return parsedActual !== null && parsedExpected !== null && parsedActual === parsedExpected;
    }
    return a === e;
  }
  function canonicalType(spec) {
    const raw = String(spec && spec.type || "input").trim().toLowerCase();
    if (raw === "ox") return "self_check";
    if (raw === "input" && spec && spec.mode === "ordered-list") return "ordered_list";
    if (raw === "input" && spec && spec.mode === "unordered-set") return "unordered_set";
    return raw;
  }
  function unwrapList(actual) {
    if (Array.isArray(actual)) return actual;
    if (actual && typeof actual === "object") {
      if (Array.isArray(actual.items)) return actual.items;
      if (Array.isArray(actual.value)) return actual.value;
    }
    return tokens(actual, /[,\n]+/);
  }
  function hasValue(actual) {
    if (Array.isArray(actual)) return actual.some(function (value) { return normalize(value) !== ""; });
    if (actual && typeof actual === "object") {
      if (Array.isArray(actual.slots)) return actual.slots.some(function (slot) { return normalize(slot && slot.value) !== ""; });
      if (Array.isArray(actual.value)) return hasValue(actual.value);
    }
    return normalize(actual) !== "";
  }
  function actualSlots(actual) {
    if (Array.isArray(actual)) return actual.map(function (value, index) { return { index, value }; });
    if (actual && typeof actual === "object" && Array.isArray(actual.slots)) {
      return actual.slots.map(function (slot, index) {
        return { index, slotId: String(slot && slot.slotId || ""), groupId: slot && slot.groupId ? String(slot.groupId) : null, value: slot && slot.value };
      });
    }
    if (actual && typeof actual === "object" && Array.isArray(actual.value)) {
      return actual.value.map(function (value, index) {
        return {
          index,
          slotId: Array.isArray(actual.slotIds) ? String(actual.slotIds[index] || "") : "",
          groupId: Array.isArray(actual.groupIds) && actual.groupIds[index] ? String(actual.groupIds[index]) : null,
          value
        };
      });
    }
    return tokens(actual, /[,\n]+/).map(function (value, index) { return { index, value }; });
  }
  function matchesAccepted(actual, accepted, spec) {
    const list = Array.isArray(accepted) ? accepted : [accepted];
    return list.some(function (answer) { return equalScalar(actual, answer, spec); });
  }
  function evaluateMulti(actual, spec) {
    const values = actualSlots(actual);
    if (!values.some(function (slot) { return normalize(slot.value) !== ""; })) return { state: "blank" };
    const baseSlots = Array.isArray(spec.slots) ? spec.slots : (spec.answers || []).map(function (answer, index) { return { index, answer }; });
    const variants = Array.isArray(spec.variants) && spec.variants.length ? spec.variants : [baseSlots];
    const ok = variants.some(function (expectedSlots) {
      if (!Array.isArray(expectedSlots) || values.length !== expectedSlots.length) return false;
      return expectedSlots.every(function (expected, index) {
        const received = values[index];
        if (expected.slotId && received.slotId !== String(expected.slotId)) return false;
        if (expected.groupId && received.groupId !== String(expected.groupId)) return false;
        const accepted = Object.prototype.hasOwnProperty.call(expected, "answers") ? expected.answers : expected.answer;
        return matchesAccepted(received.value, accepted, spec);
      });
    });
    return { state: ok ? "correct" : "wrong" };
  }
  function evaluateList(actual, spec, unordered) {
    const actualValues = unwrapList(actual).map(function (value) { return normalize(value, spec.normalize); }).filter(Boolean);
    const expectedValues = Array.isArray(spec.answers) ? spec.answers.slice() : [];
    if (!actualValues.length) return { state: "blank" };
    if (actualValues.length !== expectedValues.length) return { state: "wrong" };
    if (!unordered) {
      return { state: expectedValues.every(function (answer, index) { return equalScalar(actualValues[index], answer, spec); }) ? "correct" : "wrong" };
    }
    const remaining = actualValues.slice();
    const ok = expectedValues.every(function (answer) {
      const match = remaining.findIndex(function (value) { return equalScalar(value, answer, spec); });
      if (match < 0) return false;
      remaining.splice(match, 1);
      return true;
    });
    return { state: ok && remaining.length === 0 ? "correct" : "wrong" };
  }
  function evaluate(actual, spec) {
    if (!spec || actual == null || !hasValue(actual)) return { state: "blank" };
    const type = canonicalType(spec);
    if (type === "self_check") {
      const value = normalize(actual);
      return { state: value === "o" ? "correct" : (value === "x" ? "wrong" : "blank"), manual: true };
    }
    if (type === "multi_input") return evaluateMulti(actual, spec);
    if (type === "ordered_list") return evaluateList(actual, spec, false);
    if (type === "unordered_set") return evaluateList(actual, spec, true);
    const accepted = spec.answers || [];
    return { state: accepted.some(function (answer) { return equalScalar(actual, answer, spec); }) ? "correct" : "wrong" };
  }

  root.HIGHSELECT_GRADING = { normalize, tokens, fraction, evaluate };
  if (typeof module !== "undefined" && module.exports) module.exports = root.HIGHSELECT_GRADING;
})(typeof window !== "undefined" ? window : globalThis);
