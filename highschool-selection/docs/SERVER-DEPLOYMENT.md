# 선발·누적 진단 운영 서버

이 서버는 `highschool-selection`만 서비스합니다. `hsmiddle`의 정적 인증·Supabase 폴백을 복사하지 않고, 이름+승인번호와 시험별 권한을 서버에서 매 요청마다 다시 확인합니다.

## 제공 동선

- `POST /session`
- `GET /selection-tracks`
- `GET /programs/:programCode/selection-tracks`
- `GET /exams/:examId/pages`
- `GET /exams/:examId/response-schema`
- `POST /exams/:examId/attempts`
- `GET /attempts/:attemptId/report`
- `POST /practice-sets/plan`
- `POST /practice-sets/:practiceSetId/approve`
- `GET /practice-sets/:practiceSetId/pages` (승인 렌더 자산 연결 전 잠금)
- `POST /practice-sets/:practiceSetId/attempts` (검수 채점기 연결 전 잠금)
- `GET /page-assets/:examId/page-NN.png?sub=...&exp=...&sig=...`
- `GET /admin/access-grants`
- `POST /admin/access-grants`
- `PUT /admin/access-grants/:grantId`
- `DELETE /admin/access-grants/:grantId`
- `GET /admin/exam-reviews/sh-selection-r01`
- `POST /admin/exam-reviews/sh-selection-r01/items/:number/resolution`
- `POST /admin/exam-reviews/sh-selection-r01/final-confirmation`
- `GET /admin/exam-reviews/sh-selection-r01/items/:number/evidence`
- `GET /review-assets/:examId/:number/:role.ext?sub=...&exp=...&rv=...&sig=...`
- `GET /admin/exam-editor/candidates`
- `GET /admin/exam-editor/drafts`
- `POST /admin/exam-editor/drafts`
- `GET /admin/exam-editor/drafts/:draftId`
- `PATCH /admin/exam-editor/drafts/:draftId`
- `GET /admin/exam-editor/drafts/:draftId/readiness`

학생 화면과 API를 같은 HTTPS 출처에서 실행하는 구성이 기본입니다. `shared/runtime.js`가 현재 HTTPS 출처를 API 주소와 허용 이미지 호스트로 사용합니다. 별도 출처를 사용할 때는 화면보다 먼저 `window.HIGHSELECT_RUNTIME`을 주입해야 합니다.

## 필수 환경값

| 환경값 | 용도 |
|---|---|
| `HIGHSELECT_SESSION_SECRET` | 32자 이상의 세션 서명 비밀값 |
| `HIGHSELECT_ASSET_SIGNING_SECRET` | 32자 이상의 페이지 이미지 서명 비밀값 |
| `HIGHSELECT_PRIVATE_CONFIG_PATH` | 공개 저장소 밖의 학생·시험 승인 설정 JSON 절대경로 |
| `HIGHSELECT_PRIVATE_SCORER_PATH` | 공개 저장소 밖의 답안·분류·채점 JSON 절대경로 |
| `HIGHSELECT_PRIVATE_REVIEW_PATH` | 공개 저장소 밖의 문항 검수 상태·보호 근거 이미지 연결 JSON 절대경로 |
| `HIGHSELECT_PRIVATE_PRACTICE_REGISTRY_PATH` | 공개 저장소 밖의 반복연습 정책·검수 완료 후보 메타데이터 JSON 절대경로 |
| `HIGHSELECT_PRIVATE_PRACTICE_PATH` | 반복연습 계획·관리자 승인 상태 JSON 절대경로 |
| `HIGHSELECT_PRIVATE_PRACTICE_ASSETS_PATH` | 중립 문항 ID를 검수된 단일 이미지 자산에 연결하는 비공개 JSON 절대경로 |
| `HIGHSELECT_PRIVATE_EXAM_EDITOR_REGISTRY_PATH` | 시험지 후보의 현재 버전·공개 검수 상태와 교체 근거를 보관하는 비공개 JSON 절대경로 |
| `HIGHSELECT_PRIVATE_EXAM_DRAFTS_PATH` | 관리자 시험지 초안·revision·배치 이력을 저장하는 비공개 JSON 절대경로 |
| `HIGHSELECT_PRIVATE_ACADEMY_QUESTION_DB_PATH` | 학기·대단원·소단원·세부 유형과 학원형 사용 상태를 보관하는 비공개 문항 DB 절대경로 |
| `HIGHSELECT_PRIVATE_ACADEMY_ASSET_ROOT` | 관리자만 보는 문항 원본 페이지 폴더. 각 원본 ID 폴더 안에 `manifest.json`과 검수된 PNG를 둡니다. |
| `HIGHSELECT_ATTEMPT_STORE_PATH` | 제출 결과 저장 JSON 절대경로 |
| `HIGHSELECT_PUBLIC_ORIGIN` | `https://` 운영 출처. 생략 시 프록시 Host를 HTTPS로 사용 |

