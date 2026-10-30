"use strict";
const assert=require('node:assert/strict'),api=require('./source-5-2-u3-page24-example11-synthetic.js');
for(let i=0;i<3;i++)for(const d of [-1,0,1]){const m=api.derive(i),q=api.build(i,d),[a,b,c]=m.points,[base,bc,ca]=m.sides;assert(m.area>0);assert(base+bc>ca&&base+ca>bc&&bc+ca>base);const projection=(ca*ca-bc*bc+base*base)/(2*base),height=Math.sqrt(ca*ca-projection*projection);assert(Math.abs((c[0]-a[0])-projection)<1e-8);assert(Math.abs(Math.abs(c[1]-a[1])-height)<1e-8);assert(q.answerVisual.includes('<circle'));assert.equal((q.answerVisual.match(/stroke-dasharray/g)||[]).length,2);assert(q.prompt.includes('u3ex11-work'));assert(!q.prompt.includes('정답'));}
assert.equal(api.generate({generatorKey:api.key,sourceVerified:false,reviewLocked:true},0,0,0,0),null);console.log('Three distinct synthetic triangles: nondegenerate SSS construction and answer arcs verified');
const mission=require('./source-5-2-u3-page25-mission2-copy-synthetic.js');
const normalized=model=>model.sides.map(side=>side/Math.max(...model.sides)).sort((a,b)=>a-b);
for(let i=0;i<3;i++)for(let j=0;j<3;j++){const a=normalized(api.derive(i)),b=normalized(mission.derive(j));assert(a.some((v,k)=>Math.abs(v-b[k])>1e-6),'example and mission triangles must not be similar duplicates');}
