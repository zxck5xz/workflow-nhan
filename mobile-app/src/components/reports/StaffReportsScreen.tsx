import { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { Card } from '../common/Card';
import { Avatar } from '../common/Avatar';
import { colors, spacing, borderRadius, typography } from '../../theme';
import type { MemberPerformance } from '../../types';

export function StaffReportsScreen() {
  const { state } = useApp();
  const { tasks, members, statuses } = state.data;

  const performances = useMemo(() => {
    return members.map(
      (m): MemberPerformance & { name: string; initials: string; color: string } => {
        const memberTasks = tasks.filter((t) => t.assigneeId === m.id);
        const completed = memberTasks.filter((t) => t.status === 'done');
        const onTime = completed.filter(
          (t) => !t.completedAt || new Date(t.completedAt) <= new Date(t.deadline),
        );

        return {
          memberId: m.id,
          name: m.name,
          initials: m.initials,
          color: m.avatarColor,
          totalTasks: memberTasks.length,
          completedTasks: completed.length,
          onTimeRate:
            completed.length > 0 ? Math.round((onTime.length / completed.length) * 100) : 0,
          avgWeight:
            memberTasks.length > 0
              ? Math.round(memberTasks.reduce((s, t) => s + t.weight, 0) / memberTasks.length)
              : 0,
          avgCompletionDays: 0,
          tasksByPriority: {
            P0: memberTasks.filter((t) => t.priority === 'P0').length,
            P1: memberTasks.filter((t) => t.priority === 'P1').length,
            P2: memberTasks.filter((t) => t.priority === 'P2').length,
          },
          tasksByStatus: Object.fromEntries(
            statuses.map((s) => [s.id, memberTasks.filter((t) => t.status === s.id).length]),
          ) as any,
        };
      },
    );
  }, [tasks, members, statuses]);

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing['5xl'] }}
      data={performances}
      keyExtractor={(m) => m.memberId}
      ListHeaderComponent={() => <Text style={styles.title}>Staff Reports</Text>}
      renderItem={({ item }) => (
        <Card style={{ marginBottom: spacing.md }}>
          <View style={styles.header}>
            <Avatar initials={item.initials} color={item.color} size={36} />
            <View style={{ marginLeft: spacing.md, flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>
                {item.completedTasks}/{item.totalTasks} tasks completed
              </Text>
            </View>
            <Text
              style={[
                styles.rate,
                {
                  color:
                    item.onTimeRate >= 80
                      ? colors.semantic.success
                      : item.onTimeRate >= 50
                        ? colors.semantic.warning
                        : colors.semantic.danger,
                },
              ]}
            >
              {item.onTimeRate}%
            </Text>
          </View>

          {/* Priority breakdown */}
          <View style={styles.barRow}>
            {(['P0', 'P1', 'P2'] as const).map((p) => (
              <View key={p} style={styles.priorityItem}>
                <Text
                  style={[
                    styles.priorityCount,
                    {
                      color:
                        p === 'P0'
                          ? colors.semantic.danger
                          : p === 'P1'
                            ? colors.accent.default
                            : colors.text.muted,
                    },
                  ]}
                >
                  {item.tasksByPriority[p]}
                </Text>
                <Text style={styles.priorityLabel}>{p}</Text>
              </View>
            ))}
            <View style={styles.priorityItem}>
              <Text style={styles.priorityCount}>{item.avgWeight}</Text>
              <Text style={styles.priorityLabel}>Avg Wt</Text>
            </View>
          </View>

          {/* Status breakdown */}
          <View style={styles.statusRow}>
            {Object.entries(item.tasksByStatus)
              .filter(([_, count]) => count > 0)
              .map(([statusId, count]) => (
                <View key={statusId} style={styles.statusChip}>
                  <Text style={styles.statusText}>
                    {statuses.find((s) => s.id === statusId)?.label || statusId}: {count}
                  </Text>
                </View>
              ))}
          </View>
        </Card>
      )}
      ListEmptyComponent={
        <Text style={{ color: colors.text.muted, textAlign: 'center', marginTop: spacing['3xl'] }}>
          No members found.
        </Text>
      }
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
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  name: { fontSize: typography.size.md, fontWeight: '600', color: colors.text.primary },
  meta: { fontSize: typography.size.sm, color: colors.text.muted, marginTop: 2 },
  rate: { fontSize: typography.size.xl, fontWeight: '700' },
  barRow: { flexDirection: 'row', gap: spacing.lg, marginBottom: spacing.md },
  priorityItem: { alignItems: 'center' },
  priorityCount: { fontSize: typography.size.lg, fontWeight: '700', color: colors.text.primary },
  priorityLabel: { fontSize: typography.size.xs, color: colors.text.muted },
  statusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  statusChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    backgroundColor: colors.bg.tertiary,
  },
  statusText: { fontSize: typography.size.xs, color: colors.text.secondary },
});
