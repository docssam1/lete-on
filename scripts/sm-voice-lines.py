#!/usr/bin/env python3
"""
레이키즈(sm/) 독쌤 대사 모으기 — OmniVoice 독쌤 목소리로 만들 줄 목록.

  1) 코드의 고정 대사: guide.say/praise/encourage/think("…") 와 say:/wrongSay:/praise:/hint: "…" 글.
     ${…}가 들어간 글(아이마다 달라지는 말)은 아래 VARY 표에서 나올 수 있는 값을 모두 펼쳐 만든다(원장 2026-11-13 「4차시까지 보이스 넣어」).
     변수에 담아 넘기는 말(삼항식·intro·why 등)도 놓치지 않게, 화면 코드의 문장(. ! ?로 끝나는 한글 글)을 모두 모은다.
  2) 교재 지문: sm/data/a1-2.local.json · a1-3.local.json 의 text·text2·bubbles·rules(원장 2026-11-12 「지문도 복제 목소리」).
     지문 글 목록은 공개 저장소에 두지 않는다 → sm/data/voice-book.local.json (gitignore: sm/data/*.local.json)

결과
  sm/data/voice/sm.voice.json        {"lines":[{"id","text"}]}   코드 대사(공개 — 화면 코드에 이미 있는 글)
  sm/data/voice-book.local.json      {"lines":[{"id","text"}]}   지문(비공개)
파일 이름 규칙(사이트와 같음): sm-<sha1("sm-docssam-v1|"+글) 앞 12자>.mp3 → sm/audio/docssam/

쓰는 법: python3 scripts/sm-voice-lines.py
"""
import glob, hashlib, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SM = os.path.join(ROOT, "sm")
TAG = "sm-docssam-v1"

CALL = re.compile(r"guide\.(?:say|praise|encourage|think)\(\s*(\"(?:[^\"\\]|\\.)*\"|`[^`]*`|'(?:[^'\\]|\\.)*')")
KEY = re.compile(r"\b(?:say|wrongSay|praise|hint)\s*:\s*(\"(?:[^\"\\]|\\.)*\"|`[^`]*`)")


def unquote(lit):
    q, body = lit[0], lit[1:-1]
    if q == "`":
        return None if "${" in body else body
    return json.loads('"' + body.replace("\\'", "'").replace('"', '\\"') + '"') if q == "'" else json.loads(lit)


def key(text):
    return "sm-" + hashlib.sha1(f"{TAG}|{text}".encode("utf-8")).hexdigest()[:12]


# ── 문장 모으기: 변수·삼항식으로 넘기는 말까지(제목·이름표 같은 글은 . ! ?로 끝나지 않아 빠진다) ──
LIT = re.compile(r'"((?:[^"\\\n]|\\.)*)"|\'((?:[^\'\\\n]|\\.)*)\'|`([^`]*)`')
NOT_SPOKEN_KEY = re.compile(r"\b(?:title|subtitle|doneTitle|doneText|name|label|page|mark|aria-label)\s*:\s*$")
SPOKEN_FILES = ["js/lesson.js", "js/maze.js", "js/numbers.js", "js/lessons/*.js"]


def sentences():
    out = []
    for pat in SPOKEN_FILES:
        for f in sorted(glob.glob(os.path.join(SM, pat))):
            src = re.sub(r"//[^\n]*", "", open(f, encoding="utf-8").read())
            for m in LIT.finditer(src):
                q = next(i for i, g in enumerate(m.groups()) if g is not None)
                t = m.group(q + 1)
                if q == 2 and "${" in t:
                    continue
                if re.search(r"[<{};=\n]", t) or not re.search(r"[가-힣]", t) or not re.search(r"[.!?…]$", t.strip()):
                    continue
                if NOT_SPOKEN_KEY.search(src[max(0, m.start() - 30):m.start()]):
                    continue
                t = json.loads('"' + t.replace('\\\'', "'").replace('"', '\\"') + '"') if q == 1 else (json.loads('"' + t + '"') if q == 0 else t)
                out.append(t)
    return out


