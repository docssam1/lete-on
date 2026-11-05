import{ecologySoundCurrentItems}from'../../v2/ecology-sound-question-language.js?v=20261105-ecology-sound-bank';
import{items as canonicalItems}from'../units/c22-s32-u03.think.js';
// 소리의 세기·높낮이·전달과 실천 수업. 기존 문항 계약·실제 기록은 보존한다.
export const chapter={
 "soundThinking": true,
 "classroomBattle": false,
 "title": "소리의 성질",
 "predictionKey": "sound-thinking-v1",
 "sessionLabels": [
  "떨림·두 성질 비교",
  "전달·상황에 맞는 소음 줄이기"
 ],
 "startDescriptions": [
  "소리가 나는 물체의 떨림을 여러 감각으로 살펴요.",
  "조건을 하나씩 바꾸며 세기와 높낮이를 구별해요.",
  "전달 경로와 실제 상황을 근거로 소음 줄이기 방법을 제안해요."
 ],
 "labRecordTitle": "내 소리 모형 비교",
 "webBookDescription": "사진·모형 소리·자료를 비교하고 관찰 근거로 설명해요.",
 "check": [
  "c22-s32-u03-t01",
  "c22-s32-u03-b08",
  "c22-s32-u03-t03",
  "c22-s32-u03-b18",
  "c22-s32-u03-b28",
  "c22-s32-u03-b29",
  "c22-s32-u03-b36",
  "c22-s32-u03-b38",
  "c22-s32-u03-b46",
  "c22-s32-u03-b48",
  "c22-s32-u03-b52",
  "c22-s32-u03-b56"
 ],
 "formative": {
  "items": []
 },
 "soundInteraction": {
  "predict": {
   "q": "자를 길게 내밀면 소리가 더 커질까요?",
   "options": [
    "길어지면 반드시 더 큰 소리가 난다",
    "길이에 따른 높낮이와 튕기는 정도에 따른 세기를 나누어 비교해야 한다",
    "높은 소리와 큰 소리는 같은 뜻이다"
   ],
   "answer": 1,
   "result": "길이만 바꾼 비교와 튕기는 정도만 바꾼 비교를 나누어요. 소리의 높고 낮음과 크고 작음은 다른 성질이에요."
  }
 },
 "slideCues": {
  "cover": "정지 사진에서 보이는 준비 모습과 실제 움직임 관찰을 구별해요.",
  "vibration": "눈·귀·내 목의 촉감에서 확인할 근거를 비교해요.",
  "predict": "처음 예상은 채점하지 않고 뒤의 조건 비교와 연결해요.",
  "design": "길이와 튕기는 정도를 동시에 바꾸면 어떤 원인을 구별하기 어려울까요?",
  "lab": "듣기는 선택이에요. 낮은 기기 음량을 유지하고 설명 자료도 비교해요.",
  "results": "같게 둔 설정과 실제로 들린 느낌을 구별해 설명해요.",
  "limits": "모형의 정해진 소리를 실제 자의 측정값으로 옮기지 않아요.",
  "conclusion": "내 처음 예상과 바꾼 조건·두 성질의 차이를 연결해요.",
  "recall": "소리를 전하는 물질을 관찰 경로로 찾아요.",
  "string": "실을 잡은 때와 놓은 때, 같은 목소리·거리를 맞춰요.",
  "missing": "관찰하지 못한 칸을 소리 없음으로 채우지 않아요.",
  "noise": "누가 언제 무엇을 할 때 불편한지 먼저 물어요.",
  "practice": "계획·실천·확인한 효과를 구별하고 실제 의견으로 보완해요.",
  "end": "떨림·두 성질·전달 경로·실천의 근거를 연결했나요?"
 }
};
export const plan={
 "minutes": 80,
 "note": "기존 자 모형과 같은 주파수·세기 설정의 짧은 소리를 선택 재생한다. 실제 자의 관찰·실천 기록과 모형 자료 비교를 구별한다.",
 "phases": [
  {
   "id": "open",
   "name": "떨림과 예상",
   "min": 10,
   "aim": "사진·여러 감각의 근거와 처음 예상"
  },
  {
   "id": "design",
   "name": "조건 나누기",
   "min": 6,
   "aim": "길이·튕기는 정도를 하나씩 바꾸는 계획"
  },
  {
   "id": "lab",
   "name": "소리 비교",
   "min": 14,
   "aim": "세 가지 조건에서 모형 듣기 또는 설명 자료 비교"
  },
  {
   "id": "result",
   "name": "성질과 근거",
   "min": 10,
   "aim": "세기·높낮이·모형의 한계 설명"
  },
  {
   "id": "concept",
   "name": "전달 경로",
   "min": 12,
   "aim": "고체·액체·기체와 관찰 조건"
  },
  {
   "id": "extend",
   "name": "소음 줄이기",
   "min": 16,
   "aim": "상황·실천·전후 변화와 실제 의견"
  },
  {
   "id": "check",
   "name": "확인",
   "min": 12,
   "aim": "세 기준의12문항으로 설명 점검"
  }
 ]
};
const originalChecks=[
 {
  "id": "c22-s32-u03-t01",
  "status": "authored",
  "prompt": "내 목에 손을 살짝 대고 작은 목소리로 말할 때 느끼는 움직임은 ( ① )이에요.",
  "givens": null,
  "choices": null,
  "responseContract": "cloze",
  "answerContract": {
   "type": "cloze",
   "blanks": [
    {
     "answer": "떨림",
     "accepted": [
      "떨림"
     ]
    }
   ]
  },
  "explanation": "내 목에 손을 살짝 대고 작게 말하며 떨림을 살펴요. 친구의 목을 누르거나 아픈 느낌을 참고 계속하지 않아요.",
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u03",
   "area": "운동과 에너지",
   "element": "E1",
   "type": "T01",
   "standard": "4과07-01",
   "format": "서술형",
   "level": "기본",
   "track": "교과",
   "topic": "소리가 나는 물체의 떨림",
   "concept": "소리가 나는 물체의 떨림",
   "inquirySkill": "소리가 나는 물체의 떨림"
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
  "id": "c22-s32-u03-b08",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "GFIELD 소리의 성질 보충",
   "course": "초등3-2"
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u03",
   "area": "운동과 에너지",
   "element": "E7",
   "type": "T14",
   "topic": "떨림의 관찰과 근거",
   "concept": "소리가 나는 물체의 떨림을 관찰하고 움직임·촉감 등 근거와 설명을 연결한다.",
   "inquirySkill": "관찰·근거 설명",
   "format": "서술형",
   "level": "기본",
   "track": "교과",
   "standard": "4과07-01"
  },
  "prompt": "북을 친 때와 치지 않은 때를 비교한 가상 자료를 근거로 소리와 떨림의 관계를 설명해 보세요.",
  "givens": {
   "표": {
    "머리": [
     "조건",
     "관찰"
    ],
    "행": [
     [
      "가볍게 친 때",
      "소리 남·위의 종잇조각이 움직임"
     ],
     [
      "치지 않은 때",
      "소리와 종잇조각 움직임을 관찰하지 못함"
     ]
    ]
   },
   "안내": "문제 해석을 위한 가상 관찰 자료이며 직접 관찰한 결과가 아니에요."
  },
  "choices": null,
  "responseContract": "written-explanation",
  "answerContract": {
   "type": "written-explanation",
   "sample": "북을 친 때에는 종잇조각이 움직이며 소리가 났고 치지 않은 때에는 움직임이 관찰되지 않았어요. 이 비교에서 소리가 날 때 북 가죽의 떨림을 살폈어요.",
   "rubric": {
    "required": [
     "두 조건의 관찰 차이를 근거로 씀",
     "소리가 나는 물체의 떨림과 연결함"
    ],
    "criteria": [
     "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
    ],
    "pass": "여러 타당한 표현과 근거를 선생님과 확인한다."
   }
  },
  "explanation": "가볍게 친 때의 소리와 종잇조각 움직임을 치지 않은 때와 비교하여 떨림을 근거로 설명해요. 관찰하지 못했다는 기록을 모든 물체가 전혀 떨리지 않는다는 뜻으로 확대하지 않아요.",
  "evidence": {
   "checkedBy": "창작 문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부 성취기준과 확인한 이론·실험 본문",
   "note": "가상 자료의 해석·학습 응답이며 실제 학생 수행 증거가 아니다."
  }
 },
 {
  "id": "c22-s32-u03-t03",
  "status": "authored",
  "prompt": "같은 세기로 튕길 때 자를 짧게 내밀면 ( ① ) 소리, 길게 내밀면 ( ② ) 소리가 나요.",
  "givens": null,
  "choices": null,
  "responseContract": "cloze",
  "answerContract": {
   "type": "cloze",
   "blanks": [
    {
     "answer": "높은",
     "accepted": [
      "높은"
     ]
    },
    {
     "answer": "낮은",
     "accepted": [
      "낮은"
     ]
    }
   ]
  },
  "explanation": "떨리는 부분이 짧으면 빨리 떨려 높은 소리, 길면 천천히 떨려 낮은 소리가 나요.",
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u03",
   "area": "운동과 에너지",
   "element": "E3",
   "type": "T05",
   "standard": "4과07-02",
   "format": "서술형",
   "level": "기본",
   "track": "교과",
   "topic": "길이와 소리의 높낮이",
   "concept": "길이와 소리의 높낮이",
   "inquirySkill": "길이와 소리의 높낮이"
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
  "id": "c22-s32-u03-b18",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "GFIELD 소리의 성질 보충",
   "course": "초등3-2"
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u03",
   "area": "운동과 에너지",
   "element": "E7",
   "type": "T16",
   "topic": "같은 조건의 세기 비교",
   "concept": "같은 물체·듣는 위치에서 두드리는 정도를 바꾸어 소리의 크고 작음을 비교한다.",
   "inquirySkill": "같은 조건 비교",
   "format": "선택형",
   "level": "기본",
   "track": "교과",
   "standard": "4과07-02"
  },
  "prompt": "가상 관찰 표에서 세기가 더 큰 조건은 무엇인가요?",
  "givens": {
   "표": {
    "머리": [
     "조건",
     "관찰"
    ],
    "행": [
     [
      "가·약하게 침",
      "작은 소리·종잇조각 조금 움직임"
     ],
     [
      "나·조금 더 세게 침",
      "더 큰 소리·종잇조각 더 움직임"
     ]
    ]
   },
   "안내": "문제 해석을 위한 가상 관찰 자료이며 직접 관찰한 결과가 아니에요."
  },
  "choices": [
   "두 조건 모두 소리가 나지 않았다.",
   "같은 북을 약하게 친 가",
   "표만으로 북의 재료가 바뀌었다.",
   "같은 북을 조금 더 세게 친 나",
   "두 조건이 반드시 완전히 같다."
  ],
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 3,
   "accepted": [
    3
   ]
  },
  "explanation": "같은 북·듣는 위치에서 나는 소리가 더 컸다고 제시했어요. 종잇조각의 움직임도 세기 비교의 근거로 함께 살펴요.",
  "evidence": {
   "checkedBy": "창작 문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부 성취기준과 확인한 이론·실험 본문",
   "note": "가상 자료의 해석·학습 응답이며 실제 학생 수행 증거가 아니다."
  }
 },
 {
  "id": "c22-s32-u03-b28",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "GFIELD 소리의 성질 보충",
   "course": "초등3-2"
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u03",
   "area": "운동과 에너지",
   "element": "E7",
   "type": "T17",
   "topic": "길이에 따른 높낮이 비교",
   "concept": "같은 재료·굵기·고정·소리 내는 방법에서 길이와 높낮이를 비교한다.",
   "inquirySkill": "길이·높낮이 비교",
   "format": "선택형",
   "level": "기본",
   "track": "교과",
   "standard": "4과07-02"
  },
  "prompt": "자료의 두 자를 보고 길이만의 효과라고 정하기 어려운 까닭은 무엇인가요?",
  "givens": {
   "자료": "가: 얇은 플라스틱 자, 밖 길이 8 cm / 나: 두꺼운 나무 자, 밖 길이 12 cm. 학습용 가상 조건이에요."
  },
  "choices": [
   "자의 재료와 두께도 다르다.",
   "관찰한 순서를 적었다.",
   "책상 밖 길이를 기록했다.",
   "각 자에 이름표를 붙였다.",
   "같은 날짜에 비교했다."
  ],
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 0,
   "accepted": [
    0
   ]
  },
  "explanation": "재료·두께와 길이가 함께 다르면 길이만의 영향으로 보기 어려워요. 같은 자에서 책상 밖 길이를 바꾸는 비교로 다시 살펴요.",
  "evidence": {
   "checkedBy": "창작 문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부 성취기준과 확인한 이론·실험 본문",
   "note": "가상 자료의 해석·학습 응답이며 실제 학생 수행 증거가 아니다."
  }
 },
 {
  "id": "c22-s32-u03-b29",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "GFIELD 소리의 성질 보충",
   "course": "초등3-2"
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u03",
   "area": "운동과 에너지",
   "element": "E7",
   "type": "T17",
   "topic": "길이에 따른 높낮이 비교",
   "concept": "같은 재료·굵기·고정·소리 내는 방법에서 길이와 높낮이를 비교한다.",
   "inquirySkill": "길이·높낮이 비교",
   "format": "선택형",
   "level": "기본",
   "track": "교과",
   "standard": "4과07-02"
  },
  "prompt": "같은 자에서 밖으로 나온 길이가 짧을 때 높은 소리가 났습니다. 타당한 결론은 무엇인가요?",
  "givens": null,
  "choices": [
   "소리의 높낮이는 듣는 날짜로 정해진다.",
   "긴 자는 재료와 관계없이 소리가 없다.",
   "이 비교 조건에서 짧을 때 더 높았다.",
   "모든 물체는 짧으면 반드시 더 크다.",
   "길이를 줄이면 소리는 언제나 없어진다."
  ],
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 2,
   "accepted": [
    2
   ]
  },
  "explanation": "확인한 자와 조건의 범위에서 길이·높낮이를 연결해요. 세기나 모든 종류의 물체에 대한 법칙으로 확대하지 않아요.",
  "evidence": {
   "checkedBy": "창작 문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부 성취기준과 확인한 이론·실험 본문",
   "note": "가상 자료의 해석·학습 응답이며 실제 학생 수행 증거가 아니다."
  }
 },
 {
  "id": "c22-s32-u03-b36",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "GFIELD 소리의 성질 보충",
   "course": "초등3-2"
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u03",
   "area": "운동과 에너지",
   "element": "E7",
   "type": "T18",
   "topic": "세기와 높낮이의 구별",
   "concept": "크고 작은 정도인 세기와 높고 낮은 정도인 높낮이를 구별한다.",
   "inquirySkill": "성질 구별·자료 해석",
   "format": "선택형",
   "level": "기본",
   "track": "교과",
   "standard": "4과07-02"
  },
  "prompt": "가상 효과음 표에서 높낮이는 같고 세기만 다른 두 소리는 무엇인가요?",
  "givens": {
   "표": {
    "머리": [
     "소리",
     "높낮이",
     "세기"
    ],
    "행": [
     [
      "가",
      "높음",
      "작음"
     ],
     [
      "나",
      "높음",
      "큼"
     ],
     [
      "다",
      "낮음",
      "작음"
     ]
    ]
   },
   "안내": "문제 해석을 위한 가상 관찰 자료이며 직접 관찰한 결과가 아니에요."
  },
  "choices": [
   "비교할 수 있는 두 소리가 없음",
   "가와 나",
   "세 소리 모두",
   "가와 다",
   "나와 다"
  ],
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 1,
   "accepted": [
    1
   ]
  },
  "explanation": "가와 나는 모두 높은 음이지만 크기가 작음·큼으로 달라요. 다는 낮은 음이라 높낮이도 달라요.",
  "evidence": {
   "checkedBy": "창작 문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부 성취기준과 확인한 이론·실험 본문",
   "note": "가상 자료의 해석·학습 응답이며 실제 학생 수행 증거가 아니다."
  }
 },
 {
  "id": "c22-s32-u03-b38",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "GFIELD 소리의 성질 보충",
   "course": "초등3-2"
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u03",
   "area": "운동과 에너지",
   "element": "E7",
   "type": "T18",
   "topic": "세기와 높낮이의 구별",
   "concept": "크고 작은 정도인 세기와 높고 낮은 정도인 높낮이를 구별한다.",
   "inquirySkill": "성질 구별·자료 해석",
   "format": "선택형",
   "level": "기본",
   "track": "교과",
   "standard": "4과07-02"
  },
  "prompt": "세기와 높낮이를 바르게 구별한 설명을 고르세요. (정답 2개)",
  "givens": null,
  "choices": [
   "큰 소리가 나면 소리 높이는 없어져 버린다.",
   "작은 소리는 모두 낮은 소리라는 뜻이다.",
   "낮은 음과 높은 음의 차이는 높낮이다.",
   "작게 말하다 크게 말한 차이는 세기다.",
   "높은 소리는 모두 큰 소리라는 뜻이다."
  ],
  "responseContract": "multi-choice",
  "answerContract": {
   "type": "multi-choice",
   "answers": [
    2,
    3
   ]
  },
  "explanation": "크고 작은 정도와 높고 낮은 정도를 나누어 설명해요. 높은 음도 작은 크기로 낼 수 있어요.",
  "evidence": {
   "checkedBy": "창작 문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부 성취기준과 확인한 이론·실험 본문",
   "note": "가상 자료의 해석·학습 응답이며 실제 학생 수행 증거가 아니다."
  }
 },
 {
  "id": "c22-s32-u03-b46",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "GFIELD 소리의 성질 보충",
   "course": "초등3-2"
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u03",
   "area": "운동과 에너지",
   "element": "E8",
   "type": "T19",
   "topic": "물질을 통한 전달 관찰",
   "concept": "공기·물·고체 등 여러 물질을 통한 전달 현상을 경로와 관찰 조건으로 설명한다.",
   "inquirySkill": "전달 경로 관찰",
   "format": "선택형",
   "level": "기본",
   "track": "교과",
   "standard": "4과07-03"
  },
  "prompt": "여러 물질을 통한 전달을 살피는 타당한 설명을 고르세요. (정답 2개)",
  "givens": null,
  "choices": [
   "공기 이외의 물질은 소리를 못 전한다.",
   "공기·물·나무 등으로 전해질 수 있다.",
   "비교한 경로와 관찰 결과를 함께 적는다.",
   "자료를 본 것만으로 직접 실험한 셈이다.",
   "잘 들린 물질은 언제나 더 높은 음이다."
  ],
  "responseContract": "multi-choice",
  "answerContract": {
   "type": "multi-choice",
   "answers": [
    1,
    2
   ]
  },
  "explanation": "여러 물질이 소리를 전할 수 있음을 실제 조건·근거로 살펴요. 자료 문제를 맞힌 것을 직접 수행으로 바꾸어 세지 않아요.",
  "evidence": {
   "checkedBy": "창작 문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부 성취기준과 확인한 이론·실험 본문",
   "note": "가상 자료의 해석·학습 응답이며 실제 학생 수행 증거가 아니다."
  }
 },
 {
  "id": "c22-s32-u03-b48",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "GFIELD 소리의 성질 보충",
   "course": "초등3-2"
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u03",
   "area": "운동과 에너지",
   "element": "E8",
   "type": "T19",
   "topic": "물질을 통한 전달 관찰",
   "concept": "공기·물·고체 등 여러 물질을 통한 전달 현상을 경로와 관찰 조건으로 설명한다.",
   "inquirySkill": "전달 경로 관찰",
   "format": "서술형",
   "level": "기본",
   "track": "교과",
   "standard": "4과07-03"
  },
  "prompt": "실을 잡은 경우와 놓은 경우의 가상 자료에서 말할 수 있는 점과 더 확인할 조건을 설명해 보세요.",
  "givens": {
   "표": {
    "머리": [
     "조건",
     "관찰 기록"
    ],
    "행": [
     [
      "실을 놓음",
      "말이 더 또렷하게 들림"
     ],
     [
      "실을 손으로 잡음",
      "말이 덜 또렷하게 들림"
     ]
    ]
   },
   "안내": "문제 해석을 위한 가상 관찰 자료이며 직접 관찰한 결과가 아니에요."
  },
  "choices": null,
  "responseContract": "written-explanation",
  "answerContract": {
   "type": "written-explanation",
   "sample": "이 자료에서는 같은 전화기의 실을 놓았을 때 말이 더 또렷하게 들렸어요. 목소리 크기·듣는 위치·실의 팽팽함이 같았는지 확인하고 실제로 해 보지 않았다면 자료 관찰이라고 밝혀요.",
   "rubric": {
    "required": [
     "제시 자료의 차이를 근거로 설명함",
     "비교 조건·자료의 한계를 짚음"
    ],
    "criteria": [
     "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
    ],
    "pass": "여러 타당한 표현과 근거를 선생님과 확인한다."
   }
  },
  "explanation": "가상 표는 실을 놓은 때와 잡은 때의 또렷함 차이를 보여 줘요. 목소리·실의 팽팽함·듣는 위치도 같았는지 확인해야 실을 잡는 효과로 설명할 수 있어요.",
  "evidence": {
   "checkedBy": "창작 문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부 성취기준과 확인한 이론·실험 본문",
   "note": "가상 자료의 해석·학습 응답이며 실제 학생 수행 증거가 아니다."
  }
 },
 {
  "id": "c22-s32-u03-b52",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "GFIELD 소리의 성질 보충",
   "course": "초등3-2"
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u03",
   "area": "운동과 에너지",
   "element": "E8",
   "type": "T20",
   "topic": "상황에 맞는 소음 줄이기",
   "concept": "듣는 사람·시간·장소·활동을 고려하여 소음을 줄일 행동과 전후 비교를 계획한다.",
   "inquirySkill": "상황 판단·실천 계획",
   "format": "선택형",
   "level": "기본",
   "track": "교과",
   "standard": "4과07-03"
  },
  "prompt": "안전을 알리는 신호음에 대해 타당한 태도는 무엇인가요?",
  "givens": null,
  "choices": [
   "위험 알림도 음악으로 덮어 듣지 않는다.",
   "잘 들리지 않으면 귀 가까이서 시험한다.",
   "모든 소리가 나지 않도록 장치를 없앤다.",
   "높은 알림음은 언제나 나쁘다고 없앤다.",
   "필요한 알림과 방해되는 소음을 구별한다."
  ],
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 4,
   "accepted": [
    4
   ]
  },
  "explanation": "소리는 안전을 알리거나 소통하는 데 필요해요. 필요한 기능을 유지하며 상황에 맞게 불편을 줄일 방법을 생각해요.",
  "evidence": {
   "checkedBy": "창작 문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부 성취기준과 확인한 이론·실험 본문",
   "note": "가상 자료의 해석·학습 응답이며 실제 학생 수행 증거가 아니다."
  }
 },
 {
  "id": "c22-s32-u03-b56",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "GFIELD 소리의 성질 보충",
   "course": "초등3-2"
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u03",
   "area": "운동과 에너지",
   "element": "E8",
   "type": "T20",
   "topic": "상황에 맞는 소음 줄이기",
   "concept": "듣는 사람·시간·장소·활동을 고려하여 소음을 줄일 행동과 전후 비교를 계획한다.",
   "inquirySkill": "상황 판단·실천 계획",
   "format": "서술형",
   "level": "기본",
   "track": "교과",
   "standard": "4과07-03"
  },
  "prompt": "친구가 독서 중 의자 끄는 소리가 불편하다고 말했습니다. 소음을 줄일 행동과 효과를 확인할 방법을 제안해 보세요.",
  "givens": null,
  "choices": null,
  "responseContract": "written-explanation",
  "answerContract": {
   "type": "written-explanation",
   "sample": "의자를 안전하게 들어 옮기거나 알맞은 다리 덮개를 써요. 비슷한 독서 시간에 실천 전후의 소리와 친구가 실제로 느낀 점을 확인해요.",
   "rubric": {
    "required": [
     "상황에 맞는 타당한 실천",
     "효과·실제 의견을 확인할 방법"
    ],
    "criteria": [
     "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
    ],
    "pass": "여러 타당한 표현과 근거를 선생님과 확인한다."
   }
  },
  "explanation": "친구가 독서하는 상황에 맞게 의자 끄는 소리를 줄일 방법을 제안해요. 비슷한 조건에서 전후 소리와 실제 의견을 확인하되 계획만으로 효과를 확정하지 않아요.",
  "evidence": {
   "checkedBy": "창작 문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부 성취기준과 확인한 이론·실험 본문",
   "note": "가상 자료의 해석·학습 응답이며 실제 학생 수행 증거가 아니다."
  }
 }
];
export const lab={
 "kind": "sound-compare",
 "rowsKey": "soundCompareRows",
 "goal": "세 가지 조건에서 먼저 예상하고 모형 소리·설명 자료로 세기와 높낮이를 나누어 설명한다.",
 "columns": [
  "비교 조건",
  "내 예상",
  "자료와 연결한 설명"
 ]
};

const currentCheck=ecologySoundCurrentItems(canonicalItems,'c22-s32-u03').find(q=>q.id==='c22-s32-u03-t01');
if(!currentCheck)throw Error('검토한 수업 문항이 없습니다: c22-s32-u03-t01');
export const checks=originalChecks.map(q=>q.id===currentCheck.id?currentCheck:q);
