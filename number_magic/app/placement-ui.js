/* Fixed 20-question diagnosis. Teaching widgets deliberately are not used here:
 * they may display counts, give feedback, or only submit a correct completion. */
(function () {
  'use strict';
  const VERSION = 'mixed-20-v1';
  const escape = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const tr = (lang, ko, en, zh) => lang === 'en' ? en : lang === 'zh' ? zh : ko;
  function label(value, lang) {
    if (value && typeof value === 'object') return label(value[lang] || value.ko || value.en || '', lang);
    return String(value == null ? '' : value);
  }
  function initial() {
    return { version: VERSION, phase: 'setup', selection: { intakeVersion: 'multi-source-v2', route: 'age', age: '', profileGrade: '', studyBand: '', grade: '', semester: '1', completedBooks: [], bookFocus: '', series: '', step: '', bookCourseNumber: null, bookStatus: '', progress: '', baselineId: '', goal: 'curriculum', goalTarget: '', cadence: 'w2' },
      seed: Date.now().toString(36), plan: null, index: 0, responses: [], result: null };
  }
  function parseNumber(raw) {
    const s = String(raw).trim().replace(/[−﹣－]/g, '-').replace(/[０-９]/g, c => String(c.charCodeAt(0) - 0xff10)).replace(/．/g, '.');
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(s)) return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }
  function readValues(raw) {
    const values = raw.map(parseNumber);
    return values.some(x => x === null) ? null : values.length === 1 ? values[0] : values;
  }
  function art(symbol) {
    if(typeof symbol==='string'&&symbol.startsWith('animal:')&&window.NM_ANIMALS&&window.NM_ANIMALS.kinds.includes(symbol.slice(7))){
      return '<span class="pd-art" aria-hidden="true">'+window.NM_ANIMALS.svg(symbol.slice(7))+'</span>';
    }
    return escape(symbol);
  }
  function render(ctx) {
    const { root, state: d, lang } = ctx;
    const paths = window.NM_PLACEMENT_PATHS;
    if (paths) Object.assign(d.selection, paths.normalize(d.selection));
    const t = (ko, en, zh) => tr(lang, ko, en, zh);
    const l = value => label(value, lang);
    const $ = selector => root.querySelector(selector);
    const all = selector => Array.from(root.querySelectorAll(selector));
    // Compatible saved runs may predate paper entry. Reconstruct the link
    // from their fixed seed/scope; never replace an answered plan.
    if(d.plan&&!d.paperQuery&&/^[A-Za-z0-9_-]{1,24}$/.test(d.plan.seed)){
      const s=d.selection,book=d.plan.book,p={b:d.plan.baseline.id,l:lang,seed:d.plan.seed,route:s.route};
      if(book){
        if(book.series==='mixed')p.mixBooks='1';
        else if(book.series==='dunoro')p.dunoro=String(book.course);
        else if(book.series==='soma-p')p.somaP=String(book.course);
        else{p.bookSeries=book.series;p.bookVolume=String(book.course);}
      }
      if(s.route==='book')p.books=JSON.stringify(s.completedBooks||[]);
      p.goal=s.goal||'curriculum';p.target=s.goalTarget||'';p.cadence=s.cadence||'w2';
      d.paperQuery=new URLSearchParams(p).toString();
    }
    if(d.paperQuery){const params=new URLSearchParams(d.paperQuery);params.set('l',lang);d.paperQuery=params.toString();}
    const redraw = () => {
      const active = d.phase==='setup' && document.activeElement && document.activeElement.id;
      const detailKey=x=>x.id||(x.querySelector('summary')||x).textContent;
      const open = new Map(all('details').map(x=>[detailKey(x),x.open]));
      ctx.save(); render(ctx);
      all('details').forEach(x=>{if(open.has(detailKey(x)))x.open=!!open.get(detailKey(x));});
      if(active){const el=$('#'+active);if(el&&!el.disabled)el.focus({preventScroll:true});}
    };
    const summarize = () => {
      const result = window.NM_PLACEMENT_PLAN.summarize(d.plan, d.responses);
      if (paths) result.pathRecommendation = paths.recommend(d.plan, result, d.selection);
      return result;
    };
    const option = (value, text, selected) => `<option value="${escape(value)}"${value === selected ? ' selected' : ''}>${escape(text)}</option>`;
    const shell = (title, body, phase) => {
      const viewKey = phase === 'question' ? `${phase}:${d.index}` : phase;
      const previousView = $('.nm-placement');
      const changedView = !previousView || previousView.dataset.pdView !== viewKey;
      root.innerHTML = `<div class="nm-unit-bar"><button class="nm-back" id="pdBack">${t('돌아가기','Back','返回')}</button><div class="nm-unit-title">${escape(title)}</div></div>
        <main data-pd-view="${viewKey}" class="nm-placement ${d.selection.age && Number(String(d.selection.age).replace(/^pre/,'')) < 8 ? 'nm-placement-young' : ''}">
        <nav class="pd-flow" aria-label="${t('진단 순서','Assessment steps','测评步骤')}"><span${phase === 'setup' ? ' aria-current="step"' : ''}>01 ${t('기준 고르기','Starting point','选择起点')}</span><span${['question','paper'].includes(phase) ? ' aria-current="step"' : ''}>02 ${t('20문항 확인','20 questions','20道题')}</span><span${phase === 'result' ? ' aria-current="step"' : ''}>03 ${t('학습 제안','Learning suggestion','学习建议')}</span></nav>${body}</main>`;
      $('#pdBack').onclick = ctx.close;
      if (ctx.renderMath) ctx.renderMath(root);
      // Each new question/result starts at its prompt, not at the previous answer.
      // Keep the position when only a setup selection redraws the same view.
      if (changedView) root.scrollTop = 0;
    };
    const stageLabel = stage => `${stage.kind === 'foundation' ? t('유아 기초','Early foundations','幼儿基础') : t('과정','Course','课程') + ' ' + stage.course.slice(1)} · ${l(stage.label)}`;
    const completedBookChoices = (selection, requireCompletion=true) => {
      const books=window.NM_PLACEMENT_BOOKS;
      if(selection.route!=='book'||!books)return [];
      const rows=Array.isArray(selection.completedBooks)&&selection.completedBooks.length
        ?selection.completedBooks:selection.intakeVersion==='multi-source-v2'?[]:[selection];
      return rows.map(row=>{
        if(requireCompletion&&row.bookStatus!=='completed')return null;
        const series=books.series.find(x=>x.id===row.series);
        const editionId=row.editionId||'';
        const editions=books.getEditions?books.getEditions(row.series):[];
        if(editionId&&(!editions.length||!editions.some(x=>x.id===editionId)))return null;
        const edition=editions.find(x=>x.id===editionId)||null;
        const step=books.getSteps(row.series,editionId).find(x=>x.id===row.step);
        if(!series||!step)return null;
        const courses=books.getBookCourses(row.series,step.id);
        const course=courses.find(n=>n===row.bookCourseNumber)||null;
        if(courses.length&&!course)return null;
        return {series,step,course,edition,row};
      }).filter(Boolean);
    };
    const completedBookText = choice => l(choice.series.label)+' · '+l(choice.step.label)+
      (choice.course?' · '+t('교재 과정','book course','教材课程')+' '+choice.course:'')+
      (choice.edition&&choice.edition.id?' · '+l(choice.edition.label):'');
    function setup() {
      const s=d.selection, core=window.NM_PLACEMENT_PLAN;
      if(!core||!paths||!window.NM_DIAGNOSTIC_ROADMAP){shell(t('진단 자료 확인','Assessment data','测评资料'),'<p role="alert">'+t('진단 자료를 불러오지 못했습니다. 새로고침해 주세요.','Assessment data could not be loaded. Please reload.','未能加载测评资料，请刷新。')+'</p>','setup');return;}
      let stages;
      try{stages=core.stages();}catch(_){shell(t('진단 자료 확인','Assessment data','测评资料'),'<p role="alert">'+t('과정 자료가 아직 준비되지 않았습니다.','Course data is not ready.','课程资料尚未准备好。')+'</p>','setup');return;}
      // Migrate setup only: never rebuild an in-progress fixed plan.
      if(!['age-book-v1','completed-book-v1','multi-source-v2'].includes(s.intakeVersion)){
        if(s.route==='age')s.grade='';
        s.intakeVersion='age-book-v1';
      }
      // Only explicitly completed single-book selections migrate. Older
      // "studied/in progress" entries still require a fresh choice.
      if(s.intakeVersion!=='multi-source-v2'){
        const legacy=completedBookChoices(s);
        s.completedBooks=s.intakeVersion==='completed-book-v1'&&s.bookStatus==='completed'&&legacy.length===1
          ?[{series:s.series,step:s.step,bookCourseNumber:s.bookCourseNumber||null,editionId:'',bookStatus:'completed'}]:[];
        s.series='';s.step='';s.bookCourseNumber=null;s.bookStatus='';
        if(s.route==='book'&&!s.completedBooks.length)s.baselineId='';
        s.intakeVersion='multi-source-v2';
      }
      if(!Array.isArray(s.completedBooks))s.completedBooks=[];
      if(s.route==='school'){s.studyBand=/^m/.test(s.grade)?'middle':/^h/.test(s.grade)?'high':'elementary';s.route='age';}
      if(!['unlearned','book','age'].includes(s.route))s.route='age';
      if(!['1','2'].includes(s.semester))s.semester='1';
      if(s.age==='school')s.age='';
      if(/^pre/.test(s.age))s.age=s.age.slice(3);
      const calendar=window.NM_DIAGNOSTIC_ROADMAP;
      const now=ctx.now||new Date();
      if(s.birthYear)s.age=String(calendar.age(s.birthYear,now));
      if(s.entryYear&&s.profileAt){const current=new Date(+new Date(now)+9*3600000),g=current.getUTCFullYear()-(current.getUTCMonth()<2?1:0)-s.entryYear+1;s.profileGrade=g<1?'pre':g<7?'e'+g:g<10?'m'+(g-6):'h'+Math.min(3,g-9);}
      const actual=calendar&&calendar.profile(s,now);
      const profileReady=!!actual;
      const bandOf=x=>x.kind==='foundation'?'foundation':Number(x.course.slice(1))<29?'elementary':Number(x.course.slice(1))<38?'middle':'high';
      // The actual school grade picks the matching arithmetic scope by default
      // (grade → course table in main.js); an explicit topic choice always wins.
      const gradeKey=/^h/.test(s.profileGrade||'')?'hi':s.profileGrade;
      const gradeCourse=gradeKey&&gradeKey!=='pre'&&window.NM_PLACEMENT_GRADES?(window.NM_PLACEMENT_GRADES().find(x=>x.key===gradeKey)||{}).course:null;
      const gradeStage=gradeCourse==null?null:stages.filter(x=>x.kind!=='foundation'&&Number(x.course.slice(1))<=gradeCourse).pop()||null;
      if(!s.studyBand)s.studyBand=gradeStage?bandOf(gradeStage):Number(s.age)<8?'foundation':Number(s.age)<14?'elementary':Number(s.age)<17?'middle':'high';
      const books=window.NM_PLACEMENT_BOOKS;
      if(s.route==='book'&&!s.completedBooks.length)s.completedBooks.push({series:'',step:'',bookCourseNumber:null,editionId:'',bookStatus:''});
      const bookChoices=completedBookChoices(s);
      const booksReady=s.route==='book'&&s.completedBooks.length>0&&s.completedBooks.length<=8&&bookChoices.length===s.completedBooks.length;
      const single=s.route==='book'&&booksReady&&bookChoices.length===1?bookChoices[0]:null;
      const resolved=single&&books?books.resolve(single.row.series,single.row.step,s.progress,single.row.editionId):null;
      const candidate=s.route==='book'?(resolved&&resolved.baselineId||null):s.route==='unlearned'?'f-count5':s.baselineId||(gradeStage&&bandOf(gradeStage)===s.studyBand?gradeStage.id:null)||stages.find(x=>bandOf(x)===s.studyBand)?.id;
      const mayChoose=profileReady&&(s.route==='book'?booksReady:!!candidate);
      // A paper uses either one selected book or an explicit mix of supported
      // completed books. A manual app scope overrides that book choice.
      const bookSources=booksReady?bookChoices.map(x=>{
        const source=books&&books.diagnosticSource(x.row);
        return source?{key:source.series+':'+source.course,series:source.series,course:source.course,label:completedBookText(x)}:null;
      }).filter(Boolean).filter((x,i,rows)=>rows.findIndex(y=>y.key===x.key)===i):[];
      const mayMix=bookSources.length>1&&bookSources.length===bookChoices.length;
      const focus=s.bookFocus==='all'&&mayMix?{key:'all',series:'mixed',sources:bookSources}:bookSources.find(x=>x.key===s.bookFocus)||(bookSources.length===1?bookSources[0]:null);
      let bookPlan=null;
      if(focus&&!s.baselineId){try{bookPlan=focus.series==='mixed'?core.buildBooks(focus.sources,d.seed):core.buildBook(focus.series,focus.course,d.seed);}catch(_){bookPlan=null;}}
      const baseline=bookPlan&&profileReady?stages.find(x=>x.id===bookPlan.baseline.id):stages.find(x=>x.id===(mayChoose?(s.baselineId||(s.route==='school'?null:candidate)):''));
      const scopeText=bookPlan?l(bookPlan.book.title):baseline?stageLabel(baseline):'';
      const gradePicked=s.route==='age'&&!s.baselineId&&gradeStage&&baseline&&baseline.id===gradeStage.id;
      const ages=[['',t('현재 나이 선택','Select current age','选择目前年龄')],...Array.from({length:16},(_,i)=>[String(i+4),t((new Date(+new Date(now)+9*3600000).getUTCFullYear()-(i+4)+1)+'년생 · '+(i+4)+'세', 'Born '+(new Date(+new Date(now)+9*3600000).getUTCFullYear()-(i+4)+1), (i+4)+'岁')])];
      const grades=[['pre',t('취학 전','Preschool','学龄前')],...Array.from({length:6},(_,i)=>['e'+(i+1),t('초'+(i+1),'Grade '+(i+1),'小学'+(i+1)+'年级')]),...Array.from({length:3},(_,i)=>['m'+(i+1),t('중'+(i+1),'Grade '+(i+7),'初中'+(i+1)+'年级')]),...Array.from({length:3},(_,i)=>['h'+(i+1),t('고'+(i+1),'High school '+(i+1),'高中'+(i+1)+'年级')])];
      const schoolGrades=grades.filter(x=>x[0]!=='pre');
      const inferredGrade=Number.isInteger(Number(s.age))&&Number(s.age)>=8?grades[Math.max(1,Math.min(Number(s.age)-7,12))][0]:'pre';
      const routes=[['age',t('배운 내용','Studied topics','学过的内容')],['book',t('완료한 교재','Completed books','已完成教材')],['unlearned',t('처음 시작','First steps','初次学习')]];
      const options=(rows,selected)=>rows.map(x=>option(x[0],x[1],selected)).join('');
      const rangeLabel=s.route==='book'
        ?t('완료한 교재에서 배운 내용에 가까운 이번 진단 범위','Diagnostic scope closest to the completed books','最接近已完成教材内容的本次测评范围')
        :s.route==='school'?t('이번에 확인할 교과 내용','School topic to check','本次确认的学校内容')
        :t('진단할 범위','Diagnostic scope','测评范围');
      const picked=bookPlan?null:baseline;
      const range='<label class="pd-topic">'+rangeLabel+'<select id="pdBaseline"'+(mayChoose?'':' disabled')+'>'+option('',t('내용 선택','Select topic','选择内容'),picked&&picked.id)+
        '<optgroup label="'+t('유아 · 수 감각','Early foundations','幼儿 · 数感')+'">'+stages.filter(x=>x.kind==='foundation'&&(s.route==='book'||s.route==='unlearned'||s.studyBand==='foundation')).map(x=>option(x.id,stageLabel(x),picked&&picked.id)).join('')+'</optgroup><optgroup label="'+t('교과 연산 과정','Arithmetic courses','运算课程')+'">'+stages.filter(x=>x.kind!=='foundation'&&(s.route==='book'||bandOf(x)===s.studyBand)).map(x=>option(x.id,stageLabel(x),picked&&picked.id)).join('')+'</optgroup></select></label>';
      const bookFields=s.route==='book'?'<div class="pd-book-list">'+s.completedBooks.map((row,i)=>{
        const steps=books?books.getSteps(row.series,row.editionId):[];
        const editions=books&&books.getEditions?books.getEditions(row.series):[];
        const isSoma=/^soma-/.test(row.series);
        const stepPrompt=isSoma?t('완료한 권','Completed volume','已完成的册次'):t('완료한 권·단원','Completed volume or unit','已完成的册次或单元');
        const dunoroCourses=row.series==='dunoro'&&books?steps.filter(step=>books.getBookCourses('dunoro',step.id).length).flatMap(step=>books.getBookCourses('dunoro',step.id).map(n=>[String(n),t('교재 과정','Book course','教材课程')+' '+n+' · '+l(step.label).split(' · ')[0]])):[];
        const dunoroSelected=row.step==='contents'?'other':String(row.bookCourseNumber||'');
        return '<div class="pd-book-row" data-book-row="'+i+'"><div class="pd-book-row-head"><strong>'+t('완료한 교재','Completed book','已完成的教材')+' '+(i+1)+'</strong>'+
          (s.completedBooks.length>1?'<button type="button" class="pd-book-remove" data-book-remove="'+i+'">'+t('삭제','Remove','删除')+'</button>':'')+'</div><div class="pd-fields"><label>'+t('교재','Book series','教材')+'<select data-book-series="'+i+'">'+option('',t('교재 선택','Select book','选择教材'),row.series)+(books?books.series.map(b=>option(b.id,l(b.label),row.series)).join(''):'')+'</select></label>'+
          (editions.length?'<label>'+t('발행본','Publication','出版年份')+'<select data-book-edition="'+i+'">'+editions.map(x=>option(x.id,l(x.label),row.editionId||'')).join('')+'</select></label>':'')+
          (steps.length&&row.series!=='dunoro'?'<label>'+stepPrompt+'<select data-book-step="'+i+'">'+option('',t('선택해 주세요','Select an item','请选择'),row.step)+steps.map(x=>option(x.id,l(x.label),row.step)).join('')+'</select></label>':'')+
          (row.series==='dunoro'?'<label>'+t('마지막으로 완료한 두뇌로 교재 과정','Last completed Dunoro book course','最后完成的두뇌로教材课程')+'<select data-book-course="'+i+'">'+options([['',t('과정 번호 선택','Select course number','选择课程编号')],...dunoroCourses,['other',t('다른 과정 표기','Other course notation','其他课程标记')]],dunoroSelected)+'</select></label>':'')+'</div></div>';
      }).join('')+'<button type="button" class="pd-book-add" id="pdAddBook"'+(s.completedBooks.length>=8?' disabled':'')+'>'+t('완료한 교재 추가','Add another completed book','添加已完成教材')+'</button><p class="pd-note">'+t('기적의 계산법과 소마셈처럼 여러 교재를 함께 기록할 수 있습니다. 모두 마지막으로 완료한 권을 고르세요.','Record more than one book, such as Miracle and SomaSem. Select the last completed volume of each.','可以同时记录多种教材；请选择每种教材最后完成的册次。')+'</p>'+
        (bookSources.length>1?'<label>'+t('이번 진단 기준 교재','Book for this check','本次测评依据教材')+'<select id="pdBookFocus">'+option('',t('교재 선택','Select a book','选择教材'),s.bookFocus||'')+(mayMix?option('all',t('완료한 교재 함께 확인','Check all completed books','合并确认已完成教材'),s.bookFocus||''):'')+bookSources.map(x=>option(x.key,x.label,s.bookFocus||'')).join('')+'</select></label>':'')+
        (s.completedBooks.some(row=>row.series==='dunoro')?'<p class="pd-note">'+t('두뇌로 교재 과정 번호와 이 앱의 과정 번호는 다릅니다.','Dunoro book course numbers differ from app course numbers.','두뇌로教材课程编号与本应用课程编号不同。')+'</p>':'')+'</div>':'';
      const paperParams=baseline?{b:baseline.id,l:lang,seed:d.seed,goal:s.goal,target:s.goalTarget||'',cadence:s.cadence,route:s.route}:null;
      if(paperParams&&bookPlan){
        if(focus.series==='mixed')paperParams.mixBooks='1';
        else if(focus.series==='dunoro')paperParams.dunoro=String(focus.course);
        else if(focus.series==='soma-p')paperParams.somaP=String(focus.course);
        else{paperParams.bookSeries=focus.series;paperParams.bookVolume=String(focus.course);}
      }
      if(paperParams&&s.route==='book')paperParams.books=JSON.stringify(s.completedBooks);
      if(paperParams&&s.route==='school'){paperParams.grade=s.grade;paperParams.semester=s.semester;}
      const paperQuery=paperParams?new URLSearchParams(paperParams).toString():'';
      const setupHint=!profileReady?t('출생연도와 현재 학년을 먼저 확인해 주세요.','First confirm birth year and current grade.','请先确认出生年份和目前年级。'):s.route==='book'&&!booksReady?t('교재마다 마지막으로 완료한 권 또는 과정을 골라 주세요.','Select the last completed volume or course for every book.','请选择每种教材最后完成的册次或课程。'):
        s.route==='book'&&bookSources.length>1&&!focus&&!s.baselineId?t('이번 진단의 기준 교재를 골라 주세요.','Choose the book for this check.','请选择本次测评依据的教材。'):
        s.route==='book'&&!baseline?t('완료한 내용에 가까운 앱 진단 범위를 확인해 주세요.','Confirm the app diagnostic scope closest to the completed topics.','请确认最接近已完成内容的应用测评范围。'):
        s.route==='school'&&!s.grade?t('학교 학년을 골라 주세요.','Choose the school grade.','请选择学校年级。'):
        s.route==='school'&&!baseline?t('이번에 확인할 교과 연산 내용을 골라 주세요.','Choose the school arithmetic topic to check.','请选择本次确认的学校运算内容。'):
        !s.age?t('나이를 골라 주세요.','Choose the current age.','请选择目前年龄。'):'';
      const schoolFields='';
      const profileFields='<section class="pd-profile"><h2>'+t('1. 아이의 현재 정보','1. About the learner','1. 学生目前信息')+'</h2><div class="pd-profile-fields"><label>'+t('출생연도 · 필수','Birth year · required','出生年份 · 必填')+'<select id="pdAge" required>'+options(ages,s.age)+'</select></label><label>'+t('현재 학교 학년 · 필수','Actual school grade · required','目前学校年级 · 必填')+'<select id="pdGrade" required>'+option('',t('학년 선택','Choose grade','选择年级'),s.profileGrade)+options(grades,s.profileGrade)+'</select></label></div><p class="pd-note">'+t('나이는 한국 나이로 표시해요. 실제 학년과 배우는 수학 진도는 따로 봅니다.','Age labels use Korean year-count age. Actual grade and studied math are separate.','年龄按韩国虚岁显示。实际年级与数学进度分开记录。')+'</p></section>';
      const topicFields='<label>'+t('배우는 수학 범위','Studied math level','正在学习的数学范围')+'<select id="pdStudyBand">'+options([['foundation',t('유아 · 수 감각','Early number sense','幼儿数感')],['elementary',t('초등 연산','Elementary arithmetic','小学运算')],['middle',t('중등 과정','Middle-school topics','初中课程')],['high',t('고등 과정','High-school topics','高中课程')]],s.studyBand)+'</select></label>'+range+(gradePicked?'<p class="pd-intake-hint" id="pdGradePicked">'+t('현재 학년에 맞춰 진단 범위를 골라 두었어요. 지금 배우는 내용과 다르면 바꿔 주세요.','We picked the scope for the current grade. Change it if the learner studies something else.','已按目前年级选好测评范围。若正在学习的内容不同，请更改。')+'</p>':'')+'<p class="pd-note">'+t('실제 학년과 관계없이 지금 배우는 내용을 고르세요. 초등학생도 중·고등 내용을 선택할 수 있어요.','Choose what is being studied, regardless of actual grade. Younger learners may select middle or high-school content.','不受实际年级限制，选择目前学习内容。小学生也可选择初高中内容。')+'</p>';
      shell(t('학습 시작점 찾기','Find your starting point','找到学习起点'),
        '<header class="pd-header"><p class="pd-kicker">NUMBERS OF MAGIC</p><h1>'+t('어디부터 시작할까요?','Where shall we begin?','从哪里开始？')+'</h1><p>'+t('아이 정보와 배운 내용을 고르면 20문항으로 확인해요.','Tell us about the learner and studied topics, then check 20 questions.','填写学生信息和学过的内容，开始20题测评。')+'</p></header>'+
        profileFields+'<h2 class="pd-source-title">'+t('2. 무엇을 기준으로 확인할까요?','2. Choose a starting point','2. 按什么内容确认？')+'</h2>'+
        '<div class="pd-routes" role="group" aria-label="'+t('진단 시작 방법','How to begin','测评开始方式')+'">'+routes.map(x=>'<button type="button" data-route="'+x[0]+'" aria-pressed="'+(s.route===x[0])+'">'+x[1]+'</button>').join('')+'</div>'+
        '<section class="pd-selection">'+
        bookFields+schoolFields+
        (s.route==='unlearned'?'<p class="pd-intake-hint">'+t('수 세기부터 차근차근 확인해요.','Begin with counting, one step at a time.','从数数开始逐步确认。')+'</p>'+range:
          s.route==='book'&&bookPlan?'<p class="pd-intake-hint">'+t('진단 기준: ','Diagnostic scope: ','测评基准：')+escape(scopeText)+'</p><details class="pd-optional" id="pdRangeOptions"><summary>'+t('다른 내용으로 확인하기','Check a different topic','改为确认其他内容')+'</summary>'+range+'</details>':
          s.route==='book'?'<p class="pd-note">'+t('여러 권을 기록해도 진단지는 한 앱 범위에서 만듭니다. 그 범위를 아래에서 확인해 주세요.','Even with several books, one app scope is used for the paper. Confirm it below.','即使记录多本教材，试卷也使用一个应用范围。请在下方确认。')+'</p>'+range:
          s.route==='age'?topicFields:'' )+'</section>'+
        '<details class="pd-blueprint"><summary>'+t('문항 구성 · 이전 6 / 현재 10 / 다음 4','Question mix · 6 / 10 / 4','题目配置 · 6 / 10 / 4')+'</summary><h2>'+t('한 번에 20문항','20 questions in one check','一次20道题')+'</h2><div class="pd-bands">'+(bookPlan&&bookPlan.book.series==='mixed'?[['6','30%',t('여러 교재의 이전 주제','Earlier topics across books','多本教材的此前主题')],['10','50%',t('여러 교재의 완료 주제','Completed topics across books','多本教材的已完成主题')],['4','20%',t('여러 교재의 다음 주제','Next topics across books','多本教材的后续主题')]]:bookPlan?[['6','30%',l(bookPlan.items[0].stageLabel)],['10','50%',l(bookPlan.items[6].stageLabel)],['4','20%',l(bookPlan.items[16].label)]]:
          [['6','30%',t('이전 범위 확인','Earlier scope','此前范围')],['10','50%',t('선택 범위 확인','Selected scope','所选范围')],['4','20%',t('다음 범위 맛보기','Next scope preview','后续范围预览')]]).map(x=>'<div><b>'+x[0]+'</b><span>'+x[2]+' · '+x[1]+'</span></div>').join('')+'</div><p id="pdBaselinePreview">'+
        (bookChoices.length?'<strong>'+t('완료한 교재: ','Completed books: ','已完成教材：')+escape(bookChoices.map(completedBookText).join(' / '))+'</strong><br>':'')+
        (s.route==='school'&&s.grade?'<strong>'+t('학교 진도: ','School progress: ','学校进度：')+escape(l(schoolGrades.find(x=>x[0]===s.grade)?.[1]||s.grade))+' · '+escape(s.semester)+t('학기',' semester','学期')+'</strong><br>':'')+
        (baseline?t('진단 기준: ','Diagnostic scope: ','测评基准：')+escape(scopeText):t('진단 방법과 내용을 고르면 출발점이 나옵니다.','Choose a route and topic to see a starting point.','选择方式和内容后显示起点。'))+'</p><p class="pd-note">'+t('맞고 틀려도 문항은 바뀌지 않습니다. 첫 기초의 이전 6문항은 같은 기초의 작은 수로, 마지막 과정의 다음 4문항은 같은 과정 추가 확인으로 표시합니다.','The plan stays fixed. At the first foundation, earlier items use smaller quantities; at the final course, next items are additional checks in that course.','题目配置保持不变。最初基础的此前题使用更小数量，最后课程的后续题为同课程补充确认。')+'</p>'+
        (bookPlan?'<p class="pd-note">'+escape(l(bookPlan.book.notice))+'</p>'+(bookChoices.length>1&&bookPlan.book.series!=='mixed'?'<p class="pd-note">'+t('함께 기록한 다른 교재는 이번 문항 출제 기준에 포함되지 않아요. 다른 내용을 확인하려면 위에서 앱 진단 범위를 선택해 주세요.','Other recorded books do not determine these questions. Choose an app diagnostic topic above to check different content.','同时记录的其他教材不用于本次出题。若需确认其他内容，请在上方选择应用测评范围。')+'</p>':''):s.route==='book'?'<p class="pd-note">'+t('6·10·4문항은 선택한 진단 범위의 이전·중심·다음 내용입니다. 교재 권 번호의 앞뒤와 같다고 보지 않습니다.','The 6/10/4 questions follow the selected diagnostic scope, which may differ from adjacent book volumes.','6/10/4道题按所选测评范围的前后内容编排，未必对应相邻教材册次。')+'</p>':'')+'</details>'+
        '<p class="pd-note">'+t('유아는 보호자가 지시문을 읽어 줄 수 있습니다. 답이나 세는 방법은 알려주지 마세요.','An adult may read the prompt for a young child, without helping choose or count the answer.','成人可以为幼儿读题，但不要提示答案或计数方法。')+'</p><p id="pdSetupError" class="pd-error" role="alert"></p><p id="pdStartReason" class="pd-intake-hint"'+(setupHint?'':' hidden')+'>'+escape(setupHint)+'</p><button class="pd-primary" id="pdStart"'+(baseline?'':' disabled')+'>'+t('20문항 시작','Start 20 questions','开始20道题')+'</button>'+
        (baseline?'<a class="pd-secondary pd-paper" id="pdPaper" href="placement-sheet.html?'+escape(paperQuery)+'" target="_blank" rel="noopener">'+t('진단지 인쇄하기','Print assessment','打印测评卷')+'</a><p class="pd-note">'+t('인쇄본에는 보호자용 정답 쪽이 포함됩니다. 아이에게는 시험 쪽만 주세요.','The printout includes a parent answer page. Give the child only the test pages.','打印件包含家长用答案页，请只给孩子试题页。')+'</p>':''),'setup');
      // Keep the primary action beside the chosen starting point, before optional
      // planning details and the longer explanation of the fixed blueprint.
      $('.pd-selection').after($('#pdSetupError'));$('#pdSetupError').after($('#pdStartReason'));$('#pdStartReason').after($('#pdStart'));
      if(baseline){
        $('#pdStart').after($('#pdPaper'));
        const answers=document.createElement('button');answers.type='button';answers.id='pdPaperAnswers';answers.className='pd-secondary pd-paper';
        answers.textContent=t('답지 보고 ○·X 체크','Mark ○/X with answer key','对照答案勾选○/X');$('#pdPaper').after(answers);
        answers.onclick=()=>begin('paper');
        $('#pdPaper').onclick=e=>{if(!begin('paper'))e.preventDefault();};
      }
      if($('#pdAge'))$('#pdAge').onchange=e=>{s.age=e.target.value;s.birthYear=s.age?new Date(+new Date(now)+9*3600000).getUTCFullYear()-Number(s.age)+1:null;if(!s.profileGrade||s.gradeInferred){s.profileGrade=s.age?(Number(s.age)<8?'pre':grades[Math.min(Number(s.age)-7,12)][0]):'';s.gradeInferred=!!s.age;s.entryYear=null;}if(!s.baselineId&&s.scopeSource!=='manual')s.studyBand='';redraw();};
      $('#pdGrade').onchange=e=>{s.profileGrade=e.target.value;s.gradeInferred=false;s.entryYear=null;if(!s.baselineId&&s.scopeSource!=='manual')s.studyBand='';redraw();};
      all('[data-route]').forEach(el=>el.onclick=()=>{s.route=el.dataset.route;s.baselineId='';s.scopeSource='';redraw();});
      if($('#pdStudyBand'))$('#pdStudyBand').onchange=e=>{s.studyBand=e.target.value;s.baselineId='';s.scopeSource='manual';redraw();};
      if(s.route==='book'){
        if($('#pdBookFocus'))$('#pdBookFocus').onchange=e=>{s.bookFocus=e.target.value;s.baselineId='';redraw();};
        all('[data-book-series]').forEach(el=>el.onchange=e=>{const row=s.completedBooks[Number(el.dataset.bookSeries)];row.series=e.target.value;row.editionId=/^soma-[pkabcd]$/.test(row.series)?'2019':'';row.step='';row.bookCourseNumber=null;row.bookStatus='';s.baselineId='';s.bookFocus='';redraw();});
        all('[data-book-edition]').forEach(el=>el.onchange=e=>{const row=s.completedBooks[Number(el.dataset.bookEdition)];row.editionId=e.target.value;row.step='';row.bookCourseNumber=null;row.bookStatus='';s.baselineId='';s.bookFocus='';redraw();});
        all('[data-book-step]').forEach(el=>el.onchange=e=>{const row=s.completedBooks[Number(el.dataset.bookStep)];row.step=e.target.value;row.bookCourseNumber=null;row.bookStatus=row.step&&row.series!=='dunoro'?'completed':'';s.baselineId='';s.bookFocus='';redraw();});
        all('[data-book-course]').forEach(el=>el.onchange=e=>{const row=s.completedBooks[Number(el.dataset.bookCourse)],raw=e.target.value;
          const n=/^[1-9][0-9]?$/.test(raw)?Number(raw):null;
          const step=n&&books.getSteps('dunoro').find(x=>books.getBookCourses('dunoro',x.id).includes(n));
          row.step=raw==='other'?'contents':step?step.id:'';
          row.bookCourseNumber=step?n:null;
          row.bookStatus=row.step?'completed':'';
          s.baselineId='';s.bookFocus='';redraw();});
        all('[data-book-remove]').forEach(el=>el.onclick=()=>{s.completedBooks.splice(Number(el.dataset.bookRemove),1);s.baselineId='';s.bookFocus='';redraw();});
        $('#pdAddBook').onclick=()=>{if(s.completedBooks.length>=8)return;s.completedBooks.push({series:'',step:'',bookCourseNumber:null,editionId:'',bookStatus:''});s.baselineId='';s.bookFocus='';redraw();};
      }
      if($('#pdBaseline'))$('#pdBaseline').onchange=e=>{s.baselineId=e.target.value;s.scopeSource='manual';redraw();};
      const begin=phase=>{
        if(!baseline||!profileReady)return false;
        Object.assign(s,actual);if(ctx.onProfile)ctx.onProfile(actual);
        $('#pdStart').disabled=true;
        try{d.plan=bookPlan?(focus.series==='mixed'?core.buildBooks(focus.sources,d.seed):core.buildBook(focus.series,focus.course,d.seed)):core.build(baseline.id,d.seed);if(!bookPlan){if(s.route==='age'&&!s.scopeSource)s.scopeSource=s.baselineId?'manual':'grade';s.baselineId=baseline.id;}d.index=0;d.responses=[];d.paperQuery=paperQuery;d.paperDrafts={};d.paperMarks=null;d.phase=phase;d.questionStartedAt=Date.now();redraw();return true;}
        catch(_){$('#pdSetupError').textContent=t('이 범위를 안전하게 구성하지 못했습니다. 출발점을 바꿔 주세요.','This range could not be safely prepared. Choose another starting point.','无法安全生成此范围，请更改起点。');$('#pdStart').disabled=false;return false;}
      };
      $('#pdStart').onclick=()=>begin('question');
    }
    const tokens = (n,symbol='●') => `<div class="pd-objects" aria-label="${escape(t('수량 그림','Quantity picture','数量图'))}">${Array.from({length:n},()=>`<span class="pd-object${symbol==='●'?' pd-orb':''}" aria-hidden="true">${symbol==='●'?'':art(symbol)}</span>`).join('')}</div>`;
    function question() {
      const item = d.plan && d.plan.items[d.index];
      if(!item){d.phase='result';d.result=summarize();ctx.onResult(d.result,d);redraw();return;}
      if(!d.questionStartedAt)d.questionStartedAt=Date.now();
      const data=item.renderData, mode=item.responseMode;
      let scene='', numeric=false, pending=null, selected=new Set(), made=0;
      if(mode==='count-tap')scene=`<p class="pd-interact-note">${t('같은 그림을 모두 눌러요.','Tap every matching object.','点选所有相同的物体。')} <span class="pd-target" aria-hidden="true">${art(data.targetSymbol)}</span></p><div class="pd-count-board">${data.items.map((x,i)=>`<button type="button" class="pd-tap" data-tap="${i}" aria-label="${t('그림','Object','物体')} ${i+1}" aria-pressed="false"><span aria-hidden="true">${art(x.symbol)}</span></button>`).join('')}</div>`;
      else if(mode==='make')scene=`<div class="pd-number-target">${data.target}</div><div class="pd-made" id="pdMade">${tokens(0,data.symbol)}</div><div class="pd-make-controls"><button type="button" id="pdRemove" aria-label="${t('하나 빼기','Remove one','减去一个')}">−</button><span>${art(data.symbol)}</span><button type="button" id="pdAdd" aria-label="${t('하나 더하기','Add one','增加一个')}">+</button></div>`;
      else if(mode==='match-number')scene=`<div class="pd-number-target">${data.target}</div><div class="pd-choices">${data.dots.map((n,i)=>`<button type="button" data-choice="${i}" aria-pressed="false" aria-label="${t('그림 선택지','Picture choice','图形选项')} ${i+1}">${tokens(n)}</button>`).join('')}</div>`;
      else if(mode==='compare')scene=`<div class="pd-choices pd-compare">${[data.left,data.right].map((n,i)=>`<button type="button" data-choice="${i+1}" aria-pressed="false" aria-label="${i===0?t('왼쪽','Left','左边'):t('오른쪽','Right','右边')}">${tokens(n,data.symbol)}</button>`).join('')}</div>`;
      else if(mode==='sequence'){numeric=true;scene=`<div class="pd-sequence">${data.seq.map((n,i)=>`<span${i===data.blank?' class="pd-blank"':''}>${i===data.blank?'?':n}</span>`).join('')}</div>`;}
      else if(mode==='split'){numeric=true;scene=`<div class="pd-bond"><div class="pd-whole"><b>${data.whole}</b>${tokens(data.whole,data.symbol)}</div><div class="pd-parts"><div><b>${data.known}</b>${tokens(data.known,data.symbol)}</div><div class="pd-unknown">?</div></div></div>`;}
      else if(mode==='join'){numeric=true;scene=`<div class="pd-join">${tokens(data.left,data.symbol)}<span>+</span>${tokens(data.right,data.symbol)}<span>=</span><span class="pd-blank">?</span></div>`;}
      else if(mode==='ten-bond'){numeric=true;scene=`<div class="pd-tenframe" aria-label="${t('10칸 그림','Ten-frame','十格图')}">${Array.from({length:10},(_,i)=>`<span>${i<data.filled?'<i class="pd-orb"></i>':''}</span>`).join('')}</div>`;}
      else if(mode==='number'){numeric=true;scene=`<div class="pd-formula" data-tex="${escape(data.tex)}"></div>${data.steps&&data.steps.length?`<div class="pd-formula-steps">${data.steps.map(x=>`<div data-tex="${escape(x.tex)}"></div>`).join('')}</div>`:''}`;}
      else {shell(t('진단 자료 확인','Assessment data','测评资料'),`<p role="alert">${t('이 문항의 표현을 지원하지 않습니다. 기준 선택부터 다시 시작해 주세요.','This question display is unsupported. Restart from the starting point.','不支持此题显示，请重新选择起点。')}</p><button class="pd-primary" id="pdRestart">${t('기준 다시 선택','Choose starting point','重新选择起点')}</button>`,'question');$('#pdRestart').onclick=()=>{d.phase='setup';redraw();};return;}
      const answerCount=mode==='number'?data.answerCount||1:1;
      shell(t('학습 시작점 확인','Starting-point check','确认学习起点'), `<header class="pd-question-top"><p>${t('문항','Question','题目')} <b>${d.index+1}</b> / 20</p><progress value="${d.index}" max="20" aria-label="${t('완료 문항','Completed questions','已完成题数')}"></progress></header><section class="pd-question"><h1 id="pdPrompt">${escape(l(item.prompt))}</h1><div class="pd-scene">${scene}</div>${numeric?`<div class="pd-answer-fields">${Array.from({length:answerCount},(_,i)=>`<label>${answerCount>1?t('답','Answer','答案')+' '+(i+1):t('답','Answer','答案')}<input class="pd-answer" type="text" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-describedby="pdPrompt" aria-label="${t('답','Answer','答案')} ${i+1}"></label>`).join('')}</div><div class="pd-keypad" aria-label="${t('숫자 입력','Number input','数字输入')}">${['1','2','3','4','5','6','7','8','9','−','0','.','⌫'].map(key=>`<button type="button" data-key="${escape(key)}" aria-label="${key==='⌫'?t('한 글자 지우기','Delete one character','删除一个字符'):key==='−'?t('부호 바꾸기','Change sign','改变正负号'):escape(key)}">${key}</button>`).join('')}</div>`:''}<p id="pdInputError" class="pd-error" role="alert"></p><div class="pd-question-actions"><button type="button" class="pd-secondary" id="pdSkip">${t('아직 모르겠어요','Not sure yet','还不会')}</button><button type="button" class="pd-primary" id="pdSubmit">${t('답 제출','Submit answer','提交答案')}</button></div></section>`, 'question');
      if(d.paperQuery){
        const paper=document.createElement('button');paper.type='button';paper.className='pd-text-button';paper.id='pdQuestionPaper';
        paper.textContent=t('인쇄해서 풀기 · ○·X 채점','Print and mark ○/X','打印后勾选○/X');$('.pd-question').append(paper);
        paper.onclick=()=>{d.phase='paper';redraw();};
      }
      let focused=$('.pd-answer');
      // The on-screen number pad is the mobile keyboard; hardware typing still works.
      all('.pd-answer').forEach(input=>{input.setAttribute('inputmode','none');input.onfocus=()=>{focused=input;};input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();$('#pdSubmit').click();}};});
      all('[data-key]').forEach(button=>button.onclick=()=>{
        if(!focused)return;
        const key=button.dataset.key;
        if(key==='⌫')focused.value=focused.value.slice(0,-1);
        else if(key==='−')focused.value=focused.value.startsWith('-')?focused.value.slice(1):'-'+focused.value;
        else focused.value+=key;
        focused.focus();
      });
      all('[data-tap]').forEach(button=>button.onclick=()=>{const i=Number(button.dataset.tap);if(selected.has(i))selected.delete(i);else selected.add(i);button.setAttribute('aria-pressed',String(selected.has(i)));});
      all('[data-choice]').forEach(button=>button.onclick=()=>{pending=Number(button.dataset.choice);all('[data-choice]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));});
      if(mode==='make'){
        const update=()=>{$('#pdMade').innerHTML=tokens(made,data.symbol);};
        $('#pdAdd').onclick=()=>{made=Math.min(Math.max(data.max+3,10),made+1);update();};
        $('#pdRemove').onclick=()=>{made=Math.max(0,made-1);update();};
      }
      let submitted=false;
      const submit=skipped=>{
        if(submitted || Date.now()-(d.lastSubmittedAt||0)<400 || d.responses.some(r=>r.id===item.id))return;
        let value=null,validationFlags;
        if(!skipped){
          if(numeric){value=readValues(all('.pd-answer').map(x=>x.value));if(value===null){$('#pdInputError').textContent=t('각 답칸에 숫자를 입력해 주세요. 음수와 소수도 입력할 수 있습니다.','Enter a number in each answer field. Negative numbers and decimals are supported.','请在各答案框输入数字，可以输入负数和小数。');return;}}
          else if(mode==='count-tap'){value=selected.size;validationFlags={validTargets:data.items.every((x,i)=>selected.has(i)===x.target)};}
          else if(mode==='make')value=made;
          else {value=pending;if(value===null){$('#pdInputError').textContent=t('그림을 하나 고르거나 ‘아직 모르겠어요’를 눌러 주세요.','Choose a picture or select “Not sure yet”.','请选择一个图形，或点“还不会”。');return;}}
        }
        submitted=true;$('#pdSubmit').disabled=true;$('#pdSkip').disabled=true;
        d.lastSubmittedAt=Date.now();
        d.responses.push({id:item.id,value,validationFlags,skipped,sec:Math.max(0,(Date.now()-d.questionStartedAt)/1000)});
        d.index++;d.questionStartedAt=Date.now();
        if(d.index===d.plan.items.length){d.phase='result';d.result=summarize();ctx.onResult(d.result,d);}
        redraw();
      };
      $('#pdSubmit').onclick=()=>submit(false);$('#pdSkip').onclick=()=>submit(true);
      // A second tap may target the new button after the synchronous redraw.
      // Briefly keep both buttons inactive across that transition as well.
      const remaining=400-(Date.now()-(d.lastSubmittedAt||0));
      if(remaining>0){
        const submitButton=$('#pdSubmit'),skipButton=$('#pdSkip');
        submitButton.disabled=true;skipButton.disabled=true;
        setTimeout(()=>{if(submitButton.isConnected){submitButton.disabled=false;skipButton.disabled=false;}},remaining+5);
      }
    }
    function paper() {
      if(!d.plan||!d.paperQuery){d.phase='setup';redraw();return;}
      window.NM_PAPER_MARKS.render({root,state:d,lang,shell,save:ctx.save,
        onOnline:()=>{d.phase='question';d.questionStartedAt=Date.now();redraw();},
        onSubmit:()=>{ctx.onResult(d.result,d);redraw();}});
    }
    function result() {
      if (!paths) { shell(t('학습 경로 확인','Study pathway','学习路径'),`<p role="alert">${t('학습 경로 자료를 불러오지 못했습니다. 새로고침해 주세요.','Study pathway data could not be loaded. Please reload.','未能加载学习路径资料，请刷新。')}</p>`, 'result');return; }
      const result=d.result, path=paths.recommend(d.plan,result,d.selection), rec=path.main, course=(window.NM_COURSES||{})[rec.course];
      result.pathRecommendation=path;
      const courseTitle=rec.course==='C0'&&rec.label?l(rec.label):course?l(course.title):rec.course;
      const bandNames={previous:t('이전 진도','Earlier learning','此前进度'),current:t('현재 진도','Current learning','当前进度'),next:t('다음 진도','Next learning','后续进度')};
      const domains=Object.values(result.domains);
      shell(t('학습 제안','Learning suggestion','学习建议'),`<header class="pd-header"><p class="pd-kicker">${d.plan.book?escape(l(d.plan.book.title))+' · ':''}${t('20문항으로 확인한 시작점','A starting point from 20 questions','依据20题建议的起点')}</p><h1>${t('이곳부터 함께<br>연습해 보세요.','Start practicing<br>from here.','从这里开始<br>一起练习吧。')}</h1><div class="pd-recommended"><span>${t('과정','Course','课程')} ${escape(rec.course.slice(1))} · ${t('회차','Session','课次')} ${rec.session}</span><h2>${escape(courseTitle)}</h2></div><p>${t('선택한 진도 주변의 표본을 확인한 연습 제안입니다. 전체 과정을 익혔다는 판정이나 입학시험 합격 판정이 아닙니다.','This is a practice suggestion based on a sample around your selected topic, not proof of whole-course mastery or admission readiness.','这是依据所选进度附近题目提出的练习建议，不代表掌握全部课程或通过入学测试。')}</p></header>${d.plan.book?`<p class="pd-note"><strong>${escape(l(d.plan.book.title))}</strong> · ${escape(l(d.plan.book.notice))}</p>${(d.selection?.completedBooks||[]).length>1&&d.plan.book.series!=='mixed'?`<p class="pd-note">${t('함께 기록한 다른 교재는 이번 문항 출제 기준에 포함되지 않았어요.','Other recorded books did not determine these questions.','同时记录的其他教材未用于本次出题。')}</p>`:''}`:''}<div class="pd-score"><b>${result.correct}</b> / 20 <span>${t('맞힘','correct','答对')}</span></div><div class="pd-bands">${Object.keys(bandNames).map(b=>`<div><b>${result.bands[b].correct} / ${result.bands[b].asked}</b><span>${bandNames[b]}</span><small>${t('모름','Skipped','不会')} ${result.bands[b].skipped}</small></div>`).join('')}</div><section class="pd-skill-results"><h2>${t('내용별 확인','Topic details','各项内容')}</h2>${domains.map(x=>`<div><span>${escape(l(x.label))}</span><b>${x.correct} / ${x.asked}</b><small>${t('모름','Skipped','不会')} ${x.skipped}</small></div>`).join('')}</section><p class="pd-note">${t('오답과 모름은 구분해 기록했습니다. 시간은 참고 기록만 하며, 임의의 초 기준으로 실력을 낮추지 않습니다. 원하는 과정은 언제든 직접 고를 수 있습니다.','Wrong answers and skipped questions are recorded separately. Time is recorded only as context, without an arbitrary speed penalty. Any course remains freely selectable.','错答与不会分别记录，时间仅作参考，不按任意秒数降低能力判断。仍可自由选择课程。')}</p><div class="pd-result-actions"><button class="pd-primary" id="pdRoad">${t('로드맵에서 이 과정 보기','See this course on the roadmap','在路线图查看此课程')}</button><button class="pd-secondary" id="pdPick">${t('다른 과정 직접 고르기','Choose another course','自选其他课程')}</button><button class="pd-text-button" id="pdAgain">${t('기준을 바꿔 다시 확인','Check a different starting point','换起点重新确认')}</button></div>`, 'result');
      if(d.responseSource==='paper-marks'){const note=document.createElement('p');note.className='pd-note';note.textContent=t('답지와 대조해 체크한 자가 채점 결과입니다.','These results use your checks against the answer key.','这是对照答案自行勾选的评分结果。');$('.pd-score').after(note);}
      $('.pd-kicker').textContent=t('진단을 바탕으로 짠 학습 제안','A study plan based on this check','依据本次测评的学习建议');
      $('.pd-header h1').innerHTML=t('본진도와 보강을<br>함께 연결해요.','Connect your main study<br>with focused practice.','连接主要进度<br>与补充练习。');
      $('.pd-recommended>span').textContent=t('선택한 본진도 · 수의 마법 과정','Selected main study · app course','选择的主要进度 · 本应用课程')+' '+rec.course.slice(1)+' · '+t('회차','Session','课次')+' '+rec.session;
      const guidance=document.createElement('details');guidance.className='pd-goal-plan pd-optional';
      const supportLabel=row=>l(((window.NM_THREADS||{})[row.t]||{}).name||row.label);
      guidance.innerHTML=`<summary>${t('보강과 학습 방향 자세히','Practice details','补充练习与学习方向')}</summary><h2>${escape(l(path.goal.label))}</h2>${path.target?`<p class="pd-target-label">${escape(l(path.target.label))} · ${t('목표 대응 확인 필요','Target mapping needs verification','目标对应需要确认')}</p>`:''}<p>${escape(l(path.goal.direction))}</p><p class="pd-note">${escape(l(path.goal.focus))}</p>
        <h3>${t('본진도 전에 보강·재확인','Practice or recheck before the main topic','主要内容前的补充练习与再确认')}</h3>
        ${path.support.length?`<ul class="pd-support-list">${path.support.map((row,i)=>`<li><div><strong>${escape(supportLabel(row))}</strong><span>${row.kind==='practice'?t('보강 후보','Practice candidate','补充练习候选'):t('재확인 후보','Recheck candidate','再确认候选')} · ${t('오답','Wrong','错答')} ${row.wrong} · ${t('모름','Skipped','不会')} ${row.skipped}</span><small>${t('활동 위치 · 과정','Practice location · Course','练习位置 · 课程')} ${row.course.slice(1)} · ${t('회차','Session','课次')} ${row.session}</small></div><button type="button" class="pd-support-link" data-support="${i}" aria-label="${escape(supportLabel(row)+' · '+t('로드맵에서 보기','View on roadmap','在路线图查看'))}">${t('위치 보기','View location','查看位置')}</button></li>`).join('')}</ul>`:`<p>${t('이전·현재 표본에서 별도 보강 근거가 나오지 않았습니다. 전체 숙달을 뜻하지는 않습니다.','No separate practice need was found in the earlier/current sample; this does not certify full mastery.','此前与当前的样本未发现单独补充练习依据，但不代表完全掌握。')}</p>`}
        ${path.assessment.answered===0?`<p class="pd-note">${t('아직 직접 푼 답이 없어 수준을 확정할 수 없습니다. 함께 다시 확인해 주세요.','No answers were attempted, so level cannot be established. Recheck together.','尚未尝试作答，不能确定水平，请一起重新确认。')}</p>`:''}
        <h3>${t('다음에 살펴볼 주제','Next topic to explore','接下来了解的内容')}</h3><p>${path.next?escape(l(path.next.label)):t('마지막 과정입니다. 필요한 주제를 복습합니다.','This is the final course. Review the topics you need.','这是最后的课程，可复习需要的内容。')}</p><p class="pd-note">${t('다음 주제는 미리보기입니다. 다음 4문항만으로 진도를 올리거나 과정을 완료하지 않습니다.','The next topic is a preview. Four next-stage items do not advance or complete a course.','后续内容仅为预览，不凭4道后续题升级或完成课程。')}</p>
        <h3>${t('학습 계획','Study plan','学习计划')}</h3><p>${path.config.cadence==='w1'?t('주 1회','Once a week','每周一次'):t('주 2회','Twice a week','每周两次')} · ${escape(l(path.schedule.reason))}</p>
        ${path.schedule.targetMapping==='pending'?`<p class="pd-note">${t('목표별 정확한 도달 시점은 확인 필요입니다. 이번 연산 진단만으로 사고력·언어사고력이나 입학 준비도를 판단하지 않습니다.','Exact target timing still needs verification. This arithmetic check does not assess reasoning, language reasoning, or admission readiness.','准确的目标达成时间仍需确认。本运算测评不判断思维、语言思维或入学准备度。')}</p>`:''}
        <p class="pd-note">${t('목표별 학습 방향 제안입니다. 학습지 편성이나 기존 진도를 자동으로 바꾸지 않습니다.','These are goal-specific study suggestions, not automatic changes to worksheets or existing progress.','这是按目标提出的学习方向建议，不会自动改变练习纸编排或现有进度。')}</p>`;
      $('.pd-bands').after(guidance);
      if(window.NM_DIAGNOSTIC_ROADMAP){const calendar=document.createElement('section');calendar.className='pd-calendar';guidance.before(calendar);window.NM_DIAGNOSTIC_ROADMAP.mount(calendar,{selection:d.selection,course:rec.course,session:rec.session,lang,settings:ctx.planSettings||{},now:ctx.now,save:ctx.save,onProfile:ctx.onProfile,onPaceApply:ctx.onPaceApply,paceManaged:ctx.paceManaged,onGoalChange:redraw});}
      if(window.NM_STUDY_ROUTE){
        const planner=document.createElement('div');guidance.appendChild(planner);
        window.NM_STUDY_ROUTE.mount(planner,{lang,course:rec.course,session:rec.session,cadence:ctx.currentCadence||path.config.cadence});
      }
      all('[data-support]').forEach(button=>button.onclick=()=>ctx.seeCourse(path.support[Number(button.dataset.support)].course));
      if(rec.course==='C0'){
        $('.pd-recommended>span').textContent=t('이 앱의 유아 기초 · 선택한 본진도','App early foundations · selected main topic','本应用幼儿基础 · 选择的主要内容');
        const detail=document.createElement('p');detail.className='pd-note';
        detail.textContent=t('유아 회차 번호는 능력 순서가 아닙니다. 아래 활동은 보강할 위치이며, 뒤 회차로 진도를 올린다는 뜻이 아닙니다.','Preschool session numbers are not an ability ladder. These are practice locations, not advancement to later sessions.','幼儿课次编号不代表能力顺序。以下只是补充练习位置，不代表升级到后续课次。');
        $('.pd-recommended').appendChild(detail);
        if(rec.practiceSessions&&rec.practiceSessions.length){
          const practice=document.createElement('div');practice.className='pd-practice';
          practice.textContent=rec.practiceSessions.map(x=>`${t('활동 위치','Practice location','练习位置')}: C0 · ${t('회차','session','课次')} ${x.session} · ${l((window.NM_THREADS[x.t]||{}).name||x.t)}`).join(' / ');
          $('.pd-recommended').appendChild(practice);
        }
      }
      const bookChoices=completedBookChoices(d.selection,false);
      if(bookChoices.length){
        const source=document.createElement('p');source.className='pd-note';
        source.textContent=bookChoices.map(choice=>(choice.row.bookStatus==='completed'
          ?t('완료한 교재','Completed book','已完成的教材')
          :t('기록된 교재 · 완료 여부 미확인','Recorded book · completion unconfirmed','记录的教材 · 完成情况未确认'))+': '+completedBookText(choice)).join(' / ')+'. '+
          t('진단 문항은 별도로 확인한 수의 마법 범위를 기준으로 만들었습니다.','Questions use the separately selected Numbers of Magic scope.','题目依据另行确认的数之魔法范围编排。');
        $('.pd-recommended').appendChild(source);
      }
      if(d.selection.route==='school'&&d.selection.grade){
        const school=document.createElement('p');school.className='pd-note';
        const match=/^([emh])([1-6])$/.exec(d.selection.grade);
        const gradeText=match?t(match[1]==='e'?'초':match[1]==='m'?'중':'고',match[1]==='e'?'Elementary grade ':match[1]==='m'?'Middle school grade ':'High school grade ',match[1]==='e'?'小学':match[1]==='m'?'初中':'高中')+match[2]:d.selection.grade;
        school.textContent=t('학교 진도 기록','School progress recorded','学校进度记录')+': '+gradeText+' · '+(d.selection.semester||'1')+t('학기',' semester','学期')+'. '+t('문항은 직접 선택한 앱 범위에서 만들었습니다.','Questions use the selected app topic.','题目依据所选应用内容编排。');
        $('.pd-recommended').appendChild(school);
      }
      if(d.plan.boundaries&&(d.plan.boundaries.previous||d.plan.boundaries.next)){
        const boundary=document.createElement('p');boundary.className='pd-note';
        boundary.textContent=d.plan.boundaries.previous?t('첫 기초의 이전 6문항은 같은 기초에서 더 작은 수를 확인했습니다.','At the first foundation, the six earlier items used smaller quantities within the same skill.','起点阶段的6道此前题目在同一基础中使用更小数量。'):t('마지막 과정에는 다음 범위가 없어 다음 4문항은 같은 과정 추가 확인입니다.','There is no later range after the final course; the four next items are extra checks in the same course.','最后课程没有后续范围，4道后续题为同一课程的补充确认。');
        $('.pd-score').before(boundary);
      }
      $('#pdRoad').textContent=t('로드맵에서 본진도 보기','See main study on the roadmap','在路线图查看主要进度');
      $('#pdRoad').onclick=()=>ctx.seeCourse(rec.course);$('#pdPick').onclick=ctx.pick;$('#pdAgain').onclick=()=>{const previous=JSON.parse(JSON.stringify(d.selection)),fresh=initial();Object.assign(fresh.selection,previous,paths.normalize(previous));Object.assign(d,fresh);redraw();};
    }
    if(d.phase==='setup')setup();else if(d.phase==='question')question();else if(d.phase==='paper')paper();else if(d.phase==='result'&&d.result)result();else {Object.assign(d,initial());setup();}
  }
  window.NM_PLACEMENT_UI = { version: VERSION, initial, render, parseNumber, readValues };
})();
