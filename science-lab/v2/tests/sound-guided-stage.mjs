import{beforeSoundMixed}from'./sound-mixed-stage.mjs';
import assert from'node:assert/strict';import{questionAtVersion}from'../question-revision.js';import{SOUND_GUIDED_VERSION}from'../sound-guided-review.js';
const previous=new WeakMap(),reviewed=new Set([8,16,24,32,40,48,56,75,76,77,78,79,80]);
export function beforeSoundTask(q){q=beforeSoundMixed(q);if(q.contentVersion!==SOUND_GUIDED_VERSION)return q;if(previous.has(q))return previous.get(q);const snapshot=q.previousVersions.at(-1),old=questionAtVersion(q,snapshot.version);if(!Object.hasOwn(snapshot,'contentVersion'))delete old.contentVersion;previous.set(q,old);return old;}
export function soundUnchangedSolutions(html){const rows=[...html.matchAll(/<section class="ed-solution" data-solution="c22-s32-u03-w(\d+)">[\s\S]*?<\/section>/g)];assert.equal(rows.length,80);const kept=rows.filter(m=>!reviewed.has(Number(m[1]))).map(m=>m[0]);assert.equal(kept.length,67);return kept;}
