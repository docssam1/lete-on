import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle
import matplotlib.font_manager as fm
import os

FONT='/usr/share/fonts/truetype/nanum/NanumBarunGothicBold.ttf'
fp=fm.FontProperties(fname=FONT)
plt.rcParams['axes.unicode_minus']=False
os.makedirs('/tmp/q11_out',exist_ok=True)

def render_seq(rows, path):
    """rows: [[숫자 또는 None(빈칸), ...], ...]"""
    maxlen = max(len(r) for r in rows)
    W = 0.62
    fig_w = maxlen*W + 0.8
    fig_h = len(rows)*0.95 + 0.3
    fig, ax = plt.subplots(figsize=(fig_w, fig_h), dpi=130)
    ax.set_xlim(0, fig_w); ax.set_ylim(0, fig_h)
    ax.axis('off'); ax.set_aspect('equal')

    for ri, row in enumerate(rows):
        y = fig_h - 0.85 - ri*0.95
        # 테두리 박스
        bw = len(row)*W + 0.30
        ax.add_patch(Rectangle((0.25, y-0.10), bw, 0.72,
                    fill=False, ec='#333', lw=1.8, zorder=2))
        for ci, v in enumerate(row):
            cx = 0.40 + ci*W + W/2
            if v is None:
                ax.text(cx, y+0.26, '(        )', ha='center', va='center',
                        fontsize=13, color='#c0392b', fontproperties=fp, zorder=4)
            else:
                ax.text(cx, y+0.26, str(v), ha='center', va='center',
                        fontsize=16, color='#222', fontproperties=fp, zorder=4)

    plt.savefig(path, bbox_inches='tight', pad_inches=0.15, facecolor='white')
    plt.close()

problems = [
    # 후보1: 원본과 동일 (반복 + 등차)
    {'rows':[[1,3,4,1,3,4,1,3,4,1,3,None],
             [1,3,5,7,9,11,None,15,17]],
     'answer':'(1) 4   (2) 13'},
    # 후보2: 반복(4개 주기) + 등차(+4)
    {'rows':[[2,5,7,2,5,7,2,5,7,2,None],
             [3,7,11,15,None,23,27]],
     'answer':'(1) 5   (2) 19'},
    # 후보3: 난이도↑ (증가폭이 커지는 규칙)
    {'rows':[[6,1,8,6,1,8,6,1,8,6,None],
             [1,2,4,7,11,None,22,29]],
     'answer':'(1) 1   (2) 16'},
]

for i,d in enumerate(problems,1):
    render_seq(d['rows'], f'/tmp/q11_out/q11_{i:02d}.png')
    with open(f'/tmp/q11_out/q11_{i:02d}.txt','w') as af: af.write(str(d['answer']))
    print(f"후보{i}: 정답 {d['answer']}")
