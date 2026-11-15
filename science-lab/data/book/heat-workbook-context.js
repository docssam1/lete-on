export const HEAT_CONTEXT_VERSION='20261116-heat-workbook-context';
// Distinguish direct observation from a still photo and a single check from onset timing.
const review={
 "patches": [
  {
   "previous": {
    "id": "c22-s52-u02-w027",
    "no": 27,
    "form": "multi",
    "topic": "물의 대류 관찰",
    "prompt": "교사 시범에서 물의 움직임을 살필 때 적절한 기록을 모두 고르세요.",
    "answer": "①, ②, ③",
    "explanation": "데운 위치와 색소가 움직인 곳, 관찰 시각과 물을 저었는지 적어요. 색소가 퍼졌다고 물이 다른 물질로 바뀐 것은 아니에요. 직접 보지 못한 움직임을 본 것처럼 그리지 않아요.",
    "misconception": "설명 그림과 직접 관찰 기록을 구별해요.",
    "criteria": "데운 위치·실제 움직임·저음 여부 등 직접 관찰한 범위를 보존하는 기록을 모두 고른다.",
    "choices": [
     "데운 위치와 색소의 실제 이동 위치를 적는다.",
     "관찰 시작 시각과 물을 저었는지 함께 적는다.",
     "사진에 없던 이동은 보지 못함으로 남긴다.",
     "물의 색이 바뀌면 반드시 다른 물질이 되었다고 적는다.",
     "원하는 화살표를 먼저 그려 실제 관찰로 바꾼다."
    ],
    "key": [
     0,
     1,
     2
    ],
    "previousCriteria": "문항의 조건과 요구한 단위를 지키고, 같은 뜻의 표현을 인정해요.",
    "standard": "6과07-03",
    "origin": "previous104"
   },
   "fields": {
    "choices": [
     "데운 위치와 색소의 실제 이동 위치를 적는다.",
     "관찰 시작 시각과 물을 저었는지 함께 적는다.",
     "직접 보지 못한 이동은 관찰하지 못했다고 남긴다.",
     "물의 색이 바뀌면 반드시 다른 물질이 되었다고 적는다.",
     "원하는 화살표를 먼저 그려 실제 관찰로 바꾼다."
    ]
   }
  },
  {
   "previous": {
    "id": "c22-s52-u02-w084",
    "no": 84,
    "form": "written",
    "topic": "평가 · 재료 비교",
    "prompt": "같은 크기의 재료 두 종류를 비교하려는데 한쪽은 30초, 다른 쪽은 2분에 색 변화를 확인했습니다. 이 결과의 문제와 보완을 쓰세요.",
    "answer": "관찰 시간이 달라 재료 차이만 비교하기 어렵다. 같은 처음 조건과 같은 시간 간격으로 두 재료의 변화를 함께 관찰하고 반복한다.",
    "explanation": "관찰 시간은 결과에 영향을 줄 수 있어요. 재료를 제외한 조건을 맞추어 실제 비교해요.",
    "misconception": "자료로 확인하지 않은 결과까지 단정하지 않아요.",
    "criteria": "30초와2분의 서로 다른 관찰 시점 문제와 같은 처음 조건/간격의 동시 관찰·반복 보완을 쓴다.",
    "lines": 8,
    "previousCriteria": "시간 차이 지적·동일 시점/조건·반복 비교.",
    "standard": "6과07-03",
    "origin": "previous104"
   },
   "fields": {
    "prompt": "같은 크기의 두 재료를 같은 시각에 데우기 시작했어요. 한쪽은 30초가 되었을 때만, 다른 쪽은 2분이 되었을 때만 색을 한 번씩 확인했어요. 이 비교의 문제와 보완 방법을 쓰세요."
   }
  }
 ],
 "directions": [
  {
   "previous": {
    "section": "자료 깊이 읽기 59",
    "title": "여러 열 이동 방식을 찾아요",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s52-u02-w059"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "빛이 컵에 전달된 뒤 금속과 물을 거치며 여러 방식으로 열이 이동할 수 있어요."
     },
     {
      "title": "더 알아보기",
      "text": "복사 에너지를 흡수한 컵 표면의 온도가 올라가면 컵 내부로 전도가 일어나고 주위 물의 흐름도 생길 수 있어요. 여러 전달 과정을 연속해서 생각해 보아요."
     },
     {
      "title": "내가 정리할 것",
      "text": "복사·전도·대류에 해당하는 구간을 각각 표시해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "heat-workbook"
   },
   "questions": [
    {
     "id": "c22-s52-u02-w059",
     "no": 59,
     "form": "written",
     "topic": "여러 방식이 함께 있음",
     "prompt": "햇빛이 비친 금속 컵 속 물이 따뜻해졌습니다. 이 현상을 복사 한 방식만 일어났다고 단정하지 않고 설명하세요.",
     "answer": "빛이 컵 등에 에너지를 전달하고, 컵을 따라 전도가 일어나며 물의 움직임에 따라 대류도 나타날 수 있다. 실제 조건과 관찰 범위로 주요 방식을 구별한다.",
     "explanation": "햇빛이 금속 컵에 전달되는 과정은 복사예요. 데워진 금속을 따라 열이 전달되는 전도, 물이 움직이며 열을 옮기는 대류도 함께 일어날 수 있어요.",
     "misconception": "자료로 확인하지 않은 결과까지 단정하지 않아요.",
     "criteria": "햇빛이 컵에 전달되는 복사와 컵을 따라 전달되는 전도 등 두 가지 이상의 열 이동을 연결한다. 물의 움직임을 관찰한 경우 대류 설명도 인정한다.",
     "lines": 8,
     "previousCriteria": "빛/금속/물 구간을 두 방식 이상과 연결·관찰 한계.",
     "standard": "6과07-03",
     "origin": "previous104"
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "복사·전도·대류에 해당하는 구간을 각각 표시해요.",
     "value": "복사와 전도에 해당하는 과정을 설명하고, 물의 대류를 확인하려면 무엇을 더 관찰해야 할지 쓰세요."
    }
   ]
  },
  {
   "previous": {
    "section": "생활 연결 65~66",
    "title": "장치를 만들고 비교하기",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s52-u02-w065",
       "c22-s52-u02-w066"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "장치를 만들고 시험한 뒤 비교 조건에 맞게 설명해요."
     },
     {
      "title": "더 알아보기",
      "text": "같은 온도의 물이라도 양이 다르면 저장한 에너지의 양은 달라질 수 있어요. 온도는 따뜻하고 차가운 정도이며, 물의 양을 함께 재는 까닭과 연결돼요."
     },
     {
      "title": "내가 정리할 것",
      "text": "100mL와 200mL의 물이 모두 30℃라면 같다고 확인된 것은 무엇인가요?",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "heat-workbook"
   },
   "questions": [
    {
     "id": "c22-s52-u02-w065",
     "no": 65,
     "form": "order",
     "topic": "실제 제작과 소통",
     "prompt": "활동 흐름에 맞게 배열하세요.",
     "answer": "ㄴ→ㄷ→ㄹ→ㄱ",
     "explanation": "목적과 조건을 정하여 설계하고 실제로 만든 장치를 시험해요. 결과를 소개한 뒤 친구의 질문을 듣고 보완할 수 있어요.",
     "misconception": "예상·실행·실제 측정·결론의 순서를 구별해요.",
     "criteria": "설계→제작과 시험→결과 소개→질문을 듣고 보완하기의 기호 순서를 쓴다.",
     "given": [
      "ㄱ 친구의 질문을 듣고 설명이나 장치를 고친다.",
      "ㄴ 목적과 재료, 장치의 구조와 비교 조건을 정한다.",
      "ㄷ 장치를 만들고 같은 조건에서 온도 변화를 재어 비교한다.",
      "ㄹ 실험 조건과 결과를 자료로 만들어 친구에게 설명한다."
     ],
     "accepted": [
      "ㄴ, ㄷ, ㄹ, ㄱ",
      "ㄴ-ㄷ-ㄹ-ㄱ"
     ],
     "previousCriteria": "문항의 조건과 요구한 단위를 지키고, 같은 뜻의 표현을 인정해요.",
     "standard": "6과07-04",
     "origin": "previous104"
    },
    {
     "id": "c22-s52-u02-w066",
     "no": 66,
     "form": "multi",
     "topic": "재료 선택",
     "prompt": "학교에서 쓸 단열 장치를 만들 때 살필 조건을 모두 고르세요.",
     "answer": "①, ②, ③",
     "explanation": "열의 이동을 줄이는 효과뿐 아니라 안전하게 만들고 다시 시험하기 좋은지도 생각해요. 사용한 재료를 나누어 정리하거나 다시 쓸 방법도 정해요. 시험하지 않은 곳에서도 가장 좋다고 소개하지 않아요.",
     "misconception": "효과만 좋으면 안전과 사용 조건은 무시해도 된다고 하지 않아요.",
     "criteria": "목적·재료/배치·비교 조건과 안전/정리의 사용 조건을 살피는 보기만 모두 고른다.",
     "choices": [
      "교사가 확인한 안전한 재료와 안정된 구조를 사용한다.",
      "사용 뒤 재료 분리·재사용과 정리 방법도 생각한다.",
      "손쉽게 시험·보완할 수 있는 구조인지 살핀다.",
      "학생이 뜨거운 물을 직접 붓고 날카롭게 자른다.",
      "검증 없이 모든 장소에서 최고 성능이라 광고한다."
     ],
     "key": [
      0,
      1,
      2
     ],
     "previousCriteria": "문항의 조건과 요구한 단위를 지키고, 같은 뜻의 표현을 인정해요.",
     "standard": "6과07-04",
     "origin": "previous104"
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "100mL와 200mL의 물이 모두 30℃라면 같다고 확인된 것은 무엇인가요?",
     "value": "65번의 활동 순서와 66번에서 고른 방법이 알맞은 까닭을 정리해요."
    }
   ]
  }
 ]
};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),clone=x=>JSON.parse(JSON.stringify(x));
export function withHeatContextWorkbook(workbook){
 if(workbook?.unit!=='c22-s52-u02'||!Array.isArray(workbook.questions)||!Array.isArray(workbook.pages))return workbook;
 const source=new Map(workbook.questions.map(q=>[q.id,q]));let changed=false;
 const questions=workbook.questions.map(q=>{const patch=review.patches.find(p=>p.previous.id===q.id&&same(p.previous,q));if(!patch)return q;changed=true;return{...q,...clone(patch.fields)};});
 const revise=rows=>rows?.map(page=>{const patch=review.directions.find(p=>same(p.previous,page)&&p.questions.every(q=>same(source.get(q.id),q)));if(!patch)return page;changed=true;const next=clone(page);for(const f of patch.fields){let at=next;for(const key of f.path.slice(0,-1))at=at[key];at[f.path.at(-1)]=clone(f.value);}return next;});
 const pages=revise(workbook.pages),teacher=revise(workbook.teacherStudentPages);return changed?{...workbook,questions,pages,...(teacher?{teacherStudentPages:teacher}:{})}:workbook;
}

