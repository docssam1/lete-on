// Reviewed study-page reflow; canonical questions, answers and figures stay intact.
export const ECOLOGY_GUIDED_VERSION='20261123-ecology-guided-workbook';
const prior='7d2868cc429caf6a';
const clone=x=>JSON.parse(JSON.stringify(x));
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}

function guidedPages(w){
 const pages=clone(w.pages);
const text=t=>({type:'text',text:t}),heading=t=>({type:'heading',text:t}),table=(heads,rows)=>({type:'table',heads,rows}),field=(title,hint,lines=1)=>({type:'field',title,hint,lines,draw:false});
const replacements={
 1:[heading('워밍업'),text('사진에서 살아 있는 것을 하나 짚어 보세요. 본 적 있는 생물을 친구에게 말해도 좋아요.')],
 2:[text('이 단원에서 가장 궁금한 내용을 하나 골라 동그라미 해요.')],
 3:[text('사진에서 찾은 것을 한 낱말씩 써요.'),table(['생물 요소','비생물 요소'],[['[ ]','[ ]']])],
 4:[text('맞는 말에 동그라미 해요.'),table(['살펴본 것','어느 쪽일까요?'],[['버섯','생물 요소 / 비생물 요소'],['바위','생물 요소 / 비생물 요소']])],
 5:[text('위의 설명에서 알맞은 역할을 찾아 써요.'),table(['양분을 얻는 방법','역할'],[['빛을 이용해 스스로 만든다','[ ]'],['다른 생물을 먹는다','[ ]'],['죽은 생물의 물질을 분해한다','[ ]']])],
 6:[text('사진의 토끼와 여우를 번갈아 짚어 보세요. 귀나 꼬리의 생김새를 말해 보아요.')],
 7:[text('표를 보고 맞는 말에 동그라미 해요.'),table(['여우가 없어진 모형 조건','그대로인 조건보다'],[['풀의 수','많아졌어요 / 적어졌어요'],['토끼의 수','많아졌어요 / 적어졌어요']]),text('표의 수는 비교를 위해 만든 예시예요. 실제 풀밭에서 센 생물의 수와 구별해요.')],
 8:[text('아래 말 중에서 골라 한 낱말씩 써요. 보기: 먹이, 먹는 생물'),table(['화살표가 시작하는 쪽','화살표가 향하는 쪽'],[['[ ]','[ ]']])],
 9:[text('위의 두 먹이 사슬에 모두 나오는 생물 이름에 동그라미 해요.')],
 10:[field('모형 놓아 보기','같은 이름표가 만나는 자리를 생각하며 카드와 화살표를 놓아 보세요.',3)],
 11:[field('남아 있는 먹이','개구리 말고 뱀이 먹을 수 있는 생물을 위의 자료에서 찾아 한 낱말로 써요.')],
 12:[text('사진에서 직접 보이는 것을 짧게 써요.'),table(['버려진 쓰레기','쓰레기가 있는 곳'],[['[ ]','[ ]']])],
 13:[text('줄이고 싶은 문제를 하나 고른 뒤, 할 일을 짧게 써요.'),table(['내가 할 일','학교나 지역에서 도울 일'],[['[ ]','[ ]']])],
 14:[text('짝과 이야기하며 두 방법의 좋은 점과 필요한 준비를 찾아보아요.'),table(['정한 행동','언제','어디서'],[['[ ]','[ ]','[ ]']])],
 15:[text('정한 행동을 해 본 뒤 날짜와 한 일을 짧게 써요. 아직 해 보지 못했다면 그 상태로 남겨요.'),table(['날짜','해 본 행동'],[['[ ]','[ ]']])],
 16:[field('한 문장으로 마무리','배운 내용 중 하나를 골라 이어요. “나는 ___을 알게 되었어요. 왜냐하면 ___이기 때문이에요.”',2)]
};
for(let i=0;i<16;i++){
 const old=pages[i],out=[];let found=false;
 for(const b of old.blocks){if(b.type==='field'){if(!found)out.push(...replacements[i+1]);found=true;}else out.push(b);}
 if(!found)throw Error('Missing field '+(i+1));old.blocks=out;
}
// Preserve the physical model activity, its drawing area and safety preparation.
const plan=pages[9].blocks.find(b=>b.type==='field');plan.draw=true;
pages[9].blocks=pages[9].blocks.map(b=>b.type==='list'?{...b,items:['이름 카드 6장과 화살표 6개, 큰 종이를 준비해요.','두 먹이 사슬에서 같은 생물의 이름표를 찾아 한 자리에 놓아요.','자료를 보며 화살표를 잇고, 짝과 방향을 확인해요.','다른 먹이 관계도 있는지 이야기해 보아요.']}:b.type==='text'&&b.text.startsWith('교사 준비')?text('재사용 종이와 안전한 도구로 모형을 만들어요. 이름표와 화살표를 직접 옮기며 관계를 확인해요.'):b);
pages[14].blocks=pages[14].blocks.map(b=>b.type==='text'&&b.text.startsWith('실제 물병')?text('정한 행동을 실제로 해 보아요. 오염된 물이나 날카로운 쓰레기는 직접 만지지 않고 어른에게 알려요.'):b);
pages[15].blocks=pages[15].blocks.map(b=>b.type==='list'?{...b,items:['내 먹이그물에서 화살표 하나의 뜻을 말해요.','실천해 본 보전 행동을 친구와 나누어요.','친구의 생각을 듣고 더 해 보고 싶은 것을 정해요.']}:b);
const checks=[
'사진에서 생물 하나와 물·흙 같은 주변 환경 하나를 짚어 보아요.',
'이번 단원에서 가장 궁금한 것에 동그라미 해요.',
'사진에서 생물과 비생물을 하나씩 찾아요.',
'움직이지 않는 나무도 생물인지 말해 보아요.',
'생산자·소비자·분해자가 양분을 얻는 방법을 짝과 말해 보아요.',
'풀·토끼·여우의 모습을 사진에서 짚어 보아요.',
'두 조건에서 달라진 풀과 토끼의 수를 손가락으로 짚어 보아요.',
'먹이를 먼저 짚고, 먹는 생물 쪽을 가리켜요.',
'두 먹이 사슬에 공통으로 나오는 이름표를 찾아요.',
'내 모형의 화살표를 짝과 함께 따라가 보아요.',
'뱀이 먹을 수 있는 다른 먹이를 자료에서 찾아요.',
'사진 속 쓰레기를 짚고, 생물이 사는 곳에 어떤 영향이 있을지 말해요.',
'내가 할 수 있는 보전 행동을 하나 골라요.',
'짝과 함께 할 수 있는 방법을 하나 정해요.',
'해 본 행동 하나를 친구에게 말해 보아요.',
'가장 기억에 남은 내용을 친구에게 말해 보아요.',
'분해자의 양분 얻는 방법을 설명한 보기에 밑줄을 그어요.',
'생물 요소와 비생물 요소를 구별해요.',
'양분을 스스로 만드는 생물을 찾아요.',
'무엇을 함께 조사해야 할지 말로 먼저 생각해요.',
'물과 흙 속에서 살아가는 생물을 찾아요.',
'먹는 생물과 먹이를 구별해요.',
'생산자·소비자·분해자의 이름을 짚어 보아요.',
'버섯과 바위가 각각 어느 쪽인지 먼저 골라요.',
'두 생물이 양분을 얻는 방법을 한 가지씩 말해요.',
'사진에서 직접 보이는 것부터 찾아요.',
'사진에서 알 수 있는 모습을 짚어 보아요.',
'역할 이름과 양분 얻는 방법을 이어 보아요.',
'괄호마다 필요한 낱말을 하나씩 찾아요.',
'양분을 얻는 방법이 같은 것끼리 짚어 보아요.',
'생물과 주변 환경이 함께 있는지 내 지도를 살펴요.',
'먹이에서 먹는 생물 쪽으로 화살표를 따라가요.',
'같은 이름의 생물을 연결점으로 찾아요.',
'두 먹이 사슬에 모두 나오는 생물을 짚어 보아요.',
'자료의 “먹는다”를 읽고 화살표 방향을 확인해요.',
'먹이가 남아 있는 경로를 먼저 찾아요.',
'표에서 두 조건을 번갈아 짚으며 비교해요.',
'먹는 관계 하나씩 화살표와 짝지어요.',
'예시 표와 실제 풀밭을 구별해요.',
'뱀에게 남은 먹이를 자료에서 찾아요.',
'이름표와 화살표가 나타내는 것을 말해요.',
'같은 생물의 이름표가 두 번 놓이지 않았는지 살펴요.',
'고친 화살표의 시작과 끝을 짚어 보아요.',
'남아 있는 먹이 경로에 표시해요.',
'생태계에 도움이 되는 행동을 골라요.',
'물이 맑아 보이는 것과 생물이 사는 모습을 나누어 살펴요.',
'생태 통로가 생물에게 주는 도움을 말해 보아요.',
'풀밭에서 살아가는 생물을 먼저 떠올려요.',
'준비할 것과 해 볼 행동을 말로 먼저 정해요.',
'사진에서 보이는 쓰레기를 찾아요.',
'오염을 줄이는 방법을 문제와 이어 보아요.',
'공기를 더럽히는 일과 물을 더럽히는 일을 나누어요.',
'문제에 맞는 보전 방법을 골라요.',
'나·학교·지역이 도울 수 있는 일을 짝과 나누어요.',
'생물이 사는 곳과 이동할 길을 지도에서 찾아요.',
'카드에서 해 본 행동에 표시해요.'
];
if(checks.length!==56)throw Error('Check count');
for(let i=0;i<pages.length;i++){const notes=pages[i].rail;const last={...notes.at(-1),text:checks[i]};delete last.write;pages[i].rail=[...notes.slice(0,-1),last];}
function merge(indices,title){const sources=indices.map(n=>pages[n-1]),first=sources[0];return{...first,title,blocks:sources.flatMap((p,i)=>i?[heading(p.title),...p.blocks]:p.blocks),rail:first.rail};}
const concept=[merge([1,2],'생물과 환경'),merge([3,4],'생물과 비생물을 구별해요'),pages[4],merge([6,8],'먹이 관계를 화살표로 나타내요'),pages[8],pages[9],pages[6],pages[10],pages[11],pages[12],pages[13],merge([15,16],'생태계를 지키는 행동을 해 보아요')];
// The unit map belongs on the opening, not on a separate writing page.
concept[0].blocks=concept[0].blocks.filter(b=>!(b.type==='list'));concept[0].blocks=concept[0].blocks.filter(b=>!(b.type==='text'&&b.text==='이 단원에서 가장 궁금한 내용을 하나 골라 동그라미 해요.'));
// Keep the introductory directions concrete after combining and moving pages.
concept[0].blocks[1]=text('생물은 주변 환경과 어떤 관계가 있을까요? 생물이 사는 곳을 살펴보고, 먹이 관계를 나타내 보아요. 생태계를 지키는 방법도 찾아 함께 실천해요.');
concept[1].blocks=concept[1].blocks.map(b=>b.type==='text'&&b.text.startsWith('생물과 비생물 환경')?text('어느 곳에 사는 생물과 그 주변 환경이 서로 영향을 주고받는 것을 생태계라고 해요. 숲이나 연못, 작은 화단도 생태계예요.'):b);
concept[3].blocks=concept[3].blocks.map(b=>b.type==='text'&&b.text.startsWith('사진에서 풀')?text('사진에서 풀·토끼·여우를 찾아보아요. 토끼는 풀을 먹고, 여우는 토끼를 먹을 수 있어요. 이런 먹고 먹히는 관계를 화살표로 나타내 보아요.'):b.type==='text'&&b.text.startsWith('사진의 토끼')?text('풀 → 토끼 → 여우를 손가락으로 따라가 보아요.'):b);
concept[3].rail=[{title:'핵심 정리',text:'먹이 화살표는 먹히는 생물에서 먹는 생물로 향해요.'},pages[7].rail[1],{title:'내가 정리할 것',text:'먹이를 먼저 짚고, 먹는 생물 쪽을 가리켜요.'}];
concept[4].title='먹이 사슬을 이어 먹이그물을 만들어요';
concept[8].title='쓰레기는 생물에게 어떤 영향을 줄까요?';
concept[8].blocks=concept[8].blocks.map(b=>b.type==='text'&&b.text.startsWith('인간 활동→')?text('물 위에 쓰레기가 떠 있으면 이곳에 사는 생물은 어떤 어려움을 겪을까요? 짝과 한 가지씩 이야기해 보아요.'):b);
concept[9].title='나와 학교, 지역에서 할 일을 찾아요';
concept[10].blocks[0]=table(['컵 쓰레기를 줄이는 방법','생각해 볼 점'],[['물병을 씻어 다시 쓰기','일회용 컵을 줄일 수 있어요. 씻고 보관할 곳이 필요해요.'],['분리배출 장소를 알리고 함께 지키기','쓰레기를 종류별로 모을 수 있어요. 안내와 수거가 필요해요.']]);
// Avoid repeating the full worked example after the photo and classification task.
concept[1].blocks=concept[1].blocks.filter(b=>b.type!=='example'&&!(b.type==='table'&&b.rows[0]?.[0]?.startsWith('식물·')));
concept[1].blocks.splice(2,0,text('살아 있는 것은 생물 요소, 물·흙·햇빛처럼 살아 있지 않은 환경은 비생물 요소예요.'));
concept[3].blocks=concept[3].blocks.filter(b=>b.type!=='example');
// The practice page asks for the child's own small action, not a fictional log audit.
concept[11].blocks=concept[11].blocks.filter(b=>!(b.type==='diagram'&&['ecoPracticeCards','ecoSources'].includes(b.key)));
concept[11].blocks.unshift(heading('내가 해 볼 행동을 하나 골라요'),{type:'list',items:['물병을 씻어 다시 쓰기','쓰레기를 종류에 맞게 분리배출하기','종이를 뒷면까지 쓰기'],ordered:false});
const byId=new Map(w.questions.map(x=>[x.id,x])),practice=[],buffer=[];
let template=null;
function flush(){if(!buffer.length)return;for(let i=0;i<buffer.length;i+=4)practice.push({...template,section:'확인 문제 '+buffer.slice(i,i+4).map(id=>byId.get(id).no).join('·'),title:'배운 내용을 확인해요',blocks:[{type:'questions',ids:buffer.slice(i,i+4)}]});buffer.length=0;template=null;}
for(const page of pages.slice(16)){
 const simple=page.blocks.length===1&&page.blocks[0].type==='questions'&&page.blocks[0].ids.every(id=>!['written','draw'].includes(byId.get(id).form));
 if(simple){template??=page;buffer.push(...page.blocks[0].ids);}else{flush();practice.push(page);}
}flush();
const next=[...concept,...practice];const beforeIds=w.pages.flatMap(p=>p.blocks.flatMap(b=>b.ids||[])),afterIds=next.flatMap(p=>p.blocks.flatMap(b=>b.ids||[]));if(JSON.stringify(beforeIds)!==JSON.stringify(afterIds))throw Error('Question order changed');

 return next;
}

export function withEcologyGuidedWorkbook(workbook){
 if(workbook?.unit!=='c22-s42-u02')return workbook;
 const key={pages:workbook.pages,teacherStudentPages:workbook.teacherStudentPages,questions:workbook.questions,figures:workbook.figures};
 if(fingerprint(key)!==prior)return workbook;
 const prepared=guidedPages(workbook);
 return {...workbook,pages:prepared,teacherStudentPages:prepared};
}
