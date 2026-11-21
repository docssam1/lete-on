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
export const EARTH_SEA_WORKBOOK_FEEDBACK_VERSION='20261116-earth-sea-workbook-feedback';
// Reviewed question-specific notes. Preserve every answer contract and future edit.
const feedbackNotes={
  "c22-s32-u02-w049": {
    "previous": {
      "id": "c22-s32-u02-w049",
      "no": 49,
      "form": "blank",
      "topic": "녹은 물질",
      "prompt": "바닷물을 가열하여 물의 양이 줄어들면 [ ] 같은 녹아 있던 물질이 남을 수 있어요.",
      "answer": "소금",
      "explanation": "바닷물에는 소금 등 여러 물질이 녹아 있어요. 가열하여 물이 줄어들면 녹아 있던 물질이 남을 수 있으므로 빈칸에는 대표적인 예인 소금을 써요.",
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
        "type": "blank",
        "teacherRequired": false,
        "orderSensitive": false
      }
    },
    "fields": {
      "misconception": "물을 가열해서 소금이 새로 생기는 것은 아니에요. 물이 줄어들면 녹아 있던 물질이 남을 수 있어요.",
      "criteria": "녹아 있던 물질의 대표적인 예인 소금을 쓰면 인정해요."
    }
  },
  "c22-s32-u02-w050": {
    "previous": {
      "id": "c22-s32-u02-w050",
      "no": 50,
      "form": "blank",
      "topic": "조건 통제",
      "prompt": "물 종류에 따른 차이를 알아보려면 처음 담는 물의 [ ]을 같게 맞추어요.",
      "answer": "양",
      "explanation": "비교할 물의 종류만 다르게 하고 처음 담는 물의 양은 같게 맞추어요. 접시와 관찰 방법도 비슷하게 해야 물의 종류에 따른 차이를 비교할 수 있어요.",
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
        "type": "blank",
        "teacherRequired": false,
        "orderSensitive": false
      }
    },
    "fields": {
      "misconception": "비교할 물의 종류는 다르게 하고, 처음 담는 물의 양은 같게 맞추어요.",
      "criteria": "처음 담는 물의 양을 같게 맞춘다는 뜻이면 인정해요."
    }
  },
  "c22-s32-u02-w051": {
    "previous": {
      "id": "c22-s32-u02-w051",
      "no": 51,
      "form": "blank",
      "topic": "밀물",
      "prompt": "같은 바닷가로 바닷물이 들어오며 물 높이가 높아지는 것은 [ ]이에요.",
      "answer": "밀물",
      "explanation": "같은 바닷가로 바닷물이 들어오며 물 높이가 높아지는 변화는 밀물이에요. 물이 높아지면 드러나 있던 갯벌이 점점 잠길 수 있어요.",
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
        "type": "blank",
        "teacherRequired": false,
        "orderSensitive": false
      }
    },
    "fields": {
      "misconception": "물이 들어오며 높아지는 변화와 빠져나가며 낮아지는 변화를 구별해요.",
      "criteria": "밀물을 쓰면 인정해요."
    }
  },
  "c22-s32-u02-w052": {
    "previous": {
      "id": "c22-s32-u02-w052",
      "no": 52,
      "form": "blank",
      "topic": "썰물",
      "prompt": "바닷물이 빠져나가며 물 높이가 낮아지는 것은 [ ]이에요.",
      "answer": "썰물",
      "explanation": "같은 바닷가에서 바닷물이 빠져나가며 물 높이가 낮아지는 변화는 썰물이에요. 물이 낮아지면 갯벌이 점점 더 드러날 수 있어요.",
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
        "type": "blank",
        "teacherRequired": false,
        "orderSensitive": false
      }
    },
    "fields": {
      "misconception": "물이 빠져나가며 낮아지는 변화는 썰물이에요. 밀물과 반대로 생각하지 않았는지 살펴요.",
      "criteria": "썰물을 쓰면 인정해요."
    }
  },
  "c22-s32-u02-w053": {
    "previous": {
      "id": "c22-s32-u02-w053",
      "no": 53,
      "form": "blank",
      "topic": "자료 해석",
      "prompt": "9시에서 11시로 가며 물 높이가 높아졌어요. 이 변화는 [ ](밀물/썰물)이에요. 12시 물 높이에 대한 답은 [ ](높음/알 수 없음) 중에서 골라요.",
      "answer": "밀물 / 알 수 없음",
      "explanation": "같은 기준에서9시 낮음→11시 높음이므로 바닷물이 들어오며 높아지는 밀물과 연결해요. 12시에는 관찰 기록이 없어요. 앞뒤 기록만으로 그 시각의 실제 높이를 대신 채우지 않아요.",
      "misconception": "자료에 나온 장소와 관찰 조건을 살피고, 알게 된 것과 더 알아볼 것을 구별해요.",
      "criteria": "질문의 조건에 맞는 자료와 설명이 연결되면 같은 뜻의 표현도 인정해요.",
      "standard": "4과06-03",
      "accepted": [
        "밀물 / 알 수 없음",
        "밀물, 알 수 없음",
        "밀물 / 모름"
      ],
      "figure": "earthSeaTideRecords",
      "status": "authored",
      "sourceRef": {
        "type": "authored-workbook",
        "unit": "c22-s32-u02",
        "originalCounterpart": false
      },
      "responseContract": {
        "type": "blank",
        "teacherRequired": false,
        "orderSensitive": false
      }
    },
    "fields": {
      "misconception": "9시와 11시의 기록은 비교할 수 있지만, 관찰하지 않은 12시의 높이는 이 표만으로 알 수 없어요.",
      "criteria": "앞에는 밀물, 뒤에는 알 수 없음 또는 모름을 차례대로 쓰면 인정해요."
    }
  },
  "c22-s32-u02-w054": {
    "previous": {
      "id": "c22-s32-u02-w054",
      "no": 54,
      "form": "blank",
      "topic": "바닷가 지형",
      "prompt": "바닷가에 모래가 넓게 펼쳐진 곳을 [ ]이라고 해요.",
      "answer": "모래사장",
      "explanation": "모래가 넓게 펼쳐진 바닷가를 모래사장이라고 해요. 바닷가 사진에서 모래가 보이는 부분과 펼쳐진 모습을 찾아보아요.",
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
        "type": "blank",
        "teacherRequired": false,
        "orderSensitive": false
      }
    },
    "fields": {
      "misconception": "모래가 넓게 펼쳐진 모습과 가파른 바위가 보이는 모습을 구별해요.",
      "criteria": "모래사장을 쓰면 인정해요."
    }
  },
  "c22-s32-u02-w055": {
    "previous": {
      "id": "c22-s32-u02-w055",
      "no": 55,
      "form": "blank",
      "topic": "갯벌",
      "prompt": "바닷물이 빠졌을 때 드러나는 갯벌은 여러 생물의 [ ]가 될 수 있어요.",
      "answer": "삶터",
      "explanation": "여러 생물이 살아가는 곳을 삶터라고 해요. 갯벌에서 게와 조개가 사는 모습을 보면 갯벌이 생물의 삶터가 된다는 가치를 설명할 수 있어요.",
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
        "type": "blank",
        "teacherRequired": false,
        "orderSensitive": false
      }
    },
    "fields": {
      "misconception": "갯벌에서 살아가는 게와 조개를 떠올려 보세요. 생물이 살아가는 곳을 묻는 문제예요.",
      "criteria": "삶터처럼 생물이 살아가는 곳이라는 뜻이면 인정해요."
    }
  },
  "c22-s32-u02-w056": {
    "previous": {
      "id": "c22-s32-u02-w056",
      "no": 56,
      "form": "blank",
      "topic": "보전",
      "prompt": "갯벌에서 생물이 계속 살아갈 수 있도록 훼손을 줄이고 지키는 일을 [ ]이라고 해요.",
      "answer": "보전",
      "explanation": "생물과 생물이 사는 곳을 함부로 훼손하지 않고 지키는 일은 보전이에요. 쓰레기를 되가져가거나 생물과 굴을 지키는 행동을 갯벌 보전과 연결해 보아요.",
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
        "type": "blank",
        "teacherRequired": false,
        "orderSensitive": false
      }
    },
    "fields": {
      "misconception": "생물과 생물이 사는 곳을 훼손하지 않고 지킨다는 뜻에 맞는 말을 써요.",
      "criteria": "보전을 쓰면 인정해요."
    }
  },
  "c22-s32-u02-w057": {
    "previous": {
      "id": "c22-s32-u02-w057",
      "no": 57,
      "form": "multi",
      "topic": "가열한 뒤 남은 물질 비교",
      "prompt": "두 종류의 물을 가열해 남는 물질을 비교하려고 해요. 물의 종류 말고 다른 조건이 같은 계획을 모두 고르세요.",
      "answer": "①, ⑤",
      "explanation": "가는 바닷물/수돗물20mL씩, 마는10mL씩으로 물 종류만 달라요. 나는 양도 다르고, 다는 종류가 같으며, 라는 한 접시에 소금이 묻어 있어요. 양·깨끗한 접시·가열 및 관찰 방법을 맞춰요.",
      "misconception": "자료에 나온 장소와 관찰 조건을 살피고, 알게 된 것과 더 알아볼 것을 구별해요.",
      "criteria": "질문의 조건에 맞는 자료와 설명이 연결되면 같은 뜻의 표현도 인정해요.",
      "choices": [
        "비교안 가",
        "비교안 나",
        "비교안 다",
        "비교안 라",
        "비교안 마"
      ],
      "key": [
        0,
        4
      ],
      "standard": "4과06-02",
      "figure": "earthSeaComparisonPlans",
      "status": "authored",
      "sourceRef": {
        "type": "authored-workbook",
        "unit": "c22-s32-u02",
        "originalCounterpart": false
      },
      "responseContract": {
        "type": "multi",
        "teacherRequired": false,
        "orderSensitive": false
      }
    },
    "fields": {
      "misconception": "물의 종류뿐 아니라 양이나 접시 상태까지 달라지면, 무엇 때문에 결과가 달라졌는지 비교하기 어려워요.",
      "criteria": "물의 종류만 다른 비교안 가와 마(①·⑤)를 모두 골라요."
    }
  },
  "c22-s32-u02-w058": {
    "previous": {
      "id": "c22-s32-u02-w058",
      "no": 58,
      "form": "multi",
      "topic": "밀물과 썰물",
      "prompt": "같은 바닷가에서 물 높이를 같은 기준으로 비교한 연습 기록이에요. 기록을 읽고 알 수 있는 설명을 모두 고르세요.",
      "answer": "①, ③, ⑤",
      "explanation": "같은 기준의9시/11시는 낮음→높음이고 드러난 갯벌도 줄었어요. 11시/13시는 높음→중간이에요. 12시는 기록이 없으므로 높음을 채울 수 없고 다른 날의 높이도 확정하지 않아요.",
      "misconception": "자료에 나온 장소와 관찰 조건을 살피고, 알게 된 것과 더 알아볼 것을 구별해요.",
      "criteria": "질문의 조건에 맞는 자료와 설명이 연결되면 같은 뜻의 표현도 인정해요.",
      "choices": [
        "9시와 11시 기록을 비교하면 물이 높아졌다",
        "12시의 물 높이도 높음으로 관찰되었다",
        "11시와 13시 기록을 비교하면 물이 낮아졌다",
        "다음 날 9시의 물 높이도 이 표로 확정할 수 있다",
        "9시보다 11시에 드러난 갯벌이 적다"
      ],
      "key": [
        0,
        2,
        4
      ],
      "standard": "4과06-03",
      "figure": "earthSeaTideRecords",
      "status": "authored",
      "sourceRef": {
        "type": "authored-workbook",
        "unit": "c22-s32-u02",
        "originalCounterpart": false
      },
      "responseContract": {
        "type": "multi",
        "teacherRequired": false,
        "orderSensitive": false
      }
    },
    "fields": {
      "misconception": "관찰하지 않은 12시나 다음 날의 높이를 기록된 값처럼 채우지 않아요.",
      "criteria": "9~11시의 높이 증가, 11~13시의 높이 감소, 11시에 드러난 갯벌이 적음을 고른 답(①·③·⑤)을 인정해요."
    }
  },
  "c22-s32-u02-w059": {
    "previous": {
      "id": "c22-s32-u02-w059",
      "no": 59,
      "form": "multi",
      "topic": "갯벌 보전",
      "prompt": "갯벌이 도움을 주는 점과 갯벌을 지키는 행동을 알맞게 연결한 것을 모두 고르세요.",
      "answer": "②, ④",
      "explanation": "물새가 먹이를 찾는 곳에서는 조용히 떨어져 관찰하고, 생물이 사는 바닥에는 쓰레기를 남기지 않아요. 갯벌의 가치와 이를 지키는 행동을 연결한 둘째와 넷째 보기가 알맞아요.",
      "misconception": "자료에 나온 장소와 관찰 조건을 살피고, 알게 된 것과 더 알아볼 것을 구별해요.",
      "criteria": "질문의 조건에 맞는 자료와 설명이 연결되면 같은 뜻의 표현도 인정해요.",
      "choices": [
        "갯벌의 가치가 크니 어느 곳에나 들어가 관찰한다",
        "물새가 먹이를 찾는 모습을 근거로 조용히 떨어져 본다",
        "눈에 보이는 큰 생물만 지키면 굴은 파도 괜찮다",
        "생물이 사는 바닥을 지키려고 쓰레기를 되가져간다",
        "많은 사람이 알아야 하므로 물새를 쫓아 사진을 찍는다"
      ],
      "key": [
        1,
        3
      ],
      "standard": "4과06-03",
      "status": "authored",
      "sourceRef": {
        "type": "authored-workbook",
        "unit": "c22-s32-u02",
        "originalCounterpart": false
      },
      "responseContract": {
        "type": "multi",
        "teacherRequired": false,
        "orderSensitive": false
      }
    },
    "fields": {
      "misconception": "갯벌을 관찰하려고 물새를 쫓거나 생물의 굴을 파면, 지키려는 삶터를 훼손할 수 있어요.",
      "criteria": "물새를 떨어져 관찰하기와 쓰레기 되가져가기를 고른 답(②·④)을 인정해요."
    }
  },
  "c22-s32-u02-w060": {
    "previous": {
      "id": "c22-s32-u02-w060",
      "no": 60,
      "form": "multi",
      "topic": "물에 녹은 물질",
      "prompt": "두 종류의 물을 가열해 남은 물질을 비교한 설명으로 알맞은 것을 모두 고르세요.",
      "answer": "①, ②, ④, ⑤",
      "explanation": "바닷물과 수돗물에는 물질이 녹아 있을 수 있어요. 처음 물의 양과 접시의 깨끗한 상태도 결과에 영향을 줄 수 있으므로 첫째·둘째·넷째·다섯째 보기가 알맞아요.",
      "misconception": "자료에 나온 장소와 관찰 조건을 살피고, 알게 된 것과 더 알아볼 것을 구별해요.",
      "criteria": "질문의 조건에 맞는 자료와 설명이 연결되면 같은 뜻의 표현도 인정해요.",
      "choices": [
        "바닷물에 녹아 있던 물질이 남을 수 있다",
        "수돗물에도 물질이 녹아 있을 수 있다",
        "흰색이므로 남은 것은 소금 한 종류뿐이다",
        "처음 양이 다르면 양의 영향도 결과에 섞일 수 있다",
        "물을 넣기 전 접시에 묻은 것도 확인한다"
      ],
      "key": [
        0,
        1,
        3,
        4
      ],
      "standard": "4과06-02",
      "status": "authored",
      "sourceRef": {
        "type": "authored-workbook",
        "unit": "c22-s32-u02",
        "originalCounterpart": false
      },
      "responseContract": {
        "type": "multi",
        "teacherRequired": false,
        "orderSensitive": false
      }
    },
    "fields": {
      "misconception": "남은 물질이 하얗다는 것만으로 소금 한 종류라고 정할 수는 없어요.",
      "criteria": "①·②·④·⑤를 모두 고르고, 흰 물질이 소금 한 종류뿐이라는 보기는 고르지 않아요."
    }
  },
  "c22-s32-u02-w061": {
    "previous": {
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
    "fields": {
      "misconception": "대기는 육지 위에만 있는 것이 아니에요. 지구를 둘러싸므로 바다 위에도 있어요.",
      "criteria": "틀린 말이라고 밝히고 바다 위에도 대기가 있다는 뜻으로 고치면 인정해요."
    }
  },
  "c22-s32-u02-w062": {
    "previous": {
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
    "fields": {
      "misconception": "접시를 깨끗하게 해도 처음 물의 양이 다르다는 문제는 남아요. 두 물의 양부터 같게 맞추어요.",
      "criteria": "처음 담는 물의 양을 같게 맞춘다는 뜻을 쓰면 인정해요."
    }
  },
  "c22-s32-u02-w063": {
    "previous": {
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
    "fields": {
      "misconception": "물 높이가 낮아지는지 높아지는지 먼저 살펴보고 밀물과 썰물을 구별해요.",
      "criteria": "밀물을 쓰면 인정해요."
    }
  },
  "c22-s32-u02-w064": {
    "previous": {
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
    },
    "fields": {
      "misconception": "게와 조개가 사는 모습, 물새가 먹이를 찾는 모습 중 하나를 근거로 도움을 설명해요.",
      "criteria": "생물의 삶터나 먹이를 구하는 장소 중 한 가지를 자료와 연결하면 인정해요."
    }
  },
  "c22-s32-u02-w065": {
    "previous": {
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
    "fields": {
      "misconception": "공기·모래·진흙 바닥이라는 설명을 각각 읽고 이름을 연결해요.",
      "criteria": "공기–대기(ㄴ), 모래–모래사장(ㄷ), 진흙 바닥–갯벌(ㄱ)을 연결해요."
    }
  },
  "c22-s32-u02-w066": {
    "previous": {
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
    },
    "fields": {
      "misconception": "들어와 높아지는 변화는 밀물, 빠져나가 낮아지는 변화는 썰물과 연결해요.",
      "criteria": "들어오며 높아짐–밀물(ㄴ), 빠져나가며 낮아짐–썰물(ㄱ)을 연결해요."
    }
  },
  "c22-s32-u02-w067": {
    "previous": {
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
    "fields": {
      "misconception": "우리 동네의 사진만으로 지구 전체를 비교하지 않아요. 질문이 다루는 범위에 맞는 자료를 찾아요.",
      "criteria": "전체 넓이–전 지구 자료(ㄷ), 물 높이 변화–시간별 높이(ㄱ), 갯벌 가치–생물 생활 자료(ㄴ)를 연결해요."
    }
  },
  "c22-s32-u02-w068": {
    "previous": {
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
    },
    "fields": {
      "misconception": "다르게 할 조건, 같게 할 조건, 실험 뒤 살펴볼 결과를 서로 바꾸어 연결하지 않아요.",
      "criteria": "물 종류–바꿀 조건(ㄴ), 처음 양과 접시–같게 둘 조건(ㄷ), 남은 모습–관찰 결과(ㄱ)를 연결해요."
    }
  },
  "c22-s32-u02-w069": {
    "previous": {
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
    "fields": {
      "misconception": "모래가 펼쳐진 곳과 가파른 바위, 물이 빠져 드러난 진흙 바닥의 모습을 구별해요.",
      "criteria": "바위 절벽(ㄴ), 모래사장(ㄱ), 갯벌(ㄷ)을 각 설명에 차례대로 연결해요."
    }
  },
  "c22-s32-u02-w070": {
    "previous": {
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
    },
    "fields": {
      "misconception": "물새를 지킬 행동과 게·조개의 삶터를 지킬 행동을 각각 연결해요.",
      "criteria": "물새의 먹이 활동–떨어져 관찰하기(ㄴ), 게와 조개의 삶터–생물과 굴 지키기(ㄱ)를 연결해요."
    }
  },
  "c22-s32-u02-w071": {
    "previous": {
      "id": "c22-s32-u02-w071",
      "no": 71,
      "form": "order",
      "topic": "증발 비교",
      "prompt": "선생님과 두 종류의 물을 비교하는 실험이에요. 실험 순서대로 기호를 쓰세요.",
      "answer": "ㄷ → ㄴ → ㄹ → ㄱ",
      "explanation": "물의 종류와 양을 정해 예상한 뒤(ㄷ), 깨끗한 접시에 같은 양을 담아요(ㄴ). 교사가 같은 방법으로 가열하고(ㄹ), 전원을 끄고 식힌 뒤 비교하므로(ㄱ) ㄷ → ㄴ → ㄹ → ㄱ이에요.",
      "misconception": "자료에 나온 장소와 관찰 조건을 살피고, 알게 된 것과 더 알아볼 것을 구별해요.",
      "criteria": "질문의 조건에 맞는 자료와 설명이 연결되면 같은 뜻의 표현도 인정해요.",
      "given": [
        "ㄱ. 전원을 끄고 식힌 뒤 남은 것을 비교한다",
        "ㄴ. 깨끗한 두 접시에 같은 양의 물을 담는다",
        "ㄷ. 물의 종류와 양을 정하고 예상한다",
        "ㄹ. 교사가 같은 방법으로 가열한다"
      ],
      "standard": "4과06-02",
      "status": "authored",
      "sourceRef": {
        "type": "authored-workbook",
        "unit": "c22-s32-u02",
        "originalCounterpart": false
      },
      "responseContract": {
        "type": "order",
        "teacherRequired": false,
        "orderSensitive": true
      }
    },
    "fields": {
      "misconception": "가열하기 전에 준비와 예상을 해요. 남은 것은 전원을 끄고 식힌 뒤 비교하며, 가열은 교사가 맡아요.",
      "criteria": "예상–같은 양으로 준비–교사 가열–식힌 뒤 비교의 순서(ㄷ→ㄴ→ㄹ→ㄱ)를 인정해요."
    }
  },
  "c22-s32-u02-w072": {
    "previous": {
      "id": "c22-s32-u02-w072",
      "no": 72,
      "form": "order",
      "topic": "물 높이 자료",
      "prompt": "같은 바닷가의 자료를 살펴보려고 해요. 할 일을 순서대로 기호로 쓰세요.",
      "answer": "ㄴ → ㄷ → ㄹ → ㄱ",
      "explanation": "같은 장소와 기준선인지 확인하고(ㄴ), 촬영 시각 순서로 놓아요(ㄷ). 각 시각의 높이를 읽은 뒤(ㄹ) 높아지는지 낮아지는지 설명하므로(ㄱ) ㄴ → ㄷ → ㄹ → ㄱ이에요.",
      "misconception": "자료에 나온 장소와 관찰 조건을 살피고, 알게 된 것과 더 알아볼 것을 구별해요.",
      "criteria": "질문의 조건에 맞는 자료와 설명이 연결되면 같은 뜻의 표현도 인정해요.",
      "given": [
        "ㄱ. 높아지는지 낮아지는지 근거로 설명한다",
        "ㄴ. 같은 장소·기준선인지 확인한다",
        "ㄷ. 촬영 시각 순서대로 놓는다",
        "ㄹ. 기준선과 비교해 각 시각의 물 높이를 읽는다"
      ],
      "standard": "4과06-03",
      "status": "authored",
      "sourceRef": {
        "type": "authored-workbook",
        "unit": "c22-s32-u02",
        "originalCounterpart": false
      },
      "responseContract": {
        "type": "order",
        "teacherRequired": false,
        "orderSensitive": true
      }
    },
    "fields": {
      "misconception": "사진을 시각순으로 놓기 전에 같은 장소와 기준선인지 확인해요.",
      "criteria": "장소·기준 확인–시각순 정리–높이 읽기–변화 설명의 순서(ㄴ→ㄷ→ㄹ→ㄱ)를 인정해요."
    }
  },
  "c22-s32-u02-w073": {
    "previous": {
      "id": "c22-s32-u02-w073",
      "no": 73,
      "form": "order",
      "topic": "보전 설명",
      "prompt": "알아본 내용을 넣어 갯벌을 지키자는 글을 쓰려고 해요. 할 일을 순서대로 기호로 쓰세요.",
      "answer": "ㄴ → ㄹ → ㄱ → ㄷ",
      "explanation": "생물의 생활 자료와 출처를 살피고(ㄴ), 자료가 보여 주는 갯벌의 가치를 정리해요(ㄹ). 가치와 연결한 행동을 제안한 뒤(ㄱ) 근거와 행동이 맞는지 확인하므로(ㄷ) ㄴ → ㄹ → ㄱ → ㄷ이에요.",
      "misconception": "자료에 나온 장소와 관찰 조건을 살피고, 알게 된 것과 더 알아볼 것을 구별해요.",
      "criteria": "질문의 조건에 맞는 자료와 설명이 연결되면 같은 뜻의 표현도 인정해요.",
      "given": [
        "ㄱ. 가치와 연결한 행동을 제안한다",
        "ㄴ. 생물의 생활 자료와 출처를 살핀다",
        "ㄷ. 근거와 행동이 맞는지 다시 확인한다",
        "ㄹ. 자료가 보여 주는 갯벌의 가치를 정리한다"
      ],
      "standard": "4과06-03",
      "status": "authored",
      "sourceRef": {
        "type": "authored-workbook",
        "unit": "c22-s32-u02",
        "originalCounterpart": false
      },
      "responseContract": {
        "type": "order",
        "teacherRequired": false,
        "orderSensitive": true
      }
    },
    "fields": {
      "misconception": "보전 행동을 먼저 정해 놓고 아무 자료나 붙이지 않아요. 생물에게 주는 도움을 자료에서 찾고 행동을 연결해요.",
      "criteria": "자료 확인–가치 정리–행동 제안–근거와 행동 점검의 순서(ㄴ→ㄹ→ㄱ→ㄷ)를 인정해요."
    }
  },
  "c22-s32-u02-w074": {
    "previous": {
      "id": "c22-s32-u02-w074",
      "no": 74,
      "form": "order",
      "topic": "바닷물과 육지의 물 비교",
      "prompt": "두 물의 양이 달랐던 실험 계획을 고치려고 해요. 할 일을 순서대로 기호로 쓰세요.",
      "answer": "ㄴ → ㄹ → ㄱ → ㄷ",
      "explanation": "처음 양이 달랐다는 문제를 찾고(ㄴ), 같은 양과 깨끗한 접시로 준비해요(ㄹ). 고친 조건에서 교사와 비교한 뒤(ㄱ), 바뀐 조건과 새 결과를 설명하므로(ㄷ) ㄴ → ㄹ → ㄱ → ㄷ이에요.",
      "misconception": "자료에 나온 장소와 관찰 조건을 살피고, 알게 된 것과 더 알아볼 것을 구별해요.",
      "criteria": "질문의 조건에 맞는 자료와 설명이 연결되면 같은 뜻의 표현도 인정해요.",
      "given": [
        "ㄱ. 고친 조건에서 교사와 비교한다",
        "ㄴ. 처음 양이 달랐다는 문제를 찾는다",
        "ㄷ. 바뀐 조건과 새 결과를 나누어 설명한다",
        "ㄹ. 같은 양과 깨끗한 접시로 준비한다"
      ],
      "standard": "4과06-02",
      "status": "authored",
      "sourceRef": {
        "type": "authored-workbook",
        "unit": "c22-s32-u02",
        "originalCounterpart": false
      },
      "responseContract": {
        "type": "order",
        "teacherRequired": false,
        "orderSensitive": true
      }
    },
    "fields": {
      "misconception": "처음 양이 달랐다는 문제를 찾은 뒤 같은 양으로 계획을 고쳐요. 새 결과는 고친 조건으로 비교한 뒤 설명해요.",
      "criteria": "문제 찾기–조건 맞추기–교사와 비교–새 결과 설명의 순서(ㄴ→ㄹ→ㄱ→ㄷ)를 인정해요."
    }
  },
  "c22-s32-u02-w075": {
    "previous": {
      "id": "c22-s32-u02-w075",
      "no": 75,
      "form": "draw",
      "topic": "지구와 대기",
      "prompt": "육지와 바다가 있는 지구를 간단히 그리고 둘레의 대기를 이름표로 나타내요. 그림의 색·선이 뜻하는 것도 쓰세요.",
      "answer": "육지와 바다를 구별해 나타내고 그 둘레에 공기가 있음을 대기 이름표로 설명한다. 선은 대기의 정확한 두께를 뜻하지 않는다고 밝힌다.",
      "explanation": "지구 그림에서 육지와 바다를 구별하고, 둘레에 공기가 있음을 대기라는 이름표로 나타내요. 쓴 색과 선이 각각 육지·바다·대기 중 무엇을 뜻하는지도 설명해요.",
      "misconception": "자료에 나온 장소와 관찰 조건을 살피고, 알게 된 것과 더 알아볼 것을 구별해요.",
      "criteria": "육지·바다·대기의 관계와 기호 뜻이 드러나면 인정해요.",
      "drawing": "large",
      "standard": "4과06-01",
      "status": "authored",
      "sourceRef": {
        "type": "authored-workbook",
        "unit": "c22-s32-u02",
        "originalCounterpart": false
      },
      "responseContract": {
        "type": "draw",
        "teacherRequired": true,
        "orderSensitive": false
      },
      "drawingExplanationLines": 3
    },
    "fields": {
      "misconception": "대기가 육지 위에만 있도록 그리지 않아요. 색과 선이 무엇을 뜻하는지도 이름표로 알려 주어요."
    }
  },
  "c22-s32-u02-w076": {
    "previous": {
      "id": "c22-s32-u02-w076",
      "no": 76,
      "form": "draw",
      "topic": "증발 비교 설계",
      "prompt": "같은 양의 바닷물과 수돗물을 비교할 준비를 그리세요. 다르게 할 것 한 가지와 같게 할 것 두 가지를 이름표로 표시하세요.",
      "answer": "두 깨끗한 같은 종류 접시에 같은 양의 다른 물을 담은 배치를 그리고 양·접시·교사 가열 조건을 표시한다.",
      "explanation": "깨끗한 같은 종류의 두 접시에 같은 양의 바닷물과 수돗물을 담은 준비 모습을 그려요. 물의 종류는 바꿀 것, 처음 양과 접시 조건은 같게 둘 것으로 표시하고 가열은 교사가 맡도록 나타내요.",
      "misconception": "자료에 나온 장소와 관찰 조건을 살피고, 알게 된 것과 더 알아볼 것을 구별해요.",
      "criteria": "물 종류와 같은 양·접시 등 두 통제 조건이 연결되면 인정해요.",
      "drawing": "large",
      "standard": "4과06-02",
      "status": "authored",
      "sourceRef": {
        "type": "authored-workbook",
        "unit": "c22-s32-u02",
        "originalCounterpart": false
      },
      "responseContract": {
        "type": "draw",
        "teacherRequired": true,
        "orderSensitive": false
      },
      "drawingExplanationLines": 3
    },
    "fields": {
      "misconception": "물의 종류를 다르게 하는 것과 물의 양·접시 조건을 같게 하는 것을 구별해요."
    }
  },
  "c22-s32-u02-w077": {
    "previous": {
      "id": "c22-s32-u02-w077",
      "no": 77,
      "form": "draw",
      "topic": "밀물 설명",
      "prompt": "같은 바닷가의 물이 들어오기 전과 들어온 뒤 두 모습을 그려요. 같은 바위나 기준선과 물 높이 변화를 표시해요.",
      "answer": "같은 장소의 기준점을 고정하고 뒤 그림에서 물이 더 높고 갯벌이 덜 드러나도록 표시한다.",
      "explanation": "같은 바위나 기준선을 두 그림의 같은 곳에 표시해요. 물이 들어온 뒤에는 물 높이를 더 높게, 드러난 갯벌을 더 적게 그려 밀물의 변화를 설명해요.",
      "misconception": "자료에 나온 장소와 관찰 조건을 살피고, 알게 된 것과 더 알아볼 것을 구별해요.",
      "criteria": "같은 기준과 높아진 물·잠긴 부분을 근거로 밀물을 설명하면 인정해요.",
      "drawing": "large",
      "standard": "4과06-03",
      "status": "authored",
      "sourceRef": {
        "type": "authored-workbook",
        "unit": "c22-s32-u02",
        "originalCounterpart": false
      },
      "responseContract": {
        "type": "draw",
        "teacherRequired": true,
        "orderSensitive": false
      },
      "drawingExplanationLines": 3
    },
    "fields": {
      "misconception": "같은 바위나 기준선을 두 그림에 똑같이 표시해야 물 높이가 달라진 모습을 비교할 수 있어요."
    }
  },
  "c22-s32-u02-w078": {
    "previous": {
      "id": "c22-s32-u02-w078",
      "no": 78,
      "form": "draw",
      "topic": "썰물 설명",
      "prompt": "같은 바닷가의 물이 빠지기 전과 빠진 뒤를 그려요. 드러난 갯벌과 물이 남아 있는 곳을 이름표로 표시해요.",
      "answer": "같은 기준점에서 뒤의 물 높이를 낮추고 갯벌이 더 드러난 모습을 나타낸다. 바다 전체가 없어진 것으로 그리지 않는다.",
      "explanation": "같은 바닷가의 기준점을 유지하고 물이 빠진 뒤의 물 높이를 더 낮게 그려요. 더 넓게 드러난 갯벌과 물이 남아 있는 곳을 각각 이름표로 표시해요.",
      "misconception": "자료에 나온 장소와 관찰 조건을 살피고, 알게 된 것과 더 알아볼 것을 구별해요.",
      "criteria": "같은 장소의 낮아진 높이와 더 드러난 갯벌을 연결하면 인정해요.",
      "drawing": "large",
      "standard": "4과06-03",
      "status": "authored",
      "sourceRef": {
        "type": "authored-workbook",
        "unit": "c22-s32-u02",
        "originalCounterpart": false
      },
      "responseContract": {
        "type": "draw",
        "teacherRequired": true,
        "orderSensitive": false
      },
      "drawingExplanationLines": 3
    },
    "fields": {
      "misconception": "물이 빠져도 바다 전체가 없어지는 것은 아니에요. 드러난 갯벌과 물이 남은 곳을 함께 나타내요."
    }
  },
  "c22-s32-u02-w079": {
    "previous": {
      "id": "c22-s32-u02-w079",
      "no": 79,
      "form": "draw",
      "topic": "가치와 행동",
      "prompt": "게·조개·물새가 이용하는 갯벌을 지키자는 안내 그림을 만드세요. 갯벌이 도움을 주는 점 한 가지와 지키기 위해 할 일 두 가지를 말풍선이나 이름표로 넣으세요.",
      "answer": "생물의 삶터·먹이 활동 장소라는 가치와 쓰레기 되가져가기·생물 훼손하지 않기·안내 지키기 중 두 행동을 연결한다.",
      "explanation": "갯벌이 생물의 삶터나 먹이를 구하는 곳이라는 가치 한 가지를 적어요. 쓰레기 되가져가기, 생물과 굴 지키기, 물새를 쫓지 않고 관찰하기 등 가치와 연결되는 행동 두 가지를 넣어요.",
      "misconception": "자료에 나온 장소와 관찰 조건을 살피고, 알게 된 것과 더 알아볼 것을 구별해요.",
      "criteria": "자료와 관련 있는 가치와 타당한 두 행동이 드러나면 인정해요.",
      "drawing": "large",
      "standard": "4과06-03",
      "status": "authored",
      "sourceRef": {
        "type": "authored-workbook",
        "unit": "c22-s32-u02",
        "originalCounterpart": false
      },
      "responseContract": {
        "type": "draw",
        "teacherRequired": true,
        "orderSensitive": false
      },
      "drawingExplanationLines": 3
    },
    "fields": {
      "misconception": "그림을 꾸미는 데서 그치지 않고, 갯벌이 주는 도움과 연결되는 행동 두 가지를 넣어요."
    }
  },
  "c22-s32-u02-w080": {
    "previous": {
      "id": "c22-s32-u02-w080",
      "no": 80,
      "form": "draw",
      "topic": "자료 선택",
      "prompt": "친구가 ‘우리 동네에 땅이 많으니 지구 전체도 육지가 더 넓다’고 말했어요. 이 말을 고치는 데 필요한 자료 두 가지를 그림이나 표로 나타내세요. 각 자료가 우리 동네만 보여 주는지, 지구 전체를 보여 주는지도 적으세요.",
      "answer": "동네 일부 자료와 지구 전체 자료를 구별해 표시하고 전체에서 바다가 더 넓다는 근거로 주장을 고친다.",
      "explanation": "한쪽에는 동네 일부 자료, 다른 쪽에는 지구 전체 표면 자료를 나타내고 각각의 범위를 적어요. 지구 전체 자료에서 바다가 육지보다 넓다는 근거를 들어 주장을 고쳐요.",
      "misconception": "자료에 나온 장소와 관찰 조건을 살피고, 알게 된 것과 더 알아볼 것을 구별해요.",
      "criteria": "일부·전체의 범위 구별과 전체 비교 결론이 연결되면 인정해요.",
      "drawing": "large",
      "standard": "4과06-01",
      "status": "authored",
      "sourceRef": {
        "type": "authored-workbook",
        "unit": "c22-s32-u02",
        "originalCounterpart": false
      },
      "responseContract": {
        "type": "draw",
        "teacherRequired": true,
        "orderSensitive": false
      },
      "drawingExplanationLines": 3
    },
    "fields": {
      "misconception": "우리 동네에서 땅이 넓게 보이는 것과 지구 전체에서 육지와 바다의 넓이를 비교하는 것은 범위가 달라요."
    }
  }
};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),clone=x=>JSON.parse(JSON.stringify(x));
export function withEarthSeaWorkbookDirections(workbook){
 if(workbook?.unit!=='c22-s32-u02'||!Array.isArray(workbook.pages))return workbook;
 let changed=false;
 const replace=page=>{
  const p=patches.find(p=>p.previous.title===page.title&&p.previous.section===page.section&&same(page,p.previous)&&p.questions.every(old=>{const current=workbook.questions?.find(q=>q.id===old.id);return same(current,old)||isReviewedFeedback(old,current);}));
  if(!p)return page;
  changed=true;const next=clone(page);for(const{path,value}of p.fields){let at=next;for(const key of path.slice(0,-1))at=at[key];at[path.at(-1)]=value;}return next;
 };
 const pages=workbook.pages.map(replace),teacherStudentPages=workbook.teacherStudentPages?.map(replace);
 return withEarthSeaFeedback(changed?{...workbook,pages,...(teacherStudentPages?{teacherStudentPages}:{})}:workbook);
}

function isReviewedFeedback(previous,current){
 const p=Object.hasOwn(feedbackNotes,previous?.id)?feedbackNotes[previous.id]:null;
 return !!p&&same(previous,p.previous)&&same(current,{...previous,...p.fields});
}
function withEarthSeaFeedback(workbook){
 if(workbook?.unit!=='c22-s32-u02'||!Array.isArray(workbook.questions))return workbook;
 let changed=false;
 const questions=workbook.questions.map(q=>{
  const p=Object.hasOwn(feedbackNotes,q?.id)?feedbackNotes[q.id]:null;
  if(!p||!same(q,p.previous))return q;
  changed=true;return{...q,...p.fields};
 });
 return changed?{...workbook,questions}:workbook;
}
