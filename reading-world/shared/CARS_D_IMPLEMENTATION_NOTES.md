# CARS D implementation notes

Stage 2 focuses on source structure before recreated illustrations are added.

- Source page mapping was checked against the uploaded 65-page PDF, not OCR alone.
- The generic Level B fallback illustration is suppressed for CARS D originals.
- Source instruction/title hierarchy is separate from the app navigation title.
- Two-column articles collapse to one column on small screens.
- Benchmark 5 journal text stays live HTML and may contain a separately recreated gift illustration.
- Post Test 2 remains a poster visually while its meaningful text stays selectable and TTS-readable.
- Special visual questions render only when the private Supabase payload supplies their box wording.
- The private payload can split a visual question into text-before / diagram / text-after so source order is preserved.
- Recreated illustration filenames follow `assets/images/cars-level-d/{lessonId}-{mediaType}.png`.
