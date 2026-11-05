import{questionPatches,upperNotes,sectionTitles,coreNotes,selfQuestions}from'./c22-s62-u04.editorial-data.js?v=20261104-career-book';
export{questionPatches as CAREER_QUESTION_PATCHES};
const changes=[['구체적인 업무','직업에서 하는 일'],['업무의 과학적 연결','일에 이용되는 과학'],['과학적 연결','과학과의 관계'],['자료의 지위','자료에서 알 수 있는 것'],['자료 지위','자료에서 알 수 있는 것'],['조건부 예상','조건에 따른 예상'],['미확인 질문','더 알아볼 질문'],['미확인 칸','더 알아볼 점을 적는 칸'],['미확인으로','아직 알 수 없다고'],['미확인을','아직 알 수 없는 것을'],['미확인과','아직 모르는 것과'],['미확인','아직 알 수 없음'],['미관측','관측하지 않음'],['미실행','아직 하지 않음'],['미수행','아직 하지 않음'],['지위 남기기','관측과 예상 구별하기'],['업무','일']];
export const careerLanguage=v=>typeof v==='string'?changes.reduce((s,[a,b])=>s.replaceAll(a,b),v):Array.isArray(v)?v.map(careerLanguage):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,careerLanguage(x)])):v;
const clone=x=>JSON.parse(JSON.stringify(x)),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const table=(heads,rows)=>`<table class="ed-table career-book-table"><thead><tr>${heads.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((x,i)=>`<${i?'td':'th'}${i?'':' scope="row"'}>${esc(x)}</${i?'td':'th'}>`).join('')}</tr>`).join('')}</tbody></table>`;
const photo=m=>`<figure class="career-book-photo"><img src="${m.src}" alt="${esc(m.alt)}"><figcaption class="career-book-photo-caption">${esc(m.caption)}</figcaption></figure>`;
export const careerSourceNotes=[
 {id:'climate-scenario',title:'가정에 따라 달라지는 기후 전망',publisher:'국가가뭄정보포털',url:'https://www.drought.go.kr/menu/m30/m35_2.do',readOn:'2026-11-04',caption:'미래의 배출과 사회 변화에 관한 가정을 두고 기후를 전망하는 방법을 알아보아요.'},
 {id:'agricultural-projections',title:'미래의 작물 재배지를 예상하는 연구',publisher:'농촌진흥청 국립원예특작과학원',published:'2025-01-09',url:'https://www.nihhs.go.kr/usr/nihhs/news_Press_view.do?dataNo=100000800416',readOn:'2026-11-04',caption:'차나무와 올리브의 미래 재배 적지를 기후변화 시나리오로 예상한 연구예요.'},
 {id:'soil-measurement',title:'흙의 수분을 측정하는 농업 기술',publisher:'농촌진흥청',url:'https://www.rda.go.kr/middlePopOpenPopNongsaroDBView.do?no=2093',readOn:'2026-11-04',caption:'논콩의 과습 피해를 줄이는 설명에서 흙의 수분 감지기를 어떻게 이용하는지 살펴보아요.'},
 {id:'piano-sound',title:'피아노 현의 진동과 소리',publisher:'Yamaha',published:'2021-10-19',url:'https://hub.yamaha.com/pianos/p-acoustic/how-does-a-piano-work/',readOn:'2026-11-04',caption:'해머가 현을 치고 현의 진동이 울림판으로 전달되는 어쿠스틱 피아노의 구조를 알아보아요.'},
 {id:'career-tuner',title:'악기수리원과 조율사가 하는 일',publisher:'커리어넷',url:'https://www.career.go.kr/cnet/app/base/job/jobView.m?SEQ=347',readOn:'2026-11-04',caption:'악기의 소리를 점검하고 음높이를 맞추는 일을 살펴보아요. 여기서는 하는 일에 관한 설명을 읽어요.'},
 {id:'camera-exposure',title:'사진을 기록하는 빛과 촬영 조건',publisher:'Nikon School',url:'https://static.nikonusa.com/pdf/nikonschool/sat.pdf',readOn:'2026-11-04',caption:'빛을 받아들이는 시간과 조리개를 조절하여 사진을 기록하는 원리를 알아보아요.'}
];
const conceptBlocks=[
 [{type:'text',text:'미래에 생길 문제를 알아보려면 지금 어떤 변화가 나타나는지 먼저 조사해요. 날씨·물 사용·환경 등에 관한 자료에서 조사한 장소와 기간, 방법을 살펴요.'},{type:'table',heads:['살펴볼 것','자료에서 찾아볼 내용'],rows:[['누가 언제 만들었나요?','자료를 만든 사람이나 기관과 발표한 날'],['무엇을 조사했나요?','장소·기간·대상·조사 방법'],['어떤 변화가 보이나요?','표·그래프·사진·글에서 확인할 수 있는 변화']] }],
 [{type:'text',text:'현재의 정보를 바탕으로 미래에 생길 수 있는 문제를 예상해요. 비가 오거나 물을 쓰는 양이 달라지면 물 부족 문제가 어떻게 달라질지 생각할 수 있어요.'},{type:'table',heads:['구별할 것','설명하는 방법'],rows:[['현재까지 알아본 것','자료의 장소와 기간을 밝히며 설명해요.'],['미래에 예상한 것','어떤 조건에서 그런 일이 생길 수 있는지 말해요.'],['더 조사할 것','예상한 문제를 알아보는 데 필요한 자료를 찾아요.']]}],
 [{type:'text',text:'과학은 상태를 측정하고 원인을 알아보며 해결 방법을 만드는 데 도움을 줘요. 흙 수분 센서로 상태를 알아보는 것과 장치로 물을 공급하는 것은 서로 다른 일이에요.'},{type:'table',heads:['장치','하는 일'],rows:[['수분 센서','흙의 수분 상태를 측정해요.'],['제어기','측정한 값과 정해 둔 조건을 비교해요.'],['밸브','신호에 따라 물이 흐르는 길을 열거나 닫아요.']]}],
 [{type:'text',text:'문제를 해결하는 방법을 고를 때에는 어떤 과학이 도움이 되는지와 실제로 이용할 조건을 함께 살펴요. 과학기술의 도움과 사람들의 협력·관리도 함께 생각해요.'},{type:'table',heads:['비교할 내용','생각할 질문'],rows:[['도움이 되는 작용','무엇을 측정하거나 바꾸어 문제 해결을 돕나요?'],['이용할 조건','비용·전원·설치 장소가 우리 상황에 맞나요?'],['함께 할 일','사람들이 어떻게 협력하고 관리해야 하나요?']]}],
 [{type:'text',text:'좋아하는 활동이나 관심 있는 직업을 떠올려 보아요. 아직 진로를 정하지 않았거나 여러 가지가 궁금해도 괜찮아요. 그 직업에서 실제로 하는 일부터 알아보아요.'},{type:'table',heads:['관심 있는 일의 예','어떤 과학을 찾아볼까요?'],rows:[['사진 찍기','빛을 어떻게 기록하고 조절할까요?'],['악기 연주와 조율','어떻게 소리가 나고 음높이를 맞출까요?'],['식물 기르기','빛·물·온도를 어떻게 살펴볼까요?']]}],
 [{type:'text',text:'사진가·조율사·농부·요리사 등 다양한 직업에서 과학을 이용해요. 직업 이름만 적기보다 그 사람이 어떤 일을 할 때 어떤 과학이 쓰이는지 설명해요.'},{type:'table',heads:['하는 일','관련된 과학'],rows:[['사진의 밝기와 초점을 조절해요.','빛과 렌즈'],['악기의 음높이를 맞추어요.','진동과 소리'],['식물의 물과 빛을 관리해요.','식물의 자람과 환경'],['재료를 가열하여 음식을 만들어요.','열의 이동']]}],
 [{type:'text',text:'알아본 직업에서 하는 일과 과학의 관계를 자료를 들어 설명해요. 친구가 궁금해하는 내용을 듣고 그림이나 문장으로 더 설명해 보아요.'},{type:'table',heads:['설명에 넣을 내용','예'],rows:[['직업에서 하는 일','조율사는 악기의 음높이를 맞추어요.'],['관련된 과학','현의 진동과 소리의 높낮이가 관련돼요.'],['알아본 자료','악기의 구조와 조율사가 하는 일을 설명한 자료를 밝혀요.']]}],
 [{type:'text',text:'관심 있는 진로를 과학과 관련지어 설명해 보아요. 그 일을 잘 이해하려면 어떤 과학을 더 알고 싶은지도 이야기해요. 지금 희망하는 직업을 하나로 확정할 필요는 없어요.'},{type:'table',heads:['내가 설명할 것','생각할 질문'],rows:[['관심 있는 진로','어떤 직업이나 활동에 관심이 있나요?'],['그 직업에서 하는 일','누구를 위해 무엇을 하나요?'],['일에 이용되는 과학','어떤 현상·성질·도구를 이용하나요?'],['더 알고 싶은 과학','어떤 내용을 더 배우거나 조사하고 싶나요?']]}]
];
const starts=[3,18,35,49,65,79,96,110];
const activityTitles={17:'현재 문제를 알려 주는 자료 찾기',33:'현재 자료와 미래 예상 구별하기',34:'미래에 생길 수 있는 문제 찾기',48:'과학이 도울 방법 설명하기',63:'두 해결 방법 비교하기',64:'친구와 해결 방법 토의하기',78:'관심 있는 직업에서 질문 찾기',94:'직업 속 과학을 자료로 알아보기',95:'두 직업에서 과학 비교하기',108:'하는 일과 과학 설명하기',109:'친구의 질문을 듣고 설명 고치기'};
const activityLanguage={
 17:[['책이나 누리집에서 현재 사회의 문제를 다룬 자료 두 가지를 찾아 읽어요.','누가 언제 조사했는지, 어디에서 무엇을 조사했는지 살펴요.','자료에서 알게 된 문제를 친구에게 설명해요.'],['읽은 자료','조사한 곳과 시기','알게 된 문제']],
 33:[['자료에서 지금까지 관찰하거나 조사한 내용을 찾아요.','미래를 예상한 내용은 어떤 조건을 바탕으로 했는지 살펴요.','자료로 알 수 없는 것은 더 알아볼 질문으로 적어요.'],['현재까지 알아본 것','미래에 예상한 것과 조건','더 알아볼 질문']],
 34:[['현재 사회에서 나타나는 변화 한 가지를 자료에서 찾아요.','그 변화가 이어지면 누구에게 어떤 문제가 생길지 생각해요.','예상한 까닭과 더 조사할 내용을 친구에게 설명해요.'],['현재 나타나는 변화','예상한 문제와 까닭','더 조사할 내용']],
 48:[['물 부족 등 과학이 해결을 도울 수 있는 문제를 골라요.','어떤 과학 지식이나 도구가 도움이 될지 알아보아요.','도움이 되는 까닭과 더 알아볼 내용을 설명해요.'],['해결하고 싶은 문제','도움이 되는 과학이나 도구','도움이 되는 까닭']],
 63:[['같은 문제를 해결하는 두 가지 방법을 찾아요.','어떻게 작동하는지와 비용, 전원, 관리 방법을 비교해요.','우리 상황에 더 알맞은 방법과 그 까닭을 설명해요.'],['비교할 내용','첫 번째 방법','두 번째 방법']],
 64:[['두 방법을 비교한 내용을 친구에게 설명해요.','서로 궁금한 점을 묻고 조사한 자료를 찾아 답해요.','토의한 뒤 달라진 생각과 더 알아볼 점을 적어요.'],['처음 생각','친구의 질문과 내 답','달라진 생각과 궁금한 점']],
 78:[['좋아하는 활동이나 관심 있는 직업을 떠올려요. 여러 가지를 골라도 좋아요.','그 직업에서 하는 일 중 궁금한 것을 질문으로 만들어요.','질문에 답할 수 있는 책이나 누리집 자료를 찾아 읽어요.'],['관심 있는 직업','궁금한 일','알아본 내용과 자료']],
 94:[['책이나 누리집, 직업인의 설명에서 그 직업이 하는 일을 알아보아요.','어떤 도구를 쓰고 무엇을 관찰하거나 측정하는지 찾아요.','그 일에 어떤 과학을 이용하는지 알아본 자료와 함께 설명해요.'],['직업에서 하는 일','이용하는 과학과 도구','알아본 자료']],
 95:[['나와 친구가 조사한 두 직업에서 하는 일을 비교해요.','두 직업에서 이용하는 과학의 공통점을 찾아요.','같은 과학을 서로 어떻게 다르게 이용하는지 설명해요.'],['비교할 두 직업','함께 이용하는 과학','이용 방법의 차이']],
 108:[['관심 있는 직업에서 하는 일과 관련된 과학을 정리해요.','그림이나 자료를 보여 주며 친구에게 설명해요.','친구가 이해한 점과 더 궁금해하는 점을 들어 보아요.'],['직업에서 하는 일','관련된 과학과 자료','친구가 궁금해한 점']],
 109:[['친구가 궁금해한 내용에 관해 조사한 자료를 찾아보아요.','아직 알 수 없는 것은 더 조사하고, 설명할 문장이나 그림을 고쳐요.','고친 내용을 친구에게 다시 설명해요.'],['친구의 질문','더 알아본 내용과 자료','고친 설명']]
};
export function withCareerEditorial(base){
 if(base.unit!=='c22-s62-u04'||base.pages.length!==127||base.questions.length!==128)throw Error('과학과 나의 진로 교재 원고가 다릅니다.');
 const questions=base.questions.map(q=>{const patch=questionPatches[q.no],n=careerLanguage({...q,...clone(patch||{})});if(patch&&!Object.hasOwn(patch,'givens')&&q.no>=113)delete n.givens;n.given=[...(n.givens?[n.givens]:[]),...(n.options||[])];if(!n.given.length)delete n.given;if(n.table)n.figure='career-question-data-'+n.no;return n;});
 const figures=careerLanguage({...base.figures}),figureModels=careerLanguage(clone(base.figureModels));
 figureModels.camera.caption='사진가는 렌즈를 통과한 빛을 기록하여 사진을 만들어요. 촬영 조건을 바꾸면 기록되는 모습이 달라질 수 있어요.';
 figureModels.seedling.caption='농부는 흙의 수분과 빛·온도 등 식물이 자라는 조건을 살펴요. 물이 필요한 정도는 식물과 흙의 상태에 따라 달라요.';
 for(const k of['camera','seedling']){figureModels[k].credit='';figures[k]=photo(figureModels[k]);}
 for(const m of careerSourceNotes){const key='source-'+m.id;figureModels[key]={kind:'source-links',links:[{label:m.publisher+' · '+m.title,url:m.url}],caption:m.caption};figures[key]=`<div class="career-book-source"><a href="${esc(m.url)}" target="_blank" rel="noopener noreferrer">${esc(m.publisher+' · '+m.title)}</a><p>${esc(m.caption)}</p></div>`;}
 for(const q of questions)if(q.table){figures[q.figure]=table(q.table.머리,q.table.행);figureModels[q.figure]={kind:'table',heads:q.table.머리,rows:q.table.행,caption:'문제 풀이를 위한 연습 자료'};}
 for(let start=0;start<128;start+=24){const rows=questions.slice(start,start+24);figures['career-quick-'+start]='<div class="career-quick-grid">'+[rows.slice(0,12),rows.slice(12)].filter(a=>a.length).map(a=>table(['번호','형식','정답'],a.map(q=>[q.no,q.formLabel,q.responseContract.teacherRequired?'교사 확인':q.answer]))).join('')+'</div>';}
 const revisePages=pages=>{const seen=Array(8).fill(0);return pages.map((p,i)=>{if(p.kind==='duplex-blank')return p;let section=0;for(let k=0;k<8;k++)if(i+1>=starts[k])section=k;const railIndex=seen[section]++%8;let n=careerLanguage(p),blocks=n.blocks,title=n.title;
  if(i===0)blocks=[{type:'table',heads:['이름','공부한 날'],rows:[['','']]},...blocks.filter(b=>b.type==='diagram'),{type:'text',text:'현재의 정보를 바탕으로 미래 사회에 생길 수 있는 문제를 조사하고 과학이 도울 방법을 토의해요. 관심 있는 다양한 직업에서 어떤 과학이 이용되는지 알아보아요.'},{type:'field',title:'워밍업',hint:'내가 좋아하는 활동이나 궁금한 직업을 자유롭게 적어 보아요.',lines:4,draw:false}];
  if(i===1){title='이번 단원에서 배울 내용';blocks=[{type:'table',heads:['배울 내용','해 볼 활동'],rows:[['미래 사회의 문제와 과학의 도움','현재 정보를 조사하고 해결 방법 토의하기'],['다양한 진로와 과학의 관계','관심 있는 직업에서 과학적 요소 찾기']]},{type:'text',text:'자료를 읽고 친구와 토의하며, 여러 형식의 문제로 생각을 정리해요. 오른쪽 더 알아보기에서는 관련된 중학교 과학을 살펴보아요.'},{type:'field',title:'궁금한 점',hint:'더 알아보고 싶은 미래 문제나 직업 속 과학을 적어요.',lines:5,draw:false}];}
  if(p.kind==='concept'){title=sectionTitles[section];blocks=[...clone(conceptBlocks[section]),{type:'field',title:'개념 확인',hint:selfQuestions[section],lines:4,draw:false}];if(section===5)blocks.unshift({type:'diagram',key:'seedling'});}
  if(p.kind==='worked'){title='함께 생각해 보아요';blocks=blocks.map(b=>b.type==='field'?{...b,title:'내 생각 설명하기',hint:selfQuestions[section]}:b);if(section===7)blocks=[{type:'example',question:'사진과 음악이 모두 궁금해요. 두 관심을 과학과 관련지어 설명할 수 있을까요?',steps:[['하는 일 알아보기','사진가는 촬영 조건을 조절하고 조율사는 악기의 음높이를 맞추어요.'],['과학과 연결하기','사진에는 빛, 조율에는 현의 진동과 소리가 관련돼요.']],answer:'서로 다른 관심에서도 과학을 찾을 수 있어요. 하는 일과 과학을 관련지어 설명해요.'},{type:'field',title:'내 관심과 과학',hint:selfQuestions[7],lines:6,draw:false}];}
  if(p.kind==='practice'){const ids=blocks.find(b=>b.type==='questions').ids,first=questions.find(q=>q.id===ids[0]),forms=new Set(ids.map(id=>questions.find(q=>q.id===id).bookResponseForm));title=forms.size===1?({single:'알맞은 설명을 골라요',multiple:'알맞은 설명을 모두 골라요',blank:'빈칸에 알맞은 말을 써요',match:'관계있는 내용을 연결해요',sequence:'알맞은 순서로 배열해요',data:'자료를 읽고 답해요',reason:'까닭을 설명해요','draw-design':'그림으로 설명해요'}[first.bookResponseForm]):'여러 문제로 생각해요';n.section=sectionTitles[first.section-1]+' · '+ids.map(id=>questions.find(q=>q.id===id).no).join(', ');}
  if(p.kind.startsWith('activity')){title=activityTitles[i+1]||title;const language=activityLanguage[i+1];blocks=blocks.map(b=>b.type==='field'?{...b,title:'알아본 내용과 내 생각',hint:selfQuestions[section]}:language&&b.type==='list'?{...b,items:language[0]}:language&&b.type==='table'?{...b,heads:language[1]}:b);}
  if(p.kind.startsWith('reading-')){const source=careerSourceNotes.find(s=>s.id===p.kind.slice(8));if(source)title=source.title;blocks=blocks.map(b=>b.type==='field'?{...b,title:'자료를 읽고 생각해요',hint:'자료에서 알아낸 점과 더 궁금한 점을 적어요.'}:b);}
  if(p.kind==='activity-next-step-plan'){title='나의 진로와 과학을 소개해요';blocks=[{type:'list',items:['관심 있는 직업에서 하는 일을 알아보아요.','하는 일에 관련된 과학적 요소를 그림과 글로 설명해요.','친구의 질문을 듣고 더 알아보고 싶은 과학을 이야기해요.']},{type:'field',title:'내가 관심 있는 일과 과학',hint:'하는 일·관련된 과학·알아본 자료를 넣어 설명해요.',lines:6,draw:true}];}
  if(p.kind==='reading-agricultural-projections'){title='미래의 작물 재배지를 예상해요';blocks=[{type:'text',text:'농촌진흥청 국립원예특작과학원은 2025년 차나무와 올리브의 미래 재배 적지를 예상한 연구를 발표했어요. 미래 기후 조건이 달라질 때 식물이 자랄 수 있는 곳도 달라질 수 있어요.'},{type:'text',text:'이 연구는 특정한 온실가스 배출과 사회 변화의 가정을 이용했어요. 이미 미래를 관측한 결과가 아니라 그 가정에 따른 전망이에요.'},{type:'diagram',key:'source-agricultural-projections'},{type:'field',title:'과학이 도울 수 있는 일',hint:'재배지를 예상한 자료가 작물 선택과 미래 준비에 어떤 도움을 줄 수 있을까요?',lines:5,draw:false}];}
  if(i===122){title='배운 내용을 정리해요';blocks=[{type:'table',heads:['배운 내용','내가 설명할 것'],rows:[['미래 사회의 문제','현재 정보를 바탕으로 어떤 문제를 예상했나요?'],['문제 해결과 과학','과학이 어떻게 도움을 주며, 무엇을 더 살펴야 하나요?'],['나의 진로와 과학','관심 있는 직업에서 어떤 과학을 이용하나요?']]},{type:'field',title:'알게 된 점과 궁금한 점',hint:'미래 문제와 관심 있는 직업에 관해 새롭게 알게 된 점과 더 궁금한 점을 적어요.',lines:6,draw:false}];}
  if(p.kind==='assessment'){
   const tasks=[['현재 자료로 미래 문제 예상하기','현재 사회의 문제를 다룬 자료를 읽어요. 조사한 곳과 시기를 살펴보고, 미래에 어떤 문제가 생길 수 있을지 까닭과 함께 설명해요.'],['문제 해결에 도움이 되는 과학 토의하기','한 가지 문제를 해결하는 두 방법을 비교해요. 과학이 어떻게 도움이 되는지, 이용할 때 무엇을 살펴야 하는지 친구와 토의해요.'],['다양한 직업에서 과학 찾기','관심 있는 직업에서 하는 일을 조사해요. 그 일에 어떤 과학 지식이나 도구가 쓰이는지 자료와 함께 설명해요.'],['나의 진로를 과학과 관련지어 설명하기','내가 관심 있는 진로를 소개하고, 그 일을 하는 데 어떤 과학이 관련되는지 설명해요. 앞으로 더 알고 싶은 과학도 이야기해요.']];
   const task=tasks[i-123];title=task[0];n.section='단원 수행평가';blocks=blocks.map(b=>b.type==='text'?{...b,text:task[1]}:b.type==='field'&&b.title!=='내 근거와 설명'?{...b,title:'알아본 내용과 설명',hint:'조사하거나 토의한 내용을 자료와 함께 설명해요.'}:b);
  }
  return{...n,title,blocks,rail:[{title:'핵심 정리',text:coreNotes[section]},{title:'더 알아보기',text:upperNotes[section][railIndex]},{title:'내가 정리할 것',text:selfQuestions[section],write:Math.max(3,p.rail?.[2]?.write||0)}]};});};
 const pages=revisePages(base.pages),teacherStudentPages=revisePages(base.teacherStudentPages);
 const guidance=[['현재 정보를 바탕으로 미래 사회의 문제를 예상했는지 살펴요.','자료의 장소·기간과 관측한 변화, 미래를 예상한 조건을 관련지어 설명하는지 확인해요.'],['문제 해결에 과학이 어떤 도움을 주는지 설명하는지 살펴요.','두 방법의 작용과 이용 조건을 비교하고, 과학기술 외에 사람들의 협력이나 관리도 필요한지 토의하도록 해요.'],['다양한 직업에서 하는 일을 조사하여 과학적 요소를 찾는지 살펴요.','빛·소리·열·생물·재료 등 어떤 과학이 그 일에 어떻게 이용되는지 자료와 관련지어 설명하도록 해요.'],['관심 있는 진로를 과학과 관련지어 설명하는지 살펴요.','직업에서 하는 일과 관련된 과학의 관계를 중심으로 확인해요. 아직 진로를 정하지 않았거나 관심이 바뀌어도 탐색한 과학을 설명할 수 있어요.']];
 const teacherPages=base.teacherPages.map((p,i)=>i<50?p:{...p,title:pages[123+i-50].title,blocks:[...guidance[i-50].map(text=>({type:'text',text})),{type:'text',text:'희망 직업의 종류나 인기, 진로 확정 여부와 그림·발표 솜씨로 과학 이해를 판단하지 않아요. 학생이 조사하고 토의하며 설명한 내용에 맞춰 피드백해요.'},{type:'field',title:'학생의 설명과 다음 지도',hint:'잘 설명한 과학과 더 알아볼 내용을 적어요.',lines:10,draw:false}]});
 return{...base,theme:'#2f6b4a',figures,figureModels,questions,pages,teacherStudentPages,teacherPages};
}

export const CAREER_READING_VERSION='20261105-career-reading-science';
const careerReadingPatches={
 "출처와 함께 읽기\n가정에 따라 달라지는 기후 전망": {
  "section": "출처와 함께 읽기",
  "upperBefore": "중학교에서는 그래프에서 변화의 경향을 읽어요. 온도가 높아지는 경향이 있어도 모든 날의 온도가 똑같이 오르는 것은 아니에요.",
  "upperAfter": "중학교에서는 지구가 받는 태양 에너지와 밖으로 내보내는 에너지를 비교해요. 온실 효과와 기후변화를 설명하는 데 이 에너지의 균형이 쓰여요.",
  "bodyBefore": "읽을 때의 범위: 특정 경로가 반드시 실현된다는 뜻은 아니며 여기서 실제 전망 수치를 제공하지 않아요.",
  "bodyAfter": "같은 지역과 기간의 전망이라도 가정한 온실가스 배출량이 다르면 결과가 달라질 수 있어요."
 },
 "출처와 함께 읽기\n흙의 수분을 측정하는 농업 기술": {
  "section": "출처와 함께 읽기",
  "upperBefore": "중학교에서는 빛의 반사와 흡수를 배워요. 차양의 재료와 놓는 방향은 빛이 들어오는 모습에 영향을 줘요.",
  "upperAfter": "중학교에서는 전압·전류·저항의 관계를 배워요. 수분 센서 중에는 물의 양에 따라 전기적 성질이 달라지는 현상을 이용해 흙의 수분 상태를 알아보는 것이 있어요.",
  "bodyBefore": "읽을 때의 범위: 해당 작물 사례를 모든 식물의 규칙으로 바꾸지 않아요. 비료·약품 사용이나 실제 기구 조작 지시는 다루지 않아요.",
  "bodyAfter": "흙 속의 물은 깊이와 장소에 따라 다르게 분포할 수 있어요. 센서가 놓인 깊이와 흙의 종류를 함께 살펴 측정한 값의 뜻을 설명해 보아요."
 },
 "출처와 함께 읽기\n악기수리원과 조율사가 하는 일": {
  "section": "출처와 함께 읽기",
  "upperBefore": "중학교에서는 식물의 광합성과 호흡을 배워요. 농부는 식물이 자라는 데 필요한 여러 조건을 함께 살펴요.",
  "upperAfter": "중학교에서는 1초 동안 진동한 횟수를 진동수라고 해요. 진동수가 클수록 음이 높아지므로, 조율사는 소리의 진동수를 비교해 음높이를 맞춰요."
 },
 "출처와 함께 읽기\n피아노 현의 진동과 소리": {
  "section": "출처와 함께 읽기",
  "upperBefore": "중학교에서는 빛의 굴절과 렌즈의 작용을 배워요. 카메라 렌즈는 대상에서 온 빛으로 상을 맺는 데 이용돼요.",
  "upperAfter": "고등학교에서는 현악기의 소리를 정상파로 설명해요. 줄을 따라 간 파동과 반사되어 돌아온 파동이 겹치면, 움직이지 않는 부분과 크게 떨리는 부분이 생겨요.",
  "bodyBefore": "읽을 때의 범위: 모든 악기·전자 피아노가 같은 구조라는 뜻은 아니에요. 악기를 분해하거나 조정하는 활동을 요구하지 않아요.",
  "bodyAfter": "피아노 현에서 시작된 진동이 울림판과 주변 공기로 어떻게 전달되는지 이어 설명해 보아요."
 },
 "출처와 함께 읽기\n사진을 기록하는 빛과 촬영 조건": {
  "section": "출처와 함께 읽기",
  "upperBefore": "중학교에서는 물체가 움직이는 빠르기를 비교해요. 사진을 기록하는 동안 대상이 움직인 거리는 사진에 나타나는 모습과 관련돼요.",
  "upperAfter": "중학교에서는 렌즈가 빛을 굴절시켜 상을 만드는 것을 배워요. 카메라 렌즈는 피사체에서 온 빛을 모아 필름이나 이미지 센서 위에 상을 만들어요.",
  "bodyBefore": "읽을 때의 범위: 자료의3~5쪽 설명을 참고했어요.37쪽 전체 검토나 모든 카메라의 설정·성능 확인을 뜻하지 않으며 장비 구매·외부 업로드는 필요하지 않아요.",
  "bodyAfter": "물체가 움직이는 동안 빛을 받으면 사진에 움직임의 흔적이 남을 수 있어요. 빛을 받는 시간과 물체의 움직임이 사진에 어떤 차이를 만드는지 생각해 보아요."
 },
 "과학으로 해결 방법 찾기 · 44\n자료를 읽고 답해요": {
  "section": "과학으로 해결 방법 찾기 · 44",
  "upperBefore": "중학교에서는 전기 회로에서 전압과 전류를 측정해요. 센서는 빛이나 온도 같은 상태를 측정할 수 있는 신호로 바꾸는 데 이용돼요.",
  "upperAfter": "중학교에서는 물질을 겉모습만이 아니라 밀도·용해도·끓는점 같은 특성으로 구별해요. 분리배출 뒤의 선별 과정에서도 재료의 성질을 확인해야 해요."
 },
 "과학으로 해결 방법 찾기 · 46\n까닭을 설명해요": {
  "section": "과학으로 해결 방법 찾기 · 46",
  "upperBefore": "중학교에서는 빛의 반사와 흡수를 배워요. 차양의 재료와 놓는 방향은 빛이 들어오는 모습에 영향을 줘요.",
  "upperAfter": "중학교에서는 밀도와 용해도처럼 물질마다 다른 특성을 배워요. 재활용할 재료를 실제로 나누는 과정에도 이러한 성질의 차이를 이용할 수 있어요."
 },
 "과학으로 해결 방법 찾기 · 47\n그림으로 설명해요": {
  "section": "과학으로 해결 방법 찾기 · 47",
  "upperBefore": "중학교에서는 전도·대류·복사로 열이 이동하는 방법을 비교해요. 그늘을 만드는 방법과 단열재로 열의 이동을 줄이는 방법은 작용이 달라요.",
  "upperAfter": "중학교에서는 자기장 속에서 전류가 흐르는 코일이 힘을 받는 성질을 배워요. 전동기를 이용해 펌프를 돌리면 물을 보내는 장치로 연결할 수 있어요."
 },
 "관심 있는 직업 알아보기 · 78\n까닭을 설명해요": {
  "section": "관심 있는 직업 알아보기 · 78",
  "upperBefore": "중학교에서는 식물의 광합성과 호흡을 배워요. 농부는 식물이 자라는 데 필요한 여러 조건을 함께 살펴요.",
  "upperAfter": "중학교에서는 소리의 크기를 진폭과, 소리의 높낮이를 진동수와 관련지어 설명해요. 악기의 소리가 더 커진 것과 음이 더 높아진 것은 달라요."
 },
 "직업 속 과학 찾기 · 81, 82\n알맞은 설명을 골라요": {
  "section": "직업 속 과학 찾기 · 81, 82",
  "upperBefore": "중학교에서는 광합성에 필요한 물질과 산물을 확인하는 실험을 해요. 식물은 물과 이산화 탄소를 이용하여 양분을 만들어요.",
  "upperAfter": "중학교에서는 빛의 경로로 상이 생기는 원리를 설명하고, 소리를 파동으로 배워요. 사진기의 상과 피아노의 소리를 빛의 굴절과 진동의 전달로 연결해 설명해 보아요."
 },
 "직업 속 과학 찾기 · 90\n알맞은 설명을 모두 골라요": {
  "section": "직업 속 과학 찾기 · 90",
  "upperBefore": "중학교에서는 진폭과 진동수로 소리의 특징을 구별해요. 더 큰 소리와 더 높은 소리는 같은 뜻이 아니에요.",
  "upperAfter": "고등학교에서는 반도체 소자의 원리를 배워요. 디지털 카메라의 이미지 센서는 빛을 전기 신호로 바꾸어요. 빛을 받는 부분과 신호를 처리하는 부분이 함께 작동해 사진을 기록해요."
 },
 "직업 속 과학 찾기 · 92\n자료를 읽고 답해요": {
  "section": "직업 속 과학 찾기 · 92",
  "upperBefore": "중학교에서는 빛의 굴절과 렌즈의 작용을 배워요. 카메라 렌즈는 대상에서 온 빛으로 상을 맺는 데 이용돼요.",
  "upperAfter": "고등학교에서는 빛과 물질의 상호작용을 이용하는 반도체 소자를 배워요. 이미지 센서는 빛을 전기 신호로 바꾸지만, 표시 단위와 변환 방식은 센서마다 다를 수 있어요."
 },
 "직업 속 과학 찾기 · 93\n까닭을 설명해요": {
  "section": "직업 속 과학 찾기 · 93",
  "upperBefore": "중학교에서는 물체가 움직이는 빠르기를 비교해요. 사진을 기록하는 동안 대상이 움직인 거리는 사진에 나타나는 모습과 관련돼요.",
  "upperAfter": "중학교에서는 전기 에너지가 다른 형태의 에너지로 전환되는 것을 배워요. 전자 피아노의 스피커는 전기 신호에 따라 진동해 공기로 소리를 전달해요."
 },
 "직업 속 과학 찾기 · 94\n까닭을 설명해요": {
  "section": "직업 속 과학 찾기 · 94",
  "upperBefore": "중학교에서는 광합성에 필요한 물질과 산물을 확인하는 실험을 해요. 식물은 물과 이산화 탄소를 이용하여 양분을 만들어요.",
  "upperAfter": "중학교에서는 물체가 반사한 빛과 물체의 색을 관련지어 배워요. 피사체에서 카메라로 들어오는 빛은 조명뿐 아니라 피사체가 어떤 빛을 반사하는지에 따라서도 달라져요."
 },
 "나의 진로와 과학 설명하기 · 113, 114\n알맞은 설명을 골라요": {
  "section": "나의 진로와 과학 설명하기 · 113, 114",
  "upperBefore": "중학교에서는 열의 이동을 여러 방식으로 설명해요. 요리와 건축은 서로 다른 일을 하면서도 열에 관한 과학을 이용해요.",
  "upperAfter": "중학교에서는 빛의 굴절과 소리의 진동수를 배워요. 사진가는 렌즈로 상을 만들고, 조율사는 소리의 진동수를 비교해요. 서로 다른 일에 서로 다른 과학 개념이 쓰여요."
 },
 "나의 진로와 과학 설명하기 · 115, 116, 117\n여러 문제로 생각해요": {
  "section": "나의 진로와 과학 설명하기 · 115, 116, 117",
  "upperBefore": "중학교에서는 재료의 밀도와 용해도 같은 성질을 배워요. 재료를 고르고 분리하는 여러 직업에서 이런 성질이 이용돼요.",
  "upperAfter": "중학교에서는 온도를 물질 입자의 운동과 연결해 설명해요. 요리사가 잰 온도는 음식이 얼마나 따뜻한지 나타내며, 음높이를 나타내는 진동수나 흙의 수분 상태와는 다른 양이에요."
 },
 "나의 진로와 과학 설명하기 · 123\n자료를 읽고 답해요": {
  "section": "나의 진로와 과학 설명하기 · 123",
  "upperBefore": "중학교에서는 자신의 진로에 필요한 과학 학습을 계획해요. 지금 알고 있는 개념과 더 배우고 싶은 개념을 연결해 볼 수 있어요.",
  "upperAfter": "중학교에서는 열평형에 이르는 과정을 입자의 운동과 연결해요. 그늘은 직접 받는 태양빛을 줄이지만, 그늘 속 물체도 주변 공기와 열을 주고받아요."
 },
 "나의 진로와 과학 설명하기 · 124\n자료를 읽고 답해요": {
  "section": "나의 진로와 과학 설명하기 · 124",
  "upperBefore": "중학교에서는 미래 사회에서 과학이 어떤 역할을 할지 토의해요. 여러 사람이 가진 지식과 과학이 함께 문제 해결에 쓰일 수 있어요.",
  "upperAfter": "중학교에서는 소리가 물질을 통해 에너지를 전달하는 파동임을 배워요. 사진가가 다루는 빛과 조율사가 다루는 소리는 모두 파동으로 살펴볼 수 있지만, 전달되는 방식에는 차이가 있어요."
 },
 "나의 진로와 과학 설명하기 · 126\n까닭을 설명해요": {
  "section": "나의 진로와 과학 설명하기 · 126",
  "upperBefore": "중학교에서는 진동수와 음높이의 관계를 배워요. 악기나 음향에 관심이 있으면 같은 음을 내는 여러 소리도 비교할 수 있어요.",
  "upperAfter": "중학교에서는 광합성의 양이 빛의 세기와 온도 등 환경 요인에 따라 달라지는 것을 배워요. 흙의 수분을 재는 센서 하나가 식물에 필요한 모든 조건을 알려 주는 것은 아니에요."
 }
};
export function withCareerReadingScience(workbook){
 if(workbook.unit!=='c22-s62-u04')return workbook;
 const revisePages=pages=>{
  const seen=new Set();
  const result=pages.map(page=>{
   const key=page.section+'\n'+page.title,patch=careerReadingPatches[key];
   if(!patch)return page;
   if(page.section!==patch.section||seen.has(key))throw Error('진로 읽기 자료의 쪽 구성이 다릅니다.');
   seen.add(key);
   const upper=page.rail.filter(note=>note.title==='더 알아보기');
   if(upper.length!==1||upper[0].text!==patch.upperBefore)throw Error('진로 읽기 자료의 더 알아보기 원고가 다릅니다.');
   let blocks=page.blocks;
   if(patch.bodyBefore){
    if(blocks.filter(block=>block.type==='text'&&block.text===patch.bodyBefore).length!==1)throw Error('진로 읽기 자료의 설명 원고가 다릅니다.');
    blocks=blocks.map(block=>block.type==='text'&&block.text===patch.bodyBefore?{...block,text:patch.bodyAfter}:block);
   }
   return {...page,blocks,rail:page.rail.map(note=>note.title==='더 알아보기'?{...note,text:patch.upperAfter}:note)};
  });
  if(seen.size!==Object.keys(careerReadingPatches).length)throw Error('진로 읽기 자료의 연결 대상이 빠졌습니다.');
  return result;
 };
 return {...workbook,pages:revisePages(workbook.pages),teacherStudentPages:revisePages(workbook.teacherStudentPages)};
}
