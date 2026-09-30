# Numbers of Magic 광고 책

이 폴더는 광고 표현 계층입니다. 과정·회차·생성기·인쇄 원본은 이 작업에서 변경하지 않았습니다.

## 사용자가 확정한 방향

- 학원 이름/선발 트랙 비교보다 교과·사고력 수학을 위한 연산과 언어사고력을 보여 준다.
- 유아 체험은 단순한 5=2+3 대신 **구슬 10개를 두 친구에게 똑같이 나누기(3:7→5:5)**로 변경했다. 초등 체험은 **곱하여 10이 되는 수**이다.
- 광고 로드맵에서 주 1회/주 2회 진도 속도를 바꾸어 볼 수 있다. 기간 예시는 정본 단계 데이터의 weeks/meta에서 읽으며 학생 설정을 저장하지 않는다.
- 진도 속도와 문항량을 각각 0.7–1.5배로 조절할 수 있다는 안내는 실제 앱의 `roadSpeed`, `roadAmount`, `ROAD_MULTS_LIST`에 근거한다. 광고의 주 1/2회 버튼은 주간 빈도 미리보기이고, 별도 속도 배수 설정을 저장하는 버튼이 아니다.
- 유아 똑같이 만들기 체험은 앞쪽 발견 장에 유지한다. 별도 체험 장에는 **왼쪽 중등 반비례, 오른쪽 고등 미적분을 한 페이지씩** 둔다. 휴대폰에서는 중등/고등 페이지를 전환한다. 유아 체험을 이 장에 중복하지 않는다. 유·초·중·고 실제 학습지 발췌는 모두 유지한다.
- 설명을 길게 나열하지 않는다. 실제 조작 → 실제 종이 학습지 → 상담으로 연결한다.
- 기존 두 소개 영상과 오른쪽 미리보기·배경음을 보존한다. 다운로드 CTA를 추가하지 않는다.
- 표지를 펼치면 **맨 먼저 전체 소개 영상(2분 10초)이 양쪽 두 페이지에 재생**된다. 한쪽 세로 미리보기 장을 거치지 않는다. 차례는 영상 → 발견(기존 교구·세로 미리보기) → 체험 → 마을 → 학습지 → 로드맵이다. 표지를 다시 열어도 전체 영상을 처음부터 시작한다.
- 소개 영상 장은 양면 전체가 원본과 같은 16:9가 되도록 뷰포트 안에서 책 크기를 맞춘다. 영상을 자르거나 늘리지 않으며, 재생 조작부는 지면 아래 별도 행에 두어 합성된 자막을 가리지 않는다. 다른 장과 첫 장의 세로 미리보기는 기존 크기를 유지한다.

## 파일과 연결

- `index.html`, `book.css`, `book.js`: 책, 양면 영상, 탐색, 학습지 확대, 실제 데이터 기반 로드맵.
- `front-page.css`: 표지와 첫 장의 글꼴·위계. 표지의 세 안내 문구와 한국어 제목은 Nanum Pen Script, 숫자와 영어 안내는 Kalam, 중국어 안내는 Ma Shan Zheng 손글씨 글꼴을 직접 제공한다. 첫 장 본문은 Pretendard 가변 글꼴이다. 글꼴 출처·라이선스는 아래 기록 참조.
- `cover-math.js`: 2026-09-30 후속 지시로 **8+7 → 8+2+5 → 10+5 → 15**가 최종 순서다. 7이 실제로 2와 5로 갈라지고, 2가 8 옆으로 이동해 10으로 합쳐진다. 9.6초 루프이며 네 단계 모두 충분히 멈춰 읽을 수 있다. `about.html`의 금빛 별 분위기를 유지하지만 원본 3단계를 그대로 쓰는 구현은 이제 아니다. 책이 열리거나 탭이 숨으면 멈추고, 동작 줄이기에서는 전체 동치식과 설명 문구가 보인다. `about.html` 원본은 변경하지 않는다.
- `page-curl.js/css`: 국소 곡면의 접선을 적분해 PC 42개·모바일 32개 종이 띠의 위치·깊이·각도를 정한다. 1.4초 동안 하나의 불투명한 받침 위로 한 장만 넘어간다. PC 앞·뒷면에는 실제 지면, 모바일 단면 뒷면에는 무인쇄 종이를 사용해 다음 내용이 겹쳐 보이지 않게 한다. 완료·크기 변경·탭 숨김에는 복제본을 제거한다.
- `book.js` 표지 열기는 하나의 앞·뒷표지가 책등을 축으로 1.4초에 걸쳐 열리며 영상 장으로 이어진다. 영상과 다른 장 사이에서는 넘김 중 책 크기를 고정하고, 종이가 내려앉은 뒤 0.62초에 걸쳐 목적 크기로 이동한다. 영상 복제본도 실제 재생 프레임과 원본 비율을 유지한다.
- `../assets/promo/grimoire-emerald.webp`: built-in image generation으로 만든 비문자 표지 재질. 짙은 녹색 가죽과 금박 모서리만 이미지이며, 제목·원본 수식·로고는 실제 화면 요소다. 원본 PNG는 로컬 생성 폴더에 보존하고, 동일 이미지의 WebP(1080×1457)만 배포한다. 프롬프트: 아래 기록 참조.
- `experience.js/css`: 광고용 개념 교구. 기존 앱의 교육과정이나 학습기록을 수정하지 않는다.
- `lab-spread.css`: 중등·고등 독립 양면 구성과 휴대폰 단면 전환. 두 교구의 수·조각 설정은 서로 독립이다.
- `i18n.js/css`: 한국어·영어·중국어 광고 UI. 표지·탐색·체험·학습지 안내·실제 과정표·마을을 연결한다. `?lang=` → 광고 언어 저장값 `nmLang` → 한국어 순으로 선택하며 학생 진도 `nm_state_v1`에는 접근하지 않는다.
- `village.html/js/css`: 실제 `app/town3d`와 캐릭터를 재사용하는 읽기 전용 마을. 메인 앱·구형 2D 메뉴는 불러오지 않는다.
- `../assets/promo/samples-v4/manifest.json`: 실제 과정/회차/원래 쪽 번호/생성 코드 SHA와 발췌 근거.
- Three.js는 기존 `../../world-explorer/vendor/`를 사용한다. 로컬 서버도 저장소 루트에서 제공해야 한다.
- iframe 통신은 같은 origin 및 실제 frame source를 모두 확인한다. `nm-promo-active`, `nm-promo-ready`, `nm-promo-route` 계약을 사용한다.

