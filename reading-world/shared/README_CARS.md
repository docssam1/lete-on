# Reading World · CARS shared layout

CARS Level D uses a shared layout layer so textbook-like visual structures are not hard-coded separately in every lesson.

## Files

- `shared/cars-layout.css` — source typography, poster/journal/article layouts, sequence/cause-effect/branch-map components, responsive rules.
- `shared/cars-components.js` — observes the Reading World screen and applies CARS D layout rules to the currently rendered lesson.
- `shared/cars-source-bridge.js` — optional bridge for private Supabase metadata carried inside `original_questions`.
- `data/cars-d-layouts.js` — public layout metadata only: source page groups, layout type, media placement, blank positions and step-number flags.
- `shared/CARS_D_SOURCE_MAP.md` — PDF-checked structural map for all 15 lessons.

## Copyright / private source rule

Licensed textbook wording and original page images must not be stored in this public repository.

For older lessons, `original_questions` may remain the existing JSON array. CARS D may optionally store the same 12 questions in a wrapper so private visual/layout metadata can travel with the licensed source without adding a new database column:

```json
{
  "items": ["12 existing question records"],
  "meta": {
    "instruction": "private source instruction",
    "title": "private source title if needed",
    "visualQuestions": {
      "3": {
        "before": "private text printed above the diagram",
        "after": "private text printed below the diagram",
        "boxes": ["private box text 1", "private box text 2", ""]
      }
    }
  }
}
```

`cars-source-bridge.js` unwraps `items` before `main.js` receives the questions, so the current question engine remains backwards-compatible. `meta` is retained only in the browser as `window.CARS_SOURCE_META[lessonId]` for the shared renderer.

The renderer only draws a visual question when the private payload exists. If it is absent, the ordinary question UI remains unchanged rather than inventing missing textbook text.

## Supported passage/source layouts

- tale / standard story
- author profile with floated portrait
- science figure
- poem with side illustration
- two-page story
- biography with portrait + timeline
- feature/list with special heading typography
- two-column article
- journal inset with handwriting-style live text
- contest poster with live text

## Supported visual-question layouts

- `sequence`
- `cause-effect`
- `branch-map`

For a visual question, private metadata may provide `before` and `after`. The renderer then places the diagram between those two live text blocks, matching the source order instead of putting the whole prompt above or below the diagram.

## Post Test 2 poster

The poster is not a flattened image. Existing passage text remains real selectable/readable HTML so browser zoom and TTS continue to work. CSS reproduces the hierarchy (kicker, large headline, RULES, numbered rules and final callout), while the small tilted magazine/pencil is decorative art.

## Media path convention

Optional recreated art is looked up under:

```text
reading-world/assets/images/cars-level-d/{lessonId}-{mediaType}.png
```

Examples:

```text
cd4-moon-phases.png
cd7-edison-portrait.png
cd7-timeline.png
cd10-grandma-gift.png
cd15-rainforest-layers.png
```

Missing media files are silently ignored until the recreated art is ready. This lets the text/layout work ship independently from illustration production.
