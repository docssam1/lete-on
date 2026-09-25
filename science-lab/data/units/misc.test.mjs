import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { bearers, classify, remedyItems } from '../../v2/progress.js';

const units = [
  ['s41-u02', await import('./s41-u02.js'), await import('./s41-u02.similar.js'), await import('./s41-u02.misc.js')],
  ['s42-u01', await import('./s42-u01.js'), await import('./s42-u01.similar.js'), await import('./s42-u01.misc.js')],
];

for (const [unit, base, variants, misc] of units) {
  const pool = [...base.items, ...variants.similar];
  const items = new Map(pool.map((item) => [item.id, item]));
  const codes = new Set(Object.keys(misc.misconceptions));
  test(`${unit}: all mappings are source-valid and do not diagnose correct answers`, () => {
    assert.equal(items.size, pool.length, 'duplicate item IDs');
    for (const [code, concept] of Object.entries(misc.misconceptions)) {
      assert.match(concept.label, /\S/);
      assert.match(concept.fix, /\S/);
      assert.ok(misc.remedy[code]?.step >= 1 && misc.remedy[code].step <= 5, `${code} remedy step`);
    }
    for (const [id, mapping] of Object.entries(misc.distractors)) {
      const item = items.get(id);
      assert.ok(item, `unknown choice item ${id}`);
      assert.ok(['single-choice', 'multi-choice'].includes(item.answerContract.type), id);
      assert.doesNotMatch(item.prompt, /알맞지 않은|옳지 않은|적절하지 않은|잘못/, `negative stem ${id}`);
      const correct = [].concat(item.answerContract.answer ?? item.answerContract.answers);
      for (const [raw, code] of Object.entries(mapping)) {
        const index = Number(raw);
        assert.ok(Number.isInteger(index) && index >= 0 && index < item.choices.length, `${id} index ${raw}`);
        assert.ok(!correct.includes(index), `${id} correct index ${index} mapped`);
        assert.ok(codes.has(code), `${id} unknown code ${code}`);
      }
    }
    for (const [id, mapping] of Object.entries(misc.typed)) {
      const item = items.get(id);
      assert.equal(item?.answerContract.type, 'short-text', id);
      if (mapping.any) assert.ok(codes.has(mapping.any), id);
      for (const [pattern, code] of mapping.pats || []) {
        assert.ok(pattern instanceof RegExp && codes.has(code), id);
        for (const accepted of item.answerContract.accepted) assert.ok(!pattern.test(accepted), `${id} matches accepted answer ${accepted}`);
      }
    }
    for (const [id, mapping] of Object.entries(misc.cloze)) {
      const item = items.get(id);
      assert.equal(item?.answerContract.type, 'cloze', id);
      assert.equal(mapping.options.length, item.answerContract.blanks.length, id);
      for (const [k, options] of mapping.options.entries()) {
        const blank = item.answerContract.blanks[k];
        assert.equal(new Set(options).size, options.length, `${id} duplicate option ${k}`);
        assert.ok(options.includes(blank.answer), `${id} missing answer ${k}`);
        const code = Array.isArray(mapping.wrong) ? mapping.wrong[k] : mapping.wrong;
        assert.ok(codes.has(code), `${id} unknown cloze code ${code}`);
      }
    }
    for (const [id, code] of Object.entries(misc.cells)) {
      assert.equal(items.get(id)?.answerContract.type, 'table-fill', id);
      assert.ok(codes.has(code), id);
    }
    const B = bearers(misc);
    for (const code of codes) {
      assert.ok(B[code]?.size >= 2, `${unit} ${code} needs two distinct confirmation questions`);
      const prescribed = remedyItems(unit, code, misc, pool, 3);
      assert.ok(prescribed.length, `${unit} ${code} has no practice item`);
      assert.ok(prescribed.every((item) => item.answerContract.type !== 'written-explanation'));
    }
  });
}

test('wrong cloze blanks retain their own concept while legacy single-code cloze works', async () => {
  const water = units[0][3], plant = units[1][3];
  assert.deepEqual(classify({ id: 's41-u02-b02' }, water, false, { wrongBlanks: [1] }).m, ['M03']);
  assert.deepEqual(classify({ id: 's42-u01-b02' }, plant, false, { wrongBlanks: [0, 1] }).m, ['M03', 'M04']);
  const legacy = await import('./s41-u03.misc.js');
  assert.deepEqual(classify({ id: 's41-u03-b01' }, legacy, false, { wrongBlanks: [0] }).m, ['M01']);
});

test('negative-stem errors are slips rather than unsupported misconception diagnoses', () => {
  const water = units[0][3], plant = units[1][3];
  assert.deepEqual(classify({ id: 's41-u02-v003' }, water, false, { picked: 0 }), { ok: false, m: [], kind: 'slip' });
  assert.deepEqual(classify({ id: 's42-u01-v007' }, plant, false, { picked: 1 }), { ok: false, m: [], kind: 'slip' });
  assert.deepEqual(classify({ id: 's42-u01-v031' }, plant, false, { picked: [0] }), { ok: false, m: [], kind: 'slip' });
});

test('both units are connected to the lesson route loader', async () => {
  const route = await readFile(new URL('../../v2/v2.js', import.meta.url), 'utf8');
  for (const [unit] of units) assert.ok(route.includes(`misc: await import('../data/units/${unit}.misc.js')`), unit);
});
