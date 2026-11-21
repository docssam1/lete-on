import{materialEarthCurrentItems}from'./material-earth-student-language.js';
// 지구와 바다의 사진·비교 계획·관찰 근거 수업. 실제 기록과 원문은 보존한다.
export const chapter={
 "earthSeaThinking": true,
 "title": "지구와 바다",
 "predictionKey": "earth-sea-thinking-v1",
 "sessionLabels": [
  "지구의 모습·두 물 비교",
  "바닷가·물 높이·갯벌 보전"
 ],
 "startDescriptions": [
  "지구 자료의 범위를 읽고 두 물을 공정하게 비교할 계획을 골라요.",
  "바닷가의 모습과 물 높이 자료로 갯벌의 가치와 보전 행동을 설명해요.",
  "사진에서 본 모습·연습 자료·실제 조사와 홍보를 구별해요."
 ],
 "labRecordTitle": "내 두 물 비교 계획",
 "webBookDescription": "지구·바닷가 사진과 비교 자료를 읽고 근거로 설명해요.",
 "check": [
  "c22-s32-u02-t01",
  "c22-s32-u02-t02",
  "c22-s32-u02-b18",
  "c22-s32-u02-b30",
  "c22-s32-u02-b33",
  "c22-s32-u02-b40",
  "c22-s32-u02-b48",
  "c22-s32-u02-t04",
  "c22-s32-u02-b57",
  "c22-s32-u02-b65",
  "c22-s32-u02-b73",
  "c22-s32-u02-b80"
 ],
 "formative": {
  "items": []
 },
 "earthSeaInteraction": {
  "predict": {
   "q": "두 물이 모두 투명해 보여요. 사진만 보고 녹아 있는 물질도 같다고 할 수 있을까요?",
   "options": [
    "투명하므로 녹아 있는 물질도 반드시 같다",
    "겉모습만으로는 모르므로 같은 조건에서 비교할 자료가 필요하다",
    "한쪽 물만 더 많이 담아 보면 바로 구별할 수 있다"
   ],
   "answer": 1,
   "result": "투명한 겉모습만으로 녹아 있는 물질의 종류와 양을 알 수 없어요. 물의 종류 외 조건을 맞추고 제공된 비교 자료를 살펴요."
  }
 },
 "slideCues": {
  "cover": "한 방향의 지구 사진과 지구 전체의 자료 범위를 구별해요.",
  "phenomenon": "투명해 보인다는 사실과 녹아 있는 물질이 같다는 설명은 달라요.",
  "design": "물의 종류에 따른 차이를 보려면 양과 접시 상태 등은 같게 해요.",
  "lab": "다섯 비교안에서 조건을 먼저 판단한 뒤 근거를 열어요.",
  "results": "제공된 연습 관찰과 실제로 내가 한 실험은 구별해요.",
  "limits": "거의 보이지 않음이 전혀 없다는 뜻인지 다시 살펴요.",
  "conclusion": "처음 판단과 조건, 관찰 근거를 연결해요.",
  "recall": "갯벌 사진 한 장만으로 언제나 물이 없는 땅이라고 정하지 않아요.",
  "tides": "같은 장소와 기준선, 시각의 차례로 물 높이를 읽어요.",
  "missing": "관찰하지 않은 시각의 높이를 마음대로 채우지 않아요.",
  "value": "자료에 보이는 생물과 삶터의 가치를 근거로 연결해요.",
  "share": "친구에게 가치와 행동을 설명하고 받은 질문으로 보완해요.",
  "end": "자료의 범위를 지키며 두 물, 물 높이, 갯벌 보전을 설명했나요?"
 }
};
export const plan={
 "minutes": 80,
 "note": "지구/바닷가 사진과 별도의 가상 계획·관찰 자료를 연결한다. 실제 가열은 교사의 안전한 시범으로만, 현장 방문·홍보는 별도로 이어 간다.",
 "phases": [
  {
   "id": "open",
   "name": "사진과 질문",
   "min": 10,
   "aim": "사진 범위·투명한 두 물에 대한 예상"
  },
  {
   "id": "design",
   "name": "비교 조건",
   "min": 6,
   "aim": "물의 양·접시 상태·물 종류 구별"
  },
  {
   "id": "lab",
   "name": "계획 비교",
   "min": 14,
   "aim": "다섯 안의 판단과 근거 비교"
  },
  {
   "id": "result",
   "name": "관찰과 결론",
   "min": 8,
   "aim": "연습 관찰·수돗물의 일반화 한계"
  },
  {
   "id": "concept",
   "name": "지구와 바닷가",
   "min": 18,
   "aim": "대기·육지/바다·지형·밀물/썰물"
  },
  {
   "id": "extend",
   "name": "갯벌 보전",
   "min": 12,
   "aim": "조사한 가치·행동·설득과 질문"
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
  "id": "c22-s32-u02-t01",
  "status": "authored",
  "prompt": "지구를 둘러싸고 있는 공기를 ( ① )라고 해요.",
  "givens": null,
  "choices": null,
  "responseContract": "cloze",
  "answerContract": {
   "type": "cloze",
   "blanks": [
    {
     "answer": "대기",
     "accepted": [
      "대기"
     ]
    }
   ]
  },
  "explanation": "대기는 육지 위와 바다 위를 모두 둘러싸고 있어요. 눈에 보이지 않아도 바람에 깃발이 움직이는 것으로 알 수 있어요.",
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u02",
   "area": "지구와 우주",
   "element": "E1",
   "type": "T01",
   "standard": "4과06-01",
   "format": "서술형",
   "level": "기본",
   "track": "교과",
   "topic": "지구를 둘러싼 대기",
   "concept": "지구를 둘러싼 대기",
   "inquirySkill": "지구를 둘러싼 대기"
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
  "id": "c22-s32-u02-t02",
  "status": "authored",
  "prompt": "지구 전체 표면에서 ( ① )가 ( ② )보다 더 넓어요.",
  "givens": null,
  "choices": null,
  "responseContract": "cloze",
  "answerContract": {
   "type": "cloze",
   "blanks": [
    {
     "answer": "바다",
     "accepted": [
      "바다"
     ]
    },
    {
     "answer": "육지",
     "accepted": [
      "육지"
     ]
    }
   ]
  },
  "explanation": "지구 표면의 약 70 %가 바다예요. 지구본을 여러 방향에서 돌려 보면 바다가 훨씬 넓어요.",
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u02",
   "area": "지구와 우주",
   "element": "E2",
   "type": "T02",
   "standard": "4과06-01",
   "format": "서술형",
   "level": "기본",
   "track": "교과",
   "topic": "육지와 바다의 특징",
   "concept": "육지와 바다의 특징",
   "inquirySkill": "육지와 바다의 특징"
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
  "id": "c22-s32-u02-b18",
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
   "element": "E2",
   "type": "T03",
   "format": "선택형",
   "level": "기본",
   "track": "교과",
   "standard": "4과06-01"
  },
  "prompt": "가 지역 사진과 나 지구 전체 자료를 읽은 설명으로 알맞은 것은 무엇인가요?",
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
  "choices": [
   "가에서 땅이 많으니 지구도 같다.",
   "지구 전체 비교에는 나를 쓴다.",
   "나의 바다는 육지와 같은 뜻이다.",
   "가와 나는 같은 범위의 자료다.",
   "사진 크기만으로 면적을 정한다."
  ],
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 1,
   "accepted": [
    1
   ]
  },
  "explanation": "지구 전체 비교에는 나를 쓴다.",
  "evidence": {
   "checkedBy": "창작 학습 문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부 성취기준·이론/실험 본문·해양환경 공식 자료",
   "note": "가상 자료는 실제 관찰값이 아니며 원문 문항이나 공식 배점이 아니다."
  }
 },
 {
  "id": "c22-s32-u02-b30",
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
  "prompt": "시료 비교에서 확인한 사실로 쓸 수 있는 문장 두 가지를 고르세요. (정답 2개)",
  "givens": {
   "표": {
    "머리": [
     "같은 양을 담은 시료",
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
  "choices": [
   "수돗물 시료의 남은 물질은 눈에 잘 안 띄었다.",
   "모든 육지의 물에는 녹은 물질이 전혀 없다.",
   "흰색이면 전부 순수한 소금임이 증명됐다.",
   "가열한 바닷물 시료에 흰 물질이 남았다.",
   "표를 읽었으므로 내가 실제로 가열했다."
  ],
  "responseContract": "multi-choice",
  "answerContract": {
   "type": "multi-choice",
   "answers": [
    0,
    3
   ]
  },
  "explanation": "시료와 실제 관찰 범위를 지켜 기록해요. 육지의 물에도 여러 물질이 있을 수 있어요.",
  "evidence": {
   "checkedBy": "창작 학습 문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부 성취기준·이론/실험 본문·해양환경 공식 자료",
   "note": "가상 자료는 실제 관찰값이 아니며 원문 문항이나 공식 배점이 아니다."
  }
 },
 {
  "id": "c22-s32-u02-b33",
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
  "prompt": "두 물의 남는 물질을 비교할 때 다르게 정할 것은 무엇인가요?",
  "givens": null,
  "choices": [
   "처음 넣는 물의 양",
   "접시를 닦은 정도",
   "접시를 놓는 위치만",
   "비교할 물의 종류",
   "기록 날짜를 적는 방법"
  ],
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 3,
   "accepted": [
    3
   ]
  },
  "explanation": "비교할 물의 종류",
  "evidence": {
   "checkedBy": "창작 학습 문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부 성취기준·이론/실험 본문·해양환경 공식 자료",
   "note": "가상 자료는 실제 관찰값이 아니며 원문 문항이나 공식 배점이 아니다."
  }
 },
 {
  "id": "c22-s32-u02-b40",
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
   "format": "서술형",
   "level": "기본",
   "track": "교과",
   "standard": "4과06-02"
  },
  "prompt": "한쪽에는 바닷물을 조금, 다른 쪽에는 수돗물을 훨씬 많이 넣었어요. 남은 물질을 비교하기 전에 어떻게 고치면 좋을까요?",
  "givens": null,
  "choices": null,
  "responseContract": "written-explanation",
  "answerContract": {
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
  "explanation": "예시와 낱말이 달라도 타당한 근거와 설명은 선생님이 확인해요.",
  "evidence": {
   "checkedBy": "창작 학습 문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부 성취기준·이론/실험 본문·해양환경 공식 자료",
   "note": "가상 자료는 실제 관찰값이 아니며 원문 문항이나 공식 배점이 아니다."
  }
 },
 {
  "id": "c22-s32-u02-b48",
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
   "element": "E4",
   "type": "T06",
   "format": "서술형",
   "level": "기본",
   "track": "교과",
   "standard": "4과06-02"
  },
  "prompt": "가와 나 사진 카드가 보여 주는 바닷가의 차이를 보이는 특징으로 비교해 보세요.",
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
  "choices": null,
  "responseContract": "written-explanation",
  "answerContract": {
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
  "explanation": "예시와 낱말이 달라도 타당한 근거와 설명은 선생님이 확인해요.",
  "evidence": {
   "checkedBy": "창작 학습 문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부 성취기준·이론/실험 본문·해양환경 공식 자료",
   "note": "가상 자료는 실제 관찰값이 아니며 원문 문항이나 공식 배점이 아니다."
  }
 },
 {
  "id": "c22-s32-u02-t04",
  "status": "authored",
  "prompt": "바닷물이 바닷가로 밀려 들어와 물 높이가 높아지는 것을 ( ① ), 빠져나가 낮아지는 것을 ( ② )이라고 해요.",
  "givens": null,
  "choices": null,
  "responseContract": "cloze",
  "answerContract": {
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
  "explanation": "밀물과 썰물은 하루에 두 번쯤 되풀이돼요. 한 순간 치는 파도와는 달라요.",
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
  "id": "c22-s32-u02-b57",
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
   "element": "E5",
   "type": "T08",
   "format": "선택형",
   "level": "기본",
   "track": "교과",
   "standard": "4과06-03"
  },
  "prompt": "10시부터 12시까지 표가 나타내는 변화는 무엇인가요?",
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
  "choices": [
   "썰물 동안의 높이 변화",
   "밀물 동안의 높이 변화",
   "지구 전체 바다의 소멸",
   "모든 바닷가의 같은 높이",
   "세 시각 모두 같은 물 높이"
  ],
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 0,
   "accepted": [
    0
   ]
  },
  "explanation": "썰물 동안의 높이 변화",
  "evidence": {
   "checkedBy": "창작 학습 문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부 성취기준·이론/실험 본문·해양환경 공식 자료",
   "note": "가상 자료는 실제 관찰값이 아니며 원문 문항이나 공식 배점이 아니다."
  }
 },
 {
  "id": "c22-s32-u02-b65",
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
   "element": "E6",
   "type": "T09",
   "format": "선택형",
   "level": "기본",
   "track": "교과",
   "standard": "4과06-03"
  },
  "prompt": "제공한 조사 자료에서 찾을 수 있는 갯벌의 가치는 무엇인가요?",
  "givens": {
   "조사 자료": "한 갯벌에서 게와 조개가 사는 모습, 먹이를 찾는 물새를 관찰한 기록이 있어요. 자료 해석용 설명이며 내 현장 방문 기록은 아니에요."
  },
  "choices": [
   "생물이 전혀 살 수 없는 곳",
   "모든 쓰레기를 버려도 되는 곳",
   "언제나 물이 없는 마른 땅",
   "사람이 만든 장식물만 놓는 곳",
   "여러 생물이 살아가는 곳"
  ],
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 4,
   "accepted": [
    4
   ]
  },
  "explanation": "여러 생물이 살아가는 곳",
  "evidence": {
   "checkedBy": "창작 학습 문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부 성취기준·이론/실험 본문·해양환경 공식 자료",
   "note": "가상 자료는 실제 관찰값이 아니며 원문 문항이나 공식 배점이 아니다."
  }
 },
 {
  "id": "c22-s32-u02-b73",
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
   "element": "E6",
   "type": "T10",
   "format": "선택형",
   "level": "기본",
   "track": "교과",
   "standard": "4과06-03"
  },
  "prompt": "갯벌 보전 홍보문에서 근거와 행동을 연결한 것은 무엇인가요?",
  "givens": null,
  "choices": [
   "생물의 삶터이니 쓰레기를 되가져가요.",
   "근거는 몰라도 무조건 최고라고 써요.",
   "정화하니 쓰레기를 모두 버려도 돼요.",
   "멋진 제목만 있으면 근거는 지워요.",
   "생물을 확인하려고 모두 잡아가요."
  ],
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 0,
   "accepted": [
    0
   ]
  },
  "explanation": "생물의 삶터이니 쓰레기를 되가져가요.",
  "evidence": {
   "checkedBy": "창작 학습 문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부 성취기준·이론/실험 본문·해양환경 공식 자료",
   "note": "가상 자료는 실제 관찰값이 아니며 원문 문항이나 공식 배점이 아니다."
  }
 },
 {
  "id": "c22-s32-u02-b80",
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
   "element": "E6",
   "type": "T10",
   "format": "서술형",
   "level": "기본",
   "track": "교과",
   "standard": "4과06-03"
  },
  "prompt": "친구들에게 갯벌 보전을 권하는 짧은 글을 쓰세요. 조사한 가치 한 가지와 그 가치에 맞는 행동을 연결해 보세요.",
  "givens": null,
  "choices": null,
  "responseContract": "written-explanation",
  "answerContract": {
   "type": "written-explanation",
   "sample": "갯벌은 여러 생물의 삶터예요. 생물을 함부로 잡지 않고 쓰레기는 되가져가며 함께 지켜요.",
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
  "explanation": "예시와 낱말이 달라도 타당한 근거와 설명은 선생님이 확인해요.",
  "evidence": {
   "checkedBy": "창작 학습 문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부 성취기준·이론/실험 본문·해양환경 공식 자료",
   "note": "가상 자료는 실제 관찰값이 아니며 원문 문항이나 공식 배점이 아니다."
  }
 }
];
export const lab={
 "kind": "earth-sea-compare",
 "rowsKey": "earthSeaCompareRows",
 "goal": "다섯 계획에서 두 물을 비교할 조건을 먼저 판단하고 근거와 대조한다.",
 "columns": [
  "비교안",
  "내 판단",
  "조건과 판단 근거"
 ]
};

export const checks=materialEarthCurrentItems(originalChecks,'c22-s32-u02');
