"use strict";

const fs = require("node:fs");
const questionBankCore = require("../data/question-bank-core.js");
const practiceCore = require("../data/practice-bank-core.js");

const SCHEMA_VERSION = "highselect-private-practice-registry/v1";

function fail(message) { throw new Error(message); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }

function normalize(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw) || raw.schemaVersion !== SCHEMA_VERSION) fail("private practice registry schemaVersion is invalid");
  const rootKeys = new Set(["schemaVersion", "modes"]);
  Object.keys(raw).forEach(function (key) { if (!rootKeys.has(key)) fail(`private practice registry.${key} is not allowed`); });
  if (!raw.modes || typeof raw.modes !== "object" || Array.isArray(raw.modes)) fail("private practice registry modes are invalid");
  const modes = {};
  Object.entries(raw.modes).forEach(function (entry) {
    const mode = String(entry[0]).trim().toUpperCase();
    const value = entry[1];
    if (!questionBankCore.PROGRAM_MODES.includes(mode) || mode !== entry[0]) fail(`private practice registry mode ${entry[0]} is invalid`);
    if (!value || typeof value !== "object" || Array.isArray(value)) fail(`private practice registry ${mode} is invalid`);
    const modeKeys = new Set(["policy", "candidates"]);
    Object.keys(value).forEach(function (key) { if (!modeKeys.has(key)) fail(`private practice registry ${mode}.${key} is not allowed`); });
    const policy = practiceCore.createPracticePolicy(value.policy);
    if (policy.mode !== mode) fail(`private practice registry ${mode} policy mode does not match`);
    if (!Array.isArray(value.candidates)) fail(`private practice registry ${mode} candidates are invalid`);
    const candidates = value.candidates.map(function (candidate) {
      practiceCore.assertPracticeMetadataOnly(candidate);
      if (!candidate || candidate.mode !== mode) fail(`private practice registry ${mode} candidate mode does not match`);
      return Object.freeze(clone(candidate));
    });
    modes[mode] = Object.freeze({ policy, candidates: Object.freeze(candidates) });
  });
  return Object.freeze({ schemaVersion: SCHEMA_VERSION, modes: Object.freeze(modes) });
}

function createLoader(options) {
  const opts = options || {};
  if (opts.data) {
    const loaded = normalize(opts.data);
    return function loadMode(mode) { return loaded.modes[String(mode).toUpperCase()] || null; };
  }
  const filePath = String(opts.filePath || process.env.HIGHSELECT_PRIVATE_PRACTICE_REGISTRY_PATH || "").trim();
  if (!filePath) return null;
  return function loadMode(mode) {
    const loaded = normalize(JSON.parse(fs.readFileSync(filePath, "utf8")));
    return loaded.modes[String(mode).toUpperCase()] || null;
  };
}

module.exports = { SCHEMA_VERSION, normalize, createLoader };
