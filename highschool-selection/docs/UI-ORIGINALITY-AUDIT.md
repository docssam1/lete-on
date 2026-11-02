# 학생 UI 원본성·참조 감사

## 판정

**Clear with low-risk similarities — 확인한 범위에서 출시 차단 수준의 원본성 위험은 없습니다.**

기존 `hsmiddle`에서 로그인 → 서재 → 세로 시험지 → 답안 → 진단지라는 기능 문법은 재사용했지만, 현재 프로그램은 따뜻한 종이색·벽돌색·세리프 제목·중립 코드 중심의 별도 시각 체계를 사용한다. 기관 로고, 고유 문구, 성적표 색상, 레이더 차트, 원본 PDF 자산을 주변 앱 UI에 복제하지 않았다. 이 판정은 법률 판단이 아니라 아래 증거 범위의 제품 원본성 감사 결과다.

## 확인한 자료

| ID | 자료 | 역할 | 확인 범주 |
| --- | --- | --- | --- |
| REF-HSM-FLOW | `hsmiddle/login.html`, `library.html`, `exam.html`, `viewer.html`, `report.html`, `promo/index.html` | 재사용 가능한 기능 흐름 | 텍스트, 구조, 인터랙션, 화면 위계 |
| REF-SH-R01 | 보호 원본 `hwangso-high-round1-pdf` | 시험지 지면 보존 기준 | 지면 비율, 2단 구성, 원본 페이지 디자인 |
| REF-DP-SCORE | 사용자 제공 돌파 성적표(2026-08-20) | 진단 정보 구조 참고 | 문항별 ○/×, 과정·단원, 정답률, 요약 차트 |
| REF-HSM-DIAG | `hsmiddle/report.html` 진단 모드 | 황소 초등 대비 진단지 기능 참고 | 총점, 수행률, 코멘트, 인쇄 흐름 |
| CURRENT | `highschool-selection/promo`, `login.html`, `library.html`, `exam.html`, `report.html`, `shared/app.css`, `shared/report-page.js` | 현재 학생 경험 | 텍스트, 브랜드, 숫자, 자산, 구조, 인쇄 |

결정론적 인벤토리 검사는 현재 94개 파일과 참조 290개 파일을 비교했다. 정확한 파일 바이트 일치, 과거 blob 일치, 정규화된 문장 중복은 발견되지 않았다. 같은 `login.html`, `library.html`, `exam.html`, `report.html` 파일명은 기능 위치를 나타내는 일반 이름이므로 원본성 위험으로 보지 않는다.

## 관찰된 겹침과 조치

| 심각도 | 범주 | 현재 화면 근거 | 참조 근거 | 관찰된 겹침 | 다른 점 | 조치 |
| --- | --- | --- | --- | --- | --- | --- |
| Low | 구조 | `login.html`, `library.html`, `exam.html`, `report.html` | `hsmiddle`의 같은 기능 화면 | 이름+승인번호 로그인, 시험별 잠금, 세로 뷰어, 진단지라는 기능 순서 | 별도 색·타입·카드 위계, 중립 코드, 별도 채점 계약 | 기능 문법만 유지. 학생 문구를 비기술 표현으로 정리 |
| Low | 진단 정보 | `shared/report-page.js`의 총점·○/×·5축 수행률·코멘트 | REF-DP-SCORE, REF-HSM-DIAG | 수학 진단에 필요한 정보 항목이 같음 | 성적표 로고·보라색 표·레이더 차트·문항 표 조합을 복제하지 않고 자체 카드/바/번호형 ○/× 사용 | 상단 요약과 5축 카드로 재구성, 문항 번호를 인쇄에도 노출 |
| Clear | 시험지 | `shared/exam-page.js`, `.paper-page img` | REF-SH-R01 | 시험지 자체는 승인된 원본 지면을 그대로 표시 | 주변 UI와 워터마크는 별도 브랜드이며 원본을 재디자인하지 않음 | 필터·크롭 없이 세로 이미지로 보존, 직접 PDF 경로는 비노출 |
| Clear | 기관 정체성 | 프로모션 `public-exam-profiles.js`; 운영 화면의 SH/DP/WM/ED/DG/SM | 각 기관 자료 | 프로모션에서 비교 대상 기관명이 근거와 함께 등장 | 로그인·서재·시험·진단에는 기관명/로고가 없고 중립 코드만 표시 | 프로모션과 운영 화면의 경계를 테스트로 고정 |

