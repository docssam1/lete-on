#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'reading-world', 'alpha-prep', 'data.js'), 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox, { filename: 'data.js' });
const sets = sandbox.window.ALPHA_PREP_SETS;
assert.ok(Array.isArray(sets));
assert.equal(sets.length, 6);

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
for (const set of sets) {
  assert.equal(set.passages.length, 2, `${set.id} must have two passages`);
  assert.deepEqual(Array.from(set.passages, (item) => item.genre), ['Nonfiction', 'Fiction']);
  for (const passage of set.passages) {
    assert.equal(ids.has(passage.id), false, `duplicate passage id: ${passage.id}`);
    ids.add(passage.id);
    const fullText = passage.paragraphs.join(' ');
    const words = fullText.trim().split(/\s+/).length;
    assert.ok(words >= 135 && words <= 205, `${passage.id} has ${words} words`);
    const grade = estimatedGrade(fullText);
    assert.ok(grade >= 3 && grade <= 7, `${passage.id} estimated grade ${grade.toFixed(1)}`);
    assert.equal(passage.vocabulary.length, 5, `${passage.id} vocabulary count`);
    assert.equal(passage.questions.length, 4, `${passage.id} question count`);
    assert.equal(passage.questions.some((item) => item.type === 'vocabulary'), true, `${passage.id} vocabulary question`);
    assert.equal(new Set(passage.vocabulary.map((item) => item[0].toLowerCase())).size, 5, `${passage.id} duplicate vocabulary`);
  }
}

assert.equal(ids.size, 12);
console.log('alpha-prep content: 6 sets, 12 passages, all checks passed');
