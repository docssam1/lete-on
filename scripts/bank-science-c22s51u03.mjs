// 용해와 용액: 옛5-1 원문75 · 독립짝75 · 교재 연계96. 기존 s51-u04는 보존한다.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
import {questions} from '../science-lab/data/book/c22-s51-u03.questions.js';
const unitId='c22-s51-u03',work=new URL('../science-lab/bank/work/c22s51u03/',import.meta.url),out=new URL('../science-lab/data/units/',import.meta.url);
const read=f=>JSON.parse(readFileSync(new URL(f,work),'utf8')),cur=read('curriculum.json'),original=read('source-reviewed.json'),pairs=read('sim/paired.json'),gold=read('official-key-reviewed.json'),holds=new Map(read('source-dispositions.json').holds.map(r=>[r.key,r.reason]));
const defs=[
 ['T01','E1','용해·용질·용매·용액의 구별','녹는 과정인 용해, 녹는 용질, 녹이는 용매, 고르게 녹은 전체인 용액을 구별한다.'],
 ['T02','E1','용액의 관찰 특징과 분류','색과 투명함은 다르다. 고체·층이 남은 전체와 고르게 녹은 용액을 구별하고 제품명만으로 조성을 단정하지 않는다.'],
 ['T03','E1','보이는 알갱이와 녹은 물질의 존재','보이지 않음은 물질이 없어진 뜻이 아니다. 남은 고체만으로 한 알도 녹지 않았다고 단정하지 않는다.'],
 ['T04','E2','같은 물건 전체의 용해 전후 질량','물·용질·용기·약포지의 포함 범위를 같게 하고 손실·증발·저울 사용을 확인한다. 용액만의 질량과 전체를 구별한다.'],
 ['T05','E3','용질 종류에 따른 녹을 수 있는 양','물 양·온도·투입과 관찰 방법을 맞춘다. 모두 녹은 양은 하한이며 정확한 최대량은 더 확인한다.'],
 ['T06','E3','물 양에 따른 녹을 수 있는 양','같은 용질·온도에서 물 양만 바꾸어 녹일 수 있는 양을 비교하고 용질 양이나 빠르기와 구별한다.'],
 ['T07','E4','물 온도에 따른 녹을 수 있는 양','백반 등 명시한 재료와 온도 범위에서 물 양을 맞춘다. 모든 용질에 대한 보편 법칙으로 확대하지 않는다.'],
 ['T08','E4','냉각 뒤 나타난 고체와 조건','실제로 고체가 나온 관찰을 읽는다. 따뜻할 때 모두 녹았다는 사실만으로 냉각 뒤 결정이 반드시 생긴다고 하지 않는다.'],
 ['T09','E5','용질·용매의 상대적 양과 진하기','같은 물 양의 녹은 용질 양, 같은 용질 양의 물 양을 함께 읽는다. 용액 총량·덜기와 진하기를 구별한다.'],
 ['T10','E5','색으로 비교하는 조건과 한계','같은 색을 내는 용질·관찰 깊이·용기·조명을 맞춘다. 무색 설탕물의 진하기를 색만으로 확정하지 않는다.'],
 ['T11','E6','같은 물체의 뜨는 정도 비교','같은 물체·용질 종류·온도·용기 조건에서 자유롭게 뜨는 수면 관계를 읽는다. 벽·바닥 접촉과 정량 눈금을 구별한다.'],
 ['T12','E6','진하기 비교 도구·조건·구별의 한계','같은 도구가 자유롭게 뜨는지 확인한다. 두 용액에서 모두 가라앉았다고 같은 진하기라 확정하지 않는다.'],
 ['T13','E7','생활 쓰임 조사·자료 제작·실제 공유','쓰임과 관련 성질·출처를 연결한다. 계획·파일 저장·제작과 실제 전달·받은 의견·미수신을 따로 기록한다.'],
 ['T14','E3','녹는 빠르기와 양·탐구 근거의 범위','같은 양의 용해 시간과 최대 용해량을 구별하고 한 번에 바꾼 조건과 실제로 관찰한 근거를 점검한다.']
];
const types=defs.map(([id,element,name,desc])=>({id,element,name,desc})),byType=Object.fromEntries(types.map(t=>[t.id,t]));
const elements=['용해와 용액의 관찰','용해 전후 같은 전체의 질량','용질 종류·물 양과 탐구 조건','온도와 냉각 뒤 고체','상대적 진하기와 색 비교','같은 물체의 뜨기·비교 도구','생활 조사·제작·실제 소통'].map((name,i)=>({id:'E'+(i+1),name}));
const standard=type=>'6과03-'+(type==='T13'?'03':['T09','T10','T11','T12'].includes(type)?'02':'01');
const tx=r=>({curriculum:'2022 개정',grade:5,semester:1,unit:'u03',area:'물질',element:byType[r.type].element,type:r.type,format:r.kind==='wr'?'서술형':r.kind==='st'?'단답형':'선택형',level:'기본',track:'교과',standard:standard(r.type),topic:r.topic||byType[r.type].name,concept:byType[r.type].name,inquirySkill:byType[r.type].name});
const mkAc=r=>r.kind==='sc'?{type:'single-choice',answer:r.answer,accepted:[r.answer]}:r.kind==='mc'?{type:'multi-choice',answers:r.answer}:r.kind==='st'?{type:'short-text',answer:r.answer,accepted:[...new Set([r.answer,...(r.accepted||[])])]}:{type:'written-explanation',sample:r.answer,rubric:{required:r.required||['제시 조건과 근거를 연결한 과학적으로 타당한 설명.'],pass:'교사 확인 · 동등 표현과 다른 타당한 해법 인정',note:'학습용 기준이며 공식 배점표나 실제 수행 확인이 아니다.'}};
const circ='①②③④⑤',parse=r=>({...r,answer:r.kind==='sc'?circ.indexOf(r.answer.trim()):r.kind==='mc'?[...r.answer].flatMap(c=>circ.includes(c)?[circ.indexOf(c)]:[]):r.answer});
const source=original.map(r=>{
 assert.equal(r.answer,gold[r.key]);const ac=mkAc({...parse(r),required:r.key==='1-5'?['물의 온도가 높아진 조건과 이 설탕의 더 녹을 수 있는 양을 연결한다.']:r.key==='3-17'?['같은 물 양에서 더 녹인 용질 양과 용액 전체의 질량 차이를 연결한다.']:undefined});if(r.kind==='sc')assert(ac.answer>=0&&ac.answer<r.choices.length);
 const q={id:`${unitId}-o${r.set}-${String(r.no).padStart(2,'0')}`,status:'verified',sourceRef:{type:'original',sourceId:`sci-solution-51-set${r.set}`,set:r.set,no:r.no,page:r.page,originalSet:r.set,originalNo:r.no,course:'초등 5-1',unit:'Ⅳ. 용해와 용액',edition:`최다빈출 단원평가 세트${r.set}`,label:`옛5-1 용해와 용액 · 세트${r.set}`},taxonomy:tx(r),prompt:r.prompt,givens:r.givens||null,choices:r.choices||null,figure:r.figure||null,figureNote:r.figureNote||null,figureLayout:r.figureLayout||null,responseContract:ac.type,answerContract:ac,printedExplanation:r.printedExplanation,sourcePrintedRubric:r.rubric||null,explanation:r.explanation+(r.sourceNote?'\n[원문 해석과 확인] '+r.sourceNote:''),sourceNote:r.sourceNote||'',curriculumScope:'legacy-unit-linked',evidence:{checkedBy:'원문75 전사·공식 키·그림 직접 대조',date:'2026-10-18',gates:['source','science','answer',...(r.figure?['visual']:[])],against:'source-reviewed.json·official-key-reviewed.json·sources-review-20261018.json·figure-evidence.json',note:'옛5-1 네 세트의 원문이며 현행 판본 전체 시험지라고 주장하지 않는다.'}};
 if(holds.has(r.key)){q.printedAnswerContract=structuredClone(ac);q.sourceRef.reviewOnly=true;q.givens={...(q.givens||{}),...(q.choices?{'원문 선택지':q.choices.map((c,i)=>circ[i]+' '+c)}:{}),'학습 안내':'원문과 공식 답을 보존합니다. 조건과 자료의 범위를 교사와 검토하며 자동 정오 판정을 하지 않아요.'};q.choices=null;q.responseContract='written-explanation';q.answerContract=mkAc({kind:'wr',answer:holds.get(r.key),required:['인쇄된 공식 답·제시 조건·추가 확인할 점을 교사와 비교한다.']});q.explanation+='\n[자동 판정 보류] '+holds.get(r.key);q.evidence.gates=['source',...(r.figure?['visual']:[])];}
 return q;
});
const figureRoot='assets/activities/c22-s51-u03/',bankRoot='assets/bank/c22-s51-u03/';
const photoModels={
 'float-a':{figure:figureRoot+'floating-photo-v1.webp',photoLabels:['ㄷ','ㄴ','ㄱ'],figureNote:'세 용기에서 같은 물체가 왼쪽은 완전히 잠겨 자유롭게 떠 있고 가운데·오른쪽은 수면 위로 차례로 더 많이 드러난 실사형 자료'},
 'float-b':{figure:figureRoot+'floating-photo-v1.webp',photoLabels:['ㄷ','ㄱ','ㄴ'],figureNote:'같은 물체가 왼쪽에서는 완전히 잠겨 자유롭게 떠 있고 가운데·오른쪽에서는 수면 위로 차례로 더 많이 드러난 실사형 자료'},
 'float-five':{figure:bankRoot+'pair-float-five-photo-v2.webp',photoLabels:['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ'],figureNote:'다섯 용기의 물체가 왼쪽부터 바닥 접촉, 완전 잠긴 자유 부유, 작은 부분 노출, 가장 큰 부분 노출, 아주 작은 부분 노출인 실사형 자료'},
 'color-pair':{figure:bankRoot+'pair-color-pair-photo-v1.webp',photoLabels:['ㄱ','ㄴ'],figureNote:'같은 용기·액면의 갈색 용액 두 개. 왼쪽이 상대적으로 더 어둡고 오른쪽이 더 옅으며 두 액체 모두 맑은 실사형 자료'},
 'residue-pair':{figure:figureRoot+'residue-photo-v1.webp',photoLabels:['ㄱ','ㄴ'],figureNote:'같은 모양 용기의 왼쪽에는 바닥 고체가 남고 오른쪽에는 남은 고체가 보이지 않는 실사형 자료'},
 'mix-salt':{figure:bankRoot+'pair-mix-salt-photo-v1.webp',photoLabels:['소금','물','소금물'],figureNote:'왼쪽 흰 소금, 가운데 맑은 물, 오른쪽 소금이 모두 녹은 맑은 소금물의 실사형 자료'},
 'mix-neutral':{figure:figureRoot+'mixing-photo-v1.webp',photoLabels:['설탕','물','설탕물'],figureNote:'왼쪽 흰 설탕, 가운데 맑은 물, 오른쪽 설탕이 모두 녹은 맑은 설탕물의 실사형 자료'}
};
const photoFields=k=>k?{...photoModels[k],photoCredit:'AI 실사형 설명 이미지 · 실제 측정 사진 아님',visualModel:{kind:'photo-comparison',model:k,exactScale:false}}:{};
let pairChoice=0;const similar=pairs.map(r=>{const s=original.find(s=>s.key===r.key);assert(s);assert.equal(s.kind,r.kind);let row={...r,type:s.type};if(r.kind==='sc'){const answer=pairChoice++%5;assert.equal(r.choices.filter(c=>c===r.answer).length,1);row.choices=r.choices.filter(c=>c!==r.answer);assert.equal(row.choices.length,4);row.choices.splice(answer,0,r.answer);row.answer=answer;}const ac=mkAc(row);return{id:`${unitId}-p${s.set}-${String(s.no).padStart(2,'0')}`,status:'authored',sourceRef:{type:'similar',of:{set:s.set,no:s.no,page:s.page,originalSet:s.set,course:'초등 5-1'}},taxonomy:tx(row),prompt:r.prompt,givens:r.givens||null,choices:row.choices||null,...photoFields(r.figureModel),responseContract:ac.type,answerContract:ac,explanation:r.explanation,curriculumScope:'current-linked',variantRules:{kind:'persisted-independent-pair',sourceKey:r.key,answerFromOwnConditions:true},evidence:{checkedBy:'독립 짝 자체 조건·정답·사진/표 대조',date:'2026-10-18',gates:['science','answer',...(r.figureModel?['visual']:[])],against:'교육부6과03·자가 이론/실험 본문·짝 자체 조건',note:'실사형 설명 이미지와 연습 값은 실제 수행 결과가 아니다.'}};});
const bookType=[3,1,14,13,1,2,2,3,2,2,4,4,4,4,4,4,5,5,5,5,14,14,7,7,7,7,7,8,9,9,9,9,9,9,11,12,11,12,12,10,13,13,13,13,13,13,5,5,14,6,7,4,9,12,9,13,14,13,1,4,14,9,12,13,1,1,3,3,4,4,4,4,5,5,7,14,9,9,11,9,11,12,12,10,13,13,13,13,1,4,5,7,9,10,13,14];
// 독립 은행의 다섯 번째 보기는 목표 개념의 오개념이다. 교재 원래 네 보기는 그대로 보존한다.
const fifth={
 1:'설탕 알갱이가 안 보이면 처음 넣은 설탕의 질량도 0이 된다.',
 6:'색이 있는 용액은 투명한 부분과 가루가 남은 부분으로 반드시 나뉜다.',
 7:'고체가 남았으면 윗액에도 용질은 한 알도 녹지 않았기 때문이다.',
 12:'설탕물·같은 컵·빈 약포지·처음에는 재지 않은 젓는 막대',
 18:'젓고 난 뒤 바닥에 남은 고체의 양',
 19:'B에 남은 고체를 합하면 B가 녹인 양은 언제나 A보다 많다.',
 24:'A는 물 30 mL·20 ℃, B는 물 80 mL·40 ℃에 같은 백반',
 25:'물 양을 늘리지 않았으므로 온도와 관계없이 녹을 수 있는 양도 같다.',
 30:'용액을 더 큰 컵으로 옮긴 쪽',
 31:'잘 섞은 뒤 덜어 낸 양이 더 많은 쪽',
 36:'같은 크기로 보이는 서로 다른 물체를 골라 무게를 재지 않고 각각 넣는다.',
 42:'물에 퍼져 보이는 물감은 녹지 않는 성분까지 어떤 제품이나 모두 용액이다.',
 47:'A 8 g이 모두 녹았으므로 온도나 물 양을 바꾸어도 최대량은 늘지 않는다.',
 51:'두 용액의 진하기를 실제로 먼저 같게 만들지 않아서',
 55:'A는 물 30 g·설탕 3 g, B는 물 90 g·설탕 9 g을 모두 녹임',
 65:'용질',
 69:'159 g',
 73:'용질 종류를 바꾸면서 물 양도 바꾸고 같은 투입 횟수만 비교',
 77:'각 용액의 물과 설탕을 모두 더한 질량이 큰 B가 더 진하다.',
 81:'A에서 더 높이 뜨면 물체가 바뀐 것이므로 진하기는 비교할 수 없다.',
 85:'자료 제목이나 기관은 빼고 그림의 색과 저장한 파일 이름만 표시',
 90:'빈 약포지 질량을 확인하지 않고 처음과 끝 기록에서 모두 같다고 가정해 뺀다.',
 94:'무색이면 설탕이 모두 녹았는지와 관계없이 물과 용질의 양도 서로 같다.'
};
const boundedShort=new Set([13,70]),aliases={23:['따뜻한','높은'],29:['진하다','진한'],35:['진한','진하다'],41:['확인','조사'],62:['묽어, 진해','묽어져, 진해져'],64:['전달, 의견','전달, 질문','공유, 의견','공유, 질문']};
let bookChoice=0;const items=questions.map(q=>{
 const type='T'+String(bookType[q.no-1]).padStart(2,'0');assert(byType[type]);let r={kind:'wr',type,answer:q.answer,required:[q.criteria]},choices=q.choices||null,adaptation=null;
 if(q.form==='choice'){r.kind='sc';const answer=q.choices[q.key];choices=[...q.choices,fifth[q.no]];assert(choices.every(Boolean));const pos=bookChoice++%5;choices=choices.filter(c=>c!==answer);choices.splice(pos,0,answer);r.answer=pos;adaptation='교재의 네 보기를 바탕으로 목표 개념의 오개념 보기 하나를 더한 별도 다섯 보기 문항이다. 순서와 답 번호는 해당 은행 문제지로 확인한다.';}
 else if(q.form==='multi'){r.kind='mc';r.answer=q.key;}
 else if(['blank','match','order'].includes(q.form)||boundedShort.has(q.no)){r.kind='st';r.accepted=aliases[q.no]||[];if(q.form==='match')r.accepted.push(q.answer.replace(/\([1-9]\)\s*/g,''));if(q.form==='blank'&&q.answer.includes('/')){const slots=q.answer.split(',').map(s=>s.trim().split('/'));const combine=slots.reduce((a,b)=>a.flatMap(x=>b.map(y=>[...x,y])),[[]]);r.accepted.push(...combine.map(x=>x.join(', ')));}if(boundedShort.has(q.no))r.accepted.push(q.answer.replace(/\s*g$/,'그램'));}
 const ac=mkAc(r);return{id:`${unitId}-b${String(q.no).padStart(3,'0')}`,status:'authored',sourceRef:{type:'authored-supplement',edition:'GFIELD 용해와 용액 창작 학습',course:'초등 5-1'},taxonomy:tx({...r,topic:q.topic}),prompt:q.prompt,givens:q.given||q.parts?{...(q.given?{'보기':q.given}:{}),...(q.parts?{'문항':q.parts}:{})}:null,choices,responseContract:ac.type,answerContract:ac,bookResponseForm:q.form,workbookRef:{unit:unitId,id:q.id,no:q.no},...(adaptation?{adaptationNote:adaptation}:{}),explanation:q.explanation,misconception:q.misconception,evidence:{checkedBy:'교재 연계 목표·독립 은행 응답 계약 대조',date:'2026-10-18',gates:['science','answer'],against:'교재 독립 창작96·교육부6과03·자가교재 본문',note:'열린 단답·그림·서술은 교사 확인이며 공식 성적·실제 수행으로 확정하지 않는다.'}};
});
const judge={},misconceptions=Object.fromEntries(defs.map(([t,element,name,fix])=>[t.replace('T','M'),{label:name+'의 근거를 확인해요',terms:[name],fix,element}])),typed={},distractors={},written={};
for(const q of [...source,...similar,...items]){const a=q.answerContract,m=q.taxonomy.type.replace('T','M');if(a.type==='written-explanation'){judge[q.id]={open:true,need:[],ex:{ok:q.sourceRef.reviewOnly?[]:[a.sample],part:[],no:[]},note:q.sourceRef.reviewOnly?'원문 조건 검토 · 자동 정오 판정 보류':'열린 응답은 교사 확인. 동등 표현과 타당한 대안을 인정하며 실제 수행/공식 성적은 별도로 확인한다.'};written[q.id]={partial:[]};}else if(q.choices){const ok=[].concat(a.answer??a.answers);distractors[q.id]=Object.fromEntries(q.choices.flatMap((_,i)=>ok.includes(i)?[]:[[i,m]]));}else typed[q.id]={any:m};if(q.figure)assert(existsSync(new URL('../science-lab/'+q.figure,import.meta.url)),q.figure);}
const unit={id:unitId,course:'5-1',no:3,title:'용해와 용액',domain:'물질',elements:elements.map(e=>e.name),sources:{bank:[1,2,3,4].map(s=>'sci-solution-51-set'+s),originalExamAvailable:false,scope:'옛5-1 용해와 용액 네 세트75 연계. 현행 판본 전체 원문 시험지로 확정하지 않음.',reviewOnly:holds.size,basis:'bank/work/c22s51u03/curriculum.json'}};
const taxonomy={unit:unitId,curriculum:'2022 개정',grade:5,semester:1,title:unit.title,area:'물질',supplementAuthored:true,supplementFormatCounts:items.reduce((a,q)=>(a[q.taxonomy.format]=(a[q.taxonomy.format]||0)+1,a),{}),standards:cur.standards,standardsSource:cur.standardsSource,standardsNote:cur.scopeNotes.join(' '),elements,types,formats:['선택형','단답형','서술형'],sources:Object.fromEntries(source.map(q=>[`${q.sourceRef.set}-${q.sourceRef.no}`,[q.taxonomy.type,q.taxonomy.format]])),authored:Object.fromEntries(items.map(q=>[q.id,q.taxonomy.type]))};
const put=(suffix,text)=>writeFileSync(new URL(unitId+suffix+'.js',out),text),j=x=>JSON.stringify(x,null,2);
put('',`export const unit = ${j(unit)};\nexport const items = ${j(items)};\nexport {solutionBankPaperHtml as bankPaper,wireSolutionBankPaper as wireBankPaper} from '../../v2/solution-bank-paper.js';\n`);
for(const[name,data]of Object.entries({source,similar,taxonomy,judge}))put('.'+name,`export const ${name} = ${j(data)};\n`);
put('.misc',Object.entries({misconceptions,typed,distractors,written,remedy:Object.fromEntries(Object.keys(misconceptions).map(m=>[m,{step:3}]))}).map(([key,value])=>`export const ${key} = ${j(value)};`).join('\n')+'\n');
assert.equal(source.length,75);assert.equal(similar.length,75);assert.equal(items.length,96);assert.equal(new Set([...source,...similar,...items].map(q=>q.id)).size,246);assert.equal(source.filter(q=>q.sourceRef.reviewOnly).length,10);
writeFileSync(new URL('types-reviewed.json',work),j({types,elements})+'\n');writeFileSync(new URL('supplement.json',work),j({items})+'\n');
console.log('용해 원문75(검토10)·독립짝75·교재연계96=246 / 자동',246-Object.keys(judge).length,'/ 교사확인',Object.keys(judge).length,'/ 짝 선택형',pairChoice);
