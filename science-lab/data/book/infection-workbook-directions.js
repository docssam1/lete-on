export const INFECTION_WORKBOOK_DIRECTIONS_VERSION='20261115-infection-workbook-directions';
// Reviewed student directions; models, assessment data and extension notes stay intact.
const patches=[
  {
    "index": 0,
    "previous": {
      "section": "시작하기",
      "title": "반짝이 가루가 알려 준 손 씻기",
      "blocks": [
        {
          "type": "diagram",
          "key": "hero"
        },
        {
          "type": "text",
          "text": "감기는 어떻게 친구에게서 나에게 올까요? 눈에 보이지 않는 병원체가 옮겨 가는 모습을 반짝이 가루로 보이게 해 봐요."
        },
        {
          "type": "heading",
          "text": "미리 보는 낱말"
        },
        {
          "type": "table",
          "heads": [
            "낱말",
            "뜻"
          ],
          "rows": [
            [
              "감염병",
              "병원체가 몸에 들어와 생기는 병"
            ],
            [
              "병원체",
              "감염병을 일으키는 세균·바이러스 등"
            ],
            [
              "비말",
              "기침·재채기를 할 때 나오는 작은 침방울"
            ],
            [
              "환기",
              "창문을 열어 실내 공기를 바꾸는 것"
            ]
          ]
        },
        {
          "type": "heading",
          "text": "이 단원에서 할 일"
        },
        {
          "type": "list",
          "items": [
            "감염병과 병원체가 무엇인지 알아봐요.",
            "병원체가 옮겨 가는 길(접촉·비말·공기·물과 음식)을 알아봐요.",
            "반짝이 가루 손 모형으로 손 씻기가 왜 도움이 되는지 실험해요.",
            "우리 반이 함께 지킬 예방 수칙을 계획해요."
          ],
          "ordered": true
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "손 모형의 표식 이동과 실제 감염을 구별하며 생활 습관을 살펴요."
        },
        {
          "title": "더 알아보기",
          "text": "상위 학습 · 5~6학년에서는 호흡·소화 등 몸의 기관이 하는 일을 배워요. 병원체가 옮겨 오는 경로와 몸의 어느 부분이 관련되는지 연결할 수 있어요."
        },
        {
          "title": "내가 정리할 것",
          "text": "모형에서 확인할 수 있는 것과 실제 생활에서 더 확인할 것을 하나씩 쓰세요.",
          "write": 6
        }
      ],
      "lead": "보이지 않는 것을 보이게 하고, 모형으로 확인하고, 개념으로 설명해요.",
      "kind": "opener",
      "teacherNote": "첫 질문에 대한 예상만 받고 답은 말하지 않아요. 7~9쪽 모형 결과로 확인하게 해요."
    },
    "questions": [],
    "fields": [
      {
        "path": [
          "blocks",
          1,
          "text"
        ],
        "previous": "감기는 어떻게 친구에게서 나에게 올까요? 눈에 보이지 않는 병원체가 옮겨 가는 모습을 반짝이 가루로 보이게 해 봐요.",
        "value": "감기는 어떻게 친구에게서 나에게 올까요? 병원체가 손을 거쳐 옮겨 가는 길을 반짝이 가루 모형으로 생각해 봐요."
      }
    ]
  },
  {
    "index": 1,
    "previous": {
      "section": "배움 지도",
      "title": "이번 단원에서 배울 내용",
      "blocks": [
        {
          "type": "table",
          "heads": [
            "배울 내용",
            "살펴볼 자료",
            "해 볼 활동"
          ],
          "rows": [
            [
              "감염병의 사례와 위험성",
              "생활 속 감염병 사례",
              "감염병의 위험성 토의하기"
            ],
            [
              "감염 과정과 생활 습관",
              "접촉·비말·공기·물과 음식 등을 통한 감염 사례",
              "생활 습관과 감염병 유행의 관계 설명하기"
            ],
            [
              "손 씻기와 감염병 예방",
              "손 모형에서 반짝이 가루가 옮겨 가는 모습",
              "모형으로 손 씻기의 효과 알아보기"
            ],
            [
              "감염병 예방 수칙",
              "손 씻기·기침 예절·환기 등의 생활 습관",
              "예방 수칙을 공유하고 생활에서 실천하기"
            ]
          ]
        },
        {
          "type": "text",
          "text": "사진은 상황을 살피는 설명 자료예요. 사진 속 입자나 표식이 실제 병원체를 촬영한 것은 아니에요. 이 책의 수치·이야기·실천 기록은 따로 제시한 가상 자료예요."
        },
        {
          "type": "field",
          "title": "궁금한 점",
          "hint": "생활 속에서 궁금했던 장면 하나와, 더 확인해야 할 정보를 써요.",
          "lines": 5,
          "draw": false
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "단서·경로·예방 행동·확인할 근거를 차례로 연결해요."
        },
        {
          "title": "더 알아보기",
          "text": "상위 학습 · 5~6학년에서는 기관의 위치·생김새·기능을 연결해요. 생활 습관도 이름만 외우기보다 어떤 기관의 건강을 돕는지 설명하게 돼요."
        },
        {
          "title": "내가 정리할 것",
          "text": "손 씻기나 환기 하나를 골라 경로와 예방 행동을 연결해 보세요.",
          "write": 6
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [],
    "fields": [
      {
        "path": [
          "rail",
          0,
          "text"
        ],
        "previous": "단서·경로·예방 행동·확인할 근거를 차례로 연결해요.",
        "value": "병원체가 옮겨 갈 수 있는 길과 그 길에 맞는 예방 행동을 연결해요."
      }
    ]
  },
  {
    "index": 4,
    "previous": {
      "section": "① 감염병과 병원체 · 확인",
      "title": "배운 개념을 조건에 적용해요",
      "kind": "practice",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s32-u04-w005",
            "c22-s32-u04-w006"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "병원체·감염병·관찰한 모습을 서로 바꾸어 쓰지 않아요."
        },
        {
          "title": "더 알아보기",
          "text": "상위 학습 · 중학교에서는 생물을 다섯 계로 분류해요. 이 단원의 병원체만 살펴보는 데서 나아가 동물·식물·균류·원생생물·세균의 몸과 세포의 특징을 비교해요."
        },
        {
          "title": "내가 정리할 것",
          "text": "작은 생물이라는 이유만으로 모두 해롭다고 정할 수 없는 까닭을 쓰세요.",
          "write": 6
        }
      ]
    },
    "questions": [
      {
        "id": "c22-s32-u04-w005",
        "no": 5,
        "form": "match",
        "topic": "감염병",
        "prompt": "감염병이면 ○, 감염병이 아니면 ×를 써요.",
        "answer": "(1) ○ (2) × (3) ○ (4) ○",
        "explanation": "감기·독감·병원체 감염으로 생긴 장염은 감염병이에요. 넘어져서 무릎에 생긴 상처는 다쳐서 생긴 것이므로 이 문제에서는 감염병으로 분류하지 않아요.",
        "misconception": "상처가 난 것과 상처가 감염된 것을 같은 상황으로 보지 않았나요?",
        "criteria": "감기○·넘어진 상처×·독감○·감염성 장염○를 순서대로 써요.",
        "parts": [
          "(1) 감기",
          "(2) 넘어져서 생긴 무릎 상처",
          "(3) 독감",
          "(4) 병원체 감염으로 생긴 장염"
        ],
        "answerPerPart": true,
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 감염병 교재",
          "course": "초등3-2"
        },
        "taxonomy": {
          "standard": "4과08-01",
          "topic": "감염병",
          "inquirySkill": "생활 사례와 예방 행동의 근거"
        },
        "responseContract": {
          "type": "ordered-parts",
          "teacherRequired": false,
          "accepted": [
            [
              "○",
              "×",
              "○",
              "○"
            ],
            [
              "O",
              "X",
              "O",
              "O"
            ]
          ]
        }
      },
      {
        "id": "c22-s32-u04-w006",
        "no": 6,
        "form": "choice",
        "topic": "병원체",
        "prompt": "세균·바이러스 같은 병원체에 대한 설명으로 알맞은 것은?",
        "answer": "⑤ 너무 작아 맨눈으로 보기 어렵다",
        "explanation": "세균·바이러스 같은 병원체는 맨눈으로 확인하기 어려워요. 손이 깨끗해 보인다는 관찰만으로 없다고 할 수 없어요. 손이나 물건을 거쳐 옮겨 갈 수 있어요.",
        "misconception": "겉모습으로 병원체의 유무를 확정하지 않았나요?",
        "criteria": "맨눈으로 보기 어렵다는 보기를 골라요. 보이지 않는다는 것이 없다는 뜻은 아니에요.",
        "choices": [
          "겉으로 깨끗해 보이면 병원체도 없다",
          "기침이 없으면 손과 물건으로는 옮지 않는다",
          "손을 씻은 뒤에는 다시 묻을 수 없다",
          "눈에 보이는 먼지의 양으로 그 수를 안다",
          "너무 작아 맨눈으로 보기 어렵다"
        ],
        "key": 4,
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 감염병 교재",
          "course": "초등3-2"
        },
        "taxonomy": {
          "standard": "4과08-01",
          "topic": "병원체",
          "inquirySkill": "생활 사례와 예방 행동의 근거"
        },
        "responseContract": {
          "type": "single-choice",
          "teacherRequired": false,
          "accepted": [
            4
          ],
          "orderSensitive": true
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
        "previous": "작은 생물이라는 이유만으로 모두 해롭다고 정할 수 없는 까닭을 쓰세요.",
        "value": "손이 깨끗해 보여도 병원체가 없다고 말하기 어려운 까닭을 써요."
      }
    ]
  },
  {
    "index": 10,
    "previous": {
      "section": "② 옮겨 가는 길 · 유형 연습",
      "title": "길과 막는 행동을 이어요",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s32-u04-w011",
            "c22-s32-u04-w012",
            "c22-s32-u04-w013"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "경로를 줄이는 행동은 상황의 단서와 맞아야 해요."
        },
        {
          "title": "더 알아보기",
          "text": "상위 학습 · 중학교에서는 공기를 구성하는 입자의 운동과 확산을 배워요. 실제 공기의 움직임은 눈에 보이는 큰 표식의 이동과 똑같지는 않아요."
        },
        {
          "title": "내가 정리할 것",
          "text": "눈에 보이는 표식 하나로 공기와 관련된 모든 경로를 설명할 수 있을까요?",
          "write": 5
        }
      ],
      "lead": "",
      "kind": "practice"
    },
    "questions": [
      {
        "id": "c22-s32-u04-w011",
        "no": 11,
        "form": "match",
        "topic": "옮겨 가는 길",
        "prompt": "병원체가 옮겨 가는 길에 알맞은 예방 행동을 〈보기〉에서 골라 기호를 쓰세요.",
        "answer": "(1) ㄱ (2) ㄴ (3) ㄷ",
        "explanation": "손·물건의 접촉에는 손 씻기, 침방울에는 기침 예절을 연결해요. 물·음식에는 안전한 물과 충분한 조리를 연결해요. 대표 연결이며 한 행동이 모든 경로를 막는다는 뜻은 아니에요.",
        "misconception": "경로마다 예방 행동이 완전히 하나뿐이라고 보지 않았나요?",
        "criteria": "접촉ㄱ·비말ㄴ·물과 음식ㄷ를 순서대로 연결해요.",
        "parts": [
          "(1) 손이나 물건이 닿아서(접촉)",
          "(2) 기침할 때 침방울로(비말)",
          "(3) 오염된 물과 음식으로"
        ],
        "answerPerPart": true,
        "given": [
          "〈보기〉 ㄱ. 비누로 손 씻기",
          "ㄴ. 옷소매 안쪽으로 가리고 기침하기",
          "ㄷ. 음식은 익혀 먹고 물은 끓여 마시기"
        ],
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 감염병 교재",
          "course": "초등3-2"
        },
        "taxonomy": {
          "standard": "4과08-02",
          "topic": "옮겨 가는 길",
          "inquirySkill": "생활 사례와 예방 행동의 근거"
        },
        "responseContract": {
          "type": "ordered-parts",
          "teacherRequired": false,
          "accepted": [
            [
              "ㄱ",
              "ㄴ",
              "ㄷ"
            ]
          ]
        }
      },
      {
        "id": "c22-s32-u04-w012",
        "no": 12,
        "form": "choice",
        "topic": "옮겨 가는 길",
        "prompt": "병원체가 문손잡이 → 손 → 눈으로 옮겨 갔다고 정한 연습용 이야기예요. 어떤 길로 옮겨 갔는지 고르세요.",
        "answer": "① 접촉",
        "explanation": "주어진 이야기는 문손잡이→손→눈의 접촉 경로예요. 손과 물건이 이어지는 점이 근거예요. 눈이 불편하다는 증상만으로 병명이나 원인을 정하지 않아요.",
        "misconception": "물건을 만진 이야기만으로 실제 감염을 확정하지 않았나요?",
        "criteria": "주어진 가상 경로에 해당하는 접촉을 골라요.",
        "choices": [
          "접촉",
          "비말",
          "공기",
          "물",
          "음식"
        ],
        "key": 0,
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 감염병 교재",
          "course": "초등3-2"
        },
        "taxonomy": {
          "standard": "4과08-02",
          "topic": "옮겨 가는 길",
          "inquirySkill": "생활 사례와 예방 행동의 근거"
        },
        "responseContract": {
          "type": "single-choice",
          "teacherRequired": false,
          "accepted": [
            0
          ],
          "orderSensitive": true
        }
      },
      {
        "id": "c22-s32-u04-w013",
        "no": 13,
        "form": "multi",
        "topic": "옮겨 가는 길",
        "prompt": "호흡기 감염병이 유행해 환기·기침 예절·상황에 맞는 마스크 착용을 안내받았어요. 공기나 침방울을 통한 전달을 줄이는 행동을 모두 고르세요.",
        "answer": "①, ②, ④",
        "explanation": "환기는 실내 공기를 바꾸고 옷소매와 마스크는 침방울이 퍼지는 것을 줄이는 데 관련돼요. 음식 조리와 컵 공유 문제는 이 질문의 경로와 구별해요. 안내에 맞는 행동을 함께 해요.",
        "misconception": "한 경로에 맞는 행동을 다른 경로까지 완전히 막는 방법으로 보지 않았나요?",
        "criteria": "환기·옷소매로 가리기·안내에 맞는 마스크 착용을 모두 골라요.",
        "choices": [
          "교실 창문을 열어 환기한다",
          "기침할 때 옷소매로 가린다",
          "음식을 익히면 환기를 하지 않아도 된다",
          "안내에 맞게 마스크로 코와 입을 가린다",
          "컵만 각자 쓰면 기침을 가리지 않아도 된다"
        ],
        "key": [
          0,
          1,
          3
        ],
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 감염병 교재",
          "course": "초등3-2"
        },
        "taxonomy": {
          "standard": "4과08-02",
          "topic": "옮겨 가는 길",
          "inquirySkill": "생활 사례와 예방 행동의 근거"
        },
        "responseContract": {
          "type": "multiple-choice",
          "teacherRequired": false,
          "accepted": [
            [
              0,
              1,
              3
            ]
          ],
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
        "previous": "눈에 보이는 표식 하나로 공기와 관련된 모든 경로를 설명할 수 있을까요?",
        "value": "손·물건, 침방울, 공기를 통한 길에 알맞은 예방 행동을 하나씩 써요."
      }
    ]
  },
  {
    "index": 17,
    "previous": {
      "section": "모형과 실제",
      "title": "표식이 줄었다는 결과로 어디까지 말할까요?",
      "blocks": [
        {
          "type": "text",
          "text": "종이 표식은 손에서 손으로 옮겨 가는 연결을 눈에 보이게 나타내요. 규칙으로 표식을 빼는 것과 실제로 손을 씻는 일은 같지 않아요."
        },
        {
          "type": "table",
          "heads": [
            "모형이 보여 주는 것",
            "이 모형만으로 알 수 없는 것"
          ],
          "rows": [
            [
              "정한 짝과 차례에서 표식이 이어진 위치",
              "실제 교실에서 누가 감염되는지"
            ],
            [
              "표식 빼기 규칙이 있을 때 달라진 결과",
              "손 씻기의 정확한 병원체 제거율"
            ],
            [
              "처음 위치와 순서를 같게 비교하는 방법",
              "모든 감염병에서 같은 결과가 나오는지"
            ]
          ]
        },
        {
          "type": "example",
          "question": "표식이 3장인 종이 자료를 보고 “실제 환자도 3명”이라고 말했어요. 맞을까요?",
          "steps": [
            [
              "센 대상",
              "이 자료에서 센 것은 종이 표식이 남은 카드 수예요."
            ],
            [
              "빠진 정보",
              "실제 병원체나 사람의 건강 상태를 측정한 자료가 아니에요."
            ],
            [
              "결론 다듬기",
              "정해진 모형에서 표식이 남은 카드가 3장이라고만 설명해요."
            ]
          ],
          "answer": "환자 수로 바꾸어 말할 수 없어요. 센 대상과 확인한 범위를 함께 적어요."
        },
        {
          "type": "field",
          "title": "모형 설명 한 문장",
          "hint": "옮겨 가는 연결을 생각하는 데 도움이 되는 점과 한계 하나를 함께 써요.",
          "lines": 5,
          "draw": false
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "표식 수·병원체 수·환자 수는 서로 다른 수준의 자료예요."
        },
        {
          "title": "더 알아보기",
          "text": "상위 학습 · 5~6학년에서는 여러 기관이 함께 몸의 기능을 이루는 것을 배워요. 한 부분의 변화만으로 몸 전체의 건강 결과를 곧바로 정하지 않는 관점과 연결돼요."
        },
        {
          "title": "내가 정리할 것",
          "text": "표식이 줄었다는 것과 감염병이 줄었다는 것을 확인하려면 각각 어떤 자료가 필요한지 쓰세요.",
          "write": 6
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [],
    "fields": [
      {
        "path": [
          "rail",
          0,
          "text"
        ],
        "previous": "표식 수·병원체 수·환자 수는 서로 다른 수준의 자료예요.",
        "value": "표식이 남은 카드 수를 실제 병원체 수나 아픈 사람 수로 바꾸어 말하지 않아요."
      }
    ]
  },
  {
    "index": 19,
    "previous": {
      "section": "④ 예방 수칙 · 손 씻기 · 확인",
      "title": "배운 개념을 조건에 적용해요",
      "kind": "practice",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s32-u04-w021",
            "c22-s32-u04-w022"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "방법의 여러 조건을 함께 갖추어 손을 씻어요."
        },
        {
          "title": "더 알아보기",
          "text": "상위 학습 · 중학교에서는 물에 녹는 현상과 여러 물질의 성질을 구별해요. 손에서 물질이 씻겨 나간 것과 그것이 모두 물에 녹았다는 설명은 같지 않아요."
        },
        {
          "title": "내가 정리할 것",
          "text": "눈에 보이던 표식이 없어졌다는 사실에 덧붙이면 안 될 설명을 하나 쓰세요.",
          "write": 6
        }
      ]
    },
    "questions": [
      {
        "id": "c22-s32-u04-w021",
        "no": 21,
        "form": "blank",
        "topic": "손 씻기",
        "prompt": "손은 비누와 흐르는 물로 [ ]초 이상 꼼꼼히 씻어요.",
        "answer": "30",
        "explanation": "손 씻기 안내에서 비누와 흐르는 물로30초 이상 꼼꼼히 씻도록 한 점을 읽어요. 빈칸은 시간의 수이고 초는 이미 적혀 있어요. 시간뿐 아니라 여러 부위를 씻는 방법도 중요해요.",
        "misconception": "30초만 채우면 손바닥만 씻어도 된다고 생각하지 않았나요?",
        "criteria": "30을 쓰면 인정해요. 이미 인쇄된 초를 되풀이해도 뜻이 분명하면 인정해요.",
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 감염병 교재",
          "course": "초등3-2"
        },
        "taxonomy": {
          "standard": "4과08-03",
          "topic": "손 씻기",
          "inquirySkill": "생활 사례와 예방 행동의 근거"
        },
        "responseContract": {
          "type": "quantity",
          "teacherRequired": false,
          "accepted": [
            "30",
            "30초"
          ],
          "value": 30,
          "unit": "초",
          "unitRequired": false
        }
      },
      {
        "id": "c22-s32-u04-w022",
        "no": 22,
        "form": "order",
        "topic": "손 씻기",
        "prompt": "이 교재의 손 씻기 6단계 중 네 단계를 골랐어요. 안내와 같은 순서로 기호를 쓰세요.",
        "answer": "ㄴ → ㄹ → ㄷ → ㄱ",
        "explanation": "교재의 손 씻기 안내에서 손바닥(ㄴ)을 문지른 뒤 손가락 사이(ㄹ), 엄지손가락(ㄷ), 손톱 밑(ㄱ)을 씻어요. 제시된 네 단계의 순서는 ㄴ → ㄹ → ㄷ → ㄱ이에요. 손바닥뿐 아니라 여러 부위를 빠뜨리지 않고 씻는 것이 중요해요.",
        "misconception": "안내 순서를 쓴 것과 실제로 모든 부위를 씻은 것을 같게 보지 않았나요?",
        "criteria": "안내에 제시된 네 단계 순서ㄴ→ㄹ→ㄷ→ㄱ를 인정해요.",
        "given": [
          "ㄱ. 손톱 밑을 반대편 손바닥에 문지른다",
          "ㄴ. 손바닥과 손바닥을 마주 대고 문지른다",
          "ㄷ. 엄지손가락을 다른 손으로 돌려 가며 문지른다",
          "ㄹ. 손깍지를 끼고 손가락 사이를 문지른다"
        ],
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 감염병 교재",
          "course": "초등3-2"
        },
        "taxonomy": {
          "standard": "4과08-03",
          "topic": "손 씻기",
          "inquirySkill": "생활 사례와 예방 행동의 근거"
        },
        "responseContract": {
          "type": "sequence",
          "teacherRequired": false,
          "accepted": [
            [
              "ㄴ",
              "ㄹ",
              "ㄷ",
              "ㄱ"
            ]
          ]
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
        "previous": "눈에 보이던 표식이 없어졌다는 사실에 덧붙이면 안 될 설명을 하나 쓰세요.",
        "value": "손 씻는 시간과 빠뜨리기 쉬운 부위를 써요. 그 부위도 씻어야 하는 까닭을 설명해요."
      }
    ]
  },
  {
    "index": 20,
    "previous": {
      "section": "④ 예방 수칙 · 기침 예절과 환기",
      "title": "기침 예절과 환기를 실천해요",
      "blocks": [
        {
          "type": "gallery",
          "items": [
            {
              "src": "../assets/book/c22-s32-u04-photo-cough-kit.webp",
              "alt": "교실 책상에 놓인 휴지 상자와 작은 휴지통",
              "cap": "기침 예절을 위한 준비물의 예"
            },
            {
              "src": "../assets/book/c22-s32-u04-photo-ventilation.webp",
              "alt": "창문과 문을 연 빈 교실의 설명 장면",
              "cap": "어른의 도움으로 안전하게 환기해요"
            }
          ],
          "numbered": false,
          "cols": 2,
          "credit": "실제 사진 아님"
        },
        {
          "type": "text",
          "text": "기침이나 재채기를 할 때는 휴지나 **옷소매 안쪽**으로 입과 코를 가려요. 손바닥으로 가리면 침방울이 손에 묻어 다시 옮겨 가요. 교실은 쉬는 시간마다 창문을 열어 **환기**해요."
        },
        {
          "type": "table",
          "heads": [
            "언제",
            "연결할 행동"
          ],
          "rows": [
            [
              "기침·재채기할 때",
              "휴지나 옷소매로 입과 코 가리기"
            ],
            [
              "휴지를 쓴 뒤",
              "휴지통에 버리고 손 씻기"
            ],
            [
              "실내 공기를 바꿀 때",
              "어른과 안전한 환기 방법 정하기"
            ]
          ]
        },
        {
          "type": "field",
          "title": "조건과 행동을 연결해요",
          "hint": "휴지가 없을 때의 행동과 안전하게 환기하기 위해 필요한 도움을 각각 써요.",
          "lines": 5,
          "draw": false
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "기침 예절과 환기는 서로 다른 연결을 줄이는 행동이에요."
        },
        {
          "title": "더 알아보기",
          "text": "상위 학습 · 5~6학년에서는 호흡 기관의 기능을 배워요. 폐에서 몸과 공기 사이에 기체가 오가는 호흡과 교실의 공기를 바꾸는 환기는 대상과 장소가 달라요."
        },
        {
          "title": "내가 정리할 것",
          "text": "몸의 호흡과 교실 환기를 같은 뜻으로 쓰면 어떤 점이 달라지나요?",
          "write": 3
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [],
    "fields": [
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "몸의 호흡과 교실 환기를 같은 뜻으로 쓰면 어떤 점이 달라지나요?",
        "value": "휴지가 없을 때의 기침 예절과 교실을 안전하게 환기할 방법을 써요."
      }
    ]
  },
  {
    "index": 21,
    "previous": {
      "section": "④ 예방 수칙 · 기침 예절과 환기 · 확인",
      "title": "배운 개념을 조건에 적용해요",
      "kind": "practice",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s32-u04-w023",
            "c22-s32-u04-w024"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "손·침방울·공기와 연결되는 행동을 상황에 맞게 함께 살펴요."
        },
        {
          "title": "더 알아보기",
          "text": "상위 학습 · 중학교에서는 기체 입자의 운동과 물질의 퍼짐을 설명해요. 환기의 효과를 살필 때도 공간의 크기·열린 곳·공기 흐름 같은 조건을 함께 보아요."
        },
        {
          "title": "내가 정리할 것",
          "text": "창문을 열었다는 한 사실만으로 모든 공간의 공기가 같은 속도로 바뀐다고 할까요?",
          "write": 6
        }
      ]
    },
    "questions": [
      {
        "id": "c22-s32-u04-w023",
        "no": 23,
        "form": "choice",
        "topic": "기침 예절",
        "prompt": "재채기가 나오려고 할 때 휴지가 없다면 가장 알맞은 방법은?",
        "answer": "② 옷소매 안쪽으로 입과 코를 가린다",
        "explanation": "휴지가 없는 상황에서는 옷소매 안쪽으로 입과 코를 함께 가려요. 손바닥으로 가리면 그 손을 통해 물건 등으로 이어질 수 있어요. 입만 가리고 코를 그대로 두지 않아요.",
        "misconception": "손바닥으로 가리기와 옷소매 안쪽으로 가리기를 같은 방법으로 보지 않았나요?",
        "criteria": "옷소매 안쪽으로 입과 코를 가린다는 보기를 골라요.",
        "choices": [
          "손바닥으로 입과 코를 가린다",
          "옷소매 안쪽으로 입과 코를 가린다",
          "친구 쪽을 보며 그대로 재채기한다",
          "입만 가리고 코는 그대로 둔다",
          "재채기한 뒤 손을 바지에 닦는다"
        ],
        "key": 1,
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 감염병 교재",
          "course": "초등3-2"
        },
        "taxonomy": {
          "standard": "4과08-03",
          "topic": "기침 예절",
          "inquirySkill": "생활 사례와 예방 행동의 근거"
        },
        "responseContract": {
          "type": "single-choice",
          "teacherRequired": false,
          "accepted": [
            1
          ],
          "orderSensitive": true
        }
      },
      {
        "id": "c22-s32-u04-w024",
        "no": 24,
        "form": "written",
        "topic": "기침 예절",
        "prompt": "손바닥으로 입을 가리고 기침하면 어떤 문제가 생길까요? 반짝이 가루 손 모형을 떠올리며 설명하세요.",
        "answer": "기침할 때 침방울이 손에 묻을 수 있다. 그 손이 다른 손이나 물건에 닿으면 반짝이 모형처럼 옮겨 갈 수 있다. 실제로 반드시 감염된다는 뜻은 아니다.",
        "explanation": "손바닥에 침방울이 묻으면 그 손이 닿는 물건·다른 손으로 이어질 수 있어요. 반짝이 모형은 접촉으로 표식이 옮겨 가는 연결을 보여 줘요. 실제로 반드시 감염된다고 말하는 근거는 아니에요.",
        "misconception": "손에 묻음과 실제 감염을 같은 단계로 보지 않았나요?",
        "criteria": "손의 침방울→접촉 전달 가능성과 모형의 연결을 설명하면 인정해요.",
        "lines": 3,
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 감염병 교재",
          "course": "초등3-2"
        },
        "taxonomy": {
          "standard": "4과08-03",
          "topic": "기침 예절",
          "inquirySkill": "생활 사례와 예방 행동의 근거"
        },
        "responseContract": {
          "teacherRequired": true,
          "requiredElements": [
            "손의 침방울→접촉 전달 가능성과 모형의 연결을 설명하면 인정해요."
          ]
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
        "previous": "창문을 열었다는 한 사실만으로 모든 공간의 공기가 같은 속도로 바뀐다고 할까요?",
        "value": "기침할 때 손에 묻은 침방울은 그 손이 닿는 물건을 거쳐 어떻게 옮겨 갈 수 있을까요?"
      }
    ]
  },
  {
    "index": 24,
    "previous": {
      "section": "⑤ 함께 지키는 건강한 생활",
      "title": "나를 지키고 친구를 지켜요",
      "blocks": [
        {
          "type": "text",
          "text": "손 씻기·기침 예절·환기를 함께 실천하면 병원체가 옮겨 가는 것을 줄이는 데 도움이 돼요. 반짝이 모형에서도 손 씻기를 나타내는 규칙을 넣었을 때, 마지막에 반짝이가 묻어 있는 친구 수가 줄었어요."
        },
        {
          "type": "table",
          "heads": [
            "",
            "나를 지켜요",
            "친구를 지켜요"
          ],
          "rows": [
            [
              "손",
              "밥 먹기 전 손 씻기",
              "기침한 뒤 손 씻고 악수하기"
            ],
            [
              "기침",
              "아플 때 집에서 쉬기",
              "옷소매로 가리고 기침하기"
            ],
            [
              "생활",
              "예방 접종 제때 받기",
              "컵·수건은 각자 쓰기"
            ]
          ]
        },
        {
          "type": "example",
          "question": "여섯 명 가운데 세 명만 손을 씻어도 도움이 될까요?",
          "steps": [
            [
              "조건 확인",
              "짝과 차례는 같고 손 씻기 규칙만 달라요."
            ],
            [
              "결과 비교",
              "3차례 뒤 6명 → 2명"
            ],
            [
              "결론",
              "정해진 모형에서는 표식이 있는 카드가 줄었어요. 이 수를 실제 환자 수로 해석하지 않아요."
            ]
          ],
          "answer": "모형으로 옮겨 가는 길을 생각하고 실제 생활에서는 여러 예방 행동을 함께 지켜요."
        },
        {
          "type": "field",
          "title": "조건과 행동을 연결해요",
          "hint": "친구를 탓하지 않으면서 서로의 건강한 생활을 도울 약속을 써요.",
          "lines": 3,
          "draw": false
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "나와 친구의 건강을 돕는 행동을 함께 찾아요."
        },
        {
          "title": "더 알아보기",
          "text": "상위 학습 · 고등학교에서는 선천적 면역과 후천적 면역을 구별해요. 피부·점막 같은 장벽과 특정 대상을 인식하며 형성되는 방어는 작동 방식이 달라요."
        },
        {
          "title": "내가 정리할 것",
          "text": "손 씻기와 몸 안의 방어 작용은 각각 어느 단계와 관련되는지 생각해 보세요.",
          "write": 3
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [],
    "fields": [
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "손 씻기와 몸 안의 방어 작용은 각각 어느 단계와 관련되는지 생각해 보세요.",
        "value": "표에서 나와 친구의 건강을 돕는 행동을 하나씩 골라, 언제 실천할지 써요."
      }
    ]
  },
  {
    "index": 25,
    "previous": {
      "section": "⑤ 함께 지키는 건강한 생활 · 확인",
      "title": "배운 개념을 조건에 적용해요",
      "kind": "practice",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s32-u04-w027",
            "c22-s32-u04-w028"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "필요한 도움과 실행 가능한 예방 행동을 연결해요."
        },
        {
          "title": "더 알아보기",
          "text": "상위 학습 · 고등학교 생명과학에서는 항원 항체 반응의 특이성을 배워요. 항체는 특정 항원을 인식하여 결합하는 단백질이에요. 모든 항체가 어떤 병원체에나 똑같이 결합하는 것은 아니에요."
        },
        {
          "title": "내가 정리할 것",
          "text": "비누로 씻는 일과 면역의 작용을 같은 과정이라고 설명해도 될까요?",
          "write": 6
        }
      ]
    },
    "questions": [
      {
        "id": "c22-s32-u04-w027",
        "no": 27,
        "form": "choice",
        "topic": "예방 생활",
        "prompt": "감염병 예방 수칙을 반 친구들과 함께 지키면 좋은 까닭은?",
        "answer": "④ 함께 지키면 여러 옮겨 가는 길을 줄이는 데 도움이 되므로",
        "explanation": "여러 사람이 예방 행동을 하면 사람과 물건 사이로 이어지는 길을 줄이는 데 도움이 돼요. 친구가 지킨다는 이유로 내 행동을 생략하지 않아요. 모형의 수를 실제 효과 크기로 바꾸지 않아요.",
        "misconception": "한 사람의 실천이 반 전체의 완전한 안전을 보장한다고 하지 않았나요?",
        "criteria": "함께 지켜 옮겨 가는 길을 줄이는 데 도움이 된다는 보기를 골라요.",
        "choices": [
          "친구가 실천하면 나는 한 수칙도 지킬 필요가 없으므로",
          "한 사람만 지켜도 모든 감염병을 완전히 막으므로",
          "우리 반 수칙만 지키면 학교 밖 행동은 관계없으므로",
          "함께 지키면 여러 옮겨 가는 길을 줄이는 데 도움이 되므로",
          "한 번 실천한 날에는 이후의 접촉은 조심하지 않아도 되므로"
        ],
        "key": 3,
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 감염병 교재",
          "course": "초등3-2"
        },
        "taxonomy": {
          "standard": "4과08-03",
          "topic": "예방 생활",
          "inquirySkill": "생활 사례와 예방 행동의 근거"
        },
        "responseContract": {
          "type": "single-choice",
          "teacherRequired": false,
          "accepted": [
            3
          ],
          "orderSensitive": true
        }
      },
      {
        "id": "c22-s32-u04-w028",
        "no": 28,
        "form": "written",
        "topic": "손 씻기",
        "prompt": "손 씻기 6단계를 보고, 잘 씻지 못할 수 있는 곳을 하나 고르세요. 그곳도 씻어야 하는 까닭을 쓰세요.",
        "answer": "손톱 밑. 손톱 밑에는 병원체가 남기 쉽고, 그 손으로 음식을 먹거나 입·코를 만지면 몸에 들어갈 수 있다.",
        "explanation": "손톱 밑·엄지손가락 둘레·손가락 사이는 빠뜨리기 쉬운 곳이에요. 이런 곳도 꼼꼼히 문질러 씻으면 손에 남은 병원체가 눈·코·입이나 음식으로 옮겨 가는 것을 줄이는 데 도움이 돼요.",
        "misconception": "반짝이의 양을 실제 병원체의 수로 바꾸지 않았나요?",
        "criteria": "한 부위와 그곳도 씻어야 하는 접촉 전달의 까닭을 함께 쓰면 인정해요.",
        "lines": 3,
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 감염병 교재",
          "course": "초등3-2"
        },
        "taxonomy": {
          "standard": "4과08-03",
          "topic": "손 씻기",
          "inquirySkill": "생활 사례와 예방 행동의 근거"
        },
        "responseContract": {
          "teacherRequired": true,
          "requiredElements": [
            "한 부위와 그곳도 씻어야 하는 접촉 전달의 까닭을 함께 쓰면 인정해요."
          ]
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
        "previous": "비누로 씻는 일과 면역의 작용을 같은 과정이라고 설명해도 될까요?",
        "value": "손 씻기 안내에서 빠뜨리기 쉬운 부위를 하나 고르고, 그곳도 씻어야 하는 까닭을 써요."
      }
    ]
  },
  {
    "index": 27,
    "previous": {
      "section": "두 기록을 연결하기",
      "title": "함께 달라졌다고 원인이 확인된 걸까요?",
      "blocks": [
        {
          "type": "text",
          "text": "두 주 동안 같은 20명을 살폈다고 정한 연습용 가상 표예요. 손 씻기 약속 실천과 감기 결석의 집계만 있고, 다른 조건이나 개인별 자료는 없어요."
        },
        {
          "type": "table",
          "heads": [
            "주",
            "전체",
            "약속 실천",
            "감기 결석"
          ],
          "rows": [
            [
              "첫째 주",
              "20명",
              "8명",
              "4명"
            ],
            [
              "둘째 주",
              "20명",
              "16명",
              "2명"
            ]
          ]
        },
        {
          "type": "example",
          "question": "“손 씻기 하나 때문에 결석이 줄었다”는 말을 이 표로 확인할 수 있나요?",
          "steps": [
            [
              "변화 읽기",
              "약속 실천은 8명에서 16명, 결석은 4명에서 2명으로 달라졌어요."
            ],
            [
              "없는 조건",
              "환기나 생활 조건이 같았는지, 각 친구가 어떤 행동을 했는지는 표에 없어요."
            ],
            [
              "결론의 범위",
              "두 집계의 변화는 읽을 수 있지만, 손 씻기 하나만의 원인이라고 확정할 수는 없어요."
            ]
          ],
          "answer": "표의 변화와 예방 수칙의 근거를 연결하되, 이 표가 증명하지 않은 원인을 덧붙이지 않아요."
        },
        {
          "type": "field",
          "title": "표에 있는 말·더 확인할 말",
          "hint": "자료로 확인되는 변화 하나와, 추가로 필요한 정보 하나를 나누어 써요.",
          "lines": 5,
          "draw": false
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "집계의 변화와 그 변화의 원인을 구별해요."
        },
        {
          "title": "더 알아보기",
          "text": "상위 학습 · 고등학교 통합과학에서는 감염병을 추적하는 데 과학을 이용하는 사례를 배워요. 병원체의 유전물질을 비교하면 환자 수만 센 자료와 다른 정보를 얻을 수 있어요."
        },
        {
          "title": "내가 정리할 것",
          "text": "표에서 알 수 있는 변화 두 가지를 쓰세요. 두 결과를 비교하려면 필요하지만 표에는 나오지 않은 조건도 한 가지 적으세요.",
          "write": 6
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [],
    "fields": [
      {
        "path": [
          "rail",
          0,
          "text"
        ],
        "previous": "집계의 변화와 그 변화의 원인을 구별해요.",
        "value": "표에서 두 수가 함께 달라졌다는 것만으로, 어느 쪽이 원인인지는 정할 수 없어요."
      }
    ]
  },
  {
    "index": 28,
    "previous": {
      "section": "자료 깊이 읽기 1",
      "title": "표가 말해 주는 것과 말해 주지 않는 것",
      "blocks": [
        {
          "type": "table",
          "heads": [
            "주",
            "손 씻기 약속을 지킨 친구(24명 중)",
            "감기로 결석한 친구"
          ],
          "rows": [
            [
              "1주",
              "10명",
              "5명"
            ],
            [
              "2주",
              "17명",
              "3명"
            ],
            [
              "3주",
              "22명",
              "2명"
            ]
          ]
        },
        {
          "type": "questions",
          "ids": [
            "c22-s32-u04-w031",
            "c22-s32-u04-w032"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "제목·단위·전체 수·빠진 정보까지 함께 읽어요."
        },
        {
          "title": "더 알아보기",
          "text": "상위 학습 · 중학교에서는 감염병 확산을 재해·재난 사례로 조사해요. 발생한 장소·시기·인원에 관한 자료를 함께 살펴 어느 범위로 퍼졌는지와 어떤 피해가 있었는지를 분석해요."
        },
        {
          "title": "내가 정리할 것",
          "text": "두 모둠의 전체 인원이 다른데 아픈 사람 수만 비교해도 될까요? 그 수만으로 위험이 같다고 말할 수 있을지 생각해 보세요.",
          "write": 4
        }
      ],
      "lead": "",
      "kind": "practice"
    },
    "questions": [
      {
        "id": "c22-s32-u04-w031",
        "no": 31,
        "form": "choice",
        "topic": "자료 해석",
        "prompt": "세 주 동안의 모습을 나타낸 연습용 표예요. 표에서 알 수 있는 것을 고르세요.",
        "answer": "③ 실천 집계가 늘 때 결석 집계가 줄었다",
        "explanation": "세 주의 가상 집계를 각각 읽으면 약속 실천10→17→22명, 결석5→3→2명이에요. 두 값이 함께 변한 모습은 확인돼요. 누가 결석했는지와 감소 원인은 이 표만으로 정하지 못해요.",
        "misconception": "같이 변한 두 집계만으로 원인이나 개인 행동을 확정하지 않았나요?",
        "criteria": "이 표에서 실천 집계가 늘 때 결석 집계가 줄었다는 관찰을 골라요.",
        "choices": [
          "실천하지 않은 친구만 결석한 것이 확인됐다",
          "손 씻기 하나 때문에 결석이 줄었다고 확정됐다",
          "실천 집계가 늘 때 결석 집계가 줄었다",
          "표에 없는 다음 주에도 결석이 반드시 줄어든다",
          "세 주의 차이는 없고 결석 수는 같았다"
        ],
        "key": 2,
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 감염병 교재",
          "course": "초등3-2"
        },
        "taxonomy": {
          "standard": "4과08-02",
          "topic": "자료 해석",
          "inquirySkill": "관찰과 원인 구별"
        },
        "responseContract": {
          "type": "single-choice",
          "teacherRequired": false,
          "accepted": [
            2
          ],
          "orderSensitive": true
        }
      },
      {
        "id": "c22-s32-u04-w032",
        "no": 32,
        "form": "written",
        "topic": "자료 해석",
        "prompt": "이 표만 보고 ‘손 씻기 때문에 결석이 줄었다’고 확실히 말하기 어려운 까닭을 한 가지 쓰세요.",
        "answer": "세 주 동안 날씨나 감기가 유행한 정도 같은 다른 조건도 함께 달라졌을 수 있기 때문이다.",
        "explanation": "세 주 동안 손 씻기뿐 아니라 날씨·감기의 유행 정도·친구들과 접촉한 횟수도 달라졌을 수 있어요. 손 씻기만 바꾸고 다른 조건은 같게 맞춘 비교가 아니므로, 결석이 줄어든 까닭을 손 씻기 하나로 정하기 어려워요.",
        "misconception": "결석이 줄었다는 사실을 손 씻기만의 효과와 같게 보지 않았나요?",
        "criteria": "다른 관련 조건이 함께 바뀔 수 있어 한 원인만 가리기 어렵다는 설명을 인정해요.",
        "lines": 3,
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 감염병 교재",
          "course": "초등3-2"
        },
        "taxonomy": {
          "standard": "4과08-02",
          "topic": "자료 해석",
          "inquirySkill": "관찰과 원인 구별"
        },
        "responseContract": {
          "teacherRequired": true,
          "requiredElements": [
            "다른 관련 조건이 함께 바뀔 수 있어 한 원인만 가리기 어렵다는 설명을 인정해요."
          ]
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
        "previous": "두 모둠의 전체 인원이 다른데 아픈 사람 수만 비교해도 될까요? 그 수만으로 위험이 같다고 말할 수 있을지 생각해 보세요.",
        "value": "세 주 동안 달라진 것 두 가지와, 그 까닭을 알려면 더 필요한 정보를 써요."
      }
    ]
  },
  {
    "index": 32,
    "previous": {
      "section": "단원평가 1",
      "title": "개념으로 풀어요",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s32-u04-w039",
            "c22-s32-u04-w040",
            "c22-s32-u04-w041",
            "c22-s32-u04-w042"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "보기의 말과 제시된 근거가 서로 맞는지 살펴요."
        },
        {
          "title": "더 알아보기",
          "text": "상위 학습 · 중학교에서는 세포의 구조와 기능을 연결해요. 세포·병원체·몸의 기관처럼 크기와 역할이 다른 대상을 같은 말로 바꾸지 않는 것이 중요해요."
        },
        {
          "title": "내가 정리할 것",
          "text": "문제에서 살펴보는 것이 사람의 몸 전체인지, 작은 병원체인지 구별해서 설명하세요.",
          "write": 6
        }
      ],
      "lead": "",
      "kind": "test",
      "layout": "two"
    },
    "questions": [
      {
        "id": "c22-s32-u04-w039",
        "no": 39,
        "form": "choice",
        "topic": "감염병",
        "prompt": "감염병이 아닌 것은?",
        "answer": "⑤ 넘어져서 생긴 무릎 상처",
        "explanation": "넘어져 생긴 상처는 다친 사건을 가리켜요. 나머지는 감기·감염성 눈병·독감·감염성 장염을 제시했어요. 증상 하나만으로 감염병을 판정하지 않도록 상황에 적힌 원인을 읽어요.",
        "misconception": "상처가 날 수 있다는 것과 상처 감염을 같은 것으로 보지 않았나요?",
        "criteria": "넘어져 생긴 무릎 상처를 골라요.",
        "choices": [
          "병원체에 감염되어 걸린 감기",
          "친구에게서 옮은 눈병",
          "여럿이 함께 걸린 독감",
          "병원체 감염으로 생긴 장염",
          "넘어져서 생긴 무릎 상처"
        ],
        "key": 4,
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 감염병 교재",
          "course": "초등3-2"
        },
        "taxonomy": {
          "standard": "4과08-01",
          "topic": "감염병",
          "inquirySkill": "생활 사례와 예방 행동의 근거"
        },
        "responseContract": {
          "type": "single-choice",
          "teacherRequired": false,
          "accepted": [
            4
          ],
          "orderSensitive": true
        }
      },
      {
        "id": "c22-s32-u04-w040",
        "no": 40,
        "form": "choice",
        "topic": "옮겨 가는 길",
        "prompt": "감염병이 옮겨 가는 길과 예방 행동의 짝이 알맞지 않은 것은?",
        "answer": "② 공기 — 음식을 익혀 먹기",
        "explanation": "공기 경로에는 실내 공기를 바꾸는 환기가 관련돼요. 음식을 익히는 행동은 음식 경로에 관련돼요. 다른 네 짝은 대표적인 경로와 예방 행동의 연결에 맞아요.",
        "misconception": "음식을 익히면 공기를 통한 전달도 막는다고 생각하지 않았나요?",
        "criteria": "알맞지 않은 짝인 공기—음식 익혀 먹기를 골라요.",
        "choices": [
          "접촉 — 비누로 손 씻기",
          "공기 — 음식을 익혀 먹기",
          "비말 — 옷소매로 가리기",
          "공기 — 창문 열어 환기하기",
          "물 — 물을 끓여 마시기"
        ],
        "key": 1,
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 감염병 교재",
          "course": "초등3-2"
        },
        "taxonomy": {
          "standard": "4과08-02",
          "topic": "옮겨 가는 길",
          "inquirySkill": "생활 사례와 예방 행동의 근거"
        },
        "responseContract": {
          "type": "single-choice",
          "teacherRequired": false,
          "accepted": [
            1
          ],
          "orderSensitive": true
        }
      },
      {
        "id": "c22-s32-u04-w041",
        "no": 41,
        "form": "order",
        "topic": "옮겨 가는 길",
        "prompt": "병원체가 든 침방울이 손에 묻었다고 정한 연습용 이야기예요. 손과 물건을 거쳐 코로 옮겨 가는 순서를 기호로 쓰세요. 실제로 따라 하지 않아요.",
        "answer": "ㄴ → ㄹ → ㄱ → ㄷ",
        "explanation": "손바닥으로 가린 침방울이 문손잡이, 친구 손, 코로 이어지는 가상 흐름이에요. 처음 묻은 뒤 물건→다른 손→얼굴 순서를 읽어요. 실제로 따라 하거나 감염이 반드시 일어난다고 보지 않아요.",
        "misconception": "문손잡이를 잡는 두 사람의 순서를 바꾸지 않았나요?",
        "criteria": "ㄴ→ㄹ→ㄱ→ㄷ를 인정해요.",
        "given": [
          "ㄱ. 친구가 그 문손잡이를 잡는다",
          "ㄴ. 감기에 걸린 사람이 손으로 입을 가리고 기침한다",
          "ㄷ. 친구가 씻지 않은 손으로 코를 만진다",
          "ㄹ. 그 손으로 문손잡이를 잡는다"
        ],
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 감염병 교재",
          "course": "초등3-2"
        },
        "taxonomy": {
          "standard": "4과08-02",
          "topic": "옮겨 가는 길",
          "inquirySkill": "생활 사례와 예방 행동의 근거"
        },
        "responseContract": {
          "type": "sequence",
          "teacherRequired": false,
          "accepted": [
            [
              "ㄴ",
              "ㄹ",
              "ㄱ",
              "ㄷ"
            ]
          ]
        }
      },
      {
        "id": "c22-s32-u04-w042",
        "no": 42,
        "form": "short",
        "topic": "반짝이 모형",
        "prompt": "아무도 손을 씻지 않을 때, 2차례 뒤 반짝이가 묻은 친구는 몇 명이고 누구인가요?",
        "answer": "4명(A·B·C·F)",
        "explanation": "첫 차례 뒤A·B가 남아요. 둘째 차례B-C에서C에, F-A에서F에 옮겨A·B·C·F예요. 받은 친구뿐 아니라 이전 표식도 남는 규칙이에요.",
        "misconception": "새로 받은C·F만 세고A·B를 빼지 않았나요?",
        "criteria": "4명과A·B·C·F를 모두 쓰면 인정해요. 이름 순서는 달라도 돼요.",
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 감염병 교재",
          "course": "초등3-2"
        },
        "taxonomy": {
          "standard": "4과08-02",
          "topic": "반짝이 모형",
          "inquirySkill": "모형의 조건·표식 전달·한계"
        },
        "responseContract": {
          "type": "count-and-set",
          "teacherRequired": false,
          "accepted": [
            {
              "value": 4,
              "unit": "명",
              "members": [
                "A",
                "B",
                "C",
                "F"
              ]
            }
          ],
          "orderSensitive": false,
          "unitRequired": true
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
        "previous": "문제에서 살펴보는 것이 사람의 몸 전체인지, 작은 병원체인지 구별해서 설명하세요.",
        "value": "병원체가 옮겨 갈 수 있는 길 하나를 골라, 그 길에 맞는 예방 행동과 연결해요."
      }
    ]
  },
  {
    "index": 35,
    "previous": {
      "section": "서술형 · 창의",
      "title": "우리 반 예방 약속을 만들어요 · 2",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s32-u04-w048"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "건강한 생활을 도울 방법과 그 근거를 함께 써요."
        },
        {
          "title": "더 알아보기",
          "text": "상위 학습 · 5~6학년에서는 여러 기관이 서로 관련되어 일함을 배워요. 건강한 생활은 병원체를 피하는 일뿐 아니라 몸의 기능을 유지하는 여러 생활 방식과 이어져요."
        },
        {
          "title": "내가 정리할 것",
          "text": "이번 단원에서 알게 된 예방 행동과 앞으로 알아볼 몸의 기능을 하나씩 쓰세요.",
          "write": 6
        }
      ],
      "lead": "",
      "kind": "test",
      "layout": "two"
    },
    "questions": [
      {
        "id": "c22-s32-u04-w048",
        "no": 48,
        "form": "written",
        "topic": "창의",
        "prompt": "감기가 유행하는 겨울이에요. 우리 반이 함께 지킬 계획을 ‘손’, ‘기침’, ‘공기’로 나누어 쓰세요.",
        "answer": "손: 밥 먹기 전과 쉬는 시간이 끝난 뒤 비누로 30초 씻는다. 기침: 휴지나 옷소매 안쪽으로 가린다. 공기: 쉬는 시간마다 창문을 열어 환기한다.",
        "explanation": "손에는 비누 손 씻기, 기침에는 휴지·옷소매, 공기에는 안전한 환기를 연결해요. 우리 반에서 언제·어떻게 할 수 있을지 구체화해요. 계획을 쓴 것만으로 실천 완료로 세지 않아요.",
        "misconception": "세 항목 모두에 같은 행동만 쓰거나 계획을 실천으로 세지 않았나요?",
        "criteria": "손·기침·공기에 맞는 행동과 실행할 때를 쓰면 인정해요. 두 항목만 있으면 부분 인정해요.",
        "lines": 5,
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 감염병 교재",
          "course": "초등3-2"
        },
        "taxonomy": {
          "standard": "4과08-03",
          "topic": "창의",
          "inquirySkill": "생활 사례와 예방 행동의 근거"
        },
        "responseContract": {
          "teacherRequired": true,
          "requiredElements": [
            "손·기침·공기에 맞는 행동과 실행할 때를 쓰면 인정해요. 두 항목만 있으면 부분 인정해요."
          ]
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
        "previous": "이번 단원에서 알게 된 예방 행동과 앞으로 알아볼 몸의 기능을 하나씩 쓰세요.",
        "value": "손·기침·공기에 관한 약속 중 하나를 골라, 우리 반에서 언제 어떻게 지킬지 써요."
      }
    ]
  },
  {
    "index": 38,
    "previous": {
      "section": "생각 넓히기 ① · 해 보기",
      "title": "카드로 직접 실행해 확인해요",
      "blocks": [
        {
          "type": "heading",
          "text": "준비와 실행"
        },
        {
          "type": "list",
          "items": [
            "A~D라고 쓴 종이 카드4장과 종이 표식을 준비해요.",
            "처음A에만 표식을 놓고,제시한 짝과 차례를 따라가요.",
            "두 규칙을 각각 처음 상태에서 실행하고 결과를 적어요.",
            "실제로 해 보지 않았다면 예상이나 자료 확인이라고 적어요."
          ],
          "ordered": true
        },
        {
          "type": "field",
          "title": "실제로 해 본 기록",
          "hint": "두 규칙에서 표식이 남은 카드와 다른 결과가 나왔다면 그 과정을 적어요.",
          "lines": 5,
          "draw": false
        },
        {
          "type": "questions",
          "ids": [
            "c22-s32-u04-w055"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "종이 카드의 짝과 차례를 직접 실행하고 결과를 확인해요."
        },
        {
          "title": "더 알아보기",
          "text": "상위 학습 · 고등학교 생명과학에서는 후천적 면역의 기억을 배워요. 같은 항원이 다시 들어오면 처음 만났을 때보다 빠르고 강한 반응이 일어날 수 있어요. 종이 표식 모형에는 이런 면역의 기억이 나타나지 않아요."
        },
        {
          "title": "내가 정리할 것",
          "text": "모형의 차례를 실제 날짜로 바꾸어 쓰려면 어떤 자료가 더 필요한지 쓰세요.",
          "write": 5
        }
      ],
      "lead": "",
      "kind": "practice"
    },
    "questions": [
      {
        "id": "c22-s32-u04-w055",
        "no": 55,
        "form": "written",
        "topic": "종이 표식 비교",
        "prompt": "첫 규칙을 마친 뒤 카드에 표식이 그대로 남아 있어요. 이 상태로 둘째 규칙을 시작하면 왜 비교하기 어려울까요?",
        "answer": "둘째 규칙도 처음에는 A에만 표식이 있어야 한다. 첫 규칙의 표식을 남기면 처음 표식 위치까지 달라져, 표식을 빼는 규칙의 효과만 비교하기 어렵다.",
        "explanation": "두 규칙을 비교할 때는 모두 A에만 표식이 있는 상태로 시작해요. 첫 규칙의 결과를 그대로 두면 처음 표식이 있는 카드도 달라져, B의 표식을 빼서 결과가 달라진 것인지 알아보기 어려워요.",
        "misconception": "두 규칙을 이어 하는 한 실험처럼 실행하지 않았나요?",
        "criteria": "처음 위치도 달라짐과 규칙만의 효과를 나누기 어려움을 함께 쓰면 인정해요.",
        "lines": 3,
        "responseContract": {
          "teacherRequired": true,
          "requiredElements": [
            "처음 위치도 달라짐과 규칙만의 효과를 나누기 어려움을 함께 쓰면 인정해요."
          ]
        },
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 감염병 교재 보강",
          "course": "초등3-2"
        },
        "taxonomy": {
          "standard": "4과08-02",
          "topic": "종이 표식 비교",
          "inquirySkill": "모형 규칙과 비교 조건"
        }
      }
    ],
    "fields": [
      {
        "path": [
          "blocks",
          1,
          "items",
          1
        ],
        "previous": "처음A에만 표식을 놓고,제시한 짝과 차례를 따라가요.",
        "value": "처음에는 A에만 표식을 놓고, 제시한 짝과 차례를 따라가요."
      },
      {
        "path": [
          "blocks",
          2,
          "hint"
        ],
        "previous": "두 규칙에서 표식이 남은 카드와 다른 결과가 나왔다면 그 과정을 적어요.",
        "value": "두 규칙에서 표식이 남은 카드를 각각 적어요. 예상과 달랐다면 어느 단계에서 달라졌는지도 써요."
      },
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "모형의 차례를 실제 날짜로 바꾸어 쓰려면 어떤 자료가 더 필요한지 쓰세요.",
        "value": "두 규칙을 비교하려면 처음 표식이 놓인 카드를 어떻게 맞춰야 할까요?"
      }
    ]
  },
  {
    "index": 43,
    "previous": {
      "section": "생각 넓히기 ② · 해 보기",
      "title": "어려움을 줄일 방법을 정해요",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s32-u04-w063"
          ]
        },
        {
          "type": "heading",
          "text": "다음 기회에 짧게 점검하기"
        },
        {
          "type": "field",
          "title": "기회와 행동",
          "hint": "한 번의 기회를 골라 실제로 한 행동·어려움·다음 방법만 적어요. 아직 하지 않았다면 계획으로 남겨요.",
          "lines": 5,
          "draw": false
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "실천하기 어려운 까닭과 필요한 도움을 연결해요."
        },
        {
          "title": "더 알아보기",
          "text": "상위 학습 · 중학교에서는 재난의 피해를 줄일 환경을 함께 설계해요. 손이 닿는 높이·이동할 통로·읽기 쉬운 안내는 더 많은 사람이 대책을 이용하게 도와요."
        },
        {
          "title": "내가 정리할 것",
          "text": "친구에게 더 열심히 하라고만 말하는 대신, 주변 환경을 바꾸어 도울 방법을 그려 보세요.",
          "write": 5
        }
      ],
      "lead": "",
      "kind": "practice"
    },
    "questions": [
      {
        "id": "c22-s32-u04-w063",
        "no": 63,
        "form": "written",
        "topic": "실천 기록 읽기",
        "prompt": "급식 전에 세면대 줄이 길어 손을 씻지 못한 친구가 있어요. 친구를 탓하지 않고 손 씻기를 도울 방법을 쓰세요. 그 방법이 도움이 되었는지 알아볼 기록도 쓰세요.",
        "answer": "선생님과 의논해 차례를 나누거나 미리 준비할 시간을 정한다. 다음 급식 전에 손을 씻을 기회와 실제로 한 행동, 기다릴 때의 어려움을 기록한다.",
        "explanation": "세면대 대기는 실천을 어렵게 하는 조건이에요. 시간·차례를 어른과 의논하고 다음 기회의 행동과 대기 어려움을 기록해요. 약속 여부만으로 실제 손 씻기를 판정하지 않아요.",
        "misconception": "친구의 의지 부족만 탓하고 줄이 길다는 조건을 무시하지 않았나요?",
        "criteria": "실행 가능한 지원과 실제 행동을 점검할 기록을 함께 쓰면 인정해요.",
        "lines": 5,
        "responseContract": {
          "teacherRequired": true,
          "requiredElements": [
            "실행 가능한 지원과 실제 행동을 점검할 기록을 함께 쓰면 인정해요."
          ]
        },
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 감염병 교재 보강",
          "course": "초등3-2"
        },
        "taxonomy": {
          "standard": "4과08-03",
          "topic": "실천 기록 읽기",
          "inquirySkill": "실천 자료의 범위와 미기록"
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
        "previous": "친구에게 더 열심히 하라고만 말하는 대신, 주변 환경을 바꾸어 도울 방법을 그려 보세요.",
        "value": "세면대 줄이 길 때 손 씻기를 도울 방법을 써요. 도움이 되었는지 무엇으로 확인할지도 적어요."
      }
    ]
  },
  {
    "index": 45,
    "previous": {
      "section": "생각 넓히기 ③",
      "title": "안내문의 출처와 날짜를 살펴요",
      "blocks": [
        {
          "type": "text",
          "text": "가: 질병관리청 「손씻기」, 2026년4월15일 갱신, 비누와 물로30초 이상 꼼꼼히 씻기. 나: 출처·날짜가 없는 연습용 광고, 「이 비누만 쓰면 모든 감염병이0!」. 광고 나는 자료 판단 연습을 위해 지어냈어요."
        },
        {
          "type": "questions",
          "ids": [
            "c22-s32-u04-w065",
            "c22-s32-u04-w066"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "안내의 출처·날짜·근거와 적용 대상을 함께 확인해요."
        },
        {
          "title": "더 알아보기",
          "text": "상위 학습 · 중학교의 재해·재난 조사에서는 사례와 관련된 자료를 분석해요. 발표한 곳의 이름뿐 아니라 어떤 관찰·조사로 설명했는지까지 살펴야 해요."
        },
        {
          "title": "내가 정리할 것",
          "text": "같은 제목의 안내가 두 개 있어요. 어떤 정보 세 가지를 비교할지 정해 보세요.",
          "write": 5
        }
      ],
      "lead": "",
      "kind": "practice",
      "sharedContext": {
        "id": "sourcecards-v1",
        "text": "가: 질병관리청 「손씻기」, 2026년4월15일 갱신, 비누와 물로30초 이상 꼼꼼히 씻기. 나: 출처·날짜가 없는 연습용 광고, 「이 비누만 쓰면 모든 감염병이0!」. 광고 나는 자료 판단 연습을 위해 지어냈어요."
      }
    },
    "questions": [
      {
        "id": "c22-s32-u04-w065",
        "no": 65,
        "form": "choice",
        "topic": "출처와 안내문",
        "prompt": "손 씻기 방법을 찾아보려고 해요. 어떤 점을 살펴 자료를 고르면 좋을까요?",
        "answer": "⑤ 가의 발행 기관·갱신일·현재 본문을 확인한다",
        "explanation": "자료 가를 누가 발표했는지, 언제 고쳤는지, 어떤 방법을 안내하는지 확인해요. 기관 이름과 날짜만 보지 말고 본문에서 비누와 물로 30초 이상 꼼꼼히 씻는 방법을 읽어요.",
        "misconception": "제목·날짜·기관 중 하나만 보고 본문도 맞다고 정하지 않았나요?",
        "criteria": "가의 발행 기관·갱신일·현재 본문을 확인하는 보기를 골라요.",
        "choices": [
          "제목이 같으면 본문도 같은지 확인하지 않는다",
          "출처 없는 완전 예방 문구를 그대로 근거로 삼는다",
          "오래된 정보라도 기관 이름만 있으면 현재 내용으로 본다",
          "친구가 전달했으면 발행 기관은 확인하지 않는다",
          "가의 발행 기관·갱신일·현재 본문을 확인한다"
        ],
        "key": 4,
        "contextRef": "sourcecards-v1",
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 감염병 교재 보강",
          "course": "초등3-2"
        },
        "taxonomy": {
          "standard": "4과08-03",
          "topic": "출처와 안내문",
          "inquirySkill": "출처와 근거 판단"
        },
        "responseContract": {
          "type": "single-choice",
          "teacherRequired": false,
          "accepted": [
            4
          ],
          "orderSensitive": true
        }
      },
      {
        "id": "c22-s32-u04-w066",
        "no": 66,
        "form": "multi",
        "topic": "출처와 안내문",
        "prompt": "예방 안내를 친구에게 알려 주기 전에 할 일을 모두 고르세요.",
        "answer": "②, ③, ④",
        "explanation": "예방 안내를 나누기 전에는 출처(②)와 최신 안내(③)를 확인하고, 친구가 이해하기 쉽게 써요(④). 아픈 친구의 이름을 넣거나 근거 없는 광고를 그대로 믿는 행동은 알맞지 않아요.",
        "misconception": "친구가 이해하기 쉬우면 근거 확인은 생략해도 된다고 생각하지 않았나요?",
        "criteria": "출처·최신 안내·쉬운 표현의 세 항목을 모두 골라요.",
        "choices": [
          "아픈 친구 이름을 안내에 넣는다",
          "어디에서 나온 정보인지 확인한다",
          "최신 안내와 같은지 확인한다",
          "친구가 이해하기 쉬운 말로 고친다",
          "광고에 쓰여 있으면 모든 감염병을 막는다는 말도 믿는다"
        ],
        "key": [
          1,
          2,
          3
        ],
        "contextRef": "sourcecards-v1",
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 감염병 교재 보강",
          "course": "초등3-2"
        },
        "taxonomy": {
          "standard": "4과08-03",
          "topic": "출처와 안내문",
          "inquirySkill": "출처와 근거 판단"
        },
        "responseContract": {
          "type": "multiple-choice",
          "teacherRequired": false,
          "accepted": [
            [
              1,
              2,
              3
            ]
          ],
          "orderSensitive": false
        }
      }
    ],
    "fields": [
      {
        "path": [
          "rail",
          0,
          "text"
        ],
        "previous": "안내의 출처·날짜·근거와 적용 대상을 함께 확인해요.",
        "value": "안내를 누가 언제 썼는지, 어떤 행동을 알려 주는지 함께 확인해요."
      },
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "같은 제목의 안내가 두 개 있어요. 어떤 정보 세 가지를 비교할지 정해 보세요.",
        "value": "자료 가와 나에서 발표한 곳·고친 날짜·안내 내용을 비교해요."
      }
    ]
  },
  {
    "index": 49,
    "previous": {
      "section": "생각 넓히기 ③ · 그림",
      "title": "전·중·뒤의 안내를 만들어요",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s32-u04-w072"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "전·중·뒤의 차례에 알맞은 행동과 확인할 점을 넣어요."
        },
        {
          "title": "더 알아보기",
          "text": "상위 학습 · 고등학교 생명과학에서는 선천적 면역과 후천적 면역이 함께 몸을 지키는 과정을 배워요. 이미 갖추어진 방어가 작용하는 동안 특정 항원을 인식하는 세포들의 반응도 이어질 수 있어요."
        },
        {
          "title": "내가 정리할 것",
          "text": "세 그림에서 바뀌는 대상과 그대로 두는 대상을 이름표로 구별하세요.",
          "write": 5
        }
      ],
      "lead": "",
      "kind": "draw-task"
    },
    "questions": [
      {
        "id": "c22-s32-u04-w072",
        "no": 72,
        "form": "draw",
        "topic": "출처와 안내문",
        "prompt": "‘깨끗하게 씻자’라는 말을 그림 안내로 바꾸세요. 손 씻기 전·씻는 중·씻은 뒤에 할 일을 각각 그림과 짧은 글로 나타내세요. 세 칸으로 나누어 그리세요.",
        "answer": "전: 손을 씻을 때와 비누·물 준비. 중: 비누와 흐르는 물로 여러 부위를30초 이상 꼼꼼히. 뒤: 충분히 헹구고 깨끗하게 말리기.",
        "explanation": "준비·씻는 중·마무리를 세 칸으로 구별해요. 비누와 흐르는 물·여러 부위·30초 이상, 헹굼과 깨끗한 건조를 연결해요. 시간만 적고 방법을 빼지 않아요.",
        "misconception": "손바닥만 그리거나 건조를 빼고 꼼꼼한 방법이라 하지 않았나요?",
        "criteria": "전·중·뒤, 꼼꼼한 방법, 헹굼·건조가 전달되면 다른 타당한 그림도 인정해요.",
        "drawing": "large",
        "drawingExplanationLines": 3,
        "responseContract": {
          "teacherRequired": true,
          "requiredElements": [
            "전·중·뒤, 꼼꼼한 방법, 헹굼·건조가 전달되면 다른 타당한 그림도 인정해요."
          ]
        },
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 감염병 교재 보강",
          "course": "초등3-2"
        },
        "taxonomy": {
          "standard": "4과08-03",
          "topic": "출처와 안내문",
          "inquirySkill": "출처와 근거 판단"
        }
      }
    ],
    "fields": [
      {
        "path": [
          "title"
        ],
        "previous": "전·중·뒤의 안내를 만들어요",
        "value": "손 씻기 안내를 세 장면으로 만들어요"
      },
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "세 그림에서 바뀌는 대상과 그대로 두는 대상을 이름표로 구별하세요.",
        "value": "손 씻기 전·씻는 중·씻은 뒤에 할 일을 한 가지씩 써요."
      }
    ]
  }
];
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),clone=x=>JSON.parse(JSON.stringify(x));
export function withInfectionWorkbookDirections(workbook){
 if(workbook?.unit!=='c22-s32-u04'||!Array.isArray(workbook.pages))return workbook;
 let changed=false;
 const replace=page=>{
  const p=patches.find(p=>p.previous.title===page.title&&p.previous.section===page.section&&same(page,p.previous)&&p.questions.every(old=>same(workbook.questions?.find(q=>q.id===old.id),old)));
  if(!p)return page;
  changed=true;const next=clone(page);for(const{path,value}of p.fields){let at=next;for(const key of path.slice(0,-1))at=at[key];at[path.at(-1)]=value;}return next;
 };
 const pages=workbook.pages.map(replace),teacherStudentPages=workbook.teacherStudentPages?.map(replace);
 return changed?{...workbook,pages,...(teacherStudentPages?{teacherStudentPages}:{})}:workbook;
}
