import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import matplotlib.font_manager as fm
import numpy as np, os

FONT='/usr/share/fonts/truetype/nanum/NanumBarunGothicBold.ttf'
fp=fm.FontProperties(fname=FONT)
plt.rcParams['axes.unicode_minus']=False
os.makedirs('/tmp/q04_out',exist_ok=True)

# ══════════ 공통 요소 ══════════
def draw_fold_arrow(ax,x,y,w,h,d):
    if d=='v':
        sx,sy=x+w*0.72,y+h*0.5; cpx,cpy=x+w*0.5,y+h*0.86; ex,ey=x+w*0.28,y+h*0.5
    else:
        sx,sy=x+w*0.5,y+h*0.28; cpx,cpy=x+w*0.14,y+h*0.5; ex,ey=x+w*0.5,y+h*0.72
    t=np.linspace(0,1,30)
    bx=(1-t)**2*sx+2*(1-t)*t*cpx+t**2*ex
    by=(1-t)**2*sy+2*(1-t)*t*cpy+t**2*ey
    ax.plot(bx,by,color='#c0392b',lw=3.5,solid_capstyle='round',zorder=8)
    ang=np.arctan2(ey-cpy,ex-cpx); ah=8
    ax.add_patch(plt.Polygon([
        [ex+4*np.cos(ang),ey+4*np.sin(ang)],
        [ex-ah*np.cos(ang-0.5),ey-ah*np.sin(ang-0.5)],
        [ex-ah*np.cos(ang+0.5),ey-ah*np.sin(ang+0.5)]],color='#c0392b',zorder=8))

def draw_step_arrow(ax,x,y):
    ax.annotate('',xy=(x+26,y),xytext=(x,y),
        arrowprops=dict(arrowstyle='-|>',lw=2.8,color='#95a5a6',mutation_scale=18))

# ══════════ 유형1,3: 구멍 뚫기 ══════════
def draw_paper(ax,x,y,w,h,fold_line=None,folded_edge=None):
    ax.add_patch(mpatches.FancyBboxPatch((x,y),w,h,boxstyle="round,pad=0.5",
        fc='#f9c8c4',ec='#e8968f',lw=2))
    if fold_line=='v': ax.plot([x+w/2]*2,[y+2,y+h-2],ls=(0,(5,4)),color='#d4756c',lw=1.6)
    if fold_line=='h': ax.plot([x+2,x+w-2],[y+h/2]*2,ls=(0,(5,4)),color='#d4756c',lw=1.6)
    if folded_edge=='left': ax.add_patch(plt.Rectangle((x,y),4,h,fc='#d86e64',alpha=.25,ec='none'))
    if folded_edge=='top':  ax.add_patch(plt.Rectangle((x,y+h-4),w,4,fc='#d86e64',alpha=.25,ec='none'))

def draw_holes(ax,x,y,w,h,holes):
    for o in holes:
        ax.add_patch(plt.Circle((x+o[0]*w,y+o[1]*h),7.5,fc='white',ec='#c0392b',lw=1.8,zorder=6))

def render_hole(d,path):
    steps=d['folds']+1
    figw=6.2 if steps==2 else 8.6
    fig,ax=plt.subplots(figsize=(figw,2.5),dpi=130)
    total_w=100*steps+42*(steps-1)+25
    ax.set_xlim(0,total_w); ax.set_ylim(-3,113); ax.axis('off'); ax.set_aspect('equal')
    size=100; x=5; baseY=5
    draw_paper(ax,x,baseY,size,size,fold_line=d['dirs'][0])
    draw_fold_arrow(ax,x,baseY,size,size,d['dirs'][0])
    x+=size+7; draw_step_arrow(ax,x,baseY+size/2); x+=42
    w2=size/2 if d['dirs'][0]=='v' else size
    h2=size if d['dirs'][0]=='v' else size/2
    y2=baseY+(size-h2)/2
    if d['folds']==1:
        draw_paper(ax,x,y2,w2,h2,folded_edge='left' if d['dirs'][0]=='v' else 'top')
        draw_holes(ax,x,y2,w2,h2,d['holes'])
    else:
        draw_paper(ax,x,y2,w2,h2,fold_line=d['dirs'][1],
                   folded_edge='left' if d['dirs'][0]=='v' else 'top')
        draw_fold_arrow(ax,x,y2,w2,h2,d['dirs'][1])
        x+=w2+7; draw_step_arrow(ax,x,baseY+size/2); x+=42
        w3=w2/2 if d['dirs'][1]=='v' else w2
        h3=h2 if d['dirs'][1]=='v' else h2/2
        y3=baseY+(size-h3)/2
        draw_paper(ax,x,y3,w3,h3,folded_edge='left')
        draw_holes(ax,x,y3,w3,h3,d['holes'])
    plt.savefig(path,bbox_inches='tight',pad_inches=0.15,facecolor='white'); plt.close()

