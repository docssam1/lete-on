"""Independently enumerate the six faces under all proper cube rotations."""
from pathlib import Path
import runpy
geometry = runpy.run_path(str(Path(__file__).with_name('source-5-2-u5-check113-visual-audit.py')))
fold, rotate, rotations = (geometry[name] for name in ('fold', 'rotate', 'rotations'))
net = {(0,1):'triangle',(1,1):'diamond',(2,1):'square',(3,1):'star',(1,0):'circle',(3,2):'two'}
frames = fold(set(net))
assert len(rotations) == 24
fronts = []
for basis in rotations:
    faces = {rotate(normal,basis):net[position] for position,(_,_,normal) in frames.items()}
    if faces[(0,0,-1)] == 'diamond' and faces[(-1,0,0)] == 'triangle':
        fronts.append(faces[(0,1,0)])
assert fronts == ['circle'], fronts
print('PASS: among 24 cube rotations, the stated top and right faces uniquely give circle in front')
