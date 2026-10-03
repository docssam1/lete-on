import test from 'node:test';
import assert from 'node:assert/strict';
import {humidifierModel} from './lab-humidifier.js';
import {LAB_BATTLE_ROUNDS,battleVerdict,validBattleRow} from './lab-battle-model.js';
import {judgeText} from './judge.js';
import {judge} from '../data/units/s42-u02.judge.js';
test('냉각·물 온도 비교와 같은 조건 재현을 기록에서 판정한다',()=>{
 const rounds=LAB_BATTLE_ROUNDS['s42-u02'];const answers=[2,0,1];
 rounds.forEach((round,i)=>{const rows=round.targets.map(t=>({...t,...humidifierModel(t.water,t.surface)}));assert.deepEqual(battleVerdict('s42-u02',round,rows,[answers[i],answers[i]]).ok,[true,true]);assert.deepEqual(battleVerdict('s42-u02',round,rows,[(answers[i]+1)%3,(answers[i]+1)%3]).ok,[false,false]);});
 const r={...rounds[0].targets[0],...humidifierModel('따뜻한 물','실온')};assert.equal(validBattleRow('s42-u02',{...r,stage:NaN}),false);assert.equal(validBattleRow('s42-u02',{...r,stage:2}),false);assert.equal(battleVerdict('s42-u02',rounds[0],[r,null],[2,2]),null);
});
test('틀린 예상도 조건과 예상 결과를 이으면 가설이며, 응결 부정문은 정답이 아니다',()=>{
 assert.equal(judgeText('판을 차갑게 하면 물방울이 사라질 것이다.',judge['deck:hypo']).st,'ok');
 assert.notEqual(judgeText('수증기는 차가운 컵에서 물로 변하지 않는다.',judge['deck:concl0']).st,'ok');
 assert.notEqual(judgeText('컵에 구멍이 나서 물이 새어 나왔다.',judge['deck:concl0']).st,'ok');
 assert.equal(judgeText('공기의 수증기가 차가운 컵에서 식어 물방울이 되었다.',judge['deck:concl0']).st,'ok');
 assert.throws(()=>humidifierModel('unknown','실온'),RangeError);
});
