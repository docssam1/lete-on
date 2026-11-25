# 10권 대조 결과 (에이전트 보고를 옮겨 적음)

합계 182: ok 89 · partial 66 · mismatch 27

## 1단원 (61: ok 28 · partial 25 · mismatch 8)
- A1-3 multi-method-multiplication-b10 partial: 방법마다 부분곱 칸을 채우게
- C1-2, P1-3 same-tens-complement partial: 일의 자리 5×5 줄 허용
- A2-3, P1-7 consecutive-sum-even-count partial: 1부터 n(짝수)까지 「…」 꼴 모드
- A2-4, P1-8 consecutive-sum-even-count partial: 10~12항까지
- A3-1, P1-15 consecutive-sum-odd-count partial: 1부터 n(홀수) 꼴
- A3-2, P1-16 consecutive-sum-odd-count partial: 9·13항
- A3-5, C2-1, P1-11, P1-19 consecutive-numbers-from-sum partial: 7~10항
- A3-6, C2-2, P1-12, P1-20, P1-26 multi-count-consecutive-decomposition MISMATCH: 목표 수 + 주어진 길이들 → 각 연속수 채우기 / 12항 제한 버그
- A3-7, C2-3, P1-13, P1-21 calendar-consecutive-sum-weekday partial: 요일 고정(월~토 등), 날짜 숨김, 다른 날짜의 요일 묻기(mod 7)
- C3-1, P1-23 same-parity-consecutive-sum MISMATCH: 합·개수·홀짝 → 각 수 (거꾸로)
- C3-2 rectangular-number-grid-sum ok(표 폭 다양화)
- C3-3, P1-24, D1-2 shaped-number-grid-sum partial: 대칭 모양(정사각·십자·마름모·13칸·8칸), 표 폭 다양, D1-2 거꾸로(합→가장 작은 칸)
- C3-4, P1-25 calendar-block-sum partial: 합 → 가장 작은/큰 칸, 작은 문제 여럿
- D1-3, D1-4 all-consecutive-decompositions ok (12항 버그)
- D1-5 consecutive-tens-digit-condition partial: 십의 자리 합만 주고 전체 합 묻기
- D1-6 consecutive-vertical-addition MISMATCH: 더하는 칸 모두 빈칸, 합은 끝 두 자리만, 작은 문제 셋

## 2단원 (38: ok 18 · partial 9 · mismatch 11)
- A1-1, P1-1, P1-2 two-symbol-coefficient-weight partial: 개수 조합 (1,1)/(1,2) · (1,2)/(2,1) · (1,3)/(3,1), 둘 다 묻기
- A1-2, P1-3 two-symbol-score-difference partial: (2,1)/(1,1) → 한 점수
- A1-3, P1-4 shared-term-equation partial: 3a+2b vs a+2b 꼴
- A1-4, P1-5 container-double-content MISMATCH: 그릇+x, 그릇+2x → 그릇
- A2-1, P1-10, D1-5 closed-perimeter-spacing-difference MISMATCH: 개수 차 → 처음 개수·둘레 (D1-5는 셋째 간격 개수도)
- A2-2, P1-11 same-budget-price-count MISMATCH: 「몇 개 더」 → 개수·돈
- A2-3, A2-4, P1-12, P1-13 new-participants-equal-share MISMATCH: 옛 몫·새 몫·새로 온 사람 → 처음 인원·전체
- D1-3 three-pair-sums-values partial: 둘씩 평균 모드
- D1-2 four-object-weight-system partial: 접시에 2~5개 섞인 물건

## 3단원 (40: ok 14 · partial 18 · mismatch 8)
- A1-1, A1-2, A1-5, A1-6, P1-3, P1-4, P1-5 digit-card-number-enumeration partial: 카드 모두 쓰기 · 0 포함 · 6장
- A2-1, P1-11 monotone-digit-enumeration partial: 모두 쓰기
- A2-2, P1-12, P1-13 monotone-digit-enumeration partial: 모두 쓰기 + 어떤 수보다 크다/작다
- C1-1, C1-2, P1-7, P1-8 repeated-digit-number-count partial: 0 아닌 숫자 2~3개, 길이 3~5
- C2-1~C2-4, P1-14~P1-16, D1-5 distinct-card-target-sum MISMATCH: 1..n 카드, 3장 또는 4장, 합이 S인 묶음 모두 쓰기
- D1-2 digit-sum-ranked-number partial: 큰 수부터
- D1-3 three-digit-step-count partial: 같은 간격으로 커지는 것만, 위 한도 없음

## 4단원 (43: ok 29 · partial 14 · mismatch 0)
- 범위 한도: digit-occurrence-count(≤350→600대) · total-written-digits(≤420→세 자리 전체 블록·네 자리) · digit-occurrence-range(시작 ≤120, 폭 ≤120 → 백의 자리대, 폭 약 200) · most-frequent-digit(≤240→300대, 횟수도 묻기)
- C1-1, C1-2, C1-4, P1-6, P1-7 digit-occurrence-count partial(범위)
- C1-3 most-frequent-digit partial
- C2-1, C2-3, P1-18, P1-20 total-written-digits partial(범위) / D1-3 네 자리 전체 블록
- P1-9 positive-range-number-digit-count partial: 네 줄 표, 범위마다 수의 개수와 숫자 개수 → 6권 range-number-digit-count 여러 줄 표
- D1-1, D1-2 digit-occurrence-range partial(범위)
- number-baseball: 난이도 2 단서가 모두 1S → 2S·3B·1S1B·0S0B 섞기, D1-5는 □/△ 기호

## 생성기 버그
- consecutiveRuns(target, maxLength = 12): 12항 넘는 연속수 빠짐 → 난이도 3에서 개수·목록 틀림 (multiCountConsecutiveDecompositionBook10, allConsecutiveDecompositionsBook10)
- shapedNumberGridSumBook10: 난이도 2·3 모양이 대칭이 아니라 「가운데 × 칸 수」 방법이 안 맞음
- sameBudgetPriceCountBook10: 돈이 그림에만 있고 문제 글에 없음
- calendarConsecutiveSumWeekdayBook10: 연속 날이 주를 넘어감
