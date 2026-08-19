// 파이널 모의고사 확정 답·문항 분석 데이터
//
// 출처는 `question-bank/FINAL-SOURCE-AUDIT.md`의 원본 구조표와 대본 검증표다. 손으로 옮기지 않고
// 두 표를 기계로 합쳐 만든다(빌더는 작업 기록 참조).
//
// 유형 이름·영역은 문제은행에 **등록된 시험지(2·3회)**면 `source-data.js`에서 가져온다 — 감사
// 문서에는 옛 표기가 남아 있고, 화면에 나가는 이름은 앱이 실제로 쓰는 쪽이어야 한다. 4회는 실전
// 4회와 중복이라 문제은행에 등록하지 않았으므로, 감사 문서가 적어 둔 유형 id로 `TYPES`를 조회한다
// (F17·F18·F19·F22처럼 F코드로만 적힌 네 개는 나중에 등록된 실제 유형으로 이어 준다).
//
// 여기 있는 것은 원본 시험지의 **확정 답**이다. 문제은행이 만들어 내는 변형 문제의 답이 아니다.
// 원본 지문·그림은 저작권상 담지 않는다 — 구조 요약과 답, 검증 메모만 둔다.
window.FIELDS_MOCK_ANSWERS = {
  "final-2": {
    label: "필즈선발대비 실전 모의고사 파이널 2회",
    short: "파이널 2회",
    video: "https://www.youtube.com/watch?v=VC_jgwrMH_k",
    examNote: null,
    questions: [
      {"no":1,"summary":"네 번의 포함·제외 카드 조건으로 숫자 찾기","domain":"논리와 문제해결","middle":"조건 추리","type":"숫자 카드 포함·제외 조건으로 숨은 수 찾기","typeId":"hidden-number-card-conditions","diff":"상","answer":"4","note":"네 포함·제외 조건의 공통 원소"},
      {"no":2,"summary":"계단형 입체에서 가려진 쌓기나무 세기","domain":"도형과 공간","middle":"쌓기나무","type":"벽 모서리에서 보이지 않는 쌓기나무의 개수","typeId":"cube-hidden-count-walled","diff":"중","answer":"5개","note":"원본 입체에서 가려진 층별 개수 재확인"},
      {"no":3,"summary":"네 카드로 두 자리 수 두 개를 만들어 합을 100에 가깝게 하기","domain":"수와 연산","middle":"수 카드와 식","type":"두 자리 수 두 개의 합을 목표 수에 가장 가깝게 만들기","typeId":"closest-two-digit-card-sum","diff":"중","answer":"97","note":"28+69 또는 29+68; 100과의 차가 3"},
      {"no":4,"summary":"앞에서 14번째·뒤에서 11번째로 전체 인원 구하기","domain":"논리와 문제해결","middle":"순서와 비교","type":"앞·뒤 순서로 줄 선 전체 인원 구하기","typeId":"front-back-total","diff":"하","answer":"24명","note":"14+11-1"},
      {"no":5,"summary":"축구·야구와 둘 다 좋아하는 수로 반 전체 구하기","domain":"논리와 문제해결","middle":"집합과 포함","type":"두 종류를 선택한 전체 사람 수","typeId":"set-union-count","diff":"중","answer":"24명","note":"11+18-5"},
      {"no":6,"summary":"더해야 할 수를 빼어 나온 결과를 바르게 고치기","domain":"논리와 문제해결","middle":"과정 추론","type":"잘못 적용한 덧셈·뺄셈을 바르게 고치기","typeId":"wrong-operation-correction","diff":"중","answer":"57","note":"어떤 수는 29+14=43, 바른 계산은 43+14"},
      {"no":7,"summary":"연속된 네 기호식을 따라 마지막 기호 값 구하기","domain":"수와 연산","middle":"복면산과 식","type":"연속된 기호식으로 마지막 값 구하기","typeId":"symbol-chain-arithmetic","diff":"상","answer":"59","note":"하트 51, 클로버 31, 마름모 45를 차례로 계산"},
      {"no":8,"summary":"홀수 자리·짝수 자리에 다른 규칙이 섞인 수열","domain":"규칙과 관계","middle":"수 규칙","type":"두 수열의 대응 규칙","typeId":"paired-sequences","diff":"중","answer":"ㄱ=11, ㄴ=7","note":"홀수 자리와 짝수 자리 수열을 분리"},
      {"no":9,"summary":"원·세모·네모와 칠한 위치의 3x3 규칙 완성","domain":"규칙과 관계","middle":"도형 규칙","type":"바깥·안쪽 도형과 칠하기의 행렬 규칙","typeId":"shape-matrix-three-features","diff":"중","answer":"바깥 네모 안에 세모, 세모 내부는 대각선 빗금","note":"바깥 도형·안쪽 도형·칠하기가 각각 순환"},
      {"no":10,"summary":"10일 전 들은 ‘20일 후 시험’의 실제 날짜","domain":"규칙과 관계","middle":"달력과 시간","type":"전에 들은 며칠 뒤 약속의 실제 날짜 구하기","typeId":"delayed-date-promise","diff":"중","answer":"6월 3일","note":"들은 날은 5월 14일, 거기서 20일 뒤"},
      {"no":11,"summary":"큰 삼각형 안 칠한 작은 삼각형의 15번째 위치","domain":"규칙과 관계","middle":"도형 규칙","type":"삼각형 안에서 칠한 위치가 반복되는 규칙","typeId":"triangle-position-cycle","diff":"중","answer":"맨 위 작은 삼각형만 색칠","note":"네 위치가 순환하며 15번째는 세 번째 위치"},
      {"no":12,"summary":"찢어진 3월 달력으로 24일 요일 찾기","domain":"규칙과 관계","middle":"달력과 시간","type":"달력에서 특정 날짜의 요일 찾기","typeId":"calendar-date-weekday","diff":"하","answer":"일요일","note":"같은 요일은 7일 간격"},
      {"no":13,"summary":"두발·세발자전거의 전체 대수와 바퀴 수","domain":"수와 연산","middle":"합과 차 문장제","type":"두 종류의 전체 개수와 단위 수로 각각의 개수 구하기","typeId":"two-type-unit-total","diff":"중","answer":"3대","note":"두발자전거 7대에서 시작해 바퀴 3개를 추가"},
      {"no":14,"summary":"세 도형 숫자로 세로 덧셈 완성","domain":"수와 연산","middle":"복면산과 식","type":"세로셈 복면산에서 세 도형이 나타내는 수의 합","typeId":"vertical-cryptarithm-shape-sum","diff":"상","answer":"10","note":"세모 9, 네모 0, 별 1의 합"},
      {"no":15,"summary":"대각선으로 세 번 접고 구멍 펼치기","domain":"도형과 공간","middle":"색종이 접기","type":"대각선으로 여러 번 접은 색종이의 구멍 개수","typeId":"fold-diagonal-hole-count","diff":"중","answer":"8개","note":"세 번 접은 한 구멍을 펼친 결과"},
      {"no":16,"summary":"주변 삼각형 합에 맞게 1~5 배치","domain":"수와 연산","middle":"수 배열과 합","type":"삼각형의 합에 맞게 1부터 차례로 놓기","typeId":"row-column-sum-placement","diff":"중","answer":"위 1, 2 / 아래 5, 3, 4","note":"열 합 5·4·6, 행 합 3·12를 모두 만족"},
      {"no":17,"summary":"2x2 칸의 가로·세로 합 조건으로 서로 다른 수 채우기","domain":"수와 연산","middle":"수 배열과 합","type":"2x2 칸을 행·열 합과 서로 다른 조건으로 채우기","typeId":"two-by-two-sum-fill","diff":"중","answer":"위 3, 1 / 아래 2, 6","note":"행 합 4·8, 열 합 5·7, 네 수가 모두 다름"},
      {"no":18,"summary":"형제 나이의 합과 차로 형의 나이 구하기","domain":"수와 연산","middle":"합과 차 문장제","type":"전체 수와 차이로 두 수 구하기","typeId":"total-difference","diff":"하","answer":"13살","note":"합 21, 차 5인 두 나이"},
      {"no":19,"summary":"4x4 도형표의 행·열 합으로 A 구하기","domain":"수와 연산","middle":"매트릭스","type":"4x4 도형표의 행·열 합으로 빈 합 구하기","typeId":"shape-sum-grid-4","diff":"중","answer":"11","note":"원 5, 하트 3, 마름모 1, 세모 2로 행·열 합 대조"},
      {"no":20,"summary":"주어진 아홉 수로 3x3 마방진 완성","domain":"수와 연산","middle":"수 배열과 합","type":"가로·세로·대각선 합이 같은 마방진","typeId":"magic-square","diff":"상","answer":"위 11, 3, 16 / 가운데 15, 10, 5 / 아래 4, 17, 9","note":"모든 가로·세로·대각선의 합이 30"}
    ]
  },
  "final-3": {
    label: "필즈선발대비 실전 모의고사 파이널 3회",
    short: "파이널 3회",
    video: "https://www.youtube.com/watch?v=ihp5SqAqc00",
    examNote: null,
    questions: [
      {"no":1,"summary":"4x4 가로·세로 별 개수에 맞게 표시","domain":"논리와 문제해결","middle":"조건 배치","type":"가로·세로 개수 조건에 맞게 칸 표시하기","typeId":"row-column-count-placement","diff":"중","answer":"위부터 ★★★· / ★★·★ / ★★★★ / ★·★·","note":"행의 별 수 3·3·4·2, 열의 별 수 4·3·3·2를 모두 만족하는 한 가지 답"},
      {"no":2,"summary":"두 사람만 거짓말한 경기 순위 추리","domain":"논리와 문제해결","middle":"조건 추리","type":"참말과 거짓말로 경기 순위 찾기","typeId":"truth-lie-ranking","diff":"상","answer":"3등","note":"가능한 순서는 C-B-E-A-D 또는 B-C-E-A-D; 대본의 2등은 원본 조건과 불일치"},
      {"no":3,"summary":"1~6을 한 번씩 놓아 삼각형 세 변 합을 최대로 만들기","domain":"수와 연산","middle":"수 배열과 합","type":"삼각형 세 변의 합을 같게 만들고 그 합을 가장 크게","typeId":"triangle-max-edge-sum","diff":"상","answer":"한 줄의 최대 합 12","note":"위 꼭짓점 4, 왼쪽 아래 5, 오른쪽 아래 6, 왼쪽 변 3, 오른쪽 변 2, 아래 변 1인 배치"},
      {"no":4,"summary":"계단형 쌓기나무의 5단계 전체 개수","domain":"도형과 공간","middle":"쌓기나무","type":"단계가 커지는 쌓기나무의 전체 개수","typeId":"cube-step-sequence","diff":"중","answer":"35개","note":"단계별 개수 1+3+6+10+15"},
      {"no":5,"summary":"가르기·모으기 나무의 부모·자식 합","domain":"수와 연산","middle":"수 배열과 합","type":"가르기·모으기 나무의 부모·자식 관계","typeId":"split-merge-tree","diff":"중","answer":"4","note":"부모 수 3·6에서 가르기·모으기 관계를 차례로 적용"},
      {"no":6,"summary":"똑같이 나눈 뒤 한 사람이 반을 주었을 때 원래 전체","domain":"논리와 문제해결","middle":"과정 추론","type":"거꾸로 생각하기","typeId":"reverse-thinking","diff":"상","answer":"8개","note":"처음 각 4개, 반을 준 뒤 2개와 6개가 되어 차가 4"},
      {"no":7,"summary":"7명의 앞·뒤·사이 조건으로 특정 위치 찾기","domain":"논리와 문제해결","middle":"순서와 비교","type":"일곱 명의 앞·뒤 순서와 사이 사람 수","typeId":"order-position-seven-people","diff":"상","answer":"앞에서 6번째","note":"윤정희는 4번째, 한 명을 사이에 두고 준우는 뒤쪽"},
      {"no":8,"summary":"대각선으로 세 번 접은 색종이의 구멍 개수","domain":"도형과 공간","middle":"색종이 접기","type":"대각선으로 여러 번 접은 색종이의 구멍 개수","typeId":"fold-diagonal-hole-count","diff":"중","answer":"8개","note":"세 번 접은 한 구멍이 접은 선과 겹치지 않음"},
      {"no":9,"summary":"두 발의 합으로 가능한 과녁 점수 종류 세기","domain":"논리와 문제해결","middle":"경우의 수","type":"과녁에 여러 번 쏘아 만들 수 있는 점수 세기","typeId":"target-score-combinations","diff":"중","answer":"9가지","note":"두 발의 합은 2점부터 10점까지 모두 가능"},
      {"no":10,"summary":"네모를 이어 만들 때 필요한 성냥개비 수","domain":"규칙과 관계","middle":"수열의 활용","type":"성냥개비 도형 수열","typeId":"matchstick-square-growth","diff":"중","answer":"31개","note":"첫 네모 4개 이후 3개씩 9번 증가"},
      {"no":11,"summary":"각 점의 연결선 개수를 적어 모두 더하기","domain":"도형과 공간","middle":"연결 관계","type":"각 점에 연결된 선의 개수 합","typeId":"connected-line-degree-sum","diff":"상","answer":"34","note":"각 점의 연결선 개수 합이며, 전체 선 17개의 양 끝을 센 값과 같음"},
      {"no":12,"summary":"보기처럼 글자 블록을 움직여 결과 그리기","domain":"도형과 공간","middle":"도형 움직이기","type":"글자 블록을 움직인 결과 그리기","typeId":"letter-block-transform","diff":"중","answer":"학을 반시계 방향으로 90도 돌린 뒤 좌우로 뒤집은 모양","note":"보기의 소마 이동과 같은 변환"},
      {"no":13,"summary":"흑돌이 백돌보다 8개 많아지는 줄 찾기","domain":"규칙과 관계","middle":"도형 규칙","type":"흑백 바둑돌 차로 번째 찾기","typeId":"go-stone-difference-inverse","diff":"중","answer":"15줄","note":"첫 줄 흑돌 1개를 남기고 2·3줄부터 두 줄씩 묶으면 일곱 묶음에서 흑돌이 1개씩 더 많음"},
      {"no":14,"summary":"불규칙하게 붙은 도형의 크고 작은 사각형 세기","domain":"도형과 공간","middle":"도형 세기","type":"크고 작은 사각형 세기","typeId":"square-count","diff":"중","answer":"10개","note":"한 칸 네모 5개, 두 칸 네모 4개, 세 칸 네모 1개"},
      {"no":15,"summary":"4x4 도형표의 행·열 합으로 A 구하기","domain":"수와 연산","middle":"매트릭스","type":"4x4 도형표의 행·열 합으로 빈 합 구하기","typeId":"shape-sum-grid-4","diff":"중","answer":"11","note":"원 5, 하트 3, 마름모 1, 세모 2로 행·열 합 대조"},
      {"no":16,"summary":"주어진 상자를 채우는 데 필요한 쌓기나무","domain":"도형과 공간","middle":"쌓기나무","type":"정육면체 상자를 채우는 데 필요한 개수","typeId":"cube-fill-box","diff":"중","answer":"20개","note":"상자 전체 27개에서 이미 놓인 7개를 뺌"},
      {"no":17,"summary":"증가폭·앞의 두 수·두 수열이 섞인 세 수열","domain":"규칙과 관계","middle":"수 규칙","type":"세 가지 규칙의 복합 수열","typeId":"mixed-sequences","diff":"상","answer":"(1) 16, (2) 58, (3) 1","note":"증가폭 1씩 증가, 앞의 두 수의 합, 두 수열 교대 규칙"},
      {"no":18,"summary":"닭·토끼의 전체 마리 수와 다리 수","domain":"수와 연산","middle":"합과 차 문장제","type":"두 종류의 전체 개수와 단위 수로 각각의 개수 구하기","typeId":"two-type-unit-total","diff":"중","answer":"닭 4마리, 토끼 6마리","note":"모두 닭이면 20개인 다리에서 12개를 두 개씩 바꿈"},
      {"no":19,"summary":"테두리가 커지는 바둑돌의 5번째 흑백 차이","domain":"규칙과 관계","middle":"도형 규칙","type":"테두리가 커지는 바둑돌의 흑백 차이","typeId":"border-go-stone-difference","diff":"중","answer":"흰돌이 1개 더 많다","note":"다섯 번째 흰돌 25개, 검은돌 24개"},
      {"no":20,"summary":"형·누나가 모두 있거나 없는 학생 수","domain":"논리와 문제해결","middle":"집합과 포함","type":"두 조건에 모두 해당하지 않는 수","typeId":"neither-set-count","diff":"중","answer":"17명","note":"형 또는 누나가 있는 학생 18+8-3=23, 전체 40명에서 제외"}
    ]
  },
  "mock-4": {
    label: "필즈 대비 실전 모의고사 4회",
    short: "실전 4회",
    video: "https://www.youtube.com/watch?v=KLQH2Mrjm8c",
    examNote: "파이널 4회와 같은 시험지입니다. 파이널 4회 상품은 중복이라 없앴고, 이 확정 답은 실전 4회의 것으로 싣습니다. 해설 영상도 실전 4회 것입니다.",
    questions: [
      {"no":1,"summary":"세 구슬의 저울 관계로 필요한 가 구슬 수","domain":"논리와 문제해결","middle":"무게 비교","type":"양팔저울의 균형 관계","typeId":"balance-scale","diff":"중","answer":"가 구슬 5개","note":"가=1, 나=2, 다=3으로 놓으면 나+다=5"},
      {"no":2,"summary":"같은 막대로 구성된 가·나·다·라 길이","domain":"도형과 공간","middle":"길이와 측정","type":"막대의 배수 관계와 전체 길이","typeId":"rod-length-ratio","diff":"중","answer":"나 8cm, 다 4cm, 라 3cm","note":"가 막대 2cm를 기준으로 전체 길이를 각각 분할"},
      {"no":3,"summary":"다섯 수 카드를 +·×·- 혼합 계산식에 한 번씩 넣기","domain":"수와 연산","middle":"수 카드와 식","type":"수 카드를 혼합 계산식에 한 번씩 넣기","typeId":"number-card-mixed-operations","diff":"중","answer":"위 2+9=11, 왼쪽 2×7=14, 오른쪽 11-5=6","note":"5·7·9·11·14를 한 번씩 사용"},
      {"no":4,"summary":"번호 색종이를 접고 잘라 남은 수의 합","domain":"도형과 공간","middle":"색종이 접기","type":"번호 색종이를 접고 자른 뒤 남은 수의 합","typeId":"fold-number-remaining-sum","diff":"중","answer":"18","note":"접힌 뒤 잘려 나간 네 칸의 합 6을 전체 합 24에서 제외"},
      {"no":5,"summary":"1~6을 삼각형 둘레에 놓아 세 변 합 같게 만들기","domain":"수와 연산","middle":"수 배열과 합","type":"가로·세로 각 줄의 합 같게 만들기","typeId":"equal-line-sum","diff":"중","answer":"한 줄의 합 11","note":"위 2, 왼쪽 아래 4, 오른쪽 아래 6, 왼쪽 변 5, 오른쪽 변 3, 아래 변 1"},
      {"no":6,"summary":"1~9 마방진의 색칠한 칸 값","domain":"수와 연산","middle":"수 배열과 합","type":"가로·세로·대각선 합이 같은 마방진","typeId":"magic-square","diff":"상","answer":"8","note":"마방진은 2,7,6 / 9,5,1 / 4,3,8; 색칠한 칸은 오른쪽 아래"},
      {"no":7,"summary":"순위표의 가려진 서로 다른 세 자리 숫자","domain":"논리와 문제해결","middle":"순서와 비교","type":"순위표의 가려진 서로 다른 숫자 찾기","typeId":"hidden-score-ranking","diff":"중","answer":"세윤 203장, 현희 193장, 도연 192장","note":"가려진 숫자는 각각 0·1·2이며 모두 다름"},
      {"no":8,"summary":"네 수 카드로 만든 두 자리 짝수의 개수","domain":"수와 연산","middle":"수 카드와 식","type":"수 카드로 만든 두 자리 짝수의 개수","typeId":"two-digit-even-count","diff":"중","answer":"6개","note":"일의 자리 2·4 각각에 남은 세 카드를 십의 자리로 사용"},
      {"no":9,"summary":"번갈아 2씩 커지는 수열의 빈칸","domain":"규칙과 관계","middle":"수 규칙","type":"수 배열표의 규칙 찾기","typeId":"number-table-rule","diff":"하","answer":"7","note":"3,5 / 4,6 / 5,7 / 6,8의 두 수열 교대"},
      {"no":10,"summary":"두 단계 수 변환 기계의 역·순방향 값","domain":"규칙과 관계","middle":"수 규칙","type":"수 변환 기계의 규칙","typeId":"function-machine","diff":"중","answer":"첫 빈칸 10, 다음 빈칸 1","note":"첫 기계는 ×2+2, 둘째 기계는 10을 입력 수로 나눔"},
      {"no":11,"summary":"불규칙하게 붙은 도형의 사각형 세기","domain":"도형과 공간","middle":"도형 세기","type":"크고 작은 사각형 세기","typeId":"square-count","diff":"중","answer":"10개","note":"한 칸 5개, 두 칸 4개, 세 칸 1개"},
      {"no":12,"summary":"여러 번 오고 간 뒤 현재 수에서 처음 인원 찾기","domain":"논리와 문제해결","middle":"과정 추론","type":"여러 번 오고 간 뒤 처음 수 거꾸로 찾기","typeId":"reverse-initial-count","diff":"중","answer":"9명","note":"처음+4-6+5-3=9이므로 증감이 서로 상쇄됨"},
      {"no":13,"summary":"찢어진 7월 달력에서 수요일 날짜의 합","domain":"규칙과 관계","middle":"달력과 시간","type":"달력에서 같은 요일 날짜의 합","typeId":"calendar-weekday-sum","diff":"중","answer":"85","note":"수요일은 3·10·17·24·31일"},
      {"no":14,"summary":"계단 타일의 7번째 흰색·검은색 차이","domain":"규칙과 관계","middle":"도형 규칙","type":"구슬 배열의 개수 규칙","typeId":"growing-shape-count","diff":"중","answer":"흰색 타일이 7개 더 많다","note":"7번째 흰색 28개, 검은색 21개"},
      {"no":15,"summary":"세 도형이 있는 세로 덧셈 복면산","domain":"수와 연산","middle":"복면산과 식","type":"세로셈 복면산","typeId":"cryptarithm","diff":"상","answer":"스페이드 9, 하트 8, 별 1","note":"98+18=116"},
      {"no":16,"summary":"연속 기호식으로 마지막 별 값 구하기","domain":"수와 연산","middle":"복면산과 식","type":"도형이 나타내는 수와 식","typeId":"shape-equation","diff":"상","answer":"17","note":"네모 4, 동그라미 12, 하트 14, 이중 원 24를 차례로 계산"},
      {"no":17,"summary":"4x4 도형표의 행·열 합으로 빈 합 채우기","domain":"수와 연산","middle":"매트릭스","type":"도형의 가로·세로 합 매트릭스","typeId":"shape-sum-table","diff":"중","answer":"세 번째 행 24, 아래 첫째·둘째·셋째 열도 각각 24","note":"원 5, 네모 11, 별 7, 세모 3; 넷째 열 합 26과도 일치"},
      {"no":18,"summary":"4x4 과일표의 행·열 합으로 빈 합 채우기","domain":"수와 연산","middle":"매트릭스","type":"도형의 가로·세로 합 매트릭스","typeId":"shape-sum-table","diff":"중","answer":"네 번째 행 34, 아래 열 합은 37, 44, 40, 44","note":"바나나 15, 사과 5, 포도 12"},
      {"no":19,"summary":"다섯 사람 키 비교로 가장 큰·작은 사람","domain":"논리와 문제해결","middle":"순서와 비교","type":"키의 크고 작은 순서","typeId":"height-order","diff":"중","answer":"가장 큰 사람 동화, 가장 작은 사람 영희","note":"동화>슬기>지현>주희>영희 순서"},
      {"no":20,"summary":"네 사람과 네 동물 조건 연결","domain":"논리와 문제해결","middle":"조건 연결","type":"사람과 동물·음식 조건 연결","typeId":"person-item-logic","diff":"상","answer":"주연-햄스터, 유빈-원숭이, 유준-고양이, 관호-강아지","note":"원본의 세 조건과 일대일 대응을 모두 만족"}
    ]
  }
};
