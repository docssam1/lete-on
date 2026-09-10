// Reference solvers use the visible givens, never payload.answer/ways/parts.
const assert=require('assert/strict');
require('../challenge/challenge-bank.js');
const bank=globalThis.HFChallengeBank;
function arrangements(values){if(!values.length)return [[]];return values.flatMap((v,i)=>arrangements(values.filter((_,j)=>i!==j)).map(a=>[v,...a]));}
function one(values){assert.equal(values.length,1,'independent solution is not unique');return values[0];}
function solve(p){
  if(p.typeId&&p.typeId.startsWith('mock-'))return require('./challenge-more-solvers.cjs').solve(p);
  if(p.typeId.startsWith('priority-'))return require('./challenge-priority-solvers.cjs').solve(p);
  if(p.typeId.startsWith('replace-'))return require('./challenge-replacement-solvers.cjs').solve(p);
  switch(p.typeId){
    case 'line-position-total': {
      const all=Array.from({length:p.before+p.after+1},(_,i)=>i+1);
      return p.difficulty==='easy'?all.length:all.slice(0,all.length-p.otherBackRank).length;
    }
    case 'split-merge-chain':return p.panels.map(panel=>{
      const known=Object.fromEntries(panel.givenKeys.map(k=>[k,panel.nodes[k]]));
      const eq=panel.kind==='pair'?[['total','a','b']]:panel.kind==='split4'?[['left','a','b'],['right','c','d'],['total','left','right']]:[['p0','a','b'],['p1','b','c'],['total','p0','p1']];
      for(let pass=0;pass<8;pass++)for(const [t,a,b]of eq){if(known[a]!==undefined&&known[b]!==undefined)known[t]=known[a]+known[b];else if(known[t]!==undefined&&known[a]!==undefined)known[b]=known[t]-known[a];else if(known[t]!==undefined&&known[b]!==undefined)known[a]=known[t]-known[b];}
      return panel.blankKeys.map(k=>{assert.notEqual(known[k],undefined);return known[k];});
    });
    case 'animal-race-order':return one(arrangements(p.participants).filter(order=>p.relations.every(r=>{
      const pos=n=>order.indexOf(n)+1;
      return r.type==='rank'?pos(r.person)===r.rank:r.type==='before'?pos(r.first)<pos(r.second):r.type==='between'?pos(r.first)<pos(r.middle)&&pos(r.middle)<pos(r.last):pos(r.behind)-pos(r.ahead)===1;
    })));
    case 'apartment-floor-order':return one(arrangements(p.people).filter(order=>p.relations.every(r=>{
      const floor=n=>order.indexOf(n)+1;
      return r.type==='floorSet'?r.floors.includes(floor(r.person)):r.type==='top'?floor(r.person)===5:floor(r.upper)-floor(r.lower)===1;
    })));
    case 'card-sum-count': {
      const combinations=new Set();
      for(let mask=1;mask<2**p.cards.length;mask++){
        const choice=p.cards.filter((_,i)=>mask&(1<<i)).sort((a,b)=>a-b);
        if(choice.reduce((s,v)=>s+v,0)===p.target)combinations.add(choice.join(','));
      }return combinations.size;
    }
    case 'total-difference':return [(p.total+p.difference)/2,(p.total-p.difference)/2];
    case 'family-comparison':{const me=30,sibling=me-p.siblingLess,dad=sibling+p.dadAboveSibling;return dad-me;}
    case 'mountain-digit-count':{
      let count=0;
      for(let peak=1;peak<=p.figure;peak++)for(let i=1;i<peak*2;i++)if(Math.min(i,peak*2-i)===p.digit)count++;
      assert(p.figure<=8);return count;
    }
    case 'triangle-number-rule':return p.top+p.left-p.center;
    case 'rotated-grid-pair':{
      const results=[];
      const encode=cells=>cells.map(([r,c])=>r*3+c).sort().join(',');
      const transforms=[(r,c)=>[r,c],(r,c)=>[c,2-r],(r,c)=>[2-r,2-c],(r,c)=>[2-c,r]];
      for(let a=0;a<6;a++)for(let b=a+1;b<6;b++)if(transforms.some(t=>encode(p.options[a].map(([r,c])=>t(r,c)))===encode(p.options[b])))results.push([a+1,b+1]);
      return one(results);
    }
    case 'cyclic-picture-pattern':{
      const shapes=[],colors=[];
      while(shapes.length<p.through)shapes.push(...p.pattern);
      while(colors.length<p.position)colors.push(...p.colors);
      return [`${colors[p.position-1]} ${shapes[p.position-1]}`,shapes.slice(0,p.through).filter(x=>x===p.target).length];
    }
    case 'number-property-filter':return p.options.filter(v=>{
      const [t,o]=String(v).split('').map(Number);
      return p.rule==='even-ones-larger'?o%2===0&&o>t:p.rule==='odd-digit-sum'?o%2===1&&t+o>=10:v<70&&t===o;
    });
    case 'balance-weight-order':{
      const pear=Array(p.berriesPerPear).fill('berry');
      const apple=Array(p.pearsPerApple).fill(pear).flat();
      return [apple.length,[...Array(p.appleCount).fill(apple).flat(),...Array(p.pearCount).fill(pear).flat()].length];
    }
    case 'inverse-story-problem':{
      const v=p.values,answers=[];
      for(let n=0;n<150;n++){
        const valid=p.schema==='relation'?n-v.gap*2===v.smaller:p.schema==='birds'?v.initial-n+v.arrive===v.final:p.schema==='bus'?n-v.off1+v.on1-v.off2===v.final:n-v.ate+v.added===v.final;
        if(valid)answers.push(n);
      }return one(answers);
    }
    case 'arrow-number-move':{
      let current=p.missing==='start'?p.end:p.start;
      const step=p.verticalStep??10,delta={R:1,L:-1,U:-step,D:step},moves=p.missing==='start'?[...p.moves].reverse():p.moves;
      for(const move of moves)current+=delta[move]*(p.missing==='start'?-1:1);
      return current;
    }
    case 'symbol-equation':{const circle=p.sum1-p.constant,diamond=p.sum2-circle,triangle=diamond-p.diff;return circle+triangle;}
    case 'minimum-sum-pyramid':{
      const tops=arrangements(p.cards).map(row=>{while(row.length>1)row=row.slice(1).map((v,i)=>v+row[i]);return row[0];});
      const min=Math.min(...tops),max=Math.max(...tops);return p.operation==='sum'?max+min:max-min;
    }
    case 'cube-count-fill':{
      const occupied=[],empty=[],max=Math.max(...p.heights.flat());
      for(let z=0;z<max;z++)for(let x=0;x<2;x++)for(let y=0;y<2;y++)(z<p.heights[x][y]?occupied:empty).push([x,y,z]);
      assert(p.heights[0][0]>=p.heights[1][0]&&p.heights[0][0]>=p.heights[0][1]&&p.heights[1][1]<=p.heights[1][0]&&p.heights[1][1]<=p.heights[0][1]);
      return [occupied.length,empty.length];
    }
    case 'rectangle-count':{
      // Four complete boundary paths; interior edges may be absent.
      const segments=p.edges.map(e=>{const [kind,x,y]=e.split(':');return kind==='h'?[[+x,+y],[+x+1,+y]]:[[+x,+y],[+x,+y+1]];});
      const segmentExists=(a,b)=>segments.some(([c,d])=>JSON.stringify([a,b])===JSON.stringify([c,d]));
      const counts=[0,0];
      for(let width=1;width<=p.cols;width++)for(let height=1;height<=p.rows;height++)for(let x=0;x+width<=p.cols;x++)for(let y=0;y+height<=p.rows;y++){
        const boundaries=[];
        for(let i=0;i<width;i++)boundaries.push([[x+i,y],[x+i+1,y]],[[x+i,y+height],[x+i+1,y+height]]);
        for(let i=0;i<height;i++)boundaries.push([[x,y+i],[x,y+i+1]],[[x+width,y+i],[x+width,y+i+1]]);
        if(boundaries.every(([a,b])=>segmentExists(a,b))){counts[1]++;if(width===height)counts[0]++;}
      }return counts;
    }
    case 'four-cell-code':{
      const cells=Number(p.encode).toString(2).padStart(4,'0').split('').reverse().flatMap((c,i)=>c==='1'?[i+1]:[]);
      return [cells,parseInt([...p.shown].reverse().map(Boolean).map(Number).join(''),2)];
    }
    default:throw new Error('Missing independent solver '+p.typeId);
  }
}
let independentChecks=0,negativeChecks=0;
for(const type of bank.listTypes())for(const level of bank.difficulties)for(let seed=1;seed<=35;seed++){
  const q=bank.createQuestion(type.id,level,seed*149);
  assert.deepEqual(solve(q.payload),q.answer,`${type.id} ${level} ${seed}`);independentChecks++;
  const mutated=JSON.parse(JSON.stringify(q.payload));mutated.answer=Array.isArray(mutated.answer)?[]:-999;
  assert.equal(type.validate(mutated),false,'wrong answer accepted: '+type.id);negativeChecks++;
  assert.deepEqual(type.enumerate(mutated),type.enumerate(q.payload),'candidate depends on stored answer: '+type.id);
}
for(const round of [1]){
  const exam=bank.createMockExam(round,62001);
  assert.equal(new Set(exam.questions.map(q=>q.typeId)).size,20,'duplicate standalone type');
  for(const q of exam.questions){let expected=q.subquestions?q.subquestions.map(s=>solve(s.payload)):solve(q.payload);if(q.responsePart!==undefined)expected=expected[q.responsePart];assert.deepEqual(expected,q.answer,`round${round} q${q.number}`);independentChecks++;}
}
assert.equal(solve({typeId:'minimum-sum-pyramid',cards:[4,2,8,7],operation:'sum'}),84);
assert.equal(solve({typeId:'minimum-sum-pyramid',cards:[4,2,8,7],operation:'difference'}),18);
console.log(JSON.stringify({passed:true,independentChecks,negativeChecks,fixture:'4,2,8,7: sum84 difference18',types:bank.listTypes().length}));
module.exports={solve,arrangements};
