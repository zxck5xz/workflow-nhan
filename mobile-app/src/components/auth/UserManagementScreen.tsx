import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { Card } from '../common/Card';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { colors, spacing, borderRadius, typography } from '../../theme';

export function UserManagementScreen() {
  const { state } = useApp();
  const { members } = state.data;

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing['5xl'] }}
      data={members}
      keyExtractor={(m) => m.id}
      ListHeaderComponent={() => (
        <Text style={styles.title}>User Management ({members.length})</Text>
      )}
      renderItem={({ item }) => (
        <Card style={{ marginBottom: spacing.md }}>
          <View style={styles.row}>
            <Avatar initials={item.initials} color={item.avatarColor} size={40} />
            <View style={{ marginLeft: spacing.md, flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
            <Badge
              text={item.role}
              color={
                item.role === 'ADMIN'
                  ? colors.semantic.danger
                  : item.role === 'MANAGER'
                    ? colors.accent.default
                    : colors.semantic.info
              }
              bgColor={
                item.role === 'ADMIN'
                  ? colors.semantic.dangerMuted
                  : item.role === 'MANAGER'
                    ? colors.accent.muted
                    : colors.semantic.infoMuted
              }
            />
          </View>
        </Card>
      )}
      ListEmptyComponent={
        <Text style={{ color: colors.text.muted, textAlign: 'center', marginTop: spacing['3xl'] }}>
          No users found.
        </Text>
      }
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
  row: { flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: typography.size.base, fontWeight: '600', color: colors.text.primary },
  email: { fontSize: typography.size.sm, color: colors.text.muted, marginTop: 2 },
});
