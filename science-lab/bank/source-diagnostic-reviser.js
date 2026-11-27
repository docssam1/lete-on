// 정확한 이전 원문에만 복습 규칙과 필요한 비교 조건을 적용한다.
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),clone=x=>JSON.parse(JSON.stringify(x));
export function sourceDiagnosticReviser(unit,revision){
 const cache=new WeakMap();
 return function reviewedSourceDiagnostics(requestedUnit,rows){
  if(requestedUnit!==unit||!Array.isArray(rows))return rows;let changed=false;
  const next=rows.map(q=>{const patch=revision.patches.find(p=>same(p.previous,q));if(!patch)return q;changed=true;if(cache.has(q))return cache.get(q);
   const history=clone(q.previousVersions||[]),snapshot=version=>({...clone(q),version,snapshotKind:'full-question'});
   // Unchanged registered originals also restore earlier unversioned attempts.
   if(revision.legacyUnversioned&&!history.length&&(q.contentVersion||1)!==1)history.push(snapshot(1));
   history.push(snapshot(q.contentVersion||1));
   let current={...q,contentVersion:revision.version,diagnosticOverride:{version:revision.version,distractors:patch.distractors?clone(patch.distractors):null,typed:patch.typed?clone(patch.typed):null,cloze:null,cells:null},previousVersions:history};
   if(patch.clarification){
    const previous={...clone(current),version:current.contentVersion,snapshotKind:'full-question'},c=patch.clarification;
    current={...current,contentVersion:c.version,sourceContextBlocks:[...clone(current.sourceContextBlocks),clone(c.context)],diagnosticOverride:{...current.diagnosticOverride,version:c.version},previousVersions:[...history,previous]};
   }
   cache.set(q,current);return current;
  });return changed?next:rows;
 };
}
