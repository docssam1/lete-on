"use strict";

const fs = require("node:fs");
const path = require("node:path");
const selector = require("../scripts/select-question-bank.cjs");
const dbCore = require("../scripts/build-dolpa-question-db.cjs");
const dbAudit = require("../scripts/audit-dolpa-question-db.cjs");
const projectSelector = require("../scripts/select-project-question-bank.cjs");
const projectAudit = require("../scripts/audit-project-question-bank-index.cjs");
const dolpaScopes = require("../data/dolpa-target-scopes.js");

function clean(value) { return String(value == null ? "" : value).trim(); }

function createDolpaCatalog(database) {
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
      const targetId = clean(opts.targetId);
      if (targetId && !dolpaScopes.getTarget(targetId)) throw new Error("시험 범위를 확인해 주세요.");
      return selected.questions.filter(question => {
        if (targetId && !dolpaScopes.evaluateQuestion(targetId, question).eligible) return false;
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
        targetId: targetId || null,
        profiles: question.usage.map(usage => Object.freeze({
          profileId: usage.profileId,
          label: labels.get(usage.profileId),
          status: usage.status
        }))
      }));
    }
  });
}

function isProjectIndex(database) {
  return Boolean(database && Array.isArray(database.sourceBanks) && Array.isArray(database.conceptFamilies) && Array.isArray(database.items));
}

function sourceNumber(sourceItemId) {
  const match = clean(sourceItemId).match(/(?:^|[-_])Q?(\d{1,4})$/i);
  return match ? Number(match[1]) : null;
}

function createProjectCatalog(index, options) {
  const audit = projectAudit.audit(index);
  if (!audit.ok) throw new Error(`project question catalog is invalid: ${audit.issues.join(", ")}`);
  const opts = options || {};
  const locatorCatalog = opts.locatorDatabase ? createDolpaCatalog(opts.locatorDatabase) : null;
  const profiles = (index.academyProfiles || []).map(profile => Object.freeze({
    profileId: profile.profileId,
    programId: profile.programId,
    label: profile.label
  }));
  const profileLabels = new Map(profiles.map(profile => [profile.profileId, profile.label]));
  const itemsById = new Map((index.items || []).map(item => [item.itemId, item]));

  function locator(itemId) {
    const item = itemsById.get(clean(itemId));
    if (!item || item.sourceBankId !== "DOLPA-ORIGINAL" || !locatorCatalog) return null;
    return locatorCatalog.privateLocator(item.sourceItemId);
  }

  return Object.freeze({
    profiles() { return profiles.slice(); },
    privateLocator(itemId) { return locator(itemId); },
    search(options) {
      const searchOptions = options || {};
      const profileIds = Array.isArray(searchOptions.profileIds) ? Array.from(new Set(searchOptions.profileIds.map(clean).filter(Boolean))) : [];
      if (!profileIds.length) return [];
      const limit = Math.min(300, Math.max(1, Number(searchOptions.limit) || 100));
      const targetId = clean(searchOptions.targetId);
      if (targetId && !dolpaScopes.getTarget(targetId)) throw new Error("시험 범위를 확인해 주세요.");
      const selected = projectSelector.selectItems(index, profileIds, {
        query: searchOptions.query,
        limit: 1000,
        allowedConceptStatuses: ["mapped", "unit_only"]
      });
      return selected.items.filter(item => {
        if (!targetId) return true;
        if (item.sourceBankId !== "DOLPA-ORIGINAL") return false;
        return dolpaScopes.evaluateQuestion(targetId, {
          sourceRelation: "original",
          semester: item.semester,
          minorUnit: item.minorUnit
        }).eligible;
      }).slice(0, limit).map(item => {
        const fits = item.academyFits || [];
        const pageLocator = locator(item.itemId);
        const classificationVerified = item.conceptStatus === "mapped";
        return Object.freeze({
          questionId: item.itemId,
          paperId: item.sourceBankId,
          sourceLabel: item.sourceBankLabel,
          number: sourceNumber(item.sourceItemId),
          semester: item.semester,
          majorUnit: item.majorUnit,
          minorUnit: item.minorUnit,
          typeId: item.conceptFamilyId || item.sourceTypeId,
          typeLabel: item.detailType,
          conceptStatus: item.conceptStatus,
          difficultyBand: null,
          difficultyStatus: "pending",
          responseKind: null,
          responseStatus: "pending",
          reviewChecks: Object.freeze({
            classification: classificationVerified,
            locator: Boolean(pageLocator),
            difficulty: false,
            response: false,
            keyCheck: false,
            method: false,
            variants: false,
            usageApproval: fits.some(fit => fit.status === "approved")
          }),
          targetId: targetId || null,
          profiles: fits.map(fit => Object.freeze({
            profileId: fit.profileId,
            label: profileLabels.get(fit.profileId),
            status: fit.status
          }))
        });
      });
    }
  });
}

function createCatalog(database, options) {
  return isProjectIndex(database) ? createProjectCatalog(database, options) : createDolpaCatalog(database);
}

function createLoader(options) {
  const opts = options || {};
  if (opts.projectData) {
    const catalog = createProjectCatalog(opts.projectData, { locatorDatabase: opts.data });
    return function () { return catalog; };
  }
  const projectFilePath = clean(opts.projectFilePath || process.env.HIGHSELECT_PRIVATE_PROJECT_QUESTION_INDEX_PATH);
  if (projectFilePath) {
    const projectResolved = path.resolve(projectFilePath);
    const locatorResolved = clean(opts.filePath || process.env.HIGHSELECT_PRIVATE_ACADEMY_QUESTION_DB_PATH);
    return function () {
      const locatorDatabase = opts.data || (locatorResolved ? JSON.parse(fs.readFileSync(path.resolve(locatorResolved), "utf8")) : null);
      return createProjectCatalog(JSON.parse(fs.readFileSync(projectResolved, "utf8")), { locatorDatabase });
    };
  }
  if (opts.data) {
    const catalog = createCatalog(opts.data);
    return function () { return catalog; };
  }
  const filePath = clean(opts.filePath || process.env.HIGHSELECT_PRIVATE_ACADEMY_QUESTION_DB_PATH);
  if (!filePath) return null;
  const resolved = path.resolve(filePath);
  return function () { return createCatalog(JSON.parse(fs.readFileSync(resolved, "utf8"))); };
}

module.exports = Object.freeze({ isProjectIndex, sourceNumber, createDolpaCatalog, createProjectCatalog, createCatalog, createLoader });
