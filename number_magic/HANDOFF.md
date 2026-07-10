# Numbers of Magic — 인수인계서

> 이 파일은 세션 간 기억 대체용입니다. 작업 시작 전 반드시 읽으세요.
> Last updated: 2026-07-10

---

## 프로젝트 개요

**Numbers of Magic (수의 마법)** — 5~7세 대상 사고력 수학(창의수연 계열) 학습 웹앱.
`docssam1/lete-on` 저장소의 `/number_magic/` 경로. 같은 저장소의 `reading-world`(영어 독해 앱)와
아키텍처를 미러링해서 만듦(상태관리/저장/i18n `t()`/STEP flow 패턴 동일).

- **운영 URL**: `https://lete-on.gfieldacademy.net/number_magic/`
- **GitHub Pages 대체 경로**: `https://docssam1.github.io/lete-on/number_magic/`
- 단일 HTML 앱(SPA, no build tool, vanilla JS). localStorage만 사용, Supabase 미연동(추후 필요시 reading-world 패턴 참고).

---

## 디렉토리 구조

```
/number_magic/
  index.html            — 메인 진입점 (인트로 영상 → 마을 앱). app.html 내용을 흡수해 승격시킴(2026-07-10)
  app.html               — 구버전 진입점(레거시, index.html과 내용 중복 — 정리 필요)
  town_proto.html         — 마을 프로토타입(레거시). 실제 마을은 main.js의 screenTown()에 통합됨 — 삭제 후보
  book.html / chapter.html / concept_proto.html / print.html / proto.html
                          — 초기 프로토타입 파일들. 용도 불명확, 실제 앱과 연결 안 됨 — 정리 필요
  app/
    main.js               — 앱 전체 엔진(가장 큰 파일). 마을+등급선택+유닛 6단계 전부 여기 있음
    styles.css            — 전체 스타일(마을 애니메이션 CSS 포함)
  data/
    curriculum.js         — 등급(tier)→단계(level)→유닛(unit) 3계층 카탈로그 (window.NM_CURRICULUM)
    curriculum.json        — 레거시로 추정, curriculum.js와 별개 파일 — 용도 확인 필요
    units/A-01.js          — 실제 유닛 데이터. 현재 A-01 딱 하나만 존재
    chapters/A-01.json     — 레거시로 추정 — 용도 확인 필요
  engine/
    generators.js          — 문제 생성기(pair10 등)
  assets/
    map.jpg                 — 마을 배경 지도 (1024×687 기준 좌표 설계)
    gemini_generated_video_c12e6123.mp4 — 인트로 영상
```

⚠️ **정리 필요**: `app.html`, `town_proto.html`, `book.html`, `chapter.html`, `concept_proto.html`,
`print.html`, `proto.html`, `data/curriculum.json`, `data/chapters/A-01.json`은 실제 서비스 흐름과
무관하거나 중복된 레거시 파일일 가능성이 높음. 다음 세션에서 실제 사용 여부 확인 후 정리 권장.

---

## 확정된 결정사항

### 등급명 (curriculum.js에 반영됨)

| 등급 | 한글 부제 | 급수 |
|------|-----------|------|
| BASIC | 수의 나라 (9까지의 수) | 0급 |
| PRIME | 초급 (창의수연 A~I) | 1급 |
| ADVANCE | 중급 | 2급 |
| CHALLENGE | 고급 | 3급 |

### 마을 건물 ↔ 등급 매핑 (여러 차례 수정 끝에 확정)

| 건물 | 등급 | 상태 |
|------|------|------|
| 📖 왼쪽 위 책 건물 (Numbers Library) | BASIC | 🔒 잠김 |
| 🏛️ 빨간 TOWN HALL (중앙) | PRIME | ✅ 열림 — 클릭 시 유닛 목록 → app.html(학습) 이동 |
| ⛰️ 오른쪽 정자 | CHALLENGE | 🔒 잠김 |
| 🏠 CHALLENGE 오른쪽 아래 집 | ADVANCE | 🔒 잠김 (처음엔 가운데 시계탑이었으나 "다른 건물로" 요청 받아 이동함) |
| 🎬 Magic Theater (주황 극장) | 별도 영상관(등급 아님) | 준비중 — 유튜브 영상 예정 |

건물 좌표는 `main.js`의 `TOWN_SPOTS` 배열(% 기준)에 있음. 데스크탑 스크린샷으로 확인하며
눈대중 조정한 값이라 정밀하지 않을 수 있음 — 폰/PC로 직접 보고 필요시 미세조정.

### 구조 흐름

