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

def pencil(img, line_k=1.0, tone_k=1.0, light=0.86, stretch=False, seed=1, sigma=1.0, mask=None):
    h, w = img.shape[:2]
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(np.float32)
    L = lab[..., 0] / 255
    mask = subject_mask(img) if mask is None else mask
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
    dark = np.clip((light - J) / 0.75, 0, 1) ** 1.3 * 0.8 * tone_k   # 진한 몸도 흑연이 다 덮지 않게(종이가 비쳐 보여야 연필 그림)
    t1 = _grain((h, w), np.deg2rad(-35), seed, int(21 * sigma) | 1); t2 = _grain((h, w), np.deg2rad(55), seed + 7, int(21 * sigma) | 1)
    tone = (1 - t1) * np.clip(dark * 1.6, 0, 1) + (1 - t2) * np.clip(dark * 1.6 - 0.75, 0, 1)
    tone = np.clip(tone * 0.9 + dark * 0.18, 0, 1)
    m = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), 1.2)
    lines = np.clip(lines * m * 1.25, 0, 1); tone = tone * cv2.erode(m, np.ones((3, 3), np.uint8)) * 0.9
    return lines, tone, mask

def photo_mask(img, rect=None, poly=None, it=6):
    # 실사 사진에서 주인공만 남긴다(GrabCut). rect = [x, y, w, h], poly = 손으로 따 둔 윤곽(사진 픽셀) — 다리·더듬이가 길 바닥과 섞이는 사진은 poly로 시작한다.
    bg = np.zeros((1, 65), np.float64); fg = np.zeros((1, 65), np.float64)
    if poly:   # rect가 있으면 먼저 몸통을 찾아 「확실한 주인공」으로 박아 두고, 윤곽 안을 「아마 주인공」으로 넓힌다
        m = np.zeros(img.shape[:2], np.uint8); cv2.fillPoly(m, [np.array(poly, np.int32)], 1)
        g = np.where(m == 1, cv2.GC_PR_FGD, cv2.GC_BGD).astype(np.uint8)
        if rect:
            body = photo_mask(img, rect, None, it)
            g[(cv2.erode(body, np.ones((13, 13), np.uint8)) == 1) & (m == 1)] = cv2.GC_FGD
            bg = np.zeros((1, 65), np.float64); fg = np.zeros((1, 65), np.float64)
        cv2.grabCut(img, g, None, bg, fg, it, cv2.GC_INIT_WITH_MASK)
    else:
        g = np.zeros(img.shape[:2], np.uint8); cv2.grabCut(img, g, tuple(rect), bg, fg, it, cv2.GC_INIT_WITH_RECT)
    m = np.where((g == 1) | (g == 3), 1, 0).astype(np.uint8)
    n, lab, st, _ = cv2.connectedComponentsWithStats(m)
    if n > 1 and not poly: m = (lab == 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA]))).astype(np.uint8)   # 가장 큰 덩어리만(떨어진 배경 조각 버림). 윤곽을 따 둔 사진은 더듬이·다리가 따로 떨어져 있어도 남긴다
    return cv2.dilate(m, np.ones((5, 5), np.uint8))

def _xdog(g, s=1.0, k=1.6, p=20, eps=-0.02, phi=10):
    g = g.astype(np.float32) / 255; a = cv2.GaussianBlur(g, (0, 0), s); b = cv2.GaussianBlur(g, (0, 0), s * k)
    d = (1 + p) * a - p * b
    return np.clip(np.where(d >= eps, 1.0, 1 + np.tanh(phi * (d - eps))), 0, 1)

def pencil_photo(img, mask, seed=1):
    # 실사 사진용: 잘라 낸 경계에는 선을 긋지 않는다(배경이 섞여도 윤곽으로 안 보이게). 선 = XDoG, 명암 = 색상 닷지 + 연필결.
    g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY); g = cv2.createCLAHE(2.0, (8, 8)).apply(g); g = cv2.bilateralFilter(g, 7, 30, 7)
    line = 1 - _xdog(g)
    inv = 255 - g; bl = cv2.GaussianBlur(inv, (0, 0), 8); dodge = np.clip(g.astype(np.float32) * 255 / (255 - bl.astype(np.float32) + 1), 0, 255) / 255
    L = cv2.GaussianBlur(g, (0, 0), 2).astype(np.float32) / 255
    dark = np.clip((0.8 - L) / 0.75, 0, 1) ** 1.3 * 0.8
    h, w = g.shape; t1 = _grain((h, w), np.deg2rad(-35), seed); t2 = _grain((h, w), np.deg2rad(55), seed + 7)
    tone = (1 - t1) * np.clip(dark * 1.6, 0, 1) + (1 - t2) * np.clip(dark * 1.6 - 0.75, 0, 1)
    tone = np.clip(np.maximum(tone * 0.85, (1 - dodge) * 0.9), 0, 1)
    mm = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), 2)
    return np.clip(line * 1.5, 0, 1) ** 0.8 * mm, tone * mm * 0.8, mask
