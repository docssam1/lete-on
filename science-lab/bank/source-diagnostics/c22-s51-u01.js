// 대조한 이 단원의 원문과 버전별 복습 규칙만 읽는다.
import {sourceDiagnosticReviser} from '../source-diagnostic-reviser.js?v=20261116-source-diagnostics-per-unit';
const revision={
 "version": "20261116-geology-source-diagnostics",
 "legacyUnversioned": true,
 "patches": [
  {
   "previous": {
    "key": "1-1",
    "id": "c22-s51-u01-o1-01",
    "status": "verified",
    "contentVersion": "20261115-geology-book-source",
    "sourceContentVersion": "20261108-original-source",
    "sourceRef": {
     "type": "original",
     "sourceId": "gfield-theory-42-1",
     "set": 1,
     "no": 1,
     "originalNo": 1,
     "page": 26,
     "edition": "4-2-1단계-교사.pdf",
     "course": "교재 지면 표기 초4-1",
     "unit": "지층과 화석",
     "targetUnit": "c22-s51-u01",
     "label": "이론 개념 확인",
     "reviewOnly": false
    },
    "taxonomy": {
     "curriculum": "2022 개정",
     "grade": 5,
     "semester": 1,
     "unit": "u01",
     "area": "지구와 우주",
     "element": "E1",
     "type": "T01",
     "format": "복수선택형",
     "level": "기본",
     "track": "교과",
     "standard": "6과01-01",
     "topic": "지층의 층·경계·색과 두께",
     "concept": "지층의 층·경계·색과 두께",
     "inquirySkill": "여러 근거 비교"
    },
    "sourceTaxonomy": {
     "section": "이론 개념 확인",
     "page": 26,
     "originalNo": 1
    },
    "prompt": "다음 중 지층에 대한 설명으로 옳은 것을 모두 고르시오.",
    "choices": [
     "모든 층의 색깔이 같다.",
     "암석이 층으로 쌓여 있다.",
     "하나의 암석으로 되어 있다.",
     "샌드위치와 비슷한 모양이다.",
     "지층을 이루는 알갱이의 크기는 모두 비슷하다."
    ],
    "sourceContextBlocks": [],
    "sourceMaterialBlocks": [],
    "givens": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
     "type": "multi-choice",
     "answers": [
      1,
      3
     ],
     "accepted": [
      [
       1,
       3
      ]
     ]
    },
    "printedAnswerContract": {
     "type": "multi-choice",
     "answers": [
      1,
      3
     ],
     "accepted": [
      [
       1,
       3
      ]
     ]
    },
    "printedExplanation": "지층은 암석이 층으로 쌓여 있는 것을 말하며 샌드위치, 시루떡 등과 비슷한 모양이다.",
    "explanation": "지층은 암석이 층으로 쌓여 있는 것을 말하며 샌드위치, 시루떡 등과 비슷한 모양이다.",
    "privateOnly": false,
    "runtimeRegistered": true,
    "releaseReady": false,
    "sourcePair": {
     "itemId": "c22-s51-u01-b006",
     "sourceId": "gfield-theory-42-1",
     "set": 1,
     "no": 1
    },
    "evidence": {
     "checkedBy": "교사용 원본 PDF 지면·인쇄 답·Apple Vision·현행6과01 대조",
     "date": "2026-11-15",
     "gates": [
      "source",
      "answer",
      "curriculum"
     ],
     "against": "자가 이론421 PDF 해당 쪽 원문·인쇄 정답",
     "note": "파일명4-2-1과 해당 지면 초4-1 표기를 함께 보존한다. 현행5-1 단원평가 전체 원문으로 표시하지 않는다. 줄바꿈·간격만 정리하고 교사 확인 대상은 자동 정오 판정을 하지 않는다."
    }
   },
   "distractors": {
    "0": "M01",
    "2": "M01",
    "4": "M07"
   }
  },
  {
   "previous": {
    "key": "1-3",
    "id": "c22-s51-u01-o1-03",
    "status": "verified",
    "contentVersion": "20261115-geology-book-source",
    "sourceContentVersion": "20261108-original-source",
    "sourceRef": {
     "type": "original",
     "sourceId": "gfield-theory-42-1",
     "set": 1,
     "no": 3,
     "originalNo": 3,
     "page": 26,
     "edition": "4-2-1단계-교사.pdf",
     "course": "교재 지면 표기 초4-1",
     "unit": "지층과 화석",
     "targetUnit": "c22-s51-u01",
     "label": "이론 개념 확인",
     "reviewOnly": false
    },
    "taxonomy": {
     "curriculum": "2022 개정",
     "grade": 5,
     "semester": 1,
     "unit": "u01",
     "area": "지구와 우주",
     "element": "E3",
     "type": "T05",
     "format": "선택형",
     "level": "기본",
     "track": "교과",
     "standard": "6과01-02",
     "topic": "퇴적물과 퇴적암의 관계",
     "concept": "퇴적물과 퇴적암의 관계",
     "inquirySkill": "관찰 근거·조건 판단"
    },
    "sourceTaxonomy": {
     "section": "이론 개념 확인",
     "page": 26,
     "originalNo": 3
    },
    "prompt": "다음 <보기>는 지층이 만들어지는 과정을 순서 없이 나타낸 것이다. 지층이 만들어지는 과정을 순서대로 바르게 나열한 것은?",
    "choices": [
     "㉠ - ㉡ - ㉢ - ㉣",
     "㉠ - ㉡ - ㉣ - ㉢",
     "㉠ - ㉢ - ㉡ - ㉣",
     "㉡ - ㉠ - ㉢ - ㉣",
     "㉢ - ㉡ - ㉠ - ㉣"
    ],
    "sourceContextBlocks": [],
    "sourceMaterialBlocks": [
     {
      "type": "list",
      "items": [
       "㉠ 진흙, 모래, 자갈 등이 운반된다.",
       "㉡ 진흙, 모래, 자갈 등이 강이나 바다 밑에 쌓인다.",
       "㉢ 오랜 시간이 지나 단단한 지층이 만들어진다.",
       "㉣ 진흙, 모래, 자갈 등이 계속 쌓이고, 먼저 쌓인 지층이 눌린다."
      ]
     }
    ],
    "givens": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "single-choice",
    "answerContract": {
     "type": "single-choice",
     "answer": 1,
     "accepted": [
      1
     ]
    },
    "printedAnswerContract": {
     "type": "single-choice",
     "answer": 1,
     "accepted": [
      1
     ]
    },
    "printedExplanation": "퇴적물이 운반되고 쌓인 후 다져지면 지층이 된다.",
    "explanation": "퇴적물이 운반되고 쌓인 후 다져지면 지층이 된다.",
    "privateOnly": false,
    "runtimeRegistered": true,
    "releaseReady": false,
    "sourcePair": {
     "itemId": "c22-s51-u01-b033",
     "sourceId": "gfield-theory-42-1",
     "set": 1,
     "no": 3
    },
    "evidence": {
     "checkedBy": "교사용 원본 PDF 지면·인쇄 답·Apple Vision·현행6과01 대조",
     "date": "2026-11-15",
     "gates": [
      "source",
      "answer",
      "curriculum"
     ],
     "against": "자가 이론421 PDF 해당 쪽 원문·인쇄 정답",
     "note": "파일명4-2-1과 해당 지면 초4-1 표기를 함께 보존한다. 현행5-1 단원평가 전체 원문으로 표시하지 않는다. 줄바꿈·간격만 정리하고 교사 확인 대상은 자동 정오 판정을 하지 않는다."
    }
   },
   "distractors": {
    "0": "M05",
    "2": "M05",
    "3": "M05",
    "4": "M05"
   }
  },
  {
   "previous": {
    "key": "1-4",
    "id": "c22-s51-u01-o1-04",
    "status": "verified",
    "contentVersion": "20261115-geology-book-source",
    "sourceContentVersion": "20261108-original-source",
    "sourceRef": {
     "type": "original",
     "sourceId": "gfield-theory-42-1",
     "set": 1,
     "no": 4,
     "originalNo": 4,
     "page": 26,
     "edition": "4-2-1단계-교사.pdf",
     "course": "교재 지면 표기 초4-1",
     "unit": "지층과 화석",
     "targetUnit": "c22-s51-u01",
     "label": "이론 개념 확인",
     "reviewOnly": false
    },
    "taxonomy": {
     "curriculum": "2022 개정",
     "grade": 5,
     "semester": 1,
     "unit": "u01",
     "area": "지구와 우주",
     "element": "E3",
     "type": "T05",
     "format": "선택형",
     "level": "기본",
     "track": "교과",
     "standard": "6과01-02",
     "topic": "퇴적물과 퇴적암의 관계",
     "concept": "퇴적물과 퇴적암의 관계",
     "inquirySkill": "관찰 근거·조건 판단"
    },
    "sourceTaxonomy": {
     "section": "이론 개념 확인",
     "page": 26,
     "originalNo": 4
    },
    "prompt": "위 실험 과정에서 풀을 넣는 이유로 옳은 것은?",
    "choices": [
     "자갈을 단단하게 만들기 위해",
     "모래를 쉽게 부서지기 하기 위해",
     "모래와 자갈을 더럽게 하기 위해",
     "모래와 자갈을 잘 굳게 하기 위해",
     "모래와 자갈이 잘 붙지 않게 하기 위해"
    ],
    "sourceContextBlocks": [
     {
      "type": "text",
      "text": "[4~5] 다음은 모래와 자갈을 굳히는 실험 과정이다. 물음에 답하시오."
     },
     {
      "type": "list",
      "items": [
       "㉠ 반으로 자른 페트병에 모래와 자갈을 넣는다.",
       "㉡ 모래와 자갈을 섞은 후 물풀을 넣는다.",
       "㉢ 손으로 잘 누른다.",
       "㉣ 1~2일 동안 굳힌다."
      ]
     },
     {
      "type": "figure",
      "src": "assets/bank/c22-s51-u01/p26-sand-gravel-model.png",
      "alt": "교재에 제시된 모래·자갈과 물풀을 넣고 누르는 모형 실험 사진 세 장"
     }
    ],
    "sourceMaterialBlocks": [],
    "givens": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "single-choice",
    "answerContract": {
     "type": "single-choice",
     "answer": 3,
     "accepted": [
      3
     ]
    },
    "printedAnswerContract": {
     "type": "single-choice",
     "answer": 3,
     "accepted": [
      3
     ]
    },
    "printedExplanation": "실험 과정에서 물풀은 모래와 자갈을 잘 굳게 하기 위해 넣으며, 실제 강물이나 바닷물속에는 물풀과 같은 역할을 하는 물질이 녹아있다.",
    "explanation": "실험 과정에서 물풀은 모래와 자갈을 잘 굳게 하기 위해 넣으며, 실제 강물이나 바닷물속에는 물풀과 같은 역할을 하는 물질이 녹아있다.",
    "privateOnly": false,
    "runtimeRegistered": true,
    "releaseReady": false,
    "sourcePair": {
     "itemId": "c22-s51-u01-b036",
     "sourceId": "gfield-theory-42-1",
     "set": 1,
     "no": 4
    },
    "evidence": {
     "checkedBy": "교사용 원본 PDF 지면·인쇄 답·Apple Vision·현행6과01 대조",
     "date": "2026-11-15",
     "gates": [
      "source",
      "answer",
      "curriculum"
     ],
     "against": "자가 이론421 PDF 해당 쪽 원문·인쇄 정답",
     "note": "파일명4-2-1과 해당 지면 초4-1 표기를 함께 보존한다. 현행5-1 단원평가 전체 원문으로 표시하지 않는다. 줄바꿈·간격만 정리하고 교사 확인 대상은 자동 정오 판정을 하지 않는다."
    }
   },
   "distractors": {
    "0": "M04",
    "1": "M04",
    "2": "M04",
    "4": "M04"
   }
  },
  {
   "previous": {
    "key": "1-5",
    "id": "c22-s51-u01-o1-05",
    "status": "verified",
    "contentVersion": "20261115-geology-book-source",
    "sourceContentVersion": "20261108-original-source",
    "sourceRef": {
     "type": "original",
     "sourceId": "gfield-theory-42-1",
     "set": 1,
     "no": 5,
     "originalNo": 5,
     "page": 26,
     "edition": "4-2-1단계-교사.pdf",
     "course": "교재 지면 표기 초4-1",
     "unit": "지층과 화석",
     "targetUnit": "c22-s51-u01",
     "label": "이론 개념 확인",
     "reviewOnly": false
    },
    "taxonomy": {
     "curriculum": "2022 개정",
     "grade": 5,
     "semester": 1,
     "unit": "u01",
     "area": "지구와 우주",
     "element": "E3",
     "type": "T05",
     "format": "선택형",
     "level": "기본",
     "track": "교과",
     "standard": "6과01-02",
     "topic": "퇴적물과 퇴적암의 관계",
     "concept": "퇴적물과 퇴적암의 관계",
     "inquirySkill": "근거 설명·모형·수행 구별"
    },
    "sourceTaxonomy": {
     "section": "이론 개념 확인",
     "page": 26,
     "originalNo": 5
    },
    "prompt": "위 실험을 통해 알아보려고 하는 것은?",
    "choices": [
     "모래가 생성되는 과정",
     "땅이 편평하게 되는 과정",
     "지층에 층이 생기는 까닭",
     "지층이 단단하게 굳는 까닭",
     "지층을 이루는 알갱이의 크기가 다른 까닭"
    ],
    "sourceContextBlocks": [
     {
      "type": "text",
      "text": "[4~5] 다음은 모래와 자갈을 굳히는 실험 과정이다. 물음에 답하시오."
     },
     {
      "type": "list",
      "items": [
       "㉠ 반으로 자른 페트병에 모래와 자갈을 넣는다.",
       "㉡ 모래와 자갈을 섞은 후 물풀을 넣는다.",
       "㉢ 손으로 잘 누른다.",
       "㉣ 1~2일 동안 굳힌다."
      ]
     },
     {
      "type": "figure",
      "src": "assets/bank/c22-s51-u01/p26-sand-gravel-model.png",
      "alt": "교재에 제시된 모래·자갈과 물풀을 넣고 누르는 모형 실험 사진 세 장"
     }
    ],
    "sourceMaterialBlocks": [],
    "givens": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "single-choice",
    "answerContract": {
     "type": "single-choice",
     "answer": 3,
     "accepted": [
      3
     ]
    },
    "printedAnswerContract": {
     "type": "single-choice",
     "answer": 3,
     "accepted": [
      3
     ]
    },
    "printedExplanation": "이 실험은 모래와 자갈이 굳어 단단한 지층이 되는 것을 알아보는 모형 실험이다.",
    "explanation": "이 실험은 모래와 자갈이 굳어 단단한 지층이 되는 것을 알아보는 모형 실험이다.",
    "privateOnly": false,
    "runtimeRegistered": true,
    "releaseReady": false,
    "sourcePair": {
     "itemId": "c22-s51-u01-b040",
     "sourceId": "gfield-theory-42-1",
     "set": 1,
     "no": 5
    },
    "evidence": {
     "checkedBy": "교사용 원본 PDF 지면·인쇄 답·Apple Vision·현행6과01 대조",
     "date": "2026-11-15",
     "gates": [
      "source",
      "answer",
      "curriculum"
     ],
     "against": "자가 이론421 PDF 해당 쪽 원문·인쇄 정답",
     "note": "파일명4-2-1과 해당 지면 초4-1 표기를 함께 보존한다. 현행5-1 단원평가 전체 원문으로 표시하지 않는다. 줄바꿈·간격만 정리하고 교사 확인 대상은 자동 정오 판정을 하지 않는다."
    }
   },
   "distractors": {
    "0": "M04",
    "1": "M04",
    "2": "M04",
    "4": "M04"
   }
  },
  {
   "previous": {
    "key": "1-6",
    "id": "c22-s51-u01-o1-06",
    "status": "verified",
    "contentVersion": "20261115-geology-book-source",
    "sourceContentVersion": "20261108-original-source",
    "sourceRef": {
     "type": "original",
     "sourceId": "gfield-theory-42-1",
     "set": 1,
     "no": 6,
     "originalNo": 6,
     "page": 27,
     "edition": "4-2-1단계-교사.pdf",
     "course": "교재 지면 표기 초4-1",
     "unit": "지층과 화석",
     "targetUnit": "c22-s51-u01",
     "label": "이론 개념 확인",
     "reviewOnly": false
    },
    "taxonomy": {
     "curriculum": "2022 개정",
     "grade": 5,
     "semester": 1,
     "unit": "u01",
     "area": "지구와 우주",
     "element": "E4",
     "type": "T07",
     "format": "선택형",
     "level": "기본",
     "track": "교과",
     "standard": "6과01-02",
     "topic": "이암·사암·역암 분류",
     "concept": "이암·사암·역암 분류",
     "inquirySkill": "관찰 근거·조건 판단"
    },
    "sourceTaxonomy": {
     "section": "이론 개념 확인",
     "page": 27,
     "originalNo": 6
    },
    "prompt": "지층을 이루고 있는 암석을 다음과 같이 이암, 사암, 역암으로 구분하는 기준은 무엇인가?",
    "choices": [
     "암석의 모양",
     "암석의 색깔",
     "암석의 크기",
     "암석이 만들어진 시기",
     "암석을 이루는 알갱이의 크기"
    ],
    "sourceContextBlocks": [],
    "sourceMaterialBlocks": [
     {
      "type": "figure",
      "src": "assets/bank/c22-s51-u01/p27-three-sedimentary-rocks.png",
      "alt": "교재 원본 표본 사진과 이름: 이암, 사암, 역암"
     }
    ],
    "givens": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "single-choice",
    "answerContract": {
     "type": "single-choice",
     "answer": 4,
     "accepted": [
      4
     ]
    },
    "printedAnswerContract": {
     "type": "single-choice",
     "answer": 4,
     "accepted": [
      4
     ]
    },
    "printedExplanation": "지층을 이루는 암석을 퇴적암이라고 하며 알갱이의 크기에 따라 이암, 사암, 역암으로 구분한다.",
    "explanation": "지층을 이루는 암석을 퇴적암이라고 하며 알갱이의 크기에 따라 이암, 사암, 역암으로 구분한다.",
    "privateOnly": false,
    "runtimeRegistered": true,
    "releaseReady": false,
    "sourcePair": {
     "itemId": "c22-s51-u01-b052",
     "sourceId": "gfield-theory-42-1",
     "set": 1,
     "no": 6
    },
    "evidence": {
     "checkedBy": "교사용 원본 PDF 지면·인쇄 답·Apple Vision·현행6과01 대조",
     "date": "2026-11-15",
     "gates": [
      "source",
      "answer",
      "curriculum"
     ],
     "against": "자가 이론421 PDF 해당 쪽 원문·인쇄 정답",
     "note": "파일명4-2-1과 해당 지면 초4-1 표기를 함께 보존한다. 현행5-1 단원평가 전체 원문으로 표시하지 않는다. 줄바꿈·간격만 정리하고 교사 확인 대상은 자동 정오 판정을 하지 않는다."
    }
   },
   "distractors": {
    "0": "M07",
    "1": "M07",
    "2": "M07",
    "3": "M07"
   }
  }
 ]
};
export const reviewedSourceDiagnostics=sourceDiagnosticReviser('c22-s51-u01',revision);
