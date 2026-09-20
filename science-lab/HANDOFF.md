# 과학 탐구 랩 — 세션 인수인계 (2026-09-19, 2차)

> 새 세션(로컬 포함)은 이 파일 → `DESIGN.md` → `data/source-toc.md` → `UX-TEST-2026-09-19.md` → 저장소 루트 `CLAUDE.md`의 "과학 탐구 랩" 절 순서로 읽고 시작한다.

## 만들려는 것 전체 (한 화면 요약)
**docssam 과학 탐구 랩** — 초등 3~6학년이 혼자 태블릿·폰으로 "실험으로 탐구하고, 개념으로 이해하고, 영재원으로 확장"하는 사이트. 지필드 캐릭터 docssam이 선생님.

1. **단원 축**: Drive `과학 단원평가` 폴더의 8학기 × 단원(Ⅰ~Ⅴ + 중간·기말) = 홈의 정거장. 지도자료 15유닛(현재 v1)은 탐구 단원과 소재 단원으로 흡수. (`data/source-toc.md` §1)
2. **단원 화면 = 5E 순환 5단계**, 한 단계 한 화면: ①궁금(3D 현상 10초 + 예상 고르기) ②실험(아이가 슬라이더로 변인 바꾸는 **조작형 3D**, 관찰값 표에 기록, 지필드 실험편 Step1~4) ③개념(docssam 크게 등장, **빈칸 개념 카드**·정리표·Mini Test — NEW STUDY 슬라이드 방식, 이론편 소스) ④확장(영재원 문제 2 + 서술형 1, 읽을거리) ⑤점검(3문항, 관문 2/3, 재도전·다음 정거장). 실험값이 ③·④에 다시 등장하는 것이 연결 장치. (`DESIGN.md`)
3. **docssam**: 이론 화면에 크게, 말풍선은 입 쪽에서. 그림은 한 장(웃음, 3D 렌더). **표정·입 움직임**은 ⓐ표정 세트를 추가로 받아 교체(권장) ⓑ지금 그림의 입·눈 부위를 덮고 SVG로 그려 넣기(리딩타운 아바타 표정 코드 재사용, 즉시 가능) 중 사용자 선택 대기. 립싱크는 음성 합성의 낱말 경계 이벤트로 입 여닫기, 음성 꺼지면 자막 속도에 맞춤. 팔레트는 캐릭터에서 확정(navy 악센트). **표정 세트 반입 완료**(아래 3차 기록).
4. **문제은행 = 단원 파일**: `data/units/<단원id>.js` 하나에 5E 콘텐츠와 문항(`items`)을 함께 둔다. 문항 계약은 스킬 `gfield-science-question-bank`, 등록은 `fields-classic/question-bank/question-bank-adapter.js`. 유형: cloze·table-fill·single-choice(4·5지)·short-text·number-with-unit·ordered-sequence·multi-select·written-explanation. 정답 위치 사전 배분·오답 구체성(CARS 규칙). 소스: 이론편 개념 확인/응용/창의사고력 + 실험편 영재성 기르기(라이선스 없음, 원문 사용 가능) + 단원평가 PDF(출처 미확인 → 원문·정답은 Supabase `science_bank_source`, git엔 authored 변형) + 영재원 기출(Supabase만). 약점 태그 누적 → 다음 관문 우선 출제. 길 끝 **영재원 모의 평가**(25문항 40분, 유형별 리포트). 티처 콘솔 인쇄(문제/정답·해설/둘 다).
5. **홈 = 탐구 지도**: 구불한 길 위 정거장, 끝낸 곳 깃발, 다음 정거장에 docssam. 정거장마다 실험·개념·확장 3칸 진도. "이어서 하기" 고정 버튼.
6. **3D 엔진**: 지금 `engine.js`(Three.js r184, 비트 재생)를 유지하고 `controls/readout` 조작 모드를 추가. 원본 도형만. 모바일 규칙(터치 44px, 가로 모드 오버레이, 저사양 축소, 감소된 동작). 외부 시뮬레이션(PhET 등)은 후보만 조사, 미연동.
7. **품질 규칙**: 사용성 점검(`UX-TEST-2026-09-19.md`의 심각 4건 해소 필수), 320px 가로 넘침 0, 콘솔 에러 0, 정답 분포·보기 길이 검사기 통과, 스킬의 릴리스 게이트 8개.
8. **작업 방식**: 인터뷰 → 계획(DESIGN.md) → 사용자 승인 → 구현. 1차 범위 **4-1 Ⅰ 자석의 이용** 1단원. 디자인 규격은 MengTo design-first-ui-prompting 형식, 타이포 Gaegu(개구) 700 + Pretendard.
9. **제외**: 화올 최종교재. 자기 낭독 녹음. 자동 재생 음성. 이모지 아이콘. 외부 스톡 일러스트.

