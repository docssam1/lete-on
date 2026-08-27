# 돌파 원본 작업 장부

돌파 자료의 중심은 `dolpa-question-db-v1.json` 문항 DB입니다. 작업 장부는 파일을 다시 찾거나 이미 끝난 검수를 되풀이하지 않게 돕는 보조 자료입니다.

## 한 번만 하는 기준

- HWP 내용의 SHA-256이 같으면 경로가 달라도 원본 하나입니다.
- PDF 변환이 끝난 원본은 다시 변환하지 않습니다.
- 표지, 본문, 답안, 문항 분리, 유형, 난이도, 분석지는 서로 다른 작업입니다.
- `verified`, `sampled`, `blocked`, `stale` 상태를 남겨 같은 확인을 되풀이하지 않습니다.
- 파일명으로 읽은 과정·시험 종류는 `filename_only` 힌트이며 확정 분류가 아닙니다.

## 유형 분류 깊이

문항마다 아래를 따로 저장합니다.

1. 학년·학기
2. 수와 연산 / 문자와 식 / 함수 / 기하 / 확률과 통계
3. 단원
4. 학생이 알아볼 수 있는 세부 유형 이름
5. 풀이 핵심 태그
6. 난이도와 그 근거
7. 어느 시험형에 쓸 수 있는지와 그 근거

1~4가 확인됐더라도 5~7의 근거가 없으면 `pending` 또는 `candidate`로 둡니다. 파일명이나 정답률만 보고 난이도나 다른 시험형 사용 가능 여부를 확정하지 않습니다.

시험형은 `돌파형`, `생수형`, `원수학 기본형`, `원수학 듀얼형`, `이든형`, `황소형`, `깊은생각형` 일곱 가지로 나눕니다. 원수학 기본형과 듀얼형은 같은 학원이라도 시험 범위와 구성 목적이 다르므로 서로 다른 프로필입니다. 돌파 원본 문항은 돌파형만 `source_verified`로 시작하고, 다른 시험형은 범위·난이도·문항 위치를 검수하기 전까지 `candidate`로 둡니다. 다른 시험형에 실제로 쓸 수 있다고 확인한 뒤에만 `approved`로 바꿉니다.

문제은행 화면에서 시험형을 체크하면 `source_verified` 또는 `approved`인 문항만 기본 결과에 나옵니다. `candidate`는 관리자 검수 화면에서만 별도로 볼 수 있습니다. 결과는 학기 → 대단원 → 소단원 → 세부 유형 → 원본 시험지 문항 번호 순으로 정렬합니다.

## 현재 범위로 시험을 구성하는 기준

- 원본 시험지의 제목이나 파일명만 보고 범위를 맞았다고 판단하지 않습니다.
- 원본 30문항을 모두 문항 DB에 보존한 뒤, 문항별 학년·학기와 단원을 현재 시험 범위와 대조합니다.
- 범위 밖 문항은 삭제하지 않고 해당 시험의 `excluded` 목록에 남깁니다.
- 실제 시험에 들어갈 30문항은 `selectedQuestionIds`, 남는 범위 안 원본은 `reserve`로 따로 기록합니다.
- 교재 문제, 생성 문제, 대체 문항은 원본 입반시험 구성에 넣지 않습니다.

## 실행 순서

```powershell
node scripts/build-dolpa-work-ledger.cjs <inventory> <queue> <type-index> <paper-links> <review-decisions> <ledger>
node scripts/audit-dolpa-work-ledger.cjs <ledger>
node scripts/plan-dolpa-next-work.cjs <ledger> next 20
node scripts/build-dolpa-question-db.cjs <ledger> <question-db>
node scripts/audit-dolpa-question-db.cjs <question-db>
node scripts/select-question-bank.cjs <question-db> DP_STANDARD
```

시험지 하나를 열었을 때 표지부터 난이도까지 확인 가능한 항목을 한 번에 검수하고, 아래 형식의 비공개 manifest를 기록합니다.

```json
{
  "sourceId": "DP-SRC-...",
  "evidenceId": "review.packet...",
  "note": "본문·답안·유형을 함께 확인",
  "tasks": {
    "bodyReview": "verified",
    "answerReview": "verified",
    "questionSegmentation": "verified",
    "typeClassification": "verified",
    "difficultyReview": "verified"
  }
}
```

```powershell
node scripts/record-dolpa-review.cjs <review-decisions> <review-manifest>
```

`paper-links`와 `review-decisions`는 비공개 G 드라이브에 둡니다. 원본 경로, 원문, 답안, 페이지 이미지는 Git에 올리지 않습니다.

새 시험지의 문항 분류가 끝나면 `record-dolpa-paper-questions.cjs`로 문항 DB에 한 번만 추가합니다. 같은 `paperId`를 같은 내용으로 다시 넣으면 아무것도 바꾸지 않고, 유형이 달라진 상태로 다시 넣으면 오류로 막습니다.

```powershell
node scripts/record-dolpa-paper-questions.cjs <question-db> <ledger> <paper-question-manifest>
```

## 다음 작업을 고르는 법

`plan-dolpa-next-work.cjs`는 이미 끝난 단계는 빼고, 같은 시험지를 다시 열지 않도록 남은 검수 단계를 `paperReviewBundle` 하나로 묶습니다. 표지 확인이 끝난 원본은 표지 검수 목록에 다시 나오지 않습니다.
