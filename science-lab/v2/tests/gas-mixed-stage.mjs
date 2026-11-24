import{questionAtVersion}from'../question-revision.js';import{GAS_MIXED_VERSION}from'../gas-mixed-response.js';
const cache=new WeakMap();export function beforeGasMixed(q){if(q?.contentVersion!==GAS_MIXED_VERSION)return q;if(cache.has(q))return cache.get(q);const snapshot=q.previousVersions.at(-1),old=questionAtVersion(q,snapshot.version);if(!Object.hasOwn(snapshot,'contentVersion'))delete old.contentVersion;cache.set(q,old);return old;}

const changed=new Set([36,37,38,47,71,79]);export function gasMixedUnchangedQuickRows(html){const rows=[...html.matchAll(/<tr><th scope="row">(\d+)<\/th><td>[\s\S]*?<\/tr>/g)];if(rows.length!==80)throw Error('여러 가지 기체 정답표80행이 필요해요.');return rows.filter(m=>!changed.has(Number(m[1]))).map(m=>m[0]);}
