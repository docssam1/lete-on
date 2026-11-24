// Compare positions, elapsed times and speeds with brief responses; retain real measurements.
export const WEATHER_MIXED_VERSION='20261124-weather-mixed-responses';
const unit='c22-s52-u03',prior='8578493b1c57527d';
const review={
  "4": {
    "prompt": "안개가 꼈어요. 오후에도 비가 올까요? 내 생각과 더 보고 싶은 날씨 자료 하나를 짝과 말하거나 한 줄로 쓰세요.",
    "answer": "비가 올지는 아직 모르겠어요. 오후 강수 예보를 보고 싶어요.",
    "explanation": "다른 예상도 말할 수 있어요. 같은 지역의 오후 최신 예보와 관측을 확인해 처음 생각과 비교해요.",
    "misconception": "안개만 보고 오후에 반드시 비가 온다고 정하지 않아요.",
    "required": [
      "처음 생각과 확인할 날씨 자료 하나"
    ],
    "lines": 1,
    "before": "f901b68e167e1fa8"
  },
  "10": {
    "prompt": "A는 그늘에서 10시에, B는 햇빛에 달궈진 벽 옆에서 14시에 기온을 쟀어요. 두 관측은 장소뿐 아니라 잰 (1)[ ]도 달라요. 보기: 시각·단위",
    "answer": "시각",
    "explanation": "10시와 14시로 관측한 시각이 달라요. 장소와 빛의 조건도 맞추어 비교해요.",
    "misconception": "여러 조건이 다른 결과를 장소 하나의 영향이라고 하지 않아요.",
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
            "시각",
            "시간",
            "관측 시각",
            "측정 시각"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "a9a86abda7a1ce27"
  },
  "16": {
    "prompt": "기온이 다른 두 방의 습도가 모두50%예요. 공기 중 수증기의 양도 같다고 할 수 있을까요? 까닭을 짧게 쓰세요.",
    "answer": "그렇지 않아요. 습도는 기온의 영향도 받아요.",
    "explanation": "습도 숫자만으로 수증기의 양을 정하지 않아요. 기온과 공기의 부피 등 조건도 함께 살펴요.",
    "misconception": "습도50%를 수증기50g이나 항상 같은 양이라고 읽지 않아요.",
    "required": [
      "습도가 기온의 영향도 받으므로 같은 수증기 양이라고 정할 수 없다는 설명"
    ],
    "lines": 1,
    "before": "cbe705f59ec84283"
  },
  "22": {
    "prompt": "두 컵을 비교하다가 한 컵 바깥에 물방울이 생겼어요. 컵에서 물이 샌 것인지 알아볼 방법을 고르세요.",
    "answer": "②",
    "explanation": "컵에 새는 곳이 있는지 확인해요. 처음 바깥의 물기와 튀는 물도 살핀 뒤 물방울이 생긴 까닭을 설명해요.",
    "misconception": "바깥 물방울을 보자마자 모두 응결한 물이라고 정하지 않아요.",
    "form": "choice",
    "choices": [
      "물방울이 생긴 컵을 더 큰 컵으로 바꾼다.",
      "컵에 갈라지거나 새는 곳이 있는지 살핀다.",
      "물방울의 개수로 컵 안 물의 온도를 정한다."
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
    "before": "1ff3c647f9c389b1"
  },
  "34": {
    "prompt": "작은 창문으로 본 하늘에 구름이 가득해요. 하늘 전체의 구름 양을 알아볼 방법을 고르세요.",
    "answer": "③",
    "explanation": "창문으로 보이는 하늘은 일부예요. 다른 방향을 함께 살펴 구름의 양을 비교해요. 태양을 직접 보지 않아요.",
    "misconception": "좁은 사진 한 장을 하늘 전체의 모습으로 정하지 않아요.",
    "form": "choice",
    "choices": [
      "창문으로 본 구름만 세어 하늘 전체를 정한다.",
      "같은 창문에서 구름 한 개를 더 크게 본다.",
      "같은 시각에 다른 방향의 하늘도 살펴본다."
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
    "before": "1c658ae6955066ec"
  },
  "52": {
    "prompt": "내일 비가 올 것이라는 자료를 오늘의 관측값이라고 썼어요. 자료 이름을 내일 (1)[ ]로 고쳐요. 보기: 예보·관측",
    "answer": "예보",
    "explanation": "앞으로의 날씨를 예상하여 알리는 자료는 예보예요. 지역과 발표 시각, 어느 때의 예보인지도 확인해요.",
    "misconception": "앞으로의 예보를 이미 직접 관측한 결과라고 쓰지 않아요.",
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
            "예보",
            "날씨 예보",
            "일기 예보",
            "내일 예보"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "b8f88bd5ee89bd17"
  },
  "56": {
    "prompt": "09시는 16℃, 15시는 20℃였고 12시는 재지 못했어요. 12시 칸에는 (1)[ ]이라고 표시해요. 보기: 18℃·재지 못함",
    "answer": "재지 못함",
    "explanation": "두 값 사이의 18℃는 예상한 값일 수 있지만 실제로 잰 값이 아니에요. 실제로 재지 못한 칸은 그대로 표시해요.",
    "misconception": "재지 않은 시간의 값을 실제 관측값으로 채우지 않아요.",
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
            "재지 못함",
            "재지못함",
            "측정하지 못함",
            "미측정"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "1390fa201e09312e"
  },
  "63": {
    "prompt": "모래는 햇빛에서, 물은 그늘에서 관찰했어요. 두 재료가 데워지는 모습을 비교할 방법을 고르세요.",
    "answer": "①",
    "explanation": "두 재료의 차이를 비교하려면 빛 조건을 같게 해요. 양·용기·처음 온도·감지 위치·관측 시각도 확인해요.",
    "misconception": "빛과 재료가 함께 다른 결과를 재료만의 영향이라고 하지 않아요.",
    "form": "choice",
    "choices": [
      "두 재료가 같은 빛을 받게 한다.",
      "모래에만 빛을 더 비추어 준다.",
      "모래와 물을 서로 다른 때에 잰다."
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
    "before": "bfe94bc4456e441e"
  },
  "67": {
    "prompt": "우리 학교의 내일 야외 활동을 안내하려고 해요. (1)[ ]가 있는 지역의 예보를 찾아요. 보기: 학교·친구의 여행지",
    "answer": "학교",
    "explanation": "야외 활동을 할 학교가 있는 지역의 예보를 찾아요. 활동할 날짜와 시각에 맞는 최신 예보를 확인해요.",
    "misconception": "다른 지역의 예보를 우리 학교 날씨와 같다고 쓰지 않아요.",
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
            "학교",
            "우리 학교",
            "우리학교"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "1a1c84ebd5057815"
  },
  "72": {
    "prompt": "학생이 안개 모형을 보려고 뜨거운 물을 붓고 향을 피우자고 해요. 안전한 방법을 고르세요.",
    "answer": "②",
    "explanation": "뜨거운 물·불·향은 학생이 직접 다루지 않아요. 선생님이 준비한 안전한 시범이나 영상에서 벽의 물방울과 공기 중 흐림을 나누어 관찰해요.",
    "misconception": "관찰을 위해 학생이 직접 향을 피우거나 뜨거운 물을 붓지 않아요.",
    "form": "choice",
    "choices": [
      "친구가 컵을 잡고 학생이 뜨거운 물을 붓는다.",
      "선생님이 안전하게 준비한 시범이나 영상을 본다.",
      "학생이 향을 더 피워 흐림을 짙게 만든다."
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
    "before": "536988bef5907ea0"
  },
  "75": {
    "prompt": "모래와 물의 온도는 쟀지만 공기 흐름은 보지 못했어요. 공기 흐름 칸에 알맞은 기록을 고르세요.",
    "answer": "③",
    "explanation": "온도와 시각은 실제로 잰 그대로 남겨요. 온도만으로 직접 보지 못한 공기 흐름까지 관찰했다고 쓰지 않아요.",
    "misconception": "온도를 쟀다는 이유로 바람까지 직접 보았다고 쓰지 않아요.",
    "form": "choice",
    "choices": [
      "따뜻한 쪽으로 공기가 움직였다.",
      "두 재료 사이에서 공기가 멈췄다.",
      "공기 흐름은 관찰하지 못했다."
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
    "before": "01cac6698e50fc6f"
  },
  "77": {
    "prompt": "친구가 인터넷에서 내가 읽은 날씨 자료를 다시 열어 보려고 해요. 자료의 인터넷 (1)[ ]를 남겨요. 보기: 주소·글자 색",
    "answer": "주소",
    "explanation": "인터넷 주소를 남기면 친구가 같은 자료를 다시 열어 볼 수 있어요. 자료 제목·기관·확인 날짜도 함께 남기면 좋아요.",
    "misconception": "출처만 적고 자료에서 확인한 내용을 생략하지 않아요.",
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
            "주소",
            "인터넷 주소",
            "웹 주소",
            "URL",
            "url",
            "링크"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "1099c247be0b9629"
  },
  "78": {
    "prompt": "오전 09시 기온만 보고 오후 운동장 활동을 정하려고 해요. 오후에 비가 올지 알아볼 자료를 고르세요.",
    "answer": "①",
    "explanation": "활동할 지역과 오후 시각에 맞는 강수 예보를 보아요. 최신 관측과 바람·기온도 함께 확인해요.",
    "misconception": "오전 기온 하나로 오후의 모든 날씨를 정하지 않아요.",
    "form": "choice",
    "choices": [
      "학교가 있는 지역의 오후 강수 예보",
      "다른 지역의 어제 오후 기온",
      "학교가 있는 지역의 오전 기온만"
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
    "before": "bb93b67c2b424176"
  },
  "79": {
    "prompt": "비의 양을 읽지 못했는데 0mm라고 썼어요. 바르게 고친 기록을 고르세요.",
    "answer": "②",
    "explanation": "읽지 못한 값과 실제로 확인한 0mm는 달라요. 재지 못한 까닭을 남기고, 다른 자료를 쓰면 내 관측값과 구별해요.",
    "misconception": "못 잰 것과 실제로 비가0mm인 것을 같게 쓰지 않아요.",
    "form": "choice",
    "choices": [
      "비가 오지 않았으므로 0mm",
      "재지 못함",
      "예보에 나온 비의 양을 내 관측값으로 기록"
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
    "before": "462f524829f9e3b2"
  },
  "84": {
    "prompt": "기온이 같은 두 날에도 젖은 운동장이 마르는 빠르기가 달랐어요. 기온 말고 더 살펴볼 기상 요소 하나를 낱말로 쓰세요.",
    "answer": "바람 또는 습도",
    "explanation": "바람·습도·구름의 양·비의 양 등을 더 살펴볼 수 있어요. 햇빛과 운동장의 재료·처음 젖은 정도도 영향을 줄 수 있어요.",
    "misconception": "기온이 같으면 마르는 빠르기도 반드시 같다고 하지 않아요.",
    "form": "short",
    "required": [
      "알맞은 낱말 하나"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "바람",
        "바람의 빠르기",
        "풍속",
        "습도",
        "구름의 양",
        "구름 양",
        "운량",
        "강수",
        "강수량",
        "비",
        "비의 양"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "829ac68743fa97d9"
  },
  "88": {
    "prompt": "잰 기온이 예상보다 낮게 나왔어요. 원래 값을 지우고 높여 써도 될까요? 어떻게 해야 할지 짧게 쓰세요.",
    "answer": "원래 값을 남기고 도구와 조건을 확인해 다시 재어요.",
    "explanation": "감지 부분·표시의 안정·빛과 주변 조건을 확인해요. 다시 잰 값과 점검한 내용도 함께 남겨요.",
    "misconception": "예상과 다르다는 이유로 직접 잰 값을 바꾸지 않아요.",
    "required": [
      "원래 관측값을 보존하며 도구·조건 점검 또는 실제 재측정"
    ],
    "lines": 1,
    "before": "d1a70fd5afe0b7a7"
  },
  "92": {
    "prompt": "컵에 물을 붓다가 바깥에 물이 튀었어요. 응결한 물방울을 관찰하기 전에 컵 바깥을 닦아 (1)[ ] 해요. 보기: 마르게·젖게",
    "answer": "마르게",
    "explanation": "먼저 튄 물을 닦아 마르게 해요. 컵이 새는지도 살피고, 그 뒤 생기는 물방울을 같은 시각에 관찰해요.",
    "misconception": "튀어 묻은 물을 응결의 증거로 쓰지 않아요.",
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
            "마르게",
            "건조하게"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "3815909e6a9833dc"
  },
  "100": {
    "prompt": "A의 기온은 30℃, B는 20℃예요. 실제로 어느 곳의 기압이 더 낮은지 알려면 두 곳의 (1)[ ]을 더 재요. 보기: 기압·구름의 양",
    "answer": "기압",
    "explanation": "기온 하나만으로 실제 지표 기압을 정하지 않아요. 같은 높이와 시각 등 기준을 맞추어 기압을 비교해요.",
    "misconception": "더 더운 곳이면 반드시 저기압이라고 정하지 않아요.",
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
            "기압"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "55db33126c285fac"
  },
  "107": {
    "prompt": "15시 비 예보와 실제 15시에 비가 오지 않은 관측이 달라요. 알맞게 남긴 기록을 고르세요.",
    "answer": "①",
    "explanation": "예보와 실제 관측은 서로 다른 자료예요. 같은 날짜·지역·대상 시각인지 확인하고 발표 시각과 실제 관측 시각을 함께 남겨요.",
    "misconception": "실제 결과에 맞추어 옛 예보를 몰래 고치거나 관측을 지우지 않아요.",
    "form": "choice",
    "choices": [
      "예보와 관측을 나누어 둘 다 남긴다.",
      "실제 관측을 지우고 예보와 같게 고친다.",
      "예보를 지우고 처음부터 비 예보가 없었다고 쓴다."
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
    "before": "cdd353a7841af899"
  },
  "110": {
    "prompt": "같은 높이에서 잰 두 곳의 기압은 1004hPa와 1010hPa예요. 둘 중 더 높은 기압은 (1)[ ]hPa예요. 보기: 1004·1010",
    "answer": "1010",
    "explanation": "1010hPa가 1004hPa보다 높아요. 고기압과 저기압은 주변과 비교하며 1013hPa를 고정된 경계로 쓰지 않아요.",
    "misconception": "1013hPa보다 낮은 두 곳은 비교할 수 없다고 하지 않아요.",
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
            "1010",
            "1010hPa",
            "1010 hPa"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "6f746e2262506e84"
  },
  "111": {
    "prompt": "낮이라고 실제 바닷가에 해풍이 불었다고 적으려 해요. 먼저 확인할 자료를 고르세요.",
    "answer": "③",
    "explanation": "해륙풍 모형의 온도 차이와 실제 바닷가의 바람은 나누어 살펴요. 실제 바람에는 큰 기압 분포와 지형도 영향을 주므로 그곳의 풍향을 확인해요.",
    "misconception": "모형의 바람 방향을 모든 실제 바닷가에 그대로 적용하지 않아요.",
    "form": "choice",
    "choices": [
      "다른 지역에서 어제 잰 기온",
      "모래와 물의 온도를 비교한 결과만",
      "그 바닷가에서 그 시각에 관측한 풍향"
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
    "before": "dbcb51b10d8b494b"
  },
  "112": {
    "prompt": "방위를 확인한 풍향계의 화살 머리가 북쪽을 가리켜요. 바람의 빠르기는 어떤 도구로 더 잴까요? 도구 이름을 쓰세요.",
    "answer": "풍속계",
    "explanation": "풍향계로 바람이 불어오는 방향을 살펴요. 바람의 빠르기는 풍속계로 재고 단위도 함께 읽어요.",
    "misconception": "풍향계의 방향만으로 풍속까지 알 수는 없어요.",
    "form": "short",
    "required": [
      "알맞은 낱말 하나"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "풍속계",
        "바람의 빠르기를 재는 도구"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "4640602b8bf22ab5"
  }
};
const bankReview={
  "c22-s52-u03-b004": {
    "prompt": "안개가 꼈어요. 오후에도 비가 올까요? 내 생각과 더 보고 싶은 날씨 자료 하나를 짝과 말하거나 한 줄로 쓰세요.",
    "answer": "비가 올지는 아직 모르겠어요. 오후 강수 예보를 보고 싶어요.",
    "explanation": "다른 예상도 말할 수 있어요. 같은 지역의 오후 최신 예보와 관측을 확인해 처음 생각과 비교해요.",
    "misconception": "안개만 보고 오후에 반드시 비가 온다고 정하지 않아요.",
    "required": [
      "처음 생각과 확인할 날씨 자료 하나"
    ],
    "lines": 1,
    "before": [
      "2c5f520413269efa"
    ]
  },
  "c22-s52-u03-b010": {
    "prompt": "A는 그늘에서 10시에, B는 햇빛에 달궈진 벽 옆에서 14시에 기온을 쟀어요. 두 관측은 장소뿐 아니라 잰 (1)[ ]도 달라요. 보기: 시각·단위",
    "answer": "시각",
    "explanation": "10시와 14시로 관측한 시각이 달라요. 장소와 빛의 조건도 맞추어 비교해요.",
    "misconception": "여러 조건이 다른 결과를 장소 하나의 영향이라고 하지 않아요.",
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
            "시각",
            "시간",
            "관측 시각",
            "측정 시각"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "4eda8b0cc7ea2ac2"
    ]
  },
  "c22-s52-u03-b016": {
    "prompt": "기온이 다른 두 방의 습도가 모두50%예요. 공기 중 수증기의 양도 같다고 할 수 있을까요? 까닭을 짧게 쓰세요.",
    "answer": "그렇지 않아요. 습도는 기온의 영향도 받아요.",
    "explanation": "습도 숫자만으로 수증기의 양을 정하지 않아요. 기온과 공기의 부피 등 조건도 함께 살펴요.",
    "misconception": "습도50%를 수증기50g이나 항상 같은 양이라고 읽지 않아요.",
    "required": [
      "습도가 기온의 영향도 받으므로 같은 수증기 양이라고 정할 수 없다는 설명"
    ],
    "lines": 1,
    "before": [
      "b19212e3bf758df9"
    ]
  },
  "c22-s52-u03-b022": {
    "prompt": "두 컵을 비교하다가 한 컵 바깥에 물방울이 생겼어요. 컵에서 물이 샌 것인지 알아볼 방법을 고르세요.",
    "answer": "②",
    "explanation": "컵에 새는 곳이 있는지 확인해요. 처음 바깥의 물기와 튀는 물도 살핀 뒤 물방울이 생긴 까닭을 설명해요.",
    "misconception": "바깥 물방울을 보자마자 모두 응결한 물이라고 정하지 않아요.",
    "form": "choice",
    "choices": [
      "물방울이 생긴 컵을 더 큰 컵으로 바꾼다.",
      "컵에 갈라지거나 새는 곳이 있는지 살핀다.",
      "물방울의 개수로 컵 안 물의 온도를 정한다."
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
      "f5f5831238ca0798"
    ]
  },
  "c22-s52-u03-b034": {
    "prompt": "작은 창문으로 본 하늘에 구름이 가득해요. 하늘 전체의 구름 양을 알아볼 방법을 고르세요.",
    "answer": "③",
    "explanation": "창문으로 보이는 하늘은 일부예요. 다른 방향을 함께 살펴 구름의 양을 비교해요. 태양을 직접 보지 않아요.",
    "misconception": "좁은 사진 한 장을 하늘 전체의 모습으로 정하지 않아요.",
    "form": "choice",
    "choices": [
      "창문으로 본 구름만 세어 하늘 전체를 정한다.",
      "같은 창문에서 구름 한 개를 더 크게 본다.",
      "같은 시각에 다른 방향의 하늘도 살펴본다."
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
      "b1d64adc76b80cca"
    ]
  },
  "c22-s52-u03-b052": {
    "prompt": "내일 비가 올 것이라는 자료를 오늘의 관측값이라고 썼어요. 자료 이름을 내일 (1)[ ]로 고쳐요. 보기: 예보·관측",
    "answer": "예보",
    "explanation": "앞으로의 날씨를 예상하여 알리는 자료는 예보예요. 지역과 발표 시각, 어느 때의 예보인지도 확인해요.",
    "misconception": "앞으로의 예보를 이미 직접 관측한 결과라고 쓰지 않아요.",
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
            "예보",
            "날씨 예보",
            "일기 예보",
            "내일 예보"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "36e239a892a1776e"
    ]
  },
  "c22-s52-u03-b056": {
    "prompt": "09시는 16℃, 15시는 20℃였고 12시는 재지 못했어요. 12시 칸에는 (1)[ ]이라고 표시해요. 보기: 18℃·재지 못함",
    "answer": "재지 못함",
    "explanation": "두 값 사이의 18℃는 예상한 값일 수 있지만 실제로 잰 값이 아니에요. 실제로 재지 못한 칸은 그대로 표시해요.",
    "misconception": "재지 않은 시간의 값을 실제 관측값으로 채우지 않아요.",
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
            "재지 못함",
            "재지못함",
            "측정하지 못함",
            "미측정"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "9b5409fb29a01b91"
    ]
  },
  "c22-s52-u03-b063": {
    "prompt": "모래는 햇빛에서, 물은 그늘에서 관찰했어요. 두 재료가 데워지는 모습을 비교할 방법을 고르세요.",
    "answer": "①",
    "explanation": "두 재료의 차이를 비교하려면 빛 조건을 같게 해요. 양·용기·처음 온도·감지 위치·관측 시각도 확인해요.",
    "misconception": "빛과 재료가 함께 다른 결과를 재료만의 영향이라고 하지 않아요.",
    "form": "choice",
    "choices": [
      "두 재료가 같은 빛을 받게 한다.",
      "모래에만 빛을 더 비추어 준다.",
      "모래와 물을 서로 다른 때에 잰다."
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
      "b7c6d78053c285f2"
    ]
  },
  "c22-s52-u03-b067": {
    "prompt": "우리 학교의 내일 야외 활동을 안내하려고 해요. (1)[ ]가 있는 지역의 예보를 찾아요. 보기: 학교·친구의 여행지",
    "answer": "학교",
    "explanation": "야외 활동을 할 학교가 있는 지역의 예보를 찾아요. 활동할 날짜와 시각에 맞는 최신 예보를 확인해요.",
    "misconception": "다른 지역의 예보를 우리 학교 날씨와 같다고 쓰지 않아요.",
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
            "학교",
            "우리 학교",
            "우리학교"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "7be32d9c52e6b66e"
    ]
  },
  "c22-s52-u03-b072": {
    "prompt": "학생이 안개 모형을 보려고 뜨거운 물을 붓고 향을 피우자고 해요. 안전한 방법을 고르세요.",
    "answer": "②",
    "explanation": "뜨거운 물·불·향은 학생이 직접 다루지 않아요. 선생님이 준비한 안전한 시범이나 영상에서 벽의 물방울과 공기 중 흐림을 나누어 관찰해요.",
    "misconception": "관찰을 위해 학생이 직접 향을 피우거나 뜨거운 물을 붓지 않아요.",
    "form": "choice",
    "choices": [
      "친구가 컵을 잡고 학생이 뜨거운 물을 붓는다.",
      "선생님이 안전하게 준비한 시범이나 영상을 본다.",
      "학생이 향을 더 피워 흐림을 짙게 만든다."
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
      "bfb6399b9b3c7b29"
    ]
  },
  "c22-s52-u03-b075": {
    "prompt": "모래와 물의 온도는 쟀지만 공기 흐름은 보지 못했어요. 공기 흐름 칸에 알맞은 기록을 고르세요.",
    "answer": "③",
    "explanation": "온도와 시각은 실제로 잰 그대로 남겨요. 온도만으로 직접 보지 못한 공기 흐름까지 관찰했다고 쓰지 않아요.",
    "misconception": "온도를 쟀다는 이유로 바람까지 직접 보았다고 쓰지 않아요.",
    "form": "choice",
    "choices": [
      "따뜻한 쪽으로 공기가 움직였다.",
      "두 재료 사이에서 공기가 멈췄다.",
      "공기 흐름은 관찰하지 못했다."
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
      "429480dedded1ffc"
    ]
  },
  "c22-s52-u03-b077": {
    "prompt": "친구가 인터넷에서 내가 읽은 날씨 자료를 다시 열어 보려고 해요. 자료의 인터넷 (1)[ ]를 남겨요. 보기: 주소·글자 색",
    "answer": "주소",
    "explanation": "인터넷 주소를 남기면 친구가 같은 자료를 다시 열어 볼 수 있어요. 자료 제목·기관·확인 날짜도 함께 남기면 좋아요.",
    "misconception": "출처만 적고 자료에서 확인한 내용을 생략하지 않아요.",
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
            "주소",
            "인터넷 주소",
            "웹 주소",
            "URL",
            "url",
            "링크"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "3df9d4fb46368d4d"
    ]
  },
  "c22-s52-u03-b078": {
    "prompt": "오전 09시 기온만 보고 오후 운동장 활동을 정하려고 해요. 오후에 비가 올지 알아볼 자료를 고르세요.",
    "answer": "①",
    "explanation": "활동할 지역과 오후 시각에 맞는 강수 예보를 보아요. 최신 관측과 바람·기온도 함께 확인해요.",
    "misconception": "오전 기온 하나로 오후의 모든 날씨를 정하지 않아요.",
    "form": "choice",
    "choices": [
      "학교가 있는 지역의 오후 강수 예보",
      "다른 지역의 어제 오후 기온",
      "학교가 있는 지역의 오전 기온만"
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
      "0cb810ba758daac0"
    ]
  },
  "c22-s52-u03-b079": {
    "prompt": "비의 양을 읽지 못했는데 0mm라고 썼어요. 바르게 고친 기록을 고르세요.",
    "answer": "②",
    "explanation": "읽지 못한 값과 실제로 확인한 0mm는 달라요. 재지 못한 까닭을 남기고, 다른 자료를 쓰면 내 관측값과 구별해요.",
    "misconception": "못 잰 것과 실제로 비가0mm인 것을 같게 쓰지 않아요.",
    "form": "choice",
    "choices": [
      "비가 오지 않았으므로 0mm",
      "재지 못함",
      "예보에 나온 비의 양을 내 관측값으로 기록"
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
      "2537f66a240dc2e4"
    ]
  },
  "c22-s52-u03-b084": {
    "prompt": "기온이 같은 두 날에도 젖은 운동장이 마르는 빠르기가 달랐어요. 기온 말고 더 살펴볼 기상 요소 하나를 낱말로 쓰세요.",
    "answer": "바람 또는 습도",
    "explanation": "바람·습도·구름의 양·비의 양 등을 더 살펴볼 수 있어요. 햇빛과 운동장의 재료·처음 젖은 정도도 영향을 줄 수 있어요.",
    "misconception": "기온이 같으면 마르는 빠르기도 반드시 같다고 하지 않아요.",
    "form": "short",
    "required": [
      "알맞은 낱말 하나"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "바람",
        "바람의 빠르기",
        "풍속",
        "습도",
        "구름의 양",
        "구름 양",
        "운량",
        "강수",
        "강수량",
        "비",
        "비의 양"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "394143f533616acb"
    ]
  },
  "c22-s52-u03-b088": {
    "prompt": "잰 기온이 예상보다 낮게 나왔어요. 원래 값을 지우고 높여 써도 될까요? 어떻게 해야 할지 짧게 쓰세요.",
    "answer": "원래 값을 남기고 도구와 조건을 확인해 다시 재어요.",
    "explanation": "감지 부분·표시의 안정·빛과 주변 조건을 확인해요. 다시 잰 값과 점검한 내용도 함께 남겨요.",
    "misconception": "예상과 다르다는 이유로 직접 잰 값을 바꾸지 않아요.",
    "required": [
      "원래 관측값을 보존하며 도구·조건 점검 또는 실제 재측정"
    ],
    "lines": 1,
    "before": [
      "4575bd220ec7abb8"
    ]
  },
  "c22-s52-u03-b092": {
    "prompt": "컵에 물을 붓다가 바깥에 물이 튀었어요. 응결한 물방울을 관찰하기 전에 컵 바깥을 닦아 (1)[ ] 해요. 보기: 마르게·젖게",
    "answer": "마르게",
    "explanation": "먼저 튄 물을 닦아 마르게 해요. 컵이 새는지도 살피고, 그 뒤 생기는 물방울을 같은 시각에 관찰해요.",
    "misconception": "튀어 묻은 물을 응결의 증거로 쓰지 않아요.",
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
            "마르게",
            "건조하게"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "a92fc0f627f71c28"
    ]
  },
  "c22-s52-u03-b100": {
    "prompt": "A의 기온은 30℃, B는 20℃예요. 실제로 어느 곳의 기압이 더 낮은지 알려면 두 곳의 (1)[ ]을 더 재요. 보기: 기압·구름의 양",
    "answer": "기압",
    "explanation": "기온 하나만으로 실제 지표 기압을 정하지 않아요. 같은 높이와 시각 등 기준을 맞추어 기압을 비교해요.",
    "misconception": "더 더운 곳이면 반드시 저기압이라고 정하지 않아요.",
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
            "기압"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "aaae06a145da0a53"
    ]
  },
  "c22-s52-u03-b107": {
    "prompt": "15시 비 예보와 실제 15시에 비가 오지 않은 관측이 달라요. 알맞게 남긴 기록을 고르세요.",
    "answer": "①",
    "explanation": "예보와 실제 관측은 서로 다른 자료예요. 같은 날짜·지역·대상 시각인지 확인하고 발표 시각과 실제 관측 시각을 함께 남겨요.",
    "misconception": "실제 결과에 맞추어 옛 예보를 몰래 고치거나 관측을 지우지 않아요.",
    "form": "choice",
    "choices": [
      "예보와 관측을 나누어 둘 다 남긴다.",
      "실제 관측을 지우고 예보와 같게 고친다.",
      "예보를 지우고 처음부터 비 예보가 없었다고 쓴다."
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
      "3255399c4e79e1de"
    ]
  },
  "c22-s52-u03-b110": {
    "prompt": "같은 높이에서 잰 두 곳의 기압은 1004hPa와 1010hPa예요. 둘 중 더 높은 기압은 (1)[ ]hPa예요. 보기: 1004·1010",
    "answer": "1010",
    "explanation": "1010hPa가 1004hPa보다 높아요. 고기압과 저기압은 주변과 비교하며 1013hPa를 고정된 경계로 쓰지 않아요.",
    "misconception": "1013hPa보다 낮은 두 곳은 비교할 수 없다고 하지 않아요.",
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
            "1010",
            "1010hPa",
            "1010 hPa"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "cdaea18574750837"
    ]
  },
  "c22-s52-u03-b111": {
    "prompt": "낮이라고 실제 바닷가에 해풍이 불었다고 적으려 해요. 먼저 확인할 자료를 고르세요.",
    "answer": "③",
    "explanation": "해륙풍 모형의 온도 차이와 실제 바닷가의 바람은 나누어 살펴요. 실제 바람에는 큰 기압 분포와 지형도 영향을 주므로 그곳의 풍향을 확인해요.",
    "misconception": "모형의 바람 방향을 모든 실제 바닷가에 그대로 적용하지 않아요.",
    "form": "choice",
    "choices": [
      "다른 지역에서 어제 잰 기온",
      "모래와 물의 온도를 비교한 결과만",
      "그 바닷가에서 그 시각에 관측한 풍향"
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
      "5629592085b9ee22"
    ]
  },
  "c22-s52-u03-b112": {
    "prompt": "방위를 확인한 풍향계의 화살 머리가 북쪽을 가리켜요. 바람의 빠르기는 어떤 도구로 더 잴까요? 도구 이름을 쓰세요.",
    "answer": "풍속계",
    "explanation": "풍향계로 바람이 불어오는 방향을 살펴요. 바람의 빠르기는 풍속계로 재고 단위도 함께 읽어요.",
    "misconception": "풍향계의 방향만으로 풍속까지 알 수는 없어요.",
    "form": "short",
    "required": [
      "알맞은 낱말 하나"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "풍속계",
        "바람의 빠르기를 재는 도구"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "f7cf9e16565f3910"
    ]
  }
};
const questionTitles={};
const studyMethodBefore="개념과 예제를 읽고 여러 가지 문제를 풀어 보아요. 실험과 관측에서는 장소·시각·조건을 함께 적어요. 오른쪽에서는 핵심을 정리하고 더 깊은 내용을 알아볼 수 있어요.";
const clone=x=>JSON.parse(JSON.stringify(x));
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const banks=new WeakMap(),books=new WeakMap(),labels={choice:'객관식',blank:'빈칸 넣기',short:'단답형',written:'까닭 설명',draw:'그림 설명'};
const response=e=>e.contract?clone(e.contract):{kind:Object.hasOwn(e,'drawingExplanationLines')?'drawing':'written-explanation',teacherRequired:true,actualPerformanceMustNotBeInferred:true,sample:e.answer,required:[...e.required]};
function answerContract(e){const c=response(e);return{type:e.form==='choice'?'single-choice':e.contract?'short-text':'written-explanation',...(e.form==='choice'?{answer:e.key,accepted:[e.key]}:e.contract?{answer:e.answer,accepted:c.accepted||[e.answer],inputHint:c.parts?'빈칸의 답을 쉼표로 나누어 차례대로 써요.':'짧은 낱말로 답해요.'}:{sample:e.answer,teacherRequired:true,reviewRequired:true,rubric:{required:[...e.required],pass:'뜻이 같은 짧은 답과 알맞은 이름표는 교사가 확인해요.'}}),seasonContract:c};}
export function weatherMixedItems(rows,u){
 if(u!==unit||!rows?.length)return rows;let changed=false;
 const next=rows.map(q=>{const e=bankReview[q.id];if(!e||q.status!=='authored'||q.sourceRef?.type!=='authored-supplement'||!e.before.includes(fingerprint(q)))return q;changed=true;if(banks.has(q))return banks.get(q);
 const result={...q,prompt:e.prompt,explanation:e.explanation,misconception:e.misconception,responseContract:response(e),answerContract:answerContract(e),...(q.diagnosticOverride?{diagnosticOverride:{...q.diagnosticOverride,version:WEATHER_MIXED_VERSION}}:{}),...(e.form?{bookResponseForm:e.form,taxonomy:{...q.taxonomy,format:labels[e.form]},choices:e.choices?clone(e.choices):null,diagnosticOverride:{version:WEATHER_MIXED_VERSION,distractors:null,typed:null,cloze:null,cells:null}}:{}),weatherMixedResponse:WEATHER_MIXED_VERSION,contentVersion:WEATHER_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};banks.set(q,result);return result;});return changed?next:rows;
}
export function withWeatherMixedClassroom(u,mod){if(u!==unit)return mod;const classroomItems=weatherMixedItems(mod?.classroomItems,u);return classroomItems===mod.classroomItems?mod:{...mod,classroomItems};}
export function withWeatherMixedWorkbook(w){
 if(w?.unit!==unit||fingerprint(w)!==prior)return w;if(books.has(w))return books.get(w);
 const questions=w.questions.map(q=>{const e=review[q.no];if(!e||fingerprint(q)!==e.before)return q;const result={...q,prompt:e.prompt,answer:e.answer,explanation:e.explanation,misconception:e.misconception,requirements:[...e.required],criteria:e.required.join(' / '),responseContract:response(e),weatherMixedResponse:WEATHER_MIXED_VERSION,contentVersion:WEATHER_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};for(const k of['form','choices','key','lines'])if(Object.hasOwn(e,k))result[k]=clone(e[k]);if(e.form){result.bookResponseForm=e.form;result.formLabel=labels[e.form];delete result.lines;}return result;});
 const revisePage=p=>{const first=p.blocks.flatMap(b=>b.ids||[])[0],n=Number(first?.slice(-3));return{...p,title:questionTitles[n]||p.title,blocks:p.blocks.map(b=>b.type==='text'&&b.text===studyMethodBefore?{...b,text:'개념과 예제로 날씨를 알아보아요. 고르기·빈칸·짧은 답으로 확인하고, 비교한 까닭은 짧게 설명해요. 실제 관측값은 장소·시각과 함께 표에 남겨요.'}:b)};};
 const pages=w.pages.map(revisePage),teacherStudentPages=w.teacherStudentPages.map(revisePage),teacherPages=w.teacherPages;
 const figures={...w.figures},byNo=new Map(questions.map(q=>[q.no,q]));for(const key of w.quickPages.flatMap(p=>p.blocks.filter(b=>b.type==='diagram').map(b=>b.key)))figures[key]=figures[key].replace(/(<tr><th scope="row">)(\d+)(<\/th><td>)([\s\S]*?)(<\/td><td>)([\s\S]*?)(<\/td><\/tr>)/g,(row,a,n,b,form,c,answer,d)=>{const q=byNo.get(Number(n));return review[n]||q.form==='choice'?a+n+b+(review[n]?labels[q.form]:form)+c+(q.form==='choice'?(Array.isArray(q.key)?q.key.map(i=>'①②③④⑤'[i]).join(', '):'①②③④⑤'[q.key]):q.form==='written'?'교사 확인':q.answer)+d:row;});
 const result={...w,questions,pages,teacherStudentPages,teacherPages,figures};books.set(w,result);return result;
}
