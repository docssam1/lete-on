// Cumulative results for the planner and the teacher's unit-test review.
(function (g) {
  'use strict';
  const states = new WeakMap();
  const tracks = {curriculum:'교과', thinking:'사고력'};
  const phases = {initial:'첫 평가', recheck:'새 문항 재점검'};
  const metrics = {independent:'혼자 맞힌 비율', submitted:'문항 수행률', count:'혼자 맞힌 누적 문항 수'};
  const esc = text => String(text ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt = number => number.toLocaleString('ko-KR',{maximumFractionDigits:1});
  const dateLabel = date => date.replace(/-/g,'.');
  const dateTime = date => Date.parse(date+'T00:00:00Z');
  const optionsFor = obj => Object.entries(obj).map(([value,label])=>({value,label}));

  function filters(input, chosen) {
    const rows = (input.attempts || []).filter(a=>a && Object.hasOwn(tracks,a.track) && (!input.day || a.date <= input.day));
    const track = Object.hasOwn(tracks,chosen.track) ? chosen.track : '';
    const inTrack = rows.filter(a=>!track || a.track === track);
    const semesters = [...new Set(inTrack.map(a=>a.semester).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ko',{numeric:true}));
    const semester = semesters.includes(chosen.semester) ? chosen.semester : '';
    const units = new Map();
    for (const a of inTrack) {
      if (!a.unitId || (semester && semester !== a.semester)) continue;
      const bookId = a.bookId || '';
      const value = JSON.stringify([a.track,a.semester || '',bookId,a.unitId]);
      const label = [!track && tracks[a.track],!semester && a.semester,a.unitTitle || a.unitId].filter(Boolean).join(' · ');
      units.set(value,{value,label,track:a.track,semester:a.semester,bookId,unitId:a.unitId});
    }
    const volumes = new Map();
    for (const u of units.values()) volumes.set(u.label,(volumes.get(u.label) || 0)+1);
    for (const u of units.values()) if (volumes.get(u.label)>1) u.label+=' · '+(u.bookId || '교재 미지정');
    const unit = units.get(chosen.unit);
    return {track,semester,semesters,unit,units:[...units.values()],metric:Object.hasOwn(metrics,chosen.metric) ? chosen.metric : 'independent'};
  }

  function select(name,label,options,value,all) {
    const choices = all ? [{value:'',label:all},...options] : options;
    return '<label>'+label+'<select data-assessment-filter="'+name+'">'+choices.map(o=>
      '<option value="'+esc(o.value)+'"'+(o.value===value?' selected':'')+'>'+esc(o.label)+'</option>').join('')+'</select></label>';
  }

  function measure(counts,metric) {
    if (!counts?.eligible) return null;
    if (metric==='count') return counts.independent;
    return 100*counts[metric]/counts.eligible;
  }

  function countsText(counts,metric) {
    if (!counts?.eligible) return '평가 전';
    const solved = metric==='submitted' ? counts.submitted : counts.independent;
    return fmt(solved)+' / '+fmt(counts.eligible)+'문항';
  }

  function series(points,phase,metric,x,y) {
    let line = '', start = true;
    const dots = [];
    for (const p of points) {
      const value = measure(p[phase],metric);
      if (value===null) {start=true;continue;}
      const left=x(p.date).toFixed(3), top=y(value).toFixed(3);
      line += (start?'M':' L')+left+','+top;
      start=false;
      dots.push('<i class="at-dot at-'+phase+'" data-at-date="'+esc(p.date)+'" style="left:'+left+'%;top:'+top+'%"></i>');
    }
    return {path:line?'<path class="at-line at-'+phase+'" data-assessment-series="'+phase+'" d="'+line+'"/>':'',dots:dots.join('')};
  }

  function graph(points,metric) {
    const counting=metric==='count';
    const max=Math.max(1,...points.map(p=>Math.max(p.initial.independent,p.recheck.independent)));
    const step=10**Math.floor(Math.log10(max));
    const cap=counting ? Math.ceil(max/step)*step : 100;
    const start=dateTime(points[0].date), end=dateTime(points.at(-1).date);
    const x=date=>end===start?50:(dateTime(date)-start)*100/(end-start);
    const y=value=>100-100*value/cap;
    const a=series(points,'initial',metric,x,y), b=series(points,'recheck',metric,x,y);
    const ticks=counting?[cap,Math.round(cap/2),0]:[100,50,0];
    const legends=Object.entries(phases).map(([id,name])=>'<span class="at-key at-'+id+'">'+name+'</span>').join('');
    return '<figure class="at-graph"><figcaption>'+legends+'</figcaption><div class="at-inner" aria-hidden="true"><div class="at-plot">'+
      [...new Set(ticks)].map(n=>'<div class="at-axis" style="top:'+y(n)+'%"><span>'+fmt(n)+(counting?'':'%')+'</span></div>').join('')+
      '<svg viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">'+a.path+b.path+'</svg>'+a.dots+b.dots+'</div>'+
      '<div class="at-dates"><span>'+esc(dateLabel(points[0].date))+'</span>'+
      (points.length>1?'<span>'+esc(dateLabel(points.at(-1).date))+'</span>':'')+'</div></div></figure>';
  }

  function markup(input,chosen={}) {
    const f=filters(input,chosen);
    const options={attempts:input.attempts||[],day:input.day,track:f.unit?.track||f.track||undefined,
      semester:f.unit?.semester||f.semester||undefined,unitId:f.unit?.unitId,bookId:f.unit?.bookId};
    const {points}=g.PlannerAssessmentTrend.build(options);
    const last=points.at(-1);
    const controls='<div class="at-filters">'+select('track','영역',optionsFor(tracks),f.track,'전체 영역')+
      select('semester','학기·교재',f.semesters.map(value=>({value,label:value})),f.semester,'전체 학기·교재')+
      select('unit','단원',f.units,f.unit?.value||'','전체 단원')+select('metric','지표',optionsFor(metrics),f.metric)+'</div>';
    const empty = !last || !last.initial.eligible && !last.recheck.eligible;
    const description = f.metric==='submitted'?'답을 제출한 문항 수를 배운 범위의 배정 문항 수로 나눠요.':
      f.metric==='count'?'기록한 날짜까지 혼자 맞힌 서로 다른 문항을 합산해요.':'혼자 맞힌 문항 수를 배운 범위의 배정 문항 수로 나눠요.';
    const lead = '<section class="at-card" aria-label="날짜별 단원 평가 누적 결과">'+controls;
    if(empty)return lead+'<p class="at-empty" role="status">선택한 범위에 집계할 문항이 없어요. 평가 결과를 저장하면 날짜별 누적 그래프가 시작돼요.</p></section>';
    function valueText(counts) {
      const value=measure(counts,f.metric);
      return value===null?'평가 전':fmt(value)+(f.metric==='count'?'문항':'%');
    }
    const summary=Object.entries(phases).map(([phase,title])=>'<div data-assessment-summary="'+phase+'"><dt>'+title+'</dt><dd>'+
      valueText(last[phase])+'</dd>'+(last[phase].eligible?'<small>'+countsText(last[phase],f.metric)+'</small>':'')+'</div>').join('');
    const table=points.map(p=>'<tr><th scope="row">'+esc(dateLabel(p.date))+'</th>'+Object.keys(phases).map(phase=>{
      const counts=p[phase];
      return '<td>'+valueText(counts)+(counts.eligible?'<small>'+countsText(counts,f.metric)+'</small>':'')+'</td>';
    }).join('')+'</tr>').join('');
    return lead+'<div class="at-caption">'+esc(dateLabel(last.date))+'까지 · '+metrics[f.metric]+'</div><dl class="at-summary">'+summary+'</dl>'+
      graph(points,f.metric)+'<p class="at-method">'+description+' 미학습 문항은 제외하고, 재점검은 새 문항으로 계산해요.</p>'+
      '<details data-assessment-table><summary>날짜별 누적 수치 보기</summary><table><caption>'+metrics[f.metric]+' 누적 기록</caption><thead>'+
      '<tr><th scope="col">날짜</th><th scope="col">첫 평가</th><th scope="col">새 문항 재점검</th></tr></thead><tbody>'+table+'</tbody></table></details></section>';
  }

  function render(host,input) {
    if (!host) return;
    let state=states.get(host);
    if (!state) {
      state={chosen:{},input:null,last:null};
      states.set(host,state);
      host.addEventListener('change',event=>{
        const control=event.target.closest('[data-assessment-filter]');
        if (!control || !host.contains(control)) return;
        const name=control.dataset.assessmentFilter;
        if (!['track','semester','unit','metric'].includes(name)) return;
        state.chosen[name]=control.value;
        if (name==='track') state.chosen.semester='';
        if (name==='track' || name==='semester') state.chosen.unit='';
        render(host,state.input);
      });
    }
    state.input=input || {};
    const next=markup(state.input,state.chosen);
    if (next===state.last && host.querySelector('.at-card')) return;
    const open=host.querySelector('[data-assessment-table]')?.open;
    const focus=host.contains(host.ownerDocument.activeElement) ? host.ownerDocument.activeElement?.dataset.assessmentFilter : '';
    host.innerHTML=next;state.last=next;
    if (open && host.querySelector('[data-assessment-table]')) host.querySelector('[data-assessment-table]').open=true;
    if (focus) host.querySelector('[data-assessment-filter="'+focus+'"]')?.focus({preventScroll:true});
  }
  g.PlannerAssessmentView=Object.freeze({render,markup});
})(typeof window==='object'?window:globalThis);
