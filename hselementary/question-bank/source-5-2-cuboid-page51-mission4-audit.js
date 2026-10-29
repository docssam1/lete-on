"use strict";
const assert=require("node:assert/strict");global.window={};require("./source-inventory-4-1.js");require("./source-inventory-grade6.js");require("./curriculum.js");require("./generators.js");
const item=require("./source-5-2-cuboid-page51-mission4.js"),model=item.verifyModel();
const type=window.HSE_CURRICULUM.semesters.find(s=>s.id==="5-2").units.find(u=>u.id==="5-2-u5").subunits.find(s=>s.name==="직육면체의 전개도").types.find(t=>t.sourceItemId===item.sourceItemId);
assert(type);assert.equal(type.id,item.sourceItemId);assert.equal(type.sourceVerified,true);assert.equal(type.reviewLocked,false);assert.equal(type.publisherKeyVerified,false);assert.equal(window.HSE_GENERATORS.generatorKey(type),item.generatorKey);
const q=window.HSE_GENERATORS.generate(type,2,0,51,0);assert(q);assert.equal(window.HSE_GENERATORS.generate(type,2,0,51,1),null);assert.equal(q.answer,"바와 차");assert.deepEqual(model.bottomFaces,["나","사"]);assert.deepEqual(model.facesPerNet,[6,6]);assert.equal(model.firstNetSideFacingSecond,"바");assert.equal(model.secondNetSideFacingFirst,"차");assert.equal(item.foldNet(item.nets[0]).get("나").n.join(","),"0,0,-1");assert.equal(item.foldNet(item.nets[1]).get("사").n.join(","),"0,0,-1");assert.match(q.prompt,/크기가 똑같은 2개의 정육면체의 전개도/);assert.match(q.solution,/첫째 정육면체의 바와 둘째 정육면체의 차/);assert.equal(q.answerVerification,"independent-cube-net-fold-orientation-propagation");
assert.equal((q.prompt.match(/class="fold"/g)||[]).length,10);assert.equal((q.prompt.match(/class="join"/g)||[]).length,1);assert.equal((q.prompt.match(/class="boundary"/g)||[]).length,26);
const viewBox=item.netSvg().match(/viewBox="([^"]+)"/)[1].split(" ").map(Number);
for(const net of item.nets)for(const face of net.faces){const left=38+(face.x+2)*62,right=left+62;assert(left>viewBox[0]+1);assert(right<viewBox[0]+viewBox[2]-1,"face border needs stroke clearance");}
for(const [net,a,b] of [[item.nets[0],"다","바"],[item.nets[1],"아","차"]]){const o=item.foldNet(net);assert(o.get(a).n.every((x,i)=>x===-o.get(b).n[i]));}
console.log("5-2 U5 p.51 Mission 4: two six-face cube nets, bases 나/사, propagated side normals meet at 바/차; public release audit passed.");
