#!/usr/bin/env python3
"""
scripts/hf_bank/gen_hf_phase2.py
HF Phase 2 — B클래스 26유형 PNG 유사문제 생성기
실행: python scripts/hf_bank/gen_hf_phase2.py
산출물: hyper-focus/problem-bank/prescription/{qNN}/qNN_MM.png + .txt + .json
"""
import json, math, random, os, sys
from pathlib import Path

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import Polygon, Circle, Rectangle, FancyArrowPatch, Arc, Wedge
import matplotlib.font_manager as fm
import numpy as np

# ─── 경로 ─────────────────────────────────────────────────────────
ROOT     = Path(__file__).resolve().parent.parent.parent
OUT_BASE = ROOT / "hyper-focus" / "problem-bank" / "prescription"
DPI      = 130
SYM      = ['①','②','③','④']
LTYELLOW = '#FFFACD'

# ─── 폰트 ─────────────────────────────────────────────────────────
FP = None

def setup_font():
    global FP
    candidates = [
        '/usr/share/fonts/truetype/nanum/NanumBarunGothicBold.ttf',
        '/usr/share/fonts/nanum/NanumBarunGothicBold.ttf',
    ]
    for p in candidates:
        if os.path.exists(p):
            fm.fontManager.addfont(p)
            FP = fm.FontProperties(fname=p)
            plt.rcParams['font.family'] = FP.get_name()
            return
    # Windows/Mac fallback
    for name in ['Malgun Gothic', 'Apple SD Gothic Neo', 'NanumGothic', 'Nanum Gothic']:
        try:
            found = fm.findfont(fm.FontProperties(family=name), fallback_to_default=False)
            if 'DejaVu' not in found and 'ttf' in found.lower():
                FP = fm.FontProperties(family=name)
                plt.rcParams['font.family'] = name
                return
        except Exception:
            pass

def fkw():
    return {'fontproperties': FP} if FP else {}

def josa(n, pair):
    return pair[0] if str(n)[-1] in '013678' else pair[1]

# ─── 저장 ─────────────────────────────────────────────────────────
def save_prob(qnn, idx, fig, answer, params):
    d = OUT_BASE / f"q{qnn}"
    d.mkdir(parents=True, exist_ok=True)
    base = f"q{qnn:02d}_{idx:02d}"
    fig.savefig(d / f"{base}.png", dpi=DPI, bbox_inches='tight', facecolor='white')
    plt.close(fig)
    (d / f"{base}.txt").write_text(str(answer), encoding='utf-8')
    (d / f"{base}.json").write_text(json.dumps(params, ensure_ascii=False, indent=2), encoding='utf-8')

# ─── 공통 캔버스 ───────────────────────────────────────────────────
def new_fig(w=6.5, h=5.0):
    fig, ax = plt.subplots(figsize=(w, h), facecolor='white')
    ax.set_xlim(0,1); ax.set_ylim(0,1); ax.axis('off')
    return fig, ax

def qtitle(ax, text, y=0.95, fs=13.5):
    ax.text(0.5, y, text, ha='center', va='top', fontsize=fs, **fkw())

def draw_choices(ax, choices, y=0.06):
    n = len(choices)
    for i, ch in enumerate(choices):
        x = (i+0.5)/n
        ax.text(x, y, f'{SYM[i]} {ch}', ha='center', va='bottom',
                fontsize=13, transform=ax.transAxes, **fkw())

def make_choices(correct, pool, rng, n=4, force_pos=None):
    """올바른 답과 겹치지 않는 n-1개 오답 선택 → 셔플 → (choices, 정답 위치 1-indexed)"""
    distractors = [x for x in pool if x != correct]
    rng.shuffle(distractors)
    opts = [correct] + distractors[:n-1]
    while len(opts) < n:
        opts.append(opts[-1] + '_')  # pad
    if force_pos is None:
        rng.shuffle(opts)
    else:
        opts.remove(correct)
        opts.insert(force_pos - 1, correct)
    pos = opts.index(correct) + 1
    return opts, pos

def ensure_diversity(probs, rng):
    """level 그룹별 정답 다양성이 부족하면 마지막 문제 choices를 강제 재배치"""
    for level in ['easy','hard']:
        items = [p for p in probs if p['level']==level]
        if not items: continue
        answers = [p['answer'] for p in items]
        if len(set(answers)) >= 2: continue
        # find a different position for last problem
        dominant = answers[0]
        for target_pos in ['1','2','3','4']:
            if target_pos != dominant:
                break
        p = items[-1]
        if p.get('choices') and len(p['choices']) >= 2:
            correct_val = p['choices'][int(p['answer'])-1]
            opts = list(p['choices'])
            if correct_val in opts:
                opts.remove(correct_val)
                insert_idx = int(target_pos) - 1
                opts.insert(insert_idx, correct_val)
                p['choices'] = opts
                p['answer'] = target_pos

# ─── 동물 실루엣 (4-1 방법론: 형태 차별화) ────────────────────────
ACOL = {'cat':'#FF9E9E','dog':'#82C0CC','rabbit':'#C5A8D4',
        'bear':'#F2B97F','bird':'#92D36E'}
ANAMES = {'cat':'고양이','dog':'강아지','rabbit':'토끼','bear':'곰','bird':'새'}

def draw_animal(ax, name, cx, cy, sz=0.08, col=None):
    c = col or ACOL.get(name,'#CCCCCC')
    t = ax.transAxes
    if name == 'cat':
        ax.add_patch(Circle((cx,cy), sz*0.7, color=c, zorder=3, transform=t))
        for dx in [-0.55, 0.55]:
            pts = np.array([[cx+dx*sz,cy+sz*0.5],[cx+(dx-0.3)*sz,cy+sz*1.15],[cx+(dx+0.3)*sz,cy+sz*1.15]])
            ax.add_patch(Polygon(pts, closed=True, color=c, zorder=3, transform=t))
    elif name == 'dog':
        ax.add_patch(Circle((cx,cy), sz*0.7, color=c, zorder=3, transform=t))
        for dx in [-0.7, 0.7]:
            pts = np.array([[cx+dx*sz,cy+sz*0.4],[cx+(dx-0.25)*sz,cy+sz*1.1],[cx+(dx+0.25)*sz,cy+sz*1.1]])
            ax.add_patch(Polygon(pts, closed=True, color=c, zorder=2, transform=t))
    elif name == 'rabbit':
        ax.add_patch(Circle((cx,cy), sz*0.65, color=c, zorder=3, transform=t))
        for dx in [-0.28, 0.28]:
            ax.add_patch(Rectangle((cx+dx*sz-sz*0.1, cy+sz*0.4), sz*0.2, sz*1.1,
                                    color=c, zorder=2, transform=t))
    elif name == 'bear':
        ax.add_patch(Circle((cx,cy), sz*0.8, color=c, zorder=3, transform=t))
        for dx in [-0.72, 0.72]:
            ax.add_patch(Circle((cx+dx*sz*0.75, cy+sz*0.6), sz*0.28, color=c, zorder=3, transform=t))
    elif name == 'bird':
        body = np.array([[cx,cy+sz*0.55],[cx-sz*0.6,cy],[cx,cy-sz*0.45],[cx+sz*0.4,cy]])
        ax.add_patch(Polygon(body, closed=True, color=c, zorder=3, transform=t))
        tail = np.array([[cx-sz*0.6,cy],[cx-sz*1.1,cy+sz*0.32],[cx-sz*1.1,cy-sz*0.32]])
        ax.add_patch(Polygon(tail, closed=True, color=c, zorder=3, transform=t))

def animal_label_shape(ax, cx, cy, sz_bar, height_frac, label, color, name):
    """키 비교용 세로 막대 + 동물 아이콘"""
    t = ax.transAxes
    bar_w = 0.07
    bar_h = 0.45 * height_frac
    ax.add_patch(Rectangle((cx-bar_w/2, 0.18), bar_w, bar_h, color=color, alpha=0.6, transform=t))
    draw_animal(ax, name, cx, 0.18+bar_h+0.08, sz=0.07)
    ax.text(cx, 0.11, label, ha='center', va='bottom', fontsize=12, fontweight='bold', **fkw(), transform=t)

# ─── 도형 그리기 ───────────────────────────────────────────────────
SCOL = {'red':'#E74C3C','blue':'#3498DB','green':'#27AE60',
        'yellow':'#F1C40F','purple':'#9B59B6','orange':'#E67E22',
        'pink':'#E91E63','cyan':'#00BCD4'}

def draw_shape(ax, shape, cx, cy, sz=0.09, col='#3498DB', angle=0, alpha=1.0):
    t = ax.transAxes
    def rot(pts, a):
        th = math.radians(a)
        cs, sn = math.cos(th), math.sin(th)
        return [(cx+cs*(x-cx)-sn*(y-cy), cy+sn*(x-cx)+cs*(y-cy)) for x,y in pts]
    kw = dict(color=col, alpha=alpha, zorder=3, transform=t)
    if shape == 'circle':
        ax.add_patch(Circle((cx,cy), sz, **kw))
    elif shape == 'square':
        r = sz*0.9
        pts = [(cx-r,cy-r),(cx+r,cy-r),(cx+r,cy+r),(cx-r,cy+r)]
        ax.add_patch(Polygon(rot(pts,angle), closed=True, **kw))
    elif shape == 'triangle':
        h = sz*math.sqrt(3)
        pts = [(cx,cy+h*0.65),(cx-sz,cy-h*0.35),(cx+sz,cy-h*0.35)]
        ax.add_patch(Polygon(rot(pts,angle), closed=True, **kw))
    elif shape == 'star':
        pts=[]
        for k in range(5):
            ao=math.radians(90+72*k); ai=math.radians(90+72*k+36)
            pts+=[(cx+sz*math.cos(ao),cy+sz*math.sin(ao)),
                  (cx+sz*0.38*math.cos(ai),cy+sz*0.38*math.sin(ai))]
        ax.add_patch(Polygon(rot(pts,angle), closed=True, **kw))
    elif shape == 'pentagon':
        pts=[(cx+sz*math.cos(math.radians(90+72*k)),cy+sz*math.sin(math.radians(90+72*k))) for k in range(5)]
        ax.add_patch(Polygon(rot(pts,angle), closed=True, **kw))
    elif shape == 'house':
        body=[(cx-sz,cy-sz),(cx+sz,cy-sz),(cx+sz,cy),(cx-sz,cy)]
        roof=[(cx-sz*1.15,cy),(cx,cy+sz*1.2),(cx+sz*1.15,cy)]
        ax.add_patch(Polygon(rot(body,angle), closed=True, **kw))
        kw2=dict(kw); kw2['alpha']=alpha*0.85; kw2['zorder']=4
        ax.add_patch(Polygon(rot(roof,angle), closed=True, **kw2))
    elif shape == 'diamond':
        pts=[(cx,cy+sz),(cx+sz,cy),(cx,cy-sz),(cx-sz,cy)]
        ax.add_patch(Polygon(rot(pts,angle), closed=True, **kw))
    elif shape == 'rectangle':
        pts=[(cx-sz*1.4,cy-sz*0.65),(cx+sz*1.4,cy-sz*0.65),(cx+sz*1.4,cy+sz*0.65),(cx-sz*1.4,cy+sz*0.65)]
        ax.add_patch(Polygon(rot(pts,angle), closed=True, **kw))
    elif shape == 'cross':
        th=sz*0.35
        pts=[(cx-th,cy+sz),(cx+th,cy+sz),(cx+th,cy+th),(cx+sz,cy+th),
             (cx+sz,cy-th),(cx+th,cy-th),(cx+th,cy-sz),(cx-th,cy-sz),
             (cx-th,cy-th),(cx-sz,cy-th),(cx-sz,cy+th),(cx-th,cy+th)]
        ax.add_patch(Polygon(rot(pts,angle), closed=True, **kw))

