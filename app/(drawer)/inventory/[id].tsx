import { Inventory, requestRepository, warehouseRepository } from "@/lib/database";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetFlatList, BottomSheetView } from "@gorhom/bottom-sheet";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WarehouseDetailScreen() {
    const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
    const router = useRouter();
    const [warehouseInventory, setWarehouseInventory] = useState<Inventory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Bottom Sheet State
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["75%", "90%"], []);
    const [selectedProduct, setSelectedProduct] = useState<Inventory | null>(null);
    const [requestQuantity, setRequestQuantity] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!id) return;
        loadData();
    }, [id]);

    const loadData = useCallback(async () => {
        if (!id) return;
        try {
            setIsLoading(true);
            const wInventory = await warehouseRepository.getInventoryForWarehouse(id);
            setWarehouseInventory(wInventory);
        } catch (error) {
            console.error("Failed to load inventory data", error);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    const handleCreateRequest = async () => {
        const numQuantity = parseInt(requestQuantity, 10);

        if (!selectedProduct || !id) {
            Alert.alert("Error", "Something went wrong.");
            return;
        }
        if (isNaN(numQuantity) || numQuantity <= 0) {
            Alert.alert("Invalid Quantity", "Please enter a valid quantity greater than 0.");
            return;
        }

        setIsSubmitting(true);
        try {
            await requestRepository.create({
                inventoryId: selectedProduct.id,
                warehouseId: id,
                quantity: numQuantity,
            });
            bottomSheetRef.current?.close();
            Alert.alert("Success", `Request for ${numQuantity}x ${selectedProduct.name} has been created.`);
        } catch (error) {
            console.error("Failed to create request", error);
            Alert.alert("Error", "Could not create the request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const openRequestModal = () => {
        setSelectedProduct(null);
        setRequestQuantity("");
        bottomSheetRef.current?.expand();
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.centered}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Loading Inventory...</Text>
            </SafeAreaView>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack.Screen
                options={{
                    title: name || "Warehouse Inventory",
                }}
            />

            <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
                {warehouseInventory.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="cube-outline" size={90} color="#BFDBFE" />
                        <Text style={styles.emptyTitle}>No Inventory Found</Text>
                        <Text style={styles.emptySubtitle}>
                            Items for this warehouse will appear here.
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={warehouseInventory}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent} renderItem={({ item }) => (
                            <View style={styles.card}>
                                <View style={styles.topRow}>
                                    <View style={styles.iconContainer}>
                                        <Ionicons name="cube-outline" size={24} color="#2563EB" />
                                    </View>
                                    <View style={styles.itemInfo}>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                        <Text style={styles.itemSku}>SKU • {item.sku}</Text>
                                    </View>
                                </View>
                                <View style={styles.divider} />
                                <View style={styles.bottomRow}>
                                    <View style={styles.infoBox}>
                                        <Text style={styles.label}>Quantity</Text>
                                        <Text style={styles.value}>{item.quantity}</Text>
                                    </View>
                                    <View style={styles.infoBox}>
                                        <Text style={styles.label}>Price</Text>
                                        <Text style={styles.value}>
                                            {item.price ? `₹${item.price.toFixed(2)}` : "N/A"}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                )}
            </SafeAreaView>

            <TouchableOpacity style={styles.fab} onPress={openRequestModal}>
                <Ionicons name="add" size={32} color="#FFFFFF" />
            </TouchableOpacity>

            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                backgroundStyle={{ backgroundColor: "#f0f0f0" }}
            >
                <BottomSheetView style={styles.sheetContainer}>
                    <Text style={styles.sheetTitle}>Create New Request</Text>

                    {selectedProduct ? (
                        <View style={styles.formContainer}>
                            <Text style={styles.selectedProductText}>
                                Item: <Text style={{ fontWeight: 'bold' }}>{selectedProduct.name}</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter quantity"
                                keyboardType="number-pad"
                                value={requestQuantity}
                                onChangeText={setRequestQuantity}
                            />
                            <TouchableOpacity
                                style={[styles.button, isSubmitting && styles.buttonDisabled]}
                                onPress={handleCreateRequest}
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? <ActivityIndicator color="#fff" />
                                    : <Text style={styles.buttonText}>Submit Request</Text>
                                }
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setSelectedProduct(null)}>
                                <Text style={styles.changeProductText}>Change Product</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <BottomSheetFlatList
                            data={warehouseInventory}
                            keyExtractor={(i) => i.id}
                            renderItem={({ item: product }) => (
                                <TouchableOpacity
                                    style={styles.productItem}
                                    onPress={() => setSelectedProduct(product)}
                                >
                                    <Ionicons name="cube-outline" size={22} color="#64748B" />
                                    <View style={styles.productInfo}>
                                        <Text style={styles.productName}>{product.name}</Text>
                                        <Text style={styles.productSku}>SKU: {product.sku}</Text>
                                    </View>
                                    <Ionicons name="radio-button-off" size={24} color="#2563EB" />
                                </TouchableOpacity>
                            )}
                            contentContainerStyle={styles.sheetContent}
                        />
                    )}
                </BottomSheetView>
            </BottomSheet>
        </GestureHandlerRootView>
    );
}

const PRIMARY = "#2563EB";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEF4FF"
    },
    centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#EEF4FF" },
    loadingText: { marginTop: 14, fontSize: 15, color: "#64748B" },
    emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 40 },
    emptyTitle: { marginTop: 20, fontSize: 24, fontWeight: "700", color: "#1E3A8A" },
    emptySubtitle: { marginTop: 8, fontSize: 15, color: "#64748B", textAlign: "center" },
    listContent: { padding: 18, paddingBottom: 80 }, // Add padding for FAB
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 22,
        padding: 18,
        marginBottom: 18,
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 5,
    },
    topRow: { flexDirection: "row", alignItems: "center" },
    iconContainer: {
        width: 54,
        height: 54,
        borderRadius: 15,
        backgroundColor: "#DBEAFE",
        justifyContent: "center",
        alignItems: "center",
    },
    itemInfo: { flex: 1, marginLeft: 14 },
    itemName: { fontSize: 18, fontWeight: "700", color: "#1E293B" },
    itemSku: { marginTop: 4, color: "#64748B", fontSize: 13 },
    divider: { height: 1, backgroundColor: "#E2E8F0", marginVertical: 18 },
    bottomRow: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
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
    fab: {
        position: 'absolute',
        margin: 16,
        right: 10,
        bottom: 10,
        backgroundColor: PRIMARY,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    // Bottom Sheet Styles
    sheetContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    sheetTitle: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#1E293B",
    },
    sheetContent: {
        paddingBottom: 40,
    },
    productItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#E2E8F0",
    },
    productInfo: {
        flex: 1,
        marginLeft: 15,
    },
    productName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    productSku: {
        fontSize: 13,
        color: "#64748B",
        marginTop: 2,
    },
    formContainer: {
        padding: 10,
    },
    selectedProductText: {
        fontSize: 18,
        color: '#333',
        marginBottom: 16,
        textAlign: 'center'
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        padding: 14,
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center'
    },
    button: {
        backgroundColor: "#2563EB",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    buttonDisabled: {
        backgroundColor: "#A5B4FC",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
    changeProductText: {
        textAlign: 'center',
        color: PRIMARY,
        marginTop: 16,
        fontSize: 15,
        fontWeight: '600'
    }
});