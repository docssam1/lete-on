# 과학 탐구 랩 인수인계 — Claude → GPT(Codex) · 2026-10-20

> 이 문서는 Claude 세션(작업 브랜치 `claude/jolly-allen-w57yqh`)이 2026-10-15~20에 한 일과 고친 것을 GPT 작업자에게 넘기는 요약이다.
> 자세한 진행 기록·실수·근거는 `science-lab/HANDOFF.md`의 「진행 기록 — 2026-10-19 Claude」(①~⑤)에 있다. 여기서는 **무엇이 바뀌었고, 어디부터 이어서 하면 되는지**만 정리한다.

## 0. 지금 상태 (먼저 읽기)

- **main 반영 완료(원장 지시 2026-10-20 「지금까지 한 건 메인 반영」)**. 작업 브랜치에 최신 main을 합친 뒤(충돌 0) main에 올렸다. GitHub Pages 배포 워크플로가 `science-lab/**` 변경으로 돈다.
  - 반영 직전 검사: `node --test science-lab/bank/*.test.mjs science-lab/v2/*.test.mjs scripts/tests/bank-science-source-provenance.test.mjs` → 602개 중 600 통과 · 실패 0 · 건너뜀 2. 3D 검사기는 단원마다 `node scripts/check-science-3d.mjs <단원>` 실패 0.
  - 작업 브랜치 전용 검수 캡처 `science-lab/_review/`(커밋 9088562)는 main 반영 전에 지웠다(9be2760). 브랜치 이력에는 남아 있다.
- **이제 작업자는 GPT.** 원장 결정: **3D를 새로 만들거나 고칠 때는 Claude API를 쓴다**(아래 6절).
- **독쌤 음성은 아직 안 만들었다.** 새 단원 대사는 `science-lab/data/voice/<단원>.voice.json`에 있고, 음성 파일이 없으면 기기 음성으로 읽는다. 음성 생성 워크플로는 science-lab 변경으로 자동 실행되지 않는다(원장 승인 뒤 따로 돌린다).

## 1. 원장 결정·지시 (이 기간)

| 날짜 | 지시 | 반영 |
|---|---|---|
| 10-19 | v2 홈 차례는 **2022 개정이 기본**, 2015 교재 자료는 아래 칸 | ① |
| 10-19 | 기록 앱(입력 폼)이 기본 수업이면 안 된다 → **현상 → 예상 → 3D 실험 → 결과 → 개념 → 적용**의 사고력 수업 | ②⑤ |
| 10-19 | 문제 품질은 **시중 문제집 수준**, 3D 실험도 같은 수준 | 생성기 검사 |
| 10-19 | 「실사 수준으로 만들어야 하는거 알지 배치도」 | 교재 실사형 사진 |
| 10-20 | **v1 `/science-lab/` = 과학 탐구 프로그램**, **v2 `/science-lab/v2/` = 교과 프로그램**. 둘은 따로다 | ④ |
| 10-20 | v1은 hugh-kim.space 「THE ARCHIVE」 느낌 → 영역별 → 「실험실 느낌」, 카드는 스크롤·클릭 둘 다로 넘김 | ④ |
| 10-20 | 사진 속 가짜 한글 간판 고치기 | a062bdb |
| 10-20 | 「진행」 = 같은 패턴을 나머지 기록형 단원에 | ⑤(진행 중) |
| 10-20 | **3D 질이 안 좋다**(코드로 만든 여우 등 동물이 어색, 밤하늘·별은 괜찮다) → 3D는 앞으로 **Claude API로 생성** | 6절 |

## 2. 한 일 — 커밋 순서