# ═══════════════════════════════════════════════════════════════════
# TIER 1
# ═══════════════════════════════════════════════════════════════════

# ─── Q24: 수 세기 ─────────────────────────────────────────────────
def gen_q24(rng):
    ANIMALS = ['cat','dog','rabbit','bear','bird']
    PAIRS = [('cat','dog'),('rabbit','bear'),('dog','bird'),('cat','rabbit'),('bear','dog')]
    probs = []

    # easy: 1종, n∈[4,9]
    used = set()
    while len(probs) < 3:
        a = rng.choice(ANIMALS); n = rng.randint(4,9)
        if (a,n) in used: continue
        used.add((a,n))
        q = f"그림에서 {ANAMES[a]}는 모두 몇 마리인가요?"
        probs.append({'qnn':24,'level':'easy','params':{'animal':a,'n':n},'answer':str(n),'question':q,'choices':None})

    # hard: 2종 혼합, 1종만 세기, n∈[6,12]
    used2 = set()
    while len(probs) < 6:
        a1,a2 = rng.choice(PAIRS); n1=rng.randint(3,6); n2=rng.randint(3,6)
        if not (6<=n1+n2<=12): continue
        if (a1,a2,n1,n2) in used2: continue
        used2.add((a1,a2,n1,n2))
        q = f"그림에서 {ANAMES[a1]}만 몇 마리인가요?"
        probs.append({'qnn':24,'level':'hard','params':{'animal1':a1,'animal2':a2,'n1':n1,'n2':n2},'answer':str(n1),'question':q,'choices':None})

    return probs

def render_q24(ax, prob):
    p = prob['params']
    qtitle(ax, prob['question'])
    items = []
    if 'animal2' in p:
        items = [p['animal1']]*p['n1'] + [p['animal2']]*p['n2']
    else:
        items = [p['animal']]*p['n']
    random.shuffle(items)
    total = len(items)
    cols = math.ceil(math.sqrt(total*1.6))
    rows = math.ceil(total/cols)
    xs = np.linspace(0.1, 0.9, max(cols,1))
    ys = np.linspace(0.80, 0.18, max(rows,1))
    for i, a in enumerate(items):
        r, c = divmod(i, cols)
        if r < len(ys) and c < len(xs):
            jx = (random.random()-0.5)*0.03
            jy = (random.random()-0.5)*0.03
            draw_animal(ax, a, xs[c]+jx, ys[r]+jy, sz=0.072)

# ─── Q39: 길이 비교 ────────────────────────────────────────────────
BARCOLS = ['#E74C3C','#3498DB','#27AE60','#F39C12']
BARLABELS = ['가','나','다','라']

def gen_q39(rng):
    probs = []
    for level, q_text in [('easy','가장 긴 것의 번호는?'),('hard','두 번째로 긴 것의 번호는?')]:
        used = set()
        while len([p for p in probs if p['level']==level]) < 3:
            n_bars = rng.choice([3,4])
            lengths = rng.sample(range(3,13), n_bars)
            key = tuple(sorted(lengths))
            if key in used: continue
            used.add(key)
            bars = [{'label':BARLABELS[i],'length':l} for i,l in enumerate(lengths)]
            sorted_idx = sorted(range(n_bars), key=lambda i: lengths[i], reverse=True)
            rank = 0 if level=='easy' else 1
            correct = bars[sorted_idx[rank]]['label']
            all_labels = [b['label'] for b in bars]
            pool = all_labels
            # choices = all_labels in order, answer pos = correct label index+1
            choices = all_labels + ['?']*(4-len(all_labels))
            choices = choices[:4]
            ans_pos = all_labels.index(correct)+1
            probs.append({'qnn':39,'level':level,'params':{'bars':[{'label':b['label'],'length':b['length']} for b in bars]},'answer':str(ans_pos),'question':q_text,'choices':all_labels})
    return probs

def render_q39(ax, prob):
    qtitle(ax, prob['question'])
    bars = prob['params']['bars']
    max_len = max(b['length'] for b in bars)
    n = len(bars)
    y_top = 0.82; y_bot = 0.28; bh = 0.07
    step = (y_top - y_bot) / max(n-1, 1)
    for i, b in enumerate(bars):
        y = y_top - i * step
        w = 0.62 * b['length']/max_len
        ax.add_patch(Rectangle((0.14, y-bh/2), w, bh, color=BARCOLS[i],
                                zorder=3, transform=ax.transAxes))
        ax.text(0.09, y, b['label'], ha='center', va='center', fontsize=14,
                fontweight='bold', transform=ax.transAxes, **fkw())
    draw_choices(ax, prob['choices'], y=0.06)

# ─── Q42: 키 비교 ─────────────────────────────────────────────────
ANIMALS42 = [('cat','dog','rabbit'),('dog','bear','bird'),('cat','rabbit','bear'),
             ('rabbit','bird','dog','cat'),('bear','cat','bird','dog')]
_ALL_ANIMALS = ['cat','dog','rabbit','bear','bird']

def gen_q42(rng):
    probs = []
    for level, q_text in [('easy','가장 키가 큰 동물은?'),('hard','가장 키가 작은 동물은?')]:
        used = set()
        while len([p for p in probs if p['level']==level]) < 3:
            group = list(rng.choice(ANIMALS42))
            heights = rng.sample(range(3,10), len(group))
            key = (tuple(group), tuple(sorted(heights)))
            if key in used: continue
            used.add(key)
            sorted_idx = sorted(range(len(group)), key=lambda i: heights[i], reverse=True)
            rank = 0 if level=='easy' else -1
            correct_animal = group[sorted_idx[rank]]
            correct_name = ANAMES[correct_animal]
            pool = [ANAMES[a] for a in group]
            extras = [ANAMES[a] for a in _ALL_ANIMALS if a not in group]
            for ex in extras:
                if len(pool) >= 4: break
                pool.append(ex)
            choices = pool[:4]
            rng.shuffle(choices)
            ans_pos = choices.index(correct_name) + 1
            probs.append({'qnn':42,'level':level,
                          'params':{'animals':group,'heights':heights},
                          'answer':str(ans_pos),'question':q_text,'choices':choices})
    return probs

def render_q42(ax, prob):
    qtitle(ax, prob['question'])
    animals = prob['params']['animals']
    heights = prob['params']['heights']
    n = len(animals)
    max_h = max(heights)
    xs = np.linspace(0.15, 0.85, n)
    for i, (a, h) in enumerate(zip(animals, heights)):
        animal_label_shape(ax, xs[i], 0, 0.05, h/max_h, str(i+1), ACOL[a], a)
    draw_choices(ax, prob['choices'], y=0.03)

# ─── Q40: 무게 비교 (시소) ─────────────────────────────────────────
def draw_seesaw(ax, left_animal, right_animal, left_heavier, x0=0.1, y0=0.25, w=0.8):
    """시소 렌더. left_heavier=True이면 왼쪽이 무거워 내려감"""
    t = ax.transAxes
    cx = x0 + w/2; pivot_y = y0
    tilt = 0.06 if left_heavier else -0.06
    # 시소 막대
    lx = x0; rx = x0+w
    ly = pivot_y + tilt; ry = pivot_y - tilt
    ax.plot([lx,rx],[ly,ry],color='#7F8C8D',lw=3,transform=t,zorder=3)
    # 삼각형 받침
    tri = np.array([[cx,pivot_y],[cx-0.04,pivot_y-0.08],[cx+0.04,pivot_y-0.08]])
    ax.add_patch(Polygon(tri, closed=True, color='#95A5A6', zorder=2, transform=t))
    # 동물
    draw_animal(ax, left_animal,  lx+0.06, ly+0.1, sz=0.08)
    draw_animal(ax, right_animal, rx-0.06, ry+0.1, sz=0.08)
    ax.text(lx+0.06, ly+0.22, ANAMES[left_animal],  ha='center', fontsize=10, transform=t, **fkw())
    ax.text(rx-0.06, ry+0.22, ANAMES[right_animal], ha='center', fontsize=10, transform=t, **fkw())

def gen_q40(rng):
    """
    easy: 시소 1개 → 더 무거운 동물
    hard: 시소 2개 → 가장 무거운 동물 추론
    """
    TRIPLETS = [('cat','dog','rabbit'),('dog','bear','bird'),('cat','rabbit','bear')]
    probs = []

    # easy: 시소 1개
    used = set()
    while len([p for p in probs if p['level']=='easy']) < 3:
        a1, a2 = rng.sample(['cat','dog','rabbit','bear','bird'], 2)
        left_h = rng.choice([True,False])
        heavier = a1 if left_h else a2
        lighter = a2 if left_h else a1
        key = tuple(sorted([a1,a2]))+(left_h,)
        if key in used: continue
        used.add(key)
        pool = [ANAMES[a] for a in ['cat','dog','rabbit','bear','bird'] if a not in [a1,a2]]
        choices = [ANAMES[heavier], ANAMES[lighter]] + pool[:2]
        rng.shuffle(choices)
        ans_pos = choices.index(ANAMES[heavier])+1
        probs.append({'qnn':40,'level':'easy',
                      'params':{'left':a1,'right':a2,'left_heavier':left_h},
                      'answer':str(ans_pos),'question':'가장 무거운 동물은?','choices':choices})

    # hard: 시소 2개, 3마리 추론
    used2 = set()
    while len([p for p in probs if p['level']=='hard']) < 3:
        triplet = rng.choice(TRIPLETS)
        a,b,c = triplet
        # a>b, b>c → a가 제일 무거움
        key = triplet
        if key in used2: continue
        used2.add(key)
        heavier_ab = a  # a>b
        heavier_bc = b  # b>c
        heaviest = a
        pool = [ANAMES[x] for x in ['cat','dog','rabbit','bear','bird'] if x not in triplet]
        choices = [ANAMES[heaviest], ANAMES[b], ANAMES[c]] + pool[:1]
        rng.shuffle(choices)
        ans_pos = choices.index(ANAMES[heaviest])+1
        probs.append({'qnn':40,'level':'hard',
                      'params':{'seesaw1':{'left':a,'right':b,'left_heavier':True},
                                'seesaw2':{'left':b,'right':c,'left_heavier':True}},
                      'answer':str(ans_pos),'question':'가장 무거운 동물은?','choices':choices})
    return probs

