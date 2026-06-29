import { useAuth } from "@/lib/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
    const router = useRouter();
    const { signIn } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            newErrors.email = "Enter a valid email";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (
        field: string,
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    const handleSignIn = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);

            await signIn(
                formData.email,
                formData.password
            );

            router.replace("/(drawer)/(tabs)/Dashboard");
        } catch (err) {
            Alert.alert(
                "Error",
                "Failed to sign in."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={
                    Platform.OS === "ios"
                        ? "padding"
                        : "height"
                }
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                >
                    {/* Header */}

                    <View style={styles.header}>
                        <View style={styles.logo}>
                            <Ionicons
                                name="cube-outline"
                                size={42}
                                color="#2563EB"
                            />
                        </View>

                        <Text style={styles.title}>
                            Load Management
                        </Text>

                        <Text style={styles.subtitle}>
                            Welcome Back
                        </Text>

                        <Text style={styles.description}>
                            Sign in to continue
                        </Text>
                    </View>

                    {/* Card */}

                    <View style={styles.card}>
                        {/* Email */}

                        <Text style={styles.label}>
                            Email
                        </Text>

                        <View
                            style={[
                                styles.inputContainer,
                                errors.email &&
                                styles.inputError,
                            ]}
                        >
                            <Ionicons
                                name="mail-outline"
                                size={20}
                                color="#64748B"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={formData.email}
                                onChangeText={(text) =>
                                    handleInputChange(
                                        "email",
                                        text
                                    )
                                }
                            />
                        </View>

                        {errors.email && (
                            <Text style={styles.error}>
                                {errors.email}
                            </Text>
                        )}

                        {/* Password */}

                        <Text
                            style={[
                                styles.label,
                                { marginTop: 20 },
                            ]}
                        >
                            Password
                        </Text>

                        <View
                            style={[
                                styles.inputContainer,
                                errors.password &&
                                styles.inputError,
                            ]}
                        >
                            <Ionicons
                                name="lock-closed-outline"
                                size={20}
                                color="#64748B"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Enter your password"
                                secureTextEntry={
                                    !showPassword
                                }
                                value={formData.password}
                                onChangeText={(text) =>
                                    handleInputChange(
                                        "password",
                                        text
                                    )
                                }
                            />

                            <TouchableOpacity
                                onPress={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >
                                <Ionicons
                                    name={
                                        showPassword
                                            ? "eye-off-outline"
                                            : "eye-outline"
                                    }
                                    size={20}
                                    color="#64748B"
                                />
                            </TouchableOpacity>
                        </View>

                        {errors.password && (
                            <Text style={styles.error}>
                                {errors.password}
                            </Text>
                        )}

                        {/* Forgot */}

                        <TouchableOpacity
                            style={styles.forgotContainer}
                        >
                            <Text style={styles.forgot}>
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>

                        {/* Button */}

                        <TouchableOpacity
                            style={styles.button}
                            disabled={loading}
                            onPress={handleSignIn}
                        >
                            {loading ? (
                                <ActivityIndicator
                                    color="#fff"
                                />
                            ) : (
                                <Text
                                    style={styles.buttonText}
                                >
                                    Sign In
                                </Text>
                            )}
                        </TouchableOpacity>

                        {/* Sign Up */}

                        <View
                            style={styles.signupContainer}
                        >
                            <Text style={styles.signupText}>
                                Don't have an account?
                            </Text>

                            <TouchableOpacity
                                onPress={() =>
                                    router.push(
                                        "/(auth)/signUp"
                                    )
                                }
                            >
                                <Text
                                    style={styles.signupLink}
                                >
                                    Sign Up
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const PRIMARY = "#2563EB";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEF4FF",
    },

    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 24,
    },

    header: {
        alignItems: "center",
        marginBottom: 35,
    },

    logo: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: "#DBEAFE",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 18,

        shadowColor: PRIMARY,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#1E3A8A",
    },

    subtitle: {
        marginTop: 8,
        fontSize: 22,
        fontWeight: "600",
        color: "#1E293B",
    },

    description: {
        marginTop: 6,
        fontSize: 15,
        color: "#64748B",
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 22,

        shadowColor: PRIMARY,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.08,
        shadowRadius: 10,

        elevation: 5,
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
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 55,
    },

    inputError: {
        borderColor: "#EF4444",
    },

    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: "#1E293B",
    },

    error: {
        marginTop: 6,
        marginLeft: 4,
        color: "#EF4444",
        fontSize: 12,
    },

    forgotContainer: {
        alignSelf: "flex-end",
        marginTop: 14,
    },

    forgot: {
        color: PRIMARY,
        fontWeight: "600",
        fontSize: 14,
    },

    button: {
        backgroundColor: PRIMARY,
        borderRadius: 14,
        height: 55,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 28,

        shadowColor: PRIMARY,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.18,
        shadowRadius: 8,

        elevation: 5,
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "700",
    },

    signupContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 25,
    },

    signupText: {
        color: "#64748B",
        fontSize: 15,
    },

    signupLink: {
        color: PRIMARY,
        fontSize: 15,
        fontWeight: "700",
        marginLeft: 5,
    },
});