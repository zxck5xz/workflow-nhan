import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { Button, Avatar, EmptyState } from '../common';
import PageHelp from '../common/PageHelp';
import type { Member } from '../../types';
import './UserManagementPage.css';

const ROLES = ['ADMIN', 'MANAGER', 'TESTER', 'VIEWER'];

export function UserManagementPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await authService.getUsers();
      setUsers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await authService.updateUserRole(userId, newRole);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err: any) {
      alert(err.message || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === currentUser?.id) {
      alert('You cannot delete your own account');
      return;
    }

    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await authService.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
    }
  };

  if (currentUser?.role !== 'ADMIN') {
    return (
      <div className="user-management-page">
        <EmptyState 
          icon="🚫" 
          title="Access Denied" 
          description="You do not have permission to view this page. Only administrators can manage users." 
        />
      </div>
    );
  }

  return (
    <div className="user-management-page">
      <div className="page-header">
        <h1>👥 Quản lý User</h1>
        <div className="header-actions">
          <Button variant="secondary" onClick={fetchUsers}>🔄 Refresh</Button>
          <PageHelp title="Hướng dẫn - Quản lý User">
            <h4>Phân quyền hệ thống</h4>
            <p>Admin có thể thay đổi vai trò của các thành viên hoặc xóa tài khoản khỏi hệ thống.</p>
            <ul>
              <li><strong>ADMIN:</strong> Toàn quyền hệ thống.</li>
              <li><strong>MANAGER:</strong> Quản lý task, xem báo cáo nhân sự.</li>
              <li><strong>TESTER:</strong> Thực hiện test, đánh giá game.</li>
              <li><strong>VIEWER:</strong> Chỉ xem dữ liệu.</li>
            </ul>
          </PageHelp>
        </div>
      </div>

      <div className="users-container stagger-children">
        {loading ? (
          <div className="loading-state">Loading users...</div>
        ) : error ? (
          <div className="error-state">{error}</div>
        ) : users.length === 0 ? (
          <EmptyState icon="👥" title="No users found" />
        ) : (
          <div className="users-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className={user.id === currentUser?.id ? 'current-user-row' : ''}>
                    <td>
                      <div className="user-cell">
                        <Avatar initials={user.initials} color={user.avatarColor} size="sm" />
                        <div className="user-info">
                          <span className="user-name">{user.name}</span>
                          {user.id === currentUser?.id && <span className="self-badge">(You)</span>}
                        </div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <select 
                        className="role-select"
                        value={user.role}
                        onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                        disabled={user.id === currentUser?.id}
                      >
                        {ROLES.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </td>
                    <td>{new Date(user.joinedAt).toLocaleDateString()}</td>
                    <td>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.id === currentUser?.id}
                        className="delete-btn"
                      >
                        🗑️
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
