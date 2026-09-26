function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  }
  return value;
}

export function questionContentSignature({ prompt, visual, image, responseKind, parts }) {
  // Source labels, generated IDs and answers do not make a new student question.
  return JSON.stringify(canonical({
    prompt: String(prompt || "").normalize("NFC").trim(),
    visual: visual || null,
    image: image || null,
    responseKind: responseKind || "text",
    parts: parts?.map((part) => questionContentSignature(part)) || null
  }));
}

export function takeUniqueQuestion(generate, signatures, signatureOf = questionContentSignature, maxAttempts = 80) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const candidate = generate(attempt);
    if (!candidate) continue;
    const signature = signatureOf(candidate);
    if (signatures.has(signature)) continue;
    signatures.add(signature);
    return candidate;
  }
  return null;
}

export function buildUniqueQuestions(references, count, generate, signatureOf = questionContentSignature, previousSignatures = []) {
  const questions = [];
  const signatures = new Set(previousSignatures);
  const counters = new Map();
  if (!references.length) return { questions, signatures, missing: count };
  for (let index = 0; index < count; index += 1) {
    const referenceIndex = index % references.length;
    const reference = references[referenceIndex];
    const sequence = counters.get(reference.typeId) || 0;
    counters.set(reference.typeId, sequence + 1);
    const question = takeUniqueQuestion(
      (attempt) => generate(reference, sequence, attempt), signatures, signatureOf
    );
    if (question) questions.push(question);
    // A failed sequence does not prove later sequences in this type are exhausted.
  }
  return { questions, signatures, missing: count - questions.length };
}
