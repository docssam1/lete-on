---
name: gmap-local-question-coach
description: Add or adapt an API-free, problem-context question coach that gives local hints, attempt analysis, misconception guidance, and verified similar-item navigation in GFIELD learning pages.
---

# G·MAP Local Question Coach

Use the reusable assets in `assets/` instead of rebuilding a chat interface per project. The coach must remain deterministic and must never call an external API.

## Integration

1. Read [references/integration.md](references/integration.md).
   Open `assets/demo.html` when a working standalone example is useful.
2. Inspect the target problem-card renderer and its actual correct/wrong states before mapping selectors.
3. Copy or directly load `assets/gmap-local-question-coach.css` and `assets/gmap-local-question-coach.js`.
4. Supply reviewed hints and misconceptions through the documented data attributes or configuration hooks. Never generate a new mathematical item from number substitution.
5. Keep final answers hidden in student mode. Teacher explanations may be read only from already visible teacher-only DOM.
6. Verify keyboard use, 390px width, the real problem context, similar-item navigation, and print hiding. Confirm that loading and using the coach produces no network request.

Do not attach the coach to placement tests or timed diagnostics unless the product explicitly permits help during the assessment.
