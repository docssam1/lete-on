# Google Cloud 의존성 점검 — 2026-10-03 KST

## 결론과 확인 범위

- 기준: `main` 커밋 `71b382d94c95f061975f9d7941f323147356d818`, 공개 배포 화면, Supabase에 배포된 함수 소스, 2026-10-01 발송 Google 경고 메일 원문.
- ALGE(`gen-lang-client-0794247388`)의 Cloud Run 서버는 HTTP 응답을 반환한다. 그러나 **AI 생성은 이미 실패**한다. 서버 응답 여부와 Vertex AI 사용 가능 여부를 구분해야 한다.
- solve(`gen-lang-client-0329093850`)의 직접 참조는 로컬 전체 추적 파일과 연결된 `docssam1` GitHub 기본 브랜치 검색에서 발견되지 않았다. 미검색 저장소·브랜치, 외부 서버, 비밀 키를 통한 간접 의존성을 배제할 수 없다.
- Cloud 관리 API/콘솔의 프로젝트·결제 상태는 조회하지 못했다. 결제 내역, 중단 예정 시각, 현재 결제 복구 여부는 확정하지 않는다. 결제 설정·운영 secrets·배포는 변경하지 않았다.

## 경고 메일

ALGE와 solve는 각각 다른 결제 계정에 연결되어 있다. 두 프로젝트의 메일은 결제 계정 연체 또는 유효하지 않은 결제 정보로 관련 서비스가 정지될 수 있다고 알린다. 계정 경고에는 일부 서비스가 이미 영향을 받을 수 있으며, 결제 정보를 이미 갱신했다면 무시하라는 조건도 있다. 특정 정지 시각이나 현재 계정 상태를 이 메일만으로 확정할 수 없다.

메일 발송 표시는 10월 1일 미국 태평양 시간이며 한국 시간으로는 10월 2일 오전이다. 후속 검색에서도 결제 복구를 확인하는 관련 메일은 발견되지 않았지만, 이것이 미복구를 증명하지는 않는다. 개인 결제 계정 ID와 결제 수단 정보는 이 공개 문서에 기록하지 않는다.

## 실제 응답 (2026-10-03 03:09~03:13 KST)

서비스 기본 주소: `https://algebra2-gemini-proxy-v2-243382036810.asia-northeast3.run.app`

| 확인 | 결과 | 해석 |
|---|---|---|
| GET `/`, `/health`, `/api/openai`, `/identify-chat` | Express `Cannot GET ...` 404 | 서버는 도달 가능. GET 404를 서비스 정지로 해석하면 안 됨 |
| POST `/api/openai`, 빈 JSON | 400 `bad_request` | POST 경로 및 입력 검증 동작 |
| POST `/identify-chat`, 빈 JSON | 400 query/messages 필요 | POST 경로 및 입력 검증 동작 |
| POST 두 AI 경로, 개인정보 없는 짧은 `OK` 요청 | 둘 다 500; 내부 Google 403 `PERMISSION_DENIED`, `Lightning dunning decision is deny for project: projects/243382036810` | 생성 요청이 Google 상위 서비스에서 거부됨. 프록시는 이를 일반 인증 오류로 분류하지만, 원문 오류를 기록하여 구분함 |
| Supabase `alpha-prep-coach`, 가상 지문/가상 답변 1건 | 503 `coach_unavailable` | 실제 브라우저가 사용하는 코칭 경로도 실패함 |
| POST `/pdf-search`, 빈 JSON | 404 `Cannot POST /pdf-search` | 현재 서비스에 이 경로는 확인되지 않음 |
| 공개 `/personality/` | 200, 기존 ALGE URL 포함 | 배포 화면에도 직접 연결이 있음 |
| 공개 `/pdf-search/` | 404 | 현재 공개 경로에서 운영 기능을 확인하지 못함 |

