// 4-1 Ⅰ 자석의 이용 — 단원평가 원문 80문항(시매쓰DMC 최다빈출 단원평가 세트1·2·3·4). 시험지를 그대로 옮기고 정답 및 풀이와 대조했다.
// 원장 지시(2026-10-09): 원문을 그대로 문제은행에 쓴다(전에는 Supabase에만 있었음). 그림은 시험지에서 잘라 낸 것(assets/bank/s41-u01/).
export const source = [
  {
    "id": "s41-u01-o1-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 1,
      "page": 1,
      "sourceId": "sci-41-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "자석에 붙는 물체 고르기",
      "concept": "자석에는 철로 만든 물체만 붙고 종이·나무·고무·유리로 만든 물체는 붙지 않는다."
    },
    "prompt": "자석을 가까이 했을 때 자석에 붙는 물체는 어느 것입니까?",
    "givens": null,
    "choices": [
      "종이컵",
      "철 집게",
      "나무토막",
      "고무풍선",
      "유리구슬"
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
    "explanation": "철로 만든 물체는 붙고, 종이, 나무, 고무, 유리로 만든 물체는 자석에 붙지 않습니다.\n[자료 검토] 문항에 제시한 재료·시료의 비교입니다. 모든 금속이 붙는다는 뜻이 아니며 실제 시료를 확인합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o1-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 2,
      "page": 1,
      "sourceId": "sci-41-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "여러 물질로 된 물체(가위)와 자석",
      "concept": "여러 물질로 만든 물체는 철로 된 부분만 자석에 붙고 플라스틱 같은 다른 물질 부분은 붙지 않는다."
    },
    "prompt": "다음은 여러 가지 물질로 만들어진 가위의 모습입니다. <보기>에서 이에 대한 알맞은 설명을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 플라스틱으로 만들어진 날 부분은 자석에 붙는다.",
        "㉡ 철로 만들어진 손잡이 부분은 자석에 붙지 않는다.",
        "㉢ 여러 가지 물질로 만들어진 물체는 자석에 붙는 부분도 있고, 붙지 않는 부분도 있다."
      ]
    },
    "choices": [
      "㉠",
      "㉢",
      "㉠, ㉡",
      "㉡, ㉢",
      "㉠, ㉡, ㉢"
    ],
    "figure": "assets/bank/s41-u01/s1-q02.webp",
    "figureNote": "주황색 플라스틱 손잡이와 금속 날로 된 가위 사진.",
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
    "explanation": "가위에서 철로 만들어진 날 부분은 자석에 붙지만, 플라스틱으로 만들어진 손잡이 부분은 자석에 붙지 않습니다. 여러 가지 물질로 만들어진 물체는 철로 만들어진 부분만 자석에 붙습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기> ㉠은 '플라스틱으로 만들어진 날 부분', ㉡은 '철로 만들어진 손잡이 부분'으로 재료를 바꿔 쓴 오답 진술이며 인쇄 그대로 옮김."
    }
  },
  {
    "id": "s41-u01-o1-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 3,
      "page": 1,
      "sourceId": "sci-41-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "자석에 붙는 물체 분류 오류 찾기",
      "concept": "알루미늄으로 만든 물체는 금속이어도 자석에 붙지 않는다."
    },
    "prompt": "다음은 자석에 붙는 물체와 자석에 붙지 않는 물체를 분류한 것입니다. 잘못 분류한 물체의 이름을 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s41-u01/s1-q03.webp",
    "figureNote": "두 칸 분류표: '자석에 붙는 물체' 칸에 철자, 용수철, 알루미늄 캔 / '자석에 붙지 않는 물체' 칸에 지우개, 색종이, 플라스틱 컵.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "알루미늄 캔",
      "accepted": [
        "알루미늄 캔",
        "알루미늄캔"
      ]
    },
    "explanation": "철로 만든 물체는 자석에 붙고, 알루미늄, 고무, 종이, 플라스틱으로 만든 물체는 자석에 붙지 않습니다.\n[자료 검토] 문항에 제시한 재료·시료의 비교입니다. 모든 금속이 붙는다는 뜻이 아니며 실제 시료를 확인합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'잘못'에 밑줄. 표 오른쪽 칸은 '지우개, 색종이' 다음 줄바꿈 후 '플라스틱 컵'(쉼표 없이 인쇄)."
    }
  },
  {
    "id": "s41-u01-o1-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 4,
      "page": 1,
      "sourceId": "sci-41-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "철 클립에 자석을 가까이 했을 때",
      "concept": "자석을 철로 된 물체에 가까이 하면 물체가 자석 쪽으로 끌려와 붙는다."
    },
    "prompt": "(가) 과정의 결과로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "[04~06] 다음 실험 과정을 보고, 물음에 답하시오.\n<과정>\n(가) 책상 위에 놓인 철 클립에 막대자석을 가까이 하면서 철 클립의 움직임을 관찰해 봅니다.\n(나) 막대자석에 플라스틱판을 댄 다음 철 클립에 가까이 하면서 철 클립의 움직임을 관찰해 봅니다.\n(다) 막대자석에 종이판을 댄 다음 철 클립에 가까이 하면서 철 클립의 움직임을 관찰해 봅니다."
    },
    "choices": [
      "아무 변화도 없다.",
      "철 클립이 좌우로 움직인다.",
      "철 클립이 상하로 움직인다.",
      "철 클립이 막대자석 반대편으로 밀려난다.",
      "철 클립이 막대자석 쪽으로 끌려와 자석에 붙는다."
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
    "explanation": "막대자석을 철 클립에 가까이하면 철 클립이 막대자석 쪽으로 끌어당겨져 붙습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o1-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 5,
      "page": 1,
      "sourceId": "sci-41-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "얇은 판을 사이에 둔 자석의 힘",
      "concept": "자석과 철 클립 사이에 플라스틱판이나 종이판이 있어도 자석은 철 클립을 끌어당긴다."
    },
    "prompt": "다음 <보기>에서 (나), (다) 과정의 결과로 알맞은 것을 골라 기호를 쓰시오.",
    "givens": {
      "지문": "[04~06] 다음 실험 과정을 보고, 물음에 답하시오.\n<과정>\n(가) 책상 위에 놓인 철 클립에 막대자석을 가까이 하면서 철 클립의 움직임을 관찰해 봅니다.\n(나) 막대자석에 플라스틱판을 댄 다음 철 클립에 가까이 하면서 철 클립의 움직임을 관찰해 봅니다.\n(다) 막대자석에 종이판을 댄 다음 철 클립에 가까이 하면서 철 클립의 움직임을 관찰해 봅니다.",
      "보기": [
        "㉠ (나)와 (다) 모두 철 클립이 막대자석에 붙는다.",
        "㉡ (나)에서 철 클립이 막대자석에 붙지만, (다)에서 철 클립이 막대자석에 붙지 않는다.",
        "㉢ (다)에서 철 클립이 막대자석에 붙지만, (나)에서 철 클립이 막대자석에 붙지 않는다."
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
      "answer": "㉠",
      "accepted": [
        "㉠",
        "ㄱ"
      ]
    },
    "explanation": "막대자석에 플라스틱판 또는 종이판을 댄 다음 철 클립에 가까이 하면 플라스틱판 또는 종이판이 있어도 철 클립이 막대자석에 붙습니다.\n[자료 검토] 가까운 거리와 얇은 사이 판의 교구 조건입니다. 두께·거리·고정 조건을 달리해도 반드시 붙는다는 뜻은 아닙니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o1-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 6,
      "page": 1,
      "sourceId": "sci-41-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "떨어져 있어도 작용하는 자석의 힘",
      "concept": "자석과 철로 된 물체는 약간 떨어져 있어도 서로 끌어당기는 힘이 작용한다."
    },
    "prompt": "다음은 위 실험을 통해 알 수 있는 내용입니다. ㉠, ㉡에 들어갈 알맞은 말을 골라 쓰시오.",
    "givens": {
      "지문": "[04~06] 다음 실험 과정을 보고, 물음에 답하시오.\n<과정>\n(가) 책상 위에 놓인 철 클립에 막대자석을 가까이 하면서 철 클립의 움직임을 관찰해 봅니다.\n(나) 막대자석에 플라스틱판을 댄 다음 철 클립에 가까이 하면서 철 클립의 움직임을 관찰해 봅니다.\n(다) 막대자석에 종이판을 댄 다음 철 클립에 가까이 하면서 철 클립의 움직임을 관찰해 봅니다.\n\n자석과 자석에 붙는 물체는 ㉠ ( 멀리, 약간 ) 떨어져 있어도 서로 ㉡ ( 끌어당기는, 밀어 내는 ) 힘이 작용한다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 약간, ㉡ 끌어당기는",
      "accepted": [
        "㉠ 약간, ㉡ 끌어당기는",
        "약간, 끌어당기는",
        "약간 끌어당기는"
      ]
    },
    "explanation": "자석과 자석에 붙는 물체 사이에는 서로 끌어당기는 힘이 작용하는데, 자석과 자석에 붙는 물체 사이가 약간 떨어져 있어도 서로 끌어당깁니다.\n[자료 검토] 가까운 거리와 얇은 사이 판의 교구 조건입니다. 두께·거리·고정 조건을 달리해도 반드시 붙는다는 뜻은 아닙니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란은 '㉠ (        ), ㉡ (        )'. 해설은 정답지 1쪽 왼쪽 단 끝에서 오른쪽 단 위로 이어짐."
    }
  },
  {
    "id": "s41-u01-o1-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 7,
      "page": 2,
      "sourceId": "sci-41-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "막대자석에 빵 끈이 많이 붙는 곳",
      "concept": "막대자석에서 철로 된 물체가 가장 많이 붙는 곳은 양쪽 끝부분(극)이다."
    },
    "prompt": "다음과 같이 빵 끈 조각이 든 종이 그릇에 막대자석을 넣었다가 천천히 들어 올렸습니다. 이에 대한 설명으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "빵 끈 조각이 막대자석 전체에 골고루 붙는다.",
      "빵 끈 조각이 막대자석의 빨간색 부분에만 붙는다.",
      "빵 끈 조각이 막대자석의 파란색 부분에만 붙는다.",
      "빵 끈 조각이 막대자석 양쪽 끝부분에 많이 붙는다.",
      "빵 끈 조각이 막대자석 가운데 부분에 많이 붙는다."
    ],
    "figure": "assets/bank/s41-u01/s1-q07.webp",
    "figureNote": "손으로 S(파란색)·N(빨간색) 막대자석을 빵 끈 조각이 가득 든 종이 그릇에 넣고 있는 그림.",
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
    "explanation": "빵 끈 조각이 든 종이 그릇에 막대자석을 넣었다가 천천히 들어 올리면 빵 끈 조각이 막대자석의 양쪽 끝부분에 많이 붙습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o1-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 8,
      "page": 2,
      "sourceId": "sci-41-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "자석의 극 뜻",
      "concept": "자석에서 철로 만든 물체가 가장 많이 붙는 부분을 극이라고 한다."
    },
    "prompt": "다음 빈칸에 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "자석에서 철로 만든 물체가 가장 많이 붙는 부분을 자석의 □(이)라고 합니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "극",
      "accepted": [
        "극",
        "자석의 극"
      ]
    },
    "explanation": "자석에서 철로 만든 물체가 가장 많이 붙는 부분을 자석의 극이라고 합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "빈칸은 인쇄본에서 네모 칸으로 표시됨(□로 옮김)."
    }
  },
  {
    "id": "s41-u01-o1-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 9,
      "page": 2,
      "sourceId": "sci-41-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "자석의 극의 개수와 위치",
      "concept": "자석의 극은 모양과 관계없이 항상 두 개이고, 막대자석은 크기와 상관없이 양쪽 끝이 극이다."
    },
    "prompt": "다음 <보기>에서 자석의 극에 대한 알맞은 설명을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 막대자석의 극은 두 군데이다.",
        "㉡ 자석의 모양에 따라 극의 개수는 달라진다.",
        "㉢ 같은 막대자석이라도 크기가 다르면 극의 위치가 다르다."
      ]
    },
    "choices": [
      "㉠",
      "㉡",
      "㉠, ㉡",
      "㉠, ㉢",
      "㉡, ㉢"
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
    "explanation": "자석의 극은 모양이 다르더라도 항상 두 군데입니다. 막대자석은 크기에 상관없이 극의 위치가 양쪽 끝부분으로 동일합니다.\n[자료 검토] 그림의 N/S 두 극 교구를 대상으로 한 설명입니다. 모양·색만으로 모든 제품의 극 배치를 판단하지 않습니다. 자석을 실제로 자르거나 깨뜨리는 활동은 하지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o1-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 10,
      "page": 2,
      "sourceId": "sci-41-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "같은 극·다른 극 사이의 힘",
      "concept": "자석의 같은 극끼리는 서로 밀어 내고, 다른 극끼리는 서로 끌어당긴다."
    },
    "prompt": "다음 <보기>에서 두 자석의 극을 가까이 했을 때 작용하는 힘으로 알맞은 것을 골라 기호를 쓰시오.\n(1) N극과 S극을 가까이 했을 때\n(2) N극과 N극을 가까이 했을 때\n(3) S극과 S극을 가까이 했을 때",
    "givens": {
      "보기": [
        "㉠ 서로 밀어 내는 힘",
        "㉡ 서로 끌어당기는 힘"
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
      "answer": "(1) ㉡ (2) ㉠ (3) ㉠",
      "accepted": [
        "(1) ㉡ (2) ㉠ (3) ㉠",
        "㉡, ㉠, ㉠",
        "ㄴ, ㄱ, ㄱ"
      ]
    },
    "explanation": "두 자석의 극 사이에는 서로 밀어 내거나 끌어당기는 힘이 작용합니다. 자석의 같은 극끼리 가까이 하면 서로 밀어 내는 힘이 작용하고, 자석의 다른 극끼리 가까이 하면 서로 끌어당기는 힘이 작용합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "소문항 (1)~(3) 각각 답란 ( )이 있음."
    }
  },
  {
    "id": "s41-u01-o1-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 11,
      "page": 2,
      "sourceId": "sci-41-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "고리 자석 탑과 자석의 성질",
      "concept": "고리 자석을 같은 극끼리 마주 보게 끼우면 서로 밀어 내어 떠 있으므로 탑이 가장 높아진다."
    },
    "prompt": "다음은 고리 자석으로 쌓은 가장 높은 탑의 모습입니다. <보기>에서 탑을 쌓을 때 이용한 자석의 성질로 알맞은 것을 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 같은 극끼리 서로 밀어 내는 성질",
        "㉡ 다른 극끼리 서로 밀어 내는 성질",
        "㉢ 같은 극끼리 서로 끌어당기는 성질",
        "㉣ 다른 극끼리 서로 끌어당기는 성질"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s41-u01/s1-q11.webp",
    "figureNote": "막대 받침에 끼운 고리 자석 5개(주황·빨강·초록·노랑·파랑)가 서로 떨어진 채 위로 쌓여 있는 그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠",
      "accepted": [
        "㉠",
        "ㄱ"
      ]
    },
    "explanation": "고리 자석을 서로 같은 극끼리 마주 보게 쌓으면 고리 자석 사이에 서로 밀어 내는 힘이 작용하기 때문에 가장 높은 탑을 쌓을 수 있습니다.\n[자료 검토] 같은 고리·개수·받침을 쓰고 비자성 막대가 옆 움직임을 제한하는 탑입니다. 떠 있는 고리만 보고 가이드 없는 안정한 공중 부양을 주장하지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o1-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 12,
      "page": 3,
      "sourceId": "sci-41-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "밀어 내는 힘으로 극 알아내기",
      "concept": "두 자석이 서로 밀어 내면 마주 보는 면은 같은 극이다."
    },
    "prompt": "다음과 같이 고리 자석의 윗면에 막대자석의 S극을 가까이 했더니 막대자석과 고리 자석이 서로 밀어 냈습니다. 고리 자석의 윗면은 무슨 극인지 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s41-u01/s1-q12.webp",
    "figureNote": "S극(파란색)이 아래로 향한 막대자석이 탁자 위 고리 자석 윗면 위에 떨어져 있는 그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "S극",
      "accepted": [
        "S극",
        "S",
        "s극",
        "에스극"
      ]
    },
    "explanation": "자석은 같은 극끼리 서로 밀어 내고, 다른 극끼리 서로 끌어당깁니다. 고리 자석의 윗면과 막대자석의 S극이 서로 밀어 낸 것을 통해 고리 자석의 윗면은 막대자석의 S극과 같은 극이라는 것을 알 수 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란은 '(        )극' — 극이 인쇄되어 있어 'S'만 써도 됨."
    }
  },
  {
    "id": "s41-u01-o1-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 13,
      "page": 3,
      "sourceId": "sci-41-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물에 띄운 막대자석이 가리키는 방향",
      "concept": "자유롭게 움직일 수 있는 자석은 멈추면 두 극이 북쪽과 남쪽을 가리킨다."
    },
    "prompt": "막대자석의 움직임이 멈추었을 때 막대자석의 극이 가리키는 방향으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "[13~14] 다음과 같이 물이 담긴 수조에 막대자석을 올려놓은 접시를 띄웠습니다. 물음에 답하시오."
    },
    "choices": [
      "동쪽과 서쪽",
      "동쪽과 남쪽",
      "서쪽과 북쪽",
      "남쪽과 서쪽",
      "북쪽과 남쪽"
    ],
    "figure": "assets/bank/s41-u01/s1-q13.webp",
    "figureNote": "물 위에 띄운 접시 위 막대자석(빨간색 N, 파란색 S)이 비스듬히 놓인 그림. 둘레에 북·남·서·동 방위 표시.",
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
    "explanation": "물에 띄워 움직임이 멈춘 자석의 두 극은 항상 북쪽과 남쪽을 가리킵니다.\n[자료 검토] 다른 자석·쇠붙이를 멀리하고 수평으로 자유롭게 돌아 멈추는 조건입니다. 기울어진 그림은 실제 멈춘 방향의 측정값으로 쓰지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o1-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 14,
      "page": 3,
      "sourceId": "sci-41-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "N극·S극의 뜻",
      "concept": "자석에서 북쪽을 가리키는 극이 N극, 남쪽을 가리키는 극이 S극이다."
    },
    "prompt": "다음은 위 실험을 통해 알 수 있는 내용입니다. ㉠, ㉡에 들어갈 알맞은 말을 골라 쓰시오.",
    "givens": {
      "지문": "[13~14] 다음과 같이 물이 담긴 수조에 막대자석을 올려놓은 접시를 띄웠습니다. 물음에 답하시오.\n\n자석에서 ㉠ ( 동, 서, 남, 북 )쪽을 가리키는 극을 N극이라고 하고, ㉡ ( 동, 서, 남, 북 )쪽을 가리키는 극을 S극이라고 합니다."
    },
    "choices": null,
    "figure": "assets/bank/s41-u01/s1-q13.webp",
    "figureNote": "물 위에 띄운 접시 위 막대자석(빨간색 N, 파란색 S)이 비스듬히 놓인 그림. 둘레에 북·남·서·동 방위 표시.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 북, ㉡ 남",
      "accepted": [
        "㉠ 북, ㉡ 남",
        "북, 남",
        "북 남",
        "북쪽, 남쪽"
      ]
    },
    "explanation": "물에 띄운 자석의 두 극은 각각 북쪽과 남쪽을 가리킵니다. 북쪽을 가리키는 자석의 극을 N극이라고 하고, 남쪽을 가리키는 자석의 극을 S극이라고 합니다.\n[자료 검토] 다른 자석·쇠붙이를 멀리하고 수평으로 자유롭게 돌아 멈추는 조건입니다. 기울어진 그림은 실제 멈춘 방향의 측정값으로 쓰지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란은 '㉠ (      ), ㉡ (      )'."
    }
  },
  {
    "id": "s41-u01-o1-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 15,
      "page": 3,
      "sourceId": "sci-41-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "나침반의 특징",
      "concept": "나침반 바늘은 자석이어서 항상 북쪽과 남쪽을 가리키므로 방향을 찾는 데 쓴다."
    },
    "prompt": "다음 <보기>에서 나침반에 대한 알맞은 설명을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 나침반은 일정한 방향을 가리킨다.",
        "㉡ 나침반 바늘은 알루미늄으로 되어 있다.",
        "㉢ 나침반 바늘은 항상 북쪽과 남쪽을 가리킨다."
      ]
    },
    "choices": [
      "㉠",
      "㉢",
      "㉠, ㉡",
      "㉠, ㉢",
      "㉡, ㉢"
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
    "explanation": "나침반은 자석이 항상 북쪽과 남쪽을 가리키는 성질을 이용하여 방향을 찾을 수 있도록 만든 도구입니다. 나침반 바늘은 자석으로 되어 있어 항상 북쪽과 남쪽을 가리킵니다.\n[자료 검토] 다른 자석·쇠붙이를 멀리하고 수평으로 자유롭게 돌아 멈추는 조건입니다. 기울어진 그림은 실제 멈춘 방향의 측정값으로 쓰지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o1-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 16,
      "page": 3,
      "sourceId": "sci-41-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "자석을 가까이 했을 때 나침반 바늘",
      "concept": "나침반 바늘의 N극은 가까이 온 자석의 S극에 끌려 그쪽을 가리킨다."
    },
    "prompt": "위 실험의 결과로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "[16~17] 다음과 같이 막대자석의 S극을 나침반에 가까이 하면서 나침반 바늘의 움직임을 관찰하였습니다. 물음에 답하시오."
    },
    "choices": [
      "아무런 움직임이 나타나지 않는다.",
      "나침반 바늘이 좌우로 계속 움직인다.",
      "나침반 바늘이 위아래로 계속 움직인다.",
      "나침반 바늘이 움직여 바늘의 파란색 부분이 서쪽을 가리킨다.",
      "나침반 바늘이 움직여 바늘의 빨간색 부분이 남쪽을 가리킨다."
    ],
    "figure": "assets/bank/s41-u01/s1-q16.webp",
    "figureNote": "나침반(빨간 바늘 끝이 북쪽, 파란 끝이 남쪽을 가리킴) 오른쪽(동쪽)에 막대자석이 S극을 나침반 쪽으로 향하게 놓이고, 초록 화살표가 나침반 쪽을 가리킴.",
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
    "explanation": "나침반 바늘은 자석으로 되어 있으며, 빨간색 부분은 N극, 파란색 부분은 S극을 나타냅니다. 막대자석의 S극을 가까이 하면 다른 극끼리 서로 끌어당겨져 나침반의 빨간색 부분이 막대자석의 S극을 가리킵니다. 이때 각 바늘의 방향은 파란색 부분이 서쪽, 빨간색 부분이 동쪽을 가리킵니다.\n[자료 검토] 가까운 막대자석의 영향이 큰 설명 그림으로 해석합니다. 실제 바늘 각도는 주변 조건을 확인해 관찰하며 인쇄 방위 글자의 회전과 구별합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "그림에서 막대자석은 나침반의 동쪽(오른쪽)에 놓여 있음(나침반 눈금의 방위 글자는 회전되어 인쇄)."
    }
  },
  {
    "id": "s41-u01-o1-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 17,
      "page": 3,
      "sourceId": "sci-41-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T12",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "나침반 바늘 방향을 반대로 바꾸는 방법",
      "concept": "가까이 하는 자석의 극을 바꾸거나 자석을 반대쪽에서 가까이 하면 나침반 바늘이 가리키는 방향이 반대로 바뀐다."
    },
    "prompt": "위 실험 결과에서 나침반 바늘이 가리키는 방향을 반대로 바꾸려면 어떻게 해야 하는지 쓰시오.",
    "givens": {
      "지문": "[16~17] 다음과 같이 막대자석의 S극을 나침반에 가까이 하면서 나침반 바늘의 움직임을 관찰하였습니다. 물음에 답하시오."
    },
    "choices": null,
    "figure": "assets/bank/s41-u01/s1-q16.webp",
    "figureNote": "나침반(빨간 바늘 끝이 북쪽, 파란 끝이 남쪽을 가리킴) 오른쪽(동쪽)에 막대자석이 S극을 나침반 쪽으로 향하게 놓이고, 초록 화살표가 나침반 쪽을 가리킴.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "예) 가까이 가져가는 막대자석의 극을 바꾼다. / 막대자석의 S극을 나침반의 반대 방향에 가까이 가져간다. 등",
      "rubric": {
        "required": [
          "가까이 하는 극이나 자석을 가져가는 방향을 바꾼다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "자석의 극을 바꾸거나 자석을 가까이 하는 방향을 바꾼다는 내용이 포함되어 있으면 정답으로 합니다."
        ]
      }
    },
    "explanation": "위 실험 결과 나침반 바늘의 N극(빨간색)은 동쪽, S극(파란색)은 서쪽을 가리킵니다. 막대자석의 S극 대신 N극을 가져가면 나침반 바늘의 N극은 밀어 내고, S극은 끌어당기기 때문에 바늘이 가리키는 방향이 반대가 됩니다. 또한 막대자석의 S극을 나침반의 서쪽 방향으로 가까이 하면 바늘이 가리키는 방향이 반대가 됩니다.\n[채점 기준] 자석의 극을 바꾸거나 자석을 가까이 하는 방향을 바꾼다는 내용이 포함되어 있으면 정답으로 합니다.\n[자료 검토] 가까운 막대자석의 영향이 큰 설명 그림으로 해석합니다. 실제 바늘 각도는 주변 조건을 확인해 관찰하며 인쇄 방위 글자의 회전과 구별합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준 표에 비율(%)이 인쇄되어 있지 않음 — 단일 기준이라 100%로 둠."
    }
  },
  {
    "id": "s41-u01-o1-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 18,
      "page": 4,
      "sourceId": "sci-41-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "막대자석 주위 나침반 바늘의 방향",
      "concept": "막대자석 N극 쪽에 놓은 나침반은 바늘의 S극이 자석의 N극을 향한다."
    },
    "prompt": "다음은 막대자석 주위에 나침반을 놓은 모습입니다. <보기>에서 (가) 나침반 바늘의 모습으로 알맞은 것을 골라 기호를 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s41-u01/s1-q18.webp",
    "figureNote": "가운데 막대자석(왼쪽 N 빨강, 오른쪽 S 파랑) 둘레에 나침반 6개. 왼쪽 N극 옆 나침반이 (가)로 바늘이 비어 있음. <보기>에 ㉠·㉡ 나침반 그림 두 개(바늘 방향이 서로 반대).",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠",
      "accepted": [
        "㉠",
        "ㄱ"
      ]
    },
    "explanation": "막대자석의 N극 쪽에 나침반을 놓으면 나침반 바늘의 S극(파란색)이 막대자석의 N극 쪽을 가리킵니다.\n[자료 검토] 가까운 막대자석의 영향이 큰 설명 그림으로 해석합니다. 실제 바늘 각도는 주변 조건을 확인해 관찰하며 인쇄 방위 글자의 회전과 구별합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>는 그림 선택지라 바늘 방향을 말로 풀어 givens에 적음(인쇄 문구 아님). 발문 '<' 뒤 줄바꿈 '보기>'는 '<보기>'로 이음."
    }
  },
  {
    "id": "s41-u01-o1-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 19,
      "page": 4,
      "sourceId": "sci-41-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "생활 속 자석 이용 예",
      "concept": "냉장고 문·자석 다트·자석 필통·자석 방충망은 자석을 이용하지만 셀로판테이프는 자석을 쓰지 않는다."
    },
    "prompt": "우리 생활에서 자석을 이용하는 예가 아닌 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "냉장고 문",
      "자석 다트",
      "자석 필통",
      "자석 방충망",
      "셀로판테이프"
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
    "explanation": "냉장고 문 쪽의 자석이 철로 된 냉장고 문을 끌어당겨 냉장고 문을 쉽게 닫을 수 있습니다. 자석 다트는 끝에 자석을 붙인 다트를 철로 만든 다트판에 던져 사용합니다. 자석 필통은 필통의 입구에 자석이 있어 필통을 쉽게 열고 닫을 수 있습니다. 자석 방충망은 방충망 입구에 자석이 있어 방충망 입구를 쉽게 열고 닫을 수 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'아닌'에 밑줄."
    }
  },
  {
    "id": "s41-u01-o1-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 20,
      "page": 4,
      "sourceId": "sci-41-1-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "자석 클립 통에 이용한 성질",
      "concept": "자석 클립 통은 입구의 자석이 철 클립을 끌어당기는 성질을 이용한다."
    },
    "prompt": "다음은 자석을 이용해 만든 자석 클립 통의 모습입니다. <보기>에서 자석 클립 통에 이용한 자석의 성질을 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 철로 만든 물체를 끌어당기는 성질",
        "㉡ 자석의 같은 극끼리 서로 밀어 내는 성질",
        "㉢ 자석의 다른 극끼리 서로 끌어당기는 성질"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s41-u01/s1-q20.webp",
    "figureNote": "투명한 통 안에 여러 색 클립이 들어 있고 입구 부분에 클립 몇 개가 붙어 있는 자석 클립 통 그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠",
      "accepted": [
        "㉠",
        "ㄱ"
      ]
    },
    "explanation": "자석 클립 통은 자석이 철로 만든 물체를 끌어당기는 성질을 이용한 예입니다. 클립 통의 입구에 자석이 있으며, 클립 통에 들어 있는 철 클립이 통의 입구 부분에 붙어 철 클립을 쉽게 꺼낼 수 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o2-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 1,
      "page": 1,
      "sourceId": "sci-41-1-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "자석에 붙는 물체의 공통점",
      "concept": "자석에 붙는 물체는 모두 철로 만들어져 있고, 종이·나무·플라스틱으로 만든 물체는 자석에 붙지 않는다."
    },
    "prompt": "다음 <보기>에서 자석에 붙는 물체의 공통점으로 알맞은 것을 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 철로 만들어졌다.",
        "㉡ 종이로 만들어졌다.",
        "㉢ 나무로 만들어졌다.",
        "㉣ 플라스틱으로 만들어졌다."
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
      "answer": "㉠",
      "accepted": [
        "㉠",
        "ㄱ",
        "철로 만들어졌다."
      ]
    },
    "explanation": "철로 만든 물체는 자석에 붙고, 종이, 나무, 플라스틱으로 만든 물체는 자석에 붙지 않습니다.\n[자료 검토] 문항에 제시한 재료·시료의 비교입니다. 모든 금속이 붙는다는 뜻이 아니며 실제 시료를 확인합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o2-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 2,
      "page": 1,
      "sourceId": "sci-41-1-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "자석에 붙는 물체와 붙지 않는 물체 분류",
      "concept": "철로 만든 물체는 자석에 붙고, 지우개·유리·종이·알루미늄·고무로 만든 물체는 자석에 붙지 않는다."
    },
    "prompt": "다음 ㉠, ㉡에 들어갈 물체를 알맞게 짝 지은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "철자 / 용수철",
      "철 클립 / 지우개",
      "유리구슬 / 종이컵",
      "철 머리핀 / 철 집게",
      "알루미늄 캔 / 고무풍선"
    ],
    "figure": "assets/bank/s41-u01/s2-q02.webp",
    "figureNote": "두 칸짜리 표: 머리글 「자석에 붙는 물체」「자석에 붙지 않는 물체」, 아래 칸에 각각 ㉠, ㉡.",
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
    "explanation": "철자, 용수철, 철 클립, 철 머리핀, 철 집게는 철로 만든 물체이므로 자석에 붙고, 지우개, 유리구슬, 종이컵, 알루미늄 캔, 고무풍선은 자석에 붙지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기가 표 형태로 인쇄됨: 열 머리글은 ㉠ / ㉡. 표 머리글 「자석에 붙지 않는 물체」는 「자석에」와 「붙지 않는 물체」로 두 줄로 줄바꿈되어 인쇄됨."
    }
  },
  {
    "id": "s41-u01-o2-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 3,
      "page": 1,
      "sourceId": "sci-41-1-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "가위에서 자석에 붙는 부분",
      "concept": "한 물체라도 철로 된 부분(가위 날)만 자석에 붙고 플라스틱 부분(손잡이)은 붙지 않는다."
    },
    "prompt": "다음과 같은 가위에 자석을 가까이 가져갔을 때 자석에 붙는 부분을 골라 기호를 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s41-u01/s2-q03.webp",
    "figureNote": "주황색 플라스틱 손잡이의 가위. ㉠은 금속 날 부분, ㉡은 플라스틱 손잡이 부분을 가리킴.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠",
      "accepted": [
        "㉠",
        "ㄱ"
      ]
    },
    "explanation": "가위에서 철로 만들어진 날 부분은 자석에 붙지만, 플라스틱으로 만들어진 손잡이 부분은 자석에 붙지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o2-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 4,
      "page": 1,
      "sourceId": "sci-41-1-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T03",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "철 클립에 막대자석을 가까이 했을 때의 움직임",
      "concept": "자석과 철로 된 물체 사이에는 끌어당기는 힘이 작용해 철 클립이 자석 쪽으로 움직여 붙는다."
    },
    "prompt": "다음과 같이 철 클립에 막대자석을 가까이 했을 때 나타나는 철 클립의 움직임을 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s41-u01/s2-q04.webp",
    "figureNote": "왼쪽에 철 클립, 가운데 왼쪽을 향한 초록색 화살표, 오른쪽에 막대자석(N극이 클립 쪽, S극이 바깥쪽).",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "철 클립이 막대자석 쪽으로 끌어당겨져 막대자석에 붙는다.",
      "rubric": {
        "required": [
          "클립이 움직여 자석에 붙는다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "철 클립이 움직여 막대자석에 붙는다는 내용이 포함되어 있으면 정답으로 합니다."
        ]
      }
    },
    "explanation": "자석과 자석에 붙는 물체 사이에는 서로 끌어당기는 힘이 작용하기 때문에 철 클립에 막대자석을 가까이 하면 철 클립이 막대자석 쪽으로 끌어당겨져 붙습니다.\n[채점 기준] 철 클립이 움직여 막대자석에 붙는다는 내용이 포함되어 있으면 정답으로 합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준에 비율(%)이 인쇄되어 있지 않아 ratio는 null로 둠. 채점 기준 문구만 인쇄됨."
    }
  },
  {
    "id": "s41-u01-o2-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 5,
      "page": 1,
      "sourceId": "sci-41-1-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "종이판 사이에 둔 자석과 철 클립",
      "concept": "자석에 붙지 않는 얇은 종이판이 사이에 있어도 자석의 끌어당기는 힘은 철 클립에 작용한다."
    },
    "prompt": "다음과 같이 막대자석에 종이판을 댄 다음 철 클립에 가까이 했을 때 철 클립의 움직임으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "철 클립은 움직이지 않는다.",
      "철 클립이 제자리에서 회전한다.",
      "철 클립이 막대자석 반대쪽으로 밀려난다.",
      "종이판이 사이에 있어도 철 클립이 막대자석에 붙는다.",
      "철 클립이 막대자석 쪽으로 움직이다가 반대쪽으로 밀려난다."
    ],
    "figure": "assets/bank/s41-u01/s2-q05.webp",
    "figureNote": "손으로 종이판(라벨 「종이판」) 위에서 막대자석을 세워 대고, 종이판 아래쪽에 철 클립이 놓인 그림.",
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
    "explanation": "자석과 철 클립 사이에 자석에 붙지 않는 종이판이 있어도 자석과 철 클립은 서로 끌어당깁니다.\n[자료 검토] 가까운 거리와 얇은 사이 판의 교구 조건입니다. 두께·거리·고정 조건을 달리해도 반드시 붙는다는 뜻은 아닙니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "④ 선택지는 「붙는」/「다.」로 두 줄에 걸쳐 줄바꿈 인쇄됨. ⑤도 「반대쪽으로」/「밀려난다.」로 줄바꿈."
    }
  },
  {
    "id": "s41-u01-o2-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 6,
      "page": 1,
      "sourceId": "sci-41-1-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물속의 철 머리핀 꺼내기",
      "concept": "자석의 힘은 컵 벽과 물을 통과해 작용하므로 컵 밖에서 자석으로 철 머리핀을 끌어 올려 꺼낼 수 있다."
    },
    "prompt": "단비는 물이 가득 든 컵 속에 빠진 철 머리핀을 도구를 이용하여 꺼내려고 합니다. 물을 쏟지 않으면서 철 머리핀을 꺼낼 수 있는 도구로 알맞은 것은 어느 것입니까? (단, 물에 손을 넣지 않습니다.)",
    "givens": null,
    "choices": [
      "지우개",
      "고무풍선",
      "유리구슬",
      "막대자석",
      "알루미늄 캔"
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
    "explanation": "막대자석을 컵의 옆면에 가까이 하여 철 머리핀을 자석에 붙인 뒤 컵의 입구로 이동하면 철 머리핀을 꺼낼 수 있습니다.\n[자료 검토] 교사가 준비한 얕은 안전한 물통의 자료입니다. 학생이 큰 수조에 손을 넣거나 위험하게 기구를 다루는 활동을 요구하지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o2-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 7,
      "page": 2,
      "sourceId": "sci-41-1-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "막대자석에서 빵 끈 조각이 많이 붙는 부분",
      "concept": "막대자석은 양쪽 끝부분(극)에 철로 된 물체가 가장 많이 붙는다."
    },
    "prompt": "다음은 위 실험의 결과입니다. (     ) 안에 들어갈 알맞은 말을 골라 쓰시오.",
    "givens": {
      "지문": "[07~08]\n빵 끈 조각이 든 종이 그릇에 막대자석을 넣었다가 천천히 들어 올렸습니다. 물음에 답하시오.\n막대자석의 ( 양쪽 끝, 가운데 ) 부분에 빵 끈 조각이 많이 붙습니다."
    },
    "choices": null,
    "figure": "assets/bank/s41-u01/s2-q07.webp",
    "figureNote": "종이 그릇에 담긴 여러 색의 빵 끈 조각 위에 손으로 막대자석(S·N)을 넣었다가 들어 올리는 그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "양쪽 끝",
      "accepted": [
        "양쪽 끝",
        "양쪽끝",
        "양 끝"
      ]
    },
    "explanation": "빵 끈 조각이 든 종이 그릇에 막대자석을 넣었다가 들어 올리면 막대자석의 양쪽 끝부분에 빵 끈 조각이 많이 붙습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문 둘째 줄은 발문 아래 상자 안 문장(고를 말 괄호 포함). 발문의 빈 괄호는 「(     )」로 옮김(인쇄된 공백 길이는 정확하지 않음)."
    }
  },
  {
    "id": "s41-u01-o2-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 8,
      "page": 2,
      "sourceId": "sci-41-1-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "둥근기둥 모양 자석에서 빵 끈 조각이 붙는 부분",
      "concept": "자석의 모양이 달라도 철로 된 물체는 자석의 양쪽 끝(극)에 가장 많이 붙는다."
    },
    "prompt": "위 실험에서 막대자석 대신 둥근기둥 모양 자석을 이용하였습니다. <보기>에서 실험 결과로 알맞은 것을 골라 기호를 쓰시오.",
    "givens": {
      "지문": "[07~08]\n빵 끈 조각이 든 종이 그릇에 막대자석을 넣었다가 천천히 들어 올렸습니다. 물음에 답하시오.",
      "보기": [
        "㉠ 빵 끈 조각이 자석에 붙지 않는다.",
        "㉡ 빵 끈 조각이 자석 전체에 골고루 붙는다.",
        "㉢ 빵 끈 조각이 자석의 가운데 부분에 많이 붙는다.",
        "㉣ 빵 끈 조각이 자석의 양쪽 끝부분에 많이 붙는다."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s41-u01/s2-q07.webp",
    "figureNote": "종이 그릇에 담긴 여러 색의 빵 끈 조각 위에 손으로 막대자석(S·N)을 넣었다가 들어 올리는 그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉣",
      "accepted": [
        "㉣",
        "ㄹ",
        "빵 끈 조각이 자석의 양쪽 끝부분에 많이 붙는다."
      ]
    },
    "explanation": "빵 끈 조각이 든 종이 그릇에 막대자석 대신 둥근기둥 모양 자석을 넣었다가 들어 올려도 막대자석과 동일하게 자석의 양쪽 끝부분에 빵 끈 조각이 많이 붙습니다.\n[자료 검토] 그림의 N/S 두 극 교구를 대상으로 한 설명입니다. 모양·색만으로 모든 제품의 극 배치를 판단하지 않습니다. 자석을 실제로 자르거나 깨뜨리는 활동은 하지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o2-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 9,
      "page": 2,
      "sourceId": "sci-41-1-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "말굽자석의 특징과 자석의 극",
      "concept": "모든 자석은 철로 된 물체가 가장 많이 붙는 극이 두 군데 있고, 쪼개도 각 조각이 다시 두 극을 가진다."
    },
    "prompt": "다음 자석에 대한 설명으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "고리 자석이다.",
      "동전 모양 자석이다.",
      "자석의 극이 한 군데이다.",
      "철로 만든 물체가 가장 많이 붙는 부분은 두 군데이다.",
      "자석을 반으로 쪼개면 하나의 극을 가진 자석 두 개로 나누어진다."
    ],
    "figure": "assets/bank/s41-u01/s2-q09.webp",
    "figureNote": "말굽자석 사진: 왼쪽 다리는 파란색으로 S, 오른쪽 다리는 빨간색으로 N이 새겨져 있음.",
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
    "explanation": "말굽자석의 모습입니다. 자석에서 철로 만든 물체가 가장 많이 붙는 부분을 자석의 극이라고 하며, 모든 자석은 자석의 극이 두 군데입니다. 자석을 반으로 쪼개도 각각의 조각이 하나의 극을 가진 자석 두 개로 나누어지는 것이 아니라 쪼개진 조각들이 다시 두 군데의 극을 갖는 자석이 됩니다.\n[자료 검토] 그림의 N/S 두 극 교구를 대상으로 한 설명입니다. 모양·색만으로 모든 제품의 극 배치를 판단하지 않습니다. 자석을 실제로 자르거나 깨뜨리는 활동은 하지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "④ 「…두 군데이」/「다.」, ⑤ 「…자석 두 개」/「로 나누어진다.」로 줄바꿈 인쇄됨."
    }
  },
  {
    "id": "s41-u01-o2-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 10,
      "page": 2,
      "sourceId": "sci-41-1-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "다른 극끼리 마주 본 두 막대자석",
      "concept": "자석의 다른 극끼리 가까이 하면 서로 끌어당겨 붙는다."
    },
    "prompt": "다음 <보기>에서 막대자석 두 개를 다른 극끼리 마주 보게 하여 가까이 했을 때 나타나는 알맞은 결과를 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 두 막대자석이 붙는다.",
        "㉡ 두 막대자석이 붙지 않는다.",
        "㉢ 두 막대자석이 서로 밀어 낸다.",
        "㉣ 두 막대자석이 서로 끌어당긴다."
      ]
    },
    "choices": [
      "㉠",
      "㉡",
      "㉠, ㉢",
      "㉠, ㉣",
      "㉡, ㉢"
    ],
    "figure": "assets/bank/s41-u01/s2-q10.webp",
    "figureNote": "두 손에 막대자석을 하나씩 들고 마주 대는 그림: 왼쪽 자석 S-N, 오른쪽 자석 S-N 순서로 왼쪽 자석의 N극과 오른쪽 자석의 S극이 마주 봄.",
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
    "explanation": "막대자석 두 개를 다른 극끼리 마주 보게 하여 가까이 하면 두 막대자석이 서로를 끌어당겨 붙습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o2-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 11,
      "page": 3,
      "sourceId": "sci-41-1-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "밀어 내는 힘으로 자석의 극 알아내기",
      "concept": "같은 극끼리는 밀어 내므로, S극과 밀어 내는 부분은 S극이다."
    },
    "prompt": "다음과 같이 막대자석의 S극에 색종이로 감싸 극을 알 수 없는 막대자석을 가까이 했습니다. 이때 막대자석이 밀려났다면 색종이로 감싼 막대자석의 ㉠ 부분은 무슨 극인지 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s41-u01/s2-q11.webp",
    "figureNote": "왼쪽에 N(빨강)-S(파랑) 막대자석과 왼쪽으로 밀려나는 방향의 노란 화살표, 오른쪽에 손으로 든 노란 색종이로 감싼 자석. ㉠은 색종이 자석의 막대자석 쪽 끝을 가리킴.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "S극",
      "accepted": [
        "S극",
        "S",
        "s극",
        "에스극"
      ]
    },
    "explanation": "자석을 같은 극끼리 가까이 하면 서로 밀어 내는 힘이 작용하고, 다른 극끼리 가까이 하면 서로 끌어당기는 힘이 작용합니다. 막대자석의 S극과 색종이로 감싼 막대자석이 서로 밀어 내는 것으로 보아 색종이로 감싼 ㉠ 부분은 S극임을 알 수 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란은 「(     )극」으로 인쇄됨 — 학생은 괄호 안에 「S」만 써도 됨."
    }
  },
  {
    "id": "s41-u01-o2-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 12,
      "page": 3,
      "sourceId": "sci-41-1-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "고리 자석으로 가장 낮은 탑 쌓기",
      "concept": "고리 자석을 다른 극끼리 마주 보게 쌓으면 서로 끌어당겨 틈 없이 붙으므로 탑이 가장 낮아진다."
    },
    "prompt": "다음은 고리 자석으로 가장 낮은 탑을 쌓는 방법을 설명한 것입니다. (     ) 안에 들어갈 알맞은 말을 골라 쓰시오.",
    "givens": {
      "지문": "고리 자석을 서로 ( 다른, 같은 ) 극끼리 마주 보게 쌓습니다."
    },
    "choices": null,
    "figure": "assets/bank/s41-u01/s2-q12.webp",
    "figureNote": "받침대에 세운 막대에 색이 다른 고리 자석 다섯 개가 틈 없이 붙어 쌓여 있는 그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "다른",
      "accepted": [
        "다른",
        "다른 극"
      ]
    },
    "explanation": "고리 자석을 서로 다른 극끼리 마주 보게 놓으면 고리 자석 사이에 서로 끌어당기는 힘이 작용하여 가장 낮은 탑을 쌓을 수 있습니다.\n[자료 검토] 같은 고리·개수·받침을 쓰고 비자성 막대가 옆 움직임을 제한하는 탑입니다. 떠 있는 고리만 보고 가이드 없는 안정한 공중 부양을 주장하지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o2-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 13,
      "page": 3,
      "sourceId": "sci-41-1-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물에 띄운 막대자석이 가리키는 방향",
      "concept": "물에 띄운 막대자석은 움직임을 멈추면 N극이 북쪽, S극이 남쪽을 가리킨다."
    },
    "prompt": "다음과 같이 물이 담긴 수조에 막대자석을 올려놓은 접시를 띄웠습니다. 접시의 움직임이 멈추었을 때 막대자석의 극이 가리키는 방향으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "N극이 동쪽을 가리킨다.",
      "N극이 남쪽을 가리킨다.",
      "S극이 서쪽을 가리킨다.",
      "S극이 남쪽을 가리킨다.",
      "S극이 북쪽을 가리킨다."
    ],
    "figure": "assets/bank/s41-u01/s2-q13.webp",
    "figureNote": "위에서 본 원형 수조(북·남·동·서 표시) 안 접시 위에 막대자석이 비스듬히 놓인 그림(N극은 북서쪽, S극은 남동쪽을 향해 기울어 있음).",
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
    "explanation": "물에 띄워 움직임이 멈춘 막대자석의 N극은 북쪽을 가리키고, S극은 남쪽을 가리킵니다.\n[자료 검토] 다른 자석·쇠붙이를 멀리하고 수평으로 자유롭게 돌아 멈추는 조건입니다. 기울어진 그림은 실제 멈춘 방향의 측정값으로 쓰지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "그림 속 자석은 정확히 남북이 아니라 비스듬히(움직이는 중) 그려져 있음; 정답은 멈춘 뒤의 방향 기준."
    }
  },
  {
    "id": "s41-u01-o2-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 14,
      "page": 3,
      "sourceId": "sci-41-1-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "실에 매단 막대자석이 가리키는 방향",
      "concept": "실에 매달아 자유롭게 움직이게 한 막대자석은 멈추면 N극이 북쪽, S극이 남쪽을 가리킨다."
    },
    "prompt": "막대자석을 실에 매달아 공중에 띄웠을 때 움직임을 멈춘 막대자석의 N극과 S극이 가리키는 방향을 각각 쓰시오.",
    "givens": {
      "답란": "N극: (     )쪽, S극: (     )쪽"
    },
    "choices": null,
    "figure": "assets/bank/s41-u01/s2-q14.webp",
    "figureNote": "빈 비커 위에 걸친 나무 막대에 실로 매단 막대자석(N-S)이 공중에 떠 있는 그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "N극: 북쪽, S극: 남쪽",
      "accepted": [
        "N극: 북쪽, S극: 남쪽",
        "북쪽, 남쪽",
        "북, 남",
        "N극 북쪽 S극 남쪽"
      ]
    },
    "explanation": "자석을 실에 매달아 공중에 띄우면 자석은 항상 북쪽과 남쪽을 가리킵니다. 이때 자석의 N극은 북쪽을 가리키고, S극은 남쪽을 가리킵니다.\n[자료 검토] 다른 자석·쇠붙이를 멀리하고 수평으로 자유롭게 돌아 멈추는 조건입니다. 기울어진 그림은 실제 멈춘 방향의 측정값으로 쓰지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란 「N극: (     )쪽, S극: (     )쪽」은 인쇄된 답 칸이라 givens의 「답란」에 둠."
    }
  },
  {
    "id": "s41-u01-o2-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 15,
      "page": 3,
      "sourceId": "sci-41-1-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "나침반의 뜻",
      "concept": "나침반은 자석으로 된 바늘이 항상 북쪽과 남쪽을 가리키는 성질을 이용해 방향을 찾는 도구이다."
    },
    "prompt": "빈칸에 공통으로 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "• □은/는 방향을 찾을 수 있도록 만든 도구입니다.\n• □의 바늘은 자석으로 되어 있어 항상 일정한 방향을 가리킵니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "나침반",
      "accepted": [
        "나침반",
        "나 침반"
      ]
    },
    "explanation": "나침반은 자석이 항상 북쪽과 남쪽을 가리키는 성질을 이용하여 방향을 찾을 수 있도록 만든 도구입니다. 나침반 바늘은 자석으로 되어 있어 항상 북쪽과 남쪽을 가리킵니다.\n[자료 검토] 다른 자석·쇠붙이를 멀리하고 수평으로 자유롭게 돌아 멈추는 조건입니다. 기울어진 그림은 실제 멈춘 방향의 측정값으로 쓰지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문의 빈칸은 네모 칸으로 인쇄됨 — □로 옮김."
    }
  },
  {
    "id": "s41-u01-o2-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 16,
      "page": 4,
      "sourceId": "sci-41-1-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물에 띄운 자석과 나침반 바늘의 공통점",
      "concept": "나침반 바늘도 자석이므로 N극은 북쪽, S극은 남쪽을 가리키고 철로 만든 물체를 끌어당긴다."
    },
    "prompt": "다음 <보기>에서 물에 띄운 자석과 나침반 바늘의 공통점을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ N극이 북쪽을 가리킨다.",
        "㉡ S극이 남쪽을 가리킨다.",
        "㉢ 철로 만든 물체를 끌어당긴다."
      ]
    },
    "choices": [
      "㉠",
      "㉠, ㉡",
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
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "나침반 바늘도 자석입니다. 자석은 N극이 북쪽, S극이 남쪽을 가리키고, 철로 만든 물체를 끌어당깁니다.\n[자료 검토] 다른 자석·쇠붙이를 멀리하고 수평으로 자유롭게 돌아 멈추는 조건입니다. 기울어진 그림은 실제 멈춘 방향의 측정값으로 쓰지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o2-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 17,
      "page": 4,
      "sourceId": "sci-41-1-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "막대자석 N극을 가까이 한 나침반 바늘",
      "concept": "나침반 바늘도 자석이라 막대자석의 N극을 가까이 하면 다른 극인 S극이 끌려와 그쪽을 가리킨다."
    },
    "prompt": "다음과 같이 막대자석의 N극을 나침반에 가까이 했을 때 막대자석을 가리키는 나침반 바늘의 극은 N극과 S극 중에서 무엇인지 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s41-u01/s2-q17.webp",
    "figureNote": "바늘이 그려지지 않은 나침반(북·남·동·서 눈금판)의 동쪽 옆에 막대자석이 N극을 나침반 쪽으로 향해 놓인 그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "S극",
      "accepted": [
        "S극",
        "S",
        "s극",
        "에스극"
      ]
    },
    "explanation": "자석을 같은 극끼리 가까이 하면 서로 밀어 내는 힘이 작용하고, 다른 극끼리 가까이 하면 서로 끌어당기는 힘이 작용합니다. 나침반 바늘도 자석이기 때문에 막대자석의 N극을 가까이하면 나침반 바늘의 S극이 막대자석의 N극을 가리킵니다.\n[자료 검토] 가까운 막대자석의 영향이 큰 설명 그림으로 해석합니다. 실제 바늘 각도는 주변 조건을 확인해 관찰하며 인쇄 방위 글자의 회전과 구별합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란은 「(     )극」으로 인쇄됨."
    }
  },
  {
    "id": "s41-u01-o2-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 18,
      "page": 4,
      "sourceId": "sci-41-1-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "막대자석 주위 나침반 바늘 방향이 달라지는 까닭",
      "concept": "나침반 바늘은 자석이어서 주위 자석과 같은 극끼리는 밀어 내고 다른 극끼리는 끌어당기므로 방향이 바뀐다."
    },
    "prompt": "막대자석 주위에 나침반을 놓았을 때 나침반 바늘이 가리키는 방향이 달라지는 까닭으로 알맞은 것을 두 가지 고르시오.",
    "givens": null,
    "choices": [
      "나침반 바늘과 막대자석은 같은 극끼리 서로 밀어 내기 때문이다.",
      "나침반 바늘과 막대자석은 다른 극끼리 서로 밀어 내기 때문이다.",
      "나침반 바늘과 막대자석은 같은 극끼리 서로 끌어당기기 때문이다.",
      "나침반 바늘과 막대자석은 다른 극끼리 서로 끌어당기기 때문이다.",
      "나침반 바늘과 막대자석은 극에 관계없이 서로 끌어당기기 때문이다."
    ],
    "figure": "assets/bank/s41-u01/s2-q18.webp",
    "figureNote": "가운데 막대자석(N 왼쪽, S 오른쪽) 둘레에 나침반 6개가 놓여 각 바늘이 서로 다른 방향을 가리키는 그림.",
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
    "explanation": "나침반 바늘이 자석이기 때문에 자석을 가까이 하면 가까이 한 자석의 극 종류에 따라 나침반 바늘이 가리키는 방향이 달라집니다. 나침반 바늘에 자석을 가까이 할 때 같은 극끼리는 서로 밀어 내고, 다른 극끼리는 서로 끌어당깁니다.\n[자료 검토] 가까운 막대자석의 영향이 큰 설명 그림으로 해석합니다. 실제 바늘 각도는 주변 조건을 확인해 관찰하며 인쇄 방위 글자의 회전과 구별합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "선택지 ①~⑤ 모두 두 줄로 줄바꿈 인쇄됨(예: 「…밀어 내」/「기 때문이다.」). accepted의 순서 바꿈·붙여 쓰기는 입력 변형으로 추가함."
    }
  },
  {
    "id": "s41-u01-o2-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 19,
      "page": 4,
      "sourceId": "sci-41-1-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "자석 책갈피에 이용된 자석의 성질",
      "concept": "자석 책갈피는 맞닿는 두 면에 서로 다른 극의 자석이 있어 끌어당겨 책장에 붙는다."
    },
    "prompt": "다음 <보기>에서 자석 책갈피에 이용된 자석의 성질로 알맞은 것을 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 자석이 일정한 방향을 가리키는 성질",
        "㉡ 자석의 같은 극끼리 서로 밀어 내는 성질",
        "㉢ 자석의 다른 극끼리 서로 끌어당기는 성질"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s41-u01/s2-q19.webp",
    "figureNote": "책장 사이에 끼운 동물 얼굴 모양 자석 책갈피들의 사진/그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉢",
      "accepted": [
        "㉢",
        "ㄷ",
        "자석의 다른 극끼리 서로 끌어당기는 성질"
      ]
    },
    "explanation": "자석 책갈피의 맞닿는 양쪽 부분에 서로 다른 극의 자석이 있습니다. 자석 책갈피의 양쪽 부분을 쉽게 붙였다 뗄 수 있어서 책의 읽은 곳을 표시할 수 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o2-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 20,
      "page": 4,
      "sourceId": "sci-41-1-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "자석을 이용한 물체 — 자석 신발 끈 매듭기",
      "concept": "자석 신발 끈 매듭기는 맞닿는 두 면이 자석이어서 서로 달라붙는 성질로 신발 끈을 쉽게 고정한다."
    },
    "prompt": "다음에서 설명하는 것은 무엇입니까?",
    "givens": {
      "지문": "양쪽 면이 잘 달라붙어서 신발 끈을 쉽게 맬 수 있습니다."
    },
    "choices": [
      "자석 다트",
      "자석 필통",
      "자석 클립 통",
      "자석 유리창닦이",
      "자석 신발 끈 매듭기"
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
    "explanation": "자석 신발 끈 매듭기는 매듭기의 맞닿는 양쪽 면이 자석으로 되어 있기 때문에 양쪽 면이 잘 달라붙어서 신발 끈을 쉽게 맬 수 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o3-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 1,
      "page": 1,
      "sourceId": "sci-41-1-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "자석에 붙는 물체와 붙지 않는 물체",
      "concept": "물체를 이루는 물질에 따라 자석에 붙기도 하고 붙지 않기도 하며, 철로 만든 물체만 자석에 붙는다."
    },
    "prompt": "위 실험의 결과를 바르게 설명한 사람의 이름을 쓰시오.",
    "givens": {
      "지문": "[01~02] 다음의 여러 가지 물체에 막대자석을 가까이 하면서 나타나는 현상을 관찰하였습니다. 물음에 답하시오.\n• 단비: 모든 물체가 막대자석에 붙습니다.\n• 다래: 유리로 만든 물체만 막대자석에 붙습니다.\n• 하늘: 고무로 만든 물체만 막대자석에 붙습니다.\n• 노을: 막대자석에 붙는 물체도 있고, 붙지 않는 물체도 있습니다.",
      "그림 속 글자": [
        "▲ 나무젓가락",
        "▲ 철 집게",
        "▲ 지우개",
        "▲ 알루미늄 캔",
        "▲ 유리구슬",
        "▲철 머리핀"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s41-u01/s3-q01.webp",
    "figureNote": "여섯 가지 물체 사진과 이름표: 나무젓가락, 철 집게, 지우개, 알루미늄 캔, 유리구슬, 철 머리핀.",
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
    "explanation": "물체를 이루는 물질의 종류에 따라 자석에 붙는 물체도 있고, 붙지 않는 물체도 있습니다. 철로 만든 물체는 자석에 붙고, 나무, 고무, 알루미늄, 유리로 만든 물체는 자석에 붙지 않습니다.\n[자료 검토] 문항에 제시한 재료·시료의 비교입니다. 모든 금속이 붙는다는 뜻이 아니며 실제 시료를 확인합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "이름(단비·다래·하늘·노을) 뒤 콜론까지 굵은 글씨로 인쇄됨."
    }
  },
  {
    "id": "s41-u01-o3-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 2,
      "page": 1,
      "sourceId": "sci-41-1-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "자석에 붙는 물체의 개수",
      "concept": "철로 만든 물체는 자석에 붙지만 나무·고무·알루미늄·유리로 만든 물체는 붙지 않는다."
    },
    "prompt": "위의 물체 중에서 자석에 붙는 물체는 모두 몇 개입니까?",
    "givens": {
      "지문": "[01~02] 다음의 여러 가지 물체에 막대자석을 가까이 하면서 나타나는 현상을 관찰하였습니다. 물음에 답하시오.",
      "그림 속 글자": [
        "▲ 나무젓가락",
        "▲ 철 집게",
        "▲ 지우개",
        "▲ 알루미늄 캔",
        "▲ 유리구슬",
        "▲철 머리핀"
      ]
    },
    "choices": [
      "1개",
      "2개",
      "3개",
      "4개",
      "5개"
    ],
    "figure": "assets/bank/s41-u01/s3-q01.webp",
    "figureNote": "여섯 가지 물체 사진과 이름표: 나무젓가락, 철 집게, 지우개, 알루미늄 캔, 유리구슬, 철 머리핀.",
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
    "explanation": "철로 만든 철 집게와 철 머리핀은 자석에 붙고, 나무로 만든 나무젓가락, 고무로 만든 지우개, 알루미늄으로 만든 알루미늄 캔, 유리로 만든 유리구슬은 자석에 붙지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "그림 이름표 '▲철 머리핀'은 ▲ 뒤에 띄어쓰기 없이 인쇄됨(다른 이름표는 '▲ ' 뒤 띄어씀)."
    }
  },
  {
    "id": "s41-u01-o3-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 3,
      "page": 1,
      "sourceId": "sci-41-1-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "가위의 부분별 자석에 붙는 정도",
      "concept": "한 물체라도 철로 만든 부분은 자석에 붙고 플라스틱으로 만든 부분은 붙지 않는다."
    },
    "prompt": "가위의 ㉠, ㉡ 부분과 여러 가지 물체에 각각 막대자석을 가까이 했을 때 같은 결과가 나타나는 물체끼리 짝 지은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "가위의 ㉠ 부분, 종이컵",
      "가위의 ㉠ 부분, 색종이",
      "가위의 ㉠ 부분, 고무풍선",
      "가위의 ㉡ 부분, 철 클립",
      "가위의 ㉡ 부분, 플라스틱 컵"
    ],
    "figure": "assets/bank/s41-u01/s3-q03.webp",
    "figureNote": "주황색 플라스틱 손잡이의 가위 사진. ㉠은 금속 날 부분, ㉡은 플라스틱 손잡이 부분을 가리킨다.",
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
    "explanation": "철로 만든 가위의 날 부분(㉠)과 철 클립은 자석에 붙습니다. 플라스틱으로 만든 가위의 손잡이 부분(㉡), 종이로 만든 종이컵과 색종이, 고무로 만든 고무풍선, 플라스틱으로 만든 플라스틱 컵은 자석에 붙지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o3-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 4,
      "page": 1,
      "sourceId": "sci-41-1-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "철 클립에 막대자석을 가까이 할 때",
      "concept": "자석과 철로 만든 물체 사이에는 서로 끌어당기는 힘이 작용한다."
    },
    "prompt": "다음 <보기>에서 빈칸에 들어갈 알맞은 말을 골라 기호를 쓰시오.",
    "givens": {
      "지문": "책상 위에 놓은 철 클립에 막대자석을 가까이 하면 [   ]",
      "보기": [
        "㉠ 철 클립이 막대자석 반대쪽으로 밀려난다.",
        "㉡ 막대자석이 철 클립 반대쪽으로 밀려난다.",
        "㉢ 철 클립이 막대자석 쪽으로 끌어당겨져 붙는다."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s41-u01/s3-q04.webp",
    "figureNote": "책상 위 철 클립 쪽으로 화살표가 향하고, 손으로 잡은 막대자석(N 빨강, S 파랑)의 N극이 클립 쪽을 향한다.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉢",
      "accepted": [
        "㉢",
        "ㄷ",
        "철 클립이 막대자석 쪽으로 끌어당겨져 붙는다."
      ]
    },
    "explanation": "자석과 철로 만든 물체 사이에는 서로 끌어당기는 힘이 작용합니다. 따라서 철 클립에 막대자석을 가까이 하면 철 클립이 막대자석 쪽으로 끌어당겨져 붙습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문 상자의 빈칸은 네모 칸으로 인쇄됨('[   ]'로 적음)."
    }
  },
  {
    "id": "s41-u01-o3-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 5,
      "page": 2,
      "sourceId": "sci-41-1-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "사이에 물체가 있을 때 자석의 힘",
      "concept": "자석과 철 사이에 자석에 붙지 않는 물체가 끼어 있어도 자석은 철을 끌어당긴다."
    },
    "prompt": "막대자석에 플라스틱판을 댄 다음 철 클립에 가까이 하면 다음과 같이 철 클립이 막대자석에 붙습니다. 이에 대해 바르게 설명한 사람의 이름을 쓰시오.",
    "givens": {
      "지문": "• 단비: 플라스틱판 대신 종이판을 이용해도 철 클립은 막대자석에 붙습니다.\n• 다래: 철 클립과 막대자석 사이에 플라스틱판이 없으면 철 클립은 막대자석에 붙지 않습니다.\n• 하늘: 플라스틱판을 뺀 상태로 막대자석을 철 클립에 가까이 하면 철 클립은 막대자석 반대쪽으로 밀려납니다.",
      "그림 속 글자": [
        "플라스틱판"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s41-u01/s3-q05.webp",
    "figureNote": "한 손으로 플라스틱판을 세워 들고, 다른 손으로 막대자석을 판 뒤에 대자 판 반대편의 철 클립이 판에 붙어 있는 그림. '플라스틱판' 이름표가 있다.",
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
    "explanation": "자석과 자석에 붙는 물체 사이에는 서로 끌어당기는 힘이 작용하는데, 두 물체 사이에 자석에 붙지 않는 다른 물체가 있어도 자석과 자석에 붙는 물체는 서로 끌어당깁니다. 따라서 플라스틱판 대신 종이판을 이용하거나 플라스틱판이 없어도 철 클립은 막대자석에 붙습니다.\n[자료 검토] 가까운 거리와 얇은 사이 판의 교구 조건입니다. 두께·거리·고정 조건을 달리해도 반드시 붙는다는 뜻은 아닙니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "이름(단비·다래·하늘) 뒤 콜론까지 굵은 글씨로 인쇄됨."
    }
  },
  {
    "id": "s41-u01-o3-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 6,
      "page": 2,
      "sourceId": "sci-41-1-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "떨어진 거리와 자석의 끌어당기는 힘",
      "concept": "자석은 약간 떨어진 철도 끌어당기지만, 거리가 멀어질수록 끌어당기는 힘은 약해진다."
    },
    "prompt": "자석과 여러 가지 물체 사이에 작용하는 힘에 대한 설명이 맞으면 ○표, 틀리면 ×표를 하시오.",
    "givens": {
      "소문항": [
        "(1) 자석과 철 머리핀은 약간 떨어져 있어도 서로 끌어당깁니다.",
        "(2) 자석과 철 클립은 사이가 멀어질수록 서로 끌어당기는 힘이 강해집니다."
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
      "answer": "(1) ○ (2) ×",
      "accepted": [
        "(1) ○ (2) ×",
        "(1) ○, (2) ×",
        "○, ×",
        "○ ×",
        "O, X",
        "O X",
        "OX"
      ]
    },
    "explanation": "철 머리핀과 철 클립은 철로 만들어진 물체이므로 자석에 붙습니다. 자석과 자석에 붙는 물체는 약간 떨어져 있어도 서로 끌어당기며, 자석과 자석에 붙는 물체 사이가 멀어질수록 끌어당기는 힘이 약해집니다.\n[자료 검토] 가까운 거리와 얇은 사이 판의 교구 조건입니다. 두께·거리·고정 조건을 달리해도 반드시 붙는다는 뜻은 아닙니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o3-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 7,
      "page": 2,
      "sourceId": "sci-41-1-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T05",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "막대자석에 빵 끈 조각이 붙는 위치",
      "concept": "막대자석에서 철이 많이 붙는 곳은 극인 양쪽 끝부분이고, 가운데에는 거의 붙지 않는다."
    },
    "prompt": "다음은 단비가 빵 끈 조각이 든 종이 그릇에 막대자석을 넣었다가 천천히 들어 올렸을 때의 모습을 예상한 것입니다. 잘못된 부분과 그렇게 생각한 까닭을 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s41-u01/s3-q07.webp",
    "figureNote": "손으로 잡아 든 막대자석(왼쪽 S 파랑, 오른쪽 N 빨강)의 가운데 부분에 여러 색 빵 끈 조각이 잔뜩 붙어 있는 예상 그림. 양쪽 끝에는 거의 붙어 있지 않다.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "빵 끈 조각이 막대자석의 가운데 부분에 많이 붙지 않는다. 막대자석의 극은 양쪽 끝부분이기 때문에 빵 끈 조각은 막대자석의 양쪽 끝부분에 많이 붙는다.",
      "rubric": {
        "required": [
          "가운데 대신 극인 양쪽 끝에 많이 붙는다고 고친다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "빵 끈 조각이 막대자석의 가운데 부분이 아니라 자석의 극인 양쪽 끝부분에 많이 붙는다는 내용이 포함되어 있으면 정답으로 합니다."
        ]
      }
    },
    "explanation": "빵 끈 조각이 든 종이 그릇에 막대자석을 넣었다가 들어 올리면 막대자석의 극인 양쪽 끝부분에 빵 끈 조각이 많이 붙습니다.\n[채점 기준] 빵 끈 조각이 막대자석의 가운데 부분이 아니라 자석의 극인 양쪽 끝부분에 많이 붙는다는 내용이 포함되어 있으면 정답으로 합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준에 비율 표기 없음(단일 기준). 답란은 밑줄 두 줄."
    }
  },
  {
    "id": "s41-u01-o3-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 8,
      "page": 2,
      "sourceId": "sci-41-1-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "자석의 극",
      "concept": "자석에서 철로 만든 물체가 많이 붙는 양쪽 끝부분을 자석의 극이라고 한다."
    },
    "prompt": "다음 ㉠, ㉡에 들어갈 말을 알맞게 짝 지은 것은 어느 것입니까?",
    "givens": {
      "지문": "철 머리핀이 가득 든 서랍 안에 둥근기둥 모양 자석을 넣었다가 들어 올리면 둥근기둥 모양 자석의 [ ㉠ ]에 철 머리핀이 많이 붙습니다. 둥근기둥 모양 자석에서 철 머리핀이 많이 붙는 [ ㉠ ]을/를 자석의 [ ㉡ ](이)라고 합니다."
    },
    "choices": [
      "가운데 / 극",
      "왼쪽 끝부분 / 강",
      "양쪽 끝부분 / 강",
      "양쪽 끝부분 / 극",
      "오른쪽 끝부분 / 극"
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
    "explanation": "둥근기둥 모양 자석에서 철로 만든 물체가 많이 붙는 양쪽 끝부분을 자석의 극이라고 합니다.\n[자료 검토] 그림의 N/S 두 극 교구를 대상으로 한 설명입니다. 모양·색만으로 모든 제품의 극 배치를 판단하지 않습니다. 자석을 실제로 자르거나 깨뜨리는 활동은 하지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기는 표 형식(열 머리: ㉠, ㉡)으로 인쇄되어 '① ㉠ / ㉡'로 적음. 지문의 ㉠·㉡은 네모 칸 안에 인쇄됨."
    }
  },
  {
    "id": "s41-u01-o3-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 9,
      "page": 3,
      "sourceId": "sci-41-1-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "고리 자석의 극",
      "concept": "모든 자석은 극이 두 군데이며, 고리 자석의 극은 앞면과 뒷면에 있다."
    },
    "prompt": "다음은 고리 자석에 철 클립이 붙은 모습입니다. 이에 대한 설명으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "말굽자석과 극의 개수가 같다.",
      "고리 자석의 극은 한 군데이다.",
      "고리 자석의 극은 구멍 안쪽에 있다.",
      "파란색 철 클립이 많이 붙은 부분이 S극이다.",
      "빨간색 철 클립이 적게 붙은 부분이 N극이다."
    ],
    "figure": "assets/bank/s41-u01/s3-q09.webp",
    "figureNote": "회색 고리 자석 한쪽 면에 빨강·파랑·초록·노랑 철 클립 여러 개가 붙어 있는 그림.",
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
    "explanation": "모든 자석의 극은 항상 두 군데입니다. 고리 자석의 극은 앞면과 뒷면에 있으며, 철 클립은 철 클립의 색깔이나 고리 자석 극의 종류에 상관없이 고리 자석에 붙습니다.\n[자료 검토] 그림의 N/S 두 극 교구를 대상으로 한 설명입니다. 모양·색만으로 모든 제품의 극 배치를 판단하지 않습니다. 자석을 실제로 자르거나 깨뜨리는 활동은 하지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o3-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 10,
      "page": 3,
      "sourceId": "sci-41-1-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "자석 사이에 끌어당기는 힘이 작용하는 경우",
      "concept": "자석의 다른 극끼리는 서로 끌어당기고 같은 극끼리는 서로 밀어 낸다."
    },
    "prompt": "다음 <보기>에서 두 자석을 가까이 했을 때 자석 사이에 서로 끌어당기는 힘이 작용하는 경우를 골라 기호를 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s41-u01/s3-q10.webp",
    "figureNote": "<보기> 상자 안 그림. ㉠은 S극(파랑)끼리, ㉡은 N극(빨강)과 S극(파랑), ㉢은 N극(빨강)끼리 마주 보도록 두 막대자석 끝을 나란히 놓은 그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉡",
      "accepted": [
        "㉡",
        "ㄴ"
      ]
    },
    "explanation": "자석의 같은 극끼리 가까이 하면 서로 밀어 내는 힘이 작용하고, 자석의 다른 극끼리 가까이 하면 서로 끌어당기는 힘이 작용합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>는 글이 아닌 그림(마주 보는 두 자석의 극)이라 극 글자만 옮겨 적음."
    }
  },
  {
    "id": "s41-u01-o3-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 11,
      "page": 3,
      "sourceId": "sci-41-1-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "끌어당기는 힘으로 극 알아내기",
      "concept": "다른 극끼리 끌어당기므로, S극에 끌려온 쪽은 N극이고 그 반대쪽 끝은 S극이다."
    },
    "prompt": "다음과 같이 막대자석의 S극에 색종이로 감싸 극을 알 수 없는 막대자석을 가까이 했더니 서로 끌어당기는 힘이 작용했습니다. 이 결과로 알 수 있는 자석의 ㉠ 부분과 ㉡ 부분의 극을 쓰시오.",
    "givens": {
      "답란": "㉠ (     )극, ㉡ (     )극"
    },
    "choices": null,
    "figure": "assets/bank/s41-u01/s3-q11.webp",
    "figureNote": "왼쪽 아래 막대자석(N 빨강, S 파랑)의 S극 쪽에 노란 색종이로 감싼 자석이 놓여 있고, 서로 다가가는 화살표가 있다. 감싼 자석의 S극에 가까운 끝이 ㉠, 먼 끝이 ㉡.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ N극, ㉡ S극",
      "accepted": [
        "㉠ N극, ㉡ S극",
        "N극, S극",
        "㉠ N, ㉡ S",
        "N, S",
        "㉠-N극, ㉡-S극"
      ]
    },
    "explanation": "자석을 같은 극끼리 가까이 하면 서로 밀어 내고, 다른 극끼리 가까이 하면 서로 끌어당깁니다. 막대자석의 S극에 극을 알 수 없는 자석을 가까이 했을 때 서로 끌어당기는 힘이 작용한 것을 통해 ㉠은 막대자석의 S극과 다른 극이고, ㉡은 같은 극이라는 것을 알 수 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o3-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 12,
      "page": 3,
      "sourceId": "sci-41-1-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "고리 자석 탑의 극",
      "concept": "고리 자석이 떠 있으면 마주 보는 면은 같은 극이고, 붙어 있으면 마주 보는 면은 다른 극이다."
    },
    "prompt": "다음 고리 자석 탑에 대한 설명으로 알맞은 것을 두 가지 고르시오.",
    "givens": null,
    "choices": [
      "㉠의 윗면과 ㉡의 아랫면은 다른 극이다.",
      "㉠의 윗면과 ㉢의 아랫면은 같은 극이다.",
      "㉠의 아랫면과 ㉡의 윗면은 다른 극이다.",
      "㉡의 윗면과 ㉢의 아랫면은 다른 극이다.",
      "㉡의 아랫면과 ㉢의 윗면은 같은 극이다."
    ],
    "figure": "assets/bank/s41-u01/s3-q12.webp",
    "figureNote": "받침대 막대에 고리 자석 여러 개를 끼운 탑. 맨 위 주황 고리 자석 ㉠은 아래 자석과 떨어져 떠 있고, 그 아래 빨강 ㉡과 초록 ㉢은 붙어 있으며 그 밑에 노랑·파랑 고리 자석이 더 있다.",
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
    "explanation": "㉠의 윗면을 N극이라고 가정하면 ㉠의 아랫면은 S극, ㉡의 윗면은 S극, ㉡의 아랫면은 N극, ㉢의 윗면은 S극, ㉢의 아랫면은 N극입니다. 따라서 ㉠의 윗면과 ㉡의 아랫면은 같은 극, ㉠의 아랫면과 ㉡의 윗면은 같은 극, ㉡의 아랫면과 ㉢의 윗면은 다른 극입니다.\n[자료 검토] 같은 고리·개수·받침을 쓰고 비자성 막대가 옆 움직임을 제한하는 탑입니다. 떠 있는 고리만 보고 가이드 없는 안정한 공중 부양을 주장하지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o3-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 13,
      "page": 3,
      "sourceId": "sci-41-1-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물에 띄운 막대자석의 N극 방향",
      "concept": "물에 띄운 막대자석이 멈추면 N극은 북쪽, S극은 남쪽을 가리킨다."
    },
    "prompt": "막대자석의 N극이 가리키는 방향으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "[13~14] 다음과 같이 물이 담긴 수조에 막대자석을 올려놓은 접시를 띄운 후 접시의 움직임이 멈추었을 때 막대자석의 극이 가리키는 방향을 관찰하였습니다. 물음에 답하시오."
    },
    "choices": [
      "동쪽",
      "서쪽",
      "남쪽",
      "북쪽",
      "북서쪽"
    ],
    "figure": "assets/bank/s41-u01/s3-q13.webp",
    "figureNote": "물이 담긴 둥근 수조 가장자리에 북·동·남·서가 적혀 있고, 가운데 띄운 접시 위에 막대자석(N극 빨강, S극 파랑)이 놓여 있다. 그림에서 N극은 왼쪽 위(북서쪽)로 기울어져 있다.",
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
    "explanation": "물에 띄운 막대자석의 움직임이 멈추었을 때 막대자석의 N극은 북쪽을 가리키고, S극은 남쪽을 가리킵니다.\n[자료 검토] 다른 자석·쇠붙이를 멀리하고 수평으로 자유롭게 돌아 멈추는 조건입니다. 기울어진 그림은 실제 멈춘 방향의 측정값으로 쓰지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "그림 속 막대자석의 N극은 북서쪽(왼쪽 위)으로 기울어 그려져 있으나 정답은 ④ 북쪽(움직임이 멈춘 뒤의 방향을 묻는 것으로 보임)."
    }
  },
  {
    "id": "s41-u01-o3-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 14,
      "page": 4,
      "sourceId": "sci-41-1-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물에 띄운 자석 실험의 해석",
      "concept": "자석은 모양과 관계없이 자유롭게 움직이면 항상 북쪽과 남쪽을 가리키고, 돌려 놓아도 다시 그 방향으로 돌아간다."
    },
    "prompt": "위 실험에 대한 설명으로 알맞지 않은 것은 두 가지 고르시오.",
    "givens": {
      "지문": "[13~14] 다음과 같이 물이 담긴 수조에 막대자석을 올려놓은 접시를 띄운 후 접시의 움직임이 멈추었을 때 막대자석의 극이 가리키는 방향을 관찰하였습니다. 물음에 답하시오."
    },
    "choices": [
      "물에 띄운 자석의 S극은 남쪽을 가리킨다.",
      "자석을 물에 띄우면 항상 일정한 방향을 가리킨다.",
      "물에 띄운 자석과 공중에 매단 자석은 같은 방향을 가리킨다.",
      "접시 위에 막대자석 대신 둥근기둥 모양 자석을 올려놓고 실험하면 결과가 달라진다.",
      "막대자석의 N극이 가리키는 방향을 동쪽으로 돌리면 막대자석은 더 이상 움직이지 않는다."
    ],
    "figure": "assets/bank/s41-u01/s3-q13.webp",
    "figureNote": "물이 담긴 둥근 수조 가장자리에 북·동·남·서가 적혀 있고, 가운데 띄운 접시 위에 막대자석(N극 빨강, S극 파랑)이 놓여 있다. 그림에서 N극은 왼쪽 위(북서쪽)로 기울어져 있다.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        3,
        4
      ]
    },
    "explanation": "물에 띄운 자석과 공중에 매단 자석은 모두 북쪽과 남쪽을 가리키는데, N극은 북쪽, S극은 남쪽을 가리킵니다. 접시 위에 막대자석 대신 둥근기둥 모양 자석을 올려놓아도 자석이 가리키는 방향은 달라지지 않으며, 접시를 돌려 자석의 방향을 다른 방향으로 돌리더라도 자석은 다시 북쪽과 남쪽을 가리키는 방향으로 되돌아갑니다.\n[자료 검토] 다른 자석·쇠붙이를 멀리하고 수평으로 자유롭게 돌아 멈추는 조건입니다. 기울어진 그림은 실제 멈춘 방향의 측정값으로 쓰지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄이 그어져 있음. 그림은 앞쪽(3쪽) [13~14] 공통 그림."
    }
  },
  {
    "id": "s41-u01-o3-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 15,
      "page": 4,
      "sourceId": "sci-41-1-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "나침반 바늘의 성질",
      "concept": "나침반 바늘은 자석이어서 항상 북쪽과 남쪽을 가리킨다."
    },
    "prompt": "다음은 나침반에 대한 설명입니다. ㉠, ㉡에 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "나침반 바늘은 [ ㉠ ](으)로 되어 있어 항상 북쪽과 [ ㉡ ]쪽을 가리킵니다.",
      "답란": "㉠ (     ), ㉡ (     )"
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 자석, ㉡ 남",
      "accepted": [
        "㉠ 자석, ㉡ 남",
        "자석, 남",
        "㉠-자석, ㉡-남",
        "자석, 남쪽"
      ]
    },
    "explanation": "나침반은 자석이 항상 북쪽과 남쪽을 가리키는 성질을 이용하여 방향을 찾을 수 있도록 만든 도구입니다. 나침반 바늘은 자석으로 되어 있어 항상 북쪽과 남쪽을 가리킵니다.\n[자료 검토] 다른 자석·쇠붙이를 멀리하고 수평으로 자유롭게 돌아 멈추는 조건입니다. 기울어진 그림은 실제 멈춘 방향의 측정값으로 쓰지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문의 ㉠·㉡은 네모 칸 안에 인쇄됨."
    }
  },
  {
    "id": "s41-u01-o3-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 16,
      "page": 4,
      "sourceId": "sci-41-1-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "나침반으로 막대자석의 극 알아내기",
      "concept": "나침반 바늘의 S극이 끌려가 가리키는 자석의 끝은 다른 극인 N극이다."
    },
    "prompt": "다음은 나침반에 색종이로 감싸 극을 알 수 없는 막대자석을 가까이 한 모습입니다. 막대자석의 ㉠은 N극과 S극 중에서 무엇인지 쓰시오.",
    "givens": {
      "답란": "(     )극"
    },
    "choices": null,
    "figure": "assets/bank/s41-u01/s3-q16.webp",
    "figureNote": "왼쪽 나침반(북·동·남·서 표시)의 바늘이 가로로 놓여 파란색 S극 끝이 오른쪽의 노란 색종이로 감싼 막대자석 ㉠ 끝을 가리키고, 빨간색 N극은 왼쪽을 향한다.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "N극",
      "accepted": [
        "N극",
        "N",
        "n극",
        "엔극"
      ]
    },
    "explanation": "자석을 같은 극끼리 가까이 하면 서로 밀어 내는 힘이 작용하고, 다른 극끼리 가까이 하면 서로 끌어당기는 힘이 작용합니다. 자석인 나침반 바늘의 S극(파란색)이 막대자석을 가리키고 있다는 것을 통해 ㉠의 극이 나침반 바늘과 다른 N극이라는 것을 알 수 있습니다.\n[자료 검토] 가까운 막대자석의 영향이 큰 설명 그림으로 해석합니다. 실제 바늘 각도는 주변 조건을 확인해 관찰하며 인쇄 방위 글자의 회전과 구별합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o3-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 17,
      "page": 4,
      "sourceId": "sci-41-1-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T12",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "막대자석 주위 나침반 바늘의 방향",
      "concept": "나침반 바늘도 자석이므로 가까이 있는 자석과 밀거나 끌어당기는 힘을 주고받아 가리키는 방향이 바뀐다."
    },
    "prompt": "막대자석 주위에 나침반을 놓으면 나침반 바늘이 가리키는 방향이 달라지는 까닭을 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s41-u01/s3-q17.webp",
    "figureNote": "가운데 막대자석(N 빨강, S 파랑) 둘레에 나침반 6개가 놓여 있고, 바늘이 위치에 따라 서로 다른 방향을 가리킨다.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "나침반 바늘이 자석이기 때문에 나침반 바늘과 막대자석 사이에 밀어 내거나 끌어당기는 힘이 작용하기 때문이다.",
      "rubric": {
        "required": [
          "바늘과 막대자석 사이의 밀거나 당기는 힘을 설명한다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "나침반 바늘과 막대자석 사이에 밀어 내거나 끌어당기는 힘이 작용하기 때문이라는 내용이 포함되어 있으면 정답으로 합니다."
        ]
      }
    },
    "explanation": "나침반 바늘이 자석이기 때문에 자석을 가까이 하면 가까이 한 자석의 극 종류에 따라 나침반 바늘이 가리키는 방향이 달라집니다. 나침반 바늘에 자석을 가까이 할 때 같은 극끼리는 서로 밀어 내고, 다른 극끼리는 서로 끌어당깁니다.\n[채점 기준] 나침반 바늘과 막대자석 사이에 밀어 내거나 끌어당기는 힘이 작용하기 때문이라는 내용이 포함되어 있으면 정답으로 합니다.\n[자료 검토] 가까운 막대자석의 영향이 큰 설명 그림으로 해석합니다. 실제 바늘 각도는 주변 조건을 확인해 관찰하며 인쇄 방위 글자의 회전과 구별합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준에 비율 표기 없음(단일 기준). 답란은 밑줄 두 줄."
    }
  },
  {
    "id": "s41-u01-o3-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 18,
      "page": 4,
      "sourceId": "sci-41-1-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "자석 필통의 편리한 점",
      "concept": "자석 필통은 입구의 자석 덕분에 쉽게 열고 닫을 수 있다."
    },
    "prompt": "자석 필통에 자석이 있어서 편리한 점으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "일반 필통보다 가볍다.",
      "필통을 예쁘게 꾸밀 수 있다.",
      "필통을 쉽게 열고 닫을 수 있다.",
      "필통에 많은 연필을 넣을 수 있다.",
      "필통 속 물체를 쉽게 찾을 수 있다."
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
    "explanation": "자석 필통은 필통의 입구에 자석이 있어 필통을 쉽게 열고 닫을 수 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o3-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 19,
      "page": 4,
      "sourceId": "sci-41-1-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "냉장고 자석에 이용한 성질",
      "concept": "냉장고 자석은 자석이 철로 만든 물체를 끌어당기는 성질을 이용한다."
    },
    "prompt": "냉장고 자석으로 냉장고에 메모지를 쉽게 붙일 수 있습니다. <보기>에서 냉장고 자석에서 이용하는 자석의 성질로 알맞은 것을 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 철로 만든 물체를 밀어 내는 성질",
        "㉡ 철로 만든 물체를 끌어당기는 성질",
        "㉢ 자석의 같은 극끼리 서로 밀어 내는 성질",
        "㉣ 자석의 같은 극끼리 서로 끌어당기는 성질"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s41-u01/s3-q19.webp",
    "figureNote": "냉장고 문에 색깔 있는 둥근 냉장고 자석들로 메모지 여러 장을 붙여 둔 사진.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉡",
      "accepted": [
        "㉡",
        "ㄴ",
        "철로 만든 물체를 끌어당기는 성질"
      ]
    },
    "explanation": "자석이 철로 만든 물체를 끌어당기는 성질을 이용해 냉장고 문에 메모지를 붙일 수 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o3-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 20,
      "page": 5,
      "sourceId": "sci-41-1-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "생활 속 자석의 이용",
      "concept": "자석을 이용한 장치는 생활을 편리하게 하며, 일정한 방향을 가리키는 성질은 나침반에 이용된다."
    },
    "prompt": "다음 <보기>에서 자석의 이용에 대한 설명으로 알맞지 않은 것을 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 자석을 이용한 다양한 장치는 우리의 생활을 편리하게 한다.",
        "㉡ 냉장고 문에 있는 자석 때문에 냉장고 문을 쉽게 닫을 수 있다.",
        "㉢ 자석이 일정한 방향을 가리키는 성질은 우리 생활에서 이용하지 않는다."
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
        "자석이 일정한 방향을 가리키는 성질은 우리 생활에서 이용하지 않는다."
      ]
    },
    "explanation": "우리는 생활에서 다양한 곳에 자석을 이용하고 있으며, 자석을 이용한 장치는 우리의 생활을 편리하게 해 줍니다. 자석이 일정한 방향을 가리키는 성질을 이용한 나침반 등을 통해 우리는 쉽게 방향을 찾을 수 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄이 그어져 있음."
    }
  },
  {
    "id": "s41-u01-o4-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 1,
      "page": 1,
      "sourceId": "sci-41-1-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "자석에 붙는 물체와 붙지 않는 물체 분류",
      "concept": "자석에는 철로 만든 물체만 붙고 유리로 만든 물체는 붙지 않는다."
    },
    "prompt": "다음은 자석에 붙는 물체와 자석에 붙지 않는 물체를 분류한 것입니다. 잘못 분류한 물체의 이름을 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s41-u01/s4-q01.webp",
    "figureNote": "두 칸 분류표(자석에 붙는 물체 / 자석에 붙지 않는 물체). 표 내용은 givens에 옮김.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "유리구슬",
      "accepted": [
        "유리구슬",
        "유리 구슬"
      ]
    },
    "explanation": "철로 만든 물체는 자석에 붙고, 종이, 고무, 나무, 유리로 만든 물체는 자석에 붙지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '잘못'에 밑줄이 있음."
    }
  },
  {
    "id": "s41-u01-o4-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 2,
      "page": 1,
      "sourceId": "sci-41-1-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "자석에 붙는 물체의 공통점",
      "concept": "자석에 붙는 물체들은 모두 철로 만들어졌다는 공통점이 있다."
    },
    "prompt": "자석에 붙는 물체의 공통점으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "색깔이 없다.",
      "크기가 작다.",
      "모양이 길쭉하다.",
      "만지면 부드럽다.",
      "철로 만들어졌다."
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
    "explanation": "물체를 이루는 물질의 종류에 따라 자석에 붙는 물체도 있고, 붙지 않는 물체도 있습니다. 자석에 붙는 물체는 철로 만들어졌다는 공통점을 가지고 있습니다.\n[자료 검토] 문항에 제시한 재료·시료의 비교입니다. 모든 금속이 붙는다는 뜻이 아니며 실제 시료를 확인합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o4-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 3,
      "page": 1,
      "sourceId": "sci-41-1-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물체에서 자석에 붙지 않는 부분 찾기",
      "concept": "한 물체라도 철로 된 부분은 자석에 붙고 플라스틱으로 된 부분은 붙지 않는다."
    },
    "prompt": "다음 <보기>에서 자석에 붙지 않는 부분을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 철로 만들어진 가위의 날 부분",
        "㉡ 철로 만들어진 책상의 다리 부분",
        "㉢ 플라스틱으로 만들어진 가위의 손잡이 부분"
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
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "가위의 날 부분과, 책상의 다리 부분은 철로 만들어졌기 때문에 자석에 붙지만, 가위의 손잡이 부분은 플라스틱으로 만들어졌기 때문에 자석에 붙지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않는'에 밑줄이 있음."
    }
  },
  {
    "id": "s41-u01-o4-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 4,
      "page": 1,
      "sourceId": "sci-41-1-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "자석과 철로 된 물체 사이의 힘",
      "concept": "자석과 철로 된 물체는 떨어져 있거나 사이에 다른 물체가 있어도 서로 끌어당긴다."
    },
    "prompt": "다음 <보기>에서 자석과 자석에 붙는 물체 사이에 작용하는 힘에 대한 알맞은 설명을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 자석과 자석에 붙는 물체는 약간 떨어져 있어도 서로 끌어당긴다.",
        "㉡ 자석과 자석에 붙는 물체 사이에는 서로 끌어당기는 힘이 작용한다.",
        "㉢ 자석과 자석에 붙는 물체 사이에 종이판이 있으면 자석과 자석에 붙는 물체는 서로 밀어 낸다."
      ]
    },
    "choices": [
      "㉠",
      "㉢",
      "㉠, ㉡",
      "㉠, ㉢",
      "㉡, ㉢"
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
    "explanation": "자석과 자석에 붙는 물체 사이에 자석에 붙지 않는 다른 물체가 있어도 자석과 자석에 붙는 물체는 서로 끌어당깁니다.\n[자료 검토] 가까운 거리와 얇은 사이 판의 교구 조건입니다. 두께·거리·고정 조건을 달리해도 반드시 붙는다는 뜻은 아닙니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o4-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 5,
      "page": 1,
      "sourceId": "sci-41-1-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T04",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "자석을 이용해 물속 철 클립 꺼내기",
      "concept": "자석은 컵 벽이나 물을 사이에 두고도 철 클립을 끌어당기므로 이를 이용해 클립을 꺼낼 수 있다."
    },
    "prompt": "물이 든 컵 속에 철 클립이 빠져 있습니다. 가방 속에 들어 있는 물체를 이용해 물을 쏟지 않고 철 클립을 꺼내는 방법을 쓰시오.",
    "givens": {
      "가방 속 물체": "교과서, 실, 지우개, 종이컵, 막대자석"
    },
    "choices": null,
    "figure": "assets/bank/s41-u01/s4-q05.webp",
    "figureNote": "물이 든 손잡이 컵 바닥에 철 클립이 가라앉아 있는 그림('철 클립' 이름표).",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "예) 막대자석을 컵의 옆면에 가까이하여 철 클립을 붙인 뒤 위쪽으로 막대자석을 이동시켜 철 클립을 꺼낸다. / 실에 묶은 막대자석을 물속에 넣어 철 클립을 막대자석에 붙인 뒤 꺼낸다.",
      "rubric": {
        "required": [
          "자석과 철 클립 사이의 힘으로 클립을 꺼낸다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "철 클립과 막대자석 사이에 작용하는 힘을 이용해 철 클립을 꺼낸다는 내용이 포함되어 있으면 정답으로 합니다."
        ]
      }
    },
    "explanation": "자석과 철로 된 물체 사이에는 서로 끌어당기는 힘이 작용하며, 두 물체 사이에 자석에 붙지 않는 다른 물체가 있어도 두 물체는 서로 끌어당깁니다. 자석과 철로 된 물체가 서로 끌어당기는 힘을 이용하면 물을 쏟지 않고 철 클립을 꺼낼 수 있습니다.\n[채점 기준] 철 클립과 막대자석 사이에 작용하는 힘을 이용해 철 클립을 꺼낸다는 내용이 포함되어 있으면 정답으로 합니다.\n[자료 검토] 교사가 준비한 얕은 안전한 물통의 자료입니다. 학생이 큰 수조에 손을 넣거나 위험하게 기구를 다루는 활동을 요구하지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "가방 속 물체 상자의 제목은 '<가방 속 물체>'. 채점 기준은 한 줄 기준만 있고 비율 표기가 없어 ratio를 100%로 둠."
    }
  },
  {
    "id": "s41-u01-o4-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 6,
      "page": 2,
      "sourceId": "sci-41-1-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "막대자석에서 철 조각이 많이 붙는 부분",
      "concept": "막대자석은 양쪽 끝부분에 철로 된 물체가 가장 많이 붙는다."
    },
    "prompt": "다음 <보기>에서 위 실험의 결과 빵 끈 조각이 가장 많이 붙는 부분을 골라 기호를 쓰시오.",
    "givens": {
      "지문": "[06~07] 막대자석을 빵 끈 조각이 든 종이 그릇에 넣었다가 천천히 들어 올려 보았습니다. 물음에 답하시오.",
      "보기": [
        "㉠ 막대자석의 모든 부분",
        "㉡ 막대자석의 가운데 부분",
        "㉢ 막대자석의 양쪽 끝부분"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s41-u01/s4-q06.webp",
    "figureNote": "빵 끈 조각이 가득 든 접시에 막대자석(S극 파랑, N극 빨강)을 손으로 넣었다가 들어 올리는 모습. '막대자석' 이름표가 있다.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉢",
      "accepted": [
        "㉢",
        "ㄷ",
        "막대자석의 양쪽 끝부분"
      ]
    },
    "explanation": "막대자석의 양쪽 끝부분에 빵 끈 조각이 가장 많이 붙습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o4-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 7,
      "page": 2,
      "sourceId": "sci-41-1-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "자석의 극",
      "concept": "자석에서 철로 된 물체가 많이 붙는 부분을 자석의 극이라 하며 막대자석은 양쪽 끝에 있다."
    },
    "prompt": "위 실험을 통해 알 수 있는 내용으로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "[06~07] 막대자석을 빵 끈 조각이 든 종이 그릇에 넣었다가 천천히 들어 올려 보았습니다. 물음에 답하시오."
    },
    "choices": [
      "자석은 모든 물체를 끌어당긴다.",
      "자석에는 빵 끈 조각이 붙지 않는다.",
      "자석에는 철로 된 물체가 많이 붙는 부분이 있다.",
      "자석의 가운데 부분에 유리로 된 물체가 잘 붙는다.",
      "자석은 모든 부분에 철로 된 물체가 많이 붙지 않는다."
    ],
    "figure": "assets/bank/s41-u01/s4-q06.webp",
    "figureNote": "빵 끈 조각이 가득 든 접시에 막대자석(S극 파랑, N극 빨강)을 손으로 넣었다가 들어 올리는 모습. '막대자석' 이름표가 있다.",
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
    "explanation": "자석에는 철로 된 물체가 많이 붙는 부분이 있는데, 이를 자석의 극이라고 합니다. 막대자석의 극은 양쪽 끝부분에 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "⑤의 '않는 다.'는 줄바꿈으로 '않는'과 '다.'가 나뉘어 인쇄됨."
    }
  },
  {
    "id": "s41-u01-o4-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 8,
      "page": 2,
      "sourceId": "sci-41-1-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "자석의 극의 성질",
      "concept": "자석은 모양과 관계없이 극이 두 개이며 반으로 쪼개도 각 조각이 두 극을 가진다."
    },
    "prompt": "자석의 극에 대한 설명으로 알맞지 않은 것을 두 가지 고르시오.",
    "givens": null,
    "choices": [
      "모든 자석의 극은 두 개이다.",
      "자석은 모양에 따라 극의 개수가 다르다.",
      "자석의 극에는 철로 된 물체가 많이 붙는다.",
      "자석을 반으로 쪼개면 자석의 극이 사라진다.",
      "철로 된 물체를 이용해 자석의 극을 찾을 수 있다."
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
    "explanation": "자석의 극은 항상 두 개입니다. 자석을 반으로 쪼개면 쪼개진 조각들이 각각 두 개의 극을 가지는 자석이 됩니다.\n[자료 검토] 그림의 N/S 두 극 교구를 대상으로 한 설명입니다. 모양·색만으로 모든 제품의 극 배치를 판단하지 않습니다. 자석을 실제로 자르거나 깨뜨리는 활동은 하지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄이 있음."
    }
  },
  {
    "id": "s41-u01-o4-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 9,
      "page": 2,
      "sourceId": "sci-41-1-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "고리 자석의 극",
      "concept": "가운데 구멍이 뚫린 고리 자석도 극이 두 개이며 윗면과 아랫면에 있다."
    },
    "prompt": "다음과 같은 자석에 대한 설명으로 알맞은 것을 두 가지 고르시오.",
    "givens": null,
    "choices": [
      "고리 자석이다.",
      "동전 모양 자석이다.",
      "자석의 극은 한 개이다.",
      "철로 된 물체가 많이 붙는 부분은 한 군데이다.",
      "철로 된 물체가 많이 붙는 부분은 두 군데이다."
    ],
    "figure": "assets/bank/s41-u01/s4-q09.webp",
    "figureNote": "가운데 구멍이 뚫린 여러 색의 고리 자석 6개.",
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
    "explanation": "가운데 구멍이 뚫려 있는 고리 자석의 모습입니다. 모든 자석은 두 개의 극을 가지고 있으며, 고리 자석의 극은 윗면과 아랫면에 있습니다.\n[자료 검토] 그림의 N/S 두 극 교구를 대상으로 한 설명입니다. 모양·색만으로 모든 제품의 극 배치를 판단하지 않습니다. 자석을 실제로 자르거나 깨뜨리는 활동은 하지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o4-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 10,
      "page": 2,
      "sourceId": "sci-41-1-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "같은 극끼리 마주 보게 했을 때",
      "concept": "막대자석의 같은 극끼리 가까이 하면 서로 밀어 낸다."
    },
    "prompt": "다음과 같이 막대자석 두 개를 마주 보게 하여 가까이 가져갔을 때 나타나는 현상으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "아무 변화가 없다.",
      "자석이 서로 밀어 낸다.",
      "자석이 서로 끌어당긴다.",
      "자석이 서로 밀어 냈다가 끌어당긴다.",
      "자석이 서로 끌어당겼다가 밀어 낸다."
    ],
    "figure": "assets/bank/s41-u01/s4-q10.webp",
    "figureNote": "두 손에 막대자석을 하나씩 들고 N극끼리 마주 보게 한 그림(왼쪽 S-N, 오른쪽 N-S).",
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
    "explanation": "막대자석의 같은 극끼리 마주 보게 하여 가까이 가져가면 자석이 서로 밀어 냅니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o4-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 11,
      "page": 3,
      "sourceId": "sci-41-1-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "다른 자석으로 극 찾기",
      "concept": "N극에 끌려오는 극은 S극이고 N극에 밀리는 극은 N극이다."
    },
    "prompt": "다음은 색종이로 감싼 막대자석의 극을 찾는 방법입니다. ㉠, ㉡에 들어갈 알맞은 말을 골라 쓰시오.",
    "givens": {
      "지문": "색종이로 감싼 막대자석의 한쪽 극을 다른 막대자석의 N극에 가까이 할 때 서로 끌어당기면 색종이로 감싼 막대자석의 극이 ㉠ ( N, S )극이고, 서로 밀어 내면 색종이로 감싼 막대자석의 극이 ㉡ ( N, S )극입니다."
    },
    "choices": null,
    "figure": "assets/bank/s41-u01/s4-q11.webp",
    "figureNote": "N극·S극이 표시된 막대자석의 N극 쪽으로 손에 든 노란 색종이로 감싼 막대자석을 가까이 가져가는 그림(화살표).",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ S, ㉡ N",
      "accepted": [
        "㉠ S, ㉡ N",
        "㉠S, ㉡N",
        "ㄱ S, ㄴ N",
        "S, N",
        "S극, N극",
        "㉠ S극, ㉡ N극"
      ]
    },
    "explanation": "자석의 같은 극끼리는 서로 밀어 내고, 다른 극끼리는 서로 끌어당깁니다. 다른 막대자석의 N극에 가까이 할 때 끌어당기면 S극, 밀어 내면 N극입니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o4-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 12,
      "page": 3,
      "sourceId": "sci-41-1-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T09",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "고리 자석 탑 높게 쌓기",
      "concept": "고리 자석을 같은 극끼리 마주 보게 끼우면 서로 밀어 내어 떠 있으므로 탑이 높아진다."
    },
    "prompt": "다음은 고리 자석으로 가장 낮은 탑을 쌓은 모습입니다. 고리 자석 탑을 가장 높은 탑으로 바꾸는 방법을 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s41-u01/s4-q12.webp",
    "figureNote": "받침대 막대에 고리 자석 5개가 빈틈없이 붙어 쌓여 있는 낮은 탑.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "자석은 같은 극끼리 서로 밀어 내므로 고리 자석의 같은 극끼리 마주 보게 하여 탑을 쌓으면 가장 높은 탑을 쌓을 수 있다.",
      "rubric": {
        "required": [
          "같은 극끼리 밀어 내는 성질로 탑을 쌓는다"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "같은 극끼리 서로 밀어 내는 성질을 이용하여 탑을 쌓는다는 내용이 포함되어 있으면 정답으로 합니다."
        ]
      }
    },
    "explanation": "고리 자석을 같은 극끼리 마주 보게 쌓으면 같은 극끼리 밀어 내는 자석의 성질에 의해 고리 자석 탑을 가장 높게 쌓을 수 있습니다.\n[채점 기준] 같은 극끼리 서로 밀어 내는 성질을 이용하여 탑을 쌓는다는 내용이 포함되어 있으면 정답으로 합니다.\n[자료 검토] 같은 고리·개수·받침을 쓰고 비자성 막대가 옆 움직임을 제한하는 탑입니다. 떠 있는 고리만 보고 가이드 없는 안정한 공중 부양을 주장하지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준은 한 줄 기준만 있고 비율 표기가 없어 ratio를 100%로 둠."
    }
  },
  {
    "id": "s41-u01-o4-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 13,
      "page": 3,
      "sourceId": "sci-41-1-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물에 띄운 자석이 가리키는 방향",
      "concept": "물에 띄운 자석은 움직임이 멈추면 항상 북쪽과 남쪽을 가리킨다."
    },
    "prompt": "다음과 같이 막대자석을 올려놓은 접시를 물에 띄워 놓고 막대자석의 움직임을 관찰하였습니다. 이 실험의 결과로 알 수 있는 내용으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "자석은 물에 띄울 수 없다.",
      "자석은 물에 쉽게 가라앉는다.",
      "자석을 물에 띄우면 멈추지 않고 움직인다.",
      "자석을 물에 띄우면 극의 개수가 달라진다.",
      "물에 띄운 자석은 항상 일정한 방향을 가리킨다."
    ],
    "figure": "assets/bank/s41-u01/s4-q13.webp",
    "figureNote": "물이 든 수조(북·남·동·서 표시) 위에 띄운 접시에 막대자석이 놓인 모습을 위에서 본 그림.",
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
    "explanation": "자석을 물에 띄우고 움직임이 멈추었을 때 자석의 극이 가리키는 방향을 관찰하면 항상 북쪽과 남쪽인 것을 알 수 있습니다.\n[자료 검토] 다른 자석·쇠붙이를 멀리하고 수평으로 자유롭게 돌아 멈추는 조건입니다. 기울어진 그림은 실제 멈춘 방향의 측정값으로 쓰지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o4-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 14,
      "page": 3,
      "sourceId": "sci-41-1-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "N극과 S극의 이름",
      "concept": "북쪽을 가리키는 자석의 극은 N극, 남쪽을 가리키는 극은 S극이다."
    },
    "prompt": "다음은 물에 띄운 자석의 두 극이 가리키는 방향에 대한 설명입니다. ㉠, ㉡에 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "북쪽을 가리키는 자석의 극을 [ ㉠ ]극 이라고 하고, 남쪽을 가리키는 자석의 극을 [ ㉡ ]극이라고 합니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ N, ㉡ S",
      "accepted": [
        "㉠ N, ㉡ S",
        "㉠N, ㉡S",
        "ㄱ N, ㄴ S",
        "N, S",
        "N극, S극",
        "㉠ N극, ㉡ S극"
      ]
    },
    "explanation": "자석을 물에 띄우면 항상 두 극은 북쪽과 남쪽을 가리킵니다. 이때 북쪽을 가리키는 자석의 극을 N극이라고 하고, 남쪽을 가리키는 자석의 극을 S극이라고 합니다.\n[자료 검토] 다른 자석·쇠붙이를 멀리하고 수평으로 자유롭게 돌아 멈추는 조건입니다. 기울어진 그림은 실제 멈춘 방향의 측정값으로 쓰지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "㉠, ㉡은 네모 빈칸 안에 인쇄됨. 첫 빈칸 뒤는 '극 이라고'(띄어 씀), 둘째는 '극이라고'로 인쇄됨."
    }
  },
  {
    "id": "s41-u01-o4-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 15,
      "page": 3,
      "sourceId": "sci-41-1-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "공중에 매단 자석이 가리키는 방향",
      "concept": "공중에 매단 자석도 물에 띄운 자석처럼 북쪽과 남쪽을 가리킨다."
    },
    "prompt": "공중에 매달은 막대자석을 관찰했을 때 알 수 있는 내용으로 알맞은 것을 두 가지 고르시오.",
    "givens": null,
    "choices": [
      "자석은 시계 방향으로 움직인다.",
      "자석은 동쪽과 서쪽을 가리킨다.",
      "자석은 남쪽과 북쪽을 가리킨다.",
      "자석은 나침반의 방향과 다른 방향을 가리킨다.",
      "자석을 물에 띄웠을 때와 같은 방향을 가리킨다."
    ],
    "figure": "assets/bank/s41-u01/s4-q15.webp",
    "figureNote": "비커 위에 걸친 막대에 실로 매단 막대자석(N·S 표시).",
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
    "explanation": "자석을 물에 띄우거나 공중에 매달아 보았을 때 자석은 항상 북쪽과 남쪽을 가리킵니다.\n[자료 검토] 다른 자석·쇠붙이를 멀리하고 수평으로 자유롭게 돌아 멈추는 조건입니다. 기울어진 그림은 실제 멈춘 방향의 측정값으로 쓰지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o4-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 16,
      "page": 4,
      "sourceId": "sci-41-1-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "자석을 가까이 할 때 나침반 바늘",
      "concept": "나침반 바늘도 자석이므로 막대자석의 N극을 가까이 하면 바늘의 S극이 그쪽으로 끌려간다."
    },
    "prompt": "다음과 같이 나침반에 막대자석의 N극을 가져갈 때 나침반 바늘의 움직임으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "나침반 바늘이 움직이지 않는다.",
      "나침반 바늘이 시계 방향으로 계속 돌아간다.",
      "나침반 바늘의 S극이 자석의 N극을 가리킨다.",
      "나침반 바늘이 시계 반대 방향으로 계속 돌아간다.",
      "나침반 바늘이 한 바퀴 돌아 원래 가리키던 방향을 가리킨다."
    ],
    "figure": "assets/bank/s41-u01/s4-q16.webp",
    "figureNote": "북쪽을 가리키는 나침반의 동쪽에서 막대자석의 N극을 화살표 방향으로 가까이 가져가는 그림.",
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
    "explanation": "나침반 바늘은 자석이기 때문에 막대자석의 N극을 가까이 가져가면 나침반 바늘의 S극이 막대자석의 N극 쪽을 가리킵니다.\n[자료 검토] 가까운 막대자석의 영향이 큰 설명 그림으로 해석합니다. 실제 바늘 각도는 주변 조건을 확인해 관찰하며 인쇄 방위 글자의 회전과 구별합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o4-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 17,
      "page": 4,
      "sourceId": "sci-41-1-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "막대자석 주위 나침반 바늘의 방향",
      "concept": "막대자석 주위의 나침반 바늘은 N극 쪽에는 바늘의 S극이, S극 쪽에는 바늘의 N극이 향한다."
    },
    "prompt": "다음은 막대자석 주위에 놓인 나침반의 모습입니다. 나침반 바늘이 가리키는 모습이 알맞지 않은 것을 골라 기호를 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s41-u01/s4-q17.webp",
    "figureNote": "가운데 막대자석(왼쪽 N, 오른쪽 S) 주위 네 곳(㉠ 왼쪽 위, ㉡ 오른쪽 위, ㉢ 왼쪽 아래, ㉣ 오른쪽 아래)에 놓인 나침반. 바늘 빨간 쪽(N)이 ㉠은 위쪽, ㉡은 아래 왼쪽, ㉢은 아래 왼쪽, ㉣은 아래 오른쪽을 향함.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉣",
      "accepted": [
        "㉣",
        "ㄹ"
      ]
    },
    "explanation": "나침반 바늘도 자석이기 때문에 막대자석의 N극은 나침반 바늘의 S극을, 막대자석의 S극은 나침반 바늘의 N극을 끌어당깁니다.\n[자료 검토] 가까운 막대자석의 영향이 큰 설명 그림으로 해석합니다. 실제 바늘 각도는 주변 조건을 확인해 관찰하며 인쇄 방위 글자의 회전과 구별합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄이 있음. 정답 기호는 동그라미 ㄹ로 인쇄됨."
    }
  },
  {
    "id": "s41-u01-o4-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 18,
      "page": 4,
      "sourceId": "sci-41-1-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "나침반 바늘 방향이 바뀌는 까닭",
      "concept": "나침반 바늘은 자석이어서 주위 자석과 밀고 당기는 힘을 주고받아 방향이 바뀐다."
    },
    "prompt": "자석 주위에 나침반을 놓았을 때 나침반 바늘의 가리키는 방향이 달라지는 까닭으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "나침반 바늘이 자석이기 때문이다.",
      "나침반 바늘이 고무로 만들어졌기 때문이다.",
      "자석은 나침반 바늘을 항상 밀어 내기 때문이다.",
      "자석은 나침반 바늘을 항상 끌어당기기 때문이다.",
      "나침반 바늘은 자석의 영향을 받지 않기 때문이다."
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
    "explanation": "나침반 바늘이 자석이기 때문에 나침반을 자석 주위에 놓으면 자석과 나침반 바늘이 서로 밀어 내거나 끌어당기면서 나침반 바늘의 가리키는 방향이 달라집니다.\n[자료 검토] 가까운 막대자석의 영향이 큰 설명 그림으로 해석합니다. 실제 바늘 각도는 주변 조건을 확인해 관찰하며 인쇄 방위 글자의 회전과 구별합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  },
  {
    "id": "s41-u01-o4-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 19,
      "page": 4,
      "sourceId": "sci-41-1-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "생활 속 자석 이용(드라이버)",
      "concept": "드라이버 끝을 자석으로 만들면 철로 된 나사를 끌어당겨 고정할 수 있다."
    },
    "prompt": "다음 빈칸에 들어갈 알맞은 말을 <보기>에서 골라 쓰시오.",
    "givens": {
      "지문": "드라이버의 끝부분을 [ ](으)로 만들면 철로 된 나사를 쉽게 고정할 수 있습니다.",
      "보기": [
        "종이",
        "자석",
        "나무",
        "플라스틱"
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
      "answer": "자석",
      "accepted": [
        "자석"
      ]
    },
    "explanation": "철로 된 물체를 끌어당기는 자석의 성질을 이용해 드라이버의 끝부분을 자석으로 만들면 철로 된 나사를 쉽게 고정할 수 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>는 2열(종이·자석 / 나무·플라스틱)로 인쇄됨; 행 순서대로 옮김."
    }
  },
  {
    "id": "s41-u01-o4-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 20,
      "page": 4,
      "sourceId": "sci-41-1-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 4-1",
      "unit": "Ⅰ. 자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "생활에서 이용하는 자석의 성질",
      "concept": "생활 속 자석은 철을 끌어당기는 성질과 일정한 방향을 가리키는 성질 등을 이용한다."
    },
    "prompt": "우리 생활에서 이용하는 자석의 성질로 알맞은 것을 두 가지 고르시오.",
    "givens": null,
    "choices": [
      "철로 만든 물체를 끌어당기는 성질",
      "유리로 만든 물체를 밀어 내는 성질",
      "자석이 일정한 방향을 가리키는 성질",
      "자석의 다른 극끼리 서로 밀어 내는 성질",
      "자석의 같은 극끼리 서로 끌어당기는 성질"
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
    "explanation": "우리 생활에서 이용하는 자석의 성질에는 철로 만든 물체를 끌어당기는 성질, 일정한 방향을 가리키는 성질, 자석의 같은 극끼리는 서로 밀어 내고 다른 극끼리는 서로 끌어당기는 성질 등이 있습니다. 자석은 유리로 만든 물체를 밀어 내거나 끌어당기지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "해설 PDF에서 20번 풀이가 2쪽 오른쪽 단 맨 위로 넘어가 있음."
    }
  }
];
