import { StyleSheet } from 'react-native';

export const colors = {
  bg: {
    primary: '#0f1117',
    secondary: '#161822',
    tertiary: '#1c1f2e',
    elevated: '#222538',
    hover: '#2a2d42',
    active: '#32364d',
  },
  surface: {
    default: '#1a1d2e',
    hover: '#22253a',
    border: '#2e3148',
    borderHover: '#3d4160',
  },
  text: {
    primary: '#e8eaf0',
    secondary: '#9298b0',
    muted: '#5c6280',
    inverse: '#0f1117',
  },
  accent: {
    default: '#ff6b35',
    hover: '#ff8255',
    muted: 'rgba(255, 107, 53, 0.15)',
    text: '#ff6b35',
  },
  semantic: {
    success: '#00c48c',
    successMuted: 'rgba(0, 196, 140, 0.15)',
    danger: '#ff4757',
    dangerMuted: 'rgba(255, 71, 87, 0.15)',
    warning: '#ffb830',
    warningMuted: 'rgba(255, 184, 48, 0.15)',
    info: '#3b82f6',
    infoMuted: 'rgba(59, 130, 246, 0.15)',
  },
  priority: {
    p0: '#ff4757',
    p0Bg: 'rgba(255, 71, 87, 0.12)',
    p1: '#ff6b35',
    p1Bg: 'rgba(255, 107, 53, 0.12)',
    p2: '#5c6280',
    p2Bg: 'rgba(92, 98, 128, 0.12)',
  },
  status: {
    backlog: '#5c6280',
    inTesting: '#3b82f6',
    evaluating: '#ffb830',
    reporting: '#a855f7',
    done: '#00c48c',
  },
};

export const typography = {
  fontFamily: undefined,
  size: {
    xs: 11,
    sm: 12,
    base: 13,
    md: 14,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
  },
  leading: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.65,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
  '7xl': 80,
};

export const borderRadius = {
  xs: 2,
  sm: 3,
  md: 4,
  lg: 6,
  xl: 8,
  full: 9999,
};

export function commonStyles() {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface.default,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.surface.border,
      padding: spacing.lg,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rowBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    gapSm: { gap: spacing.sm },
    gapMd: { gap: spacing.md },
    gapLg: { gap: spacing.lg },
    flex1: { flex: 1 },
    mbSm: { marginBottom: spacing.sm },
    mbMd: { marginBottom: spacing.md },
    mbLg: { marginBottom: spacing.lg },
  });
}