## 범주별 확인 결과

- **텍스트:** `hsmiddle` 및 성적표의 고유 홍보 문구를 복사하지 않았다. 짧은 기능어인 “시험지 서재”, “답안 입력”, “진단 분석지”는 일반 UI 용어다.
- **브랜드:** 운영 화면에는 비교 대상 기관명·로고·상표 자산이 없다. 프로모션에서만 출처 등급과 확인 상태를 함께 표시한다.
- **숫자:** 40문항과 커트라인은 원본/공개 회차의 사실 데이터이며, 프로모션은 회차 맥락을 표시한다. 운영 판정에는 승인된 버전 규칙만 사용한다.
- **이미지·자산:** 현재 앱 UI에 참조 성적표 이미지, 기관 로고, 사람 사진, 동영상, 오디오를 포함하지 않는다. 정확한 파일 일치도 없었다.
- **구조·모션:** 일반적인 카드, 탭, 고정 헤더, 세로 스크롤을 사용한다. 참조의 보라색 표+레이더 조합이나 `hsmiddle`의 파란 임상형 레이아웃은 재현하지 않았다.
- **인쇄:** A4 인쇄에서 요약과 5축 수행률을 먼저 보여 주고, 처방과 문항 상세는 다음 페이지로 분리한다.

## 변경 사항

1. 서재에 `범위 확인 → 승인 상태 → 시험 응시 → 진단지 확인` 흐름을 추가했다.
2. 학생 카드에서 문항별 내부 오류·검수 이슈를 제거하고 준비 상태를 일반 문장으로 바꿨다.
3. 시험 화면은 원본 페이지 비율을 유지하고, 주변 앱 UI와 답안 패널을 별도 브랜드로 유지했다.
4. 진단지 상단에 총점·정답률·정답 문항 수·번호가 있는 ○/× 40칸을 통합했다.
5. 영역, 학년·학기, 단원, 세부 유형, 난이도를 분리해 한 화면에서 비교하도록 했다.
6. 근거 코멘트와 취약 유형 우선순위를 상단 가까이 배치하고 A4 분할 규칙을 보완했다.
7. 기관명 경계, 필수 진단 축, 원본 이미지 무변형, 인쇄 순서를 자동 테스트로 고정했다.

## 이력과 미확인 범위

- `highschool-selection`은 현재 Git에서 새 디렉터리라 과거 배포 blob이나 삭제 자산 이력이 없다.
- 사용자 제공 황소 초등 성적표 원본 파일은 이 작업 환경에서 고유 첨부 ID를 식별하지 못해, 동일 목적의 `hsmiddle/report.html` 구현과 사용자가 지정한 필수 항목으로 기능 비교했다. 해당 첨부를 다시 식별할 수 있으면 이미지 조합까지 추가 대조해야 한다.
- 라이브 운영 API 데이터가 없는 상태의 실제 학생별 진단지는 최종 브라우저 QA에서 재확인한다. 소스 구조와 결정론적 정적 검사는 확인했다.

## 검증 결과

- 전체 자동 검사: **135/135 통과**
- 운영 화면 기관명 비노출, 프로모션 근거 경계, 필수 진단 5축, 원본 이미지 무변형, A4 인쇄 순서를 별도 회귀 검사로 고정했다.
- 로그인은 데스크톱·모바일, 프로모션은 데스크톱 정적 렌더를 확인했다. 학생별 서재·진단지는 보호 API 세션이 필요한 화면이므로 최종 브라우저 QA 대상으로 남겼다.

