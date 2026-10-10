export interface MapAsset {
  name: string;
  src: string;
  width: number;
  height: number;
}

export interface GridConfig {
  size: number;
  offsetX: number;
  offsetY: number;
  distance: number;
  visible: boolean;
}

export interface Viewport {
  x: number;
  y: number;
  scale: number;
}
