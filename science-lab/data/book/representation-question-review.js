export const REPRESENTATION_REVIEW_VERSION='20261115-representation-response-review';
export const REPRESENTATION_REVIEW_UNITS=["c22-s62-u04", "c22-s62-u03", "c22-s62-u01", "c22-s51-u04", "c22-s61-u02", "c22-s61-u03"];
export const REPRESENTATION_REVIEW_BANK_UNITS=["c22-s62-u04", "c22-s62-u03", "c22-s62-u01", "c22-s51-u04", "c22-s61-u02", "c22-s61-u03"];
// Match drawing examples and teacher criteria to the requested work; preserve saved answers.
const patches={
  "c22-s62-u04-b016": {
    "unit": "c22-s62-u04",
    "previousVersion": "20261107-career-readable-workbook",
    "prompt": "두 자료를 비교할 판을 만드세요. 같은 점과 다른 점, 바로 비교하기 어려운 까닭을 적을 칸을 두세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 16,
      "section": "현재 자료의 출처와 시점을 확인해요",
      "originalExam": false
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u04",
      "area": "과학과 사회",
      "element": "E1",
      "type": "T02",
      "format": "그림·설계",
      "level": "기본",
      "track": "교과",
      "standard": "6과16-01",
      "topic": "현재 자료의 출처와 시점을 확인해요",
      "concept": "자료 비교 가능성과 신뢰 근거",
      "inquirySkill": "대상·방법·단위와 누락 정보로 자료의 쓰임을 검토한다."
    },
    "responseContract": {
      "kind": "drawing",
      "teacherRequired": true,
      "sample": "두 자료의 출처와 조사한 곳·기간·방법·단위를 나란히 적어요. 비교할 수 있는 점과 더 알아볼 점을 나누고 결론 칸은 비워 두어요.",
      "required": [
        "비교 조건 네 가지를 나눈다.",
        "두 출처를 다시 찾게 한다.",
        "추가 확인과 결론을 구별한다."
      ],
      "exactStringScoring": false
    },
    "previousAnswerContract": {
      "type": "written-explanation",
      "sample": "두 자료의 출처와 조사한 곳·기간·방법·단위를 나란히 적어요. 비교할 수 있는 점과 더 알아볼 점을 나누고 결론 칸은 비워 두어요.",
      "teacherRequired": true,
      "rubric": {
        "required": [
          "비교 조건 네 가지를 나눈다.",
          "두 출처를 다시 찾게 한다.",
          "추가 확인과 결론을 구별한다."
        ],
        "pass": "자료·업무·과학 연결 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
      },
      "seasonContract": {
        "kind": "drawing",
        "teacherRequired": true,
        "sample": "두 자료의 출처와 조사한 곳·기간·방법·단위를 나란히 적어요. 비교할 수 있는 점과 더 알아볼 점을 나누고 결론 칸은 비워 두어요.",
        "required": [
          "비교 조건 네 가지를 나눈다.",
          "두 출처를 다시 찾게 한다.",
          "추가 확인과 결론을 구별한다."
        ],
        "exactStringScoring": false
      }
    },
    "previousChoices": null,
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": "c22-s62-u04-w016",
      "sourceId": null,
      "bookResponseForm": "draw-design",
      "explanation": "두 자료의 조사한 곳과 기간, 방법, 단위를 나란히 살펴요. 바로 비교하기 어려운 점은 따로 적어요. 자료를 읽기 전에는 결론을 미리 채우지 않아요."
    },
    "fields": {
      "answerContract": {
        "type": "written-explanation",
        "sample": "두 자료를 나란히 놓고 같은 점·다른 점·바로 비교하기 어려운 까닭을 적을 칸을 만들어요. 조사한 곳·기간·방법·단위나 출처를 살펴볼 칸을 더해도 좋아요.",
        "teacherRequired": true,
        "rubric": {
          "required": [
            "두 자료의 같은 점·다른 점·바로 비교하기 어려운 까닭을 적을 칸을 나누어요. 조사한 곳·기간·방법·단위나 출처를 덧붙여도 좋아요."
          ],
          "pass": "자료·업무·과학 연결 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
        },
        "seasonContract": {
          "kind": "drawing",
          "teacherRequired": true,
          "sample": "두 자료를 나란히 놓고 같은 점·다른 점·바로 비교하기 어려운 까닭을 적을 칸을 만들어요. 조사한 곳·기간·방법·단위나 출처를 살펴볼 칸을 더해도 좋아요.",
          "required": [
            "두 자료의 같은 점·다른 점·바로 비교하기 어려운 까닭을 적을 칸을 나누어요. 조사한 곳·기간·방법·단위나 출처를 덧붙여도 좋아요."
          ],
          "exactStringScoring": false
        }
      },
      "explanation": "같은 점과 다른 점을 적을 칸을 나누어요. 자료를 비교하기 어려운 까닭도 적을 자리를 두어요. 조사한 곳이나 기간 등이 같은지 살펴보면 까닭을 찾는 데 도움이 돼요.",
      "responseContract": {
        "kind": "drawing",
        "teacherRequired": true,
        "sample": "두 자료를 나란히 놓고 같은 점·다른 점·바로 비교하기 어려운 까닭을 적을 칸을 만들어요. 조사한 곳·기간·방법·단위나 출처를 살펴볼 칸을 더해도 좋아요.",
        "required": [
          "두 자료의 같은 점·다른 점·바로 비교하기 어려운 까닭을 적을 칸을 나누어요. 조사한 곳·기간·방법·단위나 출처를 덧붙여도 좋아요."
        ],
        "exactStringScoring": false
      }
    }
  },
  "c22-s62-u03-b128": {
    "unit": "c22-s62-u03",
    "previousVersion": "20261106-electricity-readable-workbook",
    "prompt": "실천 결과를 친구에게 설명할 그림판을 그리세요. 계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요.",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 128,
      "section": "전기를 아끼는 계획을 실천하고 돌아봐요",
      "originalExam": false
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u03",
      "area": "운동과 에너지",
      "element": "E8",
      "type": "T18",
      "format": "그림·설계",
      "level": "기본",
      "track": "교과",
      "standard": "6과15-04",
      "topic": "전기를 아끼는 계획을 실천하고 돌아봐요",
      "concept": "계획·실행·검토의 증거 설계",
      "inquirySkill": "실제 수행과 확인하지 않은 효과를 구별한다."
    },
    "responseContract": {
      "kind": "drawing",
      "teacherRequired": true,
      "sample": "네 칸에 자료 종류와 날짜, 사용 조건을 적어요. 켠 시간의 변화와 아직 재지 않은 전기 사용량·요금을 나누어요. 친구가 한 질문과 다음에 확인할 점도 적을 칸을 두어요.",
      "required": [
        "계획과 실제 수행을 나눈다.",
        "확인한 변화와 효과의 한계를 구별한다.",
        "질문·추가 자료·다음 검토를 남긴다."
      ],
      "exactStringScoring": false
    },
    "previousAnswerContract": {
      "type": "written-explanation",
      "sample": "네 칸에 자료 종류와 날짜, 사용 조건을 적어요. 켠 시간의 변화와 아직 재지 않은 전기 사용량·요금을 나누어요. 친구가 한 질문과 다음에 확인할 점도 적을 칸을 두어요.",
      "teacherRequired": true,
      "rubric": {
        "required": [
          "계획과 실제 수행을 나눈다.",
          "확인한 변화와 효과의 한계를 구별한다.",
          "질문·추가 자료·다음 검토를 남긴다."
        ],
        "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
      },
      "seasonContract": {
        "kind": "drawing",
        "teacherRequired": true,
        "sample": "네 칸에 자료 종류와 날짜, 사용 조건을 적어요. 켠 시간의 변화와 아직 재지 않은 전기 사용량·요금을 나누어요. 친구가 한 질문과 다음에 확인할 점도 적을 칸을 두어요.",
        "required": [
          "계획과 실제 수행을 나눈다.",
          "확인한 변화와 효과의 한계를 구별한다.",
          "질문·추가 자료·다음 검토를 남긴다."
        ],
        "exactStringScoring": false
      }
    },
    "previousChoices": null,
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": "c22-s62-u03-w128",
      "sourceId": null,
      "bookResponseForm": "draw-design",
      "explanation": "실제로 확인한 시간 변화와 아직 재지 않은 전기 사용량·요금을 나누어요. 자료와 날짜, 사용 조건을 적고 받은 질문과 다음에 확인할 점도 남겨요."
    },
    "fields": {
      "answerContract": {
        "type": "written-explanation",
        "sample": "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요. 예를 들어 켠 시간이 줄어든 것은 확인한 변화 칸에, 아직 재지 않은 전기 사용량이나 요금은 모르는 효과 칸에 적을 수 있어요.",
        "teacherRequired": true,
        "rubric": {
          "required": [
            "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요. 확인하지 않은 전기 사용량이나 요금을 이미 잰 결과처럼 쓰지 않아요."
          ],
          "pass": "조건·관찰·설계 근거는 교사가 확인해요. 타당한 다른 표현도 인정해요."
        },
        "seasonContract": {
          "kind": "drawing",
          "teacherRequired": true,
          "sample": "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요. 예를 들어 켠 시간이 줄어든 것은 확인한 변화 칸에, 아직 재지 않은 전기 사용량이나 요금은 모르는 효과 칸에 적을 수 있어요.",
          "required": [
            "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요. 확인하지 않은 전기 사용량이나 요금을 이미 잰 결과처럼 쓰지 않아요."
          ],
          "exactStringScoring": false
        }
      },
      "explanation": "하려던 일과 실제로 한 일을 구별할 칸을 만들어요. 확인한 변화와 아직 알 수 없는 효과도 나누어요. 그림판을 그린 것만으로 실제로 실천하거나 친구에게 설명한 것은 아니에요.",
      "responseContract": {
        "kind": "drawing",
        "teacherRequired": true,
        "sample": "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요. 예를 들어 켠 시간이 줄어든 것은 확인한 변화 칸에, 아직 재지 않은 전기 사용량이나 요금은 모르는 효과 칸에 적을 수 있어요.",
        "required": [
          "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요. 확인하지 않은 전기 사용량이나 요금을 이미 잰 결과처럼 쓰지 않아요."
        ],
        "exactStringScoring": false
      }
    }
  },
  "c22-s62-u01-b064": {
    "unit": "c22-s62-u01",
    "previousVersion": "20261106-season-readable-workbook",
    "prompt": "네 날짜의 태양 자료를 모을 빈 표를 그리세요. 친구도 같은 자료를 찾을 수 있도록 장소와 날짜, 시각과 출처를 적을 칸을 만드세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 64,
      "section": "일출과 일몰 사이 시간을 구해요",
      "originalExam": false
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 2,
      "unit": "u01",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T12",
      "format": "그림·설계",
      "level": "기본",
      "track": "교과",
      "standard": "6과13-02",
      "topic": "일출과 일몰 사이 시간을 구해요",
      "concept": "자료의 한계와 생활 적용",
      "inquirySkill": "주어진 근거와 없는 측정 결과 구별"
    },
    "responseContract": {
      "kind": "drawing",
      "teacherRequired": true,
      "sample": "장소와 좌표, 한국 시각인지와 날짜, 일출과 일몰, 남중 표시와 고도를 적을 칸을 만들어요. 어디에서 언제 찾았는지, 계산한 값인지 직접 잰 값인지도 적을 칸을 두어요. 한 줄에는 설정의 예를 써요.",
      "required": [
        "장소·날짜·시간대의 비교 조건을 담는다.",
        "시각·고도·낮의 길이의 양과 단위를 구별한다.",
        "출처와 확인일·자료 종류를 확인할 수 있게 한다.",
        "관측하지 않은 자료를 내 실측으로 표시하지 않는다."
      ],
      "exactStringScoring": false
    },
    "previousAnswerContract": {
      "type": "written-explanation",
      "sample": "장소와 좌표, 한국 시각인지와 날짜, 일출과 일몰, 남중 표시와 고도를 적을 칸을 만들어요. 어디에서 언제 찾았는지, 계산한 값인지 직접 잰 값인지도 적을 칸을 두어요. 한 줄에는 설정의 예를 써요.",
      "teacherRequired": true,
      "rubric": {
        "required": [
          "장소·날짜·시간대의 비교 조건을 담는다.",
          "시각·고도·낮의 길이의 양과 단위를 구별한다.",
          "출처와 확인일·자료 종류를 확인할 수 있게 한다.",
          "관측하지 않은 자료를 내 실측으로 표시하지 않는다."
        ],
        "pass": "그림·근거와 실제 수행은 교사 확인 · 타당한 동등 표현 인정"
      },
      "seasonContract": {
        "kind": "drawing",
        "teacherRequired": true,
        "sample": "장소와 좌표, 한국 시각인지와 날짜, 일출과 일몰, 남중 표시와 고도를 적을 칸을 만들어요. 어디에서 언제 찾았는지, 계산한 값인지 직접 잰 값인지도 적을 칸을 두어요. 한 줄에는 설정의 예를 써요.",
        "required": [
          "장소·날짜·시간대의 비교 조건을 담는다.",
          "시각·고도·낮의 길이의 양과 단위를 구별한다.",
          "출처와 확인일·자료 종류를 확인할 수 있게 한다.",
          "관측하지 않은 자료를 내 실측으로 표시하지 않는다."
        ],
        "exactStringScoring": false
      },
      "reviewRequired": true
    },
    "previousChoices": null,
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": {
        "id": "c22-s62-u01-w064",
        "no": 64
      },
      "bookQuestionId": "c22-s62-u01-w064",
      "sourceId": null,
      "bookResponseForm": "draw-design",
      "explanation": "다른 친구도 같은 자료를 찾을 수 있도록 장소와 날짜, 한국 시각인지와 출처를 적을 칸을 만들어요. 계산한 값인지 직접 잰 값인지도 나누어 적어요."
    },
    "fields": {
      "answerContract": {
        "type": "written-explanation",
        "sample": "네 날짜의 태양 자료를 적을 줄을 만들어요. 장소·날짜·시각·출처를 적을 칸을 넣고, 관측 전 결과 칸은 비워 두어요. 시각에 한국 시각이라고 덧붙이거나 어떤 태양 자료인지 적을 칸을 더해도 좋아요.",
        "teacherRequired": true,
        "rubric": {
          "required": [
            "네 날짜의 태양 자료를 적을 빈칸과 장소·날짜·시각·출처를 적을 칸을 만들어요. 다른 친구도 같은 자료를 찾을 수 있도록 표시해요. 태양 자료의 종류나 단위 등을 더 적어도 좋아요."
          ],
          "pass": "그림·근거와 실제 수행은 교사 확인 · 타당한 동등 표현 인정"
        },
        "seasonContract": {
          "kind": "drawing",
          "teacherRequired": true,
          "sample": "네 날짜의 태양 자료를 적을 줄을 만들어요. 장소·날짜·시각·출처를 적을 칸을 넣고, 관측 전 결과 칸은 비워 두어요. 시각에 한국 시각이라고 덧붙이거나 어떤 태양 자료인지 적을 칸을 더해도 좋아요.",
          "required": [
            "네 날짜의 태양 자료를 적을 빈칸과 장소·날짜·시각·출처를 적을 칸을 만들어요. 다른 친구도 같은 자료를 찾을 수 있도록 표시해요. 태양 자료의 종류나 단위 등을 더 적어도 좋아요."
          ],
          "exactStringScoring": false
        },
        "reviewRequired": true
      },
      "explanation": "다른 친구도 같은 자료를 찾을 수 있도록 장소·날짜·시각·출처를 적을 칸을 만들어요. 표를 만들 때 아직 찾거나 재지 않은 값은 채우지 않아요.",
      "responseContract": {
        "kind": "drawing",
        "teacherRequired": true,
        "sample": "네 날짜의 태양 자료를 적을 줄을 만들어요. 장소·날짜·시각·출처를 적을 칸을 넣고, 관측 전 결과 칸은 비워 두어요. 시각에 한국 시각이라고 덧붙이거나 어떤 태양 자료인지 적을 칸을 더해도 좋아요.",
        "required": [
          "네 날짜의 태양 자료를 적을 빈칸과 장소·날짜·시각·출처를 적을 칸을 만들어요. 다른 친구도 같은 자료를 찾을 수 있도록 표시해요. 태양 자료의 종류나 단위 등을 더 적어도 좋아요."
        ],
        "exactStringScoring": false
      }
    }
  },
  "c22-s51-u04-b058": {
    "unit": "c22-s51-u04",
    "previousVersion": "20261106-body-readable-workbook",
    "prompt": "가벼운 걷기 전후의 변화를 적을 빈 표를 그리세요. 날짜·관찰 시간·걷거나 쉰 시간·실제 횟수·다시 살펴볼 점을 넣고, 결과 칸은 비워 두세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 우리 몸 독립 창작 학습",
      "course": "초등 5-1"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 1,
      "unit": "u04",
      "area": "생명",
      "element": "E7",
      "type": "T14",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과04-03",
      "topic": "실제 기록 설계",
      "concept": "관찰 근거·자료 제작·실제 소통과 보완",
      "inquirySkill": "관찰 근거·자료 제작·실제 소통과 보완"
    },
    "responseContract": "written-explanation",
    "previousAnswerContract": {
      "type": "written-explanation",
      "sample": "관찰 전/직후/쉰 뒤와 맥박·호흡의 관찰 시간/횟수·방법·불분명·조건을 나누어 적을 표를 그린다.",
      "rubric": {
        "required": [
          "같은 시간/시점1, 실제 변화/조건1, 결과 빈칸/불분명1."
        ],
        "pass": "교사 확인 · 동등 표현과 타당한 대안 인정",
        "note": "학습용 기준이며 실제 수행이나 학교 공식 성적을 확정하지 않는다."
      }
    },
    "previousChoices": null,
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": {
        "unit": "c22-s51-u04",
        "id": "body-book-58",
        "no": 58
      },
      "bookQuestionId": null,
      "sourceId": null,
      "bookResponseForm": "draw",
      "explanation": "날짜와 관찰 시점, 얼마 동안 셀지와 관찰 방법을 적을 칸을 만들어요. 실제 횟수와 잘 세지 못한 점도 남길 수 있게 하고, 결과는 관찰한 뒤 채워요."
    },
    "fields": {
      "answerContract": {
        "type": "written-explanation",
        "sample": "날짜·관찰 시간·걷거나 쉰 시간·실제 횟수·다시 살펴볼 점을 적을 칸을 만들어요. 걷기 전·직후·쉰 뒤를 나누고, 맥박이나 호흡을 센 결과 칸은 관찰 전에는 비워 두어요.",
        "rubric": {
          "required": [
            "날짜·관찰 시간·걷거나 쉰 시간·실제 횟수·다시 살펴볼 점을 적을 칸을 구별해요. 관찰 전 결과 칸은 비워 두어요."
          ],
          "pass": "교사 확인 · 동등 표현과 타당한 대안 인정",
          "note": "학습용 기준이며 실제 수행이나 학교 공식 성적을 확정하지 않는다."
        }
      }
    }
  },
  "c22-s61-u02-b128": {
    "unit": "c22-s61-u02",
    "previousVersion": "20261106-motion-readable-workbook",
    "prompt": "안전띠 또는 과속 방지 턱을 소개하는 카드를 그리세요. 장치의 이름과 역할, 함께 지킬 안전 행동, 알아본 자료를 넣으세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 128,
      "section": "교과 연결 사고력"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T13",
      "format": "그림 완성",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-03",
      "topic": "안전장치 소개 자료 만들기",
      "concept": "안전 조사와 설명 공유",
      "inquirySkill": "출처를 확인해 설명 자료를 실제 제작/공유하고 받은 질문과 미수신을 구별해 보완한다."
    },
    "responseContract": "written-explanation",
    "previousAnswerContract": {
      "type": "written-explanation",
      "sample": "장치 이름과 하는 일을 그림과 문장으로 나타내요. 안전띠는 바르게 매기, 과속 방지 턱은 속력 줄이기와 연결하고 찾아본 자료를 적어요.",
      "rubric": {
        "required": [
          "안전장치의 역할을 정확히 나타내고 함께 지킬 행동을 읽기 쉽게 소개해요."
        ],
        "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
      },
      "motionContract": {
        "kind": "teacher-drawing",
        "teacherRequired": true,
        "sample": "장치 이름과 하는 일을 그림과 문장으로 나타내요. 안전띠는 바르게 매기, 과속 방지 턱은 속력 줄이기와 연결하고 찾아본 자료를 적어요.",
        "required": [
          "안전장치의 역할을 정확히 나타내고 함께 지킬 행동을 읽기 쉽게 소개해요."
        ],
        "actualPerformanceMustNotBeInferred": true
      },
      "reviewRequired": true
    },
    "previousChoices": null,
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": {
        "id": "c22-s61-u02-w128",
        "no": 128
      },
      "bookQuestionId": "c22-s61-u02-w128",
      "sourceId": null,
      "bookResponseForm": "draw",
      "explanation": "장치 이름과 하는 일을 바르게 나타내요. 장치의 역할과 함께 지킬 행동, 찾아본 자료를 친구가 읽기 쉽게 소개해요."
    },
    "fields": {
      "answerContract": {
        "type": "written-explanation",
        "sample": "장치 이름과 하는 일을 그림과 문장으로 나타내요. 안전띠는 바르게 매기, 과속 방지 턱은 속력 줄이기와 연결하고 찾아본 자료를 적어요.",
        "rubric": {
          "required": [
            "고른 장치의 이름과 역할, 함께 지킬 안전 행동, 알아본 자료를 그림과 글로 나타내요."
          ],
          "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
        },
        "motionContract": {
          "kind": "teacher-drawing",
          "teacherRequired": true,
          "sample": "장치 이름과 하는 일을 그림과 문장으로 나타내요. 안전띠는 바르게 매기, 과속 방지 턱은 속력 줄이기와 연결하고 찾아본 자료를 적어요.",
          "required": [
            "고른 장치의 이름과 역할, 함께 지킬 안전 행동, 알아본 자료를 그림과 글로 나타내요."
          ],
          "actualPerformanceMustNotBeInferred": true
        },
        "reviewRequired": true
      }
    }
  },
  "c22-s61-u03-b112": {
    "unit": "c22-s61-u03",
    "previousVersion": "20261106-plant-structure-readable-workbook",
    "prompt": "직접 관찰했거나 자료에서 확인한 열매나 씨 한 가지를 그리세요. 부분의 이름을 붙이고, 씨를 보호하거나 퍼지는 데 도움이 되는 특징을 설명하세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 112,
      "section": "교과 연결 사고력"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u03",
      "area": "생명",
      "element": "E5",
      "type": "T12",
      "format": "그림 설명",
      "level": "기본",
      "track": "교과",
      "standard": "6과11-02",
      "topic": "열매와 씨의 구조 그리기",
      "concept": "열매와 씨 퍼뜨림",
      "inquirySkill": "특징·보호·확산 방법 연결"
    },
    "responseContract": "written-explanation",
    "previousAnswerContract": {
      "type": "written-explanation",
      "sample": "확인한 열매나 씨를 크게 그리고, 씨를 둘러싼 부분이나 날개와 갈고리 등에 이름을 붙여요. 그 특징이 보호나 퍼짐에 어떻게 도움이 되는지 설명하고, 직접 보았는지 어떤 자료에서 찾았는지도 적어요.",
      "rubric": {
        "required": [
          "대상과 관찰/조사 출처",
          "확인한 구조의 그림과 이름표",
          "보호/퍼짐 역할을 구조 근거로 설명"
        ],
        "pass": "그림·관찰·근거와 실제 제작/설명은 교사 확인 · 타당한 동등 표현 인정"
      },
      "plantAuthoredContract": {
        "kind": "drawing",
        "teacherRequired": true,
        "actualPerformanceMustNotBeInferred": true,
        "required": [
          "대상과 관찰/조사 출처",
          "확인한 구조의 그림과 이름표",
          "보호/퍼짐 역할을 구조 근거로 설명"
        ]
      }
    },
    "previousChoices": null,
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": "c22-s61-u03-w112",
      "sourceId": null,
      "bookResponseForm": "draw",
      "explanation": "실제로 확인한 열매나 씨를 크게 그리고, 씨를 보호하는 부분이나 날개와 갈고리 등을 표시해요. 그 특징이 보호나 퍼짐에 어떻게 도움이 되는지 설명하고 어디서 알아보았는지도 적어요."
    },
    "fields": {
      "answerContract": {
        "type": "written-explanation",
        "sample": "확인한 열매나 씨를 크게 그리고, 씨를 둘러싼 부분이나 날개와 갈고리 등에 이름을 붙여요. 그 특징이 보호나 퍼짐에 어떻게 도움이 되는지 설명하고, 직접 보았는지 어떤 자료에서 찾았는지도 적어요.",
        "rubric": {
          "required": [
            "확인한 열매나 씨 한 가지의 그림과 부분 이름을 나타내고, 그 특징이 씨를 보호하거나 퍼지는 데 어떻게 도움이 되는지 설명해요. 어디에서 알아보았는지 덧붙여도 좋아요."
          ],
          "pass": "그림·관찰·근거와 실제 제작/설명은 교사 확인 · 타당한 동등 표현 인정"
        },
        "plantAuthoredContract": {
          "kind": "drawing",
          "teacherRequired": true,
          "actualPerformanceMustNotBeInferred": true,
          "required": [
            "확인한 열매나 씨 한 가지의 그림과 부분 이름을 나타내고, 그 특징이 씨를 보호하거나 퍼지는 데 어떻게 도움이 되는지 설명해요. 어디에서 알아보았는지 덧붙여도 좋아요."
          ]
        }
      }
    }
  },
  "c22-s61-u02-b016": {
    "unit": "c22-s61-u02",
    "previousVersion": null,
    "prompt": "가로·세로 눈금이 0~5인 좌표 평면을 그리고 처음 A(1, 2), 나중 B(4, 3)를 표시하세요. 이름표와 좌표를 읽는 순서도 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 16,
      "section": "교과 연결 사고력"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T11",
      "format": "그림 완성",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-01",
      "topic": "처음과 나중을 그리기",
      "concept": "좌표 평면의 위치 표현",
      "inquirySkill": "간단한 좌표 평면에 처음/나중 위치를 표현하고 두 점 사이 거리를 계산하지 않는다."
    },
    "responseContract": "written-explanation",
    "previousAnswerContract": {
      "type": "written-explanation",
      "sample": "가로축과 세로축·0~5눈금, A(1, 2), B(4, 3)와 처음/나중 이름표를 표시해요.",
      "rubric": {
        "required": [
          "가로/세로와 0~5눈금",
          "A(1, 2), B(4, 3)의 위치",
          "처음/나중 및 가로 먼저라는 이름표"
        ],
        "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
      },
      "motionContract": {
        "kind": "teacher-drawing",
        "teacherRequired": true,
        "sample": "가로축과 세로축·0~5눈금, A(1, 2), B(4, 3)와 처음/나중 이름표를 표시해요.",
        "required": [
          "가로/세로와 0~5눈금",
          "A(1, 2), B(4, 3)의 위치",
          "처음/나중 및 가로 먼저라는 이름표"
        ],
        "actualPerformanceMustNotBeInferred": true
      }
    },
    "previousChoices": null,
    "presentation": {
      "givens": null,
      "figure": null,
      "observationPhotos": null,
      "photoLabels": null,
      "workbookRef": null,
      "bookQuestionId": "c22-s61-u02-w016",
      "sourceId": null,
      "bookResponseForm": "draw",
      "explanation": "좌표를 정확히 표시하고 처음과 나중을 구별해요. 두 점의 거리는 계산하지 않아요."
    },
    "fields": {
      "answerContract": {
        "type": "written-explanation",
        "sample": "가로축과 세로축에 0~5 눈금을 표시하고 A(1, 2)는 처음, B(4, 3)는 나중이라고 써요. 좌표는 가로의 수를 먼저, 세로의 수를 나중에 읽는다고 적어요.",
        "rubric": {
          "required": [
            "가로/세로와 0~5눈금",
            "A(1, 2), B(4, 3)의 위치",
            "처음/나중 및 가로 먼저라는 이름표"
          ],
          "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
        },
        "motionContract": {
          "kind": "teacher-drawing",
          "teacherRequired": true,
          "sample": "가로축과 세로축에 0~5 눈금을 표시하고 A(1, 2)는 처음, B(4, 3)는 나중이라고 써요. 좌표는 가로의 수를 먼저, 세로의 수를 나중에 읽는다고 적어요.",
          "required": [
            "가로/세로와 0~5눈금",
            "A(1, 2), B(4, 3)의 위치",
            "처음/나중 및 가로 먼저라는 이름표"
          ],
          "actualPerformanceMustNotBeInferred": true
        }
      },
      "explanation": "A는 가로 1·세로 2, B는 가로 4·세로 3에 표시해요. 좌표는 가로의 수, 세로의 수 순서로 읽어요. 처음과 나중을 구별하고 두 점의 거리는 계산하지 않아요."
    }
  }
};
const workbookPatches={
  "c22-s62-u04-w016": {
    "unit": "c22-s62-u04",
    "previousStatus": "authored",
    "prompt": "두 자료를 비교할 판을 만드세요. 같은 점과 다른 점, 바로 비교하기 어려운 까닭을 적을 칸을 두세요.",
    "sourceId": null,
    "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-2",
      "unit": "Ⅳ. 과학과 나의 진로",
      "originalExam": false
    },
    "presentation": {
      "form": "draw",
      "key": null,
      "choices": null,
      "givens": null,
      "given": null,
      "table": null,
      "parts": null,
      "figure": null,
      "sharedFigure": null,
      "responseContract": {
        "kind": "drawing",
        "teacherRequired": true,
        "sample": "두 자료의 출처와 조사한 곳·기간·방법·단위를 나란히 적어요. 비교할 수 있는 점과 더 알아볼 점을 나누고 결론 칸은 비워 두어요.",
        "required": [
          "비교 조건 네 가지를 나눈다.",
          "두 출처를 다시 찾게 한다.",
          "추가 확인과 결론을 구별한다."
        ],
        "exactStringScoring": false
      },
      "answer": "두 자료의 출처와 조사한 곳·기간·방법·단위를 나란히 적어요. 비교할 수 있는 점과 더 알아볼 점을 나누고 결론 칸은 비워 두어요.",
      "explanation": "두 자료의 조사한 곳과 기간, 방법, 단위를 나란히 살펴요. 바로 비교하기 어려운 점은 따로 적어요. 자료를 읽기 전에는 결론을 미리 채우지 않아요."
    },
    "fields": {
      "criteria": [
        "비교 조건 네 가지를 나눈다. / 두 출처를 다시 찾게 한다. / 추가 확인과 결론을 구별한다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 조사·토의·설명 수행을 확정하지 않는다.",
        "두 자료의 같은 점·다른 점·바로 비교하기 어려운 까닭을 적을 칸을 나누어요. 조사한 곳·기간·방법·단위나 출처를 덧붙여도 좋아요."
      ],
      "answer": [
        "두 자료의 출처와 조사한 곳·기간·방법·단위를 나란히 적어요. 비교할 수 있는 점과 더 알아볼 점을 나누고 결론 칸은 비워 두어요.",
        "두 자료를 나란히 놓고 같은 점·다른 점·바로 비교하기 어려운 까닭을 적을 칸을 만들어요. 조사한 곳·기간·방법·단위나 출처를 살펴볼 칸을 더해도 좋아요."
      ],
      "explanation": [
        "두 자료의 조사한 곳과 기간, 방법, 단위를 나란히 살펴요. 바로 비교하기 어려운 점은 따로 적어요. 자료를 읽기 전에는 결론을 미리 채우지 않아요.",
        "같은 점과 다른 점을 적을 칸을 나누어요. 자료를 비교하기 어려운 까닭도 적을 자리를 두어요. 조사한 곳이나 기간 등이 같은지 살펴보면 까닭을 찾는 데 도움이 돼요."
      ],
      "responseContract": [
        {
          "kind": "drawing",
          "teacherRequired": true,
          "sample": "두 자료의 출처와 조사한 곳·기간·방법·단위를 나란히 적어요. 비교할 수 있는 점과 더 알아볼 점을 나누고 결론 칸은 비워 두어요.",
          "required": [
            "비교 조건 네 가지를 나눈다.",
            "두 출처를 다시 찾게 한다.",
            "추가 확인과 결론을 구별한다."
          ],
          "exactStringScoring": false
        },
        {
          "kind": "drawing",
          "teacherRequired": true,
          "sample": "두 자료를 나란히 놓고 같은 점·다른 점·바로 비교하기 어려운 까닭을 적을 칸을 만들어요. 조사한 곳·기간·방법·단위나 출처를 살펴볼 칸을 더해도 좋아요.",
          "required": [
            "두 자료의 같은 점·다른 점·바로 비교하기 어려운 까닭을 적을 칸을 나누어요. 조사한 곳·기간·방법·단위나 출처를 덧붙여도 좋아요."
          ],
          "exactStringScoring": false
        }
      ]
    }
  },
  "c22-s62-u04-w127": {
    "unit": "c22-s62-u04",
    "previousStatus": "authored",
    "prompt": "관심 있는 직업을 과학과 관련지어 소개하는 카드를 그리세요. 직업·하는 일·관련된 과학·알아본 자료를 넣으세요.",
    "sourceId": null,
    "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-2",
      "unit": "Ⅳ. 과학과 나의 진로",
      "originalExam": false
    },
    "presentation": {
      "form": "draw",
      "key": null,
      "choices": null,
      "givens": null,
      "given": null,
      "table": null,
      "parts": null,
      "figure": null,
      "sharedFigure": null,
      "responseContract": {
        "kind": "drawing",
        "teacherRequired": true,
        "sample": "직업에서 하는 일의 한 장면을 그리고 그 일에 이용되는 과학을 그림과 글로 연결해요. 자료에서 알아본 내용과 더 궁금한 점을 덧붙여요.",
        "required": [
          "관심 있는 직업이나 활동을 나타낸다.",
          "하는 일과 과학적 요소를 관련지어 설명한다.",
          "알아본 자료를 밝힌다."
        ],
        "exactStringScoring": false
      },
      "answer": "직업에서 하는 일의 한 장면을 그리고 그 일에 이용되는 과학을 그림과 글로 연결해요. 자료에서 알아본 내용과 더 궁금한 점을 덧붙여요.",
      "explanation": "직업에서 하는 일의 한 장면을 그리고 그 일에 이용되는 과학을 그림과 글로 연결해요. 자료에서 알아본 내용과 더 궁금한 점을 덧붙여요."
    },
    "fields": {
      "criteria": [
        "직업에서 하는 일의 한 장면을 그리고 그 일에 이용되는 과학을 그림과 글로 연결해요. 자료에서 알아본 내용과 더 궁금한 점을 덧붙여요.",
        "관심 있는 직업의 이름과 하는 일, 그 일에 관련된 과학, 알아본 자료를 그림과 글로 나타내요."
      ]
    }
  },
  "c22-s62-u03-w128": {
    "unit": "c22-s62-u03",
    "previousStatus": "authored",
    "prompt": "실천 결과를 친구에게 설명할 그림판을 그리세요. 계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요.",
    "sourceId": null,
    "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-2",
      "unit": "Ⅲ. 전기의 이용",
      "originalExam": false
    },
    "presentation": {
      "form": "draw",
      "key": null,
      "choices": null,
      "givens": null,
      "given": null,
      "table": null,
      "parts": null,
      "figure": null,
      "sharedFigure": null,
      "responseContract": {
        "kind": "drawing",
        "teacherRequired": true,
        "sample": "네 칸에 자료 종류와 날짜, 사용 조건을 적어요. 켠 시간의 변화와 아직 재지 않은 전기 사용량·요금을 나누어요. 친구가 한 질문과 다음에 확인할 점도 적을 칸을 두어요.",
        "required": [
          "계획과 실제 수행을 나눈다.",
          "확인한 변화와 효과의 한계를 구별한다.",
          "질문·추가 자료·다음 검토를 남긴다."
        ],
        "exactStringScoring": false
      },
      "answer": "네 칸에 자료 종류와 날짜, 사용 조건을 적어요. 켠 시간의 변화와 아직 재지 않은 전기 사용량·요금을 나누어요. 친구가 한 질문과 다음에 확인할 점도 적을 칸을 두어요.",
      "explanation": "실제로 확인한 시간 변화와 아직 재지 않은 전기 사용량·요금을 나누어요. 자료와 날짜, 사용 조건을 적고 받은 질문과 다음에 확인할 점도 남겨요."
    },
    "fields": {
      "criteria": [
        "계획과 실제 수행을 나눈다. / 확인한 변화와 효과의 한계를 구별한다. / 질문·추가 자료·다음 검토를 남긴다. 같은 조건과 근거를 갖춘 다른 타당한 표현·배치도 교사가 확인한다. 답 문장만으로 실제 실험·조사·설명 수행을 확정하지 않는다.",
        "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요. 확인하지 않은 전기 사용량이나 요금을 이미 잰 결과처럼 쓰지 않아요."
      ],
      "answer": [
        "네 칸에 자료 종류와 날짜, 사용 조건을 적어요. 켠 시간의 변화와 아직 재지 않은 전기 사용량·요금을 나누어요. 친구가 한 질문과 다음에 확인할 점도 적을 칸을 두어요.",
        "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요. 예를 들어 켠 시간이 줄어든 것은 확인한 변화 칸에, 아직 재지 않은 전기 사용량이나 요금은 모르는 효과 칸에 적을 수 있어요."
      ],
      "explanation": [
        "실제로 확인한 시간 변화와 아직 재지 않은 전기 사용량·요금을 나누어요. 자료와 날짜, 사용 조건을 적고 받은 질문과 다음에 확인할 점도 남겨요.",
        "하려던 일과 실제로 한 일을 구별할 칸을 만들어요. 확인한 변화와 아직 알 수 없는 효과도 나누어요. 그림판을 그린 것만으로 실제로 실천하거나 친구에게 설명한 것은 아니에요."
      ],
      "responseContract": [
        {
          "kind": "drawing",
          "teacherRequired": true,
          "sample": "네 칸에 자료 종류와 날짜, 사용 조건을 적어요. 켠 시간의 변화와 아직 재지 않은 전기 사용량·요금을 나누어요. 친구가 한 질문과 다음에 확인할 점도 적을 칸을 두어요.",
          "required": [
            "계획과 실제 수행을 나눈다.",
            "확인한 변화와 효과의 한계를 구별한다.",
            "질문·추가 자료·다음 검토를 남긴다."
          ],
          "exactStringScoring": false
        },
        {
          "kind": "drawing",
          "teacherRequired": true,
          "sample": "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요. 예를 들어 켠 시간이 줄어든 것은 확인한 변화 칸에, 아직 재지 않은 전기 사용량이나 요금은 모르는 효과 칸에 적을 수 있어요.",
          "required": [
            "계획·실제로 한 일·확인한 변화·아직 모르는 효과를 네 칸으로 나누어요. 확인하지 않은 전기 사용량이나 요금을 이미 잰 결과처럼 쓰지 않아요."
          ],
          "exactStringScoring": false
        }
      ]
    }
  },
  "c22-s62-u01-w064": {
    "unit": "c22-s62-u01",
    "previousStatus": "authored",
    "prompt": "네 날짜의 태양 자료를 모을 빈 표를 그리세요. 친구도 같은 자료를 찾을 수 있도록 장소와 날짜, 시각과 출처를 적을 칸을 만드세요.",
    "sourceId": null,
    "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-2",
      "unit": "Ⅰ. 계절의 변화",
      "originalExam": false
    },
    "presentation": {
      "form": "draw",
      "key": null,
      "choices": null,
      "givens": null,
      "given": null,
      "table": null,
      "parts": null,
      "figure": null,
      "sharedFigure": null,
      "responseContract": {
        "kind": "drawing",
        "teacherRequired": true,
        "sample": "장소와 좌표, 한국 시각인지와 날짜, 일출과 일몰, 남중 표시와 고도를 적을 칸을 만들어요. 어디에서 언제 찾았는지, 계산한 값인지 직접 잰 값인지도 적을 칸을 두어요. 한 줄에는 설정의 예를 써요.",
        "required": [
          "장소·날짜·시간대의 비교 조건을 담는다.",
          "시각·고도·낮의 길이의 양과 단위를 구별한다.",
          "출처와 확인일·자료 종류를 확인할 수 있게 한다.",
          "관측하지 않은 자료를 내 실측으로 표시하지 않는다."
        ],
        "exactStringScoring": false
      },
      "answer": "장소와 좌표, 한국 시각인지와 날짜, 일출과 일몰, 남중 표시와 고도를 적을 칸을 만들어요. 어디에서 언제 찾았는지, 계산한 값인지 직접 잰 값인지도 적을 칸을 두어요. 한 줄에는 설정의 예를 써요.",
      "explanation": "다른 친구도 같은 자료를 찾을 수 있도록 장소와 날짜, 한국 시각인지와 출처를 적을 칸을 만들어요. 계산한 값인지 직접 잰 값인지도 나누어 적어요."
    },
    "fields": {
      "criteria": [
        "장소·날짜·시간대의 비교 조건을 담는다. / 시각·고도·낮의 길이의 양과 단위를 구별한다. / 출처와 확인일·자료 종류를 확인할 수 있게 한다. / 관측하지 않은 자료를 내 실측으로 표시하지 않는다. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관측·제작을 완료했다고 정하지 않는다.",
        "네 날짜의 태양 자료를 적을 빈칸과 장소·날짜·시각·출처를 적을 칸을 만들어요. 다른 친구도 같은 자료를 찾을 수 있도록 표시해요. 태양 자료의 종류나 단위 등을 더 적어도 좋아요."
      ],
      "answer": [
        "장소와 좌표, 한국 시각인지와 날짜, 일출과 일몰, 남중 표시와 고도를 적을 칸을 만들어요. 어디에서 언제 찾았는지, 계산한 값인지 직접 잰 값인지도 적을 칸을 두어요. 한 줄에는 설정의 예를 써요.",
        "네 날짜의 태양 자료를 적을 줄을 만들어요. 장소·날짜·시각·출처를 적을 칸을 넣고, 관측 전 결과 칸은 비워 두어요. 시각에 한국 시각이라고 덧붙이거나 어떤 태양 자료인지 적을 칸을 더해도 좋아요."
      ],
      "explanation": [
        "다른 친구도 같은 자료를 찾을 수 있도록 장소와 날짜, 한국 시각인지와 출처를 적을 칸을 만들어요. 계산한 값인지 직접 잰 값인지도 나누어 적어요.",
        "다른 친구도 같은 자료를 찾을 수 있도록 장소·날짜·시각·출처를 적을 칸을 만들어요. 표를 만들 때 아직 찾거나 재지 않은 값은 채우지 않아요."
      ],
      "responseContract": [
        {
          "kind": "drawing",
          "teacherRequired": true,
          "sample": "장소와 좌표, 한국 시각인지와 날짜, 일출과 일몰, 남중 표시와 고도를 적을 칸을 만들어요. 어디에서 언제 찾았는지, 계산한 값인지 직접 잰 값인지도 적을 칸을 두어요. 한 줄에는 설정의 예를 써요.",
          "required": [
            "장소·날짜·시간대의 비교 조건을 담는다.",
            "시각·고도·낮의 길이의 양과 단위를 구별한다.",
            "출처와 확인일·자료 종류를 확인할 수 있게 한다.",
            "관측하지 않은 자료를 내 실측으로 표시하지 않는다."
          ],
          "exactStringScoring": false
        },
        {
          "kind": "drawing",
          "teacherRequired": true,
          "sample": "네 날짜의 태양 자료를 적을 줄을 만들어요. 장소·날짜·시각·출처를 적을 칸을 넣고, 관측 전 결과 칸은 비워 두어요. 시각에 한국 시각이라고 덧붙이거나 어떤 태양 자료인지 적을 칸을 더해도 좋아요.",
          "required": [
            "네 날짜의 태양 자료를 적을 빈칸과 장소·날짜·시각·출처를 적을 칸을 만들어요. 다른 친구도 같은 자료를 찾을 수 있도록 표시해요. 태양 자료의 종류나 단위 등을 더 적어도 좋아요."
          ],
          "exactStringScoring": false
        }
      ]
    }
  },
  "body-book-58": {
    "unit": "c22-s51-u04",
    "previousStatus": "authored",
    "prompt": "가벼운 걷기 전후의 변화를 적을 빈 표를 그리세요. 날짜·관찰 시간·걷거나 쉰 시간·실제 횟수·다시 살펴볼 점을 넣고, 결과 칸은 비워 두세요.",
    "sourceId": null,
    "sourceRef": null,
    "presentation": {
      "form": "draw",
      "key": null,
      "choices": null,
      "givens": null,
      "given": null,
      "table": null,
      "parts": null,
      "figure": null,
      "sharedFigure": null,
      "responseContract": null,
      "answer": "관찰 전/직후/쉰 뒤와 맥박·호흡의 관찰 시간/횟수·방법·불분명·조건을 나누어 적을 표를 그린다.",
      "explanation": "날짜와 관찰 시점, 얼마 동안 셀지와 관찰 방법을 적을 칸을 만들어요. 실제 횟수와 잘 세지 못한 점도 남길 수 있게 하고, 결과는 관찰한 뒤 채워요."
    },
    "fields": {
      "criteria": [
        "같은 시간/시점1, 실제 변화/조건1, 결과 빈칸/불분명1.",
        "날짜·관찰 시간·걷거나 쉰 시간·실제 횟수·다시 살펴볼 점을 적을 칸을 구별해요. 관찰 전 결과 칸은 비워 두어요."
      ],
      "answer": [
        "관찰 전/직후/쉰 뒤와 맥박·호흡의 관찰 시간/횟수·방법·불분명·조건을 나누어 적을 표를 그린다.",
        "날짜·관찰 시간·걷거나 쉰 시간·실제 횟수·다시 살펴볼 점을 적을 칸을 만들어요. 걷기 전·직후·쉰 뒤를 나누고, 맥박이나 호흡을 센 결과 칸은 관찰 전에는 비워 두어요."
      ]
    }
  },
  "c22-s61-u02-w128": {
    "unit": "c22-s61-u02",
    "previousStatus": "authored-draft",
    "prompt": "안전띠 또는 과속 방지 턱을 소개하는 카드를 그리세요. 장치의 이름과 역할, 함께 지킬 안전 행동, 알아본 자료를 넣으세요.",
    "sourceId": null,
    "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅱ. 물체의 운동",
      "originalExam": false
    },
    "presentation": {
      "form": "draw",
      "key": null,
      "choices": null,
      "givens": null,
      "given": null,
      "table": null,
      "parts": null,
      "figure": null,
      "sharedFigure": null,
      "responseContract": {
        "kind": "teacher-drawing",
        "teacherRequired": true,
        "sample": "장치 이름과 하는 일을 그림과 문장으로 나타내요. 안전띠는 바르게 매기, 과속 방지 턱은 속력 줄이기와 연결하고 찾아본 자료를 적어요.",
        "required": [
          "안전장치의 역할을 정확히 나타내고 함께 지킬 행동을 읽기 쉽게 소개해요."
        ],
        "actualPerformanceMustNotBeInferred": true
      },
      "answer": "장치 이름과 하는 일을 그림과 문장으로 나타내요. 안전띠는 바르게 매기, 과속 방지 턱은 속력 줄이기와 연결하고 찾아본 자료를 적어요.",
      "explanation": "장치 이름과 하는 일을 바르게 나타내요. 장치의 역할과 함께 지킬 행동, 찾아본 자료를 친구가 읽기 쉽게 소개해요."
    },
    "fields": {
      "criteria": [
        "안전장치의 역할을 정확히 나타내고 함께 지킬 행동을 읽기 쉽게 소개해요.",
        "고른 장치의 이름과 역할, 함께 지킬 안전 행동, 알아본 자료를 그림과 글로 나타내요."
      ],
      "responseContract": [
        {
          "kind": "teacher-drawing",
          "teacherRequired": true,
          "sample": "장치 이름과 하는 일을 그림과 문장으로 나타내요. 안전띠는 바르게 매기, 과속 방지 턱은 속력 줄이기와 연결하고 찾아본 자료를 적어요.",
          "required": [
            "안전장치의 역할을 정확히 나타내고 함께 지킬 행동을 읽기 쉽게 소개해요."
          ],
          "actualPerformanceMustNotBeInferred": true
        },
        {
          "kind": "teacher-drawing",
          "teacherRequired": true,
          "sample": "장치 이름과 하는 일을 그림과 문장으로 나타내요. 안전띠는 바르게 매기, 과속 방지 턱은 속력 줄이기와 연결하고 찾아본 자료를 적어요.",
          "required": [
            "고른 장치의 이름과 역할, 함께 지킬 안전 행동, 알아본 자료를 그림과 글로 나타내요."
          ],
          "actualPerformanceMustNotBeInferred": true
        }
      ]
    }
  },
  "c22-s61-u03-w112": {
    "unit": "c22-s61-u03",
    "previousStatus": "authored-draft",
    "prompt": "직접 관찰했거나 자료에서 확인한 열매나 씨 한 가지를 그리세요. 부분의 이름을 붙이고, 씨를 보호하거나 퍼지는 데 도움이 되는 특징을 설명하세요.",
    "sourceId": null,
    "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅲ. 식물의 구조와 기능",
      "originalExam": false
    },
    "presentation": {
      "form": "draw",
      "key": null,
      "choices": null,
      "givens": null,
      "given": null,
      "table": null,
      "parts": null,
      "figure": null,
      "sharedFigure": null,
      "responseContract": {
        "kind": "drawing",
        "teacherRequired": true,
        "actualPerformanceMustNotBeInferred": true,
        "required": [
          "대상과 관찰/조사 출처",
          "확인한 구조의 그림과 이름표",
          "보호/퍼짐 역할을 구조 근거로 설명"
        ]
      },
      "answer": "확인한 열매나 씨를 크게 그리고, 씨를 둘러싼 부분이나 날개와 갈고리 등에 이름을 붙여요. 그 특징이 보호나 퍼짐에 어떻게 도움이 되는지 설명하고, 직접 보았는지 어떤 자료에서 찾았는지도 적어요.",
      "explanation": "실제로 확인한 열매나 씨를 크게 그리고, 씨를 보호하는 부분이나 날개와 갈고리 등을 표시해요. 그 특징이 보호나 퍼짐에 어떻게 도움이 되는지 설명하고 어디서 알아보았는지도 적어요."
    },
    "fields": {
      "criteria": [
        "대상과 관찰/조사 출처 / 확인한 구조의 그림과 이름표 / 보호/퍼짐 역할을 구조 근거로 설명",
        "확인한 열매나 씨 한 가지의 그림과 부분 이름을 나타내고, 그 특징이 씨를 보호하거나 퍼지는 데 어떻게 도움이 되는지 설명해요. 어디에서 알아보았는지 덧붙여도 좋아요."
      ],
      "responseContract": [
        {
          "kind": "drawing",
          "teacherRequired": true,
          "actualPerformanceMustNotBeInferred": true,
          "required": [
            "대상과 관찰/조사 출처",
            "확인한 구조의 그림과 이름표",
            "보호/퍼짐 역할을 구조 근거로 설명"
          ]
        },
        {
          "kind": "drawing",
          "teacherRequired": true,
          "actualPerformanceMustNotBeInferred": true,
          "required": [
            "확인한 열매나 씨 한 가지의 그림과 부분 이름을 나타내고, 그 특징이 씨를 보호하거나 퍼지는 데 어떻게 도움이 되는지 설명해요. 어디에서 알아보았는지 덧붙여도 좋아요."
          ]
        }
      ]
    }
  },
  "c22-s61-u02-w016": {
    "unit": "c22-s61-u02",
    "previousStatus": "authored-draft",
    "prompt": "가로·세로 눈금이 0~5인 좌표 평면을 그리고 처음 A(1, 2), 나중 B(4, 3)를 표시하세요. 이름표와 좌표를 읽는 순서도 쓰세요.",
    "sourceId": null,
    "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅱ. 물체의 운동",
      "originalExam": false
    },
    "presentation": {
      "form": "draw",
      "key": null,
      "choices": null,
      "givens": null,
      "given": null,
      "table": null,
      "parts": null,
      "figure": null,
      "sharedFigure": null,
      "responseContract": {
        "kind": "teacher-drawing",
        "teacherRequired": true,
        "sample": "가로축과 세로축·0~5눈금, A(1, 2), B(4, 3)와 처음/나중 이름표를 표시해요.",
        "required": [
          "가로/세로와 0~5눈금",
          "A(1, 2), B(4, 3)의 위치",
          "처음/나중 및 가로 먼저라는 이름표"
        ],
        "actualPerformanceMustNotBeInferred": true
      },
      "answer": "가로축과 세로축·0~5눈금, A(1, 2), B(4, 3)와 처음/나중 이름표를 표시해요.",
      "explanation": "좌표를 정확히 표시하고 처음과 나중을 구별해요. 두 점의 거리는 계산하지 않아요."
    },
    "fields": {
      "answer": [
        "가로축과 세로축·0~5눈금, A(1, 2), B(4, 3)와 처음/나중 이름표를 표시해요.",
        "가로축과 세로축에 0~5 눈금을 표시하고 A(1, 2)는 처음, B(4, 3)는 나중이라고 써요. 좌표는 가로의 수를 먼저, 세로의 수를 나중에 읽는다고 적어요."
      ],
      "explanation": [
        "좌표를 정확히 표시하고 처음과 나중을 구별해요. 두 점의 거리는 계산하지 않아요.",
        "A는 가로 1·세로 2, B는 가로 4·세로 3에 표시해요. 좌표는 가로의 수, 세로의 수 순서로 읽어요. 처음과 나중을 구별하고 두 점의 거리는 계산하지 않아요."
      ],
      "responseContract": [
        {
          "kind": "teacher-drawing",
          "teacherRequired": true,
          "sample": "가로축과 세로축·0~5눈금, A(1, 2), B(4, 3)와 처음/나중 이름표를 표시해요.",
          "required": [
            "가로/세로와 0~5눈금",
            "A(1, 2), B(4, 3)의 위치",
            "처음/나중 및 가로 먼저라는 이름표"
          ],
          "actualPerformanceMustNotBeInferred": true
        },
        {
          "kind": "teacher-drawing",
          "teacherRequired": true,
          "sample": "가로축과 세로축에 0~5 눈금을 표시하고 A(1, 2)는 처음, B(4, 3)는 나중이라고 써요. 좌표는 가로의 수를 먼저, 세로의 수를 나중에 읽는다고 적어요.",
          "required": [
            "가로/세로와 0~5눈금",
            "A(1, 2), B(4, 3)의 위치",
            "처음/나중 및 가로 먼저라는 이름표"
          ],
          "actualPerformanceMustNotBeInferred": true
        }
      ]
    }
  }
};
const cache=new WeakMap();
const clone=value=>JSON.parse(JSON.stringify(value));
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function representationQuestionReview(rows,unit){
 if(!REPRESENTATION_REVIEW_BANK_UNITS.includes(unit)||!Array.isArray(rows))return rows;
 let changed=false;
 const next=rows.map(q=>{
  const p=patches[q.id];
  if(!p||p.unit!==unit||q.status!=='authored'||q.sourceContent||(q.contentVersion??null)!==p.previousVersion||q.prompt!==p.prompt||!Object.keys(p.presentation).every(k=>same(q[k]??null,p.presentation[k]))||!same(q.sourceRef,p.sourceRef)||!same(q.taxonomy,p.taxonomy)||!same(q.responseContract,p.responseContract)||!same(q.answerContract,p.previousAnswerContract)||!same(q.choices??null,p.previousChoices))return q;
  changed=true;
  if(cache.has(q))return cache.get(q);
  const current={...q,...clone(p.fields),...(q.diagnosticOverride?.version===(q.contentVersion||1)?{diagnosticOverride:{...clone(q.diagnosticOverride),version:REPRESENTATION_REVIEW_VERSION}}:{}),contentVersion:REPRESENTATION_REVIEW_VERSION,previousVersions:[...(q.previousVersions?clone(q.previousVersions):[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};
  cache.set(q,current);return current;
 });
 return changed?next:rows;
}
export function withRepresentationReviewedWorkbook(workbook){
 if(!REPRESENTATION_REVIEW_UNITS.includes(workbook?.unit)||!Array.isArray(workbook.questions))return workbook;
 let changed=false;
 const questions=workbook.questions.map(q=>{
  const p=workbookPatches[q.id];
  if(!p||p.unit!==workbook.unit||q.contentVersion!=null||q.sourceContent||(q.status??null)!==p.previousStatus||q.prompt!==p.prompt||!same(q.sourceId??null,p.sourceId)||!same(q.sourceRef??null,p.sourceRef)||!Object.keys(p.presentation).every(k=>same(q[k]??null,p.presentation[k]))||!Object.entries(p.fields).every(([key,[previous]])=>same(q[key],previous)))return q;
  changed=true;return {...q,...Object.fromEntries(Object.entries(p.fields).map(([key,[,value]])=>[key,clone(value)]))};
 });
 return changed?{...workbook,questions}:workbook;
}
export function withRepresentationClassroom(unit,mod){
 if(!mod?.classroomItems)return mod;
 const classroomItems=representationQuestionReview(mod.classroomItems,unit);
 return classroomItems===mod.classroomItems?mod:{...mod,classroomItems};
}
