# D&D Battle Map

轻量级线上 D&D 战斗地图，面向 1 位 DM 和 4 位玩家。已完成 V1 的 Phase 0–6 开发，可进行地图布置、Token 移动、迷雾、先攻、骰子、测距和 AOE 预览。

## 技术结构

- `apps/web`：React + Vite + Zustand + React-Konva 的前端入口
- `apps/server`：Fastify + Socket.IO 服务端与 Prisma schema
- `packages/shared`：前后端共用的 Socket 事件名和协议类型

## 本地启动

1. 复制 `.env.example` 为 `.env`，并创建 `apps/server/.env`。两处的 `DATABASE_URL` 均应使用正在运行的 PostgreSQL 端口（本机 5432 被占用时使用 5433）。
2. 启动 PostgreSQL：`docker compose up -d postgres`
3. 安装依赖：`npm install`
4. 生成 Prisma Client：`npm run db:generate`
5. 启动开发环境：`npm run dev`

打开 `http://localhost:5173`，DM 与玩家输入相同房间代码加入。玩家须选择 Alaric、Theron、Mira 或 Elara；服务端只向玩家发送可见 Token，并只允许移动其所属 Token。健康检查为 `http://localhost:3001/health`。

## 验证

运行 `npm run check` 验证严格 TypeScript，运行 `npm run build` 验证生产构建。数据库可通过 `npm run prisma:migrate -w @dnd/server` 创建第一个迁移。

## 已实现功能

- Battle Canvas：浏览器本地上传 PNG/JPG/WEBP、分层画布、网格校准、缩放和中键平移。
- Token 与多人：角色 Token、DM 怪物创建/隐藏/删除/改血量/状态、服务端权限校验、Socket 快照同步和断线后重新加入。
- DM 工具：矩形迷雾、隐藏怪物、公开/私密骰子。
- 战斗：先攻输入、回合顺序、轮次推进、测距和圆形 AOE 预览。

## 当前限制

- 房间战斗状态保存在服务端内存，重启服务端会清空。
- 上传的地图只保存在上传者当前浏览器，尚未成为共享文件资源。
- AOE 当前为可视化预览，未自动计算受影响 Token。
