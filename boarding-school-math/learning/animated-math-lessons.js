(function (root, factory) {
  const value = factory();
  if (typeof module === "object" && module.exports) module.exports = value;
  if (root) root.GMAPAnimatedMathLessons = value;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const ratioBeatIds = ["ratio-read", "ratio-team-a", "ratio-red", "ratio-team-b", "ratio-green", "ratio-answer", "ratio-recap"];
  const geometryBeatIds = ["geo-read", "geo-draw", "geo-equal", "geo-sum", "geo-divide", "geo-answer", "geo-recap"];

  return Object.freeze({
    schemaVersion: 1,
    lessons: Object.freeze([
      Object.freeze({
        id: "common-total-ratio",
        type: "bar-model",
        eyebrow: "RATIO · VISUAL MODEL",
        title: "Common totals, different unit sizes",
        concept: "Part-to-whole ratios",
        problem: "Team A has red and blue tokens in a 1:3 ratio. Team B has green and yellow tokens in a 1:4 ratio. Each team has 20 tokens. How many red and green tokens are there altogether?",
        verifiedAnswer: "9 tokens",
        answerBeatId: "ratio-answer",
        objectIds: Object.freeze([
          "ratio-a-1", "ratio-a-2", "ratio-a-3", "ratio-a-4", "ratio-b-1", "ratio-b-2", "ratio-b-3", "ratio-b-4", "ratio-b-5", "ratio-equation-a", "ratio-equation-b", "ratio-answer"
        ]),
        beats: Object.freeze([
          Object.freeze({
            id: "ratio-read", label: "Read the structure", phase: "problem", durationMs: 5200,
            narration: "Both teams have the same total, twenty tokens, but their ratios use different numbers of equal parts.",
            targetIds: Object.freeze([]), visibleIds: Object.freeze([])
          }),
          Object.freeze({
            id: "ratio-team-a", label: "Build Team A", phase: "explore", durationMs: 5200,
            narration: "Team A has four equal parts in all. Divide twenty by four, so every part is worth five.",
            targetIds: Object.freeze(["ratio-a-1", "ratio-a-2", "ratio-a-3", "ratio-a-4"]),
            visibleIds: Object.freeze(["ratio-a-1", "ratio-a-2", "ratio-a-3", "ratio-a-4"])
          }),
          Object.freeze({
            id: "ratio-red", label: "Find the red part", phase: "solve", durationMs: 4300,
            narration: "Red is one of those four parts. One part is five, so Team A has five red tokens.",
            targetIds: Object.freeze(["ratio-a-1", "ratio-equation-a"]),
            visibleIds: Object.freeze(["ratio-a-1", "ratio-a-2", "ratio-a-3", "ratio-a-4", "ratio-equation-a"])
          }),
          Object.freeze({
            id: "ratio-team-b", label: "Build Team B", phase: "explore", durationMs: 5200,
            narration: "Team B has five equal parts in all. Divide twenty by five, so every part is worth four.",
            targetIds: Object.freeze(["ratio-b-1", "ratio-b-2", "ratio-b-3", "ratio-b-4", "ratio-b-5"]),
            visibleIds: Object.freeze(["ratio-a-1", "ratio-a-2", "ratio-a-3", "ratio-a-4", "ratio-equation-a", "ratio-b-1", "ratio-b-2", "ratio-b-3", "ratio-b-4", "ratio-b-5"])
          }),
          Object.freeze({
            id: "ratio-green", label: "Find the green part", phase: "solve", durationMs: 4300,
            narration: "Green is one of those five parts. One part is four, so Team B has four green tokens.",
            targetIds: Object.freeze(["ratio-b-1", "ratio-equation-b"]),
            visibleIds: Object.freeze(["ratio-a-1", "ratio-a-2", "ratio-a-3", "ratio-a-4", "ratio-equation-a", "ratio-b-1", "ratio-b-2", "ratio-b-3", "ratio-b-4", "ratio-b-5", "ratio-equation-b"])
          }),
          Object.freeze({
            id: "ratio-answer", label: "Combine the parts", phase: "answer", durationMs: 4400,
            narration: "Add the two first-color parts. Five plus four equals nine, so there are nine red and green tokens altogether.",
            targetIds: Object.freeze(["ratio-equation-a", "ratio-equation-b", "ratio-answer"]),
            visibleIds: Object.freeze(["ratio-a-1", "ratio-a-2", "ratio-a-3", "ratio-a-4", "ratio-equation-a", "ratio-b-1", "ratio-b-2", "ratio-b-3", "ratio-b-4", "ratio-b-5", "ratio-equation-b", "ratio-answer"])
          }),
          Object.freeze({
            id: "ratio-recap", label: "Explain the key idea", phase: "recap", durationMs: 4900,
            narration: "The totals match, but the unit sizes do not. Always count the ratio parts before finding the value of one part.",
            targetIds: Object.freeze(["ratio-a-1", "ratio-a-2", "ratio-a-3", "ratio-a-4", "ratio-b-1", "ratio-b-2", "ratio-b-3", "ratio-b-4", "ratio-b-5"]),
            visibleIds: Object.freeze(["ratio-a-1", "ratio-a-2", "ratio-a-3", "ratio-a-4", "ratio-equation-a", "ratio-b-1", "ratio-b-2", "ratio-b-3", "ratio-b-4", "ratio-b-5", "ratio-equation-b", "ratio-answer"])
          })
        ]),
        fullPlayBeatIds: Object.freeze(ratioBeatIds),
        stepByStepBeatIds: Object.freeze(ratioBeatIds),
        mathChecks: Object.freeze([
          Object.freeze({ method: "unit rate", expression: "20 ÷ 4 + 20 ÷ 5", result: 9 }),
          Object.freeze({ method: "substitution", expression: "5 + 15 = 20; 4 + 16 = 20", result: 9 })
        ]),
        teacherEvidence: Object.freeze({
          likelyMisconception: "The student adds ratio numbers without finding the value of one part.",
          teachingPrompt: "Why is one part worth 5 for Team A but 4 for Team B?",
          successCheck: "The student finds the total number of parts, the unit value, and the requested part in that order."
        })
      }),
      Object.freeze({
        id: "isosceles-angle",
        type: "geometry-angle",
        eyebrow: "GEOMETRY · ANGLE REASONING",
        title: "Equal sides reveal equal angles",
        concept: "Isosceles triangles and angle sum",
        problem: "Triangle ABC is isosceles with AB = AC. The vertex angle A is 40°. Find angle B.",
        verifiedAnswer: "70°",
        answerBeatId: "geo-answer",
        objectIds: Object.freeze(["geo-side-ab", "geo-side-ac", "geo-base", "geo-equal-ab", "geo-equal-ac", "geo-angle-a", "geo-angle-b", "geo-angle-c", "geo-equation-sum", "geo-equation-divide", "geo-answer"]),
        beats: Object.freeze([
          Object.freeze({
            id: "geo-read", label: "Read the givens", phase: "problem", durationMs: 4600,
            narration: "The two sloping sides are equal, and the angle between them is forty degrees.",
            targetIds: Object.freeze([]), visibleIds: Object.freeze([])
          }),
          Object.freeze({
            id: "geo-draw", label: "Draw and mark", phase: "explore", durationMs: 4700,
            narration: "Draw triangle ABC. Mark AB and AC with matching ticks to show that the sides are equal.",
            targetIds: Object.freeze(["geo-side-ab", "geo-side-ac", "geo-base", "geo-equal-ab", "geo-equal-ac", "geo-angle-a"]),
            visibleIds: Object.freeze(["geo-side-ab", "geo-side-ac", "geo-base", "geo-equal-ab", "geo-equal-ac", "geo-angle-a"])
          }),
          Object.freeze({
            id: "geo-equal", label: "Match the base angles", phase: "explore", durationMs: 5100,
            narration: "Equal sides face equal angles. Therefore angle B and angle C have the same measure.",
            targetIds: Object.freeze(["geo-equal-ab", "geo-equal-ac", "geo-angle-b", "geo-angle-c"]),
            visibleIds: Object.freeze(["geo-side-ab", "geo-side-ac", "geo-base", "geo-equal-ab", "geo-equal-ac", "geo-angle-a", "geo-angle-b", "geo-angle-c"])
          }),
          Object.freeze({
            id: "geo-sum", label: "Use the angle sum", phase: "solve", durationMs: 5200,
            narration: "The three interior angles total one hundred eighty degrees. Subtract the forty-degree vertex angle, leaving one hundred forty degrees.",
            targetIds: Object.freeze(["geo-angle-a", "geo-angle-b", "geo-angle-c", "geo-equation-sum"]),
            visibleIds: Object.freeze(["geo-side-ab", "geo-side-ac", "geo-base", "geo-equal-ab", "geo-equal-ac", "geo-angle-a", "geo-angle-b", "geo-angle-c", "geo-equation-sum"])
          }),
          Object.freeze({
            id: "geo-divide", label: "Share equally", phase: "solve", durationMs: 4600,
            narration: "The two equal base angles share one hundred forty degrees. Divide by two to get seventy degrees each.",
            targetIds: Object.freeze(["geo-angle-b", "geo-angle-c", "geo-equation-divide"]),
            visibleIds: Object.freeze(["geo-side-ab", "geo-side-ac", "geo-base", "geo-equal-ab", "geo-equal-ac", "geo-angle-a", "geo-angle-b", "geo-angle-c", "geo-equation-sum", "geo-equation-divide"])
          }),
          Object.freeze({
            id: "geo-answer", label: "State angle B", phase: "answer", durationMs: 4200,
            narration: "Angle B is one of the two equal base angles, so angle B is seventy degrees.",
            targetIds: Object.freeze(["geo-angle-b", "geo-answer"]),
            visibleIds: Object.freeze(["geo-side-ab", "geo-side-ac", "geo-base", "geo-equal-ab", "geo-equal-ac", "geo-angle-a", "geo-angle-b", "geo-angle-c", "geo-equation-sum", "geo-equation-divide", "geo-answer"])
          }),
          Object.freeze({
            id: "geo-recap", label: "Explain the chain", phase: "recap", durationMs: 4900,
            narration: "Equal sides give equal opposite angles. Then the triangle angle sum completes the calculation.",
            targetIds: Object.freeze(["geo-equal-ab", "geo-equal-ac", "geo-angle-a", "geo-angle-b", "geo-angle-c"]),
            visibleIds: Object.freeze(["geo-side-ab", "geo-side-ac", "geo-base", "geo-equal-ab", "geo-equal-ac", "geo-angle-a", "geo-angle-b", "geo-angle-c", "geo-equation-sum", "geo-equation-divide", "geo-answer"])
          })
        ]),
        fullPlayBeatIds: Object.freeze(geometryBeatIds),
        stepByStepBeatIds: Object.freeze(geometryBeatIds),
        mathChecks: Object.freeze([
          Object.freeze({ method: "angle sum", expression: "(180 - 40) ÷ 2", result: 70 }),
          Object.freeze({ method: "substitution", expression: "40 + 70 + 70", result: 180 })
        ]),
        teacherEvidence: Object.freeze({
          likelyMisconception: "The student divides 180 by 2 before removing the vertex angle.",
          teachingPrompt: "Which angles are opposite the two equal sides?",
          successCheck: "The student identifies the equal base angles before applying the 180-degree angle sum."
        })
      })
    ])
  });
});
