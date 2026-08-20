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
  const total = countWords(set?.passage);
  if (!set?.title || !Array.isArray(set?.passage)) issues.push(`${label}: missing title or passage`);
  if (total < Math.floor(originalCount * 0.85) || total > Math.ceil(originalCount * 1.25)) {
    issues.push(`${label}: ${total} words is outside 85-125% of ${originalCount}`);
  }
  if (label === 'newPassage') {
    const text = norm(set.passage.join(' '));
    const missing = unit.words.map(word => word.term).filter(term => !text.includes(norm(term)));
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
  const copied = overlap(unit.original.paragraphs, set.passage);
  if (copied) issues.push(`${label}: copied 9-word source run '${copied}'`);
  return issues;
}

function validateUnit(unit) {
  const issues = [];
  if (!unit.title || !Array.isArray(unit.words) || unit.words.length !== 10) issues.push('metadata: expected title and ten focus words');
  const originalCount = countWords(unit.original?.paragraphs);
  if (originalCount < 200 || originalCount > 310) issues.push(`original: suspicious length ${originalCount}`);
  issues.push(...validateSet(unit, 'extraLearning', unit.extraLearning));
  issues.push(...validateSet(unit, 'newPassage', unit.newPassage));
  return issues;
}

function sourcePrompt(level, source) {
  const exactRule = level === 3
    ? 'The dictation script is the canonical English original. Split it by the 20 unit titles and preserve its wording and paragraph order exactly.'
    : 'The English original is distributed in exact fragments across each unit-test PDF. Reassemble only those fragments, using the Korean teacher-guide translation to recover paragraph order. Never translate or invent a missing sentence; set needsReview=true if evidence is incomplete.';
  return `You are reconstructing licensed classroom data for private storage. Return JSON only.

For Bricks Reading 250 Level ${level}, produce exactly 20 units. ${exactRule}

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
  return generate(PRO_MODEL, prompt, 0.25);
}

async function normalizeLevel(level, source) {
  console.log(`Level ${level}: extracting private metadata/originals with ${PRO_MODEL}`);
  const result = await generate(PRO_MODEL, sourcePrompt(level, source), 0.05);
  if (!Array.isArray(result.units) || result.units.length !== 20) throw new Error(`Level ${level}: source extraction did not return 20 units`);
  return result.units;
}

async function authorLevel(level, units) {
  const complete = [];
  for (let start = 0; start < units.length; start += 4) {
    const batch = units.slice(start, start + 4);
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
    }

    console.log(`Level ${level}: reviewing units ${start + 1}-${start + batch.length} with ${REVIEW_MODEL}`);
    const reviewedBatch = complete.slice(-batch.length);
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
  for (const unit of units) {
    const id = lessonId(level, unit.unit);
    const body = `// Bricks Reading 250 Level ${level}, Unit ${unit.unit}. Licensed original stays in Supabase.\nwindow.LESSONS = window.LESSONS || {};\nwindow.LESSONS[${JSON.stringify(id)}] = ${JSON.stringify(publicLesson(level, unit), null, 2)};\n`;
    fs.writeFileSync(path.join(DATA, `${id}.js`), body, 'utf8');
  }
}

async function main() {
  const options = args();
  const raw = JSON.parse(fs.readFileSync(path.resolve(options.source), 'utf8'));
  const privatePath = path.resolve(options['private-out']);
  const normalized = { generatedAt: new Date().toISOString(), models: { author: PRO_MODEL, reviewer: REVIEW_MODEL }, levels: {} };

  for (const level of [2, 3]) {
    const metadata = await normalizeLevel(level, raw.levels[String(level)]);
    const authored = await authorLevel(level, metadata);
    normalized.levels[String(level)] = authored;
    writeLessons(level, authored);
    fs.mkdirSync(path.dirname(privatePath), { recursive: true });
    fs.writeFileSync(privatePath, JSON.stringify(normalized, null, 2), 'utf8');
  }
  console.log(`Wrote private normalized source: ${privatePath}`);
  console.log('Wrote 40 public lesson files under reading-world/data');
}

main().catch(error => { console.error(error); process.exit(1); });
