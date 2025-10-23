# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

SafetyConnect is a React-based community safety and reporting application built with Vite, TypeScript, and modern UI components. The application allows citizens to report community issues, request emergency assistance, and track the progress of their reports in real-time.

**Original Design**: https://www.figma.com/design/0HlSPqlxpwzqKdICn5Nc57/safecity-connect

## Development Commands

### Essential Commands
- `npm install` - Install all dependencies
- `npm run dev` - Start development server on port 3000
- `npm run build` - Build production bundle (outputs to `build/` directory)

### Development Server
The development server runs on port 3000 with auto-open enabled. The Vite configuration includes extensive alias mapping for all dependencies to ensure proper module resolution.

## Architecture Overview

### Application Structure
- **Single Page Application**: All navigation is client-side using state management
- **Component-Based Architecture**: Modular React components with clear separation of concerns
- **State Management**: Uses React's built-in state management with localStorage persistence
- **No External Backend**: All data is managed through localStorage with encryption utilities

### Core Application Flow
1. **Landing Page** → **Login** → **Dashboard** (User/Staff)
2. **User Flow**: Create reports → Track progress → Emergency SOS
3. **Staff Flow**: Manage reports → Update statuses → Handle SOS alerts → System administration

### Key Components Architecture

#### Page Components (Primary Views)
- `LandingPage.tsx` - Marketing/welcome page with features showcase
- `LoginPage.tsx` - Authentication (accepts any email/password for users, staff@communitycall.com/staff123 for staff)
- `UserDashboard.tsx` - Citizen interface for viewing reports and quick actions
- `StaffDashboard.tsx` - Administrative interface with report management, analytics, and system logs
- `CreateReport.tsx` - Form for submitting community issues with file attachments
- `SOSEmergency.tsx` - Emergency alert system with location detection
- `TrackReports.tsx` - Report tracking with filtering and search functionality

#### Support Components
- `ErrorBoundary.tsx` - React error boundary for graceful error handling
- `NetworkStatus.tsx` - Online/offline status monitoring
- `OfflineMode.tsx` - Offline functionality with data sync capabilities
- `MobileNavigation.tsx` - Mobile-responsive navigation
- `LocationMap.tsx` - Geographic visualization component

#### UI Components
Located in `src/components/ui/` - Complete shadcn/ui component library including:
- Form components (input, select, textarea, checkbox, etc.)
- Layout components (card, dialog, tabs, sidebar, etc.)
- Interactive components (button, dropdown-menu, navigation-menu, etc.)
- Data display components (table, chart, badge, etc.)

### Data Models

#### Core Types (defined in App.tsx)
```typescript
User: {
  id: string;
  name: string;
  email: string;
  type: "user" | "staff";
  // Additional profile fields
}

Report: {
  id: string;
  trackingId: string; // Format: SC-YYYYMM-0001
  title: string;
  category: string;
  description: string;
  status: "Submitted" | "Under Review" | "Assigned" | "In Progress" | "Resolved";
  dateSubmitted: string;
  userId: string;
  userName: string;
  isEmergency: boolean;
  isConfidential: boolean;
  // Additional metadata
}

SOSAlert: {
  id: string; // Format: SOS-{timestamp}-{random}
  userId: string;
  userName: string;
  time: string;
  location: string;
  status: "Active" | "Responded" | "Closed";
}
```

### Storage System (`src/utils/storage.ts`)

The application uses a comprehensive localStorage-based storage system with:

#### Features
- **Data Encryption**: Basic base64 encoding for sensitive data
- **Session Management**: User authentication with automatic session restore
- **Data Persistence**: Reports, SOS alerts, and user data persist across sessions
- **Unique ID Generation**: Sequential tracking IDs for reports, timestamp-based IDs for SOS
- **Data Validation**: Built-in validation for reports and user data
- **Error Logging**: Client-side error logging with context

