"""GFIELD 동물 캐릭터 v2 — 종별 실루엣 차별화"""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Ellipse, Circle, Polygon, Wedge
import numpy as np

def _eye(ax,x,y,r,z,closed=False):
    if closed:
        th=np.linspace(np.pi*0.1,np.pi*0.9,20)
        ax.plot(x+r*1.2*np.cos(th), y+r*0.8*np.sin(th), color='#2C2C2C', lw=1.4, zorder=z)
    else:
        ax.add_patch(Circle((x,y),r,fc='#2C2C2C',zorder=z))
        ax.add_patch(Circle((x+r*0.3,y+r*0.35),r*0.36,fc='white',zorder=z+1))

def _nose(ax,x,y,s,z,color='#3A3A3A',w=0.11,h=0.085):
    ax.add_patch(Ellipse((x,y),w*s,h*s,fc=color,zorder=z))

def _smile(ax,x,y,s,z,width=0.07):
    th=np.linspace(np.pi*0.15,np.pi*0.85,20)
    for dx in (-width,width):
        ax.plot(x+dx*s+width*s*np.cos(th), y-0.04*s*np.sin(th)*1.2,
                color='#3A3A3A', lw=1.0, zorder=z)

# ═══════════════════════════════════════════
def rabbit(ax,x,y,s,z):
    """토끼: 갸름한 몸 + 아주 긴 귀"""
    B,IN,LN='#FFFAF5','#FFD9DC','#C9A98F'
    # 몸통(세로로 긴 타원)
    ax.add_patch(Ellipse((x,y-0.45*s),0.68*s,0.82*s,fc=B,ec=LN,lw=1.3,zorder=z))
    ax.add_patch(Ellipse((x,y-0.52*s),0.40*s,0.52*s,fc='#FFF0F0',ec='none',zorder=z+1))
    # 귀 (아주 길게)
    for dx,ang in ((-0.17,14),(0.17,-14)):
        ax.add_patch(Ellipse((x+dx*s,y+0.92*s),0.17*s,0.62*s,angle=ang,fc=B,ec=LN,lw=1.3,zorder=z+1))
        ax.add_patch(Ellipse((x+dx*s,y+0.90*s),0.08*s,0.44*s,angle=ang,fc=IN,ec='none',zorder=z+2))
    # 머리(작고 동그랗게)
    ax.add_patch(Circle((x,y+0.30*s),0.38*s,fc=B,ec=LN,lw=1.3,zorder=z+3))
    _eye(ax,x-0.14*s,y+0.34*s,0.055*s,z+5); _eye(ax,x+0.14*s,y+0.34*s,0.055*s,z+5)
    _nose(ax,x,y+0.18*s,s,z+6,'#F09090',0.10,0.075)
    _smile(ax,x,y+0.11*s,s,z+6,0.055)
    # 발
    for dx in (-0.20,0.20):
        ax.add_patch(Ellipse((x+dx*s,y-0.86*s),0.22*s,0.13*s,fc='#F5EAE0',ec=LN,lw=1,zorder=z+2))
    # 꼬리
    ax.add_patch(Circle((x-0.38*s,y-0.58*s),0.11*s,fc='white',ec=LN,lw=1,zorder=z+1))

