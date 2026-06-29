import { AuthProvider } from '@/lib/context/AuthContext';
import { DatabaseProvider } from '@/lib/context/DatabaseContext';
import { db } from '@/lib/database';
import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  useEffect(() => {
    db.initialize();
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DatabaseProvider>
        <AuthProvider>
          <Slot />
        </AuthProvider>
      </DatabaseProvider>
    </GestureHandlerRootView>
  );
}
