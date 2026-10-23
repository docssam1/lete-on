#!/usr/bin/env node
/* 마법 노트 영상(data/magic-note-videos.js) 검사 — 그림이 아니라 state(t)로 센다.
   콘티(docs/n01-magic-note-storyboard.html)의 약속을 0.02초 간격으로 확인한다:
   양 수 = 주머니 속 돌 수, 병아리는 늘 다섯, 짚기 1번 = 수 이름 1개 = 배지 1개, 흩어질 때 겹치지 않음. */
'use strict';
const assert=require('assert');
const V=require('../data/magic-note-videos.js');
const v=V.get('N-01');
assert(v,'N-01 video missing');
const DT=0.02,EPS=1e-9;
let samples=0;
const scenes=new Set();
const cueWords=v.cues.filter(c=>'word' in c);
for(let i=0;i*DT<=v.duration+EPS;i++){
  const t=+(i*DT).toFixed(4),s=v.state(t,'ko');samples++;scenes.add(s.scene);
  const shown=k=>s.objects.filter(o=>o.kind===k&&o.show);
  const exp=v.expect[s.scene];
  if(s.scene==='s1'){
    const sheep=s.objects.filter(o=>o.kind==='sheep');
    assert.strictEqual(sheep.length,3,`t=${t} sheep objects`);
    const away=sheep.filter(o=>o.away).length,inPouch=s.objects.filter(o=>o.kind==='pebble'&&o.inPouch).length;
    assert.strictEqual(inPouch,away,`t=${t} pebbles in pouch ${inPouch} != sheep away ${away}`);
    assert.strictEqual(shown('sheep').length+away,3,`t=${t} sheep shown+away != 3`);
  }
  if(exp&&exp.chick){
    assert.strictEqual(shown('chick').length,exp.chick,`t=${t} ${s.scene} chicks`);
    // 배지는 짚은 수만큼만(지운 중인 잘못된 배지는 'bad'로 따로 센다)
    const okBadges=s.objects.filter(o=>o.badge&&o.tone==='ok'&&o.fade>0.5).length;
    if(s.scene==='s2'){
      const touched=v.touches.s2.filter(x=>t>=x).length;
      assert.strictEqual(okBadges,touched,`t=${t} s2 badges ${okBadges} != touches ${touched}`);
    }
    if(s.scene==='s4'){
      const touched=v.touches.s4.filter(x=>t>=x).length;
      assert.strictEqual(okBadges,touched,`t=${t} s4 badges ${okBadges} != touches ${touched}`);
      const c=s.objects;
      for(let a=0;a<5;a++)for(let b=a+1;b<5;b++){
        const d=Math.hypot(c[a].x-c[b].x,(c[a].y-c[b].y)*0.75);
        assert(d>=9,`t=${t} chicks ${a},${b} overlap (${d.toFixed(2)})`);
      }
    }
    // 배지 숫자는 1..5 중복 없이(s3b 의 '3·4'는 일부러 틀린 장면)
    const nums=s.objects.filter(o=>o.badge&&o.tone==='ok').map(o=>o.badge);
    assert.strictEqual(new Set(nums).size,nums.length,`t=${t} duplicate badge ${nums}`);
  }
  if(exp&&exp.big&&s.big)assert.strictEqual(s.big.text,exp.big,`t=${t} big number`);
  if(s.scene==='s3'&&t>=33)assert(s.big&&s.lasso===1,`t=${t} s3 total not shown`);
}
['s0','s1','s2','s3','s3b','s4','s5'].forEach(id=>assert(scenes.has(id),'scene never shown: '+id));
// 수 이름 소리 = 짚기. 같은 순간, 같은 순서.
const touchesAll=[...v.touches.s2,...v.touches.s3b.slice(0,4),...v.touches.s4];
const wordTimes=cueWords.map(c=>c.t);
assert.deepStrictEqual(wordTimes,[...touchesAll].sort((a,b)=>a-b),'number-word cues must match touch times');
[[v.touches.s2,[0,1,2,3,4]],[v.touches.s3b.slice(0,4),[0,1,2,3]],[v.touches.s4,[0,1,2,3,4]]].forEach(([times,idx])=>{
  times.forEach((t,i)=>{const c=cueWords.find(x=>x.t===t);assert.strictEqual(c.word,idx[i],`cue at ${t} should say ${idx[i]+1}`);});
});
// 짚기 전에는 숫자가 미리 나오지 않는다
v.touches.s2.forEach((k,i)=>{const s=v.state(k-0.01,'ko');assert(!s.objects[i].badge,`badge ${i+1} visible before touch`);});
// 대사 사이 간격 — 다음 대사가 앞 대사를 끊지 않도록 글자 수로 어림(0.8배속, 초당 약 5.6자)
const lines=v.cues.filter(c=>!('word' in c));
lines.forEach((c,i)=>{
  const next=v.cues.find(x=>x.t>c.t);
  if(!next)return;
  const need=c.text.ko.replace(/\s/g,'').length/5.6;
  assert(next.t-c.t>=need*0.9,`line "${c.key}" (${need.toFixed(1)}s) is cut by the next cue after ${(next.t-c.t).toFixed(1)}s`);
});
// 세 언어 자막이 모두 있다
lines.forEach(c=>['ko','en','zh'].forEach(l=>assert(c.text[l],`missing ${l} for ${c.key}`)));
console.log(`MAGIC_NOTE_VIDEO_OK N-01 duration=${v.duration}s samples=${samples} scenes=${scenes.size} wordCues=${wordTimes.length} lines=${lines.length}`);
