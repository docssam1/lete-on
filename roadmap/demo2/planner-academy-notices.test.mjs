import {readFileSync} from 'node:fs';import vm from 'node:vm';import test from 'node:test';import assert from 'node:assert/strict';
const read=f=>readFileSync(new URL(f,import.meta.url),'utf8'),w={},c=vm.createContext({window:w,URL});
for(const f of ['planner-academy-notices.js','planner-academy-stories.js'])vm.runInContext(read(f),c,{filename:f});
const N=w.PlannerAcademyNotices,feed=JSON.parse(read('data/academy-notices.json'));N.ingest(feed);
test('24개 학원과 공식 공지·확인일을 읽고 모드·과목·학원·종류로 고른다',()=>{
 assert.equal(feed.academies.length,24);assert.ok(N.select('elementary').items.length>0);
 const won=N.select('elementary','수학학원',{academy:'won',kind:'test',when:'all'}).items;assert.ok(won.length>0);assert.ok(won.every(x=>x.academy==='won'&&x.kind==='test'));
 const pre=N.select('preschool','전체',{when:'all'}).items;assert.ok(pre.every(x=>x.kind!=='test'));
 assert.match(w.PlannerAcademyStories.render('elementary','b13','전체','notices'),/data-notice-filter="academy"/);
 const html=w.PlannerAcademyStories.detail('notice-fields-2027-admission');assert.match(html,/2027.01.04/);assert.match(html,/공식 공지 원문/);
});
test('게시일·제목의 모집 연도를 행사일로 추정하지 않는다',()=>{
 const x={...N.find('notice-fields-2027-admission'),events:[],registration:null,dateStatus:'unconfirmed'};
 assert.equal(N.status(x,'2026-11-03').code,'unknown');assert.match(N.detail(x),/게시일을 시험일이나 설명회 날짜로 바꾸어/);
 assert.equal(N.status({...x,title:'2027 신규모집 설명회',publishedAt:'2026-10-01'}).code,'unknown');
});
test('서울 시간 접수 경계와 지난 일정·원문 변경을 구분한다',()=>{
 const original=N.find('notice-reviewed-224443076138');assert.ok(original);
 // Test date boundaries independently of the live feed's later source-review status.
 const x={...original,sourceState:'unchanged'};
 assert.equal(N.status(x,'2026-11-04',Date.parse('2026-11-04T22:59:59+09:00')).label,'접수 예정');
 assert.equal(N.status(x,'2026-11-04',Date.parse('2026-11-04T23:00:00+09:00')).label,'접수 기간');
 assert.equal(N.status(x,'2026-11-07',Date.parse('2026-11-07T00:00:00+09:00')).code,'closed');
 assert.equal(N.status(x,'2026-12-05',Date.parse('2026-12-05T01:00:00+09:00')).code,'past');
 assert.equal(N.status({...x,sourceState:'changed'},'2026-11-04').code,'review');
 const history=N.select('elementary','국어학원',{when:'past'},'2026-11-03').items;
 assert.ok(history.some(x=>x.id==='kiparang-2027-220'));assert.ok(!N.select('elementary','국어학원',{when:'upcoming'},'2026-11-03').items.some(x=>x.id==='kiparang-2027-220'));
});
test('외부 피드의 실행 링크·선택자 삽입은 버리고 본문을 이스케이프한다',()=>{
 const bad=structuredClone(feed),base=bad.items[0];
 bad.items.push({...base,id:'bad-url',url:'javascript:alert(1)'},{...base,id:'bad\"]x',title:'bad'},{...base,id:'escaped',title:'<img src=x onerror=alert(1)>'});
 const clean=N.validate(bad);assert.ok(!clean.items.some(x=>x.id==='bad-url'||x.id==='bad\"]x'));
 N.ingest(bad);assert.match(N.detail(N.find('notice-escaped')),/&lt;img/);assert.ok(!N.detail(N.find('notice-escaped')).includes('<img'));
 N.ingest(feed);assert.throws(()=>N.validate({...feed,schemaVersion:9}));
});
test('회원 확인 후 게시판을 로드하며 개인 계획 저장은 건드리지 않는다',()=>{
 const source=read('planner-academy-notices.js');assert.doesNotMatch(source,/localStorage|sessionStorage|RoadmapMembership/);
 assert.match(read('planner.html'),/data-member-src="planner-academy-notices\.js/);
});

// ── 달력 보기 ── 자동 수집 자료가 바뀌어도 흔들리지 않게, 계산은 만든 자료로 확인한다.
const plain=v=>JSON.parse(JSON.stringify(v));
const calFeed={schemaVersion:1,generatedAt:'2026-11-11T00:00:00+09:00',sources:[],academies:[
 {id:'aa',name:'가나수학',subject:'수학학원',stages:['elementary','middle'],url:'https://blog.naver.com/aa'},
 {id:'bb',name:'다라국어',subject:'국어학원',stages:['elementary'],url:'https://blog.naver.com/bb'}],items:[
 {id:'exam',academy:'aa',kind:'test',title:'11월 입학시험',url:'https://blog.naver.com/aa/1',stages:['elementary','middle'],dateStatus:'confirmed',publishedAt:'2026-10-20',
  registration:{start:'2026-11-04T23:00:00+09:00',end:'2026-11-07T00:00:00+09:00',endExclusive:true,label:'11/4 23시~11/6 24시'},
  events:[{label:'초등 시험',date:'2026-11-14',note:'09:30'},{label:'중등 시험',date:'2026-11-14'},{label:'화목반 개강',date:'2026-12-03'}]},
 {id:'admit',academy:'aa',kind:'admission',title:'2027 신입 모집',url:'https://blog.naver.com/aa/2',stages:['elementary'],dateStatus:'confirmed',publishedAt:'2026-10-25',
  registration:{start:'2026-11-28',end:'2026-12-02'},events:[{label:'접수',date:'2026-11-28',through:'2026-12-02'},{label:'개별 상담 연락',date:'2026-12-05'}]},
 {id:'talk',academy:'bb',kind:'seminar',title:'신규모집 설명회',url:'https://blog.naver.com/bb/1',stages:['elementary'],dateStatus:'confirmed',publishedAt:'2026-10-01',events:[{label:'초등 설명회',date:'2026-10-21'}]},
 {id:'guess',academy:'bb',kind:'seminar',title:'12월 설명회 안내',url:'https://blog.naver.com/bb/2',stages:['elementary'],dateStatus:'unconfirmed',publishedAt:'2026-11-09',events:[{label:'설명회',date:'2026-11-20'}]},
 {id:'bare',academy:'aa',kind:'notice',title:'겨울 시간표 안내',url:'https://blog.naver.com/aa/3',stages:['elementary'],dateStatus:'confirmed',publishedAt:'2026-11-10',events:[]},
 {id:'xss',academy:'bb',kind:'test',title:'<b>제목</b>',url:'https://blog.naver.com/bb/3',stages:['elementary'],dateStatus:'confirmed',publishedAt:'2026-11-01',events:[{label:'<img src=x onerror=alert(1)>',date:'2026-11-18',note:'"><script>'}]}]};
const withCalFeed=fn=>{N.ingest(calFeed);try{return fn();}finally{N.ingest(feed);}};
test('달력: 월 격자는 일요일부터 시작하고 달 밖의 칸은 비운다',()=>{
 const nov=plain(N.monthGrid('2026-11'));assert.equal(nov.length,5);assert.ok(nov.every(w=>w.length===7));
 assert.deepEqual(nov[0],['2026-11-01','2026-11-02','2026-11-03','2026-11-04','2026-11-05','2026-11-06','2026-11-07']);
 assert.deepEqual(nov[4],['2026-11-29','2026-11-30',null,null,null,null,null]);
 const oct=plain(N.monthGrid('2026-10'));assert.deepEqual(oct[0],[null,null,null,null,'2026-10-01','2026-10-02','2026-10-03']);assert.equal(oct.flat().filter(Boolean).length,31);
 assert.equal(N.monthGrid('2026-02').length,4);assert.equal(N.monthGrid('2028-02').flat().filter(Boolean).length,29);assert.equal(N.monthGrid('2027-05').length,6);
 assert.deepEqual(plain(N.monthGrid('2026-13')),[]);assert.deepEqual(plain(N.monthGrid('<script>')),[]);
 assert.equal(N.shiftMonth('2026-12',1),'2027-01');assert.equal(N.shiftMonth('2026-01',-1),'2025-12');assert.equal(N.shiftMonth('2026-11',12),'2027-11');
 assert.equal(N.shiftMonth('2099-12',1),'2099-12');assert.equal(N.shiftMonth('2000-01',-1),'2000-01');assert.equal(N.shiftMonth('nope',1),'');
});
test('달력: 날짜 더하기·범위 펼치기·서울 날짜 바꾸기',()=>{
 assert.equal(N.addDays('2026-11-30',1),'2026-12-01');assert.equal(N.addDays('2026-01-01',-1),'2025-12-31');assert.equal(N.addDays('2028-02-28',1),'2028-02-29');assert.equal(N.addDays('x',1),'');
 assert.deepEqual(plain(N.expandRange('2026-11-28','2026-12-02')),['2026-11-28','2026-11-29','2026-11-30','2026-12-01','2026-12-02']);
 assert.deepEqual(plain(N.expandRange('2026-11-14')),['2026-11-14']);assert.deepEqual(plain(N.expandRange('2026-11-14','2026-11-01')),['2026-11-14']);
 assert.deepEqual(plain(N.expandRange('bad','2026-11-01')),[]);assert.equal(N.expandRange('2026-01-01','2029-01-01').length,400);
 // 서울 0시에 끝나는 접수의 마지막 날은 전날이다. UTC 시각은 서울 날짜로 옮긴다.
 assert.equal(N.seoulDay('2026-11-07T00:00:00+09:00',true),'2026-11-06');assert.equal(N.seoulDay('2026-11-07T00:00:00+09:00'),'2026-11-07');
 assert.equal(N.seoulDay('2026-11-04T23:00:00+09:00'),'2026-11-04');assert.equal(N.seoulDay('2026-11-04T15:30:00Z'),'2026-11-05');
 assert.equal(N.seoulDay('2026-11-07'),'2026-11-07');assert.equal(N.seoulDay('2026-11-07',true),'2026-11-06');assert.equal(N.seoulDay('2026-11-31'),'');assert.equal(N.seoulDay(null),'');
});
test('달력: 화살표·Home/End·PageUp/PageDown 이동',()=>{
 const m=(k,d='2026-11-11',s)=>N.moveDay(d,k,s);
 assert.equal(m('ArrowLeft'),'2026-11-10');assert.equal(m('ArrowRight'),'2026-11-12');assert.equal(m('ArrowUp'),'2026-11-04');assert.equal(m('ArrowDown'),'2026-11-18');
 assert.equal(m('Home'),'2026-11-08');assert.equal(m('End'),'2026-11-14');assert.equal(m('Home','2026-11-08'),'2026-11-08');assert.equal(m('End','2026-11-14'),'2026-11-14');
 assert.equal(m('ArrowLeft','2026-11-01'),'2026-10-31');assert.equal(m('ArrowDown','2026-12-28'),'2027-01-04');
 assert.equal(m('PageDown'),'2026-12-11');assert.equal(m('PageUp'),'2026-10-11');assert.equal(m('PageDown','2027-01-31'),'2027-02-28');assert.equal(m('PageUp','2026-12-31'),'2026-11-30');
 assert.equal(m('PageDown','2026-11-11',true),'2027-11-11');assert.equal(m('PageUp','2028-02-29',true),'2027-02-28');
 assert.equal(m('Enter'),'');assert.equal(m('a'),'');assert.equal(m('ArrowLeft','bad'),'');assert.equal(m('ArrowLeft','2000-01-01'),'');
});
test('달력: 날짜가 확인된 일정과 접수 기간만 펼치고 게시일은 쓰지 않는다',()=>withCalFeed(()=>{
 const items=N.select('elementary','전체',{when:'all'},'2026-11-11').items,list=plain(N.entries(items)),on=(id,d)=>list.filter(e=>e.id===id&&e.date===d);
 assert.equal(items.length,6);
 // 미확인 공지는 일정 날짜가 적혀 있어도 놓지 않는다. 날짜 없는 확인 공지도 놓을 곳이 없다.
 assert.ok(!list.some(e=>e.id==='guess'||e.id==='bare'));
 // 게시일은 어느 항목의 날짜로도 쓰이지 않는다.
 const published=new Set(items.map(x=>x.id+'|'+x.publishedAt));assert.ok(!list.some(e=>published.has(e.id+'|'+e.date)));
 // 접수: 11/4 23시 시작 ~ 11/7 0시 마감(그 시각 직전까지) → 11/4·5·6
 const reg=list.filter(e=>e.id==='exam'&&e.registration);assert.deepEqual(reg.map(e=>e.date+':'+e.part),['2026-11-04:start','2026-11-05:middle','2026-11-06:end']);
 assert.ok(reg.every(e=>e.type==='접수'&&e.note==='11/4 23시~11/6 24시'));
 assert.deepEqual(on('exam','2026-11-14').map(e=>e.label+':'+e.type+':'+e.part),['초등 시험:시험:single','중등 시험:시험:single']);
 // 시험 공지 안의 개강은 '시험'으로 뭉개지 않는다.
 assert.equal(on('exam','2026-12-03')[0].type,'개강');assert.equal(on('admit','2026-12-05')[0].type,'상담');assert.equal(on('talk','2026-10-21')[0].type,'설명회');
 // 접수 기간과 같은 범위의 '접수' 일정은 한 줄로 합친다(달을 넘어가는 5일).
 const admit=list.filter(e=>e.id==='admit'&&e.date<='2026-12-02');assert.deepEqual(admit.map(e=>e.date.slice(5)+e.part),['11-28start','11-29middle','11-30middle','12-01middle','12-02end']);assert.ok(admit.every(e=>e.registration));
 assert.deepEqual(plain(N.entries([{...items[0],dateStatus:'unconfirmed'}])),[]);assert.deepEqual(plain(N.entries()),[]);
 const map=N.groupByDate(N.entries(items));assert.equal(map['2026-11-14'].length,2);assert.equal(map['2026-11-13'],undefined);
 // 같은 날이면 하루짜리·시작·마감이 기간 중간 날보다 앞에 온다.
 const mixed=plain(N.groupByDate([{date:'2026-11-05',part:'middle',id:'a'},{date:'2026-11-05',part:'single',id:'b'},{date:'2026-11-05',part:'end',id:'c'}])['2026-11-05']).map(e=>e.id);assert.deepEqual(mixed,['b','c','a']);
}));
test('달력: 필터는 그대로 적용하고 날짜 미확인 공지는 따로 남긴다',()=>withCalFeed(()=>{
 const cal=N.calendar('elementary','전체',{},'2026-11-11');
 assert.equal(cal.month,'2026-11');assert.equal(cal.selected,'2026-11-11');assert.equal(cal.weeks.length,5);
 // 접수 3일은 한 건, 시험 2건, 달을 넘는 접수 한 건, xss 시험 한 건
 assert.equal(cal.monthCount,5);
 assert.deepEqual([...cal.undated].map(x=>x.id).sort(),['bare','guess']);
 const placed=new Set(Object.values(cal.byDate).flat().map(e=>e.id));assert.equal(placed.size+cal.undated.length,cal.items.length);
 // 기간 필터가 '최근'이어도 달력에서는 지난 일정을 숨기지 않는다.
 assert.ok(N.calendar('elementary','전체',{when:'recent'},'2026-11-11').byDate['2026-10-21']);
 const oct=N.calendar('elementary','전체',{month:'2026-10'},'2026-11-11');assert.equal(oct.selected,'2026-10-21');assert.equal(oct.monthCount,1);
 assert.equal(N.calendar('elementary','전체',{month:'2027-03'},'2026-11-11').selected,'2027-03-01');
 assert.equal(N.calendar('elementary','전체',{month:'2026-11',day:'2026-11-14'},'2026-11-11').selected,'2026-11-14');
 assert.equal(N.calendar('elementary','전체',{month:'2026-12',day:'2026-11-14'},'2026-11-11').selected,'2026-12-01');
 assert.equal(N.calendar('elementary','전체',{month:'"><script>',day:'x'},'2026-11-11').month,'2026-11');
 const math=N.calendar('elementary','수학학원',{},'2026-11-11');assert.ok(Object.values(math.byDate).flat().every(e=>e.academy==='aa'));assert.deepEqual([...math.undated].map(x=>x.id),['bare']);
 const one=N.calendar('elementary','전체',{academy:'bb',kind:'seminar'},'2026-11-11');assert.deepEqual(Object.keys(one.byDate),['2026-10-21']);assert.deepEqual([...one.undated].map(x=>x.id),['guess']);
 const mid=N.calendar('middle','전체',{},'2026-11-11');assert.ok(Object.values(mid.byDate).flat().every(e=>e.id==='exam'));assert.equal(mid.undated.length,0);
 assert.equal(N.dayLabel('2026-11-14',2,'2026-11-11'),'11월 14일 토요일, 일정 2건');assert.equal(N.dayLabel('2026-11-11',0,'2026-11-11'),'11월 11일 수요일, 오늘, 일정 없음');
}));
test('달력 화면: 목록·달력 전환, 격자 이름, 고른 날 목록과 상세 연결',()=>withCalFeed(()=>{
 const list=N.render('elementary','전체',{});
 assert.match(list,/data-notice-view="list" aria-pressed="true"/);assert.match(list,/data-notice-view="calendar" aria-pressed="false"/);assert.ok(!list.includes('role="grid"'));assert.match(list,/data-notice-filter="when"/);
 const html=N.render('elementary','전체',{view:'calendar',month:'2026-11',day:'2026-11-14'}),cal=html.slice(html.indexOf('<div class="ast-cal">'),html.indexOf('<details class="ast-notice-sources">'));
 assert.match(html,/data-notice-view="calendar" aria-pressed="true"/);assert.ok(!html.includes('data-notice-filter="when"'));assert.match(html,/data-notice-filter="academy"/);assert.match(html,/data-notice-filter="kind"/);
 assert.match(cal,/role="grid" aria-labelledby="astCalTitle" data-cal-month="2026-11"/);assert.match(cal,/<h3 id="astCalTitle">2026년 11월<\/h3>/);
 assert.equal(cal.match(/role="columnheader"/g).length,7);assert.equal(cal.match(/data-cal-day="/g).length,30);assert.equal(cal.match(/tabindex="0"/g).length,1);
 assert.match(cal,/role="gridcell" class="ast-cal-cell" aria-selected="true"><button type="button" class="ast-cal-day[^"]*" data-cal-day="2026-11-14" tabindex="0"/);
 assert.match(cal,/aria-label="11월 14일 토요일(, 오늘)?, 일정 2건"/);assert.match(cal,/aria-label="11월 13일 금요일(, 오늘)?, 일정 없음"/);
 // 칸에는 학원 이름과 종류를 글자로 쓴다.
 assert.match(cal,/<b>가나수학<\/b><span>시험<\/span>/);assert.match(cal,/<b>가나수학<\/b><span>접수 시작<\/span>/);assert.match(cal,/<b>가나수학<\/b><span>접수 마감<\/span>/);
 // 고른 날 목록의 항목은 기존 상세 보기를 여는 단추다.
 assert.match(cal,/11월 14일 토요일[^<]* <span>일정 2건<\/span>/);assert.match(cal,/class="ast-post ast-notice-post ast-cal-row" data-ast-post="notice-exam"[^]*?<strong>초등 시험<\/strong>/);
 assert.match(cal,/날짜는 원문에서 확인할 공지 2건/);assert.match(cal,/data-ast-post="notice-guess"/);assert.match(cal,/data-ast-post="notice-bare"/);assert.match(cal,/게시일은 일정으로 보지 않습니다/);
 // 미확인 공지의 적힌 날짜(11/20)와 게시일은 칸에 놓이지 않는다.
 assert.match(cal,/aria-label="11월 20일 금요일(, 오늘)?, 일정 없음"/);assert.match(cal,/aria-label="11월 9일 월요일(, 오늘)?, 일정 없음"/);assert.match(cal,/aria-label="11월 10일 화요일(, 오늘)?, 일정 없음"/);
 // 새로 만든 달력 영역에는 화살표 장식을 넣지 않는다.
 assert.ok(!cal.includes('↗'));assert.ok(!cal.includes('<img'));assert.ok(!cal.includes('<script'));
 const panel=N.dayPanel('elementary','전체',{view:'calendar',month:'2026-11',day:'2026-11-18'});assert.match(panel,/&lt;img src=x onerror=alert\(1\)&gt;/);assert.match(panel,/&lt;b&gt;제목&lt;\/b&gt;/);assert.ok(!panel.includes('<img')&&!panel.includes('<script'));
 assert.match(N.dayPanel('elementary','전체',{month:'2026-11',day:'2026-11-13'}),/이 날에는 날짜가 확인된 일정이 없습니다/);
 const dec=N.render('elementary','전체',{view:'calendar',month:'2026-12'});assert.match(dec,/aria-label="이전 달, 2026년 11월"/);assert.match(dec,/aria-label="다음 달, 2027년 1월"/);assert.match(dec,/<b>가나수학<\/b><span>접수 마감<\/span>/);
 // 게시판 창은 보기 상태를 그대로 넘긴다.
 const board=w.PlannerAcademyStories.render('elementary','b13','전체','notices',{view:'calendar',month:'2026-11'});assert.match(board,/role="grid"/);assert.match(board,/data-ast-mode="notices" aria-pressed="true"/);
 assert.ok(!w.PlannerAcademyStories.render('elementary','b13','전체','notices').includes('role="grid"'));
}));
test('달력: 실제 수집 자료에서도 확인된 일정만 놓이고 공지가 사라지지 않는다',()=>{
 for(const stage of ['preschool','elementary','middle','high']){
  const cal=N.calendar(stage,'전체',{},'2026-11-11'),placed=Object.values(cal.byDate).flat(),ids=new Set(placed.map(e=>e.id));
  assert.ok(placed.every(e=>cal.items.find(x=>x.id===e.id).dateStatus==='confirmed'));
  assert.equal(ids.size+cal.undated.length,cal.items.length);assert.ok(cal.undated.every(x=>!ids.has(x.id)));
  assert.ok(cal.items.filter(x=>x.dateStatus!=='confirmed').every(x=>cal.undated.includes(x)));
  assert.ok(Object.entries(cal.byDate).every(([d,list])=>/^20\d\d-\d\d-\d\d$/.test(d)&&list.every(e=>e.date===d&&e.start<=d&&d<=e.end)));
 }
 const source=read('planner-academy-stories.css');assert.doesNotMatch(source,/transition:\s*all/);assert.match(read('planner-academy-stories.js'),/moveDay\(/);
});
