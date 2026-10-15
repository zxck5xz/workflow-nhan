import { lazy, Suspense, useEffect, type ComponentType } from 'react';
import { useApp, AppProvider } from './contexts/AppContext';
import { useAuth } from './contexts/AuthContext';
import { Sidebar } from './components/Sidebar';
import { LoginForm } from './components/auth/LoginForm';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// A page chunk can fail to load when the dev server re-optimizes deps or a new
// deploy replaces the hashed chunks. Reload once to pick up the fresh module
// graph; if it still fails right after reloading, surface the error.
const RELOAD_KEY = 'lazy-page-reloaded-at';

function lazyPage<T extends ComponentType>(loader: () => Promise<{ default: T }>) {
  return lazy(() =>
    loader().catch((err: unknown) => {
      try {
        const last = Number(sessionStorage.getItem(RELOAD_KEY)) || 0;
        if (Date.now() - last > 10_000) {
          sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
          window.location.reload();
          return new Promise<never>(() => {}); // keep the fallback until reload
        }
      } catch {
        // storage blocked — fall through and show the error
      }
      throw err;
    }),
  );
}

// Lazy load pages for better performance
const SetupPage = lazyPage(() =>
  import('./components/setup/SetupPage').then((m) => ({ default: m.SetupPage })),
);
const ProjectControlPage = lazyPage(() =>
  import('./components/tasks/ProjectControlPage').then((m) => ({ default: m.ProjectControlPage })),
);
const CalendarPage = lazyPage(() =>
  import('./components/calendar/CalendarPage').then((m) => ({ default: m.CalendarPage })),
);
const WorkReportPage = lazyPage(() =>
  import('./components/reports/WorkReportPage').then((m) => ({ default: m.WorkReportPage })),
);
const StaffReportPage = lazyPage(() =>
  import('./components/reports/StaffReportPage').then((m) => ({ default: m.StaffReportPage })),
);
const InsightsPage = lazyPage(() =>
  import('./components/reports/InsightsPage').then((m) => ({ default: m.InsightsPage })),
);
const CodeAnalysisPage = lazyPage(() =>
  import('./components/reports/CodeAnalysisPage').then((m) => ({ default: m.CodeAnalysisPage })),
);
const ForecastPage = lazyPage(() =>
  import('./modules/forecast/ForecastPage').then((m) => ({ default: m.ForecastPage })),
);
const UserManagementPage = lazyPage(() =>
  import('./components/auth/UserManagementPage').then((m) => ({ default: m.UserManagementPage })),
);

function AppContent() {
  const { state, setPage } = useApp();
  const { user, loading } = useAuth();

  // Link chia sẻ kịch bản dự phóng (#s=…) hoặc chế độ in (?print) mở thẳng view AuGo của trang Dự phóng game
  useEffect(() => {
    const { hash, search } = window.location;
    if (hash.startsWith('#s=') || new URLSearchParams(search).has('print')) setPage('forecast');
  }, [setPage]);

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="app-layout">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // If user is not authenticated, show only login form (Registration disabled)
  if (!user) {
    return (
      <div className="app-layout auth-layout">
        <div className="auth-container">
          <div className="auth-header">
            <h2>Workflow Management</h2>
            <p>Please log in to continue</p>
          </div>
          <LoginForm />
        </div>
      </div>
    );
  }

  // Don't render pages (or accept edits) on the placeholder seed data while
  // the signed-in user's data is still loading.
  if (state.loading) {
    return (
      <div className="app-layout">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // User is authenticated, show main app
  return (
    <div className="app-layout">
      <Sidebar />
      <main
        className={`main-content ${state.sidebarCollapsed ? 'main-content--collapsed' : 'main-content--expanded'}`}
      >
        <Suspense fallback={<div className="loading-spinner">Loading page...</div>}>
          {/* keyed by page so an error on one page doesn't stick after navigating */}
          <ErrorBoundary key={state.activePage}>
            {state.activePage === 'setup' && <SetupPage />}
            {state.activePage === 'project-control' && <ProjectControlPage />}
            {state.activePage === 'calendar' && <CalendarPage />}
            {state.activePage === 'reports' && <WorkReportPage />}
            {state.activePage === 'insights' && <InsightsPage />}
            {state.activePage === 'code-analysis' && <CodeAnalysisPage />}
            {state.activePage === 'staff-reports' && <StaffReportPage />}
            {state.activePage === 'user-management' && <UserManagementPage />}
            {state.activePage === 'forecast' && <ForecastPage />}
          </ErrorBoundary>
        </Suspense>
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
