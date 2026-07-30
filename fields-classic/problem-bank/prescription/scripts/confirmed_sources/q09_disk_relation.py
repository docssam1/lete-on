import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import numpy as np, os

FONT='/usr/share/fonts/truetype/nanum/NanumBarunGothicBold.ttf'
fp=fm.FontProperties(fname=FONT)
plt.rcParams['axes.unicode_minus']=False
os.makedirs('/tmp/q09_out',exist_ok=True)

def draw_disk(ax, cx, cy, vals, center, blank_idx=None, R=1.0):
    """vals: [좌상, 우상, 우하, 좌하] 순서, center: 가운데 수"""
    # 바깥 원
    ax.add_patch(plt.Circle((cx,cy), R, fill=False, ec='#333', lw=2.2, zorder=3))
    # 안쪽 원
    ax.add_patch(plt.Circle((cx,cy), R*0.36, fc='white', ec='#333', lw=2.2, zorder=4))
    # 십자선 (안쪽원 ~ 바깥원)
    for ang in (0, 90, 180, 270):
        a = np.radians(ang)
        ax.plot([cx+R*0.36*np.cos(a), cx+R*np.cos(a)],
                [cy+R*0.36*np.sin(a), cy+R*np.sin(a)],
                color='#333', lw=2, zorder=3)
    # 바깥 수 (좌상, 우상, 우하, 좌하)
    pos = [(-0.60, 0.60), (0.60, 0.60), (0.60, -0.60), (-0.60, -0.60)]
    for i,(dx,dy) in enumerate(pos):
        is_blank = (i == blank_idx)
        txt = '' if is_blank else str(vals[i])
        ax.text(cx+dx*R, cy+dy*R, txt, ha='center', va='center',
                fontsize=19, fontweight='bold',
                color='#333', fontproperties=fp, zorder=5)
    # 가운데 수
    ax.text(cx, cy, str(center), ha='center', va='center',
            fontsize=19, fontweight='bold', color='#333',
            fontproperties=fp, zorder=6)

def render(disks, path):
    """disks: [(vals, center, blank_idx), ...]"""
    n = len(disks)
    fig, ax = plt.subplots(figsize=(n*2.6, 2.7), dpi=130)
    ax.set_xlim(0, n*2.6); ax.set_ylim(-1.35, 1.35)
    ax.axis('off'); ax.set_aspect('equal')
    for i,(vals, center, blank) in enumerate(disks):
        draw_disk(ax, 1.3 + i*2.6, 0, vals, center, blank, R=1.0)
    plt.savefig(path, bbox_inches='tight', pad_inches=0.2, facecolor='white')
    plt.close()

# 규칙: 마주보는 두 수의 합 = 가운데
#   좌상(0)↔우하(2), 우상(1)↔좌하(3)
problems = [
    # ── 후보1: 덧셈 (마주보는 두 수의 합 = 가운데)
    {'disks':[([2,5,4,1], 6, None), ([7,5,1,3], 8, None), ([6,8,4,2], 10, 3)],
     'rule':'add', 'answer':2},
    # ── 후보2: 덧셈 (수 범위 ↑)
    {'disks':[([5,2,6,9], 11, None), ([4,8,10,6], 14, None), ([7,5,9,11], 16, 3)],
     'rule':'add', 'answer':11},
    # ── 후보3: 뺄셈 (마주보는 두 수의 차 = 가운데)
    {'disks':[([9,7,4,2], 5, None), ([8,6,3,1], 5, None), ([11,9,6,4], 5, 3)],
     'rule':'sub', 'answer':4},
]

for i,d in enumerate(problems,1):
    render(d['disks'], f'/tmp/q09_out/q09_{i:02d}.png')
    # 검증
    if d['rule']=='add':
        ok = all(v[0]+v[2]==c and v[1]+v[3]==c for v,c,_ in d['disks'])
    else:
        ok = all(abs(v[0]-v[2])==c and abs(v[1]-v[3])==c for v,c,_ in d['disks'])
    with open(f'/tmp/q09_out/q09_{i:02d}.txt','w') as af: af.write(str(d['answer']))
    print(f"후보{i}: [{d['rule']}] 정답 {d['answer']} · 검증 {'OK' if ok else '❌'}")
