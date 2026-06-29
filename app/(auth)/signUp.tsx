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

export default function SignUpScreen() {
    const router = useRouter();
    const { signUp } = useAuth();

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>(
        {}
    );

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

    const validate = () => {
        const err: Record<string, string> = {};

        if (!formData.name.trim())
            err.name = "Name is required";

        if (!formData.email.trim())
            err.email = "Email is required";

        if (!formData.phone.trim())
            err.phone = "Phone number is required";

        if (!formData.password)
            err.password = "Password is required";

        if (
            formData.password !==
            formData.confirmPassword
        ) {
            err.confirmPassword =
                "Passwords do not match";
        }

        setErrors(err);

        return Object.keys(err).length === 0;
    };

    const handleSignUp = async () => {
        if (!validate()) return;

        try {
            setLoading(true);

            await signUp(
                formData.name,
                formData.email,
                formData.password,
                formData.phone
            );

            Alert.alert(
                "Success",
                "Account created successfully!",
                [
                    {
                        text: "OK",
                        onPress: () =>
                            router.replace(
                                "/(drawer)/(tabs)/Dashboard"
                            ),
                    },
                ]
            );
        } catch {
            Alert.alert(
                "Error",
                "Unable to create account."
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
                        : undefined
                }
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scroll}
                >
                    {/* Header */}

                    <View style={styles.header}>
                        <View style={styles.logo}>
                            <Ionicons
                                name="person-add"
                                size={42}
                                color="#2563EB"
                            />
                        </View>

                        <Text style={styles.appName}>
                            Load Management
                        </Text>

                        <Text style={styles.welcome}>
                            Create Account
                        </Text>

                        <Text style={styles.subTitle}>
                            Create your account to continue
                        </Text>
                    </View>

                    {/* Card */}

                    <View style={styles.card}>
                        {/* Name */}

                        <Text style={styles.label}>
                            Full Name
                        </Text>

                        <View
                            style={[
                                styles.inputContainer,
                                errors.name &&
                                styles.inputError,
                            ]}
                        >
                            <Ionicons
                                name="person-outline"
                                size={20}
                                color="#64748B"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Enter your name"
                                placeholderTextColor="#94A3B8"
                                value={formData.name}
                                onChangeText={(text) =>
                                    handleInputChange(
                                        "name",
                                        text
                                    )
                                }
                            />
                        </View>

                        {errors.name && (
                            <Text style={styles.error}>
                                {errors.name}
                            </Text>
                        )}

                        {/* Email */}

                        <Text
                            style={[
                                styles.label,
                                { marginTop: 18 },
                            ]}
                        >
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
                                placeholderTextColor="#94A3B8"
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

                        {/* Phone */}

                        <Text
                            style={[
                                styles.label,
                                { marginTop: 18 },
                            ]}
                        >
                            Phone Number
                        </Text>

                        <View
                            style={[
                                styles.inputContainer,
                                errors.phone &&
                                styles.inputError,
                            ]}
                        >
                            <Ionicons
                                name="call-outline"
                                size={20}
                                color="#64748B"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Enter phone number"
                                placeholderTextColor="#94A3B8"
                                keyboardType="phone-pad"
                                value={formData.phone}
                                onChangeText={(text) =>
                                    handleInputChange(
                                        "phone",
                                        text
                                    )
                                }
                            />
                        </View>

                        {errors.phone && (
                            <Text style={styles.error}>
                                {errors.phone}
                            </Text>
                        )}

                        {/* Password */}

                        <Text
                            style={[
                                styles.label,
                                { marginTop: 18 },
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
                                placeholder="Enter password"
                                placeholderTextColor="#94A3B8"
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
                                    size={22}
                                    color="#64748B"
                                />
                            </TouchableOpacity>
                        </View>

                        {errors.password && (
                            <Text style={styles.error}>
                                {errors.password}
                            </Text>
                        )}

                        {/* Confirm Password */}

                        <Text
                            style={[
                                styles.label,
                                { marginTop: 18 },
                            ]}
                        >
                            Confirm Password
                        </Text>

                        <View
                            style={[
                                styles.inputContainer,
                                errors.confirmPassword &&
                                styles.inputError,
                            ]}
                        >
                            <Ionicons
                                name="shield-checkmark-outline"
                                size={20}
                                color="#64748B"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Confirm password"
                                placeholderTextColor="#94A3B8"
                                secureTextEntry={
                                    !showConfirmPassword
                                }
                                value={
                                    formData.confirmPassword
                                }
                                onChangeText={(text) =>
                                    handleInputChange(
                                        "confirmPassword",
                                        text
                                    )
                                }
                            />

                            <TouchableOpacity
                                onPress={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                            >
                                <Ionicons
                                    name={
                                        showConfirmPassword
                                            ? "eye-off-outline"
                                            : "eye-outline"
                                    }
                                    size={22}
                                    color="#64748B"
                                />
                            </TouchableOpacity>
                        </View>

                        {errors.confirmPassword && (
                            <Text style={styles.error}>
                                {errors.confirmPassword}
                            </Text>
                        )}

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSignUp}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text
                                    style={styles.buttonText}
                                >
                                    Create Account
                                </Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                Already have an account?
                            </Text>

                            <TouchableOpacity
                                onPress={() =>
                                    router.push(
                                        "/(auth)/signIn"
                                    )
                                }
                            >
                                <Text style={styles.signIn}>
                                    Sign In
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

    scroll: {
        flexGrow: 1,
    },

    header: {
        height: 240,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
        backgroundColor: PRIMARY,
    },

    logo: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,

        marginBottom: 18,
    },

    appName: {
        color: "#FFFFFF",
        fontSize: 28,
        fontWeight: "700",
    },

    welcome: {
        marginTop: 18,
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "700",
    },

    subTitle: {
        marginTop: 6,
        color: "#DBEAFE",
        fontSize: 15,
    },

    card: {
        flex: 1,
        backgroundColor: "#FFFFFF",

        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,

        paddingHorizontal: 24,
        paddingTop: 30,
        paddingBottom: 40,

        marginTop: -10,
    },

    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1E293B",
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
        fontSize: 12,
        color: "#EF4444",
    },

    button: {
        height: 56,

        marginTop: 30,

        backgroundColor: PRIMARY,

        borderRadius: 15,

        justifyContent: "center",
        alignItems: "center",

        shadowColor: PRIMARY,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "700",
    },

    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",

        marginTop: 25,
    },

    footerText: {
        color: "#64748B",
        fontSize: 15,
    },

    signIn: {
        color: PRIMARY,
        fontWeight: "700",
        fontSize: 15,
        marginLeft: 5,
    },
});