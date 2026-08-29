# Hyper Focus Claude 인수인계서

> 작성일: 2026-08-30 (KST)  
> 담당 범위: **`hyper-focus/**`만**  
> 이 문서는 공개 Git 저장소에 둘 수 있도록 작성했다. 비밀번호, Supabase secret/service-role 키, 학생 실명·승인번호, 원본 PDF·답안의 로컬 경로는 적지 않는다.

## 0. Claude가 먼저 읽을 것

1. 이 문서
2. 저장소 최상위 `AGENTS.md`
3. `hyper-focus/docs/HANDOFF_PORTAL_ARCHITECTURE.md`
4. `hyper-focus/supabase/README.md`
5. 쌓기나무·색·접기 등 시각 문항을 만들거나 고칠 때: `E:\Codex\skills\gfield-single-answer-visibility\SKILL.md`

다른 제품(황소 초등·중등, 필즈 더 클래식, 고등 선발, 공통 루트 파일)은 **읽기 전용 참고만 가능**하며 수정·포맷·커밋·배포하지 않는다. 공용 파일이 꼭 필요하면 영향 파일을 먼저 사용자에게 알리고 승인을 받는다.

## 1. 가장 안전한 시작 경로

로컬 복사본을 신뢰 기준으로 삼지 말고 GitHub에서 새로 복제한다.

```powershell
git clone https://github.com/docssam1/lete-on.git
Set-Location .\lete-on
git fetch origin --prune
git switch codex/hf-program-hub
git status --short
git log -5 --oneline
```

- 현재 작업 브랜치: `codex/hf-program-hub`
- 마지막 로컬·배포 기준 커밋: `b4f7b5e6e14b0fad5fc977654a8b4c5084c0381d`
- 이 기준에서는 `origin/main`과 작업 브랜치가 같은 커밋이었다.
- 2026-08-30에 GitHub 직접 조회는 네트워크 제한으로 재확인하지 못했다. 따라서 새 작업 시작 시 반드시 `git fetch origin --prune` 후 실제 원격 SHA를 확인한다.
- 기존 C: 작업본(참고 전용): `C:\Users\user\.codex\.chatgpt-projects\g-p-6a33de2990d481918518a9a957dbb24e\lete-on-hf-hub`
- E:의 동명 사본은 `supabase-config.js`가 `enabled:false`인 **이전 사본**으로 확인됐다. 작업·배포 기준으로 사용하지 않는다.

Git 작업 전에는 항상 아래를 확인한다.

```powershell
git branch --show-current
git status --short
git log -3 --oneline
git fetch origin --prune
git rev-parse HEAD
git rev-parse origin/main
```

`git reset`, `git clean`, 강제 푸시, 임의 브랜치 변경, 다른 작업자의 변경 삭제는 금지다. `main`은 사용자 승인 없이 병합·푸시하지 않는다.

## 2. 현재 운영 상태

### 학생 포털과 승인번호

- 학생 포털: <https://lete-on.gfieldacademy.net/hyper-focus/>
- 관리자 화면: <https://lete-on.gfieldacademy.net/hyper-focus/admin.html>
- Supabase 프로젝트는 Hyper Focus 전용이며 현재 웹 클라이언트 연결이 켜져 있다.
- `hyper-focus/supabase-config.js`: `enabled: true`, `features.secureMockDelivery: true`
- 학생은 `GF-` + 숫자 4자리의 짧은 승인번호를 사용할 수 있다. 기존 긴 승인번호도 전환 기간 동안 허용한다.
- 신규 학생 생성·승인번호 중복 확인·회전은 관리자 화면과 `admin-students` Edge Function이 담당한다.
- 운영 학생·회차 권한은 아직 실제 E2E 검증을 완료하지 않았다. 학생을 임의 생성하지 말고, 실명/승인번호는 사용자가 관리자 화면에서 직접 입력하거나 명시적으로 생성 승인을 준 경우에만 다룬다.
- 관리자 인증은 Supabase 비밀번호 방식이다. 비밀번호·secret·service-role 키는 코드, Git, URL, 문서, 채팅에 기록하지 않는다.

### 모의고사 보안 전달

