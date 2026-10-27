# 자연관찰 공원 지도 — Blender로 해변 공원(공원 + 둘레 길·해변·바다, 그림 끝까지 땅이 이어짐)을 만들고 렌더한다. 원장 2026-10-26: 「솔은 이 정도 된다는데?(Blender 디오라마) — 난 맵을 말하는 거야 먼저」.
# 렌더 한 장(가로 2560×1440 — PC와 폰의 「가로로 크게」 모두) + 지점·길·사람들 좌표(그림 위 %)를 JSON으로 낸다 → tools/blender/park-apply.mjs가 data/park-map.js에 옮긴다.
# 실행(머리 없이):  blender -b -P park-map.py -- --out <폴더> [--preview] [--trees <나무 모델 .blend>]
#   이 컨테이너: python3.13 -m venv /tmp/bpyenv && /tmp/bpyenv/bin/pip install bpy==5.2.3 → /tmp/bpyenv/bin/python -I park-map.py -- --out <폴더>
#   원장 맥: Blender 앱의 blender 실행 파일로 같은 명령. --trees에 나무 모델 파일을 주면 그 안의 물체(이름에 tree가 든 것)를 나무 자리에 놓는다(없으면 코드로 만든 나무).
# 단위 m, Z가 위. 공원 약 104×57 m(남·동쪽 해변, 북·서쪽 차도). 실제 장소를 그대로 옮긴 것이 아니다(장소 이름은 화면에 쓰지 않는다).
import bpy, bmesh, math, random, json, os, sys
from mathutils import Vector, Matrix, noise as mnoise
from bpy_extras.object_utils import world_to_camera_view
import numpy as np

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = argv[argv.index('--out') + 1] if '--out' in argv else '/tmp/park'
PREVIEW = '--preview' in argv
COORDS_ONLY = '--coords-only' in argv  # 렌더 없이 지점 좌표(park-coords.json)만
DIV = int(argv[argv.index('--div') + 1]) if '--div' in argv else (4 if PREVIEW else 1)   # 해상도 나누기(시험용)
TREES = argv[argv.index('--trees') + 1] if '--trees' in argv else None
os.makedirs(OUT, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
R = random.Random(7)
TOP = 0.0          # 잔디 윗면 높이
# 원장 2026-10-27 「너무 오밀조밀 모여 있는 것 같아」 → 자리(땅·길·물·지점)만 K배로 벌리고 나무·천막·정자·사람 같은 물건 크기는 그대로.
# 아래 좌표는 벌리기 전 값으로 쓰고, 다 지은 뒤 spread_layout()이 한 번에 벌린다(카메라·지점 좌표도 K배).
K = 1.5
THICK = 1.4        # 섬 두께

def link(o):
    sc.collection.objects.link(o); return o

def mesh_obj(name, verts, faces, mat=None):
    me = bpy.data.meshes.new(name); me.from_pydata(verts, [], faces); me.update()
    o = link(bpy.data.objects.new(name, me))
    if mat: me.materials.append(mat)
    return o

def catmull(pts, n=8, closed=False):
    P = pts + pts[:3] if closed else [pts[0]] + pts + [pts[-1]]
    out = []
    rng = range(len(pts)) if closed else range(len(pts) - 1)
    for i in rng:
        p0, p1, p2, p3 = [Vector(P[i + k]) if closed else Vector(P[i + k]) for k in range(4)]
        for j in range(n):
            t = j / n
            out.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t))
    if not closed: out.append(Vector(pts[-1]))
    return out

# ── 재질 ──
def principled(name, color, rough=0.6, **kw):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*color, 1); b.inputs['Roughness'].default_value = rough
    for k, v in kw.items(): b.inputs[k].default_value = v
    return m

def noise_mat(name, c1, c2, scale=8, rough=0.8, bump=0.2, detail=6, bump_scale=None):
    m = bpy.data.materials.new(name); m.use_nodes = True; N = m.node_tree.nodes; L = m.node_tree.links; b = N['Principled BSDF']
    tc = N.new('ShaderNodeTexCoord'); n = N.new('ShaderNodeTexNoise'); n.inputs['Scale'].default_value = scale; n.inputs['Detail'].default_value = detail
    L.new(tc.outputs['Object'], n.inputs['Vector'])
    ramp = N.new('ShaderNodeValToRGB'); ramp.color_ramp.elements[0].color = (*c1, 1); ramp.color_ramp.elements[1].color = (*c2, 1)
    L.new(n.outputs['Fac'], ramp.inputs['Fac']); L.new(ramp.outputs['Color'], b.inputs['Base Color']); b.inputs['Roughness'].default_value = rough
    if bump:
        n2 = N.new('ShaderNodeTexNoise'); n2.inputs['Scale'].default_value = bump_scale or scale * 12; L.new(tc.outputs['Object'], n2.inputs['Vector'])
        bp = N.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = bump; L.new(n2.outputs['Fac'], bp.inputs['Height']); L.new(bp.outputs['Normal'], b.inputs['Normal'])
    return m

def brick_mat(name, c1, c2, mortar, scale=6, rough=0.85):
    m = bpy.data.materials.new(name); m.use_nodes = True; N = m.node_tree.nodes; L = m.node_tree.links; b = N['Principled BSDF']
    tc = N.new('ShaderNodeTexCoord'); br = N.new('ShaderNodeTexBrick'); L.new(tc.outputs['Object'], br.inputs['Vector'])
    br.inputs['Color1'].default_value = (*c1, 1); br.inputs['Color2'].default_value = (*c2, 1); br.inputs['Mortar'].default_value = (*mortar, 1)
    br.inputs['Scale'].default_value = scale; br.inputs['Mortar Size'].default_value = 0.012
    n = N.new('ShaderNodeTexNoise'); n.inputs['Scale'].default_value = 40; L.new(tc.outputs['Object'], n.inputs['Vector'])
    mix = N.new('ShaderNodeMix'); mix.data_type = 'RGBA'; mix.blend_type = 'OVERLAY'; mix.inputs['Factor'].default_value = 0.25
    L.new(br.outputs['Color'], mix.inputs[6]); L.new(n.outputs['Color'], mix.inputs[7]); L.new(mix.outputs[2], b.inputs['Base Color'])
    b.inputs['Roughness'].default_value = rough
    bp = N.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = 0.35; L.new(br.outputs['Fac'], bp.inputs['Height']); L.new(bp.outputs['Normal'], b.inputs['Normal'])
    return m

GRASS = noise_mat('grass', (0.13, 0.33, 0.07), (0.30, 0.50, 0.12), scale=0.35, rough=0.9, bump=0.15, bump_scale=60)
SIDE = noise_mat('side', (0.30, 0.20, 0.12), (0.45, 0.32, 0.20), scale=2, rough=0.9, bump=0.3)
PAVE = brick_mat('pave', (0.62, 0.58, 0.53), (0.55, 0.52, 0.48), (0.72, 0.70, 0.66), scale=1.4)
PLAZA = brick_mat('plaza', (0.62, 0.36, 0.26), (0.55, 0.31, 0.22), (0.74, 0.66, 0.58), scale=1.6)
WATER = principled('water', (0.03, 0.13, 0.14), rough=0.04)
STONE = noise_mat('stone', (0.20, 0.19, 0.18), (0.36, 0.35, 0.33), scale=3, rough=0.75, bump=0.4)
WOOD = noise_mat('wood', (0.30, 0.19, 0.11), (0.42, 0.28, 0.16), scale=6, rough=0.7, bump=0.15)
BARK = noise_mat('bark', (0.16, 0.12, 0.09), (0.30, 0.25, 0.20), scale=10, rough=0.9, bump=0.6, bump_scale=60)
RED = principled('pillar', (0.45, 0.07, 0.05), rough=0.5)
ROOF = principled('roof', (0.12, 0.12, 0.14), rough=0.6)
SOIL = noise_mat('soil', (0.18, 0.12, 0.08), (0.28, 0.20, 0.13), scale=4, rough=1, bump=0.3)

