/* Compact intake backed by the first demo. Source curriculum stays in DemoContent. */
(function(global){
'use strict';
const D=global.DemoContent,P=global.Planner;
const thinking=['킨더팩토','키즈팩토','초등팩토','PRE 1031','1031 입문','1031 초급'];
const calc=[['소마셈 K','수 가르기·모으기'],['기적의 계산법 2권','한 자리 덧셈·뺄셈'],['기적의 계산법 3권','받아올림·받아내림'],['기적의 계산법 4권','구구단'],['기적의 계산법 5권','곱셈·나눗셈'],['기적의 계산법 6권','복합 계산']];
const schoolBooks=['디딤돌 기본+응용','디딤돌 응용','원리해설','개념원리','개념응용 · 최상위','개념응용 · 최상위라이트'];
const highSubjects=['공통수학1','공통수학2','대수','미적분Ⅰ','확률과 통계','미적분Ⅱ','기하'];
const highBook=v=>['개념원리 고등','수학의 정석','쎈 고등','학교 지정 교재'].includes(v);
const bookList=(course,axis)=>course==='foreign'?['학교 지정 교재']:course==='high'?(axis==='deep'?['쎈 고등','수학의 정석','학교 지정 교재']:['개념원리 고등','수학의 정석','학교 지정 교재']):(axis==='deep'?deepBooks:schoolBooks).filter(v=>middleBook(v)===(course==='mid'));
const deepBooks=['최상위 S','최상위 수학','개념응용 · 최상위','A급','RPM'];
const special=v=>['none','unknown'].includes(v);
const middleBook=v=>['원리해설','개념원리','개념응용 · 최상위라이트','A급','RPM'].includes(v);
const stageOptions=middle=>middle?P.MID.map((t,i)=>[String(i+14),t.replace(/중(\d)-(\d)/,'중등 $1학년 $2학기')]):Array.from({length:12},(_,i)=>[P.SEM(i+1),`초등 ${Math.ceil((i+1)/2)}학년 ${i%2+1}학기`]);
const absent=v=>v==='none'?'아직 시작 전':v==='unknown'?'잘 모르겠어요':'미선택';
const noThinking=a=>special(a.thinkingExperience);
const effective=a=>({...a,schoolBook:special(a.schoolCourse)?a.schoolCourse:a.schoolBook,deepBook:special(a.deepCourse)?a.deepCourse:a.deepBook});
const courseOptions=[['elem','초등 과정'],['mid','중등 과정'],['high','고등 과정'],['none','아직 시작 전'],['unknown','잘 모르겠어요']];
const schoolChoice=a=>special(a.schoolBook)?a.schoolBook:a.school;
const progress=[['progress','지금 하는 중'],['done','끝냈어요']];
// Grade is the current school year, including its following January/February.
// Legacy ages are read without rewriting their saved values.
const currentGrade=a=>/^(?:[1-9]|1[0-2])$/.test(a.grade||'')&&(a.gradeInput==='current'||!a.age||a.age==='older');
function gradeChoice(a,fields){
 if(fields.internationalCalendar)return 'international';
 if(a.grade==='pre'||currentGrade(a))return a.grade;
 if(a.age&&a.age!=='older'){const g=gradeForAge(a.age,fields.mon);return g<1?'pre':g<=12?String(g):undefined;}
 return undefined;
}
function age(a,fields){if(currentGrade(a))return 5+Math.floor(P.mOf(+a.grade,+fields.mon)/12);if(a.age&&a.age!=='older')return +a.age;if(a.age==='older')return 10;return 5+Math.floor(P.mOf(+fields.grade,+fields.mon)/12);}
function labelMonth(m){if(m>=144){const n=Math.floor(m/12)-11,mo=m%12+1,g=n-(mo<3?1:0);return (g<1?'중3':g<=3?'고'+g:'고교 이후')+' '+mo+'월';}return m>=38?P.label(m):D.labelMonth(m);}
function studentLabel(a,fields){const sp=fields.schoolContext;if(sp?.format&&sp.format!=='kr'){const f=sp.format==='grade'?'Grade':sp.format==='year'?'Year':'학교 학년';return sp.level?(sp.format==='other'||sp.format==='unknown'?({primary:'초등 단계',middle:'중등 단계',high:'고등 단계',unknown:'학교 단계 확인 전'})[sp.level]||'학교 단계 확인 전':f+' '+sp.level):'학교 학년 확인 전';}const g=gradeChoice(a,fields);return g==='pre'?(a.age&&a.age!=='older'?'미취학 · '+a.age+'세':'미취학'):g?(+g<=6?'초'+g:+g<=9?'중'+(+g-6):'고'+(+g-9)):'미선택';}
// Wording follows the confirmed school stage, independently of course progress and L level.
function audience(a,fields){
 if(fields.internationalCalendar)return 'general';
 const g=gradeChoice(a,fields);
 return g==='pre'?'preschool':g&&+g<=3?'lower':g&&+g<=6?'upper':g&&+g<=9?'middle':g?'high':'general';
}
function learningLabels(a,fields){
 const group=audience(a,fields),young=['preschool','lower'].includes(group);
 return {grade:group==='preschool'?'나이':'학년',school:young?'교과 수학':'교과',deep:young?'심화 수학':'심화',deepBook:young?'심화 수학':'심화',thinking:young?'사고력 수학':'사고력',thinking1:young?'사고력 수학':'사고력',calc:young?'수와 계산':'연산'};
}
function gradeForAge(value,month){return +value-7-(+month<3?1:0);}
function order(a,fields){a=effective(a);
 const list=fields.internationalCalendar?[]:['grade'];if(gradeChoice(a,fields)==='pre')list.push('age');
 list.push('thinkingExperience');
 if(!noThinking(a)){list.push('thinking');if(a.thinking==='advanced')list.push('compExact');list.push('thinkingStatus');if(a.thinking==='PRE 1031')list.push('preDone');}
 list.push('schoolCourse');if(!special(a.schoolCourse)){list.push('schoolBook');}if(!special(a.schoolCourse)&&!special(a.schoolBook)){list.push(highBook(a.schoolBook)?'schoolHigh':middleBook(a.schoolBook)?'schoolExact':'school');list.push('schoolStatus');}
 list.push('deepCourse');if(!special(a.deepCourse)){list.push('deepBook');}if(!special(a.deepCourse)&&!special(a.deepBook))list.push('deepStage','deepStatus');
 list.push('calc');if(a.calc==='advanced')list.push('calcExact');if(a.calc==='high')list.push('calcHigh');if(!special(a.calc))list.push('calcStatus');
 const y=age(a,fields);if(y>=6&&y<=9&&['A','B'].includes(fields.band))list.push('hw');if(+gradeChoice(a,fields)<7||gradeChoice(a,fields)==='pre'||!gradeChoice(a,fields))list.push('gifted');return list;
}
// Curriculum standards come from the existing four BAND rules and buildD.
// The broader book guide is a reference list, not a replacement for those rules.
function standardBook(band,course,axis){
 if(course==='foreign')return '학교 지정 교재 · 현재 과목·판본 확인';
 if(course==='high')return axis==='school'?'개념원리 고등 · 수학의 정석':'쎈 고등 · 학교 지정 교재';
 if(course==='mid')return axis==='school'?P.BAND[band].midBook:band==='C'?'RPM · 응용 반복':P.BAND[band].deep;
 return band==='D'?'개념응용 · 최상위':axis==='school'?'디딤돌 기본+응용 · 디딤돌 응용':'최상위 S';
}
function questions(a,fields){a=effective(a);const curriculum=global.PlannerCollegeData?.CURRICULA[fields.schoolContext?.curriculum],mathOptions=fields.internationalCalendar?(curriculum?.math?.length?curriculum.math:['학교 수학 · 과목 확인 전']):highSubjects;const allMath=[...new Set([...highSubjects,...Object.values(global.PlannerCollegeData?.CURRICULA||{}).flatMap(c=>c.math)])];const retained=(base,value)=>[...new Set([...base,...(allMath.includes(value)?[value]:[])])];const schoolMath=retained(a.schoolCourse==='foreign'?mathOptions:highSubjects,a.schoolHigh),deepMath=retained(a.deepCourse==='foreign'?mathOptions:highSubjects,a.deepStage),calcMath=retained([...mathOptions,...highSubjects],a.calcHigh);const courses=fields.internationalCalendar?[['foreign','현재 학교 교육과정'],...courseOptions]:courseOptions;const older=age(a,fields)>=8,group=audience(a,fields),young=['preschool','lower'].includes(group);return {
 age:['아이는 지금 몇 살인가요?','미취학 아동의 한국 나이를 골라 주세요.',[4,5,6,7].map(v=>[String(v),v+'세']).concat(+fields.mon<3?[['8','8세 · 입학 전']]:[])],
 grade:['아이는 지금 몇 학년인가요?','현재 학년을 골라 주세요.',[['pre','미취학'],...Array.from({length:12},(_,i)=>[String(i+1),i<6?'초'+(i+1):i<9?'중'+(i-5):'고'+(i-8)])]],
 thinkingExperience:['사고력 수학을 공부한 적이 있나요?',young?'규칙 찾기나 도형 문제를 생각하며 푸는 수학이에요.': '학원 수업과 집에서 공부한 경험을 모두 포함해요.',[['yes','네, 있어요'],['none','아직 없어요'],['unknown','잘 모르겠어요']]],
 thinking:['사고력은 어디까지 했나요?','가장 최근에 공부한 과정을 골라 주세요.',thinking.map(v=>[v,v]).concat(older?[['advanced','그 이후 과정']]:[])],
 thinkingStatus:['이 사고력 과정은 끝냈나요?','지금 공부 중인지, 끝냈는지 골라주세요.',progress],
 preDone:['초등팩토는 끝냈나요?','초등팩토를 마쳤는지 함께 확인할게요.',[['1','네'],['0','아니요']]],
 schoolCourse:[young?'교과 수학은 어느 과정을 공부하나요?':'교과는 어느 과정을 공부하나요?',group==='preschool'?'초등·중등 교과서에서 배우는 수학이에요.':young?'학교에서 배우는 수학을 말해요. 지금 공부하는 과정을 골라주세요.':'지금 공부하는 초등·중등·고등 과정을 골라주세요.',courses],
 schoolBook:['교과는 어떤 교재로 공부하나요?',`이 과정의 교재 예: ${standardBook(fields.band,a.schoolCourse,'school')}`,bookList(a.schoolCourse,'school').map(v=>[v,v])],
 school:['교과는 어느 과정인가요?','교과 교재의 학년과 학기를 골라 주세요.',stageOptions(false)],
 schoolHigh:[fields.internationalCalendar?'현재 수학 교재의 과목은요?':'현재 고등 수학 과목은요?','과목 이수 순서는 학교 교육과정과 실제 선수학습을 확인합니다.',schoolMath.map(v=>[v,v])],
 schoolStatus:['이 교과 과정은 끝냈나요?','지금 공부 중인지, 끝냈는지 골라주세요.',progress],
 deepCourse:[young?'심화 수학은 어느 과정을 공부하나요?':'심화는 어느 과정을 공부하나요?',young?'배운 내용을 써서 더 깊이 생각하는 문제를 풀어요. 아직 시작 전도 고를 수 있어요.':'아직 시작하지 않았다면 아래에서 골라주세요.',courses],
 deepBook:['심화는 어떤 교재로 공부하나요?',`이 과정의 교재 예: ${standardBook(fields.band,a.deepCourse,'deep')}`,bookList(a.deepCourse,'deep').map(v=>[v,v==='RPM'?'RPM · 응용 반복':v])],
 deepStage:['심화는 어느 과정인가요?','심화 교재의 학년과 학기를 골라 주세요.',highBook(a.deepBook)?deepMath.map(v=>[v,v]):stageOptions(middleBook(a.deepBook))],
 deepStatus:['이 심화 과정은 끝냈나요?','지금 공부 중인지, 끝냈는지 골라주세요.',progress],
 calc:[young?'수와 계산은 어디까지 공부했나요?':'연산은 어디까지 되나요?',group==='preschool'?'수를 나누고 모으기, 덧셈·뺄셈 등을 말해요.':young?'덧셈·뺄셈·곱셈·나눗셈 중 혼자 할 수 있는 것을 골라주세요.':'도움 없이 혼자 할 수 있는 단계예요.',calc.map(([v,t])=>[v,t]).concat(older?[['advanced','그 이후 단계']]:[]).concat([['high','고등 계산·식 변형 연습'],['none','아직 시작 전'],['unknown','잘 모르겠어요']])],
 calcHigh:[fields.internationalCalendar?'계산·식 변형은 어느 과목에서 연습하나요?':'계산·식 변형은 어느 고등 과목에서 연습하나요?','현재 교과·심화와 별개로 실제 연습하는 범위를 고릅니다.',calcMath.map(v=>[v,v])],
 calcStatus:[(calc.find(c=>c[0]===a.calc)?.[1]||'이 연산')+' 단계는요?','지금 연습하는 중인지, 끝냈는지 골라 주세요.',progress],
 compExact:['지금 사고력 교재는요?','현재 과정 하나만 골라 주세요.',P.COMP.map((c,i)=>[String(i),c[0]])],
 schoolExact:['교과는 어느 과정인가요?','교과 교재의 학년과 학기를 골라 주세요.',[['13','초등 계통 대수심화'],...stageOptions(true)]],
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

function sourceMode(a,fields){a=effective(a);if(fields.internationalCalendar)return true;if(!gradeChoice(a,fields))return false;return highBook(a.schoolBook)||+gradeChoice(a,fields)>=10||noThinking(a)||special(a.calc)||special(a.schoolBook)||(a.schoolStatus==='done'&&+a.schoolExact===19&&middleBook(a.schoolBook))||(a.calc==='advanced'&&+a.calcExact===P.CALC.length-1&&a.calcStatus==='done')||(a.thinking==='advanced'&&+a.compExact===P.COMP.length-1&&a.thinkingStatus==='done')||gradeForAge(age(a,fields),fields.mon)<1||['킨더팩토','키즈팩토'].includes(a.thinking)||schoolChoice(a)==='none'||(a.calc==='소마셈 K'&&a.calcStatus!=='done');}
function nextComp(index,band){let n=index+1;while(band!=='A'&&n<P.COMP.length&&P.COMP[n][2]==='skip')n++;return Math.min(n,P.COMP.length-1);}
function fieldChanges(a,fields,key){a=effective(a);
 const result={};const recalc=['band','speed'].includes(key),y=age(a,fields),g=gradeForAge(y,fields.mon);
 if(['age','grade'].includes(key)&&g>=1&&g<=12)result.grade=String(g);
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
 return [{key:'grade',label:'학년',text:studentLabel(a,fields)},
 {key:'thinking',label:'사고력',text:noThinking(a)?(a.thinkingExperience==='none'?'공부한 경험 없음':'잘 모르겠어요'):(a.thinking==='advanced'?(P.COMP[+a.compExact]?.[0]||'이후 과정'):a.thinking||'미선택')+' '+status('thinkingStatus')},
 {key:'school',label:'교과',text:special(a.schoolBook)?absent(a.schoolBook):[a.schoolExact==='13'&&a.school==='advanced'?'':a.schoolBook||'',highBook(a.schoolBook)?a.schoolHigh||'과목 미선택':middleBook(a.schoolBook)||a.school==='advanced'?(+a.schoolExact<=12?P.SEM(+a.schoolExact):a.schoolExact==='13'?'초등 계통 대수심화':P.MID[+a.schoolExact-14]||'이후 과정'):a.school||'미선택',status('schoolStatus')].filter(Boolean).join(' ')},
 {key:'deepBook',label:'심화',text:special(a.deepBook)?absent(a.deepBook):a.deepBook?`${a.deepBook} ${highBook(a.deepBook)?a.deepStage||'과목 미선택':middleBook(a.deepBook)?P.MID[+a.deepStage-14]||'과정 미선택':a.deepStage||'과정 미선택'} ${status('deepStatus')}`:'미선택'},
 {key:'calc',label:'연산',text:special(a.calc)?absent(a.calc):a.calc==='high'?(a.calcHigh||'고등 과목 확인 전')+' · 계산·식 변형 연습 '+status('calcStatus'):(a.calc==='advanced'?(P.CALC[+a.calcExact]?.[0]||'이후 단계'):calc.find(c=>c[0]===a.calc)?.[1]||'미선택')+' '+status('calcStatus')}];
}
// Each subject resolves independently. An original-only answer never replaces
// the other subjects with the original demo's limited curriculum.
function hasAnswer(a,fields,key){
 if(fields.pendingStatus?.[key])return false;const q=questions(a,fields)[key];return !!q&&q[2].some(([v])=>String(key==='grade'?gradeChoice(a,fields):a[key])===String(v));
}
function firstMissing(a,fields){return order(a,fields).find(k=>!hasAnswer(a,fields,k));}
function options(a,fields,overrides={}){a=effective(a);
 const value={band:fields.band||'B',grade:Math.max(1,gradeForAge(age(a,fields),fields.mon)),mon:+fields.mon,year:new Date().getFullYear(),school:1,schoolLeft:1,comp:0,compLeft:3,calc:1,calcLeft:1,speed:+fields.speed||2,hw:'none',hwDeep:false,hwMid:false,gifted:false,kmo:'switch',...fieldChanges(a,fields,'band'),...overrides};
 for(const key of ['grade','mon','year','school','schoolLeft','comp','compLeft','calc','calcLeft','speed'])value[key]=+value[key];return value;
}
function deepRow(a,fields,now){a=effective(a);
 if(highBook(a.deepBook))return null;
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
 if(highBook(a.schoolBook)||a.calc==='high')plan.rows=plan.rows.map(r=>(r.key==='school'&&highBook(a.schoolBook))||(r.key==='calc'&&a.calc==='high')?{...r,blocks:[]}:r);
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
 if(fields.internationalCalendar){const summaries=summary(a,fields);return {ready:false,now:null,nowLabel:studentLabel(a,fields),rows:[['school','school'],['thinking1','thinking'],['deep','deepBook'],['calc','calc']].map(([key,label])=>({key,current:{shortText:summaries.find(x=>x.key===label)?.text||'확인 전',e:null},blocks:[],remaining:[],next:null})),comparison:{ready:false,levels:[],best:null}};}
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
  const resolved=fromEngine(k);if(k==='school'&&highBook(a.schoolBook)){resolved.blocks=[];resolved.remaining=[];resolved.next=null;}if(exhausted){resolved.blocks=[];resolved.remaining=[];resolved.next=null;}return resolved;
 });
 if(Object.hasOwn(a,'deepBook'))rows.splice(2,0,fromEngine('deep'));
 return {...original,nowLabel:labelMonth(now),rows,comparison:Object.values(fields.pendingStatus||{}).some(Boolean)?{ready:false,levels:[],best:null}:original.comparison};
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
global.PlannerIntake=Object.freeze({highSubjects,highBook,bookList,thinking,calc,schoolBooks,deepBooks,special,effective,middleBook,noThinking,age,gradeChoice,audience,learningLabels,studentLabel,labelMonth,gradeForAge,order,standardBook,questions,hasAnswer,firstMissing,sourceInput,options,deepRow,buildPlan,profile,narrative,sourceMode,fieldChanges,summary,milestones});
})(window);
