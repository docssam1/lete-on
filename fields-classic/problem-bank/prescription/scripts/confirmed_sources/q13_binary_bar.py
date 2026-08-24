import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, FancyBboxPatch
import matplotlib.font_manager as fm
import os

FONT='/usr/share/fonts/truetype/nanum/NanumBarunGothicBold.ttf'
fp=fm.FontProperties(fname=FONT)
plt.rcParams['axes.unicode_minus']=False
os.makedirs('/tmp/q13_out',exist_ok=True)

VALS = [16, 8, 4, 2, 1]

def to_bits(n):
    bits=[]; t=n
    for v in VALS:
        if t>=v: bits.append(1); t-=v
        else: bits.append(0)
    return bits

def draw_bar(ax, x, y, bits, w=0.42, h=0.42):
    for i,b in enumerate(bits):
        ax.add_patch(Rectangle((x+i*w, y), w, h,
            fc='#a8a8a8' if b else 'white', ec='#333', lw=1.4, zorder=4))

def render(examples, target, path):
    """examples: [(수, bits), ...] 4개, target: 정답 수"""
    fig, ax = plt.subplots(figsize=(7.2, 3.3), dpi=130)
    ax.set_xlim(0, 7.2); ax.set_ylim(0, 3.3)
    ax.axis('off'); ax.set_aspect('equal')

    # 보기 박스
    ax.add_patch(FancyBboxPatch((0.25, 1.30), 6.5, 1.75,
        boxstyle="round,pad=0.10", fc='white', ec='#555', lw=1.6, zorder=1))

    BW = 0.42
    positions = [(0.60, 2.35), (3.70, 2.35), (0.60, 1.60), (3.70, 1.60)]
    for (n, bits), (px, py) in zip(examples, positions):
        ax.text(px-0.14, py+BW/2, str(n), ha='right', va='center',
                fontsize=14, color='#222', fontproperties=fp, zorder=5)
        draw_bar(ax, px, py, bits)

    # 문제 막대
    ax.text(0.60-0.14, 0.55+BW/2, '', ha='right', va='center')
    draw_bar(ax, 0.60, 0.55, to_bits(target))

    plt.savefig(path, bbox_inches='tight', pad_inches=0.18, facecolor='white')
    plt.close()

problems = [
    # 후보1: 원본과 동일 (보기 1,3,10,21 → 문제 14)
    {'ex':[1,3,10,21], 'target':14},
    # 후보2
    {'ex':[2,5,12,19], 'target':22},
    # 후보3: 난이도↑ (큰 수)
    {'ex':[4,9,17,26], 'target':29},
]

for i,d in enumerate(problems,1):
    ex = [(n, to_bits(n)) for n in d['ex']]
    render(ex, d['target'], f'/tmp/q13_out/q13_{i:02d}.png')
    # 검증
    chk = sum(v for v,b in zip(VALS, to_bits(d['target'])) if b)
    with open(f'/tmp/q13_out/q13_{i:02d}.txt','w') as af: af.write(str(d['target']))
    print(f"후보{i}: 보기 {d['ex']} → 정답 {d['target']} · 검증 {'OK' if chk==d['target'] else '❌'}")