## ⚠ 새 세션은 여기부터 (2026-09-20)
- **이미 끝난 것 — 다시 만들지 말 것**: 자석 단원 파일(창작 26문항 + 5E 구성 `s41-u01.lesson.js`) · 5E 5단계 화면 v2 · 조작형 가상 실험실(고리 자석 탑) · 3D 장면 `ring-tower` · 준비물 QR · 탐구보고서 · 교재 인쇄 · `bank/audit.mjs` · docssam 표정 9장(assets/) · **홈 탐구 지도**(`v2/home.js`·`home.css`·`units-index.js`, 입체 정거장) · 재도전(보기 섞기) · 진도 저장(localStorage `sciLab.v2`).
- **문제은행 개정 분류·유사문항 완료(2026-09-20, Cowork — Claude Code 안 씀)**: 분류 `data/units/s41-u01.taxonomy.js`(2022 개정 · 운동과 에너지 · [4과09-01]·[4과09-02] · 내용 요소 E1~E4 = 소단원 · 유형 T01~T13 · 원문 80문항 대응) · 유사문항 80 `s41-u01.similar.js`(선택형 39·단답형 35·서술형 6, 단일 선택 정답 ①~⑤ 7·6·6·6·6) · `bank/audit.mjs` 통과 · Supabase 원문 80행에 element·type·format 태그와 새 그림 경로(`science-src/4-1/자석의 이용/<E코드 이름>/<T코드 이름>/o-NN.png`, 묶음 지문 7개는 `figures.stem`, `figures.status:'pending-crop'`). 공개 산출물 `bank/taxonomy/s41-u01.json`은 `bank/taxonomy/build.mjs`가 `s41-u01.taxonomy.js`에서 만든다(직접 고치지 말 것). 화면: 지도에서 정거장 누르면 소단원 시트 → `#/s41-u01/sub/E1~E4`(유형별 유사문항 풀기, 단답형·두 개 고르기 지원). 교재에 "유형별 문제" 4쪽 추가. 지도 배경 = 직접 그린 실험실 선화 `v2/lab-bg.svg`.
- **4-2 Ⅰ 식물의 생활도 끝남(9차)** — 아래 9차 기록. 원본 그림은 USB `science-src 그림\식물의 생활`(72개)에 있고 GitHub 업로드 대기.
- **4-1 Ⅲ 땅의 변화도 끝남(8차)** — 아래 8차 기록. 원본 그림 세 단원 모두 `science-src`에 올라감.
- **4-1 Ⅱ 물의 상태 변화도 끝남(7차)** — 아래 7차 기록. 원본 그림 두 단원 모두 `science-src`에 올라감(`figures.status=ok`).
- **남은 것**: 성취기준 문장(고시 원문 대조) · 소단원 이름을 교과서 출판사 표기로 바꿀지 결정 · 어댑터 등록(`bank/science-bank-adapter.js`).
- **⚠ 시작할 때 `git log --oneline -5 origin/<브랜치>`부터 볼 것.** 이 세션이 컨테이너 재시작 뒤 같은 작업 지시서를 두 번 돌려 유사문항 80개를 중복 작성했다(6차 기록 참조).
- DESIGN.md는 v2 구현으로 사실상 승인됨.

