# Hyper Focus 프리미어 포털 구조 인수인계

기준 브랜치: `codex/hf-program-hub`

기반 커밋: `94739a0` (`origin/main`, 학생별 승인번호 전환)

## 결정

모의고사를 모두 만든 뒤 포털을 붙이지 않는다. 먼저 공통 로그인, 상품 권한, 서재형 홈, 콘텐츠 데이터 계약을 고정하고 검수 완료된 모의고사를 목록에 차례로 연결한다.

이 순서는 진단·모의고사·VIP·문제은행이 각자 로그인과 권한 화면을 다시 만드는 일을 막는다.

## URL과 역할

- `hyper-focus/index.html`: 공개 홍보, 프로그램 신청, 상담, 승인번호 로그인, 학생별 4권 서재
- `hyper-focus/diagnosis.html`: 기존 54유형 진단·리포트·맞춤 시험지
- `hyper-focus/mock/viewer.html`: 시험지·정답 뷰어
- `hyper-focus/vip/index.html`: VIP 자료실·설명회·칼럼·매거진
- `hyper-focus/admin.html`: 학생 승인번호와 상품별 권한 관리

## 반드시 보존하는 승인번호 계약

- 학생 데이터: `window.GFIELD_HF_DATA`
- 필드: `students`, `studentCode`, `studentType`, `access`
- 기존 기록 새 키: `gfield_hf_approval_{APPROVAL_CODE}`
- 레거시 키: `gfield_{name}_{phone}`에서 새 승인번호 키로 복사하되 원본은 삭제하지 않는다.
- 공유 세션 키: `gfield_hf_name`, `gfield_hf_code`
- 중앙 제출: `name`, `approvalCode`, `recordMode: approval-code-v1`, `wrongIds`, `rate`
- 학생 화면과 인쇄물에 전화번호를 다시 넣지 않는다.

## 상품 권한

큰 책 배너 네 개는 항상 표시한다. 권한이 없으면 `LOCKED` 상태로 남고 링크를 열지 않는다.

| 권한 키 | 상품 |
|---|---|
| `hyperfocus` | Hyper Focus 문항 진단 |
| `mock` | 온라인 모의고사 |
| `vip` | VIP 라운지 |
| `problem-bank` | 맞춤 문제은행 |
| `hyperfocus-extra` | 유형별 무료 제공량을 넘는 추가 문제 |

`hyperfocus-extra` 또는 `problem-bank` 권한은 문제지 뷰어까지 유료 등급으로 전달된다. 이 계약은 `diagnosis.html`과 `mock/viewer.html` 양쪽에서 함께 검사한다.

## 모의고사 연결

공개 목록은 `portal-data.js`가 관리한다.

- 활용 모의고사 8회
- 파이널 모의고사 3회
- 최종 모의고사 4회

각 회차는 답과 화면 검수가 끝난 뒤에만 해당 그룹의 `items`에 URL을 넣는다. 빈 회차는 `검수 중`으로 보이며 응시 링크를 만들지 않는다.

## VIP 단일 콘텐츠 계약

VIP 네 영역은 `vip/data.js`의 한 배열을 함께 사용한다.

```text
id, kind, title, summary, date, tags, cover,
video, pagesBase, pageCount, bodyHtml,
relatedIds, status
```

- `kind`: `resources`, `seminar`, `column`, `magazine`
- `relatedIds`: 편집자가 직접 지정한 관련 콘텐츠
- `tags`: 직접 연결이 없을 때 같은 주제의 콘텐츠를 추천
- `status`: 학생 공개는 `reviewed` 또는 `published`만 허용

자료를 어느 영역에서 열어도 같은 태그와 `relatedIds`를 통해 설명회·칼럼·매거진을 함께 보여준다.

## 관리자와 보안 경계

- 관리자 표시명은 `DOCSSAM`으로 통일한다.
- 관리자 승인번호 원문은 새 공개 JS와 이 문서에 적지 않는다. `portal-auth.js`는 해시 비교만 한다.
- GitHub 토큰은 영구 `localStorage`가 아니라 탭 종료 시 사라지는 `sessionStorage`에만 둔다.
- 승인번호 생성은 `crypto.getRandomValues()`를 사용한다.
- 관리자 화면은 공통 관리자 세션이 없으면 포털 로그인으로 돌려보낸다.

현재 사이트는 정적 배포이므로 위 조치는 화면 보호와 실수 방지 수준이다. 학생 승인번호 원문과 유료 자료 URL을 진짜 비공개로 만들려면 다음 단계에서 서버 로그인, 행 단위 권한, 짧은 세션 또는 서명 URL로 옮겨야 한다. 브라우저에 GitHub 쓰기 토큰을 두는 방식도 그때 제거한다.

## 검증

```powershell
node hyper-focus/qa/validate_mock.js
node hyper-focus/qa/validate_portal_browser.cjs http://127.0.0.1:4177
```

브라우저 검수 항목:

- 공개 프로그램 4개
- DEMO: 열림 1개, 잠김 3개
- 진단 승인번호 자동 로그인
- VIP 직접 URL 접근 차단
- 데스크톱·모바일 가로 넘침 없음
- 전화번호 필드 없음

## 다음 구현 순서

1. 검수 완료된 모의고사를 `portal-data.js` 그룹에 연결
2. VIP 게시 관리자와 PDF→페이지 이미지 업로드를 `vip/data.js` 계약에 연결
3. 서버 인증·권한 저장소 도입 후 공개 `data.js`와 브라우저 GitHub 토큰 제거
4. 다른 기기에서도 승인번호별 과거 회차를 복원하는 중앙 기록 조회 추가
