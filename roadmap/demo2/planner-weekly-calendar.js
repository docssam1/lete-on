/* Local recurring calendar event. It contains no student or account data. */
(function (g) {
  'use strict';
  const plannerUrl = 'https://roadmap.gfieldacademy.net/roadmap/demo2/planner.html?weekly=1';
  const encoder = new TextEncoder();

  // iCalendar counts octets per content line, including a continuation's leading space.
  function folded(line) {
    const parts = [];
    let part = '', bytes = 0;
    for (const char of line) {
      const length = encoder.encode(char).length;
      if (bytes + length > 75) {
        parts.push(part);
        part = ' ';
        bytes = 1;
      }
      part += char;
      bytes += length;
    }
    return [...parts, part].join('\r\n');
  }

  function event(date, id, now = new Date()) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^[a-f0-9-]{36}$/i.test(id)) throw Error('주간 일정 정보를 확인해 주세요.');
    const start = new Date(date + 'T19:00:00+09:00');
    if (Number.isNaN(start.getTime()) || start.toISOString().slice(0, 10) !== date) throw Error('점검일을 확인해 주세요.');
    const stamp = instant => instant.toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
    return [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//GFIELD//Weekly Study//KO', 'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT', 'UID:' + id + '@roadmap.gfieldacademy.net', 'DTSTAMP:' + stamp(now),
      'DTSTART:' + stamp(start), 'DURATION:PT10M', 'RRULE:FREQ=WEEKLY', 'TRANSP:TRANSPARENT',
      'SUMMARY:지필드 주간 학습 점검',
      'DESCRIPTION:로드맵에서 교과·연산·사고력의 실제 학습 횟수를 기록하고 다음 주 분량을 정해 주세요.\\n' + plannerUrl,
      'URL:' + plannerUrl,
      'BEGIN:VALARM', 'ACTION:DISPLAY', 'TRIGGER:PT0M', 'DESCRIPTION:이번 주 학습을 돌아볼 시간이에요.',
      'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'
    ].map(folded).join('\r\n') + '\r\n';
  }

  function download(date, id) {
    const url = URL.createObjectURL(new Blob([event(date, id)], {type: 'text/calendar;charset=utf-8'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = '지필드-주간-학습-점검.ics';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  g.PlannerWeeklyCalendar = Object.freeze({event, download});
})(window);
