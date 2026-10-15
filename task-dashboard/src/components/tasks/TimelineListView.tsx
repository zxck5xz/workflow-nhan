import { Fragment, useMemo, useState } from 'react';
import { Button, EmptyState } from '../common';
import { AlertBadge } from './DeadlineAlerts';
import { ALERT_META, getAlertLevel } from '../../utils/deadline';
import { formatDate, formatRelativeDate, getDaysUntilDeadline } from '../../utils';
import type { Project, Task } from '../../types';

type SortKey = 'code' | 'start' | 'deadline' | 'alert' | 'progress';

const collator = new Intl.Collator('vi', { numeric: true });

interface TimelineListViewProps {
  tasks: Task[];
  projects: Project[];
  showProject: boolean;
  onEditTask: (t: Task) => void;
}

/** Bảng task import từ timeline: ID, đầu việc, team, lịch, tiến độ, cảnh báo. */
export function TimelineListView({
  tasks,
  projects,
  showProject,
  onEditTask,
}: TimelineListViewProps) {
  const [sortKey, setSortKey] = useState<SortKey>('code');
  const [sortDir, setSortDir] = useState<1 | -1>(1);

  const sorted = useMemo(() => {
    const key = (t: Task): string | number => {
      switch (sortKey) {
        case 'code':
          return t.timeline?.code ?? '';
        case 'start':
          return t.timeline?.startDate ?? t.deadline;
        case 'deadline':
          return t.deadline;
        case 'alert':
          return -ALERT_META[getAlertLevel(t)].rank * 10_000 + getDaysUntilDeadline(t.deadline);
        case 'progress':
          return t.timeline?.progress ?? (t.status === 'done' ? 100 : 0);
      }
    };
    return [...tasks].sort((a, b) => {
      const ka = key(a);
      const kb = key(b);
      const cmp =
        typeof ka === 'number' && typeof kb === 'number'
          ? ka - kb
          : collator.compare(String(ka), String(kb));
      return (cmp || collator.compare(a.timeline?.code ?? '', b.timeline?.code ?? '')) * sortDir;
    });
  }, [tasks, sortKey, sortDir]);

  if (tasks.length === 0)
    return (
      <EmptyState
        icon="📝"
        title="Không có task"
        description="Thử đổi bộ lọc hoặc import timeline."
      />
    );

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir((d) => (d === 1 ? -1 : 1));
    else {
      setSortKey(k);
      setSortDir(1);
    }
  };

  const th = (label: string, k: SortKey, className = '') => (
    <th className={`sortable ${className}`} onClick={() => toggleSort(k)}>
      {label}
      <span className={`sort-indicator ${sortKey === k ? 'sort-indicator--active' : ''}`}>
        {sortKey === k ? (sortDir === 1 ? '▲' : '▼') : '⇅'}
      </span>
    </th>
  );

  // Phase separators only make sense in the original Excel order
  const showPhases = sortKey === 'code' && sortDir === 1 && !showProject;
  let lastPhase: string | undefined;

  return (
    <div className="pc-view-list tl-list">
      <table className="data-table">
        <thead>
          <tr>
            {th('ID', 'code', 'tl-col-sticky tl-col-id')}
            <th className="tl-col-sticky tl-col-name">Đầu việc</th>
            {showProject && <th>Dự án</th>}
            <th>Team</th>
            {th('Bắt đầu', 'start')}
            <th>Thời lượng</th>
            <th>Hoàn thành</th>
            {th('Deadline', 'deadline')}
            {th('Tiến độ', 'progress')}
            {th('Cảnh báo', 'alert')}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((task) => {
            const tl = task.timeline;
            const level = getAlertLevel(task);
            const project = projects.find((p) => p.id === task.projectId);
            const progress = tl?.progress ?? (task.status === 'done' ? 100 : 0);
            const phaseRow =
              showPhases && tl?.phase && tl.phase !== lastPhase ? (
                <tr className="tl-phase-row">
                  <td colSpan={10}>{tl.phase}</td>
                </tr>
              ) : null;
            if (showPhases) lastPhase = tl?.phase;
            return (
              <Fragment key={task.id}>
                {phaseRow}
                <tr className={`tl-row tl-row--${level}`}>
                  <td className="tl-col-sticky tl-col-id">{tl?.code ?? '—'}</td>
                  <td className="tl-col-sticky tl-col-name">
                    <span className="pc-task-title" onClick={() => onEditTask(task)}>
                      {task.title}
                    </span>
                  </td>
                  {showProject && (
                    <td>
                      {project && (
                        <span className="tl-project">
                          <span className="pc-sidebar__dot" style={{ background: project.color }} />
                          {project.name}
                        </span>
                      )}
                    </td>
                  )}
                  <td>
                    <span className="tl-team">{tl?.team ?? '—'}</span>
                  </td>
                  <td>{tl ? formatDate(tl.startDate) : '—'}</td>
                  <td>{tl ? `${tl.duration} ngày` : '—'}</td>
                  <td>{tl ? formatDate(tl.completionDate) : '—'}</td>
                  <td>
                    <div className="tl-deadline">
                      <span>{formatDate(task.deadline)}</span>
                      {level !== 'completed' && level !== 'normal' && (
                        <span className={`tl-deadline__rel tl-deadline__rel--${level}`}>
                          {formatRelativeDate(task.deadline)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="tl-progress" title={`${progress}%`}>
                      <div className="tl-progress__bar">
                        <div
                          className="tl-progress__fill"
                          style={{
                            width: `${progress}%`,
                            background:
                              progress >= 100 ? 'var(--color-success)' : 'var(--color-info)',
                          }}
                        />
                      </div>
                      <span>{progress}%</span>
                    </div>
                  </td>
                  <td>
                    <AlertBadge task={task} />
                  </td>
                  <td>
                    <Button variant="ghost" size="sm" onClick={() => onEditTask(task)}>
                      ✏️
                    </Button>
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