## 진행 기록 — 2026-09-20 9차 (Cowork): 4-2 Ⅰ 식물의 생활

- **문제은행**: Supabase `s42-u01` 70행(세트1·2는 15문항, 세트3·4는 20문항). 전사 후 검수 에이전트 재대조 수정 0, md5로 DB와 로컬 일치 확인.
- **분류** `s42-u01.taxonomy.js`: 영역 생명 · E1 잎 관찰과 분류 / E2 들이나 산 / E3 강이나 연못 / E4 사막과 적응 / E5 생체 모방 · T01~T10.
- **유사문항** 70 · **창작** b01~b12 · audit 통과(보기 길이 6건 고침).
- **공개 시뮬레이션 먼저 찾기**: 식물 분류·수생 식물에 맞는 공개 시뮬레이션은 없었음(PhET 부력은 밀도 개념이라 단원과 다름) → 직접 제작.
- **5E**: hero '부레옥잠 연못'. 3D `scenes/pond-plants.js`(연못 단면·부레옥잠 누르면 공기 방울·잎자루 단면 공기주머니). 공용 모형 `scenes/_pond.js`(연못·부레옥잠·수련·검정말·부들·기포).
- **체험형 실험실** `v2/lab-pond3d.js`: 식물을 골라 연못의 땅·물가·깊은 물을 눌러 심으면 실제 사는 방식대로 움직임(맞지 않으면 시들거나 잠김) · 부레옥잠 물속으로 누르기(누르고 있기 → 기포, 떼면 떠오름) · 잎자루 잘라 보기 · 표에 적기. 결과 판정은 `pondResult()`.
- **개념북 자료**: 이론편 `4-2-1단계-교사.pdf` Ⅰ 식물의 세계(생김새·물에 사는 식물·숲과 들·사막과 높은 산·바닷가) + 실험2 `4-B-1 잔디 인형` 대응. PDF는 텍스트 층이 있으나 글자 사이 띄어쓰기가 빠져 있어 쪽 그림으로 쓰는 편이 낫다.

## 진행 기록 — 2026-09-20 8차 (Cowork): 4-1 Ⅲ 땅의 변화

