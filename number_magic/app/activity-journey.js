import {createJourney,restoreJourney,view,equation,act,finalize,scenes} from '../data/activity-journeys.js';

const feedbackTranslations={
 '빈칸을 하나씩 살펴봐.':['Look at each empty space.','一个一个看看空格。'],
 '뒤 수는 보는 쪽, 가운데 기호는 걷는 방법이야.':['The following sign sets facing; the operation sets how to walk.','后数符号决定面向，运算符号决定走法。'],
 '두 모임이 각각 남김없이 나뉘는지 봐.':['Check that each collection divides without a remainder.','检查两堆是否都能无剩余地分组。'],
 '현재 장면을 먼저 확인해 봐.':['Verify this scene first.','先完成当前场景的验证。'],
 '상황에서 무엇이 달라졌는지 다시 살펴봐.':['Look again at what changed in the story.','再看看故事中什么发生了变化。'],
 '남은 빈칸만큼만 고를 수 있어.':['Select no more than the remaining spaces.','选择的数量不能超过剩下的空格。'],
 '옮길 블록을 먼저 골라 봐.':['First select the blocks to move.','先选择要移动的积木。'],
 '10 묶음 옆에 남은 블록을 다시 세어 봐.':['Count the blocks beside the group of ten again.','再数一数一组十旁边剩下的积木。'],
 '새 블록이 생겼는지, 같은 블록이 옮겨졌는지 봐.':['Did new blocks appear, or did the same blocks move?','是出现了新积木，还是移动了原来的积木？'],
 '문제의 처음 수가 어느 위치인지 봐.':['Find the position of the first number.','找到第一个数的位置。'],
 '뒤 수의 −는 왼쪽, +는 오른쪽을 보는 뜻이야.':['The following − means face left; + means face right.','后一个数的−表示面向左，+表示面向右。'],
 '가운데 +는 앞으로, −는 뒤로 걷기야. 보는 쪽은 그대로야.':['The operation + means walk forward; − means walk backward. Keep facing the same way.','运算+表示向前走，−表示向后走，面向不变。'],
 '뒤 수의 크기만큼 걸어 봐.':['Use the magnitude of the following number for the step count.','步数是后一个数的绝对值。'],
 '사람이 지금 서 있는 눈금을 읽어 봐.':['Read the tick where the person is standing.','读出小人现在站着的刻度。'],
 '보는 쪽과 걷는 쪽은 다른 역할이야.':['Facing and walking have different roles.','面向和走法有不同的作用。'],
 '두 모임에서 모두 남는 것이 없는지 확인해 봐.':['Check that neither collection has a remainder.','确认两堆都没有剩余。'],
 '공통으로 나누는 후보를 모두 찾고, 그중 가장 큰 수를 골라 봐.':['Find every common divisor, then choose the greatest.','找到所有公因数，再选择最大的数。'],
 '0 다음에 처음 함께 만난 곳을 찾아봐.':['Find the first shared point after zero.','找到0之后的首次相遇点。'],
 '상황에 맞는 묶기 또는 첫 만남을 다시 봐.':['Check whether this story needs equal division or a first meeting.','确认故事要找等量分组还是首次相遇。'],
 '이야기의 단위와 찾은 수의 역할을 연결해 봐.':['Connect the unit in the story to the number you found.','把故事中的单位与找到的数联系起来。'],
 '묶음 수와 한 묶음 안의 개수를 구분해 봐.':['Distinguish the number of groups from the pieces per group.','区分组数和每组的个数。'],
 '최대공약수와 최소공배수의 이름을 확인해 봐.':['Check the names: greatest common divisor and least common multiple.','确认最大公因数和最小公倍数的名称。'],
 'AB는 두 자리 수가 아니라 A×B야.':['AB means A×B, not a two-digit number.','AB表示A×B，不是一个两位数。'],
 '같은 블록의 개수가 그대로인지 봐.':['Check that the same blocks keep the same total.','检查同一批积木的总数是否不变。']
};

/* A projection of the semantic state, not an additional graded lesson or a video.
   Every change comes from a learner action. WebGL and DOM share this controller. */
