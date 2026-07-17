import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { Card } from '../common/Card';
import { colors, spacing, typography } from '../../theme';

export function ReportsScreen() {
  const { state } = useApp();
  const { tasks, members, projects } = state.data;

  const totalTasks = tasks.length;
  const completed = tasks.filter((t) => t.status === 'done').length;
  const overdue = tasks.filter(
    (t) => t.status !== 'done' && new Date(t.deadline) < new Date(),
  ).length;
  const completionRate = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

  const tasksByStatus = [
    {
      label: 'Backlog',
      count: tasks.filter((t) => t.status === 'backlog').length,
      color: '#5c6280',
    },
    {
      label: 'In Testing',
      count: tasks.filter((t) => t.status === 'in-testing').length,
      color: '#3b82f6',
    },
    {
      label: 'Evaluating',
      count: tasks.filter((t) => t.status === 'evaluating').length,
      color: '#ffb830',
    },
    {
      label: 'Reporting',
      count: tasks.filter((t) => t.status === 'reporting').length,
      color: '#a855f7',
    },
    { label: 'Done', count: completed, color: '#00c48c' },
  ];

  const memberStats = members.map((m) => ({
    name: m.name,
    total: tasks.filter((t) => t.assigneeId === m.id).length,
    done: tasks.filter((t) => t.assigneeId === m.id && t.status === 'done').length,
  }));

  const projectStats = projects.map((p) => ({
    name: p.name,
    total: tasks.filter((t) => t.projectId === p.id).length,
    done: tasks.filter((t) => t.projectId === p.id && t.status === 'done').length,
  }));

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing['5xl'] }}
      data={[]}
      ListHeaderComponent={() => (
        <>
          <Text style={styles.title}>Work Reports</Text>

          {/* Overview stats */}
          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{totalTasks}</Text>
              <Text style={styles.statLabel}>Total Tasks</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={[styles.statValue, { color: colors.semantic.success }]}>
                {completed}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={[styles.statValue, { color: colors.semantic.danger }]}>{overdue}</Text>
              <Text style={styles.statLabel}>Overdue</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={[styles.statValue, { color: colors.semantic.info }]}>
                {completionRate}%
              </Text>
              <Text style={styles.statLabel}>Rate</Text>
            </Card>
          </View>

          {/* By status */}
          <Text style={styles.sectionTitle}>By Status</Text>
          <Card style={{ marginBottom: spacing.xl }}>
            {tasksByStatus.map((s) => (
              <View key={s.label} style={styles.barRow}>
                <Text style={styles.barLabel}>{s.label}</Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${totalTasks > 0 ? (s.count / totalTasks) * 100 : 0}%`,
                        backgroundColor: s.color,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barCount}>{s.count}</Text>
              </View>
            ))}
          </Card>

          {/* By member */}
          <Text style={styles.sectionTitle}>By Member</Text>
          <Card style={{ marginBottom: spacing.xl }}>
            {memberStats.map((m) => (
              <View key={m.name} style={styles.listRow}>
                <Text style={styles.rowText}>{m.name}</Text>
                <Text style={styles.rowValue}>
                  {m.done}/{m.total}
                </Text>
              </View>
            ))}
          </Card>

          {/* By project */}
          <Text style={styles.sectionTitle}>By Project</Text>
          <Card>
            {projectStats.map((p) => (
              <View key={p.name} style={styles.listRow}>
                <Text style={styles.rowText}>{p.name}</Text>
                <Text style={styles.rowValue}>
                  {p.done}/{p.total}
                </Text>
              </View>
            ))}
          </Card>
        </>
      )}
      renderItem={() => null}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  title: {
    fontSize: typography.size['2xl'],
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing['2xl'],
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing['2xl'],
  },
  statCard: { flex: 1, minWidth: '45%', alignItems: 'center', paddingVertical: spacing.lg },
  statValue: { fontSize: typography.size['3xl'], fontWeight: '700', color: colors.text.primary },
  statLabel: { fontSize: typography.size.sm, color: colors.text.muted, marginTop: spacing.xs },
  sectionTitle: {
    fontSize: typography.size.md,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  barLabel: { width: 90, fontSize: typography.size.sm, color: colors.text.secondary },
  barTrack: { flex: 1, height: 8, backgroundColor: colors.bg.tertiary, borderRadius: 4 },
  barFill: { height: '100%', borderRadius: 4 },
  barCount: {
    width: 30,
    textAlign: 'right',
    fontSize: typography.size.sm,
    color: colors.text.primary,
    fontWeight: '600',
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface.border,
  },
  rowText: { fontSize: typography.size.base, color: colors.text.primary },
  rowValue: { fontSize: typography.size.base, color: colors.text.secondary, fontWeight: '600' },
});
