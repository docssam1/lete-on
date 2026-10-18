// 3-1 Ⅳ 생물의 한살이 — 보충 문항. 원문은 s31-u04.source.js, 짝 문항은 s31-u04.similar.js, 5E 수업은 s31-u04.lesson.js.
export const unit = {
  "id": "s31-u04",
  "course": "3-1",
  "no": 4,
  "title": "생물의 한살이",
  "domain": "생명",
  "sources": {
    "bank": [
      "data/units/s31-u04.source.js"
    ]
  }
};
export const items = [
  {
    "id": "s31-u04-b01",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "concept": "식물의 한살이와 관찰 자료",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "관찰 기록의 식물 가에 알맞은 한살이 유형을 고르세요.",
    "givens": {
      "관찰 기록(모형 값)": "봄에 심은 씨앗에서 싹이 났다. 같은 해 꽃과 열매가 생기고 새 씨앗을 남겼다. 겨울 전에는 그 식물 개체가 죽었다."
    },
    "choices": [
      "번데기를 거치는 한살이",
      "같은 개체가 여러 해 사는 여러해살이",
      "겨울마다 같은 씨앗으로 되돌아가는 한살이",
      "땅 위의 줄기가 언제나 살아 있는 여러해살이",
      "한 해 안에 한살이를 마치는 한해살이"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "식물 가는 한 해 안에 씨앗에서 자라 새 씨앗을 남긴 뒤 한살이를 마쳤으므로 한해살이예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "교육부 4과04-03 범위. 비상교육 공개 식물의 한살이 요점 PDF 8쪽의 개념만 참고하고 문장·그림·문항은 옮기지 않음."
    }
  },
  {
    "id": "s31-u04-b02",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "concept": "식물의 한살이와 관찰 자료",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 식물 나의 한살이에 대한 판단으로 알맞은 것은 무엇인가요?",
    "givens": {
      "관찰 기록(모형 값)": "식물 나의 땅 위 잎은 겨울에 시들었지만 땅속 부분은 살아 있었다. 표시해 둔 같은 개체에서 이듬해 새순이 나와 자라고 꽃과 열매가 생겼다."
    },
    "choices": [
      "잎이 시들었으므로 그 개체는 반드시 한해살이다.",
      "같은 개체가 이듬해에도 살아 있어 여러해살이다.",
      "새순이 났으므로 반드시 새 씨앗에서 자란 새 개체다.",
      "겨울에 잎이 남아 있지 않았으므로 식물로 볼 수 없다.",
      "해가 바뀌었으므로 반드시 한살이가 처음부터 시작된다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "겨울에 땅 위의 부분이 시들어도 같은 개체가 살아 이듬해 다시 자랐다면 여러해살이예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "교육부 4과04-03 범위. 비상교육 공개 식물의 한살이 요점 PDF 8쪽의 개념만 참고하고 문장·그림·문항은 옮기지 않음."
    }
  },
  {
    "id": "s31-u04-b03",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "concept": "식물의 한살이와 관찰 자료",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "지난해 식물이 있던 자리에 봄에 싹이 났습니다. 여러해살이인지 알아보려면 무엇을 더 확인해야 하나요?",
    "givens": null,
    "choices": [
      "같은 자리에 났으므로 지난해 잎의 색만 다시 확인한다.",
      "봄에 났으므로 같은 날 주변의 모든 꽃 색을 비교한다.",
      "키가 작으므로 자로 길이만 재고 여러해살이로 정한다.",
      "새 씨앗에서 났는지, 살아남은 같은 개체의 새순인지 살핀다.",
      "잎이 초록색이므로 같은 자리에 싹이 났다는 기록만 남긴다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "같은 자리에 싹이 나도 새 씨앗에서 자란 다른 개체일 수 있어요. 겨울을 넘긴 같은 개체인지 살펴봐야 해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "교육부 4과04-03 범위. 비상교육 공개 식물의 한살이 요점 PDF 8쪽의 개념만 참고하고 문장·그림·문항은 옮기지 않음."
    }
  },
  {
    "id": "s31-u04-b04",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "concept": "식물의 한살이와 관찰 자료",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "한해살이와 여러해살이를 비교하는 기준으로 가장 알맞은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "같은 한 개체가 살아가며 한살이를 이어 가는 기간",
      "하루 동안 화분을 두었던 교실과 복도의 온도 차이",
      "한 번 관찰한 잎 한 장의 초록색이 얼마나 진한지",
      "다른 화분의 잎과 비교했을 때 어느 잎이 더 큰지",
      "같은 날 두 식물에 달린 꽃잎의 색이 서로 같은지"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "씨앗에서 다음 세대로 이어지는 과정과 함께 같은 한 개체가 살아가는 기간을 비교해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "교육부 4과04-03 범위. 비상교육 공개 식물의 한살이 요점 PDF 8쪽의 개념만 참고하고 문장·그림·문항은 옮기지 않음."
    }
  },
  {
    "id": "s31-u04-b05",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "concept": "식물의 한살이와 관찰 자료",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "줄기가 연한 풀로 분류한 식물 다를 관찰했습니다. 자료로 알 수 있는 것을 고르세요.",
    "givens": {
      "관찰 기록(모형 값)": "식물 다는 줄기가 연한 풀이다. 같은 개체를 표시해 두었더니 땅속 부분이 겨울을 넘기고 이듬해 다시 자랐다."
    },
    "choices": [
      "풀은 모두 한 해 안에 한살이를 마치고 죽는다.",
      "식물 다는 풀로 분류했으므로 같은 개체일 수 없다.",
      "풀 중에도 같은 개체가 여러 해 살아가는 것이 있다.",
      "땅속 부분이 살아남으면 반드시 나무로 분류해야 한다.",
      "새순이 보이는 식물은 모두 새로운 씨앗에서 시작한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "풀에도 여러해살이가 있어요. 줄기가 연한지와 한 개체가 몇 해 사는지는 다른 관찰 기준이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "교육부 4과04-03 범위. 비상교육 공개 식물의 한살이 요점 PDF 8쪽의 개념만 참고하고 문장·그림·문항은 옮기지 않음."
    }
  },
  {
    "id": "s31-u04-b06",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E4",
      "type": "T08",
      "format": "단답형",
      "concept": "식물의 한살이와 관찰 자료",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "가와 나에 알맞은 한살이 유형을 순서대로 쓰세요.",
    "givens": {
      "자료": "가: 한 해 안에 자라 새 씨앗을 남기고 그 개체가 죽음. / 나: 같은 개체가 여러 해 살아가며 한살이의 일부를 반복함."
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "한해살이, 여러해살이",
      "accepted": [
        "한해살이, 여러해살이",
        "가 한해살이 나 여러해살이",
        "가: 한해살이, 나: 여러해살이",
        "한해살이 식물, 여러해살이 식물"
      ]
    },
    "explanation": "가는 한해살이, 나는 여러해살이예요. 나의 경우 새 씨앗에서 난 다른 개체가 아니라 같은 개체가 이어 산다는 점이 중요해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "교육부 4과04-03 범위. 비상교육 공개 식물의 한살이 요점 PDF 8쪽의 개념만 참고하고 문장·그림·문항은 옮기지 않음."
    }
  },
  {
    "id": "s31-u04-b07",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "concept": "식물의 한살이와 관찰 자료",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "식물의 한살이 유형을 비교한 설명으로 알맞은 두 개를 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "여러해살이 식물은 겨울에도 모든 잎이 꼭 남아 있다.",
      "한해살이 식물은 한 해 안에 한살이를 마친다.",
      "한해살이가 남긴 씨앗에서 난 새 식물은 같은 개체이다.",
      "줄기가 연한 풀은 모두 한해살이로 분류한다.",
      "여러해살이는 같은 개체가 여러 해 살아갈 수 있다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        4
      ]
    },
    "explanation": "한해살이는 한 해 안에 한살이를 마치고, 여러해살이는 같은 개체가 여러 해 살아가요. 같은 자리의 새 싹이 모두 같은 개체인 것은 아니에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "교육부 4과04-03 범위. 비상교육 공개 식물의 한살이 요점 PDF 8쪽의 개념만 참고하고 문장·그림·문항은 옮기지 않음."
    }
  },
  {
    "id": "s31-u04-b08",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E4",
      "type": "T08",
      "format": "서술형",
      "concept": "식물의 한살이와 관찰 자료",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "두 식물의 한살이 유형을 나눌 때, 어떤 관찰 기준을 써야 하는지 설명하세요.",
    "givens": {
      "자료": "식물 가는 한 해 안에 씨앗을 남기고 죽었다. 식물 나는 표시한 같은 개체가 여러 해 살아 있었다."
    },
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "같은 한 개체가 한 해 안에 한살이를 마치는지 여러 해 살아가는지로 나눈다.",
      "rubric": {
        "required": [
          "같은 한 개체가 한 해 안에 한살이를 마치는지 또는 여러 해 사는지로 비교함"
        ],
        "pass": "같은 개체의 살아가는 기간을 구별하면 정답"
      }
    },
    "explanation": "한 번 본 키나 잎의 색보다 같은 개체가 살아가는 기간을 살펴야 해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "교육부 4과04-03 범위. 비상교육 공개 식물의 한살이 요점 PDF 8쪽의 개념만 참고하고 문장·그림·문항은 옮기지 않음."
    }
  },
  {
    "id": "s31-u04-b09",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "concept": "동물의 자라는 모습과 번식 방식",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "어린 개와 다 자란 개의 자료를 비교해 알 수 있는 것은 무엇인가요?",
    "givens": {
      "관찰 자료(가상 기록)": "어린 개는 젖을 먹고 다리에 힘이 약했다. 다 자란 뒤에는 사료를 먹고 잘 달렸다."
    },
    "choices": [
      "같은 동물도 자라면서 먹이와 움직임이 달라진다.",
      "다 자라면 모든 동물은 반드시 번데기 단계를 거친다.",
      "몸집이 커지더라도 먹이와 움직임은 반드시 그대로다.",
      "먹이가 바뀌면 그 개체는 다른 종류의 동물로 바뀐다.",
      "어린 개의 모습만으로 다 자란 뒤의 행동을 모두 안다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "주어진 같은 개의 기록에서 먹이와 움직임이 달라졌어요. 다른 종류로 바뀐 것은 아니에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b10",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "concept": "동물의 자라는 모습과 번식 방식",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "두 동물의 자료에서 대를 잇는 방식이 바르게 연결된 것은 무엇인가요?",
    "givens": {
      "자료": "닭: 알에서 병아리가 나와 자란다. / 토끼: 어미가 새끼를 낳고 젖을 먹인다."
    },
    "choices": [
      "닭과 토끼는 모두 번데기를 거쳐 자란다.",
      "닭은 알을 낳고, 토끼는 새끼를 낳는다.",
      "닭과 토끼는 모두 어미의 젖을 먹고 자란다.",
      "닭은 새끼를 낳고, 토끼는 알을 낳는다.",
      "닭과 토끼는 모두 알에서 깨어나 자란다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "자료에 나온 닭은 알, 토끼는 새끼를 통해 대를 이어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b11",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "concept": "동물의 자라는 모습과 번식 방식",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "이 개구리의 관찰 카드를 시간 순서대로 바르게 놓은 것은 무엇인가요?",
    "givens": {
      "관찰 카드(가상 기록)": "가: 뒷다리만 보임 / 나: 다리가 없고 꼬리가 있음 / 다: 앞다리도 보이고 꼬리가 짧아짐"
    },
    "choices": [
      "가 → 나 → 다",
      "다 → 가 → 나",
      "나 → 가 → 다",
      "나 → 다 → 가",
      "가 → 다 → 나"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "이 자료에서는 다리가 없는 올챙이 다음에 뒷다리가, 그 뒤에 앞다리가 나타났어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b12",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "concept": "동물의 자라는 모습과 번식 방식",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "아직 관찰하지 않은 내용으로 가장 알맞은 것은 무엇인가요?",
    "givens": {
      "관찰 자료(가상 기록)": "같은 병아리가 먹이를 먹고 자라 어린 닭이 되는 모습까지 기록했다. 이후의 기록은 없다."
    },
    "choices": [
      "병아리가 먹이를 먹었던 모습",
      "어린 닭으로 자라는 동안의 모습",
      "처음 기록을 시작했을 때의 모습",
      "다 자란 뒤 자손을 남기는 모습",
      "먹이를 먹으며 몸집이 커진 모습"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "이 기록에는 어린 닭 이후의 과정이 없어요. 관찰하지 않은 일을 관찰 사실처럼 쓰지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b13",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "concept": "동물의 자라는 모습과 번식 방식",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "두 모둠의 강아지가 걷기 시작한 날이 달랐습니다. 알맞은 판단은 무엇인가요?",
    "givens": {
      "자료(가상 기록)": "같은 종류의 강아지를 각각 관찰했지만 걷기 시작한 날짜가 달랐다."
    },
    "choices": [
      "늦게 걸은 강아지는 다른 종류라고 바로 정한다.",
      "모든 강아지의 날짜가 같도록 기록을 고쳐 쓴다.",
      "교재에 적힌 날짜를 두 관찰 날짜 대신 옮겨 쓴다.",
      "날짜가 다르면 두 기록을 모두 거짓이라고 정한다.",
      "개체와 기르는 조건을 살펴 차이를 기록한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "자라는 속도는 개체와 조건에 따라 달라질 수 있어요. 실제 기록을 임의로 맞추지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b14",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "concept": "동물의 자라는 모습과 번식 방식",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "자료로 확인한 동물의 자람을 바르게 설명한 것을 고르세요. (정답 2개)",
    "givens": {
      "관찰 자료(가상 기록)": "개: 젖을 먹던 때보다 다리에 힘이 생겨 잘 달림. / 닭: 병아리 때 작던 볏이 자라며 뚜렷해짐."
    },
    "choices": [
      "개는 자라면서 움직임이 달라졌다.",
      "닭은 자라면서 번데기로 바뀌었다.",
      "모든 동물의 먹이는 평생 반드시 같다.",
      "닭은 자라면서 볏의 모습이 달라졌다.",
      "두 기록은 모든 동물이 같은 속도로 자란다는 증거다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    },
    "explanation": "개는 움직임, 닭은 볏의 변화가 자료에 있어요. 다른 동물 전체로 넓혀 단정하지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b15",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "concept": "동물의 자라는 모습과 번식 방식",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "동물이 태어나 자라고 자손을 남기며 살아가는 전체 과정을 무엇이라고 하나요?",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "한살이",
      "accepted": [
        "한살이",
        "동물의 한살이"
      ]
    },
    "explanation": "동물이 태어나 자라고 자손을 남기고 죽을 때까지 살아가는 과정을 한살이라고 해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b16",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "서술형",
      "concept": "동물의 자라는 모습과 번식 방식",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "자료에서 같은 개가 자라면서 달라진 점 한 가지를 쓰세요.",
    "givens": {
      "관찰 자료(가상 기록)": "처음: 젖을 먹고 혼자 일어서기 어려움. / 나중: 사료를 먹고 잘 달림."
    },
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "젖을 먹다가 사료를 먹게 되었다.",
      "rubric": {
        "required": [
          "자료의 먹이 또는 움직임 변화 한 가지"
        ],
        "pass": "발문에서 요구한 생각을 담으면 정답. 공식 배점표가 아닌 학습용 기준."
      }
    },
    "explanation": "먹이 변화나 움직임 변화 중 자료에 있는 한 가지를 설명하면 돼요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b17",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "concept": "동물 관찰 계획과 생명 존중",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "교실에서 동물의 한살이를 관찰하기 전에 먼저 살펴볼 계획은 무엇인가요?",
    "givens": null,
    "choices": [
      "기를 공간·먹이·관찰 기간을 마련할 수 있는지 살핀다.",
      "친구에게 인기가 가장 많은 동물인지 하나만 살핀다.",
      "몸집이 가장 큰 동물인지 살피고 나머지는 나중에 정한다.",
      "색이 가장 화려한지 살피고 먹이는 아무것이나 준비한다.",
      "관찰할 필요 없이 인터넷 사진만으로 모든 기록을 채운다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "동물을 정할 때는 알맞은 공간과 먹이, 기르는 방법, 관찰할 기간을 함께 생각해야 해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b18",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "concept": "동물 관찰 계획과 생명 존중",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "직접 본 사실을 쓴 관찰 기록은 무엇인가요?",
    "givens": {
      "상황(가상 기록)": "오늘 애벌레가 잎을 먹는 모습을 직접 보았다. 몸속 변화와 기분은 알 수 없다."
    },
    "choices": [
      "애벌레가 나를 보며 행복하다고 생각했다.",
      "애벌레가 배춧잎 가장자리를 갉아 먹었다.",
      "애벌레 몸속의 모든 변화가 끝났다고 느꼈다.",
      "내일은 반드시 나비가 될 것이라고 확신했다.",
      "잎을 먹었으므로 언제나 기분이 좋다고 정했다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "직접 본 행동과 추측을 구별해요. 기분이나 아직 일어나지 않은 일은 관찰 사실이 아니에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b19",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "concept": "동물 관찰 계획과 생명 존중",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "이 기록을 시간에 따라 비교하기 위해 꼭 보완할 내용은 무엇인가요?",
    "givens": {
      "관찰 기록(가상)": "애벌레가 배춧잎을 먹었다. 어제보다 길어 보였다. 날짜와 시간은 적지 않았다."
    },
    "choices": [
      "친구가 좋아하는 동물 이름만 덧붙인다.",
      "오늘 교실에서 들은 노래 제목을 적는다.",
      "관찰한 날짜와 시간을 함께 적는다.",
      "다음 달에 나타날 모습을 사실처럼 적는다.",
      "교재의 날짜를 오늘 관찰한 날짜로 적는다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "언제 관찰한 모습인지 적어야 날짜별 변화를 비교할 수 있어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b20",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "concept": "동물 관찰 계획과 생명 존중",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "휴일에도 먹이가 필요한 애벌레를 기를 때 알맞은 준비는 무엇인가요?",
    "givens": null,
    "choices": [
      "휴일 동안 먹이를 전혀 주지 않고 변화를 기다린다.",
      "휴일 동안 사육장을 꼭 밀봉해 공기가 통하지 않게 한다.",
      "휴일이 끝날 때까지 물속에 담가 두고 관찰을 멈춘다.",
      "휴일에도 알맞은 먹이와 환경을 돌볼 담당을 정한다.",
      "휴일 전에 꺼내 둔 잎만 오래 두고 상태는 확인하지 않는다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "관찰하지 않는 날에도 돌봄은 이어져야 해요. 먹이 상태와 환경을 살필 계획을 세워요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b21",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "concept": "동물 관찰 계획과 생명 존중",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "관찰을 마친 뒤 손을 비누로 씻어야 하는 때로 알맞은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "관찰 기록을 적기 전날에만 손을 씻는다.",
      "사육장을 만진 뒤에는 물 대신 흙을 바른다.",
      "먹이 냄새가 손에서 날 때만 가끔 씻는다.",
      "장갑을 사용한 날에는 절대로 손을 씻지 않는다.",
      "동물이나 사육 도구를 만진 뒤 손을 씻는다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "동물이나 사육 도구를 만진 뒤에는 손을 비누로 깨끗이 씻어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b22",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "concept": "동물 관찰 계획과 생명 존중",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "동물을 해치지 않으며 관찰하는 방법을 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "변화를 빨리 보려고 먹이를 며칠 끊는다.",
      "사육장 밖에서 조용히 모습을 살펴본다.",
      "사진을 찍으려고 번데기를 떼어 옮긴다.",
      "허물을 벗을 때 손으로 잡아당겨 돕는다.",
      "알맞은 먹이를 주고 날짜별로 기록한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        4
      ]
    },
    "explanation": "알맞은 환경을 유지하고 몸을 함부로 만지거나 변화를 재촉하지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b23",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "concept": "동물 관찰 계획과 생명 존중",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "시간에 따른 변화를 비교하려고 관찰할 때마다 달력으로 확인해 적는 것은 무엇인가요?",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "날짜",
      "accepted": [
        "날짜",
        "관찰 날짜",
        "관찰한 날짜",
        "날짜와 시간"
      ]
    },
    "explanation": "날짜를 적으면 어느 때의 모습인지 알고 앞뒤 기록을 비교할 수 있어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b24",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "서술형",
      "concept": "동물 관찰 계획과 생명 존중",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "허물을 벗는 애벌레를 손으로 잡아당기지 않고 지켜보는 까닭을 한 가지 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "몸을 다치게 할 수 있기 때문이다.",
      "rubric": {
        "required": [
          "동물이 다치거나 스트레스를 받는 것을 막음"
        ],
        "pass": "발문에서 요구한 생각을 담으면 정답. 공식 배점표가 아닌 학습용 기준."
      }
    },
    "explanation": "허물을 벗는 동물을 만지거나 잡아당기면 다치거나 스트레스를 받을 수 있어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b25",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "concept": "배추흰나비의 먹이와 관찰 방법",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "배추흰나비 애벌레의 먹이로 준비하기 알맞은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "농약이 묻지 않은 신선한 케일 잎",
      "달게 맛을 낸 과자와 초콜릿 조각",
      "색이 비슷하도록 만든 초록색 종이",
      "모양을 살펴 골라 놓은 플라스틱 잎",
      "먹고 남은 고기와 양념 묻은 반찬"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "배추흰나비 애벌레에게 배추·케일·무·갓·유채 등 알맞은 잎을 준비해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b26",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "concept": "배추흰나비의 먹이와 관찰 방법",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "사육 상자를 둘 곳으로 알맞은 곳은 어디인가요?",
    "givens": null,
    "choices": [
      "창문을 닫고 뜨거운 햇빛이 계속 내리쬐는 곳",
      "직사광선을 피하고 바람이 통하는 곳",
      "공기가 통하지 않도록 상자를 밀봉한 곳",
      "모기약을 뿌린 직후 냄새가 강하게 남은 곳",
      "친구들이 계속 두드려 큰 충격을 받는 곳"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "사육 상자는 직사광선과 큰 충격을 피하고 바람이 잘 통하는 곳에 두어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b27",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "concept": "배추흰나비의 먹이와 관찰 방법",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "애벌레가 사육 상자 바닥에 떨어졌습니다. 알맞은 행동은 무엇인가요?",
    "givens": null,
    "choices": [
      "손가락으로 몸을 꼭 집어 원하는 자리에 붙인다.",
      "몸을 물에 완전히 담갔다가 꺼내 잎 위에 놓는다.",
      "앞에 잎이나 나뭇가지를 대어 스스로 오르게 한다.",
      "상자를 빠르게 흔들어 먹이 있는 곳으로 굴려 보낸다.",
      "떨어진 자리를 막대 끝으로 세게 밀어 움직이게 한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "몸을 직접 집지 않고 잎이나 나뭇가지에 스스로 올라오도록 해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b28",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "concept": "배추흰나비의 먹이와 관찰 방법",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "상자 위에 촘촘한 방충망을 씌우는 방법의 장점은 무엇인가요?",
    "givens": null,
    "choices": [
      "공기를 완전히 막아 먹이를 먹지 않아도 살게 한다.",
      "들어오는 모든 빛을 막아 반드시 빨리 자라게 한다.",
      "상자 안을 뜨겁게 만들어 무조건 빨리 나비가 되게 한다.",
      "공기가 통하면서 애벌레가 밖으로 나가는 것을 줄인다.",
      "먹이 잎이 전혀 시들지 않게 하여 영원히 바꾸지 않는다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "방충망으로 상자를 덮으면 공기가 통하면서 애벌레가 밖으로 나가는 것을 줄일 수 있어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b29",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "concept": "배추흰나비의 먹이와 관찰 방법",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "냉장 보관한 먹이 잎을 줄 때 알맞은 방법은 무엇인가요?",
    "givens": null,
    "choices": [
      "물을 가득 묻혀 애벌레 몸까지 계속 젖게 한다.",
      "오래되어 썩은 잎도 초록색이면 그대로 준다.",
      "모기약을 뿌려 벌레를 없앤 직후 먹이로 준다.",
      "잎이 완전히 검게 마를 때까지 기다렸다가 준다.",
      "잎 상태를 확인하고 표면 물기를 없앤 뒤 준다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "먹이 잎의 상태를 살피고 표면에 남은 물기를 없앤 뒤 주어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b30",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "concept": "배추흰나비의 먹이와 관찰 방법",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "배추흰나비 애벌레를 기르는 방법으로 알맞은 것을 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "먹이로 알맞은 신선한 배춧잎을 준비한다.",
      "먹이를 대신해 설탕을 바른 종이를 준다.",
      "사육장 옆에 향수를 자주 뿌린다.",
      "허물을 벗는 동안 충격을 주지 않는다.",
      "변화가 없으면 몸을 손으로 계속 눌러 본다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    },
    "explanation": "알맞은 먹이를 준비하고 허물벗기나 번데기로 변하는 동안 충격을 주지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b31",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "concept": "배추흰나비의 먹이와 관찰 방법",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "먹이 보기에서 배추흰나비 애벌레에게 알맞은 잎 한 가지를 쓰세요.",
    "givens": {
      "먹이 보기": "케일 잎, 소나무 잎, 은행나무 잎"
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "케일",
      "accepted": [
        "케일",
        "케일 잎",
        "케일잎"
      ]
    },
    "explanation": "보기 중 케일 잎이 배추흰나비 애벌레에게 알맞은 먹이예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b32",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T03",
      "format": "서술형",
      "concept": "배추흰나비의 먹이와 관찰 방법",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "친구가 먹이로 초록색 종이를 주려 합니다. 알맞은 잎으로 바꿔야 하는 까닭을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "종이는 먹이가 아니고 배추나 케일처럼 애벌레가 먹는 잎이 필요하기 때문이다.",
      "rubric": {
        "required": [
          "색만 같은 종이 대신 실제로 먹을 수 있는 알맞은 잎이 필요함"
        ],
        "pass": "발문에서 요구한 생각을 담으면 정답. 공식 배점표가 아닌 학습용 기준."
      }
    },
    "explanation": "색이 비슷해도 먹이가 되는 것은 아니에요. 이 애벌레가 실제로 먹는 알맞은 잎이 필요해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b33",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "concept": "배추흰나비 각 단계의 관찰 특징",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "이 배추흰나비 관찰 기록에 해당하는 단계는 무엇인가요?",
    "givens": {
      "관찰 자료(가상 기록)": "몸을 기어 움직이며 배춧잎을 갉아 먹었다. 아직 날개는 보이지 않았다."
    },
    "choices": [
      "애벌레",
      "성충",
      "씨앗",
      "알",
      "번데기"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "배춧잎을 먹고 기어 다니며 자라는 단계는 애벌레예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b34",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "concept": "배추흰나비 각 단계의 관찰 특징",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "나비가 번데기에서 막 나왔을 때 알맞은 관찰 방법은 무엇인가요?",
    "givens": {
      "관찰 자료(가상 기록)": "막 나온 나비의 날개가 구겨져 있고 젖어 있다."
    },
    "choices": [
      "날개를 손으로 잡아 펼친 뒤 억지로 날린다.",
      "날개를 펴고 말리는 모습을 조용히 지켜본다.",
      "곧바로 상자를 세게 흔들어 날도록 만든다.",
      "날개가 젖었으므로 물속에 완전히 담근다.",
      "잘 날도록 날개에 무거운 종이를 붙여 준다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "막 나온 나비는 날개를 펴고 말려요. 손으로 날개를 펴거나 날기를 재촉하지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b35",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "concept": "배추흰나비 각 단계의 관찰 특징",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "애벌레와 번데기의 먹이 행동을 바르게 비교한 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "애벌레는 꿀만 빨고, 번데기는 잎을 갉아 먹는다.",
      "애벌레와 번데기는 모두 잎을 찾아 계속 돌아다닌다.",
      "애벌레는 잎을 먹고, 번데기는 먹이를 먹지 않는다.",
      "애벌레와 번데기는 모두 먹이를 전혀 먹지 않는다.",
      "애벌레는 먹지 않고, 번데기만 잎을 먹으며 자란다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "배추흰나비의 애벌레는 잎을 먹지만 번데기는 먹이를 먹지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b36",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "concept": "배추흰나비 각 단계의 관찰 특징",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "배추흰나비의 애벌레와 성충을 구별하는 뚜렷한 차이는 무엇인가요?",
    "givens": null,
    "choices": [
      "성충만 살아 있고 애벌레는 살아 있지 않다.",
      "성충만 머리·가슴·배로 몸이 나뉜다.",
      "애벌레만 몸이 있고 성충은 몸이 없다.",
      "성충은 날개가 있지만 애벌레는 날개가 없다.",
      "애벌레는 식물이고 성충이 된 뒤 동물이다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "날개는 뚜렷한 차이예요. 머리·가슴·배로 나뉘는 것은 애벌레에도 있어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b37",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "concept": "배추흰나비 각 단계의 관찰 특징",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "이 자료만으로 할 수 있는 설명은 무엇인가요?",
    "givens": {
      "관찰 자료(가상 기록)": "오늘 번데기가 먹이를 먹는 모습이나 다른 자리로 기어가는 모습을 보지 못했다."
    },
    "choices": [
      "관찰하지 못했으므로 번데기는 어떤 몸 움직임도 절대로 할 수 없다.",
      "번데기가 조용했으므로 관찰 기록을 애벌레가 된 것으로 고쳐 적는다.",
      "먹이를 안 먹었으므로 모든 곤충은 일생 동안 먹이를 전혀 먹지 않는다.",
      "오늘 기어가지 않았으므로 번데기는 살아 있는 생물이 아니라고 정한다.",
      "오늘 본 행동만 기록하고 몸이 전혀 움직일 수 없다고 단정하지 않는다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "먹이를 찾아 돌아다니지 않는 것과 몸을 전혀 움직일 수 없다는 단정은 구별해야 해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b38",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "concept": "배추흰나비 각 단계의 관찰 특징",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "배추흰나비의 한살이에 대한 설명으로 알맞은 것을 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "알에서 작은 성충이 날아 나온다.",
      "애벌레는 먹이를 먹으며 자란다.",
      "번데기는 배춧잎을 찾아 기어 다닌다.",
      "성충이 자라서 애벌레로 되돌아간다.",
      "성충은 알을 낳아 다음 세대로 이어진다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        4
      ]
    },
    "explanation": "알에서 애벌레가 나오고, 애벌레·번데기를 거쳐 성충이 돼요. 성충이 낳은 알은 다음 세대예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b39",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "concept": "배추흰나비 각 단계의 관찰 특징",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "빈칸에 들어갈 배추흰나비의 한살이 단계를 쓰세요.",
    "givens": {
      "한살이": "알 → 애벌레 → (   ) → 성충"
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "번데기",
      "accepted": [
        "번데기"
      ]
    },
    "explanation": "배추흰나비는 애벌레와 성충 사이에 번데기 단계를 거쳐요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b40",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "서술형",
      "concept": "배추흰나비 각 단계의 관찰 특징",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "배추흰나비 성충이 알을 낳았을 때, 그 알이 성충 자신의 어린 시절로 되돌아간 것인지 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "그 알은 같은 성충이 되돌아간 것이 아니라 다음 세대의 새로운 개체이다.",
      "rubric": {
        "required": [
          "알은 성충 자신이 아니라 다음 세대의 새 개체임"
        ],
        "pass": "발문에서 요구한 생각을 담으면 정답. 공식 배점표가 아닌 학습용 기준."
      }
    },
    "explanation": "한살이 그림이 둥글게 이어져도 같은 개체가 알로 되돌아가는 것은 아니에요. 알은 다음 세대로 이어져요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b41",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "concept": "여러 곤충의 한살이 비교",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "이 두 곤충의 한살이를 나누는 기준은 무엇인가요?",
    "givens": {
      "한살이 자료": "나비: 알 → 애벌레 → 번데기 → 성충 / 메뚜기: 알 → 애벌레 → 성충"
    },
    "choices": [
      "번데기 단계를 거치는지 살핀다.",
      "몸이 초록색으로 보이는지만 살핀다.",
      "알을 낳는 날의 날씨만 살핀다.",
      "몸집이 더 큰 곤충이 어느 것인지 살핀다.",
      "곤충을 관찰하는 친구의 수를 살핀다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "이 자료의 뚜렷한 차이는 번데기 단계의 유무예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b42",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "concept": "여러 곤충의 한살이 비교",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "나비와 같은 방식으로 번데기 단계를 거치는 곤충을 고르세요.",
    "givens": {
      "자료": "개미: 알 → 애벌레 → 번데기 → 성충 / 잠자리·사마귀·메뚜기·매미: 번데기 단계 없음"
    },
    "choices": [
      "잠자리",
      "개미",
      "사마귀",
      "메뚜기",
      "매미"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "자료의 개미는 나비처럼 번데기를 거쳐요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b43",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "concept": "여러 곤충의 한살이 비교",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "잠자리가 번데기 단계를 거치지 않는다는 자료를 읽고 바르게 설명한 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "잠자리는 곤충이 아니므로 알을 낳지 않는다.",
      "모든 곤충은 반드시 번데기를 거쳐야 한다.",
      "곤충마다 한살이 단계가 다를 수 있다.",
      "번데기가 없으면 자라는 과정도 전혀 없다.",
      "잠자리 애벌레는 자라서 식물이 되어야 한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "번데기를 거치는 곤충도, 거치지 않는 곤충도 있어요. 번데기가 없다고 곤충이 아닌 것은 아니에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b44",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "concept": "여러 곤충의 한살이 비교",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "자료로 알 수 있는 두 곤충의 한살이 공통점은 무엇인가요?",
    "givens": {
      "자료": "모기: 알 → 애벌레 → 번데기 → 성충 / 사마귀: 알 → 애벌레 → 성충"
    },
    "choices": [
      "둘 다 반드시 번데기 단계를 거쳐야 한다.",
      "둘 다 같은 날에 알에서 성충으로 자란다.",
      "둘 다 성충이 된 뒤 다시 애벌레가 된다.",
      "둘 다 알에서 시작해 자라서 성충이 된다.",
      "둘 다 애벌레 때부터 어미와 먹이가 같다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "제시한 자료에서 둘 다 알에서 시작해 성충이 돼요. 번데기 단계는 서로 달라요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b45",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "concept": "여러 곤충의 한살이 비교",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "두 한살이 자료를 비교하는 방법으로 알맞은 것은 무엇인가요?",
    "givens": {
      "자료": "나비와 메뚜기의 각 단계가 섞여 있는 관찰 카드"
    },
    "choices": [
      "두 곤충의 카드를 색이 비슷한 것끼리만 섞어 줄을 만든다.",
      "번데기가 없는 곤충에도 다른 곤충의 번데기 카드를 넣는다.",
      "카드가 적은 곤충에는 관찰하지 않은 단계를 마음대로 더한다.",
      "두 곤충의 카드 수가 같아질 때까지 실제 관찰 카드를 버린다.",
      "곤충별로 카드를 나누고 시간 순서에 따라 단계를 비교한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "곤충별로 실제 관찰 자료를 나눈 뒤 순서를 살펴 공통점과 차이점을 비교해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b46",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "concept": "여러 곤충의 한살이 비교",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "자료와 일치하는 설명을 고르세요. (정답 2개)",
    "givens": {
      "자료": "장수풍뎅이: 알 → 애벌레 → 번데기 → 성충 / 메뚜기: 알 → 애벌레 → 성충"
    },
    "choices": [
      "장수풍뎅이는 번데기를 거친다.",
      "메뚜기는 알을 낳지 않는다.",
      "두 곤충은 단계 수가 반드시 같다.",
      "메뚜기는 번데기 없이 성충이 된다.",
      "장수풍뎅이는 성충 뒤에 번데기가 된다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    },
    "explanation": "장수풍뎅이는 번데기를 거치고 메뚜기는 거치지 않아요. 모두 자료에 나타난 순서로 판단해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b47",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "concept": "여러 곤충의 한살이 비교",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "가와 나 중 번데기 단계를 거치는 한살이의 기호를 쓰세요.",
    "givens": {
      "자료": "가: 알 → 애벌레 → 성충 / 나: 알 → 애벌레 → 번데기 → 성충"
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "나",
      "accepted": [
        "나",
        "(나)",
        "나는"
      ]
    },
    "explanation": "나에는 애벌레와 성충 사이에 번데기 단계가 있어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b48",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "서술형",
      "concept": "여러 곤충의 한살이 비교",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "나비와 메뚜기의 한살이를 비교하여 차이점 한 가지를 쓰세요.",
    "givens": {
      "자료": "나비: 알 → 애벌레 → 번데기 → 성충 / 메뚜기: 알 → 애벌레 → 성충"
    },
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "나비는 번데기를 거치지만 메뚜기는 번데기를 거치지 않는다.",
      "rubric": {
        "required": [
          "나비만 번데기 단계를 거친다는 차이"
        ],
        "pass": "발문에서 요구한 생각을 담으면 정답. 공식 배점표가 아닌 학습용 기준."
      }
    },
    "explanation": "공통점이 아니라 차이를 물었어요. 이 자료에서는 나비만 번데기 단계를 거쳐요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b49",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "concept": "싹트기와 자람에 필요한 조건",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 강낭콩 씨앗으로 얻은 이 모형 기록에서 비교한 조건은 무엇인가요?",
    "givens": {
      "실험 자료(모형 값)": "씨앗 종류와 수, 온도는 같았다. 마른 솜에서는 0개, 알맞게 물을 적신 솜에서는 5개가 싹텄다."
    },
    "choices": [
      "물을 주었는지의 차이",
      "씨앗의 종류를 바꾼 차이",
      "실험 장소의 온도를 바꾼 차이",
      "화분의 이름표 색깔 차이",
      "씨앗을 관찰한 친구의 나이 차이"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "이 실험에서는 다른 조건은 같게 하고 물을 주었는지만 다르게 했어요. 수치는 직접 만든 모형 값이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b50",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "concept": "싹트기와 자람에 필요한 조건",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "이 실험에서 살펴보려는 것은 무엇인가요?",
    "givens": {
      "실험 계획": "같은 종류와 수의 강낭콩 씨앗에 같은 양의 물을 주었다. 한쪽은 찬 곳, 다른 쪽은 알맞게 따뜻한 곳에 두었다. 나머지 조건은 같게 한다."
    },
    "choices": [
      "씨앗 종류가 싹트기에 미치는 영향",
      "온도가 씨앗의 싹트기에 미치는 영향",
      "먹이 잎 종류가 애벌레에게 미치는 영향",
      "화분 이름표의 글씨 크기가 주는 영향",
      "화분을 관찰한 친구의 수가 주는 영향"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "온도만 다르게 했으므로 온도가 싹트기에 어떤 영향을 주는지 살펴보는 계획이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b51",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "concept": "싹트기와 자람에 필요한 조건",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "강낭콩의 싹트기 실험과 자람 실험을 바르게 구분한 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "싹트기는 친구 이름, 자람은 화분 이름의 영향을 비교한다.",
      "싹트기와 자람은 모두 먹이 잎 종류만 바꾸어 비교한다.",
      "싹트기는 물·온도, 자람은 물·햇빛의 영향을 비교한다.",
      "싹트기에서는 날짜를 쓰지 않고 자람에서만 기록을 남긴다.",
      "싹트기와 자람은 구별하지 않고 언제나 같은 뜻으로 쓴다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "이 단원에서는 강낭콩의 싹트기에는 물·온도, 자람에는 물·햇빛의 영향을 나누어 알아봐요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b52",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "concept": "싹트기와 자람에 필요한 조건",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "키만 비교하면 잘못 판단할 수 있음을 보여 주는 설명은 무엇인가요?",
    "givens": {
      "관찰 자료(가상 기록)": "햇빛 받은 강낭콩: 줄기가 굵고 잎이 진한 초록색임. / 햇빛 부족한 강낭콩: 줄기가 더 길지만 가늘고 잎 색이 연함."
    },
    "choices": [
      "줄기가 더 길면 다른 모습은 볼 필요가 없다.",
      "잎 색과 줄기 굵기는 자람 기록에서 모두 지운다.",
      "키가 크면 어떤 환경에서도 반드시 더 튼튼하다.",
      "길이와 함께 줄기 굵기와 잎 상태도 살핀다.",
      "관찰한 자료 대신 원하는 결과로 잎 색을 바꿔 쓴다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "키가 더 큰 것만으로 튼튼하게 자랐다고 정하지 않아요. 자료의 줄기 굵기와 잎 상태도 함께 살펴요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b53",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "concept": "싹트기와 자람에 필요한 조건",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "이 관찰 결과를 설명하는 문장으로 알맞은 것은 무엇인가요?",
    "givens": {
      "실험 자료(가상 기록)": "같은 크기의 강낭콩에 햇빛 등 다른 조건을 같게 했다. 물을 알맞게 준 쪽은 싱싱했고, 주지 않은 쪽은 시들었다."
    },
    "choices": [
      "물이 없는 쪽이 언제나 더 싱싱하게 자란다고 정한다.",
      "모든 식물은 물을 주지 않아도 반드시 잘 자란다고 정한다.",
      "모든 조건이 달라도 물 한 가지 때문이라고 바로 정한다.",
      "시든 까닭은 알 수 있으므로 조건 기록을 모두 지워도 된다.",
      "이 실험에서 물을 알맞게 준 쪽이 싱싱하게 자랐다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "같게 한 조건과 다르게 한 조건을 확인하고, 관찰한 범위 안에서 결과를 설명해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b54",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "concept": "싹트기와 자람에 필요한 조건",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "강낭콩을 관찰하는 질문과 알맞게 연결한 것을 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "싹트기 질문은 이미 핀 꽃의 색만 비교하면 끝난다.",
      "물을 준 씨앗과 주지 않은 씨앗의 싹트기를 비교한다.",
      "온도의 영향을 보려면 씨앗 종류만 서로 다르게 한다.",
      "햇빛의 영향을 보려면 관찰 날짜를 모두 없앤다.",
      "자람을 비교할 때 잎과 줄기의 상태도 함께 기록한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        4
      ]
    },
    "explanation": "씨앗의 싹트기는 조건별 싹튼 모습을, 식물의 자람은 잎과 줄기 등 여러 모습을 함께 살펴요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b55",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E3",
      "type": "T06",
      "format": "단답형",
      "concept": "싹트기와 자람에 필요한 조건",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "이 강낭콩 싹트기 실험에서 서로 다르게 한 조건의 이름을 쓰세요.",
    "givens": {
      "실험 계획": "물·씨앗 종류·씨앗 수는 같다. 한쪽은 찬 곳에, 다른 쪽은 알맞게 따뜻한 곳에 둔다."
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "온도",
      "accepted": [
        "온도",
        "기온",
        "주변 온도"
      ]
    },
    "explanation": "찬 곳과 따뜻한 곳은 온도가 달라요. 이 계획은 온도의 영향을 살펴요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b56",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E3",
      "type": "T06",
      "format": "서술형",
      "concept": "싹트기와 자람에 필요한 조건",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "키가 더 큰 나를 더 튼튼하다고 바로 정할 수 없는 까닭을 자료에서 한 가지 쓰세요.",
    "givens": {
      "관찰 자료(가상 기록)": "가: 줄기가 짧지만 굵고 잎이 진한 초록색. / 나: 줄기가 길지만 가늘고 잎 색이 연함."
    },
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "나는 줄기가 길어도 가늘기 때문이다.",
      "rubric": {
        "required": [
          "나의 가는 줄기 또는 연한 잎 색을 근거로 듦"
        ],
        "pass": "발문에서 요구한 생각을 담으면 정답. 공식 배점표가 아닌 학습용 기준."
      }
    },
    "explanation": "이 자료에서는 나의 줄기가 가늘고 잎 색이 연해요. 키만 보고 튼튼함을 단정하지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b57",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "concept": "공정한 비교 실험 계획",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물의 영향을 알아보려는 계획을 공정하게 고친 것은 무엇인가요?",
    "givens": {
      "처음 계획": "가는 따뜻한 곳에서 물을 주고, 나는 찬 곳에서 물을 주지 않는다. 씨앗 종류와 수는 같다."
    },
    "choices": [
      "두 곳의 온도는 같게 하고 물을 주는지만 다르게 한다.",
      "두 곳의 물과 온도를 모두 더 크게 다르게 바꾼다.",
      "두 곳의 씨앗 종류와 개수도 모두 다르게 바꾼다.",
      "관찰 날짜와 씨앗 이름을 지워 조건 차이를 숨긴다.",
      "원하는 결과가 나온 쪽의 기록만 남기고 비교를 끝낸다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "물의 영향을 보려면 온도 등 다른 조건을 같게 해야 해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b58",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "concept": "공정한 비교 실험 계획",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "햇빛이 강낭콩의 자람에 미치는 영향을 비교할 때 같게 할 조건은 무엇인가요?",
    "givens": null,
    "choices": [
      "햇빛을 받는 정도만 똑같게 한다.",
      "물 주는 시기와 양을 같게 한다.",
      "화분의 크기를 서로 크게 다르게 한다.",
      "한쪽만 물을 주고 다른 쪽은 주지 않는다.",
      "두 화분의 식물 종류를 서로 다르게 한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "비교할 조건인 햇빛은 다르게 하고 물 주는 시기와 양 등은 같게 해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b59",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "concept": "공정한 비교 실험 계획",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "실험하기 전에 세울 수 있는 검증 가능한 예상은 무엇인가요?",
    "givens": null,
    "choices": [
      "나는 초록색이 예쁘기 때문에 그 색을 가장 좋아한다.",
      "결과가 나오지 않아도 원하는 수로 기록하면 괜찮다.",
      "물을 준 씨앗과 안 준 씨앗은 싹튼 수가 다를 것이다.",
      "모든 실험은 관찰하지 않아도 언제나 같은 결과이다.",
      "실험을 하지 않고도 모든 씨앗의 미래를 알 수 있다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "조건과 관찰할 결과가 연결된 예상은 실험해 확인할 수 있어요. 예상이 실제 결과와 다를 수도 있어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b60",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "concept": "공정한 비교 실험 계획",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 날짜에 싹튼 수를 비교하려면 씨앗 수를 어떻게 준비하는 것이 알맞나요?",
    "givens": {
      "계획": "강낭콩 종류·온도 등은 같게 하고 물을 주는지에 따른 싹튼 수를 비교하려 한다."
    },
    "choices": [
      "한쪽에만 씨앗을 놓고 다른 쪽은 비운다.",
      "두 쪽의 씨앗 수를 세지 않고 제각각 놓는다.",
      "한쪽만 관찰 때마다 씨앗 수를 늘려 놓는다.",
      "두 쪽에 같은 수의 씨앗을 놓는다.",
      "싹튼 뒤 원하는 결과에 맞추어 씨앗을 더한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "씨앗 수가 다르면 싹튼 수만으로 물의 영향을 공정하게 비교하기 어려워요. 같은 수로 준비해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b61",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "concept": "공정한 비교 실험 계획",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "실험 결과가 처음 예상과 달랐을 때 알맞은 행동은 무엇인가요?",
    "givens": null,
    "choices": [
      "예상과 맞도록 관찰한 숫자를 모두 고쳐서 적는다.",
      "예상과 다른 기록만 골라 지우고 실험을 끝낸다.",
      "직접 관찰하지 않은 결과를 인터넷에서 골라 적는다.",
      "원하는 결과가 나왔다는 말만 쓰고 조건은 지운다.",
      "실제 결과를 남기고 조건과 기록 방법을 다시 살핀다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "예상과 달라도 실제 관찰 결과를 남겨야 해요. 조건과 기록 방법을 살펴 다음 탐구로 이어 가요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b62",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "concept": "공정한 비교 실험 계획",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "햇빛의 영향을 공정하게 비교할 계획을 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "같은 종류와 비슷한 크기의 강낭콩을 준비한다.",
      "한쪽에는 물을 주고 다른 쪽은 주지 않는다.",
      "양쪽의 화분 크기와 흙 종류를 모두 다르게 한다.",
      "다른 조건은 같게 하고 햇빛 받는 정도를 다르게 한다.",
      "관찰할 때마다 두 화분의 이름표를 서로 바꾼다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    },
    "explanation": "식물의 종류와 크기 등은 비슷하게 준비하고 비교하려는 햇빛 조건만 다르게 해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b63",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "concept": "공정한 비교 실험 계획",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "햇빛의 영향을 알아보는 이 계획에서 다르게 해야 할 조건 한 가지를 쓰세요.",
    "givens": {
      "계획": "강낭콩의 종류와 크기, 화분, 흙, 물 주는 시기와 양은 같게 준비한다."
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "햇빛",
      "accepted": [
        "햇빛",
        "햇빛의 양",
        "받는 햇빛",
        "햇빛을 받는 정도",
        "햇빛 받는 정도"
      ]
    },
    "explanation": "이 계획에서 비교하려는 것은 햇빛의 영향이므로 햇빛 받는 정도를 다르게 해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  },
  {
    "id": "s31-u04-b64",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "서술형",
      "concept": "공정한 비교 실험 계획",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물과 온도를 동시에 다르게 하면 물의 영향만 알기 어려운 까닭을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "결과의 차이가 물 때문인지 온도 때문인지 구별하기 어렵기 때문이다.",
      "rubric": {
        "required": [
          "두 조건 중 무엇 때문에 결과가 달라졌는지 구별하기 어려움"
        ],
        "pass": "발문에서 요구한 생각을 담으면 정답. 공식 배점표가 아닌 학습용 기준."
      }
    },
    "explanation": "여러 조건이 함께 달라지면 무엇의 영향인지 구별하기 어려워요. 물의 영향만 보려면 온도는 같게 해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ],
      "note": "자체 이론편 본문에서 개념을 대조하고 자료·문항을 직접 작성. 교재 문항이나 공식 평가 문항의 전사가 아님."
    }
  }
];
