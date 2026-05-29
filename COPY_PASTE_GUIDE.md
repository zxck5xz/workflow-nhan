# Hướng dẫn Copy-Paste Framework để Tạo Workflow Mới

## Purpose
This document provides a step-by-step guide for copying and adapting the existing workflow framework to create new workflows for different purposes.

## Scope
Applies to team members who want to create new workflows based on the existing Task Management Dashboard framework.

## Prerequisites
- Understanding of the existing workflow structure (refer to preparing_workflows.md)
- Basic knowledge of React, TypeScript, and Vite
- Access to the workflow-nhan repository

## Procedure

### 1. Understanding the Framework Structure
Before copying, understand the key components of the existing framework:

#### 1.1 Core Architecture
- **Frontend**: React + TypeScript + Vite (task-dashboard/)
- **Backend**: Express + Prisma + PostgreSQL (backend/)
- **State Management**: React Context + useReducer (AppContext.tsx)
- **Data Layer**: LocalStorage + API sync + Database abstraction (dataService.ts)
- **Authentication**: JWT-based with role-based access control (added recently)
- **AI Integration**: Python agents for game evaluation and PPTX generation

#### 1.2 Key Directories to Replicate
```
task-dashboard/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Shared components (Button, Modal, etc.)
│   │   ├── layout/          # Layout components (Sidebar, etc.)
│   │   └── [workflow-name]/ # Workflow-specific pages
│   ├── contexts/            # React Context providers
│   ├── data/                # Data services and storage
│   ├── services/            # External service integrations
│   ├── types/               # TypeScript type definitions
│   ├── styles/              # CSS and design tokens
│   └── App.tsx              # Main application router
│
backend/
├── src/
│   ├── data-store-db.js     # Database abstraction layer
│   ├── server.js            # Express API server
│   └── auth.js              # Authentication service
├── prisma/
│   └── schema.prisma        # Database schema
└── ai-agents/               # Python AI agents (if needed)
```

### 2. Copy-Paste Process

#### 2.1 For a New Workflow (e.g., "Customer Support Workflow")

**Step 1: Create Workflow Directory**
```bash
# In task-dashboard/src/components/
mkdir -p src/components/customer-support
```

**Step 2: Copy and Adapt Core Components**
Copy the structure from an existing workflow (e.g., tasks/):

```bash
# Copy basic page structure
cp -r src/components/tasks/ src/components/customer-support/

# Rename and adapt files:
# - TaskListPage.tsx → SupportTicketListPage.tsx
# - Update component names and logic
# - Modify data service calls to match new entities
```

**Step 3: Update Type Definitions**
Add new types to `src/types/index.ts`:

```typescript
// Add to existing types
export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  customerId: string;
  agentId: string;
  status: 'open' | 'in-progress' | 'waiting' | 'resolved' | 'closed';
  priority: 'P0' | 'P1' | 'P2';
  createdAt: string;
  resolvedAt?: string;
  // Add workflow-specific fields
}

// Add to AppData interface
export interface AppData {
  // ... existing fields
  supportTickets: SupportTicket[];
  customers: Customer[];
  agents: Agent[];
}
```

**Step 4: Create New Pages**
Create new page components following the pattern of existing pages:
- SupportTicketListPage.tsx
- SupportCalendarPage.tsx (if scheduling is needed)
- SupportReportPage.tsx
- etc.

**Step 5: Update Routing**
In `src/App.tsx`:
1. Import new page components
2. Add new PageId to `src/types/index.ts`
3. Add routing logic in `AppContent()` function
4. Add new NavItem to the Sidebar

**Step 6: Update Data Service**
Modify `src/data/dataService.ts` to handle new entities:
- Add CRUD methods for new entities
- Update `load()`, `save()`, and snapshot methods
- Ensure type safety with new interfaces

**Step 7: Update Backend (if needed)**
If the workflow requires new database entities:
1. Update `backend/prisma/schema.prisma` with new models
2. Generate new Prisma client: `npx prisma generate`
3. Update `backend/src/data-store-db.js` with new CRUD operations
4. Update API endpoints in `backend/src/server.js`

**Step 8: Update Authentication & Authorization**
If the new workflow requires special permissions:
1. Add new roles to the Role enum in Prisma schema
2. Update authorization middleware to handle new permissions
3. Seed any default permissions in seed-users.ts

**Step 9: Update Documentation**
1. Add workflow description to `preparing_workflows.md`
2. Add feature details to `website_features.md`
3. Update any relevant SOPs or guides

### 3. Workflow-Specific Customizations

#### 3.1 UI/UX Customizations
- Modify `src/styles/global.css` for workflow-specific themes
- Create custom components in `src/components/[workflow-name]/common/`
- Adapt existing common components if needed

#### 3.2 Data Flow Customizations
- Modify data service methods for special validation
- Add workflow-specific middleware in backend if needed
- Customize API endpoints for workflow-specific operations

#### 3.3 AI Integration (if applicable)
- Create new Python agents in `ai-agents/` directory
- Add new API endpoints in backend
- Create UI components for AI interaction in frontend

### 4. Testing the New Workflow
1. Start development servers: `npm run dev` (frontend) and `npm start` (backend)
2. Verify new workflow appears in sidebar navigation
3. Test all CRUD operations
4. Test data persistence (localStorage and database)
5. Test authentication and authorization
6. Test responsive design on different screen sizes
7. Verify snapshot and export/import functionality works

### 5. Deployment Considerations
1. Ensure all new environment variables are configured in:
   - Frontend: Vercel environment variables
   - Backend: Railway environment variables
2. Run database migrations if schema changed:
   ```bash
   cd backend
   npx prisma migrate deploy
   ```
3. Verify CI/CD pipelines work correctly with new code
4. Monitor logs for any errors after deployment

## Troubleshooting

### Common Issues
1. **TypeScript errors**: Run `npm run typecheck` (if configured) or check tsc output
2. **Routing issues**: Verify PageId types and App.tsx routing logic
3. **Data not persisting**: Check dataService.ts implementation and API connectivity
4. **Authentication problems**: Verify JWT_SECRET consistency and token handling
5. **Styling issues**: Check CSS specificity and global stylesheet imports

### Debugging Tips
1. Use React DevTools to inspect component state
2. Check network tab in browser dev tools for API calls
3. Review backend logs for server-side errors
4. Verify Prisma schema migrations have been applied
5. Check localStorage data format if using fallback storage

## References
- Existing workflow implementations in `task-dashboard/src/components/`
- Preparing workflows documentation: `preparing_workflows.md`
- Website features documentation: `website_features.md`
- TypeScript definitions: `task-dashboard/src/types/index.ts`
- Database schema: `backend/prisma/schema.prisma`

## Revision History
| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | 2026-05-26 | AI Assistant | Initial copy-paste guide creation |