def render_q40(ax, prob):
    qtitle(ax, prob['question'])
    p = prob['params']
    if 'seesaw2' in p:
        # hard: 2 seesaws side by side
        s1, s2 = p['seesaw1'], p['seesaw2']
        draw_seesaw(ax, s1['left'], s1['right'], s1['left_heavier'], x0=0.04, y0=0.35, w=0.42)
        draw_seesaw(ax, s2['left'], s2['right'], s2['left_heavier'], x0=0.54, y0=0.35, w=0.42)
    else:
        draw_seesaw(ax, p['left'], p['right'], p['left_heavier'], x0=0.1, y0=0.35, w=0.8)
    draw_choices(ax, prob['choices'], y=0.04)

# ─── Q41: 넓이 비교 ────────────────────────────────────────────────
def draw_grid_colored(ax, x0, y0, cols, rows, filled, cell_sz, label, ax_transform):
    t = ax_transform
    for r in range(rows):
        for c in range(cols):
            col = '#FFD700' if (r,c) in filled else '#F0F0F0'
            ec = '#AAAAAA'
            ax.add_patch(Rectangle((x0+c*cell_sz, y0+r*cell_sz), cell_sz, cell_sz,
                                    color=col, ec=ec, lw=0.8, zorder=3, transform=t))
    ax.text(x0 + cols*cell_sz/2, y0-0.04, label, ha='center', va='top',
            fontsize=14, fontweight='bold', transform=t, **fkw())

def gen_q41(rng):
    probs = []
    for level in ['easy','hard']:
        used = set()
        ans_cycle = [1, 2, 1, 2]  # alternate which side is larger
        cycle_i = 0
        while len([p for p in probs if p['level']==level]) < 3:
            if level == 'easy':
                diff = rng.randint(3, 5)
            else:
                diff = rng.randint(1, 2)
            base = rng.randint(4, 8)
            bigger = base + diff; smaller = base
            ga_bigger = ans_cycle[cycle_i % len(ans_cycle)] == 1
            cycle_i += 1
            n1 = bigger if ga_bigger else smaller
            n2 = smaller if ga_bigger else bigger
            rows, cols = 3, 4
            total = rows * cols
            if n1 > total or n2 > total or n1 < 2 or n2 < 2: continue
            key = (n1, n2)
            if key in used: continue
            used.add(key)
            ans_pos = 1 if n1 > n2 else 2
            probs.append({'qnn':41,'level':level,
                          'params':{'n1':n1,'n2':n2,'rows':rows,'cols':cols},
                          'answer':str(ans_pos),'question':'더 넓은 것은 가, 나 중 어느 것인가요?',
                          'choices':['가','나']})
    return probs

def render_q41(ax, prob):
    qtitle(ax, prob['question'])
    p = prob['params']
    rows, cols = p['rows'], p['cols']
    n1, n2 = p['n1'], p['n2']
    cell = 0.055
    # 가 grid
    all_cells = [(r,c) for r in range(rows) for c in range(cols)]
    f1 = set(random.sample(all_cells, n1))
    f2 = set(random.sample(all_cells, n2))
    draw_grid_colored(ax, 0.05, 0.28, cols, rows, f1, cell, '가', ax.transAxes)
    draw_grid_colored(ax, 0.55, 0.28, cols, rows, f2, cell, '나', ax.transAxes)
    draw_choices(ax, prob['choices'], y=0.06)

# ─── Q34: 같은 것끼리 ─────────────────────────────────────────────
FRUITS  = ['사과','바나나','포도','딸기','배','귤']
VEGS    = ['당근','브로콜리','양파','호박','오이','감자']
VEHICLES= ['자동차','버스','기차','비행기','배','자전거']
ANIMALS_K = ['사자','코끼리','기린','토끼','강아지','고양이']

def gen_q34(rng):
    probs = []
    SETS = [
        ('fruits_vegs', FRUITS, VEGS, '과일'),
        ('vehicles_animals', VEHICLES, ANIMALS_K, '탈것'),
        ('fruits_vegs2', FRUITS, ANIMALS_K, '과일'),
    ]
    for i, (key, set_a, set_b, ask_label) in enumerate(SETS):
        # 6개 mixed: n_a개 + (6-n_a)개
        for level in ['easy','hard']:
            n_a = rng.randint(2,4)
            items_a = rng.sample(set_a, n_a)
            items_b = rng.sample(set_b, 6-n_a)
            probs.append({'qnn':34,'level':level,
                          'params':{'items_a':items_a,'items_b':items_b,'ask':ask_label,'n_a':n_a},
                          'answer':str(n_a),
                          'question':f'{ask_label}은 모두 몇 개인가요?','choices':None})
        if len([p for p in probs]) >= 6:
            break

    # Trim to 3 easy + 3 hard
    easy = [p for p in probs if p['level']=='easy'][:3]
    hard = [p for p in probs if p['level']=='hard'][:3]
    return easy + hard

def render_q34(ax, prob):
    qtitle(ax, prob['question'])
    p = prob['params']
    items = p['items_a'] + p['items_b']
    rng2 = random.Random(42)
    rng2.shuffle(items)
    n = len(items)
    cols = 3; rows = 2
    xs = np.linspace(0.2, 0.8, cols)
    ys = np.linspace(0.75, 0.35, rows)
    colors_a = ['#FF9999','#99CCFF','#99FF99','#FFD700','#CC99FF','#FF6699']
    for i, item in enumerate(items):
        r, c = divmod(i, cols)
        is_a = item in p['items_a']
        col = '#E74C3C' if is_a else '#3498DB'
        ax.add_patch(Rectangle((xs[c]-0.08, ys[r]-0.06), 0.16, 0.12,
                                color=col, alpha=0.3, zorder=2, transform=ax.transAxes))
        ax.text(xs[c], ys[r], item, ha='center', va='center', fontsize=13,
                transform=ax.transAxes, **fkw())

# ─── Q49: 그래프 ──────────────────────────────────────────────────
CATEGORIES = [
    ['사과','바나나','포도'],['강아지','고양이','토끼'],
    ['축구','야구','농구'],['봄','여름','가을'],
]

def gen_q49(rng):
    probs = []
    cats_list = CATEGORIES[:]
    rng.shuffle(cats_list)

    # easy: "가장 많은 항목" → choice number
    used_e = set()
    ci = 0
    while len([p for p in probs if p['level']=='easy']) < 3:
        cats = cats_list[ci % len(cats_list)]; ci+=1
        vals = rng.sample(range(3,13), 3)
        if len(set(vals))<3: continue
        key = tuple(sorted(vals))
        if key in used_e: continue
        used_e.add(key)
        max_idx = vals.index(max(vals))
        correct = cats[max_idx]
        pool = cats[:]
        choices, ans_pos = make_choices(correct, pool, rng, n=3)
        while len(choices)<4: choices.append('기타')
        probs.append({'qnn':49,'level':'easy',
                      'params':{'cats':cats,'vals':vals},
                      'answer':str(ans_pos),'question':'가장 많은 것은?','choices':choices[:3]})

    # hard: "A는 B보다 몇 명 더?" → 숫자
    used_h = set()
    ci2 = 1
    while len([p for p in probs if p['level']=='hard']) < 3:
        cats = cats_list[ci2 % len(cats_list)]; ci2+=1
        vals = rng.sample(range(3,13), 3)
        if len(set(vals))<3: continue
        key = tuple(sorted(vals))
        if key in used_h: continue
        used_h.add(key)
        i1, i2 = rng.sample(range(3),2)
        diff = abs(vals[i1]-vals[i2])
        larger = cats[i1] if vals[i1]>vals[i2] else cats[i2]
        smaller = cats[i2] if vals[i1]>vals[i2] else cats[i1]
        q = f'{larger}은(는) {smaller}보다 몇 명 더 많은가요?'
        probs.append({'qnn':49,'level':'hard',
                      'params':{'cats':cats,'vals':vals,'i1':i1,'i2':i2},
                      'answer':str(diff),'question':q,'choices':None})
    return probs

def render_q49(ax, prob):
    qtitle(ax, prob['question'])
    p = prob['params']
    cats, vals = p['cats'], p['vals']
    n = len(cats)
    max_v = max(vals)
    bar_cols = ['#E74C3C','#3498DB','#27AE60','#F39C12']
    bw = 0.14; xs = np.linspace(0.2, 0.8, n)
    for i, (cat, v) in enumerate(zip(cats, vals)):
        bh = 0.45 * v / max_v
        ax.add_patch(Rectangle((xs[i]-bw/2, 0.2), bw, bh,
                                color=bar_cols[i], zorder=3, transform=ax.transAxes))
        ax.text(xs[i], 0.2+bh+0.02, str(v), ha='center', va='bottom',
                fontsize=11, transform=ax.transAxes, **fkw())
        ax.text(xs[i], 0.15, cat, ha='center', va='top',
                fontsize=12, transform=ax.transAxes, **fkw())
    ax.plot([0.1, 0.9], [0.2, 0.2], color='#333', lw=1.5, transform=ax.transAxes)
    if prob['choices']:
        draw_choices(ax, prob['choices'], y=0.04)

# ─── Q15: 규칙 도형 ────────────────────────────────────────────────
SHAPES15 = ['triangle','square','circle','star','pentagon','diamond']
COLORS15 = ['#E74C3C','#3498DB','#27AE60','#F39C12','#9B59B6']

