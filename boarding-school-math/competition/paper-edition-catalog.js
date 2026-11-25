(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.GFIELDPublicPaperEditions=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 // Full, reviewed manuscript files go here. Empty means genuinely pending;
 // QA fixtures and automatically translated source text are never published.
 const entries=Object.freeze([]);
 const checks=['sourceConditions','numbersAndChoices','diagrams','answerParity','curriculumTerminology','publicationRights'];
 function entryFor(program,year,form){const row=entries.find(r=>r.program===program&&r.year===Number(year)&&r.form===String(form||''));return row&&row.status==='approved'&&checks.every(c=>row.review&&row.review[c]===true)&&/^\.\/competition\/paper-editions\/[a-z0-9-]+\.json$/.test(row.url)?row:null;}
 return Object.freeze({entries,entryFor});
});
