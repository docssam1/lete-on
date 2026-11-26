(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.GFIELDPaperEditionLayout=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 // Retain source question numbers. A complete ordered map is required; scans
 // and ambiguous layouts are never guessed or substituted with another paper.
 function questionMap(pages,count){
  if(!Number.isInteger(count)||count<1||count>50||!Array.isArray(pages)||pages.length>100)throw Error('unmapped-questions');
  const candidates=[];
  pages.forEach((page,i)=>{if(!(page.width>0&&page.height>0))throw Error('unmapped-questions');(page.items||[]).forEach(item=>{const match=/^(\d{1,2})\.(?:\s|$)/.exec(String(item.text||'').trim());if(match&&item.x>=0&&item.x<=page.width*.13&&item.top>=0&&item.top<page.height-25){const baseline=item.top+(item.height||12),firstLine=(page.items||[]).filter(t=>t.x>=item.x&&t.top<=baseline+2&&t.top+(t.height||12)>=baseline-18);const top=Math.min(item.top,...firstLine.map(t=>t.top));candidates.push({number:Number(match[1]),page:i+1,x:item.x,top:Math.max(0,top-4)});};});});
  const columns=[];candidates.sort((a,b)=>a.x-b.x);for(const point of candidates){const column=columns.find(c=>Math.abs(c[0].x-point.x)<=8);if(column)column.push(point);else columns.push([point]);}
  const complete=[];for(const column of columns){column.sort((a,b)=>a.page-b.page||a.top-b.top);let chain=[];for(const point of column){if(point.number===1)chain=[point];else if(chain.length&&point.number===chain.length+1)chain.push(point);if(chain.length===count){complete.push(chain);chain=[];}}}
  if(complete.length!==1)throw Error('unmapped-questions');const headers=complete[0];
  if(Math.max(...headers.map(h=>h.x))-Math.min(...headers.map(h=>h.x))>20)throw Error('unmapped-questions');
  return headers.map((start,i)=>{const next=headers[i+1],endPage=next?next.page:start.page,segments=[];for(let n=start.page;n<=endPage;n++){const page=pages[n-1],top=n===start.page?start.top:Math.max(25,page.height*.045),bottom=next&&n===next.page?next.top-4:page.height-30;if(bottom>top+4)segments.push({page:n,left:0,top,right:page.width,bottom});}if(!segments.length)throw Error('unmapped-questions');return {number:start.number,columnWidth:pages[start.page-1].width-2*start.x,columnLeft:start.x,segments};});
 }
 function paginate(items,perPage,kind){
  if(![2,3].includes(perPage)||!Array.isArray(items)||!items.length)throw Error('invalid-layout');
  // 244 mm is the content area. Leave at least 28/22 mm for written work.
  const room=244,minWork=perPage===2?28:22,pages=[];let page=[],height=0;
  for(const item of items){const content=Number(item.heightMm);if(!(content>0&&content<1000))throw Error('invalid-item-height');const work=Number.isFinite(item.minWorkMm)?Math.max(12,Math.min(minWork,item.minWorkMm)):minWork;const needed=content+9+(kind==='solutions'?3:work);if(needed>room)throw Error('question-too-tall');if(page.length&&(page.length>=perPage||height+needed>room)){pages.push(page);page=[];height=0;}page.push(item);height+=needed;}
  if(page.length)pages.push(page);return pages;
 }
 function validatePack(pack,identity,keys){
  if(!pack||pack.schemaVersion!=='gfield-paper-edition-v1'||!pack.paper||!Array.isArray(pack.items))throw Error('invalid-pack');
  const paper=pack.paper;if(paper.program!==identity.program||Number(paper.year)!==identity.year||String(paper.form||'')!==identity.form)throw Error('wrong-paper');
  const ref=keys.formFor(identity.program,identity.year,identity.form);if(!ref||pack.items.length!==ref.itemCount)throw Error('incomplete-pack');
  const seen=new Set(),languages=['en','ko','zh-Hans'],available=[];
  for(const [i,item]of pack.items.entries()){
   if(!item||item.number!==i+1||seen.has(item.number)||!item.versions)throw Error('incomplete-pack');seen.add(item.number);
   const answer=keys.answerFor(identity.program,identity.year,identity.form,item.number);if(!keys.accepts(answer,item.answer))throw Error('wrong-answer-key');
   for(const lang of languages){const v=item.versions[lang];if(!v)continue;if(typeof v.stem!=='string'||!v.stem.trim()||v.stem.length>14000)throw Error('invalid-text');if(identity.program!=='aime'&&(!Array.isArray(v.choices)||v.choices.length!==5||v.choices.some(c=>typeof c!=='string'||!c.trim()||c.length>2000)))throw Error('invalid-choices');if(v.steps!==undefined&&(!Array.isArray(v.steps)||!v.steps.length||v.steps.length>30||v.steps.some(s=>typeof s!=='string'||!s.trim()||s.length>6000)))throw Error('invalid-solution');if(v.diagram!==undefined&&(typeof v.diagram!=='string'||v.diagram.length>3000000||!/^data:image\/(?:png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(v.diagram)))throw Error('invalid-diagram');}
  }
  languages.forEach(lang=>{if(pack.items.every(i=>i.versions[lang]))available.push(lang);});if(!available.length)throw Error('incomplete-language');
  return {languages:available,solutionLanguages:available.filter(lang=>pack.items.every(i=>i.versions[lang].steps&&i.versions[lang].steps.length))};
 }
 function validateSolutions(pack,identity,keys){
  if(!pack||pack.schemaVersion!=='gfield-paper-solutions-v1'||pack.authorship!=='GFIELD'||pack.contentType!=='independent-mathematical-commentary'||!pack.paper||!Array.isArray(pack.items))throw Error('invalid-solutions');
  const p=pack.paper,ref=keys.formFor(identity.program,identity.year,identity.form);
  if(p.program!==identity.program||Number(p.year)!==identity.year||String(p.form||'')!==identity.form)throw Error('wrong-paper');
  if(!ref||pack.items.length!==ref.itemCount)throw Error('incomplete-solutions');
  const text=v=>typeof v==='string'&&v.trim()&&v.length<=6000;
  for(const [i,item]of pack.items.entries()){
   if(!item||item.number!==i+1||!text(item.result)||!item.versions)throw Error('incomplete-solutions');
   if(!keys.accepts(keys.answerFor(p.program,p.year,p.form,item.number),item.answer))throw Error('wrong-answer-key');
   if(item.sourceUrl!=='https://live.poshenloh.com/past-contests/'+p.program+'/'+p.year+(p.form||'')+'/problem/'+item.number)throw Error('invalid-source');
   for(const version of Object.values(item.versions)){
    if(!version||!text(version.title)||!text(version.check)||!Array.isArray(version.steps)||version.steps.length<2||version.steps.length>12||version.steps.some(s=>!text(s)))throw Error('invalid-solution');
    if(version.stem!==undefined||version.choices!==undefined||version.diagram!==undefined)throw Error('solution-only');
    if(version.grid!==undefined&&(!Array.isArray(version.grid)||version.grid.length>8||!version.grid.length||!version.grid.every(r=>typeof r==='string'&&/^[A-Z]{1,8}$/.test(r)&&r.length===version.grid[0].length)))throw Error('invalid-grid');
   }
  }
  const languages=['en','ko','zh-Hans'].filter(lang=>pack.items.every(i=>i.versions[lang]));
  if(!languages.length)throw Error('incomplete-language');
  return {languages};
 }
 return Object.freeze({questionMap,paginate,validatePack,validateSolutions});
});
