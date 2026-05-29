# Standard Operating Procedure (SOP) - Workflow Management System

## Purpose
This document provides a step-by-step guide for setting up, deploying, and maintaining the Workflow Management System.

## Scope
Applies to all team members involved in deployment, maintenance, and usage of the system.

## Prerequisites
- Node.js v18+ installed
- npm or yarn package manager
- Git version control
- Access to Railway, Vercel, and Neon accounts
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
#### 2.1 Backend Deployment (Railway)
2.1.1 Create new project on Railway
2.1.2 Connect GitHub repository
2.1.3 Set environment variables in Railway dashboard:
   - `DATABASE_URL` (provided by Neon integration)
   - `JWT_SECRET` (secure random string)
   - `PORT` (optional, defaults to 4000)
2.1.4 Railway will automatically detect and run `npm start`
2.1.5 Verify deployment at the provided Railway URL

#### 2.2 Frontend Deployment (Vercel)
2.2.1 Import project on Vercel from GitHub
2.2.2 Set environment variables:
   - `VITE_API_URL` (your Railway backend URL)
2.2.3 Vercel will automatically build and deploy
2.2.4 Verify deployment at the provided Vercel URL

#### 2.3 Database Setup (Neon)
2.3.1 Create project on Neon
2.3.2 Copy connection string from Neon dashboard
2.3.2 Update `DATABASE_URL` in both backend `.env` and Railway environment variables
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

#### 3.3 Updates
3.3.1 Pull latest changes from GitHub
3.3.2 Update dependencies:
```bash
# Frontend
cd task-dashboard
npm update

# Backend
cd ../backend
npm update
```
3.3.3 Restart services if needed

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
4.2.1 Backend logs: Check Railway logs dashboard or terminal output
4.2.2 Frontend errors: Check browser console and Vercel logs

### 5. Security Considerations
5.1 Environment Variables
   - Never commit `.env` files to version control
   - Use platform-specific secret management (Railway/Vercel env vars)

5.2 Dependencies
   - Regularly run `npm audit` and update vulnerable packages
   - Monitor security advisories for used packages

5.3 Data Protection
   - Database is hosted on Neon with SSL enforcement
   - Consider enabling additional Neon security features
   - Regularly backup sensitive data

## References
- Prisma Documentation: https://pris.ly/d
- Railway Documentation: https://docs.railway.app
- Vercel Documentation: https://vercel.com/docs
- Neon Documentation: https://neon.tech/docs

## Revision History
| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | 2026-05-26 | AI Assistant | Initial SOP creation |