- **원본 PDF는 사용자 PC의 G드라이브(`G:\내 드라이브\과학 단원평가`, 3-1~6-2 전 학기)에 다 있다** — 연결된 컴퓨터에서 `device_stage_files`로 바로 가져온다. 이론편(30권)·실험2(31권)도 같은 드라이브에 있음(4-A 실험은 hwp만).
- **문제은행**: Supabase `s41-u03` 80행(원문·정답, 전사 후 검수 에이전트가 PDF와 재대조 — 수정 0). 텍스트는 Supabase 유지(단원당 ~0.4MB, 사용자 승인), 그림만 GitHub.
- **분류** `s41-u03.taxonomy.js`: 영역 지구와 우주 · E1~E6(흐르는 물에 의한 땅의 변화 / 강 주변 지형 / 화산과 화산 분출물 / 화강암과 현무암 / 화산 활동과 지진의 영향 / 대처 방법) · T01~T11.
- **유사문항** 80(`s41-u03.similar.js`) · **창작** b01~b12 · audit 통과.
- **5E**: hero '흙 언덕 물길'. 조작 실험 `v2/lab-hill.js`(경사 완만/가파름 × 물 적게/많이 → 깎인 흙 = 쌓인 흙 칸). 3D `scenes/hill-stream.js`는 **높이 함수 지형**(정점 색·노이즈)으로 물길이 실제로 파이고 아래에 부채꼴로 쌓이며 색 모래가 옮겨 간다 — 물띠 + 물방울·모래알 파티클.
- **원본 그림** 91개(`science-src/4-1/땅의 변화/`) 사용자 업로드 → 바이트 대조 일치 → `figures.status=ok`.
- **체험형 3D 실험실(사용자 요청 "체험할 수 있게 움직이는 형태")**: `v2/lab-hill3d.js` + 순수 계산 `v2/hill-sim.js`(물방울 침식 — 물방울이 비탈을 따라 흐르며 깎고 옮기고 쌓음, 흙 양 보존, 흩어짐은 고정 수열이라 같은 조건=같은 결과). 경사·물의 양 선택 → 언덕을 눌러 컵 자리 → '물 붓기' 누르고 있기 → 컵이 비면 표에 적기. WebGL 없으면 2D `lab-hill.js`로 대체. 같은 컵 자리에서 가파름>완만, 많이>적게가 항상 성립(node로 확인).
- **사용자 결정(2026-09-20): 다음 단원부터 공개 시뮬레이션 먼저 찾기** — PhET(CC BY 4.0, 출처 문구·로고 유지, 2026-03-29 이전 공개분) iframe 임베드, MIT 코드(예: LanLou123/Webgl-Erosion, concord-consortium/seismic-explorer)는 가져와 우리 화면·기록 표에 맞게 고친다. 맞는 게 없을 때만 직접 만든다.
- **다음**: 4-2 Ⅰ 식물의 생활(또는 사용자 지정).

## 진행 기록 — 2026-09-20 7차 (Cowork): 4-1 Ⅱ 물의 상태 변화 · 원본 그림 업로드

- **문제은행**: Supabase `science_bank_source` `s41-u02` 세트1~4 = 80행(원문·정답, 분류 태그). git엔 원문 없음.
- **분류** `data/units/s41-u02.taxonomy.js`: 영역 물질 · 소단원 E1~E5(물의 세 가지 상태 / 물이 얼 때와 얼음이 녹을 때 / 증발과 끓음 / 응결 / 물의 이용과 물 부족) · 유형 T01~T12. 성취기준 문장은 비어 있음.
- **유사문항** `data/units/s41-u02.similar.js` 80개(선택41·단답28·서술8·복수선택3, 정답 위치 9·8·8·8·8). `bank/audit.mjs` 통과.
- **창작 문항** `data/units/s41-u02.js` b01~b12(빈칸 카드 4 · 표 채우기 · 미니테스트 · 영재성 3 · 점검 3).
- **5E** `data/units/s41-u02.lesson.js`: 궁금 = 3D `scenes/freeze-bottle.js`(병을 얼리면 높이↑·무게 같음) · 실험 = 조작형 `v2/lab-freeze.js`(물 양 고르고 얼리기/녹이기, 높이·무게 기록) · 집 실험 = 주방 저울 키트(`assets/qr-s41-u02-kit.svg`) · 보고서.
- **v2 일반화**: `LABS` 등록표, `lesson` 없는 단원은 `/sub/E1`로, 소단원 화면 번호 이동, 복수선택·단답 문항, 표 보기 렌더. 홈 `units-index.js` `READY`에 u02(얼음 병 저울).
- **원본 그림**: 폴더 한 단원 하나 + 분류는 파일 이름(`E1-T01-o-01.png`, `…-stem-01.png`) — 6차의 E/T 하위 폴더 방식은 폐기(웹 업로드가 폴더를 못 넣음). 사용자가 GitHub 웹 업로드로 올림(자석 88·물 98, 원본과 바이트 대조 일치). Supabase `figures.block/stem`을 새 경로로 바꾸고 `status=ok`. 규칙은 `science-src/README.md`.
- **바이너리 반입 방법**: 클라우드에선 PNG 푸시 불가 → 파일을 사용자 PC 연결 폴더에 풀어 두고, 사용자가 `…/upload/science-src/<경로>` 주소에 끌어 넣기. zip은 윈도우에서 한글 폴더가 비어 보일 수 있으니 폴더째 주거나 zip 루트에 파일만.
- **다음**: 4-1 Ⅲ 땅의 변화.

