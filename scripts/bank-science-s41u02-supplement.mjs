// 원문·짝80개는 보존한다. 검수한 기존14와 독립 보충64를 현재 분류에 연결한다.
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const dir=resolve(process.argv[2]||'science-lab/bank/work/s41u02'),units=resolve('science-lab/data/units');
const read=n=>JSON.parse(readFileSync(join(dir,n),'utf8')),json=JSON.stringify;
const marker='// ── 2026-10-18 현행 보충 검수 ──';
const rewrite=(suffix,body)=>{const p=join(units,`s41-u02${suffix}.js`);writeFileSync(p,readFileSync(p,'utf8').split(marker)[0].trimEnd()+'\n\n'+marker+'\n'+body+'\n');};
const old=read('lesson-items-reviewed.json'),s=read('supplement.json'),cur=read('curriculum.json');
assert.equal(old.length,14);assert.equal(s.items.length,64);
assert.equal(new Set([...old,...s.items].map(q=>q.id)).size,78);
rewrite('',`for(const patch of ${json(old,null,2)}){const item=items.find(q=>q.id===patch.id);if(!item)throw Error(patch.id);Object.assign(item,patch);}\nitems.push(...${json(s.items,null,2)});`);
// Append after the original-source mapping, which remains byte-for-byte unchanged.
const fixes={M07:'알아보려는 조건만 바꾸고 같은 도구·용기·관찰 시간을 유지해요. 물의 출입과 측정 범위도 확인해요. 얼음에 소금을 섞는 방법은 교사 안내로 하며, 혼합물이0℃보다 차가워질 수 있어요.',M05:'물의 출입이 없는 같은 물·용기에서 얼거나 녹으면 무게는 같아요. 겉 물기·새거나 흘린 물·용기와 뚜껑 변경을 확인해요.',M08:'증발과 끓음은 모두 물이 수증기로 변해요. 증발은 표면에서, 충분히 끓을 때는 물속과 표면에서 변해요. 가열 초기 작은 기포만으로 끓는다고 판단하지 않아요.',M13:'컵 겉에 붙은 물방울은 무게에 더해져요. 컵 전체를 비교할 때는 물방울뿐 아니라 컵 안 물의 출입·증발·흘림도 확인해요.'};
rewrite('.misc',`for(const [id,fix]of Object.entries(${json(fixes)}))misconceptions[id].fix=fix;\nObject.assign(misconceptions,${json(s.misconceptions)});\nObject.assign(distractors,${json(s.distractors)});\nObject.assign(typed,${json(s.typed)});\nObject.assign(written,${json(s.written)});\nObject.assign(remedy,${json(s.remedy)});`);
rewrite('.judge',`Object.assign(judge,${json(s.judge,null,2)});`);
const txPath=join(units,'s41-u02.taxonomy.js');
const {taxonomy:tx}=await import(pathToFileURL(txPath).href+'?review='+Date.now());
tx.standards=cur.standards;tx.standardsSource=cur.standardsSource;
tx.standardsNote='교육부2022-33 [별책9] 본문4과10-01~03과 해설을 대조했다. 관찰 가능한 현상과 간단한 장치 설계·만들기를 다룬다.';
const types=[['T13','E1','세 상태와 관찰·추론'],['T14','E2','얼기·녹기의 공정한 측정'],['T15','E3','증발·끓음의 공통점과 관찰'],['T16','E4','응결의 근거와 물방울의 출처'],['T17','E5','물을 얻는 장치의 구조 설계'],['T18','E5','간단한 장치 만들기와 안전'],['T19','E5','시험 기록과 증거의 한계'],['T20','E5','개선·의견 교환과 다시 확인']];
tx.types=tx.types.filter(t=>!types.some(([id])=>t.id===id));tx.types.push(...types.map(([id,element,name])=>({id,element,name,desc:'조건·관찰 근거에 따라 비교하고 상태 변화와 설계·만들기·시험을 구별한다.'})));
tx.types.find(t=>t.id==='T12').desc='장치에서 일어나는 증발·응결·수집의 경로를 구별한다. 이미 액체인 안개 물방울의 포집을 새 응결과 같다고 하지 않는다.';
tx.supplementAuthored=true;tx.authored=Object.fromEntries([...old,...s.items].map(q=>[q.id,q.taxonomy.type]));tx.supplementFormatCounts=[...old,...s.items].reduce((a,q)=>(a[q.taxonomy.format]=(a[q.taxonomy.format]||0)+1,a),{});tx.formats=[...new Set([...tx.formats,...Object.keys(tx.supplementFormatCounts)])];
writeFileSync(txPath,'// 물의 상태 변화: 원문 분류·세트 키를 보존하고 현행 설계·만들기를 보충한다.\nexport const taxonomy = '+json(tx,null,2)+';\n');
console.log('물의 상태 변화: 원문80·짝80 보존 + 기존14 검수 + 독립 보충64');
