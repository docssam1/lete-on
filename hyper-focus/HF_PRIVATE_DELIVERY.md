# Hyper Focus 54유형 비공개 유사문제 전달

2026-09-09 · 로컬 구현/모의 보안 검증. 실제 배포·업로드·학생 권한 변경 없음.

## 범위와 공개 상태

`hyperfocus-practice-content`는 기존 HF54의 유사문제·문제은행 전용이다. 본 진단 54문항·채점·응시 기록, 프리미어 모의고사, VIP, 챌린지 104유형과 저장소는 변경하거나 공유하지 않는다. 다른 서버 모듈을 import하지 않는다.

**운영 보류:** 현재 신규 패키지의 모든 pool은 `releaseStatus: "held"`이다. 필드가 없어도 held로 취급한다. 생성 성공이나 기존 진단 검수 이력만으로 신규 비공개 변형을 승인하지 않는다. 서버는 `releaseStatus: "verified"`인 pool만 전달한다. 미승인 pool이 하나라도 섞인 요청은 전체를 거부하며 일부 문항을 먼저 내보내지 않는다.

실제 `HF_PRACTICE_PRIVATE_DELIVERY_READY`와 기존 클라이언트 `securePracticeDelivery`를 켜지 않았다. 아래 준비를 마치기 전에는 운영 보호가 완료됐다고 표시하지 않는다.

- 각 유형·난도 변형의 수학적 독립 검산과 그림/답안 검수
- 전용 private bucket 생성·업로드와 manifest SHA 고정
- 공개 배포물에서 유료 생성기·정답·private 파일 직접 요청 차단 검증
- 함수 배포 및 실제 기존 RLS의 세션 종료·역할 변경·승인 회수 검사
- 기존 본 진단과 무료 2문항 동작, 학생 자료/기록에 대한 회귀 검증

## 요청과 응답

POST JSON의 정확한 필드는 다음과 같다. 추가/누락 필드, 학생 이름/ID, 파일 경로, 중복 유형을 받지 않는다.

```json
{"action":"practice","types":[{"typeId":1,"difficulty":"same"}],"countPerType":2,"seed":123,"accessTier":"free","part":"questions"}
```

`typeId`는 숫자 1~54, 난도는 `easy|same|hard`, `seed`는 uint32이다. 최대 20유형이다. 유형별 문항 수는 free 1~2 / paid 1~20이다. 풀의 실제 문항 수가 요청보다 작으면 실패하며 중복 문항으로 채우지 않는다.

공통 응답은 `verified:true, studentId, approvedStudentName, validUntil, contentVersion, part, accessTier`이다. 이름과 ID는 요청/URL/로컬 저장소가 아닌 활성 서버 프로필에서만 온다. `validUntil`은 Unix 밀리초이며 최대 60초, 실제 JWT/관련 승인 만료 시각과 요청 시작 시점의 만료 중 가장 이른 값이다.

- questions: `questions:[{id,number,typeId,difficulty,prompt,problemHtml}]`
- answers: `answers:[{id,number,typeId,difficulty,answerHtml,solution,solutionDiagram?}]`

질문에는 answer/payload/solution 필드가 없고, 질문 요청 때 답안 파일을 다운로드하지 않는다. 답안은 같은 요청에 `part:"answers"`를 지정한 별도 승인 검사로만 받는다. 클라이언트는 신원·contentVersion·문항 ID·순서가 최초 질문과 일치하는지 확인해야 한다. 문항 번호는 요청한 유형 순서에서 1부터 부여한다. 고유 ID는 빌더가 부여한 1~160자 문자열이다.

400은 잘못된 요청, 401은 인증 실패, 403은 승인/세션 변경, 503은 비공개 전달 준비/패키지 검증 실패이다. 오류에는 내용이나 학생 이름을 반환하지 않는다.

## 승인 검사

기존 고정 SDK `@supabase/supabase-js@2.112.3`와 호출자 JWT를 사용한다. Auth `getUser(token)`와 JWT의 app_metadata 학생 역할을 모두 검사한다. 사용자 수정 가능 user_metadata는 승인에 사용하지 않는다.

