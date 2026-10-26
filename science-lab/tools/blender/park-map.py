# 자연관찰 공원 지도(디오라마) — Blender로 섬 모양 공원을 만들고 렌더한다. 원장 2026-10-26: 「솔은 이 정도 된다는데?(Blender 디오라마) — 난 맵을 말하는 거야 먼저」.
# 렌더 두 장(넓은 화면 2560×1440 · 세로 화면 1440×2560) + 지점·길 좌표(그림 위 %)를 JSON으로 낸다 → data/park-map.js에 옮긴다(tools/blender/park-apply.py).
# 실행(머리 없이):  blender -b -P park-map.py -- --out <폴더> [--preview] [--trees <나무 모델 .blend>]
#   이 컨테이너: python3.13 -m venv /tmp/bpyenv && /tmp/bpyenv/bin/pip install bpy==5.2.3 → /tmp/bpyenv/bin/python -I park-map.py -- --out <폴더>
#   원장 맥: Blender 앱의 blender 실행 파일로 같은 명령. --trees에 나무 모델 파일을 주면 그 안의 물체(이름에 tree가 든 것)를 나무 자리에 놓는다(없으면 코드로 만든 나무).
# 단위 m, Z가 위. 섬 크기 약 64×40 m. 실제 장소를 그대로 옮긴 것이 아니다(장소 이름은 화면에 쓰지 않는다).
import bpy, bmesh, math, random, json, os, sys
from mathutils import Vector, Matrix, noise as mnoise
from bpy_extras.object_utils import world_to_camera_view
import numpy as np

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = argv[argv.index('--out') + 1] if '--out' in argv else '/tmp/park'
PREVIEW = '--preview' in argv
ONLY = argv[argv.index('--only') + 1] if '--only' in argv else None   # wide | tall 한 장만
COORDS_ONLY = '--coords-only' in argv  # 렌더 없이 지점 좌표(park-coords.json)만
DIV = int(argv[argv.index('--div') + 1]) if '--div' in argv else (4 if PREVIEW else 1)   # 해상도 나누기(시험용)
TREES = argv[argv.index('--trees') + 1] if '--trees' in argv else None
os.makedirs(OUT, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
R = random.Random(7)
TOP = 0.0          # 잔디 윗면 높이
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
bpy.ops.mesh.primitive_cylinder_add(vertices=64, radius=6, depth=0.2, location=(-6, -12, TOP + 0.07)); plaza = bpy.context.object; plaza.data.materials.append(PLAZA)

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
bpy.ops.mesh.primitive_uv_sphere_add(segments=48, ring_count=24, radius=1, location=(-42, 4, TOP - 0.2)); hill = bpy.context.object; hill.scale = (8.5, 6.5, 2.0); hill.data.materials.append(GRAVEL)
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
for k in range(2600):
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
    bpy.ops.mesh.primitive_cube_add(location=(m.x, m.y, TOP + 0.12 + k * 0.012)); o = bpy.context.object; o.scale = (d.length / 2 + 0.3, 0.8, 0.07); o.rotation_euler.z = math.atan2(d.y, d.x); o.data.materials.append(WOOD)

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
for i in range(46):
    a = R.random() * math.pi * 2; rr = math.sqrt(R.random()) * 0.8
    x, y = POND_C.x - 3 + math.cos(a) * 5.5 * rr, POND_C.y - 1 + math.sin(a) * 3.2 * rr
    bpy.ops.mesh.primitive_cylinder_add(vertices=20, radius=0.35 + R.random() * 0.3, depth=0.02, location=(x, y, TOP - 0.31 + i * 0.0015)); o = bpy.context.object; o.data.materials.append(LILY)
    if i % 7 == 0: bpy.ops.mesh.primitive_uv_sphere_add(radius=0.16, location=(x, y, TOP - 0.31 + i * 0.0015 + 0.09)); bpy.context.object.scale.z = 0.6; bpy.context.object.data.materials.append(PINK)

# 꽃밭 두 곳: 흙 둔덕 + 꽃송이(색 무리)
FLOWER_COLS = [(0.95, 0.80, 0.10), (0.92, 0.35, 0.55), (0.85, 0.12, 0.12), (0.96, 0.96, 0.92), (0.95, 0.55, 0.15)]
fl_mats = [principled(f'fl{i}', c, rough=0.6) for i, c in enumerate(FLOWER_COLS)]
GREEN = principled('bush', (0.10, 0.28, 0.07), rough=0.8)
for (cx, cy, rx, ry, seed) in [(18.5, 5.0, 4.2, 2.6, 1), (20.5, -0.5, 3.2, 2.0, 2)]:
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1, location=(cx, cy, TOP)); m = bpy.context.object; m.scale = (rx, ry, 0.5); m.data.materials.append(GREEN)
    rr = random.Random(seed); verts = []; faces = []; mats = []
    for k in range(5):
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=0.11); src = bpy.context.object
        obj = src; obj.data.materials.append(fl_mats[(k + seed) % 5])
        pts = []
        for j in range(160):
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
for k in range(7000):
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
grass_patch(-22, 4.5, 6.5, 4.5, 4200, 7)
grass_patch(-15.5, 10.5, 3.0, 2.0, 900, 8)
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
    o = link(bpy.data.objects.new(name, cu)); cu.materials.append(BARK)
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
    lo = link(bpy.data.objects.new(name + '_leaves', me)); me.materials.append(LEAF if kind == 'broad' else NEEDLE)
    return o

