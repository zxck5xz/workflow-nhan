import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { colors, spacing, borderRadius, typography } from '../../theme';
import {
  isOverdue,
  formatRelativeDate,
  getPriorityColor,
  getPriorityBg,
  getStatusColor,
} from '../../utils';
import type { Task, Member } from '../../types';

interface TaskCardProps {
  task: Task;
  assignee?: Member;
  onPress: () => void;
  onDelete?: () => void;
}

function DeleteAction({
  progress,
  onDelete,
}: {
  progress: Animated.AnimatedInterpolation<number>;
  onDelete: () => void;
}) {
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [80, 0],
  });

  return (
    <Animated.View style={[styles.deleteContainer, { transform: [{ translateX }] }]}>
      <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
        <Text style={styles.deleteBtnText}>Delete</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export function TaskCard({ task, assignee, onPress, onDelete }: TaskCardProps) {
  const overdue = isOverdue(task);
  const card = (
    <TouchableOpacity
      style={[styles.card, overdue && styles.overdue]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={1}>
          {task.title}
        </Text>
        <Badge
          text={task.priority}
          color={getPriorityColor(task.priority)}
          bgColor={getPriorityBg(task.priority)}
        />
      </View>
      <View style={styles.bottomRow}>
        <Badge
          text={
            task.status === 'in-testing'
              ? 'In Testing'
              : task.status.charAt(0).toUpperCase() + task.status.slice(1)
          }
          color={getStatusColor(task.status)}
          bgColor={`${getStatusColor(task.status)}20`}
        />
        <View style={styles.meta}>
          <Text style={[styles.date, overdue && styles.dateOverdue]}>
            {formatRelativeDate(task.deadline)}
          </Text>
          {assignee && (
            <Avatar initials={assignee.initials} color={assignee.avatarColor} size={22} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!onDelete) return card;

  return (
    <Swipeable
      renderRightActions={(progress) => <DeleteAction progress={progress} onDelete={onDelete} />}
    >
      {card}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.default,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.surface.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  overdue: {
    borderLeftWidth: 3,
    borderLeftColor: colors.semantic.danger,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.size.base,
    fontWeight: '500',
    color: colors.text.primary,
    flex: 1,
    marginRight: spacing.sm,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  date: {
    fontSize: typography.size.xs,
    color: colors.text.secondary,
  },
  dateOverdue: {
    color: colors.semantic.danger,
    fontWeight: '600',
  },
  deleteContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: spacing.sm,
  },
  deleteBtn: {
    backgroundColor: colors.semantic.danger,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderTopRightRadius: borderRadius.md,
    borderBottomRightRadius: borderRadius.md,
  },
  deleteBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: typography.size.sm,
  },
});
