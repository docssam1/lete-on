import{BIOLOGY_MIXED_VERSION}from'../biology-mixed-response.js';
import{questionAtVersion}from'../question-revision.js';
const cache=new WeakMap();
export function beforeBiologyMixed(q){if(q.contentVersion!==BIOLOGY_MIXED_VERSION)return q;if(cache.has(q))return cache.get(q);const snap=q.previousVersions.at(-1),old=questionAtVersion(q,snap.version);if(!Object.hasOwn(snap,'contentVersion'))delete old.contentVersion;cache.set(q,old);return old;}
