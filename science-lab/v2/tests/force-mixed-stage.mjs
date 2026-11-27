import assert from'node:assert/strict';
import{FORCE_MIXED_VERSION}from'../force-mixed-response.js';
import{questionAtVersion}from'../question-revision.js';
const cache=new WeakMap();
export function beforeForceMixed(q){if(q.contentVersion!==FORCE_MIXED_VERSION)return q;if(cache.has(q))return cache.get(q);const snap=q.previousVersions.at(-1),old=questionAtVersion(q,snap.version);if(!Object.hasOwn(snap,'contentVersion'))delete old.contentVersion;cache.set(q,old);return old;}

export function forceMixedUnchangedQuickRows(html){const rows=[...html.matchAll(/<tr><th scope="row">(\d+)<\/th><td>[^<]*<\/td><td>[^<]*<\/td><\/tr>/g)];assert.equal(rows.length,80);const kept=rows.filter(m=>![35,37,40,63,64].includes(Number(m[1]))).map(m=>m[0]);assert.equal(kept.length,75);return kept;}
