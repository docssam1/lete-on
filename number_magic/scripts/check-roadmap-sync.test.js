'use strict';
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm');
const {check,ROOT}=require('./check-roadmap-sync.js');
function run(){
  const cache=new Map();
  const read=f=>{if(!cache.has(f))cache.set(f,fs.readFileSync(f,'utf8'));return cache.get(f);};
  assert.equal(check({readFile:read}).errors.length,0,'baseline including bridges/games/links/revisits');
  let n=1;
  function mutant(name,file,transform,code){
    const full=path.join(ROOT,file),before=read(full),after=transform(before);
    assert.notEqual(before,after,'mutation did not apply: '+name);
    const result=check({readFile:f=>f===full?after:read(f)});
    assert(result.errors.some(e=>e.code===code),name+': expected '+code+'; got '+JSON.stringify(result.errors));
    console.log('PASS '+(++n)+' '+name);
  }
  const append=js=>s=>s+'\n'+js;
  for(const page of ['index.html','drill.html','ws.html']){
    mutant(page+' middle concepts removed',page,s=>s.replace('<script src="data/middle-concepts.js"></script>',''),'CONCEPT_NOT_LOADED');
  }
  mutant('index unit tag removed','index.html',s=>s.replace('<script src="data/units/M-83.js"></script>',''),'UNIT_NOT_LOADED');
  mutant('ws mid9 tag removed','ws.html',s=>s.replace('<script src="engine/threads/mid9.js"></script>',''),'GENERATOR_NOT_LOADED');
  mutant('drill mid10 tag removed','drill.html',s=>s.replace('<script src="engine/threads/mid10.js"></script>',''),'GENERATOR_NOT_LOADED');
  mutant('menu script removed','drill.html',s=>s.replace('<script src="data/drill-topics.js"></script>',''),'PAGE_DATA');
  mutant('menu script deferred','drill.html',s=>s.replace('<script src="data/drill-topics.js">','<script defer src="data/drill-topics.js">'),'SCRIPT_ORDER');
  mutant('menu binding removed','drill.html',s=>s.replace('var TOPICS = window.NM_DRILL_TOPICS;','var TOPICS = [];'),'MENU_BINDING');
  mutant('script duplicated','index.html',s=>s.replace('<script src="data/units/M-83.js"></script>','<script src="data/units/M-83.js"></script>'.repeat(2)),'SCRIPT_DUPLICATE');
  mutant('story unit removed','data/roadmap.js',s=>s.replace("'A-36',",''),'UNIT_NOT_IN_ROADMAP');
  mutant('story unit typo','data/roadmap.js',s=>s.replace("'A-36'","'A-360'"),'ROAD_UNIT_UNKNOWN');
  mutant('story duplicate','data/roadmap.js',s=>s.replace("'A-36'","'A-36','A-36'"),'ROAD_UNIT_DUPLICATE');
  mutant('empty chapter','data/roadmap.js',append("window.NM_ROADMAP.chapters[0].units=[];"),'CHAPTER_KIND');
  mutant('unknown game','data/roadmap.js',s=>s.replace("game:'make10'","game:'missing_game'"),'GAME_MISSING');
  mutant('broken link','data/roadmap.js',s=>s.replace('labs/number-line-hole.html','labs/missing-lab.html'),'LINK_MISSING');
  mutant('chapter not in stages','data/stages.js',s=>s.replace("'N0',",''),'CHAPTER_STAGE');
  mutant('chapter in two stages','data/stages.js',s=>s.replace("chapters:['R0'","chapters:['N0','R0'"),'CHAPTER_STAGE');
  mutant('unknown stage chapter','data/stages.js',s=>s.replace("'N0'","'N404'"),'STAGE_CHAPTER_UNKNOWN');
  mutant('course outside stages','data/stages.js',s=>s.replace('courses:{from:0,to:0}','courses:{from:100,to:100}'),'COURSE_STAGE');
  mutant('unknown course magic','data/courses.js',append("window.NM_COURSES.C1.sessions[0].magic=['missing-unit'];"),'MAGIC_UNKNOWN');
  mutant('unit missing from courses','data/courses.js',append("Object.values(window.NM_COURSES).forEach(c=>c.sessions.forEach(s=>{if(s.magic)s.magic=s.magic.filter(id=>id!=='A-36');}));"),'UNIT_NOT_IN_COURSES');
  mutant('invalid drill level','data/courses.js',append("window.NM_COURSES.C1.sessions[0].drills=[{t:'AD1',lv:999,n:10}];"),'LEVEL_UNKNOWN');
  mutant('generator missing','data/threads.js',append("window.NM_THREADS.MD83.gen='missing-generator';"),'GENERATOR_NOT_LOADED');
  mutant('invalid SPEC pinned level before clamp','data/courses.js',s=>s.replace('ML7@5','ML7@999'),'LEVEL_UNKNOWN');
  mutant('unknown SPEC creative before filtering','data/courses.js',s=>s.replace("creative:['ML14@1'","creative:['NO_SUCH_THREAD'"),'SPEC_REFERENCE');
  mutant('unit generator missing','data/units/A-35.js',s=>s.replace(/generator:'romanNumerals'/g,"generator:'NO_SUCH_GEN'"),'UNIT_GENERATOR');
  mutant('menu item missing','data/drill-topics.js',append('window.NM_DRILL_TOPICS[0].subs.shift();'),'MENU_MISSING');
  mutant('menu duplicate','data/drill-topics.js',append('window.NM_DRILL_TOPICS[0].subs.push(window.NM_DRILL_TOPICS[0].subs[0]);'),'MENU_DUPLICATE');
  mutant('menu invalid level','data/drill-topics.js',append('window.NM_DRILL_TOPICS[0].subs[0].level=999;'),'LEVEL_UNKNOWN');
  mutant('unknown new thread requires category','data/threads.js',append("window.NM_THREADS.NEW=Object.assign({},window.NM_THREADS.AD1);"),'SCRIPT_EVAL');
  const w={};w.window=w;vm.createContext(w);
  vm.runInContext(read(path.join(ROOT,'data/threads.js')),w);
  vm.runInContext(read(path.join(ROOT,'data/drill-topics.js')),w);
  const before=JSON.stringify(w.NM_DRILL_TOPICS);
  const added={id:999,label:{ko:'새 레벨',en:'New level',zh:'新等级'},params:{}};
  w.NM_THREADS.MD83.levels.push(added);
  const fresh=w.NM_BUILD_DRILL_TOPICS(w.NM_THREADS);
  assert.equal(fresh.flatMap(c=>c.subs).filter(s=>s.thread==='MD83'&&s.level===999).length,1);
  assert.equal(JSON.stringify(w.NM_DRILL_TOPICS),before,'build must not mutate previous menu');
  assert.equal(JSON.stringify(fresh),JSON.stringify(w.NM_BUILD_DRILL_TOPICS(w.NM_THREADS)),'build must be repeatable');
  console.log('PASS '+(++n)+' new level automatically appears, build is repeatable and non-mutating');
  console.log('통과 — 연결 검사 self-test '+n+'건 (원본 수정 없음)');
}
module.exports={run};
if(require.main===module)run();
