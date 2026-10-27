import { create } from "zustand";
import type { RoomRole, SceneSnapshot, Token } from "@dnd/shared";
export type Tool = "move" | "brush" | "eraser";
interface GameState { role: RoomRole; playerId?: string; snapshot: SceneSnapshot; selectedTokenId?: string; tool: Tool; eraserRadius: number; setSession: (role: RoomRole, playerId?: string) => void; setSnapshot: (snapshot: SceneSnapshot) => void; selectToken: (id?: string) => void; setTool: (tool: Tool) => void; setEraserRadius: (radius: number) => void; }
const emptySnapshot: SceneSnapshot = { tokens: [], drawings: [], combat: { round: 0, currentTurnIndex: 0, participantIds: [], status: "idle" }, diceLogs: [] };
export const useGameStore = create<GameState>((set) => ({ role: "dm", snapshot: emptySnapshot, tool: "move", eraserRadius: 16, setSession: (role, playerId) => set({ role, playerId }), setSnapshot: (snapshot) => set({ snapshot }), selectToken: (selectedTokenId) => set({ selectedTokenId }), setTool: (tool) => set({ tool }), setEraserRadius: (eraserRadius) => set({ eraserRadius }) }));
export function selectedToken(snapshot: SceneSnapshot, id?: string): Token | undefined { return snapshot.tokens.find((token) => token.id === id); }
