import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

// Loading screen component
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#667eea" />
      <Text style={styles.loadingText}>Loading BookEasy...</Text>
    </View>
  );
}

// Main navigation component
function RootLayoutNav() {
  const { isAuthenticated, isInitializing } = useAuth();

  // Show loading screen while checking auth status
  if (isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        // User is logged in - show main app
        <>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="booking" />
        </>
      ) : (
        // User is not logged in - show auth screens
        <Stack.Screen name="(auth)" />
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