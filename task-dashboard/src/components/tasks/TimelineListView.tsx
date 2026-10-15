import { Fragment, useMemo, useState, type CSSProperties } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button, EmptyState } from '../common';
import { AlertBadge } from './DeadlineAlerts';
import { ACTIVE_ALERTS, ALERT_META, getAlertLevel, isTaskCompleted } from '../../utils/deadline';
import { formatDate, formatRelativeDate, getDaysUntilDeadline } from '../../utils';
import {
  buildTeamColors,
  findDepartment,
  teamKey,
  UNASSIGNED_TEAM_COLOR,
} from '../../utils/teamColor';
import { UNASSIGNED_TEAM } from '../../utils/timelineImport';
import type { Project, Task } from '../../types';

type SortKey = 'code' | 'start' | 'deadline' | 'alert' | 'progress';

const collator = new Intl.Collator('vi', { numeric: true });

const GROUP_KEY = 'timeline-list-group-by-team';

function readGroupPref(): boolean {
  try {
    return localStorage.getItem(GROUP_KEY) === '1';
  } catch {
    return false;
  }
}

interface TeamGroup {
  team: string;
  total: number;
  done: number;
  urgent: number; // overdue, due today or within 7 days
}

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
  const { state } = useApp();
  const [groupByTeam, setGroupByTeam] = useState(readGroupPref);
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());

  const toggleGrouping = () => {
    setGroupByTeam((on) => {
      try {
        localStorage.setItem(GROUP_KEY, on ? '0' : '1');
      } catch {
        // storage blocked — preference just isn't remembered
      }
      return !on;
    });
  };

  const toggleCollapsed = (team: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(team)) next.delete(team);
      else next.add(team);
      return next;
    });

  // Colors come from every team in the app, so filtering doesn't reshuffle them
  const teamColors = useMemo(
    () =>
      buildTeamColors(
        state.data.tasks.flatMap((t) => (t.timeline ? [t.timeline.team] : [])),
        state.data.departments,
      ),
    [state.data.tasks, state.data.departments],
  );

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

  const groups = useMemo(() => {
    if (!groupByTeam) return null;
    const byTeam = new Map<string, TeamGroup>();
    for (const t of sorted) {
      const team = t.timeline?.team ?? UNASSIGNED_TEAM;
      const g = byTeam.get(team) ?? { team, total: 0, done: 0, urgent: 0 };
      g.total++;
      if (isTaskCompleted(t)) g.done++;
      else if (ACTIVE_ALERTS.includes(getAlertLevel(t))) g.urgent++;
      byTeam.set(team, g);
    }
    const rank = (team: string) => {
      if (team === UNASSIGNED_TEAM) return Number.MAX_SAFE_INTEGER;
      const dept = findDepartment(state.data.departments, team);
      return dept ? dept.order : 10_000;
    };
    return [...byTeam.values()].sort(
      (a, b) => rank(a.team) - rank(b.team) || collator.compare(a.team, b.team),
    );
  }, [groupByTeam, sorted, state.data.departments]);

  // Rows in display order: grouped by team (keeping the sort inside each group)
  const rows = useMemo(() => {
    if (!groups) return sorted;
    const order = new Map(groups.map((g, i) => [teamKey(g.team), i]));
    const pos = (t: Task) => order.get(teamKey(t.timeline?.team ?? UNASSIGNED_TEAM)) ?? 0;
    return [...sorted].sort((a, b) => pos(a) - pos(b)); // stable sort
  }, [groups, sorted]);

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
  const showPhases = sortKey === 'code' && sortDir === 1 && !showProject && !groupByTeam;
  let lastPhase: string | undefined;
  let lastTeam: string | undefined;
  const colCount = showProject ? 11 : 10;
  const groupByName = new Map(groups?.map((g) => [teamKey(g.team), g]));

  return (
    <div className="pc-view-list tl-list">
      <div className="tl-toolbar">
        <button
          type="button"
          className={`tl-toggle ${groupByTeam ? 'tl-toggle--on' : ''}`}
          aria-pressed={groupByTeam}
          onClick={toggleGrouping}
        >
          👥 Gom theo team
        </button>
        {groups && groups.length > 1 && (
          <>
            <button
              type="button"
              className="tl-toolbar__link"
              onClick={() => setCollapsed(new Set(groups.map((g) => teamKey(g.team))))}
            >
              Thu gọn tất cả
            </button>
            <button
              type="button"
              className="tl-toolbar__link"
              onClick={() => setCollapsed(new Set())}
            >
              Mở tất cả
            </button>
          </>
        )}
      </div>
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
          {rows.map((task) => {
            const tl = task.timeline;
            const team = tl?.team ?? UNASSIGNED_TEAM;
            const key = teamKey(team);
            const group = groupByName.get(key);
            const teamColor = teamColors.get(team) ?? UNASSIGNED_TEAM_COLOR;
            const teamRow =
              group && key !== lastTeam ? (
                <tr
                  className={`tl-team-row ${collapsed.has(key) ? 'tl-team-row--collapsed' : ''}`}
                  style={{ '--team-color': teamColor } as CSSProperties}
                  onClick={() => toggleCollapsed(key)}
                >
                  <td colSpan={colCount}>
                    <div className="tl-team-row__inner">
                      <span className="tl-team-row__caret">▾</span>
                      <span
                        className="tl-team"
                        style={{ '--team-color': teamColor } as CSSProperties}
                      >
                        {group.team}
                      </span>
                      <span className="tl-team-row__stat">{group.total} task</span>
                      <span className="tl-team-row__stat tl-team-row__stat--done">
                        ✓ {group.done}/{group.total}
                      </span>
                      {group.urgent > 0 && (
                        <span className="tl-team-row__stat tl-team-row__stat--urgent">
                          ⚠ {group.urgent} cần xử lý
                        </span>
                      )}
                      <span className="tl-team-row__bar">
                        <span style={{ width: `${(group.done / group.total) * 100}%` }} />
                      </span>
                    </div>
                  </td>
                </tr>
              ) : null;
            if (group) lastTeam = key;
            if (group && collapsed.has(key))
              return teamRow && <Fragment key={task.id}>{teamRow}</Fragment>;
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
                {teamRow}
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
                    {tl ? (
                      <span
                        className="tl-team"
                        style={
                          {
                            '--team-color': teamColor,
                          } as CSSProperties
                        }
                      >
                        {tl.team}
                      </span>
                    ) : (
                      '—'
                    )}
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
