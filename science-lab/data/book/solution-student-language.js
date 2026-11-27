// Presentation-only edits for current 6과03. Keep every answer and grading contract.
export const SOLUTION_LANGUAGE_VERSION='20261105-solution-student-language';
export const SOLUTION_QUESTION_LANGUAGE={
 7:{topic:'관찰한 결과 비교하기',prompt:'충분히 저은 뒤에도 가루가 바닥에 남았습니다. 전체가 골고루 섞인 용액이라고 하기 어려운 까닭은?',choiceWords:[['윗액','윗부분의 액체']]},
 11:{topic:'용해 전후의 무게 비교'},
 13:{topic:'용액만의 무게'},
 16:{topic:'무게와 존재'},
 18:{topic:'같게 할 조건'},
 20:{prompt:'비교할 조건과 관찰할 결과의 역할을 연결하세요.'},
 21:{topic:'같은 양 넣기',prompt:'친구들이 가루를 한 숟가락씩 넣었지만, 어떤 친구는 수북하게 담고 어떤 친구는 숟가락 위를 깎아 평평하게 담았습니다. 같은 양을 넣어 비교하려면 어떻게 고쳐야 할까요?'},
 26:{prompt:'물의 온도에 따라 용질이 녹을 수 있는 양을 비교하려고 합니다. 실험 순서를 배열하세요.',given:['ㄱ 같은 양씩 용질을 넣고 저은 뒤 남은 고체가 있는지 확인   ㄴ 같은 양의 물을 서로 다른 온도로 준비   ㄷ 실제 물 온도와 결과를 표에 기록   ㄹ 같은 용질과 도구 준비']},
 39:{prompt:'흰 설탕을 녹인 두 설탕물의 진하기를 비교하려고 합니다. 그것만으로는 진하기를 알기 어려운 근거를 모두 고르세요.',choiceWords:[['설탕 질량','설탕 무게']]},
 43:{topic:'알아본 방법 구별하기',prompt:'각 내용을 어떤 방법으로 알아보았는지 연결하세요.'},
 46:{topic:'자료를 만들고 공유하기',prompt:'자료를 만들었지만 아직 친구에게 보여 주지 못했습니다. 지금까지 한 일과 앞으로 할 일을 어떻게 적으면 좋을까요?'},
 47:{topic:'자료로 알 수 있는 녹는 양'},
 50:{topic:'바꿀 조건과 같게 할 조건'},
 64:{topic:'공유하고 의견 나누기',prompt:'소개 자료를 만드는 일과 실제로 [ ]하는 일을 구분하고, 친구에게 받은 [ ]을 바탕으로 설명을 고친다.'},
 69:{topic:'무게 계산'},
 71:{topic:'무게 비교'},
 72:{topic:'무게 설명'},
 74:{topic:'모두 녹은 양으로 알 수 있는 것'},
 75:{prompt:'물의 온도에 따라 녹을 수 있는 백반의 양을 비교하려고 합니다. 실험 순서를 배열하세요.',given:['ㄱ 같은 양씩 백반을 넣고 같은 방법으로 관찰   ㄴ 같은 물 양·다른 온도 준비   ㄷ 용질과 도구 확인   ㄹ 물의 온도·넣은 백반의 양·남은 고체 기록']},
 79:{prompt:'흰 설탕을 녹인 두 설탕물의 진하기 비교에 쓸 수 있는 근거를 모두 고르세요.',choiceWords:[['설탕 질량','설탕 무게']]},
 82:{topic:'더 알아볼 방법',prompt:'같은 물체를 두 용액에 각각 넣었더니 모두 바닥에 닿았습니다. 진하기를 비교하려면 무엇을 더 알아보면 좋을지 한 가지 쓰세요.'},
 86:{topic:'소개하고 설명 고치기',prompt:'완성한 소개 자료를 친구에게 보여 주고 설명을 고치려고 합니다. 순서를 배열하세요.',given:['ㄱ 받은 질문과 의견 기록   ㄴ 설명 수정   ㄷ 친구에게 보여 주고 설명   ㄹ 다시 소개했는지와 그 결과 기록']},
 87:{topic:'한 일과 앞으로 할 일',prompt:'지금까지 한 일을 바르게 적은 기록을 모두 고르세요.'},
 91:{topic:'얼마나 더 녹을 수 있을까요?'},
 95:{topic:'한 일에 맞게 기록 고치기'},
};
export function solutionQuantityLanguage(text){
 const words=[['질량이라고','무게라고'],['질량이라는','무게라는'],['질량이다','무게이다'],['질량이므로','무게이므로'],['질량이면','무게이면'],['질량으로','무게로'],['질량은','무게는'],['질량을','무게를'],['질량이','무게가'],['질량과','무게와'],['질량','무게']];
 return words.reduce((s,[a,b])=>s.replaceAll(a,b),text);
}
export function solutionChoiceLanguage(choices,patch){
 if(!choices)return choices;
 return choices.map(text=>(patch.choiceWords||[]).reduce((s,[a,b])=>s.replaceAll(a,b),solutionQuantityLanguage(text)));
}
export function solutionBookQuestionLanguage(q){
 if(q.id!==`solution-book-${String(q.no).padStart(2,'0')}`)return q;
 const patch=SOLUTION_QUESTION_LANGUAGE[q.no]||{};
 const {choiceWords,...fields}=patch;
 const next={...q,...fields,prompt:solutionQuantityLanguage(patch.prompt||q.prompt),...(q.choices?{choices:solutionChoiceLanguage(q.choices,patch)}:{})};
 return JSON.stringify(next)===JSON.stringify(q)?q:next;
}
const figureWords={
 mixing:[['용액 · 고르게 녹은 것','용액 · 설탕이 물에 골고루 녹은 것']],
 observation:[['맑은 윗액과 남은 고체','맑게 보이는 액체와 바닥에 남은 고체']],
 mass:[['같은 물건 전체 · 흘림과 증발이 없다는 조건의 계산이에요.','흘리거나 증발한 물질이 없을 때, 처음과 같은 물건을 모두 올려 계산한 연습 자료예요.']],
 temperature:[['같은 백반 · 같은 물 양 · 같은 투입량과 관찰 방법인 설명용 사례예요. 실제 온도는 따로 재어요.','백반의 종류와 넣은 양, 물의 양, 관찰 방법을 같게 한 비교 모형이에요. 물의 온도는 직접 측정하거나 제시된 기록에서 확인해요.']],
 floating:[['같은 물체를 차례로 넣는 비교를 나란히 표현했어요. 벽·바닥 접촉 없이 수면과의 관계를 보아요.','같은 물체를 차례로 넣는 비교를 나란히 나타냈어요. 벽이나 바닥에 닿지 않는지 살피고, 수면 위로 드러난 부분을 비교해요.']],
 communication:[['조사 → 자료 제작 → 실제 설명 → 의견·보완','조사 → 자료 만들기 → 친구에게 소개 → 의견 듣고 고치기'],['사진은 자료 제작 단계의 예예요. 전달 여부와 받은 의견은 실제 행동 뒤 기록해요.','자료를 만드는 모습이에요. 완성한 자료를 친구와 공유하고, 질문과 의견을 듣고 설명을 고쳐 보아요.']],
 sourceMass:[['지필드 이론5-1-1 25쪽의 비교 예. 이 책의 별도 연습값92g/139g과 구별해요.','지필드 이론5-1-1 25쪽 · 용해 전후 무게 비교. 이 그림과 92 g/139 g 연습 자료는 서로 다른 예예요.']],
 sourceColoredWater:[['지필드 이론5-1-1 24쪽의 물 관찰 사례예요. 아세톤 사례를 뜻하지 않아요.','지필드 이론5-1-1 24쪽 · 물에 수성 잉크가 퍼지는 모습']],
};
export function solutionFigureLanguage(figures){return Object.fromEntries(Object.entries(figures).map(([key,value])=>{
 const edits=figureWords[key];if(!edits&&!value.includes('class="ed-photo-credit">실제 측정 사진 아님'))return[key,value];
 let next=value;for(const [a,b] of edits||[]){if(!next.includes(a))throw Error(`용액 그림 ${key}의 설명이 달라졌습니다.`);next=next.replaceAll(a,b);}
 next=next.replaceAll('class="ed-photo-credit">실제 측정 사진 아님','class="ed-photo-credit">용해와 용액을 설명하는 학습용 그림');
 return[key,next];
}));}
export function withSolutionStudentLanguage(workbook){
 if(workbook.unit!=='c22-s51-u03'||workbook.questions.length!==96)throw Error('용해와 용액 문항 언어 편집 대상이 다릅니다.');
 return {...workbook,questions:workbook.questions.map(solutionBookQuestionLanguage),figures:solutionFigureLanguage(workbook.figures)};
}