Supabase 함수 `alpha-prep-coach`는 ACTIVE v7이고, 배포된 소스에도 같은 기본 URL 및 `ALPHA_PREP_COACH_URL` 재정의가 있다. ACTIVE는 상위 모델 정상 동작을 보증하지 않는다. 운영 환경변수의 실제 URL 값은 읽지 못했으므로 기본값 사용을 단정하지 않는다. 최근 24시간 관련 로그 문자열 검색은 결과가 없어 과거 실패율을 계산하지 않았다.

## 기능별 영향

| 기능 / 경로 | ALGE 장애 시 영향 | 남는 기능 |
|---|---|---|
| `personality/index.html` → `/identify-chat` | 직접 입력 AI 상담 답변 실패. 기존 코드는 실패에도 5회 한도에서 횟수를 차감하고 시간 제한 없이 대기 | 성향 설문, 결과 계산, 차트, 추천 질문의 미리 작성된 답변, 결과 인쇄 |
| `reading-world/alpha-prep/app.js` → Supabase `alpha-prep-coach` → `/api/openai` | AI 추가 질문·답변 개선·최종 보고서 보강 실패 | 기존 결정적 로컬 코칭·후속 질문·보고서·세션 저장·인쇄. OpenAI 기반 `alpha-prep-transcribe`는 코드상 ALGE와 별도 |
| `pdf-search/PATCH.md`, `pdf-search/index.html` | 배포 계획상 같은 ALGE에 의존하지만, 현재 코드 URL은 `XXXXXXXX` 자리표시자이고 실제 POST 경로·공개 페이지도 404 | 현재 정상 운영하던 PDF 검색이 ALGE 때문에 새로 고장났다고 단정하지 않음 |

추가로 `writing-feedback`의 **배포 소스**는 `GEMINI_API_KEY`로 Gemini API를 직접 호출한다. 이를 쓰는 화면은 Reading World Writing Village 및 `reading-world/share/sophie-stories/reader.js`의 Rainbow Pen 첨삭이다. 이 함수는 저장소 내 Cloud Run URL 검색만으로는 드러나지 않는 간접 경로다. API 키의 소속 프로젝트는 확인되지 않았으므로 ALGE/solve 영향은 **미확정**이다. 실제 학생 글을 보내거나 저장하는 첨삭 검증은 하지 않았다.

`GOOGLE_TTS_KEY`를 쓰는 오디오 제작 스크립트와 `GEMINI_API_KEY`를 쓰는 `scripts/build-bricks-250-levels.mjs`도 있다. 키가 해당 프로젝트에 속한다면 새 오디오·콘텐츠 생성이 영향을 받는다. 기존 MP3 및 이미지를 재생하는 것은 별도 경로이며, 키 소속을 확인하기 전에는 ALGE/solve의 확정 의존성으로 분류하지 않는다. 브라우저 자체 음성 인식은 외부 공급자 구현에 의존하므로 독립 동작을 보장하지 않는다.

## 최소 수정 (이 PR)

성향 상담만 변경한다. 정상 응답 계약과 기존 진단 계산은 유지한다.

- `personality/service-config.js`로 공개 상담 주소를 분리. 빈 문자열이면 원격 상담 요청을 중지하고 추천 질문을 안내한다.
- `fetch` 및 응답 JSON 읽기에 30초 abort 적용.
- HTTP 오류, 네트워크 실패, 시간 초과, JSON 오류, 빈 답변이면 질문 횟수를 복원하고 입력을 다시 활성화.
- 오류 상세·Google 내부 메시지는 사용자 화면에 노출하지 않음.
- 진단 재시작 전의 늦은 응답은 새로운 상담 세션에 답변·횟수 변경을 반영하지 않음.
- 성공한 AI 답변은 기존대로 질문 횟수에 포함. 추천 질문은 계속 무료.

Alpha Prep은 이미 `coach_unavailable` 및 로컬 대체 처리가 있어 코드 변경을 하지 않았다. 운영 중인 기본 주소를 미검증 다른 서비스로 자동 전환하지 않았다.

## 우회 및 복구 순서

