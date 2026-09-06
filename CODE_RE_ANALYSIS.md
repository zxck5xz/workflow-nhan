# Codebase Analysis Report: Project Engineering Reverse Engineering
*Generated on: 2026-06-01 20:34:14*

## Executive Summary
This report applies the 'Android Reverse Engineering' workflow logic to the current project's web/node architecture.

## 1. Manifest & Architecture Analysis (Project Mapping)
- **Module:** `package.json` (Name: workflow-nhan-root)
- - **Main Entry (from JSON):** `N/A`
- - **Key Scripts:** dev:backend, dev:frontend, dev, build, lint, prepare
- - **Key Dependencies:** ...
- **Module:** `backend\package.json` (Name: workflow-nhan-backend)
- - **Main Entry (from JSON):** `N/A`
- - **Key Scripts:** start, test
- - **Key Dependencies:** @prisma/adapter-pg, @prisma/client, bcrypt, cors, dotenv, express, jsonwebtoken, pg, pino, pino-pretty...
- **Module:** `backend\src\generated\package.json` (Name: prisma-client-90cc8fa19cf587fe780c0ce506f2a5639072cd302caf6ec9ec364d6850f7de0e)
- - **Main Entry (from JSON):** `index.js`
- - **Key Scripts:** 
- - **Key Dependencies:** @prisma/client-runtime-utils...
- **Module:** `task-dashboard\package.json` (Name: task-dashboard)
- - **Main Entry (from JSON):** `N/A`
- - **Key Scripts:** dev, build, lint, preview, test, analyze
- - **Key Dependencies:** lucide-react, react, react-dom, react-router-dom, recharts, uuid...
- **Module:** `Understand-Anything\package.json` (Name: understand-anything)
- - **Main Entry (from JSON):** `.opencode/plugins/understand-anything.js`
- - **Key Scripts:** prepare, build, test, dev:dashboard, lint
- - **Key Dependencies:** ...
- **Module:** `Understand-Anything\homepage\package.json` (Name: homepage)
- - **Main Entry (from JSON):** `N/A`
- - **Key Scripts:** dev, build, preview, astro
- - **Key Dependencies:** astro...
- **Module:** `Understand-Anything\understand-anything-plugin\package.json` (Name: @understand-anything/skill)
- - **Main Entry (from JSON):** `dist/index.js`
- - **Key Scripts:** build, test
- - **Key Dependencies:** @understand-anything/core, graphology, graphology-communities-louvain...
- **Module:** `Understand-Anything\understand-anything-plugin\packages\core\package.json` (Name: @understand-anything/core)
- - **Main Entry (from JSON):** `dist/index.js`
- - **Key Scripts:** build, test
- - **Key Dependencies:** fuse.js, ignore, tree-sitter-c-sharp, tree-sitter-cpp, tree-sitter-go, tree-sitter-java, tree-sitter-javascript, tree-sitter-php, tree-sitter-python, tree-sitter-ruby...
- **Module:** `Understand-Anything\understand-anything-plugin\packages\dashboard\package.json` (Name: @understand-anything/dashboard)
- - **Main Entry (from JSON):** `N/A`
- - **Key Scripts:** dev, build, build:demo, preview, test, test:watch
- - **Key Dependencies:** @dagrejs/dagre, @understand-anything/core, @xyflow/react, d3-force, devlop, elkjs, graphology, graphology-communities-louvain, graphology-types, hast-util-to-jsx-runtime...
- **Config File Found:** `.env`
- **Config File Found:** `vercel.json`

## 2. Main Entry Points (Activity/Entry Point Equivalence)
- Dev Script (package.json): `concurrently "npm run dev:backend" "npm run dev:frontend"`
- Start Script (backend\package.json): `npx prisma migrate deploy --schema=./prisma/schema.prisma && npx prisma generate --schema=./prisma/schema.prisma && tsx src/server.js`
- Dev Script (task-dashboard\package.json): `vite`
- Dev Script (Understand-Anything\homepage\package.json): `astro dev`
- Dev Script (Understand-Anything\understand-anything-plugin\packages\dashboard\package.json): `vite`

## 3. API & Communication Flow (Intent/Network Flow)
- Backend Route: `[GET] /api/health` in `server.js`
- Backend Route: `[GET] /api/app-data` in `server.js`
- Backend Route: `[POST] /api/app-data` in `server.js`
- Backend Route: `[POST] /api/snapshot` in `server.js`
- Backend Route: `[GET] /api/snapshots` in `server.js`
- Backend Route: `[GET] /api/snapshots/:date` in `server.js`
- Backend Route: `[POST] /api/evaluate` in `server.js`
- Backend Route: `[POST] /api/generate-pptx` in `server.js`
- Backend Route: `[POST] /api/open-file` in `server.js`
- Backend Route: `[POST] /api/auth/register` in `server.js`
- Backend Route: `[POST] /api/auth/login` in `server.js`
- Backend Route: `[GET] /api/auth/me` in `server.js`
- Backend Route: `[GET] /api/users` in `server.js`
- Backend Route: `[PATCH] /api/users/:id/role` in `server.js`
- Backend Route: `[DELETE] /api/users/:id` in `server.js`
- Frontend Call to: `/api/open-file` in `InsightsPage.tsx`
- Frontend Call to: `/api/generate-pptx` in `InsightsPage.tsx`
- Frontend Call to: `/api/evaluate` in `InsightsPage.tsx`
- Frontend Call to: `/api/snapshot` in `apiService.ts`
- Frontend Call to: `/api/snapshots` in `apiService.ts`
- Frontend Call to: `/api/app-data` in `apiService.ts`

## 4. Data Flow & Storage (Database/Local Storage)
- **Prisma Schema Found:** `backend/prisma/schema.prisma`
- Database Models: Project, Member, Task, StatusConfig, PriorityConfig, GameScorecard, WeeklyInsight, Snapshot
- **Data Store Logic:** `backend/src/data-store-db.js` (Handles DB interactions)

## 5. Security & Permissions (Sensitive Data Mapping)
- Found Env Key: `MCP_API_KEY` in `.env`