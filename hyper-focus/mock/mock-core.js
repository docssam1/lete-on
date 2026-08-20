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
      enumerateAnswers: "enumerateQ02AnswerCandidates",
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
      enumerateAnswers: "enumerateQ03AnswerCandidates",
      renderAnswer: "renderQ03Answer",
      prompt: (p) => `위에서 본 바탕그림의 수는 각 칸에 쌓인 높이입니다. 왼쪽 위 칸의 맨 아래 쌓기나무는 ${p.cornerWhite ? "흰색" : "검은색"}이고, 같은 색의 면이 맞닿지 않게 쌓았습니다. 전체 흰색과 검은색 쌓기나무 수를 각각 구하세요.`
    },
    4: {
      title: "구멍 뚫린 쌓기나무",
      module: "HFQ04",
      generate: "generateQ04",
      validate: "validateQ04",
      renderProblem: "renderQ04Problem",
      deriveAnswer: "deriveQ04Answer",
      enumerateAnswers: "enumerateQ04AnswerCandidates",
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
      enumerateAnswers: "enumerateQ05AnswerCandidates",
      renderAnswer: "renderQ05Answer",
      prompt: (p) => p.walled
        ? `위에서 본 바탕그림의 수는 각 칸에 쌓인 높이입니다. 뒤와 왼쪽에 벽이 있습니다. 위·앞·오른쪽에서 모두 가려져 보이지 않는 쌓기나무 수를 구하세요. (바닥 쪽에서는 보지 않습니다.)`
        : `위에서 본 바탕그림의 수는 각 칸에 쌓인 높이입니다. 벽이 없습니다. 위·앞·뒤·왼쪽·오른쪽에서 모두 가려져 보이지 않는 쌓기나무 수를 구하세요. (바닥 쪽에서는 보지 않습니다.)`
    },
    6: {
      title: "여러 방향에서 본 색 블록",
      module: "HFQ06",
      generate: "generateQ06",
      validate: "validateQ06",
      renderProblem: "renderQ06Problem",
      deriveAnswer: "deriveQ06Answer",
      enumerateAnswers: "enumerateQ06AnswerCandidates",
      renderAnswer: "renderQ06Answer",
      prompt: () => "기준 모양을 돌려서 볼 때 나타날 수 없는 모습을 모두 고르세요. 거울처럼 뒤집지는 않습니다."
    },
    7: {
      title: "전개도로 만드는 입체",
      module: "HFQ07",
      generate: "generateQ07",
      validate: "validateQ07",
      renderProblem: "renderQ07Problem",
      deriveAnswer: "deriveQ07Answer",
      enumerateAnswers: "enumerateQ07AnswerCandidates",
      renderAnswer: "renderQ07Answer",
      prompt: () => "전개도를 접어서 만들 수 있는 입체 모양을 모두 고르세요."
    },
    8: {
      title: "주사위 굴리기",
      module: "HFQ08",
      generate: "generateQ08",
      validate: "validateQ08",
      renderProblem: "renderQ08Problem",
      deriveAnswer: "deriveQ08Answer",
      enumerateAnswers: "enumerateQ08AnswerCandidates",
      renderAnswer: "renderQ08Answer",
      prompt: () => "처음 주사위의 세 면을 보고, 화살표 길을 따라 한 칸씩 굴렸을 때 색칠한 칸에 닿는 바닥면의 수를 구하세요."
    },
    9: {
      title: "세 방향 모습으로 최소 개수",
      module: "HFQ09",
      generate: "generateQ09",
      validate: "validateQ09",
      renderProblem: "renderQ09Problem",
      deriveAnswer: "deriveQ09Answer",
      enumerateAnswers: "enumerateQ09AnswerCandidates",
      renderAnswer: "renderQ09Answer",
      prompt: () => "쌓기나무를 위, 앞, 오른쪽 옆에서 본 모양입니다. 세 모양을 모두 만족하도록 쌓을 때 필요한 쌓기나무의 가장 적은 수를 구하세요."
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

  function bankModule() {
    return global.HFVariationBank || null;
  }

  function getTypeMeta(typeId) {
    const id = Number(typeId);
    if (TYPE_META[id]) return TYPE_META[id];
    const bank = bankModule();
    return bank && bank.getTypeMeta(id);
  }

  async function prepareExam(examId) {
    const registry = global.HFMockBlueprints;
    const blueprint = registry && registry.getExam(examId);
    if (!blueprint) throw new Error(`승인된 시험 구성표를 찾을 수 없습니다: ${String(examId || "(없음)")}`);
    const bankTypeIds = (blueprint.slots || [])
      .filter((slot) => slot.source === "variation-bank" || Number(slot.typeId) >= 10)
      .map((slot) => Number(slot.typeId));
    if (bankTypeIds.length) {
      const bank = bankModule();
      if (!bank) throw new Error("기존 유사문제 문제은행을 불러오지 못했습니다.");
      await bank.loadTypes(bankTypeIds);
    }
    return blueprint;
  }

  async function preparePractice(typeIds) {
    const bankTypeIds = [...new Set((typeIds || []).map(Number).filter((id) => id >= 10 && id <= 54))];
    if (bankTypeIds.length) {
      const bank = bankModule();
      if (!bank) throw new Error("기존 유사문제 문제은행을 불러오지 못했습니다.");
      await bank.loadTypes(bankTypeIds);
    }
    return bankTypeIds;
  }

  function generateQuestion(typeId, difficulty, seed, number) {
    const { meta, mod } = typeModule(typeId);
    const normalized = normalizeSeed(seed);
    const payload = mod[meta.generate](difficulty, normalized);
    if (!mod[meta.validate](payload)) {
      throw new Error(`q${String(typeId).padStart(2, "0")} seed ${normalized} 검증 실패`);
    }
    const answer = mod[meta.deriveAnswer](payload);
    let answerCandidates = null;
    if (meta.enumerateAnswers) {
      answerCandidates = mod[meta.enumerateAnswers](payload);
      if (!Array.isArray(answerCandidates) || answerCandidates.length !== 1) {
        throw new Error(`q${String(typeId).padStart(2, "0")} seed ${normalized} 정답 후보가 1개가 아닙니다.`);
      }
      if (JSON.stringify(answerCandidates[0]) !== JSON.stringify(answer)) {
        throw new Error(`q${String(typeId).padStart(2, "0")} seed ${normalized} 정답 후보와 계산 정답이 다릅니다.`);
      }
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
      answer,
      answerCandidates,
      answerText: mod[meta.renderAnswer](payload),
      payload
    };
  }

  function createExam(examId, seed) {
    const registry = global.HFMockBlueprints;
    const blueprint = registry && registry.getExam(examId);
    if (!blueprint) throw new Error(`승인된 시험 구성표를 찾을 수 없습니다: ${String(examId || "(없음)")}`);
    if (!Array.isArray(blueprint.slots) || !blueprint.slots.length) {
      throw new Error(`시험 구성표 ${blueprint.id}에 문항이 없습니다.`);
    }
    const base = normalizeSeed(seed);
    const questions = blueprint.slots.map((slot, index) => {
      const typeId = Number(slot.typeId);
      const difficulty = slot.difficulty;
      if (!getTypeMeta(typeId)) throw new Error(`시험 구성표 ${blueprint.id}: 준비되지 않은 유형 q${String(typeId).padStart(2, "0")}`);
      if (slot.source === "variation-bank") {
        const bank = bankModule();
        const variation = bank && bank.getVariation(slot.variationId);
        if (!variation || variation.typeId !== typeId) throw new Error(`시험 구성표 ${blueprint.id}: ${slot.variationId}를 사용할 수 없습니다.`);
        return bank.toQuestion(variation, index + 1);
      }
      if (!DIFFICULTY_LABEL[difficulty]) throw new Error(`시험 구성표 ${blueprint.id}: 알 수 없는 난이도 ${difficulty}`);
      const questionSeed = base + typeId * 10007 + (index + 1) * 7919;
      return generateQuestion(typeId, difficulty, questionSeed, index + 1);
    });
    return {
      id: blueprint.id,
      status: blueprint.status,
      title: blueprint.title,
      subtitle: `${blueprint.subtitle} · ${questions.length}문항`,
      description: blueprint.description,
      seed: base,
      durationMinutes: blueprint.durationMinutes,
      questions
    };
  }

  function createPractice(typeIds, options) {
    const opts = options || {};
    const base = normalizeSeed(opts.seed);
    const countPerType = Number(opts.countPerType);
    if (!Number.isInteger(countPerType) || countPerType < 1 || countPerType > 20) {
      throw new Error("약점 유형별 문제 수를 1~20 사이에서 직접 정해 주세요.");
    }
    const requestedDifficulty = opts.difficulty || "same";
    const cleanTypes = [...new Set((typeIds || []).map(Number).filter((id) => getTypeMeta(id)))];
    const questions = [];
    let number = 1;
    cleanTypes.forEach((typeId) => {
      if (!TYPE_META[typeId]) {
        const bank = bankModule();
        const available = bank ? bank.getAvailable(typeId) : [];
        if (available.length < countPerType) {
          throw new Error(`q${String(typeId).padStart(2, "0")}는 현재 서로 다른 유사문제 ${available.length}개만 사용할 수 있습니다.`);
        }
        const offset = normalizeSeed(base + typeId * 12011) % available.length;
        for (let index = 0; index < countPerType; index += 1) {
          questions.push(bank.toQuestion(available[(offset + index) % available.length], number));
          number += 1;
        }
        return;
      }
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
      title: "Hyper Focus 약점 문제은행",
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
    const examTypeIds = [...new Set(exam.questions.map((question) => question.typeId))];
    const byType = examTypeIds.map((typeId) => {
      const typeRows = rows.filter((row) => row.question.typeId === typeId);
      const correct = typeRows.filter((row) => row.correct).length;
      return {
        typeId,
        title: getTypeMeta(typeId).title,
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
    getTypeMeta,
    prepareExam,
    preparePractice,
    normalizeSeed,
    generateQuestion,
    createExam,
    createPractice,
    resultFromMarks,
    safeStudent,
    makeSeed
  };
})(typeof window !== "undefined" ? window : globalThis);
