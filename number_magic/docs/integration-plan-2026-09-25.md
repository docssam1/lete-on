# 중등 진도 통합 · 세 층 회차 계약 — 착수 보고 (2026-09-25)

GPT(Codex) 인수인계서 「수의 마법 · Claude Opus 실행 인수인계서」의 §9 첫 보고다.
대량 수정 전에 확인한 사실과 계약 초안, 첫 구현 묶음을 적는다.

## 1. 작업 브랜치와 기준

- 브랜치 `claude/patch-number-magic-map-4ow1mr`, 기준 `origin/main` = `78268895`.
- 같은 이름의 원격 브랜치에 2026-08-23자 커밋 4개가 남아 있었다(중급 재설계 1/2·2/2 등).
  내용은 이미 `main`에 들어가 있다(C-26~C-31 유닛 존재 확인). 그 위에 쌓지 않고 `origin/main`에서 다시 시작했다.

## 2. 두 중등 편성 대조

| | 정규 과정 `NM_COURSES` C29~C37 | 권장 편성 `NM_MIDDLE_PACING` |
|---|---|---|
| 회차 | 중1 38 · 중2 34 · 중3 41 = **113회** | 학년별 14 = **42회** |
| 회당 문항 | 약 20 (드릴 3×6 + 창의 4) | 36~60 (블록 12·24·36) |
| 기간 표기 | 주 2회 79주 / 주 1회 113주 (`stages.js` 계산) | "주 2회 · 7주" (화면 문구에 직접 적음) |
| 그래프 직접 그리기 | 없음 | 24문항 (정비례·반비례·일차·이차) |
| 학생 기록 | `S.progress`·세션 통과·인쇄 횟수 | **없음** — 저장하지 않는다 |
| URL | `ws.html?c=C34…`, 주간 PDF | **없음** — 버튼 하나(`data-middle-session`) → `NM_EXAM.openMiddlePacing(grade,id)` |
| 식별자 | `C29`·세션 index | `M1-S01`~`M3-S14` (코드 밖에서 참조 없음) |

권장 편성에만 있는 유형·레벨: 중1 `DV8@1~3 · DV7@2~3`(초등 과정 19·24·27에는 있음), 중2 `MD64@4`,
중3 `MD15@4~6`, 보충 목록의 `MD11@4~5`. 나머지는 전부 정규 과정에 이미 있다.

**호환 위험은 작다.** 옛 식별자는 저장·URL 어디에도 없어서, 버튼과 `openMiddlePacing` API만 살리면 된다.

**남은 결정 1건 (원장님):** 회당 문항 수. 권장 편성의 12·24·36을 정규 과정에 그대로 옮기면
학습지 한 회가 약 20문항에서 40~60문항이 된다. 회차 수를 줄이고 회당 양을 늘릴지, 회차를 유지하고
어려운 유형에만 늘릴지는 원장님이 정한다. 초안은 **회차를 유지하고, 역할별 기본량을 12 · 어려운 유형 18~24**로 둔다.

## 3. 회차 데이터 계약 초안 — 세 층

현재 세션은 `{magic, drills, creative}`다. 주간 학습지(`exam.js` 주간 봉투)는 이미
`drills → 마법 노트(magic) → creative 4문항 → 문장제 6문항(초등만, 첫 드릴에서 자동 생성)` 순으로 싣는다.
문제는 **`creative`라는 이름이 뜻을 셋이나 가진다는 것**이다.

| 구간 | `creative`에 실제로 든 것 | 화면 표시 |
|---|---|---|
| 초등 | WP(문장제)·CH(경시)·ML(곱셈 전략)이 섞임 | "창의 연산 ·" |
| 중등·고등 | 같은 단원의 더 어려운 MD 드릴 | "적용 ·" — 실제로는 적용이 아니다 |

**초안**

```js
session = {
  school:      [{t,lv,n}],     // 교과 연산 — 지금의 drills. 필드명 drills 는 호환용으로 계속 읽는다
  creative:    { unit:'A-02', practice:[{t,lv,n}] },  // 창의 연산 전략 — 마법 유닛 + 그 전략 드릴(ML·CH 등)
  application: [{t,lv,n, kind:'word'|'model'|'table'|'graph'|'drawing'}],  // 연결 문장제·적용
  stretch:     [{t,lv,n}]      // 선택 — 지금 중등 creative 에 든 심화 드릴
}
```

