# Hyper Focus Supabase 전환 실행서

이 폴더는 Hyper Focus 전용 Supabase 기반입니다. 필즈더클래식의 기존 Supabase 프로젝트와 합치지 않습니다.

현재 상태는 **Hyper Focus 전용 원격 프로젝트·기존 DB migration·기존 두 Edge Function 배포 완료, 보안형 모의고사 코드와 화면 연결은 로컬 브랜치에서 검증 완료, 학생 전환·웹 배포 비활성**입니다. 프로젝트 `gfield-hyper-focus`(`uqtkxhchtbcizzteuvsq`, 서울 리전)는 기존 필즈더클래식 프로젝트와 분리되어 있습니다. 새 `secure-mock` migration과 Edge Function은 아직 원격에 적용하지 않았다. `supabase-config.js`의 `enabled`와 `features.secureMockDelivery`는 의도적으로 `false`이며, 실제 학생·회차별 권한·private asset E2E 전에는 바꾸지 않습니다.

## 절대 금지

- 브라우저 JS, Git, 로그, URL에 `sb_secret_...`, service-role 키, 관리자 비밀번호를 넣지 않습니다.
- 현재 `data.js`의 옛 승인번호를 Supabase에 복사하지 않습니다. 학생 전원에게 새 번호를 발급하고 옛 번호는 폐기합니다.
- 보안형 모의고사 화면 연결과 실제 DB·Storage E2E가 완성되기 전에 `secureMockDelivery`를 켜지 않습니다.
- 실제 검증 전 이 브랜치를 보안 전환 완료로 `main`에 병합하지 않습니다.

## 새 프로젝트 적용 순서

1. Supabase에서 Hyper Focus 전용 프로젝트와 지역을 확정합니다. 기존 프로젝트 `fgahqumaldheqettmvqg`는 사용하지 않습니다.
2. CLI를 고정 버전으로 연결합니다. 새 빈 프로젝트를 처음 구성할 때는 아래 순서로 적용합니다.

   ```powershell
   npx -y supabase@2.115.0 link --project-ref <NEW_PROJECT_REF>
   npx -y supabase@2.115.0 db push --linked
   npx -y supabase@2.115.0 config push
   npx -y supabase@2.115.0 functions deploy admin-students
   npx -y supabase@2.115.0 functions deploy signed-asset-url
   npx -y supabase@2.115.0 functions deploy secure-mock
   ```

   이미 기존 `signed-asset-url`이 배포된 현재 프로젝트에 보안형 모의고사를 추가할 때는 일반 서명 함수 수정본을 먼저 배포하고, 그다음 `db push` → `config push` → `secure-mock` 배포 순서를 지킵니다. 새 migration이 저장소 경로 열의 학생 직접 조회를 먼저 막기 때문에 순서를 바꾸면 기존 서명 함수가 잠시 실패할 수 있습니다. 실제 적용은 1회분 개발 데이터와 복구 지점을 준비한 별도 승인 작업으로 진행합니다.

3. 관리자 계정을 로컬에서 한 번만 부트스트랩합니다. 관리자 이메일을 먼저 확정한 뒤 아래 래퍼를 실행합니다. secret key와 비밀번호는 마스킹된 로컬 프롬프트로만 입력되며 명령 인수·PowerShell 기록·Git에 넣지 않습니다. 래퍼는 실행이 끝나면 관련 환경 변수를 원래 값으로 되돌립니다.

   ```powershell
   .\hyper-focus\supabase\bootstrap-admin-local.ps1 -AdminEmail '<확정한 관리자 이메일>'
   ```

   Windows에서는 `hyper-focus/supabase/run-bootstrap-admin.cmd`를 더블클릭해도 같은 마스킹 입력 창을 열 수 있습니다.

   Supabase Dashboard의 **Project Settings → API Keys**에서 해당 Hyper Focus 프로젝트의 `sb_secret_...` 키를 확인해 프롬프트에 입력합니다. 이 키는 브라우저 코드나 채팅에 붙여 넣지 않습니다.

