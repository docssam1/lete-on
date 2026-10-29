/* User-confirmed science curriculum, 2026-10-26.
 * Level numbers rank reference plans, not measured science attainment.
 * L0-L6: subject systems; L7+: semester books. Middle school: school + advance.
 * Basic-field durations follow the supplied Hangwayeon standard example.
 * The selected bridge is SIX MONTHS TOTAL; repeat study has no invented end.
 */
(function(global){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const FIELDS={physics:'물리',chemistry:'화학',life:'생명과학',earth:'지구과학'};
const DURATIONS={physics:4,chemistry:3,life:3,earth:3};
function policy(context={}){
 const raw=String(context.level??''),level=/^L\d+$/.test(raw)?Number(raw.slice(1)):null;
 const grade=Number.isFinite(context.now)?Math.floor((context.now-2)/12)-2:null;
 const active=context.curriculumPolicy===2||(level!==null&&level<=13);
 return {active,level,grade,middle:grade!==null&&grade>=7,system:level!==null&&level<=6};
}
function route(state,context,late){
 const p=policy(context);
 if(state.route!=='auto')return state.route;
 if(p.active&&!p.middle&&p.level!==null&&!p.system)return 'otu';
 return late?'lifeFirst':'physicsFirst';
}
function apply(m){
 const p=policy(m.context);if(!p.active)return m;
 m.curriculum=p;
 const system=m.route!=='otu',bridge=system||['bridge','foundation'].includes(m.state.extension);
 const elementary=m.phases.find(b=>b.id==='elementary');
 const allElementary=m.state.elementaryScope==='all';
 if(m.known&&m.state.experimentPlan==='alongside'&&!p.middle&&p.grade<5&&!m.state.completed.includes('experiment')){
  const end=Math.min(12,105-m.context.now);
  if(end>0&&!m.phases.some(b=>b.id==='experiment'))m.phases.unshift({id:'experiment',title:'실험과학 · 관찰·실험·기록',material:'현재 실험과학 수업 교재·실험 기록',courseMethod:'실험과학 병행',scope:'예상·관찰·측정·결과 설명 · 교과 기본과 별도로 병행',start:0,end,months:end,parallel:true,completed:false});
 }
 m.phases.filter(b=>b.id==='experiment').forEach(b=>Object.assign(b,{title:'실험과학 · 관찰·실험·기록',material:'현재 실험과학 수업 교재·실험 기록',courseMethod:'실험과학',scope:'예상·관찰·측정·결과 설명'}));
 if(elementary)Object.assign(elementary,{title:'초5·6 과학 · 학기별 기본',material:m.state.elementaryBook==='otu'?'오투 초등 과학 · 초5·6 해당 학기':m.state.elementaryBook==='reference'?'최상위 줄기과학 · 초5·6 해당 학기':m.state.elementaryBook==='school'?'학교 과학 교재·수업 자료 · 초5·6 범위':system?'줄기과학 · 초5·6 해당 학기':'오투 초등 과학 · 초5·6 해당 학기',courseMethod:'초등 기본',scope:'5-1 → 5-2 → 6-1 → 6-2 · 확인한 이수 범위는 제외'});
 // The existing elementary completion key records grades 5–6 only. A wider
 // planning scope must not broaden that evidence or invent a restart period.
 if(elementary&&allElementary){
  if(elementary.completed){
   Object.assign(elementary,{scopeCheck:true,scope:'확인한 이수: 초5·6 과학 · 앞 학년의 남은 개념·탐구는 확인 필요'});
   m.preparation.scopeCheck=true;
  }else Object.assign(elementary,{title:'초등 과학 전체 · 기본 개념·탐구',material:elementary.material.replaceAll('초5·6','초등 전체 범위'),scope:'초등 과학 전체의 개념·탐구 · 이미 배운 단원은 복습'});
 }
 let cursor=m.known?m.start:null;
 m.next=m.next.flatMap(b=>{
  const prior=cursor,months=DURATIONS[b.id],start=b.completed?null:b.id==='physics'&&Number.isFinite(cursor)?Math.max(cursor,m.context.anchor):cursor,end=Number.isFinite(start)?start+months:null;
  if(!b.completed&&end!==null)cursor=end;
  const review=Number.isFinite(prior)&&Number.isFinite(start)&&start>prior?[{id:'advanceReview',title:'생명·지구 기본 복습·탐구',material:'공부한 줄기과학 · 해당 단원',courseMethod:'수학 선수 개념 준비 중 복습',scope:'이미 배운 개념과 탐구를 복습하며 물리에 필요한 식·비례·그래프를 준비',start:prior,end:start,months:start-prior,review:true,completed:false}]:[];
  return [...review,{...b,title:'중등 '+FIELDS[b.id]+' · 계통별 기본',material:'줄기과학 · '+FIELDS[b.id],courseMethod:'계통별 기본',months,start,end,scope:FIELDS[b.id]+' 기본 개념·대표 탐구·자료 해석'}];
 });
 m.terms=m.terms.map(b=>({...b,title:'중'+b.stage+' 과학 · 학기별 기본',material:'오투 중학 과학 '+b.stage,courseMethod:'학기별 기본',scope:'중'+b.stage+' 해당 단원 · 개념·탐구·문제 적용'}));
 const dated=(system?m.next:m.terms).filter(b=>!b.completed&&Number.isFinite(b.end));
 const end=dated.length?Math.max(...dated.map(b=>b.end)):m.known?m.start:null;
 m.continuation=[];
 if(bridge){
  const start=end,finish=Number.isFinite(start)?start+6:null;
  m.continuation.push({id:'scienceBridge',title:'중등 과학 · 심화 브릿지',material:m.state.bridgeBook==='highTop'?'하이탑 · 중등 해당 분야':'최상위 줄기과학 · 해당 분야',courseMethod:'심화 브릿지',scope:'기본을 공부한 분야의 심화·자료 해석·서술',months:6,start,end:finish,completed:false,continuation:true,bridge:true});
  m.continuation.push({id:'highTopRepeat',title:'중등 과학 · 하이탑 심화 반복',material:'하이탑 · 중등 해당 분야·단원',courseMethod:'심화 반복',scope:'분야별 개념 설명·응용·다시 풀기 · 반복 횟수는 학습 후 조정',start:finish,end:null,completed:false,continuation:true,repeat:true});
 }
 // Cepheid/high-school work remains a separate, explicitly selected extension.
 if(m.state.extension==='foundation'&&['giftedSchool','scienceHigh'].includes(m.state.schoolGoal))m.continuation.push({id:'cepheid1',title:'중등 물리·화학 · 세페이드 1F 선택 보완',start:null,end:null,completed:false,continuation:true});
 if(m.state.extension==='foundation'&&['giftedSchool','scienceHigh'].includes(m.state.schoolGoal)){
  m.continuation.push({id:'cepheid2',title:'중등 과학 · 세페이드 2F 선택 심화',start:null,end:null,completed:false,continuation:true});
 }
 if(m.state.highDeep==='3F'&&(['giftedSchool','scienceHigh'].includes(m.state.schoolGoal)||m.state.physicsGoal==='consider'))m.continuation.push({id:'cepheid3',title:'고등 개념 이후 · 세페이드 3F 선택 심화',start:null,end:null,completed:false,continuation:true,parallel:true});
 const last=Math.max(24,...m.continuation.filter(b=>Number.isFinite(b.start)).map(b=>b.start+(b.repeat?12:6)),...dated.map(b=>b.end));
 m.from=0;m.to=Math.ceil(last);
 m.schoolTerms=[];
 if(Number.isFinite(m.context.now)){
  let offset=Math.max(0,110-m.context.now);
  while(offset<m.to){
   const absolute=m.context.now+offset,g=Math.floor((absolute-2)/12)-2;
   if(g>9)break;
   const month=((absolute%12)+12)%12+1,semester=month>=3&&month<=8?1:2;
   let boundary=Math.floor((absolute-2)/6+1)*6+2;
   const end=Math.min(m.to,boundary-m.context.now);
   if(end<=offset)break;
   m.schoolTerms.push({id:'schoolScience-'+g+'-'+semester,title:'중'+(g-6)+'-'+semester+' 과학 · 내신 대비',material:'학교 과학 교과서·수업 자료',courseMethod:'학교 과학·내신 대비',scope:'재학 학기의 개념·탐구·서술형과 학교 평가 범위',start:offset,end,months:end-offset,schoolStudy:true,completed:false});
   offset=end;
  }
 }
 m.blocks=[...m.phases,...m.next,...m.terms,...m.continuation,...m.schoolTerms];
 m.months=Number.isFinite(m.context.now)?Array.from({length:m.to},(_,offset)=>({offset,...global.PlannerScience.date(m.context,offset)})):[];
 m.goalPlan.targets=m.goalPlan.targets.map(t=>['giftedSchool','scienceHigh'].includes(t.id)?{...t,steps:['중등 기본 개념·탐구 확인','심화 브릿지 전체 6개월 · 필요한 분야','중등 하이탑 심화 반복','추가 심화·고등 과학은 이후 별도 선택'],note:'선행한 양만으로 진학 준비가 끝나지 않습니다. 기본 개념과 자료 해석·서술을 먼저 다지고 필요한 추가 심화를 고릅니다. 학교·학년도별 전형 준비는 별도로 확인합니다.'}:t);
 m.orderLabel=p.middle?'학교 과학·내신 대비 + 수학 선행에 맞춘 과학 선행':system?'계통별 기본 · '+m.next.filter(b=>FIELDS[b.id]).map(b=>FIELDS[b.id]).join(' → ')+' → 심화 브릿지 6개월 → 하이탑 반복':'학기별 기본 · 오투 중1-1부터 선택한 범위 순서대로';
 return m;
}
function rows(m){return [['실험과학',m.phases.filter(b=>b.id==='experiment')],['초등 기본',m.phases.filter(b=>b.id==='elementary'||b.review)],['과학 선행',m.terms.length?m.terms:m.next],['심화 브릿지',m.continuation.filter(b=>b.bridge)],['하이탑 반복',m.continuation.filter(b=>b.repeat)],['학교·내신',m.schoolTerms]];}
function label(m){
 const p=m.curriculum,system=m.route!=='otu';
 const selected=system?'현재 선택은 계통별 과정입니다. 줄기과학으로 분야별 기본 개념과 탐구를 공부합니다.':'현재 선택은 학기별 과정입니다. 오투로 선택한 학년·학기의 개념과 탐구를 차례로 공부합니다.';
 const bridge=m.continuation.some(b=>b.bridge)?' 기본 이후에는 심화 브릿지 전체 6개월과 하이탑 반복을 이어갑니다.':'';
 if(p.middle)return '중학생부터는 학교 과학과 내신 대비를 먼저 챙깁니다. '+selected+bridge+' 별도 과학 선행은 수학 진도와 필요한 식·비례·그래프 개념에 맞춰 조정합니다.';
 const standard=p.level===null?' 현재 과학 이수 범위를 확인하며 다음 범위를 정합니다.':' 초등 L'+p.level+'의 표준 추천은 '+(p.system?'계통별':'학기별')+' 과정입니다.';
 return selected+bridge+standard;
}
function guidance(m,b){
 if(!b.material)return null;
 const method=b.scopeCheck?'초5·6 과학의 확인한 이수는 그대로 유지합니다. 초등 전체 범위 중 앞 학년의 남은 개념·탐구를 확인하고 필요한 부분만 보완합니다. 전체 이수를 새로 기록하거나 8개월을 일괄 재배정하지 않습니다.':b.id==='experiment'?'실험 전에는 결과를 예상하고, 실험 뒤에는 바뀐 조건과 관찰한 결과를 연결해 말해 보세요. 교과 진도와 별도로 병행하며, 실험 수업만으로 교과 개념을 모두 배웠다고 보지는 않습니다.':b.schoolStudy?'학교에서 배우는 단원과 평가 범위를 먼저 챙깁니다. 과학 선행 때문에 내신 대비가 빠지지 않도록 별도 행으로 계획합니다.':b.bridge?'이미 배운 기본 개념을 낯선 자료와 서술 문제에 적용하는 6개월입니다. 선택한 분야·단원 전체에 배정한 기간이며, 물리·화학·생명·지구를 각각 6개월씩 하는 뜻은 아닙니다.':b.repeat?'하이탑을 한 번 끝내고 바로 다음 단계로 넘어가지 않습니다. 같은 분야를 다시 공부하며 개념을 설명하고 문제에 적용하는 힘을 다집니다. 오답뿐 아니라 대표 문제와 단원 연결도 다시 봅니다. 반복 횟수와 완료 월은 미리 고정하지 않습니다.':b.schoolTerm?'학년·학기별로 개념, 대표 탐구, 자료 해석과 문제 적용을 함께 공부합니다. 표시된 학기는 범위를 배분한 계획이며 한 권의 숙달을 보장한 기간이 아닙니다.':b.id==='elementary'?(m.state.elementaryScope==='all'?'초등 과학 전체의':'초5·6의')+' 용어·개념·탐구를 해당 학기 순서로 확인합니다. 별도 실험과학을 자동 추가하지 않으며, 이미 공부한 범위는 다시 배정하지 않습니다.':'분야별 기본 개념과 대표 탐구를 먼저 공부합니다. 물리는 수학 중2-1의 식·비례·그래프를 실제 현상에 적용할 수 있는지 함께 봅니다. 심화 교재가 기본 공부를 대신하지 않습니다.';
 const timing=b.completed?'기존 이수 범위 · 새 일정 배정 없음':global.PlannerScience.date(m.context,b.start).label+(Number.isFinite(b.end)?' → '+global.PlannerScience.date(m.context,b.end-1).label:b.repeat?' 시작 · 완료 월은 학습 후 조정':'');
 return {title:b.title,html:'<div class="science-detail"><p>'+esc(b.courseMethod)+'</p><h3>'+esc(b.title)+'</h3><p><strong>'+esc(b.material)+'</strong></p><p>'+esc(b.scope)+'</p><p>'+esc(method)+'</p><p>'+esc(timing)+'</p></div>'};
}
function choices(m,button){
 const hasBridge=m.continuation.some(b=>b.bridge);
 return '<p class="science-note">'+esc(label(m))+'</p><p class="science-note">초등 L1~L6은 계통별, L7부터는 학기별을 표준으로 둡니다. 중학생부터는 학교 과학·내신 대비와 과학 선행을 나란히 계획합니다. 기존에 따로 선택한 경로와 실제 이수 기록은 유지합니다.</p><h4>심화 브릿지 · 전체 6개월</h4>'+(hasBridge?'<div class="science-options">'+button('bridgeBook','julgi','최상위 줄기과학으로 연결','기본을 공부한 분야의 심화·자료 해석',m.state.bridgeBook==='julgi')+button('bridgeBook','highTop','하이탑 수준으로 연결','중등 해당 분야·단원부터 · 이후 하이탑 심화 반복',m.state.bridgeBook==='highTop')+'</div>':'<p>현재는 학기별 기본 과정입니다. 심화를 더하려면 아래에서 브릿지를 추가해 주세요.</p>'+button('extension','bridge','심화 브릿지 6개월 추가','중등 기본 이후 · 하이탑 반복으로 연결',false));
}
function questions(m){return [
 {question:m.curriculum.middle?'중학생인데 과학 선행과 내신은 어떻게 나누나요?':'과학은 계통별과 학기별 중 어느 쪽으로 공부하나요?',answer:label(m)+' 레벨은 과학 이수 사실을 뜻하지 않으므로 현재 공부한 과학 범위는 별도로 확인합니다.'},
 {question:'심화 브릿지 6개월에는 무엇을 하나요?',answer:'중등 기본을 공부한 분야에서 최상위 줄기과학이나 하이탑 수준의 자료 해석·응용·서술을 연결합니다. 여러 분야를 묶은 전체 6개월이며 과목마다 6개월을 배정하지 않습니다. 이후 하이탑을 반복하며 부족한 개념과 적용을 다집니다.'},
 {question:'하이탑을 끝내면 바로 고등 과학으로 넘어가나요?',answer:'교재를 끝낸 것만으로 넘어가지 않습니다. 같은 분야의 개념을 설명하고 낯선 문제에 적용하는지 반복해서 확인합니다. 중학생은 학교 과학·내신 대비를 유지하며 수학 선행과 필요한 과학 개념에 맞춰 다음 범위를 고릅니다.'}
 ];}
function graph(m){
 const lanes=rows(m).filter(([,b])=>b.length),n=m.to-m.from,x=v=>190+v/n*780,height=80+lanes.length*70;
 const chart=lanes.map(([name,blocks],i)=>'<text x="12" y="'+(51+i*70)+'">'+esc(name)+'</text>'+blocks.filter(b=>!b.completed&&Number.isFinite(b.start)).map((b,j)=>'<g><title>'+esc(b.title+' · '+(b.material||'현재 과학 교재')+' · '+global.PlannerScience.date(m.context,b.start).label+(b.repeat?' 시작 · 완료 월 미정':' → '+global.PlannerScience.date(m.context,b.end-1).label))+'</title><rect x="'+x(b.start)+'" y="'+(25+i*70)+'" width="'+((b.end??m.to)-b.start)/n*780+'" height="44" rx="6" fill="'+(i%2?'#e9dff2':'#dcebe3')+'" stroke="#b7a9c0"'+(b.repeat?' stroke-dasharray="4 4"':'')+'/>'+(b.end-b.start>=3||b.repeat?'<text x="'+(x(b.start)+7)+'" y="'+(52+i*70)+'">'+esc(b.bridge?'브릿지 6개월':b.repeat?'하이탑 반복':b.schoolStudy?b.title.split(' ')[0]:b.title.replace('중등 ','').split(' · ')[0].replace('생명과학','생명').replace('지구과학','지구'))+'</text>':'')+'</g>').join('')).join('');
 const ticks=Array.from({length:Math.floor(n/6)+1},(_,i)=>i*6).map(v=>'<text x="'+x(v)+'" y="'+(height-10)+'" text-anchor="middle">'+esc(global.PlannerScience.date(m.context,v).label)+'</text>').join('');
 return '<div class="science-chart" tabindex="0" role="region" aria-label="과학 기본·심화·학교 내신 일정 비교"><svg viewBox="0 0 1000 '+height+'" role="img" aria-label="과학 계통별 또는 학기별 기본과 브릿지 6개월·하이탑 반복·학교 과학 비교">'+chart+ticks+'</svg></div><p class="science-note">실선은 선택한 범위의 예상 일정입니다. 하이탑 반복의 점선 구간은 계속 점검할 과정이며, 그래프 끝을 완료일로 정한 뜻은 아닙니다.</p>';
}
global.PlannerScienceCurriculum=Object.freeze({policy,route,apply,rows,label,guidance,choices,questions,graph});
})(window);
