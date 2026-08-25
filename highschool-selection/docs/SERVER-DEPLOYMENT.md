# 선발·누적 진단 운영 서버

이 서버는 `highschool-selection`만 서비스합니다. `hsmiddle`의 정적 인증·Supabase 폴백을 복사하지 않고, 이름+승인번호와 시험별 권한을 서버에서 매 요청마다 다시 확인합니다.

## 제공 동선

- `POST /session`
- `GET /exams/:examId/pages`
- `GET /exams/:examId/response-schema`
- `POST /exams/:examId/attempts`
- `GET /attempts/:attemptId/report`
- `GET /page-assets/:examId/page-NN.png?sub=...&exp=...&sig=...`

학생 화면과 API를 같은 HTTPS 출처에서 실행하는 구성이 기본입니다. `shared/runtime.js`가 현재 HTTPS 출처를 API 주소와 허용 이미지 호스트로 사용합니다. 별도 출처를 사용할 때는 화면보다 먼저 `window.HIGHSELECT_RUNTIME`을 주입해야 합니다.

## 필수 환경값

| 환경값 | 용도 |
|---|---|
| `HIGHSELECT_SESSION_SECRET` | 32자 이상의 세션 서명 비밀값 |
| `HIGHSELECT_ASSET_SIGNING_SECRET` | 32자 이상의 페이지 이미지 서명 비밀값 |
| `HIGHSELECT_PRIVATE_CONFIG_PATH` | 공개 저장소 밖의 학생·시험 승인 설정 JSON 절대경로 |
| `HIGHSELECT_PRIVATE_SCORER_PATH` | 공개 저장소 밖의 답안·분류·채점 JSON 절대경로 |
| `HIGHSELECT_ATTEMPT_STORE_PATH` | 제출 결과 저장 JSON 절대경로 |
| `HIGHSELECT_EXAM_DRAFT_STORE_PATH` | 관리자 시험 초안·배치·검수 이력 저장 JSON 절대경로. 미설정 시 재시작에 보존되지 않음 |
| `HIGHSELECT_PUBLIC_ORIGIN` | `https://` 운영 출처. 생략 시 프록시 Host를 HTTPS로 사용 |

운영 쿠키는 기본적으로 `HttpOnly; Secure; SameSite=Lax`입니다. `HIGHSELECT_COOKIE_SECURE=false`는 로컬 격리 시험에서만 사용할 수 있습니다.

GitHub Pages는 공개 정적 화면에만 사용할 수 있습니다. 승인번호, 학생 기록, 채점, 시험 초안 편집, 비공개 후보 인덱스는 GitHub Pages만으로 운영할 수 없으며, 별도 HTTPS 운영 서버와 공개 저장소 밖의 설정이 필요합니다.

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
      "grants": ["sh-selection-r01"]
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

## 점수와 판정

SH-R01은 공식 배점이 확인되지 않았으므로 문항당 1점, 40점 만점의 **운영 점수**만 계산합니다. 시험과 정확히 연결된 버전 커트라인이 승인되지 않은 동안 서버는 `cutlineDecision: null`을 반환하고 화면은 합격/불합격을 표시하지 않습니다.

## 실행과 검증

저장소 루트에서 다음처럼 별도 이미지를 만듭니다.

```text
docker build -f highschool-selection/server/Dockerfile -t highselect-server .
```

통합 검증은 다음 파일에 있습니다.

```text
node --test highschool-selection/tests/server-flow.test.cjs
```

검증 범위는 보안 쿠키, 시험별 승인, 8쪽 서명 이미지, 위변조 거부, 무답안 40문항 스키마, 제출·운영 채점·분석지, 미완료 release gate 차단, PDF 정적 노출 차단입니다.
