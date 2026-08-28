# Grade 6 수학 진단·분석·처방 제품 결정

- 기준일: 2026-08-29
- 적용 대상: `asm-bdg-grade6-entry-plan-v1`과 후속 Grade 6 평가·리포트·로드맵
- 문서 성격: 미국 K–12 공식 기준과 연방 기술지원 자료를 바탕으로 한 구현 결정
- 상태: 제품 계약. 실제 학생 운영은 기존 출시 게이트를 모두 통과할 때까지 잠금

## 1. 결정 요약

Grade 6 제품은 하나의 시험 점수로 학생을 배치하는 시스템이 아니다. 다음 세 가지 측정 목적을 분리하고, 서로 다른 결과와 의사결정 권한을 갖게 한다.

1. `screening`: 추가 확인이 필요한 위험 신호를 찾는다.
2. `diagnostic`: 구체적인 강점, 결손, 오류 양상과 선수학습 연결을 확인한다.
3. `progress-monitoring`: 교사가 확인한 개입에 학생이 반응하는지 시간에 따라 확인한다.

42문항 Grade 6 폼은 5개 내용 영역과 수학적 실천을 함께 다루되, 결과는 영역·클러스터·선수학습 노드별 근거로 보고한다. 컷 점수 하나, 한 문항의 오답, 한 번의 사후검사만으로 배치·개입·승급을 확정하지 않는다. 시스템은 다음 경로를 제안할 수 있지만, 승급과 공식 배치는 항상 `school-review-required`이며 학교 검토자가 승인해야 한다.

```text
screening signal
  -> 추가 근거 수집
  -> diagnostic evidence
  -> 교사/학교 검토
  -> intervention plan candidate
  -> 교사 승인 및 충실도 기록
  -> progress-monitoring time series
  -> 유지·조정·종료 제안
  -> 학교 검토
```

## 2. 목표와 비목표

### 목표

- Grade 6의 현재 내용 이해와 관련 Grade 5 선수학습을 구분해 보여 준다.
- 학생에게는 이해 가능한 강점·다음 학습을, 교사에게는 문항·루브릭·오류·신뢰도 근거를 제공한다.
- 스크리닝, 진단, 진도 모니터링 데이터를 목적에 맞게 저장하고 해석한다.
- 처방을 단순 문제 추천이 아니라 목표, 근거, 강도, 기간, 충실도, 재검토 규칙을 가진 계획으로 만든다.
- 다언어 학생의 영어 접근 부담과 수학 지식에 대한 추론을 구분한다.
- 모든 고위험 결정에 학교 검토, 버전, 근거, 승인자를 남긴다.

### 비목표

- 단일 총점으로 `Grade 5.7`, `Grade 6 수준`, `NAEP Proficient` 같은 개인 학년 등가를 생성하지 않는다.
- NAEP 척도나 성취수준 컷을 개인 학생 점수로 변환하지 않는다.
- 스크리닝 결과만으로 특수교육, 장애, Tier 2/3, 반 편성, 승급을 확정하지 않는다.
- 공개 브라우저에서 정답, 루브릭, 원문항 ID, 내부 오류 규칙, 개인 학생 기록을 계산하거나 노출하지 않는다.
- 영어 능력, 체류 기간, 출신 국가를 수학 결손의 대리변수로 사용하지 않는다.
- 진단 직후 검증되지 않은 자료를 자동 배정하거나, 사후검사 한 번으로 개입 성공을 선언하지 않는다.

## 3. 세 평가 목적의 분리

| 목적 | 핵심 질문 | 허용 출력 | 금지 출력 | 다음 단계 |
| --- | --- | --- | --- | --- |
| Screening | 누가 추가 확인이 필요한가? | 위험 신호, 컷과의 거리, 재확인 필요, 영역별 관찰 | 구체 결손 확정, 자동 Tier 배치, 승급/유급 | 두 번째 스크리닝, 기존 학교 자료 결합, 진단 |
| Diagnostic | 무엇을 알고 어디에서 풀이가 무너지는가? | 영역·클러스터·스킬 근거, 선수노드, 오류 가설, 추가 확인 항목 | 장애 진단, 한 문항 기반 숙달/미숙달 확정 | 교사 근거 검토, 처방 후보 |
| Progress monitoring | 개입 뒤 충분한 성장과 유지가 있는가? | 기준선, 목표선, 관찰값, 추세, 충실도, 유지/조정 제안 | 단일 관찰값 기반 변경, 목표 자동 하향 | 유지, 강화, 진단 재검토, 학교 검토 |

