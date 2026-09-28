import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { writtenPracticeHtml, WRITING_GUIDES } from './written-practice.js';

test('writing practice starts without a sample, score or prechecked rubric', () => {
  const html = writtenPracticeHtml();
  assert.match(html, /자동 채점 아님/);
  assert.match(html, /서버에 저장하거나 전송하지 않아요/);
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

test('all 39 existing written items retain source-authored samples and criteria', async () => {
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
  assert.equal(count, 39);
});

test('self-check has no grading, network or persistent student-data writer', async () => {
  const code = await readFile(new URL('./written-practice.js', import.meta.url), 'utf8');
  assert.doesNotMatch(code, /\b(?:fetch|record|onDone|XMLHttpRequest|WebSocket)\s*\(|\b(?:localStorage|sessionStorage|indexedDB)\b/);
  const renderer = await readFile(new URL('./v2.js', import.meta.url), 'utf8');
  assert.match(renderer, /ac\.type === 'written-explanation'\) wireWrittenPractice\(card, it\)/);
  assert.match(renderer, /body = print \? \(show \?/);
});
