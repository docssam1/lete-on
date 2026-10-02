'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..'),ctx=vm.createContext({window:{},console});
for(const f of fs.readdirSync(path.join(root,'data/units')).filter(f=>f.endsWith('.js')))
 vm.runInContext(fs.readFileSync(path.join(root,'data/units',f),'utf8'),ctx);
vm.runInContext(fs.readFileSync(path.join(root,'data/symbol-dex.js'),'utf8'),ctx);
const existing={'+':'plus','=':'equal','−':'minus','×':'times','÷':'divide','√':'sqrt','%':'percent','π':'pi','Σ':'sigma','∞':'infinity'};
const names={'Ⅹ':'roman-ten','.':'decimal-point','□':'unknown-box','²':'squared','½':'half','≈':'approximately','aⁿ':'power','|x|':'absolute-value','!':'factorial','ₙCᵣ':'combination','∈':'member','∪':'union','∩':'intersection','f⁻¹':'inverse-function','e':'euler','°':'degree','θ':'theta','sin':'sine','D':'discriminant','αβ':'alpha-beta','⊥':'perpendicular','∥':'parallel','ⁿ√':'nth-root','log':'logarithm','lim':'limit',"f'":'derivative','d/dx':'differentiate','∫':'integral','x':'variable','∴':'therefore','≤':'less-or-equal','(x, y)':'coordinates','f(x)':'function','x̄':'mean','σ':'standard-deviation','i':'imaginary-unit','0':'zero','<':'less-than','>':'greater-than'};
const intents={'Ⅹ':'열을 나타내는 대칭 X 모양. 곱하기 ×와 구별되는 곧은 세리프 기호.','.':'작은 둥근 점, 숫자 사이의 자리 구분을 지킨다.','□':'가운데가 빈 정사각형, 눈이나 장식으로 빈칸을 막지 않는다.','²':'작은 2를 오른쪽 위에 둔다. 아래 큰 2와 혼동하지 않는다.','½':'가로 분수선 위 1, 아래 2의 위치와 크기를 유지한다.','≈':'같은 길이의 물결 두 줄, 등호와 혼동하지 않는다.','aⁿ':'a 오른쪽 위에 작은 n. 지수를 몸통 위로 띄운다.','|x|':'x 양쪽 세로 막대는 같은 높이·같은 거리.','!':'세로 막대와 아래 점을 분리한다.','ₙCᵣ':'n은 C 왼쪽 아래, r은 오른쪽 아래.','∈':'입 벌어진 방향을 오른쪽으로 유지한다.','∪':'위가 열린 U, 교집합과 혼동하지 않는다.','∩':'아래가 열린 아치, 합집합과 혼동하지 않는다.','f⁻¹':'f 오른쪽 위의 −1을 지킨다.','e':'둥근 소문자 e. 대문자 E·숫자 3과 구별한다.','°':'작은 빈 동그라미, 소수점과 구별한다.','θ':'타원 안 가로 줄을 지킨다.','sin':'s i n 세 글자를 정확히 유지한다.','D':'대문자 D의 직선·곡선 실루엣을 지킨다.','αβ':'알파와 베타는 따로 알아볼 수 있게 나란히 둔다.','⊥':'밑줄과 세로줄이 직각으로 만난다.','∥':'동일 길이 평행 세로 막대 둘.','ⁿ√':'작은 n은 루트 왼쪽 위. 루트의 윗줄을 막지 않는다.','log':'l o g 세 글자를 정확히 유지한다.','lim':'l i m 세 글자를 정확히 유지한다.',"f'":'f 오른쪽 위에 프라임 하나. 쉼표와 구별한다.','d/dx':'분수선 위 d, 아래 dx.','∫':'세로로 긴 부드러운 적분 기호. S와 구별한다.','x':'소문자 x, 곱셈 기호 ×와 구별한다.','∴':'삼각형으로 배치한 점 셋.','≤':'작다 기호 아래 가로 줄 하나.','(x, y)':'괄호·쉼표·x y 순서를 정확히 지킨다.','f(x)':'f와 괄호 안 x의 읽는 순서를 지킨다.','x̄':'x 바로 위 가로 줄을 지킨다.','σ':'소문자 시그마, 대문자 Σ와 구별한다.','i':'소문자 i의 위 점을 지킨다.','0':'신규 제작하지 않고 공식 누미 0 그림을 재사용한다.','<':'왼쪽이 뾰족하다.','>':'오른쪽이 뾰족하다.'};
const found=[];
for(const [unit,u] of Object.entries(ctx.window.NM_UNITS))for(const s of u.symbols||[])
 if(!found.some(t=>t.glyph===s.sym))found.push({glyph:s.sym,unit,read:typeof s.read==='string'?s.read:s.read.ko});