- 페이지 이미지 방식(`deliveryMode: page_images`)을 사용한다. 원본 PDF를 HTML로 다시 조립하지 않는다.
- private Storage + RLS + Edge Function의 짧은 서명 URL로 문제 쪽 이미지를 전달하는 설계다.
- `admin-students`, `signed-asset-url`, `secure-mock` Edge Function과 활용 1회 page image 전달 자산은 배포되어 있다.
- 보호 답안 자산은 아직 없으므로, 활용 1회의 현재 허용 채점 경로는 영상 해설을 보며 하는 O/X 채점이다.
- 정적 `premier/` 공개 payload는 유료 보안 경계가 아니다. 새 유료 원본/정답/페이지 이미지를 여기에 추가하지 않는다.
- 난이도별 세 번째 이후 맞춤 문제도 아직 브라우저 생성기 중심이라 유료 보안 경계가 아니다. Secure Problem Bank API/RLS 전까지 유료 보호 완료라고 홍보하거나 판매하지 않는다.

### 포털 계약

학생 로그인 뒤 큰 책 4개를 항상 보인다.

| 권한 키 | 책/기능 | 현재 원칙 |
| --- | --- | --- |
| `hyperfocus` | Hyper Focus 문항 진단 | 기존 진단과 맞춤 시험지 |
| `mock` | 온라인 모의고사 | 15회 카탈로그와 학생 회차 권한의 교집합만 열기 |
| `vip` | VIP 라운지 | 자료실·설명회·칼럼·매거진 연동 |
| `problem-bank` | 맞춤 문제은행 | 서버 보안 경계 전에는 제한 기능으로만 |
| `hyperfocus-extra` | 추가 유사문제 | UI 권한은 있으나 유료 보안 미완료 |

권한이 없으면 책은 보이되 `잠김`이어야 한다. URL에 학생 이름, 승인번호, seed, 응시 횟수를 넣지 않는다.

## 3. 지금까지 확인한 검증

배포 직전/후 아래 정적·계약 검사는 통과했다.

```powershell
node hyper-focus/tests/supabase-foundation.test.cjs
node hyper-focus/tests/mock-bundle-admin-ui.test.cjs
node hyper-focus/tests/secure-mock.test.cjs
node hyper-focus/tests/secure-mock-backend.test.cjs
node --check hyper-focus/portal-auth.js
node --check hyper-focus/admin-app.js
```

GitHub Pages 배포 워크플로도 기준 커밋에서 성공했고, 아래 주소가 HTTP 200으로 확인됐다.

- <https://lete-on.gfieldacademy.net/hyper-focus/>
- <https://lete-on.gfieldacademy.net/hyper-focus/admin.html>

아직 미완료인 검증:

- 실제 Supabase 학생 2명으로 교차 접근 차단, 권한 승인·회수, 승인번호 회전, 영상 O/X 제출을 끝까지 확인
- 실제 데스크톱·모바일 로그인, 문제 쪽 이미지, 인쇄, 가로 넘침 검수
- 로컬 브라우저 자동 검수. `hyper-focus/qa/validate_portal_browser.cjs`는 Playwright가 설치되지 않아 실행되지 않았으므로, 의존성을 임의 설치하지 말고 별도 승인 또는 설치 환경에서 수행
- 보호 답안 업로드 후 `loadAnswers` 전/후와 제출 뒤 열람 권한 검증

전체 회귀 명령은 변경 범위에 맞게 실행한다.

```powershell
node hyper-focus/qa/validate_premier_release_catalog.cjs
node hyper-focus/tests/secure-mock.test.cjs
node hyper-focus/tests/secure-mock-backend.test.cjs
node hyper-focus/tests/secure-mock-ui.test.cjs
node hyper-focus/tests/mock-product-bundles.test.cjs
node hyper-focus/tests/mock-bundle-admin-ui.test.cjs
node hyper-focus/tests/portal-secure-collection.test.cjs
node hyper-focus/tests/supabase-foundation.test.cjs
node hyper-focus/qa/validate_mock.js
node hyper-focus/qa/validate_variations.js
node hyper-focus/qa/verify_q04_q09_visual_contract.js
```

## 4. 모의고사 원본·검수 현황

