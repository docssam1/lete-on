// 현재 Ⅲ단원은 옛 Ⅴ단원 원문·짝의 문항 ID를 보존하여 참조한다.
import {readFileSync,writeFileSync} from 'node:fs';
import {taxonomy as legacy} from '../science-lab/data/units/s32-u05.taxonomy.js';
import {judge as legacyJudge} from '../science-lab/data/units/s32-u05.judge.js';
import * as legacyMisc from '../science-lab/data/units/s32-u05.misc.js';
const work=new URL('../science-lab/bank/work/c22s32u03/',import.meta.url),dest=new URL('../science-lab/data/units/',import.meta.url);
const rows=JSON.parse(readFileSync(new URL('supplement.json',work))),c=JSON.parse(readFileSync(new URL('curriculum.json',work)));
const unitId='c22-s32-u03',names=['떨림의 관찰과 근거','안전한 소리 관찰과 여러 감각','같은 조건의 세기 비교','길이에 따른 높낮이 비교','세기와 높낮이의 구별','물질을 통한 전달 관찰','상황에 맞는 소음 줄이기','실제 실천·의견·수정 기록'];
const skills=['관찰·근거 설명','여러 감각·안전','같은 조건 비교','길이·높낮이 비교','성질 구별·자료 해석','전달 경로 관찰','상황 판단·실천 계획','실제 기록·소통·수정'];
const concepts=['소리가 나는 물체의 떨림을 관찰하고 움직임·촉감 등 근거와 설명을 연결한다.','작은 소리와 안전한 시각·촉각 관찰을 활용하고 서로 다른 감각 경험을 존중한다.','같은 물체·듣는 위치에서 두드리는 정도를 바꾸어 소리의 크고 작음을 비교한다.','같은 재료·굵기·고정·소리 내는 방법에서 길이와 높낮이를 비교한다.','크고 작은 정도인 세기와 높고 낮은 정도인 높낮이를 구별한다.','공기·물·고체 등 여러 물질을 통한 전달 현상을 경로와 관찰 조건으로 설명한다.','듣는 사람·시간·장소·활동을 고려하여 소음을 줄일 행동과 전후 비교를 계획한다.','계획·실제 실천·실제 의견과 수정의 기록을 구별하여 근거를 남긴다.'];
const types=names.map((name,i)=>({id:`T${i+14}`,element:i<5?'E7':'E8',name,desc:concepts[i]}));
const items=rows.map(r=>{const ac=r.kind==='sc'?{type:'single-choice',answer:r.answer,accepted:[r.answer]}:r.kind==='mc'?{type:'multi-choice',answers:r.answer}:r.kind==='st'?{type:'short-text',answer:r.answer,accepted:r.accepted}:{type:'written-explanation',sample:r.sample,rubric:{required:r.required,criteria:['직접 작성한 학습용 기준이며 공식 배점표가 아니다.'],pass:'여러 타당한 표현과 근거를 선생님과 확인한다.'}};
 const i=+r.type.slice(1)-14;
 return {id:r.id,status:'authored',sourceRef:{type:'authored-supplement',edition:'GFIELD 소리의 성질 보충',course:'초등3-2'},taxonomy:{curriculum:'2022 개정',grade:3,semester:2,unit:'u03',area:'운동과 에너지',element:r.element,type:r.type,topic:names[i],concept:types[i].desc,inquirySkill:skills[i],format:({sc:'선택형',mc:'선택형',st:'단답형',wr:'서술형'})[r.kind],level:'기본',track:'교과',standard:r.standard},prompt:r.prompt,givens:r.givens??null,choices:r.choices??null,responseContract:ac.type,answerContract:ac,explanation:r.explanation,evidence:{checkedBy:'창작 문항 검수',date:'2026-10-17',gates:['science','answer'],against:'교육부 성취기준과 확인한 이론·실험 본문',note:'가상 자료의 해석·학습 응답이며 실제 학생 수행 증거가 아니다.'}};
});
if(items.length!==64||new Set(items.map(q=>q.id)).size!==64)throw Error('보충 문항 수·ID 오류');
const taxonomy={...legacy,unit:unitId,title:'소리의 성질',standards:c.standards,standardsSource:c.standardsSource,standardsNote:'현재 Ⅲ단원은 옛 Ⅴ 소리의 성질 원문70·짝70을 문항 ID·출처 그대로 참조한다. 추가 학습인 반사와 현재 필수 내용·실제 수행을 구별한다.',elements:[...legacy.elements.map(e=>e.id==='E5'?{...e,name:e.name+' · 추가 학습'}:e),{id:'E7',name:'관찰 근거·안전·조건과 소리 비교'},{id:'E8',name:'전달 관찰·소음 줄이기·실제 실천'}],types:[...legacy.types.map(t=>['T08','T10','T11'].includes(t.id)?{...t,name:t.name+' · 추가 학습'}:t),...types],authored:Object.fromEntries(items.map(q=>[q.id,q.taxonomy.type])),supplementAuthored:true,supplementFormatCounts:{선택형:48,단답형:8,서술형:8},reusedSourceUnit:'s32-u05',extensionTypes:['T08','T10','T11']};
const unit={id:unitId,course:'3-2',no:3,title:'소리의 성질',domain:'운동과 에너지',sources:{bank:['data/units/s32-u05.source.js'],originalExamAvailable:true,reviewedReuse:'bank/work/s32u05/review-20261017.json',basis:'bank/work/c22s32u03/curriculum.json'}};
const judge={...legacyJudge},misc=structuredClone({...legacyMisc});delete misc.default;
for(const [i,t] of types.entries()){const m=`M${i+11}`;misc.misconceptions[m]={label:`${t.name}의 근거를 다시 확인해요`,terms:[t.name],fix:'자료의 조건·관찰 근거와 설명을 연결해요. 안전하게 비교하며 실제 실천·의견과 앞으로 할 계획을 구별해요.',element:t.element};misc.remedy[m]={step:3};
 for(const q of items.filter(q=>q.taxonomy.type===t.id)){const ac=q.answerContract;if(ac.type==='written-explanation'){judge[q.id]={open:true,need:[],ex:{ok:[ac.sample],part:[],no:[]},note:'계획·관찰·실천과 근거의 타당성을 선생님과 확인한다. 공식 배점이 아니다.'};misc.written[q.id]={partial:[]};}else if(ac.type==='short-text')misc.typed[q.id]={any:m};else{const correct=new Set([].concat(ac.answer??ac.answers));misc.distractors[q.id]=Object.fromEntries(q.choices.map((_,i)=>i).filter(i=>!correct.has(i)).map(i=>[i,m]));}}
}
const put=(file,body)=>writeFileSync(new URL(file,dest),body),json=x=>JSON.stringify(x,null,2);
put(unitId+'.js',`export const unit = ${json(unit)};\nexport const items = ${json(items)};\n`);
put(unitId+'.source.js',"// 옛 시험지의 출처·단원 번호·문항 ID를 보존해 참조한다. 별도 원문으로 중복 집계하지 않는다.\nexport {source} from './s32-u05.source.js';\n");
put(unitId+'.similar.js',"// 검수한 기존70개 원문에 대응하는 짝70개다. 추가 짝으로 중복 집계하지 않는다.\nexport {similar} from './s32-u05.similar.js';\n");
put(unitId+'.taxonomy.js',`export const taxonomy = ${json(taxonomy)};\n`);
put(unitId+'.judge.js',`export const judge = ${json(judge)};\n`);
put(unitId+'.misc.js',Object.entries(misc).map(([k,v])=>`export const ${k} = ${json(v)};`).join('\n')+'\n');
console.log('c22-s32-u03: 원문70·짝70 ID보존 참조 + 창작 보충64');
