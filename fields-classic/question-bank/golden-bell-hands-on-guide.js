import { clockValueAfterQuarterTurns } from "./golden-bell-hands-on-models.js?v=20260926-book01d";

const directions = { right: "오른쪽", left: "왼쪽", up: "위쪽", down: "아래쪽" };

export function handsOnGuide(activity, round, state) {
  if (state.solved) return { phase: "success", text: ({
    clock: "좋아, 맞았어!",
    digital: "좋아! 막대의 모양과 숫자의 순서까지 살펴봤어.",
    "mirror-shape": "좋아! 거울에 가까운 끝과 먼 끝의 방향을 잘 비교했어.",
    preference: "세 친구에게 서로 다른 것을 하나씩 짝지었어.",
    "equal-lines": "빈칸이 없는 줄의 합을 이용해 두 줄을 같게 만들었어.",
    "fold-quarters": "접는 순서를 따라가 맨 위의 번호를 찾았어.",
    kakuro: "모든 카드를 한 번씩 쓰고 가로와 세로의 합을 맞췄어.",
    inference: "자리와 조건을 차례로 확인해 수를 찾았어.",
    "fold-shape": "접은 선의 반대쪽에도 같은 모양이 생기는 걸 찾았어.",
    fold: "접은 순서를 거꾸로 되짚어 잘린 자리를 모두 찾았어.",
    cross: "모든 카드를 한 번씩 쓰고 두 줄의 합도 같아.",
    order: "네 친구의 순서가 세 조건에 모두 맞아.",
    transfer: "두 사람의 수가 같아졌어. 전체 개수도 그대로야."
  })[activity.kind] };
  if (state.checked) return { phase: "retry", text: ({
    clock: "아직 아니야. 돌린 방향을 다시 보자.",
    digital: "숫자판 전체를 움직였는지 보자. 두 자리라면 순서도 바뀔 수 있어.",
    "mirror-shape": "거울에 가까운 끝이 비친 뒤 어느 쪽을 향하는지 다시 봐.",
    preference: "확실한 조건부터 정하고 남은 후보를 하나씩 지워 봐.",
    "equal-lines": "먼저 완성된 줄을 더하고, 빈칸이 있는 줄과 비교해 봐.",
    "fold-quarters": "움직인 종이 조각이 위에 놓여. 첫 접기부터 다시 보자.",
    kakuro: "위쪽과 오른쪽의 합을 하나씩 계산해 봐. 카드는 중복하면 안 돼.",
    inference: "한 조건씩 따져 봐. 남은 후보가 모두 맞는지 확인해 보자.",
    "fold-shape": "접은 선에서 같은 거리에 잘린 모양이 한 번 더 생겨.",
    fold: "마지막에 접은 선부터 펼친다고 생각해 봐. 자국은 어디로 옮겨질까?",
    cross: "카드를 중복해 놓지 않았는지, 두 줄의 합이 같은지 확인해 봐.",
    order: "맨 앞·맨 뒤를 확인하고, '바로 앞'인지도 살펴봐.",
    transfer: "옮긴 뒤의 두 수를 비교해 봐. 전체 개수는 바뀌지 않아."
  })[activity.kind] };

  if (activity.kind === "clock") return state.moves
    ? { phase: "progress", text: `지금 바늘은 ${clockValueAfterQuarterTurns(round.start, state.turns)}을 가리켜. 필요한 만큼 더 돌리거나 되돌려 봐.` }
    : { phase: "start", text: "반의 반 바퀴씩 돌려 문제를 맞춰 보자." };
  if (activity.kind === "digital") return state.digitalShown
    ? { phase: "progress", text: "움직인 뒤 켜져 있는 막대를 보고 수를 눌러 봐." }
    : { phase: "start", text: "숫자판을 직접 움직여 보자. 막대의 모양이 어떻게 달라질까?" };
  if (activity.kind === "mirror-shape") return state.mirrorChoice === null
    ? { phase: "start", text: "선의 짧은 끝을 따라가며 거울에 비치면 어느 쪽으로 향할지 살펴봐." }
    : { phase: "progress", text: "고른 모양의 짧은 끝이 거울에 가까운 쪽인지 비교해 봐." };
  if (activity.kind === "preference") return state.cells.length
    ? { phase: "progress", text: `지금 ${state.cells.length}명을 짝지었어. 한 가지를 두 사람이 고르지 않았는지 살펴봐.` }
    : { phase: "start", text: "좋아하는 것과 좋아하지 않는 것을 먼저 읽고, 확실한 짝부터 눌러 봐." };
  if (activity.kind === "equal-lines") return state.equalChoice === null
    ? { phase: "start", text: "빈칸이 없는 줄의 수를 먼저 모두 더해 보자." }
    : { phase: "progress", text: "놓은 수를 넣어 두 줄을 각각 더해 보자. 같은 합이니?" };
  if (activity.kind === "fold-quarters") return state.foldStep === 0
    ? { phase: "start", text: "네 칸의 번호를 먼저 보자. 접을 때 움직이는 쪽이 위에 놓여." }
    : state.foldStep < 2
      ? { phase: "progress", text: "두 겹을 다시 접으면 네 겹이 돼. 이번에는 어느 쪽이 움직일까?" }
      : { phase: "progress", text: "마지막에 움직인 두 겹을 생각하며 맨 위의 번호를 골라 봐." };
  if (activity.kind === "kakuro") return state.cells.some((cell) => cell !== null && !Object.values(round.givens).includes(cell))
    ? { phase: "progress", text: "놓은 카드가 위쪽·오른쪽의 합에 맞는지 살펴봐." }
    : { phase: "start", text: "이미 적힌 수부터 보고, 가로와 세로가 함께 맞는 자리를 찾아 봐." };
  if (activity.kind === "inference") return state.moves
    ? { phase: "progress", text: "지금 고른 카드와 각 자리의 조건을 다시 비교해 봐." }
    : { phase: "start", text: "조건을 하나씩 적용해 맞지 않는 수를 지워 보자." };
  if (activity.kind === "fold-shape") return !state.foldStep
    ? { phase: "start", text: "접는 선을 살펴보고 종이를 한 번 접어 보자." }
    : !state.cut
      ? { phase: "progress", text: "포개진 종이에서 표시된 모양을 잘라 보자." }
      : { phase: "progress", text: "접은 선을 거울처럼 생각해 펼친 모양을 골라 봐." };
  if (activity.kind === "fold") {
    if (state.cut) return { phase: "progress", text: "마지막 접기부터 거꾸로 펼쳐 잘린 칸을 표시하고 그 칸의 수를 더해 보자." };
    if (state.foldStep === round.model.folds.length) return { phase: "progress", text: "종이가 포개졌어. 표시된 자리를 잘라 보자." };
    const next = round.model.folds[state.foldStep];
    return { phase: state.foldStep ? "progress" : "start", text: `${state.foldStep ? "다음은" : "먼저"} ${directions[next]}으로 접어 보자. 종이가 어디에 포개질까?` };
  }
  if (activity.kind === "cross") return state.moves
    ? { phase: "progress", text: "놓은 카드로 가로와 세로의 합을 비교해 봐. 빈 자리에는 어떤 카드가 필요할까?" }
    : { phase: "start", text: "가운데 카드는 그대로 두고, 나머지 카드를 한 번씩 놓아 봐." };
  if (activity.kind === "order") return state.slots.some((slot) => slot !== null)
    ? { phase: "progress", text: "놓은 자리와 세 조건을 하나씩 비교해 봐. 카드를 다시 옮길 수 있어." }
    : { phase: "start", text: "맨 앞과 맨 뒤 조건부터 확인한 다음 친구 카드를 놓아 봐." };
  return state.moves
    ? { phase: "progress", text: `지금 두 사람의 차이는 ${Math.abs(state.left - state.right)}개야. 한 개 더 옮기면 차이가 어떻게 될까?` }
    : { phase: "start", text: "A에서 B로 한 개 옮기면 두 사람의 차이는 2개 줄어들어." };
}
