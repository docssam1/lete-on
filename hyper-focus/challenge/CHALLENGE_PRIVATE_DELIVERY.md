# Challenge 비공개 콘텐츠 전달 계약

2026-09-09. 로컬 서버 구현 및 합성 Auth/DB/Storage 검사. 배포·업로드·DB 변경·학생 승인 변경은 하지 않았다.

## 저장소와 현재 공개 상태

지정한 두 bucket의 메타데이터만 읽기 전용으로 조회했다. 기존 `hf-mock-private`은 private으로 존재하며, `hf-challenge-private`은 없었다. 기존 프리미어 저장소나 자료를 재사용·수정하지 않는다. Challenge 전용 private bucket이 없거나 public이면 서버는 503으로 닫힌다.

후속 운영 단계에서 별도 승인 후 `hf-challenge-private`을 private, JSON 허용으로 생성하고 검증된 파일만 업로드해야 한다. 일반 사용자·익명 사용자가 `storage.objects`에서 직접 읽을 수 있는 정책을 추가하지 않는다. 기존 전역 정책이 새 bucket을 노출하는지도 실제 RLS 검사 대상이다. 이 문서에서는 bucket 생성 SQL을 실행하거나 새 정책을 배포하지 않았다.

필수 서버 설정:

- 기존 Supabase 서버 URL/공개 키/서비스 키. 서비스 키는 브라우저에 전달하지 않는다.
- `CHALLENGE_PRIVATE_DELIVERY_READY=true`: 실제 비공개 배포 및 정적 호스팅 차단 검증 후에만 설정한다.
- `CHALLENGE_MANIFEST_SHA256`: 승인된 `manifest.json` 바이트의 소문자 SHA-256. 없거나 불일치하면 차단한다.

현재는 로컬 기반이다. 체크박스 승인 또는 준비 플래그만으로 운영 보호 완료라고 할 수 없다.

### 공용 배포 설정의 읽기 전용 확인

저장소의 `.github/workflows/deploy-pages.yml`은 `hyper-focus/.` 전체를 Pages 산출물로 복사한다. 루트 `Dockerfile`도 저장소 전체를 공개 웹 루트로 복사하고, `nginx.conf`는 정적 JS/JSON/이미지에 공개 캐시를 적용한다. 따라서 현재 작업 폴더를 그대로 커밋·푸시·배포하는 방법은 안전하지 않다. 이 파일들은 Hyper Focus 외 상품도 공유하므로 수정하지 않았다.

운영 공개 전에는 사용자에게 공용 배포 설정 변경 범위를 승인받아야 한다. Pages 사용 시 해당 workflow의 Hyper Focus 복사 단계에서 교사용 Challenge 폴더를 제외하고 검수된 공개 묶음만 넣어야 하며, Cloud Run 사용 시 Docker 복사 범위 및 nginx 직접 경로 거부도 함께 검증해야 한다. 다른 상품의 배포 내용은 그대로 보존한다. 어느 운영 경로를 사용하는지 확정하기 전에는 공용 설정이나 원격 배포를 변경하지 않는다.

## POST API: challenge-content

모든 요청은 학생 Auth 토큰이 필요하다. 요청마다 현재 본인의 활성 HF 프로필과 승인을 RLS로 확인한다. 표시 이름/학생 ID는 클라이언트에서 받지 않는다. 문서 요청은 문서 승인, 유사문제는 해당 원본 유형 승인, 원문은 해당 회차 또는 해당 원본 유형 승인 중 하나를 요구한다.

| action | 정확한 요청 필드 | 필요한 승인 |
| --- | --- | --- |
| `document` | `action, productKey, part` | 개념 1/2 또는 모의고사 1..4 중 정확한 키 |
| `bank` | `action, typeId, difficulty, seed, part` | `challenge-bank-${typeId}` |
| `source` | `action, round, section, number, part` | 해당 `challenge-mock-${round}` 또는 원본의 정확한 bank 키 |

