# Hyper Focus 개별 승인 범위 감사

## 후속 구현 상태 (동일 날짜, 아래 읽기 전용 감사 이후)

`../type-access-catalog.js`, `../type-access.js`, `../type-admin.html`, `../supabase/functions/hyperfocus-type-access/`에 기존 HF54유형과 명시적 개별 승인 전환 키를 추가했다. `../diagnosis.html`의 유사문제 선택 및 `../mock/viewer.html`의 생성·인쇄·답안 동작에 연결했고, 본 진단의 선택·점수·응시 기록은 보존했다. 독립 경계 검사 23개가 통과했다. 프리미어와 VIP 승인 방식은 변경하지 않았다.

이는 로컬 구현·모의 인증 검증이며 운영 적용 완료가 아니다. 서버 함수와 신규 카탈로그 마이그레이션의 선행 적용, 실제 RLS 검증, 정적 문제 직접 접근을 막는 비공개 전달이 남아 있다. 다음 감사 본문은 구현 전 상태의 근거로 보존한다.

검사일: 2026-09-09. 로컬 코드 읽기 전용 감사이며, 이 보고서 외 소스·학생 승인·DB·배포는 변경하지 않았다. 실제 운영 DB 상태는 확인하지 않았다.

## 결론

**Challenge의 110개 승인 키를 만든 것만으로 기존 Hyper Focus 54유형 개별 승인이 완료되지는 않는다.** 기존 Hyper Focus 유형 선택은 학습 선택이고, 권한은 프로그램/추가문제/문제은행 단위이다. 프리미어 모의고사는 DB와 문제 전달 단계에 회차별 권한이 이미 있으나, 현재 관리자 화면의 승인 단위는 상품 묶음이다.

| 대상 | 현재 확인한 승인 단위 | 요구 충족 범위 | 남은 작업 |
| --- | --- | --- | --- |
| Hyper Focus 문항 진단 | `hyperfocus` | 프로그램 진입 승인 | 54유형별 승인 및 진입·선택·직접 URL에 동일한 검사 |
| Hyper Focus 유사문제 | `hyperfocus-extra`, `problem-bank` 및 전달 준비 플래그 | 추가문제 상품 단위 구분 | 유형별 서버 승인·비공개 문제 전달 |
| 프리미어 모의고사 | 화면/API는 활용 8회·파이널 3회·최종 4회 묶음 | 서버 저장·읽기는 개별 회차 단위 | 관리자 개별 회차 선택 및 안전한 단일 회차 승인 API |
| 2026년 9월 챌린지 대비 | 개념 2 + 모의고사 4 + 문제은행 원본 유형 ID 104 = 110키 | 별도 승인 화면·서버 검증·클라이언트 차단의 로컬 기반 | 원격 적용 및 실제 비공개 전달. 기존 HF 54유형에는 연결되지 않음 |

Challenge 문제은행 104개는 현재 80개 본문항과 24개 추가 유형의 원본 ID에 대응한다. 유형 메타데이터가 존재한다는 사실은 해당 문제나 생성 난이도의 검수 완료를 뜻하지 않는다. 추가 6문제를 시험지에 다시 넣는 승인도 아니다.

## 근거 파일과 실제 API

아래 경로는 모두 `hyper-focus/` 기준이다.

### 기존 Hyper Focus 54유형

- `admin.html`은 `admin-app.js`를 사용한다. `admin-app.js:98–120`의 학생 승인 열은 `hyperfocus`, `hyperfocus-extra`, `vip`, `problem-bank`와 모의고사 묶음이다. 54유형별 체크박스는 없다.
- `admin-app.js:342`는 `admin-students`에 `set_entitlement`를 보낸다. `supabase/functions/admin-students/index.ts:14`의 허용 목록도 위 네 개 키로 고정되어 있다. Challenge 키를 이 목록에 임의로 섞지 않았다.
- `portal-auth.js`의 `canAccess(session, permission)`은 세션의 권한 목록에 지정 키가 있는지 확인한다. 기존 호출에서 HF 유형 번호를 개별 권한으로 확인하지 않는다.
- `diagnosis.html:669–670`은 추가문제/문제은행 묶음 권한과 `HFAccessPolicy.paidPracticeReady()`를 확인한다. `buildDiagnosisSelector()`(`:673`)는 전체 유형 목록을 만들며, `toggleItem()`과 문제지 생성 경로에는 개별 유형 승인 검사가 없다.
- `mock/viewer.html:55`는 URL의 `types`를 숫자로 읽는다. 원격 연습 모드의 검사는 `hyperfocus` 진입 승인(`:76`)이며 이후 `HFMock.preparePractice(typeIds)`와 `HFMock.createPractice(typeIds, ...)`(`:89–91`)를 호출한다. 승인되지 않은 특정 유형을 거부하는 단계가 없다.
- `mock/mock-core.js`의 `getTypeMeta`, `preparePractice`, `createPractice`, `getPracticeAvailability`는 유형·난이도·문항 수·생성 가능 여부를 다룬다. 이들은 학생별 권한 API가 아니다. 개별 승인 도입을 위해 54개 수학 생성 엔진을 다시 작성할 필요는 없다.
- `mock/access-policy.js`는 기본 난이도당 2문항/유료 최대 20문항 등의 정책을 제공하지만 개별 유형 권한을 검증하지 않는다. 현재 로컬 `supabase-config.js`는 `securePracticeDelivery: false`이다. 유료 전달을 닫아 둔 상태이지 유형별 승인이 구현된 상태가 아니다.

