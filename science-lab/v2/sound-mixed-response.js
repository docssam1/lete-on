// Facts use closed responses; vibration, pitch and noise ideas retain one short sentence.
export const SOUND_MIXED_VERSION='20261124-sound-mixed-responses';
const unit='c22-s32-u03',prior='7c6ae0ce1d6a4ec0';
const review={
  "8": {
    "prompt": "북소리가 날 때 북 위의 종잇조각이 움직였어요. 이때 북 가죽의 모습은 어땠을지 짧게 쓰세요.",
    "form": "written",
    "answer": "북 가죽이 떨렸어요.",
    "explanation": "북소리가 날 때 북 위의 종잇조각이 움직였어요. 이 움직임으로 북 가죽의 떨림을 살펴볼 수 있어요.",
    "required": [
      "종잇조각의 움직임을 북 가죽의 떨림과 연결한 답"
    ],
    "misconception": "소리의 크고 작음과 높고 낮음을 나누어 살펴요.",
    "contract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "sample": "북 가죽이 떨렸어요.",
      "required": [
        "종잇조각의 움직임을 북 가죽의 떨림과 연결한 답"
      ]
    },
    "before": "546a4e06d70d18c0"
  },
  "16": {
    "prompt": "소리를 듣기 어려운 친구와 북의 떨림을 살펴보려고 해요. 눈으로 살펴볼 것은 무엇일까요?",
    "form": "choice",
    "answer": "②",
    "explanation": "가벼운 종잇조각이 움직이는 모습을 눈으로 보며 떨림을 살필 수 있어요. 북은 가볍게 치고 불편하면 멈춰요.",
    "required": [
      "종잇조각의 움직임으로 떨림 관찰"
    ],
    "misconception": "소리의 크고 작음과 높고 낮음을 나누어 살펴요.",
    "choices": [
      "북의 색깔",
      "북 위 종잇조각의 움직임",
      "북을 놓은 책상의 크기"
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": 1
    },
    "before": "5c632369f923e3ef"
  },
  "24": {
    "prompt": "같은 북을 약하게 칠 때와 조금 더 세게 칠 때를 비교해요. 빈칸을 채우세요.\n(1) 듣는 자리는 서로 [ ] 해요.\n(2) 들리는 소리의 [ ]를 비교해요.",
    "form": "blank",
    "answer": "(1) 같게 (2) 크기",
    "explanation": "같은 북을 같은 자리에 두고 듣는 자리도 맞추어요. 두드리는 정도만 다르게 하여 소리의 크고 작음을 비교해요. 귀가 불편할 만큼 세게 치지 않아요.",
    "required": [
      "듣는 자리를 같게 하기",
      "소리의 크고 작음 비교"
    ],
    "misconception": "소리의 크고 작음과 높고 낮음을 나누어 살펴요.",
    "contract": {
      "kind": "ordered-term-parts",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "parts": [
        {
          "kind": "short-text",
          "accepted": [
            "같게",
            "똑같게",
            "동일하게"
          ]
        },
        {
          "kind": "short-text",
          "accepted": [
            "크기",
            "세기",
            "크고 작음",
            "크고 작기"
          ]
        }
      ]
    },
    "before": "efad3eab7f3fb1c5"
  },
  "32": {
    "prompt": "표에서 같은 자를 비슷한 세기로 튕겼을 때 더 높은 소리가 난 길이를 찾으세요. 길이: [ ] cm",
    "form": "blank",
    "answer": "8",
    "explanation": "표에서 8 cm는 더 높음, 12 cm는 더 낮음으로 나타나 있어요. 같은 자에서 내민 길이를 비교한 결과예요.",
    "required": [
      "표에서 더 높은 소리가 난8cm 찾기"
    ],
    "misconception": "소리의 크고 작음과 높고 낮음을 나누어 살펴요.",
    "accepted": [
      "8",
      "8 cm",
      "8cm",
      "8센티미터"
    ],
    "contract": {
      "kind": "short-text",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": "8",
      "accepted": [
        "8",
        "8 cm",
        "8cm",
        "8센티미터"
      ]
    },
    "before": "ba3194d8dd258ea2"
  },
  "40": {
    "prompt": "친구가 “높은 소리는 언제나 큰 소리야.”라고 했어요. 높은 음을 작게 부를 때를 생각하여 친구의 말을 짧게 고쳐 보세요.",
    "form": "written",
    "answer": "높은 소리도 작게 낼 수 있어요.",
    "explanation": "높은 음은 그대로 두고 목소리의 크고 작음을 바꾸었으므로 세기가 달라졌어요. 높은 소리도 작게 낼 수 있어요. 귀가 불편할 만큼 크게 내지 않아요.",
    "required": [
      "높은 소리도 작게 낼 수 있다는 답"
    ],
    "misconception": "소리의 크고 작음과 높고 낮음을 나누어 살펴요.",
    "contract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "sample": "높은 소리도 작게 낼 수 있어요.",
      "required": [
        "높은 소리도 작게 낼 수 있다는 답"
      ]
    },
    "before": "4b2e3e17b354eead"
  },
  "48": {
    "prompt": "실 전화기 표에서 말이 더 또렷하게 들린 때를 고르세요.",
    "form": "choice",
    "answer": "①",
    "explanation": "이 표에서는 실을 놓았을 때 말이 더 또렷하게 들렸어요. 직접 비교할 때에는 같은 전화기·목소리 크기·듣는 자리를 맞추고 실의 팽팽함과 연결도 살펴요.",
    "required": [
      "실을 손으로 잡지 않았을 때를 찾기"
    ],
    "misconception": "소리의 크고 작음과 높고 낮음을 나누어 살펴요.",
    "choices": [
      "실을 손으로 잡지 않았을 때",
      "실을 손으로 잡았을 때",
      "두 경우에 똑같이 또렷하게 들렸다."
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": 0
    },
    "before": "3fcad3a34a07d38d"
  },
  "56": {
    "prompt": "친구가 책을 읽을 때 의자 끄는 소리가 불편하다고 했어요. 소음을 줄일 방법 한 가지를 짧게 써 보세요.",
    "form": "written",
    "answer": "의자 다리에 알맞은 덮개를 씌워요.",
    "explanation": "의자 다리에 알맞은 덮개를 씌우거나 안전하게 들어 옮길 수 있어요. 방법을 정한 뒤에는 실제로 소리가 줄었는지와 친구가 덜 불편한지 살펴요.",
    "required": [
      "의자 다리 덮개 등 상황에 맞게 소음을 줄일 방법 한 가지"
    ],
    "misconception": "소리의 크고 작음과 높고 낮음을 나누어 살펴요.",
    "contract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "sample": "의자 다리에 알맞은 덮개를 씌워요.",
      "required": [
        "의자 다리 덮개 등 상황에 맞게 소음을 줄일 방법 한 가지"
      ]
    },
    "before": "14c4caa80e25d906"
  }
};
const bankReview={
  "c22-s32-u03-b08": {
    "prompt": "북소리가 날 때 북 위의 종잇조각이 움직였어요. 이때 북 가죽의 모습은 어땠을지 짧게 쓰세요.",
    "form": "written",
    "answer": "북 가죽이 떨렸어요.",
    "explanation": "북소리가 날 때 북 위의 종잇조각이 움직였어요. 이 움직임으로 북 가죽의 떨림을 살펴볼 수 있어요.",
    "required": [
      "종잇조각의 움직임을 북 가죽의 떨림과 연결한 답"
    ],
    "misconception": "소리의 크고 작음과 높고 낮음을 나누어 살펴요.",
    "contract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "sample": "북 가죽이 떨렸어요.",
      "required": [
        "종잇조각의 움직임을 북 가죽의 떨림과 연결한 답"
      ]
    },
    "before": [
      "00007e820cf29af4",
      "25bc4653a9e15621"
    ]
  },
  "c22-s32-u03-b16": {
    "prompt": "소리를 듣기 어려운 친구와 북의 떨림을 살펴보려고 해요. 눈으로 살펴볼 것은 무엇일까요?",
    "form": "choice",
    "answer": "②",
    "explanation": "가벼운 종잇조각이 움직이는 모습을 눈으로 보며 떨림을 살필 수 있어요. 북은 가볍게 치고 불편하면 멈춰요.",
    "required": [
      "종잇조각의 움직임으로 떨림 관찰"
    ],
    "misconception": "소리의 크고 작음과 높고 낮음을 나누어 살펴요.",
    "choices": [
      "북의 색깔",
      "북 위 종잇조각의 움직임",
      "북을 놓은 책상의 크기"
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": 1
    },
    "before": [
      "74fb57f1091e8aab"
    ]
  },
  "c22-s32-u03-b24": {
    "prompt": "같은 북을 약하게 칠 때와 조금 더 세게 칠 때를 비교해요. 빈칸을 채우세요.\n(1) 듣는 자리는 서로 [ ] 해요.\n(2) 들리는 소리의 [ ]를 비교해요.",
    "form": "blank",
    "answer": "(1) 같게 (2) 크기",
    "explanation": "같은 북을 같은 자리에 두고 듣는 자리도 맞추어요. 두드리는 정도만 다르게 하여 소리의 크고 작음을 비교해요. 귀가 불편할 만큼 세게 치지 않아요.",
    "required": [
      "듣는 자리를 같게 하기",
      "소리의 크고 작음 비교"
    ],
    "misconception": "소리의 크고 작음과 높고 낮음을 나누어 살펴요.",
    "contract": {
      "kind": "ordered-term-parts",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "parts": [
        {
          "kind": "short-text",
          "accepted": [
            "같게",
            "똑같게",
            "동일하게"
          ]
        },
        {
          "kind": "short-text",
          "accepted": [
            "크기",
            "세기",
            "크고 작음",
            "크고 작기"
          ]
        }
      ]
    },
    "before": [
      "00ed52836785b6a1"
    ]
  },
  "c22-s32-u03-b32": {
    "prompt": "표에서 같은 자를 비슷한 세기로 튕겼을 때 더 높은 소리가 난 길이를 찾으세요. 길이: [ ] cm",
    "form": "blank",
    "answer": "8",
    "explanation": "표에서 8 cm는 더 높음, 12 cm는 더 낮음으로 나타나 있어요. 같은 자에서 내민 길이를 비교한 결과예요.",
    "required": [
      "표에서 더 높은 소리가 난8cm 찾기"
    ],
    "misconception": "소리의 크고 작음과 높고 낮음을 나누어 살펴요.",
    "accepted": [
      "8",
      "8 cm",
      "8cm",
      "8센티미터"
    ],
    "contract": {
      "kind": "short-text",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": "8",
      "accepted": [
        "8",
        "8 cm",
        "8cm",
        "8센티미터"
      ]
    },
    "before": [
      "3b06e8bf47854f51"
    ]
  },
  "c22-s32-u03-b40": {
    "prompt": "친구가 “높은 소리는 언제나 큰 소리야.”라고 했어요. 높은 음을 작게 부를 때를 생각하여 친구의 말을 짧게 고쳐 보세요.",
    "form": "written",
    "answer": "높은 소리도 작게 낼 수 있어요.",
    "explanation": "높은 음은 그대로 두고 목소리의 크고 작음을 바꾸었으므로 세기가 달라졌어요. 높은 소리도 작게 낼 수 있어요. 귀가 불편할 만큼 크게 내지 않아요.",
    "required": [
      "높은 소리도 작게 낼 수 있다는 답"
    ],
    "misconception": "소리의 크고 작음과 높고 낮음을 나누어 살펴요.",
    "contract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "sample": "높은 소리도 작게 낼 수 있어요.",
      "required": [
        "높은 소리도 작게 낼 수 있다는 답"
      ]
    },
    "before": [
      "cb3e353e6156e248"
    ]
  },
  "c22-s32-u03-b48": {
    "prompt": "실 전화기 표에서 말이 더 또렷하게 들린 때를 고르세요.",
    "form": "choice",
    "answer": "①",
    "explanation": "이 표에서는 실을 놓았을 때 말이 더 또렷하게 들렸어요. 직접 비교할 때에는 같은 전화기·목소리 크기·듣는 자리를 맞추고 실의 팽팽함과 연결도 살펴요.",
    "required": [
      "실을 손으로 잡지 않았을 때를 찾기"
    ],
    "misconception": "소리의 크고 작음과 높고 낮음을 나누어 살펴요.",
    "choices": [
      "실을 손으로 잡지 않았을 때",
      "실을 손으로 잡았을 때",
      "두 경우에 똑같이 또렷하게 들렸다."
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": 0
    },
    "before": [
      "1a91caf46c86b566",
      "5b16b7029333b754"
    ]
  },
  "c22-s32-u03-b56": {
    "prompt": "친구가 책을 읽을 때 의자 끄는 소리가 불편하다고 했어요. 소음을 줄일 방법 한 가지를 짧게 써 보세요.",
    "form": "written",
    "answer": "의자 다리에 알맞은 덮개를 씌워요.",
    "explanation": "의자 다리에 알맞은 덮개를 씌우거나 안전하게 들어 옮길 수 있어요. 방법을 정한 뒤에는 실제로 소리가 줄었는지와 친구가 덜 불편한지 살펴요.",
    "required": [
      "의자 다리 덮개 등 상황에 맞게 소음을 줄일 방법 한 가지"
    ],
    "misconception": "소리의 크고 작음과 높고 낮음을 나누어 살펴요.",
    "contract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "sample": "의자 다리에 알맞은 덮개를 씌워요.",
      "required": [
        "의자 다리 덮개 등 상황에 맞게 소음을 줄일 방법 한 가지"
      ]
    },
    "before": [
      "53ca8d7d69085e27"
    ]
  },
  "c22-s32-u03-b64": {
    "prompt": "의자 다리에 덮개를 씌우기 전후의 소리를 비교해요. 같은 의자를 같은 바닥에서 같은 방법으로 움직일 때, 알맞은 계획을 고르세요.",
    "form": "choice",
    "answer": "③",
    "explanation": "듣는 자리도 같게 하고 덮개를 씌우기 전후의 소리 크기를 비교해요. 직접 해 보기 전에는 소리가 줄었다고 정할 수 없어요.",
    "required": [
      "듣는 자리를 같게 하여 전후 소리 크기 비교"
    ],
    "misconception": "소리의 크고 작음과 높고 낮음을 나누어 살펴요.",
    "choices": [
      "덮개를 씌운 뒤에는 의자에서 더 멀리 떨어져 듣는다.",
      "덮개를 씌운 뒤의 소리만 듣고 전과 비교하지 않는다.",
      "같은 자리에서 듣고 덮개를 씌우기 전후의 소리 크기를 비교한다."
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": 2
    },
    "before": [
      "542993634c93b0a1"
    ]
  },
  "c22-s32-u03-t12": {
    "prompt": "자 튕기기 표를 읽고 빈칸을 채우세요.\n(1) 같은 세기로 튕기면 길게 내밀수록 더 [ ] 소리가 나요.\n(2) 같은 길이에서 더 세게 튕기면 더 [ ] 소리가 나요.",
    "form": "blank",
    "answer": "(1) 낮은 (2) 큰",
    "explanation": "내민 길이는 높낮이를 바꿔요(길면 낮은 소리). 소리의 크기(세기)는 튕기는 세기로 바뀌어요(세게 튕기면 큰 소리). 높낮이와 세기는 서로 다른 성질이에요.",
    "required": [
      "같은 세기에서 길면 낮은 소리",
      "같은 길이에서 세게 튕기면 큰 소리"
    ],
    "misconception": "소리의 크고 작음과 높고 낮음을 나누어 살펴요.",
    "contract": {
      "kind": "ordered-term-parts",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "parts": [
        {
          "kind": "short-text",
          "accepted": [
            "낮은",
            "낮은음의"
          ]
        },
        {
          "kind": "short-text",
          "accepted": [
            "큰",
            "큰소리의"
          ]
        }
      ]
    },
    "before": [
      "cc0eada0f9900dd2"
    ]
  }
};
const clone=x=>JSON.parse(JSON.stringify(x));
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const banks=new WeakMap(),books=new WeakMap(),labels={choice:'객관식',blank:'빈칸 넣기',short:'단답형',written:'짧게 설명하기',draw:'그림 설명'};
const response=e=>e.contract?clone(e.contract):{kind:Object.hasOwn(e,'drawingExplanationLines')?'drawing':'written-explanation',teacherRequired:true,actualPerformanceMustNotBeInferred:true,sample:e.answer,required:[...e.required]};
// seasonContract is the existing shared closed-response grading adapter.
function answerContract(e){const c=response(e);return{type:e.form==='written'?'written-explanation':e.form==='choice'?'single-choice':'short-text',...(e.form==='written'?{sample:e.answer,teacherRequired:true,reviewRequired:true,rubric:{required:[...e.required],pass:'뜻이 같은 짧은 답과 타당한 다른 방법도 교사가 확인해요.'}}:e.form==='choice'?{answer:e.key,accepted:[e.key]}:{answer:e.answer,accepted:c.accepted||[e.answer],inputHint:c.parts?'빈칸의 답을 쉼표로 나누어 차례대로 써요.':'짧은 낱말로 답해요.'}),seasonContract:c};}
export function soundMixedItems(rows,u){
 if(u!==unit||!rows?.length)return rows;let changed=false;
 const next=rows.map(q=>{const e=bankReview[q.id];if(!e||q.status!=='authored'||!['authored-supplement','authored-lesson','authored-practice'].includes(q.sourceRef?.type)||!e.before.includes(fingerprint(q)))return q;changed=true;if(banks.has(q))return banks.get(q);
 const result={...q,prompt:e.prompt,explanation:e.explanation,misconception:e.misconception,responseContract:response(e),answerContract:answerContract(e),bookResponseForm:e.form,taxonomy:{...q.taxonomy,format:labels[e.form]},choices:e.choices?clone(e.choices):null,diagnosticOverride:{version:SOUND_MIXED_VERSION,distractors:null,typed:null,cloze:null,cells:null},soundMixedResponse:SOUND_MIXED_VERSION,contentVersion:SOUND_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};banks.set(q,result);return result;});return changed?next:rows;
}
export function withSoundMixedClassroom(u,mod){if(u!==unit)return mod;const classroomItems=soundMixedItems(mod?.classroomItems,u);return classroomItems===mod.classroomItems?mod:{...mod,classroomItems};}
export function withSoundMixedWorkbook(w){
 if(w?.unit!==unit||fingerprint(w)!==prior)return w;if(books.has(w))return books.get(w);
 const questions=w.questions.map(q=>{const e=review[q.no];if(!e||fingerprint(q)!==e.before)return q;
 const result={...q,prompt:e.prompt,answer:e.answer,explanation:e.explanation,misconception:e.misconception,form:e.form,formLabel:labels[e.form],bookResponseForm:e.form,choices:e.choices?clone(e.choices):null,requirements:[...e.required],criteria:e.required.join(' / '),responseContract:response(e),soundMixedResponse:SOUND_MIXED_VERSION,contentVersion:SOUND_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};delete result.parts;delete result.answerPerPart;if(e.form==='written')result.lines=1;else delete result.lines;if(Object.hasOwn(e,'key'))result.key=e.key;
 if(q.sourceRef?.type==='authored-supplement'){result.sourceContract=answerContract(e);result.sourceExplanation=e.explanation;}
 return result;});
 const quickPages=w.quickPages.map(p=>({...p,blocks:p.blocks.map(b=>b.type!=='table'?b:{...b,rows:b.rows.map(row=>{const e=review[Number(row[0])];return e&&!e.contract.teacherRequired?[row[0],labels[e.form],e.answer]:row;})})}));
 const result={...w,questions,quickPages};books.set(w,result);return result;
}
