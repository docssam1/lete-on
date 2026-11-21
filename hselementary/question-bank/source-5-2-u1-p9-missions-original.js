(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.HSE_U1_P9_MISSIONS_ORIGINAL=api;api.install(root)})(typeof window!=='undefined'?window:globalThis,function(){'use strict';
const font='font-family: &quot;Noto Serif KR&quot;, serif',ink='#191511';
function lFigure(){return `<svg viewBox="0 0 480 236" role="img" aria-label="ㄱ자 모양 도형: 왼쪽 전체 세로 2 cm 4 mm, 아래쪽 전체 가로 48 mm, 오른쪽 위가 직사각형 모양으로 들어간 도형" style="display:block;width:100%;max-width:440px;height:auto;margin:8px auto" xmlns="http://www.w3.org/2000/svg"><path d="M150 40H231V107H450V190H150Z" fill="none" stroke="${ink}" stroke-width="2.6" stroke-linejoin="miter"/><g fill="none" stroke="${ink}" stroke-width="1.2" stroke-dasharray="4 4"><path d="M150 40Q104 115 150 190"/><path d="M150 190Q300 238 450 190"/></g><text x="112" y="121" text-anchor="end" font-family="serif" font-size="19" fill="${ink}">2 cm 4 mm</text><rect x="260" y="200" width="80" height="26" fill="#fff"/><text x="300" y="220" text-anchor="middle" font-family="serif" font-size="19" fill="${ink}">48 mm</text></svg>`;}
const cell='border-bottom:1px solid #191511;padding:5px 14px';
const head=`border-top:2px solid #191511;border-bottom:1px solid #191511;padding:5px 14px;background:#e9e9e9;font-weight:normal`;
const martTable=`<table style="border-collapse:collapse;margin:8px auto;text-align:center" aria-label="마트별 스케치북 판매"><thead><tr><th scope="col" style="${head}"></th><th scope="col" style="${head}">한 묶음의 수</th><th scope="col" style="${head}">한 묶음의 가격</th></tr></thead><tbody><tr><th scope="row" style="${cell};font-weight:normal">㈎ 마트</th><td style="${cell}">15권</td><td style="${cell}">9000원</td></tr><tr><th scope="row" style="${cell};font-weight:normal">㈏ 마트</th><td style="${cell}">24권</td><td style="${cell}">13000원</td></tr></tbody></table>`;
const items=Object.freeze({
'5-2-u1-e3-mission-2-original':Object.freeze({key:'source52U1P9Mission2Original',answer:'약 14cm',contract:'single-value',
 assumption:'원문의 "약 몇 cm인지 자연수로"를 둘레(14.4cm)를 소수 첫째 자리에서 반올림한 값으로 해석함. 버림도 14cm이며 올림만 15cm가 됨.',
 prompt:`<p>아래 그림과 같은 도형의 둘레는 약 몇 cm인지 자연수로 나타내어라.</p>${lFigure()}<p>※ 조건 보충: 둘레를 소수 첫째 자리에서 반올림하여 자연수 cm로 나타냅니다.</p>`,
 solution:`<ol><li>위쪽 가로와 안쪽 가로를 더하면 아래쪽 전체 가로 48mm와 같고, 오른쪽 세로와 안쪽 세로를 더하면 왼쪽 전체 세로 2cm 4mm=24mm와 같습니다.</li><li>둘레는 (48+24)×2=144mm=14.4cm입니다.</li><li>14.4cm를 반올림하여 자연수로 나타내면 약 <b>14cm</b>입니다.</li></ol>`,
 verification:'source-figure-comparison-notch-independent-perimeter-and-rounding'}),
'5-2-u1-e3-mission-3-original':Object.freeze({key:'source52U1P9Mission3Original',answer:'34320개',contract:'single-value',
 assumption:'상자를 모서리가 창고의 가로·세로·높이 방향과 나란하도록 놓는다고 해석함(기울여 넣는 배치 제외).',
 prompt:`<p>가로 3m, 세로 10m, 높이 4m인 창고 안에 가로, 세로, 높이가 모두 15cm인 상자를 넣으려고 한다. 창고에는 최대 몇 개까지 상자를 넣을 수 있겠는가?</p><p>※ 조건 보충: 상자는 모서리가 창고의 가로·세로·높이 방향과 나란하도록 놓습니다.</p>`,
 solution:`<ol><li>3m=300cm, 10m=1000cm, 4m=400cm입니다.</li><li>가로로 300÷15=20개, 세로로 1000÷15=66…10이므로 66개, 높이로 400÷15=26…10이므로 26개까지 놓을 수 있습니다. 남는 10cm에는 상자를 놓을 수 없으므로 버림합니다.</li><li>따라서 최대 20×66×26=<b>34320개</b>입니다.</li></ol>`,
 verification:'source-text-comparison-floor-per-axis-and-axis-parallel-bound'}),
'5-2-u1-e3-mission-4-original':Object.freeze({key:'source52U1P9Mission4Original',answer:'㈏ 마트, 32000원 절약',contract:'choice-and-value',
 assumption:'원문의 "어느 마트에서 사야 하고"에 따라 두 마트 중 한 곳에서만 묶음으로 산다고 해석함. 두 마트를 섞어 사면 ㈎ 2묶음과 ㈏ 26묶음으로 356000원이 되어 질문의 전제와 맞지 않음.',
 prompt:`<p>유미네 학교의 전교생은 652명이다. 개교기념일을 맞이하여 전교생에게 스케치북을 한 권씩 선물로 나누어 주려고 한다. ㈎ 마트와 ㈏ 마트에서 각각 다음과 같이 스케치북을 판매한다고 할 때, 부족하지 않게 최소의 가격으로 사려면 어느 마트에서 사야 하고 얼마의 비용이 절약되겠는가?</p>${martTable}<p>※ 조건 보충: 스케치북은 두 마트 중 한 곳에서만 묶음으로 삽니다.</p>`,
 solution:`<ol><li>스케치북은 652권이 필요합니다.</li><li>㈎ 마트: 652÷15=43…7이므로 44묶음을 사야 합니다. 비용은 44×9000=396000원입니다.</li><li>㈏ 마트: 652÷24=27…4이므로 28묶음을 사야 합니다. 비용은 28×13000=364000원입니다.</li><li>㈏ 마트에서 사는 것이 396000−364000=32000원 더 싸므로 <b>㈏ 마트, 32000원 절약</b>입니다.</li></ol>`,
 verification:'source-table-comparison-ceiling-bundles-and-mixed-purchase-check'}),
'5-2-u1-e3-mission-5-original':Object.freeze({key:'source52U1P9Mission5Original',answer:'부산광역시 17cm, 인천광역시 15cm, 대전광역시 7.5cm',contract:'multi-value',assumption:'',
 prompt:`<p>작년 1월의 부산광역시 인구는 3434091명, 인천광역시는 2956513명, 대전광역시는 1486647명이었다. 각 도시의 인구를 반올림하여 십만의 자리까지 나타낸 후 10만 명을 5mm로 하여 막대그래프로 나타낸다면 각 도시의 인구는 각각 몇 cm씩 표시되겠는가?</p>`,
 solution:`<ol><li>부산광역시: 3434091 → 3400000명(10만 명의 34배) → 34×5=170mm=17cm</li><li>인천광역시: 2956513 → 3000000명(10만 명의 30배) → 30×5=150mm=15cm</li><li>대전광역시: 1486647 → 1500000명(10만 명의 15배) → 15×5=75mm=7.5cm</li><li>따라서 <b>부산광역시 17cm, 인천광역시 15cm, 대전광역시 7.5cm</b>입니다.</li></ol>`,
 verification:'source-text-comparison-round-hundred-thousand-and-scale'}),
'5-2-u1-e3-mission-6-original':Object.freeze({key:'source52U1P9Mission6Original',answer:'3600000원',contract:'single-value',assumption:'',
 prompt:`<p>감귤 농장에서 3일 동안 수확한 감귤의 개수는 첫째 날 4283개, 둘째 날 3976개, 셋째 날 4015개이다. 수확한 감귤은 500개씩 상자에 넣고 포장하여 한 상자에 150000원씩 판매한다고 한다. 포장된 감귤을 모두 판매한다면 판매금액의 합은 얼마인가?</p>`,
 solution:`<ol><li>수확한 감귤은 모두 4283+3976+4015=12274개입니다.</li><li>12274÷500=24…274이므로 500개씩 포장된 상자는 24상자이고, 274개는 포장되지 않습니다.</li><li>판매금액의 합은 24×150000=<b>3600000원</b>입니다.</li></ol>`,
 verification:'source-text-comparison-sum-and-floor-boxes'})
});
const ids=Object.keys(items);
function makeQuestion(id){const q=items[id];if(!q)return null;return {prompt:`<div style="${font}" data-source-item-id="${id}" data-pool-index="0">${q.prompt}</div>`,solution:`<div style="${font}" data-source-answer="${id}">${q.solution}</div>`,answer:q.answer,answerAssumption:q.assumption,answerVisualRequired:false,answerVisualStatus:'not-required',automaticGrading:false,resultContract:q.contract,sourceItemId:id,generator:q.key,generationMode:'fixed-verified-pool',verifiedPoolIndex:0,verifiedVariantCount:1,verifiedVariantTarget:1,difficultyOffset:0,difficultyLevel:2,difficultyRank:2,sourceStructurePreserved:true,sourcePdfPage:7,sourcePrintedPage:9,publisherKeyVerified:false,publisherAnswerVerified:false,answerVerification:q.verification};}
function find(t){return t?ids.find(id=>t.id===id||t.sourceItemId===id||t.generatorKey===items[id].key):undefined;}
function install(target){const api=target?.HSE_GENERATORS;if(!api||typeof api.generatorKey!=='function'||typeof api.generate!=='function')return false;if(api.__u1P9MissionsOriginalInstalled)return true;const pk=api.generatorKey.bind(api),pg=api.generate.bind(api),ok=(t,id)=>t.id===id&&t.sourceItemId===id&&t.generatorKey===items[id].key&&t.reviewLocked===false&&t.sourceVerified===true;api.generatorKey=t=>{const id=find(t);return id?(ok(t,id)?items[id].key:''):pk(t);};api.generate=(t,rank,difficulty,seed,variant=0)=>{const id=find(t);return id?(ok(t,id)?makeQuestion(id):null):pg(t,rank,difficulty,seed,variant);};if(Array.isArray(api.names))for(const id of ids)if(!api.names.includes(items[id].key))api.names.push(items[id].key);Object.defineProperty(api,'__u1P9MissionsOriginalInstalled',{value:true});return true;}
return Object.freeze({items,ids,lFigure,makeQuestion,install});});
