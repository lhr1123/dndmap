import { create } from "zustand";
import type { GridConfig, MapAsset, Viewport } from "../features/battle-map/types";

const defaultGrid: GridConfig = { size: 70, offsetX: 0, offsetY: 0, distance: 5, visible: true };
const defaultViewport: Viewport = { x: 0, y: 0, scale: 1 };

interface BattleMapState {
  map: MapAsset | null;
  grid: GridConfig;
  viewport: Viewport;
  setMap: (map: MapAsset) => void;
  updateGrid: (update: Partial<GridConfig>) => void;
  setViewport: (viewport: Viewport) => void;
  resetGrid: () => void;
}

export const useBattleMapStore = create<BattleMapState>((set) => ({
  map: null, grid: defaultGrid, viewport: defaultViewport,
  setMap: (map) => set({ map, viewport: defaultViewport }),
  updateGrid: (update) => set((state) => ({ grid: { ...state.grid, ...update } })),
  setViewport: (viewport) => set({ viewport }), resetGrid: () => set({ grid: defaultGrid })
}));