def turtle(ax,x,y,s,z):
    """거북: 납작한 등껍질 + 짧은 다리"""
    SH,B,LN='#7FA860','#A8CC8E','#4F7038'
    # 등껍질(가로로 납작)
    ax.add_patch(Ellipse((x,y-0.18*s),1.05*s,0.68*s,fc=SH,ec=LN,lw=1.4,zorder=z+3))
    # 껍질 무늬
    for ang in range(30,360,60):
        a=np.radians(ang)
        ax.add_patch(Polygon([[x,y-0.18*s],
            [x+0.38*s*np.cos(a),y-0.18*s+0.24*s*np.sin(a)],
            [x+0.38*s*np.cos(a+np.radians(60)),y-0.18*s+0.24*s*np.sin(a+np.radians(60))]],
            fc='#93BC7A',ec=LN,lw=0.8,zorder=z+4))
    # 머리 (앞으로 쭉)
    ax.add_patch(Ellipse((x+0.62*s,y-0.02*s),0.42*s,0.34*s,fc=B,ec=LN,lw=1.3,zorder=z+2))
    _eye(ax,x+0.70*s,y+0.04*s,0.05*s,z+6)
    _nose(ax,x+0.80*s,y-0.06*s,s,z+6,'#4F7038',0.05,0.04)
    # 다리 4개(짧고 뭉툭)
    for dx,dy in ((-0.42,-0.42),(0.30,-0.42),(-0.48,-0.30),(0.36,-0.30)):
        ax.add_patch(Ellipse((x+dx*s,y+dy*s),0.26*s,0.16*s,angle=-15,fc=B,ec=LN,lw=1,zorder=z+1))
    # 꼬리
    ax.add_patch(Polygon([[x-0.52*s,y-0.20*s],[x-0.72*s,y-0.26*s],[x-0.52*s,y-0.30*s]],
                         fc=B,ec=LN,lw=1,zorder=z+1))

def bear(ax,x,y,s,z):
    """곰: 크고 둥글둥글, 작은 귀"""
    B,SH,IN,LN='#B2835A','#96694  4','#DCBE9C','#6E4A2C'
    SH='#966944'
    ax.add_patch(Ellipse((x,y-0.42*s),1.00*s,0.90*s,fc=B,ec=LN,lw=1.4,zorder=z))
    ax.add_patch(Ellipse((x,y-0.48*s),0.62*s,0.60*s,fc=IN,ec='none',zorder=z+1))
    for dx in (-0.36,0.36):
        ax.add_patch(Circle((x+dx*s,y+0.62*s),0.20*s,fc=B,ec=LN,lw=1.3,zorder=z+1))
        ax.add_patch(Circle((x+dx*s,y+0.62*s),0.11*s,fc=IN,ec='none',zorder=z+2))
    ax.add_patch(Circle((x,y+0.28*s),0.48*s,fc=B,ec=LN,lw=1.4,zorder=z+3))
    ax.add_patch(Ellipse((x,y+0.14*s),0.36*s,0.26*s,fc=IN,ec='none',zorder=z+4))
    _eye(ax,x-0.17*s,y+0.38*s,0.06*s,z+5); _eye(ax,x+0.17*s,y+0.38*s,0.06*s,z+5)
    _nose(ax,x,y+0.20*s,s,z+6,'#3A2A1A',0.14,0.10)
    _smile(ax,x,y+0.10*s,s,z+6)
    for dx in (-0.46,0.46):
        ax.add_patch(Ellipse((x+dx*s,y-0.36*s),0.24*s,0.34*s,angle=dx*20,fc=SH,ec=LN,lw=1,zorder=z+2))
    for dx in (-0.26,0.26):
        ax.add_patch(Ellipse((x+dx*s,y-0.86*s),0.30*s,0.18*s,fc=SH,ec=LN,lw=1,zorder=z+2))

