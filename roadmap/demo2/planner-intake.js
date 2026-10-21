/* Compact intake backed by the first demo. Source curriculum stays in DemoContent. */
(function(global){
'use strict';
const D=global.DemoContent,P=global.Planner;
const thinking=['킨더팩토','키즈팩토','초등팩토','PRE 1031','1031 입문','1031 초급'];
const calc=[['소마셈 K','수 가르기·모으기'],['기적의 계산법 2권','한 자리 덧셈·뺄셈'],['기적의 계산법 3권','받아올림·받아내림'],['기적의 계산법 4권','구구단'],['기적의 계산법 5권','곱셈·나눗셈'],['기적의 계산법 6권','복합 계산']];
const schoolBooks=['디딤돌 기본+응용','디딤돌 응용','원리해설','개념원리','개념응용 · 최상위','개념응용 · 최상위라이트'];
const deepBooks=['최상위 S','최상위 수학','개념응용 · 최상위','A급','RPM'];
const special=v=>['none','unknown'].includes(v);
const middleBook=v=>['원리해설','개념원리','개념응용 · 최상위라이트','A급','RPM'].includes(v);
const stageOptions=middle=>middle?P.MID.map((t,i)=>[String(i+14),t.replace(/중(\d)-(\d)/,'중등 $1학년 $2학기')]):Array.from({length:12},(_,i)=>[P.SEM(i+1),`초등 ${Math.ceil((i+1)/2)}학년 ${i%2+1}학기`]);
const absent=v=>v==='none'?'아직 시작 전':v==='unknown'?'잘 모르겠어요':'미선택';
const noThinking=a=>special(a.thinkingExperience);
const effective=a=>({...a,schoolBook:special(a.schoolCourse)?a.schoolCourse:a.schoolBook,deepBook:special(a.deepCourse)?a.deepCourse:a.deepBook});
const courseOptions=[['elem','초등 과정'],['mid','중등 과정'],['none','아직 시작 전'],['unknown','잘 모르겠어요']];
const schoolChoice=a=>special(a.schoolBook)?a.schoolBook:a.school;
const progress=[['progress','지금 하는 중'],['done','끝냈어요']];
function age(a,fields){if(a.age&&a.age!=='older')return +a.age;if(a.age==='older'&&!a.grade)return 10;return 5+Math.floor(P.mOf(+(a.grade||fields.grade),+fields.mon)/12);}
function gradeForAge(value,month){return +value-7-(+month<3?1:0);}
function order(a,fields){a=effective(a);
 const list=['age'];if(a.age==='older')list.push('grade');
 list.push('thinkingExperience');
 if(!noThinking(a)){list.push('thinking');if(a.thinking==='advanced')list.push('compExact');list.push('thinkingStatus');if(a.thinking==='PRE 1031')list.push('preDone');}
 list.push('schoolCourse');if(!special(a.schoolCourse)){list.push('schoolBook');}if(!special(a.schoolCourse)&&!special(a.schoolBook)){list.push(middleBook(a.schoolBook)?'schoolExact':'school');list.push('schoolStatus');}
 list.push('deepCourse');if(!special(a.deepCourse)){list.push('deepBook');}if(!special(a.deepCourse)&&!special(a.deepBook))list.push('deepStage','deepStatus');
 list.push('calc');if(a.calc==='advanced')list.push('calcExact');if(!special(a.calc))list.push('calcStatus');
 const y=age(a,fields);if(y>=6&&y<=9&&['A','B'].includes(fields.band))list.push('hw');list.push('gifted');return list;
}
// Curriculum standards come from the existing four BAND rules and buildD.
// The broader book guide is a reference list, not a replacement for those rules.
function standardBook(band,course,axis){
 if(course==='mid')return axis==='school'?P.BAND[band].midBook:band==='C'?'RPM · 응용 반복':P.BAND[band].deep;
 return band==='D'?'개념응용 · 최상위':axis==='school'?'디딤돌 기본+응용 · 디딤돌 응용':'최상위 S';
}
function questions(a,fields){a=effective(a);const older=age(a,fields)>=8;return {
 age:['아이는 지금 몇 살인가요?','한국 나이 기준으로 골라 주세요.',[4,5,6,7,8,9].map(v=>[String(v),v+'세']).concat([['older','10세 이상']])],
 grade:['지금 몇 학년인가요?','현재 학년을 골라 주세요.',[1,2,3,4,5,6].filter(v=>v>=(+fields.mon<3?2:3)).map(v=>[String(v),'초등 '+v+'학년'])],
 thinkingExperience:['사고력으로 공부한 경험이 있나요?','경험이 없어도 괜찮아요.',[['yes','네, 있어요'],['none','아직 없어요'],['unknown','잘 모르겠어요']]],
 thinking:['사고력은 어디까지 했나요?','가장 최근에 공부한 과정을 골라 주세요.',thinking.map(v=>[v,v]).concat(older?[['advanced','그 이후 과정']]:[])],
 thinkingStatus:[(a.thinking==='advanced'?'이 사고력 과정은':a.thinking||'이 과정은')+' 어떤 상태인가요?','완료한 과정과 진행 중인 과정을 구분해요.',progress],
 preDone:['초등팩토는 끝냈나요?','PRE 1031의 기본·심화 위치를 구분할게요.',[['1','네'],['0','아니요']]],
 schoolCourse:['교과는 어느 과정을 공부하나요?','심화 과정은 다음에 따로 골라 주세요.',courseOptions],
 schoolBook:['교과는 어떤 교재로 공부하나요?',`${a.schoolCourse==='mid'?'중등':'초등'} ${fields.band} 기준: ${standardBook(fields.band,a.schoolCourse,'school')}`,schoolBooks.filter(v=>middleBook(v)===(a.schoolCourse==='mid')).map(v=>[v,v])],
 school:['교과는 어느 과정인가요?','교과 교재의 학년과 학기를 골라 주세요.',stageOptions(false)],
 schoolStatus:['이 교과 과정은 어떤 상태인가요?','선택한 교과 과정의 상태를 골라 주세요.',progress],
 deepCourse:['심화는 어느 과정을 공부하나요?','교과와 다른 과정이어도 괜찮아요.',courseOptions],
 deepBook:['심화는 어떤 교재로 공부하나요?',`${a.deepCourse==='mid'?'중등':'초등'} ${fields.band} 기준: ${standardBook(fields.band,a.deepCourse,'deep')}`,deepBooks.filter(v=>middleBook(v)===(a.deepCourse==='mid')).map(v=>[v,v==='RPM'?'RPM · 응용 반복':v])],
 deepStage:['심화는 어느 과정인가요?','심화 교재의 학년과 학기를 골라 주세요.',stageOptions(middleBook(a.deepBook))],
 deepStatus:['이 심화 과정은 어떤 상태인가요?','교과의 진행 상태와 따로 골라 주세요.',progress],
 calc:['연산은 어디까지 되나요?','도움 없이 혼자 할 수 있는 단계예요.',calc.map(([v,t])=>[v,t]).concat(older?[['advanced','그 이후 단계']]:[]).concat([['none','아직 시작 전'],['unknown','잘 모르겠어요']])],
 calcStatus:[(calc.find(c=>c[0]===a.calc)?.[1]||'이 연산')+' 단계는요?','지금 연습하는 중인지, 끝냈는지 골라 주세요.',progress],
 compExact:['지금 사고력 교재는요?','현재 과정 하나만 골라 주세요.',P.COMP.map((c,i)=>[String(i),c[0]])],
 schoolExact:['교과는 어느 과정인가요?','교과 교재의 학년과 학기를 골라 주세요.',[['13','계통 · 대수 정리'],...stageOptions(true)]],
 calcExact:['지금 연산 교재는요?','현재 과정 하나만 골라 주세요.',P.CALC.map((c,i)=>[String(i),c[0]])],
 hw:['생각하는 황소도 고려하고 계세요?','나중에 바꿔도 괜찮아요.',[['1','네'],['0','아니요'],['pending','아직 고민 중']]],
 gifted:['영재원도 고려하고 계세요?','나중에 바꿔도 괜찮아요.',[['1','네'],['0','아니요'],['pending','아직 고민 중']]]
 };}
function sourceInput(a,fields){a=effective(a);
 const thinkingValues=[];
 if(!noThinking(a)&&thinking.includes(a.thinking)&&a.thinkingStatus&&!fields.pendingStatus?.thinkingStatus){thinkingValues.push(a.thinking+' '+(a.thinkingStatus==='done'?'완료':'진행 중'));if(a.thinking==='PRE 1031'&&a.preDone==='1')thinkingValues.push('초등팩토 완료');}
 return {age:age(a,fields),month:+fields.mon,thinking:thinkingValues,
  school:schoolChoice(a)&&!middleBook(a.schoolBook)&&schoolChoice(a)!=='advanced'&&!['unknown'].includes(schoolChoice(a))?(schoolChoice(a)==='none'?'교과 진행 안 함':a.school+' 진행 중'):undefined,
  calcRadio:a.calc&&a.calc!=='advanced'&&!special(a.calc)&&a.calcStatus?a.calc+' '+(a.calcStatus==='done'?'완료':'진행 중'):undefined};
}

function sourceMode(a,fields){a=effective(a);if(!a.age)return false;return noThinking(a)||special(a.calc)||special(a.schoolBook)||(a.schoolStatus==='done'&&+a.schoolExact===19&&middleBook(a.schoolBook))||(a.calc==='advanced'&&+a.calcExact===P.CALC.length-1&&a.calcStatus==='done')||(a.thinking==='advanced'&&+a.compExact===P.COMP.length-1&&a.thinkingStatus==='done')||gradeForAge(age(a,fields),fields.mon)<1||['킨더팩토','키즈팩토'].includes(a.thinking)||schoolChoice(a)==='none'||(a.calc==='소마셈 K'&&a.calcStatus!=='done');}
function nextComp(index,band){let n=index+1;while(band!=='A'&&n<P.COMP.length&&P.COMP[n][2]==='skip')n++;return Math.min(n,P.COMP.length-1);}
function fieldChanges(a,fields,key){a=effective(a);
 const result={};const recalc=['band','speed'].includes(key),y=age(a,fields),g=gradeForAge(y,fields.mon);
 if(['age','grade'].includes(key)&&g>=1&&g<=6)result.grade=String(g);
 if(['school','schoolExact','schoolBook','schoolCourse','schoolStatus'].includes(key)||recalc){
  const n=middleBook(a.schoolBook)?+a.schoolExact:!special(a.school)&&a.school!=='advanced'&&a.school?2*(+a.school[0]-1)+(+a.school[2]):null;
  if(!fields.pendingStatus?.schoolStatus&&!special(a.schoolBook)&&Number.isInteger(n)&&n>=1&&n<=19){
   const len=n===13?4:n>=14?P.BAND[fields.band].midLen:fields.band==='C'?3:+fields.speed||2;
   const next=a.schoolStatus==='done'?Math.min(19,n+1):n;
   result.school=String(next);result.schoolLeft=String(a.schoolStatus==='done'?next===13?4:next>=14?P.BAND[fields.band].midLen:len:Math.ceil(len/2));
  }
 }

 if((['thinking','thinkingStatus','preDone','compExact'].includes(key)||recalc)&&!noThinking(a)&&a.thinkingStatus&&!fields.pendingStatus?.thinkingStatus){
   let n=a.thinking==='advanced'?+a.compExact:({'초등팩토':0,'PRE 1031':a.preDone==='1'?1:0,'1031 입문':2,'1031 초급':4})[a.thinking];
   if(Number.isInteger(n)){if(a.thinkingStatus==='done')n=nextComp(n,fields.band);result.comp=String(n);result.compLeft=String(a.thinkingStatus==='done'?P.COMP[n][1]:Math.max(1,Math.ceil(P.COMP[n][1]/2)));}
 }
 if((['calc','calcStatus','calcExact'].includes(key)||recalc)&&!special(a.calc)&&a.calcStatus&&!fields.pendingStatus?.calcStatus){
   let n=a.calc==='advanced'?+a.calcExact:a.calc==='소마셈 K'?(a.calcStatus==='done'?1:null):parseInt(a.calc.match(/(\d+)권/)?.[1]||'',10)-1;
   if(Number.isInteger(n)){if(a.calcStatus==='done'&&a.calc!=='소마셈 K')n=Math.min(n+1,P.CALC.length-1);result.calc=String(n);result.calcLeft=String(a.calcStatus==='done'?(P.CALC[n][1]||(fields.band==='C'?5:+fields.speed||2)):Math.max(1,Math.ceil((P.CALC[n][1]||(fields.band==='C'?5:+fields.speed||2))/2)));}
 }
 return result;
}
function summary(a,fields){a=effective(a);const status=k=>fields.pendingStatus?.[k]?'상태 확인 전':a[k]==='done'?'완료':a[k]==='progress'?'진행 중':'';
 return [{key:'age',label:'나이',text:a.age?age(a,fields)+'세':'미선택'},
 {key:'thinking',label:'사고력',text:noThinking(a)?(a.thinkingExperience==='none'?'공부한 경험 없음':'잘 모르겠어요'):(a.thinking==='advanced'?(P.COMP[+a.compExact]?.[0]||'이후 과정'):a.thinking||'미선택')+' '+status('thinkingStatus')},
 {key:'school',label:'교과',text:special(a.schoolBook)?absent(a.schoolBook):((a.schoolExact==='13'&&a.school==='advanced'?'':a.schoolBook||'')+' '+(middleBook(a.schoolBook)||a.school==='advanced'?(+a.schoolExact<=12?P.SEM(+a.schoolExact):a.schoolExact==='13'?'계통·대수':P.MID[+a.schoolExact-14]||'이후 과정'):a.school||'미선택')+' '+status('schoolStatus')).trim()},
 {key:'deepBook',label:'심화',text:special(a.deepBook)?absent(a.deepBook):a.deepBook?`${a.deepBook} ${middleBook(a.deepBook)?P.MID[+a.deepStage-14]||'과정 미선택':a.deepStage||'과정 미선택'} ${status('deepStatus')}`:'미선택'},
 {key:'calc',label:'연산',text:special(a.calc)?absent(a.calc):(a.calc==='advanced'?(P.CALC[+a.calcExact]?.[0]||'이후 단계'):calc.find(c=>c[0]===a.calc)?.[1]||'미선택')+' '+status('calcStatus')}];
}
// Each subject resolves independently. An original-only answer never replaces
// the other subjects with the original demo's limited curriculum.
function hasAnswer(a,fields,key){
 if(fields.pendingStatus?.[key])return false;const q=questions(a,fields)[key];return !!q&&q[2].some(([v])=>String(a[key])===String(v));
}
function firstMissing(a,fields){return order(a,fields).find(k=>!hasAnswer(a,fields,k));}
function options(a,fields,overrides={}){a=effective(a);
 const value={band:fields.band||'B',grade:Math.max(1,gradeForAge(age(a,fields),fields.mon)),mon:+fields.mon,year:new Date().getFullYear(),school:1,schoolLeft:1,comp:0,compLeft:3,calc:1,calcLeft:1,speed:+fields.speed||2,hw:'none',hwDeep:false,hwMid:false,gifted:false,kmo:'switch',...fieldChanges(a,fields,'band'),...overrides};
 for(const key of ['grade','mon','year','school','schoolLeft','comp','compLeft','calc','calcLeft','speed'])value[key]=+value[key];return value;
}
function deepRow(a,fields,now){a=effective(a);
 if(!deepBooks.includes(a.deepBook)||!hasAnswer(a,fields,'deepStage')||!hasAnswer(a,fields,'deepStatus'))return null;
 const mid=middleBook(a.deepBook),first=mid?+a.deepStage:2*(+a.deepStage[0]-1)+(+a.deepStage[2]),last=mid?19:12;
 const duration=mid?P.BAND[fields.band].midLen:a.deepBook==='개념응용 · 최상위'?3:2,blocks=[];
 let t=now;
 for(let n=first;n<=last;n++){
  if(n===first&&a.deepStatus==='done')continue;
  const count=n===first?Math.ceil(duration/2):duration;
  blocks.push([`${mid?P.MID[n-14]:P.SEM(n)} ${a.deepBook}`,t,t+count-1,duration]);t+=count;
  // Preserve the reported current book in C, without recommending an excluded course.
  if(fields.band==='C'&&a.deepBook==='A급')break;
 }
 return {key:'school2',label:'교과 심화',blocks,color:'#e0f2fe',lane:'수학'};
}
function buildPlan(a,fields,overrides={}){a=effective(a);
 const o=options(a,fields,overrides),plan=P.build(o);
 if(fields.band==='D'&&a.schoolBook&&!special(a.schoolBook)){const personal=P.build({...o,personalSchool:true});plan.rows=plan.rows.map(r=>r.key==='school'?personal.rows.find(x=>x.key==='school'):r);plan.mid=personal.mid;}
 if(a.schoolBook&&!special(a.schoolBook)){
  const row=plan.rows.find(r=>r.key==='school');
  row.blocks=row.blocks.map(b=>[b[0].replace(middleBook(a.schoolBook)?/원리해설|개념원리|개념응용 · 최상위라이트/:/디딤돌 (?:기본\+응용|응용)|개념응용 · 최상위(?!라이트)/g,a.schoolBook),...b.slice(1)]);
 }
 if(Object.hasOwn(a,'deepBook')){
  const row=deepRow(a,fields,plan.now)||{key:'school2',label:'교과 심화',blocks:[],color:'#e0f2fe',lane:'수학'};
  plan.rows=plan.rows.map(r=>r.key==='school2'?row:r);plan.independentDeep=true;
 }
 for(const [key,status]of [['school','schoolStatus'],['school2','deepStatus'],['comp','thinkingStatus'],['calc','calcStatus']])if(fields.pendingStatus?.[status])plan.rows=plan.rows.map(r=>r.key===key?{...r,blocks:[]}:r);
 if(noThinking(a))plan.rows=plan.rows.map(r=>r.key==='comp'?{...r,blocks:[]}:r);
 return plan;
}
function profile(a,fields,overrides={}){a=effective(a);
 const original=D.buildProfile(sourceInput(a,fields)),now=original.now;
 if(!Number.isFinite(now))return original;
 const plan=buildPlan(a,fields,overrides),shift=now-plan.now,young=gradeForAge(age(a,fields),fields.mon)<1;
 const summaries=summary(a,fields),status={school:a.schoolStatus,thinking1:a.thinkingStatus,calc:a.calcStatus,deep:a.deepStatus};
 const rowKey=k=>k==='thinking1'?'comp':k==='deep'?'school2':k;
 const answerKey=k=>k==='thinking1'?'thinking':k==='deep'?'deepBook':k;
 const fromEngine=k=>{
  const bs=(plan.rows.find(r=>r.key===rowKey(k))?.blocks||[]).map(b=>({text:b[0],shortText:D.shortText(b[0]),s:b[1]+shift,e:b[2]+shift})).filter(b=>b.e>=now);
  const text=summaries.find(it=>it.key===answerKey(k))?.text||'';
  const done=status[k]==='done',current={shortText:text,e:done?now-1:bs[0]?.e??now,completed:done};
  return {key:k,current,blocks:bs,remaining:bs.map(b=>({...b,remainingStart:Math.max(now,b.s)})),next:done?bs[0]||null:bs.find(b=>b.s>now)||null};
 };
 const rows=['school','thinking1','calc'].map(k=>{
  const empty=fields.pendingStatus?.[({school:'schoolStatus',thinking1:'thinkingStatus',calc:'calcStatus'})[k]]||(k==='thinking1'?noThinking(a):k==='school'?special(a.schoolBook):special(a.calc));
  if(empty)return {key:k,current:{shortText:summaries.find(it=>it.key===answerKey(k))?.text||'',e:now},blocks:[],remaining:[],next:null};
  const source=k==='school'?(young&&!middleBook(a.schoolBook)&&a.school!=='advanced'):k==='thinking1'?young||['킨더팩토','키즈팩토'].includes(a.thinking):young||(a.calc==='소마셈 K'&&a.calcStatus!=='done');
  const row=original.rows.find(r=>r.key===k);
  if(source&&row){
   if(k==='school'&&a.schoolStatus==='done')return D.learningRow(k,{key:row.current.choiceKey,pos:'end'},now);
   return row;
  }
  const exhausted=k==='thinking1'?a.thinking==='advanced'&&+a.compExact===P.COMP.length-1&&a.thinkingStatus==='done':k==='calc'?a.calc==='advanced'&&+a.calcExact===P.CALC.length-1&&a.calcStatus==='done':middleBook(a.schoolBook)&&+a.schoolExact===19&&a.schoolStatus==='done';
  const resolved=fromEngine(k);if(exhausted){resolved.blocks=[];resolved.remaining=[];resolved.next=null;}return resolved;
 });
 if(Object.hasOwn(a,'deepBook'))rows.splice(2,0,fromEngine('deep'));
 return {...original,rows,comparison:Object.values(fields.pendingStatus||{}).some(Boolean)?{ready:false,levels:[],best:null}:original.comparison};
}
// Explicitly chosen depth is independent of the curriculum's relative depth preset.
function narrative(plan){
 const years=P.narrative(plan);if(!plan.independentDeep)return years;
 const deep=plan.rows.find(r=>r.key==='school2')?.blocks||[];
 return years.map(y=>{
  const lo=Math.max(plan.now,y.months[0].m),hi=y.months.at(-1).m,bs=deep.filter(b=>b[2]>=lo&&b[1]<=hi);
  const items=y.items.filter(it=>it.label!=='심화');
  if(bs.length)items.push({label:'심화',text:bs.map(b=>`${P.label(Math.max(lo,b[1]))}부터 ${D.shortText(b[0])} 과정을 이어가요.`).join(' ')});
  const months=y.months.map(m=>({...m,starts:[...m.starts,...bs.filter(b=>b[1]===m.m).map(b=>D.shortText(b[0]))]}));
  return {...y,months,items};
 });
}
function milestones(a,fields,p){a=effective(a);
 const current=summary(a,fields).slice(1).map(x=>x.text).join(' · '),main=[{m:p.now,kind:'now',title:'현재 · '+p.nowLabel,sub:current,icon:''}];
 const labels={school:'교과',thinking1:'사고력',deep:'심화',calc:'연산'};
 const future=p.rows.map(row=>row.next?{m:row.next.s,kind:'step',title:labels[row.key]+' · '+row.next.shortText,sub:'다음에 이어갈 학습이에요.',icon:''}:{m:Math.max(p.now+1,row.current.e+1),kind:'step',title:labels[row.key]+' · 다음 단계 확인',sub:'학습을 확인하며 다음 과정을 정해요.',icon:''});
 main.push(...future.sort((a,b)=>a.m-b.m));
 const forks=[];const y=age(a,fields);
 if(y>=6&&y<=9&&['A','B'].includes(fields.band))forks.push({id:'hw',title:'생각하는 황소',m:p.now+1,selected:a.hw==='1',pending:!['0','1'].includes(a.hw),yes:'과정 정보 함께 확인',no:'현재 학습 이어가기',reason:a.hw==='1'?'관심 과정의 안내를 함께 살펴봐요.':'지금 학습을 이어가며 나중에 바꿔도 괜찮아요.'});
 forks.push({id:'gift',title:'영재원',m:p.now+2,selected:a.gifted==='1',pending:!['0','1'].includes(a.gifted),yes:'선발 안내 함께 확인',no:'현재 학습 이어가기',reason:a.gifted==='1'?'선발 시기와 자격은 해당 연도 공고에서 확인해요.':'지금 학습을 이어가며 나중에 바꿔도 괜찮아요.'});
 return {main,branch:[],forks};
}
global.PlannerIntake=Object.freeze({thinking,calc,schoolBooks,deepBooks,special,effective,middleBook,noThinking,age,gradeForAge,order,standardBook,questions,hasAnswer,firstMissing,sourceInput,options,deepRow,buildPlan,profile,narrative,sourceMode,fieldChanges,summary,milestones});
})(window);
