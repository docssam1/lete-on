# 수의 마법 정식 서비스 준비 점검 — 진도·난이도·배차 (2026-11-03)

## 무료 보안 보강·실사용 점검 — 2026-11-06

원장 결정은 **Supabase Free 유지, 새 가입 대신 기존 계정으로 로그인·문자 확인**이다. 따라서 새 계정 가입을 다시 통과했다고 보고하지 않는다.

- 서버 인증 설정에서 **Secure password change ON**, 비밀번호 최소 길이 **6→8자**를 저장하고 설정을 다시 열어 확인했다. 이메일 확인·안전한 이메일 변경·OTP 8자리/600초는 유지했다. 기존 비밀번호를 에이전트가 읽거나 바꾸지 않았고, 원장이 이메일 OTP 후 새 비밀번호를 직접 입력·저장했다.
- **유출 비밀번호 차단 경고는 남는다.** [Supabase 공식 문서](https://supabase.com/docs/guides/auth/password-security)의 Pro 전용 기능으로, 무료 요금제에서 활성화를 저장할 수 없었다. 최근 로그인 요구·최소 길이는 별도의 무료 보강이며 유출 검사와 동등하다고 주장하지 않는다. 유료 전환·결제·비용 한도 변경 없음.
- 실제 인증 메일 **1건**을 보냈고 Gmail INBOX 수신을 확인했다. 원장의 인증·비밀번호 저장 후 앱에서 이메일 인증 완료·휴대폰 문자 동의·30일 체험을 확인했다. 원장이 학생을 직접 연결했으므로 별도 검수 학생을 추가하지 않았다.
- 관리자 문자 미리보기에서 `settings_required`가 일반적인 이메일·학생 충돌로 잘못 안내되는 문제를 발견했다. 저장 전 시작값을 「저장 전 예시」로 구분하고, 시작 과정·회차·시작일 저장을 안내하도록 수정했다. 저장 후 예시 표시를 해제하며 서버 오류 원문은 여전히 화면에 반사하지 않는다. 관리자 실제 브라우저 **64검증**, 회원 처리기 **46/46** 통과. 기존 187개 전체 재실행 뒤 이번 영향 검사만 다시 실행한 것이며, 전체 187개를 이번에도 새로 실행했다는 뜻은 아니다.
- 검수 계정의 현재 출발점 **C1·1회차 / 속도·학습량 1배 / 주1회 / 시작 2026-11-06**을 관리자 설정으로 저장했다. 학년은 임의로 만들지 않았다. 학습 설정 저장은 완료 학습·진단 답을 지우지 않는다.
- 수신 번호를 대조하고 실제 공유 링크가 정상 열리는 것을 먼저 확인한 뒤 **LMS 1건만** 전송했다. 최초 화면은 대기열 접수였으며, 이후 DB의 알리고 응답에서 **HTTP 200 / result_code 1 / 성공1·실패0 / reconcile true** 확인. 휴대폰 도착·휴대폰 링크는 원장 확인 대기이며 사업자 성공을 최종 수신 확인과 혼동하지 않는다. 재전송 없음.
- 같은 링크에서 **C1 1회차·60문항·24쪽**, Chrome **A4·배율 기본·쪽당1면**, 배경 ON·브라우저 머리말 OFF를 확인했다. 저장 단축키 제어 중단 후 폴더 메뉴 방식으로 바꿔 PDF 저장을 마쳤다. 출력 PDF는 1,998,448바이트이며 24쪽 전부 A4·빈쪽0·브라우저 머리말0, 본문23쪽 텍스트와 표지 이미지 및 전체24쪽 렌더를 확인했다. **실제 종이 출력은 하지 않았다.**
- 무료 사용량도 확인했다(이번 주기 10/20~11/20, 최대1시간 지연 가능). 저장공간0.736/1GB·DB0.051/0.5GB·전송0.154/5GB·함수6,969/500,000으로 표시된 항목은 한도 안이다. 유예 종료 배너는 한도 초과 시 제한된다는 뜻이며 현재 초과를 뜻하지 않는다.
- [상태·설정·발송 근거](security-acceptance-20261106.json), [추가 검사 로그](security-acceptance-evidence-20261106.zip). 공개 기록에는 실제 이메일·전체 전화번호·비밀번호·인증번호·공유 토큰을 넣지 않는다. UI 수정 main [`11fce8f93`](https://github.com/docssam1/lete-on/commit/11fce8f933e9e4e734d6f10c390369c2ce7ac004)은 첫 Pages42114886145 취소 후 뒤 main에 포함된 [Pages42115126582](https://github.com/docssam1/lete-on/actions/runs/42115126582)에서 배포 성공했다. 운영 admin.html·app/admin.js 두 파일이 검증본과 바이트 일치한다. 모델은 GPT-6.1 Sol 유지, 새 에이전트 없음.


## 최종 재점검 — 2026-11-06 (Mac Codex / GPT-6.1 Sol)

**기술 검사 기준으로 제한 운영을 시작할 수 있다.** 기존 187개 검사 전체 실행 후 수정 영향 항목을 재검한 최신 결과는 **187 통과 / 0 실패**다. 전면 개방 확정에는 실제 보호자 가입 → 이메일 인증 → 전화·동의 등록 → 개인 학습지 문자 수신 → 링크·인쇄까지 한 번의 실사용 확인이 남아 있다. 이번 감사에서는 실제 이메일·문자를 보내거나 학생 기록을 쓰지 않았다. 자동 검사 통과를 실제 아동 수행 검증이나 모든 기기의 무오류 보장으로 해석하지 않는다.

- [187개 항목별 결과·명령](final-check-results-20261106.json), [첫 실행·최종 재검 로그 ZIP](final-audit-evidence-20261106.zip), [최신 결과표](check-results.txt), [서버·DB 배포 증거](final-deployment-20261106.json). 아래 11/05·11/03 기록은 당시 상황이며 현재 실패 목록이 아니다.
- 이전 표의 재시도 포함 234행을 고유 검사별 마지막 결과로 정리하면 **128 통과 / 59 실패**였다. 이번에는 187개를 재실행했고, 수정 후 영향받는 검사를 다시 실행했다. 같은 시각에 한 번 실행한 결과로 합치지 않고 첫 실패 로그도 보존했다. 현재 승인된 만화풍 마을에 맞지 않는 3D 전용 2개 검사는 현재 2D 이동·마을 검사로 대체하고 역사 모드는 `--legacy-3d`로 보존했다.
- 실제 수정: 수 그림 풀이 예시(NL28·30·36·37·41), 아래로 채우는 수 피라미드, 로그의 진수 표시, 분수 안 쓰기칸 여유, C4 인쇄 겹침, 유아 영어 화면 답칸, 한국어 조사·어조, 녹음과 달랐던 영·중문 축하 문구를 수정했다. 초3·4·5 진단 출발점을 실제 과정 5·12·17로 맞추고, 고등 과정 완료 예상의 중간 반올림과 로드맵 설명 펼침 상태 유실을 고쳤다. 소개 책의 74과정·10단계 적재 및 다국어·조작 겹침을 수정했다. 승인된 책·책상·마을·캐릭터 그림은 교체하지 않았다.
- 검사 도구도 현재 스크립트 그래프·미리보기 저장소·진입 방식·인쇄 매체에 맞췄다. Windows 전용 경로를 이식했고, 검사 중 누적 DOM·외부 폰트·불필요한 기다림을 줄였다. 유한한 문제 풀이 12개보다 작은 경우는 명시적 제외로 기록하며, 실제 편성 수량 검사는 별도로 유지했다. 정답·넘침·권한 검사를 유지했다.
- 인쇄: **1,327레벨 / 3,931인쇄 세트**, 유한 풀 요청 50개 명시적 제외. 실제 편성 **2,390장(0.7~1.5배)**, 주간 **148/148**, 진단 A4 **510장** 통과. 398회차 텍스트 재생성·strict 검사에서 조사·조판 오류 0. 일차 문항 수 경고 **19개**, 단순 답 배열 경고 **3개**는 남는 진단 경고다. 개념/쪽 단위 배분을 포함하므로 문항 수만 같게 만들려고 페이지를 쪼개지 않았다.
- 화면: 558개 상호작용, 조작 활동 32조건, 소개 책 4화면 크기 및 3언어, 가입·학년·12개월 계획 4조건 통과. 작은 가로 화면 등은 읽기 가능한 스크롤 방식이며 모든 화면이 무스크롤이라는 뜻은 아니다. 음성 803 MP3 해독 및 계획된 800개 고유 음원·3언어 재생/정지/전환 검사 통과; 발음 전 문장을 사람 귀로 재심사했다는 뜻은 아니다.
- 서버: **nm-membership v8 ACTIVE / weekly-notify v26 ACTIVE**, v26의 index.ts·deno.json·delivery-runtime.mjs를 배포 후 내려받아 로컬과 세 파일 모두 일치 확인. 회원 처리기 **46/46**, 발송 처리기 **9/9**, 실제 DB 회차·버전 계약 **4,440/4,440** 통과. DB 함수 정의 MD5 `a0dc011a70680a81e2e0f54ef1240049`. 표준 과정 자동 넘김도 이미 적용된 동작을 검사했다. 이번 DB 검증은 읽기 전용이다.
- 보안 권고: 신규 ERROR 없음. 직접 접근을 차단한 서버 전용 표 등의 정책 없는 RLS INFO 59건, 공용 Supabase 프로젝트의 [유출 비밀번호 차단 설정](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection) 비활성 WARN 1건은 기존 상태다. 다른 서비스도 쓰는 공용 설정은 임의로 바꾸지 않았다. [RLS 권고 설명](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy).
- 웹의 캐시 버전은 `20261106-release-audit`로 갱신했다. 웹 원격 커밋·Pages 성공·운영 파일 대조는 배포 확인 기록으로 별도 확정한다. 모델 전환·새 에이전트·음성 제작·Drive 업로드 없음.

### 웹 배포 확인 완료

- 실행 코드는 main [`ebedd9065`](https://github.com/docssam1/lete-on/commit/ebedd9065a6c2a2b207bebd40efd081d7c283372), [Pages 42107737361](https://github.com/docssam1/lete-on/actions/runs/42107737361) 성공으로 운영 반영했다. 다른 프로젝트의 동시 main 변경을 병합해 보존했고 강제 푸시하지 않았다.
- 운영 파일 **24/24 바이트 일치**. 실제 주소에서 로그인, C17 추천→초5 선택→월별 로드맵, C0·C4·C60 학습지 **5조건**을 열어 HTTP 200·자바스크립트/수식 오류 0 확인. 모든 비 GET 요청은 차단했고 실제 발송·학생 기록 쓰기는 없었다. 대표 화면도 직접 확인했다.
- 배포 뒤 함수 목록에서 회원 **v8**, 발송 **v26** ACTIVE를 다시 확인했다. [운영 검증 24파일·5화면 상세](release-verification-20261106.json). 이 확인 기록은 코드 배포 뒤의 문서 전용 커밋으로 보관한다.

## 과거 기록 — 아래는 해당 날짜 당시의 상태


## 최신 상태 — 2026-11-05 (Mac Codex / GPT-6.1 Sol)

**회원 관리 함수와 DB 기준 배포 완료.** 아래 「통과129/실패58」은 11/03 당시 요약이며 현재 전체 프로그램의 재검 결과가 아니다. 최신 실행 항목은 `check-results.txt` 맨 위 날짜별 칸과 개별 로그를 본다. 원본은 재시도 포함 234행/187개 고유 검사라 마지막 행만 집계하면 128/59로도 달라진다. 전체 187개를 새로 실행했다고 주장하지 않는다.

- `nm-membership` **v8 ACTIVE**. 배포 후 내려받은 index.ts·handler.mjs·course-limits.json 세 파일이 검증한 소스와 정확히 일치. 실제 HTTP에서 미인증 status 401, 잘못된/없는 링크 404 확인.
- DB `nm_private.canonical_delivery_plan`만 원격 migration `nm_delivery_curriculum3_bounds`로 갱신. C29=10/C30=7/C31=12/C32=10, 새 `20261104-curriculum3`를 검증·보존. 버전 없는 기존 계획은 계속 지원하고 명시한 옛/알 수 없는 버전은 거부.
- 실제 DB 4,440조건 전부 통과: 74과정×5속도×주1/2×6조건(현재 마지막 회차·버전 미표시 허용 / 초과·0회차·옛/미상 버전 거부). 따라서 C31 12회차는 허용, C29 11회차는 거부.
- 처리기는 personal2/current managed v2를 보존하며 기존 personal1도 별도로 지원한다. 구버전 링크에 새 교육과정 정보를 섞으면 거부한다. 화면과 같은 기준으로 확인.
- 처리기 전체 **46/46 통과**. 옛 7개 실패는 짧은 링크 검사에서 실제 공용 decoder를 불러오고, 새로 생성한 PDF 링크의 버전 기대값을 현행으로 갱신해 해결. 구버전·잘못된 버전 거부 검사는 유지. 배포 workflow도 일부 선별 대신 전체 처리기 검사를 요구하도록 변경.
- DB의 기존 public RPC가 이미 personal2/v2를 발급하고 있어 해당 실제 정의를 schema.sql에 동기화했다. RPC는 덮어쓰지 않았으며 학생·회원·연락처·기존 발송 이력도 수정하지 않았다. 변경 전후 보안 권고 2개 동일, 신규 권고 0.
- 개인 학습지/버전/편성/진도/회원 클라이언트/문자 모의 검사와 서버 번들 검증 통과. 앞선 표지·인쇄 미완료 3검사도 11/05 통과(별도 cover-review 기록).
- 배포 증거 `membership-deployment-20261105.json`, 실제 적용 SQL·읽기 전용 재검 SQL, HTTP·처리기 및 관련 검사 로그를 같은 폴더에 보관.
- **아직 별도 확인할 것:** 실제 보호자 번호 시험 문자 1건 및 11/03 실패 중 이번에 재검하지 않은 화면·내용 항목. 이번 작업에서 문자 발송은 하지 않았다.


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
