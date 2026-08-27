# Numbers of Magic — 인수인계서 (통합본)

> 이 파일은 세션 간 기억 대체용입니다. 작업 시작 전 반드시 읽으세요.
> Last updated: 2026-07-28 — **원래 작업자(마을·커리큘럼 설계) 인수인계 + 수의 나라(유아) 세션 작업을 결합한 통합본**
> 함께 읽을 문서: `CURRICULUM_DESIGN.md`(전면 재설계, §9 결정 확정됨) · `DESIGN-LEARNING-MODE.md`(유아 구현 체크리스트) · `data/domain-map-reference.md`(국가교육과정 4영역 매핑)

> 🧭 **모델 역할 분담 (원장 지시, 2026-07-28)**: **설계·검토 = Opus/Fable**,
> **구현(코딩·반복 작업) = Sonnet**. 설계 문서 확정 후 Sonnet 세션/Workflow에 넘겨 구현하고,
> 결과 검증·다음 설계는 다시 Opus/Fable이 맡는다.

---

## 프로젝트 개요

**Numbers of Magic (수의 마법)** — 5세~초등 대상 사고력 수학(창의수연 계열) 학습 웹앱.
`docssam1/lete-on` 저장소의 `/number_magic/` 경로. 같은 저장소의 `reading-world`(영어 독해 앱)와
아키텍처를 미러링(상태관리/저장/i18n `t()`/STEP flow 패턴 동일).

- **운영 URL**: `https://lete-on.gfieldacademy.net/number_magic/`
- **GitHub Pages 대체 경로**: `https://docssam1.github.io/lete-on/number_magic/`
- 단일 HTML 앱(SPA, no build tool, vanilla JS). localStorage(`nm_state_v1`) + nm_profiles 클라우드 동기화.

### 브랜치 상태 (2026-07-28 병합 완료)
- 유아(수의 나라) 작업은 `claude/patch-number-magic-map-4ow1mr` 브랜치에서 진행됨.
- 2026-07-28 `origin/main`(설계 확정·화면폭 수정·domain-map)을 이 브랜치로 **merge 완료** — 양쪽 작업 모두 보존.
- **main 반영(배포)은 아직 안 됨** — 이 브랜치를 main에 병합해야 유아 콘텐츠가 라이브에 나감.

---

## 등급 구조와 구현 현황 (2026-07-28 기준)

| 등급 | 부제 | 콘텐츠 현황 |
|------|------|------------|
| **BASIC** | 수의 나라 (유아 5~7세) | ✅ **N-01~N-15 전체 15유닛 구현·검증 완료** (NL-1~NL-5 다섯 레벨, 로드맵 N0~N4 챕터) |
| **PRIME** | 초급 (창의수연 A~I) | ✅ A-01~A-38 38유닛 존재 |
| **ADVANCE** | 중급 (구구 기초 B-01~B-23 + 창의수연 C-01~C-25) | ✅ 유닛 파일 존재. ⚠️ 구구 파트가 실제 창의수연 중급 목차인지 원장 확인 필요 |
| **CHALLENGE** | 고급 | ❌ 미구현 (중1 연산까지 상한 — 정수·유리수·지수법칙 스레드 추가 필요, 원장 지시 있음) |

---

## ⭐ 수의 나라 (BASIC · 유아) — 2026-07-16 세션에서 전체 구현

> 세부 체크리스트·설계 원칙은 `DESIGN-LEARNING-MODE.md` §9-5 참고.

### 구조
- **경량 플로우**: `tier:'basic'` 유닛은 practice → discover(1스테이지) → lab → stamp
  (check·arena 생략 — main.js `unitFlowOf()`/`afterLabKey()` 분기). 도장 시 +20코인.
- **프롬프트 TTS 자동 낭독** (`say()`) — 유아는 글을 못 읽으므로 필수. storyCard엔 🔊 다시듣기 버튼.
- **생성기**: `engine/threads/nl.js` — 시드 RNG 계약(`NM_TGEN[key]=(params,rng)=>problem`),
  Math.random 금지. 전 생성기 500~2000시드 퍼즈 테스트 통과.
- **콘텐츠는 전부 창작**(이모지 장면·오리지널 도형 좌표) — 라이선스 교재(G1 PDF)는 구조 참고만.

