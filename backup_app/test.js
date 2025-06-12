// app/test.js - NEW MINIMAL TEST
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TestScreen() {
  console.log('✅ TestScreen rendering');
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 ROUTING WORKS!</Text>
      <Text style={styles.subtitle}>If you see this, basic routing is functional</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#667eea',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});