import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, Polygon, Rectangle, FancyBboxPatch
import matplotlib.font_manager as fm
import numpy as np, os

FONT='/usr/share/fonts/truetype/nanum/NanumBarunGothicBold.ttf'
fp=fm.FontProperties(fname=FONT)
plt.rcParams['axes.unicode_minus']=False
os.makedirs('/tmp/q10_out',exist_ok=True)

C = 0.62   # 칸 크기
GREEN='#3d8b40'; LIGHT='#e8f5e9'

def shape(ax, x, y, kind, s=0.20, color='#2c5f2d'):
    if kind=='○': ax.add_patch(Circle((x,y), s, fill=False, ec=color, lw=2, zorder=5))
    elif kind=='□': ax.add_patch(Rectangle((x-s,y-s), s*2, s*2, fill=False, ec=color, lw=2, zorder=5))
    elif kind=='◇': ax.add_patch(Polygon([[x,y+s*1.15],[x+s*1.15,y],[x,y-s*1.15],[x-s*1.15,y]],
                                          fill=False, ec=color, lw=2, zorder=5))
    elif kind=='△': ax.add_patch(Polygon([[x,y+s*1.1],[x+s*1.1,y-s*0.8],[x-s*1.1,y-s*0.8]],
                                          fill=False, ec=color, lw=2, zorder=5))

def cell(ax, x, y, fill=False, ec='#6aab6d'):
    ax.add_patch(Rectangle((x,y), C, C,
        fc=LIGHT if fill else 'white', ec=ec, lw=1.5, zorder=3))

def num(ax, x, y, v, color='#2c5f2d', fs=15):
    ax.text(x+C/2, y+C/2, str(v), ha='center', va='center',
            fontsize=fs, color=color, fontproperties=fp, zorder=6)

def render(d, path):
    fig, ax = plt.subplots(figsize=(8.2, 3.4), dpi=130)
    ax.set_xlim(0, 8.2); ax.set_ylim(0, 3.4)
    ax.axis('off'); ax.set_aspect('equal')

    # ═══ [보기] 박스 ═══
    bx, by = 0.35, 0.55
    ax.add_patch(FancyBboxPatch((bx-0.22, by-0.30), 3.35, 2.55,
        boxstyle="round,pad=0.08", fc='white', ec='#6aab6d', lw=1.6, zorder=1))
    ax.text(bx+1.45, by+2.42, '[보기]', ha='center', fontsize=11,
            color='#2c5f2d', fontproperties=fp, zorder=7)

    ex = d['ex']   # 보기: 2x2 숫자 + 합
    # 2x2 격자
    for r in range(2):
        for c in range(2):
            cell(ax, bx+c*C, by+C+(1-r)*C)
            num(ax, bx+c*C, by+C+(1-r)*C, ex['grid'][r][c])
    # 오른쪽 행합
    for r in range(2):
        cell(ax, bx+2*C, by+C+(1-r)*C, fill=True)
        num(ax, bx+2*C, by+C+(1-r)*C, ex['rowsum'][r])
        ax.text(bx+3*C+0.10, by+C+(1-r)*C+C/2,
                f"← {ex['grid'][r][0]}+{ex['grid'][r][1]}",
                ha='left', va='center', fontsize=9.5, color='#5a5a5a',
                fontproperties=fp, zorder=7)
    # 아래 열합
    for c in range(2):
        cell(ax, bx+c*C, by, fill=True)
        num(ax, bx+c*C, by, ex['colsum'][c])
        ax.text(bx+c*C+C/2, by-0.16, '↑', ha='center', va='top',
                fontsize=11, color='#5a5a5a', zorder=7)
        ax.text(bx+c*C+C/2, by-0.34,
                f"{ex['grid'][0][c]}+{ex['grid'][1][c]}",
                ha='center', va='top', fontsize=9, color='#5a5a5a',
                fontproperties=fp, zorder=7)

    # ═══ 문제 표 ═══
    qx, qy = 4.6, 0.75
    pr = d['prob']
    rows = len(pr['shapes'])
    for r in range(rows):
        for c in range(2):
            cell(ax, qx+c*C, qy+(rows-1-r)*C)
            shape(ax, qx+c*C+C/2, qy+(rows-1-r)*C+C/2, pr['shapes'][r][c])
        # 행합
        cell(ax, qx+2*C, qy+(rows-1-r)*C, fill=True)
        num(ax, qx+2*C, qy+(rows-1-r)*C, pr['rowsum'][r], color='#c0392b')
    # 아래 열합
    for c in range(2):
        cell(ax, qx+c*C, qy-C, fill=True)
        if pr['colsum'][c] is None:
            ax.text(qx+c*C+C/2, qy-C+C/2, '㉠', ha='center', va='center',
                    fontsize=15, color='#c0392b', fontproperties=fp, zorder=6)
        else:
            num(ax, qx+c*C, qy-C, pr['colsum'][c], color='#c0392b')

    plt.savefig(path, bbox_inches='tight', pad_inches=0.2, facecolor='white')
    plt.close()

# ══════════ 3문제 ══════════
problems = [
    # 후보1: 원본과 동일 구조 (◇○ / □○)
    {'ex':{'grid':[[5,4],[3,7]], 'rowsum':[9,10], 'colsum':[8,11]},
     'prob':{'shapes':[['◇','○'],['□','○']], 'rowsum':[17,21], 'colsum':[None,24]},
     'vals':{'◇':5,'○':12,'□':9}, 'answer':14},
    # 후보2
    {'ex':{'grid':[[6,2],[4,8]], 'rowsum':[8,12], 'colsum':[10,10]},
     'prob':{'shapes':[['△','□'],['○','□']], 'rowsum':[13,19], 'colsum':[None,16]},
     'vals':{'△':5,'□':8,'○':11}, 'answer':16},
    # 후보3: 난이도↑ (3행)
    {'ex':{'grid':[[7,3],[5,6]], 'rowsum':[10,11], 'colsum':[12,9]},
     'prob':{'shapes':[['○','◇'],['◇','□']], 'rowsum':[15,17], 'colsum':[None,17]},
     'vals':{'○':9,'◇':6,'□':11}, 'answer':15},
]

for i,d in enumerate(problems,1):
    render(d, f'/tmp/q10_out/q10_{i:02d}.png')
    # 검증: 도형값으로 행합/열합 확인
    v = d['vals']; pr = d['prob']
    ok_row = all(v[pr['shapes'][r][0]]+v[pr['shapes'][r][1]]==pr['rowsum'][r]
                 for r in range(len(pr['shapes'])))
    col0 = sum(v[pr['shapes'][r][0]] for r in range(len(pr['shapes'])))
    col1 = sum(v[pr['shapes'][r][1]] for r in range(len(pr['shapes'])))
    ok_col = (col1 == pr['colsum'][1])
    with open(f'/tmp/q10_out/q10_{i:02d}.txt','w') as af: af.write(str(d['answer']))
    print(f"후보{i}: ㉠={col0} (기대 {d['answer']}) · 행합 {'OK' if ok_row else '❌'} · 열합 {'OK' if ok_col else '❌'}")