assert.equal(found.length,49);
const missing=found.filter(s=>!existing[s.glyph]);assert.equal(missing.length,39);
const briefs=missing.map(s=>{
 const id=names[s.glyph];assert(id,'No filename for '+s.glyph);assert(intents[s.glyph]);
 return {...s,id,file:`sym-${id}.png`,status:s.glyph==='0'?'reuse-existing':'brief-only',constraint:intents[s.glyph],
  prompt:`Create ONE transparent square 512px character body for the mathematics symbol ${JSON.stringify(s.glyph)}. Same warm orange/cream, navy and purple storybook 3D jelly material as Numi, Poco and Momo. Centered full body, 6 percent safe margin, clean silhouette at 40px. Keep the central symbol display area empty: the application will typeset the exact symbol from source data. No generated lettering or equations, no extra digits, no ground shadow, no watermark. Shape constraint: ${intents[s.glyph]}`};
});
const md=['# 기호 도감 추가 39종 작화 지시서','',
 '실제 유닛·도감 데이터 49개를 대조한 결과다. 기존 기호 PNG 10종은 유지한다. 아래 39종은 **작화 지시서 완료, 신규 이미지 미제작** 상태다. 0은 기존 누미를 재사용한다.','',
 '공통: 투명 PNG 512×512, 같은 젤리 재질, 정면 전신, 여백 6%, 40px에서 구별. 숫자·기호는 정확한 글꼴로 별도 합성한다. AI가 생성한 기호를 정답이나 학습 내용으로 쓰지 않는다. 기호 도감은 용어 설명 자리이며 학생 문제에 교육과정 밖 약어를 새로 넣는 근거가 아니다.','',
 '| 파일 | 기호·읽기 | 처음 만나는 유닛 | 반드시 지킬 모양 |','| --- | --- | --- | --- |',
 ...briefs.map(s=>`| ${s.file} | ${s.glyph.replace(/\|/g,'&#124;')} · ${s.read} | ${s.unit} | ${s.constraint} |`),'',
 '## 납품 확인','',
 '- 배경 알파·512px·여백·실루엣 확인.','- 원 기호를 40px에서도 정확히 읽는지 확인. x/×, Σ/σ, ∪/∩, </>는 반드시 나란히 비교.','- 이미지가 아직 없는 카드는 지금처럼 원문 기호를 유지한다. 빈 이미지 자리로 바꾸지 않는다.','- 개별 프롬프트와 상태는 `symbol-art-briefs.json`에 보관한다.'];
const dir=path.join(root,'docs');fs.mkdirSync(dir,{recursive:true});
const outputs={'symbol-art-briefs.json':JSON.stringify({total:49,existing:10,briefs},null,2)+'\n','symbol-art-briefs.md':md.join('\n')+'\n'};
for(const [name,body]of Object.entries(outputs)){
 const file=path.join(dir,name);
 if(process.argv.includes('--check'))assert.equal(fs.readFileSync(file,'utf8'),body,'Stale '+name);
 else fs.writeFileSync(file,body);
}
console.log('PASS — symbol dex 49; existing art 10; additional briefs 39 (not 39 completed images)');
