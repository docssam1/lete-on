// 선생님 확인(v2/check.js): 이 기기 기록에서 「확인 필요」를 고르고, 선생님 판정이 붙으면 빠진다
import test from 'node:test';
import assert from 'node:assert/strict';

const mem = {};
globalThis.localStorage = { getItem: (k) => mem[k] ?? null, setItem: (k, v) => { mem[k] = String(v); } };
const { records, needs, countNeeds } = await import('./check.js');

test('문항 ID의 새 수업과 예전 기록·교사 의견을 함께 보존하고 빈칸별 질문을 찾는다',async()=>{
 const previous=mem['sciLab.deck'],{lookupRecordQuestion}=await import('./check.js'),q={id:'c22-s32-u01-t01',prompt:'물체와 물질 두 빈칸',answerContract:{type:'cloze',blanks:[{answer:'물체'},{answer:'물질'}]}};
 const unit='c22-s32-u01',slide='item:'+q.id,key='test:item:'+q.id+':blank:1';
 mem['sciLab.deck']=JSON.stringify({[unit+':grade:test1']:{at:1,tries:1,item:'old',boxes:[{k:'test1',st:'review',text:'예전 답'}]},[unit+':grade:'+slide]:{at:2,tries:1,item:q.id,boxes:[{k:key,st:'review',text:'내 새 답'}]},[unit+':teacher:'+slide+':'+key]:{v:'ok',note:'두 번째 빈칸을 확인함',at:3}});
 const rows=records([unit]);assert.equal(rows.length,2);assert.equal(rows[0].teacher.note,'두 번째 빈칸을 확인함');assert.equal(rows[1].text,'예전 답');const found=lookupRecordQuestion(rows[0],{check:[]},[q]);assert.equal(found.q,q.prompt);assert.equal(found.a,'물질');assert.equal(found.where,'교과 확인 문제 · 2번 빈칸');assert.equal(countNeeds([unit]),1);mem['sciLab.deck']=previous;
});

test('확인 필요 = 기기 판정 review 이고 선생님 판정이 아직 없는 칸', () => {
  mem['sciLab.deck'] = JSON.stringify({
    's41-u01:concl0': '같은 극은 밀어요',
    's41-u01:grade:concl': { at: 2, tries: 2, boxes: [{ k: 'concl0', st: 'review', text: '같은 극은 밀어요' }] },
    's41-u01:grade:hypo': { at: 1, tries: 1, boxes: [{ k: 'hypo', st: 'ok', text: '같은 극이면 뜰 것' }] },
    's41-u01:grade:challenge': { at: 3, tries: 1, boxes: [{ k: 'creative', st: 'review', text: '자석 빗자루' }] },
    's41-u01:teacher:challenge:creative': { v: 'ok', note: '좋아요', at: 4 },
    's41-u02:grade:wonder': { at: 5, tries: 2, boxes: [{ k: 'wonder', st: 'review', text: '마개가 튀어나와요' }] },
  });
  const all = records(['s41-u01']);
  assert.equal(all.length, 3);
  assert.deepEqual(all.map((r) => r.k), ['creative', 'concl0', 'hypo']);   // 최근 것부터
  assert.deepEqual(all.filter(needs).map((r) => r.k), ['concl0']);
  assert.equal(all[0].teacher.note, '좋아요');
  assert.equal(countNeeds(['s41-u01']), 1);
  assert.equal(countNeeds(['s41-u01', 's41-u02']), 2);
  assert.equal(countNeeds(null), 2);
});

test('학기 평가의 전체 문항 ID와 교사 의견도 다른 기록을 보존하며 찾는다',()=>{
 const original=mem['sciLab.deck'];
 mem['sciLab.deck']=JSON.stringify({
  's31-fin:grade:daily-s31-fin-f1-15':{at:8,tries:1,item:'s31-fin-f1-15',boxes:[{k:'daily',st:'review',text:'내 설계 설명'}]},
  's31-mid:grade:daily-s31-mid-o2-03':{at:7,tries:1,item:'s31-mid-o2-03',boxes:[{k:'daily',st:'review',text:'판자가 반듯해요'}]},
  's31-fin:teacher:daily-s31-fin-f1-15:daily':{v:'ok',note:'물과 연결한 설명을 확인함',at:9}
 });
 const rows=records(['s31-fin','s31-mid']);assert.equal(rows.length,2);assert.equal(rows[0].item,'s31-fin-f1-15');assert.equal(rows[0].teacher.note,'물과 연결한 설명을 확인함');assert.equal(countNeeds(['s31-fin']),0);assert.equal(countNeeds(['s31-mid']),1);assert.equal(JSON.parse(mem['sciLab.deck'])['s31-mid:grade:daily-s31-mid-o2-03'].boxes[0].text,'판자가 반듯해요');
 mem['sciLab.deck']=original;
});