export async function mount(host,uid,lang='ko',options={}){
 if(!host?.isConnected)return null;
 host.__livingLesson?.dispose();
 const tr=(ko,en,zh)=>lang==='en'?en:lang==='zh'?zh:ko;
 let state=restoreJourney(uid,options.saved),visual=null,disposed=false,busy=false,saved=false,writing=false,timer=0,sequence=0,uiTimer=0;
 const scroller=host.closest('#screen');
 const session=globalThis.crypto?.randomUUID?.()||Date.now()+'-'+Math.random();
 const $=s=>host.querySelector(s),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const button=(action,value,label,extra='')=>`<button type="button" data-action="${action}" data-value="${esc(value??'')}" ${extra}>${esc(label)}</button>`;
 host.classList.add('nm-live-lesson','nm-journey');host.dataset.lesson=uid;
 host.innerHTML=`<header class="nm-live-head"><h2></h2><span class="nm-live-round"></span></header>
  <p class="nm-journey-caption">${tr('마법 노트 · 비채점 조작 연습','Magic notebook · unscored practice','魔法笔记 · 不计分操作练习')}</p>
  <ol class="nm-journey-roles"></ol><p class="nm-live-question"></p>
  <div class="nm-live-stage" data-renderer="loading"><div class="nm-live-loading" role="status">${tr('입체 교구를 준비하고 있어요','Preparing the 3D pieces','正在准备立体教具')}</div><div class="nm-journey-labels" aria-hidden="true"></div><div class="nm-journey-fallback"></div></div>
  <div class="nm-journey-legend"></div><div class="nm-live-equation" aria-live="polite" aria-atomic="true"></div>
  <div class="nm-journey-evidence"></div><div class="nm-journey-controls"></div>
  <p class="nm-live-feedback" role="status"></p><p class="nm-journey-save" role="status"></p>
  <div class="nm-live-actions">${button('undo','',tr('되돌리기','Undo','撤回'))}${button('hint','',tr('도움 받기','Get help','提示'))}${button('reset','',tr('이 장면 처음부터','Restart scene','重做本场景'))}${button('retry','',tr('저장 다시 시도','Retry save','重试保存'))}${button('next','',tr('다음 장면','Next scene','下一场景'))}${button('town','',tr('마을로','Back to town','回到村庄'))}</div>
  <p class="nm-live-render-note" hidden>${tr('입체 화면 대신 같은 조각과 조작 버튼으로 이어갑니다.','3D is unavailable. The same pieces and controls remain available.','立体画面不可用。相同棋子和操作按钮仍可继续使用。')}</p>`;
 const stage=$('.nm-live-stage');
 const numbers=(action,values,label=n=>n)=>values.map(n=>button(action,n,label(n))).join('');
 const input=(label,action='submit')=>`<form class="nm-journey-answer" data-answer-action="${action}"><label>${esc(label)}<input name="answer" type="text" inputmode="numeric" autocomplete="off" aria-label="${esc(label)}" required></label><button type="submit">${tr('확인','Check','确认')}</button></form>`;
 const sign=n=>n>0?'+'+n:n<0?'−'+Math.abs(n):'0';
 function copy(v){
  const role=v.word?tr('이야기에 적용','Apply to a story','应用到故事'):v.id==='number-transfer'?tr('새 수로 확인','Try new numbers','换数字验证'):v.id==='comparison'?tr('다른 걷기 비교','Compare a different walk','比较不同走法'):tr('직접 발견하기','Discover by doing','动手发现');
  if(v.kind==='ten'){
   const questions=[tr('왼쪽을 10으로 만들려면 어떻게 옮길까?','How can you move pieces to make ten on the left?','怎样移动才能让左边成为十？'),tr('옮길 조각을 고르고, 빈칸으로 보내 봐.','Select pieces, then move them into the spaces.','选择棋子，再移入空格。'),tr('열 칸에 놓인 조각을 한 묶음으로 볼까?','Can the ten filled spaces be one group?','把填满的十格看成一组好吗？'),tr('10 묶음과 남은 조각은 모두 몇 개일까?','How many pieces are in the ten and the remainder?','一组十和剩下的棋子一共有几个？'),tr('왜 전체 개수는 그대로일까?','Why has the total stayed the same?','为什么总数没有变？')];
   return {title:tr('수를 이사시켜요','Moving numbers','数字搬家'),role,question:v.word&&!v.model?tr('구슬 7개와 6개를 합하려고 해. 어떤 계산일까?','You combine seven marbles and six marbles. Which operation?','把七颗和六颗弹珠放在一起，用什么运算？'):questions[v.phase]};
  }
  if(v.kind==='integer'){
   const questions=[tr('처음 수의 위치에 서 보자.','Stand at the starting number.','站到第一个数的位置。'),tr('뒤 수의 부호를 보고, 보는 쪽을 골라 봐.','Choose where to face using the following number’s sign.','根据后一个数的符号选择面向。'),tr('가운데 기호를 보고, 걷는 방법을 골라 봐.','Choose how to walk using the operation sign.','根据运算符号选择走法。'),tr('몇 칸 걸어야 할까?','How many steps?','要走几格？'),tr('보는 쪽은 그대로! 한 칸씩 걸어 봐.','Keep facing the same way. Walk one step at a time.','面向不变，一格一格走。'),tr('지금 서 있는 위치는 어디일까?','Where are you standing now?','现在站在哪个数？'),tr('보는 쪽과 걷는 쪽의 역할을 확인해 봐.','Check the different roles of facing and walking.','确认面向和走法的不同作用。')];
   return {title:tr('보는 쪽과 걷는 쪽','Facing and walking','面向和走法'),role,question:v.word&&!v.model?tr('기온이 −1도에서 4도 올라갔어. 어떤 계산일까?','The temperature starts at −1 and rises by four degrees. Which operation?','温度从零下1度上升4度，用什么运算？'):questions[v.phase]};
  }
  const questions=[tr('두 모임을 각각 남김없이 나눠 봐.','Divide each collection without a remainder.','把两堆分别均匀分组。'),tr('같은 눈금에서 두 수의 배수를 따라가 봐.','Follow both multiples on the same scale.','在同一刻度上寻找两个数的倍数。'),tr('새 블록을 곱셈 배열로 살펴보자.','Inspect a new multiplication array.','看看新的乘法排列。'),tr('찾은 한 묶음의 크기로 다시 묶어 봐.','Regroup using the group size you discovered.','用找到的每组个数重新分组。'),tr('한 묶음의 개수와 묶음 수를 구분해 봐.','Distinguish pieces per group from the number of groups.','区分每组个数和组数。'),tr('발견한 두 수에 알맞은 이름을 붙여 봐.','Give the two discoveries their correct names.','给两个发现选择正确名称。'),tr('AB는 무슨 계산을 뜻할까?','What operation does AB represent?','AB表示什么运算？'),tr('같은 블록을 다르게 묶어도 개수는 같아.','Regrouping the same blocks preserves their total.','同一批棋子重新分组，总数不变。')];
  return {title:tr('같이 나누고, 함께 만나기','Divide together, meet together','共同分组，一起相遇'),role,question:v.word&&!v.model?(v.word==='divide'?tr('6m와 8m 리본을 같은 길이로 남김없이 잘라. 가장 긴 한 조각을 찾을까, 첫 만남을 찾을까?','Cut 6 m and 8 m ribbons equally with no remainder. Find the longest piece or a first meeting?','6米和8米丝带无剩余地等长剪开，找最长一段还是首次相遇？'):tr('6분과 8분마다 켜지는 불빛이 다시 함께 켜지는 때를 찾을까, 조각의 길이를 찾을까?','Lights flash every six and eight minutes. Find their first next meeting or a piece length?','每6分钟和8分钟亮一次的灯，找下次同时亮的时间还是一段长度？')):v.word&&v.phase===2?tr('찾은 수를 이야기의 단위와 연결해 봐.','Connect your discovery to the story’s unit.','把找到的数和故事中的单位联系起来。'):questions[v.phase]};
 }
 function controls(v){
  if(v.word&&!v.model)return v.kind==='common'?button('model','divide',tr('남김없이 같은 길이로 나누기','Equal division','等长无剩余地分组'))+button('model','meet',tr('처음 함께 만나는 때 찾기','Find the first meeting','寻找首次相遇')):numbers('model',['+','−']);
  if(v.kind==='ten'){
   if(v.phase===0)return `<p>${tr('몇 개를 옮길지 먼저 예상해 봐.','Predict how many pieces to move.','先猜猜要移动几个。')}</p>${numbers('predict',[1,2,3,4],n=>`${n}`)}${button('begin','',tr('직접 옮겨 보기','Try moving','动手移动'),v.prediction===null?'disabled':'')}`;
   if(v.phase===1)return `<div class="nm-journey-piece-controls" role="group" aria-label="${tr('옮길 조각 선택','Select pieces to move','选择要移动的棋子')}">${v.objects.filter(o=>o.origin==='right'&&o.group==='right').map(o=>button('select',o.id,`${o.mark==='stripe'?'▰':'●'} ${o.id}`,`aria-pressed="${v.selected.includes(o.id)}"`)).join('')}</div>${button('move','',tr('고른 조각 옮기기','Move selected pieces','移动选中的棋子'),!v.selected.length?'disabled':'')}`;
   if(v.phase===2)return button('group','',tr('10 묶음 확인','Confirm the group of ten','确认一组十'));
   if(v.phase===3)return input(tr('전체 개수','Total number of pieces','棋子总数'));
   if(!v.meaning)return button('meaning','moved',tr('같은 조각을 옮겼으니까','The same pieces moved','移动了原来的棋子'))+button('meaning','new',tr('새 조각이 생겼으니까','New pieces appeared','出现了新棋子'));
   return '';
  }
  if(v.kind==='integer'){
   if(v.phase===0)return numbers('start',[-3,-2,-1,0,1,2,3],sign);
   if(v.phase===1)return button('face',-1,tr('왼쪽 보기','Face left','面向左'))+button('face',1,tr('오른쪽 보기','Face right','面向右'));
   if(v.phase===2)return button('walk',1,tr('앞으로 걷기','Walk forward','向前走'))+button('walk',-1,tr('뒤로 걷기','Walk backward','向后走'));
   if(v.phase===3)return numbers('count',[1,2,3,4,5],n=>tr(`${n}칸`,`${n} steps`,`${n}格`));
   if(v.phase===4)return button('step','one',tr('한 칸 걷기','Take one step','走一格'));
   if(v.phase===5)return input(tr('도착한 수','Number at the destination','到达的数'));
   if(!v.meaning)return button('meaning','roles',tr('뒤 수는 보는 쪽, 기호는 걷는 방법','Following sign: facing. Operation: walking.','后数符号决定面向，运算符号决定走法'))+button('meaning','same',tr('보는 쪽과 걷는 쪽은 항상 같아','Facing and movement are always the same','面向和移动总是相同'));
   return '';
  }
  if(v.phase===0)return `<p>${tr('한 묶음에 놓을 개수','Pieces in each group','每组的个数')}</p>${numbers('tryGroup',Array.from({length:Math.max(v.a,v.b)},(_,i)=>i+1))}<p>${tr('두 모임에서 모두 남김없는 후보','Candidates with no remainder in either collection','两堆都无剩余的候选数')}</p>${numbers('common',[...new Set([...v.divisorsA,...v.divisorsB])])}<p>${tr('공통 후보 중 가장 큰 수','The greatest common candidate','共同候选数中最大的数')}</p>${numbers('greatest',v.common)}`;
  if(v.phase===1)return button('track','A',tr(`${v.a}씩 가기`,`Step by ${v.a}`,`每次走${v.a}`))+button('track','B',tr(`${v.b}씩 가기`,`Step by ${v.b}`,`每次走${v.b}`))+`<p>${tr('0 다음 첫 만남 선택','Select the first meeting after zero','选择0之后的首次相遇')}</p>${numbers('least',[...new Set([...v.trackA,...v.trackB])].sort((a,b)=>a-b))}`;
  if(v.word&&v.phase===2)return input(v.word==='divide'?tr('한 조각의 길이(m)','Length of one piece (m)','一段长度（米）'):tr('다시 함께 켜질 때(분)','First next meeting (minutes)','下次同时亮（分钟）'));
  if(v.word&&v.verified&&!v.meaning)return button('meaning',v.word,v.word==='divide'?tr('최대공약수는 한 조각의 길이','Greatest common divisor: length of one piece','最大公因数是一段长度'):tr('최소공배수는 처음 함께 켜지는 때','Least common multiple: first next meeting','最小公倍数是下次同时亮的时刻'));
  if(v.word)return '';
  if(v.phase===2)return button('array','',tr('곱셈 배열 살펴보기','Inspect the multiplication array','观察乘法排列'));
  if(v.phase===3)return button('regroup','',tr('같은 크기로 다시 묶기','Regroup into equal groups','重新等量分组'));
  if(v.phase===4)return input(tr('묶음은 모두 몇 개?','How many groups?','一共有几组？'),'groups');
  if(v.phase===5)return button('names','correct',tr('한 묶음의 크기 = 최대공약수 / 묶음 수 = 최소공배수','Pieces per group = greatest common divisor / group count = least common multiple','每组个数＝最大公因数／组数＝最小公倍数'))+button('names','reverse',tr('두 이름을 반대로 붙이기','Reverse the two names','交换这两个名称'));
  if(v.phase===6)return v.productRead?input(tr('전체 블록의 개수','Total number of blocks','积木总个数')):button('product','multiply',tr('A와 B를 곱해요','Multiply A by B','A乘B'))+button('product','digits',tr('두 자리 수예요','A two-digit number','一个两位数'));
  return '';
 }
 function fallback(v){
  if(v.kind==='integer')return `<div class="nm-journey-numberline">${Array.from({length:17},(_,i)=>`<span class="${i-8===v.position?'current':''}">${sign(i-8)}</span>`).join('')}</div><p>${tr('현재 위치','Current position','当前位置')} ${sign(v.position)} · ${v.face===null?'':v.face<0?'←':'→'} ${v.walk===null?'':v.walk<0?tr('뒤로','Backward','向后'):tr('앞으로','Forward','向前')}</p>`;
  if(v.kind==='common'&&(v.phase===1||v.word==='meet'&&v.model==='meet'))return [['A',v.a,v.trackA],['B',v.b,v.trackB]].map(([key,n,values])=>`<p>${n}${v.word?tr('분',' min','分钟'):tr('씩',' per step','每步')}</p><div class="nm-journey-numberline" data-track="${key}">${[0,...values].map(value=>`<span class="${value===v.least?'current':''}">${value}</span>`).join('')}</div>`).join('');
  const groups=new Map();for(const o of v.objects){const key=v.kind==='ten'?o.group:v.phase>=2&&!v.word?(v.rearranged?Math.floor(Number(o.slot)/((v.a*v.b)/v.least)):'array'):o.origin;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(o);}
  return [...groups.entries()].map(([key,objects])=>`<div class="nm-journey-card-group" data-group="${key}">${objects.map(o=>`<span data-object="${o.id}" data-origin="${o.origin}" class="${o.mark}" title="${o.id}">${o.mark==='stripe'?'▰':'●'}</span>`).join('')}</div>`).join('');
 }
 function render(snap=false){
  if(disposed)return;const v=view(state),c=copy(v);
  host.dataset.complete=String(v.complete);host.dataset.phase=v.phase;host.dataset.scene=v.id;host.dataset.saved=String(saved);host.dataset.kind=v.kind;
  $('h2').textContent=c.title;$('.nm-live-round').textContent=`${v.index+1} / ${v.sceneCount}`;
  $('.nm-journey-roles').innerHTML=scenes(uid).map((d,i)=>`<li${i===v.index?' aria-current="step"':''}>${i+1} ${i===v.index?esc(c.role):esc(d.word?tr('이야기','Story','故事'):i?tr('다른 수','Other numbers','其他数字'):tr('발견','Discover','发现'))}${state.states[i].verified&&state.states[i].meaning?' ✓':''}</li>`).join('');
  $('.nm-live-question').textContent=c.question;$('.nm-live-equation').textContent=equation(state,lang);
  $('.nm-journey-legend').textContent=v.kind==='ten'?tr('● 원래 조각 · ▰ 옮기는 조각','● Starting pieces · ▰ Moving pieces','● 原来棋子 · ▰ 移动棋子'):v.kind==='integer'?tr('처음 수 = 출발 · 뒤 수 = 보는 쪽 · 가운데 기호 = 걷기','First number: start · Following sign: facing · Operation: walking','第一个数：起点 · 后数符号：面向 · 运算符号：走法'):tr('● A 모임 · ▰ B 모임 — 따로 나눠요','● Collection A · ▰ Collection B — divide separately','● A堆 · ▰ B堆 — 分别分组');
  const evidence=$('.nm-journey-evidence');
  if(v.kind==='common'&&v.word)$('.nm-journey-legend').textContent=v.word==='divide'?tr('● 6m 리본 · ▰ 8m 리본 — 같은 길이로 잘라요','● 6 m ribbon · ▰ 8 m ribbon — cut equal lengths','● 6米丝带 · ▰ 8米丝带 — 等长剪开'):tr('● 6분마다 · ▰ 8분마다 — 0 다음 첫 만남','● Every 6 min · ▰ Every 8 min — first meeting after zero','● 每6分钟 · ▰ 每8分钟 — 0之后的首次相遇');
  else if(v.kind==='common'&&v.phase===1)$('.nm-journey-legend').textContent=tr(`● ${v.a}씩 · ▰ ${v.b}씩 — 0 다음 첫 만남`,`● Step by ${v.a} · ▰ Step by ${v.b} — first meeting after zero`,`● 每次${v.a} · ▰ 每次${v.b} — 0之后的首次相遇`);
  evidence.textContent=v.kind==='ten'?tr(`왼쪽 ${v.a+v.moved.length}개 · 오른쪽 ${v.b-v.moved.length}개${v.moved.length&&v.phase<2?' · 옮기는 중':''}`,`Left: ${v.a+v.moved.length} · Right: ${v.b-v.moved.length}`,`左边${v.a+v.moved.length}个 · 右边${v.b-v.moved.length}个`):v.kind==='integer'?tr(`출발 준비와 본 걸음은 별개야. 본 걸음 ${v.steps}${v.target!==null?' / '+v.target:''}칸`,`Preparation is separate. Main steps: ${v.steps}${v.target!==null?' / '+v.target:''}`,`起点准备不计入正式步数。正式步数${v.steps}${v.target!==null?' / '+v.target:''}`):v.phase===0&&v.groupSize?tr(`${v.a}개: ${Math.floor(v.a/v.groupSize)}묶음, 남음 ${v.a%v.groupSize}개 · ${v.b}개: ${Math.floor(v.b/v.groupSize)}묶음, 남음 ${v.b%v.groupSize}개`,`${v.a}: ${Math.floor(v.a/v.groupSize)} groups, remainder ${v.a%v.groupSize} · ${v.b}: ${Math.floor(v.b/v.groupSize)} groups, remainder ${v.b%v.groupSize}`,`${v.a}个：${Math.floor(v.a/v.groupSize)}组，余${v.a%v.groupSize}个 · ${v.b}个：${Math.floor(v.b/v.groupSize)}组，余${v.b%v.groupSize}个`):v.rearranged?tr(`한 묶음 ${v.greatest}개 · ${v.least}묶음`,`Each group: ${v.greatest} pieces · ${v.least} groups`,`每组${v.greatest}个 · ${v.least}组`):'';
  $('.nm-journey-controls').innerHTML=controls(v);
  for(const b of host.querySelectorAll('[data-action="predict"],[data-action="common"],[data-action="tryGroup"]'))b.setAttribute('aria-pressed',String(b.dataset.action==='predict'?Number(b.dataset.value)===v.prediction:b.dataset.action==='common'?v.common.includes(Number(b.dataset.value)):Number(b.dataset.value)===v.groupSize));
  if(v.word==='divide'&&v.groupSize)evidence.textContent=tr(`6m: ${Math.floor(v.a/v.groupSize)}조각, 남음 ${v.a%v.groupSize}m · 8m: ${Math.floor(v.b/v.groupSize)}조각, 남음 ${v.b%v.groupSize}m`,`${v.a} m: ${Math.floor(v.a/v.groupSize)} pieces, remainder ${v.a%v.groupSize} m · ${v.b} m: ${Math.floor(v.b/v.groupSize)} pieces, remainder ${v.b%v.groupSize} m`,`${v.a}米：${Math.floor(v.a/v.groupSize)}段，余${v.a%v.groupSize}米 · ${v.b}米：${Math.floor(v.b/v.groupSize)}段，余${v.b%v.groupSize}米`);
  const translatedFeedback=feedbackTranslations[state.feedback];
  const hintForStory=v.word==='meet'?tr('0 다음에 두 불빛이 처음 함께 켜지는 때를 찾아봐.','Find when both lights first flash together after zero.','找出0之后两盏灯首次同时亮的时刻。'):v.word==='divide'?tr('두 리본을 같은 길이로 잘랐을 때 남는 길이가 있는지 봐.','Check for leftover length when both ribbons are cut equally.','检查两条丝带等长剪开后是否有剩余。'):null;
  $('.nm-live-feedback').textContent=state.feedback?(state.feedback==='두 모임이 각각 남김없이 나뉘는지 봐.'&&hintForStory?hintForStory:lang==='ko'?state.feedback:translatedFeedback?.[lang==='en'?0:1]||tr(state.feedback,'Check the action and try again.','检查操作后再试。')):!v.verified?'':v.meaning?tr(v.assisted?'도움받아 확인했어요. 다음에는 혼자 해 봐요.':'혼자 조작하고 뜻까지 확인했어요.',v.assisted?'Verified with help. Try independently next time.':'You verified the actions and their meaning independently.',v.assisted?'在帮助下完成了确认，下次试着独立完成。':'已独立完成操作和含义确认。'):tr('뜻을 한 번 더 확인해 봐요.','Check the meaning as well.','再确认含义。');
  if(v.kind==='integer'&&v.meaning){const p=document.createElement('p');p.textContent=tr('플플·마마는 플, 플마·마플은 마. 가운데 기호와 뒤 수의 부호를 합친 이동 방향이며, 답의 부호를 정하는 규칙은 아니야.','Matching operation and following signs move right; differing signs move left. This does not determine the answer’s sign.','运算符号与后数符号相同则向右，不同则向左。这不是结果符号的规则。');evidence.appendChild(p);}
  if(v.kind==='common'&&v.rearranged&&v.phase===4)evidence.textContent=tr(`한 묶음 ${v.greatest}개 · 묶음은 몇 개일까?`,`Each group has ${v.greatest} pieces. How many groups?`,`每组${v.greatest}个，一共有几组？`);
  if(v.kind==='common'&&v.productRead){const formula=document.createElement('p');formula.className='nm-journey-formula';formula.textContent='A × B = L × G';evidence.appendChild(formula);const p=document.createElement('p');p.textContent=tr('A와 B는 두 수, L은 최소공배수, G는 최대공약수. AB는 A×B야. 아빠는 LG를 좋아해요!','A and B are the two numbers; L is their least common multiple and G their greatest common divisor. AB means A×B.','A、B是两个数，L是最小公倍数，G是最大公因数。AB表示A×B。');evidence.appendChild(p);}
  $('.nm-journey-fallback').innerHTML=fallback(v);
  $('[data-action="undo"]').disabled=!v.history.length||writing;
  $('[data-action="next"]').disabled=!(v.verified&&v.meaning&&saved)||v.index===v.sceneCount-1||writing;
  $('[data-action="next"]').hidden=v.index===v.sceneCount-1;
  $('[data-action="retry"]').hidden=saved||writing;
  $('.nm-journey-save').textContent=writing?tr('저장 중…','Saving…','正在保存…'):saved?tr(v.complete?'모든 장면의 개념·적용 확인을 저장했어요. 점수·코인은 바뀌지 않아요.':'조작 상태를 저장했어요.','Practice state saved; scored progress and coins are unchanged.','练习状态已保存，不改变分数和金币。'):tr('저장을 확인하지 못했어요. 다시 시도해 주세요.','Save not confirmed. Please retry.','未确认保存，请重试。');
  if(busy)host.querySelectorAll('.nm-journey-controls button,.nm-journey-controls input').forEach(b=>b.disabled=true);
  visual?.sync(v,snap);
  options.onStatus?.({complete:v.complete,saved,assisted:v.assisted,completed:v.completed});
 }
 async function persist(quiet=false){
  writing=true;if(!quiet){saved=false;render();}const rev=state.revision,seq=state.actionSequence,output=JSON.parse(JSON.stringify(state));
  try{if(typeof options.save!=='function')throw Error('No persistence writer');output.saveStatus='saved';await options.save(output);if(disposed||rev!==state.revision||seq!==state.actionSequence)return;saved=true;state.saveStatus='saved';}
  catch{if(rev===state.revision&&seq===state.actionSequence){saved=false;state.saveStatus='pending';}}
  finally{if(!disposed){writing=false;if(!quiet)render();else if(!saved){host.dataset.saved='false';$('.nm-journey-save').textContent=tr('이 기기의 저장을 확인하지 못했어요. 저장을 다시 시도해 주세요.','Device save not confirmed. Please retry.','未确认本机保存，请重试。');$('[data-action="retry"]').hidden=false;options.onStatus?.({complete:view(state).complete,saved:false});}}}
 }
 async function dispatch(action,value){
  if(disposed||writing)return;
  if(action==='town'){options.onTown?.();return;}
  if(action==='retry'){await persist();return;}
  if(busy&&!['undo','reset'].includes(action))return;
  const before=view(state);state=act(state,action,value,`${session}:${++sequence}`);
  if(view(state).complete)state=finalize(state);
  const after=view(state),changed=after.revision!==before.revision;
  busy=changed&&['move','start','face','step','regroup'].includes(action)&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
  clearTimeout(timer);if(busy)timer=setTimeout(()=>{busy=false;render();},750);
  render(action==='next'||action==='reset'||action==='undo');
  await persist();
  if(!busy){const focus=$('.nm-journey-controls button:not(:disabled),.nm-journey-controls input');focus?.focus({preventScroll:true});}
 }
 function captureUI(){if(disposed)return;const active=document.activeElement;state.ui={scrollTop:scroller?.scrollTop||0,action:host.contains(active)?active.dataset.action:null,value:host.contains(active)?active.dataset.value:null};}
 function saveUI(){clearTimeout(uiTimer);uiTimer=setTimeout(()=>{if(disposed||!saved)return;if(writing){saveUI();return;}captureUI();persist(true);},500);}
 function click(e){const b=e.target.closest('button[data-action]');if(b&&host.contains(b)&&!b.disabled){captureUI();dispatch(b.dataset.action,b.dataset.value);}}
 function submit(e){if(!e.target.matches('.nm-journey-answer'))return;e.preventDefault();const value=e.target.elements.answer.value.trim();if(!/^[−-]?\d+$/.test(value))return;captureUI();dispatch(e.target.dataset.answerAction||'submit',Number(value.replace('−','-')));}
 const observer=new MutationObserver(()=>{if(!host.isConnected)dispose();});observer.observe(document.body,{subtree:true,childList:true});
 host.addEventListener('click',click);host.addEventListener('submit',submit);scroller?.addEventListener('scroll',saveUI,{passive:true});
 function dispose(){if(disposed)return;disposed=true;clearTimeout(timer);clearTimeout(uiTimer);observer.disconnect();scroller?.removeEventListener('scroll',saveUI);host.removeEventListener('click',click);host.removeEventListener('submit',submit);visual?.dispose();delete host.__livingLesson;}
 const controller={dispose,getState:()=>JSON.parse(JSON.stringify(state)),getView:()=>view(state),getManifest:()=>({version:1,unit:uid,graded:false,reward:0,roles:scenes(uid),invariants:['identity','quantity','operation-role','independent-transfer']}),getVisualState:()=>visual?.inspect(),dispatch};
 host.__livingLesson=controller;render(true);await persist();
 try{
  const [T,chars,module]=await Promise.all([import('../../world-explorer/vendor/three.module.js'),import('./char3d/char3d.js'),import('./journey-stage.js')]);
  if(disposed||!host.isConnected)return controller;
  visual=module.createStage(stage,T,chars,view(state),id=>dispatch('select',id),()=>{if(!disposed){stage.dataset.renderer='fallback';$('.nm-live-render-note').hidden=false;busy=false;render();}});
  stage.dataset.renderer='webgl';visual.sync(view(state),true);
 }catch{if(!disposed){stage.dataset.renderer='fallback';$('.nm-live-render-note').hidden=false;}}
 if(!disposed&&options.saved?.ui)requestAnimationFrame(()=>{if(disposed)return;const ui=options.saved.ui;if(scroller)scroller.scrollTop=ui.scrollTop||0;const b=[...host.querySelectorAll('[data-action]')].find(b=>b.dataset.action===ui.action&&b.dataset.value===ui.value&&!b.disabled);b?.focus({preventScroll:true});});
 return controller;
}
