// Grade-four sky tasks mix recognition with a few brief explanations.
export const SKY_MIXED_VERSION='20261124-sky-mixed-responses';
const unit='c22-s42-u01',prior='d6433c81d3a126f7';
const review={
  "11": {
    "prompt": "사진에서 어둡게 보이는 부분에 물이 있다고 단정할 수 있을까요? 까닭을 짧게 쓰세요.",
    "form": "written",
    "answer": "어둡다는 것만으로 물이 있는지는 알 수 없어요.",
    "explanation": "짙은 부분이 보인다는 것은 사진에서 확인할 수 있어요. 그곳에 물이 고여 있다는 생각은 다른 자료로 더 확인해야 해요.",
    "required": [
      "사진의 밝기만으로 물의 유무를 정할 수 없다는 설명"
    ],
    "misconception": "사진·프로그램·모형에서 알 수 있는 것과 직접 관찰한 것을 구별해요.",
    "contract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "sample": "어둡다는 것만으로 물이 있는지는 알 수 없어요.",
      "required": [
        "사진의 밝기만으로 물의 유무를 정할 수 없다는 설명"
      ]
    },
    "before": "584acc9fb79a8a49"
  },
  "17": {
    "prompt": "두 기록만 보고 알 수 있는 것을 고르세요.",
    "form": "choice",
    "choices": [
      "그 사이에도 날마다 둥근 달이 보였다.",
      "그 사이에는 달이 보이지 않았다.",
      "그 사이의 달 모습은 이 기록만으로 알 수 없다."
    ],
    "key": 2,
    "answer": "③",
    "explanation": "사이 날짜의 기록이 없으므로 그동안 날마다 어떤 달이 보였는지는 알 수 없어요.",
    "required": [
      "자료에 맞는 답"
    ],
    "misconception": "사진·프로그램·모형에서 알 수 있는 것과 직접 관찰한 것을 구별해요.",
    "contract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": 2
    },
    "before": "af864e0993605b13"
  },
  "38": {
    "prompt": "두 행성의 모습을 비교하려고 해요. 두 행성에 똑같이 적용할 비교 기준을 하나만 쓰세요.",
    "form": "written",
    "answer": "고리가 있는지 비교해요.",
    "explanation": "같은 기준으로 두 행성을 살펴요. 카드에 없는 정보는 더 조사할 것으로 남기고 자료를 다시 찾을 출처도 확인해요.",
    "required": [
      "표면 무늬·구름·고리 등 두 행성에 함께 적용할 수 있는 기준 하나"
    ],
    "misconception": "사진·프로그램·모형에서 알 수 있는 것과 직접 관찰한 것을 구별해요.",
    "contract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "sample": "고리가 있는지 비교해요.",
      "required": [
        "표면 무늬·구름·고리 등 두 행성에 함께 적용할 수 있는 기준 하나"
      ]
    },
    "before": "d2b0578da75a8d93"
  },
  "40": {
    "prompt": "같은 크기의 공을 같은 간격에 둔 이 모형으로 알 수 있는 것을 고르세요.",
    "form": "choice",
    "choices": [
      "태양에서 가까운 행성의 순서",
      "실제 행성의 크기 차이",
      "실제 행성 사이의 거리 차이"
    ],
    "key": 0,
    "answer": "①",
    "explanation": "이름표를 붙인 공의 순서로 행성의 순서는 나타내요. 공의 크기와 간격이 모두 같으므로 실제 크기와 거리 차이는 알 수 없어요.",
    "required": [
      "자료에 맞는 답"
    ],
    "misconception": "사진·프로그램·모형에서 알 수 있는 것과 직접 관찰한 것을 구별해요.",
    "contract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": 0
    },
    "before": "d0244c9a2f8e285c"
  },
  "65": {
    "prompt": "밝게 보이는 별이 북극성인지 확인할 때 함께 살펴볼 것을 고르세요.",
    "form": "choice",
    "choices": [
      "그날 구름의 색",
      "북쪽 방향과 북두칠성·카시오페이아자리의 별 배열",
      "달에서 가장 어둡게 보이는 부분"
    ],
    "key": 1,
    "answer": "②",
    "explanation": "북극성은 가장 밝은 별이라는 뜻이 아니에요. 북쪽 방향과 주변 별들의 배열을 함께 살펴보아요.",
    "required": [
      "자료에 맞는 답"
    ],
    "misconception": "사진·프로그램·모형에서 알 수 있는 것과 직접 관찰한 것을 구별해요.",
    "contract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": 1
    },
    "before": "72f756c323c7b559"
  },
  "67": {
    "prompt": "프로그램으로 별자리를 살펴본 활동을 바르게 적은 것을 고르세요.",
    "form": "choice",
    "choices": [
      "밖에서 직접 별자리를 보았다.",
      "오늘 밤하늘의 별자리를 직접 찍었다.",
      "프로그램 화면에서 별자리를 살펴보았다."
    ],
    "key": 2,
    "answer": "③",
    "explanation": "직접 하늘을 보지 않았다면 프로그램 화면을 살펴보았다고 적어요.",
    "required": [
      "자료에 맞는 답"
    ],
    "misconception": "사진·프로그램·모형에서 알 수 있는 것과 직접 관찰한 것을 구별해요.",
    "contract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": 2
    },
    "before": "cf6eefdd249bbd37"
  },
  "30": {
    "prompt": "태양계에는 태양 말고 무엇이 있는지 한 문장으로 써 보세요.",
    "answer": "태양의 영향을 받는 여러 천체와 그 천체들이 있는 공간이 있어요.",
    "required": [
      "태양의 영향을 받는 여러 천체와 그 천체들이 있는 공간을 포함한 설명"
    ],
    "form": "written",
    "explanation": "태양계에는 태양뿐 아니라 행성 등 여러 천체와 그 천체들이 있는 공간도 포함돼요. “태양계는 태양 하나만을 뜻한다”는 설명을 이 내용에 맞게 고쳐요.",
    "misconception": "사진·프로그램·모형에서 알 수 있는 것과 직접 관찰한 것을 구별해요.",
    "contract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "sample": "태양의 영향을 받는 여러 천체와 그 천체들이 있는 공간이 있어요.",
      "required": [
        "태양의 영향을 받는 여러 천체와 그 천체들이 있는 공간을 포함한 설명"
      ]
    },
    "before": "71ab8385cf229cfb"
  },
  "62": {
    "prompt": "북극성이 밤에 바다에서 방향을 찾는 데 도움이 되는 까닭을 한 문장으로 써 보세요.",
    "answer": "북극성을 찾으면 북쪽 방향을 알 수 있기 때문이에요.",
    "required": [
      "북극성으로 북쪽 방향을 찾을 수 있다는 설명"
    ],
    "form": "written",
    "explanation": "밤에 바다에서는 길의 방향을 알려 주는 표지판을 찾기 어려워요. 북극성은 북쪽 방향을 찾는 데 도움이 되므로, 배가 나아갈 방향을 정하는 데 이용할 수 있었어요.",
    "misconception": "사진·프로그램·모형에서 알 수 있는 것과 직접 관찰한 것을 구별해요.",
    "contract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "sample": "북극성을 찾으면 북쪽 방향을 알 수 있기 때문이에요.",
      "required": [
        "북극성으로 북쪽 방향을 찾을 수 있다는 설명"
      ]
    },
    "before": "3b8c6b507088a0de"
  }
};
const bankReview={
  "c22-s42-u01-b05": {
    "prompt": "사진에서 어둡게 보이는 부분에 물이 있다고 단정할 수 있을까요? 까닭을 짧게 쓰세요.",
    "form": "written",
    "answer": "어둡다는 것만으로 물이 있는지는 알 수 없어요.",
    "explanation": "짙은 부분이 보인다는 것은 사진에서 확인할 수 있어요. 그곳에 물이 고여 있다는 생각은 다른 자료로 더 확인해야 해요.",
    "required": [
      "사진의 밝기만으로 물의 유무를 정할 수 없다는 설명"
    ],
    "misconception": "사진·프로그램·모형에서 알 수 있는 것과 직접 관찰한 것을 구별해요.",
    "contract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "sample": "어둡다는 것만으로 물이 있는지는 알 수 없어요.",
      "required": [
        "사진의 밝기만으로 물의 유무를 정할 수 없다는 설명"
      ]
    },
    "before": [
      "649ae80143c5afe3"
    ]
  },
  "c22-s42-u01-b10": {
    "prompt": "자료 B에 붙일 설명으로 알맞은 것을 고르세요.",
    "form": "choice",
    "choices": [
      "내가 직접 찍은 달 사진",
      "내일 달의 모습을 예상한 그림",
      "천체 관측 프로그램에서 저장한 화면"
    ],
    "key": 2,
    "answer": "③",
    "explanation": "자료 B는 프로그램에서 저장한 화면이에요. 직접 찍은 사진과 구별해서 표시해요.",
    "required": [
      "자료에 맞는 답"
    ],
    "misconception": "사진·프로그램·모형에서 알 수 있는 것과 직접 관찰한 것을 구별해요.",
    "contract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": 2
    },
    "before": [
      "b31412f25967fab8"
    ]
  },
  "c22-s42-u01-b15": {
    "prompt": "표에 나타난 며칠 동안 달의 밝은 부분은 어떻게 달라졌나요?",
    "form": "choice",
    "choices": [
      "점점 작아졌다.",
      "점점 커졌다.",
      "계속 반달 모양이었다."
    ],
    "key": 1,
    "answer": "②",
    "explanation": "상현달에서 보름달로 가는 동안 밝게 보이는 부분이 점점 커졌어요.",
    "required": [
      "자료에 맞는 답"
    ],
    "misconception": "사진·프로그램·모형에서 알 수 있는 것과 직접 관찰한 것을 구별해요.",
    "contract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": 1
    },
    "before": [
      "4240a356140f37e8"
    ]
  },
  "c22-s42-u01-b20": {
    "prompt": "밤에 달을 안전하게 관찰할 계획을 고르세요.",
    "form": "choice",
    "choices": [
      "보호자와 함께 안전한 장소에서 관찰한다.",
      "혼자 어두운 골목에서 관찰한다.",
      "차가 다니는 도로에 서서 관찰한다."
    ],
    "key": 0,
    "answer": "①",
    "explanation": "보호자와 함께 안전한 장소와 시간을 정해 관찰해요.",
    "required": [
      "자료에 맞는 답"
    ],
    "misconception": "사진·프로그램·모형에서 알 수 있는 것과 직접 관찰한 것을 구별해요.",
    "contract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": 0
    },
    "before": [
      "d03f8d22b8de5444"
    ]
  },
  "c22-s42-u01-b25": {
    "prompt": "A·B·C 중 학생이 직접 본 달의 기록은 어느 것인가요? 기호 하나를 쓰세요.",
    "form": "short",
    "answer": "A",
    "accepted": [
      "A",
      "a",
      "에이"
    ],
    "explanation": "A는 창밖에서 직접 본 달을 그린 기록이에요. B는 예상이고 C는 기관에서 제공한 사진이에요.",
    "required": [
      "자료에 맞는 답"
    ],
    "misconception": "사진·프로그램·모형에서 알 수 있는 것과 직접 관찰한 것을 구별해요.",
    "contract": {
      "kind": "short-text",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": "A",
      "accepted": [
        "A",
        "a",
        "에이"
      ]
    },
    "before": [
      "7bcdfbe84270d992"
    ]
  },
  "c22-s42-u01-b30": {
    "prompt": "두 기록만 보고 알 수 있는 것을 고르세요.",
    "form": "choice",
    "choices": [
      "그 사이에도 날마다 둥근 달이 보였다.",
      "그 사이에는 달이 보이지 않았다.",
      "그 사이의 달 모습은 이 기록만으로 알 수 없다."
    ],
    "key": 2,
    "answer": "③",
    "explanation": "사이 날짜의 기록이 없으므로 그동안 날마다 어떤 달이 보였는지는 알 수 없어요.",
    "required": [
      "자료에 맞는 답"
    ],
    "misconception": "사진·프로그램·모형에서 알 수 있는 것과 직접 관찰한 것을 구별해요.",
    "contract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": 2
    },
    "before": [
      "630da80664f7b00c"
    ]
  },
  "c22-s42-u01-b35": {
    "prompt": "태양을 행성이라고 부르면 안 되는 까닭을 짧게 쓰세요.",
    "form": "written",
    "answer": "태양은 스스로 빛을 내는 별이기 때문이에요.",
    "explanation": "태양계에는 여러 종류의 천체가 있어요. 태양은 별, 지구는 행성, 달은 지구의 위성이에요.",
    "required": [
      "태양은 스스로 빛을 내는 별이라는 설명"
    ],
    "misconception": "사진·프로그램·모형에서 알 수 있는 것과 직접 관찰한 것을 구별해요.",
    "contract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "sample": "태양은 스스로 빛을 내는 별이기 때문이에요.",
      "required": [
        "태양은 스스로 빛을 내는 별이라는 설명"
      ]
    },
    "before": [
      "b62d8d937eef6a85"
    ]
  },
  "c22-s42-u01-b40": {
    "prompt": "기관의 태양 사진을 살펴본 뒤 쓸 기록으로 알맞은 것을 고르세요.",
    "form": "choice",
    "choices": [
      "맨눈으로 태양의 모습을 보았다.",
      "기관에서 제공한 태양 사진을 살펴보았다.",
      "망원경으로 태양을 직접 보았다."
    ],
    "key": 1,
    "answer": "②",
    "explanation": "사진을 살펴본 활동은 사진을 보았다고 적어요. 태양을 맨눈이나 쌍안경·망원경으로 직접 보지 않아요.",
    "required": [
      "자료에 맞는 답"
    ],
    "misconception": "사진·프로그램·모형에서 알 수 있는 것과 직접 관찰한 것을 구별해요.",
    "contract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": 1
    },
    "before": [
      "009790eb9410f395"
    ]
  },
  "c22-s42-u01-b45": {
    "prompt": "두 행성의 모습을 비교하려고 해요. 두 행성에 똑같이 적용할 비교 기준을 하나만 쓰세요.",
    "form": "written",
    "answer": "고리가 있는지 비교해요.",
    "explanation": "같은 기준으로 두 행성을 살펴요. 카드에 없는 정보는 더 조사할 것으로 남기고 자료를 다시 찾을 출처도 확인해요.",
    "required": [
      "표면 무늬·구름·고리 등 두 행성에 함께 적용할 수 있는 기준 하나"
    ],
    "misconception": "사진·프로그램·모형에서 알 수 있는 것과 직접 관찰한 것을 구별해요.",
    "contract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "sample": "고리가 있는지 비교해요.",
      "required": [
        "표면 무늬·구름·고리 등 두 행성에 함께 적용할 수 있는 기준 하나"
      ]
    },
    "before": [
      "b705424b17265479"
    ]
  },
  "c22-s42-u01-b50": {
    "prompt": "해왕성 카드의 자료를 다시 찾는 데 도움이 되는 정보를 고르세요.",
    "form": "choice",
    "choices": [
      "카드를 꾸민 색",
      "카드에 붙일 별명",
      "자료의 제목과 인터넷 주소"
    ],
    "key": 2,
    "answer": "③",
    "explanation": "자료의 제목과 인터넷 주소를 적으면 같은 자료를 다시 찾을 수 있어요.",
    "required": [
      "자료에 맞는 답"
    ],
    "misconception": "사진·프로그램·모형에서 알 수 있는 것과 직접 관찰한 것을 구별해요.",
    "contract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": 2
    },
    "before": [
      "15127972dfb7e614"
    ]
  },
  "c22-s42-u01-b55": {
    "prompt": "같은 크기의 공을 같은 간격에 둔 이 모형으로 알 수 있는 것을 고르세요.",
    "form": "choice",
    "choices": [
      "태양에서 가까운 행성의 순서",
      "실제 행성의 크기 차이",
      "실제 행성 사이의 거리 차이"
    ],
    "key": 0,
    "answer": "①",
    "explanation": "이름표를 붙인 공의 순서로 행성의 순서는 나타내요. 공의 크기와 간격이 모두 같으므로 실제 크기와 거리 차이는 알 수 없어요.",
    "required": [
      "자료에 맞는 답"
    ],
    "misconception": "사진·프로그램·모형에서 알 수 있는 것과 직접 관찰한 것을 구별해요.",
    "contract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": 0
    },
    "before": [
      "c40be0d1a32c913f"
    ]
  },
  "c22-s42-u01-b60": {
    "prompt": "다음 시간에는 모형이 실제 크기와 거리 비율을 나타내지 않는다는 무엇을 붙이기로 했나요? 자료에서 찾아 쓰세요.",
    "form": "short",
    "answer": "설명판",
    "accepted": [
      "설명판",
      "설명 판",
      "모형의 설명판",
      "크기와 거리 비율 설명판"
    ],
    "explanation": "자료에서 다음 시간에 추가할 것으로 적은 것은 설명판이에요. 이 모형이 실제 크기와 거리 비율을 나타내지 않는다는 내용을 붙이기로 했어요.",
    "required": [
      "자료에 맞는 답"
    ],
    "misconception": "사진·프로그램·모형에서 알 수 있는 것과 직접 관찰한 것을 구별해요.",
    "contract": {
      "kind": "short-text",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": "설명판",
      "accepted": [
        "설명판",
        "설명 판",
        "모형의 설명판",
        "크기와 거리 비율 설명판"
      ]
    },
    "before": [
      "7bd296fac41dcbd8"
    ]
  },
  "c22-s42-u01-b65": {
    "prompt": "B가 밝게 보여도 별로 분류하지 않는 까닭을 짧게 쓰세요.",
    "form": "written",
    "answer": "스스로 빛을 내지 않고 태양 빛을 받아 보이기 때문이에요.",
    "explanation": "밤에 밝게 보이는지와 스스로 빛을 내는지는 달라요. B는 태양 빛을 받아 보이는 행성이에요.",
    "required": [
      "스스로 빛을 내는 별의 기준과 B의 반사한 빛을 구별한 설명"
    ],
    "misconception": "사진·프로그램·모형에서 알 수 있는 것과 직접 관찰한 것을 구별해요.",
    "contract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "sample": "스스로 빛을 내지 않고 태양 빛을 받아 보이기 때문이에요.",
      "required": [
        "스스로 빛을 내는 별의 기준과 B의 반사한 빛을 구별한 설명"
      ]
    },
    "before": [
      "a1e48b15ba4036cb"
    ]
  },
  "c22-s42-u01-b70": {
    "prompt": "밝게 보이는 별이 북극성인지 확인할 때 함께 살펴볼 것을 고르세요.",
    "form": "choice",
    "choices": [
      "그날 구름의 색",
      "북쪽 방향과 북두칠성·카시오페이아자리의 별 배열",
      "달에서 가장 어둡게 보이는 부분"
    ],
    "key": 1,
    "answer": "②",
    "explanation": "북극성은 가장 밝은 별이라는 뜻이 아니에요. 북쪽 방향과 주변 별들의 배열을 함께 살펴보아요.",
    "required": [
      "자료에 맞는 답"
    ],
    "misconception": "사진·프로그램·모형에서 알 수 있는 것과 직접 관찰한 것을 구별해요.",
    "contract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": 1
    },
    "before": [
      "71b395c1e75e95f7"
    ]
  },
  "c22-s42-u01-b75": {
    "prompt": "프로그램으로 별자리를 살펴본 활동을 바르게 적은 것을 고르세요.",
    "form": "choice",
    "choices": [
      "밖에서 직접 별자리를 보았다.",
      "오늘 밤하늘의 별자리를 직접 찍었다.",
      "프로그램 화면에서 별자리를 살펴보았다."
    ],
    "key": 2,
    "answer": "③",
    "explanation": "직접 하늘을 보지 않았다면 프로그램 화면을 살펴보았다고 적어요.",
    "required": [
      "자료에 맞는 답"
    ],
    "misconception": "사진·프로그램·모형에서 알 수 있는 것과 직접 관찰한 것을 구별해요.",
    "contract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": 2
    },
    "before": [
      "9becd141a9a976d7"
    ]
  },
  "c22-s42-u01-b80": {
    "prompt": "다음 시간에 보완할 내용을 고르세요.",
    "form": "choice",
    "choices": [
      "자료의 방향 표시",
      "오늘 고친 날짜 오타",
      "친구에게 자료를 보여 준 일"
    ],
    "key": 0,
    "answer": "①",
    "explanation": "날짜 오타는 이미 고쳤어요. 다음 시간에는 처음 기록을 확인해 방향 표시를 더하기로 했어요.",
    "required": [
      "자료에 맞는 답"
    ],
    "misconception": "사진·프로그램·모형에서 알 수 있는 것과 직접 관찰한 것을 구별해요.",
    "contract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": 0
    },
    "before": [
      "36df6865bbeae133"
    ]
  },
  "c22-s42-u01-t12": {
    "prompt": "모형 표에서 3일과 15일의 달이 보이는 방향은 어떻게 달라졌나요?",
    "form": "written",
    "answer": "서쪽에서 동쪽으로 달라졌어요.",
    "explanation": "모형은 같은 저녁 시각의 대표적인 모습을 비교한 자료예요. 3일은 서쪽, 15일은 동쪽으로 표시되어 있어요. 실제 날짜·계절의 정확한 위치를 정한 관측값은 아니에요.",
    "required": [
      "제시된 같은 저녁 시각 모형의 서쪽→동쪽 변화를 읽은 답"
    ],
    "misconception": "사진·프로그램·모형에서 알 수 있는 것과 직접 관찰한 것을 구별해요.",
    "contract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "sample": "서쪽에서 동쪽으로 달라졌어요.",
      "required": [
        "제시된 같은 저녁 시각 모형의 서쪽→동쪽 변화를 읽은 답"
      ]
    },
    "before": [
      "60d6dce5696f62fb"
    ]
  }
};
const clone=x=>JSON.parse(JSON.stringify(x));
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const banks=new WeakMap(),books=new WeakMap(),labels={choice:'객관식',blank:'빈칸 넣기',short:'단답형',written:'짧게 설명하기',draw:'그림 설명'};
const response=e=>e.contract?clone(e.contract):{kind:Object.hasOwn(e,'drawingExplanationLines')?'drawing':'written-explanation',teacherRequired:true,actualPerformanceMustNotBeInferred:true,sample:e.answer,required:[...e.required]};
function answerContract(e){const c=response(e);return{type:e.form==='written'?'written-explanation':e.form==='choice'?'single-choice':'short-text',...(e.form==='written'?{sample:e.answer,teacherRequired:true,reviewRequired:true,rubric:{required:[...e.required],pass:'뜻이 같은 짧은 답과 타당한 다른 방법도 교사가 확인해요.'}}:e.form==='choice'?{answer:e.key,accepted:[e.key]}:{answer:e.answer,accepted:c.accepted||[e.answer],inputHint:c.parts?'빈칸의 답을 쉼표로 나누어 차례대로 써요.':'짧은 낱말로 답해요.'}),seasonContract:c};}
export function skyMixedItems(rows,u){
 if(u!==unit||!rows?.length)return rows;let changed=false;
 const next=rows.map(q=>{const e=bankReview[q.id];if(!e||q.status!=='authored'||!['authored-supplement','authored-lesson'].includes(q.sourceRef?.type)||!e.before.includes(fingerprint(q)))return q;changed=true;if(banks.has(q))return banks.get(q);
 const result={...q,prompt:e.prompt,explanation:e.explanation,misconception:e.misconception,responseContract:response(e),answerContract:answerContract(e),bookResponseForm:e.form,taxonomy:{...q.taxonomy,format:labels[e.form]},choices:e.choices?clone(e.choices):null,diagnosticOverride:{version:SKY_MIXED_VERSION,distractors:null,typed:null,cloze:null,cells:null},skyMixedResponse:SKY_MIXED_VERSION,contentVersion:SKY_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};banks.set(q,result);return result;});return changed?next:rows;
}
export function withSkyMixedClassroom(u,mod){if(u!==unit)return mod;const classroomItems=skyMixedItems(mod?.classroomItems,u);return classroomItems===mod.classroomItems?mod:{...mod,classroomItems};}
export function withSkyMixedWorkbook(w){
 if(w?.unit!==unit||fingerprint(w)!==prior)return w;if(books.has(w))return books.get(w);
 const questions=w.questions.map(q=>{const e=review[q.no];if(!e||fingerprint(q)!==e.before)return q;
 const result={...q,prompt:e.prompt,answer:e.answer,explanation:e.explanation,misconception:e.misconception,form:e.form,formLabel:labels[e.form],bookResponseForm:e.form,choices:e.choices?clone(e.choices):null,requirements:[...e.required],criteria:e.required.join(' / '),responseContract:response(e),skyMixedResponse:SKY_MIXED_VERSION,contentVersion:SKY_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};delete result.parts;delete result.answerPerPart;if(e.form==='written')result.lines=1;else delete result.lines;if(Object.hasOwn(e,'key'))result.key=e.key;
 if(q.sourceRef?.type==='authored-supplement'){result.sourceContract=answerContract(e);result.sourceExplanation=e.explanation;}
 return result;});
 const quickPages=w.quickPages.map(p=>({...p,blocks:p.blocks.map(b=>b.type!=='table'?b:{...b,rows:b.rows.map(row=>{const e=review[Number(row[0])];return e?[row[0],labels[e.form]+(row[1].includes(' · ')?row[1].slice(row[1].indexOf(' · ')):''),e.answer]:row;})})}));
 const result={...w,questions,quickPages};books.set(w,result);return result;
}
