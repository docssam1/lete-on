import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, Polygon
import matplotlib.font_manager as fm
import os

FONT='/usr/share/fonts/truetype/nanum/NanumBarunGothicBold.ttf'
fp=fm.FontProperties(fname=FONT)
plt.rcParams['axes.unicode_minus']=False
os.makedirs('/tmp/q14_out',exist_ok=True)

C = 0.85  # 칸 크기

def render(grid, tri_pos, path):
    """grid: 3x3 (None=빈칸), tri_pos: (r,c) △ 위치"""
    fig, ax = plt.subplots(figsize=(3.4, 3.4), dpi=130)
    ax.set_xlim(0, 3*C+0.3); ax.set_ylim(0, 3*C+0.3)
    ax.axis('off'); ax.set_aspect('equal')

    for r in range(3):
        for c in range(3):
            x = 0.15 + c*C
            y = 0.15 + (2-r)*C
            ax.add_patch(Rectangle((x, y), C, C, fc='white', ec='#333', lw=1.6, zorder=3))
            if (r,c) == tri_pos:
                # △ 기호
                s = 0.22
                ax.add_patch(Polygon([[x+C/2, y+C/2+s],
                                      [x+C/2+s*1.05, y+C/2-s*0.75],
                                      [x+C/2-s*1.05, y+C/2-s*0.75]],
                                     fill=False, ec='#222', lw=1.8, zorder=5))
            elif grid[r][c] is not None:
                ax.text(x+C/2, y+C/2, str(grid[r][c]), ha='center', va='center',
                        fontsize=17, color='#222', fontproperties=fp, zorder=5)

    plt.savefig(path, bbox_inches='tight', pad_inches=0.18, facecolor='white')
    plt.close()

# ── 마방진 완전체 (합 S) 기준으로 일부만 노출 ──
def magic(a, d):
    """중앙 a, 공차 d 기반 3x3 마방진. 합 = 3a"""
    return [[a-d, a+3*d, a-2*d],
            [a-3*d, a,   a+3*d],
            [a+2*d, a-3*d, a+d]]

# 실제로는 표준 마방진 사용
def std_magic(base, step):
    """표준 3x3 마방진 변형: 1~9 → base + (n-1)*step"""
    m = [[8,1,6],[3,5,7],[4,9,2]]
    return [[base + (v-1)*step for v in row] for row in m]

problems = [
    # 후보1: 원본과 동일 구조 (합 30)
    {'full': [[None,None,None],[6,10,14],[8,None,None]],
     'tri': (2,1), 'answer': 18, 'S': 30},
    # 후보2: 합 36 (중앙 12)
    {'full': [[None,None,None],[7,12,17],[10,None,None]],
     'tri': (2,1), 'answer': 21, 'S': 36},
    # 후보3: 합 45 (중앙 15) — 난이도↑
    {'full': [[None,None,None],[9,15,21],[12,None,None]],
     'tri': (2,1), 'answer': 27, 'S': 45},
]

for i,d in enumerate(problems,1):
    render(d['full'], d['tri'], f'/tmp/q14_out/q14_{i:02d}.png')
    with open(f'/tmp/q14_out/q14_{i:02d}.txt','w') as af: af.write(str(d['answer']))
    print(f"후보{i}: 합={d['S']} → △={d['answer']}")
