import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import os

FONT='/usr/share/fonts/truetype/nanum/NanumBarunGothicBold.ttf'
fp=fm.FontProperties(fname=FONT)
plt.rcParams['axes.unicode_minus']=False
os.makedirs('/tmp/q06_out',exist_ok=True)

def render(n, path):
    fig, ax = plt.subplots(figsize=(n*1.05+0.8, 1.5), dpi=130)
    ax.set_xlim(-0.9, n+0.4); ax.set_ylim(-0.75, 0.75)
    ax.axis('off'); ax.set_aspect('equal')

    # 앞 / 뒤 라벨
    ax.text(-0.72, 0, '앞', ha='center', va='center',
            fontsize=13, fontweight='bold', color='#333', fontproperties=fp)
    ax.text(n-1+0.72, 0, '뒤', ha='center', va='center',
            fontsize=13, fontweight='bold', color='#333', fontproperties=fp)

    for i in range(n):
        ax.add_patch(plt.Circle((i, 0), 0.4, fc='white', ec='#333', lw=1.8))
        ax.text(i, -0.62, f'{i+1}등', ha='center', va='center',
                fontsize=11, color='#555', fontproperties=fp)

    plt.savefig(path, bbox_inches='tight', pad_inches=0.15, facecolor='white')
    plt.close()

problems = [
    {'n':5, 'a_name':'어진', 'a_pos':2, 'b_name':'승호', 'gap':2, 'answer':5},
    {'n':6, 'a_name':'하윤', 'a_pos':1, 'b_name':'도현', 'gap':3, 'answer':5},
    {'n':7, 'a_name':'서준', 'a_pos':6, 'b_name':'유나', 'gap':2, 'answer':3},
]

for i, d in enumerate(problems, 1):
    render(d['n'], f'/tmp/q06_out/q06_{i:02d}.png')
    with open(f'/tmp/q06_out/q06_{i:02d}.txt','w') as af: af.write(str(d['answer']))
    print(f"후보{i}: {d['n']}명, {d['a_name']} {d['a_pos']}번째, {d['b_name']}와 사이 {d['gap']}명 → 정답 {d['answer']}등")