## Claude 과정 작업과의 경계

과정을 개편하면 광고의 원본 데이터를 복제하지 말고 `NM_STAGES`, `NM_COURSE_SPEC`를 계속 읽는다. 학습지 발췌는 새 실제 출력으로 다시 만들고 manifest의 근거도 함께 갱신한다. HTML/CSS를 별도로 새 인쇄 시스템처럼 만들지 않는다.

현재 초등 발췌는 C8 1회차이다. 1–3쪽은 곱하여 10, 4–8쪽은 같은 회차의 나눗셈 문장형 연습 24문항이다. 이 24문항을 곱하여 10 문장제라고 부르거나 전 과정의 문항 수라고 일반화하지 않는다.

과정 담당에게 넘길 검토사항(광고 화면에 노출하는 문구가 아님):

1. C8 실제 출력에서 `2×5×11`과 `2×11×5`가 함께 산출된다. 기존 사용자 지시의 동일 변형 재선택 금지에 비추어 원본 생성기에서 검토한다.
2. C43 대표 미적분 회차는 별도 문장제/적용 세트가 없다. 향후 편성은 과정 담당이 결정한다.
3. 고등 원본 역사 지면에 `<b>`가 문자로 노출되는 항목이 있어 광고 발췌에서 해당 지면은 제외했다. 일부 수식의 평문 출력도 원본 인쇄 계층에서 검토한다.

## 검증

`node number_magic/scripts/check-promo-book.js`

`node number_magic/scripts/check-promo-languages.js`

언어 검사는 한국어·영어·중국어를 4개 화면 크기에서 확인한다. 표지 수식은 기본 설정에서 별도 클릭 없이 자동 반복하며, 실제 시간 경과와 숫자 이동을 함께 검사한다. 동작 줄이기를 사용자가 켠 환경에만 정적인 동치식을 제공한다.

Playwright는 공용 `scripts/lib/playwright.js`를 사용한다. 필요하면 `NM_PLAYWRIGHT`, `NM_CHROMIUM` 환경변수로 실행 환경을 지정한다. `NM_PROMO_ARTIFACTS`를 지정하면 증거 캡처를 남긴다.

검사 통과와 별개로 PC/390px/320px/휴대폰 가로 화면을 직접 본다. 책장 회전 중 3D 캡처, 각 조작 버튼, 문장제 실제 지면, 마을 왕복, 영상 재생을 확인한다. 실행하지 않은 검사는 통과로 보고하지 않는다.

## 언어 범위와 원본 매체

- 광고의 언어 선택은 실제 번역된 화면·조작 문구와 정본 과정 데이터의 언어별 제목을 사용한다.
- 기존 소개 영상과 실제 학습지 이미지는 **한국어 원본**이다. 영어·중국어에서는 이를 작게 명시한다. 번역 영상/학습지를 제작했다고 보고하지 않는다.
- 본 앱의 학생 언어 설정(`nm_state_v1.lang`)은 광고에서 바꾸지 않는다. 앱으로 전달하는 `?lang=`은 광고 내부 번역 완료와 별개의 연결 사항이며, 현재 본 앱은 이 쿼리를 읽지 않는다. 앱 진입 언어 자동 연결은 과정 담당과 별도 조정한다.

## 손글씨 글꼴 출처

Google Fonts 공식 배포에서 현재 표지 문구의 글리프만 받아 작은 웹폰트로 직접 제공했다. 라이선스 원문은 `assets/fonts/OFL-NanumPenScript.txt`, `OFL-Kalam.txt`, `OFL-MaShanZheng.txt`에 동봉했다. 전체 원본 TTF는 배포하지 않는다. 표지 번역 문구를 바꿀 때 글리프 누락이 없도록 서브셋도 함께 확인한다.

- [Nanum Pen Script](https://github.com/google/fonts/tree/main/ofl/nanumpenscript): `nanum-pen-cover.ttf`
- [Kalam](https://github.com/google/fonts/tree/main/ofl/kalam): `kalam-cover.ttf`
- [Ma Shan Zheng](https://github.com/google/fonts/tree/main/ofl/mashanzheng): `ma-shan-cover.ttf`

## 표지 재질 생성 기록

2026-09-30, built-in image generation. 새 이미지 생성이며 기존 교재·영상·로고를 수정하지 않았다.

> Create a single premium fantasy mathematics grimoire FRONT COVER MATERIAL texture for a real website book, portrait ratio approximately 0.74:1. Completely flat straight-on orthographic full-bleed texture, not a perspective mockup. Very dark emerald finely pebbled leather. Sophisticated finely tooled antique warm gold double border, delicate restrained Art Nouveau corner leaves, tiny star and mathematical compass motifs in corners only. Leftmost 6 percent darker polished leather hinge. Central 75 percent empty for HTML title and animated numbers. No text, letters, numbers, central illustration, book pages, multiple books, surrounding background or watermark. Soft neutral upper-left light; inviting high-end children's mathematics grimoire, not horror.
