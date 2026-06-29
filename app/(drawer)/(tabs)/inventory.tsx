import { Warehouse, warehouseRepository } from "@/lib/database";
import { Ionicons } from "@expo/vector-icons";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InventoryScreen() {
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            loadWarehouses();
        }, [])
    );

    async function loadWarehouses() {
        try {
            const data = await warehouseRepository.getAll();
            setWarehouses(data);
        } catch (error) {
            console.error("Failed to load warehouses", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function onRefresh() {
        setRefreshing(true);
        await loadWarehouses();
        setRefreshing(false);
    }

    if (isLoading) {
        return (
            <SafeAreaView style={styles.centered}>
                <ActivityIndicator
                    size="large"
                    color="#2563EB"
                />

                <Text style={styles.loadingText}>
                    Loading warehouses...
                </Text>
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView
            style={styles.container}
            edges={["top", "left", "right"]}
        >
            <Stack.Screen
                options={{
                    title: "Inventory",
                    headerLeft: () => <DrawerToggleButton />,
                }}
            />

            {warehouses.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons
                        name="business-outline"
                        size={90}
                        color="#BFDBFE"
                    />

                    <Text style={styles.emptyTitle}>
                        No Warehouses Found
                    </Text>

                    <Text style={styles.emptySubtitle}>
                        Your company's warehouses will appear here.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={warehouses}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={["#2563EB"]}
                            tintColor="#2563EB"
                        />
                    }
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            activeOpacity={0.9}
                            onPress={() => router.push(`/inventory/${item.id}?name=${item.name}`)}
                        >
                            <View style={styles.topRow}>
                                <View style={styles.iconContainer}>
                                    <Ionicons
                                        name="business-outline"
                                        size={26}
                                        color="#2563EB"
                                    />
                                </View>

                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemName}>
                                        {item.name}
                                    </Text>

                                    <Text style={styles.itemSku}>
                                        {item.location}
                                    </Text>
                                </View>

                                <Ionicons
                                    name="chevron-forward"
                                    size={22}
                                    color="#94A3B8"
                                />
                            </View>
                        </TouchableOpacity>
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
        backgroundColor: "#EEF4FF",
    },

    loadingText: {
        marginTop: 14,
        fontSize: 15,
        color: "#64748B",
    },

    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
    },

    emptyTitle: {
        marginTop: 20,
        fontSize: 24,
        fontWeight: "700",
        color: "#1E3A8A",
    },

    emptySubtitle: {
        marginTop: 8,
        fontSize: 15,
        color: "#64748B",
        textAlign: "center",
    },

    listContent: {
        padding: 18,
        paddingBottom: 30,
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 18,
        marginBottom: 18,

        shadowColor: "#2563EB",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,

        elevation: 4,
    },

    topRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: "#DBEAFE",
        justifyContent: "center",
        alignItems: "center",
    },

    itemInfo: {
        flex: 1,
        marginLeft: 16,
    },

    itemName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1E293B",
    },

    itemSku: {
        marginTop: 4,
        fontSize: 13,
        color: "#64748B",
    },

    divider: {
        height: 1,
        backgroundColor: "#E2E8F0",
        marginVertical: 18,
    },

    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },

    infoBox: {
        flex: 1,
        backgroundColor: "#EFF6FF",
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
    },

    label: {
        fontSize: 12,
        fontWeight: "700",
        color: "#94A3B8",
        textTransform: "uppercase",
    },

    value: {
        marginTop: 6,
        fontSize: 18,
        fontWeight: "700",
        color: PRIMARY,
    },
});