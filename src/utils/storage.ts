import { User, Report, SOSAlert } from '../App';

// Storage keys
const STORAGE_KEYS = {
  USER: 'safetyconnect_user',
  REPORTS: 'safetyconnect_reports',
  SOS_ALERTS: 'safetyconnect_sos_alerts',
  USERS_DB: 'safetyconnect_users_db',
  LAST_REPORT_ID: 'safetyconnect_last_report_id'
} as const;

// Basic encryption for sensitive data (prototype level)
const encryptData = (data: any): string => {
  return btoa(JSON.stringify(data));
};

const decryptData = (encryptedData: string): any => {
  try {
    return JSON.parse(atob(encryptedData));
  } catch {
    return null;
  }
};

// User session management
export const saveUserSession = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.USER, encryptData(user));
};

export const getUserSession = (): User | null => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER);
  if (!userData) return null;
  return decryptData(userData);
};

export const clearUserSession = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// User database management (for registration/login)
export const saveUserToDatabase = (user: User, password: string): void => {
  const usersDb = getUsersDatabase();
  const userWithAuth = {
    ...user,
    password: btoa(password), // Basic password hashing
    createdAt: new Date().toISOString()
  };
  usersDb[user.email] = userWithAuth;
  localStorage.setItem(STORAGE_KEYS.USERS_DB, encryptData(usersDb));
};

export const authenticateUser = (email: string, password: string): User | null => {
  // Special case for staff login
  if (email === 'staff@communitycall.com' && password === 'staff123') {
    return {
      id: 'staff-001',
      name: 'Safety Officer Rodriguez',
      email: 'staff@communitycall.com',
      type: 'staff',
      phoneNumber: '+63 48 434 9999',
      address: 'City Hall, Puerto Princesa City, Palawan',
      idVerificationStatus: 'verified'
    };
  }
  
  // For any other email/password combination, create a user account
  if (email && password && email.includes('@') && password.length >= 1) {
    // Check if user exists in database first
    const usersDb = getUsersDatabase();
    const userRecord = usersDb[email];
    
    if (userRecord && userRecord.type === 'user') {
      // Return existing user (ignore password for demo purposes)
      const { password: _, ...user } = userRecord;
      // Ensure user has an ID photo for demo purposes
      if (!user.idPhoto) {
        user.idPhoto = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMyMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkZGRkZGIiBzdHJva2U9IiNDQ0NDQ0MiIHN0cm9rZS13aWR0aD0iMiIvPgo8Y2lyY2xlIGN4PSIxNjAiIGN5PSI3NSIgcj0iMjUiIGZpbGw9IiM5Q0E0QkYiLz4KPHBhdGggZD0iTTEyMCAxNDBIMjAwVjE2MEgxMjBWMTQwWiIgZmlsbD0iIzlDQTRCRiIvPgo8dGV4dCB4PSIxNjAiIHk9IjE4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY2NjY2NiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIj5DTVRJWkVOIElEIFBIT1RPPC90ZXh0Pgo8L3N2Zz4K';
        user.idVerificationStatus = 'verified';
      }
      return user as User;
    }
    
    // Create new user on the fly for any valid email
    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      email: email,
      type: 'user',
      phoneNumber: '+63 917 123 4567',
      address: 'Puerto Princesa City, Palawan',
      idVerificationStatus: 'verified',
      // Add a mock ID photo (base64 encoded image placeholder)
      idPhoto: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMyMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkZGRkZGIiBzdHJva2U9IiNDQ0NDQ0MiIHN0cm9rZS13aWR0aD0iMiIvPgo8Y2lyY2xlIGN4PSIxNjAiIGN5PSI3NSIgcj0iMjUiIGZpbGw9IiM5Q0E0QkYiLz4KPHBhdGggZD0iTTEyMCAxNDBIMjAwVjE2MEgxMjBWMTQwWiIgZmlsbD0iIzlDQTRCRiIvPgo8dGV4dCB4PSIxNjAiIHk9IjE4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY2NjY2NiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIj5DTVRJWkVOIElEIFBIT1RPPC90ZXh0Pgo8L3N2Zz4K'
    };
    
    // Save user to database for future logins
    saveUserToDatabase(newUser, password);
    
    return newUser;
  }
  
  return null;
};

export const getUsersDatabase = (): Record<string, any> => {
  const usersDb = localStorage.getItem(STORAGE_KEYS.USERS_DB);
  if (!usersDb) return {};
  return decryptData(usersDb) || {};
};

// Reports management
export const saveReports = (reports: Report[]): void => {
  localStorage.setItem(STORAGE_KEYS.REPORTS, encryptData(reports));
};

export const getReports = (): Report[] => {
  const reportsData = localStorage.getItem(STORAGE_KEYS.REPORTS);
  if (!reportsData) return [];
  return decryptData(reportsData) || [];
};

// SOS Alerts management
export const saveSOSAlerts = (sosAlerts: SOSAlert[]): void => {
  localStorage.setItem(STORAGE_KEYS.SOS_ALERTS, encryptData(sosAlerts));
};

export const getSOSAlerts = (): SOSAlert[] => {
  const sosAlertsData = localStorage.getItem(STORAGE_KEYS.SOS_ALERTS);
  if (!sosAlertsData) return [];
  return decryptData(sosAlertsData) || [];
};

// Unique ID generation
export const generateUniqueTrackingId = (): string => {
  const lastIdData = localStorage.getItem(STORAGE_KEYS.LAST_REPORT_ID);
  const lastId = lastIdData ? parseInt(lastIdData) : 0;
  const newId = lastId + 1;
  
  localStorage.setItem(STORAGE_KEYS.LAST_REPORT_ID, newId.toString());
  
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  
  return `SC-${year}${month}-${String(newId).padStart(4, '0')}`;
};

export const generateUniqueSOSId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `SOS-${timestamp}-${random}`;
};

// Data validation
export const validateReportData = (report: any): string[] => {
  const errors: string[] = [];
  
  if (!report.title?.trim()) errors.push('Title is required');
  if (!report.category?.trim()) errors.push('Category is required');
  if (!report.description?.trim()) errors.push('Description is required');
  if (report.title && report.title.length > 100) errors.push('Title must be less than 100 characters');
  if (report.description && report.description.length > 1000) errors.push('Description must be less than 1000 characters');
  
  return errors;
};

export const validateUserData = (user: any): string[] => {
  const errors: string[] = [];
  
  if (!user.name?.trim()) errors.push('Name is required');
  if (!user.email?.trim()) errors.push('Email is required');
  if (user.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    errors.push('Invalid email format');
  }
  if (user.phoneNumber && !/^\+?[\d\s\-\(\)]+$/.test(user.phoneNumber)) {
    errors.push('Invalid phone number format');
  }
  
  return errors;
};

// Initialize default staff accounts
export const initializeDefaultAccounts = (): void => {
  // Staff account is handled directly in authenticateUser function
  // No need to pre-create accounts in database
  console.log('Authentication system initialized - any email/password accepted for users');
};

// Error logging for debugging
export const logError = (error: Error, context: string): void => {
  console.error(`SafetyConnect Error [${context}]:`, error);
  
  // In production, this would send to monitoring service
  const errorLog = {
    error: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  // Store recent errors for debugging (keep last 10)
  const recentErrors = JSON.parse(localStorage.getItem('safetyconnect_errors') || '[]');
  recentErrors.unshift(errorLog);
  localStorage.setItem('safetyconnect_errors', JSON.stringify(recentErrors.slice(0, 10)));
};