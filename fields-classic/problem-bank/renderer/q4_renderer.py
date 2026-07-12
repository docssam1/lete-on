"""
GFIELD 문제은행 - q4 색종이 접기 렌더러
사용법: python3 q4_renderer.py --folds horizontal --hole 0.58,0.38 --output q4_var01.png
folds: horizontal / vertical / horizontal,vertical
"""
import sys, argparse
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import matplotlib.patches as mpatches
from matplotlib.patches import FancyArrowPatch, Rectangle, Circle

try:
    fm.fontManager.addfont('Pretendard-Bold.otf')
    plt.rcParams['font.family'] = 'Pretendard'
except: pass

PAPER='#FFE9A8'; PAPER_DARK='#F5D576'; EDGE='#C9A227'

def unfold_point(hx, hy, folds):
    points = [{'x':hx,'y':hy}]
    for fold in reversed(folds):
        new_pts = []
        for p in points:
            if fold=='horizontal': r={'x':p['x'],'y':1-p['y']}
            else: r={'x':1-p['x'],'y':p['y']}
            if abs(r['x']-p['x'])>0.001 or abs(r['y']-p['y'])>0.001:
                if not any(abs(ep['x']-r['x'])<0.001 and abs(ep['y']-r['y'])<0.001 for ep in points+new_pts):
                    new_pts.append(r)
        points += new_pts
    return points

def render_problem(folds, hole_pos, output='q4_output.png'):
    hx, hy = hole_pos
    all_holes = unfold_point(hx, hy, folds)
    answer = len(all_holes)
    SW = 160
    fig = plt.figure(figsize=(11, 4.2), facecolor='white')
    fig.text(0.05, 0.92, "4", fontsize=17, fontweight='bold', color='#16417C')
    fig.text(0.10, 0.92, "색종이를 그림과 같이 반으로 접은 후 구멍을 뚫었습니다.", fontsize=12.5, color='#1a1a2e')
    fig.text(0.10, 0.84, "색종이를 다시 펼쳤을 때 구멍은 모두 몇 개입니까?", fontsize=12.5, color='#1a1a2e')

    # 펼쳐진 종이
    ax1 = fig.add_axes([0.04,0.10,0.24,0.60])
    ax1.set_xlim(0,10); ax1.set_ylim(0,10); ax1.axis('off'); ax1.set_aspect('equal')
    ax1.add_patch(Rectangle((1.5,1.5),7,7,facecolor=PAPER,edgecolor=EDGE,linewidth=2))
    if 'horizontal' in folds:
        ax1.plot([1.5,8.5],[5,5],color='#E05050',linewidth=1.8,linestyle=(0,(5,3)))
        arr=FancyArrowPatch((5,9.4),(5,6.2),connectionstyle="arc3,rad=-0.55",
                             arrowstyle='-|>',mutation_scale=22,color='#16417C',linewidth=2.2)
        ax1.add_patch(arr)
    if 'vertical' in folds:
        ax1.plot([5,5],[1.5,8.5],color='#E05050',linewidth=1.8,linestyle=(0,(5,3)))
        arr=FancyArrowPatch((9.4,5),(6.2,5),connectionstyle="arc3,rad=0.55",
                             arrowstyle='-|>',mutation_scale=22,color='#16417C',linewidth=2.2)
        ax1.add_patch(arr)

    fig.text(0.29,0.38,'→',fontsize=26,color='#16417C',fontweight='bold',ha='center')

    # 접힌 종이 + 구멍
    ax2 = fig.add_axes([0.32,0.10,0.24,0.60])
    ax2.set_xlim(0,10); ax2.set_ylim(0,10); ax2.axis('off'); ax2.set_aspect('equal')
    if 'horizontal' in folds:
        ax2.add_patch(Rectangle((1.5,2.8),7,3.5,facecolor=PAPER_DARK,edgecolor=EDGE,linewidth=1.5))
        ax2.add_patch(Rectangle((1.5,3.2),7,3.5,facecolor=PAPER,edgecolor=EDGE,linewidth=2))
        ax2.plot([1.5,8.5],[6.7,6.7],color=EDGE,linewidth=3)
        ax2.add_patch(Circle((1.5+hx*7, 3.2+hy*3.5),0.35,facecolor='#1a1a2e',edgecolor='white',linewidth=1.5,zorder=5))
    else:
        ax2.add_patch(Rectangle((1.8,1.5),3.5,7,facecolor=PAPER_DARK,edgecolor=EDGE,linewidth=1.5))
        ax2.add_patch(Rectangle((2.2,1.5),3.5,7,facecolor=PAPER,edgecolor=EDGE,linewidth=2))
        ax2.plot([5.7,5.7],[1.5,8.5],color=EDGE,linewidth=3)
        ax2.add_patch(Circle((2.2+hx*3.5, 1.5+hy*7),0.35,facecolor='#1a1a2e',edgecolor='white',linewidth=1.5,zorder=5))

    fig.text(0.57,0.47,'펼치면?',fontsize=10.5,color='#16417C',ha='center',fontweight='bold')
    fig.text(0.57,0.38,'→',fontsize=26,color='#16417C',fontweight='bold',ha='center')

    # 펼친 종이
    ax3 = fig.add_axes([0.61,0.10,0.24,0.60])
    ax3.set_xlim(0,10); ax3.set_ylim(0,10); ax3.axis('off'); ax3.set_aspect('equal')
    ax3.add_patch(Rectangle((1.5,1.5),7,7,facecolor='#f0f6ff',edgecolor='#16417C',
                              linewidth=2,linestyle=(0,(6,4))))
    ax3.text(5,5,'?',fontsize=46,ha='center',va='center',color='#16417C',fontweight='bold')

    plt.savefig(output, dpi=130, bbox_inches='tight', facecolor='white')
    plt.close()
    print(f"저장: {output} | 정답: {answer}개")
    return answer

if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('--folds', default='horizontal')
    p.add_argument('--hole', default='0.58,0.38')
    p.add_argument('--output', default='q4_output.png')
    args = p.parse_args()
    folds = args.folds.split(',')
    hx, hy = map(float, args.hole.split(','))
    render_problem(folds, (hx,hy), args.output)
