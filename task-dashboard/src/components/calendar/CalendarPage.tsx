import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button, TaskFormModal } from '../common';
import PageHelp from '../common/PageHelp';
import { formatDate, getMonthCalendarDays, isSameDay, toDateKey } from '../../utils';
import type { Task } from '../../types';
import './CalendarPage.css';

// Tasks shown per cell before collapsing the rest into "+N khác"
const MAX_VISIBLE_TASKS = 3;
const PRIORITY_ORDER: Record<Task['priority'], number> = { P0: 0, P1: 1, P2: 2 };

// Open (not done) tasks only — finished work doesn't make a day busy
function loadLevel(openCount: number): 'low' | 'mid' | 'high' | null {
  if (openCount === 0) return null;
  if (openCount <= 2) return 'low';
  if (openCount <= 4) return 'mid';
  return 'high';
}

interface DayPopover {
  dateStr: string;
  top: number;
  left: number;
  width: number;
}

export function CalendarPage() {
  const { state, dispatch } = useApp();
  const { tasks } = state.data;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [popover, setPopover] = useState<DayPopover | null>(null);
  const [draggingFromPopover, setDraggingFromPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const days = useMemo(() => getMonthCalendarDays(year, month), [year, month]);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach((task) => {
      // task.deadline is YYYY-MM-DD
      const dateKey = task.deadline;
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(task);
    });
    // Open tasks first by priority, finished ones last
    map.forEach((list) =>
      list.sort(
        (a, b) =>
          Number(a.status === 'done') - Number(b.status === 'done') ||
          PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority],
      ),
    );
    return map;
  }, [tasks]);

  useEffect(() => {
    if (!popover) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!popoverRef.current?.contains(e.target as Node)) setPopover(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPopover(null);
    };
    const close = () => setPopover(null);
    const onScroll = (e: Event) => {
      if (!popoverRef.current?.contains(e.target as Node)) setPopover(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', close);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', close);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [popover]);

  const openPopover = (e: React.MouseEvent, dateStr: string) => {
    e.stopPropagation();
    const cell = (e.currentTarget as HTMLElement)
      .closest('.calendar-cell')!
      .getBoundingClientRect();
    const width = Math.max(cell.width + 40, 260);
    setPopover({
      dateStr,
      top: Math.max(8, Math.min(cell.top, window.innerHeight - 360)),
      left: Math.max(8, Math.min(cell.left - 20, window.innerWidth - width - 8)),
      width,
    });
  };

  const renderTask = (task: Task, inPopover = false) => (
    <div
      key={task.id}
      className={`calendar-task priority-${task.priority.toLowerCase()} ${task.status === 'done' ? 'calendar-task--done' : ''}`}
      draggable
      title={task.title}
      onDragStart={(e) => {
        handleDragStart(e, task.id);
        // keep the source mounted while dragging, just let drops reach the cells below
        if (inPopover) setDraggingFromPopover(true);
      }}
      onDragEnd={() => {
        if (inPopover) {
          setDraggingFromPopover(false);
          setPopover(null);
        }
      }}
      onClick={(e) => {
        e.stopPropagation();
        setPopover(null);
        setEditTask(task);
      }}
    >
      <span className="calendar-task__title">
        {task.status === 'done' && '✓ '}
        {task.title}
      </span>
    </div>
  );

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

    const task = tasks.find((t) => t.id === taskId);
    if (task && task.deadline !== dateStr) {
      dispatch({
        type: 'UPDATE_TASK',
        payload: { ...task, deadline: dateStr },
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
            <Button variant="secondary" onClick={prevMonth}>
              ◀
            </Button>
            <Button variant="ghost" onClick={goToToday}>
              Hôm nay
            </Button>
            <Button variant="secondary" onClick={nextMonth}>
              ▶
            </Button>
          </div>
          <h2 className="calendar-title">
            Tháng {month + 1}, {year}
          </h2>
          <Button
            variant="primary"
            onClick={() => {
              setSelectedDate(null);
              setShowAddModal(true);
            }}
          >
            + Thêm công việc
          </Button>
          <PageHelp title="Hướng dẫn sử dụng - Lịch">
            <h4>Tổng quan</h4>
            <p>
              Hiển thị lịch tháng và các task theo ngày. Kéo thả task để thay đổi deadline nhanh.
            </p>
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
        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}

        {/* Days */}
        {days.map((day, idx) => {
          const dateStr = toDateKey(day);
          const isCurrentMonth = day.getMonth() === month;
          const isToday = isSameDay(day, new Date());
          const dayTasks = tasksByDate.get(dateStr) || [];
          const openCount = dayTasks.filter((t) => t.status !== 'done').length;
          const load = loadLevel(openCount);
          const overflow = dayTasks.length > MAX_VISIBLE_TASKS;
          const visibleTasks = overflow ? dayTasks.slice(0, MAX_VISIBLE_TASKS - 1) : dayTasks;

          return (
            <div
              key={`${dateStr}-${idx}`}
              className={`calendar-cell ${!isCurrentMonth ? 'calendar-cell--other-month' : ''} ${isToday ? 'calendar-cell--today' : ''} ${load ? `calendar-cell--load-${load}` : ''}`}
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
                {dayTasks.length > 0 && (
                  <span
                    className={`calendar-cell__count ${openCount === 0 ? 'calendar-cell__count--done' : ''}`}
                    title={`${openCount} chưa xong / ${dayTasks.length} task`}
                  >
                    {openCount === 0
                      ? `✓ ${dayTasks.length}`
                      : openCount < dayTasks.length
                        ? `${openCount}/${dayTasks.length}`
                        : dayTasks.length}
                  </span>
                )}
              </div>
              <div className="calendar-cell__tasks">
                {visibleTasks.map((task) => renderTask(task))}
                {overflow && (
                  <button
                    type="button"
                    className="calendar-cell__more"
                    onClick={(e) => openPopover(e, dateStr)}
                  >
                    +{dayTasks.length - visibleTasks.length} khác
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {popover && (
        <div
          ref={popoverRef}
          className={`calendar-popover ${draggingFromPopover ? 'calendar-popover--dragging' : ''}`}
          style={{ top: popover.top, left: popover.left, width: popover.width }}
          role="dialog"
          aria-label={`Task ngày ${formatDate(popover.dateStr)}`}
        >
          <div className="calendar-popover__header">
            <span>{formatDate(popover.dateStr)}</span>
            <button
              type="button"
              className="calendar-popover__close"
              aria-label="Đóng"
              onClick={() => setPopover(null)}
            >
              ✕
            </button>
          </div>
          <div className="calendar-popover__tasks">
            {(tasksByDate.get(popover.dateStr) || []).map((task) => renderTask(task, true))}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <TaskFormModal
        isOpen={showAddModal || !!editTask}
        task={
          editTask || (selectedDate ? ({ deadline: selectedDate } as Partial<Task> as Task) : null)
        }
        onClose={() => {
          setShowAddModal(false);
          setEditTask(null);
          setSelectedDate(null);
        }}
        onSave={(t) => {
          if (editTask) dispatch({ type: 'UPDATE_TASK', payload: t });
          else dispatch({ type: 'ADD_TASK', payload: t });
          setShowAddModal(false);
          setEditTask(null);
          setSelectedDate(null);
        }}
        onDelete={
          editTask
            ? () => {
                if (confirm(`Xóa task "${editTask.title}"?`)) {
                  dispatch({ type: 'DELETE_TASK', payload: editTask.id });
                  setEditTask(null);
                }
              }
            : undefined
        }
      />
    </div>
  );
}
