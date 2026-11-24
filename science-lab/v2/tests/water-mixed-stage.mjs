import assert from'node:assert/strict';
import{WATER_MIXED_VERSION}from'../water-mixed-response.js';
import{questionAtVersion}from'../question-revision.js';
const cache=new WeakMap();
export function beforeWaterMixed(q){if(q.contentVersion!==WATER_MIXED_VERSION)return q;if(cache.has(q))return cache.get(q);const snap=q.previousVersions.at(-1),old=questionAtVersion(q,snap.version);if(!Object.hasOwn(snap,'contentVersion'))delete old.contentVersion;cache.set(q,old);return old;}

export function waterMixedUnchangedQuickRows(html){const rows=[...html.matchAll(/<tr><th scope="row">(\d+)<\/th><td>[^<]*<\/td><td>[^<]*<\/td><\/tr>/g)];assert.equal(rows.length,80);const kept=rows.filter(m=>![40,50,51,53,54].includes(Number(m[1]))).map(m=>m[0]);assert.equal(kept.length,75);return kept;}
