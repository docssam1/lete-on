export const unit = {
  "id": "c22-s42-mid",
  "course": "4-2",
  "no": null,
  "title": "중간평가 · 창작",
  "domain": "종합",
  "sources": {
    "basis": [
      "science-lab/bank/work/c22s42u01/curriculum.json",
      "science-lab/bank/work/c22s42u02/curriculum.json"
    ],
    "originalExamAvailable": false
  },
  "assessment": {
    "authored": true,
    "forms": [
      1,
      2
    ],
    "perForm": 36,
    "scope": [
      "밤하늘 관찰",
      "생물과 환경"
    ],
    "scopeNote": "1~2단원 학습용 구성·학교별 공식 시험 범위와 별개",
    "performanceNote": "실제 관찰·설계·제작·조사·실천·소통은 별도 확인한다."
  }
};
export const items = [
  {
    "id": "c22-s42-mid-f1-01",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 1,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-01",
      "topic": "달의 모습·여러 날 관찰",
      "concept": "달의 모습·여러 날 관찰",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "여러 날 달을 관찰한 가상 기록입니다. 자료에 맞는 설명은 무엇인가요?",
    "givens": {
      "가상 관찰 자료": {
        "머리": [
          "관찰일",
          "같은 장소의 기록"
        ],
        "행": [
          [
            "첫째 날",
            "가느다란 모양"
          ],
          [
            "셋째 날",
            "구름으로 못 봄"
          ],
          [
            "여섯째 날",
            "반원에 가까운 모양"
          ]
        ],
        "caption": "가상 관찰 자료"
      }
    },
    "choices": [
      "셋째 날에는 달이 사라진 것이 확실하다.",
      "달 표면의 모든 무늬가 매일 바뀌었다.",
      "구름 낀 날도 같은 모양을 직접 보았다.",
      "보인 달의 모양이 날짜에 따라 달랐다.",
      "한 번만 보면 한 달의 변화를 모두 안다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "기록이 있는 날의 보인 모양을 비교해요. 구름으로 못 본 날은 달이 없었다는 뜻이 아니에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-02",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 2,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-01",
      "topic": "달의 모습·여러 날 관찰",
      "concept": "달의 모습·여러 날 관찰",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "달 표면 사진과 직접 관찰을 구별하여 기록하는 방법 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "직접 본 날짜·장소·모양과 미관찰을 나눈다.",
      "못 본 날은 앞날의 관찰값을 그대로 복사한다.",
      "사진에서 본 무늬를 오늘 직접 본 것으로 옮긴다.",
      "모양이 다르면 달의 재료가 바뀌었다고 확정한다.",
      "교사 제공 사진을 본 사실과 출처를 적는다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        4
      ]
    },
    "explanation": "자료를 본 것과 직접 관찰한 것을 나누어야 관찰 근거가 분명해요. 변화의 원인을 반드시 설명하도록 요구하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-03",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 3,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-01",
      "topic": "달의 모습·여러 날 관찰",
      "concept": "달의 모습·여러 날 관찰",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "가상 관찰표에서 실제 달을 본 날은 4일, 구름으로 못 본 날은 2일입니다. 실제로 본 날 수만 숫자로 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "4",
      "accepted": [
        "4"
      ]
    },
    "explanation": "못 본 두 날을 실제 관찰한 날 수에 더하지 않아요. 가상 기록의 관찰한 날은 네 날이에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-04",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 4,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-01",
      "topic": "달의 모습·여러 날 관찰",
      "concept": "달의 모습·여러 날 관찰",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "달 관찰 모둠이 못 본 날까지 모두 같은 모양으로 채웠습니다. 기록을 바로잡고 다음 관찰에서 함께 남길 조건을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "못 본 날은 구름 등 이유와 미관찰로 고친다. 실제로 본 날짜·시각·장소와 방향·보인 모양을 남기고 제공 자료나 예측은 실제 관찰과 나눈다.",
      "rubric": {
        "required": [
          "미관찰·자료·실제 관찰 구별",
          "실제 관찰의 시각·장소·방향·모양 기록"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "빈 기록을 예상으로 채우면 실제로 관찰한 변화인지 확인하기 어려워요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-05",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 5,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-01",
      "topic": "달의 모습·여러 날 관찰",
      "concept": "달의 모습·여러 날 관찰",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "달의 표면을 확대한 제공 자료에서 둥근 움푹한 자국이 보였습니다. 이 자료로 직접 확인한 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "사진에 움푹한 자국이 보인다는 것",
      "사진만으로 모든 자국의 생긴 날짜를 안다는 것",
      "자료의 인쇄 크기가 실제 자국 크기라는 것",
      "밤마다 달 표면의 자국이 모두 새로 생긴다는 것",
      "오늘 밤 실제 달의 같은 자국을 만졌다는 것"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "사진에서 보이는 특징과 직접 확인하지 않은 사실을 구별해요. 실제 달의 크기나 자국의 생성 시각을 사진만으로 확정하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-06",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 6,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-01",
      "topic": "달의 모습·여러 날 관찰",
      "concept": "달의 모습·여러 날 관찰",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "다음 기록 중 직접 관찰이 아니라 제공 자료를 본 기록의 기호를 쓰세요.",
    "givens": {
      "연습 자료": "ㄱ 보호자와 창가에서 날짜·시각을 적고 달 모양을 그렸다. / ㄴ 교사가 준비한 달 표면 사진에서 무늬를 찾았다. / ㄷ 구름 때문에 못 보았다고 적었다."
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "ㄴ은 제공 사진을 본 활동이에요. 직접 밤하늘에서 본 관찰과 구별하여 기록해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-07",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 7,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-02",
      "topic": "태양계 구성원 조사",
      "concept": "태양계 구성원 조사",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "태양계 조사 카드에서 행성으로 분류할 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "북두칠성",
      "지구",
      "태양",
      "달",
      "북극성"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "지구는 태양계의 행성이에요. 태양은 별, 달은 행성과 구별하며 북두칠성은 별자리의 일부로 살펴요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-08",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 8,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-02",
      "topic": "태양계 구성원 조사",
      "concept": "태양계 구성원 조사",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "태양과 행성 소개 자료를 만드는 방법 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "달을 태양계의 아홉 번째 행성이라고 쓴다.",
      "책의 그림 간격이 실제 거리와 같다고 쓴다.",
      "행성은 모두 스스로 빛을 낸다고 소개한다.",
      "지구를 포함한 행성 이름을 확인한다.",
      "태양이 스스로 빛을 내는 별임을 소개한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        3,
        4
      ]
    },
    "explanation": "태양·행성·달을 구별해요. 그림의 크기나 간격이 실제 축척이라고 임의로 판단하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-09",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 9,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-02",
      "topic": "태양계 구성원 조사",
      "concept": "태양계 구성원 조사",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "학교 자료에서 태양계의 행성을 수성·금성·지구·화성·목성·토성·천왕성·해왕성으로 정리했습니다. 이 자료의 행성 수는 몇 개인가요? 숫자만 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "8",
      "accepted": [
        "8"
      ]
    },
    "explanation": "제시한 행성 여덟 개를 세어요. 태양이나 달을 행성 수에 더하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-10",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 10,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-02",
      "topic": "태양계 구성원 조사",
      "concept": "태양계 구성원 조사",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "행성 모형을 만들며 점토 공을 모두 같은 크기로 정했습니다. 이 모형으로 표현한 것과 실제 크기를 표현하지 못한 점을 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "행성의 이름과 태양계 구성원을 구별하는 데 모형을 쓸 수 있다. 공을 모두 같은 크기로 했으므로 실제 행성 크기 비율을 표현한 모형은 아니라고 표시한다.",
      "rubric": {
        "required": [
          "구성원·이름의 표현 목적",
          "같은 크기 공과 실제 크기 비율 구별"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "모형이 표현하려는 내용과 생략한 내용을 설명해요. 실제 물리량의 암기를 요구하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-11",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 11,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-02",
      "topic": "태양계 구성원 조사",
      "concept": "태양계 구성원 조사",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "학생이 태양 사진과 목성 사진을 같은 크기로 인쇄했습니다. 사진 크기에 대한 설명은 무엇인가요?",
    "givens": null,
    "choices": [
      "태양과 목성의 실제 크기는 항상 같다.",
      "실제 크기가 같다는 근거가 되지 않는다.",
      "작게 인쇄된 천체는 태양계 구성원이 아니다.",
      "사진을 크게 인쇄하면 실제 천체도 커진다.",
      "사진의 지름만 재면 실제 거리가 바로 나온다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "인쇄 크기와 실제 천체 크기는 달라요. 크기 비교 자료의 기준이나 축척이 없다면 실제 비율을 확정하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-12",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 12,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-02",
      "topic": "태양계 구성원 조사",
      "concept": "태양계 구성원 조사",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "태양계 조사 대상 중 스스로 빛을 내는 별의 이름을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "태양",
      "accepted": [
        "태양"
      ]
    },
    "explanation": "태양은 스스로 빛을 내는 별이에요. 행성과 같은 종류로 분류하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-13",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 13,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-03",
      "topic": "별·북극성 주변 관찰",
      "concept": "별·북극성 주변 관찰",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "밤하늘 자료에서 별을 구별하는 기준으로 맞는 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "달은 밝으므로 반드시 별이다.",
      "동그랗게 보이면 모두 별이다.",
      "밝게 보이는 행성도 모두 별이다.",
      "밤에 보이면 모두 별이다.",
      "스스로 빛을 내는 천체이다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "별은 스스로 빛을 내는 천체로 배워요. 단지 밤에 밝게 보인다는 이유로 달·행성을 모두 별이라 하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-14",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 14,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-03",
      "topic": "별·북극성 주변 관찰",
      "concept": "별·북극성 주변 관찰",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "북극성 주변 별자리를 관찰할 때 기록할 내용 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "관찰하지 않은 날을 관찰 완료로 바꾼 표시",
      "모든 별자리가 한 계절에만 있다는 단정",
      "모르는 별의 이름을 확인 없이 채운 목록",
      "직접 본 별의 배치와 제공 자료의 구별",
      "관찰한 시각과 북쪽 방향의 기준"
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        3,
        4
      ]
    },
    "explanation": "북극성 주변의 배치와 방향·시각을 확인해요. 이름이 불분명한 부분은 미확인으로 남겨 자료와 대조해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-15",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 15,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-03",
      "topic": "별·북극성 주변 관찰",
      "concept": "별·북극성 주변 관찰",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "관찰 안내에 “북극성 주변을 먼저 살펴보자.”라고 적었습니다. 어느 방향을 기준으로 살펴보는지 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "북쪽",
      "accepted": [
        "북쪽",
        "북"
      ]
    },
    "explanation": "북극성 주변을 살펴볼 때는 북쪽 방향을 기준으로 해요. 관찰 장소의 방향 기준을 먼저 확인해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-16",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 16,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-03",
      "topic": "별·북극성 주변 관찰",
      "concept": "별·북극성 주변 관찰",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "관측 프로그램 화면을 보고 북극성 주변 별 배치를 그렸습니다. 실제 야외 관찰을 한 것처럼 적지 않으려면 어떤 내용을 남겨야 하나요?",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "관측 프로그램을 사용했다는 사실과 설정한 장소·시각·방향을 적는다. 화면에서 본 배치와 실제 야외에서 본 결과를 나누고 직접 보지 못한 것은 미관찰로 남긴다.",
      "rubric": {
        "required": [
          "프로그램 사용과 설정 기록",
          "화면 자료와 직접 야외 관찰 구별"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "시청각 자료로 배울 수 있지만 실제 밤하늘 관찰과 같은 증거로 기록하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-17",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 17,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-03",
      "topic": "별·북극성 주변 관찰",
      "concept": "별·북극성 주변 관찰",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "같은 방향의 하늘을 보았는데 한 친구는 건물 때문에 일부 별이 가려졌습니다. 적절한 기록은 무엇인가요?",
    "givens": null,
    "choices": [
      "가려진 별은 우주에서 사라졌다고 확정한다.",
      "밝은 별 하나면 모든 별자리 이름을 안다고 쓴다.",
      "가려진 부분은 확인하지 못했다고 적는다.",
      "건물이 가려도 모든 별을 직접 봤다고 적는다.",
      "친구 그림을 내 직접 관찰로 복사해 적는다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "관찰이 불가능했던 부분과 실제 보인 부분을 구별해요. 한 장소에서 안 보였다는 것이 천체가 사라졌다는 뜻은 아니에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-18",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 18,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-03",
      "topic": "별·북극성 주변 관찰",
      "concept": "별·북극성 주변 관찰",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "교사 제공 별자리 자료에서 북극성 주변에 W 모양으로 소개한 별자리 이름을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "카시오페이아자리",
      "accepted": [
        "카시오페이아자리",
        "카시오페이아"
      ]
    },
    "explanation": "제시한 W 모양과 이름을 연결해 카시오페이아자리로 살펴요. 종이의 배치가 언제나 실제 하늘의 같은 방향으로 놓인다는 뜻은 아니에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-19",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 19,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-01",
      "topic": "생태계 구성 요소",
      "concept": "생태계 구성 요소",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "학교 연못의 조사 목록입니다. 비생물 요소에 해당하는 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "햇빛",
      "개구리",
      "물풀",
      "물고기",
      "잠자리"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "햇빛은 비생물 요소, 제시한 동물과 물풀은 생물 요소예요. 생태계에는 두 종류 요소가 함께 있어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-20",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 20,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-01",
      "topic": "생태계 구성 요소",
      "concept": "생태계 구성 요소",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "숲 생태계를 조사한 기록 중 타당한 것을 두 가지 고르세요.",
    "givens": null,
    "choices": [
      "움직이지 않는 식물은 모두 비생물로 정한다.",
      "생태계는 동물만 있으므로 물은 조사하지 않는다.",
      "사진에 안 나온 생물은 숲에 전혀 없다고 쓴다.",
      "나무·곤충과 물·빛을 함께 조사한다.",
      "조사 장소·시점과 실제 확인한 요소를 남긴다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        3,
        4
      ]
    },
    "explanation": "생물·비생물 요소를 함께 살피고 관찰 범위를 적어요. 움직임이나 사진 한 장만으로 생물 여부·존재를 확정하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-21",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 21,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-01",
      "topic": "생태계 구성 요소",
      "concept": "생태계 구성 요소",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "보기 중 비생물 요소 두 개를 조사했습니다. 물과 함께 비생물 요소인 낱말 하나를 쓰세요.",
    "givens": {
      "연습 자료": "보기: 물 / 흙 / 나비 / 풀"
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "흙",
      "accepted": [
        "흙"
      ]
    },
    "explanation": "물과 흙은 비생물 요소예요. 나비와 풀은 생물 요소로 나누어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-22",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 22,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-01",
      "topic": "생태계 구성 요소",
      "concept": "생태계 구성 요소",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "한 모둠이 숲 생태계 사진에서 동물만 표시했습니다. 조사표를 보완하려면 어떤 요소와 관찰 조건을 추가해야 하나요?",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "식물 등 다른 생물 요소와 물·흙·빛 같은 비생물 요소를 함께 살핀다. 실제 확인한 장소와 시점·자료 출처를 적고 사진에서 확인할 수 없는 것은 미확인으로 남긴다.",
      "rubric": {
        "required": [
          "다른 생물·비생물 요소 함께 조사",
          "장소·시점·자료와 미확인 구별"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "조사표에 동물만 있으면 생태계 구성 요소를 충분히 살피지 못해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-23",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 23,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-01",
      "topic": "생태계 구성 요소",
      "concept": "생태계 구성 요소",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "화분의 식물은 눈에 띄게 움직이지 않았습니다. 생물 요소로 분류하는 설명은 무엇인가요?",
    "givens": null,
    "choices": [
      "물을 먹고 사니 물과 같은 비생물 요소다.",
      "크기가 작은 식물은 생태계 요소가 아니다.",
      "움직이지 않아도 식물은 생물 요소다.",
      "움직이지 않으므로 흙과 같은 비생물이다.",
      "사진으로 보면 모든 식물은 비생물이다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "움직임 하나만으로 생물과 비생물을 나누지 않아요. 식물도 생태계의 생물 요소예요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-24",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 24,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-01",
      "topic": "생태계 구성 요소",
      "concept": "생태계 구성 요소",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "가상 조사 목록은 풀·달팽이·햇빛·물입니다. 생물 요소는 몇 개인가요? 숫자만 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "2",
      "accepted": [
        "2"
      ]
    },
    "explanation": "풀과 달팽이가 생물 요소 두 개예요. 햇빛과 물은 비생물 요소로 나누어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-25",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 25,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-02",
      "topic": "먹이 관계·먹이그물",
      "concept": "먹이 관계·먹이그물",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "가상 먹이 관계에서 풀이 메뚜기에게 먹힙니다. 화살표를 먹이에서 먹는 생물로 그릴 때 맞는 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "메뚜기 → 풀",
      "햇빛 → 메뚜기",
      "풀 → 메뚜기",
      "풀 ↔ 물",
      "풀 → 햇빛"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "이 문제의 화살표 약속은 먹이에서 먹는 생물로 향해요. 생물 이름만 보고 화살표를 반대로 그리지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-26",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 26,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-02",
      "topic": "먹이 관계·먹이그물",
      "concept": "먹이 관계·먹이그물",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "먹이그물의 가상 관계표와 일치하는 설명 두 가지를 고르세요.",
    "givens": {
      "가상 관찰 자료": {
        "머리": [
          "먹는 생물",
          "제시한 먹이"
        ],
        "행": [
          [
            "메뚜기",
            "풀"
          ],
          [
            "들쥐",
            "풀"
          ],
          [
            "개구리",
            "메뚜기"
          ],
          [
            "뱀",
            "개구리·들쥐"
          ]
        ],
        "caption": "가상 관찰 자료"
      }
    },
    "choices": [
      "먹이가 여러 개면 어떤 변화에도 생존을 보장한다.",
      "메뚜기가 풀을 먹으니 풀은 메뚜기를 먹는다.",
      "뱀은 개구리와 들쥐 두 경로에 연결한다.",
      "개구리는 메뚜기를 먹는 것으로 연결한다.",
      "뱀의 먹이는 자료에 없는 생물로만 정한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        2,
        3
      ]
    },
    "explanation": "제시된 여러 먹이 관계를 함께 연결해요. 대체 경로가 있어도 실제 생존은 다른 조건도 확인해야 해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-27",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 27,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-02",
      "topic": "먹이 관계·먹이그물",
      "concept": "먹이 관계·먹이그물",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "가상 먹이그물에서 개구리와 들쥐를 모두 먹는 생물의 이름을 쓰세요.",
    "givens": {
      "연습 자료": "풀은 메뚜기와 들쥐에게 먹힌다. 메뚜기는 개구리에게 먹힌다. 개구리와 들쥐는 뱀에게 먹힌다."
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "뱀",
      "accepted": [
        "뱀"
      ]
    },
    "explanation": "제시한 관계에서 두 생물을 모두 먹는 것은 뱀이에요. 이 관계표가 모든 실제 뱀의 먹이를 나타내는 것은 아니에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-28",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 28,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-02",
      "topic": "먹이 관계·먹이그물",
      "concept": "먹이 관계·먹이그물",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "가상 자료의 먹이 관계를 먹이그물로 표현하려고 합니다. 연결할 화살표를 쓰고 여러 경로가 어떻게 함께 이어지는지 설명하세요.",
    "givens": {
      "연습 자료": "메뚜기와 들쥐는 풀을 먹고, 개구리는 메뚜기를 먹으며, 뱀은 개구리와 들쥐를 먹는 가상 자료다."
    },
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "풀→메뚜기→개구리→뱀과 풀→들쥐→뱀을 함께 연결한다. 화살표는 먹이에서 먹는 생물로 그리고 뱀에 이르는 두 경로를 한 그물에 나타낸다.",
      "rubric": {
        "required": [
          "화살표 약속에 맞는 관계 연결",
          "두 경로를 한 먹이그물에 표현"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "한 줄 먹이사슬 두 개를 따로 외우는 데 그치지 않고 공통 생물에서 연결해 그물로 나타내요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-29",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 29,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-02",
      "topic": "먹이 관계·먹이그물",
      "concept": "먹이 관계·먹이그물",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "먹이그물에 한 생물의 먹이가 두 종류로 표시되었습니다. 이 자료를 해석한 설명은 무엇인가요?",
    "givens": null,
    "choices": [
      "두 먹이 생물의 수는 항상 같아야 한다.",
      "먹이가 여러 개면 환경의 영향을 전혀 받지 않는다.",
      "먹이가 둘이면 그 생물은 반드시 늘어난다.",
      "한 먹이가 줄면 다른 경로도 살펴볼 수 있다.",
      "한 먹이가 줄어도 어떤 영향도 받지 않는다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "여러 연결은 대체 먹이 경로를 생각하는 근거가 돼요. 생물 수나 생존을 항상 보장하는 규칙은 아니에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-30",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 30,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-02",
      "topic": "먹이 관계·먹이그물",
      "concept": "먹이 관계·먹이그물",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "가상 관계에 풀→메뚜기, 메뚜기→개구리, 풀→들쥐, 들쥐→뱀이 있습니다. 표시한 화살표는 모두 몇 개인가요? 숫자만 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "4",
      "accepted": [
        "4"
      ]
    },
    "explanation": "관계 네 개를 각각 한 화살표로 세어요. 화살표 수를 실제 생물 개체 수로 바꾸지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-31",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 31,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-03",
      "topic": "인간 활동·보전 토의와 실천",
      "concept": "인간 활동·보전 토의와 실천",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "연못 주변 쓰레기를 줄이는 활동 기록입니다. 실제 실천을 적은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "정한 날에 안전한 구역의 쓰레기를 주워 기록했다.",
      "다음 달에 정리하겠다는 계획만 저장했다.",
      "조사표가 있으니 생태계가 회복됐다고 확정했다.",
      "친구가 한 활동을 나도 한 것으로 옮겼다.",
      "정리하면 깨끗해질 것이라는 예상만 적었다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "실제로 한 날짜·행동의 기록을 계획·예상과 구별해요. 한 행동 기록만으로 생태계 회복 전체를 확정하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-32",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 32,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-03",
      "topic": "인간 활동·보전 토의와 실천",
      "concept": "인간 활동·보전 토의와 실천",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "학교 생태계 보전 방법을 토의할 때 적절한 태도 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "어떤 생물이든 직접 옮겨 놓으면 무조건 좋다고 한다.",
      "조사한 영향과 실천할 행동의 연결을 말한다.",
      "말하지 않은 친구의 의견도 들었다고 채운다.",
      "다른 의견과 실행 여건을 듣고 방법을 고친다.",
      "계획을 세운 것만으로 실제 실천을 완료 처리한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        3
      ]
    },
    "explanation": "근거와 참여 여건을 함께 살펴 실천할 방법을 정해요. 토의한 내용·실제 행동·환경의 변화를 각각 확인해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-33",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 33,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-03",
      "topic": "인간 활동·보전 토의와 실천",
      "concept": "인간 활동·보전 토의와 실천",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "가상 모둠의 보전 실천표에 실제 함 3일, 할 계획 2일이 있습니다. 실제 실천한 날 수는 몇 일인가요? 숫자만 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "3",
      "accepted": [
        "3"
      ]
    },
    "explanation": "계획 두 날은 실제 실천한 날 수에 더하지 않아요. 못한 날이나 미기록도 따로 남겨요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-34",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 34,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-03",
      "topic": "인간 활동·보전 토의와 실천",
      "concept": "인간 활동·보전 토의와 실천",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "모둠은 안내문을 만들었지만 정한 보전 행동을 아직 하지 않았습니다. 토의·자료 제작·실천을 구별하여 현재 상태와 다음 기록 계획을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "토의와 안내문 제작은 했지만 실제 보전 행동은 아직 하지 않았다고 쓴다. 실행 가능한 날과 역할을 정하고 실제 한 날짜·행동·못한 부분과 받은 의견을 따로 남긴다.",
      "rubric": {
        "required": [
          "제작과 실제 실천의 현재 상태 구별",
          "날짜·역할·실제 행동·의견 기록 계획"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "안내문 파일이 있다는 사실만으로 실천이나 생태계의 변화를 확인했다고 하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-35",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 35,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-03",
      "topic": "인간 활동·보전 토의와 실천",
      "concept": "인간 활동·보전 토의와 실천",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "가상 조사에서 공사 뒤 물이 탁해진 시기가 겹쳤습니다. 더 타당한 설명은 무엇인가요?",
    "givens": null,
    "choices": [
      "조사를 하지 않고도 공사가 유일 원인이라 확정한다.",
      "물이 탁해도 생물에게는 어떤 영향도 없다고 한다.",
      "다른 자료와 조건을 더 조사해 관련을 살핀다.",
      "사진이 있으니 모든 생물의 수를 측정했다고 한다.",
      "한 번 겹쳤으니 모든 탁한 물은 공사 때문이라 한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "인간 활동과 영향을 조사하되 시기 하나만으로 유일한 원인을 확정하지 않아요. 장소·시점·다른 조건의 자료가 더 필요해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f1-36",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 1,
      "no": 36,
      "edition": "GFIELD 창작 중간평가 A형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-03",
      "topic": "인간 활동·보전 토의와 실천",
      "concept": "인간 활동·보전 토의와 실천",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "보기에서 조사한 영향에 대응하는 보전 행동의 기호를 쓰세요.",
    "givens": {
      "연습 자료": "상황: 이용 후 버린 포장지가 연못 주변에 쌓임 / ㄱ 포장 쓰레기를 줄이고 정해진 곳에 버리기 / ㄴ 실제 조사는 하지 않고 결과를 채우기 / ㄷ 다음 달 계획을 오늘 실천으로 적기"
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄱ",
      "accepted": [
        "ㄱ"
      ]
    },
    "explanation": "ㄱ은 조사한 쓰레기 문제와 연결되는 행동이에요. 실제로 했는지와 효과는 별도의 기록으로 확인해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-01",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 1,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-01",
      "topic": "달의 모습·여러 날 관찰",
      "concept": "달의 모습·여러 날 관찰",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "같은 관찰자가 달 기록에 날짜만 적고 시각·장소를 빠뜨렸습니다. 기록을 보완하는 방법은 무엇인가요?",
    "givens": null,
    "choices": [
      "관찰 조건이 없어도 모든 기록이 같다고 한다.",
      "날짜가 있으니 실제로 본 방향도 확정한다.",
      "다른 장소의 친구 그림을 그대로 옮긴다.",
      "빠진 시각은 모두 자정이었다고 채운다.",
      "실제로 본 시각과 장소를 함께 적는다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "달 모양의 여러 날 변화를 비교하려면 언제 어디에서 본 것인지 남겨요. 확인하지 못한 관찰 조건을 지어내지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-02",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 2,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-01",
      "topic": "달의 모습·여러 날 관찰",
      "concept": "달의 모습·여러 날 관찰",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "한 달 동안의 달 기록을 살펴보는 설명 중 타당한 것 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "비슷한 모양이 다시 나타나는지 살펴본다.",
      "한 장의 사진만으로 달의 모든 날 모양을 확정한다.",
      "달이 안 보인 날은 달 자체가 없어졌다고 정한다.",
      "못 본 날과 실제로 본 날을 구별한다.",
      "종이 그림 크기가 달의 실제 크기 변화라고 한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    },
    "explanation": "여러 날 보인 모습에서 반복되는 경향을 살펴요. 실제 관찰과 빠진 기록을 구별하며 변화 원인을 암기하도록 요구하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-03",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 3,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-01",
      "topic": "달의 모습·여러 날 관찰",
      "concept": "달의 모습·여러 날 관찰",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "가상 달 관찰에서 월요일은 직접 관찰, 화요일은 비로 미관찰, 수요일은 제공 사진 확인, 목요일은 직접 관찰했습니다. 직접 관찰한 날은 몇 일인가요? 숫자만 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "2",
      "accepted": [
        "2"
      ]
    },
    "explanation": "월요일과 목요일 두 날이 직접 관찰이에요. 제공 사진을 본 날과 못 본 날은 구별해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-04",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 4,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-01",
      "topic": "달의 모습·여러 날 관찰",
      "concept": "달의 모습·여러 날 관찰",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "친구가 달 사진 두 장의 인쇄 크기를 비교하여 “달 자체가 커졌다.”라고 썼습니다. 기록을 고치고 비교할 자료 조건을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "인쇄 크기만으로 달 자체의 크기가 달라졌다고 확정할 수 없다고 고친다. 사진의 촬영·확대 조건과 출처를 확인하고 보이는 모양·표면 특징을 실제 크기와 나누어 적는다.",
      "rubric": {
        "required": [
          "인쇄 크기와 실제 달 크기 구별",
          "출처·확대 조건과 보인 모양 확인"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "모양 관찰과 실제 크기 측정은 다른 증거가 필요해요. 여러 날의 모양 변화 자체를 관찰하는 데 중점을 두어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-05",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 5,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-01",
      "topic": "달의 모습·여러 날 관찰",
      "concept": "달의 모습·여러 날 관찰",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "가상 달 관찰표의 다음 날 칸에 “이 모양일 것으로 예상함”이라고 썼습니다. 이 기록의 성격은 무엇인가요?",
    "givens": null,
    "choices": [
      "모든 날짜에 적용되는 확정 관찰이다.",
      "달 표면을 직접 만진 실험 결과이다.",
      "이미 실제로 본 관찰 결과이다.",
      "아직 직접 확인하지 않은 예상이다.",
      "날짜가 있으니 관측 완료 증거이다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "예상은 다음 관찰과 비교할 수 있지만 관찰하기 전 실제 결과로 바꾸어 적지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-06",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 6,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T01",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-01",
      "topic": "달의 모습·여러 날 관찰",
      "concept": "달의 모습·여러 날 관찰",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "기록표의 두 상태 중 실제로 달을 보지 못한 날에 쓸 말을 골라 쓰세요.",
    "givens": {
      "연습 자료": "고를 말: 관찰 완료 / 미관찰"
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "미관찰",
      "accepted": [
        "미관찰"
      ]
    },
    "explanation": "구름·비 등으로 직접 보지 못했으면 미관찰로 남겨요. 자료 사진을 본 경우도 따로 적어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-07",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 7,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-02",
      "topic": "태양계 구성원 조사",
      "concept": "태양계 구성원 조사",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "소개 카드의 태양·지구·달을 구별한 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "지구와 달은 모두 별이다.",
      "태양은 행성, 지구는 별이다.",
      "달은 태양계에서 스스로 빛을 낸다.",
      "태양과 달은 모두 행성이다.",
      "태양은 별, 지구는 행성이다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "태양은 스스로 빛을 내는 별이고 지구는 행성이에요. 달을 행성이나 별로 섞지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-08",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 8,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-02",
      "topic": "태양계 구성원 조사",
      "concept": "태양계 구성원 조사",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "태양계 모형에 대한 설명 중 타당한 것 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "점토 공 간격은 설명 없이 실제 거리라고 쓴다.",
      "모형에 표현한 구성원과 생략한 것을 밝힌다.",
      "달을 더하면 행성은 반드시 아홉 개라고 쓴다.",
      "이름·자료 출처를 확인하여 소개한다.",
      "서로 다른 사진의 인쇄 크기로 실제 크기를 확정한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        3
      ]
    },
    "explanation": "모형의 목적과 한계를 함께 적어요. 실제 거리·크기 수치의 암기를 필수로 요구하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-09",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 9,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-02",
      "topic": "태양계 구성원 조사",
      "concept": "태양계 구성원 조사",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "가상 모형은 여덟 행성 이름표 중 일곱 개만 붙였습니다. 아직 붙이지 않은 이름표는 몇 개인가요? 숫자만 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "1",
      "accepted": [
        "1"
      ]
    },
    "explanation": "8-7=1개예요. 빠진 이름표 수를 실제로 행성이 없어진 수로 해석하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-10",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 10,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-02",
      "topic": "태양계 구성원 조사",
      "concept": "태양계 구성원 조사",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "태양계 조사 발표에 사진만 있고 이름·출처가 없습니다. 구성원을 구별할 수 있도록 자료를 보완하는 방법을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "확인한 자료에서 태양과 각 행성의 이름을 찾아 사진과 연결하고 출처를 붙인다. 태양은 별, 지구를 포함한 여덟 행성은 행성으로 구별하며 사진의 크기·간격이 실제 축척인지 따로 표시한다.",
      "rubric": {
        "required": [
          "이름·사진·출처 연결",
          "태양/행성 구별과 축척 미확정"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "사진을 모은 것과 확인된 내용을 설명하는 자료는 달라요. 자료가 보여 주지 않는 실제 물리량을 만들어내지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-11",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 11,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-02",
      "topic": "태양계 구성원 조사",
      "concept": "태양계 구성원 조사",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "교실 벽에 붙인 태양계 그림에서 태양을 생략했습니다. 이 그림에 대한 설명은 무엇인가요?",
    "givens": null,
    "choices": [
      "생략했으므로 행성 수가 자동으로 늘어난다.",
      "그림에 없으면 태양은 별일 수 없다.",
      "태양계에 태양이 없다는 실제 증거다.",
      "모든 행성은 스스로 빛을 낸다는 뜻이다.",
      "행성만 나타낸 일부 구성도라고 표시한다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "그림에서 생략한 구성원과 실제 태양계의 구성원을 구별해요. 표현 목적에 따른 일부 자료임을 밝힐 수 있어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-12",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 12,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T02",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-02",
      "topic": "태양계 구성원 조사",
      "concept": "태양계 구성원 조사",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "제시 목록 중 행성인 천체의 기호를 쓰세요.",
    "givens": {
      "연습 자료": "ㄱ 태양 / ㄴ 달 / ㄷ 토성 / ㄹ 북극성"
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ"
      ]
    },
    "explanation": "토성은 태양계의 행성이에요. 태양·북극성은 별이며 달과 구별해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-13",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 13,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-03",
      "topic": "별·북극성 주변 관찰",
      "concept": "별·북극성 주변 관찰",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "하늘에서 밝게 보이는 점을 사진으로 찍고 “밝으니 모두 별이다.”라고 했습니다. 먼저 고칠 설명은 무엇인가요?",
    "givens": null,
    "choices": [
      "사진에 보이면 천체의 이름을 모두 안다.",
      "밝기만으로 별과 행성을 구별하지 않는다.",
      "밝게 찍힌 달도 반드시 별에 속한다.",
      "밝게 보이면 어느 천체든 스스로 빛을 낸다.",
      "작게 찍힌 천체는 모두 같은 별자리다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "별은 스스로 빛을 내는 천체예요. 밤하늘에서 밝아 보이는 것만으로 행성·달까지 모두 별로 분류하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-14",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 14,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-03",
      "topic": "별·북극성 주변 관찰",
      "concept": "별·북극성 주변 관찰",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "북극성 주변 별자리 자료를 실제 관찰과 대조하는 방법 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "별자리 자료 한 장을 모든 계절의 유일한 모습이라 한다.",
      "구름에 가린 별도 보았다고 채워 적는다.",
      "자료의 방향 기준을 실제 북쪽과 맞춘다.",
      "관찰 시각·장소와 보인 배치를 기록한다.",
      "자료를 돌려 놓고도 방향이 같았다고 적는다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        2,
        3
      ]
    },
    "explanation": "방향과 시각·장소를 확인해야 자료와 관찰을 비교할 수 있어요. 계절별 별자리 원인이나 변화 암기를 필수로 요구하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-15",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 15,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-03",
      "topic": "별·북극성 주변 관찰",
      "concept": "별·북극성 주변 관찰",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "교사 제공 자료에서 북극성 주변의 국자 모양 일곱 별을 무엇이라고 부르는지 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "북두칠성",
      "accepted": [
        "북두칠성"
      ]
    },
    "explanation": "국자 모양의 일곱 별은 북두칠성으로 살펴요. 북극성 자체와 같은 한 별이라고 하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-16",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 16,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-03",
      "topic": "별·북극성 주변 관찰",
      "concept": "별·북극성 주변 관찰",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "북쪽 건물이 시야를 가려 별 배치를 확인하지 못했습니다. 자료를 활용하되 직접 관찰과 혼동하지 않는 기록 방법을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "건물 때문에 북쪽 배치는 직접 확인하지 못했다고 기록한다. 제공 자료나 프로그램을 사용하면 출처·설정 시각과 방향을 적고 실제로 본 별과 자료에서 확인한 배치를 나누어 남긴다.",
      "rubric": {
        "required": [
          "가려져 직접 확인 못한 사실 유지",
          "자료 출처/조건과 실제 관찰 구별"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "관찰 여건이 부족할 때 자료를 사용할 수 있지만 실제 야외 관찰을 했다고 바꾸지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-17",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 17,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-03",
      "topic": "별·북극성 주변 관찰",
      "concept": "별·북극성 주변 관찰",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "북극성을 표시한 지도에서 주변 여러 별을 선으로 이었습니다. 이 그림을 읽는 설명은 무엇인가요?",
    "givens": null,
    "choices": [
      "선을 지우면 실제 별도 사라진다는 뜻이다.",
      "서로 선으로 이었으니 모든 별이 붙어 있다는 뜻이다.",
      "그 선은 실제 하늘에 매달린 줄을 관찰한 것이다.",
      "선을 이은 배치는 별자리 찾기를 돕는 표현이다.",
      "종이에서 가까우면 실제 거리도 모두 같다는 뜻이다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "별자리 선은 배치를 알아보도록 만든 표현이에요. 종이의 선과 간격을 실제 물체나 천체 사이 거리로 확정하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-18",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 18,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E1",
      "type": "T03",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과13-03",
      "topic": "별·북극성 주변 관찰",
      "concept": "별·북극성 주변 관찰",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "가상 관찰표의 북쪽 하늘 관찰은 3회 중 1회가 구름으로 미관찰입니다. 직접 배치를 본 횟수는 몇 회인가요? 숫자만 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "2",
      "accepted": [
        "2"
      ]
    },
    "explanation": "3-1=2회예요. 미관찰 한 회는 빈 결과로 남기며 다른 날 자료를 직접 본 기록으로 복사하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-19",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 19,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-01",
      "topic": "생태계 구성 요소",
      "concept": "생태계 구성 요소",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "바닷가 생태계 구성 요소를 분류한 것으로 맞는 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "바닷물은 움직이므로 생물 요소다.",
      "게는 생물, 바닷물은 비생물 요소다.",
      "게는 움직이므로 비생물 요소다.",
      "바위는 크므로 생물 요소다.",
      "해초는 자리에 붙어 있어 비생물 요소다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "생물 여부는 움직임이나 크기 하나로 정하지 않아요. 게·해초 같은 생물과 물·바위 같은 비생물 요소를 함께 살펴요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-20",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 20,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-01",
      "topic": "생태계 구성 요소",
      "concept": "생태계 구성 요소",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "생태계 조사표를 보완하는 방법 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "직접 본 것과 제공 자료에서 찾은 것을 나눈다.",
      "모든 생물은 동물이므로 식물 기록을 지운다.",
      "사진에 없는 요소는 실제로 전혀 없다고 확정한다.",
      "조사한 생물과 비생물 요소를 구별해 적는다.",
      "움직인 물은 모두 생물로 분류해 적는다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    },
    "explanation": "두 구성 요소와 실제 조사 범위를 함께 남겨요. 자료에서 못 보았다는 사실을 존재하지 않는다는 결론으로 바꾸지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-21",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 21,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-01",
      "topic": "생태계 구성 요소",
      "concept": "생태계 구성 요소",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "보기의 생물 요소를 하나 골라 기호로 쓰세요.",
    "givens": {
      "연습 자료": "ㄱ 햇빛 / ㄴ 바닷물 / ㄷ 바위 / ㄹ 해초"
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄹ",
      "accepted": [
        "ㄹ"
      ]
    },
    "explanation": "해초는 생물 요소예요. 햇빛·물·바위는 비생물 요소로 나누어요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-22",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 22,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-01",
      "topic": "생태계 구성 요소",
      "concept": "생태계 구성 요소",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "연못 사진에 물고기가 찍히지 않았다는 이유로 “물고기는 한 마리도 없다.”라고 발표했습니다. 조사 결과의 범위를 고쳐 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "이 사진과 촬영 시점에서는 물고기를 확인하지 못했다고 쓴다. 다른 시점·장소의 관찰이나 확인된 자료를 더 조사해야 실제 존재 여부를 판단할 수 있으며 사진 밖의 사실을 확정하지 않는다.",
      "rubric": {
        "required": [
          "해당 사진·시점의 미확인으로 한정",
          "추가 관찰/자료와 실제 존재 여부 구별"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "관찰에 빠진 생물이 실제로 없는지는 별도 근거가 필요해요. 조사표의 빈칸을 곧바로 0마리로 바꾸지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-23",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 23,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-01",
      "topic": "생태계 구성 요소",
      "concept": "생태계 구성 요소",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "교정 조사 목록에서 “빛·바람·나무·흙”을 찾았습니다. 비생물 요소만 모은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "빛·바람·나무",
      "나무만",
      "빛·나무·흙",
      "빛·바람·흙",
      "바람·나무·흙"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "나무는 생물 요소이고 빛·바람·흙은 비생물 요소예요. 생태계에서 함께 영향을 주고받는 요소로 조사해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-24",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 24,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T04",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-01",
      "topic": "생태계 구성 요소",
      "concept": "생태계 구성 요소",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "가상 조사표의 비생물 요소는 물·햇빛·흙·온도입니다. 항목 수는 몇 개인가요? 숫자만 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "4",
      "accepted": [
        "4"
      ]
    },
    "explanation": "제시한 항목 네 개를 세어요. 항목 수를 실제 생물 개체 수나 생태계 건강 점수로 바꾸지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-25",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 25,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-02",
      "topic": "먹이 관계·먹이그물",
      "concept": "먹이 관계·먹이그물",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "가상 관계표에서 작은 물고기가 물벼룩을 먹습니다. 먹이에서 먹는 생물로 그릴 화살표는 무엇인가요?",
    "givens": null,
    "choices": [
      "작은 물고기 → 햇빛",
      "물벼룩 → 작은 물고기",
      "작은 물고기 → 물벼룩",
      "물벼룩 → 물",
      "물 ↔ 작은 물고기"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "제시한 약속대로 물벼룩에서 작은 물고기로 향하게 그려요. 움직이는 방향이나 크기 순서가 화살표 기준은 아니에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-26",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 26,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-02",
      "topic": "먹이 관계·먹이그물",
      "concept": "먹이 관계·먹이그물",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "가상 연못 먹이그물 자료와 일치하는 설명 두 가지를 고르세요.",
    "givens": {
      "가상 관찰 자료": {
        "머리": [
          "먹는 생물",
          "먹이"
        ],
        "행": [
          [
            "물벼룩",
            "식물성 플랑크톤"
          ],
          [
            "작은 물고기",
            "물벼룩"
          ],
          [
            "큰 물고기",
            "물벼룩·작은 물고기"
          ]
        ],
        "caption": "가상 관찰 자료"
      }
    },
    "choices": [
      "대체 먹이가 있으면 실제 생존은 무조건 보장된다.",
      "한 연결만 남겨야 먹이그물이라고 할 수 있다.",
      "작은 물고기가 큰 물고기를 먹는 것으로 잇는다.",
      "큰 물고기는 두 종류 먹이에 연결한다.",
      "물벼룩은 식물성 플랑크톤을 먹는 것으로 잇는다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        3,
        4
      ]
    },
    "explanation": "제시한 여러 먹이 관계를 한 그물로 이어 보아요. 연결이 많다는 사실만으로 실제 개체 수 변화를 확정하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-27",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 27,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-02",
      "topic": "먹이 관계·먹이그물",
      "concept": "먹이 관계·먹이그물",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "가상 자료에서 물벼룩을 먹는 생물은 작은 물고기와 큰 물고기입니다. 물벼룩에서 나가는 먹이 화살표 수를 숫자로 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "2",
      "accepted": [
        "2"
      ]
    },
    "explanation": "먹이에서 먹는 생물로 그리면 물벼룩에서 두 생물로 화살표가 나가요. 실제 먹은 횟수를 묻는 문제는 아니에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-28",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 28,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-02",
      "topic": "먹이 관계·먹이그물",
      "concept": "먹이 관계·먹이그물",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "가상 자료를 한 먹이그물로 표현하려고 합니다. 먹이에서 먹는 생물로 향하는 연결을 모두 쓰세요.",
    "givens": {
      "연습 자료": "물벼룩은 식물성 플랑크톤을 먹는다. 작은 물고기는 물벼룩을 먹고, 큰 물고기는 물벼룩과 작은 물고기를 먹는 가상 자료다."
    },
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "식물성 플랑크톤→물벼룩, 물벼룩→작은 물고기, 물벼룩→큰 물고기, 작은 물고기→큰 물고기를 한 그물에 함께 나타낸다.",
      "rubric": {
        "required": [
          "먹이에서 먹는 생물로 향하는 방향",
          "제시한 네 관계를 한 그물에 연결"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "공통 생물에서 화살표가 여러 갈래로 연결되는 모습을 표현해요. 실제 모든 연못의 먹이 관계로 확대하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-29",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 29,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-02",
      "topic": "먹이 관계·먹이그물",
      "concept": "먹이 관계·먹이그물",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "먹이그물에서 한 먹이의 수가 줄었다는 자료만 있습니다. 아직 확정할 수 없는 것은 무엇인가요?",
    "givens": {
      "가상 자료": "두 시점 비교표에서 물벼룩 수가 줄었다는 것만 제시했다. 먹이그물에는 물벼룩에서 작은 물고기와 큰 물고기로 향하는 연결이 있다."
    },
    "choices": [
      "줄어든 먹이가 물벼룩이라는 자료 내용",
      "두 시점 자료를 비교했다는 범위",
      "모든 다른 생물의 정확한 개체 수",
      "다른 먹이 경로를 더 살필 필요",
      "그물에 여러 먹이 연결이 있다는 표현"
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "개체 수는 먹이 외의 조건도 영향을 줄 수 있어요. 한 먹이 감소 자료만으로 모든 다른 생물의 정확한 수를 계산하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-30",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 30,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T05",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-02",
      "topic": "먹이 관계·먹이그물",
      "concept": "먹이 관계·먹이그물",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "고칠 먹이 화살표의 기호를 쓰세요. 약속은 먹이에서 먹는 생물로 향합니다.",
    "givens": {
      "연습 자료": "관계: 토끼가 풀을 먹고 여우가 토끼를 먹음 / ㄱ 풀→토끼 / ㄴ 토끼→여우 / ㄷ 여우→토끼"
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄷ",
      "accepted": [
        "ㄷ"
      ]
    },
    "explanation": "이 자료의 ㄷ은 방향이 반대예요. 토끼를 먹는 여우로 향하도록 토끼→여우로 표현해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-31",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 31,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-03",
      "topic": "인간 활동·보전 토의와 실천",
      "concept": "인간 활동·보전 토의와 실천",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "학교 숲길 이용 규칙을 정한 기록 중 실제 토의 증거가 담긴 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "받은 다른 의견과 바꾼 규칙을 함께 적었다.",
      "전달하지 않은 안내문도 모두 읽었다고 적었다.",
      "혼자 쓴 규칙을 모두 동의했다고 바꾸었다.",
      "실천 계획을 실제 환경 개선 결과로 적었다.",
      "조사하지 않은 생물 수를 임의로 채웠다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "실제로 받은 의견과 그 뒤 바꾼 내용을 남기면 토의 과정을 확인할 수 있어요. 모든 사람의 동의나 실제 효과를 임의로 채우지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-32",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 32,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-03",
      "topic": "인간 활동·보전 토의와 실천",
      "concept": "인간 활동·보전 토의와 실천",
      "inquirySkill": "여러 근거 비교"
    },
    "prompt": "실행 가능한 생태계 보전 계획을 세우는 방법 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "조사한 문제와 행동·역할·날짜를 연결한다.",
      "한 번 쓰레기를 줍고 모든 오염이 사라졌다고 한다.",
      "남의 활동 사진만으로 내 실천을 완료 처리한다.",
      "할 수 없었던 날은 기록에서 모두 없앤다.",
      "안전과 참여 여건에 맞게 공동 도움을 구한다."
    ],
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        4
      ]
    },
    "explanation": "계획·실제 행동·효과를 나누어 기록하고 안전과 여건에 맞는 공동 활동을 정해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-33",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 33,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-03",
      "topic": "인간 활동·보전 토의와 실천",
      "concept": "인간 활동·보전 토의와 실천",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "가상 실천표에서 5개 항목 중 실제로 한 것은 2개입니다. 아직 실제로 하지 않은 항목은 몇 개인가요? 숫자만 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "3",
      "accepted": [
        "3"
      ]
    },
    "explanation": "5-2=3개예요. 계획·미실행을 완료로 더하지 않고 이유와 다음 보완을 남겨요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-34",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 34,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-03",
      "topic": "인간 활동·보전 토의와 실천",
      "concept": "인간 활동·보전 토의와 실천",
      "inquirySkill": "근거 설명·설계·수행 구별"
    },
    "prompt": "보전 안내를 친구에게 전했지만 의견은 아직 받지 못했습니다. 공유와 의견 수신 상태를 구별하고 다음 소통 계획을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "자료를 실제로 전달한 대상·날짜·방법은 기록하되 의견은 아직 받지 못했다고 적는다. 질문을 받을 방법을 정하고 실제로 받은 의견·수정한 부분·다시 공유할 계획을 각각 남긴다.",
      "rubric": {
        "required": [
          "실제 전달과 의견 미수신 구별",
          "의견 수신·수정·재공유 계획 구별"
        ],
        "criteria": [
          "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
        ],
        "pass": "근거와 설명의 연결은 선생님이 확인한다."
      }
    },
    "explanation": "자료를 보낸 사실이 좋은 의견을 받았거나 모두 실천했다는 증거는 아니에요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-35",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 35,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-03",
      "topic": "인간 활동·보전 토의와 실천",
      "concept": "인간 활동·보전 토의와 실천",
      "inquirySkill": "자료 해석·조건 판단"
    },
    "prompt": "생태계 보전 활동 뒤 같은 장소 사진이 한 장뿐입니다. 이 자료의 한계를 설명한 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "한 사진으로 장기 회복 전체를 확정하기 어렵다.",
      "활동 계획이 있으니 모든 오염이 없어졌다.",
      "사진이 선명하면 실제 토의도 끝난 것이다.",
      "한 장이면 모든 생물의 수가 늘었다고 알 수 있다.",
      "다른 조건과 시점은 결과 해석에 필요 없다."
    ],
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "사진의 장소·시점과 확인한 범위 안에서 설명해요. 실제 장기 변화는 여러 시점의 조사와 다른 조건도 함께 확인해야 해요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  },
  {
    "id": "c22-s42-mid-f2-36",
    "status": "authored",
    "sourceRef": {
      "type": "authored-assessment",
      "set": 2,
      "no": 36,
      "edition": "GFIELD 창작 중간평가 B형",
      "course": "초등4-2",
      "unit": "중간평가"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 2,
      "unit": "mid",
      "area": "종합",
      "element": "E2",
      "type": "T06",
      "format": "단답형",
      "level": "기본",
      "track": "교과",
      "standard": "4과14-03",
      "topic": "인간 활동·보전 토의와 실천",
      "concept": "인간 활동·보전 토의와 실천",
      "inquirySkill": "관찰 낱말·기호·수치"
    },
    "prompt": "보기 중 실제 보전 활동 뒤의 관찰 결과를 적은 기록의 기호를 쓰세요.",
    "givens": {
      "연습 자료": "ㄱ 다음 주에 쓰레기가 줄 것 같다. / ㄴ 활동 뒤 같은 구역에서 남은 포장지 4개를 확인했다. / ㄷ 안내문을 저장하면 생물이 늘어날 것이다."
    },
    "choices": null,
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "ㄴ",
      "accepted": [
        "ㄴ"
      ]
    },
    "explanation": "ㄴ에는 활동 뒤 실제로 확인한 결과가 있어요. 남은 네 개를 모든 구역의 쓰레기 수나 생태계 회복 점수로 확대하지 않아요.",
    "evidence": {
      "checkedBy": "창작 평가 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과13-01~03·14-01~03 및 두단원 검수된 교재·출처 기록",
      "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
    }
  }
];
export {assessment42BankPaperHtml as bankPaper,wireAssessment42BankPaper as wireBankPaper} from '../../v2/assessment42-bank-paper.js';
