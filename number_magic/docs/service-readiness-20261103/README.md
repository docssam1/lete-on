# 수의 마법 정식 서비스 준비 점검 — 진도·난이도·배차 (2026-11-03)

원장 지시: 「정식 서비스 가능할 만큼 모든 구조가 맞는지 확인, 진도·난이도·배차까지」.
방법: `number_magic/scripts/check-*.js` **187개 전부** 실행(결과 `check-results.txt`), 실패한 것은 2026-10-31 기준 커밋(`3bcbe3581`)에서 다시 돌려 「원래 있던 것」과 「이번에 생긴 것」을 나눔. 서버 쪽은 Supabase(pg_cron·발송 이력·연락처·프로필)와 GitHub Actions를 직접 조회. 운영 사이트 화면은 이 환경에서 열 수 없어 보지 못함.

## 한눈에
- 통과 129 / 실패 58. **실패 58개는 전부 10-31 기준에서도 실패**(이번 작업으로 생긴 실패 1건 `check-progress-speed-browser`은 고쳐서 통과).
- **학습 핵심 계산은 통과**: 진도(`learning-plan`·`plan-control`·`roadmap-sync`+self-test·`study-projection`·`high/middle-calendar`·`middle-pacing`·`stages`), 난이도 순서(`cognitive-road`·`curriculum-sequence`·`ladder`·`level-coverage`·`level-concept`), 배차(`delivery-versions`·`planned-envelope`·`notify-delivery`·`membership-client`·`build-nm-delivery-runtime --check`), 진단(`placement-*`·`diagnostic-roadmap`·`ladder-placement`).
- **정식 서비스 전에 꼭 할 것 5가지**(아래 ★).

## 진도
- 과정 74개(C0~C73) · 회차 551 · 시험 회차 73(C0만 없음, 설계) · 빈 회차 0.
- 앱 진도 = 저장된 학습 계획이 있으면 달력 위치(`NM_PLAN_CONTROL.position`), 없으면 마지막으로 푼 단원. 학원 지정 계획(`adminPlan`)이 우선.
- ★**과정 끝에서 문자 회차가 멈춤**: 비회원(앱 자율) 학생의 표준 문자 링크 회차는 서버(`weekly-notify standardPart`)가 매주 +1(주 2회 +2)하지만 `min(rounds, …)`로 **그 과정 마지막 회차에서 멈추고 다음 과정으로 넘어가지 않는다**. 앱을 열어야(`updateWeeklyDigest`) 다음 과정 1회차가 된다. 학원 관리 회원(개인 계획)은 서버 `delivery-runtime`이 과정 경계를 넘어 계산하므로 해당 없음. 정책 결정 필요(자동으로 다음 과정 1회차 / 지금처럼 멈춤 + 안내 문자).
- `check-pace-compare`가 「C71 평가 핀 MD44@4 미학습」으로 멈추지만 실제 `courses.js`는 정상 로드되고 C71 시험 풀(MD44 3·4·5, MD154 2)도 있다 — 검사 쪽 옛 빌더 경로 문제로 보임(미확인).

## 난이도
- 회차마다 쉬움·핵심·복습 3단(easy/core/review) + 창의·문장제 구성, 과정 간 선수 순서·레벨 빠짐 검사 통과.
- ★**MD87 L1(산점도에 순서쌍 직접 찍기)**: 정답을 넣어도 화면 저장값이 null → 중3 「이차함수와 자료 분석」(C37) 문항 한 유형이 화면에서 채점 불가(`check-answerable`). 인쇄는 무관.
- 내용 품질(원래 있던 것): 중·고 개념글 해요체 10건(MD38 로그 등, `check-tone`), 교육과정 밖 기호 18건(WP11 `\operatorname{lcm}`, `check-curriculum-notation`), 창의 문항 C20·C29 「과정 빈칸」 1건(`check-creative-process`).

## 배차(발송)
- 서버: pg_cron `nm-weekly-notify` 매시 정각 실행 중(11-03 매시 succeeded) · `nm-notify-reconcile` 2분 · 전역 발송 요일 월(send_dow=1). 주간 PDF GitHub Actions는 10-28 결정(표준 링크)으로 수동 전용 — 정상.
- **실제 학부모 배차는 아직 0건**: `nm_contacts` 0명, 발송 이력은 W42 시험 발송이 마지막, 프로필 25개 중 최근 14일 활동 0, 저장된 학습 계획 0.
- ★**개인 링크 고정 회차 한도 어긋남**: `app/delivery-plan.js SOURCE_LIMITS`(10-26 고정, `CURRICULUM_REVISION 20261026-curriculum2`)와 실제 과정 회차 수가 **C29 11↔10 · C30 9↔7 · C31 11↔12 · C32 8↔10**. 같은 날 중등 재편(`21945369b`) 뒤 고정값을 안 올렸다. 없는 회차(C29 11)를 통과시키고 있는 회차(C31 12, C32 9·10)를 막는다(`check-personal-worksheet`가 잡고 있었음). 고치려면 SOURCE_LIMITS 재생성 + 리비전 올림 → 기존 링크 무효화 여부 결정 필요.
- ★**실제 번호 시험 발송을 한 번도 안 했다**(최근): 서비스 전 `weekly-notify`에 `test_phone`으로 dry → 실제 1건.

