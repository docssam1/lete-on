---
name: gfield-science-question-bank
description: Build or audit source-grounded Korean science question banks, including theory, inquiry, experiments, observations, data, diagrams, answers, explanations, variants, search metadata, and print output. Use for science work only; do not route Fields Classic mathematics or geometry work through this skill.
---

# GFIELD Science Question Bank

Treat science as its own domain. Do not borrow a mathematics question-bank template merely because an item contains numbers, tables, graphs, shapes, or calculations. The scientific phenomenon, inquiry process, evidence, and causal conditions are the content.

## Work From Evidence Claude Can Actually Access

Claude may see only this GitHub checkout. Never claim to have inspected a local disk, Google Drive folder, textbook, teacher guide, answer key, image, or PDF that is not available in the current environment.

- Inspect the current checkout, branch, status, repository instructions, existing schemas, renderers, audits, and tests before editing.
- Use only accessible source artifacts as evidence. A filename, title, OCR fragment, prior summary, or another model's claim is not a substitute for the rendered source page and its answer evidence.
- Keep licensed originals, teacher answers, student information, and private absolute paths out of public Git history. Store only approved metadata, derived structures, and independently authored assets.
- If required evidence is missing, mark the item `needs-source`, `needs-answer`, `needs-visual`, or `held`. Do not fill gaps by guessing.
- If a new item is independently authored without a source counterpart, label it `authored`, not `source-verified` or `similar-to-source`.

## Establish the Item Contract Before Authoring

Every item needs one reviewable contract. Adapt field names to the repository's existing schema rather than introducing a parallel database.

```js
{
  id,
  status,              // authored | verified | needs-source | needs-answer | needs-visual | held
  sourceRef: {
    sourceId,          // public-safe opaque id, never a private path
    edition,
    course,
    unit,
    lesson,
    page,
    originalNo
  },
  taxonomy: {
    domain,            // 물질 | 생명 | 운동과 에너지 | 지구와 우주 | 과학과 사회 ...
    topic,
    concept,
    inquirySkill,
    itemType
  },
  prompt,
  givens,
  visualModel,
  responseContract,
  answerContract,
  explanation,
  variantRules,
  evidence
}
```

`sourceRef` identifies provenance without exposing the source. `evidence` records what was actually checked, by whom or by which deterministic check, and when. Unknown fields stay unknown.

## Classify the Scientific Task Correctly

Use the real thinking operation, not a generic label such as `과학 문제` or `자료 해석`.

- concept and terminology
- classification by observable properties
- observation versus inference
- prediction with stated conditions
- cause and effect
- experiment purpose or hypothesis
- manipulated, responding, and controlled variables
- control or comparison group
- apparatus choice or experimental sequence
- measurement, units, repeated trials, and error
- table, graph, photograph, specimen, or model interpretation
- evidence-based conclusion
- real-world application
- laboratory and field safety

The search index must expose at least course or grade, unit, topic, concept, inquiry skill, item type, and searchable stem terms. Do not show implementation or generator status to students.

## Preserve the Science, Not Just the Wording

For theory items:

- State the conditions under which a fact is true. Do not turn a conditional relationship into an absolute rule.
- Use grade-appropriate language without introducing a scientific falsehood through oversimplification.
- Keep related terms distinct, especially observation/inference, mass/weight, heat/temperature, weather/climate, melting/dissolving, and adaptation/acquired change.
- Check labels, direction, scale, units, sign, time order, and material state against the intended phenomenon.
- Avoid trivia that can be answered from an accidental word cue instead of the target concept.

For experiment and inquiry items, determine all applicable parts before writing:

1. question or purpose;
2. hypothesis, when the level and task require one;
3. manipulated, responding, and controlled variables;
4. control or comparison condition;
5. materials, amounts, setup, and sequence;
6. what is observed or measured, with unit and timing;
7. repetition or reliability condition;
8. safety constraints;
9. expected observation;
10. conclusion supported by that observation.

Do not silently invent missing experimental results. Clearly distinguish measured data from a prediction, example data, or simulation. A conclusion may not claim more than the setup can test.

## Build Diagrams From a Semantic Model

The picture is part of the question contract, not decoration.

- Draw only information needed to solve the item. Do not illustrate every sentence.
- Reconstruct an original, rights-safe diagram from semantic data; do not trace or publish a licensed page image.
- Use the same verified model for screen, print, and solution figures. Put answer-revealing annotations in a separate solution layer.
- Make apparatus connections physically coherent. Check vessel openings, supports, tubing, electrodes, light paths, forces, flow arrows, specimen orientation, measurement scales, and label targets.
- Show an initial or observation state when that is the task. Do not show every intermediate state when doing so gives away the answer.
- Ensure symbols, colors, patterns, arrows, and legends have one meaning. Color cannot be the only carrier of meaning.
- Keep text and labels clear at desktop width, 390 px, and actual A4 size. No overlaps, clipping, tiny labels, or distorted aspect ratios.

