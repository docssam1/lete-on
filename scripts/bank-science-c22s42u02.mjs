// 현행4-2 생물과 환경. 옛5-2 원문 출처와 기존 s42-u02 물 단원은 별도로 보존한다.
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import assert from 'node:assert/strict';
import {importUnit} from './bank-science-lib.mjs';
const unit='c22-s42-u02',dir=resolve(process.argv[2]||'science-lab/bank/work/c22s42u02'),out=resolve('science-lab/data/units');
const read=n=>JSON.parse(readFileSync(join(dir,n),'utf8'));
const cur=read('curriculum.json'),sup=read('supplement.json'),pairs=read('sim/paired.json'),types=read('types-reviewed.json').types,map=read('map.json').map,review=read('sources-review-20261018.json');
const original=[1,2,3,4].flatMap(s=>read(`set${s}.json`).map(q=>({...q,set:s,key:`${s}-${q.no}`})));
const holds=new Map(review.reviewDispositions.filter(x=>x.disposition==='hold-automatic-answer').map(x=>[x.id,x.reason]));
const extension=new Set(['T17','T18','T19']);
const required=Object.fromEntries(original.filter(q=>q.format==='서술형').map(q=>[`src:${q.key}`,[q.rubric[0].criterion]]));
const judge=Object.fromEntries([...original.filter(q=>q.format==='서술형').map(q=>[`src:${q.key}`,{open:true,need:[],ex:{ok:[q.answer],part:[],no:[]}}]),...pairs.filter(q=>q.kind==='wr').map(q=>[`sim:${q.key}`,{open:true,need:[],ex:{ok:[q.sample],part:[],no:[]}}])]);
const newMis=Object.fromEntries(Object.entries(types).map(([t,v])=>[`M${t.slice(1)}`,{label:`${v.name}를 다시 살펴봐요`,element:v.element,terms:[v.name],fix:v.desc,step:3}]));
const sourceNotes=Object.fromEntries(original.map(q=>[q.key,(extension.has(map[q.key])?'옛교재 연계 확장입니다. 현재 생태계 구성·먹이그물·인간 영향과 보전 실천의 필수 범위와 구별합니다.':'옛5-2 원문을 현행4-2 학습에 연결한 자료입니다. ')+(review.sourceNotes[q.key]||'제시한 생물·환경·관계의 범위로 읽고 실제 조사·실천 기록과 구별합니다.')]));
const lessonJudge=Object.fromEntries(sup.items.filter(q=>q.responseContract==='written-explanation').map(q=>[q.id,{open:true,need:[],ex:{ok:[q.answerContract.sample],part:[],no:[]},note:'근거·대안과 표현의 타당성은 교사 확인. 응답을 실제 수행·소통으로 세지 않는다.'}]));
const overrides=Object.fromEntries(original.filter(q=>q.set===3&&[11,12].includes(q.no)).map(q=>[q.key,{...q.givens,표:{머리:['조건','ㄱ','ㄴ','ㄷ','ㄹ'],행:[['햇빛','○','○','×','×'],['물','○','×','○','×']]}}]));
await importUnit({unit,no:2,dir,date:'2026-10-18',unitTitle:'생물과 환경',title:'4-2 Ⅱ 생물과 환경',grade:4,semester:2,uKey:'u02',area:'생명',course:'초등 4-2',unitLabel:'Ⅱ. 생물과 환경',sourceId:'sci-eco-52-2',edition:'시매쓰DMC 최다빈출 단원평가',sourceLabel:'옛5-2 원문',sourceBooks:Object.fromEntries([1,2,3,4].map((s,i)=>[`set${s}`,{sourceId:`sci-eco-52-2-set${s}`,file:`최다빈출 단원평가 세트${s}`,course:'초등 5-2',unitLabel:'Ⅱ. 생물과 환경',pages:[3,3,4,4][i]}])),standards:cur.standards,standardsSource:cur.standardsSource,standardsNote:cur.limits.join(' '),elements:[{id:'E1',name:'생태계와 생물·비생물 요소'},{id:'E2',name:'양분을 얻는 방법과 역할'},{id:'E3',name:'먹이 사슬과 먹이그물 읽기'},{id:'E4',name:'먹이 관계 모형과 영향'},{id:'E5',name:'인간 활동·오염과 서식지'},{id:'E6',name:'보전 실천 계획과 협력'},{id:'E7',name:'근거 있는 소개와 실제 토의'},{id:'E8',name:'옛교재 연계 · 적응·평형·조건 비교'}],types,newMis,required,judge,sourceNotes,sourceGivensOverrides:overrides,items:sup.items,lessonTypes:Object.fromEntries(sup.items.map(q=>[q.id.replace(unit+'-',''),q.taxonomy.type])),lessonMis:Object.fromEntries(sup.items.map(q=>[q.id,'M'+q.taxonomy.type.slice(1)])),lessonJudge});
const load=n=>{const t=readFileSync(join(out,`${unit}.${n}.js`),'utf8'),prefix=`export const ${n} = `;return JSON.parse(t.slice(t.indexOf(prefix)+prefix.length).trim().replace(/;$/,''));};
const save=(n,x)=>writeFileSync(join(out,`${unit}.${n}.js`),`export const ${n} = ${JSON.stringify(x,null,2)};\n`);
const source=load('source'),similar=load('similar'),J=load('judge');
for(const q of [...source,...similar]){
 const src=q.sourceRef.type==='original',key=src?`${q.sourceRef.set}-${q.sourceRef.no}`:`${q.sourceRef.of.set}-${q.sourceRef.of.no}`,t=q.taxonomy.type,tn=+t.slice(1);
 q.taxonomy.inquirySkill=types[t].name;q.taxonomy.standard=tn<=4||[17,19].includes(tn)?'4과14-01':tn<=8||tn===18?'4과14-02':'4과14-03';q.curriculumScope=extension.has(t)?'legacy-extension':'current-linked';
 if(extension.has(t))q.givens={'학습 범위':'옛교재 연계 확장입니다. 현행 필수 범위와 구별하여 주어진 조건·자료로 읽어요.',...(q.givens||{})};
 if(src){q.sourceRef.originalSet=q.sourceRef.set;q.sourceRef.label=`옛5-2 원문 · 세트${q.sourceRef.set}`;}
 else{q.sourceRef.of.originalSet=q.sourceRef.of.set;q.sourceRef.of.course='초등 5-2';}
 if(src&&holds.has(key)){
  const note=holds.get(key);q.printedAnswerContract=structuredClone(q.answerContract);q.sourceRef.reviewOnly=true;
  q.givens={...(q.givens||{}),...(q.choices?{'원문 선택지':q.choices.map((c,i)=>'①②③④⑤'[i]+' '+c)}:{}),'학습 안내':'원문과 공식 답을 참고로 보존합니다. 조건과 과학적 근거를 선생님과 검토하며 자동 정오 판정을 하지 않아요.'};q.choices=null;q.responseContract='written-explanation';q.answerContract={type:'written-explanation',sample:note,rubric:{required:['원문 조건·공식 답·자료의 범위와 더 확인할 점을 선생님과 검토한다.'],pass:'자동 정오 판정 보류 · 자료 검토'}};q.explanation+='\n[자동 판정 보류] '+note;q.evidence.gates=['source','visual'];J[q.id]={open:true,need:[],ex:{ok:[],part:[],no:[]},note};
 }
}
save('source',source);save('similar',similar);save('judge',Object.fromEntries(Object.entries(J).sort(([a],[b])=>a.localeCompare(b,'en'))));
// 각 문항의 실제 정답 집합 밖에만 오개념을 연결한다. 원문과 짝의 보기 위치는 독립적이다.
const misc={misconceptions:Object.fromEntries(Object.entries(newMis).map(([k,{step,...v}])=>[k,v])),distractors:{},typed:{},remedy:Object.fromEntries(Object.keys(newMis).map(m=>[m,{step:3}])),written:{}};
for(const q of [...source,...similar,...sup.items]){const a=q.answerContract,m='M'+q.taxonomy.type.slice(1);if(a.type==='written-explanation')misc.written[q.id]={partial:[]};else if(q.choices){const ok=[].concat(a.answer??a.answers);misc.distractors[q.id]=Object.fromEntries(q.choices.flatMap((_,i)=>ok.includes(i)?[]:[[i,m]]));}else misc.typed[q.id]={any:m};}
writeFileSync(join(out,`${unit}.misc.js`),Object.entries(misc).map(([k,v])=>`export const ${k} = ${JSON.stringify(v,null,2)};`).join('\n')+'\n');
writeFileSync(join(out,`${unit}.js`),readFileSync(join(out,`${unit}.js`),'utf8')+"export {ecologyBankPaperHtml as bankPaper,wireEcologyBankPaper as wireBankPaper} from '../../v2/ecology-bank-paper.js';\n");
assert.equal(source.length,70);assert.equal(similar.length,70);assert.equal(sup.items.length,80);assert.equal(source.filter(q=>q.sourceRef.reviewOnly).length,2);
console.log('생물과 환경 원문70(자료 검토2)·독립짝70·보충80=220. 기존 물 단원 보존.');