## 출시 전 유지 조건

- 프로모션 외 학생 운영 화면에 기관명·기관 로고를 추가하지 않는다.
- 원본 시험지 페이지에 색상 필터, 크롭, 재조판을 적용하지 않는다.
- 공개 커트라인을 다른 지점·과정·회차에 재사용하지 않는다.
- 새 이미지·영상·폰트·다운로드 자산은 출처와 라이선스를 별도로 기록한다.

## 2026-11-01 · 학원 선택과 과정 소개 재설계

사용자 요청: 참고 이미지처럼 학원 이름을 먼저 나열하고 클릭하면 소개로 이동한다. 학원별 모의고사를 수업 상품으로 연결할 수 있도록 제대로 설계한다. 필요한 미설치 스킬은 설치한다.

### 화면 설계와 구현

- 첫 화면의 주 업무는 6개 학원 중 하나 선택이다. 큰 학원명, 준비 과정 요약, 과정 개수를 카드에 표시한다. 임의 순위 번호·캐릭터·학원 로고는 추가하지 않았다.
- 학원 선택 후에는 해당 학원 소개·준비 방향·과정 목록만 표시한다. URL 해시로 학원과 과정 선택을 보존하여 직접 링크·새로고침·브라우저 뒤로 이동을 지원한다.
- 과정 선택 후 모의고사 문항 수·우리 모의고사 시간·제공 상태와 `모의고사 → 진단 분석 → 보완 학습` 수업 구성안을 표시한다. 횟수·회당 시간·수강료는 미확정이며 임의 값을 넣지 않았다.
- 실제 학원 시험시간은 회차별 근거 안에서만 보여 준다. 모의고사 시간에는 `durationScope=our-sale-mock`인 값을 사용한다. 따라서 SH 110분은 표시하고, 같은 표지가 없는 WM의 100분은 우리 운영 시간으로 전환하지 않는다.
- 기존 standardPolicy.resolve를 재사용한다. 준비 중인 과정을 판매·신청으로 연결하지 않는다. 빈 신청 URL과 비HTTP(S) URL은 링크로 사용하지 않는다.
- 상세 근거는 학원 소개 안의 펼침 영역으로 옮겼다. 기존 자료 확인일·출처 등급·회차 설명을 유지했다. 이번 작업은 기존 자료의 최신성 재조사가 아니다.

### 시각 기준

- 배경 #F5F6F8, 본문 #182230, 보조 #566274, 종이 #FFFFFF, 구분 #D8DEE8, 주 행동 #2456C4. 공용 지필드 기준을 프로모션 body 범위에만 적용했다.
- 한글 시스템 산세리프를 사용한다. 제목은 36–62px, 본문 16–18px, 보조 12–14px를 기준으로 한다. 첫 화면은 학원명과 선택 영역을 중심으로 구성하고, 부가 자료의 강조를 낮췄다.
- 데스크톱 3열, 태블릿·390px 모바일 2열, 360px 미만 1열. 모바일 소개·과정 상세는 1열이다. 44px 조작 영역·명시적 선택 체크·키보드 초점·모션 감소 환경을 지원한다. 실제 기기 화면 검수는 아래 미확인 사항과 구분한다.
- 수정: promo/index.html, 신규 promo/promo.css. shared/app.css의 이전 턴 변경은 보존했다. DB·시험 공개·배포·가격 설정은 변경하지 않았다.

### 스킬 확인과 설치

Mac의 Codex에서 기존 사본을 검토한 뒤 사용했다. gfield-design-system 및 ui-ux-pro-max의 브랜드·접근성 기준을 우선하고, 외부 생성 도구·유료 API·자동 게시 절차는 실행하지 않았다.

