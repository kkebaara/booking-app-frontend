import { Stack } from 'expo-router';

export default function BookingLayout() {
  return (
    <Stack>
      <Stack.Screen name="select-time" options={{ title: 'Select Time' }} />
      <Stack.Screen name="confirm" options={{ title: 'Confirm Booking' }} />
    </Stack>
  );
}
