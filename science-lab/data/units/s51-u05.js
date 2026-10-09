export const unit = {
  "id": "s51-u05",
  "course": "5-1",
  "no": 5,
  "title": "다양한 생물과 우리 생활",
  "domain": "생명",
  "sources": {
    "theory": [
      "5-2-1 이론 교사 PDF Ⅰ 작은 생물의 세계 · Ⅱ 생물 영역 심화 (비공개 원본)"
    ],
    "lab": [
      "5-C 실험 교사 PDF 2. 효모빵 만들기 (비공개 원본)"
    ]
  }
};
export const items = [
  {
    "id": "s51-u05-b01",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-1",
      "unit": "u05",
      "originalNo": 1
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "생명",
      "area": "생명",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u05",
      "element": "E1",
      "type": "T01",
      "concept": "균류(곰팡이·버섯)의 특징",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "곰팡이와 버섯의 몸은 가는 실 모양의 ( ① )(으)로 이루어져 있고, 씨 대신 ( ② )(으)로 번식해요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "균사",
          "accepted": [
            "균사"
          ]
        },
        {
          "answer": "포자",
          "accepted": [
            "포자"
          ]
        }
      ]
    },
    "explanation": "곰팡이·버섯·효모처럼 균사로 이루어지거나 포자로 번식하는 생물을 균류라고 해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-lab-5-C-2",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u05-b02",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-1",
      "unit": "u05",
      "originalNo": 2
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "생명",
      "area": "생명",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u05",
      "element": "E1",
      "type": "T02",
      "concept": "효모와 발효(효모빵)",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "효모는 반죽 속의 ( ① )을(를) 양분으로 먹고 ( ② ) 기체를 내놓아 반죽을 부풀게 해요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "설탕",
          "accepted": [
            "설탕",
            "설탕",
            "당",
            "당분"
          ]
        },
        {
          "answer": "이산화탄소",
          "accepted": [
            "이산화탄소"
          ]
        }
      ]
    },
    "explanation": "반죽 속에 갇힌 기체가 빵의 작은 구멍이 돼요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-lab-5-C-2",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u05-b03",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-1",
      "unit": "u05",
      "originalNo": 3
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "생명",
      "area": "생명",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u05",
      "element": "E1",
      "type": "T02",
      "concept": "효모와 발효(효모빵)",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "반죽에 넣은 물이 약 40 ℃로 따뜻할 때 효모가 가장 활발하고, 물이 너무 뜨거우면 효모가 ( ① ).",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "죽어요",
          "accepted": [
            "죽어요",
            "죽어요",
            "죽는다",
            "죽어",
            "죽음",
            "죽습니다"
          ]
        }
      ]
    },
    "explanation": "효모도 살아 있는 생물이라 알맞은 온도가 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-lab-5-C-2",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u05-b04",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-1",
      "unit": "u05",
      "originalNo": 4
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "생명",
      "area": "생명",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u05",
      "element": "E2",
      "type": "T04",
      "concept": "세균의 생김새와 특징",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "세균은 맨눈으로 볼 수 없을 만큼 작아서 ( ① )(으)로 관찰하고, 생김새에 따라 공 모양·막대 모양·( ② ) 모양 등으로 나눠요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "현미경",
          "accepted": [
            "현미경"
          ]
        },
        {
          "answer": "나선",
          "accepted": [
            "나선",
            "나선",
            "나선형",
            "용수철"
          ]
        }
      ]
    },
    "explanation": "세균은 알맞은 조건에서 짧은 시간에 둘로 나뉘며 빠르게 늘어나요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-lab-5-C-2",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u05-b05",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-1",
      "unit": "u05",
      "originalNo": 5
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "생명",
      "area": "생명",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u05",
      "element": "E1",
      "type": "T02",
      "concept": "효모와 발효(효모빵)",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "같은 양의 밀가루·설탕·효모에 온도가 다른 물을 넣은 반죽을 따뜻한 곳에 40분 두었을 때 부푼 정도를 골라 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "table-fill",
    "answerContract": {
      "type": "table-fill",
      "rowHead": "반죽에 넣은 물",
      "columns": [
        "부푼 정도"
      ],
      "options": {
        "부푼 정도": [
          "거의 그대로",
          "조금 부풂",
          "가장 많이 부풂"
        ]
      },
      "rows": [
        {
          "label": "찬물(10 ℃)",
          "answer": [
            "조금 부풂"
          ]
        },
        {
          "label": "따뜻한 물(40 ℃)",
          "answer": [
            "가장 많이 부풂"
          ]
        },
        {
          "label": "뜨거운 물(70 ℃)",
          "answer": [
            "거의 그대로"
          ]
        }
      ]
    },
    "explanation": "효모는 따뜻할 때 가장 활발하고, 너무 뜨거우면 죽어 기체를 만들지 못해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-lab-5-C-2",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u05-b06",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-1",
      "unit": "u05",
      "originalNo": 6
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "생명",
      "area": "생명",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u05",
      "element": "E3",
      "type": "T05",
      "concept": "생물이 우리 생활에 주는 영향",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "세균에 대한 설명으로 알맞은 것은?",
    "givens": null,
    "choices": [
      "세균은 모두 사람에게 병을 일으킨다",
      "김치를 맛있게 익히는 세균도 있다",
      "세균은 맨눈으로도 잘 보일 만큼 크다",
      "세균은 아주 추운 곳에서만 살 수 있다",
      "세균은 한 번 생기면 수가 늘지 않는다"
    ],
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
    "explanation": "세균 가운데에는 김치·요구르트를 만들거나 죽은 생물을 분해하는 이로운 세균도 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-lab-5-C-2",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u05-b07",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-1",
      "unit": "u05",
      "originalNo": 7
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "생명",
      "area": "생명",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u05",
      "element": "E1",
      "type": "T02",
      "concept": "효모와 발효(효모빵)",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "따뜻한 물로 만든 반죽이 찬물로 만든 반죽보다 더 많이 부푼 까닭을 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "따뜻한 물에서 효모가 더 활발하게 설탕을 먹고 이산화탄소 기체를 많이 내놓아, 그 기체가 반죽을 부풀렸기 때문이다.",
      "rubric": {
        "required": [
          "따뜻할 때 효모가 활발함",
          "기체(이산화탄소)가 반죽을 부풀림"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "반죽이 부푼 것은 물이 늘어난 것이 아니라 효모가 만든 기체 때문이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-lab-5-C-2",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u05-b08",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-1",
      "unit": "u05",
      "originalNo": 8
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "생명",
      "area": "생명",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u05",
      "element": "E1",
      "type": "T01",
      "concept": "균류(곰팡이·버섯)의 특징",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "버섯이 식물과 다른 점을 두 가지 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "버섯은 스스로 양분을 만들지 못하고 죽은 나무 같은 다른 생물에서 양분을 얻으며, 씨가 아니라 포자로 번식한다.",
      "rubric": {
        "required": [
          "스스로 양분을 만들지 못함",
          "포자로 번식"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "버섯에는 뿌리·줄기·잎이 없고 엽록체도 없어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-lab-5-C-2",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u05-b09",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-1",
      "unit": "u05",
      "originalNo": 9
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "생명",
      "area": "생명",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u05",
      "element": "E3",
      "type": "T05",
      "concept": "생물이 우리 생활에 주는 영향",
      "level": "기본",
      "track": "교과",
      "format": "서술형"
    },
    "prompt": "세균이 우리 생활에 주는 이로운 점과 해로운 점을 한 가지씩 써요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "이로운 점: 김치나 요구르트를 만들고 죽은 생물을 분해한다. 해로운 점: 음식을 상하게 하거나 병을 일으킨다.",
      "rubric": {
        "required": [
          "이로운 점(발효·분해 등)",
          "해로운 점(음식 상함·병)"
        ],
        "pass": "핵심 생각을 모두 담으면 정답"
      }
    },
    "explanation": "같은 세균 무리라도 종류에 따라 이롭기도, 해롭기도 해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-lab-5-C-2",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u05-b10",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-1",
      "unit": "u05",
      "originalNo": 10
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "생명",
      "area": "생명",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u05",
      "element": "E2",
      "type": "T03",
      "concept": "원생생물(해캄·짚신벌레)",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "물속에 사는 해캄과 짚신벌레에 대한 설명으로 알맞은 것은?",
    "givens": null,
    "choices": [
      "둘 다 맨눈으로 생김새를 자세히 볼 수 있다",
      "해캄은 몸 둘레의 가는 털로 헤엄쳐 다닌다",
      "해캄은 초록색 실 모양, 짚신벌레는 짚신 모양이다",
      "짚신벌레는 초록색이고 스스로 양분을 만든다",
      "둘 다 곰팡이와 같은 무리라서 갓 아래에서 포자로 번식한다"
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "해캄은 초록색이라 스스로 양분을 만들고, 짚신벌레는 털(섬모)로 움직이며 먹이를 먹어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-lab-5-C-2",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u05-b11",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-1",
      "unit": "u05",
      "originalNo": 11
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "생명",
      "area": "생명",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u05",
      "element": "E2",
      "type": "T04",
      "concept": "세균의 생김새와 특징",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "세균이 사는 곳에 대한 설명으로 알맞은 것은?",
    "givens": null,
    "choices": [
      "깨끗해 보이는 손이나 책상 위에는 하나도 없다",
      "아주 뜨거운 온천 같은 곳에서만 산다",
      "물속에서만 살고 땅이나 공기에는 없다",
      "땅·물·공기·우리 몸 등 거의 모든 곳에 산다",
      "사람이 먹는 음식 속에서만 살 수 있다"
    ],
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
    "explanation": "세균은 너무 작아 보이지 않을 뿐 거의 모든 곳에 살아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-lab-5-C-2",
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s51-u05-b12",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "5-1",
      "unit": "u05",
      "originalNo": 12
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "생명",
      "area": "생명",
      "course": "5-1",
      "grade": 5,
      "semester": 1,
      "unit": "u05",
      "element": "E3",
      "type": "T06",
      "concept": "첨단 생명 과학",
      "level": "기본",
      "track": "교과",
      "format": "선택형"
    },
    "prompt": "첨단 생명 과학을 이용한 예로 알맞은 것은?",
    "givens": null,
    "choices": [
      "곰팡이가 핀 빵을 깨끗이 털어 먹는다",
      "세균을 이용해 당뇨병 약(인슐린)을 만든다",
      "버섯을 햇빛에 말려 식물로 바꾸어 기른다",
      "짚신벌레를 많이 길러 단단한 옷감을 만든다",
      "모든 세균을 없애 땅을 아주 깨끗하게 만든다"
    ],
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
    "explanation": "생물의 특징을 이용해 약·연료·환경 정화 같은 일에 쓰는 것이 첨단 생명 과학이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source-lab-5-C-2",
        "science",
        "answer"
      ]
    }
  }
];
