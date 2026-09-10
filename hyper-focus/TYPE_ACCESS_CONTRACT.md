# Hyper Focus 문제은행 유형별 승인 계약

2026-09-09 · 로컬 구현 및 모의 검증. 원격 DB 변경·함수 배포·실제 학생 승인 변경 없음.

## 범위

유사문제와 문제은행의 HF 1~54유형에만 적용한다. 본 진단의 문제 선택·채점·응시 기록·기존 승인번호·프리미어 모의고사·VIP는 변경하지 않는다. 유형 이름은 기존 `diagnosis.html`의 번호/이름에서 추출한 표시 정보만 보관한다. 관리자 화면은 문제나 답안을 불러오지 않는다.

새 키는 `hyperfocus-bank-q01`~`hyperfocus-bank-q54`와 `hyperfocus-bank-individual-mode` 총 55개이다. 마지막 키가 없는 기존 학생은 기존 상품 승인 방식이다. 유형 키를 저장하는 것만으로 개별 승인 방식으로 전환되지 않는다. 관리자가 전환 체크박스를 직접 선택하고 저장한 학생만 개별 유형 검사를 적용한다. 모드 해제 역시 명시적인 저장으로만 수행한다.

관리자 화면에는 현재 방식, 저장 후 방식, 선택된 유형 수, 0유형이면 이용 불가라는 영향을 표시한다. 유형 변경을 먼저 저장하고 모드 변경은 마지막에 저장한다. 중간 실패 시 성공한 항목만 원래 상태에 반영하고 나머지 변경은 남긴다. 기존 전체 승인을 자동 회수하거나 54개 키를 일괄 자동 부여하지 않는다.

## 브라우저 API

로드 순서: `supabase-config.js`, `supabase-client.js`, `type-access-catalog.js`, `type-access.js`. 유료 연습에는 기존 `mock/access-policy.js`도 필요하다.

| API | 의미 |
| --- | --- |
| `HFTypeAccess.ready()` / `refresh()` | 본인 서버 승인 재확인. 동시 호출은 같은 요청을 공유 |
| `status()` | `verified`, `mode`, `hasBaseAccess`, `hasPaidAccess`, `validUntil` |
| `allowType(id, {paid:false})` | 유효한 서버 승인 + 기존 `hyperfocus` 필요. 개별 모드면 해당 유형 키도 필요 |
| `allowType(id, {paid:true})` | 위 조건 + 기존 `hyperfocus-extra` 또는 `problem-bank` + `HFAccessPolicy.paidPracticeReady()===true` |
| `watermarkIdentity()` | 현재 서버 프로필의 `{studentId,name}` 복사본 또는 null |
| `approvedStudentName()` | 위 이름 또는 빈 문자열 |
| `clear()` | 승인·이름·두 타이머를 지우고 이전 요청 무효화 |
| `isTeacherPreview()` | 실제 localhost/127.0.0.1/[::1]의 `?teacherPreview=1`만 허용 |

`hasPaidAccess`는 상품 권한 유무이지 비공개 전달 준비 완료라는 뜻이 아니다. 실제 사용 판정은 `allowType(id,{paid:true})`로 한다. 서버 미응답·만료·잘못된 응답에서는 false이며 URL/로컬 저장소의 승인·이름을 대신 사용하지 않는다. 명시적 로컬 교사 미리보기는 서버 호출 없이 허용하지만 승인 학생 이름을 만들지 않는다. 운영 주소나 file URL의 같은 쿼리는 우회 수단이 아니다.

서버 유효기간은 최대 60초이며 통상 45초에 배경 갱신한다. 재확인 중에도 기존 유효기간을 넘기지는 않는다. 신원·이름·기본 권한·유형 권한이 같으면 화면 제거 이벤트 없이 유효기간만 갱신한다. 일반 `TOKEN_REFRESHED`도 같은 경로를 사용한다. 실패·만료·로그아웃·사용자 변경은 기존 승인과 이름을 제거한다. 늦은 이전 요청과 이전 유효기간 타이머가 새 상태를 되살리거나 제거하지 못하도록 검사한다.

`hf-type-access-change` 이벤트는 최초 확인/권한·신원 변경/실패/만료/세션 변경 시 발생한다. 연결 화면은 기존 출력물의 신원·승인 범위를 다시 확인하고 맞지 않는 문제·정답·이름을 즉시 제거해야 한다. 동일 상태 배경 갱신에는 이벤트가 없다. `diagnosis.html`, `mock/viewer.html`의 실제 호출 경계 연결은 부모 작업 범위이다.

## 서버

`supabase/functions/hyperfocus-type-access/index.ts`는 기존 SDK 버전 `2.112.3`를 고정하고 Auth `getUser(token)` 및 기존 HF의 호출자 RLS를 사용한다.