| 커밋 | 내용 |
|---|---|
| ff60e96 | 4-1 s41-u02 물의 상태 변화: 시험관 3D 실험실 |
| 05a9c0d · 6a86d9a · b44f246 | 단원 ↔ 2022 성취기준 대조 문서(`CURRICULUM-2022.md`), 지도·문제은행·교재를 2022 순서로 |
| 6d9774b | **① v2 홈 차례**: 2022 32단원 기본, 2015 자료는 아래 칸(`v2/curriculum-place.js` 새로 만듦) |
| 4f87646 · 6854596 | **② 4-2 Ⅳ 기후변화(`c22-s42-u04`)·3-2 Ⅳ 감염병(`c22-s32-u04`)** 사고력 수업 + 3D(해안 마을 물높이·반짝이 손) + 두 팀 배틀 |
| 1eb3fa1 · 16e087e | **③ 두 단원 문제집형 A4 교재**(학생·교사·해설·빠른 정답표) |
| aefebda · 5a2d79e · ff02669 · 2054e78 | 교재 실사 사진 생성 도구(원장 PC/맥 GPU, FLUX) `scripts/local/book-photos.*` |
| a062bdb | 실사형 설명 사진 16장 넣기 · 가짜 한글 지우기 |
| 07dc489 · e5424c7 · e5d90fa · 6593a5e | **④ v1 과학 탐구 프로그램**: 서류철 → 기록 보관소 → 영역별 → 실험실 느낌·스크롤/클릭 카드 |
| 0c66a5c | ⑤ 3-2 Ⅰ 물체와 물질 `c22-s32-u01` — 3D 같은 모양 막대 네 개 |
| ac967ea | ⑤ 3-2 Ⅱ 지구와 바다 `c22-s32-u02` — 3D 증발 접시 · 4-1 s41-u01~u03 기본 수업을 이미 있던 3D 실험 수업으로 |
| 6a88816 | ⑤ 3-2 Ⅲ 소리의 성질 `c22-s32-u03` — 3D 책상 끝 자 튕기기(모형 소리) |
| a0ab62d | ⑤ 4-1 Ⅳ 다양한 생물 `s41-u04` — 이미 있던 효모빵 반죽 3D |
| 86f325c | ⑤ 4-2 Ⅰ 밤하늘 관찰 `c22-s42-u01` — 3D 같은 시각 달 관찰 |
| bdd600a | ⑤ 4-2 Ⅱ 생물과 환경 `c22-s42-u02` — 3D 풀밭 먹이 관계 |
| 9be2760 | 검수 캡처 `_review/` 빼기(main 반영 전) |

## 3. 고친 공용 코드 (다른 단원에도 영향)

- `scripts/gen-science-think-lib.mjs`(새로 만듦): 사고력 수업 데이터 공용 생성기. 단원 생성기 `scripts/gen-science-think-<단원>.mjs`가 부른다 → `data/units/<u>.think.js`·`data/book/<u>.book.js`·`.interact.js`·`data/voice/<u>.voice.json`.
  - 생성기가 멈추는 조건: 보기 5개가 아님, 정답 자리 쏠림 >2, **정답이 눈에 띄게 가장 긴 보기**(3자 이상), 보기 중복, 오개념(N)인데 근거 문항이 없음.
  - `tax.unit`·`unit.no`를 단원 id에서 읽는다(처음엔 u04로 고정돼 있었다).
- `v2/think-merge.js`(새로 만듦): `withThink(u, mod)` — 문제은행 파일을 건드리지 않고 수업 시점에 think 문항·판정표·오개념을 합친다. `think-workbook-paper.js`는 문제집형 교재를 붙인다.
- `v2/v2.js`
  - UNITS: 사고력 수업 단원은 `withThink('<u>', {...})`로 불러온다.
  - `RECORDS_BOOKS`: 예전 기록 교재(`#/<u>/records-book`)를 연다.
  - BOOKS: s41-u01~u03은 3D 실험 교재(`s41-u0N.book.js`)를 연다.
  - 기록장 주소는 `#/<u>/records`.
- `v2/lab-battle-model.js`
  - 단원마다 두 팀 배틀 과제 3개.
  - 팀마다 값이 다른 필드를 쓸 수 있다(`mat`·`sea`·`rank`·`amp`·`lit`·`pos`·`grass`/`rabbit`/`fox`).
  - 기록 검증은 `validBattleRow`가 모형과 대조한다.
