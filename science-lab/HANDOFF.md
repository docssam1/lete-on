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

## 진행 기록 — 2026-09-20 5차: 자석 단원 분류 체계 · 유사문항 80 · 유형별 교재

`TASK-bank-taxonomy.md` 1~4단계. **3·4단계는 끝, 1단계는 성취기준 문장만 미확인, 2단계는 그림 자르기만 막힘.**

### 1단계 — 분류 체계 (완료, 단 성취기준 문장 미대조)
- `bank/taxonomy/s41-u01.json` 신설. Supabase 원문 80문항을 **실제로 읽어** 분류했다.
  내용 요소 4개(E1~E4) · **유형 14개(T01~T14)** · 형식 4종(선택형 38 · 단답형 35 · 표 1 · 서술형 6).
- 유형별 원문 수: T01 5 · T02 3 · T03 4 · T04 9 · T05 2 · T06 5 · T07 3 · T08 5 · T09 4 ·
  T10 4 · T11 4 · T12 9 · T13 14 · T14 9 = 80.
- 각 유형의 `source`에는 **세트·번호만** 적었다(원문 문장 없음 → git 공개 가능).
- ⚠️ **성취기준 문장은 못 채웠다.** 교육부 고시 2022-33호 [별책 9] 원문과 대조하려 했으나
  이 컨테이너의 이그레스 정책이 `ncic.re.kr`·`moe.go.kr`·`steam.kosac.re.kr`·`koreascience.kr`·
  `namu.wiki` 등 **국내 도메인을 전부 CONNECT 403으로 막는다.** 지시대로 추측하지 않고
  `{code, text: null, verified: false}`로 두었다. 코드(`4과09-01`·`4과09-02`)는 작업 지시서 값 그대로다.
  → 다음 세션에서 원문을 첨부하거나 로컬에서 열어 `text`를 채우고 `verified: true`로 바꿀 것.

### 2단계 — 원본 정리 (그림 자르기만 막힘)
- **Supabase 갱신 완료(80/80).** `item.taxonomy`에 `area·standard·curriculum·element·type·format`
  추가(기존 topic·concept·inquirySkill·level·track은 보존), `figures.block`·`figures.stem`·
  `item.visualModel.figure`를 분류 경로로 교체. 묶음 공통 지문은 **7개**(문항 15개가 공유).
  `figures.status: 'pending-crop'`로 아직 파일이 없음을 표시했다.
- **`science-src` 브랜치 푸시 완료**(커밋 `e5c386c`): `science-src/4-1/자석의 이용/index.json`
  (원문 80개 대응표) + 분류 폴더 14개 + `science-src/README.md`(이어서 할 일).
- ⚠️ **PNG는 못 만들었다.** `crop_blocks.py`는 원본 PDF를 **디스크에서** 읽는데,
  이 세션은 `drive.google.com`·`docs.google.com`이 막혀 있고(403) Drive MCP의
  `download_file_content`는 파일을 base64로 **대화 문맥에 실어** 주는 방식이라 2.4MB PDF에 못 쓴다.
  **Drive 폴더에 세트4 PDF도 없다**(세트1~3 + 정답·풀이 3개뿐 — 폴더 id `1rftc95Gl6E3Z735g2-Oulez490kPWA4m`).
  경로는 이미 Supabase와 `index.json`이 일치하므로 **파일만 제자리에 놓으면 더 고칠 것이 없다.**

### 3단계 — 유사문항 80 (완료)
- `data/units/s41-u01.js`에 `v001`~`v080`. 원문 1:1 대응(`sourceRef:{type:'similar', of:…}`),
  같은 유형·형식·난이도를 지키되 상황·물체·보기는 전부 바꿨다. **원문 문장 0줄, 원래 번호 노출 0건.**
