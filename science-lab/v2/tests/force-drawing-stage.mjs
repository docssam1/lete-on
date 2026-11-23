import assert from'node:assert/strict';
// Historical stages still compare the other 66 exact solutions and 73 quick rows.
// The reviewed force tasks have separate current semantic/render coverage.
export function withoutForceTaskSolutions(html){
 let count=0;
 const out=html.replace(/<section class="ed-solution" data-solution="s31-u01-w(?:035|036|037|038|039|040|063|064|075|076|077|078|079|080)">[\s\S]*?<\/section>/g,()=>{count++;return'<section data-reviewed-force-task></section>';});
 assert.equal(count,14);return out;
}
export function withoutForceTaskQuickRows(html){
 let count=0;
 const out=html.replace(/<tr><th scope="row">(?:63|75|76|77|78|79|80)<\/th>[\s\S]*?<\/tr>/g,()=>{count++;return'<tr data-reviewed-force-topic></tr>';});
 assert.equal(count,7);return out;
}
