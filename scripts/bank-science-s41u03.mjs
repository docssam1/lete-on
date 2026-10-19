// 땅의 변화: 원문80·짝80·기존18·현행 범위 독립 보충64를 정적 파일로 연결한다.
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import assert from 'node:assert/strict';
import {importSourceOnly} from './bank-science-lib.mjs';
import {judgeText} from '../science-lab/v2/judge.js';
import {taxonomy} from '../science-lab/data/units/s41-u03.taxonomy.js';
const dir=resolve(process.argv[2]||'science-lab/bank/work/s41u03'),units=resolve('science-lab/data/units');
const read=n=>JSON.parse(readFileSync(join(dir,n),'utf8')),json=x=>JSON.stringify(x,null,2);
const mark='// ── 2026-10-18 문항 검수 ──',sourceMark='// ── 단원평가 원문(source.js) ──';
const rewrite=(kind,body)=>{const p=join(units,`s41-u03${kind}.js`),prefix=readFileSync(p,'utf8').split(sourceMark)[0].split(mark)[0].trimEnd();writeFileSync(p,prefix+'\n\n'+mark+'\n'+body+'\n');};
const pairs=read('paired-reviewed.json'),lesson=read('lesson-items-reviewed.json'),supp=read('supplement.json'),cur=read('curriculum.json');
const sourceJudges=read('source-judges-reviewed.json'),pairJudges=read('paired-judges-reviewed.json'),diag=read('paired-diagnostics-reviewed.json');
assert.equal(pairs.length,80);assert.equal(lesson.length,18);assert.equal(supp.items.length,64);
for(const [id,key]of Object.entries({...sourceJudges,...pairJudges})){
 assert.equal(key.need.length,1,id);
 for(const a of key.ex.ok)assert.equal(judgeText(a,key).st,'ok',`${id}: ${a}`);
 for(const a of key.ex.no)for(const tries of[1,2])assert.notEqual(judgeText(a,key,{tries}).st,'ok',`${id}: ${a}`);
}
rewrite('.similar',`for(const patch of ${json(pairs)}){const q=similar.find(q=>q.id===patch.id);if(!q)throw Error(patch.id);Object.assign(q,patch);}`);
rewrite('',`unit.sources.bank=['data/units/s41-u03.source.js'];\nfor(const patch of ${json(lesson)}){const q=items.find(q=>q.id===patch.id);if(!q)throw Error(patch.id);Object.assign(q,patch);}\nitems.push(...${json(supp.items)});`);
const tx=structuredClone(taxonomy);tx.standards=cur.standards;tx.standardsSource=cur.standardsSource;
tx.standardsNote='현행 필수는 관찰·분류·모형의 표현/한계·영향 조사/대처 실천이다. 기존 원문/짝의 냉각 과정 원인 설명은 연계 심화 자료로 구별한다.';
tx.types=tx.types.filter(t=>!supp.types.some(s=>s.id===t.id));tx.types.push(...supp.types);
tx.types.find(t=>t.id==='T06').desc='제시한 모형의 관찰 자료를 실제 화산과 비교하고 대응/한계를 구별한다. 학생 가열 절차가 아니다.';
tx.types.find(t=>t.id==='T07').desc='현무암·화강암의 관찰/분류와 기존 연계 자료의 생성 설명을 구별한다.';
tx.types.find(t=>t.id==='T09').desc='지진의 생활 피해·대비와 규모 자료를 읽되 규모만으로 특정 장소의 피해를 단정하지 않는다.';
tx.authored=Object.fromEntries([...lesson,...supp.items].map(q=>[q.id,q.taxonomy.type]));
writeFileSync(join(units,'s41-u03.taxonomy.js'),'// 땅의 변화: 원문 분류 키를 보존하고 현행 탐구·대처 실천을 보충했다.\nexport const taxonomy = '+json(tx)+';\n');
const fix={M01:['E1','깎는 침식·옮기는 운반·쌓이는 퇴적을 관찰 근거와 연결해요. 한 지점에서도 여러 작용이 함께 나타날 수 있어요.'],M02:['E1','같은 흙·처음 모양·물의 양/붓는 시간/위치에서 기울기만 달리해 비교해요. 관찰한 범위를 넘어 언제나 같은 결과라고 하지 않아요.'],M03:['E2','좁고 급한 상류와 넓고 완만한 하류의 전형적인 특징을 실제 자료와 비교해요. 모든 강의 모든 지점이 같다는 뜻은 아니에요.'],M04:['E1','제시한 흙 언덕 자료에서 위쪽의 깎인 홈과 아래쪽에 새로 쌓인 흙을 처음 상태와 비교해요.'],M05:['E2','흐르는 물의 침식·운반·퇴적과 마그마 분출·지진의 흔들림을 구별해요.'],M06:['E3','땅속의 녹은 암석 물질은 마그마, 밖으로 흘러나오는 것은 용암, 움푹 파인 분출구 지형은 분화구예요.'],M07:['E3','흘러나오는 용암은 액체, 화산 가스는 기체, 화산재·암석 조각은 고체예요. 날리는 모습만으로 기체라 하지 않아요.'],M08:['E3','모형이 표현한 흐름과 굳는 모습을 실제와 비교해요. 재료·성분·온도·분출 원리까지 같다는 뜻이 아니며 가열을 따라 하지 않아요.'],M09:['E3','화산은 모양이 다양해요. 높이·현재 연기만으로 정하지 않고 마그마 분출로 형성된 근거를 확인해요.'],M10:['E4','같은 조건에서 두 표본의 색·알갱이·구멍을 함께 관찰해요. 현무암은 구멍이 없는 것도 있으며 한 특징만으로 모든 돌을 분류하지 않아요.'],M11:['E5','화산의 피해와 이로움을 출처·시점·조건과 함께 조사해요. 한 사례로 모든 영향을 지우지 않아요.'],M12:['E5','규모는 지진 자체의 크기를 나타내요. 특정 장소의 흔들림·피해는 거리·지반·건물·대비 등도 확인해요.'],M13:['E5','관측 자료의 지진 흔들림과 피해를 화산·바람 등 다른 현상과 구별해요. 피해 사진 하나로 원인을 단정하지 않아요.'],M14:['E6','흔들릴 때 몸을 보호하고 멈춘 뒤 학교 안내에 따라 계단으로 대피해요. 이미 승강기 안에 있던 상황과 새로 타는 상황을 구별해요.'],M15:['E6','화산재가 날리면 공식 안내를 따르고 가급적 실내에 머물며 유입을 줄여요. 학생이 화산재를 채집하거나 지붕을 청소하지 않아요.'],M16:['E3','마그마 분출로 형성된 지형이라는 근거로 화산을 구별해요. 산의 이름·높이·사진 겉모양만으로 정하지 않아요.']};
const fixes=Object.entries(fix).map(([m,[element,fix]])=>`Object.assign(misconceptions.${m},${json({element,fix})});`).join('\n');
const writtenPairs=Object.fromEntries(pairs.filter(q=>q.responseContract==='written-explanation').map(q=>[q.id,{partial:[]}]));
rewrite('.misc',fixes+`\nObject.assign(misconceptions,${json(supp.misconceptions)});\nObject.assign(distractors,${json({...diag.distractors,...supp.distractors})});\nObject.assign(typed,${json({...diag.typed,...supp.typed})});\nObject.assign(written,${json({...writtenPairs,...supp.written})});\nObject.assign(remedy,${json(supp.remedy)});`);
rewrite('.judge',`for(const id of['s41-u03-b08','s41-u03-b09'])judge[id]={open:true,need:[],ex:{ok:[],part:[],no:[]}};\nObject.assign(judge,${json({...pairJudges,...supp.judge})});`);
const original=[1,2,3,4].flatMap(set=>read(`set${set}.json`).map(q=>({...q,set,key:`${set}-${q.no}`})));
const notes={},givens={};
for(const q of original){
 const type=tx.sources[q.key][0],n=[];
 if(['T01','T03'].includes(type))n.push('제시한 조건의 모형과 전형적인 강 지형을 비교합니다. 여러 작용이 함께 나타날 수 있으며 모든 실제 강의 지점/시간에 같은 결과를 단정하지 않습니다.');
 if(type==='T06'){const guide='원문/교사 시범 자료를 읽는 문제입니다. 학생이 가열·뜨거운 재료·연기 관찰을 따라 하지 않습니다. 모형의 물질·온도·크기·분출 원리는 실제와 다릅니다.';givens[q.key]={...q.givens,'학습 안내':guide};n.push(guide+' 연기라는 표현은 나오는 모습의 대응이며 실제 화산 가스와 성분이 같다는 뜻이 아닙니다.');}
 if(type==='T07')n.push('현재 필수는 현무암·화강암의 관찰과 분류입니다. 냉각 과정과 알갱이 크기 원인은 기존 교재의 연계 심화 자료로 구별합니다. 현무암은 표면 구멍이 없는 표본도 있습니다.');
 if(type==='T08')n.push('피해와 이로움의 조건·시점을 구별합니다. 화산재가 덮은 즉시의 피해와 오랜 뒤 일부 토양의 변화는 같은 조건이 아닙니다.');
 if(type==='T09')n.push('원문의 규모는 지진 자체의 크기를 나타내는 자료로 읽습니다. 특정 장소의 흔들림·피해와 같은 뜻으로 쓰지 않으며 규모만으로 피해 순서를 정하지 않습니다. 지진 발생 원인은 현행 필수 평가에 넣지 않습니다.');
 if(type==='T10')n.push('공식 재난 안내·교사/보호자 안내를 따릅니다. 원문의 청소 안내를 학생의 화산재 채집/지붕 청소 과제로 옮기지 않습니다.');
 if(type==='T11')n.push('학교의 안내에 따라 몸을 보호하고 흔들림이 멈춘 뒤 질서 있게 대피합니다. 학생이 가스·전기 설비를 직접 조작하도록 요구하지 않습니다.');
 if(n.length)notes[q.key]=n.join(' ');
 if(q.givens?.보기?.some?.(v=>v.includes('(암석 사진)'))){const {보기,...rest}=q.givens;givens[q.key]=rest;}
}
for(const key of ['1-7','1-17','3-18'])givens[key]=null; // 같은 표/캡션이 원본 그림에 모두 있다.
await importSourceOnly({unit:'s41-u03',dir,date:'2026-10-18',title:'4-1 Ⅲ 땅의 변화',uKey:'u03',course:'초등4-1',unitLabel:'Ⅲ. 땅의 변화',sourceId:'sci-41-3-cats',edition:'시매쓰DMC 최다빈출 단원평가',required:Object.fromEntries(Object.entries(sourceJudges).map(([k,j])=>[k,[j.need[0].t]])),judge:sourceJudges,unprintedRubricRatios:original.filter(q=>q.format==='서술형').map(q=>q.key),sourceGivensOverrides:givens,sourceNotes:notes});
const sp=join(units,'s41-u03.source.js'),st=readFileSync(sp,'utf8'),offset=st.indexOf('export const source = '),data=JSON.parse(st.slice(offset+'export const source = '.length).trim().replace(/;$/,''));
const figureNotes={'1-7':'분류표. 화산: 킬라우에아산·베수비오산·화이트 아일랜드산. 화산이 아닌 산: 안나푸르나산·후지산·지리산. 잘못 분류한 이름을 찾는다.','1-17':'그림과 캡션: 도로가 갈라짐, 건물이 무너짐, 사람이 죽거나 다침.','3-18':'연도·지역·규모 표. 2016년 우리나라5.8, 2018년 일본6.7, 2019년 미국7.1, 2023년 튀르키예7.8.'};
for(const q of data){const key=`${q.sourceRef.set}-${q.sourceRef.no}`;if(figureNotes[key])q.figureNote=figureNotes[key];}
writeFileSync(sp,st.slice(0,offset)+'export const source = '+json(data)+';\n');
// 원문 보기의 의미를 원문 분류와 대조한다. 새 짝문항의 보기 번호를 복제하지 않는다.
const typeM={T01:'M04',T02:'M01',T03:'M03',T04:'M09',T05:'M07',T06:'M08',T07:'M10',T08:'M11',T09:'M12',T10:'M15',T11:'M14'},maps={};
for(const q of original.filter(q=>q.choices)){
 const type=tx.sources[q.key][0],ok=[...q.answer].filter(c=>'①②③④⑤'.includes(c)).map(c=>'①②③④⑤'.indexOf(c)),d={};
 q.choices.forEach((c,i)=>{if(ok.includes(i))return;let m=typeM[type];if(type==='T04'&&['1-7','2-5','4-6'].includes(q.key))m='M16';if(type==='T05'&&/마그마/.test(c))m='M06';if(type==='T06'&&/크기|소리|온도|실제 화산 활동/.test(c))m='M19';if(q.key==='1-16')m=i===1?'M06':'M07';if(q.key==='2-14')m='M07';d[i]=m;});
 maps[`s41-u03-o${q.set}-${String(q.no).padStart(2,'0')}`]=d;
}
const path=join(units,'s41-u03.misc.js'),text=readFileSync(path,'utf8'),cut=text.indexOf(sourceMark),part=text.slice(cut),rx=/Object.assign\(distractors, ([\s\S]*?)\);\nObject.assign\(typed,/;assert(rx.test(part));
writeFileSync(path,text.slice(0,cut)+part.replace(rx,()=>`Object.assign(distractors, ${json(maps)});\nObject.assign(typed,`).replace('짝 유사문항의 오개념을 그대로 쓴다.','원문 보기별 의미를 분류/원문과 따로 대조했다.'));
console.log('원문80·짝80·기존18·독립 보충64 =242; 기존ID/원전사/그림/3D 보존');
