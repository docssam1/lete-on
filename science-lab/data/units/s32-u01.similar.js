// 3-2 Ⅰ 재미있는 나의 탐구 — 유사문항 15 (창작). 원문 1문항당 1개, 같은 유형·난이도로 상황과 물체를 바꿨다. of = 짝이 되는 원문 (세트, 번호).
export const similar = [
  {
    "id": "s32-u01-v001",
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
      "unit": "u01",
      "area": "탐구",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 탐구 문제를 정하는 방법입니다. 괄호 안에서 알맞은 말을 골라 쓰세요.",
    "givens": {
      "지문": "수업 시간에 배운 내용이나 생활에서 본 것 가운데 더 ( 알아보고 싶은 , 이미 잘 알고 있는 ) 것을 떠올려 탐구 문제를 정합니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "알아보고 싶은",
      "accepted": [
        "알아보고 싶은",
        "알아보고싶은"
      ]
    },
    "explanation": "탐구는 더 알아보고 싶은 것, 곧 궁금한 것에서 시작해요. 이미 잘 아는 것은 탐구할 까닭이 없어요.",
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
    "id": "s32-u01-v002",
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
      "unit": "u01",
      "area": "탐구",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 하준이가 탐구 문제를 정한 과정입니다. 순서대로 나열한 것을 고르세요.",
    "givens": {
      "보기": [
        "ㄱ. 운동장에서 놀다가 아침과 점심의 그림자 길이가 다른 것이 궁금해졌어요.",
        "ㄴ. 정한 탐구 문제를 스스로 탐구할 수 있는지 살펴보았어요.",
        "ㄷ. 「하루 동안 그림자 길이는 어떻게 달라질까?」를 탐구 문제로 정했어요."
      ]
    },
    "choices": [
      "ㄱ → ㄴ → ㄷ",
      "ㄱ → ㄷ → ㄴ",
      "ㄴ → ㄱ → ㄷ",
      "ㄷ → ㄱ → ㄴ",
      "ㄷ → ㄴ → ㄱ"
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
    "explanation": "먼저 궁금한 것을 떠올리고(ㄱ), 그것으로 탐구 문제를 정한 뒤(ㄷ), 그 문제가 스스로 탐구하기에 알맞은지 점검해요(ㄴ).",
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
    "id": "s32-u01-v003",
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
      "unit": "u01",
      "area": "탐구",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "친구들이 정한 탐구 문제입니다. 탐구 문제로 알맞지 않아 고쳐야 할 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 종이컵 전화기의 실 길이를 바꾸면 소리가 어떻게 들릴까?",
        "ㄴ. 공을 떨어뜨리는 높이를 바꾸면 공이 튀어 오르는 높이는 어떻게 달라질까?",
        "ㄷ. 우리 반에서 가장 멋진 장난감은 무엇일까?"
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
    "explanation": "「가장 멋진」은 사람마다 생각이 달라 관찰이나 실험으로 확인할 수 없어요. 그래서 탐구 문제로 알맞지 않아요.",
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
    "id": "s32-u01-v004",
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
      "unit": "u01",
      "area": "탐구",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 궁금한 점을 탐구 문제로 바꾼 것으로 가장 알맞은 것을 고르세요.",
    "givens": {
      "지문": "공은 높은 곳에서 떨어뜨릴수록 더 높이 튀어 오를까?"
    },
    "choices": [
      "탁구공을 30 cm와 60 cm 높이에서 떨어뜨리면 튀어 오르는 높이는 어떻게 다를까?",
      "공을 떨어뜨리면 어떻게 될까?",
      "공은 얼마나 높이 튀어 오를 수 있을까?",
      "공을 아주 높은 곳에서 떨어뜨리면 언젠가 구름까지 튀어 오를 수 있을까?",
      "여러 가지 공 가운데 친구들이 가장 좋아하는 공은 어떤 공이고 그 까닭은 무엇일까?"
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
    "explanation": "탐구 문제는 무엇을 바꾸어 무엇을 볼지가 분명해서 실험으로 확인할 수 있어야 해요. 떨어뜨리는 높이를 정해 비교하는 문제가 그래요.",
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
    "id": "s32-u01-v005",
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
      "unit": "u01",
      "area": "탐구",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "윤서가 탐구 계획을 세우면서 한 생각입니다. 바르지 않은 생각을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 계획서를 친구와 함께 살펴보다가 빠진 준비물을 찾았지만, 이미 다 썼으니 고치지 않을 거예요.",
        "ㄴ. 탐구 문제를 해결하려면 무엇을 다르게 하고 무엇을 같게 할지 정해야 해요.",
        "ㄷ. 실험을 하면 어떤 결과가 나올지 미리 예상해서 계획서에 적어 둘 거예요."
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
    "explanation": "계획을 점검하다가 부족한 점을 찾으면 고쳐서 보충해야 해요. 그래야 실행할 때 빠뜨리는 것이 없어요.",
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
    "id": "s32-u01-v006",
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
      "unit": "u01",
      "area": "탐구",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "탐구 계획서를 쓸 때 적을 내용으로 알맞지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "예상되는 결과",
      "필요한 준비물",
      "탐구를 할 순서",
      "다르게 해야 할 것과 같게 해야 할 것",
      "실험 결과를 대신 적어 줄 사람"
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
    "explanation": "탐구는 스스로 하는 것이라 결과를 대신 적어 줄 사람은 계획서에 적지 않아요. 계획서에는 탐구 문제·해결 방법·준비물·예상·순서를 적어요.",
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
    "id": "s32-u01-v007",
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
      "unit": "u01",
      "area": "탐구",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 탐구 계획서의 일부분입니다. 빈칸 ㄱ에 들어갈 항목으로 알맞은 것을 고르세요.",
    "givens": {
      "표": {
        "구분": [
          "탐구 문제",
          "탐구 문제를 해결할 방법",
          "ㄱ",
          "준비물"
        ],
        "내용": [
          "종이컵 전화기의 실이 길수록 소리가 더 작게 들릴까?",
          "실의 길이만 다르게 하고, 종이컵과 실의 종류는 같게 합니다.",
          "실이 길수록 소리가 더 작게 들릴 것이다.",
          "종이컵 4개, 길이가 다른 실 2개, 클립 등"
        ]
      }
    },
    "choices": [
      "준비물",
      "탐구 순서",
      "나의 예상",
      "탐구 결과",
      "탐구 문제"
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
    "explanation": "실험하기 전에 「~할 것이다」처럼 미리 생각해 적는 것은 나의 예상이에요. 탐구 결과는 실험을 한 뒤에 적어요.",
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
    "id": "s32-u01-v008",
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
      "unit": "u01",
      "area": "탐구",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 탐구 문제를 해결하려고 할 때 다르게 해야 할 것을 고르세요.",
    "givens": {
      "지문": "탐구 문제: 미끄럼판을 더 높게 세우면 장난감 자동차가 더 멀리 굴러갈까?"
    },
    "choices": [
      "장난감 자동차의 종류",
      "장난감 자동차의 무게",
      "미끄럼판 아래 바닥의 종류",
      "장난감 자동차가 굴러간 거리",
      "미끄럼판의 높이"
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
    "explanation": "미끄럼판의 높이만 다르게 하고 자동차와 바닥은 같게 해야 높이 때문에 생긴 차이를 알 수 있어요. 굴러간 거리는 그에 따라 바뀌는 것이에요.",
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
    "id": "s32-u01-v009",
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
      "unit": "u01",
      "area": "탐구",
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "탐구를 실행하는 모습으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "결과가 예상과 다르게 나오면 예상한 값으로 고쳐서 기록합니다.",
      "실험할 때 안전 수칙을 지킵니다.",
      "탐구 계획서에 적은 순서대로 실험합니다.",
      "관찰한 모습과 잰 값을 빠뜨리지 않고 기록장에 그때그때 적습니다.",
      "실험에 쓸 준비물이 계획서와 같은지 먼저 확인합니다."
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
    "explanation": "탐구 결과는 예상과 달라도 있는 그대로 기록해야 해요. 예상과 다른 결과도 알게 된 점이 될 수 있어요.",
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
    "id": "s32-u01-v010",
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
      "unit": "u01",
      "area": "탐구",
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 탐구를 실행하기 직전에 하는 일입니다. 빈칸에 들어갈 알맞은 말을 고르세요.",
    "givens": {
      "지문": "준비물을 챙긴 뒤, [빈칸]을/를 다시 읽으며 탐구 순서와 준비물에 빠진 것이 없는지 확인합니다."
    },
    "choices": [
      "저울",
      "기록장",
      "탐구 계획서",
      "발표 자료",
      "탐구 결과 정리표"
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
    "explanation": "탐구 순서와 준비물은 탐구 계획서에 적혀 있어요. 실행하기 전에 계획서를 다시 보며 빠진 것이 없는지 확인해요.",
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
    "id": "s32-u01-v011",
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
      "unit": "u01",
      "area": "탐구",
      "element": "E3",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 탐구 결과를 기록하는 방법입니다. 괄호 안에서 알맞은 말을 골라 쓰세요.",
    "givens": {
      "지문": "강낭콩 싹의 키를 매일 잰다면, 잰 키는 ( 그날그날 , 일주일 뒤에 한꺼번에 ) 기록장에 적습니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "그날그날",
      "accepted": [
        "그날그날",
        "그날그날 바로"
      ]
    },
    "explanation": "관찰하거나 잰 결과는 잊어버리기 전에 바로 기록해야 해요. 나중에 몰아서 적으면 틀리거나 빠뜨리기 쉬워요.",
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
    "id": "s32-u01-v012",
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
      "unit": "u01",
      "area": "탐구",
      "element": "E4",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 글을 읽고, 지우가 지금 하고 있는 일로 알맞은 것을 고르세요.",
    "givens": {
      "지문": "지우는 탐구 결과를 친구들에게 알리려고 합니다. 포스터로 보여 줄지, 실험하는 모습을 영상으로 보여 줄지부터 고민하고 있습니다."
    },
    "choices": [
      "발표 연습하기",
      "발표 방법 정하기",
      "탐구 실행하기",
      "발표 자료 만들기",
      "탐구 결과 발표하기"
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
    "explanation": "포스터와 영상 가운데 무엇으로 알릴지 고르는 것은 발표 방법 정하기예요. 발표를 준비할 때 가장 먼저 하는 일이에요.",
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
    "id": "s32-u01-v013",
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
      "unit": "u01",
      "area": "탐구",
      "element": "E4",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "탐구 결과 발표 자료에 넣을 내용으로 알맞지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "준비물",
      "탐구한 사람",
      "탐구하여 알게 된 점",
      "준비물을 산 가게의 이름",
      "탐구 결과를 정리한 표"
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
    "explanation": "발표 자료에는 탐구한 사람·문제·준비물·순서·결과·알게 된 점처럼 탐구와 관계있는 것만 넣어요. 준비물을 산 가게는 탐구와 관계없어요.",
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
    "id": "s32-u01-v014",
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
      "unit": "u01",
      "area": "탐구",
      "element": "E4",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 서아가 한 탐구 활동을 순서와 상관없이 나열한 것입니다. 순서대로 나열한 것을 고르세요.",
    "givens": {
      "보기": [
        "ㄱ. 계획에 따라 실험하면서 결과를 기록장에 적었어요.",
        "ㄴ. 알게 된 점을 포스터로 만들어 친구들 앞에서 발표했어요.",
        "ㄷ. 준비물과 탐구 순서를 정해 탐구 계획서를 썼어요.",
        "ㄹ. 「물에 뜨는 물체와 가라앉는 물체에는 무엇이 있을까?」를 탐구 문제로 정했어요."
      ]
    },
    "choices": [
      "ㄱ → ㄷ → ㄹ → ㄴ",
      "ㄷ → ㄹ → ㄱ → ㄴ",
      "ㄹ → ㄱ → ㄷ → ㄴ",
      "ㄹ → ㄷ → ㄱ → ㄴ",
      "ㄹ → ㄷ → ㄴ → ㄱ"
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
    "explanation": "탐구 문제를 정하고(ㄹ), 계획을 세우고(ㄷ), 실행하며 기록한 뒤(ㄱ), 결과를 발표해요(ㄴ).",
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
    "id": "s32-u01-v015",
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
      "unit": "u01",
      "area": "탐구",
      "element": "E4",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "탐구를 마치고 새로운 탐구를 시작하려고 합니다. 새 탐구 문제를 정하는 방법으로 알맞지 않은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 탐구 결과를 정리하다가 더 알고 싶어진 점을 새 탐구 문제로 정해요.",
        "ㄴ. 내가 궁금하지 않더라도 짝이 정한 탐구 문제를 그대로 따라 정해요.",
        "ㄷ. 생활 주변에서 새로 궁금한 것을 찾아 탐구 문제로 정해요."
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
    "explanation": "새 탐구 문제도 내가 더 궁금해진 것이나 주변에서 궁금한 것을 찾아 스스로 정해요. 남이 정한 것을 그대로 따르면 나의 탐구가 아니에요.",
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
