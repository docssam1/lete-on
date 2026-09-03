# Hyper Focus 프로그램 허브 · 비공개 학습 전달 인수인계

기준일: 2026-09-03

담당 범위: `hyper-focus/**`

작업 브랜치: `codex/hf-program-hub`
Supabase 프로젝트: `uqtkxhchtbcizzteuvsq`

## 절대 범위

- 이 작업은 Hyper Focus 전용이다.
- 황소 초등·황소 중등·필즈 더 클래식·고등 선발 및 루트 공용 파일은 읽기 전용 참고만 가능하다.
- 학생 정보, 승인번호, 비공개 원본 경로, Storage 서명 URL과 서버 키는 Git에 기록하지 않는다.
- 원본 PDF는 공개 저장소에 넣지 않고 private Storage의 페이지 이미지로만 전달한다.

## 1~7 완료 상태

1. 프로그램 허브와 승인번호 로그인은 기존 학생 기록 마이그레이션을 보존한 채 유지한다.
2. 프리미어 모의고사 15회는 private Storage의 원본 페이지 이미지로 제공한다.
3. 원본 문항번호 20개를 유지하되 검증 완료 문항만 O/X 채점한다. 현재 채점 가능 221문항, 검수 제외 79문항이다.
4. 유형별·영역별 진단, 정답 열람 기록, 명시적 재응시 2·3회와 4회 차단을 서버에서 처리한다.
5. Hyper Focus 유사문제는 난이도별 2문항 무료 경로만 공개한다. 유료 추가 문제는 서버 전달 원본/API가 준비될 때까지 fail-closed로 잠근다.
6. VIP 라운지는 자료실·프리미엄 설명회·DOCSSAM 칼럼·교육 매거진 네 분류와 상호 연결을 지원한다. 학생은 공개 완료 콘텐츠와 활성 VIP 권한이 모두 있을 때만 private asset의 짧은 서명 URL을 받을 수 있다.
7. VIP 관리자 화면은 초안·검수 대기·검수 완료·공개·보관 상태, 관계 연결, PDF/JPG/PNG/WEBP/MP4 비공개 업로드를 지원한다.

## 서버 반영

- migration `secure_mock_sparse_marks_and_retakes`
- migration `vip_private_visibility`
- Edge Function `secure-mock` version 11, JWT 검증 활성
- Edge Function `admin-vip` version 1, JWT 검증 활성
- private bucket `hf-mock-private`
- private bucket `hf-vip-private`

## 핵심 파일

- 모의고사 서버: `supabase/functions/secure-mock/index.ts`
- VIP 관리자 서버: `supabase/functions/admin-vip/index.ts`
- 모의고사 화면: `mock/index.html`, `mock/viewer.html`, `secure-mock.js`, `mock/secure-flow.js`
- 15회 공개 카탈로그: `mock/premier-release-catalog.js`
- VIP 학생 화면: `vip/index.html`, `vip/app.js`
- VIP 관리자 화면: `vip/admin.html`, `vip/admin.js`, `vip/admin.css`
- private release 생성·동기화: `qa/build_premier_secure_release.cjs`, `qa/sync_premier_secure_manifests.cjs`

## 검증 결과

- variation 54유형, variation JSON 108개, var01/var02 정답 충돌 0
- 생성기·단일해·시점 검산 통과
- 프리미어 15회, 문제지 67쪽, 채점 가능 221문항, 검수 제외 79문항
- 실제 서버 재응시 1·2·3회 성공, 4회째 HTTP 409 차단
- 실제 서버 VIP 목록·초안·관계·비공개 업로드 서명 통과
- 일회성 QA 학생·관리자·콘텐츠 잔여 0건
- PC 1440px·모바일 390px 포털/VIP 관리자 가로 넘침 0, 페이지 오류 0

## 반드시 잠금 유지할 항목

- 유료 추가 문제 3문항 이상: private 문제 원본과 서버 문제은행 API가 없으므로 `securePracticeDelivery`를 `false`로 유지한다.
- 원본/정답 대조가 끝나지 않은 문항: `excluded` 또는 검수 대기 상태를 유지한다.
- 관리자 실제 계정의 비밀번호를 코드나 문서에 쓰지 않는다. 라이브 관리자 브라우저 검수는 사용자가 직접 로그인한 세션에서 수행한다.

## 후속 작업

1. 유료 문제은행용 private manifest와 서버 생성/전달 API를 별도 설계한다.
2. 서버 검증을 통과한 뒤에만 `securePracticeDelivery`를 `true`로 바꾼다.
3. VIP 콘텐츠는 관리자 화면에서 초안으로 올린 뒤 검수 완료 후 공개한다.
4. Supabase Advisor의 기존 경고는 별도 보안 작업으로 처리한다. 학생이 호출하는 진단 RPC 두 개는 의도된 호출인지 함수 내부 검사를 다시 확인하고, 유출 비밀번호 보호 설정은 운영 정책에 맞춰 켠다.

## 배포 확인 주소

- 학생 허브: `https://lete-on.gfieldacademy.net/hyper-focus/`
- 모의고사/진단: `https://lete-on.gfieldacademy.net/hyper-focus/mock/`
- VIP 라운지: `https://lete-on.gfieldacademy.net/hyper-focus/vip/`
- 학생 권한 관리: `https://lete-on.gfieldacademy.net/hyper-focus/admin.html`
- VIP 콘텐츠 관리: `https://lete-on.gfieldacademy.net/hyper-focus/vip/admin.html`

## 금지

- 검수 전 문항 공개
- 브라우저 코드에 정답·비공개 경로·서버 키 삽입
- 유료 문제를 브라우저 생성기로 우회 제공
- `premier/**`, 다른 제품, 루트 공용 파일을 이 작업 브랜치에 함께 커밋
- `supabase/.temp/`, `tmp/`, 원본 PDF와 QA 스크린샷 커밋
