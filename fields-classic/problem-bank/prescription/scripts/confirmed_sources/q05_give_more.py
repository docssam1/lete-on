import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import os, math

FONT='/usr/share/fonts/truetype/nanum/NanumBarunGothicBold.ttf'
fp=fm.FontProperties(fname=FONT)
plt.rcParams['axes.unicode_minus']=False
os.makedirs('/tmp/q05_out',exist_ok=True)

def draw_cube(ax, cx, cy, s=0.34):
    """아이소메트릭 큐브 (교재 스타일)"""
    top = [[cx,cy+s],[cx+s*0.86,cy+s*0.5],[cx,cy],[cx-s*0.86,cy+s*0.5]]
    left = [[cx-s*0.86,cy+s*0.5],[cx,cy],[cx,cy-s],[cx-s*0.86,cy-s*0.5]]
    right= [[cx,cy],[cx+s*0.86,cy+s*0.5],[cx+s*0.86,cy-s*0.5],[cx,cy-s]]
    ax.add_patch(plt.Polygon(top,  fc='#a8c8e8', ec='#5a7fa8', lw=1.1, zorder=3))
    ax.add_patch(plt.Polygon(left, fc='#f5d5b8', ec='#5a7fa8', lw=1.1, zorder=3))
    ax.add_patch(plt.Polygon(right,fc='#e8b896', ec='#5a7fa8', lw=1.1, zorder=3))

problems = [
    {'total':15, 'diff':7,  'name1':'시유', 'name2':'라임', 'answer':11},
    {'total':18, 'diff':4,  'name1':'준호', 'name2':'다인', 'answer':11},
    {'total':24, 'diff':6,  'name1':'예린', 'name2':'태오', 'answer':15},
]

PER_ROW = 6
GAP_X, GAP_Y = 0.82, 0.82

for i, d in enumerate(problems, 1):
    n = d['total']
    rows = math.ceil(n / PER_ROW)
    FIG_H = rows * 0.75 + 0.25
    fig, ax = plt.subplots(figsize=(5.6, FIG_H), dpi=130)
    ax.set_xlim(0, 5.6); ax.set_ylim(0, FIG_H); ax.axis('off'); ax.set_aspect('equal')

    top_y = FIG_H - 0.45
    total_w = (PER_ROW-1)*GAP_X
    x0 = 2.8 - total_w/2

    for idx in range(n):
        r, c = divmod(idx, PER_ROW)
        draw_cube(ax, x0 + c*GAP_X, top_y - r*GAP_Y)

    plt.savefig(f'/tmp/q05_out/q05_{i:02d}.png', bbox_inches='tight',
                pad_inches=0.2, facecolor='white')
    plt.close()
    with open(f'/tmp/q05_out/q05_{i:02d}.txt','w') as af: af.write(str(d['answer']))
    print(f"후보{i}: 전체{d['total']}개, {d['name1']}가 {d['name2']}보다 {d['diff']}개 더 많이 → 정답 {d['answer']}개")