`part`는 `questions` 또는 `answers`, `difficulty`는 `easy/same/hard`, `seed`는 0~4294967295 정수다. 원문 번호는 고정 104개 출현 목록으로 확인한다. 요청 필드 추가·학생 ID 지정·임의 경로·와일드카드·빈도 범위 밖 값은 거부한다. 본문은 JSON 최대 4KB이며 POST 및 지정 출처만 허용한다.

성공 공통 응답: `verified:true, studentId, approvedStudentName, validUntil, contentVersion, part`.

- 문서: `document:{title,html,styles}`
- 질문/원문 질문: `question:{id,prompt,problemHtml}`
- 답/원문 답: `answer:{id,answerHtml,solution,solutionDiagram?}`

학생 이름은 항상 현재 서버 프로필에서 온다. 클라이언트는 이 이름으로 해당 문항·답안에 워터마크를 표시해야 한다. 원문 또는 유형 ID가 같아도 `contentVersion` 또는 반환 `id`가 질문과 답에서 다르면 기존 문항에 새 답을 붙이지 말고 다시 받아야 한다.

문제 응답에는 답·해설·생성 payload 필드를 허용하지 않는다. `questions` 요청은 answers 파일을 읽지도 않는다. 답안은 별도의 명시 요청으로만 반환하며 승인 검사도 다시 한다. 현재 계약은 동일 자료 승인으로 정답 요청도 허용한다. 채점 후에만 정답을 여는 별도 응시 정책은 구현하지 않았다.

Storage를 읽은 뒤 활성 프로필과 승인을 한 번 더 확인한다. 도중에 이름·세션·승인이 바뀌거나 최초 권한 유효기간이 지나면 콘텐츠를 버린다. 응답은 모두 `Cache-Control: no-store`이며 저장소 경로나 서명 URL을 반환하지 않는다. 브라우저에서 이미 본 내용을 복사·저장한 경우를 소급 회수할 수 있다는 보장은 하지 않는다.

## manifest 및 private JSON v1

서버의 고정 `manifest.json`은 `{schemaVersion:1,contentVersion,documents,bank,sources}`이다. 각 파일 참조는 `{path,sha256}`이며 경로는 아래 형식과 정확히 일치해야 한다. 버전은 1~80자의 영문/숫자/점/밑줄/하이픈이며 영문 또는 숫자로 시작한다.

| manifest 항목 | 파일 경로 |
| --- | --- |
| `documents[productKey][part]` | `v1/documents/{productKey}.{part}.json` |
| `bank[typeId][difficulty][part]` | `v1/bank/{typeId}/{difficulty}.{part}.json` |
| `sources['1-main-1'][part]` | `v1/sources/{round}-{section}-{number}.{part}.json` |

`sources` 각 항목에는 `typeId`도 필요하며 서버 고정 출현 매핑과 일치해야 한다. 미검증 난이도는 manifest에서 생략할 수 있지만 다른 난이도로 몰래 대체하지 않는다. 등록되지 않은 유형/출현/문서 키는 허용하지 않는다.

문서 파일:

```json
{"schemaVersion":1,"contentVersion":"build-v1","productKey":"challenge-mock-1","part":"questions","document":{"title":"문서 제목","html":"검증된 문서 HTML","styles":["exam.css"]}}
```

bank pool 파일:

```json
{"schemaVersion":1,"contentVersion":"build-v1","typeId":"등록된 원본 유형 ID","difficulty":"same","part":"questions","items":[{"id":"고정 문항 ID","prompt":"질문","problemHtml":"검증된 문제 그림 HTML"}]}
```

답안 pool은 같은 구조에서 `part:"answers"`, items를 답 객체로 바꾼다. 질문과 답의 pool 길이·순서·ID는 패키지 검증에서 반드시 일치해야 한다. 서버는 `seed % items.length`로 한 문항만 선택하고 전체 pool은 반환하지 않는다. 선택 함수는 암호학적 추첨이 아니라 재현 가능한 선택 규칙이다.

큰 pool은 단일 파일 제한을 늘리지 않고 다음 호환 확장으로 나눈다:

