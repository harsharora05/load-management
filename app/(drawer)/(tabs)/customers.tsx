import { Ionicons } from "@expo/vector-icons";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Stack } from "expo-router";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CustomersScreen() {
    const customers: any[] = [];

    return (
        <SafeAreaView
            style={styles.container}
            edges={["top", "left", "right"]}
        >
            <Stack.Screen
                options={{
                    title: "Customers",
                    headerLeft: () => <DrawerToggleButton />,
                }}
            />

            {customers.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIcon}>
                        <Ionicons
                            name="people-outline"
                            size={55}
                            color="#2563EB"
                        />
                    </View>

                    <Text style={styles.emptyTitle}>
                        No Customers Found
                    </Text>

                    <Text style={styles.emptySubtitle}>
                        Add your first customer to start managing customer records.
                    </Text>

                    <TouchableOpacity style={styles.addButton}>
                        <Ionicons
                            name="add"
                            size={20}
                            color="#FFFFFF"
                        />

                        <Text style={styles.addButtonText}>
                            Add Customer
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={customers}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.card}
                        >
                            <View style={styles.topRow}>
                                <View style={styles.avatar}>
                                    <Ionicons
                                        name="person"
                                        size={26}
                                        color="#2563EB"
                                    />
                                </View>

                                <View style={styles.info}>
                                    <Text style={styles.name}>
                                        {item.name}
                                    </Text>

                                    <View style={styles.infoRow}>
                                        <Ionicons
                                            name="mail-outline"
                                            size={14}
                                            color="#64748B"
                                        />

                                        <Text style={styles.email}>
                                            {item.email}
                                        </Text>
                                    </View>

                                    <View style={styles.infoRow}>
                                        <Ionicons
                                            name="call-outline"
                                            size={14}
                                            color="#64748B"
                                        />

                                        <Text style={styles.phone}>
                                            {item.phone}
                                        </Text>
                                    </View>
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

    listContent: {
        padding: 18,
        paddingBottom: 30,
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 22,
        padding: 18,
        marginBottom: 16,

        shadowColor: PRIMARY,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.08,
        shadowRadius: 10,

        elevation: 5,
    },

    topRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#DBEAFE",
        justifyContent: "center",
        alignItems: "center",
    },

    info: {
        flex: 1,
        marginLeft: 14,
    },

    name: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1E293B",
        marginBottom: 8,
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },

    email: {
        marginLeft: 6,
        color: "#64748B",
        fontSize: 13,
    },

    phone: {
        marginLeft: 6,
        color: PRIMARY,
        fontSize: 14,
        fontWeight: "600",
    },

    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 35,
    },

    emptyIcon: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: "#DBEAFE",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
    },

    emptyTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "#1E3A8A",
    },

    emptySubtitle: {
        textAlign: "center",
        color: "#64748B",
        fontSize: 15,
        marginTop: 10,
        lineHeight: 22,
        marginBottom: 30,
    },

    addButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: PRIMARY,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 14,

        shadowColor: PRIMARY,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,

        elevation: 5,
    },

    addButtonText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 16,
        marginLeft: 8,
    },
});