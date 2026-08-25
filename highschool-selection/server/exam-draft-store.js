"use strict";

const fs = require("node:fs");
const path = require("node:path");

function emptyData() { return { schemaVersion: "highselect-exam-draft-store/v1", drafts: [] }; }

function createStore(options) {
  const opts = options || {};
  const filePath = String(opts.filePath || process.env.HIGHSELECT_EXAM_DRAFT_STORE_PATH || "").trim();
  let memory = emptyData();
  let queue = Promise.resolve();
  function read() {
    if (!filePath) return memory;
    if (!fs.existsSync(filePath)) return emptyData();
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (!data || data.schemaVersion !== "highselect-exam-draft-store/v1" || !Array.isArray(data.drafts)) throw new Error("exam draft store is invalid");
    return data;
  }
  function write(data) {
    if (!filePath) { memory = data; return; }
    const resolved = path.resolve(filePath);
    fs.mkdirSync(path.dirname(resolved), { recursive: true });
    const temporary = `${resolved}.${process.pid}.${Date.now()}.tmp`;
    fs.writeFileSync(temporary, JSON.stringify(data), { encoding: "utf8", mode: 0o600 });
    fs.renameSync(temporary, resolved);
  }
  function serial(action) { const next = queue.then(action, action); queue = next.then(function () {}, function () {}); return next; }
  return {
    persistent: Boolean(filePath),
    list: function () { return serial(function () { return read().drafts.slice(); }); },
    get: function (id) { return serial(function () { return read().drafts.find(function (record) { return record.draft.id === id; }) || null; }); },
    save: function (record) { return serial(function () {
      const data = read(); const index = data.drafts.findIndex(function (item) { return item.draft.id === record.draft.id; });
      if (index >= 0) data.drafts[index] = record; else data.drafts.push(record);
      write(data); return record;
    }); }
  };
}

module.exports = { createStore };
