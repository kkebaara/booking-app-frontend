// app/(auth)/forgot-password.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Reset Link Sent',
        'If an account with this email exists, you will receive a password reset link shortly.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }, 2000);
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Ionicons name="lock-closed" size={60} color="#fff" />
            </View>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you a link to reset your password
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.card}>
              <Text style={styles.welcomeText}>Forgot Password?</Text>
              <Text style={styles.instructionText}>
                No worries, we'll send you reset instructions
              </Text>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#667eea" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>

              {/* Reset Button */}
              <TouchableOpacity 
                style={[styles.resetButton, isLoading && styles.resetButtonDisabled]}
                onPress={handleResetPassword}
                disabled={isLoading}
              >
                <Text style={styles.resetButtonText}>
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Text>
              </TouchableOpacity>

              {/* Back to Login */}
              <View style={styles.loginContainer}>
                <Ionicons name="arrow-back" size={16} color="#667eea" />
                <Link href="/(auth)/login" asChild>
                  <TouchableOpacity style={styles.loginLink}>
                    <Text style={styles.loginText}>Back to Login</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
    zIndex: 1,
    padding: 8,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  resetButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  resetButtonDisabled: {
    opacity: 0.7,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginLink: {
    marginLeft: 8,
  },
  loginText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
});