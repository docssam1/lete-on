(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDMathContract = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const SCHEMA_VERSION = "gfield-math-program-v1";
  const REQUIRED_LOCALES = Object.freeze(["ko", "en"]);
  const OPTIONAL_LOCALES = Object.freeze(["zh-Hans"]);
  const AUDIENCES = Object.freeze(["student", "teacher", "admin"]);
  const PATHWAYS = Object.freeze(["core", "accelerated", "competition", "bridge"]);
  const PUBLIC_RIGHTS = Object.freeze(["owned_original", "permissive_reviewed"]);
  const SOURCE_RIGHTS = Object.freeze([
    "owned_original",
    "permissive_reviewed",
    "private_licensed",
    "noncommercial_reference",
    "permission_required",
    "provenance_review"
  ]);

  function fail(message) {
    throw new Error(message);
  }

  function isRecord(value) {
    return !!value && typeof value === "object" && !Array.isArray(value);
  }

  function clean(value) {
    return String(value == null ? "" : value).trim();
  }

  function unique(values) {
    return new Set(values).size === values.length;
  }

  function validateLocalizedText(value, field, options) {
    const settings = Object.assign({ optionalLocales: OPTIONAL_LOCALES }, options);
    if (!isRecord(value)) fail(`${field} must be a localized object`);
    REQUIRED_LOCALES.forEach(function (locale) {
      if (!clean(value[locale])) fail(`${field}.${locale} is required`);
    });
    Object.keys(value).forEach(function (locale) {
      if (!REQUIRED_LOCALES.includes(locale) && !settings.optionalLocales.includes(locale)) {
        fail(`${field}.${locale} is not a supported locale`);
      }
      if (!clean(value[locale])) fail(`${field}.${locale} must not be blank`);
    });
    return true;
  }

  function validateGrade(value, field) {
    if (value === "K") return true;
    if (!Number.isInteger(value) || value < 1 || value > 12) fail(`${field} must be K or grade 1-12`);
    return true;
  }

  function validateSource(source, field) {
    if (!isRecord(source)) fail(`${field} must be an object`);
    if (!clean(source.authority)) fail(`${field}.authority is required`);
    if (!/^https:\/\//.test(clean(source.url))) fail(`${field}.url must be an https URL`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(clean(source.lastVerified))) fail(`${field}.lastVerified must be YYYY-MM-DD`);
    return true;
  }

  function validateProgram(program, index) {
    const field = `programs[${index}]`;
    if (!isRecord(program)) fail(`${field} must be an object`);
    if (!/^[a-z0-9-]+$/.test(clean(program.id))) fail(`${field}.id is invalid`);
    validateLocalizedText(program.title, `${field}.title`);
    if (!PATHWAYS.includes(program.pathway)) fail(`${field}.pathway is invalid`);
    if (!Array.isArray(program.grades) || !program.grades.length) fail(`${field}.grades is required`);
    program.grades.forEach(function (grade, gradeIndex) {
      validateGrade(grade, `${field}.grades[${gradeIndex}]`);
    });
    if (!unique(program.grades.map(String))) fail(`${field}.grades contains duplicates`);
    if (!Array.isArray(program.sources) || !program.sources.length) fail(`${field}.sources is required`);
    program.sources.forEach(function (source, sourceIndex) {
      validateSource(source, `${field}.sources[${sourceIndex}]`);
    });
    if (!isRecord(program.status) || !["active", "planned", "locked"].includes(program.status.state)) {
      fail(`${field}.status.state is invalid`);
    }
    if (!clean(program.status.reason)) fail(`${field}.status.reason is required`);
    return true;
  }

  function validatePromotionPolicy(policy, index) {
    const field = `promotionPolicies[${index}]`;
    if (!isRecord(policy)) fail(`${field} must be an object`);
    if (!/^[a-z0-9-]+$/.test(clean(policy.id))) fail(`${field}.id is invalid`);
    if (!clean(policy.policyOwner)) fail(`${field}.policyOwner is required`);
    if (policy.claimsNationalOfficialCut !== false) fail(`${field}.claimsNationalOfficialCut must be false`);
    if (policy.teacherReviewRequired !== true) fail(`${field}.teacherReviewRequired must be true`);
    if (!Array.isArray(policy.evidence) || !policy.evidence.length) fail(`${field}.evidence is required`);
    if (policy.cutScores !== null && !isRecord(policy.cutScores)) fail(`${field}.cutScores must be null or an object`);
    return true;
  }

  function validateResourceRules(rules) {
    if (!isRecord(rules)) fail("resourceRules must be an object");
    ["student", "teacher"].forEach(function (audience) {
      if (!Array.isArray(rules[audience]) || !rules[audience].length) fail(`resourceRules.${audience} is required`);
      if (!unique(rules[audience])) fail(`resourceRules.${audience} contains duplicates`);
    });
    const overlap = rules.student.filter(function (type) { return rules.teacher.includes(type); });
    if (overlap.length) fail(`student and teacher resource types must be separated: ${overlap.join(", ")}`);
    return true;
  }

  function validateCatalog(catalog) {
    if (!isRecord(catalog)) fail("catalog must be an object");
    if (catalog.schemaVersion !== SCHEMA_VERSION) fail("catalog.schemaVersion is unsupported");
    if (!Array.isArray(catalog.programs) || !catalog.programs.length) fail("catalog.programs is required");
    catalog.programs.forEach(validateProgram);
    if (!unique(catalog.programs.map(function (program) { return program.id; }))) fail("program ids must be unique");
    if (!Array.isArray(catalog.promotionPolicies) || !catalog.promotionPolicies.length) {
      fail("catalog.promotionPolicies is required");
    }
    catalog.promotionPolicies.forEach(validatePromotionPolicy);
    validateResourceRules(catalog.resourceRules);
    return true;
  }

  function validateContentRecord(record) {
    if (!isRecord(record)) fail("content record must be an object");
    ["course", "unit", "skill", "level", "testType", "resourceType"].forEach(function (field) {
      if (!clean(record[field])) fail(`${field} is required`);
    });
    if (!AUDIENCES.includes(record.audience)) fail("audience is invalid");
    validateLocalizedText(record.title, "title");
    if (!isRecord(record.sourceRights) || !SOURCE_RIGHTS.includes(record.sourceRights.mode)) {
      fail("sourceRights.mode is invalid");
    }
    if (!clean(record.sourceRights.provenance)) fail("sourceRights.provenance is required");
    if (record.publicationState === "published" && !canPublishContent(record)) {
      fail("content without reviewed public rights cannot be published");
    }
    return true;
  }

  function canPublishContent(record) {
    return !!record && !!record.sourceRights && PUBLIC_RIGHTS.includes(record.sourceRights.mode) &&
      record.sourceRights.reviewed === true && REQUIRED_LOCALES.every(function (locale) {
        return !!record.title && !!clean(record.title[locale]);
      });
  }

  return Object.freeze({
    SCHEMA_VERSION,
    REQUIRED_LOCALES,
    OPTIONAL_LOCALES,
    AUDIENCES,
    PATHWAYS,
    PUBLIC_RIGHTS,
    SOURCE_RIGHTS,
    validateLocalizedText,
    validateCatalog,
    validateContentRecord,
    canPublishContent
  });
});
