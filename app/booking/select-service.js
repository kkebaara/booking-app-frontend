// app/booking/select-service.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SERVICES = [
  {
    id: 1,
    name: 'Hair Cut',
    duration: '30 min',
    price: 25,
    description: 'Professional haircut and styling',
    icon: 'cut',
  },
  {
    id: 2,
    name: 'Hair Wash & Blow Dry',
    duration: '45 min',
    price: 35,
    description: 'Complete wash and professional blow dry',
    icon: 'water',
  },
  {
    id: 3,
    name: 'Hair Color',
    duration: '2 hours',
    price: 80,
    description: 'Full hair coloring service',
    icon: 'color-palette',
  },
  {
    id: 4,
    name: 'Beard Trim',
    duration: '20 min',
    price: 15,
    description: 'Professional beard trimming and shaping',
    icon: 'man',
  },
];

export default function SelectServiceScreen() {
  const [selectedService, setSelectedService] = useState(null);
  const router = useRouter();

  const ServiceCard = ({ service }) => (
    <TouchableOpacity
      style={[
        styles.serviceCard,
        selectedService?.id === service.id && styles.selectedCard
      ]}
      onPress={() => setSelectedService(service)}
    >
      <View style={styles.serviceIcon}>
        <Ionicons 
          name={service.icon} 
          size={24} 
          color={selectedService?.id === service.id ? '#fff' : '#667eea'} 
        />
      </View>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{service.name}</Text>
        <Text style={styles.serviceDescription}>{service.description}</Text>
        <View style={styles.serviceDetails}>
          <Text style={styles.serviceDuration}>{service.duration}</Text>
          <Text style={styles.servicePrice}>${service.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleContinue = () => {
    if (selectedService) {
      router.push('/booking/select-time');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Service</Text>
        <Text style={styles.subtitle}>Choose the service you'd like to book</Text>
      </View>

      <FlatList
        data={SERVICES}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ServiceCard service={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.servicesList}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedService && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!selectedService}
        >
          <Text style={styles.continueButtonText}>
            Continue to Time Selection
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  servicesList: {
    padding: 20,
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  selectedCard: {
    borderColor: '#667eea',
    backgroundColor: '#667eea',
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  serviceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceDuration: {
    fontSize: 14,
    color: '#999',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  continueButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});