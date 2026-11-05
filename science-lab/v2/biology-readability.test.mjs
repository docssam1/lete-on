import test from'node:test';import assert from'node:assert/strict';
import{items as raw}from'../data/units/s41-u04.js';import{items as think}from'../data/units/s41-u04.think.js';
import{biologyCurrentItems}from'../data/book/biology-student-language.js';
import{biologyReadableCurrentItems,BIOLOGY_READABILITY_VERSION}from'../data/book/s41-u04.editorial.js';
import{gradeDaily}from'./daily-grade.js';
import{questionAtVersion,restoreDailyQuestions,restartCurrentQuestion,pickedChoiceTexts}from'./question-revision.js';
import{revisedClassroom,classroomQuestions}from'./revised-lesson.js';import*as book from'../data/book/s41-u04.book.js';
const unit='s41-u04',baseline=biologyCurrentItems([...raw,...think]);
test('biology readable questions retain grading and every old presentation and saved answer',()=>{
 const before=structuredClone(baseline),current=biologyReadableCurrentItems(baseline,unit);let changed=0;
 for(let i=0;i<baseline.length;i++){
  const old=baseline[i],q=current[i];if(q===old)continue;changed++;
  assert.equal(q.contentVersion,BIOLOGY_READABILITY_VERSION);
  for(const key of Object.keys(old).filter(k=>!['prompt','explanation','choices','contentVersion','previousVersions'].includes(k)))assert.deepEqual(q[key],old[key]);
  if(q.answerContract.type==='single-choice')for(let picked=0;picked<q.choices.length;picked++)assert.deepEqual(gradeDaily(q,picked),gradeDaily(old,picked));
  else{assert.equal(q.answerContract.type,'written-explanation');for(const value of['',q.answerContract.sample,'another learner response'])assert.deepEqual(gradeDaily(q,value),gradeDaily(old,value));}
  const version=old.contentVersion||1,restored=questionAtVersion(q,version);
  for(const key of Object.keys(old))assert.deepEqual(restored[key],old[key]);
  if(old.choices)for(let n=0;n<old.choices.length;n++)assert.equal(pickedChoiceTexts(q,{picked:n,presentationVersion:version})[0],old.choices[n]);
  const value=old.answerContract.type==='single-choice'?old.answerContract.answer:old.answerContract.sample,state={answers:{[q.id]:value,other:'keep'},graded:{[q.id]:gradeDaily(old,value)},self:{[q.id]:'sure'},questionVersions:{[q.id]:version}},saved=structuredClone(state);
  const daily=restoreDailyQuestions([q],state)[0];assert.equal(daily.explanation,old.explanation);assert.deepEqual(daily.answerContract,old.answerContract);
  const next=restartCurrentQuestion(state,q);assert.deepEqual(state,saved);assert.equal(next.answers.other,'keep');assert.equal(next.answers[q.id],undefined);assert.deepEqual(next.revisionHistory[q.id][0].graded,state.graded[q.id]);assert.deepEqual(next.revisionHistory[q.id][0].answers,value);assert.equal(next.revisionHistory[q.id][0].version,version);assert.equal(next.revisionHistory[q.id][0].presentation.prompt,old.prompt);assert.deepEqual(next.revisionHistory[q.id][0].presentation.choices,old.choices||null);assert.equal(next.questionVersions[q.id],BIOLOGY_READABILITY_VERSION);
 }
 assert.equal(changed,14);assert.deepEqual(baseline,before);assert.equal(biologyReadableCurrentItems(current,unit),current);
 const repeated=biologyReadableCurrentItems(baseline,unit);for(let i=0;i<current.length;i++)assert.equal(repeated[i],current[i]);
});
test('biology readable overlay excludes original, similar, other units and unexpected versions',()=>{
 for(const id of['s41-u04-b20','s41-u04-b41','s41-u04-t08']){
  const old=baseline.find(q=>q.id===id);
  for(const sourceType of['original','similar']){const rows=[{...old,sourceRef:{type:sourceType}}];assert.equal(biologyReadableCurrentItems(rows,unit),rows);}
  for(const version of[2,'future-lesson']){const rows=[{...old,contentVersion:version}];assert.equal(biologyReadableCurrentItems(rows,unit),rows);}
  const rows=[{...old,status:'review'}];assert.equal(biologyReadableCurrentItems(rows,unit),rows);
 }
 assert.equal(biologyReadableCurrentItems(baseline,'other'),baseline);assert.equal(biologyReadableCurrentItems(null,unit),null);
});
test('biology repeated classroom and daily pool share current objects with their own choice order',async()=>{
 const first=await revisedClassroom(unit,book),second=await revisedClassroom(unit,book),current=biologyReadableCurrentItems(baseline,unit),daily=classroomQuestions(second,current);let linked=0;
 for(const q of first.classroomItems.filter(q=>q.contentVersion===BIOLOGY_READABILITY_VERSION)){
  linked++;assert.equal(second.classroomItems.find(x=>x.id===q.id),q);assert.equal(daily.find(x=>x.id===q.id),q);assert.deepEqual(current.find(x=>x.id===q.id),q);
 }
 assert.equal(linked,10);
 const q=current.find(q=>q.id==='s41-u04-b41');assert.equal(q.answerContract.answer,0);assert.equal(q.choices[0],'항생제 개발에 그 물질의 성질을 연구한다.');assert(q.explanation.includes('첫째 보기'));
});
import{workbook,biologyReadablePriorWorkbook}from'../data/book/s41-u04.workbook.js';
import{art,biologyReadablePriorArt}from'../data/book/s41-u04.workbook-art.js';
import{revisedTextbookPaper}from'./revised-textbook.js';
test('current yeast blank and all answer presentations agree while the earlier question and quick table survive',async()=>{
 const question=workbook.questions.find(q=>q.no===23),old=biologyReadablePriorWorkbook.questions.find(q=>q.no===23);
 assert.equal(question.answer,'㉠ 균류 · ㉡ 기체');assert.equal(question.standard,'4과12-03');assert(question.prompt.includes('반죽이 부풀어요'));assert.equal(old.answer,'㉠ 균류 · ㉡ 한/1');assert(old.prompt.includes('세포'));
 for(let i=0;i<workbook.questions.length;i++)for(const key of Object.keys(biologyReadablePriorWorkbook.questions[i]).filter(k=>k.startsWith('source')||['key','responseContract'].includes(k)))assert.deepEqual(workbook.questions[i][key],biologyReadablePriorWorkbook.questions[i][key]);
 const currentRow=art['quick-1'].match(/<tr><th scope="row">23<\/th><td>빈칸<\/td><td>(.*?)<\/td><\/tr>/),oldRow=biologyReadablePriorArt['quick-1'].match(/<tr><th scope="row">23<\/th><td>빈칸<\/td><td>(.*?)<\/td><\/tr>/);
 assert.equal(currentRow[1],question.answer);assert.equal(oldRow[1],old.answer);
 assert(!workbook.figures.biologyHabitats.includes('한 세포'));assert(workbook.figures.biologyClassCards.includes('사는 곳의 예'));
 for(const key of['pages','teacherStudentPages'])for(let i=0;i<workbook[key].length;i++)assert.deepEqual(workbook[key][i].rail,biologyReadablePriorWorkbook[key][i].rail);
 const paper=await revisedTextbookPaper('s41-u04');for(const mode of['teacher','answers','quick'])assert(paper.workbookPaper({mode}).includes(question.answer),mode);
 assert(!paper.workbookPaper({mode:'student'}).includes(question.answer));
});