def gen_q15(rng):
    probs = []

    # easy: period 2-3
    used_e = set()
    while len([p for p in probs if p['level']=='easy']) < 3:
        period = rng.choice([2,3])
        pattern = rng.sample(SHAPES15, period)
        cols = rng.sample(COLORS15, period)
        key = (tuple(pattern), tuple(cols))
        if key in used_e: continue
        used_e.add(key)
        seq_len = period * 3
        seq = [(pattern[i%period], cols[i%period]) for i in range(seq_len)]
        next_shape = pattern[seq_len%period]
        next_col   = cols[seq_len%period]
        # distractor choices
        other_shapes = [s for s in SHAPES15 if s != next_shape]
        other_cols   = [c for c in COLORS15 if c != next_col]
        dist = [(rng.choice(other_shapes), rng.choice(COLORS15)),
                (next_shape, rng.choice(other_cols)),
                (rng.choice(other_shapes), next_col)]
        choices_raw = [(next_shape, next_col)] + dist
        rng.shuffle(choices_raw)
        ans_pos = choices_raw.index((next_shape, next_col))+1
        probs.append({'qnn':15,'level':'easy',
                      'params':{'pattern':pattern,'colors':cols,'period':period,
                                'seq_len':seq_len,'choices_raw':[(s,c) for s,c in choices_raw]},
                      'answer':str(ans_pos),'question':'다음에 올 도형은?',
                      'choices':['①','②','③','④']})

    # hard: period 3 + size attribute (large/small alternating per element)
    used_h = set()
    while len([p for p in probs if p['level']=='hard']) < 3:
        period = 3
        pattern = rng.sample(SHAPES15, period)
        cols = rng.sample(COLORS15, period)
        sizes = rng.choices([0.06,0.10], k=period)  # small/large
        key = (tuple(pattern),tuple(cols),tuple(sizes))
        if key in used_h: continue
        used_h.add(key)
        seq_len = period*3
        seq = [(pattern[i%period], cols[i%period], sizes[i%period]) for i in range(seq_len)]
        ns = seq_len%period
        next_shape = pattern[ns]; next_col = cols[ns]; next_sz = sizes[ns]
        other_shapes=[s for s in SHAPES15 if s!=next_shape]
        dist=[(rng.choice(other_shapes),next_col,next_sz),
              (next_shape,rng.choice([c for c in COLORS15 if c!=next_col]),next_sz),
              (next_shape,next_col,0.1 if next_sz==0.06 else 0.06)]
        choices_raw=[(next_shape,next_col,next_sz)]+dist
        rng.shuffle(choices_raw)
        ans_pos=choices_raw.index((next_shape,next_col,next_sz))+1
        probs.append({'qnn':15,'level':'hard',
                      'params':{'pattern':pattern,'colors':cols,'sizes':sizes,'period':period,
                                'seq_len':seq_len,'choices_raw':choices_raw},
                      'answer':str(ans_pos),'question':'다음에 올 도형은?',
                      'choices':['①','②','③','④']})
    return probs

def render_q15(ax, prob):
    qtitle(ax, prob['question'])
    p = prob['params']
    seq_len = p['seq_len']
    period  = p['period']
    pattern = p['pattern']
    cols    = p['colors']
    sizes   = p.get('sizes', [0.08]*period)
    # draw sequence + ?
    total = seq_len + 1
    xs = np.linspace(0.08, 0.92, total)
    y  = 0.62
    for i in range(seq_len):
        idx = i % period
        draw_shape(ax, pattern[idx], xs[i], y, sz=sizes[idx], col=cols[idx])
        ax.text(xs[i], y-0.12, '', ha='center', fontsize=8, transform=ax.transAxes)
    # ? box
    ax.add_patch(Rectangle((xs[-1]-0.05, y-0.1), 0.1, 0.18,
                            color=LTYELLOW, ec='#DAA520', lw=1.5, zorder=2, transform=ax.transAxes))
    ax.text(xs[-1], y, '?', ha='center', va='center', fontsize=18,
            color='#8B4513', transform=ax.transAxes, **fkw())
    # choices
    choices_raw = p['choices_raw']
    y_ch = 0.32; xpositions = [0.15, 0.38, 0.62, 0.85]
    for j, cr in enumerate(choices_raw):
        shape, col = cr[0], cr[1]
        sz = cr[2] if len(cr)>2 else 0.08
        draw_shape(ax, shape, xpositions[j], y_ch, sz=sz, col=col)
        ax.text(xpositions[j], y_ch-0.13, SYM[j], ha='center', va='top',
                fontsize=12, transform=ax.transAxes, **fkw())

# ─── Q8: 조각 채우기 ───────────────────────────────────────────────
def gen_q8(rng):
    """easy: 2×2÷(1×2) / hard: 3×4÷(L형 3칸 등)"""
    probs = []
    easy_specs = [
        {'grid':(2,2), 'piece_cells':[(0,0),(0,1)], 'piece_name':'1×2조각'},
        {'grid':(2,4), 'piece_cells':[(0,0),(0,1)], 'piece_name':'1×2조각'},
        {'grid':(2,3), 'piece_cells':[(0,0),(1,0)], 'piece_name':'2×1조각'},
    ]
    hard_specs = [
        {'grid':(3,4),'piece_cells':[(0,0),(1,0),(1,1)],'piece_name':'L형 3칸'},
        {'grid':(2,6),'piece_cells':[(0,0),(0,1),(0,2)],'piece_name':'1×3조각'},
        {'grid':(3,3),'piece_cells':[(0,0),(0,1),(1,0)],'piece_name':'L형 3칸'},
    ]
    for specs, level in [(easy_specs,'easy'),(hard_specs,'hard')]:
        for sp in specs:
            gr, gc = sp['grid']
            pc = sp['piece_cells']
            n_total = gr*gc; n_piece = len(pc)
            if n_total % n_piece != 0: continue
            answer = n_total // n_piece
            probs.append({'qnn':8,'level':level,
                          'params':{'grid':list(sp['grid']),'piece_cells':pc,'piece_name':sp['piece_name']},
                          'answer':str(answer),
                          'question':f'조각이 몇 개 필요한가요?','choices':None})
    return probs[:3] + probs[3:6]

def render_q8(ax, prob):
    qtitle(ax, prob['question'])
    p = prob['params']
    gr, gc = p['grid']
    piece = p['piece_cells']
    cell = min(0.11, 0.6/max(gr,gc))
    gx0 = 0.08; gy0 = 0.30
    # draw full grid
    for r in range(gr):
        for c in range(gc):
            ax.add_patch(Rectangle((gx0+c*cell, gy0+r*cell), cell, cell,
                                    color='#E8F4F8', ec='#7F8C8D', lw=1.5, zorder=2,
                                    transform=ax.transAxes))
    # draw piece separately on the right
    px0 = 0.60; py0 = 0.45
    ax.text(px0+len(set(c for r,c in piece))*cell/2, py0-0.07, '← 이 조각',
            ha='center', fontsize=11, transform=ax.transAxes, **fkw())
    for r,c in piece:
        ax.add_patch(Rectangle((px0+c*cell, py0+r*cell), cell, cell,
                                color='#3498DB', ec='#2980B9', lw=1.5, alpha=0.8,
                                zorder=3, transform=ax.transAxes))
    ax.text(gx0+gc*cell/2, gy0-0.07, f'{gr}×{gc} 격자', ha='center',
            fontsize=11, transform=ax.transAxes, **fkw())

# ─── Q22: 길찾기 ─────────────────────────────────────────────────
GRID_ANIMALS = ['cat','dog','rabbit','bear']

def gen_q22(rng):
    probs = []
    used = set()
    while len(probs) < 6:
        # 5×5 grid, start random, 4 animal homes at distinct positions
        start = (rng.randint(0,1), rng.randint(0,1))
        a_right = rng.randint(1,3); a_up = rng.randint(1,3)
        end = (start[0]+a_up, start[1]+a_right)
        if not (0<=end[0]<=4 and 0<=end[1]<=4): continue
        # 4 animal homes: end + 3 others distinct
        homes = [end]
        while len(homes) < 4:
            h = (rng.randint(0,4), rng.randint(0,4))
            if h not in homes and h != start:
                homes.append(h)
        rng.shuffle(homes)
        key = (start, tuple(sorted(homes)), a_right, a_up)
        if key in used: continue
        used.add(key)
        # answer: which animal is at 'end' position
        end_idx = homes.index(end)
        animal_at_end = GRID_ANIMALS[end_idx]
        choices = [ANAMES[a] for a in GRID_ANIMALS]
        ans_pos = end_idx+1
        level = 'easy' if len(probs)<3 else 'hard'
        q = f"오른쪽으로 {a_right}칸, 위로 {a_up}칸 가면 어떤 동물이 있나요?"
        probs.append({'qnn':22,'level':level,
                      'params':{'start':list(start),'homes':[list(h) for h in homes],
                                'a_right':a_right,'a_up':a_up},
                      'answer':str(ans_pos),'question':q,'choices':choices})
    return probs

def render_q22(ax, prob):
    qtitle(ax, prob['question'])
    p = prob['params']
    grid_sz = 5; cell=0.12
    gx0=0.13; gy0=0.15
    t = ax.transAxes
    for r in range(grid_sz):
        for c in range(grid_sz):
            ax.add_patch(Rectangle((gx0+c*cell, gy0+r*cell), cell, cell,
                                    color='#F0F8FF', ec='#BDC3C7', lw=0.8, zorder=2, transform=t))
    sr, sc = p['start']
    # start marker
    ax.add_patch(Circle((gx0+sc*cell+cell/2, gy0+sr*cell+cell/2), cell*0.3,
                         color='#F39C12', zorder=4, transform=t))
    ax.text(gx0+sc*cell+cell/2, gy0+sr*cell+cell/2, '출', ha='center', va='center',
            fontsize=8, color='white', transform=t, **fkw())
    # animal homes
    for idx, (hr, hc) in enumerate(p['homes']):
        ax.add_patch(Rectangle((gx0+hc*cell+cell*0.1, gy0+hr*cell+cell*0.1),
                                cell*0.8, cell*0.8, color='#ECF0F1', ec='#7F8C8D',
                                lw=0.8, zorder=3, transform=t))
        draw_animal(ax, GRID_ANIMALS[idx],
                    gx0+hc*cell+cell/2, gy0+hr*cell+cell/2, sz=0.045)
    # direction arrows
    ax.annotate('', xy=(gx0+p['a_right']*cell+gx0+cell/2-0.01, gy0-0.06),
                 xytext=(gx0+cell/2, gy0-0.06),
                 xycoords='axes fraction', textcoords='axes fraction',
                 arrowprops=dict(arrowstyle='->', color='#E74C3C', lw=1.5))
    draw_choices(ax, prob['choices'], y=0.03)


# ═══════════════════════════════════════════════════════════════════
# TIER 2
# ═══════════════════════════════════════════════════════════════════

