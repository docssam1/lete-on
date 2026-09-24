# 수의 마법 (Numbers of Magic) 🪄

유아 5세부터 미적분Ⅰ까지, **48과정 396회차**의 연산 학습 시스템.
문항은 시드 생성기가 만들며, 한 학습지에서 학생에게 보이는 변형을 다시 쓰지 않는다.
유한한 유형의 후보를 모두 썼다면 중복으로 채우지 않고 부족을 알리며 출력을 막는다.

**배포** https://lete-on.gfieldacademy.net/number_magic/ (`main` 푸시 시 GitHub Actions 자동 배포)
**빌드 도구 없음** — 순수 HTML·JS·CSS. `index.html`이 스크립트를 순서대로 읽는다.

---

## 먼저 읽을 것

| 문서 | 무엇 |
|---|---|
| **`인수인계서.md`** | 프로젝트 전체 지도 · 새 유형 추가 절차 여덟 걸음 · 절대 규칙 · 데인 곳 |
| **`앞으로-진행할-것.md`** | 우선순위 붙인 할 일 |
| `MASTER-ROADMAP.md` | 설계 원칙 · W1~W14 월드 대응 · 답 환원 원칙 |
| `HANDOFF.md` | 작업 이력 전문 (최신이 맨 뒤) |

---

## 구조

| 경로 | 무엇 |
|---|---|
| `index.html` | 앱 본체 (유닛 파일마다 `<script>` 태그가 나열돼 있다) |
| `landing.html` · `about.html` | 광고 페이지 · 철학·통계 |
| `app/main.js` | 앱 렌더링·상태·라우팅 |
| `app/exam.js` | 학습지 인쇄 |
| `engine/threads/*.js` | 유형별 문제 생성기 (`NM_TGEN`) |
| `engine/rng.js` | 시드 난수 — **`Math.random()` 금지** |
| `data/threads.js` | 216유형 694레벨 |
| `data/middle-concepts.js` | 중등 MD 51유형·202레벨의 원리·절차·주의점 (한국어) |
| `data/drill-topics.js` | 문제은행 탐색 분류, 등록 레벨 자동 연결 |
| `data/units/*.js` | 유닛 카드 226개 |
| `data/courses.js` | 48과정 편성 (학습지) |
| `data/roadmap.js` | 71챕터 (앱 「마법 학습 여행」) |
| `data/stages.js` | 7단계 (광고 로드맵) |
| `scripts/check-*.js` | 동기화·수학·무중복·A4·모바일 검사기 |

---

## 일하는 법

```bash
cd number_magic

# 데이터를 고쳤으면 매번 (각 수 초)
node scripts/check-roadmap-sync.js --self-test
node scripts/check-ladder.js
node scripts/check-stages.js
node scripts/check-answerable.js
node scripts/check-step-equations.js
node scripts/check-tone.js

# 커밋 전 (수 분)
node scripts/check-print.js
node scripts/check-print-page.js
node scripts/check-middle-concepts.js
node scripts/check-worksheet-uniqueness.js --browser
node scripts/check-middle-pacing-print.js
node scripts/check-solution-steps.js
node scripts/check-new-levels-math.js
```

**새 유형·유닛을 추가할 때는 `인수인계서.md` §4의 여덟 걸음을 그대로 따를 것.**
네 번째(`index.html` 태그)와 여섯 번째(`data/roadmap.js` 챕터) 누락 사고를
`check-roadmap-sync`가 잡는다. 새 생성기 파일은 `index.html`·`drill.html`·`ws.html`
태그를 함께 확인하고, 새 스레드는 `data/drill-topics.js` 분류에 넣는다.
설계·검증·남은 항목은 `docs/sync-ux-20260922.md` 참고.
중등 개념 원본 대조와 학습지 설계는 `docs/middle-concepts-source-audit.md` 참고.