## 진행 기록 — 2026-09-20 6차 (Claude Code): 중복 작업 정리 · JSON 일원화 · Supabase/science-src 정렬

**이 세션은 컨테이너가 여러 번 재시작(worker epoch 6)되면서 `TASK-bank-taxonomy.md` 1~4단계를 두 번 했다.**
앞 차례가 만든 것(`s41-u01.taxonomy.js` 13유형 + `s41-u01.similar.js` 80문항 + 소단원 화면 + 교재 유형별 섹션)이
이미 푸시돼 있었는데, 뒤 차례는 그것을 모르고 같은 일을 다시 했다(14유형 JSON + `s41-u01.js` 안의 `v001~v080`
+ 별도 교재 섹션 + 창작 그림 4개).

**합칠 때 앞 차례 것을 남겼다.** 이미 앱에 물려 있었기 때문이다 — 소단원 화면 `#/<단원>/sub/<E>`,
`units-index.js`의 READY, 교재 섹션이 전부 `taxonomy`·`similar` export를 쓴다. 갈아 끼우면 재검증할 것이
너무 많았다. 뒤 차례의 유사문항 80개와 창작 그림 4개는 버렸다.

### 그래서 뒤 차례에서 남긴 것 셋
1. **`bank/taxonomy/s41-u01.json`** — 작업 지시서가 지정한 경로·형식의 공개 산출물. 내용은 14유형에서
   **앞 차례의 13유형으로 다시 만들었다.** 진짜 원본은 `data/units/s41-u01.taxonomy.js` 하나이고, JSON은
   **`bank/taxonomy/build.mjs`가 거기서 생성**한다(유형별 원문 수·유사문항 수·형식 집계·원문 세트번호 목록을
   얹어서). 직접 고치지 말 것.
2. **`bank/audit.mjs`에 동기화 검사** — `build.mjs --check`로 JSON이 `.taxonomy.js`와 어긋나면 실패시킨다.
   둘이 갈라지면 교재 차례와 문항 태그가 조용히 달라진다.
3. **Supabase·`science-src` 정렬**(아래).

### Supabase (80/80)
`item.taxonomy`에 `area·standard·curriculum·semester·element·type·format` 추가(기존 `topic`·`concept`·
`inquirySkill`·`level`·`track` 보존). `figures.block`·`figures.stem`·`item.visualModel.figure`를 분류 경로로 교체.
묶음 공통 지문 **7개**(문항 15개가 공유). `figures.status:'pending-crop'`.

### `science-src` 브랜치 (푸시 완료)
`science-src/4-1/자석의 이용/index.json` — 원문 80개 대응표(`<source_key> → {file, stem?, element, type,
format, source:{set,no}}`, **원문 문장 없음**) + 분류 폴더 13개 + `README.md`(막힌 이유·이어서 할 일).

### 막힌 것 두 가지
1. **성취기준 문장 미대조.** 교육부 고시 제2022-33호 [별책 9] 원문을 보려 했으나 이 컨테이너의 이그레스
   정책이 `ncic.re.kr`·`moe.go.kr`·`steam.kosac.re.kr`·`koreascience.kr`·`namu.wiki`를 **전부 CONNECT 403으로
   막는다.** 추측하지 않고 `{code, text:null, verified:false}`로 뒀다.
2. **원본 그림 PNG 없음.** `crop_blocks.py`는 PDF를 **디스크에서** 읽는데 `drive.google.com`이 막혀 있고(403),
   Drive MCP의 `download_file_content`는 파일을 base64로 **대화 문맥에 실어** 주는 방식이라 2.4MB PDF에 못 쓴다.
   **Drive 폴더에 세트4 PDF도 없다**(세트1~3 + 정답·풀이뿐, 폴더 id `1rftc95Gl6E3Z735g2-Oulez490kPWA4m`).
   경로는 Supabase와 `index.json`이 이미 일치하므로 **파일만 제자리에 놓으면 더 고칠 것이 없다.**