1. **즉시 기능 축소:** 이 PR을 검토 후 배포하면 성향 상담 실패 안내·횟수 복원이 적용된다. `service-config.js`의 URL을 `''`로 바꾸고 배포하면 실패하는 AI 요청 없이 추천 질문을 사용할 수 있다. AI 답변의 실제 복구는 아니다. Alpha Prep은 현재 로컬 대체로 수업을 계속할 수 있다.
2. **Alpha Prep 주소 전환:** 정상 동작을 확인한 대체 서버의 전체 `/api/openai` URL을 Supabase Edge Function secret `ALPHA_PREP_COACH_URL`로 설정한다. 요청 계약은 `{ prompt, instructions, schema, maxOutputTokens }`, 응답은 `{ text }` 또는 기존 OpenAI Responses 형태이며 내부 텍스트는 `core.mjs`가 파싱하는 JSON이어야 한다. raw OpenAI API URL은 인증 헤더와 요청 형태가 달라 단순 주소 교체로 사용할 수 없다.
3. **성향 상담 주소 전환:** 승인된 대체 프록시의 `/identify-chat` 전체 URL을 `personality/service-config.js`에 설정하고 정적 파일을 배포한다. 요청 `{ query, systemPrompt }`, 응답 `{ candidates: [{ content: { parts: [{ text }] } }] }`와 사이트 CORS 허용이 필요하다. 공개 JS에 API 키·service-role 키를 넣지 않는다.
4. **대체 서버 선택:** ALGE 외부의 정상 프로젝트로 같은 프록시 계약을 재배포하거나, Supabase 등에서 다른 제공자 API를 위 계약으로 변환하는 서버 어댑터를 만든다. 동일한 제한 대상 프로젝트/키에 다시 의존하면 우회가 아니다. 새 서버·키·예산·권한을 확인하기 전에는 자동 생성·전환하지 않는다. 현재 확인된 정상 대체 엔드포인트는 없다.
5. **Writing Village 및 제작 스크립트:** 운영 `GEMINI_API_KEY`와 `GOOGLE_TTS_KEY`의 소속을 관리 콘솔에서 확인한다. 비밀 키 값 자체를 보고서·GitHub에 기록하지 않는다. 해당 프로젝트와 연결돼 있으면 키/프로젝트 전환 및 어댑터 검증을 별도로 진행한다.
6. **PDF 검색:** 먼저 별도 정상 서버에 `/pdf-search` 구현 여부와 CSE 키/CX를 확인하고 자리표시자 URL 및 페이지 배포를 완료한다. 현재 문서만으로 API가 배포됐다고 가정하지 않는다.

전환 전 가상 데이터로 양쪽 계약, JSON 파싱, CORS, 타임아웃·실패 시 로컬 대체를 검증한다. 전환 후 성향 추천 답변·성공 횟수·실패 횟수, Alpha Prep 전체 세션 및 출력물을 확인한다. 롤백은 이전 URL/secret을 복원한다. 실제 결제 조치는 소유자가 콘솔에서 확인한 상태에 따라 별도로 결정한다.

환경변수 관리 참고: https://supabase.com/docs/guides/functions/secrets

## 검증

- `node scripts/test-personality-chat-resilience.mjs`: 대체 주소, 성공, 추천 질문, HTTP/네트워크/JSON/빈 답변 오류, 타임아웃, 횟수 복원, 한도, 비활성 설정, 재시작 후 늦은 응답 통과.
- `node scripts/test-alpha-prep-core.mjs`: 통과.
- `node scripts/test-alpha-prep-content.cjs`: 10세트·20지문 검사 통과.
- 성향 페이지 모든 인라인 JS와 새 설정 파일 구문 검사 및 `git diff --check` 통과.
- DOM/전송 제어 테스트는 Node VM에서 실행했다. 실제 모바일 브라우저 렌더링 검증은 수행하지 않았다. 운영 배포와 Cloud 결제 변경도 수행하지 않았다.