- `v2/mounts.js` LABS에 새 실험실 등록: `sealevel`·`glitter`·`material`·`seawater`·`ruler`·`moon`·`meadow`. 실험실 CSS는 `v2/index.html`에 링크(현재 `v2.js?v=89`).
- `scripts/check-science-3d.mjs`: `ALL`에 새 단원 추가. 5단계 실험 경로는 `#/<u>/2/lab`(model 탭이 아님).
- `tools/book-art.js` + `scripts/render-book-art.mjs`: 교재 그림을 3D 모형에서 렌더한다. 렌더는 로컬 서버 `python3 -m http.server 8765`가 필요하다.
  - 렌더 이름 앞머리: `sea-` `glit-` `mat-` `sw-` `rl-` `mo-` `md-` `bread-` 등.
  - 결과 파일: `assets/book/<u>-<shot>.webp`.
- `v2/home.js`: 홈 카드 글·썸네일(`assets/thumbs/<u>.webp`, 3D 화면을 결과가 드러나기 전 상태로 캡처).
- `v2/curriculum-place.js`·`curriculum-2022.js`: 2022/2015 이름표, `LEGACY_TO_2022`.
- 실험실 공통 규약은 `mountX(el, opts) → { rows, dispose }`이다.
  - `opts`: `rows`·`onRecord`·`isActive`·`mode`·`force2D`
  - 3D는 `engine.Stage`·`setView({theta, phi, frame})`·`stage.update`·`watchDetached`를 쓴다.
  - 움직임 줄이기 설정을 따르고, WebGL이 없으면 2D로 대신한다.
  - 장면은 `build*` + 기본 내보내기 Player(`beats`, `revealAt: 2`).

## 4. 단원별 현황 (2022 개정 · v2)

**사고력 수업이 기본(완료)** — 옛 기록 앱은 선택 기능으로 보존(`<u>.records.js`의 `recordsLesson`, `<u>.records-book.js`, 저장 키 `sciLab.inquiry.<u>` 그대로):

| 단원 | 3D 실험실 | 생성기 |
|---|---|---|
| 3-2 Ⅰ 물체와 물질 `c22-s32-u01` | 같은 모양 막대 네 개(`material`) | `gen-science-think-c22s32u01.mjs` |
| 3-2 Ⅱ 지구와 바다 `c22-s32-u02` | 증발 접시 두 개(`seawater`) | `…c22s32u02.mjs` |
| 3-2 Ⅲ 소리의 성질 `c22-s32-u03` | 책상 끝 자 튕기기(`ruler`) | `…c22s32u03.mjs` |
| 3-2 Ⅳ 감염병 `c22-s32-u04` | 반짝이 손(`glitter`) | `…c22s32u04.mjs` |
| 4-1 Ⅰ~Ⅲ `s41-u01~u03` | 이미 있던 고리 탑·시험관·언덕 | (생성기 없음, `lesson.js` 끝에서 3D 수업으로) |
| 4-1 Ⅳ 다양한 생물 `s41-u04` | 효모빵 반죽(`bread`, 5-1 것 재사용) | `…s41u04.mjs` |
| 4-2 Ⅰ 밤하늘 관찰 `c22-s42-u01` | 같은 시각 달 관찰(`moon`) | `…c22s42u01.mjs` |
| 4-2 Ⅱ 생물과 환경 `c22-s42-u02` | 풀밭 먹이 관계(`meadow`) | `…c22s42u02.mjs` |
| 4-2 Ⅳ 기후변화 `c22-s42-u04` | 해안 마을 물높이(`sealevel`) | `…c22s42u04.mjs` |

