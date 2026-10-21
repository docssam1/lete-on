// Requested only after the learner submits an answer; never preselect an answer.
export function sourceFeedback(choice) {
  return (choice === '3' ? '잘 찾았어요. ' : '③의 설명을 다시 살펴보세요. ') + '직렬 연결에서 전지 하나를 빼면 전구를 지나는 길이 끊겨 불이 꺼져요. 빈자리는 다른 선으로 잇지 않는 조건이에요.';
}
