# 3D 렌더(흰 바탕) → 연필 스케치 두 겹: 선(line) + 흑연 명암(tone). 둘 다 흑연색 + 알파.
# 선 = 밝기·색 경계(가우시안 차) + 실루엣, 굵기·진하기를 손처럼 흔든다. 명암 = 밝기를 흑연 농도로 바꾸고 두 방향 연필결로 칠한다.
import cv2, numpy as np

def _motion_kernel(L, ang):
    k = np.zeros((L, L), np.float32); c = L // 2
    for t in np.linspace(-c, c, L * 3):
        x = int(round(c + t * np.cos(ang))); y = int(round(c + t * np.sin(ang)))
        if 0 <= x < L and 0 <= y < L: k[y, x] = 1
    return k / k.sum()

def _grain(shape, ang, seed, L=21):
    rng = np.random.default_rng(seed)
    n = (rng.random(shape) > 0.88).astype(np.float32)
    t = cv2.filter2D(n, -1, _motion_kernel(L, ang))
    return np.clip(1 - t / (t.max() + 1e-6) * 1.25, 0.05, 1)

def subject_mask(img, bg_thr=246):
    m = (img.min(axis=2) < bg_thr).astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    m[:8, :] = 0; m[-8:, :] = 0; m[:, :8] = 0; m[:, -8:] = 0
    n, lab, st, _ = cv2.connectedComponentsWithStats(m)
    for i in range(1, n):
        if st[i, cv2.CC_STAT_AREA] < 60: m[lab == i] = 0
    return m

def pencil(img, line_k=1.0, tone_k=1.0, light=0.86, stretch=False, seed=1, sigma=1.0):
    h, w = img.shape[:2]
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(np.float32)
    L = lab[..., 0] / 255
    mask = subject_mask(img)
    edges = np.zeros((h, w), np.float32)
    for ch, wgt in ((lab[..., 0], 1.0), (lab[..., 1], 1.6), (lab[..., 2], 1.2)):
        g = cv2.GaussianBlur(ch, (0, 0), sigma); g2 = cv2.GaussianBlur(ch, (0, 0), sigma * 2.2)
        edges = np.maximum(edges, np.abs(g - g2) * wgt / 255)
    edges = np.clip((edges - 0.012) * 28, 0, 1)
    sil = cv2.morphologyEx(mask * 255, cv2.MORPH_GRADIENT, np.ones((3, 3), np.uint8)).astype(np.float32) / 255
    sil = cv2.dilate(sil, np.ones((2, 2), np.uint8)) if sigma > 1.4 else sil
    rng = np.random.default_rng(seed)
    wob = cv2.GaussianBlur(rng.random((h, w)).astype(np.float32), (0, 0), 9 * sigma); wob = (wob - wob.min()) / (np.ptp(wob) + 1e-6)
    lines = np.maximum(edges, sil * 0.95) * line_k * (0.55 + 0.6 * wob)
    lines = cv2.GaussianBlur(lines, (0, 0), 0.6)
    J = cv2.GaussianBlur(L, (0, 0), 2.0 * sigma)
    if stretch and mask.any():
        v = J[mask > 0]; lo, hi = np.percentile(v, 2), np.percentile(v, 99.5)
        J = np.clip((J - lo) / max(1e-3, hi - lo), 0, 1) * 0.75 + 0.22
    dark = np.clip((light - J) / 0.7, 0, 1) ** 1.15 * tone_k
    t1 = _grain((h, w), np.deg2rad(-35), seed, int(21 * sigma) | 1); t2 = _grain((h, w), np.deg2rad(55), seed + 7, int(21 * sigma) | 1)
    tone = (1 - t1) * np.clip(dark * 1.6, 0, 1) + (1 - t2) * np.clip(dark * 1.6 - 0.75, 0, 1)
    tone = np.clip(tone * 0.9 + dark * 0.18, 0, 1)
    m = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), 1.2)
    lines = np.clip(lines * m, 0, 1); tone = tone * cv2.erode(m, np.ones((3, 3), np.uint8)) * 0.85
    return lines, tone, mask
