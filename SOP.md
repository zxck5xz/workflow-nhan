# Standard Operating Procedure (SOP) - Workflow Management System

## Purpose

This document provides a step-by-step guide for setting up, deploying, and maintaining the Workflow Management System.

## Scope

Applies to all team members involved in deployment, maintenance, and usage of the system.

## Prerequisites

- Node.js v18+ installed
- npm or yarn package manager
- Git version control
- Access to Cloudflare, Vercel, and Neon accounts
- PostgreSQL database access

## Procedure

### 1. Local Development Setup

1.1 Clone the repository:

```bash
git clone https://github.com/zxck5xz/workflow-nhan.git
cd workflow-nhan
```

1.2 Install dependencies for both frontend and backend:

```bash
# Install frontend dependencies
cd task-dashboard
npm install

# Install backend dependencies
cd ../backend
npm install
```

1.3 Set up environment variables:

- Copy `.env.example` to `.env` in both `task-dashboard/` and `backend/` directories
- Configure `VITE_API_URL` in frontend `.env` to point to your backend URL
- Configure `DATABASE_URL` in backend `.env` for PostgreSQL connection
- Add `JWT_SECRET` to backend `.env` for authentication

  1.4 Initialize the database:

```bash
cd backend
npx prisma migrate dev --name init
```

1.5 Seed initial data (optional):

```bash
npx tsx seed-users.ts
```

1.6 Start development servers:

```bash
# In one terminal - backend
cd backend
npm start

# In another terminal - frontend
cd ../task-dashboard
npm run dev
```

### 2. Deployment to Production

#### 2.1 Backend Deployment (Cloudflare Worker)

The backend is the Cloudflare Worker in `backend/worker` (production URL:
`https://workflow-nhan-backend.ai-chat-api.workers.dev`).

2.1.1 Set the Worker secrets once (from `backend/worker`):

```bash
npx wrangler secret put DATABASE_URL   # Neon connection string (HTTPS-capable endpoint)
npx wrangler secret put JWT_SECRET     # secure random string
```

2.1.2 Non-secret config (`CORS_ORIGINS`) lives in `backend/worker/wrangler.toml`.
Entries may use `*` within one DNS label, e.g. Vercel preview URLs.
2.1.3 Pushing to `master` with changes under `backend/worker/` deploys automatically via
`.github/workflows/deploy-worker.yml` (GitHub secrets `CLOUDFLARE_API_TOKEN`,
`CLOUDFLARE_ACCOUNT_ID`). It can also be run manually from the Actions tab.
2.1.4 Manual deploy: `cd backend/worker && npx wrangler deploy`
2.1.5 Preview without touching production:
`npx wrangler versions upload --preview-alias <name>`
2.1.6 Verify: `GET /api/health` returns `{"status":"ok","runtime":"cloudflare-workers"}`

#### 2.2 Frontend Deployment (Vercel)

2.2.1 Import project on Vercel from GitHub
2.2.2 Set environment variables:

- `VITE_API_URL` (the Worker URL above)
  2.2.3 Vercel will automatically build and deploy
  2.2.4 Verify deployment at the provided Vercel URL

#### 2.3 Database Setup (Neon)

2.3.1 Create project on Neon
2.3.2 Copy connection string from Neon dashboard
2.3.2 Update `DATABASE_URL` in the backend `.env` (for Prisma migrations) and the Worker secret
2.3.3 Run migrations on production database:

```bash
cd backend
npx prisma migrate deploy
```

### 3. System Maintenance

#### 3.1 Database Migrations

3.1.1 Create new migration:

```bash
cd backend
npx prisma migrate dev --name <migration-name>
```

3.1.2 Apply migration to production:

```bash
npx prisma migrate deploy
```

#### 3.2 Data Backup

3.2.1 Use the snapshot feature in the application
3.2.2 Or manually backup PostgreSQL database via Neon dashboard

#### 3.4 APK Analysis (Reverse Engineering Logic)

**3.4.1 Phân tích APK Mobile (Client-side):**
Sử dụng trực tiếp trên Dashboard (Tab **"Phân tích APK Local"**):

- Tải file `.apk` lên trực tiếp từ máy tính.
- Quá trình "decrypt", quét manifest và trích xuất API keys diễn ra **ngay trong trình duyệt** (sử dụng JSZip). Dữ liệu không được gửi lên server.

### 4. Troubleshooting

#### 4.1 Common Issues

4.1.1 Connection refused errors:

- Verify backend is running
- Check `VITE_API_URL` in frontend matches backend URL
- Check CORS settings in backend

  4.1.2 Authentication failures:

- Verify JWT_SECRET matches in backend and token validation
- Check token expiration (24 hours)
- Verify password hashing with bcrypt

  4.1.3 Database connection errors:

- Verify DATABASE_URL is correct
- Check Neon database status
- Verify Prisma client regeneration after schema changes

#### 4.2 Logs

4.2.1 Backend logs: `cd backend/worker && npx wrangler tail`, or the Cloudflare dashboard
4.2.2 Frontend errors: Check browser console and Vercel logs

### 5. Security Considerations

5.1 Environment Variables

- Never commit `.env` files to version control
- Use platform-specific secret management (Wrangler secrets / Vercel env vars)

  5.2 Dependencies

- Regularly run `npm audit` and update vulnerable packages
- Monitor security advisories for used packages

  5.3 Data Protection

- Database is hosted on Neon with SSL enforcement
- Consider enabling additional Neon security features
- Regularly backup sensitive data

## References

- Prisma Documentation: https://pris.ly/d
- Cloudflare Workers Documentation: https://developers.cloudflare.com/workers/
- Vercel Documentation: https://vercel.com/docs
- Neon Documentation: https://neon.tech/docs

## Revision History

| Version | Date       | Author       | Description          |
| ------- | ---------- | ------------ | -------------------- |
| 1.0     | 2026-05-26 | AI Assistant | Initial SOP creation |
