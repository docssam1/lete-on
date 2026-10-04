/* G1-13-15호 인쇄 — window.NM_NL_PRINT['위젯이름']={visual(p,K),label(p,K),ask(p,K)} (K = exam.js nlPrintKit).
   visual = HTML 문자열(K.nlCard(K.nlStage(…), K.nlAnsBox(…))), label = 정답지 말(null 이면 숫자 그대로), ask = 물음 줄.
   화면 위젯과 같은 모양은 NM_G1315(13-15.art.js)가 만든다(접두만 'nm-nl-g1315'). 흑백 레이저에서도 선이 또렷하게
   — 색은 쓰지 않고 1.3~1.5px 진한 선. 그림은 가로 70mm 이내·세로 40mm 안팎(check-weekly-sheets 지면 넘침 방지).
   스타일은 아래에서 <style> 로 직접 넣는다. */
(function () {
  'use strict';
  window.NM_NL_PRINT = window.NM_NL_PRINT || {};
  var P = window.NM_NL_PRINT, G = window.NM_G1315 || {}, PRE = 'nm-nl-g1315', INK = '#1F2A3A';

  var css = [
    '.nm-nl .' + PRE + '-ov{width:62mm;height:auto;display:block;margin:0 auto}',
    '.nm-nl .' + PRE + '-ovn,.nm-nl .' + PRE + '-an,.nm-nl .' + PRE + '-rv{font-size:9px;font-weight:700;fill:#000}',
    '.nm-nl .' + PRE + '-ovn{font-size:10px}',
    '.nm-nl .' + PRE + '-rs{font-size:7.5px;font-weight:700;fill:#000}',
    '.nm-nl .' + PRE + '-adl{font-size:8px;font-weight:700;fill:#000}',
    '.nm-nl .' + PRE + '-rn{font-size:9px;font-weight:700;fill:#000}',
    '.nm-nl .' + PRE + '-dart{width:44mm;height:auto;display:block;margin:0 auto}',
    '.nm-nl .' + PRE + '-chain{width:62mm;height:auto;display:block;margin:0 auto}',
    '.nm-nl .' + PRE + '-ring{width:46mm;height:auto;display:block;margin:0 auto}',
    '.nm-nl .' + PRE + '-rod{width:8mm;height:8mm;display:block}',
    '.nm-nl .' + PRE + '-head{display:flex;align-items:center;justify-content:center;gap:2mm;font-size:13px;font-weight:700;margin-bottom:1mm}',
    '.nm-nl .' + PRE + '-badge{display:inline-grid;place-items:center;min-width:8mm;height:8mm;padding:0 1mm;border:1.4px solid #1F2A3A;font-size:15px;font-weight:800}',
    '.nm-nl .' + PRE + '-badge.round{border-radius:50%}.nm-nl .' + PRE + '-badge.square{border-radius:1.6mm}',
    /* 칸 하나 */
    '.nm-nl .' + PRE + '-nb{display:inline-flex;align-items:center;justify-content:center;min-width:8.5mm;height:8.5mm;box-sizing:border-box;border:1.4px solid #1F2A3A;border-radius:1.6mm;font-size:16px;font-weight:700;padding:0 1mm}',
    '.nm-nl .' + PRE + '-nb.' + PRE + '-blank{border-style:dashed;min-width:9.5mm}',
    '.nm-nl .' + PRE + '-row{display:flex;align-items:center;justify-content:center;gap:1.6mm;font-size:16px;font-weight:700;flex-wrap:wrap}',
    '.nm-nl .' + PRE + '-row i{font-style:normal;font-size:15px}',
    '.nm-nl .' + PRE + '-col{display:flex;flex-direction:column;align-items:center;gap:1.4mm}',
    /* 분동·저울 */
    '.nm-nl .' + PRE + '-wrow{display:flex;gap:3mm;justify-content:center;align-items:flex-end}',
    '.nm-nl .' + PRE + '-wt1{display:flex;flex-direction:column;align-items:center;font-size:12px;font-weight:700}',
    '.nm-nl .' + PRE + '-wt1 .' + PRE + '-wsv{font-size:34px;line-height:1;display:block;width:1em;height:1em}',
    '.nm-nl .' + PRE + '-wt1 .' + PRE + '-wsv svg{display:block;width:1em;height:1em}',
    '.nm-nl .' + PRE + '-wt1 em{display:block;width:4.5mm;height:4.5mm;border:1.3px solid #1F2A3A;border-radius:50%;margin-top:.8mm}',
    '.nm-nl .' + PRE + '-bal{width:60mm;position:relative}',
    '.nm-nl .' + PRE + '-beam{height:0;border-top:2.4px solid #1F2A3A;margin:2mm 3mm 0}',
    '.nm-nl .' + PRE + '-pans{display:flex;justify-content:space-between}',
    '.nm-nl .' + PRE + '-bpan{width:46%;display:flex;flex-direction:column;align-items:center}',
    '.nm-nl .' + PRE + '-bpan:before{content:"";height:5mm;border-left:1.3px solid #1F2A3A}',
    '.nm-nl .' + PRE + '-items{display:flex;gap:1mm;align-items:flex-end;justify-content:center;min-height:11mm;flex-wrap:wrap}',
    '.nm-nl .' + PRE + '-dish{width:100%;height:3mm;border:1.4px solid #1F2A3A;border-top:0;border-radius:0 0 8mm 8mm}',
    '.nm-nl .' + PRE + '-obj,.nm-nl .' + PRE + '-wt{display:inline-grid;place-items:center;min-width:8mm;height:8mm;border:1.4px solid #1F2A3A;font-size:13px;font-weight:700;padding:0 1mm;box-sizing:border-box}',
    '.nm-nl .' + PRE + '-obj{border-radius:2.4mm;background:#eee}',
    '.nm-nl .' + PRE + '-wt{border-radius:1mm 1mm 0 0;background:#fff;min-width:7mm}',
    '.nm-nl .' + PRE + '-wt.' + PRE + '-blank{border-style:dashed}',
    /* 길·표·기차 */
    '.nm-nl .' + PRE + '-pgrid{display:grid;gap:2mm;justify-content:center}',
    '.nm-nl .' + PRE + '-pc{position:relative;width:9.5mm;height:9.5mm;border:1.4px solid #1F2A3A;border-radius:50%;display:grid;place-items:center;font-size:15px;font-weight:700;background:#fff}',
    '.nm-nl .' + PRE + '-pc em{position:absolute;left:50%;top:-4.4mm;transform:translateX(-50%);font-style:normal;font-size:12px;line-height:1}',
    '.nm-nl .' + PRE + '-pc.' + PRE + '-st{border-width:2.4px}.nm-nl .' + PRE + '-pc.' + PRE + '-gl{border-style:double;border-width:3px}',
    '.nm-nl .' + PRE + '-table{border-collapse:collapse;margin:0 auto}',
    '.nm-nl .' + PRE + '-table td{border:1.3px solid #1F2A3A;width:9mm;height:7.6mm;text-align:center;font-size:16px;font-weight:700;padding:0}',
    '.nm-nl .' + PRE + '-table td.' + PRE + '-blank{border-style:dashed;border-width:1.6px}',
    '.nm-nl .' + PRE + '-gtab{border-collapse:collapse;margin:0 auto}',
    '.nm-nl .' + PRE + '-gtab td{border:1.3px solid #1F2A3A;width:9mm;height:8mm;text-align:center;font-size:16px;font-weight:700;padding:0}',
    '.nm-nl .' + PRE + '-train{display:flex;flex-direction:column;gap:.6mm;align-items:flex-start}',
    '.nm-nl .' + PRE + '-trlinks{display:flex;margin-left:16.75mm}',
    '.nm-nl .' + PRE + '-linkw{width:10.5mm;display:flex;justify-content:center}',
    '.nm-nl .' + PRE + '-trcars{display:flex;align-items:flex-end}',
    '.nm-nl .' + PRE + '-eng{display:block;width:11.5mm;height:11.5mm;flex:none}',
    '.nm-nl .' + PRE + '-carw{position:relative;display:block;width:10.5mm;height:11.5mm;flex:none}',
    '.nm-nl .' + PRE + '-car{position:absolute;inset:0;display:block}',
    '.nm-nl .' + PRE + '-eng svg,.nm-nl .' + PRE + '-car svg{display:block;width:100%;height:100%}',
    '.nm-nl .' + PRE + '-tc{display:inline-grid;place-items:center;font-weight:700;font-size:14px}',
    '.nm-nl .' + PRE + '-tc-car{position:absolute;left:50%;top:1.8mm;transform:translateX(-50%);min-width:6.4mm;height:5.2mm;border:1.3px solid #1F2A3A;border-radius:1.2mm;background:#fff}',
    '.nm-nl .' + PRE + '-tc-link{width:7mm;height:7mm;border:1.4px solid #1F2A3A;border-radius:50%;background:#fff}',
    '.nm-nl .' + PRE + '-tc.' + PRE + '-blank{border-style:dashed}',
    /* 규칙·모양 */
    '.nm-nl .' + PRE + '-box{display:inline-flex;align-items:center;gap:1.6mm;border:1.4px solid #1F2A3A;border-radius:2mm;padding:1mm 3mm;font-size:13px;font-weight:700}',
    '.nm-nl .' + PRE + '-sym{display:inline-block;font-size:22px;line-height:1;font-weight:700;min-width:1em;text-align:center}',
    '.nm-nl .' + PRE + '-sym svg{display:block;width:1em;height:1em}',
    '.nm-nl .' + PRE + '-legend{display:flex;gap:6mm;justify-content:center;font-size:12px;font-weight:700;margin-bottom:1mm}',
    '.nm-nl .' + PRE + '-lgi{display:inline-flex;align-items:center;gap:1.2mm}',
    '.nm-nl .' + PRE + '-lgi svg{width:9mm;height:3mm}',
    '.nm-nl .' + PRE + '-lgi b{font-size:15px}',
    '.nm-nl .' + PRE + '-lgb{display:inline-block;width:6mm;height:6mm;border:1.4px dashed #1F2A3A;border-radius:1.2mm}',
    '.nm-nl .' + PRE + '-slw{display:inline-grid;place-items:center;width:10mm;height:10mm;border:1.6px solid #1F2A3A;border-radius:50%;font-size:18px;font-weight:800}',
    '.nm-nl .' + PRE + '-lines{display:flex;flex-direction:column;gap:1.2mm;align-items:center}',
    '.nm-nl .' + PRE + '-ex{color:#444}',
    /* 이야기 */
    '.nm-nl .' + PRE + '-story{font-size:13px;line-height:1.8;font-weight:600;text-align:left;max-width:62mm}',
    '.nm-nl .' + PRE + '-story .' + PRE + '-nb{min-width:7mm;height:6.4mm;vertical-align:middle;margin:0 .6mm}',
    '.nm-nl .' + PRE + '-pouch{display:flex;align-items:center;gap:2mm;justify-content:center;margin-top:1mm}',
    '.nm-nl .' + PRE + '-pouch .' + PRE + '-psv{display:block;width:11mm;height:11mm}',
    '.nm-nl .' + PRE + '-pouch .' + PRE + '-psv svg{display:block;width:100%;height:100%}',
    '.nm-nl .' + PRE + '-grp{display:inline-flex;flex-wrap:wrap;gap:.2mm;max-width:17mm;justify-content:center;font-size:17px}',
    '.nm-nl .' + PRE + '-grp span{display:inline-block;width:1em;height:1em}',
    '.nm-nl .' + PRE + '-grp svg{display:block;width:100%;height:100%}',
    '.nm-nl .' + PRE + '-qbox{display:inline-grid;place-items:center;width:10mm;height:10mm;border:1.6px dashed #1F2A3A;border-radius:1.6mm;font-size:16px;font-weight:800}',
    '.nm-nl .' + PRE + '-opts{display:flex;flex-direction:column;gap:1.4mm;align-items:stretch;width:64mm}',
    '.nm-nl .' + PRE + '-opt{display:flex;gap:1.6mm;align-items:center;border:1.3px solid #1F2A3A;border-radius:2mm;padding:.8mm 2mm;font-size:12px;font-weight:600;text-align:left;line-height:1.35}',
    '.nm-nl .' + PRE + '-opt.eq{justify-content:center;font-size:15px;font-weight:700}',
    '.nm-nl .' + PRE + '-opt em{font-style:normal;font-size:14px}',
    '.nm-nl .' + PRE + '-scene{display:flex;flex-direction:column;gap:.6mm;align-items:center;font-size:17px}',
    '.nm-nl .' + PRE + '-scene>div{display:flex;gap:.6mm}',
    '.nm-nl .' + PRE + '-scene span{display:inline-block;width:1em;height:1em}',
    '.nm-nl .' + PRE + '-scene svg{display:block;width:100%;height:100%}',
    '.nm-nl .' + PRE + '-und{text-decoration:underline;text-underline-offset:1mm;font-weight:800}',
    '.nm-nl .' + PRE + '-dbd{border-collapse:collapse;margin:0 auto}',
    '.nm-nl .' + PRE + '-dbd td{border:1.2px solid #1F2A3A;width:7.2mm;height:6.2mm;text-align:center;font-size:15px;font-weight:700;padding:0}',
    '.nm-nl .' + PRE + '-tally{border-collapse:collapse;margin:1mm auto 0;font-size:12px;font-weight:700}',
    '.nm-nl .' + PRE + '-tally td,.nm-nl .' + PRE + '-tally th{border:1.2px solid #1F2A3A;min-width:8mm;height:6mm;text-align:center;padding:0 1mm}',
    '.nm-nl .' + PRE + '-baskets{display:flex;gap:5mm;justify-content:center;margin-top:1mm}',
    '.nm-nl .' + PRE + '-bk{display:flex;align-items:center;gap:1mm;font-size:13px;font-weight:700}',
    '.nm-nl .' + PRE + '-bk i{display:inline-block;width:7mm;height:7mm;border:1.4px solid #1F2A3A;border-radius:50%}',
    '.nm-nl .' + PRE + '-stairs{display:flex;align-items:flex-end;gap:0;height:30mm}',
    '.nm-nl .' + PRE + '-stairs span{display:block;width:5.4mm;border:1.3px solid #1F2A3A;border-bottom:0;background:#fff;box-sizing:border-box}',
    '.nm-nl .' + PRE + '-ground{display:flex;flex-direction:column;align-items:center;font-size:11px;font-weight:700;margin-right:1mm}',
    '.nm-nl .' + PRE + '-ground .' + PRE + '-psv{display:block;width:8mm;height:8mm}',
    '.nm-nl .' + PRE + '-ground .' + PRE + '-psv svg{display:block;width:100%;height:100%}',
    '.nm-nl .' + PRE + '-rules{display:flex;gap:4mm;justify-content:center;font-size:12px;font-weight:700;margin-bottom:1mm}',
    '.nm-nl .' + PRE + '-rodtab{display:flex;gap:1.2mm;justify-content:center;margin-bottom:1mm}',
    '.nm-nl .' + PRE + '-rodtab>div{display:flex;flex-direction:column;align-items:center;font-size:11px;font-weight:700}',
    '.nm-nl .' + PRE + '-rodtab .' + PRE + '-rod{width:6mm;height:6mm}'
  ].join('\n');
  var st = document.createElement('style'); st.setAttribute('data-g1315', 'print'); st.textContent = css;
  document.head.appendChild(st);

  /* ── 공용 ── */
  var HB=function(n){return '013678'.indexOf(String(n))>=0;};
  function fixAsk(p, K) {
    var s = String(K.pickL(p.prompt) || '');
    return s.replace(/골라요/g, '써요').replace(/Pick the/g, 'Write the').replace(/Pick/g, 'Write').replace(/选出/g, '写出').replace(/点一点/g, '圈一圈');
  }
  function nb(v, K) { return '<span class="' + PRE + '-nb' + (v == null ? ' ' + PRE + '-blank' : '') + '">' + (v == null ? '' : K.esc(String(v))) + '</span>'; }
  function badge(v, round) { return '<span class="' + PRE + '-badge ' + (round ? 'round' : 'square') + '">' + v + '</span>'; }
  function box(K, extra) { return K.nlStage('<div class="' + PRE + '-col">' + extra + '</div>'); }
  function tokHtml(K, t) { return '<span class="' + PRE + '-psv">' + K.nlObjHtml(t) + '</span>'; }
  function sym(K, p, key) {
    var t = p.syms[key];
    return (p.kind === 'obj' || p.kind === 'sumdiff') ? '<span class="' + PRE + '-sym">' + K.nlObjHtml(t) + '</span>' : '<span class="' + PRE + '-sym">' + K.esc(t) + '</span>';
  }
  var CIRC = ['①', '②', '③'];

  /* ============ G1-13 ============ */
  P.overlapSum = {
    visual: function (p, K) {
      var sq = p.shape === 'square';
      var head = '<div class="' + PRE + '-head"><span>' + K.esc(sq ? K.lk('큰 네모 하나의 합', 'Sum of one big square', '一个大方块的和') : K.lk('큰 원 하나의 합', 'Sum of one big circle', '一个大圆的和')) + '</span>' + badge(p.target, sq) + '</div>';
      return K.nlCard(K.nlStage(head + G.overlapSvg(p, { pre: PRE, print: true })), '');
    },
    ask: function (p, K) {
      var sq = p.shape === 'square';
      return sq ? K.lk('큰 네모 하나 안의 수를 모두 더하면 ' + p.target + (HB(p.target)?'이에요':'예요') + '. 빈 칸에 올 수를 써요', 'Add up the numbers inside one big square — it makes ' + p.target + '. Write the number for the blank', '一个大方块里的数加起来是' + p.target + '。把空格里的数写出来')
        : K.lk('큰 원 하나 안의 수를 모두 더하면 ' + p.target + (HB(p.target)?'이에요':'예요') + '. 빈 칸에 올 수를 써요', 'Add up the numbers inside one big circle — it makes ' + p.target + '. Write the number for the blank', '一个大圆里的数加起来是' + p.target + '。把空格里的数写出来');
    }
  };

  P.weightPick = {
    visual: function (p, K) {
      var ws = p.weights.map(function (w) { return '<div class="' + PRE + '-wt1"><span class="' + PRE + '-wsv">' + K.nlObjHtml('g:weight') + '</span><b>' + w + 'g</b><em></em></div>'; }).join('');
      return K.nlCard(K.nlStage('<div class="' + PRE + '-head"><span>' + K.esc(K.lk('목표 무게', 'Target', '目标重量')) + '</span>' + badge(p.target + 'g', true) + '</div><div class="' + PRE + '-wrow">' + ws + '</div>'));
    },
    label: function (p, K) { return p.solutions.slice(0, 2).map(function (s) { return s.map(function (g) { return g + 'g'; }).join(' + '); }).join(K.lk('  또는  ', '  or  ', '  或  ')); },
    ask: function (p, K) {
      return K.lk('분동으로 ' + p.target + 'g을 만들어요. 필요한 분동에 ○표 해요', 'Make ' + p.target + ' g with the weights. Circle the weights you need', '用砝码凑成' + p.target + '克。把需要的砝码圈出来');
    }
  };

  P.balanceEq = {
    visual: function (p, K) {
      var pans = [0, 1].map(function (side) {
        var it = '';
        if (p.objSide === side) it += '<span class="' + PRE + '-obj">' + p.objW + 'g</span>';
        p.fixed.forEach(function (f) { if (f.side === side) it += '<span class="' + PRE + '-wt">' + f.w + 'g</span>'; });
        if (p.blank.side === side) it += '<span class="' + PRE + '-wt ' + PRE + '-blank" style="min-width:8mm;height:8mm"></span>';
        return '<div class="' + PRE + '-bpan"><div class="' + PRE + '-items">' + it + '</div><div class="' + PRE + '-dish"></div></div>';
      }).join('');
      return K.nlCard(K.nlStage('<div class="' + PRE + '-bal"><div class="' + PRE + '-beam"></div><div class="' + PRE + '-pans">' + pans + '</div></div>'), K.nlAnsBox('g'));
    },
    ask: function (p, K) { return K.lk('저울이 평평해요! 빈 분동은 몇 g일까요?', 'The scale is level! How many g is the blank weight?', '天平是平的！空白的砝码是几克？'); }
  };

  P.pathSum = {
    visual: function (p, K) {
      var grid = G.pathHtml(p, { pre: PRE, print: true, startTxt: '▶', goalTxt: '⚑' });
      var leg = '<div class="' + PRE + '-row" style="font-size:11px;gap:4mm;margin-top:1mm"><span>▶ ' + K.lk('출발', 'start', '起点') + '</span><span>⚑ ' + K.lk('도착', 'end', '终点') + '</span></div>';
      return K.nlCard(K.nlStage('<div style="padding-top:4mm">' + grid + '</div>' + leg), K.nlAnsBox(K.lk('합', '', '和')));
    },
    label: function (p, K) { return p.answer + ' (' + p.minPath.map(function (c) { return p.cells[c[0]][c[1]]; }).join('→') + ')'; },
    ask: function (p, K) {
      return K.lk('출발에서 도착까지 지나는 수를 더해요. 칸을 선으로 이어 합이 가장 작은 길을 찾고, 합을 써요',
        'Add the numbers on your way from start to finish. Draw the path with the smallest total, then write the total',
        '从起点走到终点，把经过的数加起来。画出和最小的路，再写下和');
    }
  };

  P.gridSum = {
    visual: function (p, K) {
      var h = '<table class="' + PRE + '-gtab">';
      p.grid.forEach(function (r) { h += '<tr>' + r.map(function (v) { return '<td>' + (v == null ? '' : v) + '</td>'; }).join('') + '</tr>'; });
      return K.nlCard(K.nlStage('<div class="' + PRE + '-head"><span>' + K.esc(K.lk('모든 줄의 합', 'Every line adds to', '每行每列的和')) + '</span>' + badge(p.T, true) + '</div>' + h + '</table>'));
    },
    label: function (p, K) { return p.blanks.map(function (b) { return p.sol[b[0]][b[1]]; }).join(', '); },
    ask: function (p, K) {
      return K.lk('가로줄과 세로줄의 합이 모두 ' + p.T + (HB(p.T)?'이':'가') + ' 되도록 빈 칸에 수를 써요', 'Write numbers in the blanks so every row and every column adds up to ' + p.T, '在空格里填数，让每一行、每一列的和都是' + p.T);
    }
  };

  P.crossPlace = {
    visual: function (p, K) {
      var c = function (k) { return nb(p.cells[k], K); };
      var cross = '<div class="' + PRE + '-col"><div class="' + PRE + '-row">' + c('u') + '</div><div class="' + PRE + '-row">' + c('l') + c('c') + c('r') + '</div><div class="' + PRE + '-row">' + c('d') + '</div></div>';
      var cards = '<div class="' + PRE + '-row" style="margin-top:1.4mm">' + p.nums.map(function (n) { return '<span class="' + PRE + '-nb">' + n + '</span>'; }).join('') + '</div>';
      return K.nlCard(K.nlStage('<div class="' + PRE + '-head"><span>' + K.esc(K.lk('가로 합 = 세로 합 =', 'Row sum = column sum =', '横和 = 竖和 =')) + '</span>' + badge(p.T, true) + '</div>' + cross + cards));
    },
    label: function (p, K) {
      var s = p.sol;
      return K.lk('위 ' + s.u + ' · 아래 ' + s.d + ' · 왼쪽 ' + s.l + ' · 오른쪽 ' + s.r + ' · 가운데 ' + s.c, 'top ' + s.u + ' · bottom ' + s.d + ' · left ' + s.l + ' · right ' + s.r + ' · middle ' + s.c, '上' + s.u + ' · 下' + s.d + ' · 左' + s.l + ' · 右' + s.r + ' · 中' + s.c) + K.lk(' (한 예)', ' (one example)', '（一例）');
    },
    ask: function (p, K) {
      return K.lk('1부터 5까지를 한 번씩 써서, 가로 세 수와 세로 세 수의 합이 모두 ' + p.T + (HB(p.T)?'이':'가') + ' 되게 해요', 'Use 1 to 5 once each so the row of three and the column of three both add to ' + p.T, '1到5各用一次，让横着三个数和竖着三个数的和都是' + p.T);
    }
  };

  P.pairUp = {
    visual: function (p, K) {
      var cards = '<div class="' + PRE + '-row">' + p.cards.map(function (n) { return '<span class="' + PRE + '-nb">' + n + '</span>'; }).join('') + '</div>';
      var lines = '';
      for (var i = 0; i < p.k; i++) {
        var pr = p.pairs[i];
        lines += '<div class="' + PRE + '-row">' + (i === 0 ? nb(pr[0], K) + '<i>+</i>' + nb(pr[1], K) + '<i>=</i>' + nb(p.T, K) : nb(null, K) + '<i>+</i>' + nb(null, K) + '<i>=</i>' + nb(null, K)) + '</div>';
      }
      return K.nlCard(K.nlStage('<div class="' + PRE + '-col">' + cards + '<div class="' + PRE + '-lines" style="margin-top:.8mm">' + lines + '</div></div>'));
    },
    label: function (p, K) { return p.pairs.map(function (q) { return q[0] + '+' + q[1]; }).join(', ') + K.lk(' (합 ', ' (sum ', '（和') + p.T + K.lk(')', ')', '）'); },
    ask: function (p, K) {
      return K.lk('카드를 두 장씩 묶어 식을 써요. 묶은 합이 모두 같아야 해요. 첫 줄은 예시예요', 'Pair up the cards two by two and write each pair. Every pair must add to the same number. The first line is an example', '把卡片两张两张配对，写成算式。每一对的和要相同。第一行是例子');
    }
  };

  P.ringSum = {
    visual: function (p, K) { return K.nlCard(K.nlStage(G.ringSvg(p, { pre: PRE, print: true }))); },
    label: function (p, K) { return p.blanks.map(function (i) { return p.sol[i]; }).join(', '); },
    ask: function (p, K) {
      return K.lk('네모의 변 위 수는 양쪽 꼭짓점의 합이에요. 빈 꼭짓점에 1~5 중 알맞은 수를 써요', 'Each side shows the sum of its two corners. Write a number from 1 to 5 in each empty corner', '每条边上的数是两端顶点的和。在空顶点里写1到5中合适的数');
    }
  };

  /* ============ G1-14 ============ */
  P.g15RuleTable = {
    visual: function (p, K) { return K.nlCard(K.nlStage(G.tableHtml(p, { pre: PRE, print: true }))); },
    ask: function (p, K) { return fixAsk(p, K); }
  };
  P.numberTrain = {
    visual: function (p, K) { return K.nlCard(K.nlStage(G.trainHtml(p, { pre: PRE, print: true }))); },
    ask: function (p, K) { return fixAsk(p, K); }
  };

  P.promiseBox = {
    visual: function (p, K) {
      var rules = window.NM_G1315_PRULES || {};
      var rt = p.ruleShown && rules[p.ruleShown] ? K.pickL(rules[p.ruleShown].t) : '';
      var top = '<div class="' + PRE + '-box"><span style="font-size:18px">' + K.esc(p.sym) + '</span> <span>' + K.esc(K.lk('약속', 'secret rule', '约定')) + '</span> ' + (p.ruleShown ? '<b>' + K.esc(rt) + '</b>' : '<span class="' + PRE + '-qbox" style="width:16mm;height:6mm"></span>') + '</div>';
      var lines = p.examples.map(function (e) { return '<div class="' + PRE + '-row ' + PRE + '-ex"><span>' + e[0] + '</span><i>' + K.esc(p.sym) + '</i><span>' + e[1] + '</span><i>=</i><b>' + e[2] + '</b></div>'; }).join('');
      var q = p.askPos === 'b'
        ? '<span>' + p.target[0] + '</span><i>' + K.esc(p.sym) + '</i><span class="' + PRE + '-qbox"></span><i>=</i><b>' + p.result + '</b>'
        : '<span>' + p.target[0] + '</span><i>' + K.esc(p.sym) + '</i><span>' + p.target[1] + '</span><i>=</i><span class="' + PRE + '-qbox"></span>';
      return K.nlCard(K.nlStage('<div class="' + PRE + '-col">' + top + '<div class="' + PRE + '-lines">' + lines + '<div class="' + PRE + '-row">' + q + '</div></div></div>'));
    },
    label: function (p, K) {
      var rules = window.NM_G1315_PRULES || {}, r = rules[p.rule];
      return p.answer + (r ? K.lk('  (규칙: ', '  (rule: ', '  （规则：') + K.pickL(r.t) + K.lk(')', ')', '）') : '');
    },
    ask: function (p, K) {
      if (p.ruleShown) return K.lk(p.sym + '는 약속이에요. 약속대로 앞 수와 뒤 수를 계산해 써요', p.sym + ' is a rule. Work it out and write the result', p.sym + '是个约定。按约定计算并写出结果');
      return p.askPos === 'b'
        ? K.lk(p.sym + '는 비밀 규칙이에요. 예시에서 규칙을 찾아 빈 칸에 알맞은 수를 써요', p.sym + ' has a secret rule. Find it in the examples and write the missing number', p.sym + '有个秘密规则。从例子里找出规则，写出空格里的数')
        : K.lk(p.sym + '는 비밀 규칙이에요. 예시에서 규칙을 찾아 마지막 식을 계산해 써요', p.sym + ' has a secret rule. Find it in the examples and solve the last one', p.sym + '有个秘密规则。从例子里找出规则，算出最后一题');
    }
  };

  P.shapeEq = {
    visual: function (p, K) {
      var term = function (t) { return typeof t === 'number' ? '<span class="' + PRE + '-sym" style="font-size:18px">' + t + '</span>' : (t === '+' || t === '-') ? '<i>' + (t === '+' ? '+' : '−') + '</i>' : sym(K, p, t); };
      var rows = p.eqs.map(function (e) { return '<div class="' + PRE + '-row">' + e.l.map(term).join('') + '<i>=</i>' + term(e.r) + '</div>'; }).join('');
      var asks = '<div class="' + PRE + '-row" style="gap:5mm;margin-top:1mm">' + p.ask.map(function (k) { return '<span class="' + PRE + '-row" style="gap:1mm">' + sym(K, p, k) + '<i>=</i><span class="' + PRE + '-qbox"></span></span>'; }).join('') + '</div>';
      return K.nlCard(K.nlStage('<div class="' + PRE + '-col"><div class="' + PRE + '-lines">' + rows + '</div>' + asks + '</div>'));
    },
    label: function (p, K) { return p.ask.map(function (k) { return p.vals[k]; }).join(', '); },
    ask: function (p, K) {
      var obj = p.kind === 'obj' || p.kind === 'sumdiff';
      return obj ? K.lk('같은 그림은 같은 수예요. 빈 칸에 알맞은 수를 써요', 'Same picture, same number. Write the number for each blank', '相同的图案代表相同的数。把空格里的数写出来')
        : K.lk('같은 모양은 같은 수예요. 빈 칸에 알맞은 수를 써요', 'Same shape, same number. Write the number for each blank', '相同的形状代表相同的数。把空格里的数写出来');
    }
  };

  P.arrowChain = {
    visual: function (p, K) {
      var lg = G.chainLegend(p, { pre: PRE, print: true, lk: K.lk });
      return K.nlCard(K.nlStage(lg + G.chainSvg(p, { pre: PRE, print: true, uid: 2 })));
    },
    label: function (p, K) {
      if (p.askRule) return '+' + p.legend.a + ', −' + p.legend.b;
      return p.asks.map(function (i) { return p.vals[i]; }).join(', ');
    },
    ask: function (p, K) {
      var s = String(K.pickL(p.prompt) || '');
      return p.askRule ? s + K.lk(' (규칙 상자의 빈 칸에 써요)', ' (write them in the rule box)', '（写在规则框的空格里）') : s;
    }
  };

  P.splitList = {
    visual: function (p, K) {
      var rows = '<div class="' + PRE + '-row ' + PRE + '-ex">' + nb(p.example[0], K) + '<i>·</i>' + nb(p.example[1], K) + '</div>';
      for (var i = 0; i < p.k; i++) rows += '<div class="' + PRE + '-row">' + nb(null, K) + '<i>·</i>' + nb(null, K) + '</div>';
      var objs = p.emoji ? '<span class="' + PRE + '-grp" style="max-width:30mm">' + Array(p.whole + 1).join('<span>' + K.nlObjHtml(p.emoji) + '</span>') + '</span>' : '';
      return K.nlCard(K.nlStage('<div class="' + PRE + '-row" style="gap:3mm"><span class="' + PRE + '-slw">' + p.whole + '</span>' + objs + '</div><div class="' + PRE + '-lines" style="margin-top:1mm">' + rows + '</div>'),
        K.nlAnsBox(K.lk('가지', 'ways', '种')));
    },
    label: function (p, K) { return p.pairs.map(function (q) { return q[0] + '·' + q[1]; }).join(', ') + ' → ' + p.k + K.lk('가지', ' ways', '种'); },
    ask: function (p, K) { return K.pickL(p.prompt) + K.lk(' 빈 줄에 방법을 쓰고, 모두 몇 가지인지 써요', ' Write each way on a line, then how many ways in all', ' 把每种分法写在横线上，再写下一共几种'); }
  };

  P.seqGap = {
    visual: function (p, K) {
      var h = p.seq.map(function (v, i) { return nb(p.blanks.indexOf(i) >= 0 ? null : v, K) + (i < p.seq.length - 1 ? '<i>→</i>' : ''); }).join('');
      return K.nlCard(K.nlStage('<div class="' + PRE + '-row">' + h + '</div>'));
    },
    label: function (p, K) { return p.blanks.map(function (i) { return p.seq[i]; }).join(', '); },
    ask: function (p, K) { return fixAsk(p, K); }
  };

  P.rodNumeral = {
    visual: function (p, K) {
      var tab = '<div class="' + PRE + '-rodtab">';
      for (var n = 1; n <= 9; n++) tab += '<div>' + G.rodGlyph(n, { pre: PRE, print: true }) + '<b>' + n + '</b></div>';
      tab += '</div>';
      var g = function (n) { return '<span style="display:inline-block;width:11mm;height:11mm">' + G.rodGlyph(n, { pre: PRE, print: true }).replace(PRE + '-rod', PRE + '-rod" style="width:11mm;height:11mm') + '</span>'; };
      var ex = p.expr.glyph != null ? '<div class="' + PRE + '-row">' + g(p.expr.glyph) + '<i>=</i><span class="' + PRE + '-qbox"></span></div>'
        : '<div class="' + PRE + '-row">' + g(p.expr.a) + '<i>+</i>' + g(p.expr.b) + '<i>=</i><span class="' + PRE + '-qbox" style="width:12mm;height:12mm"></span></div>';
      return K.nlCard(K.nlStage('<div class="' + PRE + '-col">' + tab + ex + '</div>'));
    },
    ask: function (p, K) {
      return p.level === 'add' ? K.lk('막대 기호로 쓴 덧셈이에요. 결과를 막대 기호로 그려요', 'A sum written with rod signs. Draw the result with rod signs', '用棒形符号写的加法。用棒形符号画出结果')
        : K.lk('막대 기호는 어떤 수일까요? 위의 표를 보고 써요', 'Which number is this rod sign? Use the table and write it', '这个棒形符号是几？看上面的表写出来');
    }
  };

  /* ============ G1-15 ============ */
  P.storyFill = {
    visual: function (p, K) {
      var tpl = K.pickL(p.story);
      var story = K.esc(tpl).replace(/\{(\d)\}/g, function () { return nb(null, K); });
      var chips = '<div class="' + PRE + '-row">' + p.chips.map(function (v) { return '<span class="' + PRE + '-nb" style="border-radius:50%;min-width:8mm">' + v + '</span>'; }).join('') + '</div>';
      var pic = p.scene && p.scene.emoji ? '<span class="' + PRE + '-psv" style="display:inline-block;width:8mm;height:8mm;vertical-align:middle">' + K.nlObjHtml(p.scene.emoji) + '</span> ' : '';
      return K.nlCard(K.nlStage('<div class="' + PRE + '-story">' + pic + story + '</div><div class="' + PRE + '-pouch"><span class="' + PRE + '-psv">' + K.nlObjHtml('g:pouch') + '</span>' + chips + '</div>'));
    },
    label: function (p, K) { return p.sol.join(', '); },
    ask: function (p, K) { return K.lk('이야기에 알맞은 수를 주머니에서 찾아 빈 칸에 써요', 'Find the right number in the pouch for each blank in the story and write it', '从口袋里找出合适的数，写进故事的空格'); }
  };

  function groupHtml(K, tok, n) { var s = ''; for (var i = 0; i < n; i++) s += '<span>' + K.nlObjHtml(tok) + '</span>'; return '<span class="' + PRE + '-grp">' + s + '</span>'; }
  P.mysteryBox = {
    visual: function (p, K) {
      if (p.op === 'wrong') {
        var sub = p.intended === 'sub';
        var l1 = '<div class="' + PRE + '-row"><b>①</b><span class="' + PRE + '-qbox"></span><i>' + (sub ? '+' : '−') + '</i><span>' + p.k + '</span><i>=</i><span>' + p.mistakenResult + '</span></div>';
        var l2 = '<div class="' + PRE + '-row"><b>②</b><span class="' + PRE + '-qbox"></span><i>' + (sub ? '−' : '+') + '</i><span>' + p.k + '</span><i>=</i><span class="' + PRE + '-qbox"></span></div>';
        return K.nlCard(K.nlStage('<div class="' + PRE + '-lines" style="gap:2.4mm">' + l1 + l2 + '</div>'));
      }
      var q = '<span class="' + PRE + '-qbox" style="width:12mm;height:12mm">?</span>';
      var g1 = groupHtml(K, p.emoji, p.loose), g2 = groupHtml(K, p.emoji, p.total);
      var row = p.op === 'add' ? q + '<i>+</i>' + g1 + '<i>=</i>' + g2 : p.op === 'subL' ? g1 + '<i>−</i>' + q + '<i>=</i>' + g2 : q + '<i>−</i>' + g1 + '<i>=</i>' + g2;
      return K.nlCard(K.nlStage('<div class="' + PRE + '-col"><div class="' + PRE + '-row">' + row + '</div>' + (p.eq ? '<div class="' + PRE + '-row" style="font-size:15px">' + K.esc(p.eq) + '</div>' : '') + '</div>'), K.nlAnsBox(K.lk('개', '', '个')));
    },
    label: function (p, K) { return p.op === 'wrong' ? p.x + ', ' + p.final : null; },
    ask: function (p, K) { return K.pickL(p.prompt); }
  };

  P.eqChoice = {
    visual: function (p, K) {
      var stem = p.stem.kind === 'eq' ? '<div class="' + PRE + '-row" style="font-size:20px">' + K.esc(p.stem.txt) + '</div>' : '<div class="' + PRE + '-story">' + K.esc(p.stem[K.lk('ko', 'en', 'zh')] || p.stem.ko) + '</div>';
      var pic = p.emoji ? '<span class="' + PRE + '-psv" style="display:inline-block;width:9mm;height:9mm">' + K.nlObjHtml(p.emoji) + '</span>' : '';
      var opts = p.choices.map(function (c, i) {
        var t = c.kind === 'eq' ? c.txt : (c[K.lk('ko', 'en', 'zh')] || c.ko);
        return '<div class="' + PRE + '-opt' + (c.kind === 'eq' ? ' eq' : '') + '"><em>' + CIRC[i] + '</em><span>' + K.esc(t) + '</span></div>';
      }).join('');
      return K.nlCard(K.nlStage('<div class="' + PRE + '-col">' + pic + stem + '<div class="' + PRE + '-opts">' + opts + '</div></div>'));
    },
    label: function (p, K) { return CIRC[p.answer] + K.lk('번', '', '号'); },
    ask: function (p, K) {
      return p.stem.kind === 'eq' ? K.lk('식에 어울리는 이야기에 ○표 해요', 'Circle the story that fits the equation', '圈出和算式相配的故事') : K.lk('이야기에 맞는 식에 ○표 해요', 'Circle the number sentence that matches the story', '圈出和故事相符的算式');
    }
  };

  P.tapWrong = {
    visual: function (p, K) {
      var lg = K.lk('ko', 'en', 'zh');
      var scene = '<div class="' + PRE + '-scene">' + p.scene.items.map(function (it) { var s = ''; for (var i = 0; i < it.n; i++) s += '<span>' + K.nlObjHtml(it.e) + '</span>'; return '<div>' + s + '</div>'; }).join('') + '</div>';
      var tk = p.tokens[lg] || p.tokens.ko;
      var sent = '<div class="' + PRE + '-story" style="text-align:center">' + tk.map(function (t) { return t.t != null ? K.esc(t.t) : '<span class="' + PRE + '-und">' + t.n + '</span>'; }).join('') + '</div>';
      return K.nlCard(K.nlStage('<div class="' + PRE + '-col">' + scene + sent + '</div>'), K.nlAnsBox(''));
    },
    label: function (p, K) { var lg = K.lk('ko', 'en', 'zh'); var w = (p.tokens[lg] || p.tokens.ko).find(function (t) { return t.wrong; }); return w.n + ' → ' + p.answer; },
    ask: function (p, K) { return K.lk('그림과 다른 곳을 찾아요! 틀린 수에 ○표 하고 바르게 고쳐 써요', "Find what doesn't match the picture! Circle the wrong number and write the right one", '找出和图不一样的地方！圈出错的数，再写出正确的数'); }
  };

  P.digitBoard = {
    visual: function (p, K) {
      var tb = '<table class="' + PRE + '-dbd">' + p.grid.map(function (r) { return '<tr>' + r.map(function (d) { return '<td>' + d + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
      var tally = '<table class="' + PRE + '-tally"><tr><th>' + K.esc(K.lk('숫자', 'Number', '数字')) + '</th>' + p.kinds.map(function (k) { return '<th>' + k + '</th>'; }).join('') + '</tr><tr><td>' + K.esc(K.lk('개수', 'Count', '个数')) + '</td>' + p.kinds.map(function () { return '<td></td>'; }).join('') + '</tr></table>';
      return K.nlCard(K.nlStage('<div class="' + PRE + '-col">' + tb + tally + '</div>'), K.nlAnsBox(p.ask === 'diff' ? K.lk('개', '', '个') : ''));
    },
    label: function (p, K) {
      var cnt = {}; [].concat.apply([], p.grid).forEach(function (d) { cnt[d] = (cnt[d] || 0) + 1; });
      return p.answer + '  (' + p.kinds.map(function (k) { return k + ':' + cnt[k]; }).join(' ') + ')';
    },
    ask: function (p, K) {
      return p.ask === 'most' ? K.lk('숫자판에서 가장 많이 나온 숫자는 무엇일까요? 표에 세어 써요', 'Which number shows up the most on the board? Count in the table, then write it', '数字板上出现最多的是哪个数？先在表里数一数再写出来')
        : p.ask === 'least' ? K.lk('숫자판에서 가장 적게 나온 숫자는 무엇일까요? 표에 세어 써요', 'Which number shows up the least on the board? Count in the table, then write it', '数字板上出现最少的是哪个数？先在表里数一数再写出来')
          : K.lk('가장 많이 나온 수와 가장 적게 나온 수는 몇 개 차이일까요? 표에 세어 써요', 'How many more is the most common number than the least common? Count in the table, then write it', '出现最多的数比出现最少的数多几个？先在表里数一数再写出来');
    }
  };

  P.dartTarget = {
    visual: function (p, K) {
      var extra = p.ask === 'missing' ? '<div class="' + PRE + '-head"><span>' + K.esc(K.lk('모두 합쳐', 'Total', '一共')) + '</span>' + badge(p.total, true) + '<span style="font-size:20px">☁ ?</span></div>' : '';
      return K.nlCard(K.nlStage('<div class="' + PRE + '-col">' + extra + G.dartSvg(p, { pre: PRE, print: true }) + '</div>'), K.nlAnsBox(K.lk('점', '', '分')));
    },
    label: function (p, K) {
      var known = p.hits.map(function (h) { return h.ring; });
      return p.ask === 'sum' ? known.join(' + ') + ' = ' + p.answer : known.join(' + ') + ' + ' + p.answer + ' = ' + p.total;
    },
    ask: function (p, K) { return K.pickL(p.prompt); }
  };

  P.sortBasket3 = {
    visual: function (p, K) {
      var chips = K.nlGlyphRows(p.items.map(function (it) { return it.e; }), 6);
      var bks = '<div class="' + PRE + '-baskets">' + p.baskets.map(function (b) { return '<div class="' + PRE + '-bk"><span style="font-size:22px">🧺</span>' + K.esc(K.nlObjHtml ? '' : '') + '<span class="' + PRE + '-psv" style="display:inline-block;width:6mm;height:6mm">' + K.nlObjHtml(b.emoji) + '</span>' + (p.askMode === 'diff' ? '' : '<i></i>') + '</div>'; }).join('') + '</div>';
      return K.nlCard(K.nlStage(chips + bks), p.askMode === 'diff' ? K.nlAnsBox(K.lk('개', '', '个')) : '');
    },
    label: function (p, K) {
      if (p.askMode === 'diff') return String(p.answer) + '  (' + p.counts.join(', ') + ')';
      return K.lk('바구니 ', 'basket ', '篮子 ') + CIRC[p.answer] + '  (' + p.counts.join(', ') + ')';
    },
    ask: function (p, K) {
      return p.askMode === 'diff' ? K.lk('세 종류를 바구니에 나눠 세어요. 가장 많은 것과 가장 적은 것은 몇 개 차이일까요?', 'Sort and count the three kinds. How many more is the biggest group than the smallest?', '把三种东西分类数一数。最多的比最少的多几个？')
        : p.askMode === 'most' ? K.lk('세 종류를 나눠 세어요. 가장 많은 바구니에 ○표 해요', 'Sort and count the three kinds. Circle the basket with the most', '把三种东西分类数一数。圈出最多的篮子')
          : K.lk('세 종류를 나눠 세어요. 가장 적은 바구니에 ○표 해요', 'Sort and count the three kinds. Circle the basket with the fewest', '把三种东西分类数一数。圈出最少的篮子');
    }
  };

  P.stairsGame = {
    visual: function (p, K) {
      var g = p.game, bars = '';
      for (var i = 0; i < p.total; i++) bars += '<span style="height:' + (3.2 + i * 3) + 'mm"></span>';
      var rules = '<div class="' + PRE + '-rules"><span>⬆ ' + g.up + '</span>' + (g.losses ? '<span>⬇ ' + g.down + '</span>' : '') + '</div>';
      var ground = '<div class="' + PRE + '-ground"><span class="' + PRE + '-psv">' + K.nlObjHtml(p.emoji) + '</span><span>' + K.esc(K.lk('출발', 'Start', '出发')) + '</span></div>';
      return K.nlCard(K.nlStage(rules + '<div style="display:flex;align-items:flex-end;justify-content:center">' + ground + '<div class="' + PRE + '-stairs">' + bars + '</div></div>'), K.nlAnsBox(K.lk('째 계단', 'th step', '级')));
    },
    ask: function (p, K) { return K.pickL(p.prompt); }
  };

  P.ageStory = {
    visual: function (p, K) {
      var chars = '<div class="' + PRE + '-row" style="gap:4mm;font-size:30px">' + p.chars.map(function (c, i) {
        return '<span class="' + PRE + '-col" style="gap:.4mm"><span class="' + PRE + '-psv" style="display:inline-block;width:11mm;height:11mm">' + K.nlObjHtml(c) + '</span>' + (p.interaction === 'tap' ? '<b style="font-size:14px">' + CIRC[i] + '</b>' : '') + '</span>';
      }).join('') + '</div>';
      return K.nlCard(K.nlStage(chars), p.interaction === 'tap' ? '' : K.nlAnsBox(K.lk('살', '', '岁')));
    },
    label: function (p, K) {
      if (p.interaction !== 'tap') return null;
      return K.lk('왼쪽에서 ', 'No. ', '第') + (p.targetIndex + 1) + K.lk('번째', '', '个') + '  ' + CIRC[p.targetIndex];
    },
    ask: function (p, K) {
      return String(K.pickL(p.prompt) || '').replace('를 콕! 짚어요', '에 ○표 해요').replace('Tap the', 'Circle the').replace('点一点', '圈出');
    }
  };
})();
