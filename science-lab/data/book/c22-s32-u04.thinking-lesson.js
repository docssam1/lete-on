// 사례·감염 과정 모형·공유와 실천. 기존 은행 계약과 실제 기록은 보존한다.
export const chapter={
 "infectionThinking": true,
 "classroomBattle": false,
 "title": "감염병과 건강한 생활",
 "predictionKey": "infection-thinking-v1",
 "sessionLabels": [
  "사례·두 규칙의 모형 비교",
  "여러 경로·공유와 실천"
 ],
 "startDescriptions": [
  "생활 속 감염병의 사례와 어려움·도움을 토의해요.",
  "두 규칙을 차례별로 비교하고 모형과 실제 감염을 구별해요.",
  "여러 감염 과정에 맞는 수칙을 공유·실천하고 실제 의견으로 고쳐요."
 ],
 "labRecordTitle": "내 감염 과정 모형 비교",
 "webBookDescription": "사진·차례별 표식 자료를 읽고 생활 습관과 예방 행동을 연결해요.",
 "check": [
  "c22-s32-u04-b01",
  "c22-s32-u04-b04",
  "c22-s32-u04-b08",
  "c22-s32-u04-b10",
  "c22-s32-u04-b21",
  "c22-s32-u04-b43",
  "c22-s32-u04-b48",
  "c22-s32-u04-b32",
  "c22-s32-u04-b49",
  "c22-s32-u04-b64",
  "c22-s32-u04-b67",
  "c22-s32-u04-b80"
 ],
 "formative": {
  "items": []
 },
 "infectionInteraction": {
  "predict": {
   "q": "일부 카드의 표식을 차례마다 빼면, 매 차례 두 규칙의 카드 수가 달라질까요?",
   "options": [
    "매 차례 반드시 더 적어진다",
    "같은 차례도 있을 수 있어 짝과 차례별 자료를 비교해야 한다",
    "표식을 빼는 규칙은 언제나 아무 영향이 없다"
   ],
   "answer": 1,
   "result": "처음 차례에는 두 규칙의 카드 수가 같고, 뒤 차례에는 달라져요. 차례별 자료와 전달 경로를 함께 설명해요."
  }
 },
 "slideCues": {
  "cover": "손 표식 장면은 설명 자료이며 실제 병원체 사진이 아니에요.",
  "cases": "개인의 병명 대신 가상 생활 사례로 어려움과 도움을 토의해요.",
  "evidence": "본 사실과 진단·누가 옮겼는지에 대한 판단을 나누어요.",
  "predict": "처음 예상은 채점하지 않고 각 차례 자료와 비교해요.",
  "design": "처음 표식과 짝·차례를 같게 두고 표식을 빼는 규칙만 바꿔요.",
  "lab": "먼저 예상한 뒤 같은 차례의 두 규칙 자료를 열어요.",
  "results": "같은 결과인 차례와 다른 결과인 차례를 모두 설명해요.",
  "limits": "카드 수를 환자 수나 실제 제거율로 바꾸어 적지 않아요.",
  "conclusion": "처음 예상과 차례별 카드 이름을 근거로 설명해요.",
  "recall": "접촉한 사실만으로 감염 여부를 정하지 않아요.",
  "routes": "여러 경로와 생활 습관을 연결하되 상세 면역은 다루지 않아요.",
  "wash": "사진의 거품과 실제 시간·부위 확인은 달라요.",
  "air": "기침 예절과 환기가 줄이는 연결을 구별해요.",
  "source": "기관·날짜뿐 아니라 내용과 설명 근거도 읽어요.",
  "counts": "집계의 변화로 개인의 원인이나 행동 하나의 효과를 정하지 않아요.",
  "practice": "실제로 수행할 기회와 필요한 도움을 마련해요.",
  "share": "실제로 받은 질문에 맞게 안내를 고쳐요.",
  "care": "사람을 탓하는 말 대신 함께 지킬 행동과 도움을 제안해요.",
  "end": "생활 사례·여러 감염 과정·예방 수칙 공유와 실천을 연결했나요?"
 }
};
export const plan={
 "minutes": 80,
 "note": "교재와 같은 여섯 카드의 표식 규칙을 차례별로 비교한다. 실제 활동·건강 상태 기록과 구별한다.",
 "phases": [
  {
   "id": "open",
   "name": "사례와 예상",
   "min": 10,
   "aim": "감염병의 생활 영향·근거와 처음 예상"
  },
  {
   "id": "design",
   "name": "조건 맞추기",
   "min": 6,
   "aim": "시작 표식·짝·차례를 같게 두기"
  },
  {
   "id": "lab",
   "name": "모형 비교",
   "min": 16,
   "aim": "세 차례에서 두 규칙의 자료 비교"
  },
  {
   "id": "result",
   "name": "근거와 한계",
   "min": 8,
   "aim": "카드 이름·수와 실제 감염 구별"
  },
  {
   "id": "concept",
   "name": "여러 경로",
   "min": 12,
   "aim": "다섯 감염 과정과 생활 습관 연결"
  },
  {
   "id": "extend",
   "name": "공유와 실천",
   "min": 16,
   "aim": "자료·실천·실제 질문으로 수칙 보완"
  },
  {
   "id": "check",
   "name": "확인",
   "min": 12,
   "aim": "세 기준의12문항으로 설명 점검"
  }
 ]
};
export const checks=[
 {
  "id": "c22-s32-u04-b01",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "GFIELD 감염병과 건강한 생활 창작 학습",
   "course": "초등3-2"
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u04",
   "area": "생명",
   "topic": "감염병의 사례",
   "concept": "질병과 생활의 영향",
   "inquirySkill": "사례 분류",
   "element": "E1",
   "type": "T01",
   "format": "선택형",
   "level": "기본",
   "track": "교과",
   "standard": "4과08-01"
  },
  "prompt": "병원체의 감염으로 생기는 질병을 묶어 부르는 말은 무엇인가요?",
  "givens": null,
  "choices": [
   "감염병",
   "근육통",
   "찰과상",
   "충치 치료",
   "팔의 골절"
  ],
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 0,
   "accepted": [
    0
   ]
  },
  "explanation": "감염병은 병원체의 감염으로 생기는 질병이다. 감염병마다 전파 방법이 다르므로 모든 만남에서 반드시 옮는다는 뜻은 아니다.",
  "evidence": {
   "checkedBy": "창작 학습 문항 검수",
   "date": "2026-10-18",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부4과08-01~03·질병관리청 현재 예방 안내·자체 교재의 확인 범위",
   "note": "가상 자료는 실제 관찰값이 아니며 원문 문항이나 공식 배점이 아니다."
  }
 },
 {
  "id": "c22-s32-u04-b04",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "GFIELD 감염병과 건강한 생활 창작 학습",
   "course": "초등3-2"
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u04",
   "area": "생명",
   "topic": "감염병의 사례",
   "concept": "질병과 생활의 영향",
   "inquirySkill": "사례 분류",
   "element": "E1",
   "type": "T01",
   "format": "선택형",
   "level": "기본",
   "track": "교과",
   "standard": "4과08-01"
  },
  "prompt": "기침하는 친구를 본 뒤 할 수 있는 타당한 판단은 무엇인가요?",
  "givens": null,
  "choices": [
   "기침하면 모두 같은 감염병에 걸렸다.",
   "기침을 한 횟수가 곧 감염자 수이다.",
   "열이 없으면 어떤 병도 옮기지 않는다.",
   "증상만으로 병명을 정할 수 없다.",
   "친구의 얼굴색으로 병원체를 구별한다."
  ],
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 3,
   "accepted": [
    3
   ]
  },
  "explanation": "기침에는 여러 원인이 있다. 증상만으로 병명을 진단하지 말고 불편하면 어른에게 알려 도움을 받는다.",
  "evidence": {
   "checkedBy": "창작 학습 문항 검수",
   "date": "2026-10-18",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부4과08-01~03·질병관리청 현재 예방 안내·자체 교재의 확인 범위",
   "note": "가상 자료는 실제 관찰값이 아니며 원문 문항이나 공식 배점이 아니다."
  }
 },
 {
  "id": "c22-s32-u04-b08",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "GFIELD 감염병과 건강한 생활 창작 학습",
   "course": "초등3-2"
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u04",
   "area": "생명",
   "topic": "감염병의 사례",
   "concept": "질병과 생활의 영향",
   "inquirySkill": "사례 분류",
   "element": "E1",
   "type": "T01",
   "format": "서술형",
   "level": "기본",
   "track": "교과",
   "standard": "4과08-01"
  },
  "prompt": "감염병이 유행하면 배움이나 가족의 생활에 어떤 어려움이 생길 수 있는지 한 가지와 그 이유를 쓰세요.",
  "givens": null,
  "choices": null,
  "responseContract": "written-explanation",
  "answerContract": {
   "type": "written-explanation",
   "sample": "아파서 쉬면 수업에 참여하기 어려울 수 있다. 보호자가 돌봄 시간을 마련해야 할 수도 있다.",
   "rubric": {
    "required": [
     "생활의 어려움 한 가지",
     "어려움과 연결되는 이유"
    ],
    "criteria": [
     "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
    ],
    "pass": "자료와 근거를 연결한 타당한 설명을 선생님과 확인한다."
   }
  },
  "explanation": "예시처럼 건강 문제와 일상 변화의 관계를 설명한다. 모든 가족에게 똑같이 일어난다고 단정하거나 아픈 사람을 탓하지 않는 타당한 설명을 함께 확인한다.",
  "evidence": {
   "checkedBy": "창작 학습 문항 검수",
   "date": "2026-10-18",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부4과08-01~03·질병관리청 현재 예방 안내·자체 교재의 확인 범위",
   "note": "가상 자료는 실제 관찰값이 아니며 원문 문항이나 공식 배점이 아니다."
  }
 },
 {
  "id": "c22-s32-u04-b10",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "GFIELD 감염병과 건강한 생활 창작 학습",
   "course": "초등3-2"
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u04",
   "area": "생명",
   "topic": "위험성에 대한 토의",
   "concept": "근거와 배려",
   "inquirySkill": "근거를 바탕으로 토의",
   "element": "E1",
   "type": "T02",
   "format": "선택형",
   "level": "기본",
   "track": "교과",
   "standard": "4과08-01"
  },
  "prompt": "자료 A와 B 중 감염병 예방을 알아볼 때 먼저 살필 자료는 무엇인가요?",
  "givens": {
   "자료": "A: 보건 기관의 예방 안내, 작성 기관·수정 날짜 표시. B: 출처 없이 전달된 예방 비법 글."
  },
  "choices": [
   "조회 수가 더 많은 B",
   "사진이 더 화려한 B",
   "익명 댓글이 많은 B",
   "출처와 날짜를 밝힌 A",
   "제목이 더 자극적인 B"
  ],
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 3,
   "accepted": [
    3
   ]
  },
  "explanation": "출처와 날짜가 명시된 공공기관 자료 A는 근거를 확인할 수 있다. 유명하거나 자극적이라는 이유만으로 정확하다고 판단하지 않는다.",
  "evidence": {
   "checkedBy": "창작 학습 문항 검수",
   "date": "2026-10-18",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부4과08-01~03·질병관리청 현재 예방 안내·자체 교재의 확인 범위",
   "note": "가상 자료는 실제 관찰값이 아니며 원문 문항이나 공식 배점이 아니다."
  }
 },
 {
  "id": "c22-s32-u04-b21",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "GFIELD 감염병과 건강한 생활 창작 학습",
   "course": "초등3-2"
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u04",
   "area": "생명",
   "topic": "손과 물건을 통한 접촉",
   "concept": "접촉과 생활 습관",
   "inquirySkill": "감염 과정 연결",
   "element": "E2",
   "type": "T03",
   "format": "선택형",
   "level": "기본",
   "track": "교과",
   "standard": "4과08-02"
  },
  "prompt": "접촉 경로만 알아본 활동 뒤 내릴 수 있는 결론은 무엇인가요?",
  "givens": null,
  "choices": [
   "모든 감염병의 경로가 접촉뿐임을 증명했다.",
   "모든 물건이 반드시 병을 옮긴다고 확인했다.",
   "표식이 없던 사람은 어떤 병에도 안 걸린다.",
   "손과 물건을 통한 과정을 설명할 수 있다.",
   "손 씻기 한 번으로 모든 경로를 막을 수 있다."
  ],
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 3,
   "accepted": [
    3
   ]
  },
  "explanation": "한 경로를 나타낸 활동은 그 경로를 이해하는 자료다. 실제 감염병에는 다른 경로나 여러 경로가 관련될 수 있으므로 모든 감염병으로 확대하지 않는다.",
  "evidence": {
   "checkedBy": "창작 학습 문항 검수",
   "date": "2026-10-18",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부4과08-01~03·질병관리청 현재 예방 안내·자체 교재의 확인 범위",
   "note": "가상 자료는 실제 관찰값이 아니며 원문 문항이나 공식 배점이 아니다."
  }
 },
 {
  "id": "c22-s32-u04-b43",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "GFIELD 감염병과 건강한 생활 창작 학습",
   "course": "초등3-2"
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u04",
   "area": "생명",
   "topic": "안전한 감염 과정 모형",
   "concept": "모형의 의미와 한계",
   "inquirySkill": "조건 통제와 자료 해석",
   "element": "E3",
   "type": "T06",
   "format": "선택형",
   "level": "기본",
   "track": "교과",
   "standard": "4과08-02"
  },
  "prompt": "표식 옮김 규칙의 효과를 비교하려면 무엇을 맞추어야 하나요?",
  "givens": null,
  "choices": [
   "한쪽의 시작 표식 수만 더 늘린다.",
   "다른 쪽의 카드 수만 두 배로 한다.",
   "시작 표식 수와 카드 수를 맞춘다.",
   "실행 시간과 옮김 횟수를 모두 바꾼다.",
   "결과를 먼저 정한 뒤 표식을 붙인다."
  ],
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 2,
   "accepted": [
    2
   ]
  },
  "explanation": "한 조건의 차이를 알아보려면 시작 표식 수와 카드 수, 그 밖의 조건을 같게 한다. 여러 조건을 함께 바꾸면 차이의 원인을 구별하기 어렵다.",
  "evidence": {
   "checkedBy": "창작 학습 문항 검수",
   "date": "2026-10-18",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부4과08-01~03·질병관리청 현재 예방 안내·자체 교재의 확인 범위",
   "note": "가상 자료는 실제 관찰값이 아니며 원문 문항이나 공식 배점이 아니다."
  }
 },
 {
  "id": "c22-s32-u04-b48",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "GFIELD 감염병과 건강한 생활 창작 학습",
   "course": "초등3-2"
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u04",
   "area": "생명",
   "topic": "안전한 감염 과정 모형",
   "concept": "모형의 의미와 한계",
   "inquirySkill": "조건 통제와 자료 해석",
   "element": "E3",
   "type": "T06",
   "format": "서술형",
   "level": "기본",
   "track": "교과",
   "standard": "4과08-02"
  },
  "prompt": "카드 전파 모형에서 표식이 붙은 카드가 줄었습니다. 이 결과로 말할 수 있는 점 한 가지와 말할 수 없는 점 한 가지를 쓰세요.",
  "givens": null,
  "choices": null,
  "responseContract": "written-explanation",
  "answerContract": {
   "type": "written-explanation",
   "sample": "이 규칙에서 표식이 옮겨진 카드 수가 줄었다고 말할 수 있다. 실제 감염자가 몇 명 줄어들지는 이 활동만으로 알 수 없다.",
   "rubric": {
    "required": [
     "모형에서 직접 확인한 변화",
     "실제 감염으로 확대할 수 없는 한계"
    ],
    "criteria": [
     "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
    ],
    "pass": "자료와 근거를 연결한 타당한 설명을 선생님과 확인한다."
   }
  },
  "explanation": "모형 안의 관찰과 실제 세계에 대한 추정을 구별했는지 확인한다. 모형 결과를 실제 건강 상태나 정확한 유행 예측으로 주장하지 않는다.",
  "evidence": {
   "checkedBy": "창작 학습 문항 검수",
   "date": "2026-10-18",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부4과08-01~03·질병관리청 현재 예방 안내·자체 교재의 확인 범위",
   "note": "가상 자료는 실제 관찰값이 아니며 원문 문항이나 공식 배점이 아니다."
  }
 },
 {
  "id": "c22-s32-u04-b32",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "GFIELD 감염병과 건강한 생활 창작 학습",
   "course": "초등3-2"
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u04",
   "area": "생명",
   "topic": "기침과 실내 공기",
   "concept": "비말·공기와 예방",
   "inquirySkill": "조건에 따른 설명",
   "element": "E2",
   "type": "T04",
   "format": "서술형",
   "level": "기본",
   "track": "교과",
   "standard": "4과08-02"
  },
  "prompt": "교실에서 기침 예절과 환기를 함께 실천하는 이유를 두 행동의 역할과 연결하여 설명하세요.",
  "givens": null,
  "choices": null,
  "responseContract": "written-explanation",
  "answerContract": {
   "type": "written-explanation",
   "sample": "기침 예절은 침방울이 퍼지는 것을 줄이고 환기는 실내 공기를 바꾼다. 서로 다른 행동을 함께 실천하면 전파 위험을 줄이는 데 도움이 된다.",
   "rubric": {
    "required": [
     "기침 예절의 역할",
     "환기의 역할",
     "여러 수칙을 함께 실천하는 이유"
    ],
    "criteria": [
     "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
    ],
    "pass": "자료와 근거를 연결한 타당한 설명을 선생님과 확인한다."
   }
  },
  "explanation": "두 행동의 역할을 구별하고 위험 감소와 연결했는지 확인한다. 두 행동을 해도 감염 위험이 항상 0이라고 단정하지 않는다.",
  "evidence": {
   "checkedBy": "창작 학습 문항 검수",
   "date": "2026-10-18",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부4과08-01~03·질병관리청 현재 예방 안내·자체 교재의 확인 범위",
   "note": "가상 자료는 실제 관찰값이 아니며 원문 문항이나 공식 배점이 아니다."
  }
 },
 {
  "id": "c22-s32-u04-b49",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "GFIELD 감염병과 건강한 생활 창작 학습",
   "course": "초등3-2"
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u04",
   "area": "생명",
   "topic": "손 씻기 실천",
   "concept": "비누·흐르는 물과 손 씻기",
   "inquirySkill": "방법과 실제 수행 구별",
   "element": "E4",
   "type": "T07",
   "format": "선택형",
   "level": "기본",
   "track": "교과",
   "standard": "4과08-03"
  },
  "prompt": "손 씻기 방법으로 알맞은 것은 무엇인가요?",
  "givens": null,
  "choices": [
   "손끝만 잠깐 물에 대고 끝낸다.",
   "물에 적신 뒤 손바닥만 닦는다.",
   "비누와 흐르는 물로 30초 이상",
   "소매에 손을 문지르면 충분하다.",
   "물 색이 맑으면 손을 씻지 않는다."
  ],
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 2,
   "accepted": [
    2
   ]
  },
  "explanation": "질병관리청 안내에 따라 비누와 흐르는 물로 30초 이상 꼼꼼히 씻는다. 손끝을 잠깐 적시는 것과 구별한다.",
  "evidence": {
   "checkedBy": "창작 학습 문항 검수",
   "date": "2026-10-18",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부4과08-01~03·질병관리청 현재 예방 안내·자체 교재의 확인 범위",
   "note": "가상 자료는 실제 관찰값이 아니며 원문 문항이나 공식 배점이 아니다."
  }
 },
 {
  "id": "c22-s32-u04-b64",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "GFIELD 감염병과 건강한 생활 창작 학습",
   "course": "초등3-2"
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u04",
   "area": "생명",
   "topic": "함께 지키는 예방 수칙",
   "concept": "기침 예절·환기·개인 물품",
   "inquirySkill": "행동과 이유 연결",
   "element": "E4",
   "type": "T08",
   "format": "서술형",
   "level": "기본",
   "track": "교과",
   "standard": "4과08-03"
  },
  "prompt": "우리 교실에서 함께 지킬 수칙 두 가지를 정하고, 각각 언제 또는 어떤 상황에 실천할지 쓰세요.",
  "givens": null,
  "choices": null,
  "responseContract": "written-explanation",
  "answerContract": {
   "type": "written-explanation",
   "sample": "식사 전에는 각자 비누와 흐르는 물로 손을 씻는다. 기침할 때는 휴지나 옷소매 안쪽으로 입과 코를 가린다.",
   "rubric": {
    "required": [
     "구체적 수칙 두 가지",
     "각 수칙에 맞는 때나 상황"
    ],
    "criteria": [
     "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
    ],
    "pass": "자료와 근거를 연결한 타당한 설명을 선생님과 확인한다."
   }
  },
  "explanation": "실천 가능한 행동과 상황이 연결되는지 확인한다. 환기 역할 등 다른 타당한 수칙도 가능하며 학생에게 위험한 조작을 맡기지 않는다.",
  "evidence": {
   "checkedBy": "창작 학습 문항 검수",
   "date": "2026-10-18",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부4과08-01~03·질병관리청 현재 예방 안내·자체 교재의 확인 범위",
   "note": "가상 자료는 실제 관찰값이 아니며 원문 문항이나 공식 배점이 아니다."
  }
 },
 {
  "id": "c22-s32-u04-b67",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "GFIELD 감염병과 건강한 생활 창작 학습",
   "course": "초등3-2"
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u04",
   "area": "생명",
   "topic": "예방 수칙 공유",
   "concept": "출처 확인과 소통",
   "inquirySkill": "자료 평가와 의견 반영",
   "element": "E5",
   "type": "T09",
   "format": "선택형",
   "level": "기본",
   "track": "교과",
   "standard": "4과08-03"
  },
  "prompt": "친구가 “언제 손을 씻어야 하는지 모르겠어.”라고 했습니다. 포스터를 어떻게 고치면 좋을까요?",
  "givens": null,
  "choices": [
   "글씨 색만 바꾸고 내용은 그대로 둔다.",
   "질문한 친구 이름만 크게 넣어 둔다.",
   "잘 모르면 읽지 말라는 문장을 넣는다.",
   "식사 전·화장실 뒤라는 때를 더한다.",
   "사진 장식 수를 늘려 질문을 가린다."
  ],
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 3,
   "accepted": [
    3
   ]
  },
  "explanation": "친구의 실제 질문이 시점을 모르겠다는 것이므로 구체적인 때를 추가한다. 의견의 내용과 수정 내용을 연결하는 것이 중요하다.",
  "evidence": {
   "checkedBy": "창작 학습 문항 검수",
   "date": "2026-10-18",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부4과08-01~03·질병관리청 현재 예방 안내·자체 교재의 확인 범위",
   "note": "가상 자료는 실제 관찰값이 아니며 원문 문항이나 공식 배점이 아니다."
  }
 },
 {
  "id": "c22-s32-u04-b80",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "GFIELD 감염병과 건강한 생활 창작 학습",
   "course": "초등3-2"
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 2,
   "unit": "u04",
   "area": "생명",
   "topic": "생활 속 실천 점검",
   "concept": "기록·장애물·개선",
   "inquirySkill": "수행 근거로 계획 수정",
   "element": "E5",
   "type": "T10",
   "format": "서술형",
   "level": "기본",
   "track": "교과",
   "standard": "4과08-03"
  },
  "prompt": "자신이 정한 예방 수칙 하나를 돌아보세요. 실제 수행 여부·어려웠던 점·다음 개선 행동을 구별해 쓰세요. 아직 시작하지 않았다면 그 사실을 적으세요.",
  "givens": null,
  "choices": null,
  "responseContract": "written-explanation",
  "answerContract": {
   "type": "written-explanation",
   "sample": "아직 시작하지 않았다. 식사 전 손 씻기를 실천할 계획이다. 씻을 곳이 붐빌 수 있어 교사와 이용 순서를 상의하고 실제로 한 뒤 방법을 기록하겠다.",
   "rubric": {
    "required": [
     "수행 여부의 구별",
     "실제 장애물 또는 예상 장애물의 구별",
     "장애물에 맞는 구체적 개선"
    ],
    "criteria": [
     "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
    ],
    "pass": "자료와 근거를 연결한 타당한 설명을 선생님과 확인한다."
   }
  },
  "explanation": "개인 건강정보나 병명을 요구하지 않는다. 실제 수행하지 않았으면 정직하게 구별하고 예상 장애물과 다음 행동을 설명한 답을 함께 확인한다.",
  "evidence": {
   "checkedBy": "창작 학습 문항 검수",
   "date": "2026-10-18",
   "gates": [
    "science",
    "answer"
   ],
   "against": "교육부4과08-01~03·질병관리청 현재 예방 안내·자체 교재의 확인 범위",
   "note": "가상 자료는 실제 관찰값이 아니며 원문 문항이나 공식 배점이 아니다."
  }
 }
];
export const lab={
 "kind": "infection-compare",
 "rowsKey": "infectionCompareRows",
 "columns": [
  "차례",
  "내 처음 예상",
  "두 규칙의 자료"
 ]
};
