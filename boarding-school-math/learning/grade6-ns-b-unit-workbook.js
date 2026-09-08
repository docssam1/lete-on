(function (root, factory) {
  const value = typeof module === "object" && module.exports
    ? factory(require("./grade6-ns-b-clinic-pack.js"))
    : factory(root && root.GFIELDGrade6NSBClinicPack);
  if (typeof module === "object" && module.exports) module.exports = value;
  if (root) root.GFIELDGrade6NSBUnitWorkbook = value;
})(typeof window !== "undefined" ? window : globalThis, function (base) {
  "use strict";

  if (!base || typeof base.solveItem !== "function") throw new Error("NSB_UNIT_BASE_MISSING");
  function freeze(value) { if (!value || typeof value !== "object" || Object.isFrozen(value)) return value; Object.keys(value).forEach(function (key) { freeze(value[key]); }); return Object.freeze(value); }
  function tr(ko,en,zh){return freeze({ko:ko,en:en,"zh-Hans":zh});}
  function item(value){return freeze(value);}
  function legacy(id){return base.pack.workbookItems.concat(base.pack.recheckItems).find(function(candidate){return candidate.id===id;});}
  function standardFor(candidate){return candidate.kind==="whole-division"?["6.NS.B.2"]:["gcf","lcm"].includes(candidate.kind)?["6.NS.B.4"]:["6.NS.B.3"];}
  function adapt(candidate,id,section,strand){if(!candidate)throw new Error("NSB_UNIT_LEGACY_ITEM_MISSING");return item(Object.assign({},candidate,{id:id,section:section,strand:strand||candidate.strand,standardIds:freeze(standardFor(candidate))}));}
  function calc(id,section,strand,standardId,level,kind,left,right,symbol,errorCode){
    const expression=left+" "+symbol+" "+right;
    const data=kind==="whole-division"?{dividend:Number(left),divisor:Number(right)}:{left:String(left),right:String(right)};
    return item({id:id,section:section,strand:strand,standardIds:[standardId],level:level,kind:kind,responseFormat:kind==="whole-division"?"whole-number":"decimal",prompt:tr(expression+"을 계산하세요.","Calculate "+expression+".","计算"+expression+"。"),data:data,unit:tr("","",""),errorCode:errorCode});
  }
  function factor(id,section,strand,level,kind,left,right,prompt,errorCode){return item({id:id,section:section,strand:strand,standardIds:["6.NS.B.4"],level:level,kind:kind,responseFormat:"whole-number",prompt:prompt,data:{left:left,right:right},unit:tr("","",""),errorCode:errorCode});}

  const WORKBOOK_ITEMS=freeze([
    adapt(legacy("nsb-w01"),"nsba-w01","division","whole-number-division"),
    adapt(legacy("nsb-w02"),"nsba-w02","division","whole-number-division"),
    adapt(legacy("nsb-w03"),"nsba-w03","division","whole-number-division"),
    adapt(legacy("nsb-w04"),"nsba-w04","division","whole-number-division"),
    calc("nsba-w05","division","whole-number-division","6.NS.B.2","core","whole-division",24864,48,"÷","division-place-value"),
    calc("nsba-w06","division","whole-number-division","6.NS.B.2","core","whole-division",54054,63,"÷","division-reverse-check"),
    calc("nsba-w07","division","whole-number-division","6.NS.B.2","core","whole-division",96012,84,"÷","division-place-value"),
    calc("nsba-w08","division","whole-number-division","6.NS.B.2","advanced","whole-division",123456,96,"÷","division-reverse-check"),
    calc("nsba-w09","division","whole-number-division","6.NS.B.2","core","whole-division",72072,88,"÷","division-place-value"),
    calc("nsba-w10","division","whole-number-division","6.NS.B.2","advanced","whole-division",45252,54,"÷","division-reverse-check"),
    calc("nsba-w11","division","whole-number-division","6.NS.B.2","advanced","whole-division",98784,144,"÷","division-place-value"),
    calc("nsba-w12","division","whole-number-division","6.NS.B.2","advanced","whole-division",35280,126,"÷","division-reverse-check"),

    adapt(legacy("nsb-w05"),"nsba-w13","decimals","decimal-addition"),
    adapt(legacy("nsb-w06"),"nsba-w14","decimals","decimal-subtraction"),
    adapt(legacy("nsb-w07"),"nsba-w15","decimals","decimal-multiplication"),
    adapt(legacy("nsb-w08"),"nsba-w16","decimals","decimal-division"),
    calc("nsba-w17","decimals","decimal-addition","6.NS.B.3","core","decimal-add","305.072","48.936","+","decimal-place-value"),
    calc("nsba-w18","decimals","decimal-subtraction","6.NS.B.3","core","decimal-subtract","100","36.487","−","decimal-place-value"),
    calc("nsba-w19","decimals","decimal-multiplication","6.NS.B.3","core","decimal-multiply","0.84","3.25","×","decimal-scale"),
    calc("nsba-w20","decimals","decimal-multiplication","6.NS.B.3","advanced","decimal-multiply","12.06","0.45","×","decimal-scale"),
    calc("nsba-w21","decimals","decimal-division","6.NS.B.3","core","decimal-divide","7.392","0.24","÷","decimal-scale"),
    calc("nsba-w22","decimals","decimal-division","6.NS.B.3","core","decimal-divide","0.945","0.35","÷","decimal-scale"),
    calc("nsba-w23","decimals","decimal-subtraction","6.NS.B.3","advanced","decimal-subtract","68.4","9.075","−","decimal-place-value"),
    calc("nsba-w24","decimals","decimal-division","6.NS.B.3","advanced","decimal-divide","4.608","1.2","÷","decimal-scale"),

    adapt(legacy("nsb-w09"),"nsba-w25","factors","greatest-common-factor"),
    adapt(legacy("nsb-w10"),"nsba-w26","factors","least-common-multiple"),
    adapt(legacy("nsb-w11"),"nsba-w27","factors","distributive-factor"),
    adapt(legacy("nsb-w12"),"nsba-w28","factors","factor-context"),
    factor("nsba-w29","factors","greatest-common-factor","core","gcf",96,72,tr("96과 72의 최대공약수를 구하세요.","Find the greatest common factor of 96 and 72.","求96和72的最大公因数。"),"factor-versus-multiple"),
    factor("nsba-w30","factors","greatest-common-factor","core","gcf",75,45,tr("75와 45의 최대공약수를 구하세요.","Find the greatest common factor of 75 and 45.","求75和45的最大公因数。"),"factor-versus-multiple"),
    factor("nsba-w31","factors","least-common-multiple","core","lcm",6,10,tr("6과 10의 최소공배수를 구하세요.","Find the least common multiple of 6 and 10.","求6和10的最小公倍数。"),"factor-versus-multiple"),
    factor("nsba-w32","factors","least-common-multiple","advanced","lcm",9,10,tr("9와 10의 최소공배수를 구하세요.","Find the least common multiple of 9 and 10.","求9和10的最小公倍数。"),"factor-versus-multiple"),
    factor("nsba-w33","factors","distributive-factor","core","gcf",63,81,tr("63 + 81 = d(7 + 9)가 되도록 하는 d를 구하세요.","Find d so that 63 + 81 = d(7 + 9).","求d，使63 + 81 = d(7 + 9)。"),"distribution-justification"),
    factor("nsba-w34","factors","distributive-factor","advanced","gcf",40,64,tr("40 + 64 = d(5 + 8)이 되도록 하는 d를 구하세요.","Find d so that 40 + 64 = d(5 + 8).","求d，使40 + 64 = d(5 + 8)。"),"distribution-justification"),
    factor("nsba-w35","factors","factor-context","core","gcf",54,72,tr("사과 54개와 오렌지 72개를 남김없이 같은 구성의 봉지로 최대한 많이 나눕니다. 봉지는 몇 개입니까?","Fifty-four apples and 72 oranges are divided into the greatest possible number of identical bags with none left. How many bags are made?","把54个苹果和72个橙子分成尽可能多且组成相同的袋子，不剩余。可以分成多少袋？"),"context-justification"),
    factor("nsba-w36","factors","multiple-context","advanced","lcm",8,12,tr("두 신호등이 지금 함께 켜졌습니다. 하나는 8초마다, 다른 하나는 12초마다 켜집니다. 몇 초 뒤에 다시 함께 켜집니까?","Two signals flash together now. One flashes every 8 seconds and the other every 12 seconds. After how many seconds will they flash together again?","两个信号灯现在同时亮起。一个每8秒亮一次，另一个每12秒亮一次。多少秒后会再次同时亮起？"),"factor-versus-multiple")
  ]);

  const RECHECK_ITEMS=freeze([
    adapt(legacy("nsb-r01"),"nsba-r01","recheck","whole-number-division"),
    calc("nsba-r02","recheck","decimal-addition","6.NS.B.3","core","decimal-add","47.36","8.729","+","decimal-place-value"),
    calc("nsba-r03","recheck","decimal-subtraction","6.NS.B.3","core","decimal-subtract","90.5","27.386","−","decimal-place-value"),
    adapt(legacy("nsb-r02"),"nsba-r04","recheck","decimal-multiplication"),
    calc("nsba-r05","recheck","decimal-division","6.NS.B.3","advanced","decimal-divide","6.552","0.28","÷","decimal-scale"),
    adapt(legacy("nsb-r03"),"nsba-r06","recheck","greatest-common-factor"),
    adapt(legacy("nsb-r04"),"nsba-r07","recheck","least-common-multiple"),
    factor("nsba-r08","recheck","distributive-factor","advanced","gcf",72,96,tr("72 + 96 = d(3 + 4)가 되도록 하는 d를 구하세요.","Find d so that 72 + 96 = d(3 + 4).","求d，使72 + 96 = d(3 + 4)。"),"distribution-justification")
  ]);

  const STRANDS=freeze({
    "whole-number-division":tr("여러 자리 수 나눗셈","Multi-digit division","多位数除法"),
    "decimal-addition":tr("소수 덧셈","Decimal addition","小数加法"),
    "decimal-subtraction":tr("소수 뺄셈","Decimal subtraction","小数减法"),
    "decimal-multiplication":tr("소수 곱셈","Decimal multiplication","小数乘法"),
    "decimal-division":tr("소수 나눗셈","Decimal division","小数除法"),
    "greatest-common-factor":tr("최대공약수","Greatest common factor","最大公因数"),
    "least-common-multiple":tr("최소공배수","Least common multiple","最小公倍数"),
    "distributive-factor":tr("분배법칙으로 묶어 내기","Factor with the distributive property","用分配律提取公因数"),
    "factor-context":tr("최대한 많이 같은 묶음 만들기","Make the greatest number of equal groups","分成最多相同组"),
    "multiple-context":tr("주기가 다시 겹치는 때 찾기","Find when cycles coincide again","求周期再次重合的时刻")
  });

  const PACK=freeze({schemaVersion:1,id:"gfield-grade6-ns-b-unit-workbook-v1",clusterId:"6.NS.B",standardRange:"6.NS.B.2-4",learnerStage:"US Grade 6 ages 11-12",contentOrigin:"gfield-original-authored-public-unit-workbook",rights:{publication:"public",assetRights:"original",containsThirdPartyAssets:false},
    title:tr("6.NS.B 수 체계 계산 단원 워크북","6.NS.B Number-System Computation Unit Workbook","6.NS.B 数系计算单元练习册"),
    subtitle:tr("여러 자리 수 나눗셈과 소수의 네 가지 연산을 정확히 실행하고, 최대공약수·최소공배수·분배법칙에 적용합니다.","Execute multi-digit division and all four decimal operations accurately, then apply factors, multiples, and the distributive property.","准确完成多位数除法和小数四则运算，再应用最大公因数、最小公倍数与分配律。"),
    scopeNotice:tr("이 책은 미국 6학년 6.NS.B.2-4의 표준 알고리즘과 공약수·공배수 활용을 연습합니다. 자동 채점은 최종 수만 확인합니다. 계산 절차, 어림으로 확인하기, 분배법칙 설명은 선생님이 별도로 관찰하며, 이 책만으로 전체 숙달·배치·승급을 결정하지 않습니다.","This book practices the standard algorithms and factor-multiple applications in US Grade 6 6.NS.B.2-4. Automatic checks verify only the final number. A teacher separately observes procedures, estimation, and distributive-property explanations; this book alone does not determine full mastery, placement, or promotion.","本练习册练习美国六年级6.NS.B.2-4中的标准算法及因数、倍数应用。自动核验只检查最终数值。计算过程、估算检查和分配律说明由教师另行观察；不能只凭本练习册判定全部掌握、分班或晋级。"),
    conceptPages:freeze([
      {title:tr("개념 1 · 자릿값을 지키는 계산","Concept 1 · Preserve place value","概念1 · 保持位值"),body:tr("여러 자리 수 나눗셈은 나누기, 곱하기, 빼기, 내려 쓰기를 자리마다 반복합니다. 소수의 덧셈과 뺄셈은 소수점을 맞추고, 곱셈은 소수 자릿수를 세며, 나눗셈은 나누는 수가 자연수가 되도록 두 수의 소수점을 같은 만큼 옮깁니다.","Repeat divide, multiply, subtract, and bring down by place in multi-digit division. Align decimal points for addition and subtraction, count decimal places in multiplication, and scale both numbers equally in division until the divisor is whole.","多位数除法按位重复除、乘、减、落下。小数加减要对齐小数点，乘法要计算小数位数，除法要把两数的小数点同时移动相同位数，使除数成为整数。"),example:tr("14.875÷1.25는 두 수를 100배 하여 1487.5÷125로 바꿉니다. 몫은 11.9이고, 11.9×1.25=14.875로 검산합니다.","Scale 14.875 ÷ 1.25 by 100 to get 1487.5 ÷ 125. The quotient is 11.9; check 11.9 × 1.25 = 14.875.","把14.875÷1.25的两个数同时乘100，得到1487.5÷125。商是11.9；检验11.9×1.25=14.875。")},
      {title:tr("개념 2 · 공약수, 공배수와 분배법칙","Concept 2 · Factors, multiples, and distribution","概念2 · 公因数、公倍数与分配律"),body:tr("최대공약수는 두 수를 모두 나눌 수 있는 가장 큰 수이고, 최소공배수는 두 수의 공통 배수 중 가장 작은 수입니다. 공통인수는 분배법칙으로 두 항을 하나의 곱으로 묶을 때도 사용합니다.","The GCF is the greatest number dividing both values; the LCM is the least shared multiple. A common factor also rewrites two terms as one product through the distributive property.","最大公因数是能同时整除两个数的最大数；最小公倍数是最小的公倍数。利用分配律把两项写成一个乘积时，也要提取公因数。"),example:tr("36+48=12×3+12×4=12(3+4)입니다. 12는 36과 48의 최대공약수입니다.","36 + 48 = 12 × 3 + 12 × 4 = 12(3 + 4). Here 12 is the GCF of 36 and 48.","36+48=12×3+12×4=12(3+4)。其中12是36和48的最大公因数。")}
    ]),
    teacherObservation:tr("학생이 나눗셈의 각 자리에서 부분몫을 설명하고 곱셈으로 검산하는지, 소수점 이동의 이유를 자릿값으로 설명하는지 확인하세요. 최대공약수와 최소공배수를 구분하고 공통인수를 분배법칙으로 다시 전개해 확인하는지도 기록합니다.","Check whether the learner explains each partial quotient and verifies by multiplication, justifies decimal scaling with place value, distinguishes GCF from LCM, and expands a factored expression to verify distribution.","检查学生能否说明每一位的部分商并用乘法检验，能否用位值解释小数点移动，能否区分最大公因数与最小公倍数，并通过展开式子检验分配律。"),
    reflection:tr("계산 절차와 검산 설명하기","Explain a procedure and its check","说明计算过程与检验"),reflectionPrompt:tr("나눗셈 또는 소수 계산 하나를 골라 자릿값을 지키는 절차와 역연산 검산을 쓰세요. 최대공약수나 최소공배수 문제를 하나 만들어 선택 이유도 설명하세요.","Choose one division or decimal calculation and write its place-value procedure and inverse check. Then create one GCF or LCM problem and explain why that operation fits.","选择一道除法或小数计算，写出保持位值的步骤和逆运算检验。再编一道最大公因数或最小公倍数问题，并说明选择理由。"),
    printPlan:freeze({paperSizes:["A4","Letter"],itemsPerPracticePage:4,studentPages:12,teacherEdition:true,answerSheetSeparate:true}),ui:freeze({sectionOrder:["division","decimals","factors","recheck"],sectionLabels:{division:tr("1 · 여러 자리 수를 정확히 나누기","1 · Divide multi-digit numbers accurately","1 · 准确进行多位数除法"),decimals:tr("2 · 소수의 네 가지 연산","2 · All four decimal operations","2 · 小数四则运算"),factors:tr("3 · 최대공약수, 최소공배수와 분배법칙","3 · GCF, LCM, and the distributive property","3 · 最大公因数、最小公倍数与分配律"),recheck:tr("새 문항 · 8가지 구조 재확인","New items · Eight-structure recheck","新题 · 八种结构复测")}}),workbookItems:WORKBOOK_ITEMS,recheckItems:RECHECK_ITEMS,strands:STRANDS,errorGuides:base.pack.errorGuides});

  function esc(value){return String(value).replace(/[&<>"']/g,function(character){return({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[character];});}
  function localized(value,locale){return value&&(value[locale]||value.en||value.ko)||"";}
  function decimals(text){return (String(text).split(".")[1]||"").length;}
  function shift(text,places){const parts=String(text).split(".");const digits=parts.join("");const point=parts[0].length+places;const shifted=point>=digits.length?digits+"0".repeat(point-digits.length):digits.slice(0,point)+"."+digits.slice(point);return shifted.replace(/^0+(?=\d)/,"");}
  function renderVisual(candidate,locale){const d=candidate.data;
    if(candidate.kind==="whole-division")return '<div class="algorithm-model"><div class="long-division"><span>'+d.divisor+'</span><strong>'+d.dividend+'</strong><em>□</em></div><small>□ × '+d.divisor+' = '+d.dividend+'</small></div>';
    if(candidate.kind==="decimal-add"||candidate.kind==="decimal-subtract"||candidate.kind==="decimal-multiply"){const symbol=candidate.kind==="decimal-add"?"+":candidate.kind==="decimal-subtract"?"−":"×";return '<div class="algorithm-model decimal-stack"><span>'+esc(d.left)+'</span><span>'+symbol+' '+esc(d.right)+'</span><i></i><strong>□</strong></div>';}
    if(candidate.kind==="decimal-divide"){const places=decimals(d.right);const move=locale==="ko"?"두 수 × "+(10**places):locale==="zh-Hans"?"两数 × "+(10**places):"both × "+(10**places);return '<div class="algorithm-model decimal-shift"><strong>'+esc(d.left)+' ÷ '+esc(d.right)+'</strong><span>'+move+'</span><strong>'+shift(d.left,places)+' ÷ '+shift(d.right,places)+' = □</strong></div>';}
    const relationship=candidate.kind==="gcf"?(locale==="ko"?"공통으로 나누는 가장 큰 수":locale==="zh-Hans"?"最大公因数":"greatest shared factor"):(locale==="ko"?"처음 만나는 공통 배수":locale==="zh-Hans"?"最小公倍数":"first shared multiple");return '<div class="algorithm-model factor-model"><span>'+d.left+'</span><em>'+esc(relationship)+'</em><span>'+d.right+'</span><strong>□</strong></div>';
  }
  function validateItem(candidate){const allowed=new Set(["whole-division","decimal-add","decimal-subtract","decimal-multiply","decimal-divide","gcf","lcm"]);if(!candidate||!/^nsba-[wr]\d{2}$/.test(candidate.id)||!allowed.has(candidate.kind))throw new Error("NSB_UNIT_ITEM_INVALID");if(!STRANDS[candidate.strand]||!base.pack.errorGuides[candidate.errorCode]||candidate.standardIds.length!==1||!/^6\.NS\.B\.[234]$/.test(candidate.standardIds[0]))throw new Error("NSB_UNIT_ALIGNMENT_INVALID");["ko","en","zh-Hans"].forEach(function(locale){if(!candidate.prompt[locale])throw new Error("NSB_UNIT_LOCALE_INVALID");});base.solveItem(candidate);return true;}
  function validatePack(){const all=PACK.workbookItems.concat(PACK.recheckItems);if(PACK.workbookItems.length!==36||PACK.recheckItems.length!==8||new Set(all.map(function(candidate){return candidate.id;})).size!==44)throw new Error("NSB_UNIT_COUNT_INVALID");const sections={division:0,decimals:0,factors:0};PACK.workbookItems.forEach(function(candidate){validateItem(candidate);sections[candidate.section]+=1;});PACK.recheckItems.forEach(validateItem);if(sections.division!==12||sections.decimals!==12||sections.factors!==12)throw new Error("NSB_UNIT_SECTION_BALANCE_INVALID");const strands=new Set(PACK.recheckItems.map(function(candidate){return candidate.strand;}));["whole-number-division","decimal-addition","decimal-subtraction","decimal-multiplication","decimal-division","greatest-common-factor","least-common-multiple","distributive-factor"].forEach(function(strand){if(!strands.has(strand))throw new Error("NSB_UNIT_RECHECK_COVERAGE_INVALID");});return true;}
  validatePack();
  return freeze({schemaVersion:1,pack:PACK,solveItem:base.solveItem,evaluateResponse:base.evaluateResponse,formatResult:base.formatResult,hintFor:base.hintFor,solutionFor:base.solutionFor,renderVisual:renderVisual,validateItem:validateItem,validatePack:validatePack});
});
