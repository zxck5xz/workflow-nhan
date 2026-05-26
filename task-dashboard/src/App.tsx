import { useApp, AppProvider } from './contexts/AppContext';
import { Sidebar } from './components/Sidebar';
import { SetupPage } from './components/setup/SetupPage';
import { TaskListPage } from './components/tasks/TaskListPage';
import { CalendarPage } from './components/calendar/CalendarPage';
import { WorkReportPage } from './components/reports/WorkReportPage';
import { StaffReportPage } from './components/reports/StaffReportPage';
import { InsightsPage } from './components/reports/InsightsPage';

function AppContent() {
  const { state } = useApp();
  
  return (
    <div className="app-layout">
      <Sidebar />
      <main className={`main-content ${state.sidebarCollapsed ? 'main-content--collapsed' : 'main-content--expanded'}`}>
        {state.activePage === 'setup' && <SetupPage />}
        {state.activePage === 'tasks' && <TaskListPage />}
        {state.activePage === 'calendar' && <CalendarPage />}
        {state.activePage === 'reports' && <WorkReportPage />}
        {state.activePage === 'insights' && <InsightsPage />}
        {state.activePage === 'staff-reports' && <StaffReportPage />}
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
