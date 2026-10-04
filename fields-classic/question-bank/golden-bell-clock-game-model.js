import { HANDS_ON_ACTIVITIES, clockValueAfterQuarterTurns } from "./golden-bell-hands-on-models.js?v=20260925a";

// 1권 「시계 바늘 돌리기」 게임의 규칙. 화면과 검사가 같은 함수를 쓴다.
// 돌리는 양은 원본이 쓰는 세 가지(반의 반 바퀴·반 바퀴·한 바퀴)만 쓰고 분수 표기는 쓰지 않는다.
// 양수 = 시계 방향, 단위 = 반의 반 바퀴.

export const AMOUNT_NAMES = Object.freeze({ 1: "반의 반 바퀴", 2: "반 바퀴", 4: "한 바퀴" });
export const MAX_FREE_TURNS = 8;

export const STAGES = Object.freeze([
  { id: "turn", title: "직접 돌리기", short: "돌리기" },
  { id: "predict", title: "어디를 가리킬까?", short: "예측" },
  { id: "reverse", title: "어떻게 돌렸을까?", short: "거꾸로" },
  { id: "chain", title: "두 번 돌리기", short: "연속" }
]);

export const landing = clockValueAfterQuarterTurns;
export const landingAfter = (start, ops) => landing(start, ops.reduce((sum, op) => sum + op, 0));
export const directionName = (op) => (op < 0 ? "시계 반대 방향" : "시계 방향");
// 숫자를 우리말로 읽었을 때 받침에 맞는 조사. 2(이)·4(사)·5(오)·9(구)·12(십이)는 받침이 없고 1·7·8·11은 ㄹ 받침.
export function josa(n, kind) {
  const d = n % 10, vowel = n !== 10 && [2, 4, 5, 9].includes(d), rieul = n !== 10 && [1, 7, 8].includes(d);
  if (kind === "을") return `${n}${vowel ? "를" : "을"}`;
  if (kind === "이") return `${n}${vowel ? "" : "이"}`;
  return `${n}${vowel || rieul ? "로" : "으로"}`;
}
export const opText = (op) => `${directionName(op)}으로 ${AMOUNT_NAMES[Math.abs(op)]}`;

// 돌린 양을 말로 읽는다. 1~8까지 원본 표현만 조합한다.
export function turnAmountText(quarters) {
  const n = Math.abs(quarters);
  if (!n) return "아직 안 돌렸어요";
  const full = Math.floor(n / 4), rest = n % 4;
  const parts = [];
  if (full) parts.push(full === 1 ? "한 바퀴" : "두 바퀴");
  if (rest === 2) parts.push("반 바퀴");
  else if (rest === 1) parts.push("반의 반 바퀴");
  else if (rest === 3) parts.push("반 바퀴", "반의 반 바퀴");
  return `${directionName(quarters)}으로 ${parts.join("와 ")}`;
}

