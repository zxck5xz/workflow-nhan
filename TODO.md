# TODO

## ✅ Done (2026-06-02)

- [x] Add real-time progress bar + live log cho APK analysis
- [x] Thêm Google Play search endpoint (`POST /api/search-app-info`)
- [x] Enrich report với Google Play data (app name, developer, category, rating, installs)
- [x] Thêm supplementary sections (Security, Product Design, Roadmap, Conclusion) chỉ khi có web app info
- [x] PDF download button với HTML → PDF (html2pdf.js), tiếng Việt
- [x] Xoá "Phân tích Codebase" feature khỏi UI, API, backend route, docs
- [x] Fix TypeScript errors trong `AppContext.tsx`
- [x] Fix auth middleware order: `/api/health` trước `app.use(authMiddleware)`
- [x] Fix backend Docker build (zod dep, npm --no-workspaces, lockfile)
- [x] Clear preDeployCommand (migrations already applied, env not injected in Docker build)
- [x] Deploy backend lên Railway thành công (SUCCESS)
- [x] Backend health check hoạt động: `/api/health` → 200
- [x] Auth middleware hoạt động: unauthenticated → 401

## ✅ Done (2026-06-04)

- [x] Product Link Search mode → Product Search (accept tên hoặc URL)
- [x] Backend `/api/search-product` mới — nhận query (tên, Google Play URL, hoặc promo link)
- [x] Promo link support — follow redirects, extract OG metadata, match trên Google Play
- [x] Standardized 10-section report template từ Excel mẫu
- [x] Fix blank PDF — replace html2pdf.js with direct html2canvas + jsPDF
- [x] Fix pre-existing import path bug (`services/` → `utils/`) + TS 6.0 implicit any

## ✅ Done (2026-06-12)

- [x] **Unified AI Research Suite**: Upgraded the research feature into a cohesive intelligence hub.
- [x] **AI APK Explainer**: Implemented `apk_interpreter.py` and backend bridge for technical narrative generation.
- [x] **Research History**: Implemented persistent storage for reports using Prisma (DB) and Local JSON fallback.
- [x] **Modern UI**: Redesigned `CodeAnalysisPage` with a dual-pane layout (History Sidebar + Workspace).
- [x] **Fix Product Search**: Resolved "API 500" error with robust Play Store scraping and User-Agent injection.
- [x] **Fix Vercel Deploy**: Restored missing states (`progress`, `logs`, `productResult`) to resolve TS build errors.
- [x] **Codebase Cleanup**: Removed "Project Pulse" (Codebase Analysis) feature per request to focus on external research.
- [x] Kiểm tra frontend (task-dashboard) hoạt động với backend mới
- [x] Test APK analysis flow end-to-end

## ✅ Done (2026-06-13)

- [x] **Integration: Agent-Reach Social Sentiment for Product Research**
  - [x] Created `ai-agents/sentiment_agent.py` — Reddit scraper + keyword sentiment analysis
  - [x] Added `POST /api/research/sentiment` backend endpoint (calls Python agent)
  - [x] Updated Prisma schema: `sentimentScore`, `sentimentSummary`, `redditMentions`, `twitterMentions` fields
  - [x] Updated DataStoreDB to persist sentiment data
  - [x] Added "Sentiment (Reddit/Twitter)" button in Product Search mode
  - [x] Sentiment UI display (score badge, Reddit mentions list, Twitter mentions)
  - [x] Sentiment section in standard markdown report + PDF
  - [x] TypeScript clean, Vite build successful

## In Progress

## Backlog

- [ ] Test PDF download trên Vercel deploy
- [ ] Implement "Versus Mode" để so sánh 2 report nghiên cứu trong lịch sử.
