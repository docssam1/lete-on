#!/usr/bin/env python3
import re, os, subprocess, sys

DEST = 'hyper-focus/renderers/paper_fold.html'
SRC_PATH = 'fields-classic/question-bank/paper-fold-lab.html'

HF_ADAPTER = """
/* HF variation 어댑터: machineReadable → 엔진 파라미터, 확정 재현 */
const HF_FOLD_MAP = { vertical_half:'v', horizontal_half:'h',
                      diagonal_main:'d1', diagonal_anti:'d2' };

function hfBuildHole(mr){
  const dirs = (mr.foldSequence||[]).map(f=>HF_FOLD_MAP[f]||f);
  const nHoles = mr.punchCount || 1;
  let poly=[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}];
  const stages=[];
  for(const d of dirs){ stages.push({poly, fold:d}); poly=clipHalfPlane(poly, FOLDS[d].keep); }
  stages.push({poly, fold:null});
  const holes=[]; const cx=centroid(poly); const spread=0.12;
  for(let i=0;i<nHoles;i++){
    const ang=(i/nHoles)*Math.PI*2;
    holes.push({x:Math.min(0.9,Math.max(0.1,cx.x+Math.cos(ang)*spread*(nHoles>1?1:0))),
                y:Math.min(0.9,Math.max(0.1,cx.y+Math.sin(ang)*spread*(nHoles>1?1:0)))});
  }
  let pts=holes.map(h=>({...h}));
  for(let i=dirs.length-1;i>=0;i--){
    const mirror=FOLDS[dirs[i]].mirror; const next=[...pts];
    for(const p of pts){ const r=mirror(p);
      if(!next.some(q=>Math.hypot(q.x-r.x,q.y-r.y)<1e-6)) next.push(r); }
    pts=next;
  }
  const times=['','한 번','두 번','세 번'][dirs.length];
  const diagonal = dirs.some(d=>d==='d1'||d==='d2');
  return { kind:'hole', dirs, stages, holes, unfolded:pts, nHoles, answer:pts.length,
    text:[`아래와 같이 색종이를 ${diagonal?'대각선을 따라':'반으로'} ${times} 접은 다음 구멍을 ${nHoles}개 뚫었습니다.`,
          '색종이를 펼쳤을 때, 구멍은 모두 몇 개입니까?'],
    info:`접기 ${dirs.length}회 · 구멍 ${nHoles}개`, src:'' };
}
function hfBuildNumber(mr){
  const grid = mr.grid?.values || mr.grid;
  const hDir = mr.hDir || 'up', vDir = mr.vDir || 'left';
  return genNumber(false, { grid, hDir, vDir, cell:{r:0,c:0} });
}
function hfRenderVariation(variation){
  const q = variation.baseQuestionId, mr = variation.machineReadable;
  let d;
  if(q==='q12') d = hfBuildHole(mr);
  else if(q==='q11') d = hfBuildNumber(mr);
  else { console.warn('미지원 유형', q); return; }
  render(d); return d;
}
window.hfRenderVariation = hfRenderVariation;
"""

def git_show(ref):
    r = subprocess.run(['git', 'show', f'{ref}:{SRC_PATH}'],
                       capture_output=True, text=True, encoding='utf-8')
    return r.stdout if r.returncode == 0 else None

def main():
    c = git_show('main') or git_show('origin/main')
    if not c:
        sys.exit(f'ERROR: {SRC_PATH} 을 main 또는 origin/main 에서 찾을 수 없음')

    c = c.replace('<title>색종이 접기 렌더 테스트 v7</title>',
                  '<title>HF 색종이 접기 렌더러</title>')
    c = re.sub(r"'출처[^']*'", "''", c)
    c = c.replace("'교재 재현: 더클래식 1과정 1권 41쪽 확인03 — 검증용'", "''")

    marker = '\nnewProblem();\n'
    idx = c.rfind(marker)
    if idx == -1:
        sys.exit('ERROR: newProblem(); 삽입 위치를 찾을 수 없음')
    c = c[:idx] + HF_ADAPTER + c[idx:]

    assert '<title>HF 색종이 접기 렌더러</title>' in c
    assert "src:'출처" not in c
    assert 'window.hfRenderVariation = hfRenderVariation' in c
    assert c.rstrip().endswith('</html>')

    os.makedirs(os.path.dirname(DEST), exist_ok=True)
    with open(DEST, 'w', encoding='utf-8') as f:
        f.write(c)
    print(f'OK: {DEST} ({len(c.encode())} bytes)')

    subprocess.run(['git', 'add', DEST], check=True)
    subprocess.run(['git', 'commit', '-m',
        'feat: HF 색종이 접기 렌더러 (v7 엔진 재사용 + variation 어댑터, 출처 제거)'],
        check=True)
    print('커밋 완료.')

if __name__ == '__main__':
    main()