4. `DOCSSAM`으로 로그인해 TOTP를 등록하고 6자리 인증을 완료합니다. 관리자 함수는 AAL2 세션만 허용합니다. 기본 TOTP MFA는 모든 Supabase 프로젝트에서 사용할 수 있습니다: <https://supabase.com/docs/guides/auth/auth-mfa/totp>
5. 관리자 화면에서 학생 계정을 만들고 승인번호를 한 번만 전달합니다. 소규모 Hyper Focus 운영에서는 `GF-7265`처럼 `GF-` 뒤 숫자 4자리 형식을 사용하며, 기존에 발급된 20자리 코드는 전환 기간 동안 계속 허용합니다. 짧은 코드는 학생 수가 적은 운영에만 사용하고, 서버는 원문 승인번호를 별도 저장하지 않습니다.
6. 옛 번호가 모두 폐기됐음을 확인한 뒤 `data.js`의 학생 승인번호 목록을 비웁니다. `enabled: true`만으로 이 공개 파일이 사라지지 않고 여러 화면이 계속 불러오므로, 실제 운영 전환은 레거시 기록 이관 확인과 공개 학생 명단 제거를 한 배포에서 함께 처리합니다. 첫 전환 기간에는 이 기기의 옛 전화번호·승인번호 기반 진단 기록을 인증된 RPC로 가져오되, 번호와 전화번호 자체는 업로드하지 않습니다. 공개 명단을 비운 뒤에도 브라우저에 승인번호 기록이 정확히 1명분만 있으면 로컬 키를 직접 찾아 이관하며, 공용 기기처럼 여러 명분이 있으면 오이관을 막기 위해 자동 선택하지 않습니다.
7. 유료 PDF·모의고사 manifest·정답·VIP 자료를 private Storage로 옮깁니다. 문제 manifest에는 정답을 넣지 않습니다.
8. 보안형 모의고사 `listExams`·`loadExam`·`loadAnswers`·`saveAttempt` 서버 계약, 화면 연결, 실제 DB·Storage E2E를 모두 검증한 뒤에만 `features.secureMockDelivery=true`로 바꿉니다. 그 전에는 학생 화면이 자동으로 `검수 대기` 잠금을 표시합니다.
9. `supabase-config.js`에는 프로젝트 URL, publishable 키, 관리자 이메일만 넣고 마지막에 `enabled=true`로 전환합니다.

모의고사 판매 권한은 일반 `permission_key='mock'`로 전체 회차를 열지 않습니다. `20260823162348_secure_mock_product_bundles.sql`의 `hf_set_student_mock_bundle`이 활용 8회·파이널 3회·최종 4회 상품을 정확한 회차별 `hf_mock_entitlements` 행으로 원자적으로 승인·회수합니다. 브라우저는 회차 ID 목록이나 개수를 보내지 않고 `set_mock_bundle`에 `studentId`, 고정 `bundleKey`, `enabled`만 보냅니다. 원격 관리자 화면에는 일반 `mock` 체크박스가 없고, 상품별 `full`·`partial`·`none`·`catalog_error` 상태를 표시합니다.

학생 포털은 큰 온라인 모의고사 책을 여는 메뉴 권한과 실제 회차 자료 권한을 분리합니다. 큰 책은 항상 기존 상품 권한으로 잠금/열림을 표시하지만, 내부 15회 목록은 공개 안전 카탈로그와 인자 없는 `listExams()` RLS 응답의 교집합만 링크로 만듭니다. 기능 플래그가 꺼지거나 목록 확인이 실패하면 모두 잠급니다.

영상 해설을 보며 정답을 열지 않고 O/X를 제출하는 경로와, 정답을 연 뒤 제출하는 경로는 모두 지원합니다. 정답 버튼은 현재 즉시 공개 동작이며 `answers_released_at`은 지연 공개 차단에 사용하지 않습니다.

## 원격 필수 검증

