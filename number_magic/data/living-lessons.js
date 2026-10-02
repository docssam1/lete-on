/* Exact, renderer-independent state. A picture never decides the mathematics. */
(function(root,factory){
  const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
  else root.NM_LIVING_LESSONS=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  const lessons={
    'N-07':{kind:'ten',rounds:[8,9,7,6]},
    'M-01':{kind:'signed',rounds:[[3,2],[2,4],[2,2]]}
  };
  function create(uid,round){
    const def=lessons[uid];if(!def)throw Error('Unknown living lesson');
    const index=Math.max(0,Math.min(def.rounds.length-1,Math.trunc(round||0)));
    const input=def.rounds[index];
    return {uid,kind:def.kind,round:index,base:def.kind==='ten'?input:0,
      positive:def.kind==='signed'?input[0]:0,negative:def.kind==='signed'?input[1]:0,
      added:0,pairs:0,moved:[],paired:[],prediction:null};
  }
  function snapshot(s){
    const ten=s.kind==='ten',positive=s.positive-s.pairs,negative=s.negative-s.pairs;
    return {...s,answer:ten?10-s.base:s.positive-s.negative,
      total:ten?s.base+s.added:positive-negative,remaining:ten?10-s.base-s.added:Math.min(positive,negative),
      positiveLeft:positive,negativeLeft:negative,
      complete:ten?s.base+s.added===10:Math.min(positive,negative)===0,
      last:s.round===lessons[s.uid].rounds.length-1,rounds:lessons[s.uid].rounds.length};
  }
  function act(s,action,value){
    let next={...s,moved:[...s.moved],paired:[...s.paired]};const v=snapshot(s);
    if(action==='predict'&&Number.isInteger(value))next.prediction=value;
    if(action==='add'&&s.kind==='ten'&&!v.complete){
      const id=value===undefined?[0,1,2,3,4].find(i=>!s.moved.includes(i)):value;
      if(Number.isInteger(id)&&id>=0&&id<5&&!s.moved.includes(id)){next.moved.push(id);next.added++;}
    }
    if(action==='pair'&&s.kind==='signed'&&!v.complete){
      const pair=value===undefined?{positive:Array.from({length:s.positive},(_,i)=>i).find(i=>!s.paired.some(p=>p.positive===i)),negative:Array.from({length:s.negative},(_,i)=>i).find(i=>!s.paired.some(p=>p.negative===i))}:value;
      if(pair&&Number.isInteger(pair.positive)&&Number.isInteger(pair.negative)&&pair.positive>=0&&pair.positive<s.positive&&pair.negative>=0&&pair.negative<s.negative&&!s.paired.some(p=>p.positive===pair.positive||p.negative===pair.negative)){
        next.paired.push({...pair});next.pairs++;
      }
    }
    if(action==='undo'){if(s.kind==='ten'){next.added=Math.max(0,s.added-1);next.moved.pop();}else{next.pairs=Math.max(0,s.pairs-1);next.paired.pop();}}
    if(action==='reset')next=create(s.uid,s.round);
    if(action==='next')next=create(s.uid,(s.round+1)%lessons[s.uid].rounds.length);
    return next;
  }
  return {has:uid=>!!lessons[uid],create,snapshot,act};
});
