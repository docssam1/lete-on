import vm from 'node:vm';
import * as sourceContent from './source-content.js';
import * as sourcePresentation from './source-presentation.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { writtenPracticeHtml, WRITING_GUIDES } from './written-practice.js';
import {judgeItem,judgeText} from './judge.js';

// 2026-09-30 원장: 아이에게 "예시 답과 비슷한가요?"를 맡기지 않는다 → 기기 안 판정(v2/judge.js). 저장·전송은 여전히 하지 않는다.
test('writing practice starts without a sample, score or prechecked rubric', () => {
  const html = writtenPracticeHtml();
  assert.match(html, /서버로 보내지 않아요/);
  assert.match(html, /서버에 저장하거나 전송하지 않아요/);
  assert.match(html, /data-writing-compare>확인하기</);
  assert.equal((html.match(/role="tab"/g) || []).length, 3);
  assert.equal((html.match(/role="tabpanel"/g) || []).length, 3);
  assert.equal((html.match(/data-writing-panel="(?:solution|criteria)" tabindex="0" hidden><\/div>/g) || []).length, 2);
  assert.doesNotMatch(html, /writing-sample|data-writing-criterion|정답입니다/);
});

test('repeated items get unique panel and label IDs', () => {
  const html = writtenPracticeHtml() + writtenPracticeHtml();
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, id] of html.matchAll(/(?:aria-controls|aria-labelledby|aria-describedby|for)="([^"]+)"/g)) assert.ok(ids.includes(id), id);
});

test('three voluntary writing guides keep reasoning, varied ideas and design separate', () => {
  assert.deepEqual(Object.keys(WRITING_GUIDES), ['explain', 'ideas', 'design']);
  for (const guide of Object.values(WRITING_GUIDES)) assert.equal(guide.steps.length, 3);
  assert.match(WRITING_GUIDES.ideas.steps.join(' '), /뜻이 같은 생각은 하나로/);
});

test('all 63 written items retain authored samples and criteria', async () => {
  let count = 0;
  for (const id of ['s41-u01', 's41-u02', 's41-u03', 's42-u01']) {
    const { items } = await import(`../data/units/${id}.js`);
    const { similar } = await import(`../data/units/${id}.similar.js`);
    for (const it of [...items, ...similar].filter((i) => i.answerContract.type === 'written-explanation')) {
      count++;
      assert.ok(it.answerContract.sample?.trim(), it.id);
      assert.ok(it.explanation?.trim(), it.id);
      assert.ok(it.answerContract.rubric.required.length > 0, it.id);
      assert.ok(it.answerContract.rubric.required.every((s) => typeof s === 'string' && s.trim()), it.id);
      assert.ok(it.answerContract.rubric.pass, it.id);
    }
  }
  assert.equal(count, 63);
});

