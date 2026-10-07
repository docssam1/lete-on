import {createUnboxing,partsMarkup} from './unboxing.js?v=1';
import {assemblySlides as slides,assemblyPhotos as photos} from './assembly-steps.js?v=2';
import {createRig} from './model.js?v=3';
import {createGuide} from './guide.js';
import {steps} from './lesson.js';

const root=document.querySelector('#assembly-root'),help=document.querySelector('#assembly-help');
let index=-1,opened=false,guardian=false,stopped=false,view='photo',position='off',rig,guide,returnFocus,helpKind='';
const unboxing=createUnboxing({packageSrc:photos.package.src,partsSrc:photos.parts.src,onComplete:()=>{opened=true;enter(1);}});
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const cleanup=()=>{guide?.dispose();guide=null;rig?.dispose();rig=null;};
const cells=()=>slides[index]?.kind==='test'&&guardian&&!stopped;
function rigUpdate(demo=false){const s=slides[index];rig?.set({id:s.model||'assembly',mode:'stand',cell1:cells(),cell2:cells(),position:stopped?'off':position,exploded:!!s.exploded,highlight:true,demo});}
function enter(next){
 if(next>=14&&!guardian)next=13;
 if(stopped&&next>index)return;
 index=Math.max(0,Math.min(slides.length-1,next));position='off';view=slides[index].defaultModel?'model':'photo';render();
 root.querySelector('h1')?.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});
}
function welcome(){
 unboxing.cancel();cleanup();index=-1;root.dataset.stage='welcome';root.innerHTML=`<section class="assembly-welcome"><p class="assembly-eyebrow">봉지 열기부터 완성까지, 코미와 함께</p><h1>코미와 스탠드를 만들어요</h1><div class="komi-arrival"><div class="komi-speech"><p>준비물이 준비되었나요?<br><strong>그럼 저를 클릭해 주세요.</strong></p></div><button class="komi-start" type="button" aria-label="코미를 클릭해 조립 시작"><span class="komi-floating"><span class="komi-character" role="img" aria-label="흰 실험복을 입은 코미"></span></span><span class="komi-click-label">코미를 클릭해요 →</span></button><span class="komi-ground-shadow" aria-hidden="true"></span></div><p class="assembly-ready-note">교구 봉지와 설명서, 붙일 종이와 테이프를 책상 위에 놓아요.<br>건전지는 따로 두고 보호자와 함께 시작해요.</p></section>`;
 root.querySelector('.komi-start').addEventListener('click',()=>{opened=false;void unboxing.play();if(!reduced.matches)root.animate([{opacity:.45,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:300,easing:'ease-out'});});
}
function imageMarkup(s){const p=photos[s.photo];if(s.id==='parts')return partsMarkup(p.src);return `<figure class="assembly-photo"><div class="assembly-photo-frame"><img src="${p.src}" alt="${p.alt}" decoding="async">${s.focus?`<span class="assembly-wire-marker wire-marker-${s.focus}" aria-label="이번에 연결할 ${s.focus}번 선">${s.focus}</span>`:''}</div><figcaption>${p.caption}</figcaption></figure>`;}
function bagMarkup(){return `<figure class="assembly-bag ${opened?'is-open':''}"><div class="bag-opening"><img class="bag-contents" src="${photos.parts.src}" alt="봉지를 열어 꺼낸 판 부품"><button class="bag-trigger" type="button" data-open-bag aria-label="준비물 봉지를 눌러 뜯기" ${opened?'disabled':''}><span class="bag-body"><img src="${photos.package.src}" alt="전지가 없는 준비물 봉지"></span><span class="bag-top" aria-hidden="true"><img src="${photos.package.src}" alt=""></span><span class="bag-touch-label">봉지 뜯기 다시 보기 ↗</span></button><span class="bag-open-note" role="status">${opened?'봉지가 열렸어요. 이제 판에서 부품을 떼어내요.':''}</span></div><figcaption>${photos.package.caption}</figcaption>${opened?'<button type="button" data-replay-bag>봉투 뜯기 다시 보기</button>':''}</figure>`;}
function render(){
 cleanup();const s=slides[index];root.dataset.stage=s.id;root.dataset.cells=cells()?'inserted':'removed';
 root.innerHTML=`<section class="assembly-deck"><div class="assembly-progress"><span>만들기 <strong>${String(index+1).padStart(2,'0')}</strong> / ${slides.length}</span><progress max="${slides.length}" value="${index+1}" aria-label="조립 안내 진행"></progress><button type="button" data-assembly-contents>전체 순서</button></div><div class="assembly-slide"><div class="assembly-media"><div class="assembly-media-tabs" ${!s.model?'hidden':''}><button type="button" data-view="photo" aria-pressed="${view==='photo'}">사진 보기</button><button type="button" data-view="model" aria-pressed="${view==='model'}">3D 보기</button></div>${view==='model'&&s.model?`<div class="assembly-model"><canvas id="assembly-model" aria-label="${s.title} 3D 조립 모형" tabindex="0"></canvas><button type="button" data-assembly-demo>연결·조립 다시 보기</button><p>모형을 드래그해 돌려요. 실제 홈과 단자는 교구에서 확인해요.</p></div>`:s.kind==='bag'?bagMarkup():imageMarkup(s)}${s.kind==='test'?`<div class="assembly-switch" aria-label="스위치 작동 확인">${[['off','○ 가운데'],['low','Ⅰ 1단'],['high','Ⅱ 2단']].map(([p,label])=>`<button type="button" data-assembly-position="${p}" aria-pressed="${position===p}" ${stopped?'disabled':''}>${label}</button>`).join('')}</div><p class="assembly-model-note">화면 밝기는 참고 모형이에요. 실물에서 작동을 확인해요.</p>`:''}</div><div class="assembly-directions"><p class="assembly-eyebrow">${s.kind==='test'?'완성 후 작동 확인':s.id==='finish'?'완성과 정리':'직접 따라 만들어요'}</p><h1 tabindex="-1">${s.title}</h1><p class="assembly-action">${s.body}</p><aside class="assembly-care"><strong>꼭 주의해요</strong><p>${s.care}</p></aside>${s.kind==='inspect'?`<label class="assembly-guardian"><input type="checkbox" data-guardian ${guardian?'checked':''}> 보호자와 연결·규격을 확인했어요.</label>`:''}${stopped?'<p class="assembly-stop" role="alert">실험을 멈췄어요. 뜨거운 부분은 만지지 말고 어른에게 도움을 요청해요.</p>':''}${s.voice?'<div class="mentor assembly-guide"></div>':'<aside class="assembly-mini-coach"><span class="assembly-mini-character" role="img" aria-label="코미"></span><p>한 번에 한 단계씩 만들어요.<br>막히면 <strong>도와주세요</strong>를 눌러요.</p></aside>'}<div class="assembly-support"><button type="button" data-assembly-help>도와주세요</button><a href="https://m.site.naver.com/1e5E0" target="_blank" rel="noopener noreferrer">책의 조립 영상 ↗</a></div></div></div><nav class="assembly-navigation" aria-label="조립 슬라이드 이동"><button type="button" data-assembly-previous>← ${index===0?'코미에게 돌아가기':'이전'}</button><span class="assembly-navigation-note">${s.kind==='inspect'&&!guardian?'보호자 확인 후 전지를 넣어요.':s.kind==='bag'&&!opened?'봉지를 눌러 열고 다음으로 가요.':index===slides.length-1?'전지를 빼고 정리하면 끝이에요.':'직접 만든 뒤 다음으로 가요.'}</span>${index===slides.length-1?'<a class="assembly-next" href="./index.html">조립 마치기 →</a>':`<button type="button" class="assembly-next" data-assembly-next ${(s.kind==='inspect'&&!guardian)||(s.kind==='bag'&&!opened)||stopped?'disabled':''}>${s.kind==='inspect'?'확인했어요 · 전지 넣기':'다음 조립 →'}</button>`}</nav></section>`;
 if(view==='model'&&s.model){try{rig=createRig(root.querySelector('#assembly-model'));rigUpdate();}catch(error){console.error(error);root.querySelector('.assembly-model').innerHTML=imageMarkup(s)+'<p>3D를 열지 못했어요. 사진과 글 안내로 만들어요.</p>';}}
 if(s.voice){const line=steps.find(item=>item.id===s.voice);guide=createGuide(root.querySelector('.assembly-guide'));guide.set('fabre09-'+line.id,line.voice,false);}
}
function openBag(){if(opened)return;opened=true;const bag=root.querySelector('.assembly-bag');bag.classList.add('is-open');bag.querySelector('.bag-trigger').disabled=true;bag.querySelector('.bag-open-note').textContent='봉지가 열렸어요. 작은 부품을 천천히 꺼내요.';root.querySelector('[data-assembly-next]').disabled=false;root.querySelector('.assembly-navigation-note').textContent='부품을 꺼내고 다음으로 가요.';}
const helpTopics={
 parts:{title:'부품을 찾기 어려워요',steps:['A·B·C·D·E와 F 두 장을 설명서와 함께 나란히 놓아요.','없는 부품은 선생님이나 보호자에게 봉지와 설명서를 보여드려요.']},
 wire:{title:'선을 어디에 연결할지 모르겠어요',steps:['전지는 빼 두고, 이 단계의 선 하나만 시작과 끝을 짚어요.','스위치 단자 배열은 교구 표시에서 보호자와 확인해요.','다른 단자와 금속이 맞닿은 곳은 보호자에게 보여주세요.']},
 fit:{title:'판이 잘 안 끼워져요',steps:['억지로 누르지 말고 판을 잠깐 빼 놓아요.','홈에 종이나 전선이 끼었는지 살펴요.','C는 위, B는 가운데, A는 아래에 맞춰요.']},
 dark:{title:'불이 안 켜져요',steps:['가운데 ○로 끄고 보호자와 전지를 빼요.','전구가 제대로 끼워졌는지, 소켓 두 접점의 연결이 느슨한지 확인해요.','보호자가 전지 방향과 스위치 공통·1단·2단 단자를 확인해요.']},
 same:{title:'1단과 2단이 똑같아요',steps:['가운데 ○로 끄고 보호자와 전지를 빼요.','1단 선은 두 끼우개 사이 연결점에, 2단 선은 둘째 끼우개의 남은 검은 선에 이어져야 해요.','보호자가 같은 종류와 상태의 전지 두 개와 전구 규격을 확인해요.']},
 hot:{title:'전지·전선이 뜨거워요',steps:['즉시 멈추고, 뜨거운 전지나 전선을 만지지 않아요.','어른에게 알려요. 전지 분리·제거는 보호자가 확인해요.','보호자가 확인하기 전에는 전지를 다시 넣지 않아요.']}
};
function requestText(){return `팝콘 실험실 조립 도움 요청\n${index<0?'시작 준비':`${index+1}/${slides.length} · ${slides[index].title}`}\n${helpKind?helpTopics[helpKind].title:'이 단계에서 도움이 필요해요.'}\n선생님이나 보호자와 함께 확인하고 싶어요.`;}
function showHelp(topic=''){
 guide?.pause();helpKind=topic;if(!help.open)returnFocus=document.activeElement;
 if(topic==='hot'){stopped=true;guardian=false;position='off';if(index>=0)render();}
 const h=helpTopics[topic];help.innerHTML=`<header><h2 id="assembly-help-title">${h?h.title:'조립 도움 요청'}</h2><button type="button" data-help-close aria-label="도움 요청 닫기">닫기 ×</button></header><p class="assembly-help-context">${index<0?'시작 준비':`${index+1}단계 · ${slides[index].title}`}</p>${h?`<ol>${h.steps.map(t=>`<li>${t}</li>`).join('')}</ol><button type="button" data-help-topics>다른 도움 보기</button>`:`<p>막힌 곳을 골라 안내를 보거나, 아래 화면을 선생님·보호자에게 보여주세요.</p><div class="assembly-help-topics">${Object.entries(helpTopics).map(([key,t])=>`<button type="button" data-help-topic="${key}">${t.title}</button>`).join('')}</div>`}<section class="assembly-help-request"><h3>선생님·보호자에게 보여주세요</h3><textarea readonly aria-label="도움 요청 내용">${esc(requestText())}</textarea><button type="button" data-help-copy>도움 요청 문장 복사</button><p class="assembly-copy-status" role="status">이 화면의 요청 문장을 직접 보여주거나 복사해 전달해요.</p></section>${stopped?'<button type="button" class="assembly-resume" data-help-resume>보호자와 다시 확인하기</button>':''}`;
 if(!help.open)help.showModal();help.querySelector('[data-help-close]').focus();
}
function contents(){guide?.pause();returnFocus=document.activeElement;help.innerHTML=`<header><h2 id="assembly-help-title">봉지 열기부터 완성까지</h2><button type="button" data-help-close>닫기 ×</button></header><ol class="assembly-contents">${slides.map((s,i)=>`<li><button type="button" data-slide="${i}" ${i>=14&&!guardian?'disabled':''} ${i===index?'aria-current="step"':''}>${s.title}</button></li>`).join('')}</ol>`;help.showModal();}
root.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.detach){b.classList.toggle('is-detached');const done=b.classList.contains('is-detached');b.setAttribute('aria-pressed',String(done));b.querySelector('.detach-label').textContent=done?'분리 위치 확인':'눌러 떼어보기';}
 if(b.hasAttribute('data-replay-bag'))void unboxing.play();
 if(b.hasAttribute('data-open-bag'))openBag();
 if(b.hasAttribute('data-assembly-next'))enter(index+1);
 if(b.hasAttribute('data-assembly-previous'))index===0?welcome():enter(index-1);
 if(b.dataset.view){view=b.dataset.view;render();}
 if(b.hasAttribute('data-assembly-demo'))rigUpdate(true);
 if(b.dataset.assemblyPosition){position=b.dataset.assemblyPosition;rigUpdate();root.querySelectorAll('[data-assembly-position]').forEach(t=>t.setAttribute('aria-pressed',String(t.dataset.assemblyPosition===position)));}
 if(b.hasAttribute('data-assembly-contents'))contents();
});
root.addEventListener('change',e=>{if(e.target.hasAttribute('data-guardian')){guardian=e.target.checked;root.querySelector('[data-assembly-next]').disabled=!guardian||stopped;root.querySelector('.assembly-navigation-note').textContent=guardian?'확인 뒤 전지를 넣고 시험해요.':'보호자 확인 후 전지를 넣어요.';}});
document.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;
 if(b.hasAttribute('data-assembly-help'))showHelp();
 if(b.hasAttribute('data-assembly-fullscreen')){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{b.textContent='이 기기는 전체 화면 미지원';}}
});
help.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;
 if(b.hasAttribute('data-help-close'))help.close();
 if(b.dataset.helpTopic)showHelp(b.dataset.helpTopic);
 if(b.hasAttribute('data-help-topics'))showHelp();
 if(b.hasAttribute('data-help-copy')){try{await navigator.clipboard.writeText(requestText());help.querySelector('.assembly-copy-status').textContent='복사했어요. 선생님이나 보호자에게 직접 전달해요.';}catch{help.querySelector('textarea').select();help.querySelector('.assembly-copy-status').textContent='선택한 문장을 복사하거나 이 화면을 보여주세요.';}}
 if(b.hasAttribute('data-help-resume')){stopped=false;guardian=false;help.close();if(index>=13)enter(13);else if(index>=0)enter(index);else welcome();}
 if(b.dataset.slide!==undefined){const to=Number(b.dataset.slide);help.close();enter(to);}
});
help.addEventListener('close',()=>{if(returnFocus?.isConnected)returnFocus.focus();else root.querySelector('h1')?.focus({preventScroll:true});});
document.addEventListener('keydown',e=>{if(help.open||index<0||e.altKey||e.ctrlKey||e.metaKey||e.defaultPrevented||e.target.closest?.('input,textarea,select,button,a,canvas'))return;if(['ArrowRight','PageDown'].includes(e.key)){e.preventDefault();root.querySelector('[data-assembly-next]')?.click();}else if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();root.querySelector('[data-assembly-previous]')?.click();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)guide?.pause();});window.addEventListener('pagehide',()=>{cleanup();unboxing.dispose();});
welcome();
