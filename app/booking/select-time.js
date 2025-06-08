import { View, Text, StyleSheet } from 'react-native';

export default function SelectTimeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>⏰ Select Time</Text>
      <Text>Choose your appointment time</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
