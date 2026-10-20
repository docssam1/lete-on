(function (root, factory) {
  "use strict";
  const api = factory();
  root.HIGHSELECT_REPORT_LEARNING_PLAN = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const STATES = new Set(["correct", "wrong", "blank"]);
  const EPSILON = 0.000001;

  function invariant(condition, message) {
    if (!condition) throw new TypeError(message);
  }

  function own(object, key) {
    return Object.prototype.hasOwnProperty.call(object || {}, key);
  }

  function finiteNumber(value, label) {
    invariant(typeof value === "number" && Number.isFinite(value), `${label} 값이 올바르지 않습니다.`);
    return value;
  }

  function sameNumber(left, right) {
    return Math.abs(left - right) < EPSILON;
  }

  function cleanNumber(value) {
    return Math.round(value * 1000000) / 1000000;
  }

  function percentage(earnedPoints, totalPoints) {
    return totalPoints ? Math.round((earnedPoints / totalPoints) * 1000) / 10 : 0;
  }

  function normalizeReport(report) {
    invariant(report && typeof report === "object" && !Array.isArray(report), "검증된 분석지가 필요합니다.");
    invariant(Array.isArray(report.items), "검증된 분석지 문항이 필요합니다.");

    const numbers = new Set();
    const items = report.items.map(function (item, index) {
      invariant(item && typeof item === "object" && !Array.isArray(item), `${index + 1}번 문항 정보가 올바르지 않습니다.`);
      invariant(Number.isInteger(item.number) && item.number === index + 1 && !numbers.has(item.number), "문항 번호가 올바르지 않습니다.");
      numbers.add(item.number);
      invariant(STATES.has(item.state), `${item.number}번 문항의 채점 상태가 올바르지 않습니다.`);
      const points = finiteNumber(item.points, `${item.number}번 배점`);
      invariant(points > 0, `${item.number}번 배점이 올바르지 않습니다.`);
      invariant(typeof item.domain === "string" && item.domain.trim(), `${item.number}번 영역 정보가 올바르지 않습니다.`);

      const expectedEarnedPoints = item.state === "correct" ? points : 0;
      const earnedPoints = own(item, "earnedPoints")
        ? finiteNumber(item.earnedPoints, `${item.number}번 득점`)
        : expectedEarnedPoints;
      invariant(
        earnedPoints >= 0 && earnedPoints <= points && sameNumber(earnedPoints, expectedEarnedPoints),
        `${item.number}번 득점이 O/X 채점 결과와 일치하지 않습니다.`
      );
      return {
        number: item.number,
        state: item.state,
        points,
        earnedPoints,
        domain: item.domain.trim()
      };
    });

    const score = finiteNumber(report.score, "현재 점수");
    const totalPoints = finiteNumber(report.totalPoints, "만점");
    const computedScore = items.reduce(function (sum, item) { return sum + item.earnedPoints; }, 0);
    const computedTotalPoints = items.reduce(function (sum, item) { return sum + item.points; }, 0);
    invariant(score >= 0 && totalPoints >= 0 && score <= totalPoints, "분석지 점수 합계가 올바르지 않습니다.");
    invariant(sameNumber(score, computedScore) && sameNumber(totalPoints, computedTotalPoints), "분석지 점수 합계가 문항별 결과와 일치하지 않습니다.");

    if (own(report, "questionCount")) {
      invariant(report.questionCount === items.length, "분석지 문항 수가 문항별 결과와 일치하지 않습니다.");
    }
    if (own(report, "correctCount")) {
      const correctCount = items.filter(function (item) { return item.state === "correct"; }).length;
      invariant(report.correctCount === correctCount, "분석지 정답 수가 문항별 결과와 일치하지 않습니다.");
    }
    if (own(report, "wrongCount")) {
      const wrongCount = items.filter(function (item) { return item.state === "wrong"; }).length;
      invariant(report.wrongCount === wrongCount, "분석지 오답 수가 문항별 결과와 일치하지 않습니다.");
    }
    if (own(report, "blankCount")) {
      const blankCount = items.filter(function (item) { return item.state === "blank"; }).length;
      invariant(report.blankCount === blankCount, "분석지 미응시 수가 문항별 결과와 일치하지 않습니다.");
    }

    return { items, score, totalPoints };
  }

  function aggregate(items, keyOf, compareKeys) {
    const groups = new Map();
    items.forEach(function (item) {
      const key = keyOf(item);
      if (!groups.has(key)) {
        groups.set(key, {
          key,
          label: typeof key === "number" ? `${key}점` : key,
          earnedPoints: 0,
          totalPoints: 0,
          correctCount: 0,
          questionCount: 0
        });
      }
      const group = groups.get(key);
      group.earnedPoints += item.earnedPoints;
      group.totalPoints += item.points;
      group.questionCount += 1;
      if (item.state === "correct") group.correctCount += 1;
    });
    const rows = Array.from(groups.values());
    if (compareKeys) rows.sort(function (left, right) { return compareKeys(left.key, right.key); });
    return rows.map(function (group) {
      return {
        label: group.label,
        earnedPoints: cleanNumber(group.earnedPoints),
        totalPoints: cleanNumber(group.totalPoints),
        rate: percentage(group.earnedPoints, group.totalPoints),
        correctCount: group.correctCount,
        questionCount: group.questionCount
      };
    });
  }

  function buildPlan(validatedReport) {
    const normalized = normalizeReport(validatedReport);
    const priorityItems = normalized.items.filter(function (item) {
      return item.state === "wrong";
    }).sort(function (left, right) {
      return left.points - right.points || left.number - right.number;
    }).slice(0, 3);
    const priorityNumbers = priorityItems.map(function (item) { return item.number; });
    const unattemptedNumbers = normalized.items.filter(function (item) { return item.state === "blank"; })
      .map(function (item) { return item.number; });
    const recoveredPoints = priorityItems.reduce(function (sum, item) {
      return sum + (item.points - item.earnedPoints);
    }, 0);
    const stageOneTarget = !priorityNumbers.length && unattemptedNumbers.length ? null
      : cleanNumber(Math.min(normalized.totalPoints, normalized.score + recoveredPoints));

    return {
      byPoints: aggregate(normalized.items, function (item) { return item.points; }, function (left, right) { return left - right; }),
      byDomain: aggregate(normalized.items, function (item) { return item.domain; }),
      priorityNumbers,
      unattemptedNumbers,
      stages: [
        {
          title: priorityNumbers.length ? "1단계 · 되찾을 점수부터" : unattemptedNumbers.length ? "1단계 · 미응시 문항 먼저 풀기" : "1단계 · 풀이 확인하기",
          message: priorityNumbers.length
            ? "선택한 오답을 해설 없이 다시 풀고, 사용한 식·표·그림의 이유를 설명해 보세요."
            : unattemptedNumbers.length ? "아직 풀지 않은 문항을 먼저 풀어 보세요. 빈 답만으로 약점을 판단하지 않습니다."
              : "이번 결과에는 다시 풀 오답이 없습니다.",
          itemNumbers: priorityNumbers.length ? priorityNumbers.slice() : unattemptedNumbers.slice(0, 3),
          targetScore: stageOneTarget
        },
        {
          title: "2단계 · 반복 약점 보완",
          message: "지난 시험과 비교해 반복해서 어려웠던 문제를 선생님과 확인해 보세요.",
          itemNumbers: [],
          targetScore: null
        },
        {
          title: "3단계 · 다음 수준 도전",
          message: "앞 단계가 끝나면 다음에 도전할 문제를 선생님과 정하세요.",
          itemNumbers: [],
          targetScore: null
        }
      ],
      score: normalized.score,
      totalPoints: normalized.totalPoints
    };
  }

  return Object.freeze({ buildPlan });
});
