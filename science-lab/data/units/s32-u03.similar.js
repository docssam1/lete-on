// 3-2 Ⅲ 지표의 변화 — 유사문항 70 (창작). 원문 1문항당 1개, 같은 유형·난이도로 상황과 물체를 바꿨다. of = 짝이 되는 원문 (세트, 번호).
export const similar = [
  {
    "id": "s32-u03-v001",
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
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "어느 학교의 화단과 운동장에서 흙을 떠 와 관찰하고 기록했어요. 관찰 내용을 잘못 적은 것을 고르세요. (각 보기는 「화단 흙 / 운동장 흙」 순서예요.)",
    "givens": null,
    "choices": [
      "알갱이 크기 – 모두 굵고 고름 / 크고 작은 것이 섞임",
      "손으로 쥐었다 펴면 – 모양이 남음 / 쉽게 흩어짐",
      "물에 넣고 저으면 – 뜨는 것이 많음 / 뜨는 것이 거의 없음",
      "만졌을 때 – 약간 부드러움 / 거칠거칠함",
      "색깔 – 어두운 갈색 / 밝은 갈색"
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
    "explanation": "알갱이 크기가 다양한 것은 화단 흙이고, 운동장 흙은 알갱이가 비교적 커요. 이 줄은 두 흙의 특징을 서로 바꾸어 적었어요.",
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
    "id": "s32-u03-v002",
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
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "놀이터의 굵은 모래와 텃밭의 고운 흙을 같은 양씩 두 장치에 담고, 같은 양의 물을 동시에 부었어요. 같은 시간 동안 아래 컵에 물이 더 많이 모이는 쪽을 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "놀이터 모래",
      "accepted": [
        "놀이터 모래",
        "놀이터모래",
        "놀이터",
        "모래",
        "굵은 모래",
        "놀이터의 굵은 모래"
      ]
    },
    "explanation": "알갱이가 굵은 모래는 알갱이 사이 틈이 커서 물이 빨리 빠져요. 그래서 같은 시간 동안 물이 더 많이 모여요.",
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
    "id": "s32-u03-v003",
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
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "숲속 땅에서 낙엽을 걷어 내니 아래에 검고 부슬부슬한 물질이 있었어요. 낙엽과 죽은 벌레 등이 오랫동안 썩어서 만들어진 이 물질을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 모래",
        "ㄴ. 자갈",
        "ㄷ. 진흙",
        "ㄹ. 부식물"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄹ",
      "accepted": [
        "ㄹ",
        "부식물"
      ]
    },
    "explanation": "나뭇잎이나 죽은 생물이 오랫동안 썩어 만들어진 것을 부식물이라고 해요. 부식물은 식물이 잘 자라도록 도와요.",
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
    "id": "s32-u03-v004",
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
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "반듯한 각설탕 여러 개를 뚜껑 있는 통에 넣고 세게 흔들었어요. 각설탕의 모습이 변하는 순서대로 <보기>의 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 모서리가 깨져 조금 작아진 각설탕과 약간의 가루",
        "ㄴ. 반듯한 네모 모양의 각설탕",
        "ㄷ. 거의 다 부서져 고운 가루가 된 설탕"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ → ㄱ → ㄷ",
      "accepted": [
        "ㄴ → ㄱ → ㄷ",
        "ㄴ→ㄱ→ㄷ",
        "ㄴ, ㄱ, ㄷ",
        "ㄴㄱㄷ"
      ]
    },
    "explanation": "각설탕은 서로 부딪치며 모서리부터 깨지고, 점점 작아져 나중에는 가루가 돼요. 바위가 부서져 작아지는 모습과 같아요.",
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
    "id": "s32-u03-v005",
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
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "빈칸에 공통으로 들어갈 알맞은 말을 쓰세요.",
    "givens": {
      "지문": "• 산의 큰 바위가 오랜 세월 동안 물과 나무뿌리 때문에 조금씩 부서져 작은 알갱이가 되고, 여기에 낙엽 등이 썩은 물질이 섞이면 □(이)가 됩니다.\n• □(은)는 아주 오랜 시간에 걸쳐 조금씩 쌓이므로 한번 쓸려 가면 되찾기 어렵습니다."
    },
    "choices": null,
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
    "explanation": "바위가 오랜 시간 동안 부서진 작은 알갱이에 생물이 썩은 물질이 섞여 흙이 돼요. 그래서 흙은 아주 천천히 만들어져요.",
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
    "id": "s32-u03-v006",
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
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "쟁반에 흙 언덕을 만들고 언덕 위쪽에서 물뿌리개로 물을 천천히 부었어요. 언덕 아래쪽(쟁반 바닥과 만나는 곳)에서 볼 수 있는 변화로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "흙이 깊게 깎여 큰 홈이 생깁니다.",
      "처음 모습에서 아무 변화가 없습니다.",
      "아래쪽 흙이 위쪽으로 거슬러 올라갑니다.",
      "위쪽에서 흘러 내려온 흙이 많이 쌓입니다.",
      "흙이 물에 녹아 모두 사라집니다."
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
    "explanation": "흐르는 물은 언덕 위쪽의 흙을 깎아 아래쪽으로 옮겨 쌓아요. 그래서 아래쪽에는 흙이 많이 쌓여요.",
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
    "id": "s32-u03-v007",
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
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "흙 언덕 꼭대기에 색 모래를 뿌리고 물을 흘려보낸 뒤 정리한 글이에요. 괄호 ㉠과 ㉡에 들어갈 알맞은 말을 골라 각각 쓰세요.\n「꼭대기에 뿌린 색 모래가 그 자리에서 거의 없어진 것은 ㉠( 침식, 퇴적 ) 작용 때문이고, 쟁반 바닥 가까이에 색 모래가 모여 있는 것은 ㉡( 침식, 퇴적 ) 작용 때문이에요.」",
    "givens": null,
    "choices": null,
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
    "explanation": "꼭대기에서는 흐르는 물이 흙과 모래를 깎아 내고(침식), 아래쪽에서는 옮겨 온 흙과 모래가 쌓여요(퇴적).",
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
    "id": "s32-u03-v008",
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
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "괄호에 들어갈 알맞은 말을 골라 쓰세요.\n「큰비가 내린 뒤 산비탈의 흙이 빗물에 깎여 ( 산꼭대기, 산 아래 ) 쪽 논밭으로 옮겨져 쌓였어요.」",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "산 아래",
      "accepted": [
        "산 아래",
        "산아래",
        "아래",
        "산 아래 쪽",
        "산 아래쪽"
      ]
    },
    "explanation": "흐르는 물은 흙을 깎아 낮은 곳으로 옮겨 쌓아요. 그래서 깎인 흙은 산 아래 논밭에 쌓여요.",
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
    "id": "s32-u03-v009",
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
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "강을 따라 내려가며 여러 곳을 관찰했어요. 침식 작용보다 퇴적 작용이 더 활발하게 일어나는 곳을 고르세요.",
    "givens": null,
    "choices": [
      "깊은 산속 계곡, 물살이 빠르고 모난 바위가 많은 곳",
      "바다 가까운 들판, 강폭이 넓고 고운 모래가 쌓인 곳",
      "산 중턱 골짜기, 경사가 급해 작은 폭포가 있는 곳",
      "높은 산 위쪽, 강폭이 좁고 큰 돌이 굴러다니는 곳",
      "산골짜기 입구, 물이 바위를 세차게 깎아 내는 곳"
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
    "explanation": "강 하류는 강폭이 넓고 경사가 완만해 물살이 느려져요. 그래서 실려 온 모래와 흙이 쌓이는 퇴적 작용이 활발해요.",
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
    "id": "s32-u03-v010",
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
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "바다로 흘러드는 곳 가까이의 강(강 하류)에서 볼 수 있는 모습을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "좁은 계곡 사이로 물살이 아주 빠르게 흐릅니다.",
      "넓고 평평한 들판이 펼쳐져 있습니다.",
      "모난 큰 바위와 돌이 강바닥에 많습니다.",
      "강가에 고운 모래와 흙이 넓게 쌓여 있습니다.",
      "경사가 급해 물이 폭포처럼 떨어집니다."
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
    "explanation": "강 하류는 경사가 완만하고 강폭이 넓어 들판이 펼쳐지고, 고운 모래와 흙이 쌓여 있어요.",
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
    "id": "s32-u03-v011",
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
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "바닷가에 바다 쪽으로 툭 튀어나온 바위 언덕과 육지 쪽으로 쏙 들어간 바닷가가 있어요. 바닷물의 침식 작용이 더 활발한 곳과 그곳의 모습을 바르게 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "바다 쪽으로 튀어나온 곳 – 고운 모래가 쌓여 있습니다.",
      "육지 쪽으로 들어간 곳 – 가파른 절벽이 보입니다.",
      "육지 쪽으로 들어간 곳 – 넓은 갯벌이 펼쳐져 있습니다.",
      "두 곳 모두 – 바닷물의 작용이 일어나지 않습니다.",
      "바다 쪽으로 튀어나온 곳 – 가파른 절벽이 보입니다."
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
    "explanation": "바다 쪽으로 튀어나온 곳은 파도가 세게 부딪쳐 바위가 깎여 절벽이 생겨요. 육지 쪽으로 들어간 곳은 모래나 흙이 쌓여요.",
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
    "id": "s32-u03-v012",
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
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "바닷물의 침식 작용으로 만들어진 지형을 <보기>에서 모두 골라 기호를 쓰세요. (정답 2개)",
    "givens": {
      "보기": [
        "ㄱ. 바위 아랫부분이 파도에 파여 생긴 바닷가 동굴",
        "ㄴ. 물이 빠지면 조개를 캘 수 있는 진흙 갯벌",
        "ㄷ. 맨발로 걷기 좋은 고운 모래사장",
        "ㄹ. 파도가 부딪치는 가파른 바위 절벽"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ, ㄹ",
      "accepted": [
        "ㄱ, ㄹ",
        "ㄱㄹ",
        "ㄱ,ㄹ",
        "ㄹ, ㄱ",
        "ㄹ,ㄱ"
      ]
    },
    "explanation": "동굴과 절벽은 파도가 바위를 깎아 만든 침식 지형이에요. 갯벌과 모래사장은 바닷물이 흙과 모래를 쌓아 만든 퇴적 지형이에요.",
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
    "id": "s32-u03-v013",
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
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 바닷가인데도 어떤 곳은 모래사장이고, 어떤 곳은 가파른 절벽이에요. 그 까닭으로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "사람들이 바닷가마다 모래를 다르게 부어 놓았기 때문입니다.",
      "바닷물이 얼었다 녹으며 모든 바닷가를 평평하게 하기 때문입니다.",
      "파도가 센 곳은 깎이고, 약한 곳은 쌓이기 때문입니다.",
      "바람이 불지 않는 바닷가에서만 지형이 생기기 때문입니다.",
      "바닷가 지형은 처음 모습 그대로 변하지 않기 때문입니다."
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
    "explanation": "파도가 세게 치는 곳은 침식 작용으로 절벽이 생기고, 파도가 약하게 밀려오는 곳은 퇴적 작용으로 모래사장이 생겨요.",
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
    "id": "s32-u03-v014",
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
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "비가 많이 오는 여름에 학교 뒤 비탈의 흙이 쓸려 내려가지 않게 하는 방법으로 알맞은 것을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "비탈에 잔디를 심어 흙을 덮어 줍니다.",
      "비탈의 풀을 모두 뽑아 흙이 잘 보이게 합니다.",
      "비탈을 더 가파르게 깎아 냅니다.",
      "비탈 위에 물길을 내어 물이 흙 위로 흐르게 합니다.",
      "비탈에 흙을 붙잡는 그물망을 덮어 줍니다."
    ],
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
    "explanation": "풀이 흙을 덮거나 그물망 같은 시설물이 흙을 붙잡으면 빗물이 흙을 깎아 가지 못해요.",
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
    "id": "s32-u03-v015",
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
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "산비탈에 나무를 심고 풀씨를 뿌리는 것은 흐르는 물의 어떤 작용으로부터 흙을 지키기 위해서인지 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 퇴적 작용",
        "ㄴ. 침식 작용",
        "ㄷ. 운반 작용"
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
        "침식 작용",
        "침식"
      ]
    },
    "explanation": "나무와 풀은 뿌리로 흙을 붙잡고 잎으로 흙을 덮어, 흐르는 물이 흙을 깎아 내는 침식 작용을 막아요.",
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
    "id": "s32-u03-v016",
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
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "화단 흙을 운동장 흙과 비교한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "화단 흙이 운동장 흙보다 색깔이 더 어둡습니다.",
      "화단 흙이 운동장 흙보다 더 거칠거칠합니다.",
      "화단 흙은 운동장 흙보다 잘 뭉쳐지지 않습니다.",
      "화단 흙은 물에 뜨는 물질이 거의 없습니다.",
      "화단 흙은 알갱이가 모두 굵고 크기가 고릅니다."
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
    "explanation": "화단 흙은 부식물이 많아 어두운 갈색이고, 약간 부드럽고 잘 뭉쳐져요.",
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
    "id": "s32-u03-v017",
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
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "놀이터 모래와 텃밭 흙의 물 빠짐을 비교하는 실험을 하려고 해요. 다르게 해야 하는 조건을 고르세요.",
    "givens": null,
    "choices": [
      "붓는 물의 양",
      "흙을 담는 통의 크기",
      "물을 붓고 기다리는 시간",
      "흙의 종류",
      "흙의 양"
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
    "explanation": "흙에 따라 물 빠짐이 다른지 알아보는 실험이므로 흙의 종류만 다르게 하고, 나머지 조건은 모두 같게 해요.",
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
    "id": "s32-u03-v018",
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
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 크기의 깔때기 두 개에 텃밭 흙과 놀이터 모래를 같은 양씩 담고 같은 양의 물을 동시에 부었어요. 1분 동안 아래 컵에 모인 물이 더 적은 쪽은 어느 것인지 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "텃밭 흙",
      "accepted": [
        "텃밭 흙",
        "텃밭흙",
        "텃밭"
      ]
    },
    "explanation": "텃밭 흙은 놀이터 모래보다 알갱이가 작아 물이 천천히 빠져요. 그래서 같은 시간 동안 모인 물이 더 적어요.",
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
    "id": "s32-u03-v019",
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
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "굵은 모래가 고운 흙보다 물이 더 빨리 빠지는 까닭을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 굵은 모래는 색깔이 더 밝기 때문입니다.",
        "ㄴ. 굵은 모래는 알갱이가 커서 알갱이 사이 틈이 크기 때문입니다.",
        "ㄷ. 굵은 모래에는 부식물이 많이 섞여 있기 때문입니다.",
        "ㄹ. 굵은 모래는 만지면 더 부드럽기 때문입니다."
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
    "explanation": "굵은 모래는 알갱이가 커서 알갱이 사이 틈이 크고, 물이 그 틈으로 빨리 빠져나가요.",
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
    "id": "s32-u03-v020",
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
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "두 흙을 물이 든 비커에 넣고 저은 뒤 잠시 놓아두었더니, (가) 비커에는 뿌리 조각과 나뭇잎 조각이 많이 떴고 (나) 비커에는 뜬 것이 거의 없었어요. (가)와 (나) 중 화단 흙으로 볼 수 있는 것을 골라 쓰세요.",
    "givens": null,
    "choices": null,
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
    "explanation": "화단 흙에는 생물이 썩어 생긴 부식물이 많이 섞여 있어서 물에 뜨는 물질이 많아요.",
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
    "id": "s32-u03-v021",
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
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "자연에서 흙이 만들어지는 과정에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "바위는 아주 단단해서 오랜 시간이 지나도 부서지지 않습니다.",
      "바위틈에서 자라는 나무뿌리도 바위를 부서뜨립니다.",
      "흙은 작은 모래알이 서로 뭉쳐서 하루 만에 만들어집니다.",
      "흙에는 바위 알갱이만 있고 생물이 썩은 물질은 없습니다.",
      "바위는 사람이 망치로 깰 때에만 작게 부서집니다."
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
    "explanation": "바위는 물, 바람, 얼음, 나무뿌리 등 여러 가지 까닭으로 오랜 시간에 걸쳐 부서지고, 생물이 썩은 물질과 섞여 흙이 돼요.",
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
    "id": "s32-u03-v022",
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
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "모래로 언덕을 쌓고 꼭대기에 빨간 색 모래를 뿌린 뒤, 꼭대기에서 물을 천천히 흘려보냈어요. 잠시 뒤 볼 수 있는 모습으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "아래쪽 모래가 꼭대기로 올라가 쌓입니다.",
      "물이 닿은 모래는 녹아서 모두 없어집니다.",
      "언덕의 높이와 모양이 처음과 똑같습니다.",
      "꼭대기에 모래가 더 높이 쌓여 뾰족해집니다.",
      "빨간 색 모래가 언덕 아래쪽에서 발견됩니다."
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
    "explanation": "흐르는 물이 꼭대기의 모래를 깎아 아래로 옮겨 쌓아요. 그래서 빨간 색 모래가 아래쪽에서 보여요.",
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
    "id": "s32-u03-v023",
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
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "장마철 냇물을 관찰하고 쓴 글이에요. 빈칸 ㉠~㉢에 들어갈 알맞은 말을 각각 쓰세요.\n「깎인 흙이 빠른 물살에 실려 아래쪽으로 옮겨지는 것을 ㉠ 작용, 옮겨진 흙이 물살이 느린 곳에 내려앉는 것을 ㉡ 작용, 냇물이 냇가의 흙과 돌을 깎아 내는 것을 ㉢ 작용이라고 해요.」",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-운반, ㉡-퇴적, ㉢-침식",
      "accepted": [
        "㉠-운반, ㉡-퇴적, ㉢-침식",
        "㉠ 운반, ㉡ 퇴적, ㉢ 침식",
        "운반, 퇴적, 침식",
        "운반 퇴적 침식",
        "운반,퇴적,침식"
      ]
    },
    "explanation": "깎는 것은 침식, 옮기는 것은 운반, 쌓는 것은 퇴적 작용이에요. 이 글은 순서를 바꾸어 물었어요.",
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
    "id": "s32-u03-v024",
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
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "강폭이 좁고 강의 경사가 급한 곳에서 볼 수 있는 모습을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "넓은 들판에 고운 흙이 쌓여 있습니다.",
      "강물이 아주 느리게 흐릅니다.",
      "모난 큰 바위가 많습니다.",
      "바다와 만나는 곳에 모래가 넓게 쌓입니다.",
      "바위와 흙이 깎이는 작용이 활발합니다."
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
    "explanation": "강폭이 좁고 경사가 급한 곳은 강 상류예요. 물살이 빨라 침식 작용이 활발하고 큰 바위가 많아요.",
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
    "id": "s32-u03-v025",
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
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 모습을 주로 볼 수 있는 곳은 강 상류와 강 하류 중 어디인지 쓰세요.",
    "givens": {
      "지문": "• 물살이 빠르고 계곡이 깊습니다.\n• 크고 모난 바위가 많습니다.\n• 퇴적 작용보다 침식 작용이 활발합니다."
    },
    "choices": null,
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
    "explanation": "물살이 빠르고 계곡이 깊으며 모난 바위가 많은 곳은 강 상류예요. 강 상류에서는 침식 작용이 활발해요.",
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
    "id": "s32-u03-v026",
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
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "바닷물이 바위를 깎아서 만든 지형끼리 바르게 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "갯벌, 모래사장",
      "갯벌, 절벽",
      "절벽, 구멍 뚫린 바위",
      "모래사장, 구멍 뚫린 바위",
      "갯벌, 구멍 뚫린 바위"
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
    "explanation": "절벽과 구멍 뚫린 바위는 파도가 바위를 계속 깎아 만든 침식 지형이에요. 갯벌과 모래사장은 퇴적 지형이에요.",
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
    "id": "s32-u03-v027",
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
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T09",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "파도가 모래와 고운 흙을 실어 와 쌓아서 만들어진 곳을 <보기>에서 모두 골라 기호를 쓰세요. (정답 2개)",
    "givens": {
      "보기": [
        "ㄱ. 해수욕을 할 수 있는 넓은 모래사장",
        "ㄴ. 파도에 깎여 가파르게 서 있는 바위 절벽",
        "ㄷ. 가운데가 뚫려 문처럼 보이는 바위",
        "ㄹ. 물이 빠지면 조개를 캘 수 있는 갯벌"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ, ㄹ",
      "accepted": [
        "ㄱ, ㄹ",
        "ㄱㄹ",
        "ㄱ,ㄹ",
        "ㄹ, ㄱ",
        "ㄹ,ㄱ"
      ]
    },
    "explanation": "모래사장과 갯벌은 바닷물이 모래와 고운 흙을 쌓아 만든 퇴적 지형이에요. 절벽과 구멍 뚫린 바위는 깎여서 생긴 침식 지형이에요.",
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
    "id": "s32-u03-v028",
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
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T09",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "바닷가 절벽 위에 산책로가 있었는데, 수십 년이 지나는 동안 바다 쪽 끝부분부터 조금씩 무너져 절벽이 점점 육지 쪽으로 물러났어요. 이렇게 변한 까닭을 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "파도가 오랜 시간 동안 절벽 아래쪽 바위에 계속 부딪치며 조금씩 깎아 냈기 때문이에요. 아래가 깎이면 위쪽도 무너져요.",
      "rubric": {
        "required": [
          "파도(바닷물)가 오랜 시간 바위에 계속 부딪침",
          "바위가 조금씩 깎이고 무너짐(침식 작용)"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "파도가 오랜 시간 바위에 부딪치며 조금씩 깎아 내는 침식 작용 때문에 절벽 아래가 파이고 위쪽이 무너져 절벽이 물러나요.",
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
    "id": "s32-u03-v029",
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
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "흙을 아끼고 보존해야 하는 까닭으로 알맞지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "흙은 언제든 하루 이틀이면 새로 생기기 때문입니다.",
      "흙이 다시 만들어지려면 오랜 시간이 걸리기 때문입니다.",
      "지렁이, 두더지 같은 많은 생물이 흙에서 살기 때문입니다.",
      "흙은 빗물에 쉽게 쓸려 내려갈 수 있기 때문입니다.",
      "흙은 오염되면 다시 깨끗하게 하기 어렵기 때문입니다."
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
    "explanation": "흙은 만들어지는 데 아주 오랜 시간이 걸려요. 하루 이틀 만에 새로 생기지 않기 때문에 아껴야 해요.",
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
    "id": "s32-u03-v030",
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
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "흙이 잘 보존되고 있는 곳을 고르세요.",
    "givens": null,
    "choices": [
      "나무를 모두 베어 내 흙이 드러난 산비탈",
      "굴착기로 흙을 파헤치고 있는 공사장",
      "산사태로 흙이 무너져 내린 언덕",
      "풀이 빽빽하게 자라 흙을 덮고 있는 강둑",
      "풀을 다 뽑아 맨흙이 드러난 비탈"
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
    "explanation": "풀이 흙을 덮고 뿌리로 붙잡고 있으면 빗물이 흙을 깎아 가지 못해 흙이 잘 보존돼요.",
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
    "id": "s32-u03-v031",
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
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "운동장 흙과 화단 흙을 관찰하는 방법으로 알맞지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "흰 종이 위에 흙을 펼쳐 놓고 색깔을 비교합니다.",
      "흙을 입에 넣고 씹어서 알갱이 크기를 느껴 봅니다.",
      "손가락으로 비벼 보며 거친 정도를 느껴 봅니다.",
      "물을 조금 섞어 손으로 뭉쳐 봅니다.",
      "돋보기로 알갱이의 크기와 모양을 살펴봅니다."
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
    "explanation": "흙에 무엇이 들어 있는지 모르므로 맛을 보거나 입에 넣으면 안 돼요. 눈·손·돋보기로 관찰해요.",
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
    "id": "s32-u03-v032",
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
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "알갱이가 비교적 크고, 밝은 갈색이며, 손으로 쥐었다 펴면 잘 뭉쳐지지 않고 흩어지는 흙은 운동장 흙과 화단 흙 중 어느 것인지 쓰세요.",
    "givens": null,
    "choices": null,
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
    "explanation": "운동장 흙은 알갱이가 비교적 크고 밝은 갈색이며, 거칠고 잘 뭉쳐지지 않아요.",
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
    "id": "s32-u03-v033",
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
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "운동장 흙과 화단 흙의 물 빠짐 실험 결과를 바르게 말한 것을 고르세요.",
    "givens": null,
    "choices": [
      "같은 시간 동안 화단 흙 쪽 컵에 물이 더 많이 모였습니다.",
      "두 흙 아래 컵에 모인 물의 양이 똑같았습니다.",
      "두 흙 모두 물이 조금도 빠지지 않았습니다.",
      "색깔이 어두운 흙일수록 물이 더 빨리 빠졌습니다.",
      "같은 시간 동안 운동장 흙 쪽 컵에 물이 더 많이 모였습니다."
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
    "explanation": "운동장 흙은 알갱이가 커서 물이 빨리 빠져요. 그래서 같은 시간 동안 운동장 흙 쪽에 물이 더 많이 모여요.",
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
    "id": "s32-u03-v034",
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
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "두 흙을 물에 넣고 저은 뒤 뜬 물질을 건져 보았더니, 화단 흙에서 뿌리와 나뭇잎 조각이 많이 나왔어요. 이를 통해 알 수 있는 것을 고르세요.",
    "givens": null,
    "choices": [
      "운동장 흙에 부식물이 더 많이 섞여 있습니다.",
      "물에 뜬 물질이 많은 흙일수록 식물이 자라기 어렵습니다.",
      "화단 흙에는 생물이 썩어 생긴 부식물이 많이 섞여 있습니다.",
      "화단 흙은 운동장 흙보다 알갱이 크기가 더 큽니다.",
      "물에 뜬 물질은 모두 바위가 부서진 흙 알갱이입니다."
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
    "explanation": "물에 뜬 뿌리·나뭇잎 조각은 부식물이에요. 화단 흙에 부식물이 많아서 식물이 잘 자라요.",
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
    "id": "s32-u03-v035",
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
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "낙엽, 죽은 곤충 등이 오랫동안 썩어서 만들어진 것으로, 화단 흙에 많이 섞여 있어 식물이 잘 자라도록 돕는 것은 무엇인지 쓰세요.",
    "givens": null,
    "choices": null,
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
    "explanation": "생물이 오랫동안 썩어 만들어진 부식물은 식물에 필요한 영양분이 되어 식물이 잘 자라도록 도와요.",
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
    "id": "s32-u03-v036",
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
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "텃밭에 상추를 심으려고 해요. 상추가 잘 자라는 흙을 고르는 기준으로 알맞은 것을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "굵은 모래만 있는 흙",
      "부식물이 많이 섞인 흙",
      "물이 알맞게 빠지는 흙",
      "물에 뜨는 물질이 하나도 없는 흙",
      "물이 빠지지 않고 늘 고여 있는 흙"
    ],
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
    "explanation": "식물은 대부분 물 빠짐이 알맞고 부식물이 많은 흙에서 잘 자라요.",
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
    "id": "s32-u03-v037",
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
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "얼음사탕 여러 개를 투명한 통에 넣고 뚜껑을 닫아 세게 흔들었어요. 흔든 뒤의 모습으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "사탕이 깨져 작은 조각과 가루가 생깁니다.",
      "사탕이 서로 붙어 더 큰 덩어리가 됩니다.",
      "사탕의 모양과 크기가 처음과 똑같습니다.",
      "사탕의 색깔이 모두 다른 색으로 바뀝니다.",
      "사탕이 모두 녹아서 물처럼 흐릅니다."
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
    "explanation": "얼음사탕은 통 안에서 서로 부딪쳐 깨지고, 점점 작은 조각과 가루가 돼요.",
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
    "id": "s32-u03-v038",
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
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "각설탕을 통에 넣고 흔들어 부서지게 하는 실험에서, 각설탕과 통을 흔드는 것이 자연의 무엇을 나타내는지 바르게 짝 지은 것을 고르세요.",
    "givens": null,
    "choices": [
      "각설탕 – 흙, 흔들기 – 흙이 뭉쳐지는 것",
      "각설탕 – 물, 흔들기 – 물이 얼고 녹는 것",
      "각설탕 – 바위, 흔들기 – 바위가 새로 생기는 것",
      "각설탕 – 바위, 흔들기 – 바위를 부수는 물·바람 등",
      "각설탕 – 모래, 흔들기 – 모래가 굳어 바위가 되는 것"
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
    "explanation": "각설탕은 바위나 돌을, 흔들기는 바위를 부서지게 하는 물·바람·나무뿌리 등을 나타내요. 생긴 가루는 흙 알갱이에 해당해요.",
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
    "id": "s32-u03-v039",
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
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 자연에서 바위가 부서지는 경우예요. 빈칸 ㉠과 ㉡에 들어갈 알맞은 말을 <보기>에서 골라 각각 쓰세요.",
    "givens": {
      "지문": "• 바위틈에 스며든 ㉠(이)가 겨울에 얼면서 틈을 조금씩 넓힙니다.\n• 바위틈에 떨어진 씨앗이 자라 나무의 ㉡(이)가 굵어지면서 바위를 쪼갭니다.",
      "보기": [
        "물, 뿌리, 모래, 햇빛, 흙"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "㉠-물, ㉡-뿌리",
      "accepted": [
        "㉠-물, ㉡-뿌리",
        "㉠ 물, ㉡ 뿌리",
        "물, 뿌리",
        "물 뿌리",
        "㉠-물, ㉡-나무뿌리",
        "물, 나무뿌리"
      ]
    },
    "explanation": "바위틈의 물이 얼었다 녹기를 되풀이하거나 나무뿌리가 굵어지면서 바위틈이 벌어져 바위가 부서져요.",
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
    "id": "s32-u03-v040",
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
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 무엇에 대한 설명인지 고르세요.",
    "givens": {
      "지문": "높은 산의 바위가 얼었다 녹기를 되풀이하고 나무뿌리에 쪼개지면서 아주 작은 알갱이가 되었어요. 여기에 썩은 나뭇잎 같은 물질이 섞여 오랜 세월에 걸쳐 만들어졌어요."
    },
    "choices": [
      "바위",
      "흙",
      "공기",
      "얼음",
      "나무"
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
    "explanation": "바위가 오랜 세월 부서진 작은 알갱이에 썩은 나뭇잎 같은 물질이 섞여 만들어진 것은 흙이에요.",
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
    "id": "s32-u03-v041",
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
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T06",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "운동장 구석의 흙 비탈 꼭대기(ㄱ)에 하얀 모래를 한 줌 뿌린 뒤, 물뿌리개로 꼭대기에 물을 부었어요. 비탈의 가운데를 ㄴ, 아래쪽을 ㄷ이라고 할 때, 하얀 모래가 옮겨 간 방향을 기호를 이용하여 쓰고, 비탈의 모양이 어떻게 변하는지 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "하얀 모래는 ㄱ에서 ㄷ으로 옮겨 갔어요. 비탈 위쪽의 흙은 깎여 나가고 아래쪽에는 흙이 쌓였어요.",
      "rubric": {
        "required": [
          "하얀 모래가 ㄱ(위쪽)에서 ㄷ(아래쪽)으로 옮겨 감",
          "위쪽 흙은 깎이고 아래쪽에 흙이 쌓임"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "흐르는 물은 높은 곳의 흙을 깎아 낮은 곳으로 옮겨 쌓아요. 그래서 모래는 ㄱ에서 ㄷ으로 가고, 위쪽은 깎이고 아래쪽은 쌓여요.",
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
    "id": "s32-u03-v042",
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
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "빈칸 ㉠과 ㉡에 들어갈 알맞은 말을 바르게 짝 지은 것을 고르세요.",
    "givens": {
      "지문": "깎인 흙이 흐르는 물에 실려 다른 곳으로 옮겨지는 것을 ㉠(이)라고 하고, 옮겨진 흙이 물살이 느린 곳에 쌓이는 것을 ㉡(이)라고 합니다."
    },
    "choices": [
      "침식 작용 / 운반 작용",
      "퇴적 작용 / 침식 작용",
      "운반 작용 / 침식 작용",
      "퇴적 작용 / 운반 작용",
      "운반 작용 / 퇴적 작용"
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
    "explanation": "깎인 흙이 물에 실려 옮겨지는 것은 운반 작용, 옮겨진 흙이 쌓이는 것은 퇴적 작용이에요.",
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
    "id": "s32-u03-v043",
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
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "흐르는 물이 지표를 바꾸는 모습으로 옳은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 흐르는 물은 흙을 높은 곳으로 끌어 올려 쌓습니다.",
        "ㄴ. 흐르는 물은 지표를 깎기만 하고 쌓지는 않습니다.",
        "ㄷ. 흐르는 물은 흙을 깎고 옮겨 낮은 곳에 쌓아 지표의 모습을 바꿉니다."
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
    "explanation": "흐르는 물은 지표를 깎고(침식), 옮기고(운반), 낮은 곳에 쌓아(퇴적) 지표의 모습을 천천히 바꿔요.",
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
    "id": "s32-u03-v044",
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
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음 특징이 있는 곳으로 알맞은 것을 고르세요.",
    "givens": {
      "지문": "• 강폭이 넓습니다.\n• 경사가 완만합니다.\n• 고운 모래와 흙이 많이 쌓여 있습니다."
    },
    "choices": [
      "강 상류의 깊은 계곡",
      "높은 산꼭대기",
      "강 하류의 넓은 들판",
      "폭포가 있는 골짜기",
      "큰 바위가 많은 산속 냇물"
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
    "explanation": "강폭이 넓고 경사가 완만하며 고운 모래와 흙이 쌓인 곳은 강 하류예요.",
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
    "id": "s32-u03-v045",
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
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "강물이 바다로 흘러드는 곳에 모래와 흙이 넓게 쌓여 있는 모습을 볼 수 있어요. 이런 모습은 강 상류와 강 하류 중 어디에서 주로 볼 수 있는지 쓰세요.",
    "givens": null,
    "choices": null,
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
    "explanation": "강 하류는 경사가 완만해 물살이 느려지므로, 실려 온 모래와 흙이 넓게 쌓여요.",
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
    "id": "s32-u03-v046",
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
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "큰비가 내려 강물이 많아지고 빨라졌을 때 일어날 수 있는 일로 알맞지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "강 상류에 흙과 모래가 쌓여 경사가 완만해집니다.",
      "강 상류에서 바위와 흙이 더 많이 깎입니다.",
      "강물에 실려 가는 흙과 모래가 더 많아집니다.",
      "강물이 흙탕물처럼 누렇게 흐려집니다.",
      "강 하류에 흙과 모래가 더 많이 쌓입니다."
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
    "explanation": "물이 많아지면 강 상류에서는 침식 작용이 더 활발해져 바위와 흙이 더 깎여요. 상류에 흙이 쌓여 완만해지지는 않아요.",
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
    "id": "s32-u03-v047",
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
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T09",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "바닷가에서 가운데가 문처럼 뚫린 바위를 보았어요. 이 바위는 바닷물의 어떤 작용으로 만들어진 것인지 쓰고, 그렇게 생각한 까닭을 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "바닷물의 침식 작용으로 만들어졌어요. 파도가 오랜 시간 바위에 부딪치며 약한 부분을 계속 깎아 내 구멍이 뚫렸기 때문이에요.",
      "rubric": {
        "required": [
          "바닷물의 침식 작용",
          "파도(바닷물)가 바위를 계속 깎아 구멍이 생김"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "구멍 뚫린 바위는 파도가 오랜 시간 바위의 약한 부분을 깎아 내는 침식 작용으로 만들어져요.",
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
    "id": "s32-u03-v048",
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
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "어느 바닷가에 (가) 가파른 절벽, (나) 가운데가 뚫린 바위, (다) 넓은 갯벌이 있어요. 이에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "(가)는 파도가 모래를 실어 와 쌓아서 만들어졌습니다.",
      "(나)는 시간이 아무리 지나도 모양이 변하지 않습니다.",
      "(다)는 파도가 단단한 바위를 깎아서 만들어졌습니다.",
      "(다)는 바닷물이 고운 흙을 실어 와 쌓아서 만들어졌습니다.",
      "(가)와 (다)는 바닷물의 같은 작용으로 만들어졌습니다."
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
    "explanation": "절벽과 구멍 뚫린 바위는 침식 작용으로, 갯벌은 바닷물이 고운 흙을 쌓은 퇴적 작용으로 만들어져요.",
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
    "id": "s32-u03-v049",
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
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T10",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "다음은 무엇에 대한 설명인지 고르세요.",
    "givens": {
      "지문": "• 지렁이, 땅강아지 같은 생물이 사는 집이 됩니다.\n• 농작물이 자라는 데 필요한 양분을 줍니다.\n• 한번 쓸려 가면 다시 만들어지는 데 아주 오랜 시간이 걸립니다."
    },
    "choices": [
      "바람",
      "흙",
      "물",
      "바위",
      "햇빛"
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
    "explanation": "흙은 많은 생물의 집이고 농작물에 양분을 주며, 다시 만들어지는 데 오랜 시간이 걸려서 소중해요.",
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
    "id": "s32-u03-v050",
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
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "공사로 흙이 드러난 비탈면의 흙을 지키는 방법으로 알맞지 않은 것을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "비탈면에 남아 있는 나무를 모두 베어 냅니다.",
      "비탈면에 풀씨를 뿌려 풀이 자라게 합니다.",
      "비탈면을 덮개로 덮어 빗물이 직접 닿지 않게 합니다.",
      "비탈면 위에서 호스로 물을 계속 흘려보냅니다.",
      "비탈 아래에 돌을 쌓아 흙이 흘러내리지 않게 막습니다."
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
    "explanation": "나무를 베거나 물을 흘려보내면 흙이 더 잘 깎여 내려가요. 풀을 심거나 덮개·돌 시설물로 흙을 덮고 고정해야 해요.",
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
    "id": "s32-u03-v051",
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
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "운동장 흙과 화단 흙 중에서 물을 조금 묻혀 손으로 쥐었을 때 더 잘 뭉쳐지는 흙을 쓰세요.",
    "givens": null,
    "choices": null,
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
    "explanation": "화단 흙은 알갱이 크기가 다양하고 부식물이 섞여 있어 운동장 흙보다 잘 뭉쳐져요.",
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
    "id": "s32-u03-v052",
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
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "어떤 흙을 관찰한 기록 카드예요. 이 흙에 대한 설명으로 옳은 것을 고르세요.",
    "givens": {
      "표": {
        "색깔": "밝은 갈색",
        "만졌을 때": "거칠거칠함",
        "물에 넣었을 때": "뜨는 물질이 거의 없음"
      }
    },
    "choices": [
      "화단에서 떠 온 흙입니다.",
      "부식물이 많아 식물이 아주 잘 자랍니다.",
      "잘 뭉쳐져서 공 모양을 쉽게 만듭니다.",
      "뿌리와 나뭇잎 조각이 많이 섞여 있습니다.",
      "알갱이가 비교적 커서 물이 잘 빠집니다."
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
    "explanation": "밝은 갈색이고 거칠며 물에 뜨는 물질이 거의 없는 흙은 운동장 흙이에요. 운동장 흙은 알갱이가 커서 물이 잘 빠져요.",
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
    "id": "s32-u03-v053",
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
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T02",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "학교 화단 흙과 뒷산 숲 흙의 물 빠짐을 비교하려고 해요. 다르게 해야 하는 조건을 쓰고, 나머지 조건은 어떻게 해야 하는지 그 까닭과 함께 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "흙의 종류만 다르게 해요. 흙의 양, 붓는 물의 양, 통의 크기 같은 나머지 조건은 모두 같게 해야 물 빠짐의 차이가 흙의 종류 때문인지 알 수 있어요.",
      "rubric": {
        "required": [
          "다르게 할 조건: 흙의 종류",
          "나머지 조건은 같게 해야 흙에 따른 차이를 비교할 수 있음"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "알아보려는 것이 흙에 따른 물 빠짐이므로 흙의 종류만 다르게 하고, 나머지 조건은 모두 같게 해야 비교할 수 있어요.",
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
    "id": "s32-u03-v054",
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
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "흙에 물을 붓고 저은 뒤 물에 뜬 물질을 건져 보았어요. 물에 뜬 물질로 보기 어려운 것을 고르세요.",
    "givens": null,
    "choices": [
      "식물의 뿌리 조각",
      "죽은 곤충",
      "무거운 자갈",
      "마른 나뭇잎 조각",
      "작은 나뭇가지"
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
    "explanation": "물에 뜨는 것은 뿌리·나뭇잎·죽은 곤충처럼 가벼운 부식물이에요. 무거운 자갈은 바닥에 가라앉아요.",
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
    "id": "s32-u03-v055",
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
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "□ 안에 들어갈 알맞은 말을 쓰세요.\n「숲속 바닥의 흙이 검고 기름진 까닭은 떨어진 나뭇잎과 죽은 생물이 오랫동안 썩어 만들어진 □(이)가 많이 섞여 있기 때문이에요.」",
    "givens": null,
    "choices": null,
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
    "explanation": "나뭇잎과 죽은 생물이 썩어 만들어진 부식물이 많으면 흙이 검고 식물이 잘 자라요.",
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
    "id": "s32-u03-v056",
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
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "과자를 통에 넣고 흔드는 실험을 실제 자연과 비교한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "과자가 금방 가루가 되듯이 바위도 몇 분 만에 흙이 됩니다.",
      "과자는 자연의 바위나 돌에 해당합니다.",
      "과자가 부서져 생긴 가루는 흙 알갱이에 해당합니다.",
      "통을 흔드는 것은 물·바람 등이 바위를 부수는 것에 해당합니다.",
      "흔들수록 조각이 작아지듯 바위도 점점 작게 부서집니다."
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
    "explanation": "과자는 몇 분 만에 가루가 되지만, 자연에서 바위가 부서져 흙이 되는 데에는 아주 오랜 시간이 걸려요.",
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
    "id": "s32-u03-v057",
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
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "자연에서 바위를 작게 부서지게 하는 것으로 알맞은 것을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "바위 위에 앉아 쉬는 새",
      "바위를 비추는 달빛",
      "바위 옆에 핀 꽃의 향기",
      "얼었다 녹기를 되풀이하는 바위틈의 물",
      "바위틈을 파고들며 굵어지는 나무뿌리"
    ],
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
    "explanation": "바위틈의 물이 얼면서 틈을 넓히고, 나무뿌리가 굵어지면서 바위를 쪼개 바위가 작게 부서져요.",
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
    "id": "s32-u03-v058",
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
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "흙이 만들어지는 과정에 대한 설명으로 옳지 않은 것을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "흙은 바위가 오랜 시간에 걸쳐 부서져 만들어집니다.",
      "작은 흙 알갱이들이 뭉쳐서 큰 바위가 되는 것이 흙이 생기는 과정입니다.",
      "흙에는 생물이 썩어 생긴 물질도 섞여 있습니다.",
      "물, 바람, 나무뿌리 등이 바위를 부수는 데 영향을 줍니다.",
      "흙은 비가 한 번 내리면 바로 새로 만들어집니다."
    ],
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
    "explanation": "흙은 바위가 오랜 시간에 걸쳐 작게 부서진 알갱이와 생물이 썩은 물질이 섞여 만들어져요. 알갱이가 뭉치거나 금방 생기는 것이 아니에요.",
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
    "id": "s32-u03-v059",
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
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "흙 언덕 실험에서 언덕 위쪽에 흙과 색깔이 다른 모래를 뿌리는 까닭으로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "흙이 더 잘 깎이도록 하기 위해서입니다.",
      "물이 더 빨리 흐르도록 하기 위해서입니다.",
      "흙 언덕이 무너지지 않게 단단히 하기 위해서입니다.",
      "흙이 옮겨 가는 모습을 쉽게 보기 위해서입니다.",
      "흙이 아래쪽에 더 많이 쌓이도록 하기 위해서입니다."
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
    "explanation": "색이 다른 모래를 뿌리면 흐르는 물에 흙이 어디로 옮겨 가는지 한눈에 볼 수 있어요. 결과를 바꾸려고 뿌리는 것이 아니에요.",
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
    "id": "s32-u03-v060",
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
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "흙 언덕 위쪽에서 물을 흘려보냈을 때 흙이 가장 많이 깎이는 곳을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "가. 언덕의 아래쪽",
        "나. 언덕의 중간 부분",
        "다. 언덕의 위쪽"
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "다",
      "accepted": [
        "다",
        "언덕의 위쪽",
        "위쪽"
      ]
    },
    "explanation": "물이 처음 흘러내리기 시작하는 언덕 위쪽에서 흙이 가장 많이 깎이고, 아래쪽에서 가장 많이 쌓여요.",
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
    "id": "s32-u03-v061",
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
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "흐르는 물이 지표를 바꾸는 것에 대한 설명으로 옳지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "흐르는 물은 흙과 돌을 깎습니다.",
      "흐르는 물은 흙을 깎기만 할 뿐 어디에도 쌓지 않습니다.",
      "깎인 흙과 돌은 물에 실려 다른 곳으로 옮겨집니다.",
      "옮겨진 흙과 돌은 물살이 느려지는 곳에 쌓입니다.",
      "흐르는 물은 오랜 시간에 걸쳐 지표의 모습을 바꿉니다."
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
    "explanation": "흐르는 물은 흙을 깎을 뿐 아니라 옮겨서 물살이 느린 낮은 곳에 쌓아 놓아요.",
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
    "id": "s32-u03-v062",
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
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "지표에 대한 설명으로 옳지 않은 것을 <보기>에서 골라 기호를 쓰세요.",
    "givens": {
      "보기": [
        "ㄱ. 땅의 겉 부분을 지표라고 합니다.",
        "ㄴ. 지표는 단단해서 흐르는 물로는 조금도 변하지 않습니다.",
        "ㄷ. 지표에는 바위, 돌, 흙 등이 있습니다."
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
    "explanation": "지표는 흐르는 물에 의해 오랜 시간에 걸쳐 천천히 변해요. 단단해 보여도 조금도 변하지 않는 것은 아니에요.",
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
    "id": "s32-u03-v063",
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
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "강을 따라 여행하며 쓴 일기의 한 부분이에요. 강 상류에서 쓴 것을 고르세요.",
    "givens": null,
    "choices": [
      "강폭이 아주 넓고, 강물이 느릿느릿 천천히 흘렀다.",
      "강가 넓은 들판에 고운 흙이 쌓여 논이 많이 있었다.",
      "바다가 가까워 강물과 바닷물이 만나는 곳이 보였다.",
      "강가에 고운 모래밭이 아주 넓게 펼쳐져 있었다.",
      "골짜기가 깊고 큰 바위 사이로 물이 빠르게 흘렀다."
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
    "explanation": "강 상류는 경사가 급하고 강폭이 좁아 물살이 빠르고, 골짜기가 깊으며 모난 큰 바위가 많아요.",
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
    "id": "s32-u03-v064",
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
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T08",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "강 상류에서는 침식 작용과 퇴적 작용 중 어느 것이 더 활발하게 일어나는지 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "침식 작용",
      "accepted": [
        "침식 작용",
        "침식작용",
        "침식"
      ]
    },
    "explanation": "강 상류는 경사가 급해 물살이 빠르므로 바위와 흙을 깎는 침식 작용이 퇴적 작용보다 활발해요.",
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
    "id": "s32-u03-v065",
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
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "강 하류에서 일어나는 물의 작용에 대한 설명으로 옳은 것을 고르세요.",
    "givens": null,
    "choices": [
      "큰 바위를 깎는 침식 작용이 가장 활발하게 일어납니다.",
      "흙과 모래를 옮기는 운반 작용만 일어나고 쌓이지 않습니다.",
      "침식 작용보다 퇴적 작용이 더 활발하게 일어납니다.",
      "물의 작용이 전혀 일어나지 않습니다.",
      "퇴적 작용은 없고 침식 작용만 일어납니다."
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
    "explanation": "강 하류는 경사가 완만해 물살이 느리므로 실려 온 흙과 모래가 쌓이는 퇴적 작용이 더 활발해요.",
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
    "id": "s32-u03-v066",
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
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "바닷가의 절벽과 구멍 뚫린 바위의 공통점을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "바닷물의 침식 작용으로 만들어졌습니다.",
      "바닷물의 퇴적 작용으로 만들어졌습니다.",
      "만들어지는 데 오랜 시간이 걸렸습니다.",
      "고운 모래와 흙이 쌓여서 만들어졌습니다.",
      "사람이 바위를 깎아서 만들었습니다."
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
    "explanation": "절벽과 구멍 뚫린 바위는 파도가 오랜 시간 바위를 깎아 만든 침식 지형이에요.",
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
    "id": "s32-u03-v067",
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
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "바닷물의 퇴적 작용으로 만들어진 지형을 고르세요.",
    "givens": null,
    "choices": [
      "고운 모래가 쌓인 모래사장",
      "파도에 깎인 높은 절벽",
      "가운데가 뚫린 바위",
      "바위 절벽에 생긴 동굴",
      "깎여서 홀로 남은 바위 기둥"
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
    "explanation": "모래사장은 파도가 모래를 실어 와 쌓은 퇴적 지형이에요. 나머지는 바위가 깎여 생긴 침식 지형이에요.",
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
    "id": "s32-u03-v068",
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
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T10",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "흙을 보존해야 하는 까닭으로 옳은 것을 <보기>에서 모두 골라 기호를 쓰세요. (정답 2개)",
    "givens": {
      "보기": [
        "ㄱ. 흙이 다시 만들어지려면 매우 오랜 시간이 걸립니다.",
        "ㄴ. 흙은 오염되어도 비가 한 번 오면 바로 깨끗해집니다.",
        "ㄷ. 흙은 필요할 때마다 공장에서 쉽게 만들 수 있습니다.",
        "ㄹ. 우리가 먹는 곡식과 채소가 흙에서 자랍니다."
      ]
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ, ㄹ",
      "accepted": [
        "ㄱ, ㄹ",
        "ㄱㄹ",
        "ㄱ,ㄹ",
        "ㄹ, ㄱ",
        "ㄹ,ㄱ"
      ]
    },
    "explanation": "흙은 다시 만들어지는 데 아주 오랜 시간이 걸리고, 우리가 먹는 곡식과 채소가 흙에서 자라므로 보존해야 해요.",
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
    "id": "s32-u03-v069",
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
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T11",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "빗물에 흙이 쓸려 내려가는 것을 막는 방법으로 알맞지 않은 것을 두 가지 고르세요. (정답 2개)",
    "givens": null,
    "choices": [
      "비탈에 나무와 풀을 심습니다.",
      "비탈의 풀과 나무를 모두 뽑아 맨흙을 드러냅니다.",
      "흙을 덮어 주는 덮개를 씌웁니다.",
      "비탈의 흙을 파헤쳐 푸석푸석하게 해 둡니다.",
      "비탈 아래에 돌을 쌓아 흙을 받쳐 줍니다."
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
    "explanation": "풀과 나무를 뽑거나 흙을 파헤치면 빗물에 흙이 더 쉽게 쓸려 가요. 식물을 심고 덮개·돌 시설물로 흙을 지켜요.",
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
    "id": "s32-u03-v070",
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
      "grade": 3,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T11",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "괄호에 들어갈 알맞은 말을 골라 쓰세요.\n「큰비가 올 때 강둑이 무너지지 않도록 강둑에 큰 돌을 쌓아 두었어요. 이 시설물은 흐르는 물의 ( 운반, 침식 ) 작용으로부터 강둑의 흙을 지켜 줘요.」",
    "givens": null,
    "choices": null,
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
    "explanation": "강둑에 쌓은 돌은 흐르는 물이 강둑의 흙을 깎아 내는 침식 작용을 막아 줘요.",
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
