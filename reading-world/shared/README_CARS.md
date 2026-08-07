# Reading World · CARS shared layout

CARS Level D uses a shared layout layer so textbook-like visual structures are not hard-coded separately in every lesson.

## Files

- `shared/cars-layout.css` — typography, poster layout, sequence/cause-effect/branch-map components, responsive rules.
- `shared/cars-components.js` — observes the Reading World screen and applies CARS D layout rules to the currently rendered lesson.
- `data/cars-d-layouts.js` — public layout metadata only: printed page groups, component type, blank position, step-number flags, and media hooks.

## Copyright / private source rule

Licensed textbook wording and original page images must not be stored in this public repository.

Visual-question wording is supplied through a private runtime object:

```js
window.CARS_VISUAL_DATA = {
  cd2: {
    questions: {
      3: {
        boxes: ['private box text 1', 'private box text 2', '']
      }
    }
  }
};
```

The shared renderer only draws a visual question when that private payload exists. If it is absent, the normal question UI remains unchanged rather than inventing missing textbook text.

## Supported layouts

- `sequence`
- `cause-effect`
- `branch-map`
- `poster`
- passage media hooks such as `moon-phases`, `timeline`, and `rainforest-layers`

## Post Test 2 poster

The poster is not a flattened image. Existing passage text remains real selectable/readable HTML so browser zoom and TTS continue to work. CSS changes the hierarchy (kicker, headline, RULES, numbered rules, final callout) and adds only decorative art.

## Media path convention

Optional recreated art is looked up under:

```text
reading-world/assets/images/cars-level-d/{lessonId}-{mediaType}.png
```

Examples:

```text
cd4-moon-phases.png
cd7-timeline.png
cd15-rainforest-layers.png
```

Missing media files are silently ignored until the recreated art is ready.
