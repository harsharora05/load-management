import { useAuth } from "@/lib/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Stack } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardScreen() {
    const { user } = useAuth();

    const pendingRecords = 0;
    const pendingFiles = 0;
    const activities = 0;

    const handleSync = () => {
        console.log("Sync");
    };

    return (
        <SafeAreaView
            style={styles.container}
            edges={["top", "left", "right"]}
        >
            <Stack.Screen
                options={{
                    title: "Dashboard",
                    headerLeft: () => <DrawerToggleButton />,
                }}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {/* Welcome */}
                <View style={styles.header}>
                    <Text style={styles.greeting}>Welcome back,</Text>
                    <Text style={styles.name}>{user?.name || "User"}</Text>
                </View>

                {/* Statistics */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Ionicons
                            name="document-text-outline"
                            size={22}
                            color="#2563EB"
                        />
                        <Text style={styles.statValue}>{pendingRecords}</Text>
                        <Text style={styles.statLabel}>Pending Records</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Ionicons
                            name="folder-open-outline"
                            size={22}
                            color="#2563EB"
                        />
                        <Text style={styles.statValue}>{pendingFiles}</Text>
                        <Text style={styles.statLabel}>Pending Files</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Ionicons
                            name="pulse-outline"
                            size={22}
                            color="#2563EB"
                        />
                        <Text style={styles.statValue}>{activities}</Text>
                        <Text style={styles.statLabel}>Activities</Text>
                    </View>
                </View>

                {/* Sync Button */}
                <TouchableOpacity
                    style={styles.syncButton}
                    onPress={handleSync}
                >
                    <Ionicons
                        name="sync-outline"
                        size={20}
                        color="#fff"
                    />
                    <Text style={styles.syncText}>Sync Data</Text>
                </TouchableOpacity>

                {/* Recent Activity */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Recent Activity
                    </Text>

                    <View style={styles.activityCard}>
                        <Ionicons
                            name="time-outline"
                            size={42}
                            color="#93C5FD"
                        />

                        <Text style={styles.activityTitle}>
                            No Activity Yet
                        </Text>

                        <Text style={styles.activitySubtitle}>
                            Your recent activity will appear here.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const PRIMARY = "#2563EB";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEF4FF",
    },

    content: {
        padding: 20,
        paddingBottom: 30,
    },

    header: {
        marginBottom: 24,
    },

    greeting: {
        fontSize: 16,
        color: "#64748B",
    },

    name: {
        fontSize: 30,
        fontWeight: "700",
        color: "#1E293B",
        marginTop: 4,
    },

    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 24,
    },

    statCard: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: "center",
        marginHorizontal: 4,

        shadowColor: PRIMARY,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },

    statValue: {
        fontSize: 24,
        fontWeight: "700",
        color: PRIMARY,
        marginTop: 8,
    },

    statLabel: {
        marginTop: 6,
        color: "#64748B",
        fontSize: 11,
        fontWeight: "600",
        textAlign: "center",
    },

    syncButton: {
        backgroundColor: PRIMARY,
        borderRadius: 14,
        paddingVertical: 15,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",

        shadowColor: PRIMARY,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },

    syncText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 8,
    },

    section: {
        marginTop: 28,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1E293B",
        marginBottom: 12,
    },

    activityCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        paddingVertical: 35,
        alignItems: "center",

        shadowColor: PRIMARY,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },

    activityTitle: {
        marginTop: 12,
        fontSize: 18,
        fontWeight: "700",
        color: "#1E293B",
    },

    activitySubtitle: {
        marginTop: 6,
        color: "#64748B",
        fontSize: 14,
        textAlign: "center",
    },
});