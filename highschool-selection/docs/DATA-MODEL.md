# 데이터 계약

## SelectionTrack

학원·프로그램 정체성과 선발 목적은 서로 다른 축으로 저장합니다. `programCode`는 운영 주체 코드이고, `trackId`는 여러 프로그램이 함께 사용할 수 있는 중립 선발 트랙입니다. 폴더 이름과 관계없이 전체 프로그램을 고등 전용으로 해석하지 않습니다.

```text
TrackDefinition
  id = high-selection | middle-entry | middle-transfer |
       common-math-entry | high-advance | high-transfer
  label, targetStage = middle | high
  admissionKind = selection | entry | transfer | advance-entry
  aliases[]  # middle-entry의 start 등 표시 호환값

ProgramTrackBinding
  id = programCode:trackId
  programCode, trackId
  scopeKey, scopeLabel
  scopeKind = cumulative | terminal-unit | sample
  terminalUnit = { course, unit }  # 편입형은 실제 진도 종료 단원
  usage = question-bank-only  # 중간 편입 진도 조립형; 특정 회차·컷과 연결 금지
  evidenceStatus = verified | observed | needs-review
  evidenceRefs[]

ExamTrackAssignment
  examId, programCode, trackId
```

`SH:high-selection`은 고등과정 선발용이지만 시험 범위는 `middle-cumulative`로 저장합니다. `middle-entry`와 `middle-transfer`는 별도 트랙이며, 공통수학 입학·고등선행·고등 편입도 서로 합치지 않습니다. 편입형 범위는 학기 이름만으로 뭉뚱그리지 않고 `일차함수까지`처럼 실제 수업이 끝나는 단원을 `terminalUnit`으로 저장합니다. 같은 중등 편입 트랙이라도 종료 단원이 다르면 문제은행 목표 범위를 별도로 둡니다. 기존 자료에 명칭만 있고 대상 학년·범위가 불명확한 연결은 `needs-review`로 격리해 시험 생성에 사용하지 않습니다. 아무 자료도 없는 프로그램-트랙 연결은 만들지 않습니다. 기존 `catalog.js`의 프로그램·시험 ID와 화면 호환용 `track` 문자열은 변경하지 않고 `ExamTrackAssignment`로 새 축을 연결합니다.

## Exam

```text
id
programId
title
track
curriculumVersion
scopeLabel
questionCount
pageCount
sourcePageCount
privateAnswerPageCount
sourceRole = actual | recommended | textbook | internal-variant
deliveryRole = first-sale-mock | practice-bank | internal-review
formProfile  # 학생 제공용 공통 시험지 폼; 원본 출처 디자인과 분리
sourceStatus = missing | found | audited | version_unmatched | structure_conflict
answerStatus = missing | found | verified
classificationStatus = missing | draft | verified
releaseStatus = draft | review_pending | blocked | released | archived
assetPolicy = signed-page-images
reviewProgress = sourceStructure | questionInventory | answerReview | curriculumReview | releaseDecision
```

## Question

```text
id, examId, number, points
responseType = input | multi_input | ordered_list | unordered_set | self_check
fields[] = { slotId, label, groupId?, groupLabel? }  # multi_input only
answerSpec
currentCurriculum = 2022-revised
currentCourse
gradeBand, semester, majorUnit, minorUnit, detailType
difficulty = lowered | standard | raised
sourceRole, sourceLocator
answerVerified, classificationEvidence, reviewStatus
generatorPolicyId, figureAuditPolicyId
```

## ProjectQuestionBankIndex

학원별 원본 DB를 서로 덮어쓰지 않고 프로젝트 전체에서 함께 검색하기 위한 비공개 통합 인덱스입니다.

```text
SourceBank
  sourceBankId, academyId, label, itemCount, status

SourceOccurrence
  itemId, sourceBankId, sourceItemId, sourceTypeId
  classificationStatus, detailPrecision
  conceptFamilyId, conceptStatus
  academyFits[] = profileId + status

ConceptFamily
  conceptFamilyId
  curriculum = course + semester + majorUnit + minorUnit
  canonicalLabel, solutionArchetype
  sourceTypes[] = sourceBankId + sourceTypeId + sourceLabel + status
  mergeStatus = single_source | exact_verified

OverlapCandidate
  candidateId, leftConceptFamilyId, rightConceptFamilyId
  score?, proposedRelation?, reason, evidence[]
  status = review_required
```

