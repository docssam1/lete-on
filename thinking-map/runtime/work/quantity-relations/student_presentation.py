"""Preserve the established student scaffold removal and held difficulty before any export."""
def apply_student_presentations(data):
    helper_types={'equalize-transfer-b8','total-difference','total-difference-bars-b8','sum-multiple-bars-b8','difference-multiple-bars-b8'}
    for item in data['specimens']:
        if item['typeId'] in helper_types:
            item['studentPresentation']={'supportDiagramRemoved':True,'baselineBandPreserved':item['commonBandCandidate'],'currentBandCandidate':None,'difficultyStatus':'scaffold-removed-review-required','reason':'설명용 막대가 있던 기존 조건부 난도는 보존하고, 막대를 뺀 학생용 조건의 난도는 재판정 전까지 보류한다.'}
    affected={s['instanceId'] for s in data['specimens'] if s.get('studentPresentation',{}).get('supportDiagramRemoved')}
    for link in data['difficultyLinks']:
        if link['instanceId'] in affected:link['studentPresentationComparison']='scaffold-removed-review-required; baseline comparison preserved'
    data['summary']['studentScaffoldRemovedExamples']=len(affected)