운영 쿠키는 기본적으로 `HttpOnly; Secure; SameSite=Lax`입니다. `HIGHSELECT_COOKIE_SECURE=false`는 로컬 격리 시험에서만 사용할 수 있습니다.

## 비공개 승인 설정

`HIGHSELECT_PRIVATE_CONFIG_PATH` 파일은 아래 계약을 따릅니다. 승인번호 원문은 넣지 않습니다. 해시는 `node highschool-selection/server/tools/hash-approval-code.js <승인번호>`로 생성합니다.

```json
{
  "schemaVersion": "highselect-private-config/v1",
  "students": [
    {
      "studentId": "중립_학생_ID",
      "name": "학생 이름",
      "approvalCodeHash": "scrypt-v1$...$...",
      "grants": ["sh-selection-r01"],
      "expiresAt": "2026-12-31"
    }
  ],
  "exams": {
    "sh-selection-r01": {
      "pageAssetRoot": "페이지 PNG 8개가 있는 비공개 절대경로",
      "pageCount": 8,
      "questionCount": 40,
      "releaseStatus": "released",
      "answerStatus": "verified",
      "classificationStatus": "verified",
      "responseSchemaStatus": "verified",
      "scoringPolicyStatus": "verified",
      "printAuditStatus": "passed",
      "signedAssetsStatus": "verified",
      "finalRoundConfirmation": true
    }
  }
}
```

`expiresAt`은 선택값이며 한국시간 기준 해당 날짜의 마지막 시각까지 유효합니다. 관리자 화면에서 저장한 승인번호는 즉시 scrypt 해시로 변환되며 원문은 파일이나 API 응답에 남지 않습니다. 승인 저장은 설정 스키마 검증, 같은 디렉터리 잠금, 임시 파일 flush, 버전 확인을 통과한 뒤 원본 설정 파일과 원자적으로 교체합니다. 비정상 종료 뒤 5분 이상 지난 잠금은 기록된 PID가 실행 중이 아닐 때만 격리·회수하며, 최근 잠금이나 살아 있는 PID의 잠금은 `409`로 닫힙니다. 갑작스런 전원 장애의 디스크 영속성이나 Windows ACL 설정까지 이 동작만으로 보장하는 것은 아닙니다. 관리자 세션, 현재 운영 출처와 일치하는 `Origin`, 전용 변경 헤더가 없으면 승인 저장·수정·취소 API를 사용할 수 없습니다.

페이지 폴더에는 `page-01.png`부터 `page-08.png`까지만 둡니다. PDF/HWP는 서버 정적 경로에 두지 않습니다. `signedAssetsStatus=verified`는 비공개 manifest가 있다는 이유만으로 설정하지 않으며, 실제 운영 호스트에서 학생·시험·페이지·만료시각 서명과 위변조 거부 검사가 통과한 뒤 설정합니다.

## 비공개 채점 설정

`HIGHSELECT_PRIVATE_SCORER_PATH`는 `highselect-private-scorer/v1` JSON입니다. 시험마다 `gradingVersion`, `classificationStatus=verified`, 문항 1~40의 `responseType`과 `answerSpec`만 둡니다. 실제 정답은 이 파일에만 두고 공개 저장소에는 넣지 않습니다.

서버는 공개 무답안 스키마 `data/review-only/sh-r01-response-schema.js`와 문항 번호·입력 방식이 모두 일치할 때만 채점합니다. `multi_input`의 `answerSpec.variants`도 지원하므로 순서쌍 그룹 순서를 바꿔도 되는 문항은 비공개 명세에서 두 순서를 검증할 수 있습니다. 진단 분류와 문항당 1점 정책은 답안 파일에 중복 저장하지 않고 검증된 공개 무답안 메타데이터 `data/sh-r01-diagnostic-metadata.js`에서 결합합니다. 비공개 파일에 분류 복사본을 선택적으로 넣으면 공개 메타데이터와 정확히 같을 때만 시작됩니다.

