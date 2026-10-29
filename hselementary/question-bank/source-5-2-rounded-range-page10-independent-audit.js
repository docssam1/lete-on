'use strict';
const assert=require('node:assert/strict');
const a=require('./source-5-2-rounded-range-e4.js'),b=require('./source-5-2-rounded-range-e42.js'),c=require('./source-5-2-rounded-range-e43.js'),d=require('./source-5-2-rounded-range-e44.js');
const down=(n,u)=>n-n%u,up=(n,u)=>down(n,u)+(n%u?u:0),round=(n,u)=>down(n,u)+(2*(n%u)>=u?u:0);let checked=0;
for(let v=0;v<3;v++)for(const level of [-1,0,1]){
 const exp=a.getQuestion('5-2-u1-e4-exploration-rounded-range',v,level),ex1=a.getQuestion('5-2-u1-e4-example-1',v,level),ex2=b.getQuestion(v,level),ex3=c.getQuestion(v,level),ex4=d.getQuestion(v,level);
 const e=exp.answerModel,found=[];for(let n=e.ceil-200;n<=e.ceil+200;n++)if(up(n,100)===e.ceil&&down(n,100)===e.floor&&round(n,100)===e.round)found.push(n);assert.equal(found.length,e.count);assert.equal(found[0],e.intersectionStart);assert.equal(found.at(-1),e.intersectionEnd);
 const m=ex1.answerModel,candidates=[];for(let n=m.minimum-10;n<=m.maximum;n++)if(round(n,1000)===m.target&&down(n,100)===round(n,100)&&up(n,10)===round(n,10))candidates.push(n);assert.equal(candidates[0],m.minimum);
 const n=ex2.answerModel,nums=[];for(let x=1;x<n.upperExclusive+100;x++)if(round(x/6,10)===n.firstTarget&&round(x/4,10)===n.secondTarget)nums.push(x);assert.equal(nums[0],n.minimum);assert.equal(nums.at(-1),n.upperExclusive-1);assert.equal(nums.length,n.upperExclusive-n.minimum);
 const p=ex3.answerModel,large=[];for(let sum=p.sumRange[0];sum<p.sumRange[1];sum++)for(let diff=p.differenceRange[0];diff<p.differenceRange[1];diff++){if((sum+diff)%2===0)large.push((sum+diff)/2)}assert.equal(Math.min(...large),p.minimum);assert.equal(Math.max(...large),p.upperExclusive-1);
 const model=ex4.questionModel,res=ex4.answerModel,gaps=model.male.map((x,i)=>Math.abs(x-model.female[i]));assert.equal(model.years[gaps.indexOf(Math.max(...gaps))],res.year);
 const actual=[];for(let male=res.maleShown-50;male<res.maleShown+50;male++)for(let female=res.femaleShown;female<res.femaleShown+100;female++)actual.push(Math.abs(male-female));assert.equal(Math.min(...actual),res.minimum);assert.equal(Math.max(...actual),res.maximum);assert.equal(res.lowerExclusive,res.minimum-1);assert.equal(res.upperExclusive,res.maximum+1);
 assert.match(ex4.prompt,/그래프에 표시된 남녀 인구수의 차가 가장 큰 해/);assert.match(ex4.prompt,/가상 마을/);assert.doesNotMatch(ex4.prompt,/id="e44-chart/);assert.doesNotMatch(ex4.answerVisual,/id="e44-chart/);assert.match(ex4.prompt,/aria-label=/);for(const year of model.years)assert.ok(ex4.prompt.includes(`${year}년 여자`));
 for(const q of [exp,ex1,ex2,ex3,ex4])assert.equal(q.publisherAnswerVerified,false);checked+=5;
}
assert.equal(checked,45);console.log('page 10: 45 variants checked through independent rounding enumeration, graph ranges, and accessible SVG labels');
