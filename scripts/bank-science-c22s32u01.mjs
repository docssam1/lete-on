// 현재 교육과정의 독립 단원. 기존 원문·짝 ID와 옛 단원은 보존한다.
import {readFileSync,writeFileSync} from 'node:fs';
import {taxonomy as legacy} from '../science-lab/data/units/s32-u04.taxonomy.js';
import {judge as legacyJudge} from '../science-lab/data/units/s32-u04.judge.js';
import * as legacyMisc from '../science-lab/data/units/s32-u04.misc.js';
const work=new URL('../science-lab/bank/work/c22s32u01/',import.meta.url),dest=new URL('../science-lab/data/units/',import.meta.url);
const rows=JSON.parse(readFileSync(new URL('supplement.json',work))),c=JSON.parse(readFileSync(new URL('curriculum.json',work)));
const unitId='c22-s32-u01',names=['물체와 재료의 관계','관찰한 재료의 성질 비교','물질의 종류에 따른 분류','비교 조건과 관찰 근거','쓰임새와 필요한 성질','부분별 재료와 장단점','시험 계획과 설계 수정','근거를 담은 설명과 실제 기록'];
const types=names.map((name,i)=>({id:`T${i+13}`,element:i<4?'E7':'E8',name,desc:'관찰한 시료·자료와 실제 수행을 구별하고 근거로 설명한다.'}));
const items=rows.map(r=>{const ac=r.kind==='sc'?{type:'single-choice',answer:r.answer,accepted:[r.answer]}:r.kind==='mc'?{type:'multi-choice',answers:r.answer}:r.kind==='st'?{type:'short-text',answer:r.answer,accepted:r.accepted}:{type:'written-explanation',sample:r.sample,rubric:{required:r.required,criteria:['직접 작성한 학습용 기준이며 공식 배점표가 아니다.'],pass:'타당한 설명과 근거를 선생님과 확인한다.'}};
return {id:r.id,status:'authored',sourceRef:{type:'authored-supplement',edition:'GFIELD 물체와 물질 보충',course:'초등3-2'},taxonomy:{curriculum:'2022 개정',grade:3,semester:2,unit:'u01',area:'물질',element:r.element,type:r.type,format:({sc:'선택형',mc:'선택형',st:'단답형',wr:'서술형'})[r.kind],level:'기본',track:'교과',standard:r.standard},prompt:r.prompt,givens:r.givens??null,choices:r.choices??null,responseContract:ac.type,answerContract:ac,explanation:r.explanation,evidence:{checkedBy:'창작 문항 검수',date:'2026-10-17',gates:['science','answer'],against:'교육부 성취기준과 검수한 이론·실험 본문',note:'제공 자료의 해석이며 실제 수행 증거가 아니다.'}};});
if(items.length!==64||new Set(items.map(q=>q.id)).size!==64)throw Error('보충 문항 수·ID 오류');
const taxonomy={...legacy,unit:unitId,title:'물체와 물질',standards:c.standards,standardsSource:c.standardsSource,standardsNote:'현재 단원의 상태 관찰 원문70·짝70은 기존 물질의 상태에서 출처·문항 ID를 보존해 참조한다. 새 보충64개는 재료 성질·분류·설계 범위를 보완한다. 실제 수행은 별도 확인한다.',elements:[...legacy.elements,{id:'E7',name:'물체와 재료의 성질·분류'},{id:'E8',name:'쓰임새 있는 물체 설계'}],types:[...legacy.types,...types],authored:Object.fromEntries(items.map(q=>[q.id,q.taxonomy.type])),supplementAuthored:true,supplementFormatCounts:{선택형:48,단답형:8,서술형:8},reusedSourceUnit:'s32-u04'};
const unit={id:unitId,course:'3-2',no:1,title:'물체와 물질',domain:'물질',sources:{bank:['data/units/s32-u04.source.js'],reviewedReuse:'bank/work/s32u04/review-20261017.json',basis:'bank/work/c22s32u01/curriculum.json'}};
const judge={...legacyJudge},misc=structuredClone({...legacyMisc});delete misc.default;
for(const t of types){const m=t.id.replace('T','M').replace(/\d+/,n=>String(+n-2));misc.misconceptions[m]={label:`${t.name}의 근거를 다시 확인해요`,terms:[t.name],fix:'물체의 쓰임과 확인한 재료 성질·자료를 연결해요. 실제로 확인하지 않은 것은 더 확인으로 남겨요.',element:t.element};misc.remedy[m]={step:3};
for(const q of items.filter(q=>q.taxonomy.type===t.id)){const ac=q.answerContract;if(ac.type==='written-explanation'){judge[q.id]={open:true,need:[],ex:{ok:[ac.sample],part:[],no:[]},note:'다양한 타당한 설계·설명은 선생님이 근거와 함께 확인한다.'};misc.written[q.id]={partial:[]};}else if(ac.type==='short-text')misc.typed[q.id]={any:m};else{const correct=new Set([].concat(ac.answer??ac.answers));misc.distractors[q.id]=Object.fromEntries(q.choices.map((_,i)=>i).filter(i=>!correct.has(i)).map(i=>[i,m]));}}}
const put=(file,body)=>writeFileSync(new URL(file,dest),body),json=x=>JSON.stringify(x,null,2);
put(unitId+'.js',`export const unit = ${json(unit)};\nexport const items = ${json(items)};\n`);
put(unitId+'.source.js',"// 기존 시험지의 출처·단원명·문항 ID를 그대로 참조한다. 새 원문으로 중복 집계하지 않는다.\nexport {source} from './s32-u04.source.js';\n");
put(unitId+'.similar.js',"// 기존 검수한 원문70개에 대응하는 짝70개다. 새 짝을 추가한 것으로 세지 않는다.\nexport {similar} from './s32-u04.similar.js';\n");
put(unitId+'.taxonomy.js',`export const taxonomy = ${json(taxonomy)};\n`);
put(unitId+'.judge.js',`export const judge = ${json(judge)};\n`);
put(unitId+'.misc.js',Object.entries(misc).map(([k,v])=>`export const ${k} = ${json(v)};`).join('\n')+'\n');
console.log('c22-s32-u01: 기존 원문70·짝70 참조 + 새 보충64');
