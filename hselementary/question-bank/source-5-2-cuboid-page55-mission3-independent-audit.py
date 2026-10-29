#!/usr/bin/env python3
"""Re-fold the actual generator's net and try every missing front face."""
import json
import os
import shutil
import subprocess
from collections import deque
from pathlib import Path

root = Path(__file__).resolve().parent
node = os.environ.get("NODE", shutil.which("node") or "/Users/docssam/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node")
data = json.loads(subprocess.check_output([node, "-e", """
const s=require('./source-5-2-cuboid-page55-mission3.js');
console.log(JSON.stringify({faces:s.faces,front:s.frontFaces,answer:s.makeQuestion().answer}));
"""], cwd=root, text=True))
positions = {(f["x"],f["y"]):f["value"] for f in data["faces"]}
assert positions == {(0,0):1,(1,0):2,(2,0):3,(2,1):4,(3,1):5,(4,1):6}
neg = lambda v: tuple(-x for x in v)
frames = {(1,0): ((0,0,1),(1,0,0),(0,1,0))}
queue = deque(frames)
while queue:
    x,y = queue.popleft()
    n,u,v = frames[x,y]
    for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)):
        p = x+dx,y+dy
        if p not in positions:
            continue
        f = ((u,neg(n),v) if dx==1 else (neg(u),n,v) if dx==-1 else
             (v,u,neg(n)) if dy==1 else (neg(v),u,n))
        if p in frames:
            assert frames[p] == f
        else:
            frames[p] = f
            queue.append(p)
assert len(frames) == len({f[0] for f in frames.values()}) == 6
by_normal = {f[0]:positions[p] for p,f in frames.items()}
opposite = {positions[p]:by_normal[neg(f[0])] for p,f in frames.items()}
assert data["front"] == [2,None,3,4,6,3]
totals = {candidate:sum(opposite[candidate if face is None else face]
                        for face in data["front"]) for candidate in range(1,7)}
assert totals == {1:20,2:22,3:18,4:23,5:19,6:21}, totals
assert [candidate for candidate,total in totals.items() if total==22] == [int(data["answer"])] == [2]
print("PASS: actual net fold opposite map",opposite,"; all six candidate back sums",totals,"; unique answer 2")
print("LIMIT: net and stack transcription are inputs; publisher key unverified.")