```
인트로 영상(index.html) → 마을(screenTown, 건물 클릭)
  → 등급 유닛목록(screenTier)
  → 유닛 6단계: practice → discover → check → lab → arena → stamp
```

- 진단 스킵(B안): practice 진입 시 "바로 넘어갈래? / 한번 볼래?" 질문으로 스킵 허용
- 완료 시 코인(누미 코인) 지급, localStorage(`nm_state_v1`)에 저장

---

## 마을(Living Town) 구현 세부사항

- **드래그/핀치줌/휠줌** 가능한 1024×687 캔버스 위에 `map.jpg` 배경
- **카메라 피팅 로직** (2026-07-10, 모바일 대응 수정):
  화면을 꽉 채우는 배율(cover)과 "건물 5곳이 항상 화면 안에 들어오는" 배율(bbox-contain) 중
  **더 작은(더 안전한) 값**을 사용. 데스크탑처럼 화면비가 지도와 비슷하면 cover와 같아 화면이 꽉 차고,
  세로로 매우 긴 모바일에서는 bbox 쪽이 이겨서 건물이 화면 밖으로 밀리지 않음.
  (`main.js`의 `computeContentBBox()` / `initTownWorld()`의 `fit()`/`center()` 참고)
- **장식 애니메이션**: 하늘에 떠다니는 숫자 구름(7·10·5), 분수에서 솟는 0, 반짝임 파티클,
  마을을 걸어다니는 숫자 캐릭터 3개(3·5·2, 탭하면 말풍선+TTS)
- **배경음(2026-07-10 추가)**: 실제 음원 파일 없이 **Web Audio API로 직접 합성**.
  브라운노이즈+대역통과 필터로 만든 물소리 + 오음계(C D E G A) 벨 아르페지오(딜레이 잔향)로
  "신비한 느낌" 연출. 우측 하단 스피커 버튼(🔇/🔈)으로 토글, 브라우저 정책상 사용자가 버튼을
  한 번 눌러야 재생됨. 마을 화면을 나가면 자동 정지. **사용자 피드백 대기 중**(톤/볼륨 적절한지).
- **건물 클릭 시**: 팝업 모달로 이름/설명 표시. 열린 건물은 "유닛 보러가기 →" 버튼으로 `app.html` 이동,
  잠긴 건물은 잠김 안내만.

---

## 미완료 / TODO

| 항목 | 상태 |
|------|------|
| 포인트 시스템(적립→상점 교환, 리딩타운 방식) | ❌ 미구현. reading-world의 코인/장식 패턴(`game-store.js`) 참고 예정이었으나 진행 안 됨 |
| A~I 단계 중 실제 콘텐츠 | A단계만 A-01 유닛 하나 존재. B~I는 `curriculum.js`에 `available:false` placeholder만 있음 |
| BASIC/ADVANCE/CHALLENGE 실제 학습 콘텐츠 | 전부 없음(레벨 자체가 `available:false`) — 건물은 계속 잠긴 상태로 보임 |
| Magic Theater 영상 콘텐츠 | 없음, 준비중 안내만 |
| A~I 단계 주제가 창의수연 PDF 목차 기준인지 확인 | 사용자에게 물어봤으나 답변 못 받음 — 다음 세션에서 확인 필요 |
| 레거시 프로토타입 파일 정리 | `app.html`/`town_proto.html`/`book.html`/`chapter.html`/`concept_proto.html`/`print.html`/`proto.html` 등 실사용 여부 확인 후 삭제 검토 |
| 배경음 피드백 반영 | 볼륨/톤 사용자 확인 대기 중 |
| 건물 좌표 미세조정 | 폰 실기기로 확인 후 필요시 조정 |

---

## 세션 작업 이력 (요약)

- **2026-07-10**: `town_proto.html` 작성 → GitHub MCP 연결 문제로 실패 반복 → 재연결 후 업로드.
  이후 이전 세션 버전(더 정확한 좌표)으로 교체. → `main.js`/`styles.css`에 마을 로직 통합,
  `index.html`을 `app.html` 내용으로 승격. → PRIME 금빛 표시 순화, 화면 꽉 채우기(cover)↔전체
  지도 보이기(contain) 사이 왔다갔다 하다가 **bbox 기반 하이브리드**로 최종 해결. → ADVANCE 건물을
  시계탑에서 우하단 집으로 이동. → Web Audio 배경음(물소리+마법벨) 추가.

---

## 알려진 이슈

- GitHub API가 간헐적으로 502 에러 발생 — 재시도하면 해결됨.
- 이 세션은 Claude Code(데스크탑 앱)에서 진행되어 모바일 Claude.ai 앱 채팅 목록에는 뜨지 않음(별개 제품).