| 스킬 | 원본 / 설치 | SKILL.md SHA-256 |
| --- | --- | --- |
| frontend-design | Anthropic 공식 https://github.com/anthropics/skills/tree/main/skills/frontend-design · 기존 ~/.hermes/skills/frontend-design 사본을 ~/.codex/skills/frontend-design에 복사, Apache-2.0 LICENSE.txt 보존 | d91970639e9f5c37682ac7ab60094d35f1c7c1f38d731bd56396563aee10c1d3 |
| design-first-ui-prompting | lete-on/.claude/skills/design-first-ui-prompting의 기존 문서 3개를 ~/.codex/skills/design-first-ui-prompting에 복사. 기본 예시의 워터마크 제거·추가 도구 사용은 적용하지 않음 | 5e3d4db0eb0ea983f2bedb90f28f358901c292388a7889e2f66ac133ceff743c |
| ui-ux-pro-max | ~/.codex/skills/ui-ux-pro-max 기존 설치 유지 | 1585a399fa3cc272d6039141b2d17126efa322938d2bcb1144387735978e8d7a |

설치 대상이 없을 때만 복사했으며 모든 파일의 바이트 일치를 확인했다. 설치 전 사본은 그대로 남아 있다. 신규 Codex 등록은 다음 턴에 인식되며 이번 턴에는 파일을 읽어 적용했다. 이 기록은 다른 공급자의 공동 검수나 새로운 외부 스킬의 도입 합의를 뜻하지 않는다.

### 확인 결과와 다음 작업

- 기존 공개 화면·카탈로그 보안·공개 근거·표준 시험지 정책 관련 4개 테스트 파일: 32/32 통과. 셸 PATH에 Node가 없어 기존 Node 런타임에서 정식 `node --test`를 실행했다.
- 별도 Node VM/DOM 대역 동작 확인: 6개 학원, 20개 과정 선택, 초기 화면·잘못된 경로 복귀, 미승인 과정 신청 차단, 빈 URL·스크립트 URL 차단, SH/WM 운영 시간 구분 통과. 실제 브라우저 검수의 대체 결과로 표시하지 않는다.
- 브라우저의 file URL 접근 제한으로 실제 데스크톱·390px 렌더, 실제 키보드 포커스·뒤로 이동은 미확인이다. 다른 경로로 해당 제한을 우회하지 않았다.
- 다음: 허용된 미리보기 환경에서 화면 검수, 기존 근거의 모집 회차 최신화, 과정별 수업 횟수·시간·가격 확정. 출시·DB 반영·Drive 동기화는 수행하지 않았다.

### 2026-11-01 · 공개 소개 배포 준비

사용자의 `배포` 지시에 따라 최신 origin/main(da08b2d003ae7f0187786885c1026fa0c64ef9a8) 기반 codex/highselect-intro-release-20261101 작업본으로 소개 HTML·전용 CSS를 이식했다. 이전 작업 브랜치 전체 및 shared/app.css를 덮어쓰지 않고 최신 메인의 공용 스타일·운영 코드를 유지한다. GitHub Pages의 기존 배포에 명시적 허용 목록 staging을 추가한다.

- 공개 산출물은 소개·CSS·공개 메타데이터·입장 준비 안내·첫 화면 이동 등 9개 파일이다. 서버·문제은행·시험 원문·정답·관리자·검수 전용 데이터는 staging 대상이 아니다.
- 정적 Pages에는 운영 API가 없으므로 login.html은 실제 로그인 폼 대신 준비 안내를 제공한다. 운영 서버의 로그인 파일은 변경하지 않는다.
- 기존 4개 파일의 자동 검사 32/32, staging 9개 파일 목록과 HTML 내부 참조 검사 통과. 실제 배포 성공과 운영 URL 확인은 별도 후속 확인 대상으로 남긴다.
- 배포 주소: https://lete-on.gfieldacademy.net/highschool-selection/promo/

### 공개 배포 확인 결과

