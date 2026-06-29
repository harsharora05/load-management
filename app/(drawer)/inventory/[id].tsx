import { Inventory, inventoryRepository, requestRepository } from "@/lib/database";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InventoryDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const [item, setItem] = useState<Inventory | null>(null);
    const [quantity, setQuantity] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!id) return;

        loadInventoryItem();
    }, [id]);

    async function loadInventoryItem() {
        try {
            setIsLoading(true);

            const data = await inventoryRepository.getById(id!);

            setItem(data);
        } catch (error) {
            console.error(error);

            Alert.alert(
                "Error",
                "Unable to load inventory item."
            );
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSubmitRequest() {
        if (!item || !id) return;

        const qty = Number(quantity);

        if (!qty || qty <= 0) {
            Alert.alert(
                "Invalid Quantity",
                "Please enter a valid quantity."
            );
            return;
        }

        if (qty > item.quantity) {
            Alert.alert(
                "Insufficient Stock",
                `Only ${item.quantity} item(s) are available.`
            );
            return;
        }

        try {
            setIsSubmitting(true);

            await requestRepository.create({
                inventoryId: id,
                quantity: qty,
            });

            Alert.alert(
                "Success",
                "Your request has been submitted.",
                [
                    {
                        text: "OK",
                        onPress: () => router.back(),
                    },
                ]
            );
        } catch (error) {
            console.error(error);

            Alert.alert(
                "Error",
                "Failed to submit request."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return (
            <SafeAreaView style={styles.loader}>
                <ActivityIndicator
                    size="large"
                    color="#2563EB"
                />

                <Text style={styles.loadingText}>
                    Loading inventory...
                </Text>
            </SafeAreaView>
        );
    }

    if (!item) {
        return (
            <SafeAreaView style={styles.loader}>
                <Ionicons
                    name="cube-outline"
                    size={70}
                    color="#93C5FD"
                />

                <Text style={styles.notFoundTitle}>
                    Item Not Found
                </Text>

                <Text style={styles.notFoundSubtitle}>
                    The requested inventory item could not be found.
                </Text>

                <TouchableOpacity
                    style={styles.backHomeButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backHomeText}>
                        Go Back
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView
            style={styles.container}
            edges={["top", "left", "right", "bottom"]}
        >
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />

            {/* Header */}

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons
                        name="arrow-back"
                        size={22}
                        color="#2563EB"
                    />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    Inventory Details
                </Text>

                <View style={{ width: 44 }} />
            </View>

            {/* Inventory Card */}

            <View style={styles.inventoryCard}>
                <View style={styles.iconContainer}>
                    <Ionicons
                        name="cube-outline"
                        size={40}
                        color="#2563EB"
                    />
                </View>

                <Text style={styles.itemName}>
                    {item.name}
                </Text>

                <Text style={styles.sku}>
                    SKU • {item.sku}
                </Text>

                <View style={styles.stockCard}>
                    <Text style={styles.stockLabel}>
                        Available Stock
                    </Text>

                    <Text style={styles.stockValue}>
                        {item.quantity}
                    </Text>
                </View>
            </View>

            {/* Request Card */}

            <View style={styles.requestCard}>
                <Text style={styles.sectionTitle}>
                    Request Inventory
                </Text>

                <Text style={styles.label}>
                    Quantity
                </Text>

                <View style={styles.inputContainer}>
                    <Ionicons
                        name="calculator-outline"
                        size={20}
                        color="#64748B"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Enter quantity"
                        placeholderTextColor="#94A3B8"
                        keyboardType="number-pad"
                        value={quantity}
                        onChangeText={setQuantity}
                    />
                </View>

                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        isSubmitting &&
                        styles.submitDisabled,
                    ]}
                    disabled={isSubmitting}
                    onPress={handleSubmitRequest}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <>
                            <Ionicons
                                name="send-outline"
                                size={20}
                                color="#FFFFFF"
                            />

                            <Text style={styles.submitText}>
                                Submit Request
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const PRIMARY = "#2563EB";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEF4FF",
        paddingHorizontal: 20,
    },

    loader: {
        flex: 1,
        backgroundColor: "#EEF4FF",
        justifyContent: "center",
        alignItems: "center",
    },

    loadingText: {
        marginTop: 15,
        fontSize: 15,
        color: "#64748B",
    },

    notFoundTitle: {
        marginTop: 20,
        fontSize: 24,
        fontWeight: "700",
        color: "#1E293B",
    },

    notFoundSubtitle: {
        marginTop: 8,
        textAlign: "center",
        color: "#64748B",
        fontSize: 15,
        paddingHorizontal: 35,
    },

    backHomeButton: {
        marginTop: 30,
        backgroundColor: PRIMARY,
        borderRadius: 15,
        paddingHorizontal: 30,
        paddingVertical: 14,
    },

    backHomeText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 10,
        marginBottom: 20,
    },

    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
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

    headerTitle: {
        flex: 1,
        textAlign: "center",
        fontSize: 22,
        fontWeight: "700",
        color: "#1E293B",
        marginHorizontal: 12,
    },

    inventoryCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 22,
        padding: 24,
        alignItems: "center",

        shadowColor: PRIMARY,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },

    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#DBEAFE",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 18,
    },

    itemName: {
        fontSize: 24,
        fontWeight: "700",
        color: "#1E293B",
        textAlign: "center",
    },

    sku: {
        marginTop: 6,
        color: "#64748B",
        fontSize: 15,
    },

    stockCard: {
        marginTop: 22,
        width: "100%",
        backgroundColor: "#EFF6FF",
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: "center",
    },

    stockLabel: {
        color: "#64748B",
        fontSize: 13,
        fontWeight: "600",
    },

    stockValue: {
        marginTop: 8,
        fontSize: 30,
        fontWeight: "700",
        color: PRIMARY,
    },

    requestCard: {
        marginTop: 22,
        backgroundColor: "#FFFFFF",
        borderRadius: 22,
        padding: 22,

        shadowColor: PRIMARY,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1E293B",
        marginBottom: 22,
    },

    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 8,
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        height: 56,
        backgroundColor: "#F8FAFC",
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        paddingHorizontal: 16,
    },

    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: "#1E293B",
    },

    submitButton: {
        marginTop: 28,
        height: 56,
        backgroundColor: PRIMARY,
        borderRadius: 16,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",

        shadowColor: PRIMARY,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },

    submitDisabled: {
        opacity: 0.7,
    },

    submitText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
        marginLeft: 8,
    },
});