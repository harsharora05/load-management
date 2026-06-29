import { useAuth } from '@/lib/hooks/useAuth';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { router } from 'expo-router';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function CustomDrawerContent(props: any) {
    const { user, signOut } = useAuth();

    const handleSignOut = () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Sign Out',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await signOut();
                        // After sign out, you might want to navigate to the login screen
                        router.replace('/(auth)/signIn');
                    } catch (error) {
                        Alert.alert('Error', String(error));
                    }
                },
            },
        ]);
    };

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
                <View style={styles.profileAvatar}>
                    <Text style={styles.profileAvatarText}>
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </Text>
                </View>
                <View>
                    <Text style={styles.profileName}>{user?.name}</Text>
                    <Text style={styles.profileEmail}>{user?.email}</Text>
                </View>
            </View>

            {/* Drawer Items from layout */}
            <DrawerItemList {...props} />

            {/* Sign Out Button */}
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                <Text style={styles.signOutButtonText}>Sign Out</Text>
            </TouchableOpacity>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    profileSection: {
        backgroundColor: '#4CAF50',
        padding: 20,
        paddingTop: 40,
        marginBottom: 8,
    },
    profileAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    profileAvatarText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
    },
    profileName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        color: '#f0f0f0',
    },
    signOutButton: {
        backgroundColor: '#ff44441A', // A lighter shade for the button
        marginHorizontal: 16,
        marginTop: 24,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    signOutButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ff4444',
    },
});