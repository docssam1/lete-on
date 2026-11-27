import assert from'node:assert/strict';
import{questionAtVersion}from'../question-revision.js';
import{ANIMAL_GUIDED_VERSION}from'../animal-guided-review.js';
const previous=new WeakMap(),reviewed=new Set([35,36,37,38,39,40,63,64,75,76,77,78,79,80]);
// Earlier wording/route tests keep their historical contract assertions.
// animal-guided-review.test.mjs covers all fourteen current tasks separately.
export function beforeAnimalTask(q){
 if(q.contentVersion!==ANIMAL_GUIDED_VERSION)return q;
 if(previous.has(q))return previous.get(q);
 const snapshot=q.previousVersions.at(-1),old=questionAtVersion(q,snapshot.version);
 if(!Object.hasOwn(snapshot,'contentVersion'))delete old.contentVersion;
 previous.set(q,old);return old;
}
export function animalUnchangedSolutions(html){
 const rows=[...html.matchAll(/<section class="ed-solution" data-solution="s31-u02-w(\d+)">[\s\S]*?<\/section>/g)];assert.equal(rows.length,80);
 const kept=rows.filter(m=>!reviewed.has(Number(m[1]))).map(m=>m[0]);assert.equal(kept.length,66);return kept;
}
export function animalQuickKeys(html){
 const rows=[...html.matchAll(/<tr><th scope="row">(\d+)<\/th>((?:<td>[\s\S]*?<\/td>)+)<\/tr>/g)].map(m=>[m[1],[...m[2].matchAll(/<td>([\s\S]*?)<\/td>/g)].at(-1)[1]]);
 assert.equal(rows.length,80);assert.equal(new Set(rows.map(r=>r[0])).size,80);return rows;
}
