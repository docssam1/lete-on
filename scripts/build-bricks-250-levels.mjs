#!/usr/bin/env node

/*
 * Build Bricks Reading 250 Levels 2 and 3 from private extracted source.
 *
 * Licensed originals and publisher vocabulary details remain in the ignored
 * private directory.  Only newly authored practice passages/questions are
 * emitted into reading-world/data.  Gemini Pro authors and repairs; a separate
 * Flash model performs an independent answer-support audit.
 *
 * Usage:
 *   GEMINI_API_KEY=... node scripts/build-bricks-250-levels.mjs \
 *     --source reading-world/private/bricks-250-levels-2-3.raw.json \
 *     --private-out reading-world/private/bricks-250-levels-2-3.normalized.json
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const DATA = path.join(ROOT, 'reading-world', 'data');
const STRATEGIES = [
  'Finding Main Idea', 'Recalling Facts and Details', 'Understanding Sequence',
  'Recognizing Cause and Effect', 'Comparing and Contrasting', 'Making Predictions',
  'Finding Word Meaning in Context', 'Drawing Conclusions and Making Inferences',
  'Distinguishing Between Fact and Opinion', "Understanding Author's Purpose",
  'Interpreting Figurative Language', 'Distinguishing Between Real and Make-believe',
];
const PRO_MODEL = process.env.BRICKS_PRO_MODEL || 'gemini-3.1-pro-preview';
const REVIEW_MODEL = process.env.BRICKS_REVIEW_MODEL || 'gemini-3.5-flash';

function args() {
  const out = {};
  for (let i = 2; i < process.argv.length; i += 2) out[process.argv[i].replace(/^--/, '')] = process.argv[i + 1];
  if (!out.source || !out['private-out']) throw new Error('Required: --source FILE --private-out FILE');
  return out;
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function generate(model, prompt, temperature = 0.2, attempts = 4) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY is required');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
  let last;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(360000),
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature,
            responseMimeType: 'application/json',
            maxOutputTokens: 65536,
          },
        }),
      });
      if (!response.ok) throw new Error(`${response.status} ${await response.text()}`);
      const body = await response.json();
      const text = (body.candidates?.[0]?.content?.parts || []).map(part => part.text || '').join('');
      if (!text) throw new Error(`Empty ${model} response`);
      return JSON.parse(text);
    } catch (error) {
      last = error;
      if (attempt < attempts) await sleep(1500 * attempt);
    }
  }
  throw last;
}

function countWords(paragraphs) {
  return (paragraphs || []).join(' ').trim().split(/\s+/).filter(Boolean).length;
}

function norm(value) {
  return String(value || '').toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9']+/g, ' ').trim();
}

function answerDistribution(questions) {
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  (questions || []).forEach(question => { if (counts[question?.[3]] != null) counts[question[3]]++; });
  return `${counts.A}/${counts.B}/${counts.C}/${counts.D}`;
}

function overlap(original, created, size = 9) {
  const source = norm((original || []).join(' ')).split(' ');
  const made = norm((created || []).join(' ')).split(' ');
  const sourceRuns = new Set();
  for (let i = 0; i <= source.length - size; i++) sourceRuns.add(source.slice(i, i + size).join(' '));
  for (let i = 0; i <= made.length - size; i++) {
    const run = made.slice(i, i + size).join(' ');
    if (sourceRuns.has(run)) return run;
  }
  return '';
}

function validateSet(unit, label, set) {
  const issues = [];
  const originalCount = countWords(unit.original.paragraphs);
  const passage = Array.isArray(set?.passage) ? set.passage : [];
  const total = countWords(passage);
  if (!set?.title || !passage.length) issues.push(`${label}: missing title or passage`);
  if (total < Math.floor(originalCount * 0.85) || total > Math.ceil(originalCount * 1.25)) {
    issues.push(`${label}: ${total} words is outside 85-125% of ${originalCount}`);
  }
  if (label === 'newPassage') {
    const text = ` ${norm(passage.join(' '))} `;
    const missing = unit.words.map(word => word.term).filter(term => !text.includes(` ${norm(term)} `));
    if (missing.length) issues.push(`${label}: missing focus words ${missing.join(', ')}`);
  }
  if (!Array.isArray(set?.questions) || set.questions.length !== 12) {
    issues.push(`${label}: expected 12 questions`);
    return issues;
  }
  set.questions.forEach((question, index) => {
    if (!Array.isArray(question) || question.length !== 5) issues.push(`${label} Q${index + 1}: wrong shape`);
    if (question?.[0] !== STRATEGIES[index]) issues.push(`${label} Q${index + 1}: wrong strategy`);
    if (!Array.isArray(question?.[2]) || question[2].length !== 4 || new Set(question[2].map(norm)).size !== 4) {
      issues.push(`${label} Q${index + 1}: choices must be four distinct strings`);
    }
    if (!'ABCD'.includes(question?.[3])) issues.push(`${label} Q${index + 1}: invalid answer`);
    if (String(question?.[4] || '').length < 20) issues.push(`${label} Q${index + 1}: explanation too short`);
  });
  if (answerDistribution(set.questions) !== '3/3/3/3') issues.push(`${label}: answer distribution ${answerDistribution(set.questions)}`);
  const copied = overlap(unit.original.paragraphs, passage);
  if (copied) issues.push(`${label}: copied 9-word source run '${copied}'`);
  return issues;
}

function validateUnit(unit) {
  const issues = [];
  if (!unit.title || !Array.isArray(unit.words) || unit.words.length !== 10) issues.push('metadata: expected title and ten focus words');
  issues.push(...validateSet(unit, 'extraLearning', unit.extraLearning));
  issues.push(...validateSet(unit, 'newPassage', unit.newPassage));
  return issues;
}

function sourcePrompt(level, source, expectedUnits) {
  const unitList = expectedUnits.join(', ');
  const exactRule = level === 3
    ? `The dictation script is the canonical English original. Extract only units ${unitList} by their unit titles and preserve wording and paragraph order exactly.`
    : 'The English original is distributed in exact fragments across each unit-test PDF. Reassemble only those fragments, using the Korean teacher-guide translation to recover paragraph order. Never translate or invent a missing sentence; set needsReview=true if evidence is incomplete.';
  return `You are reconstructing licensed classroom data for private storage. Return JSON only.

For Bricks Reading 250 Level ${level}, return {"units":[...]} with exactly ${expectedUnits.length} units numbered ${unitList}. Do not return any other unit. ${exactRule}

For each unit return:
{"unit":1,"title":"...","words":[{"term":"...","definition":"...","ko":"..."}],"original":{"paragraphs":["..."],"wordCount":250,"needsReview":false,"reviewNote":""}}

Vocabulary rules:
- The word-list has two pages per unit. Extract ONLY the ten bullet entries on the FIRST page of each unit (the textbook Word Box), not the ten supplemental entries on page two.
- Preserve taught headword/phrase form. Repair obvious PDF encoding corruption in Korean using context, but do not guess when uncertain.
- definition is the concise English definition printed for that entry; ko is the Korean gloss.

Original rules:
- Preserve English wording, spelling, quotes, names, and paragraph order. Do not modernize or paraphrase.
- Exclude questions, answer choices, directions, captions, Information boxes, Word Box text, and teacher commentary.
- Aim for the actual series length (roughly 220-300 words), but source evidence outranks the target.

SOURCE JSON:
${JSON.stringify(source)}`;
}

function teacherGuideForUnits(pages, expectedUnits) {
  const starts = new Map();
  (pages || []).forEach((page, index) => {
    const match = String(page).match(/\bUnit\s+(\d+)\b/i);
    if (match && /Talk about the/i.test(page) && !starts.has(Number(match[1]))) {
      starts.set(Number(match[1]), index);
    }
  });

  const selected = [];
  for (const unit of expectedUnits) {
    const start = starts.get(unit);
    if (start == null) continue;
    const end = starts.get(unit + 1) ?? pages.length;
    selected.push(...pages.slice(start, end));
  }
  return selected;
}

function sourceForUnits(level, source, expectedUnits) {
  const first = expectedUnits[0];
  const last = expectedUnits.at(-1);
  const batch = {
    level,
    word_list_pages: (source.word_list_pages || []).slice((first - 1) * 2, last * 2),
    unit_tests: Object.fromEntries(expectedUnits.map(unit => [String(unit), source.unit_tests?.[String(unit)]])),
  };
  if (level === 2) batch.teacher_guide_pages = teacherGuideForUnits(source.teacher_guide_pages, expectedUnits);
  // The Level 3 script is only about 30 KB; retaining it prevents a fuzzy OCR title
  // mismatch from dropping a passage while the requested unit numbers limit output.
  if (level === 3) batch.script_text = source.script_text;
  return batch;
}

function authorPrompt(level, units) {
  const safe = units.map(unit => ({
    unit: unit.unit,
    title: unit.title,
    words: unit.words,
    original: unit.original,
  }));
  return `Create original reading practice for Bricks Reading 250 Level ${level}. Return JSON only as {"units":[...]}. Do not reproduce the licensed source.

For each supplied unit return:
{"unit":1,"theme":"one precise sentence","extraLearning":{"title":"...","passage":["paragraphs"],"questions":[...]},"newPassage":{"title":"...","passage":["paragraphs"],"questions":[...]}}

Rules for BOTH sets:
- American English suitable for grades 4-6. Level ${level} should feel like a natural step in a 240-270 word reading series.
- Length must be 85-125% of that unit's original word count. Use 4-6 coherent paragraphs and a genre/form appropriate to the source, but entirely new people, details, wording, and examples.
- No sequence of 9 consecutive words may match the original.
- Exactly 12 questions in this exact order: ${JSON.stringify(STRATEGIES)}.
- Each question is [strategy, stem, [four distinct plausible choices], correctLetter, explanation].
- Correct letters must be exactly 3 A, 3 B, 3 C, 3 D in each set. Vary answer-key order between units and sets.
- Every answer must be uniquely supported by the new passage. Explanations identify the evidence or reasoning, not merely repeat the answer.
- Distractors must be specific and similar in length to the answer. Do not make the correct answer consistently longest.
- Fact/opinion choices may quote only the newly authored passage.
- Figurative-language questions must test an actual phrase in the new passage.

newPassage only:
- Include all ten focus terms in their taught form, naturally and case-insensitively.

PRIVATE UNIT CONTEXT:
${JSON.stringify(safe)}`;
}

function reviewPrompt(level, units) {
  const compact = units.map(unit => ({
    unit: unit.unit,
    extraLearning: unit.extraLearning,
    newPassage: unit.newPassage,
  }));
  return `Independently audit these grade-school reading sets for Bricks Reading 250 Level ${level}. Return JSON only as {"units":[{"unit":1,"errors":["..."]}]}. Report only objective errors that require repair: wrong/unsupported answer, two plausible answers, sequence mismatch, malformed fact-opinion or figurative-language item, incorrect vocabulary use, or child-inappropriate content. Do not report stylistic preferences. If clean, errors is [].

DATA:
${JSON.stringify(compact)}`;
}

async function repairUnit(level, unit, issues) {
  const prompt = `Repair this generated Bricks Reading 250 Level ${level} unit. Return the complete unit JSON only. Keep good material, but fix every listed issue. Preserve the exact 12-strategy order and 3/3/3/3 answer distribution in each set. Do not copy 9 consecutive words from the licensed original.\n\nISSUES:\n${issues.map(issue => `- ${issue}`).join('\n')}\n\nUNIT:\n${JSON.stringify(unit)}`;
  const result = await generate(PRO_MODEL, prompt, 0.25);
  return result?.unit && typeof result.unit === 'object' ? result.unit : result;
}

async function normalizeLevel(level, source, cachedUnits = [], onProgress = () => {}) {
  const units = [...cachedUnits].sort((a, b) => Number(a.unit) - Number(b.unit));
  for (let start = 1; start <= 20; start += 2) {
    const expectedUnits = Array.from({ length: Math.min(2, 21 - start) }, (_, index) => start + index);
    if (expectedUnits.every(unit => units.some(item => Number(item.unit) === unit))) {
      console.log(`Level ${level}: using cached private metadata/originals ${expectedUnits[0]}-${expectedUnits.at(-1)}`);
      continue;
    }
    console.log(`Level ${level}: extracting private metadata/originals ${expectedUnits[0]}-${expectedUnits.at(-1)} with ${PRO_MODEL}`);
    const sourceBatch = sourceForUnits(level, source, expectedUnits);
    const result = await generate(PRO_MODEL, sourcePrompt(level, sourceBatch, expectedUnits), 0.05);
    const actual = Array.isArray(result) ? result : (Array.isArray(result.units) ? result.units : []);
    const actualUnits = actual.map(unit => Number(unit.unit)).sort((a, b) => a - b);
    if (actual.length !== expectedUnits.length || actualUnits.some((unit, index) => unit !== expectedUnits[index])) {
      throw new Error(`Level ${level}: source extraction ${expectedUnits[0]}-${expectedUnits.at(-1)} returned [${actualUnits.join(', ')}]`);
    }
    units.push(...actual);
    units.sort((a, b) => Number(a.unit) - Number(b.unit));
    onProgress(units);
  }
  return units.sort((a, b) => Number(a.unit) - Number(b.unit));
}

async function authorLevel(level, units, cachedUnits = [], onProgress = () => {}) {
  const complete = cachedUnits.map(cached => {
    const metadata = units.find(unit => Number(unit.unit) === Number(cached.unit));
    return metadata ? { ...cached, title: metadata.title, words: metadata.words, original: metadata.original } : cached;
  }).sort((a, b) => Number(a.unit) - Number(b.unit));
  for (let start = 0; start < units.length; start += 4) {
    const batch = units.slice(start, start + 4);
    const cachedBatch = batch.map(meta => complete.find(item => Number(item.unit) === Number(meta.unit)));
    if (cachedBatch.every(Boolean) && cachedBatch.every(unit => validateUnit(unit).length === 0)) {
      console.log(`Level ${level}: using cached authored units ${start + 1}-${start + batch.length}`);
      continue;
    }
    const batchIds = new Set(batch.map(meta => Number(meta.unit)));
    for (let index = complete.length - 1; index >= 0; index -= 1) {
      if (batchIds.has(Number(complete[index].unit))) complete.splice(index, 1);
    }
    console.log(`Level ${level}: authoring units ${start + 1}-${start + batch.length}`);
    const generated = await generate(PRO_MODEL, authorPrompt(level, batch), 0.75);
    const authored = generated.units || [];
    for (const meta of batch) {
      let unit = { ...meta, ...(authored.find(item => Number(item.unit) === Number(meta.unit)) || {}) };
      for (let attempt = 0; attempt < 3; attempt++) {
        const issues = validateUnit(unit);
        if (!issues.length) break;
        console.log(`  repairing L${level} U${meta.unit}: ${issues.join('; ')}`);
        unit = { ...meta, ...(await repairUnit(level, unit, issues)) };
      }
      const remaining = validateUnit(unit);
      if (remaining.length) throw new Error(`Level ${level} Unit ${meta.unit} failed local validation: ${remaining.join('; ')}`);
      complete.push(unit);
      complete.sort((a, b) => Number(a.unit) - Number(b.unit));
    }

    console.log(`Level ${level}: reviewing units ${start + 1}-${start + batch.length} with ${REVIEW_MODEL}`);
    const reviewedBatch = batch.map(meta => complete.find(item => Number(item.unit) === Number(meta.unit)));
    const review = await generate(REVIEW_MODEL, reviewPrompt(level, reviewedBatch), 0.05);
    for (const report of review.units || []) {
      if (!report.errors?.length) continue;
      const index = complete.findIndex(item => Number(item.unit) === Number(report.unit));
      if (index < 0) continue;
      console.log(`  reviewer repair L${level} U${report.unit}: ${report.errors.join('; ')}`);
      complete[index] = { ...units[index], ...(await repairUnit(level, complete[index], report.errors)) };
      const remaining = validateUnit(complete[index]);
      if (remaining.length) throw new Error(`Level ${level} Unit ${report.unit} failed after review repair: ${remaining.join('; ')}`);
    }
    onProgress(complete);
  }
  return complete.sort((a, b) => a.unit - b.unit);
}

function lessonId(level, unit) { return `brl${level}-${String(unit).padStart(2, '0')}`; }

function publicLesson(level, unit) {
  const id = lessonId(level, unit.unit);
  return {
    bookId: `bricks-reading-250-${level}`,
    levelId: String(level),
    lessonId: id,
    chapter: null,
    page: null,
    title: unit.title,
    theme: unit.theme,
    image: '',
    rewardPoints: { lessonComplete: 40 },
    words: unit.words.map(word => [word.term, word.definition, word.ko, word.term]),
    extraLearning: unit.extraLearning,
    newPassage: unit.newPassage,
  };
}

function writeLessons(level, units) {
  const assignments = units.map(unit => {
    const id = lessonId(level, unit.unit);
    return `window.LESSONS[${JSON.stringify(id)}] = ${JSON.stringify(publicLesson(level, unit), null, 2)};`;
  });
  const body = `// Bricks Reading 250 Level ${level}. Licensed originals stay in Supabase.\nwindow.LESSONS = window.LESSONS || {};\n${assignments.join('\n')}\n`;
  fs.writeFileSync(path.join(DATA, `bricks-250-level-${level}.js`), body, 'utf8');
}

async function main() {
  const options = args();
  const raw = JSON.parse(fs.readFileSync(path.resolve(options.source), 'utf8'));
  const privatePath = path.resolve(options['private-out']);
  const cachePath = privatePath.replace(/\.json$/i, '.build-cache.json');
  const cache = fs.existsSync(cachePath)
    ? JSON.parse(fs.readFileSync(cachePath, 'utf8'))
    : { source: {}, authored: {} };
  const normalized = { generatedAt: new Date().toISOString(), models: { author: PRO_MODEL, reviewer: REVIEW_MODEL }, levels: {} };

  const saveCache = () => {
    fs.mkdirSync(path.dirname(cachePath), { recursive: true });
    fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf8');
  };

  for (const level of [2, 3]) {
    const key = String(level);
    const metadata = await normalizeLevel(level, raw.levels[key], cache.source[key], units => {
      cache.source[key] = [...units];
      saveCache();
    });
    cache.source[key] = metadata;
    saveCache();
    const authored = await authorLevel(level, metadata, cache.authored[key], units => {
      cache.authored[key] = [...units];
      saveCache();
    });
    cache.authored[key] = authored;
    saveCache();
    normalized.levels[key] = authored;
    writeLessons(level, authored);
    fs.mkdirSync(path.dirname(privatePath), { recursive: true });
    fs.writeFileSync(privatePath, JSON.stringify(normalized, null, 2), 'utf8');
  }
  console.log(`Wrote private normalized source: ${privatePath}`);
  console.log('Wrote two public lesson bundles under reading-world/data');
}

main().catch(error => { console.error(error); process.exit(1); });
