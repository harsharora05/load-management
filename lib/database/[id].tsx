import { Inventory, inventoryRepository, requestRepository } from "@/lib/database";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InventoryDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [item, setItem] = useState<Inventory | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!id) return;
        const loadItem = async () => {
            setIsLoading(true);
            const data = await inventoryRepository.getById(id);
            setItem(data);
            setIsLoading(false);
        };
        loadItem();
    }, [id]);

    const handleSubmitRequest = async () => {
        const numQuantity = parseInt(quantity, 10);
        if (!item || !id) return;
        if (isNaN(numQuantity) || numQuantity <= 0) {
            Alert.alert("Invalid Quantity", "Please enter a valid number greater than 0.");
            return;
        }

        setIsSubmitting(true);
        try {
            await requestRepository.create({
                inventoryId: id,
                quantity: numQuantity,
            });
            Alert.alert("Success", "Your request has been submitted.", [
                { text: "OK", onPress: () => router.back() }
            ]);
        } catch (error) {
            console.error("Failed to submit request", error);
            Alert.alert("Error", "Could not submit your request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color="#4CAF50" /></View>;
    }

    if (!item) {
        return <View style={styles.centered}><Text>Item not found.</Text></View>;
    }

    return (
        <SafeAreaView style={styles.container} >
            <View style={styles.detailsContainer}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSku}>SKU: {item.sku}</Text>
                <Text style={styles.currentStock}>Current Stock: {item.quantity}</Text>
            </View>

            <View style={styles.requestContainer}>
                <Text style={styles.inputLabel}>Request Quantity</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., 10"
                    keyboardType="number-pad"
                    value={quantity}
                    onChangeText={setQuantity}
                />
                <TouchableOpacity
                    style={[styles.button, isSubmitting && styles.buttonDisabled]}
                    onPress={handleSubmitRequest}
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? <ActivityIndicator color="#fff" />
                        : <Text style={styles.buttonText}>Submit Request</Text>
                    }
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    detailsContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 30,
    },
    itemName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    itemSku: { fontSize: 14, color: '#888', marginTop: 4 },
    currentStock: { fontSize: 16, color: '#555', marginTop: 12, fontWeight: '500' },
    requestContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
    },
    inputLabel: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonDisabled: { backgroundColor: '#A5D6A7' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});