/* Compact intake backed by the first demo. Source curriculum stays in DemoContent. */
(function(global){
'use strict';
const D=global.DemoContent,P=global.Planner;
const thinking=['킨더팩토','키즈팩토','초등팩토','PRE 1031','1031 입문','1031 초급'];
const calc=[['소마셈 K','수 가르기·모으기'],['기적의 계산법 2권','한 자리 덧셈·뺄셈'],['기적의 계산법 3권','받아올림·받아내림'],['기적의 계산법 4권','구구단'],['기적의 계산법 5권','곱셈·나눗셈'],['기적의 계산법 6권','복합 계산']];
const progress=[['progress','지금 하는 중'],['done','끝냈어요']];
function age(a,fields){if(a.age&&a.age!=='older')return +a.age;if(a.age==='older'&&!a.grade)return 10;return 5+Math.floor(P.mOf(+(a.grade||fields.grade),+fields.mon)/12);}
function gradeForAge(value,month){return +value-7-(+month<3?1:0);}
function order(a,fields){
 const list=['age'];if(a.age==='older')list.push('grade');
 list.push('thinking');if(a.thinking==='advanced')list.push('compExact');list.push('thinkingStatus');
 if(a.thinking==='PRE 1031')list.push('preDone');
 list.push('school');if(a.school==='advanced')list.push('schoolExact');
 list.push('calc');if(a.calc==='advanced')list.push('calcExact');list.push('calcStatus');
 const y=age(a,fields);if(y>=6&&y<=9&&['A','B'].includes(fields.band))list.push('hw');list.push('gifted');return list;
}
function questions(a,fields){const older=age(a,fields)>=8;return {
 age:['아이는 지금 몇 살인가요?','한국 나이 기준으로 골라 주세요.',[4,5,6,7,8,9].map(v=>[String(v),v+'세']).concat([['older','10세 이상']])],
 grade:['지금 몇 학년인가요?','현재 학년을 골라 주세요.',[1,2,3,4,5,6].filter(v=>v>=(+fields.mon<3?2:3)).map(v=>[String(v),'초등 '+v+'학년'])],
 thinking:['사고력은 어디까지 했나요?','가장 최근에 공부한 과정을 골라 주세요.',thinking.map(v=>[v,v]).concat(older?[['advanced','그 이후 과정']]:[])],
 thinkingStatus:[(a.thinking==='advanced'?'이 사고력 과정은':a.thinking||'이 과정은')+' 어떤 상태인가요?','완료한 과정과 진행 중인 과정을 구분해요.',progress],
 preDone:['초등팩토는 끝냈나요?','PRE 1031의 기본·심화 위치를 구분할게요.',[['1','네'],['0','아니요']]],
 school:['교과는 어디까지 했나요?','지금 공부하는 학기를 골라 주세요.',[['none','아직 시작 전'],...Array.from({length:6},(_,i)=>[P.SEM(i+1),P.SEM(i+1)])].concat(older?[['advanced','그 이후 과정']]:[])],
 calc:['연산은 어디까지 되나요?','도움 없이 혼자 할 수 있는 단계예요.',calc.map(([v,t])=>[v,t]).concat(older?[['advanced','그 이후 단계']]:[])],
 calcStatus:[(calc.find(c=>c[0]===a.calc)?.[1]||'이 연산')+' 단계는요?','지금 연습하는 중인지, 끝냈는지 골라 주세요.',progress],
 compExact:['지금 사고력 교재는요?','현재 과정 하나만 골라 주세요.',P.COMP.map((c,i)=>[String(i),c[0]])],
 schoolExact:['지금 교과 과정은요?','현재 과정 하나만 골라 주세요.',[...Array.from({length:6},(_,i)=>[String(i+7),P.SEM(i+7)]),['13','계통·대수'],...P.MID.map((t,i)=>[String(i+14),t])]],
 calcExact:['지금 연산 교재는요?','현재 과정 하나만 골라 주세요.',P.CALC.map((c,i)=>[String(i),c[0]])],
 hw:['생각하는 황소도 고려하고 계세요?','나중에 바꿔도 괜찮아요.',[['1','네'],['0','아니요'],['pending','아직 고민 중']]],
 gifted:['영재원도 고려하고 계세요?','나중에 바꿔도 괜찮아요.',[['1','네'],['0','아니요'],['pending','아직 고민 중']]]
 };}
function sourceInput(a,fields){
 const thinkingValues=[];
 if(thinking.includes(a.thinking)&&a.thinkingStatus){thinkingValues.push(a.thinking+' '+(a.thinkingStatus==='done'?'완료':'진행 중'));if(a.thinking==='PRE 1031'&&a.preDone==='1')thinkingValues.push('초등팩토 완료');}
 return {age:age(a,fields),month:+fields.mon,thinking:thinkingValues,
  school:a.school&&a.school!=='advanced'?(a.school==='none'?'교과 진행 안 함':a.school+' 진행 중'):undefined,
  calcRadio:a.calc&&a.calc!=='advanced'&&a.calcStatus?a.calc+' '+(a.calcStatus==='done'?'완료':'진행 중'):undefined};
}
function profile(a,fields){return D.buildProfile(sourceInput(a,fields));}
function sourceMode(a,fields){if(!a.age)return false;return (a.calc==='advanced'&&+a.calcExact===P.CALC.length-1&&a.calcStatus==='done')||(a.thinking==='advanced'&&+a.compExact===P.COMP.length-1&&a.thinkingStatus==='done')||gradeForAge(age(a,fields),fields.mon)<1||['킨더팩토','키즈팩토'].includes(a.thinking)||a.school==='none'||(a.calc==='소마셈 K'&&a.calcStatus!=='done');}
function nextComp(index,band){let n=index+1;while(band!=='A'&&n<P.COMP.length&&P.COMP[n][2]==='skip')n++;return Math.min(n,P.COMP.length-1);}
function fieldChanges(a,fields,key){
 const result={};const y=age(a,fields),g=gradeForAge(y,fields.mon);
 if(['age','grade'].includes(key)&&g>=1&&g<=6)result.grade=String(g);
 if(key==='school'&&a.school!=='none'&&a.school!=='advanced')result.school=String(2*(+a.school[0]-1)+(+a.school[2]));
 if(key==='schoolExact')result.school=a.schoolExact;
 if(key==='school'||key==='schoolExact')result.schoolLeft='2';
 if(['thinking','thinkingStatus','preDone','compExact'].includes(key)&&a.thinkingStatus){
   let n=a.thinking==='advanced'?+a.compExact:({'초등팩토':0,'PRE 1031':a.preDone==='1'?1:0,'1031 입문':2,'1031 초급':4})[a.thinking];
   if(Number.isInteger(n)){if(a.thinkingStatus==='done')n=nextComp(n,fields.band);result.comp=String(n);result.compLeft=String(a.thinkingStatus==='done'?P.COMP[n][1]:Math.max(1,Math.ceil(P.COMP[n][1]/2)));}
 }
 if(['calc','calcStatus','calcExact'].includes(key)&&a.calcStatus){
   let n=a.calc==='advanced'?+a.calcExact:a.calc==='소마셈 K'?(a.calcStatus==='done'?1:null):parseInt(a.calc.match(/(\d+)권/)?.[1]||'',10)-1;
   if(Number.isInteger(n)){if(a.calcStatus==='done'&&a.calc!=='소마셈 K')n=Math.min(n+1,P.CALC.length-1);result.calc=String(n);result.calcLeft=String(a.calcStatus==='done'?(P.CALC[n][1]||(fields.band==='C'?5:+fields.speed||2)):Math.max(1,Math.ceil((P.CALC[n][1]||(fields.band==='C'?5:+fields.speed||2))/2)));}
 }
 return result;
}
function summary(a,fields){const status=k=>a[k]==='done'?'완료':a[k]==='progress'?'진행 중':'';
 return [{key:'age',label:'나이',text:a.age?age(a,fields)+'세':'미선택'},
 {key:'thinking',label:'사고력',text:(a.thinking==='advanced'?(P.COMP[+a.compExact]?.[0]||'이후 과정'):a.thinking||'미선택')+' '+status('thinkingStatus')},
 {key:'school',label:'교과',text:a.school==='none'?'아직 시작 전':a.school==='advanced'?(+a.schoolExact<=12?P.SEM(+a.schoolExact):a.schoolExact==='13'?'계통·대수':P.MID[+a.schoolExact-14]||'이후 과정'):a.school||'미선택'},
 {key:'calc',label:'연산',text:(a.calc==='advanced'?(P.CALC[+a.calcExact]?.[0]||'이후 단계'):calc.find(c=>c[0]===a.calc)?.[1]||'미선택')+' '+status('calcStatus')}];
}
function milestones(a,fields,p){
 const current=summary(a,fields).slice(1).map(x=>x.text).join(' · '),main=[{m:p.now,kind:'now',title:'현재 · '+p.nowLabel,sub:current,icon:''}];
 const labels={school:'교과',thinking1:'사고력',calc:'연산'};
 const future=p.rows.map(row=>row.next?{m:row.next.s,kind:'step',title:labels[row.key]+' · '+row.next.shortText,sub:'다음에 이어갈 학습이에요.',icon:''}:{m:Math.max(p.now+1,row.current.e+1),kind:'step',title:labels[row.key]+' · 다음 단계 확인',sub:'현재 과정을 마친 뒤 다음 학습을 정해요.',icon:''});
 main.push(...future.sort((a,b)=>a.m-b.m));
 const forks=[];const y=age(a,fields);
 if(y>=6&&y<=9)forks.push({id:'hw',title:'생각하는 황소',m:p.now+1,selected:a.hw==='1',pending:!['0','1'].includes(a.hw),yes:'과정 정보 함께 확인',no:'현재 학습 이어가기',reason:a.hw==='1'?'관심 과정의 안내를 함께 살펴봐요.':'지금 학습을 이어가며 나중에 바꿔도 괜찮아요.'});
 forks.push({id:'gift',title:'영재원',m:p.now+2,selected:a.gifted==='1',pending:!['0','1'].includes(a.gifted),yes:'선발 안내 함께 확인',no:'현재 학습 이어가기',reason:a.gifted==='1'?'선발 시기와 자격은 해당 연도 공고에서 확인해요.':'지금 학습을 이어가며 나중에 바꿔도 괜찮아요.'});
 return {main,branch:[],forks};
}
global.PlannerIntake=Object.freeze({thinking,calc,age,gradeForAge,order,questions,sourceInput,profile,sourceMode,fieldChanges,summary,milestones});
})(window);