분류에는 다음 공개 가능한 필드만 사용합니다.

```text
domain, gradeBand, semester, majorUnit, minorUnit,
detailType, difficulty(lowered|standard|raised), evidence[]
```

원본 파일명·저장 경로·기관 실명·URL은 분석지 분류 메타데이터로 내보낼 수 없습니다.

## 비공개 시험 검수 설정

`HIGHSELECT_PRIVATE_REVIEW_PATH`는 `highselect-private-reviews/v1` JSON입니다. SH-R01의 `reviewVersion`, 시험 전체 검수 4종, 40개 문항의 답·분류·시각·지문 일치 여부와 처리 상태를 저장합니다. `scoringExclusionAllowed`는 사전에 승인된 채점 제외 정책 여부이며, 단순히 답을 확정하기 어렵다는 이유만으로 `true`로 만들 수 없습니다.

근거를 표시하는 문항만 `evidencePanels`에 `problem`, `source-key`, `independent-audit` 세 역할의 비공개 이미지 절대경로와 `image/png|jpeg|webp` 형식을 둡니다. 서버 응답에는 이 경로가 포함되지 않으며 관리자·시험·문항·역할·검수 버전·만료시각에 묶인 최대 10분 서명 URL만 반환됩니다. 원본 PDF/HWP와 구조화된 정답·풀이 텍스트는 이 설정에 넣지 않습니다.

문항 결정과 회차 최종 확인 변경 요청은 관리자 세션, 현재 운영 출처와 같은 `Origin`, `X-Highselect-Admin: 1`, JSON 형식을 모두 요구합니다. 저장은 버전 확인·같은 디렉터리 잠금·임시 파일 flush·원자 교체를 거칩니다. 최종 확인 API는 회차 확인만 기록하며 공개 설정의 `releaseStatus`나 `finalRoundConfirmation`을 자동 변경하지 않습니다. 사용자의 실제 회차 확인 뒤 별도 배포 검증과 명시적 운영 승격이 필요합니다.

## 비공개 반복연습 설정

`HIGHSELECT_PRIVATE_PRACTICE_REGISTRY_PATH`는 `highselect-private-practice-registry/v1` JSON이며 프로그램 코드별 검수 정책과 문제 원문·정답·경로를 제외한 후보 메타데이터만 둡니다. `HIGHSELECT_PRIVATE_PRACTICE_PATH`는 `highselect-private-practice/v1` JSON이며 학생의 비공개 소유 ID, 중립 계획, 관리자 승인만 저장합니다. `HIGHSELECT_PRIVATE_PRACTICE_ASSETS_PATH`는 `highselect-private-practice-assets/v1` JSON이며 중립 문항 ID별 내부 자산 키, 절대 이미지 경로, MIME 형식, 자산 revision을 둡니다. 세 파일은 공개 Git에 넣지 않습니다.

학생은 공개 완료된 시험에 대한 현재 개별 승인이 있는 프로그램만 계획할 수 있습니다. 관리자는 승인 직전에 학생 권한, HMAC 기반 학습자 결속, 현재 레지스트리로 재생성한 계획을 모두 대조합니다. 계획 파일의 학생 ID나 문항 구성이 바뀌면 공개하지 않고 `409`로 닫습니다. 저장은 같은 디렉터리 잠금, revision 비교, 임시 파일 flush, 원자 교체를 사용합니다. 모든 선택 문항의 이미지가 존재할 때만 학생·세트·승인 버전·문항 위치·내부 자산 revision·만료시각에 묶인 단기 서명 URL을 만들며, 내부 자산 키·revision·경로는 URL과 JSON에 노출하지 않습니다. 승인 렌더 자산 또는 비공개 채점기가 연결되기 전에는 해당 페이지나 시도 제출 경로가 `423`으로 잠겨 있습니다.

## 비공개 시험지 편집 설정

