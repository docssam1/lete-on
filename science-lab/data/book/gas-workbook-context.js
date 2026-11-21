export const GAS_CONTEXT_VERSION='20261115-gas-workbook-context';
// Keep the comparison conditions beside the question and align page guidance.
const patches=[
  {
    "previous": {
      "id": "c22-s42-u03-w024",
      "no": 24,
      "form": "blank",
      "topic": "기체의 쓰임",
      "prompt": "다른 물질의 연소를 돕고 호흡에 필요한 기체는 [ ]예요.",
      "answer": "산소",
      "explanation": "두 단서는 호흡에 필요함과 다른 물질의 연소를 도움입니다. 이 단서에 맞는 기체는 산소예요. 연소를 돕는 역할을 산소 자체가 타는 연료라는 뜻으로 바꾸지 않아요.",
      "misconception": "연소를 돕는 기체와 스스로 타는 연료의 역할을 구별했나요?",
      "criteria": "두 성질에 해당하는 산소를 쓰면 인정해요.",
      "status": "authored",
      "sourceRef": {
        "type": "independently-authored-workbook",
        "edition": "GFIELD 기체 교재",
        "course": "초등4-2"
      },
      "taxonomy": {
        "standard": "4과15-03",
        "topic": "기체의 쓰임",
        "inquirySkill": "조건을 적용한 개념 정리"
      },
      "responseContract": {
        "type": "word",
        "accepted": [
          "산소"
        ],
        "teacherRequired": false
      }
    },
    "fields": {
      "prompt": "다른 물질이 타는 것을 돕고 호흡에 필요한 기체는 [ ]예요.",
      "explanation": "산소는 호흡에 필요하고 다른 물질이 타는 것을 도와요. 두 단서에 맞는 기체는 산소예요. 다른 물질이 타는 것을 돕는다는 말이 산소 자체가 타는 연료라는 뜻은 아니에요.",
      "misconception": "다른 물질이 타는 것을 돕는 기체와 스스로 타는 연료의 역할을 구별했나요?"
    }
  },
  {
    "previous": {
      "id": "c22-s42-u03-w055",
      "no": 55,
      "form": "written",
      "topic": "열림과 닫힘",
      "prompt": "A와B 모두 피스톤 앞쪽 공간이 줄었어요. 두 결과를 모두 「같은 공기가 압축되었다」고 말하기 어려운 까닭을 쓰세요.",
      "answer": "A는 공기가 새지 않아 같은 양의 공기가 더 작은 공간을 차지한다. B는 끝이 열려 공기가 밖으로 나갈 수 있어 같은 양의 공기라는 조건이 유지되지 않는다.",
      "explanation": "A는 공기가 새지 않아 같은 양이 더 작은 공간을 차지해요. B는 끝이 열려 공기가 나갈 수 있어 같은 양이라는 조건이 유지되지 않을 수 있어요. 부피 감소라는 모습은 비슷해도 출입 조건이 달라 같은 압축 비교로 묶지 않아요.",
      "misconception": "같은 피스톤 이동을 같은 공기 양의 변화로 곧바로 해석하지 않았나요?",
      "criteria": "A의 밀폐·같은 양과 B는 끝이 열려 출입 가능함을 비교해 설명하면 인정해요.",
      "lines": 3,
      "status": "authored",
      "sourceRef": {
        "type": "independently-authored-workbook",
        "edition": "GFIELD 기체 교재 보강",
        "course": "초등4-2"
      },
      "taxonomy": {
        "standard": "4과15-02",
        "topic": "열림과 닫힘",
        "inquirySkill": "변인 통제와 관찰·추론"
      },
      "responseContract": {
        "teacherRequired": true,
        "requiredElements": [
          "A의 밀폐·같은 양과 B는 끝이 열려 출입 가능함을 비교해 설명하면 인정해요."
        ]
      }
    },
    "fields": {
      "given": [
        "같은 온도에서 바늘 없는 주사기 A와 B를 비교했어요.",
        "A: 끝을 막아 공기가 새지 않아요. B: 끝이 열려 공기가 드나들어요."
      ]
    }
  },
  {
    "previous": {
      "id": "c22-s42-u03-w067",
      "no": 67,
      "form": "blank",
      "topic": "성질과 쓰임",
      "prompt": "산소는 다른 물질의 [ ]를 돕고, 질소는 쉽게 [ ]하지 않는 성질을 일부 포장에 이용해요.",
      "answer": "연소 / 반응",
      "explanation": "산소는 다른 물질의 연소를 돕는 역할이므로 첫 칸은 연소예요. 질소는 쉽게 반응하지 않는 성질을 일부 식품 포장에 쓰므로 둘째는 반응이에요. 산소가 스스로 타거나 질소가 모든 변질을 막는다는 뜻은 아니에요.",
      "misconception": "두 기체의 역할을 서로 바꾸거나 일부 사례를 모든 포장에 적용하지 않았나요?",
      "criteria": "연소/반응을 두 칸에 순서대로 쓰면 인정해요.",
      "responseContract": {
        "type": "ordered-parts",
        "accepted": [
          [
            "연소",
            "반응"
          ]
        ],
        "teacherRequired": false
      },
      "contextRef": "rsc-gases-v1",
      "status": "authored",
      "sourceRef": {
        "type": "independently-authored-workbook",
        "edition": "GFIELD 기체 교재 보강",
        "course": "초등4-2"
      },
      "taxonomy": {
        "standard": "4과15-03",
        "topic": "성질과 쓰임",
        "inquirySkill": "자료 조사와 성질·쓰임 연결"
      }
    },
    "fields": {
      "prompt": "산소는 다른 물질의 [ ](타는 현상)를 돕고, 질소는 쉽게 [ ]하지 않는 성질을 일부 포장에 이용해요.",
      "explanation": "산소는 다른 물질이 타는 현상인 연소를 도와요. 따라서 첫 칸은 연소예요. 질소는 쉽게 반응하지 않는 성질을 일부 식품 포장에 쓰므로 둘째는 반응이에요. 산소가 스스로 타거나 질소가 모든 변질을 막는다는 뜻은 아니에요."
    }
  }
];
const directions=[
  {
    "index": 15,
    "previous": {
      "section": "기본·적용 4~6",
      "title": "공기 무게의 근거와 적용",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s42-u03-w004",
            "c22-s42-u03-w005",
            "c22-s42-u03-w006"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "공기가 무거워진 것과 더 넣은 공기의 양을 구별해요."
        },
        {
          "title": "더 알아보기",
          "text": "중학교에서는 기체를 압축할 때 입자의 크기가 줄어드는 것이 아니라 입자 사이 간격이 줄어드는 것으로 설명해요. 닫힌 장치에서 같은 기체를 압축해도 입자 수와 질량은 유지돼요."
        },
        {
          "title": "내가 정리할 것",
          "text": "차이로 알 수 있는 양과 모르는 전체 양을 적으세요.",
          "write": 3
        }
      ],
      "lead": "답을 고른 뒤, 아래 줄에 선택한 근거와 헷갈린 보기를 적어 보세요.",
      "kind": "check",
      "layout": "two"
    },
    "questions": [
      {
        "id": "c22-s42-u03-w004",
        "no": 4,
        "form": "choice",
        "topic": "공기 무게의 근거와 적용",
        "prompt": "풍선이 커졌다는 관찰만으로 바로 알 수 있는 것은 무엇인가요?",
        "answer": "① 풍선이 차지하는 공간이 커졌다는 점",
        "explanation": "풍선이 커지면 차지하는 공간인 부피가 커진 것이에요. 따라서 첫째 보기가 알맞아요. 풍선의 모습만 보고 안의 공기가 얼마나 무거운지나 어떤 조건이 달라졌는지까지 알 수는 없어요.",
        "misconception": "같은 용기·마개·바깥 부피로 비교했는지 살펴요.",
        "criteria": "선택한 기호와 선택지 내용이 모두 맞으면 정답이에요.",
        "sourceId": "c22-s42-u03-b19",
        "sourceRef": {
          "type": "authored-supplement",
          "edition": "2022 개정 현행 범위 보충",
          "note": "원문 짝이 없는 독립 창작. 제시 수치/기록은 연습 자료이며 실제 학생 측정/제작/소통 증거가 아님."
        },
        "standard": "4과15-01",
        "choices": [
          "풍선이 차지하는 공간이 커졌다는 점",
          "풍선 안 공기의 양이 그대로라는 점",
          "풍선 안 공기의 무게를 정확히 쟀다는 점",
          "풍선 안 기체의 종류가 바뀌었다는 점",
          "풍선 안 온도만 높아졌다는 점"
        ],
        "key": 0
      },
      {
        "id": "c22-s42-u03-w005",
        "no": 5,
        "form": "choice",
        "topic": "압력과 부피의 관찰",
        "prompt": "같은 온도에서 공기가 새지 않게 막은 주사기를 누르고 있어요. 더 세게 누르면 안의 공기 부피는 어떻게 될까요?",
        "answer": "④ 더 작아질 수 있다.",
        "explanation": "같은 주사기를 더 세게 누르면 안의 공기에 가하는 압력이 커져요. 공기가 새지 않아 양은 같지만 더 작은 공간을 차지할 수 있으므로 넷째 보기가 알맞아요.",
        "misconception": "공기 양·압력·온도·움직이는 경계 중 무엇이 달라졌는지 확인해요.",
        "criteria": "선택한 기호와 선택지 내용이 모두 맞으면 정답이에요.",
        "sourceId": "c22-s42-u03-b25",
        "sourceRef": {
          "type": "authored-supplement",
          "edition": "2022 개정 현행 범위 보충",
          "note": "원문 짝이 없는 독립 창작. 제시 수치/기록은 연습 자료이며 실제 학생 측정/제작/소통 증거가 아님."
        },
        "standard": "4과15-02",
        "choices": [
          "공기 양이 줄어들어 차지한 공간이 작아진다.",
          "온도가 같으므로 공기 부피도 그대로다.",
          "더 작은 공간이면 공기가 밖으로 샌 것이다.",
          "더 작아질 수 있다.",
          "누르는 압력이 커지면 공기 부피도 커진다."
        ],
        "key": 3
      },
      {
        "id": "c22-s42-u03-w006",
        "no": 6,
        "form": "choice",
        "topic": "온도와 부피의 관찰",
        "prompt": "공기가 새지 않는 말랑한 주머니를 따뜻하게 했어요. 주머니가 부풀 수 있고 바깥 압력이 비슷할 때, 안의 공기 부피는 어떻게 될까요?",
        "answer": "③ 공기 부피가 커질 수 있다.",
        "explanation": "이 주머니는 공기가 새지 않고 부풀 수 있어요. 바깥 압력이 비슷한 상태에서 공기가 따뜻해지면 부피가 커질 수 있으므로 셋째 보기를 골라요. 부풀었다고 공기 양이 늘거나 기체 종류가 바뀐 것은 아니에요.",
        "misconception": "공기 양·압력·온도·움직이는 경계 중 무엇이 달라졌는지 확인해요.",
        "criteria": "선택한 기호와 선택지 내용이 모두 맞으면 정답이에요.",
        "sourceId": "c22-s42-u03-b31",
        "sourceRef": {
          "type": "authored-supplement",
          "edition": "2022 개정 현행 범위 보충",
          "note": "원문 짝이 없는 독립 창작. 제시 수치/기록은 연습 자료이며 실제 학생 측정/제작/소통 증거가 아님."
        },
        "standard": "4과15-02",
        "choices": [
          "같은 양이므로 따뜻해져도 부피는 그대로다.",
          "부피가 커지면 안의 공기 양도 반드시 늘었다.",
          "공기 부피가 커질 수 있다.",
          "따뜻해지면 같은 공기가 더 작은 공간을 차지한다.",
          "바깥 압력이 같으면 온도 변화는 관계없다."
        ],
        "key": 2
      }
    ],
    "fields": [
      {
        "path": [
          "title"
        ],
        "previous": "공기 무게의 근거와 적용",
        "value": "공기가 차지하는 공간과 부피 변화"
      },
      {
        "path": [
          "rail",
          0,
          "text"
        ],
        "previous": "공기가 무거워진 것과 더 넣은 공기의 양을 구별해요.",
        "value": "공기가 차지하는 공간과 공기의 양을 구별해요. 온도나 압력을 바꿀 때에는 다른 조건도 살펴요."
      },
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "차이로 알 수 있는 양과 모르는 전체 양을 적으세요.",
        "value": "풍선이 커진 모습으로 바로 알 수 있는 점을 써요. 압력이나 온도를 바꾸면 부피가 어떻게 될지도 정리해요."
      }
    ]
  },
  {
    "index": 17,
    "previous": {
      "section": "기본·적용 10~12",
      "title": "이산화 탄소의 성질과 이용",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s42-u03-w010",
            "c22-s42-u03-w011",
            "c22-s42-u03-w012"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "이산화 탄소의 성질을 이용 사례와 연결해요."
        },
        {
          "title": "더 알아보기",
          "text": "중학교 입자 모형에서 기체가 섞이는 모습은 입자가 계속 움직이며 공간으로 퍼지는 것으로 설명해요."
        },
        {
          "title": "내가 정리할 것",
          "text": "이용 사례가 어떤 성질과 관련되는지 쓰세요.",
          "write": 3
        }
      ],
      "lead": "답을 고른 뒤, 아래 줄에 선택한 근거와 헷갈린 보기를 적어 보세요.",
      "kind": "check",
      "layout": "two"
    },
    "questions": [
      {
        "id": "c22-s42-u03-w010",
        "no": 10,
        "form": "choice",
        "topic": "이산화 탄소의 성질과 이용",
        "prompt": "탄산음료의 기포와 연결되는 대표 기체를 고르세요.",
        "answer": "④ 이산화 탄소",
        "explanation": "탄산음료에는 이산화 탄소가 녹아 있어요. 이산화 탄소가 기포로 나올 수 있으므로 넷째 보기를 골라요.",
        "misconception": "대표적 쓰임을 모든 경우에 적용하거나 기체의 성질을 서로 바꾸지 않았나요?",
        "criteria": "선택한 기호와 선택지 내용이 모두 맞으면 정답이에요.",
        "sourceId": "c22-s42-u03-b55",
        "sourceRef": {
          "type": "authored-supplement",
          "edition": "2022 개정 현행 범위 보충",
          "note": "원문 짝이 없는 독립 창작. 제시 수치/기록은 연습 자료이며 실제 학생 측정/제작/소통 증거가 아님."
        },
        "standard": "4과15-03",
        "choices": [
          "공기(여러 기체의 혼합물)",
          "산소",
          "수소",
          "이산화 탄소",
          "헬륨"
        ],
        "key": 3
      },
      {
        "id": "c22-s42-u03-w011",
        "no": 11,
        "form": "choice",
        "topic": "공기·질소와 생활",
        "prompt": "건조한 공기에서 대부분을 이루는 두 기체를 고르세요.",
        "answer": "③ 질소와 산소",
        "explanation": "공기에는 여러 기체가 섞여 있어요. 건조한 공기의 대부분을 차지하는 두 기체는 질소와 산소이므로 셋째 보기가 알맞아요. 다른 기체도 조금씩 들어 있어요.",
        "misconception": "대표적 쓰임을 모든 경우에 적용하거나 기체의 성질을 서로 바꾸지 않았나요?",
        "criteria": "선택한 기호와 선택지 내용이 모두 맞으면 정답이에요.",
        "sourceId": "c22-s42-u03-b61",
        "sourceRef": {
          "type": "authored-supplement",
          "edition": "2022 개정 현행 범위 보충",
          "note": "원문 짝이 없는 독립 창작. 제시 수치/기록은 연습 자료이며 실제 학생 측정/제작/소통 증거가 아님."
        },
        "standard": "4과15-03",
        "choices": [
          "수소와 헬륨",
          "헬륨과 네온",
          "질소와 산소",
          "산소와 이산화 탄소",
          "네온과 이산화 탄소"
        ],
        "key": 2
      },
      {
        "id": "c22-s42-u03-w012",
        "no": 12,
        "form": "choice",
        "topic": "여러 기체의 쓰임과 정보 범위",
        "prompt": "공기보다 가볍고 잘 타지 않아 비행선에 널리 이용하는 기체는 무엇인가요?",
        "answer": "⑤ 헬륨",
        "explanation": "비행선을 띄우는 데 널리 쓰이는 대표 기체는 헬륨이에요. 헬륨은 공기보다 가볍고 잘 타지 않는 성질이 있으므로 다섯째 보기를 골라요.",
        "misconception": "대표적 쓰임을 모든 경우에 적용하거나 기체의 성질을 서로 바꾸지 않았나요?",
        "criteria": "선택한 기호와 선택지 내용이 모두 맞으면 정답이에요.",
        "sourceId": "c22-s42-u03-b67",
        "sourceRef": {
          "type": "authored-supplement",
          "edition": "2022 개정 현행 범위 보충",
          "note": "원문 짝이 없는 독립 창작. 제시 수치/기록은 연습 자료이며 실제 학생 측정/제작/소통 증거가 아님."
        },
        "standard": "4과15-03",
        "choices": [
          "산소",
          "수소",
          "이산화 탄소",
          "네온",
          "헬륨"
        ],
        "key": 4
      }
    ],
    "fields": [
      {
        "path": [
          "title"
        ],
        "previous": "이산화 탄소의 성질과 이용",
        "value": "기체의 종류와 이용"
      },
      {
        "path": [
          "rail",
          0,
          "text"
        ],
        "previous": "이산화 탄소의 성질을 이용 사례와 연결해요.",
        "value": "탄산음료의 기체, 공기에 많이 들어 있는 기체, 비행선에 이용하는 기체를 구별해요."
      },
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "이용 사례가 어떤 성질과 관련되는지 쓰세요.",
        "value": "이산화 탄소·질소·산소·헬륨을 해당 설명과 연결해요."
      }
    ]
  },
  {
    "index": 19,
    "previous": {
      "section": "기본·적용 16~18",
      "title": "장치 소개와 근거·의견 반영",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s42-u03-w016",
            "c22-s42-u03-w017",
            "c22-s42-u03-w018"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "장치를 설명할 때 작동 모습과 받은 의견을 함께 보여요."
        },
        {
          "title": "더 알아보기",
          "text": "중학교에서는 기체 입자가 벽이나 막에 충돌하여 힘을 가한다고 배워요. 막을 사이에 둔 안쪽과 바깥쪽 기체가 가하는 힘의 차이는 막이 움직이는 모습과 연결돼요."
        },
        {
          "title": "내가 정리할 것",
          "text": "친구의 질문에 답할 그림과 설명을 고르세요.",
          "write": 3
        }
      ],
      "lead": "답을 고른 뒤, 아래 줄에 선택한 근거와 헷갈린 보기를 적어 보세요.",
      "kind": "check",
      "layout": "two"
    },
    "questions": [
      {
        "id": "c22-s42-u03-w016",
        "no": 16,
        "form": "choice",
        "topic": "장치 소개와 근거·의견 반영",
        "prompt": "두 장치를 같은 판·시작 상태·펌프 방법으로5번씩 시험했습니다. 표로 확인할 수 있는 것은 무엇인가요?",
        "answer": "③ 이 기록에서는 나의 성공 횟수가 더 많다.",
        "explanation": "같은 조건에서 가와 나를 각각 5번 시험했어요. 가는 3번, 나는 5번 성공했으므로 이 기록에서는 나의 성공 횟수가 더 많은 셋째 보기가 알맞아요.",
        "misconception": "설계와 실제 제작·시험을 구별하고 한 부분씩 바꾸어 비교했는지 살펴요.",
        "criteria": "선택한 기호와 선택지 내용이 모두 맞으면 정답이에요.",
        "figure": "reuse-c22-s42-u03-b91",
        "sourceRef": {
          "type": "authored-workbook",
          "edition": "2022 개정 현행 범위 보충",
          "note": "원문 짝이 없는 독립 창작. 제시 수치/기록은 연습 자료이며 실제 학생 측정/제작/소통 증거가 아님.",
          "unit": "c22-s42-u03",
          "originalCounterpart": false
        },
        "standard": "4과15-04",
        "choices": [
          "가가 나보다 항상 더 오래 판을 받친다.",
          "나의 최대 높이는 가보다 반드시 더 크다.",
          "이 기록에서는 나의 성공 횟수가 더 많다.",
          "나는 앞으로 어떤 조건에서도 성공한다.",
          "가의 실패는 공기 양이 없었다는 증거다."
        ],
        "key": 2,
        "status": "authored",
        "previousBankSourceId": "c22-s42-u03-b91"
      },
      {
        "id": "c22-s42-u03-w017",
        "no": 17,
        "form": "choice",
        "topic": "같은 부피 용기와 공기의 무게",
        "prompt": "같은 용기의 공기를 일부 뺀 뒤 같은 마개를 닫아 재었습니다. 다른 물질의 출입과 바깥 부피 변화가 없을 때 예상할 무게 변화는 무엇인가요?",
        "answer": "⑤ 공기를 빼기 전보다 줄어든다.",
        "explanation": "같은 용기와 마개를 쓰고 공기만 일부 뺐어요. 공기도 무게가 있으므로 남은 용기와 공기의 전체 무게는 전보다 줄어요. 따라서 다섯째 보기가 알맞아요.",
        "misconception": "같은 용기·마개·바깥 부피로 비교했는지 살펴요.",
        "criteria": "선택한 기호와 선택지 내용이 모두 맞으면 정답이에요.",
        "sourceId": "c22-s42-u03-b03",
        "sourceRef": {
          "type": "authored-supplement",
          "edition": "2022 개정 현행 범위 보충",
          "note": "원문 짝이 없는 독립 창작. 제시 수치/기록은 연습 자료이며 실제 학생 측정/제작/소통 증거가 아님."
        },
        "standard": "4과15-01",
        "choices": [
          "공기 양이 줄어도 용기가 같으므로 무게는 같다.",
          "공기를 뺀 양만큼 마개 무게도 함께 줄어든다.",
          "빠져나간 공기가 가벼워 남은 용기는 무거워진다.",
          "공기를 조금 빼면 처음 무게가 모두 없어진다.",
          "공기를 빼기 전보다 줄어든다."
        ],
        "key": 4
      },
      {
        "id": "c22-s42-u03-w018",
        "no": 18,
        "form": "choice",
        "topic": "무게 측정 자료와 작은 차이",
        "prompt": "작은 무게 차이를 나타내기 어려운 저울에서는 공기를 더 넣기 전후 숫자가 같게 보였어요. 다음 중 알맞은 생각은 무엇인가요?",
        "answer": "② 작은 차이를 못 읽었을 수 있어 다시 확인한다.",
        "explanation": "이 저울이 작은 차이를 표시하지 못했을 수 있으므로 둘째 보기가 알맞아요. 같은 숫자가 보였다는 기록은 남기고, 더 작은 차이를 읽을 수 있는지와 공기가 새지 않았는지를 다시 확인해요.",
        "misconception": "같은 용기·마개·바깥 부피로 비교했는지 살펴요.",
        "criteria": "선택한 기호와 선택지 내용이 모두 맞으면 정답이에요.",
        "sourceId": "c22-s42-u03-b09",
        "sourceRef": {
          "type": "authored-supplement",
          "edition": "2022 개정 현행 범위 보충",
          "note": "원문 짝이 없는 독립 창작. 제시 수치/기록은 연습 자료이며 실제 학생 측정/제작/소통 증거가 아님."
        },
        "standard": "4과15-01",
        "choices": [
          "전후 표시가 같으므로 추가한 공기 양도 같다고 한다.",
          "작은 차이를 못 읽었을 수 있어 다시 확인한다.",
          "전후 표시가 같으므로 공기의 무게는 0이라고 한다.",
          "전후 표시가 같으므로 바깥 부피가 변했다고 한다.",
          "전후 표시가 같으므로 용기 무게만 비교했다고 한다."
        ],
        "key": 1
      }
    ],
    "fields": [
      {
        "path": [
          "title"
        ],
        "previous": "장치 소개와 근거·의견 반영",
        "value": "시험 기록과 무게 비교"
      },
      {
        "path": [
          "rail",
          0,
          "text"
        ],
        "previous": "장치를 설명할 때 작동 모습과 받은 의견을 함께 보여요.",
        "value": "장치의 성공 횟수와 공기를 뺀 뒤의 무게 변화를 자료에 맞게 읽어요. 저울 표시가 같아도 작은 차이가 있을 수 있어요."
      },
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "친구의 질문에 답할 그림과 설명을 고르세요.",
        "value": "장치 가·나의 성공 횟수를 비교해요. 저울 표시가 같을 때 더 확인할 점도 적어요."
      }
    ]
  },
  {
    "index": 23,
    "previous": {
      "section": "조건 고르기",
      "title": "압력과 온도를 나누어 보기",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s42-u03-w026",
            "c22-s42-u03-w027"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "온도와 압력을 동시에 바꾸면 한 조건의 영향만 알기 어려워요."
        },
        {
          "title": "더 알아보기",
          "text": "중학교에서는 온도·압력·부피의 관계를 각각 일정한 조건 아래에서 알아보아요."
        },
        {
          "title": "내가 정리할 것",
          "text": "온도 비교와 압력 비교의 기록을 따로 정리하세요.",
          "write": 3
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [
      {
        "id": "c22-s42-u03-w026",
        "no": 26,
        "form": "multi",
        "topic": "압력 비교",
        "prompt": "같은 공기의 압력과 부피를 비교할 때 같게 할 조건을 모두 골라요.",
        "answer": "①, ③, ⑤",
        "explanation": "압력은 달리할 조건이고 부피는 관찰할 결과예요. 공기 양·온도와 관찰 기구·읽는 방법을 같게 두어 다른 영향이 섞이지 않게 해요. 압력이나 결과 부피까지 같게 맞추는 선택은 질문과 맞지 않아요.",
        "misconception": "바꿀 압력과 결과 부피를 같게 둘 조건에 포함하지 않았나요?",
        "criteria": "공기 양·온도·같은 기구와 읽는 방법 세 항목을 모두 고르고 나머지는 제외해요.",
        "choices": [
          "공기의 양",
          "공기를 누르는 압력",
          "공기의 온도",
          "결과로 나온 부피",
          "관찰할 기구와 읽는 방법"
        ],
        "key": [
          0,
          2,
          4
        ],
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 기체 교재",
          "course": "초등4-2"
        },
        "taxonomy": {
          "standard": "4과15-02",
          "topic": "압력 비교",
          "inquirySkill": "조건·근거 분류와 절차 검토"
        },
        "responseContract": {
          "type": "multiple-selection",
          "accepted": [
            [
              0,
              2,
              4
            ]
          ],
          "teacherRequired": false,
          "orderSensitive": false
        }
      },
      {
        "id": "c22-s42-u03-w027",
        "no": 27,
        "form": "multi",
        "topic": "온도 비교",
        "prompt": "온도에 따른 부피 변화를 살펴볼 조건으로 알맞은 것을 모두 골라요.",
        "answer": "①, ②, ④",
        "explanation": "온도만 바꾸어 비교하려면 공기 양은 같고 바깥 압력은 거의 같아야 해요(①, ②). 주머니도 부풀 수 있어야 부피가 달라지는 모습을 볼 수 있어요(④).",
        "misconception": "온도만 다르게 보려는 비교에 공기 출입이나 고정된 경계를 섞지 않았나요?",
        "criteria": "공기 양·바깥 압력·움직일 경계의 세 조건을 모두 고르면 인정해요.",
        "choices": [
          "같은 양의 공기",
          "거의 같은 바깥 압력",
          "공기 일부를 차례마다 빼기",
          "공기 부피에 따라 부풀 수 있는 주머니",
          "딱딱한 병의 바깥 크기만 재기"
        ],
        "key": [
          0,
          1,
          3
        ],
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 기체 교재",
          "course": "초등4-2"
        },
        "taxonomy": {
          "standard": "4과15-02",
          "topic": "온도 비교",
          "inquirySkill": "조건·근거 분류와 절차 검토"
        },
        "responseContract": {
          "type": "multiple-selection",
          "accepted": [
            [
              0,
              1,
              3
            ]
          ],
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
        "previous": "온도 비교와 압력 비교의 기록을 따로 정리하세요.",
        "value": "온도 비교와 압력 비교에서 같게 둘 조건을 각각 써요."
      }
    ]
  },
  {
    "index": 24,
    "previous": {
      "section": "자료·개선",
      "title": "근거를 골라 설명하기",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s42-u03-w028",
            "c22-s42-u03-w029"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "자료에 있는 변화와 조건을 근거로 설명해요."
        },
        {
          "title": "더 알아보기",
          "text": "중학교에서는 확산 현상을 통해 입자가 계속 운동하고 있음을 추론해요. 기체 입자는 정지해 있지 않고 움직이며 다른 기체와 섞일 수 있어요."
        },
        {
          "title": "내가 정리할 것",
          "text": "내 설명을 뒷받침하는 표의 행을 찾으세요.",
          "write": 3
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [
      {
        "id": "c22-s42-u03-w028",
        "no": 28,
        "form": "multi",
        "topic": "자료 해석",
        "prompt": "같은 바깥 부피의 용기에 공기만 더 넣자120.0 g에서120.3 g이 되었어요. 자료의 해석과 확인할 점으로 알맞은 것을 모두 골라요.",
        "answer": "②, ③, ⑤",
        "explanation": "나중120.3 g에서 처음120.0 g을 빼면0.3 g 증가예요. 용기·마개·바깥 부피가 같고 다른 물질 출입이 없다는 조건에서 공기의 무게를 설명할 근거가 돼요. 차이를 모든 공기의 무게나 안의 전체 공기 무게라고 하지 않아요.",
        "misconception": "전후 차이0.3 g과 용기 안 공기 전체의 무게를 구별했나요?",
        "criteria": "증가량·공기 무게의 근거·다른 조건 확인의 세 항목을 고르면 인정해요.",
        "choices": [
          "공기는 어떤 상황에서도 0.3 g이다",
          "늘어난 무게는 0.3 g이다",
          "공기도 무게가 있다는 근거다",
          "늘어난 값은 용기 안 공기 전체의 무게다",
          "용기·마개 등 다른 조건도 확인해야 한다"
        ],
        "key": [
          1,
          2,
          4
        ],
        "given": [
          "가상 학습 자료 · 같은 용기·마개·바깥 부피 · 다른 물질의 출입 없음"
        ],
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 기체 교재",
          "course": "초등4-2"
        },
        "taxonomy": {
          "standard": "4과15-01",
          "topic": "자료 해석",
          "inquirySkill": "조건·근거 분류와 절차 검토"
        },
        "responseContract": {
          "type": "multiple-selection",
          "accepted": [
            [
              1,
              2,
              4
            ]
          ],
          "teacherRequired": false,
          "orderSensitive": false
        }
      },
      {
        "id": "c22-s42-u03-w029",
        "no": 29,
        "form": "multi",
        "topic": "장치 개선",
        "prompt": "공기 인형이 잘 움직이지 않을 때 알맞은 행동을 모두 골라요.",
        "answer": "②, ④, ⑤",
        "explanation": "잘 움직이지 않는 까닭은 연결부 누출·관 막힘·움직일 부분의 걸림 등일 수 있어요. 먼저 단서를 확인하고 한 부분만 고친 뒤 같은 기준으로 다시 시험해요. 여러 부분을 한꺼번에 바꾸면 어느 수정의 효과인지 가리기 어려워요.",
        "misconception": "원인을 확인하기 전에 펌프 방법이나 여러 재료를 함께 바꾸지 않았나요?",
        "criteria": "누출 확인·관 상태 확인·한 부분 수정 후 재시험을 모두 고르면 인정해요.",
        "choices": [
          "관·주머니·종이 무게를 한꺼번에 바꾼다",
          "공기가 새는 연결부를 살핀다",
          "원인 확인 없이 펌프 횟수만 늘려 같은 비교로 본다",
          "관이 눌리거나 막혔는지 살핀다",
          "한 부분만 고친 뒤 다시 시험한다"
        ],
        "key": [
          1,
          3,
          4
        ],
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 기체 교재",
          "course": "초등4-2"
        },
        "taxonomy": {
          "standard": "4과15-04",
          "topic": "장치 개선",
          "inquirySkill": "조건·근거 분류와 절차 검토"
        },
        "responseContract": {
          "type": "multiple-selection",
          "accepted": [
            [
              1,
              3,
              4
            ]
          ],
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
        "previous": "내 설명을 뒷받침하는 표의 행을 찾으세요.",
        "value": "늘어난 0.3 g은 무엇의 무게인가요? 공기 인형을 고치기 전에 살필 곳도 적어요."
      }
    ]
  },
  {
    "index": 25,
    "previous": {
      "section": "연결하기",
      "title": "조건과 기체의 쓰임",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s42-u03-w030",
            "c22-s42-u03-w031"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "기체의 종류·성질·쓰임을 같은 기준으로 비교해요."
        },
        {
          "title": "더 알아보기",
          "text": "중학교에서는 순물질과 혼합물을 구별해요. 공기는 질소·산소 등 여러 기체가 섞인 혼합물이므로, 공기의 성질을 한 종류 기체의 성질과 모두 같다고 볼 수는 없어요."
        },
        {
          "title": "내가 정리할 것",
          "text": "공기와 그 안의 기체 이름을 나누어 적으세요.",
          "write": 3
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [
      {
        "id": "c22-s42-u03-w030",
        "no": 30,
        "form": "match",
        "topic": "조건 구별",
        "prompt": "〈보기〉에서 알맞은 기호를 골라 조건과 결과를 연결해요.",
        "answer": "(1) ㄴ (2) ㄷ (3) ㄱ",
        "explanation": "압력을 비교하는 실험에서 바꿀 것은 누르는 압력이므로 (1)은 ㄴ이에요. 온도를 비교할 때 공기 양과 바깥 압력은 같게 두므로 (2)는 ㄷ이에요. 두 실험에서 관찰하는 결과는 부피이므로 (3)은 ㄱ이에요. 무엇을 바꾸어 보는 실험인지 먼저 확인해요.",
        "misconception": "바꿀 것·같게 둘 것·관찰할 결과를 서로 바꾸지 않았나요?",
        "criteria": "각 부분에ㄴ·ㄷ·ㄱ을 순서대로 연결하면 인정해요.",
        "parts": [
          "(1) 압력 비교에서 바꿀 것",
          "(2) 온도 비교에서 같게 둘 것",
          "(3) 두 실험에서 관찰할 결과"
        ],
        "answerPerPart": true,
        "given": [
          "〈보기〉 ㄱ. 공기의 부피  ㄴ. 공기를 누르는 압력  ㄷ. 공기 양과 바깥 압력"
        ],
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 기체 교재",
          "course": "초등4-2"
        },
        "taxonomy": {
          "standard": "4과15-02",
          "topic": "조건 구별",
          "inquirySkill": "조건·근거 분류와 절차 검토"
        },
        "responseContract": {
          "type": "ordered-parts",
          "accepted": [
            [
              "ㄴ",
              "ㄷ",
              "ㄱ"
            ]
          ],
          "teacherRequired": false
        }
      },
      {
        "id": "c22-s42-u03-w031",
        "no": 31,
        "form": "match",
        "topic": "기체와 쓰임",
        "prompt": "자료에서 확인한 기체와 대표적인 이용을 연결해요.",
        "answer": "(1) ㄷ (2) ㄱ (3) ㄴ",
        "explanation": "자료에서 산소는 호흡 보조에 쓰이므로 (1)은 ㄷ이에요. 질소는 다른 물질과 쉽게 반응하지 않는 성질을 일부 식품 포장에 이용하므로 (2)는 ㄱ이에요. 탄산음료에 이용되는 이산화 탄소는 (3) ㄴ과 연결해요.",
        "misconception": "기체 이름만 외우지 않고 어떤 성질이 쓰임과 이어지는지 생각했나요?",
        "criteria": "산소ㄷ·질소ㄱ·이산화 탄소ㄴ을 각 칸에 연결하면 인정해요.",
        "parts": [
          "(1) 산소",
          "(2) 질소",
          "(3) 이산화 탄소"
        ],
        "answerPerPart": true,
        "given": [
          "〈보기〉 ㄱ. 일부 식품 포장  ㄴ. 탄산음료  ㄷ. 호흡 보조"
        ],
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 기체 교재",
          "course": "초등4-2"
        },
        "taxonomy": {
          "standard": "4과15-03",
          "topic": "기체와 쓰임",
          "inquirySkill": "조건·근거 분류와 절차 검토"
        },
        "responseContract": {
          "type": "ordered-parts",
          "accepted": [
            [
              "ㄷ",
              "ㄱ",
              "ㄴ"
            ]
          ],
          "teacherRequired": false
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
        "previous": "공기와 그 안의 기체 이름을 나누어 적으세요.",
        "value": "두 비교에서 같게 둘 조건과 세 기체의 대표적인 쓰임을 정리해요."
      }
    ]
  },
  {
    "index": 29,
    "previous": {
      "section": "모형과 실제",
      "title": "실제 측정과 설계를 구별하기",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s42-u03-w038"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "측정한 일과 설계한 일은 서로 다른 활동이에요."
        },
        {
          "title": "더 알아보기",
          "text": "중학교에서는 기체가 압력을 만드는 까닭을 입자와 벽의 충돌로 설명해요. 공기로 움직이는 장치를 이해할 때에도 보이는 부품의 움직임과 보이지 않는 기체가 가하는 힘을 연결해요."
        },
        {
          "title": "내가 정리할 것",
          "text": "완료한 단계와 다음에 할 단계를 나누어 쓰세요.",
          "write": 3
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [
      {
        "id": "c22-s42-u03-w038",
        "no": 38,
        "form": "written",
        "topic": "모형의 한계",
        "prompt": "모형은30 ℃에서62 mL, 다른 주머니는 같은 온도에서60 mL였다고 정한 자료예요. 두 값이 다르니 어느 하나를 고쳐야 할까요? 비교하기 전에 확인할 조건을 써요.",
        "answer": "두 값을 마음대로 고치지 않는다. 모형과 다른 주머니의 기록을 나누고 공기 양·바깥 압력·주머니가 부풀 수 있는 정도·기다린 시간을 확인한다. 온도가 같다고 부피도 반드시 같은 것은 아니다.",
        "explanation": "62 mL는 모형의 값이고 60 mL는 다른 주머니에서 읽었다고 정한 값이에요. 온도가 같아도 공기 양이나 바깥 압력, 주머니가 부풀 수 있는 정도와 기다린 시간이 다를 수 있어요. 숫자를 맞춰 고치기 전에 이 조건들을 비교해요.",
        "misconception": "온도 하나가 같다는 이유로 다른 공기 양과 기구의 부피도 같아야 한다고 하지 않았나요?",
        "criteria": "자료의 성격 구별과 비교할 조건 두 가지 이상을 제시하고 어느 값을 임의로 고치지 않으면 인정해요.",
        "lines": 3,
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 기체 교재",
          "course": "초등4-2"
        },
        "taxonomy": {
          "standard": "4과15-02",
          "topic": "모형의 한계",
          "inquirySkill": "조건과 자료를 연결한 설명·설계"
        },
        "responseContract": {
          "teacherRequired": true,
          "requiredElements": [
            "자료의 성격 구별과 비교할 조건 두 가지 이상을 제시하고 어느 값을 임의로 고치지 않으면 인정해요."
          ]
        }
      }
    ],
    "fields": [
      {
        "path": [
          "title"
        ],
        "previous": "실제 측정과 설계를 구별하기",
        "value": "모형과 다른 주머니의 기록"
      },
      {
        "path": [
          "rail",
          0,
          "text"
        ],
        "previous": "측정한 일과 설계한 일은 서로 다른 활동이에요.",
        "value": "온도가 같아도 공기의 양이나 바깥 압력 등이 다르면 부피가 다를 수 있어요. 조건을 확인하기 전에 값을 고치지 않아요."
      },
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "완료한 단계와 다음에 할 단계를 나누어 쓰세요.",
        "value": "두 기록을 비교하려면 온도 외에 어떤 조건을 더 확인해야 하는지 써요."
      }
    ]
  },
  {
    "index": 34,
    "previous": {
      "section": "생각 넓히기 ① · 다시 생각",
      "title": "변화가 보이지 않으면 무엇을 확인할까요?",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s42-u03-w047"
          ]
        },
        {
          "type": "field",
          "title": "교사의 비교 자료 읽기",
          "hint": "같은 조건인지 살펴본 자료와 아직 분명하지 않은 점을 짧게 적어요. 직접 측정하지 않았다면 자료 확인이라고 표시해요.",
          "lines": 5,
          "draw": false
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "변화가 작으면 기구와 조건부터 다시 살펴요."
        },
        {
          "title": "더 알아보기",
          "text": "중학교에서는 온도가 다른 물체 사이에 열이 이동하는 과정을 배워요. 기체가 든 용기를 따뜻한 물에 넣은 직후에는 물과 기체의 온도가 아직 같지 않을 수 있어, 열을 주고받는 시간도 생각해요."
        },
        {
          "title": "내가 정리할 것",
          "text": "기다린 시간과 읽는 방법 중 확인할 것을 고르세요.",
          "write": 5
        }
      ],
      "lead": "",
      "kind": "practice"
    },
    "questions": [
      {
        "id": "c22-s42-u03-w047",
        "no": 47,
        "form": "written",
        "topic": "저울의 한계",
        "prompt": "한 모둠의 저울에서는 전후 값이 같게 보였어요. 「공기는 무게가 없다」고 발표하려는 친구에게 확인할 점 두 가지를 제안하세요.",
        "answer": "저울이 얼마나 작은 차이를 나타낼 수 있는지 확인한다. 공기가 실제로 더 들어갔는지, 새지 않았는지, 같은 용기·마개로 쟀는지 확인하고 필요하면 교사의 더 알맞은 자료와 비교한다.",
        "explanation": "저울이 얼마나 작은 무게 차이를 나타낼 수 있는지 확인해요. 공기가 실제로 더 들어갔고 새지 않았는지, 같은 용기와 마개를 썼는지도 살펴요. 이 중 두 가지를 골라 설명하고, 읽은 숫자는 그대로 남겨요.",
        "misconception": "예상한 차이가 안 보인다는 이유로 원래 기록을 지우지 않았나요?",
        "criteria": "저울의 한계와 공기 출입/비교 조건 중 한 가지를 제안하며 성급한 결론을 고치면 인정해요.",
        "lines": 3,
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 기체 교재 보강",
          "course": "초등4-2"
        },
        "taxonomy": {
          "standard": "4과15-01",
          "topic": "저울의 한계",
          "inquirySkill": "무게 비교 조건과 측정 한계"
        },
        "responseContract": {
          "teacherRequired": true,
          "requiredElements": [
            "저울의 한계와 공기 출입/비교 조건 중 한 가지를 제안하며 성급한 결론을 고치면 인정해요."
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
        "previous": "기다린 시간과 읽는 방법 중 확인할 것을 고르세요.",
        "value": "저울이 작은 차이를 읽을 수 있는지, 공기가 더 들어가고 새지 않았는지 확인할 방법을 써요."
      }
    ]
  },
  {
    "index": 36,
    "previous": {
      "section": "생각 넓히기 ②",
      "title": "열린 주사기와 닫힌 주사기",
      "blocks": [
        {
          "type": "text",
          "text": "연습용 가상 자료예요. 같은 온도에서 바늘 없는 주사기를 비교했어요. A는 마개를 닫아 공기가 새지 않아요. 시작40 mL→살짝 누름30 mL→더 누름25 mL→손을 뗀 뒤39 mL예요. B는 끝이 열려 있어 공기가 드나들어요. 시작40 mL→누름10 mL예요. 두 주사기에서 피스톤 앞쪽 공간의 눈금을 읽었어요."
        },
        {
          "type": "questions",
          "ids": [
            "c22-s42-u03-w049",
            "c22-s42-u03-w050"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "입구를 열거나 막으면 공기가 드나드는 조건이 달라져요."
        },
        {
          "title": "더 알아보기",
          "text": "중학교에서는 부피 변화와 입자 수 변화를 구별해 같은 부피 감소도 다른 과정에서 나타날 수 있음을 설명해요."
        },
        {
          "title": "내가 정리할 것",
          "text": "두 주사기에서 공기의 양이 같은지 비교하세요.",
          "write": 5
        }
      ],
      "lead": "",
      "kind": "practice",
      "sharedContext": {
        "id": "closed-open-v1",
        "text": "연습용 가상 자료예요. 같은 온도에서 바늘 없는 주사기를 비교했어요. A는 마개를 닫아 공기가 새지 않아요. 시작40 mL→살짝 누름30 mL→더 누름25 mL→손을 뗀 뒤39 mL예요. B는 끝이 열려 있어 공기가 드나들어요. 시작40 mL→누름10 mL예요. 두 주사기에서 피스톤 앞쪽 공간의 눈금을 읽었어요."
      }
    },
    "questions": [
      {
        "id": "c22-s42-u03-w049",
        "no": 49,
        "form": "choice",
        "topic": "열림과 닫힘",
        "prompt": "A에서 직접 읽은 관찰 사실에 해당하는 것은?",
        "answer": "⑤ 더 누를 때 눈금이25 mL가 되었다",
        "explanation": "자료에 직접 적힌 것은 더 누른 때 눈금이25 mL가 되었다는 관찰이에요. A의 공기는 새지 않으므로 부피 감소를 양 감소로 바꾸지 않아요. 손을 뗀 뒤 값은39 mL이고, 눈금만으로 누르는 힘의 크기를 잰 것도 아니에요.",
        "misconception": "실제로 적힌25/39 mL와 예상한40 mL를 섞지 않았나요?",
        "criteria": "A의 더 누른 때 눈금25 mL라는 관찰 보기를 고르면 인정해요.",
        "choices": [
          "공기의 양도40에서25만큼 줄었다",
          "손을 뗀 뒤 정확히40 mL가 되었다",
          "A와B 모두 공기 양이 일정했다",
          "이 눈금만으로 누른 힘의 크기를 쟀다",
          "더 누를 때 눈금이25 mL가 되었다"
        ],
        "key": 4,
        "contextRef": "closed-open-v1",
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 기체 교재 보강",
          "course": "초등4-2"
        },
        "taxonomy": {
          "standard": "4과15-02",
          "topic": "열림과 닫힘",
          "inquirySkill": "변인 통제와 관찰·추론"
        },
        "responseContract": {
          "type": "single-choice",
          "teacherRequired": false,
          "accepted": [
            4
          ]
        }
      },
      {
        "id": "c22-s42-u03-w050",
        "no": 50,
        "form": "multi",
        "topic": "압력 비교 조건",
        "prompt": "A에서 누르는 정도에 따른 부피 변화를 비교할 때 같게 해야 할 것을 모두 고르세요.",
        "answer": "②, ⑤",
        "explanation": "A에서 바꿀 것은 누르는 압력이고 관찰할 결과는 부피예요. 공기 양과 온도는 같게 유지해야 다른 영향이 섞이지 않아요. 피스톤 위치나 들어간 거리는 부피와 함께 달라지는 결과이므로 미리 같은 값으로 맞추지 않아요.",
        "misconception": "일정하게 둘 공기 양·온도와 압력·피스톤 위치라는 변화/결과를 구별했나요?",
        "criteria": "안에 가둔 공기 양과 공기 온도 두 항목만 고르면 인정해요.",
        "choices": [
          "누르는 정도",
          "안에 가둔 공기의 양",
          "피스톤이 가리키는 결과 눈금",
          "피스톤이 안으로 들어간 거리",
          "공기의 온도"
        ],
        "key": [
          1,
          4
        ],
        "contextRef": "closed-open-v1",
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 기체 교재 보강",
          "course": "초등4-2"
        },
        "taxonomy": {
          "standard": "4과15-02",
          "topic": "압력 비교 조건",
          "inquirySkill": "변인 통제와 관찰·추론"
        },
        "responseContract": {
          "type": "multiple-selection",
          "accepted": [
            [
              1,
              4
            ]
          ],
          "orderSensitive": false,
          "teacherRequired": false
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
        "previous": "두 주사기에서 공기의 양이 같은지 비교하세요.",
        "value": "닫힌 A에서 부피와 공기의 양을 구별해요. 열린 B에서는 무엇이 달라질 수 있나요?"
      }
    ]
  },
  {
    "index": 40,
    "previous": {
      "section": "생각 넓히기 ③",
      "title": "따뜻하게·차게 바꾼 자료",
      "blocks": [
        {
          "type": "text",
          "text": "같은 공기 양·바깥 압력, 새지 않고 가볍게 움직이는 주머니의 연습용 모형 자료예요. 각 온도에서 충분히 기다렸어요."
        },
        {
          "type": "table",
          "heads": [
            "차례",
            "온도(℃)",
            "부피(mL)"
          ],
          "rows": [
            [
              "1",
              "15",
              "58"
            ],
            [
              "2",
              "25",
              "60"
            ],
            [
              "3",
              "35",
              "62"
            ],
            [
              "4",
              "15",
              "58"
            ]
          ]
        },
        {
          "type": "questions",
          "ids": [
            "c22-s42-u03-w057",
            "c22-s42-u03-w058"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "따뜻할 때와 찰 때의 부피를 같은 조건에서 비교해요."
        },
        {
          "title": "더 알아보기",
          "text": "중학교에서는 온도가 높아질수록 입자의 운동이 활발해짐을 기체의 팽창과 연결해 설명해요."
        },
        {
          "title": "내가 정리할 것",
          "text": "온도 외에 같게 둔 조건을 표에서 찾으세요.",
          "write": 5
        }
      ],
      "lead": "",
      "kind": "practice",
      "sharedContext": {
        "id": "warming-cooling-v1",
        "text": "연습용 모형 자료예요. 같은 양의 공기를 얇은 주머니에 가두고, 바깥 압력을 같게 했어요. 주머니 경계는 가볍게 움직일 수 있고 공기가 새지 않아요. 각 온도에서 충분히 기다린 뒤 읽었어요. 15 ℃58 mL→25 ℃60 mL→35 ℃62 mL→다시15 ℃58 mL예요. 다른 온도의 정확한 값을 계산하는 공식은 배우지 않아요."
      }
    },
    "questions": [
      {
        "id": "c22-s42-u03-w057",
        "no": 57,
        "form": "choice",
        "topic": "온도 비교 자료",
        "prompt": "35 ℃에서 다시15 ℃로 바꾼 뒤의 자료를 바르게 읽은 것은?",
        "answer": "② 부피가62 mL에서58 mL로 줄었다",
        "explanation": "35 ℃의62 mL에서 다시15 ℃의58 mL로 읽은 자료예요. 따라서 부피가62 mL에서58 mL로 줄었다는 보기를 골라요. 새지 않는 조건이므로4 mL를 공기가 빠진 양으로 바꾸거나45 ℃의 값을 이 자료에서 읽었다고 하지 않아요.",
        "misconception": "차갑게 돌아온 기록과 따뜻해질 때 기록을 거꾸로 읽지 않았나요?",
        "criteria": "제시된62→58 mL의 부피 감소를 읽은 보기를 고르면 인정해요.",
        "choices": [
          "부피가58 mL에서62 mL로 늘었다",
          "부피가62 mL에서58 mL로 줄었다",
          "닫힌 주머니 밖으로 공기4 mL가 빠졌다",
          "45 ℃의 부피도 이 자료에서 읽을 수 있다",
          "다시15 ℃여도 부피는62 mL로 남았다"
        ],
        "key": 1,
        "contextRef": "warming-cooling-v1",
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 기체 교재 보강",
          "course": "초등4-2"
        },
        "taxonomy": {
          "standard": "4과15-02",
          "topic": "온도 비교 자료",
          "inquirySkill": "변인 통제와 관찰·추론"
        },
        "responseContract": {
          "type": "single-choice",
          "teacherRequired": false,
          "accepted": [
            1
          ]
        }
      },
      {
        "id": "c22-s42-u03-w058",
        "no": 58,
        "form": "multi",
        "topic": "온도 자료의 범위",
        "prompt": "제시한 자료로 말할 수 있는 것을 모두 고르세요.",
        "answer": "②, ③, ④",
        "explanation": "같은 양·같은 바깥 압력에서 따뜻해질 때58→60→62 mL로 커졌고, 다시15 ℃에서 처음과 같은58 mL를 읽었어요. 이 세 설명은 자료와 맞아요. 제시하지 않은45 ℃의 정확한 값이나 모든 단단한 용기의 변화까지 정할 수는 없어요.",
        "misconception": "관찰한 범위의 변화 방향과 자료 밖 온도의 정확한 값을 구별했나요?",
        "criteria": "따뜻할 때 증가·다시15 ℃의 같은 값·같은 양 비교 세 항목을 고르면 인정해요.",
        "choices": [
          "45 ℃의 정확한 값도 반드시 알 수 있다",
          "이 조건에서 따뜻해질 때 부피가 커졌다",
          "다시15 ℃에서 처음과 같은 부피를 읽었다",
          "같은 양의 공기를 비교했다",
          "모든 딱딱한 용기 자체도 똑같이 커진다"
        ],
        "key": [
          1,
          2,
          3
        ],
        "contextRef": "warming-cooling-v1",
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 기체 교재 보강",
          "course": "초등4-2"
        },
        "taxonomy": {
          "standard": "4과15-02",
          "topic": "온도 자료의 범위",
          "inquirySkill": "변인 통제와 관찰·추론"
        },
        "responseContract": {
          "type": "multiple-selection",
          "accepted": [
            [
              1,
              2,
              3
            ]
          ],
          "orderSensitive": false,
          "teacherRequired": false
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
        "previous": "온도 외에 같게 둔 조건을 표에서 찾으세요.",
        "value": "온도 외에 같게 둔 조건을 자료에서 찾으세요."
      }
    ]
  },
  {
    "index": 42,
    "previous": {
      "section": "생각 넓히기 ③ · 다시 생각",
      "title": "변화가 분명하지 않을 때",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s42-u03-w063"
          ]
        },
        {
          "type": "field",
          "title": "자료와 다음 확인",
          "hint": "제공 자료에서 확인한 변화와 실제 기구에서 추가로 살필 조건을 나누어 써요.",
          "lines": 5,
          "draw": false
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "변화가 뚜렷하지 않은 기록도 그대로 남겨요."
        },
        {
          "title": "더 알아보기",
          "text": "중학교에서 기체의 온도와 부피 관계를 비교할 때에는 같은 양의 기체와 일정한 압력이 필요해요. 입자 수가 다른 장치를 그대로 비교하면 온도만의 영향을 알아보기 어려워요."
        },
        {
          "title": "내가 정리할 것",
          "text": "다른 모둠과 비교할 조건을 두 가지 쓰세요.",
          "write": 5
        }
      ],
      "lead": "",
      "kind": "practice"
    },
    "questions": [
      {
        "id": "c22-s42-u03-w063",
        "no": 63,
        "form": "written",
        "topic": "온도 비교의 한계",
        "prompt": "한 번 따뜻하게 했는데 주머니가 눈에 띄게 커지지 않았어요. 「따뜻해져도 부피는 달라지지 않는다」고 결론 내리기 전에 무엇을 확인할까요?",
        "answer": "주머니 안 공기가 따뜻해질 만큼 기다렸는지, 주머니가 더 부풀 수 있는지, 공기가 샜는지, 바깥에서 누르는 조건이 같은지 확인한다.",
        "explanation": "눈에 띄게 커지지 않았다는 기록은 남겨요. 안의 공기가 따뜻해질 만큼 기다렸는지, 주머니가 더 부풀 수 있는지, 공기가 새었는지와 누르는 조건을 확인해요. 한 번 잘 보이지 않았다고 온도와 부피가 관계없다고 말할 수는 없어요.",
        "misconception": "한 번 안 보인 변화와 어떤 조건에서도 변화가 없다는 결론을 같게 보지 않았나요?",
        "criteria": "관련 조건 둘 이상과 성급하게 일반화하지 않는 판단을 제시하면 인정해요.",
        "lines": 3,
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 기체 교재 보강",
          "course": "초등4-2"
        },
        "taxonomy": {
          "standard": "4과15-02",
          "topic": "온도 비교의 한계",
          "inquirySkill": "변인 통제와 관찰·추론"
        },
        "responseContract": {
          "teacherRequired": true,
          "requiredElements": [
            "관련 조건 둘 이상과 성급하게 일반화하지 않는 판단을 제시하면 인정해요."
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
        "previous": "다른 모둠과 비교할 조건을 두 가지 쓰세요.",
        "value": "주머니가 더 부풀 수 있는지, 공기가 충분히 따뜻해졌는지 등 확인할 조건을 두 가지 써요."
      }
    ]
  },
  {
    "index": 47,
    "previous": {
      "section": "생각 넓히기 ④ · 그림",
      "title": "출처가 있는 비교 카드를 만들어요",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s42-u03-w072"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "비교 카드는 같은 항목과 정확한 출처로 만들어요."
        },
        {
          "title": "더 알아보기",
          "text": "중학교에서 순물질과 혼합물을 구별할 때에는 겉보기 색만 보지 않아요. 공기와 산소는 모두 무색으로 보여도, 공기는 여러 기체가 섞인 것이고 산소는 한 종류의 물질이에요."
        },
        {
          "title": "내가 정리할 것",
          "text": "카드의 항목·단위·출처가 맞는지 점검하세요.",
          "write": 5
        }
      ],
      "lead": "",
      "kind": "draw-task"
    },
    "questions": [
      {
        "id": "c22-s42-u03-w072",
        "no": 72,
        "form": "draw",
        "topic": "조사 카드 만들기",
        "prompt": "산소·질소 자료 카드 두 칸을 그리세요. 공통점·각 성질과 쓰임·출처를 넣고, 자료 조사임을 표시하세요.",
        "answer": "두 칸에 산소/질소를 나누고 모두 색이 없다는 공통점, 각각의 쓰임과 RSC 자료 출처를 적는다. 자료 조사이며 실제 기체 시험 기록이 아니라고 표시한다.",
        "explanation": "두 칸에 산소와 질소를 나누고 색이 없다는 공통점을 써요. 각 성질을 해당 쓰임과 연결하고 RSC 자료의 출처를 표시해 어떤 근거인지 밝혀요. 기체를 서로 다른 색으로 칠해 종류를 가려냈다고 설명하지 않아요.",
        "misconception": "눈에 보이지 않는 기체를 임의 색깔로 구별한 결과처럼 그리지 않았나요?",
        "criteria": "두 이름·색의 공통점·각 성질/쓰임·출처와 자료 조사임이 드러나면 다른 카드 구성도 인정해요.",
        "drawing": "large",
        "given": [
          "RSC 자료 요약: 산소와 질소는 색이 없어요. 산소는 호흡·연소를 돕는 데, 질소는 쉽게 반응하지 않는 성질을 이용한 일부 식품 포장에 쓰여요."
        ],
        "drawingExplanationLines": 3,
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 기체 교재 보강",
          "course": "초등4-2"
        },
        "taxonomy": {
          "standard": "4과15-03",
          "topic": "조사 카드 만들기",
          "inquirySkill": "자료 조사와 성질·쓰임 연결"
        },
        "responseContract": {
          "teacherRequired": true,
          "requiredElements": [
            "두 이름·색의 공통점·각 성질/쓰임·출처와 자료 조사임이 드러나면 다른 카드 구성도 인정해요."
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
        "previous": "카드의 항목·단위·출처가 맞는지 점검하세요.",
        "value": "두 카드에 색·성질·쓰임·출처를 같은 항목으로 담았는지 살펴요. 자료 조사라는 표시도 넣어요."
      }
    ]
  },
  {
    "index": 48,
    "previous": {
      "section": "생각 넓히기 ⑤",
      "title": "한 곳만 고친 비교를 찾아요",
      "blocks": [
        {
          "type": "text",
          "text": "연습용 가상 장치 기록이에요. 손 펌프→관→얇은 주머니로 공기를 보내 가벼운 종이판을 일으켜요. 성공 기준은 같은 시작선의 종이판이 표시선까지 올라가는 것이에요. 가·나는 같은 종이·주머니·시작 상태·펌프 방법으로 시험했어요. 가: 수정 전5회 중3회 성공. 나: 연결부 한 곳만 밀봉한 뒤5회 중5회 성공. 다: 연결부를 밀봉하고 더 무거운 종이로 바꿔5회 중2회 성공. 라: 관 교체를 계획했지만 시험하지 않았어요. 실제 내 제작 결과가 아니에요."
        },
        {
          "type": "questions",
          "ids": [
            "c22-s42-u03-w073",
            "c22-s42-u03-w074"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "고친 곳 외의 시험 조건도 같아야 해요."
        },
        {
          "title": "더 알아보기",
          "text": "중학교에서는 기체의 압력을 입자가 벽에 가하는 힘과 연결해요. 서로 이어진 두 공간의 압력이 다르면 기체가 높은 압력 쪽에서 낮은 압력 쪽으로 흐를 수 있어요."
        },
        {
          "title": "내가 정리할 것",
          "text": "같게 둘 공기의 양과 조작 방법을 정하세요.",
          "write": 5
        }
      ],
      "lead": "",
      "kind": "practice",
      "sharedContext": {
        "id": "device-trials-v1",
        "text": "연습용 가상 장치 기록이에요. 손 펌프→관→얇은 주머니로 공기를 보내 가벼운 종이판을 일으켜요. 성공 기준은 같은 시작선의 종이판이 표시선까지 올라가는 것이에요. 가·나는 같은 종이·주머니·시작 상태·펌프 방법으로 시험했어요. 가: 수정 전5회 중3회 성공. 나: 연결부 한 곳만 밀봉한 뒤5회 중5회 성공. 다: 연결부를 밀봉하고 더 무거운 종이로 바꿔5회 중2회 성공. 라: 관 교체를 계획했지만 시험하지 않았어요. 실제 내 제작 결과가 아니에요."
      }
    },
    "questions": [
      {
        "id": "c22-s42-u03-w073",
        "no": 73,
        "form": "choice",
        "topic": "장치 비교 자료",
        "prompt": "연결부 한 곳을 공기가 새지 않게 고쳤을 때 작동이 달라지는지 비교하려고 해요. 가장 알맞은 두 기록을 고르세요.",
        "answer": "④ 가와 나",
        "explanation": "가와 나는 같은 종이·주머니·처음 상태·펌프 방법으로 시험했고 성공 기준도 같아요. 달라진 것은 연결부 한 곳을 공기가 새지 않게 고친 점이므로 가와 나를 비교해요. 다는 종이 무게도 다르고, 라는 아직 시험하지 않았어요.",
        "misconception": "좋은 결과 두 개만 고르거나 아직 시험하지 않은 라를 비교 결과에 넣지 않았나요?",
        "criteria": "같은 조건에서 밀봉 한 곳만 달라지는 가와 나를 고르면 인정해요.",
        "choices": [
          "가와 다",
          "나와 다",
          "다와 라",
          "가와 나",
          "가와 라"
        ],
        "key": 3,
        "contextRef": "device-trials-v1",
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 기체 교재 보강",
          "course": "초등4-2"
        },
        "taxonomy": {
          "standard": "4과15-04",
          "topic": "장치 비교 자료",
          "inquirySkill": "공기 장치 설계와 개선 근거"
        },
        "responseContract": {
          "type": "single-choice",
          "teacherRequired": false,
          "accepted": [
            3
          ]
        }
      },
      {
        "id": "c22-s42-u03-w074",
        "no": 74,
        "form": "multi",
        "topic": "장치 기록의 범위",
        "prompt": "제공 기록에서 확인할 수 있는 것을 모두 고르세요.",
        "answer": "①, ④, ⑤",
        "explanation": "나는5번 중5번 성공, 라의 관 교체는 미시험, 가·나는 같은 성공 기준이라는 점은 기록에서 읽을 수 있어요. 다는 종이 무게도 달라졌으므로 그 영향이 없다고 확정할 수 없고, 나의5회가 모든 조건의 성공을 보장하지도 않아요.",
        "misconception": "기록에 있는5회 결과와 시험하지 않은 조건의 결과를 구별했나요?",
        "criteria": "나5회 성공·라미시험·가/나같은 기준 세 항목을 모두 고르면 인정해요.",
        "choices": [
          "나의 기록은5회 모두 성공이다",
          "나의 장치는 모든 조건에서 반드시 성공한다",
          "다의 결과는 종이 무게와 무관하다고 확정된다",
          "라의 관 교체는 아직 시험하지 않았다",
          "가·나는 같은 성공 기준으로 비교했다"
        ],
        "key": [
          0,
          3,
          4
        ],
        "contextRef": "device-trials-v1",
        "status": "authored",
        "sourceRef": {
          "type": "independently-authored-workbook",
          "edition": "GFIELD 기체 교재 보강",
          "course": "초등4-2"
        },
        "taxonomy": {
          "standard": "4과15-04",
          "topic": "장치 기록의 범위",
          "inquirySkill": "공기 장치 설계와 개선 근거"
        },
        "responseContract": {
          "type": "multiple-selection",
          "accepted": [
            [
              0,
              3,
              4
            ]
          ],
          "orderSensitive": false,
          "teacherRequired": false
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
        "previous": "같게 둘 공기의 양과 조작 방법을 정하세요.",
        "value": "가·나에서 같게 둔 종이·주머니·시작 상태·펌프 방법을 찾아요. 같은 기준으로 성공 횟수도 비교해요."
      }
    ]
  }
];
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),clone=x=>JSON.parse(JSON.stringify(x));
export function withGasContextWorkbook(workbook){
 if(workbook?.unit!=='c22-s42-u03'||!Array.isArray(workbook.questions)||!Array.isArray(workbook.pages))return workbook;
 let changed=false;
 const replace=page=>{
  const p=directions.find(p=>same(page,p.previous)&&p.questions.every(old=>same(workbook.questions.find(q=>q.id===old.id),old)));
  if(!p)return page;changed=true;const next=clone(page);for(const{path,value}of p.fields){let at=next;for(const key of path.slice(0,-1))at=at[key];at[path.at(-1)]=value;}return next;
 };
 const pages=workbook.pages.map(replace),teacherStudentPages=workbook.teacherStudentPages?.map(replace),questions=workbook.questions.map(q=>{const p=patches.find(p=>same(q,p.previous));if(!p)return q;changed=true;return{...q,...clone(p.fields)};});
 return changed?{...workbook,questions,pages,...(teacherStudentPages?{teacherStudentPages}:{})}:workbook;
}