# ── 바뀌는 말 펼치기 ──
#   (파일, 템플릿 앞부분, [{${…} 안의 식: 값}]) — 템플릿 글은 코드에서 그대로 가져오고, ${식}만 값으로 바꾼다.
#   코드가 바뀌어 템플릿이나 식이 맞지 않으면 바로 멈춘다(조용히 어긋나지 않게).
def josa(w, a, b):
    c = ord(w[-1]) - 0xAC00
    return w + a if 0 <= c <= 11171 and c % 28 else w + b


def ieyo(w):
    return josa(w, "이에요", "예요")


def templates(rel, start):
    src = open(os.path.join(SM, "js", rel), encoding="utf-8").read()
    bodies = {m.group(1) for m in re.finditer(r"`([^`]*)`", src) if m.group(1).startswith(start)}
    if len(bodies) != 1:
        raise SystemExit(f"템플릿을 하나로 못 찾음: {rel} 「{start}」 → {len(bodies)}개")
    return bodies.pop()


def fill(body, vals):
    def sub(m):
        k = m.group(1).strip()
        if k not in vals:
            raise SystemExit(f"값이 없는 식: ${{{k}}} 「{body}」")
        return str(vals[k])
    return re.sub(r"\$\{(.*?)\}", sub, body)


def vary(book_pages):
    out = []
    def add(rel, start, rows):
        body = templates(rel, start)
        for v in rows:
            out.append(fill(body, v))
    RODS = {1: "흰색", 2: "빨간색", 3: "연두색", 4: "보라색", 5: "노란색", 6: "초록색", 7: "검은색", 8: "갈색", 9: "파란색", 10: "주황색"}
    # 네모네모 미로 발자국 수: 출발점에서 도착까지 갈 수 있는 길(같은 칸 두 번 안 감)을 모두 세어 본 값
    #   54쪽 ①11 ②7 · 활동판 A ①5 ②11 ③13·15 · B ①15·17·21 ②6·8 ③11·13·17 · 68쪽 ①11 ②7 · 69쪽 소이 7 주명 14
    STEPS = {"①": (5, 11, 15, 17, 21), "②": (6, 7, 8, 11), "③": (11, 13, 15, 17), "소이": (7,), "주명": (14,)}
    # 공통
    add("lesson.js", "정말 잘했어요! 별을", [{"stars": n} for n in (1, 2, 3)])
    # 1단원 1차시
    names = (book_pages.get("8") or {}).get("names") or ["민수", "민지", "민석"]
    add("lessons/u1-s1.js", "맞아요! 끝을 맞추어", [{"names[2]": names[2]}])
    add("lessons/u1-s1.js", "빛나는 칸이", [{"need": n} for n in range(1, 11)])
    add("lessons/u1-s1.js", "맞아요! ${part.kind", [{'part.kind === "short" ? "짧은" : "긴"': w} for w in ("짧은", "긴")])
    add("lessons/u1-s1.js", "${n}칸 막대는 놓을 곳이", [{"n": n} for n in range(1, 6)])
    add("lessons/u1-s1.js", "${n}${[2, 4, 5]", [{"n": n, '[2, 4, 5].includes(n) ? "가" : "이"': "가" if n in (2, 4, 5) else "이"} for n in range(1, 6)])
    add("lessons/u1-s1.js", "그 막대는 ${item.len}칸", [{"item.len": l, "n": n} for n in range(1, 6) for l in range(1, 11) if l != n])
    add("lessons/u1-s1.js", "독쌤은 ${RODS[dl].name}", [{"RODS[dl].name": RODS[n], "dl": n} for n in range(1, 6)])
    # 1단원 2차시
    M = [("연필", 3), ("해바라기", 5), ("양", 3), ("기린", 5), ("토끼", 2), ("공룡", 4)]
    add("lessons/u1-s2.js", "${name}의 길이는 큐브 몇 개", [{"name": n} for n, _ in M])
    add("lessons/u1-s2.js", "맞아요! ${name}의 길이는", [{"name": n, "units": u} for n, u in M])
    add("lessons/u1-s2.js", "${it.name}의 길이를 큐브로", [{"it.name": n} for n, _ in M[2:]])
    add("lessons/u1-s2.js", "잘했어요! 가장 긴 길이는", [{"order[0].name": "기린", "ieyo(order.at(-1).name)": ieyo("토끼")}])
    # 1단원 3차시
    add("lessons/u1-s3.js", "(${k + 1}) 연필의", [{"k + 1": k} for k in (1, 2, 3)])
    add("lessons/u1-s3.js", "(${k + 1}) ${it.name}", [{"k + 1": 1, "it.name": "숟가락"}, {"k + 1": 2, "it.name": "빗"}])
    ex = ((book_pages.get("25") or {}).get("examples") or [None, [None, None]])[1][1] or "길이 모두 연결됨"
    add("lessons/u1-s3.js", "길이 모두 이어졌어요!", [{'pg?.examples?.[1]?.[1] || "길이 모두 연결됨"': ex}])
    # 2단원 1차시
    add("lessons/u2-s1.js", "${round}번째 판! 화살판", [{"round": r} for r in (1, 2, 3)])
    add("lessons/u2-s1.js", "${got.label}이 나왔어요", [{"got.label": b} for b in ("아빠곰", "엄마곰", "아기곰")])
    add("lessons/u2-s1.js", "앗, ${heavy", [{'heavy === "left" ? "내" : "독쌤"': w} for w in ("내", "독쌤")])
    add("lessons/u2-s1.js", "내가 ${mine}번 이겼어요", [{"mine": n} for n in (1, 2, 3)])
    add("lessons/u2-s1.js", "${mine}대 ${his}", [{"mine": n, "his": n} for n in (0, 1)])
    add("lessons/u2-s1.js", "독쌤이 ${his}번 이겼어요", [{"his": n} for n in (1, 2, 3)])
    add("lessons/u2-s1.js", "잘했어요! ${sc.heavy.name}", [{"sc.heavy.name": h, "sc.light.name": l} for h, l in (("컵", "모자"), ("가방", "컵"))])
    W = [("공", 7), ("원뿔", 5), ("아빠곰", 12)]
    add("lessons/u2-s1.js", "${name}의 무게는 큐브 몇 개", [{"name": n} for n, _ in W])
    add("lessons/u2-s1.js", "모두 ${n}개예요", [{"n": a} for _, a in W])
    add("lessons/u2-s1.js", "맞아요! ${name}의 무게는", [{"name": n, "answer": a} for n, a in W])
    # 2단원 3차시(사물 카드 12장 — 코드의 CARDS와 같은 큐브 수)
    add("lessons/u2-s3.js", "저울이 나란해요. ${josa", [{'josa(it.name, "의", "의")': n + "의"} for n in ("고양이", "여우")])
    C = [("가위", 7), ("풀", 5), ("연필", 2), ("지우개", 3), ("휴지", 11), ("컵", 1), ("지갑", 7), ("색연필", 4), ("테이프", 8), ("거울", 12), ("칫솔", 6), ("시계", 9)]
    add("lessons/u2-s3.js", "${round}번째 판! 내 카드", [{"round": r} for r in (1, 2, 3, 4)])
    qb = templates("lessons/u2-s3.js", '${josa(me.name, "이", "가")} ${him.name}보다')
    add("lessons/u2-s3.js", "내 차례! ${q}", [{"q": fill(qb, {'josa(me.name, "이", "가")': josa(a, "이", "가"), "him.name": b})} for a, _ in C for b, _ in C if a != b])
    add("lessons/u2-s3.js", "독쌤 차례예요.", [{'josa(him.name, "이", "가")': josa(b, "이", "가"), 'saysHeavier ? "무거워" : "가벼워"': h} for b, _ in C for h in ("무거워", "가벼워")])
    add("lessons/u2-s3.js", "${who} ${c.name}의 큐브", [{"who": w, "c.name": n} for w in ("내 카드", "독쌤 카드") for n, _ in C])
    add("lessons/u2-s3.js", '${josa(c.name, "은", "는")} 큐브', [{'josa(c.name, "은", "는")': josa(n, "은", "는"), "c.w": w} for n, w in C])
    ws = [w for _, w in C]
    add("lessons/u2-s3.js", "${me.w}개와 ${me.w}개", [{"me.w": w} for w in sorted({w for w in ws if ws.count(w) > 1})])
    add("lessons/u2-s3.js", "${big.w}개가 ${small.w}개보다", [{"big.w": w, "small.w": s, 'josa(big.name, "이", "가")': josa(n, "이", "가")} for n, w in C for s in sorted({x for x in ws if x < w})])
    for start, var in (("예측이 맞았어요! 독쌤의", "him"), ("아쉬워요. 약속대로", "me"), ("독쌤 예측이 맞았어요.", "me"), ("독쌤 예측이 틀렸어요!", "him")):
        add("lessons/u2-s3.js", start, [{f'josa({var}.name, "을", "를")': josa(n, "을", "를")} for n, _ in C])
    msgs = [fill(templates("lessons/u2-s3.js", "카드를 ${gotMe}장"), {"gotMe": n}) for n in range(1, 5)]
    msgs += [fill(templates("lessons/u2-s3.js", "${gotMe}대 ${gotHim}"), {"gotMe": n, "gotHim": n}) for n in range(0, 3)]
    msgs += [fill(templates("lessons/u2-s3.js", "독쌤이 ${gotHim}장으로"), {"gotHim": n}) for n in range(1, 5)]
    add("lessons/u2-s3.js", "${msg} 큐브가", [{"msg": m} for m in msgs])
    # 3단원 1차시
    L3 = ["①", "②", "③"]
    add("lessons/u3-s1.js", "${s.label}에서 출발해", [{"s.label": l} for l in L3[:2]])
    add("lessons/u3-s1.js", "${s.label} 길은 발자국", [{"s.label": l, "r.steps": n} for l in L3 for n in STEPS[l]])
    add("lessons/u3-s1.js", "맞아요! ${best} 길이", [{"best": l} for l in L3[:2]])
    add("lessons/u3-s1.js", "활동판 ${key}!", [{"key": k} for k in ("A", "B")])
    add("lessons/u3-s1.js", "나는 ${mine}", [{"mine": a, "docPick": b} for a in L3 for b in L3 if a != b])
    add("lessons/u3-s1.js", "${s.label}에서 보물 상자까지", [{"s.label": l} for l in L3])
    for start in ("${best} 길이 가장 빨라요. 내가", "${best} 길이 가장 빨라요. 이번엔", "${best} 길이 가장 빨라요. 둘 다"):
        add("lessons/u3-s1.js", start, [{"best": l} for l in L3])
    add("lessons/u3-s1.js", "(${(i % 2) + 1}) 화살표", [{"(i % 2) + 1": k} for k in (1, 2)])
    # 3단원 2차시(거울 미로 사탕 수는 미로 길로 정해진다: 61·71~73쪽 2·3·4개, 활동판 A~D 2·3·4·4개)
    CANDY = (2, 3, 4)
    add("lessons/u3-s2.js", "예상이 딱 맞았어요!", [{"answer": a} for a in CANDY])
    add("lessons/u3-s2.js", "예상은 ${guess}개", [{"guess": g, "answer": a} for a in CANDY for g in range(0, 6) if g != a])
    add("lessons/u3-s2.js", "사탕을 ${answer}개", [{"answer": a} for a in CANDY])
    add("lessons/u3-s2.js", "활동판 네 개에서", [{"total": 2 + 3 + 4 + 4}])
    N3 = ["①", "②", "소이", "주명"]
    add("lessons/u3-s2.js", "${names[i]} 길을 그려", [{"names[i]": n} for n in N3])
    add("lessons/u3-s2.js", "${names[i]} 길은 발자국", [{"names[i]": n, "r.steps": k} for n in N3 for k in STEPS[n]])
    add("lessons/u3-s2.js", "맞아요! ${names[best]}", [{"names[best]": n} for n in N3])
    add("lessons/u3-s2.js", "${x}번 컵과 ${y}번 컵", [{"x": x, "y": y, "heavy": h} for x, y in ((1, 2), (1, 3), (2, 3)) for h in (x, y)])
    import itertools
    BEAR = {"papa": "아빠곰", "mama": "엄마곰", "baby": "아기곰"}
    rows = []
    for sizes in itertools.permutations(["papa", "mama", "baby"]):
        rows.append({"papaCup": sizes.index("papa") + 1, "reveal": " · ".join(f"{n}번 {BEAR[sizes[n - 1]]}" for n in (1, 2, 3))})
    add("lessons/u3-s2.js", "맞아요! ${papaCup}번", rows)
    add("lessons/u3-s2.js", "아빠곰은 ${papaCup}번", rows)
    add("lessons/u3-s2.js", "곰돌이를 ${got}개", [{"got": g} for g in range(0, 4)])
    # 같이 세기(큐브를 하나씩 짚으며 「1」「2」… — 1단원·2단원)
    out += [str(n) for n in range(1, 21)]   # 같이 세기 하나~스물(A1-2 20까지의 수)
    return out


