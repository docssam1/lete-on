import assert from'node:assert/strict';
import{MATERIAL_MIXED_VERSION}from'../material-mixed-response.js';
import{questionAtVersion}from'../question-revision.js';
const cache=new WeakMap();
export function beforeMaterialMixed(q){if(q.contentVersion!==MATERIAL_MIXED_VERSION)return q;if(cache.has(q))return cache.get(q);const snap=q.previousVersions.at(-1),old=questionAtVersion(q,snap.version);if(!Object.hasOwn(snap,'contentVersion'))delete old.contentVersion;cache.set(q,old);return old;}

export function materialMixedUnchangedQuickRows(html){const rows=[...html.matchAll(/<tr><th scope="row">(\d+)<\/th><td>[^<]*<\/td><td>[^<]*<\/td><\/tr>/g)];assert.equal(rows.length,80);const kept=rows.filter(m=>![33,35,36,38,40].includes(Number(m[1]))).map(m=>m[0]);assert.equal(kept.length,75);return kept;}

export function beforeMaterialSampleLabel(q){if(!['c22-s32-u01-t05','c22-s32-u01-t09','c22-s32-u01-t10','c22-s32-u01-t12'].includes(q.id)||!q.givens)return q;const json=JSON.stringify(q.givens);return json.includes('고무(네오프렌 고무)')?{...q,givens:JSON.parse(json.replaceAll('고무(네오프렌 고무)','고무(천연고무)'))}:q;}
