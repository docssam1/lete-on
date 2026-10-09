// 3-2 Ⅶ 기말평가 — 단원평가 원문 40문항(시매쓰DMC 기말평가 세트1·2). 시험지를 그대로 옮기고 정답 및 풀이와 대조했다.
// 원장 지시(2026-10-09): 원문을 그대로 문제은행에 쓴다. 그림은 시험지에서 잘라 낸 것(assets/bank/s32-fin/).
export const source = [
  {
    "id": "s32-fin-o1-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 1,
      "page": 1,
      "sourceId": "sci-32-fin-set1",
      "edition": "시매쓰DMC 기말평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "나무 막대·물·공기 전달하기",
      "concept": "고체인 나무 막대는 모양이 일정해 잡아서 전달하기 쉽고, 액체인 물은 흘러내리며, 기체인 공기는 보이지 않고 잡을 수 없다."
    },
    "prompt": "나무 막대, 물, 공기를 친구에게 전달할 때에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "전달하는 동안 모양이 일정한 것은 물입니다.",
      "전달하는 동안 모양이 유지되는 것은 공기입니다.",
      "전달하는 동안 색깔이 계속 바뀌는 것은 공기입니다.",
      "잡을 수 있어서 전달하기 쉬운 것은 나무 막대입니다.",
      "눈에 보이지 않고 손으로 잡을 수 없는 것은 물과 공기입니다."
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
    "explanation": "전달하기 쉬운 것은 나무 막대이고, 눈에 보이지만 전달하는 동안 모양이 계속 변하고 흘러내려 전달하기 어려운 것은 물입니다. 공기는 눈에 보이지 않고 손으로 잡을 수 없어 전달했는지 알 수 없습니다.",
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
    "id": "s32-fin-o1-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 2,
      "page": 1,
      "sourceId": "sci-32-fin-set1",
      "edition": "시매쓰DMC 기말평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "고체가 아닌 물질 찾기",
      "concept": "우유는 흐르고 담는 그릇에 따라 모양이 바뀌는 액체이다."
    },
    "prompt": "고체가 아닌 것을 고르세요.",
    "givens": null,
    "choices": [
      "책",
      "우유",
      "연필",
      "지우개",
      "플라스틱 컵"
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
    "explanation": "우유는 액체이고, 책, 연필, 지우개, 플라스틱 컵은 고체입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '아닌'에 밑줄이 있음."
    }
  },
  {
    "id": "s32-fin-o1-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 3,
      "page": 1,
      "sourceId": "sci-32-fin-set1",
      "edition": "시매쓰DMC 기말평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "액체를 옮겨 담을 때 변하는 것",
      "concept": "액체는 담는 그릇에 따라 모양이 바뀌지만 부피는 변하지 않는다."
    },
    "prompt": "다음과 같이 여러 가지 모양의 투명한 그릇에 주스를 옮겨 담을 때 변하는 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 주스의 색깔",
        "ㄴ. 주스의 모양",
        "ㄷ. 주스의 부피",
        "ㄹ. 주스의 상태"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-fin/s1-q03.webp",
    "figureNote": "둥근 유리컵 → 손잡이 컵 → 길쭉한 원통 그릇으로 노란 주스를 차례로 옮겨 담는 그림(화살표).",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ",
        "주스의 모양",
        "모양"
      ]
    },
    "explanation": "주스를 여러 가지 모양의 그릇에 옮겨 담을 때 주스의 모양이 변합니다. 이때 주스의 색깔이나 부피, 상태는 변하지 않습니다.",
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
    "id": "s32-fin-o1-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 4,
      "page": 1,
      "sourceId": "sci-32-fin-set1",
      "edition": "시매쓰DMC 기말평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "액체 찾기",
      "concept": "사이다는 물처럼 흐르고 그릇 모양을 따르는 액체이다."
    },
    "prompt": "물과 상태가 같은 것을 고르세요.",
    "givens": null,
    "choices": [
      "모래",
      "설탕",
      "조약돌",
      "사이다",
      "플라스틱 막대"
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
    "explanation": "물과 사이다는 액체이고, 모래, 설탕, 조약돌, 플라스틱 막대는 고체입니다.",
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
    "id": "s32-fin-o1-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 5,
      "page": 1,
      "sourceId": "sci-32-fin-set1",
      "edition": "시매쓰DMC 기말평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "공기의 존재 확인",
      "concept": "물속에서 빈 병을 누르면 공기 방울이 생기므로, 보이지 않아도 우리 주변에 공기가 있다."
    },
    "prompt": "플라스틱병의 입구 부분을 물이 담긴 수조에 넣고 플라스틱병을 손으로 누르면 다음과 같은 변화가 나타납니다. 이를 통해 알 수 있는 것을 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s32-fin/s1-q05.webp",
    "figureNote": "물이 담긴 수조에 플라스틱병 입구를 넣고 손으로 누르자 병 입구에서 공기 방울이 생겨 올라가는 그림. 라벨 '플라스틱병'.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "공기는 눈에 보이지 않지만 우리 주변에 있습니다.",
      "rubric": {
        "required": [
          "눈에 보이지 않아도 우리 주변에 공기가 있다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "정답: 우리 주변에 공기가 있다는 것을 쓴 경우 (100%)",
          "부분 정답: 우리 주변에 공기가 있다는 것 외에 위의 실험으로 알 수 있는 내용을 쓴 경우 (30%)"
        ]
      }
    },
    "explanation": "플라스틱병을 누르면 플라스틱병 입구에서 공기 방울이 생겨 위로 올라와 사라집니다. 이를 통해 눈에 보이지 않지만 우리 주변에 공기가 있음을 알 수 있습니다.\n[채점 기준] 정답: 우리 주변에 공기가 있다는 것을 쓴 경우 (100%) / 부분 정답: 우리 주변에 공기가 있다는 것 외에 위의 실험으로 알 수 있는 내용을 쓴 경우 (30%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "문항지에 그림만 있고 '다음과 같은 변화'(공기 방울)가 글로 적혀 있지 않음. 채점 기준의 '정답/부분 정답'은 표의 행 머리."
    }
  },
  {
    "id": "s32-fin-o1-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 6,
      "page": 1,
      "sourceId": "sci-32-fin-set1",
      "edition": "시매쓰DMC 기말평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "공기가 공간을 차지하는 성질의 이용",
      "concept": "축구공과 자전거 타이어는 안에 공기를 채워 공기가 공간을 차지하는 성질을 이용한다."
    },
    "prompt": "공기가 공간을 차지하는 성질을 이용한 예를 모두 고르세요. (정답 2 개)",
    "givens": null,
    "choices": [
      "가위",
      "축구공",
      "쇠구슬",
      "바람개비",
      "자전거 타이어"
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
        4
      ]
    },
    "explanation": "축구공과 자전거 타이어 안에는 공기가 들어 있습니다. 이는 공기가 공간을 차지하는 성질을 이용한 예입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "숫자와 단위 사이(예: '2 개', '10 번') 좁은 조판 공백이 인쇄되어 있어 공백으로 옮김."
    }
  },
  {
    "id": "s32-fin-o1-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 7,
      "page": 2,
      "sourceId": "sci-32-fin-set1",
      "edition": "시매쓰DMC 기말평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "컵 속 공기가 공간을 차지함",
      "concept": "뒤집은 컵 속 공기가 공간을 차지해 물을 밀어 내므로 컵 안 물 위의 뚜껑은 내려가고 수조의 물 높이는 높아진다."
    },
    "prompt": "다음과 같이 바닥에 구멍이 뚫리지 않은 투명한 플라스틱 컵을 뒤집어 물 위에 띄워져 있는 페트병 뚜껑을 덮은 뒤 수조 바닥까지 천천히 밀어 넣었습니다. 이에 대한 설명으로 옳은 것을 모두 고르세요. (정답 2 개)",
    "givens": null,
    "choices": [
      "물의 높이는 변하지 않습니다.",
      "물의 높이는 처음보다 높아집니다.",
      "물의 높이는 처음보다 낮아집니다.",
      "페트병 뚜껑은 수조 바닥으로 내려갑니다.",
      "페트병 뚜껑은 처음 높이 그대로 물 위에 떠 있습니다."
    ],
    "figure": "assets/bank/s32-fin/s1-q07.webp",
    "figureNote": "물 위에 뜬 빨간 페트병 뚜껑을 투명한 플라스틱 컵을 뒤집어 덮고 손으로 누르는 수조 그림.",
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
    "explanation": "컵 바닥에 구멍이 뚫리지 않은 컵을 수조 바닥까지 밀어 넣으면 컵 안의 공기가 물을 밀어 내기 때문에 페트병 뚜껑이 수조 바닥으로 내려가고, 수조 안 물의 높이가 높아집니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "숫자와 단위 사이(예: '2 개', '10 번') 좁은 조판 공백이 인쇄되어 있어 공백으로 옮김."
    }
  },
  {
    "id": "s32-fin-o1-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 8,
      "page": 2,
      "sourceId": "sci-32-fin-set1",
      "edition": "시매쓰DMC 기말평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "공기의 이동",
      "concept": "비닐관으로 연결한 주사기의 피스톤을 밀고 당기면 공기가 관을 따라 이동해 다른 주사기의 피스톤을 움직인다."
    },
    "prompt": "다음과 같이 스타이로폼 공을 붙인 주사기와 다른 주사기를 비닐관으로 연결한 뒤 왼쪽 주사기의 피스톤을 밀었다가 당기면 스타이로폼 공이 움직입니다. 이를 통해 알 수 있는 내용으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "공기는 눈에 보입니다.",
      "공기는 색깔과 냄새가 없습니다.",
      "공기는 모양과 부피가 일정합니다.",
      "공기는 전달할 수 없는 상태입니다.",
      "공기는 다른 곳으로 이동할 수 있습니다."
    ],
    "figure": "assets/bank/s32-fin/s1-q08.webp",
    "figureNote": "두 손으로 잡은 왼쪽 주사기가 비닐관으로 오른쪽 위 주사기와 연결되고, 그 주사기 피스톤 끝에 파란 스타이로폼 공이 붙어 있는 그림. 라벨 '스타이로폼 공', '비닐관'.",
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
    "explanation": "왼쪽 주사기의 피스톤을 밀면 주사기 속 공기가 이동하면서 오른쪽 주사기의 피스톤을 밀어내면서 스타이로폼 공이 움직이고, 왼쪽 주사기의 피스톤을 당기면 오른쪽 주사기의 피스톤이 제자리로 돌아오면서 스타이로폼 공도 원래 자리로 되돌아옵니다. 이를 통해 공기가 다른 곳으로 이동할 수 있다는 것을 알 수 있습니다.",
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
    "id": "s32-fin-o1-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 9,
      "page": 2,
      "sourceId": "sci-32-fin-set1",
      "edition": "시매쓰DMC 기말평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "공기의 무게 비교",
      "concept": "공기도 무게가 있어 페트병에 공기를 많이 넣을수록 무게가 무거워진다."
    },
    "prompt": "페트병 입구에 공기 주입 마개를 끼우고, 공기 주입 마개를 누르는 횟수를 다르게 하여 무게를 측정하였습니다. 무게가 무거운 것부터 순서대로 기호를 나열하세요.",
    "givens": {
      "보기": [
        "ㄱ. 공기 주입 마개를 10 번 누른 페트병",
        "ㄴ. 공기 주입 마개를 20 번 누른 페트병",
        "ㄷ. 공기 주입 마개를 한 번도 누르지 않은 페트병"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-fin/s1-q09.webp",
    "figureNote": "공기 주입 마개를 끼운 페트병을 전자저울 위에 올려놓은 그림. 라벨 '공기 주입 마개'.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ, ㄱ, ㄷ",
      "accepted": [
        "ㄴ, ㄱ, ㄷ",
        "ㄴ,ㄱ,ㄷ",
        "ㄴㄱㄷ",
        "ㄴ ㄱ ㄷ",
        "ㄴ-ㄱ-ㄷ",
        "ㄴ>ㄱ>ㄷ"
      ]
    },
    "explanation": "공기 주입 마개를 누르면 페트병 안으로 공기가 들어가 페트병의 무게가 늘어납니다. 공기 주입 마개를 누르는 횟수가 많아질수록 들어가는 공기의 양이 많아져 무거워집니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "숫자와 단위 사이(예: '2 개', '10 번') 좁은 조판 공백이 인쇄되어 있어 공백으로 옮김. 답란은 '( ), ( ), ( )' 세 칸."
    }
  },
  {
    "id": "s32-fin-o1-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 10,
      "page": 2,
      "sourceId": "sci-32-fin-set1",
      "edition": "시매쓰DMC 기말평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "기체(공기)의 성질",
      "concept": "공기는 무게가 있고 이동할 수 있으며, 담는 그릇에 따라 모양과 부피가 변해 그릇을 가득 채운다."
    },
    "prompt": "공기에 대한 설명으로 옳은 것을 <보기>에서 모두 골라 짝 지은 것은?",
    "givens": {
      "보기": [
        "ㄱ. 무게가 없습니다.",
        "ㄴ. 담긴 그릇을 항상 가득 채웁니다.",
        "ㄷ. 다른 곳으로 이동할 수 없습니다.",
        "ㄹ. 담는 그릇에 따라 모양은 변하지만 부피는 변하지 않습니다."
      ]
    },
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ, ㄹ"
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
    "explanation": "공기는 무게가 있고, 다른 곳으로 이동할 수 있습니다. 담는 그릇에 따라 모양과 부피가 변하며, 담긴 그릇을 항상 가득 채웁니다.",
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
    "id": "s32-fin-o1-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 11,
      "page": 3,
      "sourceId": "sci-32-fin-set1",
      "edition": "시매쓰DMC 기말평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "장난감 재료의 상태",
      "concept": "페트병은 모양이 일정한 고체이고 물은 흐르는 액체이다."
    },
    "prompt": "괄호 ㉠과 ㉡에 들어갈 알맞은 말을 골라 각각 쓰세요.",
    "givens": {
      "지문": "물고기 배 장난감은 ㉠( 고체, 액체, 기체 )인 페트병과, ㉡( 고체, 액체, 기체 )인 물을 이용하여 만든 장난감입니다."
    },
    "choices": null,
    "figure": "assets/bank/s32-fin/s1-q11.webp",
    "figureNote": "물이 담긴 대야 위에 페트병 등으로 만든 물고기 배 장난감(빨대 돛대에 파란 깃발)이 떠 있는 그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-고체, ㉡-액체",
      "accepted": [
        "㉠-고체, ㉡-액체",
        "㉠ 고체, ㉡ 액체",
        "고체, 액체",
        "고체,액체",
        "고체 액체",
        "㉠ 고체 ㉡ 액체",
        "ㄱ-고체, ㄴ-액체"
      ]
    },
    "explanation": "물고기 배 장난감은 고체인 페트병과 액체인 물을 이용하여 만든 장난감입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란은 '㉠-( ), ㉡-( )'."
    }
  },
  {
    "id": "s32-fin-o1-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 12,
      "page": 3,
      "sourceId": "sci-32-fin-set1",
      "edition": "시매쓰DMC 기말평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "소리가 나는 물체의 떨림",
      "concept": "소리가 나는 소리굽쇠는 떨리고 있어 물에 대면 그 떨림 때문에 물이 튀어 오른다."
    },
    "prompt": "소리굽쇠 두 개를 각각 수조에 담긴 물에 가까이 대어 보았더니 다음과 같은 결과가 나타났습니다. ㄱ과 ㄴ 중에서 소리가 나는 소리굽쇠를 골라 기호를 쓰세요.",
    "givens": {
      "표": {
        "ㄱ": [
          "아무 변화 없습니다."
        ],
        "ㄴ": [
          "물이 튀어 오릅니다."
        ]
      }
    },
    "choices": null,
    "figure": "assets/bank/s32-fin/s1-q12.webp",
    "figureNote": "표: 맨 위 병합 머리 '소리굽쇠', 아래 열 ㄱ·ㄴ, 결과 행 '아무 변화 없습니다.'/'물이 튀어 오릅니다.'",
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
    "explanation": "소리가 나고 있는 소리굽쇠를 물에 가까이 대어 보면 소리굽쇠의 떨림이 물에 전달되어 물이 튀어 오릅니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "표의 맨 윗줄 '소리굽쇠'는 ㄱ·ㄴ 두 열에 걸친 병합 머리."
    }
  },
  {
    "id": "s32-fin-o1-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 13,
      "page": 3,
      "sourceId": "sci-32-fin-set1",
      "edition": "시매쓰DMC 기말평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "소리의 세기와 떨림",
      "concept": "작은북을 세게 칠수록 북이 크게 떨려 좁쌀이 높이 튀고 큰 소리가 난다."
    },
    "prompt": "다음은 작은북 위에 좁쌀을 올려놓고 작은북을 북채로 치는 세기를 다르게 하였을 때 좁쌀이 튀어 오르는 모습입니다. 더 큰 소리가 나는 경우를 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. ▲좁쌀이 낮게 튀어 오름.",
        "ㄴ. ▲좁쌀이 높게 튀어 오름."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-fin/s1-q13.webp",
    "figureNote": "<보기> 상자 안 그림 두 장: ㄱ 북채로 작은북을 약하게 쳐 좁쌀이 낮게 튐, ㄴ 북채를 높이 들어 세게 쳐 좁쌀이 높게 튐. 각 그림 아래 캡션.",
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
    "explanation": "작은북을 약하게 치면 북이 작게 떨리면서 좁쌀이 낮게 튀어 오르고 작은 소리가 납니다. 작은북을 세게 치면 북이 많이 떨리면서 좁쌀이 높게 튀어 오르고 큰 소리가 납니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>는 그림 보기이며, 각 그림 아래 캡션('▲좁쌀이 …')을 보기 항목으로 옮김."
    }
  },
  {
    "id": "s32-fin-o1-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 14,
      "page": 3,
      "sourceId": "sci-32-fin-set1",
      "edition": "시매쓰DMC 기말평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "소리의 세기의 뜻",
      "concept": "소리의 세기는 소리의 크고 작은 정도로, 물체가 크게 떨릴수록 큰 소리가 난다."
    },
    "prompt": "소리의 세기에 대한 설명으로 옳은 것을 모두 고르세요. (정답 2 개)",
    "givens": null,
    "choices": [
      "소리의 높고 낮은 정도입니다.",
      "소리의 크고 작은 정도입니다.",
      "물체가 크게 떨리면 높은 소리가 납니다.",
      "물체가 작게 떨리면 낮은 소리가 납니다.",
      "소리의 세기는 물체가 떨리는 정도에 따라 달라집니다."
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
        4
      ]
    },
    "explanation": "소리의 크고 작은 정도를 소리의 세기라고 합니다. 소리의 세기는 물체가 떨리는 정도에 따라 달라집니다. 물체가 크게 떨리면 큰 소리가 나고, 작게 떨리면 작은 소리가 납니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "숫자와 단위 사이(예: '2 개', '10 번') 좁은 조판 공백이 인쇄되어 있어 공백으로 옮김."
    }
  },
  {
    "id": "s32-fin-o1-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 15,
      "page": 4,
      "sourceId": "sci-32-fin-set1",
      "edition": "시매쓰DMC 기말평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "글로켄슈필과 소리의 높낮이",
      "concept": "음판이 짧을수록 빠르게 떨려 높은 소리가 나고, 길수록 느리게 떨려 낮은 소리가 난다."
    },
    "prompt": "글로켄슈필에 대한 설명으로 옳은 것을 모두 고르세요. (정답 2 개)",
    "givens": null,
    "choices": [
      "음판의 길이에 따라 세기가 다른 소리가 납니다.",
      "음판의 길이에 따라 높낮이가 다른 소리가 납니다.",
      "ㄱ~ㄷ 중에서 가장 높은 소리가 나는 음판은 ㄷ입니다.",
      "음판을 같은 힘으로 쳤을 때 ㄱ은 ㄷ보다 빠르게 떨립니다.",
      "음판을 같은 힘으로 쳤을 때 ㄴ과 ㄷ이 떨리는 빠르기는 같습니다."
    ],
    "figure": "assets/bank/s32-fin/s1-q15.webp",
    "figureNote": "왼쪽에서 오른쪽으로 갈수록 짧아지는 무지개색 음판의 글로켄슈필과 채 두 개. 가장 긴 왼쪽 음판 ㄱ, 가운데 음판 ㄴ, 짧은 오른쪽 음판 ㄷ 표시.",
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
    "explanation": "글로켄슈필은 음판의 길이에 따라 다른 높낮이의 소리가 나는 악기입니다. 글로켄슈필의 짧은 음판을 치면 음판이 빠르게 떨리면서 높은 소리가 나고, 긴 음판을 치면 음판이 느리게 떨리면서 낮은 소리가 납니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "숫자와 단위 사이(예: '2 개', '10 번') 좁은 조판 공백이 인쇄되어 있어 공백으로 옮김."
    }
  },
  {
    "id": "s32-fin-o1-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 16,
      "page": 4,
      "sourceId": "sci-32-fin-set1",
      "edition": "시매쓰DMC 기말평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "위험을 알리는 소리",
      "concept": "위험 신호는 멀리 퍼지는 큰 소리와 주의를 끄는 높은 소리를 함께 쓴다."
    },
    "prompt": "위험을 알리는 소리의 특징으로 가장 적절한 것을 고르세요.",
    "givens": null,
    "choices": [
      "크고 낮은 소리",
      "크고 높은 소리",
      "작고 낮은 소리",
      "작고 높은 소리",
      "점점 작아지는 소리"
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
    "explanation": "위험을 알리는 소리는 보통 크고 높은 소리를 이용합니다. 큰 소리는 위험을 알리는 소리를 멀리까지 전달해 주고, 높은 소리는 주의를 집중시키거나 불안감을 느끼게 하여 사람들이 위험을 느끼게 해 줍니다.",
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
    "id": "s32-fin-o1-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 17,
      "page": 4,
      "sourceId": "sci-32-fin-set1",
      "edition": "시매쓰DMC 기말평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "소리를 전달하는 물질",
      "concept": "소리는 고체뿐 아니라 기체인 공기와 액체인 물을 통해서도 전달된다."
    },
    "prompt": "고체 상태의 물질에 의해 소리가 전달되는 경우가 아닌 것을 모두 고르세요. (정답 2 개)",
    "givens": null,
    "choices": [
      "실 전화기로 친구와 이야기 할 때",
      "운동장에서 멀리 있는 친구를 부를 때",
      "책상에 귀를 대고 책상을 두드리는 소리를 들을 때",
      "땅에 귀를 대고 멀리에서 오는 자동차 소리를 들을 때",
      "수중 발레 선수가 물속에서 음악을 들으며 동작을 할 때"
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
        4
      ]
    },
    "explanation": "운동장에서 멀리 있는 친구를 부르는 것은 기체인 공기를 통해 소리가 전달되는 경우이고, 수중 발레 선수가 물속에서 음악을 들으며 동작을 하는 것은 액체인 물을 통해 소리가 전달되는 경우입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '아닌'에 밑줄이 있음. ①의 '이야기 할'은 인쇄된 띄어쓰기 그대로. 숫자와 단위 사이(예: '2 개', '10 번') 좁은 조판 공백이 인쇄되어 있어 공백으로 옮김."
    }
  },
  {
    "id": "s32-fin-o1-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 18,
      "page": 4,
      "sourceId": "sci-32-fin-set1",
      "edition": "시매쓰DMC 기말평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "실 전화기의 소리 전달",
      "concept": "실 전화기는 소리의 떨림이 고체인 실을 따라 전달되어 다른 쪽 종이컵에서 들린다."
    },
    "prompt": "다음은 실 전화기에 대한 설명입니다. 빈칸 ㉠과 ㉡에 들어갈 알맞은 말을 바르게 짝 지은 것을 고르세요.",
    "givens": {
      "지문": "• 실 전화기의 한쪽 종이컵에 입을 대고 소리를 내면 [㉠](을)를 통해 소리가 전달되어 다른 쪽 종이컵에서 소리를 들을 수 있습니다.\n• 실 전화기에 말을 하면서 [㉠]에 손을 대 보면 약한 [㉡](이)가 느껴집니다."
    },
    "choices": [
      "공기 / 떨림",
      "실 / 떨림",
      "종이컵 / 실",
      "공기 / 차가움",
      "종이컵 / 뜨거움"
    ],
    "figure": "assets/bank/s32-fin/s1-q18.webp",
    "figureNote": "글상자(빈칸 ㉠·㉡은 네모 칸으로 인쇄)와 그 아래 ㉠·㉡ 열 머리의 선택지 표.",
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
    "explanation": "실 전화기의 한쪽 종이컵에 입을 대고 소리를 내면 실을 통해 소리가 전달되어 다른 쪽 종이컵에서 소리를 들을 수 있습니다. 실 전화기에 말을 하면서 실에 손을 대 보면 약한 떨림이 느껴집니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "선택지는 표 형식: 열 머리 '㉠', '㉡'(밑줄), 행 ①~⑤를 '① ㉠ / ㉡'로 옮김. 지문의 빈칸은 네모 칸 안의 ㉠·㉡이며 [㉠]으로 표기함."
    }
  },
  {
    "id": "s32-fin-o1-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 19,
      "page": 4,
      "sourceId": "sci-32-fin-set1",
      "edition": "시매쓰DMC 기말평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "소리의 반사",
      "concept": "목욕탕이나 동굴에서는 소리가 벽에 부딪쳐 되돌아오는 반사 때문에 소리가 울린다."
    },
    "prompt": "목욕탕과 동굴에서 공통적으로 나타나는 현상으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "소리가 들리지 않습니다.",
      "소리가 점점 크게 들립니다.",
      "소리가 물을 통해 전달됩니다.",
      "소리가 낮은 음으로만 들립니다.",
      "소리가 물체에 부딪쳐 되돌아오면서 울립니다."
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
    "explanation": "목욕탕과 동굴에서 소리를 내면 소리가 벽에 부딪쳐 되돌아오기 때문에 소리가 울립니다.",
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
    "id": "s32-fin-o1-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 20,
      "page": 4,
      "sourceId": "sci-32-fin-set1",
      "edition": "시매쓰DMC 기말평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "소음을 줄이는 방법",
      "concept": "방음벽으로 소리를 반사시키거나 소음원의 떨림을 줄이면 소음을 줄일 수 있다."
    },
    "prompt": "소리의 성질과 관련하여 소음을 줄이는 방법에 대한 설명으로 옳은 것을 모두 고르세요. (정답 2 개)",
    "givens": null,
    "choices": [
      "소리의 세기가 더 커지도록 합니다.",
      "방음벽을 설치해 소리를 반사시킵니다.",
      "소음을 일으키는 물체를 떨리지 않게 합니다.",
      "소음을 일으키는 물체의 떨림을 더 크게 만듭니다.",
      "소음을 일으키는 물체에 소리가 잘 전달되는 물질을 붙입니다."
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
        2
      ]
    },
    "explanation": "방음벽을 설치해 소리를 반사시키거나 소음을 일으키는 물체의 떨림을 줄이면 소음을 줄일 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "숫자와 단위 사이(예: '2 개', '10 번') 좁은 조판 공백이 인쇄되어 있어 공백으로 옮김."
    }
  },
  {
    "id": "s32-fin-o2-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 1,
      "page": 1,
      "sourceId": "sci-32-fin-set2",
      "edition": "시매쓰DMC 기말평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "고체·액체·기체의 특징",
      "concept": "액체인 물은 흘러내리기 때문에 고체처럼 손으로 잡을 수 없다."
    },
    "prompt": "다음은 나무 막대, 물, 공기의 모습입니다. 이에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "ㄱ은 딱딱합니다.",
      "ㄴ은 흔들면 출렁거립니다.",
      "ㄷ은 눈에 보이지 않습니다.",
      "ㄷ은 손에 잡히지 않습니다.",
      "ㄱ과 ㄴ은 손으로 쉽게 잡을 수 있습니다."
    ],
    "figure": "assets/bank/s32-fin/s2-q01.webp",
    "figureNote": "ㄱ. 나무 막대(나무 판), ㄴ. 물이 담긴 컵, ㄷ. 공기가 든 지퍼 비닐봉지 그림이 세로로 놓인 상자",
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
    "explanation": "ㄱ은 나무 막대, ㄴ은 물, ㄷ은 공기입니다. 물은 손으로 잡으면 흘러내려 잡을 수 없습니다.",
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
    "id": "s32-fin-o2-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 2,
      "page": 1,
      "sourceId": "sci-32-fin-set2",
      "edition": "시매쓰DMC 기말평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "고체의 성질",
      "concept": "고체는 담는 그릇이 바뀌어도 모양과 부피가 변하지 않는다."
    },
    "prompt": "나무 막대와 플라스틱 막대의 공통점으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "단단합니다.",
      "눈으로 볼 수 있습니다.",
      "손으로 잡을 수 있습니다.",
      "여러 가지 모양의 그릇에 옮겨 담으면 모양이 변합니다.",
      "여러 가지 모양의 그릇에 옮겨 담아도 부피가 변하지 않습니다."
    ],
    "figure": "assets/bank/s32-fin/s2-q02.webp",
    "figureNote": "나무 막대와 노란 플라스틱 막대 그림(캡션 ▲나무 막대, ▲플라스틱 막대)",
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
    "explanation": "나무 막대와 플라스틱 막대 모두 여러 가지 모양의 그릇에 옮겨 담아도 모양과 부피가 변하지 않습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄. 줄바꿈으로 나뉜 보기 문장은 이어 붙여 적음."
    }
  },
  {
    "id": "s32-fin-o2-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 3,
      "page": 1,
      "sourceId": "sci-32-fin-set2",
      "edition": "시매쓰DMC 기말평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "액체 찾기",
      "concept": "액체는 담는 그릇에 따라 모양이 변하므로 오렌지 주스는 옮겨 담으면 모양이 변한다."
    },
    "prompt": "다른 그릇에 옮겨 담았을 때 모양이 변하는 것을 고르세요.",
    "givens": null,
    "choices": [
      "가위",
      "볼펜",
      "지우개",
      "유리구슬",
      "오렌지 주스"
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
    "explanation": "가위, 볼펜, 지우개, 유리구슬은 고체, 오렌지 주스는 액체입니다. 다른 그릇에 옮겨 담았을 때 모양이 변하는 것은 액체인 오렌지 주스입니다.",
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
    "id": "s32-fin-o2-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 4,
      "page": 2,
      "sourceId": "sci-32-fin-set2",
      "edition": "시매쓰DMC 기말평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "액체의 모양과 부피",
      "concept": "물을 여러 모양의 그릇에 옮겨 담으면 모양은 변하지만 부피는 그대로이다."
    },
    "prompt": "다음과 같이 ㉠ 그릇에 물을 담은 후 ㉡과 ㉢ 그릇에 순서대로 옮겨 담았습니다. 이에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "㉠에 담긴 물을 ㉡으로 옮기면 물의 모양이 변합니다.",
      "㉡으로 옮긴 물을 ㉢으로 옮기면 물의 모양이 변합니다.",
      "㉢으로 옮긴 물을 다시 ㉠으로 옮기면 물의 모양이 변합니다.",
      "㉢으로 옮긴 물을 다시 ㉠으로 옮기면 물의 부피가 변합니다.",
      "㉢으로 옮긴 물을 다시 ㉠으로 옮겼을 때 물의 높이는 처음과 같습니다."
    ],
    "figure": "assets/bank/s32-fin/s2-q04.webp",
    "figureNote": "㉠ 물이 담긴 길쭉한 원통(눈금실린더 모양), ㉡ 둥근 항아리 모양 그릇, ㉢ 머그컵",
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
    "explanation": "여러 가지 모양의 그릇에 물을 옮겨 담으면 그릇에 따라 물의 모양은 변하지만 부피는 변하지 않습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄. 줄바꿈으로 나뉜 보기 문장은 이어 붙여 적음."
    }
  },
  {
    "id": "s32-fin-o2-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 5,
      "page": 2,
      "sourceId": "sci-32-fin-set2",
      "edition": "시매쓰DMC 기말평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "액체와 고체 구분",
      "concept": "설탕은 알갱이 하나하나의 모양과 부피가 일정한 고체이고 물·우유·식초·간장은 액체이다."
    },
    "prompt": "액체가 아닌 것을 고르세요.",
    "givens": null,
    "choices": [
      "물",
      "우유",
      "식초",
      "간장",
      "설탕"
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
    "explanation": "물, 우유, 식초, 간장은 액체, 설탕은 고체입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '아닌'에 밑줄."
    }
  },
  {
    "id": "s32-fin-o2-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 6,
      "page": 2,
      "sourceId": "sci-32-fin-set2",
      "edition": "시매쓰DMC 기말평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "공기의 존재 확인",
      "concept": "주사기 속 공기를 물속에서 밀어내면 공기 방울로 보이므로 공기가 있음을 알 수 있다."
    },
    "prompt": "빈칸에 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "주사기의 피스톤을 바깥으로 당긴 뒤 주사기를 물이 담긴 수조 속에 넣고 피스톤을 밀면 주사기 끝에서 □(이)가 생겨 위로 올라옵니다."
    },
    "choices": null,
    "figure": "assets/bank/s32-fin/s2-q06.webp",
    "figureNote": "물이 담긴 수조 속에 손으로 주사기를 비스듬히 넣은 그림(라벨 '주사기')",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "공기 방울",
      "accepted": [
        "공기 방울",
        "공기방울"
      ]
    },
    "explanation": "주사기의 피스톤을 바깥으로 당긴 뒤 주사기를 물이 담긴 수조 속에 넣고 피스톤을 밀면 주사기 끝에서 공기 방울이 생겨 위로 올라옵니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문의 빈칸은 네모 칸으로 인쇄됨(□로 표기)."
    }
  },
  {
    "id": "s32-fin-o2-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 7,
      "page": 2,
      "sourceId": "sci-32-fin-set2",
      "edition": "시매쓰DMC 기말평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "기체(공기)의 성질",
      "concept": "공기는 눈에 보이지 않고 담는 그릇에 따라 모양과 부피가 모두 변하는 기체이다."
    },
    "prompt": "다음 물체들 속에 공통적으로 들어 있는 물질에 대한 설명으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": {
      "지문": "▲공기베개 ▲축구공"
    },
    "choices": [
      "단단합니다.",
      "눈으로 볼 수 없습니다.",
      "손으로 잡을 수 있습니다.",
      "담는 그릇에 따라 모양이 변합니다.",
      "담는 그릇이 바뀌어도 부피는 일정합니다."
    ],
    "figure": "assets/bank/s32-fin/s2-q07.webp",
    "figureNote": "공기베개(목베개) 사진과 축구공 사진, 캡션 ▲공기베개 ▲축구공",
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
    "explanation": "공기베개와 축구공 속에 들어 있는 물질은 공기입니다. 공기는 눈에 보이지 않고 손으로 잡을 수 없습니다. 또한 공기는 담는 그릇에 따라 모양과 부피가 모두 변합니다.",
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
    "id": "s32-fin-o2-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 8,
      "page": 2,
      "sourceId": "sci-32-fin-set2",
      "edition": "시매쓰DMC 기말평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "공기가 공간을 차지하는 성질의 이용",
      "concept": "자동차 타이어·풍선 미끄럼틀·공기 침대는 공기가 공간을 차지하는 성질을 이용한다."
    },
    "prompt": "다음 물체들에 공통적으로 이용된 공기의 성질로 알맞은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "자동차 타이어, 풍선 미끄럼틀, 공기 침대",
      "보기": [
        "ㄱ. 공기는 무게가 있습니다.",
        "ㄴ. 공기는 공간을 차지합니다.",
        "ㄷ. 공기는 눈에 보이지 않습니다.",
        "ㄹ. 공기는 손으로 잡을 수 없습니다."
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
      "answer": "ㄴ",
      "accepted": [
        "ㄴ",
        "공기는 공간을 차지합니다."
      ]
    },
    "explanation": "자동차 타이어, 풍선 미끄럼틀, 공기 침대는 공기가 공간을 차지하는 성질을 이용해 만든 물체들입니다.",
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
    "id": "s32-fin-o2-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 9,
      "page": 2,
      "sourceId": "sci-32-fin-set2",
      "edition": "시매쓰DMC 기말평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "기체의 성질",
      "concept": "기체는 담긴 그릇을 항상 가득 채우며 그릇에 따라 모양과 부피가 변한다."
    },
    "prompt": "다음은 고체, 액체, 기체 중 어떤 물질의 상태에 대한 설명인지 쓰세요.",
    "givens": {
      "지문": "• 담긴 그릇을 항상 가득 채웁니다.\n• 담는 그릇에 따라 모양과 부피가 변합니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
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
    "explanation": "기체는 담는 그릇에 따라 모양과 부피가 변하고, 항상 담긴 그릇을 가득 채웁니다.",
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
    "id": "s32-fin-o2-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 10,
      "page": 3,
      "sourceId": "sci-32-fin-set2",
      "edition": "시매쓰DMC 기말평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "공기의 무게",
      "concept": "페트병에 공기를 더 넣을수록 무게가 늘어나므로 공기는 무게가 있다."
    },
    "prompt": "페트병 입구에 공기 주입 마개를 끼우고, 공기 주입 마개를 누르는 횟수에 따른 무게를 측정하였습니다. 이에 대한 설명으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "공기 주입 마개를 누르기 전에는 페트병 속에 공기가 없습니다.",
      "공기 주입 마개를 누르기 전과 여러 번 누른 후의 무게는 같습니다.",
      "공기 주입 마개를 누르면 외부의 공기가 페트병 안으로 들어갑니다.",
      "공기 주입 마개를 누르기 전보다 여러 번 누른 후의 무게가 더 무겁습니다.",
      "공기 주입 마개를 여러 번 누를수록 페트병에 들어 있는 공기가 줄어듭니다."
    ],
    "figure": "assets/bank/s32-fin/s2-q10.webp",
    "figureNote": "공기 주입 마개(라벨 '공기 주입 마개')를 끼운 페트병이 전자저울 위에 놓인 그림",
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
    "explanation": "공기 주입 마개를 누르면 공기가 페트병 안으로 들어가 무거워집니다. 이때 공기 주입 마개를 누르는 횟수가 늘어날수록 무게가 더 많이 늘어납니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "줄바꿈으로 나뉜 보기 문장은 이어 붙여 적음."
    }
  },
  {
    "id": "s32-fin-o2-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 11,
      "page": 3,
      "sourceId": "sci-32-fin-set2",
      "edition": "시매쓰DMC 기말평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "소리가 나는 물체의 떨림",
      "concept": "소리가 나는 물체는 떨리므로 손을 대면 떨림이 느껴진다."
    },
    "prompt": "소리가 나는 스피커에 손을 대 보았을 때 나타나는 현상으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "소리가 사라집니다.",
      "소리가 점점 커집니다.",
      "손에 떨림이 느껴집니다.",
      "소리가 점점 작아집니다.",
      "스피커가 점점 무거워집니다."
    ],
    "figure": "assets/bank/s32-fin/s2-q11.webp",
    "figureNote": "소리가 나는 스피커에 손을 대고 있는 아이 그림",
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
    "explanation": "소리가 나는 스피커에 손을 대 보면 떨림이 느껴집니다.",
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
    "id": "s32-fin-o2-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 12,
      "page": 3,
      "sourceId": "sci-32-fin-set2",
      "edition": "시매쓰DMC 기말평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "떨림을 멈춰 소리 멈추기",
      "concept": "소리가 나는 물체의 떨림을 멈추게 하면 소리도 멈춘다."
    },
    "prompt": "소리가 나는 심벌즈에서 소리가 나지 않게 하기 위한 방법으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 심벌즈를 고무망치로 칩니다.",
        "ㄴ. 심벌즈를 손으로 세게 잡습니다.",
        "ㄷ. 심벌즈끼리 세게 부딪치게 합니다."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-fin/s2-q12.webp",
    "figureNote": "장갑 낀 손으로 심벌즈를 들고 있는 사진",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ",
        "심벌즈를 손으로 세게 잡습니다."
      ]
    },
    "explanation": "소리가 나는 심벌즈를 손으로 세게 잡으면 떨림이 멈추면서 소리가 나지 않게 됩니다.",
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
    "id": "s32-fin-o2-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 13,
      "page": 4,
      "sourceId": "sci-32-fin-set2",
      "edition": "시매쓰DMC 기말평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "소리의 세기와 떨림",
      "concept": "작은북을 세게 칠수록 북이 많이 떨려 큰 소리가 나고 좁쌀도 높이 튄다."
    },
    "prompt": "다음은 작은북 위에 좁쌀을 올려놓고 작은북을 북채로 치는 모습입니다. 이에 대한 설명으로 옳지 않은 것을 <보기>에서 모두 골라 짝 지은 것은?",
    "givens": {
      "보기": [
        "ㄱ. 작은북을 약하게 칠수록 북이 많이 떨립니다.",
        "ㄴ. 작은북을 세게 치면 좁쌀이 높게 튀어 오릅니다.",
        "ㄷ. 작은북을 칠 때 생긴 떨림이 좁쌀에 전달되어 좁쌀이 튀어 오릅니다."
      ]
    },
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄷ",
      "ㄱ, ㄴ",
      "ㄱ, ㄴ, ㄷ"
    ],
    "figure": "assets/bank/s32-fin/s2-q13.webp",
    "figureNote": "좁쌀을 올려놓은 작은북을 두 북채로 치는 사람 그림",
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
    "explanation": "작은북을 약하게 칠수록 북이 작게 떨리고, 세게 칠수록 북이 많이 떨립니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄. 보기 문장의 줄바꿈은 이어 붙여 적음."
    }
  },
  {
    "id": "s32-fin-o2-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 14,
      "page": 4,
      "sourceId": "sci-32-fin-set2",
      "edition": "시매쓰DMC 기말평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "소리의 높낮이",
      "concept": "소리의 높낮이는 소리의 높고 낮은 정도로, 물체가 빠르게 떨리면 높은 소리가 난다."
    },
    "prompt": "소리의 높낮이에 대한 설명으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "소리의 높고 낮은 정도입니다.",
      "소리의 크고 작은 정도입니다.",
      "물체가 느리게 떨리면 높은 소리가 납니다.",
      "화재경보기는 주로 낮은 소리를 이용합니다.",
      "우쿨렐레는 높낮이가 다른 소리를 내며 연주할 수 있습니다."
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
        4
      ]
    },
    "explanation": "소리의 크고 작은 정도를 소리의 세기라고 하며, 소리의 세기는 물체가 떨리는 정도에 따라 달라집니다.\n소리의 높고 낮은 정도를 소리의 높낮이라고 하며, 소리의 높낮이는 물체가 떨리는 빠르기에 따라 달라집니다. 물체가 빠르게 떨리면 높은 소리가 나고, 물체가 느리게 떨리면 낮은 소리가 납니다. 화재경보기는 위험을 알리기 위해 높은 소리를 이용합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "줄바꿈으로 나뉜 보기 문장은 이어 붙여 적음."
    }
  },
  {
    "id": "s32-fin-o2-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 15,
      "page": 4,
      "sourceId": "sci-32-fin-set2",
      "edition": "시매쓰DMC 기말평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "팬 플루트와 소리의 높낮이",
      "concept": "팬 플루트는 관의 길이로 높낮이가, 부는 세기로 소리의 세기가 달라진다."
    },
    "prompt": "팬 플루트에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "입으로 불어서 소리를 내는 악기입니다.",
      "길이가 긴 관을 불면 낮은 소리가 납니다.",
      "길이가 짧은 관을 불면 높은 소리가 납니다.",
      "관의 길이에 따라 소리의 높낮이가 달라집니다.",
      "관을 부는 세기에 따라 소리의 높낮이가 달라집니다."
    ],
    "figure": "assets/bank/s32-fin/s2-q15.webp",
    "figureNote": "길이가 차례로 다른 관을 나란히 묶은 분홍색 팬 플루트 그림",
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
    "explanation": "팬 플루트는 관을 부는 세기에 따라 세기가 다른 소리가 나고, 부는 관의 길이에 따라 높낮이가 다른 소리가 나는 악기입니다.",
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
    "id": "s32-fin-o2-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 16,
      "page": 4,
      "sourceId": "sci-32-fin-set2",
      "edition": "시매쓰DMC 기말평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "소리의 전달",
      "concept": "소리는 고체·액체·기체를 통해 전달되며, 공기가 없는 우주에서는 전달되지 않는다."
    },
    "prompt": "소리의 전달에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "소리는 기체에서만 전달됩니다.",
      "소리는 고체에서만 전달됩니다.",
      "물속에서는 소리가 전달되지 않습니다.",
      "우주에서는 공기가 없어도 소리가 전달됩니다.",
      "운동장에서 친구가 부르는 소리는 공기를 통해 전달됩니다."
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
    "explanation": "소리는 고체, 액체, 기체 상태의 여러 가지 물질을 통해 전달됩니다. 우주에서는 공기가 없어 소리가 전달되지 않습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "줄바꿈으로 나뉜 보기 문장은 이어 붙여 적음."
    }
  },
  {
    "id": "s32-fin-o2-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 17,
      "page": 4,
      "sourceId": "sci-32-fin-set2",
      "edition": "시매쓰DMC 기말평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "고체를 통한 소리 전달",
      "concept": "철봉에 귀를 대고 두드리는 소리를 듣는 것은 고체를 통해 소리가 전달되는 예이다."
    },
    "prompt": "고체를 통해 소리가 전달되는 경우를 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 멀리서 친구가 부를 때",
        "ㄴ. 물속에서 잠수부가 소리를 들을 때",
        "ㄷ. 수중 발레 선수가 물속에서 음악을 들을 때",
        "ㄹ. 철봉에 귀를 대고 철봉을 두드리는 소리를 들을 때"
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
      "answer": "ㄹ",
      "accepted": [
        "ㄹ",
        "철봉에 귀를 대고 철봉을 두드리는 소리를 들을 때"
      ]
    },
    "explanation": "철봉에 귀를 대고 철봉을 두드리는 소리를 듣는 것은 고체인 철봉을 통해 소리가 전달되는 예입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기 ㄹ의 줄바꿈은 이어 붙여 적음."
    }
  },
  {
    "id": "s32-fin-o2-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 18,
      "page": 5,
      "sourceId": "sci-32-fin-set2",
      "edition": "시매쓰DMC 기말평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "실 전화기로 소리 전달",
      "concept": "실 전화기는 실을 팽팽하게 하고 짧고 굵은 실을 쓸수록 소리가 잘 전달된다."
    },
    "prompt": "실 전화기의 소리가 더 잘 들리게 하는 방법으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 실을 팽팽하게 당깁니다.",
        "ㄴ. 실의 길이를 길게 합니다.",
        "ㄷ. 실 전화기의 실을 얇은 실로 교체합니다."
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
      "answer": "ㄱ",
      "accepted": [
        "ㄱ",
        "실을 팽팽하게 당깁니다."
      ]
    },
    "explanation": "실 전화기 실의 길이가 길 때보다 짧을 때 소리가 더 잘 전달되며, 실의 굵기가 굵을수록 소리가 잘 전달됩니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "해설은 실의 길이와 굵기만 설명하고 정답 ㄱ(팽팽하게 당김)에 대한 직접 설명은 없음."
    }
  },
  {
    "id": "s32-fin-o2-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 19,
      "page": 5,
      "sourceId": "sci-32-fin-set2",
      "edition": "시매쓰DMC 기말평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "소리의 반사",
      "concept": "메아리·울림·반사판은 소리의 반사와 관련 있고, 소음 방지 매트는 소리 전달을 줄이는 방법이다."
    },
    "prompt": "소리의 반사와 관련이 가장 적은 것을 고르세요.",
    "givens": null,
    "choices": [
      "목욕탕에서 소리를 내면 소리가 울립니다.",
      "산에서 소리를 내면 잠시 뒤에 메아리가 들립니다.",
      "텅 빈 체육관에서 손뼉을 치면 잠시 뒤에 그 소리가 다시 들립니다.",
      "바닥에 소음 방지 매트를 깔아 걷거나 뛰어 발생하는 소음을 줄입니다.",
      "공연장 안에 반사판을 설치하여 공연장 전체에 소리를 골고루 전달합니다."
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
    "explanation": "바닥에 소음 방지 매트를 깔면 소리가 잘 전달되지 않아 소음을 줄일 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '적은'에 밑줄. 줄바꿈으로 나뉜 보기 문장은 이어 붙여 적음."
    }
  },
  {
    "id": "s32-fin-o2-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 20,
      "page": 5,
      "sourceId": "sci-32-fin-set2",
      "edition": "시매쓰DMC 기말평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅶ. 기말평가"
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
      "track": "교과",
      "topic": "소음을 줄이는 방법",
      "concept": "방음벽 설치, 과속 방지 턱 설치, 경적 자제는 모두 도로 소음을 줄이는 방법이다."
    },
    "prompt": "도로에서 자동차에 의해 발생하는 소음을 줄이는 방법으로 옳은 것을 <보기>에서 모두 골라 짝 지은 것은?",
    "givens": {
      "보기": [
        "ㄱ. 도로에 방음벽을 설치합니다.",
        "ㄴ. 도로에 과속 방지 턱을 설치합니다.",
        "ㄷ. 자동차의 경적을 가급적 울리지 않습니다."
      ]
    },
    "choices": [
      "ㄱ",
      "ㄴ",
      "ㄱ, ㄴ",
      "ㄴ, ㄷ",
      "ㄱ, ㄴ, ㄷ"
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
    "explanation": "도로에 방음벽을 설치하면 도로에서 생기는 소음을 도로 쪽으로 반사시킵니다. 과속 방지 턱을 설치하면 자동차가 천천히 달려 소음이 줄어듭니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "해설은 ㄱ, ㄴ만 설명하고 ㄷ(경적 자제)에 대한 설명은 없음."
    }
  }
];