# ─── Q5: 점 잇기 ─────────────────────────────────────────────────
DOT_SHAPES = {
    'triangle': [(0.5,0.85),(0.18,0.3),(0.82,0.3)],
    'square':   [(0.2,0.25),(0.8,0.25),(0.8,0.8),(0.2,0.8)],
    'star':     [(0.5,0.9),(0.62,0.58),(0.95,0.55),(0.72,0.35),
                 (0.79,0.05),(0.5,0.22),(0.21,0.05),(0.28,0.35),
                 (0.05,0.55),(0.38,0.58)],
    'house':    [(0.2,0.25),(0.8,0.25),(0.8,0.6),(0.5,0.85),(0.2,0.6)],
    'pentagon': [(0.5,0.88),(0.82,0.65),(0.70,0.28),(0.30,0.28),(0.18,0.65)],
}
SHAPE_NAMES = {'triangle':'세모','square':'네모','star':'별','house':'집','pentagon':'오각형'}

def gen_q5(rng):
    probs = []
    shape_list = ['triangle','square','star','house']
    # easy: sample 3 without replacement
    easy_shapes = rng.sample(['triangle','square','house','star'], 3)
    # hard: sample 3 without replacement (prefer 6-8 pt shapes)
    hard_shapes = rng.sample(['star','house','pentagon','square'], 3)

    for sh in easy_shapes:
        pool = [SHAPE_NAMES.get(s, s) for s in shape_list]
        correct = SHAPE_NAMES.get(sh, sh)
        choices, ans_pos = make_choices(correct, pool, rng, n=4)
        probs.append({'qnn':5,'level':'easy',
                      'params':{'shape':sh},
                      'answer':str(ans_pos),'question':'점을 이으면 어떤 도형이 될까요?','choices':choices})
    for sh in hard_shapes:
        pool = [SHAPE_NAMES.get(s, s) for s in shape_list]
        correct = SHAPE_NAMES.get(sh, sh)
        choices, ans_pos = make_choices(correct, pool, rng, n=4)
        probs.append({'qnn':5,'level':'hard',
                      'params':{'shape':sh},
                      'answer':str(ans_pos),'question':'점을 이으면 어떤 도형이 될까요?','choices':choices})
    return probs

def render_q5(ax, prob):
    qtitle(ax, prob['question'])
    sh = prob['params']['shape']
    pts = DOT_SHAPES[sh]
    for i in range(len(pts)):
        x1,y1 = pts[i]; x2,y2 = pts[(i+1)%len(pts)]
        ax.plot([x1,x2],[y1+0.05,y2+0.05],'--',color='#BDC3C7',lw=1,transform=ax.transAxes,zorder=2)
    for i,(x,y) in enumerate(pts):
        ax.add_patch(Circle((x,y+0.05),0.025,color='#E74C3C',zorder=4,transform=ax.transAxes))
        ax.text(x, y+0.08, str(i+1), ha='center', va='bottom', fontsize=9,
                transform=ax.transAxes, **fkw())
    draw_choices(ax, prob['choices'], y=0.04)

# ─── Q6: 같은 모양 ────────────────────────────────────────────────
SHAPES6 = ['triangle','square','circle','star','pentagon','diamond','house','cross']
COLORS6  = ['#E74C3C','#3498DB','#27AE60','#F39C12','#9B59B6','#E91E63']

def gen_q6(rng):
    probs = []
    used = set()
    for level in ['easy','hard']:
        while len([p for p in probs if p['level']==level]) < 3:
            target_sh = rng.choice(SHAPES6)
            target_col = rng.choice(COLORS6)
            # correct: same shape+color, possibly different size
            correct_size = rng.choice([0.07, 0.10])
            # 3 distractors: diff shape / diff color / mirrored (simulated by rotation)
            dist = [
                (rng.choice([s for s in SHAPES6 if s!=target_sh]), target_col, correct_size, 0),
                (target_sh, rng.choice([c for c in COLORS6 if c!=target_col]), correct_size, 0),
                (rng.choice([s for s in SHAPES6 if s!=target_sh]), rng.choice(COLORS6), correct_size, 0),
            ]
            correct = (target_sh, target_col, correct_size, 0)
            key = (target_sh, target_col)
            if key in used: continue
            used.add(key)
            opts = [correct] + dist; rng.shuffle(opts)
            ans_pos = opts.index(correct)+1
            probs.append({'qnn':6,'level':level,
                          'params':{'target_sh':target_sh,'target_col':target_col,'opts':opts},
                          'answer':str(ans_pos),'question':'타깃과 같은 모양은?','choices':['①','②','③','④']})
    return probs

def render_q6(ax, prob):
    qtitle(ax, prob['question'])
    p = prob['params']
    # target on left
    draw_shape(ax, p['target_sh'], 0.15, 0.65, sz=0.09, col=p['target_col'])
    ax.text(0.15, 0.52, '타깃', ha='center', fontsize=11, transform=ax.transAxes, **fkw())
    ax.plot([0.28,0.28],[0.4,0.85],color='#BDC3C7',lw=1.5,transform=ax.transAxes)
    # 4 choices
    xs = [0.42, 0.58, 0.74, 0.90]
    for j, (sh, col, sz, ang) in enumerate(p['opts']):
        draw_shape(ax, sh, xs[j], 0.65, sz=sz, col=col, angle=ang)
        ax.text(xs[j], 0.52, SYM[j], ha='center', fontsize=12, transform=ax.transAxes, **fkw())

# ─── Q7: 다른 모양 ────────────────────────────────────────────────
def gen_q7(rng):
    probs = []
    used = set()
    for level in ['easy','hard']:
        while len([p for p in probs if p['level']==level]) < 3:
            same_sh = rng.choice(SHAPES6)
            same_col = rng.choice(COLORS6)
            diff_sh = rng.choice([s for s in SHAPES6 if s != same_sh])
            key = (same_sh, diff_sh)
            if key in used: continue
            used.add(key)
            opts = [(same_sh, same_col)]*3 + [(diff_sh, same_col)]
            rng.shuffle(opts)
            diff_idx = next(i for i,o in enumerate(opts) if o[0]==diff_sh)
            ans_pos = diff_idx+1
            probs.append({'qnn':7,'level':level,
                          'params':{'same_sh':same_sh,'same_col':same_col,'diff_sh':diff_sh,
                                    'opts':opts,'diff_idx':diff_idx},
                          'answer':str(ans_pos),'question':'나머지와 다른 모양은?','choices':['①','②','③','④']})
    return probs

def render_q7(ax, prob):
    qtitle(ax, prob['question'])
    p = prob['params']
    xs = [0.2, 0.4, 0.6, 0.8]
    for j, (sh, col) in enumerate(p['opts']):
        draw_shape(ax, sh, xs[j], 0.6, sz=0.09, col=col)
        ax.text(xs[j], 0.47, SYM[j], ha='center', fontsize=12, transform=ax.transAxes, **fkw())

# ─── Q9: 거울 ─────────────────────────────────────────────────────
ASYMM_SHAPES = ['house','cross','pentagon','star']

def flip_pts_h(pts, cx=0.5):
    """좌우 반전"""
    return [(2*cx - x, y) for x,y in pts]

def flip_pts_v(pts, cy=0.5):
    """상하 반전"""
    return [(x, 2*cy - y) for x,y in pts]

def gen_q9(rng):
    probs = []
    used = set()
    for level in ['easy','hard']:
        while len([p for p in probs if p['level']==level]) < 3:
            sh = rng.choice(ASYMM_SHAPES)
            col = rng.choice(COLORS6)
            orig_angle = rng.choice([0, 15, 30])
            key = (sh, col, orig_angle)
            if key in used: continue
            used.add(key)
            # correct: left-right flip = mirror
            # distractors: original, up-down flip, 90deg rotation
            opts = [
                ('flip_h', sh, col, orig_angle),  # correct
                ('orig',   sh, col, orig_angle),
                ('flip_v', sh, col, orig_angle),
                ('rot90',  sh, col, orig_angle+90),
            ]
            rng.shuffle(opts)
            correct = ('flip_h', sh, col, orig_angle)
            ans_pos = opts.index(correct)+1
            probs.append({'qnn':9,'level':level,
                          'params':{'shape':sh,'color':col,'angle':orig_angle,'opts':opts},
                          'answer':str(ans_pos),'question':'거울에 비친 모양은?','choices':['①','②','③','④']})
    return probs

def render_q9(ax, prob):
    qtitle(ax, prob['question'])
    p = prob['params']
    draw_shape(ax, p['shape'], 0.15, 0.65, sz=0.1, col=p['color'], angle=p['angle'])
    ax.text(0.15, 0.5, '원본', ha='center', fontsize=11, transform=ax.transAxes, **fkw())
    # mirror line
    ax.plot([0.28, 0.28], [0.4, 0.85], color='#3498DB', lw=2, ls='--',
            transform=ax.transAxes)
    xs = [0.42, 0.58, 0.74, 0.90]
    for j, (mode, sh, col, ang) in enumerate(p['opts']):
        actual_ang = ang if mode != 'rot90' else ang+90
        flip_x = mode == 'flip_h'
        flip_y = mode == 'flip_v'
        # Simulate flip by adjusting angle (simplified)
        draw_shape(ax, sh, xs[j], 0.65, sz=0.09, col=col,
                   angle=actual_ang if not flip_x else -actual_ang)
        ax.text(xs[j], 0.5, SYM[j], ha='center', fontsize=12, transform=ax.transAxes, **fkw())

# ─── Q12: 도형 겹치기 ─────────────────────────────────────────────
OVERLAP_PAIRS = [
    ('circle','square'),('triangle','circle'),('square','triangle'),
    ('circle','pentagon'),('star','square'),('triangle','diamond'),
]

def gen_q12(rng):
    probs = []
    used = set()
    for level in ['easy','hard']:
        while len([p for p in probs if p['level']==level]) < 3:
            pair = rng.choice(OVERLAP_PAIRS)
            sh1, sh2 = pair
            c1, c2 = rng.sample(COLORS6, 2)
            key = (sh1, sh2, c1)
            if key in used: continue
            used.add(key)
            # result silhouette is the union - represented by showing both
            # Correct choice shows overlapped shape, distractors show wrong combos
            dist_pairs = [(s,sh2) for s in SHAPES6 if s not in pair]
            other_sh = rng.choice([s for s in SHAPES6 if s not in [sh1,sh2]])
            opts_shapes = [(sh1,sh2), (other_sh,sh2), (sh1,other_sh), (rng.choice(SHAPES6),rng.choice(SHAPES6))]
            rng.shuffle(opts_shapes)
            ans_pos = opts_shapes.index((sh1,sh2))+1
            probs.append({'qnn':12,'level':level,
                          'params':{'sh1':sh1,'sh2':sh2,'c1':c1,'c2':c2,'opts':opts_shapes},
                          'answer':str(ans_pos),'question':'겹쳐진 결과는?','choices':['①','②','③','④']})
    return probs

