// Revise only the reviewed authored question, retaining the exact earlier paper.
export const ASSESSMENT_LANGUAGE_VERSION='20261116-assessment-language';
const before={
  "id": "c22-s42-fin-f1-18",
  "status": "authored",
  "sourceRef": {
    "type": "authored-assessment",
    "set": 1,
    "no": 18,
    "edition": "GFIELD 창작 기말평가 A형",
    "course": "초등4-2",
    "unit": "기말평가"
  },
  "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 4,
    "semester": 2,
    "unit": "fin",
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
  "prompt": "가상 먹이 관계표에 맞는 설명 두 가지를 고르세요.",
  "givens": {
    "가상 관찰 자료": {
      "머리": [
        "먹는 생물",
        "먹이"
      ],
      "행": [
        [
          "토끼",
          "풀"
        ],
        [
          "들쥐",
          "풀"
        ],
        [
          "매",
          "토끼·들쥐"
        ]
      ],
      "caption": "가상 관찰 자료"
    }
  },
  "choices": [
    "매의 대체 먹이가 있으면 생존이 보장된다.",
    "매는 토끼와 들쥐 양쪽에 연결된다.",
    "들쥐가 토끼를 먹는다고 표에 나와 있다.",
    "이 표만으로 모든 생물의 개체수를 안다.",
    "풀에서 토끼와 들쥐로 경로가 갈라진다."
  ],
  "responseContract": "multi-choice",
  "answerContract": {
    "type": "multi-choice",
    "answers": [
      1,
      4
    ]
  },
  "explanation": "여러 먹이 관계를 한 그물로 연결해요. 제시되지 않은 먹이 관계나 정확한 개체수·생존 보장은 이 자료의 결론이 아니에요.",
  "evidence": {
    "checkedBy": "창작 평가 문항 검수",
    "date": "2026-10-18",
    "gates": [
      "science",
      "answer"
    ],
    "against": "교육부4과13-01~03·14-01~03·15-01~04·16-01~03 및 네단원 검수된 교재·출처 기록",
    "note": "제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다."
  }
};
const cache=new WeakMap();
export function reviewedAssessmentItems(items){
 let changed=false;
 const result=items.map(q=>{
  if(JSON.stringify(q)!==JSON.stringify(before))return q;
  changed=true;if(cache.has(q))return cache.get(q);
  const next={...q,
   prompt:'다음 먹이 관계표를 보고, 알맞은 설명 두 가지를 고르세요.',
   givens:{'먹이 관계표':{...q.givens['가상 관찰 자료'],caption:'먹이 관계표'}},
   choices:['먹이가 있으면 매는 언제나 살아남는다.','매는 토끼와 들쥐를 먹는다.','들쥐는 토끼를 먹는다.','이 표로 생물이 각각 몇 마리인지 알 수 있다.','토끼와 들쥐는 모두 풀을 먹는다.'],
   explanation:'매는 토끼와 들쥐를 먹고, 토끼와 들쥐는 모두 풀을 먹어요. 표에는 생물의 수가 나와 있지 않아요. 먹이가 있다는 것만으로 매가 언제나 살아남는다고 할 수는 없어요.',
   contentVersion:ASSESSMENT_LANGUAGE_VERSION,
   previousVersions:[{...JSON.parse(JSON.stringify(q)),version:1,snapshotKind:'full-question'}]
  };
  cache.set(q,next);return next;
 });
 return changed?result:items;
}