```json
{"shards":[{"questions":{"path":"v1/bank/등록된유형/same.questions.0.json","sha256":"파일 SHA256"},"answers":{"path":"v1/bank/등록된유형/same.answers.0.json","sha256":"파일 SHA256"},"count":8}],"totalCount":8}
```

이는 `manifest.bank[typeId][difficulty]` 위치의 대체 구조이다. 배열 인덱스가 파일명 끝의 0부터 시작하는 번호이며, 각 JSON에는 기존 pool 필드와 `shardIndex`를 넣는다. 전체 count 합은 `totalCount`와 같아야 하고 총 1~1000개이다. 서버는 `seed % totalCount`의 전체 순번이 속한 파일 하나만 읽고 그 파일의 로컬 순번을 선택한다. 질문·답 count와 인덱스는 같아야 한다. 같은 유형/난이도 안에서 파일을 나눠도 문항 ID는 중복될 수 없다. 배포 전 실제 모든 파일의 크기·해시·ID 대응을 검사한다.

source 파일은 `{schemaVersion,contentVersion,sourceId,typeId,part,question}` 또는 마지막 `answer` 구조다. 문항은 재생성하지 않고 해당 원문 출현의 고정 자료를 반환한다.

스타일은 `exam.css`, `exam-print-revision.css`, `concepts.css`, `concepts-two.css`, `studio.css`만 허용한다. HTML은 pin된 교사 빌드만 받으며 스크립트·이벤트 속성·외부 참조·정답 data 속성 등을 추가로 거부한다. 이 문자열 거부 검사는 범용 HTML 정화기가 아니며 의미상 정답 노출을 자동 증명하지 않는다. 풀이 그림·텍스트 분리는 빌더와 독립 검수에서 확인해야 한다.

Manifest 최대 512KiB, 문서 JSON 최대 12MB, 기타 JSON 최대 8MB, HTML 문자열 최대 8백만 자, pool은 1~1000개다. JSON 바이트의 해시를 검증한 뒤 정해진 필드만 응답한다. 임의 파일 내용의 추가 필드를 복사해서 보내지 않는다.

## 검증

`qa/validate_challenge_private_content.cjs`: 실제 두 TypeScript 파일을 타입 제거 후 실행하고 Auth/DB/Storage만 모의 처리한 267항목 통과. 요청 부정, 직접 경로 지정, 타학생 지정, 잘못된 역할·세션, 승인 부족·철회·만료, 공개 bucket, manifest/파일 해시 변조, 질문/답 파일 분리, 저장소 읽기 중 권한 변경, 104개 고정 출현 매핑을 포함한다. 나뉜 pool의 전체 count·파일 인덱스·선택 경계·질문/답 대응도 검사한다. 쓰기 API와 서명 URL 생성이 없는지도 검사했다.

`--package` 옵션은 `output/private-challenge/latest.json`의 실제 로컬 패키지를 대상으로 manifest, 모든 파일 해시, 질문 응답의 정답/풀이 표시 흔적, 모든 질문·답 ID 짝을 검사한다. 검사 출력은 ID/개수/오류 종류만 기록하고 질문·답 내용은 기록하지 않는다. 빌드 버전마다 재실행해야 한다.

실제 원격 Auth/RLS/Storage·함수 배포 검증은 아직 하지 않았다. 원격에서 한 작업은 지정 bucket 메타데이터 SELECT 1회뿐이며 학생 정보는 조회하지 않았다. 이 서버와 별도로 공개 배포 산출물의 허용 목록에서 생성기·정답 데이터·private JSON 및 검사 출력물을 제외하고 직접 URL 거부를 확인해야 한다.

기준 문서는 Supabase 공식 [비공개 bucket](https://supabase.com/docs/guides/storage/buckets/fundamentals), [함수 인증](https://supabase.com/docs/guides/functions/auth), [변경 이력](https://supabase.com/changelog.md)을 확인했다. 기존 고정 SDK `2.112.3`와 호출자 RLS 방식을 유지했다. CLI·원격 변경은 사용하지 않았다.
