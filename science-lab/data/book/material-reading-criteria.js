export const MATERIAL_READING_VERSION='20261115-material-reading-criteria';
export const MATERIAL_READING_UNITS=["c22-s32-u01", "c22-s32-u02", "c22-s42-u01", "c22-s42-u02", "c22-s32-u03", "s41-u03", "s41-u04", "c22-s51-u01"];
export const MATERIAL_READING_BANK_UNITS=["c22-s32-u02"];
// Align teacher criteria with the question and supplied material; preserve historic answers.
const patches={
  "c22-s32-u02-b24": {
    "unit": "c22-s32-u02",
    "previousVersion": "20261115-earth-surface-photo",
    "prompt": "다음 지구 사진 한 장만으로 육지와 바다의 넓이를 비교하기 어려운 까닭을 쓰세요. 더 알아볼 방법도 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 지구와 바다 창작 학습",
      "course": "초등3-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T03",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-01"
    },
    "responseContract": "written-explanation",
    "previousAnswerContract": {
      "type": "written-explanation",
      "sample": "구름이 표면을 가리고 사진에는 지구의 일부만 보일 수 있어요. 지구 전체 자료와 범례를 함께 비교해요.",
      "rubric": {
        "required": [
          "자료와 근거를 연결한 타당한 설명"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "자료와 근거를 연결한 타당한 설명을 선생님과 확인한다."
      }
    },
    "previousChoices": null,
    "presentation": {
      "givens": null,
      "figure": "assets/activities/c22-s32-u02/earth-apollo17-nasa.jpg",
      "observationPhotos": null,
      "photoLabels": [
        "우주에서 촬영한 지구"
      ],
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null
    },
    "fields": {
      "answerContract": {
        "type": "written-explanation",
        "sample": "구름이 표면을 가리고 사진에는 지구의 일부만 보일 수 있어요. 지구 전체 자료와 범례를 함께 비교해요.",
        "rubric": {
          "required": [
            "사진에 지구의 일부만 보이거나 구름에 가린 곳이 있다는 까닭과, 지구 전체를 나타낸 자료로 비교할 방법을 함께 설명해요"
          ],
          "criteria": [
            "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
          ],
          "pass": "자료와 근거를 연결한 타당한 설명을 선생님과 확인한다."
        }
      }
    }
  }
};
const workbookPatches={
  "c22-s32-u01-w006": {
    "unit": "c22-s32-u01",
    "previousStatus": null,
    "prompt": "관찰 기록에서 뒤에 둔 글씨가 비쳐 보인 재료는 무엇인가요?",
    "sourceId": "c22-s32-u01-b09",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 물체와 물질 보충",
      "course": "초등3-2"
    },
    "presentation": {
      "form": "choice",
      "key": 1,
      "choices": [
        "네 재료 모두",
        "다 유리판",
        "가 나무 조각",
        "나 철 조각",
        "라 플라스틱 판"
      ],
      "givens": null,
      "given": null,
      "table": null,
      "parts": null,
      "figure": null,
      "sharedFigure": "given-c22-s32-u01-b09"
    },
    "fields": {
      "criteria": [
        "관찰한 특징과 비교 조건을 쓰임에 연결한 같은 뜻의 답을 인정해요.",
        "글씨가 비쳐 보인다고 적힌 다 유리판을 골라요."
      ]
    }
  },
  "c22-s32-u02-w009": {
    "unit": "c22-s32-u02",
    "previousStatus": null,
    "prompt": "다음 지구 사진에는 구름에 가린 곳이 있어요. 가려진 곳을 더 알아보는 방법을 고르세요.",
    "sourceId": "c22-s32-u02-b20",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 지구와 바다 창작 학습",
      "course": "초등3-2"
    },
    "presentation": {
      "form": "choice",
      "key": 0,
      "choices": [
        "가려진 표면은 다른 자료로 더 확인한다.",
        "구름에 가린 곳은 모두 육지에 넣어 넓이를 센다.",
        "구름에 가린 곳은 모두 바다에 넣어 넓이를 센다.",
        "보이는 표면에서 구한 관계가 뒤쪽에도 같다고 정한다.",
        "같은 사진을 확대하면 구름 아래 표면도 확인된다고 한다."
      ],
      "givens": null,
      "given": null,
      "table": null,
      "parts": null,
      "figure": "earthSeaEarthPhoto",
      "sharedFigure": null
    },
    "fields": {
      "criteria": [
        "질문의 조건에 맞는 자료와 설명이 연결되면 같은 뜻의 표현도 인정해요.",
        "구름에 가려진 표면은 다른 자료로 더 확인한다는 보기를 골라요."
      ]
    }
  },
  "c22-s32-u02-w035": {
    "unit": "c22-s32-u02",
    "previousStatus": null,
    "prompt": "다음 지구 사진 한 장만으로 육지와 바다의 넓이를 비교하기 어려운 까닭을 쓰세요. 더 알아볼 방법도 쓰세요.",
    "sourceId": "c22-s32-u02-b24",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 지구와 바다 창작 학습",
      "course": "초등3-2"
    },
    "presentation": {
      "form": "written",
      "key": null,
      "choices": null,
      "givens": null,
      "given": null,
      "table": null,
      "parts": null,
      "figure": "earthSeaEarthPhoto",
      "sharedFigure": null
    },
    "fields": {
      "criteria": [
        "자료와 근거를 연결한 타당한 설명",
        "사진에 지구의 일부만 보이거나 구름에 가린 곳이 있다는 까닭과, 지구 전체를 나타낸 자료로 비교할 방법을 함께 설명해요"
      ]
    }
  },
  "c22-s42-u01-w024": {
    "unit": "c22-s42-u01",
    "previousStatus": null,
    "prompt": "다음 모형 자료에서 음력 3일·7일·15일은 관찰 ㉠[ ]을 같게 했어요. 음력 22일·26일은 ㉡[ ] 자료로 나누어 비교해요.",
    "sourceId": null,
    "sourceRef": null,
    "presentation": {
      "form": "blank",
      "key": null,
      "choices": null,
      "givens": null,
      "given": [
        "수업용 모형 자료",
        "음력 3일·7일·15일: 저녁 7시쯤",
        "음력 22일·26일: 새벽 6시쯤"
      ],
      "table": null,
      "parts": null,
      "figure": null,
      "sharedFigure": null
    },
    "fields": {
      "criteria": [
        "자료의 조건과 근거를 연결한 같은 뜻의 답과 타당한 다른 설계를 인정해요. 문제 풀이와 실제 여러 날 관찰·모형 제작·발표는 구별해요.",
        "㉠에는 관찰한 시각, ㉡에는 새벽이라는 뜻의 말을 써요."
      ]
    }
  },
  "c22-s42-u02-w020": {
    "unit": "c22-s42-u02",
    "previousStatus": "authored",
    "prompt": "제공 사진에서 직접 확인할 수 있는 사실을 고르세요.",
    "sourceId": null,
    "sourceRef": {
      "type": "authored-workbook",
      "unit": "c22-s42-u02",
      "originalCounterpart": false
    },
    "presentation": {
      "form": "choice",
      "key": 0,
      "choices": [
        "나무와 물이 보인다",
        "사진 속 나무는 모두 같은 종류이다",
        "맑아 보이는 물에는 오염 물질이 없다",
        "사진에 안 보이는 동물은 이곳에 살지 않는다",
        "물 가까이 있는 생물은 모두 물속에서 산다"
      ],
      "givens": null,
      "given": null,
      "table": null,
      "parts": null,
      "figure": null,
      "sharedFigure": null
    },
    "fields": {
      "criteria": [
        "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
        "사진에 보이는 나무와 물을 관찰한 사실로 고른다."
      ]
    }
  },
  "c22-s42-u02-w040": {
    "unit": "c22-s42-u02",
    "previousStatus": "authored",
    "prompt": "모형 표의 두 조건을 비교한 설명 중 알맞은 것을 고르세요.",
    "sourceId": null,
    "sourceRef": {
      "type": "authored-workbook",
      "unit": "c22-s42-u02",
      "originalCounterpart": false
    },
    "presentation": {
      "form": "choice",
      "key": 0,
      "choices": [
        "여우가 없는 쪽은 토끼 수가 더 크고 풀 수는 더 작다",
        "여우가 없는 쪽은 풀과 토끼의 수가 모두 더 크다",
        "여우가 없는 쪽은 토끼 수가 더 작고 풀 수는 더 크다",
        "여우가 없는 쪽은 풀과 토끼의 수가 모두 더 작다",
        "여우가 없는 쪽은 풀 수만 작고 토끼 수는 같다"
      ],
      "givens": null,
      "given": null,
      "table": null,
      "parts": null,
      "figure": null,
      "sharedFigure": null
    },
    "fields": {
      "criteria": [
        "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
        "모형 표에서 여우가 없는 조건의 토끼 수는 더 크고 풀 수는 더 작다는 설명을 골라요."
      ]
    }
  },
  "c22-s42-u02-w041": {
    "unit": "c22-s42-u02",
    "previousStatus": "authored",
    "prompt": "그림의 먹이그물에서 개구리가 줄어들었어요. 뱀이 먹을 수 있는 다른 먹이로 이어지는 화살표를 고르세요.",
    "sourceId": null,
    "sourceRef": {
      "type": "authored-workbook",
      "unit": "c22-s42-u02",
      "originalCounterpart": false
    },
    "presentation": {
      "form": "choice",
      "key": 2,
      "choices": [
        "뱀 → 작은 새",
        "메뚜기 → 뱀",
        "작은 새 → 뱀",
        "풀 → 뱀",
        "개구리 → 작은 새"
      ],
      "givens": null,
      "given": null,
      "table": null,
      "parts": null,
      "figure": null,
      "sharedFigure": null
    },
    "fields": {
      "criteria": [
        "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
        "그림에 제시된 작은 새 → 뱀 화살표를 골라요."
      ]
    }
  },
  "c22-s42-u02-w042": {
    "unit": "c22-s42-u02",
    "previousStatus": "authored",
    "prompt": "자료에 나온 여섯 가지 먹이 관계를 보고, 알맞은 화살표를 모두 고르세요.",
    "sourceId": null,
    "sourceRef": {
      "type": "authored-workbook",
      "unit": "c22-s42-u02",
      "originalCounterpart": false
    },
    "presentation": {
      "form": "multi",
      "key": [
        0,
        2,
        4
      ],
      "choices": [
        "풀 → 메뚜기",
        "메뚜기 → 풀",
        "애벌레 → 작은 새",
        "뱀 → 개구리",
        "개구리 → 뱀"
      ],
      "givens": null,
      "given": null,
      "table": null,
      "parts": null,
      "figure": null,
      "sharedFigure": null
    },
    "fields": {
      "criteria": [
        "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
        "먹히는 쪽에서 먹는 쪽으로 이어진 풀 → 메뚜기, 애벌레 → 작은 새, 개구리 → 뱀의 세 보기를 모두 골라요."
      ]
    }
  },
  "c22-s42-u02-w067": {
    "unit": "c22-s42-u02",
    "previousStatus": "authored",
    "prompt": "사진에서 직접 볼 수 있는 모습을 설명한 문장을 고르세요.",
    "sourceId": null,
    "sourceRef": {
      "type": "authored-workbook",
      "unit": "c22-s42-u02",
      "originalCounterpart": false
    },
    "presentation": {
      "form": "choice",
      "key": 1,
      "choices": [
        "보이는 쓰레기가 이곳 오염의 유일한 원인이다",
        "물 위에 쓰레기가 보인다",
        "쓰레기 옆의 물은 성분 검사 없이도 안전하다",
        "사진에 안 보이는 물속에도 쓰레기가 전혀 없다",
        "쓰레기만 치우면 모든 생물이 바로 돌아온다"
      ],
      "givens": null,
      "given": null,
      "table": null,
      "parts": null,
      "figure": null,
      "sharedFigure": null
    },
    "fields": {
      "criteria": [
        "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
        "사진에서 물 위에 쓰레기가 보인다는 둘째 설명을 골라요."
      ]
    }
  },
  "c22-s32-u03-w057": {
    "unit": "c22-s32-u03",
    "previousStatus": null,
    "prompt": "표에서 자를 내민 길이와 소리의 높낮이는 같고, 세기만 다른 두 경우를 고르세요.",
    "sourceId": null,
    "sourceRef": null,
    "presentation": {
      "form": "choice",
      "key": 3,
      "choices": [
        "가와 다",
        "나와 다",
        "세 조건 모두",
        "가와 나",
        "비교할 수 있는 조건 없음"
      ],
      "givens": null,
      "given": null,
      "table": null,
      "parts": null,
      "figure": null,
      "sharedFigure": "applied-results"
    },
    "fields": {
      "criteria": [
        "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
        "내민 길이와 높낮이는 같고 세기만 다른 가와 나의 짝을 골라요."
      ]
    }
  },
  "c22-s32-u03-w058": {
    "unit": "c22-s32-u03",
    "previousStatus": null,
    "prompt": "표에서 자를 튕기는 정도는 같고, 길이에 따른 높낮이를 비교할 수 있는 두 경우를 고르세요.",
    "sourceId": null,
    "sourceRef": null,
    "presentation": {
      "form": "choice",
      "key": 0,
      "choices": [
        "가와 다",
        "가와 나",
        "나와 다",
        "세 조건 모두",
        "비교할 수 있는 조건 없음"
      ],
      "givens": null,
      "given": null,
      "table": null,
      "parts": null,
      "figure": null,
      "sharedFigure": "applied-results"
    },
    "fields": {
      "criteria": [
        "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
        "튕기는 정도는 같고 내민 길이가 다른 가와 다의 짝을 골라요."
      ]
    }
  },
  "s41-u03-w001": {
    "unit": "s41-u03",
    "previousStatus": null,
    "prompt": "다음은 흙 언덕에 물을 흘리기 전과 뒤를 나타낸 설명 그림이에요. 물이 흙을 옮겼다는 증거를 고르세요.",
    "sourceId": "s41-u03-v001",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 1
      }
    },
    "presentation": {
      "form": "choice",
      "key": 3,
      "choices": [
        "꼭대기의 색 모래가 처음 위치에만 남았다.",
        "색 모래의 색 이름을 처음과 다르게 적었다.",
        "물을 붓기 전에 아래쪽 모래를 따로 보탰다.",
        "처음 없던 색 모래가 아래 평평한 곳에 모였다.",
        "물을 흘리지 않은 그림만 나란히 놓았다."
      ],
      "givens": null,
      "given": null,
      "table": null,
      "parts": null,
      "figure": "groundRunoffComparison",
      "sharedFigure": null
    },
    "fields": {
      "criteria": [
        "제시한 자료와 조건의 범위에서 판단해요.",
        "전과 뒤의 그림에서 아래 평평한 곳에 색 모래가 새로 모인 모습을 골라요."
      ]
    }
  },
  "s41-u03-w009": {
    "unit": "s41-u03",
    "previousStatus": null,
    "prompt": "다음 두 설명 그림을 비교해 보세요. 물이 흙을 깎았다는 것을 알 수 있는 모습을 고르세요.",
    "sourceId": "s41-u03-b27",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "presentation": {
      "form": "choice",
      "key": 2,
      "choices": [
        "다른 장소에서 쓰던 흙을 그림 옆에 놓았다.",
        "물을 붓기 전 흙의 이름표를 다시 붙였다.",
        "처음 그림에는 없던 깊은 홈이 흙 표면에 생겼다.",
        "모형을 본 학생이 재미있었다고 말하였다.",
        "물길의 예상 그림에 깊은 홈을 그려 넣었다."
      ],
      "givens": null,
      "given": null,
      "table": null,
      "parts": null,
      "figure": "groundRunoffComparison",
      "sharedFigure": null
    },
    "fields": {
      "criteria": [
        "제시한 자료와 조건의 범위에서 판단해요.",
        "처음에는 없던 깊은 홈이 흙 표면에 생긴 모습을 골라요."
      ]
    }
  },
  "s41-u03-w010": {
    "unit": "s41-u03",
    "previousStatus": null,
    "prompt": "다음 강 사진 한 장만 보고 알기 어려운 것을 고르세요.",
    "sourceId": "s41-u03-b30",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "presentation": {
      "form": "choice",
      "key": 4,
      "choices": [
        "사진에서 물이 푸르게 보이는 부분",
        "물가에서 밝게 보이는 부분의 위치",
        "사진에 드러난 물길의 생김새",
        "사진 속 물가 주변에 나무가 있는지",
        "그 장소에서 한 해 동안 깎인 흙의 양"
      ],
      "givens": null,
      "given": null,
      "table": null,
      "parts": null,
      "figure": "groundRiverObservation",
      "sharedFigure": null
    },
    "fields": {
      "criteria": [
        "제시한 자료와 조건의 범위에서 판단해요.",
        "사진 한 장으로는 그 장소에서 한 해 동안 깎인 흙의 양을 알 수 없다는 보기를 골라요."
      ]
    }
  },
  "s41-u03-w024": {
    "unit": "s41-u03",
    "previousStatus": null,
    "prompt": "다음 두 화산 사진을 보고 바르게 설명한 것을 고르세요.",
    "sourceId": "s41-u03-v026",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 6
      }
    },
    "presentation": {
      "form": "choice",
      "key": 3,
      "choices": [
        "화산은 모두 같은 높이를 가져야 한다.",
        "화산은 모두 한 개의 뾰족한 봉우리다.",
        "화산은 모두 분화구에 물이 차 있다.",
        "화산의 모양은 서로 다를 수 있다.",
        "화산은 모두 지금 용암이 흐르고 있다."
      ],
      "givens": null,
      "given": null,
      "table": null,
      "parts": null,
      "figure": "groundVolcanoPhotos",
      "sharedFigure": null
    },
    "fields": {
      "criteria": [
        "제시한 자료와 조건의 범위에서 판단해요.",
        "두 사진을 보고 화산의 모양이 서로 다를 수 있다는 설명을 골라요."
      ]
    }
  },
  "s41-u03-w026": {
    "unit": "s41-u03",
    "previousStatus": null,
    "prompt": "다음 사진과 조사 자료를 함께 읽어 보세요. 모양이 다른 두 산을 모두 화산이라고 하는 까닭을 고르세요.",
    "sourceId": "s41-u03-v068",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 8
      }
    },
    "presentation": {
      "form": "choice",
      "key": 1,
      "choices": [
        "뾰족한 산은 모두 마그마 분출로 형성되기 때문이다.",
        "모양이 달라도 마그마 분출로 생긴 화산이기 때문이다.",
        "분화구에 물이 있는 산만 화산에 포함되기 때문이다.",
        "연기가 없는 산은 모두 물의 퇴적으로 형성되기 때문이다.",
        "높이가 같은 산들은 모두 같은 과정으로 생기기 때문이다."
      ],
      "givens": null,
      "given": [
        "킬라우에아산: 여러 차례 흘러나온 용암 등이 쌓여 만들어졌어요.",
        "베수비오산: 여러 차례 나온 용암과 화산재 등이 쌓여 만들어졌어요."
      ],
      "table": null,
      "parts": null,
      "figure": "groundVolcanoFormation",
      "sharedFigure": null
    },
    "fields": {
      "criteria": [
        "제시한 자료와 조건의 범위에서 판단해요.",
        "모양이 달라도 마그마 분출로 생긴 산이므로 두 산 모두 화산이라는 설명을 골라요."
      ]
    }
  },
  "s41-u04-w004": {
    "unit": "s41-u04",
    "previousStatus": null,
    "prompt": "다음 세균 확대 자료를 보고, 생김새를 바르게 정리한 문장을 고르세요.",
    "sourceId": "s41-u04-v006",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 6
      }
    },
    "presentation": {
      "form": "choice",
      "key": 4,
      "choices": [
        "한 장의 사진이 막대 모양이면 모든 세균도 막대다.",
        "붙어 있는 사진이 있으면 모든 세균은 항상 붙어 있다.",
        "꼬리가 안 보이는 사진이면 모든 세균은 꼬리가 없다.",
        "작은 사진이라도 잎과 뿌리를 찾아 분류해야 한다.",
        "종류에 따라 모양과 모여 있는 모습이 다르다."
      ],
      "givens": null,
      "given": null,
      "table": null,
      "parts": null,
      "figure": "biologyBacteria",
      "sharedFigure": null
    },
    "fields": {
      "criteria": [
        "제시한 자료와 조건의 범위에서 판단해요.",
        "확대 자료에 보이는 세균의 모양과 모여 있는 모습이 종류에 따라 다르다는 설명을 골라요."
      ]
    }
  },
  "s41-u04-w005": {
    "unit": "s41-u04",
    "previousStatus": null,
    "prompt": "다음 곰팡이 확대 사진을 보세요. 관찰한 모습을 바르게 적은 것을 고르세요.",
    "sourceId": "s41-u04-v011",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 1
      }
    },
    "presentation": {
      "form": "choice",
      "key": 0,
      "choices": [
        "가는 실 모양의 구조가 서로 얽혀 보인다.",
        "사진에 꽃과 씨가 보이지 않으니 생물이 아니다.",
        "실 모양이 보이므로 식물의 뿌리라고 기록한다.",
        "줄기와 잎으로 나누어 보인 부분의 이름을 적는다.",
        "직접 냄새를 맡아야 사진 속 형태를 알 수 있다."
      ],
      "givens": null,
      "given": null,
      "table": null,
      "parts": null,
      "figure": "biologyMoldHyphae",
      "sharedFigure": null
    },
    "fields": {
      "criteria": [
        "제시한 자료와 조건의 범위에서 판단해요.",
        "가는 실 모양의 구조가 서로 얽혀 보인다는 설명을 골라요."
      ]
    }
  },
  "s41-u04-w012": {
    "unit": "s41-u04",
    "previousStatus": null,
    "prompt": "다음은 빵·귤·쌀에 핀 곰팡이 사진이에요. 사진을 보고 관찰한 모습을 바르게 적은 것을 고르세요.",
    "sourceId": "s41-u04-v031",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 1
      }
    },
    "presentation": {
      "form": "choice",
      "key": 1,
      "choices": [
        "사진마다 색이 다르므로 곰팡이는 생물이 아니다.",
        "관찰한 사진들에서 곰팡이의 색이 다양했다.",
        "사진의 세 가지 색이면 모든 곰팡이 색을 다 안 것이다.",
        "초록색이 있는 부분은 반드시 식물의 잎이라고 정한다.",
        "흰 부분은 안전하므로 먹어도 된다고 전시문에 쓴다."
      ],
      "givens": null,
      "given": null,
      "table": null,
      "parts": null,
      "figure": "biologyMoldFoods",
      "sharedFigure": null
    },
    "fields": {
      "criteria": [
        "제시한 자료와 조건의 범위에서 판단해요.",
        "제공된 사진들에서 곰팡이의 색이 다양했다는 설명을 골라요."
      ]
    }
  },
  "s41-u04-w014": {
    "unit": "s41-u04",
    "previousStatus": null,
    "prompt": "다음 확대 자료에 보이는 생물은 종류에 따라 흙·물·몸속 등에 살아요. 어느 생물 무리인지 고르세요.",
    "sourceId": "s41-u04-v040",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 10
      }
    },
    "presentation": {
      "form": "choice",
      "key": 0,
      "choices": [
        "세균",
        "꽃이 피는 식물",
        "잎이 있는 검정말",
        "갓이 있는 버섯",
        "실 가닥 모양의 해캄"
      ],
      "givens": null,
      "given": null,
      "table": null,
      "parts": null,
      "figure": "biologyMicrobeShapes",
      "sharedFigure": null
    },
    "fields": {
      "criteria": [
        "제시한 자료와 조건의 범위에서 판단해요.",
        "확대 자료의 생김새와 제시된 사는 곳 설명을 함께 보고 세균을 골라요."
      ]
    }
  },
  "c22-s51-u01-w001": {
    "unit": "c22-s51-u01",
    "previousStatus": null,
    "prompt": "다음 지층 사진을 보세요. 직접 관찰하여 기록할 수 있는 특징을 고르세요.",
    "sourceId": "c22-s51-u01-b001",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 지층과 화석 창작 학습",
      "course": "초등5-1"
    },
    "presentation": {
      "form": "choice",
      "key": 3,
      "choices": [
        "사진에 보이지 않는 안쪽 전체",
        "층마다 생긴 정확한 연도",
        "모든 층이 쌓인 전체 기간",
        "층의 경계와 색·두께",
        "확대 비율을 모른 채 잰 실제 두께"
      ],
      "givens": null,
      "given": null,
      "table": null,
      "parts": null,
      "figure": "geoHorizontal",
      "sharedFigure": null
    },
    "fields": {
      "criteria": [
        "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
        "사진에 보이는 층의 경계와 색, 두께 차이를 관찰한 특징으로 골라요."
      ]
    }
  },
  "c22-s51-u01-w004": {
    "unit": "c22-s51-u01",
    "previousStatus": null,
    "prompt": "다음 지층 사진을 보세요. 관찰한 모습을 바르게 적은 문장을 고르세요.",
    "sourceId": "c22-s51-u01-b010",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 지층과 화석 창작 학습",
      "course": "초등5-1"
    },
    "presentation": {
      "form": "choice",
      "key": 0,
      "choices": [
        "보이는 층의 경계가 끊기고 어긋나 있다.",
        "끊어진 층이면 모든 암석이 같은 순간 생겼다.",
        "암석이 끊어졌으므로 층이 있던 적이 없다.",
        "사진 밖에서도 모두 같은 정도로 어긋났다.",
        "어긋난 거리로 생성 연도를 바로 계산한다."
      ],
      "givens": null,
      "given": null,
      "table": null,
      "parts": null,
      "figure": "geoBroken",
      "sharedFigure": null
    },
    "fields": {
      "criteria": [
        "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
        "사진에 보이는 층의 경계가 끊기고 어긋난 모습을 골라요."
      ]
    }
  }
};
const cache=new WeakMap();
const clone=value=>JSON.parse(JSON.stringify(value));
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function materialReadingQuestionReview(rows,unit){
 if(!MATERIAL_READING_BANK_UNITS.includes(unit)||!Array.isArray(rows))return rows;
 let changed=false;
 const next=rows.map(q=>{
  const p=patches[q.id];
  if(!p||p.unit!==unit||q.status!=='authored'||q.sourceContent||(q.contentVersion??null)!==p.previousVersion||q.prompt!==p.prompt||!Object.keys(p.presentation).every(k=>same(q[k]??null,p.presentation[k]))||!same(q.sourceRef,p.sourceRef)||!same(q.taxonomy,p.taxonomy)||!same(q.responseContract,p.responseContract)||!same(q.answerContract,p.previousAnswerContract)||!same(q.choices??null,p.previousChoices))return q;
  changed=true;
  if(cache.has(q))return cache.get(q);
  const current={...q,...clone(p.fields),...(q.diagnosticOverride?.version===(q.contentVersion||1)?{diagnosticOverride:{...clone(q.diagnosticOverride),version:MATERIAL_READING_VERSION}}:{}),contentVersion:MATERIAL_READING_VERSION,previousVersions:[...(q.previousVersions?clone(q.previousVersions):[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};
  cache.set(q,current);return current;
 });
 return changed?next:rows;
}
export function withMaterialReadingWorkbook(workbook){
 if(!MATERIAL_READING_UNITS.includes(workbook?.unit)||!Array.isArray(workbook.questions))return workbook;
 let changed=false;
 const questions=workbook.questions.map(q=>{
  const p=workbookPatches[q.id];
  if(!p||p.unit!==workbook.unit||q.contentVersion!=null||q.sourceContent||(q.status??null)!==p.previousStatus||q.prompt!==p.prompt||!same(q.sourceId??null,p.sourceId)||!same(q.sourceRef??null,p.sourceRef)||!Object.keys(p.presentation).every(k=>same(q[k]??null,p.presentation[k]))||!Object.entries(p.fields).every(([key,[previous]])=>same(q[key],previous)))return q;
  changed=true;return {...q,...Object.fromEntries(Object.entries(p.fields).map(([key,[,value]])=>[key,clone(value)]))};
 });
 return changed?{...workbook,questions}:workbook;
}
export function withMaterialReadingClassroom(unit,mod){
 if(!mod?.classroomItems)return mod;
 const classroomItems=materialReadingQuestionReview(mod.classroomItems,unit);
 return classroomItems===mod.classroomItems?mod:{...mod,classroomItems};
}
