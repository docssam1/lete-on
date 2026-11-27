// Keep fossil explanations and model drawings; use brief answers for size criteria and sequence.
export const GEOLOGY_MIXED_VERSION='20261124-geology-mixed-responses';
const unit='c22-s51-u01',prior='d62e1a90c049e8ae';
const review={
  "21": {
    "prompt": "사진으로 지층의 실제 두께를 알아보려 해요. 사진에 더 있어야 할 정보를 고르세요.",
    "choices": [
      "사진을 확대해 인쇄한 종이의 크기",
      "실제 길이를 알려 주는 자나 눈금",
      "사진 속 지층을 비추는 빛의 밝기"
    ],
    "key": 1,
    "answer": "②",
    "explanation": "사진에 자나 눈금처럼 실제 길이를 알려 주는 표시가 있어야 두께를 비교할 수 있어요. 사진이 크게 인쇄되었다는 것만으로 실제 지층의 두께를 알 수는 없어요.",
    "misconception": "사진에서 크게 보이는 것과 실제로 두꺼운 것을 구별해요.",
    "form": "choice",
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "26dc2fbb56272c75"
  },
  "22": {
    "prompt": "진흙 → 모래 → 자갈 순서로 한 종류씩 쌓고 뒤집거나 깎지 않았어요. 맨 아래 재료는 (1)[ ]이에요.",
    "answer": "진흙",
    "explanation": "뒤집거나 깎지 않고 차례로 쌓았으므로 처음 넣은 진흙이 맨 아래에 있어요.",
    "misconception": "차례로 쌓은 모형에서 먼저 넣은 재료와 아래층을 연결해요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "진흙"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "df9fc96edd981380"
  },
  "42": {
    "prompt": "이암·사암·역암을 나눌 때에는 암석을 이루는 (1)[ ]의 크기를 비교해요. 보기: 알갱이·암석 전체",
    "answer": "알갱이",
    "explanation": "매우 작은 진흙 알갱이가 중심인 이암, 모래 크기 알갱이가 중심인 사암, 자갈 크기가 뚜렷한 역암을 같은 기준으로 나누어요.",
    "misconception": "암석 전체의 크기나 색과 암석을 이루는 알갱이의 크기를 구별해요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "알갱이",
            "암석 알갱이",
            "암석을 이루는 알갱이",
            "구성 알갱이"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "fd4344a2cae3a00c"
  },
  "49": {
    "prompt": "붉은색이라는 것만으로 사암이라고 정하기는 어려워요. 사암인지 알아보려면 무엇을 살펴야 할까요?",
    "choices": [
      "붉은색이 얼마나 진한지",
      "들고 있는 암석 전체가 얼마나 큰지",
      "모래 크기의 알갱이가 보이는지"
    ],
    "key": 2,
    "answer": "③",
    "explanation": "사암은 모래 크기의 알갱이로 이루어진 퇴적암이에요. 암석의 색이나 표본 전체의 크기만으로 정하지 않아요.",
    "misconception": "퇴적암을 나눌 때 암석을 이루는 알갱이의 크기를 살펴요.",
    "form": "choice",
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "d33ef38f529e7241"
  }
};
const bankReview={
  "c22-s51-u01-b016": {
    "prompt": "지층 사진에서 가려져 보이지 않는 곳이 있어요. 그곳을 어떻게 기록하면 좋을까요?",
    "choices": [
      "가려져 확인하지 못한 부분이라고 표시한다.",
      "바로 옆 층과 같은 모양으로 이어 그린다.",
      "아무 층도 없는 빈 곳이라고 기록한다."
    ],
    "key": 0,
    "answer": "①",
    "explanation": "사진에서 확인하지 못한 곳은 확인하지 못했다고 표시해요. 가려져 보이지 않는다는 사실만으로 층의 모양이나 층이 없음을 정할 수 없어요.",
    "misconception": "확인하지 못한 부분을 주변과 같거나 층이 없는 곳으로 단정하지 않아요.",
    "form": "choice",
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "32a4e653c233d845"
    ]
  },
  "c22-s51-u01-b048": {
    "prompt": "두 모둠이 서로 다르게 확대한 사진으로 알갱이를 비교했어요. 알맞은 비교 방법을 고르세요.",
    "choices": [
      "더 크게 확대한 사진의 알갱이를 큰 것으로 나눈다.",
      "사진을 확대한 정도를 확인하고 같은 크기 기준으로 비교한다.",
      "사진에서 암석이 차지하는 면적으로 알갱이를 비교한다."
    ],
    "key": 1,
    "answer": "②",
    "explanation": "같은 알갱이도 사진을 크게 확대하면 더 크게 보여요. 사진을 확대한 정도나 자·눈금 같은 실제 크기 기준을 확인해 비교해요.",
    "misconception": "사진에서 보이는 크기를 실제 알갱이의 크기로 바로 판단하지 않아요.",
    "form": "choice",
    "required": [
      "알맞은 설명 고르기"
    ],
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "9bc159106bc7fb02"
    ]
  },
  "c22-s51-u01-b056": {
    "prompt": "이암·사암·역암을 나눌 때에는 암석을 이루는 (1)[ ]의 크기를 비교해요. 보기: 알갱이·암석 전체",
    "answer": "알갱이",
    "explanation": "매우 작은 진흙 알갱이가 중심인 이암, 모래 크기 알갱이가 중심인 사암, 자갈 크기가 뚜렷한 역암을 같은 기준으로 나누어요.",
    "misconception": "암석 전체의 크기나 색과 암석을 이루는 알갱이의 크기를 구별해요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "알갱이",
            "암석 알갱이",
            "암석을 이루는 알갱이",
            "구성 알갱이"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "eb42c942c78ce7f8"
    ]
  }
};
const clone=x=>JSON.parse(JSON.stringify(x));
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const banks=new WeakMap(),books=new WeakMap(),labels={choice:'객관식',blank:'빈칸 넣기',short:'단답형',written:'까닭 설명',draw:'그림 설명'};
const response=e=>e.contract?clone(e.contract):{kind:Object.hasOwn(e,'drawingExplanationLines')?'drawing':'written-explanation',teacherRequired:true,actualPerformanceMustNotBeInferred:true,sample:e.answer,required:[...e.required]};
function answerContract(e){const c=response(e);return{type:e.form==='choice'?'single-choice':e.contract?'short-text':'written-explanation',...(e.form==='choice'?{answer:e.key,accepted:[e.key]}:e.contract?{answer:e.answer,accepted:c.accepted||[e.answer],inputHint:c.parts?'빈칸의 답을 쉼표로 나누어 차례대로 써요.':'짧은 낱말로 답해요.'}:{sample:e.answer,teacherRequired:true,reviewRequired:true,rubric:{required:[...e.required],pass:'뜻이 같은 짧은 답과 알맞은 이름표는 교사가 확인해요.'}}),seasonContract:c};}
export function geologyMixedItems(rows,u){
 if(u!==unit||!rows?.length)return rows;let changed=false;
 const next=rows.map(q=>{const e=bankReview[q.id];if(!e||q.status!=='authored'||q.sourceRef?.type!=='authored-supplement'||!e.before.includes(fingerprint(q)))return q;changed=true;if(banks.has(q))return banks.get(q);
 const result={...q,prompt:e.prompt,explanation:e.explanation,misconception:e.misconception,responseContract:response(e),answerContract:answerContract(e),...(q.diagnosticOverride?{diagnosticOverride:{...q.diagnosticOverride,version:GEOLOGY_MIXED_VERSION}}:{}),...(e.form?{bookResponseForm:e.form,taxonomy:{...q.taxonomy,format:labels[e.form]},choices:e.choices?clone(e.choices):null,diagnosticOverride:{version:GEOLOGY_MIXED_VERSION,distractors:null,typed:null,cloze:null,cells:null}}:{}),geologyMixedResponse:GEOLOGY_MIXED_VERSION,contentVersion:GEOLOGY_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};banks.set(q,result);return result;});return changed?next:rows;
}
export function withGeologyMixedClassroom(u,mod){if(u!==unit)return mod;const classroomItems=geologyMixedItems(mod?.classroomItems,u);return classroomItems===mod.classroomItems?mod:{...mod,classroomItems};}
export function withGeologyMixedWorkbook(w){
 if(w?.unit!==unit||fingerprint(w)!==prior)return w;if(books.has(w))return books.get(w);
 const questions=w.questions.map(q=>{const e=review[q.no];if(!e||fingerprint(q)!==e.before)return q;
 const result={...q,prompt:e.prompt,answer:e.answer,explanation:e.explanation,misconception:e.misconception,form:e.form,formLabel:labels[e.form],bookResponseForm:e.form,choices:e.choices?clone(e.choices):null,requirements:[...e.required],criteria:e.required.join(' / '),responseContract:response(e),geologyMixedResponse:GEOLOGY_MIXED_VERSION,contentVersion:GEOLOGY_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};delete result.lines;if(Object.hasOwn(e,'key'))result.key=e.key;
 const linked=bankReview[q.sourceId];if(linked){result.sourceContract=answerContract(linked);result.sourceExplanation=linked.explanation;}
 return result;});
 const figures={...w.figures},byNo=new Map(questions.map(q=>[q.no,q]));for(const key of w.quickPages.flatMap(p=>p.blocks.filter(b=>b.type==='diagram').map(b=>b.key)))figures[key]=figures[key].replace(/(<tr><th scope="row">)(\d+)(<\/th><td>)([\s\S]*?)(<\/td><td>)([\s\S]*?)(<\/td><\/tr>)/g,(row,a,n,b,form,c,answer,d)=>{const q=byNo.get(Number(n));return review[n]||q.form==='choice'?a+n+b+(review[n]?labels[q.form]:form)+c+(q.form==='choice'?(Array.isArray(q.key)?q.key.map(i=>'①②③④⑤'[i]).join(', '):'①②③④⑤'[q.key]):q.form==='written'?'교사 확인':q.answer)+d:row;});
 const notes={
  '화면에서 큰 사진이 실제로 큰 암석이라는 뜻은 아니에요.':'지층의 실제 두께를 알려면 사진에 자나 눈금 같은 기준이 필요해요.',
  '상위 과학의 사진에는 기준 막대나 배율을 표시해 확대된 크기와 실제 크기를 연결해요.':'기준 막대는 실제 길이를 숫자와 선으로 나타낸 것이에요. 사진과 함께 확대하거나 줄여도 실제 크기를 비교할 수 있어요.',
  '실제 크기를 알려 주는 표시를 찾아보세요.':'사진만 보고 지층의 실제 두께를 알 수 있는지 말해 보세요.'
 };
 const amendPage=p=>p.blocks.some(b=>b.ids?.includes('c22-s51-u01-w021'))?{...p,rail:p.rail.map(n=>notes[n.text]?{...n,text:notes[n.text]}:n)}:p;
 const result={...w,questions,figures,pages:w.pages.map(amendPage),teacherStudentPages:w.teacherStudentPages.map(amendPage)};books.set(w,result);return result;
}