### 챕터·유닛 매핑 (roadmap.js N0~N4 = curriculum.js NL-1~NL-5)
| 챕터 | 유닛 | 생성기 | 위젯 |
|------|------|--------|------|
| N0 수 세기와 개수 | N-01·N-06·N-07 | nl1_count, nl4_bond, nl7_relation | tapCount, tapMake, numberBond, tenframe(재사용) |
| N1 순서와 뛰어세기 | N-02·N-09·N-11 | nl2_seq, nl9_chain, nl11_arrange | seqFill, dotToDot, pyramid, matchLine, tapCount(step:10) |
| N2 몇째와 크기 비교 | N-03·N-05·N-12 | nl3_ordinal, nl5_story, nl4_ladybug+nl12_scale | gridPaint, storyCard, numberBond(재사용), balanceScale |
| N3 수 퍼즐과 논리 | N-08·N-13·N-15 | nl8_machine, nl13_puzzle, nl15_logic | numberMachine, crossSum, dotToDot(재사용), sortBasket |
| N4 수의 여러 표현 | N-04·N-10·N-14 | nl_tallybuild, nl10_data, nl14_pattern | tallyBuild, matchLine(tally), sortBasket(compare), seqFill(재사용) |

### 유아 위젯 12종 (widgets.js / widgets.css · styles.css)
tapCount(step 확장) · tapMake · numberBond · seqFill · dotToDot · pyramid · matchLine(dot/tally) ·
gridPaint(single/count) · storyCard(tap/numpad, 🔊) · balanceScale · numberMachine(apply/guess) ·
crossSum · sortBasket(count/compare) · tallyBuild(build/read)

### 세션 중 발견·수정한 실버그 (재발 주의)
1. **SVG `className` 대입 금지** — `svg.className='…'`는 실브라우저에서 TypeError(getter-only).
   반드시 `setAttribute('class',…)`. (matchLine에서 발견, N-04 세션에서 수정)
2. **화면 높이 초과 주의** — 유닛 화면은 스크롤 없는 고정 높이. 세로로 긴 위젯(계단)+numpad 조합이
   메모입력창에 가려 버튼 클릭이 막혔던 사례(N-05) → 가로 배치 + 위젯 전용 축소 numpad(`.nm-sc-pad` 패턴)로 해결.
3. **위젯에 목표값 항상 표시** — 프롬프트 문구에만 의존하면 인트로 문구에 가려질 때 목표를 알 수 없음
   (gridPaint 🎯 배지 사례).

### 유아 디자인 패스 (진행 중, "이건 유아잖아" — 원장 지시)
- 1차 완료: 터치 타깃 확대(칩·셀 50~58px), 정답 시 `tc-pop` 바운스 전 위젯 통일.
- matchLine 연결선 = 굵은 보라 **곡선 점선**(유아 리딩앱 레퍼런스 참고, 라이선스 자산 미복제).
- 2차 후보: 색상 대비, 오답 피드백(소리·표정), 구식 위젯 타깃 재검토, 유아 탭 한정 공통 UI 확대.

---

## 마을(Living Town) — 확정 사항 (되돌리지 말 것)

- **드래그/핀치줌/휠줌** 1024×687 캔버스 + `map.jpg`, **bbox 하이브리드 카메라 피팅**
  (cover vs 건물 5곳 contain 중 안전한 쪽 — 모바일에서 건물이 화면 밖으로 안 밀림).
- **ADVANCE = 우하단 집(left:74%)이 확정** — 처음 시계탑(29%)이었으나 **원장 요청으로 이동**.
  ("29%가 맞다"는 과거 비교표는 이 결정 이전의 낡은 정보이므로 무시. 51% 버전은 어느 브랜치에도 없음.)
- 장식: 숫자 구름·분수·걷는 숫자 캐릭터(탭=말풍선+TTS)·Web Audio 합성 배경음(🔇/🔈 토글).
- 건물 매핑: 📖BASIC(좌상 책건물·**이제 열림**) · 🏛️PRIME(TOWN HALL) · ⛰️CHALLENGE(정자·잠김) ·
  🏠ADVANCE(우하단 집) · 🎬Magic Theater(영상·준비중).

