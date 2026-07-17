import { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Modal } from './Modal';
import { Button } from './Button';
import { colors, spacing, borderRadius, typography } from '../../theme';
import type { Project } from '../../types';
import { v4 as uuid } from 'uuid';

interface ProjectModalProps {
  visible: boolean;
  project: Project | null;
  onClose: () => void;
  onSave: (project: Project) => void;
}

export function ProjectModal({ visible, project, onClose, onSave }: ProjectModalProps) {
  const [name, setName] = useState(project?.name || '');

  function handleSave() {
    if (!name.trim()) return;
    onSave({
      id: project?.id || uuid(),
      name: name.trim(),
      platform: project?.platform || 'Cross-platform',
      genre: project?.genre || '',
      status: 'active',
      color: project?.color || '#ff6b35',
      createdAt: project?.createdAt || new Date().toISOString(),
    });
    onClose();
  }

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={project ? 'Edit Project' : 'New Project'}
      footer={
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <Button title="Cancel" variant="ghost" onPress={onClose} />
          <Button title="Save" variant="primary" onPress={handleSave} />
        </View>
      }
    >
      <View style={styles.field}>
        <Text style={styles.label}>Project Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Project name"
          placeholderTextColor={colors.text.muted}
        />
      </View>
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
});