# 잎 질감(코드로 그림): 끝이 뾰족한 타원 + 가운데 잎맥, 알파로 오려 냄
def leaf_image(name, needle=False):
    S = 128; img = bpy.data.images.new(name, S, S, alpha=True); px = np.zeros((S, S, 4), np.float32)
    v, u = np.mgrid[0:S, 0:S] / (S - 1)
    if needle:
        a = np.zeros((S, S))
        for k in range(9):
            ang = -0.9 + k * 0.225; dx, dy = math.sin(ang), math.cos(ang)
            d = np.abs((u - 0.5) * dy - (v - 0.05) * dx); t = (u - 0.5) * dx + (v - 0.05) * dy
            a = np.maximum(a, ((d < 0.018) & (t > 0) & (t < 0.95)).astype(float))
        px[..., 0], px[..., 1], px[..., 2] = 0.10, 0.24, 0.10
    else:
        w = 0.42 * np.clip(np.sin(np.pi * v), 0, 1) ** 0.8; d = np.abs(u - 0.5)
        a = np.clip((w - d) * 40, 0, 1)
        g = 0.75 + 0.25 * np.clip(1 - d / (w + 1e-3), 0, 1); vein = np.clip(1 - np.abs(u - 0.5) * 60, 0, 1) * 0.25
        px[..., 0], px[..., 1], px[..., 2] = 0.20 * g, 0.42 * g - vein * 0.1, 0.10 * g
    px[..., 3] = a
    img.pixels = px.ravel(); img.pack(); return img

def leaf_mat(name, img):
    m = bpy.data.materials.new(name); m.use_nodes = True; N = m.node_tree.nodes; L = m.node_tree.links; b = N['Principled BSDF']
    t = N.new('ShaderNodeTexImage'); t.image = img
    at = N.new('ShaderNodeAttribute'); at.attribute_name = 'tint'
    mul = N.new('ShaderNodeMix'); mul.data_type = 'RGBA'; mul.blend_type = 'MULTIPLY'; mul.inputs['Factor'].default_value = 1
    L.new(t.outputs['Color'], mul.inputs[6]); L.new(at.outputs['Color'], mul.inputs[7]); L.new(mul.outputs[2], b.inputs['Base Color'])
    L.new(t.outputs['Alpha'], b.inputs['Alpha']); b.inputs['Roughness'].default_value = 0.55
    b.inputs['Subsurface Weight'].default_value = 0.15
    return m

LEAF = leaf_mat('leaf', leaf_image('leaf_img')); NEEDLE = leaf_mat('needle', leaf_image('needle_img', True))

# ── 섬(바닥판) ──
# 원장 2026-10-26 「맵 더 넓혀야지」 → 약 104×57 m로 넓힘: 서쪽 바위 언덕 · 동쪽 갈대 습지 · 북쪽 숲 더 깊게 · 남쪽 입구 길게
OUTLINE = [(-50, -10), (-47, -20), (-36, -26), (-18, -28), (-4, -27.5), (12, -28), (30, -25), (44, -18), (51, -6), (52, 6), (47, 17), (34, 25), (16, 28.5), (-4, 28), (-22, 27), (-38, 23), (-48, 13), (-52, 1)]
ring = catmull([(x, y, 0) for x, y in OUTLINE], n=10, closed=True)

def prism(name, pts2d, z0, z1, mat):
    bm = bmesh.new(); top = [bm.verts.new((p.x, p.y, z1)) for p in pts2d]; bot = [bm.verts.new((p.x, p.y, z0)) for p in pts2d]
    bm.faces.new(top); bm.faces.new(list(reversed(bot)))
    n = len(pts2d)
    for i in range(n): bm.faces.new([top[i], bot[i], bot[(i + 1) % n], top[(i + 1) % n]])
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); o = link(bpy.data.objects.new(name, me)); me.materials.append(mat); return o

island = prism('island', ring, TOP - THICK, TOP, GRASS); island.data.materials.append(SIDE)
for f in island.data.polygons: f.material_index = 0 if f.normal.z > 0.5 else 1

# 연못: 섬을 파고 물을 낮게 채운다
POND_C = Vector((1.5, 2.0, 0))
pond_pts = [POND_C + Vector((math.cos(a) * (10.5 + 1.6 * math.sin(3 * a + 1)), math.sin(a) * (6.2 + 1.0 * math.cos(2 * a)), 0)) for a in np.linspace(0, 2 * math.pi, 48, endpoint=False)]
cut = prism('pondcut', pond_pts, TOP - 0.6, TOP + 0.5, WATER)
md = island.modifiers.new('pond', 'BOOLEAN'); md.operation = 'DIFFERENCE'; md.object = cut; md.solver = 'EXACT'
bpy.context.view_layer.objects.active = island; bpy.ops.object.modifier_apply(modifier='pond'); bpy.data.objects.remove(cut)
water = prism('water', pond_pts, TOP - 0.62, TOP - 0.32, WATER)
# 갈대 습지(동쪽): 개울이 흘러드는 얕은 물웅덩이
MARSH_C = Vector((38, -10, 0))
marsh_pts = [MARSH_C + Vector((math.cos(a) * (7.5 + 1.2 * math.sin(2 * a + 0.5)), math.sin(a) * (4.6 + 0.8 * math.cos(3 * a)), 0)) for a in np.linspace(0, 2 * math.pi, 40, endpoint=False)]
cut = prism('marshcut', marsh_pts, TOP - 0.4, TOP + 0.5, WATER)
md = island.modifiers.new('marsh', 'BOOLEAN'); md.operation = 'DIFFERENCE'; md.object = cut; md.solver = 'EXACT'
bpy.context.view_layer.objects.active = island; bpy.ops.object.modifier_apply(modifier='marsh'); bpy.data.objects.remove(cut)
marsh = prism('marshwater', marsh_pts, TOP - 0.42, TOP - 0.2, WATER)
wn = WATER.node_tree; nb = wn.nodes.new('ShaderNodeTexNoise'); nb.inputs['Scale'].default_value = 6; bp = wn.nodes.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = 0.08
wn.links.new(nb.outputs['Fac'], bp.inputs['Height']); wn.links.new(bp.outputs['Normal'], wn.nodes['Principled BSDF'].inputs['Normal'])

def rock(name, loc, size, seed, mat=STONE):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=4, radius=1, location=loc); o = bpy.context.object; o.name = name
    rr = random.Random(seed); off = Vector((rr.uniform(-50, 50), rr.uniform(-50, 50), rr.uniform(-50, 50)))
    # 점마다 제멋대로 늘리면 구겨진 종이처럼 보인다 → 부드러운 잡음으로 둥글게 울퉁불퉁 + 아래는 평평하게(땅에 앉은 돌)
    for v in o.data.vertices:
        v.co *= 0.85 + 0.35 * mnoise.noise(v.co * 1.1 + off) + 0.08 * mnoise.noise(v.co * 3.2 + off)
        if v.co.z < -0.35: v.co.z = -0.35 + (v.co.z + 0.35) * 0.3
    o.scale = size; o.rotation_euler = (rr.random(), rr.random(), rr.random() * 6); o.data.materials.append(mat)
    for p in o.data.polygons: p.use_smooth = True
    return o

for i, p in enumerate(pond_pts):
    if i % 2 == 0: rock(f'rim{i}', (p.x, p.y, TOP - 0.15), (0.55 + R.random() * 0.4, 0.45 + R.random() * 0.3, 0.3), i)

# ── 길(띠) ──
def ribbon(name, center, width, mat, z=TOP + 0.04, thick=0.08, closed=False):
    width = width / K   # 나중에 땅과 함께 K배로 벌어지므로 미리 나눠 둔다
    pts = catmull([(x, y, 0) for x, y in center], n=6, closed=closed); verts = []; faces = []
    n = len(pts)
    for i, p in enumerate(pts):
        a = pts[(i + 1) % n] if (closed or i < n - 1) else p; b = pts[i - 1] if (closed or i > 0) else p
        t = (a - b).normalized(); nrm = Vector((-t.y, t.x, 0))
        verts += [(p + nrm * width / 2)[:2] + (z,), (p - nrm * width / 2)[:2] + (z,)]
    for i in range(n - (0 if closed else 1)):
        j = (i + 1) % n; faces.append((2 * i, 2 * i + 1, 2 * j + 1, 2 * j))  # 윗면이 위를 보게(반대로 감으면 두께를 주는 쪽이 뒤집혀 길 끝이 검게 나왔다)
    o = mesh_obj(name, verts, faces, mat); s = o.modifiers.new('s', 'SOLIDIFY'); s.thickness = thick; s.offset = -1
    return o, pts

LOOP = [(-6, -12), (-12, -6), (-18, -1), (-16, 8), (-10, 13), (-4, 14.5), (4, 15), (12, 14), (20, 12), (25, 6), (24.5, 0), (21, -3.5), (16, -7), (10, -9.5), (2, -10.5)]
ribbon('loop', LOOP, 2.4, PAVE, closed=True)
ribbon('entry', [(-6, -28.5), (-6, -22), (-6, -12)], 2.8, PAVE)
# 서쪽 바위 언덕 길 · 동쪽 습지 길(나무 데크로 이어짐)
ribbon('west', [(-18, -1), (-25, -3.5), (-32, -4.5), (-37, -3)], 2.0, PAVE, z=TOP + 0.03)
ribbon('east', [(24.5, 0), (29, -2), (33, -3.5)], 2.0, PAVE, z=TOP + 0.03)
# 광장(둥근 벽돌 마당)
bpy.ops.mesh.primitive_cylinder_add(vertices=64, radius=6, depth=0.2, location=(-6, -12, TOP + 0.07)); plaza = bpy.context.object; plaza.data.materials.append(PLAZA); plaza['lay'] = 'xy'

