# 6세 챌린지 생성기 검수 모듈

Hyper Focus 범위 안에서 6세 챌린지 예상 유형을 원본과 분리된 새 문제로 생성하고 검수한다.

## 현재 등록 유형

- `split-merge-chain`: 수 가르기·모으기 연결 빈칸
- `animal-race-order`: 조건을 보고 동물의 전체 달리기 순서 완성
- `card-sum-count`: 중복 숫자 카드로 목표 합 만들기
- `total-difference`: 전체와 차로 두 묶음 구하기
- `family-comparison`: 관계를 이어 두 사람의 차 구하기
- `line-position-total`: 앞·본인·뒤로 전체 인원 구하기
- `mountain-digit-count`: 커지는 수 배열의 특정 숫자 개수
- `triangle-number-rule`: 삼각형 안팎 수 규칙
- `rotated-grid-pair`: 돌렸을 때 같은 3×3 색칠 모양 찾기
- `apartment-floor-order`: 층 범위와 위아래 조건으로 전체 배치
- `cyclic-picture-pattern`: 반복 그림의 위치와 개수
- `number-property-filter`: 여러 조건을 모두 만족하는 수 찾기
- `balance-weight-order`: 두 저울 비교로 세 물체의 무게 순서 정하기
- `inverse-story-problem`: 마지막 상태에서 처음 수를 거꾸로 구하는 문장제
- `arrow-number-move`: 화살표 방향에 따라 1 또는 10만큼 수 이동
- `symbol-equation`: 연결된 식으로 기호값 구하기
- `minimum-sum-pyramid`: 카드 배열에 따른 가장 작은 꼭대기 수

17개 유형 모두 문제 데이터에서 SVG와 정답을 함께 만들고, 가능한 답을 전수검사해 정답 후보가 하나일 때만 반환한다.

## 화면

- `review.html`: 쉽게·같게·어렵게 렌더, 정답 확인, A4 3문항 인쇄
- `exam.html`: 2회·회당 20문항 시험지 검수, 표지·빈 2쪽·3문항 배치·세 줄 워터마크·별도 정답지
- 같은 화면 아래에서 딱 2회로 묶은 `워밍업 → 예제 → 유제 → 리뷰` 개념 페이지 확인·인쇄
- `SOURCE_INTAKE.md`: 원본 그림의 구조 접수 상태와 공개 금지 기준

이 화면은 검수 전용이며 학생 허브나 정식 모의고사에 연결하지 않는다. 사용자가 제공한 참고 이미지와 원문은 공개 저장소에 넣지 않는다.

## 검증

```text
node hyper-focus/qa/validate_challenge_bank.cjs
```

새 유형은 `generate`, `validate`, `enumerate`, `renderProblem`, `renderAnswer` 계약과 6세 `learnerFit` 기록을 모두 갖춰야 한다.
