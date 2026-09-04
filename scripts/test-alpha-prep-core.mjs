#!/usr/bin/env node
import assert from 'node:assert/strict';
import {
  buildCoachProviderRequest,
  buildPrompt,
  extractCoachProviderText,
  extractOutputText,
  parseModelResult,
  RUBRIC_KEYS,
  schemaFor,
  validatePayload,
} from '../supabase/functions/alpha-prep-coach/core.mjs';

const scores = Object.fromEntries(RUBRIC_KEYS.map((key, index) => [key, (index % 4) + 1]));
const turn = validatePayload({
  mode: 'turn',
  passage: {
    id: 'sample', title: 'A Sample', genre: 'Nonfiction',
    text: 'A'.repeat(100) + '<script>bad</script>',
    vocabulary: ['absorb', 'reduce'],
  },
  question: 'What is the main idea?',
  answer: 'I think the main idea is that careful planning helps because the passage gives an example.',
  questionType: 'summary',
  priorTurns: Array.from({ length: 8 }, (_, index) => ({ question: `Q${index}`, answer: `A${index}` })),
  localScores: scores,
});
assert.equal(turn.mode, 'turn');
assert.equal(turn.priorTurns.length, 4);
assert.equal(turn.passage.text.includes('<'), false);
assert.match(buildPrompt(turn), /competitive four-student reading interview/);

const turnProviderRequest = buildCoachProviderRequest('turn', turn);
assert.equal(turnProviderRequest.prompt, JSON.stringify(turn));
assert.equal(turnProviderRequest.maxOutputTokens, 4096);
assert.deepEqual(turnProviderRequest.schema.properties.feedback.properties.scores.required, RUBRIC_KEYS);

const turnSchema = schemaFor('turn');
assert.deepEqual(turnSchema.properties.feedback.properties.scores.required, RUBRIC_KEYS);
const rawTurn = JSON.stringify({
  followUp: 'Which detail from the passage best supports your idea?',
  feedback: {
    strength: 'The learner stated a clear central idea.',
    focus: 'Add one exact detail after the claim.',
    skill: 'Text evidence',
    improvedAnswer: 'I think careful planning helps because the passage gives a clear example.',
    languageNote: 'Use a complete because clause.',
    scores,
  },
});
const parsedTurn = parseModelResult('turn', rawTurn);
assert.equal(parsedTurn.followUp.startsWith('Which detail'), true);
assert.equal(parsedTurn.feedback.scores.delivery, scores.delivery);
assert.equal(extractCoachProviderText({ ok: true, text: rawTurn }), rawTurn);

const reportInput = validatePayload({
  mode: 'report',
  set: { label: 'Set 1', theme: 'Nature' },
  passages: [{ title: 'A Sample', genre: 'Nonfiction', text: 'A'.repeat(120), vocabulary: ['absorb'] }],
  turns: [
    { question: 'Summarize.', answer: 'The passage explains how a tree grows.', localScores: scores },
    { question: 'Why?', answer: 'It grows because roots absorb water.', localScores: scores },
  ],
  localRubric: scores,
});
assert.equal(reportInput.turns.length, 2);
assert.equal(buildCoachProviderRequest('report', reportInput).maxOutputTokens, 6144);
assert.deepEqual(schemaFor('report').required, ['summary', 'priorities', 'roadmap']);

const reportJson = JSON.stringify({
  summary: 'The learner communicates the main idea and now needs more exact evidence.',
  priorities: Array.from({ length: 3 }, (_, index) => ({
    title: `Priority ${index + 1}`,
    action: 'Connect each claim to one exact passage detail.',
    drill: 'Give a thirty-second claim and evidence response.',
  })),
  roadmap: Array.from({ length: 7 }, (_, index) => ({
    title: `Day ${index + 1}`,
    task: 'Read, cover the page, and give a short complete answer.',
  })),
});
const parsedReport = parseModelResult('report', reportJson);
assert.equal(parsedReport.priorities.length, 3);
assert.equal(parsedReport.roadmap.length, 7);
assert.equal('turnFeedback' in parsedReport, false);

const responseText = extractOutputText({ output: [{ content: [{ type: 'output_text', text: rawTurn }] }] });
assert.equal(responseText, rawTurn);
assert.throws(() => validatePayload({ mode: 'turn', passage: { text: 'short' }, question: '', answer: '' }), /turn_invalid/);

console.log('alpha-prep core: ok');
