import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('./account-reel.js', import.meta.url), 'utf8');
const settle = () => new Promise(resolve => setImmediate(resolve));
function fixture({ preference, reduced = false, storageBlocked = false, playback } = {}) {
  class Events {
    constructor() { this.listeners = new Map(); this.hidden = false; this.attributes = {}; }
    addEventListener(type, fn) { this.listeners.set(type, [...(this.listeners.get(type) || []), fn]); }
    emit(type, data = {}) { for (const fn of this.listeners.get(type) || []) fn({ type, ...data }); }
    setAttribute(name, value) { this.attributes[name] = value; }
  }
  const video = new Events();
  Object.assign(video, { paused: true, ended: false, muted: true, volume: 1, calls: [], pauses: 0 });
  video.play = () => {
    video.calls.push(video.muted);
    const result = playback?.(video);
    if (result) return result.then(() => { video.paused = false; video.emit('play'); });
    video.paused = false;
    video.emit('play');
    return Promise.resolve();
  };
  video.pause = () => { video.paused = true; video.pauses++; video.emit('pause'); };
  const nodes = Object.fromEntries(['#reelPlay', '#reelSound', '#reelAudioHint', '.member-reel-controls a', '.member-reel-fallback', '.member-reel-controls'].map(key => [key, new Events()]));
  nodes['#growthReel'] = video;
  const document = new Events(); document.querySelector = key => nodes[key];
  const motion = new Events(); motion.matches = reduced;
  const compact = new Events(); compact.matches = false;
  const store = new Map(preference ? [['gfield.roadmap.intro.sound', preference]] : []);
  let observe;
  const window = { matchMedia: query => query.includes('prefers-reduced-motion') ? motion : compact, IntersectionObserver: true };
  class IntersectionObserver { constructor(fn) { observe = fn; } observe() {} }
  const localStorage = {
    getItem: key => { if (storageBlocked) throw new Error('denied'); return store.get(key) ?? null; },
    setItem: (key, val) => { if (storageBlocked) throw new Error('denied'); store.set(key, val); }
  };
  vm.runInNewContext(source, { window, document, IntersectionObserver, localStorage });
  const gesture = (type = 'click', target, key) => document.emit(type, { isTrusted: true, target: { closest: () => target }, key });
  return { video, nodes, document, motion, store, gesture, intersect: value => observe([{ isIntersecting: value }]) };
}
const denied = () => Promise.reject(Object.assign(new Error('autoplay denied'), { name: 'NotAllowedError' }));

test('audible autoplay starts at moderate volume when permitted', async () => {
  const f = fixture(); await settle();
  assert.deepEqual(f.video.calls, [false]);
  assert.equal(f.video.volume, .3);
  assert.equal(f.nodes['#reelSound'].attributes['aria-pressed'], 'true');
  assert.equal(f.nodes['#reelAudioHint'].hidden, true);
});

test('blocked sound falls back to muted video, then starts on a trusted interaction', async () => {
  let allow = false;
  const f = fixture({ playback: video => !video.muted && !allow ? denied() : undefined });
  await settle();
  assert.deepEqual(f.video.calls, [false, true]);
  assert.equal(f.video.paused, false);
  assert.equal(f.nodes['#reelAudioHint'].hidden, false);
  f.gesture('keydown', null, 'Tab'); await settle();
  assert.equal(f.video.calls.length, 2);
  f.intersect(false); f.intersect(true); await settle();
  assert.equal(f.nodes['#reelAudioHint'].hidden, false, 'resuming muted must retain the pending sound choice');
  allow = true; f.gesture(); await settle();
  assert.equal(f.video.muted, false);
  assert.equal(f.nodes['#reelAudioHint'].hidden, true);
});

test('explicit mute survives navigation and cannot be undone by incidental gestures', async () => {
  const f = fixture({ preference: 'off' }); await settle();
  assert.deepEqual(f.video.calls, [true]);
  f.gesture(); await settle(); assert.equal(f.video.muted, true);
  f.nodes['#reelSound'].emit('click'); await settle();
  assert.equal(f.video.muted, false);
  assert.equal(f.store.get('gfield.roadmap.intro.sound'), 'on');
  f.nodes['#reelSound'].emit('click'); f.gesture(); await settle();
  assert.equal(f.video.muted, true);
  assert.equal(f.store.get('gfield.roadmap.intro.sound'), 'off');
});

test('sound and play controls do not also activate the global first-touch handler', async () => {
  let allow = false;
  const f = fixture({ playback: video => !video.muted && !allow ? denied() : undefined }); await settle();
  allow = true;
  f.gesture('click', f.nodes['#reelSound']);
  assert.equal(f.video.calls.length, 2);
  f.nodes['#reelSound'].emit('click'); await settle();
  assert.deepEqual(f.video.calls, [false, true, false]);
});

test('a manual pause remains paused after leaving and returning to the video', async () => {
  const f = fixture(); await settle(); f.nodes['#reelPlay'].emit('click');
  f.intersect(false); f.intersect(true);
  f.document.hidden = true; f.document.emit('visibilitychange');
  f.document.hidden = false; f.document.emit('visibilitychange'); await settle();
  assert.equal(f.video.paused, true);
  assert.equal(f.video.calls.length, 1);
});

test('reduced motion suppresses autoplay but permits the explicit play control', async () => {
  const f = fixture({ reduced: true }); await settle();
  assert.equal(f.video.calls.length, 0);
  f.gesture(); await settle(); assert.equal(f.video.calls.length, 0);
  f.nodes['#reelPlay'].emit('click'); await settle(); assert.equal(f.video.paused, false);
  f.motion.emit('change', { matches: true }); assert.equal(f.video.paused, true);
});

test('a stale denial cannot restart playback after the tab is hidden', async () => {
  let reject;
  const f = fixture({ playback: () => new Promise((resolve, failure) => { reject = failure; }) });
  f.document.hidden = true; f.document.emit('visibilitychange');
  reject(Object.assign(new Error('denied'), { name: 'NotAllowedError' })); await settle();
  assert.equal(f.video.calls.length, 1);
  assert.equal(f.video.paused, true);
});

test('unavailable storage and a failed video leave a readable image fallback', async () => {
  const f = fixture({ storageBlocked: true }); await settle();
  f.nodes['#reelSound'].emit('click');
  f.video.emit('error');
  assert.equal(f.video.hidden, true);
  assert.equal(f.video.paused, true);
  assert.equal(f.nodes['.member-reel-fallback'].hidden, false);
  assert.equal(f.nodes['.member-reel-controls'].hidden, true);
  f.intersect(false); f.intersect(true); await settle();
  assert.equal(f.video.calls.length, 1);
});
