(function (root) {
  "use strict";

  const SERIES = Object.freeze([
    Object.freeze({ key: "utilization", label: "활용 모의고사", note: "1~8회", count: 8 }),
    Object.freeze({ key: "final", label: "파이널 모의고사", note: "1~3회", count: 3 }),
    Object.freeze({ key: "last", label: "최종 모의고사", note: "1~4회", count: 4 })
  ]);
  const SLUG_RE = /^premier-(utilization|final|last)-(\d{2})$/;
  const CACHE_TTL_MS = 30000;

  function expectedSlug(seriesKey, roundNo) {
    return `premier-${seriesKey}-${String(roundNo).padStart(2, "0")}`;
  }

  function releaseStatus(value) {
    return String(value || "").trim().toLowerCase().replace(/-/g, "_");
  }

  function releaseRound(catalog, seriesKey, slug) {
    const series = Array.isArray(catalog?.series)
      ? catalog.series.find(entry => entry?.key === seriesKey)
      : null;
    return Array.isArray(series?.rounds)
      ? series.rounds.find(entry => entry?.key === slug)
      : null;
  }

  function entitledPublishedSlugs(exams) {
    const slugs = new Set();
    if (!Array.isArray(exams)) return slugs;
    exams.forEach(exam => {
      const slug = String(exam?.slug || exam?.id || "");
      const match = SLUG_RE.exec(slug);
      if (
        !match || exam?.status !== "published" || exam?.series !== match[1]
        || Number(exam?.roundNo) !== Number(match[2])
      ) return;
      slugs.add(slug);
    });
    return slugs;
  }

  function buildGroups(catalog, exams, options = {}) {
    const remoteLoaded = options.remoteLoaded === true;
    const entitled = remoteLoaded ? entitledPublishedSlugs(exams) : new Set();

    return SERIES.map(series => ({
      key: series.key,
      label: series.label,
      note: series.note,
      count: series.count,
      rounds: Array.from({ length: series.count }, (_, index) => {
        const roundNo = index + 1;
        const slug = expectedSlug(series.key, roundNo);
        const source = releaseRound(catalog, series.key, slug);
        const status = source ? releaseStatus(source.releaseStatus) : "review_pending";
        const pending = status === "review_pending";
        // 공개 카탈로그와 개인별 RLS 목록이 모두 공개 상태일 때만 링크를 만듭니다.
        // visualGate가 남아 있는 회차는 상태 표기가 잘못되어도 열지 않습니다.
        const open = remoteLoaded
          && status === "published"
          && source?.visualGate === false
          && entitled.has(slug);
        const state = pending ? "review_pending" : open ? "open" : "locked";
        return {
          slug,
          number: roundNo,
          label: String(source?.label || `${series.label} ${roundNo}회`),
          state,
          action: state === "open" ? "응시하기" : state === "review_pending" ? "검수 중" : "잠김",
          href: state === "open" ? `./mock/?exam=${encodeURIComponent(slug)}` : null
        };
      })
    }));
  }

  function canLoadRemote(config, session, api) {
    return config?.enabled === true
      && config?.features?.secureMockDelivery === true
      && session?.backend === "supabase"
      && typeof api?.listExams === "function";
  }

  function createExamLoader() {
    let owner = null;
    let promise = null;
    let exams = null;
    let cachedAt = 0;
    let version = 0;

    function reset() {
      version += 1;
      owner = null;
      promise = null;
      exams = null;
      cachedAt = 0;
    }

    function load(ownerToken, fetcher, options = {}) {
      if (!ownerToken || typeof fetcher !== "function") {
        return Promise.reject(new Error("회차 권한 확인을 시작할 수 없습니다."));
      }
      if (owner !== ownerToken) {
        version += 1;
        owner = ownerToken;
        promise = null;
        exams = null;
        cachedAt = 0;
      }
      if (promise) return promise;
      if (options.force !== true && exams && Date.now() - cachedAt < CACHE_TTL_MS) {
        return Promise.resolve(exams);
      }

      const requestOwner = ownerToken;
      const requestVersion = ++version;
      const request = Promise.resolve().then(fetcher).then(value => {
        if (!Array.isArray(value)) throw new Error("회차 목록 응답 형식이 올바르지 않습니다.");
        return value;
      });
      promise = request.then(rows => {
        if (owner === requestOwner && version === requestVersion) {
          exams = rows;
          cachedAt = Date.now();
          promise = null;
        }
        return rows;
      }, error => {
        if (owner === requestOwner && version === requestVersion) {
          exams = null;
          cachedAt = 0;
          promise = null;
        }
        throw error;
      });
      return promise;
    }

    return Object.freeze({ load, reset });
  }

  root.GFieldHFPortalCollection = Object.freeze({
    buildGroups,
    canLoadRemote,
    createExamLoader
  });
})(typeof window !== "undefined" ? window : globalThis);
