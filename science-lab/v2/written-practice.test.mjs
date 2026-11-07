import vm from 'node:vm';
import * as sourceContent from './source-content.js';
import * as sourcePresentation from './source-presentation.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { writtenPracticeHtml, WRITING_GUIDES } from './written-practice.js';

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
