"""Local-only, bounded generation with a separate answer/geometry check on every new request."""
import copy,hashlib,json,threading,re,xml.etree.ElementTree as ET
from functools import lru_cache
from pathlib import Path
from soma_parameter_schema import F,ParameterError,validate,export_schema
from soma_variant_models import create
from soma_variant_proofs import inspect
from soma_computational_profile import profile

W=Path(__file__).resolve().parent;O=W.parents[1]/'outputs'
read=lambda p:json.loads(p.read_text());vsha=lambda x:hashlib.sha256(json.dumps(x,ensure_ascii=False,sort_keys=True).encode()).hexdigest()
CODE=['soma_parameter_schema.py','soma_variant_models.py','soma_variant_figures.py','soma_authoring_figures.py','soma_variant_proofs.py','soma_authoring_proofs.py','soma_computational_profile.py','soma_generation_service.py']

@lru_cache(maxsize=1)
def cached_sources(version):
 pack=read(O/'soma-type-authored-examples.json');proof=read(W/'soma-authoring-answer-check.json');assert proof['passed']and proof['contentSHA256']==vsha(pack)
 return{e['proposedTypeId']:e for e in pack['examples']}

def sources():
 p=O/'soma-type-authored-examples.json';return cached_sources((p.stat().st_mtime_ns,p.stat().st_size))

@lru_cache(maxsize=1)
def existing_questions(version):
 return{(s['proposedTypeId'],s['problem']['prompt'],visual_identity(s['visualMarkup'])):s['instanceId']for s in read(O/'soma-constrained-variants.json')['examples']}

def visual_identity(markup):
 if not markup:return''
 root=ET.fromstring(re.search(r'<svg\b.*?</svg>',markup,re.S)[0])
 def node(e):return(e.tag,sorted((k,v)for k,v in e.attrib.items()if k not in['data-index','data-x','data-y','data-col','data-row']),e.text or'',sorted((node(c)for c in e),key=repr))
 return vsha(node(root))

def schema():return export_schema({tid:s['name']for tid,s in sources().items()})
def fingerprints():return{n:hashlib.sha256((W/n).read_bytes()).hexdigest()for n in CODE}
LOADED_CODE_HASHES=fingerprints()

def check_activation():
 path=O/'soma-parameter-generator-manifest.json'
 if not path.exists():raise RuntimeError('조건 생성 검증 자료를 준비하고 있습니다.')
 m=read(path)
 if not m.get('passed')or m.get('codeHashes')!=fingerprints()or m.get('codeHashes')!=LOADED_CODE_HASHES:raise RuntimeError('생성 규칙이 바뀌어 검증 기록을 갱신하고 실행 서버를 다시 열어야 합니다.')
 if m['fixedModelsSHA256']!=hashlib.sha256((O/'soma-type-authored-examples.json').read_bytes()).hexdigest():raise RuntimeError('기존 검산 모형과 생성 규칙의 버전을 맞춰 주세요.')
 if m['finitePoolSHA256']!=hashlib.sha256((O/'soma-constrained-variants.json').read_bytes()).hexdigest():raise RuntimeError('기존 변형 문항과 생성 규칙의 버전을 맞춰 주세요.')
 return m['fingerprint']