def fox(ax,x,y,s,z):
    """여우: 뾰족한 주둥이 + 큰 꼬리"""
    B,IN,LN,W='#F0954E','#FFF2E4','#A85820','#FFFFFF'
    # 꼬리 (큼직하게 뒤로)
    ax.add_patch(Ellipse((x-0.62*s,y-0.36*s),0.66*s,0.32*s,angle=28,fc=B,ec=LN,lw=1.3,zorder=z))
    ax.add_patch(Ellipse((x-0.86*s,y-0.24*s),0.24*s,0.20*s,angle=28,fc=W,ec=LN,lw=1,zorder=z+1))
    ax.add_patch(Ellipse((x,y-0.42*s),0.78*s,0.72*s,fc=B,ec=LN,lw=1.3,zorder=z+2))
    ax.add_patch(Ellipse((x,y-0.50*s),0.44*s,0.46*s,fc=IN,ec='none',zorder=z+3))
    # 큰 삼각 귀
    for dx in (-0.30,0.30):
        ax.add_patch(Polygon([[x+dx*s,y+0.88*s],[x+dx*s-0.20*s,y+0.28*s],[x+dx*s+0.20*s,y+0.32*s]],
                             fc=B,ec=LN,lw=1.3,zorder=z+3))
        ax.add_patch(Polygon([[x+dx*s,y+0.74*s],[x+dx*s-0.10*s,y+0.36*s],[x+dx*s+0.10*s,y+0.38*s]],
                             fc='#3A3A3A',ec='none',zorder=z+4))
    ax.add_patch(Circle((x,y+0.30*s),0.42*s,fc=B,ec=LN,lw=1.3,zorder=z+5))
    # 뾰족 주둥이
    ax.add_patch(Polygon([[x-0.20*s,y+0.20*s],[x+0.20*s,y+0.20*s],[x,y-0.10*s]],
                         fc=IN,ec=LN,lw=1,zorder=z+6))
    _eye(ax,x-0.16*s,y+0.38*s,0.055*s,z+7); _eye(ax,x+0.16*s,y+0.38*s,0.055*s,z+7)
    _nose(ax,x,y-0.04*s,s,z+8,'#2C2C2C',0.10,0.075)

def raccoon(ax,x,y,s,z):
    """너구리: 눈가 검은 마스크 + 줄무늬 꼬리"""
    B,IN,LN,D='#AEAEAE','#E6E6E6','#5F5F5F','#4A4A4A'
    # 줄무늬 꼬리
    for i,cc in enumerate([B,D,B,D]):
        ax.add_patch(Ellipse((x-0.58*s-i*0.13*s,y-0.30*s-i*0.05*s),0.22*s,0.19*s,
                             angle=25,fc=cc,ec=LN,lw=0.9,zorder=z+1-i*0.1))
    ax.add_patch(Ellipse((x,y-0.42*s),0.82*s,0.74*s,fc=B,ec=LN,lw=1.3,zorder=z+2))
    ax.add_patch(Ellipse((x,y-0.50*s),0.46*s,0.46*s,fc=IN,ec='none',zorder=z+3))
    for dx in (-0.32,0.32):
        ax.add_patch(Polygon([[x+dx*s,y+0.76*s],[x+dx*s-0.18*s,y+0.32*s],[x+dx*s+0.18*s,y+0.34*s]],
                             fc=B,ec=LN,lw=1.3,zorder=z+3))
    ax.add_patch(Circle((x,y+0.30*s),0.44*s,fc=B,ec=LN,lw=1.3,zorder=z+5))
    # 검은 마스크
    for dx in (-0.17,0.17):
        ax.add_patch(Ellipse((x+dx*s,y+0.36*s),0.28*s,0.22*s,angle=dx*30,fc=D,ec='none',zorder=z+6))
    _eye(ax,x-0.17*s,y+0.36*s,0.055*s,z+7); _eye(ax,x+0.17*s,y+0.36*s,0.055*s,z+7)
    ax.add_patch(Ellipse((x,y+0.16*s),0.30*s,0.20*s,fc=IN,ec='none',zorder=z+6))
    _nose(ax,x,y+0.20*s,s,z+8,'#2C2C2C',0.11,0.08)

