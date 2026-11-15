// Show the already published school guide alongside a member's counseling result.
// Newly imported reports can appear only through the approved sources in that result.
(function (g) {
  'use strict';
  const aliases = {
    gs: ['경기과고', '경기영재고', '경곽'], sshs: ['서울과고', '서울영재고', '설곽'],
    hansung: ['한성과고'], hafs: ['외대부', '용인외고', '용인한국외국어대학교부설고', 'HAFS'],
    minjok: ['민족사관고', 'KMLA'], dwfl: ['대원외국어고']
  };
  const term = value => String(value || '').normalize('NFKC').replace(/\s+/g, '').toLowerCase();
  const schoolAssessment = text => /면접|영재성검사|소집면담|창의융합평가|입학전형|입시기출|입학기출/.test(text);
  const isInterview = text => schoolAssessment(text) || /기출|출제문항|출제문제|캠프문제|구술/.test(text);
  const otherExam = text => /모의평가|모평|모의고사|학력평가|학평|수능|평가원|단원(?:평가|테스트)|중간고사|기말고사|내신기출|권별테스트|경시|올림피아드|kmo|kjmo|고[123](?:학년)?(?:[0-9]{1,2}월|기출)|[0-9]{1,2}월기출/.test(text);

  function namedSchools(text, schools) {
    const token = term(text);
    return schools.map(school => {
      const positions = [school.name, ...(aliases[school.id] || [])]
        .map(name => token.indexOf(term(name))).filter(n => n >= 0);
      return { school, at: Math.min(...positions) };
    }).filter(match => Number.isFinite(match.at)).sort((a, b) => a.at - b.at)
      .map(match => match.school);
  }

  // These official reports contain survey responses or evaluation commentary.
  // Their URLs establish the document type, but no unapproved report text is shipped.
  const reports = {
    hafs: { url: 'https://admission.hafs.hs.kr/?act=board.read&code=1415&id=50',
      year: 2023, label: '학교 영향평가 · 응시 학생이 기억한 면접 사례' },
    hana: { url: 'https://www.hana.hs.kr/board/bbsDetail.do?page=admission&bbs_idx=59660',
      year: 2026, label: '학교 영향평가 · 면접 평가 방식' }
  };

  function approvedReport(schoolId, sources, year) {
    const report = reports[schoolId];
    if (!report || (year && year !== report.year)) return null;
    const match = sources.find(row => {
      if (!row || !row.body) return false;
      const links = String(row.source || '').match(/https:\/\/[^\s<>]+/g) || [];
      return links.some(link => {
        try {
          const candidate = new URL(link.replace(/[).,]+$/, ''));
          const expected = new URL(report.url);
          // Schools can link to the same post with optional page and sort parameters.
          return candidate.origin === expected.origin && candidate.pathname === expected.pathname &&
            [...expected.searchParams].every(([key, value]) => candidate.searchParams.get(key) === value);
        } catch { return false; }
      });
    });
    return match && { ...report, body: match.body };
  }

  function yearMatches(label, year) {
    if (!year) return true;
    const years = String(label).match(/20\d{2}/g);
    return years && year >= Number(years[0]) && year <= Number(years[years.length - 1]);
  }

  function buildCards(question, options = {}) {
    const query = term(question);
    if (!isInterview(query)) return [];
    if (otherExam(query) && !schoolAssessment(query)) return [];
    const data = g.PlannerHighschoolData;
    const profiles = g.PlannerHighschoolProfiles?.profiles;
    if (!data || !profiles) return [];
    const schools = data.schools.filter(s => s.goal !== 'general' && profiles[s.id]);
    let selected = namedSchools(question, schools);
    if (!selected.length) {
      // A saved target is not evidence that a question about a different school is about it.
      if (/(?:대학|의대|서울대|연세대|고려대|카이스트|대입|[가-힣]+고(?:등학교)?(?:의|에서|는|기출|면접))/.test(query)) return [];
      const mentioned = schoolAssessment(query) ? namedSchools(options.progress, schools) : [];
      if (mentioned.length > 1) return [];
      selected = mentioned.length ? mentioned : schools.filter(s => s.id === options.schoolName);
      if (!selected.length) selected = namedSchools(options.schoolName, schools);
    }
    const requestedYear = Number(query.match(/(20\d{2})(?:학년도|년도|년)/)?.[1]) || null;
    return selected.map(school => {
      const profile = profiles[school.id];
      const papers = (profile.papers || []).filter(p => yearMatches(p.year, requestedYear));
      return {
        school, requestedYear, guide: data.sources[school.source], practice: profile.practice?.[0],
        paper: papers.find(p => p.kind === '공식 기출'), notice: papers.find(p => p.kind === '공식 면접 안내'),
        report: approvedReport(school.id, Array.isArray(options.sources) ? options.sources : [], requestedYear)
      };
    });
  }

  function render(container, question, options = {}) {
    const cards = buildCards(question, options);
    if (!container || !cards.length) return 0;
    const doc = container.ownerDocument || g.document;
    function node(tag, text, className) {
      const el = doc.createElement(tag);
      if (text) el.textContent = text;
      if (className) el.className = className;
      return el;
    }
    function link(parent, source, label) {
      if (!source || !/^https:\/\//.test(source.url)) return;
      const anchor = node('a', label);
      anchor.href = source.url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      const item = node('li');
      item.append(anchor);
      parent.append(item);
    }
    for (const { school, requestedYear, guide, practice, paper, notice, report } of cards) {
      const card = node('article', '', 'cc-source cc-interview-card');
      card.append(node('h4', school.name + ' 입학 자료'));
      const links = node('ul', '', 'cc-interview-links');
      if (paper) {
        card.append(node('p', paper.year + ' · ' + paper.stage), node('p', paper.title));
        if (school.id === 'gs' && paper.year === '2026학년도') {
          card.append(node('p', '수학 2번은 큰 정육면체를 잘랐을 때, 작은 정육면체를 색칠된 면의 수로 분류하는 문제예요.'));
        }
        link(links, paper.source, paper.year + ' 학교 공개 기출 보기');
        if (/면접|구술|캠프/.test(question) && school.goal === 'giftedSchool') {
          card.append(node('p', '위 자료는 2단계 지필 문제입니다. 면접 연습 질문은 아래에서 확인하세요.'));
        }
      } else {
        card.append(node('p', (requestedYear ? requestedYear + '학년도 ' : '') +
          '면접 기출 원문은 현재 로드맵에 수록된 자료에서 확인되지 않았어요.'));
        if (!requestedYear || requestedYear === school.year) {
          card.append(node('p', school.year + '학년도 평가 방식'), node('p', school.interview));
        }
      }
      if (report) {
        card.append(node('p', report.year + '학년도 · ' + report.label), node('p', report.body));
        link(links, report, report.year + '학년도 학교 보고서 보기');
      }
      if (notice) link(links, notice.source, notice.year + ' 면접 진행 안내');
      link(links, guide, school.year + '학년도 전형 요강');
      card.append(links);
      if (practice) {
        const group = node('section', '', 'cc-interview-practice');
        group.append(node('h5', '지필드 면접 연습 질문'), node('p', practice));
        card.append(group);
      }
      container.append(card);
    }
    return cards.length;
  }
  g.RoadmapCounselInterview = Object.freeze({ render, buildCards });
})(window);
