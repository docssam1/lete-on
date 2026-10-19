// 현행4-1 생물 단원. 옛5-1 원문의 출처와 기존 효모빵 단원/기록은 별개로 보존한다.
import {readFileSync,writeFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import assert from 'node:assert/strict';
import {importUnit} from './bank-science-lib.mjs';
const dir=resolve(process.argv[2]||'science-lab/bank/work/s41u04'),out=resolve('science-lab/data/units');
const read=n=>JSON.parse(readFileSync(join(dir,n),'utf8')),save=(name,x)=>writeFileSync(join(out,`s41-u04.${name}.js`),`export const ${name==='misc'?'':name} = ${JSON.stringify(x,null,2)};\n`);
const cur=read('curriculum.json'),sup=read('supplement.json'),pairs=read('sim/paired.json');
const original=[1,2,3,4].flatMap(set=>read(`set${set}.json`).map(q=>({...q,set,key:`${set}-${q.no}`})));
const typeRows=[
 ['E1','곰팡이·버섯의 관찰 특징','색·균사·포자·갓 안쪽의 주름을 자료에서 관찰하고 범위를 구별한다.'],
 ['E1','실체 현미경의 부분과 역할','렌즈·회전판·재물대·초점 조절 나사를 그림이나 역할 카드와 연결한다.'],
 ['E1','관찰 도구의 사용·배율·안전','낮은 배율에서 시작하는 절차와 배율·유리 표본·안전한 자료 이용을 다룬다.'],
 ['E1','균류의 환경·양분 얻기와 식물 비교','관찰한 버섯·곰팡이의 서식 조건과 양분 얻기를 제시한 녹색 식물과 비교한다.'],
 ['E2','짚신벌레·해캄의 형태와 표본','관찰 특징·영구 표본의 한계를 비교하며 움직임·형태·사진 해석을 구별한다.'],
 ['E2','원생생물의 분류와 서식 사례','현행 단원의 분류와 특징·사는 곳을 연결하고 모든 종류에 대한 일반화를 피한다.'],
 ['E3','세균의 모양·관찰 도구·다양성','제공된 사진·영상으로 대표 모양과 다양한 특징을 비교한다. 직접 배양 과제가 아니다.'],
 ['E3','세균이 사는 곳과 조건','흙·물·몸·물체 등 발견 사례를 읽고 한 장소에만 산다는 설명과 구별한다.'],
 ['E4','생활 속 이로움·해로움과 분해','작용과 생활 영향을 근거로 연결한다. 특정 기능을 모든 생물에 일반화하지 않는다.'],
 ['E4','발효 식품의 생산 사례','제시한 생산 과정에서 미생물의 이용을 찾으며 효능·안전성·부패와 구별한다.'],
 ['E4','생명 과학의 연구·이용 사례','일부 생물의 작용을 의약·환경·식품·농업 문제 해결에 연결한다.'],
 ['E4','소개 자료의 내용·대상·계획','확인한 내용·출처·전달 대상을 살피고 실제 발표자·역할·시간도 계획에 포함한다.'],
];
const types=Object.fromEntries(typeRows.map(([element,name,desc],i)=>[`T${String(i+1).padStart(2,'0')}`,{element,name,desc}]));Object.assign(types,sup.types);
const fixes=[
 '곰팡이와 버섯에서 균사·포자 등을 관찰해요. 갓 안쪽의 주름은 식물의 잎이 아니에요. 이 특징을 모든 균류에 그대로 넓히지 않아요.',
 '접안렌즈는 눈 쪽, 대물렌즈는 표본 쪽, 재물대는 표본을 놓는 받침이에요. 회전판과 초점 조절 나사의 역할도 구별해요.',
 '낮은 배율에서 표본을 찾고 기구 안내에 따라 천천히 초점을 맞춰요. 유리는 조심히 다루고 모르는 미생물을 배양·접촉하지 않아요.',
 '관찰하는 버섯·곰팡이는 다른 생물의 물질에서 양분을 얻어요. 제시한 녹색 식물의 광합성과 구별하고 한 가지 서식 조건을 모든 종류에 단정하지 않아요.',
 '짚신벌레의 길쭉한 몸·가는 털과 해캄의 긴 가닥·마디·초록색 알갱이를 구별해요. 영구 표본의 정지 모습으로 살아 있는 움직임을 확인할 수는 없어요.',
 '해캄·짚신벌레는 이 단원의 원생생물이에요. 물에 살거나 초록색이라는 한 특징만으로 모두 같은 종류·식물이라고 하지 않아요.',
 '세균의 대표 모양은 공·막대·나선 등이며 종류와 모여 있는 모습이 다양해요. 한 사진만으로 모든 세균의 모양·기능·자연색을 단정하지 않아요.',
 '세균은 흙·물·몸·물체 표면 등 여러 곳에서 발견돼요. 한 사례가 모든 장소에 모든 세균이 같은 수로 있다는 뜻은 아니에요.',
 '분해·산소 생산·식품 이용 등 이로움과 부패·질병 등 해로움을 조건·생물의 작용과 연결해요.',
 '주어진 생산 과정에서 미생물의 발효 작용을 찾아요. 식품 이름만으로 전체 제조 과정·건강 효과·안전성을 단정하지 않아요.',
 '생물의 어떤 작용을 어떤 생활 문제 해결에 이용하는지 연결해요. 항생제와 백신은 같은 뜻이 아니며 실제 의약품을 만드는 활동이 아니에요.',
 '자료의 대상·내용·그림·출처를 확인해요. 발표자·역할·시간도 실제 계획에 고려할 수 있어요. 제작과 실제 공유는 따로 기록해요.',
];
const newMis=Object.fromEntries(typeRows.map(([element,name],i)=>[`M${String(i+1).padStart(2,'0')}`,{label:`${name}를 다시 살펴봐요`,element,terms:[name],fix:fixes[i],step:i<8?2:4}]));Object.assign(newMis,sup.misconceptions);
const required=Object.fromEntries(original.filter(q=>q.format==='서술형').map(q=>[`src:${q.key}`,[q.rubric[0].criterion]]));
const judge=Object.fromEntries([...original.filter(q=>q.format==='서술형').map(q=>[`src:${q.key}`,{open:true,need:[],ex:{ok:[q.answer],part:[],no:[]},note:'인쇄 배점은 보존한다. 의미·대안·자료 오류는 교사 확인하며 단순 키워드로 자동 정답 처리하지 않는다.'}]),...pairs.filter(q=>q.kind==='wr').map(q=>[`sim:${q.key}`,{open:true,need:[],ex:{ok:[q.sample],part:[],no:[]},note:'설명과 근거의 타당성은 교사 확인. 공식 배점 없음.'}])]);
const notes=Object.fromEntries(original.map(q=>[q.key,'옛5-1 교재에서 옮긴 자료이며 현행4-1 학습에 활용합니다. 관찰한 생물·표본의 범위로 읽고 모든 종류의 구조·서식 조건·영향을 단정하지 않습니다.']));
const extra={
 '1-1':'균사·포자는 이 문제의 곰팡이와 버섯의 특징입니다. 효모처럼 실 모양이 아닌 균류도 있습니다.',
 '1-5':'해캄은 현행 단원에서 원생생물로 다룹니다. 짚신벌레의 작은 생김새는 적절한 확대 도구로 자세히 관찰합니다.',
 '2-6':'제시한 녹색 식물과 곰팡이·버섯의 비교입니다. 모든 식물이 씨·열매를 만들거나 모든 균류의 온도·빛 조건이 같다는 뜻이 아닙니다.',
 '2-19':'해캄을 일반적인 적조 원인 생물로 설명한 문장은 그대로 일반화하지 않습니다. 원문의 해로운 현상 만들기를 유익한 기술 활용으로 보지 않는 취지와 원인 생물의 정확성을 구별합니다.',
 '2-20':'일부 곰팡이의 세균 자람 억제 물질을 이용한 대표 사례는 항생제 개발입니다. 항생제 치료와 백신 예방은 다른 원리입니다. 인쇄 예시·배점은 원문 기록으로 보존하며 백신이라는 말만으로 이 설명을 과학적으로 옳다고 자동 판정하지 않습니다.',
 '3-7':'원문의 과거 관찰 기록을 읽는 문제이며 학생이 미지의 연못물을 맨손으로 만지는 활동이 아닙니다.',
 '3-17':'유산균의 발효 식품 생산 사례로 읽습니다. 모든 균주·식품·사람에게 같은 소화·면역 효과를 보장하지 않습니다.',
 '3-19':'특정 해충에 작용하는 미생물을 이용한 제제의 사례입니다. 모든 생물에게 영향이 전혀 없다는 뜻이 아니며 학생이 직접 제조·살포하지 않습니다.',
 '4-3':'교사가 준비한 식용 버섯이나 사진을 이용합니다. 원문의 촉감 설명을 이름 모르는 야생 버섯 접촉·채집 지시로 옮기지 않습니다.',
 '4-5':'절단은 교사가 준비한 식용 표본의 자료로 읽습니다. 학생에게 야생 버섯 채집·칼 사용을 요구하지 않습니다.',
 '4-8':'이 문제의 녹색 식물과 곰팡이·버섯을 비교합니다. 모든 식물이 꽃·열매·씨를 만드는 것은 아닙니다.',
 '4-19':'해캄을 일반적인 적조 원인으로 설명한 보기는 과학적으로 보완이 필요합니다. 일부 균류의 억제 물질 활용과 구별합니다.',
 '4-25':'발문은 한 가지 예입니다. 인쇄 예시 전체를 필수 조건으로 강제하지 않으며 다른 타당한 사례도 인정합니다.',
};
for(const [k,v]of Object.entries(extra))notes[k]+=' '+v;
for(const q of original)if(['T01','T02','T03','T05'].includes(read('map.json').map[q.key]))notes[q.key]+=' 직접 접촉·배양·섭취 대신 교사가 준비한 안전한 표본·사진·영상을 이용합니다. 기구는 교사의 안내에 따라 사용합니다.';
await importUnit({unit:'s41-u04',no:4,dir,date:'2026-10-18',unitTitle:'다양한 생물과 우리 생활',title:'4-1 Ⅳ 다양한 생물과 우리 생활',grade:4,semester:1,uKey:'u04',area:'생명',course:'초등 4-1',unitLabel:'Ⅳ. 다양한 생물과 우리 생활',sourceId:'sci-life-51-5',edition:'시매쓰DMC 최다빈출 단원평가',sourceLabel:'옛5-1 원문',sourceBooks:Object.fromEntries([1,2,3,4].map((s,i)=>[`set${s}`,{sourceId:`sci-life-51-5-set${s}`,file:`최다빈출 단원평가 세트${s}`,course:'초등 5-1',unitLabel:'Ⅴ. 다양한 생물과 우리 생활',pages:[2,4,4,5][i]}])),standards:cur.standards,standardsSource:cur.standardsSource,standardsNote:cur.standardsNote,elements:[{id:'E1',name:'균류와 관찰 도구'},{id:'E2',name:'원생생물의 특징과 사는 곳'},{id:'E3',name:'세균의 특징과 사는 곳'},{id:'E4',name:'생활 영향과 생명 과학'},{id:'E5',name:'관찰 자료와 근거'},{id:'E6',name:'특징 설명과 안전한 관찰'},{id:'E7',name:'생활 영향 조사와 이용 사례'},{id:'E8',name:'자료 제작·발표·실제 공유'}],types,newMis,required,judge,sourceNotes:notes,items:sup.items,lessonTypes:Object.fromEntries(sup.items.map(q=>[q.id.replace('s41-u04-',''),q.taxonomy.type])),lessonMis:sup.mis,lessonJudge:sup.judge});
const loadJSONExport=name=>{const text=readFileSync(join(out,`s41-u04.${name}.js`),'utf8');return JSON.parse(text.slice(text.indexOf(`export const ${name} = `)+`export const ${name} = `.length).trim().replace(/;$/,''));};
const source=loadJSONExport('source'),similar=loadJSONExport('similar');
const reviewOnly={
 '1-7':'대장균 사진의 해석 범위 검토',
 '1-8':'초콜릿의 원료 카카오 가공에는 효모·세균의 발효 과정이 이용됩니다. 음식 이름만으로 초콜릿을 발효와 무관하다고 정한 공식 답의 유일성이 성립하지 않습니다.',
 '2-12':'모습이 동물·식물과 비슷하다는 표현과 실제 분류는 다릅니다. “모습”이라는 원문 보기만으로 오답을 하나로 단정하지 않고 특징·분류를 구별해 검토합니다.',
 '3-15':'광합성 원생생물의 산소 생산은 이롭습니다. 일부 조류의 생물 연료 이용도 있어 원문의 넓은 “해캄과 같은 원생생물” 표현에서 이용 사례를 하나로 제한하기 어렵습니다.',
 '3-20':'발표자·역할·시간·비용도 실제 소개 자료 제작 계획에 고려할 수 있습니다. 공식 해설의 고려 불필요라는 단정을 일반 규칙으로 적용하지 않습니다.',
 '4-11':'짚신벌레는 표면의 막 구조로 비교적 일정한 형태를 유지합니다. 이를 틀리다고 한 공식 답과 “정답2개” 조건이 충돌하므로 학생에게 ㄴ·ㄷ을 강제하지 않습니다.',
 '4-12':'해캄은 접합 포자를 형성하는 생활사가 있어 “포자로 번식한다”를 무조건 틀린 보기로 정하기 어렵습니다. 원문은 대표 관찰 특징과 번식 방식을 함께 제시하여 유일 답을 강제하지 않습니다.',
};
reviewOnly['1-7']='대장균은 균주에 따라 편모가 있는 경우도 있습니다. 제시한 정지 사진에 꼬리가 안 보이는 것을 모든 대장균에 없다는 근거로 쓰지 않습니다. 서식 자료와 형태·기능의 판단 범위를 교사와 확인합니다.';
const J=loadJSONExport('judge');
for(const q of source){const key=`${q.sourceRef.set}-${q.sourceRef.no}`;q.taxonomy.inquirySkill=types[q.taxonomy.type].name;q.taxonomy.standard=['T09','T10'].includes(q.taxonomy.type)?'4과12-02':['T11','T12'].includes(q.taxonomy.type)?'4과12-03':'4과12-01';
 if(q.figure)q.figureNote=original.find(o=>o.key===key).figure.note.replace(/:.*$/,'의 부분을 ㄱ~ㅁ으로 표시한 그림.');
 if(reviewOnly[key]){q.printedAnswerContract=structuredClone(q.answerContract);q.sourceRef.reviewOnly=true;q.givens={...(q.givens||{}),...(q.choices?{'원문 선택지':q.choices.map((c,i)=>`${'①②③④⑤'[i]} ${c}`)}:{}),'학습 안내':'원문·공식 답의 타당성을 검토하는 자료입니다. 원문의 답을 자동 채점하지 않습니다. 자료에서 알 수 있는 점과 더 확인할 점을 써서 선생님과 검토해요.'};q.choices=null;q.responseContract='written-explanation';q.answerContract={type:'written-explanation',sample:reviewOnly[key],rubric:{required:['원문 조건·보기·공식 답과 과학적 근거의 관계를 선생님과 확인하기'],pass:'자동 정오 판정 보류 · 교사와 자료 검토'}};q.explanation+='\n[자료 검토·자동 채점 보류] '+reviewOnly[key];q.evidence.gates=['source','visual'];q.evidence.note='원문 전사 확인과 과학적 정답 검증을 구별한다. 원문 발문·공식 답은 전사 파일/printedAnswerContract에 보존한다.';J[q.id]={open:true,need:[],ex:{ok:[],part:[],no:[]},note:reviewOnly[key]};}
}
for(const q of similar){q.taxonomy.inquirySkill=types[q.taxonomy.type].name;q.taxonomy.standard=['T09','T10'].includes(q.taxonomy.type)?'4과12-02':['T11','T12'].includes(q.taxonomy.type)?'4과12-03':'4과12-01';}
save('source',source);save('similar',similar);save('judge',J);
// 원문·짝의 보기 번호는 독립적이다. 각 선택지의 정답 집합 밖에만 해당 유형 교정 문구를 붙인다.
const mod=await import('../science-lab/data/units/s41-u04.misc.js?fresh='+Date.now());
const misc=Object.fromEntries(Object.entries(mod));
for(const q of [...source,...similar,...sup.items]){const ac=q.answerContract,m=`M${q.taxonomy.type.slice(1)}`;delete misc.distractors[q.id];delete misc.typed[q.id];delete misc.written[q.id];if(ac.type==='written-explanation')misc.written[q.id]={partial:[]};else if(q.choices){const ok=[].concat(ac.answer??ac.answers);misc.distractors[q.id]=Object.fromEntries(q.choices.flatMap((_,i)=>ok.includes(i)?[]:[[i,m]]));}else misc.typed[q.id]={any:m};}
writeFileSync(join(out,'s41-u04.misc.js'),Object.entries(misc).map(([k,v])=>`export const ${k} = ${JSON.stringify(v,null,2)};`).join('\n')+'\n');
assert.equal(source.length,75);assert.equal(similar.length,75);assert.equal(sup.items.length,64);assert.equal(source.filter(q=>q.sourceRef.reviewOnly).length,7);
console.log('75원문(7자료검토)+75짝+64독립 보충=214. 기존 효모빵 s51-u05는 수정하지 않음.');

writeFileSync(join(out,'s41-u04.js'),readFileSync(join(out,'s41-u04.js'),'utf8')+"export {biologyBankPaperHtml as bankPaper} from '../../v2/biology-bank-paper.js';\n");
