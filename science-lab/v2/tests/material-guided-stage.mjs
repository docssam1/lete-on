import{beforeMaterialMixed}from'./material-mixed-stage.mjs';
import assert from'node:assert/strict';import{questionAtVersion}from'../question-revision.js';import{MATERIAL_GUIDED_VERSION}from'../material-guided-review.js';
const previous=new WeakMap(),reviewed=new Set([33,34,35,36,37,38,39,40,75,76,77,78,79,80]);
export function beforeMaterialTask(q){q=beforeMaterialMixed(q);if(q.contentVersion!==MATERIAL_GUIDED_VERSION)return q;if(previous.has(q))return previous.get(q);const snapshot=q.previousVersions.at(-1),old=questionAtVersion(q,snapshot.version);if(!Object.hasOwn(snapshot,'contentVersion'))delete old.contentVersion;previous.set(q,old);return old;}
export function materialUnchangedSolutions(html){const rows=[...html.matchAll(/<section class="ed-solution" data-solution="c22-s32-u01-w(\d+)">[\s\S]*?<\/section>/g)];assert.equal(rows.length,80);const kept=rows.filter(m=>!reviewed.has(Number(m[1]))).map(m=>m[0]);assert.equal(kept.length,66);return kept;}
