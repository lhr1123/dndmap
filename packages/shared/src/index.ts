export const SOCKET_EVENTS = {
  connectionReady: "connection:ready", roomJoinRequest: "room:join:request", roomJoined: "room:joined", roomError: "room:error", sceneSnapshot: "scene:snapshot",
  tokenMoveRequest: "token:move:request", tokenCreateRequest: "token:create:request", tokenUpdateRequest: "token:update:request", tokenDeleteRequest: "token:delete:request",
  mapSetRequest: "map:set:request", drawingSegmentRequest: "drawing:segment:request", drawingSegment: "drawing:segment", drawingAddRequest: "drawing:add:request", drawingEraseRequest: "drawing:erase:request", drawingClearRequest: "drawing:clear:request", combatStartRequest: "combat:start:request", combatTurnRequest: "combat:turn:request", combatEndRequest: "combat:end:request", diceRollRequest: "dice:roll:request"
} as const;
export type RoomRole = "dm" | "player";
export type TokenType = "player" | "monster" | "npc";
export type TokenVisibility = "public" | "dm-only";
export type Condition = "Blinded" | "Charmed" | "Deafened" | "Frightened" | "Grappled" | "Incapacitated" | "Invisible" | "Paralyzed" | "Petrified" | "Poisoned" | "Prone" | "Restrained" | "Stunned" | "Unconscious" | "Concentration";
export interface Token { id: string; name: string; type: TokenType; ownerId?: string; avatar?: string; x: number; y: number; size: number; hp: number; maxHp: number; ac: number; speed: number; conditions: Condition[]; visibility: TokenVisibility; isDead: boolean; initiative?: number; }
export interface MapAsset { name: string; src: string; width: number; height: number; }
export interface DrawingStroke { id: string; points: number[]; color: string; size: number; }
export interface Combat { round: number; currentTurnIndex: number; participantIds: string[]; status: "idle" | "active" | "ended"; }
export interface DiceLog { id: string; userName: string; formula: string; rolls: number[]; modifier: number; total: number; visibility: "public" | "dm-only"; createdAt: string; }
export interface SceneSnapshot { tokens: Token[]; map?: MapAsset; drawings: DrawingStroke[]; combat: Combat; diceLogs: DiceLog[]; }
export interface JoinRoomRequest { roomCode: string; role: RoomRole; playerId?: string; userName?: string; }
export interface RoomJoinedPayload { roomCode: string; role: RoomRole; socketId: string; playerId?: string; snapshot: SceneSnapshot; }
export interface RoomErrorPayload { message: string; }
export interface TokenMoveRequest { tokenId: string; x: number; y: number; }
export interface TokenCreateRequest { name: string; count: number; hp: number; ac: number; speed: number; x: number; y: number; }
export interface TokenUpdateRequest { tokenId: string; hp?: number; maxHp?: number; ac?: number; speed?: number; conditions?: Condition[]; visibility?: TokenVisibility; isDead?: boolean; initiative?: number; }
export interface DrawingSegment { strokeId: string; points: number[]; color: string; size: number; }
export interface DrawingAddRequest extends DrawingSegment {}
export interface DrawingEraseRequest { x: number; y: number; radius: number; }
export function splitStrokeByCircle(stroke: DrawingStroke, cx: number, cy: number, radius: number): DrawingStroke[] {
  const r = radius + stroke.size / 2;
  const points = stroke.points;
  if (points.length < 4) return points.length === 2 && Math.hypot(points[0] - cx, points[1] - cy) <= r ? [] : [stroke];
  let minX = Infinity; let minY = Infinity; let maxX = -Infinity; let maxY = -Infinity;
  for (let index = 0; index < points.length; index += 2) { minX = Math.min(minX, points[index]); maxX = Math.max(maxX, points[index]); minY = Math.min(minY, points[index + 1]); maxY = Math.max(maxY, points[index + 1]); }
  if (minX > cx + r || maxX < cx - r || minY > cy + r || maxY < cy - r) return [stroke];
  const fragments: DrawingStroke[] = []; let current: number[] = []; let erased = false;
  const close = () => { if (current.length >= 4) fragments.push({ ...stroke, id: crypto.randomUUID(), points: current }); current = []; };
  for (let index = 0; index + 4 <= points.length; index += 2) {
    const x1 = points[index]; const y1 = points[index + 1]; const dx = points[index + 2] - x1; const dy = points[index + 3] - y1;
    const fx = x1 - cx; const fy = y1 - cy; const a = dx * dx + dy * dy; const cuts: number[] = [];
    if (a > 0) { const b = 2 * (fx * dx + fy * dy); const c = fx * fx + fy * fy - r * r; const disc = b * b - 4 * a * c; if (disc > 0) { const root = Math.sqrt(disc); for (const t of [(-b - root) / (2 * a), (-b + root) / (2 * a)]) if (t > 0 && t < 1) cuts.push(t); } }
    cuts.sort((m, n) => m - n);
    let t0 = 0;
    for (const t1 of [...cuts, 1]) {
      const ax = x1 + t0 * dx; const ay = y1 + t0 * dy; const bx = x1 + t1 * dx; const by = y1 + t1 * dy;
      if (Math.hypot((ax + bx) / 2 - cx, (ay + by) / 2 - cy) <= r) { erased = true; close(); } else { if (!current.length) current.push(ax, ay); current.push(bx, by); }
      t0 = t1;
    }
  }
  close();
  return erased ? fragments : [stroke];
}
export interface DiceRollRequest { formula: string; visibility: "public" | "dm-only"; }
export interface ServerToClientEvents { [SOCKET_EVENTS.connectionReady]: (payload: { socketId: string }) => void; [SOCKET_EVENTS.roomJoined]: (payload: RoomJoinedPayload) => void; [SOCKET_EVENTS.roomError]: (payload: RoomErrorPayload) => void; [SOCKET_EVENTS.sceneSnapshot]: (snapshot: SceneSnapshot) => void; [SOCKET_EVENTS.drawingSegment]: (payload: DrawingSegment) => void; }
export interface ClientToServerEvents { [SOCKET_EVENTS.roomJoinRequest]: (payload: JoinRoomRequest) => void; [SOCKET_EVENTS.tokenMoveRequest]: (payload: TokenMoveRequest) => void; [SOCKET_EVENTS.tokenCreateRequest]: (payload: TokenCreateRequest) => void; [SOCKET_EVENTS.tokenUpdateRequest]: (payload: TokenUpdateRequest) => void; [SOCKET_EVENTS.tokenDeleteRequest]: (payload: { tokenId: string }) => void; [SOCKET_EVENTS.mapSetRequest]: (payload: MapAsset) => void; [SOCKET_EVENTS.drawingSegmentRequest]: (payload: DrawingSegment) => void; [SOCKET_EVENTS.drawingAddRequest]: (payload: DrawingAddRequest) => void; [SOCKET_EVENTS.drawingEraseRequest]: (payload: DrawingEraseRequest) => void; [SOCKET_EVENTS.drawingClearRequest]: () => void; [SOCKET_EVENTS.combatStartRequest]: () => void; [SOCKET_EVENTS.combatTurnRequest]: (payload: { direction: 1 | -1 }) => void; [SOCKET_EVENTS.combatEndRequest]: () => void; [SOCKET_EVENTS.diceRollRequest]: (payload: DiceRollRequest) => void; }
