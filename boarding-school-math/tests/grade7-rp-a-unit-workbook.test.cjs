"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const source=require("../learning/grade7-rp-a-unit-workbook.js");
const all=function(){return source.pack.workbookItems.concat(source.pack.recheckItems);};
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){const next=a%b;a=b;b=next;}return a||1;}
function reduced(n,d){const divisor=gcd(n,d);return[n/divisor,d/divisor];}
function answerLabel(item){return source.choiceLabel(item,source.solveItem(item),"en");}
function isProportional(pairs){return pairs.every(function(pair){return pair[1]*pairs[0][0]===pair[0]*pairs[0][1];});}

test("7.RP.A has the declared 36-item sequence and eight distinct recheck structures",function(){
  assert.equal(source.validatePack(),true);assert.equal(source.pack.workbookItems.length,36);assert.equal(source.pack.recheckItems.length,8);
  assert.deepEqual(Object.fromEntries(["fraction-rate","relationships","representation","multi-step"].map(function(section){return[section,source.pack.workbookItems.filter(function(item){return item.section===section;}).length];})),{"fraction-rate":8,relationships:12,representation:8,"multi-step":8});
  assert.equal(new Set(all().map(function(item){return item.id;})).size,44);
});

test("every answer is independently recomputed from its declared mathematical model",function(){
  all().forEach(function(item){
    const data=item.data,label=answerLabel(item);
    if(item.kind==="fraction-rate"){
      const expected=reduced(data.distance[0]*data.time[1],data.distance[1]*data.time[0]);assert.deepEqual(data.expected,expected,item.id);assert.equal(label,expected[1]===1?String(expected[0])+" km/h":expected.join("/")+" km/h",item.id);
    }else if(item.kind==="table-proportional"){
      assert.equal(data.proportional,isProportional(data.pairs),item.id);assert.match(label,data.proportional?/^Yes/:/^No/,item.id);
    }else if(item.kind==="table-constant"){
      const expected=reduced(data.pairs[0][1],data.pairs[0][0]);assert.deepEqual(data.expected,expected,item.id);data.pairs.forEach(function(pair){assert.equal(pair[1]*expected[1],pair[0]*expected[0],item.id);});assert.equal(label,"k = "+(expected[1]===1?expected[0]:expected.join("/")),item.id);
    }else if(item.kind==="equation-model"){
      assert.equal(label,"y = "+(data.k[1]===1?data.k[0]+"x":data.k[0]+"x/"+data.k[1]),item.id);
    }else if(item.kind==="point-meaning"){
      assert.equal(data.y,data.k[0]*data.x/data.k[1],item.id);assert.match(label,new RegExp("\\b"+data.x+"\\b.*\\b"+data.y+"\\b"),item.id);
    }else if(item.kind==="multi-step-percent"){
      const first=data.firstWord==="discount"?100-data.first:100+data.first,second=data.secondWord==="discount"?100-data.second:100+data.second,expected=reduced(data.start*first*second,10000),expectedText=expected[1]===1?String(expected[0]):String(Number((expected[0]/expected[1]).toFixed(6)));assert.deepEqual(data.expected,expected,item.id);assert.equal(label,"$"+expectedText,item.id);
    }else assert.fail("unknown kind "+item.kind);
    assert.equal(source.evaluateResponse(item,source.solveItem(item)),true,item.id);assert.equal(source.evaluateResponse(item,"Z"),false,item.id);
  });
});

test("all learner-facing records meet the Grade 7 language, representation, prerequisite, reasoning-load, and response-mode gate",function(){
  assert.equal(source.pack.learnerStage,"US Grade 7 ages 12-13");assert.equal(source.pack.rights.assetRights,"original");assert.match(source.pack.scopeNotice.en,/does not determine placement or promotion/i);
  all().forEach(function(item){["ko","en","zh-Hans"].forEach(function(locale){assert.ok(item.prompt[locale].trim().length>10,item.id+":"+locale);});assert.equal(item.choices.length,4,item.id);assert.ok(["foundation","core","advanced"].includes(item.level),item.id);assert.ok(item.standardIds.every(function(id){return /^7\.RP\.A\.(?:1|2[a-d]|3)$/.test(id);}),item.id);});
});

test("student visuals preserve the givens while teacher answer text remains separate",function(){
  all().forEach(function(item){const visual=source.renderVisual(item,"en","student");assert.ok(visual.length>20,item.id);if(["equation-model","point-meaning"].includes(item.kind))assert.match(visual,/g7rpa-graph/,item.id);if(["table-proportional","table-constant"].includes(item.kind))assert.match(visual,/g7rpa-table/,item.id);});
});
