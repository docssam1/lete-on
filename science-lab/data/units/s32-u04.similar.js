// 3-2 Ⅳ 물질의 상태 — 유사문항 70 (창작). 원문 1문항당 1개, 같은 유형·난이도로 상황과 물체를 바꿨다. of = 짝이 되는 원문 (세트, 번호).
export const similar = [
  {
    "id": "s32-u04-v001",
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
      "unit": "u04",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "관찰 기록에서 다른 그릇으로 옮겨도 모양을 유지한 것을 골라 기호를 쓰세요.",
    "givens": {
      "표": {
        "머리": [
          "이름표",
          "옮긴 뒤 관찰"
        ],
        "행": [
          [
            "ㄱ 우유",
            "그릇에 맞춰 모양이 달라짐"
          ],
          [
            "ㄴ 숟가락",
            "원래 모양을 유지함"
          ],
          [
            "ㄷ 공기",
            "닫힌 용기 전체에 퍼짐"
          ]
        ]
      }
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ",
        "숟가락"
      ]
    },
    "explanation": "원래 모양을 유지했다고 기록한 것은 숟가락이에요. 손으로 옮긴 느낌만으로 모든 물질을 판단하지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v002",
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
      "unit": "u04",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "유리구슬과 우유의 관찰 기록에서 공통으로 확인한 성질은 무엇인가요?",
    "givens": {
      "기록": [
        "유리구슬: 눈으로 보임, 손으로 잡힘, 옮겨도 둥근 모양 유지",
        "우유: 눈으로 보임, 손가락 사이로 흐름, 그릇에 맞게 모양 변화"
      ]
    },
    "choices": [
      "눈으로 모습을 볼 수 있었다.",
      "둘 다 손으로 잡아 옮겨졌다.",
      "둘 다 흔들었더니 출렁거렸다.",
      "옮긴 뒤 원래 모양을 유지했다.",
      "그릇을 따라 모양이 달라졌다."
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
    "explanation": "두 기록에 모두 적힌 것은 눈으로 보인다는 점이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v003",
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
      "unit": "u04",
      "area": "물질",
      "element": "E2",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 지우개를 다른 그릇으로 옮긴 기록을 바르게 설명한 것은 무엇인가요?",
    "givens": {
      "기록": [
        "접시·둥근 컵·네모 상자에서 지우개의 길이와 두께가 같았어요.",
        "지우개를 누르거나 자르지 않았어요."
      ]
    },
    "choices": [
      "큰 그릇에 담을수록 지우개 부피가 더 커진다.",
      "그릇을 옮기면 지우개가 공간을 차지하지 않는다.",
      "둥근 컵에 담으면 지우개도 둥글게 바뀐다.",
      "네모 상자에 담아야만 지우개 모양이 유지된다.",
      "담는 그릇이 바뀌어도 지우개 모습은 그대로다."
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
    "explanation": "누르거나 자르지 않고 그릇만 바꾼 조건에서 고체 지우개의 모양과 부피는 그대로예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v004",
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
      "unit": "u04",
      "area": "물질",
      "element": "E2",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "고체에 대한 설명으로 옳은 것을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "흔들면 출렁거리며 흘러내립니다.",
      "손으로 잡을 수 있습니다.",
      "눈에 보이지 않아 있는지 알기 어렵습니다.",
      "담는 그릇에 따라 부피가 달라집니다.",
      "담는 그릇이 바뀌어도 모양이 그대로입니다."
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
    "explanation": "고체는 눈에 보이고 손으로 잡을 수 있으며, 담는 그릇이 바뀌어도 모양과 부피가 그대로예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v005",
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
      "unit": "u04",
      "area": "물질",
      "element": "E3",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "모형 기록으로 뒷받침할 수 없는 설명을 골라 기호를 쓰세요.",
    "givens": {
      "기록": [
        "우유를 흘리지 않고 좁은 컵과 넓은 그릇으로 옮겼어요.",
        "처음 눈금컵에 다시 넣었더니 처음 표시선과 같았어요."
      ],
      "보기": [
        "ㄱ. 우유의 모양은 그릇에 맞게 달라진다.",
        "ㄴ. 처음 눈금컵에 다시 넣으면 처음 높이와 같다.",
        "ㄷ. 좁은 컵에 넣으면 우유의 부피가 늘어난다."
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
    "explanation": "높이가 달라 보이는 것과 우유의 양이 달라진 것은 달라요. 다시 같은 컵에 넣어 비교한 기록이 부피 보존의 근거예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v006",
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
      "unit": "u04",
      "area": "물질",
      "element": "E3",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "액체 상태의 물질을 <보기>에서 모두 골라 바르게 짝 지은 것은?",
    "givens": {
      "보기": [
        "ㄱ. 간장",
        "ㄴ. 물엿",
        "ㄷ. 설탕"
      ]
    },
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ, ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ"
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
    "explanation": "간장과 물엿은 담는 그릇에 따라 모양이 바뀌고 부피는 그대로인 액체예요. 물엿은 끈끈해도 액체이고, 설탕은 알갱이 하나하나의 모양이 변하지 않는 고체예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v007",
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
      "unit": "u04",
      "area": "물질",
      "element": "E4",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "마른 깨끗한 스펀지를 물속에서 눌렀어요. 기록에 근거하지 않은 설명을 골라 기호를 쓰세요.",
    "givens": {
      "관찰": [
        "공기 방울이 나와 물 위로 올라갔어요.",
        "수조 물의 색은 처음과 같았어요."
      ],
      "보기": [
        "ㄱ. 스펀지 안에 있던 공기가 물속으로 나왔다.",
        "ㄴ. 나온 공기 방울은 물 위로 올라갔다.",
        "ㄷ. 스펀지에서 흙물이 나와 물색이 달라졌다."
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
    "explanation": "보지 않은 색 변화는 관찰 사실로 적지 않아요. 공기 방울로 스펀지 안 공기의 존재를 확인해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v008",
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
      "unit": "u04",
      "area": "물질",
      "element": "E4",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "튜브 안에 공기가 들어 있음을 확인할 추가 관찰로 알맞은 것은 무엇인가요?",
    "givens": {
      "상황": "펌프로 부풀린 튜브를 살펴보고 있어요."
    },
    "choices": [
      "튜브 겉면에 인쇄된 무늬의 색을 기록한다.",
      "입구를 닫은 튜브의 고무 냄새만 비교한다.",
      "튜브를 보지 않고 공기 양을 짐작해 적는다.",
      "입구를 조금 열 때 나오는 바람을 느낀다.",
      "튜브 옆에 놓은 공책의 두께를 재어 본다."
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
    "explanation": "부풀어 있는 모습과 입구로 나오는 바람은 공기가 들어 있다는 근거예요. 겉면 무늬나 고무 냄새는 그 근거가 아니에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v009",
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
      "unit": "u04",
      "area": "물질",
      "element": "E4",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 실험에서 바닥에 구멍이 뚫리지 않은 컵을 골라 기호를 쓰세요.",
    "givens": {
      "지문": "같은 크기의 투명한 플라스틱 컵 ㄱ과 ㄴ을 뒤집어, 물 위에 띄운 스타이로폼 조각을 각각 덮은 뒤 수조 바닥까지 밀어 넣었습니다. 두 컵 중 하나는 바닥에 구멍이 뚫려 있습니다.\n• ㄱ: 스타이로폼 조각이 처음과 같은 높이의 물 위에 그대로 떠 있었습니다.\n• ㄴ: 스타이로폼 조각이 컵과 함께 수조 바닥 쪽으로 내려갔습니다.",
      "조건": "같은 크기의 컵을 얕은 수조에서 기울이지 않고 천천히 내려요. 구멍은 막히지 않았어요."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ",
        "ㄴ 컵"
      ]
    },
    "explanation": "구멍이 없는 컵은 안의 공기가 빠져나가지 못하고 공간을 차지해서 물과 스타이로폼 조각을 아래로 밀어 내려요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v010",
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
      "unit": "u04",
      "area": "물질",
      "element": "E4",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 실험에서 컵을 수조 바닥까지 밀어 넣었을 때, 컵 ㄱ과 ㄴ의 안을 가장 많이 채우고 있는 것을 각각 쓰세요.",
    "givens": {
      "지문": "같은 크기의 투명한 플라스틱 컵 ㄱ과 ㄴ을 뒤집어, 물 위에 띄운 스타이로폼 조각을 각각 덮은 뒤 수조 바닥까지 밀어 넣었습니다. 두 컵 중 하나는 바닥에 구멍이 뚫려 있습니다.\n• ㄱ: 스타이로폼 조각이 처음과 같은 높이의 물 위에 그대로 떠 있었습니다.\n• ㄴ: 스타이로폼 조각이 컵과 함께 수조 바닥 쪽으로 내려갔습니다.",
      "답란": "ㄱ-(    ), ㄴ-(    )",
      "조건": "같은 크기의 컵을 얕은 수조에서 기울이지 않고 천천히 내려요. 구멍은 막히지 않았어요."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ-물, ㄴ-공기",
      "accepted": [
        "ㄱ-물, ㄴ-공기",
        "ㄱ 물, ㄴ 공기",
        "ㄱ-물,ㄴ-공기",
        "물, 공기",
        "물 공기",
        "물,공기"
      ]
    },
    "explanation": "구멍이 뚫린 ㄱ 컵은 공기가 구멍으로 빠져나가 물이 들어오고, 구멍이 없는 ㄴ 컵은 공기가 빠져나가지 못해 공기로 차 있어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v011",
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
      "unit": "u04",
      "area": "물질",
      "element": "E5",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "비닐관 한쪽 끝에 주사기를, 다른 쪽 끝에 바람을 뺀 작은 고무풍선을 끼웠습니다. 주사기의 피스톤을 밀었을 때의 변화로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 풍선이 부풀어 오릅니다.",
        "ㄴ. 풍선이 더 쪼그라듭니다.",
        "ㄷ. 비닐관 속 공기가 사라져 아무 변화가 없습니다.",
        "ㄹ. 풍선 속 공기가 주사기 안으로 끌려 들어옵니다."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ",
        "풍선이 부풀어 오릅니다."
      ]
    },
    "explanation": "피스톤을 밀면 주사기 속 공기가 비닐관을 따라 이동해 풍선 안으로 들어가서 풍선이 부풀어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v012",
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
      "unit": "u04",
      "area": "물질",
      "element": "E5",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "공기가 다른 곳으로 이동하는 성질을 이용한 예로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 공기베개",
        "ㄴ. 헤어드라이어",
        "ㄷ. 물놀이 튜브",
        "ㄹ. 에어 매트"
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
        "ㄴ",
        "헤어드라이어"
      ]
    },
    "explanation": "헤어드라이어는 공기를 이동시켜 바람을 보내요. 공기베개·물놀이 튜브·에어 매트는 공기가 공간을 차지하는 성질을 이용한 예예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v013",
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
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "공기에도 무게가 있다는 근거가 되는 기록을 모두 고른 것은 무엇인가요?",
    "givens": {
      "가상 기록": [
        "ㄱ. 같은 단단한 병과 마개: 공기 추가 전 51.2 g, 추가 후 51.8 g",
        "ㄴ. 같은 단단한 병과 마개: 공기를 조금 뺀 뒤 무게가 줄었음",
        "ㄷ. 창문 밖 나뭇잎이 바람에 흔들림"
      ],
      "조건": "같은 저울·병·마개를 사용했고 다른 물질은 넣거나 빼지 않았어요."
    },
    "choices": [
      "ㄱ",
      "ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ",
      "ㄱ, ㄴ"
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
    "explanation": "공기 양에 따라 같은 병의 무게가 달라진 두 기록이 근거예요. 나뭇잎의 움직임만으로 무게를 확인하지는 못해요. 수치는 모형 값이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v014",
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
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "공기를 더 넣은 단단한 병의 기록을 잘못 설명한 것은 무엇인가요?",
    "givens": {
      "가상 기록": "같은 병·마개를 같은 저울로 잰 값이 60.1 g에서 60.7 g으로 늘었어요. 다른 물질은 넣지 않았어요."
    },
    "choices": [
      "다른 물질은 더 넣지 않았다는 조건을 확인한다.",
      "보이지 않는 공기는 무게에 영향을 줄 수 없다.",
      "공기를 넣기 전과 넣은 뒤의 값을 서로 비교한다.",
      "공기를 더 넣은 뒤 저울 표시값이 더 커졌다.",
      "늘어난 공기 양과 무게 변화의 관련을 살핀다."
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
    "explanation": "보이지 않는다고 무게가 없는 것은 아니에요. 같은 병·마개·저울의 전후 기록으로 비교해요. 수치는 모형 값이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v015",
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
      "unit": "u04",
      "area": "물질",
      "element": "E5",
      "type": "T09",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "풍선의 빨대 끝을 자동차 뒤쪽으로 향하게 붙였어요. 풍선에 공기를 넣고 입구를 놓자 자동차가 앞으로 굴렀어요. 풍선 속 공기가 어떻게 되어 자동차가 움직였는지 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "풍선 속 공기가 이동하여 빨대 끝으로 빠져나오기 때문에 자동차가 앞으로 나아갑니다.",
      "rubric": {
        "required": [
          "풍선 속 공기가 밖으로 빠져나오며 자동차가 움직임을 설명함"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "뒤쪽 입구로 공기가 빠져나오면서 자동차는 앞으로 움직여요. 바퀴가 둥글다는 것만으로 저절로 움직인 까닭을 설명하지 못해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v016",
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
      "unit": "u04",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "관찰한 유리구슬의 기록에 없는 성질을 쓴 것은 무엇인가요?",
    "givens": {
      "관찰": "구슬은 둥글고 손으로 잡혔어요. 투명한 컵에 넣어도 원래 모습이었어요."
    },
    "choices": [
      "손으로 잡아 다른 그릇에 옮길 수 있다.",
      "둥근 모양을 눈으로 확인할 수 있다.",
      "손에 쥐면 손가락 사이로 흘러내린다.",
      "컵에 넣은 뒤에도 구슬 모양을 유지한다.",
      "관찰할 때 구슬은 공간을 차지하고 있다."
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
    "explanation": "액체처럼 흘러내렸다는 기록은 없어요. 관찰한 유리구슬의 특징으로 판단해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v017",
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
      "unit": "u04",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "이 기록을 잘못 옮긴 문장은 무엇인가요?",
    "givens": {
      "기록": [
        "돌멩이는 손으로 잡아 옮김.",
        "우유는 손가락 사이로 흘러내림.",
        "공기는 맨손으로 잡아 건넸는지 확인하기 어려움."
      ]
    },
    "choices": [
      "우유를 꼭 쥐면 처음 모양을 유지하며 건네진다.",
      "우유는 손가락 사이로 흘러 전달하기 어렵다.",
      "돌멩이는 손으로 잡아 친구에게 옮겨 줄 수 있다.",
      "공기는 맨손으로 건넸는지 확인하기 어렵다.",
      "세 물질은 손으로 전달할 때 관찰이 달랐다."
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
    "explanation": "우유는 액체라서 손가락 사이로 흘러요. 눈에 보이지 않는다는 것이 공기가 없다는 뜻은 아니에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v018",
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
      "unit": "u04",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "돌멩이와 공기의 특징을 바르게 비교한 것을 고르세요.",
    "givens": null,
    "choices": [
      "돌멩이와 공기는 모두 눈으로 볼 수 있습니다.",
      "돌멩이는 흘러내리고, 공기는 손으로 잡을 수 있습니다.",
      "돌멩이는 눈에 보이지 않고, 공기는 눈에 잘 보입니다.",
      "돌멩이는 손으로 잡을 수 있고, 공기는 잡을 수 없습니다.",
      "돌멩이는 그릇에 따라 모양이 변하고, 공기는 모양이 그대로입니다."
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
    "explanation": "돌멩이는 눈에 보이고 손으로 잡을 수 있어요. 공기는 보이지 않고 손으로 잡을 수도 없어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v019",
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
      "unit": "u04",
      "area": "물질",
      "element": "E2",
      "type": "T02",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 지우개에 대한 설명입니다. 설명이 잘못된 부분의 기호를 쓰고, 바르게 고쳐 쓰세요.",
    "givens": {
      "지문": "지우개는 ㉠눈으로 볼 수 있고 ㉡손으로 잡을 수 있습니다. 여러 가지 모양의 그릇에 넣었을 때 ㉢지우개의 모양은 그릇 모양에 따라 바뀌지만 ㉣부피는 변하지 않습니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "㉢, 지우개의 모양은 그릇이 바뀌어도 변하지 않습니다.",
      "rubric": {
        "required": [
          "잘못된 부분 ㉢을 찾아 모양은 변하지 않는다고 수정함"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "지우개는 고체라서 어떤 그릇에 넣어도 모양과 부피가 모두 그대로예요. 그래서 ㉢의 '모양이 바뀐다'가 잘못되었어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v020",
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
      "unit": "u04",
      "area": "물질",
      "element": "E3",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "제시한 세 물질 중 고체가 아닌 것을 찾아 설명한 것은 무엇인가요?",
    "givens": {
      "관찰": [
        "모래: 무더기 모양은 달라져도 알갱이 하나하나는 그대로",
        "고무줄: 힘을 주면 늘어나지만 그냥 옮겨 담으면 그대로",
        "식초: 그릇에 맞게 모양 변화, 흘리지 않으면 양은 그대로"
      ]
    },
    "choices": [
      "모래는 무더기가 흘러내리므로 액체에 속한다.",
      "고무줄은 늘어나기 때문에 기체에 속한다.",
      "식초는 눈에 보이기 때문에 고체에 속한다.",
      "고무줄은 손으로 잡히지 않는 액체에 속한다.",
      "식초는 그릇에 맞게 모양이 변하는 액체다."
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
    "explanation": "모래 알갱이와 고무줄은 고체예요. 고체도 힘을 주면 변형될 수 있어요. 그릇만 바꾸는 조건을 구별해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v021",
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
      "unit": "u04",
      "area": "물질",
      "element": "E3",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 기록에서 공통 성질로 묶을 수 없는 것은 무엇인가요?",
    "givens": {
      "관찰": [
        "우유: 흰색, 눈에 보임, 흐름, 그릇에 따라 모양 변화",
        "간장: 짙은 갈색, 눈에 보임, 흐름, 그릇에 따라 모양 변화",
        "둘 다 흘리지 않고 다시 눈금컵에 넣으면 처음 양과 같음"
      ]
    },
    "choices": [
      "두 액체는 그릇에 맞춰 모양이 바뀐다.",
      "두 액체는 눈으로 확인할 수 있다.",
      "두 액체는 흐르는 성질을 보인다.",
      "두 액체는 관찰한 색이 서로 같다.",
      "두 액체는 흘리지 않으면 양이 보존된다."
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
    "explanation": "두 액체의 색은 다르지만 제시된 나머지 성질은 공통이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v022",
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
      "unit": "u04",
      "area": "물질",
      "element": "E3",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "컵에 담긴 우유(㉠)를 빨대(㉡)로 마시고 있습니다. ㉠과 ㉡의 물질의 상태는 무엇인지 각각 쓰세요.",
    "givens": {
      "답란": "㉠-(      ), ㉡-(      )"
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-액체, ㉡-고체",
      "accepted": [
        "㉠-액체, ㉡-고체",
        "㉠ 액체, ㉡ 고체",
        "㉠-액체,㉡-고체",
        "액체, 고체",
        "액체 고체",
        "액체,고체"
      ]
    },
    "explanation": "우유는 그릇에 따라 모양이 바뀌는 액체이고, 빨대는 모양이 그대로인 고체예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v023",
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
      "unit": "u04",
      "area": "물질",
      "element": "E4",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "부풀린 풍선의 입구를 손등에 가까이 대고, 입구를 잡고 있던 손을 놓았을 때 나타나는 현상으로 옳은 것을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "손등이 물에 젖습니다.",
      "풍선이 점점 더 커집니다.",
      "손등에 바람이 느껴집니다.",
      "풍선의 크기가 점점 작아집니다.",
      "풍선 속에서 하얀 연기가 나옵니다."
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        2,
        3
      ]
    },
    "explanation": "풍선 속 공기가 입구로 빠져나오면서 손등에 바람이 느껴지고, 공기가 빠진 만큼 풍선이 작아져요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v024",
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
      "unit": "u04",
      "area": "물질",
      "element": "E4",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "에어 매트의 부풀어 오른 모습을 유지하는 데 이용한 공기의 성질을 골라 기호를 쓰세요.",
    "givens": {
      "기록": "바람을 넣고 입구를 닫자 매트가 부풀어 있었어요. 입구를 열어 공기를 빼자 납작해졌어요.",
      "보기": [
        "ㄱ. 공기는 아무 공간도 차지하지 않는다.",
        "ㄴ. 공기는 눈에 보이지 않으면 없어진다.",
        "ㄷ. 공기는 매트 안에서 공간을 차지한다.",
        "ㄹ. 공기는 고체처럼 정해진 모양을 가진다."
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
    "explanation": "매트 안 공간을 차지하던 공기가 빠지며 매트가 납작해져요. 눈에 보이는지와 존재 여부를 구별해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v025",
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
      "unit": "u04",
      "area": "물질",
      "element": "E5",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "두 주사기를 비닐관으로 연결하고, 오른쪽 주사기의 피스톤을 바깥쪽으로 빼 둔 채 그 끝에 스타이로폼 공을 붙였습니다. 왼쪽 주사기의 피스톤을 바깥쪽으로 당겼을 때의 결과로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 오른쪽 피스톤이 안쪽으로 끌려 들어가 스타이로폼 공이 주사기 쪽으로 움직입니다.",
        "ㄴ. 오른쪽 피스톤은 그대로 있고 스타이로폼 공도 움직이지 않습니다.",
        "ㄷ. 오른쪽 피스톤이 더 바깥쪽으로 밀려 나갑니다."
      ],
      "조건": "주사기와 비닐관 사이에 공기가 새지 않게 연결하고 피스톤을 천천히 움직여요."
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
    "explanation": "왼쪽 피스톤을 당기면 오른쪽 주사기 속 공기가 비닐관을 따라 왼쪽으로 이동해서, 오른쪽 피스톤과 스타이로폼 공이 안쪽으로 끌려 들어가요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v026",
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
      "unit": "u04",
      "area": "물질",
      "element": "E5",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "두 기록을 함께 설명하는 공기의 성질은 무엇인가요?",
    "givens": {
      "기록": [
        "부채질한 쪽으로 바람이 불며 바람개비가 돌아감",
        "펌프를 누르자 연결한 풍선 안으로 공기가 들어감"
      ]
    },
    "choices": [
      "공기는 다른 곳으로 이동할 수 있다.",
      "공기는 물체의 무게를 없앨 수 있다.",
      "공기는 언제나 한곳에만 머물러 있다.",
      "공기는 맨손으로 잡아 건넬 수 있다.",
      "공기는 용기와 관계없이 같은 모양이다."
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
    "explanation": "두 기록은 모두 공기가 한 곳에서 다른 곳으로 이동하는 모습이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v027",
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
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "고체, 액체, 기체 중 담는 그릇에 따라 모양과 부피가 모두 변하는 물질의 상태를 쓰세요.",
    "givens": null,
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
    "explanation": "기체는 담긴 그릇을 용기 안의 빈 공간에 고르게 퍼져 가득 채우기 때문에 그릇에 따라 모양과 부피가 모두 변해요. 액체는 모양만 변하고, 고체는 둘 다 그대로예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v028",
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
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 단단한 병 안의 공기 양만 늘려 무게를 비교할 방법은 무엇인가요?",
    "givens": {
      "조건": "병·공기 주입 마개·저울을 그대로 쓰고, 병이 변형되지 않는 사용 범위에서 비교해요."
    },
    "choices": [
      "공기를 빼고 무거운 다른 마개로 바꾸어 잰다.",
      "마개를 떼어 낸 뒤 병만 같은 저울로 잰다.",
      "다른 저울의 값과 처음 병의 값을 비교한다.",
      "물도 함께 넣고 공기 양만 달라졌다고 적는다.",
      "마개로 공기를 더 넣고 같은 저울로 다시 잰다."
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
    "explanation": "공기 양 외의 병·마개·저울은 같게 맞춰야 무게 변화의 까닭을 해석할 수 있어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v029",
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
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "아래 모형 기록으로 공기에 무엇이 있음을 알 수 있나요?",
    "givens": {
      "가상 기록": "같은 단단한 병·마개가 공기 추가 전 51.2 g, 추가 후 51.8 g이었어요. 다른 조건은 같았어요.",
      "답란": "공기에도 [    ]가 있어요."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "무게",
      "accepted": [
        "무게"
      ]
    },
    "explanation": "같은 병과 마개의 무게가 공기를 더 넣은 뒤 늘었으므로 공기에도 무게가 있음을 알 수 있어요. 수치는 모형 값이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v030",
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
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 종이컵 공기 대포 장난감입니다. 이 장난감에서 사용한 물질의 상태를 모두 골라 바르게 짝 지은 것은?",
    "givens": {
      "지문": "종이컵 바닥에 구멍을 뚫고 입구에 비닐을 씌워 고무줄로 묶었습니다. 비닐을 손가락으로 톡 치면 구멍으로 공기가 나가 앞에 세워 둔 종이 인형이 쓰러집니다."
    },
    "choices": [
      "고체",
      "기체",
      "고체, 액체",
      "고체, 액체, 기체",
      "고체, 기체"
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
    "explanation": "종이컵·비닐·고무줄은 고체이고, 구멍으로 나가 종이 인형을 쓰러뜨리는 것은 기체인 공기예요. 물 같은 액체는 쓰지 않았어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v031",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 1
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "관찰 기록이 가리키는 것을 유리구슬·간장·공기 중에서 골라 쓰세요.",
    "givens": {
      "관찰": "눈에 보이고, 흘리지 않고 다른 그릇에 옮기면 모양이 그릇에 맞춰 달라져요. 처음 눈금컵으로 다시 옮기면 처음 양과 같아요."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "간장",
      "accepted": [
        "간장"
      ]
    },
    "explanation": "그릇에 따라 모양은 달라지지만 양이 유지되는 액체의 기록이므로 간장이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v032",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 2
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "손으로 여러 가지 물체를 친구에게 전달할 때, 눈에 보이고 만질 수는 있지만 손가락 사이로 흘러내려 전달하기 어려운 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 공기",
        "ㄴ. 연필",
        "ㄷ. 주스"
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
        "주스"
      ]
    },
    "explanation": "주스는 액체라서 눈에 보이고 만질 수 있지만 흘러내려 전달하기 어려워요. 연필은 쉽게 전달되고, 공기는 보이지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v033",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 3
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "주스·연필·공기를 나눈 기록으로 뒷받침되는 설명을 골라 기호를 쓰세요.",
    "givens": {
      "기록": [
        "연필: 손으로 잡힘, 그릇만 바꾸면 원래 모양 유지",
        "주스: 눈에 보임, 흐름, 그릇에 맞게 모양 변화",
        "공기: 맨손으로 잡히지 않음, 닫힌 용기를 채움"
      ],
      "보기": [
        "ㄱ. 주스는 눈에 보이지만 손가락 사이로 흐른다.",
        "ㄴ. 공기는 맨손으로 잡아 건넬 수 있다.",
        "ㄷ. 연필과 주스는 모두 원래 모양 그대로 옮겨진다."
      ]
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
    "explanation": "눈으로 보이는지와 손으로 잡히는지는 서로 다른 관찰 기준이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v034",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 4
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E2",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "그릇만 바꾼 같은 주사위의 기록으로 예상한 것이 알맞은 것은 무엇인가요?",
    "givens": {
      "기록": "접시·컵·상자에 넣어도 주사위 모양과 크기가 같았어요. 같은 조건으로 쇠못도 옮겨 담으려 해요."
    },
    "choices": [
      "쇠못도 그릇만 바꾸면 모양과 부피를 유지한다.",
      "쇠못은 큰 상자에 담을수록 부피가 더 늘어난다.",
      "쇠못은 주사위와 달리 공간을 차지하지 않는다.",
      "쇠못은 네모 상자에 담을 때만 모양을 유지한다.",
      "쇠못은 둥근 컵에 담으면 컵을 따라 구부러진다."
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
    "explanation": "주사위와 쇠못은 고체예요. 누르거나 구부리지 않고 그릇만 바꾸는 조건에서 비교해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v035",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 5
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E2",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "관찰한 고체의 기록을 잘못 설명한 것을 골라 기호를 쓰세요.",
    "givens": {
      "관찰": "지우개를 자르거나 누르지 않고 그릇만 바꾸었어요. 지우개는 그대로였어요.",
      "보기": [
        "ㄱ. 손으로 잡아 옮길 수 있다.",
        "ㄴ. 그릇만 바꾸면 모양을 유지한다.",
        "ㄷ. 그릇이 커지면 지우개 부피도 늘어난다."
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
    "explanation": "고체의 부피는 담는 그릇의 크기 때문에 늘어나지 않아요. 모든 고체가 딱딱하다고 단정하지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v036",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 6
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E3",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물질의 상태가 나머지와 다른 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 식초",
        "ㄴ. 우유",
        "ㄷ. 설탕",
        "ㄹ. 꿀",
        "ㅁ. 간장"
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
        "설탕"
      ]
    },
    "explanation": "식초·우유·꿀·간장은 액체이고, 설탕은 알갱이 하나하나의 모양이 변하지 않는 고체예요. 꿀은 끈끈해도 액체예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v037",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 7
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E3",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "가상 관찰 기록으로 직접 확인할 수 있는 것은 무엇인가요?",
    "givens": {
      "기록": "같은 우유를 둥근 컵·손잡이 컵·길쭉한 병으로 옮기며 모양을 그렸더니 각 그릇에 맞게 달랐어요."
    },
    "choices": [
      "우유는 어느 그릇에서나 처음 모양이었다.",
      "우유는 넓은 그릇에 담을 때만 달라졌다.",
      "우유 색은 그릇을 바꿀 때마다 달라졌다.",
      "우유 모양은 담는 그릇에 따라 달라졌다.",
      "우유 양이 늘어난 것을 그림만으로 확인했다."
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
    "explanation": "이 기록은 모양 변화를 직접 보여 줘요. 부피까지 확인하려면 같은 눈금컵으로 다시 옮기는 등 비교가 필요해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v038",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 8
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E3",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "흘리지 않고 옮긴 우유를 처음 컵에 다시 넣으면 높이가 어떻게 될지 골라 기호를 쓰세요.",
    "givens": {
      "조건": "증발할 만큼 오래 두지 않았고, 다른 우유를 더 넣거나 덜어 내지 않았어요.",
      "보기": [
        "ㄱ. 처음 선보다 높다.",
        "ㄴ. 처음 선보다 낮다.",
        "ㄷ. 처음 선과 같다."
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
    "explanation": "같은 양을 같은 컵으로 되돌렸으므로 처음 높이와 같아요. 다른 모양의 그릇끼리 높이만 비교하지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v039",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 9
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E4",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "컵을 기울인 뒤의 관찰로 알맞은 설명은 무엇인가요?",
    "givens": {
      "관찰": "입구가 아래인 빈 컵을 물속에 넣고 기울이자 컵 입구에서 방울이 나와 위로 올라갔어요."
    },
    "choices": [
      "컵 속 공기가 방울이 되어 밖으로 나왔다.",
      "컵 밖 공기가 방울로 컵 안에 빨려 들어갔다.",
      "컵 속 물이 방울이 되어 바닥으로 내려갔다.",
      "공기가 빠지자 컵의 재료 자체가 작아졌다.",
      "컵의 기울기만으로 수조 물이 차가워졌다."
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
    "explanation": "컵 속에 있던 공기가 밖으로 나와 방울로 보인 것이에요. 실제 기록에 없는 크기·온도 변화는 단정하지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v040",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 10
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E5",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 무엇에 의한 현상인지 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "• 부채질을 하면 시원합니다.\n• 바람이 불면 연이 하늘 높이 날아오릅니다.\n• 널어 둔 빨래가 바람에 펄럭입니다.",
      "보기": [
        "ㄱ. 공기는 다른 곳으로 이동할 수 있습니다.",
        "ㄴ. 공기는 냄새가 나지 않습니다.",
        "ㄷ. 공기는 담긴 그릇을 가득 채웁니다."
      ]
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
    "explanation": "부채질로 생긴 바람, 연을 날리는 바람, 빨래를 펄럭이게 하는 바람은 모두 공기가 이동하는 것이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v041",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 11
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E4",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음의 여러 가지 물체 안에 공통으로 들어 있는 물질을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "에어 매트, 공기베개, 풍선 놀이 틀, 자전거 타이어",
      "보기": [
        "ㄱ. 물",
        "ㄴ. 공기",
        "ㄷ. 모래",
        "ㄹ. 스펀지"
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
        "ㄴ",
        "공기"
      ]
    },
    "explanation": "에어 매트·공기베개·풍선 놀이 틀·자전거 타이어는 모두 안에 공기를 넣어 부풀린 것이에요. 공기가 공간을 차지하는 성질을 이용해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v042",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 12
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E4",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "구멍 없는 컵과 구멍 있는 컵을 비교한 기록을 바르게 설명한 것은 무엇인가요?",
    "givens": {
      "조건": "얕은 수조에서 같은 크기의 컵을 뒤집어 물 위의 조각을 덮고 천천히 내려요. 구멍은 충분히 열려 있어요.",
      "관찰": [
        "구멍 없는 컵: 조각이 컵 안에서 아래로 내려감",
        "구멍 있는 컵: 공기가 구멍으로 나가고 조각은 물 표면에 머묾"
      ]
    },
    "choices": [
      "구멍 있는 컵 안에 공기가 그대로 갇혀 있다.",
      "구멍 없는 컵은 공기가 구멍으로 빠져나간다.",
      "구멍 있는 컵은 공기가 나가며 물이 들어온다.",
      "두 컵 안 공기는 물을 만나 모두 사라진다.",
      "두 컵의 재료가 물에 녹아 조각이 움직인다."
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
    "explanation": "구멍 유무로 공기가 나갈 수 있는지가 달라요. 컵 벽 자체의 부피가 있어 수조 물 높이가 정확히 같다고 단정하지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v043",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 13
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E4",
      "type": "T06",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "얕은 수조에 넣을 투명한 컵의 안쪽 바닥에 마른 휴지를 붙였어요. 구멍 없는 컵을 입구가 아래로 향하게 똑바로 눌러 넣었다가 기울이지 않고 똑바로 꺼냈어요. 휴지의 상태와 그 까닭을 함께 쓰세요.",
    "givens": {
      "조건": "컵 안에 공기가 갇혀 있고, 물이 휴지에 닿을 만큼 깊게 잠그지 않았어요."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "휴지가 젖지 않습니다. 컵 안의 공기가 빠져나가지 못하고 공간을 차지하고 있어 물이 컵 안으로 들어오지 못하기 때문입니다.",
      "rubric": {
        "required": [
          "휴지가 젖지 않은 결과를 컵 속 공기가 공간을 차지한 까닭과 연결함"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "구멍이 없는 컵 안의 공기는 빠져나갈 곳이 없어 공간을 차지하고 있어요. 그래서 물이 컵 안으로 들어오지 못해 휴지가 젖지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v044",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 14
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E5",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "주사기와 납작한 비닐봉지를 비닐관으로 연결하고, 비닐봉지 위에 장난감 블록을 올려놓았습니다. 주사기의 피스톤을 밀었다가 다시 당길 때 블록의 변화를 쓰세요.",
    "givens": {
      "조건": "공기가 새지 않게 연결했으며 비닐봉지와 블록을 천천히 움직여요."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "피스톤을 밀면 비닐봉지가 부풀면서 블록이 위로 올라가고, 피스톤을 당기면 비닐봉지가 다시 납작해지면서 블록이 아래로 내려옵니다.",
      "rubric": {
        "required": [
          "밀 때 블록이 올라갔다가 당길 때 다시 내려오는 왕복 변화를 설명함"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "피스톤을 밀면 주사기 속 공기가 비닐봉지로 이동해 봉지가 부풀면서 블록을 들어 올려요. 당기면 공기가 주사기로 돌아와 블록이 내려와요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v045",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 15
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E5",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "공기의 이동을 확인한 기록이 아닌 것은 무엇인가요?",
    "givens": {
      "가상 관찰": [
        "부채질하자 바람개비가 돌았어요.",
        "펌프를 누르자 풍선 안으로 공기가 들어갔어요.",
        "물감을 물에 풀어 색깔 물을 만들었어요.",
        "공기 공급 장치 끝에서 물속에 방울이 나왔어요."
      ]
    },
    "choices": [
      "부채질한 방향으로 바람개비가 돈 기록",
      "물감을 물에 풀어 색깔이 달라진 기록",
      "장치 끝에서 공기 방울이 나온 기록",
      "펌프에서 풍선 안으로 공기를 보낸 기록",
      "입구를 놓자 풍선에서 바람이 나온 기록"
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
    "explanation": "물감을 섞어 색이 달라진 기록은 공기의 이동을 확인한 근거가 아니에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v046",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 16
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 고체, 액체, 기체 중 무엇에 대한 설명인지 쓰세요.",
    "givens": {
      "지문": "• 눈으로 볼 수 있습니다.\n• 흐르는 성질이 있어 손으로 잡기 어렵습니다.\n• 담는 그릇에 따라 모양은 변하지만 부피는 변하지 않습니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "액체",
      "accepted": [
        "액체"
      ]
    },
    "explanation": "눈에 보이고 흐르며, 그릇에 따라 모양은 바뀌지만 부피는 그대로인 것은 액체예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v047",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 17
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "가상 무게 기록에서 공기를 넣기 전 값을 골라 기호를 쓰세요.",
    "givens": {
      "표": {
        "머리": [
          "이름표",
          "같은 단단한 병·마개의 무게"
        ],
        "행": [
          [
            "ㄱ",
            "51.2 g"
          ],
          [
            "ㄴ",
            "51.8 g"
          ]
        ]
      },
      "조건": "같은 저울로 쟀고, 병과 마개를 바꾸지 않은 채 공기만 더 넣었어요."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ",
        "51.2",
        "51.2 g",
        "51.2g"
      ]
    },
    "explanation": "추가한 공기에도 무게가 있으므로 넣기 전의 작은 값 51.2 g이 ㄱ이에요. 수치는 모형 값이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v048",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 18
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "가상 무게 기록을 설명하는 말을 골라 각각 쓰세요.",
    "givens": {
      "가상 기록": "같은 단단한 병과 마개의 무게가 공기 추가 전 51.2 g, 후 51.8 g이었어요. 다른 조건은 같았어요.",
      "답란": "무게는 ㉠(늘어납니다, 줄어듭니다). 더 넣은 공기는 ㉡(고체, 기체) 상태예요."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-늘어납니다, ㉡-기체",
      "accepted": [
        "㉠-늘어납니다, ㉡-기체",
        "늘어납니다 기체",
        "늘어납니다, 기체",
        "늘어난다, 기체"
      ]
    },
    "explanation": "같은 병에 공기를 더 넣은 뒤 표시값이 늘었어요. 공기는 기체이며 수치는 모형 값이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v049",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 19
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "실험 기록에 어긋나는 설명을 골라 기호를 쓰세요.",
    "givens": {
      "가상 기록": "같은 단단한 병과 마개에 공기만 더 넣고 같은 저울로 재니 표시값이 늘었어요.",
      "보기": [
        "ㄱ. 넣기 전과 후의 같은 병을 비교해야 한다.",
        "ㄴ. 보이지 않는 공기는 무게가 전혀 없다.",
        "ㄷ. 더 넣은 공기가 무게 증가와 관련된다."
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
    "explanation": "공기는 보이지 않아도 무게가 있어요. 보이지 않는다는 이유로 실험 결과를 부정하지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v050",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 20
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E5",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 부풀린 풍선에 대한 설명입니다. 빈칸에 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "부풀린 풍선의 입구를 놓으면 풍선 속 □(이)가 입구로 빠져나오면서 풍선이 방 안을 이리저리 날아다닙니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "공기",
      "accepted": [
        "공기"
      ]
    },
    "explanation": "풍선을 놓으면 풍선 속 공기가 입구로 빠져나오면서 풍선이 움직여요. 공기가 다른 곳으로 이동하기 때문이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v051",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 1
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "컵 속 관찰로 확인한 물질을 돌멩이·식초·공기 중에서 골라 쓰세요.",
    "givens": {
      "관찰": "물속에 입구가 아래로 향하게 넣은 컵을 기울이자 방울이 나왔어요. 컵 안을 차지하던 것이 밖으로 나오는 모습이에요."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "공기",
      "accepted": [
        "공기"
      ]
    },
    "explanation": "컵 속 공기가 공간을 차지하고 있다가 컵을 기울이면 밖으로 나와 방울로 보여요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v052",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 2
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 연필, 우유, 공기를 친구에게 전달하면서 관찰한 특징입니다. 공기를 전달할 때 관찰한 특징으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 손으로 잡아 그대로 전달할 수 있습니다.",
        "ㄴ. 눈에 보이지 않고 손에 잡히지 않아 전달했는지 알기 어렵습니다.",
        "ㄷ. 손바닥에서 흘러내려 전달하기 어렵습니다."
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
    "explanation": "공기는 눈에 보이지 않고 손에 잡히지 않아서 전달했는지 알기 어려워요. ㄱ은 연필, ㄷ은 우유의 특징이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v053",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 3
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E2",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 유리구슬을 그릇만 바꾸어 옮긴 기록을 바르게 정리한 것은 무엇인가요?",
    "givens": {
      "관찰": "자르거나 누르지 않고 접시와 컵에 옮겼어요. 구슬의 길이와 둥근 모습은 같았어요."
    },
    "choices": [
      "그릇의 크기에 맞춰 구슬의 부피가 커진다.",
      "컵의 모양에 맞춰 둥근 구슬이 길어진다.",
      "모양과 부피가 그릇을 바꾸어도 그대로다.",
      "접시에 놓으면 구슬이 공간을 차지하지 않는다.",
      "어느 그릇에 넣느냐에 따라 구슬 색이 바뀐다."
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
    "explanation": "고체 구슬은 단지 그릇을 바꾼다고 모양과 부피가 달라지지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v054",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 4
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E2",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "고체의 성질로 옳은 것을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "흘러내리는 성질이 있습니다.",
      "눈으로 볼 수 있습니다.",
      "담는 그릇이 바뀌어도 부피가 그대로입니다.",
      "담는 그릇을 항상 가득 채웁니다.",
      "손으로 잡을 수 없습니다."
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        2
      ]
    },
    "explanation": "고체는 눈으로 볼 수 있고 손으로 잡을 수 있으며, 담는 그릇이 바뀌어도 모양과 부피가 그대로예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v055",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 5
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E3",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음에서 설명하는 상태인 물체를 고르세요.",
    "givens": {
      "지문": "손으로 잡아 옮길 수 있고, 담는 그릇이 바뀌어도 모양과 부피가 변하지 않습니다."
    },
    "choices": [
      "공기",
      "우유",
      "숟가락",
      "간장",
      "식용유"
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
    "explanation": "손으로 잡아 옮길 수 있고 그릇이 바뀌어도 모양과 부피가 그대로인 것은 고체예요. 숟가락은 고체, 우유·간장·식용유는 액체, 공기는 기체예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v056",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 6
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E3",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "가상 기록으로 알 수 있는 것을 고르세요.",
    "givens": {
      "기록": "같은 간장을 흘리지 않고 길쭉한 병과 넓은 그릇에 옮긴 뒤 처음 눈금컵에 다시 넣었더니 처음 선과 같았어요."
    },
    "choices": [
      "다른 그릇으로 옮겼어도 간장의 양은 같다.",
      "넓은 그릇에 담을수록 간장의 양이 늘어난다.",
      "길쭉한 병에 넣을수록 간장의 양이 줄어든다.",
      "모든 그릇에서 간장 표면 높이는 서로 같다.",
      "그릇 모양이 달라도 간장의 모양은 그대로다."
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
    "explanation": "다른 모양의 그릇에서는 높이가 달라져도 양이 같을 수 있어요. 같은 눈금컵으로 되돌린 기록으로 비교해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v057",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 7
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E3",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "꿀이 액체라는 설명을 뒷받침하는 관찰은 무엇인가요?",
    "givens": {
      "조건": "꿀을 길쭉한 병과 넓은 접시에 흘리지 않고 옮겨요."
    },
    "choices": [
      "그릇을 바꾸자 모양과 양이 모두 늘어났다.",
      "어느 그릇에서나 모양과 양이 처음과 같았다.",
      "접시에 담았더니 꿀이 공간을 차지하지 않았다.",
      "그릇에 따라 모양이 바뀌고 양은 유지됐다.",
      "끈적하므로 어떤 그릇에서도 흐르지 않았다."
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
    "explanation": "흐르는 빠르기나 끈적함만으로 나누지 않아요. 그릇에 따른 모양 변화와 같은 양을 함께 살펴요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v058",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 8
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E3",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "액체가 아닌 것을 고르세요.",
    "givens": null,
    "choices": [
      "우유",
      "모래",
      "물엿",
      "식초",
      "간장"
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
    "explanation": "모래는 알갱이가 작아 흘러내리는 것처럼 보여도, 알갱이 하나하나의 모양과 부피가 변하지 않는 고체예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v059",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 9
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E3",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물체의 상태가 나머지와 다른 것을 고르세요.",
    "givens": null,
    "choices": [
      "식초",
      "우유",
      "지우개",
      "바닷물",
      "간장"
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
    "explanation": "식초·우유·간장·바닷물은 액체이고, 지우개는 고체예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v060",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 10
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E4",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "공기의 존재를 확인한 근거를 모두 고른 것은 무엇인가요?",
    "givens": {
      "보기": [
        "ㄱ. 바람이 불 때 나뭇잎이 흔들리는 것을 봄",
        "ㄴ. 물속 빈 병에서 나온 방울이 위로 올라감",
        "ㄷ. 손전등을 켜자 바닥의 색이 밝게 보임"
      ]
    },
    "choices": [
      "ㄱ",
      "ㄱ, ㄴ",
      "ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
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
    "explanation": "바람과 병 속에서 나오는 공기 방울은 공기를 확인하는 근거예요. 손전등을 켰다는 기록만으로 공기를 확인하지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v061",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 11
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E4",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "공기가 빠져나가지 않는 컵을 천천히 내릴 때 조각 위치를 골라 기호를 쓰세요.",
    "givens": {
      "조건": "얕은 수조의 물 위에 작은 조각을 띄워, 구멍 없는 투명한 컵을 뒤집어 덮고 똑바로 내려요.",
      "보기": [
        "ㄱ. 처음 물 표면 높이에 계속 머문다.",
        "ㄴ. 컵 안에서 수조 바닥 쪽으로 내려간다.",
        "ㄷ. 컵 밖으로 나가 수조 벽에 붙는다."
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
    "explanation": "컵 속 공기가 공간을 차지하고 물을 밀어 내므로 조각이 아래로 내려가요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v062",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 12
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E4",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "관찰 기록을 설명하는 공기의 성질을 골라 기호를 쓰세요.",
    "givens": {
      "관찰": "구멍 없는 컵을 뒤집어 내리자 컵 속 조각이 아래로 내려갔어요. 컵을 기울이자 방울이 나오며 물이 더 들어왔어요.",
      "보기": [
        "ㄱ. 공기는 공간을 차지한다.",
        "ㄴ. 공기는 물을 만나 모두 없어진다.",
        "ㄷ. 공기는 물을 만날 때만 무게가 생긴다."
      ]
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
    "explanation": "컵 안 공기가 공간을 차지하고 있다가 밖으로 나오면 그 자리에 물이 들어와요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v063",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 13
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E4",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "공기베개 설계에서 기록과 연결이 알맞은 것은 무엇인가요?",
    "givens": {
      "기록": "입구를 닫은 공기베개는 부풀어 있고, 입구를 열어 공기를 빼면 납작해져요."
    },
    "choices": [
      "공기는 보이지 않아 베개 안에 존재하지 않는다.",
      "공기는 무게가 없기 때문에 베개가 부풀어 오른다.",
      "공기는 고체와 같아 베개 없이도 모양을 유지한다.",
      "공기가 안쪽 공간을 차지하며 모양을 유지한다.",
      "공기가 물로 변해야 베개가 부푼 모양을 유지한다."
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
    "explanation": "공기가 안쪽 공간을 차지하는 성질을 이용해요. 공기는 베개 없이도 같은 모양을 유지하는 고체가 아니에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v064",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 14
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E5",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "주사기와 비닐관으로 연결된 작은 비닐봉지 위에 종이 인형을 세웠습니다. 주사기의 피스톤을 밀면 종이 인형이 위로 들립니다. 비닐관을 따라 무엇이 이동하기 때문인지 쓰세요.",
    "givens": {
      "조건": "주사기와 비닐관 사이에 공기가 새지 않게 연결하고 피스톤을 천천히 움직여요."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "공기",
      "accepted": [
        "공기"
      ]
    },
    "explanation": "피스톤을 밀면 주사기 속 공기가 비닐관을 따라 비닐봉지로 이동해서 봉지가 부풀고 인형이 들려요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v065",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 15
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "가득 부풀린 비치 볼 안에 들어 있는 공기에 대한 설명으로 옳은 것을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "비치 볼 안을 가득 채웁니다.",
      "눈으로 잘 볼 수 있습니다.",
      "비치 볼의 모양에 따라 모양이 정해집니다.",
      "고체와 비슷한 성질을 가집니다.",
      "손으로 꺼내 잡을 수 있습니다."
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
    "explanation": "기체인 공기는 담긴 그릇을 용기 안의 빈 공간에 고르게 퍼져 가득 채우고, 그릇의 모양에 따라 모양이 바뀌어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v066",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 16
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 단단한 병의 무게가 달라진 까닭을 고르세요.",
    "givens": {
      "가상 기록": "같은 마개를 낀 병이 공기 추가 전 46.9 g, 후 47.5 g이었어요. 같은 저울을 썼고 물 등 다른 것은 넣지 않았어요."
    },
    "choices": [
      "병 안으로 물이 들어간 것을 기록했기 때문이다.",
      "병 안으로 더 들어간 공기에 무게가 있기 때문이다.",
      "병과 마개를 더 무거운 것으로 바꾸었기 때문이다.",
      "넣은 공기의 양과 관계없이 저울 값은 늘기 때문이다.",
      "병의 색이 진해져 무게가 늘었다고 확인했기 때문이다."
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
    "explanation": "다른 조건을 같게 두고 공기만 더 넣었으므로 공기 양과 무게 변화를 연결해요. 수치는 모형 값이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v067",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 17
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "가상 기록에서 병과 마개의 무게가 가장 작은 때를 골라 기호를 쓰세요.",
    "givens": {
      "표": {
        "머리": [
          "이름표",
          "마개를 누른 총횟수",
          "같은 병·마개의 무게"
        ],
        "행": [
          [
            "ㄱ",
            "15회",
            "47.4 g"
          ],
          [
            "ㄴ",
            "5회",
            "47.0 g"
          ],
          [
            "ㄷ",
            "25회",
            "47.8 g"
          ]
        ]
      },
      "조건": "같은 저울로 쟀으며 공기만 추가했어요. 실제 수업 결과를 제시한 표가 아닌 모형 값이에요."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ",
        "5회"
      ]
    },
    "explanation": "표에서 가장 작은 무게는 47.0 g인 ㄴ이에요. 누른 횟수만으로 실제 증가량을 임의 계산하지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v068",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 18
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "세 물질의 기록을 바르게 비교한 것을 고르세요.",
    "givens": {
      "가상 관찰": [
        "지우개: 그릇만 바꾸어도 모양·부피가 같음",
        "우유: 흘리지 않고 옮기면 모양 변화·부피는 같음",
        "공기: 연결된 닫힌 용기 전체에 퍼짐"
      ]
    },
    "choices": [
      "지우개는 그릇에 맞춰 모양이 바뀌는 액체다.",
      "공기는 닫힌 용기 일부에만 모여 있는 고체다.",
      "우유는 그릇을 바꾸어도 양이 유지되는 액체다.",
      "우유는 그릇이 커질 때마다 양이 늘어나는 기체다.",
      "지우개와 공기는 모두 원래 모양을 유지하는 고체다."
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
    "explanation": "그릇에 따른 모양과 부피를 함께 비교해요. 우유의 양이 같아도 높이는 달라질 수 있어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v069",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 19
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "<보기>의 물질들을 상태에 따라 바르게 분류한 것을 고르세요. (고체 / 액체 / 기체 순서)",
    "givens": {
      "보기": [
        "ㄱ. 연필",
        "ㄴ. 식초",
        "ㄷ. 공기",
        "ㄹ. 우유",
        "ㅁ. 동전"
      ]
    },
    "choices": [
      "ㄱ / ㄴ, ㄹ, ㅁ / ㄷ",
      "ㄱ, ㅁ / ㄴ, ㄹ / ㄷ",
      "ㄷ, ㅁ / ㄴ, ㄹ / ㄱ",
      "ㄱ, ㄴ / ㄹ, ㅁ / ㄷ",
      "ㄱ, ㅁ / ㄴ / ㄷ, ㄹ"
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
    "explanation": "연필과 동전은 고체, 식초와 우유는 액체, 공기는 기체예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s32-u04-v070",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 20
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u04",
      "area": "물질",
      "element": "E6",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "괄호 ㉠과 ㉡에 들어갈 알맞은 말을 골라 각각 쓰세요.",
    "givens": {
      "지문": "물총 장난감은 ㉠( 고체, 액체, 기체 )인 플라스틱 몸통과 그 안에 채운 ㉡( 고체, 액체, 기체 )인 물을 이용하여 만든 장난감입니다.",
      "답란": "㉠-(    ), ㉡-(    )"
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-고체, ㉡-액체",
      "accepted": [
        "㉠-고체, ㉡-액체",
        "㉠ 고체, ㉡ 액체",
        "㉠-고체,㉡-액체",
        "고체, 액체",
        "고체 액체",
        "고체,액체"
      ]
    },
    "explanation": "플라스틱 몸통은 모양이 그대로인 고체이고, 안에 채운 물은 액체예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  }
];
