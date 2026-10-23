import { clockValueAfterQuarterTurns, unfoldTargets } from "./golden-bell-hands-on-models.js?v=20261023t";

const unfoldTargetCount = (round, state) => unfoldTargets(round, state.unfold).filter((cell) => !state.cells.includes(cell)).length;

const directions = { right: "오른쪽", left: "왼쪽", up: "위쪽", down: "아래쪽" };

export function handsOnGuide(activity, round, state) {
  if (state.solved) return { phase: "success", text: ({
    clock: "좋아! 도는 방향과 바퀴 수까지 모두 맞았어.",
    mirror: "거울선 양쪽의 칸이 같은 거리에서 짝을 이루었어.",
    fold: "접은 순서를 거꾸로 되짚어 잘린 자리를 모두 찾았어.",
    cross: "모든 카드를 한 번씩 쓰고 두 줄의 합도 같아.",
    order: "네 친구의 순서가 세 조건에 모두 맞아.",
    transfer: "두 사람의 수가 같아졌어. 전체 개수도 그대로야."
  })[activity.kind] };
  if (state.checked) return { phase: "retry", text: ({
    clock: "끝 숫자만 보지 말고, 방향과 반의 반 바퀴씩 돌린 횟수도 확인해 봐.",
    mirror: "거울선에서 몇 칸 떨어져 있는지 하나씩 짝지어 봐.",
    fold: "마지막에 접은 선부터 펼친다고 생각해 봐. 자국은 어디로 옮겨질까?",
    cross: "카드를 중복해 놓지 않았는지, 두 줄의 합이 같은지 확인해 봐.",
    order: "맨 앞·맨 뒤를 확인하고, '바로 앞'인지도 살펴봐.",
    transfer: "옮긴 뒤의 두 수를 비교해 봐. 전체 개수는 바뀌지 않아."
  })[activity.kind] };

  if (activity.kind === "clock") return state.moves
    ? { phase: "progress", text: `지금 바늘은 ${clockValueAfterQuarterTurns(round.start, state.turns)}을 가리켜. 필요한 만큼 더 돌리거나 되돌려 봐.` }
    : { phase: "start", text: "반의 반 바퀴씩 돌려 문제를 맞춰 보자. 출발점과 방향을 먼저 봐." };
  if (activity.kind === "mirror") return state.cells.length
    ? { phase: "progress", text: `지금 ${state.cells.length}칸을 골랐어. 주어진 칸과 거울선 사이의 거리를 비교해 봐.` }
    : { phase: "start", text: "거울선에서 같은 거리의 빈칸을 찾아 직접 눌러 봐." };
  if (activity.kind === "fold") {
    // 골든벨 풀이: 마지막에 접은 선부터 펼친다 → 새 자국을 접은 선 반대쪽 같은 거리에 표시 → 첫 접기까지 되돌린 뒤 센다.
    const n = round.model.folds.length;
    if (state.note) return { phase: "retry", text: state.note };
    if (state.cut) {
      if (state.unfold === 0) return { phase: "progress", text: `① 접은 순서의 반대로 펼쳐. 마지막에 접은 ${directions[round.model.folds[n - 1]]} 접기부터 펼쳐 보자.` };
      const fold = round.model.folds[n - state.unfold];
      const left = unfoldTargetCount(round, state);
      if (left) return { phase: "progress", text: `② 방금 펼친 ${fold === "left" || fold === "right" ? "세로" : "가로"} 접은 선(점선)이 거울이야. 있던 자국과 같은 거리의 반대쪽에 새 자국이 ${left}개 더 있어. 눌러서 표시해 봐.` };
      if (state.unfold < n) return { phase: "progress", text: `좋아. 이제 그 전에 접은 ${directions[round.model.folds[n - state.unfold - 1]]} 접기를 펼쳐 보자.` };
      return { phase: "progress", text: `③ 다 펼쳤어. 자국은 모두 ${state.cells.length}개야. 「결과 확인」으로 세어 보자.` };
    }
    if (state.foldStep === round.model.folds.length) return { phase: "progress", text: "종이가 포개졌어. 표시된 자리를 잘라 보자." };
    const next = round.model.folds[state.foldStep];
    return { phase: state.foldStep ? "progress" : "start", text: `${state.foldStep ? "다음은" : "먼저"} ${directions[next]}으로 접어 보자. 종이가 어디에 포개질까?` };
  }
  if (activity.kind === "cross") return state.slots.some((slot) => slot !== null)
    ? { phase: "progress", text: "놓은 카드로 가로와 세로의 합을 비교해 봐. 빈 자리에는 어떤 카드가 필요할까?" }
    : { phase: "start", text: "가운데 카드는 그대로 두고, 나머지 카드를 한 번씩 놓아 봐." };
  if (activity.kind === "order") return state.slots.some((slot) => slot !== null)
    ? { phase: "progress", text: "놓은 자리와 세 조건을 하나씩 비교해 봐. 카드를 다시 옮길 수 있어." }
    : { phase: "start", text: "맨 앞과 맨 뒤 조건부터 확인한 다음 친구 카드를 놓아 봐." };
  // 골든벨 풀이 순서: ① 차이 구하기 ② 한 개 옮길 때 차이가 2 줄므로 차이를 둘로 나누기 ③ 옮긴 뒤 같은지 확인.
  const difference = round.left - round.right;
  if (state.note) return { phase: "retry", text: state.note };
  if (state.phase === "diff") return state.marked.length
    ? { phase: "progress", text: `짝이 없는 구슬을 ${state.marked.length}개 찾았어. 남은 것도 찾아 봐.` }
    : { phase: "start", text: "① 위 A의 구슬을 아래 B의 구슬과 하나씩 짝지었어. 짝이 없는 A의 구슬을 모두 눌러 봐. 그만큼이 두 사람의 차이야." };
  if (state.phase === "half") return state.give.length
    ? { phase: "progress", text: `${state.give.length}개를 골랐어. 주면 A는 ${round.left - state.give.length}개, B는 ${round.right + state.give.length}개가 돼. 맞다면 「골라서 주기」를 눌러.` }
    : { phase: "progress", text: `② 차이는 ${difference}개야. A가 한 개를 주면 A는 1 줄고 B는 1 늘어서 차이가 2 줄어. 차이 ${difference}개 가운데 몇 개를 주면 될까? 줄 구슬을 골라 봐.` };
  return { phase: "progress", text: `③ ${round.left} − ${state.moved} = ${state.left}, ${round.right} + ${state.moved} = ${state.right}. 두 사람의 수가 같은지 「결과 확인」으로 확인해 봐.` };
}