If the diagram cannot be independently reconstructed from available evidence, hold the item instead of producing a plausible-looking substitute.

## Author Variants That Preserve the Reasoning Structure

A variant is not a copied sentence with changed nouns or numbers. Preserve the target concept, inquiry operation, information structure, response form, and difficulty while changing the surface context enough to be a new item.

- Recompute the answer and all displayed data from the variant's own model.
- Keep quantities, materials, time, temperature, scale, and outcomes scientifically plausible.
- Preserve necessary controls and causal conditions when changing an experiment.
- Reject variants whose answer is visible in the prompt, title, legend, illustration, unit, or another choice.
- Make distractors represent plausible misconceptions or procedural errors. Do not use nonsense, grammatical mismatch, or consistently longest-answer cues.
- For generated items, use a stable seed or persisted instance so reopening and printing cannot change the question or answer.
- Enumerate bounded answer spaces when possible. Otherwise use an independent derivation or a second implementation to verify the answer.

## Specify the Answer Contract

Decide before rendering whether the response is:

- one choice;
- one word or phrase;
- a number with a required unit;
- an ordered sequence;
- an unordered set;
- multiple selections;
- a labeled drawing, table, or graph;
- an evidence-based written explanation.

Record accepted equivalents, required keywords, order sensitivity, unit handling, rounding or tolerance, and whether multiple answers are valid. Never force a scientifically valid alternative into a false single-answer contract.

The explanation must include:

1. the condition or evidence to read;
2. the scientific principle or inquiry rule used;
3. the reasoning applied to the actual item;
4. the answer;
5. a check that the answer fits the observation, data, or setup.

`관찰하면 알 수 있다`, `실험하면 된다`, or `자료를 보면` followed by an answer is not a solution.

## Keep Student, Teacher, and Print Boundaries Separate

- Student questions must not contain answer labels, teacher marks, completed diagrams, solution-only colors, or explanatory captions that reveal the result.
- Teacher view may include the answer contract, accepted alternatives, misconception notes, and full explanation.
- Problem and answer numbering must come from the same data instance.
- Place an answer line directly under each subquestion when the learner responds per part.
- Print multiple suitably sized questions per page. Do not force one short item onto every page or shrink a complex visual until it is unreadable.
- Keep problem-only, answer-and-explanation, both, and quick-answer print modes semantically distinct when the product supports them.

## Release Gates

An item is eligible for release only after the applicable gates pass independently:

1. **Source gate:** source identity, edition, page, original number, prompt structure, and rights boundary are confirmed.
2. **Science gate:** terminology, causal conditions, experiment logic, units, data, and conclusion are independently checked.
3. **Answer gate:** response contract, official answer where available, independent solution, accepted alternatives, and uniqueness are reconciled.
4. **Visual gate:** the diagram matches the item model and is inspected for scientific coherence and answer leakage.
5. **Variant gate:** many generated instances preserve the contract and remain solvable, plausible, and stable.
6. **Product gate:** search metadata, empty/loading/error states, keyboard input, scoring, saving, and teacher/student separation work.
7. **Render gate:** inspect actual desktop and 390 px screenshots plus actual A4/PDF problem and answer output for clipping, scale, page breaks, fonts, and blank pages.
8. **Privacy gate:** scan the staged diff for originals, official answer artifacts, student data, secrets, and concrete private path fragments.

Automated counts do not replace visual review. A representative sample does not justify claiming a full review. Record exactly which items, seeds, pages, viewports, and print modes were checked.

## Editing and Delivery Discipline

- Preserve existing repository patterns and touch only the science scope requested.
- Do not modify mathematics, Fields Classic, geometry, or unrelated shared behavior to make science work fit.
- Do not overwrite or delete source material. Do not broadly stage, reset, clean, merge, commit, push, or deploy unrelated changes.
- A passing audit makes work eligible; it does not imply editorial approval or publication.
- Before handoff, report completed items, held items and reasons, source/answer/visual verification coverage, generated-instance checks, screen and print evidence, privacy scan result, and remaining work.

When evidence is unavailable from GitHub, finish only the source-independent scaffolding and leave a precise evidence request. Never represent inaccessible local material as reviewed.
