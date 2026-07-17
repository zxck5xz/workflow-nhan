import { useState, useMemo, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { TaskCard } from './TaskCard';
import { TaskFormModal } from '../common/TaskFormModal';
import { ProjectModal } from '../common/ProjectModal';
import { EmptyState } from '../common/EmptyState';
import { FilterBar } from '../common/FilterBar';
import { colors, spacing, borderRadius, typography } from '../../theme';
import type { Task, Project } from '../../types';

type ViewMode = 'list' | 'board';

export function TaskListScreen() {
  const { state, dispatch } = useApp();
  const { tasks, projects, members } = state.data;

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [search, setSearch] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    dispatch({ type: 'REFRESH_DATA' });
    setRefreshing(false);
  }, [dispatch]);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    if (selectedProjectId) result = result.filter((t) => t.projectId === selectedProjectId);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) => t.title.toLowerCase().includes(q) || t.tags.some((tag) => tag.includes(q)),
      );
    }
    return result;
  }, [tasks, selectedProjectId, search]);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  function renderTask({ item }: { item: Task }) {
    const assignee = members.find((m) => m.id === item.assigneeId);
    return (
      <TaskCard
        task={item}
        assignee={assignee}
        onPress={() => setEditTask(item)}
        onDelete={() => dispatch({ type: 'DELETE_TASK', payload: item.id })}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>
            {selectedProject ? selectedProject.name : 'All Tasks'}
          </Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddTask(true)}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>
        {/* Project chips */}
        <FlatList
          horizontal
          data={projects}
          keyExtractor={(p) => p.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.chip,
                selectedProjectId === item.id && {
                  backgroundColor: item.color + '30',
                  borderColor: item.color,
                },
              ]}
              onPress={() => setSelectedProjectId(selectedProjectId === item.id ? null : item.id)}
            >
              <View style={[styles.chipDot, { backgroundColor: item.color }]} />
              <Text
                style={[styles.chipText, selectedProjectId === item.id && { color: item.color }]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          ListHeaderComponent={() => (
            <TouchableOpacity
              style={[styles.chip, !selectedProjectId && styles.chipActive]}
              onPress={() => setSelectedProjectId(null)}
            >
              <Text
                style={[styles.chipText, !selectedProjectId && { color: colors.accent.default }]}
              >
                All
              </Text>
            </TouchableOpacity>
          )}
        />
        {/* View toggle */}
        <View style={styles.viewTabs}>
          <TouchableOpacity
            style={[styles.viewTab, viewMode === 'list' && styles.viewTabActive]}
            onPress={() => setViewMode('list')}
          >
            <Text style={[styles.viewTabText, viewMode === 'list' && styles.viewTabTextActive]}>
              List
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewTab, viewMode === 'board' && styles.viewTabActive]}
            onPress={() => setViewMode('board')}
          >
            <Text style={[styles.viewTabText, viewMode === 'board' && styles.viewTabTextActive]}>
              Board
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FilterBar search={search} onSearchChange={setSearch} placeholder="Search tasks..." />

      {viewMode === 'list' ? (
        <FlatList
          data={filteredTasks}
          keyExtractor={(t) => t.id}
          renderItem={renderTask}
          contentContainerStyle={filteredTasks.length === 0 ? { flex: 1 } : styles.listContent}
          ListEmptyComponent={
            <EmptyState
              icon="📝"
              title="No tasks yet"
              description="Create a new task to get started."
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.accent.default}
            />
          }
        />
      ) : (
        <BoardView tasks={filteredTasks} onEditTask={setEditTask} />
      )}

      <TaskFormModal
        visible={showAddTask || !!editTask}
        task={editTask}
        defaultProjectId={selectedProjectId || undefined}
        onClose={() => {
          setShowAddTask(false);
          setEditTask(null);
        }}
        onSave={(t) => {
          if (editTask) dispatch({ type: 'UPDATE_TASK', payload: t });
          else dispatch({ type: 'ADD_TASK', payload: t });
          setShowAddTask(false);
          setEditTask(null);
        }}
        onDelete={
          editTask
            ? () => {
                dispatch({ type: 'DELETE_TASK', payload: editTask.id });
                setEditTask(null);
              }
            : undefined
        }
      />
      <ProjectModal
        visible={showAddProject}
        project={null}
        onClose={() => setShowAddProject(false)}
        onSave={(p) => {
          dispatch({ type: 'ADD_PROJECT', payload: p });
          setShowAddProject(false);
        }}
      />
    </View>
  );
}

function BoardView({ tasks, onEditTask }: { tasks: Task[]; onEditTask: (t: Task) => void }) {
  const { state, dispatch } = useApp();
  const { statuses, members } = state.data;
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    dispatch({ type: 'REFRESH_DATA' });
    setRefreshing(false);
  }, [dispatch]);

  return (
    <FlatList
      horizontal
      data={statuses}
      keyExtractor={(s) => s.id}
      contentContainerStyle={styles.board}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.accent.default}
        />
      }
      renderItem={({ item: status }) => {
        const columnTasks = tasks.filter((t) => t.status === status.id);
        return (
          <View style={styles.column}>
            <View style={styles.columnHeader}>
              <Text style={[styles.columnTitle, { color: status.color }]}>{status.label}</Text>
              <View style={[styles.countBadge, { backgroundColor: status.color + '20' }]}>
                <Text style={[styles.countText, { color: status.color }]}>
                  {columnTasks.length}
                </Text>
              </View>
            </View>
            <FlatList
              data={columnTasks}
              keyExtractor={(t) => t.id}
              renderItem={({ item }) => {
                const member = members.find((m) => m.id === item.assigneeId);
                return <TaskCard task={item} assignee={member} onPress={() => onEditTask(item)} />;
              }}
              ListEmptyComponent={<Text style={styles.emptyColumn}>No tasks</Text>}
            />
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerTitle: { fontSize: typography.size.xl, fontWeight: '700', color: colors.text.primary },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 20, fontWeight: '600', lineHeight: 22 },
  chips: { gap: spacing.sm, paddingVertical: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.surface.border,
    backgroundColor: colors.surface.default,
    marginRight: spacing.sm,
  },
  chipActive: { borderColor: colors.accent.default, backgroundColor: colors.accent.muted },
  chipDot: { width: 8, height: 8, borderRadius: 4 },
  chipText: { fontSize: typography.size.sm, color: colors.text.secondary },
  viewTabs: {
    flexDirection: 'row',
    gap: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface.border,
    marginBottom: spacing.sm,
  },
  viewTab: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
  viewTabActive: { borderBottomWidth: 2, borderBottomColor: colors.accent.default },
  viewTabText: { fontSize: typography.size.base, color: colors.text.muted, fontWeight: '500' },
  viewTabTextActive: { color: colors.accent.default },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing['5xl'] },
  board: { paddingHorizontal: spacing.md, gap: spacing.md },
  column: {
    width: 280,
    backgroundColor: colors.bg.tertiary,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm,
  },
  columnTitle: { fontWeight: '600', fontSize: typography.size.base },
  countBadge: { paddingHorizontal: spacing.sm, borderRadius: borderRadius.full },
  countText: { fontSize: typography.size.xs, fontWeight: '600' },
  emptyColumn: {
    color: colors.text.muted,
    textAlign: 'center',
    padding: spacing.lg,
    fontSize: typography.size.sm,
  },
});
