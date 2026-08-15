(() => {
  const units = {
    1:"1단원 큰수",2:"6단원 규칙찾기",3:"3단원 곱셈과 나눗셈",4:"3단원 곱셈과 나눗셈",
    5:"2단원 각도",6:"2단원 각도",7:"2단원 분수의 곱셈",8:"3단원 소수의 덧셈과 뺄셈",
    9:"4단원 소수의 곱셈",10:"4단원 사각형",11:"4단원 사각형",12:"2단원 약수와 배수",
    13:"2단원 약수와 배수",14:"3단원 규칙과 대응",15:"3단원 규칙과 대응",16:"3단원 곱셈과 나눗셈",
    17:"2단원 약수와 배수",18:"2단원 약수와 배수",19:"5단원 직육면체",20:"4단원 약분과 통분",
    21:"4단원 약분과 통분",22:"5단원 분수의 덧셈과 뺄셈",23:"5단원 분수의 덧셈과 뺄셈",24:"2단원 분수의 곱셈",
    25:"6단원 다각형의 둘레와 넓이",26:"6단원 다각형의 둘레와 넓이",27:"2단원 분수의 곱셈",28:"2단원 분수의 곱셈",
    29:"2단원 소수의 나눗셈",30:"3단원 합동과 대칭",31:"4단원 비와 비율",32:"2단원 소수의 나눗셈",
    33:"2단원 소수의 나눗셈",34:"4단원 비와 비율",35:"5단원 원의 넓이",36:"6단원 직육면체의 겉넓이와 부피",
    37:"2단원 각기둥과 각뿔",38:"4단원 비례식과 비례배분",39:"4단원 소수의 곱셈",40:"3단원 합동과 대칭"
  };

  const createCatalog = () => {
    const data = window.HSMIDDLE_DATA || {};
    const questions = Array.isArray(data.questions) ? data.questions : [];
    const pageCounts = Array.isArray(data.similarPages) ? data.similarPages : [];
    return questions.map((question, index) => {
      const number = Number(question[0]);
      const totalPages = Number(pageCounts[index] || 0);
      const problemPages = Math.ceil(totalPages / 2);
      return {
        id: `diagnostic-${String(number).padStart(2, "0")}`,
        exam: "diagnostic",
        examLabel: "진단 모의고사",
        number,
        answer: question[1],
        difficulty: question[2],
        semester: question[3],
        area: question[4],
        type: question[5],
        unit: units[number] || "단원 미분류",
        questionCount: 10,
        totalPages,
        problemPages,
        solutionPages: Math.max(0, totalPages - problemPages),
        assetFolder: `../assets/similar/q${String(number).padStart(2, "0")}`,
        verified: totalPages > 0
      };
    });
  };

  window.HSMIDDLE_BANK = { units, createCatalog };
})();