test('local judging has no network or persistent student-data writer, and no child self-check boxes', async () => {
  const code = await readFile(new URL('./written-practice.js', import.meta.url), 'utf8');
  assert.doesNotMatch(code, /\b(?:fetch|record|onDone|XMLHttpRequest|WebSocket)\s*\(|\b(?:localStorage|sessionStorage|indexedDB)\b/);
  assert.doesNotMatch(code, /data-writing-criterion/);
  assert.match(code, /judgeText\(text, key/);
  const renderer = await readFile(new URL('./v2.js', import.meta.url), 'utf8');
  assert.match(renderer, /ac\.type === 'written-explanation'\) wireWrittenPractice\(card, it\)/);
  const render = new vm.Script(renderer.slice(renderer.indexOf('function itemHtml('),renderer.indexOf('let FIG ='))+'\nitemHtml').runInContext(vm.createContext({...sourceContent,...sourcePresentation,CIRC:['①','②','③','④','⑤'],esc:s=>String(s??''),MISC:null,FIG:{},writtenPracticeHtml}));
  const item={id:'written-renderer-fixture',prompt:'까닭을 써요.',sourceRef:{type:'authored'},taxonomy:{track:'교과',level:'기본'},answerContract:{type:'written-explanation',sample:'synthetic sample',rubric:{required:['synthetic criterion']}}};
  const online=render(item),student=render(item,{print:true}),teacher=render(item,{print:true,show:true});
  assert(online.includes('written-practice'));for(const html of [online,student]){assert(!html.includes(item.answerContract.sample));assert(!html.includes(item.answerContract.rubric.required[0]));}
  assert(teacher.includes(item.answerContract.sample));assert(teacher.includes(item.answerContract.rubric.required[0]));
});

test('source writing follows its teacher-review contract while ordinary writing retains its unit key', async () => {
  const code=(await readFile(new URL('./written-practice.js',import.meta.url),'utf8')).replace(/^import[^\n]*\n/gm,'').replace(/^export /gm,'');
  let legacyLoads=0;
  const wire=new vm.Script(code+'\nwireWrittenPractice').runInContext(vm.createContext({
    judgeItem,judgeText,contentUnitOfItem:()=> 'synthetic-unit',
    loadJudge:async()=>{legacyLoads++;return {'synthetic-writing':{need:[]}};},
  }));
  function element(dataset={}){
    const handlers={};return {dataset,value:'',checked:false,hidden:true,innerHTML:'',textContent:'',className:'',
      addEventListener:(name,fn)=>{handlers[name]=fn;},setAttribute(){},focus(){},
      fire:(name,event={})=>handlers[name]?.(event)};
  }
  function card(){
    const input=element(),paper=element(),status=element(),judgment=element(),check=element(),revise=element();
    const tabs=['answer','solution','criteria'].map(name=>element({writingTab:name}));
    const panels=['answer','solution','criteria'].map(name=>element({writingPanel:name}));
    const nodes={'.writing-answer':input,'[data-writing-paper]':paper,'.writing-status':status,
      '.writing-judge':judgment,'[data-writing-compare]':check,'[data-writing-revise]':revise,
      ...Object.fromEntries(panels.map(p=>['[data-writing-panel="'+p.dataset.writingPanel+'"]',p]))};
    const root={querySelector:s=>nodes[s],querySelectorAll:s=>s==='[data-writing-tab]'?tabs:s==='[data-writing-panel]'?panels:[]};
    return {input,paper,judgment,check,panels,querySelector:s=>s==='.written-practice'?root:null};
  }
  const item={id:'synthetic-writing',explanation:'연습용 풀이',answerContract:{type:'written-explanation',
    sample:'연습용 예시',rubric:{required:['이 문제에서 확인할 생각'],pass:'선생님과 확인해요.'}}};
  const ordinary=card();wire(ordinary,item);ordinary.input.value='내 생각';await ordinary.check.fire('click');
  assert.equal(legacyLoads,1);assert.equal(ordinary.judgment.className,'writing-judge ok');
  const source={...item,answerContract:{...item.answerContract,reviewRequired:true,
    sourceResponseContract:{kind:'written-explanation',teacherRequired:true,sample:'연습용 예시',required:['이 문제에서 확인할 생각'],exactStringScoring:false}}};
  for(const value of ['내 생각','연습용 예시','전혀 다른 설명']){
    const current=card();wire(current,source);assert.equal(current.panels[1].innerHTML,'');
    current.input.value=value;await current.check.fire('click');
    assert.equal(current.judgment.className,'writing-judge review');
    assert(!/맞았어요|잘 썼어요/.test(current.judgment.innerHTML));
    assert(current.judgment.innerHTML.includes('선생님과 함께 확인해요'));
    assert(current.panels[1].innerHTML.includes('연습용 예시'));
    assert(current.panels[2].innerHTML.includes('이 문제에서 확인할 생각'));
  }
  assert.equal(legacyLoads,1,'source writing must not load an unrelated legacy unit key');
});
