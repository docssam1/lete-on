const test = require("node:test");
const assert = require("node:assert/strict");
const source = require("../learning/grade6-rp-a-unit-workbook.js");

const expected = Object.freeze({
  "rpa-w01":"20", "rpa-w02":"3:4", "rpa-w03":"14", "rpa-w04":"35",
  "rpa-w05":"3:4", "rpa-w06":"49", "rpa-w07":"55", "rpa-w08":"56",
  "rpa-w09":"56", "rpa-w10":"7:9", "rpa-w11":"28", "rpa-w12":"18",
  "rpa-w13":"35", "rpa-w14":"0.75", "rpa-w15":"1920", "rpa-w16":"5.25",
  "rpa-w17":"1.75", "rpa-w18":"32", "rpa-w19":"30", "rpa-w20":"5",
  "rpa-w21":"49.5", "rpa-w22":"3.5", "rpa-w23":"12.5", "rpa-w24":"60",
  "rpa-w25":"17", "rpa-w26":"75", "rpa-w27":"210", "rpa-w28":"35",
  "rpa-w29":"36", "rpa-w30":"75", "rpa-w31":"56", "rpa-w32":"135",
  "rpa-w33":"75", "rpa-w34":"2400", "rpa-w35":"23", "rpa-w36":"60",
  "rpa-r01":"48", "rpa-r02":"4.5", "rpa-r03":"24", "rpa-r04":"84",
  "rpa-r05":"7:9", "rpa-r06":"39", "rpa-r07":"75", "rpa-r08":"105"
});

function gcd(left,right){let a=Math.abs(left),b=Math.abs(right);while(b){const next=a%b;a=b;b=next;}return a||1;}

test("6.RP.A is a balanced 36-item unit workbook with an 8-item recheck", function () {
  assert.equal(source.validatePack(),true);
  assert.equal(source.pack.workbookItems.length,36);
  assert.equal(source.pack.recheckItems.length,8);
  assert.deepEqual(Object.fromEntries(["equivalent","rates","applications"].map(function(section){return[section,source.pack.workbookItems.filter(function(item){return item.section===section;}).length];})),{equivalent:12,rates:12,applications:12});
  assert.deepEqual(source.pack.printPlan,{paperSizes:["A4","Letter"],itemsPerPracticePage:4,studentPages:12,teacherEdition:true,answerSheetSeparate:true});
  assert.deepEqual(source.pack.rights,{publication:"public",assetRights:"original",containsThirdPartyAssets:false});
  assert.match(source.pack.scopeNotice.en,/does not determine full mastery, placement, or promotion/i);
});

test("all 44 responses match the separately written answer ledger", function () {
  const all=source.pack.workbookItems.concat(source.pack.recheckItems);
  assert.deepEqual(new Set(all.map(function(item){return item.id;})),new Set(Object.keys(expected)));
  all.forEach(function(item){
    assert.equal(source.formatResult(item),expected[item.id],item.id);
    assert.equal(source.evaluateResponse(item,expected[item.id]),true,item.id);
  });
});

test("every answer satisfies an independent inverse or cross-product check", function () {
  source.pack.workbookItems.concat(source.pack.recheckItems).forEach(function(item){
    const answer=source.solveItem(item),data=item.data;
    if(answer.kind==="ratio"){
      assert.equal(gcd(answer.left,answer.right),1,item.id);
      assert.equal(answer.left*data.right,answer.right*data.left,item.id);
      return;
    }
    const n=answer.numerator,d=answer.denominator;
    assert.ok(Number.isSafeInteger(n)&&Number.isSafeInteger(d)&&d>0,item.id);
    if(item.kind==="missing-term"){
      if(data.knownLeft!=null) assert.equal(n*data.left,data.knownLeft*data.right*d,item.id);
      else assert.equal(n*data.right,data.knownRight*data.left*d,item.id);
    }else if(item.kind==="part-from-total"){
      const target=data.target==="left"?data.left:data.right;
      assert.equal(n*(data.left+data.right),data.total*target*d,item.id);
    }else if(item.kind==="unit-rate"){
      const valueNumerator=data.totalValueNumerator!=null?data.totalValueNumerator:data.totalValue;
      const valueDenominator=data.totalValueDenominator!=null?data.totalValueDenominator:1;
      assert.equal(n*d*0+n*data.quantity*valueDenominator,valueNumerator*d,item.id);
    }else if(item.kind==="proportional-value"){
      assert.equal(n*data.sourceQuantity,data.sourceValue*data.targetQuantity*d,item.id);
    }else if(item.kind==="percent-of"){
      assert.equal(n*100,data.whole*data.percent*d,item.id);
    }else if(item.kind==="percentage"){
      assert.equal(n*data.whole,data.part*100*d,item.id);
    }else if(item.kind==="conversion"){
      assert.equal(n*data.valueDenominator,data.valueNumerator*data.factor*d,item.id);
    }else assert.fail("unsupported independent check: "+item.kind);
  });
});

test("recheck covers every workbook reasoning strand with new facts", function () {
  assert.deepEqual(new Set(source.pack.recheckItems.map(function(item){return item.strand;})),new Set(["equivalent-ratio","unit-rate","proportional-value","part-whole","percent-conversion"]));
  const workbookFacts=new Set(source.pack.workbookItems.map(function(item){return item.kind+":"+JSON.stringify(item.data);}));
  source.pack.recheckItems.forEach(function(item){assert.equal(workbookFacts.has(item.kind+":"+JSON.stringify(item.data)),false,item.id);});
});

test("all student prompts are complete in Korean, English, and Simplified Chinese without answer leakage", function () {
  source.pack.workbookItems.concat(source.pack.recheckItems).forEach(function(item){
    ["ko","en","zh-Hans"].forEach(function(locale){
      assert.ok(item.prompt[locale]&&item.prompt[locale].trim().length>8,item.id+":"+locale);
      const answer=expected[item.id];
      if(!/^\d+$/.test(answer)) return;
      const bare=new RegExp("(?:^|[^0-9])"+answer.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"(?:[^0-9]|$)");
      assert.equal(bare.test(item.prompt[locale]),false,item.id+":"+locale+" visible answer");
    });
  });
});
