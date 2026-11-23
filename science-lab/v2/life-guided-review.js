// Supported short answers and picture labels; actual observations remain separate.
export const LIFE_GUIDED_VERSION='20261124-life-guided-tasks';
const unit='s31-u04',prior='5c6d66e0ddf26dda';
const review={
  "35": {
    "prompt": "자료의 소·고양이·토끼가 새끼를 기르는 공통된 방법을 짧게 써 보세요.",
    "answer": "새끼에게 젖을 먹여 길러요.",
    "required": [
      "세 동물이 모두 새끼에게 젖을 먹여 기른다는 공통점"
    ],
    "explanation": "세 기록에는 새끼가 어미의 젖을 먹는 모습이 나와요. 젖을 먹여 기른다는 짧은 답이면 돼요. 이 세 동물의 공통점이며 모든 동물에게 같은 방법을 적용하지 않아요.",
    "misconception": "자료에 나온 세 동물의 기록에서 같은 점을 찾아요.",
    "lines": 1,
    "bankId": "s31-u04-v005",
    "before": "70852f61ba826e77",
    "bankBefore": [
      "209d514ee623e3d4"
    ]
  },
  "36": {
    "prompt": "‘알→애벌레→번데기→성충’과 ‘알→애벌레→성충’을 나누는 기준을 짧게 써 보세요.",
    "answer": "번데기 단계를 거치는지로 나누어요.",
    "required": [
      "번데기 단계를 거치는지의 차이"
    ],
    "explanation": "한 과정에는 번데기 단계가 있고 다른 과정에는 없어요. 번데기를 거치는지라는 기준을 짧게 쓰면 돼요.",
    "misconception": "두 과정에서 서로 다른 단계 한 곳을 찾아요.",
    "lines": 1,
    "bankId": "s31-u04-v025",
    "before": "3194d3798af7f3d7",
    "bankBefore": [
      "4219e420d9d8e76a"
    ]
  },
  "37": {
    "prompt": "물의 영향만 비교할 두 화분을 표에서 찾아보세요.",
    "parts": [
      "(1) 비교할 두 화분의 기호를 쓰세요.",
      "(2) 두 화분에서 물과 햇빛 중 어떤 조건이 다른가요?"
    ],
    "answer": "(1) ㉠과 ㉡ (2) 물",
    "required": [
      "㉠과 ㉡을 고른 답",
      "두 화분에서 물 조건만 다르다는 답"
    ],
    "explanation": "㉠과 ㉡은 햇빛은 같고 물 조건만 달라요. 물의 영향만 비교할 수 있는 두 화분이에요. ㉡과 ㉢은 물과 햇빛이 함께 달라요.",
    "misconception": "비교할 두 화분의 물과 햇빛을 각각 살펴요.",
    "lines": 2,
    "bankId": "s31-u04-v034",
    "before": "52cba2524bf3a730",
    "bankBefore": [
      "1d81bd573a00fa29"
    ]
  },
  "38": {
    "prompt": "표를 보고 강낭콩 씨앗이 싹트는 조건을 찾아보세요.",
    "parts": [
      "(1) 싹이 가장 많이 튼 접시의 기호를 쓰세요.",
      "(2) 싹트는 데 필요한 조건 두 가지를 쓰세요."
    ],
    "answer": "(1) ㉢ (2) 알맞은 물과 온도",
    "required": [
      "싹이 가장 많이 튼 접시 ㉢",
      "알맞은 물과 온도 두 조건"
    ],
    "explanation": "표에서는 물에 적신 솜을 실내에 둔 ㉢에서 8개가 싹텄어요. 강낭콩 씨앗이 싹트는 데 알맞은 물과 온도가 필요해요. 이 수는 비교를 위한 예이며 직접 기를 때는 실제로 센 수를 따로 기록해요.",
    "misconception": "싹트기와 싹튼 뒤의 자람을 나누어 생각해요.",
    "lines": 2,
    "bankId": "s31-u04-v035",
    "givenLabel": [
      "표(모형 값)",
      "표(예시)"
    ],
    "before": "5c66ff9f855155f9",
    "bankBefore": [
      "408c2a12e5bcc328"
    ]
  },
  "39": {
    "prompt": "싹튼 강낭콩의 자람에 햇빛이 어떤 영향을 주는지 알아보려고 해요.",
    "parts": [
      "(1) 다르게 할 조건 한 가지를 쓰세요.",
      "(2) 같게 할 조건 한 가지를 쓰세요."
    ],
    "answer": "(1) 햇빛 (2) 주는 물의 양",
    "required": [
      "햇빛을 다르게 하는 조건",
      "물·식물의 종류나 처음 크기·화분·흙 등 같게 할 조건 한 가지"
    ],
    "explanation": "햇빛만 다르게 하고 다른 조건은 같게 해요. 같게 할 것은 주는 물의 양이나 시기, 식물의 종류와 처음 크기, 화분이나 흙 중 알맞은 한 가지를 쓰면 돼요.",
    "misconception": "알아보려는 햇빛까지 같게 하거나 여러 조건을 함께 바꾸지 않아요.",
    "lines": 2,
    "bankId": "s31-u04-v039",
    "before": "c2d03a8edae2db34",
    "bankBefore": [
      "db066ccc1f672eb2"
    ]
  },
  "40": {
    "prompt": "물과 온도를 함께 다르게 하면 물의 영향만 알기 어려워요. 그 까닭을 한 문장으로 써 보세요.",
    "answer": "물과 온도 중 무엇 때문에 결과가 달라졌는지 구별하기 어려워요.",
    "required": [
      "함께 달라진 두 조건 중 어느 것의 영향인지 구별하기 어렵다는 까닭"
    ],
    "explanation": "결과가 물 때문에 달라졌는지 온도 때문에 달라졌는지 구별하기 어려워요. 물의 영향만 알아보려면 온도는 같게 하고 물 조건만 다르게 해요.",
    "misconception": "결과가 다르다는 것만으로 물 때문이라고 정하지 않아요.",
    "lines": 1,
    "bankId": "s31-u04-b64",
    "before": "d8fdf99fa6754ffd",
    "bankBefore": [
      "703130e6ce91b0f8"
    ]
  },
  "63": {
    "prompt": "표의 두 묶음에서 물의 영향만 알아보려고 해요.",
    "parts": [
      "(1) 지금 서로 다른 조건 두 가지는 무엇인가요?",
      "(2) 물 외에 어떤 조건을 같게 고쳐야 하나요?"
    ],
    "answer": "(1) 물과 온도 (2) 온도",
    "required": [
      "현재 물과 온도가 모두 다르다는 답",
      "온도를 같게 고치는 방법"
    ],
    "explanation": "지금은 물과 온도가 함께 달라 물의 영향만 알기 어려워요. 온도를 같게 하고 물 조건만 다르게 비교해요. 다른 씨앗의 종류·상태·수와 용기·기간도 같게 둬요.",
    "misconception": "표의 두 온도가 다른데 같은 온도라고 읽지 않아요.",
    "lines": 2,
    "before": "65b0dbe693876a4c"
  },
  "64": {
    "prompt": "‘나’는 그날 관찰하지 못했어요. 빈 기록을 어떻게 다룰지 생각해 보세요.",
    "parts": [
      "(1) 빈칸을 0개라고 써도 될까요?",
      "(2) 다음 관찰에서는 무엇을 세어 기록할까요?"
    ],
    "answer": "(1) 안 돼요. (2) 새로 관찰한 날의 싹튼 씨앗 수",
    "required": [
      "관찰하지 못한 날을 0개라고 쓰면 안 된다는 답",
      "다음에 실제로 관찰한 날의 싹튼 수를 세어 새 기록으로 남기는 방법"
    ],
    "explanation": "0개는 직접 세어 보니 없었다는 뜻이에요. 그날 보지 못했다면 실제 수는 몰라요. 그 빈칸은 관찰하지 못한 기록으로 두고, 다음에 센 수는 새 관찰 날짜에 기록해요. 나중에 센 수를 지난 날짜의 빈칸에 옮겨 쓰지 않아요.",
    "misconception": "확인하지 못한 날의 수를 0개나 나중에 센 수로 채우지 않아요.",
    "lines": 2,
    "before": "618b7c5307d19581"
  },
  "75": {
    "prompt": "사진의 (가)와 (나) 중 하나를 골라 보이는 모습을 간단히 그리세요. 단계 이름과 눈에 보이는 특징 한 곳을 짧은 이름표로 나타내세요.",
    "answer": "(가)를 고르면 번데기, (나)를 고르면 애벌레의 보이는 몸 모양을 그리고 단계 이름과 특징에 이름표를 붙인다.",
    "required": [
      "고른 사진에 맞는 몸 모습과 단계 이름",
      "사진에서 보이는 특징 한 곳의 이름표"
    ],
    "explanation": "(가)는 번데기, (나)는 애벌레예요. 사진의 몸 모양을 간단히 그리고 이름표로 답해요. 촬영 날짜나 같은 개체인지까지 사진만으로 알아냈다고 쓰지 않아요. 긴 판단 이유나 모르는 점 목록을 덧붙일 필요는 없어요.",
    "misconception": "사진에 없는 날개나 촬영 날짜를 지어 넣지 않아요.",
    "drawingExplanationLines": 0,
    "before": "58da80ca9d4ed61c"
  },
  "76": {
    "prompt": "같은 종류의 강낭콩 씨앗을 묶음마다 5개씩 놓을 계획이에요. 물의 영향만 비교하도록 두 묶음을 두 칸에 그리세요. 물과 온도를 어떻게 할지 이름표를 붙이세요. 씨앗 수는 숫자로 써도 좋아요.",
    "answer": "두 묶음에 씨앗을 각각 5개 놓고 물 조건은 다르게, 온도는 같게 한 모습을 그림과 이름표로 나타낸다.",
    "required": [
      "같은 종류의 씨앗을 두 묶음에 각각 5개씩 놓은 그림이나 수 표시",
      "물은 다르게 하고 온도는 같게 한 이름표"
    ],
    "explanation": "한 묶음은 마른 솜, 다른 묶음은 알맞게 적신 솜처럼 물 조건만 다르게 해요. 온도는 같게 표시해요. 실제로 비교할 때는 씨앗의 상태와 수, 용기와 관찰 기간도 같게 두고 같은 날짜에 싹튼 수를 세어요. 이 문제에서는 관찰 계획을 장문으로 덧붙이지 않아요.",
    "misconception": "물과 함께 온도까지 다르게 표시하지 않아요.",
    "drawingPanels": 2,
    "drawingExplanationLines": 0,
    "before": "c468efe367da3abd"
  },
  "77": {
    "prompt": "자료의 가와 나를 두 칸에 그리세요. 줄기의 길이와 굵기, 잎 색을 짧은 이름표로 나타내세요.",
    "answer": "가: 12 cm·비교적 굵은 줄기·초록색 잎 / 나: 17 cm·가는 줄기·옅은 잎색을 그림과 이름표로 나타낸다.",
    "required": [
      "가의 12 cm·비교적 굵은 줄기·초록색 잎을 나타낸 그림과 이름표",
      "나의 17 cm·가는 줄기·옅은 잎색을 나타낸 그림과 이름표"
    ],
    "explanation": "자료의 길이와 줄기 굵기, 잎 색을 각각 표시해요. 나는 더 길지만 줄기가 가늘고 잎색이 옅어요. 키만으로 튼튼함을 정하지 않으며 이 생각은 짝에게 말해 보아도 좋아요. 긴 까닭을 그림 옆에 다시 쓰게 하지는 않아요.",
    "misconception": "나가 더 길다는 이유로 잎과 줄기 상태까지 모두 좋게 그리지 않아요.",
    "drawingPanels": 2,
    "drawingExplanationLines": 0,
    "before": "2865a3ec308d2b16"
  },
  "78": {
    "prompt": "같은 식물 A가 이듬해에도 자라는 모습과, A의 씨앗에서 새 식물 B가 자라는 모습을 두 칸에 그리세요. A와 B를 표시하세요.",
    "answer": "한 칸에는 같은 식물 A가 계속 자라는 모습, 다른 칸에는 A의 씨앗에서 새로운 식물 B가 자라는 모습을 그리고 A/B로 구별한다.",
    "required": [
      "같은 식물 A가 이듬해에도 이어서 자라는 그림",
      "A의 씨앗에서 새로운 식물 B가 자라는 그림과 A/B 표시"
    ],
    "explanation": "처음의 식물이 계속 살아 있는 것과 그 식물의 씨앗에서 새 식물이 자라는 것을 나누어 나타내요. A와 B 표시로 답하면 돼요. 같은 장소에 자란다는 이유만으로 같은 식물이라고 정하지 않아요.",
    "misconception": "새 씨앗에서 자란 B를 처음의 식물 A로 표시하지 않아요.",
    "drawingPanels": 2,
    "drawingExplanationLines": 0,
    "before": "8ca6ba583380184a"
  },
  "79": {
    "prompt": "배추흰나비 애벌레를 돌볼 사육 상자를 그리세요. 먹이 잎과 통풍되는 덮개, 두는 장소를 짧은 이름표로 나타내세요.",
    "answer": "농약이 묻지 않은 신선한 배춧잎이나 케일 잎, 통풍되는 덮개, 직사광선과 충격을 피할 장소를 이름표로 나타낸다.",
    "required": [
      "알맞은 신선한 먹이 잎과 통풍되는 덮개의 표시",
      "직사광선과 충격을 피할 장소 표시"
    ],
    "explanation": "배추흰나비 애벌레에게 알맞은 먹이 잎과 공기가 통하는 덮개를 준비해요. 직사광선과 충격을 피할 곳에 두어요. 각 부분의 까닭은 짝에게 말해 보고 그림에는 짧은 이름표를 붙이면 돼요.",
    "misconception": "통풍구 없이 밀폐하거나 애벌레를 자꾸 건드리는 환경으로 그리지 않아요.",
    "drawingExplanationLines": 0,
    "before": "1ade9054bc781672"
  },
  "80": {
    "prompt": "배추흰나비의 한살이를 소개할 자료를 그리세요. 네 단계의 이름을 순서대로 놓고 화살표로 이으세요. 기억에 남는 변화 한 곳에 ★표 하세요.",
    "answer": "알→애벌레→번데기→성충을 순서대로 배치하고, 성충에서 날개가 뚜렷이 보이는 변화 등 한 곳에 ★표 한다.",
    "required": [
      "알·애벌레·번데기·성충 네 단계를 순서대로 이은 자료",
      "한살이에서 살펴본 변화 한 곳의 ★표"
    ],
    "explanation": "네 단계의 이름과 순서를 그림이나 카드로 나타내요. ★표 한 변화를 짝에게 소개해 보세요. 직접 관찰한 기록을 더 넣는다면 실제 날짜와 모습을 쓰고, 참고 자료는 내 관찰과 구별해요. 자료를 만들었다는 이유만으로 여러 날 실제 관찰이나 친구와의 공유까지 끝났다고 보지는 않아요.",
    "misconception": "같은 성충이 알로 되돌아간다고 나타내지 않아요. 성충이 낳은 알은 새로운 생물로 자라요.",
    "drawingExplanationLines": 0,
    "before": "e9c1a8f73d0bf66d"
  }
};
const clone=x=>JSON.parse(JSON.stringify(x));
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const bankCache=new WeakMap(),bookCache=new WeakMap();
const contract=(old,e)=>({...old,sample:e.answer,reviewRequired:true,rubric:{...old.rubric,required:[...e.required],pass:'뜻이 같은 짧은 답과 알맞은 다른 예도 교사가 확인해요.'}});
const givensFor=(old,e)=>e.givenLabel?Object.fromEntries(Object.entries(old).map(([key,value])=>[key===e.givenLabel[0]?e.givenLabel[1]:key,value])):old;
export function lifeGuidedItems(rows,u){
 if(u!==unit||!rows?.length)return rows;let changed=false;
 const next=rows.map(q=>{const e=Object.values(review).find(e=>e.bankId===q.id);if(!e||q.status!=='authored'||q.sourceRef?.type==='original'||!e.bankBefore.includes(fingerprint(q)))return q;changed=true;if(bankCache.has(q))return bankCache.get(q);
  const result={...q,prompt:[e.prompt,...(e.parts||[])].join('\n'),givens:givensFor(q.givens,e),answerContract:contract(q.answerContract,e),explanation:e.explanation,misconception:e.misconception,lifeGuidedResponse:LIFE_GUIDED_VERSION,contentVersion:LIFE_GUIDED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};bankCache.set(q,result);return result;
 });return changed?next:rows;
}
export function withLifeGuidedClassroom(u,mod){const items=lifeGuidedItems(mod?.classroomItems,u);return items===mod?.classroomItems?mod:{...mod,classroomItems:items};}
const cues={
 '이번 단원에서 직접 관찰할 변화 하나와 조건을 비교할 질문 하나를 적어요.':'사진에서 눈에 띄는 자라는 모습을 짚어 보아요.',
 '날짜가 다른 두 기록에서 그대로인 특징과 달라진 특징을 하나씩 찾아요.':'날짜별 기록에서 달라진 모습 한 곳을 짚어 보아요.',
 '두 곤충의 단계에서 공통점과 차이점을 찾고, 다음 세대가 시작되는 곳을 표시해요.':'두 곤충의 단계에서 번데기가 있는지 짚어 보아요.',
 '처음 관찰한 식물이 계속 살아 있는 경우와 씨앗에서 새 식물이 자라는 경우를 자료에서 어떻게 구별할 수 있는지 적으세요.':'처음의 식물과 새 씨앗에서 자란 식물을 자료에서 구별해 짚어 보아요.',
 '내 질문이 씨앗이 싹트는 때에 대한 것인지, 싹튼 뒤 자라는 때에 대한 것인지 쓰세요. 어떤 조건을 비교할지도 정하세요.':'씨앗이 싹트는 때와 싹튼 뒤 자라는 때를 사진이나 설명에서 구별해 보아요.',
 '물 비교 계획에서 다르게 할 것 하나, 같게 할 것 두 가지, 관찰할 결과를 적어요.':'물의 영향만 비교할 때 같게 할 조건을 표에서 짚어 보아요.',
 '알아보려는 조건만 다르게 하고 다른 조건은 같게 하려고 해요. 실험 계획에서 어느 부분을 고쳐야 할지 쓰세요.':'물의 영향만 알아보려면 어떤 조건을 같게 고칠지 말해 보아요.',
 '온도를 비교할 때 같게 할 조건을 적으세요. 직접 세어 0개였던 날과 관찰하지 못한 날은 어떻게 다르게 설명할 수 있나요?':'0개인 기록과 관찰하지 못한 기록을 구별해 짝에게 말해 보아요.',
 '두 화분의 자람을 비교할 특징 두 가지와 햇빛 외에 같게 둘 조건을 적어요.':'두 화분의 줄기와 잎 색을 함께 짚어 보아요.',
 '내 소개 자료에서 보여 줄 기록 하나와 친구에게 물어볼 질문 한 가지를 고르세요.':'내 자료에서 소개하고 싶은 변화 한 곳을 짚어 말해 보아요.'
};
export function withLifeGuidedWorkbook(w){
 if(w?.unit!==unit||fingerprint(w)!==prior)return w;if(bookCache.has(w))return bookCache.get(w);
 const questions=w.questions.map(q=>{const e=review[q.no];if(!e||fingerprint(q)!==e.before)return q;const fields={prompt:e.prompt,answer:e.answer,criteria:e.required.join(' / '),explanation:e.explanation,misconception:e.misconception,lifeGuidedResponse:LIFE_GUIDED_VERSION};
  for(const k of['lines','drawingPanels','drawingExplanationLines'])if(Object.hasOwn(e,k))fields[k]=e[k];if(e.parts){fields.parts=[...e.parts];fields.answerPerPart=true;}if(e.bankId){fields.sourceContract=contract(q.sourceContract,e);fields.sourceExplanation=e.explanation;if(e.givenLabel)fields.sourceGivens=givensFor(q.sourceGivens,e);}return{...q,...fields};
 });
 const pages=w.pages.map((p,i)=>({...p,blocks:p.blocks.flatMap(b=>i===0&&b.type==='field'&&b.title==='워밍업'?[{type:'heading',text:'워밍업'},{type:'text',text:'사진에서 자란 모습을 짚어 보세요. 생물이 자라는 모습을 본 경험을 말해도 좋아요.'}]:i>=10&&b.type==='field'&&['자료로 설명하기','선택한/선택하지 않은 근거'].includes(b.title)?[{type:'text',text:'내가 고른 답의 근거를 표나 설명에서 짚어 보아요.'}]:[b]),rail:p.rail.map(n=>{if(!n.write||!Object.hasOwn(cues,n.text))return n;const{write,...note}=n;return{...note,text:cues[n.text]};})}));
 const teacherPages=Array.from({length:Math.ceil(questions.length/3)},(_,i)=>({...w.teacherPages[0],section:`정답·해설 ${i*3+1}~${Math.min(i*3+3,questions.length)}`,blocks:[{type:'solutions',ids:questions.slice(i*3,i*3+3).map(q=>q.id)}]}));
 const keys=new Map(['quick-1','quick-41'].flatMap(key=>[...w.figures[key].matchAll(/<tr><th scope="row">(\d+)<\/th><td>([\s\S]*?)<\/td><\/tr>/g)].map(m=>[Number(m[1]),m[2]])));
 const labels={choice:'객관식',multi:'복수 선택',short:'단답',blank:'빈칸',written:'서술',draw:'그림으로 나타내기',match:'연결',order:'순서'};
 const quickPages=Array.from({length:5},(_,i)=>({section:'빠른 정답표',title:`${i*17+1}~${Math.min(i*17+17,80)}번`,kind:'quick',blocks:[{type:'table',heads:['번호','형식','정답'],rows:questions.slice(i*17,i*17+17).map(q=>[String(q.no),labels[q.form],['written','draw'].includes(q.form)?'교사 확인':keys.get(q.no)])}],rail:[{title:'확인할 때',text:'짧은 설명과 그림은 해설의 예시 답과 인정 기준을 함께 살펴요.'},{title:'다시 풀기',text:'다시 살펴볼 문제를 고르고 해당 개념 쪽으로 돌아가요.'}]}));
 const result={...w,questions,pages,teacherStudentPages:pages,teacherPages,quickPages};bookCache.set(w,result);return result;
}
