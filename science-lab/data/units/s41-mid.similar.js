// 4-1 Ⅳ 중간평가 — 유사문항 50 (창작). 원문 1문항당 1개, 같은 유형·난이도로 상황과 물체를 바꿨다. of = 짝이 되는 원문 (세트, 번호).
export const similar = [
  {
    "id": "s41-mid-v001",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 <보기>에서 자석에 붙는 물체를 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 유리병",
        "ㄴ. 고무장갑",
        "ㄷ. 철 못",
        "ㄹ. 알루미늄 포일"
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
        "철 못",
        "ㄷ 철 못"
      ]
    },
    "explanation": "철로 만든 철 못만 자석에 붙어요. 유리·고무·알루미늄으로 만든 물체는 반짝이거나 단단해도 자석에 붙지 않아요.",
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
    "id": "s41-mid-v002",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "자석에 붙는 물체에 대한 설명으로 알맞지 않은 것을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "철로 만든 못은 자석에 붙습니다.",
      "고무로 만든 지우개는 자석에 붙지 않습니다.",
      "반짝이는 금속으로 만든 물체는 모두 자석에 붙습니다.",
      "날은 철, 손잡이는 플라스틱인 가위는 날 부분만 자석에 붙습니다.",
      "몸통은 나무, 칼날은 철인 연필깎이는 나무 부분도 자석에 붙습니다."
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        2,
        4
      ]
    },
    "explanation": "자석에 붙는지는 물체를 이루는 물질로 정해져요. 철로 만든 것만 붙고, 알루미늄 같은 다른 금속이나 여러 물질로 된 물체의 철이 아닌 부분은 붙지 않아요.",
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
    "id": "s41-mid-v003",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "자석과 철 클립 사이에 작용하는 힘에 대한 설명으로 알맞은 것을 <보기>에서 모두 고른 것은 어느 것인가요?",
    "givens": {
      "보기": [
        "ㄱ. 자석과 철 클립 사이에 두꺼운 종이를 끼워도 철 클립이 자석 쪽으로 끌려온다.",
        "ㄴ. 자석은 철 클립을 밀어 내는 힘을 작용한다.",
        "ㄷ. 자석과 철 클립이 조금 떨어져 있어도 철 클립이 자석 쪽으로 끌려온다."
      ]
    },
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
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
    "explanation": "자석은 철 클립을 끌어당기고, 사이에 두꺼운 종이가 있거나 조금 떨어져 있어도 끌어당기는 힘이 작용해요. 자석이 철 클립을 밀어 내지는 않아요.",
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
    "id": "s41-mid-v004",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "작은 철 못이 가득 든 상자에 막대자석을 넣었다가 천천히 꺼냈습니다. 이에 대한 설명으로 알맞은 것은 어느 것인가요?",
    "givens": null,
    "choices": [
      "막대자석의 양쪽 끝부분에 철 못이 가장 많이 붙어 있습니다.",
      "막대자석의 가운데 부분에 철 못이 가장 많이 붙어 있습니다.",
      "막대자석의 모든 부분에 철 못이 고르게 붙어 있습니다.",
      "막대자석의 N극 쪽 끝부분에만 철 못이 많이 붙어 있습니다.",
      "막대자석에는 철 못이 하나도 붙어 나오지 않습니다."
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
    "explanation": "막대자석은 양쪽 끝부분인 극에서 끌어당기는 힘이 가장 세서 철 못이 가장 많이 붙어요. 극은 N극과 S극 두 군데예요.",
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
    "id": "s41-mid-v005",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "막대자석, 말굽자석, 고리 자석은 모양은 서로 달라도 모두 극이 있습니다. 자석의 극이란 무엇인지 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "자석에서 철로 만든 물체가 가장 많이 붙는 부분이에요.",
      "rubric": {
        "required": [
          "자석에서 철로 만든 물체가 가장 많이 붙는 부분"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "자석에서 철로 만든 물체가 가장 많이 붙는 부분을 극이라고 해요. 자석의 모양이 달라도 극은 항상 두 군데(N극, S극) 있어요.",
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
    "id": "s41-mid-v006",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "두 막대자석을 다음과 같이 마주 보게 가까이 했을 때 서로 밀어 내는 경우끼리 알맞게 짝 지은 것은 어느 것인가요?",
    "givens": {
      "보기": [
        "ㄱ. N극과 N극",
        "ㄴ. N극과 S극",
        "ㄷ. S극과 S극",
        "ㄹ. S극과 N극"
      ]
    },
    "choices": [
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄷ",
      "ㄴ, ㄹ",
      "ㄱ, ㄴ, ㄹ"
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
    "explanation": "같은 극끼리 가까이 하면 서로 밀어 내고, 다른 극끼리 가까이 하면 서로 끌어당겨요. N극과 N극(ㄱ), S극과 S극(ㄷ)이 같은 극이에요.",
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
    "id": "s41-mid-v007",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "막대에 고리 자석 두 개를 끼웠습니다. ㉠, ㉡에 들어갈 알맞은 말을 골라 쓰세요.",
    "givens": {
      "지문": "• 위 자석이 아래 자석에 붙지 않고 떠 있다면, 마주 보는 두 면은 ㉠ ( 같은, 다른 ) 극입니다.\n• 위 자석을 뒤집어 끼웠더니 두 자석이 딱 붙었다면, 마주 보는 두 면은 ㉡ ( 같은, 다른 ) 극입니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 같은, ㉡ 다른",
      "accepted": [
        "㉠ 같은, ㉡ 다른",
        "같은, 다른",
        "같은 다른",
        "ㄱ 같은, ㄴ 다른",
        "㉠같은 ㉡다른"
      ]
    },
    "explanation": "위 자석이 떠 있는 것은 마주 보는 면이 같은 극이라 서로 밀어 내기 때문이고, 딱 붙는 것은 다른 극이라 끌어당기기 때문이에요.",
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
    "id": "s41-mid-v008",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "둥근 접시에 막대자석을 올려 물 위에 띄웠더니 접시가 빙그르르 돌다가 멈추었습니다. 이때의 모습으로 알맞은 것은 어느 것인가요?",
    "givens": null,
    "choices": [
      "자석의 두 극이 동쪽과 서쪽을 가리킵니다.",
      "자석의 N극은 남쪽을, S극은 북쪽을 가리킵니다.",
      "다시 돌릴 때마다 매번 다른 방향을 가리키며 멈춥니다.",
      "자석의 두 극이 북동쪽과 남서쪽을 가리킵니다.",
      "자석의 두 극이 북쪽과 남쪽을 가리킵니다."
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
    "explanation": "물에 띄워 자유롭게 움직이는 자석은 멈추면 늘 북쪽과 남쪽을 가리켜요. 북쪽을 가리키는 극이 N극, 남쪽을 가리키는 극이 S극이에요.",
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
    "id": "s41-mid-v009",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물에 띄운 막대자석이 움직임을 멈추었을 때 남쪽을 가리키는 극을 ㉠극, 북쪽을 가리키는 극을 ㉡극이라고 합니다. ㉠, ㉡에 들어갈 알맞은 말을 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ S, ㉡ N",
      "accepted": [
        "㉠ S, ㉡ N",
        "S, N",
        "S N",
        "㉠ S극, ㉡ N극",
        "S극, N극",
        "ㄱ S, ㄴ N"
      ]
    },
    "explanation": "자유롭게 움직이는 자석에서 북쪽을 가리키는 극을 N극, 남쪽을 가리키는 극을 S극이라고 해요.",
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
    "id": "s41-mid-v010",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "막대자석을 나침반에 가까이 가져갔을 때의 설명이 맞으면 ○표, 틀리면 ×표를 하세요. (나침반 바늘의 빨간색 부분은 N극입니다.)",
    "givens": {
      "지문": "(1) 막대자석의 N극을 나침반에 가까이 하면 나침반 바늘의 빨간색 부분이 막대자석 쪽을 가리킵니다.\n(2) 막대자석을 나침반에서 멀리 치우면 나침반 바늘은 다시 북쪽과 남쪽을 가리킵니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "(1) × (2) ○",
      "accepted": [
        "(1) × (2) ○",
        "×, ○",
        "× ○",
        "X, O",
        "(1) X (2) O"
      ]
    },
    "explanation": "나침반 바늘도 자석이라 막대자석의 N극을 가까이 하면 바늘의 N극이 밀려 바늘의 S극이 막대자석 쪽을 가리켜요. 막대자석을 치우면 바늘은 다시 북쪽과 남쪽을 가리켜요.",
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
    "id": "s41-mid-v011",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "자석을 나침반에 가까이 했을 때 나침반 바늘이 움직이는 까닭을 설명한 것입니다. <보기>에서 알맞지 않은 것을 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 나침반 바늘은 자석이어서 가까이 한 자석의 극에 따라 가리키는 방향이 바뀐다.",
        "ㄴ. 나침반 바늘의 N극은 가까이 한 막대자석의 S극 쪽으로 끌려간다.",
        "ㄷ. 나침반 바늘은 자석의 N극과 S극에 상관없이 언제나 자석 쪽으로 끌려간다."
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
    "explanation": "나침반 바늘은 자석이어서 같은 극은 밀어 내고 다른 극은 끌어당겨요. 철이라면 어느 극에나 끌려가겠지만, 바늘은 가까이 한 극에 따라 방향이 달라져요.",
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
    "id": "s41-mid-v012",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 빈칸에 공통으로 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "• 가방 덮개 안쪽에 □을/를 넣고 몸통에 얇은 철판을 대어 두면 덮개가 저절로 착 닫힙니다.\n• 클립 통 뚜껑에 □을/를 달아 두면 통을 흔들어도 철 클립이 뚜껑에 붙어 한 번에 꺼낼 수 있습니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "자석",
      "accepted": [
        "자석"
      ]
    },
    "explanation": "가방 덮개와 클립 통 뚜껑에 넣은 자석이 철로 만든 물체를 끌어당기는 성질을 이용한 예예요.",
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
    "id": "s41-mid-v013",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 <보기>에서 수증기에 대한 설명으로 알맞은 것을 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 고체 상태이다.",
        "ㄴ. 흐르는 성질이 있어 담는 그릇에 따라 모양이 변한다.",
        "ㄷ. 눈에 보이지 않는 기체 상태이다.",
        "ㄹ. 차갑고 단단해서 손으로 잡을 수 있다."
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
        "눈에 보이지 않는 기체 상태이다"
      ]
    },
    "explanation": "수증기는 기체 상태라서 눈에 보이지 않고 손으로 잡을 수 없어요. 흐르는 것은 물(액체), 단단한 것은 얼음(고체)이에요.",
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
    "id": "s41-mid-v014",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 <보기>에서 물의 상태 변화에 대한 알맞은 설명을 모두 고른 것은 어느 것인가요?",
    "givens": {
      "보기": [
        "ㄱ. 물은 수증기로 변할 수 있다.",
        "ㄴ. 수증기는 다시 물로 변할 수 없다.",
        "ㄷ. 얼음이 녹아 물이 되는 것도 물의 상태 변화이다.",
        "ㄹ. 물이 얼어 얼음이 되어도 같은 물이다."
      ]
    },
    "choices": [
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄷ, ㄹ",
      "ㄴ, ㄷ, ㄹ",
      "ㄱ, ㄴ, ㄷ, ㄹ"
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
    "explanation": "물은 얼음·물·수증기 사이에서 서로 상태가 변할 수 있고, 상태가 변해도 같은 물이에요. 수증기도 차가워지면 다시 물로 변해요.",
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
    "id": "s41-mid-v015",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물의 상태 변화가 나머지 넷과 다른 것은 어느 것인가요?",
    "givens": null,
    "choices": [
      "차가운 물병을 꺼내 두면 겉면에 물방울이 맺힌다.",
      "맑은 날 새벽 풀잎에 이슬이 맺힌다.",
      "뜨거운 국을 먹을 때 안경알이 뿌옇게 흐려진다.",
      "햇볕이 드는 곳에 둔 젖은 운동화가 마른다.",
      "샤워를 한 뒤 욕실 거울에 물방울이 맺힌다."
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
    "explanation": "젖은 운동화가 마르는 것은 물이 수증기로 변하는 증발이에요. 나머지는 모두 공기 중의 수증기가 물로 변하는 응결이에요.",
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
    "id": "s41-mid-v016",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "작은 페트병에 물을 반쯤 넣고 물 높이를 표시한 뒤 마개를 닫았습니다(가). 이 병을 냉동실에 넣어 물을 완전히 얼린 뒤 높이를 표시하고(나), 다시 꺼내 얼음을 모두 녹인 뒤 높이를 표시했습니다(다). 이에 대한 설명으로 알맞은 것은 어느 것인가요?",
    "givens": null,
    "choices": [
      "(나)는 (가)보다 낮고, (다)는 (가)와 높이가 같습니다.",
      "(나)는 (가)보다 높고, (다)는 (나)보다 더 높습니다.",
      "(나)는 (가)보다 높고, (다)는 (가)와 높이가 같습니다.",
      "(다)는 (나)와 높이가 같고, (가)보다 높습니다.",
      "얼렸다 녹여도 (가), (나), (다)의 높이는 모두 같습니다."
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
    "explanation": "물이 얼면 부피가 늘어나 높이가 높아지고, 얼음이 녹으면 늘어난 만큼 부피가 줄어 처음 높이로 돌아와요.",
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
    "id": "s41-mid-v017",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T09",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물을 담고 뚜껑을 꼭 닫은 플라스틱 통의 무게를 잰 뒤, 냉동실에서 물을 얼려 겉의 물기를 닦고 다시 무게를 쟀습니다. 그다음 얼음을 모두 녹여 겉의 물기를 닦고 또 무게를 쟀습니다. 세 번 잰 무게는 어떻게 되는지 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "물이 얼거나 얼음이 녹아도 무게는 변하지 않으므로 세 번 잰 무게는 모두 같아요.",
      "rubric": {
        "required": [
          "무게가 변하지 않는다(세 번 잰 무게가 같다)"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "물이 얼면 부피는 늘어나고 얼음이 녹으면 부피는 줄어들지만, 물의 양은 그대로라서 무게는 변하지 않아요.",
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
    "id": "s41-mid-v018",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물이 얼거나 얼음이 녹을 때의 부피 변화와 관련된 예로 알맞지 않은 것은 어느 것인가요?",
    "givens": null,
    "choices": [
      "추운 겨울밤 밖에 둔 유리병 속 물이 얼어 병에 금이 간다.",
      "물을 가득 채워 얼린 얼음과자 봉지가 빵빵하게 부푼다.",
      "겨울에 도로 틈에 스며든 물이 얼면서 도로가 갈라진다.",
      "얼어서 뚱뚱해졌던 페트병 속 얼음이 녹으면 병이 다시 홀쭉해진다.",
      "컵에 수북이 쌓은 각얼음이 녹으면 얼음 높이가 처음보다 높아진다."
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
    "explanation": "얼음이 녹으면 부피가 줄어들기 때문에 수북이 쌓은 각얼음이 녹으면 높이는 낮아져요. 나머지는 물이 얼 때 부피가 늘어나거나 녹을 때 줄어드는 알맞은 예예요.",
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
    "id": "s41-mid-v019",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "증발과 관련된 예로 알맞지 않은 것은 어느 것인가요?",
    "givens": null,
    "choices": [
      "국수를 삶으려고 냄비의 물을 펄펄 끓인다.",
      "젖은 머리카락을 그늘에서 말린다.",
      "감을 깎아 바람이 잘 통하는 곳에 매달아 곶감을 만든다.",
      "비가 온 뒤 운동장의 물웅덩이가 점점 작아진다.",
      "물감으로 그린 그림이 시간이 지나면 마른다."
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
    "explanation": "냄비의 물을 펄펄 끓이는 것은 물속에서도 수증기가 생기는 끓음이에요. 나머지는 물 표면에서 물이 천천히 수증기로 변하는 증발의 예예요.",
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
    "id": "s41-mid-v020",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 ㉠, ㉡에 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "주전자의 물을 가열하면 물속에서 기포가 생기며 물이 수증기로 빠르게 변하는데, 이것을 ㉠(이)라고 합니다. 가열하지 않아도 컵에 담긴 물의 표면에서 물이 수증기로 천천히 변하는 것은 ㉡(이)라고 합니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 끓음, ㉡ 증발",
      "accepted": [
        "㉠ 끓음, ㉡ 증발",
        "끓음, 증발",
        "끓음 증발",
        "ㄱ 끓음, ㄴ 증발",
        "㉠끓음 ㉡증발"
      ]
    },
    "explanation": "물속에서 기포가 생기며 빠르게 수증기로 변하는 것은 끓음, 가열하지 않아도 물 표면에서 천천히 수증기로 변하는 것은 증발이에요.",
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
    "id": "s41-mid-v021",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 21
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 <보기>에서 증발과 끓음에 대한 알맞은 설명을 모두 고른 것은 어느 것인가요?",
    "givens": {
      "보기": [
        "ㄱ. 끓음은 물 표면뿐 아니라 물속에서도 물이 수증기로 변한다.",
        "ㄴ. 증발은 물을 가열해야만 일어난다.",
        "ㄷ. 증발과 끓음 모두 물이 수증기로 변해 물의 양이 줄어든다."
      ]
    },
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
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
    "explanation": "끓음은 물 표면과 물속에서 모두 물이 수증기로 변하고, 증발과 끓음 모두 물의 양이 줄어요. 증발은 가열하지 않아도 일어나요.",
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
    "id": "s41-mid-v022",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 22
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "얼음물이 든 금속 컵을 접시 위에 올려 두었더니 시간이 지나자 컵 바깥쪽에 물방울이 맺히고 접시에 물이 고였습니다. 이 현상과 관련된 물의 상태 변화로 알맞은 것은 어느 것인가요?",
    "givens": null,
    "choices": [
      "얼음이 녹아 물이 되었다.",
      "수증기가 응결해 물이 되었다.",
      "물이 증발해 수증기가 되었다.",
      "물이 얼어 얼음이 되었다.",
      "물이 끓어 수증기가 되었다."
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
    "explanation": "공기 중의 수증기가 차가운 컵 바깥쪽에 닿아 물방울로 변한 것이니 응결이에요. 컵 안의 물이 새어 나온 것이 아니에요.",
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
    "id": "s41-mid-v023",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 23
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 <보기>에서 응결과 관련된 예로 알맞지 않은 것을 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 추운 날 입김을 불면 하얗게 보인다.",
        "ㄴ. 고추를 햇볕에 널어 말린다.",
        "ㄷ. 냉장고에서 꺼낸 물병 겉면에 물방울이 맺힌다.",
        "ㄹ. 이른 아침 강가에 안개가 낀다."
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
    "explanation": "고추를 햇볕에 말리는 것은 고추 속 물이 수증기로 변하는 증발이에요. 입김·물병 겉면의 물방울·안개는 수증기가 물로 변하는 응결이에요.",
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
    "id": "s41-mid-v024",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 24
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물을 이용하는 예를 잘못 말한 사람의 이름을 쓰세요.",
    "givens": {
      "지문": "• 민수: 농작물을 기를 때 물을 이용합니다.\n• 서연: 불이 났을 때 불을 끄는 데 물을 이용합니다.\n• 지호: 키를 비교하려고 길이를 잴 때 물을 이용합니다.\n• 하은: 우리 몸이 살아가는 데 물이 필요합니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "지호",
      "accepted": [
        "지호"
      ]
    },
    "explanation": "물은 농사, 불 끄기, 생물이 살아가는 데 쓰여요. 키를 비교할 때 길이를 재는 데는 자를 써요.",
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
    "id": "s41-mid-v025",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 25
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 물 부족 현상을 해결하기 위한 장치에 대한 설명입니다. 빈칸에 공통으로 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "• 솔라볼: 공 모양 장치 안에 더러운 물을 넣어 두면 햇빛을 받은 물이 □하여 수증기가 되고, 이 수증기가 장치 벽에서 물방울로 맺혀 깨끗한 물이 모입니다.\n• 워터콘: 더러운 물 위에 덮어 두면 햇빛을 받은 물이 □하여 수증기가 되고, 이 수증기가 벽면에서 물방울로 맺혀 흘러내립니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "증발",
      "accepted": [
        "증발"
      ]
    },
    "explanation": "솔라볼과 워터콘은 햇빛으로 물을 증발시켜 수증기로 만든 뒤, 그 수증기를 다시 물방울로 응결시켜 깨끗한 물을 모아요.",
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
    "id": "s41-mid-v026",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "고무 자석을 가까이 했을 때 자석에 붙는 물체를 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "알루미늄 캔",
      "철 나사",
      "플라스틱 자",
      "철 옷핀",
      "유리컵"
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
    "explanation": "철로 만든 철 나사와 철 옷핀은 자석에 붙어요. 알루미늄·플라스틱·유리로 만든 물체는 자석에 붙지 않아요.",
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
    "id": "s41-mid-v027",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 자석 낚시 놀이에 대한 설명입니다. 빈칸에 공통으로 들어갈 알맞은 말은 어느 것인가요?",
    "givens": {
      "지문": "• 종이 물고기에 □(으)로 만든 클립을 끼우면 자석 낚싯대에 물고기가 붙어 올라옵니다.\n• □(으)로 만든 클립 대신 플라스틱 클립을 끼우면 물고기가 자석 낚싯대에 붙지 않습니다."
    },
    "choices": [
      "철",
      "구리",
      "고무",
      "나무",
      "알루미늄"
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
    "explanation": "자석은 철로 만든 물체만 끌어당겨요. 그래서 철 클립을 끼운 물고기만 자석 낚싯대에 붙어 올라와요.",
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
    "id": "s41-mid-v028",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "얇은 플라스틱 책받침 위에 철 나사를 올려놓고, 책받침 아래쪽에 막대자석을 대고 이리저리 움직였습니다. 이때 철 나사의 움직임을 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "철 나사가 책받침 아래의 자석에 끌려 자석이 움직이는 대로 따라 움직여요.",
      "rubric": {
        "required": [
          "철 나사가 자석에 끌려 자석을 따라 움직인다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "자석과 철 사이에 플라스틱처럼 자석에 붙지 않는 물체가 있어도 끌어당기는 힘이 작용해서 철 나사가 자석을 따라 움직여요.",
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
    "id": "s41-mid-v029",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 <보기>에서 자석과 철 못 사이에 작용하는 힘에 대한 알맞은 설명을 모두 고른 것은 어느 것인가요?",
    "givens": {
      "보기": [
        "ㄱ. 자석과 철 못 사이에 얇은 나무판을 끼워도 철 못이 끌려온다.",
        "ㄴ. 자석과 철 못이 조금 떨어져 있으면 서로 밀어 낸다.",
        "ㄷ. 자석은 철 못을 끌어당긴다.",
        "ㄹ. 자석과 철 못 사이에 종이를 끼우면 끌어당기는 힘이 사라진다."
      ]
    },
    "choices": [
      "ㄱ, ㄴ",
      "ㄱ, ㄷ",
      "ㄴ, ㄹ",
      "ㄷ, ㄹ",
      "ㄱ, ㄷ, ㄹ"
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
    "explanation": "자석은 철 못을 끌어당기고, 사이에 나무판이 있어도 끌어당기는 힘이 작용해요. 조금 떨어져 있거나 종이를 끼워도 힘은 사라지지 않아요.",
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
    "id": "s41-mid-v030",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "말굽자석을 철 클립이 든 그릇에 넣었다가 천천히 들어 올렸습니다. 말굽자석의 (가) 휘어진 가운데 부분, (나) 왼쪽 끝부분, (다) 오른쪽 끝부분 중 철 클립이 많이 붙는 부분을 모두 고른 것은 어느 것인가요?",
    "givens": null,
    "choices": [
      "(가)",
      "(나)",
      "(가), (나)",
      "(나), (다)",
      "(가), (나), (다)"
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
    "explanation": "말굽자석도 양쪽 끝부분이 극이라서 철 클립이 많이 붙어요. 휘어진 가운데 부분에는 거의 붙지 않아요.",
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
    "id": "s41-mid-v031",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "고리 자석과 둥근기둥 자석처럼 모양이 다른 자석에도 철 클립이 가장 많이 붙는 부분이 두 군데씩 있습니다. 이 부분을 자석의 무엇이라고 하는지 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "극",
      "accepted": [
        "극",
        "자석의 극",
        "자석의극"
      ]
    },
    "explanation": "자석에서 철로 만든 물체가 가장 많이 붙는 부분을 극이라고 해요. 자석의 모양이 달라도 극은 항상 두 군데예요.",
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
    "id": "s41-mid-v032",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "두 자석을 마주 보게 놓았을 때 서로 밀어 내는 경우를 <보기>에서 모두 고른 것은 어느 것인가요?",
    "givens": {
      "보기": [
        "ㄱ. N극과 S극",
        "ㄴ. S극과 S극",
        "ㄷ. N극과 N극"
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
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "같은 극끼리는 서로 밀어 내고 다른 극끼리는 서로 끌어당겨요. S극과 S극, N극과 N극이 같은 극이에요.",
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
    "id": "s41-mid-v033",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "막대에 고리 자석 ㉠, ㉡, ㉢을 위에서부터 차례로 끼웠더니 ㉠은 ㉡ 위에 떠 있고, ㉡과 ㉢은 서로 딱 붙었습니다. 극이 같은 면끼리 알맞게 짝 지은 것을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "㉠의 아랫면 - ㉡의 윗면",
      "㉡의 아랫면 - ㉢의 윗면",
      "㉠의 윗면 - ㉡의 아랫면",
      "㉠의 아랫면 - ㉢의 아랫면",
      "㉡의 윗면 - ㉡의 아랫면"
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
    "explanation": "㉠이 떠 있으니 ㉠의 아랫면과 ㉡의 윗면은 같은 극이고, 그 반대쪽인 ㉠의 윗면과 ㉡의 아랫면도 같은 극이에요. 붙어 있는 ㉡의 아랫면과 ㉢의 윗면은 다른 극이에요.",
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
    "id": "s41-mid-v034",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 실에 매단 막대자석에 대한 설명입니다. ㉠~㉢에 들어갈 말을 알맞게 짝 지은 것은 어느 것인가요?",
    "givens": {
      "지문": "• 실에 매달아 자유롭게 움직이게 한 막대자석이 멈추면 ㉠극은 북쪽을, ㉡극은 남쪽을 가리킵니다.\n• 이 성질을 이용하면 자석으로 ㉢을/를 찾을 수 있습니다."
    },
    "choices": [
      "N / S / 무게",
      "S / N / 방향",
      "S / N / 무게",
      "N / N / 방향",
      "N / S / 방향"
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
    "explanation": "자유롭게 움직이는 자석은 N극이 북쪽, S극이 남쪽을 가리키므로 이 성질로 방향을 찾을 수 있어요.",
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
    "id": "s41-mid-v035",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "나침반의 서쪽에서 막대자석의 N극을 나침반 쪽으로 가까이 가져갔습니다. 나침반 바늘의 움직임으로 알맞은 것을 두 가지 고르세요. (나침반 바늘의 빨간색 부분은 N극입니다.) (정답 2개)",
    "givens": null,
    "choices": [
      "나침반 바늘의 S극이 막대자석 쪽을 가리킵니다.",
      "나침반 바늘의 N극이 막대자석 쪽을 가리킵니다.",
      "나침반 바늘의 빨간색 부분이 동쪽을 가리킵니다.",
      "나침반 바늘이 멈추지 않고 계속 빙글빙글 돕니다.",
      "나침반 바늘은 움직이지 않고 그대로 북쪽을 가리킵니다."
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
    "explanation": "막대자석의 N극은 바늘의 N극을 밀어 내고 S극을 끌어당겨요. 그래서 바늘의 S극이 서쪽의 막대자석 쪽을, 빨간색 N극이 반대쪽인 동쪽을 가리켜요.",
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
    "id": "s41-mid-v036",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "왼쪽이 N극, 오른쪽이 S극인 막대자석 주위에 나침반을 놓았습니다. 나침반 바늘의 모습을 잘못 설명한 것을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "N극 바로 왼쪽에 놓은 나침반은 바늘의 S극이 막대자석 쪽을 가리킵니다.",
      "S극 바로 오른쪽에 놓은 나침반은 바늘의 S극이 막대자석 쪽을 가리킵니다.",
      "S극 아래쪽 가까이 놓은 나침반은 바늘의 N극이 S극 쪽을 향합니다.",
      "N극 위쪽 가까이 놓은 나침반은 바늘의 N극이 N극 쪽을 향합니다.",
      "막대자석을 치우면 나침반 바늘은 다시 북쪽과 남쪽을 가리킵니다."
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
    "explanation": "나침반 바늘도 자석이라 막대자석의 N극 쪽에는 바늘의 S극이, S극 쪽에는 바늘의 N극이 끌려와요. 같은 극끼리 마주 보는 모습은 잘못된 거예요.",
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
    "id": "s41-mid-v037",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 자석 비누 걸이에 대한 설명입니다. 빈칸에 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "자석 비누 걸이는 벽에 붙인 자석이 비누에 박아 넣은 작은 □ 조각을 끌어당겨 비누를 공중에 매달아 둡니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "철",
      "accepted": [
        "철"
      ]
    },
    "explanation": "자석 비누 걸이는 자석이 철로 만든 물체를 끌어당기는 성질을 이용해 비누에 박은 철 조각을 붙잡아요.",
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
    "id": "s41-mid-v038",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 <보기>에서 물의 세 가지 상태에 대한 알맞은 설명을 모두 고른 것은 어느 것인가요?",
    "givens": {
      "보기": [
        "ㄱ. 얼음은 손으로 잡을 수 있다.",
        "ㄴ. 수증기는 담는 그릇에 따라 모양이 변하는 액체이다.",
        "ㄷ. 물은 모양이 일정하다.",
        "ㄹ. 수증기는 눈에 보이지 않는다."
      ]
    },
    "choices": [
      "ㄱ, ㄴ",
      "ㄱ, ㄹ",
      "ㄴ, ㄷ",
      "ㄷ, ㄹ",
      "ㄱ, ㄷ, ㄹ"
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
    "explanation": "얼음은 모양이 일정해 손으로 잡을 수 있고, 수증기는 눈에 보이지 않는 기체예요. 물은 흐르는 액체라 그릇에 따라 모양이 변해요.",
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
    "id": "s41-mid-v039",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 현상과 관련 있는 물의 상태 변화를 알맞게 짝 지은 것은 어느 것인가요?",
    "givens": {
      "지문": "㉠ 물이 얼음으로 변한다.\n㉡ 수증기가 물로 변한다."
    },
    "choices": [
      "고체 → 액체 / 액체 → 기체",
      "액체 → 기체 / 고체 → 액체",
      "액체 → 고체 / 기체 → 액체",
      "고체 → 기체 / 액체 → 고체",
      "기체 → 고체 / 액체 → 기체"
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
    "explanation": "물(액체)이 얼음(고체)이 되는 것은 액체 → 고체, 수증기(기체)가 물(액체)이 되는 것은 기체 → 액체예요.",
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
    "id": "s41-mid-v040",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "얼음이 물로 상태가 변하는 것과 관련된 예로 알맞은 것은 어느 것인가요?",
    "givens": null,
    "choices": [
      "추운 날 처마 끝에 고드름이 생긴다.",
      "봄이 되면 산에 쌓인 눈이 녹아 계곡물이 불어난다.",
      "냉장고에서 꺼낸 음료수병 겉면에 물방울이 맺힌다.",
      "젖은 수건을 널어 두면 수건이 마른다.",
      "주전자의 물이 끓어 물의 양이 줄어든다."
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
    "explanation": "눈은 얼음과 같은 고체라서 눈이 녹아 물이 되는 것이 얼음이 물로 변하는 예예요. 고드름은 물이 얼음으로, 물방울은 수증기가 물로, 마르거나 끓는 것은 물이 수증기로 변하는 예예요.",
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
    "id": "s41-mid-v041",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "추운 겨울밤 물이 가득 찬 수도관이 터지는 까닭으로 알맞은 것은 어느 것인가요?",
    "givens": null,
    "choices": [
      "물이 얼면 부피가 늘어나기 때문입니다.",
      "물이 얼면 무게가 늘어나기 때문입니다.",
      "물이 얼면 부피가 줄어들기 때문입니다.",
      "물이 얼면 무게가 줄어들기 때문입니다.",
      "얼음이 녹으며 부피가 늘어나기 때문입니다."
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
    "explanation": "물이 얼어 얼음이 되면 무게는 그대로지만 부피가 늘어나서 수도관을 밀어 터뜨릴 수 있어요.",
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
    "id": "s41-mid-v042",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 실험을 보고, 결과의 빈칸에 들어갈 알맞은 숫자를 쓰세요.",
    "givens": {
      "지문": "<과정>\n㉠ 뚜껑을 닫은 플라스틱 통에 든 얼음의 무게를 통째로 잽니다.\n㉡ 얼음이 모두 녹을 때까지 그대로 둡니다.\n㉢ 통 겉에 맺힌 물기를 닦고 다시 무게를 잽니다.\n<결과>\n• ㉠에서 잰 무게: 86 g\n• ㉢에서 잰 무게: □ g"
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "86",
      "accepted": [
        "86",
        "86 g",
        "86g"
      ]
    },
    "explanation": "얼음이 녹아 물이 되어도 무게는 변하지 않아요. 그래서 ㉢에서 잰 무게도 ㉠과 같은 86 g이에요.",
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
    "id": "s41-mid-v043",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "부피 변화가 나머지 넷과 다른 것은 어느 것인가요?",
    "givens": null,
    "choices": [
      "컵 위로 수북이 쌓아 둔 각얼음이 녹으면 컵 속 높이가 낮아진다.",
      "얼려서 빵빵해졌던 우유 팩을 녹이면 다시 홀쭉해진다.",
      "얼음이 가득 찬 물병이 녹고 나면 병 위쪽에 빈 공간이 생긴다.",
      "꽁꽁 얼린 생수병을 녹이면 병 속 높이가 얼음일 때보다 낮아진다.",
      "물을 가득 채운 유리병을 냉동실에서 얼리면 병에 금이 간다."
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
    "explanation": "물을 가득 채운 유리병이 얼어 금이 가는 것은 물이 얼 때 부피가 늘어나기 때문이에요. 나머지는 얼음이 녹아 부피가 줄어드는 예예요.",
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
    "id": "s41-mid-v044",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T10",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "끓음이란 무엇인지 쓰고, 우리 생활에서 끓음과 관련된 예를 한 가지 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "물 표면과 물속에서 모두 물이 수증기로 상태가 변하는 현상을 끓음이라고 해요. 예) 라면을 끓일 때 냄비의 물을 끓인다.",
      "rubric": {
        "required": [
          "물 표면과 물속에서 모두 물이 수증기로 변하는 현상이다",
          "끓음과 관련된 생활 속 예"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "끓음은 물 표면과 물속에서 모두 물이 수증기로 빠르게 변하는 현상이에요. 라면·국수·달걀을 삶거나 보리차를 끓이는 것이 끓음의 예예요.",
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
    "id": "s41-mid-v045",
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
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물이 담긴 냄비를 가열해 물이 끓을 때의 모습을 바르게 말한 사람의 이름을 쓰세요.",
    "givens": {
      "지문": "• 민준: 기포는 물 표면에서만 생기고 물속에서는 생기지 않아요.\n• 서아: 물이 끓은 뒤에는 냄비 속 물의 양이 처음보다 줄어들어요.\n• 도윤: 물이 끓어도 냄비 속 물의 양은 변하지 않아요."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "서아",
      "accepted": [
        "서아"
      ]
    },
    "explanation": "물이 끓으면 물 표면과 물속에서 물이 수증기로 변해 공기 중으로 날아가기 때문에 냄비 속 물의 양이 줄어들어요.",
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
    "id": "s41-mid-v046",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 21
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "증발과 끓음의 차이점으로 알맞은 것은 어느 것인가요?",
    "givens": null,
    "choices": [
      "증발은 물 표면에서, 끓음은 물 표면과 물속에서 일어납니다.",
      "증발은 기체가 액체로, 끓음은 액체가 기체로 변하는 현상입니다.",
      "증발은 물속에서만, 끓음은 물 표면에서만 상태 변화가 일어납니다.",
      "증발은 끓음보다 물의 양이 훨씬 빠르게 줄어드는 현상입니다.",
      "증발은 가열해야만 일어나고, 끓음은 가열하지 않아도 일어납니다."
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
    "explanation": "증발과 끓음은 모두 물이 수증기로 변하지만, 증발은 물 표면에서 천천히, 끓음은 물 표면과 물속에서 빠르게 일어나요.",
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
    "id": "s41-mid-v047",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 22
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 겨울철 따뜻한 방의 유리창 안쪽에 물방울이 맺히는 까닭입니다. ㉠, ㉡에 들어갈 말을 알맞게 짝 지은 것은 어느 것인가요?",
    "givens": {
      "지문": "방 안 공기 중의 ㉠이/가 차가운 유리창에 닿아 ㉡하여 물로 변하기 때문입니다."
    },
    "choices": [
      "수증기 / 증발",
      "얼음 / 응결",
      "수증기 / 응결",
      "물 / 끓음",
      "수증기 / 끓음"
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
    "explanation": "방 안 공기 중의 수증기가 차가운 유리창에 닿아 응결하여 물방울로 변하기 때문이에요.",
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
    "id": "s41-mid-v048",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 23
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 예와 관련된 물의 상태 변화로 알맞은 것은 어느 것인가요?",
    "givens": {
      "지문": "맑은 날 이른 아침, 공원의 풀잎에 이슬이 송골송골 맺혀 있습니다."
    },
    "choices": [
      "고체 → 액체",
      "액체 → 고체",
      "액체 → 기체",
      "기체 → 고체",
      "기체 → 액체"
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
    "explanation": "이슬은 밤사이 차가워진 풀잎에 공기 중의 수증기(기체)가 닿아 물방울(액체)로 맺힌 것이라 기체 → 액체인 응결이에요.",
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
    "id": "s41-mid-v049",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 24
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물이 부족해지면 나타날 수 있는 일을 바르게 말한 사람을 모두 고른 것은 어느 것인가요?",
    "givens": {
      "지문": "• 지우: 공장에서 물건을 만들기 어려워질 거예요.\n• 태오: 식물이 잘 자라지 못하고 시들 거예요.\n• 수아: 물을 마음껏 쓸 수 있어 물을 아낄 필요가 없어질 거예요."
    },
    "choices": [
      "지우",
      "태오",
      "지우, 태오",
      "태오, 수아",
      "지우, 태오, 수아"
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
    "explanation": "물은 공장에서 물건을 만들고 식물이 자라는 데 꼭 필요해서 물이 부족하면 둘 다 어려워져요. 물이 부족하면 물을 더 아껴 써야 해요.",
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
    "id": "s41-mid-v050",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 25
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 물 부족 현상을 해결하기 위한 장치에 대한 설명입니다. <보기>에서 이 장치로 알맞은 것을 골라 기호를 쓰세요.",
    "givens": {
      "지문": "높이 세운 그물망에 공기 중의 수증기가 물방울로 맺히고, 이 물방울이 아래 그릇으로 모여 마실 물을 얻을 수 있습니다.",
      "보기": [
        "ㄱ. 해수 담수화 시설",
        "ㄴ. 솔라볼",
        "ㄷ. 와카워터",
        "ㄹ. 정수기"
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
        "와카워터",
        "ㄷ 와카워터"
      ]
    },
    "explanation": "와카워터는 공기 중의 수증기가 그물망에 응결해 맺힌 물방울을 모아 마실 물을 얻는 장치예요.",
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
