"""q01 — 막대의 길이(수 채우기)  [확정]
규칙: 위 칸 = 전체, 아래 두 칸 = 두 부분. 아래 칸 너비는 수의 비율대로.
"""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import os

FONT='/usr/share/fonts/truetype/nanum/NanumBarunGothicBold.ttf'
fp=fm.FontProperties(fname=FONT)
plt.rcParams['axes.unicode_minus']=False
OUT='/tmp/q01_out'; os.makedirs(OUT,exist_ok=True)

# ── 확정 3문제 ──
problems = [
    {'total':12, 'left':4,  'right':8,  'blank':'right'},  # 정답 8
    {'total':15, 'left':9,  'right':6,  'blank':'left'},   # 정답 9
    {'total':20, 'left':7,  'right':13, 'blank':'right'},  # 정답 13
]

for i, d in enumerate(problems, 1):
    fig, ax = plt.subplots(figsize=(4.2, 2.0), dpi=130)
    ax.set_xlim(0, 4.2); ax.set_ylim(0, 2); ax.axis('off')
    TW, LX, TH, TY, BY = 3.4, 0.4, 0.72, 1.1, 0.28

    # 위칸 (전체)
    ax.add_patch(plt.Rectangle((LX,TY),TW,TH, fc='#dce8f5',ec='#16417C',lw=2.5))
    ax.text(LX+TW/2, TY+TH/2, str(d['total']), ha='center',va='center',
            fontsize=26, color='#16417C', fontproperties=fp)

    # 아래 두 칸 (너비 = 수의 비율)
    total = d['total']
    lw = TW * d['left'] / total
    rw = TW * d['right'] / total
    lb = (d['blank']=='left'); rb = (d['blank']=='right')

    ax.add_patch(plt.Rectangle((LX,BY),lw,TH,
        fc='#fff8e1' if lb else '#d5e8f5',ec='#16417C',lw=2.5))
    ax.text(LX+lw/2, BY+TH/2, '?' if lb else str(d['left']),
            ha='center',va='center',fontsize=22,
            color='#c0392b' if lb else '#333', fontproperties=fp)

    ax.add_patch(plt.Rectangle((LX+lw,BY),rw,TH,
        fc='#fff8e1' if rb else '#eef3f8',ec='#16417C',lw=2.5))
    ax.text(LX+lw+rw/2, BY+TH/2, '?' if rb else str(d['right']),
            ha='center',va='center',fontsize=22,
            color='#c0392b' if rb else '#333', fontproperties=fp)

    plt.savefig(f'{OUT}/q01_{i:02d}.png',bbox_inches='tight',pad_inches=0.15,facecolor='white')
    plt.close()
    ans = d['left'] if lb else d['right']
    with open(f'{OUT}/q01_{i:02d}.txt','w') as f: f.write(str(ans))
    print(f"q01_{i:02d}: 전체{total} → 정답 {ans}")
