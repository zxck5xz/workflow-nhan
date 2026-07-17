import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Modal } from './Modal';
import { Button } from './Button';
import { colors, spacing, borderRadius, typography } from '../../theme';
import type { Task } from '../../types';
import { v4 as uuid } from 'uuid';

interface TaskFormModalProps {
  visible: boolean;
  task: Task | null;
  defaultProjectId?: string;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete?: () => void;
}

export function TaskFormModal({
  visible,
  task,
  defaultProjectId,
  onClose,
  onSave,
  onDelete,
}: TaskFormModalProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');

  function handleSave() {
    if (!title.trim()) return;
    const now = new Date().toISOString();
    onSave({
      id: task?.id || uuid(),
      title: title.trim(),
      description: description.trim(),
      projectId: task?.projectId || defaultProjectId || 'p1',
      assigneeId: task?.assigneeId || '',
      status: task?.status || 'backlog',
      priority: task?.priority || 'P1',
      weight: task?.weight || 3,
      deadline: task?.deadline || now,
      createdAt: task?.createdAt || now,
      eisenhower: task?.eisenhower || { urgent: false, important: true, autoClassified: true },
      tags: task?.tags || [],
    });
    onClose();
  }

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={task ? 'Edit Task' : 'New Task'}
      footer={
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          {onDelete && <Button title="Delete" variant="danger" onPress={onDelete} />}
          <View style={{ flex: 1 }} />
          <Button title="Cancel" variant="ghost" onPress={onClose} />
          <Button title="Save" variant="primary" onPress={handleSave} />
        </View>
      }
    >
      <ScrollView>
        <View style={styles.field}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Task title"
            placeholderTextColor={colors.text.muted}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={description}
            onChangeText={setDescription}
            multiline
            placeholder="Description"
            placeholderTextColor={colors.text.muted}
          />
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: spacing.lg },
  label: {
    fontSize: typography.size.sm,
    fontWeight: '500',
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.bg.primary,
    borderWidth: 1,
    borderColor: colors.surface.border,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    color: colors.text.primary,
    fontSize: typography.size.base,
  },
  textarea: { minHeight: 80, textAlignVertical: 'top' },
});
