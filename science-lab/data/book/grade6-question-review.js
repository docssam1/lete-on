export const GRADE6_REVIEW_VERSION='20261115-grade6-question-review';
export const GRADE6_REVIEW_UNITS=["c22-s62-u04", "c22-s62-u02", "c22-s62-u01", "c22-s61-u01", "c22-s61-u02", "c22-s61-u03", "c22-s61-u04"];
// Reviewed authored questions only; saved attempts keep their previous presentations.
const patches={
  "c22-s62-u04-b014": {
    "unit": "c22-s62-u04",
    "previousVersion": "20261107-career-readable-workbook",
    "prompt": "2024년 자료를 오늘 읽은 뒤 발행일을 오늘로 고쳤습니다. 어떻게 바로잡을까요?",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 14,
      "section": "현재 자료의 출처와 시점을 확인해요",
      "originalExam": false
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u04",
      "area": "과학과 사회",
      "element": "E1",
      "type": "T01",
      "format": "까닭 설명",
      "level": "기본",
      "track": "교과",
      "standard": "6과16-01",
      "topic": "현재 자료의 출처와 시점을 확인해요",
      "concept": "출처·날짜·자료 범위",
      "inquirySkill": "정보의 작성 주체·시점·대상과 확인 위치를 구별한다."
    },
    "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "발행일은 원래의 2024년으로 되돌리고, 오늘은 읽은 날로 따로 적어요. 언제 조사한 기록인지도 확인해 오늘 직접 잰 값과 구별해요.",
      "required": [
        "발행일을 원래대로 둔다.",
        "열람일을 따로 남긴다.",
        "관측 기간과 현재 결과를 구별한다."
      ],
      "exactStringScoring": false
    },
    "previousAnswerContract": {
      "type": "written-explanation",
      "sample": "발행일은 원래의 2024년으로 되돌리고, 오늘은 읽은 날로 따로 적어요. 언제 조사한 기록인지도 확인해 오늘 직접 잰 값과 구별해요.",
      "teacherRequired": true,
      "rubric": {
        "required": [
          "발행일을 원래대로 둔다.",
          "열람일을 따로 남긴다.",
          "관측 기간과 현재 결과를 구별한다."
        ],
        "pass": "자료·업무·과학 연결 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
      },
      "seasonContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "발행일은 원래의 2024년으로 되돌리고, 오늘은 읽은 날로 따로 적어요. 언제 조사한 기록인지도 확인해 오늘 직접 잰 값과 구별해요.",
        "required": [
          "발행일을 원래대로 둔다.",
          "열람일을 따로 남긴다.",
          "관측 기간과 현재 결과를 구별한다."
        ],
        "exactStringScoring": false
      }
    },
    "previousChoices": null,
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": "c22-s62-u04-w014",
      "sourceId": null,
      "bookResponseForm": "reason"
    },
    "fields": {
      "answerContract": {
        "type": "written-explanation",
        "sample": "발행일은 원래의 2024년으로 되돌리고, 오늘은 읽은 날로 따로 적어요. 언제 조사한 기록인지도 확인해 오늘 직접 잰 값과 구별해요.",
        "teacherRequired": true,
        "rubric": {
          "required": [
            "발행 시기는 원래의 2024년으로 되돌리고, 오늘은 자료를 읽은 날로 따로 적는다고 설명해요."
          ],
          "pass": "자료·업무·과학 연결 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
        },
        "seasonContract": {
          "kind": "written-explanation",
          "teacherRequired": true,
          "sample": "발행일은 원래의 2024년으로 되돌리고, 오늘은 읽은 날로 따로 적어요. 언제 조사한 기록인지도 확인해 오늘 직접 잰 값과 구별해요.",
          "required": [
            "발행 시기는 원래의 2024년으로 되돌리고, 오늘은 자료를 읽은 날로 따로 적는다고 설명해요."
          ],
          "exactStringScoring": false
        }
      },
      "responseContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "발행일은 원래의 2024년으로 되돌리고, 오늘은 읽은 날로 따로 적어요. 언제 조사한 기록인지도 확인해 오늘 직접 잰 값과 구별해요.",
        "required": [
          "발행 시기는 원래의 2024년으로 되돌리고, 오늘은 자료를 읽은 날로 따로 적는다고 설명해요."
        ],
        "exactStringScoring": false
      }
    }
  },
  "c22-s62-u02-b093": {
    "unit": "c22-s62-u02",
    "previousVersion": "20261106-combustion-readable-workbook",
    "prompt": "흐려진 석회수의 사진만 보고 기체가 초의 연소에서 왔다고 확정할 수 있을까요?",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 93,
      "section": "이산화 탄소와 전후의 성질",
      "originalExam": false
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E6",
      "type": "T11",
      "format": "까닭 설명",
      "level": "기본",
      "track": "교과",
      "standard": "6과14-03",
      "topic": "이산화 탄소와 전후의 성질",
      "concept": "이산화 탄소 확인",
      "inquirySkill": "이산화 탄소 확인의 근거 연결"
    },
    "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "사진의 반응은 기체를 확인하는 데 쓸 수 있어요. 하지만 그 기체가 어디에서 왔는지는 사진만으로 몰라요. 해당 실험의 장치와 처음·나중 기록, 비교 방법과 시간을 더 확인해야 해요.",
      "required": [
        "확인 반응과 기체 출처를 구별한다.",
        "사진의 한계를 설명한다.",
        "출처·전후·대조 조건을 추가로 요구한다."
      ],
      "exactStringScoring": false
    },
    "previousAnswerContract": {
      "type": "written-explanation",
      "sample": "사진의 반응은 기체를 확인하는 데 쓸 수 있어요. 하지만 그 기체가 어디에서 왔는지는 사진만으로 몰라요. 해당 실험의 장치와 처음·나중 기록, 비교 방법과 시간을 더 확인해야 해요.",
      "teacherRequired": true,
      "rubric": {
        "required": [
          "확인 반응과 기체 출처를 구별한다.",
          "사진의 한계를 설명한다.",
          "출처·전후·대조 조건을 추가로 요구한다."
        ],
        "pass": "그림·자료 근거와 실제 수행은 교사가 확인해요. 타당한 동등 표현을 인정해요."
      },
      "seasonContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "사진의 반응은 기체를 확인하는 데 쓸 수 있어요. 하지만 그 기체가 어디에서 왔는지는 사진만으로 몰라요. 해당 실험의 장치와 처음·나중 기록, 비교 방법과 시간을 더 확인해야 해요.",
        "required": [
          "확인 반응과 기체 출처를 구별한다.",
          "사진의 한계를 설명한다.",
          "출처·전후·대조 조건을 추가로 요구한다."
        ],
        "exactStringScoring": false
      }
    },
    "previousChoices": null,
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": "c22-s62-u02-w093",
      "sourceId": null,
      "bookResponseForm": "reason"
    },
    "fields": {
      "prompt": "흐려진 석회수의 사진만 보고 기체가 초의 연소에서 왔다고 확정할 수 있을까요? 까닭을 설명해 보세요.",
      "answerContract": {
        "type": "written-explanation",
        "sample": "사진의 반응은 기체를 확인하는 데 쓸 수 있어요. 하지만 그 기체가 어디에서 왔는지는 사진만으로 몰라요. 해당 실험의 장치와 처음·나중 기록, 비교 방법과 시간을 더 확인해야 해요.",
        "teacherRequired": true,
        "rubric": {
          "required": [
            "석회수가 흐려진 모습은 볼 수 있지만, 사진만으로는 기체가 어디에서 나왔는지 알 수 없다는 까닭을 설명해요."
          ],
          "pass": "그림·자료 근거와 실제 수행은 교사가 확인해요. 타당한 동등 표현을 인정해요."
        },
        "seasonContract": {
          "kind": "written-explanation",
          "teacherRequired": true,
          "sample": "사진의 반응은 기체를 확인하는 데 쓸 수 있어요. 하지만 그 기체가 어디에서 왔는지는 사진만으로 몰라요. 해당 실험의 장치와 처음·나중 기록, 비교 방법과 시간을 더 확인해야 해요.",
          "required": [
            "석회수가 흐려진 모습은 볼 수 있지만, 사진만으로는 기체가 어디에서 나왔는지 알 수 없다는 까닭을 설명해요."
          ],
          "exactStringScoring": false
        }
      },
      "responseContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "사진의 반응은 기체를 확인하는 데 쓸 수 있어요. 하지만 그 기체가 어디에서 왔는지는 사진만으로 몰라요. 해당 실험의 장치와 처음·나중 기록, 비교 방법과 시간을 더 확인해야 해요.",
        "required": [
          "석회수가 흐려진 모습은 볼 수 있지만, 사진만으로는 기체가 어디에서 나왔는지 알 수 없다는 까닭을 설명해요."
        ],
        "exactStringScoring": false
      }
    }
  },
  "c22-s62-u02-b110": {
    "unit": "c22-s62-u02",
    "previousVersion": "20261106-combustion-readable-workbook",
    "prompt": "옛 조개류 피해 사례를 오늘 읽었어요. 오늘 생긴 피해라고 적어도 될까요? 사례가 생긴 때와 자료를 읽은 날을 나누어 설명하세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 110,
      "section": "생태계의 변화를 자료로 읽기",
      "originalExam": false
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E7",
      "type": "T17",
      "format": "까닭 설명",
      "level": "기본",
      "track": "교과",
      "standard": "6과14-04",
      "topic": "생태계의 변화를 자료로 읽기",
      "concept": "생태계 자료의 범위",
      "inquirySkill": "기관·대상·시기·실측/모형과 생물 영향 근거를 연결해요."
    },
    "responseContract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "sample": "오늘은 자료를 읽은 날이고 피해가 생긴 때는 따로 있어요. 원문에서 사례가 생긴 시기와 지역을 찾아 적어요. 지금 상황은 별도의 최근 관측 자료로 확인해야 해요.",
      "required": [
        "확인일과 사건/관측 시기를 구별한다.",
        "사례의 지역·시기를 보존한다.",
        "현재 판단에는 새 근거가 필요함을 말한다."
      ],
      "exactStringScoring": false
    },
    "previousAnswerContract": {
      "type": "written-explanation",
      "sample": "오늘은 자료를 읽은 날이고 피해가 생긴 때는 따로 있어요. 원문에서 사례가 생긴 시기와 지역을 찾아 적어요. 지금 상황은 별도의 최근 관측 자료로 확인해야 해요.",
      "teacherRequired": true,
      "rubric": {
        "required": [
          "확인일과 사건/관측 시기를 구별한다.",
          "사례의 지역·시기를 보존한다.",
          "현재 판단에는 새 근거가 필요함을 말한다."
        ],
        "pass": "그림·자료 근거와 실제 수행은 교사가 확인해요. 타당한 동등 표현을 인정해요."
      },
      "seasonContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "오늘은 자료를 읽은 날이고 피해가 생긴 때는 따로 있어요. 원문에서 사례가 생긴 시기와 지역을 찾아 적어요. 지금 상황은 별도의 최근 관측 자료로 확인해야 해요.",
        "required": [
          "확인일과 사건/관측 시기를 구별한다.",
          "사례의 지역·시기를 보존한다.",
          "현재 판단에는 새 근거가 필요함을 말한다."
        ],
        "exactStringScoring": false
      }
    },
    "previousChoices": null,
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": "c22-s62-u02-w110",
      "sourceId": null,
      "bookResponseForm": "reason"
    },
    "fields": {
      "answerContract": {
        "type": "written-explanation",
        "sample": "오늘은 자료를 읽은 날이고 피해가 생긴 때는 따로 있어요. 원문에서 사례가 생긴 시기와 지역을 찾아 적어요. 지금 상황은 별도의 최근 관측 자료로 확인해야 해요.",
        "teacherRequired": true,
        "rubric": {
          "required": [
            "오늘은 자료를 읽은 날이고 피해가 생긴 때는 따로 있다는 점을 설명해요. 사례가 생긴 시기를 확인하여 그대로 적는다고 해요."
          ],
          "pass": "그림·자료 근거와 실제 수행은 교사가 확인해요. 타당한 동등 표현을 인정해요."
        },
        "seasonContract": {
          "kind": "written-explanation",
          "teacherRequired": true,
          "sample": "오늘은 자료를 읽은 날이고 피해가 생긴 때는 따로 있어요. 원문에서 사례가 생긴 시기와 지역을 찾아 적어요. 지금 상황은 별도의 최근 관측 자료로 확인해야 해요.",
          "required": [
            "오늘은 자료를 읽은 날이고 피해가 생긴 때는 따로 있다는 점을 설명해요. 사례가 생긴 시기를 확인하여 그대로 적는다고 해요."
          ],
          "exactStringScoring": false
        }
      },
      "responseContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "sample": "오늘은 자료를 읽은 날이고 피해가 생긴 때는 따로 있어요. 원문에서 사례가 생긴 시기와 지역을 찾아 적어요. 지금 상황은 별도의 최근 관측 자료로 확인해야 해요.",
        "required": [
          "오늘은 자료를 읽은 날이고 피해가 생긴 때는 따로 있다는 점을 설명해요. 사례가 생긴 시기를 확인하여 그대로 적는다고 해요."
        ],
        "exactStringScoring": false
      }
    }
  },
  "c22-s62-u01-b026": {
    "unit": "c22-s62-u01",
    "previousVersion": "20261106-season-readable-workbook",
    "prompt": "하루 그래프를 읽을 때 지켜야 할 것을 고르세요. (정답 2개)",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 26,
      "section": "같은 막대의 그림자가 달라져요",
      "originalExam": false
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T04",
      "format": "복수 선택",
      "level": "기본",
      "track": "교과",
      "standard": "6과13-01",
      "topic": "같은 막대의 그림자가 달라져요",
      "concept": "표와 그래프 읽기",
      "inquirySkill": "자료의 축·단위·최댓값 범위 해석"
    },
    "responseContract": {
      "kind": "multi-choice",
      "teacherRequired": false,
      "answers": [
        1,
        4
      ]
    },
    "previousAnswerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        4
      ],
      "seasonContract": {
        "kind": "multi-choice",
        "teacherRequired": false,
        "answers": [
          1,
          4
        ]
      }
    },
    "previousChoices": [
      "그래프 선의 교차점이면 서로 다른 두 양의 값이 같다.",
      "측정하지 않은 구간을 직접 측정한 것으로 바꾸지 않는다.",
      "모든 그래프의 최대 시각을 무조건12:00으로 고친다.",
      "점이 적으면 그 사이 값도 실제로 잰 것으로 표시한다.",
      "고도와 기온의 세로축 단위를 구별한다."
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": "c22-s62-u01-w026",
      "sourceId": null,
      "bookResponseForm": "multiple"
    },
    "fields": {
      "choices": [
        "그래프 선의 교차점이면 서로 다른 두 양의 값이 같다.",
        "측정하지 않은 구간을 직접 측정한 것으로 바꾸지 않는다.",
        "태양 고도가 가장 높은 시각에는 기온도 반드시 가장 높다고 읽는다.",
        "점이 적으면 그 사이 값도 실제로 잰 것으로 표시한다.",
        "고도와 기온의 세로축 단위를 구별한다."
      ]
    }
  },
  "c22-s61-u01-b096": {
    "unit": "c22-s61-u01",
    "previousVersion": "20261104-acid-class",
    "prompt": "소개 자료에 약해진 나무 사진만 있고 지역과 시기, 원인에 관한 설명은 없어요. 산성비의 피해를 설명하려면 어떤 내용을 더 조사해야 할까요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 산과 염기 독립 창작 교재",
      "course": "초등6-1"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u01",
      "area": "물질",
      "element": "E6",
      "type": "T09",
      "format": "서술형",
      "level": "심화",
      "track": "교과",
      "standard": "6과09-04",
      "topic": "피해 설명에 필요한 자료",
      "concept": "소개하고 설명을 보완해요",
      "inquirySkill": "관찰한 변화와 비교 조건을 근거로 설명하기"
    },
    "responseContract": "written-explanation",
    "previousAnswerContract": {
      "type": "written-explanation",
      "sample": "사진을 찍은 지역과 시기, 그곳의 빗물과 토양 상태, 나무의 생장에 영향을 줄 다른 조건을 조사해요. 산성비와 피해의 관계를 설명하는 자료도 찾아요.",
      "rubric": {
        "required": [
          "지역·시기와 빗물·토양 상태, 다른 생장 조건 등 두 가지 이상의 조사 내용과 산성비 관련 자료의 필요성을 제시한다."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "답의 일치와 실제 수행·공식 성적은 구별한다."
      },
      "reviewRequired": true
    },
    "previousChoices": null,
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": {
        "unit": "c22-s61-u01",
        "id": "c22-s61-u01-w096",
        "no": 96
      },
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": "written"
    },
    "fields": {
      "answerContract": {
        "type": "written-explanation",
        "sample": "사진을 찍은 지역과 시기, 그곳의 빗물과 토양 상태, 나무의 생장에 영향을 줄 다른 조건을 조사해요. 산성비와 피해의 관계를 설명하는 자료도 찾아요.",
        "rubric": {
          "required": [
            "사진을 찍은 지역과 시기, 빗물과 토양의 상태, 나무가 자라는 다른 조건처럼 더 조사할 내용을 제시해요. 산성비와 피해의 관계를 설명하는 자료를 찾아야 한다고 해도 돼요."
          ],
          "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
          "note": "답의 일치와 실제 수행·공식 성적은 구별한다."
        },
        "reviewRequired": true
      }
    }
  },
  "c22-s61-u02-b054": {
    "unit": "c22-s61-u02",
    "previousVersion": "20261104-motion-class",
    "prompt": "A는 2초 동안, B는 5초 동안 움직인 뒤의 위치 사진입니다. 더 멀리 간 B가 빠르다고 바로 말할 수 없는 까닭을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 54,
      "section": "교과 연결 사고력"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T04",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "비교 시간의 차이",
      "concept": "같은 시간의 거리 비교",
      "inquirySkill": "이동 시간이 같을 때 더 긴 거리를 이동한 물체가 빠름을 설명한다."
    },
    "responseContract": "written-explanation",
    "previousAnswerContract": {
      "type": "written-explanation",
      "sample": "이동한 시간이 달라 거리만으로 비교할 수 없어요. 같은 시간의 이동 거리를 다시 재거나 각 거리와 시간으로 속력을 구해요.",
      "rubric": {
        "required": [
          "2초/5초 차이 지적",
          "거리만으로 단정 보류",
          "같은 시간 재측정 또는 속력 비교"
        ],
        "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
      },
      "motionContract": {
        "kind": "teacher-explanation",
        "teacherRequired": true,
        "sample": "이동한 시간이 달라 거리만으로 비교할 수 없어요. 같은 시간의 이동 거리를 다시 재거나 각 거리와 시간으로 속력을 구해요.",
        "required": [
          "2초/5초 차이 지적",
          "거리만으로 단정 보류",
          "같은 시간 재측정 또는 속력 비교"
        ],
        "actualPerformanceMustNotBeInferred": true
      },
      "reviewRequired": true
    },
    "previousChoices": null,
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": {
        "id": "c22-s61-u02-w054",
        "no": 54
      },
      "bookQuestionId": "c22-s61-u02-w054",
      "sourceId": null,
      "bookResponseForm": "written"
    },
    "fields": {
      "answerContract": {
        "type": "written-explanation",
        "sample": "이동한 시간이 달라 거리만으로 비교할 수 없어요. 같은 시간의 이동 거리를 다시 재거나 각 거리와 시간으로 속력을 구해요.",
        "rubric": {
          "required": [
            "A와 B가 움직인 시간이 2초와 5초로 다르므로, 이동한 거리만으로 빠르기를 비교할 수 없다는 까닭을 설명해요."
          ],
          "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
        },
        "motionContract": {
          "kind": "teacher-explanation",
          "teacherRequired": true,
          "sample": "이동한 시간이 달라 거리만으로 비교할 수 없어요. 같은 시간의 이동 거리를 다시 재거나 각 거리와 시간으로 속력을 구해요.",
          "required": [
            "A와 B가 움직인 시간이 2초와 5초로 다르므로, 이동한 거리만으로 빠르기를 비교할 수 없다는 까닭을 설명해요."
          ],
          "actualPerformanceMustNotBeInferred": true
        },
        "reviewRequired": true
      }
    }
  },
  "c22-s61-u03-b015": {
    "unit": "c22-s61-u03",
    "previousVersion": "20261106-plant-structure-readable-workbook",
    "prompt": "같은 양파 표피를 보았는데 친구 그림과 내 그림이 달랐어요. 누가 틀렸다고 바로 정하기 전에 무엇을 확인해야 할까요?",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 15,
      "section": "교과 연결 사고력"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-01",
      "topic": "표본 차이",
      "concept": "식물 세포 관찰 자료",
      "inquirySkill": "현미경 관찰 그림·기록과 구조 기호 해석"
    },
    "responseContract": "written-explanation",
    "previousAnswerContract": {
      "type": "written-explanation",
      "sample": "표본의 위치·두께, 배율과 초점·조명을 비교해요. 각각 실제 보인 범위를 확인한 뒤 같은 부분을 다시 관찰해요.",
      "rubric": {
        "required": [
          "표본 위치/상태 비교",
          "배율·조명·초점 중 조건 비교",
          "같은 부분을 실제로 재관찰"
        ],
        "pass": "그림·관찰·근거와 실제 제작/설명은 교사 확인 · 타당한 동등 표현 인정"
      },
      "plantAuthoredContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "actualPerformanceMustNotBeInferred": true,
        "required": [
          "표본 위치/상태 비교",
          "배율·조명·초점 중 조건 비교",
          "같은 부분을 실제로 재관찰"
        ]
      }
    },
    "previousChoices": null,
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": "c22-s61-u03-w015",
      "sourceId": null,
      "bookResponseForm": "written"
    },
    "fields": {
      "answerContract": {
        "type": "written-explanation",
        "sample": "표본의 위치·두께, 배율과 초점·조명을 비교해요. 각각 실제 보인 범위를 확인한 뒤 같은 부분을 다시 관찰해요.",
        "rubric": {
          "required": [
            "표본의 위치나 두께, 배율·초점·조명처럼 두 사람이 다르게 보았을 수 있는 관찰 조건을 제시해요."
          ],
          "pass": "그림·관찰·근거와 실제 제작/설명은 교사 확인 · 타당한 동등 표현 인정"
        },
        "plantAuthoredContract": {
          "kind": "written-explanation",
          "teacherRequired": true,
          "actualPerformanceMustNotBeInferred": true,
          "required": [
            "표본의 위치나 두께, 배율·초점·조명처럼 두 사람이 다르게 보았을 수 있는 관찰 조건을 제시해요."
          ]
        }
      }
    }
  },
  "c22-s61-u03-b036": {
    "unit": "c22-s61-u03",
    "previousVersion": "20261106-plant-structure-readable-workbook",
    "prompt": "색소 물 실험에서 확인할 자료를 모두 고르세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 36,
      "section": "교과 연결 사고력"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E2",
      "type": "T06",
      "format": "복수 선택",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "단면 관찰의 근거",
      "concept": "줄기 색소 물 이동",
      "inquirySkill": "단면/실험 자료에서 이동 경로 추론"
    },
    "responseContract": "multi-choice",
    "previousAnswerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        1,
        3
      ],
      "plantAuthoredContract": {
        "kind": "multi-choice",
        "answers": [
          0,
          1,
          3
        ]
      }
    },
    "previousChoices": [
      "색소 물에 둔 시간과 비교할 줄기",
      "넣기 전 줄기의 색",
      "학생이 직접 칼로 단면을 자르는 속도",
      "선생님이 준비한 가로와 세로로 자른 면의 색 위치",
      "식물이 예쁜 정도"
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": "c22-s61-u03-w036",
      "sourceId": null,
      "bookResponseForm": "multi"
    },
    "fields": {
      "prompt": "색소 물이 줄기의 어느 부분으로 이동했는지 알아보려고 해요. 확인할 자료를 모두 고르세요.",
      "choices": [
        "색소 물에 둔 시간과 비교할 줄기",
        "넣기 전 줄기의 색",
        "그 식물의 꽃잎과 꽃받침의 개수",
        "선생님이 준비한 가로와 세로로 자른 면의 색 위치",
        "그 식물의 잎 가장자리에 난 톱니 모양"
      ]
    }
  },
  "c22-s61-u03-b113": {
    "unit": "c22-s61-u03",
    "previousVersion": "20261106-plant-structure-readable-workbook",
    "prompt": "관심 있는 식물의 구조와 기능을 설명하는 자료를 만들려고 합니다. 알맞은 주제를 고르세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 113,
      "section": "교과 연결 사고력"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E6",
      "type": "T14",
      "format": "객관식",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-03",
      "topic": "설명 자료의 초점",
      "concept": "식물 특징 설명 자료와 나눔",
      "inquirySkill": "관찰/조사 근거 선택·구조와 기능 설명·자료 제작/공유"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ],
      "plantAuthoredContract": {
        "kind": "single-choice",
        "answer": 0
      }
    },
    "previousChoices": [
      "연잎의 생김새를 관찰하고 빛 받기와 연결해 설명하기",
      "식물 사진을 많이 모으고 이름은 모두 지우기",
      "같은 식물을 보지 않고 모든 식물의 특징이 같다고 적기",
      "나의 관찰 대신 친구 작품을 내 것이라고 붙이기",
      "인터넷 제목만 보고 실험을 했다고 쓰기"
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": "c22-s61-u03-w113",
      "sourceId": null,
      "bookResponseForm": "choice"
    },
    "fields": {
      "prompt": "식물의 생김새가 어떤 일에 도움이 되는지 설명하려고 해요. 알맞은 주제를 고르세요.",
      "choices": [
        "연잎의 생김새를 관찰하고 빛 받기와 연결해 설명하기",
        "같은 식물의 꽃이 피는 날짜를 달력에 표시하기",
        "여러 식물의 잎 가장자리 모양에 따라 분류하기",
        "서로 다른 식물의 씨 크기를 재어 순서대로 놓기",
        "식물의 줄기가 자란 길이를 날짜별로 기록하기"
      ],
      "explanation": "연잎의 생김새를 빛을 받는 일과 연결한 첫째 주제가 알맞아요. 나머지는 꽃 피는 시기, 잎 모양, 씨 크기, 줄기의 길이를 정리하는 주제예요. 생김새와 하는 일을 서로 연결해 설명해야 해요."
    }
  },
  "c22-s61-u03-b124": {
    "unit": "c22-s61-u03",
    "previousVersion": "20261106-plant-structure-readable-workbook",
    "prompt": "전체 식물 사진과 확대 그림이 따로 있어 친구가 어느 부분인지 헷갈려 해요. 두 그림과 그 부분이 하는 일의 설명을 어떻게 연결하면 좋을까요?",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 124,
      "section": "교과 연결 사고력"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E6",
      "type": "T14",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-03",
      "topic": "전체 사진과 부분 확대",
      "concept": "식물 특징 설명 자료와 나눔",
      "inquirySkill": "관찰/조사 근거 선택·구조와 기능 설명·자료 제작/공유"
    },
    "responseContract": "written-explanation",
    "previousAnswerContract": {
      "type": "written-explanation",
      "sample": "전체 사진에서 확대한 부분을 테두리나 이름표로 표시하고 확대 그림과 이어요. 확대 그림에 부분의 이름과 하는 일을 적고 어디서 관찰하거나 알아보았는지도 밝혀요.",
      "rubric": {
        "required": [
          "전체와 확대한 부분의 위치 연결",
          "구조 이름과 기능 문장 연결",
          "관찰/자료 근거와 출처 표시"
        ],
        "pass": "그림·관찰·근거와 실제 제작/설명은 교사 확인 · 타당한 동등 표현 인정"
      },
      "plantAuthoredContract": {
        "kind": "written-explanation",
        "teacherRequired": true,
        "actualPerformanceMustNotBeInferred": true,
        "required": [
          "전체와 확대한 부분의 위치 연결",
          "구조 이름과 기능 문장 연결",
          "관찰/자료 근거와 출처 표시"
        ]
      }
    },
    "previousChoices": null,
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": "c22-s61-u03-w124",
      "sourceId": null,
      "bookResponseForm": "written"
    },
    "fields": {
      "answerContract": {
        "type": "written-explanation",
        "sample": "전체 사진에서 확대한 부분을 테두리나 이름표로 표시하고 확대 그림과 이어요. 확대 그림에 부분의 이름과 하는 일을 적고 어디서 관찰하거나 알아보았는지도 밝혀요.",
        "rubric": {
          "required": [
            "전체 사진에서 확대한 부분의 위치를 표시하고 두 그림을 연결해요. 확대 그림에 그 부분의 이름과 하는 일을 나타내는 방법을 설명해요."
          ],
          "pass": "그림·관찰·근거와 실제 제작/설명은 교사 확인 · 타당한 동등 표현 인정"
        },
        "plantAuthoredContract": {
          "kind": "written-explanation",
          "teacherRequired": true,
          "actualPerformanceMustNotBeInferred": true,
          "required": [
            "전체 사진에서 확대한 부분의 위치를 표시하고 두 그림을 연결해요. 확대 그림에 그 부분의 이름과 하는 일을 나타내는 방법을 설명해요."
          ]
        }
      }
    }
  },
  "c22-s61-u04-b020": {
    "unit": "c22-s61-u04",
    "previousVersion": "20261106-earth-motion-readable-workbook",
    "prompt": "같은 밤 남쪽 별무리의 위치를 비교한 기록에서 가능한 해석을 고르세요. (2개 선택)",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 20,
      "section": "하루 동안 달라지는 태양과 별",
      "originalExam": false
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T12",
      "format": "복수 선택",
      "level": "기본",
      "track": "교과",
      "standard": "6과12-01",
      "topic": "하루 동안 달라지는 태양과 별",
      "concept": "관측 방법과 자료 신뢰성",
      "inquirySkill": "안전·관찰 절차·자료 종류·불분명한 상태 판단"
    },
    "responseContract": {
      "kind": "multi-choice",
      "answers": [
        2,
        4
      ]
    },
    "previousAnswerContract": {
      "type": "multi-choice",
      "answers": [
        2,
        4
      ],
      "earthAuthoredContract": {
        "kind": "multi-choice",
        "answers": [
          2,
          4
        ]
      }
    },
    "previousChoices": [
      "별자리 선이 별들을 실제 줄로 연결했다는 뜻이다.",
      "사진만 읽었어도 학생이 야외 관측을 한 것으로 기록한다.",
      "두 시각의 별 배열로 같은 별무리인지 확인할 수 있다.",
      "한 시간의 위치 변화로 지구 공전의 일 년 주기를 직접 측정했다.",
      "관측자의 방향도 바뀌었으면 위치 차이의 원인이 섞일 수 있다."
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": "c22-s61-u04-w020",
      "sourceId": null,
      "bookResponseForm": "multiple"
    },
    "fields": {
      "choices": [
        "별자리 선이 별들을 실제 줄로 연결했다는 뜻이다.",
        "별 사이의 배열이 비슷하므로 별무리 전체의 위치도 변하지 않았다고 한다.",
        "두 시각의 별 배열로 같은 별무리인지 확인할 수 있다.",
        "한 시간의 위치 변화로 지구 공전의 일 년 주기를 직접 측정했다.",
        "관측자의 방향도 바뀌었으면 위치 차이의 원인이 섞일 수 있다."
      ]
    }
  },
  "c22-s61-u04-b098": {
    "unit": "c22-s61-u04",
    "previousVersion": "20261106-earth-motion-readable-workbook",
    "prompt": "서울·남쪽·밤 9시로 설정한 두 계절 화면에서 별무리 위치가 다릅니다. 다음으로 할 설명으로 가장 적절한 것은 무엇인가요?",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 98,
      "section": "조건을 맞춘 별자리 비교",
      "originalExam": false
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u04",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T07",
      "format": "객관식",
      "level": "기본",
      "track": "교과",
      "standard": "6과12-03",
      "topic": "조건을 맞춘 별자리 비교",
      "concept": "별자리 관측 조건과 일반화",
      "inquirySkill": "날짜·시각·장소 통제와 주장 한계"
    },
    "responseContract": {
      "kind": "single-choice",
      "answer": 3
    },
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 3,
      "earthAuthoredContract": {
        "kind": "single-choice",
        "answer": 3
      }
    },
    "previousChoices": [
      "화면의 배경이 학교 운동장을 실제로 촬영한 사진이라고 한다.",
      "같은 별자리는 다른 계절의 어떤 시각에도 없다고 한다.",
      "두 화면을 열었으므로 네 계절 야외 관측을 모두 마쳤다고 한다.",
      "같은 조건에서 달라진 별무리의 위치를 지구의 공전과 연결해 설명한다.",
      "별 이름표의 개수만 세어 공전 속도를 계산했다고 한다."
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": "c22-s61-u04-w098",
      "sourceId": null,
      "bookResponseForm": "single"
    },
    "fields": {
      "choices": [
        "밤 9시가 같으니 별무리의 위치도 같아야 한다며 한 화면이 틀렸다고 한다.",
        "두 계절의 위치 차이를 지구가 하루에 한 바퀴 자전하는 것만으로 설명한다.",
        "계절마다 별들이 지구 주위를 실제로 돌기 때문에 위치가 바뀐다고 설명한다.",
        "같은 조건에서 달라진 별무리의 위치를 지구의 공전과 연결해 설명한다.",
        "두 화면의 시각을 서로 다르게 바꾼 뒤 위치가 비슷해지면 계절에 따른 차이는 없다고 한다."
      ]
    }
  }
};
const workbookPatches={
  "c22-s62-u04-w014": {
    "unit": "c22-s62-u04",
    "prompt": "2024년 자료를 오늘 읽은 뒤 발행일을 오늘로 고쳤습니다. 어떻게 바로잡을까요?",
    "sourceId": null,
    "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-2",
      "unit": "Ⅳ. 과학과 나의 진로",
      "originalExam": false
    },
    "fields": {
      "criteria": [
        "발행일을 원래대로 둔다. / 열람일을 따로 남긴다. / 관측 기간과 현재 결과를 구별한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 조사·토의·설명 수행을 확정하지 않는다.",
        "발행 시기는 원래의 2024년으로 되돌리고, 오늘은 자료를 읽은 날로 따로 적는다고 설명해요."
      ],
      "responseContract": [
        {
          "kind": "written-explanation",
          "teacherRequired": true,
          "sample": "발행일은 원래의 2024년으로 되돌리고, 오늘은 읽은 날로 따로 적어요. 언제 조사한 기록인지도 확인해 오늘 직접 잰 값과 구별해요.",
          "required": [
            "발행일을 원래대로 둔다.",
            "열람일을 따로 남긴다.",
            "관측 기간과 현재 결과를 구별한다."
          ],
          "exactStringScoring": false
        },
        {
          "kind": "written-explanation",
          "teacherRequired": true,
          "sample": "발행일은 원래의 2024년으로 되돌리고, 오늘은 읽은 날로 따로 적어요. 언제 조사한 기록인지도 확인해 오늘 직접 잰 값과 구별해요.",
          "required": [
            "발행 시기는 원래의 2024년으로 되돌리고, 오늘은 자료를 읽은 날로 따로 적는다고 설명해요."
          ],
          "exactStringScoring": false
        }
      ]
    },
    "previousStatus": "authored"
  },
  "c22-s62-u02-w093": {
    "unit": "c22-s62-u02",
    "prompt": "흐려진 석회수의 사진만 보고 기체가 초의 연소에서 왔다고 확정할 수 있을까요?",
    "sourceId": null,
    "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-2",
      "unit": "Ⅱ. 물질의 연소",
      "originalExam": false
    },
    "fields": {
      "prompt": [
        "흐려진 석회수의 사진만 보고 기체가 초의 연소에서 왔다고 확정할 수 있을까요?",
        "흐려진 석회수의 사진만 보고 기체가 초의 연소에서 왔다고 확정할 수 있을까요? 까닭을 설명해 보세요."
      ],
      "criteria": [
        "확인 반응과 기체 출처를 구별한다. / 사진의 한계를 설명한다. / 출처·전후·대조 조건을 추가로 요구한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
        "석회수가 흐려진 모습은 볼 수 있지만, 사진만으로는 기체가 어디에서 나왔는지 알 수 없다는 까닭을 설명해요."
      ],
      "responseContract": [
        {
          "kind": "written-explanation",
          "teacherRequired": true,
          "sample": "사진의 반응은 기체를 확인하는 데 쓸 수 있어요. 하지만 그 기체가 어디에서 왔는지는 사진만으로 몰라요. 해당 실험의 장치와 처음·나중 기록, 비교 방법과 시간을 더 확인해야 해요.",
          "required": [
            "확인 반응과 기체 출처를 구별한다.",
            "사진의 한계를 설명한다.",
            "출처·전후·대조 조건을 추가로 요구한다."
          ],
          "exactStringScoring": false
        },
        {
          "kind": "written-explanation",
          "teacherRequired": true,
          "sample": "사진의 반응은 기체를 확인하는 데 쓸 수 있어요. 하지만 그 기체가 어디에서 왔는지는 사진만으로 몰라요. 해당 실험의 장치와 처음·나중 기록, 비교 방법과 시간을 더 확인해야 해요.",
          "required": [
            "석회수가 흐려진 모습은 볼 수 있지만, 사진만으로는 기체가 어디에서 나왔는지 알 수 없다는 까닭을 설명해요."
          ],
          "exactStringScoring": false
        }
      ]
    },
    "previousStatus": "authored"
  },
  "c22-s62-u02-w110": {
    "unit": "c22-s62-u02",
    "prompt": "옛 조개류 피해 사례를 오늘 읽었어요. 오늘 생긴 피해라고 적어도 될까요? 사례가 생긴 때와 자료를 읽은 날을 나누어 설명하세요.",
    "sourceId": null,
    "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-2",
      "unit": "Ⅱ. 물질의 연소",
      "originalExam": false
    },
    "fields": {
      "criteria": [
        "확인일과 사건/관측 시기를 구별한다. / 사례의 지역·시기를 보존한다. / 현재 판단에는 새 근거가 필요함을 말한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
        "오늘은 자료를 읽은 날이고 피해가 생긴 때는 따로 있다는 점을 설명해요. 사례가 생긴 시기를 확인하여 그대로 적는다고 해요."
      ],
      "responseContract": [
        {
          "kind": "written-explanation",
          "teacherRequired": true,
          "sample": "오늘은 자료를 읽은 날이고 피해가 생긴 때는 따로 있어요. 원문에서 사례가 생긴 시기와 지역을 찾아 적어요. 지금 상황은 별도의 최근 관측 자료로 확인해야 해요.",
          "required": [
            "확인일과 사건/관측 시기를 구별한다.",
            "사례의 지역·시기를 보존한다.",
            "현재 판단에는 새 근거가 필요함을 말한다."
          ],
          "exactStringScoring": false
        },
        {
          "kind": "written-explanation",
          "teacherRequired": true,
          "sample": "오늘은 자료를 읽은 날이고 피해가 생긴 때는 따로 있어요. 원문에서 사례가 생긴 시기와 지역을 찾아 적어요. 지금 상황은 별도의 최근 관측 자료로 확인해야 해요.",
          "required": [
            "오늘은 자료를 읽은 날이고 피해가 생긴 때는 따로 있다는 점을 설명해요. 사례가 생긴 시기를 확인하여 그대로 적는다고 해요."
          ],
          "exactStringScoring": false
        }
      ]
    },
    "previousStatus": "authored"
  },
  "c22-s62-u01-w026": {
    "unit": "c22-s62-u01",
    "prompt": "하루 그래프를 읽을 때 지켜야 할 것을 고르세요. (정답 2개)",
    "sourceId": null,
    "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-2",
      "unit": "Ⅰ. 계절의 변화",
      "originalExam": false
    },
    "fields": {
      "choices": [
        [
          "그래프 선의 교차점이면 서로 다른 두 양의 값이 같다.",
          "측정하지 않은 구간을 직접 측정한 것으로 바꾸지 않는다.",
          "모든 그래프의 최대 시각을 무조건12:00으로 고친다.",
          "점이 적으면 그 사이 값도 실제로 잰 것으로 표시한다.",
          "고도와 기온의 세로축 단위를 구별한다."
        ],
        [
          "그래프 선의 교차점이면 서로 다른 두 양의 값이 같다.",
          "측정하지 않은 구간을 직접 측정한 것으로 바꾸지 않는다.",
          "태양 고도가 가장 높은 시각에는 기온도 반드시 가장 높다고 읽는다.",
          "점이 적으면 그 사이 값도 실제로 잰 것으로 표시한다.",
          "고도와 기온의 세로축 단위를 구별한다."
        ]
      ]
    },
    "previousStatus": "authored"
  },
  "c22-s61-u01-w096": {
    "unit": "c22-s61-u01",
    "prompt": "소개 자료에 약해진 나무 사진만 있고 지역과 시기, 원인에 관한 설명은 없어요. 산성비의 피해를 설명하려면 어떤 내용을 더 조사해야 할까요?",
    "sourceId": null,
    "sourceRef": null,
    "fields": {
      "criteria": [
        "지역·시기와 빗물·토양 상태, 다른 생장 조건 등 두 가지 이상의 조사 내용과 산성비 관련 자료의 필요성을 제시한다.",
        "사진을 찍은 지역과 시기, 빗물과 토양의 상태, 나무가 자라는 다른 조건처럼 더 조사할 내용을 제시해요. 산성비와 피해의 관계를 설명하는 자료를 찾아야 한다고 해도 돼요."
      ]
    },
    "previousStatus": null
  },
  "c22-s61-u02-w054": {
    "unit": "c22-s61-u02",
    "prompt": "A는 2초 동안, B는 5초 동안 움직인 뒤의 위치 사진입니다. 더 멀리 간 B가 빠르다고 바로 말할 수 없는 까닭을 쓰세요.",
    "sourceId": null,
    "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅱ. 물체의 운동",
      "originalExam": false
    },
    "fields": {
      "criteria": [
        "2초/5초 차이 지적 / 거리만으로 단정 보류 / 같은 시간 재측정 또는 속력 비교",
        "A와 B가 움직인 시간이 2초와 5초로 다르므로, 이동한 거리만으로 빠르기를 비교할 수 없다는 까닭을 설명해요."
      ],
      "responseContract": [
        {
          "kind": "teacher-explanation",
          "teacherRequired": true,
          "sample": "이동한 시간이 달라 거리만으로 비교할 수 없어요. 같은 시간의 이동 거리를 다시 재거나 각 거리와 시간으로 속력을 구해요.",
          "required": [
            "2초/5초 차이 지적",
            "거리만으로 단정 보류",
            "같은 시간 재측정 또는 속력 비교"
          ],
          "actualPerformanceMustNotBeInferred": true
        },
        {
          "kind": "teacher-explanation",
          "teacherRequired": true,
          "sample": "이동한 시간이 달라 거리만으로 비교할 수 없어요. 같은 시간의 이동 거리를 다시 재거나 각 거리와 시간으로 속력을 구해요.",
          "required": [
            "A와 B가 움직인 시간이 2초와 5초로 다르므로, 이동한 거리만으로 빠르기를 비교할 수 없다는 까닭을 설명해요."
          ],
          "actualPerformanceMustNotBeInferred": true
        }
      ]
    },
    "previousStatus": "authored-draft"
  },
  "c22-s61-u03-w001": {
    "unit": "c22-s61-u03",
    "prompt": "양파 표피를 현미경으로 보니 작은 단위가 여러 개 이어져 있었습니다. 생물을 이루는 기본 단위의 이름을 고르세요.",
    "sourceId": null,
    "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅲ. 식물의 구조와 기능",
      "originalExam": false
    },
    "fields": {
      "criteria": [
        "「세포」을 고른다. 양파 표피를 이루는 작은 기본 단위는 세포예요. 기관인 뿌리·줄기나 도구 이름과 구별해요.",
        "생물을 이루는 기본 단위인 세포를 고른다."
      ]
    },
    "previousStatus": "authored-draft"
  },
  "c22-s61-u03-w015": {
    "unit": "c22-s61-u03",
    "prompt": "같은 양파 표피를 보았는데 친구 그림과 내 그림이 달랐어요. 누가 틀렸다고 바로 정하기 전에 무엇을 확인해야 할까요?",
    "sourceId": null,
    "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅲ. 식물의 구조와 기능",
      "originalExam": false
    },
    "fields": {
      "criteria": [
        "표본 위치/상태 비교 / 배율·조명·초점 중 조건 비교 / 같은 부분을 실제로 재관찰",
        "표본의 위치나 두께, 배율·초점·조명처럼 두 사람이 다르게 보았을 수 있는 관찰 조건을 제시해요."
      ],
      "responseContract": [
        {
          "kind": "written-explanation",
          "teacherRequired": true,
          "actualPerformanceMustNotBeInferred": true,
          "required": [
            "표본 위치/상태 비교",
            "배율·조명·초점 중 조건 비교",
            "같은 부분을 실제로 재관찰"
          ]
        },
        {
          "kind": "written-explanation",
          "teacherRequired": true,
          "actualPerformanceMustNotBeInferred": true,
          "required": [
            "표본의 위치나 두께, 배율·초점·조명처럼 두 사람이 다르게 보았을 수 있는 관찰 조건을 제시해요."
          ]
        }
      ]
    },
    "previousStatus": "authored-draft"
  },
  "c22-s61-u03-w036": {
    "unit": "c22-s61-u03",
    "prompt": "색소 물 실험에서 확인할 자료를 모두 고르세요.",
    "sourceId": null,
    "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅲ. 식물의 구조와 기능",
      "originalExam": false
    },
    "fields": {
      "prompt": [
        "색소 물 실험에서 확인할 자료를 모두 고르세요.",
        "색소 물이 줄기의 어느 부분으로 이동했는지 알아보려고 해요. 확인할 자료를 모두 고르세요."
      ],
      "choices": [
        [
          "색소 물에 둔 시간과 비교할 줄기",
          "넣기 전 줄기의 색",
          "학생이 직접 칼로 단면을 자르는 속도",
          "선생님이 준비한 가로와 세로로 자른 면의 색 위치",
          "식물이 예쁜 정도"
        ],
        [
          "색소 물에 둔 시간과 비교할 줄기",
          "넣기 전 줄기의 색",
          "그 식물의 꽃잎과 꽃받침의 개수",
          "선생님이 준비한 가로와 세로로 자른 면의 색 위치",
          "그 식물의 잎 가장자리에 난 톱니 모양"
        ]
      ]
    },
    "previousStatus": "authored-draft"
  },
  "c22-s61-u03-w113": {
    "unit": "c22-s61-u03",
    "prompt": "관심 있는 식물의 구조와 기능을 설명하는 자료를 만들려고 합니다. 알맞은 주제를 고르세요.",
    "sourceId": null,
    "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅲ. 식물의 구조와 기능",
      "originalExam": false
    },
    "fields": {
      "prompt": [
        "관심 있는 식물의 구조와 기능을 설명하는 자료를 만들려고 합니다. 알맞은 주제를 고르세요.",
        "식물의 생김새가 어떤 일에 도움이 되는지 설명하려고 해요. 알맞은 주제를 고르세요."
      ],
      "choices": [
        [
          "연잎의 생김새를 관찰하고 빛 받기와 연결해 설명하기",
          "식물 사진을 많이 모으고 이름은 모두 지우기",
          "같은 식물을 보지 않고 모든 식물의 특징이 같다고 적기",
          "나의 관찰 대신 친구 작품을 내 것이라고 붙이기",
          "인터넷 제목만 보고 실험을 했다고 쓰기"
        ],
        [
          "연잎의 생김새를 관찰하고 빛 받기와 연결해 설명하기",
          "같은 식물의 꽃이 피는 날짜를 달력에 표시하기",
          "여러 식물의 잎 가장자리 모양에 따라 분류하기",
          "서로 다른 식물의 씨 크기를 재어 순서대로 놓기",
          "식물의 줄기가 자란 길이를 날짜별로 기록하기"
        ]
      ],
      "explanation": [
        "소개할 식물의 어떤 부분을 보았는지, 그 생김새가 어떤 일에 도움이 되는지 설명해야 해요. 사진을 많이 모으는 것만으로는 구조와 기능을 설명한 것이 아니에요.",
        "연잎의 생김새를 빛을 받는 일과 연결한 첫째 주제가 알맞아요. 나머지는 꽃 피는 시기, 잎 모양, 씨 크기, 줄기의 길이를 정리하는 주제예요. 생김새와 하는 일을 서로 연결해 설명해야 해요."
      ],
      "criteria": [
        "「연잎의 생김새를 관찰하고 빛 받기와 연결해 설명하기」을 고른다. 어떤 구조가 어떤 역할과 관련되는지 관찰·조사 근거로 설명해야 해요. 사진 수나 예쁜 장식만으로 설명을 대신하지 않아요.",
        "연잎의 생김새와 빛을 받는 일을 연결해 설명하는 첫째 주제를 고른다."
      ]
    },
    "previousStatus": "authored-draft"
  },
  "c22-s61-u03-w124": {
    "unit": "c22-s61-u03",
    "prompt": "전체 식물 사진과 확대 그림이 따로 있어 친구가 어느 부분인지 헷갈려 해요. 두 그림과 그 부분이 하는 일의 설명을 어떻게 연결하면 좋을까요?",
    "sourceId": null,
    "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅲ. 식물의 구조와 기능",
      "originalExam": false
    },
    "fields": {
      "criteria": [
        "전체와 확대한 부분의 위치 연결 / 구조 이름과 기능 문장 연결 / 관찰/자료 근거와 출처 표시",
        "전체 사진에서 확대한 부분의 위치를 표시하고 두 그림을 연결해요. 확대 그림에 그 부분의 이름과 하는 일을 나타내는 방법을 설명해요."
      ],
      "responseContract": [
        {
          "kind": "written-explanation",
          "teacherRequired": true,
          "actualPerformanceMustNotBeInferred": true,
          "required": [
            "전체와 확대한 부분의 위치 연결",
            "구조 이름과 기능 문장 연결",
            "관찰/자료 근거와 출처 표시"
          ]
        },
        {
          "kind": "written-explanation",
          "teacherRequired": true,
          "actualPerformanceMustNotBeInferred": true,
          "required": [
            "전체 사진에서 확대한 부분의 위치를 표시하고 두 그림을 연결해요. 확대 그림에 그 부분의 이름과 하는 일을 나타내는 방법을 설명해요."
          ]
        }
      ]
    },
    "previousStatus": "authored-draft"
  },
  "c22-s61-u04-w020": {
    "unit": "c22-s61-u04",
    "prompt": "같은 밤 남쪽 별무리의 위치를 비교한 기록에서 가능한 해석을 고르세요. (2개 선택)",
    "sourceId": null,
    "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅳ. 지구의 운동",
      "originalExam": false
    },
    "fields": {
      "choices": [
        [
          "별자리 선이 별들을 실제 줄로 연결했다는 뜻이다.",
          "사진만 읽었어도 학생이 야외 관측을 한 것으로 기록한다.",
          "두 시각의 별 배열로 같은 별무리인지 확인할 수 있다.",
          "한 시간의 위치 변화로 지구 공전의 일 년 주기를 직접 측정했다.",
          "관측자의 방향도 바뀌었으면 위치 차이의 원인이 섞일 수 있다."
        ],
        [
          "별자리 선이 별들을 실제 줄로 연결했다는 뜻이다.",
          "별 사이의 배열이 비슷하므로 별무리 전체의 위치도 변하지 않았다고 한다.",
          "두 시각의 별 배열로 같은 별무리인지 확인할 수 있다.",
          "한 시간의 위치 변화로 지구 공전의 일 년 주기를 직접 측정했다.",
          "관측자의 방향도 바뀌었으면 위치 차이의 원인이 섞일 수 있다."
        ]
      ]
    },
    "previousStatus": "authored"
  },
  "c22-s61-u04-w098": {
    "unit": "c22-s61-u04",
    "prompt": "서울·남쪽·밤 9시로 설정한 두 계절 화면에서 별무리 위치가 다릅니다. 다음으로 할 설명으로 가장 적절한 것은 무엇인가요?",
    "sourceId": null,
    "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅳ. 지구의 운동",
      "originalExam": false
    },
    "fields": {
      "choices": [
        [
          "화면의 배경이 학교 운동장을 실제로 촬영한 사진이라고 한다.",
          "같은 별자리는 다른 계절의 어떤 시각에도 없다고 한다.",
          "두 화면을 열었으므로 네 계절 야외 관측을 모두 마쳤다고 한다.",
          "같은 조건에서 달라진 별무리의 위치를 지구의 공전과 연결해 설명한다.",
          "별 이름표의 개수만 세어 공전 속도를 계산했다고 한다."
        ],
        [
          "밤 9시가 같으니 별무리의 위치도 같아야 한다며 한 화면이 틀렸다고 한다.",
          "두 계절의 위치 차이를 지구가 하루에 한 바퀴 자전하는 것만으로 설명한다.",
          "계절마다 별들이 지구 주위를 실제로 돌기 때문에 위치가 바뀐다고 설명한다.",
          "같은 조건에서 달라진 별무리의 위치를 지구의 공전과 연결해 설명한다.",
          "두 화면의 시각을 서로 다르게 바꾼 뒤 위치가 비슷해지면 계절에 따른 차이는 없다고 한다."
        ]
      ]
    },
    "previousStatus": "authored"
  }
};
const cache=new WeakMap();
const clone=value=>JSON.parse(JSON.stringify(value));
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function grade6QuestionReview(rows,unit){
 if(!GRADE6_REVIEW_UNITS.includes(unit)||!Array.isArray(rows))return rows;
 let changed=false;
 const next=rows.map(q=>{
  const p=patches[q.id];
  if(!p||p.unit!==unit||q.status!=='authored'||q.sourceContent||(q.contentVersion??null)!==p.previousVersion||q.prompt!==p.prompt||!Object.keys(p.presentation).every(k=>same(q[k]??null,p.presentation[k]))||!same(q.sourceRef,p.sourceRef)||!same(q.taxonomy,p.taxonomy)||!same(q.responseContract,p.responseContract)||!same(q.answerContract,p.previousAnswerContract)||!same(q.choices??null,p.previousChoices))return q;
  changed=true;
  if(cache.has(q))return cache.get(q);
  const current={...q,...clone(p.fields),...(q.diagnosticOverride?.version===(q.contentVersion||1)?{diagnosticOverride:{...clone(q.diagnosticOverride),version:GRADE6_REVIEW_VERSION}}:{}),contentVersion:GRADE6_REVIEW_VERSION,previousVersions:[...(q.previousVersions?clone(q.previousVersions):[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};
  cache.set(q,current);return current;
 });
 return changed?next:rows;
}
export function withGrade6ReviewedWorkbook(workbook){
 if(!GRADE6_REVIEW_UNITS.includes(workbook?.unit)||!Array.isArray(workbook.questions))return workbook;
 let changed=false;
 const questions=workbook.questions.map(q=>{
  const p=workbookPatches[q.id];
  if(!p||p.unit!==workbook.unit||q.contentVersion!=null||q.sourceContent||(q.status??null)!==p.previousStatus||q.prompt!==p.prompt||!same(q.sourceId??null,p.sourceId)||!same(q.sourceRef??null,p.sourceRef)||!Object.entries(p.fields).every(([key,[previous]])=>same(q[key],previous)))return q;
  changed=true;return {...q,...Object.fromEntries(Object.entries(p.fields).map(([key,[,value]])=>[key,clone(value)]))};
 });
 return changed?{...workbook,questions}:workbook;
}
export function withGrade6QuestionReviewClassroom(unit,mod){
 if(!mod?.classroomItems)return mod;
 const classroomItems=grade6QuestionReview(mod.classroomItems,unit);
 return classroomItems===mod.classroomItems?mod:{...mod,classroomItems};
}
