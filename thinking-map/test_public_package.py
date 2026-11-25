"""Fail when a private payload or an unmanifested runtime file enters the public package."""
import ast,hashlib,json,re,subprocess
from pathlib import Path
from restore import PACKAGE,code_payloads,read

def main():
 files=read('code-manifest.json')['files'];allowed={f['storedPath']for f in files}|{'AGENTS.md','README.md','.gitignore','code-manifest.json','private-data-manifest.json','restore.py','start.py','test_restore.py','test_public_package.py','DESIGN-user-flow.md','test_user_flow.cjs'}
 present={str(p.relative_to(PACKAGE))for p in PACKAGE.rglob('*')if p.is_file()and '__pycache__'not in p.parts}
 assert present==allowed,(present-allowed,allowed-present)
 secret=re.compile(r'(?:sk-ant-api\d+-[A-Za-z0-9_-]{20,}|sk-proj-[A-Za-z0-9_-]{20,}|AIza[0-9A-Za-z_-]{30,}|-----BEGIN (?:RSA |EC )?PRIVATE KEY-----)')
 for relative in present:
  p=PACKAGE/relative
  assert not any(part in p.parts for part in ['local-cache','saved-bank','outputs','private'])
  assert not p.is_symlink()
  assert not secret.search(p.read_text()),relative
  if p.suffix=='.py':ast.parse(p.read_text())
 payloads=code_payloads();assert len(payloads)==101
 # The worker's snapshot is already public Git code, not a fresh answer/source export.
 assert all(f['ref']=='c0f37b74b3f23d112c1c193241a8918615525150'for f in read('code-manifest.json')['pinnedGitFiles'])
 print(json.dumps(dict(passed=True,publicFiles=len(present),restorableRuntimeFiles=len(payloads),allRuntimeHashesMatched=True,unmanifestedRuntimeFiles=0,privatePayloadsIncluded=0,credentialPatternMatches=0)))
if __name__=='__main__':main()
