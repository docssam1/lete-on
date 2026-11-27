// Keep real indicator observations and investigation; vary how children answer.
export const ACID_MIXED_VERSION='20261124-acid-mixed-responses';
const unit='c22-s61-u01',prior='5e52e43e0af482f0';
const review={
  "4": {
    "prompt": "선생님이 산성 용액과 염기성 용액을 섞을 때 지시약의 색이 어떻게 될지 예상해 보세요. 짧게 쓰거나 짝과 말해요.",
    "answer": "색이 달라질 것 같아요. 조금씩 넣을 때의 색을 보고 싶어요.",
    "explanation": "이것은 실험 전 예상이에요. 선생님이 준비한 묽은 용액의 시범을 보고 조금씩 넣은 양과 지시약의 색 변화를 차례로 관찰해요.",
    "required": [
      "실험 전 예상으로 말하거나 짧게 표현"
    ],
    "misconception": "배우기 전 예상을 실험 결과로 기록하지 않아요.",
    "lines": 1,
    "before": "62d81ac299afa630"
  },
  "10": {
    "prompt": "겉보기가 비슷한 두 용액을 지시약으로 구별하려고 해요. 무엇을 비교할까요?",
    "answer": "②",
    "explanation": "같은 지시약의 처음 색과 용액을 넣은 뒤의 색을 비교해요. 병의 모양이나 이름표로 용액의 성질을 정하지 않아요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "지시약을 쓰는 것만으로 조건 차이가 저절로 없어지지는 않아요.",
    "form": "choice",
    "choices": [
      "용액에 붙인 이름표의 크기",
      "같은 지시약을 넣기 전과 뒤의 색",
      "용액을 담은 병의 모양"
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "71a56705f909d233"
  },
  "22": {
    "prompt": "염기성 용액인지 확인해요. 붉은 리트머스 시험지가 (1)[ ] 변하는지 살펴요. 보기: 푸르게·붉게",
    "answer": "푸르게",
    "explanation": "붉은 리트머스 시험지가 푸르게 변하면 염기성으로 분류할 수 있어요. 푸른 시험지가 그대로였다는 사실만으로 정하지 않아요.",
    "required": [
      "빈칸에 알맞은 낱말"
    ],
    "misconception": "가능한 결과 하나를 유일한 분류 근거로 쓰지 않아요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "푸르게",
            "푸른색으로",
            "파랗게",
            "파란색으로"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "7ac2606a692c3458"
  },
  "28": {
    "prompt": "두 용액에 페놀프탈레인을 넣었더니 둘 다 무색이에요. 성질을 더 구별하려면 무엇을 쓸까요?",
    "answer": "①",
    "explanation": "페놀프탈레인이 무색인 용액을 모두 같은 성질로 정하지 않아요. 리트머스 시험지 등 다른 지시약으로 더 살펴요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "하나의 검사에서 구별되지 않음과 완전히 같음은 달라요.",
    "form": "choice",
    "choices": [
      "리트머스 시험지",
      "병에 붙인 이름표",
      "시험관의 받침대"
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "f8ead93d6f373a43"
  },
  "40": {
    "prompt": "대리석은 산성 용액과 반응했어요. 조각상도 같은 반응을 할지 알아보려면 무엇을 조사할까요?",
    "answer": "③",
    "explanation": "모든 돌을 대리석과 같다고 할 수 없어요. 실제 돌을 이루는 성분을 알아보고 반응을 비교해요. 조각상에 직접 용액을 붓지 않아요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "실험에서 본 변화가 특정 문화재 피해 원인을 이미 증명한 것은 아니에요.",
    "form": "choice",
    "choices": [
      "조각상을 세운 날",
      "조각상의 이름",
      "조각상을 만든 돌의 성분"
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "1bc31ffb900cb939"
  },
  "46": {
    "prompt": "달걀 흰자와 껍데기를 서로 다른 용액에서 관찰했어요. 결과를 어떻게 적을까요?",
    "answer": "②",
    "explanation": "흰자와 껍데기는 성분이 다른 재료예요. 재료·용액·시간을 구별하여 실제 관찰한 결과를 각각 남겨요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "같은 달걀에서 나온 재료라는 이유로 모든 반응을 같게 보지 않아요.",
    "form": "choice",
    "choices": [
      "두 재료의 결과를 한 칸에 합친다.",
      "흰자와 껍데기의 결과를 각각 적는다.",
      "예상과 다른 결과는 지운다."
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "44f6c4456c1c4edb"
  },
  "58": {
    "prompt": "자료에는 산성 세척액이 탄산 칼슘 침전물과 반응한다고 나와 있어요. (1)[ ] 용액이 탄산 칼슘과 반응하는 성질을 이용한 예예요. 보기: 산성·염기성",
    "answer": "산성",
    "explanation": "자료에서 설명한 산성 용액과 탄산 칼슘의 반응을 세척에 이용한 예예요. 모든 재질에 사용할 수 있다는 뜻은 아니에요.",
    "required": [
      "빈칸에 알맞은 낱말"
    ],
    "misconception": "제공한 세척 사례를 가정의 약품 혼합/사용 실험 지시로 바꾸지 않아요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "산성"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "730aad6fec448901"
  },
  "64": {
    "prompt": "산성비가 숲에 미치는 영향을 조사해요. 나무의 모습과 함께 살펴볼 대상으로 알맞은 것은 무엇인가요?",
    "answer": "①",
    "explanation": "나무의 모습과 함께 그 지역의 빗물·토양 등 생장 환경 자료를 살펴요. 나무 사진 한 장만으로 원인을 정하지 않아요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "나무 한 그루가 약해 보이는 사진만으로 산성비가 유일한 원인이라고 정하지 않아요.",
    "form": "choice",
    "choices": [
      "그 지역의 토양과 빗물",
      "나무에 붙인 번호표의 글꼴",
      "사진을 보관한 폴더의 이름"
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "096a7707f13933d9"
  },
  "68": {
    "prompt": "1모둠은 용액 5mL에 지시약 1방울, 2모둠은 용액 10mL에 지시약 4방울을 넣었어요. 다시 비교할 때 (1)[ ]의 양과 (2)[ ]의 양을 같게 맞추어요. 보기: 용액·지시약",
    "answer": "용액 / 지시약",
    "explanation": "두 모둠은 용액과 지시약의 양이 모두 달라요. 같은 용액의 색을 비교하려면 두 양을 각각 같게 맞추어요. 실제로 본 기록은 지우지 않아요.",
    "required": [
      "빈칸에 알맞은 낱말"
    ],
    "misconception": "양이 다른 지시약 실험의 색 차이를 시료 종류의 차이로만 돌리지 않아요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "용액"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "지시약"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "3da12fd7b8597acd"
  },
  "72": {
    "prompt": "세 용액의 마지막 색만 적혀 있어요. 어느 용액에 염산을 가장 많이 넣었는지 알려면 어떤 기록이 더 필요할까요?",
    "answer": "③",
    "explanation": "마지막 색만으로 넣은 양을 알아낼 수 없어요. 교사가 실제로 넣은 염산의 양을 기록한 표가 필요해요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "색을 정해진 첨가 방울 수나 부피의 눈금으로 사용하지 않아요.",
    "form": "choice",
    "choices": [
      "용액 병에 붙인 번호",
      "가장 마음에 드는 색",
      "실제로 넣은 염산의 양"
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "74345deb0f2cbdf9"
  },
  "76": {
    "prompt": "흰자는 8분, 껍데기는 2분 동안 서로 다른 용액에 넣었어요. 시간과 용액 외에도 넣은 (1)[ ]가 달라요. 보기: 재료·관찰자",
    "answer": "재료",
    "explanation": "흰자와 껍데기는 서로 다른 재료예요. 시간·용액도 다르므로 이 결과만으로 한 조건의 효과를 정하지 않아요.",
    "required": [
      "빈칸에 알맞은 낱말"
    ],
    "misconception": "흰자와 껍데기를 같은 재료로 보거나 관찰 시간의 차이를 무시하지 않아요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "재료"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "ae74ab554b58539b"
  },
  "80": {
    "prompt": "해양 산성화가 조개에게 미치는 영향을 조사해요. 조개의 (1)[ ]가 만들어지고 유지되는 모습을 자료에서 살펴요. 보기: 껍데기·이름표",
    "answer": "껍데기",
    "explanation": "조개 껍데기의 형성·유지와 성장에 관한 자료를 살펴요. 그림의 모양만으로 실제 변화의 원인이나 속도를 정하지 않아요.",
    "required": [
      "빈칸에 알맞은 낱말"
    ],
    "misconception": "모든 바다와 모든 생물이 같은 영향을 겪는다고 단정하지 않아요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "껍데기",
            "껍질"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "1eb057c4c9c77322"
  },
  "83": {
    "prompt": "두 용액을 리트머스 시험지로 비교해요. 앞 용액이 다음 용액에 섞이지 않게 하려면 어떻게 할까요?",
    "answer": "①",
    "explanation": "관찰할 용액이 서로 섞이지 않도록 깨끗한 도구를 구별해 써요. 교사가 준비한 용액으로 정해진 관찰을 해요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "이미 젖은 종이를 다른 시료에 재사용하는 계획은 시료 혼입을 일으켜요.",
    "form": "choice",
    "choices": [
      "용액마다 깨끗한 도구를 따로 쓴다.",
      "같은 도구에 용액을 묻힌 채 계속 쓴다.",
      "두 용액을 미리 한 병에 합친다."
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "800a03ee54a460b4"
  },
  "88": {
    "prompt": "관찰한 시간 동안 기포가 잘 보이지 않았어요. 실제로 본 결과를 바르게 적은 것은 무엇인가요?",
    "answer": "②",
    "explanation": "관찰한 시간과 잘 보이지 않은 결과를 그대로 적어요. 앞으로도 반응이 없을 것이라거나 보지 못한 기포가 있었다고 바꾸지 않아요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "기포가 잘 안 보인 시료를 성질이 전혀 없는 물질이라고 부르지 않아요.",
    "form": "choice",
    "choices": [
      "앞으로도 반응은 일어나지 않는다.",
      "그 시간 동안 기포가 뚜렷하게 보이지 않았다.",
      "보지 못했지만 기포가 많이 생겼다고 적는다."
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "79b14ce3afa4d2c5"
  },
  "91": {
    "prompt": "같은 혼합 실험을 다시 비교해요. 처음 (1)[ ]의 양과 (2)[ ]의 양을 각각 같게 맞추어요. 보기: 용액·지시약",
    "answer": "용액 / 지시약",
    "explanation": "처음 용액과 지시약의 종류·양 등 비교할 조건을 맞추어요. 같은 부피로 섞는 것만으로 언제나 같은 색이 된다고 정하지 않아요.",
    "required": [
      "빈칸에 알맞은 낱말"
    ],
    "misconception": "반복 횟수만 늘려도 처음 조건의 차이가 사라진다고 하지 않아요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "용액"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "지시약"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "b5e83efd7a2abe0f"
  },
  "96": {
    "prompt": "약해진 나무의 사진이 있어요. 산성비의 영향인지 더 알아보려면 그 지역의 어떤 자료를 찾을까요?",
    "answer": "③",
    "explanation": "나무의 모습만으로 원인을 정하기 어려워요. 같은 지역·시기의 빗물·토양과 다른 생장 조건 자료를 더 살펴요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "사진 한 장으로 피해의 원인이 하나라고 확정하지 않아요.",
    "form": "choice",
    "choices": [
      "나무 사진 파일의 크기",
      "다른 나라 숲의 관광 광고",
      "빗물과 토양을 조사한 자료"
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "b5b620fcb28464a2"
  },
  "100": {
    "prompt": "푸른 리트머스 시험지가 붉게 변했어요. 이 용액은 (1)[ ]으로 분류해요. 보기: 산성·염기성",
    "answer": "산성",
    "explanation": "푸른 리트머스 시험지가 붉게 변한 결과를 근거로 산성으로 분류해요. 지시약의 이름과 처음·나중 색을 연결해요.",
    "required": [
      "빈칸에 알맞은 낱말"
    ],
    "misconception": "색 기준을 외운 것과 조건을 읽어 적용한 것은 구별해요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "산성"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "0db383071a0b69e9"
  },
  "111": {
    "prompt": "페놀프탈레인이 무색인 용액이 있어요. 산성인지 더 알아보려면 푸른 리트머스 시험지가 (1)[ ] 변하는지 보아요. 보기: 붉게·푸르게",
    "answer": "붉게",
    "explanation": "페놀프탈레인이 무색이라는 결과만으로 산성이라고 정하지 않아요. 푸른 리트머스 시험지가 붉게 변하는지 더 확인해요.",
    "required": [
      "빈칸에 알맞은 낱말"
    ],
    "misconception": "다른 근거를 보지 않고 무색인 시료를 모두 같은 산성 범주로 넣지 않아요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "붉게",
            "붉은색으로",
            "빨갛게",
            "빨간색으로"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "4d0887ceffa2b4bc"
  },
  "120": {
    "prompt": "약해진 나무 사진 한 장으로 알 수 있는 것을 고르세요.",
    "answer": "②",
    "explanation": "사진은 그때 보이는 나무의 모습을 알려 줘요. 산성비라는 원인을 알아보려면 지역·시기의 환경 자료와 다른 원인도 더 조사해요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "피해처럼 보이는 모습을 발견한 것과 원인을 분리해 증명한 것은 달라요.",
    "form": "choice",
    "choices": [
      "나무가 약해진 원인은 반드시 산성비다.",
      "그때 사진에 담긴 나무의 모습이다.",
      "그 지역의 빗물과 토양의 성질을 모두 안다."
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "b3d57c5d8a8cf18b"
  },
  "123": {
    "prompt": "두 모둠은 마지막 색을 다르게 적었고, 넣은 양은 적지 않았어요. 기록에서 확실히 다른 것은 색과 넣은 양 중 무엇인가요?",
    "answer": "색",
    "explanation": "실제로 기록된 차이는 마지막 색이에요. 넣은 양의 기록이 없으므로 어느 모둠이 더 넣었는지는 알 수 없어요.",
    "required": [
      "질문에 맞는 짧은 낱말"
    ],
    "misconception": "다른 색이라는 결과만으로 첨가량이나 성질 세기의 순위를 만들지 않아요.",
    "form": "short",
    "contract": {
      "kind": "short-text",
      "accepted": [
        "색",
        "마지막 색",
        "지시약의 색"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "a31464f9d843b18b"
  },
  "127": {
    "prompt": "페놀프탈레인으로 색을 구별하기 어려웠어요. 붉은 것과 푸른 것이 있는 다른 시험지의 이름을 쓰세요.",
    "answer": "리트머스 시험지",
    "explanation": "다른 지시약인 리트머스 시험지로 더 살펴볼 수 있어요. 선생님이 준비한 용액과 깨끗한 도구로 처음·나중 색을 구별해 관찰해요.",
    "required": [
      "질문에 맞는 짧은 낱말"
    ],
    "misconception": "실행 가능한 계획과 이미 실행한 결과를 한 상태로 표시하지 않아요.",
    "form": "short",
    "contract": {
      "kind": "short-text",
      "accepted": [
        "리트머스 시험지",
        "리트머스 종이",
        "리트머스"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "3bf8f2e7e3e1e495"
  }
};
const bankReview={
  "c22-s61-u01-b004": {
    "prompt": "선생님이 산성 용액과 염기성 용액을 섞을 때 지시약의 색이 어떻게 될지 예상해 보세요. 짧게 쓰거나 짝과 말해요.",
    "answer": "색이 달라질 것 같아요. 조금씩 넣을 때의 색을 보고 싶어요.",
    "explanation": "이것은 실험 전 예상이에요. 선생님이 준비한 묽은 용액의 시범을 보고 조금씩 넣은 양과 지시약의 색 변화를 차례로 관찰해요.",
    "required": [
      "실험 전 예상으로 말하거나 짧게 표현"
    ],
    "misconception": "배우기 전 예상을 실험 결과로 기록하지 않아요.",
    "lines": 1,
    "before": [
      "04b7c6d69661864c"
    ]
  },
  "c22-s61-u01-b010": {
    "prompt": "겉보기가 비슷한 두 용액을 지시약으로 구별하려고 해요. 무엇을 비교할까요?",
    "answer": "②",
    "explanation": "같은 지시약의 처음 색과 용액을 넣은 뒤의 색을 비교해요. 병의 모양이나 이름표로 용액의 성질을 정하지 않아요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "지시약을 쓰는 것만으로 조건 차이가 저절로 없어지지는 않아요.",
    "form": "choice",
    "choices": [
      "용액에 붙인 이름표의 크기",
      "같은 지시약을 넣기 전과 뒤의 색",
      "용액을 담은 병의 모양"
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "20f73283c4f8fc21"
    ]
  },
  "c22-s61-u01-b022": {
    "prompt": "염기성 용액인지 확인해요. 붉은 리트머스 시험지가 (1)[ ] 변하는지 살펴요. 보기: 푸르게·붉게",
    "answer": "푸르게",
    "explanation": "붉은 리트머스 시험지가 푸르게 변하면 염기성으로 분류할 수 있어요. 푸른 시험지가 그대로였다는 사실만으로 정하지 않아요.",
    "required": [
      "빈칸에 알맞은 낱말"
    ],
    "misconception": "가능한 결과 하나를 유일한 분류 근거로 쓰지 않아요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "푸르게",
            "푸른색으로",
            "파랗게",
            "파란색으로"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "c047b0b7a2248b7d"
    ]
  },
  "c22-s61-u01-b028": {
    "prompt": "두 용액에 페놀프탈레인을 넣었더니 둘 다 무색이에요. 성질을 더 구별하려면 무엇을 쓸까요?",
    "answer": "①",
    "explanation": "페놀프탈레인이 무색인 용액을 모두 같은 성질로 정하지 않아요. 리트머스 시험지 등 다른 지시약으로 더 살펴요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "하나의 검사에서 구별되지 않음과 완전히 같음은 달라요.",
    "form": "choice",
    "choices": [
      "리트머스 시험지",
      "병에 붙인 이름표",
      "시험관의 받침대"
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "33c0ff288702c70a"
    ]
  },
  "c22-s61-u01-b040": {
    "prompt": "대리석은 산성 용액과 반응했어요. 조각상도 같은 반응을 할지 알아보려면 무엇을 조사할까요?",
    "answer": "③",
    "explanation": "모든 돌을 대리석과 같다고 할 수 없어요. 실제 돌을 이루는 성분을 알아보고 반응을 비교해요. 조각상에 직접 용액을 붓지 않아요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "실험에서 본 변화가 특정 문화재 피해 원인을 이미 증명한 것은 아니에요.",
    "form": "choice",
    "choices": [
      "조각상을 세운 날",
      "조각상의 이름",
      "조각상을 만든 돌의 성분"
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "bafb5863ec2a857d"
    ]
  },
  "c22-s61-u01-b046": {
    "prompt": "달걀 흰자와 껍데기를 서로 다른 용액에서 관찰했어요. 결과를 어떻게 적을까요?",
    "answer": "②",
    "explanation": "흰자와 껍데기는 성분이 다른 재료예요. 재료·용액·시간을 구별하여 실제 관찰한 결과를 각각 남겨요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "같은 달걀에서 나온 재료라는 이유로 모든 반응을 같게 보지 않아요.",
    "form": "choice",
    "choices": [
      "두 재료의 결과를 한 칸에 합친다.",
      "흰자와 껍데기의 결과를 각각 적는다.",
      "예상과 다른 결과는 지운다."
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "b9def73e05a73cf0"
    ]
  },
  "c22-s61-u01-b058": {
    "prompt": "자료에는 산성 세척액이 탄산 칼슘 침전물과 반응한다고 나와 있어요. (1)[ ] 용액이 탄산 칼슘과 반응하는 성질을 이용한 예예요. 보기: 산성·염기성",
    "answer": "산성",
    "explanation": "자료에서 설명한 산성 용액과 탄산 칼슘의 반응을 세척에 이용한 예예요. 모든 재질에 사용할 수 있다는 뜻은 아니에요.",
    "required": [
      "빈칸에 알맞은 낱말"
    ],
    "misconception": "제공한 세척 사례를 가정의 약품 혼합/사용 실험 지시로 바꾸지 않아요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "산성"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "ec8a2a7d94af4ae7"
    ]
  },
  "c22-s61-u01-b064": {
    "prompt": "산성비가 숲에 미치는 영향을 조사해요. 나무의 모습과 함께 살펴볼 대상으로 알맞은 것은 무엇인가요?",
    "answer": "①",
    "explanation": "나무의 모습과 함께 그 지역의 빗물·토양 등 생장 환경 자료를 살펴요. 나무 사진 한 장만으로 원인을 정하지 않아요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "나무 한 그루가 약해 보이는 사진만으로 산성비가 유일한 원인이라고 정하지 않아요.",
    "form": "choice",
    "choices": [
      "그 지역의 토양과 빗물",
      "나무에 붙인 번호표의 글꼴",
      "사진을 보관한 폴더의 이름"
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "20d4adaa082669b4"
    ]
  },
  "c22-s61-u01-b068": {
    "prompt": "1모둠은 용액 5mL에 지시약 1방울, 2모둠은 용액 10mL에 지시약 4방울을 넣었어요. 다시 비교할 때 (1)[ ]의 양과 (2)[ ]의 양을 같게 맞추어요. 보기: 용액·지시약",
    "answer": "용액 / 지시약",
    "explanation": "두 모둠은 용액과 지시약의 양이 모두 달라요. 같은 용액의 색을 비교하려면 두 양을 각각 같게 맞추어요. 실제로 본 기록은 지우지 않아요.",
    "required": [
      "빈칸에 알맞은 낱말"
    ],
    "misconception": "양이 다른 지시약 실험의 색 차이를 시료 종류의 차이로만 돌리지 않아요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "용액"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "지시약"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "5c7a2eef053c5691",
      "6a77eeaedb4aea7c"
    ]
  },
  "c22-s61-u01-b072": {
    "prompt": "세 용액의 마지막 색만 적혀 있어요. 어느 용액에 염산을 가장 많이 넣었는지 알려면 어떤 기록이 더 필요할까요?",
    "answer": "③",
    "explanation": "마지막 색만으로 넣은 양을 알아낼 수 없어요. 교사가 실제로 넣은 염산의 양을 기록한 표가 필요해요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "색을 정해진 첨가 방울 수나 부피의 눈금으로 사용하지 않아요.",
    "form": "choice",
    "choices": [
      "용액 병에 붙인 번호",
      "가장 마음에 드는 색",
      "실제로 넣은 염산의 양"
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "e6c4a4fa17210a68"
    ]
  },
  "c22-s61-u01-b076": {
    "prompt": "흰자는 8분, 껍데기는 2분 동안 서로 다른 용액에 넣었어요. 시간과 용액 외에도 넣은 (1)[ ]가 달라요. 보기: 재료·관찰자",
    "answer": "재료",
    "explanation": "흰자와 껍데기는 서로 다른 재료예요. 시간·용액도 다르므로 이 결과만으로 한 조건의 효과를 정하지 않아요.",
    "required": [
      "빈칸에 알맞은 낱말"
    ],
    "misconception": "흰자와 껍데기를 같은 재료로 보거나 관찰 시간의 차이를 무시하지 않아요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "재료"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "54525bcc5ef084c6"
    ]
  },
  "c22-s61-u01-b080": {
    "prompt": "해양 산성화가 조개에게 미치는 영향을 조사해요. 조개의 (1)[ ]가 만들어지고 유지되는 모습을 자료에서 살펴요. 보기: 껍데기·이름표",
    "answer": "껍데기",
    "explanation": "조개 껍데기의 형성·유지와 성장에 관한 자료를 살펴요. 그림의 모양만으로 실제 변화의 원인이나 속도를 정하지 않아요.",
    "required": [
      "빈칸에 알맞은 낱말"
    ],
    "misconception": "모든 바다와 모든 생물이 같은 영향을 겪는다고 단정하지 않아요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "껍데기",
            "껍질"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "4808d7d012a77182"
    ]
  },
  "c22-s61-u01-b083": {
    "prompt": "두 용액을 리트머스 시험지로 비교해요. 앞 용액이 다음 용액에 섞이지 않게 하려면 어떻게 할까요?",
    "answer": "①",
    "explanation": "관찰할 용액이 서로 섞이지 않도록 깨끗한 도구를 구별해 써요. 교사가 준비한 용액으로 정해진 관찰을 해요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "이미 젖은 종이를 다른 시료에 재사용하는 계획은 시료 혼입을 일으켜요.",
    "form": "choice",
    "choices": [
      "용액마다 깨끗한 도구를 따로 쓴다.",
      "같은 도구에 용액을 묻힌 채 계속 쓴다.",
      "두 용액을 미리 한 병에 합친다."
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "9914520ba6869941"
    ]
  },
  "c22-s61-u01-b088": {
    "prompt": "관찰한 시간 동안 기포가 잘 보이지 않았어요. 실제로 본 결과를 바르게 적은 것은 무엇인가요?",
    "answer": "②",
    "explanation": "관찰한 시간과 잘 보이지 않은 결과를 그대로 적어요. 앞으로도 반응이 없을 것이라거나 보지 못한 기포가 있었다고 바꾸지 않아요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "기포가 잘 안 보인 시료를 성질이 전혀 없는 물질이라고 부르지 않아요.",
    "form": "choice",
    "choices": [
      "앞으로도 반응은 일어나지 않는다.",
      "그 시간 동안 기포가 뚜렷하게 보이지 않았다.",
      "보지 못했지만 기포가 많이 생겼다고 적는다."
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "ef2b6f79501ccacb"
    ]
  },
  "c22-s61-u01-b091": {
    "prompt": "같은 혼합 실험을 다시 비교해요. 처음 (1)[ ]의 양과 (2)[ ]의 양을 각각 같게 맞추어요. 보기: 용액·지시약",
    "answer": "용액 / 지시약",
    "explanation": "처음 용액과 지시약의 종류·양 등 비교할 조건을 맞추어요. 같은 부피로 섞는 것만으로 언제나 같은 색이 된다고 정하지 않아요.",
    "required": [
      "빈칸에 알맞은 낱말"
    ],
    "misconception": "반복 횟수만 늘려도 처음 조건의 차이가 사라진다고 하지 않아요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "용액"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "지시약"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "a605a51ca6c28cce"
    ]
  },
  "c22-s61-u01-b096": {
    "prompt": "약해진 나무의 사진이 있어요. 산성비의 영향인지 더 알아보려면 그 지역의 어떤 자료를 찾을까요?",
    "answer": "③",
    "explanation": "나무의 모습만으로 원인을 정하기 어려워요. 같은 지역·시기의 빗물·토양과 다른 생장 조건 자료를 더 살펴요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "사진 한 장으로 피해의 원인이 하나라고 확정하지 않아요.",
    "form": "choice",
    "choices": [
      "나무 사진 파일의 크기",
      "다른 나라 숲의 관광 광고",
      "빗물과 토양을 조사한 자료"
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "aa1d958bda532c99"
    ]
  },
  "c22-s61-u01-b100": {
    "prompt": "푸른 리트머스 시험지가 붉게 변했어요. 이 용액은 (1)[ ]으로 분류해요. 보기: 산성·염기성",
    "answer": "산성",
    "explanation": "푸른 리트머스 시험지가 붉게 변한 결과를 근거로 산성으로 분류해요. 지시약의 이름과 처음·나중 색을 연결해요.",
    "required": [
      "빈칸에 알맞은 낱말"
    ],
    "misconception": "색 기준을 외운 것과 조건을 읽어 적용한 것은 구별해요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "산성"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "3c1cf8392996009b"
    ]
  },
  "c22-s61-u01-b111": {
    "prompt": "페놀프탈레인이 무색인 용액이 있어요. 산성인지 더 알아보려면 푸른 리트머스 시험지가 (1)[ ] 변하는지 보아요. 보기: 붉게·푸르게",
    "answer": "붉게",
    "explanation": "페놀프탈레인이 무색이라는 결과만으로 산성이라고 정하지 않아요. 푸른 리트머스 시험지가 붉게 변하는지 더 확인해요.",
    "required": [
      "빈칸에 알맞은 낱말"
    ],
    "misconception": "다른 근거를 보지 않고 무색인 시료를 모두 같은 산성 범주로 넣지 않아요.",
    "form": "blank",
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "붉게",
            "붉은색으로",
            "빨갛게",
            "빨간색으로"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "60316c792b20190b"
    ]
  },
  "c22-s61-u01-b120": {
    "prompt": "약해진 나무 사진 한 장으로 알 수 있는 것을 고르세요.",
    "answer": "②",
    "explanation": "사진은 그때 보이는 나무의 모습을 알려 줘요. 산성비라는 원인을 알아보려면 지역·시기의 환경 자료와 다른 원인도 더 조사해요.",
    "required": [
      "알맞은 설명 고르기"
    ],
    "misconception": "피해처럼 보이는 모습을 발견한 것과 원인을 분리해 증명한 것은 달라요.",
    "form": "choice",
    "choices": [
      "나무가 약해진 원인은 반드시 산성비다.",
      "그때 사진에 담긴 나무의 모습이다.",
      "그 지역의 빗물과 토양의 성질을 모두 안다."
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "f6236291c6dc7c3f"
    ]
  },
  "c22-s61-u01-b123": {
    "prompt": "두 모둠은 마지막 색을 다르게 적었고, 넣은 양은 적지 않았어요. 기록에서 확실히 다른 것은 색과 넣은 양 중 무엇인가요?",
    "answer": "색",
    "explanation": "실제로 기록된 차이는 마지막 색이에요. 넣은 양의 기록이 없으므로 어느 모둠이 더 넣었는지는 알 수 없어요.",
    "required": [
      "질문에 맞는 짧은 낱말"
    ],
    "misconception": "다른 색이라는 결과만으로 첨가량이나 성질 세기의 순위를 만들지 않아요.",
    "form": "short",
    "contract": {
      "kind": "short-text",
      "accepted": [
        "색",
        "마지막 색",
        "지시약의 색"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "a78029f1e5ae51a3"
    ]
  },
  "c22-s61-u01-b127": {
    "prompt": "페놀프탈레인으로 색을 구별하기 어려웠어요. 붉은 것과 푸른 것이 있는 다른 시험지의 이름을 쓰세요.",
    "answer": "리트머스 시험지",
    "explanation": "다른 지시약인 리트머스 시험지로 더 살펴볼 수 있어요. 선생님이 준비한 용액과 깨끗한 도구로 처음·나중 색을 구별해 관찰해요.",
    "required": [
      "질문에 맞는 짧은 낱말"
    ],
    "misconception": "실행 가능한 계획과 이미 실행한 결과를 한 상태로 표시하지 않아요.",
    "form": "short",
    "contract": {
      "kind": "short-text",
      "accepted": [
        "리트머스 시험지",
        "리트머스 종이",
        "리트머스"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "0211845c18412eca"
    ]
  }
};
const questionTitles={
  "10": "지시약의 처음 색과 나중 색",
  "22": "붉은 시험지에서 확인할 변화",
  "28": "다른 지시약으로 더 살펴요",
  "40": "조각상을 만든 돌 알아보기",
  "46": "흰자와 껍데기의 기록",
  "58": "탄산 칼슘과 반응하는 성질",
  "64": "나무와 함께 조사할 환경",
  "68": "용액과 지시약의 양 맞추기",
  "72": "색과 넣은 양은 달라요",
  "76": "서로 다른 조건 찾기",
  "80": "조개 껍데기의 변화 알아보기",
  "83": "용액이 섞이지 않게 관찰하기",
  "88": "실제로 본 결과 고르기",
  "91": "처음 양을 같게 맞추어요",
  "96": "같은 지역의 자료 찾기",
  "100": "색 변화로 용액 분류하기",
  "111": "무색인 결과를 더 확인하기",
  "120": "사진으로 알 수 있는 것",
  "123": "기록된 차이 찾기",
  "127": "다른 시험지로 관찰하기"
};
const studyMethodBefore="개념과 예제를 읽고 여러 가지 문제를 풀어요. 관찰과 조사에서 알아낸 내용을 그림과 문장으로 설명하고, 다른 지시약이나 다른 조건의 결과와 비교해요.";
const clone=x=>JSON.parse(JSON.stringify(x));
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const banks=new WeakMap(),books=new WeakMap(),labels={choice:'객관식',blank:'빈칸 넣기',short:'단답형',written:'까닭 설명',draw:'그림 설명'};
const response=e=>e.contract?clone(e.contract):{kind:Object.hasOwn(e,'drawingExplanationLines')?'drawing':'written-explanation',teacherRequired:true,actualPerformanceMustNotBeInferred:true,sample:e.answer,required:[...e.required]};
function answerContract(e){const c=response(e);return{type:e.form==='choice'?'single-choice':e.contract?'short-text':'written-explanation',...(e.form==='choice'?{answer:e.key,accepted:[e.key]}:e.contract?{answer:e.answer,accepted:c.accepted||[e.answer],inputHint:c.parts?'빈칸의 답을 쉼표로 나누어 차례대로 써요.':'짧은 낱말로 답해요.'}:{sample:e.answer,teacherRequired:true,reviewRequired:true,rubric:{required:[...e.required],pass:'뜻이 같은 짧은 답과 알맞은 이름표는 교사가 확인해요.'}}),seasonContract:c};}
export function acidMixedItems(rows,u){
 if(u!==unit||!rows?.length)return rows;let changed=false;
 const next=rows.map(q=>{const e=bankReview[q.id];if(!e||q.status!=='authored'||q.sourceRef?.type!=='authored-supplement'||!e.before.includes(fingerprint(q)))return q;changed=true;if(banks.has(q))return banks.get(q);
 const result={...q,prompt:e.prompt,explanation:e.explanation,misconception:e.misconception,responseContract:response(e),answerContract:answerContract(e),...(q.diagnosticOverride?{diagnosticOverride:{...q.diagnosticOverride,version:ACID_MIXED_VERSION}}:{}),...(e.form?{bookResponseForm:e.form,taxonomy:{...q.taxonomy,format:labels[e.form]},choices:e.choices?clone(e.choices):null,diagnosticOverride:{version:ACID_MIXED_VERSION,distractors:null,typed:null,cloze:null,cells:null}}:{}),acidMixedResponse:ACID_MIXED_VERSION,contentVersion:ACID_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};banks.set(q,result);return result;});return changed?next:rows;
}
export function withAcidMixedClassroom(u,mod){if(u!==unit)return mod;const classroomItems=acidMixedItems(mod?.classroomItems,u);return classroomItems===mod.classroomItems?mod:{...mod,classroomItems};}
export function withAcidMixedWorkbook(w){
 if(w?.unit!==unit||fingerprint(w)!==prior)return w;if(books.has(w))return books.get(w);
 const questions=w.questions.map(q=>{const e=review[q.no];if(!e||fingerprint(q)!==e.before)return q;const result={...q,prompt:e.prompt,answer:e.answer,explanation:e.explanation,misconception:e.misconception,requirements:[...e.required],criteria:e.required.join(' / '),responseContract:response(e),acidMixedResponse:ACID_MIXED_VERSION,contentVersion:ACID_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};for(const k of['form','choices','key','lines'])if(Object.hasOwn(e,k))result[k]=clone(e[k]);if(e.form){result.bookResponseForm=e.form;result.formLabel=labels[e.form];delete result.lines;}return result;});
 const revisePage=p=>{const first=p.blocks.flatMap(b=>b.ids||[])[0],n=Number(first?.slice(-3));return{...p,title:questionTitles[n]||p.title,blocks:p.blocks.map(b=>b.type==='text'&&b.text===studyMethodBefore?{...b,text:'개념과 예제를 읽고 고르기·빈칸·짧은 답으로 확인해요. 핵심만 짧게 설명하고, 관찰과 조사는 표·그림·말로 나누어요.'}:b)};};
 const pages=w.pages.map(revisePage),teacherStudentPages=w.teacherStudentPages.map(revisePage),teacherPages=w.teacherPages;
 const figures={...w.figures},byNo=new Map(questions.map(q=>[q.no,q]));for(const key of w.quickPages.flatMap(p=>p.blocks.filter(b=>b.type==='diagram').map(b=>b.key)))figures[key]=figures[key].replace(/(<tr><th scope="row">)(\d+)(<\/th><td>)([\s\S]*?)(<\/td><td>)([\s\S]*?)(<\/td><\/tr>)/g,(row,a,n,b,form,c,answer,d)=>{const q=byNo.get(Number(n));return review[n]||q.form==='choice'?a+n+b+(review[n]?labels[q.form]:form)+c+(q.form==='choice'?(Array.isArray(q.key)?q.key.map(i=>'①②③④⑤'[i]).join(', '):'①②③④⑤'[q.key]):q.answer)+d:row;});
 const result={...w,questions,pages,teacherStudentPages,teacherPages,figures};books.set(w,result);return result;
}
