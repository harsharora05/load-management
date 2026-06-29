import { Journey, journeyRepository } from "@/lib/database";
import { Ionicons } from "@expo/vector-icons";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Stack, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function JourneyScreen() {
    const [journeys, setJourneys] = useState<Journey[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            loadJourneys();
        }, [])
    );

    async function loadJourneys() {
        try {
            const data = await journeyRepository.getAll();
            setJourneys(data);
        } catch (error) {
            console.error("Failed to load journeys", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function onRefresh() {
        setIsRefreshing(true);
        await loadJourneys();
        setIsRefreshing(false);
    }

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Loading journeys...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
            <Stack.Screen
                options={{
                    title: "Journey History",
                    headerLeft: () => <DrawerToggleButton />,
                }}
            />

            {journeys.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="car-outline" size={90} color="#BFDBFE" />
                    <Text style={styles.emptyTitle}>No Journeys Found</Text>
                    <Text style={styles.emptySubtitle}>
                        Your completed journeys will appear here.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={journeys}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={onRefresh}
                            colors={["#2563EB"]}
                            tintColor="#2563EB"
                        />
                    }
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            {/* Top Row */}
                            <View style={styles.topRow}>
                                <View style={styles.dateContainer}>
                                    <Ionicons
                                        name="calendar-outline"
                                        size={16}
                                        color="#2563EB"
                                    />
                                    <Text style={styles.date}>
                                        {new Date(item.date).toDateString()}
                                    </Text>
                                </View>

                                <View
                                    style={[
                                        styles.statusBadge,
                                        item.status === "Visited"
                                            ? styles.visitedBadge
                                            : styles.pendingBadge,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.statusText,
                                            item.status === "Visited"
                                                ? styles.visitedText
                                                : styles.pendingText,
                                        ]}
                                    >
                                        {item.status}
                                    </Text>
                                </View>
                            </View>

                            {/* Route */}
                            <View style={styles.routeContainer}>
                                <View style={styles.timeline}>
                                    <View style={styles.startDot} />
                                    <View style={styles.line} />
                                    <Ionicons
                                        name="location"
                                        size={18}
                                        color="#2563EB"
                                    />
                                </View>

                                <View style={styles.routeInfo}>
                                    <Text style={styles.label}>FROM</Text>
                                    <Text style={styles.location}>{item.source}</Text>

                                    <View style={{ height: 22 }} />

                                    <Text style={styles.label}>TO</Text>
                                    <Text style={styles.location}>{item.destination}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
}

const PRIMARY = "#2563EB";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEF4FF",
    },

    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    loadingText: {
        marginTop: 12,
        color: "#64748B",
        fontSize: 15,
    },

    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
    },

    emptyTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1E3A8A",
        marginTop: 20,
    },

    emptySubtitle: {
        textAlign: "center",
        color: "#64748B",
        marginTop: 8,
        fontSize: 15,
        lineHeight: 22,
    },

    listContent: {
        padding: 18,
        paddingBottom: 30,
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 22,
        padding: 20,
        marginBottom: 18,

        shadowColor: "#2563EB",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 5,
    },

    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 22,
    },

    dateContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    date: {
        marginLeft: 6,
        color: "#64748B",
        fontSize: 13,
        fontWeight: "500",
    },

    statusBadge: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
    },

    pendingBadge: {
        backgroundColor: "#DBEAFE",
    },

    visitedBadge: {
        backgroundColor: "#DCFCE7",
    },

    statusText: {
        fontSize: 12,
        fontWeight: "700",
    },

    pendingText: {
        color: PRIMARY,
    },

    visitedText: {
        color: "#15803D",
    },

    routeContainer: {
        flexDirection: "row",
    },

    timeline: {
        alignItems: "center",
        marginRight: 18,
    },

    startDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: PRIMARY,
    },

    line: {
        width: 3,
        height: 48,
        backgroundColor: "#BFDBFE",
        marginVertical: 6,
        borderRadius: 10,
    },

    routeInfo: {
        flex: 1,
    },

    label: {
        fontSize: 12,
        color: "#94A3B8",
        fontWeight: "700",
        letterSpacing: 1,
        marginBottom: 5,
    },

    location: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1E293B",
    },
});