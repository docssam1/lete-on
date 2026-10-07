/* Exact, renderer-independent state. A picture never decides the mathematics. */
(function(root,factory){
  const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
  else root.NM_LIVING_LESSONS=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';
  const lessons={
    /* N-07(2026-10-06) — 교재 G1-7호 "주사위·개구리의 위치(수직선)·도미노"에 맞춰 수직선 뛰기로. 0에서 주사위 수 a 만큼 뛴 뒤
       + 면 c칸 앞으로, − 면 c칸 되돌아온다. 모든 점은 0~10 안. */
    'N-07':{kind:'hop',rounds:[[4,'+',3],[6,'-',2],[3,'+',5],[5,'-',3]]},   /* 주사위 두 개 — 모두 1~6 */
    /* 보관 — 예전 N-07 의 10 짝꿍 3D 체험. 10 짝꿍을 가르치는 유닛이 생기면 그 id 로 옮긴다(검사기 check-living-lessons 가 계속 검산). */
    '__ten':{kind:'ten',rounds:[8,9,7,6]},
    'M-01':{kind:'signed',rounds:[[3,2],[2,4],[2,2]]},
    'A-02':{kind:'makeTen',rounds:[[8,7],[9,6],[7,5],[6,8]]},
    'M-02':{kind:'numberLine',rounds:[[-2,'+',-3],[2,'-',-3],[3,'+',2],[-2,'-',3],[3,'+',-3]]},
    'T-DV4':{kind:'commonProduct',rounds:[[6,8],[4,6],[6,9],[3,4]]}
  };
  function create(uid,round){
    const def=lessons[uid];if(!def)throw Error('Unknown living lesson');
    const index=Math.max(0,Math.min(def.rounds.length-1,Math.trunc(round||0)));
    const input=def.rounds[index];
    if(def.kind==='hop')return {uid,kind:'hop',round:index,input:[...input],pos:0,hops:[],prediction:null};
    if(!['ten','signed'].includes(def.kind))return {uid,kind:def.kind,round:index,input:[...input],phase:0,moved:[],prediction:null,transferGuess:null,transferChecked:false};
    return {uid,kind:def.kind,round:index,base:def.kind==='ten'?input:0,
      positive:def.kind==='signed'?input[0]:0,negative:def.kind==='signed'?input[1]:0,
      added:0,pairs:0,moved:[],paired:[],prediction:null};
  }
  /* 수직선 뛰기: 1단계는 0 → a(주사위), 2단계는 a → a ± c. hops = 지금까지 뛴 [from,to] 들(한 칸씩). */
  function hopView(s){
    const [a,op,c]=s.input,answer=op==='+'?a+c:a-c,stage=s.hops.length<a?1:2;
    const target=stage===1?a:answer,dir=stage===1?1:(op==='+'?1:-1);
    const done=s.hops.length===a+c;
    return {...s,a,op,c,answer,stage,target,dir,complete:done,total:s.pos,
      remaining:done?0:(stage===1?a-s.hops.length:c-(s.hops.length-a)),
      rounds:lessons[s.uid].rounds.length,last:s.round===lessons[s.uid].rounds.length-1};
  }
  function snapshot(s){
    if(s.kind==='hop')return hopView(s);
    if(!['ten','signed'].includes(s.kind)){
      const [a,b,c]=s.input,make=s.kind==='makeTen',line=s.kind==='numberLine';
      const factors=n=>Array.from({length:n},(_,i)=>i+1).filter(d=>n%d===0);
      const common=!make&&!line?factors(a).filter(d=>b%d===0):[],greatest=common.length?common[common.length-1]:0;
      const answer=make?a+b:line?a+(b==='+'?c:-c):a*b;
      const point=line?(s.phase===0?0:s.phase<3?a:answer):null;
      const transferInput=make?[[9,7],[8,6],[7,8],[6,5]][s.round]:line?[[2,'-',-4],[-1,'+',-4],[-3,'-',2],[1,'+',3],[-4,'+',3]][s.round]:[[90,3],[40,2],[72,6],[24,2]][s.round];
      const transferAnswer=make?transferInput[0]+transferInput[1]:line?transferInput[0]+(transferInput[1]==='+'?transferInput[2]:-transferInput[2]):transferInput[0]/transferInput[1];
      return {...s,a,b,c,answer,total:make?a+b:line?point:a*b,complete:s.phase===3,
        remaining:make?10-a-s.moved.length:3-s.phase,needed:make?10-a:0,left:make?b-s.moved.length:0,
        greatest,least:greatest?a*b/greatest:0,factorsA:greatest?factors(a):[],factorsB:greatest?factors(b):[],
        point,rawDirection:line?Math.sign(c):0,direction:line?Math.sign(b==='+'?c:-c):0,
        rounds:lessons[s.uid].rounds.length,last:s.round===lessons[s.uid].rounds.length-1,
        transferInput,transferAnswer,transferPassed:s.transferChecked&&s.transferGuess===transferAnswer};
    }
    const ten=s.kind==='ten',positive=s.positive-s.pairs,negative=s.negative-s.pairs;
    return {...s,answer:ten?10-s.base:s.positive-s.negative,
      total:ten?s.base+s.added:positive-negative,remaining:ten?10-s.base-s.added:Math.min(positive,negative),
      positiveLeft:positive,negativeLeft:negative,
      complete:ten?s.base+s.added===10:Math.min(positive,negative)===0,
      last:s.round===lessons[s.uid].rounds.length-1,rounds:lessons[s.uid].rounds.length};
  }
  function act(s,action,value){
    if(s.kind==='hop'){
      let n={...s,input:[...s.input],hops:s.hops.map(h=>[...h])};const v=hopView(s);
      if(action==='predict'&&Number.isInteger(value))n.prediction=value;
      if(action==='hop'&&!v.complete){const to=s.pos+v.dir;if(to>=0&&to<=10){n.hops.push([s.pos,to]);n.pos=to;}}
      if(action==='undo'&&s.hops.length){n.hops.pop();n.pos=n.hops.length?n.hops[n.hops.length-1][1]:0;}
      if(action==='reset')n=create(s.uid,s.round);
      if(action==='next')n=create(s.uid,(s.round+1)%lessons[s.uid].rounds.length);
      return n;
    }
    if(!['ten','signed'].includes(s.kind)){
      let n={...s,input:[...s.input],moved:[...s.moved]};const v=snapshot(s);
      if(action==='predict'&&Number.isInteger(value))n.prediction=value;
      if(action==='add'&&s.kind==='makeTen'&&s.phase<3&&v.remaining>0){
        const id=value===undefined?Array.from({length:v.b},(_,i)=>i).find(i=>!s.moved.includes(i)):value;
        if(Number.isInteger(id)&&id>=0&&id<v.b&&!s.moved.includes(id)){n.moved.push(id);n.phase=n.moved.length===v.needed?2:1;}
      }
      if(action==='advance'&&s.phase<3){
        if(s.kind==='makeTen'&&v.remaining>0)return act(s,'add');
        n.phase=Math.min(3,s.phase+1);
      }
      if(action==='undo'){
        n.transferChecked=false;n.transferGuess=null;
        if(s.kind==='makeTen'&&s.phase<3){n.moved.pop();n.phase=n.moved.length?1:0;}
        else n.phase=Math.max(0,s.phase-1);
      }
      if(action==='transfer'&&v.complete&&Number.isInteger(value)){n.transferGuess=value;n.transferChecked=true;}
      if(action==='reset')n=create(s.uid,s.round);
      if(action==='next')n=create(s.uid,(s.round+1)%lessons[s.uid].rounds.length);
      return n;
    }
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
