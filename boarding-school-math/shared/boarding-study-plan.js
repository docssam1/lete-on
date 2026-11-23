(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDStudyPlan = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const key = "gfield-boarding-study-plan:v1";

  function clean(value, catalog) {
    const saved = value && value.version === 1 ? value : {};
    const ids = Array.isArray(saved.items) ? saved.items : [];
    const opened = saved.opened && typeof saved.opened === "object" ? saved.opened : {};
    return {
      version: 1,
      items: Array.from(new Set(ids.filter(function (id) { return catalog.has(id); }))),
      active: ids.includes(saved.active) && catalog.has(saved.active) ? saved.active : "",
      opened: Object.fromEntries(Object.entries(opened).filter(function (entry) {
        return catalog.has(entry[0]) && Number.isFinite(entry[1]) && entry[1] > 0;
      }))
    };
  }

  function load(storage, catalog) {
    return clean(JSON.parse(storage.getItem(key) || "null"), catalog);
  }

  // Always read the latest saved order before applying an edit, including edits from another tab.
  function update(storage, catalog, change) {
    const plan = load(storage, catalog);
    change(plan);
    const next = clean(plan, catalog);
    storage.setItem(key, JSON.stringify(next));
    return next;
  }

  function move(plan, id, offset) {
    const from = plan.items.indexOf(id);
    const to = from + offset;
    if (from < 0 || to < 0 || to >= plan.items.length) return;
    plan.items.splice(from, 1);
    plan.items.splice(to, 0, id);
  }

  return Object.freeze({ key: key, clean: clean, load: load, update: update, move: move });
});
