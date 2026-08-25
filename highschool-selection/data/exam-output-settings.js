(function (root, factory) {
  "use strict";
  const api = factory();
  root.HIGHSELECT_EXAM_OUTPUT_SETTINGS = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const DOCUMENT_PURPOSES = Object.freeze([
    "mock_exam",
    "entry_test",
    "transfer_test",
    "cumulative_test",
    "unit_test",
    "practice",
    "remediation",
    "homework"
  ]);
  const LAYOUTS = Object.freeze(["two_up", "four_up", "six_up"]);
  const DATE_MODES = Object.freeze(["hidden", "today", "custom"]);
  const QR_DESTINATIONS = Object.freeze(["none", "answer_entry", "diagnostic_report"]);
  const ANSWER_BOOKLET_POLICIES = Object.freeze(["answer_only", "question_answer", "question_solution_answer"]);
  const THEME_IDS = Object.freeze(["slate", "blue", "violet", "green", "teal", "orange"]);
  const COLOR_PATTERN = /^#[0-9a-f]{6}$/;
  const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
  const FORBIDDEN_CONTENT_KEYS = Object.freeze([
    "answer", "answers", "answerKey", "answerSpec", "correctAnswer",
    "solution", "solutionText", "explanation", "questionText", "prompt",
    "path", "filePath", "pdfUrl", "downloadUrl", "storageUrl"
  ]);

  function invariant(condition, message) {
    if (!condition) throw new TypeError(message);
  }

  function enumValue(value, allowed, field) {
    invariant(allowed.includes(value), `${field} is not allowed`);
    return value;
  }

  function rejectContent(value, location) {
    if (!value || typeof value !== "object") return;
    Object.keys(value).forEach(function (key) {
      invariant(!FORBIDDEN_CONTENT_KEYS.includes(key), `${location} cannot contain ${key}`);
      rejectContent(value[key], `${location}.${key}`);
    });
  }

  function shortText(value, field, maximum) {
    const text = String(value == null ? "" : value).trim();
    invariant(text.length > 0 && text.length <= maximum, `${field} is invalid`);
    invariant(!/[<>]/.test(text), `${field} is invalid`);
    return text;
  }

  function createOutputSettings(input) {
    invariant(input && typeof input === "object", "output settings are required");
    rejectContent(input, "outputSettings");
    invariant(input.writer === "T", "writer must be T");
    const layout = enumValue(input.layout || "four_up", LAYOUTS, "layout");
    const dateMode = enumValue(input.dateMode || "hidden", DATE_MODES, "dateMode");
    const customDate = dateMode === "custom" ? String(input.customDate || "") : null;
    invariant(dateMode !== "custom" || ISO_DATE_PATTERN.test(customDate), "customDate must use YYYY-MM-DD");
    const accentColor = String(input.accentColor || "#2563eb").toLowerCase();
    invariant(COLOR_PATTERN.test(accentColor), "accentColor is invalid");
    const settings = {
      title: shortText(input.title, "title", 80),
      subtitle: input.subtitle == null || input.subtitle === "" ? null : shortText(input.subtitle, "subtitle", 120),
      writer: "T",
      gradeLabel: shortText(input.gradeLabel, "gradeLabel", 40),
      purpose: enumValue(input.purpose || "mock_exam", DOCUMENT_PURPOSES, "purpose"),
      themeId: enumValue(input.themeId || "blue", THEME_IDS, "themeId"),
      accentColor,
      layout,
      columns: layout === "two_up" ? 1 : 2,
      itemsPerPage: layout === "two_up" ? 2 : layout === "four_up" ? 4 : 6,
      showNameField: input.showNameField !== false,
      showQuestionNumber: input.showQuestionNumber !== false,
      showPoints: input.showPoints === true,
      showDifficulty: input.showDifficulty === true,
      showAnswerSpace: input.showAnswerSpace !== false,
      showWorkSpace: input.showWorkSpace === true,
      dateMode,
      customDate,
      qrDestination: enumValue(input.qrDestination || "none", QR_DESTINATIONS, "qrDestination"),
      answerBookletPolicy: enumValue(input.answerBookletPolicy || "question_solution_answer", ANSWER_BOOKLET_POLICIES, "answerBookletPolicy"),
      watermarkPolicy: "student-name-and-print"
    };
    return Object.freeze(settings);
  }

  function createPreviewManifest(settings, questionCount) {
    invariant(settings && typeof settings === "object", "settings are required");
    const count = Number(questionCount);
    invariant(Number.isSafeInteger(count) && count >= 0, "questionCount must be a non-negative integer");
    return Object.freeze({
      title: settings.title,
      subtitle: settings.subtitle,
      gradeLabel: settings.gradeLabel,
      purpose: settings.purpose,
      themeId: settings.themeId,
      accentColor: settings.accentColor,
      layout: settings.layout,
      columns: settings.columns,
      itemsPerPage: settings.itemsPerPage,
      pageCount: Math.ceil(count / settings.itemsPerPage),
      questionCount: count,
      fields: Object.freeze({
        name: settings.showNameField,
        date: settings.dateMode !== "hidden",
        points: settings.showPoints,
        difficulty: settings.showDifficulty,
        answerSpace: settings.showAnswerSpace,
        workSpace: settings.showWorkSpace
      }),
      qrDestination: settings.qrDestination,
      watermarkPolicy: settings.watermarkPolicy
    });
  }

  return Object.freeze({
    DOCUMENT_PURPOSES,
    LAYOUTS,
    DATE_MODES,
    QR_DESTINATIONS,
    ANSWER_BOOKLET_POLICIES,
    THEME_IDS,
    FORBIDDEN_CONTENT_KEYS,
    createOutputSettings,
    createPreviewManifest
  });
});