def squirrel(ax,x,y,s,z):
    """다람쥐: 작은 몸 + 커다란 복슬 꼬리"""
    B,IN,LN='#DFA860','#F7E3C6','#8F6432'
    # 큰 꼬리 (위로 말림)
    th=np.linspace(-np.pi*0.4,np.pi*1.1,40)
    tx=x-0.52*s+0.34*s*np.cos(th); ty=y-0.10*s+0.52*s*np.sin(th)
    ax.plot(tx,ty,color=B,lw=13*s,solid_capstyle='round',zorder=z)
    ax.plot(tx,ty,color='#F0D0A0',lw=6*s,solid_capstyle='round',zorder=z+1)
    ax.add_patch(Ellipse((x,y-0.40*s),0.62*s,0.66*s,fc=B,ec=LN,lw=1.3,zorder=z+2))
    ax.add_patch(Ellipse((x,y-0.46*s),0.36*s,0.42*s,fc=IN,ec='none',zorder=z+3))
    for dx in (-0.26,0.26):
        ax.add_patch(Ellipse((x+dx*s,y+0.60*s),0.16*s,0.26*s,angle=dx*18,fc=B,ec=LN,lw=1.2,zorder=z+3))
    ax.add_patch(Circle((x,y+0.26*s),0.36*s,fc=B,ec=LN,lw=1.3,zorder=z+5))
    _eye(ax,x-0.13*s,y+0.32*s,0.055*s,z+7); _eye(ax,x+0.13*s,y+0.32*s,0.055*s,z+7)
    ax.add_patch(Ellipse((x,y+0.14*s),0.24*s,0.17*s,fc=IN,ec='none',zorder=z+6))
    _nose(ax,x,y+0.17*s,s,z+8,'#5A3A1A',0.09,0.07)
    # 앞니
    ax.add_patch(plt.Rectangle((x-0.05*s,y+0.02*s),0.10*s,0.09*s,fc='white',ec='#999',lw=0.7,zorder=z+8))

def deer(ax,x,y,s,z):
    """사슴: 긴 목 + 뿔"""
    B,IN,LN='#D4A876','#F2DFC4','#8A6740'
    ax.add_patch(Ellipse((x,y-0.52*s),0.82*s,0.62*s,fc=B,ec=LN,lw=1.3,zorder=z))
    # 흰 반점
    for dx,dy in ((-0.20,-0.44),(0.14,-0.56),(0.26,-0.38),(-0.06,-0.62)):
        ax.add_patch(Circle((x+dx*s,y+dy*s),0.055*s,fc='#F7EBD8',ec='none',zorder=z+1))
    # 목
    ax.add_patch(Ellipse((x,y-0.06*s),0.28*s,0.46*s,fc=B,ec=LN,lw=1.3,zorder=z+1))
    # 뿔
    for dx in (-1,1):
        ax.plot([x+dx*0.16*s,x+dx*0.30*s],[y+0.56*s,y+1.02*s],color='#8A6740',lw=2.6*s,
                solid_capstyle='round',zorder=z+2)
        ax.plot([x+dx*0.24*s,x+dx*0.46*s],[y+0.80*s,y+0.94*s],color='#8A6740',lw=2.2*s,
                solid_capstyle='round',zorder=z+2)
        ax.plot([x+dx*0.27*s,x+dx*0.24*s],[y+0.90*s,y+1.10*s],color='#8A6740',lw=2.0*s,
                solid_capstyle='round',zorder=z+2)
    # 귀
    for dx in (-0.36,0.36):
        ax.add_patch(Ellipse((x+dx*s,y+0.46*s),0.26*s,0.14*s,angle=dx*38,fc=B,ec=LN,lw=1.2,zorder=z+3))
    # 머리(세로로 긴)
    ax.add_patch(Ellipse((x,y+0.28*s),0.40*s,0.46*s,fc=B,ec=LN,lw=1.3,zorder=z+5))
    ax.add_patch(Ellipse((x,y+0.12*s),0.26*s,0.22*s,fc=IN,ec='none',zorder=z+6))
    _eye(ax,x-0.14*s,y+0.38*s,0.055*s,z+7); _eye(ax,x+0.14*s,y+0.38*s,0.055*s,z+7)
    _nose(ax,x,y+0.14*s,s,z+8,'#3A2A1A',0.11,0.08)
    # 다리
    for dx in (-0.24,0.24):
        ax.plot([x+dx*s,x+dx*s],[y-0.78*s,y-1.00*s],color=B,lw=4*s,solid_capstyle='round',zorder=z-1)

