(function (root) {
  "use strict";

  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const TYPE_KEY_RE = /^[a-z][a-z0-9-]{1,79}$/;
  const GRADABLE_STATUSES = new Set(["in_progress", "grading"]);

  function failure(message) {
    const error = new Error(message);
    Object.defineProperty(error, "code", { value: "HF_SECURE_MOCK_UI_CONTRACT_INVALID", enumerable: true });
    return error;
  }

  function canGrade(status) {
    return GRADABLE_STATUSES.has(String(status || ""));
  }

  function gradingSignalKey(attemptId) {
    const value = String(attemptId || "");
    if (!UUID_RE.test(value)) throw failure("응시 식별자가 올바르지 않습니다.");
    return `hf-secure-mock:grading:v1:${value}`;
  }

  function marksStorageKey(attemptId) {
    const value = String(attemptId || "");
    if (!UUID_RE.test(value)) throw failure("응시 식별자가 올바르지 않습니다.");
    return `hf-secure-mock:marks:v1:${value}`;
  }

  function normalizeStoredMarks(value, questions) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    const allowed = new Set(questions.map(question => String(question.number)));
    const marks = {};
    Object.entries(value).forEach(([number, mark]) => {
      if (allowed.has(number) && (mark === "o" || mark === "x")) marks[number] = mark;
    });
    return marks;
  }

  function buildRemoteSummary(document, marksValue, receipt, maximumSelectedTypes) {
    if (!document || !Array.isArray(document.questions) || !document.questions.length
      || !receipt || receipt.attemptId !== document.attemptId) {
      throw failure("현재 문제지와 서버 채점 영수증이 일치하지 않습니다.");
    }
    const marks = normalizeStoredMarks(marksValue, document.questions);
    if (Object.keys(marks).length !== document.questions.length) {
      throw failure("모든 문항의 O/X 표시가 필요합니다.");
    }
    if (
      receipt.status !== "submitted" || receipt.questionCount !== document.questions.length
      || !Number.isInteger(receipt.correctCount) || !Number.isInteger(receipt.score)
      || !Array.isArray(receipt.wrongQuestionKeys) || !Array.isArray(receipt.wrongTypeKeys)
    ) {
      throw failure("서버 채점 영수증 형식이 올바르지 않습니다.");
    }

    const wrongKeys = new Set(receipt.wrongQuestionKeys);
    const grouped = new Map();
    const wrongRows = [];
    const weakTypeIds = [];
    const seenTypeIds = new Set();
    let derivedCorrect = 0;

    document.questions.forEach(question => {
      if (!question || !TYPE_KEY_RE.test(String(question.typeKey || ""))
        || !Number.isInteger(question.number) || typeof question.typeTitle !== "string") {
        throw failure("문항 유형 정보가 올바르지 않습니다.");
      }
      const mark = marks[String(question.number)];
      const isWrong = wrongKeys.has(question.questionKey);
      if ((mark === "x") !== isWrong) throw failure("O/X 표시와 서버 오답 목록이 일치하지 않습니다.");
      if (!isWrong) derivedCorrect += 1;

      if (!grouped.has(question.typeKey)) {
        grouped.set(question.typeKey, {
          typeKey: question.typeKey,
          title: question.typeTitle,
          total: 0,
          correct: 0
        });
      }
      const group = grouped.get(question.typeKey);
      group.total += 1;
      if (!isWrong) group.correct += 1;

      if (isWrong) {
        wrongRows.push({ question });
        const typeId = question.typeId;
        if (Number.isInteger(typeId) && typeId >= 1 && typeId <= 54 && !seenTypeIds.has(typeId)) {
          seenTypeIds.add(typeId);
          weakTypeIds.push(typeId);
        }
      }
    });

    if (
      derivedCorrect !== receipt.correctCount
      || receipt.score !== Math.round(derivedCorrect * 100 / document.questions.length)
      || wrongKeys.size !== wrongRows.length
    ) {
      throw failure("서버 채점 수치와 문항별 결과가 일치하지 않습니다.");
    }
    const byType = Array.from(grouped.values(), row => ({
      ...row,
      rate: Math.round(row.correct * 100 / row.total)
    }));
    const limit = Number.isInteger(maximumSelectedTypes) && maximumSelectedTypes > 0
      ? maximumSelectedTypes
      : 5;
    return Object.freeze({
      score: receipt.score,
      correctCount: receipt.correctCount,
      wrongCount: document.questions.length - receipt.correctCount,
      questionCount: document.questions.length,
      wrongRows: Object.freeze(wrongRows),
      byType: Object.freeze(byType),
      wrongTypeIds: Object.freeze(weakTypeIds.slice(0, limit)),
      wrongTypeKeys: Object.freeze(receipt.wrongTypeKeys.slice())
    });
  }

  root.HFMockSecureFlow = Object.freeze({
    canGrade,
    gradingSignalKey,
    marksStorageKey,
    normalizeStoredMarks,
    buildRemoteSummary
  });
})(typeof window !== "undefined" ? window : globalThis);
