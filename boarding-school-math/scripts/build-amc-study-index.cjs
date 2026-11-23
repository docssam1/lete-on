"use strict";
// Teacher/authoring ledger: metadata only, never copied original problems or solutions.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),library=require('../competition/amc-original-paper-library.js'),concepts=require('../competition/amc-original-item-concept-reference.js'),keys=require('../competition/amc-original-answer-key-reference.js'),papers=require('../competition/amc-study-paper-manifest.js');
const context=vm.createContext({});
for(const file of ['amc8-concept-practice-bank.js','amc8-concept-practice-extension.js','competition/amc10-concept-practice-bank.js','competition/amc12-concept-practice-bank.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context);
const banks={amc8:[...context.GFIELDAMC8ConceptPractice.items,...context.GFIELDAMC8ConceptPracticeExtension.items],amc10:context.GFIELDAMC10ConceptPractice.items,amc12:context.GFIELDAMC12ConceptPractice.items};
const columns=['source_key','program','year','form','question','source_url','answer_key_url','source_concepts','source_difficulty_rating','diagnostic_domain','domain_mapping_status','concept_practice_ids','practice_match_status','worked_solution_status','lecture_status'];
const rows=[],summary={papers:0,items:0,conceptLinked:0,needsPractice:0,domainReview:0,authoredLectures:0};
for(const program of ['amc8','amc10','amc12'])for(const year of library.studyYearsFor(program))for(const form of library.formsFor(program,year)){
 if(!papers.paperFor(program,year,form))continue;summary.papers++;
 const format=library.formatFor(program,year,form);
 for(let q=1;q<=format.itemCount;q++){
  const reference=concepts.referenceFor(program,year,form,q),answer=keys.answerFor(program,year,form,q);
  if(!reference||!answer)throw Error('Missing source metadata '+[program,year,form,q]);
  const candidates=banks[program].filter(item=>(item.sourceConcepts||[]).some(tag=>reference.sourceConcepts.includes(tag))).map(item=>item.id);
  const mapping=reference.mappingStatus;summary.items++;if(candidates.length)summary.conceptLinked++;else summary.needsPractice++;
  if(mapping.includes('suggestion'))summary.domainReview++;
  rows.push(['amc:'+program+':'+year+':'+(form||'single')+':q'+String(q).padStart(2,'0'),program,year,form,q,reference.sourceUrl,answer.sourceUrl,reference.sourceConcepts.join('|'),reference.sourceDifficultyRating||'',reference.domain,mapping,candidates.join('|'),candidates.length?'concept-linked; same-type review pending':'no-concept-match','source-hosted; GFIELD step authoring pending','not-authored']);
 }
}
const csv=[columns,...rows].map(row=>row.map(value=>'"'+String(value).replace(/"/g,'""')+'"').join(',')).join('\n')+'\n';
const target=path.join(root,'competition/amc-recent-study-item-index.csv');
if(process.argv.includes('--check')){if(fs.readFileSync(target,'utf8')!==csv)throw Error('Study index differs');}else fs.writeFileSync(target,csv);
console.log(JSON.stringify(summary,null,2));
