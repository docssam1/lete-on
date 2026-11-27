export const GRADE5_REVIEW_VERSION='20261115-grade5-question-review';
export const GRADE5_REVIEW_UNITS=["c22-s51-u03", "c22-s51-u04", "c22-s52-u01", "c22-s52-u02", "c22-s52-u03", "c22-s52-u04"];
// Authored questions only; preserve prior presentations for saved attempts.
const patches={
  "c22-s51-u03-b004": {
    "unit": "c22-s51-u03",
    "previousVersion": "20261106-solution-readable-workbook",
    "prompt": "“문제의 표에서 따뜻한 물에 더 많이 녹았다.” 이 문장만으로 내가 실험했다고 할 수 있나요? 까닭을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 용해와 용액 창작 학습",
      "course": "초등 5-1"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E7",
      "type": "T13",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-03",
      "topic": "관찰과 자료",
      "concept": "생활 쓰임 조사·자료 제작·실제 공유",
      "inquirySkill": "생활 쓰임 조사·자료 제작·실제 공유"
    },
    "responseContract": "written-explanation",
    "previousAnswerContract": {
      "type": "written-explanation",
      "sample": "아니다. 표는 제공된 자료이고 내가 직접 한 관찰인지는 별도로 밝혀야 한다.",
      "rubric": {
        "required": [
          "제공 자료임을 구분 1, 직접 수행의 추가 근거 1."
        ],
        "pass": "교사 확인 · 동등 표현과 다른 타당한 해법 인정",
        "note": "학습용 기준이며 공식 배점표나 실제 수행 확인이 아니다."
      }
    },
    "previousChoices": null,
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": {
        "unit": "c22-s51-u03",
        "id": "solution-book-04",
        "no": 4
      }
    },
    "fields": {
      "answerContract": {
        "type": "written-explanation",
        "sample": "아니에요. 문제에 나온 표를 읽은 것만으로는 내가 직접 실험했다고 할 수 없어요.",
        "rubric": {
          "required": [
            "문제의 표를 읽는 것과 직접 실험하는 것은 다르다는 까닭을 설명하면 돼요."
          ],
          "pass": "교사 확인 · 동등 표현과 다른 타당한 해법 인정",
          "note": "학습용 기준이며 공식 배점표나 실제 수행 확인이 아니다."
        }
      }
    }
  },
  "c22-s51-u03-b042": {
    "unit": "c22-s51-u03",
    "previousVersion": "20261106-solution-readable-workbook",
    "prompt": "물을 묻힌 붓으로 수성 물감이 퍼지게 그림을 그렸습니다. 이 사례와 연결할 설명은?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 용해와 용액 창작 학습",
      "course": "초등 5-1"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E7",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-03",
      "topic": "용액의 쓰임",
      "concept": "생활 쓰임 조사·자료 제작·실제 공유",
      "inquirySkill": "생활 쓰임 조사·자료 제작·실제 공유"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "previousChoices": [
      "물감이 없어져 무게가 0이 된다.",
      "물에 녹는 성분을 이용해 색을 고르게 펼칠 수 있다.",
      "모든 물감은 어떤 액체에나 똑같이 녹는다.",
      "진한 물감이 언제나 안전하다.",
      "물에 퍼져 보이는 물감은 녹지 않는 성분까지 어떤 제품이나 모두 용액이다."
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": {
        "unit": "c22-s51-u03",
        "id": "solution-book-42",
        "no": 42
      }
    },
    "fields": {
      "prompt": "물에 잘 녹는 색소를 물에 녹여 그림을 그렸어요. 이 사례와 연결할 설명을 고르세요.",
      "choices": [
        "물감이 없어져 무게가 0이 된다.",
        "물에 녹는 성분을 이용해 색을 고르게 펼칠 수 있다.",
        "모든 물감은 어떤 액체에나 똑같이 녹는다.",
        "색소는 물에 녹으면 다른 물질로 바뀐다.",
        "물에 퍼져 보이는 물감은 녹지 않는 성분까지 어떤 제품이나 모두 용액이다."
      ],
      "explanation": "물에 녹는 색소를 이용하면 색을 고르게 펼쳐 그림을 그릴 수 있어요. 녹은 색소가 없어지거나 다른 물질로 바뀐 것은 아니에요. 모든 물감의 성분이 물에 녹는 것은 아니에요."
    }
  },
  "c22-s51-u04-b004": {
    "unit": "c22-s51-u04",
    "previousVersion": "20261106-body-readable-workbook",
    "prompt": "“표에서 운동 뒤 맥박 수가 늘었다.”는 답만으로 내가 직접 관찰했다고 할 수 있나요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 우리 몸 독립 창작 학습",
      "course": "초등 5-1"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E7",
      "type": "T14",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과04-03",
      "topic": "자료와 실제 관찰",
      "concept": "관찰 근거·자료 제작·실제 소통과 보완",
      "inquirySkill": "관찰 근거·자료 제작·실제 소통과 보완"
    },
    "responseContract": "written-explanation",
    "previousAnswerContract": {
      "type": "written-explanation",
      "sample": "없다. 제공된 표를 해석한 것과 내가 관찰한 것은 다르며 실제 날짜·방법·관찰값이 필요하다.",
      "rubric": {
        "required": [
          "자료/직접 수행 구별1, 실제 관찰 근거1."
        ],
        "pass": "교사 확인 · 동등 표현과 타당한 대안 인정",
        "note": "학습용 기준이며 실제 수행이나 학교 공식 성적을 확정하지 않는다."
      }
    },
    "previousChoices": null,
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": {
        "unit": "c22-s51-u04",
        "id": "body-book-04",
        "no": 4
      }
    },
    "fields": {
      "prompt": "“표에서 운동 뒤 맥박 수가 늘었다.”는 답만으로 내가 직접 관찰했다고 할 수 있나요? 까닭을 써 보세요.",
      "answerContract": {
        "type": "written-explanation",
        "sample": "아니에요. 주어진 표를 읽은 것과 내가 직접 맥박 수를 센 것은 달라요.",
        "rubric": {
          "required": [
            "주어진 표를 읽은 것과 직접 맥박 수를 센 것은 다르다는 까닭을 설명하면 돼요."
          ],
          "pass": "교사 확인 · 동등 표현과 타당한 대안 인정",
          "note": "학습용 기준이며 실제 수행이나 학교 공식 성적을 확정하지 않는다."
        }
      }
    }
  },
  "c22-s52-u01-b018": {
    "unit": "c22-s52-u01",
    "previousVersion": "20261106-mixture-readable-workbook",
    "prompt": "제공 자료: 비커 아래에 물, 위에 기름이 있습니다. 기름을 먼저 덜어 내는 알맞은 방법은?",
    "sourceRef": {
      "type": "authored-pair",
      "edition": "GFIELD 혼합물 독립 창작 교재",
      "course": "초등 5-2",
      "of": {
        "sourceId": "1UnZss7H2K_mLObS_lCSUD1yeQqNVVakl",
        "set": 5,
        "no": 2
      },
      "originalAuthoredType": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "area": "물질",
      "element": "E3",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과05-01",
      "topic": "층 관찰",
      "concept": "물과 기름의 층 분리",
      "inquirySkill": "조건을 적용한 판단"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "previousChoices": [
      "스포이트 끝을 아래 물에 두고 물만 먼저 기름통에 옮긴다.",
      "비커를 계속 세게 흔들며 두 층을 한꺼번에 옮긴다.",
      "마른 체에 부으면 물만 통과하고 기름은 모두 남는다.",
      "스포이트 끝을 위층 기름에 두고 조금씩 옮긴다.",
      "설탕을 넣으면 기름이 소금으로 바뀌어 저절로 남는다."
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": {
        "unit": "c22-s52-u01",
        "id": "mixture-book-18",
        "no": 18
      }
    },
    "fields": {
      "choices": [
        "스포이트 끝을 아래 물에 두고 물만 먼저 기름통에 옮긴다.",
        "비커를 계속 세게 흔들며 두 층을 한꺼번에 옮긴다.",
        "마른 체에 부으면 물만 통과하고 기름은 모두 남는다.",
        "스포이트 끝을 위층 기름에 두고 조금씩 옮긴다.",
        "스포이트 끝을 두 층의 경계 아래에 넣고 한 번에 많이 빨아들인다."
      ]
    }
  },
  "c22-s52-u01-b030": {
    "unit": "c22-s52-u01",
    "previousVersion": "20261106-mixture-readable-workbook",
    "prompt": "소금이 모두 녹은 모래 혼합물을 거른 뒤 아래에 맑은 액체가 모였습니다. 그 액체는?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 혼합물 독립 창작 교재",
      "course": "초등 5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "area": "물질",
      "element": "E5",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과05-02",
      "topic": "거른 물",
      "concept": "거름의 결과와 한계",
      "inquirySkill": "조건을 적용한 판단"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "previousChoices": [
      "소금이 녹아 있는 물",
      "소금이 전혀 없는 순수한 물",
      "모래만 액체로 변한 물질",
      "거름종이가 녹아 만든 기름",
      "맛을 보아야만 확인 가능한 물"
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": {
        "unit": "c22-s52-u01",
        "id": "mixture-book-30",
        "no": 30
      }
    },
    "fields": {
      "choices": [
        "소금이 녹아 있는 물",
        "소금이 전혀 없는 순수한 물",
        "모래가 녹아 있는 물",
        "녹지 않은 소금 알갱이가 떠 있는 물",
        "소금과 모래 알갱이가 모두 떠 있는 물"
      ]
    }
  },
  "c22-s52-u01-b069": {
    "unit": "c22-s52-u01",
    "previousVersion": "20261106-mixture-readable-workbook",
    "prompt": "물과 기름을 흔든 직후 경계가 불분명합니다. 다음 행동은?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 혼합물 독립 창작 교재",
      "course": "초등 5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u01",
      "area": "물질",
      "element": "E3",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과05-01",
      "topic": "액체 분리 판단",
      "concept": "물과 기름의 층 분리",
      "inquirySkill": "조건을 적용한 판단"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "previousChoices": [
      "경계가 없으니 두 물질 모두 사라졌다고 쓴다.",
      "충분히 두고 층이 나뉘는지 다시 관찰한다.",
      "맛을 보아 어느 쪽이 기름인지 구별한다.",
      "세게 계속 흔들며 완전 분리되었다고 쓴다.",
      "종이 색을 바꾸어 액체가 분리됐다고 쓴다."
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": {
        "unit": "c22-s52-u01",
        "id": "mixture-book-69",
        "no": 69
      }
    },
    "fields": {
      "choices": [
        "경계가 안 보이니 물과 기름이 완전히 녹아 하나의 용액이 되었다고 쓴다.",
        "충분히 두고 층이 나뉘는지 다시 관찰한다.",
        "맛을 보아 어느 쪽이 기름인지 구별한다.",
        "더 세게 흔들면 층이 빨리 나뉠 것이라 생각하고 계속 흔든다.",
        "기름을 거름종이로 걸러 내고 물만 받는다."
      ]
    }
  },
  "c22-s52-u02-b064": {
    "unit": "c22-s52-u02",
    "previousVersion": "20261115-reviewed-answer-criteria",
    "prompt": "단열을 이용한 생활 사례 하나를 조사할 때 사진 외에 무엇을 확인하고 기록할지 네 가지 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
      "course": "초등 5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E7",
      "type": "T07",
      "format": "서술형",
      "level": "심화",
      "track": "교과",
      "standard": "6과07-04",
      "topic": "공공 자료 조사",
      "concept": "단열과 보온/보냉",
      "inquirySkill": "자료 해석·근거의 범위"
    },
    "responseContract": "written-explanation",
    "previousAnswerContract": {
      "type": "written-explanation",
      "sample": "사용 목적, 구조·재료와 줄이려는 열 이동, 실제 자료의 근거/출처, 사용 조건과 한계, 확인 날짜를 기록한다.",
      "rubric": {
        "required": [
          "목적·구조/재료·줄이려는 경로·출처 근거·사용 조건/한계·확인 날짜 중 타당한4가지를 쓴다."
        ],
        "pass": "교사 확인 · 동등 표현과 타당한 대안 인정",
        "note": "학습용 기준. 실제 수행·공식 성적은 별도 확인."
      }
    },
    "previousChoices": null,
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": {
        "unit": "c22-s52-u02",
        "id": "c22-s52-u02-w064",
        "no": 64
      }
    },
    "fields": {
      "answerContract": {
        "type": "written-explanation",
        "sample": "어디에 쓰는지, 어떤 재료를 쓰는지, 어떤 열의 이동을 줄이는지, 어느 자료에서 알아보았는지 적어요.",
        "rubric": {
          "required": [
            "목적·구조/재료·줄이려는 경로·출처 근거·사용 조건/한계·확인 날짜 중 타당한4가지를 쓴다."
          ],
          "pass": "교사 확인 · 동등 표현과 타당한 대안 인정",
          "note": "학습용 기준. 실제 수행·공식 성적은 별도 확인."
        }
      }
    }
  },
  "c22-s52-u02-b077": {
    "unit": "c22-s52-u02",
    "previousVersion": null,
    "prompt": "같은 방의 두 물체를 만졌을 때 느낌이 달랐습니다. 온도 차이를 알아볼 다음 행동으로 가장 알맞은 것은?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
      "course": "초등 5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과07-01",
      "topic": "평가 · 측정",
      "concept": "온도와 온도계",
      "inquirySkill": "조건을 적용한 판단"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "previousChoices": [
      "더 차갑게 느껴지는 것을 바로 0℃라 적는다.",
      "짙은 색 물체가 더 뜨겁다고 결론을 쓴다.",
      "더 큰 물체의 온도를 두 배로 계산한다.",
      "온도계로 같은 조건에서 각각 재어 본다.",
      "손의 느낌을 ℃ 숫자로 임의 변환한다."
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": {
        "unit": "c22-s52-u02",
        "id": "c22-s52-u02-w077",
        "no": 77
      }
    },
    "fields": {
      "choices": [
        "차갑게 느껴지는 물체의 온도가 더 낮다고 바로 판단한다.",
        "온도계 대신 손등을 대어 온도를 비교한다.",
        "같은 방에 있었으니 재지 않고 온도가 같다고 정한다.",
        "온도계로 같은 조건에서 각각 재어 본다.",
        "오래 만져 느낌이 비슷해지면 두 물체의 온도가 같다고 정한다."
      ]
    }
  },
  "c22-s52-u03-b067": {
    "unit": "c22-s52-u03",
    "previousVersion": "20261106-weather-readable-workbook",
    "prompt": "우리 학교의 내일 야외 활동을 안내하려고 다른 지역의 내일 강수 예보를 가져왔어요. 이 자료를 그대로 쓰기 어려운 까닭과 더 확인할 자료를 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T19",
      "format": "서술형",
      "level": "심화",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "지역에 맞는 날씨 자료",
      "concept": "기상 자료 해석과 생활 적용",
      "inquirySkill": "관측과 예보·활동 제안 구별"
    },
    "responseContract": "written-explanation",
    "previousAnswerContract": {
      "type": "written-explanation",
      "sample": "지역이 다르면 같은 시각에도 날씨가 다를 수 있다. 우리 학교가 있는 지역과 활동할 시각에 맞는 최신 예보를 확인하고 주변 관측 자료도 살펴 설명을 고친다.",
      "rubric": {
        "required": [
          "지역이 다르다는 한계를 밝히고 학교 지역·활동 시각에 맞는 예보와 관측 자료를 확인하도록 제안한다."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
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
        "unit": "c22-s52-u03",
        "id": "c22-s52-u03-w067",
        "no": 67
      }
    },
    "fields": {
      "answerContract": {
        "type": "written-explanation",
        "sample": "지역이 다르면 같은 시각에도 날씨가 다를 수 있다. 우리 학교가 있는 지역과 활동할 시각에 맞는 최신 예보를 확인하고 주변 관측 자료도 살펴 설명을 고친다.",
        "rubric": {
          "required": [
            "지역이 다르면 날씨도 다를 수 있다는 까닭과, 학교 지역·활동 시각에 맞는 최신 예보를 확인할 계획을 쓰면 돼요. 주변 관측 자료를 더 살펴보자는 제안도 인정해요."
          ],
          "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
          "note": "실제 수행/공식 성적은 별도 확인"
        },
        "reviewRequired": true
      }
    }
  },
  "c22-s52-u03-b075": {
    "unit": "c22-s52-u03",
    "previousVersion": "20261115-reviewed-answer-criteria",
    "prompt": "모래/물의 온도는 쟀지만 공기 흐름은 보지 못했어요. 처음 기록과 결론, 다음 계획을 어떻게 쓰나요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T18",
      "format": "서술형",
      "level": "심화",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "해륙풍 모형 보완",
      "concept": "해륙풍 모형과 실제 흐름",
      "inquirySkill": "근거·한계 설명/실제 소통"
    },
    "responseContract": "written-explanation",
    "previousAnswerContract": {
      "type": "written-explanation",
      "sample": "온도를 잰 시각과 값은 그대로 남기고 공기 흐름은 보지 못했다고 적는다. 바람이 생긴 것을 직접 확인했다고 쓰지 않으며, 선생님과 흐름을 관찰할 방법을 정해 다시 살펴본다.",
      "rubric": {
        "required": [
          "온도 원자료와 흐름 미관찰을 각각 보존하고 바람 확인으로 바꾸지 않으며 교사와 안전한 기압/기류 확인 계획을 쓴다."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "previousChoices": null,
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": {
        "unit": "c22-s52-u03",
        "id": "c22-s52-u03-w075",
        "no": 75
      }
    },
    "fields": {
      "answerContract": {
        "type": "written-explanation",
        "sample": "이번에 잰 온도와 시각은 그대로 적고, 공기 흐름은 보지 못했다고 써요. 바람이 생겼다고 결론 내리지는 않아요. 다음에는 공기 흐름이 보이는 모형실험 영상을 찾아 흐름의 방향을 살펴볼 거예요. 영상에서 본 내용은 내가 한 실험과 나누어 적겠어요.",
        "rubric": {
          "required": [
            "잰 온도와 공기 흐름을 보지 못했다는 사실을 구별해 적고, 아직 바람을 직접 확인한 것은 아니라는 결론을 써요. 다음에 흐름을 더 관찰하거나 모형실험 자료를 살펴볼 계획을 제시해요. 자료를 참고했다면 내가 한 실험과 구별해요."
          ],
          "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
          "note": "실제 수행/공식 성적은 별도 확인"
        }
      }
    }
  },
  "c22-s52-u03-b078": {
    "unit": "c22-s52-u03",
    "previousVersion": "20261106-weather-readable-workbook",
    "prompt": "오전 09시 기온만 보고 오후 운동장 활동을 정하려고 해요. 어떤 날씨 자료를 더 확인하고 그 까닭을 설명해야 할까요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T19",
      "format": "서술형",
      "level": "심화",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "생활에 필요한 기상 요소",
      "concept": "기상 자료 해석과 생활 적용",
      "inquirySkill": "관측과 예보·활동 제안 구별"
    },
    "responseContract": "written-explanation",
    "previousAnswerContract": {
      "type": "written-explanation",
      "sample": "그 지역 오후 활동 시각의 기온·바람·강수 등 예보와 최신 관측을 확인한다. 날씨는 시간에 따라 변하며 기온뿐 아니라 바람과 비 등도 야외 활동에 영향을 주기 때문이다.",
      "rubric": {
        "required": [
          "대상 지역과 오후 활동 시각에 맞는 두 가지 이상의 기상 요소를 제시하고 활동에 주는 영향을 설명한다."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
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
        "unit": "c22-s52-u03",
        "id": "c22-s52-u03-w078",
        "no": 78
      }
    },
    "fields": {
      "answerContract": {
        "type": "written-explanation",
        "sample": "그 지역 오후 활동 시각의 기온·바람·강수 등 예보와 최신 관측을 확인한다. 날씨는 시간에 따라 변하며 기온뿐 아니라 바람과 비 등도 야외 활동에 영향을 주기 때문이다.",
        "rubric": {
          "required": [
            "활동할 지역과 오후 시각에 맞는 날씨 자료를 더 확인하고, 그 자료가 활동을 정하는 데 필요한 까닭을 설명하면 돼요."
          ],
          "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
          "note": "실제 수행/공식 성적은 별도 확인"
        },
        "reviewRequired": true
      }
    }
  },
  "c22-s52-u04-b095": {
    "unit": "c22-s52-u04",
    "previousVersion": "20261106-energy-readable-workbook",
    "prompt": "같은 밝기·시간의 가상 자료에서 A36Wh, B24Wh일 때 알맞은 설명은?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u04",
      "area": "과학과 사회",
      "element": "E6",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과08-03",
      "topic": "효율 평가",
      "concept": "같은 효과의 에너지 이용·자료 비교",
      "inquirySkill": "조건 적용"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "previousChoices": [
      "A가12Wh 적게 사용했다.",
      "B가12W 적게 사용했다.",
      "둘의 전기요금은0원이다.",
      "모든 조명이24Wh만 쓴다.",
      "B가12Wh 적게 사용했다."
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": {
        "unit": "c22-s52-u04",
        "id": "c22-s52-u04-w095",
        "no": 95
      }
    },
    "fields": {
      "choices": [
        "A가12Wh 적게 사용했다.",
        "B가12W 적게 사용했다.",
        "B가60Wh 적게 사용했다.",
        "B가24Wh 적게 사용했다.",
        "B가12Wh 적게 사용했다."
      ]
    }
  }
};
const workbookPatches={
  "solution-book-04": {
    "unit": "c22-s51-u03",
    "prompt": "“문제의 표에서 따뜻한 물에 더 많이 녹았다.” 이 문장만으로 내가 실험했다고 할 수 있나요? 까닭을 쓰세요.",
    "sourceId": null,
    "sourceRef": null,
    "fields": {
      "answer": [
        "아니다. 표는 제공된 자료이고 내가 직접 한 관찰인지는 별도로 밝혀야 한다.",
        "아니에요. 문제에 나온 표를 읽은 것만으로는 내가 직접 실험했다고 할 수 없어요."
      ],
      "criteria": [
        "제공 자료임을 구분 1, 직접 수행의 추가 근거 1.",
        "문제의 표를 읽는 것과 직접 실험하는 것은 다르다는 까닭을 설명하면 돼요."
      ]
    }
  },
  "solution-book-42": {
    "unit": "c22-s51-u03",
    "prompt": "물을 묻힌 붓으로 수성 물감이 퍼지게 그림을 그렸습니다. 이 사례와 연결할 설명은?",
    "sourceId": null,
    "sourceRef": null,
    "fields": {
      "prompt": [
        "물을 묻힌 붓으로 수성 물감이 퍼지게 그림을 그렸습니다. 이 사례와 연결할 설명은?",
        "물에 잘 녹는 색소를 물에 녹여 그림을 그렸어요. 이 사례와 연결할 설명을 고르세요."
      ],
      "choices": [
        [
          "물감이 없어져 무게가 0이 된다.",
          "물에 녹는 성분을 이용해 색을 고르게 펼칠 수 있다.",
          "모든 물감은 어떤 액체에나 똑같이 녹는다.",
          "진한 물감이 언제나 안전하다."
        ],
        [
          "물감이 없어져 무게가 0이 된다.",
          "물에 녹는 성분을 이용해 색을 고르게 펼칠 수 있다.",
          "모든 물감은 어떤 액체에나 똑같이 녹는다.",
          "색소는 물에 녹으면 다른 물질로 바뀐다."
        ]
      ],
      "explanation": [
        "색 재료에 물에 녹는 성분이 있다면 그 성분은 물과 골고루 섞일 수 있어요. 다만 제품에 따라 녹지 않은 색 알갱이도 함께 있으므로, 물감의 모든 성분이 용액이라고 말하지는 않아요.",
        "물에 녹는 색소를 이용하면 색을 고르게 펼쳐 그림을 그릴 수 있어요. 녹은 색소가 없어지거나 다른 물질로 바뀐 것은 아니에요. 모든 물감의 성분이 물에 녹는 것은 아니에요."
      ]
    }
  },
  "body-book-04": {
    "unit": "c22-s51-u04",
    "prompt": "“표에서 운동 뒤 맥박 수가 늘었다.”는 답만으로 내가 직접 관찰했다고 할 수 있나요?",
    "sourceId": null,
    "sourceRef": null,
    "fields": {
      "prompt": [
        "“표에서 운동 뒤 맥박 수가 늘었다.”는 답만으로 내가 직접 관찰했다고 할 수 있나요?",
        "“표에서 운동 뒤 맥박 수가 늘었다.”는 답만으로 내가 직접 관찰했다고 할 수 있나요? 까닭을 써 보세요."
      ],
      "answer": [
        "없다. 제공된 표를 해석한 것과 내가 관찰한 것은 다르며 실제 날짜·방법·관찰값이 필요하다.",
        "아니에요. 주어진 표를 읽은 것과 내가 직접 맥박 수를 센 것은 달라요."
      ],
      "criteria": [
        "자료/직접 수행 구별1, 실제 관찰 근거1.",
        "주어진 표를 읽은 것과 직접 맥박 수를 센 것은 다르다는 까닭을 설명하면 돼요."
      ]
    }
  },
  "mixture-book-18": {
    "unit": "c22-s52-u01",
    "prompt": "제공 자료: 비커 아래에 물, 위에 기름이 있습니다. 기름을 먼저 덜어 내는 알맞은 방법은?",
    "sourceId": null,
    "sourceRef": null,
    "fields": {
      "choices": [
        [
          "스포이트 끝을 아래 물에 두고 물만 먼저 기름통에 옮긴다.",
          "비커를 계속 세게 흔들며 두 층을 한꺼번에 옮긴다.",
          "마른 체에 부으면 물만 통과하고 기름은 모두 남는다.",
          "스포이트 끝을 위층 기름에 두고 조금씩 옮긴다.",
          "설탕을 넣으면 기름이 소금으로 바뀌어 저절로 남는다."
        ],
        [
          "스포이트 끝을 아래 물에 두고 물만 먼저 기름통에 옮긴다.",
          "비커를 계속 세게 흔들며 두 층을 한꺼번에 옮긴다.",
          "마른 체에 부으면 물만 통과하고 기름은 모두 남는다.",
          "스포이트 끝을 위층 기름에 두고 조금씩 옮긴다.",
          "스포이트 끝을 두 층의 경계 아래에 넣고 한 번에 많이 빨아들인다."
        ]
      ]
    }
  },
  "mixture-book-30": {
    "unit": "c22-s52-u01",
    "prompt": "소금이 모두 녹은 모래 혼합물을 거른 뒤 아래에 맑은 액체가 모였습니다. 그 액체는?",
    "sourceId": null,
    "sourceRef": null,
    "fields": {
      "choices": [
        [
          "소금이 녹아 있는 물",
          "소금이 전혀 없는 순수한 물",
          "모래만 액체로 변한 물질",
          "거름종이가 녹아 만든 기름",
          "맛을 보아야만 확인 가능한 물"
        ],
        [
          "소금이 녹아 있는 물",
          "소금이 전혀 없는 순수한 물",
          "모래가 녹아 있는 물",
          "녹지 않은 소금 알갱이가 떠 있는 물",
          "소금과 모래 알갱이가 모두 떠 있는 물"
        ]
      ]
    }
  },
  "mixture-book-69": {
    "unit": "c22-s52-u01",
    "prompt": "물과 기름을 흔든 직후 경계가 불분명합니다. 다음 행동은?",
    "sourceId": null,
    "sourceRef": null,
    "fields": {
      "choices": [
        [
          "경계가 없으니 두 물질 모두 사라졌다고 쓴다.",
          "충분히 두고 층이 나뉘는지 다시 관찰한다.",
          "맛을 보아 어느 쪽이 기름인지 구별한다.",
          "세게 계속 흔들며 완전 분리되었다고 쓴다.",
          "종이 색을 바꾸어 액체가 분리됐다고 쓴다."
        ],
        [
          "경계가 안 보이니 물과 기름이 완전히 녹아 하나의 용액이 되었다고 쓴다.",
          "충분히 두고 층이 나뉘는지 다시 관찰한다.",
          "맛을 보아 어느 쪽이 기름인지 구별한다.",
          "더 세게 흔들면 층이 빨리 나뉠 것이라 생각하고 계속 흔든다.",
          "기름을 거름종이로 걸러 내고 물만 받는다."
        ]
      ]
    }
  },
  "c22-s52-u02-w064": {
    "unit": "c22-s52-u02",
    "prompt": "단열을 이용한 생활 사례 하나를 조사할 때 사진 외에 무엇을 확인하고 기록할지 네 가지 쓰세요.",
    "sourceId": null,
    "sourceRef": null,
    "fields": {
      "answer": [
        "사용 목적, 구조·재료와 줄이려는 열 이동, 실제 자료의 근거/출처, 사용 조건과 한계, 확인 날짜를 기록한다.",
        "어디에 쓰는지, 어떤 재료를 쓰는지, 어떤 열의 이동을 줄이는지, 어느 자료에서 알아보았는지 적어요."
      ]
    }
  },
  "c22-s52-u02-w077": {
    "unit": "c22-s52-u02",
    "prompt": "같은 방의 두 물체를 만졌을 때 느낌이 달랐습니다. 온도 차이를 알아볼 다음 행동으로 가장 알맞은 것은?",
    "sourceId": null,
    "sourceRef": null,
    "fields": {
      "choices": [
        [
          "더 차갑게 느껴지는 것을 바로 0℃라 적는다.",
          "짙은 색 물체가 더 뜨겁다고 결론을 쓴다.",
          "더 큰 물체의 온도를 두 배로 계산한다.",
          "온도계로 같은 조건에서 각각 재어 본다.",
          "손의 느낌을 ℃ 숫자로 임의 변환한다."
        ],
        [
          "차갑게 느껴지는 물체의 온도가 더 낮다고 바로 판단한다.",
          "온도계 대신 손등을 대어 온도를 비교한다.",
          "같은 방에 있었으니 재지 않고 온도가 같다고 정한다.",
          "온도계로 같은 조건에서 각각 재어 본다.",
          "오래 만져 느낌이 비슷해지면 두 물체의 온도가 같다고 정한다."
        ]
      ]
    }
  },
  "c22-s52-u03-w067": {
    "unit": "c22-s52-u03",
    "prompt": "우리 학교의 내일 야외 활동을 안내하려고 다른 지역의 내일 강수 예보를 가져왔어요. 이 자료를 그대로 쓰기 어려운 까닭과 더 확인할 자료를 쓰세요.",
    "sourceId": null,
    "sourceRef": null,
    "fields": {
      "criteria": [
        "지역이 다르다는 한계를 밝히고 학교 지역·활동 시각에 맞는 예보와 관측 자료를 확인하도록 제안한다.",
        "지역이 다르면 날씨도 다를 수 있다는 까닭과, 학교 지역·활동 시각에 맞는 최신 예보를 확인할 계획을 쓰면 돼요. 주변 관측 자료를 더 살펴보자는 제안도 인정해요."
      ]
    }
  },
  "c22-s52-u03-w075": {
    "unit": "c22-s52-u03",
    "prompt": "모래/물의 온도는 쟀지만 공기 흐름은 보지 못했어요. 처음 기록과 결론, 다음 계획을 어떻게 쓰나요?",
    "sourceId": null,
    "sourceRef": null,
    "fields": {
      "answer": [
        "온도를 잰 시각과 값은 그대로 남기고 공기 흐름은 보지 못했다고 적는다. 바람이 생긴 것을 직접 확인했다고 쓰지 않으며, 선생님과 흐름을 관찰할 방법을 정해 다시 살펴본다.",
        "이번에 잰 온도와 시각은 그대로 적고, 공기 흐름은 보지 못했다고 써요. 바람이 생겼다고 결론 내리지는 않아요. 다음에는 공기 흐름이 보이는 모형실험 영상을 찾아 흐름의 방향을 살펴볼 거예요. 영상에서 본 내용은 내가 한 실험과 나누어 적겠어요."
      ],
      "criteria": [
        "온도 원자료와 흐름 미관찰을 각각 보존하고 바람 확인으로 바꾸지 않으며 교사와 안전한 기압/기류 확인 계획을 쓴다.",
        "잰 온도와 공기 흐름을 보지 못했다는 사실을 구별해 적고, 아직 바람을 직접 확인한 것은 아니라는 결론을 써요. 다음에 흐름을 더 관찰하거나 모형실험 자료를 살펴볼 계획을 제시해요. 자료를 참고했다면 내가 한 실험과 구별해요."
      ]
    }
  },
  "c22-s52-u03-w078": {
    "unit": "c22-s52-u03",
    "prompt": "오전 09시 기온만 보고 오후 운동장 활동을 정하려고 해요. 어떤 날씨 자료를 더 확인하고 그 까닭을 설명해야 할까요?",
    "sourceId": null,
    "sourceRef": null,
    "fields": {
      "criteria": [
        "대상 지역과 오후 활동 시각에 맞는 두 가지 이상의 기상 요소를 제시하고 활동에 주는 영향을 설명한다.",
        "활동할 지역과 오후 시각에 맞는 날씨 자료를 더 확인하고, 그 자료가 활동을 정하는 데 필요한 까닭을 설명하면 돼요."
      ]
    }
  },
  "c22-s52-u04-w095": {
    "unit": "c22-s52-u04",
    "prompt": "같은 밝기·시간의 가상 자료에서 A36Wh, B24Wh일 때 알맞은 설명은?",
    "sourceId": null,
    "sourceRef": null,
    "fields": {
      "choices": [
        [
          "A가12Wh 적게 사용했다.",
          "B가12W 적게 사용했다.",
          "둘의 전기요금은0원이다.",
          "모든 조명이24Wh만 쓴다.",
          "B가12Wh 적게 사용했다."
        ],
        [
          "A가12Wh 적게 사용했다.",
          "B가12W 적게 사용했다.",
          "B가60Wh 적게 사용했다.",
          "B가24Wh 적게 사용했다.",
          "B가12Wh 적게 사용했다."
        ]
      ]
    }
  }
};
const cache=new WeakMap();
const clone=value=>JSON.parse(JSON.stringify(value));
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function grade5QuestionReview(rows,unit){
 if(!GRADE5_REVIEW_UNITS.includes(unit)||!Array.isArray(rows))return rows;
 let changed=false;
 const next=rows.map(q=>{
  const p=patches[q.id];
  if(!p||p.unit!==unit||q.status!=='authored'||q.sourceContent||(q.contentVersion??null)!==p.previousVersion||q.prompt!==p.prompt||!Object.keys(p.presentation).every(k=>same(q[k]??null,p.presentation[k]))||!same(q.sourceRef,p.sourceRef)||!same(q.taxonomy,p.taxonomy)||q.responseContract!==p.responseContract||!same(q.answerContract,p.previousAnswerContract)||!same(q.choices??null,p.previousChoices))return q;
  changed=true;
  if(cache.has(q))return cache.get(q);
  const current={...q,...clone(p.fields),...(q.diagnosticOverride?.version===(q.contentVersion||1)?{diagnosticOverride:{...clone(q.diagnosticOverride),version:GRADE5_REVIEW_VERSION}}:{}),contentVersion:GRADE5_REVIEW_VERSION,previousVersions:[...(q.previousVersions?clone(q.previousVersions):[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};
  cache.set(q,current);return current;
 });
 return changed?next:rows;
}
export function withGrade5ReviewedWorkbook(workbook){
 if(!GRADE5_REVIEW_UNITS.includes(workbook?.unit)||!Array.isArray(workbook.questions))return workbook;
 let changed=false;
 const questions=workbook.questions.map(q=>{
  const p=workbookPatches[q.id];
  if(!p||p.unit!==workbook.unit||q.contentVersion!=null||q.sourceContent||(q.status!=null&&q.status!=='authored')||q.prompt!==p.prompt||!same(q.sourceId??null,p.sourceId)||!same(q.sourceRef??null,p.sourceRef)||!Object.entries(p.fields).every(([key,[previous]])=>same(q[key],previous)))return q;
  changed=true;return {...q,...Object.fromEntries(Object.entries(p.fields).map(([key,[,value]])=>[key,clone(value)]))};
 });
 return changed?{...workbook,questions}:workbook;
}
export function withGrade5QuestionReviewClassroom(unit,mod){
 if(!mod?.classroomItems)return mod;
 const classroomItems=grade5QuestionReview(mod.classroomItems,unit);
 return classroomItems===mod.classroomItems?mod:{...mod,classroomItems};
}