- 소개 배포 커밋: 7e66ab311450ec6da4cc05366351b9b13c1a0843, 원본 디자인 커밋: 25f8c6f12. 최신 main의 후속 커밋 7e643ce41에도 변경이 포함돼 있음을 조상 관계와 파일 비교로 확인했다.
- Actions 실행 41272518705의 실제 Deploy to GitHub Pages 단계는 success. 뒤이은 다른 작업의 배포가 시작돼 실행 전체는 cancelled로 표시됐다. 실패로 추정하거나 재배포를 반복하지 않았다.
- https://lete-on.gfieldacademy.net/highschool-selection/promo/ 기본 주소 HTTP 200, 새 제목과 소개 내용 확인. 공개 산출물 9개 모두 HTTP 200이며 로컬 staging과 SHA-256이 일치했다.
- DB·운영 서버·시험 공개 상태는 변경하지 않았다. Pages의 시험 입장은 준비 안내를 제공한다. 실제 브라우저 렌더·390px 시각 검수는 여전히 별도 확인 대상이다.

## 2026-11-01 - Reference color and copy correction

User rejected pale blue panels and requested the supplied reference: dark background, vivid mint/yellow/blue/pink/violet/orange portrait cards, large academy names and subtle rotation. Custom SVG mathematical solids replace child mascots. Colors indicate navigation only, not official academy identities. Academy intro headers inherit each selected card color; course detail panels use neutral tones.

Copy shortened: the home heading asks users to select an academy; the package heading names the lesson contents directly. No scope, round, time or release policy data changed.

Writing skill review: https://github.com/blader/humanizer/tree/v3.1.0 provides fact-preserving removal of inflated claims, filler and repetition. Existing Hermes humanizer is v2.5.1. No skill installed or overwritten. archep29/im-not-ai-humanizer requires scripts and agent orchestration and was not selected for short UI labels.

Checks: existing tests 32/32; VM checks cover 6 illustrated cards, 20 course routes and application restrictions. Live browser visual check follows publication.

## 2026-11-02 · Intro typography and navigation controls

Mac Codex, codex/highselect-intro-release-20261101. Skills: frontend-design, ui-ux-pro-max and GFIELD shared design rules. Connected the existing repository Pretendard variable font as a promo-local asset with its OFL license; the previous font-family declaration had no font source. Headings use clearer weight and less compressed Korean tracking. Login and academy navigation have 48px controls; portrait-card links include a bordered introduction action. Academy colors, logos, routes and release gates remain unchanged.

Checks: desktop and 390px browser render, six card routes, keyboard focus ring and no horizontal overflow; existing 15 policy/content UI checks pass. Public stage allowlist now includes the font and its license (17 files). Publication and final live screenshot are checked after this commit; protected exams and DB are outside this change.

## 2026-11-02 · Automated academy notices

User scope: main-page test/seminar notices, also visible within each academy. Latest correction permits Daechi and Bundang, with Hwangso strictly Daechi only. No same-name academy in Bundang is inferred from a directory search. Mac Codex on codex/highselect-intro-release-20261101; frontend-design, ui-ux-pro-max and ux-writing rules reused.

