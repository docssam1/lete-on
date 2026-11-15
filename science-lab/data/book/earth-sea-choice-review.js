export const EARTH_SEA_SAFETY_VERSION='20261115-earth-sea-safety-feedback';
export const earthSeaSafetyMisconceptions={
  "ES_TASTE": {
    "label": "실험에서 남은 물질은 맛보지 않아요",
    "element": "E3",
    "terms": [
      "맛보기"
    ],
    "fix": "소금처럼 보여도 실험에서 남은 물질은 먹거나 맛보지 않아요. 충분히 식힌 뒤 눈으로 관찰해요."
  },
  "ES_HEAT": {
    "label": "가열을 멈춰도 접시는 뜨거울 수 있어요",
    "element": "E3",
    "terms": [
      "가열",
      "식힘"
    ],
    "fix": "가열을 멈춰도 접시는 뜨거울 수 있어요. 맨손으로 만지지 않고 충분히 식힌 뒤 선생님의 안내에 따라 다루어요."
  },
  "ES_DISTANCE": {
    "label": "보호 안경과 관찰 거리를 함께 지켜요",
    "element": "E3",
    "terms": [
      "보호 안경",
      "관찰 거리"
    ],
    "fix": "보호 안경을 쓰고 선생님이 정한 거리에서 관찰해요. 장갑이나 보호 안경을 써도 뜨거운 접시 가까이에 얼굴을 대지 않아요."
  },
  "ES_EQUIPMENT": {
    "label": "가열 기구는 선생님이 다루어요",
    "element": "E3",
    "terms": [
      "가열 기구"
    ],
    "fix": "가열 기구는 선생님이 다루어요. 잘 보이지 않아도 직접 기구를 조절하지 말고 선생님께 알려요."
  }
};
export const EARTH_SEA_LINKED_REVIEW_VERSION='20261115-earth-sea-linked-choice-review';
export const EARTH_SEA_CHOICE_VERSION='20261115-earth-sea-choice-review';
export const EARTH_SEA_CHOICE_UNITS=['c22-s32-u02'];
// Revise only reviewed authored options and retain their complete saved presentation.
const patches={
  "c22-s32-u02-b04": {
    "unit": "c22-s32-u02",
    "previousVersion": null,
    "prompt": "육지와 바다 위 공기를 나타낸 설명 그림을 읽는 방법은 무엇인가요?",
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
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-01"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "previousChoices": [
      "파란색은 언제나 공기라고 정한다.",
      "그림의 테두리만 실제 두께라고 잰다.",
      "표시한 부분과 범례를 함께 읽는다.",
      "구름만 세어 모든 공기 양을 정한다.",
      "사진 한 장으로 공기의 끝을 확정한다."
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "표시한 부분과 범례를 함께 읽는다."
    },
    "fields": {
      "choices": [
        "육지 위에만 공기를 그린 것으로 읽는다.",
        "선의 굵기를 대기의 실제 두께로 잰다.",
        "표시한 부분과 범례를 함께 읽는다.",
        "구름이 없는 곳에는 공기도 없다고 읽는다.",
        "바다 위의 표시는 공기가 아니라고 정한다."
      ],
      "explanation": "설명 그림의 색과 선은 무엇을 나타내는지 범례와 함께 읽어요. 선의 굵기가 대기의 실제 두께를 뜻하는 것은 아니에요."
    }
  },
  "c22-s32-u02-b12": {
    "unit": "c22-s32-u02",
    "previousVersion": null,
    "prompt": "지구 사진의 흰 부분을 모두 육지로 정하기 전에 확인할 것은 무엇인가요?",
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
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-01"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "previousChoices": [
      "사진 제목의 글자 수",
      "구름·눈·얼음 표시",
      "사진을 연 사람의 이름",
      "종이를 자른 가위의 색",
      "웹 단추가 놓인 순서"
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "구름·눈·얼음의 표시와 설명"
    },
    "fields": {
      "choices": [
        "흰 부분을 모두 육지로 넣어 센 넓이",
        "구름·눈·얼음 표시",
        "바다 위에는 흰 구름이 없다고 정한 표시",
        "구름이 없는 곳은 모두 바다라고 정한 표시",
        "확대하면 구름 아래가 보인다는 설명"
      ],
      "explanation": "사진의 흰색은 구름이나 눈·얼음일 수 있어요. 범례와 설명을 확인하고, 구름에 가려 보이지 않는 표면을 모두 육지로 정하지 않아요."
    }
  },
  "c22-s32-u02-b19": {
    "unit": "c22-s32-u02",
    "previousVersion": null,
    "prompt": "지도에서 육지와 바다를 구별하려면 먼저 무엇을 읽을까요?",
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
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-01"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "previousChoices": [
      "종이의 가로 길이만",
      "사진을 붙인 풀의 이름",
      "읽은 사람의 키와 나이",
      "가방 속 물건의 개수",
      "색과 기호를 설명한 범례"
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "색과 기호를 설명한 범례"
    },
    "fields": {
      "choices": [
        "지도에서 가장 넓게 칠해진 색만",
        "색의 뜻을 확인하지 않고 짐작한 내용",
        "바다 위에는 구름이 없다고 정한 설명",
        "우리 동네와 같은 색이면 모두 육지라는 생각",
        "색과 기호를 설명한 범례"
      ],
      "explanation": "지도에서 같은 색이나 기호가 무엇을 나타내는지 범례를 읽어요. 색의 뜻을 확인하기 전에 육지나 바다로 정하지 않아요."
    }
  },
  "c22-s32-u02-b22": {
    "unit": "c22-s32-u02",
    "previousVersion": null,
    "prompt": "자료를 비교할 때 확인할 내용 두 가지를 고르세요. (정답 2개)",
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
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-01"
    },
    "responseContract": "multi-choice",
    "previousAnswerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        4
      ]
    },
    "previousChoices": [
      "지구 전체인지 일부인지",
      "친구 이름의 글자 수",
      "내가 좋아하는 색의 순위",
      "사진을 여는 단추의 모양",
      "색과 기호가 나타내는 뜻"
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "자료 범위와 범례를 확인해야 육지와 바다를 해석할 수 있어요."
    },
    "fields": {
      "prompt": "자료를 바르게 비교하는 방법 두 가지를 고르세요. (정답 2개)",
      "choices": [
        "지구 전체인지 일부인지 확인한다.",
        "크게 인쇄한 자료는 더 넓은 지역이라고 정한다.",
        "보이지 않는 부분은 모두 바다에 넣어 센다.",
        "파란 부분은 범례를 읽지 않고 모두 바다로 정한다.",
        "색과 기호가 나타내는 뜻을 확인한다."
      ],
      "explanation": "자료가 나타내는 범위와 색·기호의 뜻을 함께 확인해요. 종이를 크게 인쇄해도 담긴 지역이 넓어지는 것은 아니에요."
    }
  },
  "c22-s32-u02-b29": {
    "unit": "c22-s32-u02",
    "previousVersion": "20261105-material-earth-student-language",
    "prompt": "물의 종류과 가져온 곳을 함께 적어야 하는 까닭은 무엇인가요?",
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
      "element": "E3",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-02"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "previousChoices": [
      "어느 물이나 결과가 늘 같아서",
      "어떤 물을 비교했는지 확인하려고",
      "출처를 쓰면 가열이 끝나서",
      "모든 육지의 물이 같아져서",
      "이름이 길수록 소금이 많아서"
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "어떤 물을 비교했는지 확인하려고"
    },
    "fields": {
      "prompt": "물의 종류와 가져온 곳을 함께 적어야 하는 까닭은 무엇인가요?",
      "explanation": "바닷물인지 수돗물인지, 어디에서 가져왔는지 적으면 어떤 물을 비교했는지 다시 확인할 수 있어요."
    }
  },
  "c22-s32-u02-b44": {
    "unit": "c22-s32-u02",
    "previousVersion": null,
    "prompt": "바닷가 사진을 조사할 때 남길 내용은 무엇인가요?",
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
      "element": "E4",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-02"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "previousChoices": [
      "장소 없이 사진 크기만 적기",
      "장소·자료 출처와 보이는 특징",
      "관찰 없이 모든 곳이 같다고 쓰기",
      "사진을 본 것을 현장 방문이라 쓰기",
      "재료를 모르는데 모두 모래라 쓰기"
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "장소·자료 출처와 보이는 특징"
    },
    "fields": {
      "choices": [
        "모래처럼 보이면 장소를 확인하지 않고 모두 모래사장으로 적기",
        "장소·자료 출처와 보이는 특징",
        "가파른 바위 한 곳을 보고 모든 해안이 같다고 적기",
        "사진을 본 것을 현장 방문이라 쓰기",
        "물이 빠져 드러난 진흙을 언제나 마른 육지라고 적기"
      ],
      "explanation": "어느 바닷가의 자료인지 확인하고 사진에서 보이는 특징을 적어요. 사진을 살핀 것과 직접 방문한 것은 구별해요."
    }
  },
  "c22-s32-u02-b45": {
    "unit": "c22-s32-u02",
    "previousVersion": null,
    "prompt": "모든 바닷가가 같은 모습이라는 생각을 점검할 자료는 무엇인가요?",
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
      "element": "E4",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-02"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "previousChoices": [
      "같은 사진의 파일 이름 두 개",
      "사진 제목의 글자 수 비교",
      "서로 다른 지형의 여러 바닷가 사진",
      "한 장을 같은 크기로 두 번 복사",
      "사진을 연 단추의 색깔 비교"
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "서로 다른 지형의 여러 바닷가 사진"
    },
    "fields": {
      "choices": [
        "한 모래사장 사진을 모든 바닷가의 모습으로 정한 자료",
        "한 사진을 확대하고 줄여서 만든 자료",
        "서로 다른 지형의 여러 바닷가 사진",
        "같은 바닷가 사진 한 장을 두 번 복사한 자료",
        "같은 사진의 색만 바꾸어 놓은 자료"
      ],
      "explanation": "모래사장과 바위 절벽처럼 서로 다른 바닷가 사진을 살펴봐요. 한 사진의 크기나 색만 바꾸어도 다른 지형을 조사한 것이 되지는 않아요."
    }
  },
  "c22-s32-u02-b53": {
    "unit": "c22-s32-u02",
    "previousVersion": null,
    "prompt": "물 높이가 다른 사진 두 장을 비교할 때 확인할 것은 무엇인가요?",
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
      "element": "E5",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-03"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "previousChoices": [
      "사진을 연 기기의 이름만",
      "사진 제목의 글자 수만",
      "친구가 좋아하는 색만",
      "두 사진의 테두리 장식만",
      "장소·기준선·차례"
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "같은 장소·기준선·찍은 차례"
    },
    "fields": {
      "choices": [
        "서로 다른 장소라도 사진 속 물의 넓이만 맞춘다.",
        "기준선 없이 사진의 아래 테두리부터 높이를 잰다.",
        "확대한 정도가 달라도 사진 속 높이만 비교한다.",
        "물이 높은 사진을 촬영 때와 관계없이 나중에 놓는다.",
        "장소·기준선·차례"
      ],
      "explanation": "같은 바닷가와 같은 기준선인지 확인한 뒤 촬영 차례에 따라 물 높이를 비교해요. 사진의 크기나 아래 테두리만으로 실제 물 높이를 비교하지 않아요."
    }
  },
  "c22-s32-u02-b59": {
    "unit": "c22-s32-u02",
    "previousVersion": null,
    "prompt": "한 순간의 물결과 밀물·썰물을 구별하려면 어떤 자료가 알맞은가요?",
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
      "element": "E5",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-03"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "previousChoices": [
      "서로 다른 곳의 한 장씩만",
      "같은 곳의 시간에 따른 높이 기록",
      "같은 물결 사진을 여러 번 복사",
      "사진 제목의 길이 변화만",
      "찍은 순서가 없는 장식 그림"
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "같은 곳의 시간에 따른 높이 기록"
    },
    "fields": {
      "choices": [
        "서로 다른 두 바닷가에서 한 장씩 찍은 사진",
        "같은 곳의 시간에 따른 높이 기록",
        "한순간의 높은 물결을 찍은 사진 한 장",
        "서로 다른 해안의 높이 기록을 섞은 표",
        "촬영 차례와 기준선이 없는 여러 사진"
      ],
      "explanation": "같은 곳에서 같은 기준으로 시간에 따른 물 높이를 살펴봐요. 한순간의 물결 사진만으로 밀물과 썰물의 전체 변화를 알기는 어려워요."
    }
  },
  "c22-s32-u02-t04": {
    "unit": "c22-s32-u02",
    "previousVersion": null,
    "prompt": "바닷물이 바닷가로 밀려 들어와 물 높이가 높아지는 것을 ( ① ), 빠져나가 낮아지는 것을 ( ② )이라고 해요.",
    "sourceRef": {
      "type": "authored-lesson",
      "edition": "2022 개정 사고력 수업",
      "note": "사고력 수업(예상→모형→개념→적용)의 창작 문항. 모형 수치는 모형 값이며 실제 측정·학생 수행 기록이 아님."
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 3,
      "semester": 2,
      "unit": "u02",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T07",
      "standard": "4과06-03",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "밀물과 썰물의 높이 변화",
      "concept": "밀물과 썰물의 높이 변화",
      "inquirySkill": "밀물과 썰물의 높이 변화"
    },
    "responseContract": "cloze",
    "previousAnswerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "밀물",
          "accepted": [
            "밀물"
          ]
        },
        {
          "answer": "썰물",
          "accepted": [
            "썰물"
          ]
        }
      ]
    },
    "previousChoices": null,
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "밀물과 썰물은 하루에 두 번쯤 되풀이돼요. 한 순간 치는 파도와는 달라요."
    },
    "fields": {
      "explanation": "같은 바닷가에서도 시간이 지나면 물 높이가 달라져요. 밀물과 썰물은 한순간의 파도와 구별해요."
    }
  },
  "c22-s32-u02-b01": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": null,
    "prompt": "지구를 둘러싼 공기를 부르는 말은 무엇인가요?",
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
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-01"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "previousChoices": [
      "육지",
      "갯벌",
      "바다",
      "대기",
      "모래"
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "대기"
    },
    "fields": {
      "explanation": "지구를 둘러싼 공기를 대기라고 해요. 육지·바다는 지구 표면의 구분이고, 모래는 바닥에서 볼 수 있는 물질이에요. 주변 공기의 이름과 표면의 이름을 구별해요."
    }
  },
  "c22-s32-u02-b02": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": null,
    "prompt": "대기가 있는 곳을 바르게 설명한 것은 무엇인가요?",
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
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-01"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "previousChoices": [
      "육지 위에만 있고 바다 위에는 없다.",
      "바다 위에만 있고 육지 위에는 없다.",
      "보이는 구름 안에만 공기가 있다.",
      "육지 위와 바다 위를 둘러싼다.",
      "사람이 만든 방 안에만 공기가 있다."
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "육지 위와 바다 위를 둘러싼다."
    },
    "fields": {
      "explanation": "대기는 육지와 바다 위를 모두 둘러싸는 공기예요. 구름이 보이거나 바람이 부는 곳에만 있는 것이 아니에요. 구름·바람의 유무로 대기의 존재 범위를 정하지 않아요."
    }
  },
  "c22-s32-u02-b03": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": null,
    "prompt": "구름이 없는 맑은 날의 공기에 대한 설명은 무엇인가요?",
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
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-01"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "previousChoices": [
      "눈에 안 보이면 없는 것이다.",
      "푸른색으로 칠해야 생긴다.",
      "보이지 않아도 주위에 있다.",
      "바닷물이 없어지면 사라진다.",
      "바람이 멈추면 모두 사라진다."
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "보이지 않아도 주위에 있다."
    },
    "fields": {
      "choices": [
        "구름이 사라지면 주위 공기도 모두 없어진다.",
        "바람이 멈춘 곳에는 공기가 남아 있지 않다.",
        "보이지 않아도 주위에 있다.",
        "맑은 날에는 육지에만 공기가 남아 있다.",
        "공기는 구름이 보이는 곳에만 모여 있다."
      ],
      "explanation": "맑아서 구름이 보이지 않아도 주변에는 공기가 있어요. 공기의 움직임인 바람이나 구름이 보이지 않는다는 관찰을 공기가 없다는 결론으로 바꾸지 않아요."
    }
  },
  "c22-s32-u02-b09": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": null,
    "prompt": "육지와 바다를 구별한 설명은 무엇인가요?",
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
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-01"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "previousChoices": [
      "산은 바다이고 바닷물은 육지",
      "모든 푸른 부분은 육지의 숲",
      "구름은 바다이고 강물은 대기",
      "모래사장은 언제나 바다 한가운데",
      "육지에는 땅, 바다에는 바닷물"
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "땅이 드러난 육지와 바닷물이 덮인 바다"
    },
    "fields": {
      "choices": [
        "강과 호수는 물이 있으므로 모두 바다에 속한다.",
        "육지에는 강이나 호수처럼 물이 있는 곳은 없다.",
        "푸른색으로 보이는 곳은 물의 종류와 관계없이 바다이다.",
        "땅이 낮은 곳은 바닷물이 없어도 모두 바다로 구별한다.",
        "육지에는 땅, 바다에는 바닷물"
      ],
      "explanation": "산과 들은 육지에서 볼 수 있고 바다는 바닷물이 덮인 넓은 곳이에요. 육지에도 강·호수의 물이 있어요. 물이 있거나 푸른색으로 보인다는 한 특징만으로 모두 바다라고 정하지 않아요."
    }
  },
  "c22-s32-u02-b13": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": null,
    "prompt": "강과 호수의 물에 대한 설명으로 알맞은 것은 무엇인가요?",
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
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-01"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "previousChoices": [
      "육지에 있는 물로 구별한다.",
      "바다와 이름이 같은 물이다.",
      "땅 위에 있으니 물이 아니다.",
      "강이 길면 모두 바닷물이다.",
      "맑으면 대기라고 구별한다."
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "육지에 있는 물로 구별한다."
    },
    "fields": {
      "choices": [
        "육지에 있는 물로 구별한다.",
        "강과 호수는 물이 있으므로 모두 바다로 구별한다.",
        "강이 바다에 이어지면 강 전체를 바닷물로 구별한다.",
        "맑은 호수의 물은 녹은 물질이 없는 물로 단정한다.",
        "사진에서 푸른 물은 장소와 관계없이 바닷물로 정한다."
      ],
      "explanation": "강과 호수는 육지에 있는 물의 예예요. 물이 있거나 사진에서 푸르게 보인다는 이유로 바다라고 정하지 않아요. 맑은 모습만으로 녹아 있는 물질이 없는지도 확정할 수 없어요."
    }
  },
  "c22-s32-u02-b17": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": null,
    "prompt": "지구 전체의 육지와 바다 넓이를 비교할 때 알맞은 자료는 무엇인가요?",
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
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-01"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "previousChoices": [
      "지구 전체를 나타낸 자료",
      "우리 학교 운동장 사진",
      "집 안 방 하나의 사진",
      "바다 일부만 확대한 사진",
      "산 꼭대기 한 곳의 사진"
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "지구 전체를 나타낸 자료"
    },
    "fields": {
      "choices": [
        "지구 전체를 나타낸 자료",
        "우리 동네 전체의 육지와 물이 보이는 자료",
        "한쪽 반구만 보이는 지구 사진을 확대한 자료",
        "큰 바다 한 곳의 물만 빠짐없이 담은 자료",
        "육지 부분만 모아서 여러 장으로 만든 자료"
      ],
      "explanation": "질문은 지구 전체의 육지와 바다 넓이를 묻고 있어요. 동네·한쪽 반구·특정 바다·육지만 모은 자료는 필요한 전체 범위를 채우지 못해요. 전체 표면을 같은 기준으로 다룬 자료를 골라요."
    }
  },
  "c22-s32-u02-b18": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": "20261108-earth-sea-elementary",
    "prompt": "가에는 한 지역의 사진, 나에는 지구 전체의 자료가 있어요. 두 자료를 바르게 설명한 것을 고르세요.",
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
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-01"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "previousChoices": [
      "가에서 땅이 많으니 지구도 같다.",
      "지구 전체 비교에는 나를 쓴다.",
      "나의 바다는 육지와 같은 뜻이다.",
      "가와 나는 같은 범위의 자료다.",
      "사진 크기만으로 면적을 정한다."
    ],
    "presentation": {
      "givens": {
        "표": {
          "머리": [
            "자료 범위",
            "육지와 바다의 모습"
          ],
          "행": [
            [
              "가 지역 사진",
              "대부분 땅이 보임"
            ],
            [
              "나 지구 전체 자료",
              "바다 부분이 더 넓음"
            ]
          ]
        },
        "안내": "문제 해석을 위한 가상 관찰 기록이며 직접 관찰한 결과가 아니에요."
      },
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "지구 전체 비교에는 나를 쓴다."
    },
    "fields": {
      "choices": [
        "가에 땅이 많으므로 지구 전체도 육지가 더 넓다.",
        "지구 전체 비교에는 나를 쓴다.",
        "가 사진을 크게 인쇄하면 나와 같은 조사 범위가 된다.",
        "나의 바다를 셀 때에는 구름을 모두 바다에 더한다.",
        "가와 나의 종이 크기가 같으면 나타내는 범위도 같다."
      ],
      "explanation": "표에서 가는 한 지역, 나는 지구 전체를 다룬 자료예요. 전체 비교라는 질문에는 나의 범위가 맞아요. 사진 크기나 인쇄 크기가 같아도 조사 범위가 같아지는 것은 아니에요."
    }
  },
  "c22-s32-u02-b20": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": "20261115-earth-surface-photo",
    "prompt": "다음 지구 사진에는 구름에 가린 곳이 있어요. 가려진 곳을 더 알아보는 방법을 고르세요.",
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
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-01"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "previousChoices": [
      "흰 곳은 모두 육지라고 정해 놓는다.",
      "안 보이는 곳에는 표면이 없다고 한다.",
      "구름의 넓이를 바다 넓이라고 바꾼다.",
      "한쪽 반구로 지구 전체를 확정한다.",
      "가려진 곳은 다른 자료로 더 확인한다."
    ],
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
      "bookResponseForm": null,
      "explanation": "구름에 가려 안 보이는 곳은 아직 표면을 확인하지 못한 부분이에요. 육지나 바다로 임의로 넣지 않고 다른 사진·지도 등으로 확인해요. 확대와 복사만으로 가려진 정보가 생기지는 않아요."
    },
    "fields": {
      "choices": [
        "구름에 가린 곳은 모두 육지에 넣어 넓이를 센다.",
        "구름에 가린 곳은 모두 바다에 넣어 넓이를 센다.",
        "보이는 표면에서 구한 관계가 뒤쪽에도 같다고 정한다.",
        "같은 사진을 확대하면 구름 아래 표면도 확인된다고 한다.",
        "가려진 곳은 다른 자료로 더 확인한다."
      ]
    }
  },
  "c22-s32-u02-b21": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": null,
    "prompt": "지구본을 한 방향에서만 본 뒤 넓이를 정하기 어려운 까닭은 무엇인가요?",
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
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-01"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "previousChoices": [
      "눈앞의 색이 모두 없어져서",
      "지구본에는 바다가 없어서",
      "육지가 공기로 바뀌어서",
      "뒤쪽 표면까지 함께 살펴야 해서",
      "지구본을 보면 물이 사라져서"
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "뒤쪽 표면까지 함께 살펴야 해서"
    },
    "fields": {
      "choices": [
        "눈앞에 보이는 쪽의 육지와 바다가 전체와 항상 같아서",
        "지구본을 크게 볼수록 실제 바다 넓이도 달라져서",
        "한쪽에 물이 많이 보이면 반대쪽은 모두 육지여서",
        "뒤쪽 표면까지 함께 살펴야 해서",
        "한 방향의 사진에 보이는 구름을 바다로 세어야 해서"
      ],
      "explanation": "한 방향에서 보는 지구본에는 뒤쪽 표면이 보이지 않아요. 보이는 쪽이 전체와 같은 구성이라고 단정할 수 없으므로 여러 방향을 보거나 전체 범위를 비교한 자료를 확인해요."
    }
  },
  "c22-s32-u02-b26": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": "20261108-earth-sea-elementary",
    "prompt": "연습용 관찰 표를 읽고 알 수 있는 내용을 고르세요.",
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
      "element": "E3",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-02"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "previousChoices": [
      "모든 바다가 같은 양을 남긴다.",
      "가에 흰 물질이 남았다.",
      "나에는 아무 물질도 없다.",
      "흰 물질은 언제나 한 종류다.",
      "내가 실제로 물을 가열했다."
    ],
    "presentation": {
      "givens": {
        "표": {
          "머리": [
            "같은 양을 담은 물",
            "가열 뒤 관찰한 내용"
          ],
          "행": [
            [
              "가 바닷물",
              "물의 양이 줄고 흰 물질이 남음"
            ],
            [
              "나 수돗물",
              "눈에 띄는 남은 물질이 매우 적음"
            ]
          ]
        },
        "안내": "문제 해석을 위한 가상 관찰 기록이며 직접 관찰한 결과가 아니에요."
      },
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "가에 흰 물질이 남았다."
    },
    "fields": {
      "explanation": "표의 가에는 흰 물질이 남았다고 직접 적혀 있어요. 나의 결과가 적게 보인다는 것을 전혀 없음으로 바꾸지 않아요. 성분·다른 바다의 결과·내 실제 수행은 이 가상 표만으로 확인되지 않아요."
    }
  },
  "c22-s32-u02-b27": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": "20261108-earth-sea-elementary",
    "prompt": "물의 색깔만 보고 바닷물인지 알기 어려운 까닭을 고르세요.",
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
      "element": "E3",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-02"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "previousChoices": [
      "투명하면 모든 물이 바닷물이다.",
      "파란 사진이면 소금만 들어 있다.",
      "녹아 있는 물질은 잘 안 보일 수 있다.",
      "맑은 물에는 녹은 것이 절대 없다.",
      "물 이름은 색깔로만 정하기 때문이다."
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "녹아 있는 물질은 잘 안 보일 수 있다."
    },
    "fields": {
      "explanation": "소금 같은 물질이 녹아 있어도 물이 투명해 보일 수 있어요. 색이 비슷하다고 성분·양·가져온 곳이 같다고 확정할 수 없어요. 같은 조건의 물 비교와 출처 확인이 더 필요해요."
    }
  },
  "c22-s32-u02-b28": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": null,
    "prompt": "바닷물을 가열해 남긴 물질을 다루는 방법은 무엇인가요?",
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
      "element": "E3",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-02"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "previousChoices": [
      "짠지 확인하려고 직접 맛본다.",
      "뜨거운 접시를 맨손으로 잡는다.",
      "남은 가루를 바람에 세게 분다.",
      "집에서 혼자 불을 켜서 반복한다.",
      "먹거나 맛보지 않고 관찰한다."
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "먹거나 맛보지 않고 관찰한다."
    },
    "fields": {
      "choices": [
        "소금처럼 흰색이면 식기 전에 조금 맛을 보아도 된다.",
        "가열을 멈췄으면 접시를 바로 맨손으로 만져도 된다.",
        "장갑을 끼면 보호 안경 없이 가까이에서 보아도 된다.",
        "남은 것이 안 보이면 끓는 접시 위로 얼굴을 가까이 댄다.",
        "먹거나 맛보지 않고 관찰한다."
      ],
      "explanation": "남은 물질은 식힌 뒤 교사 안내에 따라 눈으로 관찰해요. 흰색이라고 먹어도 되는 것은 아니며 가열을 멈춰도 기구가 뜨거울 수 있어요. 보호 안경과 정해진 관찰 거리를 지켜요."
    }
  },
  "c22-s32-u02-b33": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": "20261108-earth-sea-elementary",
    "prompt": "두 종류의 물을 가열해 남는 물질을 비교하려고 해요. 무엇을 다르게 해야 할까요?",
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
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-02"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "previousChoices": [
      "처음 넣는 물의 양",
      "접시를 닦은 정도",
      "접시를 놓는 위치만",
      "비교할 물의 종류",
      "기록 날짜를 적는 방법"
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "비교할 물의 종류"
    },
    "fields": {
      "choices": [
        "처음 넣는 물의 양",
        "가열 뒤 남은 것을 관찰하는 방법",
        "접시의 크기·종류와 처음의 깨끗한 상태",
        "비교할 물의 종류",
        "교사가 가열하고 식힌 뒤 비교하는 방법"
      ],
      "explanation": "물 종류에 따른 차이를 알아보려면 바닷물과 육지의 물처럼 비교할 종류를 다르게 해요. 처음 양·접시 상태·가열과 관찰 방법은 비슷하게 맞춰 다른 조건의 영향이 섞이지 않게 해요."
    }
  },
  "c22-s32-u02-b34": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": "20261105-material-earth-student-language",
    "prompt": "두 물을 가열한 뒤 남은 물질을 비교하려면 무엇을 같게 해야 할까요?",
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
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-02"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "previousChoices": [
      "한쪽 물만 여러 배 넣기",
      "한쪽 접시만 소금 묻히기",
      "한쪽 결과를 예상으로 바꾸기",
      "처음 물의 양과 접시 조건",
      "한쪽 물의 출처만 숨기기"
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "처음 물의 양과 접시 조건"
    },
    "fields": {
      "choices": [
        "처음 물의 양과 물이 마른 뒤 남은 물질의 양",
        "서로 비교할 물의 종류와 처음 물의 양",
        "남은 물질의 색과 가열 뒤 남은 물질의 양",
        "처음 물의 양과 접시 조건",
        "물의 종류와 그 물에 녹아 있는 물질의 종류"
      ],
      "explanation": "처음 물의 양과 접시 상태 등 비교 조건을 맞춰요. 물의 종류는 다르게 할 조건이고 남은 물질의 색·양은 관찰할 결과예요. 결과까지 미리 같게 만드는 것이 조건을 맞춘 비교는 아니에요."
    }
  },
  "c22-s32-u02-b35": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": null,
    "prompt": "교사가 가열하는 모습을 관찰할 때 알맞은 행동은 무엇인가요?",
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
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-02"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "previousChoices": [
      "끓는 접시 위로 얼굴을 가까이 댄다.",
      "보호 안경을 쓰고 정한 거리에서 본다.",
      "다 쓰고 바로 뜨거운 접시를 잡는다.",
      "남은 물질을 손가락으로 찍어 먹는다.",
      "안 보이면 혼자 가열 기구를 조절한다."
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "보호 안경을 쓰고 정한 거리에서 본다."
    },
    "fields": {
      "choices": [
        "가열을 멈추면 바로 접시를 맨손으로 들어 옮긴다.",
        "보호 안경을 쓰고 정한 거리에서 본다.",
        "보호 안경을 썼으면 끓는 접시 위로 얼굴을 가까이 댄다.",
        "잘 안 보이면 교사에게 알리지 않고 가열 기구를 조절한다.",
        "남은 것이 소금처럼 보이면 손가락으로 찍어 맛본다."
      ],
      "explanation": "교사가 가열을 맡고 학생은 보호 안경과 정해진 거리를 지켜 관찰해요. 안 보이거나 조작이 필요하면 교사에게 알려요. 보호 안경이 뜨거운 기구를 만지거나 얼굴을 가까이 대도 된다는 뜻은 아니에요."
    }
  },
  "c22-s32-u02-b36": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": "20261105-material-earth-student-language",
    "prompt": "가열 전 접시를 확인하는 까닭으로 알맞은 것은 무엇인가요?",
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
      "element": "E3",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-02"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "previousChoices": [
      "깨끗한 접시에는 물을 담을 수 없다.",
      "원래 묻은 물질이 결과와 섞일 수 있다.",
      "접시 이름이 물의 종류를 결정한다.",
      "접시에 묻은 것은 항상 저절로 사라진다.",
      "접시가 같으면 물의 양은 상관없다."
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "원래 묻은 물질이 결과와 섞일 수 있다."
    },
    "fields": {
      "choices": [
        "접시가 같은 종류이면 묻은 것은 결과와 관계없다.",
        "원래 묻은 물질이 결과와 섞일 수 있다.",
        "묻은 물질은 가열하면 모두 저절로 없어진다.",
        "접시만 깨끗하면 처음 물의 양은 달라도 상관없다.",
        "접시의 색이 같으면 원래 묻은 물질도 같다고 볼 수 있다."
      ],
      "explanation": "접시에 원래 묻은 것이 있으면 물을 말린 뒤 남은 것과 섞일 수 있어요. 가열 전 깨끗한 상태를 확인하고 처음 양 등 다른 조건도 함께 맞춰야 물 종류에 따른 차이를 해석하기 쉬워요."
    }
  },
  "c22-s32-u02-b41": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": null,
    "prompt": "가 카드에 어울리는 바닷가 지형의 이름은 무엇인가요?",
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
      "element": "E4",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-02"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "previousChoices": [
      "절벽",
      "산꼭대기",
      "강의 계곡",
      "논밭",
      "모래사장"
    ],
    "presentation": {
      "givens": {
        "표": {
          "머리": [
            "사진 설명 카드",
            "눈으로 확인한 모습"
          ],
          "행": [
            [
              "가",
              "모래가 넓게 펼쳐진 바닷가"
            ],
            [
              "나",
              "높고 가파른 바위가 있는 바닷가"
            ],
            [
              "다",
              "물 빠진 때 넓게 드러난 진흙 바닥"
            ]
          ]
        },
        "안내": "문제 해석을 위한 가상 관찰 기록이며 직접 관찰한 결과가 아니에요."
      },
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "모래사장"
    },
    "fields": {
      "choices": [
        "바위 절벽",
        "자갈이 펼쳐진 해안",
        "바닷가 동굴",
        "갯벌",
        "모래사장"
      ],
      "explanation": "가 카드에는 모래가 넓게 펼쳐졌다고 적혀 있으므로 모래사장이에요. 가파른 바위·동굴 입구·자갈 바닥·물 빠진 진흙 바닥과 같은 다른 특징은 가에 제시되지 않았어요."
    }
  },
  "c22-s32-u02-b42": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": null,
    "prompt": "나 카드에서 조사한 바닷가 모습은 무엇인가요?",
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
      "element": "E4",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-02"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "previousChoices": [
      "잔잔한 호수",
      "넓은 모래 운동장",
      "가파른 바위 절벽",
      "눈 덮인 산꼭대기",
      "육지 안쪽 논밭"
    ],
    "presentation": {
      "givens": {
        "표": {
          "머리": [
            "사진 설명 카드",
            "눈으로 확인한 모습"
          ],
          "행": [
            [
              "가",
              "모래가 넓게 펼쳐진 바닷가"
            ],
            [
              "나",
              "높고 가파른 바위가 있는 바닷가"
            ],
            [
              "다",
              "물 빠진 때 넓게 드러난 진흙 바닥"
            ]
          ]
        },
        "안내": "문제 해석을 위한 가상 관찰 기록이며 직접 관찰한 결과가 아니에요."
      },
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "가파른 바위 절벽"
    },
    "fields": {
      "choices": [
        "물 빠진 때 드러나는 갯벌",
        "모래가 넓게 펼쳐진 모래사장",
        "가파른 바위 절벽",
        "바위 아래 동굴 입구가 보이는 해안",
        "자갈이 넓게 펼쳐진 해안"
      ],
      "explanation": "나 카드의 근거는 높고 가파른 바위예요. 이 특징은 바위 절벽에 맞아요. 모래·자갈·갯벌·동굴의 특징을 대신 읽지 않고 카드에 직접 제시한 내용을 연결해요."
    }
  },
  "c22-s32-u02-b43": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": null,
    "prompt": "다 카드에 어울리는 이름은 무엇인가요?",
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
      "element": "E4",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-02"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "previousChoices": [
      "갯벌",
      "바다 위의 구름",
      "높은 산의 계곡",
      "깊은 호수 바닥",
      "도시의 운동장"
    ],
    "presentation": {
      "givens": {
        "표": {
          "머리": [
            "사진 설명 카드",
            "눈으로 확인한 모습"
          ],
          "행": [
            [
              "가",
              "모래가 넓게 펼쳐진 바닷가"
            ],
            [
              "나",
              "높고 가파른 바위가 있는 바닷가"
            ],
            [
              "다",
              "물 빠진 때 넓게 드러난 진흙 바닥"
            ]
          ]
        },
        "안내": "문제 해석을 위한 가상 관찰 기록이며 직접 관찰한 결과가 아니에요."
      },
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "갯벌"
    },
    "fields": {
      "choices": [
        "갯벌",
        "모래가 넓게 펼쳐진 모래사장",
        "높고 가파른 바위 절벽",
        "바위 아래 입구가 있는 바닷가 동굴",
        "자갈이 넓게 펼쳐진 해안"
      ],
      "explanation": "다에는 물이 빠진 때 넓게 드러난 진흙 바닥이 제시되어 갯벌과 연결해요. 다른 해안도 있을 수 있지만 다의 관찰 특징을 모래·자갈·절벽·동굴로 바꾸어 읽지는 않아요."
    }
  },
  "c22-s32-u02-b49": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": null,
    "prompt": "같은 바닷가로 바닷물이 들어오며 높아지는 현상은 무엇인가요?",
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
      "element": "E5",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-03"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "previousChoices": [
      "썰물",
      "강수",
      "얼음",
      "안개",
      "밀물"
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "밀물"
    },
    "fields": {
      "choices": [
        "바닷물이 들어와 높아지지만 썰물이라고 부른다.",
        "바닷물이 빠져나가며 낮아지는 것을 밀물로 부른다.",
        "한 번 높은 물결이 지나간 것을 하루의 밀물로 정한다.",
        "같은 해안의 물 높이가 달라져도 언제나 파도만 뜻한다.",
        "바닷물이 들어오며 물 높이가 높아지는 밀물이다."
      ],
      "explanation": "같은 바닷가로 바닷물이 들어오며 물 높이가 높아지는 변화는 밀물이에요. 빠져나가며 낮아지는 썰물과 구별해요. 순간적인 물결 한 번을 시간에 따른 전체 변화로 대신하지 않아요."
    }
  },
  "c22-s32-u02-b50": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": null,
    "prompt": "바닷물이 빠져나가며 높이가 낮아지는 현상은 무엇인가요?",
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
      "element": "E5",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-03"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "previousChoices": [
      "밀물",
      "눈",
      "썰물",
      "구름",
      "대기"
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "썰물"
    },
    "fields": {
      "choices": [
        "바닷물이 빠져나가 낮아져도 밀물이라고 부른다.",
        "바닷물이 들어오며 높아지는 것을 썰물로 부른다.",
        "바닷물이 빠져나가며 물 높이가 낮아지는 썰물이다.",
        "한 번 물결이 낮아진 순간으로 썰물이 끝났다고 정한다.",
        "드러난 바닥이 늘어나면 바다의 모든 물이 없어진 것이다."
      ],
      "explanation": "바닷물이 빠져나가며 같은 해안의 물 높이가 낮아지는 변화는 썰물이에요. 밀물의 방향과 바꾸어 읽지 않아요. 갯벌이 더 드러나도 바다의 모든 물이 사라진 것은 아니에요."
    }
  },
  "c22-s32-u02-b57": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": null,
    "prompt": "10시부터 12시까지 표가 나타내는 변화는 무엇인가요?",
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
      "element": "E5",
      "type": "T08",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-03"
    },
    "responseContract": "single-choice",
    "previousAnswerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "previousChoices": [
      "썰물 동안의 높이 변화",
      "밀물 동안의 높이 변화",
      "지구 전체 바다의 소멸",
      "모든 바닷가의 같은 높이",
      "세 시각 모두 같은 물 높이"
    ],
    "presentation": {
      "givens": {
        "표": {
          "머리": [
            "같은 장소의 시각",
            "바닷물 높이"
          ],
          "행": [
            [
              "10:00",
              "높음"
            ],
            [
              "11:00",
              "조금 낮음"
            ],
            [
              "12:00",
              "더 낮음"
            ]
          ]
        },
        "안내": "문제 해석을 위한 가상 관찰 기록이며 직접 관찰한 결과가 아니에요."
      },
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "썰물 동안의 높이 변화"
    },
    "fields": {
      "choices": [
        "썰물 동안의 높이 변화",
        "밀물 동안의 물 높이 변화이다.",
        "10~11시는 높아지고 11~12시는 낮아지는 변화이다.",
        "세 시각의 물 높이가 같게 유지된 기록이다.",
        "한 시각의 높이만 적혀 있어 변화 방향을 읽을 수 없다."
      ],
      "explanation": "같은 장소의 표에서10시 높음→11시 조금 낮음→12시 더 낮음으로 이어져요. 이 시간에 낮아진 물 높이는 썰물 동안의 변화와 연결해요. 높아짐·같게 유지됨과 바꾸어 읽지 않아요."
    }
  },
  "c22-s32-u02-b06": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": null,
    "prompt": "대기에 대한 알맞은 설명 두 가지를 고르세요. (정답 2개)",
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
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-01"
    },
    "responseContract": "multi-choice",
    "previousAnswerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        4
      ]
    },
    "previousChoices": [
      "육지 안쪽에만 공기가 있다.",
      "바다 위에도 공기가 있다.",
      "구름 없는 곳에는 공기가 없다.",
      "바닷물과 같은 물질의 이름이다.",
      "지구 주위를 둘러싼 공기다."
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "대기는 지구를 둘러싼 공기이며 육지와 바다 위에 있어요."
    },
    "fields": {
      "explanation": "대기는 지구 주위를 둘러싼 공기이며 바다 위에도 있어요. 바람이 멈추거나 구름이 없어도 공기는 있어요. 공기와 바닷물은 서로 다른 물질이에요."
    }
  },
  "c22-s32-u02-b54": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": null,
    "prompt": "밀물과 썰물을 구별한 설명 두 가지를 고르세요. (정답 2개)",
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
      "element": "E5",
      "type": "T07",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-03"
    },
    "responseContract": "multi-choice",
    "previousAnswerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        2
      ]
    },
    "previousChoices": [
      "서로 다른 바닷가 한 장씩만으로 차례를 확정한다.",
      "썰물에는 바닷물이 빠져나가며 낮아진다.",
      "밀물에는 바닷물이 들어오며 높아진다.",
      "썰물이 끝나면 바다의 물이 모두 없어진다.",
      "밀물과 썰물은 파도 한 번씩의 이름이다."
    ],
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "같은 장소에서 시간에 따른 바닷물 높이의 변화를 구별해요."
    },
    "fields": {
      "choices": [
        "다른 두 해안의 높이 차이만으로 밀물 차례를 정한다.",
        "썰물에는 바닷물이 빠져나가며 낮아진다.",
        "밀물에는 바닷물이 들어오며 높아진다.",
        "갯벌이 드러나면 그 바닥은 다음 밀물에도 계속 드러난다.",
        "한 번의 물결이 높아진 순간을 밀물 전체로 판단한다."
      ],
      "explanation": "같은 바닷가의 시간에 따른 높이와 물이 들어오고 나가는 방향을 함께 읽어요. 서로 다른 해안을 한때 비교하거나 물결 한 번만 본 것으로 밀물·썰물의 전체 변화를 정하지 않아요."
    }
  },
  "c22-s32-u02-b70": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": "20261108-earth-sea-elementary",
    "prompt": "기록을 읽고 알 수 있는 설명 두 가지를 고르세요. (정답 2개)",
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
      "element": "E6",
      "type": "T09",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-03"
    },
    "responseContract": "multi-choice",
    "previousAnswerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        2
      ]
    },
    "previousChoices": [
      "게와 조개가 살아가는 곳이다.",
      "모든 갯벌의 생물 수가 같다.",
      "물새가 먹이를 찾는 곳이다.",
      "지구의 모든 새가 이곳에만 산다.",
      "사람이 아무렇게나 훼손해도 괜찮다."
    ],
    "presentation": {
      "givens": {
        "조사 자료": "한 갯벌에서 게와 조개가 사는 모습, 먹이를 찾는 물새를 관찰한 기록이 있어요. 자료 해석용 설명이며 내 현장 방문 기록은 아니에요."
      },
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "자료에서 확인한 생물의 생활 근거로 가치를 설명해요."
    },
    "fields": {
      "choices": [
        "게와 조개가 살아가는 곳이다.",
        "관찰한 물새가 모두 알을 낳는 장소이다.",
        "물새가 먹이를 찾는 곳이다.",
        "다른 모든 갯벌도 같은 종류·수의 생물이 산다.",
        "그곳은 사람의 모든 오염을 완전히 없앤다."
      ],
      "explanation": "자료에 있는 게·조개의 생활과 물새의 먹이 찾기는 각각 삶터와 먹이 활동 장소의 근거예요. 물새의 번식이나 다른 갯벌의 생물 수, 모든 오염 제거 능력은 제시하지 않았어요."
    }
  },
  "c22-s32-u02-b07": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": null,
    "prompt": "지구를 둘러싼 공기의 이름을 쓰세요.",
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
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-01"
    },
    "responseContract": "short-text",
    "previousAnswerContract": {
      "type": "short-text",
      "answer": "대기",
      "accepted": [
        "대기"
      ]
    },
    "previousChoices": null,
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "자료의 표현과 관찰 범위를 확인해요."
    },
    "fields": {
      "explanation": "‘지구를 둘러싼 공기’라는 뜻에 맞는 이름은 대기예요. 구름은 공기 전체의 이름이 아니고, 바람은 공기의 움직임을 나타내는 말이에요."
    }
  },
  "c22-s32-u02-b15": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": null,
    "prompt": "지구 표면에서 육지보다 넓은 쪽을 골라 쓰세요.",
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
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-01"
    },
    "responseContract": "short-text",
    "previousAnswerContract": {
      "type": "short-text",
      "answer": "바다",
      "accepted": [
        "바다"
      ]
    },
    "previousChoices": null,
    "presentation": {
      "givens": {
        "보기": [
          "육지",
          "바다"
        ]
      },
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "자료의 표현과 관찰 범위를 확인해요."
    },
    "fields": {
      "explanation": "보기의 육지와 바다를 지구 전체 범위에서 비교하면 바다가 더 넓어요. 집 주변이나 한 지역의 사진에서 보이는 땅의 넓이로 지구 전체를 대신하지 않아요."
    }
  },
  "c22-s32-u02-b31": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": "20261108-earth-sea-elementary",
    "prompt": "바닷물을 가열했더니 물이 줄어들고 흰 물질이 남았어요. 바닷물에 무엇이 녹아 있었을까요?",
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
      "element": "E3",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-02"
    },
    "responseContract": "short-text",
    "previousAnswerContract": {
      "type": "short-text",
      "answer": "소금",
      "accepted": [
        "소금",
        "소금 등 여러 물질",
        "소금과 여러 물질"
      ]
    },
    "previousChoices": null,
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "자료의 표현과 관찰 범위를 확인해요."
    },
    "fields": {
      "explanation": "바닷물에는 소금 등 여러 물질이 녹아 있어요. 물이 줄어든 뒤 흰 물질이 남는 것을 녹아 있던 물질과 연결해 설명해요. 이 문항은 소금이라는 대표 예를 묻는 것이며 색만으로 순수한 한 성분을 확인했다는 뜻은 아니에요."
    }
  },
  "c22-s32-u02-b55": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": null,
    "prompt": "같은 바닷가의 물 높이가 낮아지는 때를 [밀물 / 썰물] 중 골라 쓰세요.",
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
      "element": "E5",
      "type": "T07",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-03"
    },
    "responseContract": "short-text",
    "previousAnswerContract": {
      "type": "short-text",
      "answer": "썰물",
      "accepted": [
        "썰물"
      ]
    },
    "previousChoices": null,
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "자료의 표현과 관찰 범위를 확인해요."
    },
    "fields": {
      "explanation": "같은 바닷가에서 바닷물이 빠져나가며 물 높이가 낮아지는 때는 썰물이에요. 바닷물이 들어와 높아지는 밀물과 방향을 구별해 보기에서 골라요."
    }
  },
  "c22-s32-u02-b08": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": null,
    "prompt": "친구가 바다 위에는 대기가 없다고 했어요. 지구 주위 공기를 생각하며 설명해 보세요.",
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
      "element": "E1",
      "type": "T01",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-01"
    },
    "responseContract": "written-explanation",
    "previousAnswerContract": {
      "type": "written-explanation",
      "sample": "대기는 지구를 둘러싼 공기이므로 바다 위에도 있어요.",
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
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "예시와 낱말이 달라도 타당한 근거와 설명은 선생님이 확인해요."
    },
    "fields": {
      "explanation": "친구의 주장은 대기를 육지 위로만 한정했어요. 대기는 지구 주위의 공기이므로 바다 위에도 있다는 설명으로 고쳐요. 공기가 눈에 잘 보이지 않는 것과 없는 것은 구별해요."
    }
  },
  "c22-s32-u02-b16": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": null,
    "prompt": "내가 사는 동네에는 땅이 많이 보여요. 이것만으로 지구 전체에서 육지가 더 넓다고 할 수 없는 까닭을 설명해 보세요.",
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
      "element": "E1",
      "type": "T02",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-01"
    },
    "responseContract": "written-explanation",
    "previousAnswerContract": {
      "type": "written-explanation",
      "sample": "한 동네는 지구의 일부이므로 지구 전체의 육지와 바다 자료를 함께 비교해야 해요.",
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
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "예시와 낱말이 달라도 타당한 근거와 설명은 선생님이 확인해요."
    },
    "fields": {
      "explanation": "동네는 지구 전체 중 일부예요. 동네에 땅이 많이 보인다는 관찰만으로 지구 전체의 육지가 더 넓다고 할 수 없어요. 뒤쪽까지 포함한 전 지구 육지·바다 자료가 더 필요해요."
    }
  },
  "c22-s32-u02-b32": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": "20261108-earth-sea-elementary",
    "prompt": "바닷물을 가열했더니 흰 물질이 남았어요. 이 결과만 보고 ‘모든 육지의 물에는 녹아 있는 물질이 없다’고 말할 수 있을까요? 까닭을 설명해 보세요.",
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
      "element": "E3",
      "type": "T04",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-02"
    },
    "responseContract": "written-explanation",
    "previousAnswerContract": {
      "type": "written-explanation",
      "sample": "이 바닷물에는 녹아 있던 물질이 남은 것이에요. 비교한 육지의 물 결과가 적어 보여도 모든 육지의 물에 아무 물질도 없다고 말할 수는 없어요.",
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
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "예시와 낱말이 달라도 타당한 근거와 설명은 선생님이 확인해요."
    },
    "fields": {
      "explanation": "가열 뒤 남은 것은 해당 바닷물에 녹아 있던 물질과 연결해요. 비교한 육지의 물에서 적게 보이더라도 눈에 보이는 정도와 성분이 전혀 없다는 주장은 달라요. 모든 지역의 물로 결론을 넓히지 않아요."
    }
  },
  "c22-s32-u02-b40": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": null,
    "prompt": "한쪽에는 바닷물을 조금, 다른 쪽에는 수돗물을 훨씬 많이 넣었어요. 남은 물질을 비교하기 전에 어떻게 고치면 좋을까요?",
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
      "element": "E3",
      "type": "T05",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-02"
    },
    "responseContract": "written-explanation",
    "previousAnswerContract": {
      "type": "written-explanation",
      "sample": "처음 물의 양을 같게 맞추고 깨끗한 같은 조건의 접시에서 선생님과 비교해요.",
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
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "예시와 낱말이 달라도 타당한 근거와 설명은 선생님이 확인해요."
    },
    "fields": {
      "explanation": "물의 종류와 처음 양이 함께 달라지면 남은 차이가 어느 조건 때문인지 나누기 어려워요. 처음 양·깨끗한 같은 종류의 접시·방법을 맞춘 뒤 교사와 비교하도록 계획을 고쳐요. 아직 하지 않은 결과는 만들어 적지 않아요."
    }
  },
  "c22-s32-u02-b48": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": "20261108-earth-sea-elementary",
    "prompt": "가와 나 사진 카드에서 바닷가의 모습이 어떻게 다른지 설명하세요. 사진에서 보이는 특징을 써 보세요.",
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
      "element": "E4",
      "type": "T06",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-02"
    },
    "responseContract": "written-explanation",
    "previousAnswerContract": {
      "type": "written-explanation",
      "sample": "가는 모래가 넓게 펼쳐져 있고, 나는 높고 가파른 바위가 보여요.",
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
      "givens": {
        "표": {
          "머리": [
            "사진 설명 카드",
            "눈으로 확인한 모습"
          ],
          "행": [
            [
              "가",
              "모래가 넓게 펼쳐진 바닷가"
            ],
            [
              "나",
              "높고 가파른 바위가 있는 바닷가"
            ],
            [
              "다",
              "물 빠진 때 넓게 드러난 진흙 바닥"
            ]
          ]
        },
        "안내": "문제 해석을 위한 가상 관찰 기록이며 직접 관찰한 결과가 아니에요."
      },
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "예시와 낱말이 달라도 타당한 근거와 설명은 선생님이 확인해요."
    },
    "fields": {
      "explanation": "가의 근거는 넓게 펼쳐진 모래이고 나의 근거는 높고 가파른 바위예요. 이 두 특징을 함께 들어 차이를 비교해요. 제시하지 않은 실제 크기나 만들어진 과정까지 알아낸 것으로 쓰지는 않아요.",
      "prompt": "가와 나 설명 카드에서 바닷가의 모습이 어떻게 다른지 설명하세요. 카드에 적힌 특징을 써 보세요."
    }
  },
  "c22-s32-u02-b56": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": "20261108-earth-sea-elementary",
    "prompt": "같은 바닷가로 물이 들어와 물 높이가 높아지고 갯벌이 점점 잠겼어요. 어떤 변화인가요? 그렇게 생각한 까닭도 설명해 보세요.",
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
      "element": "E5",
      "type": "T07",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-03"
    },
    "responseContract": "written-explanation",
    "previousAnswerContract": {
      "type": "written-explanation",
      "sample": "밀물이에요. 바닷물이 들어와 높아져 드러났던 갯벌이 잠기기 때문이에요.",
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
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "예시와 낱말이 달라도 타당한 근거와 설명은 선생님이 확인해요."
    },
    "fields": {
      "explanation": "물이 들어와 높아지고 갯벌이 잠긴다는 관찰이 함께 제시되어 밀물과 연결해요. 이름만 쓰기보다 같은 장소의 높아진 물과 줄어든 드러난 바닥을 근거로 설명해요."
    }
  },
  "c22-s32-u02-b72": {
    "unit": "c22-s32-u02",
    "currentVersion": "20261115-earth-sea-linked-choice-review",
    "previousVersion": "20261108-earth-sea-elementary",
    "prompt": "기록에는 갯벌에 게와 조개가 살고 물새가 먹이를 찾는다고 쓰여 있어요. 이 내용을 넣어 갯벌을 지켜야 하는 까닭을 설명해 보세요.",
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
      "element": "E6",
      "type": "T09",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과06-03"
    },
    "responseContract": "written-explanation",
    "previousAnswerContract": {
      "type": "written-explanation",
      "sample": "여러 생물의 삶터이고 물새가 먹이를 찾는 곳이므로 훼손하지 않고 보전해야 해요.",
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
      "givens": {
        "조사 자료": "한 갯벌에서 게와 조개가 사는 모습, 먹이를 찾는 물새를 관찰한 기록이 있어요. 자료 해석용 설명이며 내 현장 방문 기록은 아니에요."
      },
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": null,
      "explanation": "예시와 낱말이 달라도 타당한 근거와 설명은 선생님이 확인해요."
    },
    "fields": {
      "explanation": "제시된 기록에서 게·조개는 생활하고 물새는 먹이를 찾아요. 이 두 근거를 삶터·먹이 활동 장소의 가치로 연결한 뒤, 그 생물과 바닥을 훼손하지 않아야 한다는 보전 이유를 설명해요."
    }
  }
};
const cache=new WeakMap();
const clone=value=>JSON.parse(JSON.stringify(value));
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function earthSeaChoiceReview(rows,unit){
 if(!EARTH_SEA_CHOICE_UNITS.includes(unit)||!Array.isArray(rows))return rows;
 let changed=false;
 const next=rows.map(q=>{
  const p=patches[q.id];
  if(!p||p.unit!==unit||q.status!=='authored'||q.sourceContent||(q.contentVersion??null)!==p.previousVersion||q.prompt!==p.prompt||!Object.keys(p.presentation).every(k=>same(q[k]??null,p.presentation[k]))||!same(q.sourceRef,p.sourceRef)||!same(q.taxonomy,p.taxonomy)||!same(q.responseContract,p.responseContract)||!same(q.answerContract,p.previousAnswerContract)||!same(q.choices??null,p.previousChoices))return q;
  changed=true;
  if(cache.has(q))return cache.get(q);
  const current={...q,...clone(p.fields),...(q.diagnosticOverride?.version===(q.contentVersion||1)?{diagnosticOverride:{...clone(q.diagnosticOverride),version:p.currentVersion||EARTH_SEA_CHOICE_VERSION}}:{}),contentVersion:p.currentVersion||EARTH_SEA_CHOICE_VERSION,previousVersions:[...(q.previousVersions?clone(q.previousVersions):[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};
  cache.set(q,current);return current;
 });
 return earthSeaSafetyReview(changed?next:rows,unit);
}
export function withEarthSeaChoiceClassroom(unit,mod){
 if(!mod?.classroomItems)return mod;
 const classroomItems=earthSeaChoiceReview(mod.classroomItems,unit);
 return classroomItems===mod.classroomItems?mod:{...mod,classroomItems};
}

const workbookPatches={
  "c22-s32-u02-w038": {
    "unit": "c22-s32-u02",
    "previousStatus": null,
    "prompt": "가와 나 사진 카드에서 바닷가의 모습이 어떻게 다른지 설명하세요. 사진에서 보이는 특징을 써 보세요.",
    "sourceId": "c22-s32-u02-b48",
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
      "figure": "given-c22-s32-u02-b48",
      "sharedFigure": null,
      "answer": "가는 모래가 넓게 펼쳐져 있고, 나는 높고 가파른 바위가 보여요.",
      "explanation": "가의 근거는 넓게 펼쳐진 모래이고 나의 근거는 높고 가파른 바위예요. 이 두 특징을 함께 들어 차이를 비교해요. 제시하지 않은 실제 크기나 만들어진 과정까지 알아낸 것으로 쓰지는 않아요.",
      "criteria": "자료와 근거를 연결한 타당한 설명",
      "responseContract": null,
      "sourceGivens": {
        "표": {
          "머리": [
            "사진 설명 카드",
            "눈으로 확인한 모습"
          ],
          "행": [
            [
              "가",
              "모래가 넓게 펼쳐진 바닷가"
            ],
            [
              "나",
              "높고 가파른 바위가 있는 바닷가"
            ],
            [
              "다",
              "물 빠진 때 넓게 드러난 진흙 바닥"
            ]
          ]
        },
        "안내": "문제 해석을 위한 가상 관찰 기록이며 직접 관찰한 결과가 아니에요."
      },
      "sourceContract": {
        "type": "written-explanation",
        "sample": "가는 모래가 넓게 펼쳐져 있고, 나는 높고 가파른 바위가 보여요.",
        "rubric": {
          "required": [
            "자료와 근거를 연결한 타당한 설명"
          ],
          "criteria": [
            "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
          ],
          "pass": "자료와 근거를 연결한 타당한 설명을 선생님과 확인한다."
        }
      }
    },
    "fields": {
      "prompt": [
        "가와 나 사진 카드에서 바닷가의 모습이 어떻게 다른지 설명하세요. 사진에서 보이는 특징을 써 보세요.",
        "가와 나 설명 카드에서 바닷가의 모습이 어떻게 다른지 설명하세요. 카드에 적힌 특징을 써 보세요."
      ],
      "misconception": [
        "바닷가마다 모습이 달라요. 사진에서 보이는 특징을 근거로 해요.",
        "바닷가마다 모습이 달라요. 카드에 적힌 특징을 근거로 해요."
      ]
    },
    "figureHtml": "<table class=\"ed-table\"><thead><tr><th scope=\"col\">사진 설명 카드</th><th scope=\"col\">눈으로 확인한 모습</th></tr></thead><tbody><tr><th scope=\"row\">가</th><td>모래가 넓게 펼쳐진 바닷가</td></tr><tr><th scope=\"row\">나</th><td>높고 가파른 바위가 있는 바닷가</td></tr><tr><th scope=\"row\">다</th><td>물 빠진 때 넓게 드러난 진흙 바닥</td></tr></tbody></table><p class=\"ed-given\"><b>안내</b> 문제 해석을 위한 가상 관찰 기록이며 직접 관찰한 결과가 아니에요.</p>"
  }
};
export function withEarthSeaLinkedWorkbook(workbook){
 if(!EARTH_SEA_CHOICE_UNITS.includes(workbook?.unit)||!Array.isArray(workbook.questions))return workbook;
 let changed=false;
 const questions=workbook.questions.map(q=>{
  const p=workbookPatches[q.id];
  if(!p||p.unit!==workbook.unit||q.contentVersion!=null||q.sourceContent||(q.status??null)!==p.previousStatus||q.prompt!==p.prompt||!same(q.sourceId??null,p.sourceId)||!same(q.sourceRef??null,p.sourceRef)||(p.figureHtml!=null&&workbook.figures?.[p.presentation.figure]!==p.figureHtml)||!Object.keys(p.presentation).every(k=>same(q[k]??null,p.presentation[k]))||!Object.entries(p.fields).every(([key,[previous]])=>same(q[key],previous)))return q;
  changed=true;return {...q,...Object.fromEntries(Object.entries(p.fields).map(([key,[,value]])=>[key,clone(value)]))};
 });
 return changed?{...workbook,questions}:workbook;
}

const safetyPatches={
  "c22-s32-u02-b28": {
    "previous": {
      "id": "c22-s32-u02-b28",
      "status": "authored",
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
        "element": "E3",
        "type": "T04",
        "format": "선택형",
        "level": "기본",
        "track": "교과",
        "standard": "4과06-02"
      },
      "prompt": "바닷물을 가열해 남긴 물질을 다루는 방법은 무엇인가요?",
      "givens": null,
      "choices": [
        "소금처럼 흰색이면 식기 전에 조금 맛을 보아도 된다.",
        "가열을 멈췄으면 접시를 바로 맨손으로 만져도 된다.",
        "장갑을 끼면 보호 안경 없이 가까이에서 보아도 된다.",
        "남은 것이 안 보이면 끓는 접시 위로 얼굴을 가까이 댄다.",
        "먹거나 맛보지 않고 관찰한다."
      ],
      "responseContract": "single-choice",
      "answerContract": {
        "type": "single-choice",
        "answer": 4,
        "accepted": [
          4
        ]
      },
      "explanation": "남은 물질은 식힌 뒤 교사 안내에 따라 눈으로 관찰해요. 흰색이라고 먹어도 되는 것은 아니며 가열을 멈춰도 기구가 뜨거울 수 있어요. 보호 안경과 정해진 관찰 거리를 지켜요.",
      "evidence": {
        "checkedBy": "창작 학습 문항 검수",
        "date": "2026-10-17",
        "gates": [
          "science",
          "answer"
        ],
        "against": "교육부 성취기준·이론/실험 본문·해양환경 공식 자료",
        "note": "가상 자료는 실제 관찰값이 아니며 원문 문항이나 공식 배점이 아니다."
      },
      "contentVersion": "20261115-earth-sea-linked-choice-review",
      "previousVersions": [
        {
          "id": "c22-s32-u02-b28",
          "status": "authored",
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
            "element": "E3",
            "type": "T04",
            "format": "선택형",
            "level": "기본",
            "track": "교과",
            "standard": "4과06-02"
          },
          "prompt": "바닷물을 가열해 남긴 물질을 다루는 방법은 무엇인가요?",
          "givens": null,
          "choices": [
            "짠지 확인하려고 직접 맛본다.",
            "뜨거운 접시를 맨손으로 잡는다.",
            "남은 가루를 바람에 세게 분다.",
            "집에서 혼자 불을 켜서 반복한다.",
            "먹거나 맛보지 않고 관찰한다."
          ],
          "responseContract": "single-choice",
          "answerContract": {
            "type": "single-choice",
            "answer": 4,
            "accepted": [
              4
            ]
          },
          "explanation": "먹거나 맛보지 않고 관찰한다.",
          "evidence": {
            "checkedBy": "창작 학습 문항 검수",
            "date": "2026-10-17",
            "gates": [
              "science",
              "answer"
            ],
            "against": "교육부 성취기준·이론/실험 본문·해양환경 공식 자료",
            "note": "가상 자료는 실제 관찰값이 아니며 원문 문항이나 공식 배점이 아니다."
          },
          "version": 1,
          "snapshotKind": "full-question"
        }
      ]
    },
    "distractors": {
      "0": "ES_TASTE",
      "1": "ES_HEAT",
      "2": "ES_DISTANCE",
      "3": "ES_DISTANCE"
    }
  },
  "c22-s32-u02-b35": {
    "previous": {
      "id": "c22-s32-u02-b35",
      "status": "authored",
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
        "element": "E3",
        "type": "T05",
        "format": "선택형",
        "level": "기본",
        "track": "교과",
        "standard": "4과06-02"
      },
      "prompt": "교사가 가열하는 모습을 관찰할 때 알맞은 행동은 무엇인가요?",
      "givens": null,
      "choices": [
        "가열을 멈추면 바로 접시를 맨손으로 들어 옮긴다.",
        "보호 안경을 쓰고 정한 거리에서 본다.",
        "보호 안경을 썼으면 끓는 접시 위로 얼굴을 가까이 댄다.",
        "잘 안 보이면 교사에게 알리지 않고 가열 기구를 조절한다.",
        "남은 것이 소금처럼 보이면 손가락으로 찍어 맛본다."
      ],
      "responseContract": "single-choice",
      "answerContract": {
        "type": "single-choice",
        "answer": 1,
        "accepted": [
          1
        ]
      },
      "explanation": "교사가 가열을 맡고 학생은 보호 안경과 정해진 거리를 지켜 관찰해요. 안 보이거나 조작이 필요하면 교사에게 알려요. 보호 안경이 뜨거운 기구를 만지거나 얼굴을 가까이 대도 된다는 뜻은 아니에요.",
      "evidence": {
        "checkedBy": "창작 학습 문항 검수",
        "date": "2026-10-17",
        "gates": [
          "science",
          "answer"
        ],
        "against": "교육부 성취기준·이론/실험 본문·해양환경 공식 자료",
        "note": "가상 자료는 실제 관찰값이 아니며 원문 문항이나 공식 배점이 아니다."
      },
      "contentVersion": "20261115-earth-sea-linked-choice-review",
      "previousVersions": [
        {
          "id": "c22-s32-u02-b35",
          "status": "authored",
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
            "element": "E3",
            "type": "T05",
            "format": "선택형",
            "level": "기본",
            "track": "교과",
            "standard": "4과06-02"
          },
          "prompt": "교사가 가열하는 모습을 관찰할 때 알맞은 행동은 무엇인가요?",
          "givens": null,
          "choices": [
            "끓는 접시 위로 얼굴을 가까이 댄다.",
            "보호 안경을 쓰고 정한 거리에서 본다.",
            "다 쓰고 바로 뜨거운 접시를 잡는다.",
            "남은 물질을 손가락으로 찍어 먹는다.",
            "안 보이면 혼자 가열 기구를 조절한다."
          ],
          "responseContract": "single-choice",
          "answerContract": {
            "type": "single-choice",
            "answer": 1,
            "accepted": [
              1
            ]
          },
          "explanation": "보호 안경을 쓰고 정한 거리에서 본다.",
          "evidence": {
            "checkedBy": "창작 학습 문항 검수",
            "date": "2026-10-17",
            "gates": [
              "science",
              "answer"
            ],
            "against": "교육부 성취기준·이론/실험 본문·해양환경 공식 자료",
            "note": "가상 자료는 실제 관찰값이 아니며 원문 문항이나 공식 배점이 아니다."
          },
          "version": 1,
          "snapshotKind": "full-question"
        }
      ]
    },
    "distractors": {
      "0": "ES_HEAT",
      "2": "ES_DISTANCE",
      "3": "ES_EQUIPMENT",
      "4": "ES_TASTE"
    }
  }
};
const safetyCache=new WeakMap();
export function earthSeaSafetyReview(rows,unit){
 if(unit!=='c22-s32-u02'||!Array.isArray(rows))return rows;
 let changed=false;
 const next=rows.map(q=>{
  const p=safetyPatches[q.id];
  if(!p||!same(q,p.previous))return q;
  changed=true;
  if(safetyCache.has(q))return safetyCache.get(q);
  const current={...q,contentVersion:EARTH_SEA_SAFETY_VERSION,diagnosticOverride:{version:EARTH_SEA_SAFETY_VERSION,distractors:clone(p.distractors)},previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};
  safetyCache.set(q,current);return current;
 });
 return changed?next:rows;
}
