/* Presentation translations only. Never reads or writes student progress. */
(function(){
'use strict';
const languages=['ko','en','zh'];
let saved='ko';try{saved=localStorage.getItem('nmLang')||'ko';}catch(e){}
const query=new URL(location.href).searchParams.get('lang');
let language=languages.includes(query)?query:languages.includes(saved)?saved:'ko';
const pick=value=>typeof value==='string'?value:(value?.[language]??value?.ko??'');
const text=(ko,en,zh)=>pick({ko,en,zh});
const entries={
 skip:['책 내용으로 건너뛰기','Skip to the book','跳到书中内容'],
 kicker:['숫자가 마법이 되는 곳','Where numbers become magic','数字化为魔法的地方'],
 edition:['계산하는 힘, 읽고 생각하는 힘','Calculate. Read. Think.','会计算，会阅读，会思考'],
 name:['수의 마법','The magic of numbers','数字魔法'],
 caption:['수는, 펼치면 쉬워진다','Unfold numbers. Find the pattern.','展开数字，发现规律'],
 open:['책을 눌러 펼쳐 보세요 ↗','Tap the book to open it ↗','轻点书本，开启旅程 ↗'],
 openAria:['수의 마법 책 펼치기','Open Numbers of Magic','打开数字魔法书'],
 reader:['펼쳐진 수의 마법 책','Numbers of Magic open book','展开的数字魔法书'],
 home:['책 표지로 돌아가기','Return to the cover','返回封面'],
 consult:['오픈톡 상담 ↗','Contact us ↗','咨询我们 ↗'],
 discovery:['작은 발견이, 수학의 자신감으로.','Small discoveries. Growing confidence.','小小发现，建立数学自信。'],
 hero:['수를 움직이면<br>생각이 보입니다.','Move the numbers.<br>See the thinking.','动一动数字，<br>看见思路。'],
 heroFoot:['유아 · 똑같이 만들기','Early years · equal sharing','幼儿 · 平均分一分'],
 tryLabs:['중·고등 체험하기 ↗','Explore the labs ↗','体验数学实验 ↗'],
 invitation:['교과와 사고력을 이어 주는<br>연산과 언어사고력.','Calculation and reasoning.<br>From patterns to word problems.','运算与语言思考，<br>连接课内数学与思维。'],
 travel:['수의 마법으로 여행 →','Begin the journey →','开启数字魔法之旅 →'],
 preview:['수의 마법 미리보기','Numbers of Magic preview','数字魔法预览'],
 film:['소개 영상','Introduction film','介绍视频'],
 chooseFilm:['소개 영상 선택','Choose a film','选择视频'],
 full:['전체 영상','Full film','完整视频'], short:['짧은 영상','Short film','短视频'],
 openSample:['실제 학습지 펼치기 →','Open the worksheets →','展开真实学习单 →'],
 labLead:['눈으로 발견하고, 손으로 이해하는 수학','See it. Move it. Understand it.','亲眼发现，动手理解'],
 labLevels:['체험 단계','Lab level','实验阶段'], sheetLevels:['학습지 단계','Worksheet level','学习单阶段'],
 preschool:['유아','Early years','幼儿'], elementary:['초등','Primary','小学'], middle:['중등','Middle','初中'], high:['고등','High','高中'],
 village:['마을 소개','Explore the village','探索村庄'],
 villageFrame:['숫자 친구와 함께 둘러보는 실제 수의 마법 3D 마을','Explore the real 3D village with number friends','和数字朋友一起探索真实3D村庄'],
 sheetLead:['발견한 원리를, 내 것으로.','Make each discovery your own.','把发现的原理变成自己的本领。'],
 sheetTitle:['읽고, 생각하고, 직접 풉니다.','Read. Think. Solve.','读一读，想一想，动手解题。'],
 concept:['개념 이해','Understand','理解概念'], practice:['연산 연습','Practise','运算练习'], extend:['생각의 확장','Think further','拓展思考'],
 wordPreview:['문장제 연습 먼저 보기 ↗','Preview word problems ↗','先看应用题练习 ↗'],
 excerpt:['실제 학습지 발췌 ↗','Real worksheet extract ↗','真实学习单节选 ↗'],
 leftSheet:['왼쪽 학습지 크게 보기','Enlarge the left page','放大左页'],rightSheet:['오른쪽 학습지 크게 보기','Enlarge the right page','放大右页'],
 backIntro:['← 소개','← Overview','← 简介'], previousSheet:['이전 학습지 쪽','Previous worksheet page','上一页学习单'],nextSheet:['다음 학습지 쪽','Next worksheet page','下一页学习单'],
 zoom:['확대 ↗','Enlarge ↗','放大 ↗'],zoomTitle:['학습지 확대','Enlarged worksheet','放大学习单'],closeZoom:['확대 닫기','Close enlarged view','关闭放大视图'],close:['닫기 ×','Close ×','关闭 ×'],
 roadmapLead:['목표를 향해, 한 걸음씩.','One step towards your goal.','朝着目标，一步一步前进。'],
 roadmapTitle:['수 감각에서 수학의 언어까지.','From number sense to mathematics.','从数感到数学语言。'],
 pace:['우리 아이 속도로.','At your own pace.','按照自己的节奏。'],paceDetail:['진도·문항량 각각 0.7–1.5배 조절','Pace and practice amount: 0.7–1.5× each','进度与题量可分别调整为0.7–1.5倍'],
 paceGroup:['주간 학습 횟수 예시','Weekly schedule preview','每周学习次数示例'],once:['주 1회','Once a week','每周1次'],twice:['주 2회','Twice a week','每周2次'],
 journey:['7단계 학습 여정','Seven-stage learning journey','七阶段学习之旅'],starting:['학년보다 지금의 이해에서 시작합니다.','Start with understanding, not a grade.','从当前理解出发，不拘泥于年级。'],
 example:['이렇게 생각이 이어집니다.','Watch the ideas connect.','看思路如何连接。'],enter:['마법의 마을 들어가기 ↗','Enter the magic village ↗','进入魔法村 ↗'],startingConsult:['우리 아이 시작점 상담 ↗','Find a starting point ↗','咨询学习起点 ↗'],
 controls:['소개 영상 재생 조작','Film playback controls','视频播放控制'],play:['재생','Play','播放'],pause:['일시정지','Pause','暂停'],mute:['음소거','Mute','静音'],unmute:['소리 켜기','Unmute','开启声音'],seek:['영상 재생 위치','Playback position','播放位置'],
 previous:['이전 책장','Previous spread','上一跨页'],next:['다음 책장','Next spread','下一跨页'],chapters:['책의 차례','Book chapters','书本目录'],
 navVideo:['영상','Film','视频'],navMenu:['발견','Discover','发现'],navLabs:['체험','Labs','实验'],navVillage:['마을','Village','村庄'],navWorksheet:['학습지','Practice','学习单'],navRoadmap:['로드맵','Journey','路线'],
 videoNote:['','Original film in Korean','韩语原版视频'],sampleNote:['','Original worksheet samples in Korean','韩语原版学习单节选']
};
function t(key,vars){const values=entries[key];let result=values?values[languages.indexOf(language)]:key;Object.entries(vars||{}).forEach(([k,v])=>{result=result.split('{'+k+'}').join(String(v));});return result;}
const bindings=[
 ['.skip-link','skip'],['.cover-kicker','kicker'],['.cover-edition','edition'],['.cover-name-ko','name'],['.cover-math-caption','caption'],['.open-hint','open'],['#openBook','openAria','aria-label'],['[data-scene="reader"]','reader','aria-label'],['#bookHome','home','aria-label'],['.consult-link','consult'],
 ['.welcome-heading p','discovery'],['#menuTitle','hero','html'],['.welcome-foot>span','heroFoot'],['.welcome-foot [data-route="labs"]','tryLabs'],['.invitation-copy>p','invitation','html'],['.invitation-copy [data-route="video"]','travel'],['#teaserVideo','preview','aria-label'],['[data-panel="video"],#introVideo','film','aria-label'],['.cut-switch','chooseFilm','aria-label'],['[data-cut="full"]','full'],['[data-cut="short"]','short'],['#videoFinish [data-route="worksheet"],#openSamples','openSample'],
 ['.panel-labs>.section-heading p','labLead'],['.panel-labs .level-tabs,.lab-page-switch','labLevels','aria-label'],['.panel-worksheet .level-tabs','sheetLevels','aria-label'],['[data-panel="village"]','village','aria-label'],['#villageFrame','villageFrame','title'],['.panel-worksheet>.section-heading p','sheetLead'],['#worksheetTitle','sheetTitle'],['.sample-sequence span:nth-of-type(1)','concept'],['.sample-sequence span:nth-of-type(2)','practice'],['.sample-sequence span:nth-of-type(3)','extend'],['#wordPreview','wordPreview'],['#samplePreview','openSample','aria-label'],['#samplePreview>span','excerpt'],['[data-zoom="0"]','leftSheet','aria-label'],['[data-zoom="1"]','rightSheet','aria-label'],['#closeSamples','backIntro'],['#sheetPrev','previousSheet','aria-label'],['#sheetNext','nextSheet','aria-label'],['#zoomSheet','zoom'],['#sheetZoom','zoomTitle','aria-label'],['#zoomClose','close'],['#zoomClose','closeZoom','aria-label'],['#zoomImage','zoomTitle','alt'],
 ['.panel-roadmap>.section-heading p','roadmapLead'],['#roadmapTitle','roadmapTitle'],['.pace-control>div','paceGroup','aria-label'],['[data-pace="1"]','once'],['[data-pace="2"]','twice'],['#roadmapRows','journey','aria-label'],['.roadmap-note>span','starting'],['#stageExample>p','example'],['.roadmap-footer .primary-button','enter'],['.roadmap-footer .text-button','startingConsult'],['#cinemaControls','controls','aria-label'],['#videoProgress','seek','aria-label'],['#bookBack','previous','aria-label'],['#bookNext','next','aria-label'],['.chapter-nav','chapters','aria-label']
];
function apply(){
 document.documentElement.lang=language==='zh'?'zh-CN':language;
 document.documentElement.dataset.promoLang=language;
 document.title=text('Numbers of Magic · 수의 마법','Numbers of Magic','Numbers of Magic · 数字魔法');
 bindings.forEach(([selector,key,attribute])=>document.querySelectorAll(selector).forEach(node=>{if(attribute==='html')node.innerHTML=t(key);else if(attribute)node.setAttribute(attribute,t(key));else node.textContent=t(key);}));
 ['preschool','elementary','middle','high'].forEach(id=>document.querySelectorAll('[data-level="'+id+'"],[data-sample="'+id+'"],[data-lab-select="'+id+'"]').forEach(node=>node.textContent=t(id)));
 Object.entries({video:'navVideo',menu:'navMenu',labs:'navLabs',village:'navVillage',worksheet:'navWorksheet',roadmap:'navRoadmap'}).forEach(([id,key])=>document.querySelectorAll('.chapter-nav [data-route="'+id+'"]').forEach(node=>node.textContent=t(key)));
 const pace=document.querySelector('.pace-control>span');if(pace){pace.replaceChildren(document.createTextNode(t('pace')));const small=document.createElement('small');small.textContent=t('paceDetail');pace.append(small);}
 document.querySelectorAll('[data-promo-language]').forEach(select=>{select.value=language;select.setAttribute('aria-label','언어 / Language / 语言');});
 [['video','.panel-video','videoNote'],['sample','.panel-worksheet>.section-heading>div','sampleNote']].forEach(([kind,selector,key])=>{const host=document.querySelector(selector);if(!host)return;let note=host.querySelector('[data-media-note="'+kind+'"]');if(!note){note=document.createElement('small');note.className='promo-language-note';note.dataset.mediaNote=kind;host.append(note);}note.textContent=t(key);note.hidden=language==='ko';});
 document.querySelectorAll('a[href]').forEach(a=>{const url=new URL(a.getAttribute('href'),location.href);if(url.origin===location.origin&&url.pathname.endsWith('/number_magic/index.html')){url.searchParams.set('lang',language);a.href=url.href;}});
}
function setLanguage(next,{persist=true,updateURL=true}={}){
 if(!languages.includes(next))return false;
 language=next;if(persist)try{localStorage.setItem('nmLang',next);}catch(e){}
 if(updateURL){const url=new URL(location.href);url.searchParams.set('lang',next);history.replaceState(history.state,'',url);}
 apply();window.dispatchEvent(new CustomEvent('nm-promo-languagechange',{detail:{lang:language}}));return true;
}
document.addEventListener('change',e=>{if(e.target.matches('[data-promo-language]'))setLanguage(e.target.value);});
window.NMPromoI18n={t,text,pick,getLanguage:()=>language,setLanguage,apply};
apply();
})();
