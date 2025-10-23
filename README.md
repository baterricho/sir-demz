# SafetyConnect - Community Safety Reporting System

![SafetyConnect](https://img.shields.io/badge/SafetyConnect-Community%20Safety-blue)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Latest-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Latest-06B6D4?logo=tailwindcss)

A comprehensive community safety reporting platform that enables citizens to report issues, request emergency services, and track the status of their reports. Built with modern React, TypeScript, and a beautiful UI powered by Radix UI components.

## 🌟 Features

### **For Citizens**
- 📱 **Report Issues**: Submit detailed community safety reports with photos and location data
- 🚨 **SOS Emergency**: One-click emergency alerts with GPS location sharing
- 📍 **Location Services**: Automatic location detection or manual address input
- 📊 **Track Reports**: Monitor the status and progress of submitted reports
- 🔒 **Privacy Options**: Confidential reporting with identity protection
- 📱 **Mobile Responsive**: Optimized experience across all devices
- 🌐 **Multilingual**: English and Tagalog language support
- 👤 **User Profiles**: Comprehensive profile management with activity tracking

### **For Staff**
- 📋 **Staff Dashboard**: Centralized management of all reports and alerts
- 👥 **Citizen Verification**: View citizen ID photos and verification status
- 🎯 **Report Management**: Update statuses, assign staff, and add resolution notes
- 🚑 **Emergency Response**: Real-time SOS alert management with location data
- 📈 **Analytics**: Comprehensive reporting statistics and insights
- 🔍 **Advanced Search**: Filter reports by category, status, date, and location

### **Enhanced User Experience**
- ✏️ **Report Editing**: Users can edit reports before staff review with audit trails
- 🔍 **Advanced Filtering**: Powerful search and filter capabilities
- 📎 **Attachment Preview**: In-app file preview with lightbox functionality
- 📱 **Offline Mode**: Continue using the app even without internet connection
- 🔔 **Real-time Notifications**: Instant updates on report status changes

## 🚀 Live Demo

[Coming Soon - Deployment in Progress]

## 🛠️ Technology Stack

- **Frontend**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 6.3.5 for fast development and optimized builds
- **Styling**: TailwindCSS with custom design system
- **UI Components**: Radix UI for accessible, unstyled components
- **Icons**: Lucide React for beautiful, customizable icons
- **Charts**: Recharts for data visualization
- **Notifications**: Sonner for elegant toast notifications
- **Storage**: LocalStorage for demo data persistence
- **Maps**: Custom LocationMap component
- **Internationalization**: Built-in English/Tagalog support

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/[username]/SafetyConnect-Complete.git
   cd SafetyConnect-Complete
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` (or the port shown in terminal)

5. **Build for production**
   ```bash
   npm run build
   ```

## 👥 Demo Accounts

### Staff Account
- **Email**: `staff@communitycall.com`
- **Password**: `staff123`
- **Access**: Full staff dashboard with all management features

### Citizen Account
- **Email**: Any valid email address (e.g., `citizen@example.com`)
- **Password**: Any password (minimum 1 character for demo)
- **Access**: Citizen dashboard with reporting and tracking features

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components (Radix UI based)
│   ├── AdvancedSearch.tsx    # Search and filter system
│   ├── AttachmentPreview.tsx # File preview with lightbox
│   ├── CreateReport.tsx      # Report creation form
│   ├── EditReport.tsx        # Report editing interface
│   ├── UserProfile.tsx       # User profile management
│   ├── StaffDashboard.tsx    # Staff management interface
│   ├── SOSEmergency.tsx      # Emergency alert system
│   └── ...              # Other components
├── contexts/            # React contexts
│   └── LanguageContext.tsx  # Internationalization context
├── utils/               # Utility functions
│   ├── storage.ts       # LocalStorage management
│   └── locationHotlines.ts  # Emergency hotlines data
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

## 🌟 Recent Improvements

### UI/UX Enhancements
- ✅ **Button Layout**: Moved Cancel/Submit buttons to left alignment
- ✅ **Location Preview**: Removed map preview when GPS location is used
- ✅ **Citizen Photos**: Staff can now view citizen ID photos in report modals

### Feature Additions
- ✅ **Report Editing**: Full edit functionality with version control
- ✅ **Advanced Search**: Comprehensive filtering and search capabilities
- ✅ **User Profiles**: Complete profile management system
- ✅ **File Previews**: In-app attachment viewing with lightbox

## 🔧 Configuration

### Vite Configuration
The project uses a custom Vite configuration with:
- React SWC plugin for fast refresh
- Path aliases for clean imports
- Optimized build settings
- Development server configuration

### Deployment Configuration
- **Vercel**: `vercel.json` for Vercel deployments
- **Netlify**: `netlify.toml` for Netlify deployments

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📋 Development Guidelines

### Code Style
- TypeScript for type safety
- ESLint and Prettier for code consistency
- Component-based architecture
- Responsive design principles
- Accessibility best practices

### Testing
- Component testing with React Testing Library
- E2E testing capabilities
- Manual testing procedures documented

## 🚀 Roadmap

### Upcoming Features
- [ ] Real backend integration with REST APIs
- [ ] PostgreSQL database implementation
- [ ] Real-time WebSocket connections
- [ ] Push notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] AI-powered report categorization
- [ ] Integration with government systems

### Performance Optimizations
- [ ] Code splitting for better loading times
- [ ] Service worker for offline functionality
- [ ] Image optimization and lazy loading
- [ ] Caching strategies

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, feature requests, or bug reports, please open an issue on GitHub.

## 🙏 Acknowledgments

- Original Figma design: [SafeCity Connect](https://www.figma.com/design/0HlSPqlxpwzqKdICn5Nc57/safecity-connect)
- Radix UI for accessible component primitives
- Tailwind CSS for utility-first styling
- Lucide React for beautiful icons
- Vite for lightning-fast development experience

---

**SafetyConnect** - Empowering communities through technology 🏘️✨
  