'use strict';

/*
 * Writes the two practice sets of a Level D lesson into its data file.
 *
 *   const { patch } = require('./scripts/patch-level-d-lesson.js');
 *   patch('cd6', extra, newer);
 *
 * `extra` and `newer` are each { title, passage: [...], q: [...] }, where every
 * entry of `q` is [stem, [four choices], 'A'|'B'|'C'|'D', explanation]. The
 * strategy name is not supplied: it is injected here from one canonical list, so
 * a lesson cannot drift from the engine's spelling of "Recognising" or
 * "Identifying Author's Purpose". Everything else in the file — id, chapter,
 * page, title, theme, words — is preserved exactly.
 *
 * Supplying a `questions` array at all is what takes the lesson off the scaffold
 * in data/cars-d-engine.js, which otherwise generates twelve questions from a
 * few fields and gives every lesson the same stems and explanations.
 */

const fs = require('fs');
const path = require('path');
const DATA = path.join(__dirname, '..', 'reading-world', 'data');

const STRATEGIES = ['Finding Main Idea', 'Recalling Facts and Details', 'Understanding Sequence',
  'Recognising Cause and Effect', 'Comparing and Contrasting', 'Making Predictions',
  'Finding Word Meaning in Context', 'Drawing Conclusions and Making Inferences',
  'Distinguishing Between Fact and Opinion', "Identifying Author's Purpose",
  'Interpreting Figurative Language', 'Summarising'];

function build(rows) {
  if (!Array.isArray(rows) || rows.length !== 12) {
    throw new Error(`expected 12 questions, got ${rows && rows.length}`);
  }
  return rows.map((r, i) => [STRATEGIES[i], r[0], r[1], r[2], r[3]]);
}

function patch(id, extra, newer) {
  const file = path.join(DATA, id === 'cd1' ? 'cd1.js' : `${id}-data.js`);
  const src = fs.readFileSync(file, 'utf8');
  const mk = part => ({ title: part.title, passage: part.passage, questions: build(part.q) });

  if (id === 'cd1') {                       // direct assignment, Level-B shape
    global.window = {};
    delete require.cache[require.resolve(file)];
    require(file);
    const L = global.window.LESSONS.cd1;
    L.extraLearning = mk(extra);
    L.newPassage = mk(newer);
    const head = src.slice(0, src.indexOf('window.LESSONS["cd1"]'));
    fs.writeFileSync(file, `${head}window.LESSONS["cd1"] = ${JSON.stringify(L, null, 2)};\n`);
  } else {                                  // window.CARS_D_REGISTER([{...}])
    // Anchor on the call, not the first '(': the header comment contains one.
    const open = src.indexOf('CARS_D_REGISTER(') + 'CARS_D_REGISTER'.length;
    const close = src.lastIndexOf(')');
    const arr = JSON.parse(src.slice(open + 1, close));
    arr[0].extra = mk(extra);
    arr[0].new = mk(newer);
    fs.writeFileSync(file,
      `// Lesson ${id} — shared (non-licensed) content only. The licensed original\n` +
      '// passage and questions live in Supabase (lesson_content), never here.\n' +
      '// Both practice sets are written out in full rather than generated from the\n' +
      '// scaffold in cars-d-engine.js.\n' +
      `window.CARS_D_REGISTER(${JSON.stringify(arr, null, 2)});\n`);
  }
  return file;
}

module.exports = { patch, STRATEGIES };
