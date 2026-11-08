import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const window = {};
vm.runInNewContext(readFileSync(new URL('planner-weekly-calendar.js', import.meta.url),'utf8'), {window, TextEncoder});
const id = '123e4567-e89b-12d3-a456-426614174000';
test('weekly calendar exports a recurring 19:00 Seoul reminder and a login-safe check-in link', () => {
  const raw = window.PlannerWeeklyCalendar.event('2027-01-03', id, new Date('2026-12-27T00:00:00Z'));
  for (const line of raw.split('\r\n')) assert.ok(Buffer.byteLength(line) <= 75);
  const unfolded = raw.replace(/\r\n /g, '');
  const lines = unfolded.split('\r\n');
  for (const value of ['BEGIN:VCALENDAR','UID:' + id + '@roadmap.gfieldacademy.net',
    'DTSTAMP:20261227T000000Z','DTSTART:20270103T100000Z','RRULE:FREQ=WEEKLY','BEGIN:VALARM',
    'TRIGGER:PT0M','ACTION:DISPLAY','URL:https://roadmap.gfieldacademy.net/roadmap/demo2/planner.html?weekly=1']) {
    assert.ok(lines.includes(value), value);
  }
  assert.ok(unfolded.endsWith('END:VEVENT\r\nEND:VCALENDAR\r\n'));
  assert.throws(() => window.PlannerWeeklyCalendar.event('2026-02-30', id));
  assert.throws(() => window.PlannerWeeklyCalendar.event('2026-11-07', 'broken\nuid'));
});