def render_q12(ax, prob):
    qtitle(ax, prob['question'])
    p = prob['params']
    # Show two shapes separately on left
    draw_shape(ax, p['sh1'], 0.10, 0.65, sz=0.09, col=p['c1'], alpha=0.7)
    ax.text(0.18, 0.65, '+', ha='center', va='center', fontsize=20, transform=ax.transAxes)
    draw_shape(ax, p['sh2'], 0.26, 0.65, sz=0.09, col=p['c2'], alpha=0.7)
    ax.text(0.34, 0.65, '=', ha='center', va='center', fontsize=20, transform=ax.transAxes)
    ax.add_patch(Rectangle((0.38, 0.50), 0.14, 0.25, color=LTYELLOW, ec='#DAA520',
                            lw=1.5, transform=ax.transAxes))
    ax.text(0.45, 0.62, '?', ha='center', va='center', fontsize=24,
            color='#8B4513', transform=ax.transAxes, **fkw())
    xs = [0.60, 0.70, 0.80, 0.90]
    for j, (s1, s2) in enumerate(p['opts']):
        draw_shape(ax, s1, xs[j], 0.65, sz=0.06, col=COLORS6[0], alpha=0.6)
        draw_shape(ax, s2, xs[j], 0.65, sz=0.06, col=COLORS6[1], alpha=0.6)
        ax.text(xs[j], 0.52, SYM[j], ha='center', fontsize=11, transform=ax.transAxes, **fkw())

# ─── Q13: 그림자 ─────────────────────────────────────────────────
SOLIDS = [
    ('원기둥','cylinder'), ('원뿔','cone'), ('구','sphere'), ('정육면체','cube')
]
SHADOW_MAP = {
    ('cylinder','top'): 'circle',
    ('cylinder','side'): 'rectangle',
    ('cone','top'): 'circle',
    ('cone','side'): 'triangle',
    ('sphere','top'): 'circle',
    ('sphere','side'): 'circle',
    ('cube','top'): 'square',
    ('cube','side'): 'square',
}
SHADOW_NAMES = {'circle':'원','rectangle':'직사각형','triangle':'삼각형','square':'정사각형'}

def gen_q13(rng):
    probs = []
    combos = [(s,d) for s,_ in SOLIDS for d in ['top','side']]
    rng.shuffle(combos)
    used = set()
    for level in ['easy','hard']:
        while len([p for p in probs if p['level']==level]) < 3:
            solid_kr, solid_en = rng.choice(SOLIDS)
            direction = rng.choice(['top','side'])
            key = (solid_en, direction)
            if key in used: continue
            used.add(key)
            shadow = SHADOW_MAP[(solid_en, direction)]
            dir_kr = '위에서' if direction=='top' else '옆에서'
            pool = list(SHADOW_NAMES.values())
            correct = SHADOW_NAMES[shadow]
            choices, ans_pos = make_choices(correct, pool, rng, n=4)
            q = f'{solid_kr}을(를) {dir_kr} 보면 그림자 모양은?'
            probs.append({'qnn':13,'level':level,
                          'params':{'solid':solid_en,'solid_kr':solid_kr,'direction':direction},
                          'answer':str(ans_pos),'question':q,'choices':choices})
    return probs

def render_q13(ax, prob):
    qtitle(ax, prob['question'])
    p = prob['params']
    sol = p['solid']
    # Draw a simple 3D-looking solid in the center
    cx, cy, sz = 0.4, 0.62, 0.12
    t = ax.transAxes
    if sol == 'cylinder':
        ax.add_patch(Rectangle((cx-sz, cy-sz*1.3), sz*2, sz*2.6, color='#85C1E9', alpha=0.7, transform=t))
        ax.add_patch(mpatches.Ellipse((cx, cy+sz*1.3), sz*2, sz*0.6, color='#5DADE2', alpha=0.8, transform=t))
        ax.add_patch(mpatches.Ellipse((cx, cy-sz*1.3), sz*2, sz*0.6, color='#85C1E9', alpha=0.7, transform=t))
    elif sol == 'cone':
        pts = [(cx, cy+sz*1.5),(cx-sz, cy-sz),(cx+sz, cy-sz)]
        ax.add_patch(Polygon(pts, closed=True, color='#F8C471', alpha=0.8, transform=t))
        ax.add_patch(mpatches.Ellipse((cx, cy-sz), sz*2, sz*0.5, color='#F39C12', alpha=0.7, transform=t))
    elif sol == 'sphere':
        ax.add_patch(Circle((cx,cy), sz*1.2, color='#A9DFBF', alpha=0.8, transform=t))
        ax.add_patch(mpatches.Ellipse((cx, cy), sz*2.4, sz*0.8, color='#7DCEA0', alpha=0.3, transform=t))
    elif sol == 'cube':
        pts = [(cx-sz,cy-sz),(cx+sz,cy-sz),(cx+sz*1.4,cy-sz*0.5),
               (cx+sz*1.4,cy+sz*0.5),(cx+sz,cy+sz),(cx-sz,cy+sz),
               (cx-sz*1.4,cy+sz*0.5),(cx-sz*1.4,cy-sz*0.5)]
        ax.add_patch(Polygon(pts, closed=True, color='#BB8FCE', alpha=0.7, transform=t))
    draw_choices(ax, prob['choices'], y=0.05)

# ─── Q14: 도형 돌리기 ─────────────────────────────────────────────
ROTATE_ANGLES = [90, 180, 270]

def gen_q14(rng):
    probs = []
    used = set()
    for level in ['easy','hard']:
        while len([p for p in probs if p['level']==level]) < 3:
            sh = rng.choice(['house','cross','pentagon','star'])
            col = rng.choice(COLORS6)
            rot = rng.choice(ROTATE_ANGLES)
            key = (sh, col, rot)
            if key in used: continue
            used.add(key)
            opts_angles = [rot, 0, (rot+90)%360, (rot+180)%360]
            rng.shuffle(opts_angles)
            ans_pos = opts_angles.index(rot)+1
            probs.append({'qnn':14,'level':level,
                          'params':{'shape':sh,'color':col,'rot':rot,'opts_angles':opts_angles},
                          'answer':str(ans_pos),'question':f'도형을 {rot}도 돌리면?','choices':['①','②','③','④']})
    return probs

def render_q14(ax, prob):
    qtitle(ax, prob['question'])
    p = prob['params']
    draw_shape(ax, p['shape'], 0.15, 0.65, sz=0.1, col=p['color'], angle=0)
    ax.text(0.15, 0.50, '원본', ha='center', fontsize=11, transform=ax.transAxes, **fkw())
    ax.text(0.28, 0.65, f"→{p['rot']}°", ha='center', va='center', fontsize=12,
            transform=ax.transAxes, **fkw())
    xs = [0.44, 0.58, 0.72, 0.86]
    for j, ang in enumerate(p['opts_angles']):
        draw_shape(ax, p['shape'], xs[j], 0.65, sz=0.09, col=p['color'], angle=ang)
        ax.text(xs[j], 0.50, SYM[j], ha='center', fontsize=12, transform=ax.transAxes, **fkw())

# ─── Q16: 칠교 ────────────────────────────────────────────────────
TANGRAM_RESULTS = [
    ('큰 삼각형 2개', 'square'),
    ('중간 삼각형 + 작은 삼각형', 'triangle'),
    ('중간 삼각형 + 정사각형', 'pentagon'),
]
TANGRAM_NAMES = ['정사각형','삼각형','오각형','평행사변형']

def gen_q16(rng):
    probs = []
    used = set()
    for level in ['easy','hard']:
        while len([p for p in probs if p['level']==level]) < 3:
            t_idx = rng.randint(0,2)
            desc, result_shape = TANGRAM_RESULTS[t_idx]
            key = (t_idx, level)
            if key in used: continue
            used.add(key)
            correct = {'square':'정사각형','triangle':'삼각형','pentagon':'오각형'}[result_shape]
            pool = TANGRAM_NAMES[:]
            choices, ans_pos = make_choices(correct, pool, rng, n=4)
            q = f'{desc}로 만들 수 있는 도형은?'
            probs.append({'qnn':16,'level':level,
                          'params':{'desc':desc,'result_shape':result_shape},
                          'answer':str(ans_pos),'question':q,'choices':choices})
    return probs

def render_q16(ax, prob):
    qtitle(ax, prob['question'])
    p = prob['params']
    # Draw 2 tangram pieces on left, result hint on right
    col1, col2 = '#E74C3C', '#3498DB'
    draw_shape(ax, 'triangle', 0.20, 0.63, sz=0.1, col=col1)
    draw_shape(ax, 'triangle', 0.38, 0.63, sz=0.08, col=col2)
    ax.text(0.55, 0.63, '→', ha='center', va='center', fontsize=22, transform=ax.transAxes)
    ax.add_patch(Rectangle((0.60, 0.50), 0.15, 0.25, color=LTYELLOW, ec='#DAA520',
                            lw=1.5, transform=ax.transAxes))
    ax.text(0.67, 0.62, '?', ha='center', va='center', fontsize=24,
            color='#8B4513', transform=ax.transAxes, **fkw())
    draw_choices(ax, prob['choices'], y=0.06)

# ─── Q17: 개수 세기 (hard-coded 케이스) ─────────────────────────
Q17_CASES = [
    # 다양한 정답을 보장하기 위한 케이스 배열
    # easy: 세모 세기(4), 큰 삼각형(5), 동그라미 세기(3)
    {'desc':'도형 혼합 배치에서 세모만 세기','answer':'4','level':'easy',
     'items':[('triangle',4),('circle',2),('square',2)]},
    {'desc':'큰 삼각형을 4개로 나누면 삼각형은 모두 몇 개?','answer':'5','level':'easy',
     'items':[('big_triangle_4split',1)]},
    {'desc':'도형에서 동그라미는 모두 몇 개?','answer':'3','level':'easy',
     'items':[('circle',3),('triangle',2),('square',3)]},
    # hard: 2×2 격자(5), 세모 세기(6), 사각형+삼각(7)
    {'desc':'2×2 격자에서 정사각형은 모두 몇 개?','answer':'5','level':'hard',
     'items':[('grid_2x2',1)]},
    {'desc':'도형 혼합에서 세모는 모두 몇 개?','answer':'6','level':'hard',
     'items':[('triangle',6),('circle',2),('square',2)]},
    {'desc':'도형 혼합에서 동그라미는 모두 몇 개?','answer':'4','level':'hard',
     'items':[('circle',4),('triangle',3),('square',2)]},
]

def gen_q17(rng):
    probs = []
    easy_cases = [c for c in Q17_CASES if c['level']=='easy']
    hard_cases = [c for c in Q17_CASES if c['level']=='hard']
    for c in easy_cases:
        probs.append({'qnn':17,'level':'easy',
                      'params':{'case_desc':c['desc'],'items':c['items']},
                      'answer':c['answer'],'question':c['desc'],'choices':None})
    for c in hard_cases:
        probs.append({'qnn':17,'level':'hard',
                      'params':{'case_desc':c['desc'],'items':c['items']},
                      'answer':c['answer'],'question':c['desc'],'choices':None})
    return probs

