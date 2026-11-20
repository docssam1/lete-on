#let footcode = state("fc", "")
#let ink = rgb("#16417C")
#let gold = rgb("#C9A063")
#let paper = rgb("#F6F8FB")
#let line-c = rgb("#D5DCE6")
#let sub = rgb("#667085")
#set page(paper: "a4", margin: (top: 13mm, bottom: 14mm, left: 15mm, right: 15mm),
  footer: context [#set text(7.5pt, fill: luma(160)); #counter(page).display() / #counter(page).final().first() #h(1fr) Numbers of Magic #h(3mm) #text(features: (calt: 0))[#footcode.get()]])
#set text(font: "Pretendard", size: 10.5pt, lang: "ko", fill: rgb("#1b2232"))
#set par(leading: 0.72em)
#show math.equation: set text(font: ("Pretendard", "New Computer Modern Math"), size: 13.5pt)
#let blank(n) = box(width: 0.78em * n + 1em, height: 1.95em, baseline: 0.58em, stroke: 0.8pt + luma(70), radius: 2pt, fill: white)
#let pill(body, fill: ink, color: white) = box(fill: fill, inset: (x: 6pt, y: 2.6pt), radius: 8pt, text(8pt, weight: 700, fill: color, body))

#let pagehead(title, sec, day, code, first, total, fcode) = {
  footcode.update(fcode)
  grid(columns: (auto, 1fr, auto), align: (left + horizon, center + horizon, right + horizon), column-gutter: 8pt,
    stack(dir: ltr, spacing: 2mm, image("gfield-logo.png", height: 7mm), image("docssam.png", height: 8.5mm)),
    if first { text(8.5pt, fill: sub)[이름 #box(width: 26mm, stroke: (bottom: 0.5pt + line-c))[] #h(5mm) 푼 날짜 #box(width: 22mm, stroke: (bottom: 0.5pt + line-c))[] #h(5mm) 점수 #box(width: 11mm, stroke: (bottom: 0.5pt + line-c))[] / #total] } else { [] },
    [#text(8pt, fill: luma(150), tracking: 0.02em, features: (calt: 0))[#code] #h(2mm) #pill([#day 일차])])
  v(2.5mm)
  block(width: 100%, fill: paper, radius: 5pt, inset: (x: 10pt, y: 7pt), stroke: (bottom: 1.4pt + gold),
    grid(columns: (auto, auto, 1fr), column-gutter: 8pt, align: horizon,
      box(width: 6.5mm, height: 6.5mm, radius: 3pt, fill: ink, align(center + horizon, text(11pt, weight: 800, fill: white, sec))),
      pill([#day 일차], fill: white, color: ink),
      text(13.5pt, weight: 800, fill: ink, title)))
  v(4mm)
}
#let concept(kicker, body) = block(width: 100%, fill: rgb("#EEF3FA"), radius: 6pt, inset: (x: 12pt, y: 10pt))[
  #pill[개념] #if kicker != "" { h(0.4em); text(9pt, weight: 700, fill: ink, kicker) } #h(0.6em) #body]
#let ramp(body) = block(above: 2mm, text(9pt, fill: sub, body))
#let example(body) = block(width: 100%, radius: 6pt, stroke: 1pt + line-c, inset: (x: 12pt, y: 10pt), above: 3.5mm)[
  #grid(columns: (1fr, auto), align: (left + horizon, right + bottom), column-gutter: 8pt,
    [#pill(fill: gold)[예시] #v(2mm) #body],
    image("docssam.png", height: 17mm))]
#let gcard(lbl, body) = block(width: 100%, height: 100%, radius: 6pt, stroke: 1pt + line-c, inset: (x: 12pt, y: 11pt), fill: white)[
  #grid(columns: (auto, 1fr), column-gutter: 9pt, align: (left + top, left + top),
    box(width: 6.5mm, height: 6.5mm, radius: 50%, fill: ink, align(center + horizon, text(9.5pt, weight: 700, fill: white, lbl))),
    body)]
#let guide(..cards) = {
  v(4mm)
  text(10.5pt, weight: 800, fill: ink)[따라 풀어 보세요.]
  v(2.5mm)
  let c = cards.pos()
  block(height: 1fr, width: 100%, grid(columns: 1fr, rows: (1fr,) * c.len(), row-gutter: 4mm, ..c))
}
#let instr(body) = block(below: 3.5mm, text(11pt, weight: 800, fill: ink)[#box(width: 2.2mm, height: 2.2mm, fill: gold, radius: 1pt) #h(1.5mm) #body])
#let pcard(no, challenge, body) = block(width: 100%, height: 100%, radius: 6pt, stroke: 1pt + line-c, inset: (x: 11pt, y: 10pt),
  fill: if challenge { rgb("#FFFBF2") } else { white })[
  #text(10pt, weight: 800, fill: ink)[(#no)] #if challenge { h(1.5mm); pill(fill: gold)[여기부터 도전] }
  #v(3.5mm)
  #pad(left: 2mm, body)]
#let probs(..cells) = {
  let c = cells.pos()
  let half = calc.ceil(c.len() / 2)
  let ordered = ()
  for i in range(half) {
    ordered.push(c.at(i))
    ordered.push(if i + half < c.len() { c.at(i + half) } else { [] })
  }
  block(height: 1fr, width: 100%, grid(columns: (1fr, 1fr), rows: (1fr,) * half, column-gutter: 5mm, row-gutter: 4mm, ..ordered))
}

// ---------- 전체판에 더한 것 ----------
#let embed(n) = page(margin: 0pt, footer: none, header: none, image("src.pdf", page: n, width: 100%, height: 100%))
// 브라우저 PDF 의 한 자리를 그대로(벡터) 잘라 싣는다 — 그림·세로셈·그래프처럼 Typst 로 다시 그리지 않는 것
#let snip(pg, x, y, w, h) = layout(size => {
  let s = calc.min(1.0, size.width / (w * 1mm))
  box(width: w * 1mm * s, height: h * 1mm * s, clip: true,
    move(dx: -x * 1mm * s, dy: -y * 1mm * s, image("src.pdf", page: pg, width: 210mm * s, height: 297mm * s)))
})
#let snipfit(pg, x, y, w, h) = block(width: 100%, height: 1fr, layout(size => {
  let s = calc.min(1.0, size.width / (w * 1mm), size.height / (h * 1mm))
  box(width: w * 1mm * s, height: h * 1mm * s, clip: true,
    move(dx: -x * 1mm * s, dy: -y * 1mm * s, image("src.pdf", page: pg, width: 210mm * s, height: 297mm * s)))
}))
#let ccard(no, challenge, body) = block(width: 100%, height: 100%, radius: 6pt, stroke: 1pt + line-c, inset: (x: 10pt, y: 9pt),
  fill: if challenge { rgb("#FFFBF2") } else { white })[
  #text(10pt, weight: 800, fill: ink)[(#no)] #if challenge { h(1.5mm); pill(fill: gold)[여기부터 도전] }
  #v(2mm)
  #align(center, body)]
#let pgrid(cols, rows, gap, ..cells) = block(height: 1fr, width: 100%,
  grid(columns: (1fr,) * cols, rows: (1fr,) * rows, column-gutter: 5mm, row-gutter: gap, ..cells.pos()))
