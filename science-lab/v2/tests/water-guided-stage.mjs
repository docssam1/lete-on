import{beforeWaterMixed}from'./water-mixed-stage.mjs';
import assert from'node:assert/strict';import{questionAtVersion}from'../question-revision.js';import{WATER_GUIDED_VERSION}from'../water-guided-review.js';
const previous=new WeakMap(),reviewed=new Set([39,40,49,50,51,52,53,54,75,76,77,78,79,80]);
export function beforeWaterTask(q){q=beforeWaterMixed(q);if(q.contentVersion!==WATER_GUIDED_VERSION)return q;if(previous.has(q))return previous.get(q);const snapshot=q.previousVersions.at(-1),old=questionAtVersion(q,snapshot.version);if(!Object.hasOwn(snapshot,'contentVersion'))delete old.contentVersion;previous.set(q,old);return old;}
export function waterUnchangedSolutions(html){const rows=[...html.matchAll(/<section class="ed-solution" data-solution="s41-u02-w(\d+)">[\s\S]*?<\/section>/g)];assert.equal(rows.length,80);const kept=rows.filter(m=>!reviewed.has(Number(m[1]))).map(m=>m[0]);assert.equal(kept.length,66);return kept;}
