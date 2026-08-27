"use strict";

const fs = require("node:fs");
const path = require("node:path");
const selector = require("../scripts/select-question-bank.cjs");
const dbCore = require("../scripts/build-dolpa-question-db.cjs");
const dbAudit = require("../scripts/audit-dolpa-question-db.cjs");

function clean(value) { return String(value == null ? "" : value).trim(); }

function createCatalog(database) {
  const audit = dbAudit.audit(database);
  if (!audit.ok) throw new Error(`academy question catalog is invalid: ${audit.issues.join(", ")}`);
  const labels = new Map(dbCore.PROFILE_CATALOG.map(profile => [profile.profileId, profile.label]));
  const questionsById = new Map(database.questions.map(question => [question.questionId, question]));
  return Object.freeze({
    profiles() {
      return dbCore.PROFILE_CATALOG.map(profile => Object.freeze({
        profileId: profile.profileId,
        programId: profile.programId,
        label: profile.label
      }));
    },
    privateLocator(questionId) {
      const question = questionsById.get(clean(questionId));
      if (!question || question.locator.status !== "verified" || !Number.isSafeInteger(question.locator.page)) return null;
      return Object.freeze({ sourceId: question.sourceId, page: question.locator.page });
    },
    search(options) {
      const opts = options || {};
      const profileIds = Array.isArray(opts.profileIds) ? Array.from(new Set(opts.profileIds.map(clean).filter(Boolean))) : [];
      if (!profileIds.length) return [];
      const query = clean(opts.query).toLocaleLowerCase("ko");
      const limit = Math.min(300, Math.max(1, Number(opts.limit) || 100));
      const selected = selector.selectQuestions(database, profileIds);
      return selected.questions.filter(question => {
        if (!query) return true;
        return [
          question.questionId, question.paperId, question.semester, question.majorUnit,
          question.minorUnit, question.typeId, question.typeLabel
        ].join(" ").toLocaleLowerCase("ko").includes(query);
      }).slice(0, limit).map(question => Object.freeze({
        questionId: question.questionId,
        paperId: question.paperId,
        number: question.number,
        semester: question.semester,
        majorUnit: question.majorUnit,
        minorUnit: question.minorUnit,
        typeId: question.typeId,
        typeLabel: question.typeLabel,
        difficultyBand: question.difficulty.band,
        difficultyStatus: question.difficulty.status,
        responseKind: question.responseFormat.kind,
        responseStatus: question.responseFormat.status,
        reviewChecks: Object.freeze(Object.assign({}, question.reviewChecks)),
        profiles: question.usage.map(usage => Object.freeze({
          profileId: usage.profileId,
          label: labels.get(usage.profileId),
          status: usage.status
        }))
      }));
    }
  });
}

function createLoader(options) {
  const opts = options || {};
  if (opts.data) {
    const catalog = createCatalog(opts.data);
    return function () { return catalog; };
  }
  const filePath = clean(opts.filePath || process.env.HIGHSELECT_PRIVATE_ACADEMY_QUESTION_DB_PATH);
  if (!filePath) return null;
  const resolved = path.resolve(filePath);
  return function () { return createCatalog(JSON.parse(fs.readFileSync(resolved, "utf8"))); };
}

module.exports = Object.freeze({ createCatalog, createLoader });