const bankPatches=[
 {
  "previous": {
   "id": "c22-s52-u02-b027",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
    "course": "초등 5-2"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 2,
    "unit": "u02",
    "area": "운동과 에너지",
    "element": "E4",
    "type": "T04",
    "format": "선택형",
    "level": "기본",
    "track": "교과",
    "standard": "6과07-03",
    "topic": "물의 대류 관찰",
    "concept": "물의 대류",
    "inquirySkill": "여러 주장과 근거 비교"
   },
   "prompt": "교사 시범에서 물의 움직임을 살필 때 적절한 기록을 모두 고르세요.",
   "givens": null,
   "choices": [
    "데운 위치와 색소의 실제 이동 위치를 적는다.",
    "관찰 시작 시각과 물을 저었는지 함께 적는다.",
    "사진에 없던 이동은 보지 못함으로 남긴다.",
    "물의 색이 바뀌면 반드시 다른 물질이 되었다고 적는다.",
    "원하는 화살표를 먼저 그려 실제 관찰로 바꾼다."
   ],
   "responseContract": "multi-choice",
   "answerContract": {
    "type": "multi-choice",
    "answers": [
     0,
     1,
     2
    ]
   },
   "bookResponseForm": "multi",
   "workbookRef": {
    "unit": "c22-s52-u02",
    "id": "c22-s52-u02-w027",
    "no": 27
   },
   "explanation": "데운 위치와 색소가 움직인 곳, 관찰 시각과 물을 저었는지 적어요. 색소가 퍼졌다고 물이 다른 물질로 바뀐 것은 아니에요. 직접 보지 못한 움직임을 본 것처럼 그리지 않아요.",
   "misconception": "설명 그림과 직접 관찰 기록을 구별해요.",
   "evidence": {
    "checkedBy": "창작 교재·현행 범위·자체 응답 대조",
    "date": "2026-10-18",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교육부6과07·자가 이론422/실험4D 본문·DOE/UCAR 본문",
    "note": "독립 창작. 가상 수치·AI사진은 실제 수행/측정이 아니다."
   },
   "contentVersion": "20261106-heat-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s52-u02-b027",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
      "course": "초등 5-2"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T04",
      "format": "선택형",
      "level": "기본",
      "track": "교과",
      "standard": "6과07-03",
      "topic": "물의 대류 관찰",
      "concept": "물의 대류",
      "inquirySkill": "여러 주장과 근거 비교"
     },
     "prompt": "교사 시범에서 물의 움직임을 살필 때 적절한 기록을 모두 고르세요.",
     "givens": null,
     "choices": [
      "데운 위치와 색소의 실제 이동 위치를 적는다.",
      "관찰 시작 시각과 물을 저었는지 함께 적는다.",
      "사진에 없던 이동은 보지 못함으로 남긴다.",
      "물의 색이 바뀌면 반드시 다른 물질이 되었다고 적는다.",
      "원하는 화살표를 먼저 그려 실제 관찰로 바꾼다."
     ],
     "responseContract": "multi-choice",
     "answerContract": {
      "type": "multi-choice",
      "answers": [
       0,
       1,
       2
      ]
     },
     "bookResponseForm": "multi",
     "workbookRef": {
      "unit": "c22-s52-u02",
      "id": "c22-s52-u02-w027",
      "no": 27
     },
     "explanation": "위치·시간·저음 여부와 실제 본 움직임을 기록해야 설명의 근거가 돼요. 색소의 퍼짐은 물의 물질 변화 증거가 아니며 미관찰을 만들어 채우지 않아요.",
     "misconception": "설명 그림과 직접 관찰 기록을 구별해요.",
     "evidence": {
      "checkedBy": "창작 교재·현행 범위·자체 응답 대조",
      "date": "2026-10-18",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교육부6과07·자가 이론422/실험4D 본문·DOE/UCAR 본문",
      "note": "독립 창작. 가상 수치·AI사진은 실제 수행/측정이 아니다."
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "choices": [
    "데운 위치와 색소의 실제 이동 위치를 적는다.",
    "관찰 시작 시각과 물을 저었는지 함께 적는다.",
    "직접 보지 못한 이동은 관찰하지 못했다고 남긴다.",
    "물의 색이 바뀌면 반드시 다른 물질이 되었다고 적는다.",
    "원하는 화살표를 먼저 그려 실제 관찰로 바꾼다."
   ]
  }
 },
 {
  "previous": {
   "id": "c22-s52-u02-b084",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
    "course": "초등 5-2"
   },
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 5,
    "semester": 2,
    "unit": "u02",
    "area": "운동과 에너지",
    "element": "E3",
    "type": "T03",
    "format": "서술형",
    "level": "기본",
    "track": "교과",
    "standard": "6과07-03",
    "topic": "평가 · 재료 비교",
    "concept": "고체와 전도",
    "inquirySkill": "근거로 설명·주장의 한계"
   },
   "prompt": "같은 크기의 재료 두 종류를 비교하려는데 한쪽은 30초, 다른 쪽은 2분에 색 변화를 확인했습니다. 이 결과의 문제와 보완을 쓰세요.",
   "givens": null,
   "choices": null,
   "responseContract": "written-explanation",
   "answerContract": {
    "type": "written-explanation",
    "sample": "관찰 시간이 달라 재료 차이만 비교하기 어렵다. 같은 처음 조건과 같은 시간 간격으로 두 재료의 변화를 함께 관찰하고 반복한다.",
    "rubric": {
     "required": [
      "30초와2분의 서로 다른 관찰 시점 문제와 같은 처음 조건/간격의 동시 관찰·반복 보완을 쓴다."
     ],
     "pass": "교사 확인 · 동등 표현과 타당한 대안 인정",
     "note": "학습용 기준. 실제 수행·공식 성적은 별도 확인."
    }
   },
   "bookResponseForm": "written",
   "workbookRef": {
    "unit": "c22-s52-u02",
    "id": "c22-s52-u02-w084",
    "no": 84
   },
   "explanation": "관찰 시간은 결과에 영향을 줄 수 있어요. 재료를 제외한 조건을 맞추어 실제 비교해요.",
   "misconception": "자료로 확인하지 않은 결과까지 단정하지 않아요.",
   "evidence": {
    "checkedBy": "창작 교재·현행 범위·자체 응답 대조",
    "date": "2026-10-18",
    "gates": [
     "science",
     "answer"
    ],
    "against": "교육부6과07·자가 이론422/실험4D 본문·DOE/UCAR 본문",
    "note": "독립 창작. 가상 수치·AI사진은 실제 수행/측정이 아니다."
   },
   "contentVersion": "20261115-reviewed-answer-criteria",
   "previousVersions": [
    {
     "id": "c22-s52-u02-b084",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
      "course": "초등 5-2"
     },
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 5,
      "semester": 2,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T03",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과07-03",
      "topic": "평가 · 재료 비교",
      "concept": "고체와 전도",
      "inquirySkill": "근거로 설명·주장의 한계"
     },
     "prompt": "같은 크기의 재료 두 종류를 비교하려는데 한쪽은 30초, 다른 쪽은 2분에 색 변화를 확인했습니다. 이 결과의 문제와 보완을 쓰세요.",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "관찰 시간이 달라 재료 차이만 비교하기 어렵다. 같은 처음 조건과 같은 시간 간격으로 두 재료의 변화를 함께 관찰하고 반복한다.",
      "rubric": {
       "required": [
        "시간 차이 지적·동일 시점/조건·반복 비교."
       ],
       "pass": "교사 확인 · 동등 표현과 타당한 대안 인정",
       "note": "학습용 기준. 실제 수행·공식 성적은 별도 확인."
      }
     },
     "bookResponseForm": "written",
     "workbookRef": {
      "unit": "c22-s52-u02",
      "id": "c22-s52-u02-w084",
      "no": 84
     },
     "explanation": "관찰 시간은 결과에 영향을 줄 수 있어요. 재료를 제외한 조건을 맞추어 실제 비교해요.",
     "misconception": "자료로 확인하지 않은 결과까지 단정하지 않아요.",
     "evidence": {
      "checkedBy": "창작 교재·현행 범위·자체 응답 대조",
      "date": "2026-10-18",
      "gates": [
       "science",
       "answer"
      ],
      "against": "교육부6과07·자가 이론422/실험4D 본문·DOE/UCAR 본문",
      "note": "독립 창작. 가상 수치·AI사진은 실제 수행/측정이 아니다."
     },
     "version": 1,
     "snapshotKind": "full-question"
    }
   ]
  },
  "fields": {
   "prompt": "같은 크기의 두 재료를 같은 시각에 데우기 시작했어요. 한쪽은 30초가 되었을 때만, 다른 쪽은 2분이 되었을 때만 색을 한 번씩 확인했어요. 이 비교의 문제와 보완 방법을 쓰세요."
  }
 }
];
const bankCache=new WeakMap();
export function heatContextItems(rows,unit){
 if(unit!=='c22-s52-u02'||!Array.isArray(rows))return rows;let changed=false;
 const next=rows.map(q=>{const patch=bankPatches.find(p=>same(p.previous,q));if(!patch)return q;changed=true;if(bankCache.has(q))return bankCache.get(q);
 const current={...q,...clone(patch.fields),contentVersion:HEAT_CONTEXT_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};bankCache.set(q,current);return current;});return changed?next:rows;
}
export function withHeatContextClassroom(unit,book){
 const rows=heatContextItems(book?.classroomItems,unit);return rows===book?.classroomItems?book:{...book,classroomItems:rows};
}
