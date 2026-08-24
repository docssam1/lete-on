import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import os, math

FONT = '/usr/share/fonts/truetype/nanum/NanumBarunGothicBold.ttf'
fp = fm.FontProperties(fname=FONT)
plt.rcParams['axes.unicode_minus'] = False
os.makedirs('/tmp/q03_out', exist_ok=True)

problems = [
    {'name1':'지우', 'n1':8,  'name2':'민서', 'n2':4,  'answer':2},
    {'name1':'현준', 'n1':13, 'name2':'나은', 'n2':7,  'answer':3},
    {'name1':'재호', 'n1':18, 'name2':'수아', 'n2':8,  'answer':5},
]

PER_ROW = 5      # 한 줄에 5개
R = 0.24         # 구슬 반지름
GAP_X = 0.60     # 구슬 가로 간격
GAP_Y = 0.58     # 구슬 세로 간격

for i, d in enumerate(problems, 1):
    max_n = max(d['n1'], d['n2'])
    rows = math.ceil(max_n / PER_ROW)

    # 세로 공간 계산: 이름(0.5) + 구슬영역 + 개수박스(0.6)
    marble_h = rows * GAP_Y
    FIG_H = 0.55 + marble_h + 0.75
    fig, ax = plt.subplots(figsize=(6.6, FIG_H), dpi=130)
    ax.set_xlim(0, 6.6); ax.set_ylim(0, FIG_H); ax.axis('off')

    NAME_Y   = FIG_H - 0.28
    TOP_Y    = FIG_H - 0.75          # 첫 줄 구슬 중심
    COUNT_Y  = 0.32                  # 개수 박스

    ax.axvline(3.3, color='#ccc', lw=1.5, ymin=0.04, ymax=0.96)

    def draw_side(name, count, cx, color):
        ax.text(cx, NAME_Y, name, ha='center', va='center',
                fontsize=15, fontweight='bold', color='#333', fontproperties=fp)
        total_w = (PER_ROW - 1) * GAP_X
        x0 = cx - total_w / 2
        for idx in range(count):
            row, col = divmod(idx, PER_ROW)
            gx = x0 + col * GAP_X
            gy = TOP_Y - row * GAP_Y
            ax.add_patch(plt.Circle((gx, gy), R, fc=color, ec='#777', lw=1.3, zorder=3))
        ax.text(cx, COUNT_Y, f"{count}개", ha='center', va='center',
                fontsize=13, fontweight='bold', color='#444', fontproperties=fp,
                bbox=dict(fc='#f5f5f5', ec='#bbb', boxstyle='round,pad=0.35'))

    draw_side(d['name1'], d['n1'], 1.65, '#e74c3c')
    draw_side(d['name2'], d['n2'], 4.95, '#3498db')

    plt.savefig(f'/tmp/q03_out/q03_{i:02d}.png',
                bbox_inches='tight', pad_inches=0.2, facecolor='white')
    plt.close()
    with open(f'/tmp/q03_out/q03_{i:02d}.txt','w') as af: af.write(str(d['answer']))
    print(f"후보{i}: {d['name1']}({d['n1']}) | {d['name2']}({d['n2']}) → 정답 {d['answer']}개 · {rows}줄")