def construct(tid,parameters):
 params=validate(tid,parameters);base=sources()[tid];r=create(tid,0,base,params);s=copy.deepcopy(base)
 identity=vsha(dict(typeId=tid,prompt=r['prompt'],visualMarkup=visual_identity(r['visual']),responseKind=s['studentResponseContract']['kind']))
 s.update(instanceId='soma-parameter:'+tid.lower()+':'+identity[:20],somaAuthoringNewExample=False,somaGeneratedVariant=True,somaParameterGenerated=True,origin='parameter-checked-soma-generation',generatedFrom=base['instanceId'],configuration='조건 입력',problem=dict(prompt=r['prompt'],answer=r['answer'],solution=r['solution']),visualMarkup=r['visual'],solutionVisualMarkup=r['answerVisual'],responseModel=r['model'],answerData=r['response'],generationParameters=params,commonBandCandidate=r['candidateBand'])
 for k in['verifiedGeometryReuse','promptMarkup','answerMarkup','explanationMarkup']:s.pop(k,None)
 s['normalization'].update(stage='soma-constrained-generation',candidateBand=r['candidateBand'],fixedModelBandReference=base['commonBandCandidate'],bandHold=r['bandHold'],requiresVisualContext=bool(r['visual']),difficultyReason=(r['bandHold']or r['candidateReason'])+' 이 조건의 연구 후보이며 교사 승인과 원문 난도 동등성은 별도입니다.')
 reduced=None
 if tid=='RT07'and r['model']['circleCount']==1:reduced=(2,'원 한 개의 위/아래 두 선택에 익힌 관계를 적용합니다.')
 if tid=='TR12'and set(map(tuple,r['model']['givenCells']))==set(map(tuple,r['response']['union'])):reduced=(2,'회전한 뒤에도 같은 색칠 모양임을 확인하는 한 관계를 적용합니다.')
 if tid=='FC23'and len(r['model']['points'])==4:reduced=(2,'표시된 네 점을 모두 쓰는 한 가지 도형 조건을 확인합니다.')
 if tid=='OP12'and len(r['response']['values'])==1:reduced=(2,'세 눈이 같아 한 결과만 생기는 계산 약속을 적용합니다.')
 if tid=='NS20'and r['model']['lower']==r['model']['upper']:reduced=(1,'주어진 한 수의 홀짝과 개수를 직접 읽습니다.')
 if reduced:s['commonBandCandidate']=reduced[0];s['normalization'].update(candidateBand=reduced[0],difficultyReason=reduced[1]+' 이 조건의 연구 후보이며 교사 승인은 별도입니다.')
 cp=profile(tid,r['model'],r['response']);s['computationalProfile']=cp
 caps=copy.deepcopy(base['normalization']['minimumCapabilities'])
 if tid=='MG13':caps[0]=f'{r["model"]["first"]}~{r["model"]["first"]+24}의 수 순서'
 if tid=='UA38'and r['response']['domino']is None:caps.append('2씩 묶었을 때 남는 칸 구별')
 s['normalization']['minimumCapabilities']=caps
 path=O/'soma-constrained-variants.json';existing=existing_questions((path.stat().st_mtime_ns,path.stat().st_size)).get((tid,s['problem']['prompt'],visual_identity(s['visualMarkup'])))
 if existing:s['instanceId']=existing;s['equivalentExistingInstanceId']=existing
 certificate=inspect(s)
 s['validation']=dict(independentAnswerCheck=True,status='parameter-instance-independently-checked',explanation=r['solution'],verificationArtifact='soma-parameter-generator-manifest.json',responseCertificateSHA256=vsha(certificate),answerContentSHA256=vsha(dict(model=s['responseModel'],response=s['answerData'],problem=s['problem'],visual=s['visualMarkup'],solutionVisual=s['solutionVisualMarkup'])))
 return s

@lru_cache(maxsize=256)
def cached_construct(tid,canonical_parameters,version):return construct(tid,json.loads(canonical_parameters))

GENERATE_LOCK=threading.Lock()

def generate(tid,parameters,require_activation=True):
 version=check_activation()if require_activation else vsha(fingerprints())
 params=validate(tid,parameters);key=json.dumps(params,ensure_ascii=False,sort_keys=True)
 with GENERATE_LOCK:
  before=cached_construct.cache_info();s=copy.deepcopy(cached_construct(tid,key,version));after=cached_construct.cache_info()
 return dict(example=s,receipt=dict(typeId=tid,parameters=params,generatorBuildFingerprint=version,cacheHit=after.hits>before.hits,reusedExistingVariant=bool(s.get('equivalentExistingInstanceId')),mathAndGeometryChecked=True,automaticStudentScoringApproved=False,sourceQuestionEquivalenceApproved=False,externalRequests=0,schoolGradeAssigned=False))
