import { useAuth } from "@/lib/context/AuthContext";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MoreScreen() {
    const navigation = useNavigation();
    const router = useRouter();
    const { signOut } = useAuth();

    const handleSignOut = () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Sign Out",
                    style: "destructive",
                    onPress: async () => {
                        await signOut();
                        router.replace("/(auth)/signIn");
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>HA</Text>
                    </View>

                    <View style={styles.profileInfo}>
                        <Text style={styles.name}>Harsh Arora</Text>
                        <Text style={styles.email}>harsh@example.com</Text>
                    </View>
                </View>

                {/* Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>General</Text>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() =>
                            navigation.dispatch(DrawerActions.openDrawer())
                        }
                    >
                        <Text style={styles.menuText}>👤 Account & Settings</Text>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuText}>🔒 Privacy & Security</Text>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuText}>ℹ️ About</Text>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuText}>💬 Help & Support</Text>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>
                </View>

                {/* Sign Out */}
                <TouchableOpacity
                    style={styles.signOutButton}
                    onPress={handleSignOut}
                >
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>

                {/* Version */}
                <View style={styles.versionContainer}>
                    <Text style={styles.versionText}>
                        Load Management v1.0.0
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F6F8",
    },

    content: {
        padding: 20,
    },

    profileCard: {
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 28,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 3,
        },
    },

    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#2563EB",
        justifyContent: "center",
        alignItems: "center",
    },

    avatarText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 24,
    },

    profileInfo: {
        marginLeft: 16,
    },

    name: {
        fontSize: 20,
        fontWeight: "700",
        color: "#222",
    },

    email: {
        marginTop: 4,
        fontSize: 14,
        color: "#777",
    },

    section: {
        marginBottom: 30,
    },

    sectionTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#888",
        marginBottom: 10,
        marginLeft: 5,
        textTransform: "uppercase",
    },

    menuItem: {
        backgroundColor: "#fff",
        borderRadius: 14,
        paddingVertical: 18,
        paddingHorizontal: 18,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,

        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },

    menuText: {
        fontSize: 16,
        color: "#222",
        fontWeight: "500",
    },

    arrow: {
        fontSize: 24,
        color: "#B0B0B0",
    },

    signOutButton: {
        backgroundColor: "#EF4444",
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 10,

        elevation: 2,
        shadowColor: "#EF4444",
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 4,
        },
    },

    signOutText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "700",
    },

    versionContainer: {
        alignItems: "center",
        marginTop: 30,
        marginBottom: 10,
    },

    versionText: {
        color: "#999",
        fontSize: 13,
    },
});