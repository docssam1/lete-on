#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const privatePath = path.resolve(process.argv[2] || path.join(root, 'reading-world/private/bricks-250-levels-2-3.normalized.json'));
const source = JSON.parse(fs.readFileSync(privatePath, 'utf8'));
const strategies = [
  'Finding Main Idea', 'Recalling Facts and Details', 'Understanding Sequence',
  'Recognizing Cause and Effect', 'Comparing and Contrasting', 'Making Predictions',
  'Finding Word Meaning in Context', 'Drawing Conclusions and Making Inferences',
  'Distinguishing Between Fact and Opinion', "Understanding Author's Purpose",
  'Interpreting Figurative Language', 'Distinguishing Between Real and Make-believe',
];

function norm(value) {
  return String(value || '').toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9']+/g, ' ').trim();
}

function words(value) {
  return (Array.isArray(value) ? value : []).join(' ').trim().split(/\s+/).filter(Boolean).length;
}

function copiedRun(original, created, size = 9) {
  const sourceWords = norm(original.join(' ')).split(' ');
  const madeWords = norm(created.join(' ')).split(' ');
  const runs = new Set();
  for (let index = 0; index <= sourceWords.length - size; index += 1) runs.add(sourceWords.slice(index, index + size).join(' '));
  for (let index = 0; index <= madeWords.length - size; index += 1) {
    const run = madeWords.slice(index, index + size).join(' ');
    if (runs.has(run)) return run;
  }
  return '';
}

const context = vm.createContext({ window: { LESSONS: {} } });
for (const level of [2, 3]) {
  const file = path.join(root, `reading-world/data/bricks-250-level-${level}.js`);
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
}

const errors = [];
for (const level of [2, 3]) {
  const units = source.levels?.[String(level)] || [];
  if (units.length !== 20) errors.push(`Level ${level}: expected 20 private units, found ${units.length}`);
  for (const unit of units) {
    const lessonId = `brl${level}-${String(unit.unit).padStart(2, '0')}`;
    const lesson = context.window.LESSONS[lessonId];
    if (!lesson) {
      errors.push(`${lessonId}: public lesson missing`);
      continue;
    }
    if (unit.original?.needsReview) errors.push(`${lessonId}: original still needs review`);
    if (!Array.isArray(unit.words) || unit.words.length !== 10) errors.push(`${lessonId}: expected 10 private words`);
    if (!Array.isArray(lesson.words) || lesson.words.length !== 10 || lesson.words.some(word => !Array.isArray(word) || word.length !== 4)) {
      errors.push(`${lessonId}: expected ten four-field public words`);
    }
    if ('original' in lesson || 'originalPassage' in lesson) errors.push(`${lessonId}: licensed original leaked into public lesson`);

    const originalCount = words(unit.original?.paragraphs);
    for (const key of ['extraLearning', 'newPassage']) {
      const set = lesson[key];
      const count = words(set?.passage);
      if (count < Math.floor(originalCount * 0.85) || count > Math.ceil(originalCount * 1.25)) {
        errors.push(`${lessonId} ${key}: ${count} words outside 85-125% of ${originalCount}`);
      }
      if (!Array.isArray(set?.questions) || set.questions.length !== 12) {
        errors.push(`${lessonId} ${key}: expected 12 questions`);
        continue;
      }
      const distribution = { A: 0, B: 0, C: 0, D: 0 };
      set.questions.forEach((question, index) => {
        if (question?.[0] !== strategies[index]) errors.push(`${lessonId} ${key} Q${index + 1}: wrong strategy`);
        if (!Array.isArray(question?.[2]) || question[2].length !== 4 || new Set(question[2].map(norm)).size !== 4) {
          errors.push(`${lessonId} ${key} Q${index + 1}: choices invalid`);
        }
        if (distribution[question?.[3]] == null) errors.push(`${lessonId} ${key} Q${index + 1}: invalid answer`);
        else distribution[question[3]] += 1;
      });
      if (Object.values(distribution).some(countValue => countValue !== 3)) {
        errors.push(`${lessonId} ${key}: answer distribution ${JSON.stringify(distribution)}`);
      }
      const copied = copiedRun(unit.original.paragraphs, set.passage);
      if (copied) errors.push(`${lessonId} ${key}: copied source run ${JSON.stringify(copied)}`);
    }

    const newText = ` ${norm(lesson.newPassage?.passage?.join(' '))} `;
    const missing = unit.words.map(word => word.term).filter(term => !newText.includes(` ${norm(term)} `));
    if (missing.length) errors.push(`${lessonId}: new passage missing ${missing.join(', ')}`);
  }
}

const publicIds = Object.keys(context.window.LESSONS).filter(id => /^brl[23]-/.test(id));
if (publicIds.length !== 40) errors.push(`Expected 40 public lessons, found ${publicIds.length}`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Validated 40 Bricks 250 lessons: private originals, public practice, 400 words, 960 questions.');
