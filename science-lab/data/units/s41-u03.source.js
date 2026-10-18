// 4-1 Ⅲ 땅의 변화 — 단원평가 원문 80문항(시매쓰DMC 최다빈출 단원평가 세트1·2·3·4). 시험지를 그대로 옮기고 정답 및 풀이와 대조했다.
// 원장 지시(2026-10-09): 원문을 그대로 문제은행에 쓴다(전에는 Supabase에만 있었음). 그림은 시험지에서 잘라 낸 것(assets/bank/s41-u03/).
export const source = [
  {
    "id": "s41-u03-o1-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 1,
      "page": 1,
      "sourceId": "sci-41-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "흙 언덕 실험에서 색 모래의 이동",
      "concept": "흐르는 물은 흙 언덕 윗부분의 흙과 모래를 깎아 아랫부분으로 운반해 쌓는다."
    },
    "prompt": "위 실험에서 색 모래의 변화를 관찰한 결과로 알맞은 것은 어느 것입니까?",
    "givens": {
      "지문": "[01~02] 다음과 같이 흙 언덕을 만들어 위쪽에 색 모래를 뿌린 후 흙 언덕의 위쪽에서 물을 천천히 흘려보냈습니다. 물음에 답하시오."
    },
    "choices": [
      "색 모래가 사라진다.",
      "색 모래가 하얗게 변한다.",
      "색 모래가 흙 언덕 윗부분으로 모인다.",
      "색 모래가 흙 언덕 중간 부분에 쌓인다.",
      "색 모래가 흙 언덕 아랫부분으로 이동한다."
    ],
    "figure": "assets/bank/s41-u03/s1-q01.webp",
    "figureNote": "쟁반 위 흙 언덕 꼭대기에 색(청록색) 모래를 뿌려 놓고, 장갑 낀 손이 비커로 물을 붓는 그림.",
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
    "explanation": "흙 언덕의 위쪽에서 물을 흘려보내면 물이 흐르면서 윗부분의 흙과 색 모래를 깎고 운반하여 아랫부분에 쌓아 둡니다.\n[자료 검토] 제시한 조건의 모형과 전형적인 강 지형을 비교합니다. 여러 작용이 함께 나타날 수 있으며 모든 실제 강의 지점/시간에 같은 결과를 단정하지 않습니다.",
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
    "id": "s41-u03-o1-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 2,
      "page": 1,
      "sourceId": "sci-41-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "흙 언덕 위·아래의 침식과 퇴적",
      "concept": "경사진 흙 언덕에서는 윗부분에서 침식, 아랫부분에서 퇴적이 더 활발하다."
    },
    "prompt": "다음은 위 실험의 결과를 정리한 내용입니다. ㉠, ㉡에 들어갈 알맞은 말을 골라 쓰시오.",
    "givens": {
      "지문": "[01~02] 다음과 같이 흙 언덕을 만들어 위쪽에 색 모래를 뿌린 후 흙 언덕의 위쪽에서 물을 천천히 흘려보냈습니다. 물음에 답하시오.\n흙 언덕의 ㉠ ( 윗, 아랫 )부분에서는 침식 작용이 더 활발하게 일어나고, 흙 언덕의 ㉡ ( 윗, 아랫 )부분에서는 퇴적 작용이 더 활발하게 일어납니다."
    },
    "choices": null,
    "figure": "assets/bank/s41-u03/s1-q01.webp",
    "figureNote": "쟁반 위 흙 언덕 꼭대기에 색(청록색) 모래를 뿌려 놓고, 장갑 낀 손이 비커로 물을 붓는 그림.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 윗, ㉡ 아랫",
      "accepted": [
        "㉠ 윗, ㉡ 아랫",
        "㉠윗, ㉡아랫",
        "윗, 아랫",
        "윗,아랫",
        "㉠-윗, ㉡-아랫",
        "위, 아래"
      ]
    },
    "explanation": "흙 언덕의 윗부분에서는 침식 작용이 더 활발하게 일어나고, 흙 언덕의 아랫부분에서는 퇴적 작용이 더 활발하게 일어납니다.\n[자료 검토] 제시한 조건의 모형과 전형적인 강 지형을 비교합니다. 여러 작용이 함께 나타날 수 있으며 모든 실제 강의 지점/시간에 같은 결과를 단정하지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란 형식: ㉠ (   ), ㉡ (   ). 응답은 괄호 안 두 낱말."
    }
  },
  {
    "id": "s41-u03-o1-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 3,
      "page": 1,
      "sourceId": "sci-41-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "운반 작용의 뜻",
      "concept": "흐르는 물이 돌이나 흙을 다른 곳으로 옮기는 것을 운반 작용이라고 한다."
    },
    "prompt": "다음은 흐르는 물에 의한 작용입니다. 이 작용을 무엇이라고 하는지 쓰시오.",
    "givens": {
      "지문": "돌이나 흙 등을 다른 곳으로 이동시키는 것을 말합니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "운반 작용",
      "accepted": [
        "운반 작용",
        "운반작용",
        "운반"
      ]
    },
    "explanation": "돌이나 흙 등을 다른 곳으로 이동시키는 것을 운반 작용이라고 합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란이 「(        ) 작용」으로 인쇄되어 있어 학생은 「운반」만 쓸 수 있음."
    }
  },
  {
    "id": "s41-u03-o1-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 4,
      "page": 1,
      "sourceId": "sci-41-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "강 상류의 특징",
      "concept": "강 상류는 강폭이 좁고 경사가 급하며 큰 바위와 돌, 계곡과 폭포가 많다."
    },
    "prompt": "강 상류에 대해 바르게 설명한 사람을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "지문": "• 단비: 강폭이 좁습니다.\n• 다래: 경사가 완만합니다.\n• 하늘: 큰 바위나 돌이 많습니다.\n• 노을: 계곡이나 폭포를 많이 볼 수 있습니다."
    },
    "choices": [
      "단비, 다래",
      "단비, 하늘",
      "다래, 하늘",
      "단비, 하늘, 노을",
      "다래, 하늘, 노을"
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
    "explanation": "강 상류는 강폭이 좁고, 경사가 급합니다. 또한 큰 바위나 돌이 많고 계곡이나 폭포를 많이 볼 수 있습니다.\n[자료 검토] 제시한 조건의 모형과 전형적인 강 지형을 비교합니다. 여러 작용이 함께 나타날 수 있으며 모든 실제 강의 지점/시간에 같은 결과를 단정하지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "상자 안 이름(단비·다래·하늘·노을)은 굵게 인쇄됨."
    }
  },
  {
    "id": "s41-u03-o1-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 5,
      "page": 1,
      "sourceId": "sci-41-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "강 상류·하류 지형과 주된 작용",
      "concept": "강 하류에서는 퇴적 작용이, 강 상류에서는 침식 작용이 더 활발하다."
    },
    "prompt": "다음은 강 주변 지형의 모습입니다. 각 지형에서 주로 일어나는 흐르는 물에 의한 작용을 알맞게 짝 지은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "침식 작용 / 퇴적 작용",
      "침식 작용 / 침식 작용",
      "침식 작용 / 운반 작용",
      "퇴적 작용 / 퇴적 작용",
      "퇴적 작용 / 침식 작용"
    ],
    "figure": "assets/bank/s41-u03/s1-q05.webp",
    "figureNote": "사진 두 장: ㉠ 넓고 완만하게 굽이진 강과 모래밭(강 하류), ㉡ 큰 바위 사이로 물이 흘러내리는 계곡(강 상류).",
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
    "explanation": "㉠은 강 하류, ㉡은 강 상류의 모습입니다. 강 하류는 퇴적 작용이 침식 작용보다 활발하게 일어나고, 강 상류는 침식 작용이 퇴적 작용보다 활발하게 일어납니다.\n[자료 검토] 제시한 조건의 모형과 전형적인 강 지형을 비교합니다. 여러 작용이 함께 나타날 수 있으며 모든 실제 강의 지점/시간에 같은 결과를 단정하지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기가 표 형식: 열 머리 ㉠ / ㉡."
    }
  },
  {
    "id": "s41-u03-o1-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 6,
      "page": 2,
      "sourceId": "sci-41-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T04",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "화산의 정의",
      "concept": "화산은 땅속 깊은 곳에서 암석이 녹은 마그마가 땅을 뚫고 나와 만들어진 지형이다."
    },
    "prompt": "화산이란 무엇인지 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "땅속 깊은 곳에서 암석이 녹아 만들어진 마그마가 땅을 뚫고 나오면서 만들어진 지형이다.",
      "rubric": {
        "required": [
          "마그마가 땅 밖으로 분출해 만들어진 지형이라는 뜻"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "화산의 정의에 대해 바르게 썼으면 정답으로 합니다."
        ]
      }
    },
    "explanation": "우리나라의 한라산과 같이 땅속 깊은 곳에서 암석이 녹아 만들어진 마그마가 땅을 뚫고 나오면서 만들어진 지형을 화산이라고 합니다.\n[채점 기준] 화산의 정의에 대해 바르게 썼으면 정답으로 합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준에 비율 표기가 없음(단일 기준이라 100%로 기록)."
    }
  },
  {
    "id": "s41-u03-o1-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 7,
      "page": 2,
      "sourceId": "sci-41-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "화산과 화산이 아닌 산 분류",
      "concept": "후지산은 화산이고 안나푸르나산과 지리산은 화산이 아니다."
    },
    "prompt": "다음은 화산과 화산이 아닌 산을 분류한 것입니다. 잘못 분류한 산의 이름을 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s41-u03/s1-q07.webp",
    "figureNote": "분류표. 화산: 킬라우에아산·베수비오산·화이트 아일랜드산. 화산이 아닌 산: 안나푸르나산·후지산·지리산. 잘못 분류한 이름을 찾는다.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "후지산",
      "accepted": [
        "후지산",
        "후지 산"
      ]
    },
    "explanation": "킬라우에아산, 베수비오산, 화이트 아일랜드산, 후지산은 화산이고, 안나푸르나산, 지리산은 화산이 아닌 산입니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 「잘못」에 밑줄."
    }
  },
  {
    "id": "s41-u03-o1-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 8,
      "page": 2,
      "sourceId": "sci-41-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "화산 분출물의 특징",
      "concept": "화산재는 크기가 2 mm 이하인 매우 작은 화산 분출물이다."
    },
    "prompt": "화산 활동이 일어날 때 나오는 물질에 대한 설명으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "화산 분출물이라고 한다.",
      "화산재는 크기가 2 cm 이상으로 크다.",
      "화산 가스는 여러 가지 기체가 섞여 있다.",
      "화산 암석 조각은 크기와 모양이 다양하다.",
      "화산 활동이 일어날 때 여러 가지 물질이 나온다."
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
    "explanation": "화산 활동이 일어날 때 여러 가지 물질이 나오는데, 이를 화산 분출물이라고 합니다. 화산재는 크기가 2 mm 이하로 매우 작은 화산 분출물입니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 「않은」에 밑줄. 보기 ①은 주어 없이 「화산 분출물이라고 한다.」로 인쇄됨."
    }
  },
  {
    "id": "s41-u03-o1-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 9,
      "page": 2,
      "sourceId": "sci-41-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "용암의 특징",
      "concept": "용암은 마그마에서 기체가 빠져나간 매우 뜨거운 액체 물질로 땅을 따라 흘러내린다."
    },
    "prompt": "용암에 대한 설명으로 알맞은 것을 두 가지 고르시오.",
    "givens": null,
    "choices": [
      "매우 차갑다.",
      "고체 상태이다.",
      "대부분 수증기이다.",
      "땅을 따라 흘러내린다.",
      "마그마가 땅 밖으로 분출하면서 기체 물질이 빠져나간 것이다."
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
    "explanation": "용암은 마그마가 땅 밖으로 분출하면서 기체 물질이 빠져나간 화산 분출물로, 매우 뜨거운 액체 상태의 물질이며, 땅을 따라 흘러내립니다. 대부분 수증기인 화산 분출물은 화산 가스입니다.",
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
    "id": "s41-u03-o1-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 10,
      "page": 2,
      "sourceId": "sci-41-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "화산 활동 모형 실험 결과",
      "concept": "화산 활동 모형에서 흘러나온 마시멜로는 시간이 지나면 식어서 굳는다."
    },
    "prompt": "다음 <보기>에서 위 실험의 결과로 알맞지 않은 것을 골라 기호를 쓰시오.",
    "givens": {
      "지문": "[10~11] 다음은 화산 활동 모형을 만드는 실험 과정입니다. 물음에 답하시오.\n<과정>\n(가) 알루미늄 포일 위에 마시멜로를 올려놓고 빨간색 식용 색소를 뿌립니다.\n(나) 알루미늄 포일로 마시멜로를 감싼 후 윗부분을 조금 열어 두고 은박 접시 위에 올려놓습니다.\n(다) 은박 접시를 가열 장치에 올려놓고 가열하면서 나타나는 현상을 관찰합니다.",
      "보기": [
        "㉠ 윗부분에서 연기가 피어오른다.",
        "㉡ 녹은 마시멜로가 윗부분으로 흘러나온다.",
        "㉢ 녹아서 흘러나온 마시멜로는 시간이 지나도 굳지 않는다."
      ],
      "학습 안내": "원문/교사 시범 자료를 읽는 문제입니다. 학생이 가열·뜨거운 재료·연기 관찰을 따라 하지 않습니다. 모형의 물질·온도·크기·분출 원리는 실제와 다릅니다."
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
        "ㄷ"
      ]
    },
    "explanation": "화산 활동 모형에서 흘러나온 마시멜로는 시간이 지나면 식어서 굳습니다.\n[자료 검토] 원문/교사 시범 자료를 읽는 문제입니다. 학생이 가열·뜨거운 재료·연기 관찰을 따라 하지 않습니다. 모형의 물질·온도·크기·분출 원리는 실제와 다릅니다. 연기라는 표현은 나오는 모습의 대응이며 실제 화산 가스와 성분이 같다는 뜻이 아닙니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 「않은」에 밑줄."
    }
  },
  {
    "id": "s41-u03-o1-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 11,
      "page": 2,
      "sourceId": "sci-41-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "화산 활동 모형과 실제 화산 비교",
      "concept": "모형의 연기는 화산 가스, 흘러나온 마시멜로는 용암, 굳은 마시멜로는 용암이 굳은 암석에 해당한다."
    },
    "prompt": "화산 활동 모형과 실제 화산 활동에서 나오는 물질을 비교하여 알맞게 짝 지은 것을 두 가지 고르시오.",
    "givens": {
      "지문": "[10~11] 다음은 화산 활동 모형을 만드는 실험 과정입니다. 물음에 답하시오.\n<과정>\n(가) 알루미늄 포일 위에 마시멜로를 올려놓고 빨간색 식용 색소를 뿌립니다.\n(나) 알루미늄 포일로 마시멜로를 감싼 후 윗부분을 조금 열어 두고 은박 접시 위에 올려놓습니다.\n(다) 은박 접시를 가열 장치에 올려놓고 가열하면서 나타나는 현상을 관찰합니다.",
      "학습 안내": "원문/교사 시범 자료를 읽는 문제입니다. 학생이 가열·뜨거운 재료·연기 관찰을 따라 하지 않습니다. 모형의 물질·온도·크기·분출 원리는 실제와 다릅니다."
    },
    "choices": [
      "연기 / 용암",
      "연기 / 화산 가스",
      "흘러나오는 마시멜로 / 화산재",
      "흘러나오는 마시멜로 / 화산 가스",
      "식어서 굳은 마시멜로 / 용암이 굳어 만들어진 암석"
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
    "explanation": "화산 활동 모형의 연기는 실제 화산 활동의 화산 가스, 화산 활동 모형의 흘러나오는 마시멜로는 실제 화산 활동의 용암, 화산 활동 모형의 식어서 굳은 마시멜로는 실제 화산 활동의 용암이 굳어 만들어진 암석과 비교할 수 있습니다.\n[자료 검토] 원문/교사 시범 자료를 읽는 문제입니다. 학생이 가열·뜨거운 재료·연기 관찰을 따라 하지 않습니다. 모형의 물질·온도·크기·분출 원리는 실제와 다릅니다. 연기라는 표현은 나오는 모습의 대응이며 실제 화산 가스와 성분이 같다는 뜻이 아닙니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기가 표 형식: 열 머리 「화산 활동 모형」 / 「실제 화산 활동」."
    }
  },
  {
    "id": "s41-u03-o1-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 12,
      "page": 3,
      "sourceId": "sci-41-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "화성암의 뜻",
      "concept": "마그마가 식어 굳어진 암석을 화성암이라 하며 화강암과 현무암이 대표적이다."
    },
    "prompt": "다음에서 설명하는 것은 무엇인지 쓰시오.",
    "givens": {
      "지문": "화강암, 현무암과 같이 마그마가 식어서 굳어져 만들어진 암석"
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "화성암",
      "accepted": [
        "화성암"
      ]
    },
    "explanation": "마그마가 식어서 굳어져 만들어진 암석을 화성암이라고 합니다. 대표적인 화성암에는 화강암과 현무암이 있습니다.\n[자료 검토] 현재 필수는 현무암·화강암의 관찰과 분류입니다. 냉각 과정과 알갱이 크기 원인은 기존 교재의 연계 심화 자료로 구별합니다. 현무암은 표면 구멍이 없는 표본도 있습니다.",
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
    "id": "s41-u03-o1-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 13,
      "page": 3,
      "sourceId": "sci-41-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "화강암의 특징",
      "concept": "화강암은 마그마가 땅속 깊은 곳에서 천천히 식어 만들어져 알갱이가 크다."
    },
    "prompt": "화강암에 대한 설명으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "대체로 밝은 색이다.",
      "암석을 이루는 알갱이의 크기가 크다.",
      "여러 가지 색깔의 알갱이가 섞여 있다.",
      "화강암을 이용하여 불국사 돌계단을 만들었다.",
      "마그마가 지표 가까이에서 빠르게 식어 만들어진다."
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
    "explanation": "화강암은 마그마가 땅속 깊은 곳에서 천천히 식어 만들어져 암석을 이루는 알갱이의 크기가 큽니다.\n[자료 검토] 현재 필수는 현무암·화강암의 관찰과 분류입니다. 냉각 과정과 알갱이 크기 원인은 기존 교재의 연계 심화 자료로 구별합니다. 현무암은 표면 구멍이 없는 표본도 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 「않은」에 밑줄."
    }
  },
  {
    "id": "s41-u03-o1-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 14,
      "page": 3,
      "sourceId": "sci-41-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T07",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "현무암 표면 구멍의 까닭",
      "concept": "현무암의 구멍은 만들어지는 과정에서 가스가 빠져나가며 생긴 것이다."
    },
    "prompt": "현무암의 표면에 구멍이 있는 까닭을 현무암이 만들어지는 과정과 관련지어 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s41-u03/s1-q14.webp",
    "figureNote": "표면에 작은 구멍이 많은 검은색·적갈색 현무암 돌 여러 개 사진.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "현무암이 만들어지는 과정에서 가스가 빠져나갔기 때문이다.",
      "rubric": {
        "required": [
          "형성 과정에서 가스가 빠져나가 구멍이 생겼다는 내용"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "가스가 빠져나가 구멍이 만들어졌다는 내용이 포함되어 있으면 정답으로 합니다."
        ]
      }
    },
    "explanation": "현무암은 표면에 구멍이 있는 것도 있고, 없는 것도 있습니다. 현무암의 구멍은 현무암이 만들어지는 과정에서 가스가 빠져나가면서 생긴 것입니다.\n[채점 기준] 가스가 빠져나가 구멍이 만들어졌다는 내용이 포함되어 있으면 정답으로 합니다.\n[자료 검토] 현재 필수는 현무암·화강암의 관찰과 분류입니다. 냉각 과정과 알갱이 크기 원인은 기존 교재의 연계 심화 자료로 구별합니다. 현무암은 표면 구멍이 없는 표본도 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준에 비율 표기가 없음(단일 기준이라 100%로 기록)."
    }
  },
  {
    "id": "s41-u03-o1-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 15,
      "page": 3,
      "sourceId": "sci-41-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "화산 활동의 피해와 이로움 구별",
      "concept": "화산 주변의 온천은 화산 활동이 주는 이로운 영향이다."
    },
    "prompt": "화산 활동이 주는 피해로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "용암이 흘러 산불이 발생한다.",
      "화산 활동으로 지진이 발생한다.",
      "화산 주변에 온천이 만들어진다.",
      "화산재로 인해 비행기의 운항이 어려워진다.",
      "화산 암석 조각이 떨어져 자동차가 부서진다."
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
    "explanation": "화산 주변 땅속의 열로 온천을 개발하여 관광 자원으로 이용하는 것은 화산 활동이 주는 이로운 영향입니다.\n[자료 검토] 피해와 이로움의 조건·시점을 구별합니다. 화산재가 덮은 즉시의 피해와 오랜 뒤 일부 토양의 변화는 같은 조건이 아닙니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 「않은」에 밑줄."
    }
  },
  {
    "id": "s41-u03-o1-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 16,
      "page": 3,
      "sourceId": "sci-41-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "화산재가 생활에 미치는 영향",
      "concept": "화산재는 태양 빛을 가려 날씨에 영향을 주고, 쌓이면 땅을 기름지게 한다."
    },
    "prompt": "다음은 화산 활동이 우리 생활에 미치는 영향입니다. 빈칸에 공통으로 들어갈 알맞은 말은 어느 것입니까?",
    "givens": {
      "지문": "• ☐이/가 태양 빛을 가려서 날씨 변화에 영향을 줍니다.\n• ☐이/가 쌓여 오랜 시간이 지나면 땅을 기름지게 만들어 농작물이 잘 자랍니다."
    },
    "choices": [
      "용암",
      "마그마",
      "화산재",
      "화산 가스",
      "화산 암석 조각"
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
    "explanation": "화산재가 태양 빛을 가려서 날씨 변화에 영향을 주는 것은 화산 활동이 주는 피해이고, 화산재가 땅을 기름지게 만드는 것은 화산 활동이 주는 이로운 영향입니다.\n[자료 검토] 피해와 이로움의 조건·시점을 구별합니다. 화산재가 덮은 즉시의 피해와 오랜 뒤 일부 토양의 변화는 같은 조건이 아닙니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "빈칸은 인쇄된 네모 칸(☐로 표기)."
    }
  },
  {
    "id": "s41-u03-o1-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 17,
      "page": 3,
      "sourceId": "sci-41-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "지진 피해",
      "concept": "지진이 일어나면 도로가 갈라지고 건물이 무너지며 사람이 다칠 수 있다."
    },
    "prompt": "다음은 어떤 현상에 의한 피해인지 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s41-u03/s1-q17.webp",
    "figureNote": "그림과 캡션: 도로가 갈라짐, 건물이 무너짐, 사람이 죽거나 다침.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "지진",
      "accepted": [
        "지진"
      ]
    },
    "explanation": "지진이 일어나면 땅이나 도로가 갈라지거나 건물이 무너져 사람이 죽거나 다칠 수 있습니다.\n[자료 검토] 원문의 규모는 지진 자체의 크기를 나타내는 자료로 읽습니다. 특정 장소의 흔들림·피해와 같은 뜻으로 쓰지 않으며 규모만으로 피해 순서를 정하지 않습니다. 지진 발생 원인은 현행 필수 평가에 넣지 않습니다.",
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
    "id": "s41-u03-o1-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 18,
      "page": 4,
      "sourceId": "sci-41-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "지진과 규모",
      "concept": "규모는 지진의 세기를 숫자로 나타내며 숫자가 클수록 강한 지진이다."
    },
    "prompt": "다음 <보기>에서 지진에 대한 알맞은 설명을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 규모는 지진의 세기를 나타낸다.",
        "㉡ 땅이 끊어지면서 흔들리는 현상이다.",
        "㉢ 규모의 숫자가 작을수록 강한 지진이다.",
        "㉣ 지진으로 인해 지진 해일이 발생하기도 한다."
      ]
    },
    "choices": [
      "㉠, ㉡",
      "㉠, ㉢",
      "㉡, ㉢",
      "㉠, ㉡, ㉣",
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
    "explanation": "지구 내부에서 작용하는 힘에 의해 땅이 끊어지면서 흔들리는 현상을 지진이라고 합니다. 규모는 지진의 세기를 숫자로 나타낸 것으로, 규모의 숫자가 클수록 강한 지진이고 지진 피해 정도가 커집니다.\n[자료 검토] 원문의 규모는 지진 자체의 크기를 나타내는 자료로 읽습니다. 특정 장소의 흔들림·피해와 같은 뜻으로 쓰지 않으며 규모만으로 피해 순서를 정하지 않습니다. 지진 발생 원인은 현행 필수 평가에 넣지 않습니다.",
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
    "id": "s41-u03-o1-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 19,
      "page": 4,
      "sourceId": "sci-41-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "화산 활동 대처 방법",
      "concept": "화산 활동 때 밖에 있으면 코와 입을 막고 자동차나 건물 안으로 대피한다."
    },
    "prompt": "다음 <보기>에서 화산 활동 대처 방법으로 알맞지 않은 것을 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 화산재가 날리면 가급적 실내에 머무른다.",
        "㉡ 재난 방송을 확인하면서 현재 상황을 파악한다.",
        "㉢ 밖에 있는 경우 신속하게 운동장으로 대피한다.",
        "㉣ 마스크, 구급함, 비상식량 등을 미리 준비해 둔다."
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
        "ㄷ"
      ]
    },
    "explanation": "화산 활동이 일어날 때 밖에 있는 경우 마스크나 손수건, 옷 등으로 코와 입을 막고 자동차나 건물 안으로 신속하게 대피합니다.\n[자료 검토] 공식 재난 안내·교사/보호자 안내를 따릅니다. 원문의 청소 안내를 학생의 화산재 채집/지붕 청소 과제로 옮기지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 「않은」에 밑줄."
    }
  },
  {
    "id": "s41-u03-o1-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 1,
      "no": 20,
      "page": 4,
      "sourceId": "sci-41-3-cats-set1",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트1",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "장소별 지진 대처 방법",
      "concept": "집 밖에서 지진이 나면 머리를 보호하며 건물과 떨어진 넓은 곳으로 대피한다."
    },
    "prompt": "장소별 지진 대처 방법으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "집 안: 탁자 아래로 들어가 몸을 보호한다.",
      "산: 산사태에 주의하며 안전한 곳으로 대피한다.",
      "집 밖: 머리를 보호하며 큰 건물 옆으로 대피한다.",
      "학교: 흔들림이 멈추면 질서 있게 운동장으로 대피한다.",
      "승강기: 모든 층의 버튼을 눌러 가장 먼저 열리는 층에서 내린 후 계단을 이용하여 대피한다."
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
    "explanation": "집 밖에 있을 때 지진이 일어나면 가방이나 손으로 머리를 보호하면서 건물과 거리를 두고 넓은 공간으로 대피합니다.\n[자료 검토] 학교의 안내에 따라 몸을 보호하고 흔들림이 멈춘 뒤 질서 있게 대피합니다. 학생이 가스·전기 설비를 직접 조작하도록 요구하지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 「않은」에 밑줄."
    }
  },
  {
    "id": "s41-u03-o2-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 1,
      "page": 1,
      "sourceId": "sci-41-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "흙 언덕 실험 결과",
      "concept": "흐르는 물은 흙 언덕 윗부분의 흙을 깎아 운반한 뒤 아랫부분에 쌓으므로 흙은 아랫부분에 가장 많이 쌓인다."
    },
    "prompt": "다음 <보기>에서 위 실험의 결과로 알맞지 않은 것을 골라 기호를 쓰시오.",
    "givens": {
      "지문": "[01~02] 다음과 같이 흙 언덕을 만들어 위쪽에 색 모래를 뿌린 후 흙 언덕의 위쪽에서 물을 천천히 흘려보냈습니다. 물음에 답하시오.",
      "보기": [
        "㉠ 흙 언덕의 윗부분에 있는 흙이 많이 깎인다.",
        "㉡ 물이 흐르면서 흙 언덕의 모습을 변화시킨다.",
        "㉢ 흙 언덕의 중간부분에 흙이 가장 많이 쌓인다.",
        "㉣ 색 모래가 흙 언덕의 윗부분에서 아랫부분으로 이동한다."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s41-u03/s2-q01.webp",
    "figureNote": "사각 쟁반 위의 흙 언덕(꼭대기에 청록색 색 모래)과 위에서 비커로 물을 붓는 손. 언덕 위에서부터 (가) 윗부분, (나) 중간부분, (다) 아랫부분 표시.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉢",
      "accepted": [
        "㉢",
        "ㄷ",
        "흙 언덕의 중간부분에 흙이 가장 많이 쌓인다."
      ]
    },
    "explanation": "물이 흐르면서 윗부분의 흙을 깎고 운반하여 아랫부분에 쌓아 둡니다. 따라서 흙 언덕의 아랫부분에 흙이 가장 많이 쌓입니다.\n[자료 검토] 제시한 조건의 모형과 전형적인 강 지형을 비교합니다. 여러 작용이 함께 나타날 수 있으며 모든 실제 강의 지점/시간에 같은 결과를 단정하지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄. '중간부분', '윗부분', '아랫부분'은 인쇄된 대로 붙여 씀."
    }
  },
  {
    "id": "s41-u03-o2-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 2,
      "page": 1,
      "sourceId": "sci-41-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "침식 작용이 활발한 곳",
      "concept": "경사가 급한 흙 언덕 윗부분에서 흐르는 물이 흙을 깎아 내는 침식 작용이 가장 활발하다."
    },
    "prompt": "흙 언덕의 (가)~(다) 중에서 침식 작용이 가장 활발하게 일어나는 부분을 골라 기호를 쓰시오.",
    "givens": {
      "지문": "[01~02] 다음과 같이 흙 언덕을 만들어 위쪽에 색 모래를 뿌린 후 흙 언덕의 위쪽에서 물을 천천히 흘려보냈습니다. 물음에 답하시오."
    },
    "choices": null,
    "figure": "assets/bank/s41-u03/s2-q01.webp",
    "figureNote": "사각 쟁반 위의 흙 언덕(꼭대기에 청록색 색 모래)과 위에서 비커로 물을 붓는 손. 언덕 위에서부터 (가) 윗부분, (나) 중간부분, (다) 아랫부분 표시.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "(가)",
      "accepted": [
        "(가)",
        "가"
      ]
    },
    "explanation": "흐르는 물이 바위나 돌, 흙 등을 깎아 내는 것을 침식 작용이라고 합니다. 흙 언덕의 윗부분에서 침식 작용이 가장 활발하게 일어납니다.\n[자료 검토] 제시한 조건의 모형과 전형적인 강 지형을 비교합니다. 여러 작용이 함께 나타날 수 있으며 모든 실제 강의 지점/시간에 같은 결과를 단정하지 않습니다.",
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
    "id": "s41-u03-o2-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 3,
      "page": 1,
      "sourceId": "sci-41-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "강 상류의 모습",
      "concept": "강 상류는 강폭이 좁고 경사가 급하며 큰 바위나 돌이 많다."
    },
    "prompt": "다음은 강 주변 지형의 모습입니다. 강 상류와 강 하류 중 어디에서 주로 볼 수 있는 모습인지 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s41-u03/s2-q03.webp",
    "figureNote": "사진 2장: 큰 바위 사이로 물살이 흘러내리는 계곡, 숲속 바위 위로 떨어지는 작은 폭포. 강폭이 좁고 큰 바위가 많은 모습.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "강 상류",
      "accepted": [
        "강 상류",
        "강상류",
        "상류"
      ]
    },
    "explanation": "강폭이 좁고, 경사가 급하며, 큰 바위나 돌이 많은 것을 통해 강 상류의 모습이라는 것을 알 수 있습니다.\n[자료 검토] 제시한 조건의 모형과 전형적인 강 지형을 비교합니다. 여러 작용이 함께 나타날 수 있으며 모든 실제 강의 지점/시간에 같은 결과를 단정하지 않습니다.",
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
    "id": "s41-u03-o2-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 4,
      "page": 1,
      "sourceId": "sci-41-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "강 하류의 작용",
      "concept": "강 하류에서는 흐르는 물이 운반해 온 모래나 흙을 쌓는 퇴적 작용이 가장 활발하다."
    },
    "prompt": "다음은 강 하류에 대한 설명입니다. 빈칸에 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "강 하류에서는 흐르는 물에 의한 작용 중 □ 작용이 가장 활발하게 일어나 모래나 흙이 쌓입니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "퇴적",
      "accepted": [
        "퇴적",
        "퇴적 작용",
        "퇴적작용"
      ]
    },
    "explanation": "강 하류에서는 흐르는 물에 의한 작용 중 퇴적 작용이 가장 활발하게 일어나 모래나 흙이 쌓입니다.\n[자료 검토] 제시한 조건의 모형과 전형적인 강 지형을 비교합니다. 여러 작용이 함께 나타날 수 있으며 모든 실제 강의 지점/시간에 같은 결과를 단정하지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문의 □는 인쇄된 빈 네모 칸."
    }
  },
  {
    "id": "s41-u03-o2-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 5,
      "page": 1,
      "sourceId": "sci-41-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "화산과 화산이 아닌 산 분류",
      "concept": "한라산과 베수비오산은 화산이고, 지리산과 안나푸르나산은 화산이 아닌 산이다."
    },
    "prompt": "다음 <보기>의 산을 화산과 화산이 아닌 산으로 바르게 분류한 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 한라산",
        "㉡ 지리산",
        "㉢ 베수비오산",
        "㉣ 안나푸르나산"
      ]
    },
    "choices": [
      "㉠, ㉡ / ㉢, ㉣",
      "㉠, ㉢ / ㉡, ㉣",
      "㉡, ㉢ / ㉠, ㉣",
      "㉡, ㉣ / ㉠, ㉢",
      "㉢, ㉣ / ㉠, ㉡"
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
    "explanation": "한라산과 베수비오산은 화산이고, 지리산과 안나푸르나산은 화산이 아닌 산입니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기가 표 형식: 열 머리 '화산' / '화산이 아닌 산'. 각 행을 '① 화산 / 화산이 아닌 산'으로 적음. <보기>는 2열 배치(㉠ 한라산, ㉡ 지리산 / ㉢ 베수비오산, ㉣ 안나푸르나산)."
    }
  },
  {
    "id": "s41-u03-o2-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 6,
      "page": 1,
      "sourceId": "sci-41-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "화산의 특징",
      "concept": "화산은 크기와 모양이 다양하고, 분화구·호수·연기·용암 유무도 화산마다 다르다."
    },
    "prompt": "화산에 대한 설명으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "크기가 일정하다.",
      "산꼭대기가 길게 연결되어 있다.",
      "화산 꼭대기에서는 항상 연기가 난다.",
      "모든 화산의 분화구에는 호수가 만들어진다.",
      "용암이 흘러나오는 것도 있고, 그렇지 않은 것도 있다."
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
    "explanation": "화산은 크기와 모양이 다양하며, 화산 꼭대기에 분화구가 있는 것도 있고, 없는 것도 있습니다. 화산의 분화구에 물이 고여 호수나 물웅덩이가 만들어진 것도 있고, 없는 것도 있으며, 화산 꼭대기에서 연기가 나거나 용암이 흘러나오는 것도 있고, 그렇지 않은 것도 있습니다. 산꼭대기가 길게 연결되어 있는 것은 화산이 아닌 산의 특징입니다.",
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
    "id": "s41-u03-o2-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 7,
      "page": 2,
      "sourceId": "sci-41-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "마그마·화산 활동·화산의 뜻",
      "concept": "땅속에서 암석이 녹은 마그마가 땅 밖으로 분출하는 현상이 화산 활동이고, 그로 만들어진 지형이 화산이다."
    },
    "prompt": "다음 ㉠~㉢에 들어갈 말을 알맞게 짝 지은 것은 어느 것입니까?",
    "givens": {
      "지문": "땅속 깊은 곳에서 암석이 녹아 만들어진 ㉠ 이/가 땅 밖으로 분출하는 현상을 ㉡ (이)라고 하며, ㉡ (으)로 만들어진 지형을 ㉢ (이)라고 합니다."
    },
    "choices": [
      "화산 / 마그마 / 화산 활동",
      "화산 / 화산 활동 / 마그마",
      "마그마 / 화산 / 화산 활동",
      "마그마 / 화산 활동 / 화산",
      "화산 활동 / 마그마 / 화산"
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
    "explanation": "땅속 깊은 곳에서 암석이 녹아 만들어진 마그마가 땅 밖으로 분출하는 현상을 화산 활동이라고 하며, 화산 활동으로 만들어진 지형을 화산이라고 합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문의 ㉠·㉡·㉢은 인쇄된 네모 칸 안에 들어 있음. 보기가 표 형식: 열 머리 ㉠ / ㉡ / ㉢."
    }
  },
  {
    "id": "s41-u03-o2-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 8,
      "page": 2,
      "sourceId": "sci-41-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "용암의 뜻",
      "concept": "용암은 마그마가 분출하며 기체 물질이 빠져나간 액체 상태의 물질로 땅을 따라 흘러내린다."
    },
    "prompt": "다음에서 설명하는 물질은 무엇입니까?",
    "givens": {
      "지문": "마그마가 땅 밖으로 분출하면서 기체 물질이 빠져나간 것으로, 땅을 따라 흘러내립니다."
    },
    "choices": [
      "용암",
      "화산재",
      "분화구",
      "화산 가스",
      "화산 암석 조각"
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
    "explanation": "용암은 마그마가 땅 밖으로 분출하면서 기체 물질이 빠져나간 것입니다. 액체 상태의 물질로, 땅을 따라 흘러내립니다.",
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
    "id": "s41-u03-o2-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 9,
      "page": 2,
      "sourceId": "sci-41-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "화산 분출물의 상태",
      "concept": "화산 가스는 기체, 용암은 액체, 화산재와 화산 암석 조각은 고체 상태의 화산 분출물이다."
    },
    "prompt": "다음 <보기>에서 화산 분출물과 화산 분출물의 상태를 잘못 짝 지은 것을 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 용암 - 액체",
        "㉡ 화산재 - 기체",
        "㉢ 화산 가스 - 기체",
        "㉣ 화산 암석 조각 - 고체"
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
        "화산재 - 기체"
      ]
    },
    "explanation": "화산 가스는 기체 상태, 용암은 액체 상태, 화산 암석 조각과 화산재는 고체 상태의 물질입니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '잘못'에 밑줄."
    }
  },
  {
    "id": "s41-u03-o2-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 10,
      "page": 2,
      "sourceId": "sci-41-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "화산 활동 모형 실험 결과",
      "concept": "마시멜로 화산 활동 모형을 가열하면 연기가 나고 녹은 마시멜로가 윗부분으로 흘러나와 식어 굳지만 고체 상태의 물질은 나오지 않는다."
    },
    "prompt": "위 실험의 결과로 알맞지 않은 것은 어느 것입니까?",
    "givens": {
      "지문": "[10~11] 다음은 화산 활동 모형을 만드는 실험 과정입니다. 물음에 답하시오.\n<과정>\n(가) 알루미늄 포일 위에 마시멜로를 올려놓고 빨간색 식용 색소를 뿌립니다.\n(나) 알루미늄 포일로 마시멜로를 감싼 후 윗부분을 조금 열어 두고 은박 접시 위에 올려놓습니다.\n(다) 은박 접시를 가열 장치에 올려놓고 가열하면서 나타나는 현상을 관찰합니다.",
      "학습 안내": "원문/교사 시범 자료를 읽는 문제입니다. 학생이 가열·뜨거운 재료·연기 관찰을 따라 하지 않습니다. 모형의 물질·온도·크기·분출 원리는 실제와 다릅니다."
    },
    "choices": [
      "모형 윗부분에서 연기가 피어오른다.",
      "알루미늄 포일로 감싼 마시멜로가 녹는다.",
      "녹은 마시멜로가 모형의 윗부분으로 흘러나온다.",
      "고체 상태의 마시멜로가 모형의 아랫부분에서 튀어나온다.",
      "녹아서 흘러나온 마시멜로가 시간이 지나면 식어서 굳는다."
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
    "explanation": "화산 활동 모형 실험에서 고체 상태의 물질은 나오지 않습니다.\n[자료 검토] 원문/교사 시범 자료를 읽는 문제입니다. 학생이 가열·뜨거운 재료·연기 관찰을 따라 하지 않습니다. 모형의 물질·온도·크기·분출 원리는 실제와 다릅니다. 연기라는 표현은 나오는 모습의 대응이며 실제 화산 가스와 성분이 같다는 뜻이 아닙니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄."
    }
  },
  {
    "id": "s41-u03-o2-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 11,
      "page": 2,
      "sourceId": "sci-41-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "모형의 연기와 실제 화산 분출물 비교",
      "concept": "화산 활동 모형에서 피어오르는 연기는 실제 화산에서 나오는 화산 가스에 해당한다."
    },
    "prompt": "다음은 화산 활동 모형과 실제 화산 활동에서 나오는 물질을 비교한 것입니다. 빈칸에 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "[10~11] 다음은 화산 활동 모형을 만드는 실험 과정입니다. 물음에 답하시오.\n<과정>\n(가) 알루미늄 포일 위에 마시멜로를 올려놓고 빨간색 식용 색소를 뿌립니다.\n(나) 알루미늄 포일로 마시멜로를 감싼 후 윗부분을 조금 열어 두고 은박 접시 위에 올려놓습니다.\n(다) 은박 접시를 가열 장치에 올려놓고 가열하면서 나타나는 현상을 관찰합니다.\n\n화산 활동 모형에서 나오는 연기는 실제 화산 활동에서 나오는 □와/과 비교할 수 있습니다.",
      "학습 안내": "원문/교사 시범 자료를 읽는 문제입니다. 학생이 가열·뜨거운 재료·연기 관찰을 따라 하지 않습니다. 모형의 물질·온도·크기·분출 원리는 실제와 다릅니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "화산 가스",
      "accepted": [
        "화산 가스",
        "화산가스"
      ]
    },
    "explanation": "화산 활동 모형에서 나오는 연기는 실제 화산 활동에서 나오는 화산 가스와 비교할 수 있습니다.\n[자료 검토] 원문/교사 시범 자료를 읽는 문제입니다. 학생이 가열·뜨거운 재료·연기 관찰을 따라 하지 않습니다. 모형의 물질·온도·크기·분출 원리는 실제와 다릅니다. 연기라는 표현은 나오는 모습의 대응이며 실제 화산 가스와 성분이 같다는 뜻이 아닙니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "11번 자체 상자 속 □는 인쇄된 빈 네모 칸. 지문에는 [10~11] 공통 발문과 11번 상자 문장을 빈 줄로 구분해 함께 적음."
    }
  },
  {
    "id": "s41-u03-o2-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 12,
      "page": 3,
      "sourceId": "sci-41-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "화강암과 현무암의 특징",
      "concept": "화강암과 현무암은 모두 마그마가 식어 굳은 화성암이며, 색깔은 알갱이의 성분에 따라 달라진다."
    },
    "prompt": "위의 암석들에 대한 설명으로 알맞은 것을 두 가지 고르시오.",
    "givens": {
      "지문": "[12~13] 다음 <보기>의 화강암과 현무암의 모습을 보고, 물음에 답하시오."
    },
    "choices": [
      "㉠은 현무암이다.",
      "㉡은 화강암이다.",
      "㉠은 화성암이고, ㉡은 화성암이 아니다.",
      "㉠과 ㉡은 마그마가 식어서 굳어져 만들어진 암석이다.",
      "㉠과 ㉡의 색깔은 암석을 이루고 있는 알갱이의 성분에 따라 달라진다."
    ],
    "figure": "assets/bank/s41-u03/s2-q12.webp",
    "figureNote": "<보기> 상자: ㉠ 밝은 회색 바탕에 검은 점이 박힌 알갱이가 큰 암석(화강암) 사진, ㉡ 어두운 색에 구멍이 많이 뚫린 암석(현무암) 사진.",
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
    "explanation": "㉠은 화강암, ㉡은 현무암입니다. 화강암과 현무암은 마그마가 식어서 굳어져 만들어진 화성암입니다. 화성암의 색깔은 암석을 이루고 있는 알갱이의 성분에 따라 달라집니다.\n[자료 검토] 현재 필수는 현무암·화강암의 관찰과 분류입니다. 냉각 과정과 알갱이 크기 원인은 기존 교재의 연계 심화 자료로 구별합니다. 현무암은 표면 구멍이 없는 표본도 있습니다.",
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
    "id": "s41-u03-o2-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 13,
      "page": 3,
      "sourceId": "sci-41-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T07",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "현무암 알갱이가 작은 까닭",
      "concept": "현무암은 마그마가 지표 가까이에서 빠르게 식어 만들어져 땅속 깊은 곳에서 천천히 식은 화강암보다 알갱이가 작다."
    },
    "prompt": "㉠과 ㉡ 중 알갱이의 크기가 더 작은 암석을 골라 기호를 쓰고, 알갱이의 크기가 더 작은 까닭을 암석이 만들어지는 과정과 관련지어 쓰시오.",
    "givens": {
      "지문": "[12~13] 다음 <보기>의 화강암과 현무암의 모습을 보고, 물음에 답하시오."
    },
    "choices": null,
    "figure": "assets/bank/s41-u03/s2-q12.webp",
    "figureNote": "<보기> 상자: ㉠ 밝은 회색 바탕에 검은 점이 박힌 알갱이가 큰 암석(화강암) 사진, ㉡ 어두운 색에 구멍이 많이 뚫린 암석(현무암) 사진.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "㉡, 마그마가 지표 가까이에서 빠르게 식어 만들어졌기 때문이다.",
      "rubric": {
        "required": [
          "㉡을 고르고 마그마가 빠르게 식어 만들어졌다고 설명"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "㉡과 마그마가 빠르게 식어 만들어졌기 때문이라는 내용이 포함되어 있으면 정답으로 합니다."
        ]
      }
    },
    "explanation": "마그마가 천천히 식을수록 암석을 이루는 알갱이의 크기가 커집니다. 화강암은 마그마가 땅속 깊은 곳에서 천천히 식어 만들어져 알갱이의 크기가 현무암보다 크고, 현무암은 마그마가 지표 가까이에서 빠르게 식어 만들어져 알갱이의 크기가 화강암보다 작습니다.\n[채점 기준] ㉡과 마그마가 빠르게 식어 만들어졌기 때문이라는 내용이 포함되어 있으면 정답으로 합니다.\n[자료 검토] 현재 필수는 현무암·화강암의 관찰과 분류입니다. 냉각 과정과 알갱이 크기 원인은 기존 교재의 연계 심화 자료로 구별합니다. 현무암은 표면 구멍이 없는 표본도 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준 표에 배점 비율이 인쇄되어 있지 않아 단일 기준을 100%로 적음."
    }
  },
  {
    "id": "s41-u03-o2-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 14,
      "page": 3,
      "sourceId": "sci-41-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "화산 활동의 피해",
      "concept": "용암이 흘러 산불을 일으키고 화산재가 태양 빛을 가려 날씨에 영향을 주는 것은 화산 활동의 피해이다."
    },
    "prompt": "다음은 화산 활동이 주는 피해에 대한 설명입니다. ㉠, ㉡에 들어갈 말을 알맞게 짝 지은 것은 어느 것입니까?",
    "givens": {
      "지문": "• ㉠ 이/가 흘러 산불이 발생합니다.\n• ㉡ 이/가 태양 빛을 가려서 날씨 변화에 영향을 줍니다."
    },
    "choices": [
      "용암 / 화산재",
      "용암 / 화산 가스",
      "화산재 / 용암",
      "화산재 / 화산 가스",
      "화산 암석 조각 / 화산 가스"
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
    "explanation": "용암이 흘러 산불이 발생하는 것, 화산재가 태양 빛을 가려서 날씨 변화에 영향을 주는 것은 화산 활동이 주는 피해입니다.\n[자료 검토] 피해와 이로움의 조건·시점을 구별합니다. 화산재가 덮은 즉시의 피해와 오랜 뒤 일부 토양의 변화는 같은 조건이 아닙니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문의 ㉠·㉡은 인쇄된 네모 칸 안에 들어 있음. 보기가 표 형식: 열 머리 ㉠ / ㉡."
    }
  },
  {
    "id": "s41-u03-o2-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 15,
      "page": 3,
      "sourceId": "sci-41-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "화산 활동의 이로운 점",
      "concept": "지열 발전, 온천 관광, 기름진 땅은 화산 활동의 이로운 점이고, 화산 가스로 인한 호흡기 질병은 피해이다."
    },
    "prompt": "다음 <보기>에서 화산 활동이 주는 이로운 영향으로 알맞지 않은 것을 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 화산 가스로 인해 호흡기 질병에 걸린다.",
        "㉡ 화산 주변 땅속의 열을 이용하여 지열 발전을 한다.",
        "㉢ 화산 주변에 온천을 개발하여 관광 자원으로 이용한다.",
        "㉣ 쌓인 화산재가 오랜 시간이 지나면 땅을 기름지게 만든다."
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
        "화산 가스로 인해 호흡기 질병에 걸린다."
      ]
    },
    "explanation": "화산 가스로 인해 호흡기 질병에 걸리는 것은 화산 활동이 주는 피해입니다.\n[자료 검토] 피해와 이로움의 조건·시점을 구별합니다. 화산재가 덮은 즉시의 피해와 오랜 뒤 일부 토양의 변화는 같은 조건이 아닙니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄."
    }
  },
  {
    "id": "s41-u03-o2-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 16,
      "page": 3,
      "sourceId": "sci-41-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "지진의 규모",
      "concept": "규모는 지진의 세기를 숫자로 나타낸 것으로, 숫자가 클수록 강한 지진이다."
    },
    "prompt": "다음 빈칸에 공통으로 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "□은/는 지진의 세기를 숫자로 나타낸 것입니다. □의 숫자가 클수록 강한 지진입니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "규모",
      "accepted": [
        "규모"
      ]
    },
    "explanation": "규모는 지진의 세기를 숫자로 나타낸 것입니다. 규모의 숫자가 클수록 강한 지진입니다.\n[자료 검토] 원문의 규모는 지진 자체의 크기를 나타내는 자료로 읽습니다. 특정 장소의 흔들림·피해와 같은 뜻으로 쓰지 않으며 규모만으로 피해 순서를 정하지 않습니다. 지진 발생 원인은 현행 필수 평가에 넣지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문의 □는 인쇄된 빈 네모 칸(두 곳)."
    }
  },
  {
    "id": "s41-u03-o2-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 17,
      "page": 4,
      "sourceId": "sci-41-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "지진의 피해",
      "concept": "최근 우리나라에서도 규모가 큰 지진이 일어나고 있어 우리나라도 지진에 안전한 지역이 아니다."
    },
    "prompt": "지진에 대한 설명으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "지진으로 산사태가 발생하기도 한다.",
      "우리나라는 지진에 안전한 지역이다.",
      "지진으로 사람이 죽거나 다치기도 한다.",
      "지진으로 땅이나 도로가 갈라지기도 한다.",
      "지진으로 커다란 파도가 만들어지기도 한다."
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
    "explanation": "최근 우리나라에서도 규모가 큰 지진이 발생하고 있기 때문에 우리나라도 지진에 안전한 지역이 아닙니다. 따라서 지진으로 인한 피해를 입지 않도록 대비해야 합니다.\n[자료 검토] 원문의 규모는 지진 자체의 크기를 나타내는 자료로 읽습니다. 특정 장소의 흔들림·피해와 같은 뜻으로 쓰지 않으며 규모만으로 피해 순서를 정하지 않습니다. 지진 발생 원인은 현행 필수 평가에 넣지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄."
    }
  },
  {
    "id": "s41-u03-o2-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 18,
      "page": 4,
      "sourceId": "sci-41-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "화산 활동 대처 방법",
      "concept": "화산재가 날릴 때는 실내에 머물며 문과 창문을 닫고 문틈을 막아야 한다."
    },
    "prompt": "화산 활동 대처 방법으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "마스크를 미리 준비해 둔다.",
      "구급함을 미리 준비해 둔다.",
      "화산으로부터 멀리 대피한다.",
      "화산재가 날리면 창문을 열고 환기를 시킨다.",
      "화산재가 모두 떨어진 뒤에 쌓인 화산재를 깨끗이 청소한다."
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
    "explanation": "화산 활동으로 화산재가 날리면 가급적 실내에 머무르면서 문과 창문을 닫고 젖은 수건이나 테이프로 문틈을 막습니다.\n[자료 검토] 공식 재난 안내·교사/보호자 안내를 따릅니다. 원문의 청소 안내를 학생의 화산재 채집/지붕 청소 과제로 옮기지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "발문의 '않은'에 밑줄."
    }
  },
  {
    "id": "s41-u03-o2-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 19,
      "page": 4,
      "sourceId": "sci-41-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "집 안에서의 지진 대처",
      "concept": "집 안에서 지진이 나면 탁자 아래로 들어가 몸을 보호하고, 흔들림이 멈추면 전기·가스를 차단한 뒤 계단으로 나간다."
    },
    "prompt": "집 안에 있을 때의 지진 대처 방법이 맞으면 ○표, 틀리면 ×표를 하시오.",
    "givens": {
      "지문": "(1) 탁자 위로 올라가 몸을 보호합니다.\n(2) 흔들림이 멈추면 전기와 가스를 차단한 뒤 밖으로 나갑니다.\n(3) 승강기를 이용해 빠르게 밖으로 나갑니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "(1) × (2) ○ (3) ×",
      "accepted": [
        "(1) × (2) ○ (3) ×",
        "× ○ ×",
        "X O X",
        "x o x",
        "XOX"
      ]
    },
    "explanation": "집 안에 있을 때 지진이 일어나면 탁자 아래로 들어가 몸을 보호하고, 흔들림이 멈추면 전기와 가스를 차단한 뒤 승강기 대신 계단을 이용해 빠르게 밖으로 나갑니다.\n[자료 검토] 학교의 안내에 따라 몸을 보호하고 흔들림이 멈춘 뒤 질서 있게 대피합니다. 학생이 가스·전기 설비를 직접 조작하도록 요구하지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "소문항 3개 각각 ( ) 칸에 ○/× 표시."
    }
  },
  {
    "id": "s41-u03-o2-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 2,
      "no": 20,
      "page": 4,
      "sourceId": "sci-41-3-cats-set2",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트2",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T11",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "학교에서의 지진 대처",
      "concept": "학교에서 지진이 나면 책상 아래로 들어가 몸을 보호하고, 흔들림이 멈추면 질서 있게 운동장으로 대피한다."
    },
    "prompt": "학교에 있을 때 지진 대처 방법을 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "예) 책상 아래로 들어가 몸을 보호한다. / 흔들림이 멈추면 질서 있게 운동장으로 대피한다. 등",
      "rubric": {
        "required": [
          "학교에서 타당한 대처 한 가지 이상"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "학교에 있을 때 지진 대처 방법을 바르게 썼으면 정답으로 합니다."
        ]
      }
    },
    "explanation": "학교에 있을 때 지진이 일어나면 책상 아래로 들어가 몸을 보호하고, 흔들림이 멈추면 질서 있게 운동장으로 대피합니다.\n[채점 기준] 학교에 있을 때 지진 대처 방법을 바르게 썼으면 정답으로 합니다.\n[자료 검토] 학교의 안내에 따라 몸을 보호하고 흔들림이 멈춘 뒤 질서 있게 대피합니다. 학생이 가스·전기 설비를 직접 조작하도록 요구하지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준 표에 배점 비율이 인쇄되어 있지 않아 단일 기준을 100%로 적음."
    }
  },
  {
    "id": "s41-u03-o3-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 1,
      "page": 1,
      "sourceId": "sci-41-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "흙 언덕 실험에서 퇴적 작용이 활발한 곳",
      "concept": "흐르는 물은 흙 언덕의 위쪽을 깎아 운반하고 아래쪽에 쌓으므로 아랫부분에서 퇴적 작용이 가장 활발하다."
    },
    "prompt": "다음과 같이 흙 언덕을 만들어 위쪽에 색 모래를 뿌린 후 흙 언덕의 위쪽에서 물을 천천히 흘려보냈습니다. ㉠~㉢ 중 퇴적 작용이 가장 활발하게 일어나는 부분을 골라 기호를 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": "assets/bank/s41-u03/s3-q01.webp",
    "figureNote": "쟁반 위 흙 언덕 꼭대기에 색 모래(청록색)를 뿌리고 비커로 물을 붓는 그림. 언덕 위쪽부터 ㉠(꼭대기), ㉡(중간), ㉢(아랫부분) 표시.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉢",
      "accepted": [
        "㉢",
        "ㄷ"
      ]
    },
    "explanation": "흐르는 물에 의해 운반된 돌이나 흙 등이 쌓이는 것을 퇴적 작용이라고 합니다. 물이 흐르면서 윗부분의 흙을 깎고 운반하여 아랫부분에 쌓아 둡니다. 따라서 흙 언덕의 아랫부분에서 퇴적 작용이 가장 활발하게 일어납니다.\n[자료 검토] 제시한 조건의 모형과 전형적인 강 지형을 비교합니다. 여러 작용이 함께 나타날 수 있으며 모든 실제 강의 지점/시간에 같은 결과를 단정하지 않습니다.",
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
    "id": "s41-u03-o3-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 2,
      "page": 1,
      "sourceId": "sci-41-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "침식·운반·퇴적 작용의 뜻",
      "concept": "흐르는 물이 깎아 내는 것은 침식, 옮기는 것은 운반, 쌓는 것은 퇴적 작용이다."
    },
    "prompt": "다음 <보기>에서 설명에 해당하는 작용을 골라 기호를 쓰시오.\n(1) 흐르는 물이 바위나 돌, 흙 등을 깎아 내는 것을 말합니다.\n(2) 흐르는 물에 의해 운반된 돌이나 흙 등이 쌓이는 것을 말합니다.\n(3) 흐르는 물이 돌이나 흙 등을 다른 곳으로 이동시키는 것을 말합니다.",
    "givens": {
      "보기": [
        "㉠ 침식 작용",
        "㉡ 운반 작용",
        "㉢ 퇴적 작용"
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
      "answer": "(1) ㉠ (2) ㉢ (3) ㉡",
      "accepted": [
        "(1) ㉠ (2) ㉢ (3) ㉡",
        "㉠, ㉢, ㉡",
        "㉠㉢㉡",
        "ㄱ, ㄷ, ㄴ",
        "(1) 침식 작용 (2) 퇴적 작용 (3) 운반 작용"
      ]
    },
    "explanation": "흐르는 물에 의해 침식, 운반, 퇴적 작용이 일어납니다. 침식 작용은 바위나 돌, 흙 등을 깎아 내는 것, 운반 작용은 돌이나 흙 등을 다른 곳으로 이동시키는 것, 퇴적 작용은 운반된 돌이나 흙 등이 쌓이는 것을 말합니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "소문항 (1)~(3)을 prompt 안에 줄바꿈으로 넣음. 보기 항목은 한 줄에 가로로 인쇄됨."
    }
  },
  {
    "id": "s41-u03-o3-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 3,
      "page": 1,
      "sourceId": "sci-41-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T03",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "강 상류와 하류 구분",
      "concept": "강 상류는 경사가 급하고 강폭이 좁으며, 강 하류는 경사가 완만하고 강폭이 넓다."
    },
    "prompt": "다음은 강 주변 지형에 대한 설명입니다. ㉠~㉢ 중 잘못된 부분을 찾아 기호를 쓰고, 내용을 바르게 고쳐 쓰시오.",
    "givens": {
      "지문": "위의 ㉠ (가)는 강 하류, (나)는 강 상류입니다. ㉡ 강 상류는 강의 경사가 급하며, 큰 바위나 돌이 많습니다. ㉢ 강 하류는 강의 경사가 완만하며, 모래나 흙이 쌓인 지형을 많이 볼 수 있습니다."
    },
    "choices": null,
    "figure": "assets/bank/s41-u03/s3-q03.webp",
    "figureNote": "산에서 바다로 흐르는 강의 단면 모형 그림. 위쪽 산지 부분에 (가), 바다 가까운 아래쪽 부분에 (나) 표시.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "㉠, (가)는 강 상류, (나)는 강 하류이다.",
      "rubric": {
        "required": [
          "㉠을 고르고 (가)는 상류·(나)는 하류로 고침"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "㉠과 (가)는 강 상류, (나)는 강 하류라는 내용이 포함되어 있으면 정답으로 합니다."
        ]
      }
    },
    "explanation": "강폭이 좁고 경사가 급한 (가)는 강 상류이고, 강폭이 넓고 경사가 완만한 (나)는 강 하류입니다.\n[채점 기준] ㉠과 (가)는 강 상류, (나)는 강 하류라는 내용이 포함되어 있으면 정답으로 합니다.\n[자료 검토] 제시한 조건의 모형과 전형적인 강 지형을 비교합니다. 여러 작용이 함께 나타날 수 있으며 모든 실제 강의 지점/시간에 같은 결과를 단정하지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문의 ㉠·㉡·㉢ 문장에 밑줄이 그어져 있음. 지문은 그림과 함께 하나의 테두리 상자 안에 있음. 채점 기준에 비율 표시 없음(한 줄)."
    }
  },
  {
    "id": "s41-u03-o3-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 4,
      "page": 1,
      "sourceId": "sci-41-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "강 하류 지형의 특징",
      "concept": "강 하류는 강폭이 넓고 퇴적 작용이 침식 작용보다 활발하게 일어난다."
    },
    "prompt": "다음은 강 주변 지형의 모습입니다. <보기>에서 이 지형에 대한 설명으로 알맞은 것을 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 강폭이 좁은 곳이다.",
        "㉡ 강 상류에서 많이 볼 수 있다.",
        "㉢ 퇴적 작용이 침식 작용보다 활발하게 일어난다."
      ]
    },
    "choices": null,
    "figure": "assets/bank/s41-u03/s3-q04.webp",
    "figureNote": "강물이 바다(호수)로 흘러드는 곳에 모래·흙이 쌓인 강 하류 지형의 항공 사진.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉢",
      "accepted": [
        "㉢",
        "ㄷ",
        "퇴적 작용이 침식 작용보다 활발하게 일어난다."
      ]
    },
    "explanation": "강 하류에서 볼 수 있는 지형의 모습입니다. 강 하류는 강폭이 넓고, 퇴적 작용이 침식 작용보다 활발하게 일어납니다.\n[자료 검토] 제시한 조건의 모형과 전형적인 강 지형을 비교합니다. 여러 작용이 함께 나타날 수 있으며 모든 실제 강의 지점/시간에 같은 결과를 단정하지 않습니다.",
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
    "id": "s41-u03-o3-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 5,
      "page": 2,
      "sourceId": "sci-41-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "화산과 마그마의 뜻",
      "concept": "화산은 땅속 암석이 녹은 마그마가 땅을 뚫고 나와 만들어진 지형이다."
    },
    "prompt": "다음 ㉠, ㉡에 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "• ㉠ 은/는 땅속 깊은 곳에서 암석이 녹아 만들어진 ㉡ 이/가 땅을 뚫고 나오면서 만들어진 지형을 말합니다.\n• ㉠ 은/는 꼭대기에서 연기가 나거나 용암이 흘러나오는 것도 있습니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 화산, ㉡ 마그마",
      "accepted": [
        "㉠ 화산, ㉡ 마그마",
        "화산, 마그마",
        "화산 마그마"
      ]
    },
    "explanation": "화산은 땅속 깊은 곳에서 암석이 녹아 만들어진 마그마가 땅을 뚫고 나오면서 만들어진 지형을 말합니다. 화산은 꼭대기에서 연기가 나거나 용암이 흘러나오는 것도 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "㉠, ㉡은 지문 안에 네모 빈칸으로 인쇄됨."
    }
  },
  {
    "id": "s41-u03-o3-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 6,
      "page": 2,
      "sourceId": "sci-41-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "화산 꼭대기의 분화구",
      "concept": "화산의 꼭대기에는 움푹 파인 분화구가 있는 경우가 많다."
    },
    "prompt": "다음은 킬라우에아산과 베수비오산에 대한 설명입니다. 빈칸에 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "미국에 위치한 킬라우에아산과 이탈리아에 위치한 베수비오산의 꼭대기에는 움푹 파인 (    )이/가 있습니다."
    },
    "choices": null,
    "figure": "assets/bank/s41-u03/s3-q06.webp",
    "figureNote": "화산 사진 두 장: 연기가 나는 킬라우에아산 꼭대기, 움푹 파인 베수비오산 꼭대기(캡션 '▲ 킬라우에아산', '▲ 베수비오산').",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "분화구",
      "accepted": [
        "분화구"
      ]
    },
    "explanation": "킬라우에아산과 베수비오산은 화산으로, 산꼭대기에 움푹 파인 분화구가 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "빈칸은 네모 칸으로 인쇄됨."
    }
  },
  {
    "id": "s41-u03-o3-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 7,
      "page": 2,
      "sourceId": "sci-41-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "화산 암석 조각",
      "concept": "화산 활동 때 나오는 크기와 모양이 다양한 돌덩이를 화산 암석 조각이라고 한다."
    },
    "prompt": "다음에서 설명하는 화산 분출물의 이름을 쓰시오.",
    "givens": {
      "지문": "화산 활동이 일어날 때 나오는 돌덩이로, 크기와 모양이 다양합니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "화산 암석 조각",
      "accepted": [
        "화산 암석 조각",
        "화산암석조각",
        "화산 암석조각"
      ]
    },
    "explanation": "화산 암석 조각은 화산 활동이 일어날 때 나오는 돌덩이로, 크기와 모양이 다양합니다.",
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
    "id": "s41-u03-o3-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 8,
      "page": 2,
      "sourceId": "sci-41-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "화산 분출물의 상태와 성분",
      "concept": "화산 분출물 중 용암은 액체 상태이고, 화산 가스는 대부분 수증기로 이루어져 있다."
    },
    "prompt": "화산 분출물에 대한 설명으로 알맞지 않은 것을 두 가지 고르시오.",
    "givens": null,
    "choices": [
      "화산재는 고체 상태이다.",
      "화산재는 크기가 아주 작은 가루 물질이다.",
      "화산 분출물 중에서 액체 상태의 물질은 없다.",
      "화산 가스는 대부분 산소와 이산화 탄소로 이루어져 있다.",
      "용암은 마그마가 땅 밖으로 분출하면서 기체 물질이 빠져나간 것이다."
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
        3
      ]
    },
    "explanation": "화산 분출물인 용암은 액체 상태의 물질입니다. 화산 가스는 대부분 수증기이며 여러 가지 기체가 섞여 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'않은'에 밑줄."
    }
  },
  {
    "id": "s41-u03-o3-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 9,
      "page": 2,
      "sourceId": "sci-41-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "화산 활동 모형과 실제 화산 분출물 비교",
      "concept": "화산 활동 모형의 연기는 화산 가스에, 흘러나온 마시멜로는 용암에 해당한다."
    },
    "prompt": "위 실험 결과의 밑줄 친 ㉠, ㉡은 실제 화산 활동의 어떤 화산 분출물과 비교할 수 있는지 쓰시오.",
    "givens": {
      "지문": "[09~10] 다음은 화산 활동 모형을 만드는 실험 과정과 결과입니다. 물음에 답하시오.",
      "과정": [
        "(가) 알루미늄 포일 위에 마시멜로를 올려놓고 빨간색 식용 색소를 뿌립니다.",
        "(나) 알루미늄 포일로 마시멜로를 감싼 후 윗부분을 조금 열어 두고 은박 접시 위에 올려놓습니다.",
        "(다) 은박 접시를 가열 장치에 올려놓고 가열하면서 나타나는 현상을 관찰합니다."
      ],
      "결과": [
        "화산 활동 모형 윗부분에서 ㉠ 연기가 피어오릅니다.",
        "녹은 마시멜로가 화산 활동 모형의 윗부분으로 흘러나옵니다.",
        "㉡ 흘러나온 마시멜로가 시간이 지나면 식어서 굳습니다."
      ],
      "학습 안내": "원문/교사 시범 자료를 읽는 문제입니다. 학생이 가열·뜨거운 재료·연기 관찰을 따라 하지 않습니다. 모형의 물질·온도·크기·분출 원리는 실제와 다릅니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 화산 가스, ㉡ 용암",
      "accepted": [
        "㉠ 화산 가스, ㉡ 용암",
        "화산 가스, 용암",
        "화산가스, 용암"
      ]
    },
    "explanation": "화산 활동 모형의 연기는 실제 화산 활동의 화산 가스와 비교할 수 있고, 화산 활동 모형의 흘러나온 마시멜로는 실제 화산 활동의 용암과 비교할 수 있습니다.\n[자료 검토] 원문/교사 시범 자료를 읽는 문제입니다. 학생이 가열·뜨거운 재료·연기 관찰을 따라 하지 않습니다. 모형의 물질·온도·크기·분출 원리는 실제와 다릅니다. 연기라는 표현은 나오는 모습의 대응이며 실제 화산 가스와 성분이 같다는 뜻이 아닙니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<결과>의 '㉠ 연기', '㉡ 흘러나온 마시멜로'에 밑줄. <과정>·<결과>는 테두리 상자로 인쇄됨."
    }
  },
  {
    "id": "s41-u03-o3-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 10,
      "page": 2,
      "sourceId": "sci-41-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T06",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "화산 활동 모형과 실제 화산 활동의 공통점",
      "concept": "화산 활동 모형과 실제 화산은 모두 연기가 나고 액체 물질이 흘러나와 식으면 굳는다."
    },
    "prompt": "화산 활동 모형과 실제 화산 활동의 공통점을 두 가지 쓰시오.",
    "givens": {
      "지문": "[09~10] 다음은 화산 활동 모형을 만드는 실험 과정과 결과입니다. 물음에 답하시오.",
      "과정": [
        "(가) 알루미늄 포일 위에 마시멜로를 올려놓고 빨간색 식용 색소를 뿌립니다.",
        "(나) 알루미늄 포일로 마시멜로를 감싼 후 윗부분을 조금 열어 두고 은박 접시 위에 올려놓습니다.",
        "(다) 은박 접시를 가열 장치에 올려놓고 가열하면서 나타나는 현상을 관찰합니다."
      ],
      "결과": [
        "화산 활동 모형 윗부분에서 ㉠ 연기가 피어오릅니다.",
        "녹은 마시멜로가 화산 활동 모형의 윗부분으로 흘러나옵니다.",
        "㉡ 흘러나온 마시멜로가 시간이 지나면 식어서 굳습니다."
      ],
      "학습 안내": "원문/교사 시범 자료를 읽는 문제입니다. 학생이 가열·뜨거운 재료·연기 관찰을 따라 하지 않습니다. 모형의 물질·온도·크기·분출 원리는 실제와 다릅니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "예) 연기가 난다. / 액체 상태의 물질이 흘러나온다. / 흘러나온 액체 상태의 물질이 시간이 지나면 식어서 굳는다. 등",
      "rubric": {
        "required": [
          "서로 다른 공통 관찰 모습 두 가지"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "공통점 두 가지를 바르게 썼으면 정답으로 합니다."
        ]
      }
    },
    "explanation": "화산 활동 모형과 실제 화산 활동 모두 연기가 나고, 액체 상태의 물질이 흘러나오며, 흘러나온 액체 상태의 물질이 시간이 지나면 식어서 굳습니다.\n[채점 기준] 공통점 두 가지를 바르게 썼으면 정답으로 합니다.\n[자료 검토] 원문/교사 시범 자료를 읽는 문제입니다. 학생이 가열·뜨거운 재료·연기 관찰을 따라 하지 않습니다. 모형의 물질·온도·크기·분출 원리는 실제와 다릅니다. 연기라는 표현은 나오는 모습의 대응이며 실제 화산 가스와 성분이 같다는 뜻이 아닙니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준에 비율 표시 없음(한 줄)."
    }
  },
  {
    "id": "s41-u03-o3-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 11,
      "page": 3,
      "sourceId": "sci-41-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "현무암 알아보기",
      "concept": "현무암은 색깔이 어둡고 표면에 구멍이 있는 것도 있는 화성암이다."
    },
    "prompt": "<보기>에서 현무암을 골라 기호를 쓰시오.",
    "givens": {
      "지문": "[11~13] 다음 <보기>의 화성암의 모습을 보고, 물음에 답하시오."
    },
    "choices": null,
    "figure": "assets/bank/s41-u03/s3-q11.webp",
    "figureNote": "<보기> 화성암 사진 두 장: ㉠ 밝은 회색에 알갱이가 보이는 암석(화강암), ㉡ 어두운 색에 표면에 구멍이 많은 암석(현무암).",
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
    "explanation": "㉠은 화강암, ㉡은 현무암입니다. 현무암은 색깔이 어둡고, 표면에 구멍이 있는 것도 있습니다.\n[자료 검토] 현재 필수는 현무암·화강암의 관찰과 분류입니다. 냉각 과정과 알갱이 크기 원인은 기존 교재의 연계 심화 자료로 구별합니다. 현무암은 표면 구멍이 없는 표본도 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "<보기>는 글이 아니라 암석 사진 ㉠, ㉡ 두 장."
    }
  },
  {
    "id": "s41-u03-o3-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 12,
      "page": 3,
      "sourceId": "sci-41-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "화강암이 만들어지는 장소",
      "concept": "화강암은 마그마가 땅속 깊은 곳에서 천천히 식어 만들어진다."
    },
    "prompt": "다음은 화성암이 만들어지는 장소를 나타낸 것입니다. <보기>에서 (가)에서 만들어지는 암석을 골라 기호를 쓰시오.",
    "givens": {
      "지문": "[11~13] 다음 <보기>의 화성암의 모습을 보고, 물음에 답하시오."
    },
    "choices": null,
    "figure": "assets/bank/s41-u03/s3-q12.webp",
    "figureNote": "화산 단면 그림. 땅속 깊은 곳 마그마가 있는 부분을 (가)로 가리킴.",
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
    "explanation": "화강암(㉠)은 마그마가 땅속 깊은 곳에서 천천히 식어 만들어지고, 현무암(㉡)은 마그마가 지표 가까이에서 빠르게 식어 만들어집니다.\n[자료 검토] 현재 필수는 현무암·화강암의 관찰과 분류입니다. 냉각 과정과 알갱이 크기 원인은 기존 교재의 연계 심화 자료로 구별합니다. 현무암은 표면 구멍이 없는 표본도 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답하려면 [11~13] 공통 <보기>의 암석 사진(쪽3, bbox [64,108,298,311])도 필요함 — figure 칸에는 이 문항 고유의 화산 단면 그림만 넣음."
    }
  },
  {
    "id": "s41-u03-o3-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 13,
      "page": 3,
      "sourceId": "sci-41-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "화강암과 현무암의 이용",
      "concept": "화강암은 석굴암·첨성대·컬링 스톤 등에, 현무암은 돌하르방·제주도 돌담·맷돌 등에 이용된다."
    },
    "prompt": "화성암을 이용한 예를 알맞게 짝 지은 것은 어느 것입니까?",
    "givens": {
      "지문": "[11~13] 다음 <보기>의 화성암의 모습을 보고, 물음에 답하시오."
    },
    "choices": [
      "석굴암 / 첨성대",
      "돌하르방 / 석굴암",
      "컬링 스톤 / 돌하르방",
      "제주도 돌담 / 석굴암",
      "맷돌 / 불국사 돌계단"
    ],
    "figure": "assets/bank/s41-u03/s3-q11.webp",
    "figureNote": "<보기> 화성암 사진 두 장: ㉠ 밝은 회색에 알갱이가 보이는 암석(화강암), ㉡ 어두운 색에 표면에 구멍이 많은 암석(현무암).",
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
    "explanation": "석굴암, 첨성대, 컬링 스톤, 불국사 돌계단은 화강암(㉠)을 이용한 예이고, 돌하르방, 제주도 돌담, 맷돌은 현무암(㉡)을 이용한 예입니다.\n[자료 검토] 현재 필수는 현무암·화강암의 관찰과 분류입니다. 냉각 과정과 알갱이 크기 원인은 기존 교재의 연계 심화 자료로 구별합니다. 현무암은 표면 구멍이 없는 표본도 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기가 표 형식: 열 머리 '㉠ / ㉡'(각각 <보기>의 암석 ㉠, ㉡)."
    }
  },
  {
    "id": "s41-u03-o3-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 14,
      "page": 3,
      "sourceId": "sci-41-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "화산 활동이 생활에 미치는 영향",
      "concept": "화산재와 화산 가스는 생물의 호흡을 어렵게 하고 호흡기 질병을 일으킬 수 있다."
    },
    "prompt": "화산 활동이 우리 생활에 미치는 영향에 대한 설명으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "용암이 흘러 산불이 발생한다.",
      "화산 활동으로 산사태가 발생한다.",
      "화산재로 인해 비행기 운항이 어려워진다.",
      "화산재가 생물의 몸에 들어가면 호흡기가 건강해진다.",
      "화산 활동으로 만들어진 지형을 관광 자원으로 이용한다."
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
    "explanation": "화산 활동으로 나오는 화산재와 화산 가스로 인해 생물이 숨을 쉬기 어렵고 호흡기 질병에 걸릴 수 있습니다.\n[자료 검토] 피해와 이로움의 조건·시점을 구별합니다. 화산재가 덮은 즉시의 피해와 오랜 뒤 일부 토양의 변화는 같은 조건이 아닙니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'않은'에 밑줄."
    }
  },
  {
    "id": "s41-u03-o3-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 15,
      "page": 3,
      "sourceId": "sci-41-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "화산 활동의 이로운 점(온천)",
      "concept": "화산 주변 땅속의 열을 이용해 온천을 개발하고 관광 자원으로 쓴다."
    },
    "prompt": "다음은 화산 활동이 주는 이로운 영향에 대한 설명입니다. 빈칸에 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "화산 주변 땅속의 열로 (    )을/를 개발하여 관광 자원으로 이용합니다."
    },
    "choices": null,
    "figure": "assets/bank/s41-u03/s3-q15.webp",
    "figureNote": "김이 피어오르는 푸른 물웅덩이(온천) 사진.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "온천",
      "accepted": [
        "온천"
      ]
    },
    "explanation": "화산 주변 땅속의 열로 온천을 개발하여 관광 자원으로 이용합니다.\n[자료 검토] 피해와 이로움의 조건·시점을 구별합니다. 화산재가 덮은 즉시의 피해와 오랜 뒤 일부 토양의 변화는 같은 조건이 아닙니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "빈칸은 네모 칸으로 인쇄됨."
    }
  },
  {
    "id": "s41-u03-o3-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 16,
      "page": 3,
      "sourceId": "sci-41-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "지진으로 나타나는 현상",
      "concept": "지진이 일어나면 땅이나 도로가 갈라지고 건물이 무너질 수 있다."
    },
    "prompt": "다음 <보기>에서 지진에 의해 나타날 수 있는 현상으로 알맞은 것을 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 도로가 갈라진다.",
        "㉡ 많은 비가 내린다.",
        "㉢ 화산재가 태양 빛을 가려 날씨가 변한다."
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
        "도로가 갈라진다."
      ]
    },
    "explanation": "지진이 일어나면 땅이나 도로가 갈라지거나 건물이 무너질 수 있습니다. 지진에 의해 많은 비가 내리지는 않고, 화산재는 화산 활동이 일어날 때 나오는 화산 분출물입니다.\n[자료 검토] 원문의 규모는 지진 자체의 크기를 나타내는 자료로 읽습니다. 특정 장소의 흔들림·피해와 같은 뜻으로 쓰지 않으며 규모만으로 피해 순서를 정하지 않습니다. 지진 발생 원인은 현행 필수 평가에 넣지 않습니다.",
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
    "id": "s41-u03-o3-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 17,
      "page": 4,
      "sourceId": "sci-41-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "지진에 대한 바른 설명",
      "concept": "지진은 커다란 파도(지진 해일)를 만들기도 하며, 우리나라도 지진에 안전한 지역이 아니다."
    },
    "prompt": "다음 <보기>에서 지진에 대한 알맞은 설명을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 우리나라는 지진에 안전한 지역이다.",
        "㉡ 지진으로 커다란 파도가 만들어지기도 한다.",
        "㉢ 지진으로 사람이 다칠 수는 있지만 죽지는 않는다."
      ]
    },
    "choices": [
      "㉠",
      "㉡",
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
    "explanation": "지진으로 사람이 죽거나 다칠 수 있습니다. 최근 우리나라에서도 규모가 큰 지진이 발생하고 있기 때문에 우리나라도 지진에 안전한 지역이 아닙니다. 지진으로 발생하는 커다란 파도를 지진 해일이라고 합니다.\n[자료 검토] 원문의 규모는 지진 자체의 크기를 나타내는 자료로 읽습니다. 특정 장소의 흔들림·피해와 같은 뜻으로 쓰지 않으며 규모만으로 피해 순서를 정하지 않습니다. 지진 발생 원인은 현행 필수 평가에 넣지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기는 두 열로 인쇄됨(①②/③④/⑤)."
    }
  },
  {
    "id": "s41-u03-o3-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 18,
      "page": 4,
      "sourceId": "sci-41-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "지진 규모 비교",
      "concept": "규모는 지진의 세기를 숫자로 나타낸 것으로 숫자가 클수록 강한 지진이다."
    },
    "prompt": "다음은 세계 여러 나라에서 발생한 지진을 정리한 것입니다. 가장 강한 지진과 가장 약한 지진이 발생한 연도를 알맞게 짝 지은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "2016년 / 2023년",
      "2018년 / 2016년",
      "2019년 / 2023년",
      "2023년 / 2016년",
      "2023년 / 2019년"
    ],
    "figure": "assets/bank/s41-u03/s3-q18.webp",
    "figureNote": "연도·지역·규모 표. 2016년 우리나라5.8, 2018년 일본6.7, 2019년 미국7.1, 2023년 튀르키예7.8.",
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
    "explanation": "규모는 지진의 세기를 숫자로 나타낸 것으로, 규모의 숫자가 클수록 강한 지진입니다. 2023년 튀르키예에서 발생한 규모 7.8의 지진이 가장 강한 지진이고, 2016년 우리나라에서 발생한 규모 5.8의 지진이 가장 약한 지진입니다.\n[자료 검토] 원문의 규모는 지진 자체의 크기를 나타내는 자료로 읽습니다. 특정 장소의 흔들림·피해와 같은 뜻으로 쓰지 않으며 규모만으로 피해 순서를 정하지 않습니다. 지진 발생 원인은 현행 필수 평가에 넣지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "보기가 표 형식: 열 머리 '가장 강한 지진 / 가장 약한 지진'."
    }
  },
  {
    "id": "s41-u03-o3-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 19,
      "page": 4,
      "sourceId": "sci-41-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "화산 활동 대처 방법",
      "concept": "화산 활동이 일어나면 화산으로부터 멀리 대피해야 한다."
    },
    "prompt": "화산 활동 대처 방법으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "화산재가 날리면 가급적 실내에 머무릅니다.",
      "산사태에 주의하면서 화산 위쪽으로 대피합니다.",
      "재난 방송을 확인하면서 현재 상황을 파악합니다.",
      "화산재가 모두 떨어진 뒤에 화산재를 깨끗이 청소합니다.",
      "밖에 있는 경우 마스크나 손수건 등으로 코와 입을 막고 건물 안으로 신속하게 대피합니다."
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
    "explanation": "화산 활동이 일어나면 화산으로부터 멀리 대피해야 합니다.\n[자료 검토] 공식 재난 안내·교사/보호자 안내를 따릅니다. 원문의 청소 안내를 학생의 화산재 채집/지붕 청소 과제로 옮기지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'않은'에 밑줄."
    }
  },
  {
    "id": "s41-u03-o3-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 3,
      "no": 20,
      "page": 4,
      "sourceId": "sci-41-3-cats-set3",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트3",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "지진 대처 방법",
      "concept": "대중교통 안에서 지진이 나면 손잡이나 기둥을 잡고, 멈춘 뒤 안내에 따라 대피한다."
    },
    "prompt": "다음 <보기>에서 지진 대처 방법으로 알맞지 않은 것을 골라 기호를 쓰시오.",
    "givens": {
      "보기": [
        "㉠ 집 밖에 있을 때는 가방이나 손으로 머리를 보호한다.",
        "㉡ 집 안에 있을 때는 탁자 아래로 들어가 몸을 보호한다.",
        "㉢ 버스 안에 있을 때는 버스가 움직이고 있더라도 빠르게 창문으로 내려 대피한다."
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
        "ㄷ"
      ]
    },
    "explanation": "대중교통을 타고 있을 때 지진이 일어나면 손잡이나 기둥을 잡아 넘어지지 않도록 하고 대중교통이 멈추면 안내에 따라 대피합니다.\n[자료 검토] 학교의 안내에 따라 몸을 보호하고 흔들림이 멈춘 뒤 질서 있게 대피합니다. 학생이 가스·전기 설비를 직접 조작하도록 요구하지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'않은'에 밑줄."
    }
  },
  {
    "id": "s41-u03-o4-01",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 1,
      "page": 1,
      "sourceId": "sci-41-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "흙 언덕 실험에서 흙이 쌓이는 곳",
      "concept": "흐르는 물은 흙 언덕 윗부분의 흙을 깎아 운반한 뒤 아랫부분에 쌓는다."
    },
    "prompt": "다음 <보기>에서 위 실험 결과 흙이 가장 많이 쌓이는 곳을 골라 기호를 쓰시오.",
    "givens": {
      "지문": "[01~02] 다음과 같이 흙 언덕을 만들어 위쪽에 색 모래를 뿌린 후 흙 언덕의 위쪽에서 물을 천천히 흘려보냈습니다. 물음에 답하시오.",
      "보기": [
        "㉠ 흙 언덕의 윗부분",
        "㉡ 흙 언덕의 아랫부분",
        "㉢ 흙 언덕의 중간 부분"
      ]
    },
    "choices": null,
    "figure": "assets/bank/s41-u03/s4-q01.webp",
    "figureNote": "흙 언덕(윗부분에 색 모래)을 쟁반에 쌓고, 장갑 낀 손이 비커로 언덕 위쪽에 물을 붓는 그림",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉡",
      "accepted": [
        "㉡",
        "ㄴ",
        "흙 언덕의 아랫부분"
      ]
    },
    "explanation": "물이 흐르면서 윗부분의 흙을 깎고 운반하여 아랫부분에 흙이 많이 쌓입니다.\n[자료 검토] 제시한 조건의 모형과 전형적인 강 지형을 비교합니다. 여러 작용이 함께 나타날 수 있으며 모든 실제 강의 지점/시간에 같은 결과를 단정하지 않습니다.",
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
    "id": "s41-u03-o4-02",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 2,
      "page": 1,
      "sourceId": "sci-41-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "흙 언덕 윗부분·아랫부분의 침식과 퇴적",
      "concept": "흙 언덕의 윗부분에서는 침식 작용이, 아랫부분에서는 퇴적 작용이 더 활발하다."
    },
    "prompt": "다음은 위 실험 결과를 통해 알 수 있는 내용입니다. ㉠, ㉡에 들어갈 알맞은 말을 골라 쓰시오.",
    "givens": {
      "지문": "[01~02] 다음과 같이 흙 언덕을 만들어 위쪽에 색 모래를 뿌린 후 흙 언덕의 위쪽에서 물을 천천히 흘려보냈습니다. 물음에 답하시오.\n흙 언덕의 윗부분에서는 ㉠ ( 침식, 퇴적 ) 작용이 더 활발하게 일어나고, 흙 언덕의 아랫부분에서는 ㉡ ( 침식, 퇴적 ) 작용이 더 활발하게 일어납니다."
    },
    "choices": null,
    "figure": "assets/bank/s41-u03/s4-q01.webp",
    "figureNote": "흙 언덕(윗부분에 색 모래)을 쟁반에 쌓고, 장갑 낀 손이 비커로 언덕 위쪽에 물을 붓는 그림",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 침식, ㉡ 퇴적",
      "accepted": [
        "㉠ 침식, ㉡ 퇴적",
        "㉠-침식, ㉡-퇴적",
        "침식, 퇴적",
        "㉠ 침식 작용, ㉡ 퇴적 작용"
      ]
    },
    "explanation": "흐르는 물에 의한 침식 작용은 바위나 돌, 흙 등을 깎아 내는 것, 퇴적 작용은 운반된 돌이나 흙 등이 쌓이는 것을 말합니다.\n흙 언덕의 윗부분에서는 침식 작용이 더 활발하게 일어나고, 흙 언덕의 아랫부분에서는 퇴적 작용이 더 활발하게 일어납니다.\n[자료 검토] 제시한 조건의 모형과 전형적인 강 지형을 비교합니다. 여러 작용이 함께 나타날 수 있으며 모든 실제 강의 지점/시간에 같은 결과를 단정하지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문 칸의 ㉠/㉡ 뒤 괄호 안에 '침식, 퇴적' 두 낱말이 선택지로 인쇄되어 있음."
    }
  },
  {
    "id": "s41-u03-o4-03",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 3,
      "page": 1,
      "sourceId": "sci-41-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "흐르는 물의 작용",
      "concept": "흐르는 물은 침식·운반·퇴적 작용으로 오랜 시간에 걸쳐 땅의 모습을 바꾼다."
    },
    "prompt": "흐르는 물의 작용에 대한 설명으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "바위나 돌, 흙을 깎아 낸다.",
      "돌이나 흙을 낮은 곳에 쌓아 놓는다.",
      "돌이나 흙을 다른 곳으로 이동시킨다.",
      "흐르는 물에 의해 침식 작용, 운반 작용, 퇴적 작용이 일어난다.",
      "짧은 시간 동안 침식 작용, 운반 작용, 퇴적 작용이 동시에 일어나 땅의 모습을 변화시킨다."
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
    "explanation": "흐르는 물은 여러 가지 작용으로 오랜 시간에 걸쳐 땅의 모습을 변화시킵니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'않은'에 밑줄이 그어져 있음."
    }
  },
  {
    "id": "s41-u03-o4-04",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 4,
      "page": 1,
      "sourceId": "sci-41-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "강 상류의 특징",
      "concept": "강 상류는 강폭이 좁고 경사가 급하며 큰 바위나 돌이 많다."
    },
    "prompt": "㉠과 ㉡ 중 다음 설명에 해당하는 곳의 기호를 쓰시오.",
    "givens": {
      "지문": "[04~05] 다음은 강 주변 지형의 모습입니다. 물음에 답하시오.\n• 강폭이 좁고, 강의 경사가 급합니다.\n• 큰 바위나 돌이 많고 계곡이나 폭포를 많이 볼 수 있습니다."
    },
    "choices": null,
    "figure": "assets/bank/s41-u03/s4-q04.webp",
    "figureNote": "강 주변 지형 단면 그림. ㉠은 경사가 급한 산지의 강 상류(바위·돌), ㉡은 경사가 완만한 바다 근처 강 하류(모래가 쌓인 곳)를 가리킨다.",
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
    "explanation": "㉠은 강 상류, ㉡은 강 하류입니다. 강폭이 좁고, 강의 경사가 급하며, 큰 바위나 돌이 많은 곳은 강 상류입니다.\n[자료 검토] 제시한 조건의 모형과 전형적인 강 지형을 비교합니다. 여러 작용이 함께 나타날 수 있으며 모든 실제 강의 지점/시간에 같은 결과를 단정하지 않습니다.",
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
    "id": "s41-u03-o4-05",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 5,
      "page": 1,
      "sourceId": "sci-41-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "강 하류에서 활발한 작용",
      "concept": "강 하류에서는 침식 작용보다 퇴적 작용이 활발하게 일어난다."
    },
    "prompt": "㉡에서는 침식 작용과 퇴적 작용 중 어느 것이 더 활발하게 일어나는지 쓰시오.",
    "givens": {
      "지문": "[04~05] 다음은 강 주변 지형의 모습입니다. 물음에 답하시오."
    },
    "choices": null,
    "figure": "assets/bank/s41-u03/s4-q04.webp",
    "figureNote": "강 주변 지형 단면 그림. ㉠은 경사가 급한 산지의 강 상류(바위·돌), ㉡은 경사가 완만한 바다 근처 강 하류(모래가 쌓인 곳)를 가리킨다.",
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "퇴적",
      "accepted": [
        "퇴적",
        "퇴적 작용",
        "퇴적작용"
      ]
    },
    "explanation": "㉡은 강 하류로, 퇴적 작용이 침식 작용보다 활발하게 일어납니다.\n[자료 검토] 제시한 조건의 모형과 전형적인 강 지형을 비교합니다. 여러 작용이 함께 나타날 수 있으며 모든 실제 강의 지점/시간에 같은 결과를 단정하지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "답란은 '(        ) 작용' 형태로 인쇄됨."
    }
  },
  {
    "id": "s41-u03-o4-06",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 6,
      "page": 1,
      "sourceId": "sci-41-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "우리나라의 화산",
      "concept": "한라산은 우리나라의 화산이다."
    },
    "prompt": "우리나라의 화산은 어느 것입니까?",
    "givens": null,
    "choices": [
      "지리산",
      "한라산",
      "후지산",
      "베수비오산",
      "안나푸르나산"
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
    "explanation": "한라산은 우리나라의 화산이고, 지리산은 우리나라 산이지만 화산이 아닙니다. 후지산은 일본, 베수비오산은 이탈리아의 화산이며, 안나푸르나산은 네팔의 화산이 아닌 산입니다.",
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
    "id": "s41-u03-o4-07",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 7,
      "page": 2,
      "sourceId": "sci-41-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "화산의 분화구",
      "concept": "화산 꼭대기에는 분화구가 있는 것도 있고, 그곳에 물이 고여 호수가 되기도 한다."
    },
    "prompt": "다음은 화산에 대한 설명입니다. 빈칸에 공통으로 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "• 화산 꼭대기에 □이/가 있는 것도 있습니다.\n• □에 물이 고여 커다란 호수나 물웅덩이가 만들어진 것도 있습니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "분화구",
      "accepted": [
        "분화구"
      ]
    },
    "explanation": "화산 꼭대기에 분화구가 있는 것도 있고, 분화구에 물이 고여 커다란 호수나 물웅덩이가 만들어진 것도 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "□는 인쇄된 빈 네모 칸(빈칸)을 나타냄."
    }
  },
  {
    "id": "s41-u03-o4-08",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 8,
      "page": 2,
      "sourceId": "sci-41-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "화산 활동의 뜻과 특징",
      "concept": "화산 활동은 땅속 마그마가 땅 밖으로 분출하는 현상이며, 독도 같은 화산섬을 만들고 여러 화산 분출물을 내보낸다."
    },
    "prompt": "다음 <보기>에서 화산 활동에 대한 알맞은 설명을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 우리나라의 독도는 화산 활동으로 만들어진 섬이다.",
        "㉡ 화산 활동이 일어날 때 여러 가지 화산 분출물이 나온다.",
        "㉢ 화산 활동은 땅속에 있던 물과 수증기가 땅 밖으로 분출하는 현상이다."
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
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "화산 활동은 땅속에 있던 마그마가 땅 밖으로 분출하는 현상입니다. 화산 활동으로 독도와 같은 화산섬이 만들어지고, 화산 활동이 일어날 때 여러 가지 화산 분출물이 나옵니다.",
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
    "id": "s41-u03-o4-09",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 9,
      "page": 2,
      "sourceId": "sci-41-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "액체 상태의 화산 분출물",
      "concept": "화산 분출물 중 용암은 액체, 화산재와 화산 암석 조각은 고체, 화산 가스는 기체 상태이다."
    },
    "prompt": "화산 분출물 중에서 액체 상태인 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "용암",
      "화산재",
      "수증기",
      "화산 가스",
      "화산 암석 조각"
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
    "explanation": "화산 분출물 중에서 액체 상태인 것은 용암입니다. 화산재와 화산 암석 조각은 고체 상태, 수증기를 포함한 화산 가스는 기체 상태입니다.",
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
    "id": "s41-u03-o4-10",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 10,
      "page": 2,
      "sourceId": "sci-41-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "화산재",
      "concept": "화산재는 화산 활동 때 나오는 크기 2 mm 이하의 가루 물질이다."
    },
    "prompt": "다음에서 설명하는 화산 분출물은 무엇인지 쓰시오.",
    "givens": {
      "지문": "화산 활동이 일어날 때 나오는 가루 물질로, 크기가 2 mm 이하로 매우 작습니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "화산재",
      "accepted": [
        "화산재"
      ]
    },
    "explanation": "화산 활동이 일어날 때 나오는 가루 물질로, 크기가 2 mm 이하로 매우 작은 것은 화산재입니다.",
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
    "id": "s41-u03-o4-11",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 11,
      "page": 2,
      "sourceId": "sci-41-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "화산 활동 모형과 실제 화산 활동 비교",
      "concept": "화산 활동 모형에서 피어오르는 연기는 화산 가스, 흘러나오는 녹은 마시멜로는 용암에 해당한다."
    },
    "prompt": "다음은 위 실험의 결과를 확인한 후 화산 활동 모형과 실제 화산 활동을 비교한 내용입니다. ㉠, ㉡에 들어갈 알맞은 말을 쓰시오.",
    "givens": {
      "지문": "[11~12] 다음은 화산 활동 모형을 만드는 실험 과정입니다. 물음에 답하시오.\n• 화산 활동 모형의 윗부분에서 피어오르는 연기는 실제 화산 활동의 ㉠을/를 나타냅니다.\n• 화산 활동 모형의 윗부분에서 흘러나오는 녹은 마시멜로는 실제 화산 활동의 ㉡을/를 나타냅니다.",
      "과정": [
        "(가) 알루미늄 포일 위에 마시멜로를 올려놓고 빨간색 식용 색소를 뿌립니다.",
        "(나) 알루미늄 포일로 마시멜로를 감싼 후 윗부분을 조금 열어 두고 은박 접시 위에 올려놓습니다.",
        "(다) 은박 접시를 가열 장치에 올려놓고 가열하면서 나타나는 현상을 관찰합니다."
      ],
      "학습 안내": "원문/교사 시범 자료를 읽는 문제입니다. 학생이 가열·뜨거운 재료·연기 관찰을 따라 하지 않습니다. 모형의 물질·온도·크기·분출 원리는 실제와 다릅니다."
    },
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 화산 가스, ㉡ 용암",
      "accepted": [
        "㉠ 화산 가스, ㉡ 용암",
        "㉠-화산 가스, ㉡-용암",
        "화산 가스, 용암",
        "화산가스, 용암"
      ]
    },
    "explanation": "화산 활동 모형의 윗부분에서 피어오르는 연기는 실제 화산 활동의 화산 가스를 나타내고, 화산 활동 모형의 윗부분에서 흘러나오는 녹은 마시멜로는 실제 화산 활동의 용암을 나타냅니다.\n[자료 검토] 원문/교사 시범 자료를 읽는 문제입니다. 학생이 가열·뜨거운 재료·연기 관찰을 따라 하지 않습니다. 모형의 물질·온도·크기·분출 원리는 실제와 다릅니다. 연기라는 표현은 나오는 모습의 대응이며 실제 화산 가스와 성분이 같다는 뜻이 아닙니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "지문의 ㉠, ㉡은 각각 네모 칸 안에 인쇄된 빈칸임. '<과정>' 상자는 [11~12] 공통 자료."
    }
  },
  {
    "id": "s41-u03-o4-12",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 12,
      "page": 2,
      "sourceId": "sci-41-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "화산 활동 모형과 실제 화산 활동의 차이",
      "concept": "화산 활동 모형에서 흘러나온 녹은 마시멜로는 시간이 지나면 식어서 굳는다."
    },
    "prompt": "화산 활동 모형과 실제 화산 활동에 대한 설명으로 알맞지 않은 것은 어느 것입니까?",
    "givens": {
      "지문": "[11~12] 다음은 화산 활동 모형을 만드는 실험 과정입니다. 물음에 답하시오.",
      "과정": [
        "(가) 알루미늄 포일 위에 마시멜로를 올려놓고 빨간색 식용 색소를 뿌립니다.",
        "(나) 알루미늄 포일로 마시멜로를 감싼 후 윗부분을 조금 열어 두고 은박 접시 위에 올려놓습니다.",
        "(다) 은박 접시를 가열 장치에 올려놓고 가열하면서 나타나는 현상을 관찰합니다."
      ],
      "학습 안내": "원문/교사 시범 자료를 읽는 문제입니다. 학생이 가열·뜨거운 재료·연기 관찰을 따라 하지 않습니다. 모형의 물질·온도·크기·분출 원리는 실제와 다릅니다."
    },
    "choices": [
      "실제 화산 활동은 화산 활동 모형에 비해 크기가 크다.",
      "화산 활동 모형에서는 고체 상태의 물질이 나오지 않는다.",
      "화산 활동 모형은 실제 화산 활동처럼 큰 소리가 나지 않는다.",
      "실제 화산 활동은 지표면의 약한 부분을 뚫고 분출이 일어난다.",
      "화산 활동 모형에서 흘러나온 액체 상태의 물질은 시간이 지나도 굳지 않는다."
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
    "explanation": "화산 활동 모형에서 흘러나온 액체 상태의 물질은 시간이 지나면 식어서 굳습니다.\n[자료 검토] 원문/교사 시범 자료를 읽는 문제입니다. 학생이 가열·뜨거운 재료·연기 관찰을 따라 하지 않습니다. 모형의 물질·온도·크기·분출 원리는 실제와 다릅니다. 연기라는 표현은 나오는 모습의 대응이며 실제 화산 가스와 성분이 같다는 뜻이 아닙니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'않은'에 밑줄이 그어져 있음."
    }
  },
  {
    "id": "s41-u03-o4-13",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 13,
      "page": 3,
      "sourceId": "sci-41-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "화강암과 현무암의 특징",
      "concept": "현무암의 구멍은 가스가 빠져나가며 생긴 것으로, 구멍이 없는 현무암도 있다."
    },
    "prompt": "화강암과 현무암에 대한 설명으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "현무암은 색깔이 어둡다.",
      "화강암과 현무암은 화성암이다.",
      "현무암은 모두 표면에 구멍이 있다.",
      "현무암으로 돌하르방, 맷돌을 만든다.",
      "화강암은 여러 가지 색깔의 알갱이가 섞여 있다."
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
    "explanation": "현무암의 구멍은 현무암이 만들어지는 과정에서 가스가 빠져나가면서 생긴 것으로, 구멍이 있는 것도 있고 없는 것도 있습니다.\n[자료 검토] 현재 필수는 현무암·화강암의 관찰과 분류입니다. 냉각 과정과 알갱이 크기 원인은 기존 교재의 연계 심화 자료로 구별합니다. 현무암은 표면 구멍이 없는 표본도 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'않은'에 밑줄이 그어져 있음."
    }
  },
  {
    "id": "s41-u03-o4-14",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 14,
      "page": 3,
      "sourceId": "sci-41-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T07",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "화강암 알갱이가 큰 까닭",
      "concept": "마그마가 땅속 깊은 곳에서 천천히 식을수록 암석을 이루는 알갱이가 커지므로 화강암의 알갱이가 현무암보다 크다."
    },
    "prompt": "화강암은 현무암에 비해 암석을 이루는 알갱이의 크기가 큽니다. 화강암을 이루는 알갱이의 크기가 현무암을 이루는 알갱이의 크기보다 큰 까닭을 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "화강암은 현무암보다 마그마가 더 천천히 식어 만들어지기 때문이다.",
      "rubric": {
        "required": [
          "마그마가 천천히 식어 만들어졌다는 내용"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "마그마가 천천히 식어 암석이 만들어졌다는 내용이 포함되어 있으면 정답으로 합니다."
        ]
      }
    },
    "explanation": "화강암은 마그마가 땅속 깊은 곳에서 천천히 식어 만들어졌고, 현무암은 마그마가 지표 가까이에서 빠르게 식어 만들어졌습니다. 마그마가 천천히 식을수록 암석을 이루는 알갱이의 크기가 커집니다.\n[채점 기준] 마그마가 천천히 식어 암석이 만들어졌다는 내용이 포함되어 있으면 정답으로 합니다.\n[자료 검토] 현재 필수는 현무암·화강암의 관찰과 분류입니다. 냉각 과정과 알갱이 크기 원인은 기존 교재의 연계 심화 자료로 구별합니다. 현무암은 표면 구멍이 없는 표본도 있습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준 표에 배점 비율이 인쇄되어 있지 않음(단일 기준이라 100%로 기록). 해설은 정답 PDF 2쪽에 이어짐."
    }
  },
  {
    "id": "s41-u03-o4-15",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 15,
      "page": 3,
      "sourceId": "sci-41-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "화산 활동이 우리 생활에 미치는 영향",
      "concept": "화산재는 땅을 기름지게 하지만 비행기 운항 방해나 호흡기 질병 같은 해로운 영향도 준다."
    },
    "prompt": "화산 활동이 우리 생활에 미치는 영향으로 알맞지 않은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "용암이 흘러 산불이 발생한다.",
      "화산 주변의 열을 이용해 전기를 만든다.",
      "화산재는 땅을 기름지게 하는 이로운 영향만 준다.",
      "화산 주변에서 온천을 개발하여 관광 자원으로 이용한다.",
      "화산 활동은 우리 생활에 피해를 주기도 하지만 이로운 영향을 주기도 한다."
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
    "explanation": "화산재는 땅을 기름지게 하는 이로운 영향을 주지만, 비행기 운항을 어렵게 하거나 호흡기 질병을 일으키게 하는 해로운 영향도 줍니다.\n[자료 검토] 피해와 이로움의 조건·시점을 구별합니다. 화산재가 덮은 즉시의 피해와 오랜 뒤 일부 토양의 변화는 같은 조건이 아닙니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'않은'에 밑줄이 그어져 있음(줄바꿈으로 '않/은'이 두 줄에 걸쳐 밑줄)."
    }
  },
  {
    "id": "s41-u03-o4-16",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 16,
      "page": 3,
      "sourceId": "sci-41-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "지진의 규모",
      "concept": "규모는 지진의 세기를 숫자로 나타낸 것으로, 숫자가 클수록 강한 지진이다."
    },
    "prompt": "지진의 세기가 가장 강한 지진은 어느 것입니까?",
    "givens": null,
    "choices": [
      "규모 4.6의 지진",
      "규모 5.4의 지진",
      "규모 5.8의 지진",
      "규모 6.2의 지진",
      "규모 7.5의 지진"
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
    "explanation": "규모는 지진의 세기를 숫자로 나타낸 것입니다. 규모의 숫자가 클수록 강한 지진입니다.\n[자료 검토] 원문의 규모는 지진 자체의 크기를 나타내는 자료로 읽습니다. 특정 장소의 흔들림·피해와 같은 뜻으로 쓰지 않으며 규모만으로 피해 순서를 정하지 않습니다. 지진 발생 원인은 현행 필수 평가에 넣지 않습니다.",
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
    "id": "s41-u03-o4-17",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 17,
      "page": 3,
      "sourceId": "sci-41-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "지진의 특징과 대비",
      "concept": "우리나라도 지진에 안전한 지역이 아니므로 지진 피해에 대비해야 하며, 대비 정도에 따라 피해 정도가 달라진다."
    },
    "prompt": "다음 <보기>에서 지진에 대한 알맞은 설명을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 지진에 의해 산사태나 해일이 발생하기도 한다.",
        "㉡ 같은 지진이라도 지진에 대비한 정도에 따라 피해 정도가 다르게 나타난다.",
        "㉢ 우리나라는 지진에 안전한 지역이므로 지진으로 인한 피해를 대비하지 않아도 된다."
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
    "explanation": "최근 우리나라에서 규모가 큰 지진이 발생하고 있기 때문에 우리나라도 지진에 안전한 지역이 아닙니다. 따라서 지진으로 인한 피해를 입지 않도록 대비해야 합니다.\n[자료 검토] 원문의 규모는 지진 자체의 크기를 나타내는 자료로 읽습니다. 특정 장소의 흔들림·피해와 같은 뜻으로 쓰지 않으며 규모만으로 피해 순서를 정하지 않습니다. 지진 발생 원인은 현행 필수 평가에 넣지 않습니다.",
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
    "id": "s41-u03-o4-18",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 18,
      "page": 3,
      "sourceId": "sci-41-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "화산 활동 대처 방법",
      "concept": "화산재가 날리면 실내에 머무르거나 건물·자동차 안으로 대피하고, 화산재가 모두 떨어진 뒤에 청소한다."
    },
    "prompt": "화산 활동 대처 방법으로 알맞지 않은 것을 두 가지 고르시오.",
    "givens": null,
    "choices": [
      "재난 방송을 확인한다.",
      "화산으로부터 멀리 대피한다.",
      "화산재가 날리면 가급적 실내에 머무른다.",
      "화산재가 모두 떨어지기 전에 화산재를 깨끗이 청소한다.",
      "밖에 있는 경우 손수건 등으로 코와 입을 막고 신속하게 운동장으로 대피한다."
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
    "explanation": "화산재가 날리면 가급적 실내에 머무르고, 밖에 있는 경우 마스크나 손수건, 옷 등으로 코와 입을 막고 자동차나 건물 안으로 신속하게 대피합니다. 화산재가 모두 떨어진 뒤에는 쌓인 화산재를 깨끗이 청소합니다.\n[자료 검토] 공식 재난 안내·교사/보호자 안내를 따릅니다. 원문의 청소 안내를 학생의 화산재 채집/지붕 청소 과제로 옮기지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "'않은'에 밑줄이 그어져 있음."
    }
  },
  {
    "id": "s41-u03-o4-19",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 19,
      "page": 4,
      "sourceId": "sci-41-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "장소별 지진 대처 방법",
      "concept": "지진 때 학교에서는 책상 아래로, 대중교통에서는 손잡이를 잡고, 집 밖에서는 건물과 떨어진 넓은 곳으로 대피하며, 집 안에서는 가스를 차단한다."
    },
    "prompt": "다음 <보기>에서 알맞은 장소별 지진 대처 방법을 모두 고른 것은 어느 것입니까?",
    "givens": {
      "보기": [
        "㉠ 학교: 책상 아래로 들어간다.",
        "㉡ 집 밖: 높은 건물 옆으로 대피한다.",
        "㉢ 대중교통: 손잡이나 기둥을 잡아 넘어지지 않도록 한다.",
        "㉣ 집 안: 가스에 이상이 없는지 확인하기 위해 가스레인지를 켜 본다."
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
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "집 밖에 있을 때 지진이 발생하면 가방이나 손으로 머리를 보호하고, 건물과 거리를 두고 넓은 공간으로 대피합니다. 집 안에 있을 때 지진이 발생하면 탁자 아래로 들어가 몸을 보호하고, 흔들림이 멈추면 전기와 가스를 차단한 뒤 밖으로 나갑니다.\n[자료 검토] 학교의 안내에 따라 몸을 보호하고 흔들림이 멈춘 뒤 질서 있게 대피합니다. 학생이 가스·전기 설비를 직접 조작하도록 요구하지 않습니다.",
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
    "id": "s41-u03-o4-20",
    "status": "verified",
    "sourceRef": {
      "type": "original",
      "set": 4,
      "no": 20,
      "page": 4,
      "sourceId": "sci-41-3-cats-set4",
      "edition": "시매쓰DMC 최다빈출 단원평가 세트4",
      "course": "초등4-1",
      "unit": "Ⅲ. 땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T11",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "승강기에서의 지진 대처",
      "concept": "지진 때 승강기는 전기가 끊겨 멈출 수 있으므로 가장 먼저 열리는 층에서 내려 계단으로 대피한다."
    },
    "prompt": "승강기에 있을 때 지진이 발생한다면 어떻게 대처해야 하는지 쓰시오.",
    "givens": null,
    "choices": null,
    "figure": null,
    "figureNote": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "모든 층의 버튼을 눌러 가장 먼저 열리는 층에서 내린 후 계단을 이용하여 대피한다.",
      "rubric": {
        "required": [
          "승강기에서 내려 계단으로 대피한다는 내용"
        ],
        "pass": "채점 기준을 모두 담으면 정답",
        "criteria": [
          "승강기에서 빠르게 내려 계단으로 대피한다는 내용이 포함되어 있으면 정답으로 합니다."
        ]
      }
    },
    "explanation": "승강기에 있을 때 지진이 발생하면 전기가 끊겨 승강기가 멈출 수 있으므로 빠르게 승강기에서 내려 계단으로 대피해야 합니다.\n[채점 기준] 승강기에서 빠르게 내려 계단으로 대피한다는 내용이 포함되어 있으면 정답으로 합니다.\n[자료 검토] 학교의 안내에 따라 몸을 보호하고 흔들림이 멈춘 뒤 질서 있게 대피합니다. 학생이 가스·전기 설비를 직접 조작하도록 요구하지 않습니다.",
    "evidence": {
      "checkedBy": "원문 대조",
      "date": "2026-10-18",
      "gates": [
        "source",
        "answer"
      ],
      "against": "정답 및 풀이",
      "note": "채점 기준 표에 배점 비율이 인쇄되어 있지 않음(단일 기준이라 100%로 기록)."
    }
  }
];