# ══════════ 유형2: 격자 자르기 ══════════
GRID = [[1,3,4,2],[8,6,7,5],[4,1,2,3],[6,5,7,8]]

def render_grid_cut(d,path):
    """d: {'dir':'v' or 'h', 'cut_cells':[(r,c),...] 접힌 상태 기준}"""
    fig,ax=plt.subplots(figsize=(7.6,2.6),dpi=130)
    ax.set_xlim(0,290); ax.set_ylim(-5,115); ax.axis('off'); ax.set_aspect('equal')
    CELL=25; x0=5; y0=8

    # ── 왼쪽: 전체 격자 + 접는 선 + 화살표
    for r in range(4):
        for c in range(4):
            gx=x0+c*CELL; gy=y0+(3-r)*CELL
            ax.add_patch(plt.Rectangle((gx,gy),CELL,CELL,fc='white',ec='#999',lw=1.2))
            ax.text(gx+CELL/2,gy+CELL/2,str(GRID[r][c]),ha='center',va='center',
                    fontsize=11,fontweight='bold',color='#333')
    W=4*CELL
    if d['dir']=='v':
        ax.plot([x0+W/2]*2,[y0,y0+W],ls=(0,(5,4)),color='#c0392b',lw=2,zorder=5)
    else:
        ax.plot([x0,x0+W],[y0+W/2]*2,ls=(0,(5,4)),color='#c0392b',lw=2,zorder=5)
    draw_fold_arrow(ax,x0,y0,W,W,d['dir'])

    # 화살표
    x1=x0+W+10; draw_step_arrow(ax,x1,y0+W/2)

    # ── 오른쪽: 접힌 상태 (절반) + 색칠 부분
    x2=x1+40
    if d['dir']=='v':
        rows,cols=4,2
    else:
        rows,cols=2,4
    for r in range(rows):
        for c in range(cols):
            gx=x2+c*CELL; gy=y0+(rows-1-r)*CELL
            is_cut=(r,c) in d['cut_cells']
            ax.add_patch(plt.Rectangle((gx,gy),CELL,CELL,
                fc='#9ca3af' if is_cut else 'white',ec='#999',lw=1.2))
    # 접힌 가장자리 표시
    if d['dir']=='v':
        ax.add_patch(plt.Rectangle((x2,y0),3,rows*CELL,fc='#c0392b',alpha=.35,ec='none'))
    else:
        ax.add_patch(plt.Rectangle((x2,y0+(rows-1)*CELL+CELL-3),cols*CELL,3,fc='#c0392b',alpha=.35,ec='none'))

    plt.savefig(path,bbox_inches='tight',pad_inches=0.15,facecolor='white'); plt.close()

def calc_grid_answer(d):
    """잘려나간 수들의 합 계산"""
    total=0
    for (r,c) in d['cut_cells']:
        if d['dir']=='v':
            # 접힌 왼쪽 절반(c=0,1) → 원래 격자 c, 그리고 대칭 (3-c)
            total += GRID[r][c] + GRID[r][3-c]
        else:
            # 접힌 위쪽 절반(r=0,1) → 원래 r, 대칭 (3-r)
            total += GRID[r][c] + GRID[3-r][c]
    return total

# ══════════ 3문제 생성 ══════════
p1={'folds':1,'dirs':['v'],'holes':[(0.5,0.32),(0.45,0.68)],'answer':4}
render_hole(p1,'/tmp/q04_out/q04_01.png')
open('/tmp/q04_out/q04_01.txt','w').write(str(p1['answer']))
print(f"후보1 [구멍] 한번 세로접기·구멍2개 → 정답 {p1['answer']}개")

p2={'dir':'v','cut_cells':[(0,1),(2,0)]}
a2=calc_grid_answer(p2)
render_grid_cut(p2,'/tmp/q04_out/q04_02.png')
open('/tmp/q04_out/q04_02.txt','w').write(str(a2))
print(f"후보2 [격자] 한번 세로접기·2칸 자르기 → 정답 {a2}")

p3={'folds':2,'dirs':['v','h'],'holes':[(0.4,0.4),(0.72,0.62)],'answer':8}
render_hole(p3,'/tmp/q04_out/q04_03.png')
open('/tmp/q04_out/q04_03.txt','w').write(str(p3['answer']))
print(f"후보3 [구멍] 두번 접기·구멍2개 → 정답 {p3['answer']}개")
