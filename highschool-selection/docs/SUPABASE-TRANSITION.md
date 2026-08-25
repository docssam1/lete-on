# Supabase 전환 준비

이 저장소의 `supabase/`는 **별도 GFIELD 선발·진단 프로젝트**에 연결할 준비물이다. 기존 Hyper Focus 전용 프로젝트의 테이블, Storage 버킷, Auth 사용자를 공유하지 않는다.

## 이번 단계의 범위

- 시험 초안 편집기의 검증 후보, 초안, 배치, 교체 이력, 감사 이력만 영속화할 데이터 계약을 만든다.
- 원문 문항, 정답값, 해설, PDF 주소, 원본 저장 경로, 학생 개인정보는 이 migration에 넣지 않는다.
- 브라우저의 직접 테이블 접근은 허용하지 않는다. 모든 테이블에 RLS를 켜고 `anon`, `authenticated` 권한을 회수한다.
- 이후 검증된 Edge Function이 관리자 JWT를 확인한 뒤에만 이 계약을 사용한다. `service_role` 또는 secret 키는 브라우저·Git·정적 설정에 넣지 않는다.

## 아직 잠긴 단계

- 이 migration은 어느 Supabase 원격 프로젝트에도 적용하지 않았다.
- 새 프로젝트의 조직, 리전, 운영 도메인, 관리자 계정은 아직 확정되지 않았다.
- 학생 로그인·진단 제출·채점·비공개 시험지 Storage는 별도 migration과 Edge Function 검증 후에만 옮긴다.
- Docker가 없는 현재 작업 환경에서는 실제 PostgreSQL migration/RLS 실행 검증을 할 수 없다. 원격 적용 전 `supabase start`, `supabase test db`, Security Advisor와 실제 관리자·학생 계정 교차 검증이 필요하다.

## 적용 순서

1. 별도 Supabase 프로젝트를 만들고 운영 리전과 도메인을 확정한다.
2. 이 폴더에서 프로젝트를 연결한 뒤 migration을 적용한다.
3. 관리자 계정에만 서버 측에서 `app_metadata` 역할을 부여하고 MFA를 등록한다. `user_metadata`는 권한 판단에 사용하지 않는다.
4. Edge Function의 관리자 인증·후보 등록·초안 CRUD·감사 기록을 구현하고, 허용/거부 RLS 테스트를 작성한다.
5. 기존 Node 서버와 병행 검증한 뒤에만 GitHub Pages의 API 대상을 전환한다.

현재 단계는 운영 배포가 아니라, 원문과 정답을 노출하지 않는 데이터 기반을 잠근 상태다.
