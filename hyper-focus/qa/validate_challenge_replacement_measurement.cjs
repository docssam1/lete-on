'use strict';

const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const measurement=require('../challenge/variant-replacement-measurement.js');

const LEVELS=['easy','same','hard'];
const KINDS=['balance-substitution-pictures','object-length-equivalence'];
const EXPECTED_STEPS={
  'balance-substitution-pictures':[1,2,3],
  'object-length-equivalence':[2,3,4]
};
const fixture=kind=>Object.freeze({
  typeId:'qa-'+kind,
  domain:'측정',
  number:kind==='balance-substitution-pictures'?3:14,
  payload:Object.freeze({kind})
});

function coefficient(terms,key){return Number(terms[key]||0);}
function solveUniqueWeights(objects,equations,unitKey){
  const keys=objects.map(object=>object.key);
  const matrix=equations.map(equation=>[
    ...keys.map(key=>coefficient(equation.left,key)-coefficient(equation.right,key)),
    0
  ]);
  matrix.push([...keys.map(key=>key===unitKey?1:0),1]);
  let row=0;
  for(let column=0;column<keys.length&&row<matrix.length;column++){
    let pivot=row;
    while(pivot<matrix.length&&Math.abs(matrix[pivot][column])<1e-10)pivot++;
    if(pivot===matrix.length)continue;
    [matrix[row],matrix[pivot]]=[matrix[pivot],matrix[row]];
    const divisor=matrix[row][column];
    matrix[row]=matrix[row].map(value=>value/divisor);
    for(let other=0;other<matrix.length;other++){
      if(other===row||Math.abs(matrix[other][column])<1e-10)continue;
      const multiple=matrix[other][column];
      matrix[other]=matrix[other].map((value,index)=>value-multiple*matrix[row][index]);
    }
    row++;
  }
  assert.equal(row,keys.length,'등가식이 모든 물건의 길이 또는 무게를 하나로 정하지 못합니다.');
  const result={};
  for(let index=0;index<keys.length;index++){
    const pivotRow=matrix.find(candidate=>Math.abs(candidate[index]-1)<1e-10&&candidate.slice(0,keys.length).every((value,column)=>column===index||Math.abs(value)<1e-10));
    assert.ok(pivotRow,keys[index]+'의 값을 독립적으로 풀지 못했습니다.');
    const value=pivotRow[keys.length];
    assert.ok(value>0&&Math.abs(value-Math.round(value))<1e-10,keys[index]+'의 값이 양의 정수가 아닙니다.');
    result[keys[index]]=Math.round(value);
  }
  return result;
}

function termTotal(terms,values){return Object.entries(terms).reduce((total,[key,count])=>total+values[key]*count,0);}

function solve(question){
  assert.ok(question&&question.payload,'검산할 측정 문항 payload가 필요합니다.');
  const payload=question.payload;
  if(payload.kind==='balance-substitution-pictures'){
    assert.ok(Array.isArray(payload.objects)&&Array.isArray(payload.equations)&&payload.query,'저울 등가식 정보가 빠졌습니다.');
    const values=solveUniqueWeights(payload.objects,payload.equations,payload.query.targetKey);
    for(const equation of payload.equations)assert.equal(termTotal(equation.left,values),termTotal(equation.right,values),'수평 저울의 양쪽 무게가 다릅니다.');
    const answer=termTotal(payload.query.left,values)/values[payload.query.targetKey];
    assert.ok(Number.isInteger(answer)&&answer>0,'마지막 저울의 하트 수가 하나의 양의 정수가 아닙니다.');
    return answer;
  }
  if(payload.kind==='object-length-equivalence'){
    assert.ok(Array.isArray(payload.objects)&&Array.isArray(payload.relationships)&&payload.query,'물건 길이 등가식 정보가 빠졌습니다.');
    const values=solveUniqueWeights(payload.objects,payload.relationships,payload.query.unitKey);
    for(const relationship of payload.relationships)assert.equal(termTotal(relationship.left,values),termTotal(relationship.right,values),'양끝을 맞춘 두 줄의 길이가 다릅니다.');
    const answer=values[payload.query.objectKey]*payload.query.objectCount/values[payload.query.unitKey];
    assert.ok(Number.isInteger(answer)&&answer>0,'연필의 클립 단위 길이가 하나의 양의 정수가 아닙니다.');
    return answer;
  }
  throw new Error('지원하지 않는 측정 문항 payload입니다.');
}

