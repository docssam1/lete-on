import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, Polygon, Rectangle
import matplotlib.font_manager as fm
import os

FONT='/usr/share/fonts/truetype/nanum/NanumBarunGothicBold.ttf'
fp=fm.FontProperties(fname=FONT)
plt.rcParams['axes.unicode_minus']=False
os.makedirs('/tmp/q12_out',exist_ok=True)

def shape(ax, x, y, kind, s=0.20):
    """kind: ▲(채운삼각) ■(채운사각) △(빈삼각) □(빈사각) ○(빈원) ●(채운원) ◇(빈마름모) ◆(채운마름모)"""
    filled = kind in '▲■●◆'
    fc = '#222' if filled else 'none'
    ec = '#222'
    lw = 1.8
    if kind in '▲△':
        ax.add_patch(Polygon([[x,y+s*1.05],[x+s*1.05,y-s*0.75],[x-s*1.05,y-s*0.75]],
                             fc=fc, ec=ec, lw=lw, zorder=4))
    elif kind in '■□':
        ax.add_patch(Rectangle((x-s*0.88,y-s*0.88), s*1.76, s*1.76,
                               fc=fc, ec=ec, lw=lw, zorder=4))
    elif kind in '○●':
        ax.add_patch(Circle((x,y), s*0.95, fc=fc, ec=ec, lw=lw, zorder=4))
    elif kind in '◇◆':
        ax.add_patch(Polygon([[x,y+s*1.1],[x+s*1.1,y],[x,y-s*1.1],[x-s*1.1,y]],
                             fc=fc, ec=ec, lw=lw, zorder=4))

def render(rows, path):
    maxlen = max(len(r) for r in rows)
    GAP = 0.58
    fig_w = maxlen*GAP + 1.2
    fig_h = len(rows)*1.05 + 0.2
    fig, ax = plt.subplots(figsize=(fig_w, fig_h), dpi=130)
    ax.set_xlim(0, fig_w); ax.set_ylim(0, fig_h)
    ax.axis('off'); ax.set_aspect('equal')

    for ri, row in enumerate(rows):
        y = fig_h - 0.55 - ri*1.05
        ax.text(0.28, y, f'({ri+1})', ha='center', va='center',
                fontsize=13, color='#222', fontproperties=fp, zorder=5)
        for ci, k in enumerate(row):
            cx = 0.78 + ci*GAP
            if k is None:
                ax.add_patch(Rectangle((cx-0.24, y-0.24), 0.48, 0.48,
                    fc='#fff8e1', ec='#c0392b', lw=1.6, ls=(0,(3,2)), zorder=3))
            else:
                shape(ax, cx, y, k)

    plt.savefig(path, bbox_inches='tight', pad_inches=0.15, facecolor='white')
    plt.close()

problems = [
    # 후보1: 원본과 동일 구조
    {'rows':[list('▲■■▲■■▲■■▲■■▲■')+[None],
             list('○◇◇○○◇◇○')+[None]+list('◇◇○○◇◇○')],
     'answer':'(1) ■   (2) ○'},
    # 후보2
    {'rows':[list('●△△●△△●△△●△')+[None],
             list('□○□□○□□')+[None]+list('□□○□')],
     'answer':'(1) △   (2) ○'},
    # 후보3: 난이도↑ (4개 주기)
    {'rows':[list('◆○△◆◆○△◆◆○')+[None]+list('◆'),
             list('■■□○■■□○■')+[None]+list('□○')],
     'answer':'(1) △   (2) ■'},
]

for i,d in enumerate(problems,1):
    render(d['rows'], f'/tmp/q12_out/q12_{i:02d}.png')
    with open(f'/tmp/q12_out/q12_{i:02d}.txt','w') as af: af.write(str(d['answer']))
    print(f"후보{i}: 정답 {d['answer']}")
