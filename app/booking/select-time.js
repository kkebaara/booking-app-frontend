import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Generate time slots for the day
const generateTimeSlots = () => {
  const slots = [];
  const startHour = 9; // 9 AM
  const endHour = 18; // 6 PM
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute of [0, 30]) {
      const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const time12 = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
      
      slots.push({
        id: `${hour}-${minute}`,
        time24,
        time12,
        available: Math.random() > 0.3, // Random availability for demo
      });
    }
  }
  
  return slots;
};

// Generate next 14 days
const generateDates = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    dates.push({
      id: i,
      date: date,
      dayName: dayNames[date.getDay()],
      dayNumber: date.getDate(),
      monthName: monthNames[date.getMonth()],
      fullDate: date.toDateString(),
      isToday: i === 0,
      isTomorrow: i === 1,
    });
  }
  
  return dates;
};

export default function SelectTimeScreen() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [dates, setDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const generatedDates = generateDates();
    setDates(generatedDates);
    setSelectedDate(generatedDates[0]); // Select today by default
  }, []);

  useEffect(() => {
    if (selectedDate) {
      // Generate new time slots when date changes
      setTimeSlots(generateTimeSlots());
      setSelectedTime(null); // Reset selected time
    }
  }, [selectedDate]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time) => {
    if (time.available) {
      setSelectedTime(time);
    } else {
      Alert.alert('Unavailable', 'This time slot is not available. Please select another time.');
    }
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      // Store booking data and navigate to confirmation
      router.push('/booking/confirm');
    }
  };

  const DateCard = ({ date, isSelected, onPress }) => (
    <TouchableOpacity
      style={[
        styles.dateCard,
        isSelected && styles.dateCardSelected,
        date.isToday && styles.todayCard,
      ]}
      onPress={() => onPress(date)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.dayName,
        isSelected && styles.selectedText,
        date.isToday && styles.todayText,
      ]}>
        {date.dayName}
      </Text>
      <Text style={[
        styles.dayNumber,
        isSelected && styles.selectedText,
        date.isToday && styles.todayText,
      ]}>
        {date.dayNumber}
      </Text>
      <Text style={[
        styles.monthName,
        isSelected && styles.selectedText,
        date.isToday && styles.todayText,
      ]}>
        {date.monthName}
      </Text>
      {date.isToday && (
        <View style={styles.todayIndicator}>
          <Text style={styles.todayLabel}>Today</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const TimeSlot = ({ time, isSelected, onPress }) => (
    <TouchableOpacity
      style={[
        styles.timeSlot,
        isSelected && styles.timeSlotSelected,
        !time.available && styles.timeSlotUnavailable,
      ]}
      onPress={() => onPress(time)}
      disabled={!time.available}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.timeText,
        isSelected && styles.timeTextSelected,
        !time.available && styles.timeTextUnavailable,
      ]}>
        {time.time12}
      </Text>
      {!time.available && (
        <View style={styles.unavailableOverlay}>
          <Ionicons name="close" size={12} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Select Date & Time</Text>
          <Text style={styles.subtitle}>
            Choose your preferred appointment time
          </Text>
        </View>

        {/* Selected Service Info */}
        <View style={styles.serviceInfo}>
          <View style={styles.serviceCard}>
            <View style={styles.serviceIcon}>
              <Ionicons name="cut" size={24} color="#667eea" />
            </View>
            <View style={styles.serviceDetails}>
              <Text style={styles.serviceName}>Hair Cut</Text>
              <Text style={styles.serviceDuration}>30 minutes • $25</Text>
            </View>
          </View>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.datesContainer}
          >
            {dates.map((date) => (
              <DateCard
                key={date.id}
                date={date}
                isSelected={selectedDate?.id === date.id}
                onPress={handleDateSelect}
              />
            ))}
          </ScrollView>
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Available Times - {selectedDate?.fullDate}
          </Text>
          <View style={styles.timeSlotsGrid}>
            {timeSlots.map((time) => (
              <TimeSlot
                key={time.id}
                time={time}
                isSelected={selectedTime?.id === time.id}
                onPress={handleTimeSelect}
              />
            ))}
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#667eea' }]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#ccc' }]} />
            <Text style={styles.legendText}>Unavailable</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.legendText}>Selected</Text>
          </View>
        </View>

        {/* Summary */}
        {selectedDate && selectedTime && (
          <View style={styles.summary}>
            <View style={styles.summaryCard}>
              <Ionicons name="calendar-outline" size={24} color="#667eea" />
              <View style={styles.summaryText}>
                <Text style={styles.summaryTitle}>Your Appointment</Text>
                <Text style={styles.summaryDetails}>
                  {selectedDate.fullDate} at {selectedTime.time12}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedDate || !selectedTime) && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!selectedDate || !selectedTime}
        >
          <Text style={styles.continueButtonText}>
            Continue to Confirmation
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
  serviceInfo: {
    padding: 20,
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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
  serviceDetails: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  serviceDuration: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  datesContainer: {
    paddingHorizontal: 20,
  },
  dateCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 70,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dateCardSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#4CAF50',
  },
  todayCard: {
    borderColor: '#667eea',
  },
  dayName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  monthName: {
    fontSize: 12,
    color: '#666',
  },
  selectedText: {
    color: '#fff',
  },
  todayText: {
    color: '#667eea',
  },
  todayIndicator: {
    marginTop: 4,
  },
  todayLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#667eea',
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  timeSlot: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    margin: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: (width - 60) / 3,
    alignItems: 'center',
    position: 'relative',
  },
  timeSlotSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  timeSlotUnavailable: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ccc',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  timeTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  timeTextUnavailable: {
    color: '#999',
  },
  unavailableOverlay: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#ff4444',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  summary: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    marginLeft: 12,
    flex: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  summaryDetails: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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