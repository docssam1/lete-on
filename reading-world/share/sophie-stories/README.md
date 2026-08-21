# Sophie's independent read-along

Direct-link-only story reader. This directory is intentionally not referenced by
Reading Town's library, map, daily-learning, or lesson catalog data.

- Reader: `reading-world/share/sophie-stories/index.html`
- Source text: `reading-world/share/sophie-stories/stories.json`
- Audio generator: `scripts/generate-share-reader-audio.js`
- Public audio: `audio/sophie-stories/story-1.mp3` and `story-2.mp3`
- Sentence timing: matching `story-1.timings.json` and `story-2.timings.json`

The generator uses the project's existing Google Cloud `en-US-Neural2-F` voice,
0.95 synthesis rate, Supabase `audio` bucket, and GitHub Actions secret.