- `self`: `action`만 허용한다. 본인의 활성 `hf_students` 프로필과 `hf_entitlements`만 읽는다. 기존 학생 RLS의 활성 세션·로그인 버전·자격 변경 검사를 재사용한다. 반환은 활성 55키와 별도 기본 상품 3키, 서버 이름/ID, 시간/버전이다. 다른 학생 ID를 지정할 수 없다.
- `set`: `action,studentId,permissionKey,enabled`만 허용한다. 고정 55키, UUID, boolean을 검증한다. Auth와 JWT 양쪽 관리자 역할, `aal2`, 호출자 RLS로 조회 가능한 활성 `hf_admin_accounts`, 권한 변경보다 새 토큰을 요구한다. 사용자 수정 가능 `user_metadata`는 사용하지 않는다.
- 요청한 대상 학생과 설치된 카탈로그를 확인한 뒤 서비스 전용 기존 `hf_set_student_entitlement` RPC에 한 키만 위임한다. 다른 프로그램 키·와일드카드·임의 필드를 받지 않는다. 비활성 학생 신규 승인은 막으며 회수 API는 가능하다. 현재 화면은 비활성 학생 수정 전체를 막는다.
- 허용 출처, POST JSON, 4KB 한도, no-store 응답을 적용한다. 서비스 키는 브라우저로 반환하지 않는다.

로컬 마이그레이션 `supabase/migrations/20260909013000_hyperfocus_type_permission_catalog.sql`은 기존 권한 카탈로그에만 INSERT하며 충돌 시 유지한다. 스키마/RLS/학생 행/기존 승인을 변경하지 않는다. 범위 밖 캐시를 만드는 CLI 재사용 금지 지시에 따라 로컬 파일만 작성했고 적용하지 않았다.

관리자 화면은 `type-admin.html/js/css`이며 기존 `admin.html`에 링크 하나만 추가했다. 기존 `admin-students`의 실제 학생 목록 API를 재사용하고 새 전용 API로 바뀐 키만 저장한다. 기존 일반 권한 허용 목록을 넓히지 않았다. 서버 로그인 변경/만료 시 관리자 화면도 학생 목록과 이름을 지운다.

## 검증 및 보류

`qa/validate_hyperfocus_type_access.cjs --browser`: 283항목 통과. 실제 서버 TypeScript에서 타입만 제거한 코드를 실행하고 Auth/DB 의존성을 모의 처리했다. 무권한·MFA 부족·역할 위조·다른 학생·만료·잘못된 키·모드/유형 저장·기존 54유형 유지·유료 준비 차단·동일 토큰 갱신 보존·신원 변경 이벤트·실패·로그아웃·이전 응답·부분 저장을 확인했다. 백그라운드 탭에서 만료 타이머가 지연되어도 기존 유효기간을 넘겨 도착한 갱신 응답은 거부한다.

실제 관리자 페이지의 1200px/390px 캡처를 직접 확인했다. 가로 넘침 0, 자바스크립트 오류 0, 모바일 입력 16px. 증거는 `output/qa/hyperfocus-type-access/`에 있다. 테스트 학생은 합성 자료이며 실제 학생 조회나 원격 쓰기는 없다. 본 작업은 인쇄물 작성이 아니므로 PDF 검수는 해당 없음.

**운영 공개 보류:** 이 API는 승인 기반이지 비공개 문제 전달 서버가 아니다. 기존 정적 진단·생성기·유사문제/정답 파일의 직접 요청 가능성을 제거하지 않았다. 기존 `securePracticeDelivery` 플래그를 켜지 않았다. 비공개 문제·정답 전달 및 호스팅 차단, 실제 RLS 실행, 함수 설정·배포, 승인 전환 운영 검증을 완료하기 전에는 자료 보호나 운영 배포가 완료됐다고 표시하지 않는다.

별도 HF54 연습 전달 서버와 교사용 패키지는 `HF_PRIVATE_DELIVERY.md`에 기록한다. 이 추가 구현은 본 진단 HTML 안에 있는 기존 정답·해설을 제거한 것이 아니다. 진단·채점·기록 보존 경계와 공개 자료 분리 작업은 구분하며, 기본 진단의 자료 구조 변경 없이 전체 HF 정답 보호가 완료됐다고 표시하지 않는다.

설계 검증은 Supabase 공식 [함수 인증](https://supabase.com/docs/guides/functions/auth), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [변경 이력](https://supabase.com/changelog.md)을 확인했다. 현재 문서의 새 래퍼로 기존 인증을 일괄 교체하지 않고 기존 고정 SDK/RLS 방식을 유지했다. 지필드 디자인 지침은 기존 학생 관리와의 연결, 읽기 쉬운 유형명, 선택 유지와 모바일 조작에 적용했다.
