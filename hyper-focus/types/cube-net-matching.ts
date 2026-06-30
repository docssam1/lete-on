export type Rotation = 0 | 90 | 180 | 270;
export type GridDirection = "up" | "down" | "left" | "right";

export type SymbolKind =
  | "x"
  | "dot"
  | "grid_2x2"
  | "horizontal_stripes"
  | "vertical_divider"
  | "blank";

export interface FaceMark {
  kind: SymbolKind;

  /**
   * 원본 그림 기준 문양 방향.
   * x, dot, blank는 회전 대칭이라 0으로 고정 가능.
   */
  orientation: Rotation;

  /**
   * horizontal_stripes일 때만 사용.
   * 예: 줄 4개면 4.
   */
  stripeCount?: number;

  /**
   * vertical_divider일 때 사용.
   * 예: 중앙 세로선 1개.
   */
  lineCount?: number;
}

export interface CubeNetFace {
  faceId: string;

  /**
   * 전개도 2D 격자 좌표.
   * x: 왼쪽 -> 오른쪽
   * y: 아래 -> 위
   */
  grid: {
    x: number;
    y: number;
  };

  mark: FaceMark;

  /**
   * 원본 SVG에서 이 면을 찾기 위한 ID
   */
  svgRef?: string;
}

export interface CubeNetEdge {
  /**
   * from face 기준으로 to face가 놓인 2D 전개도 방향
   */
  from: string;
  to: string;
  direction: GridDirection;
}

export interface FaceFrame {
  /**
   * 접었을 때 면이 바라보는 방향
   */
  normal: [number, number, number];

  /**
   * 그 면 위에서의 오른쪽 방향
   */
  localRight: [number, number, number];

  /**
   * 그 면 위에서의 위쪽 방향
   */
  localUp: [number, number, number];
}

export interface ChoiceObservedFace {
  /**
   * 보기 그림에서 보이는 면의 역할
   */
  role: "top" | "front" | "left" | "right";

  /**
   * 보기에서 실제로 보이는 문양
   */
  observedMark: FaceMark;

  /**
   * 동일 문양 면이 둘 이상일 수 있으므로
   * 초기에는 null 허용.
   * 엔진이 전개도 구조와 회전으로 faceId를 결정.
   */
  resolvedFaceId: string | null;
}

export interface CubeChoiceView {
  choiceId: number;

  /**
   * 보기 그림에서 실제로 관찰되는 3면
   */
  observedFaces: [
    ChoiceObservedFace,
    ChoiceObservedFace,
    ChoiceObservedFace
  ];

  /**
   * 엔진이 전개도를 접어 판정한 뒤 채움
   */
  resolvedLayout: {
    top: string | null;
    front: string | null;
    left: string | null;
    right: string | null;
  };

  /**
   * 보기의 세 면이 실제 정육면체 한 꼭짓점에
   * 함께 올 수 있는지 판정한 결과
   */
  isValid: boolean | null;

  invalidReason: string | null;

  /**
   * invalid일 때 어떤 규칙에서 걸렸는지
   */
  invalidRule?:
    | "opposite_faces"
    | "orientation_mismatch"
    | "impossible_vertex_triplet"
    | "unknown";
}

export interface CubeNetMatchingPayload {
  orientationBasis: {
    symbol0deg: "image_up";
    rotationDirection: "clockwise";
    gridXAxis: "right";
    gridYAxis: "up";
  };

  net: {
    faces: CubeNetFace[];
    adjacency: CubeNetEdge[];

    /**
     * 접기 계산 결과.
     * 엔진 재계산값과 비교 검증 가능.
     */
    foldedFaceFrames?: Record<string, FaceFrame>;

    /**
     * 예: [["faceA", "faceB"], ...]
     */
    oppositeFacePairs?: [string, string][];
  };

  choices: CubeChoiceView[];

  expectedValidChoices: number[] | null;
}
