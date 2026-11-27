// Keep model comparisons and personal actions; use brief answers for factual checks.
export const CLIMATE_MIXED_VERSION='20261124-climate-mixed-responses';
const unit='c22-s42-u04',prior='bd65f173669dd35d';
const review={
  "8": {
    "prompt": "같은 지역의 기후가 달라졌는지 알아보려 해요. 어느 기간의 기온 자료를 비교하는 것이 알맞을까요?",
    "answer": "③",
    "explanation": "기후가 변했는지는 같은 지역의 여러 해 자료를 살펴요. 오늘 추웠다는 것만으로 오랜 기간의 변화를 판단하지 않아요.",
    "misconception": "하루나 한 달의 날씨와 오랜 기간의 변화를 구별해요.",
    "form": "choice",
    "required": [
      "알맞은 설명 고르기"
    ],
    "choices": [
      "어제와 오늘",
      "지난 한 달",
      "여러 해"
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "5a8334e626b136fc"
  },
  "19": {
    "prompt": "같은 물과 이어진 모형에서 물높이는 4 cm, 집 A의 땅은 4.5 cm, 집 E의 땅은 6 cm예요. 두 집이 젖지 않은 까닭을 고르세요.",
    "answer": "①",
    "explanation": "A와 E의 땅은 모두 물높이 4 cm보다 높아요. 같은 물과 연결된 이 모형에서는 바다와의 거리보다 땅과 물의 높이를 비교해요.",
    "misconception": "집이 바다에서 멀다는 것만으로 물에 닿는지를 정하지 않아요.",
    "form": "choice",
    "required": [
      "알맞은 설명 고르기"
    ],
    "choices": [
      "두 집의 땅이 물높이보다 높아서",
      "두 집이 모두 바다에서 멀리 떨어져 있어서",
      "두 집 사이의 땅이 물길을 막아서"
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "0b9e2a96b94d4b30"
  },
  "22": {
    "prompt": "모형의 벽은 3.5 cm, 물높이는 4 cm예요. 물이 벽보다 (1)[ ] 물이 안쪽으로 넘어왔어요. 보기: 높아져서·낮아져서",
    "answer": "높아져서",
    "explanation": "물높이 4 cm가 벽 높이 3.5 cm보다 높아져 물이 넘어왔어요. 실제 마을의 안전은 이 모형만으로 정하지 않아요.",
    "misconception": "벽이 있다는 것만으로 어떤 물높이에서도 안전하다고 생각하지 않아요.",
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
            "높아져서"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "0c7aa813f6ef2111"
  },
  "28": {
    "prompt": "위 표의 폭염 일수를 비교하려 해요. 같은 기준으로 조사했는지 확인할 것을 고르세요.",
    "answer": "②",
    "explanation": "장소와 조사 방법, 폭염 일수를 세는 기준을 같게 했는지 살펴야 기간에 따른 차이를 비교할 수 있어요.",
    "misconception": "기온 자료를 비교할 때에는 조사한 조건도 함께 살펴요.",
    "form": "choice",
    "required": [
      "알맞은 설명 고르기"
    ],
    "choices": [
      "표에서 더 큰 숫자를 먼저 썼는지",
      "같은 장소에서 같은 방법과 기준으로 조사했는지",
      "조사한 날마다 기온이 똑같았는지"
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "7508cc016039473b"
  },
  "46": {
    "prompt": "우리 반의 전등을 살피다가 고장 난 스위치를 보았어요. 누구에게 알려야 할까요?",
    "answer": "선생님",
    "explanation": "고장 난 스위치는 학생이 직접 고치지 않고 선생님께 알려요. 필요한 전등과 안전을 지키며 실천해요.",
    "misconception": "전기를 아끼는 활동 때문에 고장 난 전기 기구를 학생이 다루지 않아요.",
    "form": "short",
    "required": [
      "알맞은 낱말"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "선생님",
        "선생님께",
        "선생님에게",
        "담임 선생님",
        "담임선생님",
        "교사",
        "교사에게"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "052f7ca84116a152"
  },
  "53": {
    "prompt": "한 해의 기온이 전 해보다 낮아졌어요. 기후가 어떻게 변하는지 알아보려면 같은 지역의 (1)[ ] 기온 자료를 더 살펴요. 보기: 여러 해·하루",
    "answer": "여러 해",
    "explanation": "한 해가 덜 더울 수 있어도 그 한 해만으로 기후변화가 끝났다고 정할 수는 없어요. 같은 지역의 여러 해 기온 자료를 비교해요.",
    "misconception": "한 해의 오르내림과 오랜 기간의 변화를 구별해요.",
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
            "여러 해"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "51239ecabcc67b00"
  },
  "61": {
    "prompt": "다의 물높이는 4 cm, 벽 높이는 3.5 cm예요. 물높이가 벽보다 (1)[ ] 물이 벽을 넘었어요. 보기: 높아서·낮아서",
    "answer": "높아서",
    "explanation": "다에서는 물높이 4 cm가 벽 3.5 cm보다 높아요. 물이 벽을 넘지 않은 나와 물·벽의 높이를 비교해요.",
    "misconception": "벽의 유무뿐 아니라 물과 벽의 높이를 함께 비교해요.",
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
            "높아서"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "ec1201c3509dbe0d"
  },
  "77": {
    "prompt": "전등을 확인한 횟수만 적혀 있어요. 전기를 덜 썼는지 알려면 무엇을 더 알아봐야 할까요?",
    "answer": "전기의 양",
    "explanation": "확인한 횟수는 활동 기록이에요. 전기를 덜 썼는지 알아보려면 실제로 사용한 전기의 양을 더 알아봐야 해요.",
    "misconception": "활동 횟수와 실제로 사용한 전기의 양을 구별해요.",
    "form": "short",
    "required": [
      "알맞은 낱말"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "전기",
        "전기의 양",
        "전기 사용량",
        "전기사용량",
        "사용한 전기의 양",
        "쓴 전기의 양",
        "전력량"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "cca82de972aa73a7"
  }
};
const bankReview={
  "c22-s42-u04-b06": {
    "prompt": "A마을은 7월, B마을은 1월의 기온이에요. 두 자료는 조사한 (1)[ ]이 달라요. 보기: 달·측정 도구",
    "answer": "달",
    "explanation": "7월과 1월은 조사한 달이 달라요. 같은 기준으로 비교하려면 조사한 때도 함께 살펴요.",
    "misconception": "서로 다른 달의 자료를 같은 때의 자료처럼 비교하지 않아요.",
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
            "달",
            "월",
            "조사한 달"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "11ff96ade989c30b"
    ]
  },
  "c22-s42-u04-b12": {
    "prompt": "인터넷에서 찾은 홍수 사진이 우리 동네의 오늘 모습인지 알려면 무엇을 확인해야 할까요?",
    "answer": "②",
    "explanation": "사진을 찍은 장소와 날짜를 확인해야 우리 동네의 오늘 모습인지 알 수 있어요. 사진 파일의 크기나 건물 수만으로 정하지 않아요.",
    "misconception": "사진이 보여 주는 장소와 때를 확인해요.",
    "form": "choice",
    "required": [
      "알맞은 설명 고르기"
    ],
    "choices": [
      "사진 속 건물의 수",
      "사진을 찍은 장소와 날짜",
      "사진 파일의 크기"
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "ce6f8c641dbe840e"
    ]
  },
  "c22-s42-u04-b18": {
    "prompt": "우리 반은 3일 동안 더웠다고 느꼈어요. 기후가 변했는지 알아보려면 같은 지역의 (1)[ ] 기온 자료를 더 살펴요. 보기: 여러 해·3일",
    "answer": "여러 해",
    "explanation": "3일 동안 덥게 느꼈다는 것만으로 기후가 변했는지 정하지 않아요. 같은 지역의 여러 해 자료를 더 살펴요.",
    "misconception": "짧은 기간의 날씨와 오랜 기간의 기후변화를 구별해요.",
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
            "여러 해"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "8fb48327c5abd039"
    ]
  },
  "c22-s42-u04-b24": {
    "prompt": "폭염이나 한파가 평소와 얼마나 다른지 알아보려 해요. 같은 지역·같은 계절의 어떤 기온과 비교하면 좋을까요?",
    "answer": "평년 기온",
    "explanation": "같은 지역·같은 계절의 평년 기온과 비교하면 평소보다 얼마나 높거나 낮은지 살펴볼 수 있어요.",
    "misconception": "서로 다른 계절의 기온을 곧바로 같은 기준으로 비교하지 않아요.",
    "form": "short",
    "required": [
      "알맞은 낱말"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "평년",
        "평년 기온",
        "평년기온",
        "같은 계절의 평년 기온",
        "같은 지역의 평년 기온",
        "같은 지역 같은 계절의 평년 기온"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "33db6710dff2abae"
    ]
  },
  "c22-s42-u04-b36": {
    "prompt": "교실 조명을 줄이자는 의견이 나왔어요. 수업할 때 꼭 지켜야 할 점을 고르세요.",
    "answer": "①",
    "explanation": "글을 읽고 활동할 수 있는 밝기를 유지해야 해요. 필요한 전등을 무조건 끄는 것이 아니라 불필요한 사용을 줄여요.",
    "misconception": "전등 수를 줄이는 것만으로 좋은 실천이라고 판단하지 않아요.",
    "form": "choice",
    "required": [
      "알맞은 설명 고르기"
    ],
    "choices": [
      "글을 읽을 수 있는 밝기를 유지한다.",
      "사용하는 전등 수를 가장 적게 만든다.",
      "모든 전등을 같은 시간 동안 꺼 둔다."
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "c1941b7b626f1ed9"
    ]
  },
  "c22-s42-u04-b54": {
    "prompt": "한 마을이 물에 잠긴 사진 한 장을 보았어요. 이 사진으로 알 수 있는 것은 무엇일까요?",
    "answer": "③",
    "explanation": "사진은 사진을 찍은 때와 장소의 모습을 보여 줘요. 한 장만으로 전국의 내년 모습을 알 수는 없어요.",
    "misconception": "사진 한 장에서 알 수 있는 장소와 때의 범위를 생각해요.",
    "form": "choice",
    "required": [
      "알맞은 설명 고르기"
    ],
    "choices": [
      "전국의 내년 모습",
      "세계 여러 마을의 현재 모습",
      "사진을 찍을 때 그 마을의 모습"
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "886e15534ecf1e3d"
    ]
  },
  "c22-s42-u04-b60": {
    "prompt": "점토 육지와 집이 든 통에서 물높이만 높여 비교하려 해요. 집의 (1)[ ]와 땅의 모양은 같게 두어요. 보기: 위치·물에 닿은 집 수",
    "answer": "위치",
    "explanation": "물높이만 바꾸려면 집의 위치와 땅의 모양 등은 같게 두어요. 물에 닿은 집 수는 비교하면서 살펴볼 결과예요.",
    "misconception": "같게 둘 조건과 관찰한 결과를 구별해요.",
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
            "위치"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "e9b6915000c2a43a"
    ]
  },
  "c22-s42-u04-b66": {
    "prompt": "모형에서 예상보다 적은 집에 물이 닿았어요. 관찰 결과에 적을 것을 고르세요.",
    "answer": "②",
    "explanation": "관찰 결과에는 실제로 물에 닿은 집의 수를 적어요. 처음 예상이나 계획과 다른 결과도 그대로 비교해요.",
    "misconception": "예상·계획과 실제 관찰 결과를 구별해요.",
    "form": "choice",
    "required": [
      "알맞은 설명 고르기"
    ],
    "choices": [
      "처음 예상한 집의 수",
      "실제로 물에 닿은 집의 수",
      "계획에서 정한 집의 수"
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "d487c6b6cb97b130"
    ]
  },
  "c22-s42-u04-b102": {
    "prompt": "전기 사용량을 비교한 두 기간에 날씨와 교실을 쓴 사람 수가 달랐어요. 실천의 효과를 비교하려면 바뀐 다른 (1)[ ]도 함께 살펴야 해요. 보기: 조건·기록장 제목",
    "answer": "조건",
    "explanation": "날씨와 사용한 사람 수, 사용 시간 같은 조건도 전기 사용량에 영향을 줄 수 있어요. 실천만의 효과라고 바로 정하지 않아요.",
    "misconception": "전기 사용량의 차이를 실천 한 가지의 효과로만 단정하지 않아요.",
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
            "조건"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "dd814976ebd03504"
    ]
  }
};
const clone=x=>JSON.parse(JSON.stringify(x));
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const banks=new WeakMap(),books=new WeakMap(),labels={choice:'객관식',blank:'빈칸 넣기',short:'단답형',written:'까닭 설명',draw:'그림 설명'};
const response=e=>e.contract?clone(e.contract):{kind:Object.hasOwn(e,'drawingExplanationLines')?'drawing':'written-explanation',teacherRequired:true,actualPerformanceMustNotBeInferred:true,sample:e.answer,required:[...e.required]};
function answerContract(e){const c=response(e);return{type:e.form==='choice'?'single-choice':e.contract?'short-text':'written-explanation',...(e.form==='choice'?{answer:e.key,accepted:[e.key]}:e.contract?{answer:e.answer,accepted:c.accepted||[e.answer],inputHint:c.parts?'빈칸의 답을 쉼표로 나누어 차례대로 써요.':'짧은 낱말로 답해요.'}:{sample:e.answer,teacherRequired:true,reviewRequired:true,rubric:{required:[...e.required],pass:'뜻이 같은 짧은 답과 알맞은 이름표는 교사가 확인해요.'}}),seasonContract:c};}
export function climateMixedItems(rows,u){
 if(u!==unit||!rows?.length)return rows;let changed=false;
 const next=rows.map(q=>{const e=bankReview[q.id];if(!e||q.status!=='authored'||q.sourceRef?.type!=='authored-supplement'||!e.before.includes(fingerprint(q)))return q;changed=true;if(banks.has(q))return banks.get(q);
 const result={...q,prompt:e.prompt,explanation:e.explanation,misconception:e.misconception,responseContract:response(e),answerContract:answerContract(e),...(q.diagnosticOverride?{diagnosticOverride:{...q.diagnosticOverride,version:CLIMATE_MIXED_VERSION}}:{}),...(e.form?{bookResponseForm:e.form,taxonomy:{...q.taxonomy,format:labels[e.form]},choices:e.choices?clone(e.choices):null,diagnosticOverride:{version:CLIMATE_MIXED_VERSION,distractors:null,typed:null,cloze:null,cells:null}}:{}),climateMixedResponse:CLIMATE_MIXED_VERSION,contentVersion:CLIMATE_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};banks.set(q,result);return result;});return changed?next:rows;
}
export function withClimateMixedClassroom(u,mod){if(u!==unit)return mod;const classroomItems=climateMixedItems(mod?.classroomItems,u);return classroomItems===mod.classroomItems?mod:{...mod,classroomItems};}
export function withClimateMixedWorkbook(w){
 if(w?.unit!==unit||fingerprint(w)!==prior)return w;if(books.has(w))return books.get(w);
 const questions=w.questions.map(q=>{const e=review[q.no];if(!e||fingerprint(q)!==e.before)return q;
 const result={...q,prompt:e.prompt,answer:e.answer,explanation:e.explanation,misconception:e.misconception,form:e.form,formLabel:labels[e.form],bookResponseForm:e.form,choices:e.choices?clone(e.choices):null,requirements:[...e.required],criteria:e.required.join(' / '),responseContract:response(e),climateMixedResponse:CLIMATE_MIXED_VERSION,contentVersion:CLIMATE_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};delete result.lines;if(Object.hasOwn(e,'key'))result.key=e.key;
 return result;});
 const quickPages=w.quickPages.map(p=>({...p,blocks:p.blocks.map(b=>b.type!=='table'?b:{...b,rows:b.rows.map(row=>{const e=review[Number(row[0])];return e?[row[0],labels[e.form]+row[1].slice(row[1].indexOf(' · ')),e.answer]:row;})})}));
 const result={...w,questions,quickPages};books.set(w,result);return result;
}
