export const SKY_RESPONSE_VERSION='20261115-sky-response-review';
// Match assessment guidance and organizing questions to the provided task.
const prior={
  "id": "c22-s42-u01-b30",
  "status": "authored",
  "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 범위 보충",
    "note": "원문 짝이 없는 독립 창작 문항. 지문에 제시한 연습용 자료는 학생의 실측 기록이 아니다."
  },
  "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 4,
    "semester": 2,
    "unit": "u01",
    "area": "지구와 우주",
    "element": "E2",
    "type": "T06",
    "format": "서술형",
    "level": "기본",
    "track": "교과",
    "topic": "반복과 관찰 범위의 판단",
    "concept": "반복과 관찰 범위의 판단",
    "inquirySkill": "반복과 관찰 범위의 판단",
    "standard": "4과13-01"
  },
  "prompt": "두 기록을 보고 알 수 있는 점 한 가지와 알 수 없는 점 한 가지를 써 보세요.",
  "givens": {
    "연습용 자료": "첫 관찰: 둥근 달 / 약 한 달 뒤 두 번째 관찰: 둥근 달 / 그 사이 기록 없음"
  },
  "choices": null,
  "visualModel": null,
  "variantRules": null,
  "responseContract": "written-explanation",
  "answerContract": {
    "type": "written-explanation",
    "sample": "두 관찰 날짜에는 둥근 달이 보였다. 사이의 매일 모양이나 날마다 달을 볼 수 있었는지는 이 두 기록으로 확인할 수 없다.",
    "teacherReview": true,
    "rubric": {
      "required": [
        "제시된 두 실제 관찰 기록에 맞는 결론을 쓴다.",
        "사이의 미기록 날짜/관찰 가능성에 대한 한계를 밝힌다."
      ],
      "pass": "예시와 표현이 달라도 자료·근거·설명의 타당성을 선생님이 확인"
    }
  },
  "explanation": "첫날과 약 한 달 뒤에 둥근 달을 본 기록이 있어요. 두 날짜에 비슷한 모습이 보였다고 말할 수 있어요. 그 사이에는 기록이 없으므로 매일 어떤 모양이었는지, 날마다 볼 수 있었는지는 알 수 없어요.",
  "evidence": {
    "checkedBy": "독립 창작·자료/조건/응답 계약 검토",
    "date": "2026-10-18",
    "gates": [
      "science",
      "answer"
    ],
    "productGate": false,
    "renderGate": false
  },
  "contentVersion": "20261106-sky-readable-workbook",
  "previousVersions": [
    {
      "id": "c22-s42-u01-b30",
      "status": "authored",
      "sourceRef": {
        "type": "authored-supplement",
        "edition": "2022 개정 범위 보충",
        "note": "원문 짝이 없는 독립 창작 문항. 지문에 제시한 연습용 자료는 학생의 실측 기록이 아니다."
      },
      "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 4,
        "semester": 2,
        "unit": "u01",
        "area": "지구와 우주",
        "element": "E2",
        "type": "T06",
        "format": "서술형",
        "level": "기본",
        "track": "교과",
        "topic": "반복과 관찰 범위의 판단",
        "concept": "반복과 관찰 범위의 판단",
        "inquirySkill": "반복과 관찰 범위의 판단",
        "standard": "4과13-01"
      },
      "prompt": "이 자료로 말할 수 있는 결론 한 가지와 아직 확인할 수 없는 점 한 가지를 쓰세요.",
      "givens": {
        "연습용 자료": "첫 관찰: 둥근 달 / 약 한 달 뒤 두 번째 관찰: 둥근 달 / 그 사이 기록 없음"
      },
      "choices": null,
      "visualModel": null,
      "variantRules": null,
      "responseContract": "written-explanation",
      "answerContract": {
        "type": "written-explanation",
        "sample": "두 관찰 날짜에는 둥근 달이 보였다. 사이의 매일 모양이나 날마다 달을 볼 수 있었는지는 이 두 기록으로 확인할 수 없다.",
        "teacherReview": true,
        "rubric": {
          "required": [
            "제시된 두 실제 관찰 기록에 맞는 결론을 쓴다.",
            "사이의 미기록 날짜/관찰 가능성에 대한 한계를 밝힌다."
          ],
          "pass": "예시와 표현이 달라도 자료·근거·설명의 타당성을 선생님이 확인"
        }
      },
      "explanation": "떨어진 두 날짜의 기록으로 중간 날의 관찰 결과를 만들어 넣지 않습니다. 자료가 뒷받침하는 범위에서 반복을 설명합니다.",
      "evidence": {
        "checkedBy": "독립 창작·자료/조건/응답 계약 검토",
        "date": "2026-10-18",
        "gates": [
          "science",
          "answer"
        ],
        "productGate": false,
        "renderGate": false
      },
      "version": 1
    }
  ]
};
const contract={
  "type": "written-explanation",
  "sample": "두 관찰 날짜에는 둥근 달이 보였다. 사이의 매일 모양이나 날마다 달을 볼 수 있었는지는 이 두 기록으로 확인할 수 없다.",
  "teacherReview": true,
  "rubric": {
    "required": [
      "제시된 두 날짜에 비슷한 둥근 달이 기록되었다고 설명해요.",
      "기록이 없는 사이 날짜의 모양이나 관찰 여부는 알 수 없다고 설명해요."
    ],
    "pass": "예시와 표현이 달라도 자료·근거·설명의 타당성을 선생님이 확인"
  }
};
const patches=[
  {
    "previous": {
      "id": "c22-s42-u01-w017",
      "no": 17,
      "form": "written",
      "topic": "달의 모양·표면·여러 날 관찰",
      "prompt": "두 기록을 보고 알 수 있는 점 한 가지와 알 수 없는 점 한 가지를 써 보세요.",
      "answer": "두 관찰 날짜에는 둥근 달이 보였다. 사이의 매일 모양이나 날마다 달을 볼 수 있었는지는 이 두 기록으로 확인할 수 없다.",
      "explanation": "첫날과 약 한 달 뒤에 둥근 달을 본 기록이 있어요. 두 날짜에 비슷한 모습이 보였다고 말할 수 있어요. 그 사이에는 기록이 없으므로 매일 어떤 모양이었는지, 날마다 볼 수 있었는지는 알 수 없어요.",
      "misconception": "보이는 모습과 천체의 성질, 같은 조건의 비교와 모형의 한계를 구별해요.",
      "criteria": "제시된 두 실제 관찰 기록에 맞는 결론을 쓴다. / 사이의 미기록 날짜/관찰 가능성에 대한 한계를 밝힌다.",
      "lines": 8,
      "sourceId": "c22-s42-u01-b30",
      "sourcePool": "items",
      "sourceRef": {
        "type": "authored-supplement",
        "edition": "2022 개정 범위 보충",
        "note": "원문 짝이 없는 독립 창작 문항. 지문에 제시한 연습용 자료는 학생의 실측 기록이 아니다."
      },
      "sourceGivens": {
        "연습용 자료": "첫 관찰: 둥근 달 / 약 한 달 뒤 두 번째 관찰: 둥근 달 / 그 사이 기록 없음"
      },
      "sourceContract": {
        "type": "written-explanation",
        "sample": "두 관찰 날짜에는 둥근 달이 보였다. 사이의 매일 모양이나 날마다 달을 볼 수 있었는지는 이 두 기록으로 확인할 수 없다.",
        "teacherReview": true,
        "rubric": {
          "required": [
            "제시된 두 실제 관찰 기록에 맞는 결론을 쓴다.",
            "사이의 미기록 날짜/관찰 가능성에 대한 한계를 밝힌다."
          ],
          "pass": "예시와 표현이 달라도 자료·근거·설명의 타당성을 선생님이 확인"
        }
      },
      "sourceExplanation": "자료에는 첫날과 약 한 달 뒤의 둥근 달 두 기록만 있어요. 두 날짜에 비슷한 모습이 기록되었다고 말할 수 있지만 그 사이 매일의 모양·관찰 가능 여부는 모르겠다고 밝혀요. 한 주기 전체를 직접 관찰한 자료로 넓히지 않으면 표현이 달라도 타당해요.",
      "standard": "4과13-01",
      "figure": "given-c22-s42-u01-b30"
    },
    "fields": {
      "criteria": "제시된 두 날짜에 비슷한 둥근 달이 기록되었다고 설명해요. / 기록이 없는 사이 날짜의 모양이나 관찰 여부는 알 수 없다고 설명해요.",
      "sourceContract": {
        "type": "written-explanation",
        "sample": "두 관찰 날짜에는 둥근 달이 보였다. 사이의 매일 모양이나 날마다 달을 볼 수 있었는지는 이 두 기록으로 확인할 수 없다.",
        "teacherReview": true,
        "rubric": {
          "required": [
            "제시된 두 날짜에 비슷한 둥근 달이 기록되었다고 설명해요.",
            "기록이 없는 사이 날짜의 모양이나 관찰 여부는 알 수 없다고 설명해요."
          ],
          "pass": "예시와 표현이 달라도 자료·근거·설명의 타당성을 선생님이 확인"
        }
      }
    }
  },
  {
    "previous": {
      "id": "c22-s42-u01-w055",
      "no": 55,
      "form": "draw",
      "topic": "행성 순서 모형 설계",
      "prompt": "종이 원판과 이름표로 만들 행성 순서 모형을 그리세요. 태양의 자리와 여덟 행성 순서, 실제 비율로 나타내지 않을 부분 두 가지를 표시하세요.",
      "answer": "태양 옆에서 수성·금성·지구·화성·목성·토성·천왕성·해왕성 순으로 이름표를 배치한다. 실제 크기와 간격은 같은 비율로 표현하지 않는다고 설명한다.",
      "explanation": "태양의 자리를 먼저 표시하고 수성 → 금성 → 지구 → 화성 → 목성 → 토성 → 천왕성 → 해왕성 순으로 이름표를 넣어요. 공의 크기와 공 사이 간격은 실제와 다르게 나타낸다고 적어요. 모형을 만든 뒤에는 이름표와 순서를 자료와 다시 비교해요.",
      "misconception": "보이는 모습과 천체의 성질, 같은 조건의 비교와 모형의 한계를 구별해요.",
      "criteria": "태양과 여덟 행성 / 가까운 순서 / 크기/간격 한계 / 안전한 계획",
      "drawing": "large",
      "standard": "4과13-02",
      "drawingExplanationLines": 3
    },
    "fields": {
      "criteria": "태양의 자리와 여덟 행성의 순서 / 실제 크기의 비율을 나타내지 않은 점 / 실제 거리의 비율을 나타내지 않은 점"
    }
  },
  {
    "previous": {
      "id": "c22-s42-u01-w069",
      "no": 69,
      "form": "choice",
      "topic": "북극성 길잡이 읽기",
      "prompt": "길잡이에서 북두칠성의 국자 끝 두 별을 이은 선을 따라가면 어떤 천체를 찾을 수 있나요? 보기의 한글 이름과 그림의 영문 이름표를 함께 살펴보세요.",
      "answer": "④ 북극성(Polaris)",
      "explanation": "북두칠성의 국자 끝 두 별에서 이어지는 붉은 점선을 따라가요. 점선 끝의 별에는 Polaris라는 이름표가 있어요. 보기에서 한글 이름을 함께 찾으면 북극성이므로 넷째 보기를 골라요.",
      "misconception": "보이는 모습과 천체의 성질, 같은 조건의 비교와 모형의 한계를 구별해요.",
      "criteria": "자료의 조건과 근거를 연결한 같은 뜻의 답과 타당한 다른 설계를 인정해요. 문제 풀이와 실제 여러 날 관찰·모형 제작·발표는 구별해요.",
      "standard": "4과13-03",
      "figure": "skyNorthQuestion",
      "choices": [
        "북두칠성(Big Dipper)",
        "작은 국자 모양의 별무리(Little Dipper)",
        "큰곰자리(Ursa Major)",
        "북극성(Polaris)",
        "작은곰자리(Ursa Minor)"
      ],
      "key": 3
    },
    "fields": {
      "prompt": "길잡이에서 북두칠성의 국자 그릇 바깥쪽 두 별을 이은 선을 따라가면 어떤 천체를 찾을 수 있나요? 보기의 한글 이름과 그림의 영문 이름표를 함께 살펴보세요.",
      "explanation": "북두칠성의 국자 그릇 바깥쪽 두 별에서 이어지는 붉은 점선을 따라가요. 점선 끝의 별에는 Polaris라는 이름표가 있어요. 보기에서 한글 이름을 함께 찾으면 북극성이므로 넷째 보기를 골라요.",
      "criteria": "길잡이의 점선이 이어지는 별을 찾아 북극성(Polaris)을 골라요."
    }
  },
  {
    "previous": {
      "id": "c22-s42-u01-w079",
      "no": 79,
      "form": "draw",
      "topic": "북극성 찾기 안내 카드",
      "prompt": "18~19쪽의 NASA 길잡이를 참고해 북극성 찾기 안내 카드를 그리세요. 북두칠성 끝 두 별과 찾는 방향, 북극성 이름, 확인할 하늘 방향을 표시하세요.",
      "answer": "국자 끝 두 별에서 북극성 쪽으로 연결해 이름을 표시한다. 북쪽 방향을 확인하고 길잡이를 실제 장소·시각의 하늘과 대조한다고 밝힌다.",
      "explanation": "북두칠성의 국자 끝 두 별을 표시하고, 두 별을 이은 선을 북극성 쪽으로 이어 그려요. 북극성 이름표와 북쪽 방향도 넣어요. 실제로 관찰할 때에는 장소와 시각에 맞는 길잡이를 준비하고 하늘의 별들과 비교해요.",
      "misconception": "보이는 모습과 천체의 성질, 같은 조건의 비교와 모형의 한계를 구별해요.",
      "criteria": "국자 끝 두 별 / 북극성 쪽 연결 / 이름·북쪽 / 길잡이와 실제 관찰 구별",
      "drawing": "large",
      "standard": "4과13-03",
      "drawingExplanationLines": 3
    },
    "fields": {
      "prompt": "18~19쪽의 NASA 길잡이를 참고해 북극성 찾기 안내 카드를 그리세요. 북두칠성의 국자 그릇 바깥쪽 두 별과 찾는 방향, 북극성 이름, 확인할 하늘 방향을 표시하세요.",
      "answer": "북두칠성의 국자 그릇 바깥쪽 두 별을 표시하고, 두 별을 이은 선을 국자 입구 쪽으로 늘여 북극성에 닿도록 한다. 북극성 이름과 북쪽 방향을 표시한다.",
      "explanation": "북두칠성의 국자 그릇 바깥쪽 두 별을 찾아 표시해요. 두 별을 이은 선을 국자 입구 쪽으로 늘여 북극성까지 이어 그려요. 북극성 이름표와 북쪽 방향도 넣어요. 실제 하늘에서 찾을 때에는 장소와 시각에 맞는 길잡이를 준비하고 하늘의 별들과 비교해요.",
      "criteria": "국자 그릇 바깥쪽 두 별 / 국자 입구 쪽으로 늘여 북극성에 이르는 선 / 북극성 이름과 북쪽 방향"
    }
  },
  {
    "previous": {
      "id": "c22-s42-u01-w080",
      "no": 80,
      "form": "draw",
      "topic": "관찰과 프로그램 비교표",
      "prompt": "실제 하늘에서 북극성을 못 찾았고 프로그램으로 배열을 살폈습니다. 두 자료를 구별할 비교표를 그리세요. 실제 관찰의 상태와 프로그램 설정, 비교할 근거를 표시하세요.",
      "answer": "실제 하늘:관찰일·시각·장소·방향과 못 찾은 상태/가림 등을 표시. 프로그램:이름·날짜·시각·지역·방향 설정과 확인한 배열을 따로 표시. 같은 조건인지와 다음에 확인할 점을 적는다.",
      "explanation": "표를 실제 하늘과 프로그램의 두 칸으로 나누어요. 실제 하늘 칸에는 관찰한 날짜·시각·장소·방향과 북극성을 찾지 못했다는 사실을 적어요. 까닭을 알면 함께 적어요. 프로그램 칸에는 프로그램 이름과 날짜·시각·지역·방향 설정, 확인한 별들의 배열을 적어요. 두 칸의 조건이 같은지 비교하고 다음에 더 관찰할 점을 적어요.",
      "misconception": "보이는 모습과 천체의 성질, 같은 조건의 비교와 모형의 한계를 구별해요.",
      "criteria": "실제 하늘에서 찾지 못한 상태 / 프로그램 표시·설정 / 배열의 비교 근거 / 다음 확인",
      "drawing": "large",
      "standard": "4과13-03",
      "drawingExplanationLines": 3
    },
    "fields": {
      "answer": "실제 하늘: 관찰일·시각·장소·방향과 북극성을 찾지 못한 상태를 표시한다. 프로그램: 이름·날짜·시각·지역·방향 설정과 확인한 배열을 따로 표시한다. 두 자료의 조건과 주변 별들의 배열을 비교할 수 있게 나타낸다.",
      "explanation": "표를 실제 하늘과 프로그램의 두 칸으로 나누어요. 실제 하늘 칸에는 관찰한 날짜·시각·장소·방향과 북극성을 찾지 못했다는 사실을 적어요. 까닭을 알면 함께 적어요. 프로그램 칸에는 프로그램 이름과 날짜·시각·지역·방향 설정, 확인한 별들의 배열을 적어요. 두 자료의 날짜·시각·지역·방향이 맞는지와 주변 별들의 배열을 비교해요.",
      "criteria": "실제 하늘에서 찾지 못한 상태 / 프로그램 자료임을 표시하고 설정 제시 / 두 자료의 조건과 별 배열을 비교할 근거"
    }
  }
];
const directions=[
  {
    "index": 30,
    "previous": {
      "section": "연습 18",
      "title": "같은 조건의 비교",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s42-u01-w018"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "같은 저녁 시각의 자료끼리 모양과 위치를 비교해요."
        },
        {
          "title": "더 알아보기",
          "text": "5~6학년에서 배우는 지구의 자전은 하루 동안 하늘의 위치가 달라 보이는 까닭을 설명해요. 중학교에서는 여기에 달의 공전을 더해 여러 날의 변화를 설명해요."
        },
        {
          "title": "내가 정리할 것",
          "text": "관찰 시각에 따른 변화와 날짜에 따른 변화를 나누어 적어요.",
          "write": 5
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [
      {
        "id": "c22-s42-u01-w018",
        "no": 18,
        "form": "choice",
        "topic": "같은 조건의 비교",
        "prompt": "같은 저녁 시각의 모형 표에서 직접 비교한 결과로 알맞은 것을 고르세요.",
        "answer": "③ 세 날짜 사이에 모양과 보이는 방향이 달라졌다",
        "explanation": "저녁 표에는3일 초승달/서쪽,7일 상현달/남쪽,15일 보름달/동쪽이 있어요. 같은 저녁 조건의 세 날짜 사이에서 모양과 보이는 방향이 달라졌다고 읽어요. 새벽 두 날짜나 오늘 실제 하늘의 위치까지 이 표로 확인한 것은 아니에요.",
        "misconception": "보이는 모습과 천체의 성질, 같은 조건의 비교와 모형의 한계를 구별해요.",
        "criteria": "자료의 조건과 근거를 연결한 같은 뜻의 답과 타당한 다른 설계를 인정해요. 문제 풀이와 실제 여러 날 관찰·모형 제작·발표는 구별해요.",
        "standard": "4과13-01",
        "figure": "skyEvening",
        "choices": [
          "다섯 날짜 모두 같은 저녁 시각에 직접 관찰했다",
          "세 날짜의 달 방향은 같고 이름만 달라졌다",
          "세 날짜 사이에 모양과 보이는 방향이 달라졌다",
          "어느 날짜의 저녁에도 달이 계속 동쪽에 보인다",
          "모형 표만으로 오늘 실제 하늘의 정확한 위치를 안다"
        ],
        "key": 2
      }
    ],
    "fields": [
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "관찰 시각에 따른 변화와 날짜에 따른 변화를 나누어 적어요.",
        "value": "같은 저녁 시각에 날짜가 달라졌을 때 달의 모양과 방향이 어떻게 달라졌는지 표에서 찾아요."
      }
    ]
  },
  {
    "index": 35,
    "previous": {
      "section": "연습 24~25",
      "title": "같은 시각의 비교",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s42-u01-w024",
            "c22-s42-u01-w025"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "서로 비교할 기록은 관찰한 시각과 방향이 드러나게 정리해요."
        },
        {
          "title": "더 알아보기",
          "text": "중학교에서는 지구의 자전과 달의 공전을 함께 살펴요. 하루 동안 달의 위치가 달라 보이는 데에는 지구의 자전이, 여러 날 같은 시각의 변화에는 달의 공전도 관련돼요."
        },
        {
          "title": "내가 정리할 것",
          "text": "비교할 사진의 위쪽과 하늘 방향을 어떻게 확인할지 적어요.",
          "write": 5
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [
      {
        "id": "c22-s42-u01-w024",
        "no": 24,
        "form": "blank",
        "topic": "같은 시각의 비교",
        "prompt": "다음 모형 자료에서 음력 3일·7일·15일은 관찰 ㉠[ ]을 같게 했어요. 음력 22일·26일은 ㉡[ ] 자료로 나누어 비교해요.",
        "answer": "㉠ 시각 · ㉡ 새벽",
        "explanation": "저녁 표의 세 날짜에는 모두 저녁7시쯤이라고 적혀 있어 시각을 같게 한 비교예요.22일·26일은 새벽6시쯤 자료이므로 새벽 조건으로 따로 묶어요. 수업 모형에서 정한 시각을 모든 지역·계절의 일몰 시각과 같은 뜻으로 바꾸지 않아요.",
        "misconception": "보이는 모습과 천체의 성질, 같은 조건의 비교와 모형의 한계를 구별해요.",
        "criteria": "㉠에는 관찰한 시각, ㉡에는 새벽이라는 뜻의 말을 써요.",
        "standard": "4과13-01",
        "given": [
          "수업용 모형 자료",
          "음력 3일·7일·15일: 저녁 7시쯤",
          "음력 22일·26일: 새벽 6시쯤"
        ]
      },
      {
        "id": "c22-s42-u01-w025",
        "no": 25,
        "form": "match",
        "topic": "자료에 맞는 관찰",
        "prompt": "질문과 알맞은 자료를 연결하세요.",
        "answer": "㉠–② · ㉡–③ · ㉢–①",
        "explanation": "작은 지형의 모양은 출처 있는 표면 확대 사진②, 여러 날 변화는 실제 날짜·시각이 있는 기록③을 근거로 살펴요. 못 본 날의 상태는 까닭과 관찰하지 못했다는 표시①로 남겨요. 서로 다른 질문에 필요한 근거를 연결하면㉠–②·㉡–③·㉢–①이에요.",
        "misconception": "보이는 모습과 천체의 성질, 같은 조건의 비교와 모형의 한계를 구별해요.",
        "criteria": "자료의 조건과 근거를 연결한 같은 뜻의 답과 타당한 다른 설계를 인정해요. 문제 풀이와 실제 여러 날 관찰·모형 제작·발표는 구별해요.",
        "parts": [
          "㉠ 달 표면의 작은 지형은 어떤 모양일까?",
          "㉡ 여러 날 같은 시각에 모양은 어떻게 달라질까?",
          "㉢ 실제로 보지 못한 날은 어떻게 남길까?"
        ],
        "answerPerPart": true,
        "standard": "4과13-01",
        "given": [
          "① 못 본 까닭과 관찰하지 못했다는 표시  ② 출처 있는 달 표면 확대 사진  ③ 실제 날짜·시각이 있는 여러 날 기록"
        ]
      }
    ],
    "fields": [
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "비교할 사진의 위쪽과 하늘 방향을 어떻게 확인할지 적어요.",
        "value": "같은 시각끼리 비교해야 하는 까닭을 써요. 달 표면과 여러 날의 모양을 알아볼 자료도 각각 골라요."
      }
    ]
  },
  {
    "index": 42,
    "previous": {
      "section": "연습 33~34",
      "title": "태양계 조사·행성 모형",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s42-u01-w033",
            "c22-s42-u01-w034"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "모형에서 나타내려는 내용과 이름표의 뜻을 함께 살펴요."
        },
        {
          "title": "더 알아보기",
          "text": "중학교에서는 천체의 특징을 여러 자료로 비교해요. 행성의 온도는 태양과의 거리뿐 아니라 대기의 영향도 받으므로 거리만으로 온도 순서를 정할 수 없어요."
        },
        {
          "title": "내가 정리할 것",
          "text": "행성의 특징을 비교할 때 거리 외에 알아볼 내용을 적어요.",
          "write": 5
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [
      {
        "id": "c22-s42-u01-w033",
        "no": 33,
        "form": "short",
        "topic": "태양계 조사·행성 모형",
        "prompt": "이름과 순서를 표현하는 우주 전시 계획에 맞는 설명의 기호를 쓰세요.",
        "answer": "ㄴ",
        "explanation": "이 전시는 태양과 행성의 이름·순서를 소개하려는 것이에요. 이름표와 순서를 맞추고 실제 크기·거리와 다른 점을 밝히자는 ㄴ이 알맞아요. 같은 크기의 공을 썼다고 실제 행성의 크기도 모두 같은 것은 아니에요.",
        "misconception": "보이는 모습과 천체의 성질, 같은 조건의 비교와 모형의 한계를 구별해요.",
        "criteria": "자료의 조건과 근거를 연결한 같은 뜻의 답과 타당한 다른 설계를 인정해요. 문제 풀이와 실제 여러 날 관찰·모형 제작·발표는 구별해요.",
        "sourceId": "c22-s42-u01-v030",
        "sourcePool": "similar",
        "sourceRef": {
          "type": "similar",
          "of": {
            "set": 2,
            "no": 20,
            "originalSet": 2,
            "course": "초등 5-1",
            "sourceGroup": "solar"
          }
        },
        "sourceGivens": {
          "계획": "목적:태양과 여덟 행성의 이름·순서 소개. 크기·거리는 실제 비율이 아님.",
          "의견": "ㄱ. 같은 공이니 실제 행성 크기도 같다고 적자. / ㄴ. 이름·순서를 맞추고 실제 비율이 아닌 점을 밝히자. / ㄷ. 가장 비싼 재료가 아니면 행성 이름도 표현할 수 없어."
        },
        "sourceContract": {
          "type": "short-text",
          "answer": "ㄴ",
          "accepted": [
            "ㄴ"
          ]
        },
        "sourceExplanation": "목적에 맞는 구성원·순서를 나타내고, 실제 비율이 아닌 부분을 밝히면 단순 모형을 사용할 수 있습니다. 장식 재료나 같은 크기 공 자체를 실제 천체의 성질로 바꾸지 않습니다.",
        "standard": "4과13-02",
        "figure": "given-c22-s42-u01-v030",
        "accepted": [
          "ㄴ"
        ]
      },
      {
        "id": "c22-s42-u01-w034",
        "no": 34,
        "form": "short",
        "topic": "태양계 조사·행성 모형",
        "prompt": "아래 목록을 통틀어 부를 수 있는 낱말을 쓰세요.",
        "answer": "천체",
        "explanation": "태양·지구·달·소행성처럼 우주에 있는 물체를 통틀어 천체라고 해요. 따라서 천체를 써요.",
        "misconception": "보이는 모습과 천체의 성질, 같은 조건의 비교와 모형의 한계를 구별해요.",
        "criteria": "자료의 조건과 근거를 연결한 같은 뜻의 답과 타당한 다른 설계를 인정해요. 문제 풀이와 실제 여러 날 관찰·모형 제작·발표는 구별해요.",
        "sourceId": "c22-s42-u01-v034",
        "sourcePool": "similar",
        "sourceRef": {
          "type": "similar",
          "of": {
            "set": 3,
            "no": 4,
            "originalSet": 3,
            "course": "초등 5-1",
            "sourceGroup": "solar"
          }
        },
        "sourceGivens": {
          "목록": "태양, 지구, 달, 소행성처럼 우주에 있는 물체들"
        },
        "sourceContract": {
          "type": "short-text",
          "answer": "천체",
          "accepted": [
            "천체"
          ]
        },
        "sourceExplanation": "별·행성·위성 등 우주 공간의 물체를 천체라고 합니다. 태양계나 하나의 별자리라는 말과 구별합니다.",
        "standard": "4과13-02",
        "figure": "given-c22-s42-u01-v034",
        "accepted": [
          "천체"
        ]
      }
    ],
    "fields": [
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "행성의 특징을 비교할 때 거리 외에 알아볼 내용을 적어요.",
        "value": "행성의 이름·순서를 나타내는 모형으로 알 수 없는 점을 적어요. 여러 우주 물체를 통틀어 부르는 말도 써요."
      }
    ]
  },
  {
    "index": 45,
    "previous": {
      "section": "연습 38",
      "title": "태양계 조사·행성 모형",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s42-u01-w038"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "두 행성을 같은 기준으로 살피고 자료의 출처를 남겨요."
        },
        {
          "title": "더 알아보기",
          "text": "중학교에서는 천체의 크기와 거리를 자료로 비교해요. 행성의 크기와 태양까지의 거리에 같은 축소 비율을 적용하면 작은 종이 안에 모두 나타내기 어려워요."
        },
        {
          "title": "내가 정리할 것",
          "text": "두 행성의 공통점과 차이점을 같은 기준으로 한 가지씩 써요.",
          "write": 5
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [
      {
        "id": "c22-s42-u01-w038",
        "no": 38,
        "form": "written",
        "topic": "태양계 조사·행성 모형",
        "prompt": "두 행성의 겉모습을 비교하려고 해요. 두 행성에서 함께 살펴볼 특징 두 가지와 내용을 알아본 자료를 다시 찾을 수 있게 적는 방법을 써 보세요.",
        "answer": "사진에 보이는 표면이나 구름의 모습, 고리의 유무 등을 비교하고 기관·자료 제목·주소를 적는다.",
        "explanation": "두 행성에서 무늬·구름·고리 등 같은 특징 두 가지를 살펴봐요. 자료에 나오지 않은 특징은 더 알아볼 것으로 남겨요. 자료를 다시 찾을 수 있게 제공 기관, 제목, 주소를 적어요.",
        "misconception": "보이는 모습과 천체의 성질, 같은 조건의 비교와 모형의 한계를 구별해요.",
        "criteria": "표면/구름/고리/겉모습 중 타당한 두 비교 항목을 제안한다. / 확인할 수 있는 자료 출처 기록 방법을 제안한다.",
        "lines": 8,
        "sourceId": "c22-s42-u01-b45",
        "sourcePool": "items",
        "sourceRef": {
          "type": "authored-supplement",
          "edition": "2022 개정 범위 보충",
          "note": "원문 짝이 없는 독립 창작 문항. 지문에 제시한 연습용 자료는 학생의 실측 기록이 아니다."
        },
        "sourceGivens": null,
        "sourceContract": {
          "type": "written-explanation",
          "sample": "사진에 보이는 표면이나 구름의 모습, 고리의 유무 등을 비교하고 기관·자료 제목·주소를 적는다.",
          "teacherReview": true,
          "rubric": {
            "required": [
              "표면/구름/고리/겉모습 중 타당한 두 비교 항목을 제안한다.",
              "확인할 수 있는 자료 출처 기록 방법을 제안한다."
            ],
            "pass": "예시와 표현이 달라도 자료·근거·설명의 타당성을 선생님이 확인"
          }
        },
        "sourceExplanation": "두 행성에서 같은 항목으로 살필 외관 특징을 두 가지 정해요. 예를 들어 구름·무늬·고리를 자료에 있는 범위에서 비교하고 기관·제목·주소로 다시 찾을 수 있게 해요. 실제 물리량을 외우기보다 비교 기준과 확인한 근거를 연결한 다른 타당한 답도 인정할 수 있어요.",
        "standard": "4과13-02"
      }
    ],
    "fields": [
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "두 행성의 공통점과 차이점을 같은 기준으로 한 가지씩 써요.",
        "value": "두 행성에서 함께 살펴볼 특징을 두 가지 적어요. 자료를 다시 찾으려면 어떤 정보를 남겨야 할까요?"
      }
    ]
  },
  {
    "index": 55,
    "previous": {
      "section": "연습 52",
      "title": "조사 카드 읽기",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s42-u01-w052"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "조사 카드의 특징을 근거로 행성을 비교해요."
        },
        {
          "title": "더 알아보기",
          "text": "중학교에서는 천체의 자전과 공전을 구별해요. 행성이 스스로 도는 운동과 태양 둘레를 도는 운동은 서로 다른 운동이므로 모형에서도 따로 나타낼 수 있어요."
        },
        {
          "title": "내가 정리할 것",
          "text": "행성의 움직임을 모형에 더한다면 무엇을 나타낼지 써요.",
          "write": 5
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [
      {
        "id": "c22-s42-u01-w052",
        "no": 52,
        "form": "match",
        "topic": "조사 카드 읽기",
        "prompt": "제공된 카드의 특징과 행성을 연결하세요.",
        "answer": "㉠–③ · ㉡–① · ㉢–②",
        "explanation": "제공된 카드에는 토성의 두드러진 고리, 목성의 띠 무늬, 지구의 바다·구름이 적혀 있어요. 이 카드의 범위에서㉠은③,㉡은①,㉢은②에 연결해요. 다른 행성에 그 특징이 없다는 일반 법칙으로 넓히는 문제는 아니에요.",
        "misconception": "보이는 모습과 천체의 성질, 같은 조건의 비교와 모형의 한계를 구별해요.",
        "criteria": "자료의 조건과 근거를 연결한 같은 뜻의 답과 타당한 다른 설계를 인정해요. 문제 풀이와 실제 여러 날 관찰·모형 제작·발표는 구별해요.",
        "parts": [
          "㉠ 두드러진 고리",
          "㉡ 띠 모양 무늬",
          "㉢ 바다와 구름이 보이는 모습"
        ],
        "answerPerPart": true,
        "standard": "4과13-02",
        "figure": "skyPlanetCards",
        "given": [
          "① 목성  ② 지구  ③ 토성"
        ]
      }
    ],
    "fields": [
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "행성의 움직임을 모형에 더한다면 무엇을 나타낼지 써요.",
        "value": "토성·목성·지구의 조사 카드에서 각각 어떤 특징을 찾았는지 정리해요."
      }
    ]
  },
  {
    "index": 57,
    "previous": {
      "section": "연습 55",
      "title": "행성 순서 모형 설계",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s42-u01-w055"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "태양의 자리와 행성 순서, 실제 비율과 다른 부분을 나타내요."
        },
        {
          "title": "더 알아보기",
          "text": "중학교에서는 태양계의 천체와 공전 운동을 살펴요. 실제 행성의 궤도 크기와 공전하는 데 걸리는 시간은 같지 않아, 모든 행성을 같은 속도로 움직이는 모형에도 한계가 있어요."
        },
        {
          "title": "내가 정리할 것",
          "text": "모형의 크기·간격·움직임 중 어느 것을 나타낼지 정해요.",
          "write": 5
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [
      {
        "id": "c22-s42-u01-w055",
        "no": 55,
        "form": "draw",
        "topic": "행성 순서 모형 설계",
        "prompt": "종이 원판과 이름표로 만들 행성 순서 모형을 그리세요. 태양의 자리와 여덟 행성 순서, 실제 비율로 나타내지 않을 부분 두 가지를 표시하세요.",
        "answer": "태양 옆에서 수성·금성·지구·화성·목성·토성·천왕성·해왕성 순으로 이름표를 배치한다. 실제 크기와 간격은 같은 비율로 표현하지 않는다고 설명한다.",
        "explanation": "태양의 자리를 먼저 표시하고 수성 → 금성 → 지구 → 화성 → 목성 → 토성 → 천왕성 → 해왕성 순으로 이름표를 넣어요. 공의 크기와 공 사이 간격은 실제와 다르게 나타낸다고 적어요. 모형을 만든 뒤에는 이름표와 순서를 자료와 다시 비교해요.",
        "misconception": "보이는 모습과 천체의 성질, 같은 조건의 비교와 모형의 한계를 구별해요.",
        "criteria": "태양과 여덟 행성 / 가까운 순서 / 크기/간격 한계 / 안전한 계획",
        "drawing": "large",
        "standard": "4과13-02",
        "drawingExplanationLines": 3
      }
    ],
    "fields": [
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "모형의 크기·간격·움직임 중 어느 것을 나타낼지 정해요.",
        "value": "행성 순서 모형에 붙일 이름표와 실제 크기·거리의 비율을 나타내지 못한다는 설명을 써요."
      }
    ]
  },
  {
    "index": 59,
    "previous": {
      "section": "연습 57~58",
      "title": "별의 기준·북쪽 별자리",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s42-u01-w057",
            "c22-s42-u01-w058"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "별을 구별하는 기준과 북극성으로 찾을 수 있는 방향을 알아보아요."
        },
        {
          "title": "더 알아보기",
          "text": "중학교에서는 별의 색으로 표면 온도를 비교해요. 별은 색이 모두 같지 않으며, 푸른빛 별은 붉은빛 별보다 일반적으로 표면 온도가 높아요."
        },
        {
          "title": "내가 정리할 것",
          "text": "별의 밝기 이외에 더 알아볼 특징을 적어요.",
          "write": 5
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [
      {
        "id": "c22-s42-u01-w057",
        "no": 57,
        "form": "choice",
        "topic": "별의 기준·북쪽 별자리",
        "prompt": "천체 전시의 두 설명표에 들어갈 말을 고르세요.",
        "choices": [
          "위성 / 태양계",
          "행성 / 위성",
          "별자리 / 별",
          "구름 / 은하",
          "별 / 별자리"
        ],
        "key": 4,
        "answer": "⑤ 별 / 별자리",
        "explanation": "스스로 빛을 내는 천체는 별이에요. 별의 무리를 구분하여 이름을 붙인 것은 별자리예요. 따라서 A는 별, B는 별자리인 다섯째 보기를 골라요.",
        "misconception": "보이는 모습·관찰 조건과 자료의 설명을 함께 살펴요.",
        "criteria": "제시한 자료와 조건의 범위에서 판단해요.",
        "sourceId": "c22-s42-u01-v007",
        "sourcePool": "similar",
        "sourceRef": {
          "type": "similar",
          "of": {
            "set": 1,
            "no": 7,
            "originalSet": 1,
            "course": "초등 5-1",
            "sourceGroup": "solar"
          }
        },
        "sourceGivens": {
          "설명표": "A: 스스로 빛을 내는 천체 / B: A의 무리를 구분하여 이름 붙인 것"
        },
        "sourceContract": {
          "type": "single-choice",
          "answer": 4,
          "accepted": [
            4
          ]
        },
        "sourceExplanation": "스스로 빛을 내는 천체는 별, 별의 무리를 구분해 이름 붙인 것은 별자리입니다. 연결선은 실제 우주의 끈을 뜻하지 않습니다.",
        "standard": "4과13-03",
        "figure": "given-c22-s42-u01-v007"
      },
      {
        "id": "c22-s42-u01-w058",
        "no": 58,
        "form": "short",
        "topic": "별의 기준·북쪽 별자리",
        "prompt": "보호자와 북극성을 확인한 학생이 나침반 없이 알아보려는 주된 방향을 쓰세요.",
        "answer": "북쪽",
        "explanation": "북극성은 우리나라에서 북쪽 하늘에 보여요. 북극성을 찾으면 북쪽 방향을 알아보는 데 도움이 되므로 북쪽을 써요.",
        "misconception": "보이는 모습과 천체의 성질, 같은 조건의 비교와 모형의 한계를 구별해요.",
        "criteria": "자료의 조건과 근거를 연결한 같은 뜻의 답과 타당한 다른 설계를 인정해요. 문제 풀이와 실제 여러 날 관찰·모형 제작·발표는 구별해요.",
        "sourceId": "c22-s42-u01-v048",
        "sourcePool": "similar",
        "sourceRef": {
          "type": "similar",
          "of": {
            "set": 3,
            "no": 18,
            "originalSet": 3,
            "course": "초등 5-1",
            "sourceGroup": "solar"
          }
        },
        "sourceGivens": null,
        "sourceContract": {
          "type": "short-text",
          "answer": "북쪽",
          "accepted": [
            "북쪽",
            "북",
            "북쪽 방향"
          ]
        },
        "sourceExplanation": "북극성은 북쪽 하늘에 있어 북쪽 방향을 찾는 데 이용합니다. 정확한 정북과 영원히 완전히 고정된 점이라는 주장으로 확대하지 않습니다.",
        "standard": "4과13-03",
        "accepted": [
          "북쪽",
          "북",
          "북쪽 방향"
        ]
      }
    ],
    "fields": [
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "별의 밝기 이외에 더 알아볼 특징을 적어요.",
        "value": "별을 구별하는 기준과 북극성으로 찾을 수 있는 방향을 써요."
      }
    ]
  },
  {
    "index": 60,
    "previous": {
      "section": "연습 59~60",
      "title": "별의 기준·북쪽 별자리",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s42-u01-w059",
            "c22-s42-u01-w060"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "별과 북쪽 하늘의 별자리를 특징에 따라 구별해요."
        },
        {
          "title": "더 알아보기",
          "text": "5~6학년에서는 하루 동안 별의 위치가 달라지는 모습을 살펴요. 북극성 가까이 있는 별들도 시간에 따라 그 주변을 도는 것처럼 보여 별자리의 방향이 달라질 수 있어요."
        },
        {
          "title": "내가 정리할 것",
          "text": "같은 별자리라도 관찰 시각을 함께 적어야 하는 까닭을 써요.",
          "write": 5
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [
      {
        "id": "c22-s42-u01-w059",
        "no": 59,
        "form": "choice",
        "topic": "별의 기준·북쪽 별자리",
        "prompt": "스스로 빛을 내는 천체의 종류를 묻는 전시 퀴즈입니다. 답을 고르세요.",
        "choices": [
          "혜성",
          "소행성",
          "행성",
          "별",
          "위성"
        ],
        "key": 3,
        "answer": "④ 별",
        "explanation": "별은 스스로 빛을 내는 천체예요. 따라서 넷째 보기를 골라요. 밝게 보인다는 것만으로 모두 별이라고 하지는 않아요.",
        "misconception": "보이는 모습·관찰 조건과 자료의 설명을 함께 살펴요.",
        "criteria": "제시한 자료와 조건의 범위에서 판단해요.",
        "sourceId": "c22-s42-u01-v023",
        "sourcePool": "similar",
        "sourceRef": {
          "type": "similar",
          "of": {
            "set": 2,
            "no": 13,
            "originalSet": 2,
            "course": "초등 5-1",
            "sourceGroup": "solar"
          }
        },
        "sourceGivens": null,
        "sourceContract": {
          "type": "single-choice",
          "answer": 1,
          "accepted": [
            1
          ]
        },
        "sourceExplanation": "별은 스스로 빛을 내는 천체입니다. 단순히 밝게 보인다는 조건과 스스로 빛을 낸다는 성질을 구별합니다.",
        "standard": "4과13-03"
      },
      {
        "id": "c22-s42-u01-w060",
        "no": 60,
        "form": "short",
        "topic": "별의 기준·북쪽 별자리",
        "prompt": "북쪽 하늘의 두 별무리 설명 A와 B에 맞는 이름을 차례로 쓰세요.",
        "answer": "A-카시오페이아자리, B-북두칠성",
        "explanation": "대표 별들을 이었을 때 W자처럼 보이는 A는 카시오페이아자리예요. 일곱 별이 국자 모양을 이루는 B는 북두칠성이에요. 두 이름을 A, B의 순서대로 써요.",
        "misconception": "보이는 모습과 천체의 성질, 같은 조건의 비교와 모형의 한계를 구별해요.",
        "criteria": "자료의 조건과 근거를 연결한 같은 뜻의 답과 타당한 다른 설계를 인정해요. 문제 풀이와 실제 여러 날 관찰·모형 제작·발표는 구별해요.",
        "sourceId": "c22-s42-u01-v024",
        "sourcePool": "similar",
        "sourceRef": {
          "type": "similar",
          "of": {
            "set": 2,
            "no": 14,
            "originalSet": 2,
            "course": "초등 5-1",
            "sourceGroup": "solar"
          }
        },
        "sourceGivens": {
          "모양 설명": "A:대표 별들을 이으면 W자처럼 보임 / B:일곱 별이 국자 모양을 이룸"
        },
        "sourceContract": {
          "type": "short-text",
          "answer": "A-카시오페이아자리, B-북두칠성",
          "accepted": [
            "A-카시오페이아자리, B-북두칠성",
            "카시오페이아자리, 북두칠성",
            "카시오페이아자리 북두칠성",
            "A-카시오페이아자리 B-북두칠성"
          ]
        },
        "sourceExplanation": "W자 모양으로 찾는 것은 카시오페이아자리, 국자 모양의 일곱 별은 북두칠성입니다. 위치와 실제 배열은 관측 자료와 대조합니다.",
        "standard": "4과13-03",
        "figure": "given-c22-s42-u01-v024",
        "accepted": [
          "A-카시오페이아자리, B-북두칠성",
          "카시오페이아자리, 북두칠성",
          "카시오페이아자리 북두칠성",
          "A-카시오페이아자리 B-북두칠성"
        ]
      }
    ],
    "fields": [
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "같은 별자리라도 관찰 시각을 함께 적어야 하는 까닭을 써요.",
        "value": "스스로 빛을 내는 천체를 무엇이라고 하나요? W 모양과 국자 모양 별무리의 이름도 각각 적어요."
      }
    ]
  },
  {
    "index": 72,
    "previous": {
      "section": "연습 76~77",
      "title": "별과 별자리",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s42-u01-w076",
            "c22-s42-u01-w077"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "천체의 이름과 종류를 연결하고 판단에 필요한 단서를 찾아요."
        },
        {
          "title": "더 알아보기",
          "text": "중학교에서는 별들의 거리도 비교해요. 별자리에서 이웃해 보이는 두 별이 실제 우주에서도 가까운 것은 아니며, 서로 다른 거리에 있는 별들이 한 방향에 모여 보일 수 있어요."
        },
        {
          "title": "내가 정리할 것",
          "text": "별자리 그림에서 보이는 배열과 실제 별 사이의 거리를 구별해요.",
          "write": 5
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [
      {
        "id": "c22-s42-u01-w076",
        "no": 76,
        "form": "match",
        "topic": "별과 별자리",
        "prompt": "이름과 구별을 연결하세요.",
        "answer": "㉠–② · ㉡–③ · ㉢–①",
        "explanation": "북극성은 북쪽 방향을 찾는 별②, 카시오페이아자리는W 배열의 별자리③, 금성은 태양 빛을 받아 보이는 행성①이에요. 이름 하나가 한 개의 별인지, 별자리인지, 행성인지 구별해 연결해요. 따라서㉠–②·㉡–③·㉢–①이에요.",
        "misconception": "보이는 모습과 천체의 성질, 같은 조건의 비교와 모형의 한계를 구별해요.",
        "criteria": "자료의 조건과 근거를 연결한 같은 뜻의 답과 타당한 다른 설계를 인정해요. 문제 풀이와 실제 여러 날 관찰·모형 제작·발표는 구별해요.",
        "parts": [
          "㉠ 북극성",
          "㉡ 카시오페이아자리",
          "㉢ 금성"
        ],
        "answerPerPart": true,
        "standard": "4과13-03",
        "given": [
          "① 태양 빛을 받아 보이는 행성  ② 북쪽 방향을 찾는 데 이용하는 별  ③ W 모양의 배열로 찾는 별자리"
        ]
      },
      {
        "id": "c22-s42-u01-w077",
        "no": 77,
        "form": "match",
        "topic": "확인할 단서",
        "prompt": "생각과 더 확인할 단서를 연결하세요.",
        "answer": "㉠–③ · ㉡–① · ㉢–②",
        "explanation": "밝기만으로 북극성이라 생각한㉠은 북쪽 방향·주변 배열③을 더 확인해요. 프로그램을 실제 하늘과 비교할㉡은 날짜·시각·지역·방향①, 연결선을 막대로 생각한㉢은 배열 표시의 뜻②를 확인해요. 생각에서 빠진 근거를 골라㉠–③·㉡–①·㉢–②로 연결해요.",
        "misconception": "보이는 모습과 천체의 성질, 같은 조건의 비교와 모형의 한계를 구별해요.",
        "criteria": "자료의 조건과 근거를 연결한 같은 뜻의 답과 타당한 다른 설계를 인정해요. 문제 풀이와 실제 여러 날 관찰·모형 제작·발표는 구별해요.",
        "parts": [
          "㉠ 가장 밝은 점을 북극성이라고 생각했다",
          "㉡ 프로그램 별무리를 실제 하늘과 비교하려 한다",
          "㉢ 길잡이의 선을 우주에 있는 막대라고 생각했다"
        ],
        "answerPerPart": true,
        "standard": "4과13-03",
        "given": [
          "① 날짜·시각·지역·바라보는 방향  ② 배열을 알기 쉽게 나타낸 표시인지  ③ 북쪽 방향과 주변 별무리의 배열"
        ]
      }
    ],
    "fields": [
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "별자리 그림에서 보이는 배열과 실제 별 사이의 거리를 구별해요.",
        "value": "북극성·카시오페이아자리·금성을 각각 별·별자리·행성으로 구별해요. 북극성인지 확인할 때 살펴볼 단서도 적어요."
      }
    ]
  },
  {
    "index": 75,
    "previous": {
      "section": "연습 80",
      "title": "관찰과 프로그램 비교표",
      "blocks": [
        {
          "type": "questions",
          "ids": [
            "c22-s42-u01-w080"
          ]
        }
      ],
      "rail": [
        {
          "title": "핵심 정리",
          "text": "실제 관찰 상태와 프로그램에서 조사한 배열·설정을 나누어 비교해요."
        },
        {
          "title": "더 알아보기",
          "text": "중학교에서는 지구의 자전으로 생기는 하루의 겉보기 운동과 공전으로 생기는 계절별 변화를 구별해요. 관측 프로그램에서도 시각과 날짜를 따로 바꾸어 두 변화를 살펴볼 수 있어요."
        },
        {
          "title": "내가 정리할 것",
          "text": "직접 관찰한 칸과 프로그램으로 조사한 칸에 각각 알게 된 내용을 써요.",
          "write": 5
        }
      ],
      "lead": "",
      "kind": "learn"
    },
    "questions": [
      {
        "id": "c22-s42-u01-w080",
        "no": 80,
        "form": "draw",
        "topic": "관찰과 프로그램 비교표",
        "prompt": "실제 하늘에서 북극성을 못 찾았고 프로그램으로 배열을 살폈습니다. 두 자료를 구별할 비교표를 그리세요. 실제 관찰의 상태와 프로그램 설정, 비교할 근거를 표시하세요.",
        "answer": "실제 하늘:관찰일·시각·장소·방향과 못 찾은 상태/가림 등을 표시. 프로그램:이름·날짜·시각·지역·방향 설정과 확인한 배열을 따로 표시. 같은 조건인지와 다음에 확인할 점을 적는다.",
        "explanation": "표를 실제 하늘과 프로그램의 두 칸으로 나누어요. 실제 하늘 칸에는 관찰한 날짜·시각·장소·방향과 북극성을 찾지 못했다는 사실을 적어요. 까닭을 알면 함께 적어요. 프로그램 칸에는 프로그램 이름과 날짜·시각·지역·방향 설정, 확인한 별들의 배열을 적어요. 두 칸의 조건이 같은지 비교하고 다음에 더 관찰할 점을 적어요.",
        "misconception": "보이는 모습과 천체의 성질, 같은 조건의 비교와 모형의 한계를 구별해요.",
        "criteria": "실제 하늘에서 찾지 못한 상태 / 프로그램 표시·설정 / 배열의 비교 근거 / 다음 확인",
        "drawing": "large",
        "standard": "4과13-03",
        "drawingExplanationLines": 3
      }
    ],
    "fields": [
      {
        "path": [
          "rail",
          2,
          "text"
        ],
        "previous": "직접 관찰한 칸과 프로그램으로 조사한 칸에 각각 알게 된 내용을 써요.",
        "value": "실제 하늘에서 북극성을 못 찾았다는 사실과 프로그램에서 확인한 배열을 나누어 적어요. 두 자료에서 맞춰 볼 조건도 써요."
      }
    ]
  }
];
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),clone=x=>JSON.parse(JSON.stringify(x)),cache=new WeakMap();
export function skyResponseItems(rows,unit){
 if(unit!=='c22-s42-u01'||!Array.isArray(rows))return rows;
 let changed=false;const next=rows.map(q=>{
  if(!same(q,prior))return q;changed=true;if(cache.has(q))return cache.get(q);
  const current={...q,answerContract:clone(contract),contentVersion:SKY_RESPONSE_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};cache.set(q,current);return current;
 });return changed?next:rows;
}
export function withSkyResponseWorkbook(workbook){
 if(workbook?.unit!=='c22-s42-u01'||!Array.isArray(workbook.questions)||!Array.isArray(workbook.pages))return workbook;
 let changed=false;
 const replace=page=>{
  const p=directions.find(p=>same(page,p.previous)&&p.questions.every(old=>same(workbook.questions.find(q=>q.id===old.id),old)));
  if(!p)return page;changed=true;const next=clone(page);for(const{path,value}of p.fields){let at=next;for(const key of path.slice(0,-1))at=at[key];at[path.at(-1)]=value;}return next;
 };
 const pages=workbook.pages.map(replace),teacherStudentPages=workbook.teacherStudentPages?.map(replace),questions=workbook.questions.map(q=>{const p=patches.find(p=>same(q,p.previous));if(!p)return q;changed=true;return{...q,...clone(p.fields)};});
 return changed?{...workbook,questions,pages,...(teacherStudentPages?{teacherStudentPages}:{})}:workbook;
}
