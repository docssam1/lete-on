import assert from'node:assert/strict';
// Historical wording/rail checks still compare the other 77 exact solutions.
// The three current drawing solutions have separate semantic/render coverage.
export function withoutForceDrawingSolutions(html){
 let count=0;
 const out=html.replace(/<section class="ed-solution" data-solution="s31-u01-w(?:075|077|079)">[\s\S]*?<\/section>/g,()=>{count++;return'<section data-reviewed-force-drawing></section>';});
 assert.equal(count,3);return out;
}
