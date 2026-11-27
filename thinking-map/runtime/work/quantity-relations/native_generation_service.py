"""Reuse pinned native generators and separate verifiers without reopening completed books."""
import copy,hashlib,json,re,secrets,subprocess,threading
from functools import lru_cache
from pathlib import Path
from soma_parameter_schema import ParameterError
from native_runtime_proof import magic

W=Path(__file__).resolve().parent;O=W.parents[1]/'outputs'
NODE='/Users/docssam/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node'
read=lambda p:json.loads(p.read_text());sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
vsha=lambda x:hashlib.sha256(json.dumps(x,ensure_ascii=False,sort_keys=True).encode()).hexdigest()
FILES=['native_generation_service.py','native_runtime_proof.py','native-runtime-worker.mjs','native-reused-verifiers.mjs']
def fingerprints():return{n:sha(W/n)for n in FILES}|{'native-runtime-config.json':sha(O/'native-runtime-config.json')}
LOADED=fingerprints()
GENERATION_LOCK=threading.Lock()
def config():return read(O/'native-runtime-config.json')
def supports(tid):return isinstance(tid,str)and any(r['typeId']==tid for r in config()['generators'])
def validate(tid,params):
 if not supports(tid)or not isinstance(params,dict)or set(params)-{'nativeTypeId','setting','seed'}:raise ParameterError('유형과 문제 구성을 확인해 주세요.')
 choices=[r for r in config()['generators']if r['typeId']==tid];nid=params.get('nativeTypeId',choices[0]['nativeTypeId']);r=next((r for r in choices if r['nativeTypeId']==nid),None)
 if not r:raise ParameterError('이 유형에 연결된 문제 구성을 골라 주세요.',{'nativeTypeId':'문제 구성을 다시 골라 주세요.'})
 setting=params.get('setting',1);seed=params.get('seed',secrets.randbelow(2**31))
 if type(setting)is not int or setting not in r['settings']:raise ParameterError('허용된 문제 구성을 골라 주세요.',{'setting':'이 형태에서 확인한 구성을 골라 주세요.'})
 if type(seed)is not int or not 0<=seed<=2147483647:raise ParameterError('문항의 재현 값을 확인해 주세요.')
 return r,dict(nativeTypeId=nid,setting=setting,seed=seed)
def check_activation():
 m=read(O/'native-runtime-manifest.json')
 if not m.get('passed')or m['codeHashes']!=fingerprints()or LOADED!=fingerprints():raise RuntimeError('기존 생성기 연결의 검증 버전을 맞추고 실행 서버를 다시 열어 주세요.')
 return m['fingerprint']
def schema():
 rows=config()['generators'];ids=list(dict.fromkeys(r['typeId']for r in rows))
 return dict(types=[dict(typeId=tid,models=[dict(nativeTypeId=r['nativeTypeId'],name=r['name'],settings=r['settings'])for r in rows if r['typeId']==tid])for tid in ids],generatorCount=len(rows))
@lru_cache(maxsize=1)
def existing(version):
 data=read(O/'quantity-crossbook-bank.json');index={}
 for s in data['specimens']:
  visual=s.get('visualMarkup','')
  if s.get('studentPresentation',{}).get('supportDiagramRemoved'):visual=''
  if s['proposedTypeId']=='SQ05':visual=re.sub(r'<strong>[^<]*</strong>','',visual)
  if s['problem'].get('visual',{}).get('subtype')=='magic-grid':visual=re.sub(r'<strong>한 줄의 합[^<]*</strong>','',visual)
  index[(s['proposedTypeId'],s['problem']['prompt'],visual)]=s['instanceId']
 return index
