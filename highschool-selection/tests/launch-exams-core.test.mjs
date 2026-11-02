import test from 'node:test';import assert from 'node:assert/strict';
import {evaluateResponse,makeReport,publicQuestions,publicExam,validGrant,fixedEqual,applyReview} from '../../supabase/functions/highselect-exams/core.mjs';
const q=(spec,number=1)=>({number,responseType:spec.type||'input',classification:{domain:'기하',majorUnit:'도형',detailType:'길이'},spec});
test('fractions, decimals, radicals, units and ratios accept equivalent notation without evaluating code',()=>{
 assert.equal(evaluateResponse('0.5',q({type:'input',mode:'fraction-equivalent',answers:['1/2']})),'correct');
 assert.equal(evaluateResponse('sqrt(12)/2',q({type:'input',mode:'quadratic-surd-equivalent',answers:['sqrt(3)']})),'correct');
 assert.equal(evaluateResponse('30000원',q({type:'input',mode:'fraction-equivalent',answers:['30,000'],normalize:{ignoreUnit:true}})),'correct');
 assert.equal(evaluateResponse('22:10',q({type:'input',ratio:true,mode:'fraction-equivalent',answers:['11:5']})),'correct');
 assert.equal(evaluateResponse('process.exit()',q({type:'input',answers:['1']})),'wrong');
});
test('symbolic alternatives are marked for review instead of asserted wrong; blanks remain blank',()=>{
 const question=q({type:'input',answers:['-32ab^5'],algebra:true,manualFallback:true});
 assert.equal(evaluateResponse('-32a*b^{5}',question),'correct');
 assert.equal(evaluateResponse('-32b^5a',question),'review');
 assert.equal(evaluateResponse('',question),'blank');
});
test('sets and ordered lists have different contracts',()=>{
 assert.equal(evaluateResponse('3,1,2',q({type:'unordered_set',answers:['1','2','3']})),'correct');
 assert.equal(evaluateResponse('3,1,2',q({type:'ordered_list',answers:['1','2','3']})),'wrong');
 assert.equal(evaluateResponse('1,1,2',q({type:'unordered_set',answers:['1','2','3']})),'wrong');
});
test('a swapped coordinate group can be accepted only with an explicit variant',()=>{
 const fields=[{slotId:'a-x',groupId:'a'},{slotId:'a-y',groupId:'a'},{slotId:'b-x',groupId:'b'},{slotId:'b-y',groupId:'b'}];
 const slots=fields.map((f,i)=>({...f,answer:['1','0','0','2'][i]}));
 const question={number:1,responseType:'multi_input',fields,spec:{type:'multi_input',mode:'fraction-equivalent',slots,variants:[slots,fields.map((f,i)=>({...f,answer:['0','2','1','0'][i]}))]}};
 assert.equal(evaluateResponse(['0','2','1','0'],question),'correct');
 assert.throws(()=>evaluateResponse(['0'],question));
});
test('student projections and reports never contain a key or original responses',()=>{
 const e={id:'test',title:'시험',mode:'pilot',version:'v1',durationMinutes:110,pages:['SECRET_IMAGE'],questions:[q({type:'input',answers:['SECRET_KEY'],manualFallback:true}),q({type:'input',answers:['2']},2)]};
 const data={exam:publicExam(e),questions:publicQuestions(e),report:makeReport(e,['user response',''])};
 assert.doesNotMatch(JSON.stringify(data),/SECRET|user response|"spec"|"answers"|"responses"/);
 assert.equal(data.report.reviewCount,1);assert.equal(data.report.blankCount,1);assert.equal(data.report.final,false);assert.equal(data.report.cutlineDecision,null);
 assert.throws(()=>makeReport(e,['1']));
});
test('per-exam grants and expiry are rechecked independently of session validity',()=>{
 const s={active:true,expires_at:'2026-11-03T00:00:00Z',exam_grants:['a']},now=Date.parse('2026-11-02T00:00:00Z');
 assert.equal(validGrant(s,'a',now),true);assert.equal(validGrant(s,'b',now),false);assert.equal(validGrant({...s,active:false},'a',now),false);assert.equal(validGrant(s,'a',now+2*86400000),false);
 assert.equal(fixedEqual('abcd','abcd'),true);assert.equal(fixedEqual('abcd','abce'),false);assert.equal(fixedEqual('abc','abcd'),false);
});

test('teacher review resolves only pending responses and recalculates score without keys',()=>{
 const e={id:'test',title:'시험',mode:'pilot',version:'v1',durationMinutes:110,pages:['private'],questions:[q({type:'input',answers:['canonical'],manualFallback:true})]};
 const before=makeReport(e,['alternate']);assert.equal(before.reviewCount,1);const after=applyReview(before,1,'correct');assert.equal(after.correctCount,1);assert.equal(after.reviewCount,0);assert.equal(after.final,true);assert.equal(after.domains[0].correct,1);assert.throws(()=>applyReview(after,1,'wrong'));assert.doesNotMatch(JSON.stringify(after),/canonical|alternate|private/);
});