각 평가 폼은 서버에서 `assessmentPurpose`를 하나만 갖는다. 같은 문항을 재사용할 수는 있어도, 도구가 각 목적에 적합하다는 근거 없이 스크리닝 점수를 진단 점수나 진도 모니터링 추세로 재해석하지 않는다.

### 컷 점수 처리

- 모든 컷은 `policyId`, `policyVersion`, 대상 집단, 도구 버전, 적용 날짜를 가진다.
- 결과에는 이분법적 상태만 저장하지 않고 `distanceFromCut`, 측정 오차 또는 불확실성 표시, 근거 수를 함께 저장한다.
- 컷 부근 학생은 `borderline-review`로 표시하고 반복 측정 또는 다른 학교 자료를 요구한다.
- 민감도와 특이도의 균형은 학교 정책 소유자가 정한다. 시스템이 임의로 컷을 최적화하지 않는다.
- 지역·도구별 cadence가 다르므로 연 2회 또는 3회를 전역 상수로 박지 않는다. 서버 정책으로 횟수와 창을 구성한다.

## 4. Grade 6 내용 모델

### 4.1 다섯 영역

| 코드 | 영역 | Grade 6 핵심 증거 |
| --- | --- | --- |
| `6.RP` | Ratios and Proportional Relationships | 비·비율·단위율의 의미, 표·이중수직선·식·좌표 표현, 백분율과 단위 변환 |
| `6.NS` | The Number System | 분수 나눗셈, 다자리 수 계산, 공약수·공배수, 음수를 포함한 유리수와 좌표 |
| `6.EE` | Expressions and Equations | 식의 의미·동치, 일차 방정식·부등식, 종속·독립 변수 관계 |
| `6.G` | Geometry | 넓이, 겉넓이, 부피, 분해·재배열, 좌표평면의 도형 |
| `6.SP` | Statistics and Probability | 통계 질문, 분포, 중심과 변이, 맥락에 따른 요약과 해석 |

42개 슬롯은 위 5개 영역을 모두 포함한다. 전체 슬롯 수만 맞아서는 안 되며, `domain -> cluster -> standard -> skillNode`가 검수된 설계표와 일치해야 한다. CCSS가 Grade 6에서 강조하는 네 핵심 축인 비·비율, 분수 나눗셈과 유리수, 식·방정식, 통계적 사고는 폼 설계와 리포트에서 우선 근거를 확보한다. Geometry도 독립 영역으로 반드시 보고한다.

### 4.2 내용과 수학적 실천

문항은 계산 정답뿐 아니라 가능한 범위에서 다음 증거를 명시한다.

- 문제 이해와 풀이 지속
- 추상적·정량적 추론
- 주장과 근거 설명
- 수학적 모델링
- 도구 선택
- 단위·기호·정밀성
- 구조 인식
- 반복 추론의 규칙성

`practiceTag`는 내용 영역을 대체하는 별도 총점이 아니다. 문항의 내용 스킬과 함께 저장하며, 짧은 자동채점 문항만으로 설명·모델링 능력을 과도하게 추론하지 않는다.

### 4.3 선수학습 그래프

선수학습 그래프는 `prerequisite -> current target -> next evidence` 방향의 유향 그래프다. 초기 Grade 6 그래프에는 최소 다음 연결을 둔다.

```text
G5 whole-number multiplication/division
  -> 6.RP ratio and unit-rate reasoning
  -> equivalent-ratio tables, percent, unit conversion

G5 fraction meaning and multiplication
  -> G5 unit-fraction division
  -> 6.NS fraction-by-fraction division

G5 whole-number place value and decimal computation
  -> 6.NS multi-digit and decimal fluency
  -> 6.EE numerical/algebraic expressions

G5 first-quadrant coordinates
  -> 6.NS signed rational numbers and all four quadrants
  -> 6.G coordinate polygons

G5 area and volume with whole-number dimensions
  -> 6.G area by decomposition
  -> surface area and volume with fractional dimensions

G5 line plots and fraction-based data operations
  -> 6.SP statistical questions and distributions
  -> center, variability, and contextual interpretation
```

노드는 최소 `nodeId`, `grade`, `domain`, `standardRef`, `concept`, `evidenceRequirement`, `sourceVersion`을 갖는다. 간선은 공식 기준에서 직접 확인되는 진행과 제품 가설을 구분해 `relationshipType`과 `evidenceStatus`를 저장한다. 제품 가설 간선은 교사 검토 없이 확정 선수관계로 표시하지 않는다.