def construct(tid,parameters):
 r,p=validate(tid,parameters);run=subprocess.run([NODE,str(W/'native-runtime-worker.mjs')],input=json.dumps(dict(typeId=tid,**p)),text=True,capture_output=True,timeout=15,check=True,cwd=W.parents[1]);out=json.loads(run.stdout)
 problem=out['problem'];cert=out['certificate']
 if tid.startswith('MG'):cert['visibleMagicProof']=magic(problem,tid)
 assert problem['answer']and problem['solution']and out['pinnedDependenciesChecked']>=50
 assert not re.search(r'<(?:script|iframe)\b|\bon\w+\s*=',out['visualMarkup'],re.I)
 kind='complete-grid-multiple-valid-placements'if tid=='MG01'else'number-sequence-blanks'if tid in ['SQ01','SQ02','SQ04']else'number-value'
 identity=vsha(dict(typeId=tid,prompt=problem['prompt'],visual=out['visualMarkup'],kind=kind))
 minimum=r['minimumCapabilities'];reason='새 조건의 수 범위·응답·발판을 교사가 확인하기 전까지 난도를 보류합니다.'
 capability_status='type-reference-needs-instance-review';profile=dict(numberRangeNote='현재 지문·그림에 주어진 수의 범위와 단위를 확인합니다.',operations=minimum)
 if tid=='MG03':
  shown=problem['visual']['shown'];given=[x for x in shown if type(x)is int]
  if len(shown)==16 and len(given)==15 and len(set(given))==15 and all(1<=x<=16 for x in given) and '1부터 16까지' in problem['prompt'] and '한 번씩' in problem['prompt']:
   missing=next(x for x in range(1,17)if x not in given);assert int(problem['answer'])==missing
   minimum=['1부터 16까지의 수 읽기','각 수를 한 번씩 쓴다는 조건 이해','주어진 15개 수와 전체 수 목록을 비교해 빠진 수 찾기']
   capability_status='visible-single-missing-inventory-route-checked'
   profile=dict(numberRangeNote='학생에게 주어진 수의 범위는 1~16입니다. 한 줄 합 34는 이 풀이의 필수 선수 수가 아닙니다.',operations=[],requiredActions=minimum,
    sufficientRoute='주어진 수와 1~16 목록을 비교한다.',alternativeRoute='완성된 줄의 합을 구하고 빈칸이 있는 줄에서 보이는 세 수를 뺀다.',
    notMandatoryForThisRoute=['네 수의 덧셈','34에서 세 수 빼기'],minimumGradeAssigned=False)
 s=dict(instanceId='native-parameter:'+r['nativeTypeId']+':'+identity[:20],typeId=r['nativeTypeId'],proposedTypeId=tid,name=r['name'],problem=problem,visualMarkup=out['visualMarkup'],solutionVisualMarkup=out['solutionVisualMarkup'],nativeParameterGenerated=True,generationParameters=p,
  origin='checked-existing-native-generator',generatorId=out['generatorId'],bankParameter=p['setting'],seed=p['seed'],commonBandCandidate=None,matchStatus='related'if 'related'in r['relationship']else'direct-conditional',sourceItemIds=r['sourceItemIds'],sourcePositionIds=r['sourceItemIds'],
  studentResponseContract=dict(kind=kind,oneScalarOnly=kind=='number-value',otherValidPlacementsAllowed=tid=='MG01'),
  normalization=dict(stage='checked-native-runtime',candidateBand=None,minimumCapabilities=minimum,minimumCapabilitiesStatus=capability_status,requiresVisualContext=bool(out['visualMarkup']),teacherApproved=False,sourceQuestionEquivalenceApproved=False,prerequisiteGradeAssigned=False,difficultyReason=reason,bandHold=reason),
  computationalProfile=profile,
  validation=dict(independentAnswerCheck=True,status='native-instance-checked',explanation=problem['solution'],verificationArtifact='native-runtime-manifest.json',responseCertificateSHA256=vsha(cert),answerContentSHA256=vsha(out),generatorFunctionSHA256=out['generatorFunctionSHA256']))
 source=O/'quantity-crossbook-bank.json';prior=existing((source.stat().st_mtime_ns,source.stat().st_size)).get((tid,problem['prompt'],out['visualMarkup']))
 if prior:s['instanceId']=prior;s['equivalentExistingInstanceId']=prior
 if out['helperDiagramRemoved']:s['studentPresentation']=dict(supportDiagramRemoved=True,currentBandCandidate=None,difficultyStatus='scaffold-removed-review-required')
 return s
@lru_cache(maxsize=256)
def cached(tid,params,version):return construct(tid,json.loads(params))
def generate(tid,parameters,require_activation=True):
 version=check_activation()if require_activation else vsha(fingerprints());r,p=validate(tid,parameters)
 with GENERATION_LOCK:
  before=cached.cache_info();s=copy.deepcopy(cached(tid,json.dumps(p,sort_keys=True),version));after=cached.cache_info()
 return dict(example=s,receipt=dict(typeId=tid,parameters=p,generatorBuildFingerprint=version,cacheHit=after.hits>before.hits,mathAndGeometryChecked=True,sourceQuestionEquivalenceApproved=False,automaticStudentScoringApproved=False,externalRequests=0))
