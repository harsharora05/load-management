import { Request, requestRepository } from "@/lib/database";
import { Ionicons } from "@expo/vector-icons";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Stack, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type RequestWithItem =
    Awaited<
        ReturnType<typeof requestRepository.getAllWithInventoryDetails>
    >[0];

type StatusFilter = Request["status"];

export default function RequestsScreen() {
    const [requests, setRequests] = useState<RequestWithItem[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<RequestWithItem[]>(
        []
    );
    const [selectedStatus, setSelectedStatus] =
        useState<StatusFilter>("Pending");
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            loadRequests();
        }, [])
    );

    useEffect(() => {
        setFilteredRequests(
            requests.filter((req) => req.status === selectedStatus)
        );
    }, [selectedStatus, requests]);

    async function loadRequests() {
        try {
            const data =
                await requestRepository.getAllWithInventoryDetails();
            setRequests(data);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function onRefresh() {
        setRefreshing(true);
        await loadRequests();
        setRefreshing(false);
    }

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Loading requests...</Text>
            </View>
        );
    }

    const pendingCount = requests.filter(
        (i) => i.status === "Pending"
    ).length;

    const confirmedCount = requests.filter(
        (i) => i.status === "Confirmed"
    ).length;

    const renderFilter = () => (
        <View style={styles.filterContainer}>
            {[
                {
                    label: "Pending",
                    count: pendingCount,
                },
                {
                    label: "Confirmed",
                    count: confirmedCount,
                },
            ].map((item) => (
                <TouchableOpacity
                    key={item.label}
                    style={[
                        styles.chip,
                        selectedStatus === item.label &&
                        styles.activeChip,
                    ]}
                    onPress={() =>
                        setSelectedStatus(item.label as StatusFilter)
                    }
                >
                    <Text
                        style={[
                            styles.chipText,
                            selectedStatus === item.label &&
                            styles.activeChipText,
                        ]}
                    >
                        {item.label}
                    </Text>

                    <View
                        style={[
                            styles.countBadge,
                            selectedStatus === item.label &&
                            styles.activeCountBadge,
                        ]}
                    >
                        <Text
                            style={[
                                styles.countText,
                                selectedStatus === item.label &&
                                styles.activeCountText,
                            ]}
                        >
                            {item.count}
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <SafeAreaView
            style={styles.container}
            edges={["top", "left", "right"]}
        >
            <Stack.Screen
                options={{
                    title: "Load Requests",
                    headerLeft: () => <DrawerToggleButton />,
                }}
            />

            <FlatList
                data={filteredRequests}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderFilter}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#2563EB"]}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons
                            name="cube-outline"
                            size={80}
                            color="#BFDBFE"
                        />
                        <Text style={styles.emptyTitle}>
                            No {selectedStatus} Requests
                        </Text>
                        <Text style={styles.emptySubtitle}>
                            Requests will appear here once created.
                        </Text>
                    </View>
                }
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardTop}>
                            <View style={styles.iconContainer}>
                                <Ionicons
                                    name="cube-outline"
                                    size={24}
                                    color="#2563EB"
                                />
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={styles.itemName}>
                                    {item.itemName}
                                </Text>

                                <Text style={styles.itemSku}>
                                    SKU • {item.itemSku}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.cardMiddle}>
                            <Text style={styles.warehouseLabel}>For Warehouse</Text>
                            <Text style={styles.warehouseName}>{item.warehouseName}</Text>

                            <View
                                style={[
                                    styles.statusBadge,
                                    item.status === "Pending"
                                        ? styles.pendingBadge
                                        : styles.confirmedBadge,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.statusText,
                                        item.status === "Pending"
                                            ? styles.pendingText
                                            : styles.confirmedText,
                                    ]}
                                >
                                    {item.status}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.bottomRow}>
                            <View>
                                <Text style={styles.label}>
                                    Requested Quantity
                                </Text>
                                <Text style={styles.quantity}>
                                    {item.quantity}
                                </Text>
                            </View>

                            <Ionicons
                                name="arrow-forward-circle"
                                size={28}
                                color="#2563EB"
                            />
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

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
    },

    listContent: {
        padding: 18,
        paddingBottom: 30,
    },

    filterContainer: {
        flexDirection: "row",
        marginBottom: 20,
        gap: 12,
    },

    chip: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
    },

    activeChip: {
        backgroundColor: "#2563EB",
    },

    chipText: {
        color: "#2563EB",
        fontWeight: "600",
    },

    activeChipText: {
        color: "#FFFFFF",
    },

    countBadge: {
        marginLeft: 8,
        backgroundColor: "#DBEAFE",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 20,
    },

    activeCountBadge: {
        backgroundColor: "#FFFFFF",
    },

    countText: {
        color: "#2563EB",
        fontWeight: "700",
        fontSize: 12,
    },

    activeCountText: {
        color: "#2563EB",
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 22,
        padding: 18,
        marginBottom: 16,

        shadowColor: "#2563EB",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
    },

    cardMiddle: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    warehouseLabel: {
        fontSize: 14,
        color: "#64748B",
        fontWeight: "500",
    },

    warehouseName: {
        fontSize: 14,
        color: "#1E293B",
        fontWeight: "600",
    },
    cardTop: {
        flexDirection: "row",
        alignItems: "center",
    },

    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 14,
        backgroundColor: "#DBEAFE",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },

    itemName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1E293B",
    },

    itemSku: {
        marginTop: 3,
        color: "#64748B",
        fontSize: 13,
    },

    divider: {
        height: 1,
        backgroundColor: "#E2E8F0",
        marginVertical: 16,
    },

    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    label: {
        color: "#94A3B8",
        fontSize: 12,
        textTransform: "uppercase",
        fontWeight: "700",
    },

    quantity: {
        fontSize: 22,
        fontWeight: "700",
        color: "#2563EB",
        marginTop: 4,
    },

    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },

    pendingBadge: {
        backgroundColor: "#DBEAFE",
    },

    confirmedBadge: {
        backgroundColor: "#DCFCE7",
    },

    statusText: {
        fontWeight: "700",
        fontSize: 12,
    },

    pendingText: {
        color: "#2563EB",
    },

    confirmedText: {
        color: "#16A34A",
    },

    emptyContainer: {
        alignItems: "center",
        marginTop: 80,
    },

    emptyTitle: {
        marginTop: 20,
        fontSize: 22,
        fontWeight: "700",
        color: "#1E3A8A",
    },

    emptySubtitle: {
        marginTop: 8,
        color: "#64748B",
        textAlign: "center",
        fontSize: 15,
    },
});