## 5. 분석 및 보고서 계약

### 5.1 공통 메타데이터

모든 리포트 스냅샷은 다음 필드를 서버에서 생성한다.

| 필드 | 요구 사항 |
| --- | --- |
| `reportId`, `learnerId` | 공개 계정 ID와 분리된 서버 권위 식별자 |
| `assessmentPurpose` | `screening`, `diagnostic`, `progress-monitoring` 중 하나 |
| `formId`, `formVersion`, `blueprintHash` | 사용한 폼과 42-slot 계약을 재현 가능하게 고정 |
| `policyId`, `policyVersion` | 컷, 밴드, 검토 규칙의 버전 |
| `standardsJurisdiction`, `standardsVersion` | CCSS 또는 주 기준 매핑 |
| `administrationLanguage` | 응시 언어 |
| `languageProfileAtAdministration` | 사용 가능한 경우 학생의 현재 언어 접근 맥락 |
| `accommodationsUsed` | 실제 제공한 조정과 제공 실패 |
| `startedAt`, `submittedAt`, `finalizedAt` | 응시와 리포트 확정 시각 |
| `scoringStatus` | 자동·교사 채점 완료 여부 |
| `reviewStatus` | `draft`, `teacher-reviewed`, `school-approved`, `published` |

### 5.2 영역·클러스터·스킬 근거

총점은 탐색용 요약일 뿐 결정 필드가 아니다. 각 영역과 하위 노드에 다음을 제공한다.

- `evidenceCount`, `possibleEvidenceCount`, `coverageStatus`
- 획득 점수와 가능한 점수
- 자동채점/교사채점 구분
- 정답·부분정답·무응답·시간초과 수
- 대표 오류 관찰과 `misconceptionHypothesis`
- 선수학습 노드 상태: `supported`, `needs-confirmation`, `insufficient-evidence`
- 현재 Grade 6 목표 상태: `supported`, `developing`, `needs-confirmation`, `insufficient-evidence`
- 불일치 근거: 비슷한 문항에서 상반된 반응, 언어·표현 방식에 따른 차이
- 교사 확인 필요 여부와 근거 문항 참조

한 문항만으로 `mastered` 또는 `deficit confirmed`를 만들지 않는다. 근거 수가 부족하면 점수 대신 `insufficient-evidence`를 우선 표시한다. 문항 난이도와 내용 범위가 다른 영역 백분율을 서로 직접 순위화하지 않는다.

### 5.3 학생 리포트

학생용에는 다음만 표시한다.

- 확인된 강점
- 더 확인할 내용
- 교사가 승인한 다음 학습
- 결과가 나온 근거의 수와 범위
- 언어 또는 제공 조건 때문에 해석이 제한될 때의 짧은 설명
- 다음 확인 날짜

내부 문항 ID, 정답, 채점키, 루브릭, 컷 정책, 다른 학생 비교, 장애 추정, 자동 승급 문구는 노출하지 않는다.

### 5.4 교사·학교 리포트

교사·학교용에는 학생용 필드에 더해 다음을 제공한다.

- 문항 버전, 표준·스킬 매핑, 응답, 배점, 채점자와 채점 시각
- 교사채점 루브릭 근거와 검토 대기열
- 영역·클러스터별 근거 충돌과 추가 확인 문항
- 스크리닝 컷과의 거리 및 반복 측정 상태
- 선수학습 그래프의 관련 노드와 추천 진단 순서
- 처방 후보, 근거, 대안, 충실도 확인 항목
- 이전 개입과 진도 모니터링 이력
- 언어, 조정, 응시 조건에 따른 해석 제한
- 승인·수정·거절한 학교 검토자와 사유

## 6. 처방 규칙

### 6.1 처방 후보 생성 조건

처방 후보는 다음이 모두 충족될 때만 생성한다.

1. 자동채점과 필요한 교사채점이 확정되었다.
2. 목표 스킬에 두 개 이상의 독립 근거가 있거나, 근거 부족이 명시된 추가 확인 계획이 있다.
3. 관련 선수노드와 현재 목표를 분리해 검토했다.
4. 언어·조정·응시 이상이 수학 결손처럼 보일 가능성을 검토했다.
5. 기존 학교 자료와 충돌하면 자동 배정하지 않고 검토 대기 상태로 둔다.

### 6.2 처방 객체

