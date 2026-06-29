import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';



export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false, // The drawer navigator will provide the header
                tabBarActiveTintColor: '#2563EB',
                tabBarInactiveTintColor: '#888',
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: '#e0e0e0',
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                },
            }}
        >
            <Tabs.Screen
                name="Dashboard"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="customers"
                options={{
                    title: 'Customers',
                    tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="inventory"
                options={{
                    title: 'Inventory',
                    tabBarIcon: ({ color, size }) => <Ionicons name="cube-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="load-management"
                options={{
                    title: 'Load Management',
                    tabBarIcon: ({ color, size }) => <Ionicons name="git-pull-request-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="journey"
                options={{
                    title: 'Journey',
                    tabBarIcon: ({ color, size }) => <Ionicons name="server-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="more"
                options={{
                    title: 'More',
                    tabBarIcon: ({ color, size }) => <Ionicons name="ellipsis-horizontal" size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}