/* Individual counselling case, kept separate from the source level tables.
 * All intervals are relative months, start-inclusive and end-exclusive.
 * Offset 0 is September in grade 2; no calendar year or percentile is inferred.
 * The May–June overlap with 6-2 was explicitly confirmed by the user.
 */
(function(global){
'use strict';
const ID='gangnam-soma-a-l9',LABEL='강남권 소마 A 중위권 (L9 기준 사례)',HORIZON=36,SOURCE_START=56;
const OPTIONS=Object.freeze({
 algebra:Object.freeze(['overlap','after']),
 depthBook:Object.freeze(['highestS','highestMath']),
 gifted:Object.freeze(['review','later']),
 academy:Object.freeze(['consider','defer'])
});
const DEFAULTS=Object.freeze({version:1,id:ID,algebra:'overlap',depthBook:'highestS',gifted:'review',academy:'consider'});
const DEPTH={highestS:'최상위 S',highestMath:'최상위 수학'};
function restore(value){
 const input=value&&typeof value==='object'&&!Array.isArray(value)&&value.version===1&&value.id===ID?value:{};
 const state={...DEFAULTS};
 for(const key of Object.keys(OPTIONS))if(OPTIONS[key].includes(input[key]))state[key]=input[key];
 return state;
}
function choose(value,key,selection){
 const state=restore(value);
 if(Object.hasOwn(OPTIONS,key)&&OPTIONS[key].includes(selection))state[key]=selection;
 return state;
}
function dateAt(offset){
 if(!Number.isFinite(offset))return null;
 const absolute=SOURCE_START+offset,whole=Math.floor(absolute),month=((whole%12)+12)%12+1;
 const grade=Math.floor((whole-2)/12)-2,half=absolute-whole>=.5;
 return {offset,grade,gradeLabel:'초'+grade,month,quarter:Math.floor((month-1)/3)+1,half,year:null,label:'초'+grade+' '+month+'월'+(half?' 중순':'')};
}
function block(id,title,start,end,kind,method,extra={}){
 return {id,title,start,end,kind,method,current:start===0,source:'user-counselling-case',...extra};
}
function courseRank(text){
 const t=String(text||'').replace(/<[^>]*>/g,' '),elementary=t.match(/^([1-6])-([12])/),middle=t.match(/^중([1-3])-([12])/),high=t.match(/^공통수학([12])/);
 if(elementary)return(+elementary[1]-1)*2+(+elementary[2]-1);
 if(middle)return 12+(+middle[1]-1)*2+(+middle[2]-1);
 return high?18+(+high[1]-1):null;
}
function valueAt(points,x){
 if(!points.length||x<points[0].x||x>points.at(-1).x)return null;
 for(let i=1;i<points.length;i++)if(x<=points[i].x){const a=points[i-1],b=points[i];return a.y+(b.y-a.y)*(x-a.x)/(b.x-a.x||1);}
 return points.at(-1).y;
}
function referenceSeries(){
 return ['L8','L7'].flatMap(id=>{
  const level=(global.PLANNER_LEVELS||[]).find(l=>l.id===id);if(!level)return[];
  const raw=(level.school||[]).flatMap(([title,start,end])=>{
   const rank=courseRank(title);return rank===null||!Number.isFinite(start)||!Number.isFinite(end)?[]:[{x:start-SOURCE_START,y:rank,label:String(title)},{x:end+1-SOURCE_START,y:rank+1,label:String(title)}];
  }).sort((a,b)=>a.x-b.x||a.y-b.y);
  const points=raw.filter(p=>p.x>=0&&p.x<=HORIZON).map(p=>({...p}));
  const first=valueAt(raw,0),last=valueAt(raw,HORIZON);
  if(first!==null&&!points.some(p=>p.x===0))points.unshift({x:0,y:first,label:'초2 9월 원자료 진도'});
  if(last!==null&&!points.some(p=>p.x===HORIZON))points.push({x:HORIZON,y:last,label:'원자료 진도'});
  return points.length?[{id,title:id+' 교과 진도 예시',points,source:'PLANNER_LEVELS',note:'동일한 학년·월의 기존 교과 예시입니다. 학원 반의 석차나 합격 가능성을 뜻하지 않습니다.'}]:[];
 });
}
function model(value){
 const state=restore(value),algebraStart=state.algebra==='overlap'?8:10,algebraEnd=algebraStart+6,middleStart=algebraEnd,middleEnd=middleStart+18;
 const elementary=['5-1','5-2','6-1','6-2'].map((stage,index)=>block('case-school-'+stage,'디딤돌 응용 '+stage,index*2.5,(index+1)*2.5,'school','개념과 대표 유형을 익힌 뒤 응용 문제의 조건과 풀이 이유를 설명합니다.',{stage,fullMonths:2.5,schoolPhase:'elementary',durationBasis:'user-confirmed'}));
 const middle=Array.from({length:6},(_,index)=>{
  const stage='중'+(Math.floor(index/2)+1)+'-'+(index%2+1);
  return block('case-school-'+stage,stage+' 교과',middleStart+index*3,middleStart+(index+1)*3,'school','개념을 연결하고 대표 문제와 응용 문제를 다시 풀어 봅니다. 교재는 실제 풀이 수준에 맞춰 정합니다.',{stage,fullMonths:3,schoolPhase:'middle',durationBasis:'18-month-total-even-split-assumption',bookConfirmed:false});
 });
 const algebra=block('case-algebra','초등 계통 대수심화',algebraStart,algebraEnd,'algebra','초등에서 배운 수·연산·비와 비율·규칙의 관계를 계통별로 묶어 심화합니다. 중등 교과 진입 전의 초등 과정이며, 중등 대수 심화와 구분합니다.',{fullMonths:6,durationBasis:'user-confirmed',parallel:state.algebra==='overlap',overlap:state.algebra==='overlap'?{start:8,end:10,with:'case-school-6-2'}:null});
 const thinking=['1031 초급','1031 중급','3%'].map((title,index)=>block('case-thinking-'+index,title,index*6,(index+1)*6,'thinking',index===0?'중급에서 막혔던 조건 해석과 풀이를 초급에서 다시 익힙니다. 스스로 해결하고 설명하는 모습을 확인합니다.':'문제의 조건을 정리하고 먼저 시도한 뒤 서로 다른 풀이를 비교합니다.',{fullMonths:6,durationBasis:'user-confirmed',purpose:index===0?'reinforcement':'continuation'}));
 const depth=block('case-depth-4-1',DEPTH[state.depthBook]+' 4-1',.5,null,'deep','교과 진도와 별도로 낯선 문제의 조건을 연결하고 풀이 이유를 설명합니다. 4-1 이후 범위와 권별 기간은 실제 풀이를 보고 정합니다.',{stage:'4-1',displayEnd:HORIZON,openEnded:true,fullMonths:null,durationBasis:'unconfirmed',current:false,reportedCurrentBook:'최상위 S 4-1',plannedBookChange:state.depthBook!=='highestS'});
 const academyOn=state.academy==='consider',giftedOn=state.gifted==='review';
 const events=[
  {id:'case-hwangso-transfer',at:6,kind:'academy',title:'황소 4-1 실력반 편입 검토',active:academyOn,status:academyOn?'consider':'deferred',note:'이 사례에서는 초3 3월 편입 가능성을 낮게 보았습니다. 실제 응시와 편입은 당시 전형과 풀이 수준을 확인합니다.',assessmentSource:'user-case-opinion'},
  {id:'case-hwangso-autumn',at:14,kind:'academy',title:'황소 진입 시기 재검토',active:academyOn,status:academyOn?'consider':'deferred',note:'원장 상담에서는 초3 11월을 더 현실적인 검토 시점으로 보았습니다. 합격이나 입학을 예정한 일정은 아닙니다.',assessmentSource:'user-case-opinion'},
  {id:'case-gifted',at:15,kind:'gifted',title:giftedOn?'교육청 영재원 지원 검토':'교육청 영재원 검토 보류',active:giftedOn,status:giftedOn?'review':'deferred',note:'초3 말에 지원을 검토하는 상담 계획입니다. 지역·해당 연도 모집요강에서 지원 학년과 접수·평가 일정을 확인합니다. 12월 표시는 연말 검토 위치이며 확정 시험일이 아닙니다.'},
  {id:'case-middle-academy',at:30,kind:'academy',title:'황소 중등·누테학원 검토',active:academyOn,status:academyOn?'consider':'deferred',note:'초5 3월은 학원 이동을 검토하는 시점입니다. 중등 교과 전체를 마쳤다는 뜻은 아니며 남은 범위와 입학 전형을 함께 살펴봅니다.',middleRemaining:middleEnd-30}
 ].map(event=>({...event,date:dateAt(event.at)}));
 const school=[...elementary,...middle],curriculumPoints=[];
 for(const b of school){const rank=courseRank(b.stage);curriculumPoints.push({x:b.start,y:rank,stage:b.stage,label:b.title},{x:b.end,y:rank+1,stage:b.stage,label:b.title});}
 const lanes=[
  {id:'school',label:'교과',status:'planned',current:'디딤돌 응용 5-1부터',blocks:school,note:'초등 한 학기 2.5개월. 중등은 총 18개월을 여섯 학기로 나눈 비교용 배치입니다.'},
  {id:'deep',label:'교과 심화',status:'open-ended',current:'최상위 S 4-1 · 9월 중순 시작',blocks:[depth],note:'시작만 확인된 계획입니다. 이어지는 선은 병행 의향이며 한 권을 36개월 공부한다는 뜻이 아닙니다. 권별 종료일은 미정입니다.'},
  {id:'thinking',label:'사고력',status:'planned',current:'1031 초급부터 보완',blocks:thinking,note:'소마 수업을 종료한 뒤 별도로 이어가는 과정입니다. 초급·중급·3%는 각각 6개월이며 다음 과정은 풀이를 확인한 뒤 이어갑니다.'},
  {id:'algebra',label:'초등 계통 대수심화',status:'planned',current:state.algebra==='overlap'?'초3 5~6월 6-2와 병행':'6-2 이후 시작',blocks:[algebra],note:state.algebra==='overlap'?'초3 5~6월에는 6-2와 초등 계통 대수심화를 함께 공부하고, 초등 계통 대수심화는 총 6개월 이어갑니다.':'6-2를 마친 초3 7월부터 초등 계통 대수심화를 6개월 공부합니다. 중등 시작도 두 달 뒤로 이동합니다.'},
  {id:'calc',label:'연산',status:'unknown',current:'현재 교재·범위 확인 전',blocks:[],note:'이 사례에서 현재 연산 교재는 확인되지 않았습니다. 교과 진도나 L9라는 이유로 특정 권을 배정하지 않습니다.'}
 ];
 const assumptions=[
  '강남권 소마 A 중위권은 이 상담 사례의 설명입니다. 모든 소마 A반 학생의 레벨이나 전국 석차로 적용하지 않습니다.',
  '초2 9월을 시작으로 학년·월을 표시합니다. 원자료의 달력 연도가 확인되지 않아 특정 연도는 붙이지 않습니다.',
  '초등 교과는 학기당 2.5개월, 사고력 각 과정은 6개월, 초등 계통 대수심화는 6개월, 중등은 총 18개월이라는 상담 계획입니다.',
  '중등 여섯 학기를 각각 3개월로 나눈 것은 총 18개월을 보여주기 위한 균등 배분 가정입니다. 학기별 실제 기간과 교재는 별도로 확인합니다.',
  '6-2를 마친 뒤 남은 초등 계통 대수심화 기간에는 교과 단계가 유지됩니다. 대수 공부를 하지 않거나 학습을 쉬는 기간이 아닙니다.',
  '심화 교재를 바꿔도 교과 속도는 자동으로 달라지지 않습니다. 심화 4-1 이후의 권별 기간은 확인되지 않았습니다.',
  '영재원 대비는 기존 공부에 추가하며 교과·사고력·심화·연산의 진도와 진행 속도는 유지합니다.',
  '교육청 영재원은 학습 레벨 번호만으로 지원 여부나 합격 가능성을 정하지 않습니다. 지역·해당 연도 지원 요건을 확인합니다.'
 ];
 const questions=[
  {question:'교과는 5-1인데 사고력은 초급부터 해도 되나요?',answer:'이 사례는 중급에서 어려움이 있어 초급으로 돌아가 조건 해석과 풀이를 보완한 경우입니다. 교과와 사고력은 각각의 출발점에서 이어갑니다. 초급 교재만으로 아이의 종합 수준을 다시 정하지 않습니다.'},
  {question:state.algebra==='overlap'?'5~6월에는 6-2와 초등 계통 대수심화를 함께 하나요?':'6-2 뒤에 초등 계통 대수심화를 시작하면 무엇이 달라지나요?',answer:state.algebra==='overlap'?'네. 6-2의 2.5개월 흐름은 유지하고 초3 5월부터 초등 계통 대수심화를 병행합니다. 6-2가 끝난 뒤에도 초등 계통 대수심화를 이어 총 6개월을 공부하고 초3 11월 중등을 시작하는 계획입니다.':'교과 6-2는 그대로 진행하고 초등 계통 대수심화를 초3 7월에 시작합니다. 초등 계통 대수심화 6개월과 중등 18개월을 유지하므로 중등 시작과 전체 종료가 각각 두 달 늦어집니다.'},
  {question:'소마를 그만두면 사고력도 쉬게 되나요?',answer:'이 사례에서는 소마 수업을 종료한 뒤 1031 초급·중급·3%를 각각 6개월씩 별도로 이어갑니다. 학원 수업에서 이미 다뤘던 내용과 새 교재의 중복을 확인하며 부족한 부분을 보완합니다.'},
  {question:'최상위 교재를 바꾸면 교과 진도도 달라지나요?',answer:'선택한 심화 교재는 별도 영역에 반영합니다. 교재 이름만 바꿨다는 이유로 교과의 2.5개월 속도나 중등 시작을 바꾸지는 않습니다. 심화의 권별 기간은 실제 풀이를 본 뒤 정합니다.'},
  {question:giftedOn?'L9 사례도 교육청 영재원 지원을 검토하나요?':'영재원 검토를 미루면 학습 계획도 바뀌나요?',answer:giftedOn?'이 상담에서는 초3 말 지원 검토를 권했습니다. 지원 자격은 지역과 해당 연도의 모집요강을 확인하며, L9라는 번호만으로 지원 가능 여부나 합격을 판단하지 않습니다.':'지원 검토만 보류하고 교과·사고력·심화 계획은 유지합니다. 다음 지원 시기는 지역과 해당 연도 요강을 확인한 뒤 정하며 자동으로 1년 뒤 시험을 배정하지 않습니다.'},
  {question:academyOn?'초5 3월에는 중등 과정을 모두 마친 상태인가요?':'학원 이동을 보류하면 무엇을 유지하나요?',answer:academyOn?'학원 이동을 검토하는 시점이며 중등 과정은 아직 남아 있습니다. 현재 선택에서는 '+String(middleEnd-30)+'개월이 남으므로 당시 진도·풀이 수준과 입학 전형을 함께 살펴봅니다.':'황소·누테학원 검토를 보류해도 현재 교과·대수·사고력 일정은 유지합니다. 학원 이동 때문에 확인되지 않은 과정을 미리 완료 처리하지 않습니다.'}
 ];
 return {id:ID,label:LABEL,level:'L9',benchmarkScope:'individual-case',state,horizon:HORIZON,now:SOURCE_START,calendarYear:null,start:{grade:2,month:9,label:'초2 9월'},months:Array.from({length:HORIZON},(_,index)=>({...dateAt(index),index})),lanes,events,assumptions,questions,elementaryEnd:10,algebraPhase:{start:algebraStart,end:algebraEnd,overlap:algebra.overlap},middleStart,middleEnd,curriculumPoints,graph:{axis:'school',unit:'course-order',points:curriculumPoints,references:referenceSeries(),algebraPhase:{start:algebraStart,end:algebraEnd},note:'교과 과정의 순서를 비교한 계획선입니다. 초등 계통 대수심화는 별도 구간으로 표시하며 능력·성적이나 합격 예측을 뜻하지 않습니다.'}};
}
global.PlannerCase=Object.freeze({ID,LABEL,HORIZON,OPTIONS,restore,choose,model,dateAt,courseRank});
})(window);