def render_q17(ax, prob):
    qtitle(ax, prob['question'])
    items = prob['params']['items']
    if items[0][0] == 'big_triangle_4split':
        # Large triangle divided into 4 small triangles
        sz = 0.22; cx, cy = 0.45, 0.62
        pts_big = [(cx, cy+sz*1.4),(cx-sz*1.4, cy-sz*0.8),(cx+sz*1.4, cy-sz*0.8)]
        ax.add_patch(Polygon(pts_big, closed=True, color='#85C1E9', ec='#2471A3', lw=2,
                             zorder=2, transform=ax.transAxes))
        # Internal division lines
        mid_left  = ((cx+cx-sz*1.4)/2, (cy+sz*1.4+cy-sz*0.8)/2)
        mid_right = ((cx+cx+sz*1.4)/2, (cy+sz*1.4+cy-sz*0.8)/2)
        mid_bot   = ((cx-sz*1.4+cx+sz*1.4)/2, cy-sz*0.8)
        for p1, p2 in [(mid_left,mid_right),(mid_left,mid_bot),(mid_right,mid_bot)]:
            ax.plot([p1[0],p2[0]],[p1[1],p2[1]],color='#2471A3',lw=2,transform=ax.transAxes)
    elif items[0][0] == 'grid_2x2':
        # 2x2 grid
        cell=0.16; gx0=0.25; gy0=0.40
        for r in range(2):
            for c in range(2):
                ax.add_patch(Rectangle((gx0+c*cell, gy0+r*cell), cell, cell,
                                        color='#D5F5E3', ec='#27AE60', lw=2,
                                        zorder=2, transform=ax.transAxes))
        ax.add_patch(Rectangle((gx0, gy0), cell*2, cell*2, fill=False,
                                ec='#27AE60', lw=2.5, zorder=3, transform=ax.transAxes))
    else:
        # Mixed shapes
        shapes_to_draw = []
        for shape, count in items:
            shapes_to_draw.extend([shape]*count)
        rng2 = random.Random(42)
        rng2.shuffle(shapes_to_draw)
        cols2 = 4; total2 = len(shapes_to_draw)
        xs = np.linspace(0.15, 0.85, min(cols2, total2))
        ys = np.linspace(0.75, 0.35, math.ceil(total2/cols2))
        col_map = {'triangle':'#E74C3C','circle':'#3498DB','square':'#27AE60'}
        for i, sh in enumerate(shapes_to_draw):
            r2, c2 = divmod(i, cols2)
            if r2 < len(ys) and c2 < len(xs):
                draw_shape(ax, sh, xs[c2], ys[r2], sz=0.07, col=col_map.get(sh,'#999'))

# ─── Q20: 도장 찍기 ────────────────────────────────────────────────
def gen_q20(rng):
    probs = []
    used = set()
    for level in ['easy','hard']:
        while len([p for p in probs if p['level']==level]) < 3:
            sh = rng.choice(['house','cross','pentagon','star'])
            col = rng.choice(COLORS6)
            orig_angle = rng.randint(0,3)*15
            key = (sh, col, orig_angle)
            if key in used: continue
            used.add(key)
            # Stamp result = left-right flip
            # Distractors: original, updown flip, 90deg rotation
            opts = [
                ('flip_h', sh, col, orig_angle),   # correct: stamp = LR flip
                ('orig',   sh, col, orig_angle),
                ('flip_v', sh, col, orig_angle),
                ('rot90',  sh, col, (orig_angle+90)%360),
            ]
            rng.shuffle(opts)
            correct = ('flip_h', sh, col, orig_angle)
            ans_pos = opts.index(correct)+1
            probs.append({'qnn':20,'level':level,
                          'params':{'shape':sh,'color':col,'angle':orig_angle,'opts':opts},
                          'answer':str(ans_pos),'question':'도장을 찍으면 어떤 모양이 될까요?','choices':['①','②','③','④']})
    return probs

def render_q20(ax, prob):
    qtitle(ax, prob['question'])
    p = prob['params']
    draw_shape(ax, p['shape'], 0.15, 0.65, sz=0.1, col=p['color'], angle=p['angle'])
    ax.text(0.15, 0.50, '도장', ha='center', fontsize=11, transform=ax.transAxes, **fkw())
    ax.text(0.28, 0.65, '→', ha='center', va='center', fontsize=22, transform=ax.transAxes)
    xs = [0.44, 0.58, 0.72, 0.86]
    for j, (mode, sh, col, ang) in enumerate(p['opts']):
        actual_ang = ang if mode != 'rot90' else ang+90
        draw_shape(ax, sh, xs[j], 0.65, sz=0.09, col=col,
                   angle=actual_ang if mode != 'flip_h' else -actual_ang)
        ax.text(xs[j], 0.50, SYM[j], ha='center', fontsize=12, transform=ax.transAxes, **fkw())

# ─── Q21: 도형 뒤집기 ─────────────────────────────────────────────
def gen_q21(rng):
    probs = []
    used = set()
    FLIP_MODES = ['flip_h','flip_v']
    for level in ['easy','hard']:
        while len([p for p in probs if p['level']==level]) < 3:
            sh = rng.choice(['house','cross','pentagon','star'])
            col = rng.choice(COLORS6)
            mode = rng.choice(FLIP_MODES)
            key = (sh, col, mode)
            if key in used: continue
            used.add(key)
            mode_kr = '좌우 뒤집기' if mode=='flip_h' else '상하 뒤집기'
            opts = [
                (mode,   sh, col, 0),   # correct
                ('orig', sh, col, 0),
                ('rot90',sh, col, 90),
                ('flip_v' if mode=='flip_h' else 'flip_h', sh, col, 0),
            ]
            rng.shuffle(opts)
            correct = (mode, sh, col, 0)
            ans_pos = opts.index(correct)+1
            probs.append({'qnn':21,'level':level,
                          'params':{'shape':sh,'color':col,'mode':mode,'angle':0,'opts':opts},
                          'answer':str(ans_pos),'question':f'{mode_kr}를 하면?','choices':['①','②','③','④']})
    return probs

def render_q21(ax, prob):
    render_q20(ax, prob)  # same visual layout

# ─── Q33: 모양 이름 ───────────────────────────────────────────────
SHAPE_NAME_MAP = {'triangle':'세모','square':'네모','circle':'동그라미','star':'별'}

def gen_q33(rng):
    probs = []
    shapes = list(SHAPE_NAME_MAP.keys())
    for level in ['easy','hard']:
        rng.shuffle(shapes)
        for sh in shapes[:3]:
            correct = SHAPE_NAME_MAP[sh]
            pool = list(SHAPE_NAME_MAP.values())
            choices, ans_pos = make_choices(correct, pool, rng, n=4)
            probs.append({'qnn':33,'level':level,
                          'params':{'shape':sh},
                          'answer':str(ans_pos),'question':'이 도형의 이름은?','choices':choices})
    return probs

def render_q33(ax, prob):
    qtitle(ax, prob['question'])
    p = prob['params']
    draw_shape(ax, p['shape'], 0.45, 0.65, sz=0.14, col='#3498DB')
    draw_choices(ax, prob['choices'], y=0.08)

# ─── Q35: 순서대로 ────────────────────────────────────────────────
SEQUENCES = [
    {'cards':['아침에 일어나기','밥 먹기','학교 가기','집에 오기'],'title':'하루 일과'},
    {'cards':['씨앗 심기','새싹 나기','꽃 피기','열매 맺기'],'title':'식물 성장'},
    {'cards':['알 낳기','병아리 부화','닭 성장','알 다시 낳기'],'title':'닭의 한살이'},
]

def gen_q35(rng):
    probs = []
    for level in ['easy','hard']:
        seq_list = SEQUENCES[:]
        rng.shuffle(seq_list)
        for seq_spec in seq_list[:3]:
            cards = seq_spec['cards'][:]
            n = len(cards)
            # Shuffle display order
            order = list(range(n)); rng.shuffle(order)
            shuffled = [cards[i] for i in order]
            # Question: "두 번째 카드는?" (2nd in correct order)
            correct_2nd = cards[1]
            correct_pos_in_shuffled = shuffled.index(correct_2nd)
            pool = shuffled[:]
            choices, ans_pos = make_choices(correct_2nd, pool, rng, n=4)
            q = f'순서대로 하면 두 번째로 해야 할 일은?'
            probs.append({'qnn':35,'level':level,
                          'params':{'cards':cards,'shuffled':shuffled,'order':order},
                          'answer':str(ans_pos),'question':q,'choices':choices})
    return probs[:3] + probs[3:6]

def render_q35(ax, prob):
    qtitle(ax, prob['question'])
    p = prob['params']
    shuffled = p['shuffled']
    n = len(shuffled)
    xs = np.linspace(0.12, 0.88, n)
    for i, card in enumerate(shuffled):
        ax.add_patch(Rectangle((xs[i]-0.09, 0.35), 0.18, 0.35, color='#EBF5FB',
                                ec='#3498DB', lw=1.5, zorder=2, transform=ax.transAxes))
        ax.text(xs[i], 0.52, card, ha='center', va='center', fontsize=10,
                transform=ax.transAxes, **fkw(), wrap=True)
        ax.text(xs[i], 0.32, str(i+1), ha='center', va='top', fontsize=12,
                color='#7F8C8D', transform=ax.transAxes, **fkw())
    draw_choices(ax, prob['choices'], y=0.06)

# ─── Q37: 그림 완성 ────────────────────────────────────────────────
SYMMETRIC_SHAPES = [
    {'name':'나비','left_pts':[(0.1,0.5),(0.2,0.7),(0.3,0.65),(0.4,0.5)],
     'col':'#F39C12'},
    {'name':'하트','left_pts':[(0.2,0.7),(0.1,0.55),(0.2,0.4),(0.4,0.5)],
     'col':'#E74C3C'},
    {'name':'별모양','left_pts':[(0.25,0.75),(0.15,0.5),(0.3,0.4),(0.4,0.55)],
     'col':'#9B59B6'},
]

def gen_q37(rng):
    probs = []
    for level in ['easy','hard']:
        shapes = SYMMETRIC_SHAPES[:]
        rng.shuffle(shapes)
        for sp in shapes[:3]:
            correct_name = f'{sp["name"]} 오른쪽'
            pool = [s['name']+'의 조각' for s in SYMMETRIC_SHAPES]+['다른 조각']
            choices = [correct_name, pool[0], pool[1], '빈 조각']
            rng.shuffle(choices)
            ans_pos = choices.index(correct_name)+1
            probs.append({'qnn':37,'level':level,
                          'params':{'name':sp['name'],'col':sp['col']},
                          'answer':str(ans_pos),'question':f'{sp["name"]} 그림을 완성하는 조각은?','choices':choices})
    return probs[:3] + probs[3:6]

