export const similar = [
  {
    "id": "c22-s42-u04-v001",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 14,
        "originalSet": 1,
        "course": "초등 6-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E5",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과16-03"
    },
    "prompt": "전시관이 필요한 밝기를 지키면서 조명 낭비를 줄이려 합니다. 세 제안 중 목표에 맞지 않는 것을 골라 기호를 쓰세요.",
    "givens": {
      "연계 범위": "옛 에너지/날씨의 대응 관련 발췌입니다. 현행 기후변화 전체 원문 시험지가 아니며 날씨 한 사건으로 기후변화의 원인을 확정하지 않아요.",
      "연습 제안": "ㄱ. 문을 닫은 전시 구역의 조명을 확인해 끈다.\nㄴ. 관람객이 없는 구역도 밤새 모두 밝게 켠다.\nㄷ. 활동 구역과 시간에 맞게 조명을 나누어 쓴다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "필요하지 않은 구역도 밤새 밝게 켜면 낭비를 줄이는 목표에 맞지 않는다. 필요한 밝기와 안전은 유지한다.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    },
    "curriculumScope": "related-excerpt"
  },
  {
    "id": "c22-s42-u04-v002",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 1,
        "no": 15,
        "originalSet": 1,
        "course": "초등 6-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E5",
      "type": "T13",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과16-03"
    },
    "prompt": "생활 속 에너지 대응을 조사한 글입니다. 자료의 범위를 벗어나 모든 경우를 단정한 문장을 골라 기호를 쓰세요.",
    "givens": {
      "연계 범위": "옛 에너지/날씨의 대응 관련 발췌입니다. 현행 기후변화 전체 원문 시험지가 아니며 날씨 한 사건으로 기후변화의 원인을 확정하지 않아요.",
      "연습 글": "ㄱ. 어떤 에너지 이용도 자원이나 환경과 전혀 관련이 없다.\nㄴ. 불필요한 사용을 줄이는 방법을 조건과 함께 조사한다.\nㄷ. 한 행동의 기록과 기후 전체 변화 측정을 구별한다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ"
      ]
    },
    "explanation": "어떤 에너지 이용도 자원/환경과 전혀 관련이 없다는 일반화는 타당하지 않다. 사용 조건과 확인한 범위를 살피며 대응 방법을 조사한다.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    },
    "curriculumScope": "related-excerpt"
  },
  {
    "id": "c22-s42-u04-v003",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 2,
        "no": 15,
        "originalSet": 2,
        "course": "초등 6-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E5",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과16-03"
    },
    "prompt": "연습 자료에서 같은 밝기·같은 사용 시간의 조명 A가 B보다 전기를 적게 썼습니다. 이 자료에 맞는 설명을 고르세요.",
    "givens": {
      "연계 범위": "옛 에너지/날씨의 대응 관련 발췌입니다. 현행 기후변화 전체 원문 시험지가 아니며 날씨 한 사건으로 기후변화의 원인을 확정하지 않아요.",
      "자료 성격": "실제 제품 측정이 아닌 비교 연습. A6Wh, B10Wh. 필요한 밝기와 시간은 같음."
    },
    "choices": [
      "A는 같은 밝기·시간에 전기를 덜 썼다.",
      "A는 전기를 전혀 사용하지 않았다.",
      "B는 모든 환경 영향을 없애 주었다.",
      "A로 바꾸면 내일 날씨가 확정된다.",
      "다른 밝기·시간에서도 차이가 같다."
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "같은 밝기와 시간이라는 비교 조건에서 A의 전기 사용이 더 적었다. 무사용·모든 환경 영향·다른 조건/특정 날씨로 확대하지 않는다.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    },
    "curriculumScope": "related-excerpt"
  },
  {
    "id": "c22-s42-u04-v004",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 19,
        "originalSet": 3,
        "course": "초등 6-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E5",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과16-03"
    },
    "prompt": "학교 행사에서 불필요한 에너지 사용을 줄이기로 했습니다. 목표에 맞지 않는 행동을 고르세요.",
    "givens": {
      "연계 범위": "옛 에너지/날씨의 대응 관련 발췌입니다. 현행 기후변화 전체 원문 시험지가 아니며 날씨 한 사건으로 기후변화의 원인을 확정하지 않아요."
    },
    "choices": [
      "사용하지 않는 방의 조명을 확인해 끈다.",
      "필요한 밝기를 먼저 교사와 확인한다.",
      "아무도 없는 복도를 밤새 밝게 켠다.",
      "운영 시간과 실제 사용 상태를 기록한다.",
      "안전한 범위에서 담당 역할을 나눈다."
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "아무도 없는 복도를 필요 없이 밤새 밝게 켜는 것은 낭비를 줄이는 목표에 맞지 않는다. 필요한 밝기·안전과 실제 사용은 확인한다.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    },
    "curriculumScope": "related-excerpt"
  },
  {
    "id": "c22-s42-u04-v005",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 3,
        "no": 20,
        "originalSet": 3,
        "course": "초등 6-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E5",
      "type": "T13",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과16-03"
    },
    "prompt": "재사용 물건을 빌려 쓰는 행사와 함께 조명 사용도 살피려 합니다. 실천 계획으로 구체적인 것을 고르세요.",
    "givens": {
      "연계 범위": "옛 에너지/날씨의 대응 관련 발췌입니다. 현행 기후변화 전체 원문 시험지가 아니며 날씨 한 사건으로 기후변화의 원인을 확정하지 않아요."
    },
    "choices": [
      "실행하지 않고 모두 성공으로 발표한다.",
      "사용 시간과 상태를 조사하지 않는다.",
      "필요한 구역도 무조건 어둡게 만든다.",
      "실명과 연락처를 보고서에 공개한다.",
      "구역·시간·역할·확인 기준을 정한다."
    ],
    "visualModel": null,
    "variantRules": null,
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "필요한 밝기와 안전을 지키며 구역·시간·역할·확인 방법을 정하고 실제 실행/미실행을 따로 남긴다.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    },
    "curriculumScope": "related-excerpt"
  },
  {
    "id": "c22-s42-u04-v006",
    "status": "authored",
    "sourceRef": {
      "type": "similar",
      "of": {
        "set": 4,
        "no": 14,
        "originalSet": 2,
        "course": "초등 5-2"
      }
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E5",
      "type": "T14",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과16-03"
    },
    "prompt": "큰비 안내가 나온 뒤 세 모둠이 현장 활동을 제안했습니다. 안전한 참여에 맞지 않는 제안을 골라 기호를 쓰세요.",
    "givens": {
      "연계 범위": "옛 에너지/날씨의 대응 관련 발췌입니다. 현행 기후변화 전체 원문 시험지가 아니며 날씨 한 사건으로 기후변화의 원인을 확정하지 않아요.",
      "연습 제안": "ㄱ. 현장에 나가지 않고 출처 있는 피해 자료를 조사한다.\nㄴ. 교사 안내를 확인하고 실내 활동으로 방법을 바꾼다.\nㄷ. 기록을 채우려고 잠긴 길에 혼자 들어가 깊이를 잰다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ"
      ]
    },
    "explanation": "기록을 채우려고 침수된 길에 들어가는 것은 안전하지 않다. 교사·보호자의 안내와 자료 참여를 이용하며 미실행도 사실대로 남긴다.",
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    },
    "curriculumScope": "related-excerpt"
  }
];
