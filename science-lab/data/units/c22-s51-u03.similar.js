export const similar = [
  {
    "id": "c22-s51-u03-p1-01",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 1,
        "page": 1,
        "originalSet": 1,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "용해·용질·용매·용액의 구별",
      "concept": "용해·용질·용매·용액의 구별",
      "inquirySkill": "용해·용질·용매·용액의 구별"
    },
    "prompt": "실험 병의 이름표에 “소금 + 물 → 소금물”이라고 적었습니다. 녹아 들어간 물질과 녹인 물질을 이 순서대로 쓰세요.",
    "givens": {
      "응답 순서": "용질 / 용매"
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "소금, 물",
      "accepted": [
        "소금, 물",
        "용질 소금 용매 물",
        "소금 / 물"
      ]
    },
    "explanation": "소금은 물에 녹아 들어간 용질, 물은 소금을 녹인 용매다. 만들어진 소금물 전체는 용액이다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "1-1",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p1-02",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 2,
        "page": 1,
        "originalSet": 1,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "용액의 관찰 특징과 분류",
      "concept": "용액의 관찰 특징과 분류",
      "inquirySkill": "용액의 관찰 특징과 분류"
    },
    "prompt": "친구가 다섯 병을 고르게 저은 뒤 상태를 기록했습니다. 전체가 한 가지 용액인 상태로 보기 어려운 것은?",
    "givens": null,
    "choices": [
      "모래가 바닥에 남아 윗물과 구분되는 병",
      "물에 소금이 모두 녹고 맑게 보이는 병",
      "갈색 성분이 고르게 녹아 맑게 비치는 병",
      "흰 설탕이 다 녹아 맑게 보이는 병",
      "용질과 물이 고르게 섞여 부분마다 같은 병"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "바닥에 고체가 남아 윗물과 구분되므로 전체가 고른 한 용액이 아니다. 색이 있는 것 자체는 용액을 배제하는 조건이 아니다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "1-2",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p1-03",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 3,
        "page": 1,
        "originalSet": 1,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "같은 물건 전체의 용해 전후 질량",
      "concept": "같은 물건 전체의 용해 전후 질량",
      "inquirySkill": "같은 물건 전체의 용해 전후 질량"
    },
    "prompt": "소금을 녹이기 전후 같은 물건 전체의 질량을 비교하려 합니다. 절차를 기호로 배열하세요.",
    "givens": {
      "보기": [
        "ㄱ 같은 컵·소금물·빈 약포지의 질량을 잰다.",
        "ㄴ 물·컵·소금·약포지를 함께 잰다.",
        "ㄷ 두 저울값과 손실 여부를 비교한다.",
        "ㄹ 약포지의 소금을 물로 옮겨 모두 녹인다."
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ → ㄹ → ㄱ → ㄷ",
      "accepted": [
        "ㄴ → ㄹ → ㄱ → ㄷ",
        "ㄴ ㄹ ㄱ ㄷ"
      ]
    },
    "explanation": "처음 전체를 재고 소금만 물로 옮겨 녹인 뒤 같은 물건 전체를 재어 두 값을 비교한다. 빈 약포지도 포함한다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "1-3",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p1-04",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 4,
        "page": 1,
        "originalSet": 1,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "용질 종류에 따른 녹을 수 있는 양",
      "concept": "용질 종류에 따른 녹을 수 있는 양",
      "inquirySkill": "용질 종류에 따른 녹을 수 있는 양"
    },
    "prompt": "연습 자료에서 같은 물 60 mL·20 ℃에 가루 P/Q/R을 정한 질량씩 넣었습니다. 표로 뒷받침되는 설명을 모두 고르세요.",
    "givens": {
      "표": {
        "머리": [
          "가루",
          "4 g",
          "8 g"
        ],
        "행": [
          [
            "P",
            "모두 녹음",
            "모두 녹음"
          ],
          [
            "Q",
            "모두 녹음",
            "일부 남음"
          ],
          [
            "R",
            "일부 남음",
            "일부 남음"
          ]
        ]
      }
    },
    "choices": [
      "P는 적어도 8 g 녹을 수 있다.",
      "Q는 4 g도 전혀 녹지 않는다.",
      "R은 넣는 양에 관계없이 모두 녹는다.",
      "이 조건에서 용질 종류에 따른 차이가 있다.",
      "세 용질의 최대량은 정확히 8 g이다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    },
    "explanation": "P는 8 g 모두, Q는 4 g 모두/8 g 일부 남음, R은 4 g 일부 남음이다. P의 하한과 종류별 차이는 알지만 정확한 최대량은 정할 수 없다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "1-4",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p1-05",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 5,
        "page": 1,
        "originalSet": 1,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E4",
      "type": "T07",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "물 온도에 따른 녹을 수 있는 양",
      "concept": "물 온도에 따른 녹을 수 있는 양",
      "inquirySkill": "물 온도에 따른 녹을 수 있는 양"
    },
    "prompt": "연습 관찰: 같은 물 50 mL에서 남아 있던 설탕이, 물을 더 넣지 않고 온도를 20 ℃에서 40 ℃로 올리자 모두 녹았습니다. 이 자료가 뒷받침하는 결론과 한계를 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "이 온도 범위에서 설탕이 더 녹을 수 있게 되었다. 모든 물질이나 무한한 양에 같은 결론을 적용할 수는 없다.",
      "rubric": {
        "required": [
          "같은 물 양·설탕",
          "온도 상승 뒤 더 녹음",
          "재료/범위의 한계"
        ],
        "pass": "교사 확인 · 동등 표현과 다른 타당한 해법 인정",
        "note": "학습용 기준이며 공식 배점표나 실제 수행 확인이 아니다."
      }
    },
    "explanation": "물 양과 용질을 유지하고 온도만 높인 뒤 잔류가 없어졌다. 해당 재료·범위에서 용해량 증가의 근거가 되며 빠르기만 잰 결과와도 구별된다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "1-5",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p1-06",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 6,
        "page": 1,
        "originalSet": 1,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "냉각 뒤 나타난 고체와 조건",
      "concept": "냉각 뒤 나타난 고체와 조건",
      "inquirySkill": "냉각 뒤 나타난 고체와 조건"
    },
    "prompt": "연습 자료: 따뜻할 때 모두 녹은 백반 용액을 식히니 흰 고체가 실제로 생겼습니다. 이 관찰에 맞는 설명은?",
    "givens": null,
    "choices": [
      "물이 전부 얼어 백반이라는 이름이 붙었다.",
      "녹아 있던 백반 일부가 고체로 나왔다.",
      "빈 컵에서 새로운 물질이 저절로 생겨났다.",
      "온도가 낮아져 백반이 더 많이 녹았다.",
      "관찰 전후 백반의 존재가 완전히 끊어졌다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "백반이 실제로 고체로 나온 관찰을 주었다. 냉각 뒤 녹을 수 있는 양이 줄어 일부가 나온 것으로 설명하며, 따뜻한 용액이면 무엇이든 반드시 결정이 생긴다고 일반화하지 않는다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "1-6",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p1-07",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 7,
        "page": 2,
        "originalSet": 1,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E4",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "물 온도에 따른 녹을 수 있는 양",
      "concept": "물 온도에 따른 녹을 수 있는 양",
      "inquirySkill": "물 온도에 따른 녹을 수 있는 양"
    },
    "prompt": "같은 양의 물과 백반을 사용했습니다. 한 컵에는 고체가 남고 다른 컵에는 모두 녹았습니다. 제시한 두 온도가 15 ℃/45 ℃일 때, 모두 녹은 컵과 고체가 남은 컵의 온도를 순서대로 쓰세요.",
    "givens": {
      "조건": "충분히 젓고 온도 외 조건은 같게 한 백반의 연습 관찰."
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "45 ℃, 15 ℃",
      "accepted": [
        "45 ℃, 15 ℃",
        "45도 15도",
        "45 15"
      ]
    },
    "explanation": "다른 조건이 같고 두 상태 차이가 나타난 이 비교에서 더 많이 녹일 수 있는 높은 온도 쪽이 모두 녹은 컵이다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "1-7",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p1-08",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 8,
        "page": 2,
        "originalSet": 1,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E3",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "물 양에 따른 녹을 수 있는 양",
      "concept": "물 양에 따른 녹을 수 있는 양",
      "inquirySkill": "물 양에 따른 녹을 수 있는 양"
    },
    "prompt": "네 조건 중 백반이 녹을 수 있는 양이 가장 작은 조건의 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ 물 70 mL·35 ℃",
        "ㄴ 물 100 mL·35 ℃",
        "ㄷ 물 35 mL·15 ℃",
        "ㄹ 물 70 mL·15 ℃"
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ"
      ]
    },
    "explanation": "ㄷ은 물의 양이 가장 적은 조건 중 온도도 가장 낮다. 이 백반의 비교 범위에서 양과 온도가 모두 더 크지 않은 조건이다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "1-8",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p1-09",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 9,
        "page": 2,
        "originalSet": 1,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E6",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-02",
      "topic": "같은 물체의 뜨는 정도 비교",
      "concept": "같은 물체의 뜨는 정도 비교",
      "inquirySkill": "같은 물체의 뜨는 정도 비교"
    },
    "prompt": "흰 설탕물 A/B를 맛보지 않고 비교합니다. 비교 근거로 쓸 수 있는 것을 모두 고르세요.",
    "givens": null,
    "choices": [
      "같은 물 양에 모두 녹인 설탕의 질량 차이",
      "용기의 손잡이 색깔 차이",
      "서로 다른 물체가 가라앉는 속도 차이",
      "같은 물체가 같은 온도에서 자유롭게 뜨는 높이 차이",
      "둘 다 무색이라는 사실만으로 정한 순서"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    },
    "explanation": "같은 물 양에서 녹은 설탕 양을 비교하거나, 같은 종류·온도의 용액에서 같은 물체의 뜨는 높이를 비교할 수 있다. 용기 색·다른 물체·무색만으로는 정하지 못한다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "1-9",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p1-10",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 10,
        "page": 2,
        "originalSet": 1,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E6",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-02",
      "topic": "같은 물체의 뜨는 정도 비교",
      "concept": "같은 물체의 뜨는 정도 비교",
      "inquirySkill": "같은 물체의 뜨는 정도 비교"
    },
    "prompt": "실사형 설명 자료는 같은 물체를 같은 온도의 세 설탕물에 넣은 모습입니다. 상대적으로 가장 묽은 용액의 기호를 쓰세요.",
    "givens": {
      "조건": "용기 모양과 액체 깊이를 맞췄고 세 물체 모두 벽·바닥에 닿지 않고 자유롭게 떠 있다. 같은 물체를 차례로 넣는 비교를 나란히 표현한 설명 자료이다."
    },
    "choices": null,
    "figure": "assets/activities/c22-s51-u03/floating-photo-v1.webp",
    "photoLabels": [
      "ㄷ",
      "ㄴ",
      "ㄱ"
    ],
    "figureNote": "세 용기에서 같은 물체가 왼쪽은 완전히 잠겨 자유롭게 떠 있고 가운데·오른쪽은 수면 위로 차례로 더 많이 드러난 실사형 자료",
    "photoCredit": "AI 실사형 설명 이미지 · 실제 측정 사진 아님",
    "visualModel": {
      "kind": "photo-comparison",
      "model": "float-a",
      "exactScale": false
    },
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ"
      ]
    },
    "explanation": "ㄷ에서는 같은 물체가 완전히 잠겨 자유롭게 떠 있고 ㄴ·ㄱ에서는 수면 위로 드러난다. 같은 종류·온도의 설탕물이라는 조건에서 ㄷ이 상대적으로 묽다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "1-10",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer",
        "visual"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p2-01",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 1,
        "page": 1,
        "originalSet": 2,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "보이는 알갱이와 녹은 물질의 존재",
      "concept": "보이는 알갱이와 녹은 물질의 존재",
      "inquirySkill": "보이는 알갱이와 녹은 물질의 존재"
    },
    "prompt": "실험 기록 중 분필 가루가 모두 녹은 용액이 되었다고 보기 어려운 관찰을 골라 기호로 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ 가루가 떠 있고 바닥에 남은 것이 보인다.",
        "ㄴ 용질이 모두 녹아 어느 부분이나 성질이 같다.",
        "ㄷ 색이 있으나 고르게 녹고 맑게 비친다."
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ"
      ]
    },
    "explanation": "흰 가루가 떠 있고 바닥에도 남으면 전체가 고르게 녹은 한 용액의 상태가 아니다. 맑게 비치거나 색이 있는 사실만으로는 배제하지 못한다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "2-1",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p2-02",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 2,
        "page": 1,
        "originalSet": 2,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "용해·용질·용매·용액의 구별",
      "concept": "용해·용질·용매·용액의 구별",
      "inquirySkill": "용해·용질·용매·용액의 구별"
    },
    "prompt": "소금물 설명 카드에서 빈 이름을 채우세요. “물에 녹은 소금은 ㉠, 소금을 녹인 물은 ㉡.” 순서대로 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "용질, 용매",
      "accepted": [
        "용질, 용매",
        "㉠ 용질 ㉡ 용매",
        "용질 용매"
      ]
    },
    "explanation": "용질과 용매는 무엇이 녹고 무엇이 녹이는지의 역할이다. 소금물 전체는 용액이다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "2-2",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p2-03",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 3,
        "page": 1,
        "originalSet": 2,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "용액의 관찰 특징과 분류",
      "concept": "용액의 관찰 특징과 분류",
      "inquirySkill": "용액의 관찰 특징과 분류"
    },
    "prompt": "완전히 녹고 고르게 섞인 소금물을 설명한 문장 중 고쳐야 할 것의 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ 녹은 소금은 용액 안에 남아 있다.",
        "ㄴ 위쪽을 덜면 아래쪽보다 언제나 더 묽다.",
        "ㄷ 일반 거름종이로 녹은 소금을 바로 거르기는 어렵다."
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "용액 일부를 덜어도 용질과 용매가 함께 옮겨져 진하기는 같다. 위치마다 진하기가 크게 다르다는 설명은 고르게 섞였다는 조건과 맞지 않는다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "2-3",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p2-04",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 4,
        "page": 1,
        "originalSet": 2,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "용액의 관찰 특징과 분류",
      "concept": "용액의 관찰 특징과 분류",
      "inquirySkill": "용액의 관찰 특징과 분류"
    },
    "prompt": "관찰 기록이 함께 있는 생활 사례 중 용질이 고르게 녹아 있는 용액의 예를 고르세요.",
    "givens": null,
    "choices": [
      "굵은 건더기가 뜨고 가라앉은 국물",
      "물과 기름이 두 층으로 분리된 컵",
      "소금 알갱이가 모두 녹아 맑게 보이는 물",
      "모래가 쌓이고 윗물이 보이는 병",
      "가루 덩어리가 남아 부분마다 다른 미음"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "상품 이름만으로 정하지 않고 관찰 상태를 제시했다. 소금이 고르게 모두 녹은 물은 용액이고 나머지는 고체/층이 구분된다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "2-4",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p2-05",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 5,
        "page": 1,
        "originalSet": 2,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "보이는 알갱이와 녹은 물질의 존재",
      "concept": "보이는 알갱이와 녹은 물질의 존재",
      "inquirySkill": "보이는 알갱이와 녹은 물질의 존재"
    },
    "prompt": "설탕이 모두 녹은 뒤의 기록으로 타당하지 않은 것을 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ 알갱이는 더 이상 눈에 보이지 않는다.",
        "ㄴ 잘 섞인 부분마다 진하기가 같다.",
        "ㄷ 설탕의 질량이 0이 되어 물만 남았다."
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ"
      ]
    },
    "explanation": "눈에 안 보인다는 것만으로 설탕이 없어져 질량도 0이 되었다고 할 수 없다. 용해되어 용액에 남아 있다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "2-5",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p2-06",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 6,
        "page": 1,
        "originalSet": 2,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "같은 물건 전체의 용해 전후 질량",
      "concept": "같은 물건 전체의 용해 전후 질량",
      "inquirySkill": "같은 물건 전체의 용해 전후 질량"
    },
    "prompt": "물 95 g과 소금 7 g을 손실 없이 모두 섞어 용액을 만들었습니다. 용액만의 질량은?",
    "givens": null,
    "choices": [
      "88 g",
      "95 g",
      "100 g",
      "102 g",
      "109 g"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "용질과 용매가 모두 남아 있으므로 95+7=102 g이다. 용기 질량은 용액의 질량에 포함하지 않는다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "2-6",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p2-07",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 7,
        "page": 2,
        "originalSet": 2,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "보이는 알갱이와 녹은 물질의 존재",
      "concept": "보이는 알갱이와 녹은 물질의 존재",
      "inquirySkill": "보이는 알갱이와 녹은 물질의 존재"
    },
    "prompt": "소금이 눈에 안 보인 뒤 같은 물건 전체의 질량이 유지되었습니다. 이 근거와 맞지 않는 설명의 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ 소금이 완전히 없어져 물만 존재한다.",
        "ㄴ 녹은 소금도 질량 비교에 포함되어 있다.",
        "ㄷ 소금과 물이 골고루 섞인 것이다."
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ"
      ]
    },
    "explanation": "전체 질량 유지와 소금의 소멸 주장은 맞지 않는다. 눈에 안 보이는 소금도 녹은 상태로 남아 있다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "2-7",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p2-08",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 8,
        "page": 2,
        "originalSet": 2,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "용질 종류에 따른 녹을 수 있는 양",
      "concept": "용질 종류에 따른 녹을 수 있는 양",
      "inquirySkill": "용질 종류에 따른 녹을 수 있는 양"
    },
    "prompt": "실험 계획에서 가루 P/Q/R이 녹을 수 있는 양을 비교하려고 합니다. 알아볼 조건을 고르세요.",
    "givens": null,
    "choices": [
      "물의 양을 컵마다 바꾸는 것",
      "관찰할 때마다 도구를 바꾸는 것",
      "물의 온도를 동시에 달리하는 것",
      "젓는 시간을 물질마다 달리하는 것",
      "용질의 종류를 달리하는 것"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "용질 종류를 바꾸고 물 양·온도·투입과 관찰 방법을 맞춰야 종류의 영향을 비교할 수 있다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "2-8",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p2-09",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 9,
        "page": 2,
        "originalSet": 2,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E3",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "용질 종류에 따른 녹을 수 있는 양",
      "concept": "용질 종류에 따른 녹을 수 있는 양",
      "inquirySkill": "용질 종류에 따른 녹을 수 있는 양"
    },
    "prompt": "같은 조건의 연습 자료에서 가장 먼저 고체가 남기 시작한 가루는 무엇인가요?",
    "givens": {
      "표": {
        "머리": [
          "누적 횟수",
          "P",
          "Q",
          "R"
        ],
        "행": [
          [
            "1",
            "모두 녹음",
            "모두 녹음",
            "모두 녹음"
          ],
          [
            "2",
            "모두 녹음",
            "모두 녹음",
            "일부 남음"
          ],
          [
            "3",
            "일부 남음",
            "모두 녹음",
            "관찰 중단"
          ],
          [
            "4",
            "관찰 중단",
            "모두 녹음",
            "관찰 중단"
          ],
          [
            "5",
            "관찰 중단",
            "일부 남음",
            "관찰 중단"
          ]
        ]
      },
      "조건": "물 양·온도는 같고 한 번의 투입 질량과 관찰 방법을 맞춘 연습 자료."
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "R",
      "accepted": [
        "R",
        "r"
      ]
    },
    "explanation": "P는 3회, Q는 5회, R은 2회부터 잔류가 나타난다. 가장 먼저는 R이며 정확한 최대 질량은 횟수만으로 정하지 않는다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "2-9",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p2-10",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 10,
        "page": 2,
        "originalSet": 2,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "용질 종류에 따른 녹을 수 있는 양",
      "concept": "용질 종류에 따른 녹을 수 있는 양",
      "inquirySkill": "용질 종류에 따른 녹을 수 있는 양"
    },
    "prompt": "물 각 40 mL·20 ℃에서 가루 L은 9 g 모두, M은 6 g 모두/9 g 일부, N은 6 g 일부가 남았습니다. 녹을 수 있는 양의 순서로 맞는 것은?",
    "givens": null,
    "choices": [
      "L > M > N",
      "N > M > L",
      "M > L > N",
      "L = M = N",
      "L > N > M"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "L은 적어도 9 g, M은 6 g 이상 9 g 미만, N은 6 g 미만이다. 제시한 조건 안에서 L>M>N이다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "2-10",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p2-11",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 11,
        "page": 2,
        "originalSet": 2,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E3",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "물 양에 따른 녹을 수 있는 양",
      "concept": "물 양에 따른 녹을 수 있는 양",
      "inquirySkill": "물 양에 따른 녹을 수 있는 양"
    },
    "prompt": "같은 온도의 물 25 mL와 75 mL에 같은 소금을 충분히 넣어 비교합니다. 더 많이 녹일 수 있는 물의 양을 단위와 함께 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "75 mL",
      "accepted": [
        "75 mL",
        "75밀리리터"
      ]
    },
    "explanation": "같은 온도·용질에서 물의 양이 더 많은 75 mL가 더 많은 소금을 녹일 수 있다. 녹는 빠르기를 비교한 것은 아니다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "2-11",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p2-12",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 12,
        "page": 2,
        "originalSet": 2,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E4",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "물 온도에 따른 녹을 수 있는 양",
      "concept": "물 온도에 따른 녹을 수 있는 양",
      "inquirySkill": "물 온도에 따른 녹을 수 있는 양"
    },
    "prompt": "계획 A/B에서 물 60 mL, 같은 백반과 투입 방법을 사용합니다. 백반의 용해량에 온도가 주는 영향을 알아보려면 다르게 할 조건의 기호는?",
    "givens": {
      "보기": [
        "ㄱ 비커 모양",
        "ㄴ 물의 양",
        "ㄷ 용질 종류",
        "ㄹ 물의 온도"
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄹ",
      "accepted": [
        "ㄹ"
      ]
    },
    "explanation": "물의 온도를 달리하고 물 양·용질 종류·관찰 방법을 맞춘다. 실험 목적과 바꿀 조건이 일치해야 한다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "2-12",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p2-13",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 13,
        "page": 3,
        "originalSet": 2,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E4",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "물 온도에 따른 녹을 수 있는 양",
      "concept": "물 온도에 따른 녹을 수 있는 양",
      "inquirySkill": "물 온도에 따른 녹을 수 있는 양"
    },
    "prompt": "교사가 준비한 물이 35 ℃인지 확인하려 합니다. 알맞은 측정 도구는?",
    "givens": null,
    "choices": [
      "액체의 부피를 읽는 눈금실린더",
      "물의 온도를 읽는 온도계",
      "용질의 질량을 읽는 전자저울",
      "시간을 재는 초시계",
      "부피를 옮기는 작은 스포이트"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "알아볼 양은 온도이므로 온도계를 쓴다. 가열 도구 선택이나 학생의 불꽃 조작을 요구하지 않는다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "2-13",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p2-14",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 14,
        "page": 3,
        "originalSet": 2,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E4",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "물 온도에 따른 녹을 수 있는 양",
      "concept": "물 온도에 따른 녹을 수 있는 양",
      "inquirySkill": "물 온도에 따른 녹을 수 있는 양"
    },
    "prompt": "연습 자료: 같은 물 60 mL에 남은 백반이 온도만 높이자 더 녹았습니다. 이 자료에 맞는 해석을 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ 모든 용질이 어떤 온도에서든 끝없이 녹는다.",
        "ㄴ 이 백반은 이 온도 범위에서 더 녹을 수 있다.",
        "ㄷ 녹은 백반은 질량이 없는 상태가 된다."
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "물 양과 용질이 같고 온도 상승 뒤 더 녹았다. 제시한 범위에서 용해량 차이를 뒷받침하며 무한한 양의 용해를 뜻하지 않는다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "2-14",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p2-15",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 15,
        "page": 3,
        "originalSet": 2,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E4",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "냉각 뒤 나타난 고체와 조건",
      "concept": "냉각 뒤 나타난 고체와 조건",
      "inquirySkill": "냉각 뒤 나타난 고체와 조건"
    },
    "prompt": "연습 관찰에서 식힌 뒤 백반 고체가 나타났습니다. 고체가 나온 까닭의 설명으로 맞는 것을 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ 백반이 모두 물로 변한 것이다.",
        "ㄴ 물이 얼어 모든 백반이 새로 생성되었다.",
        "ㄷ 녹아 있던 백반 일부가 고체로 나온 것이다."
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ"
      ]
    },
    "explanation": "자료에서 실제 고체가 나온 것은 온도 감소 뒤 녹을 수 있는 양이 줄어 일부가 고체로 나온 현상으로 설명한다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "2-15",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p2-16",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 16,
        "page": 3,
        "originalSet": 2,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E5",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-02",
      "topic": "색으로 비교하는 조건과 한계",
      "concept": "색으로 비교하는 조건과 한계",
      "inquirySkill": "색으로 비교하는 조건과 한계"
    },
    "prompt": "같은 양의 물에 같은 갈색 용질 2 g/6 g을 모두 녹였습니다. 실사형 설명 자료 두 컵 중 6 g을 녹인 쪽의 기호를 쓰세요.",
    "givens": {
      "조건": "같은 온도·용기·조명·관찰 깊이이며 실사형 설명 자료의 액면은 개략적이다."
    },
    "choices": null,
    "figure": "assets/bank/c22-s51-u03/pair-color-pair-photo-v1.webp",
    "photoLabels": [
      "ㄱ",
      "ㄴ"
    ],
    "figureNote": "같은 용기·액면의 갈색 용액 두 개. 왼쪽이 상대적으로 더 어둡고 오른쪽이 더 옅으며 두 액체 모두 맑은 실사형 자료",
    "photoCredit": "AI 실사형 설명 이미지 · 실제 측정 사진 아님",
    "visualModel": {
      "kind": "photo-comparison",
      "model": "color-pair",
      "exactScale": false
    },
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ"
      ]
    },
    "explanation": "같은 용질·물 양·용기와 관찰 깊이 조건에서 색이 더 진한 ㄱ이 더 많은 용질을 녹인 컵이다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "2-16",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer",
        "visual"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p2-17",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 17,
        "page": 3,
        "originalSet": 2,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E6",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-02",
      "topic": "같은 물체의 뜨는 정도 비교",
      "concept": "같은 물체의 뜨는 정도 비교",
      "inquirySkill": "같은 물체의 뜨는 정도 비교"
    },
    "prompt": "흰 설탕물의 진하기를 비교하는 설명 중 고쳐야 할 문장의 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ 같은 물 양에 녹은 설탕 양을 비교할 수 있다.",
        "ㄴ 색이 없으면 진하기도 반드시 모두 같다.",
        "ㄷ 같은 물체의 뜨는 높이를 조건을 맞춰 비교한다."
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "흰 설탕물의 무색 상태만으로 진하기를 같다고 정할 수 없다. 같은 물 양의 용질 양이나 같은 물체의 뜨는 정도를 살펴야 한다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "2-17",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p2-18",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 18,
        "page": 4,
        "originalSet": 2,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E6",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-02",
      "topic": "같은 물체의 뜨는 정도 비교",
      "concept": "같은 물체의 뜨는 정도 비교",
      "inquirySkill": "같은 물체의 뜨는 정도 비교"
    },
    "prompt": "실사형 설명 자료는 같은 물체가 같은 종류·온도의 다섯 설탕물에서 보인 모습입니다. 가장 진한 용액의 기호를 고르세요.",
    "givens": {
      "조건": "같은 모양 용기·충분한 액체 깊이. ㄱ은 바닥에 닿고 나머지는 자유롭게 떠 있다."
    },
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄹ",
      "ㄷ",
      "ㅁ"
    ],
    "figure": "assets/bank/c22-s51-u03/pair-float-five-photo-v2.webp",
    "photoLabels": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄹ",
      "ㅁ"
    ],
    "figureNote": "다섯 용기의 물체가 왼쪽부터 바닥 접촉, 완전 잠긴 자유 부유, 작은 부분 노출, 가장 큰 부분 노출, 아주 작은 부분 노출인 실사형 자료",
    "photoCredit": "AI 실사형 설명 이미지 · 실제 측정 사진 아님",
    "visualModel": {
      "kind": "photo-comparison",
      "model": "float-five",
      "exactScale": false
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "같은 물체가 수면 위로 가장 많이 드러난 ㄹ이 상대적으로 가장 진하다. ㄱ은 바닥에 닿지만 나머지는 자유롭게 떠 있으며, 그중 ㄹ의 드러난 부분이 가장 크다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "2-18",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer",
        "visual"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p2-19",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 19,
        "page": 4,
        "originalSet": 2,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E6",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-02",
      "topic": "같은 물체의 뜨는 정도 비교",
      "concept": "같은 물체의 뜨는 정도 비교",
      "inquirySkill": "같은 물체의 뜨는 정도 비교"
    },
    "prompt": "물체가 가라앉은 설탕물을 더 진하게 하여 뜨는 정도를 다시 비교하려 합니다. 온도를 같게 유지할 때 알맞은 조작의 기호는?",
    "givens": {
      "보기": [
        "ㄱ 설탕을 정한 양 더 넣어 모두 녹인다.",
        "ㄴ 물을 더 넣어 잘 섞는다.",
        "ㄷ 잘 섞인 용액 일부만 다른 컵에 덜어 낸다."
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ"
      ]
    },
    "explanation": "설탕을 추가해 실제로 녹이면 용질 양이 늘어 진해질 수 있다. 물 추가는 묽게 하며 용액 일부를 덜어내는 것만으로 진해지지 않는다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "2-19",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p2-20",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 20,
        "page": 4,
        "originalSet": 2,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E6",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-02",
      "topic": "진하기 비교 도구·조건·구별의 한계",
      "concept": "진하기 비교 도구·조건·구별의 한계",
      "inquirySkill": "진하기 비교 도구·조건·구별의 한계"
    },
    "prompt": "진하기 비교 도구가 한쪽으로 기울고 바닥에 닿았습니다. 개선 계획 중 적절하지 않은 것을 골라 기호로 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ 교사와 도구가 똑바로 서도록 균형을 맞춘다.",
        "ㄴ 두 용액에서 자유롭게 뜨는 무게 범위를 확인한다.",
        "ㄷ 도구를 바닥에 고정한 채 뜨는 높이를 읽는다."
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ"
      ]
    },
    "explanation": "바닥에 붙인 채 높이를 읽으면 자유롭게 뜨는 차이를 비교하지 못한다. 무게/균형을 조정하고 접촉 없이 뜨는지 확인해야 한다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "2-20",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p3-01",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 1,
        "page": 1,
        "originalSet": 3,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "용액의 관찰 특징과 분류",
      "concept": "용액의 관찰 특징과 분류",
      "inquirySkill": "용액의 관찰 특징과 분류"
    },
    "prompt": "교사가 준비한 재료를 물에 넣어 충분히 저었습니다. 물에 고르게 모두 녹은 상태로 보기 어려운 기록의 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ 소금이 모두 녹아 맑게 보임",
        "ㄴ 모래가 바닥에 쌓여 있음",
        "ㄷ 갈색 설탕이 모두 녹아 맑게 비침"
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "바닥에 모래가 남은 상태는 윗물과 구분된다. 고체가 남지 않고 고르게 녹은 두 다른 기록과 구별한다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "3-1",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p3-02",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 2,
        "page": 1,
        "originalSet": 3,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "용해·용질·용매·용액의 구별",
      "concept": "용해·용질·용매·용액의 구별",
      "inquirySkill": "용해·용질·용매·용액의 구별"
    },
    "prompt": "실험 일지에 “용질이 용매에 고르게 녹는 과정”의 이름을 적으려 합니다. 알맞은 것은?",
    "givens": null,
    "choices": [
      "용매",
      "침전",
      "진하기",
      "용해",
      "용액"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "과정의 이름은 용해이고 만들어진 혼합물은 용액이다. 물질의 역할과 과정 이름을 구분해야 한다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "3-2",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p3-03",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 3,
        "page": 1,
        "originalSet": 3,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "용액의 관찰 특징과 분류",
      "concept": "용액의 관찰 특징과 분류",
      "inquirySkill": "용액의 관찰 특징과 분류"
    },
    "prompt": "맑은 갈색 용액을 설명할 때 옳은 문장 하나를 골라 기호로 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ 갈색이면 반드시 고체가 떠 있다.",
        "ㄴ 색이 있으면 용액일 수 없다.",
        "ㄷ 투명하면 용질이 하나도 없다.",
        "ㄹ 색이 있어도 골고루 녹은 용액일 수 있다."
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄹ",
      "accepted": [
        "ㄹ"
      ]
    },
    "explanation": "색이 있다는 것과 가루가 남아 흐리다는 것은 다르다. 용질이 고르게 녹은 용액은 색이 있을 수 있다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "3-3",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p3-04",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 4,
        "page": 1,
        "originalSet": 3,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "용해·용질·용매·용액의 구별",
      "concept": "용해·용질·용매·용액의 구별",
      "inquirySkill": "용해·용질·용매·용액의 구별"
    },
    "prompt": "실사형 설명 자료의 물질 이름을 읽고 용매·용질·용액에 해당하는 것을 순서대로 쓰세요.",
    "givens": {
      "응답 순서": "용매 / 용질 / 용액"
    },
    "choices": null,
    "figure": "assets/bank/c22-s51-u03/pair-mix-salt-photo-v1.webp",
    "photoLabels": [
      "소금",
      "물",
      "소금물"
    ],
    "figureNote": "왼쪽 흰 소금, 가운데 맑은 물, 오른쪽 소금이 모두 녹은 맑은 소금물의 실사형 자료",
    "photoCredit": "AI 실사형 설명 이미지 · 실제 측정 사진 아님",
    "visualModel": {
      "kind": "photo-comparison",
      "model": "mix-salt",
      "exactScale": false
    },
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "물, 소금, 소금물",
      "accepted": [
        "물, 소금, 소금물",
        "물 소금 소금물",
        "용매 물 용질 소금 용액 소금물"
      ]
    },
    "explanation": "그림의 물은 소금을 녹이는 용매이고 소금은 용질이며, 고르게 섞인 소금물 전체는 용액이다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "3-4",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer",
        "visual"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p3-05",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 5,
        "page": 1,
        "originalSet": 3,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "보이는 알갱이와 녹은 물질의 존재",
      "concept": "보이는 알갱이와 녹은 물질의 존재",
      "inquirySkill": "보이는 알갱이와 녹은 물질의 존재"
    },
    "prompt": "충분히 저어 흰 설탕이 모두 녹은 물의 관찰·해석 중 옳지 않은 것은?",
    "givens": null,
    "choices": [
      "처음 보이던 큰 알갱이가 더 이상 보이지 않는다.",
      "용질이 물속에 고르게 섞였다고 설명할 수 있다.",
      "물과 설탕 전체를 용액으로 부를 수 있다.",
      "같은 전체를 재어 질량 유지의 근거를 확인한다.",
      "설탕이 완전히 없어져 질량도 0이라고 해석한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "알갱이의 보임과 존재는 다르다. 녹은 설탕은 용액 속에 남아 질량에 포함된다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "3-5",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p3-06",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 6,
        "page": 1,
        "originalSet": 3,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "같은 물건 전체의 용해 전후 질량",
      "concept": "같은 물건 전체의 용해 전후 질량",
      "inquirySkill": "같은 물건 전체의 용해 전후 질량"
    },
    "prompt": "소금을 넣은 직후부터 모두 녹을 때까지 컵·내용물 전체를 계속 쟀습니다. 흘림·증발이 없을 때 알맞은 예상은?",
    "givens": null,
    "choices": [
      "같은 물건 전체의 질량이 유지될 것이다.",
      "눈에 보이는 소금이 줄수록 저울값도 계속 작아진다.",
      "녹기 시작한 뒤 물 자체의 질량이 계속 커진다.",
      "질량이 사라졌다가 마지막에 다시 생긴다.",
      "용질이 사라져 마지막에는 컵 질량만 남는다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "소금이 이미 들어간 뒤부터 같은 계를 재므로 용해 진행에 따라 질량이 없어지지 않는다. 소금을 추가하기 전 값과 혼동하지 않는다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "3-6",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p3-07",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 7,
        "page": 2,
        "originalSet": 3,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "같은 물건 전체의 용해 전후 질량",
      "concept": "같은 물건 전체의 용해 전후 질량",
      "inquirySkill": "같은 물건 전체의 용해 전후 질량"
    },
    "prompt": "소금 8 g을 녹인 소금물이 73 g입니다. 손실이 없다면 처음 물만의 질량은?",
    "givens": null,
    "choices": [
      "8 g",
      "65 g",
      "73 g",
      "81 g",
      "57 g"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "용액 질량에서 용질 질량을 빼면 물 질량 73-8=65 g이다. 용기 질량은 포함하지 않은 자료다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "3-7",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p3-08",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 8,
        "page": 2,
        "originalSet": 3,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E3",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "용질 종류에 따른 녹을 수 있는 양",
      "concept": "용질 종류에 따른 녹을 수 있는 양",
      "inquirySkill": "용질 종류에 따른 녹을 수 있는 양"
    },
    "prompt": "같은 조건의 가루 X/Y/Z가 녹을 수 있는 양을 많은 순서로 쓰세요.",
    "givens": {
      "표": {
        "머리": [
          "가루",
          "7 g",
          "10 g"
        ],
        "행": [
          [
            "X",
            "일부 남음",
            "일부 남음"
          ],
          [
            "Y",
            "모두 녹음",
            "모두 녹음"
          ],
          [
            "Z",
            "모두 녹음",
            "일부 남음"
          ]
        ]
      },
      "조건": "물 50 mL·20 ℃, 충분히 저은 연습 관찰."
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "Y > Z > X",
      "accepted": [
        "Y > Z > X",
        "Y Z X",
        "y>z>x"
      ]
    },
    "explanation": "Y는 적어도 10 g, Z는 7 g 이상 10 g 미만, X는 7 g 미만이다. 그러므로 Y>Z>X이다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "3-8",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p3-09",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 9,
        "page": 2,
        "originalSet": 3,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E3",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "용질 종류에 따른 녹을 수 있는 양",
      "concept": "용질 종류에 따른 녹을 수 있는 양",
      "inquirySkill": "용질 종류에 따른 녹을 수 있는 양"
    },
    "prompt": "가루 A/B에 대해 같은 온도 물 40 mL에서 A의 최대량이 8 g, B가 5 g이라는 연습 모형을 줍니다. 물만 80 mL로 늘렸을 때 녹을 수 있는 양의 순서로 맞는 것을 고르세요.",
    "givens": {
      "보기": [
        "ㄱ B > A",
        "ㄴ A > B",
        "ㄷ A = B"
      ],
      "모형 조건": "같은 종류의 용질·용매와 온도에서 물 양에 비례하는 용해량 모형. 정확한 수치 암기는 요구하지 않음."
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "같은 온도에서 물 양을 두 배로 하여 비교하는 모형이므로 A/B의 양이 함께 두 배가 되어 순서는 A>B로 유지된다. 실제 측정한 값이 아닌 주어진 모형이다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "3-9",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p3-10",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 10,
        "page": 2,
        "originalSet": 3,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E3",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "물 양에 따른 녹을 수 있는 양",
      "concept": "물 양에 따른 녹을 수 있는 양",
      "inquirySkill": "물 양에 따른 녹을 수 있는 양"
    },
    "prompt": "다음 두 문장을 순서대로 ○ 또는 ×로 판단하세요.",
    "givens": {
      "문장": "(1) 같은 온도라면 물을 두 배로 해도 녹일 수 있는 양은 언제나 같다.\n(2) 물 양과 온도가 같아도 용질 종류가 다르면 녹일 수 있는 양이 다를 수 있다."
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "×, ○",
      "accepted": [
        "×, ○",
        "× ○",
        "(1) × (2) ○",
        "X O"
      ]
    },
    "explanation": "같은 용질과 온도에서 물 양이 늘면 녹일 수 있는 양도 늘 수 있다. 또 종류에 따라 같은 조건의 물에 녹을 수 있는 양이 다를 수 있다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "3-10",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p3-11",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 11,
        "page": 2,
        "originalSet": 3,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E4",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "물 온도에 따른 녹을 수 있는 양",
      "concept": "물 온도에 따른 녹을 수 있는 양",
      "inquirySkill": "물 온도에 따른 녹을 수 있는 양"
    },
    "prompt": "연습 관찰에서 물 양을 유지하고 온도만 높이자 남은 백반이 모두 녹았습니다. 직접 뒷받침되는 설명은?",
    "givens": null,
    "choices": [
      "컵을 바꾼 것이 유일한 원인이다.",
      "백반이 없어진 것이므로 질량도 없어졌다.",
      "이 온도 범위에서 백반이 더 녹을 수 있었다.",
      "모든 물질이 어떤 온도에서도 끝없이 녹는다.",
      "백반은 차가운 물에 전혀 녹지 않는 물질이다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "재료·물 양·관찰 방법이 같은 비교에서 온도 상승 뒤 잔류가 없어졌다. 해당 범위의 용해량 차이를 설명하며 코코아 등 불명확한 조성을 대신 가정하지 않는다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "3-11",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p3-12",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 12,
        "page": 2,
        "originalSet": 3,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E4",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "물 온도에 따른 녹을 수 있는 양",
      "concept": "물 온도에 따른 녹을 수 있는 양",
      "inquirySkill": "물 온도에 따른 녹을 수 있는 양"
    },
    "prompt": "백반의 용해량에 물 온도가 주는 영향을 알아보는 계획에서 먼저 고칠 조건의 기호는?",
    "givens": {
      "보기": [
        "ㄱ A 물 30 mL·15 ℃, B 물 80 mL·35 ℃로 준비한다.",
        "ㄴ 같은 백반을 정한 질량씩 넣고 젓는다.",
        "ㄷ 실제 물 온도와 잔류를 기록한다."
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ"
      ]
    },
    "explanation": "A/B는 물 양도 달라 온도의 영향만 구분하기 어렵다. 물 양을 같게 한 다음 다른 온도로 같은 용질·방법을 비교한다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "3-12",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p3-13",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 13,
        "page": 3,
        "originalSet": 3,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E4",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "물 온도에 따른 녹을 수 있는 양",
      "concept": "물 온도에 따른 녹을 수 있는 양",
      "inquirySkill": "물 온도에 따른 녹을 수 있는 양"
    },
    "prompt": "같은 양의 물·백반으로 다른 온도에서 비교한 실사형 설명 자료입니다. 백반이 더 많이 녹을 수 있는 높은 온도 쪽의 기호를 쓰세요.",
    "givens": {
      "조건": "물 양·용질·투입량·젓고 관찰하는 방법이 같고 온도만 다르다."
    },
    "choices": null,
    "figure": "assets/activities/c22-s51-u03/residue-photo-v1.webp",
    "photoLabels": [
      "ㄱ",
      "ㄴ"
    ],
    "figureNote": "같은 모양 용기의 왼쪽에는 바닥 고체가 남고 오른쪽에는 남은 고체가 보이지 않는 실사형 자료",
    "photoCredit": "AI 실사형 설명 이미지 · 실제 측정 사진 아님",
    "visualModel": {
      "kind": "photo-comparison",
      "model": "residue-pair",
      "exactScale": false
    },
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "같은 투입량에서 ㄱ에는 고체가 남고 ㄴ에는 모두 녹았다. 다른 조건이 같다는 자료에서 ㄴ이 더 많이 녹일 수 있었던 높은 온도 쪽이다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "3-13",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer",
        "visual"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p3-14",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 14,
        "page": 3,
        "originalSet": 3,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "냉각 뒤 나타난 고체와 조건",
      "concept": "냉각 뒤 나타난 고체와 조건",
      "inquirySkill": "냉각 뒤 나타난 고체와 조건"
    },
    "prompt": "연습 관찰에서 백반 용액 A를 식힌 뒤 실제로 고체가 나왔습니다. 이 변화의 원인을 다시 확인할 비교 계획을 모두 고르세요.",
    "givens": null,
    "choices": [
      "같은 처음 용액을 나누어 식힌 쪽과 원래 온도를 유지한 쪽을 비교한다.",
      "한 컵에만 물을 더 넣고 두 컵의 차이를 온도 때문이라고 정한다.",
      "용액 종류와 양은 유지하고 실제 온도·고체 발생 여부를 기록한다.",
      "고체가 나오지 않은 기록은 지워 비교에서 뺀다.",
      "다른 종류의 가루로 바꾼 뒤 같은 실험이라고 기록한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        2
      ]
    },
    "explanation": "온도 외 조건을 맞춘 비교와 실제 온도/잔류 기록이 원인 검토에 적절하다. 실제로 고체가 나왔다는 관찰을 주어 모든 따뜻한 용액의 필연적 결과로 확대하지 않는다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "3-14",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p3-15",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 15,
        "page": 3,
        "originalSet": 3,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E5",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-02",
      "topic": "용질·용매의 상대적 양과 진하기",
      "concept": "용질·용매의 상대적 양과 진하기",
      "inquirySkill": "용질·용매의 상대적 양과 진하기"
    },
    "prompt": "“같은 물 양에 녹아 있는 용질이 상대적으로 많은지 적은지”를 나타내는 말을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "진하기",
      "accepted": [
        "진하기"
      ]
    },
    "explanation": "용액의 상대적 진하기를 뜻한다. 용액의 총량이나 물의 온도와 구별해야 한다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "3-15",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p3-16",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 16,
        "page": 3,
        "originalSet": 3,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E5",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-02",
      "topic": "색으로 비교하는 조건과 한계",
      "concept": "색으로 비교하는 조건과 한계",
      "inquirySkill": "색으로 비교하는 조건과 한계"
    },
    "prompt": "같은 물 90 g에 황설탕 3 g/9 g을 모두 녹였습니다. 같은 깊이·용기·조명에서 비교할 때 9 g 쪽에 대한 옳지 않은 설명은?",
    "givens": null,
    "choices": [
      "색이 상대적으로 더 진할 수 있다.",
      "용액 질량은 3 g 쪽보다 더 크다.",
      "같은 물 양에 녹은 용질이 더 많다.",
      "계속 넣는 설탕이 어떤 양이든 모두 녹는다.",
      "두 용액은 모두 색이 있어도 용액일 수 있다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "일정한 물 양·온도에서 녹일 수 있는 양에는 범위가 있다. 9 g이 녹았다고 무한히 녹는 것은 아니다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "3-16",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p3-17",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 17,
        "page": 3,
        "originalSet": 3,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E2",
      "type": "T04",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "같은 물건 전체의 용해 전후 질량",
      "concept": "같은 물건 전체의 용해 전후 질량",
      "inquirySkill": "같은 물건 전체의 용해 전후 질량"
    },
    "prompt": "물 70 g에 각각 설탕 4 g과 13 g을 모두 녹였습니다. 두 용액만의 질량이 다른 까닭을 실제 수치와 용질 양으로 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "각각 74 g과 83 g이다. 물 양은 같고 녹은 설탕이 9 g 더 많으므로 두 용액 질량도 9 g 차이가 난다.",
      "rubric": {
        "required": [
          "74 g/83 g",
          "같은 물 양",
          "용질 9 g 차이와 전체 질량 차이 연결"
        ],
        "pass": "교사 확인 · 동등 표현과 다른 타당한 해법 인정",
        "note": "학습용 기준이며 공식 배점표나 실제 수행 확인이 아니다."
      }
    },
    "explanation": "용액 질량은 손실이 없을 때 물과 녹은 설탕 질량의 합이다. 70+4=74, 70+13=83이며 차이는 용질 차이와 같다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "3-17",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p3-18",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 18,
        "page": 3,
        "originalSet": 3,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E6",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-02",
      "topic": "같은 물체의 뜨는 정도 비교",
      "concept": "같은 물체의 뜨는 정도 비교",
      "inquirySkill": "같은 물체의 뜨는 정도 비교"
    },
    "prompt": "같은 물체를 같은 종류·온도의 설탕물에 넣은 실사형 설명 자료입니다. 가장 진한 용액을 골라 기호로 쓰세요.",
    "givens": {
      "조건": "실사형 설명 자료의 떠 있는 물체는 벽/바닥에 닿지 않는다."
    },
    "choices": null,
    "figure": "assets/activities/c22-s51-u03/floating-photo-v1.webp",
    "photoLabels": [
      "ㄷ",
      "ㄱ",
      "ㄴ"
    ],
    "figureNote": "같은 물체가 왼쪽에서는 완전히 잠겨 자유롭게 떠 있고 가운데·오른쪽에서는 수면 위로 차례로 더 많이 드러난 실사형 자료",
    "photoCredit": "AI 실사형 설명 이미지 · 실제 측정 사진 아님",
    "visualModel": {
      "kind": "photo-comparison",
      "model": "float-b",
      "exactScale": false
    },
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "ㄴ에서 같은 물체가 수면 위로 가장 많이 드러난다. 같은 물체·온도·용기 조건의 상대적 진하기를 비교한 것이다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "3-18",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer",
        "visual"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p3-19",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 19,
        "page": 4,
        "originalSet": 3,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E6",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-02",
      "topic": "진하기 비교 도구·조건·구별의 한계",
      "concept": "진하기 비교 도구·조건·구별의 한계",
      "inquirySkill": "진하기 비교 도구·조건·구별의 한계"
    },
    "prompt": "두 설탕물의 뜨는 정도 비교 도구를 고릅니다. 실제로 사용하기 알맞다고 확인된 것은?",
    "givens": null,
    "choices": [
      "두 용액에서 모두 바닥에 붙어 움직이지 않은 쇠못",
      "한쪽 컵 벽에 끼여 떠 있는 것처럼 보이는 공",
      "서로 다른 무게와 재질의 물체를 각각 하나씩 쓴 경우",
      "손으로 받쳐야만 물 위에 놓일 수 있는 물체",
      "두 용액에서 자유롭게 뜨며 높이 차이를 보인 같은 물체"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "재료 이름만으로 적합성을 보장하지 않고 실제로 같은 물체가 두 용액의 차이를 나타내는지 확인했다. 벽/바닥/손의 지지는 비교를 해친다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "3-19",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p3-20",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 20,
        "page": 4,
        "originalSet": 3,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E6",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-02",
      "topic": "같은 물체의 뜨는 정도 비교",
      "concept": "같은 물체의 뜨는 정도 비교",
      "inquirySkill": "같은 물체의 뜨는 정도 비교"
    },
    "prompt": "비교 도구를 넣은 두 설탕물 중 도구가 수면 위로 더 많이 드러난 쪽을 상대적으로 [묽은/진한] 중 골라 쓰세요.",
    "givens": {
      "조건": "같은 도구를 사용하며 용기 모양과 액체 깊이를 맞췄다."
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "진한",
      "accepted": [
        "진한"
      ]
    },
    "explanation": "같은 물체와 온도·용액 종류·자유롭게 뜨는 조건을 맞춘 자료에서 더 높이 뜨는 쪽이 상대적으로 진하다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "3-20",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p4-01",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 1,
        "page": 1,
        "originalSet": 4,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "용액의 관찰 특징과 분류",
      "concept": "용액의 관찰 특징과 분류",
      "inquirySkill": "용액의 관찰 특징과 분류"
    },
    "prompt": "다섯 혼합물을 젓고 충분히 기다린 뒤 기록했습니다. 전체를 한 가지 고른 용액으로 분류하기 어려운 것은?",
    "givens": null,
    "choices": [
      "기름과 물이 위아래 두 층으로 구분된 컵",
      "소금이 모두 녹아 위아래 어느 부분이나 같은 컵",
      "색 성분이 고르게 녹아 맑게 비쳐 보이는 컵",
      "흰 설탕이 모두 녹고 남은 알갱이가 없는 컵",
      "같은 용질이 골고루 녹아 부분마다 진하기가 같은 컵"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "두 층이 구분된 전체는 고르게 섞인 한 용액이 아니다. 다른 기록은 용질이 모두 고르게 녹은 조건이며, 색이 있어도 용액일 수 있다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "4-1",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p4-02",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 2,
        "page": 1,
        "originalSet": 4,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "용액의 관찰 특징과 분류",
      "concept": "용액의 관찰 특징과 분류",
      "inquirySkill": "용액의 관찰 특징과 분류"
    },
    "prompt": "물에 넣은 세 가루의 결과가 달랐습니다. 이 기록으로 가능한 설명을 골라 기호로 쓰세요.",
    "givens": {
      "관찰": "설탕은 모두 녹음, 소금은 모두 녹음, 모래는 남음.",
      "보기": [
        "ㄱ 가루라도 종류에 따라 물에 녹는 정도가 다를 수 있다.",
        "ㄴ 가루는 모두 어떤 물 양에도 끝없이 녹는다.",
        "ㄷ 물에 넣으면 모든 가루가 사라져 질량이 0이다."
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ"
      ]
    },
    "explanation": "가루라는 외형만으로 용해 여부가 같지는 않다. 일부는 녹고 일부는 남을 수 있다는 자료의 범위 안에서 설명한다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "4-2",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p4-03",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 3,
        "page": 1,
        "originalSet": 4,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "용해·용질·용매·용액의 구별",
      "concept": "용해·용질·용매·용액의 구별",
      "inquirySkill": "용해·용질·용매·용액의 구별"
    },
    "prompt": "카드의 빈칸을 차례대로 채우세요. “녹는 성분은 ㉠, 용질과 용매가 고르게 섞인 전체는 ㉡.”",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "용질, 용액",
      "accepted": [
        "용질, 용액",
        "용질 용액",
        "㉠ 용질 ㉡ 용액"
      ]
    },
    "explanation": "용질은 녹는 물질, 용액은 용해된 전체 혼합물을 뜻한다. 녹이는 물질인 용매와 구별한다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "4-3",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p4-04",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 4,
        "page": 1,
        "originalSet": 4,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "용해·용질·용매·용액의 구별",
      "concept": "용해·용질·용매·용액의 구별",
      "inquirySkill": "용해·용질·용매·용액의 구별"
    },
    "prompt": "실험 이름표 “소금 + 물 → 소금물”에서 소금을 녹이는 역할의 물질 이름을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "물",
      "accepted": [
        "물"
      ]
    },
    "explanation": "녹이는 물질인 물이 용매다. 소금물은 녹인 물과 소금이 섞인 용액이므로 물 자체와 구별한다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "4-4",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p4-05",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 5,
        "page": 1,
        "originalSet": 4,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "용액의 관찰 특징과 분류",
      "concept": "용액의 관찰 특징과 분류",
      "inquirySkill": "용액의 관찰 특징과 분류"
    },
    "prompt": "제품 이름 대신 실제 관찰을 읽어 한 가지 균일한 용액의 상태를 고르세요.",
    "givens": null,
    "choices": [
      "건더기와 맑은 윗물이 나뉜 상태",
      "알갱이가 모두 녹아 전체가 고르게 맑은 소금물",
      "기름층과 물층이 구분된 상태",
      "가루 덩어리와 윗물이 구분된 상태",
      "큰 고체 조각이 바닥에 여러 개 쌓인 상태"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "소금이 고르게 모두 녹은 관찰이 용액 상태와 맞는다. 다른 기록은 덩어리나 층이 구분된다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "4-5",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p4-06",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 6,
        "page": 1,
        "originalSet": 4,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "보이는 알갱이와 녹은 물질의 존재",
      "concept": "보이는 알갱이와 녹은 물질의 존재",
      "inquirySkill": "보이는 알갱이와 녹은 물질의 존재"
    },
    "prompt": "설탕을 모두 녹인 뒤 알갱이가 보이지 않는 물에 대해 옳은 설명을 모두 고르세요.",
    "givens": null,
    "choices": [
      "녹은 설탕은 용액 안에 존재한다.",
      "설탕의 질량은 0이 되어 물만 남는다.",
      "물과 설탕이 고르게 섞인 것이다.",
      "어느 부분을 덜든 설탕만 따로 모여 있다.",
      "설탕이 보이지 않으므로 원래 넣은 양은 비교할 수 없다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        2
      ]
    },
    "explanation": "알갱이의 보임과 존재는 다르다. 고르게 섞인 용액 안에 설탕이 남아 있으며 같은 전체의 질량을 비교할 수 있다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "4-6",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p4-07",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 7,
        "page": 2,
        "originalSet": 4,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "같은 물건 전체의 용해 전후 질량",
      "concept": "같은 물건 전체의 용해 전후 질량",
      "inquirySkill": "같은 물건 전체의 용해 전후 질량"
    },
    "prompt": "흘림·증발 없이 물 85 g에 설탕 14 g을 모두 녹였습니다. 컵을 제외한 용액의 질량은?",
    "givens": null,
    "choices": [
      "71 g",
      "85 g",
      "99 g",
      "109 g",
      "14 g"
    ],
    "figure": "assets/activities/c22-s51-u03/mixing-photo-v1.webp",
    "photoLabels": [
      "설탕",
      "물",
      "설탕물"
    ],
    "figureNote": "왼쪽 흰 설탕, 가운데 맑은 물, 오른쪽 설탕이 모두 녹은 맑은 설탕물의 실사형 자료",
    "photoCredit": "AI 실사형 설명 이미지 · 실제 측정 사진 아님",
    "visualModel": {
      "kind": "photo-comparison",
      "model": "mix-neutral",
      "exactScale": false
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "용액은 물과 설탕이 함께 있으므로 85+14=99 g이다. 그림은 과정만 나타내며 계산은 제시한 수치를 읽는다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "4-7",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer",
        "visual"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p4-08",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 8,
        "page": 2,
        "originalSet": 4,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "같은 물건 전체의 용해 전후 질량",
      "concept": "같은 물건 전체의 용해 전후 질량",
      "inquirySkill": "같은 물건 전체의 용해 전후 질량"
    },
    "prompt": "용해 전후 같은 물건 전체가 모두 149 g이었습니다. 이 근거와 맞는 설명의 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ 설탕이 없어져 그 질량도 사라졌다.",
        "ㄴ 용질이 모두 용기로 변해버렸다.",
        "ㄷ 용질이 용매에 녹아 남아 있다고 설명할 수 있다."
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ"
      ]
    },
    "explanation": "설탕이 보이지 않아도 같은 전체의 질량이 유지된 사실은 녹은 설탕이 남아 있음을 뒷받침한다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "4-8",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p4-09",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 9,
        "page": 2,
        "originalSet": 4,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "보이는 알갱이와 녹은 물질의 존재",
      "concept": "보이는 알갱이와 녹은 물질의 존재",
      "inquirySkill": "보이는 알갱이와 녹은 물질의 존재"
    },
    "prompt": "알갱이가 작아지는 모습을 자세히 관찰하는 활동입니다. 관찰을 어렵게 하는 행동을 골라 기호로 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ 같은 위치에서 조명과 배경을 맞춘다.",
        "ㄴ 변화가 보이지 않게 컵을 계속 힘차게 흔든다.",
        "ㄷ 정한 시간마다 실제 보인 모습을 기록한다."
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "이 활동의 목적은 변화 모습을 관찰하는 것이다. 힘차게 흔들어 흐름을 크게 만들면 관찰을 방해할 수 있다. 다른 용해량 비교의 충분한 젓기와 구별한다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "4-9",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p4-10",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 10,
        "page": 2,
        "originalSet": 4,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "용질 종류에 따른 녹을 수 있는 양",
      "concept": "용질 종류에 따른 녹을 수 있는 양",
      "inquirySkill": "용질 종류에 따른 녹을 수 있는 양"
    },
    "prompt": "가루 종류의 영향을 비교하려고 세 컵에 물 60 mL씩 준비합니다. 같은 부피를 맞추는 방법으로 가장 알맞은 것은?",
    "givens": null,
    "choices": [
      "같은 비커를 보고 눈대중으로 절반쯤씩 채운다.",
      "컵과 물을 함께 잰 전체 질량만 같도록 물을 조절한다.",
      "물의 온도만 같게 맞춘 뒤 남은 양을 세 컵에 붓는다.",
      "눈금실린더의 60 mL 눈금을 눈높이에 맞춰 읽어 나눈다.",
      "컵 모양이 달라도 바닥에서 액면까지 높이만 같게 붓는다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "비교에서 물의 부피를 같게 하려면 같은 단위의 부피 눈금을 바르게 읽는다. 눈대중·전체 질량·온도·서로 다른 컵의 액면 높이는 같은 물 부피를 보장하지 않는다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "4-10",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p4-11",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 11,
        "page": 2,
        "originalSet": 4,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E3",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "용질 종류에 따른 녹을 수 있는 양",
      "concept": "용질 종류에 따른 녹을 수 있는 양",
      "inquirySkill": "용질 종류에 따른 녹을 수 있는 양"
    },
    "prompt": "연습 자료에서 가루 P는 이 물 조건에 최대 4 g 녹습니다. P 6 g을 넣고 충분히 저은 뒤 나타날 모습의 기호를 실사형 설명 자료에서 고르세요.",
    "givens": {
      "조건": "같은 물 양·온도의 연습 모형이며 실제 물질 수치 암기나 학생 측정값이 아니다."
    },
    "choices": null,
    "figure": "assets/activities/c22-s51-u03/residue-photo-v1.webp",
    "photoLabels": [
      "ㄱ",
      "ㄴ"
    ],
    "figureNote": "같은 모양 용기의 왼쪽에는 바닥 고체가 남고 오른쪽에는 남은 고체가 보이지 않는 실사형 자료",
    "photoCredit": "AI 실사형 설명 이미지 · 실제 측정 사진 아님",
    "visualModel": {
      "kind": "photo-comparison",
      "model": "residue-pair",
      "exactScale": false
    },
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ"
      ]
    },
    "explanation": "최대 4 g이 녹는다는 모형에서 6 g을 넣었으므로 일부가 고체로 남는다. 고체가 보이는 ㄱ과 맞는다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "4-11",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer",
        "visual"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p4-12",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 12,
        "page": 3,
        "originalSet": 4,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E3",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "용질 종류에 따른 녹을 수 있는 양",
      "concept": "용질 종류에 따른 녹을 수 있는 양",
      "inquirySkill": "용질 종류에 따른 녹을 수 있는 양"
    },
    "prompt": "가루 종류만 바꾸고 물 양·온도·관찰 방법을 맞춰, 넣은 양과 고체 잔류를 기록했습니다. 이 탐구가 직접 알아보려는 것의 기호는?",
    "givens": {
      "보기": [
        "ㄱ 용해 전후 같은 전체의 질량",
        "ㄴ 공기 압력에 따른 용기 크기",
        "ㄷ 같은 가루가 녹는 데 걸리는 시간만",
        "ㄹ 종류에 따른 녹을 수 있는 양"
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄹ",
      "accepted": [
        "ㄹ"
      ]
    },
    "explanation": "측정한 것은 투입량과 잔류이므로 용질 종류에 따른 녹을 수 있는 양이다. 질량 보존이나 녹는 시간을 직접 잰 것은 아니다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "4-12",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p4-13",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 13,
        "page": 3,
        "originalSet": 4,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E3",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "용질 종류에 따른 녹을 수 있는 양",
      "concept": "용질 종류에 따른 녹을 수 있는 양",
      "inquirySkill": "용질 종류에 따른 녹을 수 있는 양"
    },
    "prompt": "같은 물 50 mL·20 ℃에서 같은 질량의 가루 A와 B를 넣었습니다. A는 일부 남고 B는 모두 녹았습니다. 이 양을 더 잘 녹인 쪽의 기호를 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "B",
      "accepted": [
        "B",
        "b"
      ]
    },
    "explanation": "같은 투입량과 물 조건에서 B는 전부 녹였고 A는 일부를 남겼다. 이 조건에서 B가 해당 양을 더 잘 녹였으며 B의 정확한 최대량은 알 수 없다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "4-13",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p4-14",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 14,
        "page": 3,
        "originalSet": 4,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E3",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "용질 종류에 따른 녹을 수 있는 양",
      "concept": "용질 종류에 따른 녹을 수 있는 양",
      "inquirySkill": "용질 종류에 따른 녹을 수 있는 양"
    },
    "prompt": "가루 P와 Q의 녹을 수 있는 양을 비교할 때 물 양과 온도를 [같게/다르게] 중 어떻게 해야 하는지 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "같게",
      "accepted": [
        "같게"
      ]
    },
    "explanation": "용질 종류의 영향을 살피므로 물 양과 온도는 맞춰야 한다. 결과인 남은 고체를 같게 만드는 것은 아니다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "4-14",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p4-15",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 15,
        "page": 3,
        "originalSet": 4,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E3",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "물 양에 따른 녹을 수 있는 양",
      "concept": "물 양에 따른 녹을 수 있는 양",
      "inquirySkill": "물 양에 따른 녹을 수 있는 양"
    },
    "prompt": "소금과 온도가 같을 때 네 컵 중 가장 많은 소금을 녹일 수 있는 물의 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ 45 mL",
        "ㄴ 135 mL",
        "ㄷ 90 mL",
        "ㄹ 60 mL"
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "같은 용질·온도에서 물 양이 가장 많은 ㄴ이 더 많은 소금을 녹일 수 있다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "4-15",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p4-16",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 16,
        "page": 3,
        "originalSet": 4,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E4",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "물 온도에 따른 녹을 수 있는 양",
      "concept": "물 온도에 따른 녹을 수 있는 양",
      "inquirySkill": "물 온도에 따른 녹을 수 있는 양"
    },
    "prompt": "같은 물 양에 백반을 넣는 조건을 비교합니다. 제시한 온도 범위에서 가장 많이 녹일 수 있는 쪽은?",
    "givens": null,
    "choices": [
      "10 ℃",
      "25 ℃",
      "35 ℃",
      "15 ℃",
      "45 ℃"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "백반과 이 범위에서는 높은 온도 쪽에 더 많이 녹을 수 있다. 보기 중 가장 높은 것은 45 ℃이며 다른 종류의 모든 용질 규칙으로 확대하지 않는다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "4-16",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p4-17",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 17,
        "page": 3,
        "originalSet": 4,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E4",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "물 온도에 따른 녹을 수 있는 양",
      "concept": "물 온도에 따른 녹을 수 있는 양",
      "inquirySkill": "물 온도에 따른 녹을 수 있는 양"
    },
    "prompt": "백반을 녹일 조건 중 물 양과 온도가 다른 모든 보기 이상인 것을 골라 가장 많이 녹일 수 있는 조건을 정하세요.",
    "givens": null,
    "choices": [
      "물 120 mL·35 ℃",
      "물 40 mL·15 ℃",
      "물 80 mL·35 ℃",
      "물 120 mL·15 ℃",
      "물 80 mL·15 ℃"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "첫 조건은 최대 물 양과 최대 온도를 함께 가진다. 물 양과 온도 중 하나의 영향만 분리해 잰 실험이라는 뜻은 아니다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "4-17",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p4-18",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 18,
        "page": 4,
        "originalSet": 4,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E4",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "물 온도에 따른 녹을 수 있는 양",
      "concept": "물 온도에 따른 녹을 수 있는 양",
      "inquirySkill": "물 온도에 따른 녹을 수 있는 양"
    },
    "prompt": "연습 자료: 같은 물 양에서 백반이 15 ℃보다 35 ℃에 더 많이 녹을 수 있었습니다. 빈칸 “이 백반은 제시 범위에서 물 온도가 더 [높을/낮을] 때 더 녹았다.”를 채우세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "높을",
      "accepted": [
        "높을"
      ]
    },
    "explanation": "백반과 온도 범위를 지정한 관찰이므로 높은 온도 조건이 맞다. 모든 용질에 대한 조건 없는 일반화와 구별한다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "4-18",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p4-19",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 19,
        "page": 4,
        "originalSet": 4,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E4",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-01",
      "topic": "냉각 뒤 나타난 고체와 조건",
      "concept": "냉각 뒤 나타난 고체와 조건",
      "inquirySkill": "냉각 뒤 나타난 고체와 조건"
    },
    "prompt": "실제 관찰 자료에서 같은 백반 용액을 식힌 뒤 고체가 생겼습니다. 이 사실에 맞는 설명을 골라 기호로 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ 백반이 공기에서 새로 생겨 들어왔다.",
        "ㄴ 식힌 뒤 녹아 있던 백반 일부가 고체로 나왔다.",
        "ㄷ 물이 끓어 백반 전체가 기체로 변했다."
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "냉각 뒤 고체가 나타난 사실을 주었다. 녹아 있던 백반 일부가 다시 고체로 나온 것으로 해석하며 양/온도 조건 없이 항상 생긴다고 가정하지 않는다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "4-19",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p4-20",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 20,
        "page": 4,
        "originalSet": 4,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E5",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-02",
      "topic": "용질·용매의 상대적 양과 진하기",
      "concept": "용질·용매의 상대적 양과 진하기",
      "inquirySkill": "용질·용매의 상대적 양과 진하기"
    },
    "prompt": "같은 양의 물에 녹인 설탕 양이 다를 때 비교하려는 용액의 성질 이름을 쓰세요. 물의 온도나 용액 총량과 구별해요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "진하기",
      "accepted": [
        "진하기"
      ]
    },
    "explanation": "용질과 용매의 상대적인 양으로 설명하는 성질이 진하기다. 물 양을 같게 했다는 조건이 핵심이다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "4-20",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p4-21",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 21,
        "page": 4,
        "originalSet": 4,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E5",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-02",
      "topic": "용질·용매의 상대적 양과 진하기",
      "concept": "용질·용매의 상대적 양과 진하기",
      "inquirySkill": "용질·용매의 상대적 양과 진하기"
    },
    "prompt": "같은 물 80 g에 설탕 4 g/12 g을 모두 녹인 연습 자료입니다. 12 g 쪽에 대해 옳은 설명을 모두 고르세요.",
    "givens": null,
    "choices": [
      "4 g 쪽보다 용액만의 질량이 더 크다.",
      "물의 양이 같으므로 진하기도 반드시 같다.",
      "다른 조건이 같을 때 상대적으로 더 진하다.",
      "설탕 질량이 물에 녹아 모두 없어졌다.",
      "용액의 총량만 보고 모든 종류의 용액보다 진하다고 정한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        2
      ]
    },
    "explanation": "물 양이 같고 용질이 더 많아 12 g 쪽이 더 진하며 질량은 92 g으로 84 g보다 크다. 맛보기 없이 성분과 양으로 설명한다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "4-21",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p4-22",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 22,
        "page": 4,
        "originalSet": 4,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E6",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-02",
      "topic": "같은 물체의 뜨는 정도 비교",
      "concept": "같은 물체의 뜨는 정도 비교",
      "inquirySkill": "같은 물체의 뜨는 정도 비교"
    },
    "prompt": "실사형 설명 자료의 세 설탕물 중 가장 진한 것의 기호를 쓰세요. 같은 물체·온도·용기 조건이에요.",
    "givens": null,
    "choices": null,
    "figure": "assets/activities/c22-s51-u03/floating-photo-v1.webp",
    "photoLabels": [
      "ㄷ",
      "ㄱ",
      "ㄴ"
    ],
    "figureNote": "같은 물체가 왼쪽에서는 완전히 잠겨 자유롭게 떠 있고 가운데·오른쪽에서는 수면 위로 차례로 더 많이 드러난 실사형 자료",
    "photoCredit": "AI 실사형 설명 이미지 · 실제 측정 사진 아님",
    "visualModel": {
      "kind": "photo-comparison",
      "model": "float-b",
      "exactScale": false
    },
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "수면에 대한 물체의 위치를 비교하면 ㄴ에서 가장 높이 떠 있다. 상대적인 진하기만 알 수 있고 정확한 농도 수치는 정하지 못한다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "4-22",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer",
        "visual"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p4-23",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 23,
        "page": 4,
        "originalSet": 4,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E6",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-02",
      "topic": "같은 물체의 뜨는 정도 비교",
      "concept": "같은 물체의 뜨는 정도 비교",
      "inquirySkill": "같은 물체의 뜨는 정도 비교"
    },
    "prompt": "이 실사형 설명 자료로 진하기를 비교하는 까닭을 바르게 설명한 친구의 이름을 쓰세요.",
    "givens": {
      "친구들의 설명": [
        "서우: 컵 기호가 달라서야.",
        "유진: 같은 물체가 뜨는 정도의 차이를 비교한 거야.",
        "태오: 용액 이름이 길수록 더 진하기 때문이야."
      ]
    },
    "choices": null,
    "figure": "assets/activities/c22-s51-u03/floating-photo-v1.webp",
    "photoLabels": [
      "ㄷ",
      "ㄱ",
      "ㄴ"
    ],
    "figureNote": "같은 물체가 왼쪽에서는 완전히 잠겨 자유롭게 떠 있고 가운데·오른쪽에서는 수면 위로 차례로 더 많이 드러난 실사형 자료",
    "photoCredit": "AI 실사형 설명 이미지 · 실제 측정 사진 아님",
    "visualModel": {
      "kind": "photo-comparison",
      "model": "float-b",
      "exactScale": false
    },
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "유진",
      "accepted": [
        "유진"
      ]
    },
    "explanation": "같은 물체와 조건에서 상대 진하기가 달라지면 뜨는 정도가 달라질 수 있다는 설명이 관찰과 연결된다. 색이나 이름만의 차이는 근거가 아니다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "4-23",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer",
        "visual"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p4-24",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 24,
        "page": 5,
        "originalSet": 4,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E6",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-02",
      "topic": "진하기 비교 도구·조건·구별의 한계",
      "concept": "진하기 비교 도구·조건·구별의 한계",
      "inquirySkill": "진하기 비교 도구·조건·구별의 한계"
    },
    "prompt": "뜨는 높이로 두 설탕물을 비교하는 계획에서 고쳐야 할 방법의 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ 서로 다른 무게의 도구를 한 용액에 하나씩 넣는다.",
        "ㄴ 같은 도구가 벽과 바닥에 닿는지 확인한다.",
        "ㄷ 같은 온도에서 수면 기준의 높이를 기록한다.",
        "ㄹ 실제로 구별 못 한 결과도 그대로 남긴다."
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ"
      ]
    },
    "explanation": "서로 다른 도구를 쓰면 도구 자체의 영향이 섞인다. 같은 도구가 자유롭게 뜨는 높이를 같은 기준으로 읽어야 한다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "4-24",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  },
  {
    "id": "c22-s51-u03-p4-25",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 25,
        "page": 5,
        "originalSet": 4,
        "course": "초등 5-1"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u03",
      "area": "물질",
      "element": "E6",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과03-02",
      "topic": "같은 물체의 뜨는 정도 비교",
      "concept": "같은 물체의 뜨는 정도 비교",
      "inquirySkill": "같은 물체의 뜨는 정도 비교"
    },
    "prompt": "설탕물 A를 더 진하게 하려 합니다. 물 양과 온도를 유지하는 조작으로 적절한 것은?",
    "givens": null,
    "choices": [
      "같은 용액을 더 큰 컵으로만 옮긴다.",
      "설탕을 조금 더 넣어 실제로 모두 녹인다.",
      "물만 정한 양 더 넣어 잘 섞는다.",
      "잘 섞인 용액 일부를 덜어 버린다.",
      "같은 용액을 젓기만 하고 성분은 바꾸지 않는다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "물 양이 같고 녹은 설탕이 늘면 진해진다. 용기 변경·덜기·젓기만으로는 같은 용액의 진하기가 늘지 않는다.",
    "curriculumScope": "current-linked",
    "variantRules": {
      "kind": "persisted-independent-pair",
      "sourceKey": "4-25",
      "answerFromOwnConditions": true
    },
    "evidence": {
      "checkedBy": "독립 짝 자체 조건·정답·사진/표 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과03·자가 이론/실험 본문·짝 자체 조건",
      "note": "실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다."
    }
  }
];