def main():
    code, dynamic = [], 0
    for f in sorted(glob.glob(os.path.join(SM, "js", "**", "*.js"), recursive=True)):
        src = open(f, encoding="utf-8").read()
        for rx in (CALL, KEY):
            for m in rx.finditer(src):
                t = unquote(m.group(1))
                if t is None:
                    dynamic += 1
                elif re.search(r"[가-힣]", t):
                    code.append(t)
    book = []
    p = os.path.join(SM, "data", "a1-3.local.json")
    pages = json.load(open(p, encoding="utf-8"))["pages"] if os.path.exists(p) else {}
    made = vary(pages)
    code += sentences() + made
    p12 = os.path.join(SM, "data", "a1-2.local.json")   # A1-2 3·4단원 지문(2026-11-13~)
    pages12 = json.load(open(p12, encoding="utf-8"))["pages"] if os.path.exists(p12) else {}
    for pg in (pages12, pages):
        for no, e in sorted(pg.items(), key=lambda kv: int(kv[0])):
            # 지문(text·text2)과 화면에서 독쌤이 읽는 말풍선·규칙(4단원부터 읽음)
            for t in [e.get("text"), e.get("text2"), *(e.get("bubbles") or []), *(e.get("rules") or [])]:
                if t:
                    book.append(t)
    def pack(texts):
        seen, out = set(), []
        for t in texts:
            if t not in seen:
                seen.add(t); out.append({"id": key(t), "text": t})
        return {"tag": TAG, "lines": out}
    os.makedirs(os.path.join(SM, "data", "voice"), exist_ok=True)
    a, b = pack(code), pack([t for t in book if t not in set(code)])
    json.dump(a, open(os.path.join(SM, "data", "voice", "sm.voice.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump(b, open(os.path.join(SM, "data", "voice-book.local.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"코드 대사 {len(a['lines'])}줄(바뀌는 말 펼친 것 {len(set(made))}줄 포함) · 지문 {len(b['lines'])}줄 · 템플릿 {dynamic}곳")


if __name__ == "__main__":
    main()