각 처방 후보는 최소 다음 필드를 갖는다.

```text
targetSkillNode
rationaleEvidenceIds
prerequisiteNodes
instructionalGoal
validatedInterventionOrPractice
intensity: strength, dosage, alignment, transfer, comprehensiveness,
           academicBehaviorSupport, individualization
sessionLength
sessionsPerWeek
plannedWeeks
groupSize
deliveryLanguageAndSupports
fidelityChecklist
progressMonitoringTool
baseline
goalLine
collectionFrequency
reviewFrequency
decisionRule
adaptationOptions
teacherApproval
schoolReviewStatus
```

### 6.3 내용별 처방 원칙

- 절차만 반복시키지 않고 개념 이해와 수학적 실천을 함께 다룬다.
- 필요에 따라 체계적 설명, 명료한 수학 언어, 구체·반구체 표현, 수직선, 공통 구조에 기반한 문장제 지도를 연결한다.
- Grade 6의 분수·유리수 결손은 관련 Grade 5 선수노드를 먼저 확인하되, 학생을 장기간 낮은 학년의 단순 연산에만 머물게 하지 않는다.
- fluency 활동은 여러 방법 중 하나이며 속도를 숙달의 유일한 정의로 쓰지 않는다.
- 학생이 이미 아는 내용을 다시 배정하는 대신, 오류의 위치와 전이 과제를 함께 제시한다.

### 6.4 진도 모니터링과 변경

- 개입 시작 전에 도구, 기준선, 목표선, 수집 빈도, 검토 빈도, 결정 규칙을 확정한다.
- 관찰값은 시간순 append-only 기록으로 저장하고, 개입 변경 지점에는 phase-change 표식을 남긴다.
- 도구 고유의 검증된 결정 규칙을 우선한다. 예시 4-point 규칙을 사용할 경우 최소 6개 관찰 후 최근 4개 점을 검토한다.
- 단일 낮은 점수로 처방을 변경하지 않는다. 충분한 자료가 없으면 `continue-collecting-data`를 반환한다.
- 성장 부족 시 먼저 실행 충실도, 출석, 언어 접근, 도구 적합성을 확인하고 진단 자료를 재검토한다.
- 목표를 자동 하향하지 않는다. 유지, 강도 증가, 내용 조정, 다른 검증 개입 검토를 학교 팀에 제안한다.

## 7. 승급·배치 결정

모든 점수와 모든 경로에서 다음 계약을 유지한다.

```text
automaticPromotion = false
placementDecision = "school-review-required"
promotionDecision = "school-review-required"
```

시스템은 `stay`, `advance`, `accelerate`, `intensify` 후보와 근거를 제시할 수 있다. 그러나 공식 승급·반 편성·과정 배치는 학교가 다음을 함께 검토한 뒤 승인한다.

- 진단 영역·클러스터 근거와 근거 범위
- 수업 수행, 기존 학교 평가, 교사 관찰
- 언어 접근과 조정 적합성
- 개입 반응과 유지 확인
- 학생에게 제공된 학습 기회
- 지역·학교 정책

승인에는 `reviewerId`, `reviewedAt`, `evidenceSnapshotIds`, `decision`, `reason`, `policyVersion`이 필요하다. 승인 뒤 근거가 바뀌어도 과거 스냅샷을 덮어쓰지 않는다.

## 8. 다언어 학생 해석 주의

- 응시 언어, 가정·학교에서 사용하는 언어, 현재 영어 접근 수준, 수학 수업 언어를 가능한 범위에서 분리 기록한다.
- 복잡한 문장제와 간단한 수식·그림 문항의 성과 차이를 언어 접근 신호로 표시할 수 있지만, 자동으로 영어 결손이나 수학 결손으로 확정하지 않는다.
- 번역, 용어표, 읽어주기, 추가 시간 등 조정은 실제 제공 여부와 목적 적합성을 기록한다. 처음 시험 당일에만 제공한 조정은 별도 경고한다.
- 번역본은 수학적 의미, 단위, 비교 관계, 부정 표현이 원문과 같은지 독립 검수한다.
- 조정이 목표 구성개념을 바꾸거나 해당 언어판의 타당도 근거가 없으면 결과에 `interpretation-limited`를 표시한다.
- 영어학습자 또는 다언어 학생의 낮은 점수만으로 장애 평가나 특수교육 의뢰를 자동화하지 않는다.
- 학생·보호자에게 전달하는 핵심 결과와 학교 검토 절차는 이해 가능한 언어로 제공할 수 있어야 한다.

