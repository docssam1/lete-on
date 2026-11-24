// Compare positions, elapsed times and speeds with brief responses; retain real measurements.
export const MOTION_MIXED_VERSION='20261124-motion-mixed-responses';
const unit='c22-s61-u02',prior='d9827d5184447bab';
const review={
  "12": {
    "prompt": "점 P는 가로 3눈금, 세로 1눈금에 있어요. 가로부터 읽으면 ((1)[ ], (2)[ ])이에요.",
    "answer": "3 / 1",
    "explanation": "가로 눈금을 먼저, 세로 눈금을 나중에 읽어요. 두 수의 순서를 바꾸지 않아요.",
    "required": [
      "빈칸의 수치·단위·낱말"
    ],
    "misconception": "가로 눈금을 먼저, 세로 눈금을 나중에 읽으며 두 점 사이 거리는 계산하지 않아요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "3",
            "3눈금",
            "세"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "1",
            "1눈금",
            "한"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "f8a7e5369f12b48c"
  },
  "22": {
    "prompt": "한 시각에 점 P가 (3, 2)에 있다는 그림만 있어요. 움직였는지 알아보려면 무엇이 더 필요할까요?",
    "answer": "①",
    "explanation": "움직임은 같은 기준에서 시간에 따라 위치가 달라졌는지 살펴보아요. 한 시각의 위치만으로 움직였다고 정하지 않아요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "가로 눈금을 먼저, 세로 눈금을 나중에 읽으며 두 점 사이 거리는 계산하지 않아요.",
    "form": "choice",
    "choices": [
      "같은 눈금에서 다른 시각의 위치",
      "같은 그림을 더 크게 인쇄한 것",
      "같은 시각의 점 이름만 바꾼 것"
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "e3626fa0e5ad6faa"
  },
  "28": {
    "prompt": "케이블카의 빠르기가 일정한지 알아보려 해요. 같은 시간마다 이동한 (1)[ ]를 비교해요. 보기: 거리·시각",
    "answer": "거리",
    "explanation": "같은 시간 동안 간 거리를 비교해요. 출발할 때와 운행 중의 기록을 나누고 모든 때의 빠르기가 같다고 미리 정하지 않아요.",
    "required": [
      "빈칸의 수치·단위·낱말"
    ],
    "misconception": "물체 이름이나 사진 한 장으로 빠르기 변화를 단정하지 않아요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "거리",
            "이동 거리",
            "이동거리"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "2ac222095bccb8f3"
  },
  "31": {
    "prompt": "한 방향으로 가는 수레가 관찰한 동안 매 2초마다 4m씩 갔어요. 알맞은 설명을 고르세요.",
    "answer": "②",
    "explanation": "같은 시간 간격에 이동한 거리가 같으므로 관찰한 동안 빠르기가 일정했다고 말해요. 관찰하지 않은 시간까지 같다고 정하지 않아요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "물체 이름이나 사진 한 장으로 빠르기 변화를 단정하지 않아요.",
    "form": "choice",
    "choices": [
      "앞으로도 모든 때의 빠르기는 반드시 같다.",
      "관찰한 동안 같은 시간마다 같은 거리를 갔다.",
      "시간이 지날수록 간 거리가 매번 더 짧아졌다."
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "0e70af8962550e7b"
  },
  "44": {
    "prompt": "A는 앞부분, B는 뒷부분이 출발선을 지날 때 시계를 시작했어요. 다시 잴 방법을 고르세요.",
    "answer": "③",
    "explanation": "두 수레의 같은 부분이 출발선과 도착선을 지나는 때를 재요. 기준 부분을 맞추어야 같은 거리를 가는 데 걸린 시간을 비교할 수 있어요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "같은 거리에서 걸린 시간이 짧을수록 빨라요.",
    "form": "choice",
    "choices": [
      "A는 앞부분, B는 뒷부분을 계속 기준으로 잰다.",
      "출발선만 같으면 어느 부분이 지나는지 보지 않는다.",
      "두 수레 모두 앞부분처럼 같은 부분을 기준으로 잰다."
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "81d0cfb4a15ef3b6"
  },
  "47": {
    "prompt": "한 방향으로 가는 수레 가는 4m를 2초에, 나는 12m를 3초에 갔어요. 속력은 가 (1)[ ]m/s, 나 (2)[ ]m/s이고 더 빠른 것은 (3)[ ]예요.",
    "answer": "2 / 4 / 나",
    "explanation": "속력은 이동 거리를 걸린 시간으로 나누어요. 가는 4÷2=2m/s, 나는 12÷3=4m/s이므로 나가 더 빨라요.",
    "required": [
      "빈칸의 수치·단위·낱말"
    ],
    "misconception": "같은 거리에서 걸린 시간이 짧을수록 빨라요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "2",
            "2m/s",
            "2 m/s"
          ],
          "units": [
            "m/s"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "4",
            "4m/s",
            "4 m/s"
          ],
          "units": [
            "m/s"
          ]
        },
        {
          "label": "㉢",
          "accepted": [
            "나",
            "수레 나",
            "나 수레"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "bdb2c82ee2f69be0"
  },
  "60": {
    "prompt": "같은 직선 길에서 A는 0m, B는 2m에서 출발했어요. 되돌아오지 않고 같은 방향으로 3초 뒤 모두 5m에 왔어요. 이동 거리는 A (1)[ ]m, B (2)[ ]m이고 더 빠른 것은 (3)[ ]예요.",
    "answer": "5 / 3 / A",
    "explanation": "처음 위치에서 나중 위치까지 간 거리를 구해요. A는 5m, B는 3m를 갔으므로 같은 3초에는 A가 더 빨라요. 나중 위치가 같다고 이동 거리도 같은 것은 아니에요.",
    "required": [
      "빈칸의 수치·단위·낱말"
    ],
    "misconception": "같은 시간에 이동 거리가 길수록 빨라요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "5",
            "5m",
            "5 m"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "3",
            "3m",
            "3 m"
          ]
        },
        {
          "label": "㉢",
          "accepted": [
            "A",
            "에이",
            "수레 A"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "6f3c53f463021b4e"
  },
  "70": {
    "prompt": "한 방향으로 A는 10m를 5초에, B는 12m를 3초에 갔어요. 속력은 A (1)[ ]m/s, B (2)[ ]m/s이고 더 빠른 것은 (3)[ ]예요.",
    "answer": "2 / 4 / B",
    "explanation": "A는 10÷5=2m/s, B는 12÷3=4m/s예요. 같은 단위로 구한 속력이 더 큰 B가 더 빨라요.",
    "required": [
      "빈칸의 수치·단위·낱말"
    ],
    "misconception": "다른 거리와 시간은 같은 단위 시간의 거리로 비교해요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "2",
            "2m/s",
            "2 m/s"
          ],
          "units": [
            "m/s"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "4",
            "4m/s",
            "4 m/s"
          ],
          "units": [
            "m/s"
          ]
        },
        {
          "label": "㉢",
          "accepted": [
            "B",
            "비",
            "수레 B"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "bb17d6f1446dc63f"
  },
  "75": {
    "prompt": "속력의 단위 m/s는 무엇을 무엇으로 나누었다는 뜻일까요?",
    "answer": "②",
    "explanation": "m/s는 이동 거리의 단위 m를 시간의 단위 s로 나눈 것이에요. 이동 거리÷걸린 시간으로 속력을 구해요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "거리와 기준 시간의 단위를 함께 읽어요.",
    "form": "choice",
    "choices": [
      "걸린 시간(s)을 이동 거리(m)로 나눈다.",
      "이동 거리(m)를 걸린 시간(s)으로 나눈다.",
      "이동 거리(m)에 걸린 시간(s)을 곱한다."
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "4a86aa03acaa39e5"
  },
  "79": {
    "prompt": "한 방향으로 A는 9m를 3초에, B는 8m를 4초에 갔어요. 속력은 A (1)[ ]m/s, B (2)[ ]m/s이고 더 빠른 것은 (3)[ ]예요.",
    "answer": "3 / 2 / A",
    "explanation": "A는 9÷3=3m/s, B는 8÷4=2m/s예요. 이동 거리와 시간이 모두 다르므로 같은 단위의 속력으로 비교해요.",
    "required": [
      "빈칸의 수치·단위·낱말"
    ],
    "misconception": "다른 거리와 시간은 같은 단위 시간의 거리로 비교해요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "3",
            "3m/s",
            "3 m/s"
          ],
          "units": [
            "m/s"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "2",
            "2m/s",
            "2 m/s"
          ],
          "units": [
            "m/s"
          ]
        },
        {
          "label": "㉢",
          "accepted": [
            "A",
            "에이",
            "수레 A"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "7ec716834f1e1225"
  },
  "86": {
    "prompt": "실내에서 수레의 속력을 구하려고 해요. 이동 거리와 그 거리를 가는 데 걸린 (1)[ ]을 재어요. 보기: 시간·무게",
    "answer": "시간",
    "explanation": "같은 구간의 이동 거리와 그 구간을 가는 데 걸린 시간이 필요해요. 한 가지 값만으로 속력을 구하지 않아요.",
    "required": [
      "빈칸의 수치·단위·낱말"
    ],
    "misconception": "여러 번 잰 값을 비교해요. 눈금으로 구별하기 어려운 값은 정확히 알 수 없다고 적어요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "시간",
            "걸린 시간",
            "걸린시간"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "b0c94b1823e24d6e"
  },
  "91": {
    "prompt": "0.1초까지 읽는 초시계에 2.3초가 보였어요. 표시된 값을 단위와 함께 쓰세요.",
    "answer": "2.3초",
    "explanation": "초시계에 보인 2.3초를 그대로 적어요. 도구로 읽지 못한 자릿수를 덧붙이거나 원하는 값으로 바꾸지 않아요.",
    "required": [
      "질문에 맞는 짧은 답"
    ],
    "misconception": "여러 번 잰 값을 비교해요. 눈금으로 구별하기 어려운 값은 정확히 알 수 없다고 적어요.",
    "form": "short",
    "contract": {
      "kind": "short-text",
      "accepted": [
        "2.3초",
        "2.3 초",
        "2.3s",
        "2.3 s"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "56fe0aa0b96f9f92"
  },
  "92": {
    "prompt": "수레가 간 거리는 쟀지만 시간은 재지 못했어요. 속력을 구하려면 무엇을 더 재야 할까요?",
    "answer": "③",
    "explanation": "이동 거리를 잰 바로 그 구간에 걸린 시간을 재요. 다른 구간이나 멈춘 시간을 대신 넣지 않아요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "속력을 구하려면 같은 구간의 이동 거리와 걸린 시간이 모두 필요해요.",
    "form": "choice",
    "choices": [
      "수레가 멈춰 있는 동안의 시간",
      "다른 길을 가는 데 걸린 시간",
      "그 거리를 가는 데 걸린 시간"
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "28a21ebb6a7fce39"
  },
  "95": {
    "prompt": "두 수레가 같은 거리를 가는 데 각각 2초, 4초가 걸렸어요. 2초인 수레가 더 빠른 까닭을 고르세요.",
    "answer": "①",
    "explanation": "같은 이동 거리를 비교할 때에는 걸린 시간이 짧은 수레가 더 빨라요. 거리가 같은 조건을 함께 확인해요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "같은 거리를 이동한 경우 걸린 시간이 짧을수록 더 빨라요.",
    "form": "choice",
    "choices": [
      "같은 거리를 가는 데 시간이 더 짧게 걸렸다.",
      "걸린 시간이 짧으면 이동 거리도 언제나 같다.",
      "같은 거리를 갔으므로 두 수레의 빠르기도 같다."
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "f43ee59cd431f056"
  },
  "107": {
    "prompt": "다른 조건이 같을 때 자동차의 속력이 커지면 멈추기까지 필요한 거리가 더 (1)[ ] 수 있어요. 보기: 길어질·짧아질",
    "answer": "길어질",
    "explanation": "다른 조건이 같다면 속력이 큰 자동차는 멈추기까지 더 긴 거리가 필요할 수 있어요. 길을 건널 때 자동차가 바로 멈출 것이라고 생각하지 않아요.",
    "required": [
      "빈칸의 수치·단위·낱말"
    ],
    "misconception": "다른 조건이 같을 때의 관계를 말하며 정확한 정지 거리를 꾸며 내지 않아요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "길어질",
            "길어질 수 있다"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "c54f42deda037d7c"
  },
  "108": {
    "prompt": "초록 신호를 보고 길을 건너기 전, 자동차의 어떤 모습을 확인해야 할까요?",
    "answer": "②",
    "explanation": "초록 신호만 보고 자동차가 모두 멈췄다고 정하지 않아요. 건너기 전에 차량이 멈췄는지 확인해요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "신호와 함께 주변·차량 정지를 확인하는 안전 행동을 지켜요.",
    "form": "choice",
    "choices": [
      "자동차가 멀리 보이는지만 확인한다.",
      "자동차가 멈췄는지 확인한다.",
      "자동차의 색이 눈에 잘 띄는지 확인한다."
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "d2132980e9a84fb2"
  },
  "118": {
    "prompt": "안전 안내에서는 길을 건너기 전 차량이 멈췄는지 확인하라고 해요. 알맞게 생각한 것을 고르세요.",
    "answer": "③",
    "explanation": "움직이는 차가 즉시 멈출 수 있다고 생각하지 않아요. 실제 차량이 멈췄는지 확인하는 안전 행동과 연결해요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "실제 제작/전달·받은 질문/아직 받은 의견이 없음·수정/다음 계획을 구별해요.",
    "form": "choice",
    "choices": [
      "움직이는 차는 신호가 바뀌는 순간 반드시 멈춘다.",
      "멀리 보이는 차는 빠르기를 생각하지 않아도 된다.",
      "움직이는 차가 곧바로 멈출 것이라고 생각하지 않는다."
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "ef79fb39fefcff8f"
  },
  "123": {
    "prompt": "자동차가 멀리 보여도 빨리 뛰어 건너면 안 되는 까닭을 고르세요.",
    "answer": "①",
    "explanation": "눈에 보이는 거리만으로 판단하지 않아요. 빠른 자동차는 금방 가까워질 수 있으므로 뛰어 건너려 하지 않아요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "거리만 보고 판단하지 않고 자동차의 움직임과 정지를 확인해야 하는 까닭을 설명해요.",
    "form": "choice",
    "choices": [
      "빠른 자동차는 짧은 시간에 가까워질 수 있다.",
      "멀리 있는 자동차는 반드시 천천히 움직인다.",
      "내가 뛰면 자동차의 속력이 바로 줄어든다."
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "ab43546de0cc039b"
  },
  "124": {
    "prompt": "소개 자료의 자동차 정지 거리 숫자가 어디에서 나온 것인지 찾지 못했어요. 어떻게 고칠까요?",
    "answer": "③",
    "explanation": "어떤 조건에서 얻은 숫자인지 확인해요. 확인하지 못한 수치를 실제 조사 결과처럼 쓰지 않아요. 수레의 모형 값도 실제 자동차의 값으로 바꾸지 않아요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "실제 제작/전달·받은 질문/아직 받은 의견이 없음·수정/다음 계획을 구별해요.",
    "form": "choice",
    "choices": [
      "그럴듯한 숫자로 바꾸고 출처는 쓰지 않는다.",
      "다른 자동차의 숫자를 조건 없이 그대로 옮긴다.",
      "확인하지 못한 숫자를 빼고 근거를 찾는다."
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "e95f96c2b21cc8f8"
  },
  "127": {
    "prompt": "수레가 멈춘 거리를 여러 번 비교해요. 길의 미끄러운 정도를 같게 하려면 같은 무엇 위에서 재야 할까요? 짧게 쓰세요.",
    "answer": "바닥",
    "explanation": "같은 수레와 바닥, 멈추는 방법 등을 맞추어 살펴요. 바닥의 상태가 달라지면 멈춘 거리도 달라질 수 있어요. 선생님과 실내 수레 실험으로 확인해요.",
    "required": [
      "질문에 맞는 짧은 답"
    ],
    "misconception": "실제 제작/전달·받은 질문/아직 받은 의견이 없음·수정/다음 계획을 구별해요.",
    "form": "short",
    "contract": {
      "kind": "short-text",
      "accepted": [
        "바닥",
        "같은 바닥",
        "바닥의 상태",
        "노면"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "84baf6e37fa92ed9"
  }
};
const bankReview={
  "c22-s61-u02-b012": {
    "prompt": "점 P는 가로 3눈금, 세로 1눈금에 있어요. 가로부터 읽으면 ((1)[ ], (2)[ ])이에요.",
    "answer": "3 / 1",
    "explanation": "가로 눈금을 먼저, 세로 눈금을 나중에 읽어요. 두 수의 순서를 바꾸지 않아요.",
    "required": [
      "빈칸의 수치·단위·낱말"
    ],
    "misconception": "가로 눈금을 먼저, 세로 눈금을 나중에 읽으며 두 점 사이 거리는 계산하지 않아요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "3",
            "3눈금",
            "세"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "1",
            "1눈금",
            "한"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "e8663e3c3a3aaebe"
    ]
  },
  "c22-s61-u02-b022": {
    "prompt": "한 시각에 점 P가 (3, 2)에 있다는 그림만 있어요. 움직였는지 알아보려면 무엇이 더 필요할까요?",
    "answer": "①",
    "explanation": "움직임은 같은 기준에서 시간에 따라 위치가 달라졌는지 살펴보아요. 한 시각의 위치만으로 움직였다고 정하지 않아요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "가로 눈금을 먼저, 세로 눈금을 나중에 읽으며 두 점 사이 거리는 계산하지 않아요.",
    "form": "choice",
    "choices": [
      "같은 눈금에서 다른 시각의 위치",
      "같은 그림을 더 크게 인쇄한 것",
      "같은 시각의 점 이름만 바꾼 것"
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "3e06d12558198d47"
    ]
  },
  "c22-s61-u02-b028": {
    "prompt": "케이블카의 빠르기가 일정한지 알아보려 해요. 같은 시간마다 이동한 (1)[ ]를 비교해요. 보기: 거리·시각",
    "answer": "거리",
    "explanation": "같은 시간 동안 간 거리를 비교해요. 출발할 때와 운행 중의 기록을 나누고 모든 때의 빠르기가 같다고 미리 정하지 않아요.",
    "required": [
      "빈칸의 수치·단위·낱말"
    ],
    "misconception": "물체 이름이나 사진 한 장으로 빠르기 변화를 단정하지 않아요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "거리",
            "이동 거리",
            "이동거리"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "2baeac87ce38c82d"
    ]
  },
  "c22-s61-u02-b031": {
    "prompt": "한 방향으로 가는 수레가 관찰한 동안 매 2초마다 4m씩 갔어요. 알맞은 설명을 고르세요.",
    "answer": "②",
    "explanation": "같은 시간 간격에 이동한 거리가 같으므로 관찰한 동안 빠르기가 일정했다고 말해요. 관찰하지 않은 시간까지 같다고 정하지 않아요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "물체 이름이나 사진 한 장으로 빠르기 변화를 단정하지 않아요.",
    "form": "choice",
    "choices": [
      "앞으로도 모든 때의 빠르기는 반드시 같다.",
      "관찰한 동안 같은 시간마다 같은 거리를 갔다.",
      "시간이 지날수록 간 거리가 매번 더 짧아졌다."
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "0fff89e631a30618"
    ]
  },
  "c22-s61-u02-b044": {
    "prompt": "A는 앞부분, B는 뒷부분이 출발선을 지날 때 시계를 시작했어요. 다시 잴 방법을 고르세요.",
    "answer": "③",
    "explanation": "두 수레의 같은 부분이 출발선과 도착선을 지나는 때를 재요. 기준 부분을 맞추어야 같은 거리를 가는 데 걸린 시간을 비교할 수 있어요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "같은 거리에서 걸린 시간이 짧을수록 빨라요.",
    "form": "choice",
    "choices": [
      "A는 앞부분, B는 뒷부분을 계속 기준으로 잰다.",
      "출발선만 같으면 어느 부분이 지나는지 보지 않는다.",
      "두 수레 모두 앞부분처럼 같은 부분을 기준으로 잰다."
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "0b14eb6e71901174"
    ]
  },
  "c22-s61-u02-b047": {
    "prompt": "한 방향으로 가는 수레 가는 4m를 2초에, 나는 12m를 3초에 갔어요. 속력은 가 (1)[ ]m/s, 나 (2)[ ]m/s이고 더 빠른 것은 (3)[ ]예요.",
    "answer": "2 / 4 / 나",
    "explanation": "속력은 이동 거리를 걸린 시간으로 나누어요. 가는 4÷2=2m/s, 나는 12÷3=4m/s이므로 나가 더 빨라요.",
    "required": [
      "빈칸의 수치·단위·낱말"
    ],
    "misconception": "같은 거리에서 걸린 시간이 짧을수록 빨라요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "2",
            "2m/s",
            "2 m/s"
          ],
          "units": [
            "m/s"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "4",
            "4m/s",
            "4 m/s"
          ],
          "units": [
            "m/s"
          ]
        },
        {
          "label": "㉢",
          "accepted": [
            "나",
            "수레 나",
            "나 수레"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "f9fe8d70f3d876b6"
    ]
  },
  "c22-s61-u02-b060": {
    "prompt": "같은 직선 길에서 A는 0m, B는 2m에서 출발했어요. 되돌아오지 않고 같은 방향으로 3초 뒤 모두 5m에 왔어요. 이동 거리는 A (1)[ ]m, B (2)[ ]m이고 더 빠른 것은 (3)[ ]예요.",
    "answer": "5 / 3 / A",
    "explanation": "처음 위치에서 나중 위치까지 간 거리를 구해요. A는 5m, B는 3m를 갔으므로 같은 3초에는 A가 더 빨라요. 나중 위치가 같다고 이동 거리도 같은 것은 아니에요.",
    "required": [
      "빈칸의 수치·단위·낱말"
    ],
    "misconception": "같은 시간에 이동 거리가 길수록 빨라요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "5",
            "5m",
            "5 m"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "3",
            "3m",
            "3 m"
          ]
        },
        {
          "label": "㉢",
          "accepted": [
            "A",
            "에이",
            "수레 A"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "99dc59c9e19dda93"
    ]
  },
  "c22-s61-u02-b070": {
    "prompt": "한 방향으로 A는 10m를 5초에, B는 12m를 3초에 갔어요. 속력은 A (1)[ ]m/s, B (2)[ ]m/s이고 더 빠른 것은 (3)[ ]예요.",
    "answer": "2 / 4 / B",
    "explanation": "A는 10÷5=2m/s, B는 12÷3=4m/s예요. 같은 단위로 구한 속력이 더 큰 B가 더 빨라요.",
    "required": [
      "빈칸의 수치·단위·낱말"
    ],
    "misconception": "다른 거리와 시간은 같은 단위 시간의 거리로 비교해요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "2",
            "2m/s",
            "2 m/s"
          ],
          "units": [
            "m/s"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "4",
            "4m/s",
            "4 m/s"
          ],
          "units": [
            "m/s"
          ]
        },
        {
          "label": "㉢",
          "accepted": [
            "B",
            "비",
            "수레 B"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "c41fa67d808461e7"
    ]
  },
  "c22-s61-u02-b075": {
    "prompt": "속력의 단위 m/s는 무엇을 무엇으로 나누었다는 뜻일까요?",
    "answer": "②",
    "explanation": "m/s는 이동 거리의 단위 m를 시간의 단위 s로 나눈 것이에요. 이동 거리÷걸린 시간으로 속력을 구해요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "거리와 기준 시간의 단위를 함께 읽어요.",
    "form": "choice",
    "choices": [
      "걸린 시간(s)을 이동 거리(m)로 나눈다.",
      "이동 거리(m)를 걸린 시간(s)으로 나눈다.",
      "이동 거리(m)에 걸린 시간(s)을 곱한다."
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "f7ade4fe4c398520"
    ]
  },
  "c22-s61-u02-b079": {
    "prompt": "한 방향으로 A는 9m를 3초에, B는 8m를 4초에 갔어요. 속력은 A (1)[ ]m/s, B (2)[ ]m/s이고 더 빠른 것은 (3)[ ]예요.",
    "answer": "3 / 2 / A",
    "explanation": "A는 9÷3=3m/s, B는 8÷4=2m/s예요. 이동 거리와 시간이 모두 다르므로 같은 단위의 속력으로 비교해요.",
    "required": [
      "빈칸의 수치·단위·낱말"
    ],
    "misconception": "다른 거리와 시간은 같은 단위 시간의 거리로 비교해요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "3",
            "3m/s",
            "3 m/s"
          ],
          "units": [
            "m/s"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "2",
            "2m/s",
            "2 m/s"
          ],
          "units": [
            "m/s"
          ]
        },
        {
          "label": "㉢",
          "accepted": [
            "A",
            "에이",
            "수레 A"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "0e58dd8c00ae62ca"
    ]
  },
  "c22-s61-u02-b086": {
    "prompt": "실내에서 수레의 속력을 구하려고 해요. 이동 거리와 그 거리를 가는 데 걸린 (1)[ ]을 재어요. 보기: 시간·무게",
    "answer": "시간",
    "explanation": "같은 구간의 이동 거리와 그 구간을 가는 데 걸린 시간이 필요해요. 한 가지 값만으로 속력을 구하지 않아요.",
    "required": [
      "빈칸의 수치·단위·낱말"
    ],
    "misconception": "여러 번 잰 값을 비교해요. 눈금으로 구별하기 어려운 값은 정확히 알 수 없다고 적어요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "시간",
            "걸린 시간",
            "걸린시간"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "708054120ce5f5ac"
    ]
  },
  "c22-s61-u02-b091": {
    "prompt": "0.1초까지 읽는 초시계에 2.3초가 보였어요. 표시된 값을 단위와 함께 쓰세요.",
    "answer": "2.3초",
    "explanation": "초시계에 보인 2.3초를 그대로 적어요. 도구로 읽지 못한 자릿수를 덧붙이거나 원하는 값으로 바꾸지 않아요.",
    "required": [
      "질문에 맞는 짧은 답"
    ],
    "misconception": "여러 번 잰 값을 비교해요. 눈금으로 구별하기 어려운 값은 정확히 알 수 없다고 적어요.",
    "form": "short",
    "contract": {
      "kind": "short-text",
      "accepted": [
        "2.3초",
        "2.3 초",
        "2.3s",
        "2.3 s"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "3763cb2976bc0cc3"
    ]
  },
  "c22-s61-u02-b092": {
    "prompt": "수레가 간 거리는 쟀지만 시간은 재지 못했어요. 속력을 구하려면 무엇을 더 재야 할까요?",
    "answer": "③",
    "explanation": "이동 거리를 잰 바로 그 구간에 걸린 시간을 재요. 다른 구간이나 멈춘 시간을 대신 넣지 않아요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "속력을 구하려면 같은 구간의 이동 거리와 걸린 시간이 모두 필요해요.",
    "form": "choice",
    "choices": [
      "수레가 멈춰 있는 동안의 시간",
      "다른 길을 가는 데 걸린 시간",
      "그 거리를 가는 데 걸린 시간"
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "7838a76dfcd3d32f"
    ]
  },
  "c22-s61-u02-b095": {
    "prompt": "두 수레가 같은 거리를 가는 데 각각 2초, 4초가 걸렸어요. 2초인 수레가 더 빠른 까닭을 고르세요.",
    "answer": "①",
    "explanation": "같은 이동 거리를 비교할 때에는 걸린 시간이 짧은 수레가 더 빨라요. 거리가 같은 조건을 함께 확인해요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "같은 거리를 이동한 경우 걸린 시간이 짧을수록 더 빨라요.",
    "form": "choice",
    "choices": [
      "같은 거리를 가는 데 시간이 더 짧게 걸렸다.",
      "걸린 시간이 짧으면 이동 거리도 언제나 같다.",
      "같은 거리를 갔으므로 두 수레의 빠르기도 같다."
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "b9b6af8a2f8a3670"
    ]
  },
  "c22-s61-u02-b107": {
    "prompt": "다른 조건이 같을 때 자동차의 속력이 커지면 멈추기까지 필요한 거리가 더 (1)[ ] 수 있어요. 보기: 길어질·짧아질",
    "answer": "길어질",
    "explanation": "다른 조건이 같다면 속력이 큰 자동차는 멈추기까지 더 긴 거리가 필요할 수 있어요. 길을 건널 때 자동차가 바로 멈출 것이라고 생각하지 않아요.",
    "required": [
      "빈칸의 수치·단위·낱말"
    ],
    "misconception": "다른 조건이 같을 때의 관계를 말하며 정확한 정지 거리를 꾸며 내지 않아요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "길어질",
            "길어질 수 있다"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "f7a6322d43a2b253"
    ]
  },
  "c22-s61-u02-b108": {
    "prompt": "초록 신호를 보고 길을 건너기 전, 자동차의 어떤 모습을 확인해야 할까요?",
    "answer": "②",
    "explanation": "초록 신호만 보고 자동차가 모두 멈췄다고 정하지 않아요. 건너기 전에 차량이 멈췄는지 확인해요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "신호와 함께 주변·차량 정지를 확인하는 안전 행동을 지켜요.",
    "form": "choice",
    "choices": [
      "자동차가 멀리 보이는지만 확인한다.",
      "자동차가 멈췄는지 확인한다.",
      "자동차의 색이 눈에 잘 띄는지 확인한다."
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "2e3b7ce6481588dc"
    ]
  },
  "c22-s61-u02-b118": {
    "prompt": "안전 안내에서는 길을 건너기 전 차량이 멈췄는지 확인하라고 해요. 알맞게 생각한 것을 고르세요.",
    "answer": "③",
    "explanation": "움직이는 차가 즉시 멈출 수 있다고 생각하지 않아요. 실제 차량이 멈췄는지 확인하는 안전 행동과 연결해요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "실제 제작/전달·받은 질문/아직 받은 의견이 없음·수정/다음 계획을 구별해요.",
    "form": "choice",
    "choices": [
      "움직이는 차는 신호가 바뀌는 순간 반드시 멈춘다.",
      "멀리 보이는 차는 빠르기를 생각하지 않아도 된다.",
      "움직이는 차가 곧바로 멈출 것이라고 생각하지 않는다."
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "60ad1ad28ac04f28"
    ]
  },
  "c22-s61-u02-b123": {
    "prompt": "자동차가 멀리 보여도 빨리 뛰어 건너면 안 되는 까닭을 고르세요.",
    "answer": "①",
    "explanation": "눈에 보이는 거리만으로 판단하지 않아요. 빠른 자동차는 금방 가까워질 수 있으므로 뛰어 건너려 하지 않아요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "거리만 보고 판단하지 않고 자동차의 움직임과 정지를 확인해야 하는 까닭을 설명해요.",
    "form": "choice",
    "choices": [
      "빠른 자동차는 짧은 시간에 가까워질 수 있다.",
      "멀리 있는 자동차는 반드시 천천히 움직인다.",
      "내가 뛰면 자동차의 속력이 바로 줄어든다."
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "22e0cb4cf2f32236"
    ]
  },
  "c22-s61-u02-b124": {
    "prompt": "소개 자료의 자동차 정지 거리 숫자가 어디에서 나온 것인지 찾지 못했어요. 어떻게 고칠까요?",
    "answer": "③",
    "explanation": "어떤 조건에서 얻은 숫자인지 확인해요. 확인하지 못한 수치를 실제 조사 결과처럼 쓰지 않아요. 수레의 모형 값도 실제 자동차의 값으로 바꾸지 않아요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "실제 제작/전달·받은 질문/아직 받은 의견이 없음·수정/다음 계획을 구별해요.",
    "form": "choice",
    "choices": [
      "그럴듯한 숫자로 바꾸고 출처는 쓰지 않는다.",
      "다른 자동차의 숫자를 조건 없이 그대로 옮긴다.",
      "확인하지 못한 숫자를 빼고 근거를 찾는다."
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "e9d8f53dac099487"
    ]
  },
  "c22-s61-u02-b127": {
    "prompt": "수레가 멈춘 거리를 여러 번 비교해요. 길의 미끄러운 정도를 같게 하려면 같은 무엇 위에서 재야 할까요? 짧게 쓰세요.",
    "answer": "바닥",
    "explanation": "같은 수레와 바닥, 멈추는 방법 등을 맞추어 살펴요. 바닥의 상태가 달라지면 멈춘 거리도 달라질 수 있어요. 선생님과 실내 수레 실험으로 확인해요.",
    "required": [
      "질문에 맞는 짧은 답"
    ],
    "misconception": "실제 제작/전달·받은 질문/아직 받은 의견이 없음·수정/다음 계획을 구별해요.",
    "form": "short",
    "contract": {
      "kind": "short-text",
      "accepted": [
        "바닥",
        "같은 바닥",
        "바닥의 상태",
        "노면"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "d3bbe830723ad1d6"
    ]
  }
};
const questionTitles={
  "12": "가로와 세로 순서로 읽어요",
  "22": "다른 시각의 위치 알아보기",
  "28": "같은 시간마다 간 거리",
  "31": "관찰한 동안의 빠르기",
  "44": "같은 부분을 기준으로 재요",
  "47": "거리와 시간으로 속력 구하기",
  "60": "처음 위치에서 간 거리 구하기",
  "70": "같은 단위로 속력 비교하기",
  "75": "m/s의 뜻 알아보기",
  "79": "두 속력 비교하기",
  "86": "거리와 함께 재는 것",
  "91": "초시계에 보인 값 읽기",
  "92": "같은 구간의 시간 재기",
  "95": "같은 거리에서 빠르기 비교",
  "107": "빠르기와 멈추는 거리",
  "108": "건너기 전 차량 확인",
  "118": "움직이는 차는 바로 멈출까요",
  "123": "거리와 빠르기를 함께 살펴요",
  "124": "확인하지 못한 숫자 고치기",
  "127": "같은 바닥에서 비교하기"
};
const studyMethodBefore="관찰과 예제로 개념을 익히고, 객관식·빈칸·단답·복수 선택·연결·순서·서술·그림 문제로 연습해요.";
const clone=x=>JSON.parse(JSON.stringify(x));
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const banks=new WeakMap(),books=new WeakMap(),labels={choice:'객관식',blank:'빈칸 넣기',short:'단답형',written:'까닭 설명',draw:'그림 설명'};
const response=e=>e.contract?clone(e.contract):{kind:Object.hasOwn(e,'drawingExplanationLines')?'drawing':'written-explanation',teacherRequired:true,actualPerformanceMustNotBeInferred:true,sample:e.answer,required:[...e.required]};
function answerContract(e){const c=response(e);return{type:e.form==='choice'?'single-choice':e.contract?'short-text':'written-explanation',...(e.form==='choice'?{answer:e.key,accepted:[e.key]}:e.contract?{answer:e.answer,accepted:c.accepted||[e.answer],inputHint:c.parts?'빈칸의 답을 쉼표로 나누어 차례대로 써요.':'짧은 낱말로 답해요.'}:{sample:e.answer,teacherRequired:true,reviewRequired:true,rubric:{required:[...e.required],pass:'뜻이 같은 짧은 답과 알맞은 이름표는 교사가 확인해요.'}}),seasonContract:c};}
export function motionMixedItems(rows,u){
 if(u!==unit||!rows?.length)return rows;let changed=false;
 const next=rows.map(q=>{const e=bankReview[q.id];if(!e||q.status!=='authored'||q.sourceRef?.type!=='authored-supplement'||!e.before.includes(fingerprint(q)))return q;changed=true;if(banks.has(q))return banks.get(q);
 const result={...q,prompt:e.prompt,explanation:e.explanation,misconception:e.misconception,responseContract:response(e),answerContract:answerContract(e),...(q.diagnosticOverride?{diagnosticOverride:{...q.diagnosticOverride,version:MOTION_MIXED_VERSION}}:{}),...(e.form?{bookResponseForm:e.form,taxonomy:{...q.taxonomy,format:labels[e.form]},choices:e.choices?clone(e.choices):null,diagnosticOverride:{version:MOTION_MIXED_VERSION,distractors:null,typed:null,cloze:null,cells:null}}:{}),motionMixedResponse:MOTION_MIXED_VERSION,contentVersion:MOTION_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};banks.set(q,result);return result;});return changed?next:rows;
}
export function withMotionMixedClassroom(u,mod){if(u!==unit)return mod;const classroomItems=motionMixedItems(mod?.classroomItems,u);return classroomItems===mod.classroomItems?mod:{...mod,classroomItems};}
export function withMotionMixedWorkbook(w){
 if(w?.unit!==unit||fingerprint(w)!==prior)return w;if(books.has(w))return books.get(w);
 const questions=w.questions.map(q=>{const e=review[q.no];if(!e||fingerprint(q)!==e.before)return q;const result={...q,prompt:e.prompt,answer:e.answer,explanation:e.explanation,misconception:e.misconception,requirements:[...e.required],criteria:e.required.join(' / '),responseContract:response(e),motionMixedResponse:MOTION_MIXED_VERSION,contentVersion:MOTION_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};for(const k of['form','choices','key','lines'])if(Object.hasOwn(e,k))result[k]=clone(e[k]);if(e.form){result.bookResponseForm=e.form;result.formLabel=labels[e.form];delete result.lines;}return result;});
 const revisePage=p=>{const first=p.blocks.flatMap(b=>b.ids||[])[0],n=Number(first?.slice(-3));return{...p,title:questionTitles[n]||p.title,blocks:p.blocks.map(b=>b.type==='text'&&b.text===studyMethodBefore?{...b,text:'관찰과 예제로 개념을 익혀요. 고르기·빈칸·짧은 답으로 확인하고, 계산에는 수치와 단위를 써요. 비교한 까닭은 짧게 설명하고 실제 측정값은 표에 남겨요.'}:b)};};
 const pages=w.pages.map(revisePage),teacherStudentPages=w.teacherStudentPages.map(revisePage),teacherPages=w.teacherPages;
 const figures={...w.figures},byNo=new Map(questions.map(q=>[q.no,q]));for(const key of w.quickPages.flatMap(p=>p.blocks.filter(b=>b.type==='diagram').map(b=>b.key)))figures[key]=figures[key].replace(/(<tr><th scope="row">)(\d+)(<\/th><td>)([\s\S]*?)(<\/td><td>)([\s\S]*?)(<\/td><\/tr>)/g,(row,a,n,b,form,c,answer,d)=>{const q=byNo.get(Number(n));return review[n]||q.form==='choice'?a+n+b+(review[n]?labels[q.form]:form)+c+(q.form==='choice'?(Array.isArray(q.key)?q.key.map(i=>'①②③④⑤'[i]).join(', '):'①②③④⑤'[q.key]):q.answer)+d:row;});
 const result={...w,questions,pages,teacherStudentPages,teacherPages,figures};books.set(w,result);return result;
}
