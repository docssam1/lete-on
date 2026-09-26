import { clockValueAfterQuarterTurns } from "./golden-bell-hands-on-models.js?v=20260925a";

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
    clock: "끝 숫자만 보지 말고, 방향과 ¼바퀴 횟수도 확인해 봐.",
    mirror: "거울선에서 몇 칸 떨어져 있는지 하나씩 짝지어 봐.",
    fold: "마지막에 접은 선부터 펼친다고 생각해 봐. 자국은 어디로 옮겨질까?",
    cross: "카드를 중복해 놓지 않았는지, 두 줄의 합이 같은지 확인해 봐.",
    order: "맨 앞·맨 뒤를 확인하고, '바로 앞'인지도 살펴봐.",
    transfer: "옮긴 뒤의 두 수를 비교해 봐. 전체 개수는 바뀌지 않아."
  })[activity.kind] };

  if (activity.kind === "clock") return state.moves
    ? { phase: "progress", text: `지금 바늘은 ${clockValueAfterQuarterTurns(round.start, state.turns)}을 가리켜. 필요한 만큼 더 돌리거나 되돌려 봐.` }
    : { phase: "start", text: "¼바퀴를 돌리면 숫자 세 칸을 지나가. 출발점과 방향을 먼저 봐." };
  if (activity.kind === "mirror") return state.cells.length
    ? { phase: "progress", text: `지금 ${state.cells.length}칸을 골랐어. 주어진 칸과 거울선 사이의 거리를 비교해 봐.` }
    : { phase: "start", text: "거울선에서 같은 거리의 빈칸을 찾아 직접 눌러 봐." };
  if (activity.kind === "fold") {
    if (state.cut) return { phase: "progress", text: "이제 접은 순서의 반대로 펼쳐 보자. 잘린 칸을 빈 격자에 표시해 봐." };
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
  return state.moves
    ? { phase: "progress", text: `지금 두 사람의 차이는 ${Math.abs(state.left - state.right)}개야. 한 개 더 옮기면 차이가 어떻게 될까?` }
    : { phase: "start", text: "A에서 B로 한 개 옮기면 두 사람의 차이는 2개 줄어들어." };
}