# 개울 + 다리
STREAM = [(11.5, 0), (14, -3.5), (16, -7), (20, -10.5), (25.5, -12.5), (31, -12)]
ribbon('stream', STREAM, 1.8, WATER, z=TOP + 0.02, thick=0.03)
for i, sp in enumerate(catmull([(x, y, 0) for x, y in STREAM], n=4)[::2]):
    x, y = sp.x, sp.y
    for s in (-1, 1): rock(f'srock{i}{s}', (x + s * 1.1 + R.uniform(-0.2, 0.2), y + R.uniform(-0.3, 0.3), TOP + 0.05), (0.35, 0.3, 0.2), 100 + i * 2 + s)
bpy.ops.mesh.primitive_cube_add(location=(16, -7, TOP + 0.45)); br = bpy.context.object; br.scale = (1.6, 1.4, 0.12); br.rotation_euler.z = math.radians(-35); br.data.materials.append(WOOD)
for s in (-1, 1):
    bpy.ops.mesh.primitive_cube_add(location=(16 + s * 0.8 * math.sin(math.radians(35)), -7 + s * 0.8 * math.cos(math.radians(35)) * 1, TOP + 0.85)); r = bpy.context.object; r.scale = (1.6, 0.06, 0.06); r.rotation_euler.z = math.radians(-35); r.data.materials.append(WOOD)

# 바위 언덕(서쪽): 낮은 둔덕 + 크고 작은 바위(화강암 빛·어두운 현무암 빛)
GRAVEL = noise_mat('gravel', (0.20, 0.17, 0.13), (0.32, 0.28, 0.22), scale=6, rough=0.95, bump=0.5, bump_scale=80)
DARK = noise_mat('basalt', (0.16, 0.16, 0.17), (0.28, 0.27, 0.27), scale=5, rough=0.8, bump=0.5)
GRANITE = noise_mat('granite', (0.24, 0.22, 0.20), (0.42, 0.40, 0.37), scale=14, rough=0.7, bump=0.3)
bpy.ops.mesh.primitive_uv_sphere_add(segments=48, ring_count=24, radius=1, location=(-42, 4, TOP - 0.2)); hill = bpy.context.object; hill.scale = (8.5, 6.5, 2.0); hill.data.materials.append(GRAVEL); hill['lay'] = 'xy'
for p_ in hill.data.polygons: p_.use_smooth = True
rr = random.Random(21)
for k in range(16):
    a = rr.random() * 6.283; d = math.sqrt(rr.random()) * 0.8; x, y = -42 + math.cos(a) * 8 * d, 4 + math.sin(a) * 6 * d
    z = TOP - 0.2 + 2.0 * math.sqrt(max(0, 1 - d * d)) - 0.2; sz = rr.uniform(0.7, 2.0) * (1.3 - d)
    rock(f'hillrock{k}', (x, y, z), (sz * rr.uniform(1, 1.5), sz, sz * 0.7), 300 + k, GRANITE if k % 3 else DARK)
rock('bigrock', (-38.5, 0.5, TOP + 0.6), (2.6, 1.9, 1.5), 330, GRANITE)

# 갈대 습지: 물가와 얕은 물에 부들·갈대, 개울 끝에서 이어지는 나무 데크
REED = principled('reed', (0.36, 0.48, 0.14), rough=0.8)
SPIKE = principled('cattail', (0.30, 0.17, 0.08), rough=0.9)
rr = random.Random(31); verts = []; faces = []
for k in range(5200):
    i = rr.randrange(len(marsh_pts)); q = MARSH_C + (marsh_pts[i] - MARSH_C) * rr.uniform(0.55, 1.18)
    if (Vector((q.x, q.y)) - Vector((36, -6.5))).length < 2.2: continue
    h = rr.uniform(1.0, 2.0); w = 0.04; t = rr.random() * 6.283; lean = Vector((rr.uniform(-.15, .15), rr.uniform(-.15, .15), 0))
    dx, dy = math.cos(t) * w, math.sin(t) * w; i0 = len(verts); z0 = TOP - 0.25
    verts += [(q.x - dx, q.y - dy, z0), (q.x + dx, q.y + dy, z0), tuple(Vector((q.x, q.y, z0 + h)) + lean * h)]; faces.append((i0, i0 + 1, i0 + 2))
mesh_obj('reeds', verts, faces, REED)
bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.07, depth=0.42); spike = bpy.context.object; spike.data.materials.append(SPIKE)
for k in range(90):
    i = rr.randrange(len(marsh_pts)); q = MARSH_C + (marsh_pts[i] - MARSH_C) * rr.uniform(0.6, 1.1)
    c = spike.copy(); c.location = (q.x, q.y, TOP - 0.25 + rr.uniform(1.3, 1.8)); link(c)
bpy.data.objects.remove(spike)
DECK = [(33, -3.5), (35.5, -6.5), (37, -9.5), (38.5, -12.5)]
for k, (a, b) in enumerate(zip(DECK, DECK[1:])):
    a, b = Vector(a), Vector(b); m = (a + b) / 2; d = b - a
    bpy.ops.mesh.primitive_cube_add(location=(m.x, m.y, TOP + 0.12 + k * 0.012)); o = bpy.context.object; o.scale = (d.length / 2 + 0.3, 0.8, 0.07); o.rotation_euler.z = math.atan2(d.y, d.x); o.data.materials.append(WOOD); o['lay'] = 'len'

# 대회 본부 천막 둘 + 안내판(광장 가장자리), 남쪽 입구 나무 문
TENT = principled('tent', (0.94, 0.94, 0.90), rough=0.6); TENT2 = principled('tent2', (0.22, 0.52, 0.32), rough=0.6); POLE = principled('pole', (0.75, 0.75, 0.75), rough=0.4, **{'Metallic': 0.6})
def tent(x, y, rot, size=2.8):
    g = []
    for sx in (-1, 1):
        for sy in (-1, 1):
            bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.06, depth=2.2, location=(x + sx * size / 2, y + sy * size / 2, TOP + 1.25)); bpy.context.object.data.materials.append(POLE)
    bpy.ops.mesh.primitive_cone_add(vertices=4, radius1=size * 0.76, radius2=0.05, depth=1.0, location=(x, y, TOP + 2.85), rotation=(0, 0, math.radians(45) + rot)); bpy.context.object.data.materials.append(TENT)
    bpy.ops.mesh.primitive_cube_add(location=(x, y, TOP + 2.28)); o = bpy.context.object; o.scale = (size / 2 + 0.05, size / 2 + 0.05, 0.12); o.rotation_euler.z = rot; o.data.materials.append(TENT2)
    bpy.ops.mesh.primitive_cube_add(location=(x, y - 0.2, TOP + 0.55)); o = bpy.context.object; o.scale = (1.0, 0.35, 0.04); o.data.materials.append(TENT)
tent(-10.2, -15.2, 0); tent(-6.8, -16.8, 0)
for dx in (-0.7, 0.7):
    bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.08, depth=1.8, location=(-1.6 + dx, -15.2, TOP + 0.9)); bpy.context.object.data.materials.append(WOOD)
bpy.ops.mesh.primitive_cube_add(location=(-1.6, -15.2, TOP + 1.45)); o = bpy.context.object; o.scale = (1.0, 0.06, 0.55); o.data.materials.append(TENT)
for dx in (-2.0, 2.0):
    bpy.ops.mesh.primitive_cube_add(location=(-6 + dx, -26, TOP + 1.5)); o = bpy.context.object; o.scale = (0.18, 0.18, 1.5); o.data.materials.append(WOOD)
bpy.ops.mesh.primitive_cube_add(location=(-6, -26, TOP + 3.1)); o = bpy.context.object; o.scale = (2.6, 0.22, 0.2); o.data.materials.append(WOOD)

# 정자(연못 가)
PV = Vector((9.5, 6.5, TOP))
bpy.ops.mesh.primitive_cube_add(location=PV + Vector((0, 0, 0.1))); b = bpy.context.object; b.scale = (2.4, 2.4, 0.45); b.data.materials.append(STONE)
for dx in (-1.7, 1.7):
    for dy in (-1.7, 1.7):
        bpy.ops.mesh.primitive_cylinder_add(radius=0.16, depth=2.6, location=PV + Vector((dx, dy, 1.85))); bpy.context.object.data.materials.append(RED)
