'use strict';

/*
 * Fast, occurrence-level generator diversity gate.
 *
 * This deliberately keeps two fingerprints apart:
 *   - exact content: proves that a seed changes the visible task, not only q.seed;
 *   - structural content: removes scalar numbers but retains semantic strings,
 *     array order, coordinate topology, colors, names, operations, directions,
 *     query modes, choice order, and SVG/HTML composition.
 *
 * A numerically varied but structurally fixed generator is reported as `held`.
 * Generation errors, nondeterminism, broken single-answer contracts, or no
 * visible task variation are real failures and make the process exit non-zero.
 * Pass --strict-structure to also make a held structural result exit non-zero.
 */

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const provider = require('../challenge/variant-provider.js');
const questionIdentity = require('../challenge/question-identity.js');

const LEVELS = ['easy', 'same', 'hard'];
const DEFAULT_SEEDS = 12;
const VOLATILE_KEYS = new Set([
  'answer', 'answers', 'answerCandidates', 'answerHtml', 'correct', 'expected',
  'seed', 'difficulty', 'difficultyLabel', 'id', 'source', 'evidence', 'variant',
  'solution', 'solutionDiagram', 'typeId', 'sourceTypeId'
]);
const SEMANTIC_ARRAY_KEYS = /(?:choice|option|order|color|name|item|move|path|route|direction|symbol|operator|clue|relation|query|mode|schema|rule|operation|view|cell|point|vertex|pair|group|pattern|kind)/i;

function digest(value) {
  return crypto.createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex').slice(0, 16);
}

function normalizeText(value) {
  return String(value)
    .normalize('NFKC')
    .replace(/[+\-−]?\d+(?:[.,]\d+)*/g, '#')
    .replace(/\s+/g, ' ')
    .trim();
}

function numericSequenceProfile(values) {
  const unique = [...new Set(values)].sort((a, b) => a - b);
  const rank = new Map(unique.map((value, index) => [value, index]));
  const equality = new Map();
  let nextEquality = 0;
  const equalityPattern = values.map(value => {
    if (!equality.has(value)) equality.set(value, nextEquality++);
    return equality.get(value);
  });
  const direction = values.slice(1).map((value, index) => Math.sign(value - values[index]));
  return {
    kind: 'numeric-sequence',
    length: values.length,
    equality: equalityPattern,
    rank: values.map(value => rank.get(value)),
    direction
  };
}

function coordinateProfile(points) {
  const direction = (dx, dy) => {
    if (dx === 0 && dy === 0) return 'O';
    if (dx === 0) return dy > 0 ? 'S' : 'N';
    if (dy === 0) return dx > 0 ? 'E' : 'W';
    return `${dy > 0 ? 'S' : 'N'}${dx > 0 ? 'E' : 'W'}:${Math.abs(dx) === Math.abs(dy) ? 'diag' : Math.abs(dx) > Math.abs(dy) ? 'wide' : 'tall'}`;
  };
  const steps = points.slice(1).map((point, index) => direction(point[0] - points[index][0], point[1] - points[index][1]));
  const seen = new Map();
  let next = 0;
  const revisit = points.map(point => {
    const key = point.join(',');
    if (!seen.has(key)) seen.set(key, next++);
    return seen.get(key);
  });
  const xs = points.map(point => point[0]);
  const ys = points.map(point => point[1]);
  return {
    kind: 'coordinate-sequence',
    length: points.length,
    steps,
    turns: steps.slice(1).map((step, index) => step === steps[index] ? 'straight' : `${steps[index]}>${step}`),
    revisit,
    spanRelation: Math.sign((Math.max(...xs) - Math.min(...xs)) - (Math.max(...ys) - Math.min(...ys)))
  };
}

function exactCanonical(value) {
  if (Array.isArray(value)) return value.map(exactCanonical);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.keys(value).sort().filter(key => !VOLATILE_KEYS.has(key)).map(key => [key, exactCanonical(value[key])]));
}

function structuralCanonical(value, key = '') {
  if (Array.isArray(value)) {
    if (value.every(item => typeof item === 'number' && Number.isFinite(item))) return numericSequenceProfile(value);
    if (value.length > 1 && value.every(item => Array.isArray(item) && item.length === 2 && item.every(n => typeof n === 'number' && Number.isFinite(n)))) {
      return coordinateProfile(value);
    }
    return { kind: SEMANTIC_ARRAY_KEYS.test(key) ? `semantic-array:${key}` : 'array', length: value.length, items: value.map(item => structuralCanonical(item, key)) };
  }
  if (value === null) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? '#' : 'invalid-number';
  if (typeof value === 'string') return normalizeText(value);
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'object') return typeof value;
  return Object.fromEntries(
    Object.keys(value).sort().filter(childKey => !VOLATILE_KEYS.has(childKey)).map(childKey => [childKey, structuralCanonical(value[childKey], childKey)])
  );
}

