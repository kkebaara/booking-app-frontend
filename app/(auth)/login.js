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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register, sendPasswordReset, isLoading } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing Information', 'Please enter both email and password');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(email.trim().toLowerCase(), password);
      if (result.success) {
        // Navigation happens automatically due to auth state change
        console.log('Login successful!');
      }
    } catch (error) {
      Alert.alert(
        'Login Failed', 
        error.message,
        [
          { text: 'OK' },
          error.message.includes('No account found') ? {
            text: 'Create Account',
            onPress: () => handleCreateAccount()
          } : null
        ].filter(Boolean)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAccount = () => {
    Alert.alert(
      'Create Account?',
      'Would you like to create a new account with this email?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, Create Account', onPress: () => autoRegister() }
      ]
    );
  };

  const autoRegister = async () => {
    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);
    try {
      // Extract name from email for quick signup
      const emailName = email.split('@')[0];
      const firstName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
      
      const result = await register({
        email: email.trim().toLowerCase(),
        password,
        firstName,
        lastName: 'User',
        phone: ''
      });

      if (result.success) {
        Alert.alert(
          'Account Created!', 
          'Your account has been created and you are now logged in.',
          [{ text: 'Welcome!', style: 'default' }]
        );
      }
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@bookeasy.com');
    setPassword('demo123456');
    
    setIsSubmitting(true);
    try {
      // Try to login with demo account
      const result = await login('demo@bookeasy.com', 'demo123456');
      if (result.success) {
        Alert.alert('Demo Login', 'Welcome to the demo! 🎉');
      }
    } catch (error) {
      // If demo account doesn't exist, create it
      if (error.message.includes('No account found') || error.message.includes('user-not-found')) {
        try {
          await register({
            email: 'demo@bookeasy.com',
            password: 'demo123456',
            firstName: 'Demo',
            lastName: 'User',
            phone: '+1 (555) 123-4567'
          });
          Alert.alert('Demo Account Created', 'Demo account created and you are now logged in! 🚀');
        } catch (registerError) {
          Alert.alert('Demo Setup Failed', 'Could not create demo account. Please try manual login.');
        }
      } else {
        Alert.alert('Demo Login Failed', error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      Alert.alert(
        'Enter Email', 
        'Please enter your email address first, then tap "Forgot Password" again.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    Alert.alert(
      'Reset Password',
      `Send password reset instructions to ${email}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Reset Email', onPress: () => sendResetEmail() }
      ]
    );
  };

  const sendResetEmail = async () => {
    try {
      const result = await sendPasswordReset(email.trim().toLowerCase());
      if (result.success) {
        Alert.alert(
          'Reset Email Sent!', 
          'Check your email for password reset instructions.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Reset Failed', error.message);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = email.trim() && password && isValidEmail(email);
  const isProcessing = isLoading || isSubmitting;

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="calendar" size={60} color="#fff" />
            </View>
            <Text style={styles.title}>BookEasy</Text>
            <Text style={styles.subtitle}>Your appointments, simplified</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            <View style={styles.card}>
              <Text style={styles.welcomeText}>Welcome Back!</Text>
              <Text style={styles.signInText}>Sign in to continue</Text>

              {/* Quick Demo Login */}
              <TouchableOpacity 
                style={[styles.demoBanner, isProcessing && styles.disabled]}
                onPress={handleDemoLogin}
                disabled={isProcessing}
              >
                <Ionicons name="flash" size={20} color="#667eea" />
                <Text style={styles.demoText}>
                  {isProcessing ? 'Setting up demo...' : 'Quick Demo Login'}
                </Text>
                {isProcessing ? (
                  <ActivityIndicator size="small" color="#667eea" />
                ) : (
                  <Ionicons name="chevron-forward" size={16} color="#667eea" />
                )}
              </TouchableOpacity>

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
                  autoCorrect={false}
                  editable={!isProcessing}
                />
                {email && isValidEmail(email) && (
                  <Ionicons name="checkmark-circle" size={20} color="#4ade80" />
                )}
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#667eea" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!isProcessing}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                  disabled={isProcessing}
                >
                  <Ionicons 
                    name={showPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="#999" 
                  />
                </TouchableOpacity>
              </View>

              {/* Sign In Button */}
              <TouchableOpacity 
                style={[
                  styles.loginButton, 
                  (!isFormValid || isProcessing) && styles.loginButtonDisabled
                ]}
                onPress={handleLogin}
                disabled={!isFormValid || isProcessing}
              >
                {isProcessing ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={styles.loginButtonText}>Signing In...</Text>
                  </View>
                ) : (
                  <Text style={styles.loginButtonText}>Sign In</Text>
                )}
              </TouchableOpacity>

              {/* Demo Credentials Info */}
              <View style={styles.credentialsContainer}>
                <Text style={styles.credentialsTitle}>💡 Demo Credentials:</Text>
                <Text style={styles.credentialsText}>Email: demo@bookeasy.com</Text>
                <Text style={styles.credentialsText}>Password: demo123456</Text>
                <Text style={styles.credentialsNote}>
                  Or enter any email to create a new account instantly!
                </Text>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity 
                style={styles.forgotPasswordContainer}
                onPress={handleForgotPassword}
                disabled={isProcessing}
              >
                <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Login Buttons */}
              <View style={styles.socialContainer}>
                <TouchableOpacity 
                  style={[styles.socialButton, isProcessing && styles.disabled]}
                  disabled={isProcessing}
                >
                  <Ionicons name="logo-google" size={20} color="#DB4437" />
                  <Text style={styles.socialButtonText}>Google</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.socialButton, isProcessing && styles.disabled]}
                  disabled={isProcessing}
                >
                  <Ionicons name="logo-apple" size={20} color="#000" />
                  <Text style={styles.socialButtonText}>Apple</Text>
                </TouchableOpacity>
              </View>

              {/* Sign Up Link */}
              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account? </Text>
                <Link href="/(auth)/register" asChild>
                  <TouchableOpacity disabled={isProcessing}>
                    <Text style={[styles.signUpLink, isProcessing && styles.disabled]}>
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>

              {/* Real Backend Status */}
              <View style={styles.statusContainer}>
                <View style={styles.statusIndicator} />
                <Text style={styles.statusText}>Connected to Firebase Backend</Text>
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
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    paddingHorizontal: 40,
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  signInText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f2ff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#667eea',
  },
  demoText: {
    color: '#667eea',
    fontWeight: '600',
    marginHorizontal: 8,
    fontSize: 14,
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
  eyeIcon: {
    padding: 5,
  },
  loginButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    opacity: 0.6,
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  credentialsContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#667eea',
  },
  credentialsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#667eea',
    marginBottom: 4,
  },
  credentialsText: {
    fontSize: 11,
    color: '#666',
    fontFamily: 'monospace',
  },
  credentialsNote: {
    fontSize: 10,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 4,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 20,
    color: '#999',
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 0.48,
    backgroundColor: '#f8f9fa',
  },
  socialButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signUpText: {
    color: '#666',
    fontSize: 14,
  },
  signUpLink: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ade80',
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.6,
  },
});