bpy.ops.mesh.primitive_cone_add(vertices=4, radius1=3.9, radius2=0.2, depth=1.7, location=PV + Vector((0, 0, 3.95)), rotation=(0, 0, math.radians(45))); bpy.context.object.data.materials.append(ROOF)
bpy.ops.mesh.primitive_cone_add(vertices=4, radius1=4.2, radius2=3.6, depth=0.25, location=PV + Vector((0, 0, 3.1)), rotation=(0, 0, math.radians(45))); bpy.context.object.data.materials.append(ROOF)

# 수련 잎·꽃
LILY = principled('lily', (0.12, 0.32, 0.08), rough=0.35)
PINK = principled('pink', (0.95, 0.55, 0.65), rough=0.5)
for i in range(80):
    a = R.random() * math.pi * 2; rr = math.sqrt(R.random()) * 0.8
    x, y = POND_C.x - 3 + math.cos(a) * 5.5 * rr, POND_C.y - 1 + math.sin(a) * 3.2 * rr
    bpy.ops.mesh.primitive_cylinder_add(vertices=20, radius=0.35 + R.random() * 0.3, depth=0.02, location=(x, y, TOP - 0.31 + i * 0.0008)); o = bpy.context.object; o.data.materials.append(LILY)
    if i % 7 == 0: bpy.ops.mesh.primitive_uv_sphere_add(radius=0.16, location=(x, y, TOP - 0.31 + i * 0.0008 + 0.09)); bpy.context.object.scale.z = 0.6; bpy.context.object.data.materials.append(PINK)

# 물에 사는 식물(수초) — 관찰 세트 「물에 사는 식물 8종」과 같은 식물을 사는 자리대로 둔다(원장 2026-10-26 「수초도 있어야지」).
# 떠 있는 것: 수련(위)·개구리밥·부레옥잠·네가래 / 물속(수면까지 올라온 덤불): 검정말·붕어마름 / 물가에 서 있는 것: 질경이택사·부들
def pond_edge(a, f):
    return POND_C + Vector((math.cos(a) * (10.5 + 1.6 * math.sin(3 * a + 1)), math.sin(a) * (6.2 + 1.0 * math.cos(2 * a)), 0)) * f
WZ = TOP - 0.31   # 물낯
def scatter_quads(name, mat, cx, cy, rx, ry, n, size, seed, z=WZ + 0.015, rot=True):
    rr = random.Random(seed); verts = []; faces = []
    for k in range(n):
        a = rr.random() * 6.283; d = math.sqrt(rr.random()); x, y = cx + math.cos(a) * rx * d, cy + math.sin(a) * ry * d
        sz = size * rr.uniform(0.7, 1.3); t = rr.random() * 6.283 if rot else 0; c, s_ = math.cos(t) * sz, math.sin(t) * sz; i0 = len(verts); zz = z + rr.random() * 0.004
        verts += [(x - c, y - s_, zz), (x - s_, y + c, zz), (x + c, y + s_, zz), (x + s_, y - c, zz)]; faces.append((i0, i0 + 1, i0 + 2, i0 + 3))
    return mesh_obj(name, verts, faces, mat)
# 개구리밥: 연두 점이 빽빽이 깔린 물낯
DUCK = principled('duckweed', (0.30, 0.58, 0.10), rough=0.45)
# 동그란 한 덩이로 깔면 판을 깐 것처럼 보여서, 크기가 다른 무더기 여럿을 겹쳐 가장자리가 들쭉날쭉하게
for k, (cx, cy, rx, ry, n) in enumerate([(6.0, 0.6, 1.8, 1.1, 900), (7.4, -0.2, 1.3, 0.9, 600), (5.0, -0.4, 1.0, 0.7, 350), (8.2, 1.2, 0.9, 0.6, 300), (9.6, -1.6, 1.1, 0.7, 450), (4.4, 1.3, 0.6, 0.4, 150)]):
    scatter_quads(f'duckweed{k}', DUCK, cx, cy, rx, ry, n, 0.055, 41 + k)
# 네가래: 네 잎 클로버 꼴이 물낯에 뜸
CLOVER = principled('marsilea', (0.22, 0.52, 0.12), rough=0.5)
rr = random.Random(43); verts = []; faces = []
for k in range(45):
    x, y = rr.uniform(-3, 3), rr.uniform(-3.4, -2.0); t = rr.random() * 6.283; r = rr.uniform(0.15, 0.21)
    for q in range(4):
        a = t + q * math.pi / 2; cx, cy = x + math.cos(a) * r, y + math.sin(a) * r; i0 = len(verts); n = 8
        zc = WZ + 0.02 + k * 0.0025   # 잎끼리 같은 높이로 겹치면 Cycles에서 검은 얼룩이 난다
        verts.append((x, y, zc))
        for j in range(n + 1):
            b = a - 0.75 + 1.5 * j / n; verts.append((x + math.cos(b) * r * 2, y + math.sin(b) * r * 2, zc))
        for j in range(n): faces.append((i0, i0 + 1 + j, i0 + 2 + j))
mesh_obj('marsilea', verts, faces, CLOVER)
# 부레옥잠: 둥글고 반들한 잎이 모여 서고 연보라 꽃대
HYA = principled('hyacinth', (0.14, 0.42, 0.10), rough=0.25)
HYAF = principled('hyacinthflower', (0.62, 0.52, 0.86), rough=0.5)
for k, (x, y) in enumerate([(4.6, 4.4), (5.7, 5.1), (3.9, 5.5), (6.5, 4.0), (5.1, 3.5), (6.9, 5.4)]):
    rr = random.Random(50 + k)
    for j in range(7):
        a = j / 7 * 6.283 + rr.random() * 0.5; bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, radius=1, location=(x + math.cos(a) * 0.3, y + math.sin(a) * 0.3, WZ + 0.3))
        o = bpy.context.object; o.scale = (0.3, 0.05, 0.27); o.rotation_euler = (0, 0, a + math.pi / 2); o.data.materials.append(HYA)
    if k % 2 == 0:
        bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.11, depth=0.5, location=(x, y, WZ + 0.78)); o = bpy.context.object; o.data.materials.append(HYAF)
# 검정말·붕어마름: 물속 덤불이 물낯까지 올라와 짙은 초록 깃털 무더기로 보임
HORN = principled('hornwort', (0.05, 0.18, 0.06), rough=0.6)
scatter_quads('hornwort', HORN, -6.6, 3.0, 1.6, 1.2, 900, 0.09, 61, z=WZ + 0.005)
scatter_quads('hydrilla', principled('hydrilla', (0.07, 0.24, 0.07), rough=0.6), -6.0, -1.0, 1.4, 1.0, 700, 0.08, 62, z=WZ + 0.005)
# 질경이택사: 물가 얕은 곳, 긴 잎자루 끝에 달걀꼴 잎이 서고 하얀 잔꽃대
ALI = principled('alisma', (0.20, 0.45, 0.12), rough=0.5); WHITE = principled('aliflower', (0.95, 0.95, 0.92), rough=0.6)
for k, a in enumerate([2.95, 3.25, 3.55]):
    c = pond_edge(a, 0.93); rr = random.Random(70 + k)
    for j in range(6):
        b = j / 6 * 6.283 + rr.random(); h = rr.uniform(0.45, 0.7)
        bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=0.015, depth=h, location=(c.x + math.cos(b) * 0.12, c.y + math.sin(b) * 0.12, WZ + h / 2)); bpy.context.object.data.materials.append(ALI)
        bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=6, radius=1, location=(c.x + math.cos(b) * 0.2, c.y + math.sin(b) * 0.2, WZ + h + 0.08)); o = bpy.context.object; o.scale = (0.07, 0.02, 0.15); o.rotation_euler = (0.3 * math.sin(b), 0.3 * math.cos(b), b); o.data.materials.append(ALI)
    bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=0.05, depth=0.5, location=(c.x, c.y, WZ + 0.95)); bpy.context.object.data.materials.append(WHITE)
