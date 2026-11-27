import{beforeSolutionChoice}from'./solution-choice-stage.mjs';
import{questionAtVersion}from'../question-revision.js';import{SOLUTION_MIXED_VERSION}from'../solution-mixed-response.js';
const cache=new WeakMap();export function beforeSolutionMixed(q){q=beforeSolutionChoice(q);if(q?.contentVersion!==SOLUTION_MIXED_VERSION)return q;if(cache.has(q))return cache.get(q);const snapshot=q.previousVersions.at(-1),old=questionAtVersion(q,snapshot.version);if(!Object.hasOwn(snapshot,'contentVersion'))delete old.contentVersion;cache.set(q,old);return old;}
const changed=new Set([4, 28, 40, 46, 49, 52, 54, 56, 72, 76, 80, 84, 92, 95]);
export function solutionMixedUnchangedQuickRows(html){const rows=[...html.matchAll(/<tr><th scope="row">(\d+)<\/th><td>[\s\S]*?<\/tr>/g)];if(rows.length!==96)throw Error('용해와 용액 정답표96행이 필요해요.');return rows.filter(m=>!changed.has(Number(m[1]))&&!/<td>객관식<\/td>/.test(m[0])).map(m=>m[0]);}
