const CHECKS = Object.freeze({
  "polyomino-family-count": {
    prompt: "돌리거나 뒤집어서 정확히 겹치면 어떤 모양일까요?",
    options: ["같은 모양", "다른 모양", "칸 수가 다른 모양"],
    answer: "같은 모양",
    explanation: "붙인 위치가 같고 돌리거나 뒤집어 겹치면 같은 모양입니다."
  },
  "hidden-cube-count": {
    prompt: "전체 쌓기나무 수는 어떻게 구할까요?",
    options: ["보이는 수 + 숨은 수", "보이는 수 - 숨은 수", "맨 위의 수만 세기"],
    answer: "보이는 수 + 숨은 수",
    explanation: "가려진 자리까지 층별로 확인해 보이는 것과 숨은 것을 모두 더합니다."
  },
  "balance-substitution": {
    prompt: "저울 문제에서 같은 무게인 도형을 찾으면 어떻게 할까요?",
    options: ["같은 무게끼리 바꾸어 넣기", "한쪽만 지우기", "도형 수만 비교하기"],
    answer: "같은 무게끼리 바꾸어 넣기",
    explanation: "수평인 저울의 양쪽은 같은 무게이므로 같은 무게 묶음으로 바꾸어 넣을 수 있습니다."
  },
  "cardinal-placement": {
    prompt: "북쪽의 반대 방향은 어디일까요?",
    options: ["남쪽", "동쪽", "서쪽"],
    answer: "남쪽",
    explanation: "방향표에서 북쪽과 남쪽, 동쪽과 서쪽이 서로 마주 봅니다."
  },
  "path-number-grid": {
    prompt: "1씩 커지는 수 길에서 다음 칸은 어떻게 찾을까요?",
    options: ["앞 수에 1 더하기", "앞 수에 2 더하기", "앞 수에서 1 빼기"],
    answer: "앞 수에 1 더하기",
    explanation: "이어진 칸을 따라가며 바로 앞 수보다 1 큰 수를 놓습니다."
  },
  "digit-card-ranked-number": {
    prompt: "숫자 카드로 작은 수부터 만들 때 가장 먼저 볼 자리는 어디일까요?",
    options: ["가장 높은 자리", "일의 자리", "가운데 자리"],
    answer: "가장 높은 자리",
    explanation: "자리 수가 같으면 가장 높은 자리의 숫자가 작은 수부터 차례를 정합니다."
  },
  "checkerboard-product-matrix": {
    prompt: "가로의 수가 3, 세로의 수가 4인 칸에는 어떤 수를 놓을까요?",
    options: ["7", "12", "34"],
    answer: "12",
    explanation: "가로 수와 세로 수를 곱하므로 3 곱하기 4는 12입니다."
  },
  "number-line-unit-distance": {
    prompt: "18부터 30까지를 똑같이 4칸으로 나누면 한 칸은 얼마일까요?",
    options: ["3", "4", "12"],
    answer: "3",
    explanation: "30에서 18을 뺀 12를 네 칸으로 똑같이 나누면 한 칸은 3입니다."
  },
  "rectangle-missing-side": {
    prompt: "가로 6, 세로 4인 직사각형의 둘레는 얼마일까요?",
    options: ["10", "20", "24"],
    answer: "20",
    explanation: "네 변을 모두 더하면 6 + 4 + 6 + 4 = 20입니다."
  },
  "inclusive-range-count": {
    prompt: "4부터 8까지 수는 모두 몇 개일까요?",
    options: ["4개", "5개", "8개"],
    answer: "5개",
    explanation: "4, 5, 6, 7, 8처럼 처음 수와 끝 수를 모두 세면 5개입니다."
  },
  "number-and-digit-count": {
    prompt: "10, 11, 12는 수가 모두 몇 개일까요?",
    options: ["3개", "6개", "12개"],
    answer: "3개",
    explanation: "수는 10, 11, 12의 세 개이고, 쓴 숫자의 개수와 구별해야 합니다."
  },
  "elapsed-time": {
    prompt: "2시 10분부터 2시 40분까지 지난 시간은 얼마일까요?",
    options: ["20분", "30분", "50분"],
    answer: "30분",
    explanation: "끝 시각 2시 40분에서 시작 시각 2시 10분을 빼면 30분입니다."
  },
  "shared-polygon-matchsticks": {
    prompt: "정사각형 두 개가 한 변을 맞대면 맞닿은 변은 몇 번 셀까요?",
    options: ["한 번", "두 번", "세 번"],
    answer: "한 번",
    explanation: "두 도형이 함께 쓰는 변은 실제 성냥개비 하나이므로 한 번만 셉니다."
  },
  "closed-loop-planting": {
    prompt: "닫힌 길에 나무 6그루를 같은 간격으로 심으면 간격은 몇 개일까요?",
    options: ["5개", "6개", "7개"],
    answer: "6개",
    explanation: "닫힌 길은 마지막 나무에서 첫 나무로 돌아오는 간격도 있어 나무 수와 간격 수가 같습니다."
  },
  "venn-overlap-all": {
    prompt: "두 모임의 전체 수를 구할 때 겹친 사람은 어떻게 셀까요?",
    options: ["한 번만 세기", "두 번 세기", "세지 않기"],
    answer: "한 번만 세기",
    explanation: "두 모임의 수를 더하면 겹친 사람이 두 번 들어가므로 겹친 수를 한 번 빼 줍니다."
  },
  "addition-sum-matrix": {
    prompt: "가로줄의 합에서 아는 두 수를 빼면 무엇을 찾을 수 있을까요?",
    options: ["남은 도형의 수", "줄의 개수", "도형의 색"],
    answer: "남은 도형의 수",
    explanation: "한 줄의 전체 합에서 이미 아는 도형값을 빼면 모르는 도형값이 남습니다."
  },
  "vertical-shape-cryptarithm": {
    prompt: "세로 덧셈 복면산은 어느 자리부터 확인할까요?",
    options: ["일의 자리", "십의 자리", "백의 자리"],
    answer: "일의 자리",
    explanation: "일의 자리 합과 받아올림을 먼저 정한 뒤 십의 자리로 올라갑니다."
  },
  "equalize-transfer": {
    prompt: "14개와 8개를 같게 하려면 많은 쪽에서 몇 개를 옮길까요?",
    options: ["2개", "3개", "6개"],
    answer: "3개",
    explanation: "두 수의 차 6의 절반인 3을 많은 쪽에서 적은 쪽으로 옮깁니다."
  },
  "reverse-operation-chain": {
    prompt: "마지막에 4를 더해 끝났다면 거꾸로 돌아갈 때는 어떻게 할까요?",
    options: ["4를 빼기", "4를 더하기", "4를 곱하기"],
    answer: "4를 빼기",
    explanation: "거꾸로 풀 때는 계산 순서를 뒤집고 더하기는 빼기로 바꿉니다."
  },
  "unit-area-and-half": {
    prompt: "반 칸 두 개를 합치면 단위넓이 몇 칸이 될까요?",
    options: ["반 칸", "1칸", "2칸"],
    answer: "1칸",
    explanation: "크기가 같은 반 칸 두 개를 합치면 온전한 한 칸이 됩니다."
  },
  "cube-map-total": {
    prompt: "위에서 본 칸에 2, 1, 3층이 적혀 있으면 쌓기나무는 모두 몇 개일까요?",
    options: ["3개", "6개", "9개"],
    answer: "6개",
    explanation: "각 칸의 층수 2 + 1 + 3을 모두 더하면 6개입니다."
  },
  "magic-square-missing": {
    prompt: "한 줄의 합이 15이고 두 칸이 4와 6이면 빈칸은 얼마일까요?",
    options: ["5", "9", "10"],
    answer: "5",
    explanation: "15에서 이미 있는 4와 6을 빼면 빈칸은 5입니다."
  },
  "consecutive-sum-pairing": {
    prompt: "1부터 6까지에서 처음 수와 끝 수를 짝지으면 합은 얼마일까요?",
    options: ["6", "7", "8"],
    answer: "7",
    explanation: "1과 6, 2와 5, 3과 4를 짝지으면 모든 짝의 합이 7입니다."
  },
  "consecutive-page-range": {
    prompt: "연속된 5쪽의 합이 40이면 가운데 쪽수는 얼마일까요?",
    options: ["5", "8", "10"],
    answer: "8",
    explanation: "연속된 수의 가운데 수는 전체 합을 개수로 나눈 40 나누기 5인 8입니다."
  },
  "catch-up-acorns": {
    prompt: "처음 차이가 12개이고 하루에 3개씩 따라잡으면 며칠 뒤 같아질까요?",
    options: ["3일", "4일", "9일"],
    answer: "4일",
    explanation: "처음 차이 12를 하루 차이 3으로 나누면 4일입니다."
  },
  "digit-card-four-place": {
    prompt: "서로 다른 숫자 카드 4장으로 네 자리 수를 만들면 모두 몇 가지일까요?",
    options: ["12가지", "16가지", "24가지"],
    answer: "24가지",
    explanation: "천의 자리부터 가능한 수가 4, 3, 2, 1개이므로 4 곱하기 3 곱하기 2 곱하기 1은 24입니다."
  },
  "number-baseball-secret": {
    prompt: "숫자 야구에서 스트라이크는 어떤 뜻일까요?",
    options: ["숫자와 자리가 모두 같음", "숫자만 있고 자리는 다름", "그 숫자가 없음"],
    answer: "숫자와 자리가 모두 같음",
    explanation: "스트라이크는 숫자와 놓인 자리가 모두 맞았다는 뜻입니다."
  }
});

