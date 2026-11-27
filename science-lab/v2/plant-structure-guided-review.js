// Brief observations with real microscopy, plant investigations and sharing.
export const PLANT_STRUCTURE_GUIDED_VERSION='20261124-plant-structure-mixed-responses';
const unit='c22-s61-u03',prior='754701aec74f9fb0';
const review={
  "6": {
    "prompt": "현미경에서 세포벽은 보였지만 핵은 뚜렷하지 않았어요. 관찰 기록으로 알맞은 것을 고르세요.",
    "answer": "② 핵은 뚜렷하게 보이지 않았다.",
    "required": [
      "불분명하게 보인 핵의 관찰을 그대로 기록"
    ],
    "explanation": "보인 세포벽은 그리고 핵은 뚜렷하지 않았다고 남겨요. 설명 그림을 그대로 관찰 결과로 채우지 않아요. 선생님과 조명·초점·표본 상태를 확인하고 다시 보아요.",
    "misconception": "관찰한 표본·배율·보이는 범위를 밝히고 안 보이는 구조를 그려 넣지 않아요.",
    "before": "a32622d5610e5e3f",
    "form": "choice",
    "choices": [
      "핵이 없는 세포였다.",
      "핵은 뚜렷하게 보이지 않았다.",
      "설명 그림과 같은 핵을 보았다."
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "11": {
    "prompt": "잎 한 장은 여러 개의 [ ]로 이루어져 있어요.",
    "answer": "세포",
    "required": [
      "식물의 기관과 이를 이루는 여러 세포 구별"
    ],
    "explanation": "잎은 식물의 기관이고 많은 세포로 이루어져 있어요. 양파 표피에서 여러 작은 단위가 이어진 모습을 관찰하며 전체와 세포 하나를 구별해요.",
    "misconception": "세포는 생물을 이루는 기본 단위예요. 구조 이름과 기능 암기를 구별해요.",
    "before": "08f8727e09d8a6d4",
    "form": "blank",
    "contract": {
      "kind": "short-text",
      "accepted": [
        "세포"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "12": {
    "prompt": "현미경에서 흐리게 보인 부분을 설명 그림처럼 또렷하게 그려도 될까요? 까닭을 짧게 쓰세요.",
    "answer": "직접 본 모습이 아니므로 그렇게 그리면 안 돼요.",
    "required": [
      "실제로 본 모습과 설명 그림 구별"
    ],
    "explanation": "관찰 그림에는 현미경에서 직접 본 모습을 남겨요. 설명 그림은 구조를 알아보기 쉽게 나타낸 것이므로 흐리거나 못 본 부분을 그 그림처럼 꾸며 채우지 않아요.",
    "misconception": "관찰한 표본·배율·보이는 범위를 밝히고 안 보이는 구조를 그려 넣지 않아요.",
    "lines": 2,
    "before": "feaf4fa82aa11106"
  },
  "15": {
    "prompt": "같은 양파 표피를 보았는데 친구 그림과 내 그림이 달라요. 함께 다시 볼 때 맞춰 볼 관찰 조건 하나를 쓰세요.",
    "answer": "같은 배율로 같은 부분을 보아요.",
    "required": [
      "같은 부분·배율·초점·조명 등 타당한 관찰 조건 하나"
    ],
    "explanation": "표본의 같은 부분과 배율·초점·조명을 맞추어 보아요. 처음 그린 두 그림도 남기고 어떤 조건에서 보았는지 함께 살펴요.",
    "misconception": "관찰한 표본·배율·보이는 범위를 밝히고 안 보이는 구조를 그려 넣지 않아요.",
    "lines": 1,
    "before": "33d5b9f392bbe639"
  },
  "22": {
    "prompt": "뿌리가 있는 장치만 입구를 막았어요. 뿌리의 역할을 비교하려면 어떻게 고칠까요?",
    "answer": "③ 두 입구를 같은 방법으로 막는다.",
    "required": [
      "직접 증발 차이를 줄이는 같은 입구 처리"
    ],
    "explanation": "열린 용기에서는 물이 직접 증발할 수 있어요. 두 장치의 입구를 같은 방법으로 막아야 물이 줄어든 까닭을 뿌리가 있는지와 관련지어 비교할 수 있어요.",
    "misconception": "뿌리 유무 외의 조건과 용기에서 직접 증발하는 물을 함께 확인해요.",
    "before": "2eae36098a47d2fb",
    "form": "choice",
    "choices": [
      "두 장치를 서로 다른 곳에 둔다.",
      "입구를 그대로 두고 물의 양만 잰다.",
      "두 입구를 같은 방법으로 막는다."
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "27": {
    "prompt": "한 식물만 뿌리를 잘랐어요. 자른 곳에 무엇이 생겼나요? 낱말로 쓰세요.",
    "answer": "상처",
    "required": [
      "뿌리 제거와 함께 생긴 손상 구별"
    ],
    "explanation": "뿌리를 잘라 내면 뿌리가 없어질 뿐 아니라 상처도 생겨요. 두 식물을 준비한 방법과 상태를 함께 살펴야 물이 줄어든 차이를 설명할 수 있어요.",
    "misconception": "뿌리 유무 외의 조건과 용기에서 직접 증발하는 물을 함께 확인해요.",
    "before": "7f8fd18c2e4d8a42",
    "form": "short",
    "contract": {
      "kind": "short-text",
      "accepted": [
        "상처",
        "자른 상처",
        "잘린 상처",
        "절단 상처"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "28": {
    "prompt": "뿌리는 물을 흡수하고, 식물의 몸을 땅에 붙잡아 [ ]해 줘요.",
    "answer": "지지",
    "required": [
      "뿌리의 몸 지지 역할"
    ],
    "explanation": "뿌리는 물을 흡수하며 식물의 몸을 지지하는 데도 도움을 줘요. 당근처럼 양분을 저장하는 예도 있어 한 기관에 여러 역할이 있을 수 있어요.",
    "misconception": "뿌리는 물 흡수·몸 지지와 연결돼요. 먹는 부분은 식물마다 달라요.",
    "before": "4eff42484c732c0e",
    "form": "blank",
    "contract": {
      "kind": "short-text",
      "accepted": [
        "지지"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "31": {
    "prompt": "뿌리 유무가 다른 두 장치에서 물이 같은 양만큼 줄었어요. 처음 기록을 남긴 뒤 다시 비교할 때 확인할 조건 하나를 쓰세요.",
    "answer": "용기 입구를 같은 방법으로 막았는지 확인해요.",
    "required": [
      "시간·식물 상태·입구 처리 등 비교 조건 하나"
    ],
    "explanation": "이번에 물이 줄어든 양이 같았다고 뿌리가 물을 흡수하지 않는다고 할 수는 없어요. 처음 기록은 남겨 두고 시간과 식물 상태, 용기 입구를 막은 방법을 확인한 뒤 다시 비교해요.",
    "misconception": "뿌리 유무 외의 조건과 용기에서 직접 증발하는 물을 함께 확인해요.",
    "lines": 1,
    "before": "d76329030b5a0145"
  },
  "38": {
    "prompt": "줄기 겉에 색소 물이 묻었어요. 안으로 이동한 물의 자취는 선생님이 준비한 줄기의 어느 면에서 찾을까요?",
    "answer": "자른 면",
    "required": [
      "겉에 묻은 색과 내부 단면의 자취 구별"
    ],
    "explanation": "겉에 묻은 색만으로 내부의 물 이동을 정하지 않아요. 선생님이 준비한 가로·세로 단면의 안쪽과 색소 물에 넣기 전 줄기를 비교해요.",
    "misconception": "색소가 나타난 위치는 물의 이동 경로를 알아보는 근거예요. 모든 물질의 이동을 증명하지는 않아요.",
    "before": "87807511666ced0f",
    "form": "short",
    "contract": {
      "kind": "short-text",
      "accepted": [
        "자른 면",
        "줄기의 자른 면",
        "안쪽의 자른 면",
        "줄기 안쪽의 자른 면",
        "단면",
        "줄기 단면"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "43": {
    "prompt": "줄기 안에서 붉은 부분을 찾지 못했다고 기록했어요. 다시 살필 때 확인할 조건 하나를 쓰세요.",
    "answer": "색소 물에 넣어 둔 시간을 확인해요.",
    "required": [
      "시간·줄기 상태·자른 위치·조명 중 타당한 조건 하나"
    ],
    "explanation": "붉은 부분을 찾지 못한 기록은 그대로 남겨요. 색소 물에 넣은 시간·줄기 상태·자른 위치·조명에서 다시 확인할 조건을 골라요. 예상 그림을 관찰 결과로 채우지 않아요.",
    "misconception": "색소가 나타난 위치는 물의 이동 경로를 알아보는 근거예요. 모든 물질의 이동을 증명하지는 않아요.",
    "lines": 1,
    "before": "6a6a76974e02a049"
  },
  "44": {
    "prompt": "줄기가 잎을 받쳐 주면 잎이 빛을 받는 데 어떤 도움이 될까요?",
    "answer": "잎이 펼쳐져 빛을 받는 데 도움이 돼요.",
    "required": [
      "줄기의 잎 지지와 빛 받기 연결"
    ],
    "explanation": "줄기는 잎을 받쳐 펼쳐지게 하고 물이 이동하는 길도 돼요. 뿌리·줄기·잎의 기능을 실제 관찰과 실험에서 연결해요.",
    "misconception": "줄기의 지지·물 이동·저장 역할을 생김새와 근거로 연결해요.",
    "lines": 1,
    "before": "878dabfe9f4ebc4c"
  },
  "47": {
    "prompt": "색소 물에 넣은 줄기의 붉은 자취로 직접 알 수 있는 것은 무엇인가요?",
    "answer": "① 물이 지나간 곳",
    "required": [
      "색소 물 관찰과 양분 이동의 직접 확인 구별"
    ],
    "explanation": "이 실험에서 따라가 본 것은 색소가 섞인 물이에요. 붉은 부분으로 물이 지나간 곳을 알아볼 수 있지만 양분도 같은 방향으로만 이동한다고 확인한 것은 아니에요.",
    "misconception": "색소가 나타난 위치는 물의 이동 경로를 알아보는 근거예요. 모든 물질의 이동을 증명하지는 않아요.",
    "before": "3be6697c3c1eab06",
    "form": "choice",
    "choices": [
      "물이 지나간 곳",
      "양분이 이동한 방향",
      "줄기에서 양분이 만들어진 곳"
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "54": {
    "prompt": "빛을 받은 잎과 가린 잎을 비교해요. 실험 전에 녹말이 있었는지도 확인해야 하는 까닭은 무엇인가요?",
    "answer": "처음 있던 녹말과 이번에 만들어진 녹말을 구별하려고 해요.",
    "required": [
      "처음 녹말과 이번 빛 처리 영향 구별"
    ],
    "explanation": "처음부터 잎에 녹말이 있었다면 나중에 보인 반응이 이번에 빛을 받아 새로 생긴 녹말 때문인지 알기 어려워요. 어둡게 두었다는 말만으로 정하지 않고 실험 전 비교용 잎의 반응도 확인해요.",
    "misconception": "처리 전 녹말 상태와 처리 뒤 검출 결과가 있어야 빛의 영향을 해석해요.",
    "lines": 1,
    "before": "5693ebb79bb5cc81"
  },
  "59": {
    "prompt": "빛을 준 잎과 가린 잎이 모두 청람색으로 변했어요. 기록을 남기고 다시 확인할 것은 무엇인가요?",
    "answer": "② 빛이 제대로 가려졌는지",
    "required": [
      "실제 두 반응을 보존하며 차단 상태 확인"
    ],
    "explanation": "두 잎이 청람색으로 변한 관찰을 그대로 남겨요. 빛 차단과 이름표를 확인해요. 실험 전 비교용 잎의 반응 기록도 살피며, 나중에 다른 잎을 검사한 것을 지난 실험 전 잎의 상태로 바꾸지는 않아요.",
    "misconception": "처리 전 녹말 상태와 처리 뒤 검출 결과가 있어야 빛의 영향을 해석해요.",
    "before": "76f900f0a705d90a",
    "form": "choice",
    "choices": [
      "가린 잎의 기록을 지울지",
      "빛이 제대로 가려졌는지",
      "예상한 색으로 다시 칠할지"
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
    "prompt": "빈칸에 알맞은 기관 이름을 쓰세요. 물은 [ ]에서 흡수되어 [ ]를 지나 잎으로 가요. 빛을 받아 양분을 만드는 곳은 [ ]이에요.",
    "answer": "뿌리, 줄기, 잎",
    "required": [
      "뿌리 흡수·줄기 이동·잎의 양분 생성"
    ],
    "explanation": "기관의 물 흡수와 광합성을 구별하면서 연결해야 해요. 흙에서 완성된 양분을 모두 가져온다고 하지 않아요.",
    "misconception": "광합성에 필요한 물·이산화 탄소와 빛을 구별하고 양분 생성과 연결해요.",
    "before": "1bc3164390ac009d",
    "form": "blank",
    "contract": {
      "kind": "ordered-word-parts",
      "parts": [
        {
          "accepted": [
            "뿌리"
          ]
        },
        {
          "accepted": [
            "줄기"
          ]
        },
        {
          "accepted": [
            "잎"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "63": {
    "prompt": "잎의 녹말 반응으로 알 수 있는 것을 고르세요.",
    "answer": "③ 녹말이 있는지",
    "required": [
      "녹말 확인과 모든 양분 조사 구별"
    ],
    "explanation": "이 반응에서는 녹말이 있는지를 살펴요. 모든 양분의 종류와 양을 알아본 결과는 아니에요. 전에 만들어 저장하거나 다른 기관에서 온 양분도 있어요.",
    "misconception": "처리 전 녹말 상태와 처리 뒤 검출 결과가 있어야 빛의 영향을 해석해요.",
    "before": "f3a7f08584e7a73b",
    "form": "choice",
    "choices": [
      "모든 양분의 양",
      "물이 이동한 방향",
      "녹말이 있는지"
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "70": {
    "prompt": "한쪽 봉지에만 처음부터 물방울이 있었어요. 잎 유무를 비교하려면 처음에 어떻게 준비할까요?",
    "answer": "① 두 봉지를 모두 마른 상태로 준비한다.",
    "required": [
      "잎 유무 비교를 위한 같은 초기 물기 상태"
    ],
    "explanation": "처음 봉지의 물기가 나중 관찰에 섞이면 잎 유무의 영향만 구별하기 어려워요. 처음부터 같은 마른 상태로 준비하고 같은 시간·환경에서 다시 비교해요.",
    "misconception": "잎 유무를 비교할 때 봉지 초기 물기·용기 입구·주변 조건을 맞춰요.",
    "before": "9f09ac5fb6b24e29",
    "form": "choice",
    "choices": [
      "두 봉지를 모두 마른 상태로 준비한다.",
      "한쪽 봉지에만 물을 더 뿌린다.",
      "물방울이 있는 봉지만 오래 둔다."
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "75": {
    "prompt": "잎에서는 물이 [ ]로 나가요. 봉지 안에서는 액체인 [ ]로 맺혀요.",
    "answer": "수증기, 물방울",
    "required": [
      "수증기로 나감과 액체 물방울 맺힘 구별"
    ],
    "explanation": "잎에서 수증기로 나가는 것이 증산 작용이에요. 그 수증기가 봉지 안에서 액체 물방울로 변한 것은 응결이에요. 두 과정을 이어서 설명해요.",
    "misconception": "증산은 식물 안의 물이 수증기로 나가는 현상이에요. 기공과 연결해요.",
    "before": "915d5341e87d4f6b",
    "form": "blank",
    "contract": {
      "kind": "ordered-word-parts",
      "parts": [
        {
          "accepted": [
            "수증기"
          ]
        },
        {
          "accepted": [
            "물방울"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "76": {
    "prompt": "잎 없는 장치에서도 물이 조금 줄었어요. 친구가 기록을 0으로 고치자고 해요. 기록은 어떻게 남길까요?",
    "answer": "실제로 줄어든 양을 그대로 남겨요.",
    "required": [
      "예상과 다른 실제 측정값 보존"
    ],
    "explanation": "예상과 달라도 실제로 잰 값을 그대로 남겨요. 남은 기관·절단 상처·입구 처리·직접 증발 등 다른 원인도 살펴보며 잎 유무에 따른 차이를 비교해요.",
    "misconception": "잎 유무를 비교할 때 봉지 초기 물기·용기 입구·주변 조건을 맞춰요.",
    "lines": 1,
    "before": "3706542066b38c76"
  },
  "79": {
    "prompt": "물의 이동 경로를 완성하세요. 뿌리 → [ ] → 잎 → 공기 중의 [ ]",
    "answer": "줄기, 수증기",
    "required": [
      "뿌리 흡수→줄기 이동→잎의 증산 연결"
    ],
    "explanation": "뿌리가 흡수한 물이 줄기를 지나 잎으로 이동해요. 잎에서 물의 일부가 수증기로 나가는 증산 작용과 연결돼요.",
    "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
    "before": "af30f889a10ba437",
    "form": "blank",
    "contract": {
      "kind": "ordered-word-parts",
      "parts": [
        {
          "accepted": [
            "줄기"
          ]
        },
        {
          "accepted": [
            "수증기"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "86": {
    "prompt": "흙의 물이 잎까지 가는 길에서 빠진 기관 이름을 쓰세요. 흙의 물 → [ ] → [ ] → 잎",
    "answer": "뿌리, 줄기",
    "required": [
      "잎에 이르기 전 뿌리와 줄기의 물 이동 경로"
    ],
    "explanation": "흙의 물에서 뿌리, 줄기, 잎으로 화살표를 이어 그려요. 화살표에 어떤 물질이 어디로 이동하는지 적어야 물의 이동을 설명할 수 있어요.",
    "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
    "before": "76af88785701cf0a",
    "form": "blank",
    "contract": {
      "kind": "ordered-word-parts",
      "parts": [
        {
          "accepted": [
            "뿌리"
          ]
        },
        {
          "accepted": [
            "줄기"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "91": {
    "prompt": "잎에서 만든 양분이 뿌리와 줄기에도 필요한 까닭을 짧게 쓰세요.",
    "answer": "뿌리와 줄기도 자라는 데 양분이 필요해요.",
    "required": [
      "잎에서 만든 양분과 다른 기관의 생장 연결"
    ],
    "explanation": "뿌리는 물을 흡수하고 줄기는 물이 잎으로 가는 길이 돼요. 잎에서 만들어진 양분은 여러 기관이 자라거나 저장하는 데 쓰여 기관들이 서로 연결돼요.",
    "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
    "lines": 2,
    "before": "250a38429c69bab4"
  },
  "92": {
    "prompt": "잎에서 만든 양분에 대한 설명으로 알맞은 것을 고르세요.",
    "answer": "② 뿌리 등 다른 기관으로 이동해 쓰이거나 저장된다.",
    "required": [
      "물 경로와 잎에서 만든 양분의 이동 구별"
    ],
    "explanation": "화살표는 물이 이동하는 길을 나타낸 것이에요. 잎에서 만든 양분은 뿌리 등 다른 기관으로 이동해 쓰이거나 저장될 수 있어요. 두 물질의 이름과 쓰임을 구별해요.",
    "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
    "before": "2682a582ffe03930",
    "form": "choice",
    "choices": [
      "잎에서만 쓰인다.",
      "뿌리 등 다른 기관으로 이동해 쓰이거나 저장된다.",
      "뿌리에서만 만들어져 잎으로 올라간다."
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "95": {
    "prompt": "처진 잎 사진에서 직접 확인한 것을 고르세요.",
    "answer": "③ 잎이 처져 있다.",
    "required": [
      "잎 처짐 관찰과 원인 추측 구별"
    ],
    "explanation": "직접 본 것은 잎이 처진 모습이에요. 흙의 물 상태와 빛·온도, 식물의 상태를 더 살펴야 원인을 알아볼 수 있어요.",
    "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
    "before": "a52ea20f62b24ae1",
    "form": "choice",
    "choices": [
      "뿌리가 모두 죽었다.",
      "흙이 완전히 말랐다.",
      "잎이 처져 있다."
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "102": {
    "prompt": "벌이 꽃에 앉은 사진 한 장이 있어요. 씨가 생겼는지 알려면 나중에 무엇을 더 관찰해야 할까요?",
    "answer": "열매나 씨가 생기는지 더 관찰해야 해요.",
    "required": [
      "꽃 방문 장면과 이후 열매/씨 형성 구별"
    ],
    "explanation": "사진에서 확인한 것은 벌이 꽃에 앉은 모습이에요. 꽃가루가 암술머리에 닿았는지, 그 뒤 씨가 생겼는지는 각각 더 관찰해야 해요.",
    "misconception": "꽃가루가 암술머리에 닿는 것과 씨가 퍼지는 것을 구별해요.",
    "lines": 1,
    "before": "687f5ecfee057ad9"
  },
  "107": {
    "prompt": "종이 날개 모형을 떨어뜨렸어요. 실제로 한 활동과 맞는 기록을 고르세요.",
    "answer": "③ 종이 모형이 떨어지는 모습을 비교했다.",
    "required": [
      "종이 모형 결과와 실제 씨의 이동 측정 구별"
    ],
    "explanation": "종이 날개 모형의 떨어지는 모습을 비교한 것으로 기록해요. 실제 씨는 재료·무게·주변 바람이 다르므로 씨의 실제 이동 거리를 잰 결과로 바꾸지 않아요.",
    "misconception": "열매의 보호 역할과 씨의 퍼짐을 실제 특징에 근거해 설명해요.",
    "before": "d2e0fb2636282558",
    "form": "choice",
    "choices": [
      "실제 나무 씨의 이동 거리를 쟀다.",
      "실제 씨가 싹 트는 모습을 보았다.",
      "종이 모형이 떨어지는 모습을 비교했다."
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "108": {
    "prompt": "이름에 물이 들어간 식물의 꽃가루받이를 알아보려 해요. 이름 말고 어떤 관찰이나 자료를 찾아야 할까요?",
    "answer": "그 식물의 꽃가루가 옮겨지는 모습이나 꽃가루받이 자료를 찾아요.",
    "required": [
      "실제 꽃가루 이동 관찰 또는 해당 식물의 조사 자료"
    ],
    "explanation": "식물의 이름이나 사는 곳만으로 꽃가루받이 방법을 알 수는 없어요. 그 식물을 관찰하거나 조사한 내용을 근거로 설명해요.",
    "misconception": "꽃가루가 암술머리에 닿는 것과 씨가 퍼지는 것을 구별해요.",
    "lines": 1,
    "before": "d3fe1ff831db2fe6"
  },
  "111": {
    "prompt": "관찰한 씨에는 날개가 있었어요. 모든 씨에 날개가 있는지 알려면 무엇을 더 살펴볼까요?",
    "answer": "다른 식물의 씨",
    "required": [
      "한 씨의 특징과 여러 식물의 씨 비교"
    ],
    "explanation": "관찰한 씨에는 날개가 있다고 말할 수 있어요. 다른 식물의 씨도 살펴 날개·갈고리 등 특징과 퍼지는 방법을 비교해요.",
    "misconception": "열매의 보호 역할과 씨의 퍼짐을 실제 특징에 근거해 설명해요.",
    "before": "06f7aa689dd65a2a",
    "form": "short",
    "contract": {
      "kind": "short-text",
      "accepted": [
        "다른 식물의 씨",
        "다른 씨",
        "여러 식물의 씨",
        "다른 종류의 씨",
        "다른 식물 씨"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "118": {
    "prompt": "내가 본 잎은 넓게 펼쳐져 있어요. 빛을 받는 데 어떤 도움이 될까요?",
    "answer": "넓게 펼쳐져 빛을 받는 데 도움이 돼요.",
    "required": [
      "관찰한 잎의 생김새와 빛 받기 연결"
    ],
    "explanation": "내가 관찰한 잎의 넓은 모습과 빛 받기를 연결해 설명해요. 관찰한 생김새와 배운 원리를 근거로 하며 하지 않은 실험의 결과처럼 쓰지 않아요.",
    "misconception": "관찰·출처가 있는 조사와 설명을 연결하고 실제 자료를 만들어 친구에게 보여 줘요.",
    "lines": 1,
    "before": "9a3a10817fd04aab"
  },
  "123": {
    "prompt": "줄기가 잎을 받치는 모습을 보여 주려 해요. 어느 부분을 크게 보여 주면 좋을까요?",
    "answer": "줄기와 잎이 연결된 부분",
    "required": [
      "줄기와 잎의 연결 부분 표시"
    ],
    "explanation": "줄기와 잎이 이어진 곳을 크게 표시해요. 실제 소개에서는 그 모습을 짚어 줄기가 잎을 받치는 역할도 설명해요.",
    "misconception": "관찰·출처가 있는 조사와 설명을 연결하고 실제 자료를 만들어 친구에게 보여 줘요.",
    "before": "b29ab6028eda7ba8",
    "form": "short",
    "contract": {
      "kind": "short-text",
      "accepted": [
        "줄기와 잎이 연결된 부분",
        "줄기와 잎의 연결 부분",
        "줄기와 잎의 연결 부위",
        "줄기와 잎이 이어진 곳",
        "줄기와 잎이 만나는 곳"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "124": {
    "prompt": "전체 식물 사진과 확대 그림을 함께 보여 주려 해요. 확대한 곳을 알기 쉽게 나타낸 방법을 고르세요.",
    "answer": "① 전체 사진의 해당 부분을 표시하고 확대 그림과 선으로 잇는다.",
    "required": [
      "전체에서 확대한 위치를 표시하고 확대 그림과 연결"
    ],
    "explanation": "전체 사진에서 확대한 부분을 테두리나 이름표로 표시하고 확대 그림과 이어요. 확대 그림에는 그 부분의 이름과 하는 일을 넣어 친구에게 소개해요.",
    "misconception": "관찰·출처가 있는 조사와 설명을 연결하고 실제 자료를 만들어 친구에게 보여 줘요.",
    "before": "e63d763a4f7775e8",
    "form": "choice",
    "choices": [
      "전체 사진의 해당 부분을 표시하고 확대 그림과 선으로 잇는다.",
      "전체 사진과 확대 그림을 관계없이 나란히 놓는다.",
      "전체 사진을 지우고 확대 그림만 남긴다."
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "127": {
    "prompt": "뿌리·줄기·잎 중 하나를 골라 하는 일 한 가지를 짧게 쓰세요.",
    "answer": "뿌리는 물을 흡수해요.",
    "required": [
      "선택한 식물 기관과 타당한 역할 하나"
    ],
    "explanation": "관심 식물의 부분을 골라 생김새와 하는 일을 연결해요. 실제 소개 자료에는 대상과 부분의 이름·확인한 관찰이나 자료·출처를 넣고 친구의 질문에 맞춰 설명을 고쳐요.",
    "misconception": "관찰·출처가 있는 조사와 설명을 연결하고 실제 자료를 만들어 친구에게 보여 줘요.",
    "lines": 1,
    "before": "be592930b0399b1e"
  },
  "16": {
    "prompt": "현미경으로 실제 관찰한 식물 세포를 크게 그리세요. 표본 이름·배율과 직접 확인한 구조에 이름표를 붙이세요. 관찰은 선생님과 먼저 해요.",
    "answer": "실제로 보인 세포 모양과 표본 이름·배율, 확인한 구조의 이름표를 남겨요.",
    "required": [
      "실제 관찰 그림·표본/배율·확인 구조와 불분명한 부분 구별"
    ],
    "explanation": "현미경에서 직접 본 세포의 모양을 크게 그리고 표본 이름과 배율을 적어요. 실제로 확인한 구조에 이름을 붙여요. 아직 관찰하지 않았다면 준비된 표본을 먼저 살펴요.",
    "misconception": "관찰한 표본·배율·보이는 범위를 밝히고 안 보이는 구조를 그려 넣지 않아요.",
    "drawingExplanationLines": 0,
    "before": "35fea2675336d9cd"
  },
  "32": {
    "prompt": "두 칸에 뿌리 있는 장치와 없는 장치를 그리세요. 처음 물 높이·같은 입구 처리·비교 시간을 표시하고 나중 결과는 비워 두세요.",
    "answer": "뿌리 유무를 나누고 물의 처음 높이·입구 처리·같은 시간을 표시해요. 결과는 비워요.",
    "required": [
      "뿌리 유무·같은 처음 조건과 시간·빈 결과 자리"
    ],
    "explanation": "두 장치에서 뿌리가 있는지만 다르게 하고 물과 용기, 잎 상태, 입구를 막는 방법과 시간을 같게 표시해요. 아직 실험 전이므로 나중 물의 양은 비워 두고, 식물을 자르는 준비는 선생님이 맡아요.",
    "misconception": "뿌리 유무 외의 조건과 용기에서 직접 증발하는 물을 함께 확인해요.",
    "drawingExplanationLines": 0,
    "before": "aacfc742774d286c",
    "drawingPanels": 2
  },
  "48": {
    "prompt": "줄기를 가로로 자른 면에는 붉은 점, 세로로 자른 면에는 긴 붉은 자취가 보인 자료예요. 두 칸에 각 모습을 그리고 자른 방향과 물이 지난 곳에 이름을 붙이세요.",
    "answer": "가로로 자른 면의 붉은 점 / 세로로 자른 면의 긴 자취와 색소 물 이름표.",
    "required": [
      "가로/세로 두 방향과 붉은 자취·색소 물 이동 이름표"
    ],
    "explanation": "가로로 자른 면에는 붉은 점을, 세로로 자른 면에는 길게 이어진 붉은 부분을 그려요. 각각 자른 방향과 물이 지나간 부분을 이름표로 설명해요. 문제에서 준 자료를 내가 직접 관찰한 것으로 쓰지 않아요.",
    "misconception": "색소가 나타난 위치는 물의 이동 경로를 알아보는 근거예요. 모든 물질의 이동을 증명하지는 않아요.",
    "drawingExplanationLines": 0,
    "before": "ceec4203ea0ffd19",
    "drawingPanels": 2
  },
  "64": {
    "prompt": "녹말 반응을 비교할 빈 표를 그리세요. 실험 전 비교용 잎·빛을 받은 잎·가린 잎의 반응을 적을 칸에 이름을 붙이세요.",
    "answer": "실험 전 비교용 잎 / 빛 받은 잎 / 가린 잎의 반응 칸을 나누고 결과는 비워요.",
    "required": [
      "처리 전 확인과 처리 뒤 두 잎의 빈 반응 칸"
    ],
    "explanation": "실험 전 비교용 잎의 반응을 적을 곳과 빛을 받은 잎, 가린 잎의 반응을 적을 곳이 필요해요. 같게 한 식물 종류와 시간, 물의 상태도 표시하고 실제로 본 뒤 결과를 채워요.",
    "misconception": "처리 전 녹말 상태와 처리 뒤 검출 결과가 있어야 빛의 영향을 해석해요.",
    "drawingExplanationLines": 0,
    "before": "3f73192c19948c9a"
  },
  "80": {
    "prompt": "두 칸에 잎 있는 장치와 없는 장치를 그리세요. 마른 봉지·같은 입구 처리·처음 물의 양·비교 시간을 표시하고 결과는 비워 두세요.",
    "answer": "잎 유무를 나누고 처음 마른 봉지·같은 입구 처리·물의 양·시간과 빈 결과 칸을 표시해요.",
    "required": [
      "잎 유무·마른 봉지/입구/초기 물·같은 시간·빈 결과 자리"
    ],
    "explanation": "잎이 있는 장치와 없는 장치를 그리고 마른 봉지, 같은 용기와 처음 물의 양, 입구를 막는 방법과 시간을 표시해요. 아직 관찰 전이므로 나중 물방울과 물의 양은 채우지 않아요.",
    "misconception": "잎 유무를 비교할 때 봉지 초기 물기·용기 입구·주변 조건을 맞춰요.",
    "drawingExplanationLines": 0,
    "before": "70e3729aea8efb30",
    "drawingPanels": 2
  },
  "96": {
    "prompt": "두 칸에 뿌리·줄기·잎을 그리세요. 한 칸에는 물이 가는 길, 다른 칸에는 잎에서 만든 양분이 쓰이는 곳을 화살표와 이름표로 나타내세요.",
    "answer": "물: 뿌리→줄기→잎 / 양분: 잎에서 만들어져 다른 기관에 쓰이거나 저장됨.",
    "required": [
      "세 기관과 물 이동 경로·잎의 양분 생성/쓰임 이름표"
    ],
    "explanation": "물은 뿌리에서 줄기를 지나 잎으로 가는 화살표로 나타내요. 잎에서 만든 양분은 다른 기관에 쓰이거나 저장되는 것으로 나타내고, 각 화살표에 물과 양분의 이름을 써요.",
    "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
    "drawingExplanationLines": 0,
    "before": "4e5039b139eff1bb",
    "drawingPanels": 2
  },
  "112": {
    "prompt": "직접 보거나 자료에서 확인한 열매나 씨 하나를 그리세요. 씨를 보호하거나 퍼지는 데 도움이 되는 특징에 짧은 이름표를 붙이세요.",
    "answer": "날개 있는 씨의 날개 / 바람에 퍼지는 데 도움 등의 이름표.",
    "required": [
      "확인한 열매/씨의 특징과 보호 또는 퍼짐 기능 연결"
    ],
    "explanation": "실제로 확인한 열매나 씨를 크게 그리고, 씨를 보호하는 부분이나 날개와 갈고리 등을 표시해요. 그 특징이 보호나 퍼짐에 어떻게 도움이 되는지 설명하고 어디서 알아보았는지도 적어요.",
    "misconception": "열매의 보호 역할과 씨의 퍼짐을 실제 특징에 근거해 설명해요.",
    "drawingExplanationLines": 0,
    "before": "f0d4f9e80d4ea96a"
  },
  "128": {
    "prompt": "식물 하나를 소개할 자료의 배치를 그리세요. 두 칸에 전체 모습과 확대할 부분을 나누고 이름·하는 일·찾아본 자료를 넣을 자리에 표시하세요.",
    "answer": "전체 모습 / 확대한 부분과 이름 / 하는 일의 설명과 출처 자리.",
    "required": [
      "전체와 확대 부분·구조/기능 설명·자료 출처의 배치"
    ],
    "explanation": "전체 모습에서 어느 부분을 확대했는지 연결해요. 그림과 이름·하는 일의 설명·자료 출처를 놓을 자리를 정해요. 실제 자료 완성과 친구에게 소개하기는 이어지는 활동에서 따로 확인해요.",
    "misconception": "관찰·출처가 있는 조사와 설명을 연결하고 실제 자료를 만들어 친구에게 보여 줘요.",
    "drawingExplanationLines": 0,
    "before": "afa8dfca68acfd7c",
    "drawingPanels": 2
  }
};
const bankReview={
  "c22-s61-u03-b006": {
    "prompt": "현미경에서 세포벽은 보였지만 핵은 뚜렷하지 않았어요. 관찰 기록으로 알맞은 것을 고르세요.",
    "answer": "② 핵은 뚜렷하게 보이지 않았다.",
    "required": [
      "불분명하게 보인 핵의 관찰을 그대로 기록"
    ],
    "explanation": "보인 세포벽은 그리고 핵은 뚜렷하지 않았다고 남겨요. 설명 그림을 그대로 관찰 결과로 채우지 않아요. 선생님과 조명·초점·표본 상태를 확인하고 다시 보아요.",
    "misconception": "관찰한 표본·배율·보이는 범위를 밝히고 안 보이는 구조를 그려 넣지 않아요.",
    "before": [
      "0805eb71bd087dbb"
    ],
    "form": "choice",
    "choices": [
      "핵이 없는 세포였다.",
      "핵은 뚜렷하게 보이지 않았다.",
      "설명 그림과 같은 핵을 보았다."
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u03-b011": {
    "prompt": "잎 한 장은 여러 개의 [ ]로 이루어져 있어요.",
    "answer": "세포",
    "required": [
      "식물의 기관과 이를 이루는 여러 세포 구별"
    ],
    "explanation": "잎은 식물의 기관이고 많은 세포로 이루어져 있어요. 양파 표피에서 여러 작은 단위가 이어진 모습을 관찰하며 전체와 세포 하나를 구별해요.",
    "misconception": "세포는 생물을 이루는 기본 단위예요. 구조 이름과 기능 암기를 구별해요.",
    "before": [
      "0d1552b281290ca8"
    ],
    "form": "blank",
    "contract": {
      "kind": "short-text",
      "accepted": [
        "세포"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u03-b012": {
    "prompt": "현미경에서 흐리게 보인 부분을 설명 그림처럼 또렷하게 그려도 될까요? 까닭을 짧게 쓰세요.",
    "answer": "직접 본 모습이 아니므로 그렇게 그리면 안 돼요.",
    "required": [
      "실제로 본 모습과 설명 그림 구별"
    ],
    "explanation": "관찰 그림에는 현미경에서 직접 본 모습을 남겨요. 설명 그림은 구조를 알아보기 쉽게 나타낸 것이므로 흐리거나 못 본 부분을 그 그림처럼 꾸며 채우지 않아요.",
    "misconception": "관찰한 표본·배율·보이는 범위를 밝히고 안 보이는 구조를 그려 넣지 않아요.",
    "before": [
      "02680aca93283c0c"
    ]
  },
  "c22-s61-u03-b015": {
    "prompt": "같은 양파 표피를 보았는데 친구 그림과 내 그림이 달라요. 함께 다시 볼 때 맞춰 볼 관찰 조건 하나를 쓰세요.",
    "answer": "같은 배율로 같은 부분을 보아요.",
    "required": [
      "같은 부분·배율·초점·조명 등 타당한 관찰 조건 하나"
    ],
    "explanation": "표본의 같은 부분과 배율·초점·조명을 맞추어 보아요. 처음 그린 두 그림도 남기고 어떤 조건에서 보았는지 함께 살펴요.",
    "misconception": "관찰한 표본·배율·보이는 범위를 밝히고 안 보이는 구조를 그려 넣지 않아요.",
    "before": [
      "f6c5bdb3e83db45d"
    ]
  },
  "c22-s61-u03-b022": {
    "prompt": "뿌리가 있는 장치만 입구를 막았어요. 뿌리의 역할을 비교하려면 어떻게 고칠까요?",
    "answer": "③ 두 입구를 같은 방법으로 막는다.",
    "required": [
      "직접 증발 차이를 줄이는 같은 입구 처리"
    ],
    "explanation": "열린 용기에서는 물이 직접 증발할 수 있어요. 두 장치의 입구를 같은 방법으로 막아야 물이 줄어든 까닭을 뿌리가 있는지와 관련지어 비교할 수 있어요.",
    "misconception": "뿌리 유무 외의 조건과 용기에서 직접 증발하는 물을 함께 확인해요.",
    "before": [
      "c58a47aaae735038"
    ],
    "form": "choice",
    "choices": [
      "두 장치를 서로 다른 곳에 둔다.",
      "입구를 그대로 두고 물의 양만 잰다.",
      "두 입구를 같은 방법으로 막는다."
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u03-b027": {
    "prompt": "한 식물만 뿌리를 잘랐어요. 자른 곳에 무엇이 생겼나요? 낱말로 쓰세요.",
    "answer": "상처",
    "required": [
      "뿌리 제거와 함께 생긴 손상 구별"
    ],
    "explanation": "뿌리를 잘라 내면 뿌리가 없어질 뿐 아니라 상처도 생겨요. 두 식물을 준비한 방법과 상태를 함께 살펴야 물이 줄어든 차이를 설명할 수 있어요.",
    "misconception": "뿌리 유무 외의 조건과 용기에서 직접 증발하는 물을 함께 확인해요.",
    "before": [
      "b3fa01baaa031b90"
    ],
    "form": "short",
    "contract": {
      "kind": "short-text",
      "accepted": [
        "상처",
        "자른 상처",
        "잘린 상처",
        "절단 상처"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u03-b028": {
    "prompt": "뿌리는 물을 흡수하고, 식물의 몸을 땅에 붙잡아 [ ]해 줘요.",
    "answer": "지지",
    "required": [
      "뿌리의 몸 지지 역할"
    ],
    "explanation": "뿌리는 물을 흡수하며 식물의 몸을 지지하는 데도 도움을 줘요. 당근처럼 양분을 저장하는 예도 있어 한 기관에 여러 역할이 있을 수 있어요.",
    "misconception": "뿌리는 물 흡수·몸 지지와 연결돼요. 먹는 부분은 식물마다 달라요.",
    "before": [
      "7837c10ec3015a2c"
    ],
    "form": "blank",
    "contract": {
      "kind": "short-text",
      "accepted": [
        "지지"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u03-b031": {
    "prompt": "뿌리 유무가 다른 두 장치에서 물이 같은 양만큼 줄었어요. 처음 기록을 남긴 뒤 다시 비교할 때 확인할 조건 하나를 쓰세요.",
    "answer": "용기 입구를 같은 방법으로 막았는지 확인해요.",
    "required": [
      "시간·식물 상태·입구 처리 등 비교 조건 하나"
    ],
    "explanation": "이번에 물이 줄어든 양이 같았다고 뿌리가 물을 흡수하지 않는다고 할 수는 없어요. 처음 기록은 남겨 두고 시간과 식물 상태, 용기 입구를 막은 방법을 확인한 뒤 다시 비교해요.",
    "misconception": "뿌리 유무 외의 조건과 용기에서 직접 증발하는 물을 함께 확인해요.",
    "before": [
      "619249cb6459f29d"
    ]
  },
  "c22-s61-u03-b038": {
    "prompt": "줄기 겉에 색소 물이 묻었어요. 안으로 이동한 물의 자취는 선생님이 준비한 줄기의 어느 면에서 찾을까요?",
    "answer": "자른 면",
    "required": [
      "겉에 묻은 색과 내부 단면의 자취 구별"
    ],
    "explanation": "겉에 묻은 색만으로 내부의 물 이동을 정하지 않아요. 선생님이 준비한 가로·세로 단면의 안쪽과 색소 물에 넣기 전 줄기를 비교해요.",
    "misconception": "색소가 나타난 위치는 물의 이동 경로를 알아보는 근거예요. 모든 물질의 이동을 증명하지는 않아요.",
    "before": [
      "d72f6461d5e490d3"
    ],
    "form": "short",
    "contract": {
      "kind": "short-text",
      "accepted": [
        "자른 면",
        "줄기의 자른 면",
        "안쪽의 자른 면",
        "줄기 안쪽의 자른 면",
        "단면",
        "줄기 단면"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u03-b043": {
    "prompt": "줄기 안에서 붉은 부분을 찾지 못했다고 기록했어요. 다시 살필 때 확인할 조건 하나를 쓰세요.",
    "answer": "색소 물에 넣어 둔 시간을 확인해요.",
    "required": [
      "시간·줄기 상태·자른 위치·조명 중 타당한 조건 하나"
    ],
    "explanation": "붉은 부분을 찾지 못한 기록은 그대로 남겨요. 색소 물에 넣은 시간·줄기 상태·자른 위치·조명에서 다시 확인할 조건을 골라요. 예상 그림을 관찰 결과로 채우지 않아요.",
    "misconception": "색소가 나타난 위치는 물의 이동 경로를 알아보는 근거예요. 모든 물질의 이동을 증명하지는 않아요.",
    "before": [
      "c8a9b269c94af71f"
    ]
  },
  "c22-s61-u03-b044": {
    "prompt": "줄기가 잎을 받쳐 주면 잎이 빛을 받는 데 어떤 도움이 될까요?",
    "answer": "잎이 펼쳐져 빛을 받는 데 도움이 돼요.",
    "required": [
      "줄기의 잎 지지와 빛 받기 연결"
    ],
    "explanation": "줄기는 잎을 받쳐 펼쳐지게 하고 물이 이동하는 길도 돼요. 뿌리·줄기·잎의 기능을 실제 관찰과 실험에서 연결해요.",
    "misconception": "줄기의 지지·물 이동·저장 역할을 생김새와 근거로 연결해요.",
    "before": [
      "310ea5d35c3b2f51"
    ]
  },
  "c22-s61-u03-b047": {
    "prompt": "색소 물에 넣은 줄기의 붉은 자취로 직접 알 수 있는 것은 무엇인가요?",
    "answer": "① 물이 지나간 곳",
    "required": [
      "색소 물 관찰과 양분 이동의 직접 확인 구별"
    ],
    "explanation": "이 실험에서 따라가 본 것은 색소가 섞인 물이에요. 붉은 부분으로 물이 지나간 곳을 알아볼 수 있지만 양분도 같은 방향으로만 이동한다고 확인한 것은 아니에요.",
    "misconception": "색소가 나타난 위치는 물의 이동 경로를 알아보는 근거예요. 모든 물질의 이동을 증명하지는 않아요.",
    "before": [
      "1839724553881913"
    ],
    "form": "choice",
    "choices": [
      "물이 지나간 곳",
      "양분이 이동한 방향",
      "줄기에서 양분이 만들어진 곳"
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u03-b054": {
    "prompt": "빛을 받은 잎과 가린 잎을 비교해요. 실험 전에 녹말이 있었는지도 확인해야 하는 까닭은 무엇인가요?",
    "answer": "처음 있던 녹말과 이번에 만들어진 녹말을 구별하려고 해요.",
    "required": [
      "처음 녹말과 이번 빛 처리 영향 구별"
    ],
    "explanation": "처음부터 잎에 녹말이 있었다면 나중에 보인 반응이 이번에 빛을 받아 새로 생긴 녹말 때문인지 알기 어려워요. 어둡게 두었다는 말만으로 정하지 않고 실험 전 비교용 잎의 반응도 확인해요.",
    "misconception": "처리 전 녹말 상태와 처리 뒤 검출 결과가 있어야 빛의 영향을 해석해요.",
    "before": [
      "dae13466c75f4494"
    ]
  },
  "c22-s61-u03-b059": {
    "prompt": "빛을 준 잎과 가린 잎이 모두 청람색으로 변했어요. 기록을 남기고 다시 확인할 것은 무엇인가요?",
    "answer": "② 빛이 제대로 가려졌는지",
    "required": [
      "실제 두 반응을 보존하며 차단 상태 확인"
    ],
    "explanation": "두 잎이 청람색으로 변한 관찰을 그대로 남겨요. 빛 차단과 이름표를 확인해요. 실험 전 비교용 잎의 반응 기록도 살피며, 나중에 다른 잎을 검사한 것을 지난 실험 전 잎의 상태로 바꾸지는 않아요.",
    "misconception": "처리 전 녹말 상태와 처리 뒤 검출 결과가 있어야 빛의 영향을 해석해요.",
    "before": [
      "649fc0252827d3c7"
    ],
    "form": "choice",
    "choices": [
      "가린 잎의 기록을 지울지",
      "빛이 제대로 가려졌는지",
      "예상한 색으로 다시 칠할지"
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u03-b060": {
    "prompt": "빈칸에 알맞은 기관 이름을 쓰세요. 물은 [ ]에서 흡수되어 [ ]를 지나 잎으로 가요. 빛을 받아 양분을 만드는 곳은 [ ]이에요.",
    "answer": "뿌리, 줄기, 잎",
    "required": [
      "뿌리 흡수·줄기 이동·잎의 양분 생성"
    ],
    "explanation": "기관의 물 흡수와 광합성을 구별하면서 연결해야 해요. 흙에서 완성된 양분을 모두 가져온다고 하지 않아요.",
    "misconception": "광합성에 필요한 물·이산화 탄소와 빛을 구별하고 양분 생성과 연결해요.",
    "before": [
      "a7214293862b75dd"
    ],
    "form": "blank",
    "contract": {
      "kind": "ordered-word-parts",
      "parts": [
        {
          "accepted": [
            "뿌리"
          ]
        },
        {
          "accepted": [
            "줄기"
          ]
        },
        {
          "accepted": [
            "잎"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u03-b063": {
    "prompt": "잎의 녹말 반응으로 알 수 있는 것을 고르세요.",
    "answer": "③ 녹말이 있는지",
    "required": [
      "녹말 확인과 모든 양분 조사 구별"
    ],
    "explanation": "이 반응에서는 녹말이 있는지를 살펴요. 모든 양분의 종류와 양을 알아본 결과는 아니에요. 전에 만들어 저장하거나 다른 기관에서 온 양분도 있어요.",
    "misconception": "처리 전 녹말 상태와 처리 뒤 검출 결과가 있어야 빛의 영향을 해석해요.",
    "before": [
      "3aa37aa008ea8df6"
    ],
    "form": "choice",
    "choices": [
      "모든 양분의 양",
      "물이 이동한 방향",
      "녹말이 있는지"
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u03-b070": {
    "prompt": "한쪽 봉지에만 처음부터 물방울이 있었어요. 잎 유무를 비교하려면 처음에 어떻게 준비할까요?",
    "answer": "① 두 봉지를 모두 마른 상태로 준비한다.",
    "required": [
      "잎 유무 비교를 위한 같은 초기 물기 상태"
    ],
    "explanation": "처음 봉지의 물기가 나중 관찰에 섞이면 잎 유무의 영향만 구별하기 어려워요. 처음부터 같은 마른 상태로 준비하고 같은 시간·환경에서 다시 비교해요.",
    "misconception": "잎 유무를 비교할 때 봉지 초기 물기·용기 입구·주변 조건을 맞춰요.",
    "before": [
      "871d280490b9dfd6"
    ],
    "form": "choice",
    "choices": [
      "두 봉지를 모두 마른 상태로 준비한다.",
      "한쪽 봉지에만 물을 더 뿌린다.",
      "물방울이 있는 봉지만 오래 둔다."
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u03-b075": {
    "prompt": "잎에서는 물이 [ ]로 나가요. 봉지 안에서는 액체인 [ ]로 맺혀요.",
    "answer": "수증기, 물방울",
    "required": [
      "수증기로 나감과 액체 물방울 맺힘 구별"
    ],
    "explanation": "잎에서 수증기로 나가는 것이 증산 작용이에요. 그 수증기가 봉지 안에서 액체 물방울로 변한 것은 응결이에요. 두 과정을 이어서 설명해요.",
    "misconception": "증산은 식물 안의 물이 수증기로 나가는 현상이에요. 기공과 연결해요.",
    "before": [
      "3e01ab1342a862b5"
    ],
    "form": "blank",
    "contract": {
      "kind": "ordered-word-parts",
      "parts": [
        {
          "accepted": [
            "수증기"
          ]
        },
        {
          "accepted": [
            "물방울"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u03-b076": {
    "prompt": "잎 없는 장치에서도 물이 조금 줄었어요. 친구가 기록을 0으로 고치자고 해요. 기록은 어떻게 남길까요?",
    "answer": "실제로 줄어든 양을 그대로 남겨요.",
    "required": [
      "예상과 다른 실제 측정값 보존"
    ],
    "explanation": "예상과 달라도 실제로 잰 값을 그대로 남겨요. 남은 기관·절단 상처·입구 처리·직접 증발 등 다른 원인도 살펴보며 잎 유무에 따른 차이를 비교해요.",
    "misconception": "잎 유무를 비교할 때 봉지 초기 물기·용기 입구·주변 조건을 맞춰요.",
    "before": [
      "652b3f57393434a1"
    ]
  },
  "c22-s61-u03-b079": {
    "prompt": "물의 이동 경로를 완성하세요. 뿌리 → [ ] → 잎 → 공기 중의 [ ]",
    "answer": "줄기, 수증기",
    "required": [
      "뿌리 흡수→줄기 이동→잎의 증산 연결"
    ],
    "explanation": "뿌리가 흡수한 물이 줄기를 지나 잎으로 이동해요. 잎에서 물의 일부가 수증기로 나가는 증산 작용과 연결돼요.",
    "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
    "before": [
      "4eef8bc8409980a2"
    ],
    "form": "blank",
    "contract": {
      "kind": "ordered-word-parts",
      "parts": [
        {
          "accepted": [
            "줄기"
          ]
        },
        {
          "accepted": [
            "수증기"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u03-b086": {
    "prompt": "흙의 물이 잎까지 가는 길에서 빠진 기관 이름을 쓰세요. 흙의 물 → [ ] → [ ] → 잎",
    "answer": "뿌리, 줄기",
    "required": [
      "잎에 이르기 전 뿌리와 줄기의 물 이동 경로"
    ],
    "explanation": "흙의 물에서 뿌리, 줄기, 잎으로 화살표를 이어 그려요. 화살표에 어떤 물질이 어디로 이동하는지 적어야 물의 이동을 설명할 수 있어요.",
    "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
    "before": [
      "8a36bed7ce197641"
    ],
    "form": "blank",
    "contract": {
      "kind": "ordered-word-parts",
      "parts": [
        {
          "accepted": [
            "뿌리"
          ]
        },
        {
          "accepted": [
            "줄기"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u03-b091": {
    "prompt": "잎에서 만든 양분이 뿌리와 줄기에도 필요한 까닭을 짧게 쓰세요.",
    "answer": "뿌리와 줄기도 자라는 데 양분이 필요해요.",
    "required": [
      "잎에서 만든 양분과 다른 기관의 생장 연결"
    ],
    "explanation": "뿌리는 물을 흡수하고 줄기는 물이 잎으로 가는 길이 돼요. 잎에서 만들어진 양분은 여러 기관이 자라거나 저장하는 데 쓰여 기관들이 서로 연결돼요.",
    "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
    "before": [
      "7540e9b6e6603df8"
    ]
  },
  "c22-s61-u03-b092": {
    "prompt": "잎에서 만든 양분에 대한 설명으로 알맞은 것을 고르세요.",
    "answer": "② 뿌리 등 다른 기관으로 이동해 쓰이거나 저장된다.",
    "required": [
      "물 경로와 잎에서 만든 양분의 이동 구별"
    ],
    "explanation": "화살표는 물이 이동하는 길을 나타낸 것이에요. 잎에서 만든 양분은 뿌리 등 다른 기관으로 이동해 쓰이거나 저장될 수 있어요. 두 물질의 이름과 쓰임을 구별해요.",
    "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
    "before": [
      "5034b9e6014435ec"
    ],
    "form": "choice",
    "choices": [
      "잎에서만 쓰인다.",
      "뿌리 등 다른 기관으로 이동해 쓰이거나 저장된다.",
      "뿌리에서만 만들어져 잎으로 올라간다."
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u03-b095": {
    "prompt": "처진 잎 사진에서 직접 확인한 것을 고르세요.",
    "answer": "③ 잎이 처져 있다.",
    "required": [
      "잎 처짐 관찰과 원인 추측 구별"
    ],
    "explanation": "직접 본 것은 잎이 처진 모습이에요. 흙의 물 상태와 빛·온도, 식물의 상태를 더 살펴야 원인을 알아볼 수 있어요.",
    "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
    "before": [
      "79b170f93c177f2b"
    ],
    "form": "choice",
    "choices": [
      "뿌리가 모두 죽었다.",
      "흙이 완전히 말랐다.",
      "잎이 처져 있다."
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u03-b102": {
    "prompt": "벌이 꽃에 앉은 사진 한 장이 있어요. 씨가 생겼는지 알려면 나중에 무엇을 더 관찰해야 할까요?",
    "answer": "열매나 씨가 생기는지 더 관찰해야 해요.",
    "required": [
      "꽃 방문 장면과 이후 열매/씨 형성 구별"
    ],
    "explanation": "사진에서 확인한 것은 벌이 꽃에 앉은 모습이에요. 꽃가루가 암술머리에 닿았는지, 그 뒤 씨가 생겼는지는 각각 더 관찰해야 해요.",
    "misconception": "꽃가루가 암술머리에 닿는 것과 씨가 퍼지는 것을 구별해요.",
    "before": [
      "5c1ba855dddbfa6b"
    ]
  },
  "c22-s61-u03-b107": {
    "prompt": "종이 날개 모형을 떨어뜨렸어요. 실제로 한 활동과 맞는 기록을 고르세요.",
    "answer": "③ 종이 모형이 떨어지는 모습을 비교했다.",
    "required": [
      "종이 모형 결과와 실제 씨의 이동 측정 구별"
    ],
    "explanation": "종이 날개 모형의 떨어지는 모습을 비교한 것으로 기록해요. 실제 씨는 재료·무게·주변 바람이 다르므로 씨의 실제 이동 거리를 잰 결과로 바꾸지 않아요.",
    "misconception": "열매의 보호 역할과 씨의 퍼짐을 실제 특징에 근거해 설명해요.",
    "before": [
      "2729b2edf10095bb"
    ],
    "form": "choice",
    "choices": [
      "실제 나무 씨의 이동 거리를 쟀다.",
      "실제 씨가 싹 트는 모습을 보았다.",
      "종이 모형이 떨어지는 모습을 비교했다."
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u03-b108": {
    "prompt": "이름에 물이 들어간 식물의 꽃가루받이를 알아보려 해요. 이름 말고 어떤 관찰이나 자료를 찾아야 할까요?",
    "answer": "그 식물의 꽃가루가 옮겨지는 모습이나 꽃가루받이 자료를 찾아요.",
    "required": [
      "실제 꽃가루 이동 관찰 또는 해당 식물의 조사 자료"
    ],
    "explanation": "식물의 이름이나 사는 곳만으로 꽃가루받이 방법을 알 수는 없어요. 그 식물을 관찰하거나 조사한 내용을 근거로 설명해요.",
    "misconception": "꽃가루가 암술머리에 닿는 것과 씨가 퍼지는 것을 구별해요.",
    "before": [
      "940b652c08833e82"
    ]
  },
  "c22-s61-u03-b111": {
    "prompt": "관찰한 씨에는 날개가 있었어요. 모든 씨에 날개가 있는지 알려면 무엇을 더 살펴볼까요?",
    "answer": "다른 식물의 씨",
    "required": [
      "한 씨의 특징과 여러 식물의 씨 비교"
    ],
    "explanation": "관찰한 씨에는 날개가 있다고 말할 수 있어요. 다른 식물의 씨도 살펴 날개·갈고리 등 특징과 퍼지는 방법을 비교해요.",
    "misconception": "열매의 보호 역할과 씨의 퍼짐을 실제 특징에 근거해 설명해요.",
    "before": [
      "3fc2404ef20c6948"
    ],
    "form": "short",
    "contract": {
      "kind": "short-text",
      "accepted": [
        "다른 식물의 씨",
        "다른 씨",
        "여러 식물의 씨",
        "다른 종류의 씨",
        "다른 식물 씨"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u03-b118": {
    "prompt": "내가 본 잎은 넓게 펼쳐져 있어요. 빛을 받는 데 어떤 도움이 될까요?",
    "answer": "넓게 펼쳐져 빛을 받는 데 도움이 돼요.",
    "required": [
      "관찰한 잎의 생김새와 빛 받기 연결"
    ],
    "explanation": "내가 관찰한 잎의 넓은 모습과 빛 받기를 연결해 설명해요. 관찰한 생김새와 배운 원리를 근거로 하며 하지 않은 실험의 결과처럼 쓰지 않아요.",
    "misconception": "관찰·출처가 있는 조사와 설명을 연결하고 실제 자료를 만들어 친구에게 보여 줘요.",
    "before": [
      "f453abc4a727f376"
    ]
  },
  "c22-s61-u03-b123": {
    "prompt": "줄기가 잎을 받치는 모습을 보여 주려 해요. 어느 부분을 크게 보여 주면 좋을까요?",
    "answer": "줄기와 잎이 연결된 부분",
    "required": [
      "줄기와 잎의 연결 부분 표시"
    ],
    "explanation": "줄기와 잎이 이어진 곳을 크게 표시해요. 실제 소개에서는 그 모습을 짚어 줄기가 잎을 받치는 역할도 설명해요.",
    "misconception": "관찰·출처가 있는 조사와 설명을 연결하고 실제 자료를 만들어 친구에게 보여 줘요.",
    "before": [
      "5dce02b13f021667"
    ],
    "form": "short",
    "contract": {
      "kind": "short-text",
      "accepted": [
        "줄기와 잎이 연결된 부분",
        "줄기와 잎의 연결 부분",
        "줄기와 잎의 연결 부위",
        "줄기와 잎이 이어진 곳",
        "줄기와 잎이 만나는 곳"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u03-b124": {
    "prompt": "전체 식물 사진과 확대 그림을 함께 보여 주려 해요. 확대한 곳을 알기 쉽게 나타낸 방법을 고르세요.",
    "answer": "① 전체 사진의 해당 부분을 표시하고 확대 그림과 선으로 잇는다.",
    "required": [
      "전체에서 확대한 위치를 표시하고 확대 그림과 연결"
    ],
    "explanation": "전체 사진에서 확대한 부분을 테두리나 이름표로 표시하고 확대 그림과 이어요. 확대 그림에는 그 부분의 이름과 하는 일을 넣어 친구에게 소개해요.",
    "misconception": "관찰·출처가 있는 조사와 설명을 연결하고 실제 자료를 만들어 친구에게 보여 줘요.",
    "before": [
      "6b2d8e71c3b2d2c7"
    ],
    "form": "choice",
    "choices": [
      "전체 사진의 해당 부분을 표시하고 확대 그림과 선으로 잇는다.",
      "전체 사진과 확대 그림을 관계없이 나란히 놓는다.",
      "전체 사진을 지우고 확대 그림만 남긴다."
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    }
  },
  "c22-s61-u03-b127": {
    "prompt": "뿌리·줄기·잎 중 하나를 골라 하는 일 한 가지를 짧게 쓰세요.",
    "answer": "뿌리는 물을 흡수해요.",
    "required": [
      "선택한 식물 기관과 타당한 역할 하나"
    ],
    "explanation": "관심 식물의 부분을 골라 생김새와 하는 일을 연결해요. 실제 소개 자료에는 대상과 부분의 이름·확인한 관찰이나 자료·출처를 넣고 친구의 질문에 맞춰 설명을 고쳐요.",
    "misconception": "관찰·출처가 있는 조사와 설명을 연결하고 실제 자료를 만들어 친구에게 보여 줘요.",
    "before": [
      "1e43512b78e73999"
    ]
  },
  "c22-s61-u03-b016": {
    "prompt": "현미경으로 실제 관찰한 식물 세포를 크게 그리세요. 표본 이름·배율과 직접 확인한 구조에 이름표를 붙이세요. 관찰은 선생님과 먼저 해요.",
    "answer": "실제로 보인 세포 모양과 표본 이름·배율, 확인한 구조의 이름표를 남겨요.",
    "required": [
      "실제 관찰 그림·표본/배율·확인 구조와 불분명한 부분 구별"
    ],
    "explanation": "현미경에서 직접 본 세포의 모양을 크게 그리고 표본 이름과 배율을 적어요. 실제로 확인한 구조에 이름을 붙여요. 아직 관찰하지 않았다면 준비된 표본을 먼저 살펴요.",
    "misconception": "관찰한 표본·배율·보이는 범위를 밝히고 안 보이는 구조를 그려 넣지 않아요.",
    "before": [
      "bb217a1f9a329e39"
    ]
  },
  "c22-s61-u03-b032": {
    "prompt": "두 칸에 뿌리 있는 장치와 없는 장치를 그리세요. 처음 물 높이·같은 입구 처리·비교 시간을 표시하고 나중 결과는 비워 두세요.",
    "answer": "뿌리 유무를 나누고 물의 처음 높이·입구 처리·같은 시간을 표시해요. 결과는 비워요.",
    "required": [
      "뿌리 유무·같은 처음 조건과 시간·빈 결과 자리"
    ],
    "explanation": "두 장치에서 뿌리가 있는지만 다르게 하고 물과 용기, 잎 상태, 입구를 막는 방법과 시간을 같게 표시해요. 아직 실험 전이므로 나중 물의 양은 비워 두고, 식물을 자르는 준비는 선생님이 맡아요.",
    "misconception": "뿌리 유무 외의 조건과 용기에서 직접 증발하는 물을 함께 확인해요.",
    "before": [
      "daaaf16d1889c543"
    ]
  },
  "c22-s61-u03-b048": {
    "prompt": "줄기를 가로로 자른 면에는 붉은 점, 세로로 자른 면에는 긴 붉은 자취가 보인 자료예요. 두 칸에 각 모습을 그리고 자른 방향과 물이 지난 곳에 이름을 붙이세요.",
    "answer": "가로로 자른 면의 붉은 점 / 세로로 자른 면의 긴 자취와 색소 물 이름표.",
    "required": [
      "가로/세로 두 방향과 붉은 자취·색소 물 이동 이름표"
    ],
    "explanation": "가로로 자른 면에는 붉은 점을, 세로로 자른 면에는 길게 이어진 붉은 부분을 그려요. 각각 자른 방향과 물이 지나간 부분을 이름표로 설명해요. 문제에서 준 자료를 내가 직접 관찰한 것으로 쓰지 않아요.",
    "misconception": "색소가 나타난 위치는 물의 이동 경로를 알아보는 근거예요. 모든 물질의 이동을 증명하지는 않아요.",
    "before": [
      "5115cdd1af009a37"
    ]
  },
  "c22-s61-u03-b064": {
    "prompt": "녹말 반응을 비교할 빈 표를 그리세요. 실험 전 비교용 잎·빛을 받은 잎·가린 잎의 반응을 적을 칸에 이름을 붙이세요.",
    "answer": "실험 전 비교용 잎 / 빛 받은 잎 / 가린 잎의 반응 칸을 나누고 결과는 비워요.",
    "required": [
      "처리 전 확인과 처리 뒤 두 잎의 빈 반응 칸"
    ],
    "explanation": "실험 전 비교용 잎의 반응을 적을 곳과 빛을 받은 잎, 가린 잎의 반응을 적을 곳이 필요해요. 같게 한 식물 종류와 시간, 물의 상태도 표시하고 실제로 본 뒤 결과를 채워요.",
    "misconception": "처리 전 녹말 상태와 처리 뒤 검출 결과가 있어야 빛의 영향을 해석해요.",
    "before": [
      "41c8562ee98c5ad4"
    ]
  },
  "c22-s61-u03-b080": {
    "prompt": "두 칸에 잎 있는 장치와 없는 장치를 그리세요. 마른 봉지·같은 입구 처리·처음 물의 양·비교 시간을 표시하고 결과는 비워 두세요.",
    "answer": "잎 유무를 나누고 처음 마른 봉지·같은 입구 처리·물의 양·시간과 빈 결과 칸을 표시해요.",
    "required": [
      "잎 유무·마른 봉지/입구/초기 물·같은 시간·빈 결과 자리"
    ],
    "explanation": "잎이 있는 장치와 없는 장치를 그리고 마른 봉지, 같은 용기와 처음 물의 양, 입구를 막는 방법과 시간을 표시해요. 아직 관찰 전이므로 나중 물방울과 물의 양은 채우지 않아요.",
    "misconception": "잎 유무를 비교할 때 봉지 초기 물기·용기 입구·주변 조건을 맞춰요.",
    "before": [
      "5c7d92381ed7679e"
    ]
  },
  "c22-s61-u03-b096": {
    "prompt": "두 칸에 뿌리·줄기·잎을 그리세요. 한 칸에는 물이 가는 길, 다른 칸에는 잎에서 만든 양분이 쓰이는 곳을 화살표와 이름표로 나타내세요.",
    "answer": "물: 뿌리→줄기→잎 / 양분: 잎에서 만들어져 다른 기관에 쓰이거나 저장됨.",
    "required": [
      "세 기관과 물 이동 경로·잎의 양분 생성/쓰임 이름표"
    ],
    "explanation": "물은 뿌리에서 줄기를 지나 잎으로 가는 화살표로 나타내요. 잎에서 만든 양분은 다른 기관에 쓰이거나 저장되는 것으로 나타내고, 각 화살표에 물과 양분의 이름을 써요.",
    "misconception": "물의 흡수·이동·배출과 양분 생성/이동을 기관 사이의 관계로 설명해요.",
    "before": [
      "eb28fc1fb86d513d"
    ]
  },
  "c22-s61-u03-b112": {
    "prompt": "직접 보거나 자료에서 확인한 열매나 씨 하나를 그리세요. 씨를 보호하거나 퍼지는 데 도움이 되는 특징에 짧은 이름표를 붙이세요.",
    "answer": "날개 있는 씨의 날개 / 바람에 퍼지는 데 도움 등의 이름표.",
    "required": [
      "확인한 열매/씨의 특징과 보호 또는 퍼짐 기능 연결"
    ],
    "explanation": "실제로 확인한 열매나 씨를 크게 그리고, 씨를 보호하는 부분이나 날개와 갈고리 등을 표시해요. 그 특징이 보호나 퍼짐에 어떻게 도움이 되는지 설명하고 어디서 알아보았는지도 적어요.",
    "misconception": "열매의 보호 역할과 씨의 퍼짐을 실제 특징에 근거해 설명해요.",
    "before": [
      "5ba9ff2629930a50"
    ]
  },
  "c22-s61-u03-b128": {
    "prompt": "식물 하나를 소개할 자료의 배치를 그리세요. 두 칸에 전체 모습과 확대할 부분을 나누고 이름·하는 일·찾아본 자료를 넣을 자리에 표시하세요.",
    "answer": "전체 모습 / 확대한 부분과 이름 / 하는 일의 설명과 출처 자리.",
    "required": [
      "전체와 확대 부분·구조/기능 설명·자료 출처의 배치"
    ],
    "explanation": "전체 모습에서 어느 부분을 확대했는지 연결해요. 그림과 이름·하는 일의 설명·자료 출처를 놓을 자리를 정해요. 실제 자료 완성과 친구에게 소개하기는 이어지는 활동에서 따로 확인해요.",
    "misconception": "관찰·출처가 있는 조사와 설명을 연결하고 실제 자료를 만들어 친구에게 보여 줘요.",
    "before": [
      "ec509820746a1af6"
    ]
  },
  "c22-s61-u03-b019": {
    "prompt": "같은 용기의 입구를 막아 물이 직접 증발하는 것을 줄였어요. 같은 시간 뒤의 연습용 기록에서 물이 더 많이 줄어든 장치의 기호를 쓰세요.",
    "explanation": "가의 감소량은 40−29=11mL, 나는 40−36=4mL예요. 이번 비교 조건에서 물의 감소가 더 큰 쪽은 가예요.",
    "presentationOnly": true,
    "before": [
      "d8a870fffc208ff5",
      "737abbd943f2dac3"
    ],
    "givens": {
      "자료 구분": "표에 제시된 값을 비교해요.",
      "자료표": {
        "머리": [
          "장치",
          "뿌리",
          "처음 물(mL)",
          "나중 물(mL)"
        ],
        "행": [
          [
            "가",
            "있음",
            40,
            29
          ],
          [
            "나",
            "제거",
            40,
            36
          ]
        ]
      }
    }
  },
  "c22-s61-u03-b025": {
    "prompt": "가에는 50mL에서 41mL, 나에는 60mL에서 54mL가 남았습니다. 더 많이 줄어든 쪽의 기호를 쓰세요.",
    "explanation": "가는 50−41=9mL, 나는 60−54=6mL가 줄었으므로 가가 더 많이 줄었어요. 나중에 남은 양만 비교하지 않아요. 처음 양도 달랐으므로 이 표만으로 다른 조건이 모두 같았다고 할 수는 없어요.",
    "presentationOnly": true,
    "before": [
      "2dcfbb310888b17b",
      "8eb82c985bc5ed4e"
    ],
    "givens": {
      "자료 구분": "표에 제시된 값을 비교해요.",
      "자료표": {
        "머리": [
          "장치",
          "처음(mL)",
          "나중(mL)"
        ],
        "행": [
          [
            "가",
            50,
            41
          ],
          [
            "나",
            60,
            54
          ]
        ]
      }
    }
  },
  "c22-s61-u03-b041": {
    "prompt": "같은 색소 물·시간의 연습 관찰표에서 붉은 부분이 확인된 표본의 기호를 쓰세요.",
    "explanation": "가에서는 줄기 안에 붉은 부분이 보였어요. 나에서는 색을 구별하기 어려웠으므로, 물이 전혀 이동하지 않았다고 정하지 않아요.",
    "presentationOnly": true,
    "before": [
      "94bf5063317b1361",
      "e49f26c54806dc23"
    ],
    "givens": {
      "자료 구분": "표에 제시된 값을 비교해요.",
      "자료표": {
        "머리": [
          "표본",
          "교사 준비 단면 관찰"
        ],
        "행": [
          [
            "가",
            "내부에 붉은 자취가 보임"
          ],
          [
            "나",
            "구별하기 어려움"
          ]
        ]
      }
    }
  },
  "c22-s61-u03-b042": {
    "prompt": "줄기에 대한 알맞은 설명을 모두 고르세요.",
    "explanation": "줄기는 잎 등을 지지하고 물이 이동하는 통로가 돼요. 감자처럼 양분을 저장하는 줄기도 있어요.",
    "presentationOnly": true,
    "before": [
      "08de0ea05eeba8ea",
      "87aceb4ea4099ca4"
    ]
  },
  "c22-s61-u03-b055": {
    "prompt": "실험 전 비교용 잎에서는 녹말 반응이 나타나지 않았어요. 같은 시간이 지난 뒤 빛을 준 잎만 청람색이 되었어요. 알맞은 설명을 고르세요.",
    "explanation": "실험 전 비교용 잎에는 녹말 반응이 없었고, 빛을 받은 뒤 청람색이 나타났어요. 이 조건에서 빛을 받은 잎에 녹말이 생겼다는 설명과 연결할 수 있어요. 모든 양분의 종류를 알아낸 것은 아니에요.",
    "presentationOnly": true,
    "before": [
      "e94d9905595bf89b",
      "bea34ca459922a5a"
    ],
    "givens": {
      "자료 구분": "주어진 자료",
      "자료표": {
        "머리": [
          "비교한 잎",
          "녹말 반응"
        ],
        "행": [
          [
            "실험 전 비교",
            "청람색으로 변하지 않음"
          ],
          [
            "빛을 받은 뒤",
            "청람색"
          ],
          [
            "어둡게 둔 뒤",
            "청람색으로 변하지 않음"
          ]
        ]
      }
    }
  },
  "c22-s61-u03-b067": {
    "prompt": "입구를 막은 같은 장치의 연습표입니다. 물이 더 많이 줄어든 쪽의 기호를 쓰세요.",
    "explanation": "가는 55−52=3mL, 나는 55−34=21mL 줄었어요. 잎 유무 비교의 다른 조건도 확인하고 이번 결과로 설명해요.",
    "presentationOnly": true,
    "before": [
      "1261d57566900327",
      "aa0eaf915a5e5057"
    ],
    "givens": {
      "자료 구분": "표에 제시된 값을 비교해요.",
      "자료표": {
        "머리": [
          "장치",
          "잎",
          "처음(mL)",
          "뒤(mL)"
        ],
        "행": [
          [
            "가",
            "없음",
            55,
            52
          ],
          [
            "나",
            "있음",
            55,
            34
          ]
        ]
      }
    }
  },
  "c22-s61-u03-b073": {
    "prompt": "처음 48mL였던 물이 42mL가 되었습니다. 감소량을 단위와 함께 쓰세요.",
    "explanation": "48−42=6이고 물의 양 단위는 mL예요. 42mL는 남은 양이며 감소량과 달라요.",
    "presentationOnly": true,
    "before": [
      "1b21c005baa4062f",
      "b741287c4ea7cf7e"
    ],
    "givens": {
      "자료 구분": "표에 제시된 값을 비교해요."
    }
  },
  "c22-s61-u03-b105": {
    "prompt": "연습 관찰 기록: 가는 갈고리가 있어 털에 붙고, 나는 얇은 날개가 있습니다. 털에 붙어 이동하기 쉬운 쪽의 기호를 쓰세요.",
    "explanation": "가는 갈고리 같은 부분이 있어 털에 붙기 쉬워요. 이 특징으로 이동할 수 있는 방법을 설명하되, 문제에서 실제로 이동하는 모습까지 본 것은 아니에요.",
    "presentationOnly": true,
    "before": [
      "b6f8e553b30f8551",
      "1eab874b69cdfe71"
    ],
    "givens": {
      "자료 구분": "표에 제시된 값을 비교해요.",
      "자료표": {
        "머리": [
          "기호",
          "관찰 특징"
        ],
        "행": [
          [
            "가",
            "갈고리처럼 휘어진 부분"
          ],
          [
            "나",
            "얇고 넓은 날개 같은 부분"
          ]
        ]
      }
    }
  }
};
const clone=x=>JSON.parse(JSON.stringify(x));
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const bankCache=new WeakMap(),bookCache=new WeakMap();
const contract=(old,e)=>e.contract?{type:e.form==='choice'?'single-choice':'short-text',...(e.form==='choice'?{answer:e.key,accepted:[e.key]}:{answer:e.answer,accepted:e.contract.accepted||[e.answer],inputHint:e.contract.parts?'빈칸의 답을 쉼표로 나누어 차례대로 써요.':'짧은 낱말로 답해요.'}),plantAuthoredContract:clone(e.contract)}:({...old,sample:e.answer,reviewRequired:true,plantAuthoredContract:{...old.plantAuthoredContract,teacherRequired:true,sample:e.answer,required:[...e.required]},rubric:{...old.rubric,required:[...e.required],pass:'뜻이 같은 짧은 답과 알맞은 다른 예도 교사가 확인해요.'}});
export function plantStructureGuidedItems(rows,u){
 if(u!==unit||!rows?.length)return rows;let changed=false;
 const next=rows.map(q=>{const e=bankReview[q.id];if(!e||q.status!=='authored'||q.sourceRef?.type==='original'||!e.before.includes(fingerprint(q)))return q;changed=true;if(bankCache.has(q))return bankCache.get(q);
  const result={...q,prompt:[e.prompt,...(e.parts||[])].join('\n'),...(e.form?{bookResponseForm:e.form,responseContract:e.form==='choice'?'single-choice':'short-text',taxonomy:{...q.taxonomy,format:{choice:'객관식',blank:'빈칸 넣기',short:'단답형'}[e.form]}}:{}),...(e.presentationOnly?{}:{answerContract:contract(q.answerContract,e),misconception:e.misconception}),explanation:e.explanation,...(e.standard?{taxonomy:{...q.taxonomy,standard:e.standard}}:{}),...(Object.hasOwn(e,'givens')?{givens:clone(e.givens)}:{}),...(Object.hasOwn(e,'choices')?{choices:clone(e.choices)}:{}),...(Object.hasOwn(e,'diagnosticOverride')?{diagnosticOverride:clone(e.diagnosticOverride)}:{}),plantStructureGuidedResponse:PLANT_STRUCTURE_GUIDED_VERSION,contentVersion:PLANT_STRUCTURE_GUIDED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};bankCache.set(q,result);return result;
 });return changed?next:rows;
}
export function withPlantStructureGuidedClassroom(u,mod){if(u!==unit)return mod;const items=plantStructureGuidedItems(mod?.classroomItems,u);return items===mod?.classroomItems?mod:{...mod,classroomItems:items};}

const fields={
  "식물을 키우거나 자세히 본 적이 있나요? 뿌리·줄기·잎에 관해 알고 있거나 궁금한 점을 자유롭게 적어 보아요.": [
    "워밍업",
    "식물을 키우거나 자세히 본 모습, 또는 뿌리·줄기·잎에서 궁금한 점을 짝과 말해요."
  ],
  "관찰하거나 실험으로 알아보고 싶은 식물의 구조와 기능을 적어요.": [
    "궁금한 점",
    "직접 관찰하거나 실험해 보고 싶은 질문 하나를 말해요."
  ],
  "잎 한 장이 세포 하나라는 말과 실제 표본에서 보인 모양을 연결해 생각해요.": [
    "개념을 내 말로",
    "잎 전체와 양파 표피에서 보인 여러 세포를 구별해 말해요."
  ],
  "실제 표본에서 볼 것과 설명 그림에서 참고할 것을 나누어 써요.": [
    "관찰과 설명 그림",
    "실제 현미경에서 보인 모습과 설명 그림에서 참고할 것을 나누어 말해요."
  ],
  "뿌리 유무 외에 같게 준비할 조건 두 가지와 그 까닭을 써요.": [
    "개념을 내 말로",
    "뿌리 유무를 비교할 때 같게 할 조건 하나를 말해요."
  ],
  "읽은 값과 불분명한 것, 더 확인할 조건을 써요.": [
    "우리의 비교 조건과 근거",
    "실제 읽은 값과 불분명한 것을 짚고 다시 확인할 조건 하나를 말해요."
  ],
  "가로 단면과 세로 단면을 함께 볼 때 더 잘 설명할 수 있는 것을 써요.": [
    "개념을 내 말로",
    "가로로 자른 면과 세로로 자른 면에서 색이 이어지는 곳을 짚어요."
  ],
  "자른 방향· 색이 보인 부분·표본 이름을 왜 표시해야 하는지 써요.": [
    "그림에 꼭 넣을 이름표",
    "그림에서 자른 방향·색이 보인 곳·표본 이름을 짚어 설명해요."
  ],
  "빛 처리 뒤 반응만 보지 않고 처리 전 상태도 확인하는 까닭을 써요.": [
    "개념을 내 말로",
    "실험 전 잎의 녹말 반응 기록을 확인하는 까닭을 말해요."
  ],
  "시작 상태와 처리 전/뒤 비교를 근거로 설명해요.": [
    "이번 결과로 말할 수 있는 것",
    "실험 전 비교용 잎과 처리 뒤 두 잎의 반응 기록을 짚어 말해요."
  ],
  "증산 작용의 수증기와 봉지 안 물방울의 상태를 구별해 써요.": [
    "개념을 내 말로",
    "잎에서 나갈 때의 수증기와 봉지에 맺힌 물방울을 구별해 말해요."
  ],
  "잎 유무 외의 조건과 물방울/물의 감소에서 확인할 것을 써요.": [
    "같게 할 조건과 볼 것",
    "잎 유무 외에 같게 할 것 하나와 실제로 관찰할 곳을 짚어요."
  ],
  "처음 물기·직접 증발·절단 영향을 함께 살펴 결론을 써요.": [
    "관찰과 해석",
    "처음 물기·입구 처리·상처가 결과에 영향을 줄 수 있는 까닭을 말해요."
  ],
  "뿌리·줄기·잎의 관계를 물과 양분으로 연결해 써요.": [
    "개념을 내 말로",
    "뿌리·줄기·잎이 물과 양분으로 어떻게 연결되는지 말해요."
  ],
  "꽃가루받이와 씨가 퍼지는 과정은 어떻게 다른지 설명해요.": [
    "개념을 내 말로",
    "꽃가루받이와 씨가 퍼지는 모습을 나누어 말해요."
  ],
  "꽃 방문·꽃가루받이·열매/씨 형성·씨 퍼짐을 구별해 써요.": [
    "같은 단계일까요?",
    "꽃 방문·꽃가루받이·열매와 씨 형성·씨 퍼짐을 차례로 구별해요."
  ],
  "관찰이나 조사에서 아직 분명하지 않은 점을 적어요.": [
    "더 확인할 질문",
    "관찰이나 조사에서 더 알아볼 점 하나를 짝과 말해요."
  ],
  "내 자료에서 구조·기능·근거를 어떻게 연결할지 써요.": [
    "개념을 내 말로",
    "내 자료의 식물 부분과 하는 일을 관찰이나 조사한 내용으로 연결해 말해요."
  ],
  "관심 식물·구조·관련된 역할과 근거가 이어지도록 써요.": [
    "한 장 자료의 중심 문장",
    "내가 고른 식물 부분의 모습과 하는 일을 연결해 말해요."
  ],
  "소개한 식물과 구조, 관련된 기능을 써요.": [
    "보여 준 자료와 설명한 내용",
    "실제로 소개한 식물의 부분과 하는 일을 다시 짚어 말해요."
  ],
  "친구가 궁금해한 점과 내가 찾아 설명한 내용을 적어요.": [
    "받은 질문과 확인한 근거",
    "친구의 질문을 듣고 더 알아본 내용을 자료에서 짚어 설명해요."
  ],
  "친구가 이해하기 쉽도록 고친 그림이나 문장을 적어요.": [
    "고친 설명과 다시 보여 주기",
    "고친 그림이나 문장을 보여 주며 친구에게 다시 설명해요."
  ],
  "처음 생각과 실제 관찰이나 읽은 자료를 연결하여 써요.": [
    "내 생각이 달라진 근거",
    "처음 생각과 달라진 점을 실제 관찰이나 읽은 자료로 말해요."
  ],
  "불분명한 부분과 다시 확인할 관찰 조건을 짧게 써요.": [
    "A-2 다시 관찰할 점",
    "실제 관찰 그림에서 흐리게 보인 곳을 짚고 다시 살필 조건을 말해요."
  ],
  "무엇을 달리하고 무엇을 같게 했는지 써요.": [
    "B-1 비교 조건",
    "실제 실험에서 바꾼 것과 같게 한 것을 짚어 말해요."
  ],
  "실제 관찰로 말할 수 있는 것과 더 확인할 것을 나누어 써요.": [
    "B-2 근거와 결론",
    "실제 관찰 기록에서 알 수 있는 것과 더 확인할 것을 나누어 말해요."
  ],
  "고친 그림/문장과 그 까닭을 써요.": [
    "친구의 질문을 듣고 고쳐요",
    "친구의 질문에 맞춰 고친 그림이나 문장을 보여 주고 까닭을 말해요."
  ],
  "친구에게 다시 설명한 내용을 적어요. 아직 설명하지 않았다면 다음에 할 일을 적어요.": [
    "다시 설명할 내용",
    "친구에게 실제로 다시 설명해요. 아직 못 했다면 다음에 할 일 하나를 정해요."
  ]
};
const cues=[
  "식물의 어떤 부분이 어떤 일을 하는지 궁금한 점을 짝과 말해요.",
  "현미경 관찰과 기관 기능 실험 중 해 보고 싶은 것을 골라요.",
  "세포와 뿌리·줄기·잎은 어떤 관계인지 짝과 말해요.",
  "직접 본 모습을 그린 관찰 그림과, 구조를 알기 쉽게 나타낸 모식도는 어떻게 다른지 짝과 말해요.",
  "세포 관찰에 현미경을 사용하는 까닭을 짝과 말해요.",
  "핵·세포막·세포벽의 이름을 설명과 연결하고, 실제 표본에서는 모두 뚜렷하게 보이지 않을 수 있는 까닭을 생각해요.",
  "배율을 높이기 전에 표본을 가운데에 놓는 까닭을 짝과 말해요.",
  "앞쪽 9번의 두 기록 중 직접 관찰의 근거가 담긴 기록을 고르고, 실제로 보이지 않은 구조를 그려 넣으면 안 되는 까닭을 짝과 말해요.",
  "‘잎 한 장이 세포 하나’라는 말을 고쳐요.",
  "핵이나 경계가 흐리게 보였다고 그 구조가 없다고 말할 수 있을까요? 설명 그림과 실제 표본의 차이를 생각해요.",
  "세포가 흐릴 때 다시 살펴볼 조건을 두 가지 짝과 말해요.",
  "실제로 본 모양과 확인한 구조에만 이름표를 붙여요.",
  "처음 본 세포와 다른 위치의 세포를 비교해요.",
  "뿌리가 하는 일을 두 가지 짝과 말해요.",
  "40mL에서 30mL가 되면 얼마나 줄었는지 짝과 말해요.",
  "뿌리가 있는 쪽과 없는 쪽에서 비교할 양을 짝과 말해요.",
  "실험에서 달리할 조건과 같게 할 조건을 나누어요.",
  "먹는 부분이 뿌리인 식물과 줄기인 식물을 하나씩 짝과 말해요.",
  "50→41mL와 60→54mL의 감소량을 비교해요.",
  "뿌리 유무 외에 결과에 영향을 줄 수 있는 것을 짝과 말해요.",
  "물의 양을 비교한 실험의 순서를 짝과 말해요.",
  "같은 결과가 나온 까닭을 확인할 방법을 제안해요.",
  "뿌리 유무와 같게 할 조건을 나누어 짚어요.",
  "물통의 물이 식물을 거치지 않고 바로 증발할 수도 있어요. 이 영향을 줄이려면 어떻게 해야 할까요?",
  "줄기를 가로로 자른 면과 세로로 자른 면을 비교해요.",
  "줄기를 가로로 잘랐을 때의 붉은 점과 세로로 잘랐을 때의 긴 붉은 자취를 비교해요. 두 모습이 어떻게 이어지는지 짝과 말해요.",
  "줄기의 두 기능이 잎에 왜 필요한지 짝과 말해요.",
  "줄기를 가로로 자른 면과 길게 자른 면에서 붉은 자취가 어떻게 다르게 보이는지 짝과 말해요.",
  "줄기 내부의 이동을 알아보려면 어디를 볼지 짝과 말해요.",
  "감자와 당근이 같은 기관인지 짝과 말해요.",
  "결과를 바꾸지 않고 더 확인할 점을 짝과 말해요.",
  "색소 물 실험에서 직접 이동을 확인한 물질은 무엇인가요? 다른 물질의 이동까지 알 수 있는지도 생각해요.",
  "줄기 실험으로 설명할 수 있는 것과 없는 것을 짝과 말해요.",
  "두 방향으로 자른 면에서 물이 지난 자취를 찾아요.",
  "처리 전후 줄기의 차이를 관찰 문장으로 짝과 말해요.",
  "광합성에 필요한 물질과 빛을 구별해요.",
  "빛을 받은 잎과 가린 잎의 반응을 비교해요.",
  "잎의 구조를 양분을 만드는 기능과 연결해요.",
  "물과 이산화 탄소는 어디에서 오는지 짝과 말해요.",
  "실험 전에 잎의 녹말을 확인하는 까닭을 짝과 말해요.",
  "광합성에 이용하는 기체의 이름을 짝과 말해요.",
  "실험 결과가 예상과 다를 때 다시 살펴볼 조건을 짝과 말해요.",
  "약품을 처리한 잎에서 무엇을 관찰할지 짝과 말해요.",
  "‘식물의 모든 양분은 녹말’이라는 말을 고쳐요.",
  "실험 전과 빛을 처리한 뒤의 반응을 적을 자리를 나누어요.",
  "이번 비교로 알게 된 잎의 기능을 짝과 말해요.",
  "잎에서 나가는 물과 봉지 안 물방울의 상태를 구별해요.",
  "봉지가 처음부터 젖어 있으면 생기는 문제를 짝과 말해요.",
  "55→52mL와 55→34mL의 차이를 구해요.",
  "두 장치에서 같게 해야 할 조건을 세 가지 짝과 말해요.",
  "수증기로 나감과 물방울로 맺힘을 순서대로 짝과 말해요.",
  "48mL에서 42mL가 되었을 때 감소량과 남은 양을 짝과 말해요.",
  "잎 없는 장치의 값이 꼭 0일 필요가 없는 까닭을 생각해요.",
  "뿌리·줄기·잎에서 물이 이동하는 순서를 짝과 말해요.",
  "처음 마른 봉지와 같은 입구·물의 양·시간을 짚어요.",
  "이번 관찰로 알 수 있는 증산 작용의 특징을 짝과 말해요.",
  "물과 양분의 이동을 구별해 기관의 관계를 짝과 말해요.",
  "물 이동 화살표로 모든 양분의 이동을 나타낼 수 있는지 짝과 말해요.",
  "흙의 물이 잎까지 가는 길을 화살표로 나타내고, 거치는 기관의 이름을 짝과 말해요.",
  "양분을 만드는 기관과 저장하는 기관의 관계를 짝과 말해요.",
  "잎의 구조 한 가지와 관련된 기능을 짝과 말해요.",
  "기능을 확인하려면 사진 외에 어떤 자료가 필요한지 짝과 말해요.",
  "세 기관이 서로 관계없는 부품이라는 말을 고쳐요.",
  "각 실험에서 확인한 사실을 하나씩 골라 연결해요.",
  "잎이 처졌을 때 확인할 흙과 주변 환경의 상태를 짝과 말해요.",
  "두 칸에서 물과 양분의 이름과 가는 곳을 구별해요.",
  "물의 이동 경로와 양분이 쓰이는 기관을 그림에 표시해요.",
  "꽃에서 씨가 퍼질 때까지 구별할 단계를 짝과 말해요.",
  "갈고리와 날개가 각각 어떤 이동에 도움이 되는지 짝과 말해요.",
  "수술과 암술머리의 역할을 구별해요.",
  "수술·암술머리·뿌리의 역할을 연결해요.",
  "꽃 방문 뒤에 더 관찰해야 할 것을 짝과 말해요.",
  "씨를 보호하는 부분과 이동에 도움이 되는 부분을 구별해요.",
  "모형과 실제 씨에서 다른 조건을 두 가지 짝과 말해요.",
  "꽃가루받이 방법을 알아보려면 어떤 자료가 필요한지 짝과 말해요.",
  "제시한 기록에서 이동하는 것이 꽃가루인지 씨인지 표시해요.",
  "씨를 보호하거나 퍼지는 데 도움이 되는 특징을 짚어요.",
  "내가 알아볼 식물과 구조, 궁금한 기능을 정해요.",
  "친구에게 소개하고 싶은 식물의 특징을 짝과 말해요.",
  "내 자료에서 확대해 보여 줄 부분을 고르고 까닭을 짝과 말해요.",
  "설명할 구조와 그 구조가 하는 일을 한 문장으로 짝과 말해요.",
  "내 설명을 뒷받침하는 관찰이나 자료를 골라요.",
  "선인장의 잎과 줄기가 하는 일을 비교해요.",
  "당근의 뿌리가 하는 일과 앞쪽 119번에 나온 선인장의 잎·줄기가 하는 일을 비교해요.",
  "줄기가 잎을 지지한다는 것을 그림에서 어떻게 보일지 짝과 말해요.",
  "감자와 고구마의 먹는 부분이 어떤 기관인지 짝과 말해요.",
  "친구에게 설명할 때 꼭 보여 줄 근거를 골라요.",
  "전체에서 확대한 부분과 하는 일의 설명을 이어 배치해요.",
  "소개 자료에 식물 이름과 기능 설명이 있는지 살펴요.",
  "친구의 질문과 더 알아본 식물의 특징을 짝과 말해요.",
  "세포 관찰과 뿌리·줄기·잎 실험에서 알게 된 것을 짝과 말해요. 두 내용이 어떻게 이어지는지도 짝과 말해요.",
  "내 관찰 그림의 모양과 이름표를 다시 확인해요.",
  "내가 고른 실험에서 알게 된 기능과 근거를 짝과 말해요.",
  "자료에서 가장 잘 설명한 특징과 보충할 내용을 짝과 말해요."
];
export function withPlantStructureGuidedWorkbook(w){
 if(w?.unit!==unit||fingerprint(w)!==prior)return w;if(bookCache.has(w))return bookCache.get(w);
 const questions=w.questions.map(q=>{const e=review[q.no];if(!e||fingerprint(q)!==e.before)return q;const criteria=e.required.join(' / '),changes={prompt:e.prompt,answer:e.answer,requirements:[...e.required],criteria,explanation:e.explanation,misconception:e.misconception,responseContract:{...q.responseContract,type:q.form,teacherRequired:true,sample:e.answer,required:[...e.required],criteria},plantStructureGuidedResponse:PLANT_STRUCTURE_GUIDED_VERSION,contentVersion:PLANT_STRUCTURE_GUIDED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};for(const k of['lines','given','drawingPanels','drawingExplanationLines','form','choices','key'])if(Object.hasOwn(e,k))changes[k]=e[k];if(e.contract){changes.responseContract=clone(e.contract);delete changes.lines;}const result={...q,...changes};if(e.contract)delete result.lines;return result;});
 const rewritten=w.pages.map((p,i)=>({...p,blocks:p.blocks.flatMap(b=>b.type==='field'&&!b.draw?[{type:'heading',text:fields[b.hint][0]},{type:'text',text:fields[b.hint][1]}]:[b]),rail:p.rail.map(n=>n.title==='내가 정리할 것'?Object.fromEntries([...Object.entries(n).filter(([k])=>k!=='write'&&k!=='text'),['text',cues[i]]]):n)}));
 const separated=rewritten.flatMap((p,i)=>![12,34,66,88,91].includes(i)?[p]:[{...p,blocks:p.blocks.filter(b=>!(b.type==='field'&&b.draw))},{...p,title:{12:'실제로 보인 세포 그림',34:'줄기를 자른 두 방향의 모습',66:'물과 양분의 길을 그려요',88:'내 식물 소개 자료 만들기',91:'실제로 관찰한 세포를 표시해요'}[i],blocks:p.blocks.filter(b=>b.type==='field'&&b.draw)}]);
 const split=separated;
 const ids=ps=>ps.flatMap(p=>p.blocks.flatMap(b=>b.ids||[]));
 const titles={"1":"식물의 몸을 이루는 세포","4":"현미경 관찰 준비와 기록","6":"보인 구조와 관찰 기록","7":"배율과 보인 세포 구조","10":"세포와 직접 관찰한 모습","13":"실제 관찰과 그림 비교하기","16":"실제로 본 식물 세포","17":"뿌리의 역할과 물의 양","20":"뿌리 비교에서 같게 할 것","22":"입구 처리와 저장하는 기관","23":"물의 양과 저장하는 기관","25":"물의 감소량과 비교한 결과","26":"식물의 상태와 뿌리 역할","27":"뿌리를 자른 상태와 역할","29":"비교한 결과와 다시 살필 것","30":"뿌리의 물 흡수 비교하기","32":"뿌리 있는 장치와 없는 장치","33":"줄기의 역할과 물의 자취","36":"줄기를 자른 방향과 색","38":"겉에 묻은 색과 안쪽의 자취","41":"줄기를 관찰한 기록","43":"줄기의 색과 잎을 받치는 역할","46":"색소 물 관찰로 알 수 있는 것","48":"가로와 세로로 자른 줄기","49":"잎이 양분을 만드는 과정","52":"빛과 녹말 반응 비교","54":"처리 전과 처리 뒤의 반응","56":"빛을 비교할 조건과 자료","59":"두 잎의 반응과 기관 역할","62":"실험 전과 뒤의 기록 읽기","64":"잎의 녹말 반응을 적을 빈 표","65":"잎에서 수증기로 나가는 물","68":"봉지 비교와 물의 모습","70":"처음 물기와 나중에 본 결과","74":"물방울과 실제로 줄어든 물","77":"비교 조건과 뿌리부터 잎까지","80":"잎 있는 장치와 없는 장치","81":"물의 길과 식물 기관","84":"함께 일하는 기관의 역할","86":"그림에 빠진 기관과 양분의 쓰임","87":"양분의 쓰임과 생김새","90":"물과 양분으로 연결된 기관","93":"물 이동과 실제 관찰 비교","96":"물의 길과 양분의 쓰임 그림","97":"꽃가루받이와 꽃의 구조","100":"꽃가루와 씨의 형성","101":"꽃 방문과 나중의 씨 관찰","103":"열매의 역할과 씨 퍼짐","106":"모형과 실제 씨의 퍼짐","109":"꽃에서 씨가 퍼지기까지","112":"열매나 씨의 특징 그림","113":"식물의 특징을 설명할 자료","116":"한 장 자료와 설명할 내용","118":"여러 식물의 생김새와 역할","119":"선인장·잎·뿌리의 역할","122":"전체 모습과 확대할 부분","125":"식물의 역할과 소개 자료","128":"전체와 확대 그림 소개 자료"};
 const arrange=(ps,packs)=>{const out=[];for(let i=0;i<ps.length;){const p=ps[i];if(!p.blocks.every(b=>b.type==='questions')){out.push(p);i++;continue;}const run=[];while(i<ps.length&&ps[i].blocks.every(b=>b.type==='questions'))run.push(ps[i++]);const ns=ids(run).map(id=>questions.find(q=>q.id===id).no),groups=packs.filter(g=>ns.includes(g[0]));if(JSON.stringify(groups.flat())!==JSON.stringify(ns))throw Error('식물의 구조와 기능 문항 묶음의 순서가 달라요.');for(const g of groups){const base=run.find(p=>ids([p]).includes(questions[g[0]-1].id));out.push({...base,title:titles[g[0]],section:`연습 ${g[0]}${g.length>1?'~'+g.at(-1):''}`,blocks:[{type:'questions',ids:g.map(n=>questions[n-1].id)}]});}}return out;};
 const pages=arrange(split,[[1,2,3],[4,5],[6,7,8,9],[10,11,12],[13,14,15],[16],[17,18,19],[20,21],[22,23,24],[25,26],[27,28,29],[30,31],[32],[33,34,35],[36,37],[38,39,40],[41,42],[43,44,45],[46,47],[48],[49,50,51],[52,53],[54,55],[56,57,58],[59,60,61],[62,63],[64],[65,66,67],[68,69],[70,71,72,73],[74,75,76],[77,78,79],[80],[81,82,83],[84,85],[86,87,88,89],[90,91,92],[93,94,95],[96],[97,98,99,100],[101,102],[103,104,105],[106,107,108],[109,110,111],[112],[113,114,115],[116,117],[118,119,120,121],[122,123,124],[125,126,127],[128]]),teacherStudentPages=arrange(split,[[1,2,3],[4,5,6],[7,8,9],[10,11,12],[13,14,15],[16],[17,18,19],[20,21,22],[23,24,25],[26,27,28],[29,30,31],[32],[33,34,35],[36,37],[38,39,40],[41,42],[43,44,45],[46,47],[48],[49,50,51],[52,53],[54,55],[56,57,58],[59,60,61],[62,63],[64],[65,66,67],[68,69],[70,71,72,73],[74,75,76],[77,78,79],[80],[81,82,83],[84,85,86],[87,88,89],[90,91,92],[93,94,95],[96],[97,98,99],[100,101,102],[103,104,105],[106,107,108],[109,110,111],[112],[113,114,115],[116,117,118],[119,120,121],[122,123,124],[125,126,127],[128]]);if(JSON.stringify(ids(pages))!==JSON.stringify(ids(w.pages))||JSON.stringify(ids(teacherStudentPages))!==JSON.stringify(ids(pages)))throw Error("식물의 구조와 기능 문항 순서가 달라요.");
 const teacherPages=w.teacherPages.flatMap(p=>{const block=p.blocks.find(b=>b.type==='solutions');if(!block||!['c22-s61-u03-w004','c22-s61-u03-w007','c22-s61-u03-w033','c22-s61-u03-w049','c22-s61-u03-w052','c22-s61-u03-w055','c22-s61-u03-w058','c22-s61-u03-w071','c22-s61-u03-w080','c22-s61-u03-w083'].includes(block.ids?.[0]))return[p];return[block.ids.slice(0,2),block.ids.slice(2)].map(ids=>({...p,section:`정답·해설 ${Number(ids[0].slice(-3))}~${Number(ids.at(-1).slice(-3))}`,blocks:[{type:'solutions',ids}]}));});
 const byNo=new Map(questions.map(q=>[q.no,q])),labels={choice:'객관식',blank:'빈칸',short:'단답'};const figures={...w.figures};for(const key of w.quickPages.flatMap(p=>p.blocks.filter(b=>b.type==='diagram').map(b=>b.key))){figures[key]=figures[key].replace(/(<tr><th scope="row">)(\d+)(<\/th><td>)([\s\S]*?)(<\/td><td>)([\s\S]*?)(<\/td><\/tr>)/g,(row,a,n,b,form,c,answer,d)=>{const q=byNo.get(Number(n));return review[n]?.contract?a+n+b+labels[q.form]+c+(q.form==='choice'?'①②③④⑤'[q.key]:q.answer)+d:row;});}const result={...w,questions,figures,pages,teacherStudentPages,teacherPages};bookCache.set(w,result);return result;
}
