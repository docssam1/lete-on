// 3-1 창작 기말평가 — 원문 시험지가 없는 범위는 창작으로 명시한다.
// node scripts/bank-science-s31fin.mjs
import {readFileSync,writeFileSync} from 'node:fs';
const work = new URL('../science-lab/bank/work/s31fin/',import.meta.url);
const dest = new URL('../science-lab/data/units/',import.meta.url);
const rows = JSON.parse(readFileSync(new URL('assessment.json',work),'utf8'));
const curricula = ['s31u01','s31u02','s31u03','s31u04'].map((u)=>JSON.parse(readFileSync(new URL('../science-lab/bank/work/'+u+'/curriculum.json',import.meta.url),'utf8')));
const groups = [
 ['힘과 우리 생활',['힘과 관찰·비교 조건','수평과 저울의 무게 비교','도구의 도움과 근거 공유']],
 ['동물의 생활',['몸 특징의 관찰과 분류','환경과 동물의 생활','동물 특징과 설계·소통']],
 ['식물의 생활',['잎의 외형 관찰과 분류','환경과 식물의 생활','식물 특징과 설계·소통']],
 ['생물의 한살이',['동물의 연속 관찰과 기록','식물의 자람 조건 실험','한살이 유형과 자료 공유']],
];
const types = groups.flatMap(([name,names],g)=>names.map((name,i)=>({id:`T${String(g*3+i+1).padStart(2,'0')}`,element:`E${g+1}`,name,desc:`제시한 관찰·조사·설계 자료를 근거로 ${name}를 설명한다.`})));
const fixes = [
 ['비교하려는 무게 외의 조건을 함께 바꾸거나 관찰 사실과 추측을 섞어요',['힘','비교 조건'],'알아보려는 조건만 다르게 하고 나머지를 같게 해요. 실제 본 변화와 생각을 구별해요.'],
 ['물체 크기·받침점 거리만 보고 무게를 정하거나 저울 값을 거꾸로 비교해요',['수평','저울'],'같은 거리의 수평 결과와 다른 거리의 수평 결과를 구별하고, 저울의 값과 단위로 무게를 비교해요.'],
 ['도구를 쓰면 물체 자체의 무게가 없어지거나 언제나 같은 힘이 든다고 생각해요',['도구','드는 힘'],'같은 물체를 옮긴 조건과 실제 결과로 드는 힘의 차이를 설명해요. 도구를 쓴다고 물체 자체가 가벼워지지는 않아요.'],
 ['동물의 몸 특징이 보이지 않아도 없다고 단정하거나 다른 기준을 섞어요',['동물','분류 기준'],'확인할 수 있는 몸 특징으로 같은 기준을 적용하고 자료가 부족하면 더 확인으로 남겨요.'],
 ['한 동물의 특징이나 생활을 모든 동물에게 똑같이 적용해요',['환경','몸 특징'],'동물별 조사 자료로 환경·생김새·생활을 연결해요. 모든 물 동물의 이동 방법이 같지는 않아요.'],
 ['동물 이름만 닮으면 기능을 이용한 설계나 실제 시험·소통도 끝났다고 생각해요',['설계','의견'],'관찰한 특징을 기능과 연결하고 제작·시험·의견 나누기의 계획과 실제 기록을 구별해요.'],
 ['잎의 사진 크기를 실제 길이로 쓰거나 가려진 특징을 없다고 정해요',['잎','외형'],'확대 비율과 관찰 범위를 확인해요. 잎마다 기준과 근거를 남기며 다른 기준의 분류도 별도로 보관해요.'],
 ['한 식물의 생김새를 모든 환경·식물의 특징으로 단정해요',['식물','환경'],'조사한 식물의 생김새와 생활을 환경에 연결해요. 몸의 어느 부분이 어디에 있는지 출처로 확인해요.'],
 ['식물 특징과 관계없는 이름·색만 바꾸거나 계획을 실제 결과로 적어요',['특징','기능'],'특징을 물건의 어느 부분과 기능에 이용하는지 설명해요. 확인 계획과 실제 시험·의견을 구별해요.'],
 ['다른 개체·예상한 모습을 실제 날짜별 관찰 기록에 섞어요',['한살이','관찰 기록'],'같은 개체의 이름표·날짜·실제 모습과 측정 단위를 남겨 시간에 따른 변화를 비교해요.'],
 ['알아보려는 조건 외에 물·햇빛 등을 함께 바꾸거나 키만으로 건강한 자람을 정해요',['자람','실험 조건'],'자람의 물·햇빛 실험은 알아보려는 조건만 달리해요. 싹트기에서는 물·온도를 살피며, 자람은 높이와 잎·줄기를 함께 봐요.'],
 ['새 씨에서 난 식물을 같은 개체로 보거나 파일 작성만으로 공유 완료라고 해요',['한해살이','여러해살이'],'새 씨의 다음 세대와 겨울을 넘긴 같은 개체를 구별해요. 소개 자료를 실제로 나눈 상대·질문·수정을 기록해요.'],
];
const misconceptions=Object.fromEntries(fixes.map(([label,terms,fix],i)=>[`M${String(i+1).padStart(2,'0')}`,{label,terms,fix,element:`E${Math.floor(i/3)+1}`}]));
const judge={},distractors={},typed={},written={};
const items=rows.map((r)=>{
 const id=`s31-fin-f${r.form}-${String(r.no).padStart(2,'0')}`,m=r.type.replace('T','M'),format=({sc:'선택형',mc:'선택형',st:'단답형',wr:'서술형'})[r.kind];
 const ac=r.kind==='sc'?{type:'single-choice',answer:r.answer,accepted:[r.answer]}:r.kind==='mc'?{type:'multi-choice',answers:r.answer}:r.kind==='st'?{type:'short-text',answer:r.answer,accepted:r.accepted||[r.answer]}:{type:'written-explanation',sample:r.sample,rubric:{required:r.required,criteria:['직접 작성한 학습용 기준이며 원자료의 공식 배점표가 아니다.'],pass:'제시 자료와 기준에 맞게 설명한다.'}};
 if(r.kind==='wr'){judge[id]=r.judge;written[id]={partial:[]};}
 else if(r.kind==='st')typed[id]={any:m};
 else{const correct=new Set([].concat(r.answer));distractors[id]=Object.fromEntries(r.choices.map((_,i)=>i).filter(i=>!correct.has(i)).map(i=>[i,m]));}
 return {id,status:'authored',sourceRef:{type:'authored-assessment',set:r.form,no:r.no,edition:`GFIELD 창작 기말평가 ${r.form===1?'A':'B'}형`,course:'초등 3-1',unit:'기말평가'},taxonomy:{curriculum:'2022 개정',grade:3,semester:1,unit:'fin',area:'종합',element:r.element,type:r.type,format,level:'기본',track:'교과',standard:r.standard},prompt:r.prompt,givens:r.givens,choices:r.choices||null,responseContract:ac.type,answerContract:ac,explanation:r.explanation,evidence:{checkedBy:'창작 문항 검수',date:'2026-10-17',against:'교육부 성취기준과 검수한 3-1 네 단원 자료',gates:['science','answer'],note:'가상 기록은 문제 안에 표시한다. 실제 학생 수행·공식 성적 완료를 뜻하지 않는다.'}};
});
if(items.length!==60||new Set(items.map(q=>q.id)).size!==60)throw Error('창작 평가 문항 수·ID 오류');
const unit={id:'s31-fin',course:'3-1',no:null,title:'기말평가 · 창작',domain:'종합',sources:{basis:curricula.map(c=>`bank/work/${c.unit.replace('-','')}/curriculum.json`),originalExamAvailable:false},assessment:{authored:true,forms:[1,2],perForm:30,scope:groups.map(g=>g[0]),performanceNote:'자료 해석 문제이며 실제 관찰·실험·제작·협력적 소통을 대신하지 않는다.'}};
const taxonomy={unit:'s31-fin',curriculum:'2022 개정',grade:3,semester:1,title:'기말평가 · 창작',area:'종합',assessmentAuthored:true,assessmentFormatCounts:{'선택형':48,'단답형':8,'서술형':4},standards:curricula.flatMap(c=>c.standards),standardsSource:{...curricula[0].standardsSource,section:'초등학교 3~4학년 (1)~(4)'},standardsNote:'2022 개정 3-1 네 단원의 검수 자료에 근거해 직접 작성한 기말 평가다. 원문 시험지와 짝 문항은 없으며, 정적 문항을 실제 수행 증거로 세지 않는다.',elements:groups.map(([name],i)=>({id:`E${i+1}`,name})),types,formats:['선택형','단답형','서술형'],sources:{},authored:Object.fromEntries(items.map(q=>[q.id,q.taxonomy.type]))};
const json=x=>JSON.stringify(x,null,2),put=(name,text)=>writeFileSync(new URL(name,dest),text);
put('s31-fin.js',`// 3-1 창작 기말평가 60문항. 원문 시험지·짝 문항으로 세지 않는다.\nexport const unit = ${json(unit)};\nexport const items = ${json(items)};\n`);
put('s31-fin.taxonomy.js',`// 네 단원의 창작 기말평가 분류. sources는 원문 대응이 없어 비어 있다.\nexport const taxonomy = ${json(taxonomy)};\n`);
put('s31-fin.similar.js','// 원문 시험지가 없는 창작 평가이므로 원문 짝 유사문항은 없다.\nexport const similar = [];\n');
put('s31-fin.judge.js',`// 직접 작성한 서술형 기준. 실제 수행·공식 성적을 자동 확정하지 않는다.\nexport const judge = ${json(judge)};\n`);
const remedy=Object.fromEntries(Object.keys(misconceptions).map(m=>[m,{step:3}]));
put('s31-fin.misc.js',Object.entries({misconceptions,distractors,typed,remedy,written}).map(([k,v])=>`export const ${k} = ${json(v)};`).join('\n')+'\n');
console.log('s31-fin: 창작 60 · 원문 없음 · 원문 짝 없음 · A/B 각 30');
