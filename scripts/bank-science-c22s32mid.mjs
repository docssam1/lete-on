// 현행3-2 1~2단원 창작 중간평가. 기존 s32-mid 원문·ID는 보존한다.
import {readFileSync,writeFileSync} from 'node:fs';
const work=new URL('../science-lab/bank/work/c22s32mid/',import.meta.url),dest=new URL('../science-lab/data/units/',import.meta.url),u='c22-s32-mid';
const rows=JSON.parse(readFileSync(new URL('assessment.json',work)));
const curricula=['c22s32u01','c22s32u02'].map(id=>JSON.parse(readFileSync(new URL(`../science-lab/bank/work/${id}/curriculum.json`,import.meta.url))));
const names=['재료의 성질과 분류','세 상태의 관찰과 비교','성질을 이용한 설계','대기와 육지·바다','물 비교와 바닷가 지형','밀물·썰물과 갯벌 보전'];
const fixes=[
 '물체 이름·쓰임새와 물질 이름을 구별해요. 실제 시료의 성질을 같은 조건에서 비교하고 여러 재료를 함께 쓴 물체도 기록해요.',
 '그릇만 바꾸는 조건에서 고체·액체·기체를 비교해요. 알갱이 자체와 무더기, 물 높이와 부피를 구별해요.',
 '물체의 쓰임새와 확인한 재료 성질을 연결해요. 설계·시험 계획과 실제 제작·시험 결과를 구별해요.',
 '대기는 육지와 바다 위를 둘러싸요. 지구 전체 표면은 바다가 더 넓고, 한 장소의 사진이 전체를 보여 주지는 않아요.',
 '같은 양의 물 시료를 같은 절차로 비교해요. 육지의 물에도 물질이 들어 있을 수 있어요. 지형의 관찰 모습과 자료 출처를 확인해요.',
 '물이 들어오는 밀물과 빠지는 썰물을 같은 기준점에서 비교해요. 갯벌의 생물 서식지 가치와 구체적 보전 행동을 연결해요.',
];
const types=names.map((name,i)=>({id:`T${String(i+1).padStart(2,'0')}`,element:i<3?'E1':'E2',name,desc:`제시한 자료를 근거로 ${name}를 판단한다.`}));
const misconceptions=Object.fromEntries(types.map((t,i)=>[t.id.replace('T','M'),{label:t.name+'의 근거를 다시 확인해요',terms:[t.name],fix:fixes[i],element:t.element}]));
const judge={},typed={},distractors={},written={};
const items=rows.map(r=>{
 const id=`${u}-f${r.form}-${String(r.no).padStart(2,'0')}`,m=r.type.replace('T','M');
 const ac=r.kind==='sc'?{type:'single-choice',answer:r.answer,accepted:[r.answer]}:r.kind==='mc'?{type:'multi-choice',answers:r.answer}:r.kind==='st'?{type:'short-text',answer:r.answer,accepted:r.accepted}:{type:'written-explanation',sample:r.sample,rubric:{required:r.required,criteria:['직접 작성한 학습용 기준이며 공식 배점표가 아니다.'],pass:'근거와 설명의 연결을 선생님과 확인한다.'}};
 if(r.kind==='wr'){judge[id]={open:true,need:[],ex:{ok:[r.sample],part:[],no:[]},note:'다양한 타당한 설명을 선생님이 확인한다. 자동 성적 확정 없음.'};written[id]={partial:[]};}
 else if(r.kind==='st')typed[id]={any:m};
 else{const correct=new Set([].concat(r.answer));distractors[id]=Object.fromEntries(r.choices.map((_,i)=>i).filter(i=>!correct.has(i)).map(i=>[i,m]));}
 return {id,status:'authored',sourceRef:{type:'authored-assessment',set:r.form,no:r.no,edition:`GFIELD 창작 중간평가 ${r.form===1?'A':'B'}형`,course:'초등3-2',unit:'중간평가'},taxonomy:{curriculum:'2022 개정',grade:3,semester:2,unit:'mid',area:'종합',element:r.element,type:r.type,format:({sc:'선택형',mc:'선택형',st:'단답형',wr:'서술형'})[r.kind],level:'기본',track:'교과',standard:r.standard,topic:r.topic,concept:r.concept,inquirySkill:r.inquirySkill},prompt:r.prompt,givens:r.givens,choices:r.choices||null,responseContract:ac.type,answerContract:ac,explanation:r.explanation,evidence:{checkedBy:'창작 평가 문항 검수',date:'2026-10-18',gates:['science','answer'],against:'교육부4과05-01~03·4과06-01~03 및 앞서 본 두 단원 자체 교재·공공 자료',note:'제시 가상 자료의 지필 응답이며 실제 수행·공유·공식 성적 증거가 아니다.'}};
});
if(items.length!==60||new Set(items.map(q=>q.id)).size!==60)throw Error('문항 수·ID 오류');
const scope=curricula.map(c=>c.title),unit={id:u,course:'3-2',no:null,title:'중간평가 · 창작',domain:'종합',sources:{basis:curricula.map(c=>`bank/work/${c.unit.replaceAll('-','')}/curriculum.json`),originalExamAvailable:false},assessment:{authored:true,forms:[1,2],perForm:30,scope,scopeNote:'1~2단원을 대상으로 직접 구성한 학습용 범위이며 학교별 공식 시험 범위가 아니다.',performanceNote:'자료 해석 응답이며 실제 관찰·설계·조사·홍보 수행을 대신하지 않는다.'}};
const taxonomy={unit:u,curriculum:'2022 개정',grade:3,semester:2,title:unit.title,area:'종합',assessmentAuthored:true,assessmentFormatCounts:{선택형:48,단답형:8,서술형:4},standards:curricula.flatMap(c=>c.standards),standardsSource:{...curricula[0].standardsSource,section:'초등학교3~4학년 (5)·(6)'},standardsNote:'현행3-2 1~2단원 창작 중간평가60개. 기존 탐구·동물·지표 변화 중간평가를 원문으로 바꾸지 않는다. 실제 수행과 공식 성적은 별도 확인한다.',elements:scope.map((name,i)=>({id:`E${i+1}`,name})),types,sources:{},authored:Object.fromEntries(items.map(q=>[q.id,q.taxonomy.type]))};
const json=o=>JSON.stringify(o,null,2),put=(suffix,s)=>writeFileSync(new URL(u+suffix+'.js',dest),s);
put('',`export const unit = ${json(unit)};\nexport const items = ${json(items)};\n`);
put('.taxonomy',`export const taxonomy = ${json(taxonomy)};\n`);
put('.similar','// 현재 범위의 원문 시험지가 없어 가짜 짝을 만들지 않는다.\nexport const similar = [];\n');
put('.judge',`export const judge = ${json(judge)};\n`);
put('.misc',Object.entries({misconceptions,typed,distractors,written,remedy:Object.fromEntries(Object.keys(misconceptions).map(m=>[m,{step:3}]))}).map(([k,v])=>`export const ${k} = ${json(v)};`).join('\n')+'\n');
console.log(u+': 창작60·원문0·짝0·A/B 각30');
