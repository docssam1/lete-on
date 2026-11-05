import{ecologySoundCurrentItems}from'../../v2/ecology-sound-question-language.js?v=20261105-ecology-sound-bank';
import{items as canonicalItems}from'../units/c22-s42-u02.js';
// 모형의 가상 값과 실제 조사·실천을 구별하는 수업. 원래 기록은 보존한다.
export const chapter = {
 "ecologyThinking": true,
 "ecologyInteraction": {
  "predict": {
   "q": "풀 → 토끼 → 여우만 사는 풀밭에서 여우가 모두 사라지면, 몇 해 뒤 토끼와 풀은 어떻게 될까요?",
   "options": [
    "토끼는 늘고 풀은 줄어요",
    "토끼도 풀도 그대로예요",
    "토끼는 줄고 풀은 늘어요"
   ],
   "answer": 0,
   "result": "여우가 사라지자 토끼가 늘었고, 늘어난 토끼가 풀을 많이 먹어 풀은 줄었어요."
  },
  "design": [
   {
    "k": "change",
    "q": "바꿀 조건은?",
    "options": [
     "풀밭에서 바꾸는 한 가지",
     "처음 토끼의 수",
     "지켜보는 기간"
    ],
    "answer": 0,
    "hint": "알아보려는 것은 「무엇이 사라지면」 어떻게 되는지예요."
   },
   {
    "k": "same",
    "q": "같게 할 조건은?",
    "options": [
     "바꾸는 것",
     "3년 뒤의 수",
     "처음 수·지켜보는 기간·닫힌 풀밭"
    ],
    "answer": 2,
    "hint": "바꿀 조건과 결과를 뺀 나머지는 모두 같게 해요."
   },
   {
    "k": "measure",
    "q": "관찰해 기록할 것은?",
    "options": [
     "토끼의 털 색깔",
     "3년 뒤 풀·토끼·여우의 수",
     "풀밭의 넓이"
    ],
    "answer": 1,
    "hint": "지켜본 뒤 비교할 “결과”가 무엇인지 생각해 봐요."
   }
  ],
  "recall": {
   "q": "지난 시간, 풀밭에서 토끼가 모두 사라졌을 때 풀은 어떻게 되었나요?",
   "options": [
    "늘어났어요",
    "줄어들었어요",
    "그대로였어요"
   ],
   "answer": 0,
   "why": "풀을 먹는 토끼가 없어져 풀이 늘었어요. 먹이가 줄어든 여우는 줄었어요."
  },
  "learned": {
   "q": "오늘 알아낸 것을 모두 골라요.",
   "options": [
    "여우가 사라지면 토끼가 늘고 풀은 줄어요.",
    "한 생물이 사라져도 다른 생물은 그대로예요.",
    "먹이 화살표는 먹히는 쪽에서 먹는 쪽을 향해요.",
    "흙 속에 사는 생물은 모두 분해자예요.",
    "가뭄으로 풀이 줄면 토끼와 여우도 줄어요.",
    "햇빛과 물은 생태계와 관계가 없어요."
   ],
   "answers": [
    0,
    2,
    4
   ],
   "summary": "먹이 관계로 이어진 생물은 서로 영향을 주고받아요. 한 생물이 사라지거나 줄면 사슬을 따라 다른 생물의 수도 달라져요."
  }
 },
 "labRecordTitle": "내 풀밭 모형 자료 비교",
 "slideCues": {
  "cover": "생태계의 구성과 관계를 조사하고 보전 실천으로 이어 가요.",
  "predict": "단순한 먹이 사슬의 모형을 먼저 예상해요.",
  "scene": "사진에서 보이는 모습과 수업에서 제공한 먹이 관계를 구별해요.",
  "questions": "무엇을 바꾸고 무엇과 비교할까요?",
  "design": "그대로와 여우가 사라진 조건을 먼저 비교해요.",
  "lab": "세 생물의 변화를 먼저 예상하고 기준 조건과 바꾼 조건의 자료를 비교해요.",
  "results": "제공한 모형의 두 조건을 나란히 읽어요.",
  "limits": "경향 값으로 실제 생존 기간을 설명할 수 있을까요?",
  "conclusion": "처음 예상과 모형의 근거를 비교해요.",
  "habitat": "생물과 주변의 물과 빛과 흙을 함께 살펴요.",
  "elements": "움직임 대신 생물인지 환경 요소인지 구별해요.",
  "roles": "양분을 얻는 방법으로 분류해요.",
  "arrows": "먹히는 쪽에서 먹는 쪽으로 화살표를 이어요.",
  "chains": "여러 먹이 사슬의 공통 생물을 찾아요.",
  "model-design": "이름표 여섯 장과 화살표를 준비해요.",
  "model-make": "카드와 화살표로 실제 모형을 만들어 보아요.",
  "model-check": "자료와 대조해 잘못된 방향과 빠진 선을 고쳐요.",
  "paths": "남은 먹이 경로의 도움과 한계를 설명해요.",
  "impact": "직접 보인 사실과 더 조사할 원인을 나누어요.",
  "pollution": "원인에 대응하는 보전 방법을 찾아요.",
  "discuss": "다른 의견의 근거를 듣고 실행 방법을 함께 정해요.",
  "practice": "정한 행동을 실제로 해 보고 못 한 날도 살펴요.",
  "recheck": "내 행동에서 확인한 효과의 범위를 지켜요.",
  "share": "만든 모형과 실천을 설명하고 질문을 들어요.",
  "test1": "자료와 조건을 읽고 근거로 설명해요.",
  "test2": "자료와 조건을 읽고 근거로 설명해요.",
  "test3": "자료와 조건을 읽고 근거로 설명해요.",
  "test4": "자료와 조건을 읽고 근거로 설명해요.",
  "test5": "자료와 조건을 읽고 근거로 설명해요.",
  "test6": "자료와 조건을 읽고 근거로 설명해요.",
  "test7": "자료와 조건을 읽고 근거로 설명해요.",
  "test8": "자료와 조건을 읽고 근거로 설명해요.",
  "test9": "자료와 조건을 읽고 근거로 설명해요.",
  "test10": "자료와 조건을 읽고 근거로 설명해요.",
  "test11": "자료와 조건을 읽고 근거로 설명해요.",
  "test12": "자료와 조건을 읽고 근거로 설명해요.",
  "end": "조사와 모형 제작과 실제 실천의 근거를 연결했나요?"
 },
 "title": "생물과 환경",
 "sessionLabels": [
  "생태계 구성·풀밭 모형 비교",
  "먹이그물 제작·보전 토의와 실천"
 ],
 "startDescriptions": [
  "생물과 주변 환경을 조사하고 양분을 얻는 방법으로 분류해요.",
  "먹이그물을 실제로 만들고 인간 활동의 영향과 보전 방법을 토의·실천해요.",
  "제공된 관계·모형 값·실제 조사와 행동의 근거를 구별해 설명해요."
 ],
 "ecologyChecks": [
  "c22-s42-u02-b02",
  "c22-s42-u02-b04",
  "c22-s42-u02-b10",
  "c22-s42-u02-b21",
  "c22-s42-u02-b25",
  "c22-s42-u02-b30",
  "c22-s42-u02-b35",
  "c22-s42-u02-b39",
  "c22-s42-u02-b45",
  "c22-s42-u02-b54",
  "c22-s42-u02-b65",
  "c22-s42-u02-b78"
 ],
 "check": [
  "c22-s42-u02-b02",
  "c22-s42-u02-b04",
  "c22-s42-u02-b10",
  "c22-s42-u02-b21",
  "c22-s42-u02-b25",
  "c22-s42-u02-b30",
  "c22-s42-u02-b35",
  "c22-s42-u02-b39",
  "c22-s42-u02-b45",
  "c22-s42-u02-b54",
  "c22-s42-u02-b65",
  "c22-s42-u02-b78"
 ],
 "formative": {
  "items": []
 },
 "webBookDescription": "생태계 사진과 먹이 관계·모형 자료를 읽고 비교해요."
};
export const plan = {
 "minutes": 120,
 "phases": [
  {
   "id": "open",
   "name": "도입·예상",
   "min": 8,
   "aim": "생태계 사진·풀밭 모형 예상"
  },
  {
   "id": "design",
   "name": "비교 설계",
   "min": 7,
   "aim": "기준 조건·바꿀 조건·모형 범위"
  },
  {
   "id": "lab",
   "name": "풀밭 자료 비교",
   "min": 15,
   "aim": "두 조건을 예상하고 자료 비교"
  },
  {
   "id": "result",
   "name": "근거와 결론",
   "min": 10,
   "aim": "조건별 경향·모형의 한계"
  },
  {
   "id": "concept",
   "name": "구성·역할·관계",
   "min": 20,
   "aim": "생물/비생물·양분 역할·화살표"
  },
  {
   "id": "extend",
   "name": "제작·토의·실천",
   "min": 40,
   "aim": "먹이그물 직접 제작·보전 방법 실천"
  },
  {
   "id": "check",
   "name": "확인",
   "min": 20,
   "aim": "12문항으로 구성·관계·보전 점검"
  }
 ],
 "say": {
  "cover": "2022 [4과14]입니다. 기록 양식 대신 예상·관찰·설명으로 진행합니다. 풀밭의 수는 경향을 보여 주는 모형 값입니다.",
  "scene": "여우가 사라지면 어떻게 될지 먼저 고르게 하세요. 「토끼만 늘고 끝」이라고 생각하는 학생이 많을 수 있습니다 — 결과는 아직 말하지 않습니다.",
  "hypo": "「풀밭이 더 좋아질 것이다」도 조건과 결과를 이으면 가설입니다.",
  "design": "한 번에 하나만 바꾸고, 「그대로」를 기준으로 비교합니다.",
  "lab": "두 팀이 예상부터 고른 뒤 실험합니다. 실제 생물을 없애는 실험이 아님을 짚어 주세요.",
  "concl": "「토끼가 늘고 → 풀이 줄었다」처럼 영향이 사슬을 따라 이어지는 것을 스스로 말하게 합니다.",
  "gifted": "영향을 두 단계 이상 따라가 보게 합니다.",
  "test": "답을 먼저 공개하지 말고 학생의 응답 뒤 해설을 보여 주세요."
 }
};
const originalChecks=[
 {
  "id": "c22-s42-u02-b02",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "2022 개정 현행 범위 보충",
   "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 4,
   "semester": 2,
   "unit": "u02",
   "area": "생명",
   "element": "E1",
   "type": "T01",
   "format": "선택형",
   "level": "기본",
   "track": "교과",
   "topic": "생태계의 범위와 구성",
   "concept": "생태계의 범위와 구성",
   "inquirySkill": "생태계의 범위와 구성",
   "standard": "4과14-01"
  },
  "prompt": "숲과 바다 생태계를 비교한 설명으로 알맞은 것을 고르세요.",
  "givens": null,
  "choices": [
   "물속에는 비생물 요소가 존재하지 않는다.",
   "숲은 크기 때문에 생태계가 될 수 없다.",
   "각 장소의 생물과 환경은 다를 수 있다.",
   "바다는 생물이 많아 환경을 조사할 필요가 없다.",
   "숲과 바다의 모든 생물은 같은 종류이다."
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
  "explanation": "생태계의 종류·크기·구성은 다양합니다. 어느 쪽도 생물만으로 이루어지지 않습니다.",
  "evidence": {
   "checkedBy": "독립 창작·자료/조건/응답 계약 검토",
   "date": "2026-10-18",
   "gates": [
    "science",
    "answer"
   ],
   "productGate": true,
   "renderGate": true
  }
 },
 {
  "id": "c22-s42-u02-b04",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "2022 개정 현행 범위 보충",
   "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 4,
   "semester": 2,
   "unit": "u02",
   "area": "생명",
   "element": "E1",
   "type": "T01",
   "format": "선택형",
   "level": "기본",
   "track": "교과",
   "topic": "생태계의 범위와 구성",
   "concept": "생태계의 범위와 구성",
   "inquirySkill": "생태계의 범위와 구성",
   "standard": "4과14-01"
  },
  "prompt": "생태계 조사 계획에 들어갈 항목 두 가지를 고르세요.",
  "givens": null,
  "choices": [
   "관찰 구역과 날짜",
   "공책 가격의 합계",
   "살아 있는 것과 주변 환경",
   "관찰자 취미의 순위",
   "친구의 키 순서"
  ],
  "visualModel": null,
  "variantRules": null,
  "responseContract": "multi-choice",
  "answerContract": {
   "type": "multi-choice",
   "answers": [
    0,
    2
   ]
  },
  "explanation": "무엇을 어디서 언제 조사했는지와 구성 요소를 함께 기록해야 비교할 수 있습니다.",
  "evidence": {
   "checkedBy": "독립 창작·자료/조건/응답 계약 검토",
   "date": "2026-10-18",
   "gates": [
    "science",
    "answer"
   ],
   "productGate": true,
   "renderGate": true
  }
 },
 {
  "id": "c22-s42-u02-b10",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "2022 개정 현행 범위 보충",
   "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 4,
   "semester": 2,
   "unit": "u02",
   "area": "생명",
   "element": "E1",
   "type": "T02",
   "format": "서술형",
   "level": "기본",
   "track": "교과",
   "topic": "생물·비생물 요소 분류",
   "concept": "생물·비생물 요소 분류",
   "inquirySkill": "생물·비생물 요소 분류",
   "standard": "4과14-01"
  },
  "prompt": "버섯과 바위를 각각 분류하고, 왜 둘을 다르게 분류했는지 설명하세요.",
  "givens": null,
  "choices": null,
  "visualModel": null,
  "variantRules": null,
  "responseContract": "written-explanation",
  "answerContract": {
   "type": "written-explanation",
   "sample": "버섯은 살아 있는 생물 요소이고 바위는 비생물 요소입니다. 움직임이 보이지 않아도 버섯은 생물입니다.",
   "rubric": {
    "required": [
     "버섯을 생물 요소로 분류",
     "바위를 비생물 요소로 분류",
     "살아 있음과 연결한 이유 설명"
    ],
    "pass": "타당한 근거·대안은 교사 확인"
   }
  },
  "explanation": "스스로 장소를 옮기지 않는다는 이유만으로 버섯과 바위를 같은 비생물 요소로 분류하지 않습니다.",
  "evidence": {
   "checkedBy": "독립 창작·자료/조건/응답 계약 검토",
   "date": "2026-10-18",
   "gates": [
    "science",
    "answer"
   ],
   "productGate": true,
   "renderGate": true
  }
 },
 {
  "id": "c22-s42-u02-b21",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "2022 개정 현행 범위 보충",
   "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 4,
   "semester": 2,
   "unit": "u02",
   "area": "생명",
   "element": "E3",
   "type": "T05",
   "format": "선택형",
   "level": "기본",
   "track": "교과",
   "topic": "먹이 화살표와 사슬",
   "concept": "먹이 화살표와 사슬",
   "inquirySkill": "먹이 화살표와 사슬",
   "standard": "4과14-02"
  },
  "prompt": "화살표가 먹히는 쪽에서 먹는 쪽을 향할 때 알맞은 연결을 고르세요.",
  "givens": {
   "자료": "메뚜기가 풀을 먹는다."
  },
  "choices": [
   "메뚜기 → 풀",
   "물 → 공기",
   "햇빛 → 온도",
   "풀 → 메뚜기",
   "바위 → 햇빛"
  ],
  "visualModel": null,
  "variantRules": null,
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 3,
   "accepted": [
    3
   ]
  },
  "explanation": "메뚜기가 풀을 먹는 자료를 화살표로 나타냅니다.",
  "evidence": {
   "checkedBy": "독립 창작·자료/조건/응답 계약 검토",
   "date": "2026-10-18",
   "gates": [
    "science",
    "answer"
   ],
   "productGate": true,
   "renderGate": true
  }
 },
 {
  "id": "c22-s42-u02-b25",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "2022 개정 현행 범위 보충",
   "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 4,
   "semester": 2,
   "unit": "u02",
   "area": "생명",
   "element": "E3",
   "type": "T05",
   "format": "서술형",
   "level": "기본",
   "track": "교과",
   "topic": "먹이 화살표와 사슬",
   "concept": "먹이 화살표와 사슬",
   "inquirySkill": "먹이 화살표와 사슬",
   "standard": "4과14-02"
  },
  "prompt": "친구가 만든 화살표의 오류를 고치고 까닭을 설명하세요.",
  "givens": {
   "친구의 모형": "개구리 → 메뚜기",
   "조사 자료": "개구리가 메뚜기를 먹는다."
  },
  "choices": null,
  "visualModel": null,
  "variantRules": null,
  "responseContract": "written-explanation",
  "answerContract": {
   "type": "written-explanation",
   "sample": "메뚜기 → 개구리로 고칩니다. 개구리가 메뚜기를 먹으므로 먹히는 메뚜기에서 먹는 개구리로 향해야 합니다.",
   "rubric": {
    "required": [
     "메뚜기에서 개구리로 화살표 수정",
     "먹히는 쪽에서 먹는 쪽이라는 근거"
    ],
    "pass": "타당한 근거·대안은 교사 확인"
   }
  },
  "explanation": "화살표를 따라 누가 쫓아가는지를 표현하는 그림과 구별합니다.",
  "evidence": {
   "checkedBy": "독립 창작·자료/조건/응답 계약 검토",
   "date": "2026-10-18",
   "gates": [
    "science",
    "answer"
   ],
   "productGate": true,
   "renderGate": true
  }
 },
 {
  "id": "c22-s42-u02-b30",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "2022 개정 현행 범위 보충",
   "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 4,
   "semester": 2,
   "unit": "u02",
   "area": "생명",
   "element": "E3",
   "type": "T06",
   "format": "서술형",
   "level": "기본",
   "track": "교과",
   "topic": "먹이그물의 연결 읽기",
   "concept": "먹이그물의 연결 읽기",
   "inquirySkill": "먹이그물의 연결 읽기",
   "standard": "4과14-02"
  },
  "prompt": "두 사슬을 하나의 먹이그물로 합칠 때 공통 생물을 어떻게 표시할지 설명하세요.",
  "givens": {
   "사슬 A": "풀 → 토끼 → 여우",
   "사슬 B": "풀 → 들쥐 → 여우"
  },
  "choices": null,
  "visualModel": null,
  "variantRules": null,
  "responseContract": "written-explanation",
  "answerContract": {
   "type": "written-explanation",
   "sample": "풀과 여우를 각각 하나씩 놓고 토끼와 들쥐의 두 경로를 연결합니다. 풀 → 토끼 → 여우와 풀 → 들쥐 → 여우가 모두 보이게 합니다.",
   "rubric": {
    "required": [
     "공통 생물을 연결점으로 사용",
     "두 사슬의 먹이 관계를 모두 보존"
    ],
    "pass": "타당한 근거·대안은 교사 확인"
   }
  },
  "explanation": "정답 그림의 배치 하나를 강요하지 않습니다. 관계와 화살표가 타당하면 됩니다.",
  "evidence": {
   "checkedBy": "독립 창작·자료/조건/응답 계약 검토",
   "date": "2026-10-18",
   "gates": [
    "science",
    "answer"
   ],
   "productGate": true,
   "renderGate": true
  }
 },
 {
  "id": "c22-s42-u02-b35",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "2022 개정 현행 범위 보충",
   "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 4,
   "semester": 2,
   "unit": "u02",
   "area": "생명",
   "element": "E4",
   "type": "T07",
   "format": "서술형",
   "level": "기본",
   "track": "교과",
   "topic": "여러 먹이 경로와 영향",
   "concept": "여러 먹이 경로와 영향",
   "inquirySkill": "여러 먹이 경로와 영향",
   "standard": "4과14-02"
  },
  "prompt": "한 먹이가 줄어도 모두 안전하다고 한 친구의 주장을 자료를 이용해 보완하세요.",
  "givens": {
   "친구의 주장": "먹이그물에는 다른 길이 있으니 한 먹이가 줄어도 모든 생물이 반드시 살아남아."
  },
  "choices": null,
  "visualModel": null,
  "variantRules": null,
  "responseContract": "written-explanation",
  "answerContract": {
   "type": "written-explanation",
   "sample": "다른 먹이가 있으면 도움이 될 수 있지만, 그 먹이의 양이나 다른 환경도 확인해야 합니다. 그물만 보고 모두 반드시 살아남는다고 말할 수는 없습니다.",
   "rubric": {
    "required": [
     "대체 먹이의 도움 인정",
     "양 또는 환경 등 추가 조건 제시",
     "생존을 무조건 보장하지 않음"
    ],
    "pass": "타당한 근거·대안은 교사 확인"
   }
  },
  "explanation": "복잡한 그물이 유리한 까닭과 관찰의 한계를 함께 설명합니다.",
  "evidence": {
   "checkedBy": "독립 창작·자료/조건/응답 계약 검토",
   "date": "2026-10-18",
   "gates": [
    "science",
    "answer"
   ],
   "productGate": true,
   "renderGate": true
  }
 },
 {
  "id": "c22-s42-u02-b39",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "2022 개정 현행 범위 보충",
   "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 4,
   "semester": 2,
   "unit": "u02",
   "area": "생명",
   "element": "E4",
   "type": "T08",
   "format": "단답형",
   "level": "기본",
   "track": "교과",
   "topic": "먹이 관계 모형 제작·수정",
   "concept": "먹이 관계 모형 제작·수정",
   "inquirySkill": "먹이 관계 모형 제작·수정",
   "standard": "4과14-02"
  },
  "prompt": "모형에서 화살표가 가리키는 쪽은 먹히는 쪽과 먹는 쪽 중 어느 쪽인지 쓰세요.",
  "givens": null,
  "choices": null,
  "visualModel": null,
  "variantRules": null,
  "responseContract": "short-text",
  "answerContract": {
   "type": "short-text",
   "answer": "먹는 쪽",
   "accepted": [
    "먹는 쪽",
    "먹는 생물"
   ]
  },
  "explanation": "이 단원의 먹이 화살표는 먹히는 쪽에서 먹는 쪽으로 향합니다.",
  "evidence": {
   "checkedBy": "독립 창작·자료/조건/응답 계약 검토",
   "date": "2026-10-18",
   "gates": [
    "science",
    "answer"
   ],
   "productGate": true,
   "renderGate": true
  }
 },
 {
  "id": "c22-s42-u02-b45",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "2022 개정 현행 범위 보충",
   "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 4,
   "semester": 2,
   "unit": "u02",
   "area": "생명",
   "element": "E5",
   "type": "T09",
   "format": "서술형",
   "level": "기본",
   "track": "교과",
   "topic": "인간 활동과 생태계 영향",
   "concept": "인간 활동과 생태계 영향",
   "inquirySkill": "인간 활동과 생태계 영향",
   "standard": "4과14-03"
  },
  "prompt": "주차장 공사로 풀밭이 줄어든 사례에서 생물과 환경에 생길 수 있는 영향을 두 가지 설명하세요.",
  "givens": null,
  "choices": null,
  "visualModel": null,
  "variantRules": null,
  "responseContract": "written-explanation",
  "answerContract": {
   "type": "written-explanation",
   "sample": "풀과 곤충이 살 공간이 줄 수 있고 땅이 포장되면 물이 스며드는 상태도 달라질 수 있습니다. 실제 변화는 조사해야 합니다.",
   "rubric": {
    "required": [
     "생물의 생활·서식 장소 영향 한 가지",
     "비생물 환경 또는 다른 생물에 대한 타당한 영향 한 가지"
    ],
    "pass": "타당한 근거·대안은 교사 확인"
   }
  },
  "explanation": "가능한 영향과 실제 확인한 결과를 구별합니다. 모든 생물이 사라진다고 단정하지 않습니다.",
  "evidence": {
   "checkedBy": "독립 창작·자료/조건/응답 계약 검토",
   "date": "2026-10-18",
   "gates": [
    "science",
    "answer"
   ],
   "productGate": true,
   "renderGate": true
  }
 },
 {
  "id": "c22-s42-u02-b54",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "2022 개정 현행 범위 보충",
   "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 4,
   "semester": 2,
   "unit": "u02",
   "area": "생명",
   "element": "E5",
   "type": "T11",
   "format": "선택형",
   "level": "기본",
   "track": "교과",
   "topic": "수질·토양 오염의 구별",
   "concept": "수질·토양 오염의 구별",
   "inquirySkill": "수질·토양 오염의 구별",
   "standard": "4과14-03"
  },
  "prompt": "물·흙 오염을 줄이는 행동 두 가지를 고르세요.",
  "givens": null,
  "choices": [
   "폐식용유를 지정된 방법으로 수거한다.",
   "약품을 하천에 부어 물색을 바꾼다.",
   "못 쓰는 건전지를 화단에 묻는다.",
   "세제를 필요한 양만 사용한다.",
   "남은 페인트를 배수구에 붓는다."
  ],
  "visualModel": null,
  "variantRules": null,
  "responseContract": "multi-choice",
  "answerContract": {
   "type": "multi-choice",
   "answers": [
    0,
    3
   ]
  },
  "explanation": "오염 물질이 물과 흙으로 들어가는 양을 줄이는 행동을 선택합니다.",
  "evidence": {
   "checkedBy": "독립 창작·자료/조건/응답 계약 검토",
   "date": "2026-10-18",
   "gates": [
    "science",
    "answer"
   ],
   "productGate": true,
   "renderGate": true
  }
 },
 {
  "id": "c22-s42-u02-b65",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "2022 개정 현행 범위 보충",
   "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 4,
   "semester": 2,
   "unit": "u02",
   "area": "생명",
   "element": "E6",
   "type": "T13",
   "format": "서술형",
   "level": "기본",
   "track": "교과",
   "topic": "보전 실천의 계획과 확인",
   "concept": "보전 실천의 계획과 확인",
   "inquirySkill": "보전 실천의 계획과 확인",
   "standard": "4과14-03"
  },
  "prompt": "일회용 컵 사용을 줄이는 한 주 계획을 세우고 실제 실행과 효과를 어떻게 나눠 기록할지 설명하세요.",
  "givens": null,
  "choices": null,
  "visualModel": null,
  "variantRules": null,
  "responseContract": "written-explanation",
  "answerContract": {
   "type": "written-explanation",
   "sample": "등교할 때 물병을 챙기고 실제 사용한 날과 사용하지 못한 이유를 기록합니다. 일회용 컵을 몇 번 덜 썼는지 확인하되 하천 오염이 줄었다고 직접 측정한 것으로 적지 않습니다.",
   "rubric": {
    "required": [
     "행동·기간이 있는 계획",
     "실행과 미실행 기록 방법",
     "직접 확인한 효과의 범위 구별"
    ],
    "pass": "타당한 근거·대안은 교사 확인"
   }
  },
  "explanation": "행동을 했다는 사실과 생태계 전체가 회복되었다는 주장을 구별합니다.",
  "evidence": {
   "checkedBy": "독립 창작·자료/조건/응답 계약 검토",
   "date": "2026-10-18",
   "gates": [
    "science",
    "answer"
   ],
   "productGate": true,
   "renderGate": true
  }
 },
 {
  "id": "c22-s42-u02-b78",
  "status": "authored",
  "sourceRef": {
   "type": "authored-supplement",
   "edition": "2022 개정 현행 범위 보충",
   "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 4,
   "semester": 2,
   "unit": "u02",
   "area": "생명",
   "element": "E7",
   "type": "T16",
   "format": "선택형",
   "level": "기본",
   "track": "교과",
   "topic": "실제 토의·공유와 수정",
   "concept": "실제 토의·공유와 수정",
   "inquirySkill": "실제 토의·공유와 수정",
   "standard": "4과14-03"
  },
  "prompt": "토의 의견이 서로 다를 때 다음 행동으로 알맞은 것을 고르세요.",
  "givens": null,
  "choices": [
   "다른 의견은 받은 적 없다고 삭제한다.",
   "근거로 실천할 대안을 함께 정한다.",
   "의견을 듣는 대신 정답 문장만 복사한다.",
   "목소리가 큰 사람의 의견만 기록한다.",
   "확인 없이 모두 같은 결과를 냈다고 쓴다."
  ],
  "visualModel": null,
  "variantRules": null,
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 1,
   "accepted": [
    1
   ]
  },
  "explanation": "서로의 이유를 살피고 실천 가능성과 보전 효과를 비교합니다.",
  "evidence": {
   "checkedBy": "독립 창작·자료/조건/응답 계약 검토",
   "date": "2026-10-18",
   "gates": [
    "science",
    "answer"
   ],
   "productGate": true,
   "renderGate": true
  }
 }
];
export const lab = {
 "kind": "ecology-compare",
 "rowsKey": "ecologyCompareRows",
 "goal": "조건을 예상하고 모형 자료와 비교한다.",
 "columns": [
  "조건",
  "내 예상",
  "모형 자료와 설명"
 ]
};

const currentCheck=ecologySoundCurrentItems(canonicalItems,'c22-s42-u02').find(q=>q.id==='c22-s42-u02-b10');
if(!currentCheck)throw Error('검토한 수업 문항이 없습니다: c22-s42-u02-b10');
export const checks=originalChecks.map(q=>q.id===currentCheck.id?currentCheck:q);