- 정답 위치는 **쓰기 전에 배분**했다. `vchoice(…, correct, distractors, at, …)`가 정답을 지정한
  자리에 꽂아 넣으므로 보기를 고쳐도 위치가 흔들리지 않는다. 객관식 51문항 ①~⑤ = **10·10·11·10·10**.
- 창작 그림 4개 신설(`east-s-approach`·`east-of-n`·`north-n-approach`·`ring-tower-3`).
  전부 원본 도형. **렌더링해 눈으로 보고 2개를 고쳤다** — 세로 막대자석을 `bar()`를 90도 돌려
  만들었더니 160:32 비율이 그대로 서서 체온계처럼 보였고, 고리 자석 탑은 붙어 있어야 할 두 층이
  떠 있는 층과 구분이 안 됐다(이제 점선 + "떠 있음" 표시).
- 기존 창작 26문항(a01~a26)에도 element·type·format을 붙였다.
- **`bank/audit.mjs` 확장** — element·type이 분류 체계에 있는지, type이 맞는 element 소속인지,
  format이 목록에 있는지, `sourceRef.of`가 1:1인지, **유형별 유사문항 수가 원문 수와 같은지**.
  이 검사가 실제로 2건을 잡았다(`v049` 정답이 유일한 최장 보기, 정답 위치 12·9 쏠림). 지금은 통과.

### 4단계 — 교재 「유형별 문제」 (완료)
- `v2/v2.js` `pageBook`에 섹션 추가. **내용 요소 → 유형 차례**(분류 체계의 순서가 곧 교재 차례)로
  E 머리글 + 유형 코드·이름·문항 수 + 유형 설명 + 유사문항. 학생용은 빈칸, 교사용은 정답 표시.
- `pageBook`이 `async`가 됐다 — `bank/taxonomy/<단원>.json`을 `fetch`해서 이름·설명·차례를 얻는다.
  **파일을 못 읽으면 유형 코드만으로 묶어 계속 낸다**(교재가 통째로 비지 않게).
- **번호는 세 묶음(교과·영재성·유형별)을 통틀어 한 번만 매긴다.** 문제지와 정답지가 같은 목록
  (`printed`)에서 나오므로 어긋날 수 없다. 교과 1~20 · 영재성 21~26 · **유형별 27~106**.
- 기존 「문제 — 교과/영재성」은 창작 26문항만 싣도록 했다(유사문항은 유형별 섹션으로).
- 원본 그림은 공개 사이트에 싣지 않는다 — 유형별 섹션은 **창작 문항·창작 그림만** 쓴다.

### 검증
- `node bank/audit.mjs` **통과**. 유형별 원문 수 = 유사문항 수 **14/14 일치**, 미대응 원문 0,
  `sourceRef` 중복 0, 태그 누락 0, 번호 노출 0.
- Playwright 390px·320px × 10경로(인쇄 3종 + 5E 5단계 + 보고서 + 준비물):
  **콘솔 에러 0 · 가로 넘침 0**. 인쇄 PDF 3종 생성 확인.
- 문항 번호: 학생용·정답만 106개(중복 0, 오름차순), **교사용은 문제 번호와 정답 번호가 1~106 완전 일치**.
- ※ 폰트 CDN 2건(`cdn.jsdelivr.net`·`fonts.googleapis.com`)은 **이 컨테이너의 이그레스 차단**이라
  콘솔 에러 집계에서 뺐다. 실제 GitHub Pages에서는 정상이고, 이 세션이 만든 코드와 무관하다.

### 남은 것
1. **성취기준 문장 대조** — 고시 원문을 첨부하거나 로컬에서 열어 `standards[].text` 채우기.
2. **원본 그림 자르기** — PDF를 첨부/로컬에서 `crop_blocks.py` 실행 → `index.json` 경로로 이동 →
   전수 확인 → Supabase `figures.status`를 `ok`로. **세트4 PDF는 Drive에 없으니 먼저 확보할 것.**
3. 어댑터 등록(`bank/science-bank-adapter.js`)은 여전히 미착수.

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