`HIGHSELECT_PRIVATE_EXAM_EDITOR_REGISTRY_PATH`는 `highselect-private-exam-editor-registry/v1` JSON입니다. 문항 원문·답·풀이·원본 경로는 넣지 않고, 중립 문항 ID와 현재 버전, 교육과정 경로, 세부유형, 난도, 입력 방식, 그림 필요 여부, 공개 승인 상태만 둡니다. 쌍둥이·유사 교체 근거는 원문 문항·버전과 후보 문항·버전에 결속하며 문항군·세부유형·풀이 구조·난도 관계가 모두 검증된 경우에만 `approved`로 둡니다.

`HIGHSELECT_PRIVATE_EXAM_DRAFTS_PATH`는 `highselect-private-exam-drafts/v1` JSON입니다. 초안은 원문 문항을 복제하지 않고 배치 ID, 중립 문항 ID, 문항 버전, 순서, 배점, 교체 근거 ID만 저장합니다. 변경 요청은 관리자 세션, 같은 `Origin`, `X-Highselect-Admin: 1`, JSON 형식과 현재 초안 revision을 모두 요구합니다. 다른 화면이 먼저 저장했거나 문항 버전이 바뀌면 `409`로 닫고 자동 덮어쓰지 않습니다.

`HIGHSELECT_PRIVATE_ACADEMY_QUESTION_DB_PATH`는 관리자 문제은행의 `분류 문항` 탭에서만 읽습니다. 돌파형·생수형·원수학 기본형·원수학 듀얼형·이든형·황소형·깊은생각형을 서로 다른 시험형으로 관리하며, `source_verified` 또는 `approved`인 문항만 기본 검색 결과에 보입니다. 분류만 끝나고 풀이법·유사문항 검수가 남은 문항은 이 목록에서 확인할 수 있지만 시험지에 바로 담을 수 없습니다.

`HIGHSELECT_PRIVATE_ACADEMY_ASSET_ROOT`는 원본 전체 PDF가 아니라 문항이 있는 검수 페이지 PNG만 읽습니다. 화면에는 원본 경로나 답안 페이지를 보내지 않으며, 관리자로 로그인한 요청에서 문항 ID와 검수된 쪽 연결이 모두 맞을 때만 이미지를 전달합니다. 현재 돌파 중2-2 원본은 3~10쪽을 연결했고, 원본 PDF를 찾지 못한 회차는 버튼을 `원본 준비 중`으로 둡니다.

후보 검색 API는 검수 잠금 문항을 반환하지 않으며 답안 상태 필드도 내보내지 않습니다. 교체 요청의 관계 판정값은 클라이언트 입력을 신뢰하지 않고 비공개 레지스트리의 근거 ID로 다시 검증합니다. readiness 응답은 현재 문항 버전과 범위를 재검사하고, 통과한 경우에만 문제·답안·풀이·분석지에 공통으로 사용할 번호 projection을 반환합니다.

## 점수와 판정

SH-R01은 공식 배점이 확인되지 않았으므로 문항당 1점, 40점 만점의 **운영 점수**만 계산합니다. 시험과 정확히 연결된 버전 커트라인이 승인되지 않은 동안 서버는 `cutlineDecision: null`을 반환하고 화면은 합격/불합격을 표시하지 않습니다.

## 실행과 검증

저장소 루트에서 다음처럼 별도 이미지를 만듭니다.

```text
docker build -f highschool-selection/server/Dockerfile -t highselect-server .
```

통합 검증은 다음 파일에 있습니다.

```text
node --test highschool-selection/tests/server-flow.test.cjs highschool-selection/tests/admin-access-grants.test.cjs highschool-selection/tests/admin-exam-reviews.test.cjs highschool-selection/tests/review-store.test.cjs highschool-selection/tests/practice-set-runtime.test.cjs highschool-selection/tests/practice-store.test.cjs highschool-selection/tests/exam-editor-core.test.cjs highschool-selection/tests/exam-editor-server.test.cjs
```

검증 범위는 보안 쿠키, 시험별 승인, 8쪽 서명 이미지, 위변조 거부, 무답안 40문항 스키마, 제출·운영 채점·분석지, 미완료 release gate 차단, 관리자 문항 검수·회차 최종 확인, 보호 근거 이미지 서명, 시험지 후보 잠금, 초안 revision 충돌, 교체 근거 위조 거부, PDF 정적 노출 차단입니다.