TREE_SPOTS = []
# 숲(북쪽 가장자리): 활엽수·소나무·가을빛 나무
for row, (y0, xs) in enumerate([(17.5, np.linspace(-30, 34, 15)), (22.5, np.linspace(-36, 40, 13)), (26, np.linspace(-14, 24, 6))]):
    for i, x in enumerate(xs):
        x = x + R.uniform(-1.2, 1.2) + row * 1.5; y = y0 + R.uniform(-1.2, 0.8)
        if abs(x + 42) < 9 and y < 14: continue
        kind = 'pine' if (i + row) % 4 == 1 else 'broad'
        tint = (1.6, 1.15, 0.5) if (i + row) % 6 == 3 else (1.25, 0.95, 0.45) if (i + row) % 7 == 5 else (1, 1, 1)
        TREE_SPOTS.append(((x, y, TOP), R.uniform(8, 11.5), kind, tint))
for (x, y) in [(-3, 12.2), (9, 11.6), (15, 15.6)]: TREE_SPOTS.append(((x, y, TOP), R.uniform(7, 9), 'broad', (1, 1, 1)))
# 그늘 풀밭의 큰 나무
TREE_SPOTS.append(((-24, 6.5, TOP), 12.5, 'broad', (0.95, 1.0, 0.95)))
# 광장 둘레·연못 둘레
for (x, y) in [(-15, -16), (3, -17), (-20, -9), (-10, 4), (14, 9.5), (27, -6), (29, 5), (-30, -15), (-40, -12), (-24, -22), (-46, -4), (18, -21), (34, -21), (44, 4), (42, 13), (-33, 12), (-44, 14), (8, -24)]: TREE_SPOTS.append(((x, y, TOP), R.uniform(6.5, 8.5), 'broad', (1, 1, 1)))

asset_trees = []
if TREES and os.path.exists(TREES):
    with bpy.data.libraries.load(TREES, link=False) as (src, dst): dst.objects = [n for n in src.objects if 'tree' in n.lower()]
    asset_trees = [o for o in dst.objects if o is not None]
for k, (loc, h, kind, tint) in enumerate(TREE_SPOTS):
    if asset_trees and kind == 'broad':
        a = asset_trees[k % len(asset_trees)].copy(); a.location = loc; a.rotation_euler.z = R.random() * 6.283; s = h / max(0.1, a.dimensions.z or h); a.scale = (s, s, s); link(a)
    else:
        tree(f'tree{k}', loc, h, kind, tint, seed=k + 3)

