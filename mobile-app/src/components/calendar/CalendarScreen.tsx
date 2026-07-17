import { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { TaskCard } from '../tasks/TaskCard';
import { EmptyState } from '../common/EmptyState';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { formatDate, isOverdue } from '../../utils';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  format,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import type { Task, CalendarEvent } from '../../types';

export function CalendarScreen() {
  const { state } = useApp();
  const { tasks, members } = state.data;

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const days = useMemo(() => {
    return eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
  }, [currentMonth]);

  const events = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    tasks.forEach((t) => {
      const key = t.deadline.split('T')[0];
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push({ task: t, date: t.deadline, isOverdue: isOverdue(t) });
    });
    return map;
  }, [tasks]);

  const selectedEvents: CalendarEvent[] = events.get(format(selectedDate, 'yyyy-MM-dd')) || [];

  return (
    <View style={styles.container}>
      {/* Month header */}
      <View style={styles.monthHeader}>
        <TouchableOpacity onPress={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <Text style={styles.arrow}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>{format(currentMonth, 'MMMM yyyy')}</Text>
        <TouchableOpacity onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <Text style={styles.arrow}>▶</Text>
        </TouchableOpacity>
      </View>

      {/* Day names */}
      <View style={styles.weekRow}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <Text key={d} style={styles.weekDay}>
            {d}
          </Text>
        ))}
      </View>

      {/* Days grid */}
      <View style={styles.daysGrid}>
        {/* offset for first day of month */}
        {Array.from({ length: getDay(days[0]) }).map((_, i) => (
          <View key={`empty-${i}`} style={styles.dayCell} />
        ))}
        {days.map((day) => {
          const key = format(day, 'yyyy-MM-dd');
          const hasEvents = events.has(key);
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());
          return (
            <TouchableOpacity
              key={key}
              style={[styles.dayCell, isSelected && styles.daySelected, isToday && styles.dayToday]}
              onPress={() => setSelectedDate(day)}
            >
              <Text
                style={[
                  styles.dayNum,
                  isSelected && styles.dayNumSelected,
                  isToday && styles.dayNumToday,
                ]}
              >
                {format(day, 'd')}
              </Text>
              {hasEvents && <View style={styles.dot} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Events for selected day */}
      <Text style={styles.eventTitle}>
        {format(selectedDate, 'MMM d, yyyy')} — {selectedEvents.length} tasks
      </Text>
      <FlatList
        data={selectedEvents}
        keyExtractor={(e, i) => `${e.task.id}-${i}`}
        renderItem={({ item }) => {
          const member = members.find((m) => m.id === item.task.assigneeId);
          return <TaskCard task={item.task} assignee={member} onPress={() => {}} />;
        }}
        contentContainerStyle={
          selectedEvents.length === 0 ? { flex: 1 } : { paddingBottom: spacing['5xl'] }
        }
        ListEmptyComponent={
          <EmptyState icon="📅" title="No tasks due" description="No deadlines on this day." />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary, padding: spacing.lg },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  monthTitle: { fontSize: typography.size.xl, fontWeight: '700', color: colors.text.primary },
  arrow: { fontSize: typography.size['2xl'], color: colors.accent.default, padding: spacing.sm },
  weekRow: { flexDirection: 'row', marginBottom: spacing.sm },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.size.xs,
    color: colors.text.muted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.xl },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.sm,
  },
  daySelected: { backgroundColor: colors.accent.muted },
  dayToday: { borderWidth: 1, borderColor: colors.accent.default },
  dayNum: { fontSize: typography.size.base, color: colors.text.primary },
  dayNumSelected: { color: colors.accent.default, fontWeight: '700' },
  dayNumToday: { color: colors.accent.default, fontWeight: '700' },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.semantic.info,
    marginTop: 2,
  },
  eventTitle: {
    fontSize: typography.size.md,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
});
