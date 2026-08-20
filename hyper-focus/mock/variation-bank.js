(function (global) {
  "use strict";

  const READY_TYPE_IDS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 25, 27, 28, 29, 30, 31, 32, 33, 35, 36, 37, 38, 39, 40, 45, 47, 48, 49, 51, 53];
  const types = new Map();
  const loading = new Map();

  function code(typeId) {
    return `q${String(Number(typeId)).padStart(2, "0")}`;
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
    })[char]);
  }

  function assetPath(value) {
    const raw = String(value || "");
    const match = raw.match(/^\.\/assets\/(.+)$/);
    if (!match || match[1].includes("..")) return null;
    return `../assets/${match[1]}`;
  }

  function hasAnswer(variation) {
    return Boolean(
      variation &&
      variation.answerValidation &&
      Object.prototype.hasOwnProperty.call(variation.answerValidation, "expectedAnswer")
    );
  }

  function normalizeVariation(typeId, canonical, variation) {
    const expectedBase = code(typeId);
    const image = assetPath(variation && variation.source && variation.source.problemImage);
    const presentationMode = variation && variation.presentation && variation.presentation.mode === "text-only"
      ? "text-only" : "image";
    const prompt = variation && variation.problem && variation.problem.prompt;
    const hint = variation && variation.solutionHint;
    if (!variation || variation.status === "rejected" || variation.baseQuestionId !== expectedBase) return null;
    if (Number(variation.contentBinding && variation.contentBinding.hfDataTypeId) !== typeId) return null;
    if ((presentationMode === "image" && !image) || typeof prompt !== "string" || !prompt.trim()
      || typeof hint !== "string" || !hint.trim() || !hasAnswer(variation)) return null;
    return {
      typeId,
      typeCode: expectedBase,
      typeTitle: variation.problem.title || canonical.title,
      variationId: variation.variationId,
      variationLabel: variation.variationId.endsWith("var01") ? "유사문제 1" : "유사문제 2",
      reviewStatus: variation.status || "draft",
      prompt: prompt.trim(),
      image,
      presentationMode,
      answer: variation.answerValidation.expectedAnswer,
      solutionHint: hint.trim(),
      payload: variation.machineReadable || {},
      source: variation.source
    };
  }

  function registerType(canonical, variations) {
    const typeId = Number(canonical && canonical.typeId);
    if (!Number.isInteger(typeId) || typeId < 10 || typeId > 54) throw new Error("유사문제 canonical typeId가 올바르지 않습니다.");
    if (!canonical.title || canonical.questionId !== code(typeId)) throw new Error(`${code(typeId)} canonical 계약이 올바르지 않습니다.`);
    const ready = (variations || [])
      .map((variation) => normalizeVariation(typeId, canonical, variation))
      .filter(Boolean)
      .sort((a, b) => a.variationId.localeCompare(b.variationId));
    types.set(typeId, { typeId, typeCode: code(typeId), title: canonical.title, variations: ready });
    return ready.length;
  }

  async function fetchJson(path) {
    const response = await global.fetch(path, { cache: "no-store" });
    if (!response.ok) throw new Error(`${path} 불러오기 실패 (${response.status})`);
    return response.json();
  }

  async function loadType(typeId) {
    const id = Number(typeId);
    if (types.has(id)) return types.get(id);
    if (!READY_TYPE_IDS.includes(id)) throw new Error(`${code(id)}는 아직 뷰어용 문장·그림·풀이가 모두 준비되지 않았습니다.`);
    if (!global.fetch) throw new Error(`${code(id)} 유사문제를 먼저 등록해야 합니다.`);
    if (!loading.has(id)) {
      const typeCode = code(id);
      loading.set(id, Promise.all([
        fetchJson(`../data/canonical/${typeCode}.json`),
        fetchJson(`../data/variations/${typeCode}_var01.json`),
        fetchJson(`../data/variations/${typeCode}_var02.json`)
      ]).then(([canonical, var01, var02]) => {
        const count = registerType(canonical, [var01, var02]);
        if (count !== 2) throw new Error(`${typeCode} 뷰어 준비 문제는 2개여야 합니다.`);
        return types.get(id);
      }));
    }
    return loading.get(id);
  }

  async function loadTypes(typeIds) {
    const ids = [...new Set((typeIds || []).map(Number).filter((id) => id >= 10 && id <= 54))];
    await Promise.all(ids.map(loadType));
    return ids;
  }

  function getTypeMeta(typeId) {
    const row = types.get(Number(typeId));
    return row ? { title: row.title, source: "variation-bank" } : null;
  }

  function getAvailable(typeId) {
    const row = types.get(Number(typeId));
    return row ? row.variations.slice() : [];
  }

  function getVariation(variationId) {
    for (const row of types.values()) {
      const found = row.variations.find((variation) => variation.variationId === variationId);
      if (found) return found;
    }
    return null;
  }

  function formatAnswer(answer) {
    if (answer && typeof answer === "object" && !Array.isArray(answer)) {
      if (Object.prototype.hasOwnProperty.call(answer, "min") && Object.prototype.hasOwnProperty.call(answer, "max")) {
        return `최솟값 ${answer.min}, 최댓값 ${answer.max}`;
      }
      const positionLabels = {left_top: "왼쪽 위", right_top: "오른쪽 위", left_bottom: "왼쪽 아래", right_bottom: "오른쪽 아래"};
      return Object.entries(answer).map(([key, value]) => `${positionLabels[key] || key} ${value}`).join(", ");
    }
    if (Array.isArray(answer)) return answer.join(", ");
    return String(answer);
  }

  function toQuestion(variation, number) {
    if (!variation) throw new Error("사용할 수 있는 유사문제가 없습니다.");
    return {
      number,
      typeId: variation.typeId,
      typeCode: variation.typeCode,
      typeTitle: variation.typeTitle,
      difficulty: "variation",
      difficultyLabel: variation.variationLabel,
      seed: null,
      variationId: variation.variationId,
      reviewStatus: variation.reviewStatus,
      sourceMode: "variation-bank",
      prompt: variation.prompt,
      problemHtml: variation.presentationMode === "text-only"
        ? '<div class="hf-variation-text-only"><b>풀이 공간</b><span></span><span></span><span></span></div>'
        : `<img class="hf-variation-problem" src="${escapeHtml(variation.image)}" alt="${escapeHtml(`${variation.typeTitle} ${variation.variationLabel} 그림`)}">`,
      presentationMode: variation.presentationMode,
      answer: variation.answer,
      answerCandidates: null,
      answerText: `정답: ${formatAnswer(variation.answer)}. ${variation.solutionHint}`,
      payload: variation.payload
    };
  }

  global.HFVariationBank = {
    READY_TYPE_IDS: READY_TYPE_IDS.slice(),
    registerType,
    loadType,
    loadTypes,
    getTypeMeta,
    getAvailable,
    getVariation,
    formatAnswer,
    toQuestion
  };
})(typeof window !== "undefined" ? window : globalThis);
