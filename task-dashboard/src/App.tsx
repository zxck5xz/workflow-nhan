import { lazy, Suspense } from 'react';
import { useApp, AppProvider } from './contexts/AppContext';
import { useAuth } from './contexts/AuthContext';
import { Sidebar } from './components/Sidebar';
import { LoginForm } from './components/auth/LoginForm';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Lazy load pages for better performance
const SetupPage = lazy(() =>
  import('./components/setup/SetupPage').then((m) => ({ default: m.SetupPage })),
);
const ProjectControlPage = lazy(() =>
  import('./components/tasks/ProjectControlPage').then((m) => ({ default: m.ProjectControlPage })),
);
const CalendarPage = lazy(() =>
  import('./components/calendar/CalendarPage').then((m) => ({ default: m.CalendarPage })),
);
const WorkReportPage = lazy(() =>
  import('./components/reports/WorkReportPage').then((m) => ({ default: m.WorkReportPage })),
);
const StaffReportPage = lazy(() =>
  import('./components/reports/StaffReportPage').then((m) => ({ default: m.StaffReportPage })),
);
const InsightsPage = lazy(() =>
  import('./components/reports/InsightsPage').then((m) => ({ default: m.InsightsPage })),
);
const CodeAnalysisPage = lazy(() =>
  import('./components/reports/CodeAnalysisPage').then((m) => ({ default: m.CodeAnalysisPage })),
);
const UserManagementPage = lazy(() =>
  import('./components/auth/UserManagementPage').then((m) => ({ default: m.UserManagementPage })),
);

function AppContent() {
  const { state } = useApp();
  const { user, loading } = useAuth();

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

  // User is authenticated, show main app
  return (
    <div className="app-layout">
      <Sidebar />
      <main
        className={`main-content ${state.sidebarCollapsed ? 'main-content--collapsed' : 'main-content--expanded'}`}
      >
        <Suspense fallback={<div className="loading-spinner">Loading page...</div>}>
          <ErrorBoundary>
            {state.activePage === 'setup' && <SetupPage />}
            {state.activePage === 'project-control' && <ProjectControlPage />}
            {state.activePage === 'calendar' && <CalendarPage />}
            {state.activePage === 'reports' && <WorkReportPage />}
            {state.activePage === 'insights' && <InsightsPage />}
            {state.activePage === 'code-analysis' && <CodeAnalysisPage />}
            {state.activePage === 'staff-reports' && <StaffReportPage />}
            {state.activePage === 'user-management' && <UserManagementPage />}
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
