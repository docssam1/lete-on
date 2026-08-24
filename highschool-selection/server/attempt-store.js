"use strict";

const fs = require("node:fs");
const path = require("node:path");

function emptyData() { return { schemaVersion: "highselect-attempt-store/v1", attempts: [] }; }

function createStore(options) {
  const opts = options || {};
  const filePath = String(opts.filePath || process.env.HIGHSELECT_ATTEMPT_STORE_PATH || "").trim();
  let memory = emptyData();
  let queue = Promise.resolve();

  function read() {
    if (!filePath) return memory;
    if (!fs.existsSync(filePath)) return emptyData();
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    if (!data || data.schemaVersion !== "highselect-attempt-store/v1" || !Array.isArray(data.attempts)) throw new Error("attempt store is invalid");
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

  function serial(action) {
    const next = queue.then(action, action);
    queue = next.then(function () {}, function () {});
    return next;
  }

  return {
    save: function (record) {
      return serial(function () {
        const data = read();
        if (data.attempts.some(function (item) { return item.attemptId === record.attemptId; })) throw new Error("duplicate attempt id");
        data.attempts.push(record);
        write(data);
        return record;
      });
    },
    get: function (attemptId) {
      return serial(function () { return read().attempts.find(function (item) { return item.attemptId === attemptId; }) || null; });
    }
  };
}

module.exports = { createStore };
