/* ============================================================
   8세 이하 진단 결과 — 소마·필즈 반별 연산 진도와 견주는 꺾은선 그래프(2026-11-17)
   원장 「사용자가 바로 들어가서 처음에는 진단하고 언제 어디가 끝나는 일정인지 안내하고 8세 이하라면
   소마와 필즈 진도 레벨별 연산 로드맵과 비교하는 그래프를 주기로 했는데」.
   설계는 2026-11-10 설계서 「진도표」(꺾은선 · 지금 속도면 / 주 2회면 언제 · 표로 보기)를 따른다.

   자료: data/academy-arith-lines.js(학원 줄 · 수의 마법 과정의 연산 학년).
   우리 아이 줄: app/learning-plan.js project()의 과정별 끝나는 날(주 1회 · 주 2회) — 위 「표준 로드맵」 표와 같은 계산.
   이 파일은 기록을 쓰지 않는다(고른 반 이름만 진단 선택 칸 compareClass 에 둔다).
   ============================================================ */
(function(root){
  'use strict';
  const E=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  /* 조사: 이름 끝소리에 받침이 있으면 은/이, 없으면 는/가. 「필즈 E1」은 「이원」, 「S」는 「에스」로 읽는다. */
  function josa(word,pair){
    const ch=String(word).replace(/[)\s]+$/,'').slice(-1),code=ch.charCodeAt(0);
    let bat;if(code>=0xAC00&&code<=0xD7A3)bat=(code-0xAC00)%28!==0;else bat=/[013678LMNR]/i.test(ch);
    return word+(bat?pair[0]:pair[1]);
  }

  /* ---------- 달 · 학년 ---------- */
  function monthIndex(date,y7){
    const d=new Date(date);if(!Number.isFinite(+d))return null;
    const y=d.getUTCFullYear(),m=d.getUTCMonth(),dim=new Date(Date.UTC(y,m+1,0)).getUTCDate();
    return (y-y7)*12+m+(d.getUTCDate()-1)/dim;
  }
  /* 달 이름: 그 달에 들어 있으면 그 달(내림). 영어는 「Nov · Age 7」 */
  const EN_MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function monthName(m,t){
    const r=Math.floor(m+1e-6),yr=Math.floor(r/12),mo=((r%12)+12)%12+1;
    const who=yr<0?t((7+yr)+'세','Age '+(7+yr),(7+yr)+'岁'):yr===0?t('7세','Age 7','7岁'):t('초'+yr,'Grade '+yr,'小'+yr);
    return t(who+' '+mo+'월',EN_MON[mo-1]+' · '+who,who+mo+'月');
  }
  function levelText(v,t){
    if(v==null)return t('표에 없음','not in the table','表中没有');
    if(v>=7)return t('중등 연산','middle-school arithmetic','初中运算');
    if(v<1)return t('유아 수 기초','preschool number sense','幼儿数基础');
    const g=Math.floor(v+1e-9),h=(v-g)<0.5-1e-9?1:2;
    return t(g+'학년 '+h+'학기 연산','Grade '+g+' term '+h+' arithmetic',g+'年级'+(h===1?'上':'下')+'学期运算');
  }
  const valAt=(pts,m)=>{if(!pts.length||m<pts[0][0]-1e-9||m>pts[pts.length-1][0]+1e-9)return null;for(let i=1;i<pts.length;i++)if(m<=pts[i][0]+1e-9){const a=pts[i-1],b=pts[i];return a[1]+(b[1]-a[1])*(m-a[0])/((b[0]-a[0])||1);}return pts[pts.length-1][1];};
  /* 학원 줄은 마지막 책을 시작한 뒤 원표가 끝나는 달까지 그 책을 푼다 — 그 사이는 마지막 높이 그대로 */
  const classPts=c=>c.points.concat(c.end>c.points[c.points.length-1][0]?[[c.end,c.points[c.points.length-1][1],null]]:[]);
  function monthAt(pts,v){for(let i=0;i<pts.length;i++){if(pts[i][1]>=v-1e-9){if(i===0)return pts[0][0];const a=pts[i-1],b=pts[i];return b[1]===a[1]?b[0]:a[0]+(b[0]-a[0])*(v-a[1])/(b[1]-a[1]);}}return null;}

  /* ---------- 수의 마법 과정 → 연산 학년 ---------- */
  function courseLevels(){
    const D=root.NM_ACADEMY_LINES,C=root.NM_COURSES||{},keys=Object.keys(C).filter(k=>/^C\d+$/.test(k)).map(k=>+k.slice(1)).filter(n=>n<=24).sort((a,b)=>a-b);
    const n=k=>Math.max(1,((C['C'+k]||{}).sessions||[]).length),out={};
    let prevKey=-1,prevLv=D.startLevel;
    const anchors=Object.keys(D.courseEnd).map(k=>+k.slice(1)).sort((a,b)=>a-b);
    for(const a of anchors){
      const span=keys.filter(k=>k>prevKey&&k<=a),total=span.reduce((s,k)=>s+n(k),0);let acc=0;
      for(const k of span){const st=prevLv+(D.courseEnd['C'+a]-prevLv)*acc/total;acc+=n(k);out['C'+k]={start:st,end:prevLv+(D.courseEnd['C'+a]-prevLv)*acc/total,n:n(k)};}
      prevKey=a;prevLv=D.courseEnd['C'+a];
    }
    return out;
  }
  function levelAt(table,course,session){
    const r=table[course];if(!r)return Number(String(course).slice(1))>24?7:null;
    const f=Math.max(0,Math.min(1,((Number(session)||1)-1)/r.n));return r.start+(r.end-r.start)*f;
  }
  /* 과정별 끝나는 날(앱 일정 계산) → 우리 아이 줄의 점 */
  function kidCurve(opts,cadence,table,y7){
    const P=root.NM_LEARNING_PLAN;if(!P||!table[opts.course])return null;
    let plan;try{plan=P.project(root.NM_COURSES,Object.assign({},opts.settings,{courseKey:opts.course,sessionIndex:opts.session,cadence}),{lang:opts.lang,months:36,now:opts.now||new Date()});}catch(e){return null;}
    const today=new Date(opts.now||Date.now()),m0=monthIndex(today,y7);
    const pts=[[m0,levelAt(table,opts.course,opts.session)]];let finish=null;
    for(const ms of plan.milestones||[]){
      const r=table[ms.key];if(!r)break;
      const m=monthIndex(ms.date+'T00:00:00Z',y7);pts.push([m,r.end]);
      if(r.end>=7-1e-9){finish={m,date:ms.date};break;}
    }
    return {pts,finish};
  }
  function meet(cls,kid,m0){
    const end=cls[cls.length-1][0],from=Math.max(m0,cls[0][0]);if(from>end)return null;
    const diff=m=>{const k=valAt(kid,m),c=valAt(cls,m);return k==null||c==null?null:k-c;};
    const d0=diff(from);if(d0==null)return null;const ahead=d0>=0;
    for(let m=from;m<=end+1e-9;m+=0.25){const d=diff(m);if(d==null)break;if((d>=0)!==ahead)return {ahead,m,end};}
    return {ahead,m:null,end};
  }

  /* ---------- 그리기 ---------- */
  function svg(c,kids,others,m0,xmin,xmax,ymin,t){
    const LX=88,MW=16,T=18,GH=44,W=LX+(xmax-xmin)*MW+24,H=T+(7.3-ymin)*GH+40;
    const X=m=>LX+(m-xmin)*MW,Y=v=>T+(7.3-v)*GH;
    let s='<svg class="ac-svg" viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'" role="img" aria-label="'+E(t('달을 가로, 연산 내용의 학년을 세로로 놓고 고른 반의 연산 책과 우리 아이의 주 1회·주 2회 예상 진도를 꺾은선으로 그린 그래프입니다. 같은 내용을 아래 「표로 보기」에서 볼 수 있어요.','A line chart with months across and arithmetic grade level up the side, comparing the selected class with your child at once and twice a week. The same data is in the table below.','横轴为月份、纵轴为运算内容年级的折线图，比较所选班级与孩子每周1次、2次的预计进度。下方「以表格查看」有相同内容。'))+'">';
    for(let g=Math.ceil(ymin);g<=7;g++){s+='<line class="ac-grid" x1="'+LX+'" y1="'+Y(g)+'" x2="'+(W-12)+'" y2="'+Y(g)+'"/><text class="ac-axis" x="'+(LX-10)+'" y="'+(Y(g)+4)+'" text-anchor="end">'+E(g===7?t('중등','Middle','初中'):t(g+'학년','Gr '+g,g+'年级'))+'</text>';}
    if(ymin<1)s+='<text class="ac-axis" x="'+(LX-10)+'" y="'+(Y(0.6)+4)+'" text-anchor="end">'+E(t('유아','Pre-K','幼儿'))+'</text>';
    for(let m=Math.ceil(xmin);m<=xmax;m++){const mo=((m%12)+12)%12;if(mo%3)continue;const yr=mo===0;
      s+='<line class="ac-grid'+(yr?' yr':'')+'" x1="'+X(m)+'" y1="'+T+'" x2="'+X(m)+'" y2="'+Y(ymin)+'"/><text class="ac-axis'+(yr?' yr':'')+'" x="'+X(m)+'" y="'+(Y(ymin)+20)+'" text-anchor="middle">'+E(yr?monthName(m,t):t((mo+1)+'월',''+(mo+1),(mo+1)+'月'))+'</text>';}
    const line=(pts,cls,dash)=>'<polyline class="'+cls+'" points="'+pts.filter(p=>p[0]>=xmin-1e-9&&p[0]<=xmax+1e-9).map(p=>X(p[0]).toFixed(1)+','+Y(Math.max(ymin,Math.min(7.3,p[1]))).toFixed(1)).join(' ')+'"'+(dash?' stroke-dasharray="7 5"':'')+'/>';
    others.forEach(o=>{s+=line(classPts(o),'ac-other');});
    const cp=classPts(c);s+=line(cp,'ac-class');
    c.points.forEach((p,i)=>{if(p[0]<xmin||p[0]>xmax)return;s+='<circle class="ac-class-dot" cx="'+X(p[0])+'" cy="'+Y(p[1])+'" r="5"/>';
      const show=c.points.length<=6||i===0||i===c.points.length-1||Math.abs(p[1]%1)<1e-9;
      if(show)s+='<text class="ac-tag" x="'+X(p[0])+'" y="'+(Y(p[1])-11)+'" text-anchor="middle">'+E(t(p[2].ko,p[2].en,p[2].zh).replace(/ →.*/,''))+'</text>';});
    kids.forEach((k,i)=>{if(!k)return;s+=line(k.pts,'ac-kid',i===1);});
    kids.forEach(k=>{if(!k)return;const r=meet(cp,k.pts,m0);if(r&&r.m!=null&&r.m<=xmax)s+='<circle class="ac-meet" cx="'+X(r.m)+'" cy="'+Y(valAt(k.pts,r.m))+'" r="7"/>';});
    const k0=kids[0]||kids[1];
    s+='<line class="ac-today" x1="'+X(m0)+'" y1="'+T+'" x2="'+X(m0)+'" y2="'+Y(ymin)+'"/><text class="ac-today-t" x="'+(X(m0)+5)+'" y="'+(T+10)+'">'+E(t('오늘','Today','今天'))+'</text>';
    if(k0)s+='<circle class="ac-kid-dot" cx="'+X(m0)+'" cy="'+Y(Math.max(ymin,k0.pts[0][1]))+'" r="7"/>';
    /* 왼쪽 학년 눈금은 따로 그려 그래프를 옆으로 밀어도 남게 한다 */
    const AW=50;let ax='<svg class="ac-yaxis" viewBox="0 0 '+AW+' '+H+'" width="'+AW+'" height="'+H+'" aria-hidden="true">';
    for(let g=Math.ceil(ymin);g<=7;g++)ax+='<text class="ac-axis" x="'+(AW-6)+'" y="'+(Y(g)+4)+'" text-anchor="end">'+E(g===7?t('중등','Middle','初中'):t(g+'학년','Gr '+g,g+'年级'))+'</text>';
    if(ymin<1)ax+='<text class="ac-axis" x="'+(AW-6)+'" y="'+(Y(0.6)+4)+'" text-anchor="end">'+E(t('유아','Pre-K','幼儿'))+'</text>';
    return {main:s+'</svg>',axis:ax+'</svg>'};
  }

  function mount(host,opts){
    const D=root.NM_ACADEMY_LINES,lang=opts.lang,t=(ko,en,zh)=>lang==='en'?en:lang==='zh'?zh:ko,L=o=>o?t(o.ko,o.en,o.zh):'';
    if(!D||!opts.birthYear){host.hidden=true;return;}
    const y7=Number(opts.birthYear)+6,table=courseLevels(),now=new Date(opts.now||Date.now()),m0=monthIndex(now,y7);
    const s=opts.selection||{};
    let pick=D.classes.some(c=>c.id===s.compareClass)?s.compareClass:(D.goalClass[s.goalTarget]||'fields-e1');
    const kids=[kidCurve(opts,'w1',table,y7),kidCurve(opts,'w2',table,y7)];
    const kidLv=levelAt(table,opts.course,opts.session);
    const draw=()=>{
      const c=D.classes.find(x=>x.id===pick),cp=classPts(c),others=D.classes.filter(x=>x!==c);
      const xmin=Math.floor(Math.min(m0-1,-3)),xmax=47;
      const ymin=Math.min(1,...kids.filter(Boolean).map(k=>k.pts[0][1]))<1?0.5:1;
      /* 첫 줄: 오늘 그 반의 연산 책과 우리 아이 자리 */
      const cv=valAt(cp,m0),name=L(c.name);
      let say;
      if(m0<cp[0][0]-1e-9)say=t(name+' 연산 책은 '+monthName(cp[0][0],t)+'에 '+L(c.points[0][2])+'('+levelText(c.points[0][1],t)+')부터 시작해요. ',name+' starts '+L(c.points[0][2])+' ('+levelText(c.points[0][1],t)+') in '+monthName(cp[0][0],t)+'. ',name+'在'+monthName(cp[0][0],t)+'开始'+L(c.points[0][2])+'（'+levelText(c.points[0][1],t)+'）。');
      else if(cv==null)say=t(name+' 원표는 '+monthName(c.end,t)+'까지예요. ',name+'’s table ends in '+monthName(c.end,t)+'. ',name+'原表到'+monthName(c.end,t)+'为止。');
      else{const at=c.points.filter(p=>p[0]<=m0+1e-9).pop();say=t('오늘('+monthName(m0,t)+') '+josa(name,['은','는'])+' 연산 책으로 '+L(at[2]).replace(/ →.*/,'')+'('+levelText(cv,t)+')을 풀어요. ','Today ('+monthName(m0,t)+') '+name+' works on '+L(at[2]).replace(/ →.*/,'')+' ('+levelText(cv,t)+'). ','今天（'+monthName(m0,t)+'）'+name+'在做'+L(at[2]).replace(/ →.*/,'')+'（'+levelText(cv,t)+'）。');}
      say+=t('우리 아이는 수의 마법 과정 '+String(opts.course).slice(1)+'('+levelText(kidLv,t)+' 자리)에서 시작해요.','Your child starts at app course '+String(opts.course).slice(1)+' ('+levelText(kidLv,t)+').','孩子从本应用课程'+String(opts.course).slice(1)+'（'+levelText(kidLv,t)+'）开始。');
      const was=kidLv!=null?monthAt(cp,kidLv):null;
      if(was!=null&&cv!=null){const d=Math.round(m0-was);say+=' '+(d>0?t(josa(name,['은','는'])+' 이 내용을 '+monthName(was,t)+'에 풀어서 우리 아이보다 '+d+'개월 앞서 있어요.',name+' covered this in '+monthName(was,t)+' — '+d+' month'+(d>1?'s':'')+' ahead.',name+'在'+monthName(was,t)+'做这部分，相差'+d+'个月。'):d<0?t(josa(name,['은','는'])+' 이 내용을 '+monthName(was,t)+'에 풀어요. 우리 아이가 '+(-d)+'개월 앞서 있어요.',name+' reaches this in '+monthName(was,t)+' — your child is '+(-d)+' month'+(-d>1?'s':'')+' ahead.',name+'在'+monthName(was,t)+'才做这部分，孩子领先'+(-d)+'个月。'):t('같은 달에 같은 내용을 풀어요.','Same content in the same month.','同月做同样内容。'));}
      const meetText=(k,label)=>{
        if(!k)return t('일정을 계산하지 못했어요.','Could not calculate a schedule.','无法计算进度。');
        const r=meet(cp,k.pts,m0);let a='';
        if(!r)a=t(name+' 원표가 끝난 뒤라 견줄 수 없어요.','The '+name+' table has ended, so there is nothing to compare.',name+'原表已结束，无法比较。');
        else if(!r.ahead)a=r.m!=null?t('<b>'+monthName(r.m,t)+'</b>에 '+name+' 연산 자리에 닿아요.','Reaches '+name+'’s arithmetic level in <b>'+monthName(r.m,t)+'</b>.','<b>'+monthName(r.m,t)+'</b>追上'+name+'的运算进度。'):t(name+' 원표가 끝나는 '+monthName(r.end,t)+'까지는 닿지 않아요.','Does not reach '+name+' before its table ends ('+monthName(r.end,t)+').','到'+name+'原表结束（'+monthName(r.end,t)+'）仍追不上。');
        else a=r.m!=null?t('지금은 앞서 있고, <b>'+monthName(r.m,t)+'</b>에 '+josa(name,['이','가'])+' 앞서 나가요.','Ahead now; '+name+' passes in <b>'+monthName(r.m,t)+'</b>.','现在领先，<b>'+monthName(r.m,t)+'</b>被'+name+'超过。'):t(name+' 원표가 끝나는 '+monthName(r.end,t)+'까지 앞서 있어요.','Stays ahead until '+name+'’s table ends ('+monthName(r.end,t)+').','到'+name+'原表结束（'+monthName(r.end,t)+'）都领先。');
        const f=k.finish?t(' 초등 연산을 다 끝내는 달: <b>'+monthName(k.finish.m,t)+'</b> ('+k.finish.date+').',' Finishes primary arithmetic in <b>'+monthName(k.finish.m,t)+'</b> ('+k.finish.date+').',' 小学运算全部完成：<b>'+monthName(k.finish.m,t)+'</b>（'+k.finish.date+'）。'):t(' 초등 연산은 3년 안에 다 끝나지 않아요.',' Primary arithmetic is not finished within 3 years.',' 3年内无法完成小学运算。');
        return a+f;
      };
      const chip=x=>'<button type="button" class="ac-chip" data-ac="'+E(x.id)+'" aria-pressed="'+(x.id===pick)+'">'+E(L(x.name))+(x.source==='shift'?'<small>'+E(t('계산','calc.','推算'))+'</small>':'')+'</button>';
      /* 표로 보기: 고른 반이 책을 시작하는 달 + 석 달마다 우리 아이 */
      const months=[...new Set(c.points.map(p=>Math.round(p[0])).concat(Array.from({length:Math.max(0,Math.floor((xmax-Math.ceil(m0))/3)+1)},(_,i)=>Math.ceil(m0)+i*3)))].filter(m=>m>=xmin&&m<=xmax).sort((a,b)=>a-b);
      const rows=months.map(m=>{const p=c.points.find(q=>Math.round(q[0])===m);const v=valAt(cp,m);return '<tr><th>'+E(monthName(m,t))+'</th><td>'+(p?E(L(p[2])):'')+'</td><td>'+E(v==null?'—':levelText(v,t))+'</td><td>'+E(kids[0]&&m>=m0-0.5?levelText(Math.min(7,valAt(kids[0].pts,m)??7),t):'—')+'</td><td>'+E(kids[1]&&m>=m0-0.5?levelText(Math.min(7,valAt(kids[1].pts,m)??7),t):'—')+'</td></tr>';}).join('');
      const chart=svg(c,kids,others,m0,xmin,xmax,ymin,t);
      host.innerHTML='<h3>'+t('소마·필즈 반별 연산 진도와 견주기','Compare with SOMA and Fields class arithmetic','与SOMA·Fields各班运算进度比较')+'</h3>'
        +'<p class="pd-note">'+t('8세 이하는 학원 반이 같은 달에 푸는 연산 책과 우리 아이의 예상 진도를 한 그래프에 놓아요. 반을 고르세요.','For children 8 and under, this puts the arithmetic book each class uses in the same month next to your child’s expected progress. Choose a class.','8岁以下：把各班同月做的运算书与孩子的预计进度放在同一张图上。请选择班级。')+'</p>'
        +'<div class="ac-chips" role="group" aria-label="'+E(t('견줄 반','Class to compare','比较班级'))+'"><span class="ac-group">'+E(t('필즈','Fields','Fields'))+'</span>'+D.classes.filter(x=>x.academy==='fields').map(chip).join('')+'<span class="ac-group">'+E(t('소마','SOMA','SOMA'))+'</span>'+D.classes.filter(x=>x.academy==='soma').map(chip).join('')+'</div>'
        +'<p class="ac-say">'+E(say)+'</p>'
        +'<div class="ac-legend"><span><i class="ac-key class"></i>'+E(name+t(' 연산 책',' arithmetic book',' 运算书'))+'</span><span><i class="ac-key kid"></i>'+E(t('우리 아이 · 주 1회','Your child · once a week','孩子 · 每周1次'))+'</span><span><i class="ac-key kid dash"></i>'+E(t('우리 아이 · 주 2회','Your child · twice a week','孩子 · 每周2次'))+'</span><span><i class="ac-key other"></i>'+E(t('다른 반','Other classes','其他班'))+'</span><span><i class="ac-ring"></i>'+E(t('만나는 자리','Where the lines meet','交汇点'))+'</span></div>'
        +'<p class="ac-swipe" hidden>'+E(t('← 옆으로 밀어 다음 달을 보세요 →','← Swipe sideways to see later months →','← 左右滑动查看后面的月份 →'))+'</p><div class="ac-plot"><div class="ac-scroll" tabindex="0">'+chart.main+'</div>'+chart.axis+'</div>'
        +'<div class="ac-two"><div><b>'+E(t('주 1회로 하면','Once a week','每周1次'))+'</b><span>'+meetText(kids[0])+'</span></div><div><b>'+E(t('주 2회로 바꾸면','Twice a week','改为每周2次'))+'</b><span>'+meetText(kids[1])+'</span></div></div>'
        +'<details class="ac-table"><summary>'+E(t('표로 보기','View as a table','以表格查看'))+'</summary><div class="pd-calendar-table"><table><thead><tr><th>'+E(t('달','Month','月份'))+'</th><th>'+E(t(josa(name,['이','가'])+' 시작하는 책',name+' starts',name+' 开始的书'))+'</th><th>'+E(name)+'</th><th>'+E(t('우리 아이 주 1회','Child · once a week','孩子 每周1次'))+'</th><th>'+E(t('우리 아이 주 2회','Child · twice a week','孩子 每周2次'))+'</th></tr></thead><tbody>'+rows+'</tbody></table></div></details>'
        +'<p class="pd-note">'+E(L(c.name)+' · '+(c.source==='table'?t('원표: ','Source table: ','原表：'):t('원표 아님 — ','Not a source table — ','非原表 — '))+L(c.basis)+'. ')+E(t('학원 줄은 원장님이 받은 2026년 원표와, 원장 기준으로 몇 달 밀거나 당겨 계산한 줄이에요. 반·해마다 달라질 수 있어요. 더클셈은 기적의 계산법과 같은 권 = 같은 학기로 봤어요. 소마는 사고력 과정이 아니라 연산 교재만 견줘요. 연산 진도만 견주며 반 배정·합격을 판단하지 않아요.','Class lines come from 2026 reference tables the director received, or are shifted by a few months on the director’s guidance; they vary by class and year. The Classic Calc volumes are read as equal to Miracle Calculation volumes (one per term). For SOMA only the arithmetic books are compared, not the reasoning course. This compares arithmetic progress only and does not judge class placement or admission.','班级进度来自园长收到的2026年原表，或按园长标准前后推几个月算出，各班各年可能不同。The Classic Calc按与奇迹计算法同册=同学期看待。SOMA只比较运算教材，不比较思维课程。只比较运算进度，不判断分班或录取。'))+'</p>';
      /* 좁은 화면: 그래프를 오늘 자리부터 보이게 밀어 두고, 옆으로 밀 수 있다고 알린다 */
      const sc=host.querySelector('.ac-scroll');if(sc&&sc.scrollWidth>sc.clientWidth+4){sc.scrollLeft=Math.max(0,88+(m0-xmin)*16-96);host.querySelector('.ac-swipe').hidden=false;}
      host.querySelectorAll('[data-ac]').forEach(b=>b.onclick=()=>{pick=b.dataset.ac;s.compareClass=pick;opts.save?.();draw();const nb=host.querySelector('[data-ac="'+pick+'"]');nb&&nb.focus();});
    };
    draw();
  }
  function eligible(levelCode){const D=root.NM_ACADEMY_LINES;return !!D&&D.maxAgeLevel.includes(levelCode);}
  const api={mount,eligible,courseLevels,levelAt,monthIndex,valAt,classPts,meet};
  root.NM_ACADEMY_COMPARE=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