# 부들: 연못 북쪽 물가, 긴 잎 무리 + 갈색 소시지 꼴 이삭
rr = random.Random(80); verts = []; faces = []; spikes = []
for k in range(1300):
    a = rr.uniform(1.55, 2.35) if k % 2 else rr.uniform(0.45, 0.95); c = pond_edge(a, rr.uniform(0.86, 1.0))
    h = rr.uniform(0.9, 1.6); w = 0.035; t = rr.random() * 6.283; lean = Vector((rr.uniform(-.12, .12), rr.uniform(-.12, .12), 0)); dx, dy = math.cos(t) * w, math.sin(t) * w; i0 = len(verts)
    verts += [(c.x - dx, c.y - dy, WZ), (c.x + dx, c.y + dy, WZ), tuple(Vector((c.x, c.y, WZ + h)) + lean * h)]; faces.append((i0, i0 + 1, i0 + 2))
    if k % 12 == 0: spikes.append((c.x, c.y, WZ + h * 0.85))
mesh_obj('pondreeds', verts, faces, REED)
for (x, y, z) in spikes:
    bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.06, depth=0.36, location=(x, y, z)); bpy.context.object.data.materials.append(SPIKE)

# 꽃밭 두 곳: 흙 둔덕 + 꽃송이(색 무리)
FLOWER_COLS = [(0.95, 0.80, 0.10), (0.92, 0.35, 0.55), (0.85, 0.12, 0.12), (0.96, 0.96, 0.92), (0.95, 0.55, 0.15)]
fl_mats = [principled(f'fl{i}', c, rough=0.6) for i, c in enumerate(FLOWER_COLS)]
GREEN = principled('bush', (0.10, 0.28, 0.07), rough=0.8)
for (cx, cy, rx, ry, seed) in [(18.5, 5.0, 4.2, 2.6, 1), (20.5, -0.5, 3.2, 2.0, 2)]:
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1, location=(cx, cy, TOP)); m = bpy.context.object; m.scale = (rx, ry, 0.5); m.data.materials.append(GREEN); m['lay'] = 'xy'
    rr = random.Random(seed); verts = []; faces = []; mats = []
    for k in range(5):
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=0.11); src = bpy.context.object
        obj = src; obj.data.materials.append(fl_mats[(k + seed) % 5])
        pts = []
        for j in range(380):
            a = rr.random() * 6.283; d = math.sqrt(rr.random())
            if (math.atan2(math.sin(a), math.cos(a)) + math.pi) / (2 * math.pi) * 5 // 1 != k: continue
            x, y = cx + math.cos(a) * rx * 0.95 * d, cy + math.sin(a) * ry * 0.95 * d; z = TOP + 0.5 * math.sqrt(max(0, 1 - d * d)) + 0.05
            pts.append((x, y, z))
        for (x, y, z) in pts:
            c = obj.copy(); c.location = (x, y, z); link(c)
        bpy.data.objects.remove(src)

# 그늘 풀밭의 큰 나무 자리·숲 바닥 낙엽
LEAFLIT = [principled(f'lit{i}', c, rough=0.9) for i, c in enumerate([(0.45, 0.25, 0.08), (0.62, 0.38, 0.10), (0.35, 0.20, 0.10), (0.70, 0.52, 0.15)])]
verts = []; faces = []; mi = []
for k in range(14000):
    x = R.uniform(-36, 40); y = R.uniform(16, 27) if R.random() < 0.85 else R.uniform(12, 16)
    inside = True
    if not inside: continue
    s = 0.14; a = R.random() * 6.283; c, d = math.cos(a) * s, math.sin(a) * s; z = TOP + 0.01 + R.random() * 0.02; i0 = len(verts)
    verts += [(x - c, y - d, z), (x - d, y + c, z), (x + c, y + d, z), (x + d, y - c, z)]; faces.append((i0, i0 + 1, i0 + 2, i0 + 3)); mi.append(k % 4)
lit = mesh_obj('litter', verts, faces)
for m in LEAFLIT: lit.data.materials.append(m)
for f, m in zip(lit.data.polygons, mi): f.material_index = m

# ── 풀밭(곤충 관찰 자리): 키 큰 풀 무더기 + 들꽃 점 ──
TALL = principled('tallgrass', (0.30, 0.45, 0.10), rough=0.8)
LOOP_PTS = [Vector((p.x, p.y)) for p in catmull([(x, y, 0) for x, y in LOOP], n=12, closed=True)]
def off_path(x, y, gap=1.8): return min((q - Vector((x, y))).length for q in LOOP_PTS) > gap
def grass_patch(cx, cy, rx, ry, n, seed):
    rr = random.Random(seed); verts = []; faces = []
    for k in range(n):
        a = rr.random() * 6.283; d = math.sqrt(rr.random())
        x, y = cx + math.cos(a) * rx * d, cy + math.sin(a) * ry * d
        if not off_path(x, y): continue
        h = rr.uniform(0.35, 0.8) * (1.15 - 0.4 * d); w = 0.05; t = rr.random() * 6.283; lean = Vector((rr.uniform(-.25, .25), rr.uniform(-.25, .25), 0))
        dx, dy = math.cos(t) * w, math.sin(t) * w; i0 = len(verts)
        verts += [(x - dx, y - dy, TOP), (x + dx, y + dy, TOP), tuple(Vector((x, y, TOP + h)) + lean * h)]
        faces.append((i0, i0 + 1, i0 + 2))
    o = mesh_obj(f'grass{seed}', verts, faces, TALL); return o
grass_patch(-22, 4.5, 6.5, 4.5, 9000, 7)
grass_patch(-15.5, 10.5, 3.0, 2.0, 2000, 8)
for (cx, cy, rx, ry, seed) in [(-22, 4.5, 6, 4, 11)]:
    rr = random.Random(seed)
    for k in range(70):
        a = rr.random() * 6.283; d = math.sqrt(rr.random())
        x, y = cx + math.cos(a) * rx * d, cy + math.sin(a) * ry * d
        if not off_path(x, y): continue
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=0.09, location=(x, y, TOP + rr.uniform(0.4, 0.7)))
        bpy.context.object.data.materials.append(fl_mats[k % 5])

