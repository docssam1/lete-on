// Short responses keep actual sky observations, safe indirect solar comparisons and model investigations.
export const EARTH_MOTION_GUIDED_VERSION='20261124-earth-motion-mixed-responses';
const unit='c22-s61-u04',prior='340c411dcb3ad317';
const review={
  "12": {
    "before": "584c2ef6a8f4317c",
    "prompt": "표에서 친구가 같은 조건으로 화면을 다시 열기 쉬운 기록을 고르세요.",
    "answer": "② 나",
    "required": [
      "관찰 설정이 적힌 나 기록 선택"
    ],
    "explanation": "나는 장소와 날짜, 시각과 방향, 확대율이 적혀 있어 같은 화면을 다시 열기 쉬워요. 가의 오른쪽이라는 말만으로는 어느 쪽을 바라보았는지도 알 수 없어요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "choice",
    "choices": [
      "가",
      "나",
      "가와 나 모두 필요한 조건이 없다."
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "14": {
    "before": "597a18449cd06632",
    "prompt": "프로그램에서 별 이름표를 켰어요. 이 화면으로 확인한 것은 무엇인가요?",
    "answer": "③ 프로그램에서 이름을 찾은 별",
    "required": [
      "프로그램의 이름표와 실제 야외 관찰 구별"
    ],
    "explanation": "이름표는 프로그램에서 별을 찾도록 돕는 표시예요. 실제 집 앞에서 맨눈으로 보이는지는 날씨와 별의 밝기, 건물과 주변 조명도 살펴야 해요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "choice",
    "choices": [
      "지금 집 앞에서 모두 맨눈으로 보이는 별",
      "날씨와 관계없이 야외에서 보이는 별",
      "프로그램에서 이름을 찾은 별"
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "28": {
    "before": "684fd416eff5e1e4",
    "prompt": "22시에는 구름 때문에 별무리의 위치를 보지 못했어요. 알맞은 기록을 고르세요.",
    "answer": "① 구름 때문에 위치를 보지 못했다.",
    "required": [
      "보지 못한 실제 상태를 기록"
    ],
    "explanation": "22시에는 구름 때문에 위치를 보지 못했다고 적어요. 별이 없어졌다는 뜻은 아니에요. 나중에 다시 직접 보거나 프로그램을 별도 자료로 살펴볼 수 있어요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "choice",
    "choices": [
      "구름 때문에 위치를 보지 못했다.",
      "21시와 같은 위치를 직접 보았다.",
      "예상한 위치를 실제로 관찰했다."
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "30": {
    "before": "01baed9c0be11212",
    "prompt": "우리나라에서 시계가 낮 12시일 때 태양의 위치에 대한 설명으로 알맞은 것을 고르세요.",
    "answer": "② 날짜와 장소에 따라 위치가 달라 머리 바로 위라고 할 수 없다.",
    "required": [
      "시계 시각과 태양의 실제 위치 구별"
    ],
    "explanation": "한국에서 태양이 언제나 머리 바로 위에 오는 것은 아니에요. 낮 12시와 태양이 정확히 남쪽에 오는 때도 항상 같다고 정하지 말고 날짜와 장소, 시각을 확인해요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "choice",
    "choices": [
      "어느 지역에서나 머리 바로 위에 있다.",
      "날짜와 장소에 따라 위치가 달라 머리 바로 위라고 할 수 없다.",
      "항상 정확히 남쪽에 있으므로 날짜를 확인할 필요가 없다."
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "60": {
    "before": "24d99f977a6e4699",
    "prompt": "모형 전등의 반대쪽까지 밝게 보였어요. 더 확인할 것을 고르세요.",
    "answer": "③ 천장등이나 반사된 빛이 비추는지",
    "required": [
      "주변 조명과 모형 광원의 직접 빛 구별"
    ],
    "explanation": "천장등이나 반사된 빛이 반대쪽 면까지 비추었을 수 있어요. 밝게 보였다는 결과는 남겨 두고, 모형 전등이 직접 비춘 빛인지 주변 빛인지 다시 확인해요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "choice",
    "choices": [
      "관찰한 기록을 지울지",
      "지구의 자전이 멈췄는지",
      "천장등이나 반사된 빛이 비추는지"
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "61": {
    "before": "bb6cf41961cabf87",
    "prompt": "전등과 지구의만 있는 모형에서도 밤에 해당하는 쪽이 생겼어요. 알맞은 설명을 고르세요.",
    "answer": "① 달이 태양을 가리지 않아도 지구의 반대쪽은 직접 빛을 받지 않는다.",
    "required": [
      "달의 가림과 매일 생기는 밤 구별"
    ],
    "explanation": "달 모형이 없어도 지구의 반대쪽은 태양빛을 직접 받지 않아요. 지구가 자전해 같은 지역이 그쪽으로 돌아가면 밤이 돼요. 매일의 밤을 달이 태양을 가려서 생긴다고 설명하지 않아요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "choice",
    "choices": [
      "달이 태양을 가리지 않아도 지구의 반대쪽은 직접 빛을 받지 않는다.",
      "달 모형이 없으면 낮과 밤을 나타낼 수 없다.",
      "전등이 꺼져야만 밤에 해당하는 쪽이 생긴다."
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "92": {
    "before": "b66f586128d92953",
    "prompt": "표의 모형실험에서 실제로 바꾼 것을 고르세요.",
    "answer": "② 태양 둘레에 놓은 지구의의 위치",
    "required": [
      "고정한 별 카드와 옮긴 지구의 위치 구별"
    ],
    "explanation": "실제로 고정한 것은 태양과 별 카드이고, 옮긴 것은 지구예요. 지구의 위치가 달라져 한밤에 바라보는 방향이 바뀌었다는 나의 설명이 맞아요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "choice",
    "choices": [
      "별 카드가 지구 둘레를 도는 위치",
      "태양 둘레에 놓은 지구의의 위치",
      "전등이 교실에서 놓인 위치"
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "107": {
    "before": "1a223102f5f9055c",
    "prompt": "프로그램 설정표에서 계절 차이를 비교할 두 행을 고르세요.",
    "answer": "③ A와 C",
    "required": [
      "같은 장소와 시각에서 날짜가 다른 A와 C 선택"
    ],
    "explanation": "A와 C는 같은 밤 9시이고 날짜만 달라 계절 비교에 써요. A와 B는 같은 날 밤 9시와 10시이므로 하루 변화 비교에 써요. 실제로 별이 어디에 보였는지는 화면에서 더 살펴야 해요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "choice",
    "choices": [
      "A와 B",
      "B와 C",
      "A와 C"
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "110": {
    "before": "a341b23aa68928d0",
    "prompt": "여름 화면에서 달이 밝고 별 점이 더 적게 보였어요. 알맞은 설명을 고르세요.",
    "answer": "① 달빛이나 화면 설정 때문에 보이는 별의 수가 달라질 수 있다.",
    "required": [
      "화면 밝기 조건과 별의 위치 변화를 구별"
    ],
    "explanation": "달의 밝기와 화면 표시, 확대율에 따라 찾기 쉬운 별의 수가 달라질 수 있어요. 별 점의 개수만으로 지구가 공전을 멈췄다고 할 수는 없어요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "choice",
    "choices": [
      "달빛이나 화면 설정 때문에 보이는 별의 수가 달라질 수 있다.",
      "별 점이 적으므로 지구가 공전을 멈춘 것이다.",
      "화면의 별 점 수만으로 계절 차이를 설명할 수 있다."
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "125": {
    "before": "554b467b4ba55885",
    "prompt": "서로 다른 계절의 화면에 같은 별자리가 있어요. 알맞은 설명을 고르세요.",
    "answer": "② 일부 별자리는 겹쳐 보일 수 있으므로 위치도 비교한다.",
    "required": [
      "일부 겹침과 계절별 밤하늘 차이 구별"
    ],
    "explanation": "같은 별자리를 두 화면에서 찾았다는 기록은 남겨요. 하지만 일부가 겹쳐 보인다는 이유만으로 계절별 밤하늘 차이나 공전 설명이 모두 틀렸다고 할 수는 없어요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "choice",
    "choices": [
      "같은 별자리가 있으면 시각을 확인할 필요가 없다.",
      "일부 별자리는 겹쳐 보일 수 있으므로 위치도 비교한다.",
      "계절마다 보이는 모든 별자리가 서로 달라야 한다."
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "27": {
    "before": "3ef351a8ef9f340a",
    "prompt": "남쪽을 바라볼 때, 표의 별무리는 [ ]쪽에서 [ ]쪽으로 옮겨 보여요.",
    "answer": "동, 서",
    "required": [
      "같은 밤의 동쪽에서 서쪽으로 보이는 이동"
    ],
    "explanation": "남쪽을 바라볼 때 왼쪽인 동쪽에서 오른쪽인 서쪽으로 위치가 달라졌어요. 세 기록 모두 P와 주변 세 별이므로 같은 별무리를 따라본 것이며, 별이 놓인 모양이 바뀌었다는 뜻은 아니에요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "accepted": [
            "동",
            "동쪽"
          ]
        },
        {
          "accepted": [
            "서",
            "서쪽"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "45": {
    "before": "40fa4f5dc7a10323",
    "prompt": "지구는 [ ]에서 [ ]으로 자전해요. 태양이 하루 동안 움직여 보이는 방향과 구별해요.",
    "answer": "서쪽, 동쪽",
    "required": [
      "실제 지구 자전 방향"
    ],
    "explanation": "지구가 도는 방향과 태양이 움직여 보이는 방향은 반대예요. 지구는 서쪽에서 동쪽으로 자전하고, 지구 위 사람에게 태양은 동쪽에서 서쪽으로 움직이는 것처럼 보여요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "accepted": [
            "서쪽",
            "서"
          ]
        },
        {
          "accepted": [
            "동쪽",
            "동"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "46": {
    "before": "94c8d4c9b02cab83",
    "prompt": "북극 위에서 지구 중심을 내려다보면 지구는 [ ] 방향으로 자전해요.",
    "answer": "반시계",
    "required": [
      "북극 위 관점의 반시계 방향"
    ],
    "explanation": "먼저 어디에서 바라보았는지 물어요. 북극 위에서 내려다보면 지구는 반시계 방향으로 자전해요. 어떤 위치에서 무엇을 중심으로 도는지도 함께 설명해요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "blank",
    "contract": {
      "kind": "short-text",
      "accepted": [
        "반시계",
        "반시계 방향"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "75": {
    "before": "0affb539c77f6cff",
    "prompt": "표의 A는 축을 중심으로 도는 [ ], B는 태양 둘레로 움직이는 [ ]이에요.",
    "answer": "자전, 공전",
    "required": [
      "모형의 회전 중심과 자전·공전 대응"
    ],
    "explanation": "A는 지구의 중심을 제자리에 두고 축을 중심으로 돌렸으므로 자전이며 하루에 해당해요. B는 지구의 중심을 태양 둘레로 옮겼으므로 공전이며 일 년에 해당해요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "accepted": [
            "자전"
          ]
        },
        {
          "accepted": [
            "공전"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "77": {
    "before": "444f8891a3694d0f",
    "prompt": "지구는 자전축을 중심으로 [ ]에 한 바퀴 자전하고, 태양 둘레를 [ ]에 한 바퀴 공전해요.",
    "answer": "하루, 일 년",
    "required": [
      "자전과 공전의 한 바퀴 기간"
    ],
    "explanation": "자전은 자전축을 중심으로 하루에 한 바퀴 도는 운동이에요. 공전은 태양 둘레를 일 년에 한 바퀴 도는 운동이에요. 도는 중심과 걸리는 시간을 함께 고쳐야 해요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "accepted": [
            "하루",
            "약 하루",
            "1일"
          ]
        },
        {
          "accepted": [
            "일 년",
            "1년",
            "약 일 년",
            "약 1년"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "78": {
    "before": "3c6c1c8f88f60481",
    "prompt": "같은 날 한 시간 동안 별의 위치 변화는 지구의 [ ], 서로 다른 계절의 같은 시각 밤하늘 차이는 지구의 [ ]과 연결해요.",
    "answer": "자전, 공전",
    "required": [
      "하루 변화와 계절별 차이를 지구 운동과 연결"
    ],
    "explanation": "같은 날 한 시간 뒤의 변화는 지구와 함께 도는 사람에게 보이는 자전의 영향으로 설명해요. 서로 다른 계절의 같은 시각에는 공전으로 밤에 보는 방향이 달라진 것을 설명해요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "accepted": [
            "자전"
          ]
        },
        {
          "accepted": [
            "공전"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "62": {
    "before": "9490dbe6047849c0",
    "prompt": "처음에는 낮이던 A 지역이 태양빛을 직접 받지 않는 쪽으로 돌아갔어요. 이와 관련된 지구의 운동 이름을 쓰세요.",
    "answer": "자전",
    "required": [
      "같은 지역의 낮과 밤 변화와 자전 연결"
    ],
    "explanation": "처음 A와 B는 태양을 향한 쪽이 달라 낮과 밤이 달랐어요. 시간이 지나 지구가 자전하면 A도 빛을 직접 받지 않는 쪽으로 돌아가 밤이 돼요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "short",
    "contract": {
      "kind": "short-text",
      "accepted": [
        "자전",
        "지구의 자전"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "91": {
    "before": "d34882ecacd35eba",
    "prompt": "표에서 태양 왼쪽의 지구와 오른쪽의 지구가 한밤중에 정면으로 보는 카드를 차례로 쓰세요.",
    "answer": "P, Q",
    "required": [
      "태양 반대쪽 정면 카드 P와 Q 구별"
    ],
    "explanation": "지구가 태양 왼쪽이면 왼쪽 바깥의 P, 오른쪽이면 오른쪽 바깥의 Q를 보아요. 각 지구에서 태양이 어느 쪽인지 찾은 뒤 그 반대쪽을 읽어요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "short",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "accepted": [
            "P",
            "p"
          ]
        },
        {
          "accepted": [
            "Q",
            "q"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "94": {
    "before": "92b3476139aee84f",
    "prompt": "한밤중에 정면으로 보는 쪽은 태양을 향한 쪽과 그 반대쪽 중 어디인가요? 짧게 쓰세요.",
    "answer": "태양 반대쪽",
    "required": [
      "태양 반대쪽의 한밤 방향"
    ],
    "explanation": "한밤에 바라보는 사람은 태양 반대쪽을 향해요. 태양 쪽 카드는 반대 방향이므로 한밤에 정면으로 보는 카드가 아니에요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "short",
    "contract": {
      "kind": "short-text",
      "accepted": [
        "태양 반대쪽",
        "반대쪽",
        "태양의 반대쪽"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "123": {
    "before": "e3cf7b28bc9e1992",
    "prompt": "표의 가 기록은 같은 날 한 시간 동안의 별 위치 변화예요. 지구의 어떤 운동과 연결할까요?",
    "answer": "자전",
    "required": [
      "같은 날 시각 차이와 자전 연결"
    ],
    "explanation": "가는 같은 날 시각을 바꾸었으므로 하루의 자전과 연결해요. 나는 같은 밤 9시에 서로 다른 계절을 비교했으므로 공전과 연결해요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "short",
    "contract": {
      "kind": "short-text",
      "accepted": [
        "자전",
        "지구의 자전"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "11": {
    "before": "4d776ee417b69e1e",
    "prompt": "A와 B는 장소와 시각이 달라요. 계절 차이를 다시 비교할 때 같게 해야 할 조건 하나를 쓰세요.",
    "answer": "같은 시각에 관찰해요.",
    "required": [
      "장소·시각·방향·확대율 중 타당한 같은 비교 조건 하나"
    ],
    "explanation": "A는 서울 밤 9시, B는 부산 밤 11시이므로 장소와 시각이 모두 달라요. 같은 장소와 시각, 방향과 확대율로 맞추고 날짜만 다르게 해야 계절을 비교하기 좋아요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "lines": 1
  },
  "13": {
    "before": "9d21902216d6ec34",
    "prompt": "남쪽을 본 친구와 북쪽을 본 친구가 모두 “왼쪽 별”이라고 말했어요. 서로 다른 방위를 가리킬 수 있는 까닭을 짧게 쓰세요.",
    "answer": "바라보는 방향이 다르기 때문이에요.",
    "required": [
      "관측자가 바라보는 방향과 왼쪽 방위의 관계"
    ],
    "explanation": "남쪽을 볼 때 왼쪽은 동쪽이지만 북쪽을 볼 때 왼쪽은 서쪽이에요. 두 사람이 왼쪽이라고 말했어도 같은 방향을 가리킨 것은 아닐 수 있어요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "lines": 1
  },
  "29": {
    "before": "6b6460f5d85f0fd3",
    "prompt": "같은 밤에 별무리가 동쪽에서 서쪽으로 옮겨 보이는 까닭을 지구의 운동과 연결해 짧게 쓰세요.",
    "answer": "지구가 서쪽에서 동쪽으로 자전하기 때문이에요.",
    "required": [
      "겉보기 하루 변화와 실제 지구 자전 연결"
    ],
    "explanation": "직접 본 것은 같은 별무리가 서쪽으로 옮겨 보였다는 사실이에요. 이 하루 변화는 지구의 자전으로 설명해요. 별들이 실제로 지구 둘레를 돈 것을 직접 잰 것은 아니에요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "lines": 1
  },
  "43": {
    "before": "194cb0042c519b36",
    "prompt": "전등은 같은 자리에 있는데 지구 위 사람에게 보이는 방향은 달라졌어요. 까닭을 짧게 쓰세요.",
    "answer": "사람이 지구와 함께 돌기 때문이에요.",
    "required": [
      "고정한 전등과 회전하는 관측자의 시선 구별"
    ],
    "explanation": "밖에서 본 전등은 고정되어 있어요. 지구 위 사람은 지구와 함께 돌기 때문에 전등이 보이는 방향이 달라져요. 전등을 옮기지 않아도 두 설명이 함께 맞을 수 있어요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "lines": 1
  },
  "44": {
    "before": "ec16cbb3e3c99d3d",
    "prompt": "표의 가 모둠은 전등을 고정하고 지구의만 돌렸어요. 전등을 고정해야 하는 까닭을 짧게 쓰세요.",
    "answer": "전등을 옮기는 영향이 함께 섞이지 않도록 해요.",
    "required": [
      "지구의 회전의 영향을 비교하기 위한 고정 광원"
    ],
    "explanation": "가는 전등을 고정하고 지구의만 돌렸어요. 나는 전등까지 옮겼으므로, 보이는 방향이 지구의 회전 때문인지 전등 이동 때문인지 나누어 알기 어려워요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "lines": 1
  },
  "59": {
    "before": "ed9512b049e8db36",
    "prompt": "자전한 뒤 같은 지역에 밤이 되었어요. 그 지역이 빛을 받는 모습은 어떻게 달라졌나요?",
    "answer": "태양 반대쪽을 향해 태양빛을 직접 받지 않아요.",
    "required": [
      "같은 지역의 자전과 직접 빛을 받지 않는 밤 연결"
    ],
    "explanation": "같은 지역 표시가 자전으로 전등 반대쪽을 향해 직접 빛을 받지 않게 되었어요. 전등의 위치와 축의 기울기는 그대로이며 표시도 떼어 옮기지 않았어요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "lines": 1
  },
  "76": {
    "before": "00835469113d4cff",
    "prompt": "서로 다른 계절을 비교할 때 관찰 시각을 같게 해야 하는 까닭을 짧게 쓰세요.",
    "answer": "하루 동안의 위치 변화가 함께 섞이지 않도록 해요.",
    "required": [
      "계절 차이와 같은 날 시각 차이를 구별하는 조건"
    ],
    "explanation": "가는 같은 날 밤 9시와 10시를 비교했으므로 하루 변화예요. 나는 서로 다른 계절의 밤 9시를 비교했어요. 계절 비교에서는 하루 동안 달라지는 영향이 섞이지 않도록 시각을 같게 해요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "lines": 1
  },
  "93": {
    "before": "6a95dd4d2397f277",
    "prompt": "겨울에 찾기 좋은 별자리를 다른 계절에도 볼 수 있을까요? 관찰 시각을 생각하며 짧게 쓰세요.",
    "answer": "다른 계절에도 시각에 따라 볼 수 있어요.",
    "required": [
      "대표 계절과 관찰 시각에 따른 가시성 구별"
    ],
    "explanation": "겨울 별자리는 겨울의 일정한 밤 시각에 찾기 좋은 예예요. 다른 계절에도 시각과 장소에 따라 볼 수 있으므로 언제 어디에서 보는지 함께 확인해요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "lines": 1
  },
  "108": {
    "before": "a24397c3e21368b1",
    "prompt": "표의 A는 밤 9시, B는 밤 10시로 표시되어 있어요. 두 계절을 같은 시각에 비교하려면 B를 어떻게 고칠까요?",
    "answer": "B도 밤 9시로 맞추어요.",
    "required": [
      "실제 표시 시각을 같은 밤 9시로 수정"
    ],
    "explanation": "B는 밤 10시로 표시되어 A의 밤 9시와 달라요. 두 화면을 모두 밤 9시로 다시 맞추어야 해요. 날짜뿐 아니라 시각도 달랐으므로 지금 차이를 계절 때문이라고만 설명하지 않아요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "lines": 1
  },
  "109": {
    "before": "4a4a69d8766d526a",
    "prompt": "다른 계절의 화면에서 같은 별자리를 찾았어요. 계절별 차이를 알아보려면 그 별자리의 무엇을 더 비교할까요?",
    "answer": "같은 남쪽 기준에서 보이는 위치를 비교해요.",
    "required": [
      "같은 배열의 별자리라도 기준에 대한 위치를 비교"
    ],
    "explanation": "계절이 달라도 일부 별자리는 겹쳐 보일 수 있어요. 모든 별자리가 한꺼번에 완전히 다른 것으로 바뀌는 것은 아니에요. 같은 조건에서 실제 위치도 함께 비교해요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "lines": 1
  },
  "124": {
    "before": "a2c0fc2997cb316b",
    "prompt": "같은 장소에서 남쪽 하늘을 밤 9시에 보았어요. 계절에 따라 별무리의 위치가 달라지는 까닭을 지구의 운동과 연결해 쓰세요.",
    "answer": "지구가 공전하면서 밤에 바라보는 방향이 달라지기 때문이에요.",
    "required": [
      "지구 공전과 같은 시각 밤의 방향 변화 연결"
    ],
    "explanation": "같은 배열은 같은 별무리를 찾는 단서예요. 장소·시각·방향을 맞춘 두 계절의 위치 차이는 공전과 연결해 설명해요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "lines": 2
  },
  "126": {
    "before": "25333d04f11bd2f6",
    "prompt": "낮에도 별이 있는데 대부분 잘 보이지 않는 까닭을 짧게 쓰세요.",
    "answer": "태양빛으로 하늘이 밝기 때문이에요.",
    "required": [
      "낮에도 별이 있음과 태양빛으로 밝은 하늘 구별"
    ],
    "explanation": "낮밤에 별이 생기거나 없어지는 것이 아니에요. 낮의 밝은 하늘과 계절별 밤의 방향 변화는 나누어 설명해요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "lines": 1
  },
  "15": {
    "before": "c7e51d4a851519a0",
    "prompt": "남쪽을 보는 사람을 그리세요. 보는 방향과 사람의 왼쪽·오른쪽에 동쪽·서쪽 이름표를 붙이세요.",
    "answer": "남쪽 시선과 왼쪽 동쪽·오른쪽 서쪽 이름표.",
    "required": [
      "남쪽을 보는 관측자 기준 방위 표시"
    ],
    "explanation": "사람이 남쪽을 바라보도록 그리고 그 사람의 왼쪽에 동쪽, 오른쪽에 서쪽을 적어요. 사람과 같은 쪽을 바라본다는 기준이 드러나야 좌우를 바르게 읽을 수 있어요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "drawingExplanationLines": 0
  },
  "16": {
    "before": "27a37cc3c40e61bd",
    "prompt": "두 화면을 다시 비교할 빈 기록틀을 만드세요. 장소·날짜·시각·보는 방향과 같은 별무리의 위치를 적을 자리를 표시하세요.",
    "answer": "두 화면의 설정과 같은 별무리 위치를 적을 빈 기록틀.",
    "required": [
      "설정과 실제 위치를 적을 빈칸이 구별된 기록틀"
    ],
    "explanation": "같은 화면을 다시 열려면 장소와 날짜, 시각과 방향, 확대율을 알아야 해요. 같은 별무리를 어떻게 찾았는지와 어디에 보였는지도 적을 칸을 만들어요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "drawingExplanationLines": 0,
    "drawingPanels": 2
  },
  "31": {
    "before": "58fe100724bb58c1",
    "prompt": "두 칸에 같은 밤 두 시각의 관찰틀을 그리세요. 같은 남쪽 기준과 시각을 적고, 별무리 위치는 실제 관찰한 뒤 채우세요.",
    "answer": "같은 남쪽 기준·두 시각과 실제 관찰 뒤 채울 빈 위치 칸.",
    "required": [
      "같은 밤의 두 시각과 고정 남쪽 기준·빈 위치 칸"
    ],
    "explanation": "같은 별무리를 찾을 수 있도록 밝은 별과 주변 별의 모양을 표시해요. 두 칸에 같은 남쪽 기준과 관찰 시각을 쓰고, 직접 본 뒤 위치를 채워요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "drawingExplanationLines": 0,
    "drawingPanels": 2
  },
  "32": {
    "before": "eda7c88fbe6274c5",
    "prompt": "태양을 직접 보지 않고 프로그램의 두 시각을 비교할 틀을 그리세요. 같은 장소·날짜·남쪽 기준과 비교할 시각을 표시하세요.",
    "answer": "안전한 간접 자료의 같은 설정·두 시각·빈 위치 칸.",
    "required": [
      "태양 직접 관찰 없이 시각만 다른 비교 계획"
    ],
    "explanation": "태양을 직접 보지 않고 준비된 간접 자료나 프로그램으로 비교해요. 같은 장소와 날짜, 남쪽 방향과 확대율을 유지하고 시각을 바꾸어요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "drawingExplanationLines": 0,
    "drawingPanels": 2
  },
  "47": {
    "before": "1d6d4b1eac06d530",
    "prompt": "두 칸에 모형 밖에서 본 모습과 지구 위 사람의 시선을 그리세요. 전등은 고정하고 지구와 함께 도는 사람의 시선에 화살표를 붙이세요.",
    "answer": "같은 전등과 회전 지구의 / 지구와 함께 도는 사람의 시선.",
    "required": [
      "고정 광원과 두 관측 위치의 시선 구별"
    ],
    "explanation": "밖에서 본 그림에는 고정된 전등과 도는 지구의를 그려요. 지구 위 사람의 그림에는 그 사람과 함께 달라지는 바라보는 방향을 표시해요. 두 그림에서 전등의 자리는 같게 두어요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "drawingExplanationLines": 0,
    "drawingPanels": 2
  },
  "48": {
    "before": "5f37940bde2fa69d",
    "prompt": "북극 위에서 내려다본 지구를 그리세요. 자전축과 북극 표시, 반시계 방향 화살표를 붙이세요.",
    "answer": "북극 위 관점의 자전축·북극·반시계 화살표.",
    "required": [
      "북극 위 관점과 반시계 자전 방향"
    ],
    "explanation": "북극 위에서 지구 중심을 내려다본 그림임을 쓰고, 자전축을 중심으로 반시계 방향 화살표를 그려요. 지표에서 남쪽 하늘을 보는 그림과는 다르다고 밝혀요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "drawingExplanationLines": 0
  },
  "63": {
    "before": "82468b711b0ddfbf",
    "prompt": "두 칸에 같은 지역의 낮과 밤을 그리세요. 전등은 고정하고, 같은 지역 표시가 직접 빛을 받는지 이름표로 나타내세요.",
    "answer": "전등 쪽의 같은 지역·낮 / 전등 반대쪽의 같은 지역·밤.",
    "required": [
      "고정 광원과 같은 지역의 빛 받음·낮/밤 구별"
    ],
    "explanation": "두 그림에서 전등은 같은 곳에 두고 같은 지역 표시를 따라가요. 지구의가 돌아 그 표시가 전등을 향하면 낮, 반대쪽을 향하면 밤으로 나타내요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "drawingExplanationLines": 0,
    "drawingPanels": 2
  },
  "64": {
    "before": "8f32235293b8b864",
    "prompt": "선생님이 준비한 전등과 지구의의 안전한 배치를 그리세요. 주변 조명이 비추는지도 살필 수 있게 표시하세요.",
    "answer": "안정된 전등·지구의·전선과 주변 조명 확인 표시.",
    "required": [
      "안전한 모형 배치와 주변 조명의 영향 확인"
    ],
    "explanation": "주변 조명이 모형 반대쪽까지 비추는지 확인해요. 전등과 받침, 전선을 안전하게 놓고 같은 축과 지역 표시를 유지하며 빛을 직접 받는지 비교해요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "drawingExplanationLines": 0
  },
  "79": {
    "before": "64f8abe543b0a98f",
    "prompt": "두 칸에 자전과 공전을 나누어 그리세요. 도는 중심과 운동 이름·한 바퀴의 시간을 짧은 이름표로 붙이세요.",
    "answer": "자전축 중심·자전·하루 / 태양 둘레·공전·일 년.",
    "required": [
      "자전과 공전의 중심·이름·기간 구별"
    ],
    "explanation": "자전 그림은 지구의 중심을 제자리에 두고 축을 중심으로 도는 화살표를 그려요. 공전 그림은 태양을 중심으로 지구의 위치가 옮겨 가는 길을 그려요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "drawingExplanationLines": 0,
    "drawingPanels": 2
  },
  "80": {
    "before": "902377680a3907e2",
    "prompt": "두 칸에 하루 비교와 계절 비교 카드를 만드세요. 바꿀 조건과 같게 할 조건을 짧게 표시하고 실제 결과 칸은 비워 두세요.",
    "answer": "같은 날 시각 변화 / 같은 시각 날짜 변화와 고정 조건·빈 결과.",
    "required": [
      "하루/계절 비교의 다른 조건과 같은 기준·빈 결과"
    ],
    "explanation": "하루 비교는 날짜를 같게 하고 시각을 바꾸어요. 계절 비교는 시각을 같게 하고 날짜를 바꾸어요. 두 카드에 무엇을 바꾸는지와 자전·공전을 함께 나타내요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "drawingExplanationLines": 0,
    "drawingPanels": 2
  },
  "95": {
    "before": "83cec2419562d427",
    "prompt": "태양과 서로 다른 두 위치의 지구를 그리세요. 별 카드는 고정하고 각 지구에서 한밤에 바라보는 방향을 화살표로 나타내세요.",
    "answer": "고정한 태양·별 카드와 두 지구 위치의 태양 반대쪽 화살표.",
    "required": [
      "공전 위치에 따른 태양 반대쪽 밤의 방향"
    ],
    "explanation": "별 카드는 고정하고 지구만 태양 둘레 두 곳에 그려요. 각 지구에서 태양을 향한 쪽과 그 반대인 한밤 방향을 표시하면 보는 카드가 달라지는 까닭을 설명할 수 있어요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "drawingExplanationLines": 0
  },
  "96": {
    "before": "d7d97d43798320a9",
    "prompt": "태양과 지구를 그리고 태양 쪽과 반대쪽을 표시하세요. 한밤에 정면으로 보는 쪽에 이름표를 붙이세요.",
    "answer": "태양 쪽과 반대쪽 / 태양 반대쪽에 한밤 정면 이름표.",
    "required": [
      "태양 방향과 한밤 정면 방향 구별"
    ],
    "explanation": "지구에서 태양을 향한 쪽과 반대쪽을 먼저 찾고 별 카드를 그려요. 태양 반대쪽에는 한밤에 정면으로 보는 쪽, 태양 쪽에는 낮에 밝은 태양빛 때문에 보기 어려운 쪽이라는 이름표를 붙여요.",
    "misconception": "태양을 향한 방향과 한밤에 바라보는 태양 반대쪽을 구별해요.",
    "drawingExplanationLines": 0
  },
  "111": {
    "before": "ba8356368510e178",
    "prompt": "계절별 하늘을 비교할 설정 카드를 그리세요. 같게 할 장소·시각·방향·확대율과 바꿀 날짜를 나누어 표시하세요.",
    "answer": "같은 장소·시각·방향·확대율 / 서로 다른 날짜의 설정 카드.",
    "required": [
      "고정 설정과 바꿀 날짜를 구별한 비교 계획"
    ],
    "explanation": "서울과 밤 9시, 남쪽 방향과 확대율은 같게 하고 날짜만 바꾸도록 안내해요. 시계를 멈추고 실제 표시 시각을 확인하는 순서도 넣어요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "drawingExplanationLines": 0
  },
  "112": {
    "before": "7f829d428e9ed4e4",
    "prompt": "두 칸에 같은 밤 비교와 계절 비교의 빈 기록틀을 만드세요. 바꿀 조건과 같은 별무리의 위치를 적을 자리를 표시하세요.",
    "answer": "시각을 바꾸는 같은 밤 비교 / 날짜를 바꾸는 같은 시각 계절 비교.",
    "required": [
      "두 비교의 조건과 실제로 채울 위치 칸 구별"
    ],
    "explanation": "첫 줄은 같은 날 밤 9시와 10시로 시각을 바꾸어요. 둘째 줄은 서로 다른 계절의 밤 9시로 날짜를 바꾸어요. 각 줄에서 같은 별무리의 위치를 적을 칸을 만들어요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "drawingExplanationLines": 0,
    "drawingPanels": 2
  },
  "127": {
    "before": "723ae168f445cc92",
    "prompt": "두 칸에 하루 변화와 계절 차이를 설명할 자료를 그리세요. 비교할 조건·위치와 자전·공전 이름표를 연결하세요.",
    "answer": "같은 날 시각 차이·자전 / 같은 시각 계절 차이·공전의 두 비교.",
    "required": [
      "하루/계절의 조건과 지구 운동 연결"
    ],
    "explanation": "한쪽에는 같은 날 시각을 바꾼 위치 변화와 자전을, 다른 쪽에는 같은 시각에 날짜를 바꾼 차이와 공전을 나타내요. 언제 어디에서 어느 방향을 보았는지도 함께 쓰면 친구가 비교를 이해하기 쉬워요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "drawingExplanationLines": 0,
    "drawingPanels": 2
  },
  "128": {
    "before": "efbbf3909b2a2a56",
    "prompt": "태양 양쪽에 지구를 놓고 바깥에 별 카드 P·Q를 그리세요. 두 지구에서 한밤에 정면으로 보는 카드에 화살표를 이으세요.",
    "answer": "태양 왼쪽 지구→왼쪽 바깥 P / 오른쪽 지구→오른쪽 바깥 Q.",
    "required": [
      "고정 태양·별 카드와 두 위치의 태양 반대쪽 밤 시선"
    ],
    "explanation": "각 지구에서 태양 반대쪽이 한밤중의 바깥 방향이에요. 서로 다른 시기의 공전 위치를 비교한 그림이며 별까지의 거리를 실제 비율로 나타낸 것은 아니에요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "drawingExplanationLines": 0
  }
};
const bankReview={
  "c22-s61-u04-b012": {
    "before": [
      "3dede1b39294bea5"
    ],
    "prompt": "표에서 친구가 같은 조건으로 화면을 다시 열기 쉬운 기록을 고르세요.",
    "answer": "② 나",
    "required": [
      "관찰 설정이 적힌 나 기록 선택"
    ],
    "explanation": "나는 장소와 날짜, 시각과 방향, 확대율이 적혀 있어 같은 화면을 다시 열기 쉬워요. 가의 오른쪽이라는 말만으로는 어느 쪽을 바라보았는지도 알 수 없어요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "choice",
    "choices": [
      "가",
      "나",
      "가와 나 모두 필요한 조건이 없다."
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u04-b014": {
    "before": [
      "10e781120e5606e0"
    ],
    "prompt": "프로그램에서 별 이름표를 켰어요. 이 화면으로 확인한 것은 무엇인가요?",
    "answer": "③ 프로그램에서 이름을 찾은 별",
    "required": [
      "프로그램의 이름표와 실제 야외 관찰 구별"
    ],
    "explanation": "이름표는 프로그램에서 별을 찾도록 돕는 표시예요. 실제 집 앞에서 맨눈으로 보이는지는 날씨와 별의 밝기, 건물과 주변 조명도 살펴야 해요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "choice",
    "choices": [
      "지금 집 앞에서 모두 맨눈으로 보이는 별",
      "날씨와 관계없이 야외에서 보이는 별",
      "프로그램에서 이름을 찾은 별"
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u04-b028": {
    "before": [
      "647f65b8dd50d646"
    ],
    "prompt": "22시에는 구름 때문에 별무리의 위치를 보지 못했어요. 알맞은 기록을 고르세요.",
    "answer": "① 구름 때문에 위치를 보지 못했다.",
    "required": [
      "보지 못한 실제 상태를 기록"
    ],
    "explanation": "22시에는 구름 때문에 위치를 보지 못했다고 적어요. 별이 없어졌다는 뜻은 아니에요. 나중에 다시 직접 보거나 프로그램을 별도 자료로 살펴볼 수 있어요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "choice",
    "choices": [
      "구름 때문에 위치를 보지 못했다.",
      "21시와 같은 위치를 직접 보았다.",
      "예상한 위치를 실제로 관찰했다."
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u04-b030": {
    "before": [
      "44655164f066fc36"
    ],
    "prompt": "우리나라에서 시계가 낮 12시일 때 태양의 위치에 대한 설명으로 알맞은 것을 고르세요.",
    "answer": "② 날짜와 장소에 따라 위치가 달라 머리 바로 위라고 할 수 없다.",
    "required": [
      "시계 시각과 태양의 실제 위치 구별"
    ],
    "explanation": "한국에서 태양이 언제나 머리 바로 위에 오는 것은 아니에요. 낮 12시와 태양이 정확히 남쪽에 오는 때도 항상 같다고 정하지 말고 날짜와 장소, 시각을 확인해요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "choice",
    "choices": [
      "어느 지역에서나 머리 바로 위에 있다.",
      "날짜와 장소에 따라 위치가 달라 머리 바로 위라고 할 수 없다.",
      "항상 정확히 남쪽에 있으므로 날짜를 확인할 필요가 없다."
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u04-b060": {
    "before": [
      "00e9712e165fc7d8"
    ],
    "prompt": "모형 전등의 반대쪽까지 밝게 보였어요. 더 확인할 것을 고르세요.",
    "answer": "③ 천장등이나 반사된 빛이 비추는지",
    "required": [
      "주변 조명과 모형 광원의 직접 빛 구별"
    ],
    "explanation": "천장등이나 반사된 빛이 반대쪽 면까지 비추었을 수 있어요. 밝게 보였다는 결과는 남겨 두고, 모형 전등이 직접 비춘 빛인지 주변 빛인지 다시 확인해요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "choice",
    "choices": [
      "관찰한 기록을 지울지",
      "지구의 자전이 멈췄는지",
      "천장등이나 반사된 빛이 비추는지"
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u04-b061": {
    "before": [
      "73a781bd9e73749b"
    ],
    "prompt": "전등과 지구의만 있는 모형에서도 밤에 해당하는 쪽이 생겼어요. 알맞은 설명을 고르세요.",
    "answer": "① 달이 태양을 가리지 않아도 지구의 반대쪽은 직접 빛을 받지 않는다.",
    "required": [
      "달의 가림과 매일 생기는 밤 구별"
    ],
    "explanation": "달 모형이 없어도 지구의 반대쪽은 태양빛을 직접 받지 않아요. 지구가 자전해 같은 지역이 그쪽으로 돌아가면 밤이 돼요. 매일의 밤을 달이 태양을 가려서 생긴다고 설명하지 않아요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "choice",
    "choices": [
      "달이 태양을 가리지 않아도 지구의 반대쪽은 직접 빛을 받지 않는다.",
      "달 모형이 없으면 낮과 밤을 나타낼 수 없다.",
      "전등이 꺼져야만 밤에 해당하는 쪽이 생긴다."
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u04-b092": {
    "before": [
      "163aeb760c858d98"
    ],
    "prompt": "표의 모형실험에서 실제로 바꾼 것을 고르세요.",
    "answer": "② 태양 둘레에 놓은 지구의의 위치",
    "required": [
      "고정한 별 카드와 옮긴 지구의 위치 구별"
    ],
    "explanation": "실제로 고정한 것은 태양과 별 카드이고, 옮긴 것은 지구예요. 지구의 위치가 달라져 한밤에 바라보는 방향이 바뀌었다는 나의 설명이 맞아요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "choice",
    "choices": [
      "별 카드가 지구 둘레를 도는 위치",
      "태양 둘레에 놓은 지구의의 위치",
      "전등이 교실에서 놓인 위치"
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u04-b107": {
    "before": [
      "5d8c0f9f282761b9"
    ],
    "prompt": "프로그램 설정표에서 계절 차이를 비교할 두 행을 고르세요.",
    "answer": "③ A와 C",
    "required": [
      "같은 장소와 시각에서 날짜가 다른 A와 C 선택"
    ],
    "explanation": "A와 C는 같은 밤 9시이고 날짜만 달라 계절 비교에 써요. A와 B는 같은 날 밤 9시와 10시이므로 하루 변화 비교에 써요. 실제로 별이 어디에 보였는지는 화면에서 더 살펴야 해요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "choice",
    "choices": [
      "A와 B",
      "B와 C",
      "A와 C"
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u04-b110": {
    "before": [
      "979793e1b11e4c8b"
    ],
    "prompt": "여름 화면에서 달이 밝고 별 점이 더 적게 보였어요. 알맞은 설명을 고르세요.",
    "answer": "① 달빛이나 화면 설정 때문에 보이는 별의 수가 달라질 수 있다.",
    "required": [
      "화면 밝기 조건과 별의 위치 변화를 구별"
    ],
    "explanation": "달의 밝기와 화면 표시, 확대율에 따라 찾기 쉬운 별의 수가 달라질 수 있어요. 별 점의 개수만으로 지구가 공전을 멈췄다고 할 수는 없어요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "choice",
    "choices": [
      "달빛이나 화면 설정 때문에 보이는 별의 수가 달라질 수 있다.",
      "별 점이 적으므로 지구가 공전을 멈춘 것이다.",
      "화면의 별 점 수만으로 계절 차이를 설명할 수 있다."
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u04-b125": {
    "before": [
      "2b735fd32c892075"
    ],
    "prompt": "서로 다른 계절의 화면에 같은 별자리가 있어요. 알맞은 설명을 고르세요.",
    "answer": "② 일부 별자리는 겹쳐 보일 수 있으므로 위치도 비교한다.",
    "required": [
      "일부 겹침과 계절별 밤하늘 차이 구별"
    ],
    "explanation": "같은 별자리를 두 화면에서 찾았다는 기록은 남겨요. 하지만 일부가 겹쳐 보인다는 이유만으로 계절별 밤하늘 차이나 공전 설명이 모두 틀렸다고 할 수는 없어요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "choice",
    "choices": [
      "같은 별자리가 있으면 시각을 확인할 필요가 없다.",
      "일부 별자리는 겹쳐 보일 수 있으므로 위치도 비교한다.",
      "계절마다 보이는 모든 별자리가 서로 달라야 한다."
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u04-b027": {
    "before": [
      "b856ac5715579a61"
    ],
    "prompt": "남쪽을 바라볼 때, 표의 별무리는 [ ]쪽에서 [ ]쪽으로 옮겨 보여요.",
    "answer": "동, 서",
    "required": [
      "같은 밤의 동쪽에서 서쪽으로 보이는 이동"
    ],
    "explanation": "남쪽을 바라볼 때 왼쪽인 동쪽에서 오른쪽인 서쪽으로 위치가 달라졌어요. 세 기록 모두 P와 주변 세 별이므로 같은 별무리를 따라본 것이며, 별이 놓인 모양이 바뀌었다는 뜻은 아니에요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "accepted": [
            "동",
            "동쪽"
          ]
        },
        {
          "accepted": [
            "서",
            "서쪽"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u04-b045": {
    "before": [
      "382fd58899af571e"
    ],
    "prompt": "지구는 [ ]에서 [ ]으로 자전해요. 태양이 하루 동안 움직여 보이는 방향과 구별해요.",
    "answer": "서쪽, 동쪽",
    "required": [
      "실제 지구 자전 방향"
    ],
    "explanation": "지구가 도는 방향과 태양이 움직여 보이는 방향은 반대예요. 지구는 서쪽에서 동쪽으로 자전하고, 지구 위 사람에게 태양은 동쪽에서 서쪽으로 움직이는 것처럼 보여요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "accepted": [
            "서쪽",
            "서"
          ]
        },
        {
          "accepted": [
            "동쪽",
            "동"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u04-b046": {
    "before": [
      "adeed42ad29f6034"
    ],
    "prompt": "북극 위에서 지구 중심을 내려다보면 지구는 [ ] 방향으로 자전해요.",
    "answer": "반시계",
    "required": [
      "북극 위 관점의 반시계 방향"
    ],
    "explanation": "먼저 어디에서 바라보았는지 물어요. 북극 위에서 내려다보면 지구는 반시계 방향으로 자전해요. 어떤 위치에서 무엇을 중심으로 도는지도 함께 설명해요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "blank",
    "contract": {
      "kind": "short-text",
      "accepted": [
        "반시계",
        "반시계 방향"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u04-b075": {
    "before": [
      "127469f0371b93f2"
    ],
    "prompt": "표의 A는 축을 중심으로 도는 [ ], B는 태양 둘레로 움직이는 [ ]이에요.",
    "answer": "자전, 공전",
    "required": [
      "모형의 회전 중심과 자전·공전 대응"
    ],
    "explanation": "A는 지구의 중심을 제자리에 두고 축을 중심으로 돌렸으므로 자전이며 하루에 해당해요. B는 지구의 중심을 태양 둘레로 옮겼으므로 공전이며 일 년에 해당해요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "accepted": [
            "자전"
          ]
        },
        {
          "accepted": [
            "공전"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u04-b077": {
    "before": [
      "c9708c6ae07eb1dc"
    ],
    "prompt": "지구는 자전축을 중심으로 [ ]에 한 바퀴 자전하고, 태양 둘레를 [ ]에 한 바퀴 공전해요.",
    "answer": "하루, 일 년",
    "required": [
      "자전과 공전의 한 바퀴 기간"
    ],
    "explanation": "자전은 자전축을 중심으로 하루에 한 바퀴 도는 운동이에요. 공전은 태양 둘레를 일 년에 한 바퀴 도는 운동이에요. 도는 중심과 걸리는 시간을 함께 고쳐야 해요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "accepted": [
            "하루",
            "약 하루",
            "1일"
          ]
        },
        {
          "accepted": [
            "일 년",
            "1년",
            "약 일 년",
            "약 1년"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u04-b078": {
    "before": [
      "073e8d0eab1b0650"
    ],
    "prompt": "같은 날 한 시간 동안 별의 위치 변화는 지구의 [ ], 서로 다른 계절의 같은 시각 밤하늘 차이는 지구의 [ ]과 연결해요.",
    "answer": "자전, 공전",
    "required": [
      "하루 변화와 계절별 차이를 지구 운동과 연결"
    ],
    "explanation": "같은 날 한 시간 뒤의 변화는 지구와 함께 도는 사람에게 보이는 자전의 영향으로 설명해요. 서로 다른 계절의 같은 시각에는 공전으로 밤에 보는 방향이 달라진 것을 설명해요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "accepted": [
            "자전"
          ]
        },
        {
          "accepted": [
            "공전"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u04-b062": {
    "before": [
      "f24842a443b6af52"
    ],
    "prompt": "처음에는 낮이던 A 지역이 태양빛을 직접 받지 않는 쪽으로 돌아갔어요. 이와 관련된 지구의 운동 이름을 쓰세요.",
    "answer": "자전",
    "required": [
      "같은 지역의 낮과 밤 변화와 자전 연결"
    ],
    "explanation": "처음 A와 B는 태양을 향한 쪽이 달라 낮과 밤이 달랐어요. 시간이 지나 지구가 자전하면 A도 빛을 직접 받지 않는 쪽으로 돌아가 밤이 돼요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "short",
    "contract": {
      "kind": "short-text",
      "accepted": [
        "자전",
        "지구의 자전"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u04-b091": {
    "before": [
      "4477a452c61ef91c"
    ],
    "prompt": "표에서 태양 왼쪽의 지구와 오른쪽의 지구가 한밤중에 정면으로 보는 카드를 차례로 쓰세요.",
    "answer": "P, Q",
    "required": [
      "태양 반대쪽 정면 카드 P와 Q 구별"
    ],
    "explanation": "지구가 태양 왼쪽이면 왼쪽 바깥의 P, 오른쪽이면 오른쪽 바깥의 Q를 보아요. 각 지구에서 태양이 어느 쪽인지 찾은 뒤 그 반대쪽을 읽어요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "short",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "accepted": [
            "P",
            "p"
          ]
        },
        {
          "accepted": [
            "Q",
            "q"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u04-b094": {
    "before": [
      "93816b9f662edacd"
    ],
    "prompt": "한밤중에 정면으로 보는 쪽은 태양을 향한 쪽과 그 반대쪽 중 어디인가요? 짧게 쓰세요.",
    "answer": "태양 반대쪽",
    "required": [
      "태양 반대쪽의 한밤 방향"
    ],
    "explanation": "한밤에 바라보는 사람은 태양 반대쪽을 향해요. 태양 쪽 카드는 반대 방향이므로 한밤에 정면으로 보는 카드가 아니에요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "short",
    "contract": {
      "kind": "short-text",
      "accepted": [
        "태양 반대쪽",
        "반대쪽",
        "태양의 반대쪽"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u04-b123": {
    "before": [
      "153d9fcdc8683a17"
    ],
    "prompt": "표의 가 기록은 같은 날 한 시간 동안의 별 위치 변화예요. 지구의 어떤 운동과 연결할까요?",
    "answer": "자전",
    "required": [
      "같은 날 시각 차이와 자전 연결"
    ],
    "explanation": "가는 같은 날 시각을 바꾸었으므로 하루의 자전과 연결해요. 나는 같은 밤 9시에 서로 다른 계절을 비교했으므로 공전과 연결해요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "form": "short",
    "contract": {
      "kind": "short-text",
      "accepted": [
        "자전",
        "지구의 자전"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u04-b011": {
    "before": [
      "b748ecd998142017"
    ],
    "prompt": "A와 B는 장소와 시각이 달라요. 계절 차이를 다시 비교할 때 같게 해야 할 조건 하나를 쓰세요.",
    "answer": "같은 시각에 관찰해요.",
    "required": [
      "장소·시각·방향·확대율 중 타당한 같은 비교 조건 하나"
    ],
    "explanation": "A는 서울 밤 9시, B는 부산 밤 11시이므로 장소와 시각이 모두 달라요. 같은 장소와 시각, 방향과 확대율로 맞추고 날짜만 다르게 해야 계절을 비교하기 좋아요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "lines": 1
  },
  "c22-s61-u04-b013": {
    "before": [
      "f223a4b4f3e9b4c6"
    ],
    "prompt": "남쪽을 본 친구와 북쪽을 본 친구가 모두 “왼쪽 별”이라고 말했어요. 서로 다른 방위를 가리킬 수 있는 까닭을 짧게 쓰세요.",
    "answer": "바라보는 방향이 다르기 때문이에요.",
    "required": [
      "관측자가 바라보는 방향과 왼쪽 방위의 관계"
    ],
    "explanation": "남쪽을 볼 때 왼쪽은 동쪽이지만 북쪽을 볼 때 왼쪽은 서쪽이에요. 두 사람이 왼쪽이라고 말했어도 같은 방향을 가리킨 것은 아닐 수 있어요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "lines": 1
  },
  "c22-s61-u04-b029": {
    "before": [
      "908f93c8ed48c45a"
    ],
    "prompt": "같은 밤에 별무리가 동쪽에서 서쪽으로 옮겨 보이는 까닭을 지구의 운동과 연결해 짧게 쓰세요.",
    "answer": "지구가 서쪽에서 동쪽으로 자전하기 때문이에요.",
    "required": [
      "겉보기 하루 변화와 실제 지구 자전 연결"
    ],
    "explanation": "직접 본 것은 같은 별무리가 서쪽으로 옮겨 보였다는 사실이에요. 이 하루 변화는 지구의 자전으로 설명해요. 별들이 실제로 지구 둘레를 돈 것을 직접 잰 것은 아니에요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "lines": 1
  },
  "c22-s61-u04-b043": {
    "before": [
      "702778b20fa81a38"
    ],
    "prompt": "전등은 같은 자리에 있는데 지구 위 사람에게 보이는 방향은 달라졌어요. 까닭을 짧게 쓰세요.",
    "answer": "사람이 지구와 함께 돌기 때문이에요.",
    "required": [
      "고정한 전등과 회전하는 관측자의 시선 구별"
    ],
    "explanation": "밖에서 본 전등은 고정되어 있어요. 지구 위 사람은 지구와 함께 돌기 때문에 전등이 보이는 방향이 달라져요. 전등을 옮기지 않아도 두 설명이 함께 맞을 수 있어요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "lines": 1
  },
  "c22-s61-u04-b044": {
    "before": [
      "c627eed5acd054db"
    ],
    "prompt": "표의 가 모둠은 전등을 고정하고 지구의만 돌렸어요. 전등을 고정해야 하는 까닭을 짧게 쓰세요.",
    "answer": "전등을 옮기는 영향이 함께 섞이지 않도록 해요.",
    "required": [
      "지구의 회전의 영향을 비교하기 위한 고정 광원"
    ],
    "explanation": "가는 전등을 고정하고 지구의만 돌렸어요. 나는 전등까지 옮겼으므로, 보이는 방향이 지구의 회전 때문인지 전등 이동 때문인지 나누어 알기 어려워요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "lines": 1
  },
  "c22-s61-u04-b059": {
    "before": [
      "c17f322d8c89a483"
    ],
    "prompt": "자전한 뒤 같은 지역에 밤이 되었어요. 그 지역이 빛을 받는 모습은 어떻게 달라졌나요?",
    "answer": "태양 반대쪽을 향해 태양빛을 직접 받지 않아요.",
    "required": [
      "같은 지역의 자전과 직접 빛을 받지 않는 밤 연결"
    ],
    "explanation": "같은 지역 표시가 자전으로 전등 반대쪽을 향해 직접 빛을 받지 않게 되었어요. 전등의 위치와 축의 기울기는 그대로이며 표시도 떼어 옮기지 않았어요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "lines": 1
  },
  "c22-s61-u04-b076": {
    "before": [
      "236d7939750b9e57"
    ],
    "prompt": "서로 다른 계절을 비교할 때 관찰 시각을 같게 해야 하는 까닭을 짧게 쓰세요.",
    "answer": "하루 동안의 위치 변화가 함께 섞이지 않도록 해요.",
    "required": [
      "계절 차이와 같은 날 시각 차이를 구별하는 조건"
    ],
    "explanation": "가는 같은 날 밤 9시와 10시를 비교했으므로 하루 변화예요. 나는 서로 다른 계절의 밤 9시를 비교했어요. 계절 비교에서는 하루 동안 달라지는 영향이 섞이지 않도록 시각을 같게 해요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "lines": 1
  },
  "c22-s61-u04-b093": {
    "before": [
      "5248f4c84aa7e33a"
    ],
    "prompt": "겨울에 찾기 좋은 별자리를 다른 계절에도 볼 수 있을까요? 관찰 시각을 생각하며 짧게 쓰세요.",
    "answer": "다른 계절에도 시각에 따라 볼 수 있어요.",
    "required": [
      "대표 계절과 관찰 시각에 따른 가시성 구별"
    ],
    "explanation": "겨울 별자리는 겨울의 일정한 밤 시각에 찾기 좋은 예예요. 다른 계절에도 시각과 장소에 따라 볼 수 있으므로 언제 어디에서 보는지 함께 확인해요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "lines": 1
  },
  "c22-s61-u04-b108": {
    "before": [
      "ae0c7acbce3af451"
    ],
    "prompt": "표의 A는 밤 9시, B는 밤 10시로 표시되어 있어요. 두 계절을 같은 시각에 비교하려면 B를 어떻게 고칠까요?",
    "answer": "B도 밤 9시로 맞추어요.",
    "required": [
      "실제 표시 시각을 같은 밤 9시로 수정"
    ],
    "explanation": "B는 밤 10시로 표시되어 A의 밤 9시와 달라요. 두 화면을 모두 밤 9시로 다시 맞추어야 해요. 날짜뿐 아니라 시각도 달랐으므로 지금 차이를 계절 때문이라고만 설명하지 않아요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "lines": 1
  },
  "c22-s61-u04-b109": {
    "before": [
      "e1e93f3af040fdac"
    ],
    "prompt": "다른 계절의 화면에서 같은 별자리를 찾았어요. 계절별 차이를 알아보려면 그 별자리의 무엇을 더 비교할까요?",
    "answer": "같은 남쪽 기준에서 보이는 위치를 비교해요.",
    "required": [
      "같은 배열의 별자리라도 기준에 대한 위치를 비교"
    ],
    "explanation": "계절이 달라도 일부 별자리는 겹쳐 보일 수 있어요. 모든 별자리가 한꺼번에 완전히 다른 것으로 바뀌는 것은 아니에요. 같은 조건에서 실제 위치도 함께 비교해요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "lines": 1
  },
  "c22-s61-u04-b124": {
    "before": [
      "46817308d4b66772",
      "1d636d9c9edb106e"
    ],
    "prompt": "같은 장소에서 남쪽 하늘을 밤 9시에 보았어요. 계절에 따라 별무리의 위치가 달라지는 까닭을 지구의 운동과 연결해 쓰세요.",
    "answer": "지구가 공전하면서 밤에 바라보는 방향이 달라지기 때문이에요.",
    "required": [
      "지구 공전과 같은 시각 밤의 방향 변화 연결"
    ],
    "explanation": "같은 배열은 같은 별무리를 찾는 단서예요. 장소·시각·방향을 맞춘 두 계절의 위치 차이는 공전과 연결해 설명해요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "lines": 2
  },
  "c22-s61-u04-b126": {
    "before": [
      "32ce382bc3ebc1e5"
    ],
    "prompt": "낮에도 별이 있는데 대부분 잘 보이지 않는 까닭을 짧게 쓰세요.",
    "answer": "태양빛으로 하늘이 밝기 때문이에요.",
    "required": [
      "낮에도 별이 있음과 태양빛으로 밝은 하늘 구별"
    ],
    "explanation": "낮밤에 별이 생기거나 없어지는 것이 아니에요. 낮의 밝은 하늘과 계절별 밤의 방향 변화는 나누어 설명해요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "lines": 1
  },
  "c22-s61-u04-b015": {
    "before": [
      "6e9dba879413c391"
    ],
    "prompt": "남쪽을 보는 사람을 그리세요. 보는 방향과 사람의 왼쪽·오른쪽에 동쪽·서쪽 이름표를 붙이세요.",
    "answer": "남쪽 시선과 왼쪽 동쪽·오른쪽 서쪽 이름표.",
    "required": [
      "남쪽을 보는 관측자 기준 방위 표시"
    ],
    "explanation": "사람이 남쪽을 바라보도록 그리고 그 사람의 왼쪽에 동쪽, 오른쪽에 서쪽을 적어요. 사람과 같은 쪽을 바라본다는 기준이 드러나야 좌우를 바르게 읽을 수 있어요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "drawingExplanationLines": 0
  },
  "c22-s61-u04-b016": {
    "before": [
      "5e2659051d2e05cb"
    ],
    "prompt": "두 화면을 다시 비교할 빈 기록틀을 만드세요. 장소·날짜·시각·보는 방향과 같은 별무리의 위치를 적을 자리를 표시하세요.",
    "answer": "두 화면의 설정과 같은 별무리 위치를 적을 빈 기록틀.",
    "required": [
      "설정과 실제 위치를 적을 빈칸이 구별된 기록틀"
    ],
    "explanation": "같은 화면을 다시 열려면 장소와 날짜, 시각과 방향, 확대율을 알아야 해요. 같은 별무리를 어떻게 찾았는지와 어디에 보였는지도 적을 칸을 만들어요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "drawingExplanationLines": 0,
    "drawingPanels": 2
  },
  "c22-s61-u04-b031": {
    "before": [
      "582940852985b55b"
    ],
    "prompt": "두 칸에 같은 밤 두 시각의 관찰틀을 그리세요. 같은 남쪽 기준과 시각을 적고, 별무리 위치는 실제 관찰한 뒤 채우세요.",
    "answer": "같은 남쪽 기준·두 시각과 실제 관찰 뒤 채울 빈 위치 칸.",
    "required": [
      "같은 밤의 두 시각과 고정 남쪽 기준·빈 위치 칸"
    ],
    "explanation": "같은 별무리를 찾을 수 있도록 밝은 별과 주변 별의 모양을 표시해요. 두 칸에 같은 남쪽 기준과 관찰 시각을 쓰고, 직접 본 뒤 위치를 채워요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "drawingExplanationLines": 0,
    "drawingPanels": 2
  },
  "c22-s61-u04-b032": {
    "before": [
      "a5adf8da5e4f3444"
    ],
    "prompt": "태양을 직접 보지 않고 프로그램의 두 시각을 비교할 틀을 그리세요. 같은 장소·날짜·남쪽 기준과 비교할 시각을 표시하세요.",
    "answer": "안전한 간접 자료의 같은 설정·두 시각·빈 위치 칸.",
    "required": [
      "태양 직접 관찰 없이 시각만 다른 비교 계획"
    ],
    "explanation": "태양을 직접 보지 않고 준비된 간접 자료나 프로그램으로 비교해요. 같은 장소와 날짜, 남쪽 방향과 확대율을 유지하고 시각을 바꾸어요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "drawingExplanationLines": 0,
    "drawingPanels": 2
  },
  "c22-s61-u04-b047": {
    "before": [
      "adf6fe9a48fe5920"
    ],
    "prompt": "두 칸에 모형 밖에서 본 모습과 지구 위 사람의 시선을 그리세요. 전등은 고정하고 지구와 함께 도는 사람의 시선에 화살표를 붙이세요.",
    "answer": "같은 전등과 회전 지구의 / 지구와 함께 도는 사람의 시선.",
    "required": [
      "고정 광원과 두 관측 위치의 시선 구별"
    ],
    "explanation": "밖에서 본 그림에는 고정된 전등과 도는 지구의를 그려요. 지구 위 사람의 그림에는 그 사람과 함께 달라지는 바라보는 방향을 표시해요. 두 그림에서 전등의 자리는 같게 두어요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "drawingExplanationLines": 0,
    "drawingPanels": 2
  },
  "c22-s61-u04-b048": {
    "before": [
      "a2fb363b76f0731d"
    ],
    "prompt": "북극 위에서 내려다본 지구를 그리세요. 자전축과 북극 표시, 반시계 방향 화살표를 붙이세요.",
    "answer": "북극 위 관점의 자전축·북극·반시계 화살표.",
    "required": [
      "북극 위 관점과 반시계 자전 방향"
    ],
    "explanation": "북극 위에서 지구 중심을 내려다본 그림임을 쓰고, 자전축을 중심으로 반시계 방향 화살표를 그려요. 지표에서 남쪽 하늘을 보는 그림과는 다르다고 밝혀요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "drawingExplanationLines": 0
  },
  "c22-s61-u04-b063": {
    "before": [
      "64876b9d9172650f"
    ],
    "prompt": "두 칸에 같은 지역의 낮과 밤을 그리세요. 전등은 고정하고, 같은 지역 표시가 직접 빛을 받는지 이름표로 나타내세요.",
    "answer": "전등 쪽의 같은 지역·낮 / 전등 반대쪽의 같은 지역·밤.",
    "required": [
      "고정 광원과 같은 지역의 빛 받음·낮/밤 구별"
    ],
    "explanation": "두 그림에서 전등은 같은 곳에 두고 같은 지역 표시를 따라가요. 지구의가 돌아 그 표시가 전등을 향하면 낮, 반대쪽을 향하면 밤으로 나타내요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "drawingExplanationLines": 0,
    "drawingPanels": 2
  },
  "c22-s61-u04-b064": {
    "before": [
      "101eec6a4ecabb50"
    ],
    "prompt": "선생님이 준비한 전등과 지구의의 안전한 배치를 그리세요. 주변 조명이 비추는지도 살필 수 있게 표시하세요.",
    "answer": "안정된 전등·지구의·전선과 주변 조명 확인 표시.",
    "required": [
      "안전한 모형 배치와 주변 조명의 영향 확인"
    ],
    "explanation": "주변 조명이 모형 반대쪽까지 비추는지 확인해요. 전등과 받침, 전선을 안전하게 놓고 같은 축과 지역 표시를 유지하며 빛을 직접 받는지 비교해요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "drawingExplanationLines": 0
  },
  "c22-s61-u04-b079": {
    "before": [
      "0357081cf12bc032"
    ],
    "prompt": "두 칸에 자전과 공전을 나누어 그리세요. 도는 중심과 운동 이름·한 바퀴의 시간을 짧은 이름표로 붙이세요.",
    "answer": "자전축 중심·자전·하루 / 태양 둘레·공전·일 년.",
    "required": [
      "자전과 공전의 중심·이름·기간 구별"
    ],
    "explanation": "자전 그림은 지구의 중심을 제자리에 두고 축을 중심으로 도는 화살표를 그려요. 공전 그림은 태양을 중심으로 지구의 위치가 옮겨 가는 길을 그려요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "drawingExplanationLines": 0,
    "drawingPanels": 2
  },
  "c22-s61-u04-b080": {
    "before": [
      "91f471dcfa842ee2"
    ],
    "prompt": "두 칸에 하루 비교와 계절 비교 카드를 만드세요. 바꿀 조건과 같게 할 조건을 짧게 표시하고 실제 결과 칸은 비워 두세요.",
    "answer": "같은 날 시각 변화 / 같은 시각 날짜 변화와 고정 조건·빈 결과.",
    "required": [
      "하루/계절 비교의 다른 조건과 같은 기준·빈 결과"
    ],
    "explanation": "하루 비교는 날짜를 같게 하고 시각을 바꾸어요. 계절 비교는 시각을 같게 하고 날짜를 바꾸어요. 두 카드에 무엇을 바꾸는지와 자전·공전을 함께 나타내요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "drawingExplanationLines": 0,
    "drawingPanels": 2
  },
  "c22-s61-u04-b095": {
    "before": [
      "50b9388bdfaaa0d9"
    ],
    "prompt": "태양과 서로 다른 두 위치의 지구를 그리세요. 별 카드는 고정하고 각 지구에서 한밤에 바라보는 방향을 화살표로 나타내세요.",
    "answer": "고정한 태양·별 카드와 두 지구 위치의 태양 반대쪽 화살표.",
    "required": [
      "공전 위치에 따른 태양 반대쪽 밤의 방향"
    ],
    "explanation": "별 카드는 고정하고 지구만 태양 둘레 두 곳에 그려요. 각 지구에서 태양을 향한 쪽과 그 반대인 한밤 방향을 표시하면 보는 카드가 달라지는 까닭을 설명할 수 있어요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "drawingExplanationLines": 0
  },
  "c22-s61-u04-b096": {
    "before": [
      "391a8298ff00326a"
    ],
    "prompt": "태양과 지구를 그리고 태양 쪽과 반대쪽을 표시하세요. 한밤에 정면으로 보는 쪽에 이름표를 붙이세요.",
    "answer": "태양 쪽과 반대쪽 / 태양 반대쪽에 한밤 정면 이름표.",
    "required": [
      "태양 방향과 한밤 정면 방향 구별"
    ],
    "explanation": "지구에서 태양을 향한 쪽과 반대쪽을 먼저 찾고 별 카드를 그려요. 태양 반대쪽에는 한밤에 정면으로 보는 쪽, 태양 쪽에는 낮에 밝은 태양빛 때문에 보기 어려운 쪽이라는 이름표를 붙여요.",
    "misconception": "태양을 향한 방향과 한밤에 바라보는 태양 반대쪽을 구별해요.",
    "drawingExplanationLines": 0
  },
  "c22-s61-u04-b111": {
    "before": [
      "c391e14cbafbc5c2"
    ],
    "prompt": "계절별 하늘을 비교할 설정 카드를 그리세요. 같게 할 장소·시각·방향·확대율과 바꿀 날짜를 나누어 표시하세요.",
    "answer": "같은 장소·시각·방향·확대율 / 서로 다른 날짜의 설정 카드.",
    "required": [
      "고정 설정과 바꿀 날짜를 구별한 비교 계획"
    ],
    "explanation": "서울과 밤 9시, 남쪽 방향과 확대율은 같게 하고 날짜만 바꾸도록 안내해요. 시계를 멈추고 실제 표시 시각을 확인하는 순서도 넣어요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "drawingExplanationLines": 0
  },
  "c22-s61-u04-b112": {
    "before": [
      "82d7b596672fbad0"
    ],
    "prompt": "두 칸에 같은 밤 비교와 계절 비교의 빈 기록틀을 만드세요. 바꿀 조건과 같은 별무리의 위치를 적을 자리를 표시하세요.",
    "answer": "시각을 바꾸는 같은 밤 비교 / 날짜를 바꾸는 같은 시각 계절 비교.",
    "required": [
      "두 비교의 조건과 실제로 채울 위치 칸 구별"
    ],
    "explanation": "첫 줄은 같은 날 밤 9시와 10시로 시각을 바꾸어요. 둘째 줄은 서로 다른 계절의 밤 9시로 날짜를 바꾸어요. 각 줄에서 같은 별무리의 위치를 적을 칸을 만들어요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "drawingExplanationLines": 0,
    "drawingPanels": 2
  },
  "c22-s61-u04-b127": {
    "before": [
      "7091789158d3a747"
    ],
    "prompt": "두 칸에 하루 변화와 계절 차이를 설명할 자료를 그리세요. 비교할 조건·위치와 자전·공전 이름표를 연결하세요.",
    "answer": "같은 날 시각 차이·자전 / 같은 시각 계절 차이·공전의 두 비교.",
    "required": [
      "하루/계절의 조건과 지구 운동 연결"
    ],
    "explanation": "한쪽에는 같은 날 시각을 바꾼 위치 변화와 자전을, 다른 쪽에는 같은 시각에 날짜를 바꾼 차이와 공전을 나타내요. 언제 어디에서 어느 방향을 보았는지도 함께 쓰면 친구가 비교를 이해하기 쉬워요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "drawingExplanationLines": 0,
    "drawingPanels": 2
  },
  "c22-s61-u04-b128": {
    "before": [
      "ac7984905193a446"
    ],
    "prompt": "태양 양쪽에 지구를 놓고 바깥에 별 카드 P·Q를 그리세요. 두 지구에서 한밤에 정면으로 보는 카드에 화살표를 이으세요.",
    "answer": "태양 왼쪽 지구→왼쪽 바깥 P / 오른쪽 지구→오른쪽 바깥 Q.",
    "required": [
      "고정 태양·별 카드와 두 위치의 태양 반대쪽 밤 시선"
    ],
    "explanation": "각 지구에서 태양 반대쪽이 한밤중의 바깥 방향이에요. 서로 다른 시기의 공전 위치를 비교한 그림이며 별까지의 거리를 실제 비율로 나타낸 것은 아니에요.",
    "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
    "drawingExplanationLines": 0
  }
};
const fields={
  "아침과 저녁 하늘에서 어떤 모습을 보았나요? 기억나는 모습이나 궁금한 점을 자유롭게 적어 보아요.": [
    "워밍업",
    "아침과 저녁 하늘에서 본 모습이나 궁금한 점을 짝과 말해요."
  ],
  "관찰이나 모형실험으로 알아보고 싶은 하늘의 변화를 적어요.": [
    "궁금한 점",
    "관찰이나 모형실험으로 알아보고 싶은 변화 하나를 말해요."
  ],
  "친구는 남쪽을 보고, 나는 북쪽을 봅니다. 두 사람의 왼쪽이 같은 방위일까요? 바라보는 방향과 함께 설명해요.": [
    "개념을 확인해요",
    "남쪽을 볼 때와 북쪽을 볼 때 왼쪽 방위가 어떻게 다른지 짚어요."
  ],
  "방위를 혼동하지 않게 관측자·시선·남쪽 기준을 어떻게 표시할까요?": [
    "내 말로 다시 설명하기",
    "관측자가 보는 방향과 남쪽 기준을 그림에서 짚어요."
  ],
  "흐림·가림·이동 안전과 준비가 필요한 것을 써요.": [
    "다시 확인할 여건",
    "관찰할 장소의 흐림·가림과 이동 안전을 선생님과 확인해요."
  ],
  "21시에는 별무리 위치를 읽었지만 22시에는 구름 때문에 못 보았습니다. 남길 기록과 다음에 확인할 방법을 나누어 써요.": [
    "개념을 확인해요",
    "구름 때문에 별을 못 본 기록은 어떻게 남길지 말해요."
  ],
  "같은 별무리를 다시 찾았다는 근거와 위치 변화의 근거를 나누어 써요.": [
    "내 말로 다시 설명하기",
    "같은 별무리인 근거와 위치가 달라진 근거를 표에서 짚어요."
  ],
  "세 화면의 조건과 달라진 위치를 연결해요.": [
    "같게 한 것·바꾼 것",
    "세 화면에서 같은 조건과 달라진 위치를 짚어 말해요."
  ],
  "친구가 지구의 위 표시와 함께 돌면서 전등을 보았습니다. 교실 전등의 실제 위치와 친구에게 보이는 방향을 나누어 설명해요.": [
    "개념을 확인해요",
    "전등의 자리와 지구 위 사람에게 보이는 방향을 구별해 말해요."
  ],
  "북극 위 관점과 남쪽 하늘을 보는 관점을 같은 화살표로 섞지 않으려면 무엇을 표시할까요?": [
    "내 말로 다시 설명하기",
    "북극 위에서 보는 그림과 남쪽 하늘을 보는 그림의 기준을 짚어요."
  ],
  "광원 위치·축·같은 지역 표시와 주변 조명을 적어요.": [
    "우리 장치의 조건",
    "광원·축·지역 표시와 주변 조명의 상태를 장치에서 짚어요."
  ],
  "구름이 낀 낮과 태양 반대쪽을 향한 밤은 모두 어둡게 보일 수 있습니다. 직접 빛과 지구 위 위치를 기준으로 두 상태를 구별해요.": [
    "개념을 확인해요",
    "어두운 낮과 밤을 태양빛을 직접 받는지로 구별해 말해요."
  ],
  "A가 낮에서 밤으로 바뀐 이유와 처음 A/B가 달랐던 이유를 각각 써요.": [
    "내 말로 다시 설명하기",
    "같은 지역 A가 낮에서 밤으로 바뀐 까닭을 말해요."
  ],
  "실제 관찰한 변화와 낮·밤을 연결해요. 예상과 달랐다면 조건도 확인해요.": [
    "근거로 설명하기",
    "직접 본 빛의 변화와 낮·밤을 연결해 말해요."
  ],
  "“태양 둘레를 하루에 한 바퀴 도는 자전”이라는 문장에서 도는 중심과 기간을 다시 확인해 고쳐요.": [
    "개념을 확인해요",
    "자전과 공전의 중심과 한 바퀴의 시간을 각각 말해요."
  ],
  "내가 읽은 자료에서 같게 한 조건과 달리한 조건을 먼저 표시해요.": [
    "내 말로 다시 설명하기",
    "자료에서 같게 한 조건과 달리한 조건을 짚어요."
  ],
  "지구의를 태양 왼쪽에 놓았습니다. 지구에서 태양이 있는 방향과 한밤 정면 방향을 각각 말로 써요.": [
    "개념을 확인해요",
    "태양 왼쪽에 있는 지구에서 한밤에 보는 방향을 짚어요."
  ],
  "태양의 위치와 한밤의 정면을 혼동하지 않는 설명 문장을 만들어요.": [
    "내 말로 다시 설명하기",
    "태양 쪽과 한밤에 정면으로 보는 쪽을 구별해 말해요."
  ],
  "달라진 정면 카드를 공전과 연결하고 모형의 한계도 써요.": [
    "고정한 것과 바꾼 것",
    "고정한 별 카드와 옮긴 지구의 위치를 짚어 설명해요."
  ],
  "같은 별무리가 봄의 한밤과 여름의 새벽에 모두 보인 기록이 있습니다. 대표 계절과 관측 시각의 관계를 어떻게 설명할까요?": [
    "개념을 확인해요",
    "같은 별무리가 다른 계절과 시각에도 보일 수 있는지 말해요."
  ],
  "조건은 맞췄지만 실제 위치 기록이 빠진 자료에 무엇을 보완할까요?": [
    "내 말로 다시 설명하기",
    "같은 배열의 별무리가 남쪽 기준 어디에 보이는지 짚어요."
  ],
  "실제 날짜·시각·장소·방향·확대율을 적어요.": [
    "선택한 두 화면과 조건",
    "실제 화면의 날짜·시각·장소·방향·확대율을 짚어요."
  ],
  "관찰한 위치 차이를 공전과 밤의 방향으로 설명해요.": [
    "지구의 운동과 연결",
    "관찰한 위치 차이를 공전과 밤의 방향으로 설명해요."
  ],
  "친구가 두 화면의 방향이 다르다고 질문했습니다. 처음 기록을 확인하고 설명을 고칠 방법을 적어요.": [
    "개념을 확인해요",
    "친구가 물은 두 화면의 방향을 처음 기록에서 다시 확인해요."
  ],
  "아직 확인하지 못한 부분은 다음 질문으로 남기고 한 일과 구별해요.": [
    "내 말로 다시 설명하기",
    "아직 확인하지 못한 부분은 다음에 알아볼 질문으로 말해요."
  ],
  "아직 못 나누었다면 그 상태와 다음에 물을 질문을 적어요.": [
    "보여 준 것과 받은 질문",
    "친구에게 자료를 보여 주고 궁금한 점을 들어요."
  ],
  "처음 기록은 남겨 두고, 고친 부분과 까닭, 다시 설명한 내용을 써요.": [
    "확인한 근거와 고친 설명",
    "처음 기록과 고친 설명을 나란히 짚고 까닭을 말해요."
  ],
  "실제 관찰이나 모형·프로그램에서 확인한 근거와 아직 모르는 점을 나누어 써요.": [
    "처음 생각과 확인한 근거",
    "관찰과 모형·프로그램에서 알게 된 것, 더 알아볼 것을 나누어 말해요."
  ],
  "두 기록의 위치 변화와 불분명한 조건을 써요.": [
    "A-2 규칙성과 더 확인할 것",
    "두 기록의 위치 변화와 다시 확인할 조건 하나를 말해요."
  ],
  "돌리는 중심·기간과 같은 지역의 빛 받음 변화를 연결해요.": [
    "B-1 자전과 낮밤 연결",
    "같은 지역의 낮과 밤이 바뀌는 까닭을 모형으로 설명해요."
  ],
  "밖에서 본 조작과 관측자 시선, 실제 천체와 다르게 단순화한 점을 써요.": [
    "B-2 관점과 모형의 한계",
    "모형 밖에서 본 조작과 지구 위 사람의 시선을 구별해요."
  ],
  "별 이름을 나열하는 대신 공전·밤에 바라보는 방향·확인한 위치를 연결해요.": [
    "C-1 지구 공전과 밤의 방향",
    "공전에 따라 밤에 보는 방향이 달라지는 모습을 짚어 말해요."
  ],
  "받은 질문과 확인/수정한 근거, 아직 이어서 할 일을 써요.": [
    "C-2 설명 카드 보완",
    "친구의 질문에 맞춰 고친 그림이나 설명을 보여 줘요."
  ]
};
const sectionCues=[
  "남쪽을 보는 사람의 왼쪽·오른쪽을 동쪽·서쪽과 연결해 짚어요.",
  "같은 밤의 두 기록에서 같은 별무리와 달라진 위치를 짚어요.",
  "전등은 고정한 채 지구와 함께 도는 사람의 시선을 비교해요.",
  "같은 지역 표시가 직접 빛을 받는지 살펴 낮·밤과 연결해요.",
  "도는 중심과 한 바퀴의 시간을 짚어 자전·공전을 구별해요.",
  "지구에서 태양 쪽을 찾고 그 반대인 한밤 방향을 짚어요.",
  "같은 장소·시각·방향에서 날짜를 바꾼 두 화면의 위치를 비교해요.",
  "하루 비교와 계절 비교의 조건을 짚어 자전·공전과 연결해요."
];
const questionCues={
  "1": "남쪽을 보는 사람의 왼쪽·오른쪽을 동쪽·서쪽과 연결해 짚어요.",
  "2": "남쪽을 보는 사람의 왼쪽·오른쪽을 동쪽·서쪽과 연결해 짚어요.",
  "3": "남쪽을 보는 사람의 왼쪽·오른쪽을 동쪽·서쪽과 연결해 짚어요.",
  "4": "남쪽을 보는 사람의 왼쪽·오른쪽을 동쪽·서쪽과 연결해 짚어요.",
  "5": "남쪽을 보는 사람의 왼쪽·오른쪽을 동쪽·서쪽과 연결해 짚어요.",
  "6": "남쪽을 보는 사람의 왼쪽·오른쪽을 동쪽·서쪽과 연결해 짚어요.",
  "7": "남쪽을 보는 사람의 왼쪽·오른쪽을 동쪽·서쪽과 연결해 짚어요.",
  "8": "남쪽을 보는 사람의 왼쪽·오른쪽을 동쪽·서쪽과 연결해 짚어요.",
  "9": "남쪽을 보는 사람의 왼쪽·오른쪽을 동쪽·서쪽과 연결해 짚어요.",
  "10": "남쪽을 보는 사람의 왼쪽·오른쪽을 동쪽·서쪽과 연결해 짚어요.",
  "11": "남쪽을 보는 사람의 왼쪽·오른쪽을 동쪽·서쪽과 연결해 짚어요.",
  "12": "남쪽을 보는 사람의 왼쪽·오른쪽을 동쪽·서쪽과 연결해 짚어요.",
  "13": "남쪽을 보는 사람의 왼쪽·오른쪽을 동쪽·서쪽과 연결해 짚어요.",
  "14": "남쪽을 보는 사람의 왼쪽·오른쪽을 동쪽·서쪽과 연결해 짚어요.",
  "15": "그림의 기준과 화살표, 짧은 이름표가 맞는지 짚어요.",
  "16": "실제 관찰 뒤 채울 칸과 미리 적을 조건을 구별해요.",
  "17": "같은 밤의 두 기록에서 같은 별무리와 달라진 위치를 짚어요.",
  "18": "같은 밤의 두 기록에서 같은 별무리와 달라진 위치를 짚어요.",
  "19": "같은 밤의 두 기록에서 같은 별무리와 달라진 위치를 짚어요.",
  "20": "같은 밤의 두 기록에서 같은 별무리와 달라진 위치를 짚어요.",
  "21": "같은 밤의 두 기록에서 같은 별무리와 달라진 위치를 짚어요.",
  "22": "같은 밤의 두 기록에서 같은 별무리와 달라진 위치를 짚어요.",
  "23": "같은 밤의 두 기록에서 같은 별무리와 달라진 위치를 짚어요.",
  "24": "같은 밤의 두 기록에서 같은 별무리와 달라진 위치를 짚어요.",
  "25": "같은 밤의 두 기록에서 같은 별무리와 달라진 위치를 짚어요.",
  "26": "같은 밤의 두 기록에서 같은 별무리와 달라진 위치를 짚어요.",
  "27": "같은 밤의 두 기록에서 같은 별무리와 달라진 위치를 짚어요.",
  "28": "같은 밤의 두 기록에서 같은 별무리와 달라진 위치를 짚어요.",
  "29": "같은 밤의 두 기록에서 같은 별무리와 달라진 위치를 짚어요.",
  "30": "같은 밤의 두 기록에서 같은 별무리와 달라진 위치를 짚어요.",
  "31": "실제 관찰 뒤 채울 칸과 미리 적을 조건을 구별해요.",
  "32": "실제 관찰 뒤 채울 칸과 미리 적을 조건을 구별해요.",
  "33": "전등은 고정한 채 지구와 함께 도는 사람의 시선을 비교해요.",
  "34": "전등은 고정한 채 지구와 함께 도는 사람의 시선을 비교해요.",
  "35": "전등은 고정한 채 지구와 함께 도는 사람의 시선을 비교해요.",
  "36": "전등은 고정한 채 지구와 함께 도는 사람의 시선을 비교해요.",
  "37": "전등은 고정한 채 지구와 함께 도는 사람의 시선을 비교해요.",
  "38": "전등은 고정한 채 지구와 함께 도는 사람의 시선을 비교해요.",
  "39": "전등은 고정한 채 지구와 함께 도는 사람의 시선을 비교해요.",
  "40": "전등은 고정한 채 지구와 함께 도는 사람의 시선을 비교해요.",
  "41": "전등은 고정한 채 지구와 함께 도는 사람의 시선을 비교해요.",
  "42": "전등은 고정한 채 지구와 함께 도는 사람의 시선을 비교해요.",
  "43": "전등은 고정한 채 지구와 함께 도는 사람의 시선을 비교해요.",
  "44": "전등은 고정한 채 지구와 함께 도는 사람의 시선을 비교해요.",
  "45": "전등은 고정한 채 지구와 함께 도는 사람의 시선을 비교해요.",
  "46": "전등은 고정한 채 지구와 함께 도는 사람의 시선을 비교해요.",
  "47": "그림의 기준과 화살표, 짧은 이름표가 맞는지 짚어요.",
  "48": "그림의 기준과 화살표, 짧은 이름표가 맞는지 짚어요.",
  "49": "같은 지역 표시가 직접 빛을 받는지 살펴 낮·밤과 연결해요.",
  "50": "같은 지역 표시가 직접 빛을 받는지 살펴 낮·밤과 연결해요.",
  "51": "같은 지역 표시가 직접 빛을 받는지 살펴 낮·밤과 연결해요.",
  "52": "같은 지역 표시가 직접 빛을 받는지 살펴 낮·밤과 연결해요.",
  "53": "같은 지역 표시가 직접 빛을 받는지 살펴 낮·밤과 연결해요.",
  "54": "같은 지역 표시가 직접 빛을 받는지 살펴 낮·밤과 연결해요.",
  "55": "같은 지역 표시가 직접 빛을 받는지 살펴 낮·밤과 연결해요.",
  "56": "같은 지역 표시가 직접 빛을 받는지 살펴 낮·밤과 연결해요.",
  "57": "같은 지역 표시가 직접 빛을 받는지 살펴 낮·밤과 연결해요.",
  "58": "같은 지역 표시가 직접 빛을 받는지 살펴 낮·밤과 연결해요.",
  "59": "같은 지역 표시가 직접 빛을 받는지 살펴 낮·밤과 연결해요.",
  "60": "같은 지역 표시가 직접 빛을 받는지 살펴 낮·밤과 연결해요.",
  "61": "같은 지역 표시가 직접 빛을 받는지 살펴 낮·밤과 연결해요.",
  "62": "같은 지역 표시가 직접 빛을 받는지 살펴 낮·밤과 연결해요.",
  "63": "그림의 기준과 화살표, 짧은 이름표가 맞는지 짚어요.",
  "64": "그림의 기준과 화살표, 짧은 이름표가 맞는지 짚어요.",
  "65": "도는 중심과 한 바퀴의 시간을 짚어 자전·공전을 구별해요.",
  "66": "도는 중심과 한 바퀴의 시간을 짚어 자전·공전을 구별해요.",
  "67": "도는 중심과 한 바퀴의 시간을 짚어 자전·공전을 구별해요.",
  "68": "도는 중심과 한 바퀴의 시간을 짚어 자전·공전을 구별해요.",
  "69": "도는 중심과 한 바퀴의 시간을 짚어 자전·공전을 구별해요.",
  "70": "도는 중심과 한 바퀴의 시간을 짚어 자전·공전을 구별해요.",
  "71": "도는 중심과 한 바퀴의 시간을 짚어 자전·공전을 구별해요.",
  "72": "도는 중심과 한 바퀴의 시간을 짚어 자전·공전을 구별해요.",
  "73": "도는 중심과 한 바퀴의 시간을 짚어 자전·공전을 구별해요.",
  "74": "도는 중심과 한 바퀴의 시간을 짚어 자전·공전을 구별해요.",
  "75": "도는 중심과 한 바퀴의 시간을 짚어 자전·공전을 구별해요.",
  "76": "도는 중심과 한 바퀴의 시간을 짚어 자전·공전을 구별해요.",
  "77": "도는 중심과 한 바퀴의 시간을 짚어 자전·공전을 구별해요.",
  "78": "도는 중심과 한 바퀴의 시간을 짚어 자전·공전을 구별해요.",
  "79": "그림의 기준과 화살표, 짧은 이름표가 맞는지 짚어요.",
  "80": "실제 관찰 뒤 채울 칸과 미리 적을 조건을 구별해요.",
  "81": "지구에서 태양 쪽을 찾고 그 반대인 한밤 방향을 짚어요.",
  "82": "지구에서 태양 쪽을 찾고 그 반대인 한밤 방향을 짚어요.",
  "83": "지구에서 태양 쪽을 찾고 그 반대인 한밤 방향을 짚어요.",
  "84": "지구에서 태양 쪽을 찾고 그 반대인 한밤 방향을 짚어요.",
  "85": "지구에서 태양 쪽을 찾고 그 반대인 한밤 방향을 짚어요.",
  "86": "지구에서 태양 쪽을 찾고 그 반대인 한밤 방향을 짚어요.",
  "87": "지구에서 태양 쪽을 찾고 그 반대인 한밤 방향을 짚어요.",
  "88": "지구에서 태양 쪽을 찾고 그 반대인 한밤 방향을 짚어요.",
  "89": "지구에서 태양 쪽을 찾고 그 반대인 한밤 방향을 짚어요.",
  "90": "지구에서 태양 쪽을 찾고 그 반대인 한밤 방향을 짚어요.",
  "91": "지구에서 태양 쪽을 찾고 그 반대인 한밤 방향을 짚어요.",
  "92": "지구에서 태양 쪽을 찾고 그 반대인 한밤 방향을 짚어요.",
  "93": "지구에서 태양 쪽을 찾고 그 반대인 한밤 방향을 짚어요.",
  "94": "지구에서 태양 쪽을 찾고 그 반대인 한밤 방향을 짚어요.",
  "95": "그림의 기준과 화살표, 짧은 이름표가 맞는지 짚어요.",
  "96": "그림의 기준과 화살표, 짧은 이름표가 맞는지 짚어요.",
  "97": "같은 장소·시각·방향에서 날짜를 바꾼 두 화면의 위치를 비교해요.",
  "98": "같은 장소·시각·방향에서 날짜를 바꾼 두 화면의 위치를 비교해요.",
  "99": "같은 장소·시각·방향에서 날짜를 바꾼 두 화면의 위치를 비교해요.",
  "100": "같은 장소·시각·방향에서 날짜를 바꾼 두 화면의 위치를 비교해요.",
  "101": "같은 장소·시각·방향에서 날짜를 바꾼 두 화면의 위치를 비교해요.",
  "102": "같은 장소·시각·방향에서 날짜를 바꾼 두 화면의 위치를 비교해요.",
  "103": "같은 장소·시각·방향에서 날짜를 바꾼 두 화면의 위치를 비교해요.",
  "104": "같은 장소·시각·방향에서 날짜를 바꾼 두 화면의 위치를 비교해요.",
  "105": "같은 장소·시각·방향에서 날짜를 바꾼 두 화면의 위치를 비교해요.",
  "106": "같은 장소·시각·방향에서 날짜를 바꾼 두 화면의 위치를 비교해요.",
  "107": "같은 장소·시각·방향에서 날짜를 바꾼 두 화면의 위치를 비교해요.",
  "108": "같은 장소·시각·방향에서 날짜를 바꾼 두 화면의 위치를 비교해요.",
  "109": "같은 장소·시각·방향에서 날짜를 바꾼 두 화면의 위치를 비교해요.",
  "110": "같은 장소·시각·방향에서 날짜를 바꾼 두 화면의 위치를 비교해요.",
  "111": "실제 관찰 뒤 채울 칸과 미리 적을 조건을 구별해요.",
  "112": "실제 관찰 뒤 채울 칸과 미리 적을 조건을 구별해요.",
  "113": "하루 비교와 계절 비교의 조건을 짚어 자전·공전과 연결해요.",
  "114": "하루 비교와 계절 비교의 조건을 짚어 자전·공전과 연결해요.",
  "115": "하루 비교와 계절 비교의 조건을 짚어 자전·공전과 연결해요.",
  "116": "하루 비교와 계절 비교의 조건을 짚어 자전·공전과 연결해요.",
  "117": "하루 비교와 계절 비교의 조건을 짚어 자전·공전과 연결해요.",
  "118": "하루 비교와 계절 비교의 조건을 짚어 자전·공전과 연결해요.",
  "119": "하루 비교와 계절 비교의 조건을 짚어 자전·공전과 연결해요.",
  "120": "하루 비교와 계절 비교의 조건을 짚어 자전·공전과 연결해요.",
  "121": "하루 비교와 계절 비교의 조건을 짚어 자전·공전과 연결해요.",
  "122": "하루 비교와 계절 비교의 조건을 짚어 자전·공전과 연결해요.",
  "123": "하루 비교와 계절 비교의 조건을 짚어 자전·공전과 연결해요.",
  "124": "하루 비교와 계절 비교의 조건을 짚어 자전·공전과 연결해요.",
  "125": "하루 비교와 계절 비교의 조건을 짚어 자전·공전과 연결해요.",
  "126": "하루 비교와 계절 비교의 조건을 짚어 자전·공전과 연결해요.",
  "127": "그림의 기준과 화살표, 짧은 이름표가 맞는지 짚어요.",
  "128": "그림의 기준과 화살표, 짧은 이름표가 맞는지 짚어요."
};
const clone=x=>JSON.parse(JSON.stringify(x));
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const banks=new WeakMap(),books=new WeakMap(),labels={choice:'객관식',blank:'빈칸 넣기',short:'단답형',written:'까닭 설명',draw:'그림 설명'};
const response=e=>e.contract?clone(e.contract):{kind:Object.hasOwn(e,'drawingExplanationLines')?'drawing':'written-explanation',teacherRequired:true,actualPerformanceMustNotBeInferred:true,sample:e.answer,required:[...e.required]};
function answerContract(e){const c=response(e);return{type:e.form==='choice'?'single-choice':e.contract?'short-text':'written-explanation',...(e.form==='choice'?{answer:e.key,accepted:[e.key]}:e.contract?{answer:e.answer,accepted:c.accepted||[e.answer],inputHint:c.parts?'빈칸의 답을 쉼표로 나누어 차례대로 써요.':'짧은 낱말로 답해요.'}:{sample:e.answer,teacherRequired:true,reviewRequired:true,rubric:{required:[...e.required],pass:'뜻이 같은 짧은 답과 알맞은 이름표는 교사가 확인해요.'}}),earthAuthoredContract:c};}
export function earthMotionGuidedItems(rows,u){
 if(u!==unit||!rows?.length)return rows;let changed=false;
 const next=rows.map(q=>{const e=bankReview[q.id];if(!e||q.status!=='authored'||q.sourceRef?.type!=='authored-supplement'||!e.before.includes(fingerprint(q)))return q;changed=true;if(banks.has(q))return banks.get(q);
 const result={...q,prompt:e.prompt,explanation:e.explanation,misconception:e.misconception,responseContract:response(e),answerContract:answerContract(e),...(q.diagnosticOverride?{diagnosticOverride:{...q.diagnosticOverride,version:EARTH_MOTION_GUIDED_VERSION}}:{}),...(e.form?{bookResponseForm:e.form,taxonomy:{...q.taxonomy,format:labels[e.form]},choices:e.choices?clone(e.choices):null,diagnosticOverride:{version:EARTH_MOTION_GUIDED_VERSION,distractors:null,typed:null,cloze:null,cells:null}}:{}),earthMotionGuidedResponse:EARTH_MOTION_GUIDED_VERSION,contentVersion:EARTH_MOTION_GUIDED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};banks.set(q,result);return result;});return changed?next:rows;
}
export function withEarthMotionGuidedClassroom(u,mod){if(u!==unit)return mod;const classroomItems=earthMotionGuidedItems(mod?.classroomItems,u);return classroomItems===mod.classroomItems?mod:{...mod,classroomItems};}
export function withEarthMotionGuidedWorkbook(w){
 if(w?.unit!==unit||fingerprint(w)!==prior)return w;if(books.has(w))return books.get(w);
 const questions=w.questions.map(q=>{const e=review[q.no];if(!e||fingerprint(q)!==e.before)return q;const result={...q,prompt:e.prompt,answer:e.answer,explanation:e.explanation,misconception:e.misconception,requirements:[...e.required],criteria:e.required.join(' / '),responseContract:response(e),earthMotionGuidedResponse:EARTH_MOTION_GUIDED_VERSION,contentVersion:EARTH_MOTION_GUIDED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};for(const k of['form','choices','key','lines','drawingPanels','drawingExplanationLines'])if(Object.hasOwn(e,k))result[k]=clone(e[k]);if(!e.form)result.formLabel=Object.hasOwn(e,'drawingExplanationLines')?'그림으로 나타내기':'짧게 설명하기';if(e.form){result.bookResponseForm=e.form;result.formLabel=labels[e.form];delete result.lines;}return result;});
 const rewritten=w.pages.map((p,i)=>({...p,blocks:p.blocks.flatMap(b=>b.type==='field'&&!b.draw?[{type:'heading',text:fields[b.hint][0]},{type:'text',text:fields[b.hint][1]}]:[b]),rail:p.rail.map(n=>{if(n.title!=='내가 정리할 것')return n;const ids=p.blocks.flatMap(b=>b.ids||[]),first=ids.length?Number(ids[0].slice(-3)):null,section=first?Math.floor((first-1)/16):Math.min(7,Math.max(0,Math.floor((i-2)/15)));return{...Object.fromEntries(Object.entries(n).filter(([k])=>k!=='write')),text:first?questionCues[first]:sectionCues[section]};})}));
 const separated=rewritten.flatMap(p=>{const draw=p.blocks.filter(b=>b.type==='field'&&b.draw);if(!draw.length)return[p];return[{...p,blocks:p.blocks.filter(b=>!draw.includes(b))},...draw.map(b=>({...p,title:b.title,blocks:[b]}))];});
 const packs={"student":[[1,2],[3,4],[5,6],[7],[8,9],[10,11],[12,13,14],[15],[16],[17,18],[19,20],[21,22],[23],[24,25],[26,27],[28,29,30],[31],[32],[33,34],[35,36],[37,38],[39],[40,41],[42,43],[44,45,46],[47],[48],[49,50],[51,52],[53,54],[55],[56,57],[58,59],[60,61,62],[63],[64],[65,66],[67,68],[69,70],[71],[72,73],[74,75],[76,77,78],[79],[80],[81,82],[83,84],[85,86],[87],[88,89],[90,91],[92,93],[94],[95],[96],[97,98],[99,100],[101,102],[103],[104,105],[106,107],[108,109,110],[111],[112],[113,114],[115,116],[117,118],[119],[120],[121,122],[123],[124,125,126],[127],[128]],"teacher":[[1,2],[3,4],[5,6,7],[8,9],[10,11],[12,13],[14],[15],[16],[17],[18,19],[20,21],[22,23],[24,25],[26,27],[28,29],[30],[31],[32],[33,34],[35,36],[37,38,39],[40,41],[42,43],[44,45,46],[47],[48],[49,50],[51,52],[53,54],[55,56],[57,58],[59,60],[61,62],[63],[64],[65,66],[67,68],[69,70],[71,72],[73,74],[75,76],[77,78],[79],[80],[81,82],[83,84],[85,86],[87],[88,89],[90,91],[92,93],[94],[95],[96],[97,98],[99,100],[101,102],[103,104],[105,106],[107],[108,109,110],[111],[112],[113,114],[115,116],[117,118],[119],[120,121],[122,123],[124,125,126],[127],[128]]};
 const ids=ps=>ps.flatMap(p=>p.blocks.flatMap(b=>b.ids||[]));
 const arrange=groups=>{const out=[];let i=0;while(i<separated.length){if(!separated[i].blocks.every(b=>b.type==='questions')){out.push(separated[i++]);continue;}const run=[];while(i<separated.length&&separated[i].blocks.every(b=>b.type==='questions'))run.push(separated[i++]);const ns=ids(run).map(id=>Number(id.slice(-3))),selected=groups.filter(g=>ns.includes(g[0]));if(JSON.stringify(selected.flat())!==JSON.stringify(ns))throw Error('지구의 운동 문항 묶음의 순서가 달라요.');for(const group of selected){const first=group[0],base=run.find(p=>ids([p]).includes(questions[first-1].id));out.push({...base,section:`연습 ${first}${group.length>1?'~'+group.at(-1):''}`,blocks:[{type:'questions',ids:group.map(n=>questions[n-1].id)}],rail:base.rail.map(n=>n.title==='내가 정리할 것'?{...n,text:questionCues[first]}:n)});}}return out;};
 const pages=arrange(packs.student),teacherStudentPages=arrange(packs.teacher);if(JSON.stringify(ids(pages))!==JSON.stringify(ids(w.pages))||JSON.stringify(ids(teacherStudentPages))!==JSON.stringify(ids(w.pages)))throw Error('지구의 운동 문항의 순서가 달라요.');
 const figures={...w.figures},byNo=new Map(questions.map(q=>[q.no,q]));for(const key of w.quickPages.flatMap(p=>p.blocks.filter(b=>b.type==='diagram').map(b=>b.key)))figures[key]=figures[key].replace(/(<tr><th scope="row">)(\d+)(<\/th><td>)([\s\S]*?)(<\/td><td>)([\s\S]*?)(<\/td><\/tr>)/g,(row,a,n,b,form,c,answer,d)=>{const q=byNo.get(Number(n));return review[n]||q.form==='choice'?a+n+b+labels[q.form]+c+(q.form==='choice'?'①②③④⑤'[q.key]:q.answer)+d:row;});
 const result={...w,questions,pages,teacherStudentPages,figures};books.set(w,result);return result;
}