상품 구조는 아래 15회다.

- 활용 모의고사 8회
- 파이널 모의고사 3회
- 최종 모의고사 4회

원본 PDF·정답·렌더 이미지는 비공개 자료다. 공개 Git에는 넣지 않고, 위치·파일 지문·문항별 근거는 Git 제외 로컬 색인 `.source-memory/premier-private-local.json`만 사용한다. 영상 대본은 힌트일 뿐 정답 근거가 아니다. 반드시 원본 문제 그림과 공식 답안 또는 독립 계산을 교차 대조한다.

공개 가능한 회차 전환 조건:

1. 모든 문항이 원본 구조·조건·그림·질문·정답에서 1:1 대조됨
2. 단답형은 독립 계산 또는 전수 열거에서 정답 후보가 정확히 하나
3. 복수답·시점 모호·원문 오류는 `locked` 또는 `review_pending` 유지
4. 390px 모바일, 데스크톱, A4 인쇄에서 그림·글자·답란이 모두 읽힘
5. private Storage 전달과 학생별 RLS E2E까지 완료됨

상세 문항별 검수/잠금 목록은 `hyper-focus/docs/HANDOFF_PORTAL_ARCHITECTURE.md`의 “원본 보유 현황과 비공개 경계”를 단일 기준으로 삼는다. 이 목록을 근거 없이 `published`로 바꾸지 않는다.

사용자가 이전에 영상 오류와 그림 교정을 지정한 파이널/최종 문항도 있다. 하지만 대본/스크린샷만으로 답을 확정하지 말고, 해당 원본 페이지와 독립 계산을 다시 확인한 뒤 정답 자산에 반영한다.

## 5. Hyper Focus 유사문제 작업 규칙

원본별 기준 파일:

```text
hyper-focus/data/canonical/qNN.json
  -> machineReadable.payload.solvingModel
hyper-focus/assets/problems/qNN.png
hyper-focus/data/variations/qNN_var01.json
hyper-focus/data/variations/qNN_var02.json
```

원칙:

- 원본 구조·질문·시점·정답 계약을 바꾸지 않고, 허용된 숫자만 바꾼다.
- 이미 완료/정상인 유형은 문제점이 확인되지 않는 한 재생성하지 않는다.
- 7~8세용 설명에는 학년 밖 용어를 쓰지 않는다.
- 같은 유형의 쉬움/같게/어려움은 숫자만 키우지 말고 조건 수·추론 단계·보기 구조가 실제로 달라야 한다.
- `var01`/`var02`의 정답은 다양해야 하고, 유일해가 필요한 유형은 가능한 후보를 전수 검사한다.

### GFIELD 단일정답·가시성 검수

- 뒤에 가려진 쌓기나무는 전체 수·바닥 모양·앞/옆/위 정보 등으로 수가 하나로 정해져야 한다.
- 한 장의 3D 그림만 보고 여러 답이 가능한 쌓기나무는 출제 금지다.
- 색 문제는 보이는 색을 세는지 전체 흑/백 개수를 묻는지 명확히 분리한다.
- 바닥 모양으로 세는 문제는 칸별 높이 숫자 등으로 모든 기둥을 확정한다.
- 구멍 뚫기는 안쪽 구멍만 쓰고 축 수로 난이도를 나눈다. 바깥 테두리를 관통한 것처럼 보이면 폐기한다.
- 색종이 접기/전개도/직육면체·삼각기둥은 접기축·회전·방향 기준을 문장과 그림에 고정한다.
- 자동으로 모든 정답 후보를 만들고 1개일 때만 통과시킨다. 아이가 그림이 이상하다고 느낄 시점은 제외한다.

사용자가 지적한 화면 기준도 다시 확인한다.

- 유형 2: 상자 채우기는 시점만으로 답이 여러 개가 되지 않게 상자 경계와 필요한 조건을 제공
- 유형 3: 어려움은 실제로 더 높은 층과 서로 다른 높이 구성을 사용
- 유형 4: 난이도 체감이 쉬움 < 같게 < 어려움 순서가 되도록 구멍 축·개수·크기를 조정
- 유형 5: 벽 유무와 시선 위치가 답을 하나로 정하도록 명확히 표시

