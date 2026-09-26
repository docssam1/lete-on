export const HANDS_ON_VOICE_CUES = Object.freeze({
  clock: Object.freeze({
    start: "출발한 수를 보고, 필요한 방향으로 사분의 일 바퀴씩 돌려 보자.",
    retry: "끝에 가리키는 수뿐 아니라, 어느 방향으로 몇 번 돌렸는지도 확인해 보자.",
    success: "좋아! 방향과 돌린 양, 마지막 수가 모두 맞았어."
  }),
  mirror: Object.freeze({
    start: "거울선에서 같은 거리의 칸을 찾아 색칠해 보자.",
    retry: "거울을 사이에 두고 두 칸이 똑같이 떨어져 있는지 살펴보자.",
    success: "잘했어! 거울 양쪽의 칸이 정확히 짝을 이루었어."
  }),
  fold: Object.freeze({
    start: "종이를 접고 자른 다음, 접은 순서의 반대로 펼쳐 보자.",
    retry: "마지막에 접은 선부터 하나씩 되돌려 보자. 잘린 자리도 함께 옮겨야 해.",
    success: "맞았어! 접은 순서를 거꾸로 따라가니 잘린 자리를 모두 찾았어."
  }),
  cross: Object.freeze({
    start: "카드를 한 번씩 놓아 가로줄과 세로줄의 합을 같게 만들어 보자.",
    retry: "같은 카드를 두 번 쓰지 않았는지 보고, 두 줄의 합을 다시 비교해 보자.",
    success: "좋아! 카드를 모두 한 번씩 쓰고, 가로와 세로의 합도 같아."
  }),
  order: Object.freeze({
    start: "앞과 뒤를 먼저 정하고, 바로 앞에 있다는 조건을 확인해 보자.",
    retry: "조건을 하나씩 읽으며, 네 자리의 앞뒤 관계를 다시 확인해 보자.",
    success: "잘했어! 네 친구의 순서가 모든 조건에 맞아."
  }),
  transfer: Object.freeze({
    start: "한 개를 옮길 때 두 사람의 차이가 얼마나 줄어드는지 보자.",
    retry: "옮긴 뒤 두 사람의 수가 같은지, 전체 수는 그대로인지 살펴보자.",
    success: "좋아! 두 사람의 수가 같아졌고, 전체 수도 그대로야."
  })
});

export function handsOnVoiceCue(activity, state) {
  const phase = state.solved ? "success" : state.checked ? "retry" : "start";
  const text = HANDS_ON_VOICE_CUES[activity.kind]?.[phase];
  if (!text) throw new Error(`Missing hands-on voice cue: ${activity.kind}/${phase}`);
  return { id: `${activity.kind}-${phase}`, text };
}

export function allHandsOnVoiceCues() {
  return Object.entries(HANDS_ON_VOICE_CUES).flatMap(([kind, phases]) =>
    Object.entries(phases).map(([phase, text]) => ({ id: `${kind}-${phase}`, text })));
}
