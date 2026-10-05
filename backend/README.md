# backend

The API runs as a **Cloudflare Worker** in [`worker/`](worker/) (deployed from
`master` by `.github/workflows/deploy-worker.yml`). See `SOP.md` §2.1.

This folder keeps the database tooling shared with the Worker:

- `prisma/schema.prisma` and `prisma/migrations/` — the Neon Postgres schema
- `seed-users.ts` — create the default users

```bash
cd backend
# DATABASE_URL must point at the target database (e.g. via .env)
npm run migrate:status
npm run migrate:deploy
npm run seed:users
```

Local Worker development:

```bash
npm run dev:backend   # from the repo root: wrangler dev on http://localhost:8787
```

Put `DATABASE_URL` (Neon, HTTPS-capable endpoint) and `JWT_SECRET` in
`worker/.dev.vars` (git-ignored).
