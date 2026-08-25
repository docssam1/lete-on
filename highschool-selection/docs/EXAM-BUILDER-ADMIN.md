# 관리자 시험 초안 편집기

`admin/exam-builder.html`은 운영 API와 관리자 세션이 있을 때만 동작한다. GitHub Pages 정적 배포에서는 생성·조회·저장이 차단된다.

## 보관 원칙

- 후보 인덱스와 초안에는 중립 ID, 교육과정 경로, 응답 형식, 난이도, 검증 상태만 저장한다.
- 문항 원문, 정답값, 해설, PDF 주소, 원본 저장 경로는 이 계약과 API 응답에 넣지 않는다.
- 정답 검산·권리·분류·공개 적합성이 모두 확인되지 않은 후보는 초안에 남아도 `review_required`로 잠긴다.
- 범위를 바꾸는 기능은 배치를 지우지 않고 `out_of_scope` 또는 `classification_required` 상태로 표시해야 한다.

## 비공개 운영 설정

비공개 `highselect-private-config/v1` 설정에 아래처럼 `examDraftCandidates` 배열을 둘 수 있다. 이 파일은 공개 저장소에 올리지 않는다.

```json
{
  "examDraftCandidates": [{
    "itemId": "qst-bnk-0000000000000000",
    "mode": "SH",
    "familyId": "qst-bnk-1111111111111111",
    "typeId": "typ-bnk-2222222222222222",
    "curriculum": { "grade": "G09", "major": "ALG", "minor": "EQ", "detail": "LIN" },
    "responseType": "single_choice",
    "classificationVerified": true,
    "answerVerified": true,
    "rightsVerified": true,
    "releaseEligible": true,
    "lineageRelation": "original",
    "difficultyBand": "standard",
    "coreConditionVerified": true,
    "solutionStructureVerified": true
  }]
}
```

후보의 `mode`는 대상 프로그램 코드여야 한다. `responseType`은 질문은행의 허용 응답 형식만 쓴다. 등록 시 알 수 없는 필드와 보호된 콘텐츠 필드는 거부된다.

## 저장·API

- `HIGHSELECT_EXAM_DRAFT_STORE_PATH`를 설정하면 초안·배치가 운영 서버의 제한된 파일에 영속 저장된다. 설정하지 않으면 서버 메모리에만 남는다.
- 모든 `/admin/exam-drafts` 요청은 HttpOnly 관리자 세션이 필요하고, 응답은 `Cache-Control: no-store`다.
- 지원 흐름: 초안 생성·선택, 후보 필터/정렬, 한 개 또는 선택 후보 일괄 추가, 배치 삭제, 위/아래 순서 변경, 범위 변경, 호환 후보 교체.
- 일괄 추가는 전부 유효할 때만 한 번에 저장된다. 중복 후보·가족 사용 제한·미검증 후보가 하나라도 있으면 부분 저장하지 않는다.
- 출력 구성 미리보기는 문항 번호·배점·응답 형식만 보여 준다. 이는 실제 학생용 시험지나 정답지가 아니며, 원문·정답 검증과 권리 게이트를 대체하지 않는다.
- 교체는 `twin` 또는 `similar` 후보만 허용하며, 동일 가족·세부유형, 핵심 조건, 풀이 구조, 난이도 재검토 확인을 모두 서버에서 요구한다.
- 초안은 배치 ID를 보존하므로 삭제·정렬은 원본 질문 레지스트리를 변경하지 않는다.
