import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';
import { colors, spacing, typography } from '../../theme';

export function CodeAnalysisScreen() {
  const { state } = useApp();
  const { projects, tasks, members } = state.data;

  const projectStats = projects.map((p) => ({
    name: p.name,
    totalTasks: tasks.filter((t) => t.projectId === p.id).length,
    completionRate: (() => {
      const projectTasks = tasks.filter((t) => t.projectId === p.id);
      if (projectTasks.length === 0) return 0;
      return Math.round(
        (projectTasks.filter((t) => t.status === 'done').length / projectTasks.length) * 100,
      );
    })(),
    activeTesters: new Set(tasks.filter((t) => t.projectId === p.id).map((t) => t.assigneeId)).size,
  }));

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing['5xl'] }}
      data={[]}
      ListHeaderComponent={() => (
        <>
          <Text style={styles.title}>Code Analysis</Text>

          <Card style={{ marginBottom: spacing.xl }}>
            <Text style={styles.statTitle}>System Overview</Text>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{projects.length}</Text>
                <Text style={styles.statLabel}>Projects</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{tasks.length}</Text>
                <Text style={styles.statLabel}>Total Tasks</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{members.length}</Text>
                <Text style={styles.statLabel}>Members</Text>
              </View>
            </View>
          </Card>

          <Text style={styles.sectionTitle}>Project Analysis</Text>
          {projectStats.length === 0 ? (
            <EmptyState icon="🔍" title="No data" description="No projects to analyze." />
          ) : (
            projectStats.map((p, i) => (
              <Card key={i} style={{ marginBottom: spacing.md }}>
                <Text style={styles.projectName}>{p.name}</Text>
                <View style={styles.metricsRow}>
                  <View style={styles.metric}>
                    <Text style={styles.metricValue}>{p.totalTasks}</Text>
                    <Text style={styles.metricLabel}>Tasks</Text>
                  </View>
                  <View style={styles.metric}>
                    <Text
                      style={[
                        styles.metricValue,
                        {
                          color:
                            p.completionRate >= 80
                              ? colors.semantic.success
                              : colors.semantic.warning,
                        },
                      ]}
                    >
                      {p.completionRate}%
                    </Text>
                    <Text style={styles.metricLabel}>Done</Text>
                  </View>
                  <View style={styles.metric}>
                    <Text style={styles.metricValue}>{p.activeTesters}</Text>
                    <Text style={styles.metricLabel}>Testers</Text>
                  </View>
                </View>
              </Card>
            ))
          )}
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
  statTitle: {
    fontSize: typography.size.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  statRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: typography.size['3xl'], fontWeight: '700', color: colors.text.primary },
  statLabel: { fontSize: typography.size.sm, color: colors.text.muted },
  sectionTitle: {
    fontSize: typography.size.md,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  projectName: {
    fontSize: typography.size.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  metric: { alignItems: 'center' },
  metricValue: { fontSize: typography.size.xl, fontWeight: '700', color: colors.text.primary },
  metricLabel: { fontSize: typography.size.xs, color: colors.text.muted },
});
