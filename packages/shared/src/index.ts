export const SOCKET_EVENTS = {
  connectionReady: "connection:ready", roomJoinRequest: "room:join:request", roomJoined: "room:joined", roomError: "room:error", sceneSnapshot: "scene:snapshot",
  tokenMoveRequest: "token:move:request", tokenCreateRequest: "token:create:request", tokenUpdateRequest: "token:update:request", tokenDeleteRequest: "token:delete:request",
  fogAddRequest: "fog:add:request", fogDeleteRequest: "fog:delete:request", mapSetRequest: "map:set:request", drawingSegmentRequest: "drawing:segment:request", drawingSegment: "drawing:segment", drawingAddRequest: "drawing:add:request", drawingClearRequest: "drawing:clear:request", combatStartRequest: "combat:start:request", combatTurnRequest: "combat:turn:request", combatEndRequest: "combat:end:request", diceRollRequest: "dice:roll:request"
} as const;
export type RoomRole = "dm" | "player";
export type TokenType = "player" | "monster" | "npc";
export type TokenVisibility = "public" | "dm-only";
export type Condition = "Blinded" | "Charmed" | "Deafened" | "Frightened" | "Grappled" | "Incapacitated" | "Invisible" | "Paralyzed" | "Petrified" | "Poisoned" | "Prone" | "Restrained" | "Stunned" | "Unconscious" | "Concentration";
export interface Token { id: string; name: string; type: TokenType; ownerId?: string; avatar?: string; x: number; y: number; size: number; hp: number; maxHp: number; ac: number; speed: number; conditions: Condition[]; visibility: TokenVisibility; isDead: boolean; initiative?: number; }
export interface FogArea { id: string; shape: "rectangle" | "circle"; x: number; y: number; width: number; height: number; }
export interface MapAsset { name: string; src: string; width: number; height: number; }
export interface DrawingStroke { id: string; points: number[]; color: string; size: number; }
export interface Combat { round: number; currentTurnIndex: number; participantIds: string[]; status: "idle" | "active" | "ended"; }
export interface DiceLog { id: string; userName: string; formula: string; rolls: number[]; modifier: number; total: number; visibility: "public" | "dm-only"; createdAt: string; }
export interface SceneSnapshot { tokens: Token[]; fog: FogArea[]; map?: MapAsset; drawings: DrawingStroke[]; combat: Combat; diceLogs: DiceLog[]; }
export interface JoinRoomRequest { roomCode: string; role: RoomRole; playerId?: string; userName?: string; }
export interface RoomJoinedPayload { roomCode: string; role: RoomRole; socketId: string; playerId?: string; snapshot: SceneSnapshot; }
export interface RoomErrorPayload { message: string; }
export interface TokenMoveRequest { tokenId: string; x: number; y: number; }
export interface TokenCreateRequest { name: string; count: number; hp: number; ac: number; speed: number; x: number; y: number; }
export interface TokenUpdateRequest { tokenId: string; hp?: number; maxHp?: number; ac?: number; speed?: number; conditions?: Condition[]; visibility?: TokenVisibility; isDead?: boolean; initiative?: number; }
export interface FogAddRequest { shape: "rectangle" | "circle"; x: number; y: number; width: number; height: number; }
export interface DrawingSegment { strokeId: string; points: number[]; color: string; size: number; }
export interface DrawingAddRequest extends DrawingSegment {}
export interface DiceRollRequest { formula: string; visibility: "public" | "dm-only"; }
export interface ServerToClientEvents { [SOCKET_EVENTS.connectionReady]: (payload: { socketId: string }) => void; [SOCKET_EVENTS.roomJoined]: (payload: RoomJoinedPayload) => void; [SOCKET_EVENTS.roomError]: (payload: RoomErrorPayload) => void; [SOCKET_EVENTS.sceneSnapshot]: (snapshot: SceneSnapshot) => void; [SOCKET_EVENTS.drawingSegment]: (payload: DrawingSegment) => void; }
export interface ClientToServerEvents { [SOCKET_EVENTS.roomJoinRequest]: (payload: JoinRoomRequest) => void; [SOCKET_EVENTS.tokenMoveRequest]: (payload: TokenMoveRequest) => void; [SOCKET_EVENTS.tokenCreateRequest]: (payload: TokenCreateRequest) => void; [SOCKET_EVENTS.tokenUpdateRequest]: (payload: TokenUpdateRequest) => void; [SOCKET_EVENTS.tokenDeleteRequest]: (payload: { tokenId: string }) => void; [SOCKET_EVENTS.fogAddRequest]: (payload: FogAddRequest) => void; [SOCKET_EVENTS.fogDeleteRequest]: (payload: { fogId: string }) => void; [SOCKET_EVENTS.mapSetRequest]: (payload: MapAsset) => void; [SOCKET_EVENTS.drawingSegmentRequest]: (payload: DrawingSegment) => void; [SOCKET_EVENTS.drawingAddRequest]: (payload: DrawingAddRequest) => void; [SOCKET_EVENTS.drawingClearRequest]: () => void; [SOCKET_EVENTS.combatStartRequest]: () => void; [SOCKET_EVENTS.combatTurnRequest]: (payload: { direction: 1 | -1 }) => void; [SOCKET_EVENTS.combatEndRequest]: () => void; [SOCKET_EVENTS.diceRollRequest]: (payload: DiceRollRequest) => void; }
