(function (global) {
  "use strict";

  const DIFFICULTY_LABEL = { easy: "쉽게", same: "같게", hard: "어렵게" };
  const TYPE_META = {
    1: {
      title: "앞·뒤에서 본 쌓기나무",
      module: "HFQ01",
      generate: "generateQ01",
      validate: "validateQ01",
      renderProblem: "renderQ01Problem",
      deriveAnswer: "deriveQ01Answer",
      renderAnswer: "renderQ01Answer",
      prompt: () => "앞과 뒤에서 본 모양을 보고 쌓기나무는 모두 몇 개인지 구하세요."
    },
    2: {
      title: "상자 채우기",
      module: "HFQ02",
      generate: "generateQ02",
      validate: "validateQ02",
      renderProblem: "renderQ02Problem",
      deriveAnswer: "deriveQ02Answer",
      renderAnswer: "renderQ02Answer",
      prompt: (p) => `가로 ${p.width}, 세로 ${p.depth}, 높이 ${p.boxH}인 상자를 가득 채우려면 쌓기나무가 몇 개 더 필요한지 구하세요.`
    },
    3: {
      title: "흑백 교차 쌓기나무",
      module: "HFQ03",
      generate: "generateQ03",
      validate: "validateQ03",
      renderProblem: "renderQ03Problem",
      deriveAnswer: "deriveQ03Answer",
      renderAnswer: "renderQ03Answer",
      prompt: () => "같은 색의 면이 맞닿지 않게 쌓았습니다. 흰색과 검은색 쌓기나무 수를 각각 구하세요."
    },
    4: {
      title: "구멍 뚫린 쌓기나무",
      module: "HFQ04",
      generate: "generateQ04",
      validate: "validateQ04",
      renderProblem: "renderQ04Problem",
      deriveAnswer: "deriveQ04Answer",
      renderAnswer: "renderQ04Answer",
      prompt: (p) => `가로 ${p.width}, 세로 ${p.depth}, 높이 ${p.boxH}인 직육면체에 반대쪽까지 구멍을 뚫었습니다. 남은 쌓기나무 수를 구하세요.`
    },
    5: {
      title: "보이지 않는 쌓기나무",
      module: "HFQ05",
      generate: "generateQ05",
      validate: "validateQ05",
      renderProblem: "renderQ05Problem",
      deriveAnswer: "deriveQ05Answer",
      renderAnswer: "renderQ05Answer",
      prompt: (p) => `쌓기나무를 모두 ${p.total}개 쌓았습니다. 어느 방향에서도 보이지 않는 쌓기나무 수를 구하세요. (바닥면은 보이지 않습니다.)`
    }
  };

  function normalizeSeed(value) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return Math.abs(Math.trunc(parsed)) || 1;
    let hash = 2166136261;
    const text = String(value || "hf-premier");
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) || 1;
  }

  function typeModule(typeId) {
    const meta = TYPE_META[typeId];
    const mod = meta && global[meta.module];
    if (!meta || !mod) throw new Error(`유형 q${String(typeId).padStart(2, "0")} 생성기를 불러오지 못했습니다.`);
    return { meta, mod };
  }

  function generateQuestion(typeId, difficulty, seed, number) {
    const { meta, mod } = typeModule(typeId);
    const normalized = normalizeSeed(seed);
    const payload = mod[meta.generate](difficulty, normalized);
    if (!mod[meta.validate](payload)) {
      throw new Error(`q${String(typeId).padStart(2, "0")} seed ${normalized} 검증 실패`);
    }
    return {
      number,
      typeId,
      typeCode: `q${String(typeId).padStart(2, "0")}`,
      typeTitle: meta.title,
      difficulty,
      difficultyLabel: DIFFICULTY_LABEL[difficulty] || difficulty,
      seed: normalized,
      prompt: meta.prompt(payload),
      problemHtml: mod[meta.renderProblem](payload),
      answer: mod[meta.deriveAnswer](payload),
      answerText: mod[meta.renderAnswer](payload),
      payload
    };
  }

  function createExam(seed) {
    const base = normalizeSeed(seed);
    const questions = [];
    let number = 1;
    Object.keys(TYPE_META).map(Number).forEach((typeId) => {
      ["same", "hard"].forEach((difficulty, index) => {
        const questionSeed = base + typeId * 10007 + index * 7919;
        questions.push(generateQuestion(typeId, difficulty, questionSeed, number));
        number += 1;
      });
    });
    return {
      id: "premier-spatial-01",
      title: "프리미어 공간지각 진단 모의고사",
      subtitle: "쌓기나무 핵심 5유형 · 10문항",
      seed: base,
      durationMinutes: 25,
      questions
    };
  }

  function createPractice(typeIds, options) {
    const opts = options || {};
    const base = normalizeSeed(opts.seed);
    const countPerType = Math.max(2, Math.min(6, Number(opts.countPerType) || 4));
    const requestedDifficulty = opts.difficulty || "same";
    const cleanTypes = [...new Set((typeIds || []).map(Number).filter((id) => TYPE_META[id]))];
    const questions = [];
    let number = 1;
    cleanTypes.forEach((typeId) => {
      for (let index = 0; index < countPerType; index += 1) {
        const difficulty = requestedDifficulty === "mixed"
          ? ["easy", "same", "hard"][index % 3]
          : requestedDifficulty;
        const questionSeed = base + typeId * 12011 + index * 7919;
        questions.push(generateQuestion(typeId, difficulty, questionSeed, number));
        number += 1;
      }
    });
    return {
      id: "premier-practice",
      title: "프리미어 약점 보완 문제지",
      subtitle: `${cleanTypes.length}개 약점 유형 · ${questions.length}문항`,
      seed: base,
      durationMinutes: null,
      typeIds: cleanTypes,
      countPerType,
      questions
    };
  }

  function resultFromMarks(exam, marks) {
    const rows = exam.questions.map((question) => ({
      question,
      correct: marks[String(question.number)] === "o"
    }));
    const correctCount = rows.filter((row) => row.correct).length;
    const wrongRows = rows.filter((row) => !row.correct);
    const wrongTypeIds = [...new Set(wrongRows.map((row) => row.question.typeId))];
    const byType = Object.keys(TYPE_META).map(Number).map((typeId) => {
      const typeRows = rows.filter((row) => row.question.typeId === typeId);
      const correct = typeRows.filter((row) => row.correct).length;
      return {
        typeId,
        title: TYPE_META[typeId].title,
        correct,
        total: typeRows.length,
        rate: typeRows.length ? Math.round(correct / typeRows.length * 100) : 0
      };
    });
    return {
      total: rows.length,
      correctCount,
      wrongCount: rows.length - correctCount,
      score: rows.length ? Math.round(correctCount / rows.length * 100) : 0,
      wrongTypeIds,
      wrongRows,
      byType
    };
  }

  function safeStudent(value) {
    return String(value || "학생").trim().slice(0, 30) || "학생";
  }

  function makeSeed() {
    return (Date.now() ^ Math.floor(Math.random() * 0x7fffffff)) >>> 0;
  }

  global.HFMock = {
    TYPE_META,
    DIFFICULTY_LABEL,
    normalizeSeed,
    generateQuestion,
    createExam,
    createPractice,
    resultFromMarks,
    safeStudent,
    makeSeed
  };
})(typeof window !== "undefined" ? window : globalThis);
