export const GRADE4_WORKBOOK_DIRECTIONS_VERSION='20261115-grade4-workbook-directions';
export const GRADE4_WORKBOOK_DIRECTIONS_UNITS=['s41-u02','s41-u03','s41-u04'];
const patches=[
  {
    "unit": "s41-u02",
    "index": 28,
    "previous": {
      "section": "기본·적용 27",
      "title": "증발과 끓음",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "s41-u02-w027"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "물속에서 기포가 계속 올라오는 끓음의 모습을 살펴요."
        },
        {
          "title": "더 알아보기",
          "text": "상위 학습 · 중학교에서는 끓는 동안 온도와 상태를 함께 측정해요. 가열을 계속해도 상태가 변하는 구간의 온도가 일정하게 나타나는 까닭을 열에너지와 연결해 배워요."
        },
        {
          "title": "내가 정리할 것",
          "text": "영상에서 끓음의 근거가 된 모습과 보이지 않는 수증기를 구별하세요.",
          "write": 3
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [
      {
        "id": "s41-u02-w027",
        "no": 27,
        "form": "choice",
        "topic": "증발과 끓음",
        "prompt": "물의 양이 줄어드는 두 영상을 보았습니다. 물이 ‘끓는’ 영상을 구별하는 데 가장 알맞은 관찰 내용은 어느 것입니까?",
        "choices": [
          "물속에서 기포가 계속 올라온다.",
          "물 표면에서만 수증기로 변한다.",
          "물속에서는 상태 변화가 전혀 없다.",
          "고체 조각이 물 표면을 가득 덮는다.",
          "물은 줄어도 기체 상태는 되지 않는다."
        ],
        "key": 0,
        "answer": "① 물속에서 기포가 계속 올라온다.",
        "explanation": "끓을 때에는 물 표면뿐 아니라 물속에서도 수증기가 되어 기포가 계속 올라옵니다. 표면에서만 수증기로 변하는 것은 증발입니다.",
        "misconception": "상태의 방향·관찰 조건·측정 범위를 함께 살펴요.",
        "criteria": "제시한 자료와 조건 안에서 판단해요.",
        "sourceId": "s41-u02-v073",
        "sourceRef": {
          "type": "similar",
          "of": {
            "set": 4,
            "no": 13
          }
        },
        "sourceContract": {
          "type": "single-choice",
          "answer": 0,
          "accepted": [
            0
          ]
        },
        "sourceGivens": null,
        "sourceExplanation": "끓을 때에는 물 표면뿐 아니라 물속에서도 수증기가 되어 기포가 계속 올라옵니다. 표면에서만 수증기로 변하는 것은 증발입니다.",
        "standard": "4과10-02"
      }
    ],
    "fields": [
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "영상에서 끓음의 근거가 된 모습과 보이지 않는 수증기를 구별하세요.",
        "value": "증발과 끓음에서 물의 상태는 어떻게 달라지나요? 끓음을 구별할 수 있는 모습도 써요."
      }
    ]
  },
  {
    "unit": "s41-u03",
    "index": 39,
    "previous": {
      "section": "연습 41~42",
      "title": "암석 관찰과 분류",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "s41-u03-w041",
            "s41-u03-w042"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "암석의 관찰 특징과 이용 사례를 연결해요."
        },
        {
          "title": "더 알아보기",
          "text": "상위 학습 · 중학교에서는 광물과 암석의 자원 가치와 활용을 조사해요. 돌의 이름뿐 아니라 어떤 특성이 어떤 용도와 관련되는지 확인하고 유한한 자원이라는 점도 살펴요."
        },
        {
          "title": "내가 정리할 것",
          "text": "이용 사례를 소개한 자료에서 알게 된 사실을 쓰세요. 사진만으로 확인하기 어려운 성질도 적으세요.",
          "write": 3
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [
      {
        "id": "s41-u03-w041",
        "no": 41,
        "form": "choice",
        "topic": "암석 관찰과 분류",
        "prompt": "박물관 안내문에 적힌 두 사용 사례를 현무암·화강암과 연결한 것으로 알맞은 것을 고르세요.",
        "choices": [
          "A 현무암, B 화강암",
          "A 화강암, B 현무암",
          "A 현무암, B 현무암",
          "A 화강암, B 화강암",
          "A 화산재, B 화산 가스"
        ],
        "key": 0,
        "answer": "① A 현무암, B 화강암",
        "explanation": "주어진 안내문에서 A의 돌하르방은 현무암, B의 석굴암은 화강암의 사용 예예요. 모든 조각품의 재료가 같다는 뜻은 아니에요.",
        "misconception": "자료의 관찰 사실과 설명·조건을 함께 살펴요.",
        "criteria": "제시한 자료와 조건의 범위에서 판단해요.",
        "sourceId": "s41-u03-v053",
        "sourcePool": "similar",
        "sourceRef": {
          "type": "similar",
          "of": {
            "set": 3,
            "no": 13
          }
        },
        "sourceGivens": {
          "안내문": [
            "A: 제주도의 돌하르방 재료. 어두운색이고 알갱이가 작다.",
            "B: 석굴암의 재료. 대체로 밝고 여러 색 큰 알갱이가 보인다."
          ]
        },
        "sourceContract": {
          "type": "single-choice",
          "answer": 3,
          "accepted": [
            3
          ]
        },
        "sourceExplanation": "주어진 안내문에서 A의 돌하르방은 현무암, B의 석굴암은 화강암의 사용 예예요. 모든 조각품의 재료가 같다는 뜻은 아니에요.",
        "standard": "4과11-03",
        "figure": "given-s41-u03-v053"
      },
      {
        "id": "s41-u03-w042",
        "no": 42,
        "form": "choice",
        "topic": "암석 관찰과 분류",
        "prompt": "표본 A·B의 관찰 결과와 맞지 않는 설명을 고르세요.",
        "choices": [
          "A는 여러 색의 큰 알갱이가 보인다.",
          "B는 맨눈으로 알갱이 구별이 어렵다.",
          "A는 두 표본 중 알갱이가 더 작다.",
          "A는 화강암, B는 현무암에 대응한다.",
          "B는 구멍이 없다고 현무암에서 제외하지 않는다."
        ],
        "key": 2,
        "answer": "③ A는 두 표본 중 알갱이가 더 작다.",
        "explanation": "자료에서 A에는 큰 알갱이가 보이고 B의 알갱이는 작아요. 두 표본에 관해 관찰한 사실을 먼저 대조해요.",
        "misconception": "자료의 관찰 사실과 설명·조건을 함께 살펴요.",
        "criteria": "제시한 자료와 조건의 범위에서 판단해요.",
        "sourceId": "s41-u03-v073",
        "sourcePool": "similar",
        "sourceRef": {
          "type": "similar",
          "of": {
            "set": 4,
            "no": 13
          }
        },
        "sourceGivens": {
          "두 표본": "현무암과 화강암 각 하나",
          "A": "대체로 밝고 여러 색 큰 알갱이가 보임",
          "B": "어두운색이며 알갱이가 작아 구별하기 어려움"
        },
        "sourceContract": {
          "type": "single-choice",
          "answer": 0,
          "accepted": [
            0
          ]
        },
        "sourceExplanation": "자료에서 A에는 큰 알갱이가 보이고 B의 알갱이는 작아요. 두 표본에 관해 관찰한 사실을 먼저 대조해요.",
        "standard": "4과11-03",
        "figure": "given-s41-u03-v073"
      }
    ],
    "fields": [
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "이용 사례를 소개한 자료에서 알게 된 사실을 쓰세요. 사진만으로 확인하기 어려운 성질도 적으세요.",
        "value": "안내문에서 알게 된 이용 사례와 관찰표에서 확인한 특징을 나누어 써요."
      }
    ]
  },
  {
    "unit": "s41-u04",
    "index": 31,
    "previous": {
      "section": "연습 28",
      "title": "특징과 사는 곳을 표로 정리하기",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "s41-u04-w028"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "생물의 무리·특징·사는 곳을 넣어 분류표를 만들어요."
        },
        {
          "title": "더 알아보기",
          "text": "중학교에서는 동물계·식물계·균계·원생생물계·원핵생물계의 다섯 계를 배워요. 이 단원의 세 무리는 모든 생물의 무리를 다 나타낸 것은 아니에요."
        },
        {
          "title": "내가 정리할 것",
          "text": "내 분류표에 있는 무리와 아직 넣지 않은 생물의 무리를 적어요.",
          "write": 5
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [
      {
        "id": "s41-u04-w028",
        "no": 28,
        "form": "draw",
        "topic": "생물의 특징과 사는 곳 정리하기",
        "prompt": "버섯·해캄·짚신벌레·세균을 균류·원생생물·세균으로 나누어 표로 정리하세요. 각 생물의 특징과 사는 곳을 하나씩 넣으세요.",
        "answer": "균류: 버섯/갓·주름/습기 있는 죽은 나무 등. 원생생물: 해캄/긴 가닥·마디/연못 등, 짚신벌레/몸·가는 털/물속 등. 세균: 공·막대·나선 등/흙·물·몸 등.",
        "explanation": "버섯은 균류, 해캄과 짚신벌레는 원생생물로 정리하고 세균은 따로 나타내요. 각 생물 옆에 특징과 사는 곳의 예를 함께 써요. 예를 들어 해캄은 긴 가닥과 마디가 보이며 연못 등 물속에서 살아요.",
        "misconception": "무리 이름만 쓰지 말고 각 생물의 특징과 사는 곳을 하나씩 연결해요.",
        "criteria": "세 무리 연결 / 네 생물의 특징 / 서식 사례 / 모든 종류로 일반화하지 않음",
        "drawing": "large",
        "standard": "4과12-01",
        "figure": "biologyClassCards"
      }
    ],
    "fields": [
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "내 분류표에 있는 무리와 아직 넣지 않은 생물의 무리를 적어요.",
        "value": "내 표에 버섯·해캄·짚신벌레·세균이 빠짐없이 들어갔는지 살펴요. 각 생물의 무리도 확인해요."
      }
    ]
  },
  {
    "unit": "s41-u04",
    "index": 51,
    "previous": {
      "section": "연습 58~59",
      "title": "생명과학이 이용되는 사례",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "s41-u04-w058",
            "s41-u04-w059"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "곰팡이가 만든 물질과 미생물의 분해 작용을 각각 알맞게 이용해요."
        },
        {
          "title": "더 알아보기",
          "text": "항생제 개발에는 발견한 물질을 분리하고 효과를 알아보는 연구가 필요해요. 일부 곰팡이가 약 개발에 쓰였다는 사실이 곰팡이를 그대로 먹어도 된다는 뜻은 아니에요."
        },
        {
          "title": "내가 정리할 것",
          "text": "표의 이용 사례에서 어떤 성질을 연구하여 이용했는지 찾아요.",
          "write": 5
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [
      {
        "id": "s41-u04-w058",
        "no": 58,
        "form": "choice",
        "topic": "생명과학 이용 사례 소개하기",
        "prompt": "일부 곰팡이가 만든 물질 때문에 세균이 잘 자라지 못했어요. 이 특징을 이용한 예를 고르세요.",
        "choices": [
          "곰팡이를 그대로 먹으면 누구나 치료된다고 안내한다.",
          "항생제 개발에 그 물질의 성질을 연구한다.",
          "곰팡이 색만 보고 약의 효과를 정한다.",
          "모든 곰팡이는 같은 약을 만든다고 전시문에 적는다.",
          "정확한 성질을 확인하지 않고 가정에서 약을 제조한다."
        ],
        "key": 1,
        "answer": "② 항생제 개발에 그 물질의 성질을 연구한다.",
        "explanation": "자료에서 확인한 특징은 일부 곰팡이가 만든 물질이 세균의 자람을 막는다는 것이에요. 이 성질을 연구하여 항생제를 개발하는 둘째 보기가 알맞아요. 곰팡이의 색이나 이름만으로 약의 효과를 정할 수는 없어요.",
        "misconception": "생물의 특징·작용과 자료의 조건을 함께 살펴요.",
        "criteria": "제시한 자료와 조건의 범위에서 판단해요.",
        "sourceId": "s41-u04-b41",
        "sourcePool": "items",
        "sourceRef": {
          "type": "authored-supplement",
          "edition": "2022 개정 범위 보충",
          "note": "원문 짝이 없는 독립 창작 문항"
        },
        "sourceGivens": null,
        "sourceContract": {
          "type": "single-choice",
          "answer": 0,
          "accepted": [
            0
          ]
        },
        "sourceExplanation": "일부 균류가 만드는 세균 억제 물질은 항생제 개발 사례입니다. 백신과 같은 뜻으로 쓰거나 학생의 섭취·약 제조로 바꾸지 않습니다.",
        "standard": "4과12-03"
      },
      {
        "id": "s41-u04-w059",
        "no": 59,
        "form": "choice",
        "topic": "생명과학 이용 사례 소개하기",
        "prompt": "미생물이 하는 일과 그 일을 이용해 해결할 수 있는 문제를 연결한 것을 고르세요.",
        "choices": [
          "모든 미생물의 색을 이용해 물속 모든 오염을 없앤다.",
          "세균의 모양만 보고 어떤 물이든 바로 마시게 한다.",
          "모든 미생물을 배양해 음식에 아무 제한 없이 넣는다.",
          "빠르게 번식하는 성질이면 어떤 폐기물도 즉시 사라진다.",
          "일부 물질 분해 작용을 하수 처리에 이용한다."
        ],
        "key": 4,
        "answer": "⑤ 일부 물질 분해 작용을 하수 처리에 이용한다.",
        "explanation": "하수 처리에서는 미생물의 분해 작용 등을 이용합니다. 모든 오염이 즉시 제거되거나 처리 물을 바로 마실 수 있다는 뜻은 아닙니다.",
        "misconception": "생물의 특징·작용과 자료의 조건을 함께 살펴요.",
        "criteria": "제시한 자료와 조건의 범위에서 판단해요.",
        "sourceId": "s41-u04-b42",
        "sourcePool": "items",
        "sourceRef": {
          "type": "authored-supplement",
          "edition": "2022 개정 범위 보충",
          "note": "원문 짝이 없는 독립 창작 문항"
        },
        "sourceGivens": null,
        "sourceContract": {
          "type": "single-choice",
          "answer": 1,
          "accepted": [
            1
          ]
        },
        "sourceExplanation": "하수 처리에서는 미생물의 분해 작용 등을 이용합니다. 모든 오염이 즉시 제거되거나 처리 물을 바로 마실 수 있다는 뜻은 아닙니다.",
        "standard": "4과12-03"
      }
    ],
    "fields": [
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "표의 이용 사례에서 어떤 성질을 연구하여 이용했는지 찾아요.",
        "value": "두 이용 사례에서 어떤 생물이 어떤 일을 하여 생활에 도움이 되는지 각각 써요."
      }
    ]
  },
  {
    "unit": "s41-u04",
    "index": 56,
    "previous": {
      "section": "연습 67",
      "title": "생명과학이 이용되는 사례",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "s41-u04-w067"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "소개 자료를 듣거나 읽을 사람이 누구인지 생각해요."
        },
        {
          "title": "더 알아보기",
          "text": "중학교에서는 같은 세포라도 구조와 기능이 다양함을 배워요. 식물 세포와 동물 세포를 비교할 때에는 공통 구조와 서로 다른 구조를 함께 나타내요."
        },
        {
          "title": "내가 정리할 것",
          "text": "내 자료를 읽을 사람에게 먼저 알려 주어야 할 생물의 특징을 적어요.",
          "write": 5
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [
      {
        "id": "s41-u04-w067",
        "no": 67,
        "form": "short",
        "topic": "생명과학 이용 사례 소개하기",
        "prompt": "소개 자료를 듣거나 읽을 사람을 ‘전달 [ ]’이라고 해요. 빈칸에 알맞은 말을 쓰세요.",
        "answer": "대상",
        "explanation": "전달 대상에 맞게 표현·설명 순서·그림을 고릅니다. 사실과 출처를 생략해도 된다는 뜻은 아닙니다.",
        "misconception": "생김새·사는 곳·작용의 근거를 연결하고 한 사례를 모든 생물로 넓히지 않아요.",
        "criteria": "소개 자료를 듣거나 읽을 사람을 가리키도록 전달 뒤의 빈칸에 대상을 썼는지 확인해요.",
        "sourceId": "s41-u04-b55",
        "sourcePool": "items",
        "sourceRef": {
          "type": "authored-supplement",
          "edition": "2022 개정 범위 보충",
          "note": "원문 짝이 없는 독립 창작 문항"
        },
        "sourceGivens": null,
        "sourceContract": {
          "type": "short-text",
          "answer": "대상",
          "accepted": [
            "대상"
          ]
        },
        "sourceExplanation": "전달 대상에 맞게 표현·설명 순서·그림을 고릅니다. 사실과 출처를 생략해도 된다는 뜻은 아닙니다.",
        "standard": "4과12-03",
        "accepted": [
          "대상"
        ]
      }
    ],
    "fields": [
      {
        "path": [
          "title"
        ],
        "previous": "생명과학이 이용되는 사례",
        "value": "요구르트 소개 카드의 생물 이름"
      },
      {
        "path": [
          "rail",
          0,
          "text"
        ],
        "previous": "소개 자료를 듣거나 읽을 사람이 누구인지 생각해요.",
        "value": "유산균의 작용을 이용해 우유를 발효하여 요구르트를 만들어요."
      },
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "내 자료를 읽을 사람에게 먼저 알려 주어야 할 생물의 특징을 적어요.",
        "value": "요구르트를 소개할 때 이용하는 생물과 그 생물이 하는 일을 함께 써요."
      }
    ]
  },
  {
    "unit": "s41-u04",
    "index": 59,
    "previous": {
      "section": "연습 70",
      "title": "생명과학이 이용되는 사례",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "s41-u04-w070"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "소개 자료를 공유한 뒤 친구의 의견을 듣고 필요한 부분을 고쳐요."
        },
        {
          "title": "더 알아보기",
          "text": "중학교에서는 광합성과 호흡의 관계를 배워요. 식물은 빛이 있을 때 광합성하며, 살아 있는 세포에서는 낮과 밤 모두 호흡이 일어나요."
        },
        {
          "title": "내가 정리할 것",
          "text": "이미 고친 내용과 앞으로 더 알아본 뒤 고칠 내용을 나누어 써요.",
          "write": 5
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [
      {
        "id": "s41-u04-w070",
        "no": 70,
        "form": "written",
        "topic": "생명과학 이용 사례 소개하기",
        "prompt": "만든 소개 자료를 친구에게 보여 준 뒤, 어떤 의견을 받았고 무엇을 고칠지 써 보세요. 아직 보여 주지 않았다면 언제 보여 주고 무엇을 물어볼지 계획을 써 보세요.",
        "answer": "아직 친구에게 보여 주지 않았어요. 내일 수업에서 자료를 보여 주고 “해캄의 모습이 잘 보이나요? 어떤 설명이 더 필요한가요?”라고 물어볼 거예요. 친구가 한 말을 듣고 글이나 그림을 고치겠어요.",
        "explanation": "자료를 보여 주었다면 친구가 실제로 한 질문이나 의견과 고칠 내용을 적어요. 아직 보여 주지 않았다면 보여 줄 때와 물어볼 내용을 계획으로 적어요. 계획한 일과 실제로 한 일을 나누어 써요.",
        "misconception": "생김새·사는 곳·작용의 근거를 연결하고 한 사례를 모든 생물로 넓히지 않아요.",
        "criteria": "보여 주었다면 실제 받은 의견과 고칠 내용을 연결해요. 아직 보여 주지 않았다면 보여 줄 때와 물어볼 질문을 계획으로 쓰면 돼요.",
        "lines": 8,
        "sourceId": "s41-u04-b64",
        "sourcePool": "items",
        "sourceRef": {
          "type": "authored-supplement",
          "edition": "2022 개정 범위 보충",
          "note": "원문 짝이 없는 독립 창작 문항"
        },
        "sourceGivens": null,
        "sourceContract": {
          "type": "written-explanation",
          "sample": "아직 공유하지 않았습니다. 내일 수업에서 친구에게 보여 준 뒤 날짜·방법과 실제 받은 질문을 기록하고, 근거를 확인해 이해하기 어려웠던 문장을 고치겠습니다.",
          "rubric": {
            "required": [
              "계획·제작·발표·공유·받은 반응을 구별해 기록하고 자료를 수정한다."
            ],
            "pass": "근거와 설명의 타당성을 선생님이 확인"
          }
        },
        "sourceExplanation": "실제 수행 또는 아직 하지 않은 상태를 정직하게 구별하는지 확인합니다. 계획 답만으로 공유 완료로 판정하지 않습니다.",
        "standard": "4과12-03"
      }
    ],
    "fields": [
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "이미 고친 내용과 앞으로 더 알아본 뒤 고칠 내용을 나누어 써요.",
        "value": "친구의 의견을 들었다면 고칠 점을 써요. 아직 보여 주지 않았다면 언제 무엇을 물어볼지 적어요."
      }
    ]
  }
];
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),clone=x=>JSON.parse(JSON.stringify(x));
export function withGrade4WorkbookDirections(workbook){
 if(!GRADE4_WORKBOOK_DIRECTIONS_UNITS.includes(workbook?.unit)||!Array.isArray(workbook.pages))return workbook;
 let changed=false;const replace=page=>{const patch=patches.find(p=>p.unit===workbook.unit&&same(p.previous,page)&&p.questions.every(old=>same(workbook.questions?.find(q=>q.id===old.id),old)));if(!patch)return page;changed=true;const next=clone(page);for(const{path,value}of patch.fields){let at=next;for(const key of path.slice(0,-1))at=at[key];at[path.at(-1)]=value;}return next;};
 const pages=workbook.pages.map(replace),teacherStudentPages=workbook.teacherStudentPages?.map(replace);return changed?{...workbook,pages,...(teacherStudentPages?{teacherStudentPages}:{})}:workbook;
}
