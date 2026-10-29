"use strict";
// Exercise safety checks without modifying the user's source ledgers.
const assert=require("node:assert/strict"),fs=require("node:fs"),os=require("node:os"),path=require("node:path"),cp=require("node:child_process");
const root=fs.mkdtempSync(path.join(os.tmpdir(),"gfield-inventory-controls-"));
const folder=path.join(root,"source-inventory");fs.mkdirSync(folder);
const files=["5-2-source-items.json","6-1-source-items.json","6-2-source-items.json"];
for(const name of files)fs.copyFileSync(path.join(__dirname,"source-inventory",name),path.join(folder,name));
const file=path.join(folder,"6-1-source-items.json"), original=fs.readFileSync(file,"utf8");
const audit=path.join(__dirname,"source-inventory-grades-5-2-to-6-audit.js");
function run(){return cp.spawnSync(process.execPath,[audit],{env:{...process.env,HSE_SOURCE_INVENTORY_ROOT:root},encoding:"utf8"});}
try{
 const baseline=run();assert.notEqual(baseline.status,0,"the existing evidence gaps must remain visible");
 assert.match(baseline.stderr,/reviewReason가 비어 있습니다/);
 for(const [label,mutate,expected] of [
  ["unverified unlocked",x=>{const i=x.items.find(i=>i.implementationStatus==="fixed-verified-pool");i.sourceVerified=false;},/sourceVerified false인데 잠금이 아닙니다/],
  ["missing locked reason",x=>{const i=x.items.find(i=>i.implementationStatus==="review-locked"&&i.reviewReason);i.reviewReason="";},/6-1\[0\]: reviewReason가 비어 있습니다/],
  ["duplicate source id",x=>{x.items[1].sourceItemId=x.items[0].sourceItemId;},/sourceItemId 중복/]
 ]){
  const data=JSON.parse(original);mutate(data);fs.writeFileSync(file,JSON.stringify(data));
  const result=run();assert.notEqual(result.status,0,label);assert.match(result.stderr,expected,label);
  console.log(`${label}: rejected`);
 }
}finally{fs.rmSync(root,{recursive:true,force:true});}
console.log("PASS: representative unsafe mutations are detected; baseline evidence gaps remain open.");
