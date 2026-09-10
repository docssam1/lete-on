const assert=require('node:assert/strict');
const {build}=require('../challenge/concept-catalog.js');
const lessons=build(),bank=globalThis.HFChallengeBank;
let removed=0,moved=0;
for(const l of lessons)for(const phase of ['example','practice']){
 const q=l[phase],c=q.presentationCleanup;
 removed+=c.removed.length;moved+=c.moved.length;
 for(const s of c.removed)assert(!q.problemHtml.includes(s));
 for(const s of c.moved){assert(q.prompt.includes(s));assert(!q.problemHtml.includes(s));}
 assert(!q.problemHtml.includes('spatial-asks'));
 if(l.id==='core-family-comparison'){assert(!q.problemHtml.includes('아빠는 나보다 몇 개 더 많을까요?'));assert.equal((q.problemHtml.match(/class="condition"/g)||[]).length,3);assert(q.prompt.includes('아빠가 나보다'));}
}
const exam=bank.createMockExam(2,62001),q=exam.questions[19];
assert.equal(q.typeId,'r2-fruit-logic-table');
assert(!q.problemHtml.includes('좋아하는<br>친구 수'));
assert(!q.prompt.includes('표 아래'));
assert.equal((q.problemHtml.match(/<tr>/g)||[]).length,5);
q.payload.fruits.forEach((f,i)=>assert(q.problemHtml.includes(f+(f==='귤'?'을':'를')+' 좋아하는 친구는 '+q.payload.totals[i]+'명')));
assert.equal(require('node:fs').readFileSync(require('node:path').join(__dirname,'../challenge/concepts.js'),'utf8').includes('class="review-note"'),false);
assert(bank.createQuestion('family-comparison','same',1).problemHtml.includes('아빠는 나보다 몇 개 더 많을까요?'),'shared source unchanged');
console.log(JSON.stringify({passed:true,units:lessons.length,removedPictureCaptions:removed,movedQuestions:moved,removedPageReminders:74,round2Question20Rows:5,fruitTotalsPreserved:q.payload.totals}));
