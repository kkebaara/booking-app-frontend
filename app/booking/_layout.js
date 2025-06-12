import { Stack } from 'expo-router';

export default function BookingLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="select-service" 
        options={{ 
          title: 'Select Service',
          headerStyle: {
            backgroundColor: '#667eea',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      <Stack.Screen 
        name="select-time" 
        options={{ 
          title: 'Select Time',
          headerStyle: {
            backgroundColor: '#667eea',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      <Stack.Screen 
        name="confirm" 
        options={{ 
          title: 'Confirm Booking',
          headerStyle: {
            backgroundColor: '#667eea',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      <Stack.Screen 
        name="success" 
        options={{ 
          title: 'Booking Confirmed',
          headerShown: false,
          gestureEnabled: false,
          // Prevent going back to previous screens after successful booking
          headerBackVisible: false,
        }} 
      />
    </Stack>
  );
}