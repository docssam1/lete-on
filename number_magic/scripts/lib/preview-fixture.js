'use strict';
// Test-only, local HTTP response. Production files and authentication are unchanged.
module.exports=async function(page){
 await page.route(/\/app\/entry\.js(?:\?|$)/,r=>r.fulfill({contentType:'application/javascript',body:'window.NM_ENTRY={mode:"fixture"};'}));
 await page.route(/\/app\/main\.js(?:\?|$)/,async r=>{const response=await r.fetch();let s=await response.text(),i=s.lastIndexOf('\n})();');if(i<0)throw Error('Missing app closure');s=s.slice(0,i)+'\nwindow.__NM_AUDIT_OPEN=async(unit,step="discover")=>{while(!booted)await new Promise(r=>setTimeout(r,10));S.view="unit";S.unit=unit;S.step=step;S.sub={started:true,skipAsked:true};S.progress[unit]={...(S.progress[unit]||{}),introSeen:true};render();};'+s.slice(i);await r.fulfill({response,body:s});});
};