기존 호출자 RLS에서 본인 `hf_students` 활성 프로필과 `hf_entitlements`만 조회한다. 기존 RLS의 활성 세션·자격 갱신·로그인 버전 검사를 재사용한다. 서비스 키는 Storage 다운로드에만 쓰며 학생 조회를 우회하지 않는다.

항상 기본 `hyperfocus` 승인이 필요하다. paid 요청에는 `hyperfocus-extra` 또는 `problem-bank`도 필요하다. `hyperfocus-bank-individual-mode` 활성 학생은 선택한 **모든** 유형의 `hyperfocus-bank-q01`~`q54` 승인이 추가로 필요하다. 모드가 없는 기존 학생은 기존 묶음 승인 의미를 유지한다. 권한 자동 부여·회수·모드 전환은 수행하지 않는다.

Storage 조회를 마친 뒤 프로필·현재 세션·필요 권한을 다시 읽는다. 로딩 중 만료·회수·로그아웃·학생 이름 변경 또는 요청 시작 시점의 60초 기한 초과는 거부한다. 권한 결과를 다음 요청에 캐시하지 않는다. 요청량 제한은 파일/메모리 안전 한도이며 운영 API rate limiting을 대신하지 않는다.

## 전용 저장소와 패키지

고정 bucket: `hf-practice-private`. 기존 `hf-mock-private`나 `hf-challenge-private`를 사용하지 않는다. 버킷 metadata가 정확한 ID이면서 `public:false`인지 확인한다. 아직 이 버킷을 생성하거나 업로드하지 않았다. Storage 객체에 일반 공개 SELECT를 부여하거나 signed URL을 발급하지 않는다.

환경 값:

- `HF_PRACTICE_PRIVATE_DELIVERY_READY=true`: 운영 검증 이후에만 명시 설정
- `HF_PRACTICE_MANIFEST_SHA256`: `manifest.json` 전체 바이트 SHA-256 소문자 64자리
- 기존 Supabase URL/public/secret 환경 값: 기존 서버 방식 재사용

manifest 구조:

```text
{schemaVersion:1, contentVersion, bank:{
  q01:{same:{
    free:{releaseStatus:"held",totalCount:2,shards:[{count,questions:{path,sha256},answers:{path,sha256}}]},
    paid:{releaseStatus:"held",totalCount:N,shards:[...]}
  }}
}}
```

유형 키는 q01~q54만 허용한다. free pool은 최대 2개이며 seed를 무시하고 처음부터 전달한다. paid는 `seed % totalCount`부터 연속으로 고르고 끝에서는 처음으로 돌아간다. free는 별도의 파일이므로 seed를 바꾸어 유료 내용을 열거할 수 없다. 일부 유형/난도/pool이 없으면 자동 생성이나 다른 유형으로 대체하지 않는다.

객체 경로는 manifest에서 자유롭게 정하지 못하고 다음 고정 형식과 일치해야 한다.

`v1/bank/q01/same.free.questions.0.json`

답안은 `.answers.`, 유료는 `.paid.`, 분할 파일 번호는 배열의 0부터 시작하는 index이다. 각 객체는 SHA-256 확인 후 파싱한다.

파일 구조:

```text
{schemaVersion:1,contentVersion,typeId:1,difficulty:"same",accessTier:"free",part:"questions",shardIndex:0,items:[...]}
```

items는 해당 part의 문항 데이터만 갖는다. 같은 shard의 중복 ID, 잘못된 유형·난도·tier·part·version·index·개수는 거부한다. 빌더/전수 QA는 질문/답의 같은 위치 ID와 shard 전체의 고유성도 확인한다.

질문/답 HTML은 검수 후 고정한 자료만 허용한다. 실행 태그·이벤트·외부 참조·질문 속 answer/payload 속성 등을 차단하며 raster는 embedded data만 허용한다. 이 스캔은 일반 HTML sanitizer가 아니다. 검증된 제작물, manifest pin, 호스팅 차단과 함께 사용한다.

한도는 요청 JSON 4KB, manifest 512KiB, 객체 JSON 8MB, 누적 다운로드 24MB, 선택 문항 직렬화 7.9MB이다. 응답은 no-store / nosniff이다. SDK/CLI 설치, 원격 질의나 쓰기는 이 작업에서 실행하지 않았다.

