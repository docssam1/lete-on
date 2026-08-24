import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import numpy as np, os, sys
sys.path.insert(0, '/tmp')
from animals_v2 import draw_animal

FONT='/usr/share/fonts/truetype/nanum/NanumBarunGothicBold.ttf'
fp=fm.FontProperties(fname=FONT)
plt.rcParams['axes.unicode_minus']=False
os.makedirs('/tmp/q08_out',exist_ok=True)

def draw_seesaw(ax, cx, cy, left_name, right_name, heavier):
    L, tilt = 1.70, 0.34
    dy = tilt if heavier=='right' else -tilt

    # 바닥
    ax.plot([cx-L-0.35, cx+L+0.35],[cy-0.62]*2, color='#8a9199', lw=3.5, zorder=1)
    # 받침대
    ax.add_patch(plt.Polygon([[cx,cy+0.02],[cx-0.36,cy-0.62],[cx+0.36,cy-0.62]],
                             fc='#9aa2ab', ec='#5b6169', lw=1.5, zorder=2))
    # 판
    x1,y1 = cx-L, cy-dy
    x2,y2 = cx+L, cy+dy
    ax.plot([x1,x2],[y1,y2], color='#b5834f', lw=7, solid_capstyle='round', zorder=3)
    ax.plot([x1,x2],[y1,y2], color='#d9a66c', lw=3, solid_capstyle='round', zorder=4)

    # 동물 + 이름
    for (px,py,name) in [(x1,y1,left_name),(x2,y2,right_name)]:
        draw_animal(ax, px, py+0.62, name, s=0.52, z0=10)
        ax.text(px, py-0.14, name, ha='center', va='top',
                fontsize=11, color='#333', fontproperties=fp, zorder=30)

def render(pairs, path):
    n = len(pairs)
    fig, ax = plt.subplots(figsize=(n*4.0, 2.9), dpi=130)
    ax.set_xlim(0, n*4.0); ax.set_ylim(-1.05, 1.85)
    ax.axis('off'); ax.set_aspect('equal')
    for i,(l,r,h) in enumerate(pairs):
        draw_seesaw(ax, 2.0 + i*4.0, 0.15, l, r, h)
    plt.savefig(path, bbox_inches='tight', pad_inches=0.2, facecolor='white')
    plt.close()

problems = [
    {'pairs':[('거북','토끼','left'), ('곰','거북','left')],
     'answer':'토끼, 거북, 곰'},
    {'pairs':[('여우','너구리','right'), ('너구리','다람쥐','left')],
     'answer':'다람쥐, 여우, 너구리'},
    {'pairs':[('사슴','늑대','left'), ('늑대','오리','left'), ('사슴','호랑이','right')],
     'answer':'호랑이, 사슴, 늑대, 오리'},
]

for i,d in enumerate(problems,1):
    render(d['pairs'], f'/tmp/q08_out/q08_{i:02d}.png')
    with open(f'/tmp/q08_out/q08_{i:02d}.txt','w') as af: af.write(str(d['answer']))
    print(f"후보{i}: {d['answer']}")
