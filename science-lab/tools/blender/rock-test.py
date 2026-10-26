# Blender(bpy 5.2, 머리 없이) 시험: 화강암 돌 하나를 절차 재질(보로노이 광물 알갱이)로 만들어 Cycles(CPU)로 렌더한다.
# 설치: python3.13 -m venv /tmp/bpyenv && /tmp/bpyenv/bin/pip install bpy==5.2.3   실행: /tmp/bpyenv/bin/python -I rock-test.py -- out.png  (약 50초)
import bpy, math, sys
out = sys.argv[sys.argv.index('--')+1]
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
# 돌: 아이코스피어 + 구름 무늬 변위 + 매끄럽게
bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=6, radius=1)
rock = bpy.context.object; rock.scale = (1.25, 0.8, 1.0)
tex = bpy.data.textures.new('n', 'CLOUDS'); tex.noise_scale = 0.7; tex.noise_depth = 5
d = rock.modifiers.new('d', 'DISPLACE'); d.texture = tex; d.strength = 0.4
t2 = bpy.data.textures.new('v', 'VORONOI'); t2.noise_scale = 0.35; t2.distance_metric = 'DISTANCE'
d2 = rock.modifiers.new('d2', 'DISPLACE'); d2.texture = t2; d2.strength = -0.12
rock.modifiers.new('s', 'SUBSURF').levels = 1
bpy.ops.object.shade_smooth()
# 화강암 재질: 보로노이 칸마다 광물(장석 흰·분홍 / 석영 반투명 회색 / 흑운모 검정)
m = bpy.data.materials.new('granite'); m.use_nodes = True; nt = m.node_tree; N = nt.nodes; L = nt.links
bs = N['Principled BSDF']
vor = N.new('ShaderNodeTexVoronoi'); vor.inputs['Scale'].default_value = 55; vor.inputs['Randomness'].default_value = 1.0
ramp = N.new('ShaderNodeValToRGB'); cr = ramp.color_ramp; cr.interpolation = 'CONSTANT'
cr.elements[0].position = 0.0; cr.elements[0].color = (0.80, 0.77, 0.72, 1)
e = cr.elements.new(0.40); e.color = (0.78, 0.66, 0.60, 1)
e = cr.elements.new(0.64); e.color = (0.46, 0.47, 0.47, 1)
e = cr.elements.new(0.90); e.color = (0.03, 0.03, 0.028, 1)
L.new(vor.outputs['Color'], ramp.inputs['Fac']) if 'Color' in vor.outputs else None
sep = N.new('ShaderNodeSeparateColor'); L.new(vor.outputs['Color'], sep.inputs['Color']); L.new(sep.outputs[0], ramp.inputs['Fac'])
noi = N.new('ShaderNodeTexNoise'); noi.inputs['Scale'].default_value = 3; noi.inputs['Detail'].default_value = 8
dirt = N.new('ShaderNodeMix'); dirt.data_type = 'RGBA'; dirt.blend_type = 'MULTIPLY'; dirt.inputs['Factor'].default_value = 0.35
L.new(ramp.outputs['Color'], dirt.inputs[6]); L.new(noi.outputs['Color'], dirt.inputs[7])
L.new(dirt.outputs[2], bs.inputs['Base Color'])
rough = N.new('ShaderNodeMapRange'); L.new(sep.outputs[0], rough.inputs['Value']); rough.inputs['To Min'].default_value = 0.35; rough.inputs['To Max'].default_value = 0.8
L.new(rough.outputs['Result'], bs.inputs['Roughness'])
bump = N.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.4; L.new(vor.outputs['Distance'], bump.inputs['Height']); L.new(bump.outputs['Normal'], bs.inputs['Normal'])
rock.data.materials.append(m)
# 바닥·빛·카메라
bpy.ops.mesh.primitive_plane_add(size=30, location=(0, 0, -0.85))
pm = bpy.data.materials.new('floor'); pm.use_nodes = True; pm.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (0.92, 0.92, 0.9, 1); bpy.context.object.data.materials.append(pm)
bpy.ops.object.light_add(type='AREA', location=(3, -3, 5)); bpy.context.object.data.energy = 900; bpy.context.object.data.size = 4
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.6
bpy.ops.object.camera_add(location=(3.2, -3.6, 2.4)); cam = bpy.context.object; sc.camera = cam
c = cam.constraints.new('TRACK_TO'); c.target = rock; c.track_axis = 'TRACK_NEGATIVE_Z'; c.up_axis = 'UP_Y'
sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = 48; sc.cycles.use_denoising = True
sc.render.resolution_x, sc.render.resolution_y = 800, 600; sc.render.filepath = out
bpy.ops.render.render(write_still=True)
print('rendered', out)
