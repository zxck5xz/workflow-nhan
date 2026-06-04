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

## In Progress

## Backlog

- [ ] Kiểm tra frontend (task-dashboard) hoạt động với backend mới
- [ ] Test APK analysis flow end-to-end
- [ ] Test PDF download trên Vercel deploy
