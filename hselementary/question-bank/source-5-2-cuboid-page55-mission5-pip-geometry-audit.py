#!/usr/bin/env python3
"""Check rendered pip circles against each projected cube face's edges."""
import json
import math
import os
import re
import shutil
import subprocess
from pathlib import Path

root = Path(__file__).resolve().parent
node = os.environ.get("NODE", shutil.which("node") or "/Users/docssam/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node")
items = json.loads(subprocess.check_output([node, "-e", """
const s=require('./source-5-2-cuboid-page55-mission5.js');
const specs=[{x:18,bottom:195,size:68,dx:22,dy:16,faces:s.startFaces},{x:525,bottom:192,size:66,dx:22,dy:16,faces:s.finalFaces},{x:8,bottom:107,size:50,dx:16,dy:13,faces:s.startFaces},{x:120,bottom:249,size:70,dx:23,dy:17,faces:s.finalFaces},{x:15,bottom:112,size:76,dx:25,dy:18,faces:s.finalFaces}];
console.log(JSON.stringify(specs.map(o=>({...o,marks:Object.fromEntries(['top','front','right'].map(f=>[f,s.facePips(o.faces[f],f,o)]))}))));
"""], cwd=root, text=True))
def distance(point, a, b):
    return ((b[0]-a[0])*(point[1]-a[1])-(b[1]-a[1])*(point[0]-a[0]))/math.dist(a,b)
minimum = float("inf")
for o in items:
    x,b,s,dx,dy = (o[k] for k in ("x","bottom","size","dx","dy"))
    polygons = {
        "top": [(x,b-s),(x+dx,b-s-dy),(x+s+dx,b-s-dy),(x+s,b-s)],
        "front": [(x,b-s),(x+s,b-s),(x+s,b),(x,b)],
        "right": [(x+s,b-s),(x+s+dx,b-s-dy),(x+s+dx,b-dy),(x+s,b)],
    }
    for name, polygon in polygons.items():
        circles = re.findall(r'<circle[^>]*cx="([^"]+)" cy="([^"]+)" r="([^"]+)"',o["marks"][name])
        assert len(circles) == o["faces"][name], (name,len(circles),o["faces"][name])
        for cx,cy,r in circles:
            point = (float(cx),float(cy))
            signed = [distance(point,polygon[i],polygon[(i+1)%4]) for i in range(4)]
            assert all(v > 0 for v in signed) or all(v < 0 for v in signed), (name,point,signed)
            clearance = min(map(abs,signed))-float(r)
            minimum = min(minimum,clearance)
            assert clearance >= -1e-6, (name,point,clearance)
print("PASS: all start/final/answer pip circles remain inside projected faces; minimum clearance",round(minimum,3))
initial = items[0]["faces"]
axes = {"right":(1,0,0),"left":(-1,0,0),"back":(0,1,0),"front":(0,-1,0),"top":(0,0,1),"bottom":(0,0,-1)}
state = {axes[name]:value for name,value in initial.items()}
for i in range(90):
    def roll(p):
        x,y,z = p
        return (z,y,-x) if i < 2 else (x,z,-y)
    state = {roll(axis):value for axis,value in state.items()}
result = {name:state[axis] for name,axis in axes.items()}
assert result == items[1]["faces"], (result,items[1]["faces"])
assert (result["top"],result["front"],result["right"]) == (5,6,4)
print("PASS: 90 normal-vector rotations agree with rendered final faces",result)
print("LIMIT: checks pip positions and counts, not exact rotated dot orientation or source path interpretation.")