기존 `DP-TYP-*`, `typ-sh-*`, `M1-*`, `CM1.*` 유형 ID는 원본 검수 이력을 보존하기 위해 삭제하거나 바꾸지 않습니다. 공통 개념은 별도 `CPT-*` ID에 연결합니다. 같은 교육과정 위치와 같은 세부 유형만 자동으로 묶고, 이름이 비슷하거나 같은 단원에 있다는 이유만으로 합치지 않습니다.

원수학처럼 단원 수준까지만 확인된 분류는 `unit_only`, 황소 중등처럼 교육과정 분류 전인 문항은 `pending`으로 둡니다. 이 상태의 문항은 세부 유형 통계나 자동 시험 조립에 사용하지 않습니다. 선수 개념과 연계 개념은 병합하지 않고 별도 관계로 연결하며, 학원형은 공통 유형 ID가 아니라 `academyFits`에서 관리합니다.

`pageCount`는 학생에게 보여 주는 문제 페이지 수입니다. 원본 전체 쪽수는 `sourcePageCount`, 답·풀이 비공개 쪽수는 `privateAnswerPageCount`로 분리합니다. 답안 값과 풀이 내용은 공개 카탈로그에 두지 않습니다.

`sourceRole`은 출제 근거의 성격이고 `deliveryRole`은 판매·서비스 형태입니다. 실제 원본을 감사해 구성한 시험도 학생에게는 `first-sale-mock`과 공통 `formProfile`로 제공하며, 화면이나 인쇄물에 `원본형`을 상품명처럼 노출하지 않습니다.

학생 화면의 출제 모드는 `SH`, `DP`, `WM`, `ED`, `DG`, `SM` 코드만 사용하고 작성자 표기는 `T`로 고정합니다.

## StudentExamAccess

```text
studentId
studentName
approvalCodeHash
examId
grantedAt
expiresAt
revokedAt
```

승인은 시험별 행으로 저장합니다. 정적 파일에는 이름이나 승인번호 원문을 넣지 않습니다.

## ItemReviewStatus

```text
examId, roundCode, reviewVersion
itemId, number
answerStatus = pending | verified | blocked
classificationStatus = pending | verified | blocked
visualStatus = pending | passed | blocked
sourceFingerprintMatched = true | false
correctionArtifactMatched = true | false
resolutionStatus = pending | agent_verified | replacement_verified | scoring_excluded
examChecks = {
  responseSchemaStatus = pending | verified | blocked,
  scoringPolicyStatus = pending | verified | blocked,
  printAuditStatus = pending | passed | blocked,
  signedAssetStatus = pending | verified | blocked
}
```

답·풀이·문제 원문·저장 경로는 상태 객체에 넣지 않습니다. `agent_verified`와 `replacement_verified`는 답 검산·분류·시각·원본 지문·교정 산출물 지문이 모두 통과하고 현재 `reviewVersion`이 일치할 때만 기록합니다. 불확실성을 해소하지 못한 문항은 `scoring_excluded`로 명시해 채점·진단 분모에서 제외하며, 원본 답을 추측해 활성화하지 않습니다. 공개 `review-only` 인벤토리는 후보 분류와 중립 교정 계획만 보여 주고 운영 상태의 근거로 승격하지 않습니다.

SH-R01은 문항별 사용자 승인을 요구하지 않습니다. 검수자가 40문항을 위 상태 중 하나로 안전하게 처리한 뒤 사용자는 시험 1회 전체만 최종 확인합니다.

## FinalExamConfirmation

```text
examId, roundCode, reviewVersion
confirmation = pending | confirmed | rejected
itemCount, activeItemCount, excludedItemCount
```

`activeItemCount + excludedItemCount = itemCount`여야 하며, 40개 문항의 처리 상태와 동일한 검수 버전에 묶입니다. 답안 입력 구성, 채점·배점 정책, 인쇄 감사, 학생별 서명 이미지 자산도 모두 통과해야 합니다. 이 확인은 문항별 답을 승인하는 절차가 아니라 완성된 시험 1회 전체의 공개 여부를 확인하는 단일 절차입니다.

## ReviewEvidencePacket

```text
examId + roundCode + reviewVersion + itemId + number
expiresAt + sourceFingerprintMatched
panels[3] = problem | source-key | independent-audit
panel = role + signed image url + image mime type
```

