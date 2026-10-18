export const unit = {
  "id": "c22-s52-u03",
  "course": "5-2",
  "no": 3,
  "title": "날씨와 우리 생활",
  "domain": "지구와 우주",
  "elements": [
    "기상 요소·습도와 관측 자료",
    "이슬·안개·응결 관찰",
    "구름과 위치/구성 비교",
    "기압·공기 비교·해륙풍",
    "날씨 정보와 생활"
  ],
  "sources": {
    "bank": [
      "sci-weather-52-set1",
      "sci-weather-52-set2",
      "sci-weather-52-set3",
      "sci-weather-52-set4"
    ],
    "originalExamAvailable": false,
    "sourceExcerptOnly": true,
    "currentEditionOriginalExamPending": true,
    "sourceAutomaticAnswerHold": 6,
    "basis": "bank/work/c22s52u03/curriculum.json",
    "scope": "옛5-2 네 세트70 중 현행 관련57 발췌. 원문6 자동 검토, 현행판본 전체 시험지와 별도. 독립 창작 개념/탐구 교재112와 구별. 전체5E/실제활동기록을 별도 연결."
  }
};
export const items = [
  {
    "id": "c22-s52-u03-b001",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "기상 요소",
      "concept": "기상 요소·관측과 자료",
      "inquirySkill": "조건 적용"
    },
    "prompt": "그날 학교 주변 날씨를 비교할 자료로 알맞은 것은?",
    "givens": null,
    "choices": [
      "지난해 여행 때 찍었던 풍경 사진",
      "같은 시각에 기록한 기온과 구름의 양",
      "내가 좋아하는 계절과 그 이유",
      "교실 친구들이 선호하는 운동",
      "오늘 입은 옷의 색과 무늬"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "bookResponseForm": "choice",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w001",
      "no": 1
    },
    "explanation": "현재 학교 주변의 기상 요소를 같은 시각과 관측 조건으로 모아야 그날 날씨를 비교할 수 있어요. 옷이나 기억만으로는 관측값을 대신할 수 없어요.",
    "misconception": "생활 모습과 실제 관측 자료를 같게 보지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b002",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T14",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-02",
      "topic": "수증기와 물방울",
      "concept": "이슬·응결과 공정 비교",
      "inquirySkill": "개념/용어 구별"
    },
    "prompt": "눈에 보이지 않는 기체 상태의 물은 [ ]이고, 차가운 컵 밖 작은 물방울은 [ ] 상태예요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "수증기, 액체",
      "accepted": [
        "수증기, 액체"
      ]
    },
    "bookResponseForm": "blank",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w002",
      "no": 2
    },
    "explanation": "수증기는 기체 상태예요. 컵 밖 맺힌 물방울은 액체이며 수증기 자체가 눈에 보이는 것은 아니에요.",
    "misconception": "기체 수증기·물방울과 서로 다른 기상 요소를 구별해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b003",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T16",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-02",
      "topic": "관찰 위치",
      "concept": "이슬·안개·구름 관찰 비교",
      "inquirySkill": "특성/관계 연결"
    },
    "prompt": "보기와 설명을 연결하세요. ㄱ 이슬 / ㄴ 안개 / ㄷ 구름",
    "givens": {
      "문항": [
        "(1) 풀잎 표면에 맺힌 물방울 [ ]",
        "(2) 지표 가까운 공기 중에 떠 있는 작은 물방울 [ ]",
        "(3) 높은 공중의 작은 물방울·얼음 알갱이 [ ]"
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "(1) ㄱ (2) ㄴ (3) ㄷ",
      "accepted": [
        "(1) ㄱ (2) ㄴ (3) ㄷ",
        "ㄱ ㄴ ㄷ"
      ]
    },
    "bookResponseForm": "match",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w003",
      "no": 3
    },
    "explanation": "이슬은 표면, 안개는 지표 가까운 공기 중, 구름은 높은 공중에서 관찰하는 위치로 비교해요.",
    "misconception": "각 설명의 순서와 기호를 함께 적어요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b004",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T19",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "처음 생각",
      "concept": "생활 자료·조사/제작·실제 소통",
      "inquirySkill": "근거·한계 설명/실제 소통"
    },
    "prompt": "안개 낀 날은 반드시 오후에 비가 올까요? 지금 생각과 확인하고 싶은 자료를 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "예상 예: 안개만으로 오후 비를 확정할 수 없다. 그 지역 오후의 최신 예보와 강수 관측 자료를 더 보고 싶다.",
      "rubric": {
        "required": [
          "예상과 근거/추가로 확인할 자료를 구별. 처음 예상을 실제 오후 결과로 쓰지 않음."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "written",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w004",
      "no": 4
    },
    "explanation": "처음 생각을 남겨요. 안개 관찰과 이후 강수 예보는 시간·자료가 달라요. 학습 뒤 근거로 다시 비교해요.",
    "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b005",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "기상 요소와 도구",
      "concept": "기상 요소·관측과 자료",
      "inquirySkill": "조건 적용"
    },
    "prompt": "공기의 따뜻하고 차가운 정도를 재는 도구는?",
    "givens": null,
    "choices": [
      "습도계",
      "풍향계",
      "풍속계",
      "강수량계",
      "온도계"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "bookResponseForm": "choice",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w005",
      "no": 5
    },
    "explanation": "기온은 공기의 온도이며 온도계로 재요. 습도·풍향·풍속·강수량은 각각 다른 기상 요소예요.",
    "misconception": "기온과 습도·강수량의 도구를 섞지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b006",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "풍향의 뜻",
      "concept": "기상 요소·관측과 자료",
      "inquirySkill": "개념/용어 구별"
    },
    "prompt": "바람이 북쪽에서 남쪽으로 불면 풍향은 [ ]이에요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "북풍",
      "accepted": [
        "북풍",
        "북풍이다"
      ]
    },
    "bookResponseForm": "blank",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w006",
      "no": 6
    },
    "explanation": "풍향은 바람이 불어오는 쪽으로 불러요. 북쪽에서 오므로 북풍이며 바람이 향하는 남쪽으로 이름 붙이지 않아요.",
    "misconception": "기체 수증기·물방울과 서로 다른 기상 요소를 구별해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b007",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "기상 요소와 단위",
      "concept": "기상 요소·관측과 자료",
      "inquirySkill": "특성/관계 연결"
    },
    "prompt": "보기: ㄱ ℃ / ㄴ % / ㄷ mm / ㄹ m/s",
    "givens": {
      "문항": [
        "(1) 기온 [ ]",
        "(2) 습도 [ ]",
        "(3) 강수량 [ ]",
        "(4) 풍속 [ ]"
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "(1) ㄱ (2) ㄴ (3) ㄷ (4) ㄹ",
      "accepted": [
        "(1) ㄱ (2) ㄴ (3) ㄷ (4) ㄹ",
        "ㄱ ㄴ ㄷ ㄹ"
      ]
    },
    "bookResponseForm": "match",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w007",
      "no": 7
    },
    "explanation": "기온·습도·강수량·풍속은 서로 다른 양이므로 단위도 달라요. 단위만 보고 양을 바꾸어 읽지 않아요.",
    "misconception": "각 설명의 순서와 기호를 함께 적어요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b008",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "같은 시각의 기온",
      "concept": "기상 요소·관측과 자료",
      "inquirySkill": "단위/시각·자료 해석"
    },
    "prompt": "가상 관측표에서 학교 A는18℃, 학교 B는23℃예요. 두 학교의 기온 차는 몇 ℃인가요?",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "5℃",
      "accepted": [
        "5℃",
        "5°C"
      ]
    },
    "bookResponseForm": "short",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w008",
      "no": 8
    },
    "explanation": "같은 시각의 두 기온에서23-18=5℃예요. 서로 다른 장소의 차이이며 한 학교의 시간에 따른 변화는 아니에요.",
    "misconception": "자료의 지역·시각·단위를 먼저 확인해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b009",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "관측 조건",
      "concept": "기상 요소·관측과 자료",
      "inquirySkill": "주장과 근거 비교"
    },
    "prompt": "기온을 비교하기 위해 확인할 것을 모두 고르세요.",
    "givens": null,
    "choices": [
      "관측 날짜와 시각",
      "직사광선·벽면 등 주변 조건",
      "측정 도구의 감지 부분",
      "관측자가 좋아하는 색",
      "도구의 값이 안정되었는지"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        1,
        2,
        4
      ]
    },
    "bookResponseForm": "multi",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w009",
      "no": 9
    },
    "explanation": "같은 기준으로 비교하려면 시각·도구·감지 부분·노출 조건과 안정된 표시를 확인해요. 선호하는 색은 필요한 관측 조건이 아니에요.",
    "misconception": "한 주장만 맞는다고 모두 고르기를 끝내지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b010",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T12",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "기온 기록의 한계",
      "concept": "기상 요소·관측과 자료",
      "inquirySkill": "근거·한계 설명/실제 소통"
    },
    "prompt": "A는 그늘에서10시에, B는 햇빛에 달궈진 벽 바로 옆에서14시에 기온을 쟀어요. 두 값이 다른 까닭을 장소 하나로 설명할 수 있을까요?",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "시각과 빛·벽의 조건도 다르므로 장소 차이만의 영향이라고 할 수 없다. 같은 시각과 정한 관측 조건으로 다시 비교한다.",
      "rubric": {
        "required": [
          "달라진 조건2개 이상·단일 원인 확정 불가·다시 비교할 조건."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "written",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w010",
      "no": 10
    },
    "explanation": "두 가지 이상 조건이 함께 달라졌어요. 차이가 있다는 관찰은 남기되 어느 한 원인만으로 설명하지 않아요.",
    "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b011",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "습도의 뜻",
      "concept": "습도와 조건/양 구별",
      "inquirySkill": "조건 적용"
    },
    "prompt": "습도60%라는 관측값의 뜻으로 알맞은 것은?",
    "givens": null,
    "choices": [
      "공기가 얼마나 습한지 나타낸 값",
      "공기100g에 물60g이 든 양",
      "내릴 비의 양을 나타낸 값",
      "관측 장소의 기온을 나타낸 값",
      "구름이 덮은 넓이를 나타낸 값"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "bookResponseForm": "choice",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w011",
      "no": 11
    },
    "explanation": "습도는 공기가 습한 정도를 나타내요.60%를 수증기60g·강수량·기온·구름의 양으로 바꾸어 읽을 수 없어요.",
    "misconception": "퍼센트를 수증기의 질량으로 읽지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b012",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "습도 관측",
      "concept": "습도와 조건/양 구별",
      "inquirySkill": "개념/용어 구별"
    },
    "prompt": "공기의 습한 정도를 나타내는 기상 요소는 [ ]이고, 보통 [ ] 단위로 기록해요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "습도, %",
      "accepted": [
        "습도, %",
        "습도, 퍼센트"
      ]
    },
    "bookResponseForm": "blank",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w012",
      "no": 12
    },
    "explanation": "습도는 공기의 습한 정도이며%로 나타내요. 기온의℃와 구별해요.",
    "misconception": "기체 수증기·물방울과 서로 다른 기상 요소를 구별해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b013",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "값과 단위",
      "concept": "습도와 조건/양 구별",
      "inquirySkill": "특성/관계 연결"
    },
    "prompt": "가상 자료: 기온21℃·습도65%·강수량3mm. 보기: ㄱ 21 / ㄴ 65 / ㄷ 3",
    "givens": {
      "문항": [
        "(1) 공기의 습한 정도의 수치 [ ]",
        "(2) 내린 강수량의 수치 [ ]",
        "(3) 공기의 온도 수치 [ ]"
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "(1) ㄴ (2) ㄷ (3) ㄱ",
      "accepted": [
        "(1) ㄴ (2) ㄷ (3) ㄱ",
        "ㄴ ㄷ ㄱ"
      ]
    },
    "bookResponseForm": "match",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w013",
      "no": 13
    },
    "explanation": "항목 이름과 단위를 함께 읽어요.65%는 습도,3mm는 강수량,21℃는 기온이에요.",
    "misconception": "각 설명의 순서와 기호를 함께 적어요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b014",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "습도 차이",
      "concept": "습도와 조건/양 구별",
      "inquirySkill": "단위/시각·자료 해석"
    },
    "prompt": "가상 자료: 같은 시각 같은 기온에서 A습도48%, B습도68%예요. 어느 곳의 습도가 더 높은가요? 기호만 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "B",
      "accepted": [
        "B",
        "b"
      ]
    },
    "bookResponseForm": "short",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w014",
      "no": 14
    },
    "explanation": "같은 시각 표에서68%가48%보다 높으므로 B예요. 이 비교만으로 수증기의 질량 차이나 비가 올 시각은 알 수 없어요.",
    "misconception": "자료의 지역·시각·단위를 먼저 확인해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b015",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "습도 자료의 범위",
      "concept": "습도와 조건/양 구별",
      "inquirySkill": "주장과 근거 비교"
    },
    "prompt": "가상 표에서 습도40%가70%로 바뀌었어요. 이 자료에 맞는 설명을 모두 고르세요.",
    "givens": null,
    "choices": [
      "습도가 높아졌다.",
      "기온 자료도 함께 확인한다.",
      "수증기가 정확히30g 늘었다.",
      "비가 반드시 곧 내린다.",
      "실제 자료인지 가상 표인지 밝힌다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        1,
        4
      ]
    },
    "bookResponseForm": "multi",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w015",
      "no": 15
    },
    "explanation": "수치상 습도는 높아졌지만 수증기 질량이나 비의 시각은 제시되지 않았어요. 기온과 자료의 성격을 함께 확인해요.",
    "misconception": "한 주장만 맞는다고 모두 고르기를 끝내지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b016",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T13",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "습도와 물의 양",
      "concept": "습도와 조건/양 구별",
      "inquirySkill": "근거·한계 설명/실제 소통"
    },
    "prompt": "기온이 다른 두 방의 습도가 모두50%예요. 수증기의 실제 양도 같다고 결론 내릴 수 없는 까닭을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "습도는 기온의 영향도 받는 습한 정도이다. 기온과 공간의 부피 등 조건이 다를 수 있어 수증기의 실제 질량이 같다고 할 수 없다.",
      "rubric": {
        "required": [
          "습도와 절대량 구별·기온/부피 등 조건·확인하지 못한 양을 확정하지 않음."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "written",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w016",
      "no": 16
    },
    "explanation": "같은%만으로 공기 속 수증기 질량을 같게 정하지 않아요. 이 단원에서는 포화량 공식으로 계산하지 않고 비교의 조건을 확인해요.",
    "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b017",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T14",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-02",
      "topic": "이슬의 관찰",
      "concept": "이슬·응결과 공정 비교",
      "inquirySkill": "조건 적용"
    },
    "prompt": "풀잎 표면의 물방울이 이슬인지 조사할 때 필요한 확인은?",
    "givens": null,
    "choices": [
      "풀잎의 색과 모양만 비교한다.",
      "학교의 어제 기온만 확인한다.",
      "맺힌 물방울의 수만 세어 본다.",
      "비·물 뿌림 여부와 맺힌 위치",
      "모든 표면 물방울을 이슬이라 한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "bookResponseForm": "choice",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w017",
      "no": 17
    },
    "explanation": "표면 물방울이라도 비나 뿌린 물일 수 있어요. 위치·시각과 비/물 뿌림 여부를 함께 기록해야 이슬 해석을 뒷받침해요.",
    "misconception": "물방울 사진만으로 원인을 확정하지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b018",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T14",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-02",
      "topic": "응결",
      "concept": "이슬·응결과 공정 비교",
      "inquirySkill": "개념/용어 구별"
    },
    "prompt": "공기 중 수증기가 차가운 물체 표면에서 액체 물방울로 바뀌는 현상을 [ ]이라고 해요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "응결",
      "accepted": [
        "응결"
      ]
    },
    "bookResponseForm": "blank",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w018",
      "no": 18
    },
    "explanation": "기체 수증기가 액체 물로 바뀌는 것이 응결이에요. 액체 물이 수증기로 바뀌는 증발과 방향이 달라요.",
    "misconception": "기체 수증기·물방울과 서로 다른 기상 요소를 구별해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b019",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T14",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-02",
      "topic": "컵 실험의 비교",
      "concept": "이슬·응결과 공정 비교",
      "inquirySkill": "특성/관계 연결"
    },
    "prompt": "보기: ㄱ 관찰한 사실 / ㄴ 원인에 대한 해석 / ㄷ 추가 확인",
    "givens": {
      "문항": [
        "(1) 컵 외벽에 작은 물방울이 보였다. [ ]",
        "(2) 공기 중 수증기가 응결했다고 생각했다. [ ]",
        "(3) 컵이 새는지 살펴보았다. [ ]"
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "(1) ㄱ (2) ㄴ (3) ㄷ",
      "accepted": [
        "(1) ㄱ (2) ㄴ (3) ㄷ",
        "ㄱ ㄴ ㄷ"
      ]
    },
    "bookResponseForm": "match",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w019",
      "no": 19
    },
    "explanation": "눈에 보인 상태·원인 설명·원인을 가리기 위한 확인은 서로 달라요. 관찰만 적어도 원인 검증이 끝난 것은 아니에요.",
    "misconception": "각 설명의 순서와 기호를 함께 적어요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b020",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T14",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-02",
      "topic": "응결한 물의 상태",
      "concept": "이슬·응결과 공정 비교",
      "inquirySkill": "단위/시각·자료 해석"
    },
    "prompt": "차가운 컵 외벽에 맺힌 작은 물방울은 고체·액체·기체 중 어떤 상태인가요?",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "액체",
      "accepted": [
        "액체"
      ]
    },
    "bookResponseForm": "short",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w020",
      "no": 20
    },
    "explanation": "작은 물방울은 액체예요. 컵 안 얼음의 고체 상태나 보이지 않는 기체 수증기와 구별해요.",
    "misconception": "자료의 지역·시각·단위를 먼저 확인해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b021",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T14",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-02",
      "topic": "물방울 원인 확인",
      "concept": "이슬·응결과 공정 비교",
      "inquirySkill": "주장과 근거 비교"
    },
    "prompt": "차가운 컵 외벽 물방울의 원인을 살필 방법을 모두 고르세요.",
    "givens": null,
    "choices": [
      "처음 외벽의 물기를 닦는다.",
      "물이 튀거나 흘렀는지 기록한다.",
      "컵이 새는 곳이 없는지 살핀다.",
      "처음 물기를 남겨 두고 비교한다.",
      "사진 한 장만으로 원인을 확정한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        1,
        2
      ]
    },
    "bookResponseForm": "multi",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w021",
      "no": 21
    },
    "explanation": "닦은 처음 상태·새는 곳·튀거나 흐른 물을 점검해 공기 중 수증기의 응결이라는 해석과 다른 원인을 비교해요.",
    "misconception": "한 주장만 맞는다고 모두 고르기를 끝내지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b022",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T14",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-02",
      "topic": "이슬 모형의 한계",
      "concept": "이슬·응결과 공정 비교",
      "inquirySkill": "근거·한계 설명/실제 소통"
    },
    "prompt": "교사가 준비한 컵 비교에서 한쪽 외벽에만 물방울이 생겼어요. 어떤 조건과 다른 원인을 확인하고 응결로 설명할지 쓰세요.",
    "givens": null,
    "choices": null,
    "figure": "assets/activities/c22-s52-u03/dew.webp",
    "figureNote": "두 컵의 외벽 상태를 비교할 설명 장면.",
    "photoLabels": [
      "왼쪽 컵",
      "오른쪽 컵"
    ],
    "photoCredit": "AI 실사형 설명 이미지 · 실제 관측/실험/측정 사진 아님",
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "같은 컵·양·주위·시각, 처음 외벽 물기와 새는 곳/튀는 물을 확인한다. 차가워진 외벽에 공기 중 수증기가 액체 물방울로 바뀌었다고 설명한다.",
      "rubric": {
        "required": [
          "공정 비교·다른 물의 경로·수증기→액체·실제 확인 범위."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "written",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w022",
      "no": 22
    },
    "explanation": "다른 조건을 확인해야 차가운 표면과 응결을 연결할 수 있어요. 실제로 점검하지 않은 조건은 미확인으로 남겨요.",
    "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer",
        "visual"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b023",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T15",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-02",
      "topic": "안개와 이슬",
      "concept": "안개 모형·관찰 위치와 한계",
      "inquirySkill": "조건 적용"
    },
    "prompt": "안개와 이슬을 나누는 관찰 기준은?",
    "givens": null,
    "choices": [
      "물방울에 햇빛이 비치는 정도",
      "물방울이 관찰된 날의 기온만",
      "물방울이 맺히거나 떠 있는 위치",
      "물방울이 관찰된 계절의 이름",
      "물방울이 하얗게 보이는 정도"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "bookResponseForm": "choice",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w023",
      "no": 23
    },
    "explanation": "안개는 지표 가까운 공기 중에 떠 있는 작은 물방울, 이슬은 물체 표면에 맺힌 물방울로 위치를 비교해요.",
    "misconception": "둘 다 작은 물방울이라는 점과 놓인 위치의 차이를 함께 봐요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b024",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T15",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-02",
      "topic": "안개의 위치",
      "concept": "안개 모형·관찰 위치와 한계",
      "inquirySkill": "개념/용어 구별"
    },
    "prompt": "안개는 [ ] 가까운 공기 중에 작은 물방울이 떠 있는 현상이에요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "지표",
      "accepted": [
        "지표",
        "지표면",
        "땅"
      ]
    },
    "bookResponseForm": "blank",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w024",
      "no": 24
    },
    "explanation": "안개는 지표 가까운 공기 중에서 관찰해요. 풀잎 표면의 물방울 자체는 안개가 아니에요.",
    "misconception": "기체 수증기·물방울과 서로 다른 기상 요소를 구별해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b025",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T15",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-02",
      "topic": "흐린 장면 읽기",
      "concept": "안개 모형·관찰 위치와 한계",
      "inquirySkill": "특성/관계 연결"
    },
    "prompt": "보기: ㄱ 직접 관찰 / ㄴ 추가 자료 / ㄷ 아직 확정 못 함",
    "givens": {
      "문항": [
        "(1) 나무 밑부분 주변이 희게 흐렸다. [ ]",
        "(2) 같은 시각 주변 공사/연기 여부를 조사한다. [ ]",
        "(3) 사진만 보고 모든 흐림을 안개라고 판정한다. [ ]"
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "(1) ㄱ (2) ㄴ (3) ㄷ",
      "accepted": [
        "(1) ㄱ (2) ㄴ (3) ㄷ",
        "ㄱ ㄴ ㄷ"
      ]
    },
    "bookResponseForm": "match",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w025",
      "no": 25
    },
    "explanation": "흐린 모습은 관찰할 수 있지만 안개/먼지/연기 원인은 추가 자료가 필요할 수 있어요. 모양 하나로 모두 확정하지 않아요.",
    "misconception": "각 설명의 순서와 기호를 함께 적어요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b026",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T15",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-02",
      "topic": "안개 관찰 대상",
      "concept": "안개 모형·관찰 위치와 한계",
      "inquirySkill": "단위/시각·자료 해석"
    },
    "prompt": "안개는 기체 수증기 자체가 보이는 것일까요, 작은 물방울이 보이는 것일까요? 대상 이름을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "작은 물방울",
      "accepted": [
        "작은 물방울",
        "물방울"
      ]
    },
    "bookResponseForm": "short",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w026",
      "no": 26
    },
    "explanation": "수증기는 보이지 않는 기체예요. 안개의 흐린 모습은 공기 중에 떠 있는 작은 물방울로 설명해요.",
    "misconception": "자료의 지역·시각·단위를 먼저 확인해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b027",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T15",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-02",
      "topic": "안개 모형 기록",
      "concept": "안개 모형·관찰 위치와 한계",
      "inquirySkill": "주장과 근거 비교"
    },
    "prompt": "교사의 안전한 응결 시범을 기록하는 방법을 모두 고르세요.",
    "givens": null,
    "choices": [
      "공기 중 흐림과 벽면 물방울을 나눈다.",
      "변화가 잘 안 보이면 미관찰로 남긴다.",
      "주머니에서 물이 샜는지 살핀다.",
      "보이지 않은 흐림을 결과처럼 그린다.",
      "설명 사진을 내 실제 결과로 붙인다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        1,
        2
      ]
    },
    "bookResponseForm": "multi",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w027",
      "no": 27
    },
    "explanation": "공기 중과 표면의 위치를 나누고 새는 물 등 다른 원인을 확인해요. 변화가 보이지 않은 사실도 결과이며 설명 사진으로 대신하지 않아요.",
    "misconception": "한 주장만 맞는다고 모두 고르기를 끝내지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b028",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T15",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-02",
      "topic": "흐림의 원인과 한계",
      "concept": "안개 모형·관찰 위치와 한계",
      "inquirySkill": "근거·한계 설명/실제 소통"
    },
    "prompt": "병 안 벽면에는 물방울이 보였지만 공기 중 흐림은 분명하지 않았어요. 이 관찰로 안개 모형이 뚜렷하게 생겼다고 할 수 있을까요?",
    "givens": null,
    "choices": null,
    "figure": "assets/activities/c22-s52-u03/fog-model.webp",
    "figureNote": "병 안 물과 위쪽 냉각 주머니를 배치한 설명 장면.",
    "photoLabels": [
      "병 안쪽 공간",
      "위쪽 주머니"
    ],
    "photoCredit": "AI 실사형 설명 이미지 · 실제 관측/실험/측정 사진 아님",
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "벽면 물방울은 관찰했지만 공기 중 떠 있는 흐림은 불분명하므로 안개 모형이 뚜렷했다고 쓰지 않는다. 위치·시각·냉각 조건을 남기고 다시 관찰할 계획을 세운다.",
      "rubric": {
        "required": [
          "관찰/불분명 구별·안개 확정 금지·추가 확인 계획."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "written",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w028",
      "no": 28
    },
    "explanation": "표면 응결과 공기 중 흐림은 위치가 달라요. 기대한 결과와 실제 관찰을 분리해야 해요.",
    "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer",
        "visual"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b029",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T16",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-02",
      "topic": "구름의 구성",
      "concept": "이슬·안개·구름 관찰 비교",
      "inquirySkill": "조건 적용"
    },
    "prompt": "구름의 구성에 대한 설명으로 알맞은 것은?",
    "givens": null,
    "choices": [
      "눈에 보이는 기체 수증기로만 이루어진다.",
      "작은 물방울이나 얼음 알갱이로 이루어진다.",
      "하늘의 푸른 공기가 흰색으로 변한 것이다.",
      "높은 곳으로 올라간 먼지만 모인 것이다.",
      "높은 산의 돌 조각이 모여 떠 있는 것이다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "bookResponseForm": "choice",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w029",
      "no": 29
    },
    "explanation": "구름은 작은 물방울이나 얼음 알갱이로 이루어져요. 눈에 보이지 않는 수증기 자체와 구별해요.",
    "misconception": "모습의 흰색을 기체 수증기라고 부르지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b030",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T16",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-02",
      "topic": "이슬·안개·구름 비교",
      "concept": "이슬·안개·구름 관찰 비교",
      "inquirySkill": "개념/용어 구별"
    },
    "prompt": "이슬은 물체 [ ]에 맺히고, 안개와 구름은 공기 중에 [ ] 있어요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "표면, 떠",
      "accepted": [
        "표면, 떠",
        "겉면, 떠"
      ]
    },
    "bookResponseForm": "blank",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w030",
      "no": 30
    },
    "explanation": "이슬은 표면에 맺힘, 안개와 구름은 공기 중 떠 있음이 비교의 핵심이에요.",
    "misconception": "기체 수증기·물방울과 서로 다른 기상 요소를 구별해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b031",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T16",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-02",
      "topic": "공통점과 차이",
      "concept": "이슬·안개·구름 관찰 비교",
      "inquirySkill": "특성/관계 연결"
    },
    "prompt": "보기: ㄱ 공통점 / ㄴ 위치 차이 / ㄷ 사진만으로 미확인",
    "givens": {
      "문항": [
        "(1) 안개와 물방울 구름 모두 작은 물방울이 떠 있다. [ ]",
        "(2) 지표 가까운 곳과 높은 공중을 비교한다. [ ]",
        "(3) 각 물방울의 크기를 정확히 정한다. [ ]"
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "(1) ㄱ (2) ㄴ (3) ㄷ",
      "accepted": [
        "(1) ㄱ (2) ㄴ (3) ㄷ",
        "ㄱ ㄴ ㄷ"
      ]
    },
    "bookResponseForm": "match",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w031",
      "no": 31
    },
    "explanation": "물방울의 존재는 공통점, 관찰 위치는 차이예요. 사진에 크기 기준이 없으면 작은 입자의 정확한 크기는 읽을 수 없어요.",
    "misconception": "각 설명의 순서와 기호를 함께 적어요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b032",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T16",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-02",
      "topic": "물방울 구름의 상태",
      "concept": "이슬·안개·구름 관찰 비교",
      "inquirySkill": "단위/시각·자료 해석"
    },
    "prompt": "작은 물방울로만 이루어진 구름을 가정했어요. 그 물방울의 상태는 무엇인가요?",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "액체",
      "accepted": [
        "액체"
      ]
    },
    "bookResponseForm": "short",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w032",
      "no": 32
    },
    "explanation": "물방울은 액체예요. 실제 구름에는 얼음 알갱이가 있는 경우도 있으므로 이 문항은 물방울로만 된 경우라고 조건을 주었어요.",
    "misconception": "자료의 지역·시각·단위를 먼저 확인해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b033",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T16",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-02",
      "topic": "구름 관찰의 범위",
      "concept": "이슬·안개·구름 관찰 비교",
      "inquirySkill": "주장과 근거 비교"
    },
    "prompt": "한 장의 하늘 사진에서 확인하거나 추가 확인할 것을 모두 고르세요.",
    "givens": null,
    "choices": [
      "보이는 구름의 모양을 기록한다.",
      "하늘 전체가 찍혔는지 확인한다.",
      "실제 관측이면 지역·시각을 남긴다.",
      "사진만으로 내일 강수량을 확정한다.",
      "모든 입자의 실제 크기를 측정한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        1,
        2
      ]
    },
    "bookResponseForm": "multi",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w033",
      "no": 33
    },
    "explanation": "사진의 시야·지역·시각과 모양은 관찰 범위를 정하는 데 필요해요. 전체 하늘이나 다음 날 강수량, 입자 크기는 한 사진만으로 알 수 없어요.",
    "misconception": "한 주장만 맞는다고 모두 고르기를 끝내지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b034",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T16",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-02",
      "topic": "구름의 양",
      "concept": "이슬·안개·구름 관찰 비교",
      "inquirySkill": "근거·한계 설명/실제 소통"
    },
    "prompt": "작은 창문으로 찍은 사진에 구름이 가득 보여요. 그 지역 하늘 전체의 구름의 양이 많다고 바로 결론 내릴 수 없는 까닭은?",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "창문에서 보이는 하늘은 일부이다. 다른 방향을 포함해 정한 범위의 하늘을 같은 시각에 관찰해야 전체 구름의 양을 더 잘 설명할 수 있다.",
      "rubric": {
        "required": [
          "부분/전체 구별·관찰 방향과 시각·추가 확인."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "written",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w034",
      "no": 34
    },
    "explanation": "관찰 시야를 전체 하늘로 확대 해석하지 않아요. 구름의 양과 강수량도 다른 기상 요소예요.",
    "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b035",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T17",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "상대적인 고기압",
      "concept": "상대 기압 분포와 날씨",
      "inquirySkill": "조건 적용"
    },
    "prompt": "같은 높이의 가상 관측값 P1006hPa, Q1018hPa일 때 주변과 비교해 기압이 더 높은 곳은?",
    "givens": null,
    "choices": [
      "P",
      "두 곳이 같다",
      "기온만으로 정한다",
      "구름 색으로 정한다",
      "Q"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "bookResponseForm": "choice",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w035",
      "no": 35
    },
    "explanation": "1018hPa가1006hPa보다 높으므로 Q예요. 고/저는 주어진 주변 값과 비교하며 고정 숫자나 온도 하나로 정하지 않아요.",
    "misconception": "1013hPa를 모든 상황의 고/저 경계로 쓰지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b036",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T17",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "기압 차와 바람 모형",
      "concept": "상대 기압 분포와 날씨",
      "inquirySkill": "개념/용어 구별"
    },
    "prompt": "지표 부근의 단순 모형에서 바람은 기압이 [ ] 곳에서 [ ] 곳으로 불어요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "높은, 낮은",
      "accepted": [
        "높은, 낮은"
      ]
    },
    "bookResponseForm": "blank",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w036",
      "no": 36
    },
    "explanation": "기압 차이에 따라 지표 부근 공기가 높은 쪽에서 낮은 쪽으로 이동하는 모형으로 설명해요. 실제 먼 거리 바람의 길은 곧은 화살표와 다를 수 있어요.",
    "misconception": "기체 수증기·물방울과 서로 다른 기상 요소를 구별해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b037",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T17",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "기압 비교",
      "concept": "상대 기압 분포와 날씨",
      "inquirySkill": "특성/관계 연결"
    },
    "prompt": "같은 높이 가상 자료: A1012hPa, B1004hPa. 보기: ㄱ A / ㄴ B / ㄷ 자료 부족",
    "givens": {
      "문항": [
        "(1) 두 곳 중 기압이 더 높은 곳 [ ]",
        "(2) 두 곳 중 기압이 더 낮은 곳 [ ]",
        "(3) 내일 정확한 강수량 [ ]"
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "(1) ㄱ (2) ㄴ (3) ㄷ",
      "accepted": [
        "(1) ㄱ (2) ㄴ (3) ㄷ",
        "ㄱ ㄴ ㄷ"
      ]
    },
    "bookResponseForm": "match",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w037",
      "no": 37
    },
    "explanation": "1012가1004보다 높으므로 A/B를 비교해요. 기압 두 값만으로 내일 강수량을 정하지 못해요.",
    "misconception": "각 설명의 순서와 기호를 함께 적어요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b038",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T17",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "기압 값 읽기",
      "concept": "상대 기압 분포와 날씨",
      "inquirySkill": "단위/시각·자료 해석"
    },
    "prompt": "같은 높이 가상 자료: A1008hPa, B1015hPa. 기압 차는 몇 hPa인가요?",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "7hPa",
      "accepted": [
        "7hPa",
        "7 hpa"
      ]
    },
    "bookResponseForm": "short",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w038",
      "no": 38
    },
    "explanation": "1015-1008=7hPa예요. 두 기압의 차이며 기온 차나 풍속은 아니에요.",
    "misconception": "자료의 지역·시각·단위를 먼저 확인해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b039",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T17",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "기압과 날씨의 경향",
      "concept": "상대 기압 분포와 날씨",
      "inquirySkill": "주장과 근거 비교"
    },
    "prompt": "일반적인 날씨 경향을 설명할 때 필요한 생각을 모두 고르세요.",
    "givens": null,
    "choices": [
      "주변보다 기압이 높은지 비교한다.",
      "고기압에서도 다른 조건을 함께 본다.",
      "저기압이면 매 순간 비가 온다고 한다.",
      "기온 하나로 지표 기압을 확정한다.",
      "기온·바람·구름·강수 자료도 읽는다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        1,
        4
      ]
    },
    "bookResponseForm": "multi",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w039",
      "no": 39
    },
    "explanation": "상대적인 기압 분포와 다른 기상 요소를 연결해 일반 경향을 설명해요. 매 순간의 비나 기압을 한 조건으로 확정하지 않아요.",
    "misconception": "한 주장만 맞는다고 모두 고르기를 끝내지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b040",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T17",
      "format": "서술형",
      "level": "영재",
      "track": "영재성",
      "standard": "6과06-03",
      "topic": "기압 차와 바람 그림",
      "concept": "상대 기압 분포와 날씨",
      "inquirySkill": "관찰 위치/자료/장치 설계"
    },
    "prompt": "같은 높이의 가상 두 지역 P1016hPa, Q1007hPa를 그리고 지표 부근 단순 모형의 이동 방향을 화살표로 나타내세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "예시: P1016hPa→Q1007hPa. 화살표는 지표 부근 공기의 이동 방향. 실제 바람의 모든 경로를 뜻하지 않음.",
      "rubric": {
        "required": [
          "지역·값/단위·P→Q·화살표 의미·모형 범위."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "draw",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w040",
      "no": 40
    },
    "explanation": "기압은 P가 더 높아요. 초등 단순 모형의 지표 부근 방향은 P→Q이며 실제 바람의 길과 구별해요.",
    "misconception": "이름표·방향의 뜻·자료 조건을 그림에 함께 나타내요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b041",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T18",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "낮 해풍 모형",
      "concept": "해륙풍 모형과 실제 흐름",
      "inquirySkill": "조건 적용"
    },
    "prompt": "바닷가 낮의 모형에서 육지 지표 부근이 상대 저기압, 바다가 상대 고기압이에요. 지표 부근 바람 방향은?",
    "givens": null,
    "choices": [
      "바다에서 육지로",
      "육지에서 바다로",
      "육지에서 하늘로만",
      "바다에서 하늘로만",
      "지표에는 바람이 없음"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "bookResponseForm": "choice",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w041",
      "no": 41
    },
    "explanation": "제시 모형에서 지표 부근 공기는 바다 고기압 쪽에서 육지 저기압 쪽으로 이동해요. 모든 실제 낮의 풍향을 확정한 것은 아니에요.",
    "misconception": "위로 오르는 흐름과 지표 부근 수평 방향을 나눠요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b042",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T18",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "밤 육풍 모형",
      "concept": "해륙풍 모형과 실제 흐름",
      "inquirySkill": "개념/용어 구별"
    },
    "prompt": "밤의 모형에서 지표 부근 기압이 육지 쪽에서 더 높다면 바람은 [ ]에서 [ ]로 불어요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "육지, 바다",
      "accepted": [
        "육지, 바다"
      ]
    },
    "bookResponseForm": "blank",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w042",
      "no": 42
    },
    "explanation": "지표 부근의 높은 기압인 육지에서 낮은 기압인 바다로 이동하는 육풍 모형이에요.",
    "misconception": "기체 수증기·물방울과 서로 다른 기상 요소를 구별해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b043",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T18",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "가열·냉각과 방향",
      "concept": "해륙풍 모형과 실제 흐름",
      "inquirySkill": "특성/관계 연결"
    },
    "prompt": "주변의 다른 바람을 단순화한 해륙풍 모형이에요. 보기: ㄱ 해풍 / ㄴ 육풍",
    "givens": {
      "문항": [
        "(1) 낮, 바다→육지 [ ]",
        "(2) 밤, 육지→바다 [ ]"
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "(1) ㄱ (2) ㄴ",
      "accepted": [
        "(1) ㄱ (2) ㄴ",
        "ㄱ ㄴ"
      ]
    },
    "bookResponseForm": "match",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w043",
      "no": 43
    },
    "explanation": "모형에서 낮에는 육지가 더 빨리 데워지고 밤에는 더 빨리 식는 온도 차와 지표 부근 기압 차를 연결해요. 실제 관측의 바람은 다른 요인도 받아요.",
    "misconception": "각 설명의 순서와 기호를 함께 적어요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b044",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T18",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "모형 온도 변화",
      "concept": "해륙풍 모형과 실제 흐름",
      "inquirySkill": "단위/시각·자료 해석"
    },
    "prompt": "가상 비교: 같은 시간 동안 모래20→29℃, 물20→24℃예요. 모래의 온도는 몇 ℃ 높아졌나요?",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "9℃",
      "accepted": [
        "9℃",
        "9°C"
      ]
    },
    "bookResponseForm": "short",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w044",
      "no": 44
    },
    "explanation": "모래의 처음20℃와 나중29℃를 비교하므로29-20=9℃예요. 물의 변화4℃와 섞지 않아요.",
    "misconception": "자료의 지역·시각·단위를 먼저 확인해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b045",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T18",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "모형과 실제 해륙풍",
      "concept": "해륙풍 모형과 실제 흐름",
      "inquirySkill": "주장과 근거 비교"
    },
    "prompt": "바닷가 바람을 설명하는 방법을 모두 고르세요.",
    "givens": null,
    "choices": [
      "모래/물의 온도 변화와 관측 조건을 본다.",
      "지표 부근 기압과 흐름 자료를 연결한다.",
      "실제 바람에는 다른 기압 분포도 본다.",
      "모래가 따뜻하면 풍향 측정은 생략한다.",
      "매일 같은 시각에 반드시 바람이 바뀐다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        1,
        2
      ]
    },
    "bookResponseForm": "multi",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w045",
      "no": 45
    },
    "explanation": "모형의 온도 차와 실제 기압/흐름을 연결해요. 실제 바람에는 큰 규모의 기압 분포·지형 등도 작용하므로 단정하지 않아요.",
    "misconception": "한 주장만 맞는다고 모두 고르기를 끝내지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b046",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T18",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "모형 온도와 바람",
      "concept": "해륙풍 모형과 실제 흐름",
      "inquirySkill": "근거·한계 설명/실제 소통"
    },
    "prompt": "모래가 물보다 더 빨리 데워졌다는 온도 자료만 있어요. 실제 바닷가에서 그날 해풍이 불었다고 기록할 수 없는 까닭은?",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "쟁반의 온도 비교는 가열 모형 자료이다. 실제 바닷가의 시각·기압·풍향/풍속을 관측한 것이 아니므로 실제 해풍의 발생으로 기록하지 않는다.",
      "rubric": {
        "required": [
          "모형/현장 구별·온도/실제 흐름 구별·필요한 현장 자료."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "written",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w046",
      "no": 46
    },
    "explanation": "모형의 온도 변화와 실제 장소의 공기 이동은 확인한 대상과 범위가 달라요.",
    "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b047",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T19",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "관측과 예보",
      "concept": "생활 자료·조사/제작·실제 소통",
      "inquirySkill": "조건 적용"
    },
    "prompt": "오늘14시 관측과 내일14시 예보를 비교하는 방법은?",
    "givens": null,
    "choices": [
      "두 값 모두 이미 관측한 결과로 읽는다.",
      "두 값 모두 실제 학생의 수행으로 읽는다.",
      "날짜를 빼고 높은 숫자만 골라 읽는다.",
      "대상 시각과 자료 종류를 나눠 읽는다.",
      "기온 값만 보고 다른 요소를 지워 읽는다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "bookResponseForm": "choice",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w047",
      "no": 47
    },
    "explanation": "관측은 실제 확인한 때의 자료이고 예보는 미래 날씨의 예상이에요. 날짜·발표/유효 시각·지역과 요소를 함께 봐요.",
    "misconception": "미래 예보를 이미 관측한 사실로 바꾸지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b048",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T19",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "자료의 시각",
      "concept": "생활 자료·조사/제작·실제 소통",
      "inquirySkill": "개념/용어 구별"
    },
    "prompt": "예보를 읽을 때는 발표한 시각과 예보가 가리키는 [ ] 시각을 구별해요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "대상",
      "accepted": [
        "대상",
        "유효",
        "예보 대상"
      ]
    },
    "bookResponseForm": "blank",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w048",
      "no": 48
    },
    "explanation": "자료를 발표한 때와 예보의 대상이 되는 때는 다를 수 있어요. 날짜와 지역도 함께 확인해요.",
    "misconception": "기체 수증기·물방울과 서로 다른 기상 요소를 구별해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b049",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T19",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "소통 상태",
      "concept": "생활 자료·조사/제작·실제 소통",
      "inquirySkill": "특성/관계 연결"
    },
    "prompt": "보기: ㄱ 자료 제작 / ㄴ 실제 전달 / ㄷ 의견 미수신",
    "givens": {
      "문항": [
        "(1) 설명 카드 파일을 저장했다. [ ]",
        "(2) 학급에서 실제로 보여 주며 설명했다. [ ]",
        "(3) 설명했지만 질문이나 의견을 아직 받지 못했다. [ ]"
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "(1) ㄱ (2) ㄴ (3) ㄷ",
      "accepted": [
        "(1) ㄱ (2) ㄴ (3) ㄷ",
        "ㄱ ㄴ ㄷ"
      ]
    },
    "bookResponseForm": "match",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w049",
      "no": 49
    },
    "explanation": "파일을 만들고 저장한 일·실제 설명한 일·받은 의견 유무는 다른 상태예요. 예상 질문을 받은 질문으로 쓰지 않아요.",
    "misconception": "각 설명의 순서와 기호를 함께 적어요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b050",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T19",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "자료의 성격",
      "concept": "생활 자료·조사/제작·실제 소통",
      "inquirySkill": "단위/시각·자료 해석"
    },
    "prompt": "실험을 하지 않고 문제 풀이용으로 만든 온도 표에는 실제 측정값 대신 어떤 표시를 해야 할까요?",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "가상 자료",
      "accepted": [
        "가상 자료",
        "가상 값",
        "가상 학습표",
        "학습용 예시"
      ]
    },
    "bookResponseForm": "short",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w050",
      "no": 50
    },
    "explanation": "가상 자료/학습용 예시라고 밝혀야 실제 관측이나 학생 수행 자료와 혼동하지 않아요.",
    "misconception": "자료의 지역·시각·단위를 먼저 확인해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b051",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T19",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "날씨와 생활 판단",
      "concept": "생활 자료·조사/제작·실제 소통",
      "inquirySkill": "주장과 근거 비교"
    },
    "prompt": "학교 야외 활동 자료를 만들 때 적절한 것을 모두 고르세요.",
    "givens": null,
    "choices": [
      "같은 지역·대상 시각의 최신 안내를 확인한다.",
      "기상 요소와 활동 장소 조건을 함께 본다.",
      "계획과 실제 실행 여부를 구별한다.",
      "옛 사진 하나로 내일 활동을 확정한다.",
      "기온 하나로 개인의 질병을 판정한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        1,
        2
      ]
    },
    "bookResponseForm": "multi",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w051",
      "no": 51
    },
    "explanation": "날씨 자료는 생활 계획에 쓰되 최신 학교/공공 안내와 실제 장소를 확인해요. 개인 건강 진단이나 실제 실행 결과를 대신하지 않아요.",
    "misconception": "한 주장만 맞는다고 모두 고르기를 끝내지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b052",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T19",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "받은 의견 반영",
      "concept": "생활 자료·조사/제작·실제 소통",
      "inquirySkill": "근거·한계 설명/실제 소통"
    },
    "prompt": "설명 카드에 내일 예보를 오늘 관측이라고 썼다는 의견을 실제로 받았어요. 무엇을 수정하고 무엇을 기록해야 할까요?",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "날짜·지역·발표/대상 시각과 예보 표시를 고친다. 받은 의견·수정 버전/날짜·실제 재전달했는지 또는 아직 계획인지 기록한다.",
      "rubric": {
        "required": [
          "자료 종류 수정·받은 의견 근거·버전/실제 재전달과 계획 구별."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "written",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w052",
      "no": 52
    },
    "explanation": "틀린 자료 종류를 바로잡고 실제로 한 수정과 재전달을 남겨야 소통의 근거를 확인할 수 있어요.",
    "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b053",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T12",
      "format": "단답형",
      "level": "심화",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "기온의 변화",
      "concept": "기상 요소·관측과 자료",
      "inquirySkill": "단위/시각·자료 해석"
    },
    "prompt": "가상 학교 자료:09시16℃,12시22℃,15시20℃.09→12시 기온 변화량은 몇 ℃인가요?",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "6℃",
      "accepted": [
        "6℃",
        "6°C"
      ]
    },
    "bookResponseForm": "short",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w053",
      "no": 53
    },
    "explanation": "같은 학교의 두 시각16℃와22℃를 비교해22-16=6℃ 높아졌어요. 하루 최고 기온을 확정하는 자료는 아니에요.",
    "misconception": "자료의 지역·시각·단위를 먼저 확인해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b054",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T12",
      "format": "선택형",
      "level": "심화",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "관측 간격",
      "concept": "기상 요소·관측과 자료",
      "inquirySkill": "조건 적용"
    },
    "prompt": "가상 표의09·12·15시 자료만 보고 할 수 있는 설명은?",
    "givens": {
      "자료": [
        "가상 자료:09시16℃ /12시22℃ /15시20℃"
      ]
    },
    "choices": [
      "하루 전체에서12시가 반드시 최고다.",
      "세 시각 사이의 기온은 모두 같다.",
      "세 시각 중12시 기온이 가장 높다.",
      "다른 지역도 같은 기온이었다.",
      "다음 날도 같은 값이 나타난다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "bookResponseForm": "choice",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w054",
      "no": 54
    },
    "explanation": "주어진 세 시각의 비교는 가능하지만 사이 시간·하루 전체·다른 지역/날짜의 값은 없어요.",
    "misconception": "띄엄띄엄 잰 자료를 하루 전체의 연속 관측으로 바꾸지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b055",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T12",
      "format": "서술형",
      "level": "심화",
      "track": "영재성",
      "standard": "6과06-01",
      "topic": "기온 자료 그래프",
      "concept": "기상 요소·관측과 자료",
      "inquirySkill": "관찰 위치/자료/장치 설계"
    },
    "prompt": "가상 학교 자료09시16℃·12시22℃·15시20℃를 그래프로 나타내세요. 가로축/세로축의 이름과 단위를 쓰고 측정하지 않은 시간의 한계를 덧붙이세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "예시: 가로축 시각, 세로축 기온(℃).(09,16),(12,22),(15,20)에 점. 점을 이으면 사이가 실제 측정값이 아니라는 표시.",
      "rubric": {
        "required": [
          "축/단위·세 점·간격·미측정 시각과 선의 의미."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "draw",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w055",
      "no": 55
    },
    "explanation": "축의 뜻·단위·세 점이 자료와 맞아야 해요. 점 사이를 이은 선은 실제 연속 측정 증거가 아니에요.",
    "misconception": "이름표·방향의 뜻·자료 조건을 그림에 함께 나타내요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b056",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T12",
      "format": "서술형",
      "level": "심화",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "결측 자료",
      "concept": "기상 요소·관측과 자료",
      "inquirySkill": "근거·한계 설명/실제 소통"
    },
    "prompt": "가상 표에서12시 기온을 재지 못했어요.09시16℃와15시20℃ 사이니까18℃로 채워도 될까요?",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "실제로 재지 않았으므로12시는 미측정으로 둔다.18℃는 추정/예시로 따로 표시할 수 있지만 관측값으로 채우지 않는다.",
      "rubric": {
        "required": [
          "미측정 보존·추정과 관측 구별·실제 기록 수정 금지."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "written",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w056",
      "no": 56
    },
    "explanation": "측정하지 않은 값은 앞뒤 평균으로 실제 관측값을 만들지 않아요.",
    "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b057",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T13",
      "format": "단답형",
      "level": "심화",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "습도 자료 읽기",
      "concept": "습도와 조건/양 구별",
      "inquirySkill": "단위/시각·자료 해석"
    },
    "prompt": "가상 표: 같은 기온의 A습도52%, B습도77%, C습도64%. 습도가 가장 높은 곳의 기호는?",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "B",
      "accepted": [
        "B",
        "b"
      ]
    },
    "bookResponseForm": "short",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w057",
      "no": 57
    },
    "explanation": "77%가52%와64%보다 높아요. 이 결과만으로 기온·수증기 질량·강수 발생을 확정하지 않아요.",
    "misconception": "자료의 지역·시각·단위를 먼저 확인해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b058",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T13",
      "format": "선택형",
      "level": "심화",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "습도와 구름의 양",
      "concept": "습도와 조건/양 구별",
      "inquirySkill": "조건 적용"
    },
    "prompt": "가상 자료 A습도80%·구름 적음, B습도60%·구름 많음이에요. 알맞은 설명은?",
    "givens": null,
    "choices": [
      "습도80%는 하늘80%가 구름이라는 뜻이다.",
      "습도와 구름의 양은 서로 다른 기상 요소다.",
      "습도가 높은 곳은 항상 구름도 더 많다.",
      "구름이 많으면 습도는 반드시100%이다.",
      "구름의 양은 습도계 눈금으로만 읽는다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "bookResponseForm": "choice",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w058",
      "no": 58
    },
    "explanation": "습도는 공기의 습한 정도, 구름의 양은 하늘을 덮은 정도예요. 서로 바꾸어 읽지 않아요.",
    "misconception": "서로 다른 기상 요소의 수치를 같은 뜻으로 읽지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b059",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T17",
      "format": "단답형",
      "level": "심화",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "모형 기압의 비교",
      "concept": "상대 기압 분포와 날씨",
      "inquirySkill": "단위/시각·자료 해석"
    },
    "prompt": "같은 높이 가상 표:A1009hPa·B1002hPa·C1015hPa. 기압이 가장 낮은 곳의 기호는?",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "B",
      "accepted": [
        "B",
        "b"
      ]
    },
    "bookResponseForm": "short",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w059",
      "no": 59
    },
    "explanation": "세 값 중1002hPa가 가장 낮으므로 B예요. 고/저는 비교 범위의 값으로 설명해요.",
    "misconception": "자료의 지역·시각·단위를 먼저 확인해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b060",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T17",
      "format": "서술형",
      "level": "심화",
      "track": "영재성",
      "standard": "6과06-03",
      "topic": "기압 분포 표현",
      "concept": "상대 기압 분포와 날씨",
      "inquirySkill": "관찰 위치/자료/장치 설계"
    },
    "prompt": "같은 높이 가상 자료 A1015hPa·B1003hPa·C1011hPa를 세 칸에 쓰고, B와 비교한 지표 부근 단순 모형의 이동 방향을 나타내세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "예시:A→B, C→B. A/C값이 B보다 높다. 지표 부근의 단순 모형이며 실제 먼 거리 바람 길을 뜻하지 않음.",
      "rubric": {
        "required": [
          "세 값/단위·두 방향·지표 부근 단순 모형 표시."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "draw",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w060",
      "no": 60
    },
    "explanation": "A와 C가 B보다 높으므로 각각 B쪽 방향을 표시해요. 숫자 없는 온도/공기 밀도 그림으로 대신하지 않아요.",
    "misconception": "이름표·방향의 뜻·자료 조건을 그림에 함께 나타내요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b061",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T17",
      "format": "선택형",
      "level": "심화",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "고/저의 일반 경향",
      "concept": "상대 기압 분포와 날씨",
      "inquirySkill": "조건 적용"
    },
    "prompt": "가상 자료에서 주변보다 고기압인 A에 짧은 비가 관측됐어요. 어떻게 설명하나요?",
    "givens": null,
    "choices": [
      "고기압이므로 실제 비 기록을 지운다.",
      "비가 왔으므로 기압 값도 낮게 고친다.",
      "고기압이라는 말은 항상 비를 뜻한다.",
      "관측한 강수량을 모두0으로 바꾼다.",
      "기압의 경향과 실제 비를 함께 남긴다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "bookResponseForm": "choice",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w061",
      "no": 61
    },
    "explanation": "고기압은 대체로 맑은 경향으로 설명하지만 모든 곳/순간의 비를 금지하는 규칙이 아니에요. 실제 자료를 지우거나 바꾸지 않아요.",
    "misconception": "일반 경향에 맞추려고 처음 기록을 고치지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b062",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T18",
      "format": "단답형",
      "level": "심화",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "가열 모형의 차이",
      "concept": "해륙풍 모형과 실제 흐름",
      "inquirySkill": "단위/시각·자료 해석"
    },
    "prompt": "가상 모형: 같은 시간에 모래21→31℃, 물21→25℃. 두 재료의 온도 상승량은 몇 ℃ 차이인가요?",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "6℃",
      "accepted": [
        "6℃",
        "6°C"
      ]
    },
    "bookResponseForm": "short",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w062",
      "no": 62
    },
    "explanation": "모래 상승10℃, 물 상승4℃이므로 상승량 차이는6℃예요. 실제 바닷가의 풍속을 잰 값은 아니에요.",
    "misconception": "자료의 지역·시각·단위를 먼저 확인해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b063",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T18",
      "format": "서술형",
      "level": "심화",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "처음 조건이 다른 모형",
      "concept": "해륙풍 모형과 실제 흐름",
      "inquirySkill": "근거·한계 설명/실제 소통"
    },
    "prompt": "가상 비교에서 모래는 햇빛에서, 물은 그늘에서 관찰했어요. 모래/물의 재료 차이 때문이라고 바로 말할 수 있나요?",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "빛 조건도 달라 재료 하나의 영향으로 확정할 수 없다. 정한 동일한 빛/시각·양/용기·감지 조건을 확인해 다시 비교한다.",
      "rubric": {
        "required": [
          "혼입 조건·단일 원인 확정 불가·공정 비교 계획."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "written",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w063",
      "no": 63
    },
    "explanation": "재료와 빛이 동시에 달라졌으므로 온도 차이의 한 원인만 골라 말할 수 없어요.",
    "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b064",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T12",
      "format": "선택형",
      "level": "심화",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "바람의 실제 기록",
      "concept": "기상 요소·관측과 자료",
      "inquirySkill": "주장과 근거 비교"
    },
    "prompt": "실제 관측 기록으로 필요한 것을 모두 고르세요.",
    "givens": null,
    "choices": [
      "정한 방위와 관측 시각",
      "풍향을 불어오는 쪽으로 적음",
      "바람이 약해 안 보이면 불분명 표시",
      "AI풍향계 사진에서 실제 방향을 읽음",
      "정한 단위와 기구 사용 조건"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        1,
        2,
        4
      ]
    },
    "bookResponseForm": "multi",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w064",
      "no": 64
    },
    "explanation": "실제 기구의 방위·시각·단위·동작을 확인하고 불분명함도 보존해요. 방위/시각 없는 AI이미지는 관측값이 아니에요.",
    "misconception": "한 주장만 맞는다고 모두 고르기를 끝내지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b065",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T19",
      "format": "선택형",
      "level": "심화",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "예보의 유효 시각",
      "concept": "생활 자료·조사/제작·실제 소통",
      "inquirySkill": "조건 적용"
    },
    "prompt": "가상 예보가10월18일17시에 발표됐고 대상은10월19일09시예요. 이 예보의 대상 시각은?",
    "givens": null,
    "choices": [
      "10월19일09시",
      "10월18일17시",
      "10월18일09시",
      "10월19일17시",
      "10월20일09시"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "bookResponseForm": "choice",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w065",
      "no": 65
    },
    "explanation": "발표 때와 대상 때는 달라요. 이 예보는 다음 날09시 날씨를 예상한 자료예요.",
    "misconception": "발표 시각을 예보 대상 시각으로 바꾸지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b066",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T12",
      "format": "서술형",
      "level": "심화",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "한 번의 관찰과 규칙성",
      "concept": "기상 요소·관측과 자료",
      "inquirySkill": "근거·한계 설명/실제 소통"
    },
    "prompt": "하루만 학교12시 기온이09시보다 높았어요. 매일 반드시 높다고 발표하려는 친구에게 필요한 추가 자료와 한계를 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "여러 날짜의 같은 시각·관측 조건을 모아 비교한다. 하루 결과로 모든 날의 변화나 원인을 확정하지 않는다.",
      "rubric": {
        "required": [
          "여러 날짜/조건·하루 자료의 한계·인과/절대화 금지."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "written",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w066",
      "no": 66
    },
    "explanation": "규칙성은 여러 자료에서 살펴요. 반복해도 모든 날의 법칙이나 단독 원인이 자동 증명되는 것은 아니에요.",
    "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b067",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T19",
      "format": "서술형",
      "level": "심화",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "학교 안내의 범위",
      "concept": "생활 자료·조사/제작·실제 소통",
      "inquirySkill": "근거·한계 설명/실제 소통"
    },
    "prompt": "내일 강수 예보가 있다는 이유로 어떤 친구가 아플 것이라고 설명 카드에 썼어요. 고칠 점을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "예보는 날씨에 관한 예상이며 개인의 질병을 판정할 자료가 아니다. 학교의 최신 활동 안내와 관측/예보 시각을 확인해 계획 정보로 고친다.",
      "rubric": {
        "required": [
          "개인 진단 근거 부족·날씨 계획 정보/최신 안내·대상 시각."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "written",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w067",
      "no": 67
    },
    "explanation": "날씨가 생활에 영향을 준다는 점과 개인의 건강 상태를 진단하는 것은 달라요.",
    "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b068",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T12",
      "format": "단답형",
      "level": "심화",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "강수량의 시간 구간",
      "concept": "기상 요소·관측과 자료",
      "inquirySkill": "단위/시각·자료 해석"
    },
    "prompt": "가상 표:09~10시2mm,10~11시0mm,11~12시4mm. 겹치지 않는 세 시간 구간의 강수량 합은 몇 mm인가요?",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "6mm",
      "accepted": [
        "6mm",
        "6 mm"
      ]
    },
    "bookResponseForm": "short",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w068",
      "no": 68
    },
    "explanation": "2+0+4=6mm예요. 각 구간의 양이므로 더할 수 있어요. 누적값을 다시 더한 것이 아니에요.",
    "misconception": "자료의 지역·시각·단위를 먼저 확인해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b069",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T14",
      "format": "단답형",
      "level": "심화",
      "track": "교과",
      "standard": "6과06-02",
      "topic": "이슬 비교 절차",
      "concept": "이슬·응결과 공정 비교",
      "inquirySkill": "관측 절차 설계"
    },
    "prompt": "교사가 준비한 두 컵의 외벽 비교 순서를 배열하세요.",
    "givens": {
      "자료": [
        "ㄱ 같은 시각 외벽을 관찰·기록한다.",
        "ㄴ 처음 외벽을 닦고 조건/새는 곳을 확인한다.",
        "ㄷ 기록한 물방울과 다른 원인을 비교해 해석한다."
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ→ㄱ→ㄷ",
      "accepted": [
        "ㄴ→ㄱ→ㄷ"
      ]
    },
    "bookResponseForm": "order",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w069",
      "no": 69
    },
    "explanation": "처음 조건 확인 뒤 실제 관찰을 기록하고 그 근거로 원인을 해석해요. 기대한 해석을 관찰값 대신 쓰지 않아요.",
    "misconception": "계획과 실제 관측·자료 해석의 순서를 구별해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b070",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T14",
      "format": "서술형",
      "level": "심화",
      "track": "교과",
      "standard": "6과06-02",
      "topic": "비교 조건 계획",
      "concept": "이슬·응결과 공정 비교",
      "inquirySkill": "근거·한계 설명/실제 소통"
    },
    "prompt": "이슬 컵 비교에서 바꾸려는 조건 하나와 같게 살필 조건 두 가지 이상을 적으세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "바꾸려는 조건: 컵 속 물을 차갑게 하는 조건. 같게 살필 조건: 컵의 모양/재질·물의 양·놓인 곳·관찰 시각, 처음 외벽의 물기/새는 곳.",
      "rubric": {
        "required": [
          "바꿀 조건1·같게 살필 조건2이상·준비/안전·실제 실행과 계획 구별."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "written",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w070",
      "no": 70
    },
    "explanation": "공정한 비교는 주요 조건 하나를 바꾸고 나머지를 정해 관찰해요. 안전한 물/기구 준비는 교사가 맡아요.",
    "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b071",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T14",
      "format": "서술형",
      "level": "심화",
      "track": "영재성",
      "standard": "6과06-02",
      "topic": "관찰 위치 그림",
      "concept": "이슬·응결과 공정 비교",
      "inquirySkill": "관찰 위치/자료/장치 설계"
    },
    "prompt": "이슬 비교 장치를 그리세요. 컵 안/밖을 나누고 관찰할 위치, 실제 관찰/아직 계획 표시를 넣으세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "예시: 두 컵 안 물, 외벽 표면을 별도 표시. 기록할 시각·새는 물 점검 칸과 계획 표시. 관찰 전 물방울을 실제 결과처럼 채우지 않음.",
      "rubric": {
        "required": [
          "안/밖·대상 위치·조건/시각·실제/계획 구별."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "draw",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w071",
      "no": 71
    },
    "explanation": "장치 계획은 관찰 위치를 정하기 위한 그림이에요. 물방울 발생 여부는 실제로 본 뒤 기록해요.",
    "misconception": "이름표·방향의 뜻·자료 조건을 그림에 함께 나타내요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b072",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T15",
      "format": "서술형",
      "level": "심화",
      "track": "교과",
      "standard": "6과06-02",
      "topic": "안개 시범 안전",
      "concept": "안개 모형·관찰 위치와 한계",
      "inquirySkill": "근거·한계 설명/실제 소통"
    },
    "prompt": "안개 모형을 보기 위해 향을 피우거나 뜨거운 물을 학생이 직접 붓자는 제안 대신 어떻게 관찰을 준비할까요?",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "향/불꽃·학생 직접 가열을 하지 않는다. 교사가 안전한 온도와 냉각 주머니를 준비하고 벽면 물방울/공기 중 흐림을 나누어 관찰한다. 불분명하면 그대로 기록한다.",
      "rubric": {
        "required": [
          "향/가열 배제·교사 준비·관찰 위치와 불분명 보존."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "written",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w072",
      "no": 72
    },
    "explanation": "위험한 절차를 따라 결과를 만들 필요가 없어요. 교사 준비/시범이나 제공 자료 해석으로 바꾸고 참여 방법을 밝힐 수 있어요.",
    "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b073",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T12",
      "format": "단답형",
      "level": "심화",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "기상 관측 계획",
      "concept": "기상 요소·관측과 자료",
      "inquirySkill": "관측 절차 설계"
    },
    "prompt": "같은 장소에서 기상 요소의 변화를 비교하는 순서를 배열하세요.",
    "givens": {
      "자료": [
        "ㄱ 정한 시각마다 값·단위·주변 조건을 남긴다.",
        "ㄴ 지역/위치·도구·시각 간격·안전을 정한다.",
        "ㄷ 처음 기록을 보존하고 변화/한계를 설명한다."
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ→ㄱ→ㄷ",
      "accepted": [
        "ㄴ→ㄱ→ㄷ"
      ]
    },
    "bookResponseForm": "order",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w073",
      "no": 73
    },
    "explanation": "관측 조건과 안전을 정한 뒤 실제 값을 남기고 자료에서 경향을 찾아요. 빠진 시간은 미측정으로 보존해요.",
    "misconception": "계획과 실제 관측·자료 해석의 순서를 구별해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b074",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T12",
      "format": "서술형",
      "level": "심화",
      "track": "영재성",
      "standard": "6과06-01",
      "topic": "관측 기록표 설계",
      "concept": "기상 요소·관측과 자료",
      "inquirySkill": "관찰 위치/자료/장치 설계"
    },
    "prompt": "기온·습도·구름의 양을 실제 관측할 빈 표를 만드세요. 날짜/시각·위치/도구·단위·미측정 이유를 포함하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "예시: 날짜/시각 | 위치/도구/노출 | 기온℃ | 습도% | 구름의 양/시야 | 미측정/이유. 빈 관측행3개 이상.",
      "rubric": {
        "required": [
          "요소3개·단위·시각/위치·3개빈행·미측정/이유."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "draw",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w074",
      "no": 74
    },
    "explanation": "읽는 사람이 언제 어디서 무엇을 어떻게 확인했는지 알 수 있는 구조여야 해요.",
    "misconception": "이름표·방향의 뜻·자료 조건을 그림에 함께 나타내요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b075",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T18",
      "format": "서술형",
      "level": "심화",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "해륙풍 모형 보완",
      "concept": "해륙풍 모형과 실제 흐름",
      "inquirySkill": "근거·한계 설명/실제 소통"
    },
    "prompt": "모래/물의 온도는 쟀지만 공기 흐름은 보지 못했어요. 처음 기록과 결론, 다음 계획을 어떻게 쓰나요?",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "온도 변화는 남기고 공기 흐름은 미관찰로 둔다. 바람 발생을 직접 확인했다고 쓰지 않으며 기압/흐름 확인 방법을 교사와 정해 재관찰한다.",
      "rubric": {
        "required": [
          "온도/흐름 구별·미관찰 보존·추가 확인/교사와 안전."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "written",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w075",
      "no": 75
    },
    "explanation": "온도 자료만으로 실제 바람 발생 검증을 대신하지 않아요. 도움이나 다른 자료를 사용하면 그 방법과 출처도 밝혀요.",
    "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b076",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T18",
      "format": "선택형",
      "level": "심화",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "공정한 가열/냉각 비교",
      "concept": "해륙풍 모형과 실제 흐름",
      "inquirySkill": "주장과 근거 비교"
    },
    "prompt": "모래/물 비교의 조건으로 확인할 것을 모두 고르세요.",
    "givens": null,
    "choices": [
      "용기 크기·재료 양과 두께",
      "온도 감지 부분의 깊이/위치",
      "빛·받침·주위와 같은 시점",
      "한쪽만 드라이기로 직접 가열",
      "처음 온도와 반복/미측정"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        1,
        2,
        4
      ]
    },
    "bookResponseForm": "multi",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w076",
      "no": 76
    },
    "explanation": "비교 조건을 정하고 실제 다른 조건은 함께 기록해요. 학생이 한쪽에만 드라이기를 쓰면 위험과 혼입 조건이 생겨요.",
    "misconception": "한 주장만 맞는다고 모두 고르기를 끝내지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b077",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T19",
      "format": "서술형",
      "level": "심화",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "자료 조사 출처",
      "concept": "생활 자료·조사/제작·실제 소통",
      "inquirySkill": "근거·한계 설명/실제 소통"
    },
    "prompt": "기상 요소가 학교 활동에 주는 영향을 조사했어요. 제목만 적는 대신 어떤 본문 근거와 확인 범위를 기록해야 하나요?",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "기관/자료 제목·쪽이나 주소·확인 날짜·대상 지역/시각·본문에서 확인한 영향/조건·내 제안과 미확인을 구별한다.",
      "rubric": {
        "required": [
          "출처 식별·본문 확인 내용/조건·확인 범위·제안과 사실 구별."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "written",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w077",
      "no": 77
    },
    "explanation": "제목이나 검색 요약만으로 본문 전체를 읽었다고 하지 않아요. 실제 확인한 문장/표의 범위를 남겨요.",
    "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b078",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T19",
      "format": "서술형",
      "level": "심화",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "설명 자료 제작과 소통",
      "concept": "생활 자료·조사/제작·실제 소통",
      "inquirySkill": "근거·한계 설명/실제 소통"
    },
    "prompt": "설명 카드를 만들었지만 아직 보여 주지 못했어요. 실제 수행과 다음 계획을 나누어 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "자료 제작/파일 버전은 실제 한 일로 남긴다. 실제 전달/받은 의견은 아직 없음으로 두고 전달 대상 범위·방법/예정 시각을 계획으로 적는다.",
      "rubric": {
        "required": [
          "제작 근거·미전달/미수신·다음 계획을 구별."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "written",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w078",
      "no": 78
    },
    "explanation": "제작 완료와 실제 전달은 달라요. 하지 않은 설명이나 예상 질문을 수행 기록으로 채우지 않아요.",
    "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b079",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T12",
      "format": "서술형",
      "level": "심화",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "강수 미측정 기록",
      "concept": "기상 요소·관측과 자료",
      "inquirySkill": "근거·한계 설명/실제 소통"
    },
    "prompt": "관측 기구를 읽지 못한 시간에 비가 안 온 것 같다며0mm로 썼어요. 어떻게 고칠까요?",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "읽지 못했으므로 미측정과 이유를 남긴다. 실제로 관측해0mm인 때와 구별하며 다른 자료를 쓰면 그 지역/시각·출처와 사용 범위를 따로 표시한다.",
      "rubric": {
        "required": [
          "0/미측정 구별·수정 이력·대체 자료 출처/범위."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "written",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w079",
      "no": 79
    },
    "explanation": "0은 측정한 수치이고 미측정은 값이 없는 상태예요. 느낌으로 실제 관측값을 채우지 않아요.",
    "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b080",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T19",
      "format": "서술형",
      "level": "심화",
      "track": "영재성",
      "standard": "6과06-01",
      "topic": "날씨 설명 카드 설계",
      "concept": "생활 자료·조사/제작·실제 소통",
      "inquirySkill": "관찰 위치/자료/장치 설계"
    },
    "prompt": "학교 날씨 설명 카드의 빈 틀을 만드세요. 관측/예보·출처/시각·활동 제안·실제 전달/의견을 나누어 이름표를 붙이세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "예시: 관측/예보 구분 칸, 지역/발표·대상 시각과 출처, 활동 제안과 조건, 실제 전달 날짜/의견·미수신/수정 칸.",
      "rubric": {
        "required": [
          "네 영역·자료 시각/출처·제안/실행·의견/계획 구별."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "draw",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w080",
      "no": 80
    },
    "explanation": "자료와 제안·실제 수행을 구별하는 구조로 설계해요. 실제 하지 않은 설명과 의견은 계획 또는 미실행/미수신으로 남겨요.",
    "misconception": "이름표·방향의 뜻·자료 조건을 그림에 함께 나타내요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b081",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "기상 요소 정리",
      "concept": "기상 요소·관측과 자료",
      "inquirySkill": "특성/관계 연결"
    },
    "prompt": "보기: ㄱ 기온 / ㄴ 습도 / ㄷ 구름의 양 / ㄹ 강수량",
    "givens": {
      "문항": [
        "(1) 공기의 따뜻하고 차가운 정도 [ ]",
        "(2) 공기의 습한 정도 [ ]",
        "(3) 하늘을 덮은 구름의 정도 [ ]",
        "(4) 내린 비·눈 등의 양을 물의 깊이로 나타낸 값 [ ]"
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "(1) ㄱ (2) ㄴ (3) ㄷ (4) ㄹ",
      "accepted": [
        "(1) ㄱ (2) ㄴ (3) ㄷ (4) ㄹ",
        "ㄱ ㄴ ㄷ ㄹ"
      ]
    },
    "bookResponseForm": "match",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w081",
      "no": 81
    },
    "explanation": "서로 다른 기상 요소의 뜻과 관측 대상을 나누어야 날씨를 구체적으로 표현할 수 있어요.",
    "misconception": "각 설명의 순서와 기호를 함께 적어요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b082",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T14",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-02",
      "topic": "응결과 위치 정리",
      "concept": "이슬·응결과 공정 비교",
      "inquirySkill": "개념/용어 구별"
    },
    "prompt": "기체 수증기가 액체 물방울로 바뀌는 것은 [ ]이며, 이슬은 표면에 [ ] 있어요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "응결, 맺혀",
      "accepted": [
        "응결, 맺혀",
        "응결, 맺혀 있다"
      ]
    },
    "bookResponseForm": "blank",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w082",
      "no": 82
    },
    "explanation": "상태 변화와 관찰 위치를 연결해요. 물방울이 공기 중에 떠 있는 안개와 구별해요.",
    "misconception": "기체 수증기·물방울과 서로 다른 기상 요소를 구별해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b083",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T17",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "기압 분포 정리",
      "concept": "상대 기압 분포와 날씨",
      "inquirySkill": "단위/시각·자료 해석"
    },
    "prompt": "같은 높이 가상 자료 P1010hPa·Q1001hPa예요. 지표 부근 단순 모형에서 공기 이동 방향을 P/Q로 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "P→Q",
      "accepted": [
        "P→Q",
        "p→q"
      ]
    },
    "bookResponseForm": "short",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w083",
      "no": 83
    },
    "explanation": "1010hPa가1001hPa보다 높으므로 P→Q예요. 실제 먼 거리 바람의 곡선 경로 전체를 뜻하지 않아요.",
    "misconception": "자료의 지역·시각·단위를 먼저 확인해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b084",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T19",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "자료와 실제 수행 정리",
      "concept": "생활 자료·조사/제작·실제 소통",
      "inquirySkill": "근거·한계 설명/실제 소통"
    },
    "prompt": "날씨 문제를 모두 맞혔지만 직접 관측/설명을 하지 않았어요. 무엇을 확인했고 무엇이 아직 필요한지 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "학습 문항의 개념/자료 해석을 확인했다. 실제 관측·기록·자료 제작/전달·받은 의견과 실제 활동 결과는 아직 확인하지 않았다.",
      "rubric": {
        "required": [
          "문항/실제 수행 구별·아직 필요한 근거·성적/효과 자동 확정 금지."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "written",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w084",
      "no": 84
    },
    "explanation": "문제 풀이와 실제 수행은 필요한 근거가 달라요. 정답 개수로 하지 않은 활동을 완료했다고 쓰지 않아요.",
    "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b085",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T12",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "평가·기상 요소",
      "concept": "기상 요소·관측과 자료",
      "inquirySkill": "조건 적용"
    },
    "prompt": "관측 항목과 단위가 바르게 짝지어진 것은?",
    "givens": null,
    "choices": [
      "기온 - mm",
      "풍속 - ℃",
      "강수량 - m/s",
      "습도 - %",
      "풍향 - g"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "bookResponseForm": "choice",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w085",
      "no": 85
    },
    "explanation": "습도는%로 나타내요. 기온℃·강수량mm·풍속m/s·풍향의 방위 이름과 구별해요.",
    "misconception": "각 요소의 단위를 서로 바꾸지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b086",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "평가·풍향",
      "concept": "기상 요소·관측과 자료",
      "inquirySkill": "개념/용어 구별"
    },
    "prompt": "서쪽에서 동쪽으로 불어오는 바람의 풍향은 [ ]이에요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "서풍",
      "accepted": [
        "서풍"
      ]
    },
    "bookResponseForm": "blank",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w086",
      "no": 86
    },
    "explanation": "불어오는 서쪽으로 이름 붙여 서풍이에요. 향하는 쪽인 동쪽으로 부르지 않아요.",
    "misconception": "기체 수증기·물방울과 서로 다른 기상 요소를 구별해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b087",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T12",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "평가·기온 변화",
      "concept": "기상 요소·관측과 자료",
      "inquirySkill": "단위/시각·자료 해석"
    },
    "prompt": "가상 자료:08시13℃,11시19℃,14시21℃.08→14시 기온 변화량은 몇 ℃인가요?",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "8℃",
      "accepted": [
        "8℃",
        "8°C"
      ]
    },
    "bookResponseForm": "short",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w087",
      "no": 87
    },
    "explanation": "21-13=8℃ 높아졌어요. 중간11시 값을 빼거나 가장 큰 값 자체를 변화량으로 쓰지 않아요.",
    "misconception": "자료의 지역·시각·단위를 먼저 확인해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b088",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T12",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "평가·관측 신뢰",
      "concept": "기상 요소·관측과 자료",
      "inquirySkill": "근거·한계 설명/실제 소통"
    },
    "prompt": "한 친구가 기온이 예상보다 낮다며 값을 높게 바꾸었어요. 관측 자료를 어떻게 다뤄야 할까요?",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "원래 값과 조건을 보존한다. 감지 부분/안정된 표시·빛/주위를 점검해 실제 재측정하고 두 기록과 점검 내용을 함께 남긴다.",
      "rubric": {
        "required": [
          "처음 기록 보존·도구/주위 점검·실제 재측정/미측정 구별."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "written",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w088",
      "no": 88
    },
    "explanation": "예상과 다르다고 값을 바꾸지 않아요. 오류 점검과 실제 다시 잰 값을 별도 기록해요.",
    "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b089",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "평가·습도",
      "concept": "습도와 조건/양 구별",
      "inquirySkill": "조건 적용"
    },
    "prompt": "가상 자료: 기온23℃·습도58%·강수량2mm. 습한 정도를 나타낸 값은?",
    "givens": null,
    "choices": [
      "23℃",
      "2mm",
      "58%",
      "23%",
      "58mm"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "bookResponseForm": "choice",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w089",
      "no": 89
    },
    "explanation": "항목 이름과 단위를 연결하면 습도58%예요. 다른 항목이나 단위로 읽지 않아요.",
    "misconception": "숫자 크기와 관계없이 항목·단위를 먼저 봐요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b090",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "평가·습도 해석",
      "concept": "습도와 조건/양 구별",
      "inquirySkill": "주장과 근거 비교"
    },
    "prompt": "다음 설명 중 타당한 것을 모두 고르세요.",
    "givens": null,
    "choices": [
      "습도는 공기의 습한 정도다.",
      "기온이 달라도 같은%면 수증기 질량이 같다.",
      "습도와 강수량은 다른 기상 요소다.",
      "습도70%면 수증기70g이 들어 있다.",
      "습도 자료의 지역/시각을 확인한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        2,
        4
      ]
    },
    "bookResponseForm": "multi",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w090",
      "no": 90
    },
    "explanation": "습도의 뜻과 자료 조건은 확인할 수 있어요. 같은%와 수증기 질량의 같음 또는 특정 질량은 다른 조건 없이 확정하지 못해요.",
    "misconception": "한 주장만 맞는다고 모두 고르기를 끝내지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b091",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T16",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-02",
      "topic": "평가·물 상태",
      "concept": "이슬·안개·구름 관찰 비교",
      "inquirySkill": "특성/관계 연결"
    },
    "prompt": "보기: ㄱ 수증기 / ㄴ 액체 물방울 / ㄷ 얼음 알갱이",
    "givens": {
      "문항": [
        "(1) 눈에 보이지 않는 기체 상태의 물 [ ]",
        "(2) 차가운 컵 외벽에 맺힌 작은 액체 [ ]",
        "(3) 일부 구름을 이루는 작은 고체 [ ]"
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "(1) ㄱ (2) ㄴ (3) ㄷ",
      "accepted": [
        "(1) ㄱ (2) ㄴ (3) ㄷ",
        "ㄱ ㄴ ㄷ"
      ]
    },
    "bookResponseForm": "match",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w091",
      "no": 91
    },
    "explanation": "기체/액체/고체를 구분해요. 흰 안개나 구름 전체를 기체 수증기라고 부르지 않아요.",
    "misconception": "각 설명의 순서와 기호를 함께 적어요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b092",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T14",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-02",
      "topic": "평가·이슬 실험",
      "concept": "이슬·응결과 공정 비교",
      "inquirySkill": "근거·한계 설명/실제 소통"
    },
    "prompt": "차가운 컵에 물을 붓다가 외벽에 튀었어요. 그 물방울을 곧바로 응결의 증거로 쓸 수 없는 까닭과 보완을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "튀어 묻은 물일 수 있어 공기 중 수증기 응결의 증거로 바로 쓰지 않는다. 외벽을 닦고 새는 곳/튀는 물을 점검하며 같은 시각 다시 관찰한다.",
      "rubric": {
        "required": [
          "다른 원인·초기 외벽/누수/시각·실제 재관찰."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "written",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w092",
      "no": 92
    },
    "explanation": "물방울이 있다는 관찰과 그 원인이 응결이라는 해석 사이에 다른 물의 경로를 점검해야 해요.",
    "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b093",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T15",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-02",
      "topic": "평가·안개의 위치",
      "concept": "안개 모형·관찰 위치와 한계",
      "inquirySkill": "조건 적용"
    },
    "prompt": "안개에 대한 설명으로 알맞은 것은?",
    "givens": null,
    "choices": [
      "지표 가까운 공기 중에서 수증기가 눈에 보인다.",
      "지표 가까운 공기 중에 작은 물방울이 떠 있다.",
      "물체 표면에 맺힌 물방울만을 안개라고 부른다.",
      "높은 공중의 모든 얼음 알갱이만을 안개라 한다.",
      "풀잎에 남은 비의 물방울만을 안개라고 부른다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "bookResponseForm": "choice",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w093",
      "no": 93
    },
    "explanation": "안개는 지표 가까운 공기 중 떠 있는 작은 물방울로 설명해요. 보이지 않는 수증기·표면 물방울과 나누어요.",
    "misconception": "기체 수증기와 공기 중 작은 물방울을 섞지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b094",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T14",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-02",
      "topic": "평가·공통점",
      "concept": "이슬·응결과 공정 비교",
      "inquirySkill": "개념/용어 구별"
    },
    "prompt": "이슬과 물방울로 된 안개를 이루는 작은 물의 상태는 모두 [ ]예요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "액체",
      "accepted": [
        "액체"
      ]
    },
    "bookResponseForm": "blank",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w094",
      "no": 94
    },
    "explanation": "물방울은 액체예요. 공통 상태가 같아도 표면에 맺힘/공기 중 떠 있음은 달라요.",
    "misconception": "기체 수증기·물방울과 서로 다른 기상 요소를 구별해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b095",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T16",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-02",
      "topic": "평가·구름 관찰",
      "concept": "이슬·안개·구름 관찰 비교",
      "inquirySkill": "주장과 근거 비교"
    },
    "prompt": "구름 관찰의 방법으로 알맞은 것을 모두 고르세요.",
    "givens": null,
    "choices": [
      "정한 시각·방향/하늘 시야를 기록한다.",
      "햇빛을 직접 보며 구름을 센다.",
      "모양과 하늘을 덮은 정도를 구별한다.",
      "사진만으로 내일 정확한 비의 양을 정한다.",
      "가상 설명 사진이면 그 표시를 남긴다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        2,
        4
      ]
    },
    "bookResponseForm": "multi",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w095",
      "no": 95
    },
    "explanation": "시각·시야와 구름의 모양/양을 나누어 남겨요. 태양을 직접 보지 않으며 한 사진으로 미래 강수량을 확정하지 않아요.",
    "misconception": "한 주장만 맞는다고 모두 고르기를 끝내지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b096",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T16",
      "format": "서술형",
      "level": "영재",
      "track": "영재성",
      "standard": "6과06-02",
      "topic": "평가·이슬 안개 구름",
      "concept": "이슬·안개·구름 관찰 비교",
      "inquirySkill": "관찰 위치/자료/장치 설계"
    },
    "prompt": "이슬·안개·구름의 관찰 위치를 간단한 그림과 이름표로 비교하세요. 공통점과 차이를 각각 한 가지 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "예시: 풀 표면의 이슬, 지표 가까이 떠 있는 안개, 높은 공중 구름. 물방울이 관련된다는 공통점, 맺힘/떠 있음·높이의 차이. 구름에는 얼음 알갱이도 가능.",
      "rubric": {
        "required": [
          "세 위치 이름표·공통점/차이·수증기/물방울 구별."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "draw",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w096",
      "no": 96
    },
    "explanation": "그림의 미술 실력보다 위치·상태와 설명이 과학적으로 맞는지 확인해요.",
    "misconception": "이름표·방향의 뜻·자료 조건을 그림에 함께 나타내요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b097",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T17",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "평가·상대 기압",
      "concept": "상대 기압 분포와 날씨",
      "inquirySkill": "조건 적용"
    },
    "prompt": "같은 높이 가상 관측:P1000hPa, Q1008hPa. 두 곳 중 기압이 상대적으로 높은 곳은?",
    "givens": null,
    "choices": [
      "P",
      "둘 다 반드시 저기압",
      "온도 없으면 비교 불가",
      "1013미만이므로 같음",
      "Q"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "bookResponseForm": "choice",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w097",
      "no": 97
    },
    "explanation": "1008hPa가1000hPa보다 높으므로 Q예요. 두 값이 모두1013보다 작아도 서로 비교할 수 있어요.",
    "misconception": "고정 경계로 상대적인 비교를 지우지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b098",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T17",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "평가·기압 차",
      "concept": "상대 기압 분포와 날씨",
      "inquirySkill": "단위/시각·자료 해석"
    },
    "prompt": "같은 높이 가상 관측:P1019hPa·Q1006hPa. 두 값의 차는 몇 hPa인가요?",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "13hPa",
      "accepted": [
        "13hPa",
        "13 hpa"
      ]
    },
    "bookResponseForm": "short",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w098",
      "no": 98
    },
    "explanation": "1019-1006=13hPa예요. 이것은 기압 차이지 바람의 실제 빠르기가 아니에요.",
    "misconception": "자료의 지역·시각·단위를 먼저 확인해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b099",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T17",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "평가·바람 모형",
      "concept": "상대 기압 분포와 날씨",
      "inquirySkill": "개념/용어 구별"
    },
    "prompt": "지표 부근 단순 모형에서 공기는 기압이 높은 곳에서 [ ] 곳으로 이동해요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "낮은",
      "accepted": [
        "낮은",
        "낮은 곳"
      ]
    },
    "bookResponseForm": "blank",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w099",
      "no": 99
    },
    "explanation": "기압 차이에 따른 이동 방향을 설명하는 모형이에요. 기온 하나로 지표 기압을 정한 것이 아니에요.",
    "misconception": "기체 수증기·물방울과 서로 다른 기상 요소를 구별해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b100",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T17",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "평가·온도와 기압",
      "concept": "상대 기압 분포와 날씨",
      "inquirySkill": "근거·한계 설명/실제 소통"
    },
    "prompt": "A기온30℃, B기온20℃만 제시됐어요. A가 반드시 저기압이라고 할 수 없는 까닭과 추가 자료를 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "기온 하나로 실제 지표 기압의 높고 낮음을 확정하지 못한다. 같은 높이/기준의 실제 기압과 주변 분포·관측 시각을 확인한다.",
      "rubric": {
        "required": [
          "기온만으로 확정 불가·실제 기압/높이·분포/시각."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "written",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w100",
      "no": 100
    },
    "explanation": "공기의 온도/밀도 모형과 실제 지표 기압은 같지 않아요. 관측 기압으로 주변과 비교해요.",
    "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b101",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T18",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "평가·해풍 모형",
      "concept": "해륙풍 모형과 실제 흐름",
      "inquirySkill": "조건 적용"
    },
    "prompt": "낮 해륙풍 모형에서 지표 부근 기압이 육지보다 바다에서 높아요. 모형의 바람 방향은?",
    "givens": null,
    "choices": [
      "바다→육지",
      "육지→바다",
      "육지에서 위쪽으로만",
      "바다에서 위쪽으로만",
      "기압 차이가 있어도 이동 없음"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "bookResponseForm": "choice",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w101",
      "no": 101
    },
    "explanation": "지표 부근 공기는 높은 쪽인 바다에서 낮은 쪽인 육지로 이동하는 모형이에요.",
    "misconception": "해풍/육풍을 장소 이름만 외우지 않고 기압 자료와 연결해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b102",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T18",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "평가·낮 밤 모형",
      "concept": "해륙풍 모형과 실제 흐름",
      "inquirySkill": "특성/관계 연결"
    },
    "prompt": "보기: ㄱ 바다→육지 / ㄴ 육지→바다. 다른 큰 바람은 단순화해요.",
    "givens": {
      "문항": [
        "(1) 낮, 지표 부근 육지가 상대 저기압 [ ]",
        "(2) 밤, 지표 부근 육지가 상대 고기압 [ ]"
      ]
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "(1) ㄱ (2) ㄴ",
      "accepted": [
        "(1) ㄱ (2) ㄴ",
        "ㄱ ㄴ"
      ]
    },
    "bookResponseForm": "match",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w102",
      "no": 102
    },
    "explanation": "지표 부근 높은 쪽에서 낮은 쪽으로의 방향을 적용해요. 실제 모든 날의 풍향 전환 시간표는 아니에요.",
    "misconception": "각 설명의 순서와 기호를 함께 적어요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b103",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T18",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "평가·모형 온도",
      "concept": "해륙풍 모형과 실제 흐름",
      "inquirySkill": "단위/시각·자료 해석"
    },
    "prompt": "가상 비교: 모래18→27℃, 물18→22℃. 두 재료의 온도 상승량 차는 몇 ℃인가요?",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "5℃",
      "accepted": [
        "5℃",
        "5°C"
      ]
    },
    "bookResponseForm": "short",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w103",
      "no": 103
    },
    "explanation": "모래9℃, 물4℃ 상승이므로 차이는5℃예요. 실제 바람 속도/기압을 계산한 수치가 아니에요.",
    "misconception": "자료의 지역·시각·단위를 먼저 확인해요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b104",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T18",
      "format": "서술형",
      "level": "영재",
      "track": "영재성",
      "standard": "6과06-03",
      "topic": "평가·해륙풍 모형 설계",
      "concept": "해륙풍 모형과 실제 흐름",
      "inquirySkill": "관찰 위치/자료/장치 설계"
    },
    "prompt": "모래/물의 온도 변화와 공기 흐름을 따로 확인할 계획을 그리세요. 감지 위치·같게 할 조건·미관찰 칸·교사 준비를 포함하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "예시: 같은 쟁반/정한 양, 고정한 두 감지 부분, 같은 빛·처음 값/시점 표. 흐름 관찰 위치/방법을 교사와 정하고 온도와 별도 기록. 불분명/미실행 칸. 학생 직접 가열/향 없음.",
      "rubric": {
        "required": [
          "장치·같게 할 조건·온도/흐름 별도·미관찰·교사 안전."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "draw",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w104",
      "no": 104
    },
    "explanation": "모래/물의 온도 비교와 바람 발생 모형은 연결하지만 같은 측정이 아니에요. 온도만으로 흐름 결과를 채우지 않아요.",
    "misconception": "이름표·방향의 뜻·자료 조건을 그림에 함께 나타내요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b105",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T19",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "평가·예보 자료",
      "concept": "생활 자료·조사/제작·실제 소통",
      "inquirySkill": "조건 적용"
    },
    "prompt": "10월20일06시 발표한 학교 지역10월20일15시 예보를 올바르게 사용하는 방법은?",
    "givens": null,
    "choices": [
      "06시 실제 관측값으로 소개한다.",
      "모든 지역의15시 확정값으로 소개한다.",
      "우리 반 실제 활동 결과로 기록한다.",
      "그 지역15시 대상의 예보로 밝힌다.",
      "지난날의 관측 기록으로 바꾸어 쓴다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "bookResponseForm": "choice",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w105",
      "no": 105
    },
    "explanation": "지역·발표 시각·대상 시각과 예보라는 성격을 밝혀야 해요. 실제 관측이나 학생 수행으로 바꾸지 않아요.",
    "misconception": "현재 발표한 자료라도 미래 대상이면 예보예요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b106",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T19",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "평가·실제 소통",
      "concept": "생활 자료·조사/제작·실제 소통",
      "inquirySkill": "주장과 근거 비교"
    },
    "prompt": "실제 소통과 수정의 근거로 남길 것을 모두 고르세요.",
    "givens": null,
    "choices": [
      "실제 설명한 날짜·대상 범위/방법",
      "예상 질문을 실제 받은 질문으로 적음",
      "실제로 받은 의견 또는 미수신",
      "자료 수정 버전과 실제 재전달/계획",
      "누군가 봤을 것이라고 완료 처리"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        2,
        3
      ]
    },
    "bookResponseForm": "multi",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w106",
      "no": 106
    },
    "explanation": "실제 전달/받은 의견·수정 버전·재전달 여부는 각각 확인해요. 실제로 받지 못한 의견은 미수신이에요.",
    "misconception": "한 주장만 맞는다고 모두 고르기를 끝내지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b107",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T19",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "평가·관측과 예보 비교",
      "concept": "생활 자료·조사/제작·실제 소통",
      "inquirySkill": "근거·한계 설명/실제 소통"
    },
    "prompt": "가상 예보에는15시 비, 실제15시 관측에는 강수 없음이 기록됐어요. 두 자료를 어떻게 보존하고 설명하나요?",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "예보와 실제 관측을 각각 날짜/지역/발표·대상/관측 시각과 함께 보존한다. 차이가 있음을 설명하고 예보를 실제값에 맞춰 몰래 고치거나 관측을 지우지 않는다.",
      "rubric": {
        "required": [
          "두 자료 보존·시각/지역·예상/관측 차이·수정 이력/미확인."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "written",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w107",
      "no": 107
    },
    "explanation": "예보와 관측의 차이는 살펴볼 자료예요. 발표 시점·유효 시각·지역이 맞는지 확인한 뒤 한계와 추가 확인을 남겨요.",
    "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b108",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T19",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "평가·생활 제안과 근거",
      "concept": "생활 자료·조사/제작·실제 소통",
      "inquirySkill": "근거·한계 설명/실제 소통"
    },
    "prompt": "학교 날씨 안내 카드에 날씨 자료·활동 제안·실제 실행 결과를 나누어 적어야 하는 까닭을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "날씨 자료는 관측/예보, 제안은 계획, 실행 결과는 실제로 한 일의 근거가 필요하다. 서로 바꾸어 쓰면 하지 않은 활동이나 확인 못한 효과를 실제처럼 보게 된다.",
      "rubric": {
        "required": [
          "관측/예보·계획·실행 구별·필요한 실제 근거·효과 자동 확정 금지."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "written",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w108",
      "no": 108
    },
    "explanation": "자료의 성격을 나누면 날씨가 생활에 미치는 영향을 구체적으로 설명하면서 실제 수행 범위를 지킬 수 있어요.",
    "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b109",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T15",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-02",
      "topic": "보완·보이는 물",
      "concept": "안개 모형·관찰 위치와 한계",
      "inquirySkill": "조건 적용"
    },
    "prompt": "친구가 안개의 하얀 부분을 눈에 보이는 수증기라고 설명했어요. 고친 설명은?",
    "givens": null,
    "choices": [
      "기체 수증기가 흰색으로 바뀌어 보인다.",
      "액체 물방울은 모두 표면에만 맺힌다.",
      "작은 액체 물방울이 공기 중 떠 있다.",
      "기체 수증기는 물과 다른 물질이다.",
      "안개가 보이면 공기에는 물이 없다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "bookResponseForm": "choice",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w109",
      "no": 109
    },
    "explanation": "안개의 보이는 흐림은 작은 물방울이고 수증기는 기체 상태로 눈에 보이지 않아요.",
    "misconception": "물질은 물이지만 상태와 위치가 달라요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b110",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T17",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "보완·기압 절대화",
      "concept": "상대 기압 분포와 날씨",
      "inquirySkill": "근거·한계 설명/실제 소통"
    },
    "prompt": "1013hPa보다 낮으면 주변과 관계없이 모두 같은 저기압이라고 생각했어요. 두 곳1004/1010hPa를 이용해 고쳐 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "두 값 중1010hPa가1004hPa보다 높다. 고/저는 주어진 주변과 비교하며1013hPa를 모든 상황의 고정 경계로 쓰지 않는다.",
      "rubric": {
        "required": [
          "1010>1004·주변과 비교·고정 경계 오개념 수정."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "written",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w110",
      "no": 110
    },
    "explanation": "기준 숫자를 외워 분포를 지우지 않고 실제 주변 값과 비교해요.",
    "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b111",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T18",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-03",
      "topic": "보완·모형과 실제",
      "concept": "해륙풍 모형과 실제 흐름",
      "inquirySkill": "근거·한계 설명/실제 소통"
    },
    "prompt": "낮에는 모든 바닷가에서 반드시 해풍이라고 썼어요. 모형과 실제 자료를 나누어 고쳐 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "해륙풍 모형에서는 육지/바다 온도 차이와 지표 부근 기압 차로 낮 해풍을 설명한다. 실제 바람에는 큰 기압 분포/지형 등이 작용하므로 그날 시각·지역의 풍향 자료를 확인해야 한다.",
      "rubric": {
        "required": [
          "모형 조건·실제 다른 요인/관측·항상/반드시 수정."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "written",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w111",
      "no": 111
    },
    "explanation": "단순 모형은 한 관계를 이해하도록 돕지만 모든 실제 조건을 포함하지 않아요.",
    "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  },
  {
    "id": "c22-s52-u03-b112",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T19",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과06-01",
      "topic": "보완·실제 기록",
      "concept": "생활 자료·조사/제작·실제 소통",
      "inquirySkill": "근거·한계 설명/실제 소통"
    },
    "prompt": "사진과 문제 정답만으로 실제 관측·발표를 완료했다고 표시했어요. 기록을 어떻게 바로잡고 이어갈지 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "설명 사진/문제 풀이로 확인한 학습만 남기고 실제 관측·전달은 미실행으로 고친다. 실제 수행 날짜·처음 기록·받은 의견/미수신을 남길 계획을 세운다.",
      "rubric": {
        "required": [
          "학습/실제 수행 구별·미실행 수정·실제 기록/의견 계획."
        ],
        "pass": "교사 확인 · 동등 표현/타당한 대안 인정",
        "note": "실제 수행/공식 성적은 별도 확인"
      }
    },
    "bookResponseForm": "written",
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w112",
      "no": 112
    },
    "explanation": "설명 자료와 정답은 실제 수행 증거가 아니에요. 잘못 표시한 이력을 보존하고 실제 한 범위를 분명히 해요.",
    "misconception": "확인한 범위보다 넓은 결론을 쓰지 않아요.",
    "evidence": {
      "checkedBy": "현행 범위·교재/자체 조건·응답 대조",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부6과06·이론612/실험3C/6B·2009지도자료·MetOffice 본문",
      "note": "독립 창작. 가상 값/AI 설명 이미지는 실제 관측/학생 수행 아님."
    }
  }
];
export {weatherBankPaperHtml as bankPaper,wireWeatherBankPaper as wireBankPaper} from '../../v2/weather-bank-paper.js';
export {weatherWorkbookPaperHtml as workbookPaper,wireWeatherWorkbookPaper as wireWorkbookPaper} from '../../v2/weather-workbook-paper.js';
