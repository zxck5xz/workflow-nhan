import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '../contexts/AppContext';
import { TaskListScreen } from '../components/tasks/TaskListScreen';
import { CalendarScreen } from '../components/calendar/CalendarScreen';
import { SetupScreen } from '../components/setup/SetupScreen';
import { ReportsScreen } from '../components/reports/ReportsScreen';
import { InsightsScreen } from '../components/reports/InsightsScreen';
import { StaffReportsScreen } from '../components/reports/StaffReportsScreen';
import { CodeAnalysisScreen } from '../components/reports/CodeAnalysisScreen';
import { UserManagementScreen } from '../components/auth/UserManagementScreen';
import { colors, typography, spacing } from '../theme';

const Tab = createBottomTabNavigator();

const tabIcons: Record<string, string> = {
  Tasks: '📋',
  Calendar: '📅',
  Reports: '📊',
  Insights: '💡',
  Staff: '👥',
  Analysis: '🔍',
  Users: '👤',
  Settings: '⚙️',
};

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <View style={tabStyles.iconContainer}>
      <Text style={[tabStyles.icon, focused && tabStyles.iconFocused]}>
        {tabIcons[label] || '•'}
      </Text>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  iconContainer: { alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 20 },
  iconFocused: { fontSize: 22 },
});

export function AppNavigator() {
  const { state } = useApp();
  const userRole = state.data.members[0]?.role;

  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: colors.accent.default,
          background: colors.bg.primary,
          card: colors.bg.secondary,
          text: colors.text.primary,
          border: colors.surface.border,
          notification: colors.semantic.danger,
        },
        fonts: {
          regular: { fontFamily: 'System', fontWeight: '400' },
          medium: { fontFamily: 'System', fontWeight: '500' },
          bold: { fontFamily: 'System', fontWeight: '700' },
          heavy: { fontFamily: 'System', fontWeight: '900' },
        },
      }}
    >
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg.secondary },
          headerTintColor: colors.text.primary,
          headerTitleStyle: { fontWeight: '600', fontSize: typography.size.lg },
          tabBarStyle: {
            backgroundColor: colors.bg.secondary,
            borderTopColor: colors.surface.border,
            paddingBottom: spacing.xs,
            height: 56,
          },
          tabBarActiveTintColor: colors.accent.default,
          tabBarInactiveTintColor: colors.text.muted,
          tabBarLabelStyle: { fontSize: 10, fontWeight: '500' },
        }}
      >
        <Tab.Screen
          name="Tasks"
          component={TaskListScreen}
          options={{
            title: 'Tasks',
            headerTitle: 'Workflow Manager',
            tabBarIcon: ({ focused }) => <TabIcon label="Tasks" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon label="Calendar" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Reports"
          component={ReportsScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon label="Reports" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Insights"
          component={InsightsScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon label="Insights" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Staff"
          component={StaffReportsScreen}
          options={{
            title: 'Staff',
            tabBarIcon: ({ focused }) => <TabIcon label="Staff" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Analysis"
          component={CodeAnalysisScreen}
          options={{
            title: 'Analysis',
            tabBarIcon: ({ focused }) => <TabIcon label="Analysis" focused={focused} />,
          }}
        />
        {(userRole === 'ADMIN' || userRole === 'MANAGER') && (
          <Tab.Screen
            name="Users"
            component={UserManagementScreen}
            options={{
              tabBarIcon: ({ focused }) => <TabIcon label="Users" focused={focused} />,
            }}
          />
        )}
        <Tab.Screen
          name="Settings"
          component={SetupScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon label="Settings" focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
