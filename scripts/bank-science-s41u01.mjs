// 자석의 이용: 검수한 원문80·짝80·수업 문항26·현재 범위 보충을 정적 파일로 만든다.
import{readFileSync,writeFileSync}from'node:fs';import{resolve,join}from'node:path';import assert from'node:assert/strict';
import{importSourceOnly}from'./bank-science-lib.mjs';import{judgeText}from'../science-lab/v2/judge.js';
const dir=resolve(process.argv[2]||'science-lab/bank/work/s41u01'),units=resolve('science-lab/data/units'),read=n=>JSON.parse(readFileSync(join(dir,n),'utf8')),json=JSON.stringify;
const reviewMark='// ── 2026-10-18 문항 검수 ──',sourceMark='// ── 단원평가 원문(source.js) ──';
const rewrite=(kind,body)=>{const p=join(units,'s41-u01'+kind+'.js');const prefix=readFileSync(p,'utf8').split(sourceMark)[0].split(reviewMark)[0].trimEnd();writeFileSync(p,prefix+'\n\n'+reviewMark+'\n'+body+'\n');};
const pairs=read('paired-reviewed.json'),lessonItems=read('lesson-items-reviewed.json'),supplement=read('supplement.json'),judges=read('source-judges-reviewed.json');
assert.equal(pairs.length,80);assert.equal(lessonItems.length,26);assert.equal(supplement.items.length,64);
rewrite('.similar',`for(const patch of ${json(pairs,null,2)}){const item=similar.find(q=>q.id===patch.id);if(!item)throw Error(patch.id);Object.assign(item,patch);}`);
rewrite('',`Object.assign(unit.sources,{bank:['data/units/s41-u01.source.js']});\nfor(const patch of ${json(lessonItems,null,2)}){const item=items.find(q=>q.id===patch.id);if(!item)throw Error(patch.id);Object.assign(item,patch);}\nitems.push(...${json(supplement.items,null,2)});`);
const txPath=join(units,'s41-u01.taxonomy.js'),tx=JSON.parse(readFileSync(txPath,'utf8').split('export const taxonomy = ')[1].trim().replace(/;$/,''));
const current=read('curriculum.json');tx.standards=current.standards;tx.standardsSource=current.standardsSource;
tx.authored=Object.fromEntries([...lessonItems,...supplement.items].map(q=>[q.id,q.taxonomy.type]));tx.supplementFormatCounts=[...lessonItems,...supplement.items].reduce((a,q)=>(a[q.taxonomy.format]=(a[q.taxonomy.format]||0)+1,a),{});tx.formats=[...new Set([...tx.formats,...Object.keys(tx.supplementFormatCounts)])];
writeFileSync(txPath,'// 자석의 이용: 원문 분류 키와 내용ID를 보존하고 현행 설계 범위를 보충했다.\nexport const taxonomy = '+json(tx,null,2)+';\n');
const fixes={M01:'제시한 시료의 재료와 실제 붙는 결과를 비교해요. 철 시료는 붙지만 유리·고무·나무·플라스틱 시료는 붙지 않아요. 겉모습만으로 다른 물체를 단정하지 않아요.',M05:'주어진 도구·물통·거리 조건에서 자석으로 철 시료를 붙여 꺼내는 방법을 생각해요. 다른 도구가 언제나 쓸모없다는 뜻은 아니에요.',M06:'막대자석에서는 같은 철 시료가 양쪽 끝에 더 많이 붙어요. 모양·극 배치가 다른 교구는 실제로 붙는 위치를 확인해요.',M07:'이 단원에서 사용하는 두 극 교구에는 N극과 S극이 있어요. 고리의 색이나 모양만으로 모든 제품의 극 위치를 정하지 않아요.',M10:'다른 자석·쇠붙이를 멀리하고 수평으로 자유롭게 돌 수 있는 자석의 멈춘 방향을 비교해요. N극은 북쪽, S극은 남쪽을 가리켜요.',M15:'자석의 성질을 띠지 않는 철 시료는 자석 쪽으로 끌려와요. 두 자석 사이의 밀어 내는 힘과 구별해요.'};
rewrite('.misc',`for(const [id,fix]of Object.entries(${json(fixes)}))misconceptions[id].fix=fix;\ndelete distractors['s41-u01-v077'];typed['s41-u01-v077']={any:'M12'};\nObject.assign(misconceptions,${json(supplement.misconceptions)});\nObject.assign(distractors,${json(supplement.distractors)});\nObject.assign(typed,${json(supplement.typed)});\nObject.assign(written,${json(supplement.written)});\nObject.assign(remedy,${json(supplement.remedy)});`);
rewrite('.judge',`for(const id of['s41-u01-a18','s41-u01-a20','s41-u01-a21','s41-u01-a25'])judge[id]={open:true,need:[],ex:{ok:[],part:[],no:[]}};\nObject.assign(judge,${json(supplement.judge,null,2)});`);
for(const [id,key]of Object.entries(judges)){assert.equal(key.need.length,1,id);for(const a of key.ex.ok)assert.equal(judgeText(a,key).st,'ok',id+':'+a);for(const a of key.ex.no)for(const tries of[1,2])assert.notEqual(judgeText(a,key,{tries}).st,'ok',id+':'+a);}
const sourceNotes={};const add=(keys,note)=>keys.forEach(k=>sourceNotes[k]=[sourceNotes[k],note].filter(Boolean).join(' '));
add(['1-1','1-3','2-1','3-1','4-2'],'문항에 제시한 재료·시료의 비교입니다. 모든 금속이 붙는다는 뜻이 아니며 실제 시료를 확인합니다.');
add(['1-5','1-6','2-5','3-5','3-6','4-4'],'가까운 거리와 얇은 사이 판의 교구 조건입니다. 두께·거리·고정 조건을 달리해도 반드시 붙는다는 뜻은 아닙니다.');
add(['1-9','2-8','2-9','3-8','3-9','4-8','4-9'],'그림의 N/S 두 극 교구를 대상으로 한 설명입니다. 모양·색만으로 모든 제품의 극 배치를 판단하지 않습니다. 자석을 실제로 자르거나 깨뜨리는 활동은 하지 않습니다.');
add(['1-13','1-14','1-15','2-13','2-14','2-15','2-16','3-13','3-14','3-15','4-13','4-14','4-15'],'다른 자석·쇠붙이를 멀리하고 수평으로 자유롭게 돌아 멈추는 조건입니다. 기울어진 그림은 실제 멈춘 방향의 측정값으로 쓰지 않습니다.');
add(['1-16','1-17','1-18','2-17','2-18','3-16','3-17','4-16','4-17','4-18'],'가까운 막대자석의 영향이 큰 설명 그림으로 해석합니다. 실제 바늘 각도는 주변 조건을 확인해 관찰하며 인쇄 방위 글자의 회전과 구별합니다.');
add(['1-11','2-12','3-12','4-12'],'같은 고리·개수·받침을 쓰고 비자성 막대가 옆 움직임을 제한하는 탑입니다. 떠 있는 고리만 보고 가이드 없는 안정한 공중 부양을 주장하지 않습니다.');
add(['2-6','4-5'],'교사가 준비한 얕은 안전한 물통의 자료입니다. 학생이 큰 수조에 손을 넣거나 위험하게 기구를 다루는 활동을 요구하지 않습니다.');
await importSourceOnly({unit:'s41-u01',dir,date:'2026-10-18',title:'4-1 Ⅰ 자석의 이용',uKey:'u01',course:'초등 4-1',unitLabel:'Ⅰ. 자석의 이용',sourceId:'sci-41-1-cats',edition:'시매쓰DMC 최다빈출 단원평가',judge:judges,required:Object.fromEntries(Object.entries(judges).map(([k,j])=>[k,[j.need[0].t]])),unprintedRubricRatios:['1-17','4-5','4-12'],sourceGivensOverrides:{'1-3':null,'1-18':null,'2-2':null,'3-10':null,'4-1':null},sourceNotes});
console.log('수업26·보충64·짝80: ID 보존, 기존 원문 전사/그림 보존');
