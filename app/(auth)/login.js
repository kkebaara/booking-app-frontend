import React, { useState, useRef, useEffect } from 'react';
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
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(50)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const spinValue = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Logo entrance animation
    Animated.spring(logoScale, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // Form entrance animation
    Animated.parallel([
      Animated.timing(formTranslateY, {
        toValue: 0,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(formOpacity, {
        toValue: 1,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setIsLoading(true);

    // Loading spinner animation
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      spinAnimation.stop();
      spinValue.setValue(0);
      Alert.alert('Success', 'Welcome back! 🎉', [
        {
          text: 'Continue',
          onPress: () => {
            // Navigate to main app - you'll implement this later
            console.log('Navigate to main app');
          },
        },
      ]);
    }, 2000);
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#667eea', '#764ba2', '#f093fb']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            {/* Animated Header Section */}
            <View style={styles.header}>
              <Animated.View
                style={[
                  styles.logoContainer,
                  {
                    transform: [{ scale: logoScale }],
                  },
                ]}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                  style={styles.logoGradient}
                >
                  <Ionicons name="calendar" size={50} color="#fff" />
                </LinearGradient>
              </Animated.View>
              
              <Animated.Text
                style={[
                  styles.title,
                  {
                    transform: [{ scale: logoScale }],
                  },
                ]}
              >
                BookEasy
              </Animated.Text>
              
              <Animated.Text
                style={[
                  styles.subtitle,
                  {
                    opacity: formOpacity,
                  },
                ]}
              >
                Your appointments, simplified
              </Animated.Text>
            </View>

            {/* Animated Form Section */}
            <Animated.View
              style={[
                styles.formContainer,
                {
                  transform: [{ translateY: formTranslateY }],
                  opacity: formOpacity,
                },
              ]}
            >
              <View style={styles.card}>
                <Text style={styles.welcomeText}>Welcome Back!</Text>
                <Text style={styles.signInText}>Sign in to continue</Text>

                {/* Email Input with Focus Animation */}
                <Animated.View
                  style={[
                    styles.inputContainer,
                    focusedInput === 'email' && styles.inputContainerFocused,
                  ]}
                >
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={focusedInput === 'email' ? '#667eea' : '#999'}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </Animated.View>

                {/* Password Input with Focus Animation */}
                <Animated.View
                  style={[
                    styles.inputContainer,
                    focusedInput === 'password' && styles.inputContainerFocused,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={focusedInput === 'password' ? '#667eea' : '#999'}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color="#999"
                    />
                  </TouchableOpacity>
                </Animated.View>

                {/* Animated Login Button */}
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                  <TouchableOpacity
                    style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                    onPress={handleLogin}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#667eea', '#764ba2']}
                      style={styles.loginGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      {isLoading ? (
                        <View style={styles.loadingContainer}>
                          <Animated.View
                            style={[
                              styles.spinner,
                              {
                                transform: [{ rotate: spin }],
                              },
                            ]}
                          />
                          <Text style={styles.loginButtonText}>Signing In...</Text>
                        </View>
                      ) : (
                        <Text style={styles.loginButtonText}>Sign In</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>

                {/* Forgot Password */}
                <TouchableOpacity style={styles.forgotPasswordContainer}>
                  <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
                </TouchableOpacity>

                {/* Animated Divider */}
                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Social Login Buttons with Hover Effects */}
                <View style={styles.socialContainer}>
                  <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                    <Ionicons name="logo-google" size={20} color="#DB4437" />
                    <Text style={styles.socialButtonText}>Google</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                    <Ionicons name="logo-apple" size={20} color="#000" />
                    <Text style={styles.socialButtonText}>Apple</Text>
                  </TouchableOpacity>
                </View>

                {/* Sign Up Link with Navigation */}
                <View style={styles.signUpContainer}>
                  <Text style={styles.signUpText}>Don't have an account? </Text>
                  <Link href="/(auth)/register" asChild>
                    <TouchableOpacity>
                      <Text style={styles.signUpLink}>Sign Up</Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>
            </Animated.View>

            {/* Floating Elements for Visual Interest */}
            <View style={styles.floatingElements}>
              <Animated.View style={[styles.floatingCircle, styles.circle1]} />
              <Animated.View style={[styles.floatingCircle, styles.circle2]} />
              <Animated.View style={[styles.floatingCircle, styles.circle3]} />
            </View>
          </KeyboardAvoidingView>
        </LinearGradient>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
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
    marginBottom: 20,
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
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
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 15,
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
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    transition: 'all 0.3s ease',
  },
  inputContainerFocused: {
    borderColor: '#667eea',
    backgroundColor: '#fff',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 8,
  },
  loginButton: {
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
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
  spinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#fff',
    borderTopColor: 'transparent',
    marginRight: 12,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  forgotPasswordText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
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
    fontWeight: '500',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 16,
    paddingVertical: 14,
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
  floatingElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  floatingCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 50,
  },
  circle1: {
    width: 100,
    height: 100,
    top: '10%',
    right: '10%',
  },
  circle2: {
    width: 60,
    height: 60,
    top: '60%',
    left: '5%',
  },
  circle3: {
    width: 80,
    height: 80,
    bottom: '20%',
    right: '20%',
  },
});