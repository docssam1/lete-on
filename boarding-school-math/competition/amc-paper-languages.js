(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;if(root)root.GFIELDPaperLanguages=api;})(typeof globalThis!=="undefined"?globalThis:this,function(){
 "use strict";
 // Translation text/figures are published only after a complete paper-level review.
 // An interface-language change never substitutes for a translated examination paper.
 const translations=Object.freeze([]),local=new Map();
 const checks=["sourceConditions","numbersAndChoices","diagrams","answerParity","curriculumTerminology","publicationRights"];
 function versionFor(program,year,form,language,library){
  if(!library||!library.formsFor(program,year).includes(String(form||"").toUpperCase()))return null;
  if(language==='en')return Object.freeze({language:'en',status:'available',url:library.printRoute(program,year,form),source:'original'});
  if(!['ko','zh-Hans'].includes(language))return null;
  if((local.get([program,Number(year),String(form||'').toUpperCase()].join(':'))||[]).includes(language))return Object.freeze({language,status:'available',url:null,source:'local',format:'editable'});
  const row=translations.find(r=>r.program===program&&r.year===Number(year)&&r.form===String(form||'').toUpperCase()&&r.language===language);
  const ready=row&&row.status==='approved'&&checks.every(check=>row.review&&row.review[check]===true)&&typeof row.url==='string'&&/^(?:\.\/|https:\/\/)/.test(row.url);
  return Object.freeze({language,status:ready?'available':'pending',url:ready?row.url:null,source:'translated'});
 }
 return Object.freeze({languages:Object.freeze(['en','ko','zh-Hans']),requiredChecks:Object.freeze(checks),registerLocal:function(p,languages){local.set([p.program,Number(p.year),p.form].join(':'),languages.filter(l=>['en','ko','zh-Hans'].includes(l)));},versionFor});
});
