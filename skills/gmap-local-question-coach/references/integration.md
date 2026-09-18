# Integration contract

Load the stylesheet in `<head>` and the script after the problem renderer:

```html
<link rel="stylesheet" href="./gmap-local-question-coach.css">
<script src="./gmap-local-question-coach.js"></script>
```

The default adapter recognizes `.problem-card`, `.book-problem`, `.question-paper`, and `.lesson-paper`. Each card should have a stable `data-item-id`. Add only reviewed, answer-free support metadata:

```html
<article class="problem-card"
  data-item-id="ratio-01"
  data-coach-group="ratio-unit-rate"
  data-coach-hint="Find the amount for one unit first."
  data-coach-misconception="Do not multiply before finding the unit rate.">
</article>
```

The default attempt adapter recognizes these states:

- correct: `.feedback.correct`, `.feedback.is-correct`, `.choice-feedback.correct`, or `.is-correct` on the card
- wrong: `.feedback.wrong`, `.feedback.is-wrong`, or `.choice-feedback.wrong`
- teacher explanations: `.teacher-solution`, `.teacher-key`, `.teacher-answer`

Projects with different markup may define `window.GMAPQuestionCoachConfig` before loading the script:

```js
window.GMAPQuestionCoachConfig = {
  cardSelector: ".my-question",
  getHint(card, locale) { return card.dataset.reviewedHint || ""; },
  getMisconception(card, locale) { return card.dataset.reviewedMisconception || ""; },
  getAttemptState(card) { return card.dataset.state || "none"; },
  findSimilar(card, cards) { return cards.find((item) => item.dataset.skill === card.dataset.skill && item !== card); }
};
```

Configuration callbacks must return existing reviewed content or an existing verified card. They must not calculate or invent an unverified answer. The coach has no network code and must remain absent from print.
