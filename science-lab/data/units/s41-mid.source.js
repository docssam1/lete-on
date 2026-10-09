// 4-1 Ⅳ 중간평가 — 단원평가 원문 50문항(시매쓰DMC 중간평가 세트1·2). 시험지를 그대로 옮기고 정답 및 풀이와 대조했다.
// 원장 지시(2026-10-09): 원문을 그대로 문제은행에 쓴다. 그림은 시험지에서 잘라 낸 것(assets/bank/s41-mid/).
export const source = [
  {
    "id": "s41-mid-o1-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 1,
      "page": 1,
      "sourceId": "sci-41-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "자석에 붙는 물체 고르기",
      "concept": "철로 만든 물체는 자석에 붙고 나무·플라스틱·알루미늄으로 만든 물체는 붙지 않는다."
    },
    "prompt": "다음 <보기>에서 자석에 붙는 물체를 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 나무 구슬",
        "㉡ 철 머리핀",
        "㉢ 플라스틱 컵",
        "㉣ 알루미늄 캔"
      ]
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉡",
      "accepted": [
        "㉡",
        "ㄴ",
        "철 머리핀"
      ]
    },
    "explanation": "철로 만든 철 머리핀은 자석에 붙고, 나무로 만든 나무 구슬, 플라스틱으로 만든 플라스틱 컵, 알루미늄으로 만든 알루미늄 캔은 자석에 붙지 않습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>는 2열 배치(㉠ 나무 구슬, ㉡ 철 머리핀 / ㉢ 플라스틱 컵, ㉣ 알루미늄 캔)."
    }
  },
  {
    "id": "s41-mid-o1-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 2,
      "page": 1,
      "sourceId": "sci-41-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "자석에 붙는 물체의 특징",
      "concept": "물체가 자석에 붙는지는 물체를 이루는 물질에 따라 정해지며, 여러 물질로 된 물체는 철로 된 부분만 자석에 붙는다."
    },
    "prompt": "자석에 붙는 물체에 대한 설명으로 알맞지 않은 것을 두 가지 고르시오.",
    "givens": null,
    "choices": [
      "철로 만든 물체는 자석에 붙습니다.",
      "유리로 만든 물체는 자석에 붙습니다.",
      "종이로 만든 물체는 자석에 붙지 않습니다.",
      "여러 가지 물질로 만들어진 물체는 철로 만들어진 부분도 자석에 붙지 않습니다.",
      "물체를 이루는 물질의 종류에 따라 자석에 붙는 물체도 있고, 붙지 않는 물체도 있습니다."
    ],
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
      ]
    },
    "explanation": "철로 만든 물체는 자석에 붙고, 종이, 고무, 나무, 유리, 플라스틱, 알루미늄 등으로 만든 물체는 자석에 붙지 않습니다. 여러 가지 물질로 만들어진 물체는 철로 만들어진 부분만 자석에 붙습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄."
    }
  },
  {
    "id": "s41-mid-o1-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 3,
      "page": 1,
      "sourceId": "sci-41-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "자석과 물체 사이에 작용하는 힘",
      "concept": "자석은 떨어져 있거나 사이에 자석에 붙지 않는 물체가 있어도 자석에 붙는 물체를 끌어당긴다."
    },
    "prompt": "다음 <보기>에서 자석과 자석에 붙는 물체 사이에 작용하는 힘에 대한 알맞은 설명을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 자석과 자석에 붙는 물체는 약간 떨어져 있어도 서로 끌어당긴다.",
        "㉡ 자석과 자석에 붙는 물체 사이에는 서로 끌어당기는 힘이 작용한다.",
        "㉢ 자석과 자석에 붙는 물체 사이에 플라스틱판이 있으면 자석과 자석에 붙는 물체는 서로 끌어당기지 않는다."
      ]
    },
    "choices": [
      "㉠",
      "㉡",
      "㉠, ㉡",
      "㉡, ㉢",
      "㉠, ㉡, ㉢"
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "자석과 자석에 붙는 물체 사이에 자석에 붙지 않는 다른 물체가 있어도 자석과 자석에 붙는 물체는 서로 끌어당깁니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-mid-o1-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 4,
      "page": 1,
      "sourceId": "sci-41-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "막대자석에 철 클립이 붙는 위치",
      "concept": "막대자석은 양쪽 끝부분(극)에 철로 만든 물체가 가장 많이 붙는다."
    },
    "prompt": "철 클립이 가득 든 그릇에 막대자석을 넣었다가 천천히 들어 올렸습니다. 이에 대한 설명으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "막대자석에 철 클립이 붙지 않는다.",
      "막대자석 전체에 철 클립이 많이 붙는다.",
      "막대자석의 가운데 부분에 철 클립이 많이 붙는다.",
      "막대자석의 양쪽 끝부분에 철 클립이 많이 붙는다.",
      "막대자석의 한쪽 끝부분에만 철 클립이 많이 붙는다."
    ],
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
    "explanation": "철 클립이 든 종이 그릇에 막대자석을 넣었다가 들어 올리면 막대자석의 양쪽 끝 부분에 철 클립이 많이 붙습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "해설은 '종이 그릇', 문제는 '그릇'으로 표현이 다름. 해설은 '양쪽 끝 부분'(띄어 씀), 보기 ④는 '양쪽 끝부분'."
    }
  },
  {
    "id": "s41-mid-o1-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 5,
      "page": 1,
      "sourceId": "sci-41-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "자석의 극의 뜻",
      "concept": "자석의 극은 철로 만든 물체가 가장 많이 붙는 부분이며 N극과 S극 두 군데가 있다."
    },
    "prompt": "자석의 극이란 무엇인지 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "자석에서 철로 만든 물체가 가장 많이 붙는 부분이다.",
      "rubric": {
        "required": [
          "자석에서 철로 만든 물체가 가장 많이 붙는 부분"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "자석의 극에 대해 바르게 썼으면 정답으로 합니다. (100%)"
        ]
      }
    },
    "explanation": "자석에서 철로 만든 물체가 가장 많이 붙는 부분을 자석의 극이라고 합니다. 자석의 극은 항상 두 군데 있으며, 각각 N극과 S극으로 나타냅니다.\n[채점 기준] 자석의 극에 대해 바르게 썼으면 정답으로 합니다. (100%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준에 비율 표기가 없음(단일 기준이라 100%로 기록)."
    }
  },
  {
    "id": "s41-mid-o1-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 6,
      "page": 1,
      "sourceId": "sci-41-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "자석의 극 사이에 작용하는 힘",
      "concept": "자석의 같은 극끼리는 밀어 내고 다른 극끼리는 끌어당긴다."
    },
    "prompt": "다음 <보기>에서 자석과 자석 사이에 작용하는 힘이 같은 것끼리 알맞게 짝 지은 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ S극과 S극을 가까이 할 때",
        "㉡ N극과 S극을 가까이 할 때",
        "㉢ S극과 N극을 가까이 할 때",
        "㉣ N극과 N극을 가까이 할 때"
      ]
    },
    "choices": [
      "㉠, ㉡",
      "㉠, ㉢",
      "㉡, ㉢",
      "㉡, ㉣",
      "㉠, ㉡, ㉢"
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "자석의 같은 극끼리 가까이 하면 서로 밀어 내는 힘이 작용하고, 자석의 다른 극끼리 가까이 하면 서로 끌어당기는 힘이 작용합니다. ㉠과 ㉣은 서로 밀어 내는 힘이 작용하고, ㉡과 ㉢은 서로 끌어당기는 힘이 작용합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-mid-o1-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 7,
      "page": 2,
      "sourceId": "sci-41-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "고리 자석 탑 쌓기",
      "concept": "고리 자석을 같은 극끼리 마주 보게 쌓으면 밀어 내는 힘 때문에 탑이 높아지고, 다른 극끼리는 끌어당겨 낮아진다."
    },
    "prompt": "다음은 고리 자석 탑에 대한 설명입니다. ㉠, ㉡에 들어갈 알맞은 말을 골라 쓰시오.",
    "givens": {
      "지문": "• 고리 자석을 서로 같은 극끼리 마주 보게 쌓으면 가장 ㉠ ( 낮은, 높은 ) 탑을 쌓을 수 있습니다.\n• 고리 자석을 서로 다른 극끼리 마주 보게 쌓으면 가장 ㉡ ( 낮은, 높은 ) 탑을 쌓을 수 있습니다."
    },
    "choices": null,
    "figure": "assets/bank/s41-mid/s1-q07.webp",
    "figureNote": "막대에 끼워 공중에 떠 있게 쌓은 다섯 가지 색의 고리 자석 탑 그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 높은, ㉡ 낮은",
      "accepted": [
        "㉠ 높은, ㉡ 낮은",
        "㉠높은, ㉡낮은",
        "높은, 낮은",
        "ㄱ 높은, ㄴ 낮은",
        "높은 낮은",
        "㉠ 높은 ㉡ 낮은"
      ]
    },
    "explanation": "고리 자석을 서로 같은 극끼리 마주 보게 쌓으면 서로 밀어 내는 힘이 작용하기 때문에 가장 높은 탑을 쌓을 수 있고, 고리 자석을 서로 다른 극끼리 마주 보게 쌓으면 서로 끌어당기는 힘이 작용하기 때문에 가장 낮은 탑을 쌓을 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-mid-o1-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 8,
      "page": 2,
      "sourceId": "sci-41-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "물에 띄운 자석이 가리키는 방향",
      "concept": "물에 띄워 자유롭게 움직이는 자석은 두 극이 북쪽과 남쪽을 가리킨다."
    },
    "prompt": "물에 띄운 자석의 두 극이 가리키는 방향으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "동쪽과 서쪽",
      "북쪽과 동쪽",
      "북쪽과 남쪽",
      "북서쪽과 남동쪽",
      "북동쪽과 남서쪽"
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "물에 띄운 자석의 두 극은 각각 북쪽과 남쪽을 가리킵니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-mid-o1-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 9,
      "page": 2,
      "sourceId": "sci-41-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "공중에 매단 막대자석의 방향",
      "concept": "자유롭게 움직이는 막대자석은 N극이 북쪽, S극이 남쪽을 가리킨다."
    },
    "prompt": "다음은 자유롭게 움직일 수 있도록 공중에 매단 막대자석을 관찰한 결과입니다. ㉠, ㉡에 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "움직임이 멈춘 막대자석의 ㉠ 극은 북쪽을 가리키고, ㉡ 극은 남쪽을 가리킵니다."
    },
    "choices": null,
    "figure": "assets/bank/s41-mid/s1-q09.webp",
    "figureNote": "비커 위에 걸친 막대에 실로 매단 막대자석(왼쪽 N, 오른쪽 S) 그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ N, ㉡ S",
      "accepted": [
        "㉠ N, ㉡ S",
        "㉠N, ㉡S",
        "N, S",
        "ㄱ N, ㄴ S",
        "㉠ N극, ㉡ S극",
        "N S",
        "N극, S극",
        "N극 S극",
        "㉠ N극 ㉡ S극"
      ]
    },
    "explanation": "막대자석을 공중에 매달면 막대자석의 N극은 북쪽을 가리키고, S극은 남쪽을 가리킵니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문의 ㉠, ㉡은 빈 상자 안에 표시됨."
    }
  },
  {
    "id": "s41-mid-o1-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 10,
      "page": 2,
      "sourceId": "sci-41-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "자석을 가까이 한 나침반 바늘",
      "concept": "나침반 바늘의 N극(빨간색)은 자석의 S극에 끌리고 N극에서는 밀려 반대쪽을 가리킨다."
    },
    "prompt": "자석과 나침반을 가까이 했을 때 나타나는 현상이 맞으면 ○표, 틀리면 ×표를 하시오.",
    "givens": {
      "지문": "(1) 막대자석의 S극을 나침반에 가까이 하면 나침반 바늘의 빨간색 부분이 막대자석을 가리킵니다.\n(2) 막대자석의 N극을 나침반에 가까이 하면 나침반 바늘이 계속 회전합니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "(1) ○ (2) ×",
      "accepted": [
        "(1) ○ (2) ×",
        "○, ×",
        "O, X",
        "(1) O (2) X",
        "○ ×",
        "O X",
        "(1) ○, (2) ×"
      ]
    },
    "explanation": "막대자석의 S극을 나침반에 가까이 하면 나침반 바늘의 빨간색 부분이 막대자석을 가리키고, 막대자석의 N극을 나침반에 가까이 하면 나침반 바늘의 빨간색 부분이 막대자석의 반대쪽을 가리킵니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-mid-o1-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 11,
      "page": 2,
      "sourceId": "sci-41-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "자석에 의해 나침반 바늘이 움직이는 까닭",
      "concept": "나침반 바늘은 자석이므로 가까이 한 자석의 극에 따라 밀거나 끌려 방향이 바뀐다."
    },
    "prompt": "자석을 나침반에 가까이 하면 나침반 바늘이 가리키는 방향이 달라집니다. <보기>에서 이에 대한 설명으로 알맞지 않은 것을 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 나침반 바늘과 자석이 같은 극이면 서로 밀어 낸다.",
        "㉡ 나침반 바늘과 자석이 다른 극이면 서로 끌어당긴다.",
        "㉢ 나침반 바늘이 철이기 때문에 나침반 바늘이 가리키는 방향이 달라진다."
      ]
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉢",
      "accepted": [
        "㉢",
        "ㄷ",
        "나침반 바늘이 철이기 때문에 나침반 바늘이 가리키는 방향이 달라진다."
      ]
    },
    "explanation": "나침반 바늘이 자석이기 때문에 자석을 가까이 하면 가까이 한 자석의 극 종류에 따라 나침반 바늘이 가리키는 방향이 달라집니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄."
    }
  },
  {
    "id": "s41-mid-o1-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 12,
      "page": 2,
      "sourceId": "sci-41-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "생활 속 자석의 이용",
      "concept": "냉장고 문, 자석 다트처럼 생활 속 물건은 자석이 철을 끌어당기는 성질을 이용한다."
    },
    "prompt": "다음 빈칸에 공통으로 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "• 냉장고 문 쪽의 □이/가 철로 된 냉장고 문을 끌어당겨 냉장고 문을 쉽게 닫을 수 있습니다.\n• 끝에 □을/를 붙인 다트를 철로 만든 다트판에 던지면 다트가 다트판에 잘 붙습니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
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
    "explanation": "냉장고 문 쪽의 자석이 철로 된 냉장고 문을 끌어당겨 냉장고 문을 쉽게 닫을 수 있습니다. 끝에 자석을 붙인 다트를 철로 만든 다트판에 던지면 다트가 다트판에 잘 붙습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "□는 인쇄된 빈 상자(빈칸)."
    }
  },
  {
    "id": "s41-mid-o1-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 13,
      "page": 3,
      "sourceId": "sci-41-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "얼음의 성질",
      "concept": "얼음은 고체 상태로 차갑고 단단하며, 눈에 보이고 모양이 일정해 손으로 잡을 수 있다."
    },
    "prompt": "다음 <보기>에서 얼음에 대한 설명으로 알맞은 것을 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 액체 상태이다.",
        "㉡ 차갑고 단단하다.",
        "㉢ 눈에 보이지 않는다.",
        "㉣ 모양이 일정하지만 손으로 잡을 수 없다."
      ]
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉡",
      "accepted": [
        "㉡",
        "ㄴ",
        "차갑고 단단하다."
      ]
    },
    "explanation": "얼음은 고체 상태로, 눈에 보이며, 모양이 일정하여 손으로 잡을 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-mid-o1-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 14,
      "page": 3,
      "sourceId": "sci-41-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "물의 상태 변화의 뜻",
      "concept": "물은 얼음(고체)·물(액체)·수증기(기체) 사이에서 서로 상태가 변할 수 있다."
    },
    "prompt": "다음 <보기>에서 물의 상태 변화에 대한 알맞은 설명을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 얼음은 물로 변할 수 있다.",
        "㉡ 수증기는 물로 변할 수 있다.",
        "㉢ 물이 다른 상태로 변하는 것을 말한다.",
        "㉣ 액체 상태인 물은 기체 상태로 변할 수 없다."
      ]
    },
    "choices": [
      "㉠, ㉡",
      "㉠, ㉢",
      "㉡, ㉣",
      "㉠, ㉡, ㉢",
      "㉡, ㉢, ㉣"
    ],
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
    "explanation": "물이 다른 상태로 변하는 것을 물의 상태 변화라고 합니다. 액체 상태인 물은 고체 상태인 얼음으로 변할 수 있고, 기체 상태인 수증기로 변할 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-mid-o1-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 15,
      "page": 3,
      "sourceId": "sci-41-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "생활 속 물의 상태 변화 구별",
      "concept": "유리창이 뿌옇게 되는 것은 수증기가 물이 되는 변화이고, 물기가 마르거나 끓는 것은 물이 수증기가 되는 변화이다."
    },
    "prompt": "물의 상태 변화가 나머지 넷과 다른 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "물을 끓여 수증기로 음식을 찐다.",
      "날씨가 건조할 때 가습기를 사용한다.",
      "설거지를 하고 나면 그릇의 물기가 마른다.",
      "추운 날 버스 안의 유리창이 뿌옇게 변한다.",
      "물휴지의 뚜껑을 열어 놓으면 물휴지의 물이 마른다."
    ],
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
    "explanation": "추운 날 버스 안의 유리창이 뿌옇게 흐려지는 것은 수증기가 물로 상태가 변하는 예입니다. 물을 끓여 수증기로 음식을 찌는 것, 날씨가 건조할 때 가습기를 사용하는 것, 설거지를 하고 나면 그릇의 물기가 마르는 것, 물휴지의 뚜껑을 열어 놓으면 물휴지의 물이 마르는 것은 물이 수증기로 상태가 변하는 예입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "문제 ④는 '뿌옇게 변한다', 해설은 '뿌옇게 흐려지는'으로 표현이 다름."
    }
  },
  {
    "id": "s41-mid-o1-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 16,
      "page": 3,
      "sourceId": "sci-41-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "물이 얼고 녹을 때의 부피 변화",
      "concept": "물이 얼면 부피가 늘어나고 얼음이 녹으면 늘어난 만큼 부피가 다시 줄어든다."
    },
    "prompt": "위 실험에 대한 설명으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "[16~18] 플라스틱병에 물을 반 정도 넣고 마개를 닫은 다음 물을 얼렸다가 녹이면서 각각의 높이를 표시하였습니다. 물음에 답하시오.",
      "그림": "(가) 물 → (나) 얼음 → (다) 물"
    },
    "choices": [
      "(가)에서 (나)가 될 때 부피가 줄어든다.",
      "(나)에서 (다)가 될 때 부피가 늘어난다.",
      "(가)에서 (나)가 될 때 부피는 변하지 않는다.",
      "(나)에서 (다)가 될 때 부피가 변하지 않는다.",
      "(가)에서 (나)가 될 때 늘어난 부피는 (나)에서 (가)가 될 때 줄어든 부피와 같다."
    ],
    "figure": "assets/bank/s41-mid/s1-q16.webp",
    "figureNote": "마개를 닫은 플라스틱병 세 개를 화살표(→)로 이은 그림: (가) 물 → (나) 얼음 → (다) 물. 각 병 옆면에 높이 표시선이 있고 (가)는 검은 선 하나, (나)와 (다)는 검은 선 위에 빨간 선이 하나 더 그어져 있음.",
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
    "explanation": "물이 얼어 얼음이 되면 부피가 늘어나고, 얼음이 녹아 물이 될 때 부피가 줄어듭니다. 이때 물이 얼어 얼음이 될 때 늘어난 부피는 얼음이 녹아 물이 될 때 줄어든 부피와 같습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기 ⑤는 '(나)에서 (가)가 될 때'로 인쇄됨((다)가 아님) — 그대로 옮김."
    }
  },
  {
    "id": "s41-mid-o1-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 17,
      "page": 3,
      "sourceId": "sci-41-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "물이 얼고 녹을 때의 무게 변화",
      "concept": "물이 얼거나 얼음이 녹아도 부피만 변하고 무게는 변하지 않는다."
    },
    "prompt": "(가)~(다)의 무게를 각각 측정하였을 때 확인할 수 있는 플라스틱병의 무게 변화를 쓰시오.",
    "givens": {
      "지문": "[16~18] 플라스틱병에 물을 반 정도 넣고 마개를 닫은 다음 물을 얼렸다가 녹이면서 각각의 높이를 표시하였습니다. 물음에 답하시오.",
      "그림": "(가) 물 → (나) 얼음 → (다) 물"
    },
    "choices": null,
    "figure": "assets/bank/s41-mid/s1-q16.webp",
    "figureNote": "마개를 닫은 플라스틱병 세 개를 화살표(→)로 이은 그림: (가) 물 → (나) 얼음 → (다) 물. 각 병 옆면에 높이 표시선이 있고 (가)는 검은 선 하나, (나)와 (다)는 검은 선 위에 빨간 선이 하나 더 그어져 있음.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "물이 얼거나 얼음이 녹을 때 무게는 변하지 않으므로 (가), (나), (다) 플라스틱병의 무게는 변하지 않는다.",
      "rubric": {
        "required": [
          "(가)~(다)의 무게가 변하지 않는다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "무게가 변하지 않는다는 내용이 포함되어 있으면 정답으로 합니다. (100%)"
        ]
      }
    },
    "explanation": "액체인 물이 얼어 고체인 얼음이 되거나 고체인 얼음이 녹아 액체인 물이 될 때 부피는 변하지만 무게는 변하지 않습니다.\n[채점 기준] 무게가 변하지 않는다는 내용이 포함되어 있으면 정답으로 합니다. (100%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준에 비율 표기가 없음(단일 기준이라 100%로 기록)."
    }
  },
  {
    "id": "s41-mid-o1-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 18,
      "page": 3,
      "sourceId": "sci-41-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "얼고 녹을 때 부피 변화의 생활 속 예",
      "concept": "얼음이 녹으면 부피가 줄어 높이가 낮아지고, 물이 얼면 부피가 늘어 용기가 깨지기도 한다."
    },
    "prompt": "위 실험과 관련된 예에 대한 설명으로 알맞지 않는 것은 어느 것입니까?",
    "givens": {
      "지문": "[16~18] 플라스틱병에 물을 반 정도 넣고 마개를 닫은 다음 물을 얼렸다가 녹이면서 각각의 높이를 표시하였습니다. 물음에 답하시오.",
      "그림": "(가) 물 → (나) 얼음 → (다) 물"
    },
    "choices": [
      "겨울철 장독에 넣어 둔 물이 얼어 장독이 깨진다.",
      "겨울에 바위틈에 있던 물이 얼면서 바위가 쪼개진다.",
      "얼음 틀에 얼어 있던 얼음이 녹으면 높이가 높아진다.",
      "한겨울에 수도관에 설치된 수도 계량기가 얼어서 터진다.",
      "꽁꽁 언 튜브형 얼음과자가 녹으면 튜브 안에 빈 공간이 생긴다."
    ],
    "figure": "assets/bank/s41-mid/s1-q16.webp",
    "figureNote": "마개를 닫은 플라스틱병 세 개를 화살표(→)로 이은 그림: (가) 물 → (나) 얼음 → (다) 물. 각 병 옆면에 높이 표시선이 있고 (가)는 검은 선 하나, (나)와 (다)는 검은 선 위에 빨간 선이 하나 더 그어져 있음.",
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
    "explanation": "물이 얼면 부피가 늘어나고, 얼음이 녹으면 부피가 줄어듭니다. 얼음 틀 위로 올라와 있던 얼음이 녹으면 높이가 낮아집니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않는'에 밑줄."
    }
  },
  {
    "id": "s41-mid-o1-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 19,
      "page": 4,
      "sourceId": "sci-41-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "증발의 예가 아닌 것",
      "concept": "물을 끓이는 것은 끓음이고, 소금 만들기·말리기·어항 물이 줄어드는 것은 증발의 예이다."
    },
    "prompt": "증발과 관련된 예로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "염전에서 소금을 만든다.",
      "달걀을 삶을 때 물을 끓인다.",
      "과일을 말려 말린 과일을 만든다.",
      "젖은 빨래를 건조대에 널어 말린다.",
      "어항 속의 물이 시간이 지나면 점점 줄어든다."
    ],
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
    "explanation": "달걀을 삶을 때 물을 끓이는 것은 끓음과 관련된 예입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄."
    }
  },
  {
    "id": "s41-mid-o1-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 20,
      "page": 4,
      "sourceId": "sci-41-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "증발과 끓음의 뜻",
      "concept": "물 표면에서만 수증기가 되는 것은 증발, 물 표면과 물속에서 모두 수증기가 되는 것은 끓음이다."
    },
    "prompt": "다음 ㉠, ㉡에 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "물 표면에서 물이 수증기로 상태가 변하는 현상을 ㉠(이)라고 하고, 물 표면과 물속에서 모두 물이 수증기로 상태가 변하는 현상을 ㉡(이)라고 합니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 증발, ㉡ 끓음",
      "accepted": [
        "㉠ 증발, ㉡ 끓음",
        "㉠증발, ㉡끓음",
        "증발, 끓음",
        "ㄱ 증발, ㄴ 끓음",
        "증발 끓음",
        "㉠ 증발 ㉡ 끓음"
      ]
    },
    "explanation": "물 표면에서 액체인 물이 기체인 수증기로 상태가 변하는 현상을 증발이라고 하고, 물 표면과 물속에서 모두 액체인 물이 기체인 수증기로 상태가 변하는 현상을 끓음이라고 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문의 ㉠, ㉡은 빈 상자 안에 표시됨."
    }
  },
  {
    "id": "s41-mid-o1-21",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 21,
      "page": 4,
      "sourceId": "sci-41-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "증발과 끓음 비교",
      "concept": "증발과 끓음은 모두 액체가 기체로 변하는 현상이며, 끓음은 증발보다 물의 양이 빠르게 줄어든다."
    },
    "prompt": "다음 <보기>에서 증발과 끓음에 대한 알맞은 설명을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 증발은 물의 양이 매우 천천히 줄어든다.",
        "㉡ 끓음은 물의 양이 증발보다 천천히 줄어든다.",
        "㉢ 증발과 끓음은 모두 액체가 기체로 변하는 현상이다."
      ]
    },
    "choices": [
      "㉠",
      "㉢",
      "㉠, ㉢",
      "㉡, ㉢",
      "㉠, ㉡, ㉢"
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "증발과 끓음은 모두 액체인 물이 기체인 수증기로 상태가 변하는 현상입니다. 끓음은 물의 양이 증발할 때보다 빠르게 줄어듭니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-mid-o1-22",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 22,
      "page": 4,
      "sourceId": "sci-41-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "차가운 비커 표면의 물방울",
      "concept": "공기 중의 수증기가 차가운 표면에 닿아 물방울로 변하는 현상이 응결이다."
    },
    "prompt": "위 실험을 통해 알 수 있는 현상으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "[22~23] 얼음이 든 비커의 입구를 비닐 랩으로 막고 페트리 접시에 올려놓은 후 비커의 바깥 면에서 일어나는 변화를 관찰하였더니 다음과 같은 결과를 확인하였습니다. 물음에 답하시오.\n<결과> 시간이 지남에 따라 비커의 바깥 면에 물방울이 맺히고, 물방울이 페트리 접시로 흘러 물이 고입니다."
    },
    "choices": [
      "얼림",
      "녹임",
      "증발",
      "끓음",
      "응결"
    ],
    "figure": "assets/bank/s41-mid/s1-q22.webp",
    "figureNote": "얼음이 든 비커 입구를 비닐 랩으로 막아 페트리 접시 위에 올려놓은 그림.",
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
    "explanation": "비커의 바깥 면에 맺힌 물방울은 공기 중의 수증기가 차가운 비커 표면에 닿아 물로 변한 것입니다. 이렇게 기체인 수증기가 액체인 물로 상태가 변하는 현상을 응결이라고 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "선택지는 3열 배치(①②③ / ④⑤)."
    }
  },
  {
    "id": "s41-mid-o1-23",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 23,
      "page": 4,
      "sourceId": "sci-41-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "응결의 예가 아닌 것",
      "concept": "안개·이슬·거울의 물방울은 응결의 예이고, 햇볕에 말리는 것은 증발의 예이다."
    },
    "prompt": "다음 <보기>에서 위 실험과 관련된 예로 알맞지 않은 것을 골라 기호를 쓰시오.",
    "givens": {
      "지문": "[22~23] 얼음이 든 비커의 입구를 비닐 랩으로 막고 페트리 접시에 올려놓은 후 비커의 바깥 면에서 일어나는 변화를 관찰하였더니 다음과 같은 결과를 확인하였습니다. 물음에 답하시오.\n<결과> 시간이 지남에 따라 비커의 바깥 면에 물방울이 맺히고, 물방울이 페트리 접시로 흘러 물이 고입니다.",
      "보기": [
        "㉠ 이른 아침 호수 위에 안개가 낀다.",
        "㉡ 맑은 날 새벽 풀잎에 이슬이 맺힌다.",
        "㉢ 욕실의 차가운 거울 표면에 물방울이 맺힌다.",
        "㉣ 오징어나 생선을 햇볕에 말려 음식 재료로 사용한다."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s41-mid/s1-q22.webp",
    "figureNote": "얼음이 든 비커 입구를 비닐 랩으로 막아 페트리 접시 위에 올려놓은 그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉣",
      "accepted": [
        "㉣",
        "ㄹ",
        "오징어나 생선을 햇볕에 말려 음식 재료로 사용한다."
      ]
    },
    "explanation": "오징어나 생선을 햇볕에 말려 음식 재료로 사용하는 것은 증발과 관련된 예입니다. 이른 아침 호수 위에 안개가 끼는 것, 맑은 날 새벽 풀잎에 이슬이 맺히는 것, 욕실의 차가운 거울 표면에 물방울이 맺히는 것은 응결과 관련된 예입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄."
    }
  },
  {
    "id": "s41-mid-o1-24",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 24,
      "page": 4,
      "sourceId": "sci-41-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "물의 이용",
      "concept": "물은 전기 생산, 공장의 물건 생산, 동식물의 생명 유지 등에 이용되며 몸무게 측정에는 저울을 쓴다."
    },
    "prompt": "물의 이용에 대해 잘못 설명한 사람의 이름을 쓰시오.",
    "givens": {
      "지문": "• 단비: 전기를 만들 때 이용합니다.\n• 다래: 공장에서 물건을 만들 때 이용합니다.\n• 하늘: 동식물이 생명을 유지하기 위해 이용합니다.\n• 노을: 체육관에서 몸무게를 측정해 경기 체급을 나눌 때 이용합니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "노을",
      "accepted": [
        "노을"
      ]
    },
    "explanation": "체육관에서 몸무게를 측정해 경기 체급을 나눌 때 이용하는 것은 저울입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '잘못'에 밑줄. 이름(단비·다래·하늘·노을)은 굵은 글씨."
    }
  },
  {
    "id": "s41-mid-o1-25",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 25,
      "page": 5,
      "sourceId": "sci-41-mid-set1",
      "edition": "시매쓰DMC 중간평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "물 부족 해결 장치의 원리",
      "concept": "와카워터와 워터콘은 수증기가 응결하는 현상을 이용해 깨끗한 물을 모은다."
    },
    "prompt": "다음은 물 부족 현상을 해결하기 위한 장치에 대한 설명입니다. 빈칸에 공통으로 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "• 와카워터: 공기 중의 수증기가 그물망에서 □하여 물방울로 맺힌 후 바닥에 있는 그릇으로 모여 깨끗한 물을 얻을 수 있습니다.\n• 워터콘: 젖은 흙 위에 덮으면 흙에서 증발한 물이 벽면에서 □하여 흘러내린 후 가장자리에 모여 깨끗한 물을 얻을 수 있습니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "응결",
      "accepted": [
        "응결"
      ]
    },
    "explanation": "와카워터는 공기 중의 수증기가 그물망에서 응결하여 물방울로 맺힌 후 바닥에 있는 그릇으로 모여 깨끗한 물을 얻을 수 있습니다. 워터콘은 젖은 흙 위에 덮으면 흙에서 증발한 물이 벽면에서 응결하여 흘러내린 후 가장자리에 모여 깨끗한 물을 얻을 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "□는 인쇄된 빈 상자(빈칸). '와카워터:', '워터콘:'은 굵은 글씨."
    }
  },
  {
    "id": "s41-mid-o2-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 1,
      "page": 1,
      "sourceId": "sci-41-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "자석에 붙는 물체 고르기",
      "concept": "철로 만든 물체는 자석에 붙고, 고무·유리·나무로 만든 물체는 자석에 붙지 않는다."
    },
    "prompt": "막대자석을 가까이 했을 때 막대자석에 붙는 물체를 두 가지 고르시오.",
    "givens": null,
    "choices": [
      "철자",
      "지우개",
      "철 클립",
      "유리구슬",
      "나무젓가락"
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "철로 만든 철자, 철 클립은 막대자석에 붙고, 고무로 만든 지우개, 유리로 만든 유리구슬, 나무로 만든 나무젓가락은 막대자석에 붙지 않습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-mid-o2-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 2,
      "page": 1,
      "sourceId": "sci-41-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "자석에 붙는 물질",
      "concept": "자석에 붙는 것은 철로 만든 물체이며, 여러 물질로 된 물체는 철로 된 부분만 자석에 붙는다."
    },
    "prompt": "다음은 자석에 붙는 물체에 대한 설명입니다. 빈칸에 공통으로 들어갈 알맞은 말은 어느 것입니까?",
    "givens": {
      "지문": "• □(으)로 만든 물체는 자석에 붙습니다.\n• 여러 가지 물질로 만들어진 물체는 □(으)로 만들어진 부분만 자석에 붙습니다."
    },
    "choices": [
      "철",
      "종이",
      "고무",
      "플라스틱",
      "알루미늄"
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "물체를 이루는 물질의 종류에 따라 자석에 붙는 물체도 있고, 붙지 않는 물체도 있습니다. 철로 만든 물체는 자석에 붙고, 종이, 고무, 플라스틱, 알루미늄 등으로 만든 물체는 자석에 붙지 않습니다. 여러 가지 물질로 만들어진 물체는 철로 만들어진 부분만 자석에 붙습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "빈칸은 시험지에 빈 네모 칸으로 인쇄됨 — □로 옮김."
    }
  },
  {
    "id": "s41-mid-o2-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 3,
      "page": 1,
      "sourceId": "sci-41-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "종이판을 사이에 둔 자석의 힘",
      "concept": "자석과 철 클립 사이에 종이처럼 자석에 붙지 않는 물체가 있어도 자석은 철 클립을 끌어당긴다."
    },
    "prompt": "다음과 같이 막대자석에 종이판을 댄 다음 철 클립에 막대자석을 가까이 했습니다. 막대자석을 가까이 했을 때 철 클립의 움직임을 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s41-mid/s2-q03.webp",
    "figureNote": "막대자석(S극이 위로 보임)을 쥔 손이 종이판 아래쪽에 막대자석을 대고 있고, 아래에 철 클립 하나가 놓여 있는 그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "철 클립이 막대자석 쪽으로 끌어당겨져 붙는다.",
      "rubric": {
        "required": [
          "철 클립이 막대자석에 끌려 붙는다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "철 클립이 막대자석에 붙는다는 내용이 포함되어 있으면 정답으로 합니다. (100%)"
        ]
      }
    },
    "explanation": "자석과 자석에 붙는 물체 사이에 자석에 붙지 않는 다른 물체가 있어도 자석과 자석에 붙는 물체는 서로 끌어당깁니다.\n[채점 기준] 철 클립이 막대자석에 붙는다는 내용이 포함되어 있으면 정답으로 합니다. (100%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란은 밑줄 두 줄. 정답 및 해설의 채점 기준은 비율 표시 없이 한 줄로 인쇄됨(100%로 적음)."
    }
  },
  {
    "id": "s41-mid-o2-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 4,
      "page": 1,
      "sourceId": "sci-41-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "자석과 자석에 붙는 물체 사이의 힘",
      "concept": "자석과 자석에 붙는 물체 사이에는 끌어당기는 힘이 작용하고, 두 물체가 약간 떨어져 있어도 이 힘이 작용한다."
    },
    "prompt": "다음 <보기>에서 자석과 자석에 붙는 물체 사이에 작용하는 힘에 대한 알맞은 설명을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 자석과 자석에 붙는 물체는 서로 밀어 내는 힘이 작용한다.",
        "㉡ 자석과 자석에 붙는 물체는 서로 끌어당기는 힘이 작용한다.",
        "㉢ 자석과 자석에 붙는 물체는 약간 떨어져 있어도 서로 밀어 낸다.",
        "㉣ 자석과 자석에 붙는 물체는 약간 떨어져 있어도 서로 끌어당긴다."
      ]
    },
    "choices": [
      "㉠",
      "㉡",
      "㉣",
      "㉠, ㉢",
      "㉡, ㉣"
    ],
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
    "explanation": "자석과 자석에 붙는 물체 사이에는 서로 끌어당기는 힘이 작용합니다. 이 힘은 두 물체가 약간 떨어져 있어도 작용합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-mid-o2-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 5,
      "page": 1,
      "sourceId": "sci-41-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "막대자석에 빵 끈 조각이 많이 붙는 부분",
      "concept": "막대자석은 양쪽 끝부분(극)에 철로 된 물체가 많이 붙는다."
    },
    "prompt": "막대자석에 빵 끈 조각이 많이 붙는 부분을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "지문": "[05~06] 다음과 같이 빵 끈 조각이 든 종이 그릇에 막대자석을 넣었다가 천천히 들어 올렸습니다. 물음에 답하시오."
    },
    "choices": [
      "(가)",
      "(나)",
      "(가), (나)",
      "(가), (다)",
      "(가), (나), (다)"
    ],
    "figure": "assets/bank/s41-mid/s2-q05.webp",
    "figureNote": "막대자석(왼쪽 N극 빨간색, 오른쪽 S극 파란색)의 왼쪽 끝 (가), 가운데 (나), 오른쪽 끝 (다)을 네모로 표시한 그림. [05~06] 공통 그림(빵 끈 조각 그릇)은 extra 참조.",
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
    "explanation": "빵 끈 조각이 든 종이 그릇에 막대자석을 넣었다가 들어 올리면 막대자석의 양쪽 끝부분에 빵 끈 조각이 많이 붙습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-mid-o2-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 6,
      "page": 2,
      "sourceId": "sci-41-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "자석의 극",
      "concept": "자석에서 철로 된 물체가 많이 붙는 부분을 자석의 극이라고 하며, 자석의 극은 항상 두 군데 있다."
    },
    "prompt": "다음은 위 실험을 통해 확인할 수 있는 내용입니다. 빈칸에 공통으로 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "[05~06] 다음과 같이 빵 끈 조각이 든 종이 그릇에 막대자석을 넣었다가 천천히 들어 올렸습니다. 물음에 답하시오.\n• 막대자석에서 빵 끈 조각이 많이 붙는 부분을 자석의 □(이)라고 합니다.\n• 자석의 □은/는 항상 두 군데 있습니다."
    },
    "choices": null,
    "figure": "assets/bank/s41-mid/s2-q06.webp",
    "figureNote": "[05~06] 공통 그림: 빵 끈 조각이 가득 든 그릇에 손으로 막대자석(S, N 표시)을 넣고 있는 그림(1쪽).",
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
    "explanation": "막대자석에서 빵 끈 조각이 많이 붙는 부분을 자석의 극이라고 합니다. 자석의 극은 항상 두 군데 있으며, 각각 N극과 S극으로 나타냅니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "빈칸은 시험지에 빈 네모 칸으로 인쇄됨 — □로 옮김. 답란은 ( )."
    }
  },
  {
    "id": "s41-mid-o2-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 7,
      "page": 2,
      "sourceId": "sci-41-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "자석끼리 끌어당기는 경우",
      "concept": "자석의 다른 극끼리는 서로 끌어당기고, 같은 극끼리는 서로 밀어 낸다."
    },
    "prompt": "다음 <보기>에서 자석과 자석을 가까이 했을 때 서로 끌어당기는 힘이 작용하는 경우를 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ S | S",
        "㉡ N | S",
        "㉢ N | N"
      ]
    },
    "choices": [
      "㉠",
      "㉡",
      "㉠, ㉡",
      "㉡, ㉢",
      "㉠, ㉡, ㉢"
    ],
    "figure": "assets/bank/s41-mid/s2-q07.webp",
    "figureNote": "<보기> 그림: 자석 두 개를 나란히 마주 놓은 세 경우 — ㉠ S극(파랑)과 S극(파랑), ㉡ N극(빨강)과 S극(파랑), ㉢ N극(빨강)과 N극(빨강).",
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
    "explanation": "자석의 같은 극끼리 가까이 하면 서로 밀어 내는 힘이 작용하고, 자석의 다른 극끼리 가까이 하면 서로 끌어당기는 힘이 작용합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>는 글이 아니라 자석 그림(마주 보는 두 극의 글자)이라 givens에는 극 글자만 옮김."
    }
  },
  {
    "id": "s41-mid-o2-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 8,
      "page": 2,
      "sourceId": "sci-41-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "고리 자석 탑에서 같은 극 찾기",
      "concept": "고리 자석이 떠 있으면 마주 보는 면이 같은 극이므로, 위 자석의 윗면과 아래 자석의 아랫면, 위 자석의 아랫면과 아래 자석의 윗면이 같은 극이다."
    },
    "prompt": "다음과 같이 고리 자석 탑을 쌓았습니다. 자석의 극이 같은 것끼리 알맞게 짝 지은 것을 두 가지 고르시오.",
    "givens": null,
    "choices": [
      "㉠의 윗면 - ㉡의 윗면",
      "㉠의 윗면 - ㉡의 아랫면",
      "㉠의 윗면 - ㉠의 아랫면",
      "㉠의 아랫면 - ㉡의 윗면",
      "㉠의 아랫면 - ㉡의 아랫면"
    ],
    "figure": "assets/bank/s41-mid/s2-q08.webp",
    "figureNote": "받침대 막대에 고리 자석 두 개를 끼운 그림. 위쪽 노란 고리 자석 ㉠이 아래쪽 파란 고리 자석 ㉡ 위에 떨어져 떠 있음.",
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
    "explanation": "㉠ 고리 자석과 ㉡ 고리 자석의 사이가 떨어져 있는 것을 통해 두 자석은 같은 극끼리 마주보고 있다는 것을 알 수 있습니다. ㉠의 윗면을 N극이라고 가정하면 ㉠의 아랫면은 S극, ㉡의 윗면은 S극, ㉡의 아랫면은 N극입니다. 따라서 ㉠의 윗면과 ㉡의 아랫면, ㉠의 아랫면과 ㉡의 윗면이 같은 극입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-mid-o2-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 9,
      "page": 2,
      "sourceId": "sci-41-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "물에 띄운 자석이 가리키는 방향",
      "concept": "물에 띄운 자석은 북쪽과 남쪽을 가리키며, 북쪽을 가리키는 극이 N극, 남쪽을 가리키는 극이 S극이다."
    },
    "prompt": "다음은 자석이 가리키는 방향에 대한 설명입니다. ㉠~㉣에 들어갈 말을 알맞게 짝 지은 것은 어느 것입니까?",
    "givens": {
      "지문": "• 물에 띄운 자석의 두 극은 각각 ㉠쪽과 ㉡쪽을 가리킵니다.\n• ㉠쪽을 가리키는 자석의 극을 ㉢극이라고 하고, ㉡쪽을 가리키는 자석의 극은 ㉣극이라고 합니다."
    },
    "choices": [
      "동 / 서 / N / S",
      "동 / 남 / S / N",
      "남 / 북 / N / S",
      "북 / 남 / N / S",
      "북 / 남 / S / N"
    ],
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
    "explanation": "물에 띄운 자석의 두 극은 각각 북쪽과 남쪽을 가리킵니다. 북쪽을 가리키는 자석의 극을 N극이라고 하고, 남쪽을 가리키는 자석의 극을 S극이라고 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기는 표 형식(열 머리: ㉠ / ㉡ / ㉢ / ㉣). ㉠~㉣은 시험지에 네모 칸 안에 인쇄된 기호임."
    }
  },
  {
    "id": "s41-mid-o2-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 10,
      "page": 2,
      "sourceId": "sci-41-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "막대자석을 가까이 했을 때 나침반 바늘",
      "concept": "나침반 바늘도 자석이므로, 막대자석의 S극을 가까이 하면 나침반 바늘의 N극(빨간색)이 막대자석 쪽으로 끌려 그쪽을 가리킨다."
    },
    "prompt": "다음과 같이 막대자석을 나침반에 가까이 했습니다. 나침반 바늘의 움직임으로 알맞은 것을 두 가지 고르시오.",
    "givens": null,
    "choices": [
      "나침반 바늘의 N극이 서쪽을 가리킨다.",
      "나침반 바늘의 N극이 막대자석 쪽을 가리킨다.",
      "나침반 바늘의 S극이 막대자석 쪽을 가리킨다.",
      "나침반 바늘의 빨간색 부분이 막대자석의 반대쪽을 가리킨다.",
      "나침반 바늘의 빨간색 부분이 막대자석 쪽을 가리킨다."
    ],
    "figure": "assets/bank/s41-mid/s2-q10.webp",
    "figureNote": "북쪽을 가리키고 있는 나침반(바늘 빨간 부분이 북) 오른쪽(동쪽)에서 막대자석의 S극(파랑)을 나침반 쪽으로 향하게 하여 가까이 가져가는 그림(초록 화살표가 나침반 쪽을 향함). 막대자석 오른쪽 끝은 N극(빨강).",
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
    "explanation": "나침반 바늘이 자석이기 때문에 자석을 가까이 하면 가까이 한 자석의 극 종류에 따라 나침반 바늘이 가리키는 방향이 달라집니다. 막대자석의 S극을 나침반에 가까이 하면 나침반의 빨간색 부분(N극이) 막대자석 쪽(동쪽)을 가리킵니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "해설 원문은 「빨간색 부분(N극이) 막대자석 쪽(동쪽)을」으로 괄호가 인쇄된 그대로 옮김."
    }
  },
  {
    "id": "s41-mid-o2-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 11,
      "page": 3,
      "sourceId": "sci-41-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "막대자석 주위 나침반 바늘의 방향",
      "concept": "막대자석 주위의 나침반 바늘은 다른 극끼리 끌어당기고 같은 극끼리 밀어 내는 방향으로 놓이므로, N극 쪽에는 바늘의 S극이, S극 쪽에는 바늘의 N극이 향한다."
    },
    "prompt": "다음은 막대자석 주위에 나침반을 놓은 모습입니다. 나침반 바늘의 모습이 잘못된 것을 두 가지 고르시오.",
    "givens": null,
    "choices": [
      "㉠",
      "㉡",
      "㉢",
      "㉣",
      "㉤"
    ],
    "figure": "assets/bank/s41-mid/s2-q11.webp",
    "figureNote": "가운데 막대자석(왼쪽 N극 빨강, 오른쪽 S극 파랑) 주위에 나침반 다섯 개 ㉠(왼쪽 위)·㉡(왼쪽)·㉢(아래)·㉣(오른쪽 위)·㉤(오른쪽)이 놓여 있고, 각 나침반 바늘(빨강=N, 파랑=S)이 가리키는 방향이 그려져 있는 그림.",
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
    "explanation": "나침반 바늘이 자석이기 때문에 막대자석 주위에 나침반을 놓으면 같은 극끼리는 서로 밀어 내고, 다른 극끼리는 서로 끌어당깁니다. ㉢과 ㉤의 나침반 바늘은 서로 같은 극끼리 끌어당기고 있는 상태이므로 올바른 모습이 아닙니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 「잘못된」에 밑줄이 그어져 있음. 그림의 기호는 동그라미 안에 굵게 인쇄된 ㉠~㉤."
    }
  },
  {
    "id": "s41-mid-o2-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 12,
      "page": 3,
      "sourceId": "sci-41-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "자석 드라이버에 이용된 자석의 성질",
      "concept": "자석 드라이버는 자석이 철로 만든 물체를 끌어당기는 성질을 이용해 끝부분에 나사를 붙여 고정한다."
    },
    "prompt": "다음은 자석 드라이버에 대한 설명입니다. 빈칸에 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "끝부분에 나사를 고정할 수 있어서 편리한 자석 드라이버는 □(으)로 만든 물체를 끌어당기는 자석의 성질을 이용한 예입니다."
    },
    "choices": null,
    "figure": "assets/bank/s41-mid/s2-q12.webp",
    "figureNote": "빨간 손잡이 드라이버와, 드라이버 끝에 나사가 붙어 있는 모습을 확대한 원 그림.",
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
    "explanation": "자석 드라이버는 철로 만든 물체를 끌어당기는 자석의 성질을 이용한 예입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "빈칸은 시험지에 빈 네모 칸으로 인쇄됨 — □로 옮김. 답란은 ( )."
    }
  },
  {
    "id": "s41-mid-o2-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 13,
      "page": 3,
      "sourceId": "sci-41-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "물의 세 가지 상태",
      "concept": "물은 고체인 얼음, 액체인 물, 기체인 수증기의 세 가지 상태로 있으며, 수증기는 눈에 보이지 않고 얼음은 모양이 일정하다."
    },
    "prompt": "다음 <보기>에서 물의 세 가지 상태에 대한 알맞은 설명을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 수증기는 눈에 보인다.",
        "㉡ 물은 흐르는 성질이 있다.",
        "㉢ 얼음은 모양이 일정하지 않다.",
        "㉣ 물은 얼음, 물, 수증기의 세 가지 상태로 있다."
      ]
    },
    "choices": [
      "㉠, ㉡",
      "㉠, ㉢",
      "㉡, ㉢",
      "㉡, ㉣",
      "㉢, ㉣"
    ],
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
    "explanation": "물은 고체인 얼음, 액체인 물, 기체인 수증기의 세 가지 상태로 있습니다. 수증기는 눈에 보이지 않으며, 얼음은 모양이 일정합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-mid-o2-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 14,
      "page": 3,
      "sourceId": "sci-41-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "얼음→물, 물→수증기의 상태 변화",
      "concept": "얼음이 물로 변하는 것은 고체에서 액체로, 물이 수증기로 변하는 것은 액체에서 기체로 상태가 변하는 것이다."
    },
    "prompt": "다음 현상과 관련 있는 물의 상태 변화를 알맞게 짝 지은 것은 어느 것입니까?",
    "givens": {
      "지문": "㉠ 얼음이 물로 변한다.\n㉡ 물이 수증기로 변한다."
    },
    "choices": [
      "고체 → 기체 / 액체 → 고체",
      "고체 → 액체 / 액체 → 기체",
      "액체 → 고체 / 기체 → 액체",
      "액체 → 기체 / 기체 → 고체",
      "기체 → 고체 / 고체 → 액체"
    ],
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
    "explanation": "얼음은 고체, 물은 액체, 수증기는 기체 상태입니다. 얼음이 물로 변하는 것은 고체가 액체로 상태가 변하는 것이고, 물이 수증기로 변하는 것은 액체가 기체로 상태가 변하는 것입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기는 표 형식(열 머리: ㉠ / ㉡)."
    }
  },
  {
    "id": "s41-mid-o2-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 15,
      "page": 3,
      "sourceId": "sci-41-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "물이 수증기로 변하는 예",
      "concept": "물휴지가 마르는 것처럼 물이 수증기로 변해 날아가는 현상은 물이 액체에서 기체로 상태가 변하는 예이다."
    },
    "prompt": "물이 수증기로 상태가 변하는 것과 관련된 예로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "극지방의 빙하가 녹는다.",
      "날씨가 습할 때 제습기를 사용한다.",
      "물이나 주스를 얼려 얼음과자를 만든다.",
      "스키장에서 물을 얼려 인공 눈을 만든다.",
      "물휴지의 뚜껑을 열어 놓으면 물휴지의 물이 마른다."
    ],
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
    "explanation": "물휴지의 뚜껑을 열어 놓으면 물이 수증기로 상태가 변하면서 물휴지의 물이 마릅니다. 극지방의 빙하가 녹는 것은 얼음이 물로 상태가 변하는 예이고, 날씨가 습할 때 제습기를 사용하는 것은 수증기가 물로 상태가 변하는 예입니다. 물이나 주스를 얼려 얼음과자를 만드는 것, 스키장에서 물을 얼려 인공 눈을 만드는 것은 물이 얼음으로 상태가 변하는 예입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-mid-o2-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 16,
      "page": 3,
      "sourceId": "sci-41-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "물이 얼 때 유리병이 깨지는 까닭",
      "concept": "물이 얼어 얼음이 되면 부피가 늘어나므로 물이 가득 든 유리병이 깨질 수 있다."
    },
    "prompt": "물이 가득 든 유리병을 냉동실에 넣으면 유리병이 깨져 위험할 수 있습니다. 유리병이 깨지는 까닭으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "얼음이 물로 변하기 때문이다.",
      "물이 얼면 부피가 늘어나기 때문이다.",
      "물이 얼면 부피가 줄어들기 때문이다.",
      "물이 얼면 무게가 늘어나기 때문이다.",
      "물이 얼면 무게가 줄어들기 때문이다."
    ],
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
    "explanation": "물이 가득 든 유리병을 냉동실에 넣으면 물이 얼어 얼음이 되면서 부피가 늘어나기 때문에 유리병이 깨질 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-mid-o2-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 17,
      "page": 4,
      "sourceId": "sci-41-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "물이 얼 때 무게 변화",
      "concept": "물이 얼어 얼음이 되어도 무게는 변하지 않는다."
    },
    "prompt": "다음 실험을 보고, 결과의 빈칸에 들어갈 알맞은 숫자를 쓰시오.",
    "givens": {
      "지문": "<과정>\n㉠ 플라스틱병에 물을 반 정도 넣고 마개를 닫은 후 플라스틱병의 무게를 측정합니다.\n㉡ 플라스틱병을 냉동실에 넣어 물을 얼립니다.\n㉢ 냉동실에서 플라스틱병을 꺼내 물기를 닦고 플라스틱병의 무게를 측정합니다.\n<결과>\n• ㉠에서 측정한 무게: 15 g\n• ㉢에서 측정한 무게: □ g"
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "15",
      "accepted": [
        "15",
        "15 g",
        "15g"
      ]
    },
    "explanation": "물이 얼어 얼음이 되어도 무게는 변하지 않습니다. 따라서 ㉢에서 측정한 플라스틱병의 무게는 ㉠에서 측정한 15 g과 같습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "빈칸은 시험지에 빈 네모 칸으로 인쇄됨 — □로 옮김. 답란은 ( )."
    }
  },
  {
    "id": "s41-mid-o2-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 18,
      "page": 4,
      "sourceId": "sci-41-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "물이 얼거나 얼음이 녹을 때의 부피 변화 예",
      "concept": "물이 얼면 부피가 늘어나고, 얼음이 녹아 물이 되면 부피가 줄어든다."
    },
    "prompt": "부피 변화가 나머지 넷과 다른 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "겨울철 장독에 넣어 둔 물이 얼어 장독이 깨진다.",
      "겨울에 바위틈에 있던 물이 얼면서 바위가 쪼개진다.",
      "페트병에 물을 가득 넣어 얼리면 페트병이 뚱뚱해진다.",
      "한겨울에 수도관에 설치된 수도 계량기가 얼어서 터진다.",
      "얼음 틀 위로 올라와 있던 얼음이 녹으면 높이가 낮아진다."
    ],
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
    "explanation": "얼음 틀 위로 올라와 있던 얼음이 녹아 높이가 낮아지는 것은 얼음이 녹아 물이 될 때 부피가 줄어들기 때문입니다. ①~④는 물이 얼어 부피가 늘어나는 것과 관련된 예입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-mid-o2-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 19,
      "page": 4,
      "sourceId": "sci-41-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "증발의 뜻과 생활 속 예",
      "concept": "증발은 물 표면에서 액체인 물이 기체인 수증기로 상태가 변하는 현상이며, 빨래가 마르거나 염전에서 소금을 얻는 것이 그 예이다."
    },
    "prompt": "증발이란 무엇인지 쓰고, 우리 생활에서 증발과 관련된 예를 한 가지 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "물 표면에서 물이 수증기로 상태가 변하는 현상을 증발이라고 한다.\n예) 염전에서 소금을 만든다. / 과일을 말려 말린 과일을 만든다. / 젖은 빨래를 건조대에 널어 말린다. 등",
      "rubric": {
        "required": [
          "물 표면에서 물이 수증기로 변하는 현상이라는 증발의 뜻",
          "증발과 관련된 생활 속 예"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "증발의 정의와 예를 바르게 썼으면 정답으로 합니다. (100%)"
        ]
      }
    },
    "explanation": "물 표면에서 액체인 물이 기체인 수증기로 상태가 변하는 현상을 증발이라고 합니다. 우리 생활에서 증발과 관련된 다양한 예를 찾을 수 있습니다.\n[채점 기준] 증발의 정의와 예를 바르게 썼으면 정답으로 합니다. (100%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란은 밑줄 두 줄. 채점 기준은 비율 표시 없이 한 줄로 인쇄됨(100%로 적음)."
    }
  },
  {
    "id": "s41-mid-o2-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 20,
      "page": 4,
      "sourceId": "sci-41-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "물을 가열할 때 나타나는 현상",
      "concept": "물을 가열하여 끓이면 물의 표면과 물속에서 물이 수증기로 변해 날아가므로 물의 높이가 낮아진다."
    },
    "prompt": "다음과 같이 비커에 물을 반 정도 넣고 가열 장치로 가열하였습니다. 이때 나타나는 현상에 대해 바르게 설명한 사람의 이름을 쓰시오.",
    "givens": {
      "지문": "• 단비: 물이 수증기로 변합니다.\n• 다래: 물이 끓은 후 물의 높이가 높아집니다.\n• 하늘: 물속에서는 변화가 나타나지 않습니다."
    },
    "choices": null,
    "figure": "assets/bank/s41-mid/s2-q20.webp",
    "figureNote": "물이 반 정도 든 비커가 가열 장치(검은 원판) 위에 놓인 그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "단비",
      "accepted": [
        "단비"
      ]
    },
    "explanation": "물을 가열하면 물이 끓으면서 물의 표면과 물속에서 물이 수증기로 변해 공기 중으로 날아갑니다. 때문에 물이 끓은 후에 물의 높이가 낮아집니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "이름(단비·다래·하늘)과 쌍점은 굵게 인쇄됨. 답란은 ( )."
    }
  },
  {
    "id": "s41-mid-o2-21",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 21,
      "page": 4,
      "sourceId": "sci-41-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "증발과 끓음의 공통점",
      "concept": "증발과 끓음은 모두 액체인 물이 기체인 수증기로 상태가 변하는 현상이다."
    },
    "prompt": "증발과 끓음의 공통점으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "액체가 기체로 상태가 변한다.",
      "물속에서만 상태 변화가 일어난다.",
      "물 표면에서만 상태 변화가 일어난다.",
      "물의 세 가지 상태를 모두 볼 수 있다.",
      "물 표면과 물속에서 모두 상태 변화가 일어난다."
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "증발은 물 표면에서 액체인 물이 기체인 수증기로 상태가 변하는 현상이고, 끓음은 물 표면과 물속에서 모두 액체인 물이 기체인 수증기로 상태가 변하는 현상입니다. 증발과 끓음의 공통점은 액체인 물이 기체인 수증기로 상태가 변해 공기 중으로 흩어진다는 것입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-mid-o2-22",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 22,
      "page": 4,
      "sourceId": "sci-41-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "차가운 음료수 캔에 물방울이 맺히는 까닭",
      "concept": "공기 중의 수증기가 차가운 물체 표면에 닿으면 응결하여 물방울로 맺힌다."
    },
    "prompt": "다음은 차가운 음료수 캔에 물방울이 맺히는 까닭에 대한 설명입니다. ㉠, ㉡에 들어갈 말을 알맞게 짝 지은 것은 어느 것입니까?",
    "givens": {
      "지문": "공기 중의 ㉠이/가 차가운 음료수 캔 표면에 닿아 ㉡하여 물로 변하기 때문입니다."
    },
    "choices": [
      "얼음 / 증발",
      "얼음 / 응결",
      "수증기 / 증발",
      "수증기 / 응결",
      "수증기 / 끓음"
    ],
    "figure": "assets/bank/s41-mid/s2-q22.webp",
    "figureNote": "물방울이 맺힌 차가운 음료수 캔 여러 개를 위에서 찍은 사진.",
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
    "explanation": "공기 중의 수증기가 차가운 음료수 캔 표면에 닿아 응결하여 물로 변하기 때문에 음료수 캔에 물방울이 맺힙니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기는 표 형식(열 머리: ㉠ / ㉡). ㉠~㉣은 시험지에 네모 칸 안에 인쇄된 기호임."
    }
  },
  {
    "id": "s41-mid-o2-23",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 23,
      "page": 5,
      "sourceId": "sci-41-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "안경알이 흐려지는 현상의 상태 변화",
      "concept": "차가운 안경알에 공기 중의 수증기가 닿아 물로 맺히는 것은 기체가 액체로 변하는 응결이다."
    },
    "prompt": "다음 예와 관련된 물의 상태 변화로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "겨울철 밖에서 따뜻한 실내로 들어오면 안경알이 뿌옇게 흐려집니다."
    },
    "choices": [
      "고체 → 액체",
      "액체 → 고체",
      "액체 → 기체",
      "기체 → 고체",
      "기체 → 액체"
    ],
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
    "explanation": "겨울철 밖에서 따뜻한 실내로 들어오면 공기 중의 수증기가 응결하여 물로 변해 안경알에 맺히기 때문에 안경알이 뿌옇게 흐려집니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-mid-o2-24",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 24,
      "page": 5,
      "sourceId": "sci-41-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "물 부족으로 나타나는 현상",
      "concept": "물이 부족해지면 생물이 생명을 유지하기 어렵고 농사를 짓기 어려우며, 목욕이나 빨래도 자주 할 수 없게 된다."
    },
    "prompt": "물이 부족해지면 나타날 수 있는 현상에 대해 바르게 설명한 사람을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "지문": "• 단비: 농사를 짓기 어려워질 것입니다.\n• 다래: 동물이 생명을 유지하기 어려워질 것입니다.\n• 노을: 목욕이나 빨래를 더 자주할 수 있게 될 것입니다."
    },
    "choices": [
      "단비",
      "다래",
      "단비, 다래",
      "다래, 노을",
      "단비, 다래, 노을"
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "물은 모든 동식물의 생명을 유지하는 데 필요하므로 물이 부족해지면 동물이 생명을 유지하기 어려워지고, 농사도 짓기 어려워질 것입니다. 또한 물이 부족해지면 목욕이나 빨래를 자주 할 수 없게 될 것입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "이름(단비·다래·노을)과 쌍점은 굵게 인쇄됨. 노을의 말은 「더 자주할」로 붙여 인쇄됨(해설은 「자주 할」)."
    }
  },
  {
    "id": "s41-mid-o2-25",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 25,
      "page": 5,
      "sourceId": "sci-41-mid-set2",
      "edition": "시매쓰DMC 중간평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅳ. 중간평가"
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
      "track": "교과",
      "topic": "물 부족 해결 장치(해수 담수화 시설)",
      "concept": "해수 담수화 시설은 바닷물을 끓여 생긴 수증기를 식혀 소금 성분이 없는 깨끗한 물을 얻는 장치이다."
    },
    "prompt": "다음은 물 부족 현상을 해결하기 위한 장치에 대한 설명입니다. <보기>에서 이 장치로 알맞은 것을 골라 기호를 쓰시오.",
    "givens": {
      "지문": "바닷물을 끓여 얻은 수증기를 식혀 바닷물의 소금 성분이 제거된 깨끗한 물을 얻을 수 있습니다.",
      "보기": [
        "㉠ 솔라볼",
        "㉡ 와카워터",
        "㉢ 안개 수집기",
        "㉣ 해수 담수화 시설"
      ]
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉣",
      "accepted": [
        "㉣",
        "ㄹ",
        "㉣ 해수 담수화 시설",
        "해수 담수화 시설"
      ]
    },
    "explanation": "해수 담수화 시설을 이용하면 바닷물에서 소금 성분이 제거된 깨끗한 물을 얻을 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란은 ( )."
    }
  }
];
