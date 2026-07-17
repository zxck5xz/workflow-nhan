import { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Avatar } from '../common/Avatar';
import { colors, spacing, borderRadius, typography } from '../../theme';
import type { Member, Project, StatusConfig, PriorityConfig } from '../../types';
import { v4 as uuid } from 'uuid';

export function SetupScreen() {
  const { state, dispatch } = useApp();
  const { projects, members, statuses, priorities } = state.data;

  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newProjectName, setNewProjectName] = useState('');

  function addMember() {
    if (!newMemberName.trim() || !newMemberEmail.trim()) return;
    const initials = newMemberName
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    const colors_arr = ['#ff6b35', '#3b82f6', '#00c48c', '#a855f7', '#ffb830', '#ff4757'];
    dispatch({
      type: 'ADD_MEMBER',
      payload: {
        id: uuid(),
        name: newMemberName.trim(),
        email: newMemberEmail.trim(),
        role: 'TESTER',
        avatarColor: colors_arr[members.length % colors_arr.length],
        initials,
        joinedAt: new Date().toISOString(),
      },
    });
    setNewMemberName('');
    setNewMemberEmail('');
  }

  function addProject() {
    if (!newProjectName.trim()) return;
    const colors_arr = ['#ff6b35', '#3b82f6', '#00c48c', '#a855f7', '#ffb830'];
    dispatch({
      type: 'ADD_PROJECT',
      payload: {
        id: uuid(),
        name: newProjectName.trim(),
        platform: 'Cross-platform',
        genre: '',
        status: 'active',
        color: colors_arr[projects.length % colors_arr.length],
        createdAt: new Date().toISOString(),
      },
    });
    setNewProjectName('');
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing['5xl'] }}
      data={[]}
      ListHeaderComponent={() => (
        <>
          <Text style={styles.title}>Settings</Text>

          {/* Projects */}
          <Text style={styles.sectionTitle}>Projects ({projects.length})</Text>
          <Card style={{ marginBottom: spacing.xl }}>
            {projects.map((p) => (
              <View key={p.id} style={styles.listRow}>
                <View style={[styles.dot, { backgroundColor: p.color }]} />
                <Text style={styles.rowText}>{p.name}</Text>
                <Text style={styles.rowMeta}>{p.platform}</Text>
              </View>
            ))}
            <View style={styles.addRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={newProjectName}
                onChangeText={setNewProjectName}
                placeholder="New project name"
                placeholderTextColor={colors.text.muted}
              />
              <Button title="Add" variant="primary" size="sm" onPress={addProject} />
            </View>
          </Card>

          {/* Members */}
          <Text style={styles.sectionTitle}>Members ({members.length})</Text>
          <Card style={{ marginBottom: spacing.xl }}>
            {members.map((m) => (
              <View key={m.id} style={styles.listRow}>
                <Avatar initials={m.initials} color={m.avatarColor} size={28} />
                <View style={{ marginLeft: spacing.md, flex: 1 }}>
                  <Text style={styles.rowText}>{m.name}</Text>
                  <Text style={styles.rowMeta}>
                    {m.email} · {m.role}
                  </Text>
                </View>
              </View>
            ))}
            <View style={styles.addRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={newMemberName}
                onChangeText={setNewMemberName}
                placeholder="Name"
                placeholderTextColor={colors.text.muted}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={newMemberEmail}
                onChangeText={setNewMemberEmail}
                placeholder="Email"
                placeholderTextColor={colors.text.muted}
                autoCapitalize="none"
              />
              <Button title="Add" variant="primary" size="sm" onPress={addMember} />
            </View>
          </Card>

          {/* Statuses */}
          <Text style={styles.sectionTitle}>Workflow Statuses</Text>
          <Card style={{ marginBottom: spacing.xl }}>
            {statuses.map((s) => (
              <View key={s.id} style={styles.listRow}>
                <View style={[styles.dot, { backgroundColor: s.color }]} />
                <Text style={styles.rowText}>{s.label}</Text>
                <Text style={styles.rowMeta}>#{s.order}</Text>
              </View>
            ))}
          </Card>

          {/* Priorities */}
          <Text style={styles.sectionTitle}>Priorities</Text>
          <Card>
            {priorities.map((p) => (
              <View key={p.id} style={styles.listRow}>
                <View style={[styles.dot, { backgroundColor: p.color }]} />
                <Text style={styles.rowText}>
                  {p.label} ({p.id})
                </Text>
                <Text style={styles.rowMeta}>Weight: {p.defaultWeight}</Text>
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
  sectionTitle: {
    fontSize: typography.size.md,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface.border,
  },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.md },
  rowText: { flex: 1, fontSize: typography.size.base, color: colors.text.primary },
  rowMeta: { fontSize: typography.size.sm, color: colors.text.muted },
  addRow: { flexDirection: 'row', gap: spacing.sm, paddingTop: spacing.md, alignItems: 'center' },
  input: {
    backgroundColor: colors.bg.primary,
    borderWidth: 1,
    borderColor: colors.surface.border,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    color: colors.text.primary,
    fontSize: typography.size.base,
    height: 36,
  },
});
