(function (global) {
  "use strict";

  // 시험의 문항 수·순서·난이도는 생성기가 아니라 이 구성표가 소유한다.
  // 아래 세트는 q01~q09 생성기 연결을 점검하기 위한 검수용이며,
  // 정식 프리미어 모의고사 구성으로 승인된 것이 아니다.
  const VARIATION_REVIEW_IDS = [
    "q10_var01", "q10_var02", "q11_var01", "q11_var02", "q12_var01", "q12_var02",
    "q13_var01", "q13_var02", "q14_var01", "q14_var02", "q15_var01", "q15_var02",
    "q16_var01", "q16_var02", "q17_var01", "q17_var02", "q18_var01", "q18_var02",
    "q19_var01", "q19_var02", "q20_var01", "q20_var02", "q21_var01", "q21_var02",
    "q25_var01", "q25_var02", "q27_var01", "q27_var02", "q28_var01", "q28_var02",
    "q29_var01", "q29_var02", "q30_var01", "q30_var02", "q31_var01", "q31_var02",
    "q32_var01", "q32_var02", "q35_var01", "q35_var02", "q36_var01", "q36_var02",
    "q37_var01", "q37_var02", "q38_var01", "q38_var02", "q39_var01", "q39_var02",
    "q40_var01", "q40_var02", "q45_var01", "q45_var02",
    "q51_var01", "q51_var02", "q53_var01", "q53_var02"
  ];

  const EXAMS = {
    "spatial-generator-review": {
      id: "spatial-generator-review",
      status: "review",
      title: "공간지각 생성기 검수 세트",
      subtitle: "q01~q09 · 같게/어렵게 생성 확인",
      description: "승인 전 공간지각 생성기의 문제·정답·진단 연결을 확인하는 검수용 세트입니다.",
      durationMinutes: null,
      slots: [
        { typeId: 1, difficulty: "same" },
        { typeId: 1, difficulty: "hard" },
        { typeId: 2, difficulty: "same" },
        { typeId: 2, difficulty: "hard" },
        { typeId: 3, difficulty: "same" },
        { typeId: 3, difficulty: "hard" },
        { typeId: 4, difficulty: "same" },
        { typeId: 4, difficulty: "hard" },
        { typeId: 5, difficulty: "same" },
        { typeId: 5, difficulty: "hard" },
        { typeId: 6, difficulty: "same" },
        { typeId: 6, difficulty: "hard" },
        { typeId: 7, difficulty: "same" },
        { typeId: 7, difficulty: "hard" },
        { typeId: 8, difficulty: "same" },
        { typeId: 8, difficulty: "hard" },
        { typeId: 9, difficulty: "same" },
        { typeId: 9, difficulty: "hard" }
      ]
    },
    "variation-bank-review": {
      id: "variation-bank-review",
      status: "review",
      title: "기존 유사문제 문제은행 검수 세트",
      subtitle: "q10~q54 중 뷰어 준비 완료 문제",
      description: "기존 variation JSON 가운데 문제 문장·그림·정답·풀이가 모두 있는 56문제를 그대로 확인하는 검수용 세트입니다.",
      durationMinutes: null,
      slots: VARIATION_REVIEW_IDS.map((variationId) => ({
        typeId: Number(variationId.slice(1, 3)),
        source: "variation-bank",
        variationId
      }))
    }
  };

  function getExam(id) {
    return EXAMS[String(id || "")] || null;
  }

  global.HFMockBlueprints = {
    // 정식 시험 구성은 승인된 뒤 별도 id로 등록한다.
    publishedExamId: null,
    reviewExamId: "spatial-generator-review",
    variationReviewExamId: "variation-bank-review",
    exams: EXAMS,
    getExam
  };
})(typeof window !== "undefined" ? window : globalThis);
