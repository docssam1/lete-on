export const CAREER_TEMPERATURE_VERSION='20261116-career-temperature-condition';
// Correct only the exact reviewed authored item; retain every older presentation.
const workbookBefore={
  "id": "c22-s62-u04-w123",
  "no": 123,
  "section": 8,
  "sectionTitle": "나의 진로와 과학 설명하기",
  "bookResponseForm": "data",
  "form": "short",
  "type": "T15",
  "topic": "나의 진로와 과학 설명하기",
  "prompt": "건축가가 그늘의 효과를 알아보는 연습 자료예요. (1)볕이 드는 곳의 온도 (2)두 곳의 온도 차이를 단위와 함께 쓰세요.",
  "answer": "35℃ / 7℃",
  "explanation": "제시한 온도는 35℃와 28℃이므로 차이는 7℃예요. 같은 시각·같은 온도계로 비교한 가상 자료이며 실제 건물 전체의 냉방 효과를 측정한 값은 아니에요.",
  "origin": "independently-authored-current-curriculum",
  "status": "authored",
  "standard": "6과16-02",
  "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-2",
    "unit": "Ⅳ. 과학과 나의 진로",
    "originalExam": false
  },
  "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
  },
  "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
      {
        "label": "(1)",
        "kind": "number-unit",
        "value": 35,
        "units": [
          "℃",
          "°C",
          "도씨"
        ],
        "unitRequired": true,
        "tolerance": 0,
        "accepted": [
          "35℃",
          "35°C",
          "35도씨"
        ]
      },
      {
        "label": "(2)",
        "kind": "number-unit",
        "value": 7,
        "units": [
          "℃",
          "°C",
          "도씨"
        ],
        "unitRequired": true,
        "tolerance": 0,
        "accepted": [
          "7℃",
          "7°C",
          "7도씨"
        ]
      }
    ]
  },
  "table": {
    "머리": [
      "장소",
      "같은 시각에 잰 온도"
    ],
    "행": [
      [
        "볕이 드는 곳",
        "35℃"
      ],
      [
        "그늘진 곳",
        "28℃"
      ]
    ]
  },
  "givens": "같은 시각에 같은 종류의 온도계로 비교했다고 가정한 연습 자료예요. 실제 장소의 측정값은 아니에요.",
  "verificationModel": null,
  "inlineAnswerLabel": "정답",
  "formLabel": "자료 해석",
  "criteria": "제시한 온도는 35℃와 28℃이므로 차이는 7℃예요. 같은 시각·같은 온도계로 비교한 가상 자료이며 실제 건물 전체의 냉방 효과를 측정한 값은 아니에요.",
  "misconception": "직업의 이름이나 인기보다 실제로 하는 일과 그 일에 이용되는 과학을 관련지어 설명해요.",
  "given": [
    "같은 시각에 같은 종류의 온도계로 비교했다고 가정한 연습 자료예요. 실제 장소의 측정값은 아니에요."
  ],
  "parts": [
    "(1) · 단위도 써요.",
    "(2) · 단위도 써요."
  ],
  "answerPerPart": true,
  "figure": "career-question-data-123"
};
const bankBefore={
  "id": "c22-s62-u04-b123",
  "type": "T15",
  "status": "authored",
  "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 123,
    "section": "나의 다음 탐색을 계획하고 돌아봐요",
    "originalExam": false
  },
  "bookResponseForm": "data",
  "bookQuestionId": "c22-s62-u04-w123",
  "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 2,
    "unit": "u04",
    "area": "과학과 사회",
    "element": "E8",
    "type": "T15",
    "format": "자료 해석",
    "level": "기본",
    "track": "교과",
    "standard": "6과16-02",
    "topic": "나의 진로와 과학 설명하기",
    "concept": "관심 있는 진로에서 과학 찾기",
    "inquirySkill": "여러 직업에서 하는 일과 관련된 과학적 요소를 찾아요."
  },
  "prompt": "건축가가 그늘의 효과를 알아보는 연습 자료예요. (1)볕이 드는 곳의 온도 (2)두 곳의 온도 차이를 단위와 함께 쓰세요.",
  "givens": {
    "조건": "같은 시각에 같은 종류의 온도계로 비교했다고 가정한 연습 자료예요. 실제 장소의 측정값은 아니에요.",
    "자료표": {
      "머리": [
        "장소",
        "같은 시각에 잰 온도"
      ],
      "행": [
        [
          "볕이 드는 곳",
          "35℃"
        ],
        [
          "그늘진 곳",
          "28℃"
        ]
      ]
    },
    "문항": {
      "머리": [
        "문항"
      ],
      "행": [
        [
          "(1) · 단위도 써요."
        ],
        [
          "(2) · 단위도 써요."
        ]
      ]
    }
  },
  "choices": null,
  "responseContract": {
    "kind": "ordered-term-parts",
    "teacherRequired": false,
    "parts": [
      {
        "label": "(1)",
        "kind": "number-unit",
        "value": 35,
        "units": [
          "℃",
          "°C",
          "도씨"
        ],
        "unitRequired": true,
        "tolerance": 0,
        "accepted": [
          "35℃",
          "35°C",
          "35도씨"
        ]
      },
      {
        "label": "(2)",
        "kind": "number-unit",
        "value": 7,
        "units": [
          "℃",
          "°C",
          "도씨"
        ],
        "unitRequired": true,
        "tolerance": 0,
        "accepted": [
          "7℃",
          "7°C",
          "7도씨"
        ]
      }
    ]
  },
  "answerContract": {
    "type": "short-text",
    "answer": "35℃ / 7℃",
    "accepted": [
      "35℃ / 7℃"
    ],
    "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
    "seasonContract": {
      "kind": "ordered-term-parts",
      "teacherRequired": false,
      "parts": [
        {
          "label": "(1)",
          "kind": "number-unit",
          "value": 35,
          "units": [
            "℃",
            "°C",
            "도씨"
          ],
          "unitRequired": true,
          "tolerance": 0,
          "accepted": [
            "35℃",
            "35°C",
            "35도씨"
          ]
        },
        {
          "label": "(2)",
          "kind": "number-unit",
          "value": 7,
          "units": [
            "℃",
            "°C",
            "도씨"
          ],
          "unitRequired": true,
          "tolerance": 0,
          "accepted": [
            "7℃",
            "7°C",
            "7도씨"
          ]
        }
      ]
    }
  },
  "explanation": "제시한 온도는 35℃와 28℃이므로 차이는 7℃예요. 같은 시각·같은 온도계로 비교한 가상 자료이며 실제 건물 전체의 냉방 효과를 측정한 값은 아니에요.",
  "standards": [
    "6과16-02"
  ],
  "originalPromptCopied": false,
  "originalFigureReused": false,
  "evidence": {
    "actualStudentObservation": false,
    "actualPhysicalExperiment": false,
    "dataKind": "authored-practice-or-explicit-model",
    "scienceReview": "manuscript; independent-answer-and-render-review-pending",
    "productRenderReviewed": false
  },
  "verificationModel": null,
  "workbookRef": {
    "id": "c22-s62-u04-w123",
    "no": 123
  },
  "diagnosticOverride": {
    "version": "20261104-career-book",
    "typed": {
      "any": "M17"
    },
    "distractors": null,
    "cloze": null,
    "cells": null
  },
  "contentVersion": "20261104-career-book",
  "previousVersions": [
    {
      "id": "c22-s62-u04-b123",
      "type": "T15",
      "status": "authored",
      "sourceRef": {
        "type": "authored-supplement",
        "label": "현행 범위 독립 창작",
        "bookNo": 123,
        "section": "나의 다음 탐색을 계획하고 돌아봐요",
        "originalExam": false
      },
      "bookResponseForm": "data",
      "bookQuestionId": "c22-s62-u04-w123",
      "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 6,
        "semester": 2,
        "unit": "u04",
        "area": "과학과 사회",
        "element": "E8",
        "type": "T15",
        "format": "자료 해석",
        "level": "기본",
        "track": "교과",
        "standard": "6과16-02",
        "topic": "나의 다음 탐색을 계획하고 돌아봐요",
        "concept": "실행 가능한 다음 탐색",
        "inquirySkill": "질문·자료·기간·확인 방법이 있는 작은 계획을 세운다."
      },
      "prompt": "계획표의 (1)총 예상 시간 (2)쓸 수 있는30분에서 남는 시간을 쓰세요.",
      "givens": {
        "조건": "교사가 만든 가상 지역·가상 인물의 제공 연습 자료이다. 실제 통계·학생 측정·진로검사 결과가 아니다. 쓸 수 있는 시간은30분이다.",
        "자료표": {
          "머리": [
            "할 일",
            "예상 시간"
          ],
          "행": [
            [
              "자료 읽기",
              "12분"
            ],
            [
              "비교 정리",
              "8분"
            ],
            [
              "질문 만들기",
              "5분"
            ]
          ]
        }
      },
      "choices": null,
      "responseContract": {
        "kind": "ordered-term-parts",
        "teacherRequired": false,
        "parts": [
          {
            "label": "(1)",
            "kind": "number-unit",
            "value": 25,
            "units": [
              "분"
            ],
            "unitRequired": true,
            "tolerance": 0,
            "accepted": [
              "25분"
            ]
          },
          {
            "label": "(2)",
            "kind": "number-unit",
            "value": 5,
            "units": [
              "분"
            ],
            "unitRequired": true,
            "tolerance": 0,
            "accepted": [
              "5분"
            ]
          }
        ]
      },
      "answerContract": {
        "type": "short-text",
        "answer": "25분 / 5분",
        "accepted": [
          "25분 / 5분"
        ],
        "inputHint": "각 부분의 답과 필요한 단위를 따로 써요.",
        "seasonContract": {
          "kind": "ordered-term-parts",
          "teacherRequired": false,
          "parts": [
            {
              "label": "(1)",
              "kind": "number-unit",
              "value": 25,
              "units": [
                "분"
              ],
              "unitRequired": true,
              "tolerance": 0,
              "accepted": [
                "25분"
              ]
            },
            {
              "label": "(2)",
              "kind": "number-unit",
              "value": 5,
              "units": [
                "분"
              ],
              "unitRequired": true,
              "tolerance": 0,
              "accepted": [
                "5분"
              ]
            }
          ]
        }
      },
      "explanation": "12+8+5=25분이고30−25=5분이 남는다. 예상 시간으로 계획을 점검한 결과이며 실제로25분을 수행했다는 기록은 아니다. 자료 찾기가 늦어지면 실제 시간과 계획 변경 이유를 따로 남긴다.",
      "standards": [
        "6과16-02"
      ],
      "originalPromptCopied": false,
      "originalFigureReused": false,
      "evidence": {
        "actualStudentObservation": false,
        "actualPhysicalExperiment": false,
        "dataKind": "authored-practice-or-explicit-model",
        "scienceReview": "manuscript; independent-answer-and-render-review-pending",
        "productRenderReviewed": false
      },
      "verificationModel": {
        "kind": "plan-time-budget",
        "model": "time"
      },
      "version": 1
    }
  ]
};
const explanation="제시한 온도는 35℃와 28℃이므로 차이는 7℃예요. 같은 시각·같은 종류의 온도계로 비교한 가상 자료이며 실제 건물 전체의 냉방 효과를 측정한 값은 아니에요.";
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),clone=x=>JSON.parse(JSON.stringify(x));
const cache=new WeakMap();
export function careerTemperatureItems(rows,unit){
 if(unit!=='c22-s62-u04'||!Array.isArray(rows))return rows;
 let changed=false;
 const current=rows.map(q=>{
  if(!same(q,bankBefore))return q;
  changed=true;if(cache.has(q))return cache.get(q);
  const version=q.contentVersion||1;
  const diagnostic=q.diagnosticOverride?.version===version?{diagnosticOverride:{...clone(q.diagnosticOverride),version:CAREER_TEMPERATURE_VERSION}}:{};
  const next={...q,explanation,...diagnostic,contentVersion:CAREER_TEMPERATURE_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version,snapshotKind:'full-question'}]};
  cache.set(q,next);return next;
 });
 return changed?current:rows;
}
export function withCareerTemperatureWorkbook(workbook){
 if(workbook?.unit!=='c22-s62-u04'||!Array.isArray(workbook.questions))return workbook;
 let changed=false;
 const questions=workbook.questions.map(q=>{if(!same(q,workbookBefore))return q;changed=true;return{...q,explanation,criteria:explanation};});
 return changed?{...workbook,questions}:workbook;
}
