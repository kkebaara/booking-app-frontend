// app/_layout.js
import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

// Loading screen component
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#667eea" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

// Main navigation component
function RootLayoutNav() {
  const { isAuthenticated, isInitializing } = useAuth();

  console.log('Auth state:', { isAuthenticated, isInitializing });

  if (isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </>
      ) : (
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}

// Root layout with auth provider
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#667eea',
    fontWeight: '500',
  },
});