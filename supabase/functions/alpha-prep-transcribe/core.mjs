export const MAX_AUDIO_BYTES = 8_000_000;
export const MAX_DURATION_MS = 95_000;

const ALLOWED_AUDIO_TYPES = new Set([
  'audio/mp3',
  'audio/mp4',
  'audio/mpeg',
  'audio/wav',
  'audio/webm',
]);

function cleanText(value, maxLength) {
  return typeof value === 'string'
    ? value.replace(/[<>\r\n]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLength)
    : '';
}

export function validateAudioMetadata(audio, durationValue) {
  if (!audio || typeof audio.size !== 'number' || typeof audio.type !== 'string') {
    throw new Error('audio_invalid');
  }
  const type = audio.type.toLowerCase().split(';')[0].trim();
  const durationMs = Number(durationValue);
  if (!ALLOWED_AUDIO_TYPES.has(type)) throw new Error('audio_type_invalid');
  if (audio.size < 100 || audio.size > MAX_AUDIO_BYTES) throw new Error('audio_size_invalid');
  if (!Number.isFinite(durationMs) || durationMs < 250 || durationMs > MAX_DURATION_MS) {
    throw new Error('audio_duration_invalid');
  }
  return { type, durationMs: Math.round(durationMs) };
}

export function parseContext(value) {
  let source = value;
  if (typeof value === 'string') {
    if (value.length > 8_000) throw new Error('context_invalid');
    try {
      source = JSON.parse(value);
    } catch (_) {
      throw new Error('context_invalid');
    }
  }
  if (!source || typeof source !== 'object' || Array.isArray(source)) throw new Error('context_invalid');

  const keywords = Array.isArray(source.keywords)
    ? source.keywords
      .map((keyword) => cleanText(keyword, 64))
      .filter(Boolean)
      .filter((keyword, index, all) => all.indexOf(keyword) === index)
      .slice(0, 20)
    : [];

  return {
    passageTitle: cleanText(source.passageTitle, 140),
    passageGenre: cleanText(source.passageGenre, 40),
    question: cleanText(source.question, 520),
    keywords,
  };
}

export function buildPrompt(context) {
  const details = [
    context.passageGenre && `Passage genre: ${context.passageGenre}.`,
    context.passageTitle && `Passage title: ${context.passageTitle}.`,
    context.question && `The interviewer asked: ${context.question}`,
    context.keywords.length && `Expected English words may include: ${context.keywords.join(', ')}.`,
  ].filter(Boolean).join(' ');

  return [
    'This is an English answer from a seven-year-old child in Korea or the United States.',
    'The child may speak English with a Korean or American accent and may make age-appropriate grammar mistakes.',
    'Write the spoken English using the Latin alphabet only, even when the pronunciation has a Korean accent.',
    'Do not evaluate pronunciation or add pronunciation feedback.',
    'Transcribe only what is actually spoken. Preserve grammar mistakes, repetitions, unfinished phrases, and numbers exactly; do not correct, complete, summarize, or rewrite the answer.',
    details,
  ].filter(Boolean).join(' ').slice(0, 1_600);
}

export function extensionForAudioType(type) {
  if (type === 'audio/mp4') return 'm4a';
  if (type === 'audio/mpeg' || type === 'audio/mp3') return 'mp3';
  if (type === 'audio/wav') return 'wav';
  return 'webm';
}

export function appendTranscriptionFields(form, context) {
  form.append('model', 'gpt-transcribe');
  form.append('prompt', buildPrompt(context));
  form.append('language', 'en');
  return form;
}

export function extractTranscript(payload) {
  const text = cleanText(payload && payload.text, 2_000);
  if (!text) throw new Error('transcript_invalid');
  return text;
}
