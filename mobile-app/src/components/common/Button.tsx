import { TouchableOpacity, Text, StyleSheet, type ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  variant?: Variant;
  size?: Size;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  block?: boolean;
}

export function Button({
  title,
  variant = 'secondary',
  size = 'md',
  onPress,
  disabled,
  style,
  block,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        block && styles.block,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, styles[`text_${variant}`], disabled && styles.disabledText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  block: { width: '100%' },
  disabled: { opacity: 0.5 },
  primary: {
    backgroundColor: colors.accent.default,
  },
  secondary: {
    backgroundColor: colors.bg.hover,
    borderColor: colors.surface.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: colors.semantic.dangerMuted,
    borderColor: 'transparent',
  },
  size_sm: { paddingVertical: spacing.xs, paddingHorizontal: spacing.md },
  size_md: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
  size_lg: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl },
  text: {
    fontFamily: typography.fontFamily,
    fontWeight: '500',
    fontSize: typography.size.base,
  },
  text_primary: { color: '#fff' },
  text_secondary: { color: colors.text.primary },
  text_ghost: { color: colors.text.secondary },
  text_danger: { color: colors.semantic.danger },
  disabledText: { color: colors.text.muted },
});
