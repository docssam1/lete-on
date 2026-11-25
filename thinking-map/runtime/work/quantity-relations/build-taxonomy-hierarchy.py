"""Add a non-destructive navigation hierarchy using user direction and existing source references."""
import hashlib,json
from pathlib import Path
O=Path('outputs');bank=O/'quantity-crossbook-bank.json';before=hashlib.sha256(bank.read_bytes()).hexdigest();d=json.loads(bank.read_text());types={t['id']:t for t in d['types']}
nodes=[dict(id='area-expression',level='major',name='식의 계산',parentId=None,evidence='user-proposed-classification',reviewStatus='candidate'),
 dict(id='topic-inclusion-exclusion',level='middle',name='포함과 배제',parentId='area-expression',evidence='user-proposed-classification',reviewStatus='candidate'),
 dict(id='topic-two-set-venn',level='minor',name='두 집합의 벤다이어그램',parentId='topic-inclusion-exclusion',evidence='existing-two-set-response-and-user-direction',reviewStatus='candidate')]
groups=[
 dict(id='type-two-set-overlap',name='겹치는 부분의 수',description='두 조건에 모두 해당하는 수를 구합니다.',legacyTypeIds=['VN02','VN06'],conditions=[dict(id='VN02',name='전체가 적어도 한쪽에 속할 때'),dict(id='VN06',name='어느 쪽에도 속하지 않는 수가 있을 때')]),
 dict(id='type-two-set-union',name='적어도 한쪽에 속하는 수',description='두 조건 중 하나 이상에 해당하는 수를 구합니다.',legacyTypeIds=['VN03'],conditions=[dict(id='VN03',name='겹치는 수가 주어질 때')]),
 dict(id='type-two-set-exactly-one',name='한쪽에만 속하는 수',description='두 조건 중 한 가지만 해당하는 수를 구합니다.',legacyTypeIds=['VN04'],conditions=[dict(id='VN04',name='두 조건에 모두 해당하는 수를 제외할 때')]),
 dict(id='type-two-set-neither',name='어느 쪽에도 속하지 않는 수',description='두 조건에 하나도 해당하지 않는 수를 구합니다.',legacyTypeIds=['VN05'],conditions=[dict(id='VN05',name='전체 수와 각 조건의 수가 주어질 때')])]
assignments=[]
for group in groups:
 nodes.append(dict(id=group['id'],level='type',name=group['name'],parentId='topic-two-set-venn',reviewStatus='candidate'))
 for tid in group['legacyTypeIds']:
  assert tid in types
  refs=[r['id']for r in d['lookupCorpus']if tid in r.get('typeIds',[])]
  assignments.append(dict(legacyTypeId=tid,taxonomyTypeId=group['id'],path=['area-expression','topic-inclusion-exclusion','topic-two-set-venn',group['id']],sourcePositionIds=refs,status='navigation-candidate-original-id-retained'))
assigned={a['legacyTypeId']for a in assignments}
coverage=[dict(typeId=t['id'],family=t['family'],status='path-candidate'if t['id']in assigned else'existing-family-browse-until-hierarchy-reviewed')for t in d['types']]
result=dict(schema='thinking-bank-taxonomy-navigation/v1',nodes=nodes,typeGroups=groups,assignments=assignments,coverage=coverage,
 relatedActivities=[dict(typeId='VN01',name='조건에 따라 분류하기'),dict(typeId='VN08',name='특징을 기호로 나타내기'),dict(typeId='VN07',name='여러 모둠에서 전체 수 구하기')],
 reviewStatus='candidate-not-publisher-or-teacher-approved-hierarchy',classificationMeaning='소속 관계이며 필수 선수 순서·난도 상승을 뜻하지 않음.',
 exclusionEvidence=dict(typeId='VN07',reason='기존 대표에 두 모둠과 네 모둠이 함께 있어 두 집합으로 일괄 배치하지 않음.'),
 canonicalTypesPreserved=len(types),candidatePaths=len(assignments),sourceResearchReopened=False,originalTypeIDsMerged=False,newTypeOrQuestionCount=0)
(O/'taxonomy-hierarchy.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');assert hashlib.sha256(bank.read_bytes()).hexdigest()==before
print('Hierarchy navigation:5existing IDs/4display groups;450existing types preserved,canonical bank unchanged.')
