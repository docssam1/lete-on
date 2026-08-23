const assert = require("node:assert/strict");
const identity = require("./identity.js");

function storage(values = {}) {
  return { getItem: key => Object.prototype.hasOwnProperty.call(values, key) ? values[key] : null };
}

function resolve(overrides = {}) {
  return identity.resolve({
    localStorage: storage(),
    sessionStorage: storage(),
    search: "",
    ...overrides
  });
}

assert.deepEqual(resolve({
  session: { name: "이주원", permissions: [] }
}), {
  name: "이주원",
  source: "elementary-session",
  canEditName: false,
  isLoggedIn: true
});

assert.equal(resolve({
  session: { name: "이주원", permissions: [identity.NAME_EDIT_PERMISSION] }
}).canEditName, true);

assert.equal(resolve({
  localStorage: storage({
    "gfield-session": JSON.stringify({ name: "이주원", permissions: [identity.NAME_EDIT_PERMISSION] })
  })
}).canEditName, true);

assert.equal(resolve({
  session: { name: "이주원" },
  access: { studentNameEditors: ["이주원"] }
}).canEditName, true);

assert.equal(resolve({
  search: "?student=%EA%B9%80%EC%83%88%EB%A1%AC&nameEdit=1"
}).canEditName, false, "URL 파라미터만으로 이름 변경 권한을 얻으면 안 됩니다.");

assert.deepEqual(resolve({
  sessionStorage: storage({ gf_n: "김시윤" }),
  search: "?student=%EB%8B%A4%EB%A5%B8%EC%9D%B4%EB%A6%84"
}), {
  name: "김시윤",
  source: "fields-session",
  canEditName: false,
  isLoggedIn: true
});

assert.deepEqual(resolve({
  localStorage: storage({ "hs-student": "오지민", "hs-code": "HS-1329" })
}), {
  name: "오지민",
  source: "middle-session",
  canEditName: false,
  isLoggedIn: true
});

assert.equal(resolve({
  localStorage: storage({ "hse-session": "{broken" }),
  search: "?student=%20%20%EC%9C%A0%EB%82%98%20%20"
}).name, "유나");

console.log("Elementary identity audit passed: login name lock and admin override rules verified.");
