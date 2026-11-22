// 2과정 문제는 글로만 낸다(원장 2026-11-22 「개념이나 예제 단계 외에 문제를 억지로 그림이나 표로 설명하지 마」).
// 문제 글에 필요한 것이 다 들어 있는데 그림·표가 그것을 다시 보여 주거나 푸는 길(「99 = 100 − 1」「모두 맞혔다면 120점」)을 미리 보여 주던 유형은 그림을 뺀다.
// 그림 자체가 문제인 유형(?로 표시한 각, 세어야 할 도형, 점판·모눈, 접은 색종이, 시계, 되풀이 모양처럼 글에 없는 것)은 그대로 둔다.
// 그림 그리기·설명은 개념 정리(되짚기·정리·예제 따라 풀기)에서만 한다.
export const PLAIN_TEXT = new Set([
  // 기하 — 글에 수와 모양이 다 있는 문제
  "c2RegularPolygonAngle", "c2TriangleInequality", "c2ExteriorWalk",
  "c2RhombusArea", "c2ParallelogramArea", "c2TriangleArea", "c2TrapezoidArea",
  "c2SetSquareSide", "c2SimilarScale", "c2ShadowHeight", "c2AngleEquation",
  // 대수 — 되풀이 모양·수(c2PeriodNth·c2PeriodNumberSum)만 그림이 문제라 남기고 나머지는 글로만
  "c2FakeCoin", "c2RatioDifference", "c2FractionRatioSplit", "c2ImproperFraction", "c2QuotientRemainderPair", "c2LogCutTime", "c2RoadTrees",
  "c2PowerTenZeros", "c2NinesProduct", "c2RepunitSquare", "c2SmartRegroup", "c2OddSumSquare", "c2BracketInsert", "c2YearWeekdayShift", "c2NimStrategy", "c2DigitProductSteps", "c2ReverseHalfChain",
  "c2RepeatingDecimal", "c2PowerLastDigit", "c2ArithSequence", "c2FractionSequence", "c2GroupRows", "c2GaussSum", "c2FigurateNumber", "c2DigitCount", "c2DigitPosition",
  "c2GcdWord", "c2LcmWord", "c2UnitFraction", "c2ConsecutiveMultiples", "c2RatioGcdLcm", "c2AssumeSolve",
  "c2DivisibilityDigits", "c2SquareMultiplier", "c2ConsecutiveProduct", "c2FactorialZeros", "c2EquivalentCondition", "c2PartialFractionSum", "c2BounceHeight", "c2InvariantRatio", "c2PondDepth",
]);
// 글이 그림을 가리키면(「그림」「색칠」「표시」) 그 문제는 그림을 남긴다
const POINTS_AT_FIGURE = /그림|색칠|표시/;
export function plainText(gens) {
  return Object.fromEntries(Object.entries(gens).map(([name, fn]) => [name, PLAIN_TEXT.has(name)
    ? (options) => { const r = fn(options); return r && !POINTS_AT_FIGURE.test(r.prompt) ? { ...r, visual: null } : r; }
    : fn]));
}
