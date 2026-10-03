#!/usr/bin/env node
'use strict';
/* Fixed 20-item diagnosis contract. No server, browser installation, or writes.
 * Default: 100 seeds for all 8 foundation stages and 20 spread-out courses.
 * --quick runs 3 seeds / 5 courses while developing; it is not the full gate.
 * Browser parity means the same source in a browser-like VM, not rendered UI.
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const PLAN_FILE = 'data/placement-plan.js';
const QUICK = process.argv.includes('--quick');
const SEEDS = QUICK ? 3 : 100;
const COURSE_LIMIT = QUICK ? 5 : 20;
const FOUNDATION_IDS = [
  'f-count5', 'f-quantity5', 'f-compare5', 'f-order10',
  'f-split5', 'f-split9', 'f-join9', 'f-ten10'
];
const COUNTS = { previous: 6, current: 10, next: 4 };
const BANDS = Object.keys(COUNTS);
const plain = value => JSON.parse(JSON.stringify(value));
const same = (actual, expected, label) => assert.deepStrictEqual(plain(actual), plain(expected), label);
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');

// Preserve the application's generator order, including shared helper setup.
const generatorFiles = [...read('index.html').matchAll(/<script\s+[^>]*src=["']([^"']+)["']/g)]
  .map(match => match[1].split('?')[0])
  .filter(file => /^engine\/(?:generators\.js|rng\.js|threads\/[^/]+\.js)$/.test(file));
assert(generatorFiles.includes('engine/rng.js'), 'loader: RNG script is missing');
assert(generatorFiles.includes('engine/threads/nl.js'), 'loader: foundation generators are missing');
const unitFiles = fs.readdirSync(path.join(ROOT, 'data/units'))
  .filter(file => file.endsWith('.js')).sort().map(file => 'data/units/' + file);
const sourceFiles = [...new Set([...generatorFiles,
  'data/curriculum.js', 'data/threads.js', 'data/middle-pacing.js',
  'data/wordable.js', 'data/courses.js', 'data/stages.js', ...unitFiles])];
const learningLevels = world => Object.fromEntries(Object.entries(world.NM_THREADS)
  .map(([id, thread]) => [id, (thread.levels || []).map(level => ({ id: level.id, params: level.params }))]));

function loadNode(){
  global.window = global;
  sourceFiles.forEach(file => require(path.join(ROOT, file)));
  const levelsBefore = plain(learningLevels(global));
  const exported = require(path.join(ROOT, PLAN_FILE));
  return { api: exported.NM_PLACEMENT_PLAN || exported, world: global, levelsBefore };
}
function loadBrowserVM(prepare, auditInternals = false){
  const world = { console: { log(){}, warn(){}, error(){} } };
  world.window = world;
  const context = vm.createContext(world);
  sourceFiles.forEach(file => vm.runInContext(read(file), context,
    { filename: file, timeout: 10000 }));
  if(prepare) prepare(world);
  let source = read(PLAN_FILE);
  if(auditInternals){
    // Test the real private adapter in a disposable VM; no production API or
    // source file is changed, and no invented course/level is needed.
    const marker = 'W.NM_PLACEMENT_PLAN = { stages, build, summarize };';
    assert(source.includes(marker), 'audit adapter: production export marker changed');
    source = source.replace(marker, 'W.NM_PLACEMENT_PLAN = { stages, build, summarize, _auditSource: source, _auditAdapt: numberQuestion, _auditEqual: equal };');
  }
  vm.runInContext(source, context, { filename: PLAN_FILE, timeout: 10000 });
  return { api: world.NM_PLACEMENT_PLAN, world };
}
function apiContract(api, where){
  assert(api && typeof api === 'object', where + ': API object missing');
  ['stages', 'build', 'summarize'].forEach(name =>
    assert.strictEqual(typeof api[name], 'function', where + ': ' + name + ' API missing'));
}
function localized(value, where){
  assert(value && typeof value === 'object', where + ': localized object required');
  ['ko', 'en', 'zh'].forEach(lang => assert(typeof value[lang] === 'string' && value[lang].trim(),
    where + ': ' + lang + ' text missing'));
}
function sourceRef(ref, world, where){
  const thread = world.NM_THREADS[ref.t];
  assert(thread, where + ': unknown thread ' + ref.t);
  assert(Number.isInteger(ref.lv), where + ': integer level required');
  assert(thread.levels.some(level => level.id === ref.lv), where + ': unknown ' + ref.t + '@' + ref.lv);
  assert.strictEqual(typeof world.NM_TGEN[thread.gen], 'function', where + ': generator missing');
}
function sourceSession(course, session, world, where){
  const value = world.NM_COURSES[course];
  assert(value && !value.comingSoon, where + ': course is not source-built: ' + course);
  assert(Number.isInteger(session) && session >= 1 && session <= value.sessions.length,
    where + ': invalid one-based session ' + session);
  assert(!value.sessions[session - 1].test, where + ': recommendation must not start at a test');
}
function numberAnswer(value, where){
  const numbers = Array.isArray(value) ? value : [value];
  assert(numbers.length > 0, where + ': empty answer array');
  numbers.forEach(number => assert(typeof number === 'number' && Number.isFinite(number),
    where + ': answer must be finite numeric scalar/array'));
}
function foundationMath(item, where){
  const data = item.renderData;
  if(['sequence', 'split', 'join'].includes(item.responseMode)){
    assert(!/톡톡|원을|원 안|골라/.test(item.prompt.ko) && !/\b(?:tap|circle|choose|select)\b/i.test(item.prompt.en) &&
      !/点选|圆圈|选择/.test(item.prompt.zh), where + ': written-answer prompt must not request a removed tapping/circle/choice action');
  }
  if(item.responseMode === 'count-tap') assert(item.prompt.ko.includes('같은 그림') &&
    item.prompt.en.includes('matching the target') && item.prompt.zh.includes('目标图形'),
    where + ': target-tapping instruction must describe the actual diagnostic action');
  switch(item.responseMode){
    case 'count-tap':
      assert(Array.isArray(data.items), where + ': target objects missing');
      assert.strictEqual(item.answer, data.items.filter(value => value.target === true).length,
        where + ': independently counted target quantity');
      assert(item.answer >= 1 && item.answer <= 5, where + ': counting target range exceeds five');
      break;
    case 'make':
      assert(data.target >= 3 && data.target <= 5, where + ': source make target must be 3..5');
      assert.strictEqual(data.max, 5, where + ': five-object construction boundary');
      assert.strictEqual(item.answer, data.target, where + ': construction quantity answer');
      break;
    case 'match-number':
      assert(data.dots.every(value => Number.isInteger(value) && value >= 1 && value <= 5),
        where + ': every visible matching group must stay within five');
      assert.strictEqual(new Set(data.dots).size, data.dots.length, where + ': ambiguous duplicate matching group');
      assert.strictEqual(item.answer, data.dots.indexOf(data.target), where + ': matching uses the target index, not dot quantity');
      assert(item.answer >= 0, where + ': matching target is absent');
      break;
    case 'compare': {
      assert(data.left !== data.right && [data.left, data.right].every(value => value >= 0 && value <= 5),
        where + ': comparison must be distinct quantities within five');
      assert(['more', 'less'].includes(data.ask), where + ': comparison direction missing');
      const leftWins = data.ask === 'more' ? data.left > data.right : data.left < data.right;
      assert.strictEqual(item.answer, leftWins ? 1 : 2, where + ': comparison side is one-based');
      break;
    }
    case 'sequence':
      assert(data.seq.every(value => Number.isInteger(value) && value >= 1 && value <= 10),
        where + ': visible sequence leaves 1..10');
      assert.strictEqual(item.answer, data.seq[data.blank], where + ': missing sequence value');
      break;
    case 'split':
      assert(data.whole <= (item.stageId === 'f-split5' ? 5 : 9) && data.known >= 0 && data.known <= data.whole,
        where + ': splitting givens exceed their stage range');
      assert.strictEqual(item.answer, data.whole - data.known, where + ': independently computed part');
      break;
    case 'join':
      assert(data.left >= 0 && data.right >= 0 && data.left + data.right <= 9, where + ': joining range exceeds nine');
      assert.strictEqual(item.answer, data.left + data.right, where + ': independently computed whole');
      break;
  }
}
function numericTemplate(item, where){
  if(item.responseMode !== 'number') return;
  const data = item.renderData;
  assert(typeof data.tex === 'string' && data.tex.trim(), where + ': numeric question expression missing');
  assert(Array.isArray(data.steps) && data.steps.length <= 1, where + ': do not expose worked intermediate steps');
  data.steps.forEach(step => {
    same(Object.keys(step), ['tex'], where + ': response template must not carry a filled answer');
    assert(typeof step.tex === 'string' && step.tex.includes('\\square'), where + ': final template needs a visible blank');
  });
  assert.strictEqual(data.answerCount, Array.isArray(item.answer) ? item.answer.length : 1,
    where + ': visible response count must match the source answer');
  if(item.thread === 'NS3') assert.strictEqual(item.domain, 'numberBonds', where + ': a varying whole is not always a ten complement');
  if(['MX3', 'MX4'].includes(item.thread)) assert.strictEqual(item.domain, item.thread,
    where + ': ratio/percent and square-root domains must not be merged into multiplication');
  if(item.thread !== 'FR4') return;
  if(item.level === 1){
    assert.strictEqual(data.steps.length, 1, where + ': scalar fraction numerator requires its final fraction template');
    assert(/^\\frac\{\\square\}\{\d+\}$/.test(data.steps[0].tex), where + ': retain only the fixed-denominator answer blank, not converted operands');
    assert(item.prompt.ko.includes('분자') && item.prompt.en.includes('numerator') && item.prompt.zh.includes('分子'),
      where + ': numerator-only input cue missing');
  } else if(item.level === 2 && !Array.isArray(item.answer)){
    assert(item.prompt.ko.includes('자연수') && item.prompt.en.includes('whole-number') && item.prompt.zh.includes('整数'),
      where + ': integral mixed-fraction result requires a whole-number cue');
  } else if(item.level === 2){
    assert(item.prompt.ko.includes('자연수 부분, 분자, 분모') && item.prompt.en.includes('whole part, numerator, then denominator') &&
      item.prompt.zh.includes('整数部分、分子、分母'), where + ': mixed response ordering is not explicit');
  } else if(item.level === 3 || item.level === 4){
    assert.strictEqual(data.steps.length, 0, where + ': partial fraction question must not append worked answer annotations');
    assert(data.tex.includes('\\frac{1}{\\square}'), where + ': partial fraction denominator blank missing');
    assert(item.prompt.ko.includes('분모') && item.prompt.en.includes('denominator') && item.prompt.zh.includes('分母'),
      where + ': denominator-only cue missing');
    assert(!item.prompt.ko.includes('분자') && !item.prompt.en.includes('numerator') && !item.prompt.zh.includes('分子'),
      where + ': partial fraction cue incorrectly asks for a numerator');
  }
}
function checkPromptConditions(){
  const audit = loadBrowserVM(null, true);
  const levelsBefore = plain(learningLevels(audit.world));
  const generatorsBefore = Object.fromEntries(Object.entries(audit.world.NM_TGEN).map(([key, fn]) => [key, String(fn)]));
  const refs = [['AD2',1],['AD2',2],['NS1',1],['DV7',2],['EL3',3],['FR1',1],['FR2',1],['FR3',1],['FR3',2],
    ['FR5',1],['FR5',2],['DV18',1],['FR4',1],['FR4',2],['MD3',1],['MD7',1],['MD7',2],['MD9',1],['MD9',2],['CH5',1],['CH5',4]];
  const digitAt = audit.world.NM_THREADS.MD9.levels.find(level => level.params.mode === 'digitAt');
  if(digitAt) refs.push(['MD9',digitAt.id]);
  const coverage = new Set();
  const gcd = (a,b) => { a=Math.abs(a);b=Math.abs(b);while(b){const rest=a%b;a=b;b=rest;}return a; };
  const reduced = (n,d) => { const g=gcd(n,d);return [n/g,d/g]; };
  const fractions = tex => [...tex.matchAll(/\\d?frac\{(-?\d+|\\square)\}\{(\d+|\\square)\}/g)]
    .map(match => ({n:match[1]==='\\square'?null:Number(match[1]),d:match[2]==='\\square'?null:Number(match[2])}));
  const cues = (q,patterns,where) => ['ko','en','zh'].forEach((lang,i) =>
    assert(patterns[i].test(q.prompt[lang]), where + ': required ' + lang + ' answer condition missing'));
  const checkCH5 = (lv,p,q,where) => {
    if(lv===1){
      const match=p.tex.match(/^(\d+)\s*\\div\s*(9+)\s*=\s*0\.\\overline\{\\square\}$/);
      assert(match,where+': cycle dividend and divisor must remain visible');
      const n=Number(match[1]),d=Number(match[2]),width=match[2].length;
      assert.strictEqual(q.answer,n,where+': fixed-width repeating block must equal the dividend');
      assert.strictEqual(String(q.answer).length,width,where+': source cycle range does not generate leading-zero blocks');
      assert(n>0&&n<d,where+': cycle is a proper nonterminating quotient');
      cues(q,[new RegExp('(?:^|\\D)'+width+'\\s*자리'),new RegExp('\\b'+width+'(?:[- ]digit| digits)'),new RegExp('(?:^|\\D)'+width+'位')],where);
      cues(q,[/앞자리\s*0|앞의\s*0/,/leading zero/i,/前导\s*0|开头.*0|前面.*0/],where);
      cues(q,[/0.*생략/,/leading zeros.*omitted/i,/0.*省略/],where);
      assert(!/힌트|hint|提示/i.test(Object.values(q.prompt).join(' ')),where+': cycle learning hint leaked');
      assert(!/가장 짧|최소.*주기|shortest|最短/i.test(Object.values(q.prompt).join(' ')),where+': fixed-width block must not be replaced by the shortest cycle');
      same(q.renderData.steps,[],where+': cycle must not expose its worked rule');
      if(width>1&&new Set(String(n)).size===1)coverage.add('CH5-fixed-width-not-minimal');
      return;
    }
    cues(q,[/분자, 분모/,/numerator, then denominator/,/分子、分母/],where);
    cues(q,[/반복마디.*자리\s*수/,/repeating block.*digits|digits.*repeating block/i,/循环节.*位数|位数.*循环节/],where);
    cues(q,[/9.*분모|분모.*9/,/denominator.*9|9.*denominator/i,/分母.*9|9.*分母/],where);
    cues(q,[/약분하지|약분.*금지|약분.*말/,/do not simplify/i,/不.*约分/],where);
    assert(!/lowest terms|最简分数|기약분수/.test(Object.values(q.prompt).join(' ')),where+': unreduced CH5 condition changed');
    const match=p.tex.match(/\\overline\{(\d+)\}/);assert(match,where+': repeating block missing');
    same(q.answer,[Number(match[1]),10**match[1].length-1],where+': denominator uses the displayed block width, not its shortest period');
    same(q.renderData.steps,[{tex:'\\dfrac{\\square}{\\square}'}],where+': CH5 duplicate worked left side must be absent');
    if(match[1].startsWith('0'))coverage.add('CH5-leading-zero-width');
    if(gcd(...q.answer)>1)coverage.add('CH5-unreduced-valid');
  };
  const scalarExpression = tex => {
    const match=tex.trim().match(/^(-?\d+)\s*(\+|-|\\times|\\div)\s*(-?\d+)$/);
    assert(match,'algebra fixture: unsupported visible expression '+tex);
    const a=Number(match[1]),b=Number(match[3]);
    return match[2]==='+'?a+b:match[2]==='-'?a-b:match[2]==='\\times'?a*b:a/b;
  };
  let count=0;
  refs.forEach(([t,lv]) => {
    const ref={t,lv};sourceRef(ref,audit.world,'prompt fixture');
    for(let seed=0;seed<40;seed++){
      const where=t+'@'+lv+' prompt seed='+seed;
      const p=audit.api._auditSource(ref,'condition-'+seed), before=plain(p);
      const q=audit.api._auditAdapt(ref,p,false);
      assert(q,where+': source numeric task was rejected');
      same(p,before,where+': diagnostic adapter must not mutate its learning question');
      same([q.renderData.tex,q.answer,q.renderData.answerType,q.renderData.answerCount],
        [p.tex,p.answer,p.answerType||'number',Array.isArray(p.answer)?p.answer.length:1],
        where+': original expression, answer, type and count must remain unchanged');
      localized(q.prompt,where);numericTemplate({...q,thread:t,level:lv},where);
      const fs=fractions(p.tex);
      if(p.answerShape==='mixed'){
        assert(q.answer.length===3&&fs.at(-1).d===q.answer[2],where+': mixed response third value must retain the supplied denominator');
        cues(q,[/자연수 부분, 분자, 분모/,/whole part, numerator, then denominator/,/整数部分、分子、分母/],where);
        const match=p.tex.match(/^(\d+)\\frac.*?\s([+-])\s(\d+)\\frac/);
        assert(match,where+': mixed arithmetic operands missing');
        const expected=Number(match[1])+fs[0].n/fs[0].d+(match[2]==='+'?1:-1)*(Number(match[3])+fs[1].n/fs[1].d);
        assert(Math.abs(expected-(q.answer[0]+q.answer[1]/q.answer[2]))<1e-9,where+': independently calculated mixed value');
      }
      if(t==='AD2'){
        same(q.prompt,{ko:'제시된 식의 빈칸에 알맞은 수를 쓰세요.',en:'Enter the number that makes the shown statement true.',zh:'在所示算式的空格中填写合适的数。'},
          where+': neutral arithmetic cue must not contain move-to-ten or intermediate numbers');
        assert.strictEqual(q.answer,p.tex.split('=')[0].match(/\d+/g).map(Number).reduce((a,b)=>a+b,0),where+': independent addition');
      } else if(t==='NS1'){
        same(q.prompt,p.prompt,where+': requested place must not disappear');
        const match=p.prompt.ko.match(/^([\d,]+)에서 (일|십|백)의 자리/);
        assert(match,where+': source place condition missing');
        const place={일:1,십:10,백:100}[match[2]],n=Number(match[1].replace(/,/g,''));
        assert.strictEqual(q.answer,Math.floor(n/place)%10,where+': independent place digit');
      } else if(t==='DV7'){
        same(q.prompt,{...p.prompt,en:p.prompt.en.replace(/\bGCD\b/g,'greatest common divisor')},where+': greatest-common-divisor task must remain explicit without acronyms');
        cues(q,[/최대공약수/,/greatest common divisor/,/最大公因数/],where);
        assert(!/\b(?:GCD|LCM)\b/.test(q.prompt.en),where+': test question must use full curriculum terms');
        const numbers=p.tex.match(/\d+/g).map(Number);
        assert.strictEqual(q.answer,gcd(numbers[0],numbers[1]),where+': independent GCD');
      } else if(t==='EL3'){
        ['ko','en','zh'].forEach(lang=>assert(q.prompt[lang].startsWith(p.prompt[lang]),where+': conditional comparison prompt lost'));
        const match=p.tex.match(/^(.*?)\\;\\bigcirc\\;\s*(.*?)\\;\\Rightarrow/);
        assert(match,where+': ordered comparison givens missing');
        const left=scalarExpression(match[1]),right=scalarExpression(match[2]);
        same(q.answer,[Math.max(left,right),Math.abs(left-right)],where+': independent bigger-value/difference order');
      } else if(t==='FR1'){
        assert(fs.length===3&&fs[2].n===null&&fs.every(f=>f.d===fs[0].d),where+': fixed RHS denominator must determine one numerator');
        const subtract=p.tex.includes(' - ');
        assert.strictEqual(q.answer,subtract?fs[0].n-fs[1].n:fs[0].n+fs[1].n,where+': independent fixed-denominator numerator');
        cues(q,[/분모.*그대로.*분자/,/Keep the shown denominator.*numerator/,/保留所示分母.*分子/],where);
      } else if(t==='FR2'){
        if(/=\s*\\square\\frac/.test(p.tex)){
          coverage.add('FR2-whole');
          assert.strictEqual(q.answer,Math.floor(fs[0].n/fs[0].d),where+': improper-to-mixed whole part');
          assert.strictEqual(fs[1].n,fs[0].n%fs[0].d,where+': remainder supplied in mixed target');
          cues(q,[/대분수.*자연수/,/whole-number.*mixed number/,/带分数.*整数部分/],where);
        } else {
          coverage.add('FR2-numerator');
          const whole=Number(p.tex.match(/^(\d+)\\frac/)[1]);
          assert.strictEqual(q.answer,whole*fs[0].d+fs[0].n,where+': mixed-to-improper numerator');
          cues(q,[/가분수.*분자/,/numerator.*improper fraction/,/假分数.*分子/],where);
        }
      } else if(t==='FR5'){
        assert(fs.length===(lv===1?2:4),where+': every response needs its given denominator');
        const numerators=[];
        for(let i=0;i<fs.length;i+=2){
          assert(fs[i+1].n===null&&fs[i+1].d!==null,where+': fixed denominator response required');
          numerators.push(fs[i].n*fs[i+1].d/fs[i].d);
        }
        same(q.answer,lv===1?numerators[0]:numerators,where+': independent scaled numerators');
        cues(q,lv===1?[/제시된 분모.*분자/,/shown denominator.*numerator/,/所示分母.*分子/]:
          [/제시된 공통분모.*분자/,/shown common denominator.*numerators/,/所示公分母.*分子/],where);
        assert(!/기약분수/.test(q.prompt.ko)&&!/lowest terms/.test(q.prompt.en)&&!/最简/.test(q.prompt.zh),where+': FR5 must not force lowest terms against its given denominator');
        if(lv===1&&gcd(numerators[0],fs[1].d)>1)coverage.add('FR5-unreduced-valid');
      } else if(t==='DV18'){
        const match=p.tex.match(/^(\d+)\s*\\div\s*(\d+)/),a=Number(match[1]),b=Number(match[2]);
        same(q.answer,[Math.floor(a/b),a%b],where+': independent quotient then remainder');
        cues(q,[/몫, 나머지 순서/,/quotient, then the remainder/,/商、余数的顺序/],where);
      } else if(t==='FR3'){
        cues(q,[/대분수 형식/,/mixed-number form/,/带分数形式/],where);
      } else if(t==='FR4'&&lv===1){
        const target=q.renderData.steps[0].tex.match(/^\\frac\{\\square\}\{(\d+)\}$/);
        assert(target,where+': no converted operands or equals sign may remain in the response template');
        const d=Number(target[1]),sign=p.tex.includes(' - ')?-1:1;
        assert.strictEqual(q.answer,fs[0].n*d/fs[0].d+sign*fs[1].n*d/fs[1].d,where+': independent common-denominator numerator');
        cues(q,[/주어진 분모.*분자/,/given denominator.*numerator/,/给定的分母.*分子/],where);
        assert(!/최소공배수|통분해요/.test(q.prompt.ko)&&!/LCM/.test(q.prompt.en),where+': strategy or LCM hint leaked');
      } else if(['MD3','MD7','MD9'].includes(t)&&p.answerShape==='fraction'){
        same(q.renderData.steps,[{tex:'\\dfrac{\\square}{\\square}'}],where+': RHS-only fraction answer template');
        cues(q,[/기약분수.*분자, 분모/,/lowest terms.*numerator, then denominator/,/最简分数.*分子、分母/],where);
        assert(!/역수|반복 전|분자끼리|분모끼리/.test(q.prompt.ko)&&!/reciprocal|concatenated/.test(q.prompt.en),where+': rational arithmetic strategy leaked');
        let n,d;
        if(t==='MD9'){
          const match=p.tex.match(/^0\.(\d*)\\overline\{(\d+)\}/);assert(match,where+': repeating decimal givens missing');
          n=Number(match[1]+match[2])-Number(match[1]||0);d=10**match[1].length*(10**match[2].length-1);
        } else if(t==='MD3'){
          const sign=p.tex.includes(' - ')?-1:1;n=fs[0].n*fs[1].d+sign*fs[1].n*fs[0].d;d=fs[0].d*fs[1].d;
        } else if(p.tex.includes('\\div')){n=fs[0].n*fs[1].d;d=fs[0].d*fs[1].n;if(d<0){n=-n;d=-d;}}
        else {n=fs[0].n*fs[1].n;d=fs[0].d*fs[1].d;}
        same(q.answer,reduced(n,d),where+': independently reduced rational answer');
      } else if(t==='MD9'){
        cues(q,[new RegExp(p.digitIndex+'번째'),new RegExp('digit number '+p.digitIndex),new RegExp('第'+p.digitIndex+'位')],where);
      } else if(t==='CH5'){
        checkCH5(lv,p,q,where);
      }
      count++;
    }
  });
  // Native source generators with a deterministic in-memory RNG establish the
  // width ambiguity and leading-zero conditions without altering source levels.
  [
    {lv:1,rng:[0.5,23.5/89],tex:'33 \\div 99 = 0.\\overline{\\square}',answer:33},
    {lv:4,rng:[0.5,11.5/98],tex:'0.\\overline{12} = \\square',answer:[12,99]},
    {lv:4,rng:[0.5,7.5/98],tex:'0.\\overline{08} = \\square',answer:[8,99]}
  ].forEach(fixture=>{
    const ref={t:'CH5',lv:fixture.lv},where='CH5@'+fixture.lv+' fixed source '+fixture.tex;
    sourceRef(ref,audit.world,where);
    const params=audit.world.NM_THREADS.CH5.levels.find(level=>level.id===fixture.lv).params;
    const values=fixture.rng.slice();
    const p=audit.world.NM_TGEN[audit.world.NM_THREADS.CH5.gen](plain(params),()=>{
      assert(values.length,where+': unexpected source RNG consumption');return values.shift();
    }),before=plain(p);
    same([p.tex,p.answer],[fixture.tex,fixture.answer],where+': exact native source fixture');
    assert.strictEqual(values.length,0,where+': source fixture must use both RNG values');
    const q=audit.api._auditAdapt(ref,p,false);assert(q,where+': source numeric task rejected');
    same(p,before,where+': source question must not be mutated');
    same([q.renderData.tex,q.answer,q.renderData.answerType,q.renderData.answerCount],
      [p.tex,p.answer,p.answerType||'number',Array.isArray(p.answer)?p.answer.length:1],where+': source expression and response contract changed');
    localized(q.prompt,where);numericTemplate({...q,thread:'CH5',level:fixture.lv},where);
    checkCH5(fixture.lv,p,q,where);count++;
  });
  same([...coverage].sort(),['CH5-fixed-width-not-minimal','CH5-leading-zero-width','CH5-unreduced-valid','FR2-numerator','FR2-whole','FR5-unreduced-valid'],
    'condition fixtures must cover fixed-width cycles, leading zeros, both conversion directions and valid unreduced answers');
  same(learningLevels(audit.world),levelsBefore,'prompt fixtures must not add or change learning levels');
  same(Object.fromEntries(Object.entries(audit.world.NM_TGEN).map(([key,fn])=>[key,String(fn)])),generatorsBefore,
    'diagnostic conditions must not rewrite learning generator functions');
  return count;
}
function chooseSpread(values, maximum){
  if(values.length <= maximum) return values;
  return Array.from({ length: maximum }, (_, i) => values[Math.round(i * (values.length - 1) / (maximum - 1))]);
}
function checkBranchConditions(){
  const audit=loadBrowserVM(null,true),levelsBefore=plain(learningLevels(audit.world));
  const generatorsBefore=Object.fromEntries(Object.entries(audit.world.NM_TGEN).map(([key,fn])=>[key,String(fn)]));
  const keys=['MD103@3','MD105@3','MD106@2','MD106@3','MD109@3','MD110@2','MD110@3','MD111@4','MD115@3','MD116@3',
    'MD120@1','MD121@1','MD121@2','MD128@1','MD129@3','MD131@1','MD132@3','MD137@1','MD137@2','MD139@1','MD139@2',
    'MD141@1','MD141@2','MD143@2','MD143@3','MD144@1','MD145@1','MD147@1','MD146@2','MD149@1','MD149@2','MD149@3',
    'MD150@2','MD152@2','MD153@3','MD159@2','MD44@3','MD119@2','MD119@3','MD126@1','MD126@3','MD130@1','MD130@2',
    'MD130@3','MD135@1','MD153@1','MD156@1','MD157@1','MD158@1','MD31@1','MD31@2','MD31@3','MD32@1','MD115@1','MD105@2','DV8@2','DV8@3'];
  const selected=new Set(audit.api.stages().flatMap(stage=>stage.refs.map(ref=>ref.t+'@'+ref.lv))),coverage=new Set();
  const cues=(q,patterns,where)=>['ko','en','zh'].forEach((lang,i)=>assert(patterns[i].test(q.prompt[lang]),where+': required '+lang+' condition missing'));
  const recipe=[/먼저.*(?:구합니다|구해|계산|셉니다)|완전제곱식으로|부호를 바꾸어|끝끼리|곱 네 개|소인수분해한 뒤|각 지수에|연속한 세 자연수의 곱|코시|슈바르츠|미분계수로 봅니다|가운데 항이 지워|서로 지워|각 변환 공식|귀납법은|넣어 보면|힌트|전략/,
    /complete the square|all four products|add 1 to each exponent|Cauchy|Schwarz|first (?:find|compute|count)|from the bottom up|rationalizing|reciprocal|guess|use .*formulas?|hint|strategy/i,
    /配成.*平方|端点.*相乘|指数加1|柯西|施瓦茨|先求|从下往上|有理化|倒过来|猜出|中间项.*消|平方和|提示|策略/];
  const real=[/실수/,/real/i,/实数/],natural=[/자연수/,/natural/i,/自然数/];
  const orderedAB=[/a.*b.*순서|a.*b.*순/,/a.*then.*b/i,/a.*b.*顺序/];
  const maxMin=[/최댓값.*M.*최솟값.*m|M.*최댓값.*m.*최솟값/,/maximum M.*minimum m|M.*maximum.*m.*minimum/i,/最大值M.*最小值m|M.*最大值.*m.*最小值/];
  const standardRadical=[/근호.*양수.*완전제곱|표준 근호.*양수/,/standard radical.*positive.*perfect.square/i,/标准根式.*正.*完全平方/];
  let branches=0;
  for(const key of keys){
    assert(selected.has(key),'branch fixture must use an actual selected ref: '+key);
    const [t,level]=key.split('@'),lv=Number(level),ref={t,lv};sourceRef(ref,audit.world,'branch fixture');
    for(let seed=0;seed<20;seed++){
      const where=key+' branch seed='+seed,p=audit.api._auditSource(ref,'branch-'+seed),before=plain(p),q=audit.api._auditAdapt(ref,p,false);
      assert(q,where+': numeric source rejected');same(p,before,where+': learning question mutated');
      same([q.renderData.tex,q.answer,q.renderData.answerType,q.renderData.answerCount],
        [p.tex,p.answer,p.answerType||'number',Array.isArray(p.answer)?p.answer.length:1],where+': original expression and response contract changed');
      localized(q.prompt,where);numericTemplate({...q,thread:t,level:lv},where);
      ['ko','en','zh'].forEach((lang,i)=>assert(!recipe[i].test(q.prompt[lang]),where+': learning recipe remains in '+lang));
      if(t==='MD103'){cues(q,[/한 허근.*켤레복소수/,/non-real root.*complex conjugate/i,/非实根.*共轭复数/],where);assert(!/ω³=1|ω²\+ω\+1=0|ωω̄=1/.test(Object.values(q.prompt).join(' ')),where+': derived omega relations leaked');}
      else if(t==='MD105'){
        cues(q,lv===3?real:natural,where);
        if(lv===3)cues(q,[/x.*y.*순서|x.*y.*순/,/x.*then.*y/i,/x.*y.*顺序/],where);
        else if(p.prompt.ko.includes('가장 큰')){coverage.add('MD105-max');cues(q,[/x\+y.*최댓값/,/largest value of x\+y/i,/x\+y.*最大值/],where);}
        else {coverage.add('MD105-count');cues(q,[/순서쌍.*개수/,/count.*ordered pairs/i,/有序数对.*个数/],where);}
      }
      else if(t==='MD106')cues(q,[/최솟값.*최댓값/,/minimum.*maximum/i,/最小值.*最大值/],where);
      else if(t==='MD109')cues(q,[/해가 없/,/no solution/i,/无解/],where);
      else if(t==='MD110'){
        if(lv===2&&p.prompt.ko.includes('동류항')){coverage.add('MD110-expand');cues(q,[/전개.*항의 개수/,/terms.*expanding/i,/展开.*项数/],where);}
        else if(lv===2){coverage.add('MD110-roads');same(q.prompt,p.prompt,where+': all route quantities and restrictions must remain');}
        else if(p.prompt.ko.includes('총합')){coverage.add('MD110-divisor-sum');cues(q,[/양의 약수.*총합/,/sum.*positive divisors/i,/正约数之和/],where);}
        else if(p.prompt.ko.includes('짝수')){coverage.add('MD110-even-count');cues(q,[/짝수.*개수/,/even positive divisors/i,/偶数.*个数/],where);}
        else {coverage.add('MD110-divisor-count');cues(q,[/양의 약수.*개수/,/count.*positive divisors/i,/正约数.*个数/],where);}
      }
      else if(t==='MD111'){
        if(/n=\\square/.test(p.tex)){coverage.add('MD111-natural');cues(q,natural,where);}
        else if(/^\d+!\s*\\;\\Rightarrow/.test(p.tex)){coverage.add('MD111-zeros');cues(q,[/끝자리.*0.*개수/,/trailing zeros/i,/末尾.*0.*个数/],where);}
        else coverage.add('MD111-sum');
      }
      else if(t==='MD115')cues(q,[/G.*무게중심/,/G.*centroid/i,/G.*重心/],where);
      else if(t==='MD116')cues(q,[/d.*점 P.*거리.*부호/,/d.*distance.*sign condition/i,/d.*距离.*符号条件/],where);
      else if(t==='MD120')cues(q,[/평행이동/,/translation/i,/平移/],where);
      else if(t==='MD121')cues(q,[/순서.*기준.*O.*원점/,/order.*mirrors.*O.*origin/i,/顺序.*对称.*O.*原点/],where);
      else if(t==='MD128')cues(q,[/합성함수/,/composite function/i,/复合函数/],where);
      else if(t==='MD129')cues(q,orderedAB,where);
      else if(t==='MD131')cues(q,[/점근선.*x.*y/,/asymptotes.*x.*y/i,/渐近线.*x.*y/],where);
      else if(['MD137','MD139','MD157'].includes(t))cues(q,maxMin,where);
      else if(t==='MD141'){cues(q,[/반지름.*중심각.*호의 길이.*넓이/,/radius.*central angle.*arc length.*area/i,/半径.*圆心角.*弧长.*面积/],where);cues(q,[/라디안/,/radians/i,/弧度/],where);}
      else if(t==='MD144')cues(q,[/해의 개수 N/,/N.*number of solutions/i,/解的个数N/],where);
      else if(t==='MD145')cues(q,[/a=BC.*b=CA.*c=AB.*넓이/,/a=BC.*b=CA.*c=AB.*area/i,/a=BC.*b=CA.*c=AB.*面积/],where);
      else if(t==='MD147')cues(q,[/등차수열.*자연수/,/arithmetic.*natural/i,/等差数列.*自然数/],where);
      else if(t==='MD146')cues(q,[/첫 n개 항의 합/,/sum of the first n terms/i,/前n项的和/],where);
      else if(t==='MD149'&&lv===1){if(/n=\\square/.test(p.tex)){coverage.add('MD149-inverse');cues(q,natural,where);}else {coverage.add('MD149-numerator');cues(q,[/분모.*분자/,/denominator.*numerator/i,/分母.*分子/],where);}}
      else if(t==='MD150'){
        cues(q,[/괄호.*군.*수열/,/bracket.*group.*sequence/i,/括号.*群.*数列/],where);
        if(/h=\\square/.test(p.tex)){coverage.add('MD150-h');cues(q,[/h.*군.*앞에서.*위치/,/h.*position.*within.*group/i,/h.*群.*位置/],where);}
        else if(/\\d?frac\{\\square/.test(p.tex)){coverage.add('MD150-numerator');cues(q,[/분모.*분자/,/denominator.*numerator/i,/分母.*分子/],where);}
        else {coverage.add('MD150-term');cues(q,[/항의 값/,/value.*term/i,/项的值/],where);}
      }
      else if(t==='MD152')cues(q,[/수열.*조건/,/sequence conditions/i,/数列条件/],where);
      else if(t==='MD153'){
        if(lv===3)cues(q,[/모든 자연수 n.*성립/,/every natural number n/i,/每个自然数n.*成立/],where);
        else if(/n_0=\\square/.test(p.tex)){coverage.add('MD153-threshold');cues(q,[/모든 자연수.*가장 작은 자연수/,/least natural number.*every natural/i,/所有自然数.*最小自然数|最小自然数.*所有自然数/],where);}
        else {coverage.add('MD153-divisor');cues(q,[/d.*모든 자연수.*가장 큰 자연수/,/d.*greatest natural number.*every natural|greatest natural.*d.*every natural/i,/d.*每个自然数.*最大自然数|最大自然数.*d.*每个自然数/],where);}
      }
      else if(t==='MD159'&&/x_0=\\square/.test(p.tex)){coverage.add('MD159-local-max');cues(q,[/x₀.*극대/,/x₀.*local maximum/i,/x₀.*极大值/],where);}
      else if(t==='MD119'){
        if(lv===2)cues(q,[/접선/,/tangent/i,/相切|切线/],where);
        else if(p.tex.includes('\\overline{PT}')){coverage.add('MD119-length');cues(q,[/T.*접점|접점.*T/,/T.*point of tangency/i,/T.*切点/],where);}
        else {coverage.add('MD119-slopes');cues(q,[/m₁.*m₂.*접선.*기울기|기울기.*m₁.*m₂/,/m₁.*m₂.*slopes.*tangents/i,/m₁.*m₂.*切线.*斜率/],where);}
      }
      else if(t==='MD126'){cues(q,maxMin,where);if(lv===3)cues(q,real,where);}
      else if(t==='MD130'){
        if(lv===1||lv===2&&!p.tex.includes('=\\dfrac{a}{b}')){coverage.add('MD130-symbolic');cues(q,[/모든.*정의|동치|항등/,/identity|equivalent/i,/所有.*有定义|恒等|等价/],where);cues(q,orderedAB,where);}
        else if(lv===2){coverage.add('MD130-reduced');cues(q,[/분모.*양수.*기약분수/,/lowest terms.*positive/i,/分母为正.*最简分数/],where);cues(q,orderedAB,where);}
        else if(p.prompt.ko.includes('c≥2')){coverage.add('MD130-continued');cues(q,natural,where);cues(q,[/c≥2/,/c≥2|c>=2/,/c≥2/],where);}
      }
      else if(t==='MD135')cues(q,[/n.*정수/,/n.*integer/i,/n.*整数/],where);
      else if(t==='MD156')cues(q,[/α<β.*↗.*증가.*↘.*감소/,/α<β.*↗.*increasing.*↘.*decreasing/i,/α<β.*↗.*递增.*↘.*递减/],where);
      else if(t==='MD158')cues(q,[/서로 다른 실근.*개수/,/distinct real roots/i,/不同实根.*个数/],where);
      else if(t==='MD31')cues(q,standardRadical,where);
      else if(t==='MD32')cues(q,[/M.*중점/,/M.*midpoint/i,/M.*中点/],where);
      else if(t==='DV8'&&lv===2){cues(q,[/작은.*순서|오름차순|작은.*부터/,/increasing|ascending|smallest/i,/从小到大|升序/],where);cues(q,[/반복|중복|같은.*여러 번.*각각/,/repeat|repetition/i,/重复/],where);}
      else if(t==='DV8')cues(q,[/양의 약수.*개수/,/positive divisors/i,/正约数.*个数/],where);
      branches++;
    }
  }
  for(const name of ['MD105-max','MD105-count','MD110-expand','MD110-roads','MD110-divisor-sum','MD110-even-count',
    'MD110-divisor-count','MD111-natural','MD111-zeros','MD111-sum','MD149-inverse','MD149-numerator','MD150-h','MD150-numerator',
    'MD150-term','MD153-threshold','MD153-divisor','MD159-local-max','MD119-length','MD119-slopes','MD130-symbolic','MD130-reduced','MD130-continued'])
    assert(coverage.has(name),'branch fixtures did not exercise required native branch: '+name);
  let uniqueFactors=0;
  for(let seed=0;seed<1000;seed++){
    const p=audit.api._auditSource({t:'MD20',lv:6},'integer-factor-'+seed),where='MD20@6 integer uniqueness seed='+seed;
    const m=p.tex.split('=')[0].replace(/\s/g,'').match(/^(\d+)x\^2([+-]\d*)x([+-]\d+)$/);assert(m,where+': nonmonic polynomial missing');
    const A=Number(m[1]),B=m[2]==='+'?1:m[2]==='-'?-1:Number(m[2]),C=Number(m[3]),candidates=[];
    for(let q=-Math.abs(C);q<=Math.abs(C);q++)if(q!==0&&C%q===0){const v=B-A*q;if(v*q===C)candidates.push([A,v,q]);}
    same(candidates,[p.answer],where+': integer factored form must have exactly one complete ordered tuple');uniqueFactors++;
  }
  [['03',3],['007',7]].forEach(([input,answer])=>assert.strictEqual(audit.api._auditEqual(input,answer),true,'CH5 leading-zero numeric normalization: '+input));
  same(learningLevels(audit.world),levelsBefore,'branch checks must not change learning levels');
  same(Object.fromEntries(Object.entries(audit.world.NM_TGEN).map(([key,fn])=>[key,String(fn)])),generatorsBefore,'branch checks must not rewrite learning generators');
  return {branches,uniqueFactors,normalization:2};
}
function checkMD127Bijection(){
  const audit=loadBrowserVM(null,true),ref={t:'MD127',lv:3};
  const levelsBefore=plain(learningLevels(audit.world));
  const generatorsBefore=Object.fromEntries(Object.entries(audit.world.NM_TGEN).map(([key,fn])=>[key,String(fn)]));
  assert(audit.api.stages().some(stage=>stage.refs.some(value=>value.t===ref.t&&value.lv===ref.lv)),
    'MD127@3: fixture must use an actual selected source ref');
  sourceRef(ref,audit.world,'MD127@3 bijection');
  same(audit.world.NM_THREADS.MD127.levels.find(level=>level.id===3).params,{mode:'coef'},
    'MD127@3: source coefficient branch must not change');
  const conditions=[
    [/실수 구간/,/일대일대응/,/a의 부호 조건/,/실수 a, b/,/a, b 순서/],
    [/real intervals/i,/one-to-one correspondence/i,/sign condition on a/i,/real a, then b/i],
    [/实数区间/,/一一对应/,/a的符号条件/,/实数a、b/,/a、b的顺序/]
  ];
  const recipes=[/양 끝|양끝|작은 끝|작은끝|끝끼리|엇갈려|끝점/,/endpoints?|ends of|small to small|crossed/i,/两端|端点|小端|交叉对应/];
  const signs=new Set();
  for(let seed=0;seed<1000;seed++){
    const where='MD127@3 real bijection uniqueness seed='+seed;
    const p=audit.api._auditSource(ref,'bijection-'+seed),before=plain(p);
    const q=audit.api._auditAdapt(ref,p,false);assert(q,where+': source numeric task rejected');
    same(p,before,where+': adapter must not mutate the learning question');
    same(q.answer,p.answer,where+': source ordered coefficient answer changed');
    same(q.renderData,{tex:p.tex,steps:[],answerType:p.answerType||'number',answerCount:2},
      where+': original expression, blank layout, and response arity must stay unchanged');
    assert.strictEqual(q.responseMode,'number',where+': numeric response mode changed');
    localized(q.prompt,where);numericTemplate({...q,thread:ref.t,level:ref.lv},where);
    ['ko','en','zh'].forEach((lang,i)=>{
      conditions[i].forEach(pattern=>assert(pattern.test(q.prompt[lang]),where+': required '+lang+' condition missing: '+pattern));
      assert(!recipes[i].test(q.prompt[lang]),where+': endpoint-mapping recipe remains in '+lang);
    });
    // Derive both real affine bijections from the visible closed intervals,
    // independently of the generator's chosen coefficients or worked solution.
    const x=p.tex.match(/(-?\d+)\\le\s*x\\le\s*(-?\d+)/);
    const y=p.tex.match(/(-?\d+)\\le\s*y\\le\s*(-?\d+)/);
    const sign=p.tex.match(/\(a([<>])0\)/);
    assert(x&&y&&sign,where+': closed real intervals and explicit nonzero sign must be visible');
    const [left,right]=x.slice(1).map(Number),[bottom,top]=y.slice(1).map(Number);
    assert(left<right&&bottom<top,where+': source intervals must be nondegenerate');
    const magnitude=(top-bottom)/(right-left);
    const candidates=[[magnitude,bottom-magnitude*left],[-magnitude,top+magnitude*left]];
    assert(candidates[0][0]!==candidates[1][0],where+': omitting the source sign would leave two distinct real answers');
    const allowed=candidates.filter(([a])=>sign[1]==='>'?a>0:a<0);
    assert.strictEqual(allowed.length,1,where+': sign must select exactly one real ordered coefficient pair');
    same(q.answer,allowed[0],where+': independent unique real a,b solution from shown intervals');
    const [a,b]=allowed[0];
    same([a*left+b,a*right+b].sort((u,v)=>u-v),[bottom,top],where+': affine image must be all of Y, not merely an injection into Y');
    signs.add(sign[1]);
  }
  same([...signs].sort(),['<','>'],'MD127@3: both source slope signs must be covered');
  same(learningLevels(audit.world),levelsBefore,'MD127@3 fixture must not change learning levels');
  same(Object.fromEntries(Object.entries(audit.world.NM_TGEN).map(([key,fn])=>[key,String(fn)])),generatorsBefore,
    'MD127@3 fixture must not rewrite learning generators');
  return 1000;
}
function checkCuratedPrompts(){
  const audit=loadBrowserVM(null,true),levelsBefore=plain(learningLevels(audit.world));
  const generatorsBefore=Object.fromEntries(Object.entries(audit.world.NM_TGEN).map(([key,fn])=>[key,String(fn)]));
  const refs=[['CH3',1],['CH3',2],['CH3',3],['CH3',4],['CH3',5],
    ['CH4',1],['CH4',2],['CH4',3],['CH4',4],['CH6',1],['CH6',2],['CH6',3],['CH6',4],['MX2',1],['MX2',2],
    ['MD28',1],['MD28',2],['MD28',3],['MD63',1],['MD63',2],['MD63',3],['MD60',1],
    ['MD16',1],['MD16',2],['MD16',3],['MD20',1],['MD20',2],['MD20',3],['MD20',4],['MD20',5],['MD20',6]];
  const selected=new Set(audit.api.stages().flatMap(stage=>stage.refs.map(ref=>ref.t+'@'+ref.lv)));
  const cues=(q,patterns,where)=>['ko','en','zh'].forEach((lang,i)=>
    assert(patterns[i].test(q.prompt[lang]),where+': required '+lang+' condition missing'));
  const recipe=[/힌트|전략|마법|쪼개|가우스|꺼냅니다|대입법|가감법|대각선|더하면.*곱하면|부호가.*바뀌면|가운데 항/, 
    /hint|strategy|trick|splitting|Gauss|pull.*out|substitution method|elimination method|cross.multiply|add to .*multiply to|sign.*to|middle term/i,
    /提示|策略|魔法|拆成|高斯|提到.*外|代入法|加减法|交叉相乘|相加.*相乘|符号由|中间项/];
  const increasing=(q,where)=>cues(q,[/작은.*먼저|작은.*부터|오름차순/,/smaller.*first|increasing order/i,/较小.*先|先.*较小|从小到大/],where);
  const polynomial=(tex,where)=>{
    const terms=tex.replace(/\s/g,'').split(/(?=[+-])/).filter(Boolean),out={0:0,1:0,2:0,3:0};
    for(const term of terms){
      const x=term.match(/^([+-]?\d*)x(?:\^(\d+))?$/);
      if(x){const c=['','+'].includes(x[1])?1:x[1]==='-'?-1:Number(x[1]);out[x[2]||1]+=c;}
      else {assert(/^[+-]?\d+$/.test(term),where+': unsupported visible polynomial term '+term);out[0]+=Number(term);}
    }
    return out;
  };
  const linear=(tex,where)=>{
    const out={x:0,y:0,c:0};
    for(const term of tex.replace(/\s/g,'').split(/(?=[+-])/).filter(Boolean)){
      const m=term.match(/^([+-]?\d*)([xy])$/);
      if(m)out[m[2]]+=['','+'].includes(m[1])?1:m[1]==='-'?-1:Number(m[1]);
      else {assert(/^[+-]?\d+$/.test(term),where+': unsupported linear term '+term);out.c+=Number(term);}
    }
    return out;
  };
  let count=0;
  for(const [t,lv] of refs){
    const ref={t,lv};assert(selected.has(t+'@'+lv),'curated prompt fixture must be an actual selected stage ref: '+t+'@'+lv);
    sourceRef(ref,audit.world,'curated prompt fixture');
    for(let seed=0;seed<20;seed++){
      const where=t+'@'+lv+' curated seed='+seed,p=audit.api._auditSource(ref,'curated-'+seed),before=plain(p);
      const q=audit.api._auditAdapt(ref,p,false);assert(q,where+': source question rejected');
      same(p,before,where+': adapter must not mutate native learning question');
      same([q.renderData.tex,q.answer,q.renderData.answerType,q.renderData.answerCount],
        [p.tex,p.answer,p.answerType||'number',Array.isArray(p.answer)?p.answer.length:1],where+': source expression and response contract changed');
      localized(q.prompt,where);numericTemplate({...q,thread:t,level:lv},where);
      ['ko','en','zh'].forEach((lang,i)=>assert(!recipe[i].test(q.prompt[lang]),where+': learning recipe remains in '+lang+' prompt'));
      if(t==='CH3'&&lv<=3){
        same(q.prompt,p.prompt,where+': conversion direction and target base must remain');
        if(lv===2){
          const match=p.tex.match(/^\((\d+)\)_\{10\}.*?_\{(\d+)\}/);assert(match,where+': base conversion notation');
          assert.strictEqual(String(q.answer),Number(match[1]).toString(Number(match[2])),where+': independently converted target-base digits');
        } else {
          const match=p.tex.match(/^\(([0-9A-F]+)\)_\{(\d+)\}/);assert(match,where+': base conversion notation');
          assert.strictEqual(q.answer,parseInt(match[1],Number(match[2])),where+': independently converted decimal value');
        }
      } else if(t==='CH3'||t==='CH4'){
        const match=p.tex.match(/^(\d+)\s*(\\times|\\div)\s*(\d+)/);assert(match,where+': complete operation missing');
        const a=Number(match[1]),b=Number(match[3]);
        assert.strictEqual(q.answer,match[2]==='\\times'?a*b:a/b,where+': independently calculated multiplication or division');
        assert(!/반복돼|반복되는 자리|repeats|spot.*pattern|重复.*次|重复.*规律/i.test(Object.values(q.prompt).join(' ')),where+': repeat-pattern answer strategy remains');
      } else if(t==='CH6'){
        const match=p.tex.match(/^(\d+)\s*\\div\s*(\d+)\s*=\s*\\square\s*\\cdots\s*(\d+)/);assert(match,where+': fixed-remainder quotient template missing');
        const a=Number(match[1]),b=Number(match[2]);
        same([q.answer,Number(match[3])],[Math.floor(a/b),a%b],where+': independently calculated quotient and given remainder');
        cues(q,[/몫/,/quotient/i,/商/],where);
        assert(!/몫과 나머지.*구|find the quotient and remainder|求商和余数/i.test(Object.values(q.prompt).join(' ')),where+': scalar contract must ask for the quotient, not two responses');
      } else if(t==='MX2'){
        const numbers=p.tex.split('=')[0].match(/\d+/g).map(Number),first=numbers[0],step=numbers[1]-first,last=numbers.at(-1);
        let sum=0;for(let k=first;k<=last;k+=step)sum+=k;
        assert.strictEqual(q.answer,sum,where+': independently enumerated series sum');
        cues(q,[/합|더하/,/sum/i,/和/],where);
        if(lv===2)same(q.prompt,p.prompt,where+': odd/even and first-term-count conditions must remain');
      } else if(t==='MD28'){
        const c=polynomial(p.tex.split('=')[0],where);
        same(q.answer,[-c[1],c[1]**2-4*c[2]*c[0],2*c[2]],where+': unreduced standard quadratic-formula components');
        cues(q,[/약분하지.*표준|표준.*약분하지|기약하지/,/unreduced.*standard|standard.*unreduced|without simplif/i,/不.*化简.*标准|标准.*不.*化简|未(?:经)?约分|不.*约分/],where);
        assert(!/[-−]b.*√|b².*4ac|b\^2.*4ac/.test(Object.values(q.prompt).join(' ')),where+': quadratic formula itself is a learning hint');
      } else if(t==='MD63'){
        const match=p.tex.match(/\\begin\{cases\}([\s\S]*?)\\end\{cases\}/);assert(match,where+': simultaneous equations missing');
        const equations=match[1].split('\\\\').map(row=>{
          const [left,right]=row.split('=').map(tex=>linear(tex,where));
          return {a:left.x-right.x,b:left.y-right.y,c:right.c-left.c};
        });
        assert.strictEqual(equations.length,2,where+': exactly two source equations');
        const [a,b]=equations,det=a.a*b.b-b.a*a.b;assert(det!==0,where+': simultaneous solution must be unique');
        same(q.answer,[(a.c*b.b-b.c*a.b)/det,(a.a*b.c-b.a*a.c)/det],where+': independent ordered x/y solution');
        cues(q,[/x.*y.*순서|x.*y.*순/,/x.*then.*y|x.*y.*order/i,/x.*y.*顺序/],where);
      } else if(t==='MD60'){
        const left=p.tex.slice(p.tex.indexOf('=')+1,p.tex.indexOf('\\;\\Rightarrow')).trim(),c=polynomial(left,where);
        assert(q.answer[0]<q.answer[1],where+': smaller stationary root must come first');
        q.answer.forEach(x=>assert.strictEqual(3*c[3]*x*x+2*c[2]*x+c[1],0,where+': independently differentiated polynomial root'));
        increasing(q,where);
      } else if(t==='MD16'){
        const match=p.tex.match(/^(\d*)\\sqrt\{(\d+)\}/);assert(match,where+': radical source operand missing');
        const original=Number(match[2]),coefficient=Number(match[1]||1);let square=Math.floor(Math.sqrt(original));
        while(original%(square*square))square--;
        same(q.answer,[coefficient*square,original/(square*square)],where+': independently simplified radical standard form');
        cues(q,[/가장 간단|완전제곱|근호.*표준|표준.*근호/,/simplest|perfect.square|standard.*radical/i,/最简|完全平方|标准.*根式/],where);
      } else if(t==='MD20'){
        const c=polynomial(p.tex.split('=')[0],where),a=Array.isArray(q.answer)?q.answer:[q.answer];
        if(lv<=2){same([c[2],c[1],c[0]],[1,a[0]+a[1],a[0]*a[1]],where+': independently expanded basic factors');assert(a[0]<=a[1],where+': smaller factor constant first');increasing(q,where);}
        else if(lv===3)same([c[2],c[1],c[0]],[1,2*a[0],a[0]**2],where+': independently expanded square factor');
        else if(lv===4){same([c[2],c[1],c[0],a[0]],[1,0,-(a[1]**2),a[1]],where+': difference-of-squares repeated blanks');assert(a[0]>0,where+': native difference blanks are positive');}
        else if(lv===5){same([c[2],c[1],c[0]],[a[0],a[0]*(a[1]+a[2]),a[0]*a[1]*a[2]],where+': independently expanded common-factor form');assert(a[1]<=a[2],where+': only the last two constants are increasing');increasing(q,where);}
        else {same([c[2],c[1],c[0]],[a[0],a[0]*a[2]+a[1],a[1]*a[2]],where+': independently expanded nonmonic factor form');cues(q,[/앞.*계수.*상수.*뒤.*상수|왼쪽.*순서/,/first.*coefficient.*constant.*second|coefficient.*first.*constant.*second|left to right/i,/前.*系数.*常数.*后.*常数|从左到右/],where);}
      }
      count++;
    }
  }
  assert.strictEqual(count,620,'curated prompt gate must exercise 31 actual source refs across 20 seeds');
  same(learningLevels(audit.world),levelsBefore,'curated prompts must not change learning levels');
  same(Object.fromEntries(Object.entries(audit.world.NM_TGEN).map(([key,fn])=>[key,String(fn)])),generatorsBefore,'curated prompts must not change learning generators');
  return count;
}
function response(item, value, sec = 7){
  const result = { id: item.id, value: plain(value), sec, skipped: false };
  if(item.responseMode === 'count-tap') result.validationFlags = { validTargets: true };
  return result;
}
function wrongAnswer(answer){
  // Even large finite answers must get a genuinely different wrong value.
  const different = value => value === 0 ? 1 : 0;
  if(Array.isArray(answer)) return answer.map((value, i) => i === 0 ? different(value) : value);
  return different(answer);
}
function valuesEqual(left, right){
  if(Array.isArray(right)) return Array.isArray(left) && left.length === right.length &&
    left.every((value, i) => value === right[i]);
  return left === right;
}
function expectedProfile(plan, responses){
  const known = new Set(plan.items.map(item => item.id));
  const first = new Map();
  responses.forEach(value => {
    if(value && known.has(value.id) && !first.has(value.id)) first.set(value.id, value);
  });
  return plan.items.map(item => {
    const value = first.get(item.id);
    const skipped = !value || value.skipped === true;
    const validTargets = item.responseMode !== 'count-tap' ||
      !!(value && value.validationFlags && value.validationFlags.validTargets === true);
    return { item, value, skipped, ok: skipped ? null : validTargets && valuesEqual(value.value, item.answer) };
  });
}
function checkSummary(api, plan, responses, world, where){
  const summary = api.summarize(plan, responses);
  const expected = expectedProfile(plan, responses);
  assert.strictEqual(summary.asked, 20, where + ': denominator must remain 20');
  assert.strictEqual(summary.correct, expected.filter(row => row.ok).length, where + ': wrong correct count');
  assert(Array.isArray(summary.profile) && summary.profile.length === 20, where + ': profile must cover all 20 items');
  const profile = new Map(summary.profile.map(row => [row.id, row]));
  assert.strictEqual(profile.size, 20, where + ': duplicate profile IDs');
  expected.forEach(row => {
    const result = profile.get(row.item.id);
    assert(result, where + ': missing profile ' + row.item.id);
    same([result.t, result.lv, result.domain, result.band, result.stageId],
      [row.item.thread, row.item.level, row.item.domain, row.item.band, row.item.stageId],
      where + ': profile must preserve source identity');
    assert.strictEqual(result.ok, row.ok, where + ': incorrect profile grade for ' + row.item.id);
    assert.strictEqual(result.skipped, row.skipped, where + ': skipped is not an ordinary wrong answer');
    if(row.value && !row.skipped) assert.strictEqual(result.sec, row.value.sec,
      where + ': keep the first submission time');
  });
  BANDS.forEach(band => {
    const rows = expected.filter(row => row.item.band === band);
    const value = summary.bands && summary.bands[band];
    assert(value, where + ': missing band summary ' + band);
    same([value.asked, value.correct, value.skipped],
      [COUNTS[band], rows.filter(row => row.ok).length, rows.filter(row => row.skipped).length],
      where + ': band totals do not match the profile');
  });
  const domains = [...new Set(plan.items.map(item => item.domain))];
  same(Object.keys(summary.domains || {}).sort(), domains.slice().sort(), where + ': missing/extra domain summary');
  domains.forEach(domain => {
    const rows = expected.filter(row => row.item.domain === domain);
    const value = summary.domains[domain];
    assert(value.label, where + ': domain label missing');
    if(['MX3', 'MX4'].includes(domain)) same(value.label, world.NM_THREADS[domain].name,
      where + ': preserve the exact ratio/percent or square-root source label');
    same([value.asked, value.correct, value.skipped],
      [rows.length, rows.filter(row => row.ok).length, rows.filter(row => row.skipped).length],
      where + ': domain totals do not match the profile');
  });
  const rec = summary.recommendation;
  assert(rec && rec.reason, where + ': recommendation reason missing');
  sourceSession(rec.course, rec.session, world, where + ': recommendation');
  const stages = api.stages();
  const stageOrder = new Map(stages.map((stage, i) => [stage.id, i]));
  const recommendedStage = stages.find(stage => stage.id === rec.stageId);
  assert(recommendedStage, where + ': recommendation must identify an existing learner stage');
  localized(rec.label, where + ': recommendation label');
  same(rec.label, recommendedStage.label, where + ': recommendation label does not identify its learner stage');
  assert.strictEqual(rec.course, recommendedStage.course, where + ': recommended stage/course mismatch');
  assert(Array.isArray(rec.threads) && rec.threads.length, where + ': recommended source threads missing');
  rec.threads.forEach(ref => sourceRef(ref, world, where + ': recommendation'));
  assert(Array.isArray(rec.practiceSessions) && rec.practiceSessions.length,
    where + ': actual source practice locations are required separately from the map starting point');
  const practiceKeys = new Set();
  rec.practiceSessions.forEach(ref => {
    sourceSession(ref.course, ref.session, world, where + ': practice location');
    sourceRef(ref, world, where + ': practice location');
    const session = world.NM_COURSES[ref.course].sessions[ref.session - 1];
    assert((session.drills || []).some(drill => drill.t === ref.t && drill.lv === ref.lv),
      where + ': practice thread/level is not assigned to its exact source session');
    const key = [ref.course, ref.session, ref.t, ref.lv].join('@');
    assert(!practiceKeys.has(key), where + ': duplicate practice location'); practiceKeys.add(key);
    assert(rec.threads.some(thread => thread.t === ref.t && thread.lv === ref.lv),
      where + ': practice location must retain a recommended source thread');
  });
  if(plan.baseline.kind === 'foundation'){
    // C0 sessions are not an ordered learner-stage ladder. In particular,
    // quantity session 11 precedes comparison session 3 in this diagnosis.
    const misses = expected.filter(row => row.ok === false && row.item.band !== 'next');
    const stageId = !expected.some(row => row.ok === true) ? FOUNDATION_IDS[0] :
      misses.length ? misses.map(row => row.item.stageId)
        .sort((a, b) => stageOrder.get(a) - stageOrder.get(b))[0] : plan.baseline.id;
    assert.strictEqual(rec.stageId, stageId, where + ': choose the earliest demonstrated wrong stage, not the lowest session number');
    same([rec.course, rec.session], ['C0', 1], where + ': foundation map starts at C0 session 1; actual practice is a separate field');
    assert(rec.practiceSessions.every(ref => recommendedStage.refs.some(source =>
      source.t === ref.t && source.lv === ref.lv && (source.session || recommendedStage.session) === ref.session)),
      where + ': foundation practice must belong to the chosen learner stage');
  }
  return summary;
}
function checkPlan(plan, stage, seed, stages, world){
  const where = stage.id + ' seed=' + seed;
  same(plan.baseline, stage, where + ': baseline stage changed');
  assert.strictEqual(plan.seed, seed, where + ': preserve the string seed');
  same(plan.counts, COUNTS, where + ': fixed 6/10/4 contract');
  same(plan.boundaries, {
    previous: stages[0].id === stage.id ? 'same-foundation-smaller' : null,
    next: stages[stages.length - 1].id === stage.id ? 'same-course' : null
  }, where + ': boundary labels must describe same-range samples honestly');
  assert(Array.isArray(plan.items) && plan.items.length === 20, where + ': exactly 20 questions required');
  const stageIndex = new Map(stages.map((value, i) => [value.id, i]));
  const index = stageIndex.get(stage.id);
  const ids = new Set(), fingerprints = new Set();
  plan.items.forEach(item => {
    const at = where + ' item=' + item.id;
    assert(typeof item.id === 'string' && item.id, at + ': item ID missing');
    assert(!ids.has(item.id), at + ': duplicate item ID'); ids.add(item.id);
    assert(typeof item.fingerprint === 'string' && item.fingerprint, at + ': fingerprint missing');
    assert(!fingerprints.has(item.fingerprint), at + ': duplicate visible problem'); fingerprints.add(item.fingerprint);
    assert(BANDS.includes(item.band), at + ': invalid band');
    assert(stageIndex.has(item.stageId), at + ': unknown source stage');
    if(item.band === 'current') assert.strictEqual(item.stageId, stage.id, at + ': current-band stage changed');
    if(item.band === 'previous') assert(stageIndex.get(item.stageId) <= index, at + ': previous band jumps ahead');
    if(item.band === 'next') assert(stageIndex.get(item.stageId) >= index, at + ': next band jumps behind');
    assert(typeof item.domain === 'string' && item.domain, at + ': skill domain missing');
    localized(item.label, at + ': label'); localized(item.prompt, at + ': prompt');
    assert(typeof item.responseMode === 'string' && item.responseMode, at + ': response mode missing');
    assert(item.renderData && typeof item.renderData === 'object', at + ': independent render data missing');
    sourceRef({ t: item.thread, lv: item.level }, world, at);
    sourceSession(item.course, item.session, world, at);
    numberAnswer(item.answer, at);
    foundationMath(item, at);
    numericTemplate(item, at);
    if(stage.kind === 'foundation'){
      const numbers = Array.isArray(item.answer) ? item.answer : [item.answer];
      assert(numbers.every(value => Number.isInteger(value) && value >= 0 && value <= 10),
        at + ': foundation answer leaves the 0..10 number range');
      if(item.band !== 'next' || stage.id !== 'f-ten10') assert.strictEqual(item.course, 'C0',
        at + ': foundation bands must stay inside C0');
      else {
        assert(['C0', 'C1'].includes(item.course), at + ': next band jumps beyond safe C1');
        if(item.course === 'C1'){
          assert(['NS2', 'NS3', 'AD1', 'SB1'].includes(item.thread) && item.level === 1,
            at + ': first course transition must not use three-digit NS1 or later levels');
          const givenNumbers = (item.renderData.tex.match(/\d+(?:\.\d+)?/g) || []).map(Number);
          assert(givenNumbers.every(value => value <= 10), at + ': safe first-course givens exceed ten');
        }
      }
      if(stage.id === 'f-count5' && item.band === 'previous') assert(numbers.every(value => value <= 3),
        at + ': first-stage review must use the smaller counting range');
    }
  });
  BANDS.forEach(band => assert.strictEqual(plan.items.filter(item => item.band === band).length,
    COUNTS[band], where + ': band ' + band + ' has the wrong number of questions'));
  plan.items.filter(item => item.stageId === 'f-ten10').forEach(item => {
    sourceRef({ t: 'NL6', lv: 1 }, world, where + ': ten-complement transform source');
    assert.strictEqual(item.thread, 'NL6', where + ': ten-complement must retain source thread');
    assert.strictEqual(item.level, 1, where + ': do not invent an NL6 learning level');
    assert.strictEqual(item.responseMode, 'ten-bond', where + ': independent ten-complement response required');
    assert.strictEqual(item.renderData.total, 10, where + ': ten-frame total must remain ten');
    const filled = item.renderData.filled;
    assert(Number.isInteger(filled) && filled >= 0 && filled <= 10, where + ': invalid diagnostic filled boundary');
    assert.strictEqual(item.answer, 10 - filled, where + ': independently computed ten-complement answer');
  });
  if(stage.id === 'f-ten10'){
    const current = plan.items.filter(item => item.band === 'current');
    assert.strictEqual(new Set(current.map(item => item.renderData.filled)).size, 10,
      where + ': ten current questions require ten distinct numeric relations, not prompt variants');
  }
}

function main(){
  const node = loadNode(), browser = loadBrowserVM();
  apiContract(node.api, 'Node'); apiContract(browser.api, 'browser VM');
  const stages = node.api.stages();
  assert(Array.isArray(stages) && stages.length, 'stages: nonempty array required');
  assert.strictEqual(new Set(stages.map(stage => stage.id)).size, stages.length, 'stages: duplicate IDs');
  same(stages, browser.api.stages(), 'Node/browser stage metadata differ');
  same(stages.filter(stage => stage.kind === 'foundation').map(stage => stage.id), FOUNDATION_IDS,
    'foundation: preserve the eight internal C0 stages');
  const tenStage = stages.find(stage => stage.id === 'f-ten10');
  assert(tenStage.refs.some(ref => ref.t === 'NL6' && ref.lv === 1 &&
    typeof ref.diagnosticTransform === 'string' && ref.diagnosticTransform),
    'ten-complement: approved diagnostic-only transform must be explicit in source metadata');
  stages.forEach(stage => {
    localized(stage.label, stage.id + ': label');
    assert(['foundation', 'course'].includes(stage.kind), stage.id + ': invalid stage kind');
    sourceSession(stage.course, stage.session, node.world, stage.id);
    assert(Array.isArray(stage.refs) && stage.refs.length, stage.id + ': source refs missing');
    stage.refs.forEach(ref => sourceRef(ref, node.world, stage.id));
    if(stage.kind === 'course') assert.strictEqual(stage.id, stage.course.toLowerCase(), stage.id + ': source course ID mismatch');
  });
  const foundation = stages.filter(stage => stage.kind === 'foundation');
  const courses = chooseSpread(stages.filter(stage => stage.kind === 'course'), COURSE_LIMIT);
  assert(courses.length >= Math.min(COURSE_LIMIT, stages.length - 8), 'not enough course fixtures');
  const sample = [...foundation, ...courses];
  let plans = 0, parity = 0;
  const firstPlans = [];
  sample.forEach(stage => {
    for(let i = 0; i < SEEDS; i++){
      const seed = 'placement-contract-' + i;
      const plan = node.api.build(stage.id, seed);
      checkPlan(plan, stage, seed, stages, node.world);
      same(plan, node.api.build(stage.id, seed), stage.id + ': same seed must reproduce the same plan');
      const answers = plan.items.map(item => response(item, item.answer));
      const allCorrect = checkSummary(node.api, plan, answers, node.world, stage.id + ': all correct');
      assert.strictEqual(allCorrect.correct, 20, stage.id + ': correct answers must score 20/20');
      if(i === 0){
        firstPlans.push(plan);
        const wrong = checkSummary(node.api, plan, plan.items.map(item => response(item, wrongAnswer(item.answer))),
          node.world, stage.id + ': all wrong');
        assert.strictEqual(wrong.correct, 0, stage.id + ': all wrong must score 0/20');
        const skipped = checkSummary(node.api, plan, [], node.world, stage.id + ': unanswered');
        if(stage.kind === 'foundation'){
          [wrong, skipped].forEach(summary => {
            same([summary.recommendation.course, summary.recommendation.session], ['C0', 1],
              stage.id + ': unconfirmed basics must recommend C0 session 1');
            assert(summary.recommendation.threads.some(ref => ref.t === 'NL1' && ref.lv === 1),
              stage.id + ': unconfirmed basics must recommend the source counting skill');
          });
        }
      }
      if(i < 3){
        const other = browser.api.build(stage.id, seed);
        same(plan, other, stage.id + ': Node/browser plan mismatch');
        same(allCorrect, browser.api.summarize(other, plain(answers)), stage.id + ': Node/browser grading mismatch');
        parity++;
      }
      plans++;
    }
  });

  const recommendationFixtures = [
    { baseline: 'f-compare5', previous: 'f-quantity5', t: 'NL1', lv: 3, session: 11 },
    { baseline: 'f-order10', previous: 'f-compare5', t: 'NL10', lv: 1, session: 3 },
    { baseline: 'f-ten10', previous: 'f-join9', t: 'NL2', lv: 3, session: 16 }
  ];
  recommendationFixtures.forEach(fixture => {
    const plan = node.api.build(fixture.baseline, 'review-counterexample');
    const previous = plan.items.find(item => item.band === 'previous' && item.stageId === fixture.previous &&
      item.thread === fixture.t && item.level === fixture.lv);
    assert(previous, fixture.baseline + ': source-specific previous-stage counterexample missing');
    const correct = plan.items.map(item => response(item, item.answer));
    const wrong = correct.map(value => value.id === previous.id ? response(previous, wrongAnswer(previous.answer)) : value);
    const summary = checkSummary(node.api, plan, wrong, node.world, fixture.baseline + ': 19/20 earlier-stage miss');
    assert.strictEqual(summary.correct, 19, fixture.baseline + ': fixture must be exactly 19/20');
    same([summary.recommendation.stageId, summary.recommendation.course, summary.recommendation.session],
      [fixture.previous, 'C0', 1], fixture.baseline + ': earlier skill must not be replaced by a later C0 session');
    assert(summary.recommendation.practiceSessions.some(ref => ref.course === 'C0' && ref.session === fixture.session &&
      ref.t === fixture.t && ref.lv === fixture.lv), fixture.baseline + ': retain the exact source practice session');
    same(summary, browser.api.summarize(plain(plan), plain(wrong)), fixture.baseline + ': counterexample Node/browser parity');
    const nextWrong = correct.map(value => {
      const item = plan.items.find(item => item.id === value.id);
      return item.band === 'next' ? response(item, wrongAnswer(item.answer)) : value;
    });
    const nextSummary = checkSummary(node.api, plan, nextWrong, node.world, fixture.baseline + ': next-only misses');
    assert.strictEqual(nextSummary.correct, 16, fixture.baseline + ': all four next questions must be wrong');
    assert.strictEqual(nextSummary.recommendation.stageId, fixture.baseline,
      fixture.baseline + ': next-only errors must not move the current starting point');
    const skipped = correct.map(value => value.id === previous.id ? { id: value.id, skipped: true, sec: 1 } : value);
    const skipSummary = checkSummary(node.api, plan, skipped, node.world, fixture.baseline + ': earlier-stage skip');
    assert.strictEqual(skipSummary.recommendation.stageId, fixture.baseline,
      fixture.baseline + ': an earlier skipped question is not demonstrated wrong evidence');
    same(nextSummary, browser.api.summarize(plain(plan), plain(nextWrong)), fixture.baseline + ': next-only Node/browser parity');
    same(skipSummary, browser.api.summarize(plain(plan), plain(skipped)), fixture.baseline + ': skipped Node/browser parity');
  });
  ['MX3', 'MX4'].forEach(thread => {
    const stage = stages.find(stage => stage.refs.some(ref => ref.t === thread));
    assert(stage, thread + ': source-built domain fixture missing');
    const seed = 'domain-contract-' + thread;
    const plan = node.api.build(stage.id, seed);
    checkPlan(plan, stage, seed, stages, node.world);
    assert(plan.items.some(item => item.thread === thread), thread + ': domain fixture did not generate its source thread');
    checkSummary(node.api, plan, plan.items.map(item => response(item, item.answer)), node.world, thread + ': distinct source domain');
  });

  // Exercise registered FR4 modes in a disposable VM only. Current course C20
  // sessions expose levels 1/2; fixture-only refs test 3/4 without adding a level,
  // rewriting a course file, or implying that these refs ship in that course.
  const frStage = stages.find(stage => stage.refs.some(ref => ref.t === 'FR4'));
  assert(frStage, 'FR4: no source-built course fixture available');
  const fractionVM = loadBrowserVM(world => {
    world.NM_COURSES[frStage.course].sessions[0].drills = [1, 2, 3, 4].map(lv => ({ t: 'FR4', lv, n: 1 }));
  });
  const fractionStages = fractionVM.api.stages();
  const fractionStage = fractionStages.find(stage => stage.id === frStage.id);
  const fractionCoverage = new Set();
  for(let i = 0; i < 100 && fractionCoverage.size < 5; i++){
    const seed = 'fraction-contract-' + i;
    const fractionPlan = fractionVM.api.build(fractionStage.id, seed);
    checkPlan(fractionPlan, fractionStage, seed, fractionStages, fractionVM.world);
    fractionPlan.items.filter(item => item.band === 'current' && item.thread === 'FR4').forEach(item =>
      fractionCoverage.add(item.level === 2 ? '2-' + (Array.isArray(item.answer) ? 'mixed' : 'whole') : String(item.level)));
  }
  same([...fractionCoverage].sort(), ['1', '2-mixed', '2-whole', '3', '4'],
    'FR4: numerator, mixed tuple, whole-number, split denominator, and chain denominator must all be tested');

  const plan = firstPlans[0];
  const answers = plan.items.map(item => response(item, item.answer));
  const mixed = answers.map((value, i) => i < 3 ? { id: value.id, skipped: true, sec: 4 } : value);
  checkSummary(node.api, plan, mixed, node.world, 'explicit skipped vs correct');
  checkSummary(node.api, plan, [response(plan.items[0], wrongAnswer(plan.items[0].answer), 3), ...answers],
    node.world, 'duplicate: first wrong submission wins');
  checkSummary(node.api, plan, [...answers, response(plan.items[0], wrongAnswer(plan.items[0].answer), 99)],
    node.world, 'duplicate: later wrong submission cannot overwrite correct');
  checkSummary(node.api, plan, [{ id: plan.items[0].id, skipped: true, sec: 2 }, ...answers],
    node.world, 'duplicate: first skipped submission wins');
  checkSummary(node.api, plan, [{ id: 'unknown-item', value: 42, sec: 1 }, ...answers],
    node.world, 'unknown response ID is not a twenty-first item');

  const countItem = firstPlans.flatMap(value => value.items).find(item => item.responseMode === 'count-tap');
  assert(countItem, 'counting fixture: independent target-validation mode missing');
  const countPlan = firstPlans.find(value => value.items.some(item => item.id === countItem.id));
  [undefined, { validTargets: false }].forEach(flags => {
    const value = { id: countItem.id, value: countItem.answer, sec: 5, skipped: false };
    if(flags) value.validationFlags = flags;
    checkSummary(node.api, countPlan, [value], node.world, 'count-tap: matching number without valid targets is not correct');
  });

  // A summary accepts actual numeric tuples, including more than one negative.
  // This tests the data API, not whether a rendered keyboard can enter them.
  const tuplePlan = plain(plan);
  tuplePlan.items[0].answer = [-2, -8, 12, -40];
  tuplePlan.items[0].responseMode = 'array';
  const tupleResponses = tuplePlan.items.map(item => response(item, item.answer));
  checkSummary(node.api, tuplePlan, tupleResponses, node.world, 'multiple negative array components');
  const badTuple = plain(tupleResponses); badTuple[0].value = [-2, 8, 12, -40];
  checkSummary(node.api, tuplePlan, badTuple, node.world, 'array sign mismatch');
  const shortTuple = plain(tupleResponses); shortTuple[0].value = [-2, -8, 12];
  checkSummary(node.api, tuplePlan, shortTuple, node.world, 'array length mismatch');
  ['-2,-8,12,-40', '[−2, −8, 12, −40]', '－２，－８，１２，－４０'].forEach(value => {
    const entered = plain(tupleResponses); entered[0].value = value;
    const graded = node.api.summarize(tuplePlan, entered);
    assert.strictEqual(graded.correct, 20, 'multiple negative text input failed: ' + value);
    assert.strictEqual(graded.profile[0].ok, true, 'multiple negative text input was not graded correctly');
    same(graded, browser.api.summarize(plain(tuplePlan), plain(entered)), 'Node/browser text-array grading mismatch');
  });
  same(node.api.summarize(tuplePlan, tupleResponses), browser.api.summarize(plain(tuplePlan), plain(tupleResponses)),
    'Node/browser negative-array grading mismatch');
  same(learningLevels(node.world), node.levelsBefore, 'diagnosis must not add or change source learning levels');
  const termAudit=loadBrowserVM(undefined,true),termModes=new Set();let termFixtures=0;
  for(const level of termAudit.world.NM_THREADS.DV7.levels)for(let i=0;i<20;i++){
    const ref={t:'DV7',lv:level.id},original=termAudit.api._auditSource(ref,'curriculum-term-'+i),before=plain(original);
    const q=termAudit.api._auditAdapt(ref,original,false);
    assert(q,'curriculum terms: supported divisor/multiple question rejected');
    assert(!/\b(?:GCD|LCM)\b/.test(q.prompt.en),'curriculum terms: acronym exposed in test question');
    same(q.prompt,{...original.prompt,en:original.prompt.en.replace(/\bGCD\b/g,'greatest common divisor').replace(/\bLCM\b/g,'least common multiple')},'curriculum terms: preserve complete question semantics');
    same(original,before,'curriculum terms: do not mutate learning generator');same(q.answer,original.answer,'curriculum terms: answer invariant');
    if(/greatest common divisor/.test(q.prompt.en))termModes.add('divisor');
    if(/least common multiple/.test(q.prompt.en))termModes.add('multiple');termFixtures++;
  }
  same([...termModes].sort(),['divisor','multiple'],'curriculum terms: both full terms require coverage');
  const curatedFixtures=checkCuratedPrompts();
  const branch=checkBranchConditions();
  const bijectionUniqueness=checkMD127Bijection();
  const conditionFixtures=checkPromptConditions()+curatedFixtures+branch.branches+branch.uniqueFactors+branch.normalization+bijectionUniqueness;

  console.log(`PLACEMENT_PLAN_OK mode=${QUICK ? 'quick' : 'full'} seeds=${SEEDS} foundation=${foundation.length} courses=${courses.length} plans=${plans} browserParity=${parity} conditionFixtures=${conditionFixtures} curatedFixtures=${curatedFixtures} branchFixtures=${branch.branches} integerUniqueness=${branch.uniqueFactors} leadingZeroInputs=${branch.normalization} bijectionUniqueness=${bijectionUniqueness}`);
  console.log('Verified: 20 questions, 6/10/4, independent foundation math, unique source items, final blank templates, FR4 cues, first submissions, skips, target flags, negative tuples, ordered learner-stage recommendations, exact source practice sessions, C0 map session 1; curriculum term fixtures='+termFixtures+'. Browser UI is a separate gate.');
}

try { main(); }
catch(error){
  console.error('PLACEMENT_PLAN_FAIL: ' + error.message);
  process.exitCode = 1;
}
