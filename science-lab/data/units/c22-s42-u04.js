// 기후변화 · 연계 발췌6/짝6/현행 보충108. 전체 원문/수업교재는 별도 검수.
export const unit = {
  "id": "c22-s42-u04",
  "course": "4-2",
  "no": 4,
  "title": "기후변화와 우리 생활",
  "domain": "환경",
  "sources": {
    "bank": [
      "data/units/c22-s42-u04.source.js"
    ],
    "guidance": "현행 전체 원문 시험지 미확보. 옛단원 연계 발췌6·짝6·현행 독립108이며 원문요건 전체 충족으로 세지 않는다."
  }
};
export const items = [
  {
    "id": "c22-s42-u04-b01",
    "status": "authored",
    "prompt": "기상청 제공 자료에서 2024년 전국 연평균기온과 평년값을 비교한 설명을 고르세요.",
    "givens": {
      "자료 성격": "기상청 2025-01-09 발표의 2024년 전국 연평균기온 자료. 평년 기간은1991~2020년. 현재의 최신 순위라는 뜻이 아닙니다.",
      "전국 연평균기온": "2024년14.5℃ / 평년12.5℃",
      "출처": "기상청 · 2024년 연 기후특성"
    },
    "choices": [
      "평년보다 높다.",
      "평년보다 낮다.",
      "두 값이 같다.",
      "어느 지역도 덥지 않았다.",
      "다음 해 값도 같다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "같은 전국 연평균기온의14.5℃가12.5℃보다 높다. 모든 지역·날짜나 다음 해의 값을 뜻하지 않는다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E1",
      "type": "T01",
      "standard": "4과16-01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "평년과 기후변화 사례",
      "concept": "평년과 기후변화 사례",
      "inquirySkill": "평년과 기후변화 사례"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b02",
    "status": "authored",
    "prompt": "이 기상청 연평균기온 자료에서 더 확인해야 하는 내용은 무엇인가요?",
    "givens": {
      "자료 성격": "기상청 2025-01-09 발표의 2024년 전국 연평균기온 자료. 평년 기간은1991~2020년. 현재의 최신 순위라는 뜻이 아닙니다.",
      "전국 연평균기온": "2024년14.5℃ / 평년12.5℃",
      "출처": "기상청 · 2024년 연 기후특성"
    },
    "choices": [
      "2024년 전국 연평균기온",
      "우리 학교의 특정 날 최고기온",
      "비교에 쓴 전국 평년값",
      "자료를 발표한 기관 이름",
      "자료에서 사용한 기온 단위"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "전국 연평균 자료에는 학교의 개별 날짜 최고기온이 제시되지 않았다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E1",
      "type": "T01",
      "standard": "4과16-01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "평년과 기후변화 사례",
      "concept": "평년과 기후변화 사례",
      "inquirySkill": "평년과 기후변화 사례"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b03",
    "status": "authored",
    "prompt": "기상청 자료의 기온 차이가 알려 주는 범위를 바르게 짚은 문장을 고르세요.",
    "givens": {
      "자료 성격": "기상청 2025-01-09 발표의 2024년 전국 연평균기온 자료. 평년 기간은1991~2020년. 현재의 최신 순위라는 뜻이 아닙니다.",
      "전국 연평균기온": "2024년14.5℃ / 평년12.5℃",
      "출처": "기상청 · 2024년 연 기후특성"
    },
    "choices": [
      "우리 동네 매일의 값이 같다.",
      "전국 강수량 차이를 측정했다.",
      "전국 연평균 두 값을 비교했다.",
      "모든 바다 높이가 같아졌다.",
      "한 사람의 체감만 비교했다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "연평균기온의 같은 지표를 비교했으며 매일의 기온이나 강수량·해수면 자료가 아니다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E1",
      "type": "T01",
      "standard": "4과16-01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "평년과 기후변화 사례",
      "concept": "평년과 기후변화 사례",
      "inquirySkill": "평년과 기후변화 사례"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b04",
    "status": "authored",
    "prompt": "연습 표를 비교하기 전에 확인할 조건 두 가지를 고르세요.",
    "givens": {
      "자료 성격": "표를 읽는 연습. 실측 수치는 제시하지 않음."
    },
    "choices": [
      "같은 지역의 같은 기간인가?",
      "표의 글자색이 내 취향인가?",
      "수치가 내 예상과 같은가?",
      "기온·강수량의 단위가 같은가?"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    },
    "explanation": "지역·기간·요소·단위를 맞춰 비교해야 하며 글자색과 예상 일치는 비교 조건이 아니다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E1",
      "type": "T01",
      "standard": "4과16-01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "평년과 기후변화 사례",
      "concept": "평년과 기후변화 사례",
      "inquirySkill": "평년과 기후변화 사례"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b05",
    "status": "authored",
    "prompt": "한 지역의 여러 해 같은 기간을 기준으로 만든 비교값을 무엇이라고 하는지 쓰세요. 보기: 평년값, 순간값",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "평년값",
      "accepted": [
        "평년값"
      ]
    },
    "explanation": "자료의 대상 지역·기간을 확인한 평년값과 현재 사례를 비교한다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E1",
      "type": "T01",
      "standard": "4과16-01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "평년과 기후변화 사례",
      "concept": "평년과 기후변화 사례",
      "inquirySkill": "평년과 기후변화 사례"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b06",
    "status": "authored",
    "prompt": "연습 자료에서 A마을의 올해7월 기온과 B마을의 평년1월 기온을 비교했습니다. 바로 결론을 내리기 어려운 이유와 고칠 방법을 설명하세요.",
    "givens": {
      "자료 성격": "지역 이름과 비교 상황은 연습용"
    },
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "지역과 계절이 달라 같은 비교가 아니에요. A마을의7월 자료와 A마을의 같은 기간 평년값을 같은 요소·단위로 비교하고 자료 출처를 밝혀요.",
      "rubric": {
        "required": [
          "지역·기간 차이",
          "같은 기준의 자료",
          "출처/범위"
        ],
        "pass": "실제 근거·조건·한계를 선생님과 확인해요."
      }
    },
    "explanation": "지역과 계절이 달라 같은 비교가 아니에요. A마을의7월 자료와 A마을의 같은 기간 평년값을 같은 요소·단위로 비교하고 자료 출처를 밝혀요.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E1",
      "type": "T01",
      "standard": "4과16-01",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "평년과 기후변화 사례",
      "concept": "평년과 기후변화 사례",
      "inquirySkill": "평년과 기후변화 사례"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b07",
    "status": "authored",
    "prompt": "“활동을 위한 가상 기록”이라고 쓴 표를 보고서에 이용할 때 알맞은 표현은 무엇인가요?",
    "givens": null,
    "choices": [
      "우리 학교에서 실측했다.",
      "모든 지역에서 확인됐다.",
      "관측소의 실제 기록이다.",
      "연습 자료에서 비교했다.",
      "다음 해의 확정 예보다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "가상 기록은 실제 관측소나 학생이 측정한 값으로 표시하지 않는다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E1",
      "type": "T02",
      "standard": "4과16-01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "자료 제목·기간·출처",
      "concept": "자료 제목·기간·출처",
      "inquirySkill": "자료 제목·기간·출처"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b08",
    "status": "authored",
    "prompt": "기후변화 사례 카드를 조사했습니다. 출처를 남긴 기록으로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "기억나는 숫자만 옮겨 적음",
      "맞는 것 같은 제목을 지음",
      "사진 속 장소를 임의로 적음",
      "다른 지역 날짜로 바꿔 적음",
      "기관·자료 제목·기간을 적음"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "제공 기관·제목·기간과 해당 지역을 밝히면 자료의 범위를 확인할 수 있다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E1",
      "type": "T02",
      "standard": "4과16-01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "자료 제목·기간·출처",
      "concept": "자료 제목·기간·출처",
      "inquirySkill": "자료 제목·기간·출처"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b09",
    "status": "authored",
    "prompt": "사진 한 장만 있고 촬영 장소·날짜가 없습니다. 먼저 할 일로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "촬영 정보의 확인 여부를 밝힌다.",
      "사진을 우리 동네라고 정한다.",
      "발생 날짜를 오늘로 정한다.",
      "모든 원인을 사진으로 정한다.",
      "피해 수치를 예상대로 채운다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "보이는 모습은 설명할 수 있어도 장소·시기·원인을 임의로 만들어 넣지 않는다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E1",
      "type": "T02",
      "standard": "4과16-01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "자료 제목·기간·출처",
      "concept": "자료 제목·기간·출처",
      "inquirySkill": "자료 제목·기간·출처"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b10",
    "status": "authored",
    "prompt": "출처 있는 자료를 조사할 때 지켜야 할 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "부족한 숫자는 예상으로 채운다.",
      "유리한 사진만 날짜를 바꾼다.",
      "자료가 다룬 지역·시기를 적는다.",
      "실측과 연습 자료를 나눈다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        2,
        3
      ]
    },
    "explanation": "자료의 성격과 지역·기간을 보존하고 없는 값을 실제처럼 만들지 않는다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E1",
      "type": "T02",
      "standard": "4과16-01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "자료 제목·기간·출처",
      "concept": "자료 제목·기간·출처",
      "inquirySkill": "자료 제목·기간·출처"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b11",
    "status": "authored",
    "prompt": "자료를 제공한 기관과 책·페이지를 밝히는 정보를 쓰세요. 보기: 출처, 감상",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "출처",
      "accepted": [
        "출처"
      ]
    },
    "explanation": "출처는 자료를 어디서 확인했는지 알려 주며 내 감상과 다르다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E1",
      "type": "T02",
      "standard": "4과16-01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "자료 제목·기간·출처",
      "concept": "자료 제목·기간·출처",
      "inquirySkill": "자료 제목·기간·출처"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b12",
    "status": "authored",
    "prompt": "친구가 인터넷의 홍수 사진을 내 동네의 오늘 피해로 소개하려 합니다. 보고서에 무엇을 확인하고 어떻게 표시할지 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "사진의 제공처·촬영 장소/날짜를 확인해요. 확인되지 않으면 미확인이라고 적고 사진에서 보이는 침수 모습만 설명해요. 내 동네의 오늘 피해나 기후변화의 확정 원인으로 바꾸지 않아요.",
      "rubric": {
        "required": [
          "출처/촬영 정보",
          "보이는 범위",
          "미확인/원인 단정 금지"
        ],
        "pass": "실제 근거·조건·한계를 선생님과 확인해요."
      }
    },
    "explanation": "사진의 제공처·촬영 장소/날짜를 확인해요. 확인되지 않으면 미확인이라고 적고 사진에서 보이는 침수 모습만 설명해요. 내 동네의 오늘 피해나 기후변화의 확정 원인으로 바꾸지 않아요.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E1",
      "type": "T02",
      "standard": "4과16-01",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "자료 제목·기간·출처",
      "concept": "자료 제목·기간·출처",
      "inquirySkill": "자료 제목·기간·출처"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b13",
    "status": "authored",
    "prompt": "오늘 아침이 추웠다는 기록만으로 할 수 있는 말은 무엇인가요?",
    "givens": null,
    "choices": [
      "기후변화가 모두 끝났다.",
      "오늘 아침 춥게 느꼈다.",
      "앞으로 모든 해가 춥다.",
      "전국 연평균기온을 쟀다.",
      "모든 지역의 추세가 같다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "개인의 하루 체감과 여러 지역·여러 해의 변화는 근거 범위가 다르다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E1",
      "type": "T03",
      "standard": "4과16-01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "여러 시기의 기록과 한계",
      "concept": "여러 시기의 기록과 한계",
      "inquirySkill": "여러 시기의 기록과 한계"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b14",
    "status": "authored",
    "prompt": "올해 여름과 지난해 겨울의 기온이 다릅니다. 기후변화 사례를 비교하려면 무엇을 보완해야 하나요?",
    "givens": null,
    "choices": [
      "두 지역의 서로 다른 계절 자료",
      "한 사람의 어제와 오늘 체감",
      "같은 계절·지역의 여러 해 자료",
      "한 해의 하루 최고기온만 모은 자료",
      "측정 기준이 다른 두 장의 사진"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "계절이 다른 비교를 같은 조건의 여러 해 변화로 대신할 수 없다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E1",
      "type": "T03",
      "standard": "4과16-01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "여러 시기의 기록과 한계",
      "concept": "여러 시기의 기록과 한계",
      "inquirySkill": "여러 시기의 기록과 한계"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b15",
    "status": "authored",
    "prompt": "한 달 동안 기온을 기록한 모둠의 설명으로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "지구 모든 해를 측정했다.",
      "미관찰 날은 평균으로 채웠다.",
      "다른 달도 똑같다고 정했다.",
      "한 달의 관찰 범위를 밝혔다.",
      "개인 관찰로 원인을 확정했다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "실제 관찰 기간과 미관찰을 밝히고 장기간·전 지구로 확대하지 않는다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E1",
      "type": "T03",
      "standard": "4과16-01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "여러 시기의 기록과 한계",
      "concept": "여러 시기의 기록과 한계",
      "inquirySkill": "여러 시기의 기록과 한계"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b16",
    "status": "authored",
    "prompt": "여러 해 자료를 읽을 때 바른 태도 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "기대와 다른 해의 값은 지워 버린다.",
      "한 해의 값과 여러 해 경향을 나눈다.",
      "같은 지역·기간 기준인지 살핀다.",
      "한 번 추우면 전체 변화를 부정한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        2
      ]
    },
    "explanation": "기준을 맞추고 개별 해와 여러 해 경향을 구별하며 다른 값도 보존한다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E1",
      "type": "T03",
      "standard": "4과16-01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "여러 시기의 기록과 한계",
      "concept": "여러 시기의 기록과 한계",
      "inquirySkill": "여러 시기의 기록과 한계"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b17",
    "status": "authored",
    "prompt": "관찰하지 못한 날을 실제 관찰과 구별해 표시할 말을 쓰세요. 보기: 미관찰, 관찰완료",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "미관찰",
      "accepted": [
        "미관찰"
      ]
    },
    "explanation": "관찰하지 못한 날은 임의의 관찰값으로 채우지 않는다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E1",
      "type": "T03",
      "standard": "4과16-01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "여러 시기의 기록과 한계",
      "concept": "여러 시기의 기록과 한계",
      "inquirySkill": "여러 시기의 기록과 한계"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b18",
    "status": "authored",
    "prompt": "우리 반은3일 동안 더웠다고 느꼈습니다. 이 기록의 가치와 한계, 다음에 살필 자료를 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "우리 반이 그3일 동안 어떻게 느끼고 대응했는지 알 수 있어요. 세 날 체감만으로 긴 기간의 변화나 원인을 확정하지 않아요. 같은 지역·계절의 여러 해 관측 자료와 비교 기준을 더 찾아요.",
      "rubric": {
        "required": [
          "3일 체감 범위",
          "장기/원인 미확정",
          "같은 기준 자료"
        ],
        "pass": "실제 근거·조건·한계를 선생님과 확인해요."
      }
    },
    "explanation": "우리 반이 그3일 동안 어떻게 느끼고 대응했는지 알 수 있어요. 세 날 체감만으로 긴 기간의 변화나 원인을 확정하지 않아요. 같은 지역·계절의 여러 해 관측 자료와 비교 기준을 더 찾아요.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E1",
      "type": "T03",
      "standard": "4과16-01",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "여러 시기의 기록과 한계",
      "concept": "여러 시기의 기록과 한계",
      "inquirySkill": "여러 시기의 기록과 한계"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b19",
    "status": "authored",
    "prompt": "연습 기록에서 평소 같은 달보다 매우 적은 비가 오래 이어져 물이 부족합니다. 알맞은 사례 이름을 고르세요.",
    "givens": {
      "자료 성격": "관찰 지역을 정하지 않은 연습 사례"
    },
    "choices": [
      "폭설",
      "폭염",
      "한파",
      "홍수",
      "가뭄"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "비가 매우 적은 상태가 이어져 물이 부족한 사례를 가뭄과 연결한다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E1",
      "type": "T04",
      "standard": "4과16-01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "높거나 낮은 기온·강수 사례",
      "concept": "높거나 낮은 기온·강수 사례",
      "inquirySkill": "높거나 낮은 기온·강수 사례"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b20",
    "status": "authored",
    "prompt": "연습 사례에서 평년보다 매우 높은 기온이 오래 이어졌습니다. 가장 관련 있는 사례를 고르세요.",
    "givens": null,
    "choices": [
      "폭염",
      "가뭄",
      "폭설",
      "한파",
      "서리"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "여기서 제시한 요소는 매우 높은 기온이며 강수량 감소를 따로 측정한 것은 아니다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E1",
      "type": "T04",
      "standard": "4과16-01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "높거나 낮은 기온·강수 사례",
      "concept": "높거나 낮은 기온·강수 사례",
      "inquirySkill": "높거나 낮은 기온·강수 사례"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b21",
    "status": "authored",
    "prompt": "연습 사례에서 많은 비로 물이 넘쳐 낮은 곳이 잠겼습니다. 가장 관련 있는 현상을 고르세요.",
    "givens": null,
    "choices": [
      "한파",
      "홍수",
      "가뭄",
      "서리",
      "폭염"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "많은 비 뒤 물이 넘치고 잠긴 상황을 홍수와 연결한다. 개별 원인 전체를 확정하지 않는다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E1",
      "type": "T04",
      "standard": "4과16-01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "높거나 낮은 기온·강수 사례",
      "concept": "높거나 낮은 기온·강수 사례",
      "inquirySkill": "높거나 낮은 기온·강수 사례"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b22",
    "status": "authored",
    "prompt": "평년과 비교해 매우 높은 기온과 매우 낮은 기온에 각각 연결되는 사례 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "한파",
      "폭염",
      "달의 위상",
      "지층의 무늬"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        1
      ]
    },
    "explanation": "폭염·한파는 기온이 높은/낮은 사례이며 달의 모양이나 지층 무늬는 기온 사례가 아니다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E1",
      "type": "T04",
      "standard": "4과16-01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "높거나 낮은 기온·강수 사례",
      "concept": "높거나 낮은 기온·강수 사례",
      "inquirySkill": "높거나 낮은 기온·강수 사례"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b23",
    "status": "authored",
    "prompt": "연습 카드에서 매우 많은 눈이 내려 이동에 큰 불편이 생겼습니다. 사례 이름을 쓰세요. 보기: 폭설, 가뭄",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "폭설",
      "accepted": [
        "폭설"
      ]
    },
    "explanation": "눈이 매우 많이 내리는 사례를 폭설이라고 하며 비가 적은 가뭄과 구별한다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E1",
      "type": "T04",
      "standard": "4과16-01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "높거나 낮은 기온·강수 사례",
      "concept": "높거나 낮은 기온·강수 사례",
      "inquirySkill": "높거나 낮은 기온·강수 사례"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b24",
    "status": "authored",
    "prompt": "기후변화 사례 모음에 폭염과 한파를 함께 넣어도 되는지, 어떤 자료 정보가 필요한지 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "평년보다 기온이 현저히 높거나 낮은 사례를 함께 살펴볼 수 있어요. 지역·기간·기온과 비교 기준을 밝히고, 한 번의 한파만으로 장기간의 기후변화를 부정하거나 한 사건의 원인을 확정하지 않아요.",
      "rubric": {
        "required": [
          "높고 낮은 사례",
          "지역/기간/평년 기준",
          "한 사건과 장기간 구별"
        ],
        "pass": "실제 근거·조건·한계를 선생님과 확인해요."
      }
    },
    "explanation": "평년보다 기온이 현저히 높거나 낮은 사례를 함께 살펴볼 수 있어요. 지역·기간·기온과 비교 기준을 밝히고, 한 번의 한파만으로 장기간의 기후변화를 부정하거나 한 사건의 원인을 확정하지 않아요.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E1",
      "type": "T04",
      "standard": "4과16-01",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "높거나 낮은 기온·강수 사례",
      "concept": "높거나 낮은 기온·강수 사례",
      "inquirySkill": "높거나 낮은 기온·강수 사례"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b25",
    "status": "authored",
    "prompt": "기후변화와 생활의 관련성을 토의할 자료로 가장 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "친구의 좋아하는 색 투표",
      "조사자의 생일이 적힌 표",
      "교통·에너지 이용 자료",
      "사진 파일을 정렬한 목록",
      "모형 집의 상표만 적은 표"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "인간의 생활·교통·에너지 이용과 기후변화 대응 관련 자료를 근거로 토의한다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E2",
      "type": "T05",
      "standard": "4과16-01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "인간 활동과 관련된 변화 토의",
      "concept": "인간 활동과 관련된 변화 토의",
      "inquirySkill": "인간 활동과 관련된 변화 토의"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b26",
    "status": "authored",
    "prompt": "“우리 반이 전등을 꺼서 내일의 홍수가 완전히 사라진다”는 말을 검토했습니다. 알맞은 설명을 고르세요.",
    "givens": null,
    "choices": [
      "끄는 행동은 언제나 아무 의미가 없다.",
      "모든 홍수는 한 교실 전등 때문이다.",
      "내일 비의 양을 오늘 바로 측정했다.",
      "한 행동으로 내일 현상을 확정할 수 없다.",
      "한 반의 행동만으로 모든 문제가 끝난다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "생활 속 대응의 의미와 한 행동으로 특정 사건을 즉시 없앤다는 단정을 구별한다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E2",
      "type": "T05",
      "standard": "4과16-01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "인간 활동과 관련된 변화 토의",
      "concept": "인간 활동과 관련된 변화 토의",
      "inquirySkill": "인간 활동과 관련된 변화 토의"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b27",
    "status": "authored",
    "prompt": "기후변화와 인간 활동의 관련성을 토의할 때 지켜야 할 태도는 무엇인가요?",
    "givens": null,
    "choices": [
      "한 사람만 모든 책임을 진다.",
      "물음이 있으면 자료를 숨긴다.",
      "개별 사건의 원인을 추측해 확정한다.",
      "반대 의견은 듣지 않고 지운다.",
      "자료 근거와 확인 범위를 말한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "관련성을 자료로 살피며 책임 전가나 개별 사건 원인 확정을 하지 않는다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E2",
      "type": "T05",
      "standard": "4과16-01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "인간 활동과 관련된 변화 토의",
      "concept": "인간 활동과 관련된 변화 토의",
      "inquirySkill": "인간 활동과 관련된 변화 토의"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b28",
    "status": "authored",
    "prompt": "인간 활동과 관련성을 살피는 토의에서 바른 문장 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "생활과 에너지 이용 자료를 조사하자.",
      "오늘 비의 원인을 한 학생으로 정하자.",
      "문제가 크니 모든 실천을 그만두자.",
      "학교·가정·지역의 도움도 함께 살피자."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    },
    "explanation": "자료와 함께 할 역할을 살피고 특정 학생 탓이나 무기력으로 대신하지 않는다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E2",
      "type": "T05",
      "standard": "4과16-01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "인간 활동과 관련된 변화 토의",
      "concept": "인간 활동과 관련된 변화 토의",
      "inquirySkill": "인간 활동과 관련된 변화 토의"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b29",
    "status": "authored",
    "prompt": "생각을 뒷받침하는 자료나 관찰 내용을 쓰세요. 보기: 근거, 추측",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "근거",
      "accepted": [
        "근거"
      ]
    },
    "explanation": "자료·관찰에서 확인한 근거를 제시하고 확인하지 않은 추측은 구별한다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E2",
      "type": "T05",
      "standard": "4과16-01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "인간 활동과 관련된 변화 토의",
      "concept": "인간 활동과 관련된 변화 토의",
      "inquirySkill": "인간 활동과 관련된 변화 토의"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b30",
    "status": "authored",
    "prompt": "“기후변화는 너무 커서 우리가 할 일이 없다”는 의견에 근거와 함께 할 수 있는 역할을 담아 답하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "개인 행동만으로 모든 문제를 해결할 수는 없지만 학교·가정·지역과 함께 생활 속 대응을 이어 갈 수 있어요. 에너지·자원 이용과 관련된 자료를 조사하고 실제 가능한 행동·도움·확인 방법을 정해요.",
      "rubric": {
        "required": [
          "과장/무기력 구별",
          "자료와 가능한 행동",
          "공동 역할/도움"
        ],
        "pass": "실제 근거·조건·한계를 선생님과 확인해요."
      }
    },
    "explanation": "개인 행동만으로 모든 문제를 해결할 수는 없지만 학교·가정·지역과 함께 생활 속 대응을 이어 갈 수 있어요. 에너지·자원 이용과 관련된 자료를 조사하고 실제 가능한 행동·도움·확인 방법을 정해요.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E2",
      "type": "T05",
      "standard": "4과16-01",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "인간 활동과 관련된 변화 토의",
      "concept": "인간 활동과 관련된 변화 토의",
      "inquirySkill": "인간 활동과 관련된 변화 토의"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b31",
    "status": "authored",
    "prompt": "토의 전에 혼자 쓴 대응 방법 초안을 보관했습니다. 상태를 바르게 적은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "개인 초안 · 아직 미토의",
      "실제 모두와 합의 완료",
      "친구 의견 수신 완료",
      "공동 실천 결과 확정",
      "재공유 후 평가 완료"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "개인 작성과 실제 토의·합의를 구별한다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E2",
      "type": "T06",
      "standard": "4과16-01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "서로 다른 의견과 근거",
      "concept": "서로 다른 의견과 근거",
      "inquirySkill": "서로 다른 의견과 근거"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b32",
    "status": "authored",
    "prompt": "친구가 “더운 교실에서는 건강을 위해 냉방이 필요할 수 있다”고 말했습니다. 의견을 반영하는 방법을 고르세요.",
    "givens": null,
    "choices": [
      "건강 의견을 기록에서 모두 삭제",
      "필요한 냉방과 낭비를 함께 살핌",
      "전기는 어떤 상황에도 쓰지 않기",
      "친구에게 모든 원인의 책임 주기",
      "냉방을 쓴 날은 실천 기록 숨기기"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "건강·참여 여건을 지키며 불필요한 사용을 줄이는 방법을 토의할 수 있다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E2",
      "type": "T06",
      "standard": "4과16-01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "서로 다른 의견과 근거",
      "concept": "서로 다른 의견과 근거",
      "inquirySkill": "서로 다른 의견과 근거"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b33",
    "status": "authored",
    "prompt": "아직 받지 않은 친구의 질문을 발표문에 넣으려 합니다. 알맞은 표시는 무엇인가요?",
    "givens": null,
    "choices": [
      "실제로 받은 질문과 답",
      "지난 토의에서 합의한 말",
      "앞으로 물어볼 예상 질문",
      "다른 사람이 확정한 결과",
      "모든 친구의 공통 의견"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "예상 질문은 실제 받은 의견으로 바꾸지 않는다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E2",
      "type": "T06",
      "standard": "4과16-01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "서로 다른 의견과 근거",
      "concept": "서로 다른 의견과 근거",
      "inquirySkill": "서로 다른 의견과 근거"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b34",
    "status": "authored",
    "prompt": "실제 토의 기록에 남길 내용 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "상상한 발언을 실제로 적기",
      "아직 못 한 토의를 완료로 적기",
      "의견으로 바꾼 내용과 이유",
      "들은 의견과 그 이유"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        2,
        3
      ]
    },
    "explanation": "실제 의견·근거·수정과 미토의를 구별해 보존한다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E2",
      "type": "T06",
      "standard": "4과16-01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "서로 다른 의견과 근거",
      "concept": "서로 다른 의견과 근거",
      "inquirySkill": "서로 다른 의견과 근거"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b35",
    "status": "authored",
    "prompt": "함께 의견을 나누지 못한 상태를 쓰세요. 보기: 미토의, 합의완료",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "미토의",
      "accepted": [
        "미토의"
      ]
    },
    "explanation": "실제 의견을 나누지 못했다면 미토의로 남기고 다음 질문을 적는다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E2",
      "type": "T06",
      "standard": "4과16-01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "서로 다른 의견과 근거",
      "concept": "서로 다른 의견과 근거",
      "inquirySkill": "서로 다른 의견과 근거"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b36",
    "status": "authored",
    "prompt": "두 친구가 조명을 줄이는 방법과 필요한 밝기를 두고 의견이 다릅니다. 토의하고 기록할 방법을 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "필요한 밝기와 활동·안전 조건을 먼저 확인해요. 두 방법의 근거와 도움을 비교하고 실제 의견·정한 방법·남은 이견을 적어요. 실제로 바꾼 부분과 앞으로 시험할 계획을 나눠요.",
      "rubric": {
        "required": [
          "필요한 밝기/조건",
          "두 의견/근거",
          "실제 수정/미합의/계획"
        ],
        "pass": "실제 근거·조건·한계를 선생님과 확인해요."
      }
    },
    "explanation": "필요한 밝기와 활동·안전 조건을 먼저 확인해요. 두 방법의 근거와 도움을 비교하고 실제 의견·정한 방법·남은 이견을 적어요. 실제로 바꾼 부분과 앞으로 시험할 계획을 나눠요.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E2",
      "type": "T06",
      "standard": "4과16-01",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "서로 다른 의견과 근거",
      "concept": "서로 다른 의견과 근거",
      "inquirySkill": "서로 다른 의견과 근거"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b37",
    "status": "authored",
    "prompt": "폭염이 오래 이어지는 연습 사례에서 학교생활의 영향을 조사하려 합니다. 가장 직접 관련 있는 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "문항 번호의 글자 색깔",
      "보고서 파일의 정렬 방식",
      "모형 상자의 포장 무늬",
      "야외 활동 시간과 쉬는 곳",
      "조사자의 출석 번호 순서"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "더위는 야외 활동·쉼터·건강을 위한 생활 조절과 연결해 살필 수 있다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E3",
      "type": "T07",
      "standard": "4과16-02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "사람의 생활과 일의 영향",
      "concept": "사람의 생활과 일의 영향",
      "inquirySkill": "사람의 생활과 일의 영향"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b38",
    "status": "authored",
    "prompt": "비가 매우 적게 이어져 농사에 쓸 물이 부족한 사례입니다. 조사할 영향으로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "모든 달의 위상 변화 원인",
      "모든 교통수단의 속도 공식",
      "모형 재료의 상표 종류",
      "사진 파일을 만든 글꼴",
      "농작물에 필요한 물의 공급"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "물 부족과 농작물·생활 용수 영향을 자료 범위로 조사한다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E3",
      "type": "T07",
      "standard": "4과16-02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "사람의 생활과 일의 영향",
      "concept": "사람의 생활과 일의 영향",
      "inquirySkill": "사람의 생활과 일의 영향"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b39",
    "status": "authored",
    "prompt": "큰비로 도로가 잠긴 제공 사진이 있습니다. 사진에서 알 수 있는 범위를 고르세요.",
    "givens": null,
    "choices": [
      "사진 속 일부 도로의 침수 모습",
      "모든 집의 정확한 피해 금액",
      "물속 모든 성분의 측정 결과",
      "앞으로 매년 잠길 확정 날짜",
      "사진 밖 모든 지역의 피해"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "사진의 보이는 침수와 금액·성분·미래/다른 지역을 구별한다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E3",
      "type": "T07",
      "standard": "4과16-02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "사람의 생활과 일의 영향",
      "concept": "사람의 생활과 일의 영향",
      "inquirySkill": "사람의 생활과 일의 영향"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b40",
    "status": "authored",
    "prompt": "기후변화가 생활에 미치는 영향을 조사하는 기록으로 알맞은 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "한 사진의 모습을 모든 지역으로 확대",
      "학생이 쉬고 이동할 때 필요한 도움",
      "농사·교통의 불편과 출처",
      "확인하지 않은 피해액을 실제로 쓰기"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        2
      ]
    },
    "explanation": "사람의 생활·일의 영향과 필요한 도움을 근거로 조사한다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E3",
      "type": "T07",
      "standard": "4과16-02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "사람의 생활과 일의 영향",
      "concept": "사람의 생활과 일의 영향",
      "inquirySkill": "사람의 생활과 일의 영향"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b41",
    "status": "authored",
    "prompt": "같은 모형 도로의 물높이가2cm에서5cm로 바뀌었습니다. 높아진 양을 cm로 쓰세요.",
    "givens": {
      "자료 성격": "해수면 피해를 살피는 연습 모형 값"
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "3",
      "accepted": [
        "3",
        "3cm",
        "3 cm"
      ]
    },
    "explanation": "5-2=3cm이다. 모형 값이며 실제 도로의 침수 깊이 예측이 아니다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E3",
      "type": "T07",
      "standard": "4과16-02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "사람의 생활과 일의 영향",
      "concept": "사람의 생활과 일의 영향",
      "inquirySkill": "사람의 생활과 일의 영향"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b42",
    "status": "authored",
    "prompt": "가뭄으로 물이 부족한 사례가 사람의 생활과 일에 어떤 영향을 줄 수 있는지, 자료의 한계를 포함해 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "마실 물과 농사에 필요한 물을 쓰는 데 어려움이 생길 수 있어요. 해당 지역·기간·용수 자료를 조사하고 실제 확인한 영향과 가능한 영향을 구별해요. 자료에 없는 사람 수·피해액을 만들지 않고 필요한 도움을 살펴요.",
      "rubric": {
        "required": [
          "생활/일 영향",
          "지역/기간 근거",
          "미확인/도움"
        ],
        "pass": "실제 근거·조건·한계를 선생님과 확인해요."
      }
    },
    "explanation": "마실 물과 농사에 필요한 물을 쓰는 데 어려움이 생길 수 있어요. 해당 지역·기간·용수 자료를 조사하고 실제 확인한 영향과 가능한 영향을 구별해요. 자료에 없는 사람 수·피해액을 만들지 않고 필요한 도움을 살펴요.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E3",
      "type": "T07",
      "standard": "4과16-02",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "사람의 생활과 일의 영향",
      "concept": "사람의 생활과 일의 영향",
      "inquirySkill": "사람의 생활과 일의 영향"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b43",
    "status": "authored",
    "prompt": "물이 줄어든 연습 연못에서 물고기 수를 한 번 세었습니다. 바르게 남긴 결론을 고르세요.",
    "givens": null,
    "choices": [
      "모든 물고기 종이 사라졌다.",
      "센 범위와 시각의 관찰이다.",
      "원인은 한 가지로 확정됐다.",
      "다른 연못도 수가 똑같다.",
      "앞으로 물고기 수는 일정하다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "한 번의 관찰 범위와 생물 전체·확정 원인을 구별한다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E3",
      "type": "T08",
      "standard": "4과16-02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "생물과 주변 환경 영향",
      "concept": "생물과 주변 환경 영향",
      "inquirySkill": "생물과 주변 환경 영향"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b44",
    "status": "authored",
    "prompt": "기후변화가 주변 환경에 미치는 영향을 조사할 대상으로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "학생 필통의 문양 차이",
      "같은 파일의 제목 글꼴",
      "물·서식지의 변화",
      "모둠 이름의 글자 수",
      "문제집 표지의 손때"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "물·서식지·생물의 생활 변화는 환경 영향 조사와 연결된다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E3",
      "type": "T08",
      "standard": "4과16-02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "생물과 주변 환경 영향",
      "concept": "생물과 주변 환경 영향",
      "inquirySkill": "생물과 주변 환경 영향"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b45",
    "status": "authored",
    "prompt": "다른 해에 촬영한 숲 사진 두 장의 나무 모습이 다릅니다. 먼저 더 확인할 정보는 무엇인가요?",
    "givens": null,
    "choices": [
      "두 파일 이름의 가나다순",
      "사진을 보는 친구의 키",
      "파일 아이콘의 모양 차이",
      "장소·계절·범위 일치 여부",
      "그림에 쓰인 연필 상표"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "장소·계절·범위가 다르면 같은 조건의 변화로 비교하기 어렵다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E3",
      "type": "T08",
      "standard": "4과16-02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "생물과 주변 환경 영향",
      "concept": "생물과 주변 환경 영향",
      "inquirySkill": "생물과 주변 환경 영향"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b46",
    "status": "authored",
    "prompt": "환경 영향 조사에서 바른 설명 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "확인하지 못한 종은 미확인으로 적는다.",
      "직접 보인 모습과 추측을 나눈다.",
      "못 찾은 생물은 모두 멸종으로 적는다.",
      "생물 수 차이는 한 원인으로 확정한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        1
      ]
    },
    "explanation": "관찰·추론·미확인을 구별하고 한 원인/멸종을 근거 없이 확정하지 않는다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E3",
      "type": "T08",
      "standard": "4과16-02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "생물과 주변 환경 영향",
      "concept": "생물과 주변 환경 영향",
      "inquirySkill": "생물과 주변 환경 영향"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b47",
    "status": "authored",
    "prompt": "자료가 부족하여 생물 변화의 원인을 아직 알 수 없을 때 쓸 말을 고르세요. 보기: 미확인, 확정",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "미확인",
      "accepted": [
        "미확인"
      ]
    },
    "explanation": "모르는 원인은 미확인으로 두고 필요한 자료를 더 찾는다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E3",
      "type": "T08",
      "standard": "4과16-02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "생물과 주변 환경 영향",
      "concept": "생물과 주변 환경 영향",
      "inquirySkill": "생물과 주변 환경 영향"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b48",
    "status": "authored",
    "prompt": "물이 적어진 연못 사진과 생물 관찰 기록을 함께 조사합니다. 어떤 사실과 추측을 나누어 설명할지 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "사진의 물 범위와 관찰 날짜·장소·보인 생물을 적어요. 생물이 줄었을 가능성과 실제 세어 확인한 수를 나누고, 못 찾았다는 이유로 모두 사라졌다고 하지 않아요. 원인·다른 환경 조건은 더 조사해요.",
      "rubric": {
        "required": [
          "관찰 날짜/범위",
          "보인 사실/가능성",
          "미확인 원인/추가 조사"
        ],
        "pass": "실제 근거·조건·한계를 선생님과 확인해요."
      }
    },
    "explanation": "사진의 물 범위와 관찰 날짜·장소·보인 생물을 적어요. 생물이 줄었을 가능성과 실제 세어 확인한 수를 나누고, 못 찾았다는 이유로 모두 사라졌다고 하지 않아요. 원인·다른 환경 조건은 더 조사해요.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E3",
      "type": "T08",
      "standard": "4과16-02",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "생물과 주변 환경 영향",
      "concept": "생물과 주변 환경 영향",
      "inquirySkill": "생물과 주변 환경 영향"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b49",
    "status": "authored",
    "prompt": "두 지역의 피해액을 비교할 때 함께 확인해야 할 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "발표자의 좋아하는 음식",
      "표의 가로선 색깔 취향",
      "보고서를 저장한 폴더 순서",
      "자료를 읽은 친구의 생일",
      "피해를 센 기간·대상·기준"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "기간·피해 대상·집계 기준이 다르면 단순 숫자 비교가 어려울 수 있다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E3",
      "type": "T09",
      "standard": "4과16-02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "피해 자료의 범위와 비교",
      "concept": "피해 자료의 범위와 비교",
      "inquirySkill": "피해 자료의 범위와 비교"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b50",
    "status": "authored",
    "prompt": "영향 조사에서 어려움을 겪는 사람을 소개하는 태도로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "필요한 도움과 대응을 함께 살핀다.",
      "불안감을 높이려고 피해를 늘린다.",
      "한 학생의 잘못으로 모두 돌린다.",
      "모두 끝났다고 실천을 멈춘다.",
      "모르는 인원수를 사실로 적는다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "심각성을 살피되 피해를 과장하거나 무기력/책임 전가로 대신하지 않는다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E3",
      "type": "T09",
      "standard": "4과16-02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "피해 자료의 범위와 비교",
      "concept": "피해 자료의 범위와 비교",
      "inquirySkill": "피해 자료의 범위와 비교"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b51",
    "status": "authored",
    "prompt": "제공 자료는 해안 한 마을의 도로 피해를 다룹니다. 알맞은 보고서 제목을 고르세요.",
    "givens": null,
    "choices": [
      "전 세계 모든 도로 피해 확정",
      "한 해안 마을 도로 피해 조사",
      "우리 학교의 실제 침수 측정",
      "앞으로 모든 지역의 확정 피해",
      "모든 피해 원인 완전 해결"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "자료의 지역·대상 범위가 한 마을 도로이므로 제목도 그 범위를 보존한다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E3",
      "type": "T09",
      "standard": "4과16-02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "피해 자료의 범위와 비교",
      "concept": "피해 자료의 범위와 비교",
      "inquirySkill": "피해 자료의 범위와 비교"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b52",
    "status": "authored",
    "prompt": "피해 자료의 한계를 밝히는 문장 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "다른 지역의 피해는 아직 조사하지 않았다.",
      "못 본 피해는 절대로 발생하지 않는다.",
      "한 마을의 값이 모든 지역의 값이다.",
      "사진만으로 정확한 피해액은 알 수 없다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    },
    "explanation": "미조사 범위와 사진의 정보 한계를 밝히며 없다고 단정하거나 확대하지 않는다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E3",
      "type": "T09",
      "standard": "4과16-02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "피해 자료의 범위와 비교",
      "concept": "피해 자료의 범위와 비교",
      "inquirySkill": "피해 자료의 범위와 비교"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b53",
    "status": "authored",
    "prompt": "연습 표에서 같은 기준으로 물에 닿은 집 모형이2개에서5개로 늘었습니다. 늘어난 집 모형 수를 쓰세요.",
    "givens": {
      "자료 성격": "실제 관측이 아닌 연습 모형 집계"
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "3",
      "accepted": [
        "3",
        "3개"
      ]
    },
    "explanation": "5-2=3개이다. 이 숫자는 연습 모형의 집 수이며 실제 피해 가구 수가 아니다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E3",
      "type": "T09",
      "standard": "4과16-02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "피해 자료의 범위와 비교",
      "concept": "피해 자료의 범위와 비교",
      "inquirySkill": "피해 자료의 범위와 비교"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b54",
    "status": "authored",
    "prompt": "친구가 “한 마을이 잠긴 사진을 보았으니 전국이 내년에 모두 잠긴다”고 적었습니다. 근거에 맞게 고치세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "사진은 해당 장소·시기의 잠긴 모습을 보여 줘요. 전국의 높이·방호 시설·물높이와 앞으로의 기간을 조사하지 않았으므로 모두 내년에 잠긴다고 정할 수 없어요. 확인한 피해와 필요한 추가 자료·대응을 나눠요.",
      "rubric": {
        "required": [
          "사진 범위",
          "전국/연도 확정 불가",
          "추가 자료/대응"
        ],
        "pass": "실제 근거·조건·한계를 선생님과 확인해요."
      }
    },
    "explanation": "사진은 해당 장소·시기의 잠긴 모습을 보여 줘요. 전국의 높이·방호 시설·물높이와 앞으로의 기간을 조사하지 않았으므로 모두 내년에 잠긴다고 정할 수 없어요. 확인한 피해와 필요한 추가 자료·대응을 나눠요.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E3",
      "type": "T09",
      "standard": "4과16-02",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "피해 자료의 범위와 비교",
      "concept": "피해 자료의 범위와 비교",
      "inquirySkill": "피해 자료의 범위와 비교"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b55",
    "status": "authored",
    "prompt": "해수면 상승 피해 모형에서 바꾸어 비교할 조건으로 알맞은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "매번 바꾸는 집 모형의 수",
      "시행마다 다른 육지의 높이",
      "바다를 나타내는 물의 높이",
      "바꾸어 놓은 수조의 기울기",
      "시행마다 다른 눈금 단위"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "같은 육지·집 배치를 유지하고 물높이를 바꾸어 닿는 범위를 살핀다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E4",
      "type": "T10",
      "standard": "4과16-02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "해수면 피해 모형 설계",
      "concept": "해수면 피해 모형 설계",
      "inquirySkill": "해수면 피해 모형 설계"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b56",
    "status": "authored",
    "prompt": "해안 육지와 집 모형을 만들었습니다. 비교하기 전 가장 먼저 할 일은 무엇인가요?",
    "givens": null,
    "choices": [
      "기대 결과대로 젖은 범위를 칠한다.",
      "비교할 때마다 집을 높은 곳에 옮긴다.",
      "실제 도시의 침수 연도를 확정한다.",
      "집 위치·처음 물높이를 표시한다.",
      "물을 쏟은 흔적을 모두 지운다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "같은 배치와 시작 조건을 표시해야 전후 관찰을 비교할 수 있다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E4",
      "type": "T10",
      "standard": "4과16-02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "해수면 피해 모형 설계",
      "concept": "해수면 피해 모형 설계",
      "inquirySkill": "해수면 피해 모형 설계"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b57",
    "status": "authored",
    "prompt": "해수면 피해 모형에서 실제 바닷물에 해당하는 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "종이 집의 지붕",
      "육지 위의 이름표",
      "실험 기록의 제목",
      "수조 밖의 받침대",
      "수조에 담은 물"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "수조의 물을 바다에 대응시켜 물높이 변화와 육지/집에 닿는 범위를 살핀다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E4",
      "type": "T10",
      "standard": "4과16-02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "해수면 피해 모형 설계",
      "concept": "해수면 피해 모형 설계",
      "inquirySkill": "해수면 피해 모형 설계"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b58",
    "status": "authored",
    "prompt": "같은 피해 모형의 전후 비교에서 유지할 조건 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "비교할 바다 모형의 물높이",
      "예상대로 바꾼 피해 결과",
      "물높이를 읽는 기준",
      "육지·집 모형의 위치"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        2,
        3
      ]
    },
    "explanation": "위치와 읽는 기준을 유지하고 물높이를 바꾸어 비교한다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E4",
      "type": "T10",
      "standard": "4과16-02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "해수면 피해 모형 설계",
      "concept": "해수면 피해 모형 설계",
      "inquirySkill": "해수면 피해 모형 설계"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b59",
    "status": "authored",
    "prompt": "모형에서 물높이에 적을 길이 단위의 이름을 쓰세요. 보기: 센티미터, 분",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "센티미터",
      "accepted": [
        "센티미터",
        "cm"
      ]
    },
    "explanation": "물높이는 길이 단위로 적으며 시간을 나타내는 분과 구별한다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E4",
      "type": "T10",
      "standard": "4과16-02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "해수면 피해 모형 설계",
      "concept": "해수면 피해 모형 설계",
      "inquirySkill": "해수면 피해 모형 설계"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b60",
    "status": "authored",
    "prompt": "육지·집·물을 이용해 해수면 상승 피해 모형을 설계하세요. 바꿀 것·같게 둘 것·남길 근거를 포함하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "수조의 한쪽에 육지와 집 모형을 고정하고 처음 물높이를 표시해요. 같은 배치·같은 읽기 기준에서 물높이만 조금씩 높여 물이 닿은 육지/집과 실제 높이를 기록해요. 모형 계획·직접 실험·제공 자료를 구별해요.",
      "rubric": {
        "required": [
          "물높이 변화",
          "같은 육지/배치/기준",
          "관찰 기록/실제 구별"
        ],
        "pass": "실제 근거·조건·한계를 선생님과 확인해요."
      }
    },
    "explanation": "수조의 한쪽에 육지와 집 모형을 고정하고 처음 물높이를 표시해요. 같은 배치·같은 읽기 기준에서 물높이만 조금씩 높여 물이 닿은 육지/집과 실제 높이를 기록해요. 모형 계획·직접 실험·제공 자료를 구별해요.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E4",
      "type": "T10",
      "standard": "4과16-02",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "해수면 피해 모형 설계",
      "concept": "해수면 피해 모형 설계",
      "inquirySkill": "해수면 피해 모형 설계"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b61",
    "status": "authored",
    "prompt": "피해 모형에 물을 더했더니 눈금이 흔들립니다. 다음 행동으로 알맞은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "안정된 뒤 같은 기준으로 읽는다.",
      "가장 큰 숫자만 실제값으로 적는다.",
      "예상한 숫자를 읽기값으로 바꾼다.",
      "집을 옮겨 원하는 피해를 만든다.",
      "단위를 빼고 기억대로 적는다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "물높이가 안정된 뒤 같은 눈높이/기준에서 실제값과 단위를 읽는다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E4",
      "type": "T11",
      "standard": "4과16-02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "모형 관찰·반복·기록",
      "concept": "모형 관찰·반복·기록",
      "inquirySkill": "모형 관찰·반복·기록"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b62",
    "status": "authored",
    "prompt": "모형에서 물이 어떤 집에도 닿지 않았습니다. 알맞은 기록을 고르세요.",
    "givens": null,
    "choices": [
      "원하는 침수 집을 추가해 적었다.",
      "그 조건에서는 닿은 집이 없었다.",
      "실제 해안의 피해가 영원히 없다.",
      "다른 물높이도 모두 결과가 같다.",
      "실험을 하지 않은 것으로 바꿨다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "관찰한 물높이/배치에서의 결과를 보존하고 더 높은 물이나 실제 모든 해안으로 확대하지 않는다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E4",
      "type": "T11",
      "standard": "4과16-02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "모형 관찰·반복·기록",
      "concept": "모형 관찰·반복·기록",
      "inquirySkill": "모형 관찰·반복·기록"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b63",
    "status": "authored",
    "prompt": "모형을 두 번 반복했는데 물높이와 집 위치가 모두 달랐습니다. 알맞은 검토는 무엇인가요?",
    "givens": null,
    "choices": [
      "두 결과가 다르면 하나를 지운다.",
      "높은 피해 수치만 정답으로 정한다.",
      "같은 배치·기준으로 다시 비교한다.",
      "두 값으로 모든 실제 피해를 정한다.",
      "원인을 한 조건으로 즉시 확정한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "두 조건이 함께 바뀌면 한 조건의 영향을 구별하기 어렵다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E4",
      "type": "T11",
      "standard": "4과16-02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "모형 관찰·반복·기록",
      "concept": "모형 관찰·반복·기록",
      "inquirySkill": "모형 관찰·반복·기록"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b64",
    "status": "authored",
    "prompt": "직접 모형실험 기록에 남길 내용 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "조사하지 않은 실제 도시 피해액",
      "같은 배치에서 물이 닿은 범위",
      "시행별 실제 물높이와 단위",
      "기대에 맞춰 바꾼 침수 수"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        2
      ]
    },
    "explanation": "시행별 실제 조건·관찰을 남기고 예상값이나 실제 도시 자료를 꾸미지 않는다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E4",
      "type": "T11",
      "standard": "4과16-02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "모형 관찰·반복·기록",
      "concept": "모형 관찰·반복·기록",
      "inquirySkill": "모형 관찰·반복·기록"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b65",
    "status": "authored",
    "prompt": "연습 모형에서 첫 물높이3cm, 다음 물높이4cm입니다. 높아진 양을 cm로 쓰세요.",
    "givens": {
      "자료 성격": "학생 실제 실험값이 아닌 연습 자료"
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "1",
      "accepted": [
        "1",
        "1cm",
        "1 cm"
      ]
    },
    "explanation": "4-3=1cm이며 연습 모형의 높이 차이다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E4",
      "type": "T11",
      "standard": "4과16-02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "모형 관찰·반복·기록",
      "concept": "모형 관찰·반복·기록",
      "inquirySkill": "모형 관찰·반복·기록"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b66",
    "status": "authored",
    "prompt": "피해 모형에서 예상보다 적은 집이 젖었습니다. 어떤 결과를 남기고 다음 시행을 어떻게 확인할까요?",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "실제 물높이·육지/집 배치·젖은 집을 그대로 남겨요. 바닥 기울기·물이 새거나 흔들리는지·읽는 기준을 확인해요. 같은 조건으로 다시 관찰하고 예상대로 집 수를 바꾸지 않아요.",
      "rubric": {
        "required": [
          "실제 결과 보존",
          "기울기/누출/기준 확인",
          "같은 조건 반복/예상 구별"
        ],
        "pass": "실제 근거·조건·한계를 선생님과 확인해요."
      }
    },
    "explanation": "실제 물높이·육지/집 배치·젖은 집을 그대로 남겨요. 바닥 기울기·물이 새거나 흔들리는지·읽는 기준을 확인해요. 같은 조건으로 다시 관찰하고 예상대로 집 수를 바꾸지 않아요.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E4",
      "type": "T11",
      "standard": "4과16-02",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "모형 관찰·반복·기록",
      "concept": "모형 관찰·반복·기록",
      "inquirySkill": "모형 관찰·반복·기록"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b67",
    "status": "authored",
    "prompt": "작은 수조 모형의 물이1cm 높아졌습니다. 설명할 수 있는 범위를 고르세요.",
    "givens": null,
    "choices": [
      "실제 바다가 반드시1m 상승",
      "모든 도시에 같은 피해 확정",
      "내년 침수 날짜를 직접 측정",
      "그 모형의 물높이 변화",
      "세계 해안의 지형을 모두 재현"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "모형의 크기와 실제 공간의 대응을 정하지 않았으므로 실제 높이/연도를 바로 환산하지 않는다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E4",
      "type": "T12",
      "standard": "4과16-02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "모형의 한계와 피해 설명",
      "concept": "모형의 한계와 피해 설명",
      "inquirySkill": "모형의 한계와 피해 설명"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b68",
    "status": "authored",
    "prompt": "수조에 물을 더하는 활동이 알아보려는 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "기후변화의 모든 과학적 원인",
      "실제 도시의 정확한 미래 연도",
      "모든 지역의 강수 발생 공식",
      "사람마다 느끼는 더위의 점수",
      "물높이가 높아질 때 피해 범위"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "활동은 높아진 물이 모형 육지/집에 미치는 영향을 살피며 원인 전체를 재현하는 실험이 아니다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E4",
      "type": "T12",
      "standard": "4과16-02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "모형의 한계와 피해 설명",
      "concept": "모형의 한계와 피해 설명",
      "inquirySkill": "모형의 한계와 피해 설명"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b69",
    "status": "authored",
    "prompt": "모형 결과를 보고 피해 대응을 이야기할 때 알맞은 설명은 무엇인가요?",
    "givens": null,
    "choices": [
      "실제 지형·시설과 자료를 더 살핀다.",
      "모든 실제 집의 높이가 같다.",
      "수조 한 번으로 재난 시점을 안다.",
      "모형에 없으면 실제 피해도 없다.",
      "같은 모형을 다른 도시로 부른다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "실제 위험은 지형·시설·물높이와 지역 자료를 더 확인해야 한다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E4",
      "type": "T12",
      "standard": "4과16-02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "모형의 한계와 피해 설명",
      "concept": "모형의 한계와 피해 설명",
      "inquirySkill": "모형의 한계와 피해 설명"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b70",
    "status": "authored",
    "prompt": "모형과 실제를 구별한 두 문장을 고르세요.",
    "givens": null,
    "choices": [
      "직접 한 실험과 제공된 기록을 나눈다.",
      "모형 집은 실제 모든 집을 대표하지 않는다.",
      "물1cm는 항상 실제1m와 같다.",
      "모형 한 번이면 미래 연도를 확정한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        1
      ]
    },
    "explanation": "모형의 범위와 직접/자료 상태를 밝히고 정하지 않은 축척·미래를 확정하지 않는다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E4",
      "type": "T12",
      "standard": "4과16-02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "모형의 한계와 피해 설명",
      "concept": "모형의 한계와 피해 설명",
      "inquirySkill": "모형의 한계와 피해 설명"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b71",
    "status": "authored",
    "prompt": "작은 수조·육지·집으로 실제 상황의 일부를 나타낸 것을 쓰세요. 보기: 모형, 실제해안",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "모형",
      "accepted": [
        "모형"
      ]
    },
    "explanation": "모형은 실제의 일부 특징을 나타내며 실제 공간 전체와 같지 않다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E4",
      "type": "T12",
      "standard": "4과16-02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "모형의 한계와 피해 설명",
      "concept": "모형의 한계와 피해 설명",
      "inquirySkill": "모형의 한계와 피해 설명"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b72",
    "status": "authored",
    "prompt": "친구가 수조에 물을 부은 결과만으로 “내년에 우리 집이 잠긴다”고 결론 냈습니다. 모형에서 알 수 있는 점과 모르는 점을 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "물높이가 높아지면 그 모형의 낮은 곳이나 집에 물이 닿을 수 있음을 살펴봤어요. 실제 집의 위치/높이·방호 시설·앞으로 물높이/시기를 확인하지 않아 내년의 피해를 확정할 수 없어요. 실제 안내와 지역 자료를 더 조사해요.",
      "rubric": {
        "required": [
          "모형 관찰 범위",
          "실제 지형/시기 미확인",
          "추가 자료/안내"
        ],
        "pass": "실제 근거·조건·한계를 선생님과 확인해요."
      }
    },
    "explanation": "물높이가 높아지면 그 모형의 낮은 곳이나 집에 물이 닿을 수 있음을 살펴봤어요. 실제 집의 위치/높이·방호 시설·앞으로 물높이/시기를 확인하지 않아 내년의 피해를 확정할 수 없어요. 실제 안내와 지역 자료를 더 조사해요.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E4",
      "type": "T12",
      "standard": "4과16-02",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "모형의 한계와 피해 설명",
      "concept": "모형의 한계와 피해 설명",
      "inquirySkill": "모형의 한계와 피해 설명"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b73",
    "status": "authored",
    "prompt": "필요 없는 빈 교실 조명을 줄일 방법을 조사합니다. 알맞은 방법을 고르세요.",
    "givens": null,
    "choices": [
      "모든 구역을 언제나 밝게 켠다.",
      "사용 구역별로 필요한 조명을 켠다.",
      "사람이 있는 곳도 무조건 어둡게 한다.",
      "전등을 켠 채 창문만 닫아 둔다.",
      "사용 시간 기록을 모두 지운다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "필요한 밝기·안전을 유지하며 사용하지 않는 구역의 낭비를 줄인다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E5",
      "type": "T13",
      "standard": "4과16-03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "생활 속 대응 방법 조사",
      "concept": "생활 속 대응 방법 조사",
      "inquirySkill": "생활 속 대응 방법 조사"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b74",
    "status": "authored",
    "prompt": "대응 방법 조사 카드로 알맞은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "방법 이름만 쓰고 효과를 확정",
      "모든 전기 사용을 잘못으로 정함",
      "방법·근거·내 여건을 함께 적음",
      "다른 집의 방식을 무조건 복사",
      "실행 전인데 실천 완료로 적음"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "방법의 근거와 참여 조건을 조사하고 실제 실행은 별도로 남긴다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E5",
      "type": "T13",
      "standard": "4과16-03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "생활 속 대응 방법 조사",
      "concept": "생활 속 대응 방법 조사",
      "inquirySkill": "생활 속 대응 방법 조사"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b75",
    "status": "authored",
    "prompt": "학교의 냉난방·환기 안내를 읽었습니다. 실천 방법으로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "환기할 곳까지 언제나 막아 둠",
      "더위에 힘들어도 도움을 받지 않음",
      "에너지 절약을 위해 물도 안 마심",
      "안내와 건강을 지키며 낭비를 줄임",
      "교실 설비를 학생 혼자 뜯어 바꿈"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "건강·환기·안내와 안전을 지키며 실천하고 위험한 설비 변경을 요구하지 않는다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E5",
      "type": "T13",
      "standard": "4과16-03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "생활 속 대응 방법 조사",
      "concept": "생활 속 대응 방법 조사",
      "inquirySkill": "생활 속 대응 방법 조사"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b76",
    "status": "authored",
    "prompt": "생활 속 대응 방법을 조사한 두 기록을 고르세요.",
    "givens": null,
    "choices": [
      "필요한 물건을 오래 쓰는 방법을 찾음",
      "모든 방법이 같은 효과라고 단정함",
      "계획표 저장을 실제 실천으로 셈",
      "사용하지 않는 조명 줄이기를 조사함"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    },
    "explanation": "자원/에너지 이용 방법을 조사하되 실제 행동과 효과는 별도로 확인한다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E5",
      "type": "T13",
      "standard": "4과16-03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "생활 속 대응 방법 조사",
      "concept": "생활 속 대응 방법 조사",
      "inquirySkill": "생활 속 대응 방법 조사"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b77",
    "status": "authored",
    "prompt": "필요 없는 에너지·자원 사용을 줄이는 행동을 쓰세요. 보기: 절약, 낭비",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "절약",
      "accepted": [
        "절약"
      ]
    },
    "explanation": "필요와 건강을 지키면서 불필요한 사용을 줄이는 것을 절약과 연결한다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E5",
      "type": "T13",
      "standard": "4과16-03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "생활 속 대응 방법 조사",
      "concept": "생활 속 대응 방법 조사",
      "inquirySkill": "생활 속 대응 방법 조사"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b78",
    "status": "authored",
    "prompt": "생활 속에서 조사할 기후변화 대응 방법 하나를 고르고 근거·실행 조건·더 확인할 점을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "빈 교실 조명을 줄이는 방법을 조사해요. 필요한 밝기와 안전·학교 운영 시간·구역별 조작 가능 여부를 확인해요. 실제로 줄인 사용과 계획을 나누고, 한 행동으로 특정 날씨가 곧바로 바뀌었다고 하지 않아요.",
      "rubric": {
        "required": [
          "대응 방법",
          "근거/여건",
          "실행/기후효과 범위"
        ],
        "pass": "실제 근거·조건·한계를 선생님과 확인해요."
      }
    },
    "explanation": "빈 교실 조명을 줄이는 방법을 조사해요. 필요한 밝기와 안전·학교 운영 시간·구역별 조작 가능 여부를 확인해요. 실제로 줄인 사용과 계획을 나누고, 한 행동으로 특정 날씨가 곧바로 바뀌었다고 하지 않아요.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E5",
      "type": "T13",
      "standard": "4과16-03",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "생활 속 대응 방법 조사",
      "concept": "생활 속 대응 방법 조사",
      "inquirySkill": "생활 속 대응 방법 조사"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b79",
    "status": "authored",
    "prompt": "폭염 관련 학교 안내가 나왔습니다. 활동 계획으로 알맞은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "가장 더운 시간에 운동량을 늘림",
      "힘들어도 물과 도움을 모두 거절",
      "더위를 못 느낀 친구만 기준 삼음",
      "보관한 계획을 실천 완료로 적음",
      "안내에 따라 활동·쉬는 시간을 조절"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "학교 안내와 개인 여건·도움을 확인하여 안전하게 참여한다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E5",
      "type": "T14",
      "standard": "4과16-03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "상황에 맞는 안전한 대응",
      "concept": "상황에 맞는 안전한 대응",
      "inquirySkill": "상황에 맞는 안전한 대응"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b80",
    "status": "authored",
    "prompt": "큰비 뒤 침수된 길이 있는 연습 상황입니다. 해야 할 일로 알맞은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "들어가지 않고 어른의 안내를 받음",
      "깊이를 재려고 혼자 들어감",
      "기록 사진을 위해 물속으로 이동",
      "잠긴 전기 기구를 혼자 만짐",
      "미실행이 싫어 위험한 곳을 건넘"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "재난 현장에 직접 들어가거나 전기 기구를 만지는 활동을 실천으로 요구하지 않는다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E5",
      "type": "T14",
      "standard": "4과16-03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "상황에 맞는 안전한 대응",
      "concept": "상황에 맞는 안전한 대응",
      "inquirySkill": "상황에 맞는 안전한 대응"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b81",
    "status": "authored",
    "prompt": "가뭄 대응으로 물 사용을 줄이려 합니다. 바른 조건을 고르세요.",
    "givens": null,
    "choices": [
      "식수와 손 씻는 물을 모두 끊는다.",
      "위생·건강에 필요한 물은 지킨다.",
      "사용량은 보지 않고 성공을 정한다.",
      "다른 사람의 필요를 무시한다.",
      "안 했어도 실천했다고 적는다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "필수적인 위생·건강과 참여 여건을 지키며 불필요한 사용을 줄인다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E5",
      "type": "T14",
      "standard": "4과16-03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "상황에 맞는 안전한 대응",
      "concept": "상황에 맞는 안전한 대응",
      "inquirySkill": "상황에 맞는 안전한 대응"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b82",
    "status": "authored",
    "prompt": "상황에 맞게 대응 방법을 고르는 두 기준을 고르세요.",
    "givens": null,
    "choices": [
      "가장 위험한 방법인지 여부",
      "모든 사람의 필요가 같은지 단정",
      "건강·참여 여건과 실행 가능성",
      "위험 안내와 필요한 도움"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        2,
        3
      ]
    },
    "explanation": "안전 안내·도움·개인/공동 여건을 살피며 같은 행동을 무조건 강요하지 않는다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E5",
      "type": "T14",
      "standard": "4과16-03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "상황에 맞는 안전한 대응",
      "concept": "상황에 맞는 안전한 대응",
      "inquirySkill": "상황에 맞는 안전한 대응"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b83",
    "status": "authored",
    "prompt": "위험한 상황에서 혼자 해결하기보다 교사·보호자에게 요청할 것을 쓰세요. 보기: 도움, 책임전가",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "도움",
      "accepted": [
        "도움"
      ]
    },
    "explanation": "필요한 도움을 요청하는 것은 안전한 참여를 위한 행동이며 책임 전가와 다르다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E5",
      "type": "T14",
      "standard": "4과16-03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "상황에 맞는 안전한 대응",
      "concept": "상황에 맞는 안전한 대응",
      "inquirySkill": "상황에 맞는 안전한 대응"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b84",
    "status": "authored",
    "prompt": "폭염 대응 방법을 고르면서 한 친구의 건강·참여 조건이 다르다는 것을 알았습니다. 함께 실천할 방법을 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "학교 안내와 친구에게 필요한 도움을 확인해요. 위험한 더위 노출을 피하고 활동 시간·장소·쉬는 방법을 조절할 수 있어요. 서로 가능한 역할을 정하고 하지 못한 행동도 이유와 다음 계획으로 남겨요.",
      "rubric": {
        "required": [
          "안내/건강",
          "방법 조절/도움",
          "역할·미실행 존중"
        ],
        "pass": "실제 근거·조건·한계를 선생님과 확인해요."
      }
    },
    "explanation": "학교 안내와 친구에게 필요한 도움을 확인해요. 위험한 더위 노출을 피하고 활동 시간·장소·쉬는 방법을 조절할 수 있어요. 서로 가능한 역할을 정하고 하지 못한 행동도 이유와 다음 계획으로 남겨요.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E5",
      "type": "T14",
      "standard": "4과16-03",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "상황에 맞는 안전한 대응",
      "concept": "상황에 맞는 안전한 대응",
      "inquirySkill": "상황에 맞는 안전한 대응"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b85",
    "status": "authored",
    "prompt": "두 대응 방법을 비교하려고 합니다. 알맞은 비교 항목을 고르세요.",
    "givens": null,
    "choices": [
      "발표자의 키만 비교하기",
      "그림 색깔 수만 비교하기",
      "근거·안전·준비·확인 방법",
      "친구 이름의 글자 수 세기",
      "불가능한 결과를 먼저 확정하기"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "기대한 도움의 근거와 안전·준비·실행/확인 조건으로 방법을 비교한다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E5",
      "type": "T15",
      "standard": "4과16-03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "방법 비교와 실천 계획",
      "concept": "방법 비교와 실천 계획",
      "inquirySkill": "방법 비교와 실천 계획"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b86",
    "status": "authored",
    "prompt": "실천 계획으로 구체적인 것을 고르세요.",
    "givens": null,
    "choices": [
      "좋은 일을 언젠가 하기로 함",
      "실행하지 않고 모두 성공이라 함",
      "다른 사람의 행동을 추측해 씀",
      "담당·시기·행동·확인 기준을 정함",
      "어려운 점은 기록에서 지우기로 함"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "누가 언제 무엇을 어떻게 확인할지 정하고 실제 결과는 이후 기록한다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E5",
      "type": "T15",
      "standard": "4과16-03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "방법 비교와 실천 계획",
      "concept": "방법 비교와 실천 계획",
      "inquirySkill": "방법 비교와 실천 계획"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b87",
    "status": "authored",
    "prompt": "방법A는 오늘 바로 가능하고 방법B는 학교의 시설 도움이 필요합니다. 알맞은 선택은 무엇인가요?",
    "givens": null,
    "choices": [
      "도움이 필요한 방법은 모두 나쁨",
      "개인이 모든 시설을 혼자 고침",
      "두 방법은 조건 없이 효과가 같음",
      "계획만 저장하면 시설이 바뀜",
      "가능한 역할과 필요한 도움을 나눔"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "실행 가능성과 공동 도움을 나누어 계획할 수 있으며 시설 변경을 학생 혼자 요구하지 않는다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E5",
      "type": "T15",
      "standard": "4과16-03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "방법 비교와 실천 계획",
      "concept": "방법 비교와 실천 계획",
      "inquirySkill": "방법 비교와 실천 계획"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b88",
    "status": "authored",
    "prompt": "실천 전 계획에 포함할 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "기대 효과를 실제 측정값으로 적기",
      "실제로 했는지 확인할 방법",
      "언제·어디서·어떤 역할로 할지",
      "아직 없는 친구의 발언을 지어 쓰기"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        2
      ]
    },
    "explanation": "시기·역할·확인 방법을 계획하고 실제 발언/결과를 미리 만들어 넣지 않는다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E5",
      "type": "T15",
      "standard": "4과16-03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "방법 비교와 실천 계획",
      "concept": "방법 비교와 실천 계획",
      "inquirySkill": "방법 비교와 실천 계획"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b89",
    "status": "authored",
    "prompt": "연습 계획에서 월요일부터 금요일까지 매일 한 번 확인하려 합니다. 확인할 날은 모두 며칠인가요?",
    "givens": {
      "자료 성격": "실행 전 연습 계획"
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "5",
      "accepted": [
        "5",
        "5일"
      ]
    },
    "explanation": "월·화·수·목·금의5일이다. 실제5일 실천했다는 뜻이 아니다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E5",
      "type": "T15",
      "standard": "4과16-03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "방법 비교와 실천 계획",
      "concept": "방법 비교와 실천 계획",
      "inquirySkill": "방법 비교와 실천 계획"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b90",
    "status": "authored",
    "prompt": "사용하지 않는 교실 조명을 줄이기 위한 실천 계획을 세우세요. 필요한 밝기·역할·실제 확인을 포함하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "사용하지 않는 구역과 필요한 밝기를 교사와 확인해요. 정한 시각에 담당이 안전한 범위에서 조명 상태를 살피고 실제 껐는지·끄지 못한 이유를 날짜별로 남겨요. 설비 도움이 필요하면 학교에 요청할 내용을 나눠요.",
      "rubric": {
        "required": [
          "밝기/안전",
          "시기/역할",
          "날짜별 확인/도움"
        ],
        "pass": "실제 근거·조건·한계를 선생님과 확인해요."
      }
    },
    "explanation": "사용하지 않는 구역과 필요한 밝기를 교사와 확인해요. 정한 시각에 담당이 안전한 범위에서 조명 상태를 살피고 실제 껐는지·끄지 못한 이유를 날짜별로 남겨요. 설비 도움이 필요하면 학교에 요청할 내용을 나눠요.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E5",
      "type": "T15",
      "standard": "4과16-03",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "방법 비교와 실천 계획",
      "concept": "방법 비교와 실천 계획",
      "inquirySkill": "방법 비교와 실천 계획"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b91",
    "status": "authored",
    "prompt": "계획한 행동을 오늘 하지 못했습니다. 바른 기록을 고르세요.",
    "givens": null,
    "choices": [
      "미실행 이유와 다음 계획을 적음",
      "한 것으로 바꾸어 결과를 적음",
      "다른 날의 횟수를 오늘로 옮김",
      "못 한 날의 기록을 모두 삭제",
      "친구가 했으니 나도 완료로 적음"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "하지 못한 날과 이유도 보존하고 실제 한 일과 계획을 나눈다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E6",
      "type": "T16",
      "standard": "4과16-03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "날짜별 실제 실천과 미실행",
      "concept": "날짜별 실제 실천과 미실행",
      "inquirySkill": "날짜별 실제 실천과 미실행"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b92",
    "status": "authored",
    "prompt": "월요일 행동과 목요일의 수정된 행동을 기록합니다. 알맞은 보관 방법은 무엇인가요?",
    "givens": null,
    "choices": [
      "앞선 결과를 오늘 값으로 바꾼다.",
      "날짜별 새 기록으로 남긴다.",
      "성공한 날만 남기고 지운다.",
      "두 날을 매일 같은 행동이라 쓴다.",
      "안 한 날도 평균으로 채운다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "날짜·행동·조건을 독립 보존해야 수정과 실제 변화를 비교할 수 있다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E6",
      "type": "T16",
      "standard": "4과16-03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "날짜별 실제 실천과 미실행",
      "concept": "날짜별 실제 실천과 미실행",
      "inquirySkill": "날짜별 실제 실천과 미실행"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b93",
    "status": "authored",
    "prompt": "실천 기록에 적을 실제 근거로 알맞은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "앞으로 하려는 횟수를 실적으로 씀",
      "자료 속 다른 사람 행동을 내 것으로 씀",
      "그날 실제 행동과 확인한 횟수",
      "저장 버튼을 누른 수를 실천 횟수로 씀",
      "기대했던 성공 모습을 실제로 씀"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "실제 행동/확인 횟수와 계획·저장·타인의 자료를 구별한다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E6",
      "type": "T16",
      "standard": "4과16-03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "날짜별 실제 실천과 미실행",
      "concept": "날짜별 실제 실천과 미실행",
      "inquirySkill": "날짜별 실제 실천과 미실행"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b94",
    "status": "authored",
    "prompt": "날짜별 실천 기록에서 바른 두 문장을 고르세요.",
    "givens": null,
    "choices": [
      "못 한 이유와 도움을 적는다.",
      "일부만 한 날도 남긴다.",
      "모든 계획은 실제 실행으로 센다.",
      "기록을 내보내면 공유도 완료다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        1
      ]
    },
    "explanation": "부분 실행/미실행도 보존하며 계획·파일 저장과 실제 행동을 구별한다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E6",
      "type": "T16",
      "standard": "4과16-03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "날짜별 실제 실천과 미실행",
      "concept": "날짜별 실제 실천과 미실행",
      "inquirySkill": "날짜별 실제 실천과 미실행"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b95",
    "status": "authored",
    "prompt": "연습 기록에서 월·화·목에 실행했고 수·금에는 하지 못했습니다. 실제 실행한 날 수를 쓰세요.",
    "givens": {
      "자료 성격": "계획과 실제를 구별하는 연습 기록"
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "3",
      "accepted": [
        "3",
        "3일"
      ]
    },
    "explanation": "실행했다고 제시한 월·화·목3일을 센다. 실제 학생의 수행 증거가 아닌 연습 기록이다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E6",
      "type": "T16",
      "standard": "4과16-03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "날짜별 실제 실천과 미실행",
      "concept": "날짜별 실제 실천과 미실행",
      "inquirySkill": "날짜별 실제 실천과 미실행"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b96",
    "status": "authored",
    "prompt": "물건을 오래 쓰는 실천을 일부만 했고 나머지는 하지 못했습니다. 기록에 어떤 내용을 남길까요?",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "날짜와 실제 오래 사용한 물건/행동·확인한 범위를 적어요. 하지 못한 부분·이유·도움과 다음 계획도 남겨요. 계획한 전체를 실천 완료로 바꾸거나 하지 않은 날을 삭제하지 않아요.",
      "rubric": {
        "required": [
          "실제 날짜/범위",
          "부분/미실행 이유",
          "도움/계획 구별"
        ],
        "pass": "실제 근거·조건·한계를 선생님과 확인해요."
      }
    },
    "explanation": "날짜와 실제 오래 사용한 물건/행동·확인한 범위를 적어요. 하지 못한 부분·이유·도움과 다음 계획도 남겨요. 계획한 전체를 실천 완료로 바꾸거나 하지 않은 날을 삭제하지 않아요.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E6",
      "type": "T16",
      "standard": "4과16-03",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "날짜별 실제 실천과 미실행",
      "concept": "날짜별 실제 실천과 미실행",
      "inquirySkill": "날짜별 실제 실천과 미실행"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b97",
    "status": "authored",
    "prompt": "일회용 컵을 덜 쓴 기록으로 직접 알 수 있는 것을 고르세요.",
    "givens": null,
    "choices": [
      "다음 날 전국 기온의 원인",
      "지구 전체 해수면 변화량",
      "모든 지역의 홍수 해소 여부",
      "기록 범위의 컵 사용 변화",
      "모든 생산 공정의 배출 총량"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "사용 기록이 보여 주는 행동 변화와 기후 전체의 측정을 구별한다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E6",
      "type": "T17",
      "standard": "4과16-03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "실천 효과·어려움·수정",
      "concept": "실천 효과·어려움·수정",
      "inquirySkill": "실천 효과·어려움·수정"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b98",
    "status": "authored",
    "prompt": "실천 전후 사용량을 비교할 때 같은 기준으로 두어야 할 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "보고서 표지의 장식 개수",
      "사용자의 생일과 띠",
      "발표를 듣는 사람의 키",
      "교실 벽지 색깔 이름",
      "대상·기간·세는 방법"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "같은 대상/기간/집계 기준을 확인해야 행동/사용량 차이를 비교할 수 있다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E6",
      "type": "T17",
      "standard": "4과16-03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "실천 효과·어려움·수정",
      "concept": "실천 효과·어려움·수정",
      "inquirySkill": "실천 효과·어려움·수정"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b99",
    "status": "authored",
    "prompt": "실천 뒤 기대한 변화가 분명하지 않습니다. 알맞은 다음 행동을 고르세요.",
    "givens": null,
    "choices": [
      "기록과 조건을 보고 방법을 보완",
      "효과가 큰 숫자로 값을 바꿈",
      "기대와 다른 기록을 모두 지움",
      "도움 요청을 모두 포기함",
      "미측정을 효과 없음으로 확정"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "관찰 범위·다른 조건·어려움을 검토하고 실제 수정과 다음 계획을 나눈다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E6",
      "type": "T17",
      "standard": "4과16-03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "실천 효과·어려움·수정",
      "concept": "실천 효과·어려움·수정",
      "inquirySkill": "실천 효과·어려움·수정"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b100",
    "status": "authored",
    "prompt": "실천 효과를 정리하는 바른 두 문장을 고르세요.",
    "givens": null,
    "choices": [
      "확인한 사용량 변화만 말한다.",
      "한 행동으로 모든 기후 문제를 해결했다.",
      "측정하지 않은 해수면 변화량을 적는다.",
      "다른 조건이 달랐는지 살핀다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    },
    "explanation": "실제 비교 범위와 조건을 밝히고 기후 전체의 효과를 과장하지 않는다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E6",
      "type": "T17",
      "standard": "4과16-03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "실천 효과·어려움·수정",
      "concept": "실천 효과·어려움·수정",
      "inquirySkill": "실천 효과·어려움·수정"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b101",
    "status": "authored",
    "prompt": "연습 기록에서 같은 기준의 컵 사용이12개에서9개가 되었습니다. 줄어든 수를 쓰세요.",
    "givens": {
      "자료 성격": "실제 학생 측정이 아닌 연습 집계"
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "3",
      "accepted": [
        "3",
        "3개"
      ]
    },
    "explanation": "12-9=3개이며 해당 연습 기록의 사용량 차이다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E6",
      "type": "T17",
      "standard": "4과16-03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "실천 효과·어려움·수정",
      "concept": "실천 효과·어려움·수정",
      "inquirySkill": "실천 효과·어려움·수정"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b102",
    "status": "authored",
    "prompt": "전기 사용량이 줄었지만 날씨와 교실 이용 인원도 달랐습니다. 실천 효과를 어떻게 설명하고 다시 확인할까요?",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "그 기간의 사용량이 줄었다는 사실과 실천만의 효과를 나누어요. 날씨·인원·이용 시간·세는 기준을 확인하고 가능한 같은 조건에서 추가로 기록해요. 다른 조건을 숨기거나 기후 전체 효과로 바꾸지 않아요.",
      "rubric": {
        "required": [
          "관찰 사실/원인 구별",
          "다른 조건",
          "같은 기준 추가 확인"
        ],
        "pass": "실제 근거·조건·한계를 선생님과 확인해요."
      }
    },
    "explanation": "그 기간의 사용량이 줄었다는 사실과 실천만의 효과를 나누어요. 날씨·인원·이용 시간·세는 기준을 확인하고 가능한 같은 조건에서 추가로 기록해요. 다른 조건을 숨기거나 기후 전체 효과로 바꾸지 않아요.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E6",
      "type": "T17",
      "standard": "4과16-03",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "실천 효과·어려움·수정",
      "concept": "실천 효과·어려움·수정",
      "inquirySkill": "실천 효과·어려움·수정"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b103",
    "status": "authored",
    "prompt": "만든 대응 안내문을 파일로만 저장했습니다. 상태를 바르게 적은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "실제 모든 친구에게 전달",
      "자료 작성 · 아직 미공유",
      "학교 전체 실천 완료",
      "질문·의견 모두 수신",
      "수정 후 재공유 완료"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "파일 저장과 실제 전달·실천·의견 수신은 구별한다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E6",
      "type": "T18",
      "standard": "4과16-03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "실제 공유·의견·함께 실천",
      "concept": "실제 공유·의견·함께 실천",
      "inquirySkill": "실제 공유·의견·함께 실천"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b104",
    "status": "authored",
    "prompt": "안내문을 실제로 보여 주었지만 질문을 받지 못했습니다. 알맞은 기록을 고르세요.",
    "givens": null,
    "choices": [
      "친구의 칭찬을 만들어 적음",
      "아무에게도 안 보였다고 바꿈",
      "실제 공유 · 의견 미수신",
      "모든 사람이 동의했다고 씀",
      "수정과 재시험도 완료로 씀"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "전달한 사실과 의견을 받지 못한 상태를 함께 보존한다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E6",
      "type": "T18",
      "standard": "4과16-03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "실제 공유·의견·함께 실천",
      "concept": "실제 공유·의견·함께 실천",
      "inquirySkill": "실제 공유·의견·함께 실천"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b105",
    "status": "authored",
    "prompt": "학급에서 개인이 하기 어려운 대응을 찾았습니다. 함께 할 방법으로 알맞은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "한 학생에게 모든 책임을 줌",
      "시설을 학생끼리 몰래 뜯어 고침",
      "어려운 일은 조사에서 모두 삭제",
      "학교에 필요한 도움·역할을 제안",
      "계획 없이 모두 해결됐다고 발표"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "개인·학교·가정/지역의 역할과 필요한 도움을 함께 논의할 수 있다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E6",
      "type": "T18",
      "standard": "4과16-03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "실제 공유·의견·함께 실천",
      "concept": "실제 공유·의견·함께 실천",
      "inquirySkill": "실제 공유·의견·함께 실천"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b106",
    "status": "authored",
    "prompt": "실제 의견을 받은 뒤 남길 두 내용을 고르세요.",
    "givens": null,
    "choices": [
      "예상 질문을 실제 발언으로 바꾸기",
      "재공유하지 않고 완료로 적기",
      "실제로 고친 부분과 다음 계획",
      "받은 질문·의견과 이유"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        2,
        3
      ]
    },
    "explanation": "실제 피드백·수정·재공유 결과와 앞으로 계획을 나누어 기록한다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E6",
      "type": "T18",
      "standard": "4과16-03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "topic": "실제 공유·의견·함께 실천",
      "concept": "실제 공유·의견·함께 실천",
      "inquirySkill": "실제 공유·의견·함께 실천"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b107",
    "status": "authored",
    "prompt": "실제로 안내문을 전달했지만 의견은 받지 못한 상태를 쓰세요. 보기: 의견 미수신, 의견 합의",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "의견 미수신",
      "accepted": [
        "의견 미수신",
        "의견미수신",
        "미수신"
      ]
    },
    "explanation": "실제 공유와 의견 수신은 다른 상태이다.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E6",
      "type": "T18",
      "standard": "4과16-03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "topic": "실제 공유·의견·함께 실천",
      "concept": "실제 공유·의견·함께 실천",
      "inquirySkill": "실제 공유·의견·함께 실천"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "c22-s42-u04-b108",
    "status": "authored",
    "prompt": "기후변화 대응 활동을 실제로 소개하고 의견으로 고치려 합니다. 전달·피드백·수정·다음 실천을 구별하여 기록할 방법을 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "실제 전달한 날짜·대상 범위·방법과 자료 출처/내 실천 근거를 적어요. 받은 의견과 미수신을 나누고 실제 고친 내용·이유를 남겨요. 다시 보여 준 결과나 다음에 실행할 행동은 아직 계획인지 실제인지 구별해요.",
      "rubric": {
        "required": [
          "실제 전달/출처",
          "의견/미수신",
          "실제 수정/재공유/계획"
        ],
        "pass": "실제 근거·조건·한계를 선생님과 확인해요."
      }
    },
    "explanation": "실제 전달한 날짜·대상 범위·방법과 자료 출처/내 실천 근거를 적어요. 받은 의견과 미수신을 나누고 실제 고친 내용·이유를 남겨요. 다시 보여 준 결과나 다음에 실행할 행동은 아직 계획인지 실제인지 구별해요.",
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "u04",
      "area": "환경",
      "element": "E6",
      "type": "T18",
      "standard": "4과16-03",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "topic": "실제 공유·의견·함께 실천",
      "concept": "실제 공유·의견·함께 실천",
      "inquirySkill": "실제 공유·의견·함께 실천"
    },
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "2022 개정 현행 범위 보충",
      "note": "원문 짝이 아닌 독립 창작. 명시한 연습 수치/모형/기록은 실제 학생 실험·실천·소통 증거가 아님."
    },
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "현행기준·자료범위·응답계약 내용 검토",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    }
  }
];
export {climateBankPaperHtml as bankPaper,wireClimateBankPaper as wireBankPaper} from '../../v2/climate-bank-paper.js';
