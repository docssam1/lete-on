#let d=json(sys.inputs.at("data"))
#let p=d.plan
#let r=d.report
#let ink=rgb("302348")
#let muted=rgb("75697f")
#let purple=rgb("75509e")
#let rule=rgb("d7cce2")
#let fills=(rgb("f0e8fa"),rgb("ddceed"),rgb("f9f4fd"),rgb("f4f3f6"))
#set document(title:p.title,author:"GFIELD",description:"2026년 6세 11월부터 초2 11월 황소 도전까지의 학습 설계")
#set text(font:"Pretendard Variable",lang:"ko",size:10pt,fill:ink)
#set par(leading:0.6em,justify:false)
#set page(width:297mm,height:210mm,margin:(x:16mm,top:17mm,bottom:16mm),header:context if counter(page).get().first()>1 [#text(size:8pt,weight:"bold")[GFIELD] #h(4mm) #text(size:8pt,fill:muted,p.title)],footer:context [#line(length:100%,stroke:0.4pt+rule) #v(1mm) #text(size:7pt,fill:muted)[2026.11.02 설계 · 실제 수업 배정과 풀이를 보고 조정합니다.] #h(1fr) #text(size:8pt,fill:purple)[#counter(page).display("1")]])
#let fresh()=pagebreak(weak:true)
#let head(title,sub:none)={heading(level:1,numbering:none,outlined:true,bookmarked:true)[#text(size:24pt,weight:"bold",title)];v(2mm);if sub!=none {text(size:9pt,fill:muted,sub);v(4mm)}}
#let note(body)=block(width:100%,inset:4mm,radius:3mm,fill:fills.at(0),stroke:0.5pt+rule)[#body]
#let para(body,hand:false)={if hand {text(font:"Nanum Pen Script",size:17pt,body)}else{body};parbreak();v(1mm)}
#let calendar(half,rows)=table(columns:(38mm,)+range(half.months.len()).map(_=>1fr),inset:1.8mm,align:center+horizon,stroke:0.6pt+rule,
 table.header(repeat:true,table.cell(fill:fills.at(0))[#text(size:9pt,weight:"bold")[함께 공부할 과정]],..half.months.map(m=>table.cell(fill:fills.at(0))[#text(size:8pt,fill:muted)[#m.year 년] #linebreak() #text(size:10pt,weight:"bold")[#m.gradeLabel #m.month 월]])),
 ..rows.map(row=>{if "group" in row {(table.cell(colspan:half.months.len()+1,fill:if row.type=="soma"{rgb("cce6da")}else if row.type=="fields"{rgb("f4dfa9")}else{rgb("dfd0f0")},stroke:(top:1.5pt+purple,bottom:0.7pt+rule),inset:2mm)[#text(size:10pt,weight:"bold")[#row.group#if row.type!="own" [ · 학원 비교]]],)} else {(table.cell(fill:rgb("f7f4fa"))[#text(size:9pt,weight:"bold",row.label)],)+row.cells.map(cell=>table.cell(colspan:cell.span,fill:if row.type=="soma" {(rgb("e7f3ed"),rgb("cce6da"),rgb("f1f8f4"),rgb("f4f3f6")).at(cell.tone)}else if row.type=="fields" {(rgb("fff1d0"),rgb("f4dfa9"),rgb("fff8e9"),rgb("f4f3f6")).at(cell.tone)}else{fills.at(cell.tone)},breakable:false)[#text(size:8.5pt,cell.text)])}}).flatten())
#image("/roadmap/demo2/assets/gfield-logo.svg",width:37mm)
#v(3mm)
#text(size:15pt,fill:purple)[성공하는 공부습관을 위한 학습 로드맵]
#v(3mm)
#text(size:29pt,weight:"bold")[지필드 6세 국가대표2]
#v(2mm)
#text(size:19pt)[초2 11월 황소 초등 선발 도전까지]
#v(3mm)
#block(width:100%,height:65mm,clip:true,radius:5mm)[#image("/roadmap/demo2/assets/learning-landscape-20261023.png",width:100%,height:65mm,fit:"cover")]
#v(3mm)
#grid(columns:(1fr,1fr,1fr),gutter:7mm,
 [#text(size:8pt,fill:muted)[설계 시작] #v(2mm) #text(size:13pt,weight:"bold")[2026년 6세 11월]],
 [#text(size:8pt,fill:muted)[먼저 살펴볼 목표] #v(2mm) #text(size:13pt,weight:"bold")[12월 필즈 수업 적응·선택]],
 [#text(size:8pt,fill:muted)[함께 보는 과정] #v(2mm) #text(size:13pt,weight:"bold")[사고력·교과·연산·영어]])
#v(4mm)
#text(size:8pt,fill:muted)[초2 11월 황소 초등 선발 도전까지 이어가는 반별 설계입니다. 학원 비교표는 수강 신청이나 합격 판정을 뜻하지 않습니다.]

#fresh()
#head("독쌤의 전체 총평")
#grid(columns:(29mm,1fr),gutter:7mm,
 [#image("/roadmap/v31/assets/math-docssam/docssam-math-A1-mouth-closed.png",height:38mm,fit:"contain")],
 [#text(font:"Nanum Pen Script",size:23pt)[12월에는 새 수업에 편안히 적응하면서,]
 #linebreak() #text(font:"Nanum Pen Script",size:23pt)[이미 시작한 교과를 차분히 마무리하겠습니다.]
 #v(4mm) #highlight(fill:rgb("fff0ae"))[교과 2-1의 2단원 완료 · 필즈 베이직 상권 완료]
 #v(3mm) #text(size:10pt)[교과는 소마 챌린지 이후 프리미어 3반(P3)을 준비할 때 비교하는 범위(L3)입니다. 같은 달 L2는 2-2, L1은 3-1을 공부하는 예시입니다.]])
#v(4mm)
#for t in r.front.prose {para(t,hand:true)}
#v(3mm)
#note[#text(weight:"bold")[12월 수강 선택] #v(2mm) 소마와 필즈 병행을 기본으로 잡지 않습니다. 교과 선행과 연산이 되어 있다면 소마를 휴원하고 필즈가 맞는지 경험한 뒤 한 곳을 중심으로 정하겠습니다.]

#fresh()
#head("현재 공부에서 이어지는 로드맵",sub:"12월은 필즈 수업 적응과 수강 선택, 7세에는 교과와 사고력을 함께 이어갑니다.")
#block(width:100%,height:105mm,clip:true,radius:4mm)[
 #image("/roadmap/demo2/assets/learning-landscape-20261023.png",width:100%,height:105mm,fit:"cover")
 #place(left+bottom,dx:3mm,dy:-6mm,block(width:62mm,inset:4mm,fill:white,radius:3mm,stroke:0.6pt+rule)[#text(size:9pt,fill:muted)[현재 · 6세 11월] #v(2mm) #text(size:13pt,weight:"bold")[베이직 상권 완료] #v(1mm) 교과 2-1 · 2단원 완료])
 #place(left+top,dx:64mm,dy:25mm,block(width:62mm,inset:4mm,fill:white,radius:3mm,stroke:0.6pt+rule)[#text(size:9pt,fill:muted)[6세 12월] #v(2mm) #text(size:13pt,weight:"bold")[필즈 적응·수강 선택] #v(1mm) 교과 2-1 남은 단원 마무리])
 #place(left+bottom,dx:130mm,dy:-17mm,block(width:62mm,inset:4mm,fill:white,radius:3mm,stroke:0.6pt+rule)[#text(size:9pt,fill:muted)[7세 1~6월] #v(2mm) #text(size:13pt,weight:"bold")[1031 입문 B부터] #v(1mm) 교과 2-2 → 3-1])
 #place(right+top,dx:-3mm,dy:6mm,block(width:62mm,inset:4mm,fill:white,radius:3mm,stroke:0.6pt+rule)[#text(size:9pt,fill:muted)[초2 여름 ~ 11월] #v(2mm) #text(size:13pt,weight:"bold")[황소 선발 대비] #v(1mm) 3% 1과정 이후 모의·풀이 점검])
]
#v(5mm)
#grid(columns:(1fr,1fr),gutter:6mm,
 note([#text(weight:"bold")[현재 연산] #v(2mm) 기적의 계산법 3권을 마쳤으니 4권부터 이어갑니다. 학원 연산과 겹치는 날에는 해당 과제로 대체합니다.]),
 note([#text(weight:"bold")[현재 영어] #v(2mm) SR GE 3점대 초반입니다. Nate the Great · Henry and Mudge로 읽기를 이어가고, 1월부터 Magic Tree House 본편을 한 장씩 읽겠습니다.]))
#v(3mm)
#text(size:8pt,fill:muted)[지필드 정규 과정은 12월 베이직 마무리 → 1월 1031 입문 B입니다. 소마 A·필즈 E1 운영표는 별도 비교입니다.]

#fresh()
#head("교과 꺾은선으로 보면",sub:"2-1의 약 1/3 지점에서 출발해 초등 교과·심화를 마치고 초2 11월 황소 도전을 준비합니다.")
#image(sys.inputs.at("graph"),width:100%,height:99mm,fit:"contain")
#v(4mm)
#grid(columns:(1fr,1fr),gutter:6mm,
 note([#text(weight:"bold",fill:purple)[보라색 · 이번 교과 계획] #v(2mm) 12월 교과 2-1을 마치고 한 학기 약3개월로 이어갑니다. 최상위 수학은 한 학기 뒤에서 병행해 초2 6월까지 6-2 심화를 정리하고 황소 대비로 연결합니다.]),
 note([#text(weight:"bold",fill:rgb("248d83"))[초록 점선 · 소마 A 교과 부교재] #v(2mm) 소마 A 토2시 운영표의 디딤돌 기본 교과 일정입니다. 현재 공부와 비교하며 수업의 역할과 겹치는 범위를 살펴봅니다.]))
#v(4mm)
#text(size:9pt,fill:muted)[교과가 앞서더라도 사고력 풀이와 수업 적응은 따로 봅니다. 필즈의 더클래식·입문·실력 과정을 교과 학기로 환산하지 않았습니다.]

#for half in d.halves {
 fresh();head("소마 A · 필즈 E1 · 우리 반 월별 비교",sub:half.title)
 calendar(half,half.combined)
 v(3mm)
 text(size:8pt,fill:muted)[소마 A: 라이즈 → 초급 6권 → 중급 8권 → 고급 10권. 초급 12개월·중급 12개월·고급 5개월로 이어가는 비교 계획입니다. 초급 이후도 같은 과정 순서로 연결하며, 실제 반 진도에 맞춰 조정합니다.]
 v(2mm)
 text(size:8pt,fill:muted)[우리 반은 베이직 → 1031 입문 B부터 → 초급 → 중급으로 공부합니다. 필즈 E1의 더클래식·필즈 입문·실력과는 구분합니다. 경시 대비·방학특강은 기본 비교표에서 제외하고, 직전 정규 과정의 적용·복습으로 표시했습니다.]

}

#for half in d.halves {
 fresh();head("우리 반 교재·월별 병행표",sub:half.title)
 calendar(half,half.own)
 v(6mm)
 note([#text(weight:"bold")[이 시기에 함께 공부할 수학] #v(2mm) #text(size:9pt,half.mathNote)])
 v(4mm)
 grid(columns:(1fr,1fr),gutter:6mm,
 [#text(size:11pt,weight:"bold")[지필드 정규 사고력] #v(2mm) #text(size:9pt,half.thinkingNote)],
 [#text(size:11pt,weight:"bold")[영어·원서] #v(2mm) #text(size:9pt,half.englishNote)])
 v(4mm)
 text(size:8pt,fill:muted)[학원 비교표의 교재와 지필드 정규 교재는 서로 다른 과정입니다. 실제 과제량을 보고 분량을 조정하며, 앞 과정의 풀이를 확인한 뒤 다음 과정으로 넘어갑니다.]

}

#fresh()
#head("초2 11월 황소 도전까지",sub:"교과 선행과 최상위 심화를 갖춘 뒤 선발 대비로 이어갑니다.")
#table(columns:(33mm,1fr,1fr),inset:4mm,stroke:0.7pt+rule,
 table.header([*시기*],[*준비할 공부*],[*수업·학원 조정*]),
 [초1 10~12월],[최상위 수학 5-2 · 교과 6-1],[1031 중급의 남은 영역과 교과 응용 연결],
 [초1 마치는 1월 - 초2 6월],[3% 올림피아드 1과정 · 6개월],[교과 6-2 이후 초등 계통 대수 심화, 최상위 수학 6-2 정리],
 [초2 7~8월],[황소 대비 개념·문제 해결, 취약 단원 보완],[8월에는 소마·필즈 휴원을 검토해 대비 시간 확보],
 [초2 9~10월],[모의 유형·조건 읽기·시간 배분·풀이 마무리],[새 문제집을 늘리기보다 대비 과제의 풀이 점검],
 [초2 11월],[황소 초등 선발 도전],[그해 접수·평가일과 지원 반을 확인하고 결과 후 수강 계획 조정])
#v(6mm)
#note[교과가 빠르다고 선발 결과가 정해지는 것은 아닙니다. 문제의 조건을 놓치지 않고, 스스로 생각한 풀이를 끝까지 완성하는 모습을 보며 준비하겠습니다.]

#fresh()
#head("한 주의 공부와 12월 선택")
#note[#text(size:13pt,weight:"bold")[소마 외 가능한 수업일은 주2일입니다.] #v(3mm) 필즈를 주2회 다니면 가능한 두 날을 모두 사용합니다. 별도 교과 수업을 다시 주2일 더하지 않고, 교과 보완이 필요하면 이 두 날 안에서 시간표를 조정합니다.]
#v(5mm)
#for q in r.questions.slice(0,4) {block(breakable:false)[#text(size:12pt,weight:"bold",q.question) #v(2mm) #text(size:10pt,q.answer) #v(5mm)]}

#fresh()
#head("부모님이 함께 살펴볼 질문")
#for q in r.questions.slice(4) {block(breakable:false)[#text(size:11pt,weight:"bold",q.question) #v(1.5mm) #text(size:9.5pt,q.answer) #v(3mm)]}
#v(3mm)
#note[#text(weight:"bold")[이번 계획의 기준] #v(2mm) #for a in r.assumptions {text(size:8pt,a);parbreak();v(0.5mm)}]