#let akpagehead(code) = {
  footcode.update(code)
  grid(columns: (auto, 1fr, auto), column-gutter: 8pt, align: horizon, image("gfield-logo.png", height: 7mm),
    text(15pt, weight: 800, fill: ink)[정답지 #text(10pt, fill: sub, weight: 500)[Answer Key]], text(8pt, fill: luma(150), features: (calt: 0), code))
  v(1mm)
}
#let retry(qr) = block(width: 100%, above: 4mm, radius: 6pt, fill: paper, inset: (x: 10pt, y: 7pt),
  grid(columns: (17mm, 1fr), column-gutter: 9pt, align: (left + horizon, left + horizon),
    if qr != none { image(qr, width: 17mm) } else { [] },
    [#text(10pt, weight: 800, fill: ink)[새 문제로 한 번 더] \ #text(8.5pt, fill: sub)[QR을 찍으면 같은 유형의 새 문제가 나와요. 화면에서 바로 풀 수 있어요.]]))
#let dotline = block(width: 100%, height: 9mm, stroke: (bottom: (paint: luma(175), thickness: 0.6pt, dash: "dashed")))
#let tbanner = block(width: 100%, below: 4mm, grid(columns: (auto, 1fr), column-gutter: 8pt, align: (left + bottom, left + bottom),
  image("momo-8-happy.png", height: 13mm),
  block(width: 100%, inset: (bottom: 3pt), stroke: (bottom: 1.4pt + gold), text(10.5pt, weight: 800, fill: ink, tracking: 0.12em)[Training Course])))
#let tcard(no, note, expr, steps, bare) = block(width: 100%, height: 100%, radius: 6pt, stroke: 1pt + line-c, inset: (x: 12pt, y: 10pt), fill: white)[
  #text(10pt, weight: 800, fill: ink)[(#no)] #if note != none { h(2mm); text(9.5pt, fill: sub, note) }
  #v(2mm)
  #block(width: 100%, inset: (bottom: 5pt), stroke: (bottom: 1pt + gold), expr)
  #for s in steps { block(width: 100%, height: 11mm, inset: (top: 1mm), stroke: (bottom: (paint: luma(190), thickness: 0.6pt, dash: "dashed")),
      align(horizon, [#text(11pt, weight: 800, fill: gold)[→] #h(1.5mm) #s])) }
  #for _ in range(if bare { 3 } else { 1 }) { dotline }
]
#let tgrid(..cells) = { let c = cells.pos(); block(height: 1fr, width: 100%, grid(columns: 1fr, rows: (1fr,) * c.len(), row-gutter: 4mm, ..c)) }
#let wcard(no, story, unit) = block(width: 100%, height: 100%, radius: 6pt, stroke: 1pt + line-c, inset: (x: 12pt, y: 9pt), fill: white)[
  #text(10pt, weight: 800, fill: ink)[(#no)] #h(2mm) #story
  #v(1fr)
  #grid(columns: (auto, 1fr, 9mm, auto, 30mm, auto), column-gutter: 2mm, align: bottom,
    text(9.5pt, weight: 700, fill: sub)[식], block(width: 100%, stroke: (bottom: 0.7pt + luma(120)), v(5mm)), [],
    text(9.5pt, weight: 700, fill: sub)[답], block(width: 100%, stroke: (bottom: 0.7pt + luma(120)), v(5mm)), text(10pt, unit))
]
#let wgrid(..cells) = { let c = cells.pos(); block(height: 1fr, width: 100%, grid(columns: 1fr, rows: (1fr,) * c.len(), row-gutter: 3mm, ..c)) }

