import{beforeLightMixed}from'./light-mixed-stage.mjs';
import assert from'node:assert/strict';import{questionAtVersion}from'../question-revision.js';import{LIGHT_GUIDED_VERSION}from'../light-guided-review.js';
const previous=new WeakMap(),reviewed=new Set([4,10,16,22,28,34,40,44,45,48,49,50,51,52,61,66,71,73,75,76,79,80]);
export function beforeLightTask(q){q=beforeLightMixed(q);if(q.contentVersion!==LIGHT_GUIDED_VERSION)return q;if(previous.has(q))return previous.get(q);const snapshot=q.previousVersions.at(-1),old=questionAtVersion(q,snapshot.version);if(!Object.hasOwn(snapshot,'contentVersion'))delete old.contentVersion;previous.set(q,old);return old;}
export function lightUnchangedSolutions(html){const rows=[...html.matchAll(/<section class="ed-solution" data-solution="light-book-(\d+)">[\s\S]*?<\/section>/g)];assert.equal(rows.length,80);const kept=rows.filter(m=>!reviewed.has(Number(m[1]))).map(m=>m[0]);assert.equal(kept.length,58);return kept;}
