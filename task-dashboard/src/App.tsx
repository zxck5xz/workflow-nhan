import { useState } from 'react';
import { useApp, AppProvider } from './contexts/AppContext';
import { useAuth } from './contexts/AuthContext';
import { Sidebar } from './components/Sidebar';
import { SetupPage } from './components/setup/SetupPage';
import { ProjectControlPage } from './components/tasks/ProjectControlPage';
import { CalendarPage } from './components/calendar/CalendarPage';
import { WorkReportPage } from './components/reports/WorkReportPage';
import { StaffReportPage } from './components/reports/StaffReportPage';
import { InsightsPage } from './components/reports/InsightsPage';
import { UserManagementPage } from './components/auth/UserManagementPage';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';

function AppContent() {
  const { state } = useApp();
  const { user, loading } = useAuth();
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  
  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="app-layout">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }
  
  // If user is not authenticated, show login/register forms
  if (!user) {
    return (
      <div className="app-layout auth-layout">
        <div className="auth-container">
          <div className="auth-tabs">
            <button className={`tab ${authTab === 'login' ? 'active' : ''}`} onClick={() => setAuthTab('login')}>Login</button>
            <button className={`tab ${authTab === 'register' ? 'active' : ''}`} onClick={() => setAuthTab('register')}>Register</button>
          </div>
          {authTab === 'login' && <LoginForm />}
          {authTab === 'register' && <RegisterForm />}
        </div>
      </div>
    );
  }
  
  // User is authenticated, show main app
  return (
    <div className="app-layout">
      <Sidebar />
      <main className={`main-content ${state.sidebarCollapsed ? 'main-content--collapsed' : 'main-content--expanded'}`}>
        {state.activePage === 'setup' && <SetupPage />}
        {state.activePage === 'project-control' && <ProjectControlPage />}
        {state.activePage === 'calendar' && <CalendarPage />}
        {state.activePage === 'reports' && <WorkReportPage />}
        {state.activePage === 'insights' && <InsightsPage />}
        {state.activePage === 'staff-reports' && <StaffReportPage />}
        {state.activePage === 'user-management' && <UserManagementPage />}
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
