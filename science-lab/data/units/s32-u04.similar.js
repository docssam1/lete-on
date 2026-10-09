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
    "prompt": "손으로 잡아 친구에게 그대로 건네줄 수 있고, 다른 그릇에 옮겨 담아도 모양이 그대로인 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 우유",
        "ㄴ. 숟가락",
        "ㄷ. 풍선 속 공기"
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
        "숟가락"
      ]
    },
    "explanation": "숟가락은 고체라서 손으로 잡을 수 있고 그릇이 바뀌어도 모양이 그대로예요. 우유는 흘러내리고, 공기는 손으로 잡을 수 없어요.",
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
    "prompt": "유리구슬과 우유의 공통점으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "눈으로 볼 수 있습니다.",
      "만지면 단단합니다.",
      "흔들면 출렁거립니다.",
      "손으로 잡아 옮길 수 있습니다.",
      "그릇에 따라 모양이 바뀝니다."
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
    "explanation": "유리구슬과 우유는 모두 눈에 보여요. 단단하고 손으로 잡을 수 있는 것은 유리구슬뿐이고, 출렁거리며 그릇에 따라 모양이 바뀌는 것은 우유뿐이에요.",
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
    "prompt": "모양이 다른 투명한 그릇 세 개에 같은 지우개를 차례로 옮겨 넣으며 관찰했습니다. 이를 통해 알 수 있는 내용으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "지우개는 넓은 그릇에 넣으면 부피가 커집니다.",
      "지우개는 어느 그릇에 넣어도 모양과 부피가 그대로입니다.",
      "지우개는 좁은 그릇에 넣으면 모양이 길쭉해집니다.",
      "지우개는 그릇을 옮길 때마다 색깔이 달라집니다.",
      "지우개는 둥근 그릇에 넣으면 둥근 모양으로 바뀝니다."
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
    "explanation": "지우개는 고체라서 담는 그릇이 바뀌어도 모양과 부피가 변하지 않아요.",
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "우유의 성질에 대한 설명으로 옳지 않은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 우유는 흘러서 손으로 잡기 어렵습니다.",
        "ㄴ. 우유는 담는 그릇에 따라 모양이 달라집니다.",
        "ㄷ. 우유는 좁고 긴 그릇에 옮겨 담으면 부피가 늘어납니다."
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
    "explanation": "우유는 액체라서 담는 그릇에 따라 모양은 바뀌지만 부피는 변하지 않아요. 좁고 긴 그릇에 담으면 높이만 달라질 뿐 양은 그대로예요.",
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
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
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
    "explanation": "간장과 물엿은 담는 그릇에 따라 모양이 바뀌고 부피는 그대로인 액체예요. 물엿은 끈끈해도 액체이고, 설탕은 알갱이 하나하나의 모양이 변하지 않는 고체예요.",
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
    "prompt": "마른 스펀지를 물이 담긴 수조 속에 넣고 손으로 꾹 짜듯이 눌렀을 때 나타나는 현상으로 옳지 않은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 스펀지에서 공기 방울이 나옵니다.",
        "ㄴ. 공기 방울이 물 위로 올라가 사라집니다.",
        "ㄷ. 스펀지 속에서 물이 빠져나와 수조의 물이 흐려집니다."
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
    "explanation": "스펀지의 작은 구멍 속에 공기가 들어 있어서, 물속에서 누르면 공기 방울이 나와 위로 올라가요. 물이 흐려지는 것은 아니에요.",
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
    "prompt": "우리 주변에 공기가 있음을 알 수 있는 예로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "돌멩이",
      "식초",
      "유리구슬",
      "물놀이 튜브",
      "공책"
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
    "explanation": "물놀이 튜브는 안에 공기가 들어 있어 부풀어 있고 물에 떠요. 그래서 우리 주변에 공기가 있음을 알 수 있어요.",
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
      "지문": "같은 크기의 투명한 플라스틱 컵 ㄱ과 ㄴ을 뒤집어, 물 위에 띄운 스타이로폼 조각을 각각 덮은 뒤 수조 바닥까지 밀어 넣었습니다. 두 컵 중 하나는 바닥에 구멍이 뚫려 있습니다.\n• ㄱ: 스타이로폼 조각이 처음과 같은 높이의 물 위에 그대로 떠 있었습니다.\n• ㄴ: 스타이로폼 조각이 컵과 함께 수조 바닥 쪽으로 내려갔습니다."
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
      "답란": "ㄱ-(    ), ㄴ-(    )"
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "공기에 무게가 있음을 알 수 있는 경우를 <보기>에서 모두 골라 바르게 짝 지은 것은?",
    "givens": {
      "보기": [
        "ㄱ. 공기를 넣은 축구공이 공기를 넣기 전보다 무겁습니다.",
        "ㄴ. 공기 주입 마개를 누른 페트병이 누르기 전보다 무겁습니다.",
        "ㄷ. 바람이 불면 나뭇잎이 흔들립니다."
      ]
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
    "explanation": "공기를 넣을수록 축구공과 페트병이 무거워지는 것으로 공기에 무게가 있음을 알 수 있어요. 나뭇잎이 흔들리는 것은 공기가 이동하기 때문이에요.",
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
    "prompt": "공기에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "공기는 무게가 없어서 저울로 잴 수 없습니다.",
      "공기는 바람이 되어 다른 곳으로 이동합니다.",
      "공기는 손으로 잡을 수 없습니다.",
      "공기는 풍선 속 공간을 차지합니다.",
      "공기는 눈에 잘 보이지 않습니다."
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
    "explanation": "공기도 무게가 있어요. 공기를 넣은 공이 공기를 넣기 전보다 무거운 것으로 알 수 있어요.",
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
    "prompt": "빨대를 꽂은 풍선을 장난감 자동차 위에 붙이고 빨대로 풍선을 분 뒤, 빨대 끝을 막고 있던 손가락을 떼었더니 자동차가 앞으로 굴러갔습니다. 자동차가 앞으로 나아가는 까닭을 쓰세요.",
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
          "풍선 속 공기 때문에 자동차가 움직인다",
          "풍선 속 공기가 이동해 빨대 끝으로 빠져나온다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "풍선 속 공기가 이동해 빨대 끝으로 빠져나오면서 자동차를 앞으로 밀어요. 공기가 다른 곳으로 이동할 수 있기 때문이에요.",
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
    "prompt": "유리구슬을 관찰한 내용으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "딱딱합니다.",
      "손에 쥐면 흘러내립니다.",
      "눈에 보입니다.",
      "둥근 모양입니다.",
      "손으로 잡을 수 있습니다."
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
    "explanation": "유리구슬은 고체라서 딱딱하고 손으로 잡을 수 있어요. 손에 쥐면 흘러내리는 것은 액체예요.",
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
    "prompt": "돌멩이, 우유, 공기를 손으로 옆 친구에게 전달하려고 합니다. 이에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "우유는 손바닥에서 흘러내립니다.",
      "공기는 전달하는 느낌이 나지 않습니다.",
      "우유는 손으로 꼭 쥐면 모양이 그대로 남습니다.",
      "돌멩이는 손으로 잡아 그대로 전달할 수 있습니다.",
      "공기는 눈에 보이지 않아 전달했는지 알기 어렵습니다."
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
    "explanation": "우유는 액체라서 손으로 쥐면 손가락 사이로 흘러내려요. 모양이 그대로 남는 것은 돌멩이 같은 고체예요.",
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
          "잘못된 부분은 ㉢이다",
          "모양도 변하지 않는다로 고친다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "지우개는 고체라서 어떤 그릇에 넣어도 모양과 부피가 모두 그대로예요. 그래서 ㉢의 '모양이 바뀐다'가 잘못되었어요.",
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
    "prompt": "고체가 아닌 것을 고르세요.",
    "givens": null,
    "choices": [
      "숟가락",
      "모래",
      "동전",
      "고무줄",
      "식초"
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
    "explanation": "숟가락·모래·동전·고무줄은 고체이고, 식초는 액체예요. 모래는 알갱이가 작아도 알갱이 하나하나의 모양이 변하지 않는 고체예요.",
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
    "prompt": "우유와 간장의 공통점으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "같은 색깔을 띱니다.",
      "눈에 보입니다.",
      "흐르는 성질이 있습니다.",
      "담는 그릇에 따라 모양이 변합니다.",
      "담는 그릇이 달라져도 부피는 변하지 않습니다."
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
    "explanation": "우유는 흰색, 간장은 검은 갈색이라 색깔이 달라요. 나머지는 둘 다 액체라서 갖는 공통점이에요.",
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "다음은 캠핑할 때 바람을 넣어 쓰는 에어 매트입니다. 에어 매트는 공기의 어떤 성질을 이용한 것인지 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 맛이 없습니다.",
        "ㄴ. 눈에 보이지 않습니다.",
        "ㄷ. 일정한 공간을 차지합니다.",
        "ㄹ. 손으로 잡을 수 없습니다."
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
        "일정한 공간을 차지합니다."
      ]
    },
    "explanation": "에어 매트는 안에 넣은 공기가 공간을 차지해서 부푼 모양을 유지해요.",
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
    "explanation": "왼쪽 피스톤을 당기면 오른쪽 주사기 속 공기가 비닐관을 따라 왼쪽으로 이동해서, 오른쪽 피스톤과 스타이로폼 공이 안쪽으로 끌려 들어가요.",
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
    "prompt": "다음의 모습들은 공통적으로 공기의 어떤 성질을 이용한 것인지 고르세요.",
    "givens": {
      "지문": "▲부채질로 바람개비 돌리기 ▲풍선 펌프로 풍선 부풀리기"
    },
    "choices": [
      "공기는 무게가 있습니다.",
      "공기는 다른 곳으로 이동할 수 있습니다.",
      "공기는 눈에 보이지 않습니다.",
      "공기는 손으로 잡을 수 있습니다.",
      "공기는 그릇에 따라 모양이 변하지 않습니다."
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
    "explanation": "부채질로 바람개비를 돌리는 것과 풍선 펌프로 풍선을 부풀리는 것은 모두 공기를 다른 곳으로 이동시키는 일이에요.",
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
    "explanation": "기체는 담긴 그릇을 항상 가득 채우기 때문에 그릇에 따라 모양과 부피가 모두 변해요. 액체는 모양만 변하고, 고체는 둘 다 그대로예요.",
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
    "prompt": "바람이 빠진 축구공의 무게를 재었습니다. 축구공의 무게가 늘어나게 하는 방법으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "축구공을 햇볕에 오래 둡니다.",
      "축구공의 공기를 조금 뺍니다.",
      "펌프로 공기를 더 넣습니다.",
      "축구공을 냉장고에 넣어 둡니다.",
      "축구공을 발로 여러 번 찹니다."
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
    "explanation": "공기도 무게가 있어서, 펌프로 공기를 더 넣으면 축구공이 무거워져요.",
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
    "prompt": "바람이 빠진 축구공의 무게는 412 g이었는데, 공기 펌프로 공기를 넣은 뒤에는 417 g이었습니다. 이 결과로 알 수 있는 내용입니다. 빈칸에 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "공기는 [    ](이)가 있음을 알 수 있습니다."
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
    "explanation": "공기를 넣은 뒤 축구공이 5 g 더 무거워졌어요. 그래서 공기도 무게가 있음을 알 수 있어요.",
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
      "고체, 기체",
      "고체, 액체, 기체"
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
    "explanation": "종이컵·비닐·고무줄은 고체이고, 구멍으로 나가 종이 인형을 쓰러뜨리는 것은 기체인 공기예요. 물 같은 액체는 쓰지 않았어요.",
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
    "prompt": "다음에서 설명하는 것은 유리구슬, 간장, 공기 중 무엇인지 쓰세요.",
    "givens": {
      "지문": "• 눈에 보이며, 담는 그릇에 따라 모양이 달라집니다.\n• 손으로 떠서 옮기려 하면 손가락 사이로 흘러내립니다."
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
    "explanation": "눈에 보이고 그릇에 따라 모양이 바뀌며 흘러내리는 것은 액체인 간장이에요. 유리구슬은 모양이 그대로이고, 공기는 눈에 보이지 않아요.",
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "연필, 주스, 공기에 대한 설명으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 주스는 눈에 보이지만 흘러내려 손으로 잡기 어렵습니다.",
        "ㄴ. 공기는 손으로 잡아 친구에게 전달할 수 있습니다.",
        "ㄷ. 연필과 주스는 모두 손으로 잡아 옮길 수 있습니다."
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
    "explanation": "주스는 눈에 보이지만 흘러내려 잡기 어려워요. 공기는 손으로 잡을 수 없고, 주스는 손으로 잡아 옮길 수 없어요.",
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
    "prompt": "모양이 다른 투명한 그릇 세 개에 같은 주사위를 차례로 넣어 보았더니 주사위의 모양과 부피가 그대로였습니다. 주사위 대신 쇠못을 넣었을 때에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "쇠못은 둥근 그릇에 넣으면 휘어져 모양이 변합니다.",
      "쇠못은 큰 그릇에 넣으면 부피가 그만큼 늘어납니다.",
      "주사위와 달리 쇠못은 그릇에 따라 부피가 변합니다.",
      "주사위와 달리 쇠못은 공간을 차지하지 않습니다.",
      "주사위처럼 그릇과 관계없이 모양과 부피가 그대로입니다."
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
    "explanation": "쇠못도 주사위처럼 고체라서 어떤 그릇에 넣어도 모양과 부피가 변하지 않아요.",
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
    "prompt": "고체에 대한 설명으로 옳지 않은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 비교적 단단합니다.",
        "ㄴ. 담는 그릇이 바뀌어도 모양이 그대로입니다.",
        "ㄷ. 담는 그릇에 따라 부피가 달라집니다."
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
    "explanation": "고체는 담는 그릇이 바뀌어도 모양과 부피가 모두 그대로예요. 부피가 달라진다는 설명이 틀렸어요.",
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "투명한 그릇에 우유를 넣고 높이를 표시한 뒤, 우유를 길쭉한 컵과 넓은 접시 모양 그릇에 차례로 옮겨 담으며 우유의 모양을 관찰했습니다. 이를 통해 알 수 있는 내용으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "우유는 담는 그릇의 모양에 따라 모양이 변합니다.",
      "우유는 넓은 그릇에 담아야만 모양이 변합니다.",
      "우유는 담는 그릇의 색깔에 따라 색깔이 변합니다.",
      "우유는 그릇을 바꾸어도 처음 모양을 유지합니다.",
      "우유는 담는 그릇에 따라 모양과 부피가 모두 변합니다."
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
    "explanation": "우유는 액체라서 어떤 그릇에 담든 그 그릇 모양대로 모양이 바뀌어요. 부피는 변하지 않아요.",
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
    "prompt": "투명한 컵에 우유를 붓고 우유 높이에 선을 그었습니다. 이 우유를 흘리지 않고 넓적한 그릇과 길쭉한 병에 차례로 옮겨 담았다가 처음 컵에 다시 부었을 때, 우유의 높이로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 처음에 그은 선보다 높습니다.",
        "ㄴ. 처음에 그은 선보다 낮습니다.",
        "ㄷ. 처음에 그은 선과 같습니다."
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
        "같다",
        "처음과 같다"
      ]
    },
    "explanation": "우유는 그릇에 따라 모양만 바뀌고 부피는 그대로라서, 처음 컵에 다시 부으면 높이가 처음에 그은 선과 같아요.",
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
    "prompt": "물이 담긴 수조 속에 빈 컵을 거꾸로 세워 넣은 뒤 컵을 옆으로 기울였을 때 나타나는 변화로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "컵 안으로 공기 방울이 빨려 들어갑니다.",
      "컵 입구에서 공기 방울이 나와 위로 올라갑니다.",
      "컵에서 물방울이 생겨 바닥으로 가라앉습니다.",
      "수조 속 물이 컵 쪽으로 몰리며 차가워집니다.",
      "물에 눌린 컵의 크기가 점점 작아집니다."
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
    "explanation": "거꾸로 넣은 빈 컵 안에는 공기가 들어 있어요. 컵을 기울이면 그 공기가 공기 방울이 되어 위로 올라가요.",
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "바닥에 작은 구멍을 뚫은 투명한 컵을 뒤집어, 물 위에 띄운 스타이로폼 조각을 덮은 뒤 수조 바닥까지 천천히 밀어 넣었습니다. 이때 나타나는 현상으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "스타이로폼 조각이 컵과 함께 바닥까지 내려갑니다.",
      "컵 안에 공기가 그대로 남아 물이 못 들어옵니다.",
      "스타이로폼 조각이 처음과 같은 높이에 떠 있습니다.",
      "수조 속 물의 높이가 눈에 띄게 높아집니다.",
      "구멍으로 물이 빠져나가 컵 안이 비게 됩니다."
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
    "explanation": "구멍으로 컵 안의 공기가 빠져나가고 그만큼 물이 들어와서, 스타이로폼 조각은 처음과 같은 높이에 그대로 떠 있어요.",
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
    "prompt": "투명한 플라스틱 컵 바닥에 마른 휴지를 뭉쳐 붙였습니다. 구멍이 없는 이 컵을 뒤집어 물이 담긴 수조 속으로 똑바로 끝까지 밀어 넣었다가 그대로 똑바로 꺼냈습니다. 휴지가 어떻게 되었는지 그 까닭과 함께 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "휴지가 젖지 않습니다. 컵 안의 공기가 빠져나가지 못하고 공간을 차지하고 있어 물이 컵 안으로 들어오지 못하기 때문입니다.",
      "rubric": {
        "required": [
          "휴지가 젖지 않는다",
          "컵 안의 공기가 공간을 차지해 물이 들어오지 못한다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "구멍이 없는 컵 안의 공기는 빠져나갈 곳이 없어 공간을 차지하고 있어요. 그래서 물이 컵 안으로 들어오지 못해 휴지가 젖지 않아요.",
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
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "피스톤을 밀면 비닐봉지가 부풀면서 블록이 위로 올라가고, 피스톤을 당기면 비닐봉지가 다시 납작해지면서 블록이 아래로 내려옵니다.",
      "rubric": {
        "required": [
          "피스톤을 밀면 블록이 위로 올라간다",
          "피스톤을 당기면 블록이 다시 내려온다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "피스톤을 밀면 주사기 속 공기가 비닐봉지로 이동해 봉지가 부풀면서 블록을 들어 올려요. 당기면 공기가 주사기로 돌아와 블록이 내려와요.",
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
    "prompt": "공기가 다른 곳으로 이동하는 성질을 이용한 예가 아닌 것을 고르세요.",
    "givens": null,
    "choices": [
      "부채",
      "바람개비",
      "풍선 펌프",
      "물감을 물에 풀어 만든 색깔 물",
      "어항에 설치한 공기 공급 장치"
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
    "explanation": "부채·바람개비·풍선 펌프·공기 공급 장치는 모두 공기를 이동시키거나 이동하는 공기로 움직여요. 색깔 물은 공기의 이동과 관계가 없어요.",
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "같은 축구공의 무게를 공기를 넣기 전과 공기 펌프로 공기를 넣은 뒤에 각각 재었습니다. ㄱ과 ㄴ 중 공기를 넣기 전 축구공의 무게인 것을 골라 기호를 쓰세요.",
    "givens": {
      "표": {
        "구분": [
          "축구공의 무게(g)"
        ],
        "ㄱ": [
          "421"
        ],
        "ㄴ": [
          "426"
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
        "ㄱ",
        "421",
        "421 g",
        "421g"
      ]
    },
    "explanation": "공기도 무게가 있어서 공기를 넣은 뒤가 더 무거워요. 그래서 더 가벼운 421 g이 공기를 넣기 전의 무게예요.",
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
    "prompt": "다음은 축구공에 공기를 넣는 실험으로 알 수 있는 것입니다. 괄호 ㉠과 ㉡에 들어갈 알맞은 말을 골라 각각 쓰세요.",
    "givens": {
      "지문": "축구공 안에 공기를 더 넣으면 축구공의 무게는 ㉠( 늘어납니다, 줄어듭니다 ). 이를 통해 ㉡( 고체, 기체 )인 공기도 무게가 있음을 알 수 있습니다.",
      "답란": "㉠-(    ), ㉡-(    )"
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
        "㉠ 늘어납니다, ㉡ 기체",
        "㉠-늘어납니다,㉡-기체",
        "늘어납니다, 기체",
        "늘어납니다 기체",
        "늘어난다, 기체"
      ]
    },
    "explanation": "공기를 더 넣으면 축구공이 무거워지므로 무게가 늘어나요. 이것으로 기체인 공기도 무게가 있음을 알 수 있어요.",
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
    "prompt": "공기의 무게에 대한 설명으로 옳지 않은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 공기를 넣은 축구공은 공기를 넣기 전보다 더 무겁습니다.",
        "ㄴ. 공기는 눈에 보이지 않으므로 무게도 없습니다.",
        "ㄷ. 공기 주입 마개를 여러 번 누른 페트병은 누르기 전보다 무겁습니다."
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
    "explanation": "공기는 눈에 보이지 않지만 무게가 있어요. 공기를 넣은 축구공이나 페트병이 더 무거워지는 것으로 알 수 있어요.",
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "다음은 돌멩이, 식초, 공기 중 무엇을 관찰한 내용인지 쓰세요.",
    "givens": {
      "지문": "• 손으로 잡아 그대로 옮길 수 있습니다.\n• 어떤 그릇에 넣어도 모양이 바뀌지 않습니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "돌멩이",
      "accepted": [
        "돌멩이"
      ]
    },
    "explanation": "손으로 잡아 옮길 수 있고 그릇이 바뀌어도 모양이 그대로인 것은 고체인 돌멩이예요.",
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "prompt": "유리구슬을 여러 가지 모양의 그릇에 옮겨 담을 때 모양과 부피 변화에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "유리구슬의 색깔이 그릇에 따라 변합니다.",
      "유리구슬의 모양과 부피가 모두 변합니다.",
      "유리구슬의 부피는 변하지만 모양은 그대로입니다.",
      "유리구슬의 모양은 변하지만 부피는 그대로입니다.",
      "유리구슬의 모양과 부피가 모두 변하지 않습니다."
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
    "explanation": "유리구슬은 고체라서 담는 그릇이 달라져도 모양과 부피가 모두 그대로예요.",
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
      "숟가락",
      "우유",
      "공기",
      "간장",
      "식용유"
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
    "explanation": "손으로 잡아 옮길 수 있고 그릇이 바뀌어도 모양과 부피가 그대로인 것은 고체예요. 숟가락은 고체, 우유·간장·식용유는 액체, 공기는 기체예요.",
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
    "prompt": "간장을 여러 가지 모양의 투명한 그릇에 옮겨 담으면서 간장의 모양과 부피 변화를 관찰하였습니다. 이에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "넓은 그릇에 담으면 간장의 부피가 늘어납니다.",
      "담는 그릇이 달라져도 간장의 부피는 그대로입니다.",
      "담는 그릇이 달라져도 간장의 모양은 그대로입니다.",
      "간장을 옮겨 담으면 그릇의 모양이 간장처럼 변합니다.",
      "어느 그릇에 담아도 간장의 높이는 항상 같습니다."
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
    "explanation": "간장은 액체라서 그릇에 따라 모양은 바뀌지만 부피는 변하지 않아요. 그릇 모양이 다르면 높이도 달라져요.",
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
    "prompt": "꿀을 길쭉한 병과 넓은 접시에 차례로 흘리지 않고 옮겨 담았습니다. 꿀이 액체임을 보여 주는 관찰 결과로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "꿀이 끈적끈적해서 손가락에 달라붙었습니다.",
      "꿀의 모양과 부피가 그릇마다 모두 달랐습니다.",
      "꿀의 모양은 그릇마다 달랐지만 부피는 처음과 같았습니다.",
      "꿀의 모양과 부피가 그릇과 상관없이 처음과 같았습니다.",
      "꿀의 부피는 그릇마다 달랐지만 모양은 처음과 같았습니다."
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
    "explanation": "그릇에 따라 모양은 바뀌지만 부피는 그대로인 것이 액체의 성질이에요. 끈적끈적한 것은 액체인지 가르는 기준이 아니에요.",
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
      "식초",
      "물엿",
      "모래",
      "간장"
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
    "explanation": "모래는 알갱이가 작아 흘러내리는 것처럼 보여도, 알갱이 하나하나의 모양과 부피가 변하지 않는 고체예요.",
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
      "간장",
      "바닷물",
      "지우개"
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
    "explanation": "식초·우유·간장·바닷물은 액체이고, 지우개는 고체예요.",
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
    "prompt": "우리 주변에 공기가 있는 것을 알 수 있는 방법으로 옳은 것을 <보기>에서 모두 골라 짝 지은 것은?",
    "givens": {
      "보기": [
        "ㄱ. 바람이 불면 나뭇잎이 흔들립니다.",
        "ㄴ. 빈 페트병을 물속에서 누르면 공기 방울이 나옵니다.",
        "ㄷ. 손전등을 켜면 주위가 밝아집니다."
      ]
    },
    "choices": [
      "ㄱ, ㄴ",
      "ㄱ",
      "ㄷ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
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
    "explanation": "바람에 흔들리는 나뭇잎과 물속에서 나오는 공기 방울로 공기가 있음을 알 수 있어요. 손전등 빛은 공기와 관계가 없어요.",
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
    "prompt": "바닥에 구멍이 뚫리지 않은 투명한 플라스틱 컵을 뒤집어, 물 위에 띄운 장난감 오리를 덮은 뒤 수조 바닥까지 천천히 밀어 넣었습니다. 이때 장난감 오리의 위치로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 처음과 같은 높이의 물 위에 그대로 떠 있습니다.",
        "ㄴ. 컵 안에서 수조 바닥 쪽으로 내려갑니다.",
        "ㄷ. 컵 밖으로 빠져나가 수조 벽에 붙습니다."
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
    "explanation": "컵 안의 공기가 빠져나가지 못하고 공간을 차지해 물을 밀어 내므로, 장난감 오리는 수조 바닥 쪽으로 내려가요.",
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
    "prompt": "구멍이 없는 컵을 뒤집어 물에 띄운 장난감 오리를 덮고 수조 바닥까지 밀어 넣었더니, 오리가 수조 바닥 쪽으로 내려가고 수조의 물 높이가 조금 높아졌습니다. 이 결과로 알 수 있는 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 공기는 공간을 차지합니다.",
        "ㄴ. 공기는 물에 녹아 사라집니다.",
        "ㄷ. 공기는 물을 만나면 무거워집니다."
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
    "explanation": "컵 안의 공기가 공간을 차지해서 물을 밀어 냈기 때문에 오리가 내려가고 물 높이가 높아졌어요.",
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
    "prompt": "풍선 놀이 틀을 통해 알 수 있는 공기의 성질로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "무게가 없는 성질",
      "공간을 차지하는 성질",
      "손으로 잡을 수 있는 성질",
      "물에 녹아 사라지는 성질",
      "그릇에 따라 색이 변하는 성질"
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
    "explanation": "풍선 놀이 틀은 안에 넣은 공기가 공간을 차지해서 부푼 모양을 유지해요.",
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
    "givens": null,
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
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
    "explanation": "기체인 공기는 담긴 그릇을 항상 가득 채우고, 그릇의 모양에 따라 모양이 바뀌어요.",
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
    "prompt": "바람이 빠진 농구공의 무게를 재었더니 598 g이었고, 공기 펌프로 공기를 넣은 뒤 다시 재었더니 604 g이었습니다. 농구공의 무게가 달라진 까닭으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "농구공 안에 물이 들어갔기 때문입니다.",
      "농구공의 크기가 줄어들었기 때문입니다.",
      "농구공 안의 공기 양이 늘었기 때문입니다.",
      "저울을 다른 것으로 바꾸었기 때문입니다.",
      "농구공의 색깔이 진해졌기 때문입니다."
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
    "explanation": "공기도 무게가 있어서, 펌프로 공기를 넣어 농구공 안 공기의 양이 늘어나면 무게도 늘어나요.",
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
    "prompt": "같은 페트병에 공기 주입 마개를 끼우고, 마개를 누르는 횟수를 다르게 하여 무게를 재었습니다. 페트병의 무게가 가장 가벼운 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 공기 주입 마개를 15번 눌렀을 때",
        "ㄴ. 공기 주입 마개를 5번 눌렀을 때",
        "ㄷ. 공기 주입 마개를 25번 눌렀을 때"
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
    "explanation": "마개를 적게 누를수록 페트병에 들어간 공기의 양이 적어서 무게가 가벼워요. 5번 누른 것이 가장 가벼워요.",
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
    "prompt": "물질의 상태에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "고체는 담는 그릇에 따라 모양이 바뀝니다.",
      "기체는 담는 그릇의 일부분만 채웁니다.",
      "기체는 담는 그릇이 바뀌어도 모양이 그대로입니다.",
      "액체는 담는 그릇이 바뀌어도 부피가 그대로입니다.",
      "액체는 담는 그릇에 따라 부피가 늘었다 줄었다 합니다."
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
    "explanation": "액체는 그릇에 따라 모양만 바뀌고 부피는 그대로예요. 고체는 모양이 그대로이고, 기체는 그릇을 가득 채워 모양과 부피가 바뀌어요.",
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
      "ㄱ, ㅁ / ㄴ / ㄷ, ㄹ",
      "ㄷ, ㅁ / ㄴ, ㄹ / ㄱ",
      "ㄱ, ㄴ / ㄹ, ㅁ / ㄷ",
      "ㄱ, ㅁ / ㄴ, ㄹ / ㄷ"
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
    "explanation": "연필과 동전은 고체, 식초와 우유는 액체, 공기는 기체예요.",
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
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "science",
        "answer"
      ]
    }
  }
];
