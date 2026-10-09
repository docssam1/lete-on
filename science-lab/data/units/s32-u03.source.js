// 3-2 Ⅲ 지표의 변화 — 단원평가 원문 70문항(시매쓰DMC 최다빈출 단원평가 세트1·2·3·4). 시험지를 그대로 옮기고 정답 및 풀이와 대조했다.
// 원장 지시(2026-10-09): 원문을 그대로 문제은행에 쓴다. 그림은 시험지에서 잘라 낸 것(assets/bank/s32-u03/).
export const source = [
  {
    "id": "s32-u03-o1-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 1,
      "page": 1,
      "sourceId": "sci-32-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "화단 흙과 운동장 흙의 특징 비교",
      "concept": "화단 흙은 알갱이 크기가 다양하고 어두운 갈색이며, 운동장 흙은 알갱이가 비교적 크고 밝은 갈색이다."
    },
    "prompt": "화단 흙과 운동장 흙을 관찰한 결과로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "약간 부드러움. / 거칢.",
      "어두운 갈색임. / 밝은 갈색임.",
      "잘 뭉쳐짐. / 잘 뭉쳐지지 않음.",
      "뿌리, 나뭇잎이 보임. / 모래나 흙이 보임.",
      "알갱이가 비교적 큼. / 알갱이 크기가 다양함."
    ],
    "figure": "assets/bank/s32-u03/s1-q01.webp",
    "figureNote": "선택지가 표로 인쇄됨(열 머리: 화단 흙, 운동장 흙; 행 ①~⑤). 내용은 choices에 모두 옮김.",
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
    "explanation": "운동장 흙은 알갱이의 크기가 비교적 크고, 화단 흙은 알갱이의 크기가 큰 것도 있고 작은 것도 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "선택지는 표 형식: 열 머리 「화단 흙」(왼쪽) / 「운동장 흙」(오른쪽). 각 choice는 「화단 흙 / 운동장 흙」 순. 발문의 「않은」에 밑줄. ④ 「뿌리, 나뭇잎이 보임.」과 ⑤ 「알갱이 크기가 다양함.」은 칸 안에서 줄바꿈되어 인쇄됨."
    }
  },
  {
    "id": "s32-u03-o1-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 2,
      "page": 1,
      "sourceId": "sci-32-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "흙의 물 빠짐 비교",
      "concept": "알갱이가 큰 운동장 흙은 알갱이 사이 틈이 커서 화단 흙보다 물이 더 빨리 빠진다."
    },
    "prompt": "운동장 흙과 화단 흙의 물 빠짐을 비교해 보았을 때 일정한 시간 동안 물이 더 많이 빠지는 흙을 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s32-u03/s1-q02.webp",
    "figureNote": "페트병 장치 두 개에 각각 운동장 흙(왼쪽)과 화단 흙(오른쪽)을 넣고 비커로 물을 붓는 그림. 라벨: 운동장 흙, 화단 흙.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "운동장 흙",
      "accepted": [
        "운동장 흙",
        "운동장흙",
        "운동장"
      ]
    },
    "explanation": "운동장 흙이 화단 흙보다 알갱이의 크기가 크기 때문에 물이 더 빠르게 빠집니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란이 「(        ) 흙」으로 인쇄됨."
    }
  },
  {
    "id": "s32-u03-o1-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 3,
      "page": 1,
      "sourceId": "sci-32-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "부식물의 뜻",
      "concept": "부식물은 식물의 뿌리, 죽은 곤충, 나뭇잎 조각 등이 썩어 만들어진 것으로 식물이 자라는 데 도움을 준다."
    },
    "prompt": "빈칸에 공통으로 들어갈 알맞은 말을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "식물의 뿌리나 죽은 곤충, 나뭇잎 조각 등이 오랫동안 썩어서 만들어진 것을 □(이)라고 합니다. □(은)는 식물이 자라는 데 도움을 줍니다.",
      "보기": [
        "ㄱ. 물",
        "ㄴ. 비료",
        "ㄷ. 부식물",
        "ㄹ. 노폐물"
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
      "answer": "ㄷ",
      "accepted": [
        "ㄷ",
        "부식물"
      ]
    },
    "explanation": "식물의 뿌리나 죽은 곤충, 나뭇잎 조각 등이 썩은 부식물은 식물이 자라는 데 도움이 됩니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문의 □는 인쇄된 빈 네모 칸(두 곳)."
    }
  },
  {
    "id": "s32-u03-o1-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 4,
      "page": 1,
      "sourceId": "sci-32-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "과자 흔들기 실험으로 본 흙의 생성",
      "concept": "바위나 돌이 부서져 작아지는 과정처럼, 흔든 과자는 둥근 모양에서 부스러져 가루가 된다."
    },
    "prompt": "다음과 같은 실험을 진행하였을 때 과자의 모습이 변하는 순서대로 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "<실험 과정>\n1. 흰 종이 위에 과자를 올려놓고 모양을 관찰합니다.\n2. 과자를 플라스틱 통에 1/3 정도 넣고 뚜껑을 닫습니다.\n3. 플라스틱 통 안에 가루가 보일 때까지 플라스틱 통을 20 번 정도 흔듭니다.\n4. 흰 종이 위에 과자를 부어 관찰합니다.",
      "보기": [
        "ㄱ. (그림: 둥근 모양의 과자 여러 개)",
        "ㄴ. (그림: 부서져 가루가 된 과자 더미)"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-u03/s1-q04.webp",
    "figureNote": "<보기> 상자: ㄱ은 둥근 과자 여러 개, ㄴ은 잘게 부서져 가루가 된 과자 더미.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ → ㄴ",
      "accepted": [
        "ㄱ → ㄴ",
        "ㄱ→ㄴ",
        "ㄱ, ㄴ",
        "ㄱㄴ"
      ]
    },
    "explanation": "처음에는 둥근 모양의 과자가 부스러지면서 크기가 작아지고 가루가 됩니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "「1/3」은 분수(1 over 3)로 인쇄됨. 답란은 「(   ) → (   )」. <보기>의 ㄱ·ㄴ은 글 없이 그림만 있음."
    }
  },
  {
    "id": "s32-u03-o1-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 5,
      "page": 1,
      "sourceId": "sci-32-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "흙이 만들어지는 과정",
      "concept": "흙은 바위나 돌이 잘게 부서진 알갱이와 생물이 썩은 물질이 섞여 오랜 시간에 걸쳐 만들어진다."
    },
    "prompt": "빈칸에 공통으로 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "• 바위나 돌이 부서져 작은 돌멩이나 모래가 되고, 이것이 더 작게 부서진 알갱이와 생물이 썩어 생긴 물질이 섞여 □(이)가 됩니다.\n• □(은)는 오랜 시간에 걸쳐 서서히 만들어집니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "흙",
      "accepted": [
        "흙"
      ]
    },
    "explanation": "흙은 바위나 돌이 작게 부서진 알갱이와 생물이 썩어 생긴 물질이 섞여 만들어집니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문의 □는 인쇄된 빈 네모 칸(두 곳)."
    }
  },
  {
    "id": "s32-u03-o1-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 6,
      "page": 2,
      "sourceId": "sci-32-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "흙 언덕 윗부분의 변화",
      "concept": "흙 언덕 위쪽에서는 흐르는 물이 흙을 깎아 낸다."
    },
    "prompt": "위의 실험 결과 흙 언덕 윗부분에서 나타나는 변화로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "[06~07] 다음 실험 과정을 보고 물음에 답하세요.\n<실험 과정>\n1. 사각 쟁반에 흙 언덕을 만들고, 색 모래를 흙 언덕 위쪽에 뿌립니다.\n2. 흙 언덕 위쪽에서 물을 흘려보냅니다.\n3. 흙 언덕의 변화를 관찰해 봅니다.",
      "보기": [
        "ㄱ. 흙이 많이 깎였습니다.",
        "ㄴ. 흙이 많이 쌓였습니다.",
        "ㄷ. 처음의 모습에서 변화가 없습니다."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-u03/s1-q06.webp",
    "figureNote": "사각 쟁반 위 흙 언덕 꼭대기에 색 모래가 뿌려져 있고, 비커로 물을 붓는 그림. 라벨: 물, 색 모래, 흙.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ",
        "흙이 많이 깎였습니다."
      ]
    },
    "explanation": "흙 언덕 윗부분의 흙이 물에 의해 깎였습니다.",
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
    "id": "s32-u03-o1-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 7,
      "page": 2,
      "sourceId": "sci-32-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "흙 언덕에서의 침식과 퇴적",
      "concept": "흙 언덕 위쪽에서는 흙이 깎이는 침식 작용이, 아래쪽에서는 흙이 쌓이는 퇴적 작용이 활발하다."
    },
    "prompt": "다음은 위의 실험 결과 흙 언덕의 각 부분에서 일어나는 물의 작용을 정리한 것입니다. 괄호 ㉠과 ㉡에 들어갈 알맞은 말을 골라 각각 쓰세요.",
    "givens": {
      "지문": "[06~07] 다음 실험 과정을 보고 물음에 답하세요.\n<실험 과정>\n1. 사각 쟁반에 흙 언덕을 만들고, 색 모래를 흙 언덕 위쪽에 뿌립니다.\n2. 흙 언덕 위쪽에서 물을 흘려보냅니다.\n3. 흙 언덕의 변화를 관찰해 봅니다.\n\n흙 언덕의 위쪽에서는 ㉠( 침식, 퇴적 ) 작용이 활발하게 일어나고, 흙 언덕 아래쪽에서는 ㉡( 침식, 퇴적 ) 작용이 활발하게 일어납니다."
    },
    "choices": null,
    "figure": "assets/bank/s32-u03/s1-q06.webp",
    "figureNote": "사각 쟁반 위 흙 언덕 꼭대기에 색 모래가 뿌려져 있고, 비커로 물을 붓는 그림. 라벨: 물, 색 모래, 흙.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-침식, ㉡-퇴적",
      "accepted": [
        "㉠-침식, ㉡-퇴적",
        "㉠ 침식, ㉡ 퇴적",
        "침식, 퇴적",
        "침식 퇴적"
      ]
    },
    "explanation": "흙이 깎이는 것을 침식 작용, 흙이 쌓이는 것을 퇴적 작용이라고 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란은 「㉠-(   ), ㉡-(   )」. 상자 안 「㉡( 침식, 퇴적 )」은 「침/식」 사이에서 줄바꿈되어 인쇄됨."
    }
  },
  {
    "id": "s32-u03-o1-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 8,
      "page": 2,
      "sourceId": "sci-32-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "흐르는 물의 운반 작용",
      "concept": "흐르는 물은 깎아 낸 돌과 흙을 낮은 곳으로 운반해 쌓으며 오랜 시간에 걸쳐 지표를 바꾼다."
    },
    "prompt": "괄호에 들어갈 알맞은 말을 골라 쓰세요.",
    "givens": {
      "지문": "흐르는 물은 지표를 깎아 돌이나 흙 등을 ( 높은, 낮은 ) 곳으로 운반하여 쌓아 놓습니다. 흐르는 물은 오랜 시간에 걸쳐 지표를 변화시킵니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "낮은",
      "accepted": [
        "낮은",
        "낮은 곳"
      ]
    },
    "explanation": "흐르는 물은 지표를 깎아 돌이나 흙 등을 낮은 곳으로 운반하여 쌓아 놓습니다. 흐르는 물은 오랜 시간에 걸쳐 지표를 변화시킵니다.",
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
    "id": "s32-u03-o1-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 9,
      "page": 2,
      "sourceId": "sci-32-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "강 상류와 하류의 작용 비교",
      "concept": "강 하류에서는 퇴적 작용이, 강 상류에서는 침식 작용이 더 활발하다."
    },
    "prompt": "다음은 강 주변의 모습입니다. ㄱ과 ㄴ 중에서 침식 작용보다 퇴적 작용이 더 활발하게 일어나는 곳을 골라 기호를 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s32-u03/s1-q09.webp",
    "figureNote": "산에서 바다까지 흐르는 강의 단면 그림. ㄱ은 바위가 있는 산 쪽 상류, ㄴ은 바다 가까운 평지의 구불구불한 하류를 가리킴.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ",
        "강 하류",
        "하류"
      ]
    },
    "explanation": "강 상류에서는 침식 작용이 퇴적 작용보다 활발하게 일어나고, 강의 하류에서는 퇴적 작용이 침식 작용보다 활발하게 일어납니다.",
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
    "id": "s32-u03-o1-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 10,
      "page": 2,
      "sourceId": "sci-32-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "강 하류의 특징",
      "concept": "강 하류는 강폭이 넓고 경사가 완만하며 침식보다 퇴적 작용이 활발하다."
    },
    "prompt": "강 하류에 대한 설명으로 옳은 것을 모두 고르세요. (정답 2 개)",
    "givens": null,
    "choices": [
      "강폭이 넓습니다.",
      "강의 경사가 완만합니다.",
      "계곡이나 산을 많이 볼 수 있습니다.",
      "바위나 큰 돌을 많이 볼 수 있습니다.",
      "퇴적 작용보다 침식 작용이 활발하게 일어납니다."
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
        1
      ]
    },
    "explanation": "강 하류는 강폭이 넓고 강의 경사가 완만합니다. 들판이나 바다에서 많이 볼 수 있으며, 침식 작용보다 퇴적 작용이 활발하게 일어납니다.",
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
    "id": "s32-u03-o1-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 11,
      "page": 2,
      "sourceId": "sci-32-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "바닷가에서 침식이 활발한 곳",
      "concept": "바닷가에서 바다 쪽으로 튀어나온 부분은 침식 작용이, 육지 쪽으로 들어간 부분은 퇴적 작용이 활발하다."
    },
    "prompt": "다음은 바닷가 주변의 모습입니다. ㄱ과 ㄴ 중 침식 작용이 활발하게 일어나는 곳을 골라 기호를 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s32-u03/s1-q11.webp",
    "figureNote": "바닷가 사진. ㄱ은 바다 쪽으로 튀어나온 구멍 뚫린 바위(아치), ㄴ은 육지 쪽으로 들어간 모래사장 쪽을 가리킴.",
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
    "explanation": "바닷가 주변의 지형에서 바닷가 쪽으로 튀어 나온 부분은 침식 작용이 활발하게 일어나고, 육지 쪽으로 들어간 부분은 퇴적 작용이 활발하게 일어납니다.",
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
    "id": "s32-u03-o1-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 12,
      "page": 3,
      "sourceId": "sci-32-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "바닷물의 퇴적 지형",
      "concept": "갯벌과 모래사장은 바닷물의 퇴적 작용으로, 구멍 뚫린 바위와 절벽은 침식 작용으로 만들어진다."
    },
    "prompt": "바닷물의 퇴적 작용으로 만들어진 지형을 <보기>에서 모두 골라 기호를 쓰세요. (정답 2 개)",
    "givens": {
      "보기": [
        "ㄱ. (사진: 갯벌)",
        "ㄴ. (사진: 구멍 뚫린 바위)",
        "ㄷ. (사진: 모래사장)",
        "ㄹ. (사진: 절벽)"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-u03/s1-q12.webp",
    "figureNote": "<보기> 상자 안 사진 4장: ㄱ 갯벌, ㄴ 구멍 뚫린 바위(해식 아치), ㄷ 모래사장, ㄹ 해안 절벽.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ, ㄷ",
      "accepted": [
        "ㄱ, ㄷ",
        "ㄱㄷ",
        "ㄱ,ㄷ",
        "ㄷ, ㄱ",
        "ㄷ,ㄱ"
      ]
    },
    "explanation": "모래사장이나 갯벌은 바닷물의 퇴적 작용으로 만들어진 지형입니다. 구멍 뚫린 바위와 절벽은 바닷물의 침식 작용으로 만들어진 지형입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>의 ㄱ~ㄹ은 사진만 인쇄되어 있고 글이 없음. 괄호 안 지형 이름은 해설에 따라 붙인 설명. 답란 「(   ), (   )」."
    }
  },
  {
    "id": "s32-u03-o1-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 13,
      "page": 3,
      "sourceId": "sci-32-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "바닷가 지형이 다양한 까닭",
      "concept": "바닷가의 여러 지형은 파도 등 바닷물의 침식·퇴적 작용으로 만들어진다."
    },
    "prompt": "바닷가에서 여러 가지 지형을 볼 수 있는 까닭으로 적절한 것을 고르세요.",
    "givens": null,
    "choices": [
      "바람이 불지 않기 때문입니다.",
      "바닷물의 여러 가지 작용 때문입니다.",
      "바닷물이 얼고 녹기를 반복하기 때문입니다.",
      "파도가 세게 쳐서 모두 물속에 가라앉기 때문입니다.",
      "많은 동물이나 사람에 의해 흙이 다져지기 때문입니다."
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
    "explanation": "바닷가 주변의 지형은 바닷물의 여러 가지 작용으로 만들어집니다. 파도가 세게 치는 곳은 침식 작용이 활발하게 일어나고, 파도가 천천히 밀려오는 곳은 퇴적 작용이 활발하게 일어납니다.",
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
    "id": "s32-u03-o1-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 14,
      "page": 3,
      "sourceId": "sci-32-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "흙을 보존하는 방법",
      "concept": "나무와 풀로 흙을 덮거나 시설물로 흙을 고정하면 흙이 깎여 나가지 않고 보존된다."
    },
    "prompt": "흙이 잘 보존되고 있는 곳에 대한 설명으로 옳은 것을 모두 고르세요. (정답 2 개)",
    "givens": null,
    "choices": [
      "나무와 풀이 흙을 덮고 있습니다.",
      "흙으로만 언덕을 높게 쌓아 두었습니다.",
      "산 아랫부분의 경사를 높게 하였습니다.",
      "시설물을 설치하여 흙이 깎이지 않게 하였습니다.",
      "주위에 바위나 돌만 가득하여 흙이 겉으로 드러나 있습니다."
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
        3
      ]
    },
    "explanation": "나무나 풀이 흙을 덮고 있거나 시설물을 설치하여 흙을 고정하면 흙이 잘 보존될 수 있습니다.",
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
    "id": "s32-u03-o1-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 15,
      "page": 3,
      "sourceId": "sci-32-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "흙 보존 시설물의 역할",
      "concept": "돌을 쌓아 만든 시설물은 흐르는 물이 흙을 깎아 내는 침식 작용을 막아 흙을 보존한다."
    },
    "prompt": "다음은 흐르는 물의 어떤 작용으로부터 흙을 보존하기 위한 시설물인지 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 침식 작용",
        "ㄴ. 운반 작용",
        "ㄷ. 퇴적 작용"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-u03/s1-q15.webp",
    "figureNote": "물길 양옆과 바닥에 돌(석축)을 층층이 쌓아 만든 시설물 그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ",
        "침식 작용",
        "침식"
      ]
    },
    "explanation": "흐르는 물의 침식 작용으로부터 흙을 보호하기 위해 시설을 설치한 모습입니다.",
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
    "id": "s32-u03-o2-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 1,
      "page": 1,
      "sourceId": "sci-32-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "운동장 흙과 화단 흙 비교",
      "concept": "운동장 흙은 화단 흙보다 알갱이가 크고 거칠며 잘 뭉쳐지지 않는다."
    },
    "prompt": "운동장 흙과 화단 흙을 비교하여 설명한 내용으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "운동장 흙은 화단 흙보다 더 거칩니다.",
      "운동장 흙과 화단 흙은 둘 다 잘 뭉쳐집니다.",
      "운동장 흙보다 화단 흙의 색깔이 더 밝습니다.",
      "운동장 흙은 알갱이의 크기가 비교적 작습니다.",
      "운동장 흙에는 식물의 뿌리나 나뭇잎 조각과 같은 여러 물질이 많이 섞여 있습니다."
    ],
    "figure": "assets/bank/s32-u03/s2-q01.webp",
    "figureNote": "운동장 흙(밝은 황갈색 모래 같은 흙 더미)과 화단 흙(검은 흙 더미) 사진, 라벨 '▲운동장 흙', '▲화단 흙'.",
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
    "explanation": "운동장 흙은 화단 흙보다 더 거칠고 잘 뭉쳐지지 않습니다.",
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
    "id": "s32-u03-o2-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 2,
      "page": 1,
      "sourceId": "sci-32-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물 빠짐 실험의 다르게 할 조건",
      "concept": "흙의 종류에 따른 물 빠짐을 비교하려면 흙의 종류만 다르게 하고 나머지 조건은 모두 같게 한다."
    },
    "prompt": "위의 실험에서 다르게 해야 하는 조건을 고르세요.",
    "givens": {
      "지문": "[02~04] 운동장 흙과 화단 흙의 물 빠짐을 비교하는 모습입니다. 물음에 답하세요."
    },
    "choices": [
      "물의 양",
      "흙의 양",
      "흙의 종류",
      "물을 붓는 빠르기",
      "거즈의 종류와 플라스틱 통"
    ],
    "figure": "assets/bank/s32-u03/s2-q02.webp",
    "figureNote": "같은 양의 운동장 흙(왼쪽)과 화단 흙(오른쪽)을 거름종이를 깐 플라스틱 통(페트병 윗부분)에 담고 물을 동시에 붓는 장면. 라벨 '운동장 흙', '화단 흙'.",
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
    "explanation": "흙의 종류에 따라 물 빠짐이 달라지는지를 관찰하는 실험이므로 흙의 종류를 다르게 하고 나머지 조건은 같게 해야 합니다.",
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
    "id": "s32-u03-o2-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 3,
      "page": 1,
      "sourceId": "sci-32-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "물이 더 많이 빠진 흙",
      "concept": "알갱이가 큰 운동장 흙은 알갱이 사이 틈이 커서 화단 흙보다 물이 더 빨리, 더 많이 빠진다."
    },
    "prompt": "위의 실험 결과 일정한 시간 동안 물이 더 많이 빠진 흙은 운동장 흙과 화단 흙 중 어느 것인지 쓰세요.",
    "givens": {
      "지문": "[02~04] 운동장 흙과 화단 흙의 물 빠짐을 비교하는 모습입니다. 물음에 답하세요."
    },
    "choices": null,
    "figure": "assets/bank/s32-u03/s2-q02.webp",
    "figureNote": "같은 양의 운동장 흙(왼쪽)과 화단 흙(오른쪽)을 거름종이를 깐 플라스틱 통(페트병 윗부분)에 담고 물을 동시에 붓는 장면. 라벨 '운동장 흙', '화단 흙'.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "운동장 흙",
      "accepted": [
        "운동장 흙",
        "운동장흙",
        "운동장"
      ]
    },
    "explanation": "운동장 흙이 화단 흙보다 알갱이의 크기가 크기 때문에 물이 더 빠르게 빠집니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란이 '(        ) 흙'으로 인쇄되어 있어 '운동장'만 써도 정답으로 볼 수 있음."
    }
  },
  {
    "id": "s32-u03-o2-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 4,
      "page": 1,
      "sourceId": "sci-32-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "물 빠짐이 다른 까닭",
      "concept": "흙 알갱이의 크기가 클수록 물 빠짐이 좋다."
    },
    "prompt": "위의 실험 결과 물 빠짐 정도가 다르게 나타나는 까닭으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "[02~04] 운동장 흙과 화단 흙의 물 빠짐을 비교하는 모습입니다. 물음에 답하세요.",
      "보기": [
        "ㄱ. 운동장 흙이 화단 흙보다 더 부드럽기 때문입니다.",
        "ㄴ. 화단 흙의 색깔이 운동장 흙보다 더 어둡기 때문입니다.",
        "ㄷ. 운동장 흙이 화단 흙보다 알갱이의 크기가 더 크기 때문입니다.",
        "ㄹ. 운동장 흙은 흙 알갱이 외에 나뭇잎이나 식물이 썩은 물질이 섞여 있기 때문입니다."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-u03/s2-q02.webp",
    "figureNote": "같은 양의 운동장 흙(왼쪽)과 화단 흙(오른쪽)을 거름종이를 깐 플라스틱 통(페트병 윗부분)에 담고 물을 동시에 붓는 장면. 라벨 '운동장 흙', '화단 흙'.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ",
        "운동장 흙이 화단 흙보다 알갱이의 크기가 더 크기 때문입니다."
      ]
    },
    "explanation": "운동장 흙이 화단 흙보다 물 빠짐이 더 좋은 까닭은 운동장 흙이 화단 흙보다 알갱이의 크기가 더 크기 때문입니다.",
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
    "id": "s32-u03-o2-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 5,
      "page": 1,
      "sourceId": "sci-32-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "물에 뜬 물질로 화단 흙 찾기",
      "concept": "화단 흙에는 부식물이 많이 섞여 있어 물에 넣으면 물에 뜨는 물질이 많다."
    },
    "prompt": "다음은 운동장 흙과 화단 흙이 든 비커에 같은 양의 물을 부은 뒤 유리 막대로 저은 다음 잠시 놓아두었을 때의 모습입니다. 화단 흙을 골라 기호를 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s32-u03/s2-q05.webp",
    "figureNote": "비커 두 개. ㄱ: 밝은 흙이 바닥에 가라앉고 물이 비교적 맑으며, 확대 원 '물에 뜬 물질'에 작은 알갱이 몇 개뿐. ㄴ: 어두운 흙이 가라앉고 물이 탁하며, 확대 원 '물에 뜬 물질'에 나뭇잎·뿌리 조각 같은 물질이 많음.",
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
    "explanation": "화단 흙은 운동장 흙에 비해 부식물이 더 많이 섞여 있어 물에 뜨는 물질이 많습니다.",
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
    "id": "s32-u03-o2-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 6,
      "page": 2,
      "sourceId": "sci-32-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "흙이 만들어지는 과정",
      "concept": "바위나 돌은 바람, 흐르는 물, 얼음, 식물의 뿌리 등 여러 과정으로 오랜 시간에 걸쳐 부서지고, 생물이 썩은 물질과 섞여 흙이 된다."
    },
    "prompt": "자연에서 흙이 만들어지는 과정에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "바위나 돌은 흙이 되지 못합니다.",
      "바위나 돌은 짧은 시간에 걸쳐 부서집니다.",
      "바위나 돌은 여러 가지 과정으로 부서집니다.",
      "생물이 썩어 생긴 물질이 섞이면 흙이 될 수 없습니다.",
      "바위나 돌이 작게 부서진 알갱이와 우리가 버린 쓰레기가 섞여 흙이 됩니다."
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
    "explanation": "바위나 돌은 바람, 흐르는 물, 얼음, 식물의 뿌리 등에 의해 다양한 방법으로 부서져 흙이 됩니다. 흙에는 작게 부서진 알갱이와 함께 생물이 썩어 생긴 물질도 섞여 있습니다.",
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
    "id": "s32-u03-o2-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 7,
      "page": 2,
      "sourceId": "sci-32-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "흙 언덕에 물을 흘려보낸 결과",
      "concept": "흐르는 물은 흙 언덕 윗부분의 흙을 깎아 아랫부분으로 옮겨 쌓는다."
    },
    "prompt": "사각 쟁반에 흙으로 언덕을 만들고 언덕 위쪽에 색 모래를 뿌린 다음 흙 언덕 위쪽에서 물을 흘려보냈습니다. 물을 흘려보낸 후 언덕의 모습으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "윗부분과 아랫부분이 평평해집니다.",
      "흙 언덕의 모습은 변하지 않습니다.",
      "물과 닿은 부분의 흙이 사라집니다.",
      "아랫부분의 흙이 윗부분으로 올라와 쌓입니다.",
      "윗부분의 흙이 아랫부분으로 내려와 쌓입니다."
    ],
    "figure": "assets/bank/s32-u03/s2-q07.webp",
    "figureNote": "사각 쟁반 위의 흙 언덕, 꼭대기에 색 모래가 뿌려져 있고 손이 비커로 물을 붓는 그림. 라벨 '물', '색 모래', '흙'.",
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
    "explanation": "윗부분에서 물을 흘려보내면 윗부분의 흙이 아랫부분으로 내려와 쌓입니다.",
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
    "id": "s32-u03-o2-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 8,
      "page": 2,
      "sourceId": "sci-32-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "침식·운반·퇴적 작용",
      "concept": "흐르는 물이 지표를 깎는 것을 침식, 옮기는 것을 운반, 쌓는 것을 퇴적 작용이라고 한다."
    },
    "prompt": "다음은 흐르는 물의 작용에 대한 설명입니다. 빈칸 ㉠~㉢에 들어갈 알맞은 말을 각각 쓰세요.",
    "givens": {
      "지문": "흐르는 물에 의해 지표의 바위나 돌, 흙 등이 깎여 나가는 것을 ㉠ 작용이라고 하고, 깎인 돌이나 흙 등이 다른 곳으로 옮겨지는 것을 ㉡ 작용이라고 합니다. 운반된 돌이나 흙 등이 쌓는 것을 ㉢ 작용이라고 합니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-침식, ㉡-운반, ㉢-퇴적",
      "accepted": [
        "㉠-침식, ㉡-운반, ㉢-퇴적",
        "침식, 운반, 퇴적",
        "침식,운반,퇴적",
        "침식 운반 퇴적",
        "㉠ 침식, ㉡ 운반, ㉢ 퇴적"
      ]
    },
    "explanation": "흐르는 물은 지표를 깎아 돌이나 흙 등을 낮은 곳으로 운반하여 쌓아 놓습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문의 ㉠·㉡·㉢은 인쇄본에서 네모 빈칸 안에 들어 있음. '쌓는 것을'은 인쇄된 그대로임('쌓이는'이 아님)."
    }
  },
  {
    "id": "s32-u03-o2-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 9,
      "page": 2,
      "sourceId": "sci-32-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "강 상류의 특징",
      "concept": "강 상류는 강폭이 좁고 경사가 급하며 퇴적보다 침식 작용이 활발하다."
    },
    "prompt": "강 상류에 대한 설명으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "강폭이 넓습니다.",
      "강의 경사가 급합니다.",
      "강의 경사가 완만합니다.",
      "퇴적 작용보다 침식 작용이 활발하게 일어납니다.",
      "침식 작용보다 퇴적 작용이 활발하게 일어납니다."
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
    "explanation": "강 상류는 강폭이 좁고, 강의 경사가 급하며, 퇴적 작용보다 침식 작용이 활발하게 일어납니다.",
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
    "id": "s32-u03-o2-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 10,
      "page": 2,
      "sourceId": "sci-32-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "강 하류의 특징",
      "concept": "강 하류는 경사가 완만해 침식보다 퇴적 작용이 활발하고 넓은 평야나 들이 나타난다."
    },
    "prompt": "다음과 같은 현상은 강 상류와 강 하류 중 어느 곳에서 주로 나타나는지 쓰세요.",
    "givens": {
      "지문": "• 침식 작용보다 퇴적 작용이 활발하게 일어납니다.\n• 넓은 평야나 들을 볼 수 있습니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "강 하류",
      "accepted": [
        "강 하류",
        "강하류",
        "하류"
      ]
    },
    "explanation": "강 하류에서는 침식 작용보다 퇴적 작용이 활발하게 일어납니다.",
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
    "id": "s32-u03-o2-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 11,
      "page": 3,
      "sourceId": "sci-32-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "바닷물의 침식 작용으로 만들어진 지형",
      "concept": "바닷물이 바위를 계속 깎는 침식 작용으로 절벽, 구멍 뚫린 바위 같은 지형이 만들어진다."
    },
    "prompt": "위 <보기>에서 바닷물이 바위와 만나는 부분을 계속 깎아서 만들어진 지형을 모두 골라 기호를 쓰세요. (정답 2개)",
    "givens": {
      "지문": "[11~12] 다음의 <보기>는 바닷가 주변의 모습입니다. 물음에 답하세요.",
      "보기": [
        "ㄱ. ▲갯벌",
        "ㄴ. ▲절벽",
        "ㄷ. ▲모래사장",
        "ㄹ. ▲구멍 뚫린 바위"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-u03/s2-q11.webp",
    "figureNote": "<보기> 사진 4장: ㄱ. 갯벌, ㄴ. 절벽, ㄷ. 모래사장, ㄹ. 구멍 뚫린 바위.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ, ㄹ",
      "accepted": [
        "ㄴ, ㄹ",
        "ㄴ,ㄹ",
        "ㄹ, ㄴ",
        "ㄹ,ㄴ",
        "절벽, 구멍 뚫린 바위",
        "ㄴㄹ"
      ]
    },
    "explanation": "절벽과 구멍 뚫린 바위는 바닷물의 침식 작용으로 만들어진 지형입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>는 사진 4장이며 각 사진 아래 캡션(▲갯벌 등)만 글자로 인쇄됨."
    }
  },
  {
    "id": "s32-u03-o2-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 12,
      "page": 3,
      "sourceId": "sci-32-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "바닷물의 퇴적 작용으로 만들어진 지형",
      "concept": "파도(바닷물)가 모래나 고운 흙을 쌓는 퇴적 작용으로 갯벌, 모래사장 같은 지형이 만들어진다."
    },
    "prompt": "위 <보기>에서 파도의 퇴적 작용에 의해 만들어진 지형을 모두 골라 기호를 쓰세요. (정답 2개)",
    "givens": {
      "지문": "[11~12] 다음의 <보기>는 바닷가 주변의 모습입니다. 물음에 답하세요.",
      "보기": [
        "ㄱ. ▲갯벌",
        "ㄴ. ▲절벽",
        "ㄷ. ▲모래사장",
        "ㄹ. ▲구멍 뚫린 바위"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-u03/s2-q11.webp",
    "figureNote": "<보기> 사진 4장: ㄱ. 갯벌, ㄴ. 절벽, ㄷ. 모래사장, ㄹ. 구멍 뚫린 바위.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ, ㄷ",
      "accepted": [
        "ㄱ, ㄷ",
        "ㄱ,ㄷ",
        "ㄷ, ㄱ",
        "ㄷ,ㄱ",
        "갯벌, 모래사장",
        "ㄱㄷ"
      ]
    },
    "explanation": "갯벌과 모래사장은 바닷물의 퇴적 작용으로 만들어진 지형입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>는 사진 4장이며 각 사진 아래 캡션(▲갯벌 등)만 글자로 인쇄됨."
    }
  },
  {
    "id": "s32-u03-o2-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 13,
      "page": 3,
      "sourceId": "sci-32-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T09",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "구멍 뚫린 바위가 변하는 까닭",
      "concept": "파도가 오랜 시간 바위에 부딪치며 약한 부분부터 깎는 침식 작용으로 구멍 뚫린 바위가 무너져 육지와 떨어진 작은 바위가 된다."
    },
    "prompt": "다음의 바닷가 지형은 오랜 시간이 지나 변하는 모습을 나타낸 것입니다. 이러한 변화가 나타나는 까닭을 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s32-u03/s2-q13.webp",
    "figureNote": "위: 바닷가 절벽 끝에 아치 모양 구멍이 뚫린 바위 그림 → (아래 화살표) → 아래: 아치 윗부분이 무너져 절벽과 떨어진 작은 바위 기둥만 바다에 남은 그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "오랜 시간에 걸쳐 파도에 부딪치면서 바위가 조금씩 깎이기 때문입니다.",
      "rubric": {
        "required": [
          "오랜 시간 파도가 바위에 부딪침",
          "바위가 조금씩 깎임(침식 작용)"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "지형의 변화가 나타난 까닭을 정확하게 쓴 경우 (100%)"
        ]
      }
    },
    "explanation": "바닷물의 침식 작용으로 바위에서 약한 부분이 먼저 깎여 나가 구멍이 생기고, 점점 더 바위가 깎여 나가며 작은 바위가 육지에서 떨어져 나가게 됩니다.\n[채점 기준] 지형의 변화가 나타난 까닭을 정확하게 쓴 경우 (100%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준 표의 행 머리는 '정답'."
    }
  },
  {
    "id": "s32-u03-o2-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 14,
      "page": 3,
      "sourceId": "sci-32-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "흙이 소중한 까닭",
      "concept": "흙은 생물의 삶의 터전이고 다시 만들어지기까지 오랜 시간이 걸리므로 보존해야 하며, 다시 만들 수 없는 것은 아니다."
    },
    "prompt": "흙이 소중한 까닭으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "다시 만들 수 없기 때문입니다.",
      "쉽게 오염될 수 있기 때문입니다.",
      "쉽게 떠내려갈 수 있기 때문입니다.",
      "식물이 양분을 얻는 곳이기 때문입니다.",
      "많은 생물이 살아가고 있기 때문입니다."
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
    "explanation": "흙은 다양한 생물이 살아갈 수 있는 삶의 터전이고, 다시 만들어지기까지 오랜 시간이 걸리기 때문에 흙을 보존해야 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄이 그어져 있음."
    }
  },
  {
    "id": "s32-u03-o2-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 15,
      "page": 3,
      "sourceId": "sci-32-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "흙이 잘 보존되는 경우",
      "concept": "나무나 풀이 흙을 덮거나 흙을 고정하는 시설물이 있으면 흙이 깎여 떠내려가지 않고 잘 보존된다."
    },
    "prompt": "흙이 잘 보존되는 경우를 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. (그림) 굴착기가 흙과 돌을 파헤치는 공사 현장",
        "ㄴ. (그림) 나무와 풀이 자라는 비탈면에 흙을 고정하는 격자 모양 시설물이 설치된 모습"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-u03/s2-q15.webp",
    "figureNote": "<보기> 그림 2장: ㄱ. 굴착기(포클레인)가 흙과 돌을 파헤치는 공사 현장. ㄴ. 숲 사이 비탈면에 격자 모양의 흙 고정 시설물이 설치되고 아래쪽에 나무가 자란 모습.",
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
    "explanation": "흙이 잘 보존되고 있는 곳은 나무나 풀이 흙을 덮고 있거나 흙을 고정해 주는 시설물이 있습니다. 산사태나 도로 공사는 흙이 깎여서 떠내려가는 경우입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>는 그림만 있고 글자가 없음. givens의 보기 설명은 그림을 말로 옮긴 것(인쇄 문구 아님)."
    }
  },
  {
    "id": "s32-u03-o3-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 1,
      "page": 1,
      "sourceId": "sci-32-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "흙을 관찰하는 방법",
      "concept": "흙은 눈·손·돋보기·물을 이용해 관찰하며, 무엇이 들어 있는지 모르는 물질은 맛을 보지 않는다."
    },
    "prompt": "운동장 흙과 화단 흙을 관찰하는 방법으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "눈으로 색깔을 관찰합니다.",
      "혀를 살짝 대어 맛을 봅니다.",
      "뭉쳐 보거나 물에 넣어 봅니다.",
      "돋보기로 알갱이를 자세히 관찰해 봅니다.",
      "손으로 만졌을 때의 느낌을 관찰해 봅니다."
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
    "explanation": "흙을 관찰할 때는 눈으로 관찰하거나 손으로 만져 느낌을 확인해 봅니다. 또 물에 넣어서 뜬 물질이 있는지 확인해 봅니다. 어떤 것이 들어 있는지 모르는 물질은 함부로 맛을 보지 않습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄이 있음."
    }
  },
  {
    "id": "s32-u03-o3-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 2,
      "page": 1,
      "sourceId": "sci-32-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "화단 흙의 특징",
      "concept": "화단 흙은 운동장 흙보다 알갱이 크기가 다양하고 부드러우며 잘 뭉쳐진다."
    },
    "prompt": "다음에서 알갱이의 크기가 다양하고, 손으로 만졌을 때 약간 부드러우며, 잘 뭉쳐지는 흙을 골라 기호(ㄱ~ㄴ)를 쓰세요.",
    "givens": {
      "지문": "ㄱ. ▲운동장 흙 / ㄴ. ▲화단 흙"
    },
    "choices": null,
    "figure": "assets/bank/s32-u03/s3-q02.webp",
    "figureNote": "상자 안 사진 두 장: ㄱ. 연한 갈색 모래 더미(▲운동장 흙), ㄴ. 검은 흙 더미(▲화단 흙).",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ",
        "화단 흙",
        "화단흙"
      ]
    },
    "explanation": "화단 흙은 알갱이의 크기가 다양하고, 손으로 만졌을 때 부드러우며, 잘 뭉쳐집니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'기호(ㄱ~' 다음 줄바꿈 후 'ㄴ)를 쓰세요.'"
    }
  },
  {
    "id": "s32-u03-o3-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 3,
      "page": 1,
      "sourceId": "sci-32-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "운동장 흙과 화단 흙의 물 빠짐 비교",
      "concept": "알갱이가 큰 운동장 흙이 화단 흙보다 물이 더 빨리 빠진다."
    },
    "prompt": "운동장 흙과 화단 흙의 물 빠짐에 대한 설명으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 운동장 흙과 화단 흙은 물이 빠지는 빠르기가 같습니다.",
        "ㄴ. 운동장 흙이 화단 흙보다 물이 빠지는 빠르기가 더 빠릅니다.",
        "ㄷ. 화단 흙이 운동장 흙보다 물이 빠지는 빠르기가 더 빠릅니다."
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
        "운동장 흙이 화단 흙보다 물이 빠지는 빠르기가 더 빠릅니다."
      ]
    },
    "explanation": "운동장 흙의 알갱이가 더 크기 때문에 화단 흙 보다 물이 빠지는 빠르기가 더 빠릅니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "해설의 '화단 흙 보다' 띄어쓰기는 인쇄된 그대로임."
    }
  },
  {
    "id": "s32-u03-o3-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 4,
      "page": 1,
      "sourceId": "sci-32-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물에 뜬 물질로 흙 비교",
      "concept": "화단 흙에는 식물의 뿌리, 나뭇잎 조각 등 물에 뜨는 물질(부식물)이 운동장 흙보다 많다."
    },
    "prompt": "다음은 운동장 흙과 화단 흙이 든 비커에 같은 양의 물을 부은 뒤 유리 막대로 저은 다음 잠시 놓아두었을 때의 모습입니다. 이를 통해 알 수 있는 내용을 고르세요.",
    "givens": null,
    "choices": [
      "운동장 흙에 부식물이 더 많습니다.",
      "화단 흙의 알갱이 크기가 더 큽니다.",
      "화단 흙을 만졌을 때 약간 부드럽습니다.",
      "식물이 더 잘 자라는 흙은 운동장 흙입니다.",
      "화단 흙에는 식물의 뿌리, 죽은 곤충, 나뭇잎 조각 등이 있습니다."
    ],
    "figure": "assets/bank/s32-u03/s3-q04.webp",
    "figureNote": "비커 그림 두 개. 위: ▲운동장 흙 — 물 위에 뜬 물질이 거의 없음(확대 원 '물에 뜬 물질'에 작은 점 몇 개). 아래: ▲화단 흙 — 물 위에 뜬 물질이 많음(확대 원 '물에 뜬 물질'에 뿌리·나뭇조각 등).",
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
    "explanation": "운동장 흙에는 물에 뜬 물질이 거의 없지만 화단 흙에는 식물의 뿌리, 작은 나뭇가지 등 물에 뜬 물질이 많습니다.",
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
    "id": "s32-u03-o3-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 5,
      "page": 2,
      "sourceId": "sci-32-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "부식물의 뜻",
      "concept": "부식물은 생물의 몸이나 나뭇잎 등이 오래 썩어 만들어진 것으로 식물에 영양분이 된다."
    },
    "prompt": "빈칸에 공통으로 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "• □(은)는 작은 곤충, 나뭇잎, 죽은 동물이나 식물이 오랫동안 썩어서 만들어진 것입니다.\n• □(은)는 식물에 필요한 영양분이 되어 식물이 잘 자랄 수 있도록 도와줍니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "부식물",
      "accepted": [
        "부식물"
      ]
    },
    "explanation": "부식물은 작은 곤충, 나뭇잎, 죽은 동물이나 식물이 오랫동안 썩어서 만들어진 것으로 식물이 자라는 데 도움을 줍니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "빈칸은 인쇄본에서 빈 네모 상자이며 여기서는 □로 적음."
    }
  },
  {
    "id": "s32-u03-o3-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 6,
      "page": 2,
      "sourceId": "sci-32-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "식물이 잘 자라는 흙",
      "concept": "식물은 물 빠짐이 적절하고 부식물이 많은 흙에서 잘 자란다."
    },
    "prompt": "식물이 잘 자라는 흙의 특징을 모두 고르세요. (정답 2 개)",
    "givens": null,
    "choices": [
      "물 빠짐이 적절합니다.",
      "알갱이의 크기가 큽니다.",
      "부식물이 많이 있습니다.",
      "모래가 많이 섞여 있습니다.",
      "물에 뜨는 물질이 거의 없습니다."
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
    "explanation": "식물은 대부분 물 빠짐이 적절하고 부식물이 많은 흙에서 잘 자랍니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'(정답 2 개)'는 인쇄본 띄어쓰기 그대로."
    }
  },
  {
    "id": "s32-u03-o3-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 7,
      "page": 2,
      "sourceId": "sci-32-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "과자를 흔드는 실험 결과",
      "concept": "통에 넣고 세게 흔든 과자는 서로 부딪혀 부서지며 작은 알갱이가 생긴다."
    },
    "prompt": "위 실험의 결과로 옳은 것을 고르세요.",
    "givens": {
      "지문": "[07~08] 다음의 과자를 플라스틱 통에 넣고 뚜껑을 닫은 뒤 플라스틱 통을 세게 흔들면서 과자의 모습을 관찰하였습니다. 물음에 답하세요."
    },
    "choices": [
      "과자의 맛이 변합니다.",
      "과자의 크기가 커집니다.",
      "과자의 모양이 변하지 않습니다.",
      "과자의 크기가 변하지 않습니다.",
      "과자가 부서져서 작은 알갱이가 생깁니다."
    ],
    "figure": "assets/bank/s32-u03/s3-q07.webp",
    "figureNote": "동그란 초코칩 과자 여러 개를 그린 그림.",
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
    "explanation": "과자가 부서져서 크기가 작아지고 작은 알갱이가 생깁니다.",
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
    "id": "s32-u03-o3-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 8,
      "page": 2,
      "sourceId": "sci-32-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "과자 실험이 나타내는 자연 현상",
      "concept": "과자가 부서지는 모습은 바위와 돌이 부서져 흙이 만들어지는 과정을 나타낸다."
    },
    "prompt": "위의 실험은 자연에서 어떤 과정을 알아보기 위한 것인지 고르세요.",
    "givens": {
      "지문": "[07~08] 다음의 과자를 플라스틱 통에 넣고 뚜껑을 닫은 뒤 플라스틱 통을 세게 흔들면서 과자의 모습을 관찰하였습니다. 물음에 답하세요."
    },
    "choices": [
      "흙이 뭉쳐지는 과정",
      "흙이 만들어지는 과정",
      "흙이 얼음이 되는 과정",
      "바위가 만들어지는 과정",
      "흐르는 물에 의한 과자의 변화"
    ],
    "figure": "assets/bank/s32-u03/s3-q07.webp",
    "figureNote": "동그란 초코칩 과자 여러 개를 그린 그림.",
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
    "explanation": "과자가 부서지는 과정을 통해 바위와 돌이 부서져 흙이 만들어지는 과정을 알 수 있습니다.",
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
    "id": "s32-u03-o3-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 9,
      "page": 2,
      "sourceId": "sci-32-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "자연에서 바위가 부서지는 까닭",
      "concept": "바위틈에서 자라는 식물의 뿌리와 얼었다 녹기를 반복하는 물이 바위를 부서뜨린다."
    },
    "prompt": "다음은 자연에서 바위가 부서지는 경우를 나타낸 것입니다. 빈칸 ㉠과 ㉡에 들어갈 알맞은 말을 <보기>에서 골라 각각 쓰세요.",
    "givens": {
      "지문": "• 식물의 ㉠(이)가 바위틈으로 자라면서 바위가 부서집니다.\n• 바위틈에 스며든 ㉡(이)가 얼었다 녹기를 반복하며 바위가 부서집니다.",
      "보기": [
        "물, 뿌리, 바람, 흙, 바위"
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
      "answer": "㉠-뿌리, ㉡-물",
      "accepted": [
        "㉠-뿌리, ㉡-물",
        "㉠ 뿌리, ㉡ 물",
        "뿌리, 물",
        "뿌리,물",
        "뿌리 물",
        "㉠ 뿌리 ㉡ 물"
      ]
    },
    "explanation": "식물의 뿌리가 바위틈에서 자라거나 바위틈에 스며든 물이 얼었다 녹기를 반복하면 바위가 부서집니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "㉠, ㉡은 인쇄본에서 네모 상자 안에 들어 있음. 답란은 '㉠-(  ), ㉡-(  )'."
    }
  },
  {
    "id": "s32-u03-o3-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 10,
      "page": 2,
      "sourceId": "sci-32-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "흙이 만들어지는 과정",
      "concept": "흙은 오랜 시간 바위가 부서진 알갱이와 생물이 썩은 물질이 섞여 만들어진다."
    },
    "prompt": "다음은 무엇이 만들어지는 과정인지 고르세요.",
    "givens": {
      "지문": "자연에서 오랜 시간에 걸쳐 바람이나 물, 식물의 뿌리 등에 의해서 바위가 부서지고, 작게 부서진 알갱이와 생물이 썩어 생긴 물질들이 섞여서 만들어집니다."
    },
    "choices": [
      "물",
      "흙",
      "공기",
      "바다",
      "갯벌"
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
    "explanation": "자연에서 오랜 시간에 걸쳐 바람이나 물, 식물의 뿌리 등에 의해서 바위가 부서지고, 작게 부서진 알갱이와 생물이 썩어 생긴 물질들이 섞여서 흙이 만들어집니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기는 2열 배치(①·②, ③·④, ⑤)."
    }
  },
  {
    "id": "s32-u03-o3-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 11,
      "page": 3,
      "sourceId": "sci-32-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T06",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "흙 언덕에 물을 흘려보낸 결과",
      "concept": "흐르는 물은 흙 언덕 위쪽의 흙을 깎아 아래쪽으로 옮겨 쌓는다."
    },
    "prompt": "흙 언덕을 만들어 위쪽에 색 모래를 뿌린 후 언덕 위쪽에서 물을 흘려보냈습니다. 실험 결과 색 모래의 이동 방향을 기호를 이용하여 쓰고, 흙 언덕의 모양 변화를 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s32-u03/s3-q11.webp",
    "figureNote": "쟁반 위 흙 언덕 그림. 꼭대기에 파란 색 모래가 뿌려져 있고, 꼭대기(색 모래)=ㄱ, 언덕 중간=ㄴ, 언덕 아래쪽=ㄷ을 가리키는 선. 쟁반 왼쪽 안쪽에 '흙'이라는 글자가 세로로 적힘.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "색 모래는 ㄱ에서 ㄷ 으로 이동한 것을 볼 수 있습니다. 흙 언덕은 위쪽의 흙이 깎여 아래쪽에 쌓입니다.",
      "rubric": {
        "required": [
          "색 모래가 ㄱ에서 ㄷ으로 이동함",
          "위쪽의 흙은 깎이고 아래쪽에 쌓임"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "정답: 흙의 이동 방향과 흙 언덕의 모양 변화를 정확하게 쓴 경우 (100%)",
          "부분 정답: 흙의 이동 방향과 흙 언덕의 모양 변화를 부족하게 쓴 경우 (50%)"
        ]
      }
    },
    "explanation": "흙 언덕의 위쪽에서 물을 흘려보내면 색 모래가 흙 언덕의 아래쪽으로 이동하는 것을 볼 수 있습니다. 흙 언덕은 흙이 깎인 곳도 있고 흘러 내려 쌓인 곳도 있습니다. 흙이 가장 많이 깎인 곳은 흙 언덕 위쪽이고, 가장 많이 쌓인 곳은 흙 언덕 아래쪽입니다.\n[채점 기준] 정답: 흙의 이동 방향과 흙 언덕의 모양 변화를 정확하게 쓴 경우 (100%) / 부분 정답: 흙의 이동 방향과 흙 언덕의 모양 변화를 부족하게 쓴 경우 (50%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "모범 답안의 'ㄷ 으로' 띄어쓰기는 인쇄된 그대로임(빠른 정답·해설 모두 동일). 채점 기준 표의 '흙의 이동 방향'은 인쇄된 그대로임(발문은 '색 모래의 이동 방향')."
    }
  },
  {
    "id": "s32-u03-o3-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 12,
      "page": 3,
      "sourceId": "sci-32-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "침식 작용과 퇴적 작용의 뜻",
      "concept": "지표가 깎여 나가는 것은 침식 작용, 운반된 돌이나 흙이 쌓이는 것은 퇴적 작용이다."
    },
    "prompt": "다음은 흐르는 물에 의한 지표의 변화에 대한 설명입니다. 빈칸 ㉠과 ㉡에 들어갈 알맞은 말을 바르게 짝지은 것을 고르세요.",
    "givens": {
      "지문": "흐르는 물은 바위나 돌, 흙 등을 깎아 낮은 곳으로 운반해 쌓아 놓습니다. 지표의 바위나 돌, 흙 등이 깎여 나가는 것을 ㉠(이)라고 하고, 운반된 돌이나 흙이 쌓이는 것을 ㉡(이)라고 합니다."
    },
    "choices": [
      "침식 작용 / 운반 작용",
      "침식 작용 / 퇴적 작용",
      "퇴적 작용 / 침식 작용",
      "퇴적 작용 / 운반 작용",
      "운반 작용 / 퇴적 작용"
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
    "explanation": "지표의 바위나 돌, 흙 등이 깎여 나가는 것을 침식 작용이라고 하고, 운반된 돌이나 흙이 쌓이는 것을 퇴적 작용이라고 합니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기는 표 형식(열 머리: ㉠ / ㉡). ㉠·㉡은 지문에서 네모 상자 안에 있음."
    }
  },
  {
    "id": "s32-u03-o3-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 13,
      "page": 3,
      "sourceId": "sci-32-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "흐르는 물의 작용",
      "concept": "흐르는 물은 지표를 깎고, 깎인 물질을 낮은 곳으로 운반해 쌓는다."
    },
    "prompt": "흐르는 물에 의한 작용에 대한 설명으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 바위틈의 물이 얼었다 녹으며 바위가 부서집니다.",
        "ㄴ. 바위나 돌, 흙 등을 깎아 낮은 곳으로 운반해 쌓아 놓습니다.",
        "ㄷ. 물에 뜨는 물체가 물과 함께 이동하여 무거운 물체만 지표에 남게 됩니다."
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
        "바위나 돌, 흙 등을 깎아 낮은 곳으로 운반해 쌓아 놓습니다."
      ]
    },
    "explanation": "흐르는 물은 바위나 돌, 흙 등을 깎아 낮은 곳으로 운반해 쌓아 놓습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '<보기>'가 '<'와 '보기>' 사이에서 줄바꿈됨."
    }
  },
  {
    "id": "s32-u03-o3-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 14,
      "page": 3,
      "sourceId": "sci-32-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "강 상류의 특징",
      "concept": "강 상류는 강폭이 좁고 경사가 급하며 계곡과 산을 많이 볼 수 있다."
    },
    "prompt": "위 ㄱ과 ㄴ 중 다음과 같은 특징이 있는 곳을 골라 기호를 쓰세요.",
    "givens": {
      "지문": "[14~15] 다음은 강 주변의 모습을 나타낸 것입니다. 물음에 답하세요.\n• 강폭이 좁습니다.\n• 경사가 급합니다.\n• 계곡이나 산을 많이 볼 수 있습니다."
    },
    "choices": null,
    "figure": "assets/bank/s32-u03/s3-q14.webp",
    "figureNote": "강 주변 지형 모형 그림. 왼쪽 위 높은 산지의 상류(ㄱ)에서 강이 흘러 내려와 오른쪽 아래 넓고 평평한 하류(ㄴ, 모래가 쌓인 바다 가까운 곳)로 이어짐.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ",
        "강 상류",
        "상류"
      ]
    },
    "explanation": "강폭이 좁고 경사가 급하며 계곡이나 산을 많이 볼 수 있는 곳은 강 상류입니다.",
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
    "id": "s32-u03-o3-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 15,
      "page": 3,
      "sourceId": "sci-32-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "강 하류의 모습",
      "concept": "강 하류는 강폭이 넓고 운반된 모래가 쌓인 모습을 볼 수 있다."
    },
    "prompt": "위 ㄱ과 ㄴ 중 다음과 같은 모습을 볼 수 있는 곳을 골라 기호를 쓰세요.",
    "givens": {
      "지문": "[14~15] 다음은 강 주변의 모습을 나타낸 것입니다. 물음에 답하세요."
    },
    "choices": null,
    "figure": "assets/bank/s32-u03/s3-q15.webp",
    "figureNote": "강 하구를 위에서 내려다본 항공 사진. 강물이 바다로 흘러드는 곳에 모래가 넓게 쌓여 있음.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ",
        "강 하류",
        "하류"
      ]
    },
    "explanation": "모래가 쌓이고 강폭이 넓은 곳은 강 하류입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "이 문항은 그림이 두 개(문항 사진 + [14~15] 공통 그림)라서 공통 그림을 figure.extra에 따로 적음."
    }
  },
  {
    "id": "s32-u03-o3-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 16,
      "page": 3,
      "sourceId": "sci-32-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "흐르는 물의 양이 많아질 때의 변화",
      "concept": "흐르는 물의 양이 많아지면 상류의 침식이 활발해져 경사가 더 급해지고 하류에는 더 많이 쌓인다."
    },
    "prompt": "강 상류에서 강 하류 지역으로 흐르는 물의 양이 많아질 때 나타나는 현상으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "강 상류는 평평해질 것입니다.",
      "강 하류의 강폭이 더 넓어질 것입니다.",
      "강 하류에 모래가 더 많이 쌓일 것입니다.",
      "강 상류에 큰 바위가 많이 부서질 것입니다.",
      "흐르는 강에 의해 운반되는 모래나 작은 알갱이들의 양이 더 많아질 것입니다."
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
    "explanation": "흐르는 물은 강 상류의 바위나 돌, 흙 등을 깎아 강 하류로 운반해 쌓아 놓습니다. 따라서 강 상류는 침식 작용이 활발해져 경사가 더 급해집니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄이 있음."
    }
  },
  {
    "id": "s32-u03-o3-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 17,
      "page": 4,
      "sourceId": "sci-32-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T09",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "바닷가 절벽이 만들어지는 까닭",
      "concept": "바닷가 절벽은 바닷물이 바위와 만나는 부분을 계속 깎고 무너뜨리는 침식 작용으로 만들어진다."
    },
    "prompt": "다음은 바닷가에서 볼 수 있는 지형입니다. 이 지형은 바닷물의 어떤 작용으로 만들어진 것인지 쓰고, 그렇게 생각한 까닭을 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s32-u03/s3-q17.webp",
    "figureNote": "바다에 면한 높고 가파른 해안 절벽 사진.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "바닷물의 침식 작용으로 만들어진 지형입니다. 바닷물이 바위와 만나는 부분을 계속 깎고 무너뜨리기 때문입니다.",
      "rubric": {
        "required": [
          "바닷물의 침식 작용",
          "바닷물이 바위를 계속 깎고 무너뜨림"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "정답: 침식 작용과 바닷물이 바위를 깎고 무너뜨려 절벽을 만드는 과정을 정확하게 쓴 경우 (100%)",
          "부분 정답: 침식 작용에 대한 내용이 정확하지 않은 경우 (50%)"
        ]
      }
    },
    "explanation": "바닷가에서 볼 수 있는 절벽은 바닷물의 침식 작용으로 만들어진 지형입니다. 바닷물이 바위와 만나는 부분을 계속 깎고 무너뜨려서 절벽이 만들어집니다.\n[채점 기준] 정답: 침식 작용과 바닷물이 바위를 깎고 무너뜨려 절벽을 만드는 과정을 정확하게 쓴 경우 (100%) / 부분 정답: 침식 작용에 대한 내용이 정확하지 않은 경우 (50%)",
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
    "id": "s32-u03-o3-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 18,
      "page": 4,
      "sourceId": "sci-32-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "바닷가 지형의 침식과 퇴적",
      "concept": "바닷가의 절벽과 구멍 뚫린 바위는 침식 작용으로, 모래사장은 퇴적 작용으로 만들어진다."
    },
    "prompt": "바닷가 주변의 지형에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "ㄱ은 바닷물의 퇴적 작용으로 모래가 쌓인 것입니다.",
      "ㄴ은 시간이 지나면 가운데 구멍이 더 작아질 것입니다.",
      "ㄴ은 바닷물의 퇴적 작용으로 가운데 구멍이 뚫린 것입니다.",
      "ㄷ은 바닷물이 바위와 만나는 부분을 계속 깎아 절벽이 된 것입니다.",
      "ㄷ은 모래를 바닷물이 깎아 고운 흙이나 가는 모래가 쌓인 것입니다."
    ],
    "figure": "assets/bank/s32-u03/s3-q18.webp",
    "figureNote": "바닷가 사진. ㄱ=왼쪽 해안 절벽, ㄴ=가운데 구멍이 뚫린 아치 모양 바위, ㄷ=만 안쪽의 모래사장.",
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
    "explanation": "ㄱ과 ㄴ은 바닷물의 침식 작용으로 만들어진 지형이고, ㄷ은 바닷물의 퇴적 작용으로 만들어진 지형입니다.",
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
    "id": "s32-u03-o3-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 19,
      "page": 4,
      "sourceId": "sci-32-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "흙의 중요성",
      "concept": "흙은 식물이 양분을 얻고 많은 생물이 사는 곳이며, 만들어지는 데 오랜 시간이 걸린다."
    },
    "prompt": "다음은 무엇에 대한 설명인지 고르세요.",
    "givens": {
      "지문": "• 식물이 양분을 얻는 곳입니다.\n• 많은 생물이 살아가는 곳입니다.\n• 만들어지는 데 오랜 시간이 걸립니다."
    },
    "choices": [
      "흙",
      "공기",
      "나무",
      "바위",
      "금속"
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
    "explanation": "흙은 식물이 양분을 얻는 등 많은 생물이 살아가는 곳입니다. 흙은 흐르는 물에 잘 떠내려가고 만들어지는 데 오랜 시간이 걸립니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기는 2열 배치(①·②, ③·④, ⑤)."
    }
  },
  {
    "id": "s32-u03-o3-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 20,
      "page": 4,
      "sourceId": "sci-32-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "흙을 보존하는 방법",
      "concept": "흙이 드러난 곳은 나무·풀을 심거나 덮개·고정 시설물을 설치해 흐르는 물에 흙이 떠내려가지 않게 보존한다."
    },
    "prompt": "산사태나 도로 공사 등으로 흙이 드러나 있는 곳의 흙을 보존하는 방법으로 옳지 않은 것을 모두 고르세요. (정답 2 개)",
    "givens": null,
    "choices": [
      "흙에 물을 흘려보냅니다.",
      "산사태가 날 때까지 기다립니다.",
      "흙에 나무나 풀을 많이 심습니다.",
      "흙을 덮어 주는 시설물을 설치합니다.",
      "흙을 고정해 주는 시설물을 설치합니다."
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
        1
      ]
    },
    "explanation": "흙을 덮어 주거나 고정해 주는 시설물을 설치하면 흐르는 물에 의해 흙이 떠내려가는 것을 막을 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄이 있음. '(정답 2 개)'는 인쇄본 띄어쓰기 그대로."
    }
  },
  {
    "id": "s32-u03-o4-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 1,
      "page": 1,
      "sourceId": "sci-32-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "화단 흙과 운동장 흙의 촉감 비교",
      "concept": "화단 흙은 손으로 만지면 약간 부드럽고 운동장 흙은 거칠거칠하다."
    },
    "prompt": "화단 흙과 운동장 흙 중에서 만졌을 때 더 부드러운 흙을 쓰세요.",
    "givens": {
      "그림 설명": [
        "▲화단 흙",
        "▲운동장 흙"
      ],
      "답란": "(      ) 흙"
    },
    "choices": null,
    "figure": "assets/bank/s32-u03/s4-q01.webp",
    "figureNote": "화단 흙(어두운 갈색 흙더미)과 운동장 흙(밝은 갈색 모래 더미) 사진 두 장, 각각 ▲화단 흙, ▲운동장 흙 캡션.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "화단 흙",
      "accepted": [
        "화단 흙",
        "화단흙",
        "화단"
      ]
    },
    "explanation": "손으로 만졌을 때 화단 흙은 약간 부드럽고, 운동장 흙은 거칠거칠합니다.",
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
    "id": "s32-u03-o4-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 2,
      "page": 1,
      "sourceId": "sci-32-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "운동장 흙의 특징",
      "concept": "운동장 흙은 주로 모래나 흙 알갱이로 이루어져 있고 알갱이가 크며 밝은 갈색이다."
    },
    "prompt": "운동장 흙에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "잘 뭉쳐집니다.",
      "어두운 갈색입니다.",
      "만지면 약간 부드럽습니다.",
      "주로 모래나 흙 알갱이만 보입니다.",
      "알갱이의 크기가 큰 것도 있고 작은 것도 있습니다."
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
    "explanation": "운동장 흙은 주로 모래나 흙 알갱이만 보이며 알갱이의 크기가 크고 밝은 갈색입니다.",
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
    "id": "s32-u03-o4-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 3,
      "page": 1,
      "sourceId": "sci-32-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T02",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "흙의 물 빠짐 비교 실험의 변인 통제",
      "concept": "두 흙의 물 빠짐을 공정하게 비교하려면 흙의 종류만 다르게 하고 흙의 양·물의 양 등 나머지 조건은 모두 같게 한다."
    },
    "prompt": "운동장 흙과 화단 흙의 물 빠짐을 비교하는 실험을 할 때 다르게 해야 하는 조건을 쓰고, 그렇게 생각한 까닭을 쓰세요.",
    "givens": {
      "그림 설명": [
        "운동장 흙 ▶",
        "◀ 화단 흙"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-u03/s4-q03.webp",
    "figureNote": "물 빠짐 장치(거꾸로 세운 페트병 윗부분 속에 거름종이와 흙) 두 개에 손으로 비커의 물을 붓는 그림. 왼쪽 장치 '운동장 흙 ▶', 오른쪽 장치 '◀ 화단 흙' 표시.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "흙의 종류만 다르게 하고 나머지 조건을 같게 해 주어야 운동장 흙과 화단 흙의 물 빠짐을 비교할 수 있습니다.",
      "rubric": {
        "required": [
          "다르게 할 조건: 흙의 종류",
          "나머지 조건을 같게 해야 두 흙의 물 빠짐을 비교할 수 있음"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "정답: 흙의 종류를 다르게 하는 까닭을 정확하게 서술한 경우 (100%)",
          "부분 정답: 흙의 종류만 다르게 하는 까닭을 부족하게 서술한 경우 (50%)"
        ]
      }
    },
    "explanation": "운동장 흙과 화단 흙의 물 빠짐을 비교하기 위해서 흙의 종류만을 다르게 하고 다른 조건들은 같게 해 주어야 합니다.\n[채점 기준] 정답: 흙의 종류를 다르게 하는 까닭을 정확하게 서술한 경우 (100%) / 부분 정답: 흙의 종류만 다르게 하는 까닭을 부족하게 서술한 경우 (50%)",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준 표의 행 머리글은 '정답'과 '부분 정답'으로 인쇄됨. 빠른 정답과 해설의 모범 답안 문구는 같음."
    }
  },
  {
    "id": "s32-u03-o4-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 4,
      "page": 1,
      "sourceId": "sci-32-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "물에 뜬 물질 관찰",
      "concept": "화단 흙에는 식물 뿌리·나뭇가지·죽은 곤충 같은 물에 뜨는 물질이 많고 운동장 흙에는 거의 없다."
    },
    "prompt": "각각의 흙에 물을 붓고 물에 뜬 물질을 건져서 관찰했을 때 식물의 뿌리, 작은 나뭇가지, 죽은 곤충, 나뭇잎 조각 등과 같은 물질을 볼 수 있는 흙을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 화단 흙",
        "ㄴ. 운동장 흙"
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
        "화단 흙",
        "화단흙"
      ]
    },
    "explanation": "화단 흙에서는 식물의 뿌리, 작은 나뭇가지, 죽은 곤충 등의 뜬 물질을 관찰할 수 있고, 운동장 흙에서는 물에 뜬 물질이 거의 없습니다.",
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
    "id": "s32-u03-o4-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 5,
      "page": 1,
      "sourceId": "sci-32-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "부식물",
      "concept": "식물 뿌리·나뭇잎 조각·죽은 곤충 등이 오랫동안 썩어 만들어진 부식물은 식물의 영양분이 되어 식물이 잘 자라게 한다."
    },
    "prompt": "다음은 식물이 잘 자라는 흙의 특징입니다. 빈칸에 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "식물은 대부분 물 빠짐이 적절하고, 식물의 뿌리나 나뭇잎 조각 등이 오랫동안 썩어서 만들어진 □(이)가 많은 흙에서 잘 자랍니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "부식물",
      "accepted": [
        "부식물"
      ]
    },
    "explanation": "식물의 뿌리나 나뭇잎 조각 또는 죽은 곤충 등이 오랫동안 썩어서 만들어진 것을 부식물이라고 합니다. 부식물은 식물에 필요한 영양분이 되어 식물이 잘 자랄 수 있도록 도와줍니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문의 빈칸은 인쇄본에서 빈 네모 칸이며 □로 옮김."
    }
  },
  {
    "id": "s32-u03-o4-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 6,
      "page": 1,
      "sourceId": "sci-32-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "과자로 흙이 만들어지는 과정 모형 실험",
      "concept": "과자 흔들기 모형은 바위가 부서져 흙이 되는 과정을 나타내지만, 실제 흙은 훨씬 오랜 시간에 걸쳐 만들어진다."
    },
    "prompt": "투명한 플라스틱 통 안에 과자를 넣은 뒤 세게 흔들면서 과자의 모습을 관찰하였습니다. 이에 대한 설명으로 옳지 않은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 플라스틱 통을 흔들면 과자의 크기가 작아지고, 가루가 생깁니다.",
        "ㄴ. 과자에서 가루가 생겨나는 과정은 실제 바위나 돌이 흙이 되는 과정을 의미합니다.",
        "ㄷ. 과자가 가루가 되는 데 걸리는 시간과 실제 바위나 돌이 흙이 되는 데 걸리는 시간은 비슷합니다."
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
      "answer": "ㄷ",
      "accepted": [
        "ㄷ"
      ]
    },
    "explanation": "과자가 부서져서 만들어진 가루는 짧은 시간 동안 만들어지지만 자연에서 만들어진 흙은 오랜 시간이 걸려서 만들어집니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄이 있음."
    }
  },
  {
    "id": "s32-u03-o4-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 7,
      "page": 2,
      "sourceId": "sci-32-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "바위나 돌이 부서지는 원인",
      "concept": "바위나 돌은 흐르는 물, 바람, 나무뿌리, 얼음 등의 작용으로 작게 부서진다."
    },
    "prompt": "바위나 돌을 작게 부서지게 하는 직접적인 원인을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "흙",
      "달",
      "물",
      "곤충",
      "나무뿌리"
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "바위나 돌은 흐르는 물이나 바람, 나무뿌리, 얼음 등에 의한 여러 가지 과정으로 작게 부서집니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'(정답 2개)'는 인쇄본에서 '정답'과 '2' 사이, '2'와 '개' 사이 간격이 조금 넓게 보임."
    }
  },
  {
    "id": "s32-u03-o4-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 8,
      "page": 2,
      "sourceId": "sci-32-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "흙이 만들어지는 과정",
      "concept": "흙은 작게 부서진 바위·돌 알갱이와 생물이 썩어 생긴 물질이 섞여 오랜 시간에 걸쳐 만들어진다."
    },
    "prompt": "흙에 대한 설명으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "바위나 돌이 뭉쳐져 만들어집니다.",
      "흙이 만들어지는 과정은 짧은 시간이 걸립니다.",
      "큰 바위나 돌에서 생물이 썩으면 만들어집니다.",
      "바위나 돌에서 흙이 생성되는 데 오랜 시간이 걸립니다.",
      "작게 부서진 바위나 돌 알갱이와 생물이 썩어 생긴 물질들이 섞여 만들어집니다."
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "흙은 작게 부서진 바위나 돌 알갱이와 생물이 썩어 생긴 물질들이 섞여 만들어집니다. 바위나 돌에서 흙이 생성되는 데 오랜 시간이 걸립니다.",
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
    "id": "s32-u03-o4-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 9,
      "page": 2,
      "sourceId": "sci-32-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "흙 언덕 실험에서 색 모래의 역할",
      "concept": "흙 언덕 위쪽에 색 모래를 뿌리면 흐르는 물에 의해 흙이 이동하는 모습을 눈으로 쉽게 확인할 수 있다."
    },
    "prompt": "위 실험에서 색 모래를 뿌리는 까닭을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "[09~10] 다음은 흐르는 물에 의한 지표의 변화를 관찰하는 실험 과정입니다. 물음에 답하세요.",
      "실험 과정": [
        "ㄱ. 사각 쟁반에 흙 언덕을 만듭니다.",
        "ㄴ. 색 모래를 흙 언덕 위쪽에 뿌립니다.",
        "ㄷ. 흙 언덕 위쪽에서 물을 흘려보냅니다."
      ],
      "보기": [
        "가. 흙을 잘 쌓이게 하기 위해서입니다.",
        "나. 흙을 잘 깎이게 하기 위해서입니다.",
        "다. 물을 더 빠르게 흐르게 하기 위해서입니다.",
        "라. 흙이 이동하는 모습을 쉽게 알아보기 위해서입니다."
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
      "answer": "라",
      "accepted": [
        "라"
      ]
    },
    "explanation": "흙 언덕에 색 모래를 뿌리면 흐르는 물에 의해 흙이 어떻게 이동하는지 쉽게 볼 수 있습니다.",
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
    "id": "s32-u03-o4-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 10,
      "page": 2,
      "sourceId": "sci-32-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "흙 언덕에서 흙이 쌓이는 곳",
      "concept": "흐르는 물은 흙 언덕 위쪽의 흙을 깎아 운반한 뒤 아래쪽에 쌓는다."
    },
    "prompt": "흙 언덕의 위쪽에서 물을 흘려보냈을 때 흙이 가장 많이 쌓이는 곳을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "지문": "[09~10] 다음은 흐르는 물에 의한 지표의 변화를 관찰하는 실험 과정입니다. 물음에 답하세요.",
      "실험 과정": [
        "ㄱ. 사각 쟁반에 흙 언덕을 만듭니다.",
        "ㄴ. 색 모래를 흙 언덕 위쪽에 뿌립니다.",
        "ㄷ. 흙 언덕 위쪽에서 물을 흘려보냅니다."
      ],
      "보기": [
        "가. 흙 언덕의 위쪽",
        "나. 흙 언덕의 아래쪽",
        "다. 흙 언덕의 중간 부분"
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
      "answer": "나",
      "accepted": [
        "나",
        "흙 언덕의 아래쪽"
      ]
    },
    "explanation": "흙 언덕에서 흙이 가장 많이 깎인 곳은 흙 언덕의 위쪽이고, 흙이 가장 많이 쌓인 곳은 흙 언덕의 아래쪽입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "09~10의 공통 지문은 2쪽 왼쪽 단에, 10번 발문은 2쪽 오른쪽 단 위에 인쇄됨."
    }
  },
  {
    "id": "s32-u03-o4-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 11,
      "page": 2,
      "sourceId": "sci-32-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "흐르는 물의 작용",
      "concept": "흐르는 물은 지표를 깎고(침식) 옮기고(운반) 쌓으며(퇴적) 오랜 시간에 걸쳐 지표를 변화시킨다."
    },
    "prompt": "흐르는 물의 작용에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "지표의 모습을 변화시킵니다.",
      "큰 바위나 돌, 흙을 깎기도 합니다.",
      "모래나 흙을 낮은 곳에 쌓아 놓습니다.",
      "바위나 모래, 흙을 다른 곳으로 운반합니다.",
      "짧은 시간 동안 침식 작용, 운반 작용, 퇴적 작용이 동시에 일어나 지표를 변화시킵니다."
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
    "explanation": "흐르는 물은 지표를 깎아 돌이나 흙 등을 낮은 곳으로 운반하여 쌓아 놓습니다. 흐르는 물은 오랜 시간에 걸쳐 지표를 변화시킵니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄이 있음."
    }
  },
  {
    "id": "s32-u03-o4-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 12,
      "page": 2,
      "sourceId": "sci-32-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "지표의 특징",
      "concept": "지표에는 바위·돌·흙 등이 있으며 흐르는 물에 의해 그 모습이 천천히 변한다."
    },
    "prompt": "지표에 대한 설명으로 옳지 않은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 지표의 모습은 변하지 않습니다.",
        "ㄴ. 지표에는 바위나 돌, 흙 등이 있습니다.",
        "ㄷ. 흐르는 물은 지표의 모습을 천천히 변화시킵니다."
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
        "ㄱ"
      ]
    },
    "explanation": "지표의 모습은 흐르는 물에 의해 천천히 변화할 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄이 있음."
    }
  },
  {
    "id": "s32-u03-o4-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 13,
      "page": 3,
      "sourceId": "sci-32-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "강 상류의 특징",
      "concept": "강 상류는 큰 바위나 돌이 많고 강폭이 좁으며 경사가 급하다."
    },
    "prompt": "위 ㄱ과 ㄴ 중 다음에서 설명하는 곳은 어디인지 기호를 쓰세요.",
    "givens": {
      "지문": "[13~14] 다음은 강 주변의 모습입니다. 물음에 답하세요.\n• 큰 바위나 돌이 많습니다.\n• 강폭이 좁고, 강의 경사가 급합니다.\n• 산이나 계곡을 많이 볼 수 있습니다."
    },
    "choices": null,
    "figure": "assets/bank/s32-u03/s4-q13.webp",
    "figureNote": "강의 상류에서 하류(바다)까지 이어지는 강 주변 단면 그림. 산 위쪽 상류 부분에 ㄱ, 바다 가까운 구불구불한 하류 부분에 ㄴ이 표시됨.",
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
    "explanation": "큰 바위나 돌이 많고, 강폭이 좁으며, 강의 경사가 급한 곳은 강 상류입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "설명 세 줄은 상자 안의 글머리표(•) 목록으로 인쇄됨."
    }
  },
  {
    "id": "s32-u03-o4-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 14,
      "page": 3,
      "sourceId": "sci-32-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "강 하류에서 활발한 작용",
      "concept": "강 하류에서는 침식 작용보다 퇴적 작용이 더 활발하게 일어난다."
    },
    "prompt": "ㄴ에서는 침식 작용과 퇴적 작용 중 어느 것이 더 활발하게 일어나는지 쓰세요.",
    "givens": {
      "지문": "[13~14] 다음은 강 주변의 모습입니다. 물음에 답하세요.",
      "답란": "(        ) 작용"
    },
    "choices": null,
    "figure": "assets/bank/s32-u03/s4-q13.webp",
    "figureNote": "강의 상류에서 하류(바다)까지 이어지는 강 주변 단면 그림. 산 위쪽 상류 부분에 ㄱ, 바다 가까운 구불구불한 하류 부분에 ㄴ이 표시됨.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "퇴적 작용",
      "accepted": [
        "퇴적 작용",
        "퇴적작용",
        "퇴적"
      ]
    },
    "explanation": "ㄴ은 강 하류입니다. 강 하류에서는 침식 작용보다 퇴적 작용이 더 활발하게 일어납니다.",
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
    "id": "s32-u03-o4-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 15,
      "page": 3,
      "sourceId": "sci-32-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "강 상류에서 일어나는 작용",
      "concept": "강 상류에서는 바위나 돌을 깎는 침식 작용이 퇴적 작용보다 활발하다."
    },
    "prompt": "강 상류에서 일어나는 작용으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "운반 작용이 가장 활발하게 일어납니다.",
      "돌이나 모래, 흙을 운반하는 작용만 일어납니다.",
      "퇴적 작용이 침식 작용보다 활발하게 일어납니다.",
      "큰 바위나 돌을 깎는 침식 작용이 퇴적 작용보다 활발하게 일어납니다.",
      "침식 작용, 운반 작용, 퇴적 작용이 모두 일어나지만 퇴적 작용이 가장 활발하게 일어납니다."
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
    "explanation": "강 상류에서는 큰 바위나 돌을 깎는 침식 작용이 퇴적 작용보다 활발하게 일어납니다.",
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
    "id": "s32-u03-o4-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 16,
      "page": 3,
      "sourceId": "sci-32-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "바닷물의 퇴적 작용으로 만들어진 지형",
      "concept": "모래사장과 갯벌은 바닷물의 퇴적 작용으로 작은 모래나 흙 알갱이가 오랜 시간 쌓여 만들어진 지형이다."
    },
    "prompt": "다음 바닷가 지형들의 공통점을 모두 고르세요. (정답 2개)",
    "givens": {
      "그림 설명": [
        "▲모래사장",
        "▲갯벌"
      ]
    },
    "choices": [
      "만들어지는 데 짧은 시간이 걸립니다.",
      "바닷물의 침식 작용으로 만들어졌습니다.",
      "바닷물의 퇴적 작용으로 만들어졌습니다.",
      "바위나 작은 돌이 쌓여서 만들어졌습니다.",
      "강 하류에서 주로 일어나는 물의 작용과 같은 작용으로 만들어졌습니다."
    ],
    "figure": "assets/bank/s32-u03/s4-q16.webp",
    "figureNote": "모래사장 사진과 갯벌 사진 두 장, 각각 ▲모래사장, ▲갯벌 캡션.",
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
    "explanation": "모래사장과 갯벌은 강 하류에서 주로 일어나는 물의 작용과 같이 바닷물의 퇴적 작용으로 만들어진 지형입니다. 만들어지는 데 오랜 시간이 걸리며, 작은 모래나 흙 알갱이들이 쌓여 만들어집니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'(정답 2개)'는 줄바꿈되어 '2 개)'가 다음 줄에 인쇄됨."
    }
  },
  {
    "id": "s32-u03-o4-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 17,
      "page": 3,
      "sourceId": "sci-32-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "바닷물의 침식 작용으로 만들어진 지형",
      "concept": "바닷물의 침식 작용은 바닷가 절벽을 깎아 구멍(해식 동굴) 등을 만들고, 퇴적 작용은 모래사장을 만든다."
    },
    "prompt": "바닷물의 침식 작용으로 만들어진 지형을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. [사진]",
        "ㄴ. [사진]"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s32-u03/s4-q17.webp",
    "figureNote": "<보기> 상자 안 사진 두 장. ㄱ: 바닷가 바위 절벽에 구멍(동굴)이 뚫린 모습. ㄴ: 모래가 넓게 펼쳐진 해변(모래사장).",
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
    "explanation": "ㄱ은 바닷물의 침식 작용으로 절벽에 구멍이 뚫린 모습이고, ㄴ은 바닷물의 퇴적 작용으로 모래가 넓게 펼쳐져 있는 모습입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기> 항목 ㄱ, ㄴ은 글 없이 사진만 인쇄됨."
    }
  },
  {
    "id": "s32-u03-o4-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 18,
      "page": 3,
      "sourceId": "sci-32-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "흙을 보존해야 하는 까닭",
      "concept": "흙은 많은 생물의 터전이고 식물에 양분을 주며, 만들어지는 데 오래 걸리고 오염되면 되돌리기 어려워 보존해야 한다."
    },
    "prompt": "흙을 보존해야 하는 까닭으로 옳은 것을 <보기>에서 모두 골라 기호를 쓰세요. (정답 2개)",
    "givens": {
      "보기": [
        "ㄱ. 흙은 금방 만들어집니다.",
        "ㄴ. 흙은 오염되어도 쉽게 회복됩니다.",
        "ㄷ. 흙 속에는 많은 생물들이 살고 있습니다.",
        "ㄹ. 식물은 흙에서 필요한 양분을 얻어 살아갑니다."
      ],
      "답란": "(      ), (      )"
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ, ㄹ",
      "accepted": [
        "ㄷ, ㄹ",
        "ㄷ,ㄹ",
        "ㄹ, ㄷ",
        "ㄷㄹ",
        "ㄹ,ㄷ"
      ]
    },
    "explanation": "흙은 만들어지기까지 오랜 시간이 걸리며, 한번 오염된 흙은 다시 깨끗하게 되돌리기 어렵습니다.",
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
    "id": "s32-u03-o4-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 19,
      "page": 4,
      "sourceId": "sci-32-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "흙을 보존하는 방법",
      "concept": "나무와 풀을 심거나 흙을 덮고 고정하는 시설물을 설치하면 흐르는 물에 흙이 깎여 나가는 것을 막을 수 있다."
    },
    "prompt": "흐르는 물의 작용으로부터 흙을 잘 보존하는 방법으로 옳지 않은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "흙을 덮어 주는 시설물을 설치합니다.",
      "흙을 고정해 주는 시설물을 설치합니다.",
      "도로 공사를 하여 흙을 평평하게 만듭니다.",
      "나무나 풀을 많이 심어 흙이 떠내려가지 않게 합니다.",
      "흙에서 땅굴을 파서 사는 두더지를 많이 풀어 놓습니다."
    ],
    "figure": null,
    "figureNote": null,
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
    "explanation": "나무나 풀이 흙을 덮고 있거나 흙을 덮어 주거나 고정해 주는 시설물이 있는 곳은 흙이 잘 보존됩니다. 땅 밑에 두더지에 의해 땅굴이 많이 생기면 흙이 약해져 비가 오면 흙이 더 잘 흘러내려 갈 수 있습니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄이 있음."
    }
  },
  {
    "id": "s32-u03-o4-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 20,
      "page": 4,
      "sourceId": "sci-32-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등 3-2",
      "unit": "Ⅲ. 지표의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "흙의 침식을 막는 시설물",
      "concept": "비탈의 흙을 고정하는 격자 시설물이나 돌 축대는 흐르는 물의 침식 작용으로 흙이 깎여 나가는 것을 막는다."
    },
    "prompt": "괄호에 들어갈 알맞은 말을 골라 쓰세요.",
    "givens": {
      "지문": "흐르는 물의 ( 침식, 퇴적 ) 작용으로부터 흙이 깎여 나가는 것을 막을 수 있는 시설물입니다."
    },
    "choices": null,
    "figure": "assets/bank/s32-u03/s4-q20.webp",
    "figureNote": "그림 두 장. 위: 흙 비탈면에 격자 모양 고정 시설물을 설치한 모습. 아래: 물길 양옆과 바닥에 돌을 쌓아 만든 시설물(돌 축대·사방댐 모양).",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "침식",
      "accepted": [
        "침식",
        "침식 작용",
        "침식작용"
      ]
    },
    "explanation": "흐르는 물의 침식 작용으로부터 흙이 떠내려가지 않도록 막는 시설물입니다.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-10-09",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이"
    }
  }
];