## 인쇄·화면(원래 있던 것, 학생 영향 가능)
- ★C33-B06 묶음 학습지 A4 넘침(`check-middle-bundles-browser`), C0 7주차 20쪽 넘침(`check-c0-cognitive`).
- 유아 분할 화면 390×667에서 답 단추 가려짐(`check-young-split-browser`), N-01 활동이 스크롤 필요(`check-audio-entry-layout-browser`).
- NL28 lv3·4 인쇄 생성 오류 — 과정에 배정된 레벨이 아니라 학생 영향 없음. `check-print-lang` 6,635건은 「문장제 물음이 빔」이 대부분(NS1 자릿값 등 문장제가 없는 유형까지 전부 세는 듯) — 검사 범위 확인 필요.
- 중등 통계 런타임 중복 로드(`md84`), `drill.html`에서 `NM_EXAM`/`NM_UNITS` 미정의로 md11·13·15·82·88·editorial-print 검사가 멈춤 — 검사용 페이지 적재 순서 문제인지 실제 화면 문제인지 미확인.

## 핵심 아님·환경·낡은 검사
- 마을·옷장·홍보·음성·3D(town-navigation·visual-map·character/closet·promo-*·voice·magic-book·manipulative·lesson-lettering·g1315·journey·no-legacy-3d-flash·road-timing·amount-sheets 600초 초과): 헤드리스 WebGL 시간 초과나 단정 실패, 원인 미확인.
- 낡은 검사: level-test·wp-word-problems·wp4-unique(없는 모듈 `g1/1-3-threads.js`), c0-concrete·astra-concept-gaps(없는 커밋 `037f5086`, 얕은 클론), flow-review-regression(없는 함수), dot-handoff-gates·journey-viewport(윈도우 E: 드라이브 전용), worksheet-series(옛 커밋 기준 문항 비교), weekly-sheets(외부 글꼴 차단).

## 2026-11-04 반영 (원장 「네 추천으로 진행 · 전화번호 넣도록」)
| ★ | 한 것 | 확인 |
|---|---|---|
| ① 회차 한도 | `app/delivery-plan.js SOURCE_LIMITS`·`CURRICULUM_REVISION 20261104-curriculum3`, `supabase/functions/nm-membership/course-limits.json`·`handler.mjs DELIVERY_SOURCE_COUNTS`·`schema.sql limits` 모두 실제 과정 회차 수로 재생성(C29 10·C30 7·C31 12·C32 10). 서버 번들 `delivery-runtime.mjs` 재생성 | `check-personal-worksheet`·`check-delivery-versions`·`check-planned-envelope`·`check-plan-control`·`delivery.test.mjs` 통과, `handler.test.mjs` 43·44 통과(나머지 7건 실패는 전부터) |
| ② 과정 끝 | `weekly-notify` v19: 표준 링크 회차가 과정 마지막을 지나면 **다음 과정 1회차부터** 이어 간다(C73은 마지막 회차에서 멈춤). 번들이 과정 회차표 `courseTable()`를 내보낸다 | `check-notify-delivery` 넘김 7건 추가 통과. **서버 배포는 `deploy-edge-function.yml`(weekly-notify·nm-membership)로 — 저장소 코드만 바꾼 상태면 아직 옛 동작** |
| ③ 전화번호 | 로그인한 보호자가 휴대폰 미등록·문자 미동의면 맨 위 띠 「휴대폰 등록 / 문자 동의」 → 옷장 보호자 패널(#nmGuardPhone, 회원 연락처 → 서버가 nm_contacts에 같이 적음). 「나중에」 7일. 동의 갱신 띠가 있으면 그것이 먼저 | 브라우저 모의 로그인에서 띠 표시 → 누르면 전화 칸으로 이동 확인 |
| ④ MD87 | 산점도 직접 찍기는 그림을 눌러 답하는 유형(채점 `NM_SCATTER_ANSWER.matches`)이라 글자 입력 검사 대상이 아니었다 → `check-answerable`가 이 유형을 건너뛰도록 | `check-answerable` 1,327유형 통과 |
| ⑤ 인쇄 | C33-B06(평균·중앙값·최빈값)·C37-B05(이차함수 세 점)는 식을 두 줄로(`mid13.js`·`mid10.js`), C0는 가르기 그림 11개 이상 금지(`nl.js`)·예시 칸 10.5mm·가르기/이야기 문항 여백·「예시를 포함해…」 문장 마침표(쪽 안내로 끌어올림) | `check-middle-bundles-browser` 60묶음 통과, `check-c0-cognitive` 19주 통과 |
- **아직**: DB 함수 `nm_private.canonical_delivery_plan`의 회차 한도 상수는 저장소 `schema.sql`만 고쳤고 DB에는 적용 못 함(함수 정의 읽기가 거부됨) — 원장 승인 뒤 `schema.sql` 266~ 절을 DB에 적용해야 서버 쪽 한도가 같아진다. 실제 번호 시험 발송은 원장 번호로 해야 한다.
