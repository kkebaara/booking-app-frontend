// app/_layout.js - ULTRA MINIMAL
import { Stack } from 'expo-router';

export default function RootLayout() {
  console.log('🚀 RootLayout rendering - MINIMAL VERSION');
  
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="test" />
    </Stack>
  );
}