## 9. 공식 근거와 제품 적용

아래 자료는 제품 규칙의 근거다. 법령이 아닌 기술지원·practice guide는 해당 범위와 한계를 함께 적용한다.

| 제품 결정 | 근거 요약 | 공식 출처 | 범위·한계 |
| --- | --- | --- | --- |
| 세 평가 목적 분리 | NCII는 screening을 위험 식별, progress monitoring을 이미 위험한 학생의 성장 측정, diagnostic을 구체 결손 식별로 구분한다. | [Identifying Assessments — NCII](https://intensiveintervention.org/tools-charts/identifying-assessments) | OSEP 지원 기술지원 자료이며 전국 법정 정의는 아니다. |
| Grade 6 5영역과 선수 진행 | CCSS는 Grade 6의 5개 영역, 4개 핵심 축, 내용과 수학적 실천의 연결을 제시하고 각 표준을 이전 이해의 확장으로 기술한다. | [Common Core State Standards for Mathematics — CCSS Initiative, 2010](https://corestandards.org/wp-content/uploads/2023/09/Math_Standards1.pdf) | 주별 채택·수정이 다르므로 관할 매핑이 필요하다. CCSS는 수업 순서를 강제하지 않는다. |
| 컷 점수 단독 결정 금지 | IES는 모든 스크리너가 일부 학생을 오분류하며 컷에 따라 민감도·특이도가 교환된다고 설명한다. 컷 근처 학생은 반복 확인하도록 권고한다. | [Assisting Students Struggling with Mathematics: RtI — IES/WWC, 2009](https://ies.ed.gov/ncee/wwc/docs/practiceguide/rti_math_pg_042109.pdf) | 오래된 가이드이며 자체적으로 cookbook이 아니라고 밝힌다. cadence는 지역·도구 정책으로 구성한다. |
| 처방은 교수법까지 지정 | 2021 WWC 가이드는 체계적 지도, 수학 언어, 표현, 수직선, 문장제, fluency 활동을 K–6 개입 실천으로 제시한다. | [Assisting Students Struggling with Mathematics: Intervention in the Elementary Grades — IES/WWC, 2021](https://ies.ed.gov/ncee/WWC/PracticeGuide/26/Published) | 주로 소집단·일대일 개입 근거다. timed activity는 fluency 방법 중 하나다. |
| 충분한 시계열 뒤 조정 | NCII는 개입 전 도구·목표·수집/검토 빈도를 정하고, 빈번한 자료를 그래프로 본 뒤 충분한 근거가 있을 때 팀이 강도를 조정하도록 한다. | [Progress Monitoring — NCII](https://intensiveintervention.org/data-based-individualization/progress-monitoring) | 구체 최소 관찰 수는 도구의 검증 규칙을 우선한다. |
| DBI 반복 사이클 | DBI는 평가 자료, 검증 개입, 연구 기반 적응을 체계적으로 반복한다. 개입은 근거, dosage, alignment, transfer, comprehensiveness, 지원, individualization을 검토한다. | [Data-Based Individualization Framework — NCII, 2013](https://intensiveintervention.org/resource/data-based-individualization-framework-intensive-intervention), [Validated Intervention Program — NCII](https://intensiveintervention.org/data-based-individualization/validated-intervention-program) | 주 대상은 심각하고 지속적인 필요를 가진 학생이다. 모든 낮은 점수에 Tier 3를 적용하지 않는다. |
| NAEP 개인 점수·학년등가 금지 | NCES는 NAEP Proficient가 다른 평가의 학년 수준 proficiency가 아니며, 과목·학년 척도가 서로 독립적이고 개인·학교 점수를 제공하지 않는다고 밝힌다. | [Understanding Results — NCES/NAEP](https://nces.ed.gov/nationsreportcard/guides/), [About the NAEP Mathematics Assessment — NCES](https://www.nationsreportcard.gov/reports/mathematics/2024/g4_8/about/reporting/?grade=4), [NAEP FAQs — NCES](https://www.nationsreportcard.gov/faq.asp) | NAEP는 집단 수준 외부 맥락과 프레임워크 참고에는 사용할 수 있다. |
| 다언어 해석 제한 | U.S. ED는 영어학습자의 핵심 교과 지식을 적절하고 신뢰할 수 있는 방법으로 평가하고, 장애 평가에서는 영어 능력이 아니라 학생이 아는 것을 가장 정확히 드러내는 언어·형식을 사용하도록 안내한다. | [English Learner Tool Kit — U.S. Department of Education, 2016](https://www.ed.gov/sites/ed/files/2020/10/eltoolkit.pdf) | 원어 평가 의무의 가장 직접적인 문맥은 특수교육 평가다. 일반 진단의 조정은 주·학교 정책과 타당도 검토가 필요하다. |

## 10. 구현 수용 기준

### 데이터·서버

- [ ] 모든 평가 폼에 정확히 하나의 `assessmentPurpose`가 있으며 목적별 허용 출력 검사가 있다.
- [ ] Grade 6 폼은 42개 고유 슬롯과 5개 영역을 모두 포함하고 설계표 hash가 서버에서 검증된다.
- [ ] 모든 문항은 `domain`, `cluster`, `standardRef`, `skillNode`, `practiceTag`, 난이도, 응답형식, 채점방식을 가진다.
- [ ] 선수학습 노드와 간선은 출처 버전과 `evidenceStatus`를 가지며 제품 가설을 공식 진행으로 가장하지 않는다.
- [ ] 컷 정책은 버전·대상·도구를 저장하고 `distanceFromCut`과 `borderline-review`를 계산한다.
- [ ] 목적에 맞는 타당도 표시가 없는 도구는 다른 평가 목적의 결정 자료로 재사용되지 않는다.
- [ ] 진도 모니터링은 기준선, 목표선, 수집/검토 빈도, 결정 규칙이 없으면 시작할 수 없다.
- [ ] 관찰과 개입 변경은 append-only이며 phase-change와 충실도 기록을 보존한다.
- [ ] 모든 점수 조합에 대한 테스트에서 `automaticPromotion === false`와 `school-review-required`가 유지된다.

### 분석·리포트

- [ ] 한 문항 근거만 있는 스킬은 숙달·결손 확정 대신 `needs-confirmation` 또는 `insufficient-evidence`가 된다.
- [ ] 총점만으로 학년 등가, Tier, 승급, 장애, 반 편성을 생성하는 코드 경로가 없다.
- [ ] 영역 리포트는 근거 수, 범위, 자동/교사 채점, 오류 가설, 선수노드, 상충 근거를 포함한다.
- [ ] 학생 리포트와 교사 리포트의 권한·필드가 분리되고 학생 payload에 정답·루브릭·내부 ID가 0건이다.
- [ ] NAEP 명칭·컷·척도를 개인 학생 수준 레이블이나 환산 점수로 출력하지 않는다.
- [ ] 보고서 스냅샷은 폼, 정책, 기준, 채점, 승인 버전을 재현할 수 있다.

### 처방·검토

- [ ] 처방 후보는 목표 노드, 근거, 선수노드, 목표, 검증 실천, 강도 7차원, 기간, 충실도, 모니터링 규칙을 모두 가진다.
- [ ] 채점 미완료, 근거 부족, 언어 해석 제한, 학교 자료 충돌 중 하나라도 있으면 자동 배정이 잠긴다.
- [ ] 교사는 처방 후보를 승인·수정·거절할 수 있고 변경 사유가 감사 기록에 남는다.
- [ ] 단일 진도 모니터링 관찰값은 개입 변경을 일으키지 않는다.
- [ ] 학교 승인 없이는 승급·배치 상태가 확정되거나 학생에게 게시되지 않는다.

### 다언어·접근성

- [ ] 응시 언어와 실제 조정이 리포트에 저장되며 조정 미제공 또는 타당도 불명은 `interpretation-limited`를 만든다.
- [ ] 번역 문항은 원문과 수학적 의미가 같다는 독립 검수·서명 없이는 운영 폼에 들어가지 않는다.
- [ ] 언어 접근 신호가 수학 결손 또는 장애 추정으로 자동 변환되지 않는다.
- [ ] 학생용 핵심 결과는 이해 가능한 언어로 제공할 수 있고, 색만으로 수준을 구분하지 않는다.

## 11. 출시 판단

이 문서가 정의한 스키마와 테스트가 구현되어도 실제 학생 운영이 자동으로 허용되지는 않는다. 기존 Grade 6 운영 문서의 42개 서명 문항, 서버 권위 저장소, 인증, 채점, 리포트 재계산, 권한, 누출 방지 게이트를 모두 통과해야 한다. 일부 영역만 준비된 평가는 `Grade 6 단원 스크리너`로만 공개하며, 전체 진단·배치·승급 근거로 사용하지 않는다.
