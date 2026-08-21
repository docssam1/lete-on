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
    },
    10: {
      title: "겹친 영역의 수",
      module: "HFQ10",
      generate: "generateQ10",
      validate: "validateQ10",
      renderProblem: "renderQ10Problem",
      deriveAnswer: "deriveQ10Answer",
      enumerateAnswers: "enumerateQ10AnswerCandidates",
      renderAnswer: "renderQ10Answer",
      prompt: () => "겹친 부분의 수는 양쪽에 적힌 수를 더한 값입니다. 별표가 있는 겹친 부분에 들어갈 수를 구하세요."
    },
    11: {
      title: "숫자 종이 두 번 접기",
      module: "HFQ11",
      generate: "generateQ11",
      validate: "validateQ11",
      renderProblem: "renderQ11Problem",
      deriveAnswer: "deriveQ11Answer",
      enumerateAnswers: "enumerateQ11AnswerCandidates",
      renderAnswer: "renderQ11Answer",
      prompt: () => "수가 쓰인 종이를 그림과 같은 방법으로 두 번 접었습니다. 가장 윗면에 오는 네 수의 합을 구하세요."
    },
    12: {
      title: "접은 색종이 구멍 수",
      module: "HFQ12",
      generate: "generateQ12",
      validate: "validateQ12",
      renderProblem: "renderQ12Problem",
      deriveAnswer: "deriveQ12Answer",
      enumerateAnswers: "enumerateQ12AnswerCandidates",
      renderAnswer: "renderQ12Answer",
      prompt: (payload) => `색종이를 ${payload.folds.length}번 접고, 접힌 선 위가 아닌 곳에 구멍을 ${payload.punchCount}개 뚫었습니다. 모두 펼치면 구멍은 몇 개입니까?`
    },
    13: {
      title: "펜토미노로 직사각형 채우기",
      module: "HFQ13",
      generate: "generateQ13",
      validate: "validateQ13",
      renderProblem: "renderQ13Problem",
      deriveAnswer: "deriveQ13Answer",
      enumerateAnswers: "enumerateQ13AnswerCandidates",
      renderAnswer: "renderQ13Answer",
      prompt: () => "주어진 펜토미노 5조각 중 4조각만 사용하여 20칸 직사각형을 빈틈없이 채우세요. 쓰지 않는 조각도 쓰세요. 조각은 돌리거나 뒤집어도 됩니다."
    },
    14: {
      title: "정사각형으로 가장 적게 나누기",
      module: "HFQ14",
      generate: "generateQ14",
      validate: "validateQ14",
      renderProblem: "renderQ14Problem",
      deriveAnswer: "deriveQ14Answer",
      enumerateAnswers: "enumerateQ14AnswerCandidates",
      renderAnswer: "renderQ14Answer",
      prompt: () => "점선을 따라 도형을 정사각형으로 나누려고 합니다. 겹치거나 남는 부분이 없도록 가장 적게 나누면 정사각형은 몇 개입니까?"
    },
    15: {
      title: "선 2개로 목표 조각 만들기", module: "HFQ15", generate: "generateQ15", validate: "validateQ15",
      renderProblem: "renderQ15Problem", deriveAnswer: "deriveQ15Answer", enumerateAnswers: "enumerateQ15AnswerCandidates", renderAnswer: "renderQ15Answer",
      prompt: (p) => `빗 모양에 표시된 후보 직선 중 2개를 골라 ${p.targetPieces}조각이 되게 하세요. 정답 선의 글자를 쓰세요.`
    },
    16: {
      title: "선 그림의 정사각형 모두 세기", module: "HFQ16", generate: "generateQ16", validate: "validateQ16",
      renderProblem: "renderQ16Problem", deriveAnswer: "deriveQ16Answer", enumerateAnswers: "enumerateQ16AnswerCandidates", renderAnswer: "renderQ16Answer",
      prompt: () => "다음 그림에서 선을 따라 그릴 수 있는 크고 작은 정사각형은 모두 몇 개입니까?"
    },
    17: {
      title: "기울어진 정사각형까지 세기", module: "HFQ17", generate: "generateQ17", validate: "validateQ17",
      renderProblem: "renderQ17Problem", deriveAnswer: "deriveQ17Answer", enumerateAnswers: "enumerateQ17AnswerCandidates", renderAnswer: "renderQ17Answer",
      prompt: () => "그림에서 찾을 수 있는 크고 작은 정사각형은 모두 몇 개입니까? 기울어진 정사각형도 셉니다."
    },
    18: {
      title: "쌓기나무로 서로 다른 입체 만들기", module: "HFQ18", generate: "generateQ18", validate: "validateQ18",
      renderProblem: "renderQ18Problem", deriveAnswer: "deriveQ18Answer", enumerateAnswers: "enumerateQ18AnswerCandidates", renderAnswer: "renderQ18Answer",
      prompt: (p) => `쌓기나무 ${p.cubeCount}개를 모두 면끼리 붙여 조건에 맞는 서로 다른 모양을 만들면 모두 몇 가지입니까? 돌려서 겹치면 같은 모양입니다.`
    },
    19: {
      title: "점판의 정사각형 모두 세기", module: "HFQ19", generate: "generateQ19", validate: "validateQ19",
      renderProblem: "renderQ19Problem", deriveAnswer: "deriveQ19Answer", enumerateAnswers: "enumerateQ19AnswerCandidates", renderAnswer: "renderQ19Answer",
      prompt: () => "점판 위의 점 4개를 꼭짓점으로 하여 만들 수 있는 크고 작은 정사각형은 모두 몇 개입니까?"
    },
    20: {
      title: "막대를 이어 만들 수 있는 길이", module: "HFQ20", generate: "generateQ20", validate: "validateQ20",
      renderProblem: "renderQ20Problem", deriveAnswer: "deriveQ20Answer", enumerateAnswers: "enumerateQ20AnswerCandidates", renderAnswer: "renderQ20Answer",
      prompt: (p) => `${p.numbers.join("cm, ")}cm 막대를 각각 한 번까지 골라 이어 만들 수 있는 서로 다른 길이는 모두 몇 가지입니까? 같은 길이는 한 번만 셉니다.`
    },
    21: {
      title: "자리 조건으로 수 찾기", module: "HFQ21", generate: "generateQ21", validate: "validateQ21",
      renderProblem: "renderQ21Problem", deriveAnswer: "deriveQ21Answer", enumerateAnswers: "enumerateQ21AnswerCandidates", renderAnswer: "renderQ21Answer",
      prompt: (p) => `조건을 모두 만족하는 ${p.digitCount}자리 수를 구하세요.`
    },
    22: {
      title: "숫자 두 개를 바꾸어 식 고치기", module: "HFQ22", generate: "generateQ22", validate: "validateQ22",
      renderProblem: "renderQ22Problem", deriveAnswer: "deriveQ22Answer", enumerateAnswers: "enumerateQ22AnswerCandidates", renderAnswer: "renderQ22Answer",
      prompt: () => "식에 있는 숫자 두 개의 자리를 서로 바꾸어 계산이 맞게 만드세요."
    },
    23: {
      title: "기호를 넣어 식 만들기", module: "HFQ23", generate: "generateQ23", validate: "validateQ23",
      renderProblem: "renderQ23Problem", deriveAnswer: "deriveQ23Answer", enumerateAnswers: "enumerateQ23AnswerCandidates", renderAnswer: "renderQ23Answer",
      prompt: (p) => `숫자 사이에 ${p.allowedOps.includes("-")?"+, -, 또는 아무것도":"+ 또는 아무것도"} 쓰지 않아 오른쪽 수가 되는 식은 모두 몇 가지입니까?`
    },
    24: {
      title: "더하기 하나를 빼기로 바꾸기", module: "HFQ24", generate: "generateQ24", validate: "validateQ24",
      renderProblem: "renderQ24Problem", deriveAnswer: "deriveQ24Answer", enumerateAnswers: "enumerateQ24AnswerCandidates", renderAnswer: "renderQ24Answer",
      prompt: () => "+ 하나를 -로 바꾸어 계산이 맞게 만드세요. 바꿀 + 바로 뒤의 수를 쓰세요."
    },
    25: {
      title: "두 조건에 공통인 숫자의 합", module: "HFQ25", generate: "generateQ25", validate: "validateQ25",
      renderProblem: "renderQ25Problem", deriveAnswer: "deriveQ25Answer", enumerateAnswers: "enumerateQ25AnswerCandidates", renderAnswer: "renderQ25Answer",
      prompt: () => "각 비교식의 □에 공통으로 들어갈 수 있는 숫자를 모두 더하세요."
    },
    26: {
      title: "성냥개비를 옮겨 정사각형 만들기", module: "HFQ26", generate: "generateQ26", validate: "validateQ26",
      renderProblem: "renderQ26Problem", deriveAnswer: "deriveQ26Answer", enumerateAnswers: "enumerateQ26AnswerCandidates", renderAnswer: "renderQ26Answer",
      prompt: (p) => `성냥개비를 연한 점이 있는 자리 안에서 정확히 ${p.moveCount}개만 옮겨 서로 변을 나누어 쓰지 않는 같은 크기의 정사각형 3개를 만드세요. 성냥개비를 더하거나 버리거나 겹치면 안 됩니다.`
    },
    27: {
      title: "벌집 수 배열에서 식 만들기", module: "HFQ27", generate: "generateQ27", validate: "validateQ27",
      renderProblem: "renderQ27Problem", deriveAnswer: "deriveQ27Answer", enumerateAnswers: "enumerateQ27AnswerCandidates", renderAnswer: "renderQ27Answer",
      prompt: () => "각 벌집에서 이웃한 칸을 따라 모든 숫자와 기호를 한 번씩 지나 옳은 식을 만드세요. 1번부터 차례로 식의 답을 쓰세요."
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

  function accessPolicy() {
    if (!global.HFAccessPolicy) throw new Error("Hyper Focus 문제 이용 정책을 불러오지 못했습니다.");
    return global.HFAccessPolicy;
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
    const requestedDifficulty = opts.difficulty || "same";
    const difficultyByType = opts.difficultyByType && typeof opts.difficultyByType === "object" ? opts.difficultyByType : {};
    const policy = accessPolicy();
    const accessTier = policy.tier(opts.accessTier);
    const cleanTypes = [...new Set((typeIds || []).map(Number).filter((id) => getTypeMeta(id)))];
    if (cleanTypes.length > policy.MAX_SELECTED_TYPES) {
      throw new Error(`한 번에 선택할 수 있는 약점 유형은 최대 ${policy.MAX_SELECTED_TYPES}개입니다.`);
    }
    const questions = [];
    let number = 1;
    cleanTypes.forEach((typeId) => {
      const difficulty = difficultyByType[typeId] || difficultyByType[String(typeId)] || requestedDifficulty;
      policy.validatePracticeRequest({ countPerType, difficulty, accessTier });
      if (!TYPE_META[typeId]) {
        const bank = bankModule();
        const available = bank ? bank.getAvailable(typeId, difficulty) : [];
        if (available.length < countPerType) {
          if (!available.length) throw new Error(`q${String(typeId).padStart(2, "0")} ${DIFFICULTY_LABEL[difficulty]} 문제는 아직 검수 완료된 문항이 없습니다.`);
          throw new Error(`q${String(typeId).padStart(2, "0")} ${DIFFICULTY_LABEL[difficulty]} 문제는 현재 ${available.length}개만 사용할 수 있습니다.`);
        }
        const offset = normalizeSeed(base + typeId * 12011) % available.length;
        for (let index = 0; index < countPerType; index += 1) {
          questions.push(bank.toQuestion(available[(offset + index) % available.length], number));
          number += 1;
        }
        return;
      }
      const answersForType = new Set();
      for (let index = 0; index < countPerType; index += 1) {
        const questionSeed = base + typeId * 12011 + index * 7919;
        let question = null;
        for (let attempt = 0; attempt < 100; attempt += 1) {
          const candidate = generateQuestion(typeId, difficulty, questionSeed + attempt * 104729, number);
          const answerKey = JSON.stringify(candidate.answer);
          if (index >= 2 || !answersForType.has(answerKey)) {
            answersForType.add(answerKey);
            question = candidate;
            break;
          }
        }
        if (!question) throw new Error(`q${String(typeId).padStart(2, "0")} ${DIFFICULTY_LABEL[difficulty]} 문제의 서로 다른 정답을 충분히 만들지 못했습니다.`);
        questions.push(question);
        number += 1;
      }
    });
    return {
      id: "premier-practice",
      title: "Hyper Focus 맞춤 시험지",
      subtitle: `${cleanTypes.length}개 약점 유형 · ${questions.length}문항`,
      seed: base,
      durationMinutes: null,
      typeIds: cleanTypes,
      countPerType,
      accessTier,
      difficultyByType: Object.fromEntries(cleanTypes.map((typeId) => [typeId, difficultyByType[typeId] || difficultyByType[String(typeId)] || requestedDifficulty])),
      questions
    };
  }

  function getPracticeAvailability(typeId, accessTier) {
    const id = Number(typeId);
    const policy = accessPolicy();
    const cap = policy.limitForTier(accessTier);
    if (TYPE_META[id]) return { easy: cap, same: cap, hard: cap };
    const bank = bankModule();
    return Object.fromEntries(policy.DIFFICULTIES.map((difficulty) => [
      difficulty,
      Math.min(cap, bank ? bank.getAvailable(id, difficulty).length : 0)
    ]));
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
    getPracticeAvailability,
    resultFromMarks,
    safeStudent,
    makeSeed
  };
})(typeof window !== "undefined" ? window : globalThis);