### 기존 프리미어 모의고사

- `admin-app.js:164`는 `admin-students`의 `set_mock_bundle`을 호출한다.
- `supabase/functions/admin-students/index.ts:16,602`는 세 묶음을 고정 목록으로 검증하고 `hf_set_student_mock_bundle` RPC에 위임한다.
- `supabase/migrations/20260823162348_secure_mock_product_bundles.sql`의 `hf_set_student_mock_bundle`은 정해진 회차 목록 각각에 승인 상태를 반영한다. 화면이 묶음이라고 DB도 묶음 하나만 저장하는 것은 아니다.
- `supabase/migrations/20260823070755_initial_hyper_focus_auth.sql`의 `hf_mock_entitlements`는 학생과 개별 `mock_exam_id` 조합을 저장한다.
- `supabase/migrations/20260823151425_secure_mock_delivery_v1.sql:154`의 `hf_private.has_active_mock_access`는 개별 회차 접근을 검사한다. `hf_begin_mock_attempt`, `hf_reveal_mock_answers`, 제출 RPC도 이를 사용한다.
- `supabase/functions/secure-mock/index.ts`, `secure-mock.js`의 `listExams`, `loadExam`, `loadAnswers`, `saveAttempt` 흐름을 재사용할 수 있다. 문항의 `typeKey`/`areaKey` 및 HF 유형 번호는 진단 정보이며 유형 승인 키가 아니다.

### Challenge의 이번 변경

- `challenge/access-catalog.js` 및 `supabase/functions/challenge-access/index.ts`의 고정 키 목록은 Challenge 전용이다. `challenge-concept-1/2`, `challenge-mock-1..4`, `challenge-bank-${typeId}`만 다룬다.
- `challenge/admin.js`는 기존 `admin-students`에서 학생 목록을 읽고, 바뀐 Challenge 승인만 새 `challenge-access`의 `set` 액션에 보낸다. 기존 학생이나 HF 권한을 자동 변경하지 않는다.
- `challenge/access-service.js`는 검증된 서버 응답의 승인·만료·학생 신원과 전달 준비 상태를 확인한다. 이 서비스를 기존 HF 진단/연습 화면이 호출하도록 변경하지 않았다.
- 자세한 검증 및 공개 차단 조건은 `challenge/ACCESS_CONTRACT.md`에 있다. 체크박스와 클라이언트 차단만으로 정적 문제/정답 파일이 보호되는 것은 아니다.

## 개별 승인을 완성할 때 필요한 최소 변경안 — 아직 미구현

### 1. HF 유형 승인: 기존 인증과 학생을 유지

- 기존 `hf_permission_catalog`, `hf_entitlements`, 서비스 전용 `hf_set_student_entitlement`를 재사용한다. 제안 키는 예를 들어 `hyperfocus-bank-q01`부터 `q54`까지 고정 54개이다. 이는 제안이며 현재 키나 승인 기록이 아니다.
- 새 `hyper-focus/type-access.js`와 `hyper-focus/supabase/functions/hyperfocus-type-access/index.ts`를 두는 방안이 가능하다. 전자는 서버에서 확인한 승인만 제공하고, 후자는 본인 조회와 관리자 변경을 분리한다. 정확한 유형 목록·관리자 역할·활성 세션·MFA·대상 학생·시작/만료를 서버에서 검사해야 한다.
- `admin.html`, `admin-app.js`에 기존 학생의 HF 유형 선택을 추가한다. `admin-students`의 일반 권한 허용 목록을 임의 문자열/정규식 허용으로 넓히지 않는다. 별도 고정 액션을 추가하는 대안도 가능하지만, Challenge 엔드포인트를 HF 전체 관리 API로 재해석하지 않는다.
- `diagnosis.html`의 목록 표시, 선택, 선택 복원, 유사문제 생성에서 같은 승인 집합을 사용한다. `mock/viewer.html`에서는 URL 유형을 정규화한 직후 승인 밖 유형을 거부하고, 문제 파일을 읽거나 생성하기 전에 확인한다.
- `mock/mock-core.js`의 생성·검산 로직은 유지한다. 필요하면 검증된 요청을 받는 경계 함수를 추가하되, 브라우저 함수 검사 자체를 서버 보안으로 취급하지 않는다.

