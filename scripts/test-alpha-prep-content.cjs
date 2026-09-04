#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'reading-world', 'alpha-prep', 'data.js'), 'utf8');
const appSource = fs.readFileSync(path.join(__dirname, '..', 'reading-world', 'alpha-prep', 'app.js'), 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox, { filename: 'data.js' });
const sets = sandbox.window.ALPHA_PREP_SETS;
assert.ok(Array.isArray(sets));
assert.equal(sets.length, 10);

function estimatedSyllables(word) {
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, '').replace(/e$/, '');
  const groups = cleaned.match(/[aeiouy]+/g);
  return Math.max(1, groups ? groups.length : 1);
}

function estimatedGrade(text) {
  const words = text.match(/[A-Za-z']+/g) || [];
  const sentences = text.split(/[.!?]+/).filter((item) => item.trim());
  const syllables = words.reduce((sum, word) => sum + estimatedSyllables(word), 0);
  return 0.39 * (words.length / sentences.length) + 11.8 * (syllables / words.length) - 15.59;
}

const ids = new Set();
const titles = new Set();
let fableCount = 0;
for (const [setIndex, set] of sets.entries()) {
  assert.equal(set.id, `set-${setIndex + 1}`, `unexpected set id at position ${setIndex + 1}`);
  assert.equal(set.label, `Set ${setIndex + 1}`, `unexpected set label at position ${setIndex + 1}`);
  assert.equal(set.passages.length, 2, `${set.id} must have two passages`);
  assert.equal(set.passages[0].genre, 'Nonfiction', `${set.id} must begin with nonfiction`);
  assert.ok(['Fiction', 'Fable'].includes(set.passages[1].genre), `${set.id} must end with fiction or fable`);
  if (set.passages[1].genre === 'Fable') fableCount += 1;
  for (const passage of set.passages) {
    assert.equal(ids.has(passage.id), false, `duplicate passage id: ${passage.id}`);
    ids.add(passage.id);
    assert.equal(titles.has(passage.title), false, `duplicate passage title: ${passage.title}`);
    titles.add(passage.title);
    const fullText = passage.paragraphs.join(' ');
    const words = fullText.trim().split(/\s+/).length;
    assert.ok(words >= 135 && words <= 205, `${passage.id} has ${words} words`);
    const grade = estimatedGrade(fullText);
    assert.ok(grade >= 3 && grade <= 7, `${passage.id} estimated grade ${grade.toFixed(1)}`);
    assert.equal(passage.vocabulary.length, 5, `${passage.id} vocabulary count`);
    assert.equal(passage.questions.length, 4, `${passage.id} question count`);
    assert.equal(passage.questions[0].type, 'summary', `${passage.id} must open with a summary question`);
    assert.equal(passage.questions.some((item) => item.type === 'vocabulary'), true, `${passage.id} vocabulary question`);
    assert.ok(['opinion', 'inference'].includes(passage.questions[2].type), `${passage.id} third question must support the peer-response turn`);
    assert.equal(new Set(passage.vocabulary.map((item) => item[0].toLowerCase())).size, 5, `${passage.id} duplicate vocabulary`);
    for (const [term] of passage.vocabulary) {
      assert.ok(fullText.toLowerCase().includes(term.toLowerCase()), `${passage.id} does not use vocabulary term: ${term}`);
    }
  }
}

assert.equal(fableCount, 4);
assert.equal(ids.size, 20);
assert.equal(titles.size, 20);
for (const id of ids) {
  assert.ok(appSource.includes(`'${id}':`), `missing peer answer for passage: ${id}`);
}
console.log('alpha-prep content: 10 sets, 20 passages, all checks passed');
