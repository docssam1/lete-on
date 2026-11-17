# 황소 리포트 → 기본 하이퍼포커스 연결 (로컬 검수안, 미배포)

## 사용자 요구와 이전 동작
- 황소 리포트 자료실 승인 학생이 기본 하이퍼포커스를 별도 승인번호 없이 이용.
- 모의고사와 유료 추가문항 권한은 변경하지 않는다.
- 2026-08-23 전에는 자료실 `gname` → 공통 777200 자동입력, 이름/전화번호로 로컬 진도 저장.
- 94739a08 학생별 승인번호 전환에서 공통번호 흐름이 제거됨. 공개 이름/공통번호만으로 사칭 가능한 동작은 복원하지 않는다.

## 최소 구현
- main 프로젝트 기존 `hs-parent-auth?scope=hyperfocus`의 분리된 handler만 사용(함수 수 제한으로 새 함수 생성하지 않음). HF 프로젝트 DB/Auth/Edge Function 변경 **없음**.
- 자료실 기존 인증 세션, 기기, 활성 학생, 학부모 연결, 최신 GFIELD APPLICATION 폴더 승인 확인.
- 60초 한 번만 쓸 수 있는 handoff를 URL fragment로 전달, 수신 즉시 주소에서 제거.
- handoff를 최대 1시간의 별도 세션 토큰으로 회전. DB에는 SHA-256 해시만 저장.
- resume마다 원래 인증 세션/기기/학생/폴더 승인 재확인. 유효기간은 원본 JWT·인증 세션 만료 이내.
- HF `backend: hs-report`, `permissions: [hyperfocus]`만 사용. 새 HF 계정 생성/기존 계정 병합 없음.
- 기본 54유형 진단, 결과/해설·인쇄·교재 자동 연결. 유사문항은 기존 검수대기를 그대로 유지한다.
- 독립 검수에서 공개 generator의 seed 재생성 및 기존 held 게이트를 확인했다. 생성기 재연결안은 폐기했고 secure-practice-loader.js는 baseline과 완전히 동일하다. 자료실 모드에서 유사문항 버튼은 검수대기로 표시한다. 일반 학생/기존 모의고사 전달 경로는 변경하지 않는다.
- report 모드에서 모의고사로 확장되지 않으며 practice는 기존 서버 전달 검수 게이트로 차단된다. 공개 generator 자체 노출은 기존 사안이고 이 수정으로 보호했다고 주장하지 않는다.

## 진도 보존과 한계
- 기존 이름/전화번호 로컬 기록, GF 승인번호별 로컬 기록, HF 중앙 기록은 변경/삭제/자동 이관하지 않는다.
- 자료실 연결 기록은 `gfield_hf_report_<검증된 main UUID>` 로컬 키에 저장. 기존 모드와 충돌하지 않는다.
- 기존 승인번호 기록 보기 버튼으로 기존 로그인 유지.
- 기존 기록이 자동 합쳐지거나 기기 간 동기화되지는 않는다. 이름만으로 병합하지 않는다.
- 구식 비밀번호 로그인만 사용하여 등록 기기/학부모 인증이 없는 학생은 자료실 인증을 먼저 마쳐야 한다.

## 검증 상태
- main handoff/session/router 보안 단위테스트 35개 통과.
- HF 독립 VM/정적 회귀 10개 통과: 토큰회전, fragment 제거, paid scope 거절, 실패시 다른 학생 fallback 차단, clear race, 이름만 진입 거절, 별도 기록 키, 검수대기 게이트 보존 및 paid 범위 차단.
- 기존 Supabase foundation 테스트 통과. HTML inline JS, JS syntax, git diff-check 통과.
- 기존 secure-mock-ui 테스트 1개는 미변경 HEAD에서도 동일하게 실패(`viewer: secure-mock.js 연결 누락`), 현재 동적 loader와 오래된 정적 assertion의 불일치.
- 실제 Chromium 실행은 환경의 socket() Operation not permitted로 일반/승격 둘 다 불가. 브라우저 렌더·실학생 end-to-end·실DB SQL 적용 검증은 **미완료**.
- 아직 DB 적용/Edge 배포/커밋/푸시 없음. git push 사전확인은 GitHub 인증 미존재로 실패.

## 배포 전 게이트
1. 브라우저 실행 가능한 환경에서 로컬 API mock으로 진단/해설/인쇄/유사문항 검수대기/모의 차단/이탈·재시도 검증.
2. 별도 테스트 계정으로 실제 main 세션·기기·권한 검사 및 one-use/만료/권한회수 검증 (실학생 권한 변경 금지).
3. main SQL 서비스 역할 전용 실행권한 확인 후 Edge 배포; 기존 데이터 불변 확인.
4. 양쪽 저장소 최신 main 대비 diff 확인/승인된 push 경로 확보.
5. HF static 먼저, report static 나중 배포하여 초기 실패시 기존 GF 로그인은 유지.
6. 실배포 주소 재검증 전 완료라고 보고하지 않는다.

## 배포 준비 갱신
- Mac 실제 Chrome에서 v1 11/11, 자료실 33/33 통과. 엔드포인트 재사용 v2는 재검수 예정.
- main handoff 테이블/RPC additive 적용 완료, 행0, RLS와 서비스전용권한 확인. 기존학생데이터 변경0.
- 별도 Edge 생성은 Supabase 함수 개수 제한으로 거절. 요금제/지출한도 변경 없이 기존 hs-parent-auth에 명시 scope 분기 2줄만 추가하는 안으로 전환. 원본 v9 롤백 사본 확보.
