// 4-2 Ⅱ 물의 상태 변화 — 유사문항 70 (창작). 원문 1문항당 1개, 같은 유형·난이도로 상황과 물체를 바꿨다. of = 짝이 되는 원문 (세트, 번호).
export const similar = [
  {
    "id": "s42-u02-v001",
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
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "주전자에 담긴 물을 관찰한 결과로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "차갑고 단단해서 손으로 집어 올릴 수 있습니다.",
      "어떤 그릇에 옮겨 담아도 처음 모양이 그대로 유지됩니다.",
      "공기처럼 눈에 보이지 않아서 있는지 알 수 없습니다.",
      "흐르는 성질이 있어 담는 그릇에 따라 모양이 달라집니다.",
      "주전자를 기울여도 흘러내리지 않고 한곳에 머물러 있습니다."
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
    "explanation": "물은 액체라서 눈에 보이고 흐르며, 담는 그릇에 따라 모양이 바뀌어요.",
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
    "id": "s42-u02-v002",
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
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "냉동실에서 꺼낸 각얼음에 대한 설명으로 옳은 것을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "흐르는 성질이 있어 그릇 모양대로 바뀝니다.",
      "일정한 모양이 있어 그릇을 바꾸어도 모양이 그대로입니다.",
      "눈에 보이지 않고 손으로 잡을 수도 없습니다.",
      "눈에 보이고, 손으로 만지면 차갑고 단단합니다.",
      "공기 중으로 퍼져 나가 방 안을 골고루 채우며 눈에 보이지 않습니다."
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
    "explanation": "얼음은 고체라서 눈에 보이고 단단하며, 그릇을 바꾸어도 모양이 그대로예요.",
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
    "id": "s42-u02-v003",
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
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물질과 그 상태를 바르게 짝 지은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 고드름 - 고체",
        "ㄴ. 빗물 - 기체",
        "ㄷ. 수증기 - 액체"
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
        "고드름 - 고체",
        "고드름-고체"
      ]
    },
    "explanation": "고드름은 얼음이라 고체, 빗물은 액체, 수증기는 기체예요.",
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
    "id": "s42-u02-v004",
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
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 실험은 무엇을 알아보기 위한 것인지 고르세요.",
    "givens": {
      "지문": "<실험 과정> 1. 작은 플라스틱 통에 물을 담고 뚜껑을 닫은 뒤 전자저울로 무게를 잽니다. 2. 통을 냉동실에 넣어 물을 완전히 얼립니다. 3. 물이 다 얼면 통을 꺼내 겉에 묻은 물기를 닦고 다시 무게를 잽니다."
    },
    "choices": [
      "물이 얼 때 통의 색깔이 변하는지 알아보기",
      "물이 얼기 전과 언 후의 무게 비교하기",
      "얼음이 녹는 데 걸리는 시간 재기",
      "물이 얼 때 통 속 물의 높이가 변하는지 관찰하기",
      "얼음이 녹기 전과 녹은 후의 무게 비교하기"
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
    "explanation": "물을 얼리기 전과 언 뒤에 전자저울로 무게를 쟀으니, 물이 얼 때 무게가 변하는지 알아보는 실험이에요.",
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
    "id": "s42-u02-v005",
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
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "위 실험에 대한 설명으로 옳은 것을 고르세요.",
    "givens": {
      "지문": "<실험 과정> 1. 투명한 플라스틱 병에 물을 3분의 1쯤 넣고 뚜껑을 닫은 뒤, 물의 높이에 파란색 스티커를 붙입니다. 2. 병을 냉동실에 넣어 물을 완전히 얼립니다. 3. 다 언 뒤 얼음 윗면의 높이에 노란색 스티커를 붙입니다."
    },
    "choices": [
      "노란색 스티커가 파란색 스티커보다 아래쪽에 붙습니다.",
      "병에 붙인 스티커의 높이는 병 속 물의 무게를 나타냅니다.",
      "물이 얼면 무게가 늘어나기 때문에 높이가 달라지는 것입니다.",
      "물이 얼어도 부피가 그대로라서 두 스티커는 정확히 같은 높이에 붙습니다.",
      "두 스티커의 높이 차이는 물이 얼 때 늘어난 부피를 보여 줍니다."
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
    "explanation": "얼음 윗면이 처음 물 높이보다 올라가요. 스티커 높이는 부피를 나타내니, 물이 얼면 부피가 늘어난 거예요.",
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
    "id": "s42-u02-v006",
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
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "얼음 틀에서 꺼낸 얼음 조각을 컵에 넣고 모두 녹을 때까지 두었습니다. 얼음이 녹아 물이 되었을 때의 변화를 바르게 말한 것을 고르세요.",
    "givens": null,
    "choices": [
      "부피는 줄어들고, 무게는 처음과 같습니다.",
      "부피는 늘어나고, 무게는 처음과 같습니다.",
      "부피와 무게가 모두 줄어듭니다.",
      "부피는 줄어들고, 무게는 늘어납니다.",
      "부피와 무게가 모두 처음과 똑같습니다."
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
    "explanation": "얼음이 녹아 물이 되면 부피는 줄어들지만 무게는 변하지 않아요.",
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
    "id": "s42-u02-v007",
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
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "얼음 조각 몇 개를 지퍼 백에 넣고 꼭 닫은 뒤 무게를 재었더니 42 g이었습니다. 지퍼 백을 따뜻한 곳에 두어 얼음이 모두 녹은 뒤 다시 무게를 재면 몇 g인지 고르세요.",
    "givens": null,
    "choices": [
      "38 g",
      "40 g",
      "42 g",
      "44 g",
      "46 g"
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
    "explanation": "얼음이 녹아 물이 되어도 무게는 변하지 않으니 그대로 42 g이에요.",
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
    "id": "s42-u02-v008",
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
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "그릇에 담아 둔 물이 며칠 사이에 조금씩 줄어든 것처럼, 액체인 물이 표면에서 천천히 기체로 변하는 현상을 무엇이라고 하는지 고르세요.",
    "givens": null,
    "choices": [
      "응결",
      "끓음",
      "얼기",
      "녹기",
      "증발"
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
    "explanation": "물의 표면에서 물이 수증기로 천천히 변하는 현상을 증발이라고 해요.",
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
    "id": "s42-u02-v009",
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
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "냄비에 물을 담고 계속 가열하였을 때 볼 수 있는 모습을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "물이 끓기 시작하면 물속에서 큰 기포가 많이 올라옵니다.",
      "물이 끓기 전부터 물 표면이 얼음처럼 단단하게 굳습니다.",
      "가열하는 동안 냄비 속 물의 높이가 점점 높아집니다.",
      "한참 끓인 뒤에는 냄비 속 물의 양이 처음보다 줄어듭니다.",
      "물이 끓어도 냄비 속 물의 양은 처음과 똑같이 유지됩니다."
    ],
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
    "explanation": "물이 끓으면 물속에서도 물이 수증기로 변해 큰 기포가 생기고, 수증기가 빠져나가 물의 양이 줄어요.",
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
    "id": "s42-u02-v010",
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
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "빨래가 마르는 것과 주전자의 물이 끓는 것에서 공통으로 일어나는 물의 상태 변화를 고르세요.",
    "givens": null,
    "choices": [
      "액체인 물이 기체인 수증기로 변합니다.",
      "기체인 수증기가 액체인 물로 변합니다.",
      "물 표면과 물속에서 동시에 상태가 변합니다.",
      "액체인 물이 고체인 얼음으로 변합니다.",
      "물 표면에서만 아주 천천히 상태가 변합니다."
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
    "explanation": "증발과 끓음은 모두 물이 수증기로 변하는 현상이에요. 다만 증발은 표면에서 천천히, 끓음은 표면과 속에서 빠르게 일어나요.",
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
    "id": "s42-u02-v011",
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
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "유리컵에 얼음물을 담아 접시 위에 올려 두었습니다. 시간이 지나면서 볼 수 있는 모습을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "컵 안의 얼음물이 유리를 뚫고 스며 나와 바깥쪽이 젖습니다.",
      "컵 바깥쪽 겉면에 작은 물방울이 생겨 뿌옇게 됩니다.",
      "컵 바깥쪽에서 하얀 김이 계속 피어올라 위로 올라갑니다.",
      "컵 겉면에 맺힌 물방울이 흘러내려 접시에 물이 고입니다.",
      "컵 안의 얼음물이 모두 수증기로 변해 금방 사라집니다."
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
    "explanation": "공기 중의 수증기가 차가운 컵 겉면에서 물방울로 맺히고, 그 물방울이 흘러내려 접시에 고여요.",
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
    "id": "s42-u02-v012",
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
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "뜯지 않은 차가운 캔 음료를 쟁반에 올려 전자저울로 무게를 쟀더니 380 g이었습니다. 20분 뒤 다시 잰 무게로 알맞은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 380 g보다 가벼움",
        "ㄴ. 380 g보다 무거움",
        "ㄷ. 380 g과 같음"
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
        "380 g보다 무거움",
        "380g보다 무거움",
        "무거워짐"
      ]
    },
    "explanation": "공기 중의 수증기가 차가운 캔 겉면에서 물방울로 맺혀 붙기 때문에 무게가 늘어나요.",
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
    "id": "s42-u02-v013",
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
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물방울이 생긴 까닭이 나머지 넷과 다른 것을 고르세요.",
    "givens": null,
    "choices": [
      "추운 날 버스 창문 안쪽에 맺힌 물방울",
      "목욕한 뒤 욕실 거울에 뿌옇게 맺힌 물방울",
      "햇볕에 녹고 있는 눈사람 끝에 매달린 물방울",
      "냉장고에서 막 꺼낸 차가운 우유병 겉면에 맺힌 물방울",
      "쌀쌀한 새벽 자동차 앞 유리에 맺힌 물방울"
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
    "explanation": "눈사람 끝의 물방울은 눈이 녹은 물이에요. 나머지는 모두 수증기가 차가운 곳에서 응결한 물방울이에요.",
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
    "id": "s42-u02-v014",
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
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 우리 생활에서 물의 상태 변화를 이용하는 예입니다. 빈칸에 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "스팀다리미는 다리미 속 물을 가열해 [    ](으)로 바꾸어 내뿜으면서 옷의 주름을 폅니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "수증기",
      "accepted": [
        "수증기"
      ]
    },
    "explanation": "스팀다리미는 물이 수증기로 변하는 상태 변화를 이용해요.",
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
    "id": "s42-u02-v015",
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
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물이 얼음으로 변하는 상태 변화를 이용한 예를 고르세요.",
    "givens": null,
    "choices": [
      "가열식 가습기로 방 안을 촉촉하게 합니다.",
      "주스를 틀에 넣고 얼려 얼음과자를 만듭니다.",
      "얼음주머니를 대어 부딪쳐 부은 곳을 식힙니다.",
      "곶감을 만들려고 껍질 벗긴 감을 햇볕에 말립니다.",
      "찜기에 만두를 넣고 쪄서 익힙니다."
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
    "explanation": "얼음과자는 액체인 주스 속 물이 얼어 고체가 되는 상태 변화를 이용해요. 얼음주머니는 얼음이 녹는 쪽이에요.",
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
    "id": "s42-u02-v016",
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
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "얼음, 물, 수증기를 비교한 내용으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "얼음은 일정한 모양이 있어 손으로 잡을 수 있습니다.",
      "물은 흐르는 성질이 있어 그릇에 따라 모양이 바뀝니다.",
      "수증기는 눈에 보이지 않고 손으로 잡을 수 없습니다.",
      "수증기는 하얗게 보여서 눈으로 쉽게 볼 수 있습니다.",
      "얼음은 차갑고 단단하며 눈으로 볼 수 있습니다."
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
    "explanation": "수증기는 기체라서 눈에 보이지 않아요. 하얗게 보이는 김은 수증기가 아니라 작은 물방울이에요.",
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
    "id": "s42-u02-v017",
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
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "그릇에 담은 눈을 따뜻한 교실 안에 두었습니다. 시간이 지나면서 볼 수 있는 모습을 고르세요.",
    "givens": null,
    "choices": [
      "눈이 녹아 그릇 바닥에 물이 고입니다.",
      "눈이 점점 더 단단하게 굳어집니다.",
      "눈의 양이 처음보다 점점 많아집니다.",
      "눈이 곧바로 수증기가 되어 순식간에 사라집니다.",
      "시간이 지나도 눈에 아무 변화가 없습니다."
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
    "explanation": "따뜻한 곳에 두면 고체인 눈이 녹아 액체인 물이 돼요.",
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
    "id": "s42-u02-v018",
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
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물이 액체 상태에서 고체 상태로 변한 경우를 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 냉동실에서 꺼낸 얼음이 접시 위에서 녹아 물이 되었습니다.",
        "ㄴ. 처마 끝에서 떨어지던 빗물이 추운 밤 동안 고드름이 되었습니다.",
        "ㄷ. 난로 위 주전자의 물이 끓어 수증기가 되었습니다."
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
        "고드름"
      ]
    },
    "explanation": "빗물(액체)이 고드름(고체)이 된 것이 액체에서 고체로 변한 경우예요. ㄱ은 고체에서 액체로, ㄷ은 액체에서 기체로 변했어요.",
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
    "id": "s42-u02-v019",
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
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "위 결과를 보고 알 수 있는 것을 고르세요.",
    "givens": {
      "지문": "다음은 페트병에 물을 담아 높이를 표시한 뒤 냉동실에서 완전히 얼렸을 때의 결과입니다. • 얼리기 전: 물의 높이 12 cm, 무게 520 g • 완전히 언 뒤: 얼음의 높이 13 cm, 무게 520 g"
    },
    "choices": [
      "물이 얼면 부피와 무게가 모두 늘어납니다.",
      "물이 얼면 부피는 줄어들고 무게는 그대로입니다.",
      "물이 얼면 부피는 그대로이고 무게가 늘어납니다.",
      "물이 얼면 부피와 무게가 모두 그대로입니다.",
      "물이 얼면 부피는 늘어나고 무게는 그대로입니다."
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
    "explanation": "높이가 12 cm에서 13 cm로 높아졌으니 부피는 늘었고, 무게는 520 g 그대로예요.",
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
    "id": "s42-u02-v020",
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
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물이 얼 때 부피가 늘어나서 생기는 현상이 아닌 것을 고르세요.",
    "givens": null,
    "choices": [
      "추운 겨울밤에 수도 계량기가 얼어서 터집니다.",
      "냉동실에서 꺼낸 얼음팩이 녹으면서 홀쭉해집니다.",
      "물을 가득 담아 얼린 유리병에 금이 갑니다.",
      "물을 가득 채워 얼린 우유갑의 옆면이 볼록하게 부풉니다.",
      "겨울철 도로 틈에 스며든 물이 얼면서 도로가 갈라집니다."
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
    "explanation": "얼음팩이 녹아 홀쭉해지는 것은 얼음이 녹아 부피가 줄어드는 현상이에요. 나머지는 물이 얼면서 부피가 늘어나 생긴 일이에요.",
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
    "id": "s42-u02-v021",
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
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물을 가득 채워 얼린 얼음 컵의 윗면이 컵 위로 볼록하게 솟았습니다. 이 얼음이 다시 모두 녹을 때 줄어드는 부피와 같은 것을 고르세요.",
    "givens": null,
    "choices": [
      "물이 얼 때 줄어든 부피",
      "물이 얼 때 늘어난 무게",
      "물이 얼 때 늘어난 부피",
      "물이 얼 때 줄어든 무게",
      "컵에 처음 담았던 물 전체의 부피"
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
    "explanation": "물이 얼 때 늘어난 만큼 얼음이 녹을 때 부피가 다시 줄어들어요. 무게는 얼 때도 녹을 때도 변하지 않아요.",
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
    "id": "s42-u02-v022",
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
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "뚜껑을 꼭 닫은 생수병의 물을 얼린 뒤 잰 무게를 ㈎, 그 생수병을 그늘에 두어 얼음이 모두 녹은 뒤 겉의 물기를 닦고 잰 무게를 ㈏라고 할 때, ㈎와 ㈏를 비교한 것으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. ㈎가 ㈏보다 무겁다.",
        "ㄴ. ㈎가 ㈏보다 가볍다.",
        "ㄷ. ㈎와 ㈏의 무게가 같다."
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
        "㈎와 ㈏의 무게가 같다",
        "㈎ = ㈏",
        "㈎=㈏",
        "같다"
      ]
    },
    "explanation": "얼음이 녹아 물이 되어도 무게는 변하지 않아서 ㈎와 ㈏는 같아요.",
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
    "id": "s42-u02-v023",
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
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "오징어를 햇볕에 널어 말렸을 때의 변화로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "오징어 속에 있던 물이 증발합니다.",
      "말리기 전보다 무게가 가벼워집니다.",
      "말린 뒤에는 처음보다 딱딱해집니다.",
      "말릴수록 오징어 속의 물이 더 많아집니다.",
      "말린 뒤에는 오래 두어도 쉽게 상하지 않습니다."
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
    "explanation": "햇볕에 말리면 오징어 속의 물이 증발해서 물이 줄어들고 가벼워져요.",
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
    "id": "s42-u02-v024",
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
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "증발과 관련된 예가 아닌 것을 고르세요.",
    "givens": null,
    "choices": [
      "추운 밖에서 들어오자 안경알이 뿌옇게 흐려집니다.",
      "수영을 마치고 나온 뒤 젖은 머리카락이 마릅니다.",
      "바닷물을 염전에 가두어 두면 소금이 남습니다.",
      "꽃병에 담아 둔 물이 며칠 사이 조금씩 줄어듭니다.",
      "물감으로 그린 그림이 시간이 지나면 마릅니다."
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
    "explanation": "안경알이 흐려지는 것은 따뜻한 공기 속 수증기가 차가운 안경알에서 물방울로 변하는 응결이에요.",
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
    "id": "s42-u02-v025",
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
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 물이 끓을 때의 모습에 대한 설명입니다. 빈칸에 공통으로 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "• 물이 끓을 때 물속에서 생긴 [    ]은/는 위로 떠올라 물 표면에서 터집니다. • [    ] 속에는 물이 변해서 생긴 수증기가 들어 있습니다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "기포",
      "accepted": [
        "기포",
        "거품"
      ]
    },
    "explanation": "물이 끓으면 물속에서도 물이 수증기로 변해 기포가 생기고, 기포는 떠올라 표면에서 터져요.",
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
    "id": "s42-u02-v026",
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
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "증발과 끓음에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "증발은 물을 가열하지 않아도 일어납니다.",
      "끓음은 물 표면과 물속에서 모두 일어납니다.",
      "같은 양의 물이라면 끓을 때가 증발할 때보다 물이 빨리 줄어듭니다.",
      "증발과 끓음은 모두 물이 수증기로 변하는 현상입니다.",
      "끓음은 물 표면에서만 천천히 일어나는 현상입니다."
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
    "explanation": "물 표면에서만 천천히 일어나는 것은 증발이에요. 끓음은 표면과 물속에서 빠르게 일어나요.",
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
    "id": "s42-u02-v027",
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
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "얼음을 넣은 금속 컵을 쟁반에 올려 두고 관찰했습니다. 이에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "시간이 지나면 컵 겉면에 물방울이 맺힙니다.",
      "컵 겉면의 물방울은 컵 안의 물이 새어 나온 것입니다.",
      "공기 중의 수증기가 차가운 컵 겉면에서 물로 변합니다.",
      "맺힌 물방울이 흘러내리면서 쟁반에 물이 조금씩 고입니다.",
      "컵과 쟁반을 함께 재면 처음보다 무게가 조금 늘어나 있습니다."
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
    "explanation": "컵 겉면의 물방울은 컵 안에서 샌 것이 아니라 공기 중의 수증기가 차가운 컵에 닿아 응결한 거예요.",
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
    "id": "s42-u02-v028",
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
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "추운 겨울 아침, 따뜻한 방 안의 유리창 안쪽에 물방울이 잔뜩 맺혔습니다. 이 물방울이 생기는 것과 관련된 현상을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 응결",
        "ㄴ. 끓음",
        "ㄷ. 증발"
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
        "응결"
      ]
    },
    "explanation": "방 안 공기의 수증기가 차가운 유리창에 닿아 물방울로 변한 것이니 응결이에요.",
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
    "id": "s42-u02-v029",
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
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "우리 생활에서 물이 얼음으로 변하는 상태 변화를 이용한 예가 아닌 것을 고르세요.",
    "givens": null,
    "choices": [
      "스키장에서 인공 눈을 만들어 뿌립니다.",
      "얼음 틀에 물을 부어 각얼음을 만듭니다.",
      "과일 주스를 얼려 얼음과자를 만듭니다.",
      "찜기에 고구마를 넣고 쪄서 익힙니다.",
      "생선을 꽁꽁 얼려 오랫동안 상하지 않게 보관합니다."
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
    "explanation": "고구마를 찌는 것은 물이 수증기로 변하는 상태 변화를 이용해요. 나머지는 물이 얼음으로 변하는 것을 이용해요.",
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
    "id": "s42-u02-v030",
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
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "장마철 옷장 안 습기를 없애려고 제습기를 틀었더니 제습기 물통에 물이 모였습니다. 이 물은 어떤 상태 변화로 생긴 것인지 고르세요.",
    "givens": null,
    "choices": [
      "물 → 수증기",
      "얼음 → 물",
      "수증기 → 물",
      "물 → 얼음",
      "얼음 → 수증기"
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
    "explanation": "제습기는 공기 중의 수증기를 차갑게 해서 물로 바꾸어 모아요.",
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
    "id": "s42-u02-v031",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "얼음 틀에서 꺼낸 얼음 조각과 컵에 담긴 물을 관찰했어요. 관찰한 내용으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "얼음 조각은 손으로 집어 들 수 있습니다.",
      "얼음 조각은 접시에 옮겨 놓아도 모양이 그대로입니다.",
      "컵의 물은 손가락 사이로 흘러내려서 손으로 쥘 수가 없습니다.",
      "얼음 조각은 둥근 그릇에 넣으면 그릇 모양에 맞게 바뀝니다.",
      "컵의 물을 납작한 접시에 부으면 접시 모양을 따라 넓게 퍼집니다."
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
    "explanation": "얼음은 고체라서 어떤 그릇에 넣어도 자기 모양을 지켜요. 그릇에 따라 모양이 바뀌는 것은 액체인 물이에요.",
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
    "id": "s42-u02-v032",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "더운 여름날 운동장 벤치 위에 얼음 조각을 올려놓고 해가 질 때까지 지켜보았어요. 일어나는 변화로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "얼음이 녹아 생긴 물은 해가 질 때까지 벤치 위에 그대로 남아 있습니다.",
      "얼음 조각의 모서리부터 점점 둥글어지며 크기가 작아집니다.",
      "얼음이 녹으면서 벤치 위에 물이 고입니다.",
      "벤치 위에 고인 물은 시간이 지나면서 점점 줄어듭니다.",
      "벤치 위의 물이 줄어드는 것은 물이 수증기가 되어 공기 중으로 흩어졌기 때문입니다."
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
    "explanation": "얼음은 녹아서 물이 되고, 그 물은 시간이 지나면 증발해 수증기가 되어 공기 중으로 흩어져요. 그래서 물이 그대로 남아 있지 않아요.",
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
    "id": "s42-u02-v033",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "냉동실의 얼음, 컵 속의 물, 젖은 빨래에서 빠져나가는 수증기에 대해 친구들이 말했어요. 옳지 않은 말을 고르세요.",
    "givens": null,
    "choices": [
      "얼음은 고체 상태의 물입니다.",
      "컵 속의 물은 액체 상태입니다.",
      "수증기는 기체 상태라서 눈에 보이지 않습니다.",
      "컵 속의 물을 얼리면 얼음이 되고, 그 얼음을 녹이면 다시 물이 됩니다.",
      "얼음과 수증기는 물과 전혀 다른 물질이라서 서로 바뀔 수 없습니다."
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
    "explanation": "얼음, 물, 수증기는 모두 같은 물이 상태만 다른 거예요. 그래서 얼음은 물이 되고, 물은 수증기가 되는 것처럼 서로 바뀔 수 있어요.",
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
    "id": "s42-u02-v034",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "눈 온 날 마당에 만든 눈사람에 대한 설명으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "눈사람은 액체 상태입니다.",
      "눈사람은 고체 상태입니다.",
      "눈사람은 기체 상태라서 손으로 만질 수 없습니다.",
      "날이 풀려 눈사람이 녹으면 물이 됩니다.",
      "햇볕을 많이 받을수록 눈사람이 점점 더 단단하고 커집니다."
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
    "explanation": "눈사람은 얼음 알갱이인 눈으로 만들어서 고체 상태예요. 날이 따뜻해지면 녹아서 액체인 물이 돼요.",
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
    "id": "s42-u02-v035",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "작은 플라스틱 병에 물을 반쯤 담고 물의 높이에 네임펜으로 선을 그은 뒤, 냉동실에 넣어 꽁꽁 얼렸어요. 얼음의 윗면은 그어 놓은 선과 비교해 어떻게 되었을지 ( 높다, 낮다, 같다 ) 중에서 골라 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "높다",
      "accepted": [
        "높다",
        "높아요",
        "높아진다",
        "높아졌다",
        "높아집니다",
        "선보다 높다",
        "선보다 높아요",
        "위"
      ]
    },
    "explanation": "물이 얼어 얼음이 되면 부피가 늘어나요. 그래서 얼음의 윗면은 처음 그은 선보다 높아져요.",
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
    "id": "s42-u02-v036",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "추운 겨울을 여러 번 지나면 바위 틈에 스며든 물 때문에 바위가 조금씩 쪼개지기도 해요. 그 까닭으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "바위 틈의 물이 증발하면서 바위를 바깥쪽으로 밀어내기 때문입니다.",
      "바위 틈의 물이 얼면서 부피가 늘어나 틈을 벌리기 때문입니다.",
      "바위 틈의 물이 얼면서 무게가 늘어나 바위를 세게 누르기 때문입니다.",
      "바위 틈의 물이 얼면서 부피가 줄어들어 바위 사이에 빈 곳이 생기기 때문입니다.",
      "바위 틈으로 물이 너무 빠르게 흘러 들어가 바위를 깎기 때문입니다."
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
    "explanation": "물이 얼어 얼음이 되면 무게는 그대로지만 부피가 늘어나요. 늘어난 얼음이 틈을 벌려서 바위가 쪼개져요.",
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
    "id": "s42-u02-v037",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "작은 플라스틱 통에 물을 얼려 만든 얼음의 윗면 높이를 표시하고, 따뜻한 곳에 두어 얼음을 모두 녹였어요. 그다음 물의 높이를 처음 표시와 비교했어요. 이 실험으로 알 수 있는 것을 고르세요.",
    "givens": null,
    "choices": [
      "얼음이 녹을 때 무게가 어떻게 변하는지 알 수 있습니다.",
      "얼음이 녹으면 물의 높이가 표시보다 높아진다는 것을 알 수 있습니다.",
      "얼음이 녹아 물이 될 때 부피가 어떻게 변하는지 알 수 있습니다.",
      "얼음이 녹는 데 걸리는 시간은 통의 크기와 상관없다는 것을 알 수 있습니다.",
      "얼음이 녹아도 높이는 변하지 않는다는 것을 알 수 있습니다."
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
    "explanation": "높이를 비교하는 실험은 부피의 변화를 알아보는 거예요. 얼음이 녹아 물이 되면 부피가 줄어서 높이가 표시보다 낮아져요.",
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
    "id": "s42-u02-v038",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "얼음이 든 지퍼 백을 꼭 닫아 따뜻한 곳에 두었어요. 얼음이 다 녹은 뒤 지퍼 백 겉에 맺힌 물기를 닦고 무게를 재었더니 42 g이었어요. 얼음이 녹기 전 지퍼 백의 무게로 알맞은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 42 g보다 무거웠습니다.",
        "ㄴ. 42 g과 같았습니다.",
        "ㄷ. 42 g보다 가벼웠습니다."
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
        "ㄴ.",
        "ㄴ. 42 g과 같았습니다.",
        "42 g과 같았습니다",
        "42 g",
        "42g",
        "42 g과 같다",
        "같다",
        "같았다"
      ]
    },
    "explanation": "얼음이 녹아 물이 되어도 무게는 변하지 않아요. 그래서 녹기 전에도 42 g이었어요.",
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
    "id": "s42-u02-v039",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물의 부피 변화가 나머지 넷과 다른 것을 고르세요.",
    "givens": null,
    "choices": [
      "겨울에 물을 가득 채워 둔 유리 화병이 얼면서 금이 갔습니다.",
      "물을 가득 담아 얼린 우유갑의 윗부분이 불룩하게 솟았습니다.",
      "꽁꽁 언 물병을 책상에 두었더니 다 녹은 뒤 물 높이가 낮아졌습니다.",
      "추운 겨울날 도로 틈에 고인 물이 얼어 아스팔트가 들뜨고 갈라졌습니다.",
      "뚜껑을 꽉 닫고 물을 가득 넣어 얼린 페트병의 바닥이 볼록하게 튀어나왔습니다."
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
    "explanation": "물병 속 얼음이 녹으면 부피가 줄어서 높이가 낮아져요. 나머지는 모두 물이 얼면서 부피가 늘어난 예예요.",
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
    "id": "s42-u02-v040",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T07",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 크기로 얇게 썬 감 조각을 둘로 나누어, 반은 뚜껑을 꼭 닫은 통에 넣고 나머지 반은 바람이 잘 통하는 채반에 펼쳐 며칠 동안 두었어요. 두 감 조각의 맛을 비교하여 쓰고, 그렇게 생각한 까닭을 물의 상태 변화와 관련지어 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "채반에 말린 감 조각이 통에 넣어 둔 감 조각보다 더 달아요. 감 속에 있던 물이 증발해 수증기가 되어 공기 중으로 흩어졌기 때문이에요.",
      "rubric": {
        "required": [
          "채반에 말린 감 조각이 더 달다",
          "감 속의 물이 증발해 수증기가 되어 공기 중으로 흩어졌다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "채반에 둔 감은 속의 물이 증발해 수증기로 빠져나가서 단맛이 진해져요. 통에 넣어 둔 감은 물이 빠져나가지 못해 그대로 촉촉해요.",
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
    "id": "s42-u02-v041",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "공기 중에 있던 기체인 수증기가 차가운 물체 표면에 닿아 액체인 물방울로 바뀌는 현상을 무엇이라고 하는지 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "응결",
      "accepted": [
        "응결",
        "응결 현상"
      ]
    },
    "explanation": "수증기가 차가운 곳에서 물로 바뀌는 현상을 응결이라고 해요. 물이 수증기로 바뀌는 증발과는 방향이 반대예요.",
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
    "id": "s42-u02-v042",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "냄비에 물을 담아 가열했더니 물이 끓기 시작했어요. 이때 볼 수 있는 모습으로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "물 표면에서만 물이 조용히 수증기로 변하고, 물속에서는 아무 변화도 일어나지 않습니다.",
      "냄비 바닥에 아주 작은 기포 몇 개가 붙어 있을 뿐입니다.",
      "물속에서 크고 작은 기포가 끊임없이 생겨 위로 올라옵니다.",
      "기포가 물 표면에서 터지면서 물 표면이 출렁이며 울퉁불퉁해집니다.",
      "물이 끓기 시작하면 물의 양은 더 이상 줄어들지 않습니다."
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
    "explanation": "물이 끓으면 물속에서 크고 작은 기포가 계속 생겨 올라오고, 기포가 터지면서 물 표면이 울퉁불퉁해져요. 작은 기포 몇 개만 보이는 것은 끓기 전의 모습이에요.",
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
    "id": "s42-u02-v043",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "빈칸에 들어갈 알맞은 말을 쓰세요. 「라면을 끓이려고 냄비의 물을 가열했더니 물속에서 기포가 계속 올라왔어요. 이처럼 물 표면뿐 아니라 물속에서도 물이 수증기로 바뀌는 현상을 □(이)라고 해요.」",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "끓음",
      "accepted": [
        "끓음",
        "끓는 것",
        "끓기"
      ]
    },
    "explanation": "물 표면과 물속에서 함께 물이 수증기로 바뀌는 것은 끓음이에요. 물 표면에서만 천천히 바뀌는 증발과 구별해요.",
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
    "id": "s42-u02-v044",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "젖은 운동화가 햇볕에 마르는 것과 주전자의 물이 끓는 것을 비교한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "두 경우 모두 액체인 물이 기체인 수증기로 변합니다.",
      "운동화의 물은 주로 물 표면에서 수증기로 변합니다.",
      "주전자의 물은 물 표면과 물속에서 모두 수증기로 변합니다.",
      "같은 양의 물이라면 물이 끓을 때가 증발할 때보다 물의 양이 더 빨리 줄어듭니다.",
      "운동화의 물은 가열하지 않았으므로 수증기로 변할 수 없습니다."
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
    "explanation": "증발은 가열하지 않아도 물 표면에서 천천히 일어나요. 운동화의 물도 증발해서 수증기가 된 거예요.",
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
    "id": "s42-u02-v045",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "냉장고에서 막 꺼낸 캔 음료를 뜯지 않고 전자저울에 올려 두었더니, 몇 분 뒤 무게가 조금 늘어났어요. 무게가 늘어난 까닭으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "공기 중의 수증기가 차가운 캔 표면에서 물방울로 맺혔기 때문입니다.",
      "캔 속의 음료가 캔 벽을 통해 조금씩 밖으로 스며 나왔기 때문입니다.",
      "캔 속의 음료가 더 차가워지면서 무게가 늘어났기 때문입니다.",
      "캔 표면에 묻어 있던 물이 증발하여 수증기로 변했기 때문입니다.",
      "캔 속 음료의 일부가 얼면서 무게가 늘어났기 때문입니다."
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
    "explanation": "공기 중의 수증기가 차가운 캔 표면에 닿아 응결해서 물방울이 붙었어요. 붙은 물방울만큼 무게가 늘어난 거예요.",
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
    "id": "s42-u02-v046",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "겨울에 빈 논에 물을 대어 두면 추운 밤이 지난 뒤 얼음 썰매장이 만들어져요. 여기에서 이용한 물의 상태 변화를 고르세요.",
    "givens": null,
    "choices": [
      "얼음 → 물",
      "수증기 → 물",
      "물 → 수증기",
      "물 → 얼음",
      "얼음 → 수증기"
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
    "explanation": "논에 대어 둔 물이 추운 밤에 얼어서 얼음판이 돼요. 액체인 물이 고체인 얼음으로 변하는 것을 이용한 거예요.",
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
    "id": "s42-u02-v047",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "무더운 여름날 에어컨을 켜 둔 시원한 방에 있다가 바깥으로 나오면 휴대 전화 화면이 뿌옇게 흐려져요. 이때 일어나는 물의 상태 변화로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "고체 → 액체",
      "기체 → 액체",
      "액체 → 기체",
      "액체 → 고체",
      "기체 → 고체"
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
    "explanation": "바깥의 따뜻한 공기 속 수증기가 차가워진 휴대 전화 화면에 닿아 작은 물방울로 맺혔어요. 기체인 수증기가 액체인 물로 변한 응결이에요.",
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
    "id": "s42-u02-v048",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물이 얼음으로 변하는 것을 이용한 예가 아닌 것을 고르세요.",
    "givens": null,
    "choices": [
      "얼음 틀에 물을 부어 냉동실에서 얼음을 만듭니다.",
      "스팀청소기로 바닥에 눌어붙은 얼룩을 닦습니다.",
      "눈 벽돌 틈에 물을 뿌리고 얼려 이글루를 단단하게 만듭니다.",
      "눈이 오지 않을 때 스키장에서 인공 눈을 만들어 뿌립니다.",
      "과일 주스를 틀에 부어 얼려서 얼음과자를 만듭니다."
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
    "explanation": "스팀청소기는 물을 가열해 수증기로 바꾸는 것을 이용해요. 나머지는 모두 물이 얼음으로 변하는 것을 이용한 예예요.",
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
    "id": "s42-u02-v049",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물을 끓여서 쓰는 가열식 가습기와 음식을 익히는 찜기의 공통점으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "둘 다 음식을 익힐 때 이용합니다.",
      "둘 다 물이 얼음으로 변하는 것을 이용합니다.",
      "둘 다 공기 중의 수증기를 물로 바꾸는 것을 이용합니다.",
      "둘 다 물이 수증기로 변하는 것을 이용합니다.",
      "둘 다 방 안의 습기를 없애 공기를 보송보송하게 만듭니다."
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
    "explanation": "가열식 가습기는 물을 끓여 나온 수증기로 방을 촉촉하게 하고, 찜기는 그 수증기로 음식을 익혀요. 둘 다 물이 수증기로 변하는 것을 이용해요.",
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
    "id": "s42-u02-v050",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "빈칸에 들어갈 알맞은 것을 고르세요. 「비 오는 날 방 안에 빨래를 널 때 □을(를) 함께 켜 두면, 공기 중의 수증기를 물로 바꾸어 물통에 모아 주어서 방이 덜 눅눅해요.」",
    "givens": null,
    "choices": [
      "가습기",
      "선풍기",
      "전기난로",
      "스팀청소기",
      "제습기"
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
    "explanation": "제습기는 공기 중의 수증기를 응결시켜 물로 모으는 기계예요. 그래서 습기를 줄여 줘요.",
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
    "id": "s42-u02-v051",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "두 접시에 얼음과 물을 하나씩 담고 관찰했어요. ㈎ 접시는 살짝 기울여도 담긴 것이 제자리에 있고, 손가락으로 집어 올릴 수 있었어요. ㈏ 접시는 살짝 기울이면 담긴 것이 한쪽으로 흘러가고, 손가락으로 집으려 해도 빠져나갔어요. ㈎와 ㈏는 얼음과 물 중 무엇인지 각각 쓰세요. ㈎-( ), ㈏-( )",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㈎ 얼음, ㈏ 물",
      "accepted": [
        "㈎ 얼음, ㈏ 물",
        "㈎-얼음, ㈏-물",
        "㈎ 얼음 ㈏ 물",
        "㈎-얼음 ㈏-물",
        "㈎얼음,㈏물",
        "㈎얼음, ㈏물",
        "㈎: 얼음, ㈏: 물",
        "얼음, 물",
        "얼음,물",
        "얼음 물"
      ]
    },
    "explanation": "얼음은 모양이 일정해서 기울여도 그대로 있고 집을 수 있어요. 물은 흐르고 모양이 일정하지 않아서 손으로 잡을 수 없어요.",
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
    "id": "s42-u02-v052",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "수돗물을 두 손으로 떠 보았어요. 물을 손으로 만졌을 때의 특징으로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "손가락 사이로 흘러내려서 손에 쥘 수 없습니다.",
      "단단해서 손가락으로 집어 올릴 수 있습니다.",
      "손에 아무것도 닿지 않는 느낌이고 눈에도 전혀 보이지 않습니다.",
      "말랑말랑해서 손으로 주물러 원하는 모양을 만들 수 있습니다.",
      "손바닥 위에 올려도 모양이 흐트러지지 않고 그대로입니다."
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
    "explanation": "물은 액체라서 흐르는 성질이 있어 손가락 사이로 빠져나가요. 단단하고 모양이 그대로인 것은 얼음, 보이지 않는 것은 수증기예요.",
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
    "id": "s42-u02-v053",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T02",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "운동장 구석에 쌓여 있던 눈이 녹아 물웅덩이가 생겼어요. 며칠 동안 맑은 날이 이어지자 웅덩이도 말라서 없어졌어요. 이 과정에서 일어난 물의 상태 변화를 차례대로 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "고체인 눈이 녹아 액체인 물이 되었고, 웅덩이의 물은 증발하여 기체인 수증기가 되어 공기 중으로 흩어졌어요.",
      "rubric": {
        "required": [
          "고체인 눈이 녹아 액체인 물이 되었다",
          "웅덩이의 물이 증발해 기체인 수증기가 되어 공기 중으로 흩어졌다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "고체인 눈은 녹아서 액체인 물이 되고, 그 물은 끓지 않아도 증발해 기체인 수증기가 돼요. 그래서 웅덩이가 점점 말라 없어져요.",
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
    "id": "s42-u02-v054",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 설명에 알맞은 것을 <보기>에서 골라 쓰세요. • 눈으로 볼 수 있습니다. • 담는 그릇이 바뀌면 모양도 바뀝니다. • 손으로 움켜쥐면 손가락 사이로 빠져나갑니다.",
    "givens": {
      "보기": [
        "ㄱ. 얼음",
        "ㄴ. 물",
        "ㄷ. 수증기"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "물",
      "accepted": [
        "물",
        "ㄴ",
        "ㄴ. 물",
        "ㄴ 물"
      ]
    },
    "explanation": "눈에 보이면서 그릇에 따라 모양이 바뀌고 흐르는 것은 액체인 물이에요. 얼음은 모양이 일정하고, 수증기는 눈에 보이지 않아요.",
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
    "id": "s42-u02-v055",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물을 가득 채운 얼음 틀을 냉동실에서 얼렸더니 얼음 윗면이 볼록하게 솟았지만, 저울에 올려 보니 얼리기 전과 같았어요. 괄호 ㉠과 ㉡에 들어갈 알맞은 말을 골라 각각 쓰세요. 「물이 얼어 얼음이 되면 ㉠( 부피, 무게 )는 변하지 않고, ㉡( 부피, 무게 )는 늘어납니다.」 ㉠-( ), ㉡-( )",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠ 무게, ㉡ 부피",
      "accepted": [
        "㉠ 무게, ㉡ 부피",
        "㉠-무게, ㉡-부피",
        "㉠ 무게 ㉡ 부피",
        "㉠-무게 ㉡-부피",
        "㉠무게,㉡부피",
        "㉠무게, ㉡부피",
        "㉠: 무게, ㉡: 부피",
        "무게, 부피",
        "무게,부피",
        "무게 부피"
      ]
    },
    "explanation": "물이 얼면 부피는 늘어나서 윗면이 솟지만, 무게는 그대로예요.",
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
    "id": "s42-u02-v056",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "얼음 틀에 물을 부을 때 칸 끝까지 가득 채우지 않고 조금 남겨 두는 것이 좋아요. 그 까닭으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "물을 조금 남겨야 얼음이 더 단단하게 얼기 때문입니다.",
      "물이 얼면 무게가 늘어나 얼음 틀이 무거워지기 때문입니다.",
      "물이 얼면 부피가 늘어나 칸 밖으로 넘치기 때문입니다.",
      "물이 얼면 부피가 줄어들어 얼음끼리 달라붙지 않기 때문입니다.",
      "칸을 가득 채우면 물이 증발하지 못해 얼음이 생기지 않기 때문입니다."
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
    "explanation": "물이 얼어 얼음이 되면 부피가 늘어나요. 칸을 가득 채우면 얼음이 칸 밖으로 넘쳐 서로 붙어 버려요.",
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
    "id": "s42-u02-v057",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "얼음 조각을 넣고 뚜껑을 꼭 닫은 플라스틱 병의 무게가 85 g이었어요. 얼음이 모두 녹은 뒤 병 겉의 물기를 닦고 다시 무게를 재면 어떻게 될지 고르세요.",
    "givens": null,
    "choices": [
      "85 g으로, 얼음이 녹기 전과 같습니다.",
      "85 g보다 가벼워집니다. 얼음이 녹으면서 크기가 작아졌기 때문입니다.",
      "85 g보다 무거워집니다. 얼음이 녹아 물이 새로 생겼기 때문입니다.",
      "85 g보다 가벼워집니다. 녹은 물이 병 속에서 증발했기 때문입니다.",
      "녹은 물이 차가운지 미지근한지에 따라 무게가 달라집니다."
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
    "explanation": "얼음이 녹아 물이 되면 부피는 줄지만 무게는 변하지 않아요. 그래서 그대로 85 g이에요.",
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
    "id": "s42-u02-v058",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "얼음이 녹아 부피가 줄어드는 예로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "빨랫줄에 널어 둔 수건이 바싹 말랐습니다.",
      "차가운 물병 겉면에 물방울이 송골송골 맺혔습니다.",
      "물을 가득 채워 냉동실에서 얼린 우유갑의 윗부분이 불룩하게 솟았습니다.",
      "주전자의 물이 끓으면서 뚜껑이 들썩거렸습니다.",
      "얼음 틀 속 얼음을 녹였더니 칸마다 물 높이가 낮아졌습니다."
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
    "explanation": "얼음이 녹아 물이 되면 부피가 줄어서 칸 속의 높이가 낮아져요. 수건이 마르는 것은 증발, 물병의 물방울은 응결, 우유갑이 불룩해지는 것은 물이 얼어 부피가 늘어난 예예요.",
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
    "id": "s42-u02-v059",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T07",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "포도를 햇볕이 잘 드는 곳에서 오랫동안 말려 건포도를 만들었어요. 건포도의 크기는 처음 포도와 비교해 어떻게 변하는지 쓰고, 그 까닭을 물의 상태 변화와 관련지어 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "건포도는 처음 포도보다 크기가 작아지고 쭈글쭈글해져요. 포도 속에 있던 물이 증발해 수증기가 되어 공기 중으로 흩어졌기 때문이에요.",
      "rubric": {
        "required": [
          "건포도는 처음 포도보다 크기가 작아진다",
          "포도 속의 물이 증발해 수증기가 되어 공기 중으로 흩어졌다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "포도 속의 물이 증발해 수증기로 빠져나가면서 건포도는 작고 쭈글쭈글해져요. 물은 끓지 않아도 표면에서 천천히 증발해요.",
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
    "id": "s42-u02-v060",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "증발의 예로 옳은 것을 모두 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "바닷물을 염전에 가두어 두고 소금을 얻습니다.",
      "주전자의 물이 끓어 뚜껑이 들썩거립니다.",
      "차가운 음료 캔 겉면에 물방울이 맺힙니다.",
      "비 온 뒤 운동장의 물웅덩이가 말라 없어집니다.",
      "냉동실에 넣어 둔 물이 꽁꽁 얼어 얼음이 됩니다."
    ],
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
    "explanation": "염전의 바닷물과 운동장 웅덩이의 물은 표면에서 천천히 수증기로 변해 줄어들어요. 끓는 주전자는 끓음, 캔의 물방울은 응결, 얼음 얼리기는 물이 얼음이 되는 예예요.",
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
    "id": "s42-u02-v061",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "유리 냄비에 물을 담아 가열하면서 관찰한 내용으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "가열하기 시작하면 물 표면에서 물이 천천히 수증기로 변합니다.",
      "계속 가열하면 물속에서 큰 기포가 생겨 위로 올라옵니다.",
      "물이 끓을 때 생기는 큰 기포는 물속에 있던 공기일 뿐 수증기와 상관없습니다.",
      "물이 끓기 시작하면 물 표면뿐 아니라 물속에서도 물이 수증기로 변해서 물의 양이 빠르게 줄어듭니다.",
      "끓는 동안 물의 양이 줄어드는 것은 물이 수증기가 되어 공기 중으로 흩어졌기 때문입니다."
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
    "explanation": "물이 끓을 때 생기는 큰 기포는 물속에서 물이 수증기로 변한 거예요. 그래서 끓으면 물의 양이 빠르게 줄어들어요.",
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
    "id": "s42-u02-v062",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "괄호 안에서 알맞은 말을 골라 쓰세요. 「그릇에 담아 둔 물이 가열하지 않아도 물 표면에서 천천히 수증기로 변하는 현상을 ( 증발, 끓음 )(이)라고 합니다.」",
    "givens": null,
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
    "explanation": "가열하지 않아도 물 표면에서 천천히 수증기로 변하는 것은 증발이에요. 끓음은 물속에서도 빠르게 일어나요.",
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
    "id": "s42-u02-v063",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "얼음물을 담은 스테인리스 컵을 식탁 위에 두고 몇 분 뒤 관찰했어요. 관찰한 결과로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "컵 속의 얼음물이 보글보글 끓어오릅니다.",
      "컵 바깥 표면에 작은 물방울이 맺힙니다.",
      "컵 속의 물이 컵 벽을 뚫고 바깥으로 배어 나옵니다.",
      "컵 바깥 표면이 하얀 수증기로 덮여 눈에 보입니다.",
      "컵 속의 얼음이 녹으면서 물이 처음보다 무거워집니다."
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
    "explanation": "공기 중의 수증기가 차가운 컵 바깥 표면에 닿아 응결해서 물방울이 맺혀요. 컵 속의 물이 새어 나온 것이 아니에요.",
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
    "id": "s42-u02-v064",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "「기체인 수증기 → 액체인 물」처럼 상태가 변하는 현상을 부르는 이름을 고르세요.",
    "givens": null,
    "choices": [
      "증발",
      "끓음",
      "기포",
      "응결",
      "수증기"
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
    "explanation": "수증기가 물로 변하는 현상은 응결이에요. 증발과 끓음은 반대로 물이 수증기로 변하는 현상이에요.",
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
    "id": "s42-u02-v065",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "응결과 관련된 현상이 아닌 것을 고르세요.",
    "givens": null,
    "choices": [
      "가을 아침 주차된 자동차 유리에 물방울이 송송 맺힙니다.",
      "샤워를 하고 나면 욕실 타일 벽에 물방울이 맺힙니다.",
      "새벽에 강가에 뿌연 안개가 낍니다.",
      "젖은 걸레를 베란다에 널어 두었더니 바싹 말랐습니다.",
      "차가운 물을 따른 유리컵 바깥이 뿌옇게 흐려집니다."
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
    "explanation": "젖은 걸레가 마르는 것은 물이 수증기로 변하는 증발이에요. 나머지는 수증기가 차가운 곳에서 작은 물방울로 변한 응결이에요.",
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
    "id": "s42-u02-v066",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "비가 오지 않은 맑은 날, 캠핑장에서 이른 아침에 일어나 보니 텐트 바깥 천에 물방울이 잔뜩 맺혀 있었어요. 이때 일어난 물의 상태 변화를 고르세요.",
    "givens": null,
    "choices": [
      "물 → 수증기",
      "수증기 → 물",
      "얼음 → 물",
      "얼음 → 수증기",
      "물 → 얼음"
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
    "explanation": "밤사이 차가워진 텐트 천에 공기 중의 수증기가 닿아 물방울로 맺혔어요. 수증기가 물로 변한 응결이에요.",
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
    "id": "s42-u02-v067",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물의 상태 변화를 이용한 예 중에서 이용한 상태 변화가 나머지 넷과 다른 것을 고르세요.",
    "givens": null,
    "choices": [
      "이글루를 지을 때 눈 벽돌 틈에 물을 뿌려 얼립니다.",
      "찜기에 고구마를 넣고 쪄서 익힙니다.",
      "스팀다리미로 바지의 구김을 폅니다.",
      "가열식 가습기를 켜서 건조한 방 안을 촉촉하게 합니다.",
      "스팀 세척기로 주방 후드의 기름때를 닦아 냅니다."
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
    "explanation": "이글루의 틈에 뿌린 물이 얼음이 되는 것은 물이 얼음으로 변하는 것을 이용해요. 나머지는 모두 물이 수증기로 변하는 것을 이용해요.",
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
    "id": "s42-u02-v068",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "빈칸에 들어갈 알맞은 말을 쓰세요. 「찜기로 만두를 찔 때는 냄비 속의 물이 □(으)로 변하는 것을 이용해 만두를 익혀요.」",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "수증기",
      "accepted": [
        "수증기",
        "기체",
        "기체인 수증기"
      ]
    },
    "explanation": "찜기는 물을 끓여 생긴 수증기의 열로 음식을 익혀요. 물이 수증기로 변하는 것을 이용한 예예요.",
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
    "id": "s42-u02-v069",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "생선 가게에서 생선 위에 얼음을 수북이 덮어 두면 생선을 차갑고 싱싱하게 지킬 수 있어요. 이것은 물의 어떤 상태 변화를 이용한 것인지 고르세요.",
    "givens": null,
    "choices": [
      "물이 수증기로 변하는 상태 변화를 이용합니다.",
      "수증기가 물로 변하는 상태 변화를 이용합니다.",
      "얼음이 물로 변하면서 주위를 차갑게 하는 것을 이용합니다.",
      "물이 얼음으로 변하면서 생선을 꽁꽁 얼려 단단하게 만드는 것을 이용합니다.",
      "얼음이 물을 거치지 않고 바로 수증기로 변하는 것을 이용합니다."
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
    "explanation": "얼음이 녹아 물이 될 때 주위의 열을 빼앗아서 생선을 차갑게 해 줘요. 열이 날 때 쓰는 얼음주머니와 같은 원리예요.",
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
    "id": "s42-u02-v070",
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
      "grade": 4,
      "semester": 2,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "괄호 안에서 알맞은 말을 골라 쓰세요. 「건조한 방에 물에 적신 솔방울을 그릇에 담아 두면 방 안이 촉촉해져요. 솔방울에 머금은 물이 ( 끓음, 증발, 응결 )하여 수증기가 되기 때문이에요.」",
    "givens": null,
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
    "explanation": "솔방울에 머금은 물이 표면에서 천천히 증발해 수증기가 되어 방 안을 촉촉하게 해요. 물을 끓이지 않아도 이렇게 가습할 수 있어요.",
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