### 검증
- `node bank/audit.mjs` **통과** — 창작 26 + 유사 80, 유형별 원문 수 = 유사문항 수 **13/13 일치**,
  JSON ↔ `.taxonomy.js` 동기화 확인.
- Playwright 390px·320px × **13경로**(인쇄 3종 · 5E 5단계 · 보고서 · 준비물 · 홈 지도 · 소단원 2):
  **콘솔 에러 0 · 가로 넘침 0.** 인쇄 PDF 3종 생성.
- 문항 번호: 학생용·정답만 106개(중복 0·오름차순), **교사용은 문제 번호와 정답 번호가 1~106 완전 일치.**
- ※ 폰트 CDN 2건(`cdn.jsdelivr.net`·`fonts.googleapis.com`)은 이 컨테이너의 이그레스 차단이라 집계에서 뺐다.
  실제 GitHub Pages에서는 정상이고 이 세션의 코드와 무관하다.

## 진행 기록 — 2026-09-19 4차: 자석 단원 v2 (화면 + 교재)
- 주소: `/science-lab/v2/#/s41-u01/1` (v1 15유닛 사이트는 그대로). 파일: `v2/index.html · v2.js · v2.css · lab-ring-tower.js`, 장면 `scenes/ring-tower.js`, 5E 구성 `data/units/s41-u01.lesson.js`(문항은 `s41-u01.js` items를 id로 참조), QR `assets/qr-s41-u01-kit.svg`.
- 흐름: ①궁금(3D 고리 자석 탑 자동 재생 + 예상 3지) ②실험(가상 실험실: 고리 눌러 뒤집기 → 떠 있는 층·탑 높이 → 표에 적기 / 3D로 보기 / 집에서 실험: 준비물·쿠팡 검색 링크·QR·순서·안전) ③개념(내 예상 vs 결과, 내 기록 최고 탑, 비유, 빈칸 카드 4·표 채우기·잠깐 확인) ④확장(읽을거리 + 영재성 3 + 탐구보고서) ⑤점검(3문항, 2/3 통과, 실패 시 "다시 풀기"가 주 버튼·보기 섞기).
- 탐구보고서 `#/s41-u01/report`: 9칸, 궁금한 점·가설·준비물·과정·결과(실험실 표)는 자동 채움, 기기에 저장, A4 인쇄. 준비물 페이지 `#/s41-u01/kit` = QR 도착지.
- 교재 `#/s41-u01/print/student|teacher|answers`: 개념 정리 → 실험(QR·순서·안전·결과표) → 탐구보고서 1쪽 → 교과 문제 → 영재성 문제 → 정답·해설. 교사용 A4 11쪽.
- 진도 저장 localStorage `sciLab.v2`. 검증: Playwright 390·320px × 12경로 콘솔 에러 0·가로 넘침 0, 실험실 기록·빈칸·관문·재도전·인쇄 PDF 확인. `bank/audit.mjs`는 `*.lesson.js`를 건너뜀.
- 남은 것: 쿠팡 로켓배송 대표 상품 URL(`coupangUrl` 지금 null → 검색 링크), 홈 탐구 지도(v2 "지도로"는 아직 v1 홈), 원본 그림 업로드, 다음 단원.

