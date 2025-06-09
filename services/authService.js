// services/authService.js
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword
  } from 'firebase/auth';
  import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
  import { auth, db } from '../config/firebase';
  
  class AuthService {
    // Listen to auth state changes
    onAuthStateChange(callback) {
      return onAuthStateChanged(auth, async (user) => {
        if (user) {
          // User is signed in, get additional profile data
          const userProfile = await this.getUserProfile(user.uid);
          callback({
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
            ...userProfile
          });
        } else {
          // User is signed out
          callback(null);
        }
      });
    }
  
    // Register new user
    async register({ email, password, firstName, lastName, phone }) {
      try {
        // Create user account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        // Update display name
        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`
        });
  
        // Save additional profile data to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          firstName,
          lastName,
          phone: phone || '',
          email,
          createdAt: new Date(),
          updatedAt: new Date(),
          bookingCount: 0,
          preferences: {
            notifications: true,
            emailUpdates: true
          }
        });
  
        return {
          success: true,
          user: {
            uid: user.uid,
            email: user.email,
            firstName,
            lastName,
            phone
          },
          message: 'Account created successfully!'
        };
      } catch (error) {
        console.error('Registration error:', error);
        
        let message = 'Registration failed';
        switch (error.code) {
          case 'auth/email-already-in-use':
            message = 'An account with this email already exists';
            break;
          case 'auth/weak-password':
            message = 'Password should be at least 6 characters';
            break;
          case 'auth/invalid-email':
            message = 'Please enter a valid email address';
            break;
          default:
            message = error.message;
        }
        
        throw new Error(message);
      }
    }
  
    // Login user
    async login(email, password) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        // Get additional profile data
        const userProfile = await this.getUserProfile(user.uid);
  
        return {
          success: true,
          user: {
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
            ...userProfile
          },
          message: 'Login successful!'
        };
      } catch (error) {
        console.error('Login error:', error);
        
        let message = 'Login failed';
        switch (error.code) {
          case 'auth/user-not-found':
            message = 'No account found with this email';
            break;
          case 'auth/wrong-password':
            message = 'Incorrect password';
            break;
          case 'auth/invalid-email':
            message = 'Please enter a valid email address';
            break;
          case 'auth/too-many-requests':
            message = 'Too many failed attempts. Please try again later';
            break;
          default:
            message = error.message;
        }
        
        throw new Error(message);
      }
    }
  
    // Logout user
    async logout() {
      try {
        await signOut(auth);
        return {
          success: true,
          message: 'Logged out successfully'
        };
      } catch (error) {
        console.error('Logout error:', error);
        throw new Error('Logout failed');
      }
    }
  
    // Get user profile from Firestore
    async getUserProfile(uid) {
      try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          return userDoc.data();
        } else {
          return {};
        }
      } catch (error) {
        console.error('Error getting user profile:', error);
        return {};
      }
    }
  
    // Update user profile
    async updateProfile(updates) {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');
  
        // Update display name in Firebase Auth if provided
        if (updates.firstName || updates.lastName) {
          await updateProfile(user, {
            displayName: `${updates.firstName || ''} ${updates.lastName || ''}`.trim()
          });
        }
  
        // Update profile data in Firestore
        await updateDoc(doc(db, 'users', user.uid), {
          ...updates,
          updatedAt: new Date()
        });
  
        return {
          success: true,
          message: 'Profile updated successfully!'
        };
      } catch (error) {
        console.error('Profile update error:', error);
        throw new Error(error.message || 'Profile update failed');
      }
    }
  
    // Send password reset email
    async sendPasswordReset(email) {
      try {
        await sendPasswordResetEmail(auth, email);
        return {
          success: true,
          message: 'Password reset email sent! Check your inbox.'
        };
      } catch (error) {
        console.error('Password reset error:', error);
        
        let message = 'Password reset failed';
        switch (error.code) {
          case 'auth/user-not-found':
            message = 'No account found with this email';
            break;
          case 'auth/invalid-email':
            message = 'Please enter a valid email address';
            break;
          default:
            message = error.message;
        }
        
        throw new Error(message);
      }
    }
  
    // Change password
    async changePassword(currentPassword, newPassword) {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');
  
        // Re-authenticate user before changing password
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
  
        // Update password
        await updatePassword(user, newPassword);
  
        return {
          success: true,
          message: 'Password updated successfully!'
        };
      } catch (error) {
        console.error('Change password error:', error);
        
        let message = 'Password change failed';
        switch (error.code) {
          case 'auth/wrong-password':
            message = 'Current password is incorrect';
            break;
          case 'auth/weak-password':
            message = 'New password should be at least 6 characters';
            break;
          default:
            message = error.message;
        }
        
        throw new Error(message);
      }
    }
  
    // Get current user
    getCurrentUser() {
      return auth.currentUser;
    }
  
    // Check if user is logged in
    isLoggedIn() {
      return !!auth.currentUser;
    }
  }
  
  export default new AuthService();