// 정답지
#let akhead(title, code) = block(width: 100%, above: 5mm, below: 2.5mm, inset: (bottom: 3pt), stroke: (bottom: 1pt + gold),
  [#text(10.5pt, weight: 800, fill: ink, title) #h(2mm) #text(7.5pt, fill: luma(150), features: (calt: 0), code)])
#let aktip(body) = block(width: 100%, below: 1.6mm, inset: (x: 3mm, y: 1.6mm), radius: 2pt, fill: rgb("#F5F1E6"), text(9pt, fill: sub, body))
#let akguide(..xs) = block(below: 2mm, text(9.5pt, fill: sub)[따라 풀기 #h(2mm) #xs.pos().join(h(5mm))])
#let akitems(..xs) = grid(columns: (1fr,) * 8, row-gutter: 2.6mm, column-gutter: 2mm, ..xs.pos().map(x => text(10pt, x)))
#let akwide(..xs) = grid(columns: (1fr,) * 3, row-gutter: 2.6mm, column-gutter: 2mm, ..xs.pos().map(x => text(10pt, x)))
#let akchain(no, val, chain) = block(above: 2.6mm, below: 2.6mm, { show math.equation: set text(size: 10.5pt); text(10pt)[(#no) #text(weight: 800)[#val] #h(3mm) #chain] })

#let akpg(lbl) = block(above: 2mm, below: 0.5mm, text(7pt, fill: luma(150), features: (calt: 0), lbl))
