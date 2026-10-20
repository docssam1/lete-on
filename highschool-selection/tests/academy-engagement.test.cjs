const test = require("node:test");
const assert = require("node:assert/strict");

require("../data/academy-engagement.js");
const engagement = globalThis.HIGHSELECT_ACADEMY_ENGAGEMENT;

test("academy preparation keeps start and transfer courses distinct", () => {
  const programs = new Map(engagement.programs.map(program => [program.code, program]));
  for (const code of ["DP", "WM", "ED", "SM"]) {
    const guidance = programs.get(code).preparation.join(" ");
    assert.match(guidance, /반|과정/);
    assert.match(guidance, /확인/);
  }
  assert.match(programs.get("DP").preparation.join(" "), /시작반과 중간 편입/);
  assert.match(programs.get("WM").preparation.join(" "), /기본반·실력 듀얼/);
  assert.match(programs.get("ED").preparation.join(" "), /시작반·편입반/);
});

test("parent anecdotes do not become official cutlines or universal teacher claims", () => {
  const descriptions = engagement.programs.map(program => program.preparation.join(" ")).join(" ");
  assert.doesNotMatch(descriptions, /합격률|커트라인|모든 선생님|반드시 합격/);
  assert.ok(engagement.programs.every(program => program.courses.every(course => course.status === "guide")));
});
