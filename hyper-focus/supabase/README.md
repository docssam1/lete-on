# Hyper Focus Supabase 전환 실행서

이 폴더는 Hyper Focus 전용 Supabase 기반입니다. 필즈더클래식의 기존 Supabase 프로젝트와 합치지 않습니다.

현재 상태는 **Hyper Focus 전용 원격 프로젝트·DB migration·두 Edge Function 배포 완료, 학생 전환·웹 배포 비활성**입니다. 프로젝트 `gfield-hyper-focus`(`uqtkxhchtbcizzteuvsq`, 서울 리전)는 기존 필즈더클래식 프로젝트와 분리되어 있습니다. `supabase-config.js`의 `enabled`는 의도적으로 `false`이며, 관리자 MFA·학생 재발급·실사용 RLS 검증 전에는 `true`로 바꾸지 않습니다.

## 절대 금지

- 브라우저 JS, Git, 로그, URL에 `sb_secret_...`, service-role 키, 관리자 비밀번호를 넣지 않습니다.
- 현재 `data.js`의 옛 승인번호를 Supabase에 복사하지 않습니다. 학생 전원에게 새 번호를 발급하고 옛 번호는 폐기합니다.
- 보안형 모의고사 로더와 서버 응시 저장이 완성되기 전에 `secureMockDelivery`를 켜지 않습니다.
- 실제 검증 전 이 브랜치를 보안 전환 완료로 `main`에 병합하지 않습니다.

## 새 프로젝트 적용 순서

1. Supabase에서 Hyper Focus 전용 프로젝트와 지역을 확정합니다. 기존 프로젝트 `fgahqumaldheqettmvqg`는 사용하지 않습니다.
2. CLI를 고정 버전으로 연결합니다.

   ```powershell
   npx -y supabase@2.115.0 link --project-ref <NEW_PROJECT_REF>
   npx -y supabase@2.115.0 db push --linked
   npx -y supabase@2.115.0 config push
   npx -y supabase@2.115.0 functions deploy admin-students
   npx -y supabase@2.115.0 functions deploy signed-asset-url
   ```

3. 관리자 계정을 로컬에서 한 번만 부트스트랩합니다. 관리자 이메일을 먼저 확정한 뒤 아래 래퍼를 실행합니다. secret key와 비밀번호는 마스킹된 로컬 프롬프트로만 입력되며 명령 인수·PowerShell 기록·Git에 넣지 않습니다. 래퍼는 실행이 끝나면 관련 환경 변수를 제거합니다.

   ```powershell
   .\hyper-focus\supabase\bootstrap-admin-local.ps1 -AdminEmail '<확정한 관리자 이메일>'
   ```

   Supabase Dashboard의 **Project Settings → API Keys**에서 해당 Hyper Focus 프로젝트의 `sb_secret_...` 키를 확인해 프롬프트에 입력합니다. 이 키는 브라우저 코드나 채팅에 붙여 넣지 않습니다.

4. `DOCSSAM`으로 로그인해 TOTP를 등록하고 6자리 인증을 완료합니다. 관리자 함수는 AAL2 세션만 허용합니다. 기본 TOTP MFA는 모든 Supabase 프로젝트에서 사용할 수 있습니다: <https://supabase.com/docs/guides/auth/auth-mfa/totp>
5. 관리자 화면에서 기존 학생 25명을 새 계정으로 만들고 새 승인번호를 한 번만 전달합니다. 번호는 공개 식별자 4자와 비밀 난수 16자로 구성되며 서버에도 원문을 저장하지 않습니다.
6. 옛 번호가 모두 폐기됐음을 확인한 뒤 `data.js`의 학생 승인번호 목록을 비웁니다. `enabled: true`만으로 이 공개 파일이 사라지지 않고 여러 화면이 계속 불러오므로, 실제 운영 전환은 레거시 기록 이관 확인과 공개 학생 명단 제거를 한 배포에서 함께 처리합니다. 첫 전환 기간에는 이 기기의 옛 전화번호·승인번호 기반 진단 기록을 인증된 RPC로 가져오되, 번호와 전화번호 자체는 업로드하지 않습니다. 공개 명단을 비운 뒤에도 브라우저에 승인번호 기록이 정확히 1명분만 있으면 로컬 키를 직접 찾아 이관하며, 공용 기기처럼 여러 명분이 있으면 오이관을 막기 위해 자동 선택하지 않습니다.
7. 유료 PDF·모의고사 manifest·정답·VIP 자료를 private Storage로 옮깁니다. 문제 manifest에는 정답을 넣지 않습니다.
8. 보안형 모의고사 `loadExam`과 서버 `saveAttempt`를 구현·검증한 뒤에만 `features.secureMockDelivery=true`로 바꿉니다. 그 전에는 학생 화면이 자동으로 `검수 대기` 잠금을 표시합니다.
9. `supabase-config.js`에는 프로젝트 URL, publishable 키, 관리자 이메일만 넣고 마지막에 `enabled=true`로 전환합니다.