export function seededRandom(seed) {
  let a = seed >>> 0 || 1;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const shuffle = (items, rand) => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

function starts(count, rand, avoid = []) {
  const pool = shuffle(Array.from({ length: 12 }, (_, i) => i + 1).filter((n) => !avoid.includes(n)), rand);
  return pool.slice(0, count);
}

// 거꾸로 단계의 보기: 정답 하나와, 같은 출발점에서 다른 곳에 닿는 보기 셋.
// 반 바퀴는 어느 방향이든 같은 곳에 닿으므로 반대 방향 반 바퀴는 보기에 넣지 않는다.
export function reverseChoices(op, rand) {
  const pool = Math.abs(op) === 2 ? [1, -1, 4] : [-op, op > 0 ? 2 : -2, op > 0 ? 4 : -4];
  return shuffle([op, ...pool], rand);
}

export function buildRun(seed = Date.now()) {
  const rand = seededRandom(seed);
  const authored = HANDS_ON_ACTIVITIES["turn-clock"].rounds.map((round) => ({ stage: "turn", start: round.start, ops: [round.turns] }));
  const predictOps = shuffle([1, -1, 2, rand() < 0.5 ? -2 : 4], rand);
  const predict = starts(4, rand).map((start, i) => ({ stage: "predict", start, ops: [predictOps[i]] }));
  const reverseOps = shuffle([1, -1, rand() < 0.5 ? 2 : -2], rand);
  const reverse = starts(3, rand).map((start, i) => ({ stage: "reverse", start, ops: [reverseOps[i]], choices: reverseChoices(reverseOps[i], rand) }));
  const chainOps = shuffle([[2, -1], [1, 1], [-2, 1], [4, -1], [-1, -1], [1, 2]], rand).slice(0, 3);
  const chain = starts(3, rand).map((start, i) => ({ stage: "chain", start, ops: chainOps[i] }));
  return [...authored, ...predict, ...reverse, ...chain].map((problem, index) => ({ ...problem, index, answer: landingAfter(problem.start, problem.ops) }));
}

// 직접 돌리기는 도착 숫자가 같아도 돌린 양과 방향이 달라야 틀린다(원본 판정 그대로).
export function checkTurn(problem, quarters) {
  return quarters === problem.ops[0];
}

export function checkNumber(problem, value) {
  return value === problem.answer;
}

// 같은 곳에 닿는 보기는 모두 정답이다(보기는 reverseChoices가 하나만 남기지만 판정은 위치로 한다).
export function checkChoice(problem, op) {
  return landing(problem.start, op) === problem.answer;
}

export function missionText(problem) {
  if (problem.stage === "turn") return `${problem.start}에서 ${opText(problem.ops[0])} 돌리세요.`;
  if (problem.stage === "predict") return `${problem.start}에서 ${opText(problem.ops[0])} 돌리면 어디를 가리킬까요?`;
  if (problem.stage === "reverse") return `${problem.start}에서 ${problem.answer}까지 어떻게 돌렸을까요?`;
  return `${problem.start}에서 ${opText(problem.ops[0])}, 이어서 ${opText(problem.ops[1])} 돌리면 어디를 가리킬까요?`;
}

// 처음 틀렸을 때 독쌤이 주는 힌트. 답을 말하지 않고 생각할 길만 준다.
export function hintText(problem, attempt) {
  if (problem.stage === "turn") {
    if (attempt !== undefined && attempt !== 0 && landing(problem.start, attempt) === problem.answer) return "도착한 숫자는 같아. 그런데 돌린 양이나 방향이 달라. 한 칸씩 다시 세어 봐.";
    if (attempt !== undefined && Math.sign(attempt) !== Math.sign(problem.ops[0]) && attempt !== 0) return "방향을 다시 봐. 시계 방향은 숫자가 커지는 쪽이야.";
    return "반의 반 바퀴는 숫자 세 칸이야. 반 바퀴는 두 번, 한 바퀴는 네 번 돌려.";
  }
  if (problem.stage === "reverse") return "출발한 바늘에서 도착한 바늘까지 몇 번 꺾였는지, 어느 쪽으로 갔는지 봐.";
  if (problem.stage === "chain") return "한 번에 하지 말고, 첫 번째로 돌린 자리를 먼저 찾아. 거기서 두 번째로 돌려.";
  return Math.abs(problem.ops[0]) === 4 ? "한 바퀴를 돌면 처음 자리로 돌아와." : "반의 반 바퀴는 숫자 세 칸, 반 바퀴는 여섯 칸이야.";
}

export function successText(problem, choiceOp) {
  if (problem.stage === "reverse" && Math.abs(problem.ops[0]) === 2) return `맞았어! ${choiceOp < 0 ? "시계 방향" : "시계 반대 방향"}으로 반 바퀴 돌려도 똑같이 ${problem.answer}에 와.`;
  if (problem.stage === "chain") return `맞았어! 첫 번째로 ${landing(problem.start, problem.ops[0])}, 두 번째로 ${problem.answer}에 왔어.`;
  if (Math.abs(problem.ops[0]) === 4) return `맞았어! 한 바퀴를 돌면 다시 ${josa(problem.answer, "으로")} 돌아와.`;
  return `맞았어! ${problem.start}에서 ${opText(problem.ops[0])} 돌리면 ${josa(problem.answer, "이")}야.`;
}

// 첫 시도에 맞히면 별 2개, 두 번째에 맞히면 1개, 정답을 보고 넘어가면 0개.
export const starsFor = (wrongTries, revealed) => (revealed ? 0 : wrongTries === 0 ? 2 : 1);
export const medalFor = (stars, total) => (stars >= total * 2 - 2 ? "gold" : stars >= total ? "silver" : "bronze");
