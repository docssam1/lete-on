// 2026-11-24 사용자 일회 예외 승인("네가 풀어", "이번만 예외로", "출판사 표시 true").
// 출판사 답지 대조가 아니라, 앱 정답을 보지 않은 AI 독립 풀이 633문항(보통 난이도 pool 0)과 앱 정답의 일치,
// 그리고 학원 채점 손글씨 답(참고)으로 확인했다. 답이 갈린 문항은 다시 풀어 모두 앱 정답이 맞음을 확인했다.
// 여러 원문 모듈이 문항 목록에 publisherAnswerVerified:false를 다시 써 넣으므로, 이 파일은 모든 원문 모듈 뒤에 불러온다.
// 문항(question) 객체의 publisherAnswerVerified 계약은 바꾸지 않는다.
(() => {
  const inventory = window.HSE_SOURCE_INVENTORY_GRADE6;
  if (!inventory || !Array.isArray(inventory.items)) return;
  const basis = "user-exception-20261124-ai-independent-solve";
  inventory.publisherAnswerVerificationException = {
    date: "2026-11-24",
    basis,
    scope: "633 grade-6 source items, normal difficulty pool 0",
    note: "출판사 답지 대조 아님. 사용자 일회 예외 승인으로 AI 독립 풀이 일치와 학원 채점 손글씨 참고를 근거로 표시"
  };
  inventory.items.forEach(item => {
    item.publisherAnswerVerified = true;
    item.publisherAnswerVerificationBasis = basis;
  });
})();
