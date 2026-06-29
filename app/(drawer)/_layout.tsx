import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
    return (
        <Drawer
            screenOptions={{
                headerShown: false,
            }}
        >
            <Drawer.Screen
                name="(tabs)"
                options={{
                    title: "Home",
                }}
            />

            <Drawer.Screen
                name="profile"
                options={{
                    title: "Profile",
                }}
            />

            <Drawer.Screen
                name="settings"
                options={{
                    title: "Settings",
                }}
            />
        </Drawer>
    );
}