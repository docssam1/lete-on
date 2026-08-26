# Supabase 전환 준비

이 저장소의 `supabase/`는 기존 Reading World Supabase 프로젝트 안에서 **GFIELD 선발·진단용 `hs_` 영역만 분리**해 사용한다. 기존 Reading World와 Hyper Focus의 테이블, Storage 버킷, 데이터를 변경하지 않는다.

## 이번 단계의 범위

- 시험 초안 편집기의 검증 후보, 초안, 배치, 교체 이력, 감사 이력만 영속화할 데이터 계약을 만든다.
- 원문 문항, 정답값, 해설, PDF 주소, 원본 저장 경로, 학생 개인정보는 이 migration에 넣지 않는다.
- 브라우저의 직접 테이블 접근은 허용하지 않는다. 모든 테이블에 RLS를 켜고 `anon`, `authenticated` 권한을 회수한다.
- 이후 검증된 Edge Function이 관리자 JWT를 확인한 뒤에만 이 계약을 사용한다. `service_role` 또는 secret 키는 브라우저·Git·정적 설정에 넣지 않는다.

## 배포 상태와 아직 잠긴 단계

- `20260825092754_highselect_secure_draft_foundation.sql`은 2026-08-26 Reading World 원격 프로젝트에 적용했다.
- `draft-admin` Edge Function v1을 배포했고 GitHub Pages 운영 origin만 CORS 허용했다.
- 여섯 개 신규 테이블은 RLS가 켜져 있으며 `anon`, `authenticated` 직접 조회 권한이 모두 없다.
- 관리자 Auth 사용자에 `app_metadata.gfield_role=admin`을 부여하고 `hs_staff_accounts` 활성 행을 연결하는 작업은 아직 남아 있다.
- GitHub Pages 시험 빌더는 아직 Edge Function으로 전환하지 않았다.
- 학생 로그인·진단 제출·채점·비공개 시험지 Storage는 별도 migration과 Edge Function 검증 후에만 옮긴다.
- 원격 PostgreSQL에서 검증 함수의 허용·거부 결과와 RLS/직접 권한을 확인했다. 실제 관리자·학생 계정 교차 검증은 계정 연결 후 진행한다.
- 기존 Reading World의 공개 교재·학생 기록 권한 강화는 사용자 결정에 따라 후속 작업으로 분리했다.

## 적용 순서

1. 관리자 계정에만 서버 측에서 `app_metadata` 역할을 부여하고 MFA를 등록한다. `user_metadata`는 권한 판단에 사용하지 않는다.
2. `hs_staff_accounts`에 같은 Auth 사용자 ID를 활성 상태로 등록한다.
3. Edge Function의 후보 등록·초안 CRUD·감사 기록을 구현하고 관리자 허용/일반 사용자 거부 테스트를 작성한다.
4. 기존 Node 서버와 병행 검증한 뒤에만 GitHub Pages의 API 대상을 전환한다.

현재 단계는 원문과 정답을 노출하지 않는 원격 데이터 기반과 관리자 읽기 게이트까지 배포한 상태다.

## Edge Function 읽기 게이트

`supabase/functions/draft-admin`은 아직 화면에 연결하지 않은 관리자 전용 읽기 게이트다. `GET`만 허용하며 `action=readiness`와 `action=candidates&mode=SH`만 지원한다. 원문·정답·해설·저장 경로를 선택하거나 반환하지 않는다.

- Supabase Auth 사용자와 `hs_staff_accounts.status=active`를 모두 확인한다.
- 권한은 서버가 설정한 `app_metadata.gfield_role=admin`만 사용한다. 브라우저가 수정할 수 있는 `user_metadata`는 사용하지 않는다.
- `HIGHSELECT_ALLOWED_ORIGINS`에는 운영 GitHub Pages 주소와 필요한 로컬 개발 주소만 JSON 배열로 설정한다. 와일드카드는 사용하지 않는다.
- `SUPABASE_SECRET_KEY` 또는 레거시 `SUPABASE_SERVICE_ROLE_KEY`는 Edge Function 비밀값으로만 설정한다. 공개 코드·브라우저 설정에는 넣지 않는다.
- 초안 생성·수정·승인 API와 GitHub Pages 전환은 원격 DB/RLS 검증 후에만 추가한다.