function htmlProfile(html) {
  const source = String(html || '');
  const tags = [...source.matchAll(/<\/?\s*([a-z][\w:-]*)\b/gi)].map(match => match[1].toLowerCase());
  const tagCounts = {};
  for (const tag of tags) tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  const attrs = [...source.matchAll(/\b(?:class|aria-label|fill|stroke|data-kind|data-mode)\s*=\s*["']([^"']+)["']/gi)]
    .map(match => normalizeText(match[1]));
  const pathCommands = [...source.matchAll(/\bd\s*=\s*["']([^"']+)["']/gi)]
    .map(match => (match[1].match(/[a-z]/gi) || []).join('').toUpperCase());
  const polygonSizes = [...source.matchAll(/\bpoints\s*=\s*["']([^"']+)["']/gi)]
    .map(match => match[1].trim().split(/\s+/).filter(Boolean).length);
  const visibleText = normalizeText(source.replace(/<style\b[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' '))
    .replace(/(?:^|\s)#(?=\s|$)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return { tagCounts, tagOrder: tags, attrs, pathCommands, polygonSizes, visibleText };
}

function structuralFacets(question) {
  const prompt = normalizeText(question.prompt || '');
  const payload = structuralCanonical(question.payload || {}, 'payload');
  const visual = htmlProfile(question.problemHtml || '');
  const responseMode = question.responsePart === undefined ? 'whole' : `part:${question.responsePart}`;
  return {
    payload: digest(payload),
    prompt: digest(prompt),
    visual: digest(visual),
    responseMode,
    combined: digest({ payload, prompt, visual, responseMode })
  };
}

function exactContentSignature(question) {
  return digest({
    prompt: question.prompt,
    problemHtml: question.problemHtml,
    payload: exactCanonical(question.payload || {}),
    responsePart: question.responsePart === undefined ? null : question.responsePart
  });
}

function actualVisibleSignature(question) {
  return digest({
    prompt: String(question.prompt || ''),
    problemHtml: String(question.problemHtml || ''),
    responsePart: question.responsePart === undefined ? null : question.responsePart
  });
}

function same(a, b) {
  try {
    assert.deepEqual(a, b);
    return true;
  } catch (_) {
    return false;
  }
}

function parseSeedCount() {
  const arg = process.argv.find(value => value.startsWith('--seeds='));
  if (!arg) return DEFAULT_SEEDS;
  const count = Number(arg.slice('--seeds='.length));
  if (!Number.isInteger(count) || count < 12 || count > 20) throw new Error('--seeds must be an integer from 12 to 20');
  return count;
}

function tally(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) || 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function auditCase(row, difficulty, seeds, crossOccurrenceSamples) {
  const label = `${row.key}/${difficulty}`;
  const errors = [];
  const exact = [];
  const facets = { combined: [], payload: [], prompt: [], visual: [], responseMode: [] };
  let deterministicChecks = 0;
  let singleAnswerChecks = 0;

  for (const seed of seeds) {
    const args = { round: row.round, section: row.section, number: row.number, difficulty, seed };
    let first;
    let second;
    try {
      first = provider.generate(args);
      second = provider.generate(args);
    } catch (error) {
      errors.push({ seed, kind: 'throw', message: error.message });
      continue;
    }
    if (!same(first, second)) {
      errors.push({ seed, kind: 'nondeterministic', message: 'same seed returned different results' });
      continue;
    }
    deterministicChecks += 1;
    if (first.status !== 'verified' || !first.question) {
      errors.push({ seed, kind: 'generation-held', message: first.reason || first.status || 'missing question' });
      continue;
    }
    const question = first.question;
    const candidateOk = Array.isArray(question.answerCandidates) && question.answerCandidates.length === 1 && same(question.answerCandidates[0], question.answer);
    const expressionOk = question.answer !== undefined && question.prompt && !/(?:undefined|NaN)/.test(`${question.prompt}${question.problemHtml || ''}`);
    if (!candidateOk || !expressionOk) {
      errors.push({ seed, kind: 'answer-contract', message: `singleCandidate=${candidateOk}, expression=${Boolean(expressionOk)}` });
      continue;
    }
    singleAnswerChecks += 1;
    exact.push(exactContentSignature(question));
    const canonicalPayload = digest(exactCanonical(question.payload || {}));
    const visible = actualVisibleSignature(question);
    crossOccurrenceSamples.push({
      origin: row.key,
      round: row.round,
      section: row.section,
      number: row.number,
      typeId: row.typeId,
      difficulty,
      seed,
      questionId: question.id,
      canonicalPayload,
      visible,
      exactVariant: digest(`${canonicalPayload}:${visible}`)
    });
    const signature = structuralFacets(question);
    for (const key of Object.keys(facets)) facets[key].push(signature[key]);
  }

  const exactTally = tally(exact);
  const structuralTally = tally(facets.combined);
  const dominant = structuralTally[0]?.[1] || 0;
  const realFailure = errors.length > 0 || exactTally.length < 2;
  const limitedStructure = !realFailure && (structuralTally.length < 2 || dominant > seeds.length - 2);
  const status = realFailure ? 'failed' : limitedStructure ? 'held' : 'passed';
  const reasons = [];
  if (errors.length) reasons.push(`${errors.length} generation/determinism/answer-contract errors`);
  if (exactTally.length < 2) reasons.push(`only ${exactTally.length} visible exact task across ${seeds.length} seeds`);
  if (limitedStructure) reasons.push(`only ${structuralTally.length} meaningful non-numeric structures; dominant structure ${dominant}/${seeds.length}`);

  return {
    key: row.key,
    typeId: row.typeId,
    family: row.family,
    difficulty,
    status,
    reason: reasons.join('; '),
    checks: { generated: exact.length, deterministic: deterministicChecks, singleAnswer: singleAnswerChecks },
    diversity: {
      exactTasks: exactTally.length,
      meaningfulStructures: structuralTally.length,
      dominantStructure: dominant,
      payloadStructures: new Set(facets.payload).size,
      promptModes: new Set(facets.prompt).size,
      visualLayouts: new Set(facets.visual).size,
      responseModes: new Set(facets.responseMode).size
    },
    structureHistogram: structuralTally.map(([signature, count]) => ({ signature, count })),
    errors
  };
}

function crossOccurrenceGroups(samples, field, options = {}) {
  const groups = new Map();
  for (const sample of samples) {
    const key = sample[field];
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(sample);
  }
  const collisions = [];
  for (const [signature, rows] of groups) {
    const origins = [...new Set(rows.map(row => row.origin))];
    if (origins.length < 2) continue;
    if (options.requireDifferentVisible && new Set(rows.map(row => row.visible)).size < 2) continue;
    if (options.requireDifferentPayload && new Set(rows.map(row => row.canonicalPayload)).size < 2) continue;
    const representativeRows = origins.map(origin => rows.find(row => row.origin === origin));
    const extraRows = rows.filter(row => !representativeRows.includes(row)).slice(0, Math.max(0, 8 - representativeRows.length));
    collisions.push({
      signature,
      occurrenceCount: origins.length,
      sampleCount: rows.length,
      origins,
      samples: [...representativeRows, ...extraRows].map(({ origin, round, section, number, typeId, difficulty, seed, questionId, canonicalPayload, visible }) => ({ origin, round, section, number, typeId, difficulty, seed, questionId, canonicalPayload, visible }))
    });
  }
  return collisions.sort((a, b) => b.occurrenceCount - a.occurrenceCount || b.sampleCount - a.sampleCount || a.signature.localeCompare(b.signature));
}

function auditCrossOccurrence(samples) {
  const exactVariantCollisions = crossOccurrenceGroups(samples, 'exactVariant');
  // Exact payload+visible duplicates are already listed above. This second
  // bucket catches the rarer case where different internals show the learner
  // the exact same question, without counting the same defect twice.
  const visibleCollisions = crossOccurrenceGroups(samples, 'visible', { requireDifferentPayload: true });
  const questionIdCollisions = crossOccurrenceGroups(samples, 'questionId');
  // A shared payload with a different visible rendering can be a legitimate
  // reuse of a solving model, so it is evidence only and is not a failure.
  const payloadSimilarities = crossOccurrenceGroups(samples, 'canonicalPayload', { requireDifferentVisible: true });
  return {
    sampledVariants: samples.length,
    uniqueQuestionIds: new Set(samples.map(sample => sample.questionId)).size,
    uniqueCanonicalPayloads: new Set(samples.map(sample => sample.canonicalPayload)).size,
    uniqueVisibleQuestions: new Set(samples.map(sample => sample.visible)).size,
    exactVariantCollisions,
    visibleCollisions,
    questionIdCollisions,
    payloadSimilarities,
    riskGroupCount: exactVariantCollisions.length + visibleCollisions.length + questionIdCollisions.length
  };
}

function requestFromSample(sample) {
  return { round: sample.round, section: sample.section, number: sample.number, difficulty: sample.difficulty, seed: sample.seed };
}

function canonicalVariant(question) {
  const signatures = questionIdentity.signatures(question);
  return `${signatures.visible}\u241e${signatures.payload}`;
}

function uniqueByIdentityContract(questions) {
  const registry = questionIdentity.createRegistry();
  return questions.every(question => registry.add(question));
}

function verifyMixedSelectionGuard(crossOccurrence, samples) {
  const report = { available: typeof provider.generateBatch === 'function', resolvedRiskGroups: 0, advancedCollisionGroups: 0, deterministicRiskGroups: 0, acceptedDistinctControl: false, failures: [] };
  if (!report.available) {
    report.failures.push({ kind: 'missing-generateBatch', message: 'variant-provider must expose a duplicate-rejecting mixed selector' });
    return report;
  }
  const risks = [...crossOccurrence.exactVariantCollisions, ...crossOccurrence.visibleCollisions, ...crossOccurrence.questionIdCollisions];
  for (const risk of risks) {
    const first = risk.samples[0];
    const second = risk.samples.find(sample => sample.origin !== first.origin);
    if (!second) {
      report.failures.push({ kind: 'risk-without-two-origins', signature: risk.signature, origins: risk.origins });
      continue;
    }
    const requests = [requestFromSample(first), requestFromSample(second)];
    const result = provider.generateBatch(requests);
    const replay = provider.generateBatch(requests);
    const signatures = result.questions?.map(canonicalVariant) || [];
    const resolved = result.status === 'verified' && result.questions?.length === 2 && uniqueByIdentityContract(result.questions);
    if (!resolved) {
      report.failures.push({ kind: 'mixed-selector-did-not-resolve-collision', signature: risk.signature, origins: [first.origin, second.origin], resultStatus: result.status, reason: result.reason });
      continue;
    }
    report.resolvedRiskGroups += 1;
    if (result.selections?.some(selection => selection.attempts > 1 && selection.duplicateCandidates > 0)) report.advancedCollisionGroups += 1;
    if (JSON.stringify(result.selections) === JSON.stringify(replay.selections) && JSON.stringify(signatures) === JSON.stringify(replay.questions.map(canonicalVariant))) report.deterministicRiskGroups += 1;
    else report.failures.push({ kind: 'mixed-selector-nondeterministic', signature: risk.signature, origins: [first.origin, second.origin] });
  }
  const first = samples[0];
  const second = samples.find(sample => sample.origin !== first.origin && sample.exactVariant !== first.exactVariant && sample.visible !== first.visible && sample.questionId !== first.questionId);
  if (!second) report.failures.push({ kind: 'missing-distinct-control' });
  else {
    const result = provider.generateBatch([requestFromSample(first), requestFromSample(second)]);
    report.acceptedDistinctControl = result.status === 'verified' && result.questions?.length === 2 && uniqueByIdentityContract(result.questions);
    if (!report.acceptedDistinctControl) report.failures.push({ kind: 'mixed-selector-rejected-distinct-control', origins: [first.origin, second.origin], resultStatus: result.status, reason: result.reason });
  }
  return report;
}

function aggregateByType(cases) {
  const groups = new Map();
  for (const item of cases) {
    if (!groups.has(item.typeId)) groups.set(item.typeId, []);
    groups.get(item.typeId).push(item);
  }
  return [...groups.entries()].map(([typeId, rows]) => ({
    typeId,
    occurrences: new Set(rows.map(row => row.key)).size,
    supportedDifficultyCases: rows.length,
    status: rows.some(row => row.status === 'failed') ? 'failed' : rows.some(row => row.status === 'held') ? 'held' : 'passed',
    failed: rows.filter(row => row.status === 'failed').map(row => `${row.key}/${row.difficulty}`),
    held: rows.filter(row => row.status === 'held').map(row => `${row.key}/${row.difficulty}`),
    minimumMeaningfulStructures: Math.min(...rows.map(row => row.diversity.meaningfulStructures)),
    minimumExactTasks: Math.min(...rows.map(row => row.diversity.exactTasks))
  })).sort((a, b) => a.typeId.localeCompare(b.typeId));
}

function main() {
  const started = process.hrtime.bigint();
  const seedCount = parseSeedCount();
  const seeds = Array.from({ length: seedCount }, (_, index) => index);
  const rows = provider.list();
  const failures = [];
  const unsupported = [];
  const cases = [];
  const crossOccurrenceSamples = [];

  if (rows.length !== 104) failures.push({ kind: 'registry-size', expected: 104, actual: rows.length });
  for (const row of rows) {
    for (const difficulty of LEVELS) {
      if (!row.eligibility[difficulty]) {
        const result = provider.generate({ round: row.round, section: row.section, number: row.number, difficulty, seed: 0 });
        const correctlyHeld = result.status === 'held';
        unsupported.push({ key: row.key, typeId: row.typeId, difficulty, status: correctlyHeld ? 'held' : 'failed', reason: row.heldReason || result.reason || 'unsupported level' });
        if (!correctlyHeld) failures.push({ kind: 'unsupported-generated', key: row.key, typeId: row.typeId, difficulty });
        continue;
      }
      const result = auditCase(row, difficulty, seeds, crossOccurrenceSamples);
      cases.push(result);
      if (result.status === 'failed') failures.push({ kind: 'case', key: result.key, typeId: result.typeId, difficulty, reason: result.reason, errors: result.errors });
    }
  }

  const crossOccurrence = auditCrossOccurrence(crossOccurrenceSamples);
  const runtimeMixedSelector = verifyMixedSelectionGuard(crossOccurrence, crossOccurrenceSamples);
  failures.push(...runtimeMixedSelector.failures);
  const held = cases.filter(item => item.status === 'held');
  const elapsedMs = Number(process.hrtime.bigint() - started) / 1e6;
  const strictStructure = process.argv.includes('--strict-structure');
  const report = {
    schemaVersion: 1,
    validator: 'challenge-generator-diversity',
    providerVersion: provider.version,
    seedCount,
    seedRange: [seeds[0], seeds.at(-1)],
    rules: {
      exactTaskMinimum: 2,
      meaningfulStructureMinimum: 2,
      minimumMinorStructureSamples: 2,
      numbersMasked: true,
      retainedSignals: ['payload keys and kinds', 'array order and rank topology', 'coordinates and turns', 'colors and names', 'operations and directions', 'query/response modes', 'HTML/SVG composition'],
      heldIsFailureOnlyWithStrictStructure: true
    },
    summary: {
      registeredOccurrences: rows.length,
      totalDifficultySlots: rows.length * LEVELS.length,
      supportedDifficultyCases: cases.length,
      unsupportedDifficultyCases: unsupported.length,
      generatedQuestions: cases.reduce((sum, item) => sum + item.checks.generated, 0),
      deterministicChecks: cases.reduce((sum, item) => sum + item.checks.deterministic, 0),
      singleAnswerChecks: cases.reduce((sum, item) => sum + item.checks.singleAnswer, 0),
      passedCases: cases.filter(item => item.status === 'passed').length,
      heldStructuralCases: held.length,
      failedCases: cases.filter(item => item.status === 'failed').length,
      generationErrors: cases.reduce((sum, item) => sum + item.errors.length, 0),
      crossOccurrenceDuplicateGroups: crossOccurrence.riskGroupCount,
      crossOccurrenceExactVariantGroups: crossOccurrence.exactVariantCollisions.length,
      crossOccurrenceVisibleOnlyGroups: crossOccurrence.visibleCollisions.length,
      crossOccurrenceQuestionIdGroups: crossOccurrence.questionIdCollisions.length,
      runtimeResolvedDuplicateRiskGroups: runtimeMixedSelector.resolvedRiskGroups,
      runtimeAdvancedCollisionGroups: runtimeMixedSelector.advancedCollisionGroups,
      runtimeDeterministicRiskGroups: runtimeMixedSelector.deterministicRiskGroups,
      realFailureRecords: failures.length,
      elapsedMs: Math.round(elapsedMs),
      releaseReady: failures.length === 0 && held.length === 0,
      processPassed: failures.length === 0 && (!strictStructure || held.length === 0)
    },
    byType: aggregateByType(cases),
    held: held.map(item => ({ key: item.key, typeId: item.typeId, family: item.family, difficulty: item.difficulty, reason: item.reason, diversity: item.diversity })),
    crossOccurrence,
    runtimeMixedSelector,
    failures,
    unsupported,
    cases
  };

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (failures.length || (strictStructure && held.length)) process.exitCode = 1;
  return report;
}

if (require.main === module) main();
module.exports = { main, structuralCanonical, structuralFacets, exactContentSignature, actualVisibleSignature, htmlProfile, coordinateProfile, auditCrossOccurrence };
