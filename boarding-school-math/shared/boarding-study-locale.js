(function () {
  "use strict";
  const supported = ["ko", "en", "zh-Hans"];
  const key = "gfield-boarding-locale:v1";
  const params = new URLSearchParams(location.search);
  if (params.get("locale") === "en-SG") params.set("locale", "en");
  let saved;
  try { saved = localStorage.getItem(key); } catch (_error) {}
  let locale = supported.includes(params.get("locale")) ? params.get("locale") : supported.includes(saved) ? saved : "ko";
  const dictionary = {
    "내 공부": ["My study", "我的学习"],
    "교과": ["School maths", "校内数学"],
    "경시": ["Competitions", "数学竞赛"],
    "교과와 경시, 내가 고른 순서대로 공부해요.": ["Study school maths and competitions in your chosen order.", "按自己安排的顺序学习校内数学和竞赛数学。"],
    "공부 담기": ["Add study", "添加学习内容"],
    "열어 본 공부": ["Recently opened", "最近打开"],
    "목록과 순서는 이 브라우저에 저장돼요.": ["Your list and order are saved in this browser.", "学习清单和顺序保存在当前浏览器中。"],
    "내가 담은 공부": ["My study list", "我的学习清单"],
    "공부할 단원이나 경시를 담아 보세요.": ["Add a unit or competition to start.", "先添加一个单元或竞赛。"],
    "무엇을 공부할까요?": ["What would you like to study?", "你想学什么？"],
    "공부 종류": ["Study type", "学习类型"],
    "교과 단원": ["School maths units", "校内数学单元"],
    "경시 기출": ["Past competition papers", "竞赛历年真题"],
    "경시 주제": ["Competition topics", "竞赛专题"],
    "학년·과정": ["Grade or course", "年级或课程"],
    "대회": ["Competition", "竞赛"],
    "연도": ["Year", "年份"],
    "시험형": ["Paper", "试卷"],
    "경시 공부": ["Competition study", "竞赛学习"],
    "대회 기출과 공부하고 싶은 주제를 골라 담아요.": ["Choose past papers and topics for your study list.", "选择历年真题和想学的专题，加入学习清单。"],
    "교과 단원이나 관심 있는 대회부터 골라 보세요.": ["Start with a school maths unit or a competition.", "先选一个校内数学单元或感兴趣的竞赛。"],
    "교과 고르기": ["Choose school maths", "选择校内数学"],
    "경시 고르기": ["Choose a competition", "选择竞赛"],
    "단원 진단은 한국어로 제공돼요.": ["The unit check is currently in Korean.", "单元诊断目前使用韩语。"],
    "단원 진단 풀기": ["Take the unit check", "做单元诊断"],
    "이어서 공부하기": ["Continue studying", "继续学习"],
    "공부 시작하기": ["Start studying", "开始学习"],
    "아직 없어요": ["Nothing yet", "暂无记录"],
    "지금 고른 공부": ["Selected study", "当前选择"],
    "다음 공부": ["Up next", "接下来学"],
    "공부를 더 담아 보세요": ["Add another study item", "再添加一项学习内容"],
    "학년별 보딩 로드맵 보기": ["View the grade roadmap", "查看年级学习路线"],
    "위로": ["Move up", "上移"],
    "아래로": ["Move down", "下移"],
    "먼저 하기": ["Study first", "优先学习"],
    "빼기": ["Remove", "移出清单"],
    "학습 자료를 열면 여기에 남아요.": ["Materials you open will appear here.", "打开过的学习资料会显示在这里。"],
    "담았어요 · 목록 보기": ["Added · View list", "已添加 · 查看清单"],
    "내 공부에 담기": ["Add to my study", "加入我的学习"],
    "열기": ["Open", "打开"],
    "이 대회의 주제별 자료를 준비하고 있어요.": ["Topic practice for this competition is being prepared.", "该竞赛的专题练习正在准备中。"],
    "매쓰 캥거루 연습 열기": ["Open Kangaroo practice", "打开袋鼠数学练习"],
    "단일 회차": ["Single paper", "单场试卷"],
    "연도는 나중에 고르기": ["Choose a year later", "稍后选择年份"],
    "분수의 나눗셈": ["Division of fractions", "分数除法"],
    "소수와 계산": ["Decimal calculations", "小数运算"],
    "음수와 좌표": ["Negative numbers and coordinates", "负数与坐标"],
    "비와 비율": ["Ratios and rates", "比与比率"],
    "문자와 식": ["Variables and expressions", "字母与代数式"],
    "방정식과 부등식": ["Equations and inequalities", "方程与不等式"],
    "두 양의 관계": ["Relationships between quantities", "两个量之间的关系"],
    "도형과 넓이": ["Shapes and area", "图形与面积"],
    "자료 읽기": ["Reading data", "读取数据"],
    "자료 요약": ["Summarising data", "数据概括"],
    "유리수의 연산": ["Operations with rational numbers", "有理数运算"],
    "비례 관계": ["Proportional relationships", "正比例关系"],
    "식과 대수": ["Expressions and algebra", "代数式与代数"],
    "수와 정수론": ["Numbers and number theory", "数与数论"],
    "기하": ["Geometry", "几何"],
    "경우의 수": ["Counting", "计数"],
    "경우의 수와 확률": ["Counting and probability", "计数与概率"],
    "확률": ["Probability", "概率"],
    "함수와 삼각함수": ["Functions and trigonometry", "函数与三角学"],
    "매쓰 캥거루": ["Math Kangaroo", "袋鼠数学"],
    "경시 연습": ["Competition practice", "竞赛练习"],
    "개념과 단원 연습": ["Concepts and unit practice", "概念学习与单元练习"],
    "지필드 개념 수업과 단원 연습": ["GFIELD concept lessons and unit practice", "GFIELD概念课程与单元练习"],
    "연도와 회차 고르기": ["Choose a year and paper", "选择年份和场次"],
    "원본 시험지 · 답 입력 · 결과와 풀이": ["Original paper · Enter answers · Results and solutions", "原卷 · 输入答案 · 结果与解析"],
    "지필드 문제로 개념과 풀이 연습": ["Practise concepts with GFIELD problems", "用GFIELD题目练习概念与解题方法"],
    "자체 문제로 유형 연습": ["Practise with GFIELD problems", "用GFIELD原创题练习"],
    "본문으로 바로가기": ["Skip to content", "跳到正文"],
    "내 공부 홈": ["My study home", "我的学习首页"],
    "주요 탐색": ["Main navigation", "主导航"],
    "학습 계획": ["Study plan", "学习计划"],
    "홈": ["Home", "首页"],
    "G·MAP · 보딩스쿨 수학 성장 지도": ["G·MAP · Boarding maths roadmap", "G·MAP · 寄宿学校数学学习路线"],
    "수업·연습 화면은 한국어로 제공돼요.": ["Lessons and practice are currently in Korean.", "课程和练习界面目前使用韩语。"],
    "기출 채점 화면은 한국어로 제공돼요.": ["The paper review interface is currently in Korean.", "真题批改界面目前使用韩语。"],
    "언어": ["Language", "语言"],
    "저장한 목록을 읽을 수 없어요. 브라우저 저장 설정을 확인한 뒤 새로고침해 주세요.": ["Cannot read your list. Check browser storage settings and reload.", "无法读取清单。请检查浏览器存储设置后刷新。"],
    "목록을 저장하지 못했어요. 브라우저 저장 공간과 설정을 확인해 주세요.": ["Cannot save your list. Check browser storage space and settings.", "无法保存清单。请检查浏览器存储空间和设置。"],
    "목록을 다시 읽지 못했어요. 새로고침해 주세요.": ["Cannot reload your list. Refresh this page.", "无法重新读取清单。请刷新页面。"]
  };
  function text(value) {
    if (!value || locale === "ko") return value;
    const index = locale === "en" ? 0 : 1;
    if (dictionary[value]) return dictionary[value][index];
    const patterns = [
      [/^(.*)을 내 공부에 담았어요\.$/, ["Added {x} to your study list.", "已将{x}加入学习清单。"]],
      [/^(.*)을 골랐어요\.$/, ["Selected {x}.", "已选择{x}。"]],
      [/^(.*)을 위로 옮겼어요\.$/, ["Moved {x} up.", "已将{x}上移。"]],
      [/^(.*)을 아래로 옮겼어요\.$/, ["Moved {x} down.", "已将{x}下移。"]],
      [/^(.*)부터 공부해요\.$/, ["Study {x} first.", "优先学习{x}。"]],
      [/^(.*)을 목록에서 뺐어요\.$/, ["Removed {x} from your list.", "已将{x}移出清单。"]],
      [/^(.*) 위로 옮기기$/, ["Move {x} up", "上移{x}"]],
      [/^(.*) 아래로 옮기기$/, ["Move {x} down", "下移{x}"]],
      [/^(.*) 목록에서 빼기$/, ["Remove {x} from list", "将{x}移出清单"]]
    ];
    for (const entry of patterns) {
      const match = value.match(entry[0]);
      if (match) return entry[1][index].replace("{x}", text(match[1]));
    }
    return value.replace("교과 · Grade ", index ? "校内数学 · 年级 " : "School maths · Grade ")
      .replace("교과 · 과정별", index ? "校内数学 · 课程" : "School maths · Course")
      .replace(" · 주제 연습", index ? " · 专题练习" : " · Topic practice")
      .replace(" · 지필드 연습", index ? " · GFIELD练习" : " · GFIELD practice")
      .replace(/ 기출$/, index ? " 历年真题" : " past papers")
      .replace("매쓰 캥거루", index ? "袋鼠数学" : "Math Kangaroo");
  }
  // Capture the original static copy once. Dynamic study elements use text() when rendered.
  const nodes = [];
  ["#my-study", "#study-contests", ".boarding-header", ".skip-link", ".site-footer"].forEach(function (selector) {
    const root = document.querySelector(selector);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      if (walker.currentNode.textContent.trim()) nodes.push([walker.currentNode, walker.currentNode.textContent]);
    }
  });
  function refresh() {
    document.documentElement.lang = locale;
    document.title = locale === "ko" ? "보딩스쿨 수학 성장 지도 | G·MAP" : locale === "en" ? "My study | G·MAP Boarding Maths" : "我的学习 | G·MAP 寄宿学校数学";
    nodes.forEach(function (entry) { entry[0].textContent = text(entry[1]); });
    document.querySelector(".boarding-header nav").setAttribute("aria-label", text("주요 탐색"));
    document.querySelector(".boarding-header .brand").setAttribute("aria-label", text("내 공부 홈"));
    document.getElementById("study-language-label").textContent = text("언어");
    document.getElementById("study-locale").value = locale;
  }
  function set(value) {
    if (!supported.includes(value)) return;
    locale = value;
    try { localStorage.setItem(key, value); } catch (_error) {}
    const url = new URL(location.href);
    url.searchParams.set("locale", value);
    history.replaceState(null, "", url);
    refresh();
    window.dispatchEvent(new Event("gfield-study-locale"));
  }
  window.GFIELDStudyLocale = { text: text, current: function () { return locale; }, refresh: refresh, set: set };
  document.getElementById("study-locale").addEventListener("change", function (event) { set(event.target.value); });
  refresh();
})();