# ── 나무(코드로 만든 활엽수·소나무). --trees 파일이 있으면 그 모델로 바꾼다 ──
def tree(name, base, h, kind='broad', tint=(1, 1, 1), seed=1, spread=1.0):
    rr = random.Random(seed); cu = bpy.data.curves.new(name + '_c', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = 1; cu.bevel_resolution = 2; cu.use_fill_caps = True
    leaves = []
    def spline(points, r0, r1):
        sp = cu.splines.new('POLY'); sp.points.add(len(points) - 1)
        for i, p in enumerate(points): sp.points[i].co = (*p, 1); sp.points[i].radius = r0 + (r1 - r0) * i / max(1, len(points) - 1)
    def grow(start, d, length, r, depth):
        pts = [start]; p = start.copy(); dd = d.copy()
        for i in range(5):
            dd = (dd + Vector((rr.uniform(-.25, .25), rr.uniform(-.25, .25), rr.uniform(-.1, .2)))).normalized(); p = p + dd * length / 5; pts.append(p.copy())
        spline(pts, r, r * 0.6)
        if depth == 0:
            for q in pts[2:]: leaves.append(q)
            return
        n = rr.randint(2, 3) if kind == 'broad' else 0
        for k in range(n):
            t = rr.uniform(0.5, 1.0); q = pts[int(t * 5)]
            ax = Vector((rr.uniform(-1, 1), rr.uniform(-1, 1), 0)).normalized()
            nd = (Matrix.Rotation(rr.uniform(0.5, 0.95), 3, ax) @ dd).normalized(); nd.z = max(nd.z, 0.15)
            grow(q, nd.normalized(), length * 0.68, r * 0.58, depth - 1)
        if depth <= 1:
            for q in pts[3:]: leaves.append(q)
    base = Vector(base)
    if kind == 'broad':
        trunk_h = h * 0.38; tp = [base + Vector((rr.uniform(-.15, .15), rr.uniform(-.15, .15), trunk_h * i / 4)) for i in range(5)]
        spline(tp, h * 0.035, h * 0.026)
        for k in range(rr.randint(3, 4)):
            a = k / 4 * 6.283 + rr.random(); d = Vector((math.cos(a) * 0.7 * spread, math.sin(a) * 0.7 * spread, 0.75)).normalized()
            grow(tp[-1], d, h * 0.42, h * 0.022, 3)
    else:
        tp = [base + Vector((0, 0, h * i / 6)) for i in range(7)]; spline(tp, h * 0.03, h * 0.008)
        for lv in range(9):
            z = h * (0.3 + 0.66 * lv / 9); rad = h * 0.26 * (1 - lv / 10)
            for k in range(6):
                a = k / 6 * 6.283 + lv * 0.5 + rr.random() * 0.4; e = base + Vector((math.cos(a) * rad, math.sin(a) * rad, z - rad * 0.15))
                spline([base + Vector((0, 0, z)), e], h * 0.01, h * 0.004)
                for j in range(3): leaves.append(base + Vector((0, 0, z)) + (e - base - Vector((0, 0, z))) * (0.4 + 0.3 * j))
    o = link(bpy.data.objects.new(name, cu)); cu.materials.append(BARK); o['lay'] = 'tree'; o['base'] = [base.x, base.y]
    # 잎 카드: 잎 자리마다 여러 장, 바깥·위를 보게 돌려 놓는다
    verts = []; faces = []; uvs = []; cols = []
    size = (0.32 if kind == 'broad' else 0.6) * (h / 9)
    per = 34 if kind == 'broad' else 14
    cen = base + Vector((0, 0, h * 0.7))
    for q in leaves:
        for j in range(per):
            p = q + Vector((rr.gauss(0, .45), rr.gauss(0, .45), rr.gauss(0, .32))) * (h / 9)
            out = (p - cen); out.z += 0.6; out = out.normalized()
            up = Vector((rr.uniform(-1, 1), rr.uniform(-1, 1), rr.uniform(-1, 1))).normalized(); side = out.cross(up).normalized(); up = side.cross(out).normalized()
            s = size * rr.uniform(0.7, 1.3); i0 = len(verts)
            verts += [p - side * s / 2, p + side * s / 2, p + side * s / 2 + up * s, p - side * s / 2 + up * s]; faces.append((i0, i0 + 1, i0 + 2, i0 + 3))
            g = rr.uniform(0.75, 1.15); col = (tint[0] * g, tint[1] * g, tint[2] * g, 1); cols += [col] * 4; uvs += [(0, 0), (1, 0), (1, 1), (0, 1)]
    me = bpy.data.meshes.new(name + '_l'); me.from_pydata([tuple(v) for v in verts], [], faces); me.update()
    uv = me.uv_layers.new(name='UVMap'); ca = me.color_attributes.new('tint', 'FLOAT_COLOR', 'CORNER')
    for li in range(len(me.loops)): uv.data[li].uv = uvs[me.loops[li].vertex_index] if False else uvs[li]; ca.data[li].color = cols[li]
    lo = link(bpy.data.objects.new(name + '_leaves', me)); me.materials.append(LEAF if kind == 'broad' else NEEDLE); lo['lay'] = 'tree'; lo['base'] = [base.x, base.y]
    return o

TREE_SPOTS = []
# 숲(북쪽 가장자리): 활엽수·소나무·가을빛 나무
for row, (y0, xs) in enumerate([(17.5, np.linspace(-30, 34, 21)), (20, np.linspace(-33, 37, 18)), (22.5, np.linspace(-36, 40, 20)), (25.5, np.linspace(-20, 30, 12))]):
    for i, x in enumerate(xs):
        x = x + R.uniform(-1.0, 1.0) + row * 0.8; y = y0 + R.uniform(-0.8, 0.6)
        if abs(x + 42) < 9 and y < 14: continue
        kind = 'pine' if (i + row) % 4 == 1 else 'broad'
        tint = (1.6, 1.15, 0.5) if (i + row) % 6 == 3 else (1.25, 0.95, 0.45) if (i + row) % 7 == 5 else (1, 1, 1)
        TREE_SPOTS.append(((x, y, TOP), R.uniform(8, 11.5), kind, tint))
for (x, y) in [(-3, 12.2), (9, 11.6), (15, 15.6)]: TREE_SPOTS.append(((x, y, TOP), R.uniform(7, 9), 'broad', (1, 1, 1)))
# 그늘 풀밭의 큰 나무
TREE_SPOTS.append(((-24, 6.5, TOP), 12.5, 'broad', (0.95, 1.0, 0.95)))
# 광장 둘레·연못 둘레
for (x, y) in [(-15, -16), (3, -17), (-20, -9), (-10, 4), (14, 9.5), (27, -6), (29, 5), (-30, -15), (-40, -12), (-24, -22), (-46, -4), (18, -21), (34, -21), (44, 4), (42, 13), (-33, 12), (-44, 14), (8, -24),
               (-36, -20), (-29, -9), (-14, -23), (12, -14), (24, -17), (40, -18), (46, -10), (-46, 8), (-27, 13), (36, 9), (21, 11), (-12, -24)]: TREE_SPOTS.append(((x, y, TOP), R.uniform(6.5, 8.5), 'broad', (1, 1, 1)))

asset_trees = []
if TREES and os.path.exists(TREES):
    with bpy.data.libraries.load(TREES, link=False) as (src, dst): dst.objects = [n for n in src.objects if 'tree' in n.lower()]
    asset_trees = [o for o in dst.objects if o is not None]
for k, (loc, h, kind, tint) in enumerate(TREE_SPOTS):
    if asset_trees and kind == 'broad':
        a = asset_trees[k % len(asset_trees)].copy(); a.location = loc; a.rotation_euler.z = R.random() * 6.283; s = h / max(0.1, a.dimensions.z or h); a.scale = (s, s, s); link(a)
    else:
        tree(f'tree{k}', loc, h, kind, tint, seed=k + 3)

# ── 공원 밖: 그림 끝까지 땅이 이어지게(원장 2026-10-26 「지도가 저렇게 끊기는 거 이상해 — 테두리에 도로를 두거나, 백사장과 해변을 넣어 해수욕장 공원」) ──
# 서·남·북은 길(차도 + 보도)과 그 너머 나무, 동쪽은 백사장과 바다. 공원 둘레는 낮은 생울타리(입구·해변 쪽은 틔움).
# 해안선(모래가 시작하는 곳): 남쪽을 따라 오다가 동쪽으로 꺾여 북쪽으로. 바다는 그 바깥(오른쪽).
COAST = [(-300, -32.5), (-60, -32.5), (10, -32.5), (36, -31), (50, -24), (55.5, -10), (56, 4), (54, 22), (49, 40), (42, 80), (30, 200), (20, 300)]
CP = catmull([(x, y, 0) for x, y in COAST], n=10)
CN = []
for i, p_ in enumerate(CP):
    t = (CP[min(i + 1, len(CP) - 1)] - CP[max(i - 1, 0)]).normalized(); CN.append(Vector((t.y, -t.x, 0)))
def on_land(x, y, margin=3):
    i = min(range(len(CP)), key=lambda k: (CP[k].x - x) ** 2 + (CP[k].y - y) ** 2)
    return (Vector((x, y, 0)) - CP[i]).dot(CN[i]) < -margin
bm = bmesh.new(); vs = [bm.verts.new((-300, 300, TOP - 0.005))] + [bm.verts.new((p_.x, p_.y, TOP - 0.005)) for p_ in CP[::2]]
bm.faces.new(vs); me = bpy.data.meshes.new('ground'); bm.to_mesh(me); bm.free()
ground = link(bpy.data.objects.new('ground', me)); me.materials.append(GRASS)
hole = prism('islandhole', ring, TOP - 3, TOP + 3, GRASS)
md = ground.modifiers.new('hole', 'BOOLEAN'); md.operation = 'DIFFERENCE'; md.object = hole; md.solver = 'EXACT'
bpy.context.view_layer.objects.active = ground; bpy.ops.object.modifier_apply(modifier='hole'); bpy.data.objects.remove(hole)
for f_ in ground.data.polygons:
    if f_.normal.z < 0: f_.flip()
# 백사장: 해안선에서 바다 쪽으로 조금씩 낮아지는 모래(물낯 아래로 들어가며 물가가 저절로 생김)
SAND = noise_mat('sand', (0.60, 0.50, 0.34), (0.74, 0.64, 0.46), scale=3, rough=0.95, bump=0.2, bump_scale=120)
SEA = principled('sea', (0.02, 0.17, 0.22), rough=0.04)
sn = SEA.node_tree; nb = sn.nodes.new('ShaderNodeTexNoise'); nb.inputs['Scale'].default_value = 3; bp = sn.nodes.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = 0.12
sn.links.new(nb.outputs['Fac'], bp.inputs['Height']); sn.links.new(bp.outputs['Normal'], sn.nodes['Principled BSDF'].inputs['Normal'])
SW, COLS = 11.0, 8
def sand_z(t): return TOP + 0.02 - 0.6 * t ** 1.3
verts = []; faces = []
for i, (p_, n_) in enumerate(zip(CP, CN)):
    for j in range(COLS + 1):
        t = j / COLS; q = p_ + n_ * SW * t; verts.append((q.x, q.y, sand_z(t)))
    if i:
        for j in range(COLS):
            a_ = (i - 1) * (COLS + 1) + j; b_ = i * (COLS + 1) + j; faces.append((a_, a_ + 1, b_ + 1, b_))
sand = mesh_obj('sand', verts, faces, SAND)
for f_ in sand.data.polygons:
    if f_.normal.z < 0: f_.flip()
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, TOP - 0.3)); sea = bpy.context.object; sea.scale = (800, 800, 1); sea.data.materials.append(SEA)
# 물가 흰 거품 띠: 모래가 물낯(−0.3)과 만나는 곳
TF = (0.32 / 0.6) ** (1 / 1.3)
FOAM = principled('foam', (0.92, 0.95, 0.95), rough=0.4)
ribbon('foam', [((p_ + n_ * SW * TF).x, (p_ + n_ * SW * TF).y) for p_, n_ in list(zip(CP, CN))[::3] if -150 < p_.x < 150 and p_.y < 150], 0.7, FOAM, z=TOP - 0.29, thick=0.01)
# 해변 산책로(해안선 안쪽): 정문이 여기로 열린다
PROM = [((p_ - n_ * 1.7).x, (p_ - n_ * 1.7).y) for p_, n_ in zip(CP, CN) if -90 < p_.x and p_.y < 70][::2]
ribbon('promenade', PROM, 3.0, PAVE, z=TOP + 0.03)
ribbon('entry2', [(-6, -29.5), (-6, -31.4)], 2.8, PAVE, z=TOP + 0.045)
# 파라솔·돗자리·안전요원 망루
PARA = [principled(f'para{i}', c, rough=0.6) for i, c in enumerate([(0.85, 0.15, 0.12), (0.10, 0.35, 0.75), (0.95, 0.75, 0.10), (0.15, 0.6, 0.35), (0.95, 0.95, 0.92)])]
rr = random.Random(91); spots_b = [k for k, p_ in enumerate(CP) if (-45 < p_.x < 30 and p_.y < -30) or (p_.x > 48 and -18 < p_.y < 32)][::2]
for m_, k in enumerate(spots_b):
    q = CP[k] + CN[k] * rr.uniform(2.5, 4.5); x, y = q.x, q.y
    bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=0.05, depth=2.2, location=(x, y, TOP + 1.1)); bpy.context.object.data.materials.append(POLE)
    bpy.ops.mesh.primitive_cone_add(vertices=12, radius1=1.5, radius2=0.05, depth=0.55, location=(x, y, TOP + 2.25)); bpy.context.object.data.materials.append(PARA[m_ % 5])
    bpy.ops.mesh.primitive_cube_add(location=(x + 1.0, y - 0.6, TOP + 0.04)); o = bpy.context.object; o.scale = (0.9, 0.45, 0.02); o.rotation_euler.z = rr.uniform(-0.4, 0.4); o.data.materials.append(PARA[(m_ + 2) % 5])