## 원격 필수 검증

- 익명 사용자는 학생·권한·기록·private Storage를 읽지 못함
- 학생 A의 JWT로 학생 B의 UUID를 넣어도 읽기·쓰기가 모두 차단됨
- 번호 회전 직후 기존 access JWT와 refresh token이 모두 거부됨
- 새 번호 로그인은 새 `session_id`로 통과함
- 관리자 AAL1은 거부되고 AAL2만 통과함
- 정지·보관·권한 회수는 즉시 반영됨
- 레거시 이관을 두 번 실행해도 중복되지 않으며 충돌은 `review_pending`으로 남음
- 모의고사 manifest에 정답이 없고 답안 asset은 제출/공개 시각 정책을 통과한 뒤에만 보임
- 데스크톱과 모바일에서 로그인, 진단, 인쇄, 로그아웃을 실제 확인함
- Supabase Security Advisor와 Performance Advisor의 새 경고를 검토함

Supabase 세션의 `session_id`는 `auth.sessions` 행과 대응하며, 이 구현은 로그아웃·번호 회전 후 남은 JWT도 해당 행과 회전 시각으로 재검사합니다: <https://supabase.com/docs/guides/auth/sessions>

Free 요금제는 비용이 없지만 비활성 프로젝트 일시정지와 저장소 한도가 있으므로 실제 운영 전 정책을 다시 확인합니다: <https://supabase.com/pricing>

## 현재 잠금 항목

- 관리자 이메일 도메인 확정, 계정 부트스트랩과 TOTP 등록 미실행
- 실제 관리자·학생 두 계정을 사용한 AAL2, 교차 학생 차단, 번호 회전 RLS 통합 테스트 미실행
- 보안형 모의고사 loader/saveAttempt 미구현
- `data.js`의 기존 학생 명단·옛 승인번호 제거 전
- 앱 내 브라우저 연결 오류로 모바일·데스크톱 실제 화면 검수 미완료
- 현재 정적 레거시 관리자 로그인은 공개 SHA-256 비교이므로 임시 호환 모드일 뿐이며, Supabase+AAL2 전환 전에는 이 브랜치를 운영 보안 완료본으로 배포할 수 없음
- 승인번호 회전·계정 상태 변경은 학생별 DB 작업 잠금 후 Auth를 갱신하고 완료합니다. 작업 중에는 학생 RLS 접근을 즉시 막고, 중단된 작업은 15분 뒤 새 관리자 요청으로 덮어써 복구하므로 동시 실행으로 DB/Auth 버전이 엇갈리지 않습니다.

## Advisor 검토 기록

- `hf_submit_diagnosis`, `hf_import_legacy_diagnosis`의 `SECURITY DEFINER` 경고는 의도된 예외입니다. 두 함수 모두 JWT의 본인 ID만 사용하고 활성 세션·활성 `hyperfocus` 권한·입력 범위·학생별 잠금을 함수 안에서 재검사합니다.
- 새 빈 DB의 미사용 인덱스 안내는 실제 사용량이 쌓인 뒤 다시 판단합니다.
- 학생용 정책과 관리자용 정책이 나뉘어 발생하는 multiple permissive policy 알림은 역할별 접근 경로를 명확히 유지하기 위한 현재 설계입니다.
