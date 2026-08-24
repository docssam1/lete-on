# CARS D private OCR/source metadata schema

Licensed wording stays in Supabase. Public Git stores only the renderer and this **placeholder-only** schema.

`lesson_content.original_questions` may remain a plain 12-question array, or use the following object shape:

```js
{
  "items": [/* the existing 12 question rows */],
  "meta": {
    "instruction": "<private OCR instruction text>",
    "title": "<private passage title when needed>",
    "columnBreakAfterParagraph": 3,
    "media": [],
    "visualQuestions": {}
  }
}
```

## Special question: sequence

```js
"visualQuestions": {
  "3": {
    "before": "<private prompt text before the diagram>",
    "boxes": [
      "<OCR box 1 text>",
      "<OCR box 2 text>",
      ""
    ],
    "after": "<private prompt text after the diagram>"
  }
}
```

The public `cars-d-layouts.js` decides which box is blank. Do not put answer markings into `boxes`.

## Special question: cause/effect

```js
"visualQuestions": {
  "4": {
    "before": "<private intro>",
    "causeLabel": "Cause",
    "effectLabel": "Effect",
    "cause": "<OCR cause-box text>",
    "effect": "",
    "after": "<private follow-up question>"
  }
}
```

## Special question: branch map

```js
"visualQuestions": {
  "2": {
    "before": "<private intro>",
    "root": "<OCR root label>",
    "children": [
      "<OCR child 1>",
      "",
      "<OCR child 3>",
      "<OCR child 4>"
    ],
    "after": "<private follow-up question>"
  }
}
```

## Edison-style live HTML timeline

The timeline is not flattened into a screenshot. Supply text through private media metadata:

```js
"media": [
  {
    "type": "timeline",
    "render": "html-timeline",
    "items": [
      {"year":"<year>","text":"<OCR timeline text>","side":"top"},
      {"year":"<year>","text":"<OCR timeline text>","side":"bottom"}
    ]
  }
]
```

## Exact two-column split

For two-column pages, supply the paragraph index after which the left column ends:

```js
"columnBreakAfterParagraph": 4
```

This keeps OCR text as live HTML while allowing a recreated illustration to be placed at the top of the right column. If this field is absent, the renderer falls back to normal CSS columns.

## Private import workflow

Keep the completed metadata JSON outside the repository, then merge it into the existing Supabase rows with:

```bash
SUPABASE_URL=... SUPABASE_KEY=... \
  node scripts/apply-cars-d-private-meta.js /private/path/cars-d-private-meta.json
```

The first run is a dry-run. Add `--apply` only after all 15 rows validate. Apply mode writes a local rollback backup before it patches any row. The importer does not print the private OCR wording to the console and preserves the existing 12 question items.

The repository `.gitignore` excludes `*.cars-d-private-meta.json` and `*.cars-d-meta-backup.json` so licensed metadata and rollback snapshots are not accidentally committed.

## Images

Recreated images are separate assets. They must not contain answer circles, handwriting, page numbers, copyright lines, or scanned textbook text. Text that students need to read should stay in HTML whenever practical.