const LEARNER_STAGE = "7세 8월부터 초등 1학년 초반";

const VISUAL_PROGRESSIONS = Object.freeze({
  "addition-sum-matrix": Object.freeze([
    Object.freeze({
      valuesByCell: Object.freeze({ 0: "8", 1: "8", 2: "8" }),
      calculation: "24 ÷ 3 = 8"
    }),
    Object.freeze({
      valuesBySymbol: Object.freeze({ "□": "8", "△": "4" }),
      calculation: "20 - 8 - 8 = 4"
    }),
    Object.freeze({
      valuesBySymbol: Object.freeze({ "□": "8", "△": "4", "◎": "3", "☆": "5" }),
      target: "16",
      calculation: "15 - 8 - 4 = 3 · 17 - 8 - 4 = 5 · 8 + 5 + 3 = 16"
    })
  ])
});

export function attachCourseOneProgressiveExperiences(books) {
  for (const book of books) {
    const bookNumber = Number(book.id.slice(-2));
    if (bookNumber < 4) continue;
    for (const lesson of book.lessons) {
      if (lesson.experience) continue;
      const check = CHECKS[lesson.id];
      if (!check) throw new Error(`Missing progressive concept check: ${lesson.id}`);
      lesson.experience = Object.freeze({
        kind: "progressive-concept",
        family: lesson.sourceTypeIds[0],
        title: `${lesson.title} 과정을 따라가요`,
        learnerStage: `${LEARNER_STAGE} · 필즈 더 클래식 1과정 ${bookNumber}권`,
        learnerFit: Object.freeze({
          language: "한 문장에 한 행동을 담은 짧은 한국어",
          representations: "교재 구조를 보존한 도형·수·표 시각화",
          prerequisites: "수 세기, 한 자리 덧셈·뺄셈, 방향과 기본 도형",
          reasoningLoad: "보기, 관계 찾기, 확인하기의 세 단계",
          responseMode: "터치 가능한 3지선다와 답 보기"
        }),
        beats: Object.freeze(lesson.explanation.steps.map((caption, index) => Object.freeze({
          id: `${lesson.id}-step-${index + 1}`,
          action: index === 0 ? "reveal" : index === lesson.explanation.steps.length - 1 ? "verify" : "highlight",
          caption
        }))),
        hint: lesson.representativeConcept,
        check: Object.freeze({ ...check }),
        visualProgression: VISUAL_PROGRESSIONS[lesson.id] || null,
        finalStill: Object.freeze({ standsAlone: true, visualSource: "original" })
      });
    }
  }
  return books;
}

export const COURSE_ONE_PROGRESSIVE_CHECKS = CHECKS;
