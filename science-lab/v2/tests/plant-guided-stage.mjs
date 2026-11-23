import assert from'node:assert/strict';
import{questionAtVersion}from'../question-revision.js';
import{PLANT_GUIDED_VERSION}from'../plant-guided-review.js';
const previous=new WeakMap(),reviewed=new Set([35,36,37,38,39,40,63,64,75,76,77,78,79,80]);
// Historical wording tests compare exact old contracts; the new tests cover all 14 revised tasks.
export function beforePlantTask(q){
 if(q.contentVersion!==PLANT_GUIDED_VERSION)return q;if(previous.has(q))return previous.get(q);
 const snapshot=q.previousVersions.at(-1),old=questionAtVersion(q,snapshot.version);if(!Object.hasOwn(snapshot,'contentVersion'))delete old.contentVersion;previous.set(q,old);return old;
}
export function plantUnchangedSolutions(html){
 const rows=[...html.matchAll(/<section class="ed-solution" data-solution="s31-u03-w(\d+)">[\s\S]*?<\/section>/g)];assert.equal(rows.length,80);const kept=rows.filter(m=>!reviewed.has(Number(m[1]))).map(m=>m[0]);assert.equal(kept.length,66);return kept;
}
export function plantQuickKeys(html){
 const rows=[...html.matchAll(/<tr><th scope="row">(\d+)<\/th>((?:<td>[\s\S]*?<\/td>)+)<\/tr>/g)].map(m=>[m[1],[...m[2].matchAll(/<td>([\s\S]*?)<\/td>/g)].at(-1)[1]]);assert.equal(rows.length,80);assert.equal(new Set(rows.map(r=>r[0])).size,80);return rows;
}
