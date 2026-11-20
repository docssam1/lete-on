#let ink = rgb("#16417C")
#let gold = rgb("#C9A063")
#let paper = rgb("#F6F8FB")
#let line-c = rgb("#D5DCE6")
#let sub = rgb("#667085")
#set page(paper: "a4", margin: (top: 13mm, bottom: 14mm, left: 15mm, right: 15mm),
  footer: context [#set text(7.5pt, fill: luma(160)); Numbers of Magic #h(1fr) #counter(page).display()])
#set text(font: "Pretendard", size: 10.5pt, lang: "ko", fill: rgb("#1b2232"))
#set par(leading: 0.72em)
#show math.equation: set text(font: ("Pretendard", "New Computer Modern Math"), size: 13.5pt)
#let blank(n) = box(width: 0.78em * n + 1em, height: 1.95em, baseline: 0.58em, stroke: 0.8pt + luma(70), radius: 2pt, fill: white)
#let pill(body, fill: ink, color: white) = box(fill: fill, inset: (x: 6pt, y: 2.6pt), radius: 8pt, text(8pt, weight: 700, fill: color, body))

#let pagehead(title, day, code, first, total) = {
  grid(columns: (auto, 1fr, auto), align: (left + horizon, center + horizon, right + horizon), column-gutter: 8pt,
    stack(dir: ltr, spacing: 2mm, image("gfield-logo.png", height: 7mm), image("docssam.png", height: 8.5mm)),
    if first { text(8.5pt, fill: sub)[이름 #box(width: 26mm, stroke: (bottom: 0.5pt + line-c))[] #h(5mm) 푼 날짜 #box(width: 22mm, stroke: (bottom: 0.5pt + line-c))[] #h(5mm) 점수 #box(width: 11mm, stroke: (bottom: 0.5pt + line-c))[] / #total] } else { [] },
    [#text(8pt, fill: luma(150), tracking: 0.02em)[#code] #h(2mm) #pill([#day 일차])])
  v(2.5mm)
  block(width: 100%, fill: paper, radius: 5pt, inset: (x: 10pt, y: 7pt), stroke: (bottom: 1.4pt + gold),
    grid(columns: (auto, auto, 1fr), column-gutter: 8pt, align: horizon,
      box(width: 6.5mm, height: 6.5mm, radius: 3pt, fill: ink, align(center + horizon, text(11pt, weight: 800, fill: white, day))),
      pill([#day 일차], fill: white, color: ink),
      text(13.5pt, weight: 800, fill: ink, title)))
  v(4mm)
}
#let concept(body) = block(width: 100%, fill: rgb("#EEF3FA"), radius: 6pt, inset: (x: 12pt, y: 10pt))[
  #pill[개념] #h(0.6em) #body]
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
