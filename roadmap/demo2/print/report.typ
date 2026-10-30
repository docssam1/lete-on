// GFIELD print layout. Curriculum, dates, commentary and graph come from the app model.
#let d = json(sys.inputs.at("data"))
#let p = d.plan
#let r = d.report
#let ink = rgb("35253f")
#let purple = rgb("79538e")
#let muted = rgb("786d80")
#let rule = rgb("d4c7dc")
#let paper = rgb("faf8fc")
#let fills = (rgb("efe6f5"),rgb("e4efeb"),rgb("fbecd8"),rgb("e4eaf4"),rgb("f7f5f8"))
#set document(title: "초5 남학생 - 전체 학습 로드맵", author: "GFIELD", description: "2026년 11월부터 2030년 7월까지의 상담용 설계 예시")
#set text(font: "Pretendard Variable", lang: "ko", size: 10pt, fill: ink)
#set par(justify: false, leading: 0.55em)
#show heading: set block(above:0pt,below:0pt)
#set page(width:297mm,height:210mm,margin:(top:18mm,bottom:16mm,left:16mm,right:16mm),
 header: context if counter(page).get().first()>1 [#text(size:9pt,weight:"bold")[GFIELD] #h(5mm) #text(size:8pt,fill:muted)[초5 남학생 · 교과·활용·연산 로드맵] #h(1fr) #text(size:8pt,fill:muted)[상담용 설계 예시]],
 footer: context [#line(length:100%,stroke:0.4pt+rule) #v(1mm) #text(size:7.5pt,fill:muted)[2026.11 설계 기준 · 학년은 국내 학제 기준 · 계획은 실제 이해와 학교 일정에 맞춰 조정] #h(1fr) #text(size:8pt,fill:purple)[#counter(page).display("1")]])
#let section-head(k,t,sub:none) = {
 text(size:9pt,fill:purple,weight:"bold",tracking:0.6pt,k);v(2mm)
 heading(level:1,numbering:none,outlined:true,bookmarked:true)[#text(size:24pt,weight:"bold",t)];v(3mm)
 if sub!=none {text(size:9.5pt,fill:muted,sub);v(4mm)} else {v(4mm)}
}
#let note(body) = block(width:100%,inset:3mm,radius:2mm,fill:paper,stroke:0.5pt+rule)[#body]
#let para(body,hand:false) = {if hand {text(font:"Nanum Pen Script",size:16pt,body)}else{body};parbreak();v(1mm)}
#let tag(body) = box(inset:(x:3mm,y:1.5mm),radius:2mm,fill:fills.at(0))[#text(size:8.5pt,fill:purple,body)]
#let line-item(label,body) = grid(columns:(31mm,1fr),gutter:4mm,[#text(weight:"bold",label)],[#body])
#let fresh() = pagebreak(weak:true)

#text(size:17pt,weight:"bold",tracking:1pt)[GFIELD]
#h(1fr)#tag[전체 분석지 · 샘플]
#v(8mm)
#text(size:35pt,weight:"bold")[지금의 공부에서,]
#linebreak()
#text(size:35pt,weight:"bold")[중등의 다음 과정까지.]
#v(4mm)
#text(size:13pt,fill:muted)[초5 남학생 · 교과·쎈 활용·연산을 함께 설계한 학습 로드맵]
#v(6mm)
#block(width:100%,height:83mm,clip:true,radius:4mm)[#image("/roadmap/demo2/assets/learning-landscape-20261023.png",width:100%,height:83mm,fit:"cover")]
#v(5mm)
#grid(columns:(1fr,1fr,1fr),gutter:6mm,
 [#text(size:8pt,fill:muted)[현재 공부] #v(1.5mm) #text(size:12pt,weight:"bold")[5-2 응용 · 연산 6-1 안팎]],
 [#text(size:8pt,fill:muted)[설계 기간] #v(1.5mm) #text(size:12pt,weight:"bold")[2026.11 - 2030.07]],
 [#text(size:8pt,fill:muted)[중등 이후] #v(1.5mm) #text(size:12pt,weight:"bold")[공통수학 1·2 / 내신 병행]])
#v(4mm)
#text(size:8pt,fill:muted)[실제 학생의 성적표나 이수 기록을 대신하지 않는 익명 설계 예시입니다. 국어·과학의 출발 진도와 학교 시험일은 확인 후 조정합니다.]

#fresh()
#section-head("01 / DOCSSAM", "독쌤의 전체 총평")
#grid(columns:(29mm,1fr),gutter:6mm,
 [#image("/roadmap/v31/assets/math-docssam/docssam-math-A1-mouth-closed.png",width:27mm,height:41mm,fit:"contain")],
 [#text(font:"Nanum Pen Script",size:22pt)[교과를 앞에서 배우고, 쎈으로 배운 범위를 다져가겠습니다.]
 #v(3mm)
 #highlight(fill:rgb("e7dbf1"))[#text(size:11pt,weight:"bold",p.assessment.current.label)]
 #v(3mm)
 #text(size:9pt,fill:muted,p.assessment.note)])
#v(3mm)
#for t in r.front.prose.slice(0,5) {para(t,hand:true)}
#note[#text(size:10pt,weight:"bold")[첫해의 핵심] #h(3mm) 교과는 6-1부터 중1-2까지. 쎈은 먼저 배운 학기를 다지고, 겨울에는 중1 연산을 준비합니다.]

#fresh()
#section-head("01 / DOCSSAM · 계속", "그다음은, 내신과 선행을 함께.")
#for t in r.front.prose.slice(5) {para(t,hand:true)}
#v(2mm)
#grid(columns:(1fr,1fr),gutter:6mm,
 [#note[#text(weight:"bold")[바로 위 참고 일정] #v(2mm) #for a in p.assessment.next {text(size:10pt,weight:"bold",a.label);parbreak();text(size:9pt,fill:muted,a.range+" · 한 학기 "+str(a.pace.months)+"개월");v(3mm)}]],
 [#note[#text(weight:"bold")[이번 계획의 공부 속도] #v(2mm) #p.assessment.planPace.text #v(3mm) #text(size:9pt,fill:muted)[참고 레벨은 같은 시기의 교과 위치를 비교합니다. 현재 사고력 수준이나 영재원·학원 합격 가능성으로 해석하지 않습니다.]]])
#v(4mm)
#text(size:9pt,fill:purple)[뒤에서 살펴볼 순서 · 학습 로드맵 → 진도 비교 그래프 → 월별 병행표 → 교재별 공부 방법 → 학부모 질문]

#fresh()
#section-head("02 / LEARNING ROADMAP", "학기마다, 공부가 이어지는 시점.",sub:"현재 5-2 응용을 마친 것으로 바꾸지 않고, 11월부터 시작할 6-1 계획을 표시했습니다.")
#let stages = ("6-1","중1-2","중3-2","공통수학1","공통수학2")
#let stops = stages.map(s=>{let bs=p.lanes.find(l=>l.id=="school").blocks.filter(b=>b.stage==s and b.at("advances",default:true)!=false);(stage:s,start:bs.first().start,end:bs.last().end)})
#block(width:100%,height:81mm,radius:4mm,clip:true)[
 #image("/roadmap/demo2/assets/learning-landscape-20261023.png",width:100%,height:81mm,fit:"cover")
 #for (i,s) in stops.enumerate() {
  place(top+left,dx:(7+i*51)*1mm,dy:(47-i*8)*1mm)[#block(width:45mm,fill:rgb("fffffff2"),stroke:0.7pt+rule,radius:3mm,inset:3mm)[
   #text(size:8pt,fill:purple)[#numbering("01",i+1) / 계획 구간]
   #linebreak()#text(size:14pt,weight:"bold",s.stage)
   #linebreak()#text(size:8pt)[#p.months.at(int(s.start)).year.#numbering("01",p.months.at(int(s.start)).month) - #p.months.at(int(s.end)-1).year.#numbering("01",p.months.at(int(s.end)-1).month)]
  ]]
 }
]
#v(5mm)
#grid(columns:(1fr,1fr,1fr),gutter:5mm,..r.front.checkpoints.map(c=>note([#text(size:9pt,fill:purple,c.date) #v(2mm) #text(size:11pt,weight:"bold",c.title) #v(2mm) #text(size:9pt,c.text)])))

#fresh()
#section-head("03 / PROGRESS COMPARISON", "진도와 활용, 같은 기간에서 비교합니다.",sub:"보라색은 교과 진도, 초록색 계단은 쎈 한 학기의 마무리 목표입니다.")
#image(sys.inputs.at("graph"),width:100%,height:85mm,fit:"contain")
#grid(columns:(1fr,1fr,1fr),gutter:5mm,
 [#text(size:10pt,weight:"bold",fill:purple)[━ 교과 개념·유형·활용] #v(2mm) #text(size:9pt,p.graphReading.body)],
 [#text(size:10pt,weight:"bold",fill:rgb("438a80"))[└ 쎈 권별 마무리 목표] #v(2mm) #text(size:9pt,p.graphReading.example)],
 [#text(size:10pt,weight:"bold")[▥ 내신 집중월] #v(2mm) #text(size:9pt,p.graphReading.exams)])
#v(3mm)
#text(size:8pt,fill:muted)[교과 범위의 계획을 그린 선이며 실력 점수나 합격선은 아닙니다. 기본 개념과 유형을 배우는 선행도, 쎈을 적용하는 활용도 실제 풀이와 설명을 확인하며 이어갑니다.]

#fresh()
#section-head("04 / WEEKLY PLAN", "한 주의 공부, 겹치지 않게 배치합니다.")
#let c=p.classPlan
#grid(columns:(1fr,1fr),gutter:5mm,
 note([#text(size:14pt,weight:"bold")[교과 수학] #v(3mm) #line-item("초등 과정",[주 #c.elementary.sessions 회 · 회당 #c.elementary.hours 시간]) #v(2mm) #line-item("중등 과정",[주 #c.middle.sessions 회 · 회당 #c.middle.hours 시간]) #v(2mm) #line-item("고등 과정",[주 #c.high.sessions 회 · 회당 #c.high.hours 시간]) #v(3mm) #text(size:9pt)[중등은 한 학기 3개월 안에서 개념+유형 라이트와 RPM을 이어갑니다. 공통수학은 기본정석 뒤 쎈으로 활용을 다지며, 같은 공부를 별도 과제로 다시 더하지 않습니다.]]),
 note([#text(size:14pt,weight:"bold")[쎈 활용·연산] #v(3mm) #line-item("쎈",[주 2회 · 30~40분]) #v(2mm) #line-item("연산",[주 5일 · 15~20분]) #v(3mm) #text(size:9pt)[쎈 B유형을 중심으로, C는 풀이 이유를 설명할 수 있는 문제부터 선별합니다. 겨울에는 쎈 새 진도를 덜고 중1 연산에 집중합니다. 공통수학의 쎈은 위 정규 수업에 포함된 공부입니다.]]),
 note([#text(size:14pt,weight:"bold")[사고력] #v(3mm) #highlight(fill:fills.at(2))[2027년 1~6월 · 3% 올림피아드 1과정] #v(3mm) #text(size:9pt)[쎈 5-2를 정리한 뒤 여섯 달 동안 병행합니다. 주 2회 30분씩 나누어 보는 가정 학습 예시입니다. 생각할 시간을 먼저 주고, 풀이 설명과 오답 재풀이도 이 기간 안에 포함해 마칩니다.]]),
 note([#text(size:14pt,weight:"bold")[국어·과학] #v(3mm) #line-item("국어",[주 4회 20분 + 독서]) #v(2mm) #line-item("과학",c.science.label) #v(3mm) #text(size:9pt)[가정에서 과학을 공부한다면 주 2회 40~50분으로 나눕니다. 수업 형태가 달라져도 달력의 진도는 자동으로 빨라지지 않습니다. 학교 과제에 포함된 공부는 겹쳐 더하지 않습니다.]]))
#v(4mm)
#note[#text(size:9pt)[가정 학습 시간은 분량을 나누는 시작 예시입니다. 영어·학교 과제·휴식까지 함께 보고 조정합니다. 내신 준비 약 3주에는 학교 범위와 서술형·오답을 먼저 보고, 남은 주에는 배운 선행 범위를 복습합니다.]]

#for (n,half) in d.calendar.enumerate() {
 fresh()
 section-head("05 / MONTHLY PLAN · "+str(n+1)+"/"+str(d.calendar.len()),half.title,sub:"같은 열의 공부는 병행합니다. 과정이 바뀌면 칸 색이 달라지며, 회색은 내신과 복습 구간입니다.")
 let cols=(35mm,)+range(half.months.len()).map(_=>1fr)
 table(columns:cols,inset:2mm,align:center+horizon,stroke:0.55pt+rule,
 table.header(repeat:true,
  table.cell(fill:fills.at(0))[#text(size:9pt,weight:"bold")[함께 공부할 과정]],
  ..half.months.map(m=>table.cell(fill:fills.at(0))[#text(size:8pt,fill:muted)[#m.year 년 · #m.quarter 분기] #linebreak() #text(size:10pt,weight:"bold")[#m.gradeLabel · #m.month 월]])),
 ..half.rows.map(row=>{
  (table.cell(fill:paper)[#text(size:9pt,weight:"bold",row.label)],)+row.cells.map(cell=>table.cell(colspan:cell.span,fill:if cell.exam {rgb("e6e7ed")}else{fills.at(cell.tone)},breakable:false)[#text(size:8.3pt,cell.text)])
 }).flatten())
 v(3mm)
 text(size:8pt,fill:muted)[표의 날짜는 계획입니다. 월 중간에 교재의 역할이 바뀌는 달은 두 과정을 함께 적었습니다. 상세한 기간·공부 방법은 뒤의 교재별 표에서 확인합니다.]
}

#for lane in r.lanes {
 fresh()
 section-head("06 / COURSE DETAILS",lane.label+" · 교재와 공부 방법",sub:lane.at("current",default:"현재 진도 확인 후 조정"))
 if lane.at("note",default:"")!="" {text(size:9pt,fill:muted,lane.note);v(3mm)}
 table(columns:(44mm,65mm,1fr),inset:if lane.id=="calc" {1.4mm}else{2.1mm},stroke:0.5pt+rule,align:center+horizon,
 table.header(repeat:true,
  table.cell(fill:fills.at(0))[#text(size:9pt,weight:"bold")[#lane.label · 시기]],
  table.cell(fill:fills.at(0))[#text(size:9pt,weight:"bold")[교재·범위]],
  table.cell(fill:fills.at(0))[#text(size:9pt,weight:"bold")[공부 방법과 확인할 점]]),
 ..lane.blocks.enumerate().map(((i,b))=>{
  let fill=if b.at("kind",default:"")=="exam" {rgb("e6e7ed")}else{fills.at(calc.rem(i,4))}
  (table.cell(fill:fill,breakable:false)[#text(size:8.7pt)[#b.startLabel #linebreak() - #b.endLabel]],
   table.cell(fill:fill,breakable:false)[#text(size:9.5pt,weight:"semibold",b.title)],
   table.cell(fill:fill,breakable:false)[#text(size:9pt,b.at("method",default:lane.at("method",default:"")))])
 }).flatten())
}

#fresh()
#section-head("07 / CHECKPOINTS", "다음 공부를 정할 때 확인하겠습니다.")
#for (i,item) in r.front.priorities.enumerate() {note([#text(size:10pt,fill:purple)[#numbering("01",i+1)] #h(3mm) #text(size:11pt,weight:"bold",item.title) #v(2mm) #item.text]);v(2mm)}
#v(1mm)
#text(size:11pt,weight:"bold")[고1 과학까지 이어갈 때]
#v(2mm)
#for a in p.scienceOutlook {
 let end = int(a.end)-1
 para(a.book+" · "+a.startLabel+" - "+a.endLabel+" · 실제 공부 6개월")
}
#text(size:9pt,fill:muted)[하이탑 통합과학은 기본 개념·대표 탐구·기본 유형부터 다룹니다. 첫 공부에 고난도 심화까지 모두 마치는 계획은 아닙니다. 통합과학 2는 월별 표의 마지막인 2030년 7월 이후에도 겨울까지 이어집니다.]

#fresh()
#section-head("08 / PARENT QUESTIONS", "이 계획에서, 부모님이 궁금하실 점")
#for (i,q) in r.questions.enumerate() {
 block(breakable:false,inset:(bottom:4mm))[
  #line(length:100%,stroke:0.4pt+rule) #v(3mm)
  #grid(columns:(9mm,1fr),gutter:3mm,
   [#text(size:12pt,fill:purple,weight:"bold")[Q#(i+1)]],
   [#text(size:12pt,weight:"bold",q.question) #v(2mm) #text(size:10pt,q.answer)])
 ]
}

#fresh()
#section-head("09 / PLAN NOTES", "일정을 읽는 기준과, 조정할 부분")
#for t in r.assumptions {para(t)}
#v(4mm)
#note[#text(size:12pt,weight:"bold")[이번 표에 넣지 않은 현재 정보] #v(3mm) 현재 사고력 교재와 국어·과학의 실제 진도는 확인 전입니다. 해당 영역의 책은 제안 교재이며, 이미 공부했다는 기록으로 표시하지 않습니다. 학원 반 배정 후에는 실제 진도와 과제량에 맞춰 중복되는 교재를 정리합니다.]
#v(6mm)
#grid(columns:(24mm,1fr),gutter:5mm,
 [#image("/roadmap/v31/assets/math-docssam/docssam-math-A1-mouth-closed.png",width:22mm,height:34mm,fit:"contain")],
 [#v(5mm) #text(font:"Nanum Pen Script",size:22pt)[책을 마친 날짜보다, 배운 문제를 혼자 해결하는 모습을 함께 보겠습니다.]
 #v(3mm) #text(size:9pt,fill:muted)[독쌤 · GFIELD 학습 설계]])