def wolf(ax,x,y,s,z):
    """늑대: 길쭉한 주둥이 + 뾰족 귀 + 덥수룩"""
    B,IN,LN='#96A0AE','#DCE2EA','#565E6C'
    ax.add_patch(Ellipse((x-0.58*s,y-0.44*s),0.52*s,0.26*s,angle=20,fc=B,ec=LN,lw=1.2,zorder=z))
    ax.add_patch(Ellipse((x,y-0.44*s),0.86*s,0.74*s,fc=B,ec=LN,lw=1.3,zorder=z+2))
    ax.add_patch(Ellipse((x,y-0.52*s),0.48*s,0.46*s,fc=IN,ec='none',zorder=z+3))
    for dx in (-0.32,0.32):
        ax.add_patch(Polygon([[x+dx*s,y+0.86*s],[x+dx*s-0.17*s,y+0.30*s],[x+dx*s+0.17*s,y+0.32*s]],
                             fc=B,ec=LN,lw=1.3,zorder=z+3))
        ax.add_patch(Polygon([[x+dx*s,y+0.72*s],[x+dx*s-0.08*s,y+0.36*s],[x+dx*s+0.08*s,y+0.38*s]],
                             fc='#4A4A4A',ec='none',zorder=z+4))
    ax.add_patch(Circle((x,y+0.30*s),0.44*s,fc=B,ec=LN,lw=1.3,zorder=z+5))
    # 긴 주둥이
    ax.add_patch(Ellipse((x,y+0.06*s),0.34*s,0.30*s,fc=IN,ec=LN,lw=1,zorder=z+6))
    _eye(ax,x-0.17*s,y+0.40*s,0.055*s,z+7); _eye(ax,x+0.17*s,y+0.40*s,0.055*s,z+7)
    _nose(ax,x,y-0.02*s,s,z+8,'#2C2C2C',0.13,0.09)

def duck(ax,x,y,s,z):
    """오리: 둥근 몸 + 넓적 부리 + 물갈퀴"""
    B,LN,BK='#FCE07C','#B89A28','#F0921E'
    ax.add_patch(Ellipse((x-0.10*s,y-0.36*s),0.98*s,0.72*s,fc=B,ec=LN,lw=1.3,zorder=z+2))
    # 날개
    ax.add_patch(Ellipse((x-0.02*s,y-0.36*s),0.46*s,0.34*s,angle=-12,fc='#F5D45C',ec=LN,lw=1,zorder=z+3))
    # 꼬리
    ax.add_patch(Polygon([[x-0.56*s,y-0.28*s],[x-0.82*s,y-0.16*s],[x-0.58*s,y-0.44*s]],
                         fc=B,ec=LN,lw=1,zorder=z+1))
    # 목+머리
    ax.add_patch(Ellipse((x+0.26*s,y+0.06*s),0.26*s,0.44*s,fc=B,ec=LN,lw=1.3,zorder=z+3))
    ax.add_patch(Circle((x+0.30*s,y+0.40*s),0.32*s,fc=B,ec=LN,lw=1.3,zorder=z+5))
    _eye(ax,x+0.38*s,y+0.46*s,0.05*s,z+7)
    # 넓적 부리
    ax.add_patch(Ellipse((x+0.62*s,y+0.34*s),0.40*s,0.16*s,fc=BK,ec='#B06D10',lw=1,zorder=z+6))
    # 물갈퀴
    for dx in (-0.16,0.14):
        ax.add_patch(Polygon([[x+dx*s,y-0.72*s],[x+dx*s-0.14*s,y-0.88*s],[x+dx*s+0.16*s,y-0.88*s]],
                             fc=BK,ec='#B06D10',lw=1,zorder=z+1))

