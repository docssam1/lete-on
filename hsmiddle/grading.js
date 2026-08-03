/* hsmiddle 공용 채점기
   원칙: 관대하되 정답만 통과 — 애매하면 오답 유지.
   window.HSMIDDLE_GRADING.isCorrect(q, rawValue)
     q        : D.questions 항목 [번호, 정답, 난이도, 학기, 영역, 유형, videoStart]
     rawValue : 학생이 입력한 원본 문자열
*/
(function (root) {
  'use strict';

  var UNIT_TAILS = ['km', 'kg', 'cm', '자리', '점', '개', '쌍', '대', '도', '원', '%', 'm', 'l']
    .sort(function (a, b) { return b.length - a.length; });

  function toHalfWidth(s) {
    return s.replace(/[！-～]/g, function (ch) {
      return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0);
    }).replace(/　/g, ' ');
  }

  function stripUnitTail(s) {
    for (var i = 0; i < UNIT_TAILS.length; i++) {
      var u = UNIT_TAILS[i];
      if (s.length > u.length && s.slice(-u.length) === u) {
        return s.slice(0, -u.length);
      }
    }
    return s;
  }

  /* 공통 정규화: trim, 전각->반각, 소문자화, 내부 공백 제거, 단위 꿀리 제거 */
  function normBase(raw) {
    var s = toHalfWidth(String(raw == null ? '' : raw)).trim().toLowerCase();
    s = s.replace(/\s+/g, '');
    s = stripUnitTail(s);
    return s;
  }

  function isBlank(raw) {
    return raw == null || String(raw).trim() === '';
  }

  /* ---- 시각형 (7, 27번) ---- */
  function parseTime(raw) {
    var s = toHalfWidth(String(raw == null ? '' : raw)).trim().toLowerCase().replace(/\s+/g, '');
    var meridiem = null;
    var m = s.match(/^(오전|오후|am|pm)/);
    if (m) {
      meridiem = (m[1] === '오전' || m[1] === 'am') ? 'am' : 'pm';
      s = s.slice(m[1].length);
    }
    s = s.replace(/시|분|초/g, ':');
    var parts = s.split(':').filter(function (p) { return p !== ''; });
    if (!parts.length) return null;
    var nums = parts.map(Number);
    if (nums.some(function (n) { return isNaN(n); })) return null;
    return {
      meridiem: meridiem,
      h: nums[0] || 0,
      m: nums[1] || 0,
      s: nums[2] || 0
    };
  }

  function timeEqual(a, b) {
    if (!a || !b) return false;
    if (a.meridiem !== b.meridiem) return false;
    return a.h === b.h && a.m === b.m && a.s === b.s;
  }

  /* ---- 집합/순서형 토큰 분리 ---- */
  function tokens(raw) {
    return String(raw == null ? '' : raw)
      .split(/[,\s\n]+/)
      .map(function (t) { return normBase(t); })
      .filter(function (t) { return t !== ''; });
  }

  function setEqualUnordered(a, b) {
    if (a.length !== b.length) return false;
    var sa = a.slice().sort(), sb = b.slice().sort();
    return sa.every(function (v, i) { return v === sb[i]; });
  }

  function setEqualOrdered(a, b) {
    if (a.length !== b.length) return false;
    return a.every(function (v, i) { return v === b[i]; });
  }

  /* ---- 분수형 (24, 38번) ---- */
  function parseFraction(raw) {
    var s = normBase(raw).replace(/,/g, '');
    var m = s.match(/^(-?\d+)\/(-?\d+)$/);
    if (m) return { num: m[1], den: m[2] };
    m = s.match(/^(-?\d+)분의(-?\d+)$/);
    if (m) return { num: m[2], den: m[1] };
    return null;
  }

  function fractionEqual(a, b) {
    if (!a || !b) return false;
    return a.num === b.num && a.den === b.den;
  }

  /* ---- 수치형 판정 ---- */
  function numericEqual(rawA, rawB) {
    var a = normBase(rawA).replace(/,/g, '');
    var b = normBase(rawB).replace(/,/g, '');
    if (a === '' || b === '') return false;
    if (/e/.test(a) !== /e/.test(b)) {
      /* 지수 표기 유무가 다르면(정밀도 손실 우려) 문자열이 완전히 같을 때만 통과 */
      return a === b;
    }
    var fa = parseFloat(a), fb = parseFloat(b);
    if (!isNaN(fa) && !isNaN(fb) && String(fa) !== 'NaN' && String(fb) !== 'NaN') {
      /* 순수 숫자 형태일 때만 수치 비교 (문자 섞인 값은 문자열 비교로 유지) */
      if (/^-?\d*\.?\d+$/.test(a) && /^-?\d*\.?\d+$/.test(b)) {
        return fa === fb;
      }
    }
    return a === b;
  }

  function isCorrect(q, rawValue) {
    if (isBlank(rawValue)) return false;
    var qNum = q[0];
    var correct = q[1];

    /* 1번: 지수 표기 등 정밀도 손실을 막기 위해 항상 순수 문자열 비교 */
    if (qNum === 1) {
      return normBase(rawValue).replace(/,/g, '') === normBase(correct).replace(/,/g, '');
    }

    /* 시각형 */
    if (qNum === 7 || qNum === 27) {
      return timeEqual(parseTime(rawValue), parseTime(correct));
    }

    /* 집합형: 순서 무시 (12, 33번) */
    if (qNum === 12 || qNum === 33) {
      return setEqualUnordered(tokens(rawValue), tokens(correct));
    }

    /* 집합형: 순서 유지 (16, 18번) */
    if (qNum === 16 || qNum === 18) {
      return setEqualOrdered(tokens(rawValue), tokens(correct));
    }

    /* 순서형 (20번) */
    if (qNum === 20) {
      return normBase(rawValue).replace(/,/g, '') === normBase(correct).replace(/,/g, '');
    }

    /* 분수형 (24, 38번): 기약분수 표기 그대로 요구, 수치 동치 불인정 */
    if (qNum === 24 || qNum === 38) {
      var fa = parseFraction(rawValue), fb = parseFraction(correct);
      if (fa && fb) return fractionEqual(fa, fb);
      return normBase(rawValue) === normBase(correct);
    }

    /* 그 외: 수치형 우선, 아니면 문자열 비교 */
    return numericEqual(rawValue, correct);
  }

  root.HSMIDDLE_GRADING = { isCorrect: isCorrect, _internal: { normBase: normBase, parseTime: parseTime, tokens: tokens, parseFraction: parseFraction } };
})(typeof window !== 'undefined' ? window : globalThis);
