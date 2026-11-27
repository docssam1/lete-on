import{beforeClimateMixed}from'./climate-mixed-stage.mjs';
import assert from'node:assert/strict';import{questionAtVersion}from'../question-revision.js';import{CLIMATE_GUIDED_VERSION}from'../climate-guided-review.js';
const previous=new WeakMap(),reviewed=new Set([2,8,19,22,26,28,30,44,45,46,53,54,61,62,69,70,77,78,79,80]);
export function beforeClimateTask(q){q=beforeClimateMixed(q);if(q.contentVersion!==CLIMATE_GUIDED_VERSION)return q;if(previous.has(q))return previous.get(q);const snapshot=q.previousVersions.at(-1),old=questionAtVersion(q,snapshot.version);if(!Object.hasOwn(snapshot,'contentVersion'))delete old.contentVersion;previous.set(q,old);return old;}
export function climateUnchangedSolutions(html){const rows=[...html.matchAll(/<section class="ed-solution" data-solution="c22-s42-u04-w(\d+)">[\s\S]*?<\/section>/g)];assert.equal(rows.length,80);const kept=rows.filter(m=>!reviewed.has(Number(m[1]))).map(m=>m[0]);assert.equal(kept.length,60);return kept;}
