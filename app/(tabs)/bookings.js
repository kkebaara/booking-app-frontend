import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

// Mock booking data
const MOCK_BOOKINGS = [
  {
    id: 1,
    service: 'Hair Cut',
    provider: 'Downtown Salon',
    date: '2024-06-15',
    time: '2:00 PM',
    duration: '30 min',
    price: 25,
    status: 'confirmed',
    icon: 'cut',
    color: '#667eea',
    address: '123 Main St, Downtown',
  },
  {
    id: 2,
    service: 'Facial Treatment',
    provider: 'Beauty Spa',
    date: '2024-06-18',
    time: '10:30 AM',
    duration: '60 min',
    price: 80,
    status: 'pending',
    icon: 'sparkles',
    color: '#f093fb',
    address: '456 Oak Ave, Midtown',
  },
  {
    id: 3,
    service: 'Deep Tissue Massage',
    provider: 'Wellness Center',
    date: '2024-06-20',
    time: '4:00 PM',
    duration: '90 min',
    price: 120,
    status: 'confirmed',
    icon: 'flower',
    color: '#4facfe',
    address: '789 Pine Rd, Uptown',
  },
  {
    id: 4,
    service: 'Hair Color',
    provider: 'Style Studio',
    date: '2024-05-28',
    time: '11:00 AM',
    duration: '2 hours',
    price: 85,
    status: 'completed',
    icon: 'color-palette',
    color: '#43e97b',
    address: '321 Elm St, Downtown',
  },
  {
    id: 5,
    service: 'Manicure',
    provider: 'Nail Boutique',
    date: '2024-05-25',
    time: '3:30 PM',
    duration: '45 min',
    price: 35,
    status: 'completed',
    icon: 'hand-left',
    color: '#ff6b6b',
    address: '654 Maple Dr, Westside',
  },
];

const STATUS_CONFIG = {
  confirmed: {
    label: 'Confirmed',
    color: '#4CAF50',
    backgroundColor: '#E8F5E8',
    icon: 'checkmark-circle',
  },
  pending: {
    label: 'Pending',
    color: '#FF9800',
    backgroundColor: '#FFF3E0',
    icon: 'time',
  },
  completed: {
    label: 'Completed',
    color: '#2196F3',
    backgroundColor: '#E3F2FD',
    icon: 'checkmark-done',
  },
  cancelled: {
    label: 'Cancelled',
    color: '#F44336',
    backgroundColor: '#FFEBEE',
    icon: 'close-circle',
  },
};

