// 선발시험(입학 모의고사) 정답 받기 — 원장 2026-11-16 「답안이 없어」.
// 정답은 git·공개 파일에 없다. 비공개 표 fields_unit_test_answer_keys(book_id selection-<시험 id>) →
// 서버 함수 unit-test-answers(권별 테스트와 같은 「모두에게 열기」)에서 필요할 때만 받는다.
// 7세 2·6차, 초1 1·3·4차는 교사용 답안지, 나머지는 직접 풀어 두 방법으로 검산한 값(초1 2차는 같은 문항이면 교사용 답안).
const ANSWER_API = "https://fgahqumaldheqettmvqg.supabase.co/functions/v1/unit-test-answers";
const cache = new Map();
export const SELECTION_ANSWER_IDS = new Set(["k6-2023-02", "k7-2022-04", "k7-2022-06", "k7-2022-08", "k7-2022-12", "g1-2022-03", "g1-2022-05", "g1-2019-08", "g1-2022-02"]);
export function loadSelectionAnswers(examId) {
  if (!SELECTION_ANSWER_IDS.has(examId)) return Promise.resolve(null);
  if (!cache.has(examId)) {
    cache.set(examId, fetch(ANSWER_API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bookId: `selection-${examId}` }) })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => data?.answers || null)
      .catch(() => null)
      .then((answers) => { if (!answers) cache.delete(examId); return answers; }));
  }
  return cache.get(examId);
}
