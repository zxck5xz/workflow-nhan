import { View, StyleSheet, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { colors, spacing, borderRadius } from '../../theme';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  padded?: boolean;
}

export function Card({ children, style, padded = true }: CardProps) {
  return <View style={[styles.card, padded && styles.padded, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.default,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.surface.border,
  },
  padded: {
    padding: spacing.lg,
  },
});
