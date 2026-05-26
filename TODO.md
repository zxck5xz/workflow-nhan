# TODO - Workflow 1: Task Dashboard Backend DB + Deploy

## Plan
1. (Code) Implement `DataStoreDB` using Prisma to replace file-JSON DataStore while keeping API routes unchanged.
2. (Code) Update `backend/src/server.js` to use `DataStoreDB` when `DATABASE_URL` is set; otherwise fallback to file JSON.
3. (Code) Ensure snapshot endpoints map to `Snapshot` table.
4. (Code/Schema) Generate Prisma client already exists; ensure build passes.
5. (Migrate) Run Prisma migrate for the schema.
6. (Migrate) Run `backend/prisma/migrate-import.ts` to import current `backend/data/app-data.json` + snapshots.
7. (Ops) Verify `docker-compose.yml` works for local: bring up Postgres + backend.
8. (Ops) Provide free-tier hosting recommendations (frontend+backend+DB) and minimal deployment steps.

## Progress
- [x] Implemented `backend/src/data-store-db.js` (Prisma-backed store + snapshots via `Snapshot` table)
- [x] Updated `backend/src/server.js` to use DB store when `DATABASE_URL` is set, otherwise fallback to JSON store
- [x] Verified backend boots and `/api/health` and `/api/app-data` work with JSON fallback

## Remaining
- [ ] Ensure snapshot endpoints fully use `DataStoreDB` when DB enabled (currently snapshot endpoints still use JSON store)
- [ ] Run prisma generate/build verification (if needed)
- [ ] Prisma migrate + import data
- [ ] docker-compose verification
- [ ] Hosting recommendations + minimal deployment steps

