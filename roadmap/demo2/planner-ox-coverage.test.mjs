import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInThisContext} from 'node:vm';

const read = f => readFileSync(new URL(f,import.meta.url),'utf8');
for (const f of ['planner-weekly-model','planner-book-pace','planner-ox-model']) runInThisContext(read(f+'.js'));
const catalog=JSON.parse(read('planner-ox-catalog.json'));
const extra=JSON.parse(read('planner-ox-supplements.json')).units;
const {apply,state,itemId}=globalThis.PlannerOxModel;

test('every weakness on every completed printed set gets a different, same-type question seven days later',()=>{
  let total=0, supplementalTypes=0;
  const allExtra=new Set();
  for(const unit of catalog.units) {
    unit.supplements=extra[unit.id]||[];
    const setsByType=new Map();
    for(const [set,items] of Object.entries(unit.sets)){
      for(const q of items){
        if(!setsByType.has(q.typeId)) setsByType.set(q.typeId,new Set());
        setsByType.get(q.typeId).add(set);
      }
    }
    const needed=[...setsByType].filter(([,sets])=>sets.size===1).map(([id])=>id);
    assert.deepEqual(unit.supplements.map(s=>s.typeId).sort(),needed.sort(),unit.id);
    for(const s of unit.supplements){
      assert.ok(s.prompt.trim() && s.check.trim());assert.ok(!allExtra.has(s.prompt));allExtra.add(s.prompt);
    }
    supplementalTypes+=needed.length;
  }
  for(const unit of catalog.units){
    for(const [set,items] of Object.entries(unit.sets)){
      // Completing the whole set prevents the allocator from borrowing an
      // unchecked neighbour on the same worksheet to pass the coverage check.
      const marks=Object.fromEntries(items.map(q=>[q.number,'X']));
      const first=apply(catalog,[],{kind:'initial',unitId:unit.id,set,marks,date:'2026-11-08'},'2026-11-08');
      const {tasks}=state(catalog,first,'2026-11-08');
      assert.equal(tasks.length,new Set(items.map(q=>q.typeId)).size);
      for(const q of items){
        const t=tasks.find(t=>t.sourceIds.includes(itemId(unit,set,q.number)));
        assert.ok(t?.itemId);assert.notEqual(t.set,set);
        assert.equal(t.due,'2026-11-15');assert.equal(t.typeId,q.typeId);
        if(t.set==='s') assert.ok(unit.supplements.find(s=>s.typeId===q.typeId));
        else assert.equal(unit.sets[t.set].find(r=>r.number===t.number).typeId,q.typeId);
        total++;
      }
      assert.equal(new Set(tasks.map(t=>t.itemId)).size,tasks.length);
    }
  }
  assert.equal(total,5325);assert.equal(supplementalTypes,244);
});
