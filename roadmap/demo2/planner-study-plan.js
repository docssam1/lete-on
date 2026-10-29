/* User-requested study-plan example. Dates are independent of saved learner
 * profiles and source L-level schedules; those schedules are read only for a
 * separate current-position comparison. Offsets are months from November 2026, end-exclusive.
 * A dated plan is not a record of completion or an academy admission result. */
(function(global){
'use strict';
const ID='grade5-application-middle',TITLE='초5 남학생 · 교과·활용·연산 로드맵';
const START=Object.freeze({year:2026,month:11,grade:5}),NOW=94,HORIZON=45;
const OPTIONS=Object.freeze({winter:Object.freeze(['calculation','review']),academy:Object.freeze(['summer','afterFinish']),scienceMode:Object.freeze(['academy','home'])});
const DEFAULTS=Object.freeze({version:1,id:ID,winter:'calculation',academy:'summer',scienceMode:'academy'});
const CURRENT=Object.freeze([
 Object.freeze({id:'school',label:'교과',text:'5-2 응용 진행 중',confirmed:true}),
 Object.freeze({id:'calc',label:'연산',text:'초6 1학기 정도 · 디딤돌 연산 6A부터 연결하는 가정',confirmed:false}),
 Object.freeze({id:'thinking',label:'사고력',text:'현재 사고력 교재·진도 미확인',confirmed:false})
]);
function restore(value){
 const input=value&&typeof value==='object'&&!Array.isArray(value)&&value.version===1&&value.id===ID?value:{};
 return {...DEFAULTS,...Object.fromEntries(Object.entries(OPTIONS).filter(([key,values])=>values.includes(input[key])).map(([key])=>[key,input[key]]))};
}
function choose(value,key,selection){const state=restore(value);return Object.hasOwn(OPTIONS,key)&&OPTIONS[key].includes(selection)?{...state,[key]:selection}:state;}
function dateAt(offset=0){
 if(typeof offset!=='number'||!Number.isFinite(offset))return null;
 const monthOffset=Math.floor(offset),calendar=START.year*12+START.month-1+monthOffset,year=Math.floor(calendar/12),month=((calendar%12)+12)%12+1,grade=Math.floor((NOW+monthOffset-2)/12)-2;
 const gradeLabel=grade<=6?'초'+grade:grade<=9?'중'+(grade-6):'고'+(grade-9);
 return {index:monthOffset,offset,year,month,grade,gradeLabel,quarter:Math.floor((month-1)/3)+1,label:year+'년 '+gradeLabel+' '+month+'월'};
}
function block(id,title,start,end,stage,book,note,kind='study',extra={}){return {id,title,start,end,stage,book,note,method:note,kind,completed:false,...extra};}
function assessment(){
 const basis=START.year+'년 '+START.month+'월 설계 기준',course='5-2 응용 진행 중',key=title=>String(title||'').match(/^(?:[1-6]-[12]|중[1-3]-[12]|공통수학[12])/u)?.[0]||null;
 const sources=(Array.isArray(global.PLANNER_LEVELS)?global.PLANNER_LEVELS:[]).filter(source=>/^L\d+$/.test(source?.id)&&Array.isArray(source.school));
 const blocks=source=>source.school.filter(b=>Array.isArray(b)&&key(b[0])&&Number.isFinite(b[1])&&Number.isFinite(b[2])&&b[2]>=b[1]);
 const candidates=sources.map(source=>{const same=blocks(source).find(b=>key(b[0])==='5-2');return same?{source,same,anchor:(same[1]+same[2])/2}:null;}).filter(Boolean);
 const nearest=candidates.reduce((best,item)=>!best||Math.abs(NOW-item.anchor)<Math.abs(NOW-best.anchor)?item:best,null);
 const reference=(source,own=false)=>{
  const rows=blocks(source),active=rows.find(b=>b[1]<=NOW&&NOW<=b[2]),previous=rows.filter(b=>b[2]<NOW).at(-1),next=rows.find(b=>b[1]>NOW),same=rows.find(b=>key(b[0])==='5-2'),paceBlock=own?same:active||next;
  const range=active?key(active[0])+' 교과':previous&&next?key(previous[0])+' → '+key(next[0])+' 사이 일정':previous?key(previous[0])+' 이후 · 이 시기 범위 확인 필요':'이 시기 범위 확인 필요';
  const label=previous&&key(previous[0])==='6-2'&&next&&key(next[0])==='중1-1'?'초등 6-2 이후 중등 진입을 준비하는 참고 단계':active?'현재 '+key(active[0])+' 개념·유형을 공부하는 참고 단계':'다음 '+(next?key(next[0])+' 교과를 준비하는 참고 단계':'학습 범위 확인이 필요한 참고 단계');
  return {id:source.id,label:own?'초5 현행 응용을 다지며 6학년 진도로 넘어갈 준비 단계('+source.id+' 근처)':label+'('+source.id+')',course:own?course:active?key(active[0])+' 교과':next?key(next[0])+' 진입 준비':'범위 확인 필요',range,referenceRange:range,pace:{course:paceBlock?key(paceBlock[0]):null,months:paceBlock?paceBlock[2]-paceBlock[1]+1:null}};
 };
 const current=nearest?reference(nearest.source,true):{id:null,label:'초5 현행 응용을 다지며 6학년 진도로 넘어갈 준비 단계',course,referenceRange:'레벨 비교 자료 확인 필요',pace:{course:null,months:null}};
 const number=nearest?Number(nearest.source.id.slice(1)):null,next=number===null?[]:[number-1,number-2].filter(n=>n>=0).map(n=>sources.find(source=>source.id==='L'+n)).filter(Boolean).map(source=>reference(source));
 const referenceMonths=next.find(item=>item.pace.course?.startsWith('중'))?.pace.months||null;
 return {basis,current,next,note:'L번호는 같은 학년·월에 어떤 교과를 공부하는지 비교한 참고 위치입니다. 연산은 6-1 안팎이고 사고력의 현재 과정은 아직 확인하지 않았으므로, 교과 위치를 종합 실력·백분위·합격 가능성으로 바꾸어 설명하지 않습니다.',planPace:{middleMonths:3,referenceMiddleMonths:referenceMonths,text:referenceMonths?'이번 중등 계획은 한 학기 3개월로, 위 참고안의 '+referenceMonths+'개월보다 '+(referenceMonths-3)+'개월 짧게 잡았습니다. 기간을 채운 것만으로 다음 학기로 넘어가지 않고 대표 유형과 오답을 혼자 풀고 설명하는지 확인하겠습니다.':'이번 중등 계획은 한 학기 3개월입니다. 대표 유형과 오답을 혼자 풀고 설명하는지 확인한 뒤 다음 학기로 이어가겠습니다.'}};
}
function graphReading(){return {
 title:'초록색 선이 계단인 이유',
 body:'보라색은 새 교과를 공부하는 기간을 나누어 연결한 선입니다. 쎈을 배정한 가로 구간에서도 쎈은 계속 공부하며, 한 학기의 활용과 오답을 정리할 예정인 달에 높이를 올려 마무리 시점을 표시했습니다. 수직선은 그때 실력이 갑자기 뛰어오른다는 뜻이 아닙니다.',
 example:'초6 8~10월에는 교과 중1-2와 쎈 중1-1을 병행합니다. 초록색 선은 이 석 달 동안 같은 높이로 이어지고, 10월 말 쎈 중1-1의 마무리 목표에서 한 칸 올라갑니다.',
 exams:'회색 내신 구간에서는 새 선행을 멈추고 학교 시험 범위와 배운 문제의 오답을 복습합니다. 그래서 보라색 교과 선도 수평으로 이어집니다. 초5 겨울은 쎈 새 교재 대신 중1 연산에 집중하는 별도 구간입니다. 각 시기에 배정한 공부는 월별 표와 함께 보겠습니다.'
};}
function schoolBlocks(){
 const stages=['6-1','6-2','중1-1','중1-2','중2-1','중2-2','중3-1','중3-2'];
 return [...stages.map((stage,index)=>{
  const start=index*3,end=start+3,middle=stage.startsWith('중'),book=middle?'개념+유형 라이트 + 개념원리 RPM':'디딤돌 응용';
  const phases=middle?[
   {start,end:start+1.5,title:'개념+유형 라이트 · 개념·기본 유형',book:'개념+유형 라이트'},
   {start:start+1.5,end,title:'개념원리 RPM · 유형·활용·오답',book:'개념원리 RPM'}
  ]:[
   {start,end:start+1.5,title:'개념과 대표 유형',book},
   {start:start+1.5,end,title:'응용·활용과 오답 정리',book}
  ];
  const note=middle?'한 학기 3개월 안에서 개념+유형 라이트로 개념과 기본 유형을 먼저 다루고, RPM으로 유형·활용과 오답을 정리합니다. 각 1.5개월은 역할을 나누어 보여 주는 계획이며 단원별로 조정합니다.':'한 학기 3개월 동안 개념과 대표 유형을 익히고 응용 문제의 조건·식을 연결합니다. 마지막에는 틀렸던 문제를 도움 없이 다시 풀어 보고 다음 학기로 이어갑니다.';
  return block('school-'+stage,stage+' '+book,start,end,stage,book,note,'school',{phases,fullMonths:3,durationBasis:'user-three-month-semester'});
 }),block('school-review','중등 전 범위 종합 복습',24,27,'중등 종합','공부한 개념+유형 라이트·RPM의 오답과 비어 있는 단원','중3-2를 마친 뒤 배운 중등 개념·유형·활용을 함께 점검합니다. 틀린 이유를 설명하고 다른 단원의 개념을 연결하며, 다음 공통수학1의 개념·유형으로 이어갈 준비를 합니다.','review')];
}
function depthBlocks(state){
 const winter=state.winter==='calculation'?'초5 겨울에는 6-2 심화 교재를 추가하지 않고 기적의 중학연산 1A·1B에 집중합니다. 교과 6-1·6-2는 위 교과 일정대로 이어갑니다.':'초5 겨울에는 6-2 심화 교재를 추가하지 않습니다. 중1 연산을 중심으로 공부하면서 이미 다룬 5-2·6-1의 오답 중 꼭 필요한 문제만 함께 확인합니다.';
 const result=[
  block('depth-5-2','5-2 쎈 초등수학',0,2,'5-2','쎈 초등수학','현재 응용에서 배운 5-2를 쎈의 대표 유형·활용으로 다시 적용합니다. 맞힌 문항의 수보다 조건을 읽고 식의 이유를 설명하는지, 틀린 문제를 혼자 다시 푸는지를 확인합니다.','application'),
  block('winter-support','겨울 · 중1 연산 집중',2,4,null,'기적의 중학연산 1A·1B',winter,'support'),
  block('depth-6-1','6-1 쎈 초등수학',4,6,'6-1','쎈 초등수학','새 교과 6-2를 공부하면서 먼저 배운 6-1을 쎈으로 정리합니다. 겨울에 하지 않은 6-2 심화를 이 구간에 겹쳐 넣지 않습니다.','application'),
  block('application-middle-1-1','중1-1 배운 단원 · RPM 활용 연습',6,9,'중1-1','개념원리 RPM','중1-1 개념 진도에서 배운 단원의 RPM 활용과 오답을 연결합니다. 이 구간은 새 쎈 교재를 한 권 더 시작하는 일정이 아니며, 교과 행의 RPM과 같은 공부입니다.','application',{sharedWith:'school-중1-1',additionalBook:false})
 ];
 for(let index=0;index<6;index++){
  const stage='중'+(Math.floor(index/2)+1)+'-'+(index%2+1),start=9+index*3;
  result.push(block('depth-'+stage,stage+' 쎈 중등수학',start,start+3,stage,'쎈 중등수학','먼저 배운 '+stage+'을 쎈의 대표 유형·활용과 오답으로 정리합니다. 새 교과 진도와 나란히 이어가되 풀이를 기억한 문제는 줄이고, 막혔던 조건과 다시 풀어야 할 유형에 시간을 씁니다.','application',{fullMonths:3,durationBasis:'planned-following-application'}));
 }
 return result;
}
function calcBlocks(){
 return [
  block('calc-6A','디딤돌 연산 6A',0,1,'6A','디딤돌 연산 6A','현재 연산이 초6 1학기 정도라는 설명을 6A 출발로 옮긴 가정입니다. 실제 남은 범위를 확인하고 이미 익힌 부분은 중복하지 않습니다.','calculation',{assumedCurrent:true}),
  block('calc-6B','디딤돌 연산 6B',1,2,'6B','디딤돌 연산 6B','초등 연산의 남은 범위를 이어갑니다. 계산 원리와 자주 생기는 오류를 확인한 뒤 기적의 중학연산으로 넘어갑니다.','calculation'),
  block('calc-1A','기적의 중학연산 1A',2,3,'중1A','기적의 중학연산 1A','초5 겨울에는 중1 연산을 먼저 준비합니다. 새 개념을 설명하고 대표 계산을 정확히 쓰는 데 집중합니다.','calculation'),
  block('calc-1B','기적의 중학연산 1B',3,4,'중1B','기적의 중학연산 1B','1A와 이어지는 중1 연산을 공부하고, 부호·분수·문자식 등 틀린 계산은 풀이 과정을 남겨 다시 확인합니다.','calculation'),
  block('calc-1-review','중1 연산 · 오답과 정확도 유지',4,6,'중1','기적의 중학연산 1A·1B 오답','겨울에 다룬 중1 연산을 짧게 누적 복습합니다. 한 권을 다시 전부 풀기보다 틀린 계산과 교과에 필요한 계산을 골라 확인합니다.','review'),
  block('calc-geometry-1','기적의 중학도형 1권',6,8,'중1도형','기적의 중학도형 1권','중등 도형의 기본 개념과 계산을 연결합니다. 그림의 표시와 조건을 읽은 뒤 식을 쓰고, 연산과는 다른 흐름으로 정리합니다.','geometry'),
  block('calc-2A','기적의 중학연산 2A',8,9,'중2A','기적의 중학연산 2A','다음 교과에 필요한 중2 연산을 먼저 익힙니다. 계산 과정과 개념의 뜻을 함께 설명합니다.','calculation'),
  block('calc-2B','기적의 중학연산 2B',9,10,'중2B','기적의 중학연산 2B','중2 연산의 다음 범위를 이어가며 앞 권의 오류도 함께 확인합니다.','calculation'),
  block('calc-geometry-2','기적의 중학도형 2권',10,12,'중2도형','기적의 중학도형 2권','도형의 관계와 계산을 연결하고, 그림에 주어진 조건을 빠뜨리지 않는지 확인합니다.','geometry'),
  block('calc-3A','기적의 중학연산 3A',12,13,'중3A','기적의 중학연산 3A','중3 연산의 기본 원리를 먼저 익히고 대표 계산을 확인합니다.','calculation'),
  block('calc-3B','기적의 중학연산 3B',13,14,'중3B','기적의 중학연산 3B','중3 연산의 남은 범위를 이어가며 앞 권에서 틀린 유형을 함께 점검합니다.','calculation'),
  block('calc-geometry-3','기적의 중학도형 3권',14,16,'중3도형','기적의 중학도형 3권','도형의 조건과 계산을 연결하며 중등 도형의 기본을 정리합니다.','geometry'),
  block('calc-maintain','중등 연산·고등 식 계산 연결',16,HORIZON,'중등 연산·고등 식 계산','공부한 중학연산·중학도형 오답과 현재 교과','현재 교과에서 쓰는 계산과 반복 오류를 짧게 확인합니다. 공통수학에서는 공부 중인 기본정석·쎈의 식 계산과 전개·인수분해 등 필요한 계산을 연결합니다. 별도 고등 연산 교재를 자동으로 추가하지 않으며, 내신 집중월에는 학교 범위와 이전 오답을 복습합니다.','review',{advances:false})
 ];
}
function thinkingBlocks(){return [
 block('thinking-before-course','쎈 5-2 먼저 마무리',0,2,null,'쎈 초등수학 5-2','현재 사고력 교재와 진도는 확인하지 않았습니다. 이 기간에는 활용 행의 쎈 5-2를 먼저 마무리하고, 사고력 새 교재는 그다음에 시작합니다. 같은 쎈 과제를 사고력 공부로 다시 더하지 않습니다.','context',{advances:false,sharedWith:'depth-5-2',additionalBook:false}),
 block('thinking-3percent-1','3% 올림피아드 1과정',2,8,'3% 1과정','3% 올림피아드 1과정','5학년 심화에 해당하는 쎈 5-2를 2026년 12월까지 마무리한 뒤, 2027년 1~6월 여섯 달 동안 진행하는 계획입니다. 이 기간 안에서 조건 정리, 독립 풀이, 풀이 설명과 오답 재풀이를 함께 합니다. 1과정은 이 여섯 달로 마무리하며 이후 복습 구간을 따로 늘리지 않습니다.','thinking',{proposed:true,confirmed:false,fullMonths:6,advances:true,afterBlock:'depth-5-2',durationBasis:'user-six-month-thinking-course'})
];}
function classPlan(state){const home=state.scienceMode==='home';return {
 elementary:{sessions:2,hours:2},middle:{sessions:2,hours:2},high:{sessions:2,hours:3},
 science:{mode:state.scienceMode,sessions:home?2:1,minMinutes:home?40:90,maxMinutes:home?50:120,label:home?'가정 학습 주 2회 · 회당 40~50분':'학원 주 1회 · 회당 90~120분',note:'수업 형태를 바꾸어도 과학의 월별 범위를 자동으로 앞당기지 않습니다. 설명과 문제 풀이, 숙제에 드는 실제 시간을 확인하며 분량을 맞춥니다.'},
 note:'이번 초5 사례의 초등 교과 수업은 주 2회, 회당 2시간입니다. 중등도 주 2회 2시간, 고등은 주 2회 3시간으로 둡니다. 수업 회차만으로 진도가 더 빨라지거나 레벨이 올라간 것으로 계산하지 않습니다.'
};}
function academyPlan(state){
 const summer=state.academy==='summer';
 return {mode:state.academy,blocks:summer?[
  block('academy-summer-plan','7월 · 중1-2 특강 범위 확인',8,9,'중1-2','여름방학 특강 안내·현재 교재','7월에는 중1-1을 마무리하면서 8월 중1-2 특강의 범위와 주간 과제량을 확인합니다. 이 칸을 특강 한 달의 실제 수강이나 중1-2 완료로 표시하지 않습니다.','preparation'),
  block('academy-summer-intensive','8월 · 중1-2 특강 한 달',9,10,'중1-2','중1-2 여름방학 특강 + 개념+유형 라이트·RPM','중1-2 기본 진도와 여름방학 특강을 연결하고 쎈 중1-1을 병행합니다. 특강에서 다룬 범위가 기존 진도와 겹치면 같은 과제를 두 번 더하지 않습니다. 중1-2 전체 완료는 10월입니다.','intensive')
 ]:[
  block('academy-after-finish-prep','11월 · 중1-2 완료 후 한 달 보완',12,13,'중1-2','중1-1·1-2 개념·유형·활용 오답','중1-2를 10월에 마친 뒤 한 달 동안 범위 누락과 활용 문제를 보완합니다. 중2-1 진도와 쎈 중1-2는 원래 일정대로 함께 이어갑니다.','preparation')
 ],events:summer?[
  {id:'academy-summer-check',at:8,title:'여름 특강 범위·과제량 확인',note:'7월은 준비 계획입니다. 실제 특강 한 달은 8월로 구분합니다.',kind:'preparation'},
  {id:'academy-summer-test',at:10,title:'대형학원 레벨테스트 검토',note:'초6 9월, 중1-2를 10월에 마치기 전의 검토입니다. 당시 응시 범위와 학원 공지를 확인하고 준비된 범위로 응시 여부를 정합니다.',kind:'academy',beforeMiddle12Completion:true}
 ]:[
  {id:'academy-after-finish-check',at:12,title:'중1-2 완료 후 레벨테스트 준비',note:'10월 완료 뒤 11월 한 달 동안 빠진 단원과 활용을 보완합니다.',kind:'preparation'},
  {id:'academy-after-finish-test',at:13,title:'대형학원 레벨테스트 검토',note:'초6 12월, 한 달 보완 뒤 실제 학원의 응시 범위·시험 일정을 확인합니다. 합격이나 반 배정을 예정한 일정은 아닙니다.',kind:'academy',beforeMiddle12Completion:false}
 ]};
}
function mergedMonths(months){return months.reduce((segments,month)=>{const last=segments.at(-1);if(last?.end===month)last.end++;else segments.push({start:month,end:month+1});return segments;},[]);}
function highPlans(){
 const definitions=[
  {id:'common1',stage:'공통수학1',start:27,end:36,activeMonths:[27,28,30,32,33,35],pausedMonths:[29,31,34]},
  {id:'common2',stage:'공통수학2',start:37,end:45,activeMonths:[37,38,39,40,42,44],pausedMonths:[41,43]}
 ];
 return definitions.map(item=>({...item,title:item.stage+' · 기본·유형과 쎈 활용',activeLearningMonths:6,calendarMonths:item.end-item.start,phases:[
  {id:'basic',title:'개념·유형',book:'기본정석 '+item.stage,activeMonths:item.activeMonths.slice(0,3)},
  {id:'application',title:'쎈 활용',book:'쎈 '+item.stage,activeMonths:item.activeMonths.slice(3)}
 ].map(phase=>({...phase,activeLearningMonths:3,segments:mergedMonths(phase.activeMonths)}))}));
}
function examSchedule(){
 return Array.from({length:HORIZON-27},(_,index)=>index+27).filter(offset=>{const date=dateAt(offset);return date.grade>=8&&[4,6,9,11].includes(date.month);}).map(offset=>{
  const date=dateAt(offset);
  return {id:'exam-'+offset,start:offset,end:offset+1,at:offset,year:date.year,month:date.month,grade:date.grade,gradeLabel:date.gradeLabel,dateLabel:date.label,title:date.gradeLabel+' 내신 집중·복습 · '+date.month+'월 예시',kind:'exam',estimated:true,advances:false,newProgress:false,note:'학교 내신 대비에 약 3주를 두고 남은 주에는 배운 범위를 복습하는 예시입니다. 이 달에는 새 선행 진도를 나가지 않습니다. 정확한 시험일은 학교 일정에 맞춰 조정합니다.'};
 });
}
function highLanes(plans,exams){
 const examByMonth=new Map(exams.map(exam=>[exam.start,exam])),monthPhase=offset=>{for(const plan of plans)for(const phase of plan.phases)if(phase.activeMonths.includes(offset))return {plan,phase};return null;};
 const append=(list,key,create)=>{const previous=list.at(-1);if(previous?.mergeKey===key&&previous.end===create.start)previous.end=create.end;else list.push({...create,mergeKey:key});};
 const school=[],deep=[],examRow=[block('exams-regular-middle','정규 교과·활용·연산',0,27,null,'기존 수학 계획','중등 과정까지의 기존 교과·쎈·연산 일정을 유지합니다. 중학교의 실제 시험 일정이 다르면 해당 학교 범위를 먼저 확인합니다.','context',{advances:false})];
 for(let month=27;month<HORIZON;month++){
  const exam=examByMonth.get(month),active=monthPhase(month);
  if(exam){
   append(school,'exam-'+month,block('school-'+exam.id,'내신 대비·배운 범위 복습',month,month+1,null,'학교 수학 교과서·평가 자료 + 기존 오답',exam.note,'exam',{advances:false,examId:exam.id}));
   append(deep,'exam-'+month,block('depth-'+exam.id,'내신 대비·활용 오답 정리',month,month+1,null,'학교 범위 + 공부한 중등·고등 쎈 오답',exam.note,'exam',{advances:false,examId:exam.id}));
   examRow.push(block(exam.id,exam.title,month,month+1,null,'학교 시험 범위·평가 자료',exam.note,'exam',{advances:false,estimated:true}));
   continue;
  }
  if(!active)continue;
  const {plan,phase}=active,key=plan.id+'-'+phase.id,phaseStart=phase.segments.find(segment=>segment.start<=month&&segment.end>month).start,schoolId='school-'+key+'-'+phaseStart;
  const note=phase.id==='basic'?'실제 선행을 공부하는 세 달 동안 기본정석으로 개념·기본 유형을 익힙니다. 내신 집중월에는 새 단원을 멈추고 학교 시험과 이전 범위를 복습한 뒤 다음 활동월에 이어갑니다.':'기본·유형을 다룬 뒤 쎈으로 대표 유형·활용과 오답을 정리하는 실학습 세 달입니다. 별도 심화 교재를 더하지 않고 틀린 이유와 풀이를 혼자 설명하는지 확인합니다.';
  append(school,key,block(schoolId,plan.stage+' '+phase.title,month,month+1,plan.stage,phase.book,note,phase.id==='basic'?'school':'application',{advances:true,highCourseId:plan.id,phaseId:phase.id,durationBasis:'six-active-months-with-exam-pauses'}));
  if(phase.id==='basic')append(deep,key,block('depth-'+key+'-'+phaseStart,'중등 활용·취약 단원 유지',month,month+1,null,'공부한 중등 쎈·RPM 오답','새 공통수학의 개념·유형을 배우는 동안 중등에서 자주 막혔던 계산·활용만 짧게 유지합니다. 고등 쎈을 동시에 한 권 더 시작하는 일정은 아닙니다.','review',{advances:false,highCourseId:plan.id,phaseId:phase.id}));
  else append(deep,key+'-'+schoolId,block('depth-'+key+'-'+phaseStart,plan.stage+' 쎈 활용 · 교과 행과 같은 공부',month,month+1,plan.stage,phase.book,'교과 행에 표시한 같은 쎈 활용 공부입니다. 교재와 과제를 별도 한 권으로 중복해서 더하지 않습니다.','application',{advances:true,highCourseId:plan.id,phaseId:phase.id,sharedWith:schoolId,additionalBook:false}));
  append(examRow,'regular',block('exams-regular-'+month,'고등 개념·활용 선행',month,month+1,null,'공통수학 계획','내신 집중월을 제외한 활동월에 공통수학의 개념·유형과 쎈 활용을 이어갑니다.','context',{advances:false}));
 }
 return {school:school.map(({mergeKey,...item})=>item),deep:deep.map(({mergeKey,...item})=>item),exams:examRow.map(({mergeKey,...item})=>item)};
}
function model(value){
 const state=restore(value),academy=academyPlan(state),highPlan=highPlans(),exams=examSchedule(),high=highLanes(highPlan,exams),school=[...schoolBlocks(),...high.school],deep=[...depthBlocks(state),...high.deep],calc=calcBlocks(),position=assessment(),reading=graphReading(),classes=classPlan(state);
 const lanes=[
  {id:'school',label:'교과 진도',current:'5-2 응용 진행 중',status:'planned',blocks:school,note:'6-1부터 중3-2까지 한 학기 3개월, 중등 종합 복습 세 달을 유지합니다. 그 뒤 공통수학1·2는 각각 실학습 6개월로 공부하고 내신 집중월에는 새 선행 진도를 멈춥니다.'},
  {id:'deep',label:'응용·활용 · 후행',current:'5-2 쎈으로 활용을 다지는 계획',status:'planned',blocks:deep,note:'최상위 대신 쎈을 사용합니다. 새 진도와 먼저 배운 범위의 활용을 나란히 놓되, 초5 겨울에는 중1 연산을 우선합니다.'},
  {id:'calc',label:'연산·도형',current:'초6 1학기 정도 · 디딤돌 연산 6A 출발 가정',status:'planned',blocks:calc,note:'디딤돌 연산 6B 뒤 기적의 중학연산으로 연결합니다. 연산 A·B를 합쳐 두 달, 중학도형 한 권은 두 달로 배치한 계획입니다. 이후 현재 교과의 식 계산과 오답을 유지하며 별도 고등 연산책은 더하지 않습니다.'},
  {id:'exams',label:'내신·선행 배분',current:'중2부터 학교 시험월을 예시로 예약',status:'planned',blocks:high.exams,note:'중2 이후 4·6·9·11월을 내신 집중월로 예약한 예시입니다. 약 3주는 학교 내신을 준비하고 남은 주에는 복습하며, 새 선행 진도는 나가지 않습니다. 실제 학교 일정에 따라 옮깁니다.'},
  {id:'thinking',label:'사고력',current:'현재 사고력 교재·진도 미확인',status:'unknown',blocks:thinkingBlocks(),note:'쎈 5-2를 마무리한 뒤 3% 올림피아드 1과정을 여섯 달 동안 공부하는 미래 계획입니다. 현재 사고력 수준이나 이수 기록을 대신하지 않습니다.'}
 ];
 const events=[...academy.events,
  {id:'middle-1-2-complete',at:12,title:'중1-2 교과 계획 마무리',note:'2027년 10월까지의 계획입니다. 이 표시는 지금 중1-2를 완료했다는 이수 기록이 아닙니다.',kind:'school'},
  {id:'middle-2-1-start',at:12,title:'중2-1 교과와 중1-2 쎈 병행',note:'중2-1을 새로 배우면서 먼저 배운 중1-2의 유형·활용을 다집니다.',kind:'school'},
  {id:'middle-3-2-complete',at:24,title:'중3-2 교과 계획 마무리',note:'2028년 10월까지 새 교과 진도를 이어가고, 쎈 중3-2와 중등 종합 복습을 2029년 1월까지 연결합니다.',kind:'school'},
  {id:'middle-review-complete',at:27,title:'중등 활용·종합 점검',note:'2029년 1월까지 중등 활용과 종합 복습을 마무리하고, 배운 개념을 독립적으로 적용하는지 확인한 뒤 공통수학1로 연결합니다.',kind:'review'},
  {id:'common1-complete',at:36,title:'공통수학1 기본·쎈 활용 계획 마무리',note:'2029년 10월까지 실제 선행 학습 여섯 달을 배치했습니다. 4·6·9월 내신 집중월에는 새 진도 없이 학교 시험과 복습에 집중하고, 11월도 내신 집중월로 둡니다.',kind:'school'},
  {id:'common2-complete',at:45,title:'공통수학2 기본·쎈 활용 계획 마무리',note:'2030년 7월까지 실제 선행 학습 여섯 달을 배치했습니다. 중3의 4·6월 내신 집중월에는 새 선행을 멈추고 학교 범위와 복습을 우선합니다.',kind:'school'}
 ].sort((a,b)=>a.at-b.at).map(event=>({...event,date:dateAt(event.at)}));
 const assumptions=[
  '과학은 '+classes.science.label+'으로 시작하는 예시입니다. 학원 수업과 가정 학습의 시간만 맞추어 같은 학습 효과로 보지 않으며, 이 선택으로 과학의 월별 범위를 자동 단축하지 않습니다.',
  '이번 초5 사례의 초등 교과 수업은 주 2회, 회당 2시간입니다. 같은 회차의 중등은 회당 2시간, 고등은 회당 3시간이며, 회차를 이유로 기존 월별 진도를 자동으로 앞당기지 않습니다.',
  '3% 올림피아드 1과정은 5-2 쎈을 2026년 12월까지 마무리한 뒤 2027년 1~6월 여섯 달로 배치했습니다. 쎈 마무리가 늦어지면 사고력 시작도 그 뒤로 옮깁니다. 현재 사고력의 실제 교재·완료 범위는 아직 미확인입니다.',
  '3% 올림피아드 1과정의 풀이 설명과 오답 재풀이는 배정한 여섯 달 안에 포함합니다. 2027년 6월에 마무리하며, 이후나 중학교 기간에 이 과정의 복습을 계속 배정하지 않습니다.',
  '이 예시는 현재 초5 남학생, 교과 5-2 응용 진행 중이라는 설명에서 출발합니다. 현재 5-2를 완료 처리하지 않습니다.',
  '2026년 11월에 6-1을 시작하는 계획입니다. 시작 전 현재 5-2의 남은 범위와 마무리를 확인합니다. 실제 시작이 늦어지면 이후 일정도 함께 이동합니다.',
  '6-1부터 중1-2까지 네 학기를 각각 3개월로 잡아 2027년 10월까지 이어갑니다. 여름방학에 중1-2 전체를 마친 계획과 구분합니다.',
  '중등 교과의 개념+유형 라이트 1.5개월·RPM 1.5개월은 3개월 안에서 교재 역할을 보여 주는 배치입니다. 각 책의 고정 완료 기간이나 숙달을 보장하지 않습니다.',
  '쎈은 현재 교과보다 앞서 더 어려운 범위를 넣는 과정이 아니라, 먼저 배운 범위의 유형·활용·오답을 후행으로 다지는 계획입니다. 최상위·일품·에이급을 자동으로 추가하지 않습니다.',
  '초5 겨울에는 별도 6-2 심화 교재를 추가하지 않고 중1 연산에 집중합니다. 교과 진도는 같은 3개월 속도로 이어갑니다.',
  '현재 연산의 정확한 권·남은 분량은 확인되지 않아 초6 1학기 정도를 디딤돌 연산 6A 출발로 가정했습니다. 6A·6B 각 한 달은 조정할 계획 기간입니다.',
  '연산은 예정된 달이 되었다고 다음 권으로 자동 이동하지 않습니다. 실제 남은 분량과 계산 정확도가 부족하면 해당 권의 완료월과 이후 연산 일정을 뒤로 조정합니다.',
  '중1-1 RPM 활용 연습 칸은 교과에서 사용하는 같은 RPM의 활용 공부입니다. 동일한 책과 과제를 별도 한 권으로 중복 배정하지 않습니다.',
  state.academy==='summer'?'여름 선택은 8월 중1-2 특강 한 달 뒤 9월 레벨테스트를 검토합니다. 중1-2 교과 전체 완료는 10월이므로 실제 응시 범위를 먼저 확인합니다.':'완료 후 선택은 10월 중1-2를 마친 뒤 11월에 한 달 보완하고 12월 레벨테스트를 검토합니다.',
  '레벨테스트는 지원 검토 시점입니다. 시험 일정·출제 범위·반 배정은 해당 학원의 실제 안내를 따르며 특정 대형학원 합격을 전제하지 않습니다.',
  '중3-2 뒤에는 종합 복습과 쎈 중3-2를 2029년 1월까지 유지합니다. 이후 공통수학1·2는 각각 기본정석의 개념·유형 실학습 3개월과 쎈 활용 실학습 3개월로 배치합니다.',
  '중2부터 4·6·9·11월을 학교 내신 집중월로 예약한 예시입니다. 학교 시험 준비 약 3주와 남은 주의 복습을 두고, 새 선행 진도는 나가지 않습니다. 학교별 실제 시험일과 평가 범위에 따라 예약 월은 조정합니다.',
  '중1의 자유학기 운영과 지필평가 일정은 아직 확인되지 않았습니다. 중1에도 정기시험이 있다면 해당 준비 기간만큼 중등 선행과 이후 공통수학의 시작·완료월을 뒤로 옮겨야 합니다. 현재 공통수학 날짜는 중2부터 네 차례 내신 집중월을 둔 예시입니다.',
  '공통수학1은 2029년 2·3·5월에 기본정석으로 개념·유형, 7·8·10월에 쎈 활용을 공부합니다. 4·6·9월은 내신과 복습에 사용하며 11월 내신 뒤 12월 공통수학2를 시작합니다.',
  '공통수학2는 2029년 12월과 2030년 1·2월에 기본정석으로 개념·유형, 3·5·7월에 쎈 활용을 공부합니다. 4·6월에는 내신과 복습을 우선합니다. 내신 대비 때문에 실학습 기간을 압축하지 않습니다.',
  '고등 쎈 활용이 교과 행과 활용 행에 함께 보이는 구간은 같은 공부를 연결해 표시한 것입니다. 교재·숙제를 두 번 더하거나 실학습 6개월을 더 짧게 계산하지 않습니다.',
  '고등 연산 부교재나 학습 레벨 번호는 자동으로 부여하지 않습니다. 현재 공통수학 교재의 식 계산과 중등에서 반복된 오류를 연결해 확인합니다.'
 ];
 const questions=[
  {question:'과학은 학원과 집에서 각각 어떻게 공부하나요?',answer:'현재 선택은 '+classes.science.label+'입니다. 학원은 설명과 탐구·유형 수업 뒤 필요한 숙제를 정리하고, 가정 학습은 두 차례에 개념·대표 탐구와 문제·오답을 나누어 봅니다. 어느 쪽이든 같은 월별 범위를 유지하며, 아이가 설명하고 혼자 풀 수 있는지 보고 분량을 맞추겠습니다.'},
  {question:'초등 교과 수업도 주 2회로 공부하나요?',answer:'네. 이번 사례는 초등 교과도 주 2회, 회당 2시간으로 잡습니다. 중등은 주 2회 2시간, 고등은 주 2회 3시간으로 이어갑니다. 회차만으로 진도를 당기지 않고, 기존의 한 학기 3개월 안에서 개념·유형·활용과 오답을 정리하겠습니다.'},
  {question:'3% 올림피아드 1과정은 언제 시작하나요?',answer:'쎈 5-2를 먼저 마무리한 뒤 시작합니다. 지금 계획에서는 쎈 5-2가 2026년 12월까지이므로, 3% 올림피아드 1과정은 2027년 1~6월 여섯 달입니다. 마무리가 늦어지면 사고력도 그 뒤로 옮기겠습니다. 교과와 연산은 각 일정대로 병행합니다.'},
  {question:'3% 1과정을 중학교까지 계속 하나요?',answer:'아닙니다. 5학년 심화를 마친 뒤 2027년 1~6월 여섯 달 동안 공부하고 마무리합니다. 풀이 설명과 오답 재풀이도 이 기간에 포함합니다. 이후 표에는 1과정의 반복 복습이나 다음 과정을 자동으로 배정하지 않습니다.'},
  {question:'현재 교과는 어느 레벨 정도로 보면 되나요?',answer:position.current.label+'입니다. '+position.planPace.text+' '+position.note},
  {question:'쎈 그래프의 가로선은 공부를 멈춘다는 뜻인가요?',answer:reading.body+' '+reading.example+' '+reading.exams},
  {question:'교과와 쎈을 왜 다른 학기로 공부하나요?',answer:'새 교과에서는 개념과 기본 유형을 이해하고, 쎈에서는 먼저 배운 범위를 혼자 적용하는 힘을 다지려는 계획입니다. 예를 들어 중1-2를 배우는 동안 쎈 중1-1을 이어갑니다. 두 교재의 진도를 맞추기보다 어느 문제를 혼자 해결하는지 보겠습니다.'},
  {question:'초5 겨울에는 6-2 심화를 하지 않나요?',answer:state.winter==='calculation'?'네. 이 계획에서는 6-2 심화 교재를 추가하지 않고 중1 연산을 먼저 준비합니다. 계산이 준비되어야 이후 중1-1의 개념과 활용에 시간을 쓸 수 있습니다. 교과 6-1·6-2 진도는 예정대로 이어갑니다.':'6-2 심화 교재는 추가하지 않습니다. 중1 연산을 중심으로 공부하되, 이미 배운 5-2·6-1의 오답 중 필요한 문제만 함께 보완합니다.'},
  {question:'개념+유형 라이트, RPM, 쎈을 전부 한꺼번에 하나요?',answer:'같은 학기의 세 권을 동시에 시작하지 않습니다. 중등 한 학기 3개월 안에서는 개념+유형 라이트로 개념·기본을 먼저, RPM으로 유형·활용을 뒤이어 정리합니다. 쎈은 먼저 배운 학기를 다지는 별도 줄이며, 중1-1을 처음 배우는 기간의 활용 연습은 같은 RPM을 사용합니다.'},
  {question:'여름 레벨테스트 전에 중1-2가 모두 끝나나요?',answer:state.academy==='summer'?'이 일정에서는 아닙니다. 8월 특강을 한 달 듣고 9월 시험을 검토하지만, 중1-2 교과의 3개월 과정은 10월까지 이어집니다. 시험 범위가 중1-2 전체라면 현재 이해와 특강에서 다룬 범위를 먼저 확인하고, 부족하면 완료 후 시험을 보는 선택으로 옮기겠습니다.':'현재 선택은 중1-2를 10월에 마친 뒤, 11월 한 달 보완하고 12월 시험을 검토하는 일정입니다. 응시 전에 중1-1·1-2의 개념·유형·활용을 실제로 어디까지 해결하는지 보겠습니다.'},
  {question:'디딤돌 연산 6B 뒤에는 무엇을 하나요?',answer:'기적의 중학연산 1A·1B로 연결하고, 이후 중학도형을 번갈아 둡니다. 연산을 몇 권 끝냈는지만 보지 않고 부호와 분수, 문자식의 계산 과정을 정확히 쓰는지 확인하겠습니다. 정확한 현재 권과 남은 분량을 알면 시작 구간부터 조정할 수 있습니다.'},
  {question:'학원에 들어가면 이 계획은 어떻게 이어가나요?',answer:'반 배정 뒤에는 실제 학원 진도와 과제에 맞춰 겹치는 교과·RPM·쎈을 정리합니다. 새 학원의 숙제 위에 같은 문제집을 그대로 더하지 않습니다. 학교 공부와 연산의 정확도를 유지하면서 부족한 활용만 남기겠습니다.'},
  {question:'중3 과정까지 끝내면 고등 선행은 어떻게 이어가나요?',answer:'중3-2를 마친 뒤 쎈 중3-2와 중등 종합 복습을 2029년 1월까지 이어갑니다. 그다음 공통수학1·2를 각각 실학습 여섯 달로 공부합니다. 기본정석의 개념·유형에 세 달, 쎈 활용에 세 달을 쓰고 내신 집중월에는 새 진도를 멈추겠습니다.'},
  {question:'공통수학을 6개월에 한다는데 왜 달력에서는 더 오래 걸리나요?',answer:'실제로 새 선행을 공부하는 달을 여섯 달 확보했기 때문입니다. 학교 시험을 준비하는 4·6·9·11월 예시 구간에는 새 진도를 넣지 않습니다. 공통수학1은 2월부터 10월까지, 공통수학2는 12월부터 다음 해 7월까지 이어지며, 시험월을 빼고도 기본·유형 세 달과 쎈 활용 세 달을 유지합니다.'},
  {question:'내신 기간에도 선행 숙제와 쎈을 계속 더하나요?',answer:'이 계획에서는 새 선행을 쉬고 학교 내신과 배운 범위 복습에 집중합니다. 한 달 중 약 3주는 학교 시험을 준비하고 남은 주에는 이전 오답을 정리하는 예시입니다. 실제 학교의 시험일과 과제량을 확인해 해당 월을 옮기고, 선행을 못한 달을 다음 달에 두 배로 몰아 넣지 않겠습니다.'}
 ];
 const overview={
  title:'6-1부터 한 학기 3개월, 교과와 활용을 나란히',
  current:'현재 초5에서 5-2 응용을 공부하고 있습니다. 교과는 2026년 11월 6-1부터 이어가고, 활용은 최상위 대신 쎈 5-2에서 시작합니다.',
  firstYear:'6-1(초5 11월~1월) → 6-2(초5 2월~초6 4월) → 중1-1(초6 5~7월) → 중1-2(초6 8~10월).',
  winter:'초5 겨울에는 6-2 심화 교재를 추가하지 않고 중1 연산을 준비합니다. 디딤돌 연산 6B 다음에 기적의 중학연산 1A·1B를 연결합니다.',
  summer:state.academy==='summer'?'초6 8월에는 중1-2 특강과 쎈 중1-1을 병행하고, 9월 대형학원 레벨테스트를 검토합니다. 중1-2 전체 완료 전이므로 응시 범위를 확인해야 합니다.':'중1-2를 초6 10월까지 마친 뒤 11월 한 달 보완하고, 12월 대형학원 레벨테스트를 검토합니다.',
  after:'중2-1부터도 한 학기 3개월을 유지합니다. 교과는 2028년 10월 중3-2까지, 쎈 중3-2와 중등 종합 복습은 2029년 1월까지 연결합니다. 그 뒤 공통수학1·2를 각각 실학습 여섯 달로 공부하며 중2부터의 학교 내신 집중월을 별도로 남깁니다.',
  high:'공통수학1은 2029년 2~10월, 공통수학2는 2029년 12월~2030년 7월에 기본정석으로 개념·유형을 익히고 쎈으로 활용을 이어갑니다. 내신 집중월에는 새 진도를 멈추므로 각 과정의 실학습 여섯 달을 줄이지 않습니다.',
  thinking:'5학년 심화인 쎈 5-2를 2026년 12월까지 마무리한 뒤, 2027년 1~6월에 3% 올림피아드 1과정을 여섯 달 동안 병행하고 마칩니다. 풀이 설명과 오답 재풀이도 이 기간 안에 포함합니다.'
 };
 return {id:ID,title:TITLE,label:TITLE,state,start:{...START},now:NOW,horizon:HORIZON,months:Array.from({length:HORIZON},(_,index)=>dateAt(index)),current:CURRENT.map(item=>({...item})),gender:'boy',lanes,events,academy,exams,highPlan,classPlan:classes,assessment:position,graphReading:reading,questions,assumptions,overview,middle12End:12,middleEnd:24,reviewEnd:27,highEnd:45};
}
global.PlannerStudyPlan=Object.freeze({ID,TITLE,START,NOW,HORIZON,OPTIONS,restore,choose,model,dateAt});
})(window);
