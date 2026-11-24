import{beforeGeologyMixed}from'./geology-mixed-stage.mjs';
import assert from'node:assert/strict';import{questionAtVersion}from'../question-revision.js';import{GEOLOGY_GUIDED_VERSION}from'../geology-guided-review.js';
const previous=new WeakMap(),reviewed=new Set([11,14,21,22,28,42,49,55,56,66,67,72,77,80]);
export function beforeGeologyTask(q){q=beforeGeologyMixed(q);if(q.contentVersion!==GEOLOGY_GUIDED_VERSION)return q;if(previous.has(q))return previous.get(q);const snapshot=q.previousVersions.at(-1),old=questionAtVersion(q,snapshot.version);if(!Object.hasOwn(snapshot,'contentVersion'))delete old.contentVersion;previous.set(q,old);return old;}
export function geologyUnchangedSolutions(html){const rows=[...html.matchAll(/<section class="ed-solution" data-solution="c22-s51-u01-w(\d+)">[\s\S]*?<\/section>/g)];assert.equal(rows.length,80);const kept=rows.filter(m=>!reviewed.has(Number(m[1]))).map(m=>m[0]);assert.equal(kept.length,66);return kept;}
