import{materialEarthCurrentItems}from'./material-earth-student-language.js';
// 검수한 교재·기존 문항을 연결한 성질 비교 수업. 실제 관찰 기록은 보존한다.
export const chapter={
 "materialThinking": true,
 "predictionKey": "material-thinking-v1",
 "title": "물체와 물질",
 "sessionLabels": [
  "같은 조건에서 성질 비교",
  "세 상태의 근거와 쓰임에 맞춘 설계"
 ],
 "startDescriptions": [
  "모양·크기·방법을 맞추고 네 재료의 성질을 비교해요.",
  "고체·액체·기체의 근거를 읽고 쓰임에 맞는 물체를 설계해요.",
  "예상·모형 자료·실제 관찰을 구별해 근거로 설명해요."
 ],
 "labRecordTitle": "내 재료 성질의 모형 자료 비교",
 "webBookDescription": "사진·관찰 자료·문제로 물질의 성질과 쓰임을 연결해요.",
 "check": [
  "c22-s32-u01-t01",
  "c22-s32-u01-b03",
  "c22-s32-u01-b09",
  "c22-s32-u01-b17",
  "s32-u04-v003",
  "s32-u04-v005",
  "s32-u04-v007",
  "s32-u04-v009",
  "c22-s32-u01-b33",
  "c22-s32-u01-b39",
  "c22-s32-u01-b40",
  "c22-s32-u01-b64"
 ],
 "formative": {
  "items": []
 },
 "materialInteraction": {
  "predict": {
   "q": "모양과 크기가 같고 재료가 다른 네 막대를 같은 방법으로 구부리면 결과도 같을까요?",
   "options": [
    "모양이 같으므로 휘는 정도도 반드시 같다",
    "만든 물질이 달라 휘는 정도가 다를 수 있다",
    "시험 조건과 자료를 더 살펴보고 판단하겠다"
   ],
   "answer": 1,
   "result": "모양과 크기를 맞춰도 만든 물질에 따라 결과가 다를 수 있어요. 이 모형에서 확인한 막대의 결과와 실제 시료의 결과는 구별해요."
  }
 },
 "slideCues": {
  "cover": "생활 물체와 그것을 만드는 물질을 구별해요.",
  "phenomenon": "컵이라는 쓰임은 같아도 어떤 성질이 필요한지는 상황에 따라 달라요.",
  "design": "재료에 따른 차이를 비교하려면 모양과 크기, 시험 방법을 같게 해요.",
  "lab": "네 막대의 결과를 먼저 예상한 뒤 모형 자료를 열어요. 네 가지 다른 시험을 비교해요.",
  "results": "시험마다 같은 네 재료가 어떻게 다른지 읽어요.",
  "limits": "아크릴 막대에서 본 결과를 모든 플라스틱에 적용하지 않아요.",
  "conclusion": "처음 예상과 실제로 제공된 모형 자료를 연결해 설명해요.",
  "recall": "모래의 무더기 모양과 낱알의 모양을 나누어 생각해요.",
  "liquid": "그릇이 바뀌며 달라진 높이와 액체의 부피를 구별해요.",
  "gas": "눈에 안 보여도 공기가 공간을 차지한다는 관찰 근거를 찾아요.",
  "design-object": "필요한 기능을 먼저 정한 다음 재료의 성질을 비교해요.",
  "share": "설계와 실제 제작, 시험을 나누고 받은 질문으로 보완해요.",
  "end": "비교한 시료와 조건을 밝히고 성질로 분류와 설계를 설명했나요?"
 }
};
export const plan={
 "minutes": 80,
 "note": "가상 모형 자료와 실제 시료 관찰을 구별하는 수업. 실제 관찰·제작은 선택 기록에서 이어 간다.",
 "phases": [
  {
   "id": "open",
   "name": "물체와 질문",
   "min": 8,
   "aim": "물체와 물질·같은 쓰임의 다른 재료"
  },
  {
   "id": "design",
   "name": "비교 설계",
   "min": 6,
   "aim": "재료만 다르게·조건 같게"
  },
  {
   "id": "lab",
   "name": "성질 비교",
   "min": 16,
   "aim": "네 시험의 예상과 모형 자료 비교"
  },
  {
   "id": "result",
   "name": "자료와 결론",
   "min": 8,
   "aim": "확인한 시료의 범위에서 설명"
  },
  {
   "id": "concept",
   "name": "분류와 세 상태",
   "min": 18,
   "aim": "재료별 분류·고체/액체/기체의 관찰 근거"
  },
  {
   "id": "extend",
   "name": "설계와 소통",
   "min": 12,
   "aim": "필요한 기능·재료·성질·질문 연결"
  },
  {
   "id": "check",
   "name": "확인",
   "min": 12,
   "aim": "12문항으로 근거 설명 점검"
  }
 ]
};
const originalChecks=[
 {
  "id": "c22-s32-u01-t01",
  "status": "authored",
  "prompt": "컵처럼 모양이 있고 쓰임이 있는 것을 ( ① ), 컵을 만드는 유리·플라스틱 같은 재료를 ( ② )이라고 해요.",
  "givens": null,
  "choices": null,
  "responseContract": "cloze",
  "answerContract": {
   "type": "cloze",
   "blanks": [
    {
     "answer": "물체",
     "accepted": [
      "물체"
     ]
    },
    {
     "answer": "물질",
     "accepted": [
      "물질"
     ]
    }
   ]
  },
  "explanation": "컵·의자·가위는 물체, 그것을 만드는 유리·나무·금속·플라스틱은 물질이에요.",
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u01",
   "area": "물질",
   "element": "E7",
   "type": "T13",
   "standard": "4과05-01",
   "format": "서술형",
   "level": "기본",
   "track": "교과",
   "topic": "물체와 재료의 관계",
   "concept": "물체와 재료의 관계",
   "inquirySkill": "물체와 재료의 관계"
  },
  "sourceRef": {
   "type": "authored-lesson",
   "edition": "2022 개정 사고력 수업",
   "note": "사고력 수업(예상→모형→개념→적용)의 창작 문항. 모형 수치는 모형 값이며 실제 측정·학생 수행 기록이 아님."
  },
  "visualModel": null,
  "variantRules": null,
  "evidence": {
   "checkedBy": "Claude",
   "date": "2026-10-19",
   "gates": [
    "curriculum-2022",
    "science",
    "answer",
    "choice-length"
   ]
  }
 },
 {
  "id": "c22-s32-u01-b03",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "GFIELD 물체와 물질 보충",
   "course": "초등3-2"
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u01",
   "area": "물질",
   "element": "E7",
   "type": "T13",
   "format": "선택형",
   "level": "기본",
   "track": "교과",
   "standard": "4과05-01"
  },
  "prompt": "이 가위의 재료를 조사한 기록으로 알맞은 것은 무엇인가요?",
  "givens": {
   "확인": "제품 설명에 날은 철, 손잡이는 플라스틱이라고 적혀 있어요."
  },
  "choices": [
   "손잡이 색을 보고 재료 전체를 정한다.",
   "물체 하나이므로 재료도 하나라고 적는다.",
   "부분을 나누어 철과 플라스틱을 적는다.",
   "이름이 가위이므로 재료도 가위라고 적는다.",
   "철 부분은 빼고 손잡이 재료만 적는다."
  ],
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 2,
   "accepted": [
    2
   ]
  },
  "explanation": "하나의 물체도 여러 물질로 만들 수 있어요. 실제 부분별 재료를 확인해요.",
  "evidence": {
   "checkedBy": "창작 문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부 성취기준과 검수한 이론·실험 본문",
   "note": "제공 자료의 해석이며 실제 수행 증거가 아니다."
  }
 },
 {
  "id": "c22-s32-u01-b09",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "GFIELD 물체와 물질 보충",
   "course": "초등3-2"
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u01",
   "area": "물질",
   "element": "E7",
   "type": "T14",
   "format": "선택형",
   "level": "기본",
   "track": "교과",
   "standard": "4과05-01"
  },
  "prompt": "관찰 기록에서 뒤에 둔 글씨가 비쳐 보인 시료는 무엇인가요?",
  "givens": {
   "표": {
    "머리": [
     "시료",
     "관찰한 특징"
    ],
    "행": [
     [
      "가 나무 조각",
      "나뭇결이 보임, 속이 보이지 않음"
     ],
     [
      "나 철 조각",
      "속이 보이지 않음, 손으로 쉽게 구부러지지 않음"
     ],
     [
      "다 유리판",
      "글씨가 비쳐 보임, 손으로 쉽게 구부러지지 않음"
     ],
     [
      "라 플라스틱 판",
      "불투명함, 손으로 조금 휘어짐"
     ]
    ]
   },
   "안내": "준비한 네 시료의 관찰 예시예요. 같은 종류의 모든 물질에 그대로 일반화하지 않아요."
  },
  "choices": [
   "네 시료 모두",
   "가 나무 조각",
   "나 철 조각",
   "라 플라스틱 판",
   "다 유리판"
  ],
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 4,
   "accepted": [
    4
   ]
  },
  "explanation": "이 기록에서는 다 유리판이 투명해서 글씨를 볼 수 있어요.",
  "evidence": {
   "checkedBy": "창작 문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부 성취기준과 검수한 이론·실험 본문",
   "note": "제공 자료의 해석이며 실제 수행 증거가 아니다."
  }
 },
 {
  "id": "c22-s32-u01-b17",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "GFIELD 물체와 물질 보충",
   "course": "초등3-2"
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u01",
   "area": "물질",
   "element": "E7",
   "type": "T15",
   "format": "선택형",
   "level": "기본",
   "track": "교과",
   "standard": "4과05-01"
  },
  "prompt": "같은 물질로 만든 물체끼리 모은 것은 무엇인가요?",
  "givens": {
   "표": {
    "머리": [
     "물체 이름표",
     "확인한 재료"
    ],
    "행": [
     [
      "가 컵",
      "유리"
     ],
     [
      "나 숟가락",
      "나무"
     ],
     [
      "다 통",
      "플라스틱"
     ],
     [
      "라 클립",
      "철"
     ],
     [
      "마 구슬",
      "유리"
     ]
    ]
   },
   "조건": "각 물체는 표시된 재료 한 가지로만 만들었다고 확인했어요."
  },
  "choices": [
   "다와 라",
   "가와 나",
   "나와 다",
   "가와 마",
   "라와 마"
  ],
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 3,
   "accepted": [
    3
   ]
  },
  "explanation": "가 컵과 마 구슬은 모두 유리로 만들었어요.",
  "evidence": {
   "checkedBy": "창작 문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부 성취기준과 검수한 이론·실험 본문",
   "note": "제공 자료의 해석이며 실제 수행 증거가 아니다."
  }
 },
 {
  "id": "s32-u04-v003",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 1,
    "no": 3
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u04",
   "area": "물질",
   "element": "E2",
   "type": "T02",
   "format": "선택형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "같은 지우개를 다른 그릇으로 옮긴 기록을 바르게 설명한 것은 무엇인가요?",
  "givens": {
   "기록": [
    "접시·둥근 컵·네모 상자에서 지우개의 길이와 두께가 같았어요.",
    "지우개를 누르거나 자르지 않았어요."
   ]
  },
  "choices": [
   "큰 그릇에 담을수록 지우개 부피가 더 커진다.",
   "그릇을 옮기면 지우개가 공간을 차지하지 않는다.",
   "둥근 컵에 담으면 지우개도 둥글게 바뀐다.",
   "네모 상자에 담아야만 지우개 모양이 유지된다.",
   "담는 그릇이 바뀌어도 지우개 모습은 그대로다."
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
  "explanation": "누르거나 자르지 않고 그릇만 바꾼 조건에서 고체 지우개의 모양과 부피는 그대로예요.",
  "evidence": {
   "checkedBy": "문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ]
  }
 },
 {
  "id": "s32-u04-v005",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 1,
    "no": 5
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u04",
   "area": "물질",
   "element": "E3",
   "type": "T04",
   "format": "단답형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "모형 기록으로 뒷받침할 수 없는 설명을 골라 기호를 쓰세요.",
  "givens": {
   "기록": [
    "우유를 흘리지 않고 좁은 컵과 넓은 그릇으로 옮겼어요.",
    "처음 눈금컵에 다시 넣었더니 처음 표시선과 같았어요."
   ],
   "보기": [
    "ㄱ. 우유의 모양은 그릇에 맞게 달라진다.",
    "ㄴ. 처음 눈금컵에 다시 넣으면 처음 높이와 같다.",
    "ㄷ. 좁은 컵에 넣으면 우유의 부피가 늘어난다."
   ]
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
  "explanation": "높이가 달라 보이는 것과 우유의 양이 달라진 것은 달라요. 다시 같은 컵에 넣어 비교한 기록이 부피 보존의 근거예요.",
  "evidence": {
   "checkedBy": "문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ]
  }
 },
 {
  "id": "s32-u04-v007",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 1,
    "no": 7
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u04",
   "area": "물질",
   "element": "E4",
   "type": "T05",
   "format": "단답형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "마른 깨끗한 스펀지를 물속에서 눌렀어요. 기록에 근거하지 않은 설명을 골라 기호를 쓰세요.",
  "givens": {
   "관찰": [
    "공기 방울이 나와 물 위로 올라갔어요.",
    "수조 물의 색은 처음과 같았어요."
   ],
   "보기": [
    "ㄱ. 스펀지 안에 있던 공기가 물속으로 나왔다.",
    "ㄴ. 나온 공기 방울은 물 위로 올라갔다.",
    "ㄷ. 스펀지에서 흙물이 나와 물색이 달라졌다."
   ]
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
  "explanation": "보지 않은 색 변화는 관찰 사실로 적지 않아요. 공기 방울로 스펀지 안 공기의 존재를 확인해요.",
  "evidence": {
   "checkedBy": "문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ]
  }
 },
 {
  "id": "s32-u04-v009",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 1,
    "no": 9
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u04",
   "area": "물질",
   "element": "E4",
   "type": "T06",
   "format": "단답형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "다음 실험에서 바닥에 구멍이 뚫리지 않은 컵을 골라 기호를 쓰세요.",
  "givens": {
   "지문": "같은 크기의 투명한 플라스틱 컵 ㄱ과 ㄴ을 뒤집어, 물 위에 띄운 스타이로폼 조각을 각각 덮은 뒤 수조 바닥까지 밀어 넣었습니다. 두 컵 중 하나는 바닥에 구멍이 뚫려 있습니다.\n• ㄱ: 스타이로폼 조각이 처음과 같은 높이의 물 위에 그대로 떠 있었습니다.\n• ㄴ: 스타이로폼 조각이 컵과 함께 수조 바닥 쪽으로 내려갔습니다.",
   "조건": "같은 크기의 컵을 얕은 수조에서 기울이지 않고 천천히 내려요. 구멍은 막히지 않았어요."
  },
  "choices": null,
  "visualModel": null,
  "variantRules": null,
  "responseContract": "short-text",
  "answerContract": {
   "type": "short-text",
   "answer": "ㄴ",
   "accepted": [
    "ㄴ",
    "ㄴ 컵"
   ]
  },
  "explanation": "구멍이 없는 컵은 안의 공기가 빠져나가지 못하고 공간을 차지해서 물과 스타이로폼 조각을 아래로 밀어 내려요.",
  "evidence": {
   "checkedBy": "문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ]
  }
 },
 {
  "id": "c22-s32-u01-b33",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "GFIELD 물체와 물질 보충",
   "course": "초등3-2"
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u01",
   "area": "물질",
   "element": "E8",
   "type": "T17",
   "format": "선택형",
   "level": "기본",
   "track": "교과",
   "standard": "4과05-03"
  },
  "prompt": "안이 보이고 쉽게 깨지지 않는 창을 만들 때 두 조건에 맞는 후보는 무엇인가요?",
  "givens": {
   "표": {
    "머리": [
     "후보 재료",
     "제공된 시료의 특징"
    ],
    "행": [
     [
      "가",
      "투명함, 깨질 수 있음"
     ],
     [
      "나",
      "불투명함, 쉽게 깨지지 않음"
     ],
     [
      "다",
      "투명함, 쉽게 깨지지 않음"
     ]
    ]
   },
   "조건": "관찰 상자의 창으로 안쪽 모습을 보고 싶어요. 세 시료만 비교한 설계 자료예요."
  },
  "choices": [
   "가",
   "다",
   "나",
   "가와 나 모두",
   "세 후보 모두"
  ],
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 1,
   "accepted": [
    1
   ]
  },
  "explanation": "다 시료가 투명함과 쉽게 깨지지 않음 두 조건을 함께 만족해요.",
  "evidence": {
   "checkedBy": "창작 문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부 성취기준과 검수한 이론·실험 본문",
   "note": "제공 자료의 해석이며 실제 수행 증거가 아니다."
  }
 },
 {
  "id": "c22-s32-u01-b39",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "GFIELD 물체와 물질 보충",
   "course": "초등3-2"
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u01",
   "area": "물질",
   "element": "E8",
   "type": "T17",
   "format": "단답형",
   "level": "기본",
   "track": "교과",
   "standard": "4과05-03"
  },
  "prompt": "후보 표에서 투명하고 쉽게 깨지지 않는 시료의 기호를 쓰세요.",
  "givens": {
   "표": {
    "머리": [
     "후보 재료",
     "제공된 시료의 특징"
    ],
    "행": [
     [
      "가",
      "투명함, 깨질 수 있음"
     ],
     [
      "나",
      "불투명함, 쉽게 깨지지 않음"
     ],
     [
      "다",
      "투명함, 쉽게 깨지지 않음"
     ]
    ]
   },
   "조건": "관찰 상자의 창으로 안쪽 모습을 보고 싶어요. 세 시료만 비교한 설계 자료예요."
  },
  "choices": null,
  "responseContract": "short-text",
  "answerContract": {
   "type": "short-text",
   "answer": "다",
   "accepted": [
    "다",
    "ㄷ"
   ]
  },
  "explanation": "표의 두 조건을 함께 확인해 다를 고를 수 있어요.",
  "evidence": {
   "checkedBy": "창작 문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부 성취기준과 검수한 이론·실험 본문",
   "note": "제공 자료의 해석이며 실제 수행 증거가 아니다."
  }
 },
 {
  "id": "c22-s32-u01-b40",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "GFIELD 물체와 물질 보충",
   "course": "초등3-2"
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u01",
   "area": "물질",
   "element": "E8",
   "type": "T17",
   "format": "서술형",
   "level": "기본",
   "track": "교과",
   "standard": "4과05-03"
  },
  "prompt": "관찰 통의 창 재료를 다로 고른 까닭을 쓰세요.",
  "givens": {
   "표": {
    "머리": [
     "후보 재료",
     "제공된 시료의 특징"
    ],
    "행": [
     [
      "가",
      "투명함, 깨질 수 있음"
     ],
     [
      "나",
      "불투명함, 쉽게 깨지지 않음"
     ],
     [
      "다",
      "투명함, 쉽게 깨지지 않음"
     ]
    ]
   },
   "조건": "관찰 상자의 창으로 안쪽 모습을 보고 싶어요. 세 시료만 비교한 설계 자료예요."
  },
  "choices": null,
  "responseContract": "written-explanation",
  "answerContract": {
   "type": "written-explanation",
   "sample": "다 시료는 투명해서 안이 보이고 쉽게 깨지지 않아서예요.",
   "rubric": {
    "required": [
     "제시한 두 성질을 설계의 쓰임에 연결함"
    ],
    "criteria": [
     "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
    ],
    "pass": "타당한 설명과 근거를 선생님과 확인한다."
   }
  },
  "explanation": "해당 자료의 두 조건을 근거로 설명하는 열린 표현은 선생님과 확인해요.",
  "evidence": {
   "checkedBy": "창작 문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부 성취기준과 검수한 이론·실험 본문",
   "note": "제공 자료의 해석이며 실제 수행 증거가 아니다."
  }
 },
 {
  "id": "c22-s32-u01-b64",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "GFIELD 물체와 물질 보충",
   "course": "초등3-2"
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u01",
   "area": "물질",
   "element": "E8",
   "type": "T20",
   "format": "서술형",
   "level": "기본",
   "track": "교과",
   "standard": "4과05-03"
  },
  "prompt": "친구가 창이 불투명해서 안이 안 보인다고 말했어요. 실제로 들은 이 의견을 다음 설명과 수정 기록에 어떻게 반영할까요?",
  "givens": null,
  "choices": null,
  "responseContract": "written-explanation",
  "answerContract": {
   "type": "written-explanation",
   "sample": "받은 질문을 기록하고 안이 비치는 다른 창 재료를 비교해 고친 까닭을 설명해요.",
   "rubric": {
    "required": [
     "실제 의견을 설계 점검·수정 이유와 연결함"
    ],
    "criteria": [
     "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
    ],
    "pass": "타당한 설명과 근거를 선생님과 확인한다."
   }
  },
  "explanation": "여러 타당한 수정이 가능해요. 실제 의견과 앞으로 할 확인을 나누어 적어요.",
  "evidence": {
   "checkedBy": "창작 문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부 성취기준과 검수한 이론·실험 본문",
   "note": "제공 자료의 해석이며 실제 수행 증거가 아니다."
  }
 }
];
export const lab={
 "kind": "material-compare",
 "rowsKey": "materialCompareRows",
 "goal": "네 재료의 결과를 예상하고 네 가지 시험의 모형 자료와 비교한다.",
 "columns": [
  "시험",
  "내 예상",
  "제공된 모형 자료"
 ]
};

export const checks=materialEarthCurrentItems(originalChecks,'c22-s32-u01');
