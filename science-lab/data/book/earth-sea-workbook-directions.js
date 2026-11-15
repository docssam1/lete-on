export const EARTH_SEA_WORKBOOK_DIRECTIONS_VERSION='20261115-earth-sea-workbook-directions';
// Reviewed organizing prompts; extension notes and assessment data stay separate.
const patches=[
  {
    "index": 16,
    "previous": {
      "section": "기본·적용 4~6",
      "title": "육지와 바다 비교",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s32-u02-w004",
            "c22-s32-u02-w005",
            "c22-s32-u02-w006"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "지구 전체에서는 바다가 육지보다 넓으며 강과 호수도 육지의 물이에요."
        },
        {
          "title": "더 알아보기",
          "text": "중학교에서는 해수·담수·빙하의 분포를 배워요. 지구에 물이 많아도 사람이 쉽게 이용할 수 있는 담수의 양과 위치는 따로 살펴야 해요."
        },
        {
          "title": "내가 정리할 것",
          "text": "바다와 육지의 물에서 공통점과 다른 점을 써요.",
          "write": 3
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [
      {
        "id": "c22-s32-u02-w004",
        "no": 4,
        "form": "choice",
        "topic": "육지와 바다",
        "prompt": "육지와 바다를 구별한 설명은 무엇인가요?",
        "answer": "① 산과 들은 육지이고 넓은 바닷물이 덮인 곳은 바다이다.",
        "explanation": "산과 들은 육지에서 볼 수 있고 바다는 바닷물이 덮인 넓은 곳이에요. 육지에도 강·호수의 물이 있어요. 물이 있거나 푸른색으로 보인다는 한 특징만으로 모두 바다라고 정하지 않아요.",
        "misconception": "내 주변에 땅이 많다는 것과 지구 전체에서 넓다는 것은 달라요.",
        "criteria": "질문의 조건에 맞는 자료와 설명이 연결되면 같은 뜻의 표현도 인정해요.",
        "sourceId": "c22-s32-u02-b09",
        "sourceRef": {
          "type": "authored-supplement",
          "edition": "GFIELD 지구와 바다 창작 학습",
          "course": "초등3-2"
        },
        "sourceContract": {
          "type": "single-choice",
          "answer": 4,
          "accepted": [
            4
          ]
        },
        "sourceGivens": null,
        "sourceExplanation": "산과 들은 육지에서 볼 수 있고 바다는 바닷물이 덮인 넓은 곳이에요. 육지에도 강·호수의 물이 있어요. 물이 있거나 푸른색으로 보인다는 한 특징만으로 모두 바다라고 정하지 않아요.",
        "standard": "4과06-01",
        "choices": [
          "산과 들은 육지이고 넓은 바닷물이 덮인 곳은 바다이다.",
          "강과 호수는 물이 있으므로 모두 바다에 속한다.",
          "육지에는 강이나 호수처럼 물이 있는 곳은 없다.",
          "푸른색으로 보이는 곳은 물의 종류와 관계없이 바다이다.",
          "땅이 낮은 곳은 바닷물이 없어도 모두 바다로 구별한다."
        ],
        "key": 0
      },
      {
        "id": "c22-s32-u02-w005",
        "no": 5,
        "form": "choice",
        "topic": "육지와 바다",
        "prompt": "지구 전체 표면의 육지와 바다 넓이를 비교한 설명은 무엇인가요?",
        "answer": "③ 지구 전체에서는 바다가 육지보다 넓다.",
        "explanation": "지구 전체 표면에서는 바다가 육지보다 넓어요. 전체 표면을 나타낸 자료에서 육지와 바다의 표시를 확인하며 넓이를 비교해 보아요.",
        "misconception": "내 주변에 땅이 많다는 것과 지구 전체에서 넓다는 것은 달라요.",
        "criteria": "질문의 조건에 맞는 자료와 설명이 연결되면 같은 뜻의 표현도 인정해요.",
        "sourceId": "c22-s32-u02-b11",
        "sourceRef": {
          "type": "authored-supplement",
          "edition": "GFIELD 지구와 바다 창작 학습",
          "course": "초등3-2"
        },
        "sourceContract": {
          "type": "single-choice",
          "answer": 3,
          "accepted": [
            3
          ]
        },
        "sourceGivens": null,
        "sourceExplanation": "지구 전체 표면을 비교하면 바다가 육지보다 넓어요. 한 동네나 한쪽 사진은 지구 표면의 일부이므로 그것만으로 전체 넓이의 관계를 정하지 않아요. 정확한 비율 암기는 요구하지 않아요.",
        "standard": "4과06-01",
        "choices": [
          "지구 전체에서는 육지가 바다보다 넓다.",
          "지구 전체에서는 육지와 바다의 넓이가 같다.",
          "지구 전체에서는 바다가 육지보다 넓다.",
          "한 동네에 땅이 많으면 지구 전체도 육지가 더 넓다.",
          "지구 한쪽 사진에 보이는 넓이만으로 전체를 정한다."
        ],
        "key": 2
      },
      {
        "id": "c22-s32-u02-w006",
        "no": 6,
        "form": "choice",
        "topic": "육지와 바다",
        "prompt": "강과 호수의 물에 대한 설명으로 알맞은 것은 무엇인가요?",
        "answer": "② 강과 호수의 물은 육지에 있는 물로 구별한다.",
        "explanation": "강과 호수는 육지에 있는 물의 예예요. 물이 있거나 사진에서 푸르게 보인다는 이유로 바다라고 정하지 않아요. 맑은 모습만으로 녹아 있는 물질이 없는지도 확정할 수 없어요.",
        "misconception": "내 주변에 땅이 많다는 것과 지구 전체에서 넓다는 것은 달라요.",
        "criteria": "질문의 조건에 맞는 자료와 설명이 연결되면 같은 뜻의 표현도 인정해요.",
        "sourceId": "c22-s32-u02-b13",
        "sourceRef": {
          "type": "authored-supplement",
          "edition": "GFIELD 지구와 바다 창작 학습",
          "course": "초등3-2"
        },
        "sourceContract": {
          "type": "single-choice",
          "answer": 0,
          "accepted": [
            0
          ]
        },
        "sourceGivens": null,
        "sourceExplanation": "강과 호수는 육지에 있는 물의 예예요. 물이 있거나 사진에서 푸르게 보인다는 이유로 바다라고 정하지 않아요. 맑은 모습만으로 녹아 있는 물질이 없는지도 확정할 수 없어요.",
        "standard": "4과06-01",
        "choices": [
          "강과 호수는 물이 있으므로 모두 바다로 구별한다.",
          "강과 호수의 물은 육지에 있는 물로 구별한다.",
          "강이 바다에 이어지면 강 전체를 바닷물로 구별한다.",
          "맑은 호수의 물은 녹은 물질이 없는 물로 단정한다.",
          "사진에서 푸른 물은 장소와 관계없이 바닷물로 정한다."
        ],
        "key": 1
      }
    ],
    "fields": [
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "바다와 육지의 물에서 공통점과 다른 점을 써요.",
        "value": "육지에 있는 물의 예를 쓰고, 지구 전체에서 육지와 바다 중 더 넓은 쪽을 적어요."
      }
    ]
  },
  {
    "index": 17,
    "previous": {
      "section": "기본·적용 7~8",
      "title": "자료의 전체와 일부",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s32-u02-w007",
            "c22-s32-u02-w008"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "일부 지역과 지구 전체를 살핀 자료의 범위를 비교해요."
        },
        {
          "title": "더 알아보기",
          "text": "중학교에서는 지하수도 수권의 일부로 살펴요. 지표 사진에 잘 보이지 않는 땅속에도 물이 있어, 물의 분포는 표면 사진만으로 모두 알 수 없어요."
        },
        {
          "title": "내가 정리할 것",
          "text": "사진에서 볼 수 있는 물과 사진만으로 알 수 없어 더 조사할 물을 나누어 쓰세요.",
          "write": 3
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [
      {
        "id": "c22-s32-u02-w007",
        "no": 7,
        "form": "choice",
        "topic": "전체와 일부 자료",
        "prompt": "지구 전체의 육지와 바다 넓이를 비교할 때 알맞은 자료는 무엇인가요?",
        "answer": "⑤ 지구 전체 표면의 육지와 바다를 비교한 자료",
        "explanation": "질문은 지구 전체의 육지와 바다 넓이를 묻고 있어요. 동네·한쪽 반구·특정 바다·육지만 모은 자료는 필요한 전체 범위를 채우지 못해요. 전체 표면을 같은 기준으로 다룬 자료를 골라요.",
        "misconception": "사진 크기나 한쪽 반구만으로 지구 전체 넓이를 정하지 않아요.",
        "criteria": "질문의 조건에 맞는 자료와 설명이 연결되면 같은 뜻의 표현도 인정해요.",
        "sourceId": "c22-s32-u02-b17",
        "sourceRef": {
          "type": "authored-supplement",
          "edition": "GFIELD 지구와 바다 창작 학습",
          "course": "초등3-2"
        },
        "sourceContract": {
          "type": "single-choice",
          "answer": 0,
          "accepted": [
            0
          ]
        },
        "sourceGivens": null,
        "sourceExplanation": "질문은 지구 전체의 육지와 바다 넓이를 묻고 있어요. 동네·한쪽 반구·특정 바다·육지만 모은 자료는 필요한 전체 범위를 채우지 못해요. 전체 표면을 같은 기준으로 다룬 자료를 골라요.",
        "standard": "4과06-01",
        "choices": [
          "우리 동네 전체의 육지와 물이 보이는 자료",
          "한쪽 반구만 보이는 지구 사진을 확대한 자료",
          "큰 바다 한 곳의 물만 빠짐없이 담은 자료",
          "육지 부분만 모아서 여러 장으로 만든 자료",
          "지구 전체 표면의 육지와 바다를 비교한 자료"
        ],
        "key": 4
      },
      {
        "id": "c22-s32-u02-w008",
        "no": 8,
        "form": "choice",
        "topic": "전체와 일부 자료",
        "prompt": "가에는 한 지역의 사진, 나에는 지구 전체의 자료가 있어요. 두 자료를 바르게 설명한 것을 고르세요.",
        "answer": "③ 지구 전체의 육지와 바다 비교에는 나를 쓴다.",
        "explanation": "표에서 가는 한 지역, 나는 지구 전체를 다룬 자료예요. 전체 비교라는 질문에는 나의 범위가 맞아요. 사진 크기나 인쇄 크기가 같아도 조사 범위가 같아지는 것은 아니에요.",
        "misconception": "사진 크기나 한쪽 반구만으로 지구 전체 넓이를 정하지 않아요.",
        "criteria": "질문의 조건에 맞는 자료와 설명이 연결되면 같은 뜻의 표현도 인정해요.",
        "sourceId": "c22-s32-u02-b18",
        "sourceRef": {
          "type": "authored-supplement",
          "edition": "GFIELD 지구와 바다 창작 학습",
          "course": "초등3-2"
        },
        "sourceContract": {
          "type": "single-choice",
          "answer": 1,
          "accepted": [
            1
          ]
        },
        "sourceGivens": {
          "표": {
            "머리": [
              "자료 범위",
              "육지와 바다의 모습"
            ],
            "행": [
              [
                "가 지역 사진",
                "대부분 땅이 보임"
              ],
              [
                "나 지구 전체 자료",
                "바다 부분이 더 넓음"
              ]
            ]
          },
          "안내": "문제 해석을 위한 가상 관찰 기록이며 직접 관찰한 결과가 아니에요."
        },
        "sourceExplanation": "표에서 가는 한 지역, 나는 지구 전체를 다룬 자료예요. 전체 비교라는 질문에는 나의 범위가 맞아요. 사진 크기나 인쇄 크기가 같아도 조사 범위가 같아지는 것은 아니에요.",
        "standard": "4과06-01",
        "figure": "given-c22-s32-u02-b18",
        "choices": [
          "가에 땅이 많으므로 지구 전체도 육지가 더 넓다.",
          "가 사진을 크게 인쇄하면 나와 같은 조사 범위가 된다.",
          "지구 전체의 육지와 바다 비교에는 나를 쓴다.",
          "나의 바다를 셀 때에는 구름을 모두 바다에 더한다.",
          "가와 나의 종이 크기가 같으면 나타내는 범위도 같다."
        ],
        "key": 2
      }
    ],
    "fields": [
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "사진에서 볼 수 있는 물과 사진만으로 알 수 없어 더 조사할 물을 나누어 쓰세요.",
        "value": "한 지역 사진으로 지구 전체의 넓이를 비교하기 어려운 까닭을 써요."
      }
    ]
  },
  {
    "index": 24,
    "previous": {
      "section": "확인 25~26",
      "title": "대기와 두 물의 결과",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s32-u02-w025",
            "c22-s32-u02-w026"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "대기의 뜻과 두 물을 비교하여 실제로 확인한 결과를 정리해요."
        },
        {
          "title": "더 알아보기",
          "text": "4학년에서는 공기가 여러 가지 기체로 이루어져 있음을 알아보아요. 대기에는 질소·산소 등 여러 기체가 있으며 각각의 성질과 쓰임을 살피게 돼요."
        },
        {
          "title": "내가 정리할 것",
          "text": "공기가 눈에 보이는지와 공기가 있다는 것을 어떻게 알 수 있는지는 다른 질문이에요. 각각 설명해 보세요.",
          "write": 3
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [
      {
        "id": "c22-s32-u02-w025",
        "no": 25,
        "form": "multi",
        "topic": "지구를 둘러싼 대기",
        "prompt": "대기에 대한 알맞은 설명 두 가지를 고르세요. (정답 2개)",
        "answer": "②, ⑤",
        "explanation": "대기는 지구 주위를 둘러싼 공기이며 바다 위에도 있어요. 바람이 멈추거나 구름이 없어도 공기는 있어요. 공기와 바닷물은 서로 다른 물질이에요.",
        "misconception": "맑고 구름이 없어도 육지와 바다 위에 공기가 있어요.",
        "criteria": "질문의 조건에 맞는 자료와 설명이 연결되면 같은 뜻의 표현도 인정해요.",
        "choices": [
          "공기는 바람이 부는 동안에만 존재한다.",
          "바다 위에도 공기가 있다.",
          "구름 없는 맑은 곳에는 공기가 없다.",
          "육지 위의 공기를 바닷물의 한 종류라고 한다.",
          "지구 주위를 둘러싼 공기를 대기라고 한다."
        ],
        "key": [
          1,
          4
        ],
        "sourceId": "c22-s32-u02-b06",
        "sourceRef": {
          "type": "authored-supplement",
          "edition": "GFIELD 지구와 바다 창작 학습",
          "course": "초등3-2"
        },
        "sourceContract": {
          "type": "multi-choice",
          "answers": [
            1,
            4
          ]
        },
        "sourceGivens": null,
        "sourceExplanation": "대기는 지구 주위를 둘러싼 공기이며 바다 위에도 있어요. 바람이 멈추거나 구름이 없어도 공기는 있어요. 공기와 바닷물은 서로 다른 물질이에요.",
        "standard": "4과06-01"
      },
      {
        "id": "c22-s32-u02-w026",
        "no": 26,
        "form": "multi",
        "topic": "물에 녹아 있는 물질",
        "prompt": "두 종류의 물을 가열한 결과에서 확인한 사실 두 가지를 고르세요. (정답 2개)",
        "answer": "①, ④",
        "explanation": "표에서 가 바닷물에는 흰 물질이 남았고, 나 수돗물에는 눈에 띄는 남은 물질이 매우 적었다고 했어요. 관찰한 두 내용을 그대로 읽은 첫째와 넷째 보기가 알맞아요.",
        "misconception": "투명한 물에도 물질이 녹아 있을 수 있어요. 흰색만으로 성분을 확정하지 않아요.",
        "criteria": "질문의 조건에 맞는 자료와 설명이 연결되면 같은 뜻의 표현도 인정해요.",
        "choices": [
          "나 수돗물을 가열한 뒤 남은 물질은 눈에 잘 안 띄었다.",
          "남은 것이 적게 보였으므로 육지의 물에는 녹아 있는 물질이 없다.",
          "가에 흰 물질이 남았으므로 남은 것은 모두 소금 한 가지이다.",
          "가 바닷물을 가열한 뒤 흰 물질이 남았다.",
          "표를 읽은 사람은 모두 두 종류의 물을 직접 가열한 것이다."
        ],
        "key": [
          0,
          3
        ],
        "sourceId": "c22-s32-u02-b30",
        "sourceRef": {
          "type": "authored-supplement",
          "edition": "GFIELD 지구와 바다 창작 학습",
          "course": "초등3-2"
        },
        "sourceContract": {
          "type": "multi-choice",
          "answers": [
            0,
            3
          ]
        },
        "sourceGivens": {
          "표": {
            "머리": [
              "같은 양을 담은 시료",
              "가열 뒤 관찰한 내용"
            ],
            "행": [
              [
                "가 바닷물",
                "물의 양이 줄고 흰 물질이 남음"
              ],
              [
                "나 수돗물",
                "눈에 띄는 남은 물질이 매우 적음"
              ]
            ]
          },
          "안내": "문제 해석을 위한 가상 관찰 기록이며 직접 관찰한 결과가 아니에요."
        },
        "sourceExplanation": "표의 가와 나에서 관찰한 내용은 흰 물질이 남음과 눈에 잘 안 띔이에요. 이 가상 자료는 모든 육지의 물의 성분이나 흰 물질의 순도, 자료를 읽은 사람의 실제 수행을 증명하지 않아요.",
        "standard": "4과06-02",
        "figure": "given-c22-s32-u02-b30"
      }
    ],
    "fields": [
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "공기가 눈에 보이는지와 공기가 있다는 것을 어떻게 알 수 있는지는 다른 질문이에요. 각각 설명해 보세요.",
        "value": "대기가 있는 곳과 두 물의 가열 결과를 나누어 정리해요."
      }
    ]
  },
  {
    "index": 26,
    "previous": {
      "section": "확인 29~30",
      "title": "대기와 지구 표면",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s32-u02-w029",
            "c22-s32-u02-w030"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "대기는 지구 둘레에 있으며 지구 표면에서 바다가 차지하는 넓이를 비교해요."
        },
        {
          "title": "더 알아보기",
          "text": "중학교에서는 지구를 지권·수권·기권 등이 서로 영향을 주는 계로 살펴요. 바다에서 증발한 물이 대기로 이동하는 일도 그 연결의 한 예예요."
        },
        {
          "title": "내가 정리할 것",
          "text": "바다에서 대기로, 또는 대기에서 바다로 어떤 물질이 옮겨 갈 수 있을지 생각해 보세요.",
          "write": 3
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [
      {
        "id": "c22-s32-u02-w029",
        "no": 29,
        "form": "short",
        "topic": "지구를 둘러싼 대기",
        "prompt": "지구를 둘러싼 공기의 이름을 쓰세요.",
        "answer": "대기",
        "explanation": "‘지구를 둘러싼 공기’라는 뜻에 맞는 이름은 대기예요. 구름은 공기 전체의 이름이 아니고, 바람은 공기의 움직임을 나타내는 말이에요.",
        "misconception": "맑고 구름이 없어도 육지와 바다 위에 공기가 있어요.",
        "criteria": "질문의 조건에 맞는 자료와 설명이 연결되면 같은 뜻의 표현도 인정해요.",
        "sourceId": "c22-s32-u02-b07",
        "sourceRef": {
          "type": "authored-supplement",
          "edition": "GFIELD 지구와 바다 창작 학습",
          "course": "초등3-2"
        },
        "sourceContract": {
          "type": "short-text",
          "answer": "대기",
          "accepted": [
            "대기"
          ]
        },
        "sourceGivens": null,
        "sourceExplanation": "‘지구를 둘러싼 공기’라는 뜻에 맞는 이름은 대기예요. 구름은 공기 전체의 이름이 아니고, 바람은 공기의 움직임을 나타내는 말이에요.",
        "standard": "4과06-01",
        "accepted": [
          "대기"
        ]
      },
      {
        "id": "c22-s32-u02-w030",
        "no": 30,
        "form": "short",
        "topic": "육지와 바다",
        "prompt": "지구 표면에서 육지보다 넓은 쪽을 골라 쓰세요.",
        "answer": "바다",
        "explanation": "보기의 육지와 바다를 지구 전체 범위에서 비교하면 바다가 더 넓어요. 집 주변이나 한 지역의 사진에서 보이는 땅의 넓이로 지구 전체를 대신하지 않아요.",
        "misconception": "내 주변에 땅이 많다는 것과 지구 전체에서 넓다는 것은 달라요.",
        "criteria": "질문의 조건에 맞는 자료와 설명이 연결되면 같은 뜻의 표현도 인정해요.",
        "sourceId": "c22-s32-u02-b15",
        "sourceRef": {
          "type": "authored-supplement",
          "edition": "GFIELD 지구와 바다 창작 학습",
          "course": "초등3-2"
        },
        "sourceContract": {
          "type": "short-text",
          "answer": "바다",
          "accepted": [
            "바다"
          ]
        },
        "sourceGivens": {
          "보기": [
            "육지",
            "바다"
          ]
        },
        "sourceExplanation": "보기의 육지와 바다를 지구 전체 범위에서 비교하면 바다가 더 넓어요. 집 주변이나 한 지역의 사진에서 보이는 땅의 넓이로 지구 전체를 대신하지 않아요.",
        "standard": "4과06-01",
        "figure": "given-c22-s32-u02-b15",
        "accepted": [
          "바다"
        ]
      }
    ],
    "fields": [
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "바다에서 대기로, 또는 대기에서 바다로 어떤 물질이 옮겨 갈 수 있을지 생각해 보세요.",
        "value": "대기가 무엇인지 설명해요. 육지와 바다의 넓이는 어느 범위에서 비교해야 할까요?"
      }
    ]
  },
  {
    "index": 40,
    "previous": {
      "section": "단답형",
      "title": "짧게 답하고 이유 붙이기",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s32-u02-w061",
            "c22-s32-u02-w062",
            "c22-s32-u02-w063",
            "c22-s32-u02-w064"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "물의 양을 맞춘 비교와 물 높이 변화, 갯벌의 가치를 짧게 설명해요."
        },
        {
          "title": "더 알아보기",
          "text": "5~6학년에서는 생활에서 이용하는 물 자원을 조사해요. 바닷물은 육지의 담수와 성질이 달라, 필요한 쓰임에 맞추어 처리하고 이용해야 하는 경우가 있어요."
        },
        {
          "title": "내가 정리할 것",
          "text": "바닷물과 육지의 물을 서로 다르게 이용하는 예를 생각해요.",
          "write": 3
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [
      {
        "id": "c22-s32-u02-w061",
        "no": 61,
        "form": "short",
        "topic": "대기의 범위",
        "prompt": "‘바다 위에는 대기가 없다’는 말이 맞을까요? 맞는지 쓰고, 바른 설명으로 고쳐 쓰세요.",
        "answer": "아니다. 바다 위에도 대기가 있다",
        "explanation": "대기는 지구를 둘러싼 공기이므로 육지 위와 바다 위에 모두 있어요. 바다 위에도 대기가 있다는 내용으로 고쳐 써요.",
        "misconception": "자료에 나온 장소와 관찰 조건을 살피고, 알게 된 것과 더 알아볼 것을 구별해요.",
        "criteria": "질문의 조건에 맞는 자료와 설명이 연결되면 같은 뜻의 표현도 인정해요.",
        "standard": "4과06-01",
        "status": "authored",
        "sourceRef": {
          "type": "authored-workbook",
          "unit": "c22-s32-u02",
          "originalCounterpart": false
        },
        "responseContract": {
          "type": "short",
          "teacherRequired": false,
          "orderSensitive": false
        }
      },
      {
        "id": "c22-s32-u02-w062",
        "no": 62,
        "form": "short",
        "topic": "조건 통제",
        "prompt": "바닷물 10 mL와 수돗물 40 mL를 가열해 남는 물질을 비교하려고 해요. 먼저 같게 맞출 조건 한 가지를 쓰세요.",
        "answer": "처음 물의 양",
        "explanation": "바닷물 10 mL와 수돗물 40 mL는 처음 물의 양이 달라요. 물의 종류에 따른 차이를 비교하려면 먼저 두 물의 양을 같게 맞추어요.",
        "misconception": "자료에 나온 장소와 관찰 조건을 살피고, 알게 된 것과 더 알아볼 것을 구별해요.",
        "criteria": "질문의 조건에 맞는 자료와 설명이 연결되면 같은 뜻의 표현도 인정해요.",
        "standard": "4과06-02",
        "status": "authored",
        "sourceRef": {
          "type": "authored-workbook",
          "unit": "c22-s32-u02",
          "originalCounterpart": false
        },
        "responseContract": {
          "type": "short",
          "teacherRequired": false,
          "orderSensitive": false
        }
      },
      {
        "id": "c22-s32-u02-w063",
        "no": 63,
        "form": "short",
        "topic": "자료 읽기",
        "prompt": "같은 바닷가의 물 높이가 낮음 → 중간 → 높음으로 변했어요. 이 변화의 이름을 쓰세요.",
        "answer": "밀물",
        "explanation": "같은 해안에서 물 높이가 낮음에서 중간, 높음으로 변했으므로 높아지는 변화예요. 바닷물이 들어오며 높아지는 밀물과 연결해요.",
        "misconception": "자료에 나온 장소와 관찰 조건을 살피고, 알게 된 것과 더 알아볼 것을 구별해요.",
        "criteria": "질문의 조건에 맞는 자료와 설명이 연결되면 같은 뜻의 표현도 인정해요.",
        "standard": "4과06-03",
        "status": "authored",
        "sourceRef": {
          "type": "authored-workbook",
          "unit": "c22-s32-u02",
          "originalCounterpart": false
        },
        "responseContract": {
          "type": "short",
          "teacherRequired": false,
          "orderSensitive": false
        }
      },
      {
        "id": "c22-s32-u02-w064",
        "no": 64,
        "form": "short",
        "topic": "보전 이유",
        "prompt": "자료에는 갯벌에서 게와 조개가 살고 물새가 먹이를 찾는다고 쓰여 있어요. 갯벌이 주는 도움 한 가지를 쓰세요.",
        "answer": "생물의 삶터 또는 먹이 활동 장소",
        "explanation": "게와 조개가 사는 모습은 생물의 삶터라는 가치를, 물새가 먹이를 찾는 모습은 먹이를 구하는 장소라는 가치를 보여 줘요. 자료에 맞는 가치 한 가지를 골라 설명해요.",
        "misconception": "자료에 나온 장소와 관찰 조건을 살피고, 알게 된 것과 더 알아볼 것을 구별해요.",
        "criteria": "질문의 조건에 맞는 자료와 설명이 연결되면 같은 뜻의 표현도 인정해요.",
        "standard": "4과06-03",
        "status": "authored",
        "sourceRef": {
          "type": "authored-workbook",
          "unit": "c22-s32-u02",
          "originalCounterpart": false
        },
        "responseContract": {
          "type": "short",
          "teacherRequired": false,
          "orderSensitive": false
        }
      }
    ],
    "fields": [
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "바닷물과 육지의 물을 서로 다르게 이용하는 예를 생각해요.",
        "value": "61~64번 중 한 문제를 골라 답을 정한 까닭을 써요."
      }
    ]
  },
  {
    "index": 41,
    "previous": {
      "section": "연결 65~66",
      "title": "이름·질문·근거를 연결해요",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s32-u02-w065",
            "c22-s32-u02-w066"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "대기와 해안 변화의 이름을 각각의 특징에 맞게 연결해요."
        },
        {
          "title": "더 알아보기",
          "text": "5~6학년에서는 이슬·안개·구름의 공통점과 차이점을 배워요. 대기 중 수증기가 작은 물방울로 변하는 현상도 어디에서 생기는지에 따라 다르게 보여요."
        },
        {
          "title": "내가 정리할 것",
          "text": "대기와 구름, 바닷물의 변화를 서로 구별해 써요.",
          "write": 3
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [
      {
        "id": "c22-s32-u02-w065",
        "no": 65,
        "form": "match",
        "topic": "모습과 이름",
        "prompt": "설명에 맞는 이름 기호를 연결해요.",
        "answer": "(1) ㄴ (2) ㄷ (3) ㄱ",
        "explanation": "지구를 둘러싼 공기는 대기인 ㄴ, 모래가 펼쳐진 바닷가는 모래사장인 ㄷ이에요. 물이 빠져 진흙 바닥이 드러난 모습은 이 자료의 갯벌인 ㄱ이므로 (1) ㄴ, (2) ㄷ, (3) ㄱ으로 연결해요.",
        "misconception": "자료에 나온 장소와 관찰 조건을 살피고, 알게 된 것과 더 알아볼 것을 구별해요.",
        "criteria": "질문의 조건에 맞는 자료와 설명이 연결되면 같은 뜻의 표현도 인정해요.",
        "parts": [
          "(1) 지구를 둘러싼 공기",
          "(2) 모래가 펼쳐진 바닷가",
          "(3) 바닷물이 빠졌을 때 넓게 드러나는 진흙 바닥"
        ],
        "answerPerPart": true,
        "given": [
          "〈보기〉 ㄱ. 갯벌  ㄴ. 대기  ㄷ. 모래사장"
        ],
        "standard": "4과06-01",
        "status": "authored",
        "sourceRef": {
          "type": "authored-workbook",
          "unit": "c22-s32-u02",
          "originalCounterpart": false
        },
        "responseContract": {
          "type": "match",
          "teacherRequired": false,
          "orderSensitive": false
        }
      },
      {
        "id": "c22-s32-u02-w066",
        "no": 66,
        "form": "match",
        "topic": "밀물과 썰물",
        "prompt": "같은 장소의 변화와 이름을 연결해요.",
        "answer": "(1) ㄴ (2) ㄱ",
        "explanation": "바닷물이 들어오며 높아지는 것은 밀물인 ㄴ, 빠져나가며 낮아지는 것은 썰물인 ㄱ이에요. 따라서 (1) ㄴ, (2) ㄱ으로 연결해요.",
        "misconception": "자료에 나온 장소와 관찰 조건을 살피고, 알게 된 것과 더 알아볼 것을 구별해요.",
        "criteria": "질문의 조건에 맞는 자료와 설명이 연결되면 같은 뜻의 표현도 인정해요.",
        "parts": [
          "(1) 바닷물이 들어오며 높아짐",
          "(2) 바닷물이 빠져나가며 낮아짐"
        ],
        "answerPerPart": true,
        "given": [
          "〈보기〉 ㄱ. 썰물  ㄴ. 밀물"
        ],
        "standard": "4과06-03",
        "status": "authored",
        "sourceRef": {
          "type": "authored-workbook",
          "unit": "c22-s32-u02",
          "originalCounterpart": false
        },
        "responseContract": {
          "type": "match",
          "teacherRequired": false,
          "orderSensitive": false
        }
      }
    ],
    "fields": [
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "대기와 구름, 바닷물의 변화를 서로 구별해 써요.",
        "value": "밀물과 썰물일 때 물 높이가 각각 어떻게 달라지는지 써요."
      }
    ]
  },
  {
    "index": 42,
    "previous": {
      "section": "연결 67~68",
      "title": "이름·질문·근거를 연결해요",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s32-u02-w067",
            "c22-s32-u02-w068"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "알아보려는 질문에 맞는 자료와 비교 조건의 역할을 연결해요."
        },
        {
          "title": "더 알아보기",
          "text": "중학교에서는 수온과 염분의 분포를 해석해요. 같은 바다라도 표면과 깊은 곳의 온도가 다를 수 있어, 어느 깊이의 물인지도 중요한 정보예요."
        },
        {
          "title": "내가 정리할 것",
          "text": "물의 특징을 더 조사할 때 함께 기록할 장소와 깊이를 적어요.",
          "write": 3
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [
      {
        "id": "c22-s32-u02-w067",
        "no": 67,
        "form": "match",
        "topic": "질문과 자료",
        "prompt": "알아보려는 질문에 맞는 자료를 연결해요.",
        "answer": "(1) ㄷ (2) ㄱ (3) ㄴ",
        "explanation": "지구 전체의 넓이 비교에는 전 지구 표면 자료인 ㄷ, 같은 해안의 높이 변화에는 시간별 높이인 ㄱ이 필요해요. 갯벌의 가치에는 생물의 생활 자료인 ㄴ을 연결하므로 (1) ㄷ, (2) ㄱ, (3) ㄴ이에요.",
        "misconception": "자료에 나온 장소와 관찰 조건을 살피고, 알게 된 것과 더 알아볼 것을 구별해요.",
        "criteria": "질문의 조건에 맞는 자료와 설명이 연결되면 같은 뜻의 표현도 인정해요.",
        "parts": [
          "(1) 지구 전체에서 어느 쪽이 넓을까?",
          "(2) 이 해안의 물 높이는 어떻게 변할까?",
          "(3) 갯벌은 생물에게 어떤 가치가 있을까?"
        ],
        "answerPerPart": true,
        "given": [
          "〈보기〉 ㄱ. 같은 해안의 시간별 높이  ㄴ. 갯벌 생물의 생활 자료  ㄷ. 전 지구 표면 자료"
        ],
        "standard": "4과06-01",
        "status": "authored",
        "sourceRef": {
          "type": "authored-workbook",
          "unit": "c22-s32-u02",
          "originalCounterpart": false
        },
        "responseContract": {
          "type": "match",
          "teacherRequired": false,
          "orderSensitive": false
        }
      },
      {
        "id": "c22-s32-u02-w068",
        "no": 68,
        "form": "match",
        "topic": "실험의 조건",
        "prompt": "두 종류의 물을 비교하는 실험이에요. 관찰할 결과, 바꿀 조건, 같게 할 조건을 찾아 연결하세요.",
        "answer": "(1) ㄴ (2) ㄷ (3) ㄱ",
        "explanation": "물의 종류는 바꿀 조건인 ㄴ, 처음 양과 접시 조건은 같게 둘 조건인 ㄷ이에요. 물이 마른 뒤 남은 모습은 관찰할 결과인 ㄱ이므로 (1) ㄴ, (2) ㄷ, (3) ㄱ이에요.",
        "misconception": "자료에 나온 장소와 관찰 조건을 살피고, 알게 된 것과 더 알아볼 것을 구별해요.",
        "criteria": "질문의 조건에 맞는 자료와 설명이 연결되면 같은 뜻의 표현도 인정해요.",
        "parts": [
          "(1) 바닷물과 수돗물",
          "(2) 처음 담는 양과 접시 조건",
          "(3) 물이 마른 뒤 남은 것의 모습"
        ],
        "answerPerPart": true,
        "given": [
          "〈보기〉 ㄱ. 관찰할 결과  ㄴ. 바꿀 조건  ㄷ. 같게 둘 조건"
        ],
        "standard": "4과06-02",
        "status": "authored",
        "sourceRef": {
          "type": "authored-workbook",
          "unit": "c22-s32-u02",
          "originalCounterpart": false
        },
        "responseContract": {
          "type": "match",
          "teacherRequired": false,
          "orderSensitive": false
        }
      }
    ],
    "fields": [
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "물의 특징을 더 조사할 때 함께 기록할 장소와 깊이를 적어요.",
        "value": "두 물을 비교할 때 바꿀 것, 같게 할 것, 관찰할 결과를 나누어 써요."
      }
    ]
  },
  {
    "index": 43,
    "previous": {
      "section": "연결 69~70",
      "title": "이름·질문·근거를 연결해요",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s32-u02-w069",
            "c22-s32-u02-w070"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "바닷가의 특징과 생물의 가치를 지킬 행동을 연결해요."
        },
        {
          "title": "더 알아보기",
          "text": "4학년에서는 생태계 보전을 위한 일을 토의해요. 생물이 사는 곳의 물·흙·먹이 관계가 이어져 있으므로 한 부분의 변화를 다른 부분과 함께 생각해요."
        },
        {
          "title": "내가 정리할 것",
          "text": "사진에서 어떤 모습을 보고 그 보전 행동을 제안했는지 쓰세요.",
          "write": 3
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [
      {
        "id": "c22-s32-u02-w069",
        "no": 69,
        "form": "match",
        "topic": "지형의 특징",
        "prompt": "바닷가 설명을 이름과 연결해요.",
        "answer": "(1) ㄴ (2) ㄱ (3) ㄷ",
        "explanation": "높고 가파른 바위는 바위 절벽인 ㄴ, 모래가 넓게 펼쳐진 곳은 모래사장인 ㄱ과 연결해요. 물이 빠졌을 때 진흙 바닥이 넓게 드러난 모습은 갯벌인 ㄷ이므로 (1) ㄴ, (2) ㄱ, (3) ㄷ이에요.",
        "misconception": "자료에 나온 장소와 관찰 조건을 살피고, 알게 된 것과 더 알아볼 것을 구별해요.",
        "criteria": "질문의 조건에 맞는 자료와 설명이 연결되면 같은 뜻의 표현도 인정해요.",
        "parts": [
          "(1) 높고 가파른 바위가 보임",
          "(2) 모래가 넓게 펼쳐짐",
          "(3) 물 빠진 때 진흙 바닥이 넓게 드러남"
        ],
        "answerPerPart": true,
        "given": [
          "〈보기〉 ㄱ. 모래사장  ㄴ. 바위 절벽  ㄷ. 갯벌"
        ],
        "standard": "4과06-02",
        "status": "authored",
        "sourceRef": {
          "type": "authored-workbook",
          "unit": "c22-s32-u02",
          "originalCounterpart": false
        },
        "responseContract": {
          "type": "match",
          "teacherRequired": false,
          "orderSensitive": false
        }
      },
      {
        "id": "c22-s32-u02-w070",
        "no": 70,
        "form": "match",
        "topic": "가치와 보전 행동",
        "prompt": "갯벌이 도움을 주는 점과 갯벌을 지키는 행동을 연결하세요.",
        "answer": "(1) ㄴ (2) ㄱ",
        "explanation": "물새의 먹이 활동은 쫓지 않고 떨어져 관찰하는 ㄴ과 연결해요. 게와 조개가 사는 바닥은 생물과 굴을 함부로 훼손하지 않는 ㄱ을 연결하므로 (1) ㄴ, (2) ㄱ이에요.",
        "misconception": "자료에 나온 장소와 관찰 조건을 살피고, 알게 된 것과 더 알아볼 것을 구별해요.",
        "criteria": "질문의 조건에 맞는 자료와 설명이 연결되면 같은 뜻의 표현도 인정해요.",
        "parts": [
          "(1) 물새가 먹이를 찾는 장소",
          "(2) 게와 조개가 사는 바닥"
        ],
        "answerPerPart": true,
        "given": [
          "〈보기〉 ㄱ. 생물과 굴을 함부로 훼손하지 않기  ㄴ. 물새를 쫓지 않고 떨어져 관찰하기"
        ],
        "standard": "4과06-03",
        "status": "authored",
        "sourceRef": {
          "type": "authored-workbook",
          "unit": "c22-s32-u02",
          "originalCounterpart": false
        },
        "responseContract": {
          "type": "match",
          "teacherRequired": false,
          "orderSensitive": false
        }
      }
    ],
    "fields": [
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "사진에서 어떤 모습을 보고 그 보전 행동을 제안했는지 쓰세요.",
        "value": "갯벌에서 살아가는 생물 한 가지를 골라, 그 생물을 지킬 행동과 까닭을 써요."
      }
    ]
  }
];
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),clone=x=>JSON.parse(JSON.stringify(x));
export function withEarthSeaWorkbookDirections(workbook){
 if(workbook?.unit!=='c22-s32-u02'||!Array.isArray(workbook.pages))return workbook;
 let changed=false;
 const replace=page=>{
  const p=patches.find(p=>p.previous.title===page.title&&p.previous.section===page.section&&same(page,p.previous)&&p.questions.every(old=>same(workbook.questions?.find(q=>q.id===old.id),old)));
  if(!p)return page;
  changed=true;const next=clone(page);for(const{path,value}of p.fields){let at=next;for(const key of path.slice(0,-1))at=at[key];at[path.at(-1)]=value;}return next;
 };
 const pages=workbook.pages.map(replace),teacherStudentPages=workbook.teacherStudentPages?.map(replace);
 return changed?{...workbook,pages,...(teacherStudentPages?{teacherStudentPages}:{})}:workbook;
}
