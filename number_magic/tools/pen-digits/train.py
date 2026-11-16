# 펜 숫자 판별 모델 학습(2026-11-16, 주간 학습지 「펜으로 풀기」 — app/pen-digits.js 가 쓴다).
# 자료: MNIST 손글씨 숫자(Yann LeCun · Corinna Cortes · Christopher J.C. Burges, CC BY-SA 3.0)를
#       keras 공개 사본 https://storage.googleapis.com/tensorflow/tf-keras-datasets/mnist.npz 로 받아 같은 폴더에 둔다(저장소에 넣지 않음).
# 모델: 합성곱 2단(8·16) + 64 → 10, 기울임·크기·굵기 흔들기로 학습(펜 글씨는 굵기·기울기가 제각각이라).
# 쓰는 법: pip install torch numpy → python3 train.py (CPU 몇 분) → python3 export.py → node number_magic/scripts/check-pen-sheet-browser.js
# 모양(층·크기)을 바꾸면 app/pen-digits.js 의 logits() 도 같이 바꿔야 한다.
import numpy as np, torch, torch.nn as nn, torch.nn.functional as F, json, math, sys
torch.manual_seed(7); np.random.seed(7)
d=np.load('mnist.npz'); xtr,ytr,xte,yte=d['x_train'],d['y_train'],d['x_test'],d['y_test']
xtr=torch.tensor(xtr,dtype=torch.float32).unsqueeze(1)/255.; ytr=torch.tensor(ytr).long()
xte=torch.tensor(xte,dtype=torch.float32).unsqueeze(1)/255.; yte=torch.tensor(yte).long()
class Net(nn.Module):
    def __init__(s):
        super().__init__(); s.c1=nn.Conv2d(1,8,5,padding=2); s.c2=nn.Conv2d(8,16,5,padding=2); s.f1=nn.Linear(16*7*7,64); s.f2=nn.Linear(64,10)
    def forward(s,x):
        x=F.max_pool2d(F.relu(s.c1(x)),2); x=F.max_pool2d(F.relu(s.c2(x)),2); x=x.flatten(1); return s.f2(F.relu(s.f1(x)))
def augment(x):
    n=x.shape[0]
    ang=(torch.rand(n)-.5)*2*math.radians(15); sc=1+(torch.rand(n)-.5)*.3; sh=(torch.rand(n)-.5)*.4
    tx=(torch.rand(n)-.5)*.16; ty=(torch.rand(n)-.5)*.16
    c,s_=torch.cos(ang)/sc,torch.sin(ang)/sc
    theta=torch.stack([torch.stack([c,-s_+sh,tx],1),torch.stack([s_,c,ty],1)],1)
    g=F.affine_grid(theta,x.shape,align_corners=False); x=F.grid_sample(x,g,align_corners=False)
    # thickness: dilate some, erode some
    r=torch.rand(n)
    dil=F.max_pool2d(x,3,1,1); ero=-F.max_pool2d(-x,3,1,1)
    x=torch.where((r<.3).view(-1,1,1,1),dil,torch.where((r>.85).view(-1,1,1,1),torch.maximum(ero,x*.6),x))
    return x.clamp(0,1)
net=Net(); opt=torch.optim.Adam(net.parameters(),1e-3)
for ep in range(8):
    perm=torch.randperm(len(xtr)); net.train()
    for i in range(0,len(xtr),128):
        idx=perm[i:i+128]; xb=augment(xtr[idx]); loss=F.cross_entropy(net(xb),ytr[idx]); opt.zero_grad(); loss.backward(); opt.step()
    for g in opt.param_groups: g['lr']*=.7
    net.eval()
    with torch.no_grad(): acc=(net(xte).argmax(1)==yte).float().mean().item(); acca=(net(augment(xte)).argmax(1)==yte).float().mean().item()
    print(ep,round(acc,4),round(acca,4),flush=True)
torch.save(net.state_dict(),'net.pt')
