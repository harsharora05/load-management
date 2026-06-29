import { Inventory, inventoryRepository } from "@/lib/database";
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
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InventoryScreen() {
    const [inventory, setInventory] = useState<Inventory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            loadInventory();
        }, [])
    );

    async function loadInventory() {
        try {
            const data = await inventoryRepository.getAll();
            setInventory(data);
        } catch (error) {
            console.error("Failed to load inventory", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function onRefresh() {
        setRefreshing(true);
        await loadInventory();
        setRefreshing(false);
    }

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Loading inventory...</Text>
            </View>
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

            {inventory.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons
                        name="cube-outline"
                        size={90}
                        color="#BFDBFE"
                    />

                    <Text style={styles.emptyTitle}>
                        No Inventory Found
                    </Text>

                    <Text style={styles.emptySubtitle}>
                        Inventory items will appear here.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={inventory}
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
                            activeOpacity={0.85}
                            onPress={() =>
                                router.push(`/inventory/${item.id}`)
                            }
                        >
                            <View style={styles.topRow}>
                                <View style={styles.iconContainer}>
                                    <Ionicons
                                        name="cube-outline"
                                        size={24}
                                        color="#2563EB"
                                    />
                                </View>

                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemName}>
                                        {item.name}
                                    </Text>

                                    <Text style={styles.itemSku}>
                                        SKU • {item.sku}
                                    </Text>
                                </View>

                                <Ionicons
                                    name="chevron-forward"
                                    size={22}
                                    color="#94A3B8"
                                />
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.bottomRow}>
                                <View style={styles.infoBox}>
                                    <Text style={styles.label}>
                                        Quantity
                                    </Text>

                                    <Text style={styles.value}>
                                        {item.quantity}
                                    </Text>
                                </View>

                                <View style={styles.infoBox}>
                                    <Text style={styles.label}>
                                        Price
                                    </Text>

                                    <Text style={styles.value}>
                                        {item.price
                                            ? `₹${item.price.toFixed(2)}`
                                            : "N/A"}
                                    </Text>
                                </View>
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
        marginTop: 8,
        color: "#64748B",
        textAlign: "center",
        fontSize: 15,
    },

    listContent: {
        padding: 18,
        paddingBottom: 30,
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 22,
        padding: 18,
        marginBottom: 18,

        shadowColor: PRIMARY,
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
        alignItems: "center",
    },

    iconContainer: {
        width: 54,
        height: 54,
        borderRadius: 15,
        backgroundColor: "#DBEAFE",
        justifyContent: "center",
        alignItems: "center",
    },

    itemInfo: {
        flex: 1,
        marginLeft: 14,
    },

    itemName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1E293B",
    },

    itemSku: {
        marginTop: 4,
        color: "#64748B",
        fontSize: 13,
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
        backgroundColor: "#F8FAFC",
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
    },

    label: {
        color: "#94A3B8",
        fontSize: 12,
        fontWeight: "700",
        textTransform: "uppercase",
    },

    value: {
        marginTop: 6,
        fontSize: 18,
        fontWeight: "700",
        color: PRIMARY,
    },
});