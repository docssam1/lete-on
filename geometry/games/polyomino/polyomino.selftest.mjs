import { levels, readyLevels, validateLevels, acceptsChoice } from "./levels.js";
import { LANGUAGES, messages, text } from "./i18n.js";

function assert(condition, message) {
  if (!condition) throw new Error(`Polyomino self-test: ${message}`);
}

const normalizeIndependent = (cells) => {
  const minX = Math.min(...cells.map(([x]) => x));
  const minY = Math.min(...cells.map(([, y]) => y));
  return cells.map(([x, y]) => [x - minX, y - minY]).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
};
const keyIndependent = (cells) => normalizeIndependent(cells).map((cell) => cell.join(",")).join(" ");
const rotateIndependent = (cells) => normalizeIndependent(cells.map(([x, y]) => [y, -x]));
const flipIndependent = (cells) => normalizeIndependent(cells.map(([x, y]) => [-x, y]));
const rotationSetIndependent = (cells) => {
  const found = new Set();
  let current = normalizeIndependent(cells);
  for (let turn = 0; turn < 4; turn += 1) {
    found.add(keyIndependent(current));
    current = rotateIndependent(current);
  }
  return found;
};
const sameByTurningIndependent = (a, b) => rotationSetIndependent(a).has(keyIndependent(b));
const sameFreeIndependent = (a, b) => sameByTurningIndependent(a, b) || sameByTurningIndependent(flipIndependent(a), b);

function connected(cells) {
  const wanted = new Set(cells.map((cell) => cell.join(",")));
  const seen = new Set([cells[0].join(",")]);
  const queue = [cells[0]];
  while (queue.length) {
    const [x, y] = queue.shift();
    [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]].forEach((next) => {
      const id = next.join(",");
      if (!wanted.has(id) || seen.has(id)) return;
      seen.add(id);
      queue.push(next);
    });
  }
  return seen.size === cells.length;
}

validateLevels();
assert(levels.length === 5, "five planned levels must be declared");
assert(readyLevels.length === 2, "only source-reviewed levels 1 and 2 should be public");
const problems = readyLevels.flatMap((level) => level.problems);
assert(problems.length === 20 && new Set(problems.map((problem) => problem.id)).size === 20, "20 unique public problems are required");

for (const problem of problems) {
  assert(connected(problem.target), `${problem.id} target is disconnected`);
  problem.choices.forEach((choice, index) => assert(connected(choice.cells), `${problem.id} choice ${index} is disconnected`));
  const independentMatches = problem.choices.filter((choice) => problem.kind === "rotation-match"
    ? sameFreeIndependent(problem.target, choice.cells)
    : sameByTurningIndependent(problem.target, choice.cells));
  assert(independentMatches.length === 1, `${problem.id} does not have one independent answer`);
  assert(independentMatches[0].role === "correct", `${problem.id} independent answer role is wrong`);
  problem.choices.forEach((choice) => {
    assert(acceptsChoice(problem, choice.cells) === independentMatches.includes(choice), `${problem.id} engine and independent answer disagree`);
  });
  if (problem.kind === "turn-not-flip") {
    const mirror = problem.choices.find((choice) => choice.role === "mirror");
    assert(mirror, `${problem.id} needs a mirror decoy`);
    assert(sameFreeIndependent(problem.target, mirror.cells), `${problem.id} mirror decoy is not the same free piece`);
    assert(!sameByTurningIndependent(problem.target, mirror.cells), `${problem.id} mirror decoy can be turned to match`);
  }
}

const koreanKeys = Object.keys(messages.ko).sort();
for (const language of LANGUAGES) {
  assert(JSON.stringify(Object.keys(messages[language]).sort()) === JSON.stringify(koreanKeys), `${language} locale keys differ`);
  assert(text(language, "levelLabel", { level: 2 }).includes("2"), `${language} interpolation failed`);
  assert(messages[language].wrongDifferent !== messages[language].correct, `${language} wrong feedback praises the child`);
  assert(messages[language].wrongMirror.length > 0, `${language} mirror explanation is missing`);
}

console.log(`Polyomino self-test passed: ${problems.length} problems, ${LANGUAGES.length} locales.`);