**아직 기록 앱이 기본(⑤ 남은 일, 9단원)**: 4-2 Ⅲ 기체 `c22-s42-u03` · 5-1 Ⅰ~Ⅳ `c22-s51-u01~u04` · 5-2 Ⅰ~Ⅳ `c22-s52-u01~u04`.
기존 3D 중 다시 쓸 만한 것: 그림자(`shadow` → 5-1 빛?) · 열 띠(`heat` → 5-2 열?) · 가습기/눈/순환(`humidifier`·`snow`·`cycle` → 날씨) · 지층/화산(`quake`·`volcano` → 지층과 화석). 내용이 맞는지는 단원 성취기준과 대조해서 정한다.

## 5. 단원 하나를 바꾸는 순서 (⑤ 레시피)

1. 옛 수업·교재를 `git mv`로 옮긴다: `data/units/<u>.lesson.js` → `<u>.records.js`(export 이름 `lesson` → `recordsLesson`), `data/book/<u>.book.js` → `<u>.records-book.js`. 옛 기록 테스트(`v2/*-lesson.test.mjs`)는 records 파일을 보도록 고친다(`import {recordsLesson as lesson}`).
2. 3D 실험실: `scenes/<이름>-model.js`(THREE 없는 수치 모형 — 테스트·배틀 공용) · `scenes/<이름>.js`(장면, `revealAt`) · `v2/lab-<이름>.js`·`.css` · `mounts.js` LABS · `index.html` CSS 링크.
3. 생성기 `scripts/gen-science-think-<u>.mjs`를 쓰고 실행한다(문제은행 b문항 유형·성취기준과 맞춘다).
4. 새 `data/units/<u>.lesson.js`(`engage.scene`, `explore.lab.kind`·`rowsKey`, `explore.records`, `elaborate.report:false`, `report: recordsLesson.report`).
5. `v2.js` UNITS를 `withThink`로, `RECORDS_BOOKS`에 추가. **`node --input-type=module -e "import('./science-lab/v2/v2.js')"`로 모듈로 읽어 볼 것**(`--check`는 괄호 하나 남은 것을 못 잡았다. Node에서 `matchMedia is not defined`가 나오면 문법은 통과한 것).
6. 배틀 과제 3개(`lab-battle-model.js` + `lab-battle.js` 안내문 + `lab-battle.test.mjs`).
7. `think-lessons.test.mjs` UNITS·모형 검사, `check-science-3d.mjs` ALL.
8. 교재 그림(`tools/book-art.js` 새 앞머리 + `render-book-art.mjs` 정규식) → 렌더 → 눈으로 확인(글자 겹침·잘림).
9. 홈 카드 글·썸네일, `v2.js?v=` 올리기, `HANDOFF.md` ⑤에 한 줄.
10. 검사: 전체 테스트 · `check-science-3d.mjs <u>`(한 번에 하나씩 — 동시에 돌리면 거짓 실패) · PC 1280/폰 390 화면 확인.

## 6. 3D는 Claude API로 — 넘길 때 알려 줄 것

원장 결정(10-20): 3D 장면·실험실을 새로 만들거나 질을 올릴 때 Claude API를 쓴다. Claude에게 맡길 때 아래를 함께 준다.

- **규칙 문서**: `science-lab/3D-RULES.md`, 스킬 `.claude/skills/science-lab-3d/SKILL.md`. 핵심은 다섯 가지다.
  - 카메라 거리는 손으로 정하지 않는다(엔진 자동 맞춤). 각도와 `frame`만 정한다.
  - 바닥 역할 물체는 `noFrame`으로 둔다.
  - 장면에는 `revealAt`을 둔다. 예상 전에 답을 보여 주지 않는다.
  - 라벨은 `kit.label`만 쓴다.
  - 버튼을 누르기 전에는 아무것도 저절로 움직이지 않게 한다.
