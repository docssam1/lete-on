import assert from'node:assert/strict';
import{GROUND_MIXED_VERSION}from'../ground-mixed-response.js';
import{questionAtVersion}from'../question-revision.js';
const cache=new WeakMap();
export function beforeGroundMixed(q){if(q.contentVersion!==GROUND_MIXED_VERSION)return q;if(cache.has(q))return cache.get(q);const snap=q.previousVersions.at(-1),old=questionAtVersion(q,snap.version);if(!Object.hasOwn(snap,'contentVersion'))delete old.contentVersion;cache.set(q,old);return old;}

export function groundMixedUnchangedQuickRows(html){const rows=[...html.matchAll(/<tr><th scope="row">(\d+)<\/th><td>[^<]*<\/td><td>[^<]*<\/td><\/tr>/g)];assert.equal(rows.length,80);const kept=rows.filter(m=>![6,29,62,67].includes(Number(m[1]))).map(m=>m[0]);assert.equal(kept.length,76);return kept;}
