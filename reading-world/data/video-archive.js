// Screen Quest — archive of PAST weekly video plans for G-FIELD Reading Town.
//
// This is an append-only list. Each element has the SAME shape as
// window.VIDEO_PLAN (its own `week`, `sections`, `days`, and `videos` map).
// The weekly Screen Quest updater PREPENDS the outgoing week to the front of
// this array (most recent first) BEFORE it overwrites data/video-plan.js with
// the new week. This way completed past weeks are preserved and stay browsable
// in the 자료실 (Library) view instead of being lost each week.
//
// Newest week first. Leave as an empty array until the first week rolls over.
window.VIDEO_ARCHIVE = [];
