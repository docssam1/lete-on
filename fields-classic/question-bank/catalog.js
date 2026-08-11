export { AGE_STAGES, DOMAINS, TYPES, CURRICULUM } from "./source-data.js";

export const NUMBER_RANGES = [
  { id: "10", label: "10까지", max: 10 },
  { id: "20", label: "20까지", max: 20 },
  { id: "30", label: "30까지", max: 30 },
  { id: "50", label: "50까지", max: 50 },
  { id: "100", label: "100까지", max: 100 }
];

// 실제 필즈 시험에 연결하는 쌓기나무 유형만 노출합니다.
export const GEOMETRY_CUBE_TYPES = [
  { id: "cube-count-solid", label: "입체를 이루는 쌓기나무 전체 개수", game: "count-heights", ready: true },
  { id: "cube-different-shape", label: "같은 개수로 만든 입체 중 다른 모양", game: "find-shape", ready: false },
  { id: "cube-add-to-match", label: "목표 입체까지 더 필요한 쌓기나무", game: "copy-build", ready: true },
  { id: "cube-fill-box", label: "정육면체 상자를 채우는 데 필요한 개수", game: "fill-box", ready: true },
  { id: "cube-hidden-count", label: "보이지 않는 쌓기나무의 개수", game: "hidden-count", ready: true },
  { id: "cube-three-views", label: "앞·옆·위에서 본 쌓기나무", game: "three-views", ready: true },
  { id: "cube-tunnel", label: "구멍이 뚫린 쌓기나무의 남은 개수", game: "cube-tunnel", ready: true }
];