function assertCommon(question,source,difficulty,seed){
  assert.equal(question.typeId,source.typeId);
  assert.equal(question.difficulty,difficulty);
  assert.equal(question.seed,seed);
  assert.equal(question.payload.kind,source.payload.kind);
  assert.equal(question.payload.sourceTypeId,source.typeId);
  assert.equal(question.resultContract,'single-value');
  assert.deepEqual(question.answerCandidates,[question.answer]);
  assert.ok(Number.isInteger(question.answer)&&question.answer>0,'답은 하나의 양의 정수여야 합니다.');
  assert.equal(question.answerHtml,question.answer+'개');
  assert.match(question.problemHtml,/^<svg\b/);
  assert.match(question.problemHtml,/role="img"/);
  assert.doesNotMatch(question.problemHtml+/\n/+question.solutionDiagram,/undefined|NaN/);
  assert.ok(Object.isFrozen(question)&&Object.isFrozen(question.payload),'생성 결과는 깊게 동결되어야 합니다.');
  assert.equal(question.variant.family,'replacement-measurement');
  assert.equal(question.variant.measurementFamily,source.payload.kind);
  assert.equal(question.learnerFit.status,'candidate');
}

function validateBalance(question,difficulty){
  const payload=question.payload;
  assert.match(question.solution,/^가장 가벼운 도형인 하트에 1을 써 봅시다\./);
  assert.match(question.prompt,/마지막 저울/);
  assert.match(question.prompt,/하트를 몇 개/);
  assert.match(question.problemHtml,/data-query="true"/);
  assert.match(question.problemHtml,/aria-label="하트를 몇 개 놓을지 묻는 접시"/);
  assert.equal((question.problemHtml.match(/class="measurement-balance/g)||[]).length,payload.equations.length+1);
  assert.equal(payload.equations.length,LEVELS.indexOf(difficulty)+1);
  assert.equal(payload.reasoningSteps,EXPECTED_STEPS[payload.kind][LEVELS.indexOf(difficulty)]);
  assert.equal(payload.query.targetKey,'H');
  assert.equal(payload.objects.find(object=>object.key==='H').kind,'heart');
  const values=solveUniqueWeights(payload.objects,payload.equations,'H');
  for(const equation of payload.equations)assert.equal(termTotal(equation.left,values),termTotal(equation.right,values),'수평 저울의 양쪽 무게가 다릅니다.');
  const independentlySolved=termTotal(payload.query.left,values)/values[payload.query.targetKey];
  assert.ok(Number.isInteger(independentlySolved),'마지막 하트 수가 정수가 아닙니다.');
  assert.equal(solve(question),independentlySolved,'공용 solve 결과가 저울 독립 풀이와 다릅니다.');
  assert.equal(question.answer,independentlySolved,'저울 독립 풀이와 저장 답이 다릅니다.');
  return JSON.stringify({equations:payload.equations,query:payload.query});
}

function validateLength(question,difficulty){
  const payload=question.payload;
  assert.match(question.prompt,/연필 1자루/);
  assert.match(question.prompt,/클립 몇 개/);
  for(const label of ['연필','지우개','클립']){
    assert.match(question.problemHtml,new RegExp('aria-label="'+label+'"'),label+' 그림이 없습니다.');
  }
  assert.equal(payload.relationships.length,2);
  assert.equal(payload.reasoningSteps,EXPECTED_STEPS[payload.kind][LEVELS.indexOf(difficulty)]);
  assert.deepEqual(payload.query,{objectKey:'P',unitKey:'C',objectCount:1});
  const values=solveUniqueWeights(payload.objects,payload.relationships,'C');
  for(const relationship of payload.relationships)assert.equal(termTotal(relationship.left,values),termTotal(relationship.right,values),'양끝을 맞춘 두 줄의 길이가 다릅니다.');
  const independentlySolved=values[payload.query.objectKey]*payload.query.objectCount/values[payload.query.unitKey];
  assert.ok(Number.isInteger(independentlySolved),'연필의 클립 단위 길이가 정수가 아닙니다.');
  assert.equal(solve(question),independentlySolved,'공용 solve 결과가 길이 독립 풀이와 다릅니다.');
  assert.equal(question.answer,independentlySolved,'길이 독립 풀이와 저장 답이 다릅니다.');
  if(difficulty==='easy')assert.equal(payload.relationships[1].right.E,1);
  if(difficulty==='same')assert.equal(payload.relationships[1].right.E,2);
  if(difficulty==='hard'){
    assert.equal(payload.relationships[1].left.P,2);
    assert.equal(payload.relationships[1].right.E,3);
    assert.match(question.solution,/÷2/);
  }
  return JSON.stringify({relationships:payload.relationships,query:payload.query});
}

function run(){
  assert.equal(measurement.VERSION,'replacement-measurement-20260912-v2');
  assert.equal(measurement.supports(null),false);
  assert.equal(measurement.supports({payload:{kind:'shortest-path-grid'}}),false);
  assert.deepEqual(measurement.levels({payload:{kind:'shortest-path-grid'}}),{easy:false,same:false,hard:false});
  assert.deepEqual(measurement.notes({payload:{kind:'shortest-path-grid'}}),[]);
  assert.throws(()=>measurement.generate({payload:{kind:'shortest-path-grid'}},'same',0),/지원하지 않는/);
  assert.throws(()=>measurement.generate(fixture(KINDS[0]),'expert',0),/난이도/);
  assert.throws(()=>measurement.generate(fixture(KINDS[0]),'same',-1),/seed/);
  assert.throws(()=>measurement.generate(fixture(KINDS[0]),'same',4294967296),/seed/);
  assert.throws(()=>measurement.generate(fixture(KINDS[0]),'same',1.5),/seed/);

  const sourceCode=fs.readFileSync(path.resolve(__dirname,'../challenge/variant-replacement-measurement.js'),'utf8');
  assert.doesNotMatch(sourceCode,/Math\.random/,'seed 밖의 난수가 있으면 재현할 수 없습니다.');

  const report={version:measurement.VERSION,cases:0,minimumUnique:Infinity,coverage:{}};
  for(const kind of KINDS){
    const source=fixture(kind),before=JSON.stringify(source);
    assert.equal(measurement.supports(source),true);
    assert.deepEqual(measurement.levels(source),{easy:true,same:true,hard:true});
    assert.equal(measurement.notes(source).length,3);
    report.coverage[kind]={};
    for(const difficulty of LEVELS){
      const models=new Set();
      for(let seed=0;seed<120;seed++){
        const question=measurement.generate(source,difficulty,seed);
        assert.deepEqual(question,measurement.generate(source,difficulty,seed),'같은 seed가 다른 문항을 만들었습니다.');
        assertCommon(question,source,difficulty,seed);
        models.add(kind==='balance-substitution-pictures'?validateBalance(question,difficulty):validateLength(question,difficulty));
        report.cases++;
      }
      const unique=models.size;
      assert.ok(unique>=24,`${kind} ${difficulty}: 고유 모델이 ${unique}개뿐입니다.`);
      report.minimumUnique=Math.min(report.minimumUnique,unique);
      report.coverage[kind][difficulty]={seeds:120,unique};
    }
    assert.equal(JSON.stringify(source),before,'원본 source가 변경되었습니다.');
  }

  const maxSeedQuestion=measurement.generate(fixture(KINDS[1]),'hard',4294967295);
  assert.equal(maxSeedQuestion.seed,4294967295);
  return report;
}

if(require.main===module)console.log('CHALLENGE_REPLACEMENT_MEASUREMENT_OK '+JSON.stringify(run()));
module.exports={solve,solveUniqueWeights,run};
