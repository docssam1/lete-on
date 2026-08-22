/*
 * 공개 코드에는 정답을 넣지 않습니다.
 * 운영 API가 승인·공개된 시험의 입력 스키마만 내려줍니다.
 * { examId, questions:[{number,points?,responseType,fields?}] }
 * 그림·작도형 self-check 문항만 검증 완료된 학생별 단기 서명
 * answerImageUrl/answerImageMimeType/answerImageExpiresAt를 추가할 수 있습니다.
 * SH 1회는 hsmiddle과 같은 40칸 답안표를 사용하지만 정답 검수 전에는
 * response-schema 자체를 운영 API가 반환하지 않습니다.
 */
window.HIGHSELECT_QUESTIONS = {};
