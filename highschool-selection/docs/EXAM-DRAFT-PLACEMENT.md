# 시험 초안과 문항 배치 계약

이 계약은 관리자용 시험지 조립기의 첫 단계다. 공개 코드에는 문제 원문, 정답, 해설, PDF 경로, 다운로드 URL을 저장하지 않는다. 비공개 원문은 기존 서명 이미지·비공개 채점기 경계를 유지한다.

## 모델

```text
ExamDraft
  └─ ExamPlacement[]
       ├─ canonical itemId
       ├─ familyId / detail typeId / curriculum path
       ├─ order / points
       ├─ scopeState
       └─ replacementHistory
```

- 문항 원문은 canonical item으로 보존한다.
- 삭제는 `ExamPlacement`만 없애며 canonical item을 변경하지 않는다.
- 재정렬은 `placement.order`만 바꾼다.
- 교체는 같은 `placement.id`를 유지하고 이전·새 문항 ID, 관계, 사유 코드, 검토자 `T`를 남긴다.
- 같은 문항군은 추가 단계에서 기본 1개로 막으며, 시험별 제한을 명시적으로 늘린 경우만 추가할 수 있다.
- 범위를 바꾸면 기존 배치를 삭제하지 않는다. 각 배치는 `in_scope`, `out_of_scope`, `classification_required` 중 하나가 된다.
- `out_of_scope` 또는 `classification_required`, 혹은 검수 미완료 배치가 하나라도 있으면 `validateExamDraft`는 초안을 통과시키지 않는다.

## 후보 입력 경계

`createCandidate`는 다음 메타데이터만 허용한다.

```text
itemId, familyId, typeId, curriculum,
classificationVerified, answerVerified, rightsVerified, releaseEligible,
lineageRelation, difficultyBand,
coreConditionVerified, solutionStructureVerified
```

정답·풀이·문항 지문·PDF URL·저장 경로는 거부한다. 쌍둥이·유사 교체는 동일 문항군·세부유형, 핵심 조건과 풀이 구조 검토, 난도 검토를 모두 명시해야 한다.

## 현재 범위

이 단계는 데이터 계약과 자동검사만 제공한다. 후보 검색, 추가/삭제 버튼, 드래그 UI, 교사용 해설 출력, QR, 자체 A4 조판은 다음 단계에서 이 계약을 사용해 구현한다.