## 6. 다음 작업 순서

### 먼저 해야 하는 운영 검수

1. 사용자가 승인한 실제 학생 1명을 관리자 화면에서 등록한다. 실명·승인번호는 이 문서나 Git에 적지 않는다.
2. 해당 학생으로 Hyper Focus 로그인 → 권한별 큰 책 → 활용 회차 page image → 영상 O/X 제출 → 진단 저장을 실제 브라우저에서 확인한다.
3. 별도 검수 계정으로 학생 간 접근 차단과 권한 회수를 확인한다. 테스트 계정의 보관/삭제는 사용자 승인 후 한다.
4. `secure-mock` 호출에 인증 없이 접근하면 401이고, 다른 학생 UUID를 넣어도 차단되는지 확인한다.

### 다음 구현 우선순위

1. 검수 통과한 모의고사 회차만 page image manifest + 학생 권한과 연결한다.
2. 보호 답안 자산과 정답 열람 흐름을 추가한 뒤 서버 재계산·열람 기록을 E2E 검증한다.
3. 기존 `premier/` 정적 공개 payload의 private Storage 이전/제거 계획을 **별도 사용자 승인과 복구 계획**으로 만든다.
4. VIP 자료실 업로드와 자료실·설명회·칼럼·매거진의 `relatedIds`/태그 연동을 실제 private Storage 업로드까지 완성한다.
5. 유료 맞춤 문제은행을 서버 권한/RLS 기반 Secure Problem Bank로 옮긴다.
6. 모의고사 진단은 문항 `areaKey`와 `typeKey`를 쌓아 약점 유형으로 연결한다. Hyper Focus q번호와는 원본 구조·조건·질문까지 정확히 같을 때만 연결한다.
7. 명시적인 새 응시 계약을 만든 뒤에만 2·3회차 재응시를 연다.

## 7. Supabase 변경 규칙

Supabase를 만지는 작업은 시작 전에 `E:\Codex\plugins\cache\openai-curated-remote\supabase\1.0.0\skills\supabase\SKILL.md`를 처음부터 끝까지 읽는다.

- 새 migration, RLS, Storage, Edge Function은 현재 운영 상태를 먼저 조회한 뒤 변경한다.
- Edge Function은 특별한 이유가 없는 한 JWT 검증을 켠 채 배포하고, 배포 뒤 무인증 요청이 401인지 확인한다.
- `student-session`의 JWT 설정 등 다른 함수의 현재 설정은 근거 없이 바꾸지 않는다.
- 대량 데이터 변경, 운영 계정 생성/삭제, 권한 회수는 사용자의 명시적 승인 범위 안에서만 한다.
- Supabase dashboard/API 키/관리자 비밀번호/학생 승인번호를 이 문서와 Git에 쓰지 않는다.

## 8. 배포 절차

GitHub Pages는 `main`의 `hyper-focus/**` 변경으로 배포된다. 따라서 다음 순서를 지킨다.

```powershell
git status --short
git diff --check
# 관련 Node 검증과 실제 브라우저 검수
git add hyper-focus
git commit -m "..."
git push origin <작업-브랜치>

# main 반영은 사용자 승인 후에만
git fetch origin --prune
# 최신 origin/main을 안전하게 반영하고 재검증
git push origin main
```

배포 뒤에는 GitHub Actions 성공 SHA와 실제 Pages URL을 모두 확인한다. 503, 네트워크 오류, 원격 SHA 미확인은 배포 완료가 아니다. 강제 푸시는 하지 않는다.

## 9. 완료 보고 형식

각 작업 종료 시 아래만 사실로 보고한다.

```text
- 완료한 Hyper Focus 파일/기능
- 원본 대조·유일해·자동 검산 결과
- 데스크톱/모바일/A4 또는 실제 브라우저 검증 결과
- 잠금 유지 문항과 정확한 사유
- 커밋 SHA, 원격 브랜치, 배포 URL/워크플로 결과
- 남은 사용자 결정 또는 위험
```

“코드를 작성했다”만으로 완료라고 하지 않는다. 원본 대조, 답 유일성, 난수/전수 검산, 화면 표시, 회귀 검사가 모두 통과해야 한다.