관리자 검수 근거는 문제·원답 구간·독립 검산을 서버가 이미지로 렌더한 뒤 최대 10분의 서명 URL로만 전달합니다. 구조화된 문제·정답·풀이 텍스트, 원본 PDF/HWP 주소, 저장 경로와 영구 URL은 이 모델에 존재하지 않습니다.

## Attempt

```text
attemptId, studentId, examId
answers, questionStates
score, correctCount, answeredCount
submittedAt, gradingVersion
```

학생 제출값은 입력 방식별로 다음처럼 유지합니다. 정답·허용 정답·정규화 규칙은 이 객체에 넣지 않고 서버의 비공개 채점 명세에서만 읽습니다.

```text
input         -> value: string
multi_input   -> value: string[], slotIds: string[], groupIds: (string|null)[]
ordered_list  -> value: string[]       # 입력 순서 유지
unordered_set -> value: string[]       # 제출 전에 정규 순서로 정렬
self_check    -> value: o | x | ""    # 검증된 단일 정답 그림 확인
```

`multi_input`의 세 배열은 길이와 위치가 정확히 같아야 하며 빈 칸도 삭제하지 않습니다. 기존 `ox`는 운영 경계에서만 `self_check`로 변환하는 임시 호환 별칭이고 신규 데이터에는 저장하지 않습니다.

## CutlinePolicy

```text
id
programId, branchId, courseId, roundId, curriculumVersion
rule = level-score | correct-count | composite-correct-count
evidenceId, evidenceStatus
usage = reference-only | exam-approved
```

공개 검색으로 확인한 숫자는 `reference-only`다. `examAssignment.status=approved`, `policy.usage=exam-approved`, 사용자 승인자·승인시각이 모두 맞기 전에는 합격·불합격을 계산하지 않는다. 익명 불합격 결과로 커트라인을 역산하지 않는다.

## DiagnosticComment

```text
type = summary | strength | weakness | domain-specific | item-prescription | next-action | round-comparison
title, text
evidence = itemNumbers | aggregate | comparison
similarProblemSet = { status: approved, setId }  # item-prescription only
```

모든 코멘트는 문항 또는 재계산된 집계 근거와 일치해야 한다. 문항별 화면 표시는 `○/×`를 사용한다.

## SimilarProblem

```text
sourceQuestionId
gradeBand, majorUnit, minorUnit, detailType
coreConditions, solutionStructure
generationKind = parameterized | bespoke | figure_only
difficultyDelta = lowered | standard | raised
answerAuditStatus, figureAuditStatus, reviewStatus
```

## PracticePolicy / PracticeSet

```text
PracticePolicy
  id, mode, writer=T, version
  setSize, maxPerFamily=1, maxPerDetail, minDistinctDetails
  relationOrder = original -> twin -> similar
  spacingDays[masteryStatus]
  difficultyByMastery[masteryStatus]
  exactRepeatCooldownDays

PracticeAttempt
  id, learnerId, practiceSetId, practiceSetApprovalId
  questionId, familyId, relation, difficultyBand
  attemptedAt, result=correct|incorrect, recordVersion

PracticeSetPlan
  id, learnerId, policyId, policyVersion, plannedAt
  releaseStatus = blocked | approval_required | released
  items[] = questionId, familyId, relation, difficultyBand,
            curriculumKey, detailCode, masteryBefore, dueAt
```

숙달 상태는 `unseen | learning | consolidating | mastered | needs_review`다. 같은 입력은 같은 세트를 만들며, 동일 문항의 최근 재출제와 한 세트 내 같은 계열 반복을 막는다. 각 문항과 완성된 세트 모두 사용자 승인이 있어야 공개한다. 학생 이름, 제출 답안, 원답, 풀이, 원본 경로는 연습 계획 객체에 포함하지 않는다.

## SourceLineage / PrintPlan

```text
sourceExamId -> originalQuestionId -> questionTypeId -> questionId
relation = original | twin | similar
sourceRef = sourceAssetId + sha256 + pageNumber + itemLocator/bbox
```

세 단계 모두 사용자 승인 상태여야 서비스 체인을 만든다. 원본 PDF·문항 원문·답안·영구 URL·로컬 경로는 공개 데이터에 저장하지 않고, 승인된 A4 페이지를 비공개 서버에서 렌더링해 단기 서명 이미지로 전달한다.
