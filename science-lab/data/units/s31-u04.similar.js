// 3-1 Ⅳ 생물의 한살이 — 유사문항 41 (창작). 원문 1문항당 1개, 같은 유형·난이도로 상황과 물체를 바꿨다. of = 짝이 되는 원문 (세트, 번호).
export const similar = [
  {
    "id": "s31-u04-v001",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 개의 자라는 모습을 기록한 카드입니다. 기록을 시간 순서대로 정리한 것은 무엇인가요?",
    "givens": {
      "기록": [
        "가: 눈을 감고 어미의 젖을 먹었다.",
        "나: 몸이 커지고 마당을 달리며 먹이를 먹었다.",
        "다: 눈을 뜨고 다리에 힘이 생겨 걷기 시작했다."
      ]
    },
    "choices": [
      "가 → 나 → 다",
      "나 → 가 → 다",
      "가 → 다 → 나",
      "나 → 다 → 가",
      "다 → 가 → 나"
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
    "explanation": "눈을 뜨지 못하고 젖을 먹던 강아지는 자라면서 눈을 뜨고 걷거나 뛰며 먹이를 찾아 먹어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v002",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "한 닭을 오랫동안 관찰한 기록에 맞는 설명을 고르세요.",
    "givens": {
      "기록": [
        "알에서 나온 뒤: 작고 보송보송한 솜털이 보였다.",
        "더 자란 뒤: 몸이 커지고 날개에 깃털이 뚜렷해졌다."
      ]
    },
    "choices": [
      "몸이 자라며 덮인 털의 모습이 달라졌다.",
      "먹이를 먹던 닭이 나중에 젖을 먹기 시작했다.",
      "처음에 있던 이빨이 자라면서 모두 없어졌다.",
      "알에서 나온 병아리가 번데기를 거쳐 닭이 되었다.",
      "몸집만 커졌을 뿐 몸을 덮은 털은 달라지지 않았다."
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
    "explanation": "사진 기록의 솜털과 깃털을 비교하면 같은 동물도 자라면서 몸의 겉모습이 달라짐을 알 수 있어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v003",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "개구리의 한살이 발표 자료에서 관찰 순서에 맞는 문장 두 개를 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "올챙이는 뒷다리가 나온 뒤 앞다리가 나왔다.",
      "올챙이의 꼬리는 개구리가 되어도 계속 길어졌다.",
      "다 자란 개구리가 알을 낳아 다음 한살이가 이어졌다.",
      "알에서 처음부터 다 자란 개구리와 같은 모습이 나왔다.",
      "개구리는 번데기 속에서 네 다리를 만들었다."
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
    "explanation": "올챙이는 뒷다리가 먼저 나오고 앞다리가 나와요. 자라며 꼬리가 짧아지고, 다 자란 개구리는 알을 낳아 대를 이어 가요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v004",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "관찰 일지에 넣을 내용을 고르는 중입니다. 실제로 해 보면 동물을 해칠 수 있어 빼야 하는 계획은 무엇인가요?",
    "givens": null,
    "choices": [
      "평소 먹이를 먹는 모습을 떨어져서 살펴본다.",
      "자라며 몸의 크기가 바뀌는 모습을 기록한다.",
      "날짜를 쓰고 달라진 몸의 모습을 그림으로 남긴다.",
      "알에서 애벌레가 나오는 과정을 조용히 살펴본다.",
      "먹이를 끊고 며칠을 버티는지 날마다 적는다."
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
    "explanation": "동물에게 알맞은 먹이와 환경을 마련하며 관찰해요. 변화를 보려고 일부러 굶기면 안 돼요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v005",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "자료 속 세 동물의 새끼를 기르는 방식에서 공통점 한 가지를 쓰세요.",
    "givens": {
      "자료": [
        "소: 송아지가 어미의 젖을 먹는다.",
        "고양이: 새끼가 어미의 젖을 먹는다.",
        "토끼: 새끼가 어미의 젖을 먹는다."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "모두 새끼에게 젖을 먹여 기른다.",
      "rubric": {
        "required": [
          "제시한 세 동물 모두 새끼에게 젖을 먹여 기름"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "제시한 소·고양이·토끼는 모두 새끼에게 젖을 먹여 길러요. 이 자료의 동물에게 공통인 특징이며 새끼를 낳는 모든 동물을 뜻하지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v006",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "서로 다른 세 동물의 관찰 기록입니다. 한살이가 시작되는 방식에서 공통점 한 가지를 쓰세요.",
    "givens": {
      "기록": [
        "붕어: 알 안에서 움직이던 작은 물고기가 알 밖으로 나왔다.",
        "배추흰나비: 잎에 붙은 알에서 작은 애벌레가 나왔다.",
        "닭: 달걀 껍데기가 갈라지고 병아리가 나왔다."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "모두 알에서 새끼가 나온다.",
      "rubric": {
        "required": [
          "세 동물 모두 알에서 새끼가 나옴"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "붕어·배추흰나비·닭은 새끼 모습과 자라는 과정은 달라도 모두 알에서 나와 자라요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v007",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "학급에서 한 학기 동안 직접 관찰할 동물을 정하려고 합니다. 고르기 전에 확인할 내용으로 알맞은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "관찰이 끝난 동물을 어디에 팔지 알아본다.",
      "돌볼 방법과 관찰할 수 있는 기간을 먼저 살핀다.",
      "가장 몸집이 큰 동물부터 관찰 대상으로 고른다.",
      "먹이를 주지 않아도 되는 동물인지 먼저 살핀다.",
      "교실이 좁더라도 한살이가 가장 긴 동물을 고른다."
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
    "explanation": "먹이·기르는 장소와 방법·한살이 기간을 살펴야 관찰할 동물을 돌보며 계획을 세울 수 있어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v008",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E1",
      "type": "T01",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 개구리 관찰 카드에서 잘못 쓴 기호를 찾고, 그 문장을 바르게 고쳐 쓰세요.",
    "givens": {
      "보기": [
        "㉠ 알에서 작은 올챙이가 나왔다.",
        "㉡ 올챙이의 앞다리가 나온 뒤 뒷다리가 나왔다.",
        "㉢ 네 다리가 생긴 뒤 꼬리가 점점 짧아졌다."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "㉡, 뒷다리가 나온 뒤 앞다리가 나왔다.",
      "rubric": {
        "required": [
          "잘못된 카드 ㉡을 고름",
          "뒷다리 다음 앞다리가 나오는 순서로 고침"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "올챙이는 뒷다리가 먼저 나오고 그 뒤 앞다리가 나와요. 반대 순서로 적은 ㉡을 고쳐야 해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v009",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "배추흰나비 애벌레가 움직이지 않자 친구들이 다음 행동을 제안했습니다. 고쳐야 할 행동을 고르세요.",
    "givens": null,
    "choices": [
      "허물벗기를 방해하지 않도록 조용히 지켜본다.",
      "먹이의 상태와 사육 상자의 환경을 확인한다.",
      "몸의 변화를 날짜와 함께 일지에 남긴다.",
      "상자를 흔들어서 애벌레가 움직이게 만든다.",
      "애벌레를 손으로 누르지 않고 멀리서 살핀다."
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
    "explanation": "허물을 벗거나 번데기가 될 준비를 할 때에는 먹이를 먹지 않고 움직임이 줄 수 있어요. 흔들거나 허물을 억지로 벗기지 않고 조용히 관찰해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v010",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "‘배추흰나비가 자라며 어떻게 달라질까?’를 조사하려고 합니다. 이 질문을 알아보는 데 가장 도움이 되는 기록은 무엇인가요?",
    "givens": null,
    "choices": [
      "날짜별로 같은 개체의 달라진 모습을 그린다.",
      "날마다 교실에 온 친구들의 이름을 적는다.",
      "사육 상자 바깥의 장식 색만 날마다 바꾼다.",
      "관찰한 날짜를 빼고 마지막 모습만 기억한다.",
      "먹이를 끊고 움직이지 않는 날을 세어 본다."
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
    "explanation": "같은 개체의 날짜별 모습과 단계를 기록해야 한살이의 변화를 비교할 수 있어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v011",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "모두 같은 배추흰나비를 관찰한 카드입니다. 번데기에 해당하는 카드를 고르세요.",
    "givens": null,
    "choices": [
      "잎의 표면에 붙어 있고 아직 애벌레가 나오지 않았다.",
      "배춧잎을 갉아 먹으며 잎 위를 기어 다녔다.",
      "한곳에 붙어 먹지 않았고 뒤에 나비가 나왔다.",
      "허물을 벗은 뒤 몸이 커지고 다시 잎을 먹었다.",
      "날개를 편 뒤 꽃 사이를 날아다니기 시작했다."
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
    "explanation": "번데기는 먹이를 먹거나 먹이를 찾아 돌아다니지 않으며 그 안에서 성충으로 변해요. 완전히 움직일 수 없다는 뜻은 아니에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v012",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "애벌레였을 때와 비교하여 성충이 된 배추흰나비에서 새로 뚜렷하게 관찰할 수 있는 모습은 무엇인가요?",
    "givens": null,
    "choices": [
      "배춧잎 위를 기어 다니며 잎을 갉아 먹는다.",
      "번데기 속에서 배춧잎을 계속 갉아 먹는다.",
      "알 속에서 날개를 펴고 꽃 사이를 날아다닌다.",
      "먹이를 먹으며 애벌레의 허물을 계속 벗는다.",
      "날개를 펼치고 꽃 사이를 날아다닌다."
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
    "explanation": "성충은 두 쌍의 날개를 펴서 날 수 있고, 긴 대롱 모양의 입으로 꽃의 꿀을 먹어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v013",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "관찰 일지의 빈칸에 들어갈 단계는 무엇인가요?",
    "givens": {
      "관찰 일지": "알에서 애벌레가 나왔다. → 애벌레가 잎을 먹고 자랐다. → [     ]에서 성충이 나왔다. → 성충이 알을 낳았다."
    },
    "choices": [
      "알",
      "번데기",
      "어린 새끼",
      "다 자란 성충",
      "새로 낳은 알"
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
    "explanation": "배추흰나비는 알에서 애벌레가 나오고 번데기를 거쳐 성충이 돼요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v014",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "자료에서 배추흰나비와 한살이 단계의 종류가 다른 곤충을 고르세요.",
    "givens": null,
    "choices": [
      "개미: 알 → 애벌레 → 번데기 → 성충",
      "모기: 알 → 애벌레 → 번데기 → 성충",
      "사마귀: 알 → 애벌레 → 성충",
      "파리: 알 → 애벌레 → 번데기 → 성충",
      "사슴벌레: 알 → 애벌레 → 번데기 → 성충"
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
    "explanation": "사마귀는 알→애벌레→성충으로 자라며 번데기 단계를 거치지 않아요. 다른 네 곤충은 번데기를 거쳐요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v015",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 배추흰나비가 번데기에서 성충으로 나왔습니다. 이동하는 방법에서 새로 할 수 있게 된 일을 한 가지 쓰세요.",
    "givens": {
      "관찰": [
        "번데기: 한곳에 붙어 지냈다.",
        "성충: 날개가 펼쳐졌다."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "날개로 날아다닐 수 있다.",
      "rubric": {
        "required": [
          "성충이 된 뒤 날 수 있게 됨"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "성충은 날개를 펼쳐 날아다닐 수 있어요. 몸을 움직이지 못하는 것이 아니라 번데기 때에는 먹이를 찾아 돌아다니지 않는다는 점과 비교해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v016",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "사육 상자의 먹이를 바꾸려 합니다. 자료에 따라 배추흰나비 애벌레에게 줄 수 있는 것을 두 개 고르세요. (정답 2개)",
    "givens": {
      "먹이 자료": [
        "배추흰나비 애벌레: 배추, 케일, 양배추, 무, 갓, 유채",
        "누에: 뽕잎",
        "호랑나비 애벌레: 산초나무 잎 등"
      ]
    },
    "choices": [
      "뽕잎",
      "갓의 잎",
      "산초나무 잎",
      "양배추 잎",
      "옥수수 잎"
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
    "explanation": "배추흰나비 애벌레에게는 케일·양배추·무·갓·유채처럼 알맞은 먹이를 준비해요. 누에나 호랑나비의 먹이를 그대로 쓰지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v017",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "배추흰나비를 관찰한 세 기록입니다. 허물을 벗으며 몸이 커진 시기는 언제인가요?",
    "givens": {
      "기록": [
        "㉠ 잎에 붙은 알에서 애벌레가 나왔다.",
        "㉡ 애벌레가 배춧잎을 먹으며 몸이 커졌다.",
        "㉢ 번데기가 된 뒤 그 속에서 성충이 나왔다."
      ]
    },
    "choices": [
      "알 속에 그대로 있던 ㉠ 시기",
      "번데기로 붙어 지내던 ㉢ 시기",
      "㉠과 ㉢ 두 시기",
      "배춧잎을 먹고 지내던 ㉡ 시기",
      "㉠·㉡·㉢ 모든 시기"
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
    "explanation": "알에서 나온 애벌레가 허물을 벗으며 자라요. 알이나 번데기가 먹이를 먹고 크게 자라는 것이 아니에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v018",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 두 관찰을 함께 보고 알 수 있는 허물벗기의 역할을 고르세요.",
    "givens": {
      "관찰 기록(모형 값)": [
        "허물을 벗기 전: 몸의 길이 8mm",
        "허물을 벗고 자란 뒤: 몸의 길이 12mm"
      ]
    },
    "choices": [
      "애벌레가 먹이를 먹지 않고 지내도록 한다.",
      "애벌레가 알로 다시 돌아가도록 한다.",
      "애벌레가 날개로 바로 날아가도록 한다.",
      "애벌레가 번데기를 건너뛰도록 한다.",
      "애벌레의 몸이 더 크게 자라도록 한다."
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
    "explanation": "딱딱한 겉껍질을 벗고 더 큰 몸으로 자라는 것이 허물벗기의 역할이에요. 숫자는 실제 측정 결과가 아닌 설명용 모형 값이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v019",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "관찰자가 먹이를 먹은 자리와 이동 흔적을 살폈습니다. 각 단계의 기록을 바르게 연결한 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "애벌레: 잎을 갉아 먹음 / 성충: 꽃 사이를 날아다님",
      "애벌레: 꽃 사이를 날아다님 / 번데기: 잎을 갉아 먹음",
      "알: 잎을 갉아 먹음 / 애벌레: 먹이를 먹지 않음",
      "번데기: 꽃 사이를 날아다님 / 성충: 알 속에 머묾",
      "성충: 잎 위를 기어 다니며 애벌레 허물을 벗음"
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
    "explanation": "애벌레는 잎을 먹으며 기어 다녀요. 번데기는 먹이를 먹거나 찾아다니지 않아요. 성충은 꽃 사이를 날며 꿀을 먹을 수 있어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v020",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 조사 자료에서 번데기 단계를 거치는 곤충을 서로 다른 세 종류 골라 쓰세요.",
    "givens": {
      "조사": [
        "모기: 알 → 애벌레 → 번데기 → 성충",
        "메뚜기: 알 → 애벌레 → 성충",
        "개미: 알 → 애벌레 → 번데기 → 성충",
        "잠자리: 알 → 애벌레 → 성충",
        "사슴벌레: 알 → 애벌레 → 번데기 → 성충",
        "사마귀: 알 → 애벌레 → 성충"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "모기, 개미, 사슴벌레",
      "rubric": {
        "required": [
          "자료의 모기·개미·사슴벌레를 서로 다른 세 종류로 고름"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "모기·개미·사슴벌레의 조사 기록에는 모두 번데기 단계가 있어요. 메뚜기·잠자리·사마귀는 번데기를 거치지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v021",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "사진 대신 쓴 두 관찰 기록입니다. ㉠과 ㉡에 해당하는 한살이 단계의 이름을 순서대로 쓰세요.",
    "givens": {
      "기록": [
        "㉠ 날개를 펴고 꽃 사이를 날아다녔다.",
        "㉡ 배춧잎을 갉아 먹으며 기어 다녔다."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "성충, 애벌레",
      "accepted": [
        "성충, 애벌레",
        "성충, 유충",
        "㉠ 성충 ㉡ 애벌레",
        "㉠ 성충 ㉡ 유충",
        "㉠: 성충, ㉡: 애벌레"
      ]
    },
    "explanation": "날개를 펴고 날아다니는 것은 성충, 잎을 먹으며 기어 다니는 것은 애벌레예요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v022",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "두 배추흰나비 관찰 카드의 먹이와 이동 방법을 비교하여 쓰세요.",
    "givens": {
      "기록": [
        "㉠ 초록색 몸이었고 먹이로 준 배춧잎에 갉아 먹은 자리가 남았다.",
        "㉡ 긴 대롱 모양의 입이 꽃 안으로 들어갔고 펼친 날개가 보였다."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "㉠은 잎을 먹으며 기어 다니고, ㉡은 꽃의 꿀을 먹으며 날아다닌다.",
      "rubric": {
        "required": [
          "㉠의 잎 먹기와 ㉡의 꿀 먹기를 비교함",
          "㉠의 기어 다니기와 ㉡의 날기를 비교함"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "애벌레는 잎을 먹으며 기어 다니고 성충은 긴 입으로 꿀을 먹으며 날아다닐 수 있어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v023",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T04",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 두 모습을 한 개체의 시간에 따른 변화로 연결하여 설명하세요.",
    "givens": {
      "자료": [
        "㉠ 한곳에 붙어 먹이를 먹지 않는 번데기",
        "㉡ 번데기 껍질 밖으로 나와 날개를 편 성충"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "㉠의 번데기에서 ㉡의 성충이 나온다.",
      "rubric": {
        "required": [
          "번데기에서 성충으로 변하는 방향을 설명함"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "번데기가 변하여 성충인 나비가 나와요. 날개가 있던 성충이 다시 번데기로 돌아가는 것은 아니에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v024",
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
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "조사 기록에서 나비와 한살이 단계의 종류가 같은 곤충 두 종류를 골라 이름을 쓰세요.",
    "givens": {
      "조사": [
        "나비: 번데기 단계를 거침",
        "잠자리: 번데기 단계를 거치지 않음",
        "모기: 번데기 단계를 거침",
        "사마귀: 번데기 단계를 거치지 않음",
        "사슴벌레: 번데기 단계를 거침"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "모기, 사슴벌레",
      "accepted": [
        "모기, 사슴벌레",
        "사슴벌레, 모기",
        "모기와 사슴벌레",
        "사슴벌레와 모기"
      ]
    },
    "explanation": "나비와 같이 번데기 단계를 거치는 것은 모기와 사슴벌레예요. 제시한 다른 두 곤충은 번데기 단계를 거치지 않아요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v025",
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
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T05",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "‘알→애벌레→번데기→성충’과 ‘알→애벌레→성충’을 두 무리로 나누었습니다. 나누는 기준을 설명하세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "번데기 단계를 거치는지로 나눈다.",
      "rubric": {
        "required": [
          "번데기 단계를 거치는지의 차이를 설명함"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "두 한살이 과정은 번데기 단계가 있는지 없는지가 달라요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v026",
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
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T03",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "관찰 기록에 ‘애벌레가 살아 있다’만 쓰여 있습니다. 한살이의 변화를 더 잘 알 수 있도록 추가할 관찰 내용 한 가지를 제안하세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "날짜별로 애벌레가 허물을 벗고 커지는 모습을 기록한다.",
      "rubric": {
        "required": [
          "한살이 변화를 알아볼 수 있는 구체적인 관찰 내용 한 가지"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "날짜에 따라 허물을 벗는 모습, 크기가 커지는 모습, 번데기로 변하는 모습 등을 기록하면 한살이의 변화를 알 수 있어요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v027",
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
      "grade": 3,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E2",
      "type": "T03",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "사육 상자를 열어 둔 채 성충이 나오는 모습을 관찰하려 합니다. 위쪽에 통풍되는 망을 씌워 고정하면 어떤 점이 좋을지 한 가지 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "성충이 밖으로 날아가는 것을 막을 수 있다.",
      "rubric": {
        "required": [
          "망을 고정하여 탈출이나 외부 해충의 침입을 막는 이점 한 가지"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "망을 고정하면 성충이 상자 밖으로 날아가는 것을 막거나 기생벌 등이 들어오는 것을 줄일 수 있어요. 작은 빈틈도 살펴야 해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v028",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "한 학기 안에 교실에서 씨앗부터 다음 씨앗까지 직접 관찰하려 합니다. 대상을 고르는 데 맞지 않는 기준 두 개를 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "돌볼 수 있는 크기인지 알아본다.",
      "정한 관찰 기간 안에 꽃과 열매를 볼 수 있는지 살핀다.",
      "교실 문을 통과하지 못할 만큼 큰 식물을 우선 고른다.",
      "씨앗과 기르는 방법을 쉽게 구할 수 있는지 알아본다.",
      "관찰이 끝나도 싹이 트지 않을 만큼 오래 걸리는 것을 고른다."
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
    "explanation": "구하기 쉽고 돌볼 수 있으며 정한 기간 안에 변화를 관찰하기 좋은 식물을 골라요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v029",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물이 자람에 미치는 영향만 알아보려 합니다. 현재 계획에서 바르게 고친 것은 무엇인가요?",
    "givens": {
      "현재 계획": "같은 크기의 강낭콩 두 포기를 같은 화분에 각각 심었다. 하나는 햇빛이 드는 곳, 하나는 그늘에 두고 물의 양도 다르게 하려 한다."
    },
    "choices": [
      "햇빛이 다른 곳에 둔 채 두 화분에 같은 양의 물을 준다.",
      "화분 크기를 다르게 하고 주는 물의 양도 다르게 한다.",
      "두 식물의 종류를 바꾸고 물을 주는 양도 다르게 한다.",
      "두 화분은 같은 곳에 두고 물을 주는 양만 다르게 한다.",
      "물을 준 화분은 밝은 곳에, 안 준 화분은 어두운 곳에 둔다."
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
    "explanation": "물의 영향을 알아보려면 주는 물만 다르게 하고 햇빛과 식물·화분 등의 조건은 같게 해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v030",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 크기의 강낭콩에 주는 물만 다르게 했습니다. 기록을 바르게 해석한 것을 고르세요.",
    "givens": {
      "관찰": [
        "㉠ 알맞게 물을 줌: 잎과 줄기가 싱싱함",
        "㉡ 물을 주지 않음: 잎과 줄기가 축 처짐",
        "그 밖의 조건은 같게 함"
      ]
    },
    "choices": [
      "물을 주지 않아야 강낭콩이 더 싱싱하게 자란다.",
      "강낭콩이 싱싱하게 자라는 데 물이 필요하다.",
      "물은 강낭콩이 자라는 데 아무런 영향을 주지 않는다.",
      "물을 준 강낭콩이 시들고 안 준 강낭콩이 싱싱하다.",
      "물만 주면 햇빛을 비교하는 실험까지 끝난 것이다."
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
    "explanation": "다른 조건을 같게 하고 물만 다르게 주었을 때 나타난 차이는 물의 영향을 알아보는 근거가 돼요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v031",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 강낭콩 한 포기의 자람을 여러 주 동안 알아보려고 합니다. 시간에 따른 변화를 비교할 수 있는 기록 네 개를 고르세요. (정답 4개)",
    "givens": null,
    "choices": [
      "날짜별 줄기의 길이",
      "날짜별 잎의 수",
      "날짜별 가지의 수",
      "꽃잎 한 장의 색 이름",
      "날짜별 같은 꼬투리의 길이"
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        1,
        2,
        4
      ]
    },
    "explanation": "같은 개체의 줄기 길이·잎 수·가지 수·꼬투리 길이를 날짜별로 기록하면 자람을 비교할 수 있어요. 꽃잎 한 장의 색 이름만 적는 것은 자란 정도를 재는 방법이 아니에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v032",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "강낭콩 관찰 일지의 앞뒤 기록을 비교했습니다. 자료로 확인되는 변화 세 개를 고르세요. (정답 3개)",
    "givens": {
      "앞 기록(모형 값)": "줄기 15cm, 꼬투리 1개, 꽃망울 2개",
      "뒤 기록(모형 값)": "줄기 20cm, 꼬투리 3개, 꽃망울 4개"
    },
    "choices": [
      "줄기가 길어졌다.",
      "줄기가 짧아졌다.",
      "꼬투리의 수가 늘었다.",
      "꽃망울이 모두 없어졌다.",
      "꽃망울의 수가 늘었다."
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        2,
        4
      ]
    },
    "explanation": "제시한 앞뒤 기록에서는 줄기가 길어지고 꼬투리와 꽃망울의 수가 늘었어요. 이 기록의 수는 설명을 위해 정한 모형 값이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v033",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "강낭콩을 씨앗부터 관찰한 결과에 맞는 설명 두 개를 고르세요. (정답 2개)",
    "givens": {
      "관찰 순서": "강낭콩 씨앗 → 싹 → 잎과 줄기 → 꽃 → 꼬투리 속의 새 강낭콩 씨앗"
    },
    "choices": [
      "마지막 씨앗은 한살이가 이어지는 것과 관계없다.",
      "새 씨앗에서 다음 강낭콩이 자라 대를 이을 수 있다.",
      "꽃과 열매를 만드는 순서는 모든 생물에게 똑같다.",
      "새 씨앗은 처음 심은 강낭콩 씨앗과 생김새가 비슷하다.",
      "같은 종류의 강낭콩을 키워도 다음에는 다른 식물이 된다."
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
    "explanation": "처음 씨앗에서 자란 강낭콩이 새 씨앗을 만들고, 그 씨앗에서 다음 강낭콩이 자라며 대를 이어 가요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v034",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물을 주는 것이 식물의 자람에 영향을 주는지 알아보려 합니다. 비교할 두 화분의 기호를 쓰고, 그 둘을 고른 이유를 쓰세요.",
    "givens": {
      "표": {
        "머리": [
          "화분",
          "햇빛",
          "물"
        ],
        "행": [
          [
            "㉠",
            "잘 받음",
            "알맞게 줌"
          ],
          [
            "㉡",
            "잘 받음",
            "주지 않음"
          ],
          [
            "㉢",
            "가림",
            "알맞게 줌"
          ]
        ]
      },
      "조건": "같은 크기의 강낭콩·흙·화분을 사용했다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "㉠과 ㉡, 햇빛은 같고 물만 다르기 때문이다.",
      "rubric": {
        "required": [
          "㉠과 ㉡을 고름",
          "햇빛을 같게 하고 물만 다르게 하는 비교임을 설명함"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "물만 다른 ㉠과 ㉡을 비교해야 해요. 햇빛까지 함께 달라지는 화분을 비교하면 무엇의 영향인지 알기 어려워요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v035",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E3",
      "type": "T06",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "씨앗에서 싹이 잘 튼 접시의 기호를 쓰고, 다른 접시와 비교하여 싹트는 데 필요한 조건 두 가지를 쓰세요.",
    "givens": {
      "표(모형 값)": {
        "머리": [
          "접시",
          "솜의 상태",
          "두는 곳",
          "싹이 튼 씨앗 수"
        ],
        "행": [
          [
            "㉠",
            "마른 솜",
            "실내",
            "0개"
          ],
          [
            "㉡",
            "물에 적신 솜",
            "차가운 냉장고",
            "0개"
          ],
          [
            "㉢",
            "물에 적신 솜",
            "실내",
            "8개"
          ]
        ]
      },
      "같게 한 조건": "같은 종류와 상태의 씨앗을 접시마다 10개씩 두고 같은 기간 관찰했다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "㉢, 알맞은 물과 온도가 필요하다.",
      "rubric": {
        "required": [
          "싹이 잘 튼 접시 ㉢을 고름",
          "싹트는 데 필요한 물과 알맞은 온도 두 조건을 설명함"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "물과 온도가 알맞은 ㉢에서 잘 싹텄어요. 물이 없거나 온도가 너무 낮으면 잘 싹트지 않아요. 실제 측정 수가 아닌 모형 값이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v036",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E4",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 강낭콩 줄기의 길이를 날짜 간격을 같게 하여 측정했습니다. 앞부분과 뒷부분의 자라는 모습을 비교해 쓰세요.",
    "givens": {
      "줄기의 길이(모형 값)": [
        "첫째 주: 6cm",
        "둘째 주: 11cm",
        "셋째 주: 17cm",
        "넷째 주: 17cm",
        "다섯째 주: 17cm"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "처음에는 줄기가 길어졌지만 뒤에는 같은 길이를 유지했다.",
      "rubric": {
        "required": [
          "처음에는 길이가 늘고 나중에는 같은 길이를 유지한 변화를 설명함"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "이 기록에서는 처음에 길이가 늘고 나중에는 같게 유지돼요. 이 식물의 해당 관찰 기간의 기록이며 꽃이 핀 모든 식물의 줄기가 멈춘다는 뜻은 아니에요. 수는 모형 값이에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v037",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E4",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "토마토 관찰 카드를 씨앗부터 시간 순서대로 쓰고, 제시한 봉숭아와 한살이의 공통점 한 가지를 쓰세요.",
    "givens": {
      "카드": [
        "㉠ 씨앗에서 싹이 나왔다.",
        "㉡ 잘 익은 열매 안에 새 씨앗이 있었다.",
        "㉢ 씨앗을 심었다.",
        "㉣ 잎과 줄기가 자랐다.",
        "㉤ 꽃이 피고 그 자리에 열매가 자라기 시작했다."
      ],
      "봉숭아 자료": "씨앗 → 싹 → 잎과 줄기 → 꽃 → 열매와 새 씨앗"
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "㉢-㉠-㉣-㉤-㉡. 둘 다 새 씨앗을 만들어 대를 잇는다.",
      "rubric": {
        "required": [
          "시간 순서를 ㉢-㉠-㉣-㉤-㉡으로 정함",
          "싹이 트고 자라거나 꽃·열매·새 씨앗으로 이어지는 공통 과정 한 가지를 설명함"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "토마토 자료는 ㉢→㉠→㉣→㉤→㉡ 순서예요. 두 식물 모두 싹이 터서 자라고 꽃과 열매를 거쳐 새 씨앗으로 대를 이어 가요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v038",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "‘물을 주는 양이 강낭콩의 자람에 영향을 줄까?’를 알아보려고 합니다. 실험하기 전에 세울 수 있는 가설 한 가지를 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "물을 알맞게 준 강낭콩이 물을 주지 않은 강낭콩보다 더 싱싱하게 자랄 것이다.",
      "rubric": {
        "required": [
          "주는 물의 양과 강낭콩의 자람을 연결한 검증 가능한 예상"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "가설은 실험으로 알아볼 수 있는 예상이에요. 물을 주는 양과 강낭콩의 자람을 연결하면 되며, 결과를 미리 맞혀야 하는 문제는 아니에요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v039",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "햇빛이 강낭콩의 자람에 미치는 영향을 실험하려 합니다. 다르게 할 조건과 같게 할 조건 한 가지를 짝지어 쓰세요.",
    "givens": {
      "준비": "강낭콩 두 포기, 화분 두 개, 흙, 햇빛 가리개, 물"
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "햇빛은 다르게 하고 주는 물의 양은 같게 한다.",
      "rubric": {
        "required": [
          "햇빛을 다르게 함",
          "물·식물·화분·흙 등 타당한 조건 한 가지를 같게 함"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "햇빛만 다르게 하고 물을 주는 양·시기, 식물의 크기·종류, 화분·흙 등은 같게 해야 해요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v040",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E3",
      "type": "T07",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "온도가 씨앗의 싹트기에 미치는 영향만 알아보려 합니다. 다음 계획에서 물을 주는 방법을 어떻게 고쳐야 할까요?",
    "givens": {
      "계획": "같은 씨앗을 같은 접시에 놓고 하나는 실내, 하나는 냉장고에 둔다. 실내 접시의 솜에만 물을 주고 냉장고 접시의 솜에는 물을 주지 않는다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "두 접시의 솜에 같은 양의 물을 알맞게 준다.",
      "rubric": {
        "required": [
          "두 접시 모두에 물을 같은 양으로 주도록 고침"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "온도의 영향을 알아보려면 물은 두 접시에 똑같이 알맞게 주어야 해요. 물과 온도를 동시에 다르게 하면 원인을 구별하기 어려워요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s31-u04-v041",
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
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E4",
      "type": "T08",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 강낭콩 한 포기가 얼마나 자랐는지 계속 알아보려 합니다. 알맞지 않은 방법을 제안한 모둠 세 곳의 번호와 각각의 이유를 쓰세요.",
    "givens": {
      "제안": [
        "1모둠: 마지막 날에 다른 화분과 키를 한 번만 비교한다.",
        "2모둠: 날마다 자란 잎을 모두 떼어 모아 둔다.",
        "3모둠: 같은 줄기 길이를 날짜별로 적는다.",
        "4모둠: 마지막 날 사진만 찍고 전의 모습은 남기지 않는다.",
        "5모둠: 같은 포기의 잎 수를 날짜별로 적는다."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "1모둠은 다른 화분과 한 번 비교해 내 식물의 변화를 알 수 없다. 2모둠은 잎을 떼면 계속 자라는 모습을 볼 수 없다. 4모둠은 전의 기록이 없어 비교할 수 없다.",
      "rubric": {
        "required": [
          "1모둠과 다른 화분의 한 번 비교로 시간에 따른 자람을 알 수 없는 이유를 연결함",
          "2모둠과 잎을 떼어 계속 관찰할 수 없는 이유를 연결함",
          "4모둠과 이전 기록이 없어 변화를 비교할 수 없는 이유를 연결함"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "같은 개체의 자람을 알려면 그 개체를 날짜별로 계속 기록해야 해요. 다른 화분과 한 번 비교하거나, 잎을 떼어 내거나, 마지막 사진만 찍으면 변화량을 제대로 알기 어려워요.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-17",
      "gates": [
        "science",
        "answer"
      ]
    }
  }
];