def render_q37(ax, prob):
    qtitle(ax, prob['question'])
    p = prob['params']
    col = p['col']
    # Draw left half of symmetric shape
    ax.add_patch(mpatches.Ellipse((0.28, 0.62), 0.22, 0.35, color=col, alpha=0.7,
                                   transform=ax.transAxes))
    # Right half is missing (shown as dashed outline)
    ax.add_patch(mpatches.Ellipse((0.52, 0.62), 0.22, 0.35, fill=False,
                                   ec=col, lw=1.5, ls='--', transform=ax.transAxes))
    ax.text(0.52, 0.62, '?', ha='center', va='center', fontsize=24,
            color=col, transform=ax.transAxes, **fkw())
    draw_choices(ax, prob['choices'], y=0.06)

# ─── Q38: 위치와 방향 ─────────────────────────────────────────────
POSITIONS = ['위에','아래에','왼쪽에','오른쪽에']
DESK_ITEMS = ['책','연필','지우개','가방','컵','자']

def gen_q38(rng):
    probs = []
    used = set()
    for level in ['easy','hard']:
        while len([p for p in probs if p['level']==level]) < 3:
            pos = rng.choice(POSITIONS)
            item = rng.choice(DESK_ITEMS)
            other_items = [x for x in DESK_ITEMS if x != item]
            others = rng.sample(other_items, 3)
            key = (pos, item)
            if key in used: continue
            used.add(key)
            layout = {'위에': item, '아래에': others[0], '왼쪽에': others[1], '오른쪽에': others[2]}
            correct = item
            pool = DESK_ITEMS[:]
            choices, ans_pos = make_choices(correct, pool, rng, n=4)
            q = f'책상 {pos} 있는 것은?'
            probs.append({'qnn':38,'level':level,
                          'params':{'layout':layout,'target_pos':pos},
                          'answer':str(ans_pos),'question':q,'choices':choices})
    return probs

def render_q38(ax, prob):
    qtitle(ax, prob['question'])
    p = prob['params']
    layout = p['layout']
    # Draw desk
    ax.add_patch(Rectangle((0.25, 0.35), 0.50, 0.30, color='#D5B895', ec='#8B6914',
                            lw=2, zorder=3, transform=ax.transAxes))
    ax.text(0.50, 0.50, layout.get('위에',''), ha='center', va='center',
            fontsize=12, transform=ax.transAxes, **fkw())
    ax.text(0.50, 0.28, layout.get('아래에',''), ha='center', va='center',
            fontsize=12, transform=ax.transAxes, **fkw())
    ax.text(0.16, 0.50, layout.get('왼쪽에',''), ha='center', va='center',
            fontsize=12, transform=ax.transAxes, **fkw())
    ax.text(0.84, 0.50, layout.get('오른쪽에',''), ha='center', va='center',
            fontsize=12, transform=ax.transAxes, **fkw())
    draw_choices(ax, prob['choices'], y=0.06)

# ─── Q48: 전개도 ─────────────────────────────────────────────────
NETS = [
    {'solid':'정육면체','solid_en':'cube','net':'십자형'},
    {'solid':'원기둥','solid_en':'cylinder','net':'사각형+원 2개'},
    {'solid':'삼각기둥','solid_en':'triangular_prism','net':'삼각형 2개+사각형 3개'},
]

def gen_q48(rng):
    probs = []
    solid_names = [n['solid'] for n in NETS]
    for level in ['easy','hard']:
        specs = NETS[:]
        rng.shuffle(specs)
        for sp in specs[:3]:
            correct = sp['solid']
            pool = solid_names[:]
            choices, ans_pos = make_choices(correct, pool, rng, n=3)
            while len(choices) < 4:
                choices.append('삼각뿔')
            probs.append({'qnn':48,'level':level,
                          'params':{'solid':sp['solid'],'net':sp['net']},
                          'answer':str(ans_pos),'question':'이 전개도를 접으면?','choices':choices})
    return probs[:3] + probs[3:6]

def render_q48(ax, prob):
    qtitle(ax, prob['question'])
    p = prob['params']
    solid = p['solid']
    col = '#85C1E9'
    t = ax.transAxes
    # Draw net
    if solid == '정육면체':
        positions = [(0.35,0.65),(0.35,0.55),(0.25,0.55),(0.45,0.55),(0.35,0.45),(0.35,0.35)]
        for px,py in positions:
            ax.add_patch(Rectangle((px, py), 0.1, 0.1, color=col, ec='#2471A3', lw=1.5, transform=t))
    elif solid == '원기둥':
        ax.add_patch(Rectangle((0.25,0.45), 0.30, 0.20, color=col, ec='#2471A3', lw=1.5, transform=t))
        ax.add_patch(mpatches.Ellipse((0.40, 0.35), 0.16, 0.08, color=col, ec='#2471A3', lw=1.5, transform=t))
        ax.add_patch(mpatches.Ellipse((0.40, 0.65), 0.16, 0.08, color=col, ec='#2471A3', lw=1.5, transform=t))
    elif solid == '삼각기둥':
        # 3 rectangles + 2 triangles
        for i in range(3):
            ax.add_patch(Rectangle((0.15+i*0.16, 0.45), 0.14, 0.20, color=col, ec='#2471A3', lw=1.5, transform=t))
        pts_l = [(0.20,0.45),(0.27,0.65),(0.14,0.65)]
        pts_r = [(0.62,0.45),(0.69,0.65),(0.55,0.65)]
        ax.add_patch(Polygon(pts_l, closed=True, color=col, ec='#2471A3', lw=1.5, transform=t))
        ax.add_patch(Polygon(pts_r, closed=True, color=col, ec='#2471A3', lw=1.5, transform=t))
    draw_choices(ax, prob['choices'], y=0.06)


# ═══════════════════════════════════════════════════════════════════
# 렌더 디스패치
# ═══════════════════════════════════════════════════════════════════

RENDER_MAP = {
    24: render_q24, 39: render_q39, 42: render_q42, 40: render_q40,
    41: render_q41, 34: render_q34, 49: render_q49, 15: render_q15,
    8:  render_q8,  22: render_q22,
    5:  render_q5,  6:  render_q6,  7:  render_q7,  9:  render_q9,
    12: render_q12, 13: render_q13, 14: render_q14, 16: render_q16,
    17: render_q17, 20: render_q20, 21: render_q21, 33: render_q33,
    35: render_q35, 37: render_q37, 38: render_q38, 48: render_q48,
}

# ═══════════════════════════════════════════════════════════════════
# 검증
# ═══════════════════════════════════════════════════════════════════

def validate(qnn, probs):
    easy = [p for p in probs if p['level']=='easy']
    hard = [p for p in probs if p['level']=='hard']
    assert len(easy)==3, f"q{qnn} easy 개수 {len(easy)} ≠ 3"
    assert len(hard)==3, f"q{qnn} hard 개수 {len(hard)} ≠ 3"
    for lv, items in [('easy',easy),('hard',hard)]:
        answers = [p['answer'] for p in items]
        assert len(set(answers))>=2, f"q{qnn} {lv} 정답 다양성 실패: {answers}"
        params_set = set(json.dumps(p['params'],sort_keys=True) for p in items)
        assert len(params_set)==3, f"q{qnn} {lv} params 중복"
        for p in items:
            if p['choices'] is not None:
                assert p['answer'] in ['1','2','3','4'], \
                    f"q{qnn} answer out of range: {p['answer']}"
                assert p['choices'] is not None
                assert len(p['choices']) >= 2

# ═══════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════

TIER1 = [24, 39, 42, 40, 41, 34, 49, 15, 8, 22]
TIER2 = [5, 6, 7, 9, 12, 13, 14, 16, 17, 20, 21, 33, 35, 37, 38, 48]

GEN_MAP = {
    24: gen_q24, 39: gen_q39, 42: gen_q42, 40: gen_q40, 41: gen_q41,
    34: gen_q34, 49: gen_q49, 15: gen_q15, 8:  gen_q8,  22: gen_q22,
    5:  gen_q5,  6:  gen_q6,  7:  gen_q7,  9:  gen_q9,  12: gen_q12,
    13: gen_q13, 14: gen_q14, 16: gen_q16, 17: gen_q17, 20: gen_q20,
    21: gen_q21, 33: gen_q33, 35: gen_q35, 37: gen_q37, 38: gen_q38,
    48: gen_q48,
}

def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--tier', choices=['1','2','all'], default='all')
    parser.add_argument('--seed', type=int, default=42)
    args = parser.parse_args()

    setup_font()
    OUT_BASE.mkdir(parents=True, exist_ok=True)

    tiers = {'1': TIER1, '2': TIER2, 'all': TIER1+TIER2}
    types = tiers[args.tier]
    rng = random.Random(args.seed)

    print(f"\n▶ HF Phase2 생성 시작 (seed={args.seed})\n")
    all_results = []

    for qnn in types:
        gen_fn  = GEN_MAP[qnn]
        rend_fn = RENDER_MAP[qnn]
        rng2 = random.Random(args.seed + qnn)

        probs = gen_fn(rng2)

        # 다양성 부족 시 자동 보정
        ensure_diversity(probs, rng2)

        # 검증
        validate(qnn, probs)

        easy = [p for p in probs if p['level']=='easy']
        hard = [p for p in probs if p['level']=='hard']
        answers_easy = [p['answer'] for p in easy]
        answers_hard = [p['answer'] for p in hard]
        all_results.append((qnn, answers_easy, answers_hard))

        # 렌더 + 저장
        for idx, prob in enumerate(easy + hard, 1):
            fig, ax = new_fig(6.5, 5.0)
            rend_fn(ax, prob)
            save_prob(qnn, idx, fig, prob['answer'], prob['params'])

        print(f"  ✓ q{qnn:02d}  easy:{answers_easy}  hard:{answers_hard}")

    # 최종 보고 테이블
    print("\n" + "="*65)
    print(f"{'q번':>4}  {'easy 정답':^20}  {'hard 정답':^20}")
    print("-"*65)
    for qnn, ae, ah in all_results:
        print(f"  {qnn:>2}  {str(ae):<22} {str(ah):<22}")
    print("="*65)
    print(f"\n총 {len(types)}유형 × 6문제 = {len(types)*6}개 생성 완료")
    print(f"출력 경로: {OUT_BASE}")

if __name__ == '__main__':
    main()
