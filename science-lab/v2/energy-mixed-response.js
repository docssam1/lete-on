// Use brief responses for resource and energy comparisons; retain real investigations and records.
export const ENERGY_MIXED_VERSION='20261124-energy-mixed-responses';
const unit='c22-s52-u04',prior='babb268658eba838';
const review={
  "4": {
    "prompt": "태양광 발전은 밤에도 낮과 같은 양의 전기를 만들까요? 내 생각과 확인하고 싶은 것 하나를 짝과 말하거나 한 줄로 쓰세요.",
    "answer": "같은 양은 아닐 것 같아요. 빛을 받는 때를 알아보고 싶어요.",
    "explanation": "재생에너지는 자연에서 보충되는 흐름을 이용하지만 실제 이용량은 환경/시간·설비 조건에 제한되어요. 지금 생각은 학습 후 근거와 비교해요.",
    "misconception": "재생 가능과 언제나 무한한 사용은 달라요.",
    "required": [
      "처음 생각과 확인할 빛·시간 조건 하나"
    ],
    "lines": 1,
    "before": "3dfb9cfd4b4c4aeb"
  },
  "10": {
    "prompt": "공책의 종이와 철심을 어떤 재료로 만들었는지 알아볼 자료를 고르세요.",
    "answer": "①",
    "explanation": "공책의 종이와 철심을 나누어 회사 안내나 재료 표시에서 확인해요. 알아낸 내용과 아직 모르는 점을 구별해요.",
    "misconception": "추정한 재료와 본문에서 확인한 재료를 나눠요.",
    "form": "choice",
    "choices": [
      "공책을 만든 회사의 재료 안내",
      "공책을 쓰는 친구가 좋아하는 색",
      "공책 표지에 그려진 풍경"
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
    "before": "88d52c75f8f02b2f"
  },
  "22": {
    "prompt": "물건을 분리배출할 통을 모르겠어요. 우리 지역과 다른 지역 중 어느 지역의 분리배출 안내를 찾아야 할까요?",
    "answer": "우리 지역",
    "explanation": "실제로 버릴 지역의 수거·분리배출 안내를 확인해요. 재질과 오염 상태, 수거 방법도 함께 살펴요.",
    "misconception": "재활용 표시와 실제 수거/처리 가능은 구별해요.",
    "form": "short",
    "required": [
      "알맞은 낱말"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "우리 지역",
        "우리지역",
        "내가 사는 지역",
        "사는 지역",
        "해당 지역",
        "버릴 지역",
        "물건을 버릴 지역"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "f30a0292321cb81c"
  },
  "28": {
    "prompt": "태양 전지판 사진 한 장만 있어요. 하루 동안 만든 전기의 양을 알아볼 자료를 고르세요.",
    "answer": "②",
    "explanation": "사진 한 장으로는 하루 동안 빛을 얼마나 받았는지 알기 어려워요. 실제 발전량을 잰 기록과 설치 조건을 함께 살펴요.",
    "misconception": "순간 배치 사진이 시간별 발전 측정 자료는 아니에요.",
    "form": "choice",
    "choices": [
      "전지판 사진을 더 크게 인쇄한 것",
      "하루 동안 실제로 만든 전기의 양을 잰 기록",
      "전지판이 설치된 곳의 이름만 적은 표"
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
    "before": "e8765f59eb72a363"
  },
  "34": {
    "prompt": "풍력 발전이 우리 지역에 알맞을지 알아보려고 해요. 햇빛과 바람 중 먼저 살펴볼 자연 조건을 쓰세요.",
    "answer": "바람",
    "explanation": "바람이 얼마나 세게, 언제 부는지 살펴요. 설비와 주변에 미치는 영향도 함께 조사해요.",
    "misconception": "한 지역의 사례를 모든 장소의 같은 결과로 확대하지 않아요.",
    "form": "short",
    "required": [
      "알맞은 낱말"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "바람",
        "바람의 세기",
        "바람의 빠르기",
        "풍속",
        "바람이 부는 때",
        "바람이 부는 시간"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "1477f4def58ae9bc"
  },
  "40": {
    "prompt": "냉장고와 냉방기에 같은 에너지 등급이 붙어 있어요. 실제로 어느 쪽이 전기를 적게 썼는지 알아볼 방법을 고르세요.",
    "answer": "③",
    "explanation": "종류·용량·사용 목적과 켜 둔 시간이 다르면 등급 숫자만으로 사용량을 비교하기 어려워요. 같은 기간에 실제로 쓴 양을 확인해요.",
    "misconception": "서로 다른 기능/용량·사용 조건을 등급 하나로 비교하지 않아요.",
    "form": "choice",
    "choices": [
      "등급 숫자만 보고 사용량도 같다고 정한다.",
      "기구의 크기만 보고 전기 사용량을 정한다.",
      "같은 기간의 실제 사용량과 켜 둔 시간을 살핀다."
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
    "before": "c5ccba0b62346e79"
  },
  "52": {
    "prompt": "우리 반이 종이의 앞뒷면을 쓰기로 했어요. 종이를 덜 썼는지 알아보려면 같은 활동에 사용한 종이의 (1)[ ]를 실천 전후에 비교해요. 보기: 장수·색",
    "answer": "장수",
    "explanation": "같은 활동에 쓴 종이 장수를 세어 비교해요. 활동의 양과 조사 기간도 맞추어요.",
    "misconception": "사람 수나 활동의 양이 달라 줄어든 사용량을 절약 방법의 효과로만 설명하지 않아요.",
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
            "장수",
            "수",
            "장 수",
            "종이 장수"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "e2b0c2d6cb9a425c"
  },
  "55": {
    "prompt": "우리 반이 하루 동안 종이 10장을 덜 썼어요. 학교 전체의 변화를 알려면 같은 기간에 학교의 (1)[ ]이 쓴 종이도 조사해요. 보기: 다른 반·우리 반만",
    "answer": "다른 반",
    "explanation": "한 반의 하루 기록만으로 학교 전체의 결과를 정하지 않아요. 학교의 다른 반이 실제로 쓴 양도 같은 기간에 조사해요.",
    "misconception": "한 반/하루 자료를 학교 전체/1년의 실적으로 쓰지 않아요.",
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
            "다른 반",
            "다른반",
            "다른 학급",
            "다른학급"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "ed25eb29fb26e95f"
  },
  "63": {
    "prompt": "A집은 크고 벽이 얇아요. B집은 작고 벽이 두꺼워요. 창 구조만 바꾸어 비교할 방법을 고르세요.",
    "answer": "①",
    "explanation": "크기와 벽도 다르면 온도 차이가 창 때문인지 구별하기 어려워요. 처음 온도·틈·측정 위치·시간·주위 조건도 맞추어요.",
    "misconception": "크기/벽도 다르면 창 구조의 효과만 알 수 없어요.",
    "form": "choice",
    "choices": [
      "집 크기와 벽의 재료·두께를 같게 한다.",
      "집 크기는 다르게 두고 창만 바꾼다.",
      "벽 두께도 함께 바꾸어 차이를 더 크게 만든다."
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
    "before": "7abcf5968a7d2738"
  },
  "71": {
    "prompt": "태양광과 풍력 발전을 같은 항목으로 조사하려 해요. 태양광에 필요한 햇빛과 풍력에 필요한 바람은 모두 발전에 필요한 (1)[ ]에 해당해요. 보기: 자연 조건·사용한 공책 수",
    "answer": "자연 조건",
    "explanation": "햇빛과 바람처럼 발전에 필요한 자연 조건을 공통 항목으로 비교해요. 실제 조사에서는 설비와 주변 영향 등도 같은 기준으로 살펴요.",
    "misconception": "종류 나열만으로 이용 조건과 영향을 조사했다고 하지 않아요.",
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
            "자연 조건",
            "자연조건",
            "환경 조건",
            "환경조건"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "8903a4b4939e213a"
  },
  "74": {
    "prompt": "집 모형의 온도를 재다가 문이 열렸어요. 기록하는 방법을 고르세요.",
    "answer": "②",
    "explanation": "조건이 달라진 사실과 실제 측정값을 그대로 남겨요. 감지 위치·처음 온도·주위 온도도 확인하고 조건을 맞추어 다시 비교해요.",
    "misconception": "반복만으로 도구 오류와 조건 차이가 사라지지 않아요.",
    "form": "choice",
    "choices": [
      "문이 열리기 전 값만 남기고 이후 값은 지운다.",
      "문이 열린 사실과 시각, 그때 잰 온도를 남긴다.",
      "문이 닫혀 있었다고 적고 온도를 예상해 고친다."
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
    "before": "3926e48084b0a44e"
  },
  "76": {
    "prompt": "반복해 잰 온도가 서로 달랐어요. 처음 값과 다시 잰 값은 (1)[ ] 남겨요. 보기: 모두·높은 값만",
    "answer": "모두",
    "explanation": "실제로 잰 값을 골라 지우지 않아요. 처음 온도·감지 위치·문과 틈·시각·주위 조건을 확인하고 다시 비교해요.",
    "misconception": "원하는 결론에 맞게 값을 고르거나 처음 기록을 지우지 않아요.",
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
            "모두",
            "다",
            "전부",
            "둘 다",
            "둘다"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "1f7b184112349c8b"
  },
  "80": {
    "prompt": "친구가 “태양광 발전은 밤에도 낮과 같은 양의 전기를 만들어”라고 말했어요. 햇빛과 연결한 설명을 고르세요.",
    "answer": "③",
    "explanation": "태양광 발전은 태양 전지판이 받는 빛과 관계있어요. 재생에너지라는 분류만으로 어느 때나 같은 양을 이용할 수 있다고 정하지 않아요.",
    "misconception": "재생된다는 말을 모든 장소와 시간에서 같은 양을 얻는다는 뜻으로 읽지 않아요.",
    "form": "choice",
    "choices": [
      "전지판의 크기가 같으면 밤낮의 발전량도 같다.",
      "재생에너지이므로 햇빛이 없어도 같은 양을 만든다.",
      "밤에는 햇빛이 없어 낮과 같은 양을 만들 수 없다."
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
    "before": "b39f8c1277380680"
  },
  "89": {
    "prompt": "필요한 만큼만 종이를 쓰는 것은 사용량 (1)[ ]이고, 남은 종이를 다시 쓰는 것은 (2)[ ]이에요. 보기: 줄이기·재사용",
    "answer": "줄이기 / 재사용",
    "explanation": "처음부터 쓰는 양을 줄이는 것과 이미 있는 종이를 다시 쓰는 것은 달라요. 새 재료로 처리하는 재활용과도 구별해요.",
    "misconception": "줄이기·재사용·재활용의 과정을 구별해요.",
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
            "줄이기",
            "줄임",
            "감소",
            "줄이는 것"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "재사용",
            "다시 쓰기",
            "다시쓰기"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "b7c5c3c87306e11a"
  },
  "98": {
    "prompt": "같은 조건에서 10분 동안 A는 31℃에서 24℃로, B는 31℃에서 27℃로 식었어요. 더 적게 식은 것은 (1)[ ]이고, 온도는 (2)[ ]℃ 낮아졌어요.",
    "answer": "B / 4",
    "explanation": "A는 7℃, B는 4℃ 낮아져 이 조건에서는 B가 더 적게 식었어요. 실제 건물의 전기 사용량이나 요금을 잰 결과는 아니에요.",
    "misconception": "모형 온도 변화와 실제 건물 전력/비용 감소는 달라요.",
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
            "B",
            "비",
            "B 모형",
            "모형 B"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "4",
            "4℃",
            "4 ℃",
            "4도"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "1c7a7f248bdd700a"
  },
  "103": {
    "prompt": "활동에 필요한 밝기를 유지하면서 교실 조명을 덜 쓰는 방법을 고르세요.",
    "answer": "①",
    "explanation": "필요한 기능을 유지하면서 낭비를 줄여요. 교사 안내를 따르고 학생이 실제 전기 설비를 바꾸지 않아요.",
    "misconception": "필요한 밝기를 잃는 것을 낭비 감소로 부르지 않아요.",
    "form": "choice",
    "choices": [
      "사용하지 않는 구역의 불필요한 조명을 끈다.",
      "글씨가 잘 안 보여도 교실 조명을 모두 끈다.",
      "학생이 조명 전선을 직접 바꾸어 연결한다."
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
    "before": "2fefa69afa71af44"
  },
  "109": {
    "prompt": "금속을 재활용할 수 있어도 아껴 써야 하는 까닭을 고르세요.",
    "answer": "②",
    "explanation": "쓴 금속을 모두 모으기 어렵고 처리와 다시 이용하는 과정에서도 손실과 자원·에너지 이용이 있을 수 있어요.",
    "misconception": "재활용할 수 있다는 이유로 새 자원을 끝없이 얻을 수 있다고 생각하지 않아요.",
    "form": "choice",
    "choices": [
      "금속은 한 번 쓰면 어떤 방법으로도 다시 쓸 수 없어서",
      "다시 모으는 데 한계가 있고 처리에도 자원과 에너지가 필요해서",
      "재활용할 때에는 자원과 에너지를 쓰지 않아서"
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
    "before": "1c5d9cfd6f3b0147"
  },
  "111": {
    "prompt": "집 모형의 창 구조만 바꾸어 비교해요. 온도를 잴 때는 같은 (1)[ ]에서 같은 (2)[ ]에 재요. 보기: 위치·시각",
    "answer": "위치 / 시각",
    "explanation": "측정 위치와 시각을 맞추어요. 집 크기·벽·처음 온도·주위 조건도 같게 하여 실제로 만들고 반복해 비교해요.",
    "misconception": "벽 재료와 창 구조를 함께 바꾸면 창만의 효과를 알기 어려워요.",
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
            "위치",
            "곳",
            "장소"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "시각",
            "시간",
            "때"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "93cdb5e89fd4e1b6"
  }
};
const bankReview={
  "c22-s52-u04-b004": {
    "prompt": "태양광 발전은 밤에도 낮과 같은 양의 전기를 만들까요? 내 생각과 확인하고 싶은 것 하나를 짝과 말하거나 한 줄로 쓰세요.",
    "answer": "같은 양은 아닐 것 같아요. 빛을 받는 때를 알아보고 싶어요.",
    "explanation": "재생에너지는 자연에서 보충되는 흐름을 이용하지만 실제 이용량은 환경/시간·설비 조건에 제한되어요. 지금 생각은 학습 후 근거와 비교해요.",
    "misconception": "재생 가능과 언제나 무한한 사용은 달라요.",
    "required": [
      "처음 생각과 확인할 빛·시간 조건 하나"
    ],
    "lines": 1,
    "before": [
      "dc28bad9e116ed2f"
    ]
  },
  "c22-s52-u04-b010": {
    "prompt": "공책의 종이와 철심을 어떤 재료로 만들었는지 알아볼 자료를 고르세요.",
    "answer": "①",
    "explanation": "공책의 종이와 철심을 나누어 회사 안내나 재료 표시에서 확인해요. 알아낸 내용과 아직 모르는 점을 구별해요.",
    "misconception": "추정한 재료와 본문에서 확인한 재료를 나눠요.",
    "form": "choice",
    "choices": [
      "공책을 만든 회사의 재료 안내",
      "공책을 쓰는 친구가 좋아하는 색",
      "공책 표지에 그려진 풍경"
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
      "1ae647d2c490eecc"
    ]
  },
  "c22-s52-u04-b022": {
    "prompt": "물건을 분리배출할 통을 모르겠어요. 우리 지역과 다른 지역 중 어느 지역의 분리배출 안내를 찾아야 할까요?",
    "answer": "우리 지역",
    "explanation": "실제로 버릴 지역의 수거·분리배출 안내를 확인해요. 재질과 오염 상태, 수거 방법도 함께 살펴요.",
    "misconception": "재활용 표시와 실제 수거/처리 가능은 구별해요.",
    "form": "short",
    "required": [
      "알맞은 낱말"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "우리 지역",
        "우리지역",
        "내가 사는 지역",
        "사는 지역",
        "해당 지역",
        "버릴 지역",
        "물건을 버릴 지역"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "f8e36956c7ee488c"
    ]
  },
  "c22-s52-u04-b028": {
    "prompt": "태양 전지판 사진 한 장만 있어요. 하루 동안 만든 전기의 양을 알아볼 자료를 고르세요.",
    "answer": "②",
    "explanation": "사진 한 장으로는 하루 동안 빛을 얼마나 받았는지 알기 어려워요. 실제 발전량을 잰 기록과 설치 조건을 함께 살펴요.",
    "misconception": "순간 배치 사진이 시간별 발전 측정 자료는 아니에요.",
    "form": "choice",
    "choices": [
      "전지판 사진을 더 크게 인쇄한 것",
      "하루 동안 실제로 만든 전기의 양을 잰 기록",
      "전지판이 설치된 곳의 이름만 적은 표"
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
      "e257b5b8f97d5b3a"
    ]
  },
  "c22-s52-u04-b034": {
    "prompt": "풍력 발전이 우리 지역에 알맞을지 알아보려고 해요. 햇빛과 바람 중 먼저 살펴볼 자연 조건을 쓰세요.",
    "answer": "바람",
    "explanation": "바람이 얼마나 세게, 언제 부는지 살펴요. 설비와 주변에 미치는 영향도 함께 조사해요.",
    "misconception": "한 지역의 사례를 모든 장소의 같은 결과로 확대하지 않아요.",
    "form": "short",
    "required": [
      "알맞은 낱말"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "바람",
        "바람의 세기",
        "바람의 빠르기",
        "풍속",
        "바람이 부는 때",
        "바람이 부는 시간"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "f59f449c0bb5c322"
    ]
  },
  "c22-s52-u04-b040": {
    "prompt": "냉장고와 냉방기에 같은 에너지 등급이 붙어 있어요. 실제로 어느 쪽이 전기를 적게 썼는지 알아볼 방법을 고르세요.",
    "answer": "③",
    "explanation": "종류·용량·사용 목적과 켜 둔 시간이 다르면 등급 숫자만으로 사용량을 비교하기 어려워요. 같은 기간에 실제로 쓴 양을 확인해요.",
    "misconception": "서로 다른 기능/용량·사용 조건을 등급 하나로 비교하지 않아요.",
    "form": "choice",
    "choices": [
      "등급 숫자만 보고 사용량도 같다고 정한다.",
      "기구의 크기만 보고 전기 사용량을 정한다.",
      "같은 기간의 실제 사용량과 켜 둔 시간을 살핀다."
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
      "9ac6c3d33dfcdb19"
    ]
  },
  "c22-s52-u04-b052": {
    "prompt": "우리 반이 종이의 앞뒷면을 쓰기로 했어요. 종이를 덜 썼는지 알아보려면 같은 활동에 사용한 종이의 (1)[ ]를 실천 전후에 비교해요. 보기: 장수·색",
    "answer": "장수",
    "explanation": "같은 활동에 쓴 종이 장수를 세어 비교해요. 활동의 양과 조사 기간도 맞추어요.",
    "misconception": "사람 수나 활동의 양이 달라 줄어든 사용량을 절약 방법의 효과로만 설명하지 않아요.",
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
            "장수",
            "수",
            "장 수",
            "종이 장수"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "b9ff65ec5ab4c52e"
    ]
  },
  "c22-s52-u04-b055": {
    "prompt": "우리 반이 하루 동안 종이 10장을 덜 썼어요. 학교 전체의 변화를 알려면 같은 기간에 학교의 (1)[ ]이 쓴 종이도 조사해요. 보기: 다른 반·우리 반만",
    "answer": "다른 반",
    "explanation": "한 반의 하루 기록만으로 학교 전체의 결과를 정하지 않아요. 학교의 다른 반이 실제로 쓴 양도 같은 기간에 조사해요.",
    "misconception": "한 반/하루 자료를 학교 전체/1년의 실적으로 쓰지 않아요.",
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
            "다른 반",
            "다른반",
            "다른 학급",
            "다른학급"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "10eee6db9ea56771"
    ]
  },
  "c22-s52-u04-b063": {
    "prompt": "A집은 크고 벽이 얇아요. B집은 작고 벽이 두꺼워요. 창 구조만 바꾸어 비교할 방법을 고르세요.",
    "answer": "①",
    "explanation": "크기와 벽도 다르면 온도 차이가 창 때문인지 구별하기 어려워요. 처음 온도·틈·측정 위치·시간·주위 조건도 맞추어요.",
    "misconception": "크기/벽도 다르면 창 구조의 효과만 알 수 없어요.",
    "form": "choice",
    "choices": [
      "집 크기와 벽의 재료·두께를 같게 한다.",
      "집 크기는 다르게 두고 창만 바꾼다.",
      "벽 두께도 함께 바꾸어 차이를 더 크게 만든다."
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
      "a8f82e63713c5d2d"
    ]
  },
  "c22-s52-u04-b071": {
    "prompt": "태양광과 풍력 발전을 같은 항목으로 조사하려 해요. 태양광에 필요한 햇빛과 풍력에 필요한 바람은 모두 발전에 필요한 (1)[ ]에 해당해요. 보기: 자연 조건·사용한 공책 수",
    "answer": "자연 조건",
    "explanation": "햇빛과 바람처럼 발전에 필요한 자연 조건을 공통 항목으로 비교해요. 실제 조사에서는 설비와 주변 영향 등도 같은 기준으로 살펴요.",
    "misconception": "종류 나열만으로 이용 조건과 영향을 조사했다고 하지 않아요.",
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
            "자연 조건",
            "자연조건",
            "환경 조건",
            "환경조건"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "89337b5e2467a904"
    ]
  },
  "c22-s52-u04-b074": {
    "prompt": "집 모형의 온도를 재다가 문이 열렸어요. 기록하는 방법을 고르세요.",
    "answer": "②",
    "explanation": "조건이 달라진 사실과 실제 측정값을 그대로 남겨요. 감지 위치·처음 온도·주위 온도도 확인하고 조건을 맞추어 다시 비교해요.",
    "misconception": "반복만으로 도구 오류와 조건 차이가 사라지지 않아요.",
    "form": "choice",
    "choices": [
      "문이 열리기 전 값만 남기고 이후 값은 지운다.",
      "문이 열린 사실과 시각, 그때 잰 온도를 남긴다.",
      "문이 닫혀 있었다고 적고 온도를 예상해 고친다."
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
      "245cc4bf68f28fed"
    ]
  },
  "c22-s52-u04-b076": {
    "prompt": "반복해 잰 온도가 서로 달랐어요. 처음 값과 다시 잰 값은 (1)[ ] 남겨요. 보기: 모두·높은 값만",
    "answer": "모두",
    "explanation": "실제로 잰 값을 골라 지우지 않아요. 처음 온도·감지 위치·문과 틈·시각·주위 조건을 확인하고 다시 비교해요.",
    "misconception": "원하는 결론에 맞게 값을 고르거나 처음 기록을 지우지 않아요.",
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
            "모두",
            "다",
            "전부",
            "둘 다",
            "둘다"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "18441bdfa584363d"
    ]
  },
  "c22-s52-u04-b080": {
    "prompt": "친구가 “태양광 발전은 밤에도 낮과 같은 양의 전기를 만들어”라고 말했어요. 햇빛과 연결한 설명을 고르세요.",
    "answer": "③",
    "explanation": "태양광 발전은 태양 전지판이 받는 빛과 관계있어요. 재생에너지라는 분류만으로 어느 때나 같은 양을 이용할 수 있다고 정하지 않아요.",
    "misconception": "재생된다는 말을 모든 장소와 시간에서 같은 양을 얻는다는 뜻으로 읽지 않아요.",
    "form": "choice",
    "choices": [
      "전지판의 크기가 같으면 밤낮의 발전량도 같다.",
      "재생에너지이므로 햇빛이 없어도 같은 양을 만든다.",
      "밤에는 햇빛이 없어 낮과 같은 양을 만들 수 없다."
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
      "a7bd453825c1e1fe"
    ]
  },
  "c22-s52-u04-b089": {
    "prompt": "필요한 만큼만 종이를 쓰는 것은 사용량 (1)[ ]이고, 남은 종이를 다시 쓰는 것은 (2)[ ]이에요. 보기: 줄이기·재사용",
    "answer": "줄이기 / 재사용",
    "explanation": "처음부터 쓰는 양을 줄이는 것과 이미 있는 종이를 다시 쓰는 것은 달라요. 새 재료로 처리하는 재활용과도 구별해요.",
    "misconception": "줄이기·재사용·재활용의 과정을 구별해요.",
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
            "줄이기",
            "줄임",
            "감소",
            "줄이는 것"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "재사용",
            "다시 쓰기",
            "다시쓰기"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "53075d569f4e5a2c"
    ]
  },
  "c22-s52-u04-b098": {
    "prompt": "같은 조건에서 10분 동안 A는 31℃에서 24℃로, B는 31℃에서 27℃로 식었어요. 더 적게 식은 것은 (1)[ ]이고, 온도는 (2)[ ]℃ 낮아졌어요.",
    "answer": "B / 4",
    "explanation": "A는 7℃, B는 4℃ 낮아져 이 조건에서는 B가 더 적게 식었어요. 실제 건물의 전기 사용량이나 요금을 잰 결과는 아니에요.",
    "misconception": "모형 온도 변화와 실제 건물 전력/비용 감소는 달라요.",
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
            "B",
            "비",
            "B 모형",
            "모형 B"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "4",
            "4℃",
            "4 ℃",
            "4도"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "4233fa3a618434bc"
    ]
  },
  "c22-s52-u04-b103": {
    "prompt": "활동에 필요한 밝기를 유지하면서 교실 조명을 덜 쓰는 방법을 고르세요.",
    "answer": "①",
    "explanation": "필요한 기능을 유지하면서 낭비를 줄여요. 교사 안내를 따르고 학생이 실제 전기 설비를 바꾸지 않아요.",
    "misconception": "필요한 밝기를 잃는 것을 낭비 감소로 부르지 않아요.",
    "form": "choice",
    "choices": [
      "사용하지 않는 구역의 불필요한 조명을 끈다.",
      "글씨가 잘 안 보여도 교실 조명을 모두 끈다.",
      "학생이 조명 전선을 직접 바꾸어 연결한다."
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
      "ad98223440267022"
    ]
  },
  "c22-s52-u04-b109": {
    "prompt": "금속을 재활용할 수 있어도 아껴 써야 하는 까닭을 고르세요.",
    "answer": "②",
    "explanation": "쓴 금속을 모두 모으기 어렵고 처리와 다시 이용하는 과정에서도 손실과 자원·에너지 이용이 있을 수 있어요.",
    "misconception": "재활용할 수 있다는 이유로 새 자원을 끝없이 얻을 수 있다고 생각하지 않아요.",
    "form": "choice",
    "choices": [
      "금속은 한 번 쓰면 어떤 방법으로도 다시 쓸 수 없어서",
      "다시 모으는 데 한계가 있고 처리에도 자원과 에너지가 필요해서",
      "재활용할 때에는 자원과 에너지를 쓰지 않아서"
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
      "fa19d8df53453d3d"
    ]
  },
  "c22-s52-u04-b111": {
    "prompt": "집 모형의 창 구조만 바꾸어 비교해요. 온도를 잴 때는 같은 (1)[ ]에서 같은 (2)[ ]에 재요. 보기: 위치·시각",
    "answer": "위치 / 시각",
    "explanation": "측정 위치와 시각을 맞추어요. 집 크기·벽·처음 온도·주위 조건도 같게 하여 실제로 만들고 반복해 비교해요.",
    "misconception": "벽 재료와 창 구조를 함께 바꾸면 창만의 효과를 알기 어려워요.",
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
            "위치",
            "곳",
            "장소"
          ]
        },
        {
          "label": "㉡",
          "accepted": [
            "시각",
            "시간",
            "때"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "19cd46d7d091b0e1"
    ]
  }
};
const questionTitles={};
const studyMethodBefore="개념과 예제를 읽고 여러 가지 문제를 풀어요. 조사한 자료와 실험에서 확인한 값으로 설명하고, 생활에서 실천할 방법을 찾아보아요.";
const clone=x=>JSON.parse(JSON.stringify(x));
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const banks=new WeakMap(),books=new WeakMap(),labels={choice:'객관식',blank:'빈칸 넣기',short:'단답형',written:'까닭 설명',draw:'그림 설명'};
const response=e=>e.contract?clone(e.contract):{kind:Object.hasOwn(e,'drawingExplanationLines')?'drawing':'written-explanation',teacherRequired:true,actualPerformanceMustNotBeInferred:true,sample:e.answer,required:[...e.required]};
function answerContract(e){const c=response(e);return{type:e.form==='choice'?'single-choice':e.contract?'short-text':'written-explanation',...(e.form==='choice'?{answer:e.key,accepted:[e.key]}:e.contract?{answer:e.answer,accepted:c.accepted||[e.answer],inputHint:c.parts?'빈칸의 답을 쉼표로 나누어 차례대로 써요.':'짧은 낱말로 답해요.'}:{sample:e.answer,teacherRequired:true,reviewRequired:true,rubric:{required:[...e.required],pass:'뜻이 같은 짧은 답과 알맞은 이름표는 교사가 확인해요.'}}),seasonContract:c};}
export function energyMixedItems(rows,u){
 if(u!==unit||!rows?.length)return rows;let changed=false;
 const next=rows.map(q=>{const e=bankReview[q.id];if(!e||q.status!=='authored'||q.sourceRef?.type!=='authored-supplement'||!e.before.includes(fingerprint(q)))return q;changed=true;if(banks.has(q))return banks.get(q);
 const result={...q,prompt:e.prompt,explanation:e.explanation,misconception:e.misconception,responseContract:response(e),answerContract:answerContract(e),...(q.diagnosticOverride?{diagnosticOverride:{...q.diagnosticOverride,version:ENERGY_MIXED_VERSION}}:{}),...(e.form?{bookResponseForm:e.form,taxonomy:{...q.taxonomy,format:labels[e.form]},choices:e.choices?clone(e.choices):null,diagnosticOverride:{version:ENERGY_MIXED_VERSION,distractors:null,typed:null,cloze:null,cells:null}}:{}),energyMixedResponse:ENERGY_MIXED_VERSION,contentVersion:ENERGY_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};banks.set(q,result);return result;});return changed?next:rows;
}
export function withEnergyMixedClassroom(u,mod){if(u!==unit)return mod;const classroomItems=energyMixedItems(mod?.classroomItems,u);return classroomItems===mod.classroomItems?mod:{...mod,classroomItems};}
export function withEnergyMixedWorkbook(w){
 if(w?.unit!==unit||fingerprint(w)!==prior)return w;if(books.has(w))return books.get(w);
 const questions=w.questions.map(q=>{const e=review[q.no];if(!e||fingerprint(q)!==e.before)return q;const result={...q,prompt:e.prompt,answer:e.answer,explanation:e.explanation,misconception:e.misconception,requirements:[...e.required],criteria:e.required.join(' / '),responseContract:response(e),energyMixedResponse:ENERGY_MIXED_VERSION,contentVersion:ENERGY_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};for(const k of['form','choices','key','lines'])if(Object.hasOwn(e,k))result[k]=clone(e[k]);if(e.form){result.bookResponseForm=e.form;result.formLabel=e.form==='short'?'짧게 쓰기':labels[e.form];delete result.lines;}return result;});
 const revisePage=p=>{const first=p.blocks.flatMap(b=>b.ids||[])[0],n=Number(first?.slice(-3));return{...p,title:questionTitles[n]||p.title,blocks:p.blocks.map(b=>b.type==='text'&&b.text===studyMethodBefore?{...b,text:'개념과 예제로 자원과 에너지를 알아보아요. 고르기·빈칸·짧은 답으로 확인하고, 비교한 까닭은 짧게 설명해요. 직접 조사한 내용과 실험값으로 생활 속 실천을 소개해요.'}:b)};};
 const pages=w.pages.map(revisePage),teacherStudentPages=w.teacherStudentPages.map(revisePage),teacherPages=w.teacherPages;
 const figures={...w.figures},byNo=new Map(questions.map(q=>[q.no,q]));for(const key of w.quickPages.flatMap(p=>p.blocks.filter(b=>b.type==='diagram').map(b=>b.key)))figures[key]=figures[key].replace(/(<tr><th scope="row">)(\d+)(<\/th><td>)([\s\S]*?)(<\/td><td>)([\s\S]*?)(<\/td><\/tr>)/g,(row,a,n,b,form,c,answer,d)=>{const q=byNo.get(Number(n));return review[n]||q.form==='choice'?a+n+b+(review[n]?labels[q.form]:form)+c+(q.form==='choice'?(Array.isArray(q.key)?q.key.map(i=>'①②③④⑤'[i]).join(', '):'①②③④⑤'[q.key]):q.form==='written'?'교사 확인':q.answer)+d:row;});
 const result={...w,questions,pages,teacherStudentPages,teacherPages,figures};books.set(w,result);return result;
}
