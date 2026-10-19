import test from'node:test';import assert from'node:assert/strict';import{judgeShort}from'./judge.js';import{gradeDaily}from'./daily-grade.js';
test('단답의퍼센트/섭씨/화씨는문장부호와달리보존하고명시한단위없는답만인정한다',()=>{
 for(const [input,accepted]of[['73℃',['73%']],['73%',['73℃']],['73℉',['73℃']],['73°C',['73%']],['73',['73%']]])assert.equal(judgeShort(input,accepted).st,'no',input);
 for(const [input,accepted]of[['73％',['73%']],['73퍼센트',['73%']],['73%입니다',['73%']],['73°C',['73℃']],['73° C',['73℃']],['73°F',['73℉']],['73',['73%','73']],['응결해요',['응결']],['(가) ㄴ, (나) ㄹ',['(가) ㄴ (나) ㄹ']]])assert.equal(judgeShort(input,accepted).st,'ok',input);
 const item={answerContract:{type:'short-text',answer:'73%',accepted:['73%','73']}};assert.notEqual(gradeDaily(item,'73℃').status,'correct');assert.equal(gradeDaily(item,'73').status,'correct');assert.equal(gradeDaily(item,'73%').status,'correct');
});
