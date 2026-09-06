# Codebase Analysis Report: Project Engineering Reverse Engineering
*Generated on: 2026-06-01 21:02:30*

## Executive Summary
This report applies the 'Android Reverse Engineering' workflow logic to the current project's web/node architecture.

## 1. Manifest & Architecture Analysis (Project Mapping)
- **Module:** `package.json` (Name: workflow-nhan-backend)
- - **Main Entry (from JSON):** `N/A`
- - **Key Scripts:** start, test
- - **Key Dependencies:** @prisma/adapter-pg, @prisma/client, bcrypt, cors, dotenv, express, jsonwebtoken, pg, pino, pino-pretty...
- **Module:** `src\generated\package.json` (Name: prisma-client-90cc8fa19cf587fe780c0ce506f2a5639072cd302caf6ec9ec364d6850f7de0e)
- - **Main Entry (from JSON):** `index.js`
- - **Key Scripts:** 
- - **Key Dependencies:** @prisma/client-runtime-utils...
- **Config File Found:** `.env`
- **Config File Found:** `railway.json`

## 2. Main Entry Points (Activity/Entry Point Equivalence)
- Start Script (package.json): `npx prisma migrate deploy --schema=./prisma/schema.prisma && npx prisma generate --schema=./prisma/schema.prisma && tsx src/server.js`

## 3. API & Communication Flow (Intent/Network Flow)
- No specific findings in this category.

## 4. Data Flow & Storage (Database/Local Storage)
- No specific findings in this category.

## 5. Security & Permissions (Sensitive Data Mapping)
- Found Env Key: `DATABASE_URL` in `.env`