- **Three.js**: 새로 넣지 않는다. `world-explorer/vendor/three.module.js`(r184)를 상대 경로로 import한다.
- **완료 조건**: `node scripts/check-science-3d.mjs <u>` 실패 0 + 덱·폰·전체 화면 캡처를 눈으로 확인한다.
- **질 문제(원장 지적)**
  - 이번에 만든 동물·사물은 코드로 구·원뿔을 깎은 것이라 장난감처럼 보인다(특히 `scenes/meadow-field.js`의 토끼·여우). 밤하늘(`moon-sky.js`)은 괜찮다는 평이다.
  - 생명체·사실적인 물체는 절차 생성으로는 한계가 있다. 무료 3D 모델(glTF, CC0)이나 실사 그림(배경 + 배경을 지운 낱장 그림)을 쓰는 쪽을 검토한다.
  - 이 클라우드 세션에서는 Kenney·Quaternius·Poly Haven·jsdelivr 접속이 막혀 있었다(GitHub raw만 열림).
- **모형 값 표기**: 화면·교재·배틀의 수치는 모두 「모형 값」이라고 밝힌다(예: 풀밭 처음 풀 60·토끼 12·여우 3, 여우가 사라지면 토끼 28·풀 28). 수치를 바꾸면 `*-model.js` 하나만 고치고 생성기·교재 그림을 다시 만든다.

## 7. 실수했던 것 (같은 일 막기)

- **남쪽을 보면 서쪽이 오른쪽**이다. 밤하늘을 처음에 거꾸로 그려 초승달의 밝은 쪽이 틀렸다.
- 판정표(`JUDGE`): 정규식은 공백을 뺀 글에 적용되고, 바로 뒤에 부정이 붙은 조각은 버린다. `ex.part`는 조건 하나만 맞는 글로 쓴다(둘 다 맞거나 하나도 안 맞으면 테스트 실패).
- 생성기 끝에 SVG 도우미를 `const f = () =>`로 두면 `buildThink(...)` 호출 때 아직 초기화되지 않아 멈춘다 → `function`으로 선언한다.
- 줄 안에 주석을 끼우다 코드가 잘린 적이 있다(`book-art`의 재질 줄, 생성기의 `const`).
- 교재 렌더의 지시선은 늘 글자 왼쪽으로 들어온다 → 글자를 가리키는 점보다 오른쪽에 둔다.
- 사진 속 가짜 한글은 inpaint 대신 「바탕색 평면으로 칠하기·잘라내기·흐리기」가 깨끗했다.
- 책 단위 평균만 보면 한 블록의 문제가 가려진다(정답 길이 편향 등) — 레슨·단원별로 본다.

## 8. 지켜야 할 것 (그대로 유지)

- v1과 v2를 섞지 않는다.
- 문제은행 파일(`<u>.js`·`.misc.js`·`.judge.js`·`.source.js`·`.similar.js`)은 수업 작업에서 건드리지 않는다.
- FC 골든벨 정답은 공개 파일·커밋·PR에 쓰지 않는다(루트 `CLAUDE.md`).
- CARS 라이선스 원문은 Supabase에만 둔다.
- 녹음 파일·`.docssam-work`는 커밋하지 않는다.
- 맥 작업본은 전체 add/reset/clean/pull로 정리하지 않는다.
- 실제 학생 답안은 계약 승인 전에 외부로 보내지 않는다.
- 커밋 메시지에 모델 이름을 쓰지 않는다.

## 9. 남은 일

1. ⑤ 남은 9단원(4절). 3D는 Claude API로.
2. 이미 만든 3D 중 질이 낮은 것 다시 보기 — 먼저 풀밭 먹이 관계(토끼·여우), 그다음 다른 단원의 사물 모양.
3. v1 실험실 배경 실사 사진 `lab-room`·`lab-bench` — 맥 `book-photos.command --only lab-room,lab-bench`로 만든 뒤 `app.js`의 `CORRIDOR`에 연결.
4. 독쌤 음성 일괄 생성(원장 승인 뒤): 새 단원 `data/voice/*.voice.json` → `scripts/generate-audio.js`.
5. ② 두 단원 교재는 원장 검토 대기. 나머지 ⑤ 단원은 문제집형 교재(`gen-science-workbook-*`)가 아직 없다(사고력 수업 웹 교재 `lab-book`만 있음).
