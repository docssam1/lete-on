export const GAS_PHOTO_VERSION='20261115-gas-photo-context';
// A result photograph supplies visual evidence, not unrecorded experimental conditions.
export const gasPhoto={
  "src": "assets/book/c22-s42-u03-air-packing-yalaman2002.jpg",
  "alt": "하늘색 바탕에서 물건을 감싸고 있는 부푼 투명 비닐 주머니와 포장재",
  "label": "물건을 감싼 비닐 주머니의 부푼 모습을 살펴보아요.",
  "creator": "Yalaman2002",
  "sourceUrl": "https://commons.wikimedia.org/wiki/File:Airbag-packing_2009-6-15.jpg",
  "credit": "사진: Yalaman2002 · Wikimedia Commons · Public domain",
  "sha256": "7e7e1021d20cf60727c337a542c7f1e539ba69c677a6dcf8b316e2242b1b19f5",
  "sourceSha1": "7c73d56316d197f3da5986fab9e5dc85fedb5cce",
  "bytes": 709847,
  "width": 2000,
  "height": 2128
};
const prior={
  "id": "c22-s42-u03-b42",
  "status": "authored",
  "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 제시 수치/기록은 연습 자료이며 실제 학생 측정/제작/소통 증거가 아님."
  },
  "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 4,
    "semester": 2,
    "unit": "u03",
    "area": "물질",
    "element": "E3",
    "type": "T07",
    "format": "서술형",
    "level": "기본",
    "track": "교과",
    "topic": "생활 속 온도·압력 변화 구별",
    "concept": "생활 속 온도·압력 변화 구별",
    "inquirySkill": "생활 속 온도·압력 변화 구별",
    "standard": "4과15-02"
  },
  "prompt": "사진에서 봉지가 부푼 것만 보았습니다. 온도 변화 때문인지 압력 변화 때문인지 설명하려면 어떤 정보가 더 필요한가요?",
  "givens": null,
  "choices": null,
  "visualModel": null,
  "variantRules": null,
  "responseContract": "written-explanation",
  "answerContract": {
    "type": "written-explanation",
    "sample": "앞뒤 온도와 바깥 압력, 기체 출입과 봉지가 부풀 수 있는 상태 등을 확인합니다. 사진만으로 원인을 하나로 확정하지 않고 조건이 같은 비교 자료를 찾습니다.",
    "rubric": {
      "required": [
        "온도와 압력 정보",
        "기체 출입/경계 등 비교 조건",
        "사진만으로 단일 원인 단정 못함"
      ],
      "pass": "자료와 근거·표현의 타당성을 교사와 확인"
    }
  },
  "explanation": "사진에는 봉지가 부푼 모습만 보여요. 전후의 온도와 바깥 압력, 공기가 드나들었는지 등을 더 알아봐야 어떤 조건 때문에 달라졌는지 설명할 수 있어요.",
  "evidence": {
    "checkedBy": "현행 기준·자료/조건·응답 계약 검수",
    "date": "2026-10-18",
    "gates": [
      "science",
      "answer"
    ]
  },
  "contentVersion": "20261106-gas-readable-workbook",
  "previousVersions": [
    {
      "id": "c22-s42-u03-b42",
      "status": "authored",
      "sourceRef": {
        "type": "authored-supplement",
        "edition": "2022 개정 현행 범위 보충",
        "note": "원문 짝이 없는 독립 창작. 제시 수치/기록은 연습 자료이며 실제 학생 측정/제작/소통 증거가 아님."
      },
      "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 4,
        "semester": 2,
        "unit": "u03",
        "area": "물질",
        "element": "E3",
        "type": "T07",
        "format": "서술형",
        "level": "기본",
        "track": "교과",
        "topic": "생활 속 온도·압력 변화 구별",
        "concept": "생활 속 온도·압력 변화 구별",
        "inquirySkill": "생활 속 온도·압력 변화 구별",
        "standard": "4과15-02"
      },
      "prompt": "사진에서 봉지가 부푼 것만 보았습니다. 온도 변화 때문인지 압력 변화 때문인지 설명하려면 어떤 정보가 더 필요한가요?",
      "givens": null,
      "choices": null,
      "visualModel": null,
      "variantRules": null,
      "responseContract": "written-explanation",
      "answerContract": {
        "type": "written-explanation",
        "sample": "앞뒤 온도와 바깥 압력, 기체 출입과 봉지가 부풀 수 있는 상태 등을 확인합니다. 사진만으로 원인을 하나로 확정하지 않고 조건이 같은 비교 자료를 찾습니다.",
        "rubric": {
          "required": [
            "온도와 압력 정보",
            "기체 출입/경계 등 비교 조건",
            "사진만으로 단일 원인 단정 못함"
          ],
          "pass": "자료와 근거·표현의 타당성을 교사와 확인"
        }
      },
      "explanation": "한 장의 결과 사진과 원인에 대한 증거를 구별합니다.",
      "evidence": {
        "checkedBy": "현행 기준·자료/조건·응답 계약 검수",
        "date": "2026-10-18",
        "gates": [
          "science",
          "answer"
        ]
      },
      "version": 1
    }
  ]
};
const workbookPrior={
  "id": "c22-s42-u03-w037",
  "no": 37,
  "form": "written",
  "topic": "사진과 원인",
  "prompt": "봉지가 부푼 사진 한 장만 보고 온도 때문이라고 말하기 어려운 까닭을 써요.",
  "answer": "봉지 안의 공기 양이나 공기 출입, 바깥 압력이 달라졌는지 알 수 없어요. 사진만으로는 온도 때문이라고 정하기 어려워요.",
  "explanation": "사진 한 장은 부푼 모습만 보여 줘요. 전후 온도·바깥 압력·공기 출입 등 어떤 조건이 달랐는지 모르므로 온도 하나의 영향이라고 정할 수 없어요. 원인을 나누려면 다른 조건을 맞춘 비교 자료를 확인해요.",
  "misconception": "부푼 결과만 보고 사진에 없는 온도 변화나 공기 출입을 지어내지 않았나요?",
  "criteria": "사진만으로는 어떤 조건이 달라졌는지 알 수 없다는 까닭을 설명하면 인정해요. 공기의 양이나 출입, 바깥 압력처럼 더 확인할 조건을 들어도 돼요.",
  "lines": 3,
  "status": "authored",
  "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재",
    "course": "초등4-2"
  },
  "taxonomy": {
    "standard": "4과15-02",
    "topic": "사진과 원인",
    "inquirySkill": "조건과 자료를 연결한 설명·설계"
  },
  "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
      "사진만으로는 어떤 조건이 달라졌는지 알 수 없다는 까닭을 설명하면 인정해요. 공기의 양이나 출입, 바깥 압력처럼 더 확인할 조건을 들어도 돼요."
    ]
  }
};
const fields={
  "figure": "assets/book/c22-s42-u03-air-packing-yalaman2002.jpg",
  "figureNote": "하늘색 바탕에서 물건을 감싸고 있는 부푼 투명 비닐 주머니와 포장재",
  "photoLabels": [
    "물건을 감싼 비닐 주머니의 부푼 모습을 살펴보아요."
  ],
  "photoCredit": "사진: Yalaman2002 · Wikimedia Commons · Public domain"
};
const figureKey="gasPhotoQuestion37";
const figureHtml="<figure class=\"ed-photo\"><img src=\"../assets/book/c22-s42-u03-air-packing-yalaman2002.jpg\" alt=\"하늘색 바탕에서 물건을 감싸고 있는 부푼 투명 비닐 주머니와 포장재\" style=\"max-height:48mm;object-fit:contain\"><figcaption>물건을 감싼 비닐 주머니의 부푼 모습을 살펴보아요.</figcaption><small class=\"ed-photo-credit\">사진: Yalaman2002 · <a href=\"https://commons.wikimedia.org/wiki/File:Airbag-packing_2009-6-15.jpg\" target=\"_blank\" rel=\"noopener noreferrer\">사진 출처</a> · Public domain</small></figure>";
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),clone=x=>JSON.parse(JSON.stringify(x)),cache=new WeakMap();
export function gasPhotoItems(rows,unit){
 if(unit!=='c22-s42-u03'||!Array.isArray(rows))return rows;
 let changed=false;const next=rows.map(q=>{
  if(!same(q,prior))return q;changed=true;if(cache.has(q))return cache.get(q);
  const current={...q,...clone(fields),contentVersion:GAS_PHOTO_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};cache.set(q,current);return current;
 });return changed?next:rows;
}
export function withGasPhotoWorkbook(workbook){
 if(workbook?.unit!=='c22-s42-u03'||!Array.isArray(workbook.questions)||!same(workbook.questions.find(q=>q.id===workbookPrior.id),workbookPrior)||!workbook.figures||Object.hasOwn(workbook.figures,figureKey))return workbook;
 return{...workbook,questions:workbook.questions.map(q=>q.id===workbookPrior.id?{...q,figure:figureKey}:q),figures:{...workbook.figures,[figureKey]:figureHtml}};
}
