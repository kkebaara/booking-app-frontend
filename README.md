# 📅 BookEasy - Appointment Booking App

A modern, beautiful React Native mobile app for seamless appointment booking and management.

## 🚀 Features

### ✅ Currently Implemented
- **🔐 Authentication System** - Login/register with mock data
- **📱 Beautiful UI** - Modern design with purple gradient theme
- **⚡ Quick Demo Login** - Instant testing with demo account
- **🎯 Navigation** - Smooth transitions between auth and main app
- **📊 State Management** - React Context for user authentication
- **🎨 Professional Design** - Clean, intuitive user interface

### 🚧 Planned Features
- **📅 Booking Flow** - Service selection, time picker, confirmation
- **🏠 Home Dashboard** - Service categories and quick actions
- **📱 Profile Management** - Edit profile, booking history
- **🔔 Notifications** - Appointment reminders
- **🌐 Backend Integration** - Real API connections
- **💳 Payment Processing** - Secure payment handling

## 🛠️ Tech Stack

- **Framework:** React Native with Expo
- **Navigation:** Expo Router (file-based routing)
- **State Management:** React Context + Hooks
- **Styling:** StyleSheet with custom components
- **Icons:** Ionicons from Expo Vector Icons
- **Authentication:** Mock system (ready for backend integration)

## 📁 Project Structure

```
mobile/
├── app/                          # Main app directory (Expo Router)
│   ├── (auth)/                   # Authentication screens
│   │   ├── _layout.js           # Auth navigation layout
│   │   ├── login.js             # Login screen ✅
│   │   └── register.js          # Register screen
│   │
│   ├── (tabs)/                   # Main app tabs
│   │   ├── _layout.js           # Tab navigation
│   │   ├── index.js             # Home tab
│   │   ├── bookings.js          # Bookings tab
│   │   └── profile.js           # Profile tab
│   │
│   ├── contexts/                 # React contexts
│   │   └── AuthContext.js       # Authentication state ✅
│   │
│   └── _layout.js               # Root app layout ✅
│
├── components/                   # Reusable components (planned)
├── services/                     # API services (planned)
├── utils/                        # Utility functions (planned)
└── assets/                       # Images, fonts, etc.
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Installation

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on physical device

## 🧪 Testing the App

### Demo Account Credentials
- **Email:** `demo@bookeasy.com`
- **Password:** `password123`

### Test Authentication Flow
1. **Quick Demo Login** - Tap the purple "Quick Demo Login" button
2. **Manual Login** - Use the demo credentials above
3. **Navigation** - After login, you'll see the main app with tabs

### Available Test Accounts
```javascript
// Account 1 (Primary Demo)
Email: demo@bookeasy.com
Password: password123

// Account 2 (Secondary Test)
Email: test@example.com
Password: test123
```

## 🎨 Design System

### Color Palette
- **Primary:** `#667eea` (Purple Blue)
- **Secondary:** `#764ba2` (Deep Purple)
- **Accent:** `#f093fb` (Pink)
- **Background:** `#f8f9fa` (Light Gray)
- **Text:** `#333` (Dark Gray)

### Typography
- **Headers:** Bold, 28-36px
- **Body:** Regular, 16px
- **Captions:** Medium, 14px

## 📱 Screenshots

_Coming soon - Add screenshots of key screens_

## 🔧 Development

### Key Files to Know
- `app/_layout.js` - Root navigation and auth logic
- `contexts/AuthContext.js` - Authentication state management
- `app/(auth)/login.js` - Login screen with demo functionality
- `app/(tabs)/` - Main app screens after authentication

### Adding New Features
1. **New Screens** - Add files to appropriate `app/` folders
2. **Components** - Create reusable components in `components/`
3. **API Services** - Add backend calls to `services/`
4. **State Management** - Extend contexts or add new ones

### Common Commands
```bash
# Start development server
npx expo start

# Clear cache and restart
npx expo start --clear

# Run on iOS
npx expo start --ios

# Run on Android
npx expo start --android

# Build for production
npx expo build
```

## 🚀 Deployment

### Expo Build Service
```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to app stores
eas submit
```

### Manual Build
```bash
# Generate native code
npx expo eject

# Build with Xcode (iOS) or Android Studio
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Roadmap

### Phase 1: Core Features ✅
- [x] Authentication system
- [x] Basic navigation
- [x] Beautiful UI design
- [ ] Registration flow
- [ ] Password reset

### Phase 2: Booking System 🚧
- [ ] Service selection
- [ ] Date/time picker
- [ ] Booking confirmation
- [ ] Booking management

### Phase 3: Advanced Features 📋
- [ ] Push notifications
- [ ] Payment integration
- [ ] Backend API connection
- [ ] User profiles
- [ ] Booking history

### Phase 4: Polish & Launch 🎯
- [ ] Performance optimization
- [ ] Testing suite
- [ ] App store submission
- [ ] Analytics integration

## 🐛 Known Issues

- [ ] Register screen needs implementation
- [ ] Tab screens need content
- [ ] Backend integration pending
- [ ] Push notifications not configured

## 📚 Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Guide](https://expo.github.io/router/)

## 📞 Support

- Create an issue for bugs or feature requests
- Check existing issues before creating new ones
- Provide detailed reproduction steps for bugs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team** - For the amazing development platform
- **React Native Community** - For continuous innovation
- **Design Inspiration** - Modern mobile app design trends

---

**Built with ❤️ using React Native and Expo**

### 🔗 Quick Links
- [Live Demo](your-expo-link) (when available)
- [Design System](link-to-figma) (when available)
- [API Documentation](link-to-api-docs) (when available)
- [Bug Reports](link-to-issues)

### 📊 Project Status
- **Status:** Active Development
- **Version:** 0.1.0 (Alpha)
- **Last Updated:** June 2025
- **Maintainer:** [Your Name]