---

## 커리큘럼 전면 재설계 (CURRICULUM_DESIGN.md) — §9 결정 확정됨

원장 확정(다른 세션, 2026-07 하순): ① §3 과정 편성표 그대로 진행 ② 시험 통과 80% + 실패 시 재시험만
③ 인쇄 학습지 기본 20문항 ④ **BASIC(수의 나라)도 파이프라인에 포함**.
→ §8 구현 파이프라인(Workflow) 착수 가능 상태. 스레드 체계(NS/AD/SB/ML/DV/FR/DC/MX)는
engine/threads/*.js 로 구현되어 있고, 유아용 NL 스레드(nl.js)가 이번에 추가됨.

## 문장제·문제은행 (다른 세션 진행분)
- `data/domain-map-reference.md` — DECK6(국가교육과정 math.json)에서 **구조·순서만** 참고해
  4영역(수와연산/변화와관계/도형과측정/자료와가능성)을 우리 등급에 매핑. 텍스트는 전부 창작 방침.
- `NM_WORDPROBLEMS` 스키마 초안 제안 상태 — 구현은 §8 이후 별도 안건.
- 유아 문장제는 이미 수의 나라 storyCard(N-05·N-15)로 일부 구현됨 — 확장 시 이 패턴 재사용 권장.

---

## 미완료 / TODO

| 항목 | 상태 |
|------|------|
| **이 브랜치 → main 병합(배포)** | ⭐ 최우선. 유아 15유닛이 main에 없어 라이브 미반영 |
| CHALLENGE 콘텐츠 (중1 연산 상한: 정수·유리수·지수) | 미구현 — 스레드 추가 설계 필요 |
| ADVANCE 구구 파트가 창의수연 중급 목차인지 | 원장 확인 대기 ("창의적 연산 단계를 확장한 것"이라는 답변까지 받음) |
| 유아 2차 디자인 패스 | 후보 목록은 DESIGN-LEARNING-MODE.md 참고 |
| N-15 완료 시 R0(연산 첫걸음) 추천 배너 | 미구현 (부가 기능) |
| §8 Workflow 파이프라인 실행 (시험모드·인쇄 학습지 포함) | §9 확정으로 착수 가능 |
| 문장제 문제은행(NM_WORDPROBLEMS) 구현 | §8 이후 별도 안건 |
| 레거시 프로토 파일 정리 (app.html·town_proto.html·book/chapter/concept_proto/print/proto.html 등) | 실사용 여부 확인 후 삭제 검토 |
| 배경음 톤/볼륨 피드백 | 원장 확인 대기 |
| Magic Theater 영상 | 준비중 안내만 |

---

## 알려진 이슈
- GitHub API 간헐 502 — 재시도로 해결.
- 여러 세션이 병행 작업 중이므로 **파일 수정 전 반드시 최신 상태 확인**(과거 SHA 충돌로 덮어쓰기 사고를 막은 전례 있음).
- 외부 CDN(폰트·KaTeX)이 일부 환경에서 차단될 수 있음 — 앱은 폴백으로 동작.

## 🗺️ 마스터 로드맵 결정 (2026-08-23, 원장 지시)

- **상한선 변경**: 중1 연산 → **고등 미적분Ⅰ까지 전체 설계**. 고등은 고1·2·3이 아니라
  2022 개정 과목(공통수학1·공통수학2·대수·미적분Ⅰ) 체계로.
- 모든 유형 = **개념 + 제너레이터 학습지** (NM_TGEN + threads.js 등록 의무).
- 교과연산과 매직넘버스를 **스토리 모드**(월드 W1~W14, 잠금 없는 추천 경로,
  시작점 선택)로 연결. 마법 과정마다 필수 연산 관문.
- **답 환원 원칙**: 어떤 유형이든 답은 정수 몇 개로 받는다(문자식 파서 금지).
- 설계 전문: `MASTER-ROADMAP.md`. 다음 세션은 그 문서의 Phase 순서를 따를 것.
## 🔁 과정 재설계 (2026-08-23, 원장 지시 2차)

- "어드밴스는 중급 내용도 아니다" → **척추를 창의 전략에서 연산 진도로 뒤집음**.
- 새 과정표: Level 1~3 · 과정 1~25 (`과정-로드맵.md`). 주차 = 새 유형 1~2 + 누적 혼합
  드릴 4~6 + 4주차 Test(80%). 상위권 페이스 = 월 1과정(6세 상위권 실측 기준).
- 기존 창의 유닛 33개는 폐기하지 않고 전부 새 과정표의 마법 슬롯에 재배치.
- 신규 소요: 검산·역연산·평균 유형, 다함식 위젯 3종(수직선 점프·십진블록·전략 병렬 비교),
  정체 감지→보강 루프(2회 연속 미달 시 보강 드릴 자동 삽입 + 시각화 단계 하강).
- 참조 원천: 두뇌로 과정표·6세 상위권 페이스·다함책 드릴 형태·필즈 운영 로드맵
  (Drive `1adIC-1P6IlTBn2bzb8OgNSELJBK_pUvQ`)·학부모 정체 고충.


## source-to-memory는 원장 자체 스킬 (2026-08-25)
`https://github.com/docssam1/source-to-memory`는 **원장이 직접 만든 스킬**이다 —
드라이브 라이선스 원본을 내용 복사 없이 위치·판정 포인터로만 카탈로그화(`.source-memory/`).
장기 기억 노트를 드라이브 `지필드메모리/source-to-memory/` 폴더에 남겼다(사용법·불변 규칙·
새 세션 안내). 새 세션은 드라이브 원본이 필요할 때 이 카탈로그부터 연다.

## 유닛 제작 전 정독 의무 (원장 지시, 2026-08-25)
"개념과 내용도 살펴봐야 돼" — 목차·구조 실측만으로 유닛을 만들지 않는다.
**제작 전 해당 원본 단원의 개념 전개·가르침 방식·수치 범위를 정독**하고, 그 이해를
자체 문장으로 목차 문서에 "개념 정독" 블록으로 남긴 뒤 제너레이터·마법 노트를 쓴다.
(원문 문장 전사는 금지 — 방법·범위는 사실로서 자체 서술만.) 고급 A~E부터 적용 중.

## 체험 게이트 + 승인번호 (Phase 2B, 2026-08-25 구현)
과정-로드맵.md §10 "승인 관리"·"체험 모드 + 승인번호" 절 그대로 구현. 상세는 `app/main.js`의
"체험 게이트"/"승인번호" 주석 참고. 요지: `profile.account.status`가 `trial`이면 각 티어
대표 유닛(N-01·N-09·A-01·C-06)만 플레이 가능, 편지함·인쇄도 잠김. `nm_codes`에 유효한
코드를 넣으면 `active`로 전환, 코드가 비활성화되면 다음 재검증(하루 1회) 때 자동 복귀.

**원장용 — 승인번호 발급 방법(Supabase 대시보드)**:
1. Supabase 프로젝트(`fgahqumaldheqettmvqg`) → Table Editor → `nm_codes` 테이블을 연다.
2. `Insert row`로 새 행 추가: `code`(학생에게 알려줄 코드 문자열, 예: `GF-2026-홍길동`) ·
   `label`(메모용, 예: 학생 이름) · `active`를 `true`로 설정 → 저장.
3. 학생이 앱(옷장 화면의 "체험 모드" 카드, 또는 잠금 안내 모달)에서 그 코드를 입력하면
   즉시 `active`로 전환된다. 휴원 시엔 그 행의 `active`만 `false`로 토글하면
   다음 앱 실행 때(하루 1회 재검증) 자동으로 체험 모드로 복귀한다 — 행을 지울 필요 없음.

## 모델 운용 정책 (원장, 2026-08-25)
설계 층(과정 1~43·계보·기호 도감·§1~14)이 완결됐으므로 **이후 세션은 Fable이 아니어도 된다**:
- 유지보수·기능 구현·버그 수정 → Opus 5(조율·검증) 또는 Sonnet 5(순수 구현)
- 대규모 재설계(커리큘럼 뒤집기·새 앱 설계)가 다시 생길 때만 Fable
- 불변 규칙: 구현 결과는 반드시 독립 재검증(하네스 재계산·실플레이) 후 커밋