def tiger(ax,x,y,s,z):
    """호랑이: 줄무늬 + 둥근 귀 + 큰 얼굴"""
    B,IN,LN,ST='#F2A94E','#FFF0DC','#A05F1E','#6B3A0A'
    ax.add_patch(Ellipse((x,y-0.42*s),0.98*s,0.86*s,fc=B,ec=LN,lw=1.4,zorder=z))
    ax.add_patch(Ellipse((x,y-0.48*s),0.58*s,0.56*s,fc=IN,ec='none',zorder=z+1))
    # 몸 줄무늬
    for dx,dy in ((-0.40,-0.30),(0.40,-0.30),(-0.38,-0.56),(0.38,-0.56)):
        ax.plot([x+dx*s,x+dx*s*0.7],[y+dy*s,y+(dy-0.10)*s],color=ST,lw=2.4,solid_capstyle='round',zorder=z+2)
    for dx in (-0.34,0.34):
        ax.add_patch(Circle((x+dx*s,y+0.62*s),0.19*s,fc=B,ec=LN,lw=1.3,zorder=z+1))
        ax.add_patch(Circle((x+dx*s,y+0.62*s),0.10*s,fc=IN,ec='none',zorder=z+2))
    ax.add_patch(Circle((x,y+0.28*s),0.50*s,fc=B,ec=LN,lw=1.4,zorder=z+5))
    # 얼굴 줄무늬
    for dx,h in ((-0.26,0.56),(0,0.62),(0.26,0.56)):
        ax.plot([x+dx*s,x+dx*s],[y+h*s,y+(h-0.14)*s],color=ST,lw=2.2,solid_capstyle='round',zorder=z+7)
    for dx in (-1,1):
        ax.plot([x+dx*0.44*s,x+dx*0.36*s],[y+0.30*s,y+0.24*s],color=ST,lw=2,solid_capstyle='round',zorder=z+7)
    ax.add_patch(Ellipse((x,y+0.12*s),0.40*s,0.28*s,fc=IN,ec='none',zorder=z+6))
    _eye(ax,x-0.18*s,y+0.36*s,0.062*s,z+8); _eye(ax,x+0.18*s,y+0.36*s,0.062*s,z+8)
    _nose(ax,x,y+0.18*s,s,z+9,'#C4614A',0.13,0.09)
    _smile(ax,x,y+0.08*s,s,z+9)
    # 수염
    for dx in (-1,1):
        for dy in (0.14,0.08):
            ax.plot([x+dx*0.22*s,x+dx*0.52*s],[y+dy*s,y+(dy+0.03)*s],color='#8A6740',lw=0.8,zorder=z+9)

DRAW = {'토끼':rabbit,'거북':turtle,'곰':bear,'여우':fox,'너구리':raccoon,
        '다람쥐':squirrel,'사슴':deer,'늑대':wolf,'오리':duck,'호랑이':tiger}

def draw_animal(ax,x,y,kind,s=1.0,z0=10):
    DRAW.get(kind, bear)(ax,x,y,s,z0)

if __name__=='__main__':
    import matplotlib.font_manager as fm
    fp=fm.FontProperties(fname='/usr/share/fonts/truetype/nanum/NanumBarunGothicBold.ttf')
    kinds=list(DRAW.keys()); n=len(kinds)
    fig,ax=plt.subplots(figsize=(n*1.5,2.6),dpi=130)
    ax.set_xlim(-0.9,n*1.5-0.6); ax.set_ylim(-1.7,1.6)
    ax.axis('off'); ax.set_aspect('equal')
    for i,k in enumerate(kinds):
        draw_animal(ax,i*1.5,0.15,k,s=0.62)
        ax.text(i*1.5,-1.45,k,ha='center',fontsize=10,fontproperties=fp,color='#333')
    plt.savefig('/tmp/animals_v2.png',bbox_inches='tight',pad_inches=0.2,facecolor='white')
    plt.close(); print(f"{n}종 생성")
