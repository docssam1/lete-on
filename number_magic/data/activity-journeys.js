/* Original interactive representations of EXISTING concepts. These scene IDs
   identify non-scored practice evidence, never new curriculum/question IDs. */
export const JOURNEY_VERSION=1;
export const LINKS=Object.freeze({
 'A-02':{unit:'A-02',tab:'discover',generator:'move10',roles:['concept','number-transfer','word-transfer'],scored:false,reward:'none'},
 'M-02':{unit:'M-02',tab:'discover',generator:'md2_intAddSub',roles:['concept','comparison','number-transfer','word-transfer'],scored:false,reward:'none'},
 'T-DV4':{unit:'T-DV4',tab:'discover',thread:'DV7',generator:'dv7_gcdLcm',roles:['concept','number-transfer','word-transfer-divide','word-transfer-meet'],scored:false,reward:'none'}
});
const definitions={
 'A-02':[
  {id:'concept',kind:'ten',a:8,b:7,prefix:['L','R']},
  {id:'number-transfer',kind:'ten',a:9,b:5,prefix:['NT','NA']},
  {id:'word-transfer',kind:'ten',a:7,b:6,prefix:['WT','WA'],word:true}],
 'M-02':[
  {id:'concept',kind:'integer',a:-2,op:'+',b:-3},
  {id:'comparison',kind:'integer',a:2,op:'-',b:-3},
  {id:'number-transfer',kind:'integer',a:-1,op:'-',b:-4},
  {id:'word-transfer',kind:'integer',a:-1,op:'+',b:4,word:true}],
 'T-DV4':[
  {id:'concept',kind:'common',a:6,b:8},
  {id:'number-transfer',kind:'common',a:4,b:10},
  {id:'word-transfer-divide',kind:'common',a:6,b:8,word:'divide'},
  {id:'word-transfer-meet',kind:'common',a:6,b:8,word:'meet'}]
};
const clone=v=>JSON.parse(JSON.stringify(v));
const gcd=(a,b)=>b?gcd(b,a%b):a;
const ids=(prefix,n)=>Array.from({length:n},(_,i)=>prefix+String(i+1).padStart(2,'0'));
export const hasJourney=uid=>Object.hasOwn(definitions,uid);
export function scenes(uid){return clone(definitions[uid]||[]);}
function fresh(){return {phase:0,selection:[],moved:[],prediction:null,grouped:false,model:null,answer:null,verified:false,meaning:false,face:null,walk:null,target:null,steps:0,position:0,path:[],divisorsA:[],divisorsB:[],tried:[],common:[],groupSize:null,greatest:null,trackA:[],trackB:[],least:null,rearranged:false,names:false,productRead:false,history:[]};}
export function createJourney(uid){
 if(!hasJourney(uid))throw Error('Unknown existing activity');
 return {version:JOURNEY_VERSION,uid,index:0,revision:0,actionSequence:0,processed:[],attempts:[],assistance:{},completed:null,states:scenes(uid).map(()=>fresh()),saveStatus:'unsaved'};
}
export function restoreJourney(uid,value){
 try{if(value?.uid!==uid||value.version!==JOURNEY_VERSION)throw Error();const s=clone(value);if(s.states.length!==scenes(uid).length)throw Error();assertJourney(s);return s;}catch{return createJourney(uid);}
}
export function current(s){return s.states[s.index];}
export function view(s){
 const d=scenes(s.uid)[s.index],v=current(s),answer=d.kind==='ten'?d.a+d.b:d.kind==='integer'?d.a+(d.op==='+'?d.b:-d.b):d.word==='divide'?gcd(d.a,d.b):d.word==='meet'?d.a*d.b/gcd(d.a,d.b):d.a*d.b;
 let objects=[];
 if(d.kind==='ten')objects=[...ids(d.prefix[0],d.a).map((id,i)=>({id,origin:'left',group:'left',slot:i,mark:'circle'})),...ids(d.prefix[1],d.b).map((id,i)=>({id,origin:'right',group:v.moved.includes(id)?'left':'right',slot:v.moved.includes(id)?d.a+v.moved.indexOf(id):i,mark:'stripe'}))];
 if(d.kind==='common')objects=v.phase>=2&&!d.word?Array.from({length:d.a*d.b},(_,i)=>({id:d.id==='number-transfer'?'Q'+String(i).padStart(2,'0'):'U'+String(i+1).padStart(2,'0'),origin:'product',group:v.rearranged?Math.floor(i/gcd(d.a,d.b)):'array',slot:i,mark:'circle'})):[...ids('A',d.a).map((id,i)=>({id,origin:'A',group:'A',slot:i,mark:'circle'})),...ids('B',d.b).map((id,i)=>({id,origin:'B',group:'B',slot:i,mark:'stripe'}))];
 return {...clone(v),...d,answer,objects,selected:clone(v.selection),index:s.index,sceneCount:s.states.length,revision:s.revision,assisted:!!s.assistance[d.id]?.length,complete:s.states.every(v=>v.verified&&v.meaning),completed:s.completed,saveStatus:s.saveStatus};
}
export function equation(s,lang='ko'){const v=view(s),tr=(ko,en,zh)=>lang==='en'?en:lang==='zh'?zh:ko;
 if(v.kind==='ten')return v.verified?`10 + ${v.b-v.moved.length} = ${v.answer}`:v.grouped?`${v.a} + ${10-v.a} + ${v.b-(10-v.a)} = 10 + ${v.b-(10-v.a)}`:v.moved.length===10-v.a?`${v.a} + ${v.b} = ${v.a} + ${10-v.a} + ${v.b-(10-v.a)}`:`${v.a} + ${v.b} = ?`;
 if(v.kind==='integer'){const sign=n=>n>0?'+'+n:String(n).replace('-','−'),p=`${sign(v.a)} ${v.op==='-'?'−':'+'} (${sign(v.b)})`;return v.verified?`${p} = ${v.op==='-'&&v.b<0?`${sign(v.a)} + (+${-v.b}) = `:''}${sign(v.answer)}`:`${p} = ?`;}
 if(v.word==='divide')return v.verified?`${v.answer} m`:`${v.a} m · ${v.b} m`;
 if(v.word==='meet')return v.verified?`${v.answer} ${tr('분','min','分钟')}`:`${v.a} ${tr('분','min','分钟')} · ${v.b} ${tr('분','min','分钟')}`;
 if(v.phase===0)return `${v.a} ${tr('개','pieces','个')} · ${v.b} ${tr('개','pieces','个')}`;
 if(v.phase===1)return `${tr('최대공약수','Greatest common divisor','最大公因数')} ${v.greatest}`;
 if(v.rearranged&&v.phase===4)return `${v.a} × ${v.b} = □ × ${v.greatest}`;
 return v.rearranged?`${v.a} × ${v.b} = ${v.least} × ${v.greatest}${v.verified?` = ${v.answer}`:''}`:`${v.a} × ${v.b} = ${v.phase>=2?v.a*v.b:'?'}`;
}
export function act(s,action,value,actionId){
 const n=clone(s),v=current(n),d=scenes(n.uid)[n.index],id=actionId||`${n.uid}:${n.actionSequence+1}`;
 if(n.processed.includes(id))return n;
 const backup=clone(v);delete backup.history;
 let changed=false,error='',help=false;
 const expectedG=gcd(d.a,d.b),expectedL=d.a*d.b/expectedG;
 const fail=(message,semantic=true)=>{error=message;help=semantic;};
 if(action==='hint'){help=true;error=d.kind==='ten'?'빈칸을 하나씩 살펴봐.':d.kind==='integer'?'뒤 수는 보는 쪽, 가운데 기호는 걷는 방법이야.':'두 모임이 각각 남김없이 나뉘는지 봐.';}
 else if(action==='reset'){const history=v.history;Object.assign(v,fresh());v.history=history;changed=true;}
 else if(action==='undo'){const previous=v.history.pop();if(previous){const h=v.history;Object.assign(v,previous);v.history=h;changed=true;}}
 else if(action==='next'){if(v.verified&&v.meaning&&n.index<n.states.length-1){n.index++;changed=true;}else fail('현재 장면을 먼저 확인해 봐.',false);}
 else if(action==='model'){
  const correct=d.kind==='ten'?'+':d.kind==='integer'?'+':d.word;
  if(value===correct){v.model=value;if(d.kind==='common'&&d.word==='meet')v.phase=1;changed=true;}else fail('상황에서 무엇이 달라졌는지 다시 살펴봐.');
 }
 else if(d.kind==='ten'){
  if(action==='predict'&&v.phase===0){v.prediction=value;changed=true;}
  if(action==='begin'&&v.phase===0&&v.prediction!==null&&(!d.word||v.model)){v.phase=1;changed=true;}
  if(action==='select'&&v.phase===1){const selectable=ids(d.prefix[1],d.b).includes(value)&&!v.moved.includes(value);if(selectable){if(v.selection.includes(value))v.selection=v.selection.filter(id=>id!==value);else if(v.selection.length<10-d.a-v.moved.length)v.selection.push(value);else fail('남은 빈칸만큼만 고를 수 있어.',false);changed=!error;}}
  if(action==='move'&&v.phase===1){if(v.selection.length&&v.selection.length<=10-d.a-v.moved.length){v.moved.push(...v.selection);v.selection=[];changed=true;if(v.moved.length===10-d.a)v.phase=2;}else fail('옮길 블록을 먼저 골라 봐.',false);}
  if(action==='group'&&v.phase===2&&v.moved.length===10-d.a){v.grouped=true;v.phase=3;changed=true;}
  if(action==='submit'&&v.phase===3){n.attempts.push({id,scene:d.id,revision:n.revision,answer:value});if(Number(value)===d.a+d.b){v.answer=Number(value);v.verified=true;v.phase=4;changed=true;}else fail('10 묶음 옆에 남은 블록을 다시 세어 봐.');}
  if(action==='meaning'&&v.phase===4){if(value==='moved'){v.meaning=true;changed=true;}else fail('새 블록이 생겼는지, 같은 블록이 옮겨졌는지 봐.');}
 }
 else if(d.kind==='integer'){
  if(action==='start'&&v.phase===0&&(!d.word||v.model)){if(Number(value)===d.a){v.position=d.a;v.path=[0,d.a];v.phase=1;changed=true;}else fail('문제의 처음 수가 어느 위치인지 봐.');}
  if(action==='face'&&v.phase===1){if(Number(value)===Math.sign(d.b)){v.face=Number(value);v.phase=2;changed=true;}else fail('뒤 수의 −는 왼쪽, +는 오른쪽을 보는 뜻이야.');}
  if(action==='walk'&&v.phase===2){if(Number(value)===(d.op==='+'?1:-1)){v.walk=Number(value);v.phase=3;changed=true;}else fail('가운데 +는 앞으로, −는 뒤로 걷기야. 보는 쪽은 그대로야.');}
  if(action==='count'&&v.phase===3){if(Number(value)===Math.abs(d.b)){v.target=Number(value);v.phase=4;changed=true;}else fail('뒤 수의 크기만큼 걸어 봐.');}
  if(action==='step'&&v.phase===4){const count=value==='all'?v.target-v.steps:1;if(count>0){for(let i=0;i<count;i++){v.position+=v.face*v.walk;v.steps++;v.path.push(v.position);}if(v.steps===v.target)v.phase=5;changed=true;}}
  if(action==='submit'&&v.phase===5){n.attempts.push({id,scene:d.id,revision:n.revision,answer:value});if(Number(value)===v.position&&v.steps===Math.abs(d.b)){v.answer=Number(value);v.verified=true;v.phase=6;changed=true;}else fail('사람이 지금 서 있는 눈금을 읽어 봐.');}
  if(action==='meaning'&&v.phase===6){if(value==='roles'){v.meaning=true;changed=true;}else fail('보는 쪽과 걷는 쪽은 다른 역할이야.');}
 }
 else if(d.kind==='common'){
  if(action==='tryGroup'&&v.phase===0&&(!d.word||v.model)){const k=Number(value);if(Number.isInteger(k)&&k>0&&k<=Math.max(d.a,d.b)){v.groupSize=k;if(!v.tried.includes(k))v.tried.push(k);if(d.a%k===0&&!v.divisorsA.includes(k))v.divisorsA.push(k);if(d.b%k===0&&!v.divisorsB.includes(k))v.divisorsB.push(k);changed=true;}}
  if(action==='common'&&v.phase===0){const k=Number(value);if(v.divisorsA.includes(k)&&v.divisorsB.includes(k)){if(!v.common.includes(k))v.common.push(k);changed=true;}else fail('두 모임에서 모두 남는 것이 없는지 확인해 봐.');}
  if(action==='greatest'&&v.phase===0){const all=Array.from({length:expectedG},(_,i)=>i+1).filter(k=>d.a%k===0&&d.b%k===0);if(all.every(k=>v.common.includes(k))&&Number(value)===expectedG){v.greatest=expectedG;v.groupSize=expectedG;v.phase=d.word==='divide'?2:1;changed=true;}else fail('공통으로 나누는 후보를 모두 찾고, 그중 가장 큰 수를 골라 봐.');}
  if(action==='track'&&v.phase===1&&['A','B'].includes(value)){const list=value==='A'?v.trackA:v.trackB,step=value==='A'?d.a:d.b,last=list.at(-1)||0;if(last+step<=expectedL*2){list.push(last+step);changed=true;}}
  if(action==='least'&&v.phase===1){const k=Number(value);if(k===expectedL&&v.trackA.includes(k)&&v.trackB.includes(k)){v.least=k;v.phase=2;changed=true;}else fail('0 다음에 처음 함께 만난 곳을 찾아봐.');}
  if(d.word){
   if(action==='submit'&&v.phase===2&&v.model===d.word){n.attempts.push({id,scene:d.id,revision:n.revision,answer:value});if(Number(value)===(d.word==='divide'?expectedG:expectedL)){v.verified=true;v.answer=Number(value);v.phase=7;changed=true;}else fail('상황에 맞는 묶기 또는 첫 만남을 다시 봐.');}
   if(action==='meaning'&&v.verified){if(value===d.word){v.meaning=true;changed=true;}else fail('이야기의 단위와 찾은 수의 역할을 연결해 봐.');}
  }else{
   if(action==='array'&&v.phase===2){v.phase=3;changed=true;}
   if(action==='regroup'&&v.phase===3){v.rearranged=true;v.phase=4;changed=true;}
   if(action==='groups'&&v.phase===4){if(Number(value)===expectedL){v.phase=5;changed=true;}else fail('묶음 수와 한 묶음 안의 개수를 구분해 봐.');}
   if(action==='names'&&v.phase===5){if(value==='correct'){v.names=true;v.phase=6;changed=true;}else fail('최대공약수와 최소공배수의 이름을 확인해 봐.');}
   if(action==='product'&&v.phase===6){if(value==='multiply'){v.productRead=true;changed=true;}else fail('AB는 두 자리 수가 아니라 A×B야.');}
   if(action==='submit'&&v.phase===6&&v.productRead){n.attempts.push({id,scene:d.id,revision:n.revision,answer:value});if(Number(value)===d.a*d.b){v.verified=true;v.meaning=true;v.answer=Number(value);v.phase=7;changed=true;}else fail('같은 블록의 개수가 그대로인지 봐.');}
  }
 }
 if(help){n.assistance[d.id]||=[];n.assistance[d.id].push({id,action,message:error});}
 if(changed){if(!['undo','next'].includes(action))v.history.push(backup);n.revision++;n.saveStatus='unsaved';}
 n.actionSequence++;n.processed.push(id);n.feedback=error;
 assertJourney(n);return n;
}
export function finalize(s){const n=clone(s);if(!view(n).complete)throw Error('Unverified roles');if(!n.completed)n.completed={id:`${n.uid}:concept:${JOURNEY_VERSION}`,roles:n.states.map((v,i)=>({id:scenes(n.uid)[i].id,assisted:!!n.assistance[scenes(n.uid)[i].id]?.length})),reward:0};return n;}
export function assertJourney(s){
 const ds=scenes(s.uid);if(s.index<0||s.index>=ds.length)throw Error('Invalid scene');
 for(let i=0;i<ds.length;i++){const d=ds[i],v=s.states[i];if(d.kind==='ten'){const allowed=ids(d.prefix[1],d.b);if(new Set(v.moved).size!==v.moved.length||v.moved.some(id=>!allowed.includes(id))||v.moved.length>10-d.a)throw Error('Object conservation');if(v.verified&&(!v.grouped||v.moved.length!==10-d.a||v.answer!==d.a+d.b))throw Error('Premature verification');}
 if(d.kind==='integer'&&(v.verified&&(v.face!==Math.sign(d.b)||v.walk!==(d.op==='+'?1:-1)||v.steps!==Math.abs(d.b)||v.position!==d.a+(d.op==='+'?d.b:-d.b))))throw Error('Direction/step invariant');
 if(d.kind==='common'&&v.verified){const G=gcd(d.a,d.b),L=d.a*d.b/G;if(d.word){if(v.model!==d.word||(d.word==='divide'?(v.greatest!==G||v.answer!==G):(v.least!==L||v.answer!==L)))throw Error('Unverified word meaning');}else if(v.greatest!==G||v.least!==L||!v.rearranged||!v.names||!v.productRead||v.answer!==d.a*d.b)throw Error('Unverified meanings');}}
 const objects=view(s).objects;if(new Set(objects.map(o=>o.id)).size!==objects.length)throw Error('Duplicate object');return true;
}