- Registry: scripts/notice-monitor/sources.json. Five existing official blog RSS feeds (sharpedu, dpmath, wonmath563, edenmath, won1934), plus official DailyStudy public test/seminar endpoints for master=Daechi and bundang=Bundang. The shared Dolpa channel requires branch identification in the title; Seocho/Songpa/etc. posts are excluded even when the body mentions Daechi. Identity evidence and branch restrictions travel with each source.
- Collection: Python standard library; no model calls, API keys, paid external extraction or browser sessions. Only titles, publication dates, original links, branch labels and brief explicit schedule facts are published. Image-only dates, implicit years and conflicting correction dates are not guessed. Older than 120 days and past structured event dates are omitted. Post dates remain labelled as publication dates, not event dates. A short RSS excerpt may omit later details; the original link is authoritative.
- UI: main and academy pages use data/academy-notices.js via promo/notices.js. Filters by academy, branch and notice type; eight rows initially with more on demand. Original channels are linked, including channels with no current public dates. No available slot/notice is not treated as a fetch failure.
- Schedule: .github/workflows/refresh-academy-notices.yml, KST 17:00 once daily (updated at the user's request on 2026-11-02). Only generated data may be committed. A bot push explicitly dispatches the existing Pages workflow, because GITHUB_TOKEN pushes do not trigger normal push workflows. On unchanged data there is no same-day commit or deploy. Push races fail safely without force. All-source failures preserve the feed and fail the run; partial failures preserve the affected source's prior records and last successful date. GitHub Actions may delay scheduled runs; check run results rather than promising an exact publication minute.
- Initial live collection: 9/9 source groups succeeded, 35 notices, repeat run reported changed=false. Bundang currently contributes the verified Dolpa channel; DailyStudy Bundang had no displayed available dates/sessions at collection time. Unverified Bundang counterparts of Won/Eden/Thinking Math remain unconnected.
- Checks: seven collector tests cover branch mix-ups, Hwangso exception, dates, malicious URLs, source identity, partial/all failures, closed dates/slots, and exact academy queries. Existing 15 policy/UI tests pass. Browser checked desktop, 390px, branch/category filtering, empty results, retained button focus, original links and academy-route integration. Live automation and deployment are verified after main publication. Public stage allowlist has 19 files; the collector, workflow, tests and registry are not copied into the Pages program directory. Protected exams, release policy and DB are unchanged.

### Notice monitor publication receipt

- Main feature commit: 311dc1f86b118406e12913cda8d9313a5897636d (local counterpart b0f12545f).
- Automatic collector run 41398202972 succeeded on GitHub, including branch/outage tests and all public sources; unchanged data correctly skipped a new commit/deploy.
- Pages run 41398278070 succeeded after concurrent main updates superseded earlier deployment attempts. Current HTML, notice renderer and scheduled workflow remained unchanged through those updates.
- Live URL https://lete-on.gfieldacademy.net/highschool-selection/promo/?v=notice-monitor-20261102 verified the main notice board and four upcoming seminar rows, branch policy labels, original links and no browser errors. Desktop and 390px preview checks passed; screenshot retained in the current Codex conversation.

### 2026-11-02 · Notice refresh frequency correction

User reduced the recurring check from three times daily to once daily at 17:00 Asia/Seoul. The workflow uses 08:00 UTC; the engagement metadata is consistent. Existing branch restrictions and publication behavior are preserved. Manual and code-change validation triggers remain available.

## 2026-11-02 · Existing mock exams connected

Mac Codex on `codex/highselect-intro-release-20261101`; Supabase, google-drive, pdf, frontend-design, ui-ux-pro-max and ux-writing guidance applied. Existing SH-R01 student v2 (40 questions, eight pages) and DP common-math-1 V14 (30 questions, eight pages) are preserved as page images. The new exam entry, library, answer panel and results UI uses the promo's bundled Pretendard, neutral surfaces, clear 46px+ controls and concise Korean labels. On small screens, paper/answers toggle without scrolling past all eight pages. A4 printing uses the existing page layout and opens only after all images load.

SH's high-selection course links to its released online round; DP's common1-basic course links to the distinct V14 pilot. Each displays its actual 110-minute mock specification. Other catalog rounds retain their existing gates. The public frontend contains no answer key or exam-page bytes. Protected Edge-function access, per-student grants, submission persistence and teacher review are documented in SERVER-DEPLOYMENT.md. Technical QA attempts are marked is_test and excluded from normal teacher results; they do not satisfy a real learner pilot or physical printing check.

Validation before publication: 7 new meaningful core checks plus 19 existing server-flow checks passed; 20 actual production API checks passed, including byte-for-byte verification of all 16 page images, two canonical submissions and denial of unauthorized access. Local browser connected to production verified both rounds, SH partial submission (one correct, 39 blank), 47 SH input slots, 30 DP inputs, 390px layout and no console errors. Existing 15 content/policy UI checks passed. The public staging allowlist has 21 files. Live Pages publication and screenshot are verified after the source commit; teacher sign-in with the user's actual password remains untested.
