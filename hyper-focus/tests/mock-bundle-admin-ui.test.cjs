"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "admin.html"), "utf8");
const app = fs.readFileSync(path.join(root, "admin-app.js"), "utf8");
const edge = fs.readFileSync(path.join(root, "supabase", "functions", "admin-students", "index.ts"), "utf8");

new vm.Script(app, { filename: "admin-app.js" });

for (const [key, label] of [
  ["premier-utilization", "활용 8회"],
  ["premier-final", "파이널 3회"],
  ["premier-last", "최종 4회"]
]) {
  assert.match(app, new RegExp(`key: ["']${key}["'][\\s\\S]{0,100}label: ["']${label}["']`));
}

assert.match(html, /<th>모의고사 상품<\/th>/);
assert.match(html, /bundle-list/);
assert.match(app, /data-mock-bundle=/);
assert.match(app, /data-bundle-state=/);
assert.match(app, /input\.indeterminate = true/);
assert.match(app, /aria-checked["'], ["']mixed/);
assert.match(app, /stateName === ["']catalog_error["'][\s\S]{0,120}disabled/);
assert.match(app, /const disabled = archived \|\| stateName === ["']catalog_error["']/);
assert.match(app, /stateName === ["']full["'] \? ["']checked["']/);
assert.match(app, /legacy-mock[\s\S]{0,180}data-permission=[\\]?["']mock/);

const changeStart = app.indexOf("async function changeMockBundle");
const changeEnd = app.indexOf("async function loadRemote", changeStart);
const change = app.slice(changeStart, changeEnd);
assert.ok(changeStart >= 0 && changeEnd > changeStart);
assert.match(change, /action: ["']set_mock_bundle["']/);
assert.match(change, /studentId: student\.id/);
assert.match(change, /bundleKey: bundle\.key/);
assert.match(change, /enabled: input\.checked/);
assert.doesNotMatch(change, /examIds|roundCount|expectedCount|series\s*:/);
assert.match(change, /setRowBusy\(row, true\)/);

assert.match(edge, /const PERMISSIONS = new Set\(\[["']hyperfocus["'], ["']hyperfocus-extra["'], ["']vip["'], ["']problem-bank["']\]\)/);
assert.doesNotMatch(edge, /const PERMISSIONS = new Set\([^\n]*["']mock["']/);
assert.match(edge, /MOCK_BUNDLE_ACTION_FIELDS = new Set\(\[["']action["'], ["']studentId["'], ["']bundleKey["'], ["']enabled["']\]\)/);
assert.match(edge, /Object\.keys\(payload\)\.some\(key => !MOCK_BUNDLE_ACTION_FIELDS\.has\(key\)\)/);
assert.match(edge, /action === ["']set_mock_bundle["']/);
assert.match(edge, /mockBundles: mockBundleStates/);
assert.match(edge, /["']full["'] \| ["']partial["'] \| ["']none["'] \| ["']catalog_error["']/);

console.log("Hyper Focus mock bundle admin UI QA: PASS");