### 2. 기존 학생 승인 보존은 별도의 전환 결정

기존 `hyperfocus` 승인 학생에게 새 유형 키가 없다는 이유로 즉시 전체 접근을 막으면 기존 권한의 자동 회수가 된다. 반대로 `기존 전체 승인 OR 개별 유형 승인`만 적용하면 기존 학생에게 개별 제한이 실제로 작동하지 않는다.

따라서 다음 단계에는 **관리자가 명시적으로 선택하는 학생별 개별 승인 전환 모드** 또는 동등한 사전 검토 절차가 필요하다. 전환 전에는 기존 의미를 유지하고, 전환 시 승인할 유형 목록과 영향을 보여 준 뒤 저장해야 한다. 전체 기존 학생에게 54키를 자동 부여하거나 기존 키를 일괄 회수하는 작업은 이 감사에서 실행하거나 승인한 바 없다.

### 3. 프리미어는 회차별 관리자 쓰기 경로만 추가

- 변경 대상은 `admin.html`, `admin-app.js`, `supabase/functions/admin-students/index.ts`, 그리고 새 로컬 마이그레이션의 단일 회차 승인 RPC이다. 새 마이그레이션 파일명은 아직 생성하지 않았다.
- 제안 액션 `set_mock_exam`은 임의 회차 UUID를 신뢰하지 않고 출시된 고정 회차 목록에 해당하는지 확인해야 한다. `mock/premier-release-catalog.js`는 목록 확인 참고 자료이고 클라이언트 목록 자체가 서버 권한 근거가 되어서는 안 된다.
- 새 RPC는 하나의 `hf_mock_entitlements`를 변경하고 파생 `mock` 권한을 일관되게 재계산하며, 변경자를 기록해야 한다. 기존 `hf_set_student_mock_bundle`의 전체 승인/회수 의미는 보존한다.
- 묶음 체크박스는 일부 회차만 승인된 상태를 표시해야 한다. 한 회차 취소가 다른 회차 승인이나 기존 응시 기록을 삭제하지 않도록 한다.
- 기존 `secure-mock`의 회차별 읽기 검사를 재사용할 수 있으므로 실제 시험 보안 전달을 다른 체계로 교체할 필요는 없다.

### 4. 비공개 전달 없이는 보안 완료가 아님

기존 `diagnosis.html`에는 정답을 포함한 진단 데이터가 있고, `mock/viewer.html`은 생성기 스크립트를 정적으로 불러온다. `mock/variation-bank.js`는 문제와 정답 데이터가 포함된 유사문제 자료를 읽는다. 화면 버튼을 숨겨도 정적 경로를 직접 요청할 수 있는 구조는 별도 문제다.

제안된 `supabase/functions/hyperfocus-practice/index.ts` 같은 비공개 연습 전달 경로 또는 동등한 서버 구조에서 학생·유형·난이도·문항 수를 다시 검증하고, 정답은 공개할 때 별도로 검증해야 한다. 보호 대상 정적 자료의 호스팅 차단도 증명해야 한다. 이 증명이 끝나기 전 `securePracticeDelivery`를 켜거나 Challenge의 전달 준비 플래그를 켜서는 안 된다. 비공개 전환과 원격 적용은 후속 작업이며 이 보고서는 이를 실행하지 않았다.

## 후속 검증 기준

1. 미승인 학생은 문제·정답 자료를 받지 못한다. 승인된 유형 1개만 가진 학생이 URL에 다른 유형을 넣어도 거부된다.
2. 학생 ID·권한 키·관리자 역할 위조, 임의 회차 요청, 만료 및 로그아웃 후 접근을 서버와 화면에서 거부한다.
3. 기존 학생은 관리자 전환 전 승인 범위가 바뀌지 않는다. 전환 후에는 선택한 유형만 허용된다.
4. 프리미어 한 회차 승인/취소가 다른 회차·응시 기록을 변경하지 않으며 묶음의 부분 승인 표시가 맞는다.
5. 승인 학생 이름은 서버의 현재 활성 프로필에서만 받아 문제·정답에 표시한다. 이름 입력/URL/로컬 저장값으로 승인 신원을 만들지 않는다.
6. 390px·데스크톱·인쇄와 직접 파일 요청을 함께 확인한다. 로컬 모의 응답 테스트, 실제 RLS 검증, 배포 완료는 각각 별도로 보고한다.
