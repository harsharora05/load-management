import { AuthProvider, useAuth } from '@/lib/context/AuthContext';
import { DatabaseProvider } from '@/lib/database';
import { Slot } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  return (
    <DatabaseProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </DatabaseProvider>
  );
}

function RootLayoutNav() {
  const { isSignedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  // Show auth screens if not signed in, otherwise show main app
  return isSignedIn ? <Slot /> : <Slot />;
}