export default function BookingsScreen() {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    // Simulate API call
    setTimeout(() => {
      setBookings(MOCK_BOOKINGS);
    }, 500);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadBookings();
      setRefreshing(false);
    }, 1000);
  };

  const getFilteredBookings = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    switch (activeTab) {
      case 'upcoming':
        return bookings.filter(booking => 
          booking.date >= todayStr && 
          (booking.status === 'confirmed' || booking.status === 'pending')
        );
      case 'past':
        return bookings.filter(booking => 
          booking.date < todayStr || booking.status === 'completed'
        );
      case 'all':
        return bookings;
      default:
        return bookings;
    }
  };

  const handleBookingAction = (booking, action) => {
    switch (action) {
      case 'cancel':
        Alert.alert(
          'Cancel Booking',
          `Are you sure you want to cancel your ${booking.service} appointment?`,
          [
            { text: 'No', style: 'cancel' },
            { 
              text: 'Yes, Cancel', 
              style: 'destructive',
              onPress: () => {
                // Update booking status
                setBookings(prev => 
                  prev.map(b => 
                    b.id === booking.id 
                      ? { ...b, status: 'cancelled' }
                      : b
                  )
                );
                Alert.alert('Cancelled', 'Your booking has been cancelled.');
              }
            },
          ]
        );
        break;
      case 'reschedule':
        Alert.alert('Reschedule', 'Reschedule feature coming soon!');
        break;
      case 'details':
        Alert.alert(
          booking.service,
          `Provider: ${booking.provider}\nDate: ${booking.date}\nTime: ${booking.time}\nDuration: ${booking.duration}\nPrice: $${booking.price}\nAddress: ${booking.address}`
        );
        break;
      case 'rebook':
        router.push('/booking/select-service');
        break;
      default:
        break;
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (dateStr === today.toISOString().split('T')[0]) {
      return 'Today';
    } else if (dateStr === tomorrow.toISOString().split('T')[0]) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const BookingCard = ({ booking }) => {
    const statusConfig = STATUS_CONFIG[booking.status];
    const isUpcoming = booking.status === 'confirmed' || booking.status === 'pending';
    const isCompleted = booking.status === 'completed';

    return (
      <TouchableOpacity
        style={styles.bookingCard}
        onPress={() => handleBookingAction(booking, 'details')}
        activeOpacity={0.8}
      >
        <View style={styles.bookingHeader}>
          <View style={[styles.serviceIcon, { backgroundColor: `${booking.color}20` }]}>
            <Ionicons name={booking.icon} size={24} color={booking.color} />
          </View>
          <View style={styles.bookingInfo}>
            <Text style={styles.serviceName}>{booking.service}</Text>
            <Text style={styles.providerName}>{booking.provider}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.backgroundColor }]}>
            <Ionicons name={statusConfig.icon} size={14} color={statusConfig.color} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>

        <View style={styles.bookingDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{formatDate(booking.date)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{booking.time}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="card-outline" size={16} color="#666" />
            <Text style={styles.detailText}>${booking.price}</Text>
          </View>
        </View>

        {isUpcoming && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => handleBookingAction(booking, 'reschedule')}
            >
              <Ionicons name="calendar" size={16} color="#667eea" />
              <Text style={styles.secondaryButtonText}>Reschedule</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => handleBookingAction(booking, 'cancel')}
            >
              <Ionicons name="close" size={16} color="#F44336" />
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {isCompleted && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => handleBookingAction(booking, 'rebook')}
            >
              <Ionicons name="repeat" size={16} color="#fff" />
              <Text style={styles.primaryButtonText}>Book Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const TabButton = ({ title, isActive, onPress }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTabButton]}
      onPress={onPress}
    >
      <Text style={[styles.tabButtonText, isActive && styles.activeTabButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const filteredBookings = getFilteredBookings();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.headerTitle}>My Bookings</Text>
          <Text style={styles.headerSubtitle}>
            Manage your appointments
          </Text>
        </LinearGradient>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TabButton
          title="Upcoming"
          isActive={activeTab === 'upcoming'}
          onPress={() => setActiveTab('upcoming')}
        />
        <TabButton
          title="Past"
          isActive={activeTab === 'past'}
          onPress={() => setActiveTab('past')}
        />
        <TabButton
          title="All"
          isActive={activeTab === 'all'}
          onPress={() => setActiveTab('all')}
        />
      </View>

      {/* Bookings List */}
      <ScrollView
        style={styles.bookingsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="calendar-outline" size={48} color="#ccc" />
            </View>
            <Text style={styles.emptyTitle}>
              {activeTab === 'upcoming' ? 'No Upcoming Bookings' : 
               activeTab === 'past' ? 'No Past Bookings' : 'No Bookings'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'upcoming' 
                ? 'Book your next appointment to see it here'
                : 'Your booking history will appear here'}
            </Text>
            <TouchableOpacity
              style={styles.bookNowButton}
              onPress={() => router.push('/booking/select-service')}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.bookNowGradient}
              >
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.bookNowText}>Book Now</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.bookingsContainer}>
            {filteredBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </View>
        )}

        {/* Quick Book Button */}
        {filteredBookings.length > 0 && (
          <View style={styles.quickBookContainer}>
            <TouchableOpacity
              style={styles.quickBookButton}
              onPress={() => router.push('/booking/select-service')}
            >
              <Ionicons name="add" size={24} color="#fff" />
              <Text style={styles.quickBookText}>Book Another Appointment</Text>
            </TouchableOpacity>
          </View>
        )}

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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: '#667eea',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabButtonText: {
    color: '#fff',
  },
  bookingsList: {
    flex: 1,
  },
  bookingsContainer: {
    paddingHorizontal: 20,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bookingInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  providerName: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  bookingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 0.48,
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#667eea',
    flex: 1,
  },
  secondaryButton: {
    backgroundColor: '#f0f2ff',
    borderWidth: 1,
    borderColor: '#667eea',
  },
  cancelButton: {
    backgroundColor: '#ffebee',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  secondaryButtonText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  cancelButtonText: {
    color: '#F44336',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  bookNowButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bookNowGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  bookNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  quickBookContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  quickBookButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  quickBookText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 20,
  },
});