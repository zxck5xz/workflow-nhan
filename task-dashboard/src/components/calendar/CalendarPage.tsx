import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button, TaskFormModal } from '../common';
import PageHelp from '../common/PageHelp';
import { getMonthCalendarDays, isSameDay } from '../../utils';
import type { Task } from '../../types';
import './CalendarPage.css';

export function CalendarPage() {
  const { state, dispatch } = useApp();
  const { tasks } = state.data;
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const days = useMemo(() => getMonthCalendarDays(year, month), [year, month]);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach(task => {
      // task.deadline is YYYY-MM-DD
      const dateKey = task.deadline;
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(task);
    });
    return map;
  }, [tasks]);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;

    const task = tasks.find(t => t.id === taskId);
    if (task && task.deadline !== dateStr) {
      dispatch({
        type: 'UPDATE_TASK',
        payload: { ...task, deadline: dateStr }
      });
    }
  };

  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setShowAddModal(true);
  };

  return (
    <div className="calendar-page animate-fade-in">
      <div className="page-header">
        <h1>📅 Lịch công việc</h1>
        <div className="calendar-header-actions">
          <div className="calendar-nav">
            <Button variant="secondary" onClick={prevMonth}>◀</Button>
            <Button variant="ghost" onClick={goToToday}>Hôm nay</Button>
            <Button variant="secondary" onClick={nextMonth}>▶</Button>
          </div>
          <h2 className="calendar-title">
            Tháng {month + 1}, {year}
          </h2>
          <Button variant="primary" onClick={() => { setSelectedDate(null); setShowAddModal(true); }}>
            + Thêm công việc
          </Button>
          <PageHelp title="Hướng dẫn sử dụng - Lịch">
            <h4>Tổng quan</h4>
            <p>Hiển thị lịch tháng và các task theo ngày. Kéo thả task để thay đổi deadline nhanh.</p>
            <h5>Tương tác</h5>
            <ul>
              <li>Nhấn ngày để tạo task mới trên ngày đó.</li>
              <li>Kéo một task sang ô khác để thay đổi ngày hoàn thành.</li>
              <li>Nhấn task để mở form chỉnh sửa.</li>
            </ul>
          </PageHelp>
        </div>
      </div>

      <div className="calendar-grid">
        {/* Weekday headers */}
        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}

        {/* Days */}
        {days.map((day, idx) => {
          const dateStr = day.toISOString().split('T')[0];
          const isCurrentMonth = day.getMonth() === month;
          const isToday = isSameDay(day, new Date());
          const dayTasks = tasksByDate.get(dateStr) || [];

          return (
            <div 
              key={`${dateStr}-${idx}`}
              className={`calendar-cell ${!isCurrentMonth ? 'calendar-cell--other-month' : ''} ${isToday ? 'calendar-cell--today' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, dateStr)}
              onClick={(e) => {
                // Prevent triggering add when clicking on a task
                if ((e.target as HTMLElement).closest('.calendar-task')) return;
                handleDayClick(dateStr);
              }}
            >
              <div className="calendar-cell__header">
                <span className="calendar-cell__date">{day.getDate()}</span>
                {dayTasks.length > 0 && <span className="calendar-cell__count">{dayTasks.length}</span>}
              </div>
              <div className="calendar-cell__tasks">
                {dayTasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`calendar-task priority-${task.priority.toLowerCase()} ${task.status === 'done' ? 'calendar-task--done' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditTask(task);
                    }}
                  >
                    <span className="calendar-task__title">{task.title}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      <TaskFormModal
        isOpen={showAddModal || !!editTask}
        task={editTask || (selectedDate ? { deadline: selectedDate } as Partial<Task> as Task : null)}
        onClose={() => { setShowAddModal(false); setEditTask(null); setSelectedDate(null); }}
        onSave={(t) => {
          if (editTask) dispatch({ type: 'UPDATE_TASK', payload: t });
          else dispatch({ type: 'ADD_TASK', payload: t });
          setShowAddModal(false); setEditTask(null); setSelectedDate(null);
        }}
        onDelete={editTask ? () => {
          if (confirm(`Xóa task "${editTask.title}"?`)) {
            dispatch({ type: 'DELETE_TASK', payload: editTask.id });
            setEditTask(null);
          }
        } : undefined}
      />
    </div>
  );
}
