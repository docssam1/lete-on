"""
GFIELD 문제은행 - q25 쌓기나무 규칙 렌더러
사용법: python3 q25_renderer.py --target 4 --output q25_var01.png
"""
import sys, argparse
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import numpy as np

# 한글 폰트 (Pretendard 설치 시)
try:
    fm.fontManager.addfont('Pretendard-Bold.otf')
    fm.fontManager.addfont('Pretendard-Regular.otf')
    plt.rcParams['font.family'] = 'Pretendard'
except: pass

def pyramid_map(n):
    return [[min(r+1,c+1) for c in range(n)] for r in range(n)]

def count_blocks(m):
    return sum(sum(row) for row in m)

def draw_stacking(heightMap, cellPx=18):
    import numpy as np
    n = len(heightMap)
    if not n: return
    HM = np.array(heightMap)
    maxH = int(HM.max())
    voxels = np.zeros((n, n, maxH), dtype=bool)
    for r in range(n):
        for c in range(n):
            for l in range(HM[r][c]):
                voxels[c, r, l] = True
    return voxels

def render_problem(target_n, output='q25_output.png'):
    maxN = target_n
    fig = plt.figure(figsize=(10, 4.2), facecolor='white')

    # 문제 텍스트
    fig.text(0.06, 0.93, f"25", fontsize=17, fontweight='bold', color='#16417C')
    fig.text(0.115, 0.93, "다음과 같은 규칙으로 쌓기나무를 쌓고 있습니다.", fontsize=13, color='#1a1a2e')
    fig.text(0.115, 0.855, f"{target_n}번째에 올 모양의 쌓기나무는 모두 몇 개입니까?", fontsize=13, color='#1a1a2e')

    for i, n in enumerate([1, 2, 3]):
        ax = fig.add_axes([0.05 + i*0.21, 0.13, 0.19, 0.55], projection='3d')
        vox = np.zeros((maxN,maxN,maxN), dtype=bool)
        for r in range(n):
            for c in range(n):
                h = min(r+1,c+1)
                vox[c,r,:h] = True
        ax.voxels(vox, facecolors='#E8C878', edgecolors='#5a3c1a', linewidth=0.9)
        ax.set_xlim(0,maxN); ax.set_ylim(0,maxN); ax.set_zlim(0,maxN)
        ax.set_box_aspect((1,1,1))
        ax.view_init(elev=20, azim=225)
        ax.set_axis_off()
        cnt = count_blocks(pyramid_map(n))
        fig.text(0.145+i*0.21, 0.10, f'{n}번째 ({cnt}개)', fontsize=11, ha='center', color='#333', fontweight='bold')

    fig.text(0.685, 0.38, '→', fontsize=30, color='#16417C', fontweight='bold')
    ax_q = fig.add_axes([0.73, 0.13, 0.22, 0.55])
    ax_q.set_xlim(0,1); ax_q.set_ylim(0,1); ax_q.axis('off')
    import matplotlib.patches as mp
    ax_q.add_patch(mp.Rectangle((0.05,0.05),0.9,0.9,fill=True,facecolor='#f0f6ff',
                                 edgecolor='#16417C',linewidth=2,linestyle='--'))
    ax_q.text(0.5,0.55,'?',fontsize=52,ha='center',va='center',color='#16417C',fontweight='bold')
    fig.text(0.84, 0.10, f'{target_n}번째', fontsize=12, ha='center', color='#16417C', fontweight='bold')

    plt.savefig(output, dpi=130, bbox_inches='tight', facecolor='white')
    plt.close()
    ans = count_blocks(pyramid_map(target_n))
    print(f"저장: {output} | 정답: {ans}개")
    return ans

if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('--target', type=int, default=4)
    p.add_argument('--output', default='q25_output.png')
    args = p.parse_args()
    render_problem(args.target, args.output)
