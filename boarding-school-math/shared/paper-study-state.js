(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDPaperStudyState = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const storageKey = "gfield-paper-study-state-v1";
  function create(store, library, answerKeys) {
    let memory = {}, writeFailed = false;
    function identity(program, year, form) {
      if (!["amc8", "amc10", "amc12", "aime"].includes(program)) return null;
      year = Number(year); form = String(form || "").toUpperCase();
      const format = library && library.formatFor(program, year, form);
      const key = answerKeys && answerKeys.formFor(program, year, form);
      return format && key && key.itemCount === format.itemCount && library.formsFor(program, year).includes(form)
        ? [program, year, form].join(":") : null;
    }
    function validResult(key, value) {
      if (!value || typeof value !== "object" || Array.isArray(value) || Object.keys(value).some(k => !["state", "points", "max"].includes(k)) || value.state !== "complete") return false;
      const [program, year, form] = key.split(":"), format = library.formatFor(program, Number(year), form);
      return format && format.scoring && value.max === format.scoring.max && Number.isFinite(value.points) && value.points >= 0 && value.points <= value.max
        && Number.isInteger(value.points * (["amc8", "aime"].includes(program) ? 1 : 2));
    }
    function read() {
      if (writeFailed) return memory;
      try {
        const raw = JSON.parse(store.getItem(storageKey) || "{}");
        if (!raw || Array.isArray(raw) || typeof raw !== "object") return {};
        return Object.fromEntries(Object.entries(raw).slice(-256).filter(function (entry) {
          const [program, year, form] = entry[0].split(":");
          return identity(program, year, form) === entry[0] && (["started", "complete"].includes(entry[1]) || validResult(entry[0], entry[1]));
        }));
      } catch (_) { return memory; }
    }
    function state(program, year, form) { const row = read()[identity(program, year, form)]; return row && typeof row === "object" ? row.state : row || "new"; }
    function resultFor(program, year, form) { const key = identity(program, year, form), row = read()[key]; return key && validResult(key, row) ? { points: row.points, max: row.max } : null; }
    function mark(program, year, form, value, result) {
      const key = identity(program, year, form);
      if (!key || !["started", "complete"].includes(value)) return false;
      const rows = read(), previous = rows[key];
      if (result && value === "complete") { const next = { state: "complete", points: result.points, max: result.max }; if (!validResult(key, next)) return false; rows[key] = next; }
      else rows[key] = previous === "complete" || previous && previous.state === "complete" ? previous : value;
      memory = Object.fromEntries(Object.entries(rows).slice(-256));
      try { store.setItem(storageKey, JSON.stringify(memory)); return true; } catch (_) { writeFailed = true; return false; }
    }
    return Object.freeze({ identity: identity, state: state, resultFor: resultFor, mark: mark });
  }
  return Object.freeze({ storageKey: storageKey, create: create });
});
