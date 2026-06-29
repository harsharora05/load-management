import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MoreScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Open Drawer Button */}
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                >
                    <Text style={styles.menuItemText}>Account & Settings</Text>
                    <Text style={styles.menuItemArrow}>›</Text>
                </TouchableOpacity>

                {/* Other Menu Items */}
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuItemText}>Privacy & Security</Text>
                    <Text style={styles.menuItemArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuItemText}>About</Text>
                    <Text style={styles.menuItemArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuItemText}>Help & Support</Text>
                    <Text style={styles.menuItemArrow}>›</Text>
                </TouchableOpacity>

                {/* Version Info */}
                <View style={styles.versionContainer}>
                    <Text style={styles.versionText}>Load Management v1.0.0</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 16,
    },
    menuItem: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    menuItemArrow: {
        fontSize: 20,
        color: '#999',
    },
    versionContainer: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    versionText: {
        fontSize: 12,
        color: '#999',
    },
});
