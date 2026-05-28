import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import type { PageId } from '../types';
import './Sidebar.css';

const NAV_ITEMS: { id: PageId; label: string; icon: string; section?: string; role?: string }[] = [
  { id: 'project-control', label: 'Dự án & Task', icon: '📊', section: 'Quản lý' },
  { id: 'calendar', label: 'Lịch', icon: '📅' },
  { id: 'setup', label: 'Cấu hình', icon: '⚙️', section: 'Hệ thống' },
  { id: 'user-management', label: 'Tài khoản', icon: '👤', role: 'ADMIN' },
  { id: 'reports', label: 'Báo cáo', icon: '📊', section: 'Phân tích' },
  { id: 'insights', label: 'Insights', icon: '💡' },
  { id: 'staff-reports', label: 'Nhân sự', icon: '👥' },
];

export function Sidebar() {
  const { state, setPage, toggleSidebar } = useApp();
  const { user } = useAuth();
  const collapsed = state.sidebarCollapsed;

  const visibleItems = NAV_ITEMS.filter(item => !item.role || item.role === user?.role);

  let lastSection = '';

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__logo" onClick={toggleSidebar} title="Thu gọn sidebar">
        <div className="sidebar__logo-icon">T</div>
        <span className="sidebar__logo-text">Task Dashboard</span>
      </div>

      <nav className="sidebar__nav">
        {visibleItems.map(item => {
          const showSection = item.section && item.section !== lastSection;
          if (item.section) lastSection = item.section;

          return (
            <div key={item.id}>
              {showSection && (
                <div className="sidebar__section-label">{item.section}</div>
              )}
              <button
                className={`sidebar__nav-item ${state.activePage === item.id ? 'sidebar__nav-item--active' : ''}`}
                onClick={() => setPage(item.id)}
                title={item.label}
              >
                <span className="sidebar__nav-icon">{item.icon}</span>
                <span className="sidebar__nav-label">{item.label}</span>
              </button>
            </div>
          );
        })}
      </nav>

      <div className="sidebar__toggle">
        <button className="sidebar__toggle-btn" onClick={toggleSidebar}>
          {collapsed ? '▶' : '◀'}
        </button>
      </div>
    </aside>
  );
}