## 로컬 검증

최종 추가 회귀는 **249검사 통과**다. 아래246검사에 전체324쪽 텍스트 경계 검사, 답안 제목 강제 이동 시 오류 탐지, 복원 후 정상 검사를 추가했다. 부모도 최종 버전을 재실행했다.

학생 practice 전달 화면은 `mock/practice-content-client.js`, `mock/secure-practice-loader.js`로 분리했다. 실제 localhost의 명시적 교사 미리보기만 기존 생성기를 사용한다. 일반 학생 practice는 원문·생성기·정답 JSON을 먼저 로드하지 않으며 문제 요청 후 답안 버튼을 눌렀을 때만 별도 답안 요청을 한다. 승인 학생 이름·유효기간·자료 버전·문항 ID를 검사하고 회수/만료/학생 변경/늦은 응답에서 문제와 답을 제거한다. 무료 고정 풀에서는 무의미한 다른 문제 버튼을 숨긴다.

`qa/validate_hyperfocus_remote_practice.cjs` 부모 재실행 246검사 통과. 실제 162개 유형·난도 대표의 그림/표 보존, 문제·풀이324 A4쪽 넘침0, 실제 PDF324쪽과 전체 텍스트가 종이 밖으로 벗어나지 않는 것을 확인했다. 별도로 기존 진단5검사(54원문·선택·채점·기록 동일) 및 보호시험 UI검사도 통과했다. 옛 클라이언트 생성 뷰어18검사는 새로운 전달 검사로 대체하며 중복 합산하지 않는다.

**전체 HF 자료 보호와는 다르다.** 기존 `mock/index.html`, 일반 exam 뷰어, `review.html`이 생성기/자료를 사용하며 기본 `diagnosis.html`에도 기존 정답·해설이 들어 있다. 이 화면들의 현재 동작을 보존한 상태에서 생성기 직접 URL만 차단하면 일부 기능이 깨진다. 따라서 새 practice 요청 분리의 로컬 검증과 전체 공개 경로 차단 완료를 구분한다. 공용 배포 설정 및 운영 반영 범위 확인 전에는 변경하지 않는다.

`node hyper-focus/qa/validate_hyperfocus_private_content.cjs --package`

실제 TypeScript를 타입 제거 후 실행하고 Auth/RLS/Storage만 모의 처리한다. 무토큰, 위조 역할/다른 학생/잘못된 키, 무료→유료 우회, 개별 승인 누락, held/미지정 상태, 파일 해시/경로/질문답 분리, 로딩 중 회수·세션/이름 변경·만료를 검사한다. 실제 package 옵션은 `output/private-practice/latest.json`의 모든 JSON을 검사하며, held 자료는 직접 전달 거부를 별도로 검사한 후 파일 구조만 검수한다. 이것은 수학적 정답 승인으로 계산하지 않는다.

현재 `hf-practice-20260909004831990`: 54유형, 324개의 free/paid 난도 pool 전부 held, verified 0. JSON 1,164개, free/paid 포함 3,493개 항목(무료 324 + 유료 3,169), 최대 263,572바이트, hash/구조 실패 0. 무료 고정2문항은 그림과 정답이 서로 다르게 선택된다. 기존 생성기의 통합 정답·풀이 문장은 solution에 한 번만 보관하고 answerHtml은 비워 중복 표시를 막는다. 보안/실제 패키지 합산 13,049검사 통과. manifest SHA `ec1ebd00fb2a46172513c2db54d345d3349a3a8e799fa64143524982f46148c3`.

공식 [Storage private bucket](https://supabase.com/docs/guides/storage/buckets/fundamentals), [함수 인증](https://supabase.com/docs/guides/functions/auth), [기존 RLS 원칙](https://supabase.com/docs/guides/database/postgres/row-level-security), [변경 이력](https://supabase.com/changelog.md)을 확인했다. 현재 문서의 새 래퍼로 기존 인증을 일괄 변경하지 않고, 고정 SDK와 검증된 기존 호출자 RLS 경계를 유지했다.
