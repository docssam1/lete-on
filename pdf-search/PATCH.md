# PATCH: algebra2-gemini-proxy-v2 — /pdf-search 엔드포인트 추가

## 대상
- Cloud Run 서비스: `algebra2-gemini-proxy-v2` (asia-northeast3, 프로젝트 `gen-lang-client-0794247388`)
- 기존 정상 엔드포인트(`/identify-chat` 등)는 건드리지 말 것. 아래 조각만 추가.

## 변경 요약
- POST `/pdf-search` 추가: `{ query, start }` 수신 → Google Custom Search API 호출(`filetype:pdf` 강제) → `{ items, totalResults }` 반환
- API 키/CX는 환경변수로만: `CSE_API_KEY`, `CSE_CX` (코드 하드코딩 금지)
- CORS: 기존 프록시의 CORS 설정 그대로 재사용 (lete-on.gfieldacademy.net 허용)

## 추가 조각 (Node/Express 기준 — 프록시가 Python이면 동일 로직으로 변환)

```javascript
// === PDF SEARCH (Custom Search JSON API) ===
app.post("/pdf-search", async (req, res) => {
  try {
    const { query, start = 1 } = req.body || {};
    if (!query) return res.status(400).json({ error: "query required" });

    const url = new URL("https://www.googleapis.com/customsearch/v1");
    url.searchParams.set("key", process.env.CSE_API_KEY);
    url.searchParams.set("cx", process.env.CSE_CX);
    url.searchParams.set("q", query + " filetype:pdf");
    url.searchParams.set("start", String(start));
    url.searchParams.set("num", "10");

    const r = await fetch(url);
    const data = await r.json();
    if (data.error) return res.status(502).json({ error: data.error.message });

    res.json({
      totalResults: data.searchInformation?.totalResults || "0",
      items: (data.items || []).map(it => ({
        title: it.title,
        link: it.link,
        snippet: it.snippet
      }))
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
```

## 배포 시 환경변수 추가
```
gcloud run services update algebra2-gemini-proxy-v2 \
  --region=asia-northeast3 \
  --update-env-vars=CSE_API_KEY=<발급키>,CSE_CX=<CX_ID>
```

## 배포 후 확인
1. `curl -X POST https://<프록시URL>/pdf-search -H "Content-Type: application/json" -d '{"query":"분수 worksheet"}'`
2. `pdf-search/index.html` 상단 `PROXY_URL` 상수를 실제 Cloud Run URL로 교체 (1줄 수정)
3. https://lete-on.gfieldacademy.net/pdf-search/ 접속 테스트
