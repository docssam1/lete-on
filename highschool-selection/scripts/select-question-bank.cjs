"use strict";

const fs = require("node:fs");
const path = require("node:path");
const dbCore = require("./build-dolpa-question-db.cjs");
const dbAudit = require("./audit-dolpa-question-db.cjs");

const DEFAULT_ALLOWED_STATUSES = Object.freeze(["source_verified", "approved"]);

function profileByToken(token) {
  const normalized = String(token || "").trim().toLowerCase();
  return dbCore.PROFILE_CATALOG.find(profile =>
    profile.profileId.toLowerCase() === normalized || profile.label.toLowerCase() === normalized
  );
}

function compareQuestions(left, right) {
  const leftKey = [
    left.classification.semester,
    left.classification.majorUnit,
    left.classification.minorUnit,
    left.classification.typeLabel,
    left.paperId
  ];
  const rightKey = [
    right.classification.semester,
    right.classification.majorUnit,
    right.classification.minorUnit,
    right.classification.typeLabel,
    right.paperId
  ];
  const keyOrder = leftKey.join("\u0000").localeCompare(rightKey.join("\u0000"), "ko");
  return keyOrder || left.number - right.number || left.questionId.localeCompare(right.questionId);
}

function selectQuestions(database, profileTokens, allowedStatuses = DEFAULT_ALLOWED_STATUSES) {
  const audit = dbAudit.audit(database);
  if (!audit.ok) throw new Error(`문항 DB 검사가 실패했습니다: ${audit.issues.join(", ")}`);
  const tokens = Array.isArray(profileTokens) ? profileTokens : [profileTokens];
  const profiles = tokens.map(profileByToken);
  if (!profiles.length || profiles.some(profile => !profile)) throw new Error("시험형을 확인해 주세요.");
  const profileIds = new Set(profiles.map(profile => profile.profileId));
  const statuses = new Set(allowedStatuses);
  const questions = database.questions.filter(question => question.usageProfiles.some(usage =>
    profileIds.has(usage.profileId) && statuses.has(usage.status)
  )).sort(compareQuestions).map(question => ({
    questionId: question.questionId,
    sourceId: question.sourceId,
    paperId: question.paperId,
    number: question.number,
    sourceRelation: question.sourceRelation,
    semester: question.classification.semester,
    majorUnit: question.classification.majorUnit,
    minorUnit: question.classification.minorUnit,
    typeId: question.classification.typeId,
    typeLabel: question.classification.typeLabel,
    difficulty: question.difficulty,
    responseFormat: question.responseFormat,
    reviewChecks: {
      classification: question.classification.status === "verified",
      locator: question.locator.status === "verified",
      difficulty: question.difficulty.status === "verified",
      response: question.responseFormat.status === "verified",
      keyCheck: question.answerCheck.status === "verified",
      method: question.method.status === "verified",
      variants: question.variantSet.status === "verified",
      usageApproval: question.usageProfiles.some(usage => profileIds.has(usage.profileId) && usage.status === "approved")
    },
    usage: question.usageProfiles.filter(usage => profileIds.has(usage.profileId) && statuses.has(usage.status))
  }));
  return {
    selectedProfiles: profiles.map(profile => ({ profileId: profile.profileId, label: profile.label })),
    allowedStatuses: Array.from(statuses),
    questionCount: questions.length,
    questions
  };
}

function main(args) {
  if (args.length < 2 || args.length > 3) {
    throw new Error("사용법: node select-question-bank.cjs <question-db> <시험형ID|이름[,시험형...]> [--include-candidates]");
  }
  const database = JSON.parse(fs.readFileSync(path.resolve(args[0]), "utf8"));
  const profiles = args[1].split(",").map(value => value.trim()).filter(Boolean);
  const allowed = args[2] === "--include-candidates"
    ? [...DEFAULT_ALLOWED_STATUSES, "candidate"]
    : DEFAULT_ALLOWED_STATUSES;
  process.stdout.write(`${JSON.stringify(selectQuestions(database, profiles, allowed), null, 2)}\n`);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = Object.freeze({ DEFAULT_ALLOWED_STATUSES, profileByToken, compareQuestions, selectQuestions });
