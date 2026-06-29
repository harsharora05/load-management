import { AuthProvider } from '@/lib/context/AuthContext';
import { DatabaseProvider } from '@/lib/context/DatabaseContext';
import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <DatabaseProvider>
          <Slot />
        </DatabaseProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
