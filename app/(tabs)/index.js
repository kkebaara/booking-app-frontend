import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

// Service categories data
const SERVICE_CATEGORIES = [
  {
    id: 1,
    title: 'Hair Services',
    icon: 'cut',
    color: '#667eea',
    services: ['Hair Cut', 'Hair Wash', 'Hair Color', 'Hair Styling'],
    gradient: ['#667eea', '#764ba2'],
  },
  {
    id: 2,
    title: 'Beauty',
    icon: 'sparkles',
    color: '#f093fb',
    services: ['Facial', 'Manicure', 'Pedicure', 'Eyebrow'],
    gradient: ['#f093fb', '#f5576c'],
  },
  {
    id: 3,
    title: 'Wellness',
    icon: 'flower',
    color: '#4facfe',
    services: ['Massage', 'Spa', 'Aromatherapy', 'Reflexology'],
    gradient: ['#4facfe', '#00f2fe'],
  },
  {
    id: 4,
    title: 'Fitness',
    icon: 'fitness',
    color: '#43e97b',
    services: ['Personal Training', 'Yoga', 'Pilates', 'Nutrition'],
    gradient: ['#43e97b', '#38f9d7'],
  },
];

// Quick actions data
const QUICK_ACTIONS = [
  { id: 1, title: 'Book Now', icon: 'add-circle', color: '#667eea' },
  { id: 2, title: 'My Bookings', icon: 'calendar', color: '#f093fb' },
  { id: 3, title: 'Favorites', icon: 'heart', color: '#4facfe' },
  { id: 4, title: 'History', icon: 'time', color: '#43e97b' },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const handleServiceCategory = (category) => {
    // Navigate to service selection with category filter
    router.push('/booking/select-service');
  };

  const handleQuickAction = (action) => {
    switch (action.id) {
      case 1: // Book Now
        router.push('/booking/select-service');
        break;
      case 2: // My Bookings
        router.push('/(tabs)/bookings');
        break;
      case 3: // Favorites
        Alert.alert('Coming Soon', 'Favorites feature will be available soon!');
        break;
      case 4: // History
        Alert.alert('Coming Soon', 'Booking history feature will be available soon!');
        break;
      default:
        break;
    }
  };

  const ServiceCategoryCard = ({ category }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleServiceCategory(category)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={category.gradient}
        style={styles.categoryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.categoryIcon}>
          <Ionicons name={category.icon} size={32} color="#fff" />
        </View>
        <Text style={styles.categoryTitle}>{category.title}</Text>
        <Text style={styles.categorySubtitle}>
          {category.services.length} services
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const QuickActionButton = ({ action }) => (
    <TouchableOpacity
      style={styles.quickActionButton}
      onPress={() => handleQuickAction(action)}
      activeOpacity={0.7}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
        <Ionicons name={action.icon} size={24} color="#fff" />
      </View>
      <Text style={styles.quickActionText}>{action.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.greetingText}>{greeting}!</Text>
                <Text style={styles.userName}>
                  {user?.firstName || 'Welcome'} {user?.lastName || ''}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.profileButton}
                onPress={() => router.push('/(tabs)/profile')}
              >
                <View style={styles.profileIcon}>
                  <Ionicons name="person" size={24} color="#667eea" />
                </View>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {QUICK_ACTIONS.map((action) => (
              <QuickActionButton key={action.id} action={action} />
            ))}
          </View>
        </View>

        {/* Service Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Book by Category</Text>
          <View style={styles.categoriesGrid}>
            {SERVICE_CATEGORIES.map((category) => (
              <ServiceCategoryCard key={category.id} category={category} />
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityIcon}>
              <Ionicons name="calendar-outline" size={24} color="#667eea" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>No recent bookings</Text>
              <Text style={styles.activitySubtitle}>
                Book your first appointment to see activity here
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.activityButton}
              onPress={() => router.push('/booking/select-service')}
            >
              <Ionicons name="arrow-forward" size={20} color="#667eea" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Popular Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Services</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.popularServicesContainer}
          >
            {['Hair Cut', 'Facial', 'Massage', 'Manicure'].map((service, index) => (
              <TouchableOpacity
                key={index}
                style={styles.popularServiceCard}
                onPress={() => router.push('/booking/select-service')}
              >
                <Text style={styles.popularServiceName}>{service}</Text>
                <Text style={styles.popularServicePrice}>From $25</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    marginBottom: 20,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileButton: {
    padding: 4,
  },
  profileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - 52) / 2,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  categoryGradient: {
    padding: 20,
    minHeight: 120,
    justifyContent: 'center',
  },
  categoryIcon: {
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  categorySubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  activityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f2ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popularServicesContainer: {
    paddingRight: 20,
  },
  popularServiceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  popularServiceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  popularServicePrice: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 20,
  },
});