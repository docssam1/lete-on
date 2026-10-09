// 3-2 Ⅶ 기말평가 — 유사문항 40 (창작). 원문 1문항당 1개, 같은 유형·난이도로 상황과 물체를 바꿨다. of = 짝이 되는 원문 (세트, 번호).
export const similar = [
  {
    "id": "s32-fin-v001",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 1
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "쇠숟가락, 우유, 공기를 친구에게 손으로 전달하려고 합니다. 이에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "손으로 잡아 그대로 건네기 쉬운 것은 쇠숟가락입니다.",
      "건네는 동안 모양이 그대로 유지되는 것은 우유입니다.",
      "건네는 동안 눈으로 볼 수 있는 것은 공기뿐입니다.",
      "손으로 잡으면 손가락 사이로 흘러내리는 것은 쇠숟가락입니다.",
      "눈에 보이지 않아 건넸는지 알기 어려운 것은 우유입니다."
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "쇠숟가락은 고체라서 손으로 잡아 그대로 건넬 수 있어요. 우유는 눈에 보이지만 흘러내리고, 공기는 보이지도 잡히지도 않아 건넸는지 알기 어려워요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v002",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 2
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "고체가 아닌 것을 고르세요.",
    "givens": null,
    "choices": [
      "동전",
      "숟가락",
      "식용유",
      "공책",
      "유리컵"
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
    "explanation": "식용유는 흐르고 담는 그릇에 따라 모양이 바뀌는 액체예요. 동전·숟가락·공책·유리컵은 모양과 부피가 일정한 고체예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v003",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 3
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물을 넓적한 접시, 길쭉한 병, 둥근 그릇에 차례로 옮겨 담았습니다. 이때 변하는 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 물의 양(부피)",
        "ㄴ. 물의 색깔",
        "ㄷ. 물의 모양",
        "ㄹ. 물의 상태"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ",
        "물의 모양",
        "모양"
      ]
    },
    "explanation": "물은 액체라서 담는 그릇에 따라 모양이 바뀌어요. 물의 양(부피)과 색깔, 액체라는 상태는 그대로예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v004",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 4
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "식용유와 상태가 같은 것을 고르세요.",
    "givens": null,
    "choices": [
      "소금",
      "간장",
      "모래",
      "유리구슬",
      "나무젓가락"
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
    "explanation": "식용유와 간장은 흐르고 그릇에 따라 모양이 바뀌는 액체예요. 소금·모래·유리구슬·나무젓가락은 고체예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v005",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 5
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T04",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "마른 스펀지를 물이 담긴 수조 속에 넣고 손으로 꾹 눌렀더니 스펀지에서 방울이 생겨 물 위로 올라왔습니다. 이를 통해 알 수 있는 것을 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "눈에 보이지 않지만 스펀지 속 작은 구멍에도 공기가 있는 것처럼, 우리 주변에는 공기가 있다는 것을 알 수 있어요.",
      "rubric": {
        "required": [
          "눈에 보이지 않아도 우리 주변(스펀지 속)에 공기가 있다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "스펀지를 누르면 구멍 속에 있던 공기가 밀려 나와 방울이 되어 올라와요. 그래서 눈에 보이지 않아도 우리 주변에 공기가 있다는 것을 알 수 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v006",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 6
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "공기가 공간을 차지하는 성질을 이용한 물건을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "돋보기",
      "구명 튜브",
      "쇠숟가락",
      "선풍기",
      "에어 쿠션 포장재"
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        4
      ]
    },
    "explanation": "구명 튜브와 에어 쿠션 포장재는 안에 공기를 채워 공기가 공간을 차지하는 성질을 이용해요. 선풍기는 공기가 이동하는 성질을 이용해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v007",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 7
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물 위에 페트병 뚜껑을 띄우고, 바닥에 구멍이 뚫린 투명한 플라스틱 컵을 뒤집어 뚜껑을 덮은 뒤 수조 바닥까지 천천히 밀어 넣었습니다. 이에 대한 설명으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "컵 안으로 물이 들어옵니다.",
      "페트병 뚜껑이 수조 바닥으로 내려갑니다.",
      "컵 속 공기가 바닥의 구멍으로 빠져나갑니다.",
      "수조의 물 높이가 처음보다 크게 높아집니다.",
      "컵 속 공기가 물을 밀어 내어 컵 안이 비어 있습니다."
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        2
      ]
    },
    "explanation": "컵 바닥에 구멍이 있으면 컵 속 공기가 구멍으로 빠져나가 그 자리에 물이 들어와요. 그래서 페트병 뚜껑은 물 위에 떠 있고 물 높이도 거의 그대로예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v008",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 8
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "공기를 넣어 부풀린 비닐봉지 입구에 빨대를 끼우고, 빨대 끝을 탁자 위의 작은 종잇조각 쪽으로 향하게 한 뒤 봉지를 눌렀더니 종잇조각이 날아갔습니다. 이를 통해 알 수 있는 내용으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "공기는 다른 곳으로 이동할 수 있습니다.",
      "공기는 무게가 없습니다.",
      "공기는 눈에 잘 보입니다.",
      "공기는 모양과 부피가 항상 일정합니다.",
      "공기는 손으로 잡아 옮길 수 있습니다."
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "봉지를 누르면 봉지 속 공기가 빨대를 따라 이동해 나오면서 종잇조각을 밀어 내요. 이를 통해 공기가 다른 곳으로 이동할 수 있다는 것을 알 수 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v009",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 9
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 축구공 세 개에 공기 주입기로 공기를 넣는 횟수를 다르게 하여 무게를 재었습니다. 무게가 가벼운 것부터 순서대로 기호를 나열하세요.",
    "givens": {
      "보기": [
        "ㄱ. 공기를 30번 넣은 축구공",
        "ㄴ. 공기를 한 번도 넣지 않은 축구공",
        "ㄷ. 공기를 15번 넣은 축구공"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ, ㄷ, ㄱ",
      "accepted": [
        "ㄴ, ㄷ, ㄱ",
        "ㄴ,ㄷ,ㄱ",
        "ㄴㄷㄱ",
        "ㄴ ㄷ ㄱ",
        "ㄴ-ㄷ-ㄱ",
        "ㄴ<ㄷ<ㄱ"
      ]
    },
    "explanation": "공기도 무게가 있어서 공기를 많이 넣을수록 축구공이 무거워져요. 그래서 넣은 횟수가 적은 공부터 가벼워요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v010",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 10
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "기체에 대한 설명으로 옳은 것을 <보기>에서 모두 골라 짝 지은 것은?",
    "givens": {
      "보기": [
        "ㄱ. 담긴 그릇을 항상 가득 채웁니다.",
        "ㄴ. 무게가 없어서 저울로 잴 수 없습니다.",
        "ㄷ. 담는 그릇에 따라 모양과 부피가 모두 변합니다.",
        "ㄹ. 손으로 잡아서 다른 곳으로 옮길 수 있습니다."
      ]
    },
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄹ",
      "ㄱ, ㄷ, ㄹ"
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
    "explanation": "기체는 담긴 그릇을 항상 가득 채우고 그릇에 따라 모양과 부피가 모두 변해요. 공기 같은 기체도 무게가 있고, 손으로 잡아 옮길 수는 없어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v011",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 11
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "괄호 ㉠과 ㉡에 들어갈 알맞은 말을 골라 각각 쓰세요.",
    "givens": {
      "지문": "공기 로켓 장난감은 ㉠( 고체, 액체, 기체 )인 플라스틱 관과, 관 속에서 밀려 나가는 ㉡( 고체, 액체, 기체 )인 공기를 이용하여 만든 장난감입니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-고체, ㉡-기체",
      "accepted": [
        "㉠-고체, ㉡-기체",
        "㉠ 고체, ㉡ 기체",
        "고체, 기체",
        "고체,기체",
        "고체 기체"
      ]
    },
    "explanation": "플라스틱 관은 모양과 부피가 일정한 고체이고, 공기는 눈에 보이지 않고 그릇을 가득 채우는 기체예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v012",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 12
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "실에 매단 가벼운 스타이로폼 공을 트라이앵글 두 개에 각각 살짝 대어 보았더니 다음과 같은 결과가 나타났습니다. ㄱ과 ㄴ 중에서 소리가 나는 트라이앵글을 골라 기호를 쓰세요.",
    "givens": {
      "표": {
        "ㄱ": [
          "공이 여러 번 튕겨 나갑니다."
        ],
        "ㄴ": [
          "공이 그대로 매달려 있습니다."
        ]
      }
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ"
      ]
    },
    "explanation": "소리가 나는 트라이앵글은 떨리고 있어서, 공을 대면 그 떨림 때문에 공이 튕겨 나가요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v013",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 13
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "스피커 위에 물을 담은 얕은 그릇을 올려놓고 스피커 소리의 크기를 다르게 하여 물의 움직임을 관찰했습니다. 더 작은 소리가 나는 경우를 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 물결이 크게 출렁거림.",
        "ㄴ. 물결이 아주 조금 생김."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "스피커가 작게 떨리면 물결이 조금만 생기고 작은 소리가 나요. 크게 떨릴수록 물결이 크게 출렁이고 큰 소리가 나요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v014",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 14
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물체가 떨리는 정도와 소리의 세기에 대한 설명으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "물체가 크게 떨릴수록 큰 소리가 납니다.",
      "물체가 빠르게 떨릴수록 큰 소리가 납니다.",
      "소리의 세기는 소리의 높고 낮은 정도를 말합니다.",
      "작은북을 약하게 치면 북이 작게 떨려 작은 소리가 납니다.",
      "물체가 작게 떨리면 높은 소리가 납니다."
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    },
    "explanation": "소리의 세기는 소리의 크고 작은 정도로, 물체가 크게 떨리면 큰 소리, 작게 떨리면 작은 소리가 나요. 떨림의 빠르기는 소리의 높낮이와 관계있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v015",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 15
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "길이가 다른 빨대 ㄱ(12 cm), ㄴ(9 cm), ㄷ(6 cm)으로 빨대 피리를 만들어 같은 세기로 불었습니다. 이에 대한 설명으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "빨대의 길이에 따라 소리의 높낮이가 달라집니다.",
      "빨대의 길이에 따라 소리의 세기만 달라집니다.",
      "ㄱ~ㄷ 중에서 가장 낮은 소리가 나는 것은 ㄱ입니다.",
      "ㄷ은 ㄱ보다 느리게 떨려 낮은 소리가 납니다.",
      "ㄴ과 ㄷ은 길이가 달라도 같은 높이의 소리가 납니다."
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        2
      ]
    },
    "explanation": "빨대 피리는 짧을수록 빠르게 떨려 높은 소리가 나고, 길수록 느리게 떨려 낮은 소리가 나요. 그래서 가장 긴 ㄱ이 가장 낮은 소리를 내요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v016",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 16
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "공사장에서 사람들에게 위험을 알리는 경고음을 정하려고 합니다. 가장 알맞은 소리를 고르세요.",
    "givens": null,
    "choices": [
      "작고 낮은 소리",
      "크고 낮은 소리",
      "작고 높은 소리",
      "크고 높은 소리",
      "점점 작아지는 낮은 소리"
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
    "explanation": "큰 소리는 멀리까지 전달되고, 높은 소리는 사람들의 주의를 끌어요. 그래서 위험을 알릴 때는 크고 높은 소리를 써요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v017",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 17
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "기체인 공기를 통해 소리가 전달되는 경우가 아닌 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "교실에서 선생님의 말씀을 들을 때",
      "물속에서 돌고래끼리 소리를 주고받을 때",
      "창문 밖에서 들려오는 새소리를 들을 때",
      "벽에 귀를 대고 벽을 두드리는 소리를 들을 때",
      "멀리서 울리는 천둥소리를 들을 때"
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        3
      ]
    },
    "explanation": "돌고래의 소리는 액체인 물을 통해, 벽에 귀를 대고 듣는 소리는 고체인 벽을 통해 전달돼요. 나머지는 공기를 통해 전달되는 경우예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v018",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 18
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 숟가락 소리 실험에 대한 설명입니다. 빈칸 ㉠과 ㉡에 들어갈 알맞은 말을 바르게 짝 지은 것을 고르세요.",
    "givens": {
      "지문": "• 실 가운데에 금속 숟가락을 묶고 실 양 끝을 양쪽 귀에 댄 뒤 숟가락을 막대로 치면 [㉠]을(를) 통해 소리가 전달되어 소리가 크게 들립니다.\n• 이때 [㉠]은(는) [㉡] 상태의 물질입니다."
    },
    "choices": [
      "공기 / 기체",
      "실 / 고체",
      "숟가락 / 액체",
      "공기 / 고체",
      "실 / 액체"
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
    "explanation": "숟가락을 칠 때 생긴 떨림이 고체인 실을 통해 귀까지 전달되어 소리가 크게 들려요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v019",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 19
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "텅 빈 강당과 긴 터널 안에서 소리를 냈을 때 공통적으로 나타나는 현상으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "소리가 벽을 통과해 모두 사라집니다.",
      "소리가 점점 높은 음으로 바뀝니다.",
      "소리가 벽에 부딪쳐 되돌아와 울립니다.",
      "소리가 바닥에 모두 흡수되어 들리지 않습니다.",
      "소리가 물을 통해서만 전달됩니다."
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
    "explanation": "텅 빈 강당이나 터널에서는 소리가 딱딱한 벽에 부딪쳐 되돌아오기 때문에 소리가 울려요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v020",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 20
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "아파트에서 아래층으로 전해지는 소음을 줄이는 방법으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "바닥에 두꺼운 매트를 깝니다.",
      "집 안에서 뛰지 않고 살살 걷습니다.",
      "텔레비전 소리를 더 크게 켜서 소음을 덮습니다.",
      "의자 다리에 딱딱한 쇠붙이를 덧댑니다.",
      "문을 세게 닫아 소리를 짧게 끝냅니다."
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        1
      ]
    },
    "explanation": "두꺼운 매트는 소리가 바닥으로 전달되는 것을 줄이고, 살살 걸으면 바닥이 작게 떨려 작은 소리가 나요. 소리를 더 키우면 소음은 더 커져요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v021",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 1
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 ㄱ~ㄷ에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": {
      "보기": [
        "ㄱ. 돌멩이",
        "ㄴ. 컵에 담긴 우유",
        "ㄷ. 부풀린 풍선 속의 공기"
      ]
    },
    "choices": [
      "ㄱ은 단단합니다.",
      "ㄴ은 컵을 기울이면 흘러내립니다.",
      "ㄷ은 눈에 보이지 않고 색깔도 없습니다.",
      "ㄱ과 ㄷ은 손으로 잡을 수 있습니다.",
      "ㄴ은 눈으로 볼 수 있습니다."
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
    "explanation": "ㄱ 돌멩이는 고체라서 잡을 수 있지만, ㄷ 공기는 눈에 보이지 않고 손으로 잡을 수 없어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v022",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 2
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "유리구슬과 쇠못의 공통점으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "눈으로 볼 수 있습니다.",
      "손으로 잡을 수 있습니다.",
      "다른 그릇에 옮겨 담아도 부피가 그대로입니다.",
      "다른 그릇에 옮겨 담으면 모양이 바뀝니다.",
      "만지면 단단합니다."
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
    "explanation": "유리구슬과 쇠못은 고체라서 다른 그릇에 옮겨 담아도 모양과 부피가 모두 변하지 않아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v023",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 3
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다른 그릇에 옮겨 담았을 때 모양이 변하는 것을 고르세요.",
    "givens": null,
    "choices": [
      "클립",
      "동전",
      "꿀",
      "구슬",
      "나무 블록"
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
    "explanation": "꿀은 끈끈하지만 흐르고 그릇에 따라 모양이 바뀌는 액체예요. 클립·동전·구슬·나무 블록은 모양이 그대로인 고체예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v024",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 4
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 양의 물을 ㉠ 좁고 긴 병에 담은 뒤 ㉡ 넓은 대접과 ㉢ 둥근 어항에 차례로 옮겨 담았습니다. 이에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "㉠의 물을 ㉡으로 옮기면 물의 모양이 변합니다.",
      "㉡에 담긴 물의 높이는 ㉠에서보다 낮습니다.",
      "㉢으로 옮겨도 물의 부피는 처음과 같습니다.",
      "㉢의 물을 다시 ㉠으로 옮기면 처음 높이가 됩니다.",
      "㉡으로 옮기면 넓게 퍼져서 물의 부피가 늘어납니다."
    ],
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
    "explanation": "물은 액체라서 그릇에 따라 모양과 높이는 달라지지만 부피는 변하지 않아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v025",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 5
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "액체가 아닌 것을 고르세요.",
    "givens": null,
    "choices": [
      "꿀",
      "모래",
      "바닷물",
      "물엿",
      "주스"
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
    "explanation": "모래는 알갱이 하나하나의 모양과 부피가 일정한 고체예요. 꿀·바닷물·물엿·주스는 액체예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v026",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 6
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "빈칸에 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "뚜껑을 연 빈 페트병을 물이 담긴 수조 속에 비스듬히 눕혀 넣으면 페트병 입구에서 □(이)가 생겨 위로 올라옵니다. 이것으로 빈 페트병 안에도 공기가 있었다는 것을 알 수 있습니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "공기 방울",
      "accepted": [
        "공기 방울",
        "공기방울",
        "방울"
      ]
    },
    "explanation": "빈 페트병 안에 있던 공기가 물에 밀려 나오면서 공기 방울이 되어 위로 올라와요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v027",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 7
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 물체들 속에 공통적으로 들어 있는 물질에 대한 설명으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": {
      "지문": "▲물놀이 튜브 ▲비눗방울"
    },
    "choices": [
      "모양과 부피가 일정합니다.",
      "담긴 그릇을 가득 채웁니다.",
      "손으로 잡아 옮길 수 있습니다.",
      "눈으로 볼 수 없습니다.",
      "흔들면 출렁거리며 흐릅니다."
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        3
      ]
    },
    "explanation": "튜브와 비눗방울 속에 든 물질은 공기예요. 공기는 기체라서 눈에 보이지 않고, 담긴 그릇을 가득 채워 모양과 부피가 변해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v028",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 8
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 물체들에 공통적으로 이용된 공기의 성질로 알맞은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "자동차 에어백, 공기 주입식 구명조끼, 에어 쿠션 포장재",
      "보기": [
        "ㄱ. 공기는 다른 곳으로 이동합니다.",
        "ㄴ. 공기는 무게가 있습니다.",
        "ㄷ. 공기는 공간을 차지합니다.",
        "ㄹ. 공기는 색깔이 없습니다."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ",
        "공기는 공간을 차지합니다."
      ]
    },
    "explanation": "에어백·구명조끼·에어 쿠션 포장재는 안에 공기를 채워 부풀리는 물건으로, 공기가 공간을 차지하는 성질을 이용해요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v029",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 9
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 고체, 액체, 기체 중 어떤 물질의 상태에 대한 설명인지 쓰세요.",
    "givens": {
      "지문": "• 눈에 보이지 않고 손으로 잡을 수 없습니다.\n• 풍선에 넣으면 풍선 모양대로, 공에 넣으면 공 모양대로 퍼져 그 안을 가득 채웁니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "기체",
      "accepted": [
        "기체"
      ]
    },
    "explanation": "기체는 눈에 보이지 않고, 담는 그릇에 따라 모양과 부피가 변하며 그릇을 가득 채워요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v030",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 10
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E1",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "바람이 빠진 공의 무게를 잰 뒤, 공기 주입기로 공기를 20번 넣고 다시 무게를 재었더니 420 g에서 425 g이 되었습니다. 이에 대한 설명으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "공기를 넣은 뒤 공의 무게가 늘어났습니다.",
      "공기는 무게가 없으므로 무게 차이는 저울이 잘못 잰 것입니다.",
      "공기 주입기를 누르면 바깥의 공기가 공 안으로 들어갑니다.",
      "공기를 더 많이 넣을수록 공은 점점 가벼워집니다.",
      "공기를 넣기 전에는 공 안에 공기가 전혀 없었습니다."
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        2
      ]
    },
    "explanation": "공기 주입기로 바깥 공기를 공 안에 넣으면 들어간 공기의 무게만큼 공이 무거워져요. 공기도 무게가 있기 때문이에요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v031",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 11
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "노래를 부르면서 목에 손을 살며시 대 보았을 때 느낄 수 있는 것으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "손에 떨림이 느껴집니다.",
      "목이 점점 차가워집니다.",
      "소리가 점점 높아집니다.",
      "목에서 아무 느낌이 없습니다.",
      "손이 목 쪽으로 끌려갑니다."
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "소리를 낼 때는 목이 떨리기 때문에 손을 대면 떨림이 느껴져요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v032",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 12
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "소리가 나는 트라이앵글에서 소리가 나지 않게 하는 방법으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 트라이앵글을 다시 세게 칩니다.",
        "ㄴ. 트라이앵글을 높이 들어 올립니다.",
        "ㄷ. 트라이앵글을 손으로 꽉 잡습니다."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ",
        "트라이앵글을 손으로 꽉 잡습니다."
      ]
    },
    "explanation": "트라이앵글을 손으로 꽉 잡으면 떨림이 멈추어 소리도 멈춰요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v033",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 13
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "큰북 위에 작은 스타이로폼 공을 올려놓고 북채로 쳤습니다. 이에 대한 설명으로 옳은 것을 <보기>에서 모두 골라 짝 지은 것은?",
    "givens": {
      "보기": [
        "ㄱ. 북을 세게 칠수록 공이 높이 튀어 오릅니다.",
        "ㄴ. 북을 약하게 치면 북이 크게 떨려 큰 소리가 납니다.",
        "ㄷ. 북의 떨림이 공에 전달되어 공이 튀어 오릅니다."
      ]
    },
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ"
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
    "explanation": "북을 세게 칠수록 북이 크게 떨려 공이 높이 튀고 큰 소리가 나요. 약하게 치면 북이 작게 떨려 작은 소리가 나요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v034",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 14
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "소리의 높낮이에 대한 설명으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "소리의 크고 작은 정도를 말합니다.",
      "물체가 빠르게 떨리면 높은 소리가 납니다.",
      "물체가 크게 떨리면 높은 소리가 납니다.",
      "실로폰은 높낮이가 다른 소리를 내며 연주합니다.",
      "구급차 사이렌은 주로 낮은 소리를 이용합니다."
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        3
      ]
    },
    "explanation": "소리의 높낮이는 소리의 높고 낮은 정도로, 물체가 빠르게 떨리면 높은 소리가 나요. 크고 작은 정도는 소리의 세기예요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v035",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 15
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "실로폰에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "채로 음판을 두드려서 소리를 내는 악기입니다.",
      "짧은 음판을 치면 높은 소리가 납니다.",
      "긴 음판을 치면 낮은 소리가 납니다.",
      "음판을 세게 칠수록 더 큰 소리가 납니다.",
      "음판을 세게 칠수록 더 높은 소리가 납니다."
    ],
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
    "explanation": "실로폰은 음판의 길이에 따라 높낮이가 달라지고, 치는 세기에 따라 소리의 세기가 달라져요. 세게 친다고 소리가 높아지지는 않아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v036",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 16
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "소리의 전달에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "물속에 있는 잠수부도 배의 엔진 소리를 들을 수 있습니다.",
      "소리는 기체인 공기를 통해서만 귀까지 전달됩니다.",
      "나무 책상은 고체라서 두드리는 소리를 전달하지 못합니다.",
      "공기가 없는 우주에서도 큰 소리로 말하면 잘 들립니다.",
      "물속에서는 물 밖이나 물속의 소리가 전혀 들리지 않습니다."
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "소리는 고체·액체·기체를 통해 전달되므로 물속에서도 소리를 들을 수 있어요. 공기가 없는 우주에서는 소리가 전달되지 않아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v037",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 17
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "액체를 통해 소리가 전달되는 경우를 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 실 전화기로 친구와 이야기할 때",
        "ㄴ. 교실에서 친구의 목소리를 들을 때",
        "ㄷ. 물속에서 잠수부가 쇠막대를 두드리는 소리를 들을 때",
        "ㄹ. 땅에 귀를 대고 멀리서 오는 발소리를 들을 때"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ"
      ]
    },
    "explanation": "물속에서 듣는 소리는 액체인 물을 통해 전달돼요. 실 전화기와 땅은 고체, 교실의 목소리는 기체인 공기를 통해 전달돼요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v038",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 18
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "실 전화기로 소리를 주고받을 때 소리가 들리지 않게 되는 경우를 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 실을 팽팽하게 당길 때",
        "ㄴ. 말하는 동안 실의 가운데를 손가락으로 꽉 잡을 때",
        "ㄷ. 종이컵에 입을 가까이 대고 말할 때"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "실 전화기는 실의 떨림으로 소리를 전해요. 실을 꽉 잡으면 떨림이 멈추어 소리가 전달되지 않아요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v039",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 19
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "소리의 반사와 관련이 가장 적은 것을 고르세요.",
    "givens": null,
    "choices": [
      "골짜기에서 소리치면 잠시 뒤 메아리가 들립니다.",
      "귀를 손으로 막으면 바깥 소리가 작게 들립니다.",
      "터널 안에서 말하면 소리가 울려 퍼집니다.",
      "공연장 천장에 반사판을 달아 소리를 골고루 보냅니다.",
      "텅 빈 방에서 손뼉을 치면 소리가 울립니다."
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
    "explanation": "귀를 막으면 소리가 귀로 전달되는 것이 줄어드는 것이고, 나머지는 소리가 물체에 부딪쳐 되돌아오는 반사와 관련 있어요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-fin-v040",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 20
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "fin",
      "area": "종합",
      "element": "E2",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "공사장에서 생기는 소음을 줄이는 방법으로 옳은 것을 <보기>에서 모두 골라 짝 지은 것은?",
    "givens": {
      "보기": [
        "ㄱ. 공사장 둘레에 방음벽을 세웁니다.",
        "ㄴ. 소리가 큰 기계는 사람들이 쉬는 밤에 사용합니다.",
        "ㄷ. 소리가 작은 기계로 바꾸어 사용합니다."
      ]
    },
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ"
    ],
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
    "explanation": "방음벽은 소음을 반사시켜 막아 주고, 소리가 작은 기계를 쓰면 소리의 세기가 줄어요. 사람들이 쉬는 밤에 큰 기계를 쓰면 소음 피해가 더 커져요.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  }
];
