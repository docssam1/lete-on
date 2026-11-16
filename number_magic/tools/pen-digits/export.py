# train.py 가 만든 net.pt 를 8비트로 줄여 app/pen-digits-model.js 로 내보낸다.
# 쓰는 법: python3 train.py (mnist.npz 를 같은 폴더에 받아 둔다 — keras 공개 사본) → python3 export.py
import torch, numpy as np, base64, json, torch.nn as nn, torch.nn.functional as F, os
class Net(nn.Module):
    def __init__(s):
        super().__init__(); s.c1=nn.Conv2d(1,8,5,padding=2); s.c2=nn.Conv2d(8,16,5,padding=2); s.f1=nn.Linear(16*7*7,64); s.f2=nn.Linear(64,10)
    def forward(s,x):
        x=F.max_pool2d(F.relu(s.c1(x)),2); x=F.max_pool2d(F.relu(s.c2(x)),2); x=x.flatten(1); return s.f2(F.relu(s.f1(x)))
net=Net(); net.load_state_dict(torch.load('net.pt')); meta=[]; blob=bytearray()
for k,v in net.state_dict().items():
    a=v.numpy().astype(np.float32); s=float(np.abs(a).max())/127 or 1e-8
    qi=np.clip(np.round(a/s),-127,127).astype(np.int8)
    meta.append({'k':k,'shape':list(a.shape),'scale':s,'off':len(blob)}); blob+=qi.tobytes()
w={'meta':meta,'b64':base64.b64encode(bytes(blob)).decode()}
out=os.path.join(os.path.dirname(__file__),'..','..','app','pen-digits-model.js')
head=open(out,encoding='utf-8').read().split('window.NM_PEN_DIGIT_MODEL=')[0] if os.path.exists(out) else ''
open(out,'w',encoding='utf-8').write(head+'window.NM_PEN_DIGIT_MODEL='+json.dumps(w,separators=(',',':'))+';\n')
print('wrote',out,len(blob),'bytes')