## 진행 기록 — 2026-09-19 3차 (Cowork 세션)
- 단원평가 4-1 Ⅰ 세트1 + 정답 및 풀이: **스캔본 확정**(텍스트 층 0, PyMuPDF). 페이지를 렌더해 Claude가 직접 전사 → 20문항 공식 정답과 20/20 일치.
- 원문·정답 → Supabase `public.science_bank_source`(프로젝트 fgahqumaldheqettmvqg) 20행. `source_key = gfield-science:cats-set1:4-1:u01:set1:q{n}`. RLS on·정책 없음(서비스 키 전용, `golden_bell_answer_books`와 같은 패턴). 원본 그림은 `figures` 비어 있음(`visualModel.figure:'pending-upload'`) — MCP로는 이미지 업로드 불가.
- git → `data/units/s41-u01.js`: **authored 20문항**(cloze 6·table-fill 1·single-choice 10·written 3). 객관식 정답 위치 ③①⑤②④②⑤①③④(각 2회), 정답이 유일 최장 보기인 문항 0. 창작 그림 2개(SVG, 초기 상태만).
- `assets/` **반입 완료**(커밋 85760c6, GitHub 웹 업로드): `docssam.png`(원본) + 표정 webp 9개. 말하기 = 몸 `docssam-A1-mouth-closed.webp` 위에 `face-A2~A5-*.webp`를 left 31.25%·top 13.021%·width 33.203%로 겹침. 반응 = `docssam-B1~B4-*.webp`로 몸 전체 교체.
- docssam 표정 9장 반입(GPT 생성, 사용자 G드라이브 `docssam 표정/`): A1 몸 고정 + A2~A5 얼굴 조각(말하기 3·깜빡임 1, SIFT 정렬 오차 <1px), B1~B4 반응. 웹용 webp는 `docssam 표정/web/` 9개(≈560KB). 말하기 = 음절 모음(ㅏㅓ→크게, ㅗㅜ→동그랗게, 그 밖→반쯤).
- 폰트 확정: 말풍선·제목·버튼 **Gaegu 700**, 본문 Pretendard.
- **자석 단원 문제은행 완성(원문)**: Supabase `science_bank_source` s41-u01 세트1~4 = 80행, 전부 공식 정답 대조, `taxonomy.grade=4·level=기본·track=교과`. 원본 그림은 아직 `pending-upload`.
- **자석 단원 창작 문항 26**(git): 기본 10·심화 10·영재 6 / 교과 20·영재성 6. a10(자석 자르기)은 단원평가 세트2 해설 범위라 심화. a21~26 추가(철가루 무늬·자기부상·아이디어 발산·극 찾기·나침반 지도·나침반 오차). `bank/audit.mjs` 통과.
- 실험 주제 목록 `data/experiments.md`(사용자 제공 키트 목록표 → 과학 원리 있는 379개를 단원별로, 주제만).
- 사용자 결정: 영재성은 과학·창의성만(수학 제외) · 학년·나이에 맞게(`DESIGN.md` 학년·수준 규칙) · 교재 출력 · 전 단원 문제은행.
- 남은 것: 어댑터 등록(`bank/science-bank-adapter.js`), 원본 그림 업로드, 5E 콘텐츠(`unit.engage~evaluate`), 인터뷰 3~9.

## 지금 상태
- 브랜치 `claude/jolly-allen-w57yqh` (main 미병합). `/science-lab/` 1차 버전: 지도자료 차례 15유닛, 개념→3D→탐구→토론→확인, Playwright 검증 통과.
- 재설계 규격 `DESIGN.md` **초안·승인 전**. 5E 탐구 순환(궁금→실험→개념→확장→점검) + **단원 축을 Drive `과학 단원평가` 폴더로 교체** + **단원 파일 = 문제은행 DB**.
- 교과 순서 지도 `data/source-toc.md` 완성: 단원 축(8학기×단원) · 지필드 이론편/실험2 ↔ 단원 매핑 · 교재 구조 · 원문 차례 전문은 `data/toc/*.md`(이론 3~4·5~6·7~9, 실험 3~4·5~6·중등).
- 사용성 점검 기준선 `UX-TEST-2026-09-19.md`.

