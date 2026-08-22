# 반복 연습 문제은행 정책

진단 결과에서 끝나지 않고 같은 세부 유형을 여러 번 연습하기 위한 운영 계약이다. 공개 코드에는 원문, 답, 풀이, PDF 주소, 로컬 경로를 넣지 않는다. 연습 세트는 승인된 중립 ID와 분류 메타데이터만 계획하고 실제 문항 이미지는 기존의 학생별 단기 서명 방식으로 전달한다.

## 1. 서비스 순서

한 문항 계열은 다음 순서를 지킨다.

```text
original -> twin -> similar -> spaced reattempt
```

- `original`: 사용자가 검수한 원본 문항
- `twin`: 풀이 구조를 유지하되 조건을 재설계한 쌍둥이 문항
- `similar`: 같은 세부 유형의 전이 연습 문항
- `spaced reattempt`: 세 단계를 모두 경험한 뒤 숙달도와 마지막 풀이 시각에 따라 다시 배정

세 단계 중 하나라도 문항 검증 또는 사용자 승인이 끝나지 않으면 해당 계열 전체를 첫 연습부터 막는다. 원본만 먼저 노출하고 승인되지 않은 유사문제로 이어지는 상태를 허용하지 않는다.

계열에는 `lowered`, `standard`, `raised` 세 난이도가 모두 승인된 후보로 존재해야 한다. 관계 3단계나 난이도 3단계 중 하나가 비어 있으면 해당 계열은 계획 후보가 아니다.

## 2. 난이도와 숙달도

교육 단계와 난이도를 섞지 않는다. 연습 난이도는 `lowered`, `standard`, `raised` 세 단계다.

| 숙달 상태 | 의미 | 우선 난이도 | 기본 재도전 간격 |
|---|---|---:|---:|
| `unseen` | 아직 푼 기록 없음 | `standard` | 즉시 |
| `learning` | 최근 오답, 아직 성공 연속 기록 없음 | `lowered` | 1일 |
| `consolidating` | 정답은 있으나 숙달 기준 미달 | `standard` | 3일 |
| `mastered` | 서로 다른 관계 2종 이상에서 3회 연속 정답, 기준/올림 근거 포함 | `raised` | 14일 |
| `needs_review` | 이전에 숙달했으나 최근 오답 | `lowered` | 1일 |

숙달 후 오답이면 `needs_review`로 내리고, 이후 2회 연속 정답을 확인해야 `mastered`로 복귀한다. 간격·연속 정답 기준은 버전이 붙은 정책으로 관리하므로 운영 중 변경해도 과거 계획을 재현할 수 있다.

## 3. 한 세트의 중복 방지

기본 정책은 다음과 같다.

- 같은 `questionId`를 한 세트에 두 번 넣지 않는다.
- 같은 `familyId`는 한 세트에 최대 1문항만 넣는다.
- 최근 7일 안에 푼 동일 문항은 다시 넣지 않는다.
- 세부 유형별 최대 문항 수와 최소 서로 다른 세부 유형 수를 함께 검사한다.
- 재도전 예정일이 지나지 않은 계열은 후보에서 제외한다.
- 첫 순환에서는 `original -> twin -> similar` 순서를 건너뛰지 않는다.

후보가 부족하면 작은 세트를 임의 공개하지 않는다. 계획은 `blocked`이며 `practice_set.insufficient_eligible_questions` 또는 `practice_set.insufficient_detail_diversity`를 남긴다.

## 4. 결정적 계획

동일한 아래 입력은 언제나 같은 세트 ID와 같은 문항 순서를 만든다.

```text
policy version
neutral learnerId
planning timestamp
approved candidate metadata
approved-set attempt history
```

선택 우선순위는 `needs_review -> learning -> consolidating -> unseen -> mastered`다. 같은 순위는 예정일, 계열 ID 순으로 정렬한다. 문항 안에서는 목표 관계, 목표 난이도와의 거리, 마지막 시도 시각, 문항 ID 순으로 결정한다. 난수와 브라우저 시계에 의존하지 않는다.

## 5. 승인 문턱

두 번의 승인이 필요하다.

1. 문항 승인: 원문·쌍둥이·유사문제 각각 `userApproval.status=approved`
2. 세트 승인: 생성된 `practiceSetId`에 대해 별도 `PracticeSetApproval.status=approved`

문항은 기존의 출처, 교육과정, 답안 검산, 단일 정답, 그림 가시성, 사용자 승인, 공개 상태 게이트를 모두 통과해야 한다. 그림·전개도·작도형은 보이는 정보만으로 정답이 하나인지 확인한 뒤에만 후보가 된다. 세트는 완성되어도 사용자 승인 전 상태가 `approval_required`이며 학생에게 공개할 수 없다.

## 6. 공개 메타데이터

```text
PracticePolicy
  id = pol-<mode>-<digest>
  mode, writer=T, version
  setSize, maxPerFamily, maxPerDetail, minDistinctDetails
  exactRepeatCooldownDays
  masteryMinCorrectStreak, masteryMinRelations, recoveryCorrectStreak
  relationOrder, spacingDays, difficultyByMastery

PracticeAttempt
  id = atm-<mode>-<digest>
  learnerId = lrn-<mode>-<digest>
  practiceSetId = pst-<mode>-<digest>
  practiceSetApprovalId = apr-<mode>-<digest>
  questionId, familyId, relation, difficultyBand
  attemptedAt, result=correct|incorrect, recordVersion

PracticeSetPlan
  id = pst-<mode>-<digest>
  learnerId, policyId, policyVersion, plannedAt
  releaseStatus=blocked|approval_required|released
  items[] = questionId, familyId, relation, difficultyBand,
            curriculumKey, detailCode, masteryBefore, dueAt
```

이 객체에는 학생 이름, 승인번호 원문, 문제 원문, 입력 답, 정답, 풀이, 원본 경로 또는 영구 URL이 없다. `data/questions.js`는 계속 빈 공개 레지스트리로 유지한다.

## 7. 검증

집중 검증:

```text
node --test tests/practice-set-planner-v2.test.cjs
```

전체 검증:

```text
node --test tests/*.test.cjs
```
