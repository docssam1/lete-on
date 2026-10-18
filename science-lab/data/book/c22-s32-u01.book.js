import {inquiry} from '../activities/c22-s32-u01.inquiry.js';
const u=inquiry.unit,q=n=>`${u}-b${String(n).padStart(2,'0')}`,paired=n=>`s32-u04-v${String(n).padStart(3,'0')}`;
const text=value=>({type:'text',value}),fields=(labels,guides,lines=3)=>({type:'fields',labels,guides,lines}),table=(heads,rows)=>({type:'table',heads,rows}),draw=guide=>({type:'draw',guide}),questions=keys=>({type:'questions',keys});
const pages=[],page=(title,blocks,activity)=>pages.push({title,blocks,...(activity?{activity}:{})});
const concepts=[{id:'object',title:'물체와 재료를 구별해요',text:'컵·자·의자 같은 물건이 물체예요. 물체를 만드는 재료를 물질이라고 해요. 같은 물체도 다른 재료로 만들 수 있고, 한 물체의 부분마다 여러 재료가 쓰일 수 있어요.'},{id:'property',title:'시료의 성질을 비교하고 물질로 분류해요',text:'나무·철·유리·플라스틱 시료의 실제 성질을 확인해 비교해요. 이름·색·모양만 보고 재료를 확정하지 않아요. 물질의 종류로 분류할 때는 확인한 재료를 기준으로 같은 모둠에 놓아요. 복합 물체는 부분을 정하고, 모르면 더 확인으로 남겨요.'},{id:'states',title:'그릇만 바꾸는 비교',text:'고체는 누르거나 자르지 않고 그릇만 바꾸면 모양과 부피를 유지해요. 액체는 그릇에 따라 모양이 바뀌지만 흘리거나 더 넣지 않으면 부피를 유지해요. 높이와 부피는 구별해요. 기체인 공기는 공간을 차지하고 닫힌 용기의 빈 공간에 고르게 퍼져요.'},{id:'design',title:'성질을 쓰임과 연결한 설계',text:'어떤 불편을 해결할지 정하고 부분의 쓰임에 필요한 성질을 고른 뒤 관찰한 후보를 비교해요. 그림에는 부분·재료·기능을 적고 장점과 한계를 함께 살펴요. 설계 그림, 실제 제작, 실제 시험, 실제 의견 나누기는 각각 구별해 기록해요.'}];
page('물체와 물질 · 내 관찰과 설계',[text('주변의 물건은 무엇으로 만들었을까요? 준비한 재료를 직접 비교하고, 같은 재료로 만든 물체를 나눈 뒤 쓰임새 있는 물건을 설계해요.'),fields(['미리 생각하기 · 같은 컵을 다른 재료로 만들면 무엇이 다를까요?','이번에 직접 알아볼 물건과 재료'],['예상은 여러 가지일 수 있다. 투명함·무게·튼튼함 등 실제 비교할 성질로 이어 준다.','나무·철·유리·플라스틱 시료와 안전한 생활 물체를 정한다.']),text('예시 문제를 맞힌 기록과 직접 한 관찰·분류·설계의 근거는 따로 확인해요.')]);
page('준비와 관찰 약속',[text('선생님이 준비한 안전한 시료·플라스틱 컵·얕은 수조·물·마른 종이·눈금컵·기록 도구를 이용해요. 유리의 깨진 부분이나 날카로운 철 조각은 직접 만지지 않아요.'),table(['비교할 것','내 준비'],[['나무·철·유리·플라스틱 시료',''],['그릇만 바꿀 고체와 액체',''],['공기를 확인할 컵과 수조','']]),fields(['관찰 방법·같게 맞출 조건·아직 모르는 재료'],['구부리기·비쳐 보임 등의 조건을 정한다. 유리를 깨거나 맛보기·가열·전선 수리를 하지 않는다.'])]);
for(const a of inquiry.activities){
 page(a.title+' · 문제와 방법',[text(a.question),text(a.intro),...a.steps.map((s,i)=>text(`${i+1}. ${s}`)),fields(['활동 날짜·실제 대상·관찰 상태'],[a.teacher],2)],a.id);
 if(a.columns)page(a.title+' · 자료마다 근거',[text('직접 본 결과·자료에서 확인한 내용·앞으로 할 계획을 구별해요. 자료 한 개마다 이름표와 근거를 남겨요.'),table(a.columns,Array.from({length:a.minRows||2},()=>a.columns.map(()=>''))),fields(['비교 결과·더 확인할 조건'],[a.teacher],3)],a.id);
 else page(a.title+' · 내 생각과 근거',[...a.fields.filter(f=>f.key!=='date').slice(0,4).map(f=>fields([f.label],[a.teacher],2))],a.id);
 page(a.title+' · 설명과 보완',[...(a.draw?[draw(a.teacher)]:[]),fields(a.draw?['그림의 부분 이름·관찰 근거 또는 설계 기능','실제로 확인한 점·앞으로 확인할 점']:['분류한 근거와 확인하지 못한 재료','이전 기준 또는 친구 기준과 비교'],[a.teacher,'실제 결과와 아직 하지 않은 계획을 구별하여 기록한다.'],3)],a.id);
}
for(const c of concepts)page(c.title,[text(c.text),fields(['내 기록에서 이 개념의 근거 찾기'],['보관한 자료의 날짜·대상·조건을 가리켜 설명한다. 예시를 실제 수행으로 옮기지 않는다.'],4)]);
page('자료로 확인 · 물체와 분류',[questions([q(1),q(17)])]);
page('자료로 확인 · 시료의 성질',[questions([q(10)])]);
page('자료로 확인 · 조건과 설계',[questions([q(25),q(33),q(41)])]);
page('자료로 확인 · 수정과 실제 기록',[questions([q(49),q(60)])]);
page('서술과 설계의 여러 설명',[questions([q(40),q(56)]),text('두 문항은 직접 작성한 학습용 기준으로 선생님과 설명의 타당성을 확인해요. 예시 답과 낱말이 같아야만 맞는 것은 아니에요.')]);
page('자료로 확인 · 고체와 액체',[questions([paired(3),paired(37)])]);
page('자료로 확인 · 공기가 차지한 공간',[questions([paired(9)]),fields(['내 실제 컵 관찰과 같은 점·다른 점'],['자료 문제와 직접 한 컵 관찰을 구별하여 조건과 결과를 설명한다.'],4)]);
page('내 탐구보고서와 수행 근거',[fields(['① 실제 물체·재료 관찰의 근거','② 물질별 분류의 기준·모둠·근거','③ 세 상태를 비교한 방법과 실제 결과','④ 쓰임새·부분별 재료·설계 그림의 근거','⑤ 실제 의견·수정·재확인 여부'],['시료·날짜·출처와 관찰 방법을 확인한다.','물체 이름이나 모양과 재료를 구별한다.','고체·액체의 모양과 부피, 공기가 차지한 공간을 기록으로 설명한다.','아이디어 수준의 설계도 쓰임·성질·근거가 연결되는지 본다.','계획과 실제로 한 일을 구별하며 성적을 자동 확정하지 않는다.'],2)]);
const activities=inquiry.activities.map(a=>({...a,phase:['materials','classify'].includes(a.id)?'observe':['states','air'].includes(a.id)?'experiment':'design'}));
export const chapter={unit:u,no:1,semester:'3-2',book:'지필드 실험 과학',subjectTitle:inquiry.title,title:'물체와 물질 · 관찰하고 설계하기',theme:'#2456c4',inquirywork:true,fieldwork:true,startDescriptions:['재료 관찰·물질별 분류 — 직접 확인한 특징과 근거를 보관해요.','고체·액체·기체 비교와 생활 물체 설계 — 계획과 실제 결과를 나누어요.','관찰·분류·상태 비교·설계·의견을 함께 다루는 수업 화면.'],deckWrittenExamples:{},activities,pages,concepts,goal:'재료의 성질을 실제로 비교하고 물질별로 분류해요. 고체·액체·기체를 관찰하고 쓰임새 있는 물체를 설계해요.',intro:['나무·철·유리·플라스틱 시료를 확인하고 실제 특징을 비교해요.','그릇에 따른 모양·부피와 공기가 차지하는 자리를 관찰해요.','관찰한 성질을 이용해 생활의 불편을 해결할 물체를 설계해요.'],check:[q(1),q(10),q(17),q(25),q(41),q(49),q(60),q(56),paired(3),paired(9)],formative:{items:[q(33),q(40),paired(37)]},summary:['확인한 재료와 관찰 근거로 물체를 분류했나요?','그릇만 바꾸는 조건에서 모양·높이·부피를 구별했나요?','컵 속 공기가 차지한 공간을 실제 관찰과 연결했나요?','쓰임새와 부분별 재료의 성질을 연결해 설계했나요?','계획·실제 실행·의견·수정을 구별해 선생님과 확인했나요?'],fieldworkSay:'직접 비교하고 기록을 남겨요. 실제로 한 활동과 계획은 구별하며 준비되면 다음으로 가요.'};
export const art={opener:'',comparison:''};
export const plan={note:'관찰·분류·상태 비교·설계를 여러 차시로 나누어요. 시간은 안내이며 실제 수행을 자동 완료하지 않아요.',say:{},phases:[{id:'open',name:'궁금한 점',min:10,aim:'주변 물체와 재료를 구별한다.'},{id:'observe',name:'재료 관찰·분류',min:30,aim:'네 재료를 관찰하고 물질별로 분류한다.'},{id:'experiment',name:'세 상태 비교',min:30,aim:'그릇에 따른 모양·부피와 공기의 공간 차지를 확인한다.'},{id:'concept',name:'근거로 개념 정리',min:15,aim:'내 기록과 개념을 연결한다.'},{id:'design',name:'설계·의견·수정',min:35,aim:'쓰임새에 맞는 성질을 골라 설계하고 확인할 점을 정한다.'},{id:'check',name:'자료와 수행 점검',min:20,aim:'문제 응답과 실제 수행 근거를 따로 확인한다.'}]};