kq = min(range(len(CP)), key=lambda k: abs(CP[k].x - 14) + abs(CP[k].y + 32.5)); q = CP[kq] + CN[kq] * 4.5; lx, ly = q.x, q.y
for dx in (-0.8, 0.8):
    for dy in (-0.8, 0.8):
        bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=0.08, depth=3, location=(lx + dx, ly + dy, TOP + 1.5)); bpy.context.object.data.materials.append(WOOD)
bpy.ops.mesh.primitive_cube_add(location=(lx, ly, TOP + 3.1)); o = bpy.context.object; o.scale = (1.1, 1.1, 0.12); o.data.materials.append(WOOD)
bpy.ops.mesh.primitive_cone_add(vertices=4, radius1=1.6, radius2=0.05, depth=0.9, location=(lx, ly, TOP + 4.1), rotation=(0, 0, math.radians(45))); bpy.context.object.data.materials.append(PARA[0])
# 공원에서 동쪽 해변으로 나가는 길(습지 길을 이어서)
ribbon('beachpath', [(33, -3.5), (42, -1.5), (53.5, -1)], 2.0, PAVE, z=TOP + 0.025)

# 길: 북·남(가로), 서(세로). 겹치는 네거리에서 같은 높이면 검게 나오니 높이를 조금씩 다르게.
ASPH = noise_mat('asphalt', (0.06, 0.06, 0.07), (0.11, 0.11, 0.12), scale=20, rough=0.9, bump=0.1, bump_scale=200)
LINE = principled('roadline', (0.92, 0.85, 0.40), rough=0.6); WLINE = principled('crosswalk', (0.92, 0.92, 0.90), rough=0.6)
ROADS = [('north', [(-300, 35), (46, 35)], TOP + 0.02), ('west', [(-62, -29), (-62, 300)], TOP + 0.024)]
for name, pts, z in ROADS:
    (x0, y0), (x1, y1) = pts; d = Vector((x1 - x0, y1 - y0)); n = Vector((-d.y, d.x)).normalized()
    for k, (wd, mat, dz) in enumerate([(11, PAVE, -0.01), (7, ASPH, 0.0)]):
        bpy.ops.mesh.primitive_cube_add(location=((x0 + x1) / 2, (y0 + y1) / 2, z + dz)); o = bpy.context.object; o.scale = (d.length / 2, wd / 2, 0.02); o.rotation_euler.z = math.atan2(d.y, d.x); o.data.materials.append(mat); o['lay'] = 'len'
    u = d.normalized(); dv = []; df = []
    for t in np.arange(0.0, 1.0, 6 / d.length):
        c = Vector((x0, y0)) + d * t; i0 = len(dv)
        dv += [tuple(c - u * 1.4 - n * 0.1) + (z + 0.035,), tuple(c - u * 1.4 + n * 0.1) + (z + 0.035,), tuple(c + u * 1.4 + n * 0.1) + (z + 0.035,), tuple(c + u * 1.4 - n * 0.1) + (z + 0.035,)]
        df.append((i0, i0 + 1, i0 + 2, i0 + 3))
    lo = mesh_obj(f'{name}_line', dv, df, LINE)
    for f_ in lo.data.polygons:
        if f_.normal.z < 0: f_.flip()
# 공원 둘레 생울타리(입구와 해변 쪽은 틔움)
HEDGE = noise_mat('hedge', (0.07, 0.20, 0.05), (0.13, 0.30, 0.08), scale=4, rough=0.9, bump=0.6, bump_scale=40)
segs = [[]]
for sp in ring:
    gap = (abs(sp.x + 6) < 3.2 and sp.y < -20) or sp.x > 38
    if gap: segs.append([])
    else: segs[-1].append((sp.x, sp.y))
for k, sg in enumerate(segs):
    if len(sg) < 3: continue
    o, _ = ribbon(f'hedge{k}', sg[::3] + [sg[-1]], 0.9, HEDGE, z=TOP + 0.65, thick=0.65)
# 공원 밖 나무(멀리 보이는 것이라 가볍게: 줄기 + 잎 덩어리)
OUTLEAF = [noise_mat(f'outleaf{i}', c1, c2, scale=3, rough=0.85, bump=0.8, bump_scale=30) for i, (c1, c2) in enumerate([((0.06, 0.18, 0.04), (0.14, 0.30, 0.07)), ((0.09, 0.22, 0.05), (0.18, 0.34, 0.08)), ((0.30, 0.18, 0.04), (0.50, 0.30, 0.07))])]
# 모양 6가지를 한 번만 만들고, 나무마다 그 메시를 같이 쓰는 복사본을 놓는다(bpy.ops를 수백 번 부르면 장면이 커질수록 느려진다)
BLOBS = []
for q in range(6):
    rq = random.Random(500 + q); parts = []
    bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=0.035, depth=0.45, location=(0, 0, 0.22)); t = bpy.context.object; t.data.materials.append(BARK); parts.append(t)
    m = OUTLEAF[2 if q == 5 else q % 2]
    for k in range(3):
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=rq.uniform(0.2, 0.28), location=(rq.uniform(-.15, .15), rq.uniform(-.15, .15), rq.uniform(0.55, 0.75)))
        o = bpy.context.object; o.data.materials.append(m)
        for v in o.data.vertices: v.co *= 0.85 + 0.3 * mnoise.noise(v.co * 10 + Vector((q, k, 0)))
        for p_ in o.data.polygons: p_.use_smooth = True
        parts.append(o)
    bpy.ops.object.select_all(action='DESELECT')
    for o in parts: o.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]; bpy.ops.object.join(); b = bpy.context.object; b.name = f'blob{q}'
    sc.collection.objects.unlink(b); BLOBS.append(b)
def blob_tree(x, y, h, rr):
    src = BLOBS[5 if rr.random() < 0.12 else rr.randrange(5)]
    o = src.copy(); o.location = (x, y, TOP); o.scale = (h, h, h); o.rotation_euler.z = rr.random() * 6.283; link(o)