# ── 빛·카메라·렌더 ──
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs['Color'].default_value = (0.78, 0.84, 0.92, 1); w.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.9
bpy.ops.object.light_add(type='SUN', rotation=(math.radians(48), math.radians(-12), math.radians(-35))); bpy.context.object.data.energy = 4.2; bpy.context.object.data.angle = math.radians(4)
sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = 16 if PREVIEW else 96; sc.cycles.use_denoising = True
sc.render.film_transparent = True; sc.view_settings.look = 'AgX - Medium High Contrast' if 'AgX - Medium High Contrast' in [l.name for l in []] else 'None'

def camera(name, loc, target, lens):
    bpy.ops.object.camera_add(location=loc); c = bpy.context.object; c.name = name; c.data.lens = lens
    d = Vector(target) - Vector(loc); c.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler(); bpy.context.view_layer.update(); return c

# 지점(그림 위에 표를 붙일 자리)과 두 아이가 걷는 길(입구 → 광장 → 지점). 길의 마지막 점 = 아이들이 서는 자리 — 아이 그림은 위로 서 있어 지점 가까이 세우면 표 글씨를 가린다. 두 그림 모두에서 지점보다 아래에 오도록 지점에서 남쪽(-y, 넓은 그림의 아래)·동쪽(+x, 세로 그림의 아래)으로 비켜 둔다.
SPOTS = {'gate': (-10.2, -15.2), 'pond': (-1.5, 0.5), 'meadow': (-22, 5), 'flowers': (19, 4), 'leaves': (-4, 18.5), 'litter': (8, 17)}
HUB = (-6, -11)
ENTRANCE = [(-6, -27.5), (-6, -19)]
WALK = {
    'gate': [],
    'pond': [(-2, -9.5), (-1.5, -5.6)],
    'meadow': [(-12, -6), (-18, -1)],
    'leaves': [(-12, -6), (-18, -1), (-16, 8), (-10, 13), (-4, 14.5)],
    'litter': [(-12, -6), (-18, -1), (-16, 8), (-10, 13), (-4, 14.5), (4, 15), (12, 14)],
    'flowers': [(2, -10.5), (10, -9.5), (16, -7), (21, -3.5), (24.5, 0)],
}

def proj(cam, pts, res):
    sc.render.resolution_x, sc.render.resolution_y = res
    out = []
    for (x, y) in pts:
        v = world_to_camera_view(sc, cam, Vector((x, y, TOP + 0.3))); out.append([round(v.x * 100, 1), round((1 - v.y) * 100, 1)])
    return out

result = {}
for kind, res, loc, lens, tgt in [('wide', (2560, 1440), (5, -100, 78), 38, (0, 1.5, -3)), ('tall', (1440, 2560), (52, -2, 138), 36, (0, 3.5, -2))]:
    if ONLY and kind != ONLY: continue
    cam = camera('cam_' + kind, loc, tgt, lens); sc.camera = cam
    sc.render.resolution_x, sc.render.resolution_y = res[0] // DIV, res[1] // DIV
    r = {'spots': {k: proj(cam, [v], res)[0] for k, v in SPOTS.items()}, 'hub': proj(cam, [HUB], res)[0], 'entrance': proj(cam, ENTRANCE, res), 'walk': {k: proj(cam, v, res) for k, v in WALK.items()}, 'w': res[0], 'h': res[1]}
    result[kind] = r
    sc.render.resolution_x, sc.render.resolution_y = res[0] // DIV, res[1] // DIV
    if not COORDS_ONLY: sc.render.filepath = os.path.join(OUT, f'park-{kind}.png'); bpy.ops.render.render(write_still=True)
json.dump(result, open(os.path.join(OUT, f'park-coords{"-" + ONLY if ONLY else ""}.json'), 'w'), ensure_ascii=False, indent=1)
print('done', OUT)
