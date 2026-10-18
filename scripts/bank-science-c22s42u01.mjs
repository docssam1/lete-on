// 밤하늘 관찰: 출처가 다른 네 원문 세트+네 달 관찰 발췌 묶음. 기존 식물/성운 수업을 덮어쓰지 않는다.
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import assert from 'node:assert/strict';
import {importUnit} from './bank-science-lib.mjs';
const unit='c22-s42-u01',dir=resolve(process.argv[2]||'science-lab/bank/work/c22s42u01'),out=resolve('science-lab/data/units');
const read=n=>JSON.parse(readFileSync(join(dir,n),'utf8'));
const save=(name,x)=>writeFileSync(join(out,`${unit}.${name}.js`),`export const ${name} = ${JSON.stringify(x,null,2)};\n`);
const cur=read('curriculum.json'),sup=read('supplement.json'),pairs=read('sim/paired.json'),types=read('types-reviewed.json').types,map=read('map.json').map,review=read('sources-review-20261018.json');
const books={},original=[];
for(const group of ['solar','moon'])for(let s=1;s<=4;s++){
 const set=group==='solar'?s:s+4,book=`${group}${s}`,moon=group==='moon';
 books[book]={sourceId:`sci-sky-${moon?'61-2':'51-3'}-set${s}`,file:`최다빈출 단원평가 세트${s}${moon?' · 달 관찰 발췌':''}`,course:moon?'초등 6-1':'초등 5-1',unitLabel:moon?'Ⅱ. 지구와 달의 운동':'Ⅲ. 태양계와 별',pages:(moon?[3,4,4,5]:[2,4,4,5])[s-1]};
 const qs=read(`${group}-set${s}.json`).map(q=>({...q,provenance:{book,section:`원문 세트${s}${moon?' 달 관찰 발췌':''}`,originalNo:q.no}}));
 writeFileSync(join(dir,`set${set}.json`),JSON.stringify(qs,null,2)+'\n');
 original.push(...qs.map(q=>({...q,set,key:`${set}-${q.no}`,group,originalSet:s})));
}
const extension=new Set(['T17','T18','T19','T20']);
const hold=new Map(review.reviewDispositions.filter(x=>x.disposition==='hold-automatic-answer').map(x=>{const [g,s,n]=x.id.split('-');return [`${g==='solar'?+s:+s+4}-${n}`,x.reason];}));
assert.equal(hold.size,5);
const required=Object.fromEntries(original.filter(q=>q.format==='서술형').map(q=>[`src:${q.key}`,[q.rubric[0].criterion]]));
const judge=Object.fromEntries([...original.filter(q=>q.format==='서술형').map(q=>[`src:${q.key}`,{open:true,need:[],ex:{ok:[q.answer],part:[],no:[]}}]),...pairs.filter(q=>q.kind==='wr').map(q=>[`sim:${q.key}`,{open:true,need:[],ex:{ok:[q.sample],part:[],no:[]}}])]);
const newMis=Object.fromEntries(Object.entries(types).map(([t,v])=>[`M${t.slice(1)}`,{label:`${v.name}를 다시 살펴봐요`,element:v.element,terms:[v.name],fix:v.desc,step:3}]));
const sourceNotes=Object.fromEntries(original.map(q=>[q.key,extension.has(map[q.key])?'옛교재의 연계 자료입니다. 제시한 표·배치·비교 기준으로 읽으며 현행 필수 수치 암기나 실제 관측 완료를 뜻하지 않습니다.':'옛교재 원문을 현행 밤하늘 관찰과 연결한 자료입니다. 날짜·시각·장소·관찰 가능 조건과 자료 출처를 구별합니다.']));
for(const [k,n] of Object.entries({
 '1-3':'지구 같은 고체 지표가 없다는 뜻과 내부 전체가 기체로만 되어 있다는 주장을 구별합니다.',
 '1-9':'가운데 별에서 바깥선 교점쪽으로 찾는 방향과 대략적인 각거리 기준을 확인합니다.',
 '1-10':'배경 별들의 상대 배열에 대한 위치 비교입니다. 땅이나 지평선에 대해 별들이 고정된다는 뜻이 아닙니다.',
 '2-2':'햇빛을 모든 병원체를 확실히 없애는 소독법으로 일반화하지 않습니다.',
 '2-8':'제시된 두 묶음을 실제로 구별하는 타당한 기준을 허용합니다. 인쇄 예시 문구 하나만 강제하지 않습니다.',
 '2-19':'배경 별들에 대한 상대 위치를 비교합니다. 관찰 시각이나 지평선을 기준으로 별이 움직이지 않는다는 뜻은 아닙니다.',
 '3-14':'주어진 원/거리 모형에서 지구-해왕성 최소29가 다른 행성까지의 최대20.1보다 커서 답을 구별할 수 있습니다. 지구에 항상 가장 가까운 행성이 금성이라는 부가 설명은 일반화하지 않습니다.',
 '3-15':'표의 원/거리 모형에서 천왕성-해왕성 최소10.9가 다른 보기 쌍의 최대6.7보다 큽니다. 태양 기준 거리 차를 어떤 배치에서도 실제 행성 간 거리로 계산하지 않습니다.',
 '3-18':'북극성은 북쪽 방향을 찾는 길잡이입니다. 영원히 정확한 정북의 한 점에 완전히 고정되어 있다는 뜻은 아닙니다.',
 '3-20':'배경 별의 상대 배열에 대해 읽습니다. 별이 지평선에 대해 고정되어 있다는 뜻은 아닙니다.',
 '4-19':'응답칸에 자리가 인쇄되어 있으므로 카시오페이아/카시오페이아자리 모두 같은 이름으로 인정합니다.',
 '4-22':'같은 주변 별들을 기준으로 비교한 상대 위치 변화와 하늘 전체의 위치 변화를 구별합니다.',
 '4-24':'이 원문은 상대적인 크기·거리를 고려한 전시를 다룹니다. 현행 행성 모형은 목적을 밝힌 단순 모형도 만들 수 있고 실제와 다른 점을 설명합니다.',
 '6-17':'보름 이후2주 내내 같은 초저녁 시각에 달을 볼 수 있다고 해석하지 않습니다. 관찰 가능 시각은 모양·날짜·지역에 따라 달라집니다.',
 '8-24':'달이 보이는 날짜와 시각의 관찰창에서 읽습니다. 지평선에서 뜨는 방위와 혼동하지 않습니다.',
 '8-25':'저녁7시와 해 진 직후는 모든 날짜·지역에서 같지 않습니다. 실제 일몰과 관찰 시각을 기록합니다.'
}))sourceNotes[k]+=' '+n;
const overrides={};
for(const q of original){if(q.figure&&q.givens?.표){const {표,...rest}=q.givens;overrides[q.key]=Object.keys(rest).length?rest:null;}}
const lessonJudge=Object.fromEntries(sup.items.filter(q=>q.responseContract==='written-explanation').map(q=>[q.id,{open:true,need:[],ex:{ok:[q.answerContract.sample],part:[],no:[]},note:'근거·설명·타당한 대안은 교사 확인'}]));
await importUnit({unit,no:1,dir,date:'2026-10-18',sets:[1,2,3,4,5,6,7,8],unitTitle:'밤하늘 관찰',title:'4-2 Ⅰ 밤하늘 관찰',grade:4,semester:2,uKey:'u01',area:'지구와 우주',course:'초등 4-2',unitLabel:'Ⅰ. 밤하늘 관찰',sourceId:'sci-sky',edition:'시매쓰DMC 최다빈출 단원평가',sourceLabel:'연계 원문',sourceBooks:books,standards:cur.standards,standardsSource:cur.standardsSource,standardsNote:cur.limits.join(' '),elements:[{id:'E1',name:'달의 모양·표면과 관찰 자료'},{id:'E2',name:'여러 날 달 관찰·기록'},{id:'E3',name:'태양계 구성원과 태양'},{id:'E4',name:'행성의 모습과 조사'},{id:'E5',name:'행성 모형 설계·제작'},{id:'E6',name:'별과 북극성 주변 별자리'},{id:'E7',name:'안전한 관찰과 실제 공유'},{id:'E8',name:'옛교재 연계 · 크기·거리 자료'},{id:'E9',name:'옛교재 연계 · 천체 비교 조건'}],types,newMis,required,judge,sourceNotes,sourceGivensOverrides:overrides,accept:{'4-19':['카시오페이아']},items:sup.items,lessonTypes:Object.fromEntries(sup.items.map(q=>[q.id.replace(unit+'-',''),q.taxonomy.type])),lessonMis:Object.fromEntries(sup.items.map(q=>[q.id,'M'+q.taxonomy.type.slice(1)])),lessonJudge});
const load=n=>{const t=readFileSync(join(out,`${unit}.${n}.js`),'utf8'),prefix=`export const ${n} = `;return JSON.parse(t.slice(t.indexOf(prefix)+prefix.length).trim().replace(/;$/,''));};
const source=load('source'),similar=load('similar'),J=load('judge');
const neutral={
 '1-9':'북쪽 하늘의 별무리와 기준점 ㄱ·ㄴ을 표시한 원문 그림.',
 '1-10':'같은 배경에 천체의 위치를 시간 순서로 표시한 그림.',
 '2-14':'(1) 국자 모양의 일곱 점, (2) 다섯 점이 꺾여 이어지는 모양의 원문 보기.',
 '3-19':'별무리의 바깥 선을 연장한 점 ㄱ과 가운데 점 ㄴ을 표시한 원문 그림.',
 '4-19':'다섯 점이 꺾여 이어지는 별무리의 원문 사진.',
 '4-20':'국자 모양의 별무리에서 두 기준점 ㄱ·ㄴ을 표시한 원문 그림.',
 '5-8':'저녁7시에 기록한 달의 밝은 부분·위치·날짜와 동·남·서 표시.',
 '5-9':'같은 시각에 기록한 여러 날짜의 달 모습과 동·남·서 표시.',
 '6-16':'밝게 보이는 부분이 둥근 원인 달 사진.',
 '6-17':'밝게 보이는 부분이 둥근 원인 달 사진.',
 '6-19':'ㄱ 왼쪽 반이 밝음, ㄴ 오른쪽 반이 밝음, ㄷ 오른쪽 가느다란 부분이 밝음, ㄹ 왼쪽 가느다란 부분이 밝은 네 사진.',
 '6-20':'서쪽 하늘에 가느다랗게 밝은 달과 동·남·서 표시.',
 '7-14':'사진① 오른쪽이 가늘게 밝음, ② 오른쪽 반이 밝음, ③ 둥근 원이 밝음, ④ 왼쪽 반이 밝음, ⑤ 왼쪽이 가늘게 밝음.',
 '7-17':'동·남·서 표시가 있는 지평선 위에 오른쪽 반이 밝은 달을 그린 사진.',
 '8-19':'ㄱ 왼쪽 반, ㄴ 오른쪽 반, ㄷ 둥근 원, ㄹ 오른쪽 가느다란 부분, ㅁ 왼쪽 가느다란 부분이 밝은 원문 달 사진.',
 '8-20':'기호 ㄱ~ㅁ을 붙인 다섯 달 사진. 밝게 보이는 부분의 모양을 비교하는 자료.',
 '8-21':'기호 ㄱ~ㅁ을 붙인 다섯 달 사진. 밝게 보이는 부분의 모양을 비교하는 자료.'
};
for(const q of [...source,...similar]){
 const isSource=q.sourceRef.type==='original',key=isSource?`${q.sourceRef.set}-${q.sourceRef.no}`:`${q.sourceRef.of.set}-${q.sourceRef.of.no}`,o=original.find(o=>o.key===key),t=q.taxonomy.type;
 q.taxonomy.inquirySkill=types[t].name;q.taxonomy.standard=t==='T20'||+t.slice(1)<=6?'4과13-01':['T17','T18'].includes(t)||+t.slice(1)<=12?'4과13-02':'4과13-03';
 q.curriculumScope=extension.has(t)?'legacy-extension':'current-linked';
 if(extension.has(t))q.givens={'학습 범위':'옛교재 연계 확장입니다. 제시된 자료로 비교하며 현행 단원의 필수 수치 암기는 아니에요.',...(q.givens||{})};
 if(isSource){q.sourceRef.originalSet=o.originalSet;q.sourceRef.section=books[o.provenance.book].unitLabel;q.sourceRef.label=`옛${o.group==='moon'?'6-1 달 관찰 발췌':'5-1 원문'} · 원문 세트${o.originalSet}`;if(q.figure)q.figureNote=neutral[key]||(o.givens?.표?Object.entries(o.givens.표).map(([k,v])=>`${k}: ${[].concat(v).join(', ')}`).join(' / '):'원문에서 제시한 사진 또는 비교 표.');}
 else{q.sourceRef.of.originalSet=o.originalSet;q.sourceRef.of.course=o.group==='moon'?'초등 6-1':'초등 5-1';q.sourceRef.of.sourceGroup=o.group;}
 if(isSource&&key==='7-14')q.choices=['사진①','사진②','사진③','사진④','사진⑤'];
 if(isSource&&hold.has(key)){
  const note=hold.get(key);q.printedAnswerContract=structuredClone(q.answerContract);q.sourceRef.reviewOnly=true;
  q.givens={...(q.givens||{}),...(q.choices?{'원문 선택지':q.choices.map((c,i)=>`①②③④⑤`[i]+' '+c)}:{}),'학습 안내':'이 원문의 공식 답은 참고로 보존합니다. 조건과 과학적 근거를 선생님과 검토하며 자동 정오 판정을 하지 않아요.'};q.choices=null;q.responseContract='written-explanation';q.answerContract={type:'written-explanation',sample:note,rubric:{required:['원문 조건·공식 답·자료에서 확인할 수 있는 점과 미확인 사항을 선생님과 검토한다.'],pass:'자동 정오 판정 보류 · 자료 검토'}};q.explanation+='\n[자동 판정 보류] '+note;q.evidence.gates=['source','visual'];J[q.id]={open:true,need:[],ex:{ok:[],part:[],no:[]},note};
 }
}
save('source',source);save('similar',similar);save('judge',Object.fromEntries(Object.entries(J).sort(([a],[b])=>a.localeCompare(b,'en'))));
// 원문과 짝의 정답 위치는 서로 다르므로 각 문항에서 오답 태그를 다시 만든다.
const misc={misconceptions:Object.fromEntries(Object.entries(newMis).map(([k,{step,...v}])=>[k,v])),distractors:{},typed:{},remedy:Object.fromEntries(Object.keys(newMis).map(m=>[m,{step:3}])),written:{}};
for(const q of [...source,...similar,...sup.items]){const a=q.answerContract,m='M'+q.taxonomy.type.slice(1);if(a.type==='written-explanation')misc.written[q.id]={partial:[]};else if(q.choices){const ok=[].concat(a.answer??a.answers);misc.distractors[q.id]=Object.fromEntries(q.choices.flatMap((_,i)=>ok.includes(i)?[]:[[i,m]]));}else misc.typed[q.id]={any:m};}
writeFileSync(join(out,`${unit}.misc.js`),Object.entries(misc).map(([k,v])=>`export const ${k} = ${JSON.stringify(v,null,2)};`).join('\n')+'\n');
writeFileSync(join(out,`${unit}.js`),readFileSync(join(out,`${unit}.js`),'utf8')+"export {skyBankPaperHtml as bankPaper,wireSkyBankPaper as wireBankPaper} from '../../v2/sky-bank-paper.js';\n");
assert.equal(source.length,95);assert.equal(similar.length,95);assert.equal(sup.items.length,80);assert.equal(source.filter(q=>q.sourceRef.reviewOnly).length,5);
console.log('밤하늘 원문95(자료 검토5)·짝95·독립보충80=270. 기존 식물/성운 단원은 보존.');