rr = random.Random(101)
for k in range(520):
    x, y = rr.uniform(-180, 60), rr.uniform(-110, 190)
    if not on_land(x, y, 5): continue
    if abs(y - 35) < 7.5 or (abs(x + 62) < 7.5 and y > -34): continue
    if -60 < x and -33 < y < 33: continue
    blob_tree(x, y, rr.uniform(6, 10), rr)
# 길가 가로수(공원 쪽 보도)
for x in np.arange(-56, 42, 9.0): blob_tree(x, 30.8, 7, random.Random(int(x * 7)))

# ── 자리 벌리기(K배) ──
# 원점에 놓인 땅·물·길·풀 같은 메시(꼭짓점이 세계 좌표) → 꼭짓점 xy를 K배. 나무(곡선·잎 카드) → 밑동 자리만큼 통째로 옮김.
# 제자리에 놓인 물건(정자·천막·바위·파라솔·나무 복사본 …) → 자리만 K배, 크기는 그대로. 'xy' 표시(광장·꽃밭 둔덕·언덕)는 넓이도 K배, 'len'(차도·데크)은 길이만 K배.
def spread_layout():
    done = set()
    for o in list(sc.collection.objects):
        lay = o.get('lay')
        if lay == 'tree':
            b = o['base']; o.location.x += b[0] * (K - 1); o.location.y += b[1] * (K - 1); continue
        if o.type == 'MESH' and o.location.length < 1e-6 and not lay:
            if o.data.name in done: continue
            done.add(o.data.name)
            for v in o.data.vertices: v.co.x *= K; v.co.y *= K
            continue
        o.location.x *= K; o.location.y *= K
        if lay == 'xy': o.scale.x *= K; o.scale.y *= K
        if lay == 'len': o.scale.x *= K
spread_layout()

# ── 빛·카메라·렌더 ──
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs['Color'].default_value = (0.78, 0.84, 0.92, 1); w.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.9
bpy.ops.object.light_add(type='SUN', rotation=(math.radians(48), math.radians(-12), math.radians(-35))); bpy.context.object.data.energy = 4.2; bpy.context.object.data.angle = math.radians(4)
sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = 16 if PREVIEW else 96; sc.cycles.use_denoising = True
sc.render.film_transparent = True; sc.view_settings.look = 'AgX - Medium High Contrast' if 'AgX - Medium High Contrast' in [l.name for l in []] else 'None'

def camera(name, loc, target, lens):
    bpy.ops.object.camera_add(location=loc); c = bpy.context.object; c.name = name; c.data.lens = lens
    d = Vector(target) - Vector(loc); c.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler(); bpy.context.view_layer.update(); return c

# 지점(그림 위에 표를 붙일 자리)과 두 아이가 걷는 길(입구 → 광장 → 지점). 길의 마지막 점 = 아이들이 서는 자리 — 아이 그림은 위로 서 있어 지점 가까이 세우면 표 글씨를 가린다. 두 그림 모두에서 지점보다 아래에 오도록 지점에서 남쪽(-y, 넓은 그림의 아래)·동쪽(+x, 세로 그림의 아래)으로 비켜 둔다.
SPOTS = {'gate': (-10.2, -15.2), 'pond': (-1.5, 0.5), 'meadow': (-22, 5), 'flowers': (19, 4), 'leaves': (-4, 18.5), 'litter': (8, 17), 'beach': (38.9, -32)}
HUB = (-6, -11)
# 공원 안의 다른 사람들(원장 2026-10-27 「NPC 같은 친구들 … 수의 나라나 지도에 있는 캐릭터 더 가지고 와」): 점 하나면 그 자리에 서 있고, 둘 이상이면 그 길을 오간다.
# 누가 누구인지(모양)는 science-lab/park-chars3d.js의 CAST. 지점 표를 가리지 않게 지점과 떨어진 곳에 둔다.
NPCS = {
    'doc': [(-3.2, -14.8)],                      # 독쌤(수의 나라) — 대회 안내판 앞
    'elder': [(-10.5, -5.8)],                    # 할아버지(수의 나라) — 연못 서쪽 물가
    'luca': [(-35.5, -3.8)],                     # 루카(월드 익스플로러) — 바위 언덕 앞
    'robin': [(36.2, -8.0)],                     # 로빈(월드 익스플로러) — 습지 데크 위
    'walkers': [(-40, -30.8), (28, -30.8)],      # 유빈·유준 — 해변 산책로를 오감
    'sora': [(2, -37.5)],                        # 소라 — 백사장
    'buddies': [(-24, -37.0), (-14, -38.0)],     # 수의 친구 누미(0)·포코(3) — 백사장에서 놂
    'momo': [(59.5, 8), (60.5, -6)],             # 모모(8) — 동쪽 백사장을 오감
    'ranger': [(13.4, -8.7)],                    # 공원 관리인 — 개울 다리 옆 길(원장 「지키는 관리인은 다리 조심해야 돼」)
    'lifeguard': [(lx + 2.4, ly + 0.6)],         # 해변 안전요원 — 망루 옆(「해안가는 파도 조심해」)
}
ENTRANCE = [(-6, -27.5), (-6, -19)]
WALK = {
    'gate': [],
    'pond': [(-2, -9.5), (-1.5, -5.6)],
    'meadow': [(-12, -6), (-18, -1)],
    'leaves': [(-12, -6), (-18, -1), (-16, 8), (-10, 13), (-4, 14.5)],
    'litter': [(-12, -6), (-18, -1), (-16, 8), (-10, 13), (-4, 14.5), (4, 15), (12, 14)],
    'flowers': [(2, -10.5), (10, -9.5), (16, -7), (21, -3.5), (24.5, 0)],
    # 해변(원장 2026-10-27 「해변에도 관찰 지점 만들어」): 정문으로 나가 모래로 내려가 망루(안전요원) 앞을 지나 동쪽 모퉁이 모래밭으로
    'beach': [(-6, -19), (-6, -27.5), (-6, -31.4), (0, -34), (14, -34.5), (28, -34), (37.8, -34.6)],
}

def proj(cam, pts, res, z=None):
    sc.render.resolution_x, sc.render.resolution_y = res
    out = []
    for (x, y) in pts:
        v = world_to_camera_view(sc, cam, Vector((x * K, y * K, TOP + 0.3 if z is None else z))); out.append([round(v.x * 100, 1), round((1 - v.y) * 100, 1)])
    return out

# 파도(원장 2026-10-27 「해변도 파도가 움직이는 모습 연출할 수 있어?」): 물가 선(edge = 거품 띠 자리)과 바다 쪽으로 8만큼 나간 선(out). 같은 점 수라 그 사이를 이어 밀려오는 파도 줄을 그린다(park.js).
SHORE = [(p_, n_) for p_, n_ in list(zip(CP, CN))[::2] if -150 < p_.x < 150 and p_.y < 150]
SHORE_EDGE = [((p_ + n_ * SW * TF).x, (p_ + n_ * SW * TF).y) for p_, n_ in SHORE]
SHORE_OUT = [((p_ + n_ * (SW * TF + 8)).x, (p_ + n_ * (SW * TF + 8)).y) for p_, n_ in SHORE]
result = {}
# 가로 한 장만 — 폰도 「가로로 크게」로 본다(원장 2026-10-27 「가로 모드로 쓸 거라 상관없잖아」, 세로 그림·세로 카메라는 뺐다)
for kind, res, loc, lens, tgt in [('wide', (2560, 1440), (5, -104, 78), 38, (0, -2, -3))]:
    cam = camera('cam_' + kind, tuple(c * K for c in loc), tuple(c * K for c in tgt), lens); sc.camera = cam
    sc.render.resolution_x, sc.render.resolution_y = res[0] // DIV, res[1] // DIV
    r = {'spots': {k: proj(cam, [v], res)[0] for k, v in SPOTS.items()}, 'hub': proj(cam, [HUB], res)[0], 'entrance': proj(cam, ENTRANCE, res), 'walk': {k: proj(cam, v, res) for k, v in WALK.items()}, 'npcs': {k: proj(cam, v, res) for k, v in NPCS.items()}, 'shore': {'edge': proj(cam, SHORE_EDGE, res, TOP - 0.3), 'out': proj(cam, SHORE_OUT, res, TOP - 0.3)}, 'w': res[0], 'h': res[1]}
    result[kind] = r
    sc.render.resolution_x, sc.render.resolution_y = res[0] // DIV, res[1] // DIV
    if not COORDS_ONLY: sc.render.filepath = os.path.join(OUT, f'park-{kind}.png'); bpy.ops.render.render(write_still=True)
json.dump(result, open(os.path.join(OUT, 'park-coords.json'), 'w'), ensure_ascii=False, indent=1)
print('done', OUT)
