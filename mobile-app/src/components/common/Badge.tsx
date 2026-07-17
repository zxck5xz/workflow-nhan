import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../theme';

interface BadgeProps {
  text: string;
  color?: string;
  bgColor?: string;
  size?: 'sm' | 'md';
}

export function Badge({ text, color, bgColor, size = 'sm' }: BadgeProps) {
  return (
    <View
      style={[
        styles.base,
        size === 'md' && styles.md,
        bgColor ? { backgroundColor: bgColor } : styles.defaultBg,
      ]}
    >
      <Text
        style={[
          styles.text,
          size === 'md' && styles.mdText,
          color ? { color } : styles.defaultText,
        ]}
        numberOfLines={1}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  md: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  defaultBg: {
    backgroundColor: colors.surface.border,
  },
  text: {
    fontSize: typography.size.xs,
    fontWeight: '600',
  },
  mdText: {
    fontSize: typography.size.sm,
  },
  defaultText: {
    color: colors.text.secondary,
  },
});
