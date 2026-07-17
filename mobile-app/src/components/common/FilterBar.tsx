import { View, TextInput, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../theme';

interface FilterBarProps {
  search: string;
  onSearchChange: (text: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
}

export function FilterBar({
  search,
  onSearchChange,
  placeholder = 'Search...',
  children,
}: FilterBarProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={search}
        onChangeText={onSearchChange}
        placeholder={placeholder}
        placeholderTextColor={colors.text.muted}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface.default,
    borderWidth: 1,
    borderColor: colors.surface.border,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  input: {
    flex: 1,
    height: 32,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.bg.primary,
    borderRadius: borderRadius.sm,
    color: colors.text.primary,
    fontSize: typography.size.sm,
    borderWidth: 1,
    borderColor: colors.surface.border,
  },
});