#### Authentication System
- **Staff Access**: `staff@communitycall.com` / `staff123`
- **User Access**: Any valid email/password combination creates a user account automatically
- **Auto-Registration**: New users are created on-the-fly during login attempts

#### Storage Keys
- `safetyconnect_user` - Current user session
- `safetyconnect_reports` - All reports data
- `safetyconnect_sos_alerts` - SOS alerts data
- `safetyconnect_users_db` - User accounts database
- `safetyconnect_last_report_id` - Sequential report ID counter

### Offline Capabilities

The application includes robust offline functionality:
- **Network Detection**: Automatic online/offline status monitoring
- **Offline Data Storage**: Critical actions stored locally when offline
- **Data Synchronization**: Automatic sync when connection is restored
- **Offline Emergency Alerts**: Emergency SOS functionality works offline

## Technology Stack

### Core Technologies
- **React 18.3.1** with TypeScript
- **Vite 6.3.5** for build tooling and development server
- **Tailwind CSS** for styling (configured in globals.css)
- **Radix UI** for accessible UI primitives

### Key Dependencies
- **UI Components**: Complete shadcn/ui implementation with Radix UI primitives
- **Icons**: Lucide React for consistent iconography
- **Forms**: React Hook Form for form management
- **Charts**: Recharts for data visualization
- **Notifications**: Sonner for toast notifications
- **Theming**: next-themes for dark/light mode support
- **Carousels**: Embla Carousel React for image/content carousels

### Development Dependencies
- **@vitejs/plugin-react-swc** - Fast React refresh with SWC
- **@types/node** - Node.js type definitions

## File Structure Guidelines

### Component Organization
- **Page components** - Top-level views in `src/components/`
- **UI components** - Reusable components in `src/components/ui/`
- **Utility components** - Specialized components (figma/, etc.)
- **Styles** - Global styles in `src/styles/`
- **Utilities** - Helper functions in `src/utils/`

### Naming Conventions
- **Components**: PascalCase (e.g., `UserDashboard.tsx`)
- **UI Components**: kebab-case (e.g., `alert-dialog.tsx`)
- **Utilities**: camelCase (e.g., `storage.ts`)
- **Types**: Defined in `App.tsx` and imported where needed

## Development Guidelines

### State Management
- Use React's built-in state management
- Persist critical data to localStorage via storage utilities
- Use callback functions for parent-child communication
- Implement proper error boundaries for error handling

### Navigation
- Client-side routing using state-based page navigation
- Navigation handled through `onNavigate` callback props
- Mobile-responsive navigation with dedicated mobile component

### Data Flow
1. **App.tsx** - Central state management and data orchestration
2. **Storage utilities** - Data persistence and retrieval
3. **Component props** - Data flow between components
4. **Event handlers** - User interactions and data updates

### Error Handling
- **ErrorBoundary** component wraps the entire application
- **Storage utilities** include error logging functionality
- **Toast notifications** for user-facing error messages
- **Console logging** for development debugging

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Dedicated mobile navigation component
- Responsive grid layouts and component sizing
- Adaptive UI elements for different screen sizes

## Testing Considerations

The application currently does not include a formal testing setup, but when adding tests consider:
- **Component testing** for React components
- **Storage utility testing** for localStorage operations
- **Integration testing** for user workflows
- **Authentication flow testing** for login/logout functionality
- **Offline functionality testing** for network scenarios

## Build Configuration

The Vite configuration includes:
- **Extensive alias mapping** for all dependencies
- **SWC React plugin** for fast development and building
- **ESNext build target** for modern JavaScript features
- **Custom build output directory** (`build/`)
- **Development server on port 3000** with auto-open

## Security Considerations

- **Basic encryption** for sensitive localStorage data
- **No real authentication backend** - prototype-level security only
- **Client-side only** - no server-side validation
- **Development credentials** hardcoded for staff access
- **Base64 encoding** for password storage (not production-ready)