## 사용자가 정한 것 (누적)
- 콘셉트: **"실험으로 탐구하고, 개념으로 이해하고, 영재원으로 확장한다."**
- 캐릭터 **docssam**(그림 확인함: 남자아이 과학자, 흰 가운·남색 넥타이·태블릿·PHYSICS 책, 표정 1장). 이론 화면에 크게.
- **단원 = Drive `과학 단원평가` 폴더**("이게 현재 단원이야"). 이것이 **문제은행 DB로도** 돼야 한다.
- 문항 계약은 저장소 스킬 `gfield-science-question-bank`(브랜치 `codex/golden-bell-semantic-workbook`)를 따른다.
- 지필드 이론편·실험2는 **라이선스 없음** → 원문 사용 가능. 화올 최종교재는 제외.
- 참고: 지필드 강의 슬라이드 `NEW STUDY Ⅰ 고체·액체·기체`(pptx) → 빈칸 개념 카드·정리표·Mini Test 패턴 채택(DESIGN.md).
- 작업 방식: 인터뷰 → 계획 → 승인 → 구현(gajae-code). 디자인 규격은 MengTo design-first-ui-prompting 형식.

## 클라우드 세션에서 진행하는 방법 (2026-09-19 확인 — 로컬 세션 불필요)
- **파일 반입은 채팅 첨부로**: 클립 아이콘으로 파일을 붙이면 `/root/.claude/uploads/<세션>/`에 그대로 저장된다(pptx가 이렇게 들어왔다). 이미지는 **붙여넣기 말고 파일 첨부**(붙여넣은 이미지는 디스크에 안 남는다). Drive 직접 다운로드는 프록시 차단(403)이라 안 된다.
- **PDF 도구는 이 환경에서 설치된다**: `pip install pymupdf`(텍스트 PDF 추출·페이지 렌더), `apt-get install -y tesseract-ocr tesseract-ocr-kor`(스캔본 OCR). 둘 다 pypi·apt가 열려 있어 바로 된다. 정확도가 중요한 문항은 페이지를 PNG로 렌더해 Claude가 직접 읽고 전사한다.
- 매 세션 다시 깔지 않으려면 claude.ai/code → 환경 → 설정 스크립트에 위 두 줄을 넣는다.
- 순서: ① `docssam science.png` 첨부 → `assets/docssam.png` ② 4-1 Ⅰ 자석의 이용 `세트1.pdf` + `정답 및 풀이.pdf` 첨부 → 추출·전사 → Supabase `science_bank_source`(원문·정답) / git엔 `authored` 문항 ③ `DESIGN.md` 인터뷰 3~9 답 확정 → 구현.

## 클라우드 세션에서 못 한 것과 이유
- 캐릭터 파일 저장소 반입: 붙여넣기 이미지는 디스크에 안 남음 → 파일 첨부로 해결.
- 단원평가 PDF: Drive 텍스트 추출이 낱글자 몇 개뿐(폰트 인코딩 문제 또는 스캔본, 미확정). 파일을 첨부하면 PyMuPDF·Tesseract(kor)로 처리 가능(설치 확인됨).
- pptx 슬라이드 렌더링: soffice가 30MB pptx 로드 실패, pdftoppm 없음 → 텍스트와 미디어 파일로만 파악(충분했음).
- 실험편 PDF 텍스트가 모두 32쪽(4번 실험)에서 끝남 — 단계당 4실험이 실제 구성으로 보이나, Drive 변환이 32쪽에서 잘렸을 가능성은 실물로 확인 요망.
- 이론편 3-2-2단계는 원본 앞부분 삭제(파일명대로) → Ⅰ·Ⅱ 단원명 미확보.

## 산출물 링크(이 세션)
- 3D 샘플(뚝배기, 독립 실행): https://claude.ai/artifact/R8WeG5f5pKcZUtyuXxbAd6
- 사용성 점검 보고서: https://claude.ai/artifact/96q99YfXtCEU4dYZE39jhz
