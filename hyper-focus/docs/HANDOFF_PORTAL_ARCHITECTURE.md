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

### 원본 보유 현황과 비공개 경계

- 활용 모의고사: 1~8회 원본 8개
- 파이널 모의고사: 1~3회 원본 3개와 비교용 통합본 1개
- 최종 모의고사: 1~4회 원본 4개

원본 PDF의 파일 지문과 문항별 페이지 근거는 Git에서 제외된 로컬 색인 `.source-memory/premier-private-local.json`에만 둔다. 원본 PDF, 렌더 페이지, 답안, 대본은 공개 저장소에 복사하지 않는다. 정식 문제 페이지 이미지는 저장소를 비공개로 바꾸거나 Supabase 비공개 저장소의 서명 URL 전송을 연결하기 전까지 커밋하지 않는다.

활용 1회 원본은 1~4쪽의 20문항과 5~7쪽의 번호별 풀이가 서로 대응하지 않는다. 따라서 뒤쪽 풀이와 영상 대본을 답안 근거로 사용하지 않고 각 문항을 독립 계산한다. 1회는 19문항이 검산을 통과했고, 16번은 문장에 적힌 단위 정사각형 수와 실제 그림이 달라 수정 승인 전까지 잠근다.

활용 2회도 1~4쪽 문제와 5쪽 풀이가 대응하지 않는다. 독립 계산과 후보 전수검사 결과 13문항의 원본 답을 확인했고, 3·4·7·8·10·15·19번은 복수답·시점 모호·원문 오류 때문에 잠갔다. 11번과 18번은 원본 답을 확인했지만 새 아이콘과 쌓기나무 그림의 모바일 가시성을 별도로 통과해야 공개할 수 있다. 문항별 답과 근거는 공개 문서가 아니라 Git에서 제외된 비공개 색인에만 둔다.

활용 3회는 원본 4쪽에 20문항만 있고 별도 답지가 없다. 모든 문항의 계산 또는 허용 답 열거를 마쳤으며 16문항의 원본 답을 검증 상태로 기록했다. 1번은 합동인 그림을 판별하는 채점기, 11번은 16개 허용 배치를 받는 채점 계약이 필요하고, 8번은 위치 문장, 19번은 벽과 관찰 방향을 보완하기 전까지 잠근다. 5·6·12·13·17번은 답은 확인했지만 상자 경계·옅은 선·작은 화살표·겹친 도형·칸 정렬을 모바일용 벡터 그림으로 다시 검수해야 한다.

### 프리미어 문항 분류 계약

프리미어 문항을 이름이 비슷하다는 이유만으로 Hyper Focus `q01~q54`에 연결하지 않는다. 각 문항은 먼저 독립적인 영역과 프리미어 유형을 가진다.

```text
questionKey, revision,
areaKey, areaLabel,
typeKey, typeTitle,
releaseStatus, lockReasons,
hfLink
```

- `questionKey`: `premier:{series}-{round}:qNN` 형식의 안정적인 문항 키
- `typeKey`: 프리미어 전체 회차에서 재사용하는 구조 기반 식별자
- `hfLink`: 원본 구조·조건·질문 방식까지 같은 경우에만 `{ match: "exact", questionId, typeId, subType }`를 기록하고, 아니면 `null`
- `releaseStatus`: `review_pending`, `verified`, `locked`만 사용한다.
- 영역과 유형은 별도 필드로 유지해 이후 모의고사 진단과 문제은행이 같은 분류를 사용하게 한다.

영역 키는 `arithmetic`(수와 연산), `spatial`(공간과 도형), `pattern`(규칙과 관계), `logic`(논리와 관계), `combinatorics`(경우의 수), `measurement`(측정과 시간) 여섯 개로 고정한다.

정답은 공개 문제 객체와 분리한 보호 답안 manifest에서 `questionKey + revision`으로 연결한다.

```text
questionKey, revision,
answerType, answer, answerText, answerCandidates,
verificationStatus, sourceMemoryRecordId
```

`answerCandidates`는 자동 열거 결과를 저장하며 공개 가능한 단답 문항은 반드시 후보가 1개여야 한다. 그리기·배치형 원본이 여러 완성 답을 허용하면 단답형으로 바꾸지 않고 별도 허용 답 계약이나 자기 채점 방식으로 둔다.

정식 회차는 `status: "review"`로 먼저 등록하고 포털 링크를 만들지 않는다. 모든 문항의 원본 위치, 답, 단일 후보, 모바일/A4 렌더가 통과한 커밋에서만 `published` 전환과 포털 연결을 함께 한다.

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
