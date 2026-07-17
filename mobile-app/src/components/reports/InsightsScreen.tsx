import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { Card } from '../common/Card';
import { EmptyState } from '../common/EmptyState';
import { colors, spacing, borderRadius, typography } from '../../theme';

export function InsightsScreen() {
  const { state } = useApp();
  const { insights, tasks } = state.data;

  const completed = tasks.filter((t) => t.status === 'done').length;
  const total = tasks.length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  function statusColor(s: string) {
    switch (s) {
      case 'excellent':
        return '#00c48c';
      case 'good':
        return '#3b82f6';
      case 'stable':
        return '#ffb830';
      case 'at-risk':
        return '#ff6b35';
      case 'critical':
        return '#ff4757';
      default:
        return '#5c6280';
    }
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing['5xl'] }}
      data={[]}
      ListHeaderComponent={() => (
        <>
          <Text style={styles.title}>Insights</Text>

          <Card style={{ marginBottom: spacing.xl }}>
            <Text style={styles.statTitle}>Overall Progress</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${completionRate}%` }]} />
            </View>
            <Text style={styles.statSub}>
              {completed}/{total} tasks ({completionRate}%)
            </Text>
          </Card>

          <Text style={styles.sectionTitle}>Weekly Insights</Text>
          {insights.length === 0 ? (
            <EmptyState
              icon="📊"
              title="No insights yet"
              description="Weekly summaries will appear here."
            />
          ) : (
            insights.map((insight) => (
              <Card key={insight.id} style={{ marginBottom: spacing.md }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing.sm,
                    marginBottom: spacing.sm,
                  }}
                >
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: statusColor(insight.overallStatus) },
                    ]}
                  />
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                </View>
                <Text style={styles.insightWeek}>{insight.week}</Text>
                {insight.highlights.length > 0 && (
                  <>
                    <Text style={styles.labelText}>Highlights</Text>
                    {insight.highlights.map((h, i) => (
                      <Text key={i} style={styles.bullet}>
                        • {h}
                      </Text>
                    ))}
                  </>
                )}
                {insight.risks.length > 0 && (
                  <>
                    <Text style={[styles.labelText, { color: colors.semantic.danger }]}>Risks</Text>
                    {insight.risks.map((r, i) => (
                      <Text key={i} style={styles.bullet}>
                        • {r}
                      </Text>
                    ))}
                  </>
                )}
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
    marginBottom: spacing.sm,
  },
  statSub: { fontSize: typography.size.sm, color: colors.text.muted, marginTop: spacing.sm },
  progressTrack: { height: 8, backgroundColor: colors.bg.tertiary, borderRadius: 4 },
  progressFill: { height: '100%', backgroundColor: colors.accent.default, borderRadius: 4 },
  sectionTitle: {
    fontSize: typography.size.md,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  insightTitle: {
    fontSize: typography.size.base,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  insightWeek: { fontSize: typography.size.xs, color: colors.text.muted, marginBottom: spacing.md },
  labelText: {
    fontSize: typography.size.sm,
    fontWeight: '600',
    color: colors.semantic.success,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  bullet: {
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    lineHeight: typography.leading.normal,
    paddingLeft: spacing.sm,
  },
});
