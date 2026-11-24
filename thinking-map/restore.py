"""Restore reviewed code into a private workspace without copying datasets or overwriting edits."""
import argparse,hashlib,json,subprocess
from pathlib import Path,PurePosixPath

PACKAGE=Path(__file__).resolve().parent
def read(name):return json.loads((PACKAGE/name).read_text())
def digest(raw):return hashlib.sha256(raw).hexdigest()
def relative(value):
 p=PurePosixPath(value)
 if p.is_absolute()or '..'in p.parts or not p.parts:raise ValueError('Manifest path must stay relative.')
 return Path(*p.parts)
def outside_git(workspace):
 # Resolve symlinks first, including a workspace created under an existing checkout.
 for p in [workspace,*workspace.parents]:
  if(p/'.git').exists():raise ValueError('Choose a private workspace outside every Git working tree.')
def code_payloads():
 m=read('code-manifest.json');payloads={}
 for f in m['files']:
  raw=(PACKAGE/relative(f['storedPath'])).read_bytes()
  if digest(raw)!=f['sha256']or len(raw)!=f['bytes']:raise ValueError('Published runtime code changed: '+f['path'])
  payloads[relative(f['path'])]=raw
 for f in m['pinnedGitFiles']:
  # Only immutable public files already present in this repository's Git history.
  raw=subprocess.check_output(['git','-C',str(PACKAGE),'show',f['ref']+':'+f['repositoryPath']],stderr=subprocess.PIPE)
  blob=hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest()
  if blob!=f['gitBlobSHA']or digest(raw)!=f['sha256']or len(raw)!=f['bytes']:raise ValueError('Pinned dependency changed: '+f['path'])
  payloads[relative(f['path'])]=raw
 return payloads
def verify(workspace,require_code=True,require_data=True):
 workspace=Path(workspace).resolve();outside_git(workspace)
 if require_code:
  for name,raw in code_payloads().items():
   p=workspace/name
   if not p.is_file()or p.is_symlink()or p.read_bytes()!=raw:raise ValueError('Missing or changed runtime code: '+str(name))
 if require_data:
  for f in read('private-data-manifest.json')['files']:
   p=workspace/relative(f['path'])
   if not p.is_file()or p.stat().st_size!=f['bytes']or digest(p.read_bytes())!=f['sha256']:raise ValueError('Restore the verified private dependency: '+f['path'])
 return dict(codeVersion=read('code-manifest.json')['sourceCheckpoint'],privateDataVerified=require_data)
def install(workspace):
 workspace=Path(workspace).resolve();outside_git(workspace);payloads=code_payloads()
 for name,raw in payloads.items():
  p=workspace/name
  # Preflight every conflict before writing any file. User edits never get replaced.
  if p.is_symlink()or(p.exists()and(not p.is_file()or p.read_bytes()!=raw)):raise ValueError('Existing work differs; choose a new workspace: '+str(name))
  for parent in p.parents:
   if parent==workspace:break
   if parent.is_symlink():raise ValueError('Code destinations must not traverse symlinks: '+str(name))
 added=0
 for name,raw in payloads.items():
  p=workspace/name
  if p.exists():continue
  p.parent.mkdir(parents=True,exist_ok=True)
  with p.open('xb')as stream:stream.write(raw)
  added+=1
 return dict(installedCodeFiles=added,matchingCodeFilesReused=len(payloads)-added,datasetsCopied=0,savedUserDataTouched=False)
def main():
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--workspace',required=True);parser.add_argument('--install-code',action='store_true');parser.add_argument('--code-only',action='store_true');args=parser.parse_args()
 if args.install_code:print(json.dumps(install(args.workspace)))
 print(json.dumps(verify(args.workspace,require_data=not args.code_only)))
if __name__=='__main__':main()
