// Use brief responses for separation methods; retain real experiments and observations.
export const MIXTURE_MIXED_VERSION='20261124-mixture-mixed-responses';
const unit='c22-s52-u01',prior='126553eb58c728c5';
const review={
  "4": {
    "prompt": "거른 물이 맑아 보이면 마셔도 안전할까요? 맑기만으로 알 수 없는 점 하나를 짝과 말하거나 한 줄로 쓰세요.",
    "answer": "눈에 보이지 않는 물질이 있는지 알 수 없어요.",
    "explanation": "맑아 보여도 녹은 물질 등이 있을 수 있어요. 마실 수 있는지는 필요한 처리와 수질 검사로 확인해요. 교실 실험물은 마시지 않아요.",
    "misconception": "맑아 보인다는 이유만으로 마셔도 된다고 하지 않아요.",
    "required": [
      "녹아 있거나 눈에 보이지 않는 물질 또는 마실 수 있는지 알 수 없다는 설명"
    ],
    "lines": 1,
    "before": "ab026413baf5d9bd"
  },
  "16": {
    "prompt": "작은 모래와 큰 자갈이 모두 체 위에 남았어요. 다음에는 지금보다 구멍이 더 큰 체와 더 작은 체 중 어느 것을 시험할까요?",
    "answer": "더 큰 체",
    "explanation": "모래는 통과하고 자갈은 남을 만한 구멍인지 확인해요. 같은 종류와 양의 마른 혼합물로 시험해요.",
    "misconception": "구멍을 무조건 크게 하기보다 자갈보다 작은지도 확인해요.",
    "form": "short",
    "required": [
      "알맞은 낱말"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "더 큰 체",
        "큰 체",
        "구멍이 더 큰 체",
        "구멍이 큰 체",
        "더 큰",
        "큰"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "863b838a97be2038"
  },
  "28": {
    "prompt": "소금과 모래에 충분한 물을 넣어 소금을 모두 녹였어요. 모래를 따로 얻을 방법은 거르기와 체질 중 무엇일까요?",
    "answer": "거르기",
    "explanation": "거름종이로 거르면 모래는 종이에 남고 소금물은 아래로 모여요. 이어 소금물의 물을 증발시키면 소금도 얻을 수 있어요.",
    "misconception": "물을 넣기만 해서 마른 소금과 모래가 각각 얻어진 것은 아니에요.",
    "form": "short",
    "required": [
      "알맞은 낱말"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "거르기",
        "거름",
        "거름종이로 거르기",
        "거름종이로 걸러요",
        "거름종이"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "d5c99808abc8bf4a"
  },
  "34": {
    "prompt": "소금을 모두 녹인 모래 혼합물을 걸렀어요. 녹은 소금은 거름종이를 지나 아래에 모인 (1)[ ]에 들어 있어요. 보기: 모래·소금물",
    "answer": "소금물",
    "explanation": "모래는 종이에 남지만 녹은 소금은 물과 함께 통과해요. 맑아 보여도 아래 액체는 소금물이에요.",
    "misconception": "거름종이가 녹은 소금까지 모두 붙잡는다고 하지 않아요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "소금물",
            "소금 물"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "2a358c7932364127"
  },
  "40": {
    "prompt": "소금물을 접시에 놓아 물을 증발시켰어요. 줄어든 물은 (1)[ ]가 되어 공기 중으로 나갔어요. 보기: 수증기·소금",
    "answer": "수증기",
    "explanation": "물은 수증기가 되어 공기 중으로 나가고 소금은 접시에 남아요. 이 활동에서는 액체 물을 따로 받는 장치를 쓰지 않았어요.",
    "misconception": "물이 소금으로 바뀌거나 액체 물을 따로 모았다고 하지 않아요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "수증기"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "f32e278967f3fbfb"
  },
  "45": {
    "prompt": "전기가 자주 끊기는 곳에서 쓸 분리 장치를 조사해요. 전기와 관련해 확인할 내용을 고르세요.",
    "answer": "②",
    "explanation": "전기가 없을 때도 필요한 분리를 할 수 있는지 확인해요. 실제 조사에서는 부품 교체와 관리 조건도 함께 알아보아요.",
    "misconception": "전기를 쓰지 않는다는 이유만으로 모든 물질을 분리한다고 하지 않아요.",
    "form": "choice",
    "choices": [
      "장치 사진이 밝게 나왔는지",
      "전기가 없어도 필요한 분리를 할 수 있는지",
      "장치 이름이 짧은지"
    ],
    "key": 1,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "661653302cd62086"
  },
  "46": {
    "prompt": "분리 장치 소개 자료를 만들었지만 아직 친구에게 보여 주지 않았어요. 다음에 할 일을 고르세요.",
    "answer": "③",
    "explanation": "조사한 장치가 어떤 물질을 어떤 방법으로 나누는지 실제로 소개해요. 친구의 질문을 듣고 필요한 설명을 보충해요.",
    "misconception": "자료를 저장한 일만으로 소개까지 끝났다고 하지 않아요.",
    "form": "choice",
    "choices": [
      "자료를 저장하고 소개도 끝났다고 적는다.",
      "친구의 질문을 예상해서 친구가 한 말처럼 적는다.",
      "친구에게 자료를 보여 주며 분리 방법을 설명한다."
    ],
    "key": 2,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "b8cda8d43f75bb0e"
  },
  "50": {
    "prompt": "옮긴 식용유에 작은 물방울이 섞였어요. 두 층의 경계 가까이에서 옮기는 방법을 고르세요.",
    "answer": "①",
    "explanation": "스포이트 끝을 위층에 두고 경계 가까이에서는 천천히 옮겨요. 옮긴 액체에 물방울이 섞였는지 다시 살펴요.",
    "misconception": "경계 아래 물까지 빨아올리지 않도록 해요.",
    "form": "choice",
    "choices": [
      "스포이트 끝을 위층에 두고 조금씩 천천히 옮긴다.",
      "스포이트 끝을 아래 물에 넣어 한꺼번에 옮긴다.",
      "물과 식용유를 계속 흔들면서 옮긴다."
    ],
    "key": 0,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "7d4dfded3e7a0357"
  },
  "54": {
    "prompt": "같은 모래가 젖었을 때는 8 g, 말린 뒤에는 6 g이었어요. 젖은 모래에는 모래뿐 아니라 (1)[ ]의 무게도 들어 있어요. 보기: 물·빈 공간",
    "answer": "물",
    "explanation": "젖은 모래에는 물기가 남아 있어요. 용기 무게를 빼고 같은 방법으로 잰 값인지 확인하고, 같은 상태로 말린 뒤 비교해요.",
    "misconception": "물의 무게 차이를 모래가 새로 생긴 것으로 설명하지 않아요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "물",
            "물기"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "40c88ca2103a9b6c"
  },
  "58": {
    "prompt": "친구가 거름종이를 지난 소금이 어디에 있는지 물었어요. 그림에 붙일 설명을 완성하세요. “녹은 소금은 (1)[ ]과 함께 종이를 통과해요.” 보기: 물·모래",
    "answer": "물",
    "explanation": "녹은 소금은 물과 함께 종이를 지나 아래 용기에 모여요. 거름종이 위의 모래와 아래의 소금물을 구별해요.",
    "misconception": "아래 액체에 물만 있고 소금은 모두 종이에 남았다고 하지 않아요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "물",
            "소금물"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "d57409a81882f74a"
  },
  "68": {
    "prompt": "지름 3 mm와 10 mm인 마른 둥근 알갱이를 구멍 6 mm의 체로 나누어요. 작은 알갱이만 통과하는 까닭을 고르세요.",
    "answer": "③",
    "explanation": "체 구멍은 작은 알갱이보다 크고 큰 알갱이보다 작아요. 모양이 변하지 않는 둥근 알갱이를 비교한 결과예요.",
    "misconception": "구멍이 더 크다는 말에서 무엇보다 큰지 빠뜨리지 않아요.",
    "form": "choice",
    "choices": [
      "6 mm는 3 mm보다 작고 10 mm보다 크다.",
      "6 mm는 두 알갱이보다 모두 크다.",
      "6 mm는 3 mm보다 크고 10 mm보다 작다."
    ],
    "key": 2,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "71ed4b167ba98050"
  },
  "72": {
    "prompt": "물 위 식용유를 옮길 때 두 층의 경계 가까이에서 천천히 하는 까닭을 고르세요.",
    "answer": "②",
    "explanation": "경계 가까이에서는 아래 물도 함께 빨려 들어갈 수 있어요. 위층에서 조금씩 옮기며 물방울이 섞였는지 살펴요.",
    "misconception": "빨리 옮길수록 항상 더 잘 분리된다고 하지 않아요.",
    "form": "choice",
    "choices": [
      "식용유를 물에 모두 녹이려고",
      "아래 물이 함께 옮겨지는 것을 줄이려고",
      "식용유를 새 소금으로 바꾸려고"
    ],
    "key": 1,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "3a7f462ea768e5d4"
  },
  "76": {
    "prompt": "소금과 모래에 물을 넣은 뒤 모래를 거르지 않고 물부터 증발시켰어요. 접시에는 소금과 (1)[ ]가 함께 남아요. 보기: 모래·수증기",
    "answer": "모래",
    "explanation": "모래는 걸러 내지 않았고 녹은 소금은 물이 증발한 뒤 남아요. 그래서 마른 소금과 모래를 따로 얻은 것은 아니에요.",
    "misconception": "물을 증발시키면 두 고체가 저절로 다른 곳에 모인다고 하지 않아요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "모래"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "5aefe8f79f8563b1"
  },
  "80": {
    "prompt": "친구가 “거름종이를 지났으니 소금도 없고 바로 마셔도 돼.”라고 말했어요. 알맞게 고친 설명을 고르세요.",
    "answer": "①",
    "explanation": "녹은 소금은 물과 함께 거름종이를 통과해요. 맑기만으로 마실 수 있는지는 알 수 없으며 교실 실험물은 마시지 않아요.",
    "misconception": "단순히 거르는 일을 모든 물질 제거와 같게 보지 않아요.",
    "form": "choice",
    "choices": [
      "녹은 소금은 통과할 수 있고, 맑아 보여도 마셔도 되는지는 알 수 없다.",
      "거름종이를 지나면 녹은 소금도 모두 없어지고 바로 마셔도 된다.",
      "소금은 종이 위에 모두 남지만, 아래 물은 맛보아야만 확인할 수 있다."
    ],
    "key": 0,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "c7b0d6d4b77cf82a"
  },
  "84": {
    "prompt": "얻은 소금이 아직 젖어 있어요. 처음의 마른 소금과 무게를 비교하려면 먼저 말리기와 물 더 넣기 중 무엇을 해야 할까요?",
    "answer": "말리기",
    "explanation": "소금을 충분히 말리고 용기 무게를 뺀 뒤 같은 방법으로 재어요. 젖은 소금에는 남아 있는 물의 무게도 들어 있어요.",
    "misconception": "젖은 소금과 마른 소금을 그대로 비교하지 않아요.",
    "form": "short",
    "required": [
      "알맞은 낱말"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "말리기",
        "말리다",
        "말려요",
        "말린다",
        "말린 뒤 재기",
        "충분히 말리기",
        "소금 말리기"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "5a04c022a8e26468"
  },
  "92": {
    "prompt": "소금물을 놓고 며칠 뒤 보니 접시에 액체가 남아 있어요. 소금을 얻으려면 다음에 무엇을 할까요?",
    "answer": "③",
    "explanation": "정해 둔 안전한 곳에서 여러 날 이어 관찰해요. 소금물을 마시거나 맛보지 않고, 가열이 필요하면 교사의 시범으로 관찰해요.",
    "misconception": "아직 액체가 남았는데 물이 모두 증발했다고 하지 않아요.",
    "form": "choice",
    "choices": [
      "남은 액체가 전부 소금으로 바뀌었다고 적는다.",
      "남은 액체를 맛보아 소금이 있는지 확인한다.",
      "안전한 곳에 두고 물이 더 증발하는지 관찰한다."
    ],
    "key": 2,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "9140453ed4ff2874"
  },
  "95": {
    "prompt": "마른 모래와 자갈을 체질하면 아래로 작은 (1)[ ]가 모여요. 소금을 모두 녹인 모래 혼합물을 거르면 아래로 (2)[ ]이 모여요. 보기: 모래·소금물",
    "answer": "모래 / 소금물",
    "explanation": "체질에서는 작은 모래가 체 구멍을 통과해요. 거름에서는 녹은 소금이 물과 함께 종이를 통과해 소금물이 모여요.",
    "misconception": "두 경우 모두 아래에 순수한 물이 모인다고 하지 않아요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "모래",
            "작은 모래",
            "마른 모래"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "소금물",
            "소금 물"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "cd18e97b5677b229"
  }
};
const bankReview={
  "c22-s52-u01-b004": {
    "prompt": "거른 물이 맑아 보이면 마셔도 안전할까요? 맑기만으로 알 수 없는 점 하나를 짝과 말하거나 한 줄로 쓰세요.",
    "answer": "눈에 보이지 않는 물질이 있는지 알 수 없어요.",
    "explanation": "맑아 보여도 녹은 물질 등이 있을 수 있어요. 마실 수 있는지는 필요한 처리와 수질 검사로 확인해요. 교실 실험물은 마시지 않아요.",
    "misconception": "맑아 보인다는 이유만으로 마셔도 된다고 하지 않아요.",
    "required": [
      "녹아 있거나 눈에 보이지 않는 물질 또는 마실 수 있는지 알 수 없다는 설명"
    ],
    "lines": 1,
    "before": [
      "0df61fb60cd81530"
    ]
  },
  "c22-s52-u01-b016": {
    "prompt": "작은 모래와 큰 자갈이 모두 체 위에 남았어요. 다음에는 지금보다 구멍이 더 큰 체와 더 작은 체 중 어느 것을 시험할까요?",
    "answer": "더 큰 체",
    "explanation": "모래는 통과하고 자갈은 남을 만한 구멍인지 확인해요. 같은 종류와 양의 마른 혼합물로 시험해요.",
    "misconception": "구멍을 무조건 크게 하기보다 자갈보다 작은지도 확인해요.",
    "form": "short",
    "required": [
      "알맞은 낱말"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "더 큰 체",
        "큰 체",
        "구멍이 더 큰 체",
        "구멍이 큰 체",
        "더 큰",
        "큰"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "38ab4d96b4a57f60"
    ]
  },
  "c22-s52-u01-b028": {
    "prompt": "소금과 모래에 충분한 물을 넣어 소금을 모두 녹였어요. 모래를 따로 얻을 방법은 거르기와 체질 중 무엇일까요?",
    "answer": "거르기",
    "explanation": "거름종이로 거르면 모래는 종이에 남고 소금물은 아래로 모여요. 이어 소금물의 물을 증발시키면 소금도 얻을 수 있어요.",
    "misconception": "물을 넣기만 해서 마른 소금과 모래가 각각 얻어진 것은 아니에요.",
    "form": "short",
    "required": [
      "알맞은 낱말"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "거르기",
        "거름",
        "거름종이로 거르기",
        "거름종이로 걸러요",
        "거름종이"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "0d96b3d9e77bdaf7"
    ]
  },
  "c22-s52-u01-b034": {
    "prompt": "소금을 모두 녹인 모래 혼합물을 걸렀어요. 녹은 소금은 거름종이를 지나 아래에 모인 (1)[ ]에 들어 있어요. 보기: 모래·소금물",
    "answer": "소금물",
    "explanation": "모래는 종이에 남지만 녹은 소금은 물과 함께 통과해요. 맑아 보여도 아래 액체는 소금물이에요.",
    "misconception": "거름종이가 녹은 소금까지 모두 붙잡는다고 하지 않아요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "소금물",
            "소금 물"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "f35768223bed45b8"
    ]
  },
  "c22-s52-u01-b040": {
    "prompt": "소금물을 접시에 놓아 물을 증발시켰어요. 줄어든 물은 (1)[ ]가 되어 공기 중으로 나갔어요. 보기: 수증기·소금",
    "answer": "수증기",
    "explanation": "물은 수증기가 되어 공기 중으로 나가고 소금은 접시에 남아요. 이 활동에서는 액체 물을 따로 받는 장치를 쓰지 않았어요.",
    "misconception": "물이 소금으로 바뀌거나 액체 물을 따로 모았다고 하지 않아요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "수증기"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "c80aeae69f464a30"
    ]
  },
  "c22-s52-u01-b045": {
    "prompt": "전기가 자주 끊기는 곳에서 쓸 분리 장치를 조사해요. 전기와 관련해 확인할 내용을 고르세요.",
    "answer": "②",
    "explanation": "전기가 없을 때도 필요한 분리를 할 수 있는지 확인해요. 실제 조사에서는 부품 교체와 관리 조건도 함께 알아보아요.",
    "misconception": "전기를 쓰지 않는다는 이유만으로 모든 물질을 분리한다고 하지 않아요.",
    "form": "choice",
    "choices": [
      "장치 사진이 밝게 나왔는지",
      "전기가 없어도 필요한 분리를 할 수 있는지",
      "장치 이름이 짧은지"
    ],
    "key": 1,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "0a6705aa1be9eda8"
    ]
  },
  "c22-s52-u01-b046": {
    "prompt": "분리 장치 소개 자료를 만들었지만 아직 친구에게 보여 주지 않았어요. 다음에 할 일을 고르세요.",
    "answer": "③",
    "explanation": "조사한 장치가 어떤 물질을 어떤 방법으로 나누는지 실제로 소개해요. 친구의 질문을 듣고 필요한 설명을 보충해요.",
    "misconception": "자료를 저장한 일만으로 소개까지 끝났다고 하지 않아요.",
    "form": "choice",
    "choices": [
      "자료를 저장하고 소개도 끝났다고 적는다.",
      "친구의 질문을 예상해서 친구가 한 말처럼 적는다.",
      "친구에게 자료를 보여 주며 분리 방법을 설명한다."
    ],
    "key": 2,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "b4ef40df1c34c0b9"
    ]
  },
  "c22-s52-u01-b050": {
    "prompt": "옮긴 식용유에 작은 물방울이 섞였어요. 두 층의 경계 가까이에서 옮기는 방법을 고르세요.",
    "answer": "①",
    "explanation": "스포이트 끝을 위층에 두고 경계 가까이에서는 천천히 옮겨요. 옮긴 액체에 물방울이 섞였는지 다시 살펴요.",
    "misconception": "경계 아래 물까지 빨아올리지 않도록 해요.",
    "form": "choice",
    "choices": [
      "스포이트 끝을 위층에 두고 조금씩 천천히 옮긴다.",
      "스포이트 끝을 아래 물에 넣어 한꺼번에 옮긴다.",
      "물과 식용유를 계속 흔들면서 옮긴다."
    ],
    "key": 0,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "fad1aee78a78c699"
    ]
  },
  "c22-s52-u01-b054": {
    "prompt": "같은 모래가 젖었을 때는 8 g, 말린 뒤에는 6 g이었어요. 젖은 모래에는 모래뿐 아니라 (1)[ ]의 무게도 들어 있어요. 보기: 물·빈 공간",
    "answer": "물",
    "explanation": "젖은 모래에는 물기가 남아 있어요. 용기 무게를 빼고 같은 방법으로 잰 값인지 확인하고, 같은 상태로 말린 뒤 비교해요.",
    "misconception": "물의 무게 차이를 모래가 새로 생긴 것으로 설명하지 않아요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "물",
            "물기"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "0b4b5aa6a08620a4"
    ]
  },
  "c22-s52-u01-b058": {
    "prompt": "친구가 거름종이를 지난 소금이 어디에 있는지 물었어요. 그림에 붙일 설명을 완성하세요. “녹은 소금은 (1)[ ]과 함께 종이를 통과해요.” 보기: 물·모래",
    "answer": "물",
    "explanation": "녹은 소금은 물과 함께 종이를 지나 아래 용기에 모여요. 거름종이 위의 모래와 아래의 소금물을 구별해요.",
    "misconception": "아래 액체에 물만 있고 소금은 모두 종이에 남았다고 하지 않아요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "물",
            "소금물"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "24c8bdb0bed6d3e6"
    ]
  },
  "c22-s52-u01-b068": {
    "prompt": "지름 3 mm와 10 mm인 마른 둥근 알갱이를 구멍 6 mm의 체로 나누어요. 작은 알갱이만 통과하는 까닭을 고르세요.",
    "answer": "③",
    "explanation": "체 구멍은 작은 알갱이보다 크고 큰 알갱이보다 작아요. 모양이 변하지 않는 둥근 알갱이를 비교한 결과예요.",
    "misconception": "구멍이 더 크다는 말에서 무엇보다 큰지 빠뜨리지 않아요.",
    "form": "choice",
    "choices": [
      "6 mm는 3 mm보다 작고 10 mm보다 크다.",
      "6 mm는 두 알갱이보다 모두 크다.",
      "6 mm는 3 mm보다 크고 10 mm보다 작다."
    ],
    "key": 2,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "e9cf560ce4f45f1a"
    ]
  },
  "c22-s52-u01-b072": {
    "prompt": "물 위 식용유를 옮길 때 두 층의 경계 가까이에서 천천히 하는 까닭을 고르세요.",
    "answer": "②",
    "explanation": "경계 가까이에서는 아래 물도 함께 빨려 들어갈 수 있어요. 위층에서 조금씩 옮기며 물방울이 섞였는지 살펴요.",
    "misconception": "빨리 옮길수록 항상 더 잘 분리된다고 하지 않아요.",
    "form": "choice",
    "choices": [
      "식용유를 물에 모두 녹이려고",
      "아래 물이 함께 옮겨지는 것을 줄이려고",
      "식용유를 새 소금으로 바꾸려고"
    ],
    "key": 1,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "a89379137161b3c5"
    ]
  },
  "c22-s52-u01-b076": {
    "prompt": "소금과 모래에 물을 넣은 뒤 모래를 거르지 않고 물부터 증발시켰어요. 접시에는 소금과 (1)[ ]가 함께 남아요. 보기: 모래·수증기",
    "answer": "모래",
    "explanation": "모래는 걸러 내지 않았고 녹은 소금은 물이 증발한 뒤 남아요. 그래서 마른 소금과 모래를 따로 얻은 것은 아니에요.",
    "misconception": "물을 증발시키면 두 고체가 저절로 다른 곳에 모인다고 하지 않아요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "모래"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "07d45602bf2d97a8"
    ]
  },
  "c22-s52-u01-b080": {
    "prompt": "친구가 “거름종이를 지났으니 소금도 없고 바로 마셔도 돼.”라고 말했어요. 알맞게 고친 설명을 고르세요.",
    "answer": "①",
    "explanation": "녹은 소금은 물과 함께 거름종이를 통과해요. 맑기만으로 마실 수 있는지는 알 수 없으며 교실 실험물은 마시지 않아요.",
    "misconception": "단순히 거르는 일을 모든 물질 제거와 같게 보지 않아요.",
    "form": "choice",
    "choices": [
      "녹은 소금은 통과할 수 있고, 맑아 보여도 마셔도 되는지는 알 수 없다.",
      "거름종이를 지나면 녹은 소금도 모두 없어지고 바로 마셔도 된다.",
      "소금은 종이 위에 모두 남지만, 아래 물은 맛보아야만 확인할 수 있다."
    ],
    "key": 0,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "e7f5f0307c99b1c6"
    ]
  },
  "c22-s52-u01-b084": {
    "prompt": "얻은 소금이 아직 젖어 있어요. 처음의 마른 소금과 무게를 비교하려면 먼저 말리기와 물 더 넣기 중 무엇을 해야 할까요?",
    "answer": "말리기",
    "explanation": "소금을 충분히 말리고 용기 무게를 뺀 뒤 같은 방법으로 재어요. 젖은 소금에는 남아 있는 물의 무게도 들어 있어요.",
    "misconception": "젖은 소금과 마른 소금을 그대로 비교하지 않아요.",
    "form": "short",
    "required": [
      "알맞은 낱말"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "말리기",
        "말리다",
        "말려요",
        "말린다",
        "말린 뒤 재기",
        "충분히 말리기",
        "소금 말리기"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "0a2a2fa8529fc332"
    ]
  },
  "c22-s52-u01-b092": {
    "prompt": "소금물을 놓고 며칠 뒤 보니 접시에 액체가 남아 있어요. 소금을 얻으려면 다음에 무엇을 할까요?",
    "answer": "③",
    "explanation": "정해 둔 안전한 곳에서 여러 날 이어 관찰해요. 소금물을 마시거나 맛보지 않고, 가열이 필요하면 교사의 시범으로 관찰해요.",
    "misconception": "아직 액체가 남았는데 물이 모두 증발했다고 하지 않아요.",
    "form": "choice",
    "choices": [
      "남은 액체가 전부 소금으로 바뀌었다고 적는다.",
      "남은 액체를 맛보아 소금이 있는지 확인한다.",
      "안전한 곳에 두고 물이 더 증발하는지 관찰한다."
    ],
    "key": 2,
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "d412328a9a319070"
    ]
  },
  "c22-s52-u01-b095": {
    "prompt": "마른 모래와 자갈을 체질하면 아래로 작은 (1)[ ]가 모여요. 소금을 모두 녹인 모래 혼합물을 거르면 아래로 (2)[ ]이 모여요. 보기: 모래·소금물",
    "answer": "모래 / 소금물",
    "explanation": "체질에서는 작은 모래가 체 구멍을 통과해요. 거름에서는 녹은 소금이 물과 함께 종이를 통과해 소금물이 모여요.",
    "misconception": "두 경우 모두 아래에 순수한 물이 모인다고 하지 않아요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말 또는 수치"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "모래",
            "작은 모래",
            "마른 모래"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "소금물",
            "소금 물"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "90204a06f82be870"
    ]
  }
};
const questionTitles={};
const studyMethodBefore="개념과 예제를 읽고 여러 가지 문제를 풀어 보아요. 실험에서는 직접 관찰한 모습을 글이나 그림으로 나타내요. 오른쪽에서는 핵심을 정리하고 더 깊은 내용을 알아볼 수 있어요.";
const clone=x=>JSON.parse(JSON.stringify(x));
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const banks=new WeakMap(),books=new WeakMap(),labels={choice:'객관식',blank:'빈칸 넣기',short:'단답형',written:'까닭 설명',draw:'그림 설명'};
const response=e=>e.contract?clone(e.contract):{kind:Object.hasOwn(e,'drawingExplanationLines')?'drawing':'written-explanation',teacherRequired:true,actualPerformanceMustNotBeInferred:true,sample:e.answer,required:[...e.required]};
function answerContract(e){const c=response(e);return{type:e.form==='choice'?'single-choice':e.contract?'short-text':'written-explanation',...(e.form==='choice'?{answer:e.key,accepted:[e.key]}:e.contract?{answer:e.answer,accepted:c.accepted||[e.answer],inputHint:c.parts?'빈칸의 답을 쉼표로 나누어 차례대로 써요.':'짧은 낱말로 답해요.'}:{sample:e.answer,teacherRequired:true,reviewRequired:true,rubric:{required:[...e.required],pass:'뜻이 같은 짧은 답과 알맞은 이름표는 교사가 확인해요.'}}),seasonContract:c};}
export function mixtureMixedItems(rows,u){
 if(u!==unit||!rows?.length)return rows;let changed=false;
 const next=rows.map(q=>{const e=bankReview[q.id];if(!e||q.status!=='authored'||!(q.sourceRef?.type==='authored-supplement'||(q.sourceRef?.type==='authored-pair'&&q.sourceRef?.originalAuthoredType==='authored-supplement'))||!e.before.includes(fingerprint(q)))return q;changed=true;if(banks.has(q))return banks.get(q);
 const result={...q,prompt:e.prompt,explanation:e.explanation,misconception:e.misconception,responseContract:response(e),answerContract:answerContract(e),...(q.diagnosticOverride?{diagnosticOverride:{...q.diagnosticOverride,version:MIXTURE_MIXED_VERSION}}:{}),...(e.form?{bookResponseForm:e.form,taxonomy:{...q.taxonomy,format:labels[e.form]},choices:e.choices?clone(e.choices):null,diagnosticOverride:{version:MIXTURE_MIXED_VERSION,distractors:null,typed:null,cloze:null,cells:null}}:{}),mixtureMixedResponse:MIXTURE_MIXED_VERSION,contentVersion:MIXTURE_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};banks.set(q,result);return result;});return changed?next:rows;
}
export function withMixtureMixedClassroom(u,mod){if(u!==unit)return mod;const classroomItems=mixtureMixedItems(mod?.classroomItems,u);return classroomItems===mod.classroomItems?mod:{...mod,classroomItems};}
export function withMixtureMixedWorkbook(w){
 if(w?.unit!==unit||fingerprint(w)!==prior)return w;if(books.has(w))return books.get(w);
 const questions=w.questions.map(q=>{const e=review[q.no];if(!e||fingerprint(q)!==e.before)return q;const result={...q,prompt:e.prompt,answer:e.answer,explanation:e.explanation,misconception:e.misconception,requirements:[...e.required],criteria:e.required.join(' / '),responseContract:response(e),mixtureMixedResponse:MIXTURE_MIXED_VERSION,contentVersion:MIXTURE_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};for(const k of['form','choices','key','lines'])if(Object.hasOwn(e,k))result[k]=clone(e[k]);if(e.form){result.bookResponseForm=e.form;result.formLabel=e.form==='short'?'짧게 쓰기':labels[e.form];delete result.lines;}return result;});
 const revisePage=p=>{const first=p.blocks.flatMap(b=>b.ids||[])[0],n=Number(first?.slice(-3));return{...p,title:questionTitles[n]||p.title,blocks:p.blocks.map(b=>b.type==='text'&&b.text===studyMethodBefore?{...b,text:'개념과 예제로 혼합물을 나누는 방법을 알아보아요. 고르기·빈칸·짧은 답으로 확인하고, 까닭은 짧게 설명해요. 직접 분리한 모습은 관찰 표와 그림에 나타내고, 조사한 분리 장치를 친구에게 소개해요.'}:b)};};
 const pages=w.pages.map(revisePage),teacherStudentPages=w.teacherStudentPages.map(revisePage),teacherPages=w.teacherPages;
 const figures={...w.figures},byNo=new Map(questions.map(q=>[q.no,q]));for(const key of w.quickPages.flatMap(p=>p.blocks.filter(b=>b.type==='diagram').map(b=>b.key)))figures[key]=figures[key].replace(/(<tr><th scope="row">)(\d+)(<\/th><td>)([\s\S]*?)(<\/td><td>)([\s\S]*?)(<\/td><\/tr>)/g,(row,a,n,b,form,c,answer,d)=>{const q=byNo.get(Number(n));return review[n]||q.form==='choice'?a+n+b+(review[n]?labels[q.form]:form)+c+(q.form==='choice'?(Array.isArray(q.key)?q.key.map(i=>'①②③④⑤'[i]).join(', '):'①②③④⑤'[q.key]):q.form==='written'?'교사 확인':q.answer)+d:row;});
 const result={...w,questions,pages,teacherStudentPages,teacherPages,figures};books.set(w,result);return result;
}
