#!/usr/bin/env python3
"""Compile the app's grade-5 sample through Typst. No cloud/API calls or learner storage."""
import argparse, json, os, subprocess, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
# A project-local dependency installation, if present, takes precedence.
TOOLS=ROOT/'tmp/pdfs/tooling'
if TOOLS.exists(): sys.path.insert(0,str(TOOLS))
import typst
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

def main():
 p=argparse.ArgumentParser();p.add_argument('--output',default='output/pdf/grade5-complete-roadmap.pdf');p.add_argument('--state',help='Optional saved sample choices JSON; not a learner profile');p.add_argument('--node',default=os.environ.get('NODE','node'));args=p.parse_args()
 out=(ROOT/args.output).resolve();out.parent.mkdir(parents=True,exist_ok=True)
 work=ROOT/'tmp/pdfs/grade5';work.mkdir(parents=True,exist_ok=True)
 cmd=[args.node,str(Path(__file__).with_name('export-grade5.mjs')),str(work)]
 if args.state:cmd.append(str(Path(args.state).resolve()))
 subprocess.run(cmd,check=True)
 fonts=ROOT/'tmp/pdfs/fonts';fonts.mkdir(exist_ok=True)
 source=ROOT/'roadmap/demo2/assets/fonts'
 for weight in [400,600,700]:
  target=fonts/f'Pretendard-{weight}.ttf'
  if not target.exists():
   f=TTFont(source/'pretendard-var.woff2');f.flavor=None
   f=instantiateVariableFont(f,{'wght':weight},inplace=True);f.save(target)
 config={'data':'/tmp/pdfs/grade5/report.json','graph':'/tmp/pdfs/grade5/graph.svg'}
 result=typst.compile_with_warnings(str(Path(__file__).with_name('report.typ')),output=str(out),root=str(ROOT),font_paths=[str(fonts),str(source)],sys_inputs=config)
 # Warnings are surfaced for missing fonts or layout regressions.
 if result[1]: raise RuntimeError("Typst warnings: "+str(result[1]))
 print(json.dumps({'pdf':str(out),'bytes':out.stat().st_size},ensure_ascii=False))
if __name__=='__main__':main()