- 유아·초등의 `application`은 지금 자동으로 붙는 문장제 회차를 **데이터로 명시**한다(같은 드릴의 WP 변환).
- 중등의 `application`은 이미 있는 활용 스레드부터 쓴다: `MD70`(일차방정식 활용: 거리·속력·시간·가격),
  `MD71`·`MD72`(부등식·연립 활용), `MD76`(일차함수 활용), `MD77`(이차방정식 활용), `MD84~87`(자료),
  그리고 권장 편성의 **그래프 직접 그리기**. 지금은 이것들이 `drills`에 섞여 있어서 "중등 적용 0개"로 보인다.
- 한 세션 안에서 같은 `t@lv`를 두 층에 넣지 않는다(검사).
- 빌드 단계(`buildCourses`)가 옛 스펙(`drills`/`creative`)을 새 계약으로 바꾼다. 기존 코드가 읽는 `session.drills`는 `school`의 별칭으로 계속 채워 학생 기록·인쇄를 깨지 않는다.

**중등 권장 편성의 처리:** `data/middle-pacing.js`를 **정규 과정에서 계산되는 보기**로 바꾼다.
- 권장 편성에만 있던 레벨(위 §2)과 그리기 블록은 정규 과정 세션으로 옮긴다.
- `NM_MIDDLE_PACING.getSession('1','M1-S01')`은 옛 id → `{course, sessionIndex}` 매핑으로 계속 동작한다.
- "7주" 같은 기간 문구는 없애고 `stages.js`와 같은 계산(회차 수 → 주 2회 올림 2/3)으로 표시한다.

## 4. 첫 구현 묶음

| # | 할 일 | 검증 |
|---|---|---|
| 1 | ✅ 회귀 3건: M-13 말투 · MD11L5 지수 1·계수 1 노출 · MD85L2 `+0+0` (이 커밋) | `check-tone` · `check-tex-hygiene` · `check-step-equations` 통과 |
| 2 | `check-solution-steps`가 `main`에서 이미 25건 실패 — 검사기가 mid11~15를 안 싣고(MD84~88 "생성기 없음"), MD78 L4 마지막 단계에 빈칸이 없다 | 0건 |
| 3 | 브라우저 검사 17개가 `require('playwright')`만 해서 다른 환경에서 안 돈다 → 공용 로더 + `number_magic/package.json`에 버전 고정. 못 찾으면 **"미실행"으로 exit 2**(통과로 안 셈) | 이 환경·CI에서 실행 |
| 4 | 세션 계약 적용: `buildCourses`에 역할 분류 + `drills` 별칭, 중등 활용 스레드를 `application`으로 | 신규 `check-session-roles.js` — 과정마다 세 층 개수·중복 보고, 중등 application 0인 과정은 실패 |
| 5 | 권장 편성 → 정규 과정에서 파생 + 옛 id 매핑 | `check-middle-pacing`을 "파생 결과 = 정규 과정" 검사로 바꿈 · 버튼 42개가 같은 문항을 여는지 브라우저 확인 |
| 6 | 창의수연 96유형 대조표(`existing/partial/missing/conflict`) — 생성기·풀이 전략까지 대조 | 대조표 문서. 구현은 `missing`·`partial`만 |

그 뒤: 유아~초등 `application` 명시, 단계 차이 32건 분류(의도/오류), 인쇄 지면(개념 쪽 빈칸·화살표 크기)은 Codex 검수로 넘긴다.

```bash
node number_magic/scripts/check-tone.js
node number_magic/scripts/check-tex-hygiene.js
node number_magic/scripts/check-step-equations.js
node number_magic/scripts/check-solution-steps.js
node number_magic/scripts/check-middle-pacing.js
node number_magic/scripts/check-roadmap-sync.js
node number_magic/scripts/check-worksheet-uniqueness.js
```