- 익명 사용자는 학생·권한·기록·private Storage를 읽지 못함
- 학생 A의 JWT로 학생 B의 UUID를 넣어도 읽기·쓰기가 모두 차단됨
- 번호 회전 직후 기존 access JWT와 refresh token이 모두 거부됨
- 새 번호 로그인은 새 `session_id`로 통과함
- 관리자 AAL1은 거부되고 AAL2만 통과함
- 정지·보관·권한 회수는 즉시 반영됨
- 레거시 이관을 두 번 실행해도 중복되지 않으며 충돌은 `review_pending`으로 남음
- 모의고사 manifest에 정답이 없고 답안 asset은 명시적인 정답 열람 RPC가 열람 시각을 기록한 뒤에만 보임. 영상 채점 제출만으로는 열리지 않음
- 데스크톱과 모바일에서 로그인, 진단, 인쇄, 로그아웃을 실제 확인함
- Supabase Security Advisor와 Performance Advisor의 새 경고를 검토함

Supabase 세션의 `session_id`는 `auth.sessions` 행과 대응하며, 이 구현은 로그아웃·번호 회전 후 남은 JWT도 해당 행과 회전 시각으로 재검사합니다: <https://supabase.com/docs/guides/auth/sessions>

Free 요금제는 비용이 없지만 비활성 프로젝트 일시정지와 저장소 한도가 있으므로 실제 운영 전 정책을 다시 확인합니다: <https://supabase.com/pricing>

## 현재 잠금 항목

- Supabase 관리자 부트스트랩·TOTP 전환은 사용자 결정으로 이번 작업 범위에서 보류했으며, 현재 승인번호 관리자 흐름을 유지함
- 실제 관리자·학생 두 계정을 사용한 AAL2, 교차 학생 차단, 번호 회전 RLS 통합 테스트 미실행
- 보안형 모의고사 전달 코드와 정적 계약 검사는 완료했고, 원본 PDF 쪽을 HTML로 재편집하지 않는 `page_images` manifest v2·private `page` 자산·서명 URL 뷰어 계약도 로컬에 추가함. 새 migration·Edge Function은 원격 미적용이며 private asset·회차 데이터 없음
- `mock/index.html`·`mock/viewer.html` 화면 연결, 영상 채점·답안 열람 채점, 제출 잠금, 회차별 RLS, 포털 15회 목록, 관리자 8·3·4 상품 토글 계약은 로컬 검증 완료. 실제 DB 적용과 명시적 2·3회차 재응시 흐름은 미구현
- 난이도별 3번째 이후 유료 맞춤 문제는 아직 공개 브라우저 생성기와 `accessTier`에 의존하므로 서버 보안 경계가 아님. 별도 Secure Problem Bank API·RLS로 옮기기 전에는 유료 보호 완료로 간주하거나 공개 판매하지 않음
- `data.js`의 기존 학생 명단·옛 승인번호 제거 전
- 로컬 모의 서버 기반 Chromium에서 데스크톱·390px 모바일 화면은 통과했지만 실제 Supabase 데이터와 운영 브라우저 E2E는 미완료
- 현재 정적 레거시 관리자 로그인은 공개 SHA-256 비교이므로 임시 호환 모드일 뿐이며, Supabase+AAL2 전환 전에는 이 브랜치를 운영 보안 완료본으로 배포할 수 없음
- 승인번호 회전·계정 상태 변경은 학생별 DB 작업 잠금 후 Auth를 갱신하고 완료합니다. 작업 중에는 학생 RLS 접근을 즉시 막고, 중단된 작업은 15분 뒤 새 관리자 요청으로 덮어써 복구하므로 동시 실행으로 DB/Auth 버전이 엇갈리지 않습니다.

## Advisor 검토 기록

- `hf_submit_diagnosis`, `hf_import_legacy_diagnosis`의 `SECURITY DEFINER` 경고는 의도된 예외입니다. 두 함수 모두 JWT의 본인 ID만 사용하고 활성 세션·활성 `hyperfocus` 권한·입력 범위·학생별 잠금을 함수 안에서 재검사합니다.
- 새 빈 DB의 미사용 인덱스 안내는 실제 사용량이 쌓인 뒤 다시 판단합니다.
- 학생용 정책과 관리자용 정책이 나뉘어 발생하는 multiple permissive policy 알림은 역할별 접근 경로를 명확히 유지하기 위한 현